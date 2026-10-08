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
  redirects: {
    "/oplossingen/insync-ai": "/insync-ai",
    "/oplossingen/ai-assistent": "/insync-ai",
    "/oplossingen/voorwaarden-vergelijker": "/insync-ai",
    "/oplossingen/intermediairs": "/",
    "/oplossingen/klantportaal": "/klantportaal",
    "/oplossingen/afsluitstraat": "/klantportaal",
    "/contact": "/demo",
  },
  integrations: [sitemap(), vue()],
  adapter: netlify(),
  output: "server",
});
