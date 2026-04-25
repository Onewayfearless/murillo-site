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
if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
return Number(value);
}
}

return fallback;
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
createdAt: typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString(),
};
}

function firstMedia(obj: Record<string, unknown>, keys: string[]) {
for (const key of keys) {
const media = toMediaItem(obj[key]);
if (media && mediaUrl(media)) return media;
}

return null;
}

function normalizeMediaArray(value: unknown): MediaItem[] {
if (!Array.isArray(value)) return [];
return value.map(toMediaItem).filter((item): item is MediaItem => Boolean(item && mediaUrl(item)));
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

async function loadSite(): Promise<SiteData> {
try {
const res = await fetch("/api/site-data", { cache: "no-store" });
if (!res.ok) throw new Error("Failed to load site data.");

const json = await res.json();
return normalizeSiteData(json?.data ?? json);
} catch (error) {
console.error("Portfolio load failed:", error);
return DEFAULT_SITE;
}
}

function phoneHref(phone: string) {
return `tel:${phone.replace(/[^\d+]/g, "")}`;
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
className={`rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-[0_10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl ${className}`}
>
{children}
</div>
);
}

function MediaImage({
item,
className = "",
alt,
}: {
item: MediaItem;
className?: string;
alt?: string;
}) {
const src = mediaUrl(item);
if (!src) return null;

return (
<img
src={src}
alt={alt || item.alt || item.name || "portfolio image"}
className={className}
draggable={false}
/>
);
}

export default function PortfolioPage() {
const router = useRouter();

const [site, setSite] = useState<SiteData>(DEFAULT_SITE);
const [ready, setReady] = useState(false);
const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

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

const pageBackgroundUrl = mediaUrl(site.backgroundImage) || mediaUrl(site.heroSectionBackgroundImage);
const selectedImageUrl = mediaUrl(selectedImage);

const allImages = useMemo(() => {
return CATEGORIES.flatMap((category) =>
site.portfolio[category].map((image) => ({
...image,
category,
}))
).filter((image) => mediaUrl(image));
}, [site.portfolio]);

const visibleImages = useMemo(() => {
if (activeCategory === "All") return allImages;
return allImages.filter((image) => image.category === activeCategory);
}, [activeCategory, allImages]);

const categoryCounts = useMemo(() => {
return CATEGORIES.reduce<Record<Category, number>>(
(acc, category) => {
acc[category] = site.portfolio[category].filter((image) => mediaUrl(image)).length;
return acc;
},
{
"Kitchen Remodel": 0,
"Bathroom Remodel": 0,
"Flooring Project": 0,
"Custom Build": 0,
"Repair Work": 0,
Renovation: 0,
}
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

if (!ready) {
return (
<main className="min-h-screen bg-black p-5 text-white">
<GlassCard className="mx-auto max-w-xl p-6">Loading portfolio...</GlassCard>
</main>
);
}

return (
<main className="min-h-screen bg-black text-white">
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
"linear-gradient(180deg, rgba(0,0,0,0.56) 0%, rgba(0,0,0,0.78) 36%, rgba(0,0,0,0.92) 100%)",
}}
/>
<div
className="fixed inset-0 -z-10"
style={{
background: `rgba(0,0,0,${Math.max(0.03, Math.min(0.82, site.backgroundBrightness))})`,
}}
/>

<header className="sticky top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-2xl">
<div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
<button
type="button"
onClick={() => router.push("/")}
className="text-left text-xs font-bold uppercase tracking-[0.25em] text-white/90"
>
{site.businessName}
</button>

<div className="flex flex-wrap gap-2">
<button
type="button"
onClick={() => router.push("/")}
className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80"
>
Home
</button>

<button
type="button"
onClick={() => router.push("/admin")}
className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80"
>
Admin
</button>

<a href={phoneHref(site.phoneNumber)}>
<button
type="button"
className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black"
>
Call Now
</button>
</a>
</div>
</div>
</div>
</header>

<section className="mx-auto max-w-7xl px-4 pb-10 pt-12 md:px-8 md:pb-16 md:pt-16">
<GlassCard className="overflow-hidden p-6 md:p-10">
<div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Portfolio</p>

<h1 className="mt-4 text-5xl font-black leading-[0.9] md:text-7xl">
{site.portfolioTitle || "Selected work"}
</h1>

<p className="mt-5 max-w-3xl text-sm leading-7 text-white/68 md:text-base">
{site.portfolioSubtitle ||
"Browse the full gallery by category. All photos come from the worldwide admin editor."}
</p>

<div className="mt-8 flex flex-wrap gap-3">
<button
type="button"
onClick={() => setActiveCategory("All")}
className={`rounded-full px-5 py-3 text-sm font-bold ${
activeCategory === "All"
? "bg-white text-black"
: "border border-white/10 bg-white/5 text-white"
}`}
>
All Work ({allImages.length})
</button>

{CATEGORIES.map((category) => (
<button
key={category}
type="button"
onClick={() => setActiveCategory(category)}
className={`rounded-full px-5 py-3 text-sm font-bold ${
activeCategory === category
? "bg-white text-black"
: "border border-white/10 bg-white/5 text-white"
}`}
>
{category} ({categoryCounts[category]})
</button>
))}
</div>
</div>

<div className="grid gap-3 sm:grid-cols-2">
<div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Total Photos</p>
<p className="mt-3 text-4xl font-black text-blue-400">{allImages.length}</p>
</div>

<div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Categories</p>
<p className="mt-3 text-4xl font-black text-blue-400">{CATEGORIES.length}</p>
</div>

<div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:col-span-2">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Contact</p>
<p className="mt-3 text-xl font-black">{site.phoneNumber}</p>
</div>
</div>
</div>
</GlassCard>
</section>

<section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
{visibleImages.length > 0 ? (
<div className="columns-1 gap-5 space-y-5 sm:columns-2 xl:columns-3 2xl:columns-4">
{visibleImages.map((image, index) => (
<button
key={`${image.id}_${index}`}
type="button"
onClick={() => setSelectedImage(image)}
className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] text-left shadow-[0_10px_40px_rgba(0,0,0,0.22)]"
>
<MediaImage
item={image}
alt={`${image.category} ${index + 1}`}
className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
/>

<div className="p-4">
<p className="text-[11px] uppercase tracking-[0.25em] text-white/40">
{image.category}
</p>
<p className="mt-2 truncate text-sm text-white/70">
{image.name || image.alt || "Project photo"}
</p>
</div>
</button>
))}
</div>
) : (
<GlassCard className="p-10 text-center">
<p className="text-2xl font-black">No photos yet.</p>
<p className="mt-3 text-sm text-white/60">
Go to the admin page, open Portfolio, upload photos, then press Save Worldwide.
</p>

<button
type="button"
onClick={() => router.push("/admin")}
className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-black"
>
Open Admin
</button>
</GlassCard>
)}
</section>

<section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
<div className="overflow-hidden rounded-[2.2rem] border border-black/10 bg-gradient-to-r from-emerald-400 via-green-400 to-lime-300 px-8 py-14 text-black shadow-[0_20px_80px_rgba(20,255,130,0.12)]">
<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-black/60">Ready to start</p>
<h2 className="mt-3 text-4xl font-black leading-[0.95] md:text-6xl">
Like what you see?
</h2>
<p className="mt-4 max-w-2xl text-sm leading-7 text-black/75">
Call now or go back to the homepage to request a visit.
</p>
</div>

<div className="flex flex-wrap gap-3">
<a href={phoneHref(site.phoneNumber)}>
<button type="button" className="rounded-full bg-black px-6 py-3 font-bold text-white">
Call Now
</button>
</a>

<button
type="button"
onClick={() => router.push("/")}
className="rounded-full border border-black/15 px-6 py-3 font-bold text-black"
>
Back Home
</button>
</div>
</div>
</div>
</section>

{selectedImage && selectedImageUrl && (
<button
type="button"
onClick={() => setSelectedImage(null)}
className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-5"
>
<img
src={selectedImageUrl}
alt={selectedImage.alt || selectedImage.name || "selected"}
className="max-h-[92vh] max-w-[95vw] rounded-3xl shadow-2xl"
/>
</button>
)}
</main>
);
}
