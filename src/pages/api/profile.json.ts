import type { APIRoute } from "astro"

import { profile } from "../../data/public-api.mjs"

export const GET: APIRoute = () =>
  new Response(JSON.stringify(profile, null, 2), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  })
