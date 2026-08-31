import ServicesPage from "@/app/services/page";

export async function generateMetadata({ params }) {
  const { district = "jaipur" } = await params;
  const districtName = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Biomedical & Laboratory Services in ${districtName} | Raj Biosis`,
    description: `Explore biomedical supply, laboratory setup guidance, and procurement support services offered by Raj Biosis in ${districtName}, India.`,
    alternates: {
      canonical: `https://humarilab.in/${district}/services`,
    },
  };
}

export default async function Page({ params }) {

  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <div className="site8-static"><ServicesPage city={city} /></div>;
}