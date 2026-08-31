import ProductsPage from "@/app/items/page";

export async function generateMetadata({ params }) {
  const { district = "jaipur" } = await params;
  const districtName = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Biomedical & Lab Products in ${districtName} | Raj Biosis`,
    description: `Explore our catalog of CBC machines, chemistry analyzers, ELISA readers, and lab reagents supplied in ${districtName} by Raj Biosis.`,
    alternates: {
      canonical: `https://humarilab.in/${district}/items`,
    },
  };
}

export default async function Page({ params }) {

  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <ProductsPage district={district} city={city} />;
}