# Curves~N~Curses by SinAmyn — PWA Store App (Next.js + Prisma + Stripe)

This repo is a mobile-first PWA ecommerce app designed to deploy on Render with a Postgres database and Stripe checkout.

## Features
- Mobile-first storefront + PWA manifest
- Products (categories, images, price, weight_oz, inventory mode: limited or made-to-order)
- Bulk discount for same exact product:
  - 10–24: 10% off
  - 25–49: 20% off
  - 50+: 30% off
- Bundles supported as products with type=BUNDLE
- Custom orders (simple builder + complex request form)
- Reviews + photo URL (verified buyers only via order token)
- Wishlist + optional accounts (email/password)
- Shipping: weight-based + stamp-rate for sticker-only light orders + free over $50
- Admin dashboard (protected by ADMIN_EMAIL)

## Local setup
1) Install
    npm install
2) Env
    cp .env.example .env
3) DB migrate + seed
    npx prisma migrate dev
    npm run seed
4) Run
    npm run dev

## Render deploy (easy)
A) Create Postgres in Render, copy DATABASE_URL
B) Create Web Service from this repo
- Build: npm install && npm run build && npx prisma migrate deploy
- Start: npm run start
C) Set env vars in Render from .env.example
D) Stripe webhook
- Endpoint: https://YOUR-RENDER-URL/api/stripe/webhook
- Events: checkout.session.completed
- Set STRIPE_WEBHOOK_SECRET

## Domain
Render → Web Service → Settings → Custom Domains
Add curvesncurses.com and www.curvesncurses.com
Then add the DNS records Render shows in Porkbun DNS.

