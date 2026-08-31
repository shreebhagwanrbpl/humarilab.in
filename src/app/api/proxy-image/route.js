import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return new NextResponse(`Failed to fetch remote image: ${response.status}`, { status: response.status });
        }

        const blob = await response.blob();
        const headers = new Headers();
        headers.set("Content-Type", blob.type || "image/png");
        headers.set("Access-Control-Allow-Origin", "*");
        
        return new NextResponse(blob, {
            status: 200,
            headers,
        });
    } catch (err) {
        console.error("Error in proxy-image route:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
