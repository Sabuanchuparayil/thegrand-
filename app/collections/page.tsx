import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CollectionSection from "@/components/CollectionSection";
import { fetchCollections } from "@/lib/sanity/data-fetcher";

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await fetchCollections();

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">
            Our Collections
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl">
            Explore our curated collections, each celebrating unique cultural
            heritage and timeless elegance.
          </p>
        </div>
        {collections.length > 0 ? (
          <CollectionSection collections={collections} />
        ) : (
          <div className="text-center py-20">
            <p className="text-charcoal/50 text-lg">
              Collections coming soon.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

