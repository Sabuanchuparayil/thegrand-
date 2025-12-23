"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../layout";
import { Shield, Save, X } from "lucide-react";
import Link from "next/link";
import { PERMISSIONS } from "@/lib/auth/config";

export default function NewRolePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true,
  });

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
      const response = await fetch("/api/roles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create role");
      }

      router.push("/admin/roles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create role");
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
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Create New Role
            </h1>
            <p className="text-gray-600">
              Define a custom role with specific permissions
            </p>
          </div>
          <Link
            href="/admin/roles"
            className="flex items-center space-x-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Role Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Sales Manager, Content Editor"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  A unique name for this role
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this role is for..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  <span className="text-sm font-semibold text-gray-900">
                    Active Role
                  </span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Inactive roles cannot be assigned to new users
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Permissions
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select the permissions for this role. Users with this role will have
              access to the selected features.
            </p>

            <div className="space-y-6">
              {Object.entries(permissionGroups).map(([group, permissionIds]) => (
                <div key={group}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
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
                            <div className="font-medium text-gray-900">
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
              href="/admin/roles"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Creating..." : "Create Role"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}



