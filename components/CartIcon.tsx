"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCartItemCount } from "@/lib/cart/cart";

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setItemCount(getCartItemCount());
    };

    updateCount();
    // Update on storage changes (from other tabs)
    window.addEventListener("storage", updateCount);
    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
    >
      <ShoppingBag className="w-6 h-6 text-charcoal" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}


