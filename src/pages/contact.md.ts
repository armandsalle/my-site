import type { APIRoute } from "astro"
import { contactMarkdown } from "../data/markdown-representations.mjs"

export const GET: APIRoute = () =>
  new Response(contactMarkdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
