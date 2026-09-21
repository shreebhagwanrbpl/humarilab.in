"use client";

import React from "react";
import Link from "next/link";

const ProductCard = React.memo(function ProductCard({ product, district }) {
    return (
        <div
            id={product.slug}
            className="bg-white rounded-[32px] border border-[#EADBC8] shadow-lg hover:shadow-2xl hover:border-[#B08968] transition-all duration-300 p-6 md:p-8"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_180px] gap-5 lg:gap-8 items-center">
                {/* Image */}
                <div className="relative h-[180px] sm:h-[220px] rounded-2xl lg:rounded-[24px] overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFF8F3] border border-[#EADBC8] flex items-center justify-center p-4">
                    <img
                        src={product.images?.[0] || product.image || "/placeholder.jpg"}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                        }}
                    />
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-2xl font-extrabold text-[#2C2C2C] hover:text-[#6F4E37] transition-colors duration-200">
                        {product.title}
                    </h3>
                    <p className="mt-4 text-slate-600 leading-8 text-[15px]">
                        {product.description ||
                            product.desc ||
                            "Biomedical equipment intended for laboratories, hospitals, diagnostic centres, and other professional healthcare settings."}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-xl p-2.5 sm:p-3 text-left hover:border-[#B08968] hover:bg-white transition-colors duration-200 flex flex-col justify-between">
                            <span className="block text-[10.5px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Brand</span>
                            <span className="font-bold text-[#2C2C2C] text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[34px] flex items-center" title={product.brand || "N/A"}>
                                {product.brand || "N/A"}
                            </span>
                        </div>
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-xl p-2.5 sm:p-3 text-left hover:border-[#B08968] hover:bg-white transition-colors duration-200 flex flex-col justify-between">
                            <span className="block text-[10.5px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Model</span>
                            <span className="font-bold text-[#2C2C2C] text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[34px] flex items-center" title={product.model || "N/A"}>
                                {product.model || "N/A"}
                            </span>
                        </div>
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-xl p-2.5 sm:p-3 text-left hover:border-[#B08968] hover:bg-white transition-colors duration-200 flex flex-col justify-between">
                            <span className="block text-[10.5px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Instrument</span>
                            <span className="font-bold text-[#2C2C2C] text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[34px] flex items-center" title={product.instrument || "N/A"}>
                                {product.instrument || "N/A"}
                            </span>
                        </div>
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-xl p-2.5 sm:p-3 text-left hover:border-[#B08968] hover:bg-white transition-colors duration-200 flex flex-col justify-between">
                            <span className="block text-[10.5px] uppercase tracking-wider text-[#8C6D53] font-semibold mb-1">Category</span>
                            <span className="font-bold text-[#2C2C2C] text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[34px] flex items-center" title={product.category || "N/A"}>
                                {product.category || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <div className="flex justify-center lg:justify-end w-full">
                    <Link
                        href={
                            district
                                ? `/${district}/items/${product.slug}`
                                : `/items/${product.slug}`
                        }
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#6F4E37] px-6 py-4 font-semibold !text-white shadow-md shadow-[#6F4E37]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4E342E] hover:shadow-[#6F4E37]/30 text-center"
                    >
                        Get Quote
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
