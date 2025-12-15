"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

interface Collection {
  _id: string;
  title: string;
  slug: string | { current: string };
  hero_image?: any;
  description?: string;
  cultural_audience?: string[];
}

interface CollectionSectionProps {
  collections: Collection[];
}

export default function CollectionSection({
  collections,
}: CollectionSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-diamond">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal mb-4">
            Our Collections
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Discover our curated collections, each telling a unique story of
            heritage and elegance
          </p>
        </motion.div>

        <div className="space-y-24">
          {collections.map((collection, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={collection._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12`}
              >
                {/* Image */}
                <div className="flex-1 relative h-96 w-full rounded-2xl overflow-hidden luxury-shadow group">
                  {collection.hero_image ? (
                    <Image
                      src={typeof collection.hero_image === 'string' 
                        ? collection.hero_image 
                        : urlForImage(collection.hero_image)}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald to-gold" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
                    {collection.title}
                  </h3>
                  {collection.description && (
                    <p className="text-lg text-charcoal/70 leading-relaxed">
                      {collection.description}
                    </p>
                  )}
                  {collection.cultural_audience && (
                    <div className="flex flex-wrap gap-2">
                      {collection.cultural_audience.map((audience) => (
                        <span
                          key={audience}
                          className="px-4 py-2 bg-emerald/10 text-emerald rounded-full text-sm font-medium"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/collections/${typeof collection.slug === 'string' ? collection.slug : (collection.slug?.current || '')}`}
                    className="inline-block px-6 py-3 border-2 border-emerald text-emerald font-semibold rounded-lg hover:bg-emerald hover:text-white transition-all duration-300"
                  >
                    Explore Collection
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

