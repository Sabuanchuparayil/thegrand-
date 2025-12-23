"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { addToCart, CartItem } from "@/lib/cart/cart";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    slug: { current: string };
    price?: number;
    displayPrice?: number;
    images?: any[];
    material_type?: string;
    gold_weight?: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (isAdding) return;

    setIsAdding(true);
    const price = product.displayPrice || product.price || 0;

    const cartItem: CartItem = {
      productId: product._id,
      productName: product.name,
      productSlug: product.slug.current,
      price,
      quantity: 1,
      materialType: product.material_type,
      goldWeight: product.gold_weight,
      image: product.images?.[0],
    };

    addToCart(cartItem);

    // Trigger cart update event
    window.dispatchEvent(new Event("cartUpdated"));

    setAdded(true);
    setIsAdding(false);

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
        added
          ? "bg-emerald text-white"
          : "bg-gold text-charcoal hover:bg-gold/90"
      } ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  );
}




