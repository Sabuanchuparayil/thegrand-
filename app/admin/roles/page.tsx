export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { Shield, Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/sanity/client";

async function getAllRoles() {
  try {
    const roles = await client.fetch(`*[_type == "role"] | order(_createdAt desc)`);
    return roles || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export default async function AdminRolesPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/roles");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin") {
    redirect("/");
  }

  const roles = await getAllRoles();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Role Management
            </h1>
            <p className="text-gray-600">
              Create and manage custom user roles ({roles.length} roles)
            </p>
          </div>
          <Link
            href="/admin/roles/new"
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Role</span>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Role Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Permissions
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
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No custom roles found</p>
                      <Link
                        href="/admin/roles/new"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Create Your First Role</span>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  roles.map((role: any) => (
                    <tr
                      key={role._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">
                          {role.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {role.slug?.current || role.slug}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {role.description || "No description"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {role.permissions?.length || 0} permissions
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            role.isActive !== false
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {role.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/roles/${role._id}/edit`}
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
      </div>
    </AdminLayout>
  );
}

