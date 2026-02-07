import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

const categories = ["Stickers","Magnets","Keychains & Accessories","Biker Collection","Blue-Collar / Trades","Memorial / Tribute","Bundles & Packs"];

export default async function Shop({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const q = searchParams.q?.trim();
  const cat = searchParams.cat?.trim();
  const where: any = { isActive: true };
  if (cat) where.category = cat;
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <main>
      <div className="grid" style={{gap:12}}>
        <div className="card">
          <h1 style={{marginTop:0}}>Shop</h1>
          <form action="/shop" className="row two">
            <div>
              <label>Search</label>
              <input name="q" defaultValue={q ?? ""} placeholder="Try: stickers, magnet, biker..." />
              <small>Smart suggestions are planned next.</small>
            </div>
            <div>
              <label>Category</label>
              <select name="cat" defaultValue={cat ?? ""}>
                <option value="">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"flex", gap:10}}>
              <button className="btn primary" type="submit">Search</button>
              <Link className="btn" href="/shop">Reset</Link>
            </div>
          </form>
        </div>

        <div className="grid cols-3">
          {products.map(p => (
            <Link key={p.id} className="card product-card" href={`/shop/${p.slug}`}>
              <Image src={p.images[0] ?? "https://placehold.co/900x900/png"} alt={p.name} width={800} height={800} />
              <div style={{marginTop:10}}>
                <div style={{display:"flex", justifyContent:"space-between", gap:10}}>
                  <b>{p.name}</b>
                  <span className="badge">{p.category}</span>
                </div>
                <small>${(p.priceCents/100).toFixed(2)}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
