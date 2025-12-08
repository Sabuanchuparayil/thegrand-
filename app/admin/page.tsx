export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "./layout";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Mail } from "lucide-react";
import Link from "next/link";
import { fetchProducts } from "@/lib/sanity/data-fetcher";
import { getAllOrders } from "@/lib/orders/orders";
import { getAllUsers } from "@/lib/auth/auth";

async function getDashboardStats() {
  try {
    const [products, orders, users] = await Promise.all([
      fetchProducts().catch(() => []),
      getAllOrders(100).catch(() => []),
      getAllUsers().catch(() => []),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter((o) => (o.status || o.orderStatus) === "pending").length;
    const recentOrders = orders.slice(0, 5);

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue,
      pendingOrders,
      recentOrders,
    };
  } catch (error) {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    redirect("/");
  }

  const stats = await getDashboardStats();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
            Welcome back, {session.user?.name || "Admin"}! Here's your overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            href="/admin/products"
            color="text-blue-600"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            href="/admin/orders"
            color="text-emerald-600"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            href="/admin/users"
            color="text-purple-600"
          />
          <StatCard
            title="Total Revenue"
            value={`£${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            href="/admin/analytics"
            color="text-blue-600"
          />
        </div>

        {/* Pending Orders Alert */}
        {stats.pendingOrders > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">
                  {stats.pendingOrders} Pending Orders
                </h3>
                <p className="text-sm text-yellow-700">
                  Review and process pending orders
                </p>
              </div>
              <Link
                href="/admin/orders?status=pending"
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                View Orders
              </Link>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-lg luxury-shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-charcoal/70 text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-charcoal/10">
                    <th className="text-left py-3 px-4 font-semibold text-charcoal">
                      Order #
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-charcoal">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-charcoal">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-charcoal">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-charcoal">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any) => (
                    <tr
                      key={order._id}
                      className="border-b border-charcoal/5 hover:bg-cream/50"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {order.orderNumber || order._id.slice(-8)}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-charcoal/70">
                        {order.shippingAddress?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            (order.status || order.orderStatus) === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : (order.status || order.orderStatus) === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : (order.status || order.orderStatus) === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : (order.status || order.orderStatus) === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status || order.orderStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        £{order.total?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-charcoal/70 text-sm">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/products/new"
            className="bg-white rounded-lg luxury-shadow p-6 hover:shadow-xl transition-shadow"
          >
            <Package className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              Add New Product
            </h3>
            <p className="text-charcoal/70">
              Create a new product listing
            </p>
          </Link>

          <Link
            href="/admin/pricing"
            className="bg-white rounded-lg luxury-shadow p-6 hover:shadow-xl transition-shadow"
          >
            <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              Manage Pricing
            </h3>
            <p className="text-charcoal/70">
              Update gold prices and pricing rules
            </p>
          </Link>

          <Link
            href="/admin/marketing"
            className="bg-white rounded-lg luxury-shadow p-6 hover:shadow-xl transition-shadow"
          >
            <Mail className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              Send Marketing
            </h3>
            <p className="text-charcoal/70">
              Send marketing communications
            </p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg luxury-shadow p-6 hover:shadow-xl transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {value}
        </span>
      </div>
      <h3 className="text-charcoal/70 font-medium">{title}</h3>
    </Link>
  );
}

