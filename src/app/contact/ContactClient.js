"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Clock3 } from "lucide-react";
import { parseContactInfo } from "@/lib/admin-api";

import PageBanner from "@/components/PageBanner";
import CTASection from "@/components/CTASection";

export default function ContactClient({ city }) {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);
  const [contactInfo, setContactInfo] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const currentDistrict =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.name.trim()) {
      return toast.error("Name is required");
    }

    if (!emailRegex.test(form.email)) {
      return toast.error("Enter valid email");
    }

    if (!phoneRegex.test(form.phone)) {
      return toast.error("Enter valid mobile number");
    }

    if (!form.message.trim()) {
      return toast.error("Message is required");
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/contact-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        toast.success(json.message || "Message submitted successfully");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(json.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadDistrict = async () => {
      if (!currentDistrict) return;
      try {
        const res = await fetch(
          `/api/site-data?type=district&district=${encodeURIComponent(
            currentDistrict
          )}`
        );
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json?.data) {
            setDistrictData(json.data);
          }
        }
      } catch (err) {
        console.error("Error fetching district data:", err);
      }
    };

    loadDistrict();
    return () => {
      isMounted = false;
    };
  }, [currentDistrict]);

  useEffect(() => {
    let isMounted = true;

    const loadContact = async () => {
      try {
        const res = await fetch("/api/site-data?type=contact");
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json?.data) {
            setContactInfo(json.data.contactInfo || json.data || []);
          }
        }
      } catch (err) {
        console.error("Error loading contact data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContact();
    return () => {
      isMounted = false;
    };
  }, []);

  const parsedContact = parseContactInfo(contactInfo);
  const phoneNumbers = parsedContact.phones;
  const emailAddresses = parsedContact.emails;
  const address = parsedContact.address;
  const hours = parsedContact.hours;

  const dynamicAddress = districtData
    ? `${districtData.district || ""}${
        districtData.state ? `, ${districtData.state}` : ""
      }${districtData.country ? `, ${districtData.country}` : ", India"}`
    : address;

  const mapAddress = encodeURIComponent(dynamicAddress || "India");

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="h-12 w-64 bg-slate-200 rounded animate-pulse mb-8" />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-slate-200 rounded-3xl animate-pulse mb-6"
                />
              ))}
            </div>
            <div className="bg-white p-10 rounded-3xl">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-200 rounded-2xl animate-pulse mb-5"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Contact Us"
        subtitle="Speak with our pathology equipment team for premium diagnostic and biomedical solutions."
      />

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-2 gap-14">
          {/* Left Info */}
          <div>
            {/* Badge */}
            <span className="mb-5 inline-block rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 font-semibold text-[#6F4E37] shadow-sm">
              Contact Information
            </span>

            {/* Heading */}
            <h2 className="text-4xl font-extrabold leading-tight text-[#2C2C2C]">
              Let's Start a Conversation
            </h2>

            {/* Accent Line */}
            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6B7280]">
              Reach out to us for healthcare consultation, biomedical products,
              and advanced diagnostic support.
            </p>

            {/* Contact Cards */}
            <div className="mt-10 space-y-6">
              {/* Phone Numbers */}
              {phoneNumbers.length > 0 && (
                <div className="group flex items-start gap-5 rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EADBC8] text-[#6F4E37] transition-all duration-300 group-hover:bg-[#6F4E37] group-hover:text-white">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2C2C2C]">
                      Mobile / WhatsApp
                    </h4>
                    <div className="mt-2 flex flex-col gap-1 text-[#6B7280]">
                      {phoneNumbers.map((number, idx) => {
                        const phoneText = String(number);
                        return (
                          <a
                            key={idx}
                            href={`tel:${phoneText.replace(/[^\d+]/g, "")}`}
                            className="transition hover:text-[#6F4E37] block"
                          >
                            {phoneText}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Email Addresses */}
              {emailAddresses.length > 0 && (
                <div className="group flex items-start gap-5 rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EADBC8] text-[#6F4E37] transition-all duration-300 group-hover:bg-[#6F4E37] group-hover:text-white">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2C2C2C]">
                      Business Email
                    </h4>
                    <div className="mt-2 flex flex-col gap-1 text-[#6B7280]">
                      {emailAddresses.map((emailText, idx) => (
                        <a
                          key={idx}
                          href={`mailto:${emailText}`}
                          className="transition hover:text-[#6F4E37] block"
                        >
                          {emailText}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              {dynamicAddress && (
                <div className="group flex items-start gap-5 rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EADBC8] text-[#6F4E37] transition-all duration-300 group-hover:bg-[#6F4E37] group-hover:text-white">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2C2C2C]">
                      Office Address
                    </h4>
                    <p className="mt-2 leading-7 text-[#6B7280]">
                      {dynamicAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* Working Hours */}
              {hours && (
                <div className="group flex items-start gap-5 rounded-[28px] border border-[#EADBC8] bg-[#FFFDFB] p-6 shadow-[0_12px_35px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(111,78,55,0.18)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EADBC8] text-[#6F4E37] transition-all duration-300 group-hover:bg-[#6F4E37] group-hover:text-white">
                    <Clock3 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2C2C2C]">
                      Working Hours
                    </h4>
                    <p className="mt-2 text-[#6B7280]">{hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Form */}
          <div className="rounded-[40px] border border-[#EADBC8] bg-[#FFFDFB] p-8 lg:p-10 shadow-[0_20px_60px_rgba(111,78,55,0.12)]">
            <h3 className="text-3xl font-extrabold text-[#2C2C2C]">
              Discuss Your Lab Requirement
            </h3>

            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

            <p className="mt-5 leading-7 text-[#6B7280]">
              Fill out the form and our team will contact you soon.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Contact Person"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A8472] outline-none transition-all duration-300 focus:border-[#6F4E37] focus:ring-4 focus:ring-[#B08968]/20"
              />

              <input
                type="email"
                name="email"
                placeholder="Business Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A8472] outline-none transition-all duration-300 focus:border-[#6F4E37] focus:ring-4 focus:ring-[#B08968]/20"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Mobile / WhatsApp"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A8472] outline-none transition-all duration-300 focus:border-[#6F4E37] focus:ring-4 focus:ring-[#B08968]/20"
              />

              <input
                type="text"
                name="subject"
                placeholder="Laboratory Enquiry"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A8472] outline-none transition-all duration-300 focus:border-[#6F4E37] focus:ring-4 focus:ring-[#B08968]/20"
              />

              <textarea
                rows={5}
                name="message"
                placeholder="Tell us about your lab requirement"
                value={form.message}
                onChange={handleChange}
                className="w-full resize-none rounded-2xl border border-[#EADBC8] bg-[#FFF8F3] px-5 py-4 text-[#2C2C2C] placeholder:text-[#9A8472] outline-none transition-all duration-300 focus:border-[#6F4E37] focus:ring-4 focus:ring-[#B08968]/20"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#4E342E] py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-[#5B3F2D] hover:to-[#3E2723] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Google Map */}
      {dynamicAddress && (
        <section className="pb-24 bg-white">
          <div className="container-custom">
            <div className="rounded-[40px] overflow-hidden border border-slate-100 card-shadow">
              <iframe
                src={`https://maps.google.com/maps?q=${mapAddress}&z=13&output=embed`}
                width="100%"
                height="500"
                loading="lazy"
                className="border-0 w-full"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection />
    </>
  );
}
