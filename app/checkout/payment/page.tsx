"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock, CheckCircle, XCircle } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#141414",
      fontFamily: "system-ui, sans-serif",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: false,
};

function PaymentForm({ orderId, paymentIntentId }: { orderId: string; paymentIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "succeeded" | "failed">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please wait.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found. Please refresh the page.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPaymentStatus("processing");

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentId,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setPaymentStatus("failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentStatus("succeeded");
        // Redirect to confirmation page after a brief delay
        setTimeout(() => {
          router.push(`/orders/${orderId}/confirmation`);
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaymentStatus("failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-charcoal mb-3">
          Card Details
        </label>
        <div className="border-2 border-charcoal/20 rounded-lg p-4 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-charcoal/50 mt-2">
          Your payment is secured by Stripe. We never store your card details.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {paymentStatus === "succeeded" && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Payment successful! Redirecting to confirmation...</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || paymentStatus === "succeeded"}
        className="w-full bg-gold text-charcoal py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing || paymentStatus === "processing" ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal"></div>
            Processing Payment...
          </>
        ) : paymentStatus === "succeeded" ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Payment Successful
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay Now
          </>
        )}
      </button>
    </form>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const paymentIntentId = searchParams.get("paymentIntentId");
  const clientSecretParam = searchParams.get("clientSecret");
  const [clientSecret, setClientSecret] = useState<string | null>(clientSecretParam);
  const [loading, setLoading] = useState(!clientSecretParam);

  useEffect(() => {
    if (!paymentIntentId || !orderId) {
      router.push("/checkout");
      return;
    }

    // If client secret is not in URL, fetch it from the order
    if (!clientSecret && paymentIntentId) {
      const fetchClientSecret = async () => {
        try {
          const response = await fetch(`/api/orders/${orderId}/payment-secret`);
          if (response.ok) {
            const data = await response.json();
            setClientSecret(data.clientSecret);
          } else {
            // Fallback: try to retrieve from Stripe directly (not recommended for production)
            console.warn("Could not fetch client secret from API");
          }
        } catch (error) {
          console.error("Error fetching client secret:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchClientSecret();
    } else {
      setLoading(false);
    }
  }, [paymentIntentId, orderId, clientSecret, router]);

  if (!paymentIntentId || !orderId) {
    return (
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
    );
  }

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
              Complete your purchase by entering your payment details below. Your payment is secured by Stripe.
            </p>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-charcoal/70">Loading payment form...</p>
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#D4AF37",
                      colorBackground: "#ffffff",
                      colorText: "#141414",
                      colorDanger: "#ef4444",
                      fontFamily: "system-ui, sans-serif",
                      spacingUnit: "4px",
                      borderRadius: "8px",
                    },
                  },
                }}
              >
                <PaymentForm orderId={orderId} paymentIntentId={paymentIntentId} />
              </Elements>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                <p>Unable to load payment form. Please try again or contact support.</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-charcoal/10">
              <div className="flex items-center justify-center gap-2 text-sm text-charcoal/50">
                <Lock className="w-4 h-4" />
                <span>Secured by Stripe</span>
              </div>
            </div>
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
