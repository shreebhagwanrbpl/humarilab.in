"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { fetchFullCatalog } from "@/lib/data-fetcher";
import toast from "react-hot-toast";

import { usePathname } from "next/navigation";

import {
    FaPlay,
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
} from "react-icons/fa";

import { parseContactInfo } from "@/lib/admin-api";
const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

const loadImageBase64 = async (src) => {
    try {
        if (!src.startsWith("http")) {
            return new Promise((resolve, reject) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    try {
                        resolve(canvas.toDataURL("image/png"));
                    } catch (e) {
                        reject(e);
                    }
                };
                img.onerror = (e) => reject(e);
                img.src = src;
            });
        }

        // Method 1: Fetch via our local proxy (bypasses CORS on Firebase Storage securely, preserves original PNG/JPEG format)
        try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
            const response = await fetch(proxyUrl);
            if (response.ok) {
                const blob = await response.blob();
                return await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("FileReader failed"));
                    reader.readAsDataURL(blob);
                });
            }
        } catch (proxyErr) {
            console.warn("Proxy method failed, falling back to direct fetch...", proxyErr);
        }

        // Method 2: Fallback direct fetch (bypasses browser cache collision while keeping token intact)
        try {
            const response = await fetch(src, { cache: "no-cache" });
            if (response.ok) {
                const blob = await response.blob();
                return await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("FileReader failed"));
                    reader.readAsDataURL(blob);
                });
            }
        } catch (fetchErr) {
            console.warn("fetch method failed, falling back to canvas method...", fetchErr);
        }

        // Method 3: Fallback to HTML Image element with crossOrigin anonymous
        return await new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                try {
                    resolve(canvas.toDataURL("image/png"));
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = (e) => reject(new Error("Image element load failed"));
            img.src = src;
        });
    } catch (err) {
        console.error("loadImageBase64 failed for src:", src, err);
        throw err;
    }
};

const getProductSpecs = (product) => {
    const specsMap = new Map();

    // Standard specifications (order-preserved)
    const standardFields = [
        ["Brand", "brand"],
        ["Model", "model"],
        ["Instrument", "instrument"],
        ["Category", "category"],
        ["Capacity", "capacity"],
        ["Throughput", "throughput"],
        ["Usage", "usage"],
        ["Automation", "automation"],
        ["Availability", "availability"]
    ];

    standardFields.forEach(([label, key]) => {
        const val = product[key];
        if (val && String(val).trim() && String(val).trim() !== "N/A") {
            specsMap.set(label, String(val).trim());
        }
    });

    const blacklist = new Set([
        "title", "desc", "description", "image", "images", "slug",
        "uid", "video", "pdf", "isPublished", "category", "subCategory",
        "brand", "model", "instrument", "capacity", "throughput",
        "usage", "automation", "availability",
        "price", "categoryProductId", "category_product_id", "categoryproductid",
        "id", "createdAt", "created_at", "createdat"
    ]);

    // Parse parameters field if it exists
    if (product.parameters && typeof product.parameters === "string") {
        const parts = product.parameters.split("|");
        parts.forEach(part => {
            const colonIndex = part.indexOf(":");
            if (colonIndex !== -1) {
                const label = part.substring(0, colonIndex).trim();
                const value = part.substring(colonIndex + 1).trim();
                const lowerLabel = label.toLowerCase();
                if (label && value && value !== "N/A" &&
                    !blacklist.has(lowerLabel) &&
                    !lowerLabel.includes("price") &&
                    !lowerLabel.includes("id") &&
                    !lowerLabel.includes("createdat") &&
                    !lowerLabel.includes("created_at") &&
                    !lowerLabel.includes("ispublished")
                ) {
                    const cleanLabel = label.replace(/\b\w/g, (c) => c.toUpperCase());
                    specsMap.set(cleanLabel, value);
                }
            }
        });
    }

    // Parse desc field if it exists and contains pipes (sometimes used as fallback)
    if (product.desc && typeof product.desc === "string" && product.desc.includes("|") && !product.parameters) {
        const parts = product.desc.split("|");
        parts.forEach(part => {
            const colonIndex = part.indexOf(":");
            if (colonIndex !== -1) {
                const label = part.substring(0, colonIndex).trim();
                const value = part.substring(colonIndex + 1).trim();
                const lowerLabel = label.toLowerCase();
                if (label && value && value !== "N/A" &&
                    !blacklist.has(lowerLabel) &&
                    !lowerLabel.includes("price") &&
                    !lowerLabel.includes("id") &&
                    !lowerLabel.includes("createdat") &&
                    !lowerLabel.includes("created_at") &&
                    !lowerLabel.includes("ispublished")
                ) {
                    const cleanLabel = label.replace(/\b\w/g, (c) => c.toUpperCase());
                    specsMap.set(cleanLabel, value);
                }
            }
        });
    }

    // Dynamically add all other non-metadata, non-blacklisted keys
    Object.entries(product).forEach(([key, val]) => {
        const lowerKey = key.toLowerCase();
        if (blacklist.has(key) ||
            lowerKey.includes("price") ||
            lowerKey.includes("id") ||
            lowerKey.includes("createdat") ||
            lowerKey.includes("created_at") ||
            lowerKey.includes("ispublished") ||
            lowerKey === "parameters"
        ) {
            return;
        }

        if (typeof val === "string" || typeof val === "number") {
            const cleanVal = String(val).trim();
            if (cleanVal && cleanVal !== "N/A") {
                const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/[_-]/g, " ")
                    .trim()
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                specsMap.set(label, cleanVal);
            }
        }
    });

    return Array.from(specsMap.entries());
};

const getWebsiteDomain = () => {
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
            return host;
        }
    }
    return "humarilab.in";
};

export default function ProductDetails({ slug }) {
    const [product, setProduct] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);
    const [contactInfo, setContactInfo] = useState([]);
    const [downloadingBrochure, setDownloadingBrochure] = useState(false);

    const shareRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [submitting, setSubmitting] =
        useState(false);
    const pathname = usePathname();

    const pathParts = pathname
        .split("/")
        .filter(Boolean);

    const isDistrictRoute = pathParts.length > 2 && pathParts[1] === "items";
    const city = isDistrictRoute ? pathParts[0] : "India";

    const cityName =
        city
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    useEffect(() => {
        const loadProduct = async (force = false) => {
            try {
                const allProducts = await fetchFullCatalog({ forceRefresh: force });
                const found = allProducts.find(
                    (p) => p.slug === slug
                );
                setProduct(found || null);

                if (found) {
                    if (found.images?.length > 0) {
                        setSelectedImage(found.images[0]);
                    } else {
                        setSelectedImage(found.image || "");
                    }
                    setSelectedMedia("image");
                }
            } catch (error) {
                console.error("Error loading product detail:", error);
            }
        };

        loadProduct(false);

        const onFocus = () => loadProduct(true);
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") loadProduct(true);
        };

        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.name.trim()) {
            return toast.error(
                "Name is required"
            );
        }

        if (!emailRegex.test(form.email)) {
            return toast.error(
                "Enter valid email"
            );
        }

        if (!phoneRegex.test(form.phone)) {
            return toast.error(
                "Enter valid mobile number"
            );
        }

        try {
            setSubmitting(true);

            const res = await fetch("/api/product-query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    productName: product.title,
                    productSlug: product.slug,
                    brand: product.brand || "",
                    model: product.model || "",
                }),
            });

            const json = await res.json();

            if (res.ok && json.success) {
                toast.success(
                    json.message || "Your enquiry has been submitted successfully."
                );
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                });
            } else {
                toast.error(json.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Product enquiry error:", error);
            toast.error(
                "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };
    const productSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image ? [product.image] : [],
            description:
                product.desc ||
                product.description ||
                product.title,
            sku: product.model || product.slug,
            mpn: product.model || "N/A",
            brand: {
                "@type": "Brand",
                name: product.brand || "Raj Biosis",
            },
            offers: {
                "@type": "AggregateOffer",
                priceCurrency: "INR",
                lowPrice: "5000",
                highPrice: "500000",
                offerCount: "1",
                priceSpecification: {
                    "@type": "PriceSpecification",
                    price: "0",
                    priceCurrency: "INR",
                    valueAddedTaxIncluded: false
                }
            }
        }
        : null;

    const faqSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: `What is ${product.title} used for?`,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you provide installation support?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. Equipment installation guidance and technical support are available where applicable.",
                    },
                },
            ],
        }
        : null;

    const breadcrumbSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": isDistrictRoute ? `https://humarilab.in/${city}` : "https://humarilab.in"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Products",
                    "item": isDistrictRoute ? `https://humarilab.in/${city}/items` : "https://humarilab.in/items"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": product.title,
                    "item": isDistrictRoute ? `https://humarilab.in/${city}/items/${slug}` : `https://humarilab.in/items/${slug}`
                }
            ]
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const parsed = parseContactInfo(contactInfo);
        const targetNumber = parsed.whatsappNumber ? parsed.whatsappNumber.replace(/[^\d]/g, "") : "";
        const shareText = `🔬 ${product?.title}\n\n${product?.desc || product?.description || ""}\n\n🌐 ${window.location.href}`;

        const waUrl = targetNumber
            ? `https://wa.me/${targetNumber}?text=${encodeURIComponent(shareText)}`
            : `https://wa.me/?text=${encodeURIComponent(shareText)}`;

        window.open(waUrl, "_blank");
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Instagram direct sharing available nahi hai. Link copied.");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.title,
                text: product.desc,
                url: window.location.href,
            });
        } else {
            setShowShare(!showShare);
        }
    };

    useEffect(() => {
        const close = (e) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(e.target)
            ) {
                setShowShare(false);
            }
        };

        document.addEventListener("mousedown", close);

        return () =>
            document.removeEventListener("mousedown", close);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const loadContact = async () => {
            try {
                const res = await fetch("/api/site-data?type=contact");
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted && json?.data) {
                        setContactInfo(json.data.contactInfo || json.data || []);
                    }
                }
            } catch (err) {
                console.error("Error loading contact info in details:", err);
            }
        };
        loadContact();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleDownloadBrochure = async () => {
        if (!product) return;
        try {
            setDownloadingBrochure(true);
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            // Load logo
            let logoBase64 = null;
            try {
                logoBase64 = await loadImageBase64("/logo.png");
            } catch (e) {
                console.error("Error loading brochure logo:", e);
            }

            // Load product image
            const imgUrl = product.image || (product.images && product.images[0]);
            let productImgBase64 = null;
            if (imgUrl) {
                try {
                    productImgBase64 = await loadImageBase64(imgUrl);
                } catch (e) {
                    console.error("Error loading product image for brochure:", e);
                }
            }

            // Layout Dimensions
            const margin = 15;
            const pageWidth = 210;
            const pageHeight = 297;
            const contentWidth = pageWidth - 2 * margin;

            // Colors
            const colorPrimary = [111, 78, 55];
            const colorDark = [44, 44, 44];
            const colorGray = [107, 114, 128];
            const colorLightBorder = [234, 219, 200];

            // 1. HEADER
            let headerLeftOffset = margin;
            if (logoBase64) {
                doc.addImage(logoBase64, "PNG", margin, 15, 12, 12);
                headerLeftOffset += 16;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
            doc.text("Raj Biosis", headerLeftOffset, 21);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
            doc.text("Biomedical & Diagnostic Equipment", headerLeftOffset, 26);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);

            const websiteText = getWebsiteDomain();
            const parsed = parseContactInfo(contactInfo);
            const phoneString = parsed.phones.join(", ");
            const emailString = parsed.emails.join(", ");

            doc.text(`Website: ${websiteText}`, 140, 20);
            if (emailString) doc.text(`Email: ${emailString}`, 140, 25);
            if (phoneString) doc.text(`Phone: ${phoneString}`, 140, 30);

            doc.setDrawColor(colorLightBorder[0], colorLightBorder[1], colorLightBorder[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, 35, pageWidth - margin, 35);

            // 2. PRODUCT TITLE
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
            const titleLines = doc.splitTextToSize(product.title, contentWidth);
            doc.text(titleLines, margin, 45);
            const titleHeight = titleLines.length * 7;

            // 3. PRODUCT IMAGE
            const imageY = 48 + titleHeight;
            const imageHeight = 55;
            const imageWidth = 70;
            const imageX = margin + (contentWidth - imageWidth) / 2;

            doc.setDrawColor(colorLightBorder[0], colorLightBorder[1], colorLightBorder[2]);
            doc.setFillColor(255, 248, 243);
            doc.roundedRect(imageX - 5, imageY - 2, imageWidth + 10, imageHeight + 4, 4, 4, "FD");

            if (productImgBase64) {
                let format = "JPEG";
                if (productImgBase64.startsWith("data:image/png")) {
                    format = "PNG";
                }
                doc.addImage(productImgBase64, format, imageX, imageY, imageWidth, imageHeight);
            } else {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
                doc.text("Product Image Sourced Online", imageX + 10, imageY + imageHeight / 2);
            }

            // 4. PRODUCT DESCRIPTION
            const descY = imageY + imageHeight + 10;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
            doc.text("Product Overview", margin, descY);

            doc.setDrawColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, descY + 2, margin + 25, descY + 2);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);

            let descText = product.desc || product.description || "No description available.";
            if (descText.length > 400) {
                descText = descText.substring(0, 400) + "...";
            }
            const descLines = doc.splitTextToSize(descText, contentWidth);
            doc.text(descLines, margin, descY + 8);
            const descHeight = descLines.length * 4.5;

            // 5. SPECIFICATIONS
            const specsY = descY + 12 + descHeight;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
            doc.text("Technical Specifications", margin, specsY);

            doc.setDrawColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, specsY + 2, margin + 35, specsY + 2);

            const specs = getProductSpecs(product);

            let specRowY = specsY + 8;
            doc.setFontSize(8.5);

            for (let i = 0; i < specs.length; i++) {
                const label = specs[i][0];
                const value = String(specs[i][1]);

                // Print Label
                doc.setFont("helvetica", "bold");
                doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
                doc.text(`${label}:`, margin, specRowY);

                // Wrap Value to fit the page width
                doc.setFont("helvetica", "normal");
                doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);

                const valueLines = doc.splitTextToSize(value, contentWidth - 42);
                doc.text(valueLines, margin + 42, specRowY);

                // Adjust specRowY based on the number of wrapped lines
                specRowY += valueLines.length * 4.5 + 2;

                // Check if we are running out of page space
                if (specRowY > pageHeight - 20) {
                    doc.addPage();
                    specRowY = margin + 10;
                }
            }

            // 6. FOOTER
            doc.setDrawColor(colorLightBorder[0], colorLightBorder[1], colorLightBorder[2]);
            doc.setLineWidth(0.3);
            doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

            doc.setFont("helvetica", "italic");
            doc.setFontSize(7.5);
            doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
            doc.text("Raj Biosis | Quality Sourcing • Reliable Supply • Technical Support Partner", pageWidth / 2, pageHeight - 10, { align: "center" });

            doc.save(`${product.title.replace(/\s+/g, "_")}_Brochure.pdf`);
            toast.success("Brochure downloaded successfully!");
        } catch (e) {
            console.error("Error creating PDF brochure:", e);
            toast.error("Failed to generate brochure PDF.");
        } finally {
            setDownloadingBrochure(false);
        }
    };

    if (!product) {
        return (
            <section className="py-10 md:py-20 bg-slate-50">
                <div className="container-custom">

                    <div className="grid lg:grid-cols-2 gap-12">

                        <div className="h-[420px] md:h-[520px] rounded-[36px] bg-slate-200 animate-pulse" />

                        <div>
                            <div className="h-12 w-3/4 bg-slate-200 rounded-xl animate-pulse mb-8" />

                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-6 bg-slate-200 rounded-lg animate-pulse mb-4"
                                />
                            ))}
                        </div>

                    </div>

                    <div className="mt-16 grid lg:grid-cols-[600px_1fr] gap-8">

                        <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
                            <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />

                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-14 bg-slate-200 rounded-2xl animate-pulse mb-4"
                                />
                            ))}
                        </div>

                        <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
                            <div className="h-10 w-60 bg-slate-200 rounded-lg animate-pulse mb-6" />

                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-5 bg-slate-200 rounded animate-pulse mb-4"
                                />
                            ))}
                        </div>

                    </div>

                </div>
            </section>
        );
    }
    return (
        <section className="py-10 md:py-20 bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            <div className="container-custom">
                <div className="mb-6 text-sm text-slate-500">
                    Home / Products / {product.title}
                </div>
                {/* Top Section */}

                <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] gap-8 md:gap-12">
                    {/* Product Image */}

                    <div className="space-y-8">

                        <div className="relative h-[340px] sm:h-[420px] md:h-[500px] lg:h-[580px] overflow-hidden rounded-[24px] md:rounded-[36px] border border-[#EADBC8] bg-[#FFF8F3] shadow-xl shadow-[#EADBC8]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#B08968]/20">

                            {selectedMedia === "video" && product.video ? (

                                <video
                                    controls
                                    autoPlay
                                    className="h-full w-full object-contain p-6"
                                >
                                    <source
                                        src={product.video}
                                        type="video/mp4"
                                    />
                                </video>

                            ) : (

                                <>
                                    <img
                                        src={selectedImage || product.image || "/placeholder.jpg"}
                                        alt={product.title}
                                        className="h-full w-full object-contain p-6"
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.jpg";
                                        }}
                                    />
                                </>

                            )}

                        </div>

                        <div className="mt-6 flex flex-wrap gap-4">

                            {(product.images?.length
                                ? product.images
                                : [product.image]
                            ).map((img, index) => (

                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImage(img);
                                        setSelectedMedia("image");
                                    }}
                                    className={`group relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-[#FFF8F3] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${selectedMedia === "image" && selectedImage === img
                                        ? "border-[#6F4E37] ring-2 ring-[#EADBC8]"
                                        : "border-[#DCCBB8] hover:border-[#B08968]"
                                        }`}
                                >
                                    <img
                                        src={img || "/placeholder.jpg"}
                                        alt=""
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.jpg";
                                        }}
                                    />
                                </button>

                            ))}

                            {product.video && (

                                <button
                                    onClick={() => setSelectedMedia("video")}
                                    className={`group flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 bg-[#FFF8F3] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${selectedMedia === "video"
                                        ? "border-[#6F4E37] ring-2 ring-[#EADBC8]"
                                        : "border-[#DCCBB8] hover:border-[#B08968]"
                                        }`}
                                >
                                    <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBC8] text-[#6F4E37] transition group-hover:bg-[#6F4E37] group-hover:text-white">
                                        <FaPlay size={16} />
                                    </div>

                                    <span className="text-xs font-semibold text-[#6F4E37]">
                                        Video
                                    </span>
                                </button>

                            )}

                            {product.pdf && (

                                <a
                                    href={product.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 border-[#DCCBB8] bg-[#FFF8F3] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6F4E37] hover:shadow-lg"
                                >
                                    <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBC8] text-lg transition group-hover:bg-[#6F4E37]">
                                        <span className="group-hover:text-white">📄</span>
                                    </div>

                                    <span className="text-xs font-semibold text-[#6F4E37]">
                                        PDF
                                    </span>
                                </a>

                            )}

                        </div>

                        {/* Quote Form */}
                        <div className="h-fit rounded-[24px] md:rounded-[32px] border border-[#EADBC8] bg-white p-5 shadow-xl shadow-[#EADBC8]/30 lg:sticky lg:top-24 sm:p-6 md:p-8">
                            {/* Badge */}
                            <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                Quick Enquiry
                            </span>

                            {/* Heading */}
                            <h2 className="mt-5 text-2xl font-extrabold text-[#2C2C2C] md:text-3xl">
                                Request A Quote
                            </h2>

                            {/* Accent Line */}
                            <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                            {/* Product */}
                            <div className="mt-6 rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] p-4">
                                <p className="text-sm font-medium text-[#9A7B5F]">
                                    Product
                                </p>

                                <p className="mt-1 text-lg font-bold text-[#2C2C2C]">
                                    {product.title}
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 space-y-5"
                            >
                                {/* Name */}
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A7B5F] outline-none transition focus:border-[#6F4E37] focus:ring-2 focus:ring-[#EADBC8]"
                                />

                                {/* Email */}
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A7B5F] outline-none transition focus:border-[#6F4E37] focus:ring-2 focus:ring-[#EADBC8]"
                                />

                                {/* Phone */}
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value.replace(/\D/g, ""),
                                        })
                                    }
                                    className="w-full rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A7B5F] outline-none transition focus:border-[#6F4E37] focus:ring-2 focus:ring-[#EADBC8]"
                                />

                                {/* Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6F4E37] py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3E2C] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {submitting ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            Get Quote

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 12h14M13 5l7 7-7 7"
                                                />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                    </div>

                    {/* Product Details */}

                    <div className="space-y-8">

                        <div className="relative flex items-start justify-between gap-4">

                            <div>
                                {/* Badge */}
                                <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-1.5 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                    Premium Biomedical Equipment
                                </span>

                                {/* Title */}
                                <h1 className="mt-4 text-2xl font-extrabold leading-tight text-[#2C2C2C] sm:text-3xl md:text-4xl lg:text-5xl">
                                    {product.title}
                                </h1>

                                {/* Accent Line */}
                                <div className="mt-4 h-1 w-28 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                {/* Download Brochure Button */}
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <button
                                        onClick={handleDownloadBrochure}
                                        disabled={downloadingBrochure}
                                        className="group inline-flex items-center gap-2 rounded-2xl bg-[#6F4E37] px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3E2C] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-75"
                                    >
                                        {downloadingBrochure ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download Brochure
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Share */}
                            <div
                                ref={shareRef}
                                className="relative"
                            >
                                <button
                                    onClick={handleNativeShare}
                                    className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#DCCBB8] bg-[#FFF8F3] text-[#6F4E37] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#6F4E37] hover:text-white hover:shadow-xl"
                                >
                                    <FaShareAlt
                                        size={18}
                                        className="transition-transform duration-300 group-hover:scale-110"
                                    />
                                </button>

                                {showShare && (
                                    <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-[#EADBC8] bg-white shadow-2xl">

                                        <button
                                            onClick={handleCopy}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#2C2C2C] transition hover:bg-[#FFF8F3]"
                                        >
                                            <FaLink className="text-[#6F4E37]" />
                                            Copy Link
                                        </button>

                                        <button
                                            onClick={handleWhatsapp}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#2C2C2C] transition hover:bg-[#FFF8F3]"
                                        >
                                            <FaWhatsapp className="text-green-600" />
                                            WhatsApp
                                        </button>

                                        <button
                                            onClick={handleFacebook}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#2C2C2C] transition hover:bg-[#FFF8F3]"
                                        >
                                            <FaFacebook className="text-blue-600" />
                                            Facebook
                                        </button>

                                        <button
                                            onClick={handleInstagram}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#2C2C2C] transition hover:bg-[#FFF8F3]"
                                        >
                                            <FaInstagram className="text-pink-600" />
                                            Instagram
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description & Specs Card */}
                        <div className="mt-8 rounded-[24px] border border-[#EADBC8] bg-white p-5 shadow-lg shadow-[#EADBC8]/20 md:p-6">
                            <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-3.5 py-1 text-xs font-semibold text-[#6F4E37] shadow-sm">
                                Product Information
                            </span>

                            <h3 className="mt-3 text-xl font-bold text-[#2C2C2C]">
                                Product Description
                            </h3>
                            <div className="mt-2 h-0.5 w-16 bg-[#B08968]" />

                            <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                                {product.desc || product.description || "No description available."}
                            </p>

                            <div className="mt-6">
                                <h4 className="text-sm font-bold text-[#2C2C2C] mb-3">
                                    Technical Specifications
                                </h4>
                                <div className="overflow-hidden rounded-xl border border-[#EADBC8]">
                                    <table className="w-full border-collapse text-xs">
                                        <tbody>
                                            {getProductSpecs(product).map(([label, value], index) => (
                                                <tr
                                                    key={label}
                                                    className={index % 2 === 0 ? "bg-[#FFF8F3]" : "bg-white"}
                                                >
                                                    <td className="w-1/3 border-b border-[#EADBC8] px-4 py-2.5 font-semibold text-[#6F4E37]">
                                                        {label}
                                                    </td>
                                                    <td className="border-b border-[#EADBC8] px-4 py-2.5 text-[#2C2C2C]">
                                                        {value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* SEO Content & FAQs */}
                        <div className="rounded-[24px] border border-[#EADBC8] bg-white p-5 shadow-xl shadow-[#EADBC8]/30 md:rounded-[32px] md:p-10">

                            {/* SEO Content */}
                            <div>

                                <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                    Why Choose Us
                                </span>

                                <h3 className="mt-5 text-2xl font-bold text-[#2C2C2C]">
                                    Why Choose Raj Biosis in {cityName}?
                                </h3>

                                <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                <p className="mt-6 leading-8 text-[#6B7280]">
                                    Raj Biosis is a trusted supplier and distributor of{" "}
                                    <strong className="text-[#6F4E37]">
                                        {product.title}
                                    </strong>{" "}
                                    in <strong>{cityName}</strong>. We provide high-quality biomedical and
                                    laboratory equipment for hospitals, pathology laboratories,
                                    diagnostic centres, research institutions and healthcare facilities.
                                </p>

                                {/* Features */}
                                <div className="mt-12">

                                    <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                        Key Features
                                    </span>

                                    <h3 className="mt-5 text-2xl font-bold text-[#2C2C2C]">
                                        Features of {product.title}
                                    </h3>

                                    <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                    <p className="mt-6 leading-8 text-[#6B7280]">
                                        <strong className="text-[#6F4E37]">
                                            {product.title}
                                        </strong>{" "}
                                        delivers reliable performance, accurate results, user-friendly
                                        operation, excellent durability and efficient workflow for hospitals,
                                        pathology laboratories, diagnostic centres and healthcare
                                        professionals. It is designed to ensure precision, consistency and
                                        long-term performance in demanding medical environments.
                                    </p>

                                </div>

                                <div className="mt-10">

                                    {/* Badge */}
                                    <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                                        Product Applications
                                    </span>

                                    {/* Heading */}
                                    <h3 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
                                        Applications of {product.title}
                                    </h3>

                                    {/* Accent Line */}
                                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                    {/* Description */}
                                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6B7280]">
                                        {product.title} is widely used across hospitals, pathology laboratories,
                                        diagnostic centres, blood banks, research institutes, medical colleges,
                                        healthcare facilities, and clinical laboratories for accurate and reliable
                                        testing, ensuring efficient workflow and high-quality diagnostic results.
                                    </p>

                                </div>

                                {/* Supplier */}
                                <div className="mt-10">

                                    <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                                        Supplier
                                    </span>

                                    <h3 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
                                        {product.title} Supplier in {cityName}
                                    </h3>

                                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                    <p className="mt-6 text-lg leading-8 text-[#6B7280]">
                                        Raj Biosis supplies <strong>{product.title}</strong> in{" "}
                                        <strong>{cityName}</strong> with complete technical support,
                                        installation assistance, maintenance services, and reliable customer
                                        support for hospitals, pathology laboratories, diagnostic centres,
                                        research institutes, and healthcare facilities.
                                    </p>

                                </div>

                                {/* Dealer */}
                                <div className="mt-12">

                                    <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                                        Dealer
                                    </span>

                                    <h3 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
                                        {product.title} Dealer in {cityName}
                                    </h3>

                                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                    <p className="mt-6 text-lg leading-8 text-[#6B7280]">
                                        Raj Biosis is a trusted dealer of{" "}
                                        <strong>{product.title}</strong> in <strong>{cityName}</strong>.
                                        We supply premium biomedical equipment, laboratory instruments,
                                        diagnostic analyzers, and healthcare devices with professional
                                        installation, training, and after-sales support.
                                    </p>

                                </div>

                                {/* Distributor */}
                                <div className="mt-12">

                                    <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                                        Distributor
                                    </span>

                                    <h3 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
                                        {product.title} Distributor in {cityName}
                                    </h3>

                                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                    <p className="mt-6 text-lg leading-8 text-[#6B7280]">
                                        Looking for a reliable distributor of{" "}
                                        <strong>{product.title}</strong> in <strong>{cityName}</strong>?
                                        We provide genuine products, fast delivery, installation support,
                                        preventive maintenance, technical guidance, and dependable service
                                        for hospitals and laboratories.
                                    </p>

                                </div>

                                {/* Buy */}
                                <div className="mt-12">

                                    <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                                        Buy Now
                                    </span>

                                    <h3 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
                                        Buy {product.title} in {cityName}
                                    </h3>

                                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                    <p className="mt-6 text-lg leading-8 text-[#6B7280]">
                                        Buy high-quality <strong>{product.title}</strong> in{" "}
                                        <strong>{cityName}</strong> at competitive prices. Contact Raj
                                        Biosis for the latest quotation, product availability, expert
                                        consultation, and complete installation support.
                                    </p>

                                </div>

                                <div className="mt-12">

                                    {/* Badge */}
                                    <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                                        Pricing
                                    </span>

                                    {/* Heading */}
                                    <h3 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
                                        {product.title} Price in {cityName}
                                    </h3>

                                    {/* Accent Line */}
                                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                    {/* Description */}
                                    <p className="mt-6 text-lg leading-8 text-[#6B7280]">
                                        The price of <strong>{product.title}</strong> in{" "}
                                        <strong>{cityName}</strong> depends on the brand, model,
                                        specifications, configuration, and available features. Contact
                                        Raj Biosis for the latest pricing, product availability,
                                        bulk order discounts, installation support, and fast delivery
                                        across <strong>{cityName}</strong>.
                                    </p>

                                </div>
                            </div>

                            {/* FAQ Section */}

                            <div className="mt-14">

                                {/* Badge */}
                                <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                                    FAQs
                                </span>

                                {/* Heading */}
                                <h3 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
                                    Frequently Asked Questions
                                </h3>

                                {/* Accent Line */}
                                <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                {/* FAQ Cards */}
                                <div className="mt-10 space-y-6">

                                    {[
                                        {
                                            q: `What is ${product.title} used for in ${cityName}?`,
                                            a: `${product.title} is commonly used in hospitals, pathology laboratories, diagnostic centres, research institutes and healthcare facilities for accurate diagnostic and laboratory testing.`,
                                        },
                                        {
                                            q: `What is the price of ${product.title} in ${cityName}?`,
                                            a: `Pricing depends on the brand, model, specifications and features. Contact us for the latest quotation and availability.`,
                                        },
                                        {
                                            q: `Are you an authorized supplier of ${product.title}?`,
                                            a: `Yes, we supply genuine biomedical and laboratory equipment from trusted manufacturers with complete technical support.`,
                                        },
                                        {
                                            q: `Can hospitals in ${cityName} order this product?`,
                                            a: `Yes, hospitals, pathology laboratories, diagnostic centres, research institutes and healthcare facilities can order this product.`,
                                        },
                                        {
                                            q: `Do you provide installation support?`,
                                            a: `Yes, installation, commissioning and technical support are available depending on the product model.`,
                                        },
                                        {
                                            q: `Can I request a quotation?`,
                                            a: `Yes, simply submit the enquiry form on this page or contact our team to receive pricing, availability and complete product information.`,
                                        },
                                        {
                                            q: `Do you provide warranty?`,
                                            a: `Yes, warranty is available as per the manufacturer's policy and product model.`,
                                        },
                                        {
                                            q: `Do you deliver across India?`,
                                            a: `Yes, we supply biomedical equipment across India with secure packaging, logistics support and timely delivery.`,
                                        },
                                        {
                                            q: `How can I contact Raj Biosis?`,
                                            a: `You can fill out the enquiry form on this page or contact our team directly by phone or email for product details and quotations.`,
                                        },
                                    ].map((faq, index) => (
                                        <div
                                            key={index}
                                            className="group rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]"
                                        >
                                            <h4 className="text-xl font-bold text-[#2C2C2C]">
                                                {faq.q}
                                            </h4>

                                            <p className="mt-3 leading-8 text-[#6B7280]">
                                                {faq.a}
                                            </p>
                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div >
        </section >
    );
}