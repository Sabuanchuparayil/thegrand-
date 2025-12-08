export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { fetchProducts } from "@/lib/sanity/data-fetcher";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

export default async function AdminProductsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/products");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    redirect("/");
  }

  const products = await fetchProducts();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Products Management
            </h1>
            <p className="text-gray-900/70">
              Manage your product catalog ({products.length} products)
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900/40" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Necklaces</option>
              <option>Earrings</option>
              <option>Rings</option>
              <option>Bracelets</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Stock
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
                      <p className="text-gray-900/70">No products found</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product: any) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 hover:bg-gray-50/50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          {product.images?.[0] && (
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-50">
                              <Image
                                src={
                                  typeof product.images[0] === "string"
                                    ? product.images[0]
                                    : urlForImage(product.images[0])
                                }
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <Link
                              href={`/products/${product.slug?.current || product.slug}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-gray-900/60">
                              {product.material_type || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900/70">
                        {product.category || "Uncategorized"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-blue-600">
                          £{product.displayPrice || product.price || "0.00"}
                        </span>
                        {product.pricing_model === "dynamic" && (
                          <span className="ml-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            Dynamic
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-900/70">
                        {product.stock || "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.featured
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.featured ? "Featured" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-900/70">
              Showing 1-{products.length} of {products.length} products
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

