export const dynamic = 'force-dynamic';
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "../layout";
import { Users, Search, UserPlus, Shield, Mail } from "lucide-react";
import Link from "next/link";
import { getAllUsers } from "@/lib/auth/auth";

export default async function AdminUsersPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/signin?redirect=/admin/users");
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "manager") {
    redirect("/");
  }

  const users = await getAllUsers(100);

  const roleCounts = {
    customer: users.filter((u) => u.role === "customer").length,
    staff: users.filter((u) => u.role === "staff").length,
    manager: users.filter((u) => u.role === "manager").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Users Management
            </h1>
            <p className="text-gray-600">
              Manage user accounts and permissions ({users.length} users)
            </p>
          </div>
          <Link
            href="/admin/users/new"
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add New User</span>
          </Link>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {roleCounts.customer}
            </div>
            <div className="text-sm text-gray-600">Customers</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {roleCounts.staff}
            </div>
            <div className="text-sm text-gray-600">Staff</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {roleCounts.manager}
            </div>
            <div className="text-sm text-gray-600">Managers</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {roleCounts.admin}
            </div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Roles</option>
              <option>Customer</option>
              <option>Staff</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Role
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{user.email}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {user.phone || "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                            user.role === "admin"
                              ? "bg-blue-600 text-white"
                              : user.role === "manager"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "staff"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role || "customer"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.isActive !== false
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Shield className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
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

