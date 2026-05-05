import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    clientId: v.id("users"),
    tailorId: v.id("users"),
    designId: v.id("designs"),
    amount: v.number(),
    measurements: v.object({
      height: v.number(),
      bust: v.number(),
      waist: v.number(),
      hips: v.number(),
    }),
    notes: v.optional(v.string()),
    estimatedDelivery: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      clientId: args.clientId,
      tailorId: args.tailorId,
      designId: args.designId,
      status: "pending",
      amount: args.amount,
      measurements: args.measurements,
      notes: args.notes,
      estimatedDelivery: args.estimatedDelivery,
      paymentStatus: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return orderId;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const getOrdersByClient = query({
  args: { clientId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();
  },
});

export const getOrdersByTailor = query({
  args: { tailorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.tailorId))
      .collect();
  },
});

export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const getOrdersByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const clientOrders = await ctx.db
      .query("orders")
      .withIndex("by_client", (q) => q.eq("clientId", args.userId))
      .collect();
    
    const tailorOrders = await ctx.db
      .query("orders")
      .withIndex("by_tailor", (q) => q.eq("tailorId", args.userId))
      .collect();
    
    return [...clientOrders, ...tailorOrders];
  },
});

export const deleteOrder = mutation({
  args: {
    id: v.id("orders"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Verify ownership
    if (order.clientId !== args.userId && order.tailorId !== args.userId) {
      throw new Error("Unauthorized to delete this order");
    }
    
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

export const getOrderStats = query({
  args: {},
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").collect();
    
    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter(order => order.status === "completed").length;
    const pendingOrders = allOrders.filter(order => order.status === "pending").length;
    const inProgressOrders = allOrders.filter(order => order.status === "in_progress").length;
    
    const totalRevenue = allOrders
      .filter(order => order.status === "completed")
      .reduce((sum, order) => sum + order.amount, 0);
    
    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      inProgressOrders,
      totalRevenue,
    };
  },
});
