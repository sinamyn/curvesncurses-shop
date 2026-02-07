import Link from "next/link";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/cart";

export default async function CheckoutPage() {
  const cart = getCart();
  if (cart.length === 0) redirect("/cart");

  async function create(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    if (!email || !name) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/create-checkout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name }),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.url) redirect(data.url);
  }

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Checkout</h1>
        <p style={{color:"var(--muted)"}}>Guest checkout first. You can create an account after purchase.</p>

        <form action={create} className="row">
          <div className="row two">
            <div><label>Name</label><input name="name" required /></div>
            <div>
              <label>Email</label>
              <input name="email" type="email" required />
              <small>We’ll send confirmation + tracking + your verified review link.</small>
            </div>
          </div>
          <button className="btn primary" type="submit">Continue to Payment</button>
          <Link className="btn" href="/cart">Back to cart</Link>
        </form>

        <div className="hr" />
        <small>Payments: cards + Apple Pay + Google Pay (via Stripe).</small>
      </div>
    </main>
  );
}
