import type { APIRoute } from "astro"

import { resources } from "../../data/public-api.mjs"

export const GET: APIRoute = () =>
  new Response(JSON.stringify(resources, null, 2), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  })
