export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Curves~N~Curses by SinAmyn",
  tagline: process.env.NEXT_PUBLIC_TAGLINE ?? "Because basic was never your thing.",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  authSecret: process.env.AUTH_SECRET ?? "change_me",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  stripeSecret: process.env.STRIPE_SECRET_KEY ?? "",
  stripePublishable: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
};
