import { MongoClient } from "mongodb";
import {
  WEBSITE_ID,
  COMPANY_ID,
  isItemVisibleOnWebsite,
  makeSlug,
} from "./catalog-utils.js";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://rajbiosis15_db_user:R7jmlgZ3RfeB0MEz@superadminrbpl.aneatej.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "company_master_cms";

let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

/**
 * Connects to MongoDB Atlas cluster and returns the database instance
 */
export async function getDb() {
  if (cachedDb) return cachedDb;

  if (!MONGODB_URI) {
    console.warn("[mongoDb] MONGODB_URI missing in environment variables.");
    return null;
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      global._mongoClient = cachedClient;
      await cachedClient.connect();
    }
    cachedDb = cachedClient.db(MONGODB_DB_NAME);
    global._mongoDb = cachedDb;
    return cachedDb;
  } catch (err) {
    console.error("[mongoDb] Failed to connect to MongoDB Atlas:", err.message);
    return null;
  }
}

/**
 * Helper to safely parse document data whether stored as a JSON string or object
 */
function parseDocData(doc) {
  if (!doc) return null;
  if (doc.data && typeof doc.data === "string") {
    try {
      return JSON.parse(doc.data);
    } catch (e) {
      return null;
    }
  }
  if (doc.data && typeof doc.data === "object") {
    return doc.data;
  }
  return doc;
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
    makeSlug(title || `product-${item.id || item._id || index}`);

  const images = Array.isArray(item.images)
    ? item.images.filter(Boolean)
    : item.image
    ? [item.image]
    : [];

  return {
    id: String(item.id || item._id || `prod-${index}`),
    uid: String(item.uid || item.id || item._id || `prod-${index}`),
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
 * High-performance MongoDB Catalog Fetcher
 * Cascades visibility from Category -> Subcategory -> Product
 * Supports both `documents` collection schema (collection_path/doc_id/data)
 * and direct collections (`products`, `categories`, `subcategories`).
 */
export async function getFullCatalog(
  companyId = COMPANY_ID,
  websiteId = WEBSITE_ID
) {
  const db = await getDb();
  if (!db) return [];

  const start = performance.now();
  const allProducts = [];

  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // MODE 1: Check `documents` collection (Standard SuperAdmin Dump Format)
    if (collectionNames.includes("documents")) {
      const docsColl = db.collection("documents");

      // 1. Fetch Categories for company
      const catDocs = await docsColl
        .find({ collection_path: `companies/${companyId}/categories` })
        .toArray();

      for (const catRow of catDocs) {
        const catData = parseDocData(catRow);
        if (!catData) continue;

        if (!isItemVisibleOnWebsite(catData, websiteId)) continue;

        const catName = catData.name || catData.category || catRow.doc_id;

        // 2. Fetch Subcategories
        const subDocs = await docsColl
          .find({
            collection_path: `companies/${companyId}/categories/${catRow.doc_id}/subcategories`,
          })
          .toArray();

        for (const subRow of subDocs) {
          const subData = parseDocData(subRow);
          if (!subData) continue;

          if (!isItemVisibleOnWebsite(subData, websiteId)) continue;

          const subName = subData.name || subData.subCategory || subRow.doc_id;

          // Products embedded inside subcategory document
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

          // Products in subcollection
          const subProdDocs = await docsColl
            .find({
              collection_path: `companies/${companyId}/categories/${catRow.doc_id}/subcategories/${subRow.doc_id}/products`,
            })
            .toArray();

          for (const pRow of subProdDocs) {
            const p = parseDocData(pRow);
            if (!p || !isItemVisibleOnWebsite(p, websiteId)) continue;

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

        // Direct Category Products
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

      // Standalone Master Products
      const prodDocs = await docsColl
        .find({ collection_path: `companies/${companyId}/products` })
        .toArray();

      for (const pRow of prodDocs) {
        const p = parseDocData(pRow);
        if (!p || !isItemVisibleOnWebsite(p, websiteId)) continue;
        allProducts.push(normalizeProduct(p, allProducts.length));
      }
    }

    // MODE 2: Direct MongoDB Collections (if `products` collection exists)
    if (collectionNames.includes("products")) {
      const prodColl = db.collection("products");
      const filter = {
        $or: [
          { companyId },
          { company_id: companyId },
          { companyId: { $exists: false } },
        ],
      };

      const nativeProds = await prodColl.find(filter).toArray();
      for (const p of nativeProds) {
        if (!isItemVisibleOnWebsite(p, websiteId)) continue;
        allProducts.push(normalizeProduct(p, allProducts.length));
      }
    }

    const duration = performance.now() - start;
    console.log(
      `[mongoDb] getFullCatalog returned ${allProducts.length} visible products for ${websiteId} in ${duration.toFixed(2)}ms`
    );

    return allProducts.filter(Boolean);
  } catch (err) {
    console.error("[mongoDb] Error executing getFullCatalog:", err);
    return [];
  }
}

/**
 * MongoDB Page Data Extractor (Home, Contact, Services)
 */
export async function getPageData(
  pageType = "home",
  websiteId = WEBSITE_ID,
  companyId = COMPANY_ID
) {
  const db = await getDb();
  if (!db) return null;

  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // 1. Check `documents` collection first
    if (collectionNames.includes("documents")) {
      const docsColl = db.collection("documents");
      const candidatePaths = [
        `websites/${companyId}/${websiteId}/pages/${pageType}`,
        `websites/${websiteId}/pages/${pageType}`,
        `websites/${companyId}/${websiteId}/districts/${pageType}`,
        `websites/${websiteId}/districts/${pageType}`,
      ];

      for (const docPath of candidatePaths) {
        const row = await docsColl.findOne({ path: docPath });
        if (row) {
          const parsed = parseDocData(row);
          if (parsed) return parsed;
        }
      }
    }

    // 2. Check direct `pages` collection
    if (collectionNames.includes("pages")) {
      const pagesColl = db.collection("pages");
      const pageDoc = await pagesColl.findOne({
        $or: [{ pageType }, { slug: pageType }, { type: pageType }],
      });
      if (pageDoc) return pageDoc;
    }
  } catch (err) {
    console.error(`[mongoDb] getPageData(${pageType}) error:`, err);
  }

  return null;
}

/**
 * MongoDB Districts Extractor
 */
export async function getDistricts(
  websiteId = WEBSITE_ID,
  companyId = COMPANY_ID
) {
  const db = await getDb();
  if (!db) return [];

  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // 1. Check `documents` collection
    if (collectionNames.includes("documents")) {
      const docsColl = db.collection("documents");
      const candidatePaths = [
        `websites/${companyId}/${websiteId}/districts`,
        `websites/${websiteId}/districts`,
      ];

      for (const colPath of candidatePaths) {
        const rows = await docsColl.find({ collection_path: colPath }).toArray();
        if (rows.length > 0) {
          return rows
            .map((r) => {
              const d = parseDocData(r);
              if (!d) return null;
              return { ...d, slug: d.slug || r.doc_id };
            })
            .filter(Boolean);
        }
      }
    }

    // 2. Check direct `districts` collection
    if (collectionNames.includes("districts")) {
      const distColl = db.collection("districts");
      const rows = await distColl.find({}).toArray();
      return rows.map((d) => ({ ...d, slug: d.slug || d.doc_id || String(d._id) }));
    }
  } catch (err) {
    console.error("[mongoDb] getDistricts error:", err);
  }

  return [];
}

/**
 * MongoDB District Data Extractor
 */
export async function getDistrictData(
  district,
  websiteId = WEBSITE_ID,
  companyId = COMPANY_ID
) {
  if (!district) return null;
  return getPageData(district, websiteId, companyId);
}
