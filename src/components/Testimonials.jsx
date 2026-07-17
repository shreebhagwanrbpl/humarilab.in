"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

export default function Testimonials() {
  const reviews = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Healthcare Specialist",
      review:
        "Central Biomedicals has consistently delivered reliable diagnostic equipment with outstanding support.",
    },
    {
      name: "Amit Sharma",
      role: "Lab Director",
      review:
        "Professional service, premium products, and excellent biomedical consultation experience.",
    },
    {
      name: "Neha Verma",
      role: "Research Head",
      review:
        "Their healthcare solutions improved our laboratory efficiency significantly.",
    },
  ];

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">

      {/* Coffee Glow */}

      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#6F4E37]/10 blur-[120px]" />

      <div className="container-custom relative z-10">

        <SectionTitle
          badge="Testimonials"
          title="What Our Clients Say"
          description="Trusted by healthcare professionals, laboratories, and biomedical institutions."
          center
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {reviews.map((item, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 40,
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
              className="group rounded-[32px] border border-[#EADBC8] bg-[#FFFDFB] p-8 shadow-[0_15px_40px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(111,78,55,0.18)]"
            >

              {/* Quote */}

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EADBC8] text-3xl font-bold text-[#6F4E37] transition-all duration-500 group-hover:bg-[#6F4E37] group-hover:text-white">

                “

              </div>

              {/* Stars */}

              <div className="mb-5 flex gap-1 text-xl text-[#B08968]">

                ★★★★★

              </div>

              {/* Review */}

              <p className="leading-8 italic text-[#6B7280]">

                "{item.review}"

              </p>

              {/* Divider */}

              <div className="my-6 h-px bg-gradient-to-r from-[#EADBC8] via-[#B08968] to-transparent" />

              {/* User */}

              <div>

                <h4 className="text-lg font-bold text-[#2C2C2C]">

                  {item.name}

                </h4>

                <p className="mt-1 text-[#8D6E63]">

                  {item.role}

                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}