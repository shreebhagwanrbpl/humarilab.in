import {
  Boxes,
  ClipboardCheck,
  FileText,
  Search,
  Truck,
  Settings2,
  PackageSearch,
  MessageSquareText,
} from "lucide-react";

import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Biomedical Product Services | Catalogue, Sourcing & Enquiries",
  description: "Explore catalogue assistance, biomedical product sourcing, quotation coordination, multi-item enquiries and equipment support from Raj Biosis.",
  alternates: { canonical: "https://humarilab.in/services" },
};

export default function ServicesPage({ city = "" }) {
  const locationText = city ? ` for ${city}` : "";

  const services = [
    [<Boxes size={30} />, "Product Catalogue Access", "Find biomedical equipment, diagnostic products, laboratory items, reagents, consumables and related accessories in one place."],
    [<Search size={30} />, "Product Discovery Help", "If you know the application but not the model, share the requirement and we can help narrow the relevant catalogue options."],
    [<ClipboardCheck size={30} />, "Specification Review", "Compare useful details such as application, parameters, capacity, configuration or model information before making a purchase decision."],
    [<FileText size={30} />, "Quotation Enquiries", "Submit a product name, model, quantity or specification and use the enquiry route for pricing and availability discussions."],
    [<PackageSearch size={30} />, "Multi-item Requirements", "Group several laboratory, diagnostic, clinical or consumable requirements into a single purchasing conversation."],
    [<Truck size={30} />, "Supply Coordination", "For confirmed requirements, supply and dispatch discussions can be coordinated according to the selected product and supplier."],
    [<Settings2 size={30} />, "Equipment Assistance", "Where applicable, installation, commissioning, operating guidance or service coordination can be discussed for equipment purchases."],
    [<MessageSquareText size={30} />, "Institutional Requests", "Hospitals, laboratories, clinics, research teams and other professional buyers can submit larger or recurring product requirements."],
  ];

  const steps = [
    ["01", "Share the need", "Tell us the item, category, model, application, quantity or technical specification you have."],
    ["02", "Narrow the options", "Relevant catalogue information can be reviewed against the requirement rather than choosing by name alone."],
    ["03", "Confirm the enquiry", "Add quantities and other details needed for a useful quotation or sourcing conversation."],
    ["04", "Coordinate supply", "Once an option is selected, availability, commercial terms and delivery arrangements can be discussed."],
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
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-16">
            {services.map(([icon, title, desc]) => (
              <div key={title} className="group rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_50px_rgba(111,78,55,0.15)]">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#EADBC8] text-[#6F4E37] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6F4E37] group-hover:text-white">{icon}</div>
                <h3 className="mb-3 text-xl font-bold text-[#2C2C2C] leading-snug">{title}</h3>
                <div className="mb-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#6F4E37] to-[#EADBC8]" />
                <p className="text-sm leading-relaxed text-[#6B7280]">{desc}</p>
              </div>
            ))}
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
              <div key={step} className="relative rounded-[30px] border border-[#EADBC8] bg-[#FFFDFB] p-7 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8F3] border border-[#EADBC8] text-[#6F4E37] font-extrabold text-lg">{step}</div>
                <h4 className="mt-5 text-lg font-bold text-[#2C2C2C]">{title}</h4>
                <p className="mt-3 text-sm text-[#6B7280] leading-7">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#FFF8F3] border-t border-b border-[#EADBC8]">
        <div className="container-custom">
          <div className="rounded-[32px] bg-white border border-[#EADBC8] p-8 md:p-10">
            <h3 className="text-2xl font-bold text-[#2C2C2C]">A catalogue built for mixed requirements</h3>
            <p className="mt-4 max-w-4xl leading-8 text-[#6B7280]">
              A buyer may need an analyzer, a diagnostic kit, a monitoring device, laboratory consumables and accessories at the same time. The service model therefore keeps the enquiry open to different product families instead of forcing every request into one speciality.
            </p>
          </div>
        </div>
      </section>

      <CTASection city={city} />
    </div>
  );
}
