import { NextResponse } from "next/server";
import { getFullCatalog } from "@/lib/sqliteDb";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import { WEBSITE_ID, COMPANY_ID } from "@/lib/catalog-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetWebsiteId = searchParams.get("websiteId") || WEBSITE_ID;
    const targetCompanyId = searchParams.get("companyId") || COMPANY_ID;

    // Direct read from SQLite WAL database (<2ms)
    let products = [];
    try {
      products = getFullCatalog(targetCompanyId, targetWebsiteId);
    } catch (dbErr) {
      console.warn("[api/products] Direct SQLite read failed, falling back to data fetcher:", dbErr);
      products = await fetchFullCatalog();
    }

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("API /api/products Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch products",
        products: [],
        count: 0,
        timestamp: Date.now(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  }
}
