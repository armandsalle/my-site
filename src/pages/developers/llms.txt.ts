import type { APIRoute } from "astro"

const contents = `# armand-salle.fr developer resources

> Scoped index for the machine readable interfaces published by armand-salle.fr.

Use these resources to retrieve public professional information or discover canonical technical content. Every endpoint is unauthenticated and read only. There are no write actions, payments, accounts, or private data surfaces.

## Documentation and discovery

- [Developer guide](https://armand-salle.fr/developers.md): Human and agent readable usage guidance.
- [OpenAPI 3.1 contract](https://armand-salle.fr/openapi.json): Typed API description.
- [RFC 9727 API catalog](https://armand-salle.fr/.well-known/api-catalog): Standard API discovery Linkset.
- [ARD AI catalog](https://armand-salle.fr/.well-known/ai-catalog.json): Agentic resource manifest.
- [Agent skills index](https://armand-salle.fr/.well-known/agent-skills/index.json): Capability names, descriptions, and endpoints.
`

export const GET: APIRoute = () =>
  new Response(contents, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
