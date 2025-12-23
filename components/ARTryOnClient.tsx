"use client";

import { useState } from "react";
import ARPlacementUI from "./ARPlacementUI";

interface Product {
  _id: string;
  name: string;
  ar_2d_overlay?: any;
  ar_3d_model?: any;
  category?: string;
}

interface ARTryOnClientProps {
  products: Product[];
}

export default function ARTryOnClient({ products }: ARTryOnClientProps) {
  const [showARSelector, setShowARSelector] = useState(false);

  return (
    <>
      <div className="text-center mb-8">
        <button
          onClick={() => setShowARSelector(true)}
          className="px-8 py-4 bg-gold text-charcoal font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover-glow"
        >
          Start AR Try-On
        </button>
      </div>

      {showARSelector && (
        <ARPlacementUI
          products={products}
          onClose={() => setShowARSelector(false)}
        />
      )}
    </>
  );
}




