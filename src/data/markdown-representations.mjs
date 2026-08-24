function withFrontmatter({ title, description, canonical }, body) {
  return `---\ntitle: "${title}"\ndescription: "${description}"\ncanonical: "${canonical}"\nlast-updated: "2026-08-24"\n---\n\n${body}`
}

export const siteMarkdown = withFrontmatter(
  {
    title: "Armand Sallé, Founding and Senior Product Engineer",
    description:
      "Canonical professional profile, experience, writing, and contact details for Armand Sallé.",
    canonical: "https://armand-salle.fr/",
  },
  `# Armand Sallé

> Founding and senior product engineer based in Angers, France. Armand builds thoughtful B2B and B2C products with strong product ownership, modern frontend systems, and practical AI-assisted workflows.

## Profile

Armand works best with small, ambitious teams that expect engineering to help shape the product. His focus is turning complex business and operational workflows into clear, reliable software that users enjoy. He works remotely, can collaborate regularly with teams in Paris, and is available for selected freelance and founding roles.

## Selected experience

At Ecair, Armand was a founding software engineer on a B2B renovation financing platform. He owned product and engineering decisions, contributed to domain-driven architecture, and built isolated preview environments with Fly.io and Neon.

At Dalma, he worked on customer subscription experiences and internal policy and reimbursement tools. He also contributed shared UI patterns, mentoring, and frontend foundations.

In his current freelance mission, he works on a large operational B2B platform with a complex domain, focusing on delivery reliability, CI, AI-assisted workflows, and internal tooling.

## Contact

Email: armand.salle@gmail.com

Location: Angers, Pays de la Loire, France

Links: [GitHub](https://github.com/armandsalle), [LinkedIn](https://www.linkedin.com/in/armand-sall%C3%A9-9550a613a/), [Bluesky](https://bsky.app/profile/armand-salle.bsky.social)

Agent index: [llms.txt](https://armand-salle.fr/llms.txt)
Sitemap: [sitemap-index.xml](https://armand-salle.fr/sitemap-index.xml)
`,
)

export const aboutMarkdown = withFrontmatter(
  {
    title: "About Armand Sallé",
    description:
      "Background, experience, working style, and best fit opportunities for Armand Sallé.",
    canonical: "https://armand-salle.fr/about",
  },
  `# About Armand Sallé

Armand Sallé is a founding and senior product engineer based in Angers, France. He builds B2B and B2C software, especially products with complex operational workflows, demanding internal tools, and a need for close collaboration between engineering and the business.

His strongest work happens in small teams where engineers are expected to understand users, question assumptions, and take responsibility for outcomes. He combines TypeScript, React, Node.js, product discovery, system design, delivery tooling, and AI-assisted execution.

Armand has worked on renovation financing at Ecair, pet insurance at Dalma, and a large anonymous operational B2B platform as a freelance senior product engineer. Across those roles he has owned product decisions, built internal tooling, improved CI and preview environments, and helped teams keep their architecture coherent as products grew.

He writes technical articles about frontend patterns and production implementation details. The published examples are intended to be useful to working engineers and include complete context where possible.

For selected freelance or founding opportunities, contact armand.salle@gmail.com.
`,
)

export const contactMarkdown = withFrontmatter(
  {
    title: "Contact Armand Sallé",
    description:
      "Public contact details and guidance for contacting Armand Sallé about professional opportunities.",
    canonical: "https://armand-salle.fr/contact",
  },
  `# Contact Armand Sallé

The preferred contact method is email at armand.salle@gmail.com. Armand is based in Angers, France and works remote first. He can also collaborate regularly with teams in Paris.

The best fit is a focused conversation about a product with real operational complexity, a senior product engineering mission, or an early team where engineering will help define the product. Helpful first messages include the problem being solved, the current team, the expected scope, the working location, and the likely timeline.

Armand is most useful when a team needs strong TypeScript and React execution, product ownership, internal tooling, workflow design, architecture that can evolve, reliable delivery practices, or thoughtful use of AI inside an engineering workflow.

Recruiting messages and project introductions are welcome when they contain enough context to assess the fit. Please do not submit sensitive personal data, credentials, production data, or confidential customer information through email.

Public profiles: [GitHub](https://github.com/armandsalle), [LinkedIn](https://www.linkedin.com/in/armand-sall%C3%A9-9550a613a/), and [Bluesky](https://bsky.app/profile/armand-salle.bsky.social).
`,
)

export const privacyMarkdown = withFrontmatter(
  {
    title: "Privacy",
    description:
      "Privacy practices for the armand-salle.fr portfolio and public contact channels.",
    canonical: "https://armand-salle.fr/privacy",
  },
  `# Privacy

This is a personal portfolio and technical blog operated by Armand Sallé. The site is designed to provide public professional information and does not offer user accounts, payments, comments, or an authenticated application.

The site itself does not intentionally set advertising cookies or use forms that store personal information. Standard infrastructure logs may be processed by the hosting and network providers for security, reliability, abuse prevention, and delivery. Such logs can include an IP address, request time, requested URL, browser information, and technical error details.

If you contact Armand by email, the information in your message is processed only to read, answer, and follow up on that conversation. Do not send passwords, API keys, health information, financial records, or other unnecessary sensitive data. You may ask for correction or deletion of information you supplied by writing to armand.salle@gmail.com.

Articles can link to third-party websites and interactive examples. Those services have their own privacy practices and may receive ordinary request information when you visit them. This notice applies only to armand-salle.fr.

For any privacy question concerning this site, contact armand.salle@gmail.com.
`,
)

export const developersMarkdown = withFrontmatter(
  {
    title: "armand-salle.fr developer resources",
    description:
      "API, machine readable formats, discovery documents, content negotiation, and support for armand-salle.fr.",
    canonical: "https://armand-salle.fr/developers",
  },
  `# armand-salle.fr developer resources

Armand Sallé's website is a public portfolio and technical blog. It exposes a small, unauthenticated, read only API for canonical profile data and resource discovery. It does not accept write operations, issue API keys, or provide an authenticated product sandbox.

## Quickstart

Fetch the agent index:

\`\`\`sh
curl -fsS https://armand-salle.fr/llms.txt
\`\`\`

Request the homepage as Markdown:

\`\`\`sh
curl -fsS -H 'Accept: text/markdown' https://armand-salle.fr/
\`\`\`

Discover all public HTML routes through the sitemap:

\`\`\`sh
curl -fsS https://armand-salle.fr/sitemap-index.xml
\`\`\`

Fetch the structured profile:

\`\`\`sh
curl -fsS https://armand-salle.fr/api/profile.json
\`\`\`

Inspect the OpenAPI 3.1 contract at [openapi.json](https://armand-salle.fr/openapi.json). The resource index is available at [api/resources.json](https://armand-salle.fr/api/resources.json), and the RFC 9727 catalog is available at [.well-known/api-catalog](https://armand-salle.fr/.well-known/api-catalog).

## Authentication and sandbox

No API key is required. Every documented endpoint is public, deterministic, and read only. There are no write actions, so a sandbox is neither required nor advertised. Automated clients should use ordinary conditional requests, respect HTTP status codes, and avoid aggressive request rates.

## CLI

The repository includes a small zero-dependency CLI for machine-readable profile and resource discovery. Until a registry package is published, run it from the official GitHub repository with \`npx github:armandsalle/my-site profile --json\`.

## Agent assets and source

The [public source repository](https://github.com/armandsalle/my-site) includes [repository instructions for coding agents](https://github.com/armandsalle/my-site/blob/main/AGENTS.md) and a [profile research skill](https://github.com/armandsalle/my-site/blob/main/SKILL.md). These files document safe contribution rules, canonical data sources, when to use the site, and how to cite its content.

## Support

For a broken public resource or an integration question, email armand.salle@gmail.com and include the URL, request headers, response status, and a minimal reproduction.
`,
)

export const markdownRepresentations = new Map([
  ["/", siteMarkdown],
  ["/about", aboutMarkdown],
  ["/contact", contactMarkdown],
  ["/privacy", privacyMarkdown],
  ["/developers", developersMarkdown],
])
