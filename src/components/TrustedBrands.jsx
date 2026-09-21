export default function TrustedBrands() {
  const categories = [
    "Laboratory Instruments",
    "Diagnostic Devices",
    "Test Kits & Reagents",
    "Patient Monitoring",
    "Consumables & Accessories",
  ];

  return (
    <section className="relative overflow-hidden border-y border-[#EADBC8] bg-gradient-to-br from-[#F8F5F2] via-[#FFFDFB] to-[#F3ECE6] py-20">
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#B08968]/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#6F4E37]/10 blur-[120px]" />
      <div className="container-custom relative z-10">
        <p className="mb-12 text-center text-lg font-semibold tracking-wide text-[#8D6E63]">
          One catalogue, many areas of biomedical procurement
        </p>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <div
              key={category}
              className="group flex min-h-28 items-center justify-center rounded-[24px] border border-[#EADBC8] bg-[#FFFDFB] p-6 text-center shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-[#B08968] hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]"
            >
              <span className="text-base font-bold text-[#6B7280] transition-colors duration-300 group-hover:text-[#6F4E37]">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
