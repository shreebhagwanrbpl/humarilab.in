"use client";

import React, { useEffect, useMemo, useState, useCallback, memo, Profiler } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  Search,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
// import CTASection from "@/components/CTASection";
import ProductCard from "@/components/ProductCard";
import { fetchFullCatalog } from "@/lib/data-fetcher";

// 1. Memoized Product Link Component
const ProductLink = memo(function ProductLink({ item, category, scrollToProduct }) {
  return (
    <button
      onClick={() => scrollToProduct(item.slug, category)}
      className="block w-full text-left py-1 text-sm text-slate-500 hover:text-[#6F4E37] hover:translate-x-1 transition-all duration-200 font-medium"
    >
      • {item.title}
    </button>
  );
});

// 2. Memoized Subcategory Component (renders product list only when expanded)
const SubCategoryItem = memo(function SubCategoryItem({
  category,
  subCategory,
  subList,
  isSubOpened,
  toggleSubCategory,
  scrollToProduct,
}) {
  return (
    <div className="space-y-2 pl-2">
      {/* Subcategory Header */}
      <button
        onClick={() => toggleSubCategory(category, subCategory)}
        className="w-full text-left py-1.5 flex justify-between items-center text-xs font-bold text-[#6F4E37] hover:text-fuchsia-600 transition-colors uppercase tracking-wider border-b border-[#EADBC8] pb-1"
      >
        <span className="flex items-center gap-1.5">
          <span className={`transition-transform duration-200 ${isSubOpened ? "rotate-90" : ""}`}>
            <ChevronRight size={12} className="text-[#6F4E37]" />
          </span>
          {subCategory}
        </span>
        <span className="text-[10px] font-semibold bg-gradient-to-r from-[#F8F3EE] via-white to-[#FFFDFB] text-[#6F4E37] px-1.5 py-0.5 rounded-full">
          {subList.length}
        </span>
      </button>

      {/* Product List Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out pl-3 overflow-hidden ${isSubOpened
          ? "max-h-48 opacity-100 mt-1 mb-2"
          : "max-h-0 opacity-0"
          }`}
      >
        {isSubOpened && (
          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
            {subList.map((item) => (
              <ProductLink
                key={item.uid}
                item={item}
                category={category}
                scrollToProduct={scrollToProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// 3. Memoized Category Component (renders subcategories only when expanded)
const CategoryItem = memo(function CategoryItem({
  category,
  isOpened,
  isActive,
  subcategories,
  categoryProductCount,
  toggleCategory,
  toggleSubCategory,
  openedSubCategories,
  scrollToProduct,
}) {
  return (
    <div className="group">
      <button
        onClick={() => toggleCategory(category)}
        className={`sticky top-[116px] z-10 w-full px-4 py-3 flex justify-between items-center rounded-2xl transition-all duration-200 text-left ${isActive
          ? "bg-gradient-to-r from-[#F8F3EE] via-white to-[#FFFDFB] text-[#6F4E37] font-bold"
          : "bg-white text-[#6F4E37] hover:bg-gradient-to-r hover:bg-[#F8F3EE] hover:text-[#6F4E37]"
          }`}
      >
        <span className="flex items-center gap-3 text-sm font-semibold leading-none">
          <span className={`transition-transform duration-200 ${isOpened ? "rotate-90" : ""}`}>
            <ChevronRight size={16} className={isActive ? "text-[#6F4E37]" : "text-slate-400 group-hover:text-[#6F4E37]"} />
          </span>
          {category}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-gradient-to-r from-[#F8F3EE] via-white to-[#FFFDFB] text-fuchsia-600" : "bg-[#F8F3EE] text-slate-500"
          }`}>
          {categoryProductCount}
        </span>
      </button>

      {/* Subcategories Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out pl-4 overflow-hidden ${isOpened
          ? "max-h-[1000px] opacity-100 mt-2 mb-4"
          : "max-h-0 opacity-0"
          }`}
      >
        {isOpened && (
          <div className="space-y-3 pt-1">
            {Object.entries(subcategories || {}).map(([subCategory, subList]) => {
              const subKey = `${category}-${subCategory}`;
              const isSubOpened = !!openedSubCategories[subKey];

              return (
                <SubCategoryItem
                  key={subKey}
                  category={category}
                  subCategory={subCategory}
                  subList={subList}
                  isSubOpened={isSubOpened}
                  toggleSubCategory={toggleSubCategory}
                  scrollToProduct={scrollToProduct}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default function ProductsClient({ initialProducts = [], district = null, city = null }) {
  const searchParams = useSearchParams();
  const [productsList, setProductsList] = useState(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [categorySearch, setCategorySearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [openedSubCategories, setOpenedSubCategories] = useState({});
  const [pendingScroll, setPendingScroll] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);

  // Live synchronization with Master Catalog (/api/catalog)
  const syncCatalog = useCallback(async (force = false) => {
    try {
      const url = `/api/catalog?${force ? "force=1&" : ""}t=${Date.now()}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProductsList(data.products);
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.warn("[ProductsClient] Live sync error:", err);
    }
  }, []);

  // Set up live sync triggers (window focus, visibilitychange, online, background polling)
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProductsList(initialProducts);
      setIsLoading(false);
    } else {
      syncCatalog(true);
    }

    // Smart background poll every 10s only when the tab is actively visible
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        syncCatalog(false);
      }
    }, 10000);

    // Instant forced sync when user switches tab from Admin to humarilab.in
    const onFocus = () => syncCatalog(true);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncCatalog(true);
      }
    };
    const onOnline = () => syncCatalog(true);

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", onOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("online", onOnline);
    };
  }, [initialProducts, syncCatalog]);

  // Debounce search term updates to make search typing instant
  useEffect(() => {
    const timer = setTimeout(() => {
      setProductSearch(searchInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Combined single-pass product filtering, grouping, category count, and sorting for maximum performance
  const { filteredProducts, sortedGroupedProducts, categoryCounts } = useMemo(() => {
    const start = performance.now();
    const query = productSearch.trim().toLowerCase();
    const filtered = query
      ? productsList.filter((item) => {
        const title = (item.title || "").toLowerCase();
        const brand = (item.brand || "").toLowerCase();
        const model = (item.model || "").toLowerCase();
        const category = (item.category || "").toLowerCase();
        const subCategory = (item.subCategory || "").toLowerCase();

        return (
          title.includes(query) ||
          brand.includes(query) ||
          model.includes(query) ||
          category.includes(query) ||
          subCategory.includes(query)
        );
      })
      : productsList;

    const grouped = {};
    const counts = {};

    filtered.forEach((item) => {
      const cat = item.category || "Other Products";
      const sub = item.subCategory || cat;

      if (!grouped[cat]) {
        grouped[cat] = {};
        counts[cat] = 0;
      }
      if (!grouped[cat][sub]) {
        grouped[cat][sub] = [];
      }

      grouped[cat][sub].push(item);
      counts[cat]++;
    });

    const entries = Object.entries(grouped);
    entries.sort(([a], [b]) => {
      if (a === "Other Products") return 1;
      if (b === "Other Products") return -1;
      return a.localeCompare(b);
    });

    const sortedObj = {};
    for (const [cat, subObj] of entries) {
      const subEntries = Object.entries(subObj);
      subEntries.sort(([a], [b]) => {
        if (a === cat) return -1;
        if (b === cat) return 1;
        return a.localeCompare(b);
      });
      sortedObj[cat] = Object.fromEntries(subEntries);
    }

    const end = performance.now();
    console.log(`[ProductsClient] Grouping, filtering, and sorting completed in ${(end - start).toFixed(2)}ms, total products: ${productsList.length}`);

    return {
      filteredProducts: filtered,
      sortedGroupedProducts: sortedObj,
      categoryCounts: counts,
    };
  }, [productsList, productSearch]);

  const getCategoryProductCount = useCallback((categoryName) => {
    return categoryCounts[categoryName] || 0;
  }, [categoryCounts]);

  const toggleCategory = useCallback((category) => {
    setOpenedCategory((prev) => (prev === category ? "" : category));
  }, []);

  const toggleSubCategory = useCallback((category, subCategory) => {
    const key = `${category}-${subCategory}`;
    setOpenedSubCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Handle pre-selecting category from URL query parameter (e.g. ?category=Name)
  useEffect(() => {
    const catParam = searchParams ? searchParams.get("category") : null;
    if (catParam) {
      // Find matching category (case-insensitive)
      const matchedCategory = Object.keys(sortedGroupedProducts).find(
        (cat) => cat.toLowerCase() === decodeURIComponent(catParam).toLowerCase()
      );
      if (matchedCategory) {
        setOpenedCategory(matchedCategory);
        setActiveCategory(matchedCategory);
        
        // Scroll to the category section
        setTimeout(() => {
          const sectionId = matchedCategory.replace(/\s+/g, "-").toLowerCase();
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 400);
      }
    }
  }, [searchParams, sortedGroupedProducts]);

  const scrollToProduct = useCallback((slug, category) => {
    setOpenedCategory(category);
    setActiveCategory(category);
    setPendingScroll(slug);

    // Auto-expand the target subcategory when scrolling to its product
    const prod = productsList.find((p) => p.slug === slug);
    if (prod && prod.subCategory) {
      const subKey = `${category}-${prod.subCategory}`;
      setOpenedSubCategories((prev) => ({
        ...prev,
        [subKey]: true,
      }));
    }
  }, [productsList]);

  // Scroll to selected sidebar item when category expansion finishes
  useEffect(() => {
    if (!pendingScroll) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(pendingScroll);
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

  // Scroll back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Measure hydration completion time
  useEffect(() => {
    if (typeof window !== "undefined" && window.performance) {
      const navigationStart = window.performance.timing?.navigationStart || 0;
      if (navigationStart) {
        const timeSinceNavigation = Date.now() - navigationStart;
        console.log(`[ProductsClient] Hydration completed in ${timeSinceNavigation}ms since navigation start`);
      }
    }
  }, []);

  const onRenderCallback = (id, phase, actualDuration) => {
    console.log(`[React Profiler] ${id} render time (${phase}): ${actualDuration.toFixed(2)}ms`);
  };

  return (
    <Profiler id="ProductsLayout" onRender={onRenderCallback}>
      {/* Banner */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "Raj Biosis",
            "url": "https://humarilab.in",
            "logo": "https://humarilab.in/logo.png",
            "image": "https://humarilab.in/logo.png",
            "areaServed": city || "India",
            "description": `Medical laboratory and hospital equipment supplier in ${city || "India"}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": city || "Jaipur",
              "addressRegion": city ? "" : "Rajasthan",
              "addressCountry": "India",
            },
          }),
        }}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "15px",
            fontWeight: "600",
          },
        }}
      />
      {/* Products */}
      <section className="section-padding bg-white">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <SectionTitle
            badge="Featured Products"
            title="Premium Biomedical Equipment"
            description="Explore equipment and diagnostic technologies selected around laboratory processes, institutional requirements, and practical testing needs."
            center
          />

          {/* Search */}
          <div className="max-w-2xl mx-auto mt-6 lg:mt-10 relative">
            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-16 pl-14 pr-5 rounded-2xl border border-[#EADBC8] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-10 mt-8 lg:mt-16 items-start">
          {/* Main Sidebar (Only scrollable container for the sidebar) */}
          <aside className="lg:sticky lg:top-24 self-start rounded-[32px] border border-[#EADBC8] bg-white shadow-[0_20px_45px_rgba(111,78,55,0.12)] px-6 pb-6 pt-0 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar relative">
            {/* Sticky Header Section */}
            <div className="sticky top-0 -mx-6 pt-6 px-6 pb-3 bg-white z-20 border-b border-[#EADBC8] mb-4 h-[116px]">
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-3 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-xs bg-[#F8F3EE] text-slate-500 font-semibold px-2 py-0.5 rounded-full">
                  {Object.keys(sortedGroupedProducts).length}
                </span>
              </h3>

              {/* Sticky Category Search Box */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#EADBC8] bg-[#F8F3EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              {isLoading && Object.keys(sortedGroupedProducts).length === 0 ? (
                <div className="space-y-3 py-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-11 bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                Object.keys(sortedGroupedProducts)
                  .filter((category) =>
                    category.toLowerCase().includes(categorySearch.toLowerCase())
                  )
                  .map((category) => {
                    const isOpened = openedCategory === category;
                    const isActive = activeCategory === category;
                    const subcategories = sortedGroupedProducts[category] || {};
                    const count = getCategoryProductCount(category);

                    return (
                      <CategoryItem
                        key={category}
                        category={category}
                        isOpened={isOpened}
                        isActive={isActive}
                        subcategories={subcategories}
                        categoryProductCount={count}
                        toggleCategory={toggleCategory}
                        toggleSubCategory={toggleSubCategory}
                        openedSubCategories={openedSubCategories}
                        scrollToProduct={scrollToProduct}
                      />
                    );
                  })
              )}
            </div>
          </aside>

          {/* RIGHT SIDE START */}
          <div className="space-y-16">
            {isLoading ? (
              <div className="space-y-8">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[32px] border border-[#EADBC8] p-8 shadow-sm animate-pulse flex flex-col md:flex-row gap-6 items-center"
                  >
                    <div className="w-48 h-40 bg-slate-200 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-4 w-full">
                      <div className="h-7 bg-slate-200 rounded-lg w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        <div className="h-12 bg-slate-100 rounded-xl" />
                        <div className="h-12 bg-slate-100 rounded-xl" />
                        <div className="h-12 bg-slate-100 rounded-xl" />
                        <div className="h-12 bg-slate-100 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#EADBC8] rounded-[32px] p-10 lg:p-16 text-center shadow-[0_10px_30px_rgba(99,102,241,0.10)]">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#F8F3EE] via-white to-[#FFFDFB] flex items-center justify-center text-5xl mb-6">
                  🔍
                </div>

                <h2 className="text-2xl lg:text-4xl font-bold text-[#2C2C2C]">
                  Product Not Found
                </h2>

                <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-7">
                  {"We couldn't find any products matching"}
                  <span className="font-semibold text-[#6F4E37]">
                    {" \"" + productSearch + "\" "}
                  </span>
                  . Please try another keyword or browse categories.
                </p>

                <button
                  onClick={() => {
                    setSearchInput("");
                    setProductSearch("");
                  }}
                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#6F4E37] px-8 py-3.5 text-white font-semibold shadow-lg shadow-[#6F4E37]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4E342E] hover:shadow-[#6F4E37]/40 active:scale-95"                >
                  View All Products
                </button>
              </div>
            ) : (
              Object.entries(sortedGroupedProducts).map(
                ([category, subcategoriesObj]) => (
                  <section
                    key={category}
                    id={category.replace(/\s+/g, "-").toLowerCase()}
                  >
                    {/* Category Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#EADBC8] pb-4 lg:pb-5 mb-8">
                      <h2 className="text-3xl font-bold text-[#2C2C2C]">
                        {category}
                      </h2>
                      <span className="text-slate-500 font-medium">
                        {Object.values(subcategoriesObj).reduce(
                          (sum, list) => sum + list.length,
                          0
                        )}{" "}
                        Products
                      </span>
                    </div>

                    {/* Subcategories */}
                    <div className="space-y-12">
                      {Object.entries(subcategoriesObj).map(
                        (([subCategory, list]) => (
                          <div key={subCategory} className="space-y-6">
                            {/* Subcategory Heading */}
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-[#2C2C2C] uppercase tracking-wide">
                                {subCategory}
                              </h3>
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F8F3EE] text-slate-600">
                                {list.length}{" "}
                                {list.length === 1 ? "Product" : "Products"}
                              </span>
                            </div>

                            {/* Product List */}
                            <div className="space-y-8">
                              {list.slice(0, 12).map((product) => (
                                <ProductCard
                                  key={product.uid}
                                  product={product}
                                  district={district}
                                />
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                )
              )
            )}
          </div>
        </div>
      </div>
    </section>

      {/* Why Choose Products */}
      <section className="section-padding bg-[#F8F3EE]">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <SectionTitle
            badge="Why Our Products"
            title="Trusted Quality & Innovation"
            description="Our biomedical range focuses on practical performance, dependable operation, and suitability for professional healthcare use."
            center
          />

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">
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
                className="bg-white rounded-[30px] border border-[#EADBC8] shadow-[0_20px_45px_rgba(111,78,55,0.12)] text-center p-8"
              >
                <div className="w-16 h-16 mx-auto rounded-[22px] bg-gradient-to-r from-[#F8F3EE] via-white to-[#FFFDFB] text-[#6F4E37] flex items-center justify-center mb-6">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <CTASection /> */}

      {/* Back To Top */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#6F4E37] text-white shadow-lg shadow-[#6F4E37]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4E342E] active:scale-95"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </Profiler>
  );
}
