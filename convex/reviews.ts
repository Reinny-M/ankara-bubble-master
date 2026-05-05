import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createReview = mutation({
  args: {
    orderId: v.id("orders"),
    clientId: v.id("users"),
    tailorId: v.id("users"),
    rating: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5)
    ),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("reviews", {
      orderId: args.orderId,
      clientId: args.clientId,
      tailorId: args.tailorId,
      rating: args.rating,
      comment: args.comment,
      createdAt: Date.now(),
    });

    return reviewId;
  },
});

export const getReviewsByTailor = query({
  args: { tailorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.tailorId))
      .collect();
  },
});

export const getReviewsByOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
  },
});

export const getAverageRating = query({
  args: { tailorId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.tailorId))
      .collect();

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    return { average, count: reviews.length };
  },
});
