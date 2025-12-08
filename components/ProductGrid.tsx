"use client";

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

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden luxury-shadow animate-pulse"
          >
            <div className="h-80 bg-charcoal/10" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-charcoal/10 rounded w-3/4" />
              <div className="h-4 bg-charcoal/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-charcoal/50 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}

