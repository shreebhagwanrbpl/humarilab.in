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

                        Biomedical Equipment Supplier in {location}

                    </h2>

                    <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

                </div>

                {/* Content */}

                <div className="space-y-7 text-lg leading-8 text-[#6B7280]">

                    <p>
                        Central Biomedicals is a trusted supplier of biomedical
                        and laboratory equipment in <strong className="text-[#6F4E37]">{location}</strong>.
                        We provide CBC Machines, Hematology Analyzers,
                        Biochemistry Analyzers, Urine Analyzers, ELISA Readers
                        and diagnostic instruments for hospitals, pathology
                        laboratories and healthcare facilities.
                    </p>

                    <p>
                        Our mission is to provide reliable and high-quality
                        laboratory equipment to healthcare professionals across
                        India. We work with diagnostic centres, hospitals,
                        research laboratories and medical institutions to
                        deliver advanced biomedical solutions.
                    </p>

                    <p>
                        We offer installation assistance, product guidance and
                        technical support for a wide range of laboratory
                        instruments. Whether you are setting up a new diagnostic
                        laboratory or upgrading existing equipment, our experts
                        help you choose the right solution.
                    </p>

                    <p>
                        Central Biomedicals supplies equipment across multiple
                        districts and cities, helping healthcare providers
                        improve testing efficiency and diagnostic accuracy.
                    </p>

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

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">
                                Do you supply biomedical equipment across India?
                            </h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">
                                Yes, we supply biomedical and laboratory equipment
                                across multiple districts and cities.
                            </p>

                        </div>

                        <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">
                                Which laboratory instruments do you provide?
                            </h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">
                                We provide CBC Machines, Hematology Analyzers,
                                Biochemistry Analyzers, ELISA Readers, Urine
                                Analyzers and many other diagnostic systems.
                            </p>

                        </div>

                        <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">
                                Do you provide installation support?
                            </h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">
                                Yes, installation assistance, training and technical
                                support are available depending on equipment type
                                and location.
                            </p>

                        </div>

                        <div className="rounded-3xl border border-[#EADBC8] bg-[#FFFDFB] p-7 shadow-sm transition-all duration-300 hover:shadow-xl">

                            <h3 className="text-xl font-semibold text-[#2C2C2C]">
                                Who can purchase biomedical equipment?
                            </h3>

                            <p className="mt-3 leading-7 text-[#6B7280]">
                                Hospitals, pathology laboratories, diagnostic
                                centres, research institutes and healthcare
                                facilities can purchase equipment from us.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}