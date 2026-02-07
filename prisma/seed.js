import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  const products = [
    {
      name: "Because Basic Was Never Your Thing (Sticker)",
      category: "Stickers",
      description: "Loud, durable, and absolutely not basic. Stick it on your bottle, helmet, toolbox, or emotional support tumbler.",
      type: "REGULAR",
      priceCents: 499,
      weightOz: 0.2,
      images: ["https://placehold.co/900x900/png?text=Sticker+1"],
      inventoryMode: "MADE_TO_ORDER"
    },
    {
      name: "Feminine Outlaw Pack (Bundle)",
      category: "Bundles & Packs",
      description: "A mixed bundle of our fave outlaw energy designs. Perfect gift. Perfect chaos.",
      type: "BUNDLE",
      priceCents: 1999,
      weightOz: 1.0,
      images: ["https://placehold.co/900x900/png?text=Bundle"],
      inventoryMode: "LIMITED",
      stockQty: 50
    },
    {
      name: "Gun Safe Magnet (Magnet)",
      category: "Magnets",
      description: "Slaps clean on fridge, locker, toolbox, or gun safe. Strong hold. Strong attitude.",
      type: "REGULAR",
      priceCents: 799,
      weightOz: 2.5,
      images: ["https://placehold.co/900x900/png?text=Magnet"],
      inventoryMode: "MADE_TO_ORDER"
    },
    {
      name: "Ready-To-Ride Keychain (Keychain)",
      category: "Keychains & Accessories",
      description: "Keys ready. Ride ready. Attitude included at no extra charge.",
      type: "REGULAR",
      priceCents: 1299,
      weightOz: 3.0,
      images: ["https://placehold.co/900x900/png?text=Keychain"],
      inventoryMode: "MADE_TO_ORDER"
    }
  ];

  for (const p of products) {
    const slug = slugify(p.name);
    await prisma.product.upsert({
      where: { slug },
      update: { ...p, slug },
      create: { ...p, slug }
    });
  }
  console.log("Seeded products:", products.length);
}
main().catch(e=>{console.error(e);process.exit(1);}).finally(async()=>{await prisma.$disconnect();});
