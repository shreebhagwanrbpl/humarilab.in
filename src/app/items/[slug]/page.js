import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductDetails from "./ProductDetails";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProductBySlug(slug) {
    try {
        const allProducts = await fetchFullCatalog();
        return allProducts.find((p) => p.slug === slug) || null;
    } catch (e) {
        console.error("Error finding product by slug:", e);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    const fallbackName = slug
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase());

    const productName = product?.title || fallbackName;
    const productDesc = product?.desc || product?.description || `Buy ${productName} at best price in India from Raj Biosis. Trusted biomedical and diagnostic equipment supplier.`;

    const title = `${productName} Supplier in India | Price, Dealer & Distributor | Raj Biosis`;
    const description = `${productDesc.substring(0, 150)}... Contact Raj Biosis for latest quotation and product details.`;

    const url = `https://humarilab.in/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} Supplier`,
            `${productName} Dealer`,
            `${productName} Distributor`,
            `Buy ${productName}`,
            `${productName} Price`,
            `${productName} Price in India`,
            `${productName} Supplier in India`,
            "Biomedical Equipment",
            "Medical Equipment",
            "Laboratory Equipment",
            "Diagnostic Equipment",
            "Hospital Equipment",
            "Healthcare Equipment",
            "Raj Biosis",
        ],

        alternates: {
            canonical: url,
        },

        openGraph: {
            title,
            description,
            url,
            siteName: "Raj Biosis",
            type: "website",
            locale: "en_IN",
            images: product?.image || product?.images?.[0] ? [
                {
                    url: product.image || product.images[0],
                    width: 800,
                    height: 600,
                    alt: productName,
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
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },

        metadataBase: new URL("https://humarilab.in"),
    };
}

export default async function Page({ params }) {
    const { slug } = await params;

    return <ProductDetails slug={slug} />;
}