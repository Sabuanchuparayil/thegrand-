import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      readOnly: true,
      description: "Auto-generated order number",
    }),
    defineField({
      name: "user",
      title: "Customer",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: "price",
              title: "Price at Purchase",
              type: "number",
              description: "Price at time of purchase",
            },
            {
              name: "subtotal",
              title: "Subtotal",
              type: "number",
              description: "Quantity × Price",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      description: "Total before shipping and tax",
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "tax",
      title: "Tax",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "total",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "GBP",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        {
          name: "name",
          title: "Full Name",
          type: "string",
        },
        {
          name: "phone",
          title: "Phone",
          type: "string",
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
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "object",
      fields: [
        {
          name: "name",
          title: "Full Name",
          type: "string",
        },
        {
          name: "phone",
          title: "Phone",
          type: "string",
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
      ],
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: ["stripe", "paypal", "bank_transfer", "cash_on_delivery"],
      },
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "paymentIntentId",
      title: "Payment Intent ID",
      type: "string",
      description: "Stripe Payment Intent ID",
    }),
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Returned", value: "returned" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "trackingNumber",
      title: "Tracking Number",
      type: "string",
    }),
    defineField({
      name: "shippingCarrier",
      title: "Shipping Carrier",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Order Notes",
      type: "text",
    }),
    defineField({
      name: "customerNotes",
      title: "Customer Notes",
      type: "text",
      description: "Notes from customer during checkout",
    }),
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      customer: "user.name",
      total: "total",
      status: "orderStatus",
    },
    prepare({ orderNumber, customer, total, status }) {
      return {
        title: `Order ${orderNumber || "N/A"}`,
        subtitle: `${customer || "Unknown"} - £${total || 0} (${status || "pending"})`,
      };
    },
  },
});

