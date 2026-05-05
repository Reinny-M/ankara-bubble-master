import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save a new AI recommendation
 */
export const saveRecommendation = mutation({
  args: {
    userId: v.id("users"),
    measurements: v.object({
      height: v.number(),
      bust: v.number(),
      waist: v.number(),
      hips: v.number(),
      age: v.optional(v.number()),
      gender: v.optional(v.string()),
    }),
    bodyType: v.string(),
    bodyTypeConfidence: v.string(),
    occasion: v.string(),
    colorPreferences: v.optional(v.array(v.string())),
    stylePreferences: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    designRecommendations: v.array(v.string()),
    designCategories: v.array(v.string()),
    fabricSuggestions: v.array(v.string()),
    stylingTips: v.array(v.string()),
    recommendedDesigns: v.array(v.object({
      name: v.string(),
      description: v.string(),
    })),
    colorCombinations: v.array(v.object({
      name: v.string(),
      description: v.string(),
    })),
    accessories: v.array(v.object({
      name: v.string(),
      description: v.string(),
    })),
    stylingNotes: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const recommendationId = await ctx.db.insert("aiRecommendations", {
      userId: args.userId,
      measurements: args.measurements,
      bodyType: args.bodyType,
      bodyTypeConfidence: args.bodyTypeConfidence,
      occasion: args.occasion,
      colorPreferences: args.colorPreferences,
      stylePreferences: args.stylePreferences,
      budget: args.budget,
      designRecommendations: args.designRecommendations,
      designCategories: args.designCategories,
      fabricSuggestions: args.fabricSuggestions,
      stylingTips: args.stylingTips,
      recommendedDesigns: args.recommendedDesigns,
      colorCombinations: args.colorCombinations,
      accessories: args.accessories,
      stylingNotes: args.stylingNotes,
      createdAt: now,
      updatedAt: now,
    });

    return recommendationId;
  },
});

/**
 * Get all recommendations for a user
 */
export const getRecommendationsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/**
 * Get a specific recommendation by ID
 */
export const getRecommendation = query({
  args: { recommendationId: v.id("aiRecommendations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.recommendationId);
  },
});

/**
 * Get recommendations by body type
 */
export const getRecommendationsByBodyType = query({
  args: { bodyType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiRecommendations")
      .withIndex("by_body_type", (q) => q.eq("bodyType", args.bodyType))
      .order("desc")
      .collect();
  },
});

/**
 * Update an existing recommendation
 */
export const updateRecommendation = mutation({
  args: {
    recommendationId: v.id("aiRecommendations"),
    measurements: v.optional(v.object({
      height: v.number(),
      bust: v.number(),
      waist: v.number(),
      hips: v.number(),
      age: v.optional(v.number()),
      gender: v.optional(v.string()),
    })),
    bodyType: v.optional(v.string()),
    bodyTypeConfidence: v.optional(v.string()),
    occasion: v.optional(v.string()),
    colorPreferences: v.optional(v.array(v.string())),
    stylePreferences: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    designRecommendations: v.optional(v.array(v.string())),
    designCategories: v.optional(v.array(v.string())),
    fabricSuggestions: v.optional(v.array(v.string())),
    stylingTips: v.optional(v.array(v.string())),
    recommendedDesigns: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
    }))),
    colorCombinations: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
    }))),
    accessories: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
    }))),
    stylingNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { recommendationId, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates: any = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error("No updates provided");
    }
    
    // Add updatedAt timestamp
    cleanUpdates.updatedAt = Date.now();
    
    await ctx.db.patch(recommendationId, cleanUpdates);
    
    return await ctx.db.get(recommendationId);
  },
});

/**
 * Delete a recommendation
 */
export const deleteRecommendation = mutation({
  args: { recommendationId: v.id("aiRecommendations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.recommendationId);
    return { success: true };
  },
});

/**
 * Get recent recommendations (for analytics)
 */
export const getRecentRecommendations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("aiRecommendations")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

/**
 * Get recommendations count by body type (for analytics)
 */
export const getBodyTypeStats = query({
  handler: async (ctx) => {
    const recommendations = await ctx.db
      .query("aiRecommendations")
      .collect();
    
    const stats: Record<string, number> = {};
    
    recommendations.forEach(rec => {
      stats[rec.bodyType] = (stats[rec.bodyType] || 0) + 1;
    });
    
    return stats;
  },
});
