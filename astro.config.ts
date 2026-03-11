import { defineConfig } from "astro/config"
import expressiveCode from "astro-expressive-code"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
  site: "https://armand-salle.fr",
  integrations: [expressiveCode({
      themes: ["catppuccin-latte"],
      styleOverrides: { codeBackground: undefined, frames: { shadowColor: "transparent" } },
    }), mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  trailingSlash: "never",
})
