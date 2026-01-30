import { defineField, defineType } from "sanity";

export const testimonialsType = defineType({
  name: "testimonials",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "service",
      type: "string",
      options: {
        list: ["Закупил внесен автомобил", "Внесен автомобил от търг"],
        layout: "dropdown",
      },
      initialValue: "Внесен автомобил от търг",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "text",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
