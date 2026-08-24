# Armand Sallé's website

Personal portfolio and technical blog built with Astro.

## Development

```sh
pnpm install
pnpm dev
```

Run the complete static build and agent-readiness checks with:

```sh
pnpm verify
```

## Machine-readable access

The site publishes `/llms.txt`, scoped agent indexes, Markdown mirrors for its
core pages, an XML sitemap, RSS, JSON-LD identity data, and a small public API.
The API contract is available at `/openapi.json`. Standard discovery documents
live under `/.well-known/`, including an RFC 9727 API catalog and an ARD AI
catalog.

On Cloudflare Pages, the catch-all function negotiates `text/markdown` on core
pages, serves a structured `?mode=agent` entry point, returns JSON API errors,
and prevents SPA fallback configuration from turning unknown resources into
soft 404 responses.

The repository CLI exposes stable public profile data:

```sh
node bin/armand-salle.js profile --json
node bin/armand-salle.js resources --json
```
