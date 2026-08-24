import { markdownRepresentations } from "../src/data/markdown-representations.mjs"
import { profile, resources } from "../src/data/public-api.mjs"
import {
  appendVary,
  negotiateContentType,
} from "../src/utils/content-negotiation.mjs"

export const KNOWN_PAGE_PATHS = new Set([
  "/",
  "/about",
  "/contact",
  "/developers",
  "/palette-1",
  "/palette-2",
  "/palette-3",
  "/privacy",
  "/post/autocomplete-select-shadcn-ui",
  "/post/persisting-form-data-in-react-a-modern-approach-with-nuqs",
  "/post/phone-input-shadcn-ui",
  "/post/real-time-cache-invalidation-sse-trpc-redis-bullmq",
])

function normalizePath(pathname) {
  if (pathname === "/") return pathname
  return pathname.replace(/\/$/, "")
}

function pageLinks(pathname) {
  const markdownPath = pathname === "/" ? "/index.md" : `${pathname}.md`
  return `<${markdownPath}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/markdown", </.well-known/api-catalog>; rel="api-catalog"`
}

function responseWithHeaders(response, extraHeaders = {}) {
  const headers = new Headers(response.headers)
  appendVary(headers, "Accept")
  appendVary(headers, "Accept-Encoding")

  for (const [name, value] of Object.entries(extraHeaders)) {
    headers.set(name, value)
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function markdownResponse(body, { request, status = 200, links } = {}) {
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept, Accept-Encoding",
  })
  if (links) headers.set("Link", links)

  return new Response(request?.method === "HEAD" ? null : body, {
    status,
    headers,
  })
}

function notFoundResponse(request, representation) {
  if (representation === "text/markdown") {
    return markdownResponse(
      "# 404: Resource not found\n\nSee [llms.txt](/llms.txt) or the [sitemap](/sitemap-index.xml) for available resources.\n",
      { request, status: 404 },
    )
  }

  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404: Page not found</title></head><body><main><h1>Page not found</h1><p>The requested resource does not exist.</p><p><a href="/">Go home</a> or consult the <a href="/sitemap-index.xml">sitemap</a>.</p></main></body></html>`
  return responseWithHeaders(
    new Response(request.method === "HEAD" ? null : body, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
  )
}

function jsonResponse(value, { request, status = 200, headers = {} } = {}) {
  return new Response(
    request?.method === "HEAD" ? null : JSON.stringify(value, null, 2),
    {
      status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
    },
  )
}

function apiError(request, status, code, message, resolution) {
  return jsonResponse(
    {
      error: {
        code,
        message,
        resolution,
        documentation: "https://armand-salle.fr/developers",
      },
    },
    { request, status },
  )
}

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const pathname = normalizePath(url.pathname)
  const isApiPath = pathname === "/api" || pathname.startsWith("/api/")

  if (request.method === "OPTIONS" && isApiPath) {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Headers": "Accept, Content-Type",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (isApiPath) {
      return apiError(
        request,
        405,
        "method_not_allowed",
        "This public API supports retrieval only.",
        "Retry with GET or HEAD. No write operations are available.",
      )
    }
    return context.next()
  }

  if (pathname === "/" && url.searchParams.get("mode") === "agent") {
    return jsonResponse(
      {
        mode: "agent",
        description:
          "Structured entry point for Armand Sallé's public, read only profile and technical content.",
        authentication: "none",
        profile,
        resources,
        guidance: {
          whenToUse:
            "Use for professional profile research, hiring fit, public contact details, or retrieving Armand Sallé's technical writing.",
          restrictions:
            "Retrieval only. Do not infer private details or unpublished client information.",
        },
      },
      {
        request,
        headers: {
          Link: '</llms.txt>; rel="describedby"; type="text/markdown", </openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json;version=3.1"',
        },
      },
    )
  }

  const representation = negotiateContentType(request.headers.get("Accept"))
  const markdown = markdownRepresentations.get(pathname)

  if (markdown && representation === "text/markdown") {
    return markdownResponse(markdown, {
      request,
      links: pageLinks(pathname),
    })
  }

  if (markdown && representation === null) {
    return responseWithHeaders(
      new Response(null, {
        status: 406,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }),
    )
  }

  const assetResponse = await context.next()
  const isUnexpectedHtmlFallback =
    assetResponse.status === 200 &&
    assetResponse.headers.get("Content-Type")?.includes("text/html") &&
    !KNOWN_PAGE_PATHS.has(pathname)

  if (isApiPath && (assetResponse.status === 404 || isUnexpectedHtmlFallback)) {
    return apiError(
      request,
      404,
      "resource_not_found",
      "The requested API resource does not exist.",
      "Use /api/resources.json to list supported endpoints or inspect /openapi.json.",
    )
  }

  if (assetResponse.status === 404 && representation === "text/markdown") {
    return notFoundResponse(request, representation)
  }

  if (isUnexpectedHtmlFallback) return notFoundResponse(request, representation)

  const links = markdown ? { Link: pageLinks(pathname) } : {}
  return responseWithHeaders(assetResponse, links)
}
