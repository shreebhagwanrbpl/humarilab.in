import { NextResponse } from "next/server";
import { getPageData, getDistricts, getDistrictData } from "@/lib/mongoDb";
import { fetchSiteDataFromAdmin } from "@/lib/admin-api";
import { WEBSITE_ID, COMPANY_ID } from "@/lib/catalog-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "home";
    const district = searchParams.get("district") || undefined;
    const page = searchParams.get("page") || undefined;
    const websiteId = searchParams.get("websiteId") || WEBSITE_ID;
    const companyId = searchParams.get("companyId") || COMPANY_ID;
    const forceRefresh =
      searchParams.get("refresh") === "true" ||
      searchParams.get("force") === "1";

    let data = null;

    // 1. Direct local MongoDB Atlas query
    try {
      if (type === "districts") {
        data = await getDistricts(websiteId, companyId);
      } else if (type === "district" && district) {
        data = await getDistrictData(district, websiteId, companyId);
      } else {
        data = await getPageData(page || type, websiteId, companyId);
      }
    } catch (e) {
      console.warn("[api/site-data] Direct MongoDB query failed, falling back:", e);
    }

    // 2. Fallback to Admin API if not found in local MongoDB
    if (!data) {
      data = await fetchSiteDataFromAdmin({
        type,
        district,
        page,
        websiteId,
        forceRefresh,
      });
    }

    return NextResponse.json(
      {
        success: true,
        type,
        data,
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
    console.error("API /api/site-data Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch site data",
        data: null,
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
