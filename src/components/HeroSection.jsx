"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import laboratoryHeroBanner from "../components/img/laboratory_hero_banner.png";

import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function HeroSection({ city }) {
  const [loading, setLoading] = useState(true);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "humarilabin", "pages", "home")
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // District Routing
  const districtSlug = city
    ? city.toLowerCase().replace(/\s+/g, "-")
    : "";

  const makeLink = (path) => {
    return districtSlug ? `/${districtSlug}${path}` : path;
  };

  return (
    <section className="relative w-full min-h-[65vh] lg:min-h-[70vh] flex items-center overflow-hidden bg-[#F8F5F2]">
      {/* Background Banner Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={laboratoryHeroBanner}
          alt="Advanced Laboratory Technology"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] md:object-[right_center]"
        />
        {/* Premium smooth horizontal gradient for text legibility on desktop */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: "linear-gradient(to right, #F8F5F2 0%, #F8F5F2 45%, rgba(248, 245, 242, 0.9) 65%, rgba(248, 245, 242, 0) 100%)"
          }}
        />
        {/* Soft solid overlay for text readability on mobile */}
        <div className="absolute inset-0 bg-[#F8F5F2]/85 md:hidden" />
      </div>

      <div className="container-custom relative z-10 py-12 lg:py-16 w-full">
        {/* Content Container aligned left, taking 55-60% width on desktop to let title fit in 2 lines */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full md:max-w-[65%] lg:max-w-[58%]"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#EADBC8] text-[#6F4E37] border border-[#D6C0A8] px-5 py-2 rounded-full text-sm font-semibold shadow-sm mb-6">
            <ShieldCheck size={18} className="text-[#6F4E37]" />
            Trusted Biomedical Systems
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-tight text-[#2C2C2C] max-w-2xl">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-[#EADBC8] rounded w-[80%]"></div>
                <div className="h-10 bg-[#EADBC8] rounded w-[60%]"></div>
              </div>
            ) : (
              <>
                {heroData.title}
                {city && (
                  <>
                    <br />
                    <span className="text-xl lg:text-3xl text-[#6F4E37] font-semibold">
                      in {city}
                    </span>
                  </>
                )}
              </>
            )}
          </h1>

          {/* Description */}
          {loading ? (
            <div className="animate-pulse mt-5 space-y-3">
              <div className="h-4 bg-[#EADBC8] rounded w-full"></div>
              <div className="h-4 bg-[#EADBC8] rounded w-[90%]"></div>
            </div>
          ) : (
            <p className="mt-5 text-[#6B7280] text-base lg:text-lg leading-7 lg:leading-8 max-w-xl">
              {heroData.description}
              {city && (
                <>
                  {" "}
                  across <strong className="text-[#6F4E37]">{city}</strong>
                </>
              )}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {loading ? (
              <>
                <div className="animate-pulse h-12 w-44 bg-[#EADBC8] rounded-xl"></div>
                <div className="animate-pulse h-12 w-36 bg-[#EADBC8] rounded-xl"></div>
              </>
            ) : (
              <>
                <Link href={makeLink("/items")}>
                  <button className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#4E342E] text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                    {heroData.button1Text || "Explore Products"}
                    <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href={makeLink("/contact")}>
                  <button className="px-7 py-3 rounded-xl font-semibold border-2 border-[#6F4E37] text-[#6F4E37] bg-white hover:bg-[#F3ECE6] transition-all duration-300">
                    {heroData.button2Text || "Contact Us"}
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 lg:gap-12 mt-10">
            <div className="border-l-4 border-[#B08968] pl-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#6F4E37]">10+</h3>
              <p className="text-sm text-[#6B7280] mt-1">Years Experience</p>
            </div>
            <div className="border-l-4 border-[#B08968] pl-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#6F4E37]">500+</h3>
              <p className="text-sm text-[#6B7280] mt-1">Products Delivered</p>
            </div>
            <div className="border-l-4 border-[#B08968] pl-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#6F4E37]">100%</h3>
              <p className="text-sm text-[#6B7280] mt-1">Quality Assurance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}