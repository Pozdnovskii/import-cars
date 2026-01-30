import { defineType, defineField } from "sanity";

export const seoSettingsType = defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "xclusiveCars",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "homePage",
      type: "object",
      fields: [
        {
          name: "title",
          type: "string",
          description: "Recommended up to 60 characters.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          rows: 3,
          description: "Recommended 120-160 characters.",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "availableCarsCatalogPage",
      type: "object",
      fields: [
        {
          name: "title",
          type: "string",
          description: "Recommended up to 60 characters.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          rows: 3,
          description: "Recommended 120-160 characters.",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "availableCarPageTemplate",
      type: "object",
      description:
        "Available variables: {title}, {make}, {model}, {year}, {price}, {odometer}, {transmission}, {fuelType}, {horsepower}, {driveType}, {siteName}.",
      fields: [
        {
          name: "titleTemplate",
          type: "string",
          description: "Recommended up to 60 characters.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "descriptionTemplate",
          type: "text",
          rows: 3,
          description: "Recommended 120-160 characters.",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "auctionCarsCatalogPage",
      type: "object",
      fields: [
        {
          name: "title",
          type: "string",
          description: "Recommended up to 60 characters.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          rows: 3,
          description: "Recommended 120-160 characters.",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "auctionCarPageTemplate",
      type: "object",
      description:
        "Available variables: {heading}, {fullName}, {make}, {model}, {manufactureYear}, {odometerKm}, {fuelBulgarian}, {movableConditionBulgarian}, {primaryDamageBulgarian}, {siteName}. Recommended up to 60 characters for optimal SEO.",
      fields: [
        {
          name: "titleTemplate",
          type: "string",
          description: "Recommended up to 60 characters.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "descriptionTemplate",
          type: "text",
          rows: 3,
          description: "Recommended 120-160 characters.",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "SEO Settings",
      };
    },
  },
});
