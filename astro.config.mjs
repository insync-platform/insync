// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import vue from "@astrojs/vue";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  output: "static",
  site: "https://insync.insure",
  redirects: {
    "/oplossingen/voorwaarden-vergelijker": "/oplossingen/ai-assistent",
  },
  integrations: [sitemap(), vue()],
  adapter: netlify(),
});
