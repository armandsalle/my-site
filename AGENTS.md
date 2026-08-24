# Instructions for coding agents

## Repository purpose

This repository is the source for Armand Sallé's personal portfolio and technical blog at https://armand-salle.fr. It is an Astro site deployed as static HTML with a Cloudflare Pages request handler for content negotiation.

## Working in this repository

Use pnpm for dependency and script commands. Run `pnpm verify` before considering a change complete. Preserve server rendered content, canonical URLs, Markdown representations, structured data, content negotiation, and real HTTP 404 responses.

Public profile data belongs in `src/data/public-api.mjs`. Machine readable routes should reuse that source rather than creating a second copy. Public pages should remain useful without client side JavaScript.

Do not add authenticated actions, payments, personal data collection, or claims about Armand that are not supported by the site's public content.

Do not use em dash or en dash characters in repository prose. Restructure the sentence instead.

## Agent entry points

Read `/llms.txt` for the content index, `/developers` for access guidance, and `/openapi.json` for the public read only API. The complete resource index is available at `/api/resources.json`.
