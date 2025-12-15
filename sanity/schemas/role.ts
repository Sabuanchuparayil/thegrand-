import { defineField, defineType } from "sanity";

export default defineType({
  name: "role",
  title: "Custom Role",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Role Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(50),
      description: "Unique name for this role (e.g., 'Sales Manager', 'Content Editor')",
    }),
    defineField({
      name: "slug",
      title: "Role Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 50,
      },
      validation: (Rule) => Rule.required(),
      description: "URL-friendly identifier (auto-generated from name)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description of what this role is for",
    }),
    defineField({
      name: "permissions",
      title: "Permissions",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "View Products", value: "view_products" },
          { title: "Edit Products", value: "edit_products" },
          { title: "Delete Products", value: "delete_products" },
          { title: "View Orders", value: "view_orders" },
          { title: "Edit Orders", value: "edit_orders" },
          { title: "Delete Orders", value: "delete_orders" },
          { title: "View Users", value: "view_users" },
          { title: "Edit Users", value: "edit_users" },
          { title: "Delete Users", value: "delete_users" },
          { title: "View Analytics", value: "view_analytics" },
          { title: "Manage Pricing", value: "manage_pricing" },
          { title: "Send Marketing", value: "send_marketing" },
        ],
      },
      description: "Select permissions for this role",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Inactive roles cannot be assigned to new users",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      permissions: "permissions",
    },
    prepare({ title, subtitle, permissions }) {
      const permCount = permissions?.length || 0;
      return {
        title: title || "Unnamed Role",
        subtitle: `${subtitle || "No description"} (${permCount} permissions)`,
      };
    },
  },
});


