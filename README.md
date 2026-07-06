# ☕ Brew & Co. — Coffee Shop Management System

A full-stack coffee shop management system built with **Next.js 16**, **Neon (PostgreSQL)**, **Drizzle ORM**, **NextAuth**, and **PayMongo**.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Landing Page** | Hero section, features, categories, CTA (inspired by moein-coffee.vercel.app) |
| **Menu** | Product catalog with categories, search, add-to-cart |
| **Cart & Checkout** | Quantity controls, order form, order summary |
| **PayMongo Payment** | GCash, Card, and PayMaya payment integration |
| **Order Tracking** | Real-time order status (pending → confirmed → preparing → ready → delivered) |
| **Admin Dashboard** | Revenue stats, orders, products, customers management |
| **Auth** | Login/Register with NextAuth (credentials) |
| **Responsive** | Mobile-first design with Tailwind CSS |

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- **Backend**: Next.js API routes
- **Database**: Neon (serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js (JWT)
- **Payment**: PayMongo (GCash, Card, Maya)
- **Deployment**: Vercel (free)

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [Neon](https://neon.tech) account (free)
- [PayMongo](https://paymongo.com) account (free for test mode)
- [Vercel](https://vercel.com) account (free)

---

## 🚀 Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/JimDev20/CoffeeShop.git
cd CoffeeShop
npm install
```

### Step 2: Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Click **"Create a project"**
3. Choose a name (e.g., `coffee-shop`) and region closest to you
4. Once created, go to **Dashboard** → **Connection Details**
5. Copy the **connection string** (looks like `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)

### Step 3: Push Database Schema

Create `.env.local` in the project root:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
AUTH_SECRET=your_auth_secret
PAYMONGO_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=pk_test_your_key
```

Generate `AUTH_SECRET`:
```bash
npx auth secret
```

Push the schema to your Neon database:
```bash
npm run db:push
```

> This creates all tables: `users`, `categories`, `products`, `orders`.

### Step 4: Seed Demo Data (Optional)

Run the seed script to populate sample products and categories:
```bash
npx tsx src/lib/db/seed.ts
```

### Step 5: Set Up PayMongo (Test Mode)

1. Go to [paymongo.com](https://paymongo.com) and register
2. Navigate to **Developers** → **API Keys**
3. Copy the **Secret Key** (starts with `sk_test_`) and **Public Key** (starts with `pk_test_`)
4. Add them to your `.env.local`:
```env
PAYMONGO_SECRET_KEY=sk_test_xxxxxxxxxxxx
NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
```

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (navbar + footer)
│   ├── page.tsx            # Landing page
│   ├── menu/               # Product catalog
│   ├── cart/               # Shopping cart
│   ├── orders/             # Order history
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── register/       # Register page
│   ├── admin/
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Manage products
│   │   ├── orders/         # Manage orders
│   │   └── customers/      # Manage customers
│   └── api/
│       ├── auth/           # NextAuth handler
│       ├── products/       # Products API
│       ├── orders/         # Orders API
│       ├── payment/        # PayMongo integration
│       ├── categories/     # Categories API
│       └── customers/      # Customers API
├── components/
│   ├── navbar.tsx          # Navigation bar
│   ├── footer.tsx          # Footer
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts       # Database schema (Drizzle)
│   │   └── index.ts        # Database client
│   ├── auth.ts             # NextAuth config
│   └── utils.ts            # Utility functions
└── types/
    └── global.d.ts         # Type declarations
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create a product |
| GET | `/api/categories` | List all categories |
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create an order |
| GET | `/api/customers` | List all customers |
| POST | `/api/payment` | Create PayMongo payment intent |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler |

---

## 🚢 Deploy to Vercel

1. Push your code to GitHub (already done):
   ```bash
   git add .
   git commit -m "your message"
   git push
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click **"Add New"** → **"Project"**

4. Import the `CoffeeShop` repository

5. Add environment variables in Vercel dashboard → Project Settings → Environment Variables:
   ```
   DATABASE_URL
   AUTH_SECRET
   PAYMONGO_SECRET_KEY
   NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY
   ```

6. Click **"Deploy"**

Your site will be live at `https://coffeeshop.vercel.app` (or your custom domain).

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | NextAuth encryption secret |
| `AUTH_URL` | ❌ | Auth URL (defaults to app URL) |
| `PAYMONGO_SECRET_KEY` | ✅ | PayMongo secret key (starts with `sk_`) |
| `NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY` | ✅ | PayMongo public key (starts with `pk_`) |

---

## 🧪 Testing Payments (Sandbox)

In PayMongo test mode, use these test card numbers:
- **Success**: `4343434343434345` (any future expiry, any CVV)
- **Declined**: `4444444444444448` (any future expiry, any CVV)
- **GCash**: Test mode auto-approves GCash payments

---

## 📊 Managing 100+ Customers

The admin dashboard supports pagination-ready customer management:
- `/admin/customers` — View all customers with order counts and totals
- Customer data includes: name, email, phone, order history, lifetime value
- The database schema is optimized for scalable queries

---

## 🖥️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:generate  # Generate SQL migration
npm run db:studio    # Open Drizzle Studio (GUI DB browser)
```

---

Built with ❤️ by [JimDev20](https://github.com/JimDev20)
