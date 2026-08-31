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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-2xl p-4 hover:border-[#B08968] hover:bg-white transition duration-300">
                            <p className="text-xs uppercase text-[#6F4E37] font-semibold tracking-wider">Brand</p>
                            <p className="font-bold text-[#2C2C2C] mt-1 text-sm">{product.brand || "N/A"}</p>
                        </div>
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-2xl p-4 hover:border-[#B08968] hover:bg-white transition duration-300">
                            <p className="text-xs uppercase text-[#6F4E37] font-semibold tracking-wider">Model</p>
                            <p className="font-bold text-[#2C2C2C] mt-1 text-sm">{product.model || "N/A"}</p>
                        </div>
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-2xl p-4 hover:border-[#B08968] hover:bg-white transition duration-300">
                            <p className="text-xs uppercase text-[#6F4E37] font-semibold tracking-wider">Instrument</p>
                            <p className="font-bold text-[#2C2C2C] mt-1 text-sm">{product.instrument || "N/A"}</p>
                        </div>
                        <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-2xl p-4 hover:border-[#B08968] hover:bg-white transition duration-300">
                            <p className="text-xs uppercase text-[#6F4E37] font-semibold tracking-wider">Category</p>
                            <p className="font-bold text-[#2C2C2C] mt-1 text-sm">{product.category || "N/A"}</p>
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
