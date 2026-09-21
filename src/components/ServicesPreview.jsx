"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Boxes, Wrench, FileText } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";

export default function ServicesPreview() {
  const services = [
    {
      icon: <Boxes size={30} />,
      title: "Catalogue Supply",
      description: "Access a mixed range of laboratory, diagnostic, clinical and biomedical products for routine and institutional requirements.",
    },
    {
      icon: <ClipboardCheck size={30} />,
      title: "Requirement Matching",
      description: "Share the intended application, quantity or technical need and receive help identifying relevant product options.",
    },
    {
      icon: <FileText size={30} />,
      title: "Quotation Coordination",
      description: "Product enquiries can be converted into structured quotation discussions for individual or multi-item purchases.",
    },
    {
      icon: <Wrench size={30} />,
      title: "Equipment Support",
      description: "For eligible equipment, installation, operating guidance and after-sales coordination can be discussed with the selected supplier.",
    },
  ];

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#6F4E37]/10 blur-[120px]" />
      <div className="container-custom relative z-10">
        <SectionTitle
          badge="How We Help"
          title="Support that covers the product journey"
          description="From finding an item in the catalogue to discussing a larger supply requirement, the focus is on making biomedical purchasing easier to organise."
          center
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true }}
            >
              <ServiceCard icon={service.icon} title={service.title} description={service.description} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
