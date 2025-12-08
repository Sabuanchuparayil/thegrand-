import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ARTryOnClient from "@/components/ARTryOnClient";
import { fetchProducts } from "@/lib/sanity/data-fetcher";

export const revalidate = 60;

export default async function ARTryOnPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">
              AR Try-On Experience
            </h1>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              See how our jewelry looks on you before you buy. Experience our
              augmented reality try-on feature.
            </p>
          </div>
          <ARTryOnClient products={products} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

