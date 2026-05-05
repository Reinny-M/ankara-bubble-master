import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { api } from '../../../../convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  switch (eventType) {
    case 'user.created':
    case 'user.updated':
      const { id, first_name, last_name, email_addresses, image_url, unsafe_metadata } = evt.data
      const email = email_addresses[0]?.email_address
      const role = (unsafe_metadata as any)?.role || 'client' // Default role for Ankara Bubble

      if (!email) {
        return new Response('Error: Email not found for user', { status: 400 })
      }

      try {
        await convex.mutation(api.users.createUser, {
          clerkId: id,
          firstName: first_name ?? undefined,
          lastName: last_name ?? undefined,
          email: email,
          role: role,
          avatar: image_url ?? undefined,
        })

        // User created/updated successfully
      } catch (error) {
        console.error('Error creating/updating user in Convex:', error)
        // If user already exists (e.g., on user.updated event), try to update
        if (eventType === 'user.updated') {
          try {
            const existingUser = await convex.query(api.users.getUser, { clerkId: id })
            if (existingUser) {
              await convex.mutation(api.users.updateUser, {
                clerkId: id,
                firstName: first_name ?? undefined,
                lastName: last_name ?? undefined,
                email: email,
                role: role,
                avatar: image_url ?? undefined,
              })
              // User updated successfully
            }
          } catch (patchError) {
            console.error('Error patching existing user:', patchError)
          }
        }
      }
      break

    case 'session.created':
      const { user_id, id: sessionId, expire_at } = evt.data
      await convex.mutation(api.sessions.createSession, {
        clerkId: user_id,
        token: sessionId,
        expiresAt: expire_at,
      })
      // Session created successfully
      break

    case 'session.ended':
      const { user_id: endUserId, id: endSessionId } = evt.data
      await convex.mutation(api.sessions.endSession, {
        clerkId: endUserId,
        token: endSessionId,
      })
      // Session ended successfully
      break

    case 'user.deleted':
      const { id: deletedUserId } = evt.data
      if (deletedUserId) {
        try {
          // First get the user by clerkId to get the Convex userId and role
          const userToDelete = await convex.query(api.users.getUser, { clerkId: deletedUserId })
          if (userToDelete) {
            // Use appropriate deletion method based on user role
            if (userToDelete.role === 'tailor') {
              await convex.mutation(api.users.deleteTailorAccount, { userId: userToDelete._id })
              console.log('Tailor account and all related data deleted successfully')
            } else if (userToDelete.role === 'client') {
              await convex.mutation(api.users.deleteClientAccount, { userId: userToDelete._id })
              console.log('Client account and all related data deleted successfully')
            } else {
              // For admins, use the basic deleteUser
              await convex.mutation(api.users.deleteUser, { userId: userToDelete._id })
              console.log('Admin account deleted successfully')
            }
          }
        } catch (error) {
          console.error('Error deleting user in Convex:', error)
        }
      }
      break

    default:
      // Unhandled webhook event type
      break
  }

  return new Response('', { status: 200 })
}
