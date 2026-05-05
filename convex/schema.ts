import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("client"), v.literal("tailor"), v.literal("admin")),
    avatar: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    isVerified: v.boolean(),
    // Tailor-specific fields
    bio: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    experience: v.optional(v.number()), // years of experience
    // Business settings
    acceptingOrders: v.optional(v.boolean()),
    minOrderAmount: v.optional(v.number()),
    avgTurnaroundDays: v.optional(v.number()),
    mpesaNumber: v.optional(v.string()),
    bankAccount: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_verified", ["isVerified"]),

  designs: defineTable({
    title: v.string(),
    description: v.string(),
    image: v.string(), // This will store the Convex file storage ID
    price: v.number(),
    category: v.string(),
    occasion: v.string(),
    bodyType: v.string(),
    fabric: v.string(),
    tailorId: v.id("users"),
    isActive: v.boolean(),
    // Additional design fields
    materials: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tailor", ["tailorId"])
    .index("by_category", ["category"])
    .index("by_occasion", ["occasion"])
    .index("by_body_type", ["bodyType"])
    .index("by_active", ["isActive"])
    .index("by_price", ["price"]),

  orders: defineTable({
    clientId: v.id("users"),
    tailorId: v.id("users"),
    designId: v.id("designs"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    amount: v.number(),
    measurements: v.object({
      height: v.number(),
      bust: v.number(),
      waist: v.number(),
      hips: v.number(),
    }),
    notes: v.optional(v.string()),
    estimatedDelivery: v.optional(v.number()),
    actualDelivery: v.optional(v.number()),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("refunded")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_tailor", ["tailorId"])
    .index("by_status", ["status"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_created", ["createdAt"]),

  reviews: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_tailor", ["tailorId"])
    .index("by_order", ["orderId"])
    .index("by_rating", ["rating"])
    .index("by_created", ["createdAt"]),

  sessions: defineTable({
    clerkId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_active", ["isActive"])
    .index("by_expires", ["expiresAt"]),

  aiRecommendations: defineTable({
    userId: v.id("users"),
    // Body measurements
    measurements: v.object({
      height: v.number(),
      bust: v.number(),
      waist: v.number(),
      hips: v.number(),
      age: v.optional(v.number()),
      gender: v.optional(v.string()),
    }),
    // Analysis results
    bodyType: v.string(), // e.g., "Hourglass", "Rectangle", etc.
    bodyTypeConfidence: v.string(), // "programmatic" or "ai-refined"
    
    // Style preferences
    occasion: v.string(),
    colorPreferences: v.optional(v.array(v.string())),
    stylePreferences: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    
    // AI recommendations
    designRecommendations: v.array(v.string()),
    designCategories: v.array(v.string()),
    fabricSuggestions: v.array(v.string()),
    stylingTips: v.array(v.string()),
    
    // Detailed style recommendations
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
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_body_type", ["bodyType"])
    .index("by_created", ["createdAt"]),
});
