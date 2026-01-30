import { defineConfig, envField, fontProviders } from "astro/config";
// import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  //   site: "https://xclusivecars-website.pages.dev",
  // integrations: [
  //   sitemap({
  //     filter: (page) => !page.includes("/table") && !page.includes("/table-2"),
  //   }),
  // ],
  // output: "server",

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    responsiveStyles: true,
    layout: "constrained",
  },

  integrations: [
    sanity({
      projectId: "ecxzhw3v",
      dataset: "production",
      useCdn: true,
      apiVersion: "2026-01-30",
      studioBasePath: "/studio",
    }),
    react(),
    // sitemap()
  ],

  adapter: cloudflare({
    imageService: "compile",
  }),

  env: {
    schema: {
      DEPLOY_HOOK: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),

      TURSO_DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_AUTH_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      API_SECRET_KEY: envField.string({ context: "server", access: "secret" }),
    },
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.local(),
        name: "Jura",
        cssVariable: "--font-jura",
        variants: [
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/Jura-Bold.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/Jura-Medium.woff2"],
          },
        ],
        fallbacks: ["sans-serif"],
      },
    ],
  },
});
