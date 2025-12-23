"use client";

import { useState } from "react";
import ARViewer2D from "./ARViewer2D";
import ARViewer3D from "./ARViewer3D";
import { Camera, Box, X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  ar_2d_overlay?: any;
  ar_3d_model?: any;
  category?: string;
}

interface ARPlacementUIProps {
  products: Product[];
  onClose?: () => void;
}

export default function ARPlacementUI({ products, onClose }: ARPlacementUIProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [arMode, setArMode] = useState<"2d" | "3d" | null>(null);

  const productsWithAR = products.filter(
    (p) => p.ar_2d_overlay || p.ar_3d_model
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Determine which AR mode is available
    if (product.ar_2d_overlay) {
      setArMode("2d");
    } else if (product.ar_3d_model) {
      setArMode("3d");
    }
  };

  const getJewelryType = (category?: string): "necklace" | "earring" => {
    if (category === "earrings") return "earring";
    return "necklace";
  };

  if (arMode && selectedProduct) {
    if (arMode === "2d") {
      return (
        <ARViewer2D
          jewelryImage={selectedProduct.ar_2d_overlay}
          jewelryType={getJewelryType(selectedProduct.category)}
          onClose={() => {
            setArMode(null);
            setSelectedProduct(null);
          }}
        />
      );
    } else {
      return (
        <ARViewer3D
          modelUrl={selectedProduct.ar_3d_model}
          onClose={() => {
            setArMode(null);
            setSelectedProduct(null);
          }}
        />
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-charcoal">
            AR Try-On Experience
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-charcoal/70 hover:text-charcoal transition-colors"
              aria-label="Close AR selector"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Product Selection */}
        <div className="space-y-4">
          <p className="text-charcoal/70 mb-6">
            Select a product to try on in augmented reality
          </p>

          {productsWithAR.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-charcoal/30 mx-auto mb-4" />
              <p className="text-charcoal/50">
                No products with AR capabilities available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsWithAR.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleProductSelect(product)}
                  className="bg-diamond p-6 rounded-lg border-2 border-charcoal/10 hover:border-emerald transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif font-semibold text-charcoal group-hover:text-emerald transition-colors">
                      {product.name}
                    </h3>
                    {product.ar_2d_overlay && (
                      <Camera className="w-5 h-5 text-emerald flex-shrink-0 ml-2" />
                    )}
                    {product.ar_3d_model && (
                      <Box className="w-5 h-5 text-gold flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.ar_2d_overlay && (
                      <span className="text-xs px-2 py-1 bg-emerald/10 text-emerald rounded">
                        2D AR
                      </span>
                    )}
                    {product.ar_3d_model && (
                      <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded">
                        3D AR
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-emerald/10 rounded-lg">
          <h4 className="font-semibold text-charcoal mb-2">How it works:</h4>
          <ul className="text-sm text-charcoal/70 space-y-1">
            <li>• 2D AR: Uses your camera to overlay jewelry on your face</li>
            <li>• 3D AR: View and place 3D models in your space</li>
            <li>• Make sure to grant camera permissions when prompted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}




