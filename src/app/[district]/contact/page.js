import ContactClient from "@/app/contact/ContactClient";

export async function generateMetadata({ params }) {
  const { district = "jaipur" } = await params;
  const districtName = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `Contact Raj Biosis in ${districtName} | Diagnostic Supplier Office`,
    description: `Speak with our pathology equipment team for diagnostic and laboratory equipment quotes in ${districtName}. Address, phone, and inquiry form.`,
    alternates: {
      canonical: `https://humarilab.in/${district}/contact`,
    },
  };
}

export default async function Page({ params }) {

  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <div className="site8-static"><ContactClient city={city} /></div>;
}