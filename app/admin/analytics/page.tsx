export const dynamic = 'force-dynamic';

import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";
import { getAllOrders } from "@/lib/orders/orders";
import { fetchProducts } from "@/lib/sanity/data-fetcher";
import { getAllUsers } from "@/lib/auth/auth";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/analytics");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    redirect("/");
  }

  const [orders, products, users] = await Promise.all([
    getAllOrders(1000).catch(() => []),
    fetchProducts().catch(() => []),
    getAllUsers(1000).catch(() => []),
  ]);

  // Calculate analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const ordersByStatus = {
    pending: orders.filter((o) => (o.status || o.orderStatus) === "pending").length,
    processing: orders.filter((o) => (o.status || o.orderStatus) === "processing").length,
    shipped: orders.filter((o) => (o.status || o.orderStatus) === "shipped").length,
    delivered: orders.filter((o) => (o.status || o.orderStatus) === "delivered").length,
    cancelled: orders.filter((o) => (o.status || o.orderStatus) === "cancelled").length,
  };

  const recentOrders = orders.slice(0, 10);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Analytics & Reports
          </h1>
          <p className="text-gray-900/70">
            View insights and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`£${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="text-blue-600"
            change="+12.5%"
          />
          <MetricCard
            title="Total Orders"
            value={totalOrders.toString()}
            icon={ShoppingBag}
            color="text-emerald-600"
            change="+8.2%"
          />
          <MetricCard
            title="Average Order Value"
            value={`£${averageOrderValue.toFixed(2)}`}
            icon={TrendingUp}
            color="text-blue-600"
            change="+5.1%"
          />
          <MetricCard
            title="Total Users"
            value={users.length.toString()}
            icon={Users}
            color="text-purple-600"
            change="+15.3%"
          />
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Orders by Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatusCard
              label="Pending"
              count={ordersByStatus.pending}
              color="bg-blue-100 text-blue-800"
            />
            <StatusCard
              label="Processing"
              count={ordersByStatus.processing}
              color="bg-blue-100 text-blue-800"
            />
            <StatusCard
              label="Shipped"
              count={ordersByStatus.shipped}
              color="bg-purple-100 text-purple-800"
            />
            <StatusCard
              label="Delivered"
              count={ordersByStatus.delivered}
              color="bg-emerald-100 text-emerald-800"
            />
            <StatusCard
              label="Cancelled"
              count={ordersByStatus.cancelled}
              color="bg-red-100 text-red-800"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Order #
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-900/70">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order: any) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 hover:bg-gray-50/50"
                    >
                      <td className="py-3 px-4 font-semibold text-blue-600">
                        {order.orderNumber || order._id.slice(-8)}
                      </td>
                      <td className="py-3 px-4 text-gray-900/70">
                        {order.shippingAddress?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        £{order.total?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            (order.status || order.orderStatus) === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : (order.status || order.orderStatus) === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status || order.orderStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900/70 text-sm">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Product Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900/70">Total Products</span>
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900/70">Featured Products</span>
                <span className="font-semibold text-gray-900">
                  {products.filter((p: any) => p.featured).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900/70">Dynamic Pricing</span>
                <span className="font-semibold text-gray-900">
                  {products.filter((p: any) => p.pricing_model === "dynamic").length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              User Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900/70">Total Users</span>
                <span className="font-semibold text-gray-900">
                  {users.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900/70">Customers</span>
                <span className="font-semibold text-gray-900">
                  {users.filter((u) => u.role === "customer").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900/70">Admin Users</span>
                <span className="font-semibold text-gray-900">
                  {users.filter((u) => u.role === "admin" || u.role === "manager").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  change,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
  change: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <span className="text-sm font-semibold text-emerald-600">{change}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-900/70">{title}</div>
    </div>
  );
}

function StatusCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="text-center p-4 rounded-lg">
      <div className={`${color} px-4 py-2 rounded-lg font-semibold mb-2`}>
        {count}
      </div>
      <div className="text-sm text-gray-900/70">{label}</div>
    </div>
  );
}

