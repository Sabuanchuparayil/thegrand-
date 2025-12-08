import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import Image from "next/image";
import { fetchCollectionBySlug } from "@/lib/sanity/data-fetcher";
import { notFound } from "next/navigation";
import { urlForImage } from "@/lib/sanity/image";

export const revalidate = 60;

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await fetchCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        {collection.hero_image && (
            <div className="relative h-96 w-full">
            <Image
              src={typeof collection.hero_image === 'string' ? collection.hero_image : urlForImage(collection.hero_image)}
              alt={collection.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-xl text-diamond/90 max-w-2xl">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {collection.products && collection.products.length > 0 ? (
            <>
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-8">
                Products in this Collection
              </h2>
              <ProductGrid products={collection.products} />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-charcoal/50 text-lg">
                No products in this collection yet.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

