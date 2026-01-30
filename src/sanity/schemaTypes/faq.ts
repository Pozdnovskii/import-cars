import { defineType, defineField } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1),
      description: "Display order (lower numbers appear first)",
    }),
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "answerText",
      title: "Answer",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [{ title: "Strong", value: "strong" }],
            annotations: [],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      order: "order",
      question: "question",
    },
    prepare({ order, question }) {
      return {
        title: `${order}. ${question}`,
        subtitle: `Order: ${order}`,
      };
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
