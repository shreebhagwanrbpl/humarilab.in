"use client";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import CTASection from "@/components/CTASection";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "services"
          )
        );

        if (snap.exists()) {
          setServices(snap.data().services || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Our Services"
        subtitle="Delivering trusted biomedical and diagnostic services with innovation, precision, and healthcare excellence."
      />

      {/* Services Grid */}
      <section className="section-padding bg-gradient-to-br from-[#FFFDF9] via-[#F8F5F0] to-[#F3ECE4]">

        <div className="container-custom">

          <SectionTitle
            badge="What We Offer"
            title="Premium Biomedical Services"
            description="We provide innovative healthcare and biomedical solutions tailored to modern diagnostics and laboratory excellence."
            center
          />

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">

            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[32px] border border-[#EADBC8] bg-[#FFFDFB] p-10 shadow-[0_15px_40px_rgba(111,78,55,0.08)] animate-pulse"
                >
                  <div className="mb-8 h-20 w-20 rounded-3xl bg-[#EADBC8]" />

                  <div className="mb-6 h-8 rounded bg-[#F1E5D8]" />

                  <div className="space-y-3">
                    <div className="h-4 rounded bg-[#F1E5D8]" />
                    <div className="h-4 w-11/12 rounded bg-[#F1E5D8]" />
                    <div className="h-4 w-8/12 rounded bg-[#F1E5D8]" />
                  </div>
                </div>
              ))
              : services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={icons[index]}
                  title={service.title}
                  description={service.desc}
                />
              ))}

          </div>

        </div>

      </section>

      {/* Working Process */}
      <section className="section-padding bg-gradient-to-br from-[#FFFDF9] via-[#F8F5F0] to-[#F3ECE4]">

        <div className="container-custom">

          <SectionTitle
            badge="How We Work"
            title="Simple & Professional Process"
            description="We follow a streamlined process to ensure reliable biomedical and healthcare solutions."
            center
          />

          <div className="grid lg:grid-cols-3 gap-8 mt-16">

            {[
              {
                step: "01",
                title: "Consultation",
                desc:
                  "Understanding healthcare requirements and diagnostic needs to recommend the most suitable biomedical solutions.",
              },
              {
                step: "02",
                title: "Implementation",
                desc:
                  "Delivering, installing, and configuring biomedical equipment with complete technical assistance.",
              },
              {
                step: "03",
                title: "Support",
                desc:
                  "Providing preventive maintenance, technical support, and after-sales service for uninterrupted performance.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group rounded-[32px] border border-[#EADBC8] bg-[#FFFDFB] p-8 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]"
              >

                {/* Step Number */}
                <span className="text-6xl font-extrabold text-[#D8C1AA] transition-colors duration-300 group-hover:text-[#6F4E37]">
                  {item.step}
                </span>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-bold text-[#2C2C2C]">
                  {item.title}
                </h3>

                {/* Accent Line */}
                <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                {/* Description */}
                <p className="mt-5 leading-8 text-[#6B7280]">
                  {item.desc}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}