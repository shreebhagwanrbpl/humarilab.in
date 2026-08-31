import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL(
    "https://humarilab.in"
  ),

  title: "Pathology & Clinical Laboratory Equipment | Raj Biosis",

  description: "Raj Biosis supplies clinical pathology laboratory systems, biochemistry analyzers, hematology counters, and diagnostics reagents to hospitals across India.",

  keywords: [
    "Clinical Laboratory Equipment",
    "Pathology Analyzers Supplier",
    "Biochemistry Analyzers Dealer",
    "CBC Machine Distributor India",
    "Hematology Systems",
    "Lab Reagents & Calibrators",
    "Diagnostic Laboratory Setup",
  ],

  openGraph: {
    title: "Pathology & Clinical Laboratory Equipment | Raj Biosis",

    description: "Premium supplier of diagnostics and medical equipment across India.",

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

    title: "Pathology & Clinical Laboratory Equipment | Raj Biosis",

    description: "Premium supplier of diagnostics and medical equipment across India.",

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