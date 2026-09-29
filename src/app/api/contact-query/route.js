import { NextResponse } from "next/server";
import { submitContactQuery } from "@/lib/admin-api";
import { WEBSITE_ID } from "@/lib/catalog-utils";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body || {};

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

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      source: "humarilab.in/contact",
      websiteId: WEBSITE_ID,
      createdAt: new Date().toISOString(),
    };

    console.log("[api/contact-query] New contact query received:", payload);

    // Forward to SQLite Admin API
    const result = await submitContactQuery(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Message submitted successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/contact-query Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit contact query",
      },
      { status: 500 }
    );
  }
}
