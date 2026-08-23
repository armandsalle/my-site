import type { APIRoute } from "astro"
import { privacyMarkdown } from "../data/markdown-representations.mjs"

export const GET: APIRoute = () =>
  new Response(privacyMarkdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
