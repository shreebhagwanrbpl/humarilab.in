import { NextResponse } from "next/server";
import { fetchFullCatalog } from "@/lib/data-fetcher";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true" || searchParams.get("force") === "1";
    const products = await fetchFullCatalog({ forceRefresh });

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
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("API /api/catalog Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch master catalog",
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
