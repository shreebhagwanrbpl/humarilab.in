import AboutPage from "@/app/about/page";

export async function generateMetadata({ params }) {
  const { district = "jaipur" } = await params;
  const districtName = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `About Our Pathology Supply Network in ${districtName} | Biomedical Sourcing Partner`,
    description: `Learn about Raj Biosis, a trusted supplier, dealer, and distributor of diagnostic, pathology, and laboratory equipment in ${districtName}, India.`,
    alternates: {
      canonical: `https://humarilab.in/${district}/about`,
    },
  };
}

export default async function Page({ params }) {

  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <div className="site8-static"><AboutPage city={city} /></div>;
}