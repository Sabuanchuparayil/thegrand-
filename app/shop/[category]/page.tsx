import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";
import { fetchProductsByCategory } from "@/lib/sanity/data-fetcher";

export const revalidate = 60;

const categoryNames: Record<string, string> = {
  necklaces: "Necklaces",
  earrings: "Earrings",
  rings: "Rings",
  bracelets: "Bracelets",
  bangles: "Bangles",
  pendants: "Pendants",
  "mens-jewelry": "Men's Jewelry",
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ occasion?: string; style?: string; material?: string }>;
}) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const products = await fetchProductsByCategory(category);
  const categoryName = categoryNames[category] || category;

  // Filter products based on search params
  let filteredProducts = products;
  if (resolvedSearchParams.occasion) {
    filteredProducts = filteredProducts.filter((p: any) =>
      p.cultural_tags?.includes(resolvedSearchParams.occasion)
    );
  }
  if (resolvedSearchParams.style) {
    filteredProducts = filteredProducts.filter((p: any) =>
      p.cultural_tags?.includes(resolvedSearchParams.style)
    );
  }
  if (resolvedSearchParams.material) {
    filteredProducts = filteredProducts.filter(
      (p: any) => p.material_type === resolvedSearchParams.material
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-charcoal/70 mb-8">
            Discover our exquisite collection of {categoryName.toLowerCase()}
          </p>

          <ProductFilters />

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-20">
              <p className="text-charcoal/50 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

