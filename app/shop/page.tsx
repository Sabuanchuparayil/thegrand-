import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/sanity/data-fetcher";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mb-12">
            Explore our exquisite jewelry collections organized by category. From
            elegant necklaces to statement rings, find the perfect piece for every
            occasion.
          </p>
        </div>

        <CategoryCarousel />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-serif font-bold text-charcoal mb-8">
            All Products
          </h2>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-charcoal/50 text-lg">
                No products available yet.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}


