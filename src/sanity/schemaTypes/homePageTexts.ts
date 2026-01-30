import { defineField, defineType } from "sanity";

export const homePageTextsType = defineType({
  name: "homePageTexts",
  type: "document",
  fields: [
    defineField({
      name: "h1",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heroDescription",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "button1",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "button2",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "stepsSectionHeading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "stepsList",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "list",
      },
      validation: (Rule) => Rule.required().min(5).max(5),
    }),

    defineField({
      name: "popularCarsSectionHeading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "testimonialsSectionHeading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "availableCarsSectionHeading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
