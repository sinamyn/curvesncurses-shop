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

export function getCart(): CartLine[] {
  const raw = cookies().get("cart")?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const arr = z.array(CartLineSchema).safeParse(parsed);
    return arr.success ? arr.data : [];
  } catch { return []; }
}

export function setCart(lines: CartLine[]) {
  cookies().set("cart", JSON.stringify(lines), { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function addToCart(line: CartLine) {
  const cart = getCart();
  const idx = cart.findIndex(c => c.productId === line.productId);
  if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + line.qty };
  else cart.push(line);
  setCart(cart);
}

export async function updateQty(productId: string, qty: number) {
  const cart = getCart().map(l => l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l);
  setCart(cart);
}

export async function removeFromCart(productId: string) {
  setCart(getCart().filter(l => l.productId !== productId));
}

export async function clearCart() { setCart([]); }
