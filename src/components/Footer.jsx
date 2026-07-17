"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] =
    useState(null);

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
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          setContactInfo(
            snap.data().contactInfo || []
          );
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
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

  const phone =
    contactInfo.find(
      (x) => x.label === "Phone Number"
    )?.value || "";

  const email =
    contactInfo.find(
      (x) => x.label === "Email Address"
    )?.value || "";

  const address =
    contactInfo.find(
      (x) => x.label === "Office Address"
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

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">

          {/* Company */}

          <div>

            <h2 className="text-2xl font-bold text-[#6F4E37]">

              Central

              <span className="text-[#2C2C2C]">
                {" "}Biomedicals
              </span>

            </h2>

            <p className="mt-5 leading-7 text-[#6B7280]">

              Delivering trusted diagnostic
              and biomedical solutions with
              innovation, quality, and
              precision healthcare support.

            </p>

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

          {/* Services */}

          <div>

            <h3 className="mb-5 text-lg font-bold text-[#2C2C2C]">
              Services
            </h3>

            <div className="space-y-3 text-[#6B7280]">

              <p>Diagnostic Equipment</p>
              <p>Laboratory Solutions</p>
              <p>Biomedical Instruments</p>
              <p>Maintenance Support</p>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-5 text-lg font-bold text-[#2C2C2C]">
              Contact Info
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EADBC8]">

                  <MapPin
                    size={18}
                    className="text-[#6F4E37]"
                  />

                </div>

                <p className="text-[#6B7280] leading-7">
                  {dynamicAddress}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EADBC8]">

                  <Phone
                    size={18}
                    className="text-[#6F4E37]"
                  />

                </div>

                <p className="text-[#6B7280]">
                  {phone}
                </p>

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
            © 2026 <span className="font-semibold text-[#6F4E37]">Central Biomedicals</span>.
            All rights reserved.
          </p>

          <p className="mt-3 md:mt-0">
            Designed with precision for modern diagnostics.
          </p>

        </div>

      </div>

    </footer>
  );
}