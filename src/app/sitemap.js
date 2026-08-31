import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
} from "firebase/firestore";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

export default async function sitemap() {
    const baseUrl = "https://humarilab.in";

    const urls = [];
    const addedUrls = new Set();

    const addUrl = (url, changefreq = "daily", priority = 0.7) => {
        if (!addedUrls.has(url)) {
            addedUrls.add(url);
            urls.push({
                url,
                lastModified: new Date(),
                changeFrequency: changefreq,
                priority,
            });
        }
    };

    // Static Pages
    addUrl(baseUrl, "daily", 1.0);
    addUrl(`${baseUrl}/about`, "monthly", 0.6);
    addUrl(`${baseUrl}/services`, "weekly", 0.7);
    addUrl(`${baseUrl}/contact`, "monthly", 0.6);
    addUrl(`${baseUrl}/items`, "daily", 0.8);

    try {
        // DISTRICTS
        const districtSnap = await getDocs(
            collection(
                db,
                "websites",
                "humarilabin",
                "districts"
            )
        );

        const districts = districtSnap.docs.map((doc) => doc.data());

        districts.forEach((district) => {
            const slug = district.slug;
            if (!slug) return;

            addUrl(`${baseUrl}/${slug}`, "daily", 0.8);
            addUrl(`${baseUrl}/${slug}/items`, "daily", 0.7);
        });

        // PRODUCTS & CATEGORIES & BRANDS
        const products = await fetchFullCatalog();

        const categories = new Set();
        const brands = new Set();

        products.forEach((product) => {
            if (product.slug) {
                // Main Product URL
                addUrl(`${baseUrl}/items/${product.slug}`, "weekly", 0.8);
            }
            if (product.category) {
                categories.add(product.category);
            }
            if (product.brand) {
                brands.add(product.brand);
            }
        });

        // Add Category sitemap entries (primary and intent alias categories)
        categories.forEach((cat) => {
            const slug = makeSlug(cat);
            if (!slug) return;
            addUrl(`${baseUrl}/category/${slug}`, "weekly", 0.8);
            addUrl(`${baseUrl}/laboratory-equipment/${slug}`, "weekly", 0.7);
            addUrl(`${baseUrl}/diagnostic-equipment/${slug}`, "weekly", 0.7);
            addUrl(`${baseUrl}/biomedical-equipment/${slug}`, "weekly", 0.7);
        });

        // Add Brand sitemap entries
        brands.forEach((br) => {
            const slug = makeSlug(br);
            if (!slug) return;
            addUrl(`${baseUrl}/brand/${slug}`, "weekly", 0.8);
        });

    } catch (error) {
        console.error("Sitemap Error:", error);
    }

    return urls;
}