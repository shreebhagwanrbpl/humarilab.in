"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getWebsiteConfig, isItemVisible } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        // Load contact info
        const snap = await getDoc(
          doc(db, "websites", "humarilabin", "pages", "contact")
        );

        if (snap.exists()) {
          setContactInfo(snap.data().contactInfo || []);
        }

        // Load visible categories from Master Catalog
        const config = getWebsiteConfig();
        const companyId = config.companyId || "rajbiosis";
        const categorySnap = await getDocs(
          collection(db, "companies", companyId, "categories")
        );
        const catList = categorySnap.docs
          .filter((d) => isItemVisible(d.data()))
          .map((doc) => {
            const data = doc.data();
            return data.name || data.category || doc.id;
          });

        // Filter unique and non-empty categories
        const uniqueCats = Array.from(new Set(catList.filter(Boolean)));
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Error loading footer data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "humarilabin",
            "districts",
            district
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDistrict();
  }, [district]);

  const phoneVal =
    contactInfo.find(
      (x) => x.label === "Mobile / WhatsApp" || x.label === "Phone"
    )?.value || "";

  const phoneNumbers = Array.isArray(phoneVal)
    ? phoneVal.filter(Boolean)
    : phoneVal
      ? [phoneVal]
      : [];

  const email =
    contactInfo.find(
      (x) => x.label === "Business Email" || x.label === "Email"
    )?.value || "";

  const address =
    contactInfo.find(
      (x) => x.label === "Office Address" || x.label === "Address"
    )?.value || "";

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };
  if (loading) {
    return (
      <footer className="bg-white border-t border-slate-200">
        <div className="container-custom py-16">

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">

            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-6" />

                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="h-5 bg-slate-200 rounded animate-pulse mb-4"
                  />
                ))}
              </div>
            ))}

          </div>

          <div className="border-t border-slate-200 mt-12 pt-6">
            <div className="h-5 w-72 bg-slate-200 rounded animate-pulse" />
          </div>

        </div>
      </footer>
    );
  }
  return (
    <footer className="bg-[#F8F5F2] border-t border-[#EADBC8]">

      <div className="container-custom py-16">

        <div className="grid lg:grid-cols-[1.4fr_0.8fr_1.2fr_1.6fr] md:grid-cols-2 gap-10 lg:gap-12">

          {/* Company */}

          <div>

            <h2 className="text-2xl font-bold text-[#6F4E37]">

              Raj

              <span className="text-[#2C2C2C]">
                {" "}Biosis
              </span>

            </h2>

            <p className="mt-5 leading-7 text-[#6B7280]">

              A broad catalogue for biomedical
              equipment, diagnostics, laboratory
              products, consumables and other
              professional healthcare requirements.

            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.facebook.com/rajbiosispvtltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EADBC8] text-[#6F4E37] transition hover:bg-[#6F4E37] hover:text-white"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/rajbiosisindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EADBC8] text-[#6F4E37] transition hover:bg-[#6F4E37] hover:text-white"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-5 text-lg font-bold text-[#2C2C2C]">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                href={makeLink("/")}
                className="text-[#6B7280] transition hover:text-[#6F4E37]"
              >
                Home
              </Link>

              <Link
                href={makeLink("/about")}
                className="text-[#6B7280] transition hover:text-[#6F4E37]"
              >
                About
              </Link>

              <Link
                href={makeLink("/services")}
                className="text-[#6B7280] transition hover:text-[#6F4E37]"
              >
                Services
              </Link>

              <Link
                href={makeLink("/items")}
                className="text-[#6B7280] transition hover:text-[#6F4E37]"
              >
                Products
              </Link>

              <Link
                href={makeLink("/contact")}
                className="text-[#6B7280] transition hover:text-[#6F4E37]"
              >
                Contact
              </Link>

            </div>

          </div>

          {/* Services / Categories */}

          <div>

            <h3 className="mb-5 text-lg font-bold text-[#2C2C2C]">
              Categories
            </h3>

            <div className="space-y-3 text-[#6B7280]">
              {categories.slice(0, 7).map((cat, idx) => (
                <Link
                  key={idx}
                  href={makeLink(`/items?category=${encodeURIComponent(cat)}`)}
                  className="block transition hover:text-[#6F4E37]"
                >
                  {cat}
                </Link>
              ))}
              {categories.length === 0 && (
                <>
                  <p>Hematology Systems</p>
                  <p>Biochemistry Analyzers</p>
                  <p>Urine Chemistry Devices</p>
                </>
              )}
            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-5 text-lg font-bold text-[#2C2C2C]">
              Contact Info
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EADBC8] mt-1">

                  <MapPin
                    size={18}
                    className="text-[#6F4E37]"
                  />

                </div>

                <p className="text-[#6B7280] leading-7">
                  {dynamicAddress}
                </p>

              </div>

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EADBC8] mt-0.5">

                  <Phone
                    size={18}
                    className="text-[#6F4E37]"
                  />

                </div>

                <div className="flex flex-col gap-1 text-[#6B7280]">
                  {phoneNumbers.map((number, idx) => {
                    const phoneText = String(number);
                    return (
                      <a
                        key={idx}
                        href={`tel:${phoneText.replace(/[^\d+]/g, "")}`}
                        className="transition hover:text-[#6F4E37]"
                      >
                        {phoneText}
                      </a>
                    );
                  })}
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EADBC8]">

                  <Mail
                    size={18}
                    className="text-[#6F4E37]"
                  />

                </div>

                <p className="text-[#6B7280]">
                  {email}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#DCCBB8] pt-6 text-sm text-[#8D6E63] md:flex-row">

          <p>
            © 2026 <span className="font-semibold text-[#6F4E37]">Raj Biosis</span>.
            All rights reserved.
          </p>

          <p className="mt-3 md:mt-0">
            Designed with precision for clinical pathology and laboratory diagnostics.
          </p>

        </div>

      </div>

    </footer>
  );
}