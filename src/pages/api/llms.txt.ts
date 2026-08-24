import type { APIRoute } from "astro"

const contents = `# Armand Sallé Public Profile API

> A public, unauthenticated, read only API for canonical professional profile data and machine readable resource discovery.

Use this API when an agent needs a structured source for Armand Sallé's public identity, location, availability, specialties, contact details, public profiles, or canonical site resources. Do not use it for write actions, private information, unpublished client details, or assumptions about availability beyond the returned data.

## Endpoints

- [OpenAPI 3.1 contract](https://armand-salle.fr/openapi.json): Complete operation descriptions and response schemas.
- [Public profile](https://armand-salle.fr/api/profile.json): Canonical professional profile data.
- [Resource index](https://armand-salle.fr/api/resources.json): API, discovery, documentation, feed, and Markdown URLs.
- [Developer documentation](https://armand-salle.fr/developers.md): Access guidance and examples.
`

export const GET: APIRoute = () =>
  new Response(contents, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
