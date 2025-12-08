"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../layout";
import { UserPlus, Save, X } from "lucide-react";
import Link from "next/link";
import { PERMISSIONS, ROLE_PERMISSIONS, UserRole } from "@/lib/auth/config";

export default function NewUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    role: "customer" as UserRole,
    permissions: [] as string[],
    isActive: true,
  });

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      // Auto-select default permissions for role
      permissions: ROLE_PERMISSIONS[role] || [],
    }));
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create user");
      }

      router.push("/admin/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const permissionGroups = {
    Products: ["view_products", "edit_products", "delete_products"],
    Orders: ["view_orders", "edit_orders", "delete_orders"],
    Users: ["view_users", "edit_users", "delete_users"],
    System: ["view_analytics", "manage_pricing", "send_marketing"],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
              Add New User
            </h1>
            <p className="text-charcoal/70">
              Create a new user account with role and permissions
            </p>
          </div>
          <Link
            href="/admin/users"
            className="flex items-center space-x-2 bg-gray-200 text-charcoal px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      whatsapp: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              Role & Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  User Role *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) =>
                    handleRoleChange(e.target.value as UserRole)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">
                  Default permissions for {formData.role} role will be
                  automatically selected.
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-charcoal">
                    Active Account
                  </span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Inactive users cannot log in
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              Permissions
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select specific permissions for this user. Default permissions
              for the selected role are pre-selected.
            </p>

            <div className="space-y-6">
              {Object.entries(permissionGroups).map(([group, permissionIds]) => (
                <div key={group}>
                  <h3 className="text-lg font-semibold text-charcoal mb-3">
                    {group}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissionIds.map((permissionId) => {
                      const permission = PERMISSIONS[permissionId];
                      if (!permission) return null;
                      const isChecked = formData.permissions.includes(
                        permissionId
                      );
                      return (
                        <label
                          key={permissionId}
                          className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(permissionId)}
                            className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-charcoal">
                              {permission.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/users"
              className="px-6 py-3 bg-gray-200 text-charcoal rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Creating..." : "Create User"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

