import { NextResponse } from "next/server";
import { submitProductQuery } from "@/lib/admin-api";
import { WEBSITE_ID } from "@/lib/catalog-utils";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, productName, productSlug, brand, model } =
      body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: "Enter a valid email address" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      productName: (productName || "").trim(),
      productSlug: (productSlug || "").trim(),
      brand: (brand || "").trim(),
      model: (model || "").trim(),
      source: "humarilab.in/items",
      websiteId: WEBSITE_ID,
      createdAt: new Date().toISOString(),
    };

    console.log("[api/product-query] New product query received:", payload);

    // Forward to SQLite Admin API
    const result = await submitProductQuery(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been submitted successfully.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/product-query Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit product enquiry",
      },
      { status: 500 }
    );
  }
}
