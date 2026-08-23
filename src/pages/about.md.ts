import type { APIRoute } from "astro"
import { aboutMarkdown } from "../data/markdown-representations.mjs"

export const GET: APIRoute = () =>
  new Response(aboutMarkdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
