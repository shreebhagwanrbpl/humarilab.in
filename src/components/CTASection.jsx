"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export default function CTASection({ city }) {

  const pathname = usePathname();

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
    "enquiry",
  ];

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const urlDistrict =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const districtSlug = city
    ? city.toLowerCase().replace(/\s+/g, "-")
    : urlDistrict;

  const makeLink = (path) => {
    if (!districtSlug) return path;

    if (path === "/") {
      return `/${districtSlug}`;
    }

    return `/${districtSlug}${path}`;
  };

  return (
    <section className="section-padding bg-[#F8F5F2]">
      <div className="container-custom">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="relative overflow-hidden rounded-[42px] bg-gradient-to-r from-[#4E342E] via-[#6F4E37] to-[#8B5E3C] p-10 lg:p-20 text-white shadow-[0_25px_70px_rgba(111,78,55,0.25)]"
        >

          {/* Background Glow */}
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#B08968]/25 blur-[120px]" />

          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#EADBC8]/10 blur-[120px]" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">

            {/* Left Side */}

            <div>

              <span className="inline-block bg-[#B08968]/25 border border-[#EADBC8]/30 px-5 py-2 rounded-full text-sm font-semibold mb-5 text-[#FFF8F3]">
                Get In Touch
              </span>

              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Need Premium Biomedical Solutions?
              </h2>

              <p className="mt-6 text-[#F5EDE6] text-lg leading-8 max-w-xl">
                Discover innovative diagnostic
                systems and trusted biomedical
                technologies tailored for modern
                healthcare excellence.
              </p>

            </div>

            {/* Right Card */}

            <div className="flex lg:justify-end">

              <div className="w-full max-w-md rounded-[32px] bg-[#FFFDFB] border border-[#EADBC8] p-8 shadow-[0_20px_60px_rgba(111,78,55,0.15)]">

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EADBC8]">

                  <PhoneCall
                    size={30}
                    className="text-[#6F4E37]"
                  />

                </div>

                <h3 className="text-2xl font-bold text-[#2C2C2C]">
                  Let's Talk
                </h3>

                <p className="mt-3 leading-7 text-[#6B7280]">
                  Contact our biomedical experts
                  for consultation, equipment,
                  and healthcare support.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                  <Link
                    href={makeLink("/contact")}
                    className="flex-1"
                  >

                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6F4E37] px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#4E342E] hover:scale-[1.02]">

                      Contact Us

                      <ArrowRight size={18} />

                    </button>

                  </Link>
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center justify-center rounded-2xl border-2 border-[#6F4E37] bg-white px-6 py-4 font-semibold !text-[#6F4E37] no-underline transition-all duration-300 hover:bg-[#F3ECE6] hover:!text-[#5B3E2C]"
                  >
                    Call Now
                  </a>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}