import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { verifySession } from "@/lib/auth";

export default async function Admin() {
  const session = verifySession(cookies().get("session")?.value);
  const ok = session?.email && env.adminEmail && session.email.toLowerCase() === env.adminEmail.toLowerCase();

  if (!ok) {
    return (
      <main>
        <div className="card">
          <h1 style={{marginTop:0}}>Admin</h1>
          <p style={{color:"var(--muted)"}}>You must be logged in as the admin email.</p>
          <Link className="btn primary" href="/account">Go to account</Link>
        </div>
      </main>
    );
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Admin Dashboard</h1>
        <p style={{color:"var(--muted)"}}>Fast-launch admin: view products + orders. Add create/edit next.</p>

        <div className="grid cols-2">
          <div className="card" style={{background:"#fff"}}>
            <h2>Recent Products</h2>
            {products.map((p: any) => (
              <div key={p.id} style={{padding:"8px 0", borderBottom:"1px solid var(--border)"}}>
                <b>{p.name}</b><br/>
                <small>{p.category} • ${(p.priceCents/100).toFixed(2)} • {p.inventoryMode}{p.inventoryMode==="LIMITED" ? ` (${p.stockQty ?? 0})` : ""}</small>
              </div>
            ))}
          </div>
          <div className="card" style={{background:"#fff"}}>
            <h2>Recent Orders</h2>
            {orders.map((o: any) => (
              <div key={o.id} style={{padding:"8px 0", borderBottom:"1px solid var(--border)"}}>
                <b>{o.id}</b><br/>
                <small>{o.status} • {o.email} • ${(o.totalCents/100).toFixed(2)}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="hr" />
        <Link className="btn" href="/shop">View store</Link>
      </div>
    </main>
  );
}
