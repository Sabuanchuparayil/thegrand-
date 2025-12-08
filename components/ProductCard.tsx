"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { urlForImage } from "@/lib/sanity/image";
import DynamicPrice from "./DynamicPrice";
import { Product } from "@/lib/gold-price/calculator";

interface ProductCardProps {
  product: Product & {
    _id: string;
    name: string;
    slug: { current: string };
    images?: any[];
    price?: number;
    ar_2d_overlay?: any;
    ar_3d_model?: any;
    category?: string;
    displayPrice?: number;
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasAR = product.ar_2d_overlay || product.ar_3d_model;
  const imageUrl = product.images?.[0];
  const imageSrc = typeof imageUrl === 'string' ? imageUrl : (imageUrl ? urlForImage(imageUrl) : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className="group"
    >
      <Link href={`/products/${product.slug.current}`}>
        <div className="bg-white rounded-lg overflow-hidden luxury-shadow hover-glow transition-all duration-300">
          {/* Image Container */}
          <div className="relative h-80 w-full overflow-hidden">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald/20 to-gold/20 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-emerald/30" />
              </div>
            )}
            {hasAR && (
              <div className="absolute top-4 right-4 bg-gold text-charcoal px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AR Try-On</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-serif font-semibold text-charcoal mb-2 group-hover:text-emerald transition-colors">
              {product.name}
            </h3>
            {(product.price || product.displayPrice) && (
              <DynamicPrice
                product={product}
                fallbackPrice={product.displayPrice || product.price}
              />
            )}
            {product.category && (
              <p className="text-sm text-charcoal/50 mt-2 capitalize">
                {product.category}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

