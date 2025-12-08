import { defineField, defineType } from "sanity";

export default defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      description: "WhatsApp number for marketing communications (include country code)",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Customer", value: "customer" },
          { title: "Admin", value: "admin" },
          { title: "Manager", value: "manager" },
          { title: "Staff", value: "staff" },
        ],
      },
      initialValue: "customer",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "permissions",
      title: "Permissions",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "view_products",
          "edit_products",
          "delete_products",
          "view_orders",
          "edit_orders",
          "delete_orders",
          "view_users",
          "edit_users",
          "delete_users",
          "view_analytics",
          "manage_pricing",
          "send_marketing",
        ],
      },
      description: "Specific permissions (overrides role defaults)",
    }),
    defineField({
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Address Type",
              type: "string",
              options: {
                list: ["billing", "shipping", "both"],
              },
            },
            {
              name: "street",
              title: "Street Address",
              type: "string",
            },
            {
              name: "city",
              title: "City",
              type: "string",
            },
            {
              name: "state",
              title: "State/Province",
              type: "string",
            },
            {
              name: "postalCode",
              title: "Postal Code",
              type: "string",
            },
            {
              name: "country",
              title: "Country",
              type: "string",
            },
            {
              name: "isDefault",
              title: "Default Address",
              type: "boolean",
              initialValue: false,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "dateOfBirth",
      title: "Date of Birth",
      type: "date",
    }),
    defineField({
      name: "gender",
      title: "Gender",
      type: "string",
      options: {
        list: ["male", "female", "other", "prefer_not_to_say"],
      },
    }),
    defineField({
      name: "preferences",
      title: "Preferences",
      type: "object",
      fields: [
        {
          name: "newsletter",
          title: "Subscribe to Newsletter",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "whatsappMarketing",
          title: "WhatsApp Marketing",
          type: "boolean",
          initialValue: false,
          description: "Allow marketing communications via WhatsApp",
        },
        {
          name: "smsMarketing",
          title: "SMS Marketing",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "emailMarketing",
          title: "Email Marketing",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "preferredCategories",
          title: "Preferred Categories",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    }),
    defineField({
      name: "avatar",
      title: "Profile Picture",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Deactivate user account",
    }),
    defineField({
      name: "lastLogin",
      title: "Last Login",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      role: "role",
      media: "avatar",
    },
    prepare({ title, subtitle, role }) {
      return {
        title: title || "Unnamed User",
        subtitle: `${subtitle} (${role})`,
      };
    },
  },
});

