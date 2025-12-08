"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  images?: any[];
  price?: number;
  ar_2d_overlay?: any;
  ar_3d_model?: any;
  category?: string;
}

interface FeaturedCollectionsProps {
  products: Product[];
}

export default function FeaturedCollections({
  products,
}: FeaturedCollectionsProps) {
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
            Featured Pieces
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Handpicked selections from our finest collections
          </p>
        </motion.div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-charcoal/50">No featured products available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

