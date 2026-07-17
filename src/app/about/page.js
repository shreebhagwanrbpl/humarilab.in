import Image from "next/image";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="About Central Biomedicals"
        subtitle="Delivering trusted diagnostic and biomedical technologies with innovation, quality, and healthcare precision."
      />

      {/* About Section */}
      <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">

        {/* Coffee Glow */}

        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#6F4E37]/10 blur-[120px]" />

        <div className="container-custom relative z-10 grid items-center gap-16 lg:grid-cols-2">

          {/* Left Image */}

          <div className="relative">

            <div className="flex h-[600px] items-center justify-center overflow-hidden rounded-[40px] border border-[#EADBC8] bg-[#FFFDFB] p-10 shadow-[0_20px_60px_rgba(111,78,55,0.12)]">

              <Image
                src={DDS}
                alt="About"
                width={1200}
                height={900}
                className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-105"
              />

            </div>

            {/* Floating Card */}

            <div className="absolute bottom-8 left-8 hidden rounded-[26px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_15px_40px_rgba(111,78,55,0.15)] lg:block">

              <h3 className="text-4xl font-extrabold text-[#6F4E37]">

                10+

              </h3>

              <div className="my-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

              <p className="text-[#6B7280]">

                Years of Excellence

              </p>

            </div>

          </div>

          {/* Right Content */}

          <div>

            <SectionTitle
              badge="Who We Are"
              title="Trusted Partner in Biomedical & Diagnostics"
              description="We provide advanced diagnostic and biomedical solutions focused on healthcare innovation, laboratory precision, and modern medical excellence."
            />

            <p className="mt-8 leading-8 text-[#6B7280]">

              At <span className="font-semibold text-[#6F4E37]">Central Biomedicals</span>,
              we are committed to delivering premium-quality
              healthcare and biomedical technologies designed to
              improve diagnostics, laboratory performance,
              and medical efficiency.

            </p>

            <p className="mt-5 leading-8 text-[#6B7280]">

              Our mission is to empower healthcare professionals
              with trusted equipment, expert consultation,
              and innovative biomedical support.

            </p>

            {/* Feature Cards */}

            <div className="mt-10 grid gap-5 sm:grid-cols-2">

              <div className="group rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">

                <h4 className="text-lg font-bold text-[#2C2C2C]">

                  Premium Equipment

                </h4>

                <div className="my-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                <p className="leading-7 text-[#6B7280]">

                  High-end diagnostic technologies.

                </p>

              </div>

              <div className="group rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">

                <h4 className="text-lg font-bold text-[#2C2C2C]">

                  Expert Support

                </h4>

                <div className="my-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                <p className="leading-7 text-[#6B7280]">

                  Trusted healthcare consultation.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}