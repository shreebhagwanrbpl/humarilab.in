"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/items" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#EADBC8] bg-[#FFFDFB]/90 backdrop-blur-xl">

      <div className="container-custom flex h-20 items-center justify-between">

        {/* Logo */}

        <Link href={makeLink("/")} className="flex items-center gap-3">

          <Image
            src="/logo.png"
            alt="Raj Biosis Logo"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />

          <h1 className="text-xl font-bold md:text-2xl">

            <span className="text-[#6F4E37]">
              Raj
            </span>

            <span className="text-[#2C2C2C]">
              {" "}Biosis
            </span>

          </h1>

        </Link>

        {/* Desktop Menu */}

        <nav className="hidden items-center gap-8 text-[15px] font-medium text-[#6B7280] lg:flex">

          {navLinks.map((link) => (

            <Link
              key={link.name}
              href={makeLink(link.path)}
              className="relative transition duration-300 hover:text-[#6F4E37] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#B08968] after:transition-all hover:after:w-full"
            >

              {link.name}

            </Link>

          ))}

        </nav>

        {/* Desktop Button */}

        <div className="hidden lg:block">

          <Link href={makeLink("/contact")}>

            <button className="rounded-xl bg-[#6F4E37] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#4E342E]">

              Get Quote

            </button>

          </Link>

        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#6F4E37] transition hover:bg-[#EADBC8] lg:hidden"
        >

          {menuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}

        </button>

      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${menuOpen
          ? "max-h-[500px]"
          : "max-h-0"
          }`}
      >

        <div className="border-t border-[#EADBC8] bg-[#FFFDFB] p-6">

          <nav className="flex flex-col gap-5 font-medium">

            {navLinks.map((link) => (

              <Link
                key={link.name}
                href={makeLink(link.path)}
                onClick={() => setMenuOpen(false)}
                className="text-[#6B7280] transition hover:text-[#6F4E37]"
              >

                {link.name}

              </Link>

            ))}

            <Link
              href={makeLink("/contact")}
              onClick={() => setMenuOpen(false)}
            >

              <button className="mt-3 w-full rounded-xl bg-[#6F4E37] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#4E342E]">

                Get Quote

              </button>

            </Link>

          </nav>

        </div>

      </div>

    </header>
  );
}