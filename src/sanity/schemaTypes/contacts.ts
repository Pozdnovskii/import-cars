import { defineType, defineField } from "sanity";

export const contactsType = defineType({
  name: "contacts",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Contacts",
    }),
    defineField({
      name: "phone",
      type: "object",
      fields: [
        {
          name: "forLink",
          title: "Реален номер (за линк)",
          type: "string",
          description: "Формат: +359876888994",
        },
        {
          name: "forDisplay",
          title: "Визуализация (как се показва)",
          type: "string",
          description: "Формат: 0876 888 994",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (Rule) => Rule.email().error("Невалиден имейл адрес"),
    }),
    defineField({
      name: "facebook",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "instagram",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "viber",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "mobileBG",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
  ],
});
