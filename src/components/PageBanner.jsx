"use client";

import { motion } from "framer-motion";

export default function PageBanner({
  title,
  subtitle,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#EADBC8] py-28 lg:py-36">

      {/* Coffee Glow */}

      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#6F4E37]/10 blur-[120px]" />

      <div className="container-custom relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto max-w-4xl text-center"
        >

          {/* Badge */}

          <span className="mb-6 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">

            Premium Biomedical Solutions

          </span>

          {/* Title */}

          <h1 className="text-5xl font-extrabold leading-tight text-[#2C2C2C] lg:text-7xl">

            {title}

          </h1>

          {/* Subtitle */}

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#6B7280]">

            {subtitle}

          </p>

          {/* Decorative Line */}

          <div className="mx-auto mt-10 h-1 w-28 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

        </motion.div>

      </div>

    </section>
  );
}