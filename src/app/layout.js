import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL(
    "https://humarilab.in"
  ),

  title: "Biomedical Products, Equipment & Diagnostic Supplies | Raj Biosis",

  description: "Explore a broad Raj Biosis catalogue of biomedical equipment, diagnostic products, laboratory items, reagents, consumables and healthcare supplies.",

  keywords: [
    "Biomedical Products",
    "Medical Equipment",
    "Diagnostic Products",
    "Laboratory Equipment",
    "Medical Consumables",
    "Diagnostic Test Kits",
    "Lab Reagents",
    "Healthcare Equipment Supplier",
  ],

  openGraph: {
    title: "Biomedical Products, Equipment & Diagnostic Supplies | Raj Biosis",
    description: "Browse biomedical equipment, diagnostics, laboratory products, reagents, consumables and healthcare supplies.",

    url: "https://humarilab.in",

    siteName: "Raj Biosis",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Raj Biosis",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Biomedical Products & Healthcare Supplies | Raj Biosis",
    description: "A broad catalogue for biomedical, diagnostic, laboratory and healthcare product requirements.",

    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://humarilab.in",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />

        <main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />

          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}