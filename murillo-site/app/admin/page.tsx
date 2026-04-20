"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type PortfolioCategory =
| "Kitchen Remodel"
| "Bathroom Remodel"
| "Flooring Project"
| "Custom Build"
| "Repair Work"
| "Renovation";

type BlobImage = {
id: string;
url: string;
pathname: string;
alt: string;
createdAt: string;
};

type ReviewItem = {
id: string;
name: string;
rating: number;
text: string;
photos: BlobImage[];
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
proofs: BlobImage[];
date: string;
};

type SiteContent = {
businessName: string;
phoneNumber: string;
zelleContact: string;

heroBadge: string;
heroTitleLine1: string;
heroTitleLine2: string;
heroSubtitle: string;

heroBackgroundUrl: string;
heroBackgroundBrightness: number;
heroPanelImageTop: string;
heroPanelImageBottom: string;

startCardTitle: string;
startCardText: string;

stat1Value: string;
stat1Label: string;
stat2Value: string;
stat2Label: string;
stat3Value: string;
stat3Label: string;
stat4Value: string;
stat4Label: string;

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

ctaBadge: string;
ctaTitle: string;
ctaText: string;
};

type SiteData = {
content: SiteContent;
portfolio: Record<PortfolioCategory, BlobImage[]>;
reviews: ReviewItem[];
visits: VisitItem[];
payments: PaymentItem[];
updatedAt: string;
};

const ADMIN_PASSWORD = "murillo123";

const CATEGORIES: PortfolioCategory[] = [
"Kitchen Remodel",
"Bathroom Remodel",
"Flooring Project",
"Custom Build",
"Repair Work",
"Renovation",
];

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

const FAQ_ITEMS = [
{
q: "How does the request visit button work?",
a: "It opens the form only when clicked. Submitting saves the request and can notify the owner if your visit API is connected.",
},
{
q: "How does the payment button work?",
a: "It opens the Zelle payment panel only when clicked, with screenshot upload and review submission.",
},
{
q: "Can customers add review photos?",
a: "Yes. Reviews can include uploaded photos and those photos show in the review section.",
},
{
q: "Where does portfolio go?",
a: "It goes to the dedicated gallery page so the homepage stays clean and premium.",
},
];

function uid() {
return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function emptyPortfolio(): Record<PortfolioCategory, BlobImage[]> {
return {
"Kitchen Remodel": [],
"Bathroom Remodel": [],
"Flooring Project": [],
"Custom Build": [],
"Repair Work": [],
Renovation: [],
};
}

const DEFAULT_SITE_DATA: SiteData = {
content: {
businessName: "Murillo Renovations LLC",
phoneNumber: "+16785551234",
zelleContact: "your-zelle@email.com",

heroBadge: "Licensed & Insured General Contractor",
heroTitleLine1: "Luxury Homes",
heroTitleLine2: "Done Once.",
heroSubtitle:
"Premium remodeling, renovation, and custom construction with a clean process, strong communication, and results that feel expensive.",

heroBackgroundUrl: "",
heroBackgroundBrightness: 0.42,
heroPanelImageTop: "",
heroPanelImageBottom: "",

startCardTitle: "Quote, visit, or pay in one place.",
startCardText:
"Customers can send a message, upload pictures, book a site visit, leave a review, or submit payment proof.",

stat1Value: "100+",
stat1Label: "projects",
stat2Value: "5★",
stat2Label: "service",
stat3Value: "Fast",
stat3Label: "response",
stat4Value: "Clean",
stat4Label: "process",

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

ctaBadge: "Ready to start",
ctaTitle: "Book a visit, get a quote, or make a payment.",
ctaText: "Use the buttons above to keep the customer flow fast and clean.",
},
portfolio: emptyPortfolio(),
reviews: [],
visits: [],
payments: [],
updatedAt: new Date().toISOString(),
};

function isObject(value: unknown): value is Record<string, unknown> {
return typeof value === "object" && value !== null;
}

function normalizeImageArray(value: unknown): BlobImage[] {
if (!Array.isArray(value)) return [];
return value
.map((item) => {
if (typeof item === "string") {
return {
id: uid(),
url: item,
pathname: item,
alt: "image",
createdAt: new Date().toISOString(),
} satisfies BlobImage;
}

if (!isObject(item)) return null;

return {
id: typeof item.id === "string" ? item.id : uid(),
url: typeof item.url === "string" ? item.url : "",
pathname: typeof item.pathname === "string" ? item.pathname : "",
alt: typeof item.alt === "string" ? item.alt : "image",
createdAt:
typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
} satisfies BlobImage;
})
.filter((item): item is BlobImage => Boolean(item?.url));
}

function normalizeSiteData(input: unknown): SiteData {
const raw = isObject(input) ? input : {};
const contentRaw = isObject(raw.content) ? raw.content : {};
const portfolioRaw = isObject(raw.portfolio) ? raw.portfolio : {};

const portfolio = emptyPortfolio();
for (const category of CATEGORIES) {
portfolio[category] = normalizeImageArray(portfolioRaw[category]);
}

const reviews = Array.isArray(raw.reviews)
? raw.reviews
.map((item) => {
if (!isObject(item)) return null;
return {
id: typeof item.id === "string" ? item.id : uid(),
name: typeof item.name === "string" ? item.name : "",
rating:
typeof item.rating === "number"
? Math.max(1, Math.min(5, item.rating))
: 5,
text: typeof item.text === "string" ? item.text : "",
photos: normalizeImageArray(item.photos),
date: typeof item.date === "string" ? item.date : new Date().toLocaleString(),
} satisfies ReviewItem;
})
.filter((item): item is ReviewItem => Boolean(item))
: [];

const visits = Array.isArray(raw.visits)
? raw.visits
.map((item) => {
if (!isObject(item)) return null;
return {
id: typeof item.id === "string" ? item.id : uid(),
name: typeof item.name === "string" ? item.name : "",
email: typeof item.email === "string" ? item.email : "",
phone: typeof item.phone === "string" ? item.phone : "",
address: typeof item.address === "string" ? item.address : "",
jobType: typeof item.jobType === "string" ? item.jobType : "",
preferredTime:
typeof item.preferredTime === "string" ? item.preferredTime : "",
details: typeof item.details === "string" ? item.details : "",
date: typeof item.date === "string" ? item.date : new Date().toLocaleString(),
} satisfies VisitItem;
})
.filter((item): item is VisitItem => Boolean(item))
: [];

const payments = Array.isArray(raw.payments)
? raw.payments
.map((item) => {
if (!isObject(item)) return null;
return {
id: typeof item.id === "string" ? item.id : uid(),
amount: typeof item.amount === "string" ? item.amount : "",
name: typeof item.name === "string" ? item.name : "",
email: typeof item.email === "string" ? item.email : "",
notes: typeof item.notes === "string" ? item.notes : "",
proofs: normalizeImageArray(item.proofs),
date: typeof item.date === "string" ? item.date : new Date().toLocaleString(),
} satisfies PaymentItem;
})
.filter((item): item is PaymentItem => Boolean(item))
: [];

return {
content: {
...DEFAULT_SITE_DATA.content,
...Object.fromEntries(
Object.keys(DEFAULT_SITE_DATA.content).map((key) => [
key,
typeof contentRaw[key] === "string" || typeof contentRaw[key] === "number"
? contentRaw[key]
: DEFAULT_SITE_DATA.content[key as keyof SiteContent],
]),
),
} as SiteContent,
portfolio,
reviews,
visits,
payments,
updatedAt:
typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
};
}

function stars(rating: number) {
return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, Math.max(0, 5 - rating));
}

function Shell({
children,
className = "",
}: {
children: ReactNode;
className?: string;
}) {
return (
<div
className={`rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-xl ${className}`}
>
{children}
</div>
);
}

function Button({
children,
onClick,
type = "button",
variant = "dark",
disabled = false,
className = "",
}: {
children: ReactNode;
onClick?: () => void;
type?: "button" | "submit";
variant?: "light" | "dark" | "danger";
disabled?: boolean;
className?: string;
}) {
const variants = {
light: "bg-white text-black hover:bg-white/90",
dark: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
danger: "border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20",
};

return (
<button
type={type}
disabled={disabled}
onClick={onClick}
className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
>
{children}
</button>
);
}

function Field({
label,
value,
onChange,
placeholder = "",
multiline = false,
}: {
label: string;
value: string;
onChange: (next: string) => void;
placeholder?: string;
multiline?: boolean;
}) {
return (
<label className="grid gap-2">
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
{label}
</span>
{multiline ? (
<textarea
value={value}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
/>
) : (
<input
value={value}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
/>
)}
</label>
);
}

function SectionHeading({
eyebrow,
title,
text,
}: {
eyebrow: string;
title: string;
text: string;
}) {
return (
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">{eyebrow}</p>
<h2 className="mt-3 text-3xl font-black md:text-5xl">{title}</h2>
<p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">{text}</p>
</div>
);
}

function ImageTile({
img,
onDelete,
onOpen,
}: {
img: BlobImage;
onDelete?: () => void;
onOpen?: () => void;
}) {
return (
<div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
<button type="button" onClick={onOpen} className="block w-full">
<img src={img.url} alt={img.alt} className="h-44 w-full object-cover" />
</button>
<div className="flex items-center justify-between gap-3 p-3">
<div className="min-w-0">
<p className="truncate text-sm font-medium">{img.alt}</p>
<p className="truncate text-xs text-white/45">{img.pathname}</p>
</div>
{onDelete ? (
<Button variant="danger" onClick={onDelete}>
Delete
</Button>
) : null}
</div>
</div>
);
}

export default function AdminPage() {
const [site, setSite] = useState<SiteData>(DEFAULT_SITE_DATA);
const [ready, setReady] = useState(false);
const [unlocked, setUnlocked] = useState(false);
const [passwordInput, setPasswordInput] = useState("");
const [tab, setTab] = useState<
"content" | "portfolio" | "reviews" | "visits" | "payments"
>("content");
const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
const [selectedCategory, setSelectedCategory] =
useState<PortfolioCategory>("Kitchen Remodel");
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [notice, setNotice] = useState("");
const [previewImage, setPreviewImage] = useState<string | null>(null);

const [reviewDraft, setReviewDraft] = useState({
name: "",
rating: "5",
text: "",
});
const [reviewPhotos, setReviewPhotos] = useState<BlobImage[]>([]);

useEffect(() => {
const unlockedNow =
typeof window !== "undefined" &&
sessionStorage.getItem("murillo_admin_unlocked") === "yes";

if (unlockedNow) {
setUnlocked(true);
}

void loadSite();
}, []);

const portfolioPreviewCards = useMemo(() => {
return CATEGORIES.map((category) => {
const firstImage = site.portfolio[category][0];
const textMap: Record<PortfolioCategory, string> = {
"Kitchen Remodel":
"Before and after kitchen setups, cabinets, counters, and clean finish work.",
"Bathroom Remodel":
"Modern bathroom work, tile, vanity, shower detail, and polished upgrades.",
"Flooring Project":
"Flooring replacement, transitions, tile installs, and repair work.",
"Custom Build":
"Custom interiors, framing, built-ins, and unique customer project layouts.",
"Repair Work":
"Punch list, patch repair, drywall fixes, and fast maintenance solutions.",
Renovation:
"Full renovation service with a premium look and customer-friendly process.",
};

return {
title: category,
image: firstImage?.url || "",
text: textMap[category],
};
});
}, [site.portfolio]);

function showNotice(message: string) {
setNotice(message);
window.setTimeout(() => setNotice(""), 2500);
}

async function loadSite() {
try {
setLoading(true);
const res = await fetch("/api/site-data", { cache: "no-store" });
if (!res.ok) throw new Error("Failed to load site data.");
const json = await res.json();
const normalized = normalizeSiteData(json?.data ?? json);
setSite(normalized);
} catch (error) {
console.error(error);
showNotice("Could not load saved site data. Using defaults.");
setSite(DEFAULT_SITE_DATA);
} finally {
setLoading(false);
setReady(true);
}
}

async function saveSite(nextSite?: SiteData) {
try {
setSaving(true);
const payload = nextSite ?? site;

const res = await fetch("/api/site-data", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ data: payload }),
});

if (!res.ok) {
const json = await res.json().catch(() => ({}));
throw new Error(json?.error || "Failed to save site data.");
}

showNotice("Saved.");
} catch (error) {
console.error(error);
showNotice("Save failed.");
} finally {
setSaving(false);
}
}

async function uploadImages(
input: FileList | File[] | null | undefined,
folder: string,
): Promise<BlobImage[]> {
const files =
input instanceof FileList ? Array.from(input) : Array.from(input ?? []);

if (!files.length) return [];

const uploaded: BlobImage[] = [];

for (const file of files) {
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
pathname: String(json.pathname || json.url),
alt: file.name,
createdAt: new Date().toISOString(),
});
}

return uploaded;
}

function updateContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
setSite((prev) => ({
...prev,
content: { ...prev.content, [key]: value },
updatedAt: new Date().toISOString(),
}));
}

function replaceSite(next: SiteData) {
setSite({
...next,
updatedAt: new Date().toISOString(),
});
}

async function handleBackgroundUpload(file: File | null) {
if (!file) return;
try {
showNotice("Uploading background...");
const [img] = await uploadImages([file], "backgrounds");
updateContent("heroBackgroundUrl", img.url);
showNotice("Background uploaded. Click Save.");
} catch (error) {
console.error(error);
showNotice("Background upload failed.");
}
}

async function handleHeroPanelUpload(position: "top" | "bottom", file: File | null) {
if (!file) return;
try {
showNotice("Uploading image...");
const [img] = await uploadImages([file], "hero");
if (position === "top") updateContent("heroPanelImageTop", img.url);
if (position === "bottom") updateContent("heroPanelImageBottom", img.url);
showNotice("Image uploaded. Click Save.");
} catch (error) {
console.error(error);
showNotice("Hero image upload failed.");
}
}

async function handlePortfolioUpload(
category: PortfolioCategory,
files: FileList | null,
) {
if (!files?.length) return;

try {
showNotice("Uploading portfolio images...");
const uploaded = await uploadImages(files, `portfolio/${slugify(category)}`);
setSite((prev) => ({
...prev,
portfolio: {
...prev.portfolio,
[category]: [...uploaded, ...prev.portfolio[category]],
},
updatedAt: new Date().toISOString(),
}));
showNotice(`${uploaded.length} image(s) uploaded. Click Save.`);
} catch (error) {
console.error(error);
showNotice("Portfolio upload failed.");
}
}

function removePortfolioImage(category: PortfolioCategory, id: string) {
setSite((prev) => ({
...prev,
portfolio: {
...prev.portfolio,
[category]: prev.portfolio[category].filter((img) => img.id !== id),
},
updatedAt: new Date().toISOString(),
}));
}

async function handleReviewPhotoUpload(files: FileList | null) {
if (!files?.length) return;
try {
showNotice("Uploading review photos...");
const uploaded = await uploadImages(files, "reviews");
setReviewPhotos((prev) => [...prev, ...uploaded]);
showNotice(`${uploaded.length} review photo(s) uploaded.`);
} catch (error) {
console.error(error);
showNotice("Review photo upload failed.");
}
}

function addReview() {
if (!reviewDraft.name.trim() || !reviewDraft.text.trim()) {
showNotice("Add review name and text.");
return;
}

const newReview: ReviewItem = {
id: uid(),
name: reviewDraft.name.trim(),
rating: Math.max(1, Math.min(5, Number(reviewDraft.rating) || 5)),
text: reviewDraft.text.trim(),
photos: reviewPhotos,
date: new Date().toLocaleString(),
};

setSite((prev) => ({
...prev,
reviews: [newReview, ...prev.reviews],
updatedAt: new Date().toISOString(),
}));

setReviewDraft({ name: "", rating: "5", text: "" });
setReviewPhotos([]);
showNotice("Review added. Click Save.");
}

function deleteReview(id: string) {
setSite((prev) => ({
...prev,
reviews: prev.reviews.filter((review) => review.id !== id),
updatedAt: new Date().toISOString(),
}));
}

function deleteVisit(id: string) {
setSite((prev) => ({
...prev,
visits: prev.visits.filter((item) => item.id !== id),
updatedAt: new Date().toISOString(),
}));
}

function deletePayment(id: string) {
setSite((prev) => ({
...prev,
payments: prev.payments.filter((item) => item.id !== id),
updatedAt: new Date().toISOString(),
}));
}

function unlockAdmin() {
if (passwordInput !== ADMIN_PASSWORD) {
showNotice("Wrong password.");
return;
}

setUnlocked(true);
sessionStorage.setItem("murillo_admin_unlocked", "yes");
}

function logoutAdmin() {
setUnlocked(false);
setPasswordInput("");
sessionStorage.removeItem("murillo_admin_unlocked");
}

const previewWidthClass =
previewMode === "mobile" ? "mx-auto max-w-[390px]" : "w-full";

const heroBackgroundStyle: CSSProperties = site.content.heroBackgroundUrl
? {
backgroundImage: `url(${site.content.heroBackgroundUrl})`,
backgroundSize: "cover",
backgroundPosition: "center",
}
: {
background:
"radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 28%), radial-gradient(circle at top right, rgba(34,197,94,0.14), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0))",
};

if (!ready) {
return (
<div className="min-h-screen bg-black px-6 py-10 text-white">
<Shell className="mx-auto max-w-3xl p-8 text-center">
Loading admin...
</Shell>
</div>
);
}

if (!unlocked) {
return (
<div className="min-h-screen bg-black px-4 py-10 text-white md:px-8">
<div className="mx-auto max-w-xl">
<Shell className="p-8">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Admin</p>
<h1 className="mt-3 text-4xl font-black">Unlock editor</h1>
<p className="mt-3 text-sm leading-7 text-white/65">
Enter the admin password to open the live editor.
</p>

<div className="mt-6 grid gap-4">
<input
type="password"
value={passwordInput}
onChange={(e) => setPasswordInput(e.target.value)}
placeholder="Password"
className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
/>
<Button variant="light" onClick={unlockAdmin}>
Open Admin
</Button>
</div>

{notice ? (
<div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
{notice}
</div>
) : null}

<p className="mt-5 text-xs text-white/45">
This is a UI lock for now. Real security needs middleware or auth.
</p>
</Shell>
</div>
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

<header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
<div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Murillo Admin</p>
<h1 className="text-lg font-bold">{site.content.businessName}</h1>
</div>

<div className="flex flex-wrap gap-2">
<Button
variant={tab === "content" ? "light" : "dark"}
onClick={() => setTab("content")}
>
Content
</Button>
<Button
variant={tab === "portfolio" ? "light" : "dark"}
onClick={() => setTab("portfolio")}
>
Portfolio
</Button>
<Button
variant={tab === "reviews" ? "light" : "dark"}
onClick={() => setTab("reviews")}
>
Reviews
</Button>
<Button
variant={tab === "visits" ? "light" : "dark"}
onClick={() => setTab("visits")}
>
Visits
</Button>
<Button
variant={tab === "payments" ? "light" : "dark"}
onClick={() => setTab("payments")}
>
Payments
</Button>
</div>

<div className="flex flex-wrap gap-2">
<Button onClick={() => void loadSite()} disabled={loading}>
{loading ? "Refreshing..." : "Refresh"}
</Button>
<Button variant="light" onClick={() => void saveSite()} disabled={saving}>
{saving ? "Saving..." : "Save Website"}
</Button>
<Button variant="danger" onClick={logoutAdmin}>
Logout
</Button>
</div>
</div>
</header>

<main className="mx-auto grid max-w-[1800px] gap-6 px-4 py-6 md:px-8 xl:grid-cols-[560px_minmax(0,1fr)]">
<div className="space-y-6">
{notice ? (
<Shell className="p-4 text-sm text-white/85">{notice}</Shell>
) : null}

{tab === "content" ? (
<>
<Shell className="p-6">
<h2 className="text-2xl font-bold">Business + hero</h2>
<p className="mt-2 text-sm text-white/60">
Edit the hero section and background image for the homepage.
</p>

<div className="mt-6 grid gap-4">
<Field
label="Business Name"
value={site.content.businessName}
onChange={(next) => updateContent("businessName", next)}
/>
<Field
label="Phone Number"
value={site.content.phoneNumber}
onChange={(next) => updateContent("phoneNumber", next)}
/>
<Field
label="Zelle Contact"
value={site.content.zelleContact}
onChange={(next) => updateContent("zelleContact", next)}
/>
<Field
label="Hero Badge"
value={site.content.heroBadge}
onChange={(next) => updateContent("heroBadge", next)}
/>
<Field
label="Hero Title Line 1"
value={site.content.heroTitleLine1}
onChange={(next) => updateContent("heroTitleLine1", next)}
/>
<Field
label="Hero Title Line 2"
value={site.content.heroTitleLine2}
onChange={(next) => updateContent("heroTitleLine2", next)}
/>
<Field
label="Hero Subtitle"
value={site.content.heroSubtitle}
onChange={(next) => updateContent("heroSubtitle", next)}
multiline
/>
<Field
label="Start Card Title"
value={site.content.startCardTitle}
onChange={(next) => updateContent("startCardTitle", next)}
/>
<Field
label="Start Card Text"
value={site.content.startCardText}
onChange={(next) => updateContent("startCardText", next)}
multiline
/>
</div>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<label className="grid gap-2">
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
Hero background upload
</span>
<label className="cursor-pointer rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
Upload background image
<input
type="file"
accept="image/*"
className="hidden"
onChange={(e) =>
void handleBackgroundUpload(e.target.files?.[0] ?? null)
}
/>
</label>
</label>

<label className="grid gap-2">
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
Hero background URL
</span>
<input
value={site.content.heroBackgroundUrl}
onChange={(e) =>
updateContent("heroBackgroundUrl", e.target.value)
}
className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
placeholder="https://..."
/>
</label>
</div>

<div className="mt-4 grid gap-4 md:grid-cols-2">
<label className="grid gap-2">
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
Right card top image
</span>
<label className="cursor-pointer rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
Upload top image
<input
type="file"
accept="image/*"
className="hidden"
onChange={(e) =>
void handleHeroPanelUpload("top", e.target.files?.[0] ?? null)
}
/>
</label>
</label>

<label className="grid gap-2">
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
Right card bottom image
</span>
<label className="cursor-pointer rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
Upload bottom image
<input
type="file"
accept="image/*"
className="hidden"
onChange={(e) =>
void handleHeroPanelUpload("bottom", e.target.files?.[0] ?? null)
}
/>
</label>
</label>
</div>

<div className="mt-4 grid gap-4 md:grid-cols-2">
<Field
label="Top image URL"
value={site.content.heroPanelImageTop}
onChange={(next) => updateContent("heroPanelImageTop", next)}
/>
<Field
label="Bottom image URL"
value={site.content.heroPanelImageBottom}
onChange={(next) => updateContent("heroPanelImageBottom", next)}
/>
</div>

<div className="mt-6">
<label className="grid gap-2">
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
Background brightness: {site.content.heroBackgroundBrightness.toFixed(2)}
</span>
<input
type="range"
min="0.05"
max="1"
step="0.01"
value={site.content.heroBackgroundBrightness}
onChange={(e) =>
updateContent(
"heroBackgroundBrightness",
Number(e.target.value),
)
}
/>
</label>
</div>
</Shell>

<Shell className="p-6">
<h2 className="text-2xl font-bold">Stats + main section copy</h2>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<Field
label="Stat 1 Value"
value={site.content.stat1Value}
onChange={(next) => updateContent("stat1Value", next)}
/>
<Field
label="Stat 1 Label"
value={site.content.stat1Label}
onChange={(next) => updateContent("stat1Label", next)}
/>
<Field
label="Stat 2 Value"
value={site.content.stat2Value}
onChange={(next) => updateContent("stat2Value", next)}
/>
<Field
label="Stat 2 Label"
value={site.content.stat2Label}
onChange={(next) => updateContent("stat2Label", next)}
/>
<Field
label="Stat 3 Value"
value={site.content.stat3Value}
onChange={(next) => updateContent("stat3Value", next)}
/>
<Field
label="Stat 3 Label"
value={site.content.stat3Label}
onChange={(next) => updateContent("stat3Label", next)}
/>
<Field
label="Stat 4 Value"
value={site.content.stat4Value}
onChange={(next) => updateContent("stat4Value", next)}
/>
<Field
label="Stat 4 Label"
value={site.content.stat4Label}
onChange={(next) => updateContent("stat4Label", next)}
/>
</div>

<div className="mt-6 grid gap-4">
<Field
label="Services Title"
value={site.content.servicesTitle}
onChange={(next) => updateContent("servicesTitle", next)}
/>
<Field
label="Services Subtitle"
value={site.content.servicesSubtitle}
onChange={(next) => updateContent("servicesSubtitle", next)}
multiline
/>
<Field
label="Portfolio Title"
value={site.content.portfolioTitle}
onChange={(next) => updateContent("portfolioTitle", next)}
/>
<Field
label="Portfolio Subtitle"
value={site.content.portfolioSubtitle}
onChange={(next) => updateContent("portfolioSubtitle", next)}
multiline
/>
<Field
label="Reviews Title"
value={site.content.reviewsTitle}
onChange={(next) => updateContent("reviewsTitle", next)}
/>
<Field
label="Reviews Subtitle"
value={site.content.reviewsSubtitle}
onChange={(next) => updateContent("reviewsSubtitle", next)}
multiline
/>
<Field
label="About Title"
value={site.content.aboutTitle}
onChange={(next) => updateContent("aboutTitle", next)}
/>
<Field
label="About Subtitle"
value={site.content.aboutSubtitle}
onChange={(next) => updateContent("aboutSubtitle", next)}
multiline
/>
</div>
</Shell>

<Shell className="p-6">
<h2 className="text-2xl font-bold">FAQ + quick actions + CTA</h2>

<div className="mt-6 grid gap-4">
<Field
label="FAQ Title"
value={site.content.faqTitle}
onChange={(next) => updateContent("faqTitle", next)}
/>
<Field
label="FAQ Subtitle"
value={site.content.faqSubtitle}
onChange={(next) => updateContent("faqSubtitle", next)}
multiline
/>
<Field
label="Quick Actions Title"
value={site.content.quickTitle}
onChange={(next) => updateContent("quickTitle", next)}
/>
<Field
label="Quick Actions Subtitle"
value={site.content.quickSubtitle}
onChange={(next) => updateContent("quickSubtitle", next)}
multiline
/>
<Field
label="CTA Badge"
value={site.content.ctaBadge}
onChange={(next) => updateContent("ctaBadge", next)}
/>
<Field
label="CTA Title"
value={site.content.ctaTitle}
onChange={(next) => updateContent("ctaTitle", next)}
multiline
/>
<Field
label="CTA Text"
value={site.content.ctaText}
onChange={(next) => updateContent("ctaText", next)}
multiline
/>
</div>
</Shell>
</>
) : null}

{tab === "portfolio" ? (
<Shell className="p-6">
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<h2 className="text-2xl font-bold">Portfolio manager</h2>
<p className="mt-2 text-sm text-white/60">
Upload images to a real shared store so everyone can see them.
</p>
</div>
<label className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
Upload to {selectedCategory}
<input
type="file"
accept="image/*"
multiple
className="hidden"
onChange={(e) =>
void handlePortfolioUpload(selectedCategory, e.target.files)
}
/>
</label>
</div>

<div className="mt-4 flex flex-wrap gap-2">
{CATEGORIES.map((category) => (
<Button
key={category}
variant={selectedCategory === category ? "light" : "dark"}
onClick={() => setSelectedCategory(category)}
>
{category}
</Button>
))}
</div>

<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
{site.portfolio[selectedCategory].length === 0 ? (
<div className="rounded-[1.5rem] border border-dashed border-white/15 p-10 text-center text-sm text-white/50 md:col-span-2 xl:col-span-3">
No images yet in {selectedCategory}.
</div>
) : (
site.portfolio[selectedCategory].map((img) => (
<ImageTile
key={img.id}
img={img}
onOpen={() => setPreviewImage(img.url)}
onDelete={() => removePortfolioImage(selectedCategory, img.id)}
/>
))
)}
</div>
</Shell>
) : null}

{tab === "reviews" ? (
<Shell className="p-6">
<h2 className="text-2xl font-bold">Reviews manager</h2>
<p className="mt-2 text-sm text-white/60">
Add reviews and upload their photos to Blob.
</p>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<Field
label="Reviewer Name"
value={reviewDraft.name}
onChange={(next) =>
setReviewDraft((prev) => ({ ...prev, name: next }))
}
/>
<label className="grid gap-2">
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
Rating
</span>
<select
value={reviewDraft.rating}
onChange={(e) =>
setReviewDraft((prev) => ({ ...prev, rating: e.target.value }))
}
className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
>
<option value="5">5 stars</option>
<option value="4">4 stars</option>
<option value="3">3 stars</option>
<option value="2">2 stars</option>
<option value="1">1 star</option>
</select>
</label>
</div>

<div className="mt-4">
<Field
label="Review Text"
value={reviewDraft.text}
onChange={(next) =>
setReviewDraft((prev) => ({ ...prev, text: next }))
}
multiline
/>
</div>

<div className="mt-4 flex flex-wrap gap-3">
<label className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
Upload review photos
<input
type="file"
accept="image/*"
multiple
className="hidden"
onChange={(e) => void handleReviewPhotoUpload(e.target.files)}
/>
</label>

<Button variant="light" onClick={addReview}>
Add Review
</Button>
</div>

{reviewPhotos.length > 0 ? (
<div className="mt-5 grid gap-3 md:grid-cols-3">
{reviewPhotos.map((img) => (
<ImageTile
key={img.id}
img={img}
onOpen={() => setPreviewImage(img.url)}
/>
))}
</div>
) : null}

<div className="mt-8 space-y-4">
{site.reviews.length === 0 ? (
<div className="rounded-[1.5rem] border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
No saved reviews yet.
</div>
) : (
site.reviews.map((review) => (
<div
key={review.id}
className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5"
>
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<p className="text-lg font-semibold">{review.name}</p>
<p className="text-xs text-white/45">{review.date}</p>
</div>
<p className="text-blue-400">{stars(review.rating)}</p>
</div>
<p className="mt-3 text-sm leading-7 text-white/70">{review.text}</p>

{review.photos.length > 0 ? (
<div className="mt-4 grid gap-3 md:grid-cols-4">
{review.photos.map((photo) => (
<ImageTile
key={photo.id}
img={photo}
onOpen={() => setPreviewImage(photo.url)}
/>
))}
</div>
) : null}

<div className="mt-4">
<Button variant="danger" onClick={() => deleteReview(review.id)}>
Delete Review
</Button>
</div>
</div>
))
)}
</div>
</Shell>
) : null}

{tab === "visits" ? (
<Shell className="p-6">
<div className="flex items-center justify-between gap-3">
<h2 className="text-2xl font-bold">Visit requests</h2>
<p className="text-sm text-white/60">{site.visits.length} saved</p>
</div>

<div className="mt-6 space-y-4">
{site.visits.length === 0 ? (
<div className="rounded-[1.5rem] border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
No visit requests yet.
</div>
) : (
site.visits.map((item) => (
<div
key={item.id}
className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5"
>
<div className="flex flex-wrap items-start justify-between gap-3">
<div>
<p className="text-lg font-semibold">{item.name}</p>
<p className="text-sm text-white/60">{item.email}</p>
<p className="text-sm text-white/60">{item.phone}</p>
</div>
<p className="text-xs text-white/45">{item.date}</p>
</div>

<div className="mt-4 grid gap-3 md:grid-cols-2">
<p className="text-sm text-white/75">
<span className="text-white/45">Address:</span> {item.address || "—"}
</p>
<p className="text-sm text-white/75">
<span className="text-white/45">Job type:</span> {item.jobType || "—"}
</p>
<p className="text-sm text-white/75">
<span className="text-white/45">Preferred time:</span>{" "}
{item.preferredTime || "—"}
</p>
<p className="text-sm text-white/75 md:col-span-2">
<span className="text-white/45">Details:</span> {item.details || "—"}
</p>
</div>

<div className="mt-4">
<Button variant="danger" onClick={() => deleteVisit(item.id)}>
Delete Visit
</Button>
</div>
</div>
))
)}
</div>
</Shell>
) : null}

{tab === "payments" ? (
<Shell className="p-6">
<div className="flex items-center justify-between gap-3">
<h2 className="text-2xl font-bold">Payment submissions</h2>
<p className="text-sm text-white/60">{site.payments.length} saved</p>
</div>

<div className="mt-6 space-y-4">
{site.payments.length === 0 ? (
<div className="rounded-[1.5rem] border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
No payment submissions yet.
</div>
) : (
site.payments.map((item) => (
<div
key={item.id}
className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5"
>
<div className="flex flex-wrap items-start justify-between gap-3">
<div>
<p className="text-lg font-semibold">${item.amount}</p>
<p className="text-sm text-white/60">{item.name}</p>
<p className="text-sm text-white/60">{item.email}</p>
</div>
<p className="text-xs text-white/45">{item.date}</p>
</div>

<p className="mt-4 text-sm text-white/75">
<span className="text-white/45">Notes:</span> {item.notes || "—"}
</p>

{item.proofs.length > 0 ? (
<div className="mt-4 grid gap-3 md:grid-cols-4">
{item.proofs.map((proof) => (
<ImageTile
key={proof.id}
img={proof}
onOpen={() => setPreviewImage(proof.url)}
/>
))}
</div>
) : null}

<div className="mt-4">
<Button variant="danger" onClick={() => deletePayment(item.id)}>
Delete Payment
</Button>
</div>
</div>
))
)}
</div>
</Shell>
) : null}
</div>

<div className="space-y-6">
<Shell className="p-4">
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">
Live preview
</p>
<p className="mt-1 text-sm text-white/60">
This preview mirrors the site data you’re editing.
</p>
</div>

<div className="flex gap-2">
<Button
variant={previewMode === "desktop" ? "light" : "dark"}
onClick={() => setPreviewMode("desktop")}
>
Desktop
</Button>
<Button
variant={previewMode === "mobile" ? "light" : "dark"}
onClick={() => setPreviewMode("mobile")}
>
Mobile
</Button>
</div>
</div>
</Shell>

<div className={previewWidthClass}>
<div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
<div className="border-b border-white/10 bg-black/90 px-4 py-4">
<div className="flex flex-wrap items-center justify-between gap-3">
<p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">
{site.content.businessName}
</p>
<div className="flex flex-wrap gap-2 text-xs">
<span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
View Portfolio
</span>
<span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
Reviews
</span>
<span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
Request Visit
</span>
<span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
Make Payment
</span>
<span className="rounded-full bg-white px-3 py-1 text-black">
Call Now
</span>
</div>
</div>
</div>

<div className="relative">
<div
className="absolute inset-0"
style={heroBackgroundStyle}
/>
<div
className="absolute inset-0 bg-black"
style={{ opacity: site.content.heroBackgroundBrightness }}
/>
<div className="relative px-4 py-5 md:px-6 md:py-6">
<section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
<Shell className="p-6">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">
{site.content.heroBadge}
</p>
<h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-6xl">
{site.content.heroTitleLine1}
<span className="block text-blue-500">
{site.content.heroTitleLine2}
</span>
</h1>
<p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
{site.content.heroSubtitle}
</p>

<div className="mt-6 flex flex-wrap gap-3">
<span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
Request Visit
</span>
<span className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">
View Portfolio
</span>
<span className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">
Make Payment
</span>
</div>

<div className="mt-6 flex flex-wrap gap-4 text-xs text-white/60">
<span>{site.content.stat3Value} {site.content.stat3Label}</span>
<span>Quality craftsmanship</span>
<span>Transparent pricing</span>
</div>
</Shell>

<div className="grid gap-4">
<Shell className="p-5">
<div className="grid gap-4 md:grid-cols-[1fr_180px]">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">
Start here
</p>
<h2 className="mt-3 text-3xl font-black leading-tight">
{site.content.startCardTitle}
</h2>
<p className="mt-3 text-sm leading-7 text-white/70">
{site.content.startCardText}
</p>

<div className="mt-5 flex flex-wrap gap-3">
<span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
View Portfolio
</span>
<span className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white">
Request Visit
</span>
</div>
</div>

<div className="grid gap-3">
{site.content.heroPanelImageTop ? (
<img
src={site.content.heroPanelImageTop}
alt="hero preview top"
className="h-32 w-full rounded-[1.3rem] object-cover"
/>
) : (
<div className="h-32 rounded-[1.3rem] border border-dashed border-white/15 bg-black/30" />
)}

{site.content.heroPanelImageBottom ? (
<img
src={site.content.heroPanelImageBottom}
alt="hero preview bottom"
className="h-32 w-full rounded-[1.3rem] object-cover"
/>
) : (
<div className="h-32 rounded-[1.3rem] border border-dashed border-white/15 bg-black/30" />
)}
</div>
</div>
</Shell>

<div className="grid grid-cols-2 gap-4">
<Shell className="p-5">
<p className="text-3xl font-black text-blue-500">
{site.content.stat1Value}
</p>
<p className="mt-1 text-sm text-white/60">
{site.content.stat1Label}
</p>
</Shell>
<Shell className="p-5">
<p className="text-3xl font-black text-blue-500">
{site.content.stat2Value}
</p>
<p className="mt-1 text-sm text-white/60">
{site.content.stat2Label}
</p>
</Shell>
</div>

<Shell className="p-5">
<div className="grid gap-3 sm:grid-cols-2">
<div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">
Portfolio Preview
</p>
<p className="mt-3 text-2xl font-bold">Selected work only.</p>
<p className="mt-3 text-sm text-white/65">
The gallery lives on its own page so the homepage stays clean.
</p>
</div>

<div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">
Action Flow
</p>
<p className="mt-3 text-sm text-white/70">
Visit, portfolio, and payment buttons are kept obvious.
</p>
<p className="mt-2 text-sm text-white/70">
Reviews with photos can show on the homepage.
</p>
</div>
</div>
</Shell>
</div>
</section>

<section className="mt-8 rounded-[2rem] bg-gradient-to-r from-lime-400 to-emerald-400 px-6 py-10 text-black">
<p className="text-xs uppercase tracking-[0.35em] text-black/60">
{site.content.ctaBadge}
</p>
<div className="mt-3 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
<div>
<h2 className="text-4xl font-black leading-tight md:text-6xl">
{site.content.ctaTitle}
</h2>
<p className="mt-3 max-w-2xl text-sm leading-7 text-black/75">
{site.content.ctaText}
</p>
</div>
<div className="grid gap-3">
<span className="rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white">
Request Visit
</span>
<span className="rounded-full border border-black/15 px-5 py-3 text-center text-sm font-semibold text-black">
View Portfolio
</span>
<span className="rounded-full border border-black/15 px-5 py-3 text-center text-sm font-semibold text-black">
Make Payment
</span>
</div>
</div>
</section>

<section className="mt-10">
<SectionHeading
eyebrow="Services"
title={site.content.servicesTitle}
text={site.content.servicesSubtitle}
/>
<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
{SERVICES.map((service) => (
<Shell key={service.title} className="p-5">
<div className="flex items-start justify-between gap-3">
<h3 className="text-lg font-bold">{service.title}</h3>
<span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/60">
Premium
</span>
</div>
<p className="mt-3 text-sm leading-7 text-white/68">
{service.description}
</p>
</Shell>
))}
</div>
</section>

<section className="mt-10">
<SectionHeading
eyebrow="Portfolio Preview"
title={site.content.portfolioTitle}
text={site.content.portfolioSubtitle}
/>
<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
{portfolioPreviewCards.map((card) => (
<Shell key={card.title} className="overflow-hidden">
{card.image ? (
<img
src={card.image}
alt={card.title}
className="h-56 w-full object-cover"
/>
) : (
<div className="h-56 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03)),radial-gradient(circle_at_top_right,rgba(34,197,94,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_35%)]" />
)}
<div className="p-5">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">
Portfolio Preview
</p>
<h3 className="mt-3 text-2xl font-bold">{card.title}</h3>
<p className="mt-3 text-sm leading-7 text-white/65">{card.text}</p>
<div className="mt-5 flex gap-3">
<span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
View Portfolio
</span>
<span className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">
Request Visit
</span>
</div>
</div>
</Shell>
))}
</div>
</section>

<section className="mt-10">
<div className="flex flex-wrap items-end justify-between gap-4">
<SectionHeading
eyebrow="Reviews"
title={site.content.reviewsTitle}
text={site.content.reviewsSubtitle}
/>
<div className="text-sm text-white/60">Average rating: 5.0/5</div>
</div>

<div className="mt-6 grid gap-4 md:grid-cols-3">
{site.reviews.length === 0 ? (
<Shell className="p-6 md:col-span-3">No reviews yet.</Shell>
) : (
site.reviews.slice(0, 3).map((review) => (
<Shell key={review.id} className="p-5">
<div className="flex items-center justify-between gap-3">
<p className="font-semibold">{review.name}</p>
<span className="text-blue-400">{stars(review.rating)}</span>
</div>
<p className="mt-4 text-sm leading-7 text-white/75">
“{review.text}”
</p>

{review.photos.length > 0 ? (
<div className="mt-4 grid grid-cols-2 gap-3">
{review.photos.slice(0, 4).map((photo) => (
<button
key={photo.id}
type="button"
onClick={() => setPreviewImage(photo.url)}
className="overflow-hidden rounded-2xl border border-white/10"
>
<img
src={photo.url}
alt={photo.alt}
className="h-24 w-full object-cover"
/>
</button>
))}
</div>
) : null}
</Shell>
))
)}
</div>
</section>

<section className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
<Shell className="p-6">
<SectionHeading
eyebrow="About"
title={site.content.aboutTitle}
text={site.content.aboutSubtitle}
/>
<div className="mt-6 flex flex-wrap gap-3">
<span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
Request Visit
</span>
<span className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
View Portfolio
</span>
</div>

<div className="mt-6 grid gap-2 text-sm text-white/70">
<p>• Remodeling and renovation</p>
<p>• Repairs and finishing work</p>
<p>• Custom interior and exterior projects</p>
<p>• Visit-based estimates and clear communication</p>
</div>
</Shell>

<Shell className="p-6">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">
Top Features
</p>
<div className="mt-4 grid gap-3">
<div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
<p className="font-semibold">Request Visit</p>
<p className="mt-2 text-sm text-white/65">
Opens only when clicked and gives a proper response after
submission.
</p>
</div>
<div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
<p className="font-semibold">Make Payment</p>
<p className="mt-2 text-sm text-white/65">
Opens the Zelle instructions only when pressed.
</p>
</div>
<div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
<p className="font-semibold">View Portfolio</p>
<p className="mt-2 text-sm text-white/65">
Sends the user to the dedicated gallery page.
</p>
</div>
</div>
</Shell>
</section>

<section className="mt-10">
<SectionHeading
eyebrow="FAQ"
title={site.content.faqTitle}
text={site.content.faqSubtitle}
/>
<div className="mt-6 grid gap-4 md:grid-cols-2">
{FAQ_ITEMS.map((item) => (
<Shell key={item.q} className="p-5">
<h3 className="text-lg font-bold">{item.q}</h3>
<p className="mt-3 text-sm leading-7 text-white/68">{item.a}</p>
</Shell>
))}
</div>
</section>

<section className="mt-10">
<div className="mx-auto max-w-4xl text-center">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">
Contact
</p>
<h2 className="mt-3 text-4xl font-black md:text-6xl">
{site.content.quickTitle}
</h2>
<p className="mt-3 text-sm leading-7 text-white/65">
{site.content.quickSubtitle}
</p>
</div>

<div className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-3">
<span className="rounded-[1.6rem] border border-white/10 bg-white px-6 py-7 text-left font-semibold text-black">
Request Visit
</span>
<span className="rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-7 text-left font-semibold text-white">
View Portfolio
</span>
<span className="rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-7 text-left font-semibold text-white">
Make Payment
</span>
</div>
</section>
</div>
</div>
</div>
</div>
</div>
</main>

{previewImage ? (
<button
type="button"
onClick={() => setPreviewImage(null)}
className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-5"
>
<img
src={previewImage}
alt="preview"
className="max-h-[90vh] max-w-[95vw] rounded-3xl shadow-2xl"
/>
</button>
) : null}
</div>
);
}

function slugify(input: string) {
return input
.toLowerCase()
.replace(/&/g, "and")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}
