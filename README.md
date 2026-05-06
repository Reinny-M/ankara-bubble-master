# Ankara Bubble

An AI-powered fashion platform connecting clients with specialized African Ankara fashion tailors. This project leverages modern web technologies to provide personalized design recommendations, streamlined order management, and a robust marketplace for authentic African craftsmanship.

## Capabilities

Ankara Bubble provides a comprehensive ecosystem for the African fashion industry, featuring:

### For Clients
*   **AI-Driven Styling**: Intelligent fashion assistant that analyzes body measurements to provide personalized design and fabric recommendations.
*   **Design Explorer**: A high-performance gallery of authentic Ankara designs with advanced filtering and search capabilities.
*   **Order Lifecycle Tracking**: Real-time monitoring of custom garment production, from measurement confirmation to final delivery.
*   **Verified Marketplace**: Access to a curated network of professional tailors with transparent reviews and ratings.

### For Tailors
*   **Business Intelligence**: Analytics dashboard for tracking revenue growth, order volume, and customer satisfaction metrics.
*   **Portfolio Management**: High-quality showcase for designs, including fabric details and pricing models.
*   **Order Management System**: Streamlined workflow for processing custom orders, managing timelines, and communicating with clients.

### For Administrators
*   **Platform Analytics**: Comprehensive oversight of user growth, transaction volume, and platform health.
*   **Content Moderation**: Tools for managing user roles, verifying tailors, and ensuring platform quality.

## Tech Stack

The application is built with a focus on type safety, scalability, and performance:

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Runtime**: [React 19](https://react.dev/)
*   **Backend & Database**: [Convex](https://www.convex.dev/) (Real-time synchronization and serverless functions)
*   **Authentication**: [Clerk](https://clerk.com/) (Role-based access control)
*   **AI Integration**: [Google Generative AI](https://ai.google.dev/) (Gemini 1.5/2.5 Pro for styling logic)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
*   **State Management**: Convex Reactive Queries & React Context
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

## Configuration

### Environment Variables

Create a `.env.local` file with the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://...

# AI Services
GEMINI_API_KEY=...

# Webhooks & Integration
CLERK_WEBHOOK_SECRET=...
```

## Getting Started

### Prerequisites
*   Node.js 18+
*   pnpm (recommended) or npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Reinny-M/ankara-bubble.git
    cd ankara-bubble
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Configure environment variables:
    ```bash
    cp .env.example .env.local
    ```

4.  Start the development server:
    ```bash
    pnpm dev
    ```

5.  Launch the Convex dev server (separate terminal):
    ```bash
    npx convex dev
    ```

## Project Structure

```text
├── app/              # Next.js App Router (Role-based routing)
│   ├── admin/        # Admin management pages
│   ├── client/       # Client-facing AI tools and dashboards
│   ├── tailor/       # Tailor business tools
│   └── api/          # Serverless API routes
├── components/       # React components (shaden/ui & shared)
├── convex/           # Backend schema and serverless functions
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and shared business logic
└── public/           # Static assets
```

## Deployment

The application is designed to be deployed on **Vercel** with the **Convex** backend:

1.  Connect your repository to Vercel.
2.  Configure environment variables in the Vercel dashboard.
3.  Ensure Convex deployment is linked correctly to the Vercel project.

## License

This project is licensed under the MIT License.
