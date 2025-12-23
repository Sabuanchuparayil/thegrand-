"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  calculateCartTotals,
  CartItem,
} from "@/lib/cart/cart";
import { urlForImage } from "@/lib/sanity/image";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState(calculateCartTotals([]));

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    setTotals(calculateCartTotals(items));
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const updated = updateCartItem(productId, newQuantity);
    setCartItems(updated);
    setTotals(calculateCartTotals(updated));
  };

  const handleRemove = (productId: string) => {
    const updated = removeFromCart(productId);
    setCartItems(updated);
    setTotals(calculateCartTotals(updated));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-charcoal/20 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">
              Your cart is empty
            </h2>
            <p className="text-charcoal/70 mb-8">
              Start adding items to your cart to see them here.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-gold text-charcoal px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-charcoal mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg p-6 luxury-shadow flex gap-6"
              >
                <Link href={`/products/${item.productSlug}`}>
                  {item.image ? (
                    <Image
                      src={typeof item.image === 'string' ? item.image : urlForImage(item.image)}
                      alt={item.productName}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-30 h-30 bg-gradient-to-br from-emerald/20 to-gold/20 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-charcoal/30" />
                    </div>
                  )}
                </Link>

                <div className="flex-1">
                  <Link href={`/products/${item.productSlug}`}>
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-2 hover:text-emerald transition-colors">
                      {item.productName}
                    </h3>
                  </Link>
                  {item.materialType && (
                    <p className="text-sm text-charcoal/50 mb-2">
                      {item.materialType}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-gold mb-4">
                    £{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-charcoal/20 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                        className="p-2 hover:bg-charcoal/5 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                        className="p-2 hover:bg-charcoal/5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-charcoal/50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-charcoal">
                    £{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 luxury-shadow sticky top-24">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Subtotal</span>
                  <span className="font-semibold">£{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Shipping</span>
                  <span className="font-semibold">
                    {totals.shipping === 0 ? (
                      <span className="text-emerald">Free</span>
                    ) : (
                      `£${totals.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Tax (VAT)</span>
                  <span className="font-semibold">£{totals.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-charcoal/20 pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-gold">£{totals.total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-gold text-charcoal text-center py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block w-full text-center text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




