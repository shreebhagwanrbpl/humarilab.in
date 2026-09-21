import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import DDS from "@/components/img/Dds.png";

export const metadata = {
  title: "About Raj Biosis | Biomedical Product & Equipment Catalogue",
  description: "Learn about Raj Biosis and its broad biomedical product catalogue covering equipment, diagnostics, laboratory items, reagents, consumables and healthcare supplies.",
  alternates: { canonical: "https://humarilab.in/about" },
};

export default function AboutPage({ city = "" }) {
  const locationText = city ? ` for ${city}` : "";

  return (
    <div className="site8-static">
      <PageBanner
        title={`About Raj Biosis${locationText}`}
        subtitle="A broad biomedical product destination for equipment, diagnostic items, laboratory supplies and related healthcare requirements."
      />

      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6]">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#B08968]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#6F4E37]/10 blur-[120px]" />
        <div className="container-custom relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="flex h-[500px] items-center justify-center overflow-hidden rounded-[40px] border border-[#EADBC8] bg-[#FFFDFB] p-10 shadow-[0_20px_60px_rgba(111,78,55,0.12)]">
              <Image src={DDS} alt="Biomedical product supply" width={1200} height={900} className="max-h-full max-w-full object-contain transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="absolute bottom-6 left-6 rounded-[22px] border border-[#EADBC8] bg-[#FFFDFB] px-6 py-4 shadow-[0_15px_40px_rgba(111,78,55,0.15)] hidden sm:block">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#6F4E37]">Biomedical Catalogue</span>
              <p className="text-xs text-[#6B7280] mt-1">Products across multiple healthcare areas</p>
            </div>
          </div>

          <div>
            <SectionTitle
              badge="Who We Are"
              title={`A product-first approach to biomedical purchasing${locationText}`}
              description="Raj Biosis brings together a varied selection of biomedical and healthcare products so buyers can investigate different requirements from one catalogue."
            />
            <p className="mt-6 leading-8 text-[#6B7280]">
              The catalogue is deliberately broader than any single device, specialty or clinical workflow. Depending on the product range available, it can cover diagnostic equipment, laboratory instruments, test kits, reagents, consumables, monitoring products and other supporting items.
            </p>
            <p className="mt-4 leading-8 text-[#6B7280]">
              Our role is to make product discovery and enquiry easier: buyers can start with a category, brand, application, model or specification and then move to a quotation or sourcing discussion when required.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-sm">
                <h4 className="text-lg font-bold text-[#2C2C2C]">Many Product Areas</h4>
                <div className="my-3 h-1 w-12 rounded-full bg-[#6F4E37]" />
                <p className="text-sm leading-6 text-[#6B7280]">Laboratory, diagnostic, clinical and supporting biomedical categories.</p>
              </div>
              <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-sm">
                <h4 className="text-lg font-bold text-[#2C2C2C]">Flexible Enquiries</h4>
                <div className="my-3 h-1 w-12 rounded-full bg-[#6F4E37]" />
                <p className="text-sm leading-6 text-[#6B7280]">Single-item questions and multi-product requirements can follow the same route.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white border-t border-[#EADBC8]">
        <div className="container-custom">
          <SectionTitle
            badge="Catalogue Structure"
            title="What you can explore"
            description="The exact inventory changes by catalogue, but the site is designed to support several kinds of biomedical purchasing rather than a single product family."
            center
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Diagnostic", "Rapid tests, diagnostic devices and point-of-care products."],
              ["Laboratory", "Analyzers, microscopes, centrifugation and other lab instruments."],
              ["Clinical", "Monitoring and general healthcare equipment for professional settings."],
              ["Supplies", "Reagents, consumables, strips, accessories and supporting items."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[30px] border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm">
                <h3 className="text-xl font-bold text-[#2C2C2C]">{title}</h3>
                <div className="my-4 h-1 w-12 rounded-full bg-[#6F4E37]" />
                <p className="leading-7 text-[#6B7280]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F5F2] border-t border-[#EADBC8]">
        <div className="container-custom grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-extrabold text-[#2C2C2C]">Useful for different buyer types</h3>
            <div className="mt-4 h-1 w-20 rounded-full bg-[#6F4E37]" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Hospitals", "Clinics", "Diagnostic centres", "Laboratories", "Research teams", "Institutional buyers", "Distributors", "Healthcare facilities"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#EADBC8] bg-white p-4 font-semibold text-[#2C2C2C] shadow-sm">{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-[#EADBC8] bg-white p-8 md:p-10 shadow-md">
            <h3 className="text-3xl font-extrabold text-[#6F4E37]">Our Aim</h3>
            <div className="mt-4 h-1 w-20 rounded-full bg-[#6F4E37]" />
            <p className="text-[#6B7280] mt-6 leading-8">
              To give professional buyers a clearer route from product discovery to enquiry, while keeping the catalogue useful for a wide range of biomedical and healthcare requirements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
