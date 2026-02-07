import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ReviewPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = (searchParams.token ?? "").trim();

  async function submit(formData: FormData) {
    "use server";
    const token = String(formData.get("token") ?? "").trim();
    const productSlug = String(formData.get("productSlug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const rating = Number(formData.get("rating") ?? 5);
    const body = String(formData.get("body") ?? "").trim();
    const photoUrl = String(formData.get("photoUrl") ?? "").trim();

    const rt = await prisma.reviewToken.findUnique({ where: { token } });
    if (!rt || rt.usedAt || rt.expiresAt < new Date()) return;

    const product = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (!product) return;

    await prisma.review.create({
      data: { productId: product.id, name, rating: Math.max(1, Math.min(5, rating)), body, photoUrl: photoUrl || null, isVerified: true }
    });

    await prisma.reviewToken.update({ where: { token }, data: { usedAt: new Date() } });
  }

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Leave a Verified Review</h1>
        <p style={{color:"var(--muted)"}}>You’ll get a review link after purchase. Paste your token if you have it.</p>

        <form action={submit} className="row">
          <div className="row two">
            <div><label>Token</label><input name="token" defaultValue={token} required /></div>
            <div><label>Product slug</label><input name="productSlug" required /></div>
          </div>
          <div className="row two">
            <div><label>Your name</label><input name="name" required /></div>
            <div>
              <label>Rating</label>
              <select name="rating" defaultValue="5">
                <option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
              </select>
            </div>
          </div>
          <div><label>Review</label><textarea name="body" rows={5} required /></div>
          <div><label>Photo URL (optional)</label><input name="photoUrl" /></div>
          <button className="btn primary" type="submit">Submit review</button>
        </form>

        <div className="hr" />
        <Link className="btn" href="/shop">Back to shop</Link>
      </div>
    </main>
  );
}
