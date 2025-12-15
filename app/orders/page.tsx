import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getAllOrders } from "@/lib/orders/orders";
import { Package, Calendar, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  // TODO: Get user from session and fetch their orders
  // For now, show all orders (admin view)
  const orders = await getAllOrders(50);

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-8">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-24 h-24 text-charcoal/20 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">
                No orders yet
              </h2>
              <p className="text-charcoal/70 mb-8">
                Start shopping to see your orders here.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-gold text-charcoal px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="block bg-white rounded-lg p-6 luxury-shadow hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-gold" />
                        <h3 className="text-xl font-serif font-bold text-charcoal">
                          Order #{order.orderNumber}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-charcoal/70 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order._createdAt || order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className={`px-3 py-1 rounded-full ${
                          order.orderStatus === "delivered"
                            ? "bg-emerald/10 text-emerald"
                            : order.orderStatus === "shipped"
                            ? "bg-blue/10 text-blue"
                            : "bg-charcoal/10 text-charcoal"
                        }`}>
                          {order.orderStatus}
                        </span>
                        <span className={`px-3 py-1 rounded-full ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald/10 text-emerald"
                            : "bg-charcoal/10 text-charcoal"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gold">
                        £{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}



