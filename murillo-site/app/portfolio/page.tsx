"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
name?: string;
file?: File | null;
src?: string;
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

const DB_NAME = "MURILLO_SITE_DB";
const STORE_NAME = "site";
const STORE_KEY = "state";

const categories: Category[] = [
"Kitchen Remodel",
"Bathroom Remodel",
"Flooring Project",
"Custom Build",
"Repair Work",
"Renovation",
];

const defaultData: SiteData = {
businessName: "Murillo Renovations LLC",
phoneNumber: "+1 (678) 555-1234",
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
reviewsSubtitle:
"Show real reviews on the page and let customers upload photos with them.",
aboutTitle: "A contractor brand built to feel premium.",
aboutSubtitle:
"Murillo Renovations LLC handles remodeling, repairs, custom projects, and high-impact home improvements with a clean process from start to finish.",
faqTitle: "Common questions",
faqSubtitle: "Keep answers short, useful, and easy to scan.",
quickTitle: "Quick actions",
quickSubtitle:
"The homepage should always keep a customer one click away from the next step.",
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

function openDb(): Promise<IDBDatabase> {
return new Promise((resolve, reject) => {
const request = indexedDB.open(DB_NAME, 1);

request.onupgradeneeded = () => {
const db = request.result;
if (!db.objectStoreNames.contains(STORE_NAME)) {
db.createObjectStore(STORE_NAME);
}
};

request.onsuccess = () => resolve(request.result);
request.onerror = () => reject(request.error);
});
}

function parseJson(raw: string | null) {
if (!raw) return null;
try {
return JSON.parse(raw);
} catch {
return null;
}
}

function mediaFromUnknown(value: unknown): MediaItem | null {
if (!value) return null;

if (typeof value === "string") {
return { id: uid(), src: value };
}

if (typeof value === "object") {
const item = value as Record<string, unknown>;
const fileValue = item.file;

const out: MediaItem = {
id: typeof item.id === "string" ? item.id : uid(),
name: typeof item.name === "string" ? item.name : undefined,
src: typeof item.src === "string" ? item.src : undefined,
file: fileValue instanceof File ? fileValue : undefined,
};

if (out.src || out.file) return out;
}

return null;
}

function mediaArrayFromUnknown(value: unknown): MediaItem[] {
if (!Array.isArray(value)) return [];
return value.map(mediaFromUnknown).filter((item): item is MediaItem => Boolean(item));
}

function normalizeSite(input?: Partial<SiteData> | null): SiteData {
const safe = input || {};

const portfolio: Record<Category, MediaItem[]> = {
"Kitchen Remodel": [],
"Bathroom Remodel": [],
"Flooring Project": [],
"Custom Build": [],
"Repair Work": [],
Renovation: [],
};

for (const category of categories) {
portfolio[category] = mediaArrayFromUnknown(safe.portfolio?.[category]);
}

return {
...defaultData,
...safe,
backgroundImage: mediaFromUnknown(safe.backgroundImage) || null,
heroSectionBackgroundImage: mediaFromUnknown(safe.heroSectionBackgroundImage) || null,
backgroundBrightness:
typeof safe.backgroundBrightness === "number"
? safe.backgroundBrightness
: defaultData.backgroundBrightness,
heroSectionOverlay:
typeof safe.heroSectionOverlay === "number"
? safe.heroSectionOverlay
: defaultData.heroSectionOverlay,
portfolio,
reviews: Array.isArray(safe.reviews) ? safe.reviews : [],
visits: Array.isArray(safe.visits) ? safe.visits : [],
payments: Array.isArray(safe.payments) ? safe.payments : [],
};
}

function loadLegacyLocalState(): SiteData | null {
if (typeof window === "undefined") return null;

const settings =
parseJson(localStorage.getItem("murillo_settings")) ||
parseJson(localStorage.getItem("siteSettings"));
const portfolio =
parseJson(localStorage.getItem("murillo_portfolio")) ||
parseJson(localStorage.getItem("portfolioStore"));

const hasAnything = settings || portfolio;
if (!hasAnything) return null;

return normalizeSite({
businessName: typeof settings?.heroTitle === "string" ? settings.heroTitle : undefined,
heroSubtitle: typeof settings?.heroSubtitle === "string" ? settings.heroSubtitle : undefined,
zelleContact: typeof settings?.zelleContact === "string" ? settings.zelleContact : undefined,
phoneNumber: typeof settings?.phoneNumber === "string" ? settings.phoneNumber : undefined,
backgroundImage:
typeof settings?.backgroundImage === "string"
? { id: uid(), src: settings.backgroundImage }
: null,
backgroundBrightness:
typeof settings?.backgroundBrightness === "number"
? settings.backgroundBrightness
: undefined,
portfolio:
portfolio && typeof portfolio === "object"
? {
"Kitchen Remodel": Array.isArray(portfolio["Kitchen Remodel"])
? portfolio["Kitchen Remodel"]
: [],
"Bathroom Remodel": Array.isArray(portfolio["Bathroom Remodel"])
? portfolio["Bathroom Remodel"]
: [],
"Flooring Project": Array.isArray(portfolio["Flooring Project"])
? portfolio["Flooring Project"]
: [],
"Custom Build": Array.isArray(portfolio["Custom Build"])
? portfolio["Custom Build"]
: [],
"Repair Work": Array.isArray(portfolio["Repair Work"])
? portfolio["Repair Work"]
: [],
Renovation: Array.isArray(portfolio["Renovation"])
? portfolio["Renovation"]
: [],
}
: undefined,
});
}

async function loadState(): Promise<SiteData> {
try {
const db = await openDb();

const stored = await new Promise<unknown>((resolve, reject) => {
const tx = db.transaction(STORE_NAME, "readonly");
const store = tx.objectStore(STORE_NAME);
const req = store.get(STORE_KEY);

req.onsuccess = () => resolve(req.result);
req.onerror = () => reject(req.error);
});

if (stored) {
return normalizeSite(stored as Partial<SiteData>);
}

return loadLegacyLocalState() || defaultData;
} catch {
return loadLegacyLocalState() || defaultData;
}
}

async function saveState(data: SiteData): Promise<void> {
const db = await openDb();

await new Promise<void>((resolve, reject) => {
const tx = db.transaction(STORE_NAME, "readwrite");
const store = tx.objectStore(STORE_NAME);
const req = store.put(data, STORE_KEY);

req.onsuccess = () => resolve();
req.onerror = () => reject(req.error);
});
}

function fileToMedia(file: File): MediaItem {
return {
id: uid(),
name: file.name,
file,
};
}

async function filesToMedia(files: FileList | null): Promise<MediaItem[]> {
if (!files?.length) return [];
return Array.from(files).map(fileToMedia);
}

function useMediaUrl(item?: MediaItem | null) {
const [url, setUrl] = useState("");

useEffect(() => {
if (!item) {
setUrl("");
return;
}

if (item.src) {
setUrl(item.src);
return;
}

if (!item.file) {
setUrl("");
return;
}

const objectUrl = URL.createObjectURL(item.file);
setUrl(objectUrl);

return () => URL.revokeObjectURL(objectUrl);
}, [item?.id, item?.src, item?.file]);

return url;
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
const url = useMediaUrl(item);
if (!url) return null;

return <img src={url} alt={alt || item.name || "image"} className={className} draggable={false} />;
}

function GlassCard({
children,
className = "",
}: {
children: React.ReactNode;
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

const [site, setSite] = useState<SiteData>(defaultData);
const [ready, setReady] = useState(false);
const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
const [dragCategory, setDragCategory] = useState<Category | null>(null);
const [saving, setSaving] = useState(false);
const [notice, setNotice] = useState("");

const pageBackgroundUrl = useMediaUrl(site.backgroundImage);
const selectedImageUrl = useMediaUrl(selectedImage);

useEffect(() => {
let mounted = true;

loadState().then((loaded) => {
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
const timer = window.setTimeout(() => setNotice(""), 1800);
return () => window.clearTimeout(timer);
}, [notice]);

const allImages = useMemo(
() => categories.flatMap((category) => site.portfolio[category]),
[site.portfolio]
);

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

const saveSite = async (next: SiteData) => {
try {
setSaving(true);
await saveState(next);
setNotice("Saved.");
} catch {
setNotice("Save failed.");
} finally {
setSaving(false);
}
};

const upload = async (category: Category, files: FileList | null) => {
const nextImages = await filesToMedia(files);
if (!nextImages.length) return;

const nextSite: SiteData = {
...site,
portfolio: {
...site.portfolio,
[category]: [...site.portfolio[category], ...nextImages],
},
};

setSite(nextSite);
await saveSite(nextSite);
setNotice(`${nextImages.length} image(s) added to ${category}.`);
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
await saveSite(nextSite);
setNotice("Image removed.");
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
await saveSite(nextSite);
setNotice(`${category} cleared.`);
};

const onDrop =
(category: Category) =>
async (e: React.DragEvent<HTMLDivElement>) => {
e.preventDefault();
setDragCategory(null);
await upload(category, e.dataTransfer.files);
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
background: `rgba(0,0,0,${Math.max(0.08, Math.min(0.82, site.backgroundBrightness))})`,
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
<a href={`tel:${site.phoneNumber}`}>
<button
type="button"
className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
>
Request Visit
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
This page is the full gallery. Drop in a lot of photos, tap any image to open it full screen,
and keep adding more by category.
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
{saving ? "Saving..." : "Auto-save ready"}
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
{allImages.map((img, idx) => (
<button
key={`${img.id}_${idx}`}
type="button"
onClick={() => setSelectedImage(img)}
className="break-inside-avoid overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5"
>
<MediaImage item={img} alt={`work ${idx + 1}`} className="h-auto w-full object-cover" />
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
{categories.map((category) => (
<div
key={category}
onDragOver={(e) => {
e.preventDefault();
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
<h3 className="font-semibold">{category}</h3>

<div className="flex gap-2">
<label className="cursor-pointer rounded-full border border-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
Upload
<input
type="file"
multiple
accept="image/*"
className="hidden"
onChange={(e) => upload(category, e.target.files)}
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
{site.portfolio[category].map((img, idx) => (
<div
key={`${category}_${img.id}_${idx}`}
className="break-inside-avoid overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20"
>
<button
type="button"
onClick={() => setSelectedImage(img)}
className="block w-full"
>
<MediaImage
item={img}
alt={`${category} ${idx + 1}`}
className="h-auto w-full object-cover"
/>
</button>

<div className="flex items-center justify-between gap-2 p-2">
<p className="truncate text-[11px] text-white/55">
{img.name || `${category} image`}
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
alt={selectedImage.name || "selected"}
className="max-h-[90vh] max-w-[95vw] rounded-3xl shadow-2xl"
/>
</button>
)}
</div>
);
}
