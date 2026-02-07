import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  if (!env.stripeSecret || !env.stripeWebhookSecret) return NextResponse.json({ error: "Stripe env vars missing" }, { status: 500 });

  const stripe = new Stripe(env.stripeSecret, { apiVersion: "2024-06-20" });
  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, env.stripeWebhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const shipping = session.shipping_details;
      const addr = shipping?.address ? JSON.stringify(shipping.address) : null;

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", shippingName: shipping?.name ?? null, shippingAddress: addr }
      });

      const token = crypto.randomBytes(24).toString("hex");
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await prisma.reviewToken.create({ data: { orderId, email: session.customer_email ?? "", token, expiresAt: expires } });
    }
  }

  return NextResponse.json({ received: true });
}
export const runtime = "nodejs";
