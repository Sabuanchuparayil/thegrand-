import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BrandValuesSection from "@/components/BrandValuesSection";
import CulturalBanner from "@/components/CulturalBanner";
import CollectionSection from "@/components/CollectionSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import ARTeaser from "@/components/ARTeaser";
import InaugurationAnnouncement from "@/components/InaugurationAnnouncement";
import Testimonials from "@/components/Testimonials";
import CategoryCarousel from "@/components/CategoryCarousel";
import {
  fetchHomepage,
  fetchCollections,
  fetchFeaturedProducts,
} from "@/lib/sanity/data-fetcher";

export const revalidate = 60; // Revalidate every 60 seconds

async function getHomepageData() {
  const [homepage, collections, featuredProducts] = await Promise.all([
    fetchHomepage(),
    fetchCollections(),
    fetchFeaturedProducts(),
  ]);

  return {
    homepage,
    collections,
    featuredProducts,
  };
}

export default async function HomePage() {
  const { homepage, collections, featuredProducts } = await getHomepageData();

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <HeroSection
          headline={homepage?.hero_banner?.headline}
          subheadline={homepage?.hero_banner?.subheadline}
          videoUrl={homepage?.hero_banner?.video}
          imageUrl={homepage?.hero_banner?.image || homepage?.hero_banner?.imageUrl}
        />
        <BrandValuesSection />
        <CategoryCarousel />
        <CulturalBanner sections={homepage?.cultural_sections} />
        {collections.length > 0 && (
          <CollectionSection collections={collections.slice(0, 3)} />
        )}
        {featuredProducts.length > 0 && (
          <FeaturedCollections products={featuredProducts} />
        )}
        <ARTeaser
          title={homepage?.ar_tryon_highlight?.title}
          description={homepage?.ar_tryon_highlight?.description}
          image={homepage?.ar_tryon_highlight?.image}
        />
        <InaugurationAnnouncement event={homepage?.inauguration_event} />
        <Testimonials />
      </div>
      <Footer />
    </main>
  );
}

