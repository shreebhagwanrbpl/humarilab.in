"use client";

import { motion } from "framer-motion";
import { Boxes, Tags, Building2, ClipboardList } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { icon: <Boxes size={34} />, number: "Wide", label: "Biomedical Product Mix" },
    { icon: <Tags size={34} />, number: "Multi", label: "Category & Brand Options" },
    { icon: <Building2 size={34} />, number: "B2B", label: "Institutional Purchasing" },
    { icon: <ClipboardList size={34} />, number: "1-to-1", label: "Requirement Discussions" },
  ];

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#6F4E37]/10 blur-[120px]" />
      <div className="container-custom relative z-10">
        <div className="rounded-[40px] border border-[#EADBC8] bg-[#FFFDFB] p-10 lg:p-16 shadow-[0_20px_60px_rgba(111,78,55,0.10)]">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#EADBC8] text-[#6F4E37] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6F4E37] group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="text-3xl font-extrabold text-[#2C2C2C] lg:text-4xl">{item.number}</h3>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />
                <p className="mt-4 text-lg text-[#6B7280]">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
