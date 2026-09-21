import { Suspense } from "react";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Biomedical & Laboratory Products | Raj Biosis",
  description: "Browse our comprehensive catalog of biochemistry analyzers, CBC machines, ELISA readers, rapid test kits, and laboratory reagents.",
  alternates: {
    canonical: "https://humarilab.in/items",
  },
};

export default async function ProductsPage({ district = null, city = null }) {
  // Fetch fresh catalog from Master Catalog
  const allProducts = await fetchFullCatalog();

  return (
    <Suspense fallback={<div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-500 font-semibold">Loading Products...</div>}>
      <ProductsClient
        initialProducts={allProducts}
        district={district}
        city={city}
      />
    </Suspense>
  );
}