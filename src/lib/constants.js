/**
 * Website Configuration & Domain Normalization for Master Catalog Synchronization
 */

import {
  WEBSITE_ID,
  COMPANY_ID,
  normalizeDomainId,
  isItemVisibleOnWebsite,
} from "./catalog-utils.js";

export { WEBSITE_ID, COMPANY_ID, normalizeDomainId, isItemVisibleOnWebsite };

export const COMPANY_CONFIG = {
  id: COMPANY_ID,
  name: "Raj Biosis",
  displayName: "Raj Biosis",
};

/**
 * Returns canonical website variants strictly for WEBSITE_ID
 */
export function getWebsiteVariants() {
  return [WEBSITE_ID];
}

/**
 * Automatically detects current website ID and Company config
 */
export function getWebsiteConfig() {
  let detectedId = WEBSITE_ID;
  let domain = "humarilab.in";

  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      domain = host;
      detectedId = normalizeDomainId(host);
    }
  }

  return {
    companyId: COMPANY_ID,
    companyName: "Raj Biosis",
    websiteId: detectedId || WEBSITE_ID,
    domain: domain || "humarilab.in",
    variants: getWebsiteVariants(),
  };
}

/**
 * Compatibility wrapper for isItemVisibleOnWebsite
 */
export function isItemVisible(item, targetWebsiteId = WEBSITE_ID) {
  return isItemVisibleOnWebsite(item, targetWebsiteId || WEBSITE_ID);
}
