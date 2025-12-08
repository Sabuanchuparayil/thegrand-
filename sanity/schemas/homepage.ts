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
              description: "Describe the hero image for SEO and accessibility.",
            },
          ],
          description: "Upload hero banner image. Recommended: 1920x1080px, JPG or PNG format. Used as fallback if video is not available.",
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
              description: "Describe the AR try-on highlight image.",
            },
          ],
          description: "Upload AR try-on highlight image. Recommended: 1200x800px, JPG or PNG format.",
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
              description: "Describe the inauguration event image.",
            },
          ],
          description: "Upload inauguration event image. Recommended: 1200x800px, JPG or PNG format.",
        },
      ],
    }),
  ],
});


