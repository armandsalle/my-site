export type SelectedWorkId = "ecair" | "dalma" | "current"
export type SelectedWorkVariantId = "product" | "technical" | "trust"

export interface SelectedWorkExperience {
  id: SelectedWorkId
  title: string
  role: string
  period: string
  contextLabel: string
  link?: {
    href: string
    label: string
  }
}

interface SelectedWorkCopy {
  summary: string
  highlights: [string, string]
  impact: string
  stack:
    | [string, string, string]
    | [string, string, string, string]
    | [string, string, string, string, string]
}

export interface SelectedWorkVariant {
  id: SelectedWorkVariantId
  label: string
  title: string
  intro: string
  featuredId: SelectedWorkId
  entries: Record<SelectedWorkId, SelectedWorkCopy>
}

export const selectedWorkExperiences: SelectedWorkExperience[] = [
  {
    id: "ecair",
    title: "Ecair",
    role: "Founding Software Engineer",
    period: "2024 - 2025",
    contextLabel: "B2B renovation operations",
    link: {
      href: "https://www.ecair.eco/",
      label: "Visit company site",
    },
  },
  {
    id: "dalma",
    title: "Dalma",
    role: "Frontend Engineer",
    period: "2022 - 2024",
    contextLabel: "B2C insurance + internal tools",
    link: {
      href: "https://www.dalma.co/",
      label: "Visit company site",
    },
  },
  {
    id: "current",
    title: "Current freelance B2B mission",
    role: "Freelance Senior Product Engineer",
    period: "Since Sep 2025",
    contextLabel: "Freelance for a large operational platform",
  },
]

export const selectedWorkVariants: Record<
  SelectedWorkVariantId,
  SelectedWorkVariant
> = {
  product: {
    id: "product",
    label: "Product impact",
    title: "Selected work",
    intro:
      "A compact view of the product and workflow problems I like solving: complex domains, real operators, and software that feels clear on both sides of the screen.",
    featuredId: "current",
    entries: {
      ecair: {
        summary:
          "Helped build a fast-moving B2B platform for renovation financing and reimbursement workflows in France.",
        highlights: [
          "Contributed across the application on product features, frontend components, and workflow-heavy screens used every day.",
          "Worked on notifications and messaging features, including real-time collaboration with Liveblocks.",
        ],
        impact:
          "Better product decisions, faster iteration, and a platform the team could keep extending without losing clarity.",
        stack: ["React", "tRPC", "Drizzle", "Neon"],
      },
      dalma: {
        summary:
          "Worked on Dalma's customer app and internal operations tools from the same frontend foundation.",
        highlights: [
          "Improved subscription and customer-facing flows where quality directly affects conversion and trust.",
          "Replaced Retool-based workflows with tools shaped around how the internal team actually works.",
        ],
        impact:
          "Smoother customer journeys and internal workflows that matched the business instead of fighting it.",
        stack: ["React", "Next.js", "Radix", "React Query"],
      },
      current: {
        summary:
          "Working as a freelance senior product engineer on a long-running B2B platform where reliability, collaboration, and delivery quality all matter.",
        highlights: [
          "Improved how the team ships, reviews, and reasons about work across a large codebase.",
          "Used AI in the workflow to reduce friction around triage, context gathering, and implementation prep.",
        ],
        impact:
          "A delivery loop that is calmer, faster, and easier to trust on complex work.",
        stack: ["TypeScript", "React", "CI/CD", "AI workflows"],
      },
    },
  },
  technical: {
    id: "technical",
    label: "Technical execution",
    title: "Selected work",
    intro:
      "A technical view of my work: keeping codebases understandable, improving delivery workflows, and shipping reliably in complex product environments.",
    featuredId: "current",
    entries: {
      ecair: {
        summary:
          "Worked inside a strongly typed monorepo with shared contracts, RFC-driven decisions, and preview environments already in place.",
        highlights: [
          "Contributed to the app itself through frontend components, feature work, notifications, and messaging flows.",
          "Built on top of an already strong engineering setup rather than creating the monorepo or CI from scratch.",
        ],
        impact:
          "A strong product codebase that kept moving quickly while I added real user-facing and operational features.",
        stack: ["React", "Liveblocks", "tRPC", "Drizzle", "Neon"],
      },
      dalma: {
        summary:
          "Worked across a modern frontend stack spanning customer flows, internal tooling, and shared UI patterns.",
        highlights: [
          "Improved key product surfaces while maintaining a consistent component and state-management approach.",
          "Moved internal workflows away from generic tooling toward a purpose-built React application.",
        ],
        impact:
          "A stronger frontend foundation and less friction between product needs and implementation.",
        stack: ["Next.js", "Zod", "RHF", "XState", "Tailwind"],
      },
      current: {
        summary:
          "Focused on delivery systems, workflow quality, and AI-assisted execution inside a large operational codebase.",
        highlights: [
          "Raised the bar on CI and team-level delivery confidence across a complex platform.",
          "Integrated AI into the workflow where it improves speed without diluting engineering judgment.",
        ],
        impact:
          "Safer releases, sharper context, and less time lost between ticket, implementation, and review.",
        stack: ["Monorepo", "Fullstack TypeScript", "CI/CD", "AI workflows"],
      },
    },
  },
  trust: {
    id: "trust",
    label: "Business complexity",
    title: "Selected work",
    intro:
      "A version centered on trust: the kinds of products, teams, and workflows where software has to support real operational responsibility.",
    featuredId: "current",
    entries: {
      ecair: {
        summary:
          "Worked in a product environment where business logic, operational detail, and execution quality were tightly connected.",
        highlights: [
          "Shipped features across the product surface, from core workflows to notifications and collaborative messaging.",
          "Supported a team that already had strong engineering foundations by contributing where the product actually needed depth.",
        ],
        impact:
          "A product foundation the team could trust in a domain that does not forgive confusion.",
        stack: ["React", "Node", "tRPC", "Drizzle"],
      },
      dalma: {
        summary:
          "Worked on both the customer-facing side of the product and the internal workflows behind case handling and reimbursements.",
        highlights: [
          "Improved flows where clarity and reassurance directly shape the user experience.",
          "Built internal tools around real operational needs instead of forcing the team into generic back-office software.",
        ],
        impact:
          "Better alignment between what customers see and how the business actually operates behind the scenes.",
        stack: ["React", "Next.js", "Tailwind", "Radix"],
      },
      current: {
        summary:
          "Currently working inside a large B2B environment where delivery quality and operational trust matter more than shiny features.",
        highlights: [
          "Improved release and review workflows to lower risk on complex changes.",
          "Introduced AI where it helps the team reason faster without losing ownership of the work.",
        ],
        impact:
          "More confidence in the process around critical product work, not just the code itself.",
        stack: ["React", "TypeScript", "CI/CD", "Internal tooling"],
      },
    },
  },
}
