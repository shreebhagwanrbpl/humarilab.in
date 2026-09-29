import {
  getFullCatalog,
  getPageData,
  getDistricts as getDistrictsFromDb,
  getDistrictData as getDistrictDataFromDb,
} from "./sqliteDb.js";
import { WEBSITE_ID, COMPANY_ID } from "./catalog-utils.js";

/**
 * Server-side catalog fetcher.
 * Directly calls native SQLite catalog.db without long-lived cache locks,
 * ensuring real-time visibility updates from SQLite SuperAdmin reflect in ~2ms.
 */
export async function fetchFullCatalog() {
  const start = performance.now();
  const products = getFullCatalog(COMPANY_ID, WEBSITE_ID);
  const end = performance.now();
  console.log(
    `[data-fetcher-server] fetchFullCatalog took ${(end - start).toFixed(
      2
    )}ms, returned ${products.length} visible products for ${WEBSITE_ID}`
  );
  return products;
}

export async function fetchDistricts() {
  return getDistrictsFromDb(WEBSITE_ID, COMPANY_ID);
}

export async function fetchDistrictData(district) {
  return getDistrictDataFromDb(district, WEBSITE_ID, COMPANY_ID);
}

export async function fetchHomeData() {
  return getPageData("home", WEBSITE_ID, COMPANY_ID);
}

export async function fetchContactData() {
  return getPageData("contact", WEBSITE_ID, COMPANY_ID);
}

export async function fetchServicesData() {
  return getPageData("services", WEBSITE_ID, COMPANY_ID);
}
