"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type Category =
| "Kitchen Remodel"
| "Bathroom Remodel"
| "Flooring Project"
| "Custom Build"
| "Repair Work"
| "Renovation";

type MediaItem = {
id: string;
url?: string;
src?: string;
pathname?: string;
alt?: string;
name?: string;
createdAt?: string;
};

type ReviewItem = {
id: string;
name: string;
rating: number;
text: string;
photos: MediaItem[];
date: string;
};

type VisitItem = {
id: string;
name: string;
email: string;
phone: string;
address: string;
jobType: string;
preferredTime: string;
details: string;
date: string;
};

type PaymentItem = {
id: string;
amount: string;
name: string;
email: string;
notes: string;
proofs: MediaItem[];
date: string;
};

type SiteData = {
businessName: string;
phoneNumber: string;
zelleContact: string;

heroBadge: string;
heroTitleLine1: string;
heroTitleLine2: string;
heroAccent: string;
heroSubtitle: string;

backgroundImage: MediaItem | null;
backgroundBrightness: number;

heroSectionBackgroundImage: MediaItem | null;
heroSectionOverlay: number;

servicesTitle: string;
servicesSubtitle: string;

portfolioTitle: string;
portfolioSubtitle: string;

reviewsTitle: string;
reviewsSubtitle: string;

aboutTitle: string;
aboutSubtitle: string;

faqTitle: string;
faqSubtitle: string;

quickTitle: string;
quickSubtitle: string;

contactTitle: string;
contactSubtitle: string;

stat1: string;
stat2: string;
stat3: string;

portfolio: Record<Category, MediaItem[]>;
reviews: ReviewItem[];
visits: VisitItem[];
payments: PaymentItem[];
};

const CATEGORIES: Category[] = [
"Kitchen Remodel",
"Bathroom Remodel",
"Flooring Project",
"Custom Build",
"Repair Work",
"Renovation",
];

const DEFAULT_PHONE = "404-389-3672";

const DEFAULT_SITE_DATA: SiteData = {
businessName: "Murillo Renovations LLC",
phoneNumber: DEFAULT_PHONE,
zelleContact: "your-zelle@email.com",

heroBadge: "Licensed & Insured General Contractor",
heroTitleLine1: "Luxury Homes",
heroTitleLine2: "Done Once.",
heroAccent: "Done Once.",
heroSubtitle:
"Premium remodeling, renovation, and custom construction with a clean process, strong communication, and results that feel expensive.",

backgroundImage: null,
backgroundBrightness: 0.45,

heroSectionBackgroundImage: null,
heroSectionOverlay: 0.58,

servicesTitle: "Everything the site should sell",
servicesSubtitle:
"Keep the homepage premium with strong service blocks, direct action buttons, and clear customer paths.",

portfolioTitle: "Selected work",
portfolioSubtitle:
"This page is the gallery preview. The full portfolio lives on its own page, and each category can hold as many images as you want.",

reviewsTitle: "What clients say",
reviewsSubtitle: "Show real reviews on the page and let customers upload photos with them.",

aboutTitle: "A contractor brand built to feel premium.",
aboutSubtitle:
"Murillo Renovations LLC handles remodeling, repairs, custom projects, and high-impact home improvements with a clean process from start to finish.",

faqTitle: "Common questions",
faqSubtitle: "Keep answers short, useful, and easy to scan.",

quickTitle: "Quick actions",
quickSubtitle: "The homepage should always keep a customer one click away from the next step.",

contactTitle: "Contact",
contactSubtitle: "Keep the call, visit, payment, and portfolio paths obvious.",

stat1: "100+",
stat2: "5★",
stat3: "Fast response",

portfolio: {
"Kitchen Remodel": [],
"Bathroom Remodel": [],
"Flooring Project": [],
"Custom Build": [],
"Repair Work": [],
Renovation: [],
},

reviews: [],
visits: [],
payments: [],
};

function uid() {
return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function mediaUrl(item?: MediaItem | null) {
if (!item) return "";
return item.url || item.src || "";
}

function toMediaItem(value: unknown): MediaItem | null {
if (!value) return null;

if (typeof value === "string") {
return {
id: uid(),
url: value,
src: value,
alt: "image",
name: "image",
createdAt: new Date().toISOString(),
};
}

if (typeof value !== "object") return null;

const raw = value as Record<string, unknown>;

const url =
typeof raw.url === "string"
? raw.url
: typeof raw.src === "string"
? raw.src
: "";

if (!url && typeof raw.id !== "string") return null;

return {
id: typeof raw.id === "string" ? raw.id : uid(),
url,
src: typeof raw.src === "string" ? raw.src : url,
pathname: typeof raw.pathname === "string" ? raw.pathname : "",
alt:
typeof raw.alt === "string"
? raw.alt
: typeof raw.name === "string"
? raw.name
: "image",
name:
typeof raw.name === "string"
? raw.name
: typeof raw.alt === "string"
? raw.alt
: "image",
createdAt:
typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString(),
};
}

function normalizeMediaArray(value: unknown): MediaItem[] {
if (!Array.isArray(value)) return [];
return value.map(toMediaItem).filter((item): item is MediaItem => Boolean(item));
}

function normalizeReview(value: unknown): ReviewItem | null {
if (!value || typeof value !== "object") return null;

const raw = value as Record<string, unknown>;

return {
id: typeof raw.id === "string" ? raw.id : uid(),
name: typeof raw.name === "string" ? raw.name : "",
rating:
typeof raw.rating === "number"
? Math.max(1, Math.min(5, raw.rating))
: Number(raw.rating) || 5,
text: typeof raw.text === "string" ? raw.text : "",
photos: normalizeMediaArray(raw.photos),
date: typeof raw.date === "string" ? raw.date : new Date().toLocaleString(),
};
}

function normalizeVisit(value: unknown): VisitItem | null {
if (!value || typeof value !== "object") return null;

const raw = value as Record<string, unknown>;

return {
id: typeof raw.id === "string" ? raw.id : uid(),
name: typeof raw.name === "string" ? raw.name : "",
email: typeof raw.email === "string" ? raw.email : "",
phone: typeof raw.phone === "string" ? raw.phone : "",
address: typeof raw.address === "string" ? raw.address : "",
jobType: typeof raw.jobType === "string" ? raw.jobType : "",
preferredTime: typeof raw.preferredTime === "string" ? raw.preferredTime : "",
details: typeof raw.details === "string" ? raw.details : "",
date: typeof raw.date === "string" ? raw.date : new Date().toLocaleString(),
};
}

function normalizePayment(value: unknown): PaymentItem | null {
if (!value || typeof value !== "object") return null;

const raw = value as Record<string, unknown>;

return {
id: typeof raw.id === "string" ? raw.id : uid(),
amount: typeof raw.amount === "string" ? raw.amount : "",
name: typeof raw.name === "string" ? raw.name : "",
email: typeof raw.email === "string" ? raw.email : "",
notes: typeof raw.notes === "string" ? raw.notes : "",
proofs: normalizeMediaArray(raw.proofs),
date: typeof raw.date === "string" ? raw.date : new Date().toLocaleString(),
};
}

function normalizeSiteData(input: unknown): SiteData {
if (!input || typeof input !== "object") return DEFAULT_SITE_DATA;

const raw = input as Partial<SiteData>;

const portfolio: Record<Category, MediaItem[]> = {
"Kitchen Remodel": [],
"Bathroom Remodel": [],
"Flooring Project": [],
"Custom Build": [],
"Repair Work": [],
Renovation: [],
};

for (const category of CATEGORIES) {
portfolio[category] = normalizeMediaArray(raw.portfolio?.[category]);
}

const phoneFromData =
typeof raw.phoneNumber === "string" && raw.phoneNumber.trim()
? raw.phoneNumber.trim()
: DEFAULT_PHONE;

return {
...DEFAULT_SITE_DATA,
...raw,

phoneNumber:
phoneFromData.includes("678") || phoneFromData.includes("555")
? DEFAULT_PHONE
: phoneFromData,

backgroundImage: toMediaItem(raw.backgroundImage) || null,
backgroundBrightness:
typeof raw.backgroundBrightness === "number"
? raw.backgroundBrightness
: DEFAULT_SITE_DATA.backgroundBrightness,

heroSectionBackgroundImage: toMediaItem(raw.heroSectionBackgroundImage) || null,
heroSectionOverlay:
typeof raw.heroSectionOverlay === "number"
? raw.heroSectionOverlay
: DEFAULT_SITE_DATA.heroSectionOverlay,

portfolio,

reviews: Array.isArray(raw.reviews)
? raw.reviews.map(normalizeReview).filter((item): item is ReviewItem => Boolean(item))
: [],

visits: Array.isArray(raw.visits)
? raw.visits.map(normalizeVisit).filter((item): item is VisitItem => Boolean(item))
: [],

payments: Array.isArray(raw.payments)
? raw.payments.map(normalizePayment).filter((item): item is PaymentItem => Boolean(item))
: [],
};
}

async function loadSiteData(): Promise<SiteData> {
try {
const res = await fetch("/api/site-data", {
cache: "no-store",
});

if (!res.ok) throw new Error("Failed to load site data.");

const json = await res.json();
return normalizeSiteData(json?.data ?? json);
} catch (error) {
console.error("Portfolio site-data load failed:", error);
return DEFAULT_SITE_DATA;
}
}

async function saveSiteData(data: SiteData): Promise<void> {
const res = await fetch("/api/site-data", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ data }),
});

if (!res.ok) {
const json = await res.json().catch(() => ({}));
throw new Error(json?.error || "Failed to save site data.");
}
}

async function uploadFiles(files: FileList | null, folder: string): Promise<MediaItem[]> {
if (!files?.length) return [];

const uploaded: MediaItem[] = [];

for (const file of Array.from(files)) {
const formData = new FormData();
formData.append("file", file);
formData.append("folder", folder);

const res = await fetch("/api/blob/upload", {
method: "POST",
body: formData,
});

const json = await res.json().catch(() => ({}));

if (!res.ok || !json?.url) {
throw new Error(json?.error || `Upload failed for ${file.name}`);
}

uploaded.push({
id: uid(),
url: String(json.url),
src: String(json.url),
pathname: String(json.pathname || json.url),
alt: file.name,
name: file.name,
createdAt: new Date().toISOString(),
});
}

return uploaded;
}

function phoneHref(phone: string) {
const clean = phone.replace(/[^\d+]/g, "");
return `tel:${clean}`;
}

function MediaImage({
item,
alt,
className = "",
}: {
item: MediaItem;
alt?: string;
className?: string;
}) {
const src = mediaUrl(item);
if (!src) return null;

return (
<img
src={src}
alt={alt || item.alt || item.name || "image"}
className={className}
draggable={false}
/>
);
}

function GlassCard({
children,
className = "",
}: {
children: ReactNode;
className?: string;
}) {
return (
<div
className={`rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl ${className}`}
>
{children}
</div>
);
}

export default function PortfolioPage() {
const router = useRouter();

const [site, setSite] = useState<SiteData>(DEFAULT_SITE_DATA);
const [ready, setReady] = useState(false);
const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
const [dragCategory, setDragCategory] = useState<Category | null>(null);
const [saving, setSaving] = useState(false);
const [notice, setNotice] = useState("");

const pageBackgroundUrl = mediaUrl(site.backgroundImage);
const selectedImageUrl = mediaUrl(selectedImage);

useEffect(() => {
let mounted = true;

loadSiteData().then((loaded) => {
if (!mounted) return;
setSite(loaded);
setReady(true);
});

return () => {
mounted = false;
};
}, []);

useEffect(() => {
if (!notice) return;

const timer = window.setTimeout(() => setNotice(""), 2200);

return () => {
window.clearTimeout(timer);
};
}, [notice]);

const allImages = useMemo(() => {
return CATEGORIES.flatMap((category) => site.portfolio[category]).filter((item) =>
Boolean(mediaUrl(item))
);
}, [site.portfolio]);

const pageBackgroundStyle: CSSProperties = pageBackgroundUrl
? {
backgroundImage: `url(${pageBackgroundUrl})`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
}
: {
background:
"radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%), radial-gradient(circle at top right, rgba(34,197,94,0.14), transparent 26%), radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0))",
};

const saveSite = async (nextSite: SiteData, successMessage = "Saved.") => {
try {
setSaving(true);
await saveSiteData(nextSite);
setNotice(successMessage);
} catch (error) {
console.error(error);
setNotice("Save failed.");
} finally {
setSaving(false);
}
};

const upload = async (category: Category, files: FileList | null) => {
try {
setNotice("Uploading...");
const nextImages = await uploadFiles(files, `portfolio/${category}`);
if (!nextImages.length) return;

const nextSite: SiteData = {
...site,
portfolio: {
...site.portfolio,
[category]: [...site.portfolio[category], ...nextImages],
},
};

setSite(nextSite);
await saveSite(nextSite, `${nextImages.length} image(s) added to ${category}.`);
} catch (error) {
console.error(error);
setNotice("Upload failed.");
}
};

const removeImage = async (category: Category, id: string) => {
const nextSite: SiteData = {
...site,
portfolio: {
...site.portfolio,
[category]: site.portfolio[category].filter((item) => item.id !== id),
},
};

setSite(nextSite);
await saveSite(nextSite, "Image removed.");
};

const clearCategory = async (category: Category) => {
if (!window.confirm(`Clear all images in ${category}?`)) return;

const nextSite: SiteData = {
...site,
portfolio: {
...site.portfolio,
[category]: [],
},
};

setSite(nextSite);
await saveSite(nextSite, `${category} cleared.`);
};

const onDrop =
(category: Category) =>
async (event: React.DragEvent<HTMLDivElement>) => {
event.preventDefault();
setDragCategory(null);
await upload(category, event.dataTransfer.files);
};

if (!ready) {
return (
<div className="min-h-screen bg-black px-4 py-10 text-white md:px-8">
<GlassCard className="mx-auto max-w-xl p-6">Loading portfolio...</GlassCard>
</div>
);
}

return (
<div className="min-h-screen bg-black text-white">
<style jsx global>{`
html {
scroll-behavior: smooth;
}
`}</style>

<div className="fixed inset-0 -z-30 bg-[#020202]" />
<div className="fixed inset-0 -z-20" style={pageBackgroundStyle} />
<div
className="fixed inset-0 -z-10"
style={{
background:
"linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 24%, rgba(0,0,0,0.82) 55%, rgba(0,0,0,0.9) 100%)",
}}
/>
<div
className="fixed inset-0 -z-10"
style={{
background: `rgba(0,0,0,${Math.max(
0.08,
Math.min(0.82, site.backgroundBrightness)
)})`,
}}
/>

<header className="sticky top-0 z-40 border-b border-white/10 bg-black/72 backdrop-blur-2xl">
<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
<button
type="button"
onClick={() => router.push("/")}
className="text-xs font-bold uppercase tracking-[0.25em] text-white/90"
>
{site.businessName}
</button>

<div className="flex gap-3">
<button
type="button"
onClick={() => router.push("/")}
className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80"
>
Home
</button>

<a href={phoneHref(site.phoneNumber)}>
<button
type="button"
className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
>
Call Now
</button>
</a>
</div>
</div>
</header>

<main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
{notice && (
<div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">
{notice}
</div>
)}

<div>
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Portfolio</p>
<h1 className="mt-3 text-4xl font-black md:text-6xl">All My Work</h1>
<p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
This page is the full gallery. Upload photos, drag and drop work by category, and every
image saves worldwide through your site data and Blob storage.
</p>

<div className="mt-4 flex flex-wrap gap-3">
<button
type="button"
onClick={() => router.push("/admin")}
className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/80"
>
Open Admin
</button>

<span className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/60">
{saving ? "Saving..." : "Worldwide save ready"}
</span>

<span className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/60">
{allImages.length} total image{allImages.length === 1 ? "" : "s"}
</span>
</div>
</div>

<GlassCard className="mt-10 p-5">
<h2 className="text-2xl font-bold">All My Work</h2>
<p className="mt-2 text-sm text-white/60">
Every uploaded photo from every category appears here.
</p>

{allImages.length > 0 ? (
<div className="mt-5 columns-1 gap-4 space-y-4 sm:columns-2 xl:columns-3 2xl:columns-4">
{allImages.map((img, index) => (
<button
key={`${img.id}_${index}`}
type="button"
onClick={() => setSelectedImage(img)}
className="break-inside-avoid overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5"
>
<MediaImage
item={img}
alt={`work ${index + 1}`}
className="h-auto w-full object-cover"
/>
</button>
))}
</div>
) : (
<div className="mt-5 rounded-[1.4rem] border border-dashed border-white/15 bg-black/20 p-10 text-center text-white/50">
No photos yet. Upload your work below.
</div>
)}
</GlassCard>

<div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
{CATEGORIES.map((category) => (
<div
key={category}
onDragOver={(event) => {
event.preventDefault();
setDragCategory(category);
}}
onDragLeave={() => setDragCategory(null)}
onDrop={onDrop(category)}
className={`rounded-[2rem] border p-4 transition ${
dragCategory === category
? "border-blue-400 bg-blue-500/10"
: "border-white/10 bg-white/5"
}`}
>
<div className="flex items-center justify-between gap-3">
<div>
<h3 className="font-semibold">{category}</h3>
<p className="mt-1 text-xs text-white/45">
{site.portfolio[category].length} image
{site.portfolio[category].length === 1 ? "" : "s"}
</p>
</div>

<div className="flex gap-2">
<label className="cursor-pointer rounded-full border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
Upload
<input
type="file"
multiple
accept="image/*"
className="hidden"
onChange={(event) => upload(category, event.target.files)}
/>
</label>

<button
type="button"
onClick={() => clearCategory(category)}
className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/75"
>
Clear
</button>
</div>
</div>

<div className="mt-4 rounded-[1.2rem] border border-dashed border-white/15 bg-black/20 p-4 text-center text-sm text-white/50">
Drag and drop photos here
</div>

<div className="mt-4">
{site.portfolio[category].length > 0 ? (
<div className="columns-2 gap-3 space-y-3">
{site.portfolio[category].map((img, index) => (
<div
key={`${category}_${img.id}_${index}`}
className="break-inside-avoid overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20"
>
<button
type="button"
onClick={() => setSelectedImage(img)}
className="block w-full"
>
<MediaImage
item={img}
alt={`${category} ${index + 1}`}
className="h-auto w-full object-cover"
/>
</button>

<div className="flex items-center justify-between gap-2 p-2">
<p className="truncate text-[11px] text-white/55">
{img.name || img.alt || `${category} image`}
</p>

<button
type="button"
onClick={() => removeImage(category, img.id)}
className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/70"
>
Delete
</button>
</div>
</div>
))}
</div>
) : (
<div className="flex min-h-48 items-center justify-center rounded-[1.2rem] border border-dashed border-white/15 bg-black/20 text-sm text-white/50">
No photos yet.
</div>
)}
</div>
</div>
))}
</div>
</main>

{selectedImage && selectedImageUrl && (
<button
type="button"
onClick={() => setSelectedImage(null)}
className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-5"
>
<img
src={selectedImageUrl}
alt={selectedImage.alt || selectedImage.name || "selected"}
className="max-h-[90vh] max-w-[95vw] rounded-3xl shadow-2xl"
/>
</button>
)}
</div>
);
}