import CategoryPage, { generateMetadata as categoryMetadata, generateStaticParams as categoryParams } from "@/app/category/[slug]/page";

export async function generateStaticParams() {
    return categoryParams();
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const meta = await categoryMetadata({ params });
    return {
        ...meta,
        title: `${meta.title.split(" | ")[0]} Laboratory Equipment Supplier | Raj Biosis`,
        alternates: {
            canonical: `https://humarilab.in/laboratory-equipment/${slug}`,
        }
    };
}

export default async function Page({ params }) {
    return <CategoryPage params={params} />;
}
