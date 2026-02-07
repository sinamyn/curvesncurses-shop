import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Success({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id;
  const order = sessionId ? await prisma.order.findUnique({ where: { stripeSessionId: sessionId } }) : null;

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Order received</h1>
        <p style={{color:"var(--muted)"}}>Thank you. If your payment completed, you’ll get a confirmation email and later a shipping update.</p>
        {order && (
          <div className="card" style={{background:"#fff"}}>
            <b>Order ID:</b> {order.id}<br/>
            <b>Status:</b> {order.status}<br/>
            <b>Total:</b> ${(order.totalCents/100).toFixed(2)}
          </div>
        )}
        <div className="hr" />
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <Link className="btn primary" href="/shop">Back to shop</Link>
          <Link className="btn" href="/track">Track an order</Link>
        </div>
      </div>
    </main>
  );
}
