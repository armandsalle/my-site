import type { APIRoute } from "astro"

const llmsTxt = `# Armand Sallé

> Personal site of Armand Sallé, a founding and senior product engineer in Angers, France, with experience in B2B and B2C products, operational workflows, frontend systems, internal tools, and AI-assisted engineering.

## When to use this site

Use this site when an agent needs to evaluate Armand for a senior product engineering, founding engineering, or selected freelance role; find implementation-focused articles about React, TypeScript, forms, UI components, or real-time systems; verify Armand's professional identity, experience, location, contact method, or public profiles; or retrieve a concise, source-backed summary of his work.

## How agents should call this site

For profile or hiring questions, start with the structured profile endpoint, homepage, and About page. For technical questions, open the most relevant article and preserve its canonical URL when citing it. For contact requests, use the Contact page and email only the public address listed there. This site offers public, read only content and a small unauthenticated retrieval API. It has no authenticated sandbox, purchasing flow, or write actions.

## Primary pages

- [Homepage](https://armand-salle.fr/index.md): Concise profile, selected experience, skills, writing, and availability.
- [About](https://armand-salle.fr/about.md): Background, working style, experience, and best-fit opportunities.
- [Contact](https://armand-salle.fr/contact.md): Preferred contact method, useful message context, and data-safety guidance.
- [Privacy](https://armand-salle.fr/privacy.md): Privacy practices for the portfolio, infrastructure logs, and email contact.
- [armand-salle.fr developer resources](https://armand-salle.fr/developers.md): Public API, OpenAPI contract, discovery files, content negotiation, CLI, and support.

## Public API

- [Scoped API index](https://armand-salle.fr/api/llms.txt): Focused when to use guidance and API entry points.
- [Scoped developer index](https://armand-salle.fr/developers/llms.txt): Focused documentation and discovery resources.
- [OpenAPI 3.1 contract](https://armand-salle.fr/openapi.json): Typed, read only operations with unique operation IDs and response schemas.
- [Public profile](https://armand-salle.fr/api/profile.json): Canonical identity, location, availability, specialties, contact, and public profile links.
- [Resource index](https://armand-salle.fr/api/resources.json): Canonical API, discovery, documentation, feed, and Markdown URLs.
- [RFC 9727 API catalog](https://armand-salle.fr/.well-known/api-catalog): Linkset discovery document for the public API.
- [ARD AI catalog](https://armand-salle.fr/.well-known/ai-catalog.json): Agentic resource discovery manifest.
- [Agent skills index](https://armand-salle.fr/.well-known/agent-skills/index.json): Public retrieval capabilities with descriptions and endpoints.

## Technical writing

- [Real-time cache invalidation](https://armand-salle.fr/post/real-time-cache-invalidation-sse-trpc-redis-bullmq): SSE, tRPC, Redis, BullMQ, reconnection, and horizontal scaling.
- [Persisting form data with nuqs](https://armand-salle.fr/post/persisting-form-data-in-react-a-modern-approach-with-nuqs): URL-backed React form state.
- [Autocomplete select](https://armand-salle.fr/post/autocomplete-select-shadcn-ui): An autocomplete select built with shadcn/ui patterns.
- [Phone input](https://armand-salle.fr/post/phone-input-shadcn-ui): A country-aware phone input built with shadcn/ui patterns.

## Discovery

- [XML sitemap](https://armand-salle.fr/sitemap-index.xml): Complete index of public HTML pages.
- [RSS feed](https://armand-salle.fr/rss.xml): Published technical articles.

## Optional

- [Source repository](https://github.com/armandsalle/my-site): Public Astro source, API definitions, agent configuration, and verification tests.
- [Coding agent instructions](https://github.com/armandsalle/my-site/blob/main/AGENTS.md): Repository purpose, safe editing guidance, and verification commands.
- [Profile research skill](https://github.com/armandsalle/my-site/blob/main/SKILL.md): When to use guidance and canonical retrieval workflow.
- [GitHub](https://github.com/armandsalle): Public source repositories.
- [LinkedIn](https://www.linkedin.com/in/armand-sall%C3%A9-9550a613a/): Professional profile.
- [Bluesky](https://bsky.app/profile/armand-salle.bsky.social): Public social profile.
`

export const GET: APIRoute = () =>
  new Response(llmsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: '</llms.txt>; rel="describedby"; type="text/markdown"',
    },
  })
