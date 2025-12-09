"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface Collection {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

// Icon mapping based on collection title or cultural tags
const getCollectionIcon = (title: string): string => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("indian") || titleLower.includes("bridal")) return "👑";
  if (titleLower.includes("contemporary") || titleLower.includes("minimalist")) return "✨";
  if (titleLower.includes("middle eastern") || titleLower.includes("ornate")) return "🌙";
  if (titleLower.includes("western") || titleLower.includes("engagement")) return "💍";
  if (titleLower.includes("afro") || titleLower.includes("caribbean")) return "🌟";
  if (titleLower.includes("heritage") || titleLower.includes("classic")) return "🏛️";
  return "💎"; // Default icon
};

export default function CategoryCarousel() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        if (response.ok) {
          const data = await response.json();
          setCollections(data.collections || []);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        setCollections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-diamond overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal mb-2">
            Explore by Culture
          </h2>
          <p className="text-charcoal/70">
            Discover collections designed for every heritage
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-56 sm:w-64 h-40 sm:h-48 glass-morphism rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide touch-pan-x">
            {collections.map((collection, index) => (
              <motion.div
                key={collection._id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex-shrink-0 snap-start"
              >
                <Link
                  href={`/collections/${collection.slug?.current || collection.slug}`}
                  className="block touch-manipulation"
                >
                  <div className="w-56 sm:w-64 h-40 sm:h-48 glass-morphism rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center hover-glow transition-all duration-300 group">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      {getCollectionIcon(collection.title)}
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-semibold text-charcoal group-hover:text-emerald transition-colors">
                      {collection.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-charcoal/70">
              Collections coming soon. Check back later!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .touch-pan-x {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
        }
        .touch-manipulation {
          touch-action: manipulation;
        }
      `}</style>
    </section>
  );
}


