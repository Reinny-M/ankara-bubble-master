import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

    const role = (user.unsafeMetadata?.role as string) || 'client'

    await convex.mutation(api.users.createUser, {
      clerkId: user.id,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      email,
      role: role as 'client' | 'tailor' | 'admin',
      avatar: user.imageUrl ?? undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
  }
}
