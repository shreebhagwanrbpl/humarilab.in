/**
 * Single Source of Truth for Website Configuration & Domain Normalization
 */

export const WEBSITE_ID = "humarilabin";
export const COMPANY_ID = "rajbiosis";
export const SQLITE_DB_PATH =
  process.env.SQLITE_DB_PATH || "../SuperAdminRBPL/data/catalog.db";

/**
 * Normalizes domain or website identifier by stripping protocol, www, dots, hyphens, underscores and whitespace.
 * e.g., "humarilab.in" -> "humarilabin", "https://www.humarilab.in/" -> "humarilabin"
 */
export function normalizeDomainId(str = "") {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Normalizes slug string safely
 */
export const makeSlug = (text = "") =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Bulletproof Visibility Filter with Strict Exact Matching:
 * 1. item.isPublished === false -> HIDE (false)
 * 2. item.status === "inactive" || "draft" -> HIDE (false)
 * 3. item.websiteIds is empty [] (0 access) -> HIDE (false)
 * 4. item.websiteIds includes "all" or exact normalized WEBSITE_ID -> SHOW (true)
 * 5. item.websiteIds is undefined/null -> default SHOW (true)
 * 6. Otherwise -> HIDE (false)
 */
export function isItemVisibleOnWebsite(item, targetWebsiteId = WEBSITE_ID) {
  if (!item || typeof item !== "object") return false;

  // 1. Explicitly unpublished
  if (item.isPublished === false) return false;

  // 2. Inactive or draft status
  if (item.status === "inactive" || item.status === "draft") return false;

  // 3. WebsiteIds array check
  if (Array.isArray(item.websiteIds)) {
    if (item.websiteIds.length === 0) return false;

    const targetNorm = normalizeDomainId(targetWebsiteId);
    return item.websiteIds.some((w) => {
      const n = normalizeDomainId(String(w));
      return n === "all" || n === targetNorm;
    });
  }

  // 4. Undefined / null websiteIds defaults to visible
  if (item.websiteIds === undefined || item.websiteIds === null) {
    return true;
  }

  return false;
}
