import type { APIRoute } from "astro"
import { developersMarkdown } from "../data/markdown-representations.mjs"

export const GET: APIRoute = () =>
  new Response(developersMarkdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
