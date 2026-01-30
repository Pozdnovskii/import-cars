import { defineField, defineType } from "sanity";

export const availableCarsType = defineType({
  name: "availableCars",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "make",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "model",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sold",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "used",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "showOnHero",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "imageForHero",
      type: "image",
      options: {
        hotspot: {
          previews: [
            { title: "Hero Mobile", aspectRatio: 1 / 1 },
            { title: "Hero Desktop", aspectRatio: 9 / 16 },
          ],
        },
      },
      hidden: ({ parent }) => !parent?.showOnHero,
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          if ((ctx.parent as { showOnHero?: boolean })?.showOnHero && !value) {
            return "Main Image is required when showOnHero is true";
          }
          return true;
        }),
    }),

    defineField({
      name: "gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alttext",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "year",
      type: "string",
      options: {
        list: Array.from({ length: 67 }, (_, i) => {
          const year = 2026 - i;
          return { title: String(year), value: String(year) };
        }),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "price",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),

    defineField({
      name: "fuelType",
      type: "string",
      options: {
        list: ["Бензин", "Дизел", "Електро", "Хибрид"],
        layout: "dropdown",
      },
      initialValue: "Бензин",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "transmission",
      type: "string",
      options: {
        list: ["Ръчна", "Автоматик", "Полуавто", "CVT", "DSG"],
        layout: "dropdown",
      },
      initialValue: "Автоматик",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "odometer",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),

    defineField({
      name: "horsepower",
      type: "number",
      validation: (Rule) => Rule.integer().positive(),
    }),

    defineField({
      name: "VIN",
      type: "string",
    }),

    defineField({
      name: "doors",
      type: "number",
      validation: (Rule) => Rule.integer().min(2).max(10),
    }),

    defineField({
      name: "seets",
      title: "Seats",
      type: "number",
      validation: (Rule) => Rule.integer().min(2).max(10),
    }),

    defineField({
      name: "type",
      type: "string",
    }),

    defineField({
      name: "driveType",
      type: "string",
    }),

    defineField({
      name: "color",
      type: "string",
    }),

    defineField({
      name: "safety",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "Автоматичен контрол на стабилността",
          "Адаптивни предни светлини",
          "Аларма",
          "Антиблокираща система",
          "Въздушни възглавници: предни, задни, странични",
          "Въздушни възглавници: предни, странични",
          "Електронна програма за стабилизиране",
          "Електронно разпределяне на спирачното усилие",
          "КАСКО",
          "Контрол на налягането на гумите",
          "Парктроник",
          "Система ISOFIX",
          "Система за динамична устойчивост",
          "Система за изсушаване на накладките",
          "Система за защита от пробуксуване",
          "Система за контрол на дистанцията",
          "Система за контрол на спускането",
          "Система за подпомагане на спирането",
          "Централно заключване",
          "GPS система за проследяване",
        ],
        layout: "list",
      },
    }),

    defineField({
      name: "exterior",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "4(5) Врати",
          "LED фарове",
          "Ксенонови фарове",
          "Лети джанти",
          "Металик",
          "Панорамен люк",
          "Рейлинг на покрива",
          "Спойлери",
          "Халогенни фарове",
          "Шибедах",
        ],
        layout: "list",
      },
    }),

    defineField({
      name: "comfort",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "Блокаж на диференциала",
          "Бордкомпютър",
          "Безключово палене",
          "Бързи / бавни скорости",
          "Датчик за светлина",
          "Електрически огледала",
          "Електрически стъкла",
          "Електрическо регулиране на окачването",
          "Електрическо регулиране на седалките",
          "Електрически усилвател на волана",
          "Климатроник",
          "Кожен салон",
          "Мултифункционален волан",
          "Навигация",
          "Отопление на волана",
          "Подгряване на предното стъкло",
          "Подгряване на седалките",
          "Печка",
          "Регулиране на волана",
          "Сензор за дъжд",
          "Серво усилвател на волана",
          "Система за измиване на фаровете",
          "Система за контрол на скоростта (автопилот)",
          "Стерео уредба",
          "Функция Auto Start Stop",
          "Хладилна жабка",
          "Bluetooth / handsfree система",
          "DVD, TV",
          "Steptronic / Tiptronic",
          "USB, audio/video, IN/AUX изводи",
        ],
        layout: "list",
      },
    }),

    defineField({
      name: "other",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "4x4",
          "Напълно обслужен",
          "Нов внос",
          "С регистрация",
          "Сервизна книжка",
        ],
        layout: "list",
      },
    }),

    defineField({
      name: "carId",
      title: "Car ID",
      type: "string",
      initialValue: () => {
        return String(Date.now());
      },
      readOnly: true,
    }),
  ],
});
