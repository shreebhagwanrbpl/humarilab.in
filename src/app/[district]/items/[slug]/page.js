import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductDetails from "../../../items/[slug]/ProductDetails";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProductBySlug(slug) {
    try {
        const allProducts = await fetchFullCatalog();
        return allProducts.find((p) => p.slug === slug) || null;
    } catch (e) {
        console.error("Error finding district product by slug:", e);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug, district } = await params;
    const product = await getProductBySlug(slug);

    const fallbackName = slug
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase());

    const productName = product?.title || fallbackName;
    const districtName = district
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase());

    const title = `${productName} Supplier in ${districtName} | Price, Dealer & Distributor | Raj Biosis`;
    const description = `Looking for ${productName} in ${districtName}? Raj Biosis is a trusted supplier, dealer, and distributor of ${productName} for diagnostic centers and laboratories in ${districtName}, India. Contact us for quotations.`;

    const canonicalUrl = `https://humarilab.in/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} Supplier ${districtName}`,
            `${productName} Dealer ${districtName}`,
            `${productName} Distributor ${districtName}`,
            `${productName} Price ${districtName}`,
            `Biomedical Equipment ${districtName}`,
            `Diagnostic Equipment ${districtName}`,
            `Laboratory Equipment ${districtName}`,
            "Raj Biosis",
        ],

        alternates: {
            canonical: canonicalUrl,
        },

        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: "Raj Biosis",
            type: "website",
            locale: "en_IN",
            images: product?.image || product?.images?.[0] ? [
                {
                    url: product.image || product.images[0],
                    width: 800,
                    height: 600,
                    alt: `${productName} in ${districtName}`,
                }
            ] : [
                {
                    url: "/logo.png",
                    width: 1200,
                    height: 630,
                    alt: "Raj Biosis",
                }
            ]
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product?.image || product?.images?.[0] ? [product.image || product.images[0]] : ["/logo.png"],
        },

        robots: {
            index: true,
            follow: true,
        },

        metadataBase: new URL("https://humarilab.in"),
    };
}

export default async function Page({ params }) {
    const { slug, district } = await params;

    return (
        <ProductDetails
            slug={slug}
            district={district}
        />
    );
}