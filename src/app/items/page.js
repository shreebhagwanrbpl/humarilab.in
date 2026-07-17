"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { usePathname } from "next/navigation";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";

const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");



export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categorySearch, setCategorySearch] =
    useState("");

  const [productSearch, setProductSearch] =
    useState("");
  const [loading, setLoading] = useState(true);



  const [openedCategory, setOpenedCategory] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const [pendingScroll, setPendingScroll] =
    useState(null);

  const [loadedImages, setLoadedImages] =
    useState({});

  const [showTopButton, setShowTopButton] =
    useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const district =
    pathParts[0] === "items"
      ? null
      : pathParts[0];

  useEffect(() => {
    const fetchProducts = async () => {
      try {

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

        const allProducts = [];

        categorySnap.forEach((categoryDoc) => {

          const data = categoryDoc.data();

          const categoryProducts =
            (data.products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `${categoryDoc.id}-${index}`,
                category:
                  data.category ||
                  categoryDoc.id,
                slug:
                  item.slug ||
                  makeSlug(item.title),
              }));

          allProducts.push(
            ...categoryProducts
          );

        });

        const oldSnap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "products"
          )
        );

        if (oldSnap.exists()) {

          const oldProducts =
            (oldSnap.data().products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `other-${index}`,
                category:
                  "Other Products",
                slug:
                  item.slug ||
                  makeSlug(item.title),
              }));

          allProducts.push(
            ...oldProducts
          );

        }
        console.log("ALL PRODUCTS", allProducts);
        setProducts(allProducts);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const text = `
      ${item.title}
      ${item.brand}
      ${item.model}
      ${item.category}
      `
        .toLowerCase();

      return text.includes(
        productSearch.toLowerCase()
      );
    });
  }, [products, productSearch]);

  const groupedProducts = useMemo(() => {
    const obj = {};

    filteredProducts.forEach((item) => {
      if (!obj[item.category]) {
        obj[item.category] = [];
      }

      obj[item.category].push(item);
    });

    return obj;
  }, [filteredProducts]);

  const sortedGroupedProducts =
    useMemo(() => {

      const entries =
        Object.entries(
          groupedProducts
        );

      entries.sort(([a], [b]) => {

        if (
          a === "Other Products"
        )
          return 1;

        if (
          b === "Other Products"
        )
          return -1;

        return a.localeCompare(b);

      });

      return Object.fromEntries(
        entries
      );

    }, [groupedProducts]);
  const categories =
    Object.keys(groupedProducts);

  const toggleCategory = (category) => {
    if (openedCategory === category) {
      setOpenedCategory("");
      return;
    }

    setOpenedCategory(category);
  };

  const scrollToProduct = (
    slug,
    category
  ) => {
    setOpenedCategory(category);
    setActiveCategory(category);
    setPendingScroll(slug);
  };

  useEffect(() => {
    if (!pendingScroll) return;

    const timer = setTimeout(() => {
      const el =
        document.getElementById(
          pendingScroll
        );

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setPendingScroll(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [openedCategory, pendingScroll]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(
        window.scrollY > 500
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-[32px] bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Our Products"
        subtitle="Explore advanced biomedical and diagnostic equipment designed for modern healthcare excellence."
      />

      {/* Products */}
      <section className="section-padding bg-white">
        <div className="container-custom">

          <SectionTitle
            badge="Featured Products"
            title="Premium Biomedical Equipment"
            description="Discover high-quality diagnostic and biomedical technologies tailored for laboratories, healthcare institutions, and modern diagnostics."
            center
          />
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mt-6 lg:mt-10 px-4 lg:px-0 relative">
          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) =>
              setProductSearch(e.target.value)
            }
            className="w-full h-16 pl-14 pr-5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-10 mt-8 lg:mt-16 items-start px-4 lg:px-0">
          <aside
            className="
    lg:sticky
    lg:top-24
    self-start
    rounded-3xl
    border
    border-[#EADBC8]
    bg-[#FFFDFB]
    shadow-[0_20px_60px_rgba(111,78,55,0.10)]
    p-5 lg:p-6
  "
          >

            {/* Heading */}

            <h3 className="mb-6 text-2xl font-bold text-[#2C2C2C]">

              Categories

            </h3>

            <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

            {/* Categories */}

            <div className="space-y-3">

              {Object.keys(sortedGroupedProducts)
                .filter((category) =>
                  category
                    .toLowerCase()
                    .includes(categorySearch.toLowerCase())
                )
                .map((category) => (

                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-[#EADBC8] bg-[#FFFDFB]"
                  >

                    {/* Category Button */}

                    <button
                      onClick={() => toggleCategory(category)}
                      className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-300

              ${activeCategory === category
                          ? "bg-[#6F4E37] text-white"
                          : "bg-[#FFFDFB] text-[#2C2C2C] hover:bg-[#F8F5F2]"
                        }
            `}
                    >

                      <span className="flex items-center gap-3 font-medium">

                        {openedCategory === category ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}

                        {category}

                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold

                ${activeCategory === category
                            ? "bg-white/20 text-white"
                            : "bg-[#EADBC8] text-[#6F4E37]"
                          }
              `}
                      >

                        {groupedProducts[category].length}

                      </span>

                    </button>

                    {/* Products */}

                    <div
                      className={`custom-scrollbar overflow-y-auto transition-all duration-300

              ${openedCategory === category
                          ? "max-h-72"
                          : "max-h-0 overflow-hidden"
                        }
            `}
                    >

                      {groupedProducts[category].map((item) => (

                        <button
                          key={item.uid}
                          onClick={() =>
                            scrollToProduct(item.slug, category)
                          }
                          className="block w-full border-t border-[#F1E5D9] px-6 py-3 text-left text-[#6B7280] transition-all duration-300 hover:bg-[#F8F5F2] hover:text-[#6F4E37]"
                        >

                          {item.title}

                        </button>

                      ))}

                    </div>

                  </div>

                ))}

            </div>

          </aside>



          {/* ==========================
                RIGHT SIDE START
            ========================== */}

          <div className="space-y-16">
            {filteredProducts.length === 0 ? (

              <div className="bg-white border border-slate-200 rounded-[32px] p-10 lg:p-16 text-center shadow-lg">

                <div className="w-24 h-24 mx-auto rounded-full bg-[#EADBC8] flex items-center justify-center text-5xl mb-6 shadow-md">
                  🔍
                </div>

                {/* Badge */}
                <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
                  No Products Found
                </span>

                {/* Heading */}
                <h2 className="mt-6 text-3xl lg:text-4xl font-extrabold text-[#2C2C2C]">
                  Product Not Found
                </h2>

                {/* Accent Line */}
                <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                {/* Description */}
                <p className="mt-6 max-w-xl mx-auto text-lg leading-8 text-[#6B7280]">
                  We couldn't find any products matching
                  <span className="font-semibold text-[#6F4E37]">
                    {" "} "{productSearch}" {" "}
                  </span>
                  . Please try another keyword or browse all available products.
                </p>

                {/* Button */}
                <button
                  onClick={() => setProductSearch("")}
                  className="mt-10 rounded-2xl bg-[#6F4E37] px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3E2C] hover:shadow-xl"
                >
                  View All Products
                </button>

              </div>

            ) : (

              Object.entries(groupedProducts).map(
                ([category, list]) => (

                  <section
                    key={category}
                    id={category
                      .replace(/\s+/g, "-")
                      .toLowerCase()}
                  >

                    {/* Category Header */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EADBC8] pb-5 mb-8">

                      <div>
                        {/* Badge */}
                        <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-1.5 text-sm font-semibold text-[#6F4E37] shadow-sm mb-3">
                          Product Category
                        </span>

                        {/* Heading */}
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2C2C2C]">
                          {category}
                        </h2>

                        {/* Accent Line */}
                        <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />
                      </div>

                      {/* Product Count */}
                      <span className="inline-flex items-center rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
                        {list.length} Products
                      </span>

                    </div>

                    {/* Product List */}

                    <div className="space-y-8">
                      {list.map((product) => (
                        <div
                          key={product.uid}
                          id={product.slug}
                          className="rounded-[32px] border border-[#EADBC8] bg-white p-8 shadow-lg shadow-[#EADBC8]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#B08968]/20"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_180px] gap-5 lg:gap-8 items-center">
                            {/* Image */}
                            <div className="relative h-[180px] sm:h-[220px] overflow-hidden rounded-3xl border border-[#EADBC8] bg-[#FFF8F3]">
                              {!loadedImages[product.uid] && (
                                <div className="absolute inset-0 animate-pulse bg-[#F5ECE3]" />
                              )}

                              <img
                                src={
                                  product.images?.[0] ||
                                  product.image ||
                                  "/placeholder.jpg"
                                }
                                alt={product.title}
                                onLoad={() =>
                                  setLoadedImages((prev) => ({
                                    ...prev,
                                    [product.uid]: true,
                                  }))
                                }
                                onError={(e) => {
                                  console.log("IMAGE ERROR:", e.currentTarget.src);
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                                className={`h-full w-full object-contain p-5 transition duration-500 ${loadedImages[product.uid]
                                  ? "opacity-100"
                                  : "opacity-0"
                                  }`}
                              />
                            </div>

                            {/* Content */}
                            <div>
                              {/* Badge */}
                              <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-1.5 text-sm font-semibold text-[#6F4E37] shadow-sm">
                                Biomedical Equipment
                              </span>

                              {/* Title */}
                              <h3 className="mt-4 text-2xl lg:text-3xl font-extrabold text-[#2C2C2C]">
                                {product.title}
                              </h3>

                              {/* Accent Line */}
                              <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                              {/* Description */}
                              <p className="mt-5 leading-8 text-[#6B7280]">
                                {product.description ||
                                  product.desc ||
                                  "Premium biomedical equipment designed for laboratories, hospitals and diagnostic centres."}
                              </p>

                              {/* Details */}
                              <div className="mt-7 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] p-4 transition hover:bg-[#FDF5EE] hover:shadow-md">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B5F]">
                                    Brand
                                  </p>
                                  <p className="mt-2 font-bold text-[#2C2C2C]">
                                    {product.brand || "N/A"}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] p-4 transition hover:bg-[#FDF5EE] hover:shadow-md">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B5F]">
                                    Model
                                  </p>
                                  <p className="mt-2 font-bold text-[#2C2C2C]">
                                    {product.model || "N/A"}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] p-4 transition hover:bg-[#FDF5EE] hover:shadow-md">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B5F]">
                                    Instrument
                                  </p>
                                  <p className="mt-2 font-bold text-[#2C2C2C]">
                                    {product.instrument || "N/A"}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] p-4 transition hover:bg-[#FDF5EE] hover:shadow-md">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B5F]">
                                    Category
                                  </p>
                                  <p className="mt-2 font-bold text-[#2C2C2C]">
                                    {product.category}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Button */}
                            <div className="flex justify-center lg:justify-end">
                              <Link
                                href={
                                  district
                                    ? `/${district}/items/${product.slug}`
                                    : `/items/${product.slug}`
                                }
                                className="group inline-flex items-center gap-2 rounded-2xl bg-[#6F4E37] px-8 py-4 font-semibold !text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3E2C] hover:!text-white hover:shadow-xl"
                              >
                                <span className="!text-white">Get Quote</span>

                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 !text-white transition-transform duration-300 group-hover:translate-x-1"
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
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                ))
            )}

          </div>

        </div>

      </section>

      {/* Why Choose Products */}
      <section className="section-padding bg-gradient-to-br from-[#FFFDF9] via-[#F8F5F0] to-[#F3ECE4]">
        <div className="container-custom">
          <SectionTitle
            badge="Why Our Products"
            title="Trusted Quality & Innovation"
            description="We provide biomedical products designed for performance, reliability, and healthcare excellence."
            center
          />

          <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ShieldCheck size={30} />,
                title: "Certified Quality",
              },
              {
                icon: <Truck size={30} />,
                title: "Fast Delivery",
              },
              {
                icon: <BadgeCheck size={30} />,
                title: "Trusted Support",
              },
              {
                icon: <PackageCheck size={30} />,
                title: "Premium Equipment",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group rounded-[32px] border border-[#EADBC8] bg-white p-8 text-center shadow-lg shadow-[#EADBC8]/30 transition-all duration-300 hover:-translate-y-2 hover:border-[#B08968] hover:shadow-2xl hover:shadow-[#B08968]/20"
              >
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#DCCBB8] bg-[#FFF8F3] text-[#6F4E37] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F7EFE7]">
                  {item.icon}
                </div>

                {/* Badge */}
                <span className="inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F4E37] shadow-sm">
                  Premium
                </span>

                {/* Title */}
                <h3 className="mt-5 text-2xl font-bold text-[#2C2C2C]">
                  {item.title}
                </h3>

                {/* Accent Line */}
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                {/* Description */}
                <p className="mt-5 leading-7 text-[#6B7280]">
                  High-quality biomedical solutions engineered for hospitals,
                  laboratories, diagnostic centres, and healthcare professionals.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <CTASection />

      {/* Back To Top */}

      {showTopButton && (

        <button
          onClick={scrollToTop}
          className="group fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#DCCBB8] bg-[#6F4E37] text-white shadow-xl shadow-[#6F4E37]/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[#5B3E2C] hover:shadow-2xl hover:shadow-[#6F4E37]/40"
        >
          <ChevronUp
            size={24}
            className="transition-transform duration-300 group-hover:-translate-y-1"
          />
        </button>

      )}

    </>

  );

}