# Activity Log

## Project: Brew & Co. Coffee Shop

GitHub: https://github.com/JimDev20/CoffeeShop
Stack: Next.js 16 (App Router), Neon (PostgreSQL), NextAuth (JWT), PayMongo, Tailwind CSS 4

## Setup

- Clone: `git clone https://github.com/JimDev20/CoffeeShop.git`
- Install: `npm install`
- Env: create `.env.local` with DATABASE_URL, AUTH_SECRET, PAYMONGO_SECRET_KEY, NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY
- Seed: `npm run seed` (creates admin admin@brewco.com / admin123 + categories + 8 products)
- Dev: `npm run dev`
- Build: `npm run build -- --webpack` (Turbopack unsupported on win32)

## Completed

### Database
- Neon PostgreSQL with tables: users, categories, products, orders
- Schema pushed via `npm run db:push`
- All API routes query Neon directly (no in-memory data)

### Auth
- NextAuth v5 with credentials provider
- Login at /auth/login, register at /auth/register
- Admin users have role="admin" in users table
- /admin/* pages protected by admin layout (redirects non-admins to /auth/login)

### Admin Pages
- /admin -- dashboard with real-time stats (revenue, orders, customers, products)
- /admin/products -- product list from DB
- /admin/orders -- order list from DB
- /admin/customers -- customer list from DB
- Admin has its own sidebar layout (no customer navbar/footer)
- Admin link removed from customer navbar; only accessible via direct URL

### Public Pages
- Landing page (hero, features, categories, CTA)
- Menu page -- products from DB
- Cart page -- checkout hits orders API then payment API
- Orders page -- filtered by logged-in user's email

### API Routes
- GET/POST /api/products -- list / create products
- GET /api/categories -- list categories
- GET/POST /api/orders -- list / create orders
- GET /api/customers -- list customers with order stats
- POST /api/payment -- PayMongo checkout (graceful fallback if unconfigured)
- POST /api/auth/register -- create user with bcrypt
- GET/POST /api/auth/[...nextauth] -- NextAuth handler

### Security / Cleanup
- .env* in .gitignore (already present)
- No credentials or personal data in repo (removed make-admin.ts with personal email)
- README cleaned of any placeholder credentials

## Next Steps / Known Issues

- Add PayMongo keys to Vercel env vars before going live
- Product detail pages (/menu/[slug]) not yet implemented
- Admin "Add Product" / "Edit" / "Delete" buttons not wired to API
- Admin "Update" order status button not wired
- Cart page uses local state (items reset on reload -- need cart persisted)
- No email confirmation on order
- No image upload for products
- Pagination for orders/customers lists
- Deploy to Vercel (add env vars in project settings)

## Credentials

- Admin (seeded): admin@brewco.com / admin123
- jimparado042@gmail.com promoted to admin (password set by user)
