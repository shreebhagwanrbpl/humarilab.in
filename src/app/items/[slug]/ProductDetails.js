"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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

import {
    doc,
    getDoc,
    getDocs,
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
export default function ProductDetails({ slug }) {
    const [product, setProduct] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);

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

    const city =
        pathParts.length > 1
            ? pathParts[0]
            : "India";

    const cityName =
        city.charAt(0).toUpperCase() +
        city.slice(1);

    useEffect(() => {
        const loadProduct = async () => {
            try {

                // NORMAL PRODUCTS
                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "centralbiomedicals",
                        "pages",
                        "products"
                    )
                );

                let allProducts = [];

                if (snap.exists()) {
                    allProducts = (snap.data().products || []).map((item) => ({
                        ...item,
                        slug:
                            item.slug ||
                            item.productSlug ||
                            makeSlug(item.title),
                    }));
                }

                // CATEGORY PRODUCTS
                const categorySnap = await getDocs(
                    collection(
                        db,
                        "websites",
                        "centralbiomedicals",
                        "pages",
                        "categoryproducts",
                        "categories"
                    )
                );

                categorySnap.forEach((docSnap) => {
                    const data = docSnap.data();

                    if (data.products?.length) {
                        allProducts.push(
                            ...(data.products || []).map((item) => ({
                                ...item,
                                slug:
                                    item.slug ||
                                    item.productSlug ||
                                    makeSlug(item.title),
                            }))
                        );
                    }
                });

                const found = allProducts.find(
                    (p) => p.slug === slug
                );
                console.log("URL SLUG:", slug);

                allProducts.forEach((p) => {
                    console.log("PRODUCT:", p.title);
                    console.log("PRODUCT SLUG:", p.slug);
                });
                console.log("SLUG FROM URL:", slug);
                console.log(
                    "TOTAL PRODUCTS:",
                    allProducts.length
                );
                console.log(
                    "FOUND PRODUCT:",
                    found
                );

                setProduct(found || null);

                if (found) {

                    if (
                        found.images?.length > 0
                    ) {
                        setSelectedImage(
                            found.images[0]
                        );
                    } else {
                        setSelectedImage(
                            found.image || ""
                        );
                    }

                    setSelectedMedia("image");
                }

            } catch (error) {
                console.error(error);
            }
        };

        loadProduct();
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

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "centralbiomedicals",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: product.title,
                    productSlug: product.slug,
                    brand: product.brand || "",
                    model: product.model || "",
                    createdAt: new Date(),
                }
            );

            toast.success(
                "Your enquiry has been submitted successfully."
            );

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error(error);
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
            brand: {
                "@type": "Brand",
                name: product.brand || "Central Biomedicals",
            },
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
                        text: "Yes, installation and technical support are available.",
                    },
                },
            ],
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const shareText = `🔬 ${product?.title}

${product?.desc}

🌐 ${window.location.href}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank"
        );
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
            <div className="container-custom">
                <div className="mb-6 text-sm text-slate-500">
                    Home / Products / {product.title}
                </div>
                {/* Top Section */}

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Image */}

                    <div>

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
                                    {!imageLoaded && (
                                        <div className="absolute inset-0 animate-pulse bg-[#F5ECE3]" />
                                    )}

                                    <Image
                                        src={selectedImage || product.image}
                                        alt={product.title}
                                        fill
                                        priority
                                        onLoad={() => setImageLoaded(true)}
                                        className={`object-contain p-6 transition duration-500 ${imageLoaded
                                            ? "opacity-100"
                                            : "opacity-0"
                                            }`}
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
                                    <Image
                                        src={img}
                                        alt=""
                                        width={80}
                                        height={80}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
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

                    </div>

                    {/* Product Details */}

                    <div>

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

                        <div className="mt-6 rounded-[32px] border border-[#EADBC8] bg-white p-6 shadow-xl shadow-[#EADBC8]/30 md:mt-8 md:p-8">

                            {/* Header */}
                            <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-1.5 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                Product Specifications
                            </span>

                            <h3 className="mt-4 text-2xl font-bold text-[#2C2C2C]">
                                Technical Details
                            </h3>

                            <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                            {/* Specifications */}
                            <div className="mt-8 grid gap-4 sm:grid-cols-2">

                                {[
                                    ["Brand", product.brand],
                                    ["Model", product.model],
                                    ["Instrument", product.instrument],
                                    ["Capacity", product.capacity],
                                    ["Throughput", product.throughput],
                                    ["Usage", product.usage],
                                    ["Automation", product.automation],
                                    ["Availability", product.availability],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B5F]">
                                            {label}
                                        </p>

                                        <p className="mt-2 text-lg font-bold text-[#2C2C2C]">
                                            {value || "N/A"}
                                        </p>
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                </div>

                {/* Description + Form */}

                <div className="mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] gap-6 md:gap-8">

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

                        {/* Description */}

                        <div className="rounded-[24px] border border-[#EADBC8] bg-white p-5 shadow-xl shadow-[#EADBC8]/30 md:rounded-[32px] md:p-10">

                            {/* Badge */}
                            <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                Product Information
                            </span>

                            {/* Heading */}
                            <h3 className="mt-5 text-2xl font-extrabold text-[#2C2C2C] md:text-3xl">
                                Product Description
                            </h3>

                            {/* Accent Line */}
                            <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                            {/* Description */}
                            <p className="mt-6 text-base leading-8 text-[#6B7280] md:text-lg md:leading-9">
                                {product.desc ||
                                    product.description ||
                                    "No description available."}
                            </p>

                            {/* Specifications */}
                            <div className="mt-12">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-[#2C2C2C]">
                                        Technical Specifications
                                    </h3>

                                    <span className="rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-1.5 text-sm font-semibold text-[#6F4E37]">
                                        Specifications
                                    </span>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-[#EADBC8]">
                                    <table className="w-full border-collapse">
                                        <tbody>

                                            {[
                                                ["Brand", product.brand],
                                                ["Model", product.model],
                                                ["Usage", product.usage],
                                                ["Automation", product.automation],
                                                ["Capacity", product.capacity],
                                                ["Throughput", product.throughput],
                                            ].map(([label, value], index) => (
                                                <tr
                                                    key={label}
                                                    className={index % 2 === 0 ? "bg-[#FFF8F3]" : "bg-white"}
                                                >
                                                    <td className="w-1/3 border-b border-[#EADBC8] px-5 py-4 font-semibold text-[#6F4E37]">
                                                        {label}
                                                    </td>

                                                    <td className="border-b border-[#EADBC8] px-5 py-4 text-[#2C2C2C]">
                                                        {value || "N/A"}
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SEO Content */}
                            <div className="mt-14">

                                <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                    Why Choose Us
                                </span>

                                <h3 className="mt-5 text-2xl font-bold text-[#2C2C2C]">
                                    Why Choose Central Biomedicals in {cityName}?
                                </h3>

                                <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                                <p className="mt-6 leading-8 text-[#6B7280]">
                                    Central Biomedicals is a trusted supplier and distributor of{" "}
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
                                        Central Biomedicals supplies <strong>{product.title}</strong> in{" "}
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
                                        Central Biomedicals is a trusted dealer of{" "}
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
                                        <strong>{cityName}</strong> at competitive prices. Contact Central
                                        Biomedicals for the latest quotation, product availability, expert
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
                                        Central Biomedicals for the latest pricing, product availability,
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
                                            q: `How can I contact Central Biomedicals?`,
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