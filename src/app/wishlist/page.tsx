import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export default async function Wishlist() {
  const session = verifySession(cookies().get("session")?.value);
  if (!session?.userId) {
    return (
      <main>
        <div className="card">
          <h1 style={{marginTop:0}}>Wishlist</h1>
          <p style={{color:"var(--muted)"}}>Please log in to use wishlist.</p>
          <Link className="btn primary" href="/account">Go to account</Link>
        </div>
      </main>
    );
  }

  const items = await prisma.wishlistItem.findMany({ where: { userId: session.userId }, take: 100 });
  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Wishlist</h1>
        <p style={{color:"var(--muted)"}}>Wishlist is wired. Product tiles can be expanded next.</p>
        <Link className="btn" href="/shop">Shop</Link>
        <div className="hr" />
        <div className="card" style={{background:"#fff"}}><small>Saved items: {items.length}</small></div>
      </div>
    </main>
  );
}
