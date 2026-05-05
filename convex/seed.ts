import { mutation } from "./_generated/server";

// Sample data seeder for development and testing
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Seeding Ankara Bubble database...");
    
    // Create sample tailors
    const tailor1 = await ctx.db.insert("users", {
      clerkId: "tailor_1",
      firstName: "Wanjiku",
      lastName: "Kamau",
      email: "wanjiku@example.com",
      name: "Wanjiku Kamau",
      role: "tailor",
      avatar: "/kenyan-woman-fashion-designer.jpg",
      phone: "+254 712 345 678",
      location: "Nairobi, Kenya",
      isVerified: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    const tailor2 = await ctx.db.insert("users", {
      clerkId: "tailor_2", 
      firstName: "Omondi",
      lastName: "Otieno",
      email: "omondi@example.com",
      name: "Omondi Otieno",
      role: "tailor",
      avatar: "/kenyan-man-fashion-designer.jpg",
      phone: "+254 723 456 789",
      location: "Mombasa, Kenya",
      isVerified: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Create sample client
    const client = await ctx.db.insert("users", {
      clerkId: "client_1",
      firstName: "Wanjiru",
      lastName: "Kariuki", 
      email: "wanjiru@example.com",
      name: "Wanjiru Kariuki",
      role: "client",
      avatar: "/placeholder-user.jpg",
      phone: "+254 734 567 890",
      location: "Nairobi, Kenya",
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Create sample designs
    const design1 = await ctx.db.insert("designs", {
      title: "Elegant Evening Gown",
      description: "Stunning floor-length gown with intricate Ankara patterns perfect for formal events",
      image: "/elegant-african-ankara-evening-gown.jpg",
      price: 25000,
      category: "Formal Wear",
      occasion: "Evening Events",
      bodyType: "Hourglass",
      fabric: "Premium Ankara Wax Print",
      tailorId: tailor1,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    const design2 = await ctx.db.insert("designs", {
      title: "Modern Jumpsuit",
      description: "Contemporary jumpsuit perfect for everyday elegance with modern Ankara print",
      image: "/modern-african-ankara-jumpsuit.jpg",
      price: 18000,
      category: "Casual Wear",
      occasion: "Casual Outings",
      bodyType: "Rectangle",
      fabric: "Cotton Ankara",
      tailorId: tailor2,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    const design3 = await ctx.db.insert("designs", {
      title: "Professional Blazer",
      description: "Professional blazer with subtle Ankara accents for business settings",
      image: "/professional-african-ankara-blazer.jpg",
      price: 22000,
      category: "Business Wear",
      occasion: "Professional",
      bodyType: "Inverted Triangle",
      fabric: "Structured Ankara",
      tailorId: tailor1,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Create sample orders
    const order1 = await ctx.db.insert("orders", {
      clientId: client,
      tailorId: tailor1,
      designId: design1,
      status: "in_progress",
      amount: 25000,
      measurements: {
        height: 165,
        bust: 90,
        waist: 75,
        hips: 95,
      },
      notes: "Please ensure the waist is fitted properly",
      estimatedDelivery: Date.now() + (14 * 24 * 60 * 60 * 1000), // 14 days from now
      paymentStatus: "paid",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    const order2 = await ctx.db.insert("orders", {
      clientId: client,
      tailorId: tailor2,
      designId: design2,
      status: "completed",
      amount: 18000,
      measurements: {
        height: 160,
        bust: 88,
        waist: 72,
        hips: 92,
      },
      notes: "Love the modern design!",
      estimatedDelivery: Date.now() + (10 * 24 * 60 * 60 * 1000),
      actualDelivery: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      paymentStatus: "paid",
      createdAt: Date.now() - (20 * 24 * 60 * 60 * 1000), // 20 days ago
      updatedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
    });
    
    // Create sample reviews
    await ctx.db.insert("reviews", {
      orderId: order2,
      clientId: client,
      tailorId: tailor2,
      rating: 5,
      comment: "Excellent work! The jumpsuit fits perfectly and the quality is outstanding. Highly recommend!",
      createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
    });
    
    console.log("Database seeded successfully!");
    console.log(`Created 3 users (2 tailors, 1 client)`);
    console.log(`Created 3 designs`);
    console.log(`Created 2 orders`);
    console.log(`Created 1 review`);
    
    return {
      users: 3,
      designs: 3,
      orders: 2,
      reviews: 1,
    };
  },
});

// Clear all data (for testing)
export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing database...");
    
    // Delete all records (in reverse order of dependencies)
    const reviews = await ctx.db.query("reviews").collect();
    for (const review of reviews) {
      await ctx.db.delete(review._id);
    }
    
    const orders = await ctx.db.query("orders").collect();
    for (const order of orders) {
      await ctx.db.delete(order._id);
    }
    
    const designs = await ctx.db.query("designs").collect();
    for (const design of designs) {
      await ctx.db.delete(design._id);
    }
    
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    
    console.log("Database cleared successfully!");
    return { cleared: true };
  },
});
