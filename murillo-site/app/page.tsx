"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
heroTitleLine1: "Home Remolding",
heroTitleLine2: "Murillo Renovation LLC.",
heroAccent: "Murillo Renovation LLC.",
heroSubtitle:
"Premium remodeling, renovation, and custom construction with a clean process, strong communication, and results that feel expensive.",

backgroundImage: null,
backgroundBrightness: 0.45,

heroSectionBackgroundImage: null,
heroSectionOverlay: 0.58,

servicesTitle: "Our Services",
servicesSubtitle:
"What we do.",

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

const SERVICES = [
{
title: "Kitchen Remodeling",
description:
"Cabinets, counters, tile, lighting, floors, and layout improvements that make the home feel brand new.",
},
{
title: "Bathroom Remodeling",
description:
"Showers, tubs, vanities, tile work, plumbing finish work, and clean upscale finishes.",
},
{
title: "Flooring & Tile",
description:
"Vinyl, hardwood, laminate, tile, grout, transitions, and repair work for a crisp finished look.",
},
{
title: "Drywall & Painting",
description:
"Patch repair, texture matching, interior repainting, and detailed clean walls and ceilings.",
},
{
title: "Repairs & Maintenance",
description:
"Fast turnaround work for damaged areas, small fixes, trim, doors, framing, and general punch lists.",
},
{
title: "Full Renovation",
description:
"Bigger jobs with a clean process from quote to finish, including scheduling, updates, and follow-up.",
},
];

const FAQ = [
{
q: "How does the request visit button work?",
a: "It opens the form only when clicked. Submitting saves the request and sends the request to the owner if notifications are configured.",
},
{
q: "How does the payment button work?",
a: "It opens a Zelle payment panel only when clicked, with screenshot upload and payment review submission.",
},
{
q: "Can customers add review photos?",
a: "Yes. Reviews can include uploaded photos and those photos appear in the review section.",
},
{
q: "Where does portfolio go?",
a: "It goes to a separate page at /portfolio so the gallery is not mixed into the homepage.",
},
];

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
    const payload = json?.data ?? json;

    const content = payload?.content
      ? {
          ...payload.content,
          reviews: payload.reviews ?? payload.content.reviews ?? [],
          visits: payload.visits ?? payload.content.visits ?? [],
          payments: payload.payments ?? payload.content.payments ?? [],
        }
      : payload;

    return normalizeSiteData(content);
  } catch (error) {
    console.error("Homepage site-data load failed:", error);
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

function SectionTitle({
eyebrow,
title,
text,
align = "left",
}: {
eyebrow: string;
title: string;
text: string;
align?: "left" | "center";
}) {
return (
<div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">{eyebrow}</p>
<h2 className="mt-3 text-4xl font-black leading-[0.95] md:text-6xl">{title}</h2>
<p className="mt-4 text-sm leading-7 text-white/65 md:text-base">{text}</p>
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
alt={alt || item.alt || item.name || "image"}
className={className}
draggable={false}
/>
);
}

function StarRow({ rating }: { rating: number }) {
const value = Math.max(0, Math.min(5, rating));
return (
<span className="text-cyan-300">
{Array.from({ length: 5 }, (_, index) => (index < value ? "★" : "☆")).join("")}
</span>
);
}

function StatPill({ value, label }: { value: string; label: string }) {
return (
<GlassCard className="p-5">
<p className="text-3xl font-black text-blue-400">{value}</p>
<p className="mt-1 text-sm text-white/60">{label}</p>
</GlassCard>
);
}

function Modal({
open,
onClose,
title,
children,
}: {
open: boolean;
onClose: () => void;
title: string;
children: ReactNode;
}) {
if (!open) return null;

return (
<div className="fixed inset-0 z-[90] overflow-y-auto bg-black/85 p-4">
<div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-white/10 bg-[#050505] p-6 shadow-2xl">
<div className="flex items-start justify-between gap-3">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">{title}</p>
<button
type="button"
onClick={onClose}
className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70"
>
Close
</button>
</div>

{children}
</div>
</div>
);
}

export default function HomePage() {
const router = useRouter();

const [site, setSite] = useState<SiteData>(DEFAULT_SITE_DATA);
const [ready, setReady] = useState(false);

const [showVisit, setShowVisit] = useState(false);
const [showPayment, setShowPayment] = useState(false);
const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

const [siteViews, setSiteViews] = useState(0);

const [visitBusy, setVisitBusy] = useState(false);
const [paymentBusy, setPaymentBusy] = useState(false);
const [reviewBusy, setReviewBusy] = useState(false);

const [visitStatus, setVisitStatus] = useState("");
const [paymentStatus, setPaymentStatus] = useState("");
const [reviewStatus, setReviewStatus] = useState("");

const [visitForm, setVisitForm] = useState({
name: "",
email: "",
phone: "",
address: "",
jobType: "",
details: "",
preferredTime: "",
});

const [paymentForm, setPaymentForm] = useState({
amount: "",
name: "",
email: "",
notes: "",
});

const [paymentProofs, setPaymentProofs] = useState<MediaItem[]>([]);
const [reviewPhotos, setReviewPhotos] = useState<MediaItem[]>([]);
const [reviewForm, setReviewForm] = useState({
name: "",
rating: "5",
text: "",
});

const reviewsRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
let mounted = true;

loadSiteData().then((loaded) => {
if (!mounted) return;
setSite(loaded);
setReady(true);
});

const views = Number(window.localStorage.getItem("murillo_views") || "0") + 1;
window.localStorage.setItem("murillo_views", String(views));
setSiteViews(views);

return () => {
mounted = false;
};
}, []);

const pageBackgroundUrl = mediaUrl(site.backgroundImage);
const heroSectionBackgroundUrl = mediaUrl(site.heroSectionBackgroundImage);
const selectedImageUrl = mediaUrl(selectedImage);

const heroPreviewImages = useMemo(() => {
const ordered = [
...site.portfolio["Bathroom Remodel"],
...site.portfolio["Kitchen Remodel"],
...site.portfolio["Renovation"],
...site.portfolio["Custom Build"],
...site.portfolio["Flooring Project"],
...site.portfolio["Repair Work"],
];

return ordered.filter((item) => mediaUrl(item)).slice(0, 2);
}, [site.portfolio]);

const previewCards = useMemo(
() => [
{
title: "Kitchen Remodel" as Category,
text: "Before and after kitchen setups, cabinets, counters, and clean finish work.",
},
{
title: "Bathroom Remodel" as Category,
text: "Modern bathroom work, tile, vanity, shower detail, and polished upgrades.",
},
{
title: "Flooring Project" as Category,
text: "Flooring replacement, transitions, tile installs, and repair work.",
},
{
title: "Custom Build" as Category,
text: "Custom interiors, framing, built-ins, and unique customer project layouts.",
},
{
title: "Repair Work" as Category,
text: "Punch list, patch repair, drywall fixes, and fast maintenance solutions.",
},
{
title: "Renovation" as Category,
text: "Full renovation service with a premium look and customer-friendly process.",
},
],
[]
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

const heroSectionBackgroundStyle: CSSProperties = heroSectionBackgroundUrl
? {
backgroundImage: `url(${heroSectionBackgroundUrl})`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
}
: {
background:
"radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 26%), radial-gradient(circle at top right, rgba(34,197,94,0.15), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
};

const uploadReviewPhotos = async (files: FileList | null) => {
setReviewStatus("");

try {
const media = await uploadFiles(files, "review-photos");
if (!media.length) return;
setReviewPhotos((prev) => [...prev, ...media]);
} catch {
setReviewStatus("Could not upload review photos.");
}
};

const uploadPaymentProofs = async (files: FileList | null) => {
setPaymentStatus("");

try {
const media = await uploadFiles(files, "payment-proofs");
if (!media.length) return;
setPaymentProofs((prev) => [...prev, ...media]);
} catch {
setPaymentStatus("Could not upload payment screenshot.");
}
};

const submitVisit = async () => {
if (!visitForm.name.trim() || !visitForm.phone.trim() || !visitForm.address.trim()) {
setVisitStatus("Please fill out your name, phone, and address.");
return;
}

setVisitBusy(true);
setVisitStatus("");

try {
const payload: VisitItem = {
id: uid(),
name: visitForm.name.trim(),
email: visitForm.email.trim(),
phone: visitForm.phone.trim(),
address: visitForm.address.trim(),
jobType: visitForm.jobType.trim(),
preferredTime: visitForm.preferredTime.trim(),
details: visitForm.details.trim(),
date: new Date().toLocaleString(),
};

const nextSite: SiteData = {
...site,
visits: [payload, ...site.visits],
};

setSite(nextSite);
await saveSiteData(nextSite);

try {
await fetch("/api/visit", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
} catch {
// Visit still saves globally even if SMS route is not configured.
}

setVisitForm({
name: "",
email: "",
phone: "",
address: "",
jobType: "",
details: "",
preferredTime: "",
});

setVisitStatus("Your visit has been requested.");
} catch {
setVisitStatus("Something went wrong sending the visit request.");
} finally {
setVisitBusy(false);
}
};

const submitPayment = async () => {
if (!paymentForm.amount.trim() || !paymentForm.name.trim()) {
setPaymentStatus("Add the amount and your name first.");
return;
}

setPaymentBusy(true);
setPaymentStatus("");

try {
const payload: PaymentItem = {
id: uid(),
amount: paymentForm.amount.trim(),
name: paymentForm.name.trim(),
email: paymentForm.email.trim(),
notes: paymentForm.notes.trim(),
proofs: paymentProofs,
date: new Date().toLocaleString(),
};

const nextSite: SiteData = {
...site,
payments: [payload, ...site.payments],
};

setSite(nextSite);
await saveSiteData(nextSite);

setPaymentForm({
amount: "",
name: "",
email: "",
notes: "",
});
setPaymentProofs([]);
setPaymentStatus("Payment proof submitted successfully.");
} catch {
setPaymentStatus("Something went wrong submitting payment proof.");
} finally {
setPaymentBusy(false);
}
};

const submitReview = async () => {
if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
setReviewStatus("Add your name and review.");
return;
}

setReviewBusy(true);
setReviewStatus("");

try {
const payload: ReviewItem = {
id: uid(),
name: reviewForm.name.trim(),
rating: Number(reviewForm.rating) || 5,
text: reviewForm.text.trim(),
photos: reviewPhotos,
date: new Date().toLocaleString(),
};

const nextSite: SiteData = {
...site,
reviews: [payload, ...site.reviews],
};

setSite(nextSite);
await saveSiteData(nextSite);

setReviewForm({
name: "",
rating: "5",
text: "",
});
setReviewPhotos([]);
setReviewStatus("Review posted.");
} catch {
setReviewStatus("Could not save the review.");
} finally {
setReviewBusy(false);
}
};

if (!ready) {
return (
<div className="min-h-screen bg-black px-4 py-10 text-white md:px-8">
<GlassCard className="p-6">Loading homepage...</GlassCard>
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

<div className="fixed inset-0 -z-30 bg-[#030303]" />
<div className="fixed inset-0 -z-20" style={pageBackgroundStyle} />
<div
className="fixed inset-0 -z-10"
style={{
background:
"linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 24%, rgba(0,0,0,0.82) 55%, rgba(0,0,0,0.9) 100%)",
}}
/>
<div
className="pointer-events-none fixed inset-0 -z-10"
style={{
background: `rgba(0,0,0,${Math.max(
0.08,
Math.min(0.82, site.backgroundBrightness)
)})`,
}}
/>

<header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/72 backdrop-blur-2xl">
<div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
<div className="flex items-center justify-between gap-4">
<button
type="button"
onClick={() => router.push("/")}
className="shrink-0 text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 md:text-xs"
>
{site.businessName}
</button>

<nav className="hidden items-center gap-6 text-sm md:flex">
<button
type="button"
onClick={() => router.push("/portfolio")}
className="text-white/75 transition hover:text-white"
>
View Portfolio
</button>
<button
type="button"
onClick={() =>
reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
}
className="text-white/75 transition hover:text-white"
>
Reviews
</button>
<button
type="button"
onClick={() => setShowVisit(true)}
className="text-white/75 transition hover:text-white"
>
Request Visit
</button>
<button
type="button"
onClick={() => setShowPayment(true)}
className="rounded-full border border-white/15 px-4 py-2 text-white/80 transition hover:bg-white hover:text-black"
>
Make Payment
</button>
<a href={phoneHref(site.phoneNumber)}>
<button type="button" className="rounded-full bg-white px-4 py-2 font-semibold text-black">
Call Now
</button>
</a>
</nav>
</div>

<div className="mt-3 flex flex-wrap gap-2 md:hidden">
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/80"
>
Portfolio
</button>
<button
type="button"
onClick={() =>
reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
}
className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/80"
>
Reviews
</button>
<button
type="button"
onClick={() => setShowVisit(true)}
className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/80"
>
Request Visit
</button>
<button
type="button"
onClick={() => setShowPayment(true)}
className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/80"
>
Payment
</button>
<a href={phoneHref(site.phoneNumber)}>
<button type="button" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-black">
Call
</button>
</a>
</div>
</div>
</header>

<main className="pt-32 md:pt-24">
<section className="relative overflow-hidden">
<div className="absolute inset-0" style={heroSectionBackgroundStyle} />
<div
className="absolute inset-0"
style={{
background:
"radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 25%), radial-gradient(circle at top right, rgba(34,197,94,0.16), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 18%)",
}}
/>
<div
className="absolute inset-0"
style={{
background: `rgba(0,0,0,${Math.max(
0.2,
Math.min(0.88, site.heroSectionOverlay)
)})`,
}}
/>

<div className="mx-auto grid min-h-[100vh] max-w-7xl gap-6 px-4 py-8 md:px-8 md:py-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
<div className="relative z-10">
<GlassCard className="relative overflow-hidden p-6 md:p-10">
<div
className="absolute inset-0"
style={{
background:
"radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 34%), radial-gradient(circle at bottom right, rgba(34,197,94,0.12), transparent 30%)",
}}
/>

<div className="relative">
<p className="text-[11px] uppercase tracking-[0.35em] text-white/45 md:text-xs">
{site.heroBadge}
</p>

<h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] sm:text-6xl md:text-7xl">
{site.heroTitleLine1}
<span className="block text-blue-500">{site.heroTitleLine2}</span>
</h1>

<p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
{site.heroSubtitle}
</p>

<div className="mt-8 flex flex-wrap gap-3">
<button
type="button"
onClick={() => setShowVisit(true)}
className="rounded-full bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.02]"
>
Request Visit
</button>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
>
View Portfolio
</button>
<button
type="button"
onClick={() => setShowPayment(true)}
className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
>
Make Payment
</button>
</div>

<div className="mt-8 flex flex-wrap gap-5 text-sm text-white/58">
<span>{siteViews} site views</span>
<span>{site.stat3}</span>
<span>Quality craftsmanship</span>
<span>Transparent pricing</span>
</div>
</div>
</GlassCard>
</div>

<div className="relative z-10 grid gap-4">
<GlassCard className="overflow-hidden p-5 md:p-6">
<div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
<div>
<p className="text-[11px] uppercase tracking-[0.35em] text-white/45 md:text-xs">
Start Here
</p>
<h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
Quote, visit, or pay in one place.
</h2>
<p className="mt-3 text-sm leading-7 text-white/70">
Customers can send a message, upload pictures, book a site visit, leave a review,
or submit payment proof.
</p>

<div className="mt-6 flex flex-wrap gap-3">
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
>
View Portfolio
</button>
<button
type="button"
onClick={() => setShowVisit(true)}
className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
>
Request Visit
</button>
</div>
</div>

<div className="grid gap-3">
{heroPreviewImages.length > 0 ? (
heroPreviewImages.map((item) => (
<button
key={item.id}
type="button"
onClick={() => setSelectedImage(item)}
className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25"
>
<MediaImage item={item} className="h-32 w-full object-cover md:h-36" />
</button>
))
) : (
<>
<div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-white/60">
Premium presentation
</div>
<div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-white/60">
Strong portfolio preview
</div>
</>
)}
</div>
</div>
</GlassCard>

<div className="grid grid-cols-2 gap-4">
<StatPill value={site.stat1} label="projects" />
<StatPill value={site.stat2} label="service" />
</div>

<GlassCard className="p-5">
<div className="grid gap-4 sm:grid-cols-2">
<div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">
Portfolio preview
</p>
<p className="mt-3 text-2xl font-bold">Selected work only.</p>
<p className="mt-3 text-sm text-white/65">
The gallery lives on its own page so the homepage stays clean and premium.
</p>
</div>

<div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Action flow</p>
<p className="mt-3 text-sm text-white/70">
Click top buttons for visit or payment.
</p>
<p className="mt-2 text-sm text-white/70">
Click portfolio to go to the gallery page.
</p>
<p className="mt-2 text-sm text-white/70">
Add reviews with photos on the site.
</p>
</div>
</div>
</GlassCard>
</div>
</div>
</section>

<section className="px-4 py-16 md:px-8">
<div className="mx-auto max-w-7xl">
<div className="overflow-hidden rounded-[2.2rem] border border-black/10 bg-gradient-to-r from-emerald-400 via-green-400 to-lime-300 px-8 py-14 text-black shadow-[0_20px_80px_rgba(20,255,130,0.12)]">
<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
<div className="max-w-3xl">
<p className="text-xs uppercase tracking-[0.35em] text-black/60">
Ready to start
</p>
<h2 className="mt-3 text-4xl font-black leading-[0.95] md:text-6xl">
Book a visit, get a quote, or make a payment.
</h2>
<p className="mt-4 max-w-2xl text-sm leading-7 text-black/75">
Use the buttons above to keep the customer flow fast and clean.
</p>
</div>

<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
<button
type="button"
onClick={() => setShowVisit(true)}
className="rounded-full bg-black px-6 py-3 font-semibold text-white"
>
Request Visit
</button>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-black/15 px-6 py-3 font-semibold text-black"
>
View Portfolio
</button>
<button
type="button"
onClick={() => setShowPayment(true)}
className="rounded-full border border-black/15 px-6 py-3 font-semibold text-black"
>
Make Payment
</button>
</div>
</div>
</div>
</div>
</section>

<section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
<SectionTitle eyebrow="Services" title={site.servicesTitle} text={site.servicesSubtitle} />

<div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
{SERVICES.map((service) => (
<GlassCard key={service.title} className="p-6">
<div className="flex items-center justify-between gap-3">
<h3 className="text-xl font-bold">{service.title}</h3>
<span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
Premium
</span>
</div>
<p className="mt-4 text-sm leading-7 text-white/68">{service.description}</p>
</GlassCard>
))}
</div>
</section>

<section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
<div className="flex items-end justify-between gap-4">
<SectionTitle
eyebrow="Portfolio preview"
title={site.portfolioTitle}
text={site.portfolioSubtitle}
/>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="hidden rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white md:block"
>
View Portfolio
</button>
</div>

<div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
{previewCards.map((card) => {
const image = site.portfolio[card.title].find((item) => mediaUrl(item));

return (
<GlassCard key={card.title} className="overflow-hidden">
<div
className="h-56"
style={{
background:
"linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03)), radial-gradient(circle at top right, rgba(34,197,94,0.28), transparent 35%), radial-gradient(circle at bottom left, rgba(59,130,246,0.22), transparent 35%)",
}}
>
{image ? (
<button
type="button"
onClick={() => setSelectedImage(image)}
className="block h-full w-full"
>
<MediaImage item={image} className="h-56 w-full object-cover" />
</button>
) : null}
</div>

<div className="p-6">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">
Portfolio preview
</p>
<h3 className="mt-3 text-2xl font-bold">{card.title}</h3>
<p className="mt-3 text-sm leading-7 text-white/65">{card.text}</p>

<div className="mt-5 flex gap-3">
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
>
View Portfolio
</button>
<button
type="button"
onClick={() => setShowVisit(true)}
className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white"
>
Request Visit
</button>
</div>
</div>
</GlassCard>
);
})}
</div>
</section>

<section className="bg-zinc-950/55 px-4 py-24 md:px-8" ref={reviewsRef}>
<div className="mx-auto max-w-7xl">
<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
<SectionTitle eyebrow="Reviews" title={site.reviewsTitle} text={site.reviewsSubtitle} />
<div className="text-sm text-white/60">Average rating: 5.0/5</div>
</div>

<div className="mt-10 grid gap-5 md:grid-cols-3">
{site.reviews.length === 0 ? (
<GlassCard className="p-6 md:col-span-3">No reviews yet.</GlassCard>
) : (
site.reviews.slice(0, 3).map((review) => (
<GlassCard key={review.id} className="p-6">
<div className="flex items-center justify-between gap-4">
<div>
<p className="font-semibold">{review.name}</p>
<p className="mt-1 text-xs text-white/45">{review.date}</p>
</div>
<StarRow rating={review.rating} />
</div>

<p className="mt-4 text-sm leading-7 text-white/75">“{review.text}”</p>

{review.photos.length > 0 && (
<div className="mt-4 grid grid-cols-2 gap-3">
{review.photos.map((photo) => (
<button
type="button"
key={photo.id}
onClick={() => setSelectedImage(photo)}
className="overflow-hidden rounded-2xl border border-white/10"
>
<MediaImage item={photo} className="h-28 w-full object-cover" />
</button>
))}
</div>
)}
</GlassCard>
))
)}
</div>

<GlassCard className="mt-10 p-6">
<h3 className="text-2xl font-bold">Leave a review</h3>
<p className="mt-2 text-sm text-white/60">Reviews can include photos from the job.</p>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<input
value={reviewForm.name}
onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Your name"
/>
<select
value={reviewForm.rating}
onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
>
<option value="5">5 stars</option>
<option value="4">4 stars</option>
<option value="3">3 stars</option>
<option value="2">2 stars</option>
<option value="1">1 star</option>
</select>
</div>

<textarea
value={reviewForm.text}
onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })}
className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Write your review..."
/>

<div className="mt-4 flex flex-wrap items-center gap-3">
<label className="cursor-pointer rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 transition hover:bg-white/10">
Add review photos
<input
type="file"
multiple
accept="image/*"
className="hidden"
onChange={(event) => uploadReviewPhotos(event.target.files)}
/>
</label>

{reviewPhotos.length > 0 && (
<div className="flex flex-wrap gap-2">
{reviewPhotos.map((photo) => (
<button
type="button"
key={photo.id}
onClick={() => setSelectedImage(photo)}
className="overflow-hidden rounded-2xl border border-white/10"
>
<MediaImage item={photo} className="h-14 w-14 object-cover" />
</button>
))}
</div>
)}
</div>

{reviewStatus && (
<div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
{reviewStatus}
</div>
)}

<div className="mt-5 flex flex-wrap gap-3">
<button
type="button"
onClick={submitReview}
disabled={reviewBusy}
className="rounded-full bg-white px-6 py-3 font-semibold text-black disabled:opacity-60"
>
{reviewBusy ? "Saving..." : "Post Review"}
</button>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white"
>
View Portfolio
</button>
</div>
</GlassCard>
</div>
</section>

<section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
<div className="grid gap-6 lg:grid-cols-[1.04fr_.96fr]">
<GlassCard className="p-8 md:p-10">
<SectionTitle eyebrow="About" title={site.aboutTitle} text={site.aboutSubtitle} />

<div className="mt-8 flex flex-wrap gap-3">
<button
type="button"
onClick={() => setShowVisit(true)}
className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
>
Request Visit
</button>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
>
View Portfolio
</button>
</div>

<div className="mt-8 grid gap-3 text-sm text-white/70">
<p>• Remodeling and renovation</p>
<p>• Repairs and finishing work</p>
<p>• Custom interior and exterior projects</p>
<p>• Visit-based estimates and clear communication</p>
</div>
</GlassCard>

<GlassCard className="p-8">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Top features</p>
<div className="mt-5 grid gap-3">
<div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
<p className="font-semibold">Request Visit</p>
<p className="mt-2 text-sm text-white/65">
Opens only when clicked and gives a proper response after submission.
</p>
</div>
<div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
<p className="font-semibold">Make Payment</p>
<p className="mt-2 text-sm text-white/65">
Opens the Zelle instructions only when pressed.
</p>
</div>
<div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
<p className="font-semibold">View Portfolio</p>
<p className="mt-2 text-sm text-white/65">
Sends the user to the dedicated gallery page.
</p>
</div>
</div>
</GlassCard>
</div>
</section>

<section className="border-y border-white/10 bg-zinc-950/55 px-4 py-24 md:px-8">
<div className="mx-auto max-w-7xl">
<SectionTitle eyebrow="FAQ" title={site.faqTitle} text={site.faqSubtitle} />

<div className="mt-10 grid gap-4 md:grid-cols-2">
{FAQ.map((item) => (
<GlassCard key={item.q} className="p-6">
<h3 className="text-lg font-bold">{item.q}</h3>
<p className="mt-3 text-sm leading-7 text-white/68">{item.a}</p>
</GlassCard>
))}
</div>
</div>
</section>

<section className="mx-auto max-w-4xl px-4 py-24 md:px-8">
<SectionTitle
eyebrow="Contact"
title={site.quickTitle}
text={site.quickSubtitle}
align="center"
/>

<div className="mt-10 grid gap-4 md:grid-cols-3">
<button
type="button"
onClick={() => setShowVisit(true)}
className="rounded-[1.6rem] border border-white/10 bg-white px-6 py-7 text-left font-semibold text-black"
>
Request Visit
</button>

<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-7 text-left font-semibold text-white"
>
View Portfolio
</button>

<button
type="button"
onClick={() => setShowPayment(true)}
className="rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-7 text-left font-semibold text-white"
>
Make Payment
</button>
</div>
</section>
</main>

<Modal open={showVisit} onClose={() => setShowVisit(false)} title="Request Visit">
<h3 className="mt-2 text-3xl font-black">Book a site visit</h3>
<p className="mt-3 text-sm text-white/60">
Fill this out so we can come check the job and schedule the next step.
</p>

{visitStatus && (
<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
{visitStatus}
</div>
)}

<div className="mt-6 grid gap-4 md:grid-cols-2">
<input
value={visitForm.name}
onChange={(event) => setVisitForm({ ...visitForm, name: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Full name"
/>
<input
value={visitForm.email}
onChange={(event) => setVisitForm({ ...visitForm, email: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Email"
/>
<input
value={visitForm.phone}
onChange={(event) => setVisitForm({ ...visitForm, phone: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Phone number"
/>
<input
value={visitForm.address}
onChange={(event) => setVisitForm({ ...visitForm, address: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Project address"
/>
<select
value={visitForm.jobType}
onChange={(event) => setVisitForm({ ...visitForm, jobType: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
>
<option value="">Job type</option>
<option value="Kitchen Remodeling">Kitchen Remodeling</option>
<option value="Bathroom Remodeling">Bathroom Remodeling</option>
<option value="Flooring & Tile">Flooring & Tile</option>
<option value="Full Home Renovation">Full Home Renovation</option>
<option value="Repair / Small Job">Repair / Small Job</option>
</select>
<input
value={visitForm.preferredTime}
onChange={(event) => setVisitForm({ ...visitForm, preferredTime: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Preferred day / time"
/>
</div>

<textarea
value={visitForm.details}
onChange={(event) => setVisitForm({ ...visitForm, details: event.target.value })}
className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Tell us what you need done..."
/>

<div className="mt-6 flex flex-wrap gap-3">
<button
type="button"
onClick={submitVisit}
disabled={visitBusy}
className="rounded-full bg-white px-6 py-3 font-semibold text-black disabled:opacity-60"
>
{visitBusy ? "Submitting..." : "Submit Request"}
</button>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white"
>
View Portfolio
</button>
<a href={phoneHref(site.phoneNumber)}>
<button
type="button"
className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white"
>
Call Now
</button>
</a>
</div>
</Modal>

<Modal open={showPayment} onClose={() => setShowPayment(false)} title="Make Payment">
<h3 className="mt-2 text-3xl font-black">Zelle payment</h3>
<p className="mt-3 text-sm text-white/60">
Use Zelle to send your payment, then follow the steps below so we can review it.
</p>

<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
<span className="text-white/45">Zelle contact:</span> {site.zelleContact}
</div>

<div className="mt-6 grid gap-4">
<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Step 1</p>
<p className="mt-2 text-sm text-white/75">
Open your banking app or Zelle and send the amount shown.
</p>
</div>
<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Step 2</p>
<p className="mt-2 text-sm text-white/75">
Send it to the Zelle contact listed above.
</p>
</div>
<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Step 3</p>
<p className="mt-2 text-sm text-white/75">
Upload your payment screenshot and submit it for review.
</p>
</div>
</div>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<input
value={paymentForm.amount}
onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Amount owed"
/>
<input
value={paymentForm.name}
onChange={(event) => setPaymentForm({ ...paymentForm, name: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Your name"
/>
<input
value={paymentForm.email}
onChange={(event) => setPaymentForm({ ...paymentForm, email: event.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none md:col-span-2"
placeholder="Your email"
/>
</div>

<textarea
value={paymentForm.notes}
onChange={(event) => setPaymentForm({ ...paymentForm, notes: event.target.value })}
className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Extra notes for the payment review"
/>

<div className="mt-4 flex flex-wrap items-center gap-3">
<label className="cursor-pointer rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 transition hover:bg-white/10">
Upload payment screenshot
<input
type="file"
multiple
accept="image/*"
className="hidden"
onChange={(event) => uploadPaymentProofs(event.target.files)}
/>
</label>

{paymentProofs.length > 0 && (
<div className="flex flex-wrap gap-2">
{paymentProofs.map((photo) => (
<button
type="button"
key={photo.id}
onClick={() => setSelectedImage(photo)}
className="overflow-hidden rounded-2xl border border-white/10"
>
<MediaImage item={photo} className="h-14 w-14 object-cover" />
</button>
))}
</div>
)}
</div>

{paymentStatus && (
<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
{paymentStatus}
</div>
)}

<div className="mt-6 flex flex-wrap gap-3">
<button
type="button"
onClick={submitPayment}
disabled={paymentBusy}
className="rounded-full bg-white px-6 py-3 font-semibold text-black disabled:opacity-60"
>
{paymentBusy ? "Submitting..." : "Submit Payment for Review"}
</button>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white"
>
View Portfolio
</button>
</div>
</Modal>

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

<a href={phoneHref(site.phoneNumber)}>
<div className="fixed bottom-6 right-6 z-40 rounded-full bg-white px-5 py-3 font-semibold text-black shadow-xl">
📞 Call
</div>
</a>
</div>
);
}
