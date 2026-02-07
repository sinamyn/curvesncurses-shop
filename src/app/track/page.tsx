import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Track({ searchParams }: { searchParams: { email?: string; order?: string } }) {
  const email = (searchParams.email ?? "").trim();
  const orderId = (searchParams.order ?? "").trim();
  const order = email && orderId ? await prisma.order.findFirst({ where: { id: orderId, email } }) : null;

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Track your order</h1>
        <p style={{color:"var(--muted)"}}>Branded tracking page + carrier links can be expanded next. For now, verify your email + order ID.</p>
        <form action="/track" className="row">
          <div className="row two">
            <div><label>Email</label><input name="email" type="email" defaultValue={email} required /></div>
            <div><label>Order ID</label><input name="order" defaultValue={orderId} required /></div>
          </div>
          <button className="btn primary" type="submit">Track</button>
        </form>

        {order && (
          <>
            <div className="hr" />
            <div className="card" style={{background:"#fff"}}>
              <b>Status:</b> {order.status}<br/>
              <b>Total:</b> ${(order.totalCents/100).toFixed(2)}<br/>
              <small>Carrier tracking will appear here after you add fulfillment info in Admin.</small>
            </div>
          </>
        )}
        <div className="hr" />
        <Link className="btn" href="/shop">Shop</Link>
      </div>
    </main>
  );
}
