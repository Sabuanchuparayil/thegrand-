"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import ProductGrid from "./ProductGrid";
import { urlForImage } from "@/lib/sanity/image";

interface CulturalGroup {
  tag: string;
  title: string;
  description: string;
  image?: string;
  productCount: number;
  products: any[];
}

interface ExploreByCultureSectionProps {
  culturalGroups: CulturalGroup[];
}

export default function ExploreByCultureSection({
  culturalGroups,
}: ExploreByCultureSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-diamond">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {culturalGroups.map((group, index) => (
            <motion.div
              key={group.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden luxury-shadow hover-glow transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-64 w-full overflow-hidden">
                {group.image ? (
                  <Image
                    src={group.image}
                    alt={group.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald to-gold flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">
                    {group.title}
                  </h3>
                  <p className="text-charcoal/70 text-sm leading-relaxed">
                    {group.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-charcoal/10">
                  <span className="text-sm font-semibold text-emerald">
                    {group.productCount} {group.productCount === 1 ? "piece" : "pieces"}
                  </span>
                  <Link
                    href={`/shop?culturalTag=${encodeURIComponent(group.tag)}`}
                    className="px-4 py-2 bg-emerald text-white font-semibold rounded-lg hover:bg-emerald-dark transition-all duration-300 text-sm"
                  >
                    Explore
                  </Link>
                </div>

                {/* Product Preview */}
                {group.products.length > 0 && (
                  <div className="pt-4 border-t border-charcoal/10">
                    <p className="text-xs text-charcoal/50 mb-3 font-semibold">
                      Featured Pieces
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.products.slice(0, 4).map((product, idx) => {
                        // Bug Fix 1: Properly handle both string URLs and Sanity image objects
                        let imageUrl: string | null = null;
                        if (product.images && product.images[0]) {
                          if (typeof product.images[0] === 'string') {
                            imageUrl = product.images[0];
                          } else {
                            // Convert Sanity image object to URL
                            imageUrl = urlForImage(product.images[0]) || null;
                          }
                        }
                        // Bug Fix 2: Fix slug extraction with proper fallback chain
                        const slug = product.slug?.current || (typeof product.slug === 'string' ? product.slug : '');
                        return (
                          <Link
                            key={product._id || idx}
                            href={`/products/${slug}`}
                            className="relative aspect-square rounded-lg overflow-hidden group/item"
                          >
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={product.name || 'Product'}
                                fill
                                className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald/20 to-gold/20" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

