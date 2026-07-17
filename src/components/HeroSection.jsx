"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import CBG from "../components/img/CBG.png";

import {
  ArrowRight,
  ShieldCheck,
  Microscope,
  BadgeCheck,
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
          doc(db, "websites", "centralbiomedicals", "pages", "home")
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
    <section className="gradient-bg overflow-hidden">
      <div className="container-custom min-h-[85vh] py-20 lg:py-0 grid lg:grid-cols-2 gap-14 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#EADBC8] text-[#6F4E37] border border-[#D6C0A8] px-5 py-2 rounded-full text-sm font-semibold shadow-sm mb-7">
            <ShieldCheck size={18} className="text-[#6F4E37]" />
            Trusted Biomedical Systems
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-[#2C2C2C]">

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-[#EADBC8] rounded w-[80%]"></div>
                <div className="h-12 bg-[#EADBC8] rounded w-[60%]"></div>
                <div className="h-12 bg-[#EADBC8] rounded w-[70%]"></div>
              </div>
            ) : (
              <>
                {heroData.title}

                {city && (
                  <>
                    <br />

                    <span className="text-2xl lg:text-4xl text-[#6F4E37] font-semibold">
                      in {city}
                    </span>

                  </>
                )}

              </>
            )}

          </h1>

          {/* Description */}
          {loading ? (
            <div className="animate-pulse mt-7 space-y-3">
              <div className="h-4 bg-[#EADBC8] rounded w-full"></div>
              <div className="h-4 bg-[#EADBC8] rounded w-[90%]"></div>
              <div className="h-4 bg-[#EADBC8] rounded w-[75%]"></div>
            </div>
          ) : (
            <p className="mt-7 text-[#6B7280] text-lg leading-8 max-w-xl">

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

          <div className="flex flex-col sm:flex-row gap-4 mt-10">

            {loading ? (
              <>
                <div className="animate-pulse h-12 w-44 bg-[#EADBC8] rounded-xl"></div>
                <div className="animate-pulse h-12 w-36 bg-[#EADBC8] rounded-xl"></div>
              </>
            ) : (
              <>
                <Link href={makeLink("/services")}>

                  <button className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#4E342E] text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105">

                    {heroData.button1Text || "Explore Services"}

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

          <div className="flex flex-wrap gap-10 mt-14">

            <div className="border-l-4 border-[#B08968] pl-5">

              <h3 className="text-3xl font-bold text-[#6F4E37]">
                10+
              </h3>

              <p className="text-[#6B7280] mt-1">
                Years Experience
              </p>

            </div>

            <div className="border-l-4 border-[#B08968] pl-5">

              <h3 className="text-3xl font-bold text-[#6F4E37]">
                500+
              </h3>

              <p className="text-[#6B7280] mt-1">
                Products Delivered
              </p>

            </div>

            <div className="border-l-4 border-[#B08968] pl-5">

              <h3 className="text-3xl font-bold text-[#6F4E37]">
                100%
              </h3>

              <p className="text-[#6B7280] mt-1">
                Quality Assurance
              </p>

            </div>

          </div>

        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >

          {/* Main Image Card */}
          <div className="rounded-[40px] p-6 bg-[#F8F5F2] border border-[#EADBC8] shadow-[0_20px_60px_rgba(111,78,55,0.15)]">

            <Image
              src={CBG}
              alt="Central Biomedical"
              width={1200}
              height={900}
              className="rounded-[28px] object-cover object-[20%_center] h-[350px] sm:h-[450px] lg:h-[550px] w-full"
            />

          </div>

          {/* Floating Card 1 */}

          <div
            className="absolute top-10 -left-10 hidden lg:flex items-center gap-4 rounded-3xl bg-[#FFFDFB] border border-[#EADBC8] p-5 shadow-[0_15px_40px_rgba(111,78,55,0.12)]"
            style={{ marginTop: "-27px" }}
          >

            <div className="rounded-2xl bg-[#EADBC8] p-3">

              <Microscope
                className="text-[#6F4E37]"
                size={28}
              />

            </div>

            <div>

              <h4 className="font-bold text-[#2C2C2C]">
                Modern Labs
              </h4>

              <p className="text-sm text-[#6B7280]">
                Precision Equipment
              </p>

            </div>

          </div>

          {/* Floating Card 2 */}

          <div className="absolute bottom-10 -right-8 hidden lg:flex items-center gap-4 rounded-3xl bg-[#FFFDFB] border border-[#EADBC8] p-5 shadow-[0_15px_40px_rgba(111,78,55,0.12)]">

            <div className="rounded-2xl bg-[#B08968] p-3">

              <BadgeCheck
                className="text-white"
                size={28}
              />

            </div>

            <div>

              <h4 className="font-bold text-[#2C2C2C]">
                Trusted Quality
              </h4>

              <p className="text-sm text-[#6B7280]">
                Certified Solutions
              </p>

            </div>

          </div>

          {/* Coffee Glow */}

          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#B08968]/20 blur-[100px] -z-10"></div>

          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#6F4E37]/10 blur-[120px] -z-10"></div>

        </motion.div>

      </div>
    </section>
  );
}