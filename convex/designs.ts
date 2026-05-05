import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDesign = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    image: v.string(), // Convex file storage ID
    price: v.number(),
    category: v.string(),
    occasion: v.string(),
    bodyType: v.string(),
    fabric: v.string(),
    tailorId: v.id("users"),
    materials: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx: any, args: any) => {
    const designId = await ctx.db.insert("designs", {
      title: args.title,
      description: args.description,
      image: args.image,
      price: args.price,
      category: args.category,
      occasion: args.occasion,
      bodyType: args.bodyType,
      fabric: args.fabric,
      tailorId: args.tailorId,
      materials: args.materials || [],
      colors: args.colors || [],
      sizes: args.sizes || [],
      tags: args.tags || [],
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return designId;
  },
});

export const getDesigns = query({
  args: {
    category: v.optional(v.string()),
    occasion: v.optional(v.string()),
    bodyType: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    let query = ctx.db.query("designs").filter((q: any) => q.eq(q.field("isActive"), true));

    if (args.category) {
      query = query.filter((q: any) => q.eq(q.field("category"), args.category));
    }

    if (args.occasion) {
      query = query.filter((q: any) => q.eq(q.field("occasion"), args.occasion));
    }

    if (args.bodyType) {
      query = query.filter((q: any) => q.eq(q.field("bodyType"), args.bodyType));
    }

    return await query.collect();
  },
});

export const getDesignsByTailor = query({
  args: { tailorId: v.id("users") },
  handler: async (ctx: any, args: any) => {
    const designs = await ctx.db
      .query("designs")
      .withIndex("by_tailor", (q: any) => q.eq("tailorId", args.tailorId))
      .collect();
    
    // Convert storage IDs to URLs
    return await Promise.all(
      designs.map(async (design: any) => {
        const imageUrl = design.image ? await ctx.storage.getUrl(design.image) : null;
        return {
          ...design,
          imageUrl: imageUrl,
        };
      })
    );
  },
});

export const getDesign = query({
  args: { id: v.id("designs") },
  handler: async (ctx: any, args: any) => {
    const design = await ctx.db.get(args.id);
    if (!design) return null;
    
    // Convert storage ID to URL
    const imageUrl = design.image ? await ctx.storage.getUrl(design.image) : null;
    return {
      ...design,
      imageUrl: imageUrl,
    };
  },
});

export const deleteDesign = mutation({
  args: {
    id: v.id("designs"),
    tailorId: v.id("users"),
  },
  handler: async (ctx: any, args: any) => {
    const design = await ctx.db.get(args.id);
    
    if (!design) {
      throw new Error("Design not found");
    }
    
    // Verify ownership
    if (design.tailorId !== args.tailorId) {
      throw new Error("Unauthorized to delete this design");
    }
    
    // Delete the associated image file from Convex storage
    if (design.image) {
      try {
        await ctx.storage.delete(design.image);
      } catch (error) {
        console.error('Failed to delete design image:', error);
        // Don't throw error, just log it - the design deletion should still proceed
      }
    }
    
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const updateDesign = mutation({
  args: {
    id: v.id("designs"),
    tailorId: v.id("users"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    occasion: v.optional(v.string()),
    bodyType: v.optional(v.string()),
    fabric: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx: any, args: any) => {
    const design = await ctx.db.get(args.id);
    
    if (!design) {
      throw new Error("Design not found");
    }
    
    // Verify ownership
    if (design.tailorId !== args.tailorId) {
      throw new Error("Unauthorized to update this design");
    }
    
    // Delete old image if it's different from the new one
    if (args.image !== undefined && design.image && design.image !== args.image) {
      try {
        await ctx.storage.delete(design.image);
      } catch (error) {
        console.error('Failed to delete old image:', error);
        // Don't throw error, just log it - the update should still proceed
      }
    }
    
    await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.image !== undefined && { image: args.image }),
      ...(args.price !== undefined && { price: args.price }),
      ...(args.category !== undefined && { category: args.category }),
      ...(args.occasion !== undefined && { occasion: args.occasion }),
      ...(args.bodyType !== undefined && { bodyType: args.bodyType }),
      ...(args.fabric !== undefined && { fabric: args.fabric }),
      ...(args.materials !== undefined && { materials: args.materials }),
      ...(args.colors !== undefined && { colors: args.colors }),
      ...(args.sizes !== undefined && { sizes: args.sizes }),
      ...(args.tags !== undefined && { tags: args.tags }),
      ...(args.isActive !== undefined && { isActive: args.isActive }),
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});