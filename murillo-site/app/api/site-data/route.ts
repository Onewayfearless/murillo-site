import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

const SITE_DATA_FILE = "site-data/current.json";

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: SITE_DATA_FILE,
      limit: 10,
    });

    const existing =
      blobs.find((blob) => blob.pathname === SITE_DATA_FILE) || blobs[0];

    if (!existing) {
      return NextResponse.json({ data: null });
    }

    const res = await fetch(existing.url, { cache: "no-store" });
    const text = await res.text();

    return NextResponse.json({
      data: text ? JSON.parse(text) : null,
    });
  } catch (error) {
    console.error("GET /api/site-data failed:", error);
    return NextResponse.json({ data: null }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body?.data ?? body;

    await put(SITE_DATA_FILE, JSON.stringify(data, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/site-data failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save site data.",
      },
      { status: 500 }
    );
  }
}