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

  site: "https://insync.insure",
  integrations: [sitemap(), vue()],
  adapter: netlify(),

  redirects: {
    // Voorwaarden Vergelijker is opgegaan in Insync AI
    "/oplossingen/voorwaarden-vergelijker": "/oplossingen/insync-ai",
  },
});
