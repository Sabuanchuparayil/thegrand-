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
    defineField({
      name: "cultural_sections",
      title: "Cultural Sections",
      type: "array",
      description: "Add cultural highlights with icons to display on the homepage. These sections celebrate different cultural traditions and festivals.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required().error("Title is required"),
              description: "Name of the cultural collection or event (e.g., 'Diwali Collection', 'Eid Collection')",
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required().error("Description is required"),
              description: "Brief description of the cultural collection or event",
            },
            {
              name: "icon",
              title: "Icon",
              type: "string",
              validation: (Rule) => Rule.required().error("Icon is required"),
              description: "Emoji icon to represent this cultural section (e.g., 🪔, 🌙, 💍, 🎄, 👑)",
              options: {
                list: [
                  { title: "Diwali Lamp 🪔", value: "🪔" },
                  { title: "Crescent Moon 🌙", value: "🌙" },
                  { title: "Ring 💍", value: "💍" },
                  { title: "Christmas Tree 🎄", value: "🎄" },
                  { title: "Crown 👑", value: "👑" },
                  { title: "Star ⭐", value: "⭐" },
                  { title: "Sparkles ✨", value: "✨" },
                  { title: "Gem 💎", value: "💎" },
                  { title: "Temple 🏛️", value: "🏛️" },
                  { title: "Fireworks 🎆", value: "🎆" },
                  { title: "Gift 🎁", value: "🎁" },
                  { title: "Heart ❤️", value: "❤️" },
                ],
              },
            },
            {
              name: "image",
              title: "Background Image",
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
                  description: "Describe the cultural section image for SEO and accessibility.",
                },
              ],
              description: "Upload a background image for this cultural section. Recommended: 1920x1080px, JPG or PNG format.",
            },
            {
              name: "season",
              title: "Season",
              type: "string",
              options: {
                list: [
                  { title: "All Year", value: "all" },
                  { title: "Spring", value: "spring" },
                  { title: "Summer", value: "summer" },
                  { title: "Autumn", value: "autumn" },
                  { title: "Winter", value: "winter" },
                ],
              },
              initialValue: "all",
              description: "When this cultural section is most relevant",
            },
            {
              name: "link",
              title: "Link (Optional)",
              type: "object",
              fields: [
                {
                  name: "type",
                  title: "Link Type",
                  type: "string",
                  options: {
                    list: [
                      { title: "Collection", value: "collection" },
                      { title: "Category", value: "category" },
                      { title: "Custom URL", value: "url" },
                    ],
                  },
                  initialValue: "collection",
                },
                {
                  name: "collection",
                  title: "Collection",
                  type: "reference",
                  to: [{ type: "collection" }],
                  hidden: ({ parent }) => parent?.type !== "collection",
                },
                {
                  name: "category",
                  title: "Category",
                  type: "string",
                  options: {
                    list: [
                      { title: "Necklaces", value: "necklaces" },
                      { title: "Earrings", value: "earrings" },
                      { title: "Rings", value: "rings" },
                      { title: "Bracelets", value: "bracelets" },
                      { title: "Bangles", value: "bangles" },
                      { title: "Pendants", value: "pendants" },
                      { title: "Men's Jewelry", value: "mens-jewelry" },
                    ],
                  },
                  hidden: ({ parent }) => parent?.type !== "category",
                },
                {
                  name: "url",
                  title: "Custom URL",
                  type: "url",
                  hidden: ({ parent }) => parent?.type !== "url",
                },
              ],
              description: "Optional link to a collection, category, or custom URL",
            },
          ],
          preview: {
            select: {
              title: "title",
              icon: "icon",
              description: "description",
            },
            prepare({ title, icon, description }) {
              return {
                title: `${icon || "📦"} ${title || "Untitled"}`,
                subtitle: description,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6).warning("Consider limiting to 4-6 cultural sections for best user experience"),
    }),
  ],
});


