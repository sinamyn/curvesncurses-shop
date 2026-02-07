import Link from "next/link";
import { getCart, updateQty, removeFromCart } from "@/lib/cart";
import { bulkDiscountPercent, applyPercent } from "@/lib/discounts";
import { calcShippingCents } from "@/lib/shipping";

export default async function CartPage() {
  const lines = await getCart();
  const priced = lines.map((l: any) => {
    const pct = bulkDiscountPercent(l.qty);
    const unit = applyPercent(l.priceCents, pct);
    const lineTotal = unit * l.qty;
    return { ...l, pct, unit, lineTotal };
  });
  const subtotal = priced.reduce((a: number,l: any)=>a+l.lineTotal,0);
  const ship = calcShippingCents(priced as any, subtotal);
  const total = subtotal + ship.shippingCents;

  async function setQty(formData: FormData) {
    "use server";
    await updateQty(String(formData.get("productId")), Number(formData.get("qty")));
  }
  async function remove(formData: FormData) {
    "use server";
    await removeFromCart(String(formData.get("productId")));
  }

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Cart</h1>
        {lines.length === 0 ? (
          <>
            <p style={{color:"var(--muted)"}}>Your cart is empty. Let’s fix that.</p>
            <Link className="btn primary" href="/shop">Shop the Sass</Link>
          </>
        ) : (
          <>
            <div className="grid" style={{gap:12}}>
              {priced.map(l => (
                <div key={l.productId} className="card" style={{background:"#fff"}}>
                  <div style={{display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap"}}>
                    <div><b>{l.name}</b><br/><small>{l.pct ? `${l.pct}% bulk discount applied` : "No bulk discount"} • ${(l.unit/100).toFixed(2)} each</small></div>
                    <div style={{textAlign:"right"}}><b>${(l.lineTotal/100).toFixed(2)}</b></div>
                  </div>
                  <div className="hr" />
                  <div style={{display:"flex", gap:10, alignItems:"end", flexWrap:"wrap"}}>
                    <form action={setQty} style={{display:"flex", gap:10, alignItems:"end"}}>
                      <input type="hidden" name="productId" value={l.productId} />
                      <div><label>Qty</label><input name="qty" type="number" min={1} defaultValue={l.qty} style={{maxWidth:120}} /></div>
                      <button className="btn" type="submit">Update</button>
                    </form>
                    <form action={remove}><input type="hidden" name="productId" value={l.productId} /><button className="btn" type="submit">Remove</button></form>
                    <Link className="btn" href={`/shop/${l.slug}`}>View</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="hr" />
            <div className="card" style={{background:"#fff"}}>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>Subtotal</span><b>${(subtotal/100).toFixed(2)}</b></div>
              <div style={{display:"flex", justifyContent:"space-between"}}><span>Shipping <small>({ship.label})</small></span><b>${(ship.shippingCents/100).toFixed(2)}</b></div>
              <div style={{display:"flex", justifyContent:"space-between", fontSize:18, marginTop:8}}><span>Total</span><b>${(total/100).toFixed(2)}</b></div>
              <div className="hr" />
              <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                <Link className="btn" href="/shop">Keep shopping</Link>
                <Link className="btn primary" href="/checkout">Checkout</Link>
              </div>
              <small style={{display:"block", marginTop:10}}>Free shipping over $50. Weight-based stamp-rate for sticker-only small orders.</small>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
