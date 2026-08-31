import {
  Activity,
  Award,
  ChevronRight,
  ClipboardList,
  Compass,
  FileSpreadsheet,
  FlaskConical,
  HeartPulse,
  Microscope,
  Package,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Biomedical & Laboratory Services | Raj Biosis",
  description: "Explore our biomedical equipment supply, product selection assistance, laboratory setup guidance, and institutional bulk supply services.",
  alternates: {
    canonical: "https://humarilab.in/services",
  },
};

export default function ServicesPage({ city = "" }) {
  const locationText = city ? ` in ${city}` : "";

  const supplyServices = [
    {
      icon: <HeartPulse size={30} />,
      title: "Biomedical Equipment Supply",
      desc: "Supplying precision biomedical monitors, patient diagnostic devices, and healthcare equipment to optimize clinical outcomes."
    },
    {
      icon: <Activity size={30} />,
      title: "Diagnostic Equipment Supply",
      desc: "Distributing high-performance diagnostic devices, ECG monitors, and point-of-care systems to healthcare facilities across India."
    },
    {
      icon: <FlaskConical size={30} />,
      title: "Laboratory Equipment Supply",
      desc: "Providing clinical chemistry analyzers, hematology counters, ELISA systems, micro-pipettes, and laboratory centrifuges."
    },
    {
      icon: <Compass size={30} />,
      title: "Product Selection Assistance",
      desc: "Helping diagnostic labs compare specifications, throughput metrics, reagent compatibility, and menu parameters before ordering."
    },
    {
      icon: <FileSpreadsheet size={30} />,
      title: "Product Enquiry & Quotation Support",
      desc: "Preparing transparent, itemized quotation sheets listing technical options, package details, and warranty terms for review."
    },
    {
      icon: <Package size={30} />,
      title: "Healthcare Equipment Sourcing",
      desc: "Leveraging our supplier and dealer networks to source specialized instrumentation according to unique institutional guidelines."
    },
    {
      icon: <ClipboardList size={30} />,
      title: "Institutional / Bulk Requirements",
      desc: "Managing complete supply contracts for clinic installations, lab expansions, and franchise diagnostic center setups."
    },
    {
      icon: <Award size={30} />,
      title: "Product Information & Technical Guidance",
      desc: "Furnishing detailed manufacturer brochures, technical data guides, and site pre-requisite specifications for smooth procurement."
    }
  ];

  return (
    <div className="site8-static">
      {/* Banner */}
      {/* <PageBanner
        title="Supplier Services"
        subtitle="Supporting healthcare facilities, laboratories, and clinics with professional medical equipment supply and procurement assistance."
      /> */}

      {/* Services Grid */}
      <section className="section-padding bg-gradient-to-br from-[#FFFDF9] via-[#F8F5F0] to-[#F3ECE4]">
        <div className="container-custom">
          <SectionTitle
            badge="What We Provide"
            title={`Biomedical & Laboratory Supply Services${locationText}`}
            description={`We offer complete, requirement-focused supply options designed for precision and clinical reliability${city ? ` in ${city}` : " across India"}.`}
            center
          />

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-16">
            {supplyServices.map((service, index) => (
              <div
                key={index}
                className="group rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_50px_rgba(111,78,55,0.15)] flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#EADBC8] text-[#6F4E37] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6F4E37] group-hover:text-white">
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold text-[#2C2C2C] leading-snug">
                    {service.title}
                  </h3>

                  {/* Accent Line */}
                  <div className="mb-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#6F4E37] to-[#EADBC8]" />

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-[#6B7280]">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Process */}
      <section className="section-padding bg-white border-t border-[#EADBC8]">
        <div className="container-custom">
          <SectionTitle
            badge="Procurement Flow"
            title={`Our Step-by-Step Supply Procedure${locationText}`}
            description={`We guide medical facilities${city ? ` in ${city}` : ""} through a clear and transparent sourcing cycle to ensure correct equipment deployment.`}
            center
          />

          {/* Workflow Steps Visual */}
          <div className="mt-16 bg-[#FFFDFB] border border-[#EADBC8] rounded-[36px] p-8 md:p-12 shadow-[0_15px_45px_rgba(111,78,55,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center text-center">
              {[
                {
                  step: "01",
                  title: "Customer Requirement",
                  desc: "We collect facility scope, testing capacity parameters, and budget specifications."
                },
                {
                  step: "02",
                  title: "Product Identification",
                  desc: "We screen multiple reliable brands to identify compatible instruments."
                },
                {
                  step: "03",
                  title: "Specification Discussion",
                  desc: "We review parameters, menu items, and electrical requirements with your technicians."
                },
                {
                  step: "04",
                  title: "Quotation / Enquiry",
                  desc: "We deliver transparent itemized quotes detailing pricing and warranty terms."
                },
                {
                  step: "05",
                  title: "Further Communication",
                  desc: "We coordinate logisitics, dispatch, and facilitate installation support."
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Step bubble */}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8F3] border border-[#EADBC8] text-[#6F4E37] font-extrabold text-lg shadow-sm transition-all duration-300 group-hover:bg-[#6F4E37] group-hover:text-white">
                    {item.step}
                  </div>

                  {/* Title & Desc */}
                  <h4 className="mt-4 text-base font-bold text-[#2C2C2C]">{item.title}</h4>
                  <p className="mt-2 text-xs text-[#6B7280] leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>

                  {/* Arrow for Desktop */}
                  {idx < 4 && (
                    <div className="hidden md:block absolute top-6 -right-4 translate-x-1/2 text-[#D8C1AA] z-10">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support Details Warning Section */}
      <section className="py-12 bg-[#FFF8F3] border-t border-b border-[#EADBC8]">
        <div className="container-custom flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🛠</span>
            <div>
              <h4 className="text-lg font-bold text-[#6F4E37]">Sourcing & Site Setup Support</h4>
              <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                Raj Biosis provides manufacturer installation assistance, commissioning supervision, and initial operator instructions for complex diagnostic setups. On-site maintenance support, calibration details, or warranty renewals depend on the selected product model and brand policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}