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
  searchParams: Promise<{ occasion?: string; style?: string; material?: string; culture?: string }>;
}) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const products = await fetchProductsByCategory(category);
  const categoryName = categoryNames[category] || category;

  // Filter products based on search params
  let filteredProducts = products;
  
  // Culture filter - exact match on cultural_tags
  if (resolvedSearchParams.culture) {
    filteredProducts = filteredProducts.filter((p: any) =>
      p.cultural_tags?.includes(resolvedSearchParams.culture)
    );
  }
  
  // Occasion filter - partial/fuzzy match on cultural_tags
  // Maps filter values to cultural_tags: "Bridal" -> "Traditional Indian Bridal", "Wedding" -> "Western Engagement", etc.
  if (resolvedSearchParams.occasion) {
    const occasion = resolvedSearchParams.occasion.toLowerCase();
    filteredProducts = filteredProducts.filter((p: any) => {
      if (!p.cultural_tags || !Array.isArray(p.cultural_tags)) return false;
      // Check if any cultural tag contains the occasion keyword
      return p.cultural_tags.some((tag: string) => {
        const tagLower = tag.toLowerCase();
        // Map occasions to cultural tags
        if (occasion === 'bridal' || occasion === 'wedding') {
          return tagLower.includes('bridal') || tagLower.includes('engagement');
        }
        if (occasion === 'festival' || occasion === 'diwali') {
          return tagLower.includes('traditional') || tagLower.includes('indian');
        }
        if (occasion === 'eid') {
          return tagLower.includes('middle eastern') || tagLower.includes('halal');
        }
        if (occasion === 'cocktail') {
          return tagLower.includes('contemporary') || tagLower.includes('minimalist');
        }
        // Fallback: check if tag contains the occasion keyword
        return tagLower.includes(occasion);
      });
    });
  }
  
  // Style filter - partial match on cultural_tags
  // Maps filter values to cultural_tags: "Traditional" -> "Traditional Indian Bridal", "Minimalist" -> "Contemporary Minimalist", etc.
  if (resolvedSearchParams.style) {
    const style = resolvedSearchParams.style.toLowerCase();
    filteredProducts = filteredProducts.filter((p: any) => {
      if (!p.cultural_tags || !Array.isArray(p.cultural_tags)) return false;
      // Check if any cultural tag contains the style keyword
      return p.cultural_tags.some((tag: string) => {
        const tagLower = tag.toLowerCase();
        // Map styles to cultural tags
        if (style === 'traditional') {
          return tagLower.includes('traditional') || tagLower.includes('indian');
        }
        if (style === 'modern' || style === 'minimalist') {
          return tagLower.includes('contemporary') || tagLower.includes('minimalist');
        }
        if (style === 'fusion') {
          return tagLower.includes('ornate') || tagLower.includes('afro');
        }
        if (style === 'ethnic') {
          return tagLower.includes('indian') || tagLower.includes('middle eastern') || tagLower.includes('afro');
        }
        // Fallback: check if tag contains the style keyword
        return tagLower.includes(style);
      });
    });
  }
  
  // Material filter - exact match on material_type
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

