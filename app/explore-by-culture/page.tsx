import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ExploreByCultureSection from "@/components/ExploreByCultureSection";
import { getAllCulturalTags, fetchProductsByCulturalTag } from "@/lib/sanity/data-fetcher";

export const revalidate = 60;

// Cultural tag metadata
const CULTURAL_TAG_INFO: Record<string, { title: string; description: string; image?: string }> = {
  "Traditional Indian Bridal": {
    title: "Traditional Indian Bridal",
    description: "Exquisite bridal jewelry celebrating Indian traditions with intricate designs and premium craftsmanship.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
  },
  "Contemporary Minimalist": {
    title: "Contemporary Minimalist",
    description: "Modern elegance meets timeless design. Clean lines and sophisticated simplicity for the contemporary connoisseur.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop",
  },
  "Middle Eastern Ornate": {
    title: "Middle Eastern Ornate",
    description: "Intricate patterns and ornate designs celebrating Middle Eastern artistic traditions and cultural heritage.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop",
  },
  "Halal-friendly": {
    title: "Halal-friendly",
    description: "Beautiful jewelry designed with cultural sensitivity, adhering to Halal principles while maintaining elegance.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&h=800&fit=crop",
  },
  "Western Engagement": {
    title: "Western Engagement",
    description: "Classic engagement rings and bridal jewelry inspired by Western traditions. Timeless designs for your special moment.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&h=800&fit=crop",
  },
  "Afro-Caribbean": {
    title: "Afro-Caribbean",
    description: "Vibrant and bold designs celebrating Afro-Caribbean heritage with unique cultural motifs and contemporary style.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
  },
};

export default async function ExploreByCulturePage() {
  const culturalTags = await getAllCulturalTags();

  // Get product counts for each cultural tag
  const culturalGroups = await Promise.all(
    culturalTags.map(async (tag) => {
      const products = await fetchProductsByCulturalTag(tag);
      const info = CULTURAL_TAG_INFO[tag] || {
        title: tag,
        description: `Discover our exquisite collection of ${tag} jewelry, crafted with premium materials and exceptional attention to detail.`,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
      };
      
      return {
        tag,
        title: info.title,
        description: info.description,
        image: info.image,
        productCount: products.length,
        products: products.slice(0, 4), // Show first 4 products as preview
      };
    })
  );

  // Filter out groups with no products
  const activeGroups = culturalGroups.filter((group) => group.productCount > 0);

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">
            Explore by Culture
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mb-8">
            Discover our diverse jewelry collections, each celebrating unique
            cultural heritage and timeless elegance. From traditional bridal sets
            to contemporary minimalist designs, find pieces that resonate with
            your cultural identity and personal style.
          </p>
        </div>
        {activeGroups.length > 0 ? (
          <ExploreByCultureSection culturalGroups={activeGroups} />
        ) : (
          <div className="text-center py-20">
            <p className="text-charcoal/50 text-lg">
              Cultural collections coming soon.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}


