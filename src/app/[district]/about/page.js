import AboutPage from "@/app/about/page";

export async function generateMetadata({ params }) {
  const { district = "jaipur" } = await params;
  const districtName = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `About Raj Biosis in ${districtName} | Biomedical Product Catalogue`,
    description: `Explore biomedical equipment, diagnostic products, laboratory items, reagents and healthcare supplies available for enquiries in ${districtName}, India.`,
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