"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getCart, calculateCartTotals, CartItem, clearCart } from "@/lib/cart/cart";
import { UK_VAT_RATE } from "@/lib/tax/uk-tax";
import { MapPin, CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState(calculateCartTotals([]));
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingEmail: "",
    shippingPhone: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "United Kingdom",
    billingSameAsShipping: true,
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
    billingCountry: "United Kingdom",
    paymentMethod: "stripe",
    customerNotes: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
    setCartItems(items);
    setTotals(calculateCartTotals(items));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-fill billing if same as shipping
    if (formData.billingSameAsShipping && name.startsWith("shipping")) {
      const billingField = name.replace("shipping", "billing");
      setFormData((prev) => ({
        ...prev,
        [billingField]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          ...formData,
          totals,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, paymentIntentId } = await response.json();

      // If Stripe payment, redirect to payment page
      if (formData.paymentMethod === "stripe" && paymentIntentId) {
        router.push(`/checkout/payment?orderId=${orderId}&paymentIntentId=${paymentIntentId}`);
      } else {
        // For other payment methods, show confirmation
        clearCart();
        router.push(`/orders/${orderId}/confirmation`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-8">
            Checkout
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 luxury-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-gold" />
                  <h2 className="text-2xl font-serif font-bold text-charcoal">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="shippingName"
                      required
                      value={formData.shippingName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="shippingEmail"
                      required
                      value={formData.shippingEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="shippingPhone"
                      required
                      value={formData.shippingPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="shippingStreet"
                      required
                      value={formData.shippingStreet}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="shippingCity"
                        required
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="shippingPostalCode"
                        required
                        value={formData.shippingPostalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="shippingCountry"
                        required
                        value={formData.shippingCountry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg p-6 luxury-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-gold" />
                  <h2 className="text-2xl font-serif font-bold text-charcoal">
                    Billing Address
                  </h2>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.billingSameAsShipping}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          billingSameAsShipping: e.target.checked,
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-charcoal">Same as shipping address</span>
                  </label>
                </div>

                {!formData.billingSameAsShipping && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="billingName"
                        required={!formData.billingSameAsShipping}
                        value={formData.billingName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </div>
                    {/* Similar fields for billing */}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 luxury-shadow">
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                  Payment Method
                </h2>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="stripe">Credit/Debit Card (Stripe)</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>

              {/* Customer Notes */}
              <div className="bg-white rounded-lg p-6 luxury-shadow">
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                  Additional Notes
                </h2>
                <textarea
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any special instructions or notes..."
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 luxury-shadow sticky top-24">
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                  Order Summary
                </h2>

                <div className="space-y-2 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-charcoal/70">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-charcoal/20 pt-4 space-y-2 mb-6">
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
                    <span className="text-charcoal/70">
                      VAT ({(UK_VAT_RATE * 100).toFixed(0)}%)
                    </span>
                    <span className="font-semibold">£{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-charcoal/20 pt-4 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-gold">£{totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gold text-charcoal py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}

