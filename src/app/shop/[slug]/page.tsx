import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addToCart } from "@/lib/cart";
import { bulkDiscountPercent } from "@/lib/discounts";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return <main><div className="card">Not found.</div></main>;

  const reviews = await prisma.review.findMany({ where: { productId: product.id }, orderBy: { createdAt: "desc" }, take: 50 });
  const avg = reviews.length ? (reviews.reduce((a: number,r: { rating: number })=> a + r.rating,0) / reviews.length).toFixed(1) : null;

  async function add(formData: FormData) {
    "use server";
    const qty = Math.max(1, Number(formData.get("qty") ?? 1));
    await addToCart({ productId: product.id, slug: product.slug, name: product.name, category: product.category, priceCents: product.priceCents, weightOz: Number(product.weightOz ?? 0), qty });
  }

  const bulkExamples = [{qty:10,pct:bulkDiscountPercent(10)},{qty:25,pct:bulkDiscountPercent(25)},{qty:50,pct:bulkDiscountPercent(50)}];

  return (
    <main>
      <div className="grid cols-2">
        <div className="card">
     
        </div>

        <div className="card">
          <span className="badge">{product.category}</span>
          <h1 style={{marginTop:10}}>{product.name}</h1>
          <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
            <b style={{fontSize:22}}>${(product.priceCents/100).toFixed(2)}</b>
            {avg && <span className="badge">⭐ {avg} ({reviews.length})</span>}
            {product.inventoryMode === "LIMITED" && <span className="badge">Limited: {product.stockQty ?? 0} left</span>}
          </div>
          <p style={{color:"var(--muted)"}}>{product.description}</p>

          <div className="hr" />

          <form action={add} className="row">
            <div className="row two">
              <div>
                <label>Quantity</label>
                <input name="qty" type="number" min={1} defaultValue={1} />
                <small>Bulk discounts apply only to the same exact design.</small>
              </div>
              <div>
                <label>Bulk discount preview</label>
                <div className="card" style={{padding:12}}>
                  {bulkExamples.map(ex => (
                    <div key={ex.qty} style={{display:"flex", justifyContent:"space-between"}}><span>{ex.qty}+ :</span><b>{ex.pct}% off</b></div>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn primary" type="submit">Add to Cart</button>
            <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
              <Link className="btn" href="/cart">View Cart</Link>
              <Link className="btn" href="/custom">Want it customized?</Link>
            </div>
          </form>

          <div className="hr" />

          <h2>Reviews</h2>
          <small>Verified buyers can leave photo reviews after purchase.</small>
          <div className="grid" style={{marginTop:10}}>
            {reviews.length === 0 && <div className="card">No reviews yet. Be the first 😈</div>}
            {reviews.map((r: { id: string: name; string; rating: number }) => (
              <div key={r.id} className="card">
                <div style={{display:"flex", justifyContent:"space-between", gap:10}}>
                  <b>{r.name}</b>
                  <span className="badge">{r.isVerified ? "Verified" : "Unverified"} • ⭐ {r.rating}/5</span>
                </div>
                <p style={{color:"var(--muted)"}}>{r.body}</p>
                {r.photoUrl && (<Image src={r.photoUrl} alt="Review photo" width={900} height={900} style={{borderRadius:12, border:"1px solid var(--border)"}} />)}
              </div>
            ))}
          </div>

          <div className="hr" />
          <Link className="btn" href="/review">Leave a review (requires your purchase link)</Link>
        </div>
      </div>
    </main>
  );
}
