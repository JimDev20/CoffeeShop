# Brew & Co. -- Coffee Shop Management System

A full-stack coffee shop management system built with Next.js 16, Neon (PostgreSQL), NextAuth, and PayMongo.

## Features

- Landing page with hero, features, categories, CTA
- Product catalog with categories and add-to-cart
- Cart and checkout with order form
- PayMongo payment integration (GCash, Card, Maya)
- Order tracking (pending, confirmed, preparing, delivered)
- Admin dashboard with revenue, orders, products, customers
- Auth with NextAuth credentials
- Responsive mobile-first design with Tailwind CSS

## Tech Stack

- Frontend: Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- Backend: Next.js API routes
- Database: Neon (serverless PostgreSQL)
- Auth: NextAuth.js (JWT)
- Payment: PayMongo
- Deployment: Vercel

## Prerequisites

- Node.js 18+
- Neon account (free)
- PayMongo account (free for test mode)
- Vercel account (free)

## Setup

1. Clone and install:

```bash
git clone https://github.com/JimDev20/CoffeeShop.git
cd CoffeeShop
npm install
```

2. Create a `.env.local` file in the project root with your own values:

```env
DATABASE_URL=
AUTH_SECRET=
PAYMONGO_SECRET_KEY=
NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=
```

3. Generate an auth secret:

```bash
npx auth secret
```

4. Seed demo data:

```bash
npm run seed
```

5. Run the dev server:

```bash
npm run dev
```

## Project Structure

```
src/
  app/
    layout.tsx          Root layout
    page.tsx            Landing page
    menu/               Product catalog
    cart/               Shopping cart
    orders/             Order history
    auth/
      login/            Login page
      register/         Register page
    admin/
      page.tsx          Dashboard
      products/         Manage products
      orders/           Manage orders
      customers/        Manage customers
    api/
      auth/             NextAuth handler + register
      products/         Products API
      orders/           Orders API
      payment/          PayMongo integration
      categories/       Categories API
      customers/        Customers API
  components/
    navbar.tsx
    footer.tsx
    ui/                 Reusable UI components
  lib/
    db/                 Database client
    auth.ts             NextAuth config
  scripts/
    seed.ts             Demo data seeder
  types/                Type declarations
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create a product |
| GET | `/api/categories` | List all categories |
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create an order |
| GET | `/api/customers` | List all customers |
| POST | `/api/payment` | Create PayMongo payment intent |
| POST | `/api/auth/register` | Register a new user |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler |

## Deploy to Vercel

1. Push code to GitHub.
2. Import the repository in Vercel.
3. Add your environment variables in Vercel project settings.
4. Deploy.

## Available Scripts

```bash
npm run dev          Start development server
npm run build        Build for production
npm run start        Start production server
npm run lint         Run ESLint
npm run seed         Seed demo data
```
