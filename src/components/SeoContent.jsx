export default function SeoContent({ city = "" }) {
    const location = city || "India";

    return (
        <section className="py-24 bg-[#F8F5F2]">

            <div className="container-custom">

                {/* Heading */}

                <div className="mb-12">

                    <span className="inline-flex items-center rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm">
                        Trusted Biomedical Supplier
                    </span>

                    <h2 className="mt-6 text-4xl lg:text-5xl font-extrabold leading-tight text-[#2C2C2C]">

                        Clinical Pathology & Laboratory Equipment Supplier in {location}

                    </h2>

                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                </div>

                {/* Content */}

                <div className="space-y-7 text-lg leading-8 text-[#6B7280]">

                    <p>Raj Biosis delivers clinical laboratory solutions across multiple regions, supporting path labs in maintaining high testing accuracy and diagnostic uptime.</p>

                </div>

                {/* FAQ */}

                <div className="mt-20">

                    <h2 className="text-3xl lg:text-4xl font-bold text-[#2C2C2C]">

                        Frequently Asked Questions

                    </h2>

                    <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                    <div className="mt-10 space-y-6">

                        {/* FAQ Item */}

                        <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">Do you supply clinical pathology equipment across India?</h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">Yes, we supply clinical laboratory equipment, biochemistry analyzers, and pathology solutions to multiple districts and cities across India.</p>

                        </div>

                        <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">Which clinical pathology analyzers do you provide?</h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">We provide biochemistry analyzers, 3-part/5-part hematology counters, ELISA microplate readers, urine analyzers, and diagnostic testing reagents.</p>

                        </div>

                        <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">Do you provide on-site calibration and installation?</h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">Yes, we offer on-site equipment setup, user training, and NABL-conformant calibration to ensure operational readiness.</p>

                        </div>

                        <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">Who can buy diagnostic laboratory equipment from you?</h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">Pathology labs, private diagnostic chains, hospitals, medical research institutes, and clinical facilities can order from us.</p>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}