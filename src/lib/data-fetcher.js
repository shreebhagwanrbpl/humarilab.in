/**
 * Master Catalog and Site Data Fetcher for humarilab.in
 * Connects directly to MongoDB Atlas SuperAdmin database
 */

import { WEBSITE_ID, COMPANY_ID, makeSlug } from "./catalog-utils.js";

export { WEBSITE_ID, COMPANY_ID, makeSlug };

/**
 * Universal Catalog Fetcher (Server + Client)
 */
export async function fetchFullCatalog(options = {}) {
  // If running on server side, read directly from MongoDB Atlas
  if (typeof window === "undefined") {
    try {
      const { getFullCatalog } = await import("./mongoDb.js");
      const products = await getFullCatalog(COMPANY_ID, WEBSITE_ID);
      return products;
    } catch (err) {
      console.error("[data-fetcher] Server MongoDB getFullCatalog error:", err);
    }
  }

  // If running in browser or fallback, fetch from local API endpoint
  try {
    const url = options.forceRefresh
      ? `/api/catalog?t=${Date.now()}`
      : "/api/catalog";
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.products) ? json.products : [];
    }
  } catch (err) {
    console.error("[data-fetcher] Browser fetchFullCatalog error:", err);
  }

  return [];
}

/**
 * Universal Page Data Fetcher (Server + Client)
 */
export async function fetchPageData(pageType = "home") {
  if (typeof window === "undefined") {
    try {
      const { getPageData } = await import("./mongoDb.js");
      const data = await getPageData(pageType, WEBSITE_ID, COMPANY_ID);
      return data;
    } catch (err) {
      console.error(`[data-fetcher] Server getPageData(${pageType}) error:`, err);
    }
  }

  try {
    const res = await fetch(`/api/site-data?type=${pageType}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch (err) {
    console.error(`[data-fetcher] Browser fetchPageData(${pageType}) error:`, err);
  }

  return null;
}

export async function fetchHomeData(options = {}) {
  return fetchPageData("home");
}

export async function fetchContactData(options = {}) {
  return fetchPageData("contact");
}

export async function fetchServicesData(options = {}) {
  return fetchPageData("services");
}

export async function fetchDistricts(options = {}) {
  if (typeof window === "undefined") {
    try {
      const { getDistricts } = await import("./mongoDb.js");
      return await getDistricts(WEBSITE_ID, COMPANY_ID);
    } catch (err) {
      console.error("[data-fetcher] Server getDistricts error:", err);
    }
  }

  try {
    const res = await fetch("/api/site-data?type=districts", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [];
    }
  } catch (err) {
    console.error("[data-fetcher] Browser fetchDistricts error:", err);
  }

  return [];
}

export async function fetchDistrictData(district, options = {}) {
  if (!district) return null;
  return fetchPageData(district);
}
