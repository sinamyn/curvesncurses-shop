export function bulkDiscountPercent(qty: number): number {
  if (qty >= 50) return 30;
  if (qty >= 25) return 20;
  if (qty >= 10) return 10;
  return 0;
}
export function applyPercent(cents: number, pct: number): number {
  return Math.round(cents * (1 - pct / 100));
}
