"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Boxes,
  Wrench,
  FileText,
  Settings2,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";

const defaultIcons = [
  <Wrench size={30} />,
  <Settings2 size={30} />,
  <ClipboardCheck size={30} />,
  <PackageSearch size={30} />,
  <ShieldCheck size={30} />,
  <Boxes size={30} />,
];

export default function ServicesPreview() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadServices = async () => {
      try {
        const res = await fetch("/api/site-data?type=services");
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json?.data?.services) {
            setServices(json.data.services);
          }
        }
      } catch (err) {
        console.error("Error loading services preview:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">
        <div className="container-custom relative z-10">
          <SectionTitle
            badge="How We Help"
            title="Support that covers the product journey"
            description="From finding an item in the catalogue to discussing a larger supply requirement, the focus is on making biomedical purchasing easier to organise."
            center
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <ServiceCard key={i} loading={true} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

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
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service, index) => (
            <motion.div
              key={service.title || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard
                icon={defaultIcons[index % defaultIcons.length]}
                title={service.title}
                description={service.desc || service.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
