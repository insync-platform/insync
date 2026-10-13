// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
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
  // Pagina's worden bij de build gegenereerd; alleen de actions draaien in de Worker.
  adapter: cloudflare({ imageService: "compile" }),
  session: false,
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
    },
  },
});
