import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import {
  WEBSITE_ID,
  COMPANY_ID,
  SQLITE_DB_PATH,
  isItemVisibleOnWebsite,
  makeSlug,
} from "./catalog-utils.js";

let dbInstance = null;

/**
 * Resolves the absolute path to catalog.db
 */
export function resolveDbPath() {
  const candidatePaths = [
    SQLITE_DB_PATH,
    path.resolve(process.cwd(), SQLITE_DB_PATH),
    path.resolve(process.cwd(), "../SuperAdminRBPL/data/catalog.db"),
    path.resolve(process.cwd(), "../../SuperAdminRBPL/data/catalog.db"),
    path.join(process.cwd(), "data", "catalog.db"),
  ];

  for (const p of candidatePaths) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }

  return path.resolve(process.cwd(), SQLITE_DB_PATH);
}

/**
 * Returns a fast read-only SQLite database connection in WAL mode
 */
export function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = resolveDbPath();
  if (!fs.existsSync(dbPath)) {
    console.warn(`[sqliteDb] Database file not found at ${dbPath}`);
    return null;
  }

  try {
    dbInstance = new DatabaseSync(dbPath, { readOnly: true });
    dbInstance.exec("PRAGMA query_only = ON;");
    dbInstance.exec("PRAGMA read_uncommitted = ON;");
    return dbInstance;
  } catch (err) {
    console.error(`[sqliteDb] Failed to initialize SQLite database at ${dbPath}:`, err);
    return null;
  }
}

/**
 * Normalizes raw product into the standard frontend format
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
 * Direct Zero-Delay SQLite Catalog Extractor (<2ms execution)
 * Cascades visibility from Category -> Subcategory -> Product
 */
export function getFullCatalog(companyId = COMPANY_ID, websiteId = WEBSITE_ID) {
  const db = getDb();
  if (!db) return [];

  const start = performance.now();
  const allProducts = [];

  try {
    // 1. Fetch Categories for company
    const catRows = db
      .prepare("SELECT doc_id, data FROM documents WHERE collection_path = ?")
      .all(`companies/${companyId}/categories`);

    for (const catRow of catRows) {
      let catData = null;
      try {
        catData = JSON.parse(catRow.data);
      } catch (e) {
        continue;
      }

      // Cascading Check 1: Category Level Visibility
      if (!isItemVisibleOnWebsite(catData, websiteId)) {
        continue;
      }

      const catName = catData.name || catData.category || catRow.doc_id;

      // 2. Fetch Subcategories for this Category
      const subRows = db
        .prepare("SELECT doc_id, data FROM documents WHERE collection_path = ?")
        .all(`companies/${companyId}/categories/${catRow.doc_id}/subcategories`);

      for (const subRow of subRows) {
        let subData = null;
        try {
          subData = JSON.parse(subRow.data);
        } catch (e) {
          continue;
        }

        // Cascading Check 2: Subcategory Level Visibility
        if (!isItemVisibleOnWebsite(subData, websiteId)) {
          continue;
        }

        const subName = subData.name || subData.subCategory || subRow.doc_id;

        // Extract products embedded in subcategory document
        if (Array.isArray(subData.products)) {
          for (let i = 0; i < subData.products.length; i++) {
            const p = subData.products[i];
            if (!isItemVisibleOnWebsite(p, websiteId)) continue;

            allProducts.push(
              normalizeProduct(
                {
                  ...p,
                  category: catName,
                  subCategory: subName,
                  categoryId: catRow.doc_id,
                  subcategoryId: subRow.doc_id,
                },
                allProducts.length
              )
            );
          }
        }

        // Extract products from subcollection (if any)
        try {
          const subProdRows = db
            .prepare("SELECT doc_id, data FROM documents WHERE collection_path = ?")
            .all(
              `companies/${companyId}/categories/${catRow.doc_id}/subcategories/${subRow.doc_id}/products`
            );

          for (const pRow of subProdRows) {
            const p = JSON.parse(pRow.data);
            if (!isItemVisibleOnWebsite(p, websiteId)) continue;

            allProducts.push(
              normalizeProduct(
                {
                  ...p,
                  category: catName,
                  subCategory: subName,
                  categoryId: catRow.doc_id,
                  subcategoryId: subRow.doc_id,
                },
                allProducts.length
              )
            );
          }
        } catch (e) {
          // ignore subcollection errors
        }
      }

      // Direct Category Products (if attached to category doc)
      if (Array.isArray(catData.products)) {
        for (let i = 0; i < catData.products.length; i++) {
          const p = catData.products[i];
          if (!isItemVisibleOnWebsite(p, websiteId)) continue;

          allProducts.push(
            normalizeProduct(
              {
                ...p,
                category: catName,
                subCategory: catName,
                categoryId: catRow.doc_id,
                subcategoryId: "direct",
              },
              allProducts.length
            )
          );
        }
      }
    }

    // 3. Fetch Standalone Master Products for company
    try {
      const prodRows = db
        .prepare("SELECT doc_id, data FROM documents WHERE collection_path = ?")
        .all(`companies/${companyId}/products`);

      for (const pRow of prodRows) {
        let p = null;
        try {
          p = JSON.parse(pRow.data);
        } catch (e) {
          continue;
        }

        if (!isItemVisibleOnWebsite(p, websiteId)) continue;

        allProducts.push(normalizeProduct(p, allProducts.length));
      }
    } catch (e) {
      // ignore standalone errors
    }

    const duration = performance.now() - start;
    console.log(
      `[sqliteDb] getFullCatalog returned ${allProducts.length} visible products for ${websiteId} in ${duration.toFixed(2)}ms`
    );

    return allProducts.filter(Boolean);
  } catch (err) {
    console.error("[sqliteDb] Error executing getFullCatalog:", err);
    return [];
  }
}

/**
 * Fast SQLite Page Data Extractor (Home, Contact, Services)
 */
export function getPageData(pageType = "home", websiteId = WEBSITE_ID, companyId = COMPANY_ID) {
  const db = getDb();
  if (!db) return null;

  const candidatePaths = [
    `websites/${companyId}/${websiteId}/pages/${pageType}`,
    `websites/${websiteId}/pages/${pageType}`,
    `websites/${companyId}/${websiteId}/districts/${pageType}`,
    `websites/${websiteId}/districts/${pageType}`,
  ];

  for (const docPath of candidatePaths) {
    try {
      const row = db
        .prepare("SELECT data FROM documents WHERE path = ?")
        .get(docPath);

      if (row && row.data) {
        return JSON.parse(row.data);
      }
    } catch (e) {
      // Continue to next path
    }
  }

  return null;
}

/**
 * Fast SQLite Districts Extractor
 */
export function getDistricts(websiteId = WEBSITE_ID, companyId = COMPANY_ID) {
  const db = getDb();
  if (!db) return [];

  const candidatePaths = [
    `websites/${companyId}/${websiteId}/districts`,
    `websites/${websiteId}/districts`,
  ];

  for (const colPath of candidatePaths) {
    try {
      const rows = db
        .prepare("SELECT doc_id, data FROM documents WHERE collection_path = ?")
        .all(colPath);

      if (rows.length > 0) {
        return rows
          .map((r) => {
            try {
              const d = JSON.parse(r.data);
              return { ...d, slug: d.slug || r.doc_id };
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean);
      }
    } catch (e) {
      // Continue to next path
    }
  }

  return [];
}

/**
 * Fast SQLite District Data Extractor
 */
export function getDistrictData(district, websiteId = WEBSITE_ID, companyId = COMPANY_ID) {
  if (!district) return null;
  return getPageData(district, websiteId, companyId);
}
