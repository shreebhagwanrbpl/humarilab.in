export async function generateMetadata({ params }) {

  const { district = "jaipur" } = await params;

  const districtName = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const url = `https://humarilab.in/${district}`;

  return {
    title: `Pathology & Clinical Lab Equipment in ${districtName} | Raj Biosis`,

    description: `Raj Biosis helps hospitals and clinical labs in ${districtName} source pathology analyzers, biochemistry systems, and diagnostics reagents.`,

    keywords: [
      `Pathology Equipment ${districtName}`,
      `Clinical Laboratory ${districtName}`,
      `Biochemistry Analyzer ${districtName}`,
      `CBC Machine Supplier ${districtName}`,
      `Hematology System ${districtName}`,
    ],

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `Pathology & Clinical Lab Equipment in ${districtName} | Raj Biosis`,
      description: `Raj Biosis helps hospitals and clinical labs in ${districtName} source pathology analyzers, biochemistry systems, and diagnostics reagents.`,
      url,
      type: "website",
    },
  };
}

export default function DistrictLayout({ children }) {
  return children;
}