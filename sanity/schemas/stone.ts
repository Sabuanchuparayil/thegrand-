import { defineField, defineType } from "sanity";

export default defineType({
  name: "stone",
  title: "Stone/Gemstone",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Stone Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., Diamond, Emerald, Sapphire, Ruby, Pearl",
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
      name: "type",
      title: "Stone Type",
      type: "string",
      options: {
        list: [
          { title: "Precious Stone", value: "precious" },
          { title: "Semi-Precious Stone", value: "semi-precious" },
          { title: "Organic", value: "organic" },
          { title: "Synthetic", value: "synthetic" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Primary color of the stone",
    }),
    defineField({
      name: "hardness",
      title: "Hardness (Mohs Scale)",
      type: "number",
      description: "Hardness rating from 1-10",
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Show this stone type in product forms",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Order for displaying stones (lower numbers first)",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
      active: "isActive",
    },
    prepare({ title, subtitle, active }) {
      return {
        title: title || "Unnamed Stone",
        subtitle: subtitle || active === false ? "(Inactive)" : "",
      };
    },
  },
});

