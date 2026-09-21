import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const products = await fetchFullCatalog();

    const lines = [
      "# Humarilab (Raj Biosis) Product Catalog & Healthcare Supply",
      "",
      "> Comprehensive catalog of biomedical equipment, diagnostic systems, analyzers, and laboratory supplies from Raj Biosis.",
      "",
      "## Available Products",
      "",
    ];

    if (products.length === 0) {
      lines.push("No products currently assigned to this catalog.");
    } else {
      // Group by category
      const categories = {};
      products.forEach((p) => {
        const cat = p.category || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(p);
      });

      for (const [catName, prods] of Object.entries(categories)) {
        lines.push(`### ${catName}`);
        lines.push("");
        prods.forEach((prod) => {
          const title = prod.title || prod.name || "Product";
          const brand = prod.brand ? ` | Brand: ${prod.brand}` : "";
          const model = prod.model ? ` | Model: ${prod.model}` : "";
          const price = prod.price ? ` | Price: ₹${prod.price}` : "";
          const url = `https://humarilab.in/items/${prod.slug}`;
          const desc = prod.desc || prod.description || "";
          lines.push(`- **[${title}](${url})**${brand}${model}${price}`);
          if (desc) {
            lines.push(`  - ${desc.slice(0, 180)}...`);
          }
        });
        lines.push("");
      }
    }

    lines.push("---");
    lines.push("Company: Raj Biosis (Humarilab)");
    lines.push("Website: https://humarilab.in");
    lines.push("Location: India");

    return new Response(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("LLMs.txt Generation Error:", error);
    return new Response("# Error generating LLMs catalog\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
