"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Lock } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const paymentIntentId = searchParams.get("paymentIntentId");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId || !orderId) {
      router.push("/checkout");
    }
  }, [paymentIntentId, orderId, router]);

  const handlePayment = async () => {
    if (!paymentIntentId) return;

    setIsProcessing(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      // Note: This is a placeholder. In production, you would use Stripe Elements
      // to get a card element and pass it here. For now, we'll skip the actual payment
      // confirmation since we don't have a card element set up.
      // const { error: stripeError } = await stripe.confirmCardPayment(
      //   paymentIntentId,
      //   {
      //     payment_method: {
      //       card: cardElement, // Card element from Stripe Elements
      //     },
      //   }
      // );
      
      // For now, simulate successful payment
      // In production, uncomment and use Stripe Elements
      const stripeError: any = null;

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setIsProcessing(false);
      } else {
        // Payment successful
        router.push(`/orders/${orderId}/confirmation`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg p-8 luxury-shadow">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-gold" />
              <h1 className="text-3xl font-serif font-bold text-charcoal">
                Secure Payment
              </h1>
            </div>

            <p className="text-charcoal/70 mb-8">
              Complete your purchase by entering your payment details below.
            </p>

            {/* Stripe Elements would go here */}
            <div className="border-2 border-dashed border-charcoal/20 rounded-lg p-8 mb-6 text-center">
              <CreditCard className="w-16 h-16 text-charcoal/30 mx-auto mb-4" />
              <p className="text-charcoal/50">
                Stripe payment form will be integrated here
              </p>
              <p className="text-sm text-charcoal/40 mt-2">
                Payment Intent ID: {paymentIntentId}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gold text-charcoal py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Processing Payment..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-charcoal/70">Loading payment page...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

