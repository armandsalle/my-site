import type { APIRoute } from "astro"

const profileSchema = {
  type: "object",
  required: [
    "name",
    "headline",
    "description",
    "location",
    "availability",
    "specialties",
    "website",
    "contact",
    "profiles",
  ],
  properties: {
    name: { type: "string", description: "Full professional name." },
    headline: { type: "string", description: "Current professional focus." },
    description: { type: "string", description: "Concise public biography." },
    location: {
      type: "object",
      required: ["city", "region", "country"],
      properties: {
        city: { type: "string" },
        region: { type: "string" },
        country: {
          type: "string",
          description: "ISO 3166 alpha 2 country code.",
          pattern: "^[A-Z]{2}$",
        },
      },
    },
    availability: { type: "array", items: { type: "string" } },
    specialties: { type: "array", items: { type: "string" } },
    website: { type: "string", format: "uri" },
    contact: { type: "string", format: "uri" },
    profiles: {
      type: "object",
      additionalProperties: { type: "string", format: "uri" },
    },
  },
}

const resourcesSchema = {
  type: "object",
  required: [
    "name",
    "description",
    "authentication",
    "access",
    "documentation",
    "openapi",
    "endpoints",
    "discovery",
    "markdown",
  ],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    authentication: { type: "string", enum: ["none"] },
    access: { type: "string", enum: ["public-read-only"] },
    documentation: { type: "string", format: "uri" },
    openapi: { type: "string", format: "uri" },
    endpoints: {
      type: "object",
      additionalProperties: { type: "string", format: "uri" },
    },
    discovery: {
      type: "object",
      additionalProperties: { type: "string", format: "uri" },
    },
    markdown: {
      type: "object",
      additionalProperties: { type: "string", format: "uri" },
    },
  },
}

const errorResponseSchema = {
  type: "object",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message", "resolution", "documentation"],
      properties: {
        code: {
          type: "string",
          description: "Stable machine readable error identifier.",
        },
        message: {
          type: "string",
          description: "Human readable explanation of the error.",
        },
        resolution: {
          type: "string",
          description: "Specific guidance for correcting the request.",
        },
        documentation: { type: "string", format: "uri" },
      },
    },
  },
}

const errorResponse = {
  description: "A structured error with a stable code and recovery guidance.",
  content: {
    "application/json": { schema: errorResponseSchema },
  },
}

const document = {
  openapi: "3.1.0",
  jsonSchemaDialect: "https://spec.openapis.org/oas/3.1/dialect/base",
  info: {
    title: "Armand Sallé Public Profile API",
    version: "1.0.0",
    description:
      "A public, unauthenticated and read only API for canonical professional profile data and resource discovery. It performs no write actions and stores no user data.",
    contact: {
      name: "Armand Sallé",
      url: "https://armand-salle.fr/contact",
    },
  },
  servers: [{ url: "https://armand-salle.fr" }],
  security: [],
  paths: {
    "/api/profile.json": {
      get: {
        operationId: "getPublicProfile",
        summary: "Get Armand Sallé's public professional profile",
        description:
          "Returns canonical identity, location, availability, specialties, contact, and public profile links.",
        responses: {
          "200": {
            description: "The current public professional profile.",
            content: {
              "application/json": { schema: profileSchema },
            },
          },
          "404": errorResponse,
        },
      },
    },
    "/api/resources.json": {
      get: {
        operationId: "listPublicResources",
        summary: "List machine readable public resources",
        description:
          "Returns canonical API, discovery, documentation, feed, and Markdown representation URLs.",
        responses: {
          "200": {
            description: "The current public resource index.",
            content: {
              "application/json": { schema: resourcesSchema },
            },
          },
          "404": errorResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      ErrorResponse: errorResponseSchema,
    },
  },
}

export const GET: APIRoute = () =>
  new Response(JSON.stringify(document, null, 2), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "Content-Type":
        "application/vnd.oai.openapi+json;version=3.1; charset=utf-8",
    },
  })
