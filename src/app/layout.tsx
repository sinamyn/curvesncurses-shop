import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: env.siteName,
  description: env.tagline,
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="nav">
            <Link href="/" className="brand">
              <b>{env.siteName}</b>
              <span>{env.tagline}</span>
            </Link>
            <nav style={{display:"flex", gap:10, flexWrap:"wrap", justifyContent:"flex-end"}}>
              <Link className="pill" href="/shop">Shop</Link>
              <Link className="pill" href="/custom">Custom Orders</Link>
              <Link className="pill" href="/account">Account</Link>
              <Link className="pill" href="/cart">Cart</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">
            <div className="hr" />
            <div style={{display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap"}}>
              <span>© {new Date().getFullYear()} {env.siteName}</span>
              <span>Free shipping over $50 • Verified photo reviews • Because basic was never your thing.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
