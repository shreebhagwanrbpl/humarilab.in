/**
 * Website Configuration & Domain Normalization for Master Catalog Synchronization
 */

export const COMPANY_CONFIG = {
  id: "rajbiosis",
  name: "Raj Biosis",
  displayName: "Raj Biosis",
};

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
 * Returns canonical website variants strictly for humarilab.in
 */
export function getWebsiteVariants() {
  return [
    "humarilabin",
    "humarilab.in",
    "humarilab",
  ];
}

/**
 * Automatically detects current website ID and Company config
 */
export function getWebsiteConfig() {
  let detectedId = "humarilabin";
  let domain = "humarilab.in";

  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      domain = host;
      detectedId = normalizeDomainId(host);
    }
  }

  return {
    companyId: "rajbiosis",
    companyName: "Raj Biosis",
    websiteId: detectedId || "humarilabin",
    domain: domain || "humarilab.in",
    variants: getWebsiteVariants(),
  };
}

/**
 * Bulletproof Visibility Filter:
 * 1. isPublished === false -> Hidden (false)
 * 2. websiteIds is empty [] or not an array -> Hidden (false)
 * 3. websiteIds includes "all" -> Visible (true)
 * 4. websiteIds normalized contains any of the website variants -> Visible (true)
 * 5. Otherwise -> Hidden (false)
 */
export function isItemVisible(item, targetWebsiteId = null) {
  if (!item || typeof item !== "object") return false;

  // 1. Explicitly unpublished
  if (item.isPublished === false) return false;

  // 2. Empty or missing websiteIds
  if (!Array.isArray(item.websiteIds) || item.websiteIds.length === 0) {
    return false;
  }

  // 3. Includes "all"
  if (
    item.websiteIds.some(
      (w) => typeof w === "string" && w.trim().toLowerCase() === "all"
    )
  ) {
    return true;
  }

  // 4. Normalized variant match
  const siteVariants = targetWebsiteId
    ? [normalizeDomainId(targetWebsiteId)]
    : getWebsiteVariants().map(normalizeDomainId);

  const normalizedItemSites = item.websiteIds.map((w) =>
    normalizeDomainId(String(w))
  );

  return siteVariants.some((variant) =>
    normalizedItemSites.includes(variant)
  );
}
