import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export const metadata = {
  title: "About Our Pathology Supply Network | Biomedical Sourcing & Supply Partner",
  description: "Raj Biosis is a trusted procurement and supply partner for advanced biomedical, laboratory, and diagnostic equipment across India.",
  alternates: {
    canonical: "https://humarilab.in/about",
  },
};

export default function AboutPage({ city = "" }) {
  const locationText = city ? ` in ${city}` : "";

  return (
    <div className="site8-static">
      {/* Banner */}
      <PageBanner
        title={`About Our Pathology Supply Network${locationText}`}
        subtitle={`Your trusted procurement and supply partner for advanced biomedical, laboratory, and diagnostic equipment${city ? ` in ${city}` : " across India"}.`}
      />

      {/* Intro Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">
        {/* Decorative glows */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#6F4E37]/10 blur-[120px]" />

        <div className="container-custom relative z-10 grid items-center gap-16 lg:grid-cols-2">
          {/* Left Column: Image with Subtle Accent */}
          <div className="relative">
            <div className="flex h-[500px] items-center justify-center overflow-hidden rounded-[40px] border border-[#EADBC8] bg-[#FFFDFB] p-10 shadow-[0_20px_60px_rgba(111,78,55,0.12)]">
              <Image
                src={DDS}
                alt="Raj Biosis Supply Operations"
                width={1200}
                height={900}
                className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            {/* Supply Partner Floating Tag */}
            <div className="absolute bottom-6 left-6 rounded-[22px] border border-[#EADBC8] bg-[#FFFDFB] px-6 py-4 shadow-[0_15px_40px_rgba(111,78,55,0.15)] hidden sm:block">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#6F4E37]">Authorized Supplier</span>
              <p className="text-xs text-[#6B7280] mt-1">Diagnostic & Lab Technology</p>
            </div>
          </div>

          {/* Right Column: About Our Pathology Supply Network */}
          <div>
            <SectionTitle
              badge="About Our Pathology Supply Network"
              title={`A Dedicated Partner in Diagnostic & Laboratory Supply${locationText}`}
              description={`Raj Biosis is a premier supplier, dealer, and distributor of high-precision biomedical equipment, diagnostic analyzers, and laboratory systems${city ? ` in ${city}` : " across India"}.`}
            />

            <p className="mt-6 leading-8 text-[#6B7280]">
              We specialize in bridging the gap between advanced medical equipment manufacturers and healthcare facilities. Rather than focusing on a single brand, we act as an independent sourcing partner, helping clients identify, select, and procure equipment that matches their specific technical requirements and operational budget.
            </p>

            <p className="mt-4 leading-8 text-[#6B7280]">
              Our role extends beyond distribution; we offer comprehensive requirement-based support, detailed product information, and streamlined quotation assistance to make laboratory procurement simple and efficient.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="group rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">
                <h4 className="text-lg font-bold text-[#2C2C2C]">Sourcing Expertise</h4>
                <div className="my-3 h-1 w-12 rounded-full bg-[#6F4E37]" />
                <p className="text-sm leading-6 text-[#6B7280]">Access to top biomedical and diagnostic brands.</p>
              </div>

              <div className="group rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">
                <h4 className="text-lg font-bold text-[#2C2C2C]">Requirement Focus</h4>
                <div className="my-3 h-1 w-12 rounded-full bg-[#6F4E37]" />
                <p className="text-sm leading-6 text-[#6B7280]">Tailored guidance matching specifications to your lab.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supplier Approach & Sourcing Details */}
      <section className="py-16 md:py-24 bg-white border-t border-[#EADBC8]">
        <div className="container-custom">
          <SectionTitle
            badge="Our Sourcing Process"
            title="Our Supplier Approach & Sourcing Standards"
            description="How we ensure healthcare providers receive correct, reliable, and verified equipment."
            center
          />

          <div className="grid gap-8 md:grid-cols-3 mt-12">
            <div className="p-8 rounded-[32px] border border-[#EADBC8] bg-[#FFFDFB] shadow-sm">
              <span className="text-[#6F4E37] font-bold text-sm tracking-wider uppercase block">Step 01</span>
              <h3 className="text-xl font-bold text-[#2C2C2C] mt-3">Needs Identification</h3>
              <p className="text-[#6B7280] text-sm leading-7 mt-4">
                We work directly with your clinical or laboratory team to analyze test volumes, throughput requirements, space limits, and budget guidelines.
              </p>
            </div>

            <div className="p-8 rounded-[32px] border border-[#EADBC8] bg-[#FFFDFB] shadow-sm">
              <span className="text-[#6F4E37] font-bold text-sm tracking-wider uppercase block">Step 02</span>
              <h3 className="text-xl font-bold text-[#2C2C2C] mt-3">Brand Sourcing & Selection</h3>
              <p className="text-[#6B7280] text-sm leading-7 mt-4">
                Leveraging our distributor network, we evaluate multiple brand specifications to match your exact parameters, avoiding biased vendor suggestions.
              </p>
            </div>

            <div className="p-8 rounded-[32px] border border-[#EADBC8] bg-[#FFFDFB] shadow-sm">
              <span className="text-[#6F4E37] font-bold text-sm tracking-wider uppercase block">Step 03</span>
              <h3 className="text-xl font-bold text-[#2C2C2C] mt-3">Quotation & Supply</h3>
              <p className="text-[#6B7280] text-sm leading-7 mt-4">
                We provide transparent product data sheets, technical guidance, and detailed price quotation proposals, facilitating a smooth procurement flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Supply & Who We Serve */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#FFFDFB] to-[#F8F5F2] border-t border-[#EADBC8]">
        <div className="container-custom grid gap-16 lg:grid-cols-2">
          
          {/* What We Supply */}
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-[#6F4E37] bg-[#FFF8F3] border border-[#DCCBB8] px-4 py-1.5 rounded-full inline-block">Product Range</span>
            <h3 className="text-3xl font-extrabold text-[#2C2C2C] mt-4">What We Supply</h3>
            <p className="text-[#6B7280] mt-3 leading-7">
              We supply an extensive portfolio of medical and diagnostic technologies sourced from reliable manufacturers:
            </p>
            
            <ul className="mt-6 space-y-4 text-base text-[#6B7280]">
              <li className="flex items-start gap-3">
                <span className="text-[#6F4E37] font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-[#2C2C2C]">Biomedical Equipment:</strong> General ward monitors, surgical aids, clinical devices, and patient monitoring systems.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#6F4E37] font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-[#2C2C2C]">Diagnostic Equipment:</strong> Advanced medical imaging accessories, ECG systems, and point-of-care devices.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#6F4E37] font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-[#2C2C2C]">Laboratory Equipment:</strong> Biochemistry analyzers, hematology counters, ELISA plate readers, microscopes, and incubators.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#6F4E37] font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-[#2C2C2C]">Medical & Healthcare Supplies:</strong> Essential consumables, strip reagents, and chemical solutions for diagnostics.
                </div>
              </li>
            </ul>
          </div>

          {/* Who We Serve */}
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-[#6F4E37] bg-[#FFF8F3] border border-[#DCCBB8] px-4 py-1.5 rounded-full inline-block">Target Segments</span>
            <h3 className="text-3xl font-extrabold text-[#2C2C2C] mt-4">Who We Serve</h3>
            <p className="text-[#6B7280] mt-3 leading-7">
              Our supply solutions are optimized to meet the operational scales of various healthcare providers, including:
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              {[
                "Hospitals",
                "Diagnostic Centres",
                "Pathology Laboratories",
                "Medical Laboratories",
                "Clinics",
                "Research Institutions",
                "Healthcare Facilities",
                "Industrial Medical Units"
              ].map((segment, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#FFFDFB] border border-[#EADBC8] rounded-2xl p-4 shadow-sm">
                  <span className="text-[#6F4E37] text-lg font-bold">✔</span>
                  <span className="font-semibold text-[#2C2C2C] text-[15px]">{segment}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* Sourcing & Selection Assistance Details */}
      <section className="py-16 md:py-24 bg-white border-t border-[#EADBC8]">
        <div className="container-custom grid gap-16 lg:grid-cols-2 items-center">
          
          {/* Content */}
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-[#6F4E37]">Procurement Support</span>
            <h3 className="text-3xl font-extrabold text-[#2C2C2C] mt-4">Product Selection & Requirement Support</h3>
            <p className="text-[#6B7280] mt-4 leading-8">
              Procuring high-value diagnostic systems can be complex. Differences in reagents, parameter menus, throughput cycles, and software compatibility are often difficult to evaluate. 
            </p>
            <p className="text-[#6B7280] mt-3 leading-8">
              At Raj Biosis, we guide clients through detailed product comparison worksheets. We discuss and verify specifications so that the final product selected delivers optimal clinical output. We assist with request for quotations (RFQs) and compile structured data sheets for institutional purchase reviews.
            </p>
          </div>
          
          {/* Sourcing card */}
          <div className="bg-[#FFF8F3] border border-[#EADBC8] rounded-[36px] p-8 md:p-10 shadow-sm">
            <h4 className="text-2xl font-bold text-[#6F4E37]">Quality-Focused Product Sourcing</h4>
            <p className="text-[#6B7280] text-sm leading-7 mt-4">
              We vet all equipment manufacturers for safety standards, quality consistency, and verification of registration details. This helps reduce instrument downtime, avoids sub-standard components, and ensures that the technical parameters declared match actual real-world clinical performance.
            </p>
            <div className="mt-6 flex items-center gap-4 bg-white border border-[#EADBC8] p-4 rounded-2xl">
              <span className="text-3xl">🛡</span>
              <span className="text-xs text-[#6B7280] font-medium leading-relaxed">
                Every supply partner product sheet undergoes technical review before being presented in quotation options.
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Why Choose & Vision */}
      <section className="py-16 md:py-24 bg-[#F8F5F2] border-t border-[#EADBC8]">
        <div className="container-custom grid gap-12 lg:grid-cols-2">
          
          {/* Why Choose */}
          <div>
            <h3 className="text-3xl font-extrabold text-[#2C2C2C]">Why Choose Raj Biosis</h3>
            <div className="mt-4 h-1 w-20 rounded-full bg-[#6F4E37]" />
            
            <div className="mt-8 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-[#2C2C2C]">Neutral Sourcing Guidance</h4>
                <p className="text-sm text-[#6B7280] mt-2">We analyze multiple brands to find the exact match for your needs without factory brand bias.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#2C2C2C]">Structured Quotation Assistance</h4>
                <p className="text-sm text-[#6B7280] mt-2">Receive fast, transparent, itemized quotes outlining technical specifications clearly.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#2C2C2C]">Targeted Support</h4>
                <p className="text-sm text-[#6B7280] mt-2">Helping labs scale up test menus by supplying modern equipment options with standard warranties.</p>
              </div>
            </div>
          </div>

          {/* Our Vision */}
          <div className="flex flex-col justify-center rounded-[32px] border border-[#EADBC8] bg-white p-8 md:p-10 shadow-md">
            <h3 className="text-3xl font-extrabold text-[#6F4E37]">Our Vision</h3>
            <div className="mt-4 h-1 w-20 rounded-full bg-[#6F4E37]" />
            <p className="text-[#6B7280] mt-6 leading-8 text-base">
              To be the most trusted and reliable biomedical, diagnostic, and laboratory equipment supply partner in India, empowering diagnostic labs and medical institutions with verified technology, clear product specifications, and direct quotation transparency.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}