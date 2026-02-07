"use server";

import { cookies } from "next/headers";
import { z } from "zod";

export const CartLineSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  priceCents: z.number().int(),
  weightOz: z.number(),
  qty: z.number().int().min(1),
});

export type CartLine = z.infer<typeof CartLineSchema>;

export async function getCart(): Promise<CartLine[]> {
  const raw = cookies().get("cart")?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    const arr = z.array(CartLineSchema).safeParse(parsed);
    return arr.success ? arr.data : [];
  } catch {
    return [];
  }
}

export async function setCart(lines: CartLine[]): Promise<void> {
  cookies().set("cart", JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function addToCart(line: CartLine): Promise<void> {
  const cart = await getCart();
  const idx = cart.findIndex((c) => c.productId === line.productId);

  if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + line.qty };
  else cart.push(line);

  await setCart(cart);
}
