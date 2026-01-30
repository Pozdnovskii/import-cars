import type { SchemaTypeDefinition } from "sanity";
import { availableCarsType } from "./availableCars";
import { testimonialsType } from "./testimonials";
import { homePageTextsType } from "./homePageTexts";
import { contactsType } from "./contacts";
import { faqType } from "./faq";
import { seoSettingsType } from "./seoSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    availableCarsType,
    testimonialsType,
    homePageTextsType,
    contactsType,
    faqType,
    seoSettingsType,
  ],
};
