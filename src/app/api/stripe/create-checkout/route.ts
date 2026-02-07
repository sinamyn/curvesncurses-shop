import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { getCart } from "@/lib/cart";
import { bulkDiscountPercent, applyPercent } from "@/lib/discounts";
import { calcShippingCents } from "@/lib/shipping";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!env.stripeSecret) return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
  const stripe = new Stripe(env.stripeSecret, { apiVersion: "2024-06-20" });

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim();
  const name = String(body.name ?? "").trim();
  if (!email || !name) return NextResponse.json({ error: "Missing name/email" }, { status: 400 });

  const cart = getCart();
  if (!cart.length) return NextResponse.json({ error: "Cart empty" }, { status: 400 });

  const priced = cart.map(l => {
    const pct = bulkDiscountPercent(l.qty);
    const unit = applyPercent(l.priceCents, pct);
    return { ...l, unit, pct };
  });
  const subtotal = priced.reduce((a,l)=>a + l.unit * l.qty, 0);
  const ship = calcShippingCents(priced as any, subtotal);

  const order = await prisma.order.create({
    data: {
      email,
      status: "PENDING",
      subtotalCents: subtotal,
      shippingCents: ship.shippingCents,
      totalCents: subtotal + ship.shippingCents,
      items: { create: priced.map(l => ({
        productId: l.productId,
        productSlug: l.slug,
        name: l.name,
        unitPriceCents: l.unit,
        qty: l.qty,
        lineTotalCents: l.unit * l.qty,
      })) }
    }
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.map(l => ({
    quantity: l.qty,
    price_data: { currency: "usd", unit_amount: l.unit, product_data: { name: l.name } }
  }));

  if (ship.shippingCents > 0) {
    line_items.push({ quantity: 1, price_data: { currency: "usd", unit_amount: ship.shippingCents, product_data: { name: `Shipping (${ship.label})` } } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    success_url: `${env.baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.baseUrl}/cart`,
    line_items,
    metadata: { orderId: order.id, customerName: name },
    shipping_address_collection: { allowed_countries: ["US"] },
    allow_promotion_codes: true,
  });

  await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
  return NextResponse.json({ url: session.url });
}
