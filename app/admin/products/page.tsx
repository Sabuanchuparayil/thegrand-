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
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
              Products Management
            </h1>
            <p className="text-charcoal/70">
              Manage your product catalog ({products.length} products)
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center space-x-2 bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg luxury-shadow p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <select className="px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
              <option>All Categories</option>
              <option>Necklaces</option>
              <option>Earrings</option>
              <option>Rings</option>
              <option>Bracelets</option>
            </select>
            <select className="px-4 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg luxury-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Stock
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-charcoal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Package className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                      <p className="text-charcoal/70">No products found</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product: any) => (
                    <tr
                      key={product._id}
                      className="border-b border-charcoal/5 hover:bg-cream/50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          {product.images?.[0] && (
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-cream">
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
                              className="font-semibold text-charcoal hover:text-gold transition-colors"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-charcoal/60">
                              {product.material_type || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-charcoal/70">
                        {product.category || "Uncategorized"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gold">
                          £{product.displayPrice || product.price || "0.00"}
                        </span>
                        {product.pricing_model === "dynamic" && (
                          <span className="ml-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            Dynamic
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-charcoal/70">
                        {product.stock || "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.featured
                              ? "bg-gold text-white"
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
          <div className="flex items-center justify-between bg-white rounded-lg luxury-shadow p-4">
            <p className="text-charcoal/70">
              Showing 1-{products.length} of {products.length} products
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-charcoal/20 rounded-lg hover:bg-cream transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 border border-charcoal/20 rounded-lg hover:bg-cream transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

