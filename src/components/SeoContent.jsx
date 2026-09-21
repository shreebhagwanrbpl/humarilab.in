export default function SeoContent({ city = "" }) {
  const location = city || "India";

  const faqs = [
    ["What kinds of biomedical products can I enquire about?", "The catalogue is intended for a wide range of healthcare and laboratory requirements, including instruments, diagnostic devices, test kits, reagents, consumables, monitoring products and related accessories."],
    ["Can I ask about more than one product at a time?", "Yes. Multi-item requirements are welcome. You can share a product list, category, preferred brand or technical specification so the enquiry can be handled together."],
    ["Is the catalogue limited to laboratory equipment?", "No. Laboratory products are one part of the range. The wider catalogue can include clinical equipment, diagnostic items, monitoring devices, reagents, consumables and supporting supplies."],
    ["Who can use the product catalogue?", "Hospitals, laboratories, clinics, distributors, institutions, researchers and other professional buyers can use the catalogue to identify products and submit purchasing enquiries."],
  ];

  return (
    <section className="py-24 bg-[#F8F5F2]">
      <div className="container-custom">
        <div className="mb-12">
          <span className="inline-flex items-center rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
            Biomedical Catalogue
          </span>
          <h2 className="mt-6 text-4xl lg:text-5xl font-extrabold leading-tight text-[#2C2C2C]">
            Explore medical, diagnostic and laboratory products in {location}
          </h2>
          <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3 text-lg leading-8 text-[#6B7280]">
          <p>Raj Biosis brings different biomedical purchasing needs into one searchable product environment, helping buyers move from a general requirement to a specific item or model.</p>
          <p>The range is not built around one device or one clinical category. Depending on availability, buyers may find laboratory instruments, diagnostic technologies, reagents, kits, consumables, patient-care devices and accessories.</p>
          <p>For {location}, product pages can be used as a starting point for specifications, applications and model information. Enquiries can then be raised when a confirmed quotation or sourcing discussion is required.</p>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2C2C2C]">Questions buyers commonly ask</h2>
          <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">
                <h3 className="text-xl font-semibold text-[#2C2C2C]">{question}</h3>
                <p className="mt-3 leading-7 text-[#6B7280]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
