import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getOrderById } from "@/lib/orders/orders";
import { CheckCircle, Package, Truck } from "lucide-react";
import Link from "next/link";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg p-8 luxury-shadow text-center mb-8">
            <CheckCircle className="w-20 h-20 text-emerald mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-charcoal/70 mb-2">
              Thank you for your purchase
            </p>
            <p className="text-lg font-semibold text-gold">
              Order #{order.orderNumber}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 luxury-shadow mb-6">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
              Order Details
            </h2>

            <div className="space-y-4 mb-6">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between border-b border-charcoal/10 pb-4">
                  <div>
                    <p className="font-semibold text-charcoal">
                      {item.product?.name || "Product"}
                    </p>
                    <p className="text-sm text-charcoal/50">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-charcoal">
                    £{item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal/20 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal/70">Subtotal</span>
                <span className="font-semibold">£{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/70">Shipping</span>
                <span className="font-semibold">£{order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/70">Tax</span>
                <span className="font-semibold">£{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-charcoal/20">
                <span>Total</span>
                <span className="text-gold">£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 luxury-shadow mb-6">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
              Shipping Address
            </h2>
            <div className="text-charcoal/70">
              <p className="font-semibold text-charcoal">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 luxury-shadow mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-serif font-bold text-charcoal">
                Order Status
              </h2>
            </div>
            <p className="text-charcoal/70 mb-2">
              Status: <span className="font-semibold text-charcoal capitalize">{order.orderStatus}</span>
            </p>
            <p className="text-charcoal/70">
              Payment: <span className="font-semibold text-charcoal capitalize">{order.paymentStatus}</span>
            </p>
            {order.trackingNumber && (
              <div className="mt-4 flex items-center gap-3">
                <Truck className="w-5 h-5 text-gold" />
                <p className="text-charcoal">
                  Tracking: <span className="font-semibold">{order.trackingNumber}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Link
              href="/orders"
              className="flex-1 bg-gold text-charcoal text-center py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="flex-1 bg-charcoal text-white text-center py-3 rounded-lg font-semibold hover:bg-charcoal/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

