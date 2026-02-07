type CartLine = { name: string; slug: string; priceCents: number; qty: number; weightOz: number; category: string; productId: string; };
export function calcShippingCents(lines: CartLine[], subtotalCents: number): { shippingCents: number; label: string } {
  if (subtotalCents >= 5000) return { shippingCents: 0, label: "Free shipping over $50" };
  const totalWeight = lines.reduce((a,l)=>a + (l.weightOz ?? 0) * l.qty, 0);
  const stickerOnly = lines.length > 0 && lines.every(l => l.category.toLowerCase().includes("sticker"));
  if (stickerOnly && totalWeight <= 1.0) return { shippingCents: 125, label: "Stamp shipping" };
  if (totalWeight <= 4) return { shippingCents: 399, label: "Light shipping" };
  if (totalWeight <= 8) return { shippingCents: 499, label: "Standard shipping" };
  if (totalWeight <= 16) return { shippingCents: 699, label: "Heavy shipping" };
  return { shippingCents: 999, label: "Bulky shipping" };
}
