import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Raj Biosis | Biomedical Sourcing & Quotations",
  description: "Speak with our pathology equipment team for diagnostic and laboratory equipment quotes. Address, phone, working hours, and quick query form.",
  alternates: {
    canonical: "https://humarilab.in/contact",
  },
};

export default function Page() {
  return <div className="site8-static"><ContactClient /></div>;
}