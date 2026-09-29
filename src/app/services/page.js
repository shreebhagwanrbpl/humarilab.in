import {
  Boxes,
  ClipboardCheck,
  FileText,
  Search,
  Truck,
  Settings2,
  PackageSearch,
  MessageSquareText,
  Wrench,
  ShieldCheck,
} from "lucide-react";

import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";
import { fetchServicesData } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Biomedical Product Services | Catalogue, Sourcing & Enquiries",
  description:
    "Explore catalogue assistance, biomedical product sourcing, quotation coordination, multi-item enquiries and equipment support from Raj Biosis.",
  alternates: { canonical: "https://humarilab.in/services" },
};

const serviceIcons = [
  <Wrench size={30} />,
  <Settings2 size={30} />,
  <ClipboardCheck size={30} />,
  <PackageSearch size={30} />,
  <Truck size={30} />,
  <ShieldCheck size={30} />,
  <Boxes size={30} />,
  <FileText size={30} />,
  <Search size={30} />,
  <MessageSquareText size={30} />,
];

export default async function ServicesPage({ city = "" }) {
  const locationText = city ? ` for ${city}` : "";
  const servicesRaw = await fetchServicesData();
  const dynamicServicesList = Array.isArray(servicesRaw?.services)
    ? servicesRaw.services
    : Array.isArray(servicesRaw)
    ? servicesRaw
    : [];

  const steps = [
    [
      "01",
      "Share the need",
      "Tell us the item, category, model, application, quantity or technical specification you have.",
    ],
    [
      "02",
      "Narrow the options",
      "Relevant catalogue information can be reviewed against the requirement rather than choosing by name alone.",
    ],
    [
      "03",
      "Confirm the enquiry",
      "Add quantities and other details needed for a useful quotation or sourcing conversation.",
    ],
    [
      "04",
      "Coordinate supply",
      "Once an option is selected, availability, commercial terms and delivery arrangements can be discussed.",
    ],
  ];

  return (
    <div className="site8-static">
      <section className="section-padding bg-gradient-to-br from-[#FFFDF9] via-[#F8F5F0] to-[#F3ECE4]">
        <div className="container-custom">
          <SectionTitle
            badge="Services for Biomedical Buyers"
            title={`More than a single product category${locationText}`}
            description="Our support is centred on product discovery, technical information and procurement communication across the wider biomedical catalogue."
            center
          />
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-16">
            {dynamicServicesList.map((service, idx) => {
              const title = service.title || service.name || "";
              const desc = service.desc || service.description || "";
              const icon = serviceIcons[idx % serviceIcons.length];
              return (
                <div
                  key={title || idx}
                  className="group rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_50px_rgba(111,78,55,0.15)]"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#EADBC8] text-[#6F4E37] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6F4E37] group-hover:text-white">
                    {icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#2C2C2C] leading-snug">
                    {title}
                  </h3>
                  <div className="mb-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#6F4E37] to-[#EADBC8]" />
                  <p className="text-sm leading-relaxed text-[#6B7280]">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white border-t border-[#EADBC8]">
        <div className="container-custom">
          <SectionTitle
            badge="Simple Enquiry Route"
            title="From requirement to product discussion"
            description="A short process keeps the conversation useful whether you are looking for one item or assembling a longer biomedical purchase list."
            center
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map(([step, title, desc]) => (
              <div
                key={step}
                className="relative rounded-[30px] border border-[#EADBC8] bg-[#FFFDFB] p-7 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8F3] border border-[#EADBC8] text-[#6F4E37] font-extrabold text-lg">
                  {step}
                </div>
                <h4 className="mt-5 text-lg font-bold text-[#2C2C2C]">
                  {title}
                </h4>
                <p className="mt-3 text-sm text-[#6B7280] leading-7">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#FFF8F3] border-t border-b border-[#EADBC8]">
        <div className="container-custom">
          <div className="rounded-[32px] bg-white border border-[#EADBC8] p-8 md:p-10">
            <h3 className="text-2xl font-bold text-[#2C2C2C]">
              A catalogue built for mixed requirements
            </h3>
            <p className="mt-4 max-w-4xl leading-8 text-[#6B7280]">
              A buyer may need an analyzer, a diagnostic kit, a monitoring
              device, laboratory consumables and accessories at the same time.
              The service model therefore keeps the enquiry open to different
              product families instead of forcing every request into one
              speciality.
            </p>
          </div>
        </div>
      </section>

      <CTASection city={city} />
    </div>
  );
}
