import { fetchFullCatalog as fetchMasterCatalog } from "./data-fetcher";

/**
 * Server-side catalog fetcher.
 * Directly calls the authoritative Master Catalog fetcher without long-lived cache locks,
 * ensuring real-time visibility updates from the SuperAdmin panel reflect instantly.
 */
export async function fetchFullCatalog() {
  const start = performance.now();
  const products = await fetchMasterCatalog();
  const end = performance.now();
  console.log(
    `[data-fetcher-server] fetchFullCatalog took ${(end - start).toFixed(
      2
    )}ms, returned ${products.length} visible products`
  );
  return products;
}
