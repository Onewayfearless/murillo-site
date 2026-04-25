import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_DATA_FILE = "site-data/current.json";

function noStoreJson(data: unknown, status = 200) {
return NextResponse.json(data, {
status,
headers: {
"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
Pragma: "no-cache",
Expires: "0",
},
});
}

async function findSiteDataBlob() {
const { blobs } = await list({
prefix: SITE_DATA_FILE,
limit: 100,
});

const exact = blobs.find((blob) => blob.pathname === SITE_DATA_FILE);

if (exact) return exact;

return blobs
.filter((blob) => blob.pathname.includes("current.json"))
.sort((a, b) => {
const aTime = new Date(a.uploadedAt || 0).getTime();
const bTime = new Date(b.uploadedAt || 0).getTime();
return bTime - aTime;
})[0];
}

export async function GET() {
try {
const blob = await findSiteDataBlob();

if (!blob?.url) {
return noStoreJson({
success: true,
data: null,
});
}

const res = await fetch(`${blob.url}?t=${Date.now()}`, {
cache: "no-store",
});

if (!res.ok) {
throw new Error("Could not read saved site data.");
}

const text = await res.text();
const data = text ? JSON.parse(text) : null;

return noStoreJson({
success: true,
data,
});
} catch (error) {
console.error("GET /api/site-data failed:", error);

return noStoreJson({
success: false,
data: null,
error: "Could not load site data.",
});
}
}

export async function POST(request: Request) {
try {
const body = await request.json().catch(() => null);

if (!body) {
return noStoreJson(
{
success: false,
error: "Missing site data.",
},
400
);
}

const data = body?.data ?? body;

const finalData = {
...data,
updatedAt: new Date().toISOString(),
};

const blob = await put(SITE_DATA_FILE, JSON.stringify(finalData, null, 2), {
access: "public",
addRandomSuffix: false,
allowOverwrite: true,
contentType: "application/json",
});

return noStoreJson({
success: true,
url: blob.url,
pathname: blob.pathname,
data: finalData,
});
} catch (error) {
console.error("POST /api/site-data failed:", error);

return noStoreJson(
{
success: false,
error: "Failed to save site data.",
},
500
);
}
}
