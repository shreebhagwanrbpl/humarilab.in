import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductCard from "@/components/ProductCard";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

// Get category content details to fulfill Phase 7 (helpful content, specifications, related details)
function getCategoryInfo(categoryName) {
    const defaultInfo = {
        about: `We supply a comprehensive range of high-precision ${categoryName} designed for hospitals, diagnostic centers, and pathology laboratories. Our selection prioritizes reliability, accuracy, and ease of use to ensure consistent clinical diagnostics.`,
        usage: `Healthcare facilities utilize ${categoryName} to perform critical patient diagnostics, analyze samples, and run regular screenings. These systems are foundational to modern medical operations and testing.`,
        specs: `Standard parameters include robust construction, digital display interfaces, high sample throughput capacities, and compatibility with standard reagent systems.`,
        considerations: `When choosing a system, consider throughput capacity, parameters menu, software ease-of-use, maintenance frequency, and compatibility with your existing laboratory information management systems (LIMS).`
    };

    const details = {
        "electrolyte-reagents": {
            about: "Electrolyte reagents are essential formulations used in diagnostic systems to measure key mineral levels (such as sodium, potassium, calcium, and chloride) in patient blood or urine samples. They are critical for monitoring metabolic health and organ function.",
            usage: "Pathology labs and critical care units use these reagents in conjunction with electrolyte analyzers to detect electrolyte imbalances, manage kidney disorders, monitor dehydration, and track cardiovascular patients.",
            specs: "Formulated for high precision and stability. Standard packs are compatible with automated analyzers (such as Roche, ERBA, and Abbott systems) with secure calibration parameters.",
            considerations: "Verify pack size compatibility, shelf life stability, calibration frequency, and compatibility with your specific analyzer model before sourcing reagents."
        },
        "rapid-test-kits": {
            about: "Rapid test kits provide fast, qualitative results for various medical conditions, infectious diseases, and physiological markers. They offer immediate screening capabilities without requiring large, heavy laboratory instrumentation.",
            usage: "Used in point-of-care testing (POCT), emergency clinics, outpatient departments, and community health centers for quick diagnostics of conditions like Dengue, COVID-19, Malaria, and cardiac markers.",
            specs: "High sensitivity and specificity, rapid visual or reader-based readings within 10-15 minutes, long room-temperature shelf life, and complete testing accessories included.",
            considerations: "Ensure kit verification certifications, evaluate sensitivity/specificity ratios, and verify storage temperature conditions to maintain testing accuracy."
        },
        "hematology": {
            about: "Hematology analyzers and reagents are used to conduct complete blood count (CBC) tests, evaluating red blood cells, white blood cells, platelets, and hemoglobin levels to assess overall health.",
            usage: "Standard in almost every diagnostic laboratory and clinic, these systems help identify anemia, leukemia, viral infections, and blood clotting issues.",
            specs: "Support 3-part or 5-part differentials, variable throughput ranges (30 to 60+ samples per hour), small sample volume requirements, and digital display histograms.",
            considerations: "Consider daily test volume (throughput needs), 3-part vs 5-part requirements, running reagent cost per test, and local service support availability."
        }
    };

    const slug = makeSlug(categoryName);
    return details[slug] || defaultInfo;
}

export async function generateStaticParams() {
    try {
        const products = await fetchFullCatalog();
        const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
        return categories.map((cat) => ({
            slug: makeSlug(cat),
        }));
    } catch (e) {
        console.error("Error in generateStaticParams for category page:", e);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const products = await fetchFullCatalog();
    
    // Find category matching slug
    const categoryName = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
        .find((cat) => makeSlug(cat) === slug);

    if (!categoryName) {
        return {
            title: "Category Not Found | Raj Biosis",
        };
    }

    const title = `${categoryName} Supplier in India | Price & Specifications | Raj Biosis`;
    const description = `Looking for premium ${categoryName}? Raj Biosis is a trusted supplier and sourcing partner of diagnostic and laboratory equipment. Contact us for quotations.`;
    const url = `https://humarilab.in/category/${slug}`;

    return {
        title,
        description,
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
            images: [
                {
                    url: "/logo.png",
                    width: 1200,
                    height: 630,
                    alt: categoryName,
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/logo.png"],
        }
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const products = await fetchFullCatalog();

    const categoryName = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
        .find((cat) => makeSlug(cat) === slug);

    if (!categoryName) {
        return notFound();
    }

    const categoryProducts = products.filter((p) => p.category === categoryName);
    const categoryInfo = getCategoryInfo(categoryName);

    // Schemas
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://humarilab.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://humarilab.in/items"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": categoryName,
                "item": `https://humarilab.in/category/${slug}`
            }
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is ${categoryName} used for?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": categoryInfo.usage
                }
            },
            {
                "@type": "Question",
                "name": `What buying considerations are important for ${categoryName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": categoryInfo.considerations
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />

            <PageBanner
                title={categoryName}
                subtitle={`Premium ${categoryName.toLowerCase()} solutions for hospitals, clinical laboratories, and diagnostics.`}
            />

            {/* Breadcrumbs Navigation */}
            <div className="bg-[#FFFDFB] border-b border-[#EADBC8] py-4">
                <div className="container-custom flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Link href="/" className="hover:text-[#6F4E37] transition">Home</Link>
                    <span>/</span>
                    <Link href="/items" className="hover:text-[#6F4E37] transition">Products</Link>
                    <span>/</span>
                    <span className="text-[#6F4E37] font-semibold">{categoryName}</span>
                </div>
            </div>

            {/* Products List Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-custom">
                    <SectionTitle
                        badge="Category Products"
                        title={`Verified Sourced ${categoryName}`}
                        description={`Explore our collection of ${categoryName.toLowerCase()} equipment and reagents.`}
                        center
                    />

                    <div className="mt-16 space-y-8 max-w-5xl mx-auto">
                        {categoryProducts.map((product) => (
                            <ProductCard key={product.uid} product={product} />
                        ))}
                        {categoryProducts.length === 0 && (
                            <div className="text-center text-slate-500 py-12 font-medium">
                                No products found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Helpful Informational Hub (Phase 7 - Topical Authority) */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-[#FFFDF9] via-[#F8F5F0] to-[#F3ECE4] border-t border-[#EADBC8]">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-[#EADBC8] text-[#6F4E37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            Topical Guide
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2C] mt-4">
                            Guide to {categoryName} Sourcing
                        </h2>
                    </div>

                    <div className="bg-white rounded-[32px] border border-[#EADBC8] p-8 md:p-12 shadow-sm space-y-10 text-slate-600 leading-8">
                        <div>
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">What is {categoryName}?</h3>
                            <p className="text-base">{categoryInfo.about}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Clinical Applications & Usage</h3>
                            <p className="text-base">{categoryInfo.usage}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Key Technical Specifications</h3>
                            <p className="text-base">{categoryInfo.specs}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Buying Considerations for Sourcing</h3>
                            <p className="text-base">{categoryInfo.considerations}</p>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
