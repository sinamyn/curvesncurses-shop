import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signSession, verifySession } from "@/lib/auth";

export default async function Account() {
  const session = verifySession(cookies().get("session")?.value);

  async function register(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const pw = String(formData.get("password") ?? "");
    if (!email || pw.length < 8) return;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return;
    const user = await prisma.user.create({ data: { email, passwordHash: hashPassword(pw) } });
    cookies().set("session", signSession({ userId: user.id, email: user.email }), { httpOnly: true, sameSite: "lax", path: "/" });
  }

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const pw = String(formData.get("password") ?? "");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;
    if (!verifyPassword(pw, user.passwordHash)) return;
    cookies().set("session", signSession({ userId: user.id, email: user.email }), { httpOnly: true, sameSite: "lax", path: "/" });
  }

  async function logout() {
    "use server";
    cookies().set("session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  }

  if (session?.userId) {
    const orders = await prisma.order.findMany({ where: { email: session.email }, orderBy: { createdAt: "desc" }, take: 20 });
    return (
      <main>
        <div className="card">
          <h1 style={{marginTop:0}}>Account</h1>
          <p style={{color:"var(--muted)"}}>Signed in as <b>{session.email}</b></p>
          <form action={logout}><button className="btn" type="submit">Log out</button></form>

          <div className="hr" />
          <h2>Order history</h2>
      {orders.length === 0 ? (
  <div className="card" style={{ background: "#fff" }}>
    No orders yet.
  </div>
) : (
  <div className="grid">
    {orders.map((o: any) => (
      <div key={o.id} className="card" style={{ background: "#fff" }}>
        <b>{o.id}</b>
        <br />
        <small>
          {new Date(o.createdAt).toLocaleString()} • {o.status} • $
          {(o.totalCents / 100).toFixed(2)}
        </small>
      </div>
    ))}
  </div>
)}
          <div className="hr" />
          <Link className="btn" href="/wishlist">Wishlist</Link>
          <Link className="btn" href="/admin" style={{marginLeft:10}}>Admin</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Account</h1>
        <p style={{color:"var(--muted)"}}>Optional. Create an account for order history + wishlist.</p>
        <div className="grid cols-2">
          <div className="card" style={{background:"#fff"}}>
            <h2>Register</h2>
            <form action={register} className="row">
              <div><label>Email</label><input name="email" type="email" required /></div>
              <div><label>Password</label><input name="password" type="password" minLength={8} required /><small>Use 8+ characters.</small></div>
              <button className="btn primary" type="submit">Create account</button>
            </form>
          </div>
          <div className="card" style={{background:"#fff"}}>
            <h2>Login</h2>
            <form action={login} className="row">
              <div><label>Email</label><input name="email" type="email" required /></div>
              <div><label>Password</label><input name="password" type="password" required /></div>
              <button className="btn" type="submit">Log in</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
