import type { APIRoute } from "astro"
import { siteMarkdown } from "../data/markdown-representations.mjs"

export const GET: APIRoute = () =>
  new Response(siteMarkdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
