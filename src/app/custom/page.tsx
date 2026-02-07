import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CustomSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  type: z.enum(["SIMPLE","COMPLEX"]),
  productType: z.string().min(1),
  colors: z.string().optional().default(""),
  text: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  qty: z.number().int().min(1).default(1),
});

export default function CustomOrders() {
  async function submit(formData: FormData) {
    "use server";
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      type: String(formData.get("type") ?? "SIMPLE"),
      productType: String(formData.get("productType") ?? ""),
      colors: String(formData.get("colors") ?? ""),
      text: String(formData.get("text") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      qty: Number(formData.get("qty") ?? 1),
    };
    const parsed = CustomSchema.safeParse(payload);
    if (!parsed.success) return;

    await prisma.order.create({
      data: { email: parsed.data.email, status: "CUSTOM_REQUEST", subtotalCents: 0, shippingCents: 0, totalCents: 0 }
    });
  }

  return (
    <main>
      <div className="card">
        <h1 style={{marginTop:0}}>Custom Orders</h1>
        <p style={{color:"var(--muted)"}}>Simple customs can be priced instantly later. Complex customs get a quote from you.</p>

        <form action={submit} className="row">
          <div className="row two">
            <div><label>Your name</label><input name="name" required /></div>
            <div><label>Email</label><input name="email" type="email" required /></div>
          </div>

          <div className="row two">
            <div>
              <label>Custom type</label>
              <select name="type" defaultValue="SIMPLE">
                <option value="SIMPLE">Simple (text/color options)</option>
                <option value="COMPLEX">Complex (quote needed)</option>
              </select>
            </div>
            <div>
              <label>What are we making?</label>
              <select name="productType" defaultValue="Sticker">
                <option>Sticker</option><option>Magnet</option><option>Keychain</option><option>Bundle Pack</option><option>Other</option>
              </select>
            </div>
          </div>

          <div className="row two">
            <div><label>Colors (optional)</label><input name="colors" placeholder="Red/black, Seahawks colors, etc." /></div>
            <div><label>Quantity</label><input name="qty" type="number" min={1} defaultValue={1} /></div>
          </div>

          <div><label>Text (optional)</label><input name="text" placeholder="Exact wording you want" /></div>
          <div><label>Notes</label><textarea name="notes" rows={5} placeholder="Describe the vibe (feminine outlaw, biker rally, memorial, trades, etc.)" /></div>
          <div><label>Reference image link (optional)</label><input name="imageUrl" placeholder="Paste a link to your image" /></div>

          <button className="btn primary" type="submit">Send Custom Request</button>
          <small>Fast launch: requests are saved for admin review. Email/SMS can be added next.</small>
        </form>
      </div>
    </main>
  );
}
