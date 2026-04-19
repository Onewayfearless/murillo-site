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
stat4: string;

portfolio: Record<Category, MediaItem[]>;
reviews: ReviewItem[];
visits: VisitItem[];
payments: PaymentItem[];
};

const DB_NAME = "MURILLO_SITE_DB";
const STORE_NAME = "site";
const STORE_KEY = "state";
const ADMIN_SESSION_KEY = "murillo_admin_logged_in";
const ADMIN_PASSWORD = "murillo123";

const categories: Category[] = [
"Kitchen Remodel",
"Bathroom Remodel",
"Flooring Project",
"Custom Build",
"Repair Work",
"Renovation",
];

const services = [
{
title: "Kitchen Remodeling",
text: "Cabinets, counters, tile, lighting, floors, and layout improvements that make the home feel brand new.",
},
{
title: "Bathroom Remodeling",
text: "Showers, tubs, vanities, tile work, plumbing finish work, and clean upscale finishes.",
},
{
title: "Flooring & Tile",
text: "Vinyl, hardwood, laminate, tile, grout, transitions, and repair work for a crisp finished look.",
},
{
title: "Drywall & Painting",
text: "Patch repair, texture matching, interior repainting, and detailed clean walls and ceilings.",
},
{
title: "Repairs & Maintenance",
text: "Fast turnaround work for damaged areas, small fixes, trim, doors, framing, and punch lists.",
},
{
title: "Full Renovation",
text: "Bigger jobs with a clean process from quote to finish, including scheduling, updates, and follow-up.",
},
];

const faqItems = [
{
q: "How does the request visit button work?",
a: "It opens the form only when clicked. Submitting saves the request and shows a success message.",
},
{
q: "How does the payment button work?",
a: "It opens a Zelle payment panel only when clicked, with screenshot upload and review submission.",
},
{
q: "Can customers add review photos?",
a: "Yes. Reviews can include uploaded photos and those photos appear in the review section.",
},
{
q: "Where does portfolio go?",
a: "It goes to the dedicated gallery page so the homepage stays clean and premium.",
},
];

const defaultSite: SiteData = {
businessName: "Murillo Renovations LLC",
phoneNumber: "+1 (678) 555-1234",
zelleContact: "your-zelle@email.com",

heroBadge: "Licensed & Insured General Contractor",
heroTitleLine1: "Luxury Homes",
heroTitleLine2: "Done Once.",
heroSubtitle:
"Premium remodeling, renovation, and custom construction with a clean process, strong communication, and results that feel expensive.",

backgroundImage: null,
backgroundBrightness: 0.55,

heroSectionBackgroundImage: null,
heroSectionOverlay: 0.5,

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
stat4: "Transparent pricing",

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

function clone<T>(value: T): T {
return JSON.parse(JSON.stringify(value)) as T;
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

function mediaFromUnknown(value: unknown): MediaItem | null {
if (!value) return null;

if (typeof value === "string") {
return {
id: uid(),
src: value,
};
}

if (typeof value === "object") {
const obj = value as Record<string, unknown>;
return {
id: typeof obj.id === "string" ? obj.id : uid(),
name: typeof obj.name === "string" ? obj.name : undefined,
src: typeof obj.src === "string" ? obj.src : undefined,
file: obj.file instanceof File ? obj.file : undefined,
};
}

return null;
}

function mediaArrayFromUnknown(value: unknown): MediaItem[] {
if (!Array.isArray(value)) return [];
return value
.map(mediaFromUnknown)
.filter((item): item is MediaItem => Boolean(item))
.filter((item) => Boolean(item.src || item.file));
}

function normalizeSite(input?: Partial<SiteData> | null): SiteData {
const safe = input || {};

return {
...defaultSite,
...safe,
backgroundImage: mediaFromUnknown(safe.backgroundImage) || null,
heroSectionBackgroundImage: mediaFromUnknown(safe.heroSectionBackgroundImage) || null,
backgroundBrightness:
typeof safe.backgroundBrightness === "number"
? safe.backgroundBrightness
: defaultSite.backgroundBrightness,
heroSectionOverlay:
typeof safe.heroSectionOverlay === "number"
? safe.heroSectionOverlay
: defaultSite.heroSectionOverlay,
portfolio: {
"Kitchen Remodel": mediaArrayFromUnknown(safe.portfolio?.["Kitchen Remodel"]),
"Bathroom Remodel": mediaArrayFromUnknown(safe.portfolio?.["Bathroom Remodel"]),
"Flooring Project": mediaArrayFromUnknown(safe.portfolio?.["Flooring Project"]),
"Custom Build": mediaArrayFromUnknown(safe.portfolio?.["Custom Build"]),
"Repair Work": mediaArrayFromUnknown(safe.portfolio?.["Repair Work"]),
Renovation: mediaArrayFromUnknown(safe.portfolio?.["Renovation"]),
},
reviews: Array.isArray(safe.reviews) ? safe.reviews : [],
visits: Array.isArray(safe.visits) ? safe.visits : [],
payments: Array.isArray(safe.payments) ? safe.payments : [],
};
}

async function loadSite(): Promise<SiteData> {
try {
const db = await openDb();

const raw = await new Promise<unknown>((resolve, reject) => {
const tx = db.transaction(STORE_NAME, "readonly");
const store = tx.objectStore(STORE_NAME);
const req = store.get(STORE_KEY);

req.onsuccess = () => resolve(req.result);
req.onerror = () => reject(req.error);
});

if (!raw) return defaultSite;
return normalizeSite(raw as Partial<SiteData>);
} catch {
return defaultSite;
}
}

async function saveSite(data: SiteData): Promise<void> {
const db = await openDb();

await new Promise<void>((resolve, reject) => {
const tx = db.transaction(STORE_NAME, "readwrite");
const store = tx.objectStore(STORE_NAME);
const req = store.put(data, STORE_KEY);

req.onsuccess = () => resolve();
req.onerror = () => reject(req.error);
});
}

async function fileToMedia(file: File): Promise<MediaItem> {
return {
id: uid(),
name: file.name,
file,
};
}

async function filesToMedia(files: FileList | null): Promise<MediaItem[]> {
if (!files?.length) return [];
return Promise.all(Array.from(files).map(fileToMedia));
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
onClick,
}: {
item: MediaItem;
alt?: string;
className?: string;
onClick?: () => void;
}) {
const url = useMediaUrl(item);
if (!url) return null;

return (
<img
src={url}
alt={alt || item.name || "image"}
className={className}
onClick={onClick}
draggable={false}
/>
);
}

function StarRow({ rating }: { rating: number }) {
const clamped = Math.max(1, Math.min(5, rating));
return (
<span className="text-cyan-300">
{Array.from({ length: 5 }, (_, i) => (i < clamped ? "★" : "☆")).join("")}
</span>
);
}

function Glass({
children,
className = "",
}: {
children: ReactNode;
className?: string;
}) {
return (
<div
className={`rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-[0_14px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`}
>
{children}
</div>
);
}

function TinyButton({
active,
children,
onClick,
}: {
active?: boolean;
children: ReactNode;
onClick?: () => void;
}) {
return (
<button
type="button"
onClick={onClick}
className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
active
? "bg-white text-black"
: "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
}`}
>
{children}
</button>
);
}

function EditableText({
value,
onChange,
editMode,
className = "",
as = "div",
}: {
value: string;
onChange: (value: string) => void;
editMode: boolean;
className?: string;
as?: "div" | "p" | "span" | "h1" | "h2" | "h3";
}) {
const Tag = as as any;

if (!editMode) {
return <Tag className={className}>{value}</Tag>;
}

return (
<Tag
className={`${className} rounded-md outline outline-1 outline-dashed outline-cyan-400/70`}
contentEditable
suppressContentEditableWarning
onBlur={(e: React.FocusEvent<HTMLElement>) => {
onChange(e.currentTarget.textContent ?? "");
}}
>
{value}
</Tag>
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
<div className="max-w-4xl">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">{eyebrow}</p>
<h2 className="mt-3 text-4xl font-black md:text-6xl">{title}</h2>
<p className="mt-4 text-sm leading-7 text-white/65 md:text-base">{text}</p>
</div>
);
}

function Modal({
open,
title,
onClose,
children,
}: {
open: boolean;
title: string;
onClose: () => void;
children: ReactNode;
}) {
if (!open) return null;

return (
<div className="fixed inset-0 z-[90] overflow-y-auto bg-black/85 p-4">
<div className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-white/10 bg-black p-6 shadow-2xl">
<div className="flex items-center justify-between gap-3">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">{title}</p>
</div>
<button
type="button"
onClick={onClose}
className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75"
>
Close
</button>
</div>
{children}
</div>
</div>
);
}

export default function AdminPage() {
const router = useRouter();

const sectionRefs = useRef<Record<string, HTMLElement | null>>({
hero: null,
services: null,
portfolio: null,
reviews: null,
about: null,
faq: null,
quick: null,
contact: null,
});

const [ready, setReady] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);
const [password, setPassword] = useState("");
const [passwordError, setPasswordError] = useState("");

const [site, setSite] = useState<SiteData>(defaultSite);
const [saving, setSaving] = useState(false);
const [notice, setNotice] = useState("");
const [editMode, setEditMode] = useState(true);

const [tab, setTab] = useState<
"builder" | "portfolio" | "reviews" | "quotes" | "payments" | "settings"
>("builder");

const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
const [selectedCategory, setSelectedCategory] = useState<Category>("Kitchen Remodel");
const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

const [visitOpen, setVisitOpen] = useState(false);
const [paymentOpen, setPaymentOpen] = useState(false);

const [reviewDraft, setReviewDraft] = useState({
name: "",
rating: "5",
text: "",
});
const [reviewPhotos, setReviewPhotos] = useState<MediaItem[]>([]);

const [visitDraft, setVisitDraft] = useState({
name: "",
email: "",
phone: "",
address: "",
jobType: "",
preferredTime: "",
details: "",
});

const [paymentDraft, setPaymentDraft] = useState({
amount: "",
name: "",
email: "",
notes: "",
});
const [paymentProofs, setPaymentProofs] = useState<MediaItem[]>([]);

const pageBgUrl = useMediaUrl(site.backgroundImage);
const heroBgUrl = useMediaUrl(site.heroSectionBackgroundImage);
const selectedImageUrl = useMediaUrl(selectedImage);

const heroPreviewImages = useMemo(() => {
const all = categories.flatMap((category) => site.portfolio[category]);
return all.slice(0, 2);
}, [site.portfolio]);

const portfolioPreviewCards = useMemo(() => {
const labels = [
"Kitchen Remodel",
"Bathroom Remodel",
"Flooring Project",
"Custom Build",
"Repair Work",
"Renovation",
] as Category[];

return labels.map((label) => ({
title: label,
text:
label === "Kitchen Remodel"
? "Before and after kitchen setups, cabinets, counters, and clean finish work."
: label === "Bathroom Remodel"
? "Modern bathroom work, tile, vanity, shower detail, and polished upgrades."
: label === "Flooring Project"
? "Flooring replacement, transitions, tile installs, and repair work."
: label === "Custom Build"
? "Custom interiors, framing, built-ins, and unique customer project layouts."
: label === "Repair Work"
? "Punch list, patch repair, drywall fixes, and fast maintenance solutions."
: "Full renovation service with a premium look and customer-friendly process.",
image: site.portfolio[label][0] || null,
}));
}, [site.portfolio]);

useEffect(() => {
let mounted = true;

(async () => {
const loaded = await loadSite();
if (!mounted) return;

setSite(loaded);
setReady(true);

const savedSession =
typeof window !== "undefined" &&
window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "yes";
setLoggedIn(Boolean(savedSession));
})();

return () => {
mounted = false;
};
}, []);

useEffect(() => {
if (!notice) return;
const timer = window.setTimeout(() => setNotice(""), 1800);
return () => window.clearTimeout(timer);
}, [notice]);

const safePersist = async (next: SiteData, message?: string) => {
try {
setSaving(true);
await saveSite(next);
if (message) setNotice(message);
} catch {
setNotice("Save failed.");
} finally {
setSaving(false);
}
};

const updateSite = async (updater: (current: SiteData) => SiteData, message?: string) => {
const next = updater(site);
setSite(next);
await safePersist(next, message);
};

const setField = async <K extends keyof SiteData>(key: K, value: SiteData[K], message?: string) => {
const next = { ...site, [key]: value };
setSite(next);
await safePersist(next, message);
};

const scrollToSection = (name: keyof typeof sectionRefs.current) => {
sectionRefs.current[name]?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const handleLogin = () => {
if (password === ADMIN_PASSWORD) {
setLoggedIn(true);
setPassword("");
setPasswordError("");
sessionStorage.setItem(ADMIN_SESSION_KEY, "yes");
} else {
setPasswordError("Wrong password.");
}
};

const logout = () => {
sessionStorage.removeItem(ADMIN_SESSION_KEY);
setLoggedIn(false);
setPassword("");
};

const exportBackup = () => {
const blob = new Blob([JSON.stringify(site, null, 2)], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "murillo-site-backup.json";
a.click();
URL.revokeObjectURL(url);
};

const importBackup = async (file: File | null) => {
if (!file) return;

try {
const raw = JSON.parse(await file.text()) as Partial<SiteData>;
const normalized = normalizeSite(raw);
setSite(normalized);
await safePersist(normalized, "Backup imported.");
} catch {
setNotice("Invalid backup file.");
}
};

const resetEverything = async () => {
if (!window.confirm("Reset everything?")) return;
setSite(defaultSite);
setReviewPhotos([]);
setPaymentProofs([]);
await safePersist(defaultSite, "Everything reset.");
};

const uploadBackground = async (file: File | null) => {
if (!file) return;
const media = await fileToMedia(file);
await setField("backgroundImage", media, "Website background updated.");
};

const uploadHeroSectionBackground = async (file: File | null) => {
if (!file) return;
const media = await fileToMedia(file);
await setField("heroSectionBackgroundImage", media, "Hero section background updated.");
};

const addPortfolioImages = async (category: Category, files: FileList | null) => {
const media = await filesToMedia(files);
if (!media.length) return;

await updateSite(
(current) => ({
...current,
portfolio: {
...current.portfolio,
[category]: [...media, ...current.portfolio[category]],
},
}),
`${media.length} image(s) added to ${category}.`
);
};

const removePortfolioImage = async (category: Category, id: string) => {
await updateSite(
(current) => ({
...current,
portfolio: {
...current.portfolio,
[category]: current.portfolio[category].filter((img) => img.id !== id),
},
}),
"Portfolio image removed."
);
};

const clearPortfolioCategory = async (category: Category) => {
if (!window.confirm(`Clear ${category}?`)) return;

await updateSite(
(current) => ({
...current,
portfolio: {
...current.portfolio,
[category]: [],
},
}),
`${category} cleared.`
);
};

const addReviewPhotos = async (files: FileList | null) => {
const media = await filesToMedia(files);
if (!media.length) return;
setReviewPhotos((prev) => [...prev, ...media]);
setNotice(`${media.length} review photo(s) added.`);
};

const submitReview = async () => {
if (!reviewDraft.name.trim() || !reviewDraft.text.trim()) {
setNotice("Add review name and text.");
return;
}

const nextReview: ReviewItem = {
id: uid(),
name: reviewDraft.name.trim(),
rating: Number(reviewDraft.rating) || 5,
text: reviewDraft.text.trim(),
photos: reviewPhotos,
date: new Date().toLocaleString(),
};

const next = {
...site,
reviews: [nextReview, ...site.reviews],
};

setSite(next);
setReviewDraft({ name: "", rating: "5", text: "" });
setReviewPhotos([]);
await safePersist(next, "Review added.");
};

const deleteReview = async (id: string) => {
await updateSite(
(current) => ({
...current,
reviews: current.reviews.filter((item) => item.id !== id),
}),
"Review deleted."
);
};

const submitVisit = async () => {
if (!visitDraft.name.trim() || !visitDraft.phone.trim() || !visitDraft.address.trim()) {
setNotice("Visit form needs name, phone, and address.");
return;
}

const nextVisit: VisitItem = {
id: uid(),
...visitDraft,
date: new Date().toLocaleString(),
};

const next = {
...site,
visits: [nextVisit, ...site.visits],
};

setSite(next);
setVisitOpen(false);
setVisitDraft({
name: "",
email: "",
phone: "",
address: "",
jobType: "",
preferredTime: "",
details: "",
});

await safePersist(next, "Your visit has been requested.");
};

const deleteVisit = async (id: string) => {
await updateSite(
(current) => ({
...current,
visits: current.visits.filter((item) => item.id !== id),
}),
"Visit deleted."
);
};

const addPaymentProofs = async (files: FileList | null) => {
const media = await filesToMedia(files);
if (!media.length) return;
setPaymentProofs((prev) => [...prev, ...media]);
setNotice(`${media.length} payment proof(s) added.`);
};

const submitPayment = async () => {
if (!paymentDraft.amount.trim() || !paymentDraft.name.trim()) {
setNotice("Payment needs amount and name.");
return;
}

const nextPayment: PaymentItem = {
id: uid(),
...paymentDraft,
proofs: paymentProofs,
date: new Date().toLocaleString(),
};

const next = {
...site,
payments: [nextPayment, ...site.payments],
};

setSite(next);
setPaymentOpen(false);
setPaymentDraft({
amount: "",
name: "",
email: "",
notes: "",
});
setPaymentProofs([]);

await safePersist(next, "Payment submitted for review.");
};

const deletePayment = async (id: string) => {
await updateSite(
(current) => ({
...current,
payments: current.payments.filter((item) => item.id !== id),
}),
"Payment deleted."
);
};

const pageBackgroundStyle: CSSProperties = pageBgUrl
? {
backgroundImage: `url(${pageBgUrl})`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
}
: {
background:
"radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%), radial-gradient(circle at top right, rgba(34,197,94,0.14), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0))",
};

const heroBackgroundStyle: CSSProperties = heroBgUrl
? {
backgroundImage: `url(${heroBgUrl})`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
}
: {
background:
"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), radial-gradient(circle at top right, rgba(34,197,94,0.25), transparent 30%), radial-gradient(circle at bottom left, rgba(59,130,246,0.25), transparent 30%)",
};

const previewShellWidth =
device === "desktop"
? "w-full"
: device === "tablet"
? "mx-auto w-full max-w-[820px]"
: "mx-auto w-full max-w-[390px]";

if (!ready) {
return (
<div className="min-h-screen bg-black px-4 py-10 text-white md:px-8">
<Glass className="mx-auto max-w-xl p-6">Loading admin...</Glass>
</div>
);
}

if (!loggedIn) {
return (
<div className="min-h-screen bg-black text-white">
<div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
<div className="relative mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
<Glass className="w-full p-8">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Admin login</p>
<h1 className="mt-3 text-4xl font-black">Murillo site editor</h1>
<p className="mt-3 text-sm leading-7 text-white/65">
Enter the admin password to open the live editor.
</p>

<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
onKeyDown={(e) => {
if (e.key === "Enter") handleLogin();
}}
placeholder="Password"
className="mt-6 w-full rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
/>

{passwordError && <p className="mt-3 text-sm text-red-300">{passwordError}</p>}

<div className="mt-5 flex gap-3">
<button
type="button"
onClick={handleLogin}
className="rounded-full bg-white px-6 py-3 font-semibold text-black"
>
Open Admin
</button>
<button
type="button"
onClick={() => router.push("/")}
className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white/75"
>
Back Home
</button>
</div>

<p className="mt-5 text-xs text-white/40">
Password set in this file: murillo123
</p>
</Glass>
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

<div className="fixed inset-0 -z-30 bg-black" />
<div className="fixed inset-0 -z-20" style={pageBackgroundStyle} />
<div className="fixed inset-0 -z-10 bg-black/70" />
<div
className="fixed inset-0 -z-10"
style={{
background: `rgba(0,0,0,${Math.max(0.08, Math.min(0.85, site.backgroundBrightness))})`,
}}
/>

<header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-2xl">
<div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-8">
<div>
<p className="text-xs font-bold uppercase tracking-[0.28em] text-white/95">
{site.businessName}
</p>
<p className="mt-1 text-xs text-white/45">Live editor</p>
</div>

<div className="flex flex-wrap gap-2">
<TinyButton active={device === "desktop"} onClick={() => setDevice("desktop")}>
Desktop
</TinyButton>
<TinyButton active={device === "tablet"} onClick={() => setDevice("tablet")}>
Tablet
</TinyButton>
<TinyButton active={device === "mobile"} onClick={() => setDevice("mobile")}>
Mobile
</TinyButton>
<TinyButton onClick={() => setEditMode((v) => !v)}>
{editMode ? "Editing ON" : "Editing OFF"}
</TinyButton>
<TinyButton onClick={() => router.push("/")}>Open site</TinyButton>
<TinyButton onClick={logout}>Logout</TinyButton>
<button
type="button"
onClick={() => safePersist(site, "Saved.")}
className="rounded-full bg-white px-5 py-2 font-semibold text-black"
>
{saving ? "Saving..." : "Save"}
</button>
</div>
</div>
</header>

<main className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
{notice && (
<div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">
{notice}
</div>
)}

<div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
<div className="space-y-6">
<Glass className="p-5">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Studio</p>
<div className="mt-4 flex flex-wrap gap-2">
<TinyButton active={tab === "builder"} onClick={() => setTab("builder")}>
Builder
</TinyButton>
<TinyButton active={tab === "portfolio"} onClick={() => setTab("portfolio")}>
Portfolio
</TinyButton>
<TinyButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
Reviews
</TinyButton>
<TinyButton active={tab === "quotes"} onClick={() => setTab("quotes")}>
Quotes / Visits
</TinyButton>
<TinyButton active={tab === "payments"} onClick={() => setTab("payments")}>
Payments
</TinyButton>
<TinyButton active={tab === "settings"} onClick={() => setTab("settings")}>
Settings
</TinyButton>
</div>

<div className="mt-5 grid grid-cols-2 gap-2">
<button
type="button"
onClick={() => scrollToSection("hero")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
Hero
</button>
<button
type="button"
onClick={() => scrollToSection("services")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
Services
</button>
<button
type="button"
onClick={() => scrollToSection("portfolio")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
Portfolio
</button>
<button
type="button"
onClick={() => scrollToSection("reviews")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
Reviews
</button>
<button
type="button"
onClick={() => scrollToSection("about")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
About
</button>
<button
type="button"
onClick={() => scrollToSection("faq")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
FAQ
</button>
<button
type="button"
onClick={() => scrollToSection("quick")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
Quick actions
</button>
<button
type="button"
onClick={() => scrollToSection("contact")}
className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/75"
>
Contact
</button>
</div>
</Glass>

{tab === "builder" && (
<>
<Glass className="p-5">
<h2 className="text-2xl font-bold">Main text</h2>
<p className="mt-2 text-sm text-white/55">
These fields update the live website preview on the right.
</p>

<div className="mt-5 grid gap-4">
<input
value={site.businessName}
onChange={(e) => setSite({ ...site, businessName: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Business name"
/>
<input
value={site.heroBadge}
onChange={(e) => setSite({ ...site, heroBadge: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Hero badge"
/>
<input
value={site.heroTitleLine1}
onChange={(e) => setSite({ ...site, heroTitleLine1: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Hero line 1"
/>
<input
value={site.heroTitleLine2}
onChange={(e) => setSite({ ...site, heroTitleLine2: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Hero line 2"
/>
<textarea
value={site.heroSubtitle}
onChange={(e) => setSite({ ...site, heroSubtitle: e.target.value })}
className="min-h-28 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Hero subtitle"
/>

<input
value={site.phoneNumber}
onChange={(e) => setSite({ ...site, phoneNumber: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Phone number"
/>
<input
value={site.zelleContact}
onChange={(e) => setSite({ ...site, zelleContact: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Zelle contact"
/>
</div>

<div className="mt-5 flex flex-wrap gap-3">
<button
type="button"
onClick={() => safePersist(site, "Text saved.")}
className="rounded-full bg-white px-5 py-3 font-semibold text-black"
>
Save changes
</button>
</div>
</Glass>

<Glass className="p-5">
<h2 className="text-2xl font-bold">Section titles</h2>

<div className="mt-5 grid gap-4">
<input
value={site.servicesTitle}
onChange={(e) => setSite({ ...site, servicesTitle: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Services title"
/>
<textarea
value={site.servicesSubtitle}
onChange={(e) => setSite({ ...site, servicesSubtitle: e.target.value })}
className="min-h-24 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Services subtitle"
/>

<input
value={site.portfolioTitle}
onChange={(e) => setSite({ ...site, portfolioTitle: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Portfolio title"
/>
<textarea
value={site.portfolioSubtitle}
onChange={(e) => setSite({ ...site, portfolioSubtitle: e.target.value })}
className="min-h-24 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Portfolio subtitle"
/>

<input
value={site.reviewsTitle}
onChange={(e) => setSite({ ...site, reviewsTitle: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Reviews title"
/>
<textarea
value={site.reviewsSubtitle}
onChange={(e) => setSite({ ...site, reviewsSubtitle: e.target.value })}
className="min-h-24 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Reviews subtitle"
/>

<input
value={site.aboutTitle}
onChange={(e) => setSite({ ...site, aboutTitle: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="About title"
/>
<textarea
value={site.aboutSubtitle}
onChange={(e) => setSite({ ...site, aboutSubtitle: e.target.value })}
className="min-h-24 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="About subtitle"
/>

<input
value={site.faqTitle}
onChange={(e) => setSite({ ...site, faqTitle: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="FAQ title"
/>
<textarea
value={site.faqSubtitle}
onChange={(e) => setSite({ ...site, faqSubtitle: e.target.value })}
className="min-h-24 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="FAQ subtitle"
/>

<input
value={site.quickTitle}
onChange={(e) => setSite({ ...site, quickTitle: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Quick title"
/>
<textarea
value={site.quickSubtitle}
onChange={(e) => setSite({ ...site, quickSubtitle: e.target.value })}
className="min-h-24 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Quick subtitle"
/>
</div>

<div className="mt-5">
<button
type="button"
onClick={() => safePersist(site, "Section copy saved.")}
className="rounded-full bg-white px-5 py-3 font-semibold text-black"
>
Save section copy
</button>
</div>
</Glass>
</>
)}

{tab === "portfolio" && (
<Glass className="p-5">
<h2 className="text-2xl font-bold">Portfolio manager</h2>
<p className="mt-2 text-sm text-white/55">
Add as many images as you want. This is the full portfolio admin.
</p>

<div className="mt-5 flex flex-wrap gap-2">
{categories.map((category) => (
<TinyButton
key={category}
active={selectedCategory === category}
onClick={() => setSelectedCategory(category)}
>
{category}
</TinyButton>
))}
</div>

<div className="mt-5 rounded-[1.6rem] border border-white/10 bg-black/30 p-4">
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<h3 className="text-xl font-bold">{selectedCategory}</h3>
<p className="text-sm text-white/55">
{site.portfolio[selectedCategory].length} image
{site.portfolio[selectedCategory].length === 1 ? "" : "s"}
</p>
</div>

<div className="flex flex-wrap gap-2">
<label className="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 hover:bg-white/10">
Upload images
<input
type="file"
accept="image/*"
multiple
className="hidden"
onChange={(e) => addPortfolioImages(selectedCategory, e.target.files)}
/>
</label>

<button
type="button"
onClick={() => clearPortfolioCategory(selectedCategory)}
className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75"
>
Clear category
</button>
</div>
</div>

<div className="mt-4 grid gap-3 md:grid-cols-2">
{site.portfolio[selectedCategory].length === 0 ? (
<div className="rounded-[1.4rem] border border-dashed border-white/15 p-8 text-center text-sm text-white/50 md:col-span-2">
No photos in this category yet.
</div>
) : (
site.portfolio[selectedCategory].map((img) => (
<div
key={img.id}
className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5"
>
<MediaImage
item={img}
alt={img.name || selectedCategory}
className="h-48 w-full cursor-pointer object-cover"
onClick={() => setSelectedImage(img)}
/>
<div className="flex items-center justify-between gap-3 p-3">
<p className="truncate text-xs text-white/55">
{img.name || "portfolio-image"}
</p>
<button
type="button"
onClick={() => removePortfolioImage(selectedCategory, img.id)}
className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/75"
>
Delete
</button>
</div>
</div>
))
)}
</div>
</div>
</Glass>
)}

{tab === "reviews" && (
<Glass className="p-5">
<h2 className="text-2xl font-bold">Reviews</h2>
<p className="mt-2 text-sm text-white/55">
Add review text and review photos here.
</p>

<div className="mt-5 grid gap-4">
<input
value={reviewDraft.name}
onChange={(e) => setReviewDraft({ ...reviewDraft, name: e.target.value })}
placeholder="Customer name"
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
/>
<select
value={reviewDraft.rating}
onChange={(e) => setReviewDraft({ ...reviewDraft, rating: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
>
<option value="5">5 stars</option>
<option value="4">4 stars</option>
<option value="3">3 stars</option>
<option value="2">2 stars</option>
<option value="1">1 star</option>
</select>
<textarea
value={reviewDraft.text}
onChange={(e) => setReviewDraft({ ...reviewDraft, text: e.target.value })}
placeholder="Review text"
className="min-h-32 rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
/>
</div>

<div className="mt-4 flex flex-wrap gap-3">
<label className="cursor-pointer rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 hover:bg-white/10">
Add review photos
<input
type="file"
accept="image/*"
multiple
className="hidden"
onChange={(e) => addReviewPhotos(e.target.files)}
/>
</label>

<button
type="button"
onClick={submitReview}
className="rounded-full bg-white px-5 py-3 font-semibold text-black"
>
Add review
</button>
</div>

{reviewPhotos.length > 0 && (
<div className="mt-4 flex flex-wrap gap-2">
{reviewPhotos.map((img) => (
<div key={img.id} className="overflow-hidden rounded-xl border border-white/10">
<MediaImage item={img} className="h-16 w-16 object-cover" />
</div>
))}
</div>
)}

<div className="mt-6 space-y-4">
{site.reviews.length === 0 ? (
<p className="text-sm text-white/55">No reviews yet.</p>
) : (
site.reviews.map((review) => (
<div key={review.id} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
<div className="flex items-center justify-between gap-3">
<div>
<p className="font-semibold">{review.name}</p>
<p className="text-xs text-white/45">{review.date}</p>
</div>
<StarRow rating={review.rating} />
</div>

<p className="mt-3 text-sm leading-7 text-white/70">{review.text}</p>

{review.photos.length > 0 && (
<div className="mt-4 flex flex-wrap gap-2">
{review.photos.map((photo) => (
<div key={photo.id} className="overflow-hidden rounded-xl border border-white/10">
<MediaImage
item={photo}
className="h-16 w-16 cursor-pointer object-cover"
onClick={() => setSelectedImage(photo)}
/>
</div>
))}
</div>
)}

<button
type="button"
onClick={() => deleteReview(review.id)}
className="mt-4 rounded-full border border-white/10 px-4 py-2 text-sm text-white/75"
>
Delete
</button>
</div>
))
)}
</div>
</Glass>
)}

{tab === "quotes" && (
<Glass className="p-5">
<h2 className="text-2xl font-bold">Quotes / visit requests</h2>
<p className="mt-2 text-sm text-white/55">
All submitted site visit requests show here.
</p>

<div className="mt-5 flex gap-3">
<button
type="button"
onClick={() => setVisitOpen(true)}
className="rounded-full bg-white px-5 py-3 font-semibold text-black"
>
Open visit form
</button>
</div>

<div className="mt-6 space-y-4">
{site.visits.length === 0 ? (
<p className="text-sm text-white/55">No visit requests yet.</p>
) : (
site.visits.map((item) => (
<div key={item.id} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
<div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
<div>
<p className="text-lg font-semibold">{item.name}</p>
<p className="text-sm text-white/55">{item.email}</p>
<p className="text-sm text-white/55">{item.phone}</p>
</div>
<p className="text-xs text-white/45">{item.date}</p>
</div>

<div className="mt-4 grid gap-2 text-sm text-white/75">
<p><span className="text-white/45">Address:</span> {item.address || "—"}</p>
<p><span className="text-white/45">Job type:</span> {item.jobType || "—"}</p>
<p><span className="text-white/45">Preferred time:</span> {item.preferredTime || "—"}</p>
<p><span className="text-white/45">Details:</span> {item.details || "—"}</p>
</div>

<button
type="button"
onClick={() => deleteVisit(item.id)}
className="mt-4 rounded-full border border-white/10 px-4 py-2 text-sm text-white/75"
>
Delete
</button>
</div>
))
)}
</div>
</Glass>
)}

{tab === "payments" && (
<Glass className="p-5">
<h2 className="text-2xl font-bold">Payments</h2>
<p className="mt-2 text-sm text-white/55">
Payment review submissions show here with screenshots.
</p>

<div className="mt-5 flex gap-3">
<button
type="button"
onClick={() => setPaymentOpen(true)}
className="rounded-full bg-white px-5 py-3 font-semibold text-black"
>
Open payment panel
</button>
</div>

<div className="mt-6 space-y-4">
{site.payments.length === 0 ? (
<p className="text-sm text-white/55">No payments yet.</p>
) : (
site.payments.map((item) => (
<div key={item.id} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
<div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
<div>
<p className="text-lg font-semibold">${item.amount}</p>
<p className="text-sm text-white/55">{item.name}</p>
<p className="text-sm text-white/55">{item.email}</p>
</div>
<p className="text-xs text-white/45">{item.date}</p>
</div>

<p className="mt-3 text-sm text-white/75">
<span className="text-white/45">Notes:</span> {item.notes || "—"}
</p>

{item.proofs.length > 0 && (
<div className="mt-4 flex flex-wrap gap-2">
{item.proofs.map((photo) => (
<div key={photo.id} className="overflow-hidden rounded-xl border border-white/10">
<MediaImage
item={photo}
className="h-16 w-16 cursor-pointer object-cover"
onClick={() => setSelectedImage(photo)}
/>
</div>
))}
</div>
)}

<button
type="button"
onClick={() => deletePayment(item.id)}
className="mt-4 rounded-full border border-white/10 px-4 py-2 text-sm text-white/75"
>
Delete
</button>
</div>
))
)}
</div>
</Glass>
)}

{tab === "settings" && (
<>
<Glass className="p-5">
<h2 className="text-2xl font-bold">Background images</h2>

<div className="mt-5 grid gap-4">
<label className="cursor-pointer rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/75 hover:bg-white/10">
Upload whole website background
<input
type="file"
accept="image/*"
className="hidden"
onChange={(e) => uploadBackground(e.target.files?.[0] || null)}
/>
</label>

<label className="cursor-pointer rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/75 hover:bg-white/10">
Upload hero section background
<input
type="file"
accept="image/*"
className="hidden"
onChange={(e) => uploadHeroSectionBackground(e.target.files?.[0] || null)}
/>
</label>

<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
<p className="text-sm text-white/65">
Website background brightness: {site.backgroundBrightness.toFixed(2)}
</p>
<input
type="range"
min="0"
max="1"
step="0.01"
value={site.backgroundBrightness}
onChange={(e) =>
setSite({ ...site, backgroundBrightness: Number(e.target.value) })
}
className="mt-3 w-full"
/>
</div>

<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
<p className="text-sm text-white/65">
Hero section overlay: {site.heroSectionOverlay.toFixed(2)}
</p>
<input
type="range"
min="0"
max="1"
step="0.01"
value={site.heroSectionOverlay}
onChange={(e) =>
setSite({ ...site, heroSectionOverlay: Number(e.target.value) })
}
className="mt-3 w-full"
/>
</div>
</div>

<div className="mt-5">
<button
type="button"
onClick={() => safePersist(site, "Background settings saved.")}
className="rounded-full bg-white px-5 py-3 font-semibold text-black"
>
Save background settings
</button>
</div>
</Glass>

<Glass className="p-5">
<h2 className="text-2xl font-bold">Backup / restore</h2>
<div className="mt-5 flex flex-wrap gap-3">
<button
type="button"
onClick={exportBackup}
className="rounded-full bg-white px-5 py-3 font-semibold text-black"
>
Export backup
</button>

<label className="cursor-pointer rounded-full border border-white/10 px-5 py-3 font-semibold text-white/75 hover:bg-white/10">
Import backup
<input
type="file"
accept="application/json"
className="hidden"
onChange={(e) => importBackup(e.target.files?.[0] || null)}
/>
</label>

<button
type="button"
onClick={resetEverything}
className="rounded-full border border-red-400/30 px-5 py-3 font-semibold text-red-300"
>
Reset everything
</button>
</div>
</Glass>
</>
)}
</div>

<Glass className="overflow-hidden p-4 md:p-5">
<div className="mb-4 flex items-center justify-between gap-3">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Live website preview</p>
<p className="mt-1 text-sm text-white/55">
Click text when editing is on. Preview updates like a live builder.
</p>
</div>
<div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65">
{device}
</div>
</div>

<div className="max-h-[84vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-black/40">
<div className={`${previewShellWidth} relative min-h-[2200px]`}>
<div className="absolute inset-0" style={pageBackgroundStyle} />
<div className="absolute inset-0 bg-black/68" />
<div
className="absolute inset-0"
style={{
background: `rgba(0,0,0,${Math.max(0.08, Math.min(0.85, site.backgroundBrightness))})`,
}}
/>

<div className="relative">
<header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur-xl">
<div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
<EditableText
value={site.businessName}
onChange={(value) => setSite({ ...site, businessName: value })}
editMode={editMode}
as="div"
className="text-xs font-bold uppercase tracking-[0.25em] text-white/90"
/>

<nav className="flex flex-wrap items-center gap-3 text-xs md:gap-5 md:text-sm">
<button
type="button"
onClick={() => scrollToSection("portfolio")}
className="text-white/80"
>
View Portfolio
</button>
<button
type="button"
onClick={() => scrollToSection("reviews")}
className="text-white/80"
>
Reviews
</button>
<button
type="button"
onClick={() => setVisitOpen(true)}
className="text-white/80"
>
Request Visit
</button>
<button
type="button"
onClick={() => setPaymentOpen(true)}
className="rounded-full border border-white/10 px-4 py-2 text-white/80"
>
Make Payment
</button>
<a href={`tel:${site.phoneNumber}`}>
<button
type="button"
className="rounded-full bg-white px-4 py-2 font-semibold text-black"
>
Call Now
</button>
</a>
</nav>
</div>
</header>

<main className="px-4 pb-20 pt-6 md:px-8">
<section
ref={(node) => {
sectionRefs.current.hero = node;
}}
className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]"
>
<Glass className="relative overflow-hidden p-6 md:p-8">
<div className="absolute inset-0" style={heroBackgroundStyle} />
<div
className="absolute inset-0"
style={{
background: `rgba(0,0,0,${Math.max(0.05, Math.min(0.88, site.heroSectionOverlay))})`,
}}
/>
<div className="relative">
<EditableText
value={site.heroBadge}
onChange={(value) => setSite({ ...site, heroBadge: value })}
editMode={editMode}
as="p"
className="text-xs uppercase tracking-[0.35em] text-white/55"
/>

<div className="mt-4 text-5xl font-black leading-[0.95] md:text-7xl">
<EditableText
value={site.heroTitleLine1}
onChange={(value) => setSite({ ...site, heroTitleLine1: value })}
editMode={editMode}
as="div"
className="block"
/>
<EditableText
value={site.heroTitleLine2}
onChange={(value) => setSite({ ...site, heroTitleLine2: value })}
editMode={editMode}
as="div"
className="block text-blue-500"
/>
</div>

<EditableText
value={site.heroSubtitle}
onChange={(value) => setSite({ ...site, heroSubtitle: value })}
editMode={editMode}
as="p"
className="mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base"
/>

<div className="mt-8 flex flex-wrap gap-3">
<button
type="button"
onClick={() => setVisitOpen(true)}
className="rounded-full bg-white px-6 py-3 font-semibold text-black"
>
Request Visit
</button>
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white"
>
View Portfolio
</button>
<button
type="button"
onClick={() => setPaymentOpen(true)}
className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white"
>
Make Payment
</button>
</div>

<div className="mt-8 flex flex-wrap gap-5 text-sm text-white/60">
<EditableText
value={site.stat3}
onChange={(value) => setSite({ ...site, stat3: value })}
editMode={editMode}
as="span"
/>
<span>Quality craftsmanship</span>
<EditableText
value={site.stat4}
onChange={(value) => setSite({ ...site, stat4: value })}
editMode={editMode}
as="span"
/>
</div>
</div>
</Glass>

<div className="grid gap-4">
<Glass className="p-6">
<p className="text-xs uppercase tracking-[0.3em] text-white/45">Start here</p>
<h2 className="mt-3 text-3xl font-black leading-tight">
Quote, visit, or pay in one place.
</h2>
<p className="mt-3 text-sm leading-7 text-white/70">
Customers can send a message, upload pictures, book a site visit,
leave a review, or submit payment proof.
</p>

<div className="mt-5 grid grid-cols-2 gap-3">
{heroPreviewImages.length > 0 ? (
heroPreviewImages.map((image) => (
<div
key={image.id}
className="overflow-hidden rounded-[1.4rem] border border-white/10"
>
<MediaImage
item={image}
className="h-32 w-full object-cover"
onClick={() => setSelectedImage(image)}
/>
</div>
))
) : (
<>
<div className="rounded-[1.4rem] border border-dashed border-white/15 bg-black/20 p-6 text-center text-xs text-white/45">
Hero preview image 1
</div>
<div className="rounded-[1.4rem] border border-dashed border-white/15 bg-black/20 p-6 text-center text-xs text-white/45">
Hero preview image 2
</div>
</>
)}
</div>

<div className="mt-5 flex flex-wrap gap-3">
<button
type="button"
onClick={() => router.push("/portfolio")}
className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
>
View Portfolio
</button>
<button
type="button"
onClick={() => setVisitOpen(true)}
className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white"
>
Request Visit
</button>
</div>
</Glass>

<div className="grid grid-cols-2 gap-4">
<Glass className="p-5">
<EditableText
value={site.stat1}
onChange={(value) => setSite({ ...site, stat1: value })}
editMode={editMode}
as="p"
className="text-3xl font-black text-blue-500"
/>
<p className="mt-1 text-sm text-white/60">projects</p>
</Glass>
<Glass className="p-5">
<EditableText
value={site.stat2}
onChange={(value) => setSite({ ...site, stat2: value })}
editMode={editMode}
as="p"
className="text-3xl font-black text-blue-500"
/>
<p className="mt-1 text-sm text-white/60">service</p>
</Glass>
</div>

<Glass className="p-5">
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
<p className="text-xs uppercase tracking-[0.3em] text-white/45">
Action flow
</p>
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
</Glass>
</div>
</section>

<section className="mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-300 px-5 py-10 text-black md:px-8 md:py-14">
<div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
<div>
<p className="text-xs uppercase tracking-[0.35em] text-black/60">
Ready to start
</p>
<h2 className="mt-3 max-w-3xl text-4xl font-black md:text-6xl">
Book a visit, get a quote, or make a payment.
</h2>
<p className="mt-3 max-w-2xl text-sm leading-6 text-black/75">
Use the buttons above to keep the customer flow fast and clean.
</p>
</div>

<div className="flex flex-wrap gap-3">
<button
type="button"
onClick={() => setVisitOpen(true)}
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
onClick={() => setPaymentOpen(true)}
className="rounded-full border border-black/15 px-6 py-3 font-semibold text-black"
>
Make Payment
</button>
</div>
</div>
</section>

<section
ref={(node) => {
sectionRefs.current.services = node;
}}
className="mt-10"
>
<SectionHeading
eyebrow="Services"
title={site.servicesTitle}
text={site.servicesSubtitle}
/>

<div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
{services.map((service) => (
<Glass key={service.title} className="p-6">
<div className="flex items-center justify-between gap-3">
<h3 className="text-xl font-bold">{service.title}</h3>
<span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
Premium
</span>
</div>
<p className="mt-4 text-sm leading-7 text-white/68">{service.text}</p>
</Glass>
))}
</div>
</section>

<section
ref={(node) => {
sectionRefs.current.portfolio = node;
}}
className="mt-16"
>
<div className="flex items-end justify-between gap-4">
<SectionHeading
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
{portfolioPreviewCards.map((card) => (
<Glass key={card.title} className="overflow-hidden">
{card.image ? (
<MediaImage
item={card.image}
className="h-56 w-full object-cover"
onClick={() => setSelectedImage(card.image!)}
/>
) : (
<div className="h-56 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03)),radial-gradient(circle_at_top_right,rgba(34,197,94,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_35%)]" />
)}

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
onClick={() => setVisitOpen(true)}
className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white"
>
Request Visit
</button>
</div>
</div>
</Glass>
))}
</div>
</section>

<section
ref={(node) => {
sectionRefs.current.reviews = node;
}}
className="mt-16"
>
<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
<SectionHeading
eyebrow="Reviews"
title={site.reviewsTitle}
text={site.reviewsSubtitle}
/>
<div className="text-sm text-white/60">Average rating: 5.0/5</div>
</div>

<div className="mt-10 grid gap-5 md:grid-cols-3">
{site.reviews.length === 0 ? (
<Glass className="p-6 md:col-span-3">No reviews yet.</Glass>
) : (
site.reviews.slice(0, 3).map((review) => (
<Glass key={review.id} className="p-6">
<div className="flex items-center justify-between gap-4">
<p className="font-semibold">{review.name}</p>
<StarRow rating={review.rating} />
</div>
<p className="mt-4 text-sm leading-7 text-white/75">“{review.text}”</p>

{review.photos.length > 0 && (
<div className="mt-4 grid grid-cols-2 gap-3">
{review.photos.map((photo) => (
<div
key={photo.id}
className="overflow-hidden rounded-2xl border border-white/10"
>
<MediaImage
item={photo}
className="h-28 w-full cursor-pointer object-cover"
onClick={() => setSelectedImage(photo)}
/>
</div>
))}
</div>
)}
</Glass>
))
)}
</div>

<Glass className="mt-10 p-6">
<h3 className="text-2xl font-bold">Leave a review</h3>
<p className="mt-2 text-sm text-white/60">
Reviews can include photos from the job.
</p>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<input
value={reviewDraft.name}
onChange={(e) => setReviewDraft({ ...reviewDraft, name: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Your name"
/>
<select
value={reviewDraft.rating}
onChange={(e) => setReviewDraft({ ...reviewDraft, rating: e.target.value })}
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
value={reviewDraft.text}
onChange={(e) => setReviewDraft({ ...reviewDraft, text: e.target.value })}
className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Write your review..."
/>

<div className="mt-4 flex flex-wrap items-center gap-3">
<label className="cursor-pointer rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 hover:bg-white/10">
Add review photos
<input
type="file"
multiple
accept="image/*"
className="hidden"
onChange={(e) => addReviewPhotos(e.target.files)}
/>
</label>

<button
type="button"
onClick={submitReview}
className="rounded-full bg-white px-6 py-3 font-semibold text-black"
>
Post Review
</button>
</div>
</Glass>
</section>

<section
ref={(node) => {
sectionRefs.current.about = node;
}}
className="mt-16"
>
<div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
<Glass className="p-8 md:p-10">
<EditableText
value={site.aboutTitle}
onChange={(value) => setSite({ ...site, aboutTitle: value })}
editMode={editMode}
as="h2"
className="text-4xl font-black leading-tight md:text-6xl"
/>
<EditableText
value={site.aboutSubtitle}
onChange={(value) => setSite({ ...site, aboutSubtitle: value })}
editMode={editMode}
as="p"
className="mt-4 text-sm leading-7 text-white/65"
/>

<div className="mt-8 flex flex-wrap gap-3">
<button
type="button"
onClick={() => setVisitOpen(true)}
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
</Glass>

<Glass className="p-8">
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
</Glass>
</div>
</section>

<section
ref={(node) => {
sectionRefs.current.faq = node;
}}
className="mt-16"
>
<SectionHeading
eyebrow="FAQ"
title={site.faqTitle}
text={site.faqSubtitle}
/>
<div className="mt-10 grid gap-4 md:grid-cols-2">
{faqItems.map((item) => (
<Glass key={item.q} className="p-6">
<h3 className="text-lg font-bold">{item.q}</h3>
<p className="mt-3 text-sm leading-7 text-white/68">{item.a}</p>
</Glass>
))}
</div>
</section>

<section
ref={(node) => {
sectionRefs.current.quick = node;
}}
className="mt-16"
>
<div className="mx-auto max-w-4xl">
<div className="text-center">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Contact</p>
<EditableText
value={site.quickTitle}
onChange={(value) => setSite({ ...site, quickTitle: value })}
editMode={editMode}
as="h2"
className="mt-3 text-4xl font-black md:text-6xl"
/>
<EditableText
value={site.quickSubtitle}
onChange={(value) => setSite({ ...site, quickSubtitle: value })}
editMode={editMode}
as="p"
className="mt-4 text-sm leading-7 text-white/65"
/>
</div>

<div className="mt-10 grid gap-4 md:grid-cols-3">
<button
type="button"
onClick={() => setVisitOpen(true)}
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
onClick={() => setPaymentOpen(true)}
className="rounded-[1.6rem] border border-white/10 bg-white/5 px-6 py-7 text-left font-semibold text-white"
>
Make Payment
</button>
</div>
</div>
</section>

<section
ref={(node) => {
sectionRefs.current.contact = node;
}}
className="mt-16"
>
<SectionHeading
eyebrow={site.contactTitle}
title="Contact details"
text={site.contactSubtitle}
/>

<div className="mt-8 grid gap-4 md:grid-cols-3">
<Glass className="p-5">
<p className="font-semibold">Call Now</p>
<p className="mt-2 text-sm text-white/65">{site.phoneNumber}</p>
</Glass>
<Glass className="p-5">
<p className="font-semibold">Zelle</p>
<p className="mt-2 text-sm text-white/65">{site.zelleContact}</p>
</Glass>
<Glass className="p-5">
<p className="font-semibold">Business</p>
<p className="mt-2 text-sm text-white/65">{site.businessName}</p>
</Glass>
</div>
</section>
</main>

<a href={`tel:${site.phoneNumber}`}>
<div className="fixed bottom-6 right-6 z-40 rounded-full bg-white px-5 py-3 font-semibold text-black shadow-xl">
📞 Call
</div>
</a>
</div>
</div>
</div>

<div className="mt-4 grid gap-4 md:grid-cols-3">
<Glass className="p-5">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Reviews</p>
<p className="mt-2 text-3xl font-black">{site.reviews.length}</p>
</Glass>
<Glass className="p-5">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Visits</p>
<p className="mt-2 text-3xl font-black">{site.visits.length}</p>
</Glass>
<Glass className="p-5">
<p className="text-xs uppercase tracking-[0.35em] text-white/45">Payments</p>
<p className="mt-2 text-3xl font-black">{site.payments.length}</p>
</Glass>
</div>
</Glass>
</div>
</main>

<Modal open={visitOpen} title="Request Visit" onClose={() => setVisitOpen(false)}>
<h3 className="mt-3 text-3xl font-black">Book a site visit</h3>
<p className="mt-3 text-sm text-white/60">
Fill this out so we can come check the job and schedule the next step.
</p>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<input
value={visitDraft.name}
onChange={(e) => setVisitDraft({ ...visitDraft, name: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Full name"
/>
<input
value={visitDraft.email}
onChange={(e) => setVisitDraft({ ...visitDraft, email: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Email"
/>
<input
value={visitDraft.phone}
onChange={(e) => setVisitDraft({ ...visitDraft, phone: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Phone number"
/>
<input
value={visitDraft.address}
onChange={(e) => setVisitDraft({ ...visitDraft, address: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Project address"
/>
<input
value={visitDraft.jobType}
onChange={(e) => setVisitDraft({ ...visitDraft, jobType: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Job type"
/>
<input
value={visitDraft.preferredTime}
onChange={(e) => setVisitDraft({ ...visitDraft, preferredTime: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Preferred day / time"
/>
</div>

<textarea
value={visitDraft.details}
onChange={(e) => setVisitDraft({ ...visitDraft, details: e.target.value })}
className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Tell us what you need done..."
/>

<div className="mt-6 flex flex-wrap gap-3">
<button
type="button"
onClick={submitVisit}
className="rounded-full bg-white px-6 py-3 font-semibold text-black"
>
Submit Request
</button>
</div>
</Modal>

<Modal open={paymentOpen} title="Make Payment" onClose={() => setPaymentOpen(false)}>
<h3 className="mt-3 text-3xl font-black">Zelle payment</h3>
<p className="mt-3 text-sm text-white/60">
Send your payment to the contact below, upload proof, and we will review it.
</p>

<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
<span className="text-white/45">Zelle contact:</span> {site.zelleContact}
</div>

<div className="mt-6 grid gap-4 md:grid-cols-2">
<input
value={paymentDraft.amount}
onChange={(e) => setPaymentDraft({ ...paymentDraft, amount: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Amount owed"
/>
<input
value={paymentDraft.name}
onChange={(e) => setPaymentDraft({ ...paymentDraft, name: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Your name"
/>
<input
value={paymentDraft.email}
onChange={(e) => setPaymentDraft({ ...paymentDraft, email: e.target.value })}
className="rounded-2xl border border-white/10 bg-black/40 p-4 outline-none md:col-span-2"
placeholder="Your email"
/>
</div>

<textarea
value={paymentDraft.notes}
onChange={(e) => setPaymentDraft({ ...paymentDraft, notes: e.target.value })}
className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-black/40 p-4 outline-none"
placeholder="Extra notes"
/>

<div className="mt-4 flex flex-wrap items-center gap-3">
<label className="cursor-pointer rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 hover:bg-white/10">
Upload payment proof
<input
type="file"
multiple
accept="image/*"
className="hidden"
onChange={(e) => addPaymentProofs(e.target.files)}
/>
</label>

<button
type="button"
onClick={submitPayment}
className="rounded-full bg-white px-6 py-3 font-semibold text-black"
>
Submit Payment
</button>
</div>

{paymentProofs.length > 0 && (
<div className="mt-4 flex flex-wrap gap-2">
{paymentProofs.map((img) => (
<div key={img.id} className="overflow-hidden rounded-xl border border-white/10">
<MediaImage item={img} className="h-16 w-16 object-cover" />
</div>
))}
</div>
)}
</Modal>

{selectedImage && selectedImageUrl && (
<button
type="button"
onClick={() => setSelectedImage(null)}
className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-5"
>
<img
src={selectedImageUrl}
alt={selectedImage.name || "preview"}
className="max-h-[90vh] max-w-[95vw] rounded-3xl shadow-2xl"
/>
</button>
)}
</div>
);
}
