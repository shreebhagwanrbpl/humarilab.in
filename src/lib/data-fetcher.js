import { db } from "./firebase.js";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { getWebsiteConfig, isItemVisible } from "./constants.js";

// In-memory cache for static pages only
const docCache = {};

// In-memory micro-cache for Master Catalog to avoid Firestore quota exhaustion
let masterCatalogCache = {
  data: null,
  timestamp: 0,
  companyId: null,
};
const CATALOG_MICRO_CACHE_TTL = 3000; // 3 seconds micro-cache

export const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Fetch a single document and cache its promise/data (used for static pages: home, contact, etc.)
 */
export async function fetchDocCached(path) {
  if (docCache[path]) {
    return docCache[path];
  }
  if (!docCache[path + "_promise"]) {
    docCache[path + "_promise"] = (async () => {
      try {
        const parts = path.split("/");
        const docRef = doc(db, ...parts);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          docCache[path] = data;
          return data;
        }
        return null;
      } catch (err) {
        console.error(`Error fetching doc at ${path}:`, err);
        delete docCache[path + "_promise"];
        throw err;
      }
    })();
  }
  return docCache[path + "_promise"];
}

/**
 * Invalidate in-memory master catalog cache
 */
export function invalidateMasterCatalogCache() {
  masterCatalogCache = { data: null, timestamp: 0, companyId: null };
}

/**
 * Fetch and process the entire Master Catalog with cascading visibility checks:
 * 1. Category Visibility: if category is hidden -> skip all its subcategories and products.
 * 2. Subcategory Visibility: if subcategory is hidden -> skip all its products.
 * 3. Product Visibility: if product is hidden (isPublished === false or not in websiteIds) -> skip product.
 *
 * Direct Master Catalog path: companies/{companyId}/categories/{categoryId}/subcategories/{subcategoryId}
 */
export async function fetchFullCatalog(options = {}) {
  const forceRefresh = Boolean(options && options.forceRefresh);
  const startTime = performance.now();
  const config = getWebsiteConfig();
  const companyId = config.companyId || "rajbiosis";

  // Check micro-cache (serve immediately if within TTL and not force refreshed)
  if (
    !forceRefresh &&
    masterCatalogCache.data &&
    masterCatalogCache.companyId === companyId &&
    Date.now() - masterCatalogCache.timestamp < CATALOG_MICRO_CACHE_TTL
  ) {
    return masterCatalogCache.data;
  }

  try {
    const categorySnap = await getDocs(
      collection(db, "companies", companyId, "categories")
    );

    const allProducts = [];

    // Fetch all categories and subcategories in parallel
    const categoryPromises = categorySnap.docs.map(async (categoryDoc) => {
      const categoryData = categoryDoc.data() || {};
      const categoryName = categoryData.name || categoryData.category || categoryDoc.id;

      // Category Level Visibility Check
      if (!isItemVisible(categoryData)) {
        return;
      }

      try {
        const subcategoriesCol = collection(
          db,
          "companies",
          companyId,
          "categories",
          categoryDoc.id,
          "subcategories"
        );

        const subcategoriesSnap = await getDocs(subcategoriesCol);

        subcategoriesSnap.forEach((subDoc) => {
          const subData = subDoc.data() || {};
          const subCategoryName = subData.name || subData.subCategory || subDoc.id;

          // Subcategory Level Visibility Check
          if (!isItemVisible(subData)) {
            return;
          }

          const rawProducts = Array.isArray(subData.products) ? subData.products : [];

          rawProducts.forEach((item, index) => {
            if (!item) return;

            // Product Level Visibility Check
            if (!isItemVisible(item)) {
              return;
            }

            const title = (item.title || item.name || "").trim();
            const slug = item.slug || item.productSlug || makeSlug(title || `${subDoc.id}-${index}`);
            const images = Array.isArray(item.images)
              ? item.images.filter(Boolean)
              : item.image
              ? [item.image]
              : [];

            allProducts.push({
              id: item.id || `${categoryDoc.id}-${subDoc.id}-${index}`,
              uid: item.uid || `${categoryDoc.id}-${subDoc.id}-${index}`,
              categoryProductId: item.categoryProductId || item.productId || "",
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
              category: categoryName,
              subCategory: subCategoryName,
              categoryId: categoryDoc.id,
              subcategoryId: subDoc.id,
              slug,
              images,
              image: images[0] || "",
              video: item.video || "",
              pdf: item.pdf || "",
              isPublished: item.isPublished !== false,
              websiteIds: item.websiteIds || [],
              createdAt: item.createdAt || "",
            });
          });
        });
      } catch (subErr) {
        console.error(`Error fetching subcategories for category ${categoryDoc.id}:`, subErr);
      }

      // Direct Category Products (if any attached to category doc)
      if (Array.isArray(categoryData.products) && categoryData.products.length > 0) {
        categoryData.products.forEach((item, index) => {
          if (!item || !isItemVisible(item)) return;

          const title = (item.title || item.name || "").trim();
          const slug = item.slug || item.productSlug || makeSlug(title || `direct-${index}`);
          const images = Array.isArray(item.images)
            ? item.images.filter(Boolean)
            : item.image
            ? [item.image]
            : [];

          allProducts.push({
            id: item.id || `${categoryDoc.id}-direct-${index}`,
            uid: item.uid || `${categoryDoc.id}-direct-${index}`,
            categoryProductId: item.categoryProductId || "",
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
            category: categoryName,
            subCategory: item.subCategory || categoryName,
            categoryId: categoryDoc.id,
            subcategoryId: "direct",
            slug,
            images,
            image: images[0] || "",
            video: item.video || "",
            pdf: item.pdf || "",
            isPublished: item.isPublished !== false,
            websiteIds: item.websiteIds || [],
            createdAt: item.createdAt || "",
          });
        });
      }
    });

    // Fetch standalone normal products in parallel with categories
    const normalProductsPromise = (async () => {
      try {
        const prodSnap = await getDocs(
          collection(db, "companies", companyId, "products")
        );
        prodSnap.docs.forEach((docSnap) => {
          const item = docSnap.data() || {};
          if (!isItemVisible(item)) return;

          const title = (item.title || item.name || "").trim();
          const slug = item.slug || item.productSlug || makeSlug(title || docSnap.id);
          const images = Array.isArray(item.images)
            ? item.images.filter(Boolean)
            : item.image
            ? [item.image]
            : [];

          allProducts.push({
            id: item.id || docSnap.id,
            uid: item.uid || docSnap.id,
            categoryProductId: item.categoryProductId || item.productId || "",
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
            video: item.video || "",
            pdf: item.pdf || "",
            isPublished: item.isPublished !== false,
            websiteIds: item.websiteIds || [],
            createdAt: item.createdAt || "",
          });
        });
      } catch (err) {
        console.warn("Standalone products fetch error:", err);
      }
    })();

    await Promise.all([...categoryPromises, normalProductsPromise]);

    const duration = performance.now() - startTime;
    console.log(
      `[data-fetcher] Master Catalog fetch completed in ${duration.toFixed(2)}ms, found ${allProducts.length} visible products for ${config.websiteId}`
    );

    // Update master catalog cache
    masterCatalogCache = {
      data: allProducts,
      timestamp: Date.now(),
      companyId,
    };

    return allProducts;
  } catch (err) {
    console.error("Error fetching Master Catalog:", err);
    // If quota is exhausted or temporary network issue, return last cached catalog if available
    if (masterCatalogCache.data && masterCatalogCache.data.length > 0) {
      console.warn("[data-fetcher] Serving stale cached catalog due to Firestore error");
      return masterCatalogCache.data;
    }
    throw err;
  }
}

/**
 * Helpers for static page data retrieval
 */
export async function fetchHomeData() {
  return fetchDocCached("websites/humarilabin/pages/home");
}

export async function fetchContactData() {
  return fetchDocCached("websites/humarilabin/pages/contact");
}

export async function fetchServicesData() {
  return fetchDocCached("websites/humarilabin/pages/services");
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  return fetchDocCached(`websites/humarilabin/districts/${district}`);
}
