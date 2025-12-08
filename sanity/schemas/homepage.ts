import { defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "hero_banner",
      title: "Hero Banner",
      type: "object",
      fields: [
        {
          name: "video",
          title: "Hero Video",
          type: "file",
          options: {
            accept: "video/*",
          },
        },
        {
          name: "image",
          title: "Hero Image (Fallback)",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "headline",
          title: "Headline",
          type: "string",
        },
        {
          name: "subheadline",
          title: "Subheadline",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "featured_collections",
      title: "Featured Collections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
    }),
    defineField({
      name: "ar_tryon_highlight",
      title: "AR Try-On Highlight",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "description",
          title: "Description",
          type: "text",
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "inauguration_event",
      title: "Inauguration Event",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "description",
          title: "Description",
          type: "text",
        },
        {
          name: "date",
          title: "Date",
          type: "datetime",
        },
        {
          name: "location",
          title: "Location",
          type: "string",
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
  ],
});

