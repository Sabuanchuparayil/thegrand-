export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { ShoppingBag, Search, Eye, Package } from "lucide-react";
import Link from "next/link";
import { getAllOrders } from "@/lib/orders/orders";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/orders");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager" && userRole !== "staff") {
    redirect("/");
  }

  const allOrders = await getAllOrders(100);
  const orders = searchParams.status
    ? allOrders.filter((o) => (o.status || o.orderStatus) === searchParams.status)
    : allOrders;

  const statusCounts = {
    pending: allOrders.filter((o) => (o.status || o.orderStatus) === "pending").length,
    processing: allOrders.filter((o) => (o.status || o.orderStatus) === "processing").length,
    shipped: allOrders.filter((o) => (o.status || o.orderStatus) === "shipped").length,
    delivered: allOrders.filter((o) => (o.status || o.orderStatus) === "delivered").length,
    cancelled: allOrders.filter((o) => (o.status || o.orderStatus) === "cancelled").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
            Orders Management
          </h1>
          <p className="text-charcoal/70">
            Manage and track all customer orders ({orders.length} orders)
          </p>
        </div>

        {/* Status Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            href="/admin/orders"
            className={`bg-white rounded-lg luxury-shadow p-4 text-center hover:shadow-xl transition-all ${
              !searchParams.status ? "ring-2 ring-gold" : ""
            }`}
          >
            <div className="text-2xl font-bold text-charcoal mb-1">
              {allOrders.length}
            </div>
            <div className="text-sm text-charcoal/70">All Orders</div>
          </Link>
          <Link
            href="/admin/orders?status=pending"
            className={`bg-white rounded-lg luxury-shadow p-4 text-center hover:shadow-xl transition-all ${
              searchParams.status === "pending" ? "ring-2 ring-yellow-500" : ""
            }`}
          >
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {statusCounts.pending}
            </div>
            <div className="text-sm text-charcoal/70">Pending</div>
          </Link>
          <Link
            href="/admin/orders?status=processing"
            className={`bg-white rounded-lg luxury-shadow p-4 text-center hover:shadow-xl transition-all ${
              searchParams.status === "processing" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {statusCounts.processing}
            </div>
            <div className="text-sm text-charcoal/70">Processing</div>
          </Link>
          <Link
            href="/admin/orders?status=shipped"
            className={`bg-white rounded-lg luxury-shadow p-4 text-center hover:shadow-xl transition-all ${
              searchParams.status === "shipped" ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {statusCounts.shipped}
            </div>
            <div className="text-sm text-charcoal/70">Shipped</div>
          </Link>
          <Link
            href="/admin/orders?status=delivered"
            className={`bg-white rounded-lg luxury-shadow p-4 text-center hover:shadow-xl transition-all ${
              searchParams.status === "delivered" ? "ring-2 ring-emerald-500" : ""
            }`}
          >
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {statusCounts.delivered}
            </div>
            <div className="text-sm text-charcoal/70">Delivered</div>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg luxury-shadow p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                className="w-full pl-10 pr-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg luxury-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Order #
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Items
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Total
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Payment
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                      <p className="text-charcoal/70">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr
                      key={order._id}
                      className="border-b border-charcoal/5 hover:bg-cream/50"
                    >
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="font-semibold text-gold hover:underline"
                        >
                          {order.orderNumber || order._id.slice(-8)}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-charcoal">
                            {order.shippingAddress?.name || "N/A"}
                          </div>
                          <div className="text-sm text-charcoal/60">
                            {order.shippingAddress?.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-charcoal/70">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-charcoal">
                          £{order.total?.toFixed(2) || "0.00"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            (order.status || order.orderStatus) === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : (order.status || order.orderStatus) === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : (order.status || order.orderStatus) === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : (order.status || order.orderStatus) === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : (order.status || order.orderStatus) === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status || order.orderStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-charcoal/70 text-sm">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="flex items-center space-x-1 text-gold hover:text-gold/80 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

