import { defineField, defineType } from "sanity";

export default defineType({
  name: "material",
  title: "Material",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Material Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., 22k Gold, 18k Gold, Platinum, Silver",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "karat",
      title: "Karat (for Gold)",
      type: "number",
      description: "Karat value for gold materials (e.g., 22, 18, 14). Leave empty for non-gold materials.",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Show this material type in product forms",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Order for displaying materials (lower numbers first)",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "karat",
      active: "isActive",
    },
    prepare({ title, subtitle, active }) {
      return {
        title: title || "Unnamed Material",
        subtitle: subtitle ? `${subtitle}k` : active === false ? "(Inactive)" : "",
      };
    },
  },
});

