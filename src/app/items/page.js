import { Suspense } from "react";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "./ProductsClient";

export const revalidate = 3600; // Revalidate cache every hour

export const metadata = {
  title: "Biomedical & Laboratory Products | Raj Biosis",
  description: "Browse our comprehensive catalog of biochemistry analyzers, CBC machines, ELISA readers, rapid test kits, and laboratory reagents.",
  alternates: {
    canonical: "https://humarilab.in/items",
  },
};

export default async function ProductsPage({ district = null, city = null }) {
  // Fetch full catalog from server cache
  const allProducts = await fetchFullCatalog();

  return (
    <Suspense fallback={<div className="container-custom py-20 text-center text-slate-500 font-semibold">Loading Products...</div>}>
      <ProductsClient
        initialProducts={allProducts}
        district={district}
        city={city}
      />
    </Suspense>
  );
}