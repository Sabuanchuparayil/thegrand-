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
      options: { 
        hotspot: true,
        metadata: ["blurhash", "lqip", "palette", "exif"],
        accept: "image/*",
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Important for SEO and accessibility. Describe the collection image.",
          validation: (Rule) => Rule.required(),
        },
      ],
      description: "Upload collection hero image. Recommended: 1200x800px, JPG or PNG format. This image appears on collection pages and homepage.",
      validation: (Rule) => Rule.required().error("Hero image is required for collections"),
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


