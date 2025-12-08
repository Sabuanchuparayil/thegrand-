import { defineField, defineType } from "sanity";

export default defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hero_image",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "cultural_audience",
      title: "Cultural Audience",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "South Asian",
          "Middle Eastern",
          "African",
          "Western European",
          "Universal",
        ],
      },
    }),
    defineField({
      name: "display_priority",
      title: "Display Priority",
      type: "number",
      description: "Higher numbers appear first",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "hero_image",
    },
  },
});

