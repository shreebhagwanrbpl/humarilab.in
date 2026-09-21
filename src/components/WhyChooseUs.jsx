"use client";

import { motion } from "framer-motion";
import { ListChecks, Layers3, SearchCheck, Truck } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Layers3 size={30} />,
      title: "Broad Catalogue",
      description: "Explore instruments, kits, reagents, consumables, monitoring devices and other biomedical items from one product destination.",
    },
    {
      icon: <SearchCheck size={30} />,
      title: "Specification-led Search",
      description: "Use product category, brand and technical details to narrow a requirement before requesting a quotation.",
    },
    {
      icon: <ListChecks size={30} />,
      title: "Clear Product Information",
      description: "We present useful model, application and parameter details so purchasing teams can compare options more confidently.",
    },
    {
      icon: <Truck size={30} />,
      title: "Procurement Assistance",
      description: "For routine orders as well as larger requirements, our team can help coordinate enquiries, sourcing and supply discussions.",
    },
  ];

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#6F4E37]/10 blur-[120px]" />
      <div className="container-custom relative z-10">
        <SectionTitle
          badge="Designed for Different Buying Needs"
          title="A practical starting point for biomedical procurement"
          description="Whether you are replacing one item or preparing a broader requirement list, the catalogue is organised around products rather than a single medical speciality."
          center
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="group rounded-[30px] border border-[#EADBC8] bg-[#FFFDFB] p-8 shadow-[0_15px_40px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-[#B08968] hover:shadow-[0_25px_60px_rgba(111,78,55,0.18)]"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EADBC8] text-[#6F4E37] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6F4E37] group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="mb-4 text-xl font-bold text-[#2C2C2C]">{item.title}</h3>
              <div className="mb-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />
              <p className="leading-7 text-[#6B7280]">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
