"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties } from "react";
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
heroSubtitle: string;

backgroundImage: MediaItem | null;
heroSectionBackgroundImage: MediaItem | null;
heroTopImage: MediaItem | null;
heroBottomImage: MediaItem | null;

backgroundBrightness: number;
heroSectionOverlay: number;

startCardTitle: string;
startCardText: string;

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

ctaTitle: string;
ctaText: string;

stat1Value: string;
stat1Label: string;
stat2Value: string;
stat2Label: string;
stat3Value: string;
stat3Label: string;
stat4Value: string;
stat4Label: string;

portfolio: Record<Category, MediaItem[]>;
reviews: ReviewItem[];
visits: VisitItem[];
payments: PaymentItem[];
};

type SitePayload = {
content?: Record<string, unknown>;
portfolio?: Partial<Record<Category, unknown>>;
reviews?: unknown[];
visits?: unknown[];
payments?: unknown[];
updatedAt?: string;
[key: string]: unknown;
};

type Tab = "content" | "images" | "portfolio" | "reviews" | "visits" | "payments" | "preview";

const CATEGORIES: Category[] = [
"Kitchen Remodel",
"Bathroom Remodel",
"Flooring Project",
"Custom Build",
"Repair Work",
"Renovation",
];

const DEFAULT_PHONE = "+14043893672";

const DEFAULT_SITE: SiteData = {
businessName: "Murillo Renovations LLC",
phoneNumber: DEFAULT_PHONE,
zelleContact: "your-zelle@email.com",

heroBadge: "Licensed & Insured General Contractor",
heroTitleLine1: "Luxury Homes",
heroTitleLine2: "Done Once.",
heroSubtitle:
"Premium remodeling, renovation, and custom construction with a clean process, strong communication, and results that feel expensive.",

backgroundImage: null,
heroSectionBackgroundImage: null,
heroTopImage: null,
heroBottomImage: null,

backgroundBrightness: 0.45,
heroSectionOverlay: 0.58,

startCardTitle: "Quote, visit, or pay in one place.",
startCardText:
"Customers can send a message, upload pictures, book a site visit, leave a review, or submit payment proof.",

servicesTitle: "Everything the site should sell",
servicesSubtitle:
"Keep the homepage premium with strong service blocks, direct action buttons, and clear customer paths.",

portfolioTitle: "Selected work",
portfolioSubtitle:
"The full portfolio lives on its own page and each category can hold as many images as you want.",

reviewsTitle: "What clients say",
reviewsSubtitle: "Show real reviews on the page and let customers upload photos with them.",

aboutTitle: "A contractor brand built to feel premium.",
aboutSubtitle:
"Murillo Renovations LLC handles remodeling, repairs, custom projects, and high-impact home improvements with a clean process from start to finish.",

faqTitle: "Common questions",
faqSubtitle: "Keep answers short, useful, and easy to scan.",

quickTitle: "Quick actions",
quickSubtitle: "The homepage should always keep a customer one click away from the next step.",

ctaTitle: "Book a visit, get a quote, or make a payment.",
ctaText: "Use the buttons above to keep the customer flow fast and clean.",

stat1Value: "100+",
stat1Label: "projects",
stat2Value: "5★",
stat2Label: "service",
stat3Value: "Fast",
stat3Label: "response",
stat4Value: "Clean",
stat4Label: "process",

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

function getRecord(value: unknown): Record<string, unknown> {
return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function mediaUrl(item?: MediaItem | null) {
if (!item) return "";
return item.url || item.src || "";
}

function toMediaItem(value: unknown): MediaItem | null {
if (!value) return null;

if (typeof value === "string" && value.trim()) {
return {
id: uid(),
url: value.trim(),
src: value.trim(),
name: "image",
alt: "image",
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
return value.map(toMediaItem).filter((item): item is MediaItem => Boolean(item && mediaUrl(item)));
}

function getString(obj: Record<string, unknown>, keys: string[], fallback: string) {
for (const key of keys) {
const value = obj[key];
if (typeof value === "string" && value.trim()) return value.trim();
}
return fallback;
}

function getNumber(obj: Record<string, unknown>, keys: string[], fallback: number) {
for (const key of keys) {
const value = obj[key];
if (typeof value === "number" && Number.isFinite(value)) return value;
if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
}
return fallback;
}

function firstMedia(obj: Record<string, unknown>, keys: string[]) {
for (const key of keys) {
const media = toMediaItem(obj[key]);
if (media && mediaUrl(media)) return media;
}
return null;
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
: Math.max(1, Math.min(5, Number(raw.rating) || 5)),
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

function normalizeSiteData(payloadInput: unknown): SiteData {
const payload = getRecord(payloadInput);
const content = payload.content && typeof payload.content === "object" ? getRecord(payload.content) : payload;

const portfolioSource =
Object.keys(getRecord(payload.portfolio)).length > 0
? getRecord(payload.portfolio)
: getRecord(content.portfolio);

const portfolio: Record<Category, MediaItem[]> = {
"Kitchen Remodel": [],
"Bathroom Remodel": [],
"Flooring Project": [],
"Custom Build": [],
"Repair Work": [],
Renovation: [],
};

for (const category of CATEGORIES) {
portfolio[category] = normalizeMediaArray(portfolioSource[category]);
}

const backgroundImage =
firstMedia(content, ["backgroundImage", "backgroundUrl", "backgroundImageUrl", "heroBackgroundUrl"]) ||
null;

const heroSectionBackgroundImage =
firstMedia(content, [
"heroSectionBackgroundImage",
"heroSectionBackgroundUrl",
"heroBackgroundImage",
"heroBackgroundUrl",
"backgroundImage",
"backgroundUrl",
"backgroundImageUrl",
]) || backgroundImage;

const heroTopImage =
firstMedia(content, ["heroTopImage", "heroImageTop", "rightCardTopImage", "topImage", "topImageUrl"]) ||
null;

const heroBottomImage =
firstMedia(content, [
"heroBottomImage",
"heroImageBottom",
"rightCardBottomImage",
"bottomImage",
"bottomImageUrl",
]) || null;

const reviewsRaw =
Array.isArray(payload.reviews)
? payload.reviews
: Array.isArray(content.reviews)
? content.reviews
: [];

const visitsRaw =
Array.isArray(payload.visits)
? payload.visits
: Array.isArray(content.visits)
? content.visits
: [];

const paymentsRaw =
Array.isArray(payload.payments)
? payload.payments
: Array.isArray(content.payments)
? content.payments
: [];

return {
...DEFAULT_SITE,

businessName: getString(content, ["businessName"], DEFAULT_SITE.businessName),
phoneNumber: getString(content, ["phoneNumber", "phone"], DEFAULT_SITE.phoneNumber),
zelleContact: getString(content, ["zelleContact", "zelle"], DEFAULT_SITE.zelleContact),

heroBadge: getString(content, ["heroBadge"], DEFAULT_SITE.heroBadge),
heroTitleLine1: getString(content, ["heroTitleLine1", "heroTitle1"], DEFAULT_SITE.heroTitleLine1),
heroTitleLine2: getString(content, ["heroTitleLine2", "heroTitle2"], DEFAULT_SITE.heroTitleLine2),
heroSubtitle: getString(content, ["heroSubtitle", "subtitle"], DEFAULT_SITE.heroSubtitle),

backgroundImage,
heroSectionBackgroundImage,
heroTopImage,
heroBottomImage,

backgroundBrightness: getNumber(content, ["backgroundBrightness"], DEFAULT_SITE.backgroundBrightness),
heroSectionOverlay: getNumber(content, ["heroSectionOverlay", "heroOverlay"], DEFAULT_SITE.heroSectionOverlay),

startCardTitle: getString(content, ["startCardTitle", "quickStartTitle"], DEFAULT_SITE.startCardTitle),
startCardText: getString(content, ["startCardText", "quickStartText"], DEFAULT_SITE.startCardText),

servicesTitle: getString(content, ["servicesTitle"], DEFAULT_SITE.servicesTitle),
servicesSubtitle: getString(content, ["servicesSubtitle"], DEFAULT_SITE.servicesSubtitle),

portfolioTitle: getString(content, ["portfolioTitle"], DEFAULT_SITE.portfolioTitle),
portfolioSubtitle: getString(content, ["portfolioSubtitle"], DEFAULT_SITE.portfolioSubtitle),

reviewsTitle: getString(content, ["reviewsTitle"], DEFAULT_SITE.reviewsTitle),
reviewsSubtitle: getString(content, ["reviewsSubtitle"], DEFAULT_SITE.reviewsSubtitle),

aboutTitle: getString(content, ["aboutTitle"], DEFAULT_SITE.aboutTitle),
aboutSubtitle: getString(content, ["aboutSubtitle"], DEFAULT_SITE.aboutSubtitle),

faqTitle: getString(content, ["faqTitle"], DEFAULT_SITE.faqTitle),
faqSubtitle: getString(content, ["faqSubtitle"], DEFAULT_SITE.faqSubtitle),

quickTitle: getString(content, ["quickTitle"], DEFAULT_SITE.quickTitle),
quickSubtitle: getString(content, ["quickSubtitle"], DEFAULT_SITE.quickSubtitle),

ctaTitle: getString(content, ["ctaTitle"], DEFAULT_SITE.ctaTitle),
ctaText: getString(content, ["ctaText"], DEFAULT_SITE.ctaText),

stat1Value: getString(content, ["stat1Value", "stat1"], DEFAULT_SITE.stat1Value),
stat1Label: getString(content, ["stat1Label"], DEFAULT_SITE.stat1Label),
stat2Value: getString(content, ["stat2Value", "stat2"], DEFAULT_SITE.stat2Value),
stat2Label: getString(content, ["stat2Label"], DEFAULT_SITE.stat2Label),
stat3Value: getString(content, ["stat3Value", "stat3"], DEFAULT_SITE.stat3Value),
stat3Label: getString(content, ["stat3Label"], DEFAULT_SITE.stat3Label),
stat4Value: getString(content, ["stat4Value", "stat4"], DEFAULT_SITE.stat4Value),
stat4Label: getString(content, ["stat4Label"], DEFAULT_SITE.stat4Label),

portfolio,
reviews: reviewsRaw.map(normalizeReview).filter((item): item is ReviewItem => Boolean(item)),
visits: visitsRaw.map(normalizeVisit).filter((item): item is VisitItem => Boolean(item)),
payments: paymentsRaw.map(normalizePayment).filter((item): item is PaymentItem => Boolean(item)),
};
}

function makePayload(site: SiteData): SitePayload {
return {
content: {
businessName: site.businessName,
phoneNumber: site.phoneNumber,
zelleContact: site.zelleContact,

heroBadge: site.heroBadge,
heroTitleLine1: site.heroTitleLine1,
heroTitleLine2: site.heroTitleLine2,
heroSubtitle: site.heroSubtitle,

backgroundImage: site.backgroundImage,
heroSectionBackgroundImage: site.heroSectionBackgroundImage,
heroTopImage: site.heroTopImage,
heroBottomImage: site.heroBottomImage,

backgroundBrightness: site.backgroundBrightness,
heroSectionOverlay: site.heroSectionOverlay,

startCardTitle: site.startCardTitle,
startCardText: site.startCardText,

servicesTitle: site.servicesTitle,
servicesSubtitle: site.servicesSubtitle,

portfolioTitle: site.portfolioTitle,
portfolioSubtitle: site.portfolioSubtitle,

reviewsTitle: site.reviewsTitle,
reviewsSubtitle: site.reviewsSubtitle,

aboutTitle: site.aboutTitle,
aboutSubtitle: site.aboutSubtitle,

faqTitle: site.faqTitle,
faqSubtitle: site.faqSubtitle,

quickTitle: site.quickTitle,
quickSubtitle: site.quickSubtitle,

ctaTitle: site.ctaTitle,
ctaText: site.ctaText,

stat1Value: site.stat1Value,
stat1Label: site.stat1Label,
stat2Value: site.stat2Value,
stat2Label: site.stat2Label,
stat3Value: site.stat3Value,
stat3Label: site.stat3Label,
stat4Value: site.stat4Value,
stat4Label: site.stat4Label,
},
portfolio: site.portfolio,
reviews: site.reviews,
visits: site.visits,
payments: site.payments,
updatedAt: new Date().toISOString(),
};
}

async function loadSite(): Promise<SiteData> {
try {
const res = await fetch("/api/site-data", { cache: "no-store" });
if (!res.ok) throw new Error("Failed to load site data.");
const json = await res.json();
return normalizeSiteData(json?.data ?? json);
} catch (error) {
console.error("Admin load failed:", error);
return DEFAULT_SITE;
}
}

async function saveSite(site: SiteData) {
const res = await fetch("/api/site-data", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
data: makePayload(site),
}),
});

if (!res.ok) {
const json = await res.json().catch(() => ({}));
throw new Error(json?.error || "Save failed.");
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
name: file.name,
alt: file.name,
createdAt: new Date().toISOString(),
});
}

return uploaded;
}

function Field({
label,
value,
onChange,
textarea = false,
placeholder = "",
}: {
label: string;
value: string;
onChange: (value: string) => void;
textarea?: boolean;
placeholder?: string;
}) {
return (
<label className="block">
<span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.28em] text-white/45">
{label}
</span>

{textarea ? (
<textarea
value={value}
onChange={(event) => onChange(event.target.value)}
placeholder={placeholder}
className="min-h-28 w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-white outline-none"
/>
) : (
<input
value={value}
onChange={(event) => onChange(event.target.value)}
placeholder={placeholder}
className="w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-white outline-none"
/>
)}
</label>
);
}

function NumberSlider({
label,
value,
min,
max,
step,
onChange,
}: {
label: string;
value: number;
min: number;
max: number;
step: number;
onChange: (value: number) => void;
}) {
return (
<label className="block">
<span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.28em] text-white/45">
{label}: {value}
</span>
<input
type="range"
value={value}
min={min}
max={max}
step={step}
onChange={(event) => onChange(Number(event.target.value))}
className="w-full"
/>
</label>
);
}

function MediaPreview({ item }: { item: MediaItem | null }) {
const src = mediaUrl(item);

if (!src) {
return (
<div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/25 text-sm text-white/45">
No image
</div>
);
}

return (
<img
src={src}
alt={item?.alt || item?.name || "image"}
className="h-40 w-full rounded-2xl border border-white/10 object-cover"
/>
);
}

function UploadButton({
label,
folder,
onUploaded,
}: {
label: string;
folder: string;
onUploaded: (items: MediaItem[]) => void;
}) {
const [busy, setBusy] = useState(false);

async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
try {
setBusy(true);
const uploaded = await uploadFiles(event.target.files, folder);
onUploaded(uploaded);
event.target.value = "";
} catch (error) {
alert(error instanceof Error ? error.message : "Upload failed.");
} finally {
setBusy(false);
}
}

return (
<label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
{busy ? "Uploading..." : label}
<input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
</label>
);
}

function SingleImageEditor({
title,
item,
folder,
onChange,
}: {
title: string;
item: MediaItem | null;
folder: string;
onChange: (item: MediaItem | null) => void;
}) {
const [url, setUrl] = useState(mediaUrl(item));

useEffect(() => {
setUrl(mediaUrl(item));
}, [item]);

return (
<div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
<h3 className="font-bold">{title}</h3>

<div className="mt-4">
<MediaPreview item={item} />
</div>

<div className="mt-4 flex flex-wrap gap-2">
<UploadButton
label="Upload image"
folder={folder}
onUploaded={(items) => {
if (items[0]) onChange(items[0]);
}}
/>

<button
type="button"
onClick={() => onChange(null)}
className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/75"
>
Remove
</button>
</div>

<div className="mt-4">
<Field
label="Image URL"
value={url}
onChange={(value) => {
setUrl(value);
onChange(value.trim() ? toMediaItem(value) : null);
}}
placeholder="Paste image URL"
/>
</div>
</div>
);
}

function ImageCard({
image,
onRemove,
}: {
image: MediaItem;
onRemove: () => void;
}) {
return (
<div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
<img src={mediaUrl(image)} alt={image.alt || image.name || "image"} className="h-36 w-full object-cover" />
<div className="flex items-center justify-between gap-2 p-3">
<p className="truncate text-xs text-white/55">{image.name || image.alt || "image"}</p>
<button
type="button"
onClick={onRemove}
className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
>
Delete
</button>
</div>
</div>
);
}

function AdminCard({
title,
subtitle,
children,
}: {
title: string;
subtitle?: string;
children: React.ReactNode;
}) {
return (
<section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-7">
<div className="mb-5">
<h2 className="text-2xl font-black">{title}</h2>
{subtitle ? <p className="mt-2 text-sm leading-6 text-white/60">{subtitle}</p> : null}
</div>
{children}
</section>
);
}

function phoneHref(phone: string) {
return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default function AdminPage() {
const router = useRouter();

const [site, setSite] = useState<SiteData>(DEFAULT_SITE);
const [tab, setTab] = useState<Tab>("content");
const [ready, setReady] = useState(false);
const [saving, setSaving] = useState(false);
const [notice, setNotice] = useState("");

useEffect(() => {
let mounted = true;

loadSite().then((loaded) => {
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
const timer = window.setTimeout(() => setNotice(""), 2500);
return () => window.clearTimeout(timer);
}, [notice]);

const allImages = useMemo(() => {
return CATEGORIES.flatMap((category) => site.portfolio[category]).filter((item) => mediaUrl(item));
}, [site.portfolio]);

const pageBg = mediaUrl(site.backgroundImage) || mediaUrl(site.heroSectionBackgroundImage);

const bgStyle: CSSProperties = pageBg
? {
backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.72), rgba(0,0,0,.9)), url(${pageBg})`,
backgroundSize: "cover",
backgroundPosition: "center",
}
: {
background:
"radial-gradient(circle at top left, rgba(59,130,246,.18), transparent 28%), radial-gradient(circle at top right, rgba(34,197,94,.14), transparent 28%), #030303",
};

function update<K extends keyof SiteData>(key: K, value: SiteData[K]) {
setSite((prev) => ({
...prev,
[key]: value,
}));
}

async function saveNow(nextSite = site) {
try {
setSaving(true);
setNotice("Saving...");
await saveSite(nextSite);
setNotice("Saved worldwide.");
} catch (error) {
console.error(error);
setNotice("Save failed.");
} finally {
setSaving(false);
}
}

async function reloadNow() {
setReady(false);
const loaded = await loadSite();
setSite(loaded);
setReady(true);
setNotice("Reloaded.");
}

function addReview() {
setSite((prev) => ({
...prev,
reviews: [
{
id: uid(),
name: "New Customer",
rating: 5,
text: "Great work and clean process.",
photos: [],
date: new Date().toLocaleString(),
},
...prev.reviews,
],
}));
}

function addVisit() {
setSite((prev) => ({
...prev,
visits: [
{
id: uid(),
name: "New Visit",
email: "",
phone: "",
address: "",
jobType: "",
preferredTime: "",
details: "",
date: new Date().toLocaleString(),
},
...prev.visits,
],
}));
}

function addPayment() {
setSite((prev) => ({
...prev,
payments: [
{
id: uid(),
amount: "",
name: "New Payment",
email: "",
notes: "",
proofs: [],
date: new Date().toLocaleString(),
},
...prev.payments,
],
}));
}

if (!ready) {
return (
<main className="min-h-screen bg-black p-5 text-white">
<div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6">
Loading admin...
</div>
</main>
);
}

return (
<main className="min-h-screen text-white" style={bgStyle}>
<div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
<header className="sticky top-0 z-40 mb-6 rounded-[2rem] border border-white/10 bg-black/70 p-4 backdrop-blur-2xl">
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Murillo Admin</p>
<h1 className="text-2xl font-black">{site.businessName}</h1>
</div>

<div className="flex flex-wrap gap-2">
{(["content", "images", "portfolio", "reviews", "visits", "payments", "preview"] as Tab[]).map(
(item) => (
<button
key={item}
type="button"
onClick={() => setTab(item)}
className={`rounded-full px-4 py-2 text-sm font-semibold ${
tab === item ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white"
}`}
>
{item[0].toUpperCase() + item.slice(1)}
</button>
)
)}
</div>

<div className="flex flex-wrap gap-2">
<button
type="button"
onClick={() => saveNow()}
disabled={saving}
className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-black disabled:opacity-60"
>
{saving ? "Saving..." : "Save Worldwide"}
</button>

<button
type="button"
onClick={reloadNow}
className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold"
>
Reload
</button>

<button
type="button"
onClick={() => router.push("/")}
className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold"
>
View Site
</button>
</div>
</div>

{notice ? (
<div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">{notice}</div>
) : null}
</header>

{tab === "content" && (
<div className="grid gap-5">
<AdminCard title="Business + hero" subtitle="Edit your main homepage words. These save worldwide.">
<div className="grid gap-4 md:grid-cols-2">
<Field label="Business name" value={site.businessName} onChange={(value) => update("businessName", value)} />
<Field label="Phone number" value={site.phoneNumber} onChange={(value) => update("phoneNumber", value)} />
<Field label="Zelle contact" value={site.zelleContact} onChange={(value) => update("zelleContact", value)} />
<Field label="Hero badge" value={site.heroBadge} onChange={(value) => update("heroBadge", value)} />
<Field label="Hero title line 1" value={site.heroTitleLine1} onChange={(value) => update("heroTitleLine1", value)} />
<Field label="Hero title line 2" value={site.heroTitleLine2} onChange={(value) => update("heroTitleLine2", value)} />
<div className="md:col-span-2">
<Field
label="Hero subtitle"
value={site.heroSubtitle}
textarea
onChange={(value) => update("heroSubtitle", value)}
/>
</div>
</div>
</AdminCard>

<AdminCard title="Homepage sections" subtitle="Edit section titles, subtitles, and call-to-action wording.">
<div className="grid gap-4 md:grid-cols-2">
<Field label="Start card title" value={site.startCardTitle} onChange={(value) => update("startCardTitle", value)} />
<Field label="Start card text" value={site.startCardText} textarea onChange={(value) => update("startCardText", value)} />

<Field label="Services title" value={site.servicesTitle} onChange={(value) => update("servicesTitle", value)} />
<Field label="Services subtitle" value={site.servicesSubtitle} textarea onChange={(value) => update("servicesSubtitle", value)} />

<Field label="Portfolio title" value={site.portfolioTitle} onChange={(value) => update("portfolioTitle", value)} />
<Field label="Portfolio subtitle" value={site.portfolioSubtitle} textarea onChange={(value) => update("portfolioSubtitle", value)} />

<Field label="Reviews title" value={site.reviewsTitle} onChange={(value) => update("reviewsTitle", value)} />
<Field label="Reviews subtitle" value={site.reviewsSubtitle} textarea onChange={(value) => update("reviewsSubtitle", value)} />

<Field label="About title" value={site.aboutTitle} onChange={(value) => update("aboutTitle", value)} />
<Field label="About subtitle" value={site.aboutSubtitle} textarea onChange={(value) => update("aboutSubtitle", value)} />

<Field label="FAQ title" value={site.faqTitle} onChange={(value) => update("faqTitle", value)} />
<Field label="FAQ subtitle" value={site.faqSubtitle} textarea onChange={(value) => update("faqSubtitle", value)} />

<Field label="Quick title" value={site.quickTitle} onChange={(value) => update("quickTitle", value)} />
<Field label="Quick subtitle" value={site.quickSubtitle} textarea onChange={(value) => update("quickSubtitle", value)} />

<Field label="Green CTA title" value={site.ctaTitle} onChange={(value) => update("ctaTitle", value)} />
<Field label="Green CTA text" value={site.ctaText} textarea onChange={(value) => update("ctaText", value)} />
</div>
</AdminCard>

<AdminCard title="Stats">
<div className="grid gap-4 md:grid-cols-4">
<Field label="Stat 1 value" value={site.stat1Value} onChange={(value) => update("stat1Value", value)} />
<Field label="Stat 1 label" value={site.stat1Label} onChange={(value) => update("stat1Label", value)} />
<Field label="Stat 2 value" value={site.stat2Value} onChange={(value) => update("stat2Value", value)} />
<Field label="Stat 2 label" value={site.stat2Label} onChange={(value) => update("stat2Label", value)} />
<Field label="Stat 3 value" value={site.stat3Value} onChange={(value) => update("stat3Value", value)} />
<Field label="Stat 3 label" value={site.stat3Label} onChange={(value) => update("stat3Label", value)} />
<Field label="Stat 4 value" value={site.stat4Value} onChange={(value) => update("stat4Value", value)} />
<Field label="Stat 4 label" value={site.stat4Label} onChange={(value) => update("stat4Label", value)} />
</div>
</AdminCard>
</div>
)}

{tab === "images" && (
<div className="grid gap-5">
<AdminCard title="Background images" subtitle="Upload from phone or laptop. These are saved to Blob and visible worldwide.">
<div className="grid gap-4 md:grid-cols-2">
<SingleImageEditor
title="Whole page background"
item={site.backgroundImage}
folder="admin/background"
onChange={(item) => update("backgroundImage", item)}
/>

<SingleImageEditor
title="Hero section background"
item={site.heroSectionBackgroundImage}
folder="admin/hero-background"
onChange={(item) => update("heroSectionBackgroundImage", item)}
/>

<SingleImageEditor
title="Right card top image"
item={site.heroTopImage}
folder="admin/hero-top"
onChange={(item) => update("heroTopImage", item)}
/>

<SingleImageEditor
title="Right card bottom image"
item={site.heroBottomImage}
folder="admin/hero-bottom"
onChange={(item) => update("heroBottomImage", item)}
/>
</div>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<NumberSlider
label="Background brightness"
value={site.backgroundBrightness}
min={0.03}
max={0.9}
step={0.01}
onChange={(value) => update("backgroundBrightness", value)}
/>

<NumberSlider
label="Hero overlay"
value={site.heroSectionOverlay}
min={0.05}
max={0.95}
step={0.01}
onChange={(value) => update("heroSectionOverlay", value)}
/>
</div>
</AdminCard>
</div>
)}

{tab === "portfolio" && (
<div className="grid gap-5">
<AdminCard title="Portfolio images" subtitle="Upload work images by category. They show on homepage preview and portfolio page worldwide.">
<div className="mb-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/70">
Total images: {allImages.length}
</div>

<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
{CATEGORIES.map((category) => (
<div key={category} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
<div className="flex items-center justify-between gap-3">
<div>
<h3 className="font-bold">{category}</h3>
<p className="text-xs text-white/45">{site.portfolio[category].length} image(s)</p>
</div>

<UploadButton
label="Upload"
folder={`portfolio/${category}`}
onUploaded={(items) => {
setSite((prev) => ({
...prev,
portfolio: {
...prev.portfolio,
[category]: [...prev.portfolio[category], ...items],
},
}));
}}
/>
</div>

<div className="mt-4 grid gap-3">
{site.portfolio[category].length === 0 ? (
<div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/45">
No images yet
</div>
) : (
site.portfolio[category].map((image) => (
<ImageCard
key={image.id}
image={image}
onRemove={() => {
setSite((prev) => ({
...prev,
portfolio: {
...prev.portfolio,
[category]: prev.portfolio[category].filter((item) => item.id !== image.id),
},
}));
}}
/>
))
)}
</div>
</div>
))}
</div>
</AdminCard>
</div>
)}

{tab === "reviews" && (
<AdminCard title="Reviews" subtitle="View, edit, delete, and add review photos.">
<button
type="button"
onClick={addReview}
className="mb-5 rounded-full bg-white px-5 py-3 text-sm font-black text-black"
>
Add Review
</button>

<div className="grid gap-4">
{site.reviews.length === 0 ? (
<div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/45">
No reviews yet.
</div>
) : (
site.reviews.map((review, index) => (
<div key={review.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
<div className="grid gap-4 md:grid-cols-2">
<Field
label="Name"
value={review.name}
onChange={(value) => {
setSite((prev) => ({
...prev,
reviews: prev.reviews.map((item, i) => (i === index ? { ...item, name: value } : item)),
}));
}}
/>

<Field
label="Rating"
value={String(review.rating)}
onChange={(value) => {
setSite((prev) => ({
...prev,
reviews: prev.reviews.map((item, i) =>
i === index ? { ...item, rating: Math.max(1, Math.min(5, Number(value) || 5)) } : item
),
}));
}}
/>

<div className="md:col-span-2">
<Field
label="Review text"
value={review.text}
textarea
onChange={(value) => {
setSite((prev) => ({
...prev,
reviews: prev.reviews.map((item, i) => (i === index ? { ...item, text: value } : item)),
}));
}}
/>
</div>
</div>

<div className="mt-4 flex flex-wrap gap-2">
<UploadButton
label="Add review photos"
folder="reviews"
onUploaded={(items) => {
setSite((prev) => ({
...prev,
reviews: prev.reviews.map((item, i) =>
i === index ? { ...item, photos: [...item.photos, ...items] } : item
),
}));
}}
/>

<button
type="button"
onClick={() => {
setSite((prev) => ({
...prev,
reviews: prev.reviews.filter((_, i) => i !== index),
}));
}}
className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/75"
>
Delete Review
</button>
</div>

{review.photos.length > 0 ? (
<div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
{review.photos.map((photo) => (
<ImageCard
key={photo.id}
image={photo}
onRemove={() => {
setSite((prev) => ({
...prev,
reviews: prev.reviews.map((item, i) =>
i === index ? { ...item, photos: item.photos.filter((p) => p.id !== photo.id) } : item
),
}));
}}
/>
))}
</div>
) : null}
</div>
))
)}
</div>
</AdminCard>
)}

{tab === "visits" && (
<AdminCard title="Visit requests" subtitle="View and edit requests submitted from the site.">
<button
type="button"
onClick={addVisit}
className="mb-5 rounded-full bg-white px-5 py-3 text-sm font-black text-black"
>
Add Visit
</button>

<div className="grid gap-4">
{site.visits.length === 0 ? (
<div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/45">
No visits yet.
</div>
) : (
site.visits.map((visit, index) => (
<div key={visit.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
<div className="grid gap-4 md:grid-cols-2">
{(["name", "email", "phone", "address", "jobType", "preferredTime"] as const).map((key) => (
<Field
key={key}
label={key}
value={visit[key]}
onChange={(value) => {
setSite((prev) => ({
...prev,
visits: prev.visits.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
}));
}}
/>
))}

<div className="md:col-span-2">
<Field
label="Details"
value={visit.details}
textarea
onChange={(value) => {
setSite((prev) => ({
...prev,
visits: prev.visits.map((item, i) => (i === index ? { ...item, details: value } : item)),
}));
}}
/>
</div>
</div>

<div className="mt-4 flex flex-wrap gap-2">
<a href={phoneHref(visit.phone)}>
<button type="button" className="rounded-full border border-white/10 px-4 py-3 text-sm">
Call
</button>
</a>

<button
type="button"
onClick={() => {
setSite((prev) => ({
...prev,
visits: prev.visits.filter((_, i) => i !== index),
}));
}}
className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/75"
>
Delete Visit
</button>
</div>
</div>
))
)}
</div>
</AdminCard>
)}

{tab === "payments" && (
<AdminCard title="Payments" subtitle="View customer payment proof uploads.">
<button
type="button"
onClick={addPayment}
className="mb-5 rounded-full bg-white px-5 py-3 text-sm font-black text-black"
>
Add Payment
</button>

<div className="grid gap-4">
{site.payments.length === 0 ? (
<div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/45">
No payments yet.
</div>
) : (
site.payments.map((payment, index) => (
<div key={payment.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
<div className="grid gap-4 md:grid-cols-2">
<Field
label="Amount"
value={payment.amount}
onChange={(value) => {
setSite((prev) => ({
...prev,
payments: prev.payments.map((item, i) => (i === index ? { ...item, amount: value } : item)),
}));
}}
/>

<Field
label="Name"
value={payment.name}
onChange={(value) => {
setSite((prev) => ({
...prev,
payments: prev.payments.map((item, i) => (i === index ? { ...item, name: value } : item)),
}));
}}
/>

<Field
label="Email"
value={payment.email}
onChange={(value) => {
setSite((prev) => ({
...prev,
payments: prev.payments.map((item, i) => (i === index ? { ...item, email: value } : item)),
}));
}}
/>

<div className="md:col-span-2">
<Field
label="Notes"
value={payment.notes}
textarea
onChange={(value) => {
setSite((prev) => ({
...prev,
payments: prev.payments.map((item, i) => (i === index ? { ...item, notes: value } : item)),
}));
}}
/>
</div>
</div>

<div className="mt-4 flex flex-wrap gap-2">
<UploadButton
label="Add payment proof"
folder="payments"
onUploaded={(items) => {
setSite((prev) => ({
...prev,
payments: prev.payments.map((item, i) =>
i === index ? { ...item, proofs: [...item.proofs, ...items] } : item
),
}));
}}
/>

<button
type="button"
onClick={() => {
setSite((prev) => ({
...prev,
payments: prev.payments.filter((_, i) => i !== index),
}));
}}
className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/75"
>
Delete Payment
</button>
</div>

{payment.proofs.length > 0 ? (
<div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
{payment.proofs.map((proof) => (
<ImageCard
key={proof.id}
image={proof}
onRemove={() => {
setSite((prev) => ({
...prev,
payments: prev.payments.map((item, i) =>
i === index ? { ...item, proofs: item.proofs.filter((p) => p.id !== proof.id) } : item
),
}));
}}
/>
))}
</div>
) : null}
</div>
))
)}
</div>
</AdminCard>
)}

{tab === "preview" && (
<AdminCard title="Live preview" subtitle="This shows what the homepage data looks like before/after saving.">
<div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
<div className="rounded-[2rem] border border-white/10 bg-black/35 p-6">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">{site.heroBadge}</p>
<h2 className="mt-4 text-5xl font-black leading-[0.95]">
{site.heroTitleLine1}
<span className="block text-blue-400">{site.heroTitleLine2}</span>
</h2>
<p className="mt-4 text-sm leading-7 text-white/65">{site.heroSubtitle}</p>

<div className="mt-6 flex flex-wrap gap-3">
<button className="rounded-full bg-white px-5 py-3 font-bold text-black">Request Visit</button>
<button className="rounded-full border border-white/10 px-5 py-3 font-bold">Portfolio</button>
</div>
</div>

<div className="grid gap-3">
<MediaPreview item={site.heroTopImage || site.heroSectionBackgroundImage || site.backgroundImage} />
<MediaPreview item={site.heroBottomImage || site.backgroundImage} />
<div className="grid grid-cols-2 gap-3">
<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
<p className="text-2xl font-black text-blue-400">{site.stat1Value}</p>
<p className="text-sm text-white/60">{site.stat1Label}</p>
</div>
<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
<p className="text-2xl font-black text-blue-400">{site.stat2Value}</p>
<p className="text-sm text-white/60">{site.stat2Label}</p>
</div>
</div>
</div>
</div>

<div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/65">
Images: {allImages.length} • Reviews: {site.reviews.length} • Visits: {site.visits.length} • Payments:{" "}
{site.payments.length}
</div>
</AdminCard>
)}
</div>
</main>
);
}
