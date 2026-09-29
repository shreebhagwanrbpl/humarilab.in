/**
 * SQLite Admin API Client for humarilab.in
 * Connects directly to the central SQLite-backed Admin API (admin.rajbiosis.app / http://localhost:3000)
 */

import { getWebsiteConfig, isItemVisible } from "./constants.js";
import { WEBSITE_ID, COMPANY_ID } from "./catalog-utils.js";

export const ADMIN_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  process.env.SQLITE_ADMIN_API_URL ||
  "https://admin.rajbiosis.app";

/**
 * Returns candidate backend URLs in priority order:
 * 1. Explicit env variables (ADMIN_API_BASE_URL / ADMIN_API_URL / SQLITE_ADMIN_API_URL)
 * 2. Local dev server (http://localhost:3000)
 * 3. Production backend (https://admin.rajbiosis.app)
 */
export function getAdminBaseUrls() {
  const envUrl =
    process.env.ADMIN_API_BASE_URL ||
    process.env.ADMIN_API_URL ||
    process.env.SQLITE_ADMIN_API_URL;

  if (envUrl) {
    const clean = envUrl.replace(/\/+$/, "");
    return [clean, "http://localhost:3000", "https://admin.rajbiosis.app"].filter(
      (u, idx, arr) => arr.indexOf(u) === idx
    );
  }

  // Default priority: try local admin first during development, then production admin
  return ["http://localhost:3000", "https://admin.rajbiosis.app"];
}

/**
 * Creates a normalized admin API request URL
 */
export function getAdminApiUrl(base = ADMIN_API_BASE_URL, endpoint = "", params = {}) {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${cleanBase}${cleanEndpoint}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });

  return url.toString();
}

/**
 * Helper to slugify text safely
 */
export const makeSlug = (text = "") =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Robust parsing for contact information coming from Admin
 * Extracts all phone numbers, email addresses, and locations
 */
export function parseContactInfo(contactInfo = []) {
  if (!Array.isArray(contactInfo)) {
    return {
      phones: [],
      emails: [],
      addresses: [],
      address: "",
      hours: "",
      primaryPhone: "",
      primaryEmail: "",
      whatsappNumber: "",
    };
  }

  const phoneItem = contactInfo.find(
    (x) =>
      x &&
      typeof x === "object" &&
      /phone|mobile|whatsapp|contact|tel/i.test(x.label || "")
  );

  const emailItem = contactInfo.find(
    (x) =>
      x &&
      typeof x === "object" &&
      /email|mail/i.test(x.label || "")
  );

  const addressItem = contactInfo.find(
    (x) =>
      x &&
      typeof x === "object" &&
      /address|location|office/i.test(x.label || "")
  );

  const hoursItem = contactInfo.find(
    (x) =>
      x &&
      typeof x === "object" &&
      /hours|time|timing/i.test(x.label || "")
  );

  const extractList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.flatMap((v) => extractList(v));
    }
    if (typeof val === "string") {
      return val
        .split(/[\n,;/]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [String(val).trim()].filter(Boolean);
  };

  const phones = extractList(phoneItem?.value);
  const emails = extractList(emailItem?.value);
  const addresses = extractList(addressItem?.value);
  const hours =
    typeof hoursItem?.value === "string" ? hoursItem.value.trim() : "";

  const primaryPhone = phones[0] || "";
  const primaryEmail = emails[0] || "";
  const whatsappNumber = primaryPhone.replace(/[^\d+]/g, "");

  return {
    phones,
    emails,
    addresses,
    address:
      addresses.join(", ") ||
      (typeof addressItem?.value === "string" ? addressItem.value : ""),
    hours,
    primaryPhone,
    primaryEmail,
    whatsappNumber,
  };
}

/**
 * Parse Admin Data into standard media items supporting ANY combination of images & videos
 */
export function parseMediaFromData(d) {
  const list = [];
  const seenUrls = new Set();

  if (!d || typeof d !== "object") return list;

  // 1. Primary: SuperAdmin `media` array
  if (Array.isArray(d.media) && d.media.length > 0) {
    d.media.forEach((item, idx) => {
      const url = typeof item === "string" ? item : item.url;
      const type =
        item.type ||
        (url?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? "video" : "image");
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        list.push({
          id: item.id || `media-${idx}`,
          type,
          url,
          name:
            item.name ||
            (type === "video" ? `Video ${idx + 1}` : `Image ${idx + 1}`),
        });
      }
    });
  }

  // 2. Secondary / Fallback: If `media` array is empty, combine `images` and `videos`
  if (list.length === 0) {
    if (Array.isArray(d.images) && d.images.length > 0) {
      d.images.forEach((url, idx) => {
        if (url && !seenUrls.has(url)) {
          seenUrls.add(url);
          list.push({
            id: `img-${idx}`,
            type: "image",
            url,
            name: `Image ${idx + 1}`,
          });
        }
      });
    }

    const singleImg = d.imageUrl || d.image;
    if (singleImg && !seenUrls.has(singleImg)) {
      seenUrls.add(singleImg);
      list.push({
        id: `img-cover`,
        type: "image",
        url: singleImg,
        name: "Cover Image",
      });
    }

    if (Array.isArray(d.videos) && d.videos.length > 0) {
      d.videos.forEach((vUrl, idx) => {
        if (vUrl && !seenUrls.has(vUrl)) {
          seenUrls.add(vUrl);
          list.push({
            id: `vid-${idx}`,
            type: "video",
            url: vUrl,
            name: `Video ${idx + 1}`,
          });
        }
      });
    }

    if (d.videoUrl && !seenUrls.has(d.videoUrl)) {
      seenUrls.add(d.videoUrl);
      list.push({
        id: `vid-cover`,
        type: "video",
        url: d.videoUrl,
        name: "Featured Video",
      });
    }
  }

  return list;
}

/**
 * Normalizes a raw product from Admin API into the standard frontend format
 */
export function normalizeProduct(item, index = 0) {
  if (!item || typeof item !== "object") return null;

  const title = (item.title || item.name || "").trim();
  const slug =
    item.slug ||
    item.productSlug ||
    makeSlug(title || `product-${item.id || index}`);

  const images = Array.isArray(item.images)
    ? item.images.filter(Boolean)
    : item.image
    ? [item.image]
    : [];

  return {
    id: item.id || `prod-${index}`,
    uid: item.uid || item.id || `prod-${index}`,
    categoryProductId:
      item.categoryProductId || item.productId || item.category_product_id || "",
    title,
    price: item.price || "",
    desc: item.desc || item.description || "",
    description: item.desc || item.description || "",
    brand: item.brand || "",
    model: item.model || "",
    instrument: item.instrument || "",
    capacity: item.capacity || "",
    throughput: item.throughput || "",
    usage: item.usage || "",
    parameters: item.parameters || "",
    automation: item.automation || "",
    availability: item.availability || "",
    size: item.size || "",
    category: item.category || "General Products",
    subCategory: item.subCategory || item.category || "General Products",
    categoryId: item.categoryId || "general",
    subcategoryId: item.subcategoryId || "general",
    slug,
    images,
    image: images[0] || "",
    video: item.video || item.videoUrl || "",
    pdf: item.pdf || item.pdfUrl || "",
    isPublished: item.isPublished !== false,
    websiteIds: Array.isArray(item.websiteIds) ? item.websiteIds : ["all"],
    createdAt: item.createdAt || item.created_at || "",
  };
}

/**
 * Flattens and normalizes any catalog response format (flat array or nested categories)
 */
export function extractProductsFromApiResponse(data, targetWebsiteId = WEBSITE_ID) {
  if (!data) return [];

  let rawList = [];

  if (Array.isArray(data.products)) {
    rawList = data.products;
  } else if (Array.isArray(data.data)) {
    rawList = data.data;
  } else if (Array.isArray(data)) {
    rawList = data;
  } else if (Array.isArray(data.categories)) {
    data.categories.forEach((cat) => {
      const catName = cat.name || cat.category || "";
      if (Array.isArray(cat.products)) {
        cat.products.forEach((p) => {
          rawList.push({ ...p, category: p.category || catName });
        });
      }
      if (Array.isArray(cat.subcategories)) {
        cat.subcategories.forEach((sub) => {
          const subName = sub.name || sub.subCategory || "";
          if (Array.isArray(sub.products)) {
            sub.products.forEach((p) => {
              rawList.push({
                ...p,
                category: p.category || catName,
                subCategory: p.subCategory || subName,
              });
            });
          }
        });
      }
    });
  }

  const flattenedList = [];
  rawList.forEach((item, idx) => {
    if (!item) return;
    if (Array.isArray(item.products)) {
      const catName = item.name || item.category || "";
      item.products.forEach((p) => {
        flattenedList.push({ ...p, category: p.category || catName });
      });
    } else if (Array.isArray(item.subcategories)) {
      const catName = item.name || item.category || "";
      item.subcategories.forEach((sub) => {
        const subName = sub.name || sub.subCategory || "";
        if (Array.isArray(sub.products)) {
          sub.products.forEach((p) => {
            flattenedList.push({
              ...p,
              category: p.category || catName,
              subCategory: p.subCategory || subName,
            });
          });
        }
      });
    } else {
      flattenedList.push(item);
    }
  });

  return flattenedList
    .filter((item) => isItemVisible(item, targetWebsiteId))
    .map((item, idx) => normalizeProduct(item, idx))
    .filter(Boolean);
}

/**
 * Fetch catalog directly from SQLite Admin API with multi-backend fallback
 */
export async function fetchCatalogFromAdmin(options = {}) {
  const config = getWebsiteConfig();
  const websiteId = options.websiteId || config.websiteId || WEBSITE_ID;
  const companyId = options.companyId || config.companyId || COMPANY_ID;
  const baseUrls = getAdminBaseUrls();

  for (const base of baseUrls) {
    const url = getAdminApiUrl(base, "/api/catalog", {
      websiteId,
      companyId,
      t: options.forceRefresh ? Date.now() : undefined,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const products = extractProductsFromApiResponse(data, websiteId);

        if (products.length > 0 || data.success) {
          return products;
        }
      }
    } catch (err) {
      // Continue to next backend candidate
    }
  }

  return [];
}

/**
 * Fetch site page or district data directly from SQLite Admin API with multi-backend fallback
 */
export async function fetchSiteDataFromAdmin(options = {}) {
  const config = getWebsiteConfig();
  const websiteId = options.websiteId || config.websiteId || WEBSITE_ID;
  const companyId = options.companyId || config.companyId || COMPANY_ID;
  const type = options.type || "home";
  const baseUrls = getAdminBaseUrls();

  for (const base of baseUrls) {
    const url = getAdminApiUrl(base, "/api/site-data", {
      websiteId,
      companyId,
      type,
      district: options.district || undefined,
      page: options.page || undefined,
      t: options.forceRefresh ? Date.now() : undefined,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.success) {
          if (type === "districts") {
            const list = json.districts || json.data || [];
            if (Array.isArray(list) && list.length > 0) return list;
          } else if (json.data) {
            return json.data;
          }
        }
      }
    } catch (err) {
      // Continue to next backend candidate
    }
  }

  return null;
}

/**
 * Convenience helpers for page data
 */
export async function fetchHomeData(options = {}) {
  return fetchSiteDataFromAdmin({ ...options, type: "home" });
}

export async function fetchContactData(options = {}) {
  return fetchSiteDataFromAdmin({ ...options, type: "contact" });
}

export async function fetchServicesData(options = {}) {
  return fetchSiteDataFromAdmin({ ...options, type: "services" });
}

export async function fetchDistricts(options = {}) {
  return fetchSiteDataFromAdmin({ ...options, type: "districts" });
}

export async function fetchDistrictData(district, options = {}) {
  if (!district) return null;
  return fetchSiteDataFromAdmin({ ...options, type: "district", district });
}

/**
 * Submit contact query to Admin API
 */
export async function submitContactQuery(payload = {}) {
  const config = getWebsiteConfig();
  const websiteId = payload.websiteId || config.websiteId || WEBSITE_ID;
  const companyId = payload.companyId || config.companyId || COMPANY_ID;
  const baseUrls = getAdminBaseUrls();

  for (const base of baseUrls) {
    const url = getAdminApiUrl(base, "/api/contact-query");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          websiteId,
          companyId,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: true, data };
      }
    } catch (err) {
      // Continue to next backend candidate
    }
  }

  return { success: true, forwarded: false };
}

/**
 * Submit product enquiry to Admin API
 */
export async function submitProductQuery(payload = {}) {
  const config = getWebsiteConfig();
  const websiteId = payload.websiteId || config.websiteId || WEBSITE_ID;
  const companyId = payload.companyId || config.companyId || COMPANY_ID;
  const baseUrls = getAdminBaseUrls();

  for (const base of baseUrls) {
    const url = getAdminApiUrl(base, "/api/product-query");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          websiteId,
          companyId,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: true, data };
      }
    } catch (err) {
      // Continue to next backend candidate
    }
  }

  return { success: true, forwarded: false };
}
