import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSession = mutation({
  args: {
    clerkId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("sessions", {
      clerkId: args.clerkId,
      token: args.token,
      expiresAt: args.expiresAt,
      isActive: true,
    });
  },
});

export const endSession = mutation({
  args: { clerkId: v.string(), token: v.string() },
  handler: async (ctx: any, args: any) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
      .filter((q: any) => q.and(q.eq(q.field("token"), args.token), q.eq(q.field("isActive"), true)))
      .first();

    if (session) {
      await ctx.db.patch(session._id, { isActive: false });
    }
  },
});

export const endAllUserSessions = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx: any, args: any) => {
    const activeSessions = await ctx.db
      .query("sessions")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .collect();

    // End all active sessions for this user
    for (const session of activeSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    return activeSessions.length;
  },
});

export const getActiveSessionByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    return await ctx.db
      .query("sessions")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
      .filter((q: any) => q.and(q.eq(q.field("isActive"), true), q.gt(q.field("expiresAt"), now)))
      .first();
  },
});
