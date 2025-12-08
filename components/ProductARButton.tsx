"use client";

import { useState } from "react";
import ARViewer2D from "./ARViewer2D";
import ARViewer3D from "./ARViewer3D";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  ar_2d_overlay?: any;
  ar_3d_model?: any;
  category?: string;
}

interface ProductARButtonProps {
  product: Product;
  className?: string;
}

export default function ProductARButton({
  product,
  className,
}: ProductARButtonProps) {
  const [arMode, setArMode] = useState<"2d" | "3d" | null>(null);

  const has2D = !!product.ar_2d_overlay;
  const has3D = !!product.ar_3d_model;

  if (!has2D && !has3D) return null;

  const getJewelryType = (category?: string): "necklace" | "earring" => {
    if (category === "earrings") return "earring";
    return "necklace";
  };

  return (
    <>
      <button
        onClick={() => {
          if (has2D) {
            setArMode("2d");
          } else if (has3D) {
            setArMode("3d");
          }
        }}
        className={cn(
          "flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-charcoal transition-all duration-300",
          className
        )}
      >
        <Sparkles className="w-5 h-5" />
        <span>Try in AR</span>
      </button>

      {arMode === "2d" && has2D && (
        <ARViewer2D
          jewelryImage={product.ar_2d_overlay}
          jewelryType={getJewelryType(product.category)}
          onClose={() => setArMode(null)}
        />
      )}

      {arMode === "3d" && has3D && (
        <ARViewer3D
          modelUrl={product.ar_3d_model}
          onClose={() => setArMode(null)}
        />
      )}
    </>
  );
}

