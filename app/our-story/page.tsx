import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Award, Heart, Globe, Sparkles } from "lucide-react";

export default function OurStoryPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative h-96 w-full bg-gradient-to-br from-emerald to-charcoal">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-4">
                Our Story
              </h1>
              <p className="text-xl text-diamond/90 max-w-2xl mx-auto">
                A legacy of craftsmanship, heritage, and timeless elegance
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {/* Heritage Section */}
          <section>
            <h2 className="text-4xl font-serif font-bold text-charcoal mb-6">
              Rooted in Heritage
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed mb-4">
              THE GRAND GOLD & DIAMONDS was born from a vision to celebrate the
              rich tapestry of cultural traditions while embracing modern
              elegance. Our journey began with a simple belief: that jewelry
              should honor heritage, tell stories, and connect generations.
            </p>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              Drawing inspiration from diverse cultures across South Asia, the
              Middle East, Africa, and Western Europe, we create pieces that
              resonate with the global community while maintaining the highest
              standards of craftsmanship and luxury.
            </p>
          </section>

          {/* Craftsmanship Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-8 h-8 text-emerald" />
              <h2 className="text-4xl font-serif font-bold text-charcoal">
                Master Craftsmanship
              </h2>
            </div>
            <p className="text-lg text-charcoal/70 leading-relaxed mb-4">
              Each piece in our collection is meticulously crafted by master
              artisans who have dedicated their lives to the art of jewelry
              making. We combine traditional techniques passed down through
              generations with contemporary design sensibilities, resulting in
              jewelry that is both timeless and relevant.
            </p>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              From the initial design concept to the final polish, every step
              is executed with precision and care. We source only the finest
              materials—premium gold, ethically sourced diamonds, and precious
              gemstones—ensuring that each piece meets our exacting standards of
              quality and beauty.
            </p>
          </section>

          {/* Cultural Inclusion Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-8 h-8 text-gold" />
              <h2 className="text-4xl font-serif font-bold text-charcoal">
                Celebrating Diversity
              </h2>
            </div>
            <p className="text-lg text-charcoal/70 leading-relaxed mb-4">
              At THE GRAND, we believe that beauty knows no boundaries. Our
              collections are designed to honor and celebrate the diverse
              cultural heritage of our global community. Whether you're
              celebrating Diwali, Eid, a wedding, or any special occasion, we
              have pieces that reflect your unique identity and traditions.
            </p>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              We are committed to creating an inclusive space where everyone
              feels represented and celebrated. Our designs draw from a rich
              palette of cultural influences, creating jewelry that speaks to
              multiple heritages while maintaining a cohesive luxury aesthetic.
            </p>
          </section>

          {/* Vision Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="w-8 h-8 text-emerald" />
              <h2 className="text-4xl font-serif font-bold text-charcoal">
                Our Vision
              </h2>
            </div>
            <p className="text-lg text-charcoal/70 leading-relaxed mb-4">
              As we launch in the UK, we are excited to bring our vision of
              culturally inclusive luxury jewelry to a new market. We see
              ourselves not just as a jewelry brand, but as a bridge between
              cultures, traditions, and generations.
            </p>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              Our commitment extends beyond creating beautiful jewelry. We are
              dedicated to sustainable practices, ethical sourcing, and building
              lasting relationships with our customers and communities. Every
              piece we create is a promise—a promise of quality, heritage, and
              timeless elegance.
            </p>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-emerald/10 to-gold/10 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">
              Join Us on This Journey
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Experience the artistry, heritage, and luxury that define THE
              GRAND GOLD & DIAMONDS. Visit our store or explore our collections
              online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/store"
                className="px-8 py-4 bg-emerald text-white font-semibold rounded-lg hover:bg-emerald-dark transition-all duration-300 hover-glow"
              >
                Visit Our Store
              </a>
              <a
                href="/collections"
                className="px-8 py-4 border-2 border-emerald text-emerald font-semibold rounded-lg hover:bg-emerald hover:text-white transition-all duration-300"
              >
                Explore Collections
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}



