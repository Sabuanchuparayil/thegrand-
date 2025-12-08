import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      name: "price",
      title: "Price",
      type: "number",
      description: "Base price (used for fixed pricing or fallback)",
    }),
    defineField({
      name: "pricing_model",
      title: "Pricing Model",
      type: "string",
      options: {
        list: [
          { title: "Fixed Price", value: "fixed" },
          { title: "Dynamic (Gold-based)", value: "dynamic" },
        ],
      },
      initialValue: "fixed",
      description: "Choose 'dynamic' to calculate price based on current gold market prices",
    }),
    defineField({
      name: "gold_weight",
      title: "Gold/Metal Weight (grams)",
      type: "number",
      description: "Weight of gold or metal in grams (required for dynamic pricing)",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const pricingModel = (context.document as any)?.pricing_model;
          if (pricingModel === "dynamic" && !value) {
            return "Gold weight is required for dynamic pricing";
          }
          return true;
        }),
    }),
    defineField({
      name: "stones",
      title: "Stones",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Stone Type",
              type: "string",
              options: {
                list: [
                  "Diamond",
                  "Emerald",
                  "Sapphire",
                  "Ruby",
                  "Pearl",
                  "Other",
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "size",
              title: "Size",
              type: "string",
              description: "Size in carats or dimensions (e.g., '2.5 carats', '5mm x 3mm')",
            },
            {
              name: "weight",
              title: "Weight (carats)",
              type: "number",
              description: "Total weight in carats",
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
              description: "Number of stones",
              initialValue: 1,
              validation: (Rule) => Rule.min(1),
            },
          ],
          preview: {
            select: {
              type: "type",
              weight: "weight",
              quantity: "quantity",
            },
            prepare({ type, weight, quantity }) {
              return {
                title: `${type}${weight ? ` - ${weight}ct` : ""}${quantity && quantity > 1 ? ` (x${quantity})` : ""}`,
              };
            },
          },
        },
      ],
      description: "Add stone details for products with gemstones",
    }),
    defineField({
      name: "labor_cost",
      title: "Labor/Markup Cost (GBP)",
      type: "number",
      description: "Base labor and markup cost in GBP (added to gold value for dynamic pricing)",
      initialValue: 0,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
    }),
    defineField({
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cultural_tags",
      title: "Cultural Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "Traditional Indian Bridal",
          "Contemporary Minimalist",
          "Middle Eastern Ornate",
          "Halal-friendly",
          "Western Engagement",
          "Afro-Caribbean",
        ],
      },
    }),
    defineField({
      name: "gemstone_type",
      title: "Gemstone Type",
      type: "string",
      options: {
        list: ["Diamond", "Emerald", "Sapphire", "Ruby", "Pearl", "None"],
      },
    }),
    defineField({
      name: "material_type",
      title: "Material Type",
      type: "string",
      options: {
        list: ["22k Gold", "18k Gold", "Platinum", "Silver"],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ar_2d_overlay",
      title: "AR 2D Overlay (PNG)",
      type: "image",
      description: "PNG image for 2D AR try-on overlay",
    }),
    defineField({
      name: "ar_3d_model",
      title: "AR 3D Model",
      type: "file",
      description: "GLB or USDZ file for 3D AR try-on",
      options: {
        accept: ".glb,.usdz",
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
    },
  },
});

