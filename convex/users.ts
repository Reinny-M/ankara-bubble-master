import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    role: v.union(v.literal("client"), v.literal("tailor"), v.literal("admin")),
    avatar: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create name from firstName and lastName
    const name = [args.firstName, args.lastName].filter(Boolean).join(" ") || "User";

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      name: name,
      role: args.role,
      avatar: args.avatar,
      phone: args.phone,
      location: args.location,
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.optional(v.union(v.literal("client"), v.literal("tailor"), v.literal("admin"))),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
    // Tailor-specific fields
    bio: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    experience: v.optional(v.number()),
    // Business settings
    acceptingOrders: v.optional(v.boolean()),
    minOrderAmount: v.optional(v.number()),
    avgTurnaroundDays: v.optional(v.number()),
    mpesaNumber: v.optional(v.string()),
    bankAccount: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update name if firstName or lastName changed
    let name = user.name;
    if (args.firstName !== undefined || args.lastName !== undefined) {
      const firstName = args.firstName !== undefined ? args.firstName : user.firstName;
      const lastName = args.lastName !== undefined ? args.lastName : user.lastName;
      name = [firstName, lastName].filter(Boolean).join(" ") || "User";
    }

    await ctx.db.patch(user._id, {
      ...(args.firstName !== undefined && { firstName: args.firstName }),
      ...(args.lastName !== undefined && { lastName: args.lastName }),
      ...(args.email !== undefined && { email: args.email }),
      ...(args.avatar !== undefined && { avatar: args.avatar }),
      ...(args.role !== undefined && { role: args.role }),
      phone: args.phone, // Always update phone
      location: args.location, // Always update location
      ...(args.isVerified !== undefined && { isVerified: args.isVerified }),
      // Tailor-specific fields - always update these
      bio: args.bio, // Always update bio
      specialties: args.specialties, // Always update specialties
      ...(args.experience !== undefined && { experience: args.experience }),
      // Business settings
      ...(args.acceptingOrders !== undefined && { acceptingOrders: args.acceptingOrders }),
      ...(args.minOrderAmount !== undefined && { minOrderAmount: args.minOrderAmount }),
      ...(args.avgTurnaroundDays !== undefined && { avgTurnaroundDays: args.avgTurnaroundDays }),
      ...(args.mpesaNumber !== undefined && { mpesaNumber: args.mpesaNumber }),
      ...(args.bankAccount !== undefined && { bankAccount: args.bankAccount }),
      name: name,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.delete(args.userId);
    return args.userId;
  },
});

export const deleteTailorAccount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "tailor") {
      throw new Error("This mutation is only for tailor accounts");
    }

    // Delete all designs created by this tailor
    const designs = await ctx.db
      .query("designs")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.userId))
      .collect();

    for (const design of designs) {
      // Delete the associated image file from Convex storage
      if (design.image) {
        try {
          await ctx.storage.delete(design.image);
        } catch (error) {
          console.error('Failed to delete design image:', error);
          // Don't throw error, just log it - the design deletion should still proceed
        }
      }
      // Delete the design record
      await ctx.db.delete(design._id);
    }

    // Delete all orders where this tailor is involved
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.userId))
      .collect();

    for (const order of orders) {
      await ctx.db.delete(order._id);
    }

    // Delete all reviews for this tailor
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.userId))
      .collect();

    for (const review of reviews) {
      await ctx.db.delete(review._id);
    }

    // Delete all AI recommendations for this user
    const recommendations = await ctx.db
      .query("aiRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const recommendation of recommendations) {
      await ctx.db.delete(recommendation._id);
    }

    // Delete all sessions for this user
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Finally, delete the user record
    await ctx.db.delete(args.userId);
    
    return {
      userId: args.userId,
      deletedDesigns: designs.length,
      deletedOrders: orders.length,
      deletedReviews: reviews.length,
      deletedRecommendations: recommendations.length,
      deletedSessions: sessions.length,
    };
  },
});

export const deleteClientAccount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "client") {
      throw new Error("This mutation is only for client accounts");
    }

    // Delete all orders where this client is involved
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_client", (q) => q.eq("clientId", args.userId))
      .collect();

    for (const order of orders) {
      await ctx.db.delete(order._id);
    }

    // Delete all reviews by this client
    const reviews = await ctx.db
      .query("reviews")
      .collect();

    const clientReviews = reviews.filter(review => review.clientId === args.userId);
    for (const review of clientReviews) {
      await ctx.db.delete(review._id);
    }

    // Delete all AI recommendations for this user
    const recommendations = await ctx.db
      .query("aiRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const recommendation of recommendations) {
      await ctx.db.delete(recommendation._id);
    }

    // Delete all sessions for this user
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Finally, delete the user record
    await ctx.db.delete(args.userId);
    
    return {
      userId: args.userId,
      deletedOrders: orders.length,
      deletedReviews: clientReviews.length,
      deletedRecommendations: recommendations.length,
      deletedSessions: sessions.length,
    };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUsersByRole = query({
  args: { role: v.union(v.literal("client"), v.literal("tailor"), v.literal("admin")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    
    const totalUsers = allUsers.length;
    const clients = allUsers.filter(user => user.role === "client").length;
    const tailors = allUsers.filter(user => user.role === "tailor").length;
    const admins = allUsers.filter(user => user.role === "admin").length;
    
    return {
      totalUsers,
      clients,
      tailors,
      admins,
    };
  },
});

export const getTailorAnalytics = query({
  args: { tailorId: v.id("users") },
  handler: async (ctx, args) => {
    // Get orders for this tailor
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.tailorId))
      .collect();
    
    // Get reviews for this tailor
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.tailorId))
      .collect();
    
    // Get designs for this tailor
    const designs = await ctx.db
      .query("designs")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.tailorId))
      .collect();
    
    // Calculate analytics
    const completedOrders = orders.filter(order => order.status === "completed");
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    
    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    // Calculate repeat customers
    const uniqueClients = new Set(orders.map(order => order.clientId));
    const repeatClients = orders.filter(order => {
      const clientOrders = orders.filter(o => o.clientId === order.clientId);
      return clientOrders.length > 1;
    });
    const repeatCustomerRate = uniqueClients.size > 0 
      ? (repeatClients.length / uniqueClients.size) * 100 
      : 0;
    
    // Get popular designs
    const designOrderCounts = designs.map(design => {
      const orderCount = orders.filter(order => order.designId === design._id).length;
      return { design, orderCount };
    }).sort((a, b) => b.orderCount - a.orderCount);
    
    // Get recent reviews
    const recentReviews = reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);
    
    return {
      totalRevenue,
      avgOrderValue,
      avgRating,
      repeatCustomerRate,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      totalReviews: reviews.length,
      totalDesigns: designs.length,
      popularDesigns: designOrderCounts.slice(0, 3),
      recentReviews,
    };
  },
});
