import {
  getFullCatalog,
  getPageData,
  getDistricts as getDistrictsFromDb,
  getDistrictData as getDistrictDataFromDb,
} from "./mongoDb.js";
import { WEBSITE_ID, COMPANY_ID } from "./catalog-utils.js";

/**
 * Server-side catalog fetcher connected to MongoDB Atlas (SuperAdmin).
 */
export async function fetchFullCatalog() {
  const start = performance.now();
  const products = await getFullCatalog(COMPANY_ID, WEBSITE_ID);
  const end = performance.now();
  console.log(
    `[data-fetcher-server] fetchFullCatalog took ${(end - start).toFixed(
      2
    )}ms, returned ${products.length} visible products for ${WEBSITE_ID}`
  );
  return products;
}

export async function fetchDistricts() {
  return await getDistrictsFromDb(WEBSITE_ID, COMPANY_ID);
}

export async function fetchDistrictData(district) {
  return await getDistrictDataFromDb(district, WEBSITE_ID, COMPANY_ID);
}

export async function fetchHomeData() {
  return await getPageData("home", WEBSITE_ID, COMPANY_ID);
}

export async function fetchContactData() {
  return await getPageData("contact", WEBSITE_ID, COMPANY_ID);
}

export async function fetchServicesData() {
  return await getPageData("services", WEBSITE_ID, COMPANY_ID);
}
