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

// Brand-specific guides for EEAT and programmatic quality gates (Phase 7 & 19)
function getBrandInfo(brandName) {
    const defaultInfo = {
        about: `Raj Biosis is a trusted supplier and sourcing partner for ${brandName} diagnostic and laboratory systems. We help healthcare providers select and procure high-quality instruments that match their daily clinical needs and budget.`,
        value: `${brandName} is recognized globally for manufacturing precise, high-performance medical systems that diagnostic centers can rely on.`,
        support: `We supply genuine systems and reagents with standard manufacturer warranties. Sourcing through Raj Biosis ensures professional product guidance and quotation transparency.`
    };

    const details = {
        "roche": {
            about: "Roche Diagnostics is a global pioneer in pharmaceuticals and diagnostics. Roche systems are recognized for setting the industry standard in precision testing, automation capability, and clinical assay menus.",
            value: "Choosing Roche systems ensures your laboratory is equipped with state-of-the-art testing technology, ensuring clinical accuracy, robust software interfaces, and reliable patient diagnostic reports.",
            support: "We source Roche compatible electrolyte reagents and systems, providing clinics with competitive quotes and consistent supply runs to prevent laboratory testing downtime."
        },
        "erba": {
            about: "ERBA Diagnostics (Erba Mannheim) is a leading global player in clinical diagnostics, offering a comprehensive suite of clinical chemistry, hematology, and urine analysis systems optimized for small-to-large laboratories.",
            value: "ERBA equipment is highly valued by laboratories across India for providing excellent cost-to-performance ratios, easy availability of consumables, and highly user-friendly operation controls.",
            support: "We assist healthcare facilities in sourcing ERBA systems (including EC 90 and biochemistry setups), delivering clear specifications sheets, transparent pricing, and procurement logistics."
        },
        "mindray": {
            about: "Mindray Medical is a leading global developer of medical devices and solutions. Their hematology, biochemistry, and patient monitoring technologies are renowned for operational speed, durability, and modern diagnostics software.",
            value: "Mindray devices integrate advanced clinical capabilities with cost-efficient operation, making them the preferred choice for scaling laboratories and pathology institutions.",
            support: "Raj Biosis provides detailed Mindray product sheets, price comparisons, and sourcing coordinates for hematology systems and reagents."
        }
    };

    const slug = makeSlug(brandName);
    return details[slug] || defaultInfo;
}

export async function generateStaticParams() {
    try {
        const products = await fetchFullCatalog();
        const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
        return brands.map((br) => ({
            slug: makeSlug(br),
        }));
    } catch (e) {
        console.error("Error in generateStaticParams for brand page:", e);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const products = await fetchFullCatalog();
    
    const brandName = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))
        .find((br) => makeSlug(br) === slug);

    if (!brandName) {
        return {
            title: "Brand Not Found | Raj Biosis",
        };
    }

    const title = `Buy ${brandName} Biomedical & Lab Equipment | Raj Biosis`;
    const description = `Sourcing high-quality ${brandName} laboratory analyzers and diagnostic equipment. Contact Raj Biosis for itemized quotes and product availability.`;
    const url = `https://humarilab.in/brand/${slug}`;

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
                    alt: brandName,
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

export default async function BrandPage({ params }) {
    const { slug } = await params;
    const products = await fetchFullCatalog();

    const brandName = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))
        .find((br) => makeSlug(br) === slug);

    if (!brandName) {
        return notFound();
    }

    const brandProducts = products.filter((p) => p.brand === brandName);
    const brandInfo = getBrandInfo(brandName);

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
                "name": brandName,
                "item": `https://humarilab.in/brand/${slug}`
            }
        ]
    };

    const brandSchema = {
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": brandName,
        "description": brandInfo.about,
        "logo": "https://humarilab.in/logo.png"
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
                    __html: JSON.stringify(brandSchema),
                }}
            />

            <PageBanner
                title={`${brandName} Equipment`}
                subtitle={`Sourcing precision diagnostics and laboratory systems from ${brandName} for healthcare facilities.`}
            />

            {/* Breadcrumbs */}
            <div className="bg-[#FFFDFB] border-b border-[#EADBC8] py-4">
                <div className="container-custom flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Link href="/" className="hover:text-[#6F4E37] transition">Home</Link>
                    <span>/</span>
                    <Link href="/items" className="hover:text-[#6F4E37] transition">Products</Link>
                    <span>/</span>
                    <span className="text-[#6F4E37] font-semibold">{brandName}</span>
                </div>
            </div>

            {/* Products List */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-custom">
                    <SectionTitle
                        badge="Sourced Brand Items"
                        title={`${brandName} Diagnostic Range`}
                        description={`Compare models and request quotations for ${brandName} products.`}
                        center
                    />

                    <div className="mt-16 space-y-8 max-w-5xl mx-auto">
                        {brandProducts.map((product) => (
                            <ProductCard key={product.uid} product={product} />
                        ))}
                        {brandProducts.length === 0 && (
                            <div className="text-center text-slate-500 py-12 font-medium">
                                No products found for this brand.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Brand Authority Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-[#FFFDF9] via-[#F8F5F0] to-[#F3ECE4] border-t border-[#EADBC8]">
                <div className="container-custom max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-[#EADBC8] text-[#6F4E37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            Brand Profile
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2C] mt-4">
                            About {brandName} Diagnostics
                        </h2>
                    </div>

                    <div className="bg-white rounded-[32px] border border-[#EADBC8] p-8 md:p-12 shadow-sm space-y-8 text-slate-600 leading-8">
                        <div>
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Who is {brandName}?</h3>
                            <p className="text-base">{brandInfo.about}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Clinical Value Proposition</h3>
                            <p className="text-base">{brandInfo.value}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Procuring {brandName} Systems</h3>
                            <p className="text-base">{brandInfo.support}</p>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
