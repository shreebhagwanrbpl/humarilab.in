"use client";

import { motion } from "framer-motion";
import { Building2, ListFilter, PackageCheck } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function Testimonials() {
  const scenarios = [
    {
      icon: <Building2 size={28} />,
      title: "For a new facility",
      text: "Build a product shortlist across equipment, diagnostics, consumables and accessories instead of managing each requirement separately.",
    },
    {
      icon: <ListFilter size={28} />,
      title: "For routine purchasing",
      text: "Check model details, applications and category information before sending a repeat or replacement requirement.",
    },
    {
      icon: <PackageCheck size={28} />,
      title: "For larger orders",
      text: "Combine several product needs into one enquiry so quantities, specifications and supply expectations can be discussed together.",
    },
  ];

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#6F4E37]/10 blur-[120px]" />
      <div className="container-custom relative z-10">
        <SectionTitle
          badge="Built Around Real Buying Situations"
          title="One catalogue, different procurement journeys"
          description="The same product catalogue can serve a small clinic, a diagnostic laboratory, a hospital department or an institutional purchasing team."
          center
        />
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {scenarios.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="group rounded-[32px] border border-[#EADBC8] bg-[#FFFDFB] p-8 shadow-[0_15px_40px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(111,78,55,0.18)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EADBC8] text-[#6F4E37] transition-all duration-500 group-hover:bg-[#6F4E37] group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[#2C2C2C]">{item.title}</h3>
              <div className="my-5 h-1 w-12 rounded-full bg-[#6F4E37]" />
              <p className="leading-8 text-[#6B7280]">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
