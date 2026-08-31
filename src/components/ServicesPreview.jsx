"use client";

import { motion } from "framer-motion";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";

export default function ServicesPreview() {
  const services = [
    {
      icon: <Microscope size={30} />,
      title: "Hematology Systems",
      description:
        "Sourcing 3-part and 5-part hematology counters and CBC machines.",
    },
    {
      icon: <FlaskConical size={30} />,
      title: "Biochemistry Analyzers",
      description:
        "Installing automatic and semi-automatic biochemistry testing platforms.",
    },
    {
      icon: <ShieldCheck size={30} />,
      title: "Urine Chemistry Devices",
      description:
        "Providing urine chemistry strip analyzers and clinical diagnostics systems.",
    },
    {
      icon: <Stethoscope size={30} />,
      title: "NABL Calibration",
      description:
        "Ensuring CE/ISO compliance and NABL-conformant calibration for pathology instruments.",
    }
  ];

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">

      {/* Coffee Glow */}

      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#6F4E37]/10 blur-[120px]" />

      <div className="container-custom relative z-10">

        {/* Title */}

        <SectionTitle
          badge="Pathology Support Services"
          title="Laboratory Equipment & Biomedical Services"
          description="We support healthcare and laboratory teams with suitable technologies, equipment sourcing, and practical implementation guidance."
          center
        />

        {/* Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {services.map((service, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              viewport={{
                once: true,
              }}
            >

              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}