import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addToCart } from "@/lib/cart";
import { bulkDiscountPercent } from "@/lib/discounts";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return (
      <main>
        <div className="card">
          <h1 style={{ marginTop: 0 }}>Not found</h1>
          <p style={{ color: "var(--muted)" }}>That product doesn’t exist.</p>
          <Link className="btn primary" href="/shop">
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((sum: number, r: { rating: number}) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  async function add(formData: FormData) {
    "use server";
    const qty = Math.max(1, Number(formData.get("qty") ?? 1));
  await addToCart({
  productId: product.id,
  slug: product.slug,
  name: product.name,
  category: product.category,
  priceCents: product.priceCents,
  weightOz: Number(product.weightOz ?? 0),
  qty,
});

  const bulkExamples = [10, 25, 50].map((q) => ({
    qty: q,
    pct: bulkDiscountPercent(q),
  }));

  const imgSrc =
    (product.images?.[0] as string | undefined) ??
    "https://placehold.co/900x900/png";

  return (
    <main>
      <div className="grid cols-2">
        <div className="card">
          <Image
            src={imgSrc}
            alt={product.name}
            width={1000}
            height={1000}
          />
        </div>

        <div className="card">
          <span className="badge">{product.category}</span>

          <h1 style={{ marginTop: 10 }}>{product.name}</h1>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <b style={{ fontSize: 22 }}>
              ${(product.priceCents / 100).toFixed(2)}
            </b>

            {avg && (
              <span className="badge">
                ⭐ {avg} ({reviews.length})
              </span>
            )}

            {product.inventoryMode === "LIMITED" && (
              <span className="badge">
                Limited: {product.stockQty ?? 0} left
              </span>
            )}
          </div>

          <p style={{ color: "var(--muted)" }}>{product.description}</p>

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
                <div className="card" style={{ padding: 12 }}>
                  {bulkExamples.map((ex) => (
                    <div
                      key={ex.qty}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{ex.qty}+</span>
                      <b>{ex.pct}% off</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn primary" type="submit">
              Add to cart
            </button>

            <Link className="btn" href="/cart">
              View cart
            </Link>
          </form>

          <div style={{ marginTop: 12 }}>
            <Link href="/shop">← Back to shop</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
