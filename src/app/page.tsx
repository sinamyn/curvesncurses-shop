import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export default async function Home() {
  const best = await prisma.product.findMany({ where: { isActive: true }, take: 6, orderBy: { createdAt: "desc" } });
  return (
    <main>
      <section className="hero grid cols-2">
        <div>
          <div className="kicker">Feminine Outlaw • Biker • Trades</div>
          <h1>{env.siteName}</h1>
          <p style={{color:"var(--muted)", fontSize:16, marginTop:0}}>
            {env.tagline} Stickers, magnets, keychains, bundles, and customs built tough with pretty sharp edges.
          </p>
          <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:14}}>
            <Link className="btn primary" href="/shop">Shop the Sass</Link>
            <Link className="btn" href="/custom">Start a Custom Order</Link>
          </div>
          <div className="hr" />
          <div className="grid cols-3">
            <div className="card"><b>Bulk Discounts</b><br/><small>Same design only: 10+ (10%), 25+ (20%), 50+ (30%).</small></div>
            <div className="card"><b>Shipping</b><br/><small>Weight-based, stamp-rate for small sticker orders. Free over $50.</small></div>
            <div className="card"><b>Verified Photo Reviews</b><br/><small>Real buyers, real pics, real hype.</small></div>
          </div>
        </div>
        <div className="card">
          <h2 style={{marginTop:0}}>Featured</h2>
          <div className="grid cols-3" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
            {best.slice(0,4).map(p => (
              <Link key={p.id} className="product-card" href={`/shop/${p.slug}`}>
                <Image src={p.images[0] ?? "https://placehold.co/900x900/png"} alt={p.name} width={450} height={450} />
                <div style={{marginTop:8}}><b style={{fontSize:13}}>{p.name}</b><br/><small>${(p.priceCents/100).toFixed(2)}</small></div>
              </Link>
            ))}
          </div>
          <div className="hr" />
          <Link className="btn" href="/shop">Browse all</Link>
        </div>
      </section>

      <section className="grid" style={{marginTop:18}}>
        <div className="card">
          <h2>Best Sellers</h2>
          <div className="grid cols-3">
            {best.slice(0,3).map(p => (
              <Link key={p.id} className="product-card" href={`/shop/${p.slug}`}>
                <Image src={p.images[0] ?? "https://placehold.co/900x900/png"} alt={p.name} width={600} height={600} />
                <div style={{marginTop:8}}><b>{p.name}</b><br/><small>${(p.priceCents/100).toFixed(2)}</small></div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card"><h2>New Arrivals</h2><small>Fresh drops, fresh chaos.</small></div>
        <div className="card"><h2>Limited Drops</h2><small>When they’re gone, they’re gone.</small></div>
      </section>
    </main>
  );
}
