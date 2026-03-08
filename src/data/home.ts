export interface WorkItem {
  title: string
  role: string
  period: string
  summary: string[]
  highlights: string[]
  stack: string[]
  link?: {
    href: string
    label: string
  }
  featured?: boolean
}

export const homeContent = {
  hero: {
    name: "Armand Sallé",
    title: "Founding / Senior Product Engineer",
    location: "Based in Angers, France",
    details: ["29 years old", "Remote-first", "Paris-friendly"],
  },
  about: [
    "I build B2B and B2C products with strong product ownership, a bias for clarity, and a high bar for execution. My sweet spot is turning messy business workflows into smooth, thoughtful software that teams and customers actually enjoy using.",
    "What I enjoy most today is working close to users, understanding the domain deeply, and using AI-assisted execution and internal automation to move faster without lowering quality. I am at my best in small, ambitious teams where engineering is expected to shape the product, not just ship tickets.",
  ],
  selectedWork: [
    {
      title: "Ecair",
      role: "Founding Software Engineer",
      period: "2024 - 2025",
      summary: [
        "Joined a small Paris-based team building a B2B platform for renovation financing and reimbursement workflows in France.",
        "This was my strongest product engineering experience: high ownership, fast iteration, and a team that cared deeply about architecture, writing, and decision quality.",
      ],
      highlights: [
        "Owned product and engineering decisions across multiple parts of the platform, working closely with the business and operations side.",
        "Helped shape an RFC-oriented workflow with domain-driven architecture, shared types, and a monorepo that stayed coherent as the product expanded.",
        "Built and maintained isolated preview environments for pull requests with Fly.io and Neon, making review and QA much safer.",
      ],
      stack: [
        "React",
        "Node",
        "tRPC",
        "Vite",
        "Drizzle",
        "Neon",
        "Fly.io",
        "Zod",
        "Tailwind",
        "React Query",
      ],
      link: {
        href: "https://www.ecair.eco/",
        label: "Visit company site",
      },
      featured: true,
    },
    {
      title: "Dalma",
      role: "Frontend Engineer",
      period: "2022 - 2024",
      summary: [
        "Worked remotely from Nantes on Dalma's customer-facing web app and internal tools for the Paris HQ team.",
        "The scope covered both visible product work and the operational workflows behind policy management and reimbursements.",
      ],
      highlights: [
        "Delivered product improvements on the subscription flow and other key parts of the web experience.",
        "Built internal tooling to replace Retool for managing cases and reimbursements, giving teams a workflow tailored to their actual needs.",
        "Contributed to the frontend foundation through shared UI patterns, mentoring, and a more consistent component stack.",
      ],
      stack: [
        "React",
        "Next.js",
        "Tailwind",
        "Radix",
        "Zod",
        "RHF",
        "React Query",
        "XState",
        "TypeScript",
        "Vite",
      ],
      link: {
        href: "https://www.dalma.co/",
        label: "Visit company site",
      },
      featured: true,
    },
    {
      title: "Current freelance B2B mission",
      role: "Freelance Senior Product Engineer",
      period: "Since Sep 2025",
      summary: [
        "Currently working as a freelance senior product engineer on a large operational B2B platform with a complex domain, a long delivery horizon, and high expectations on reliability.",
        "The mission stays anonymous here, but it is the kind of environment where systems, process, and developer experience matter as much as feature delivery.",
      ],
      highlights: [
        "Strengthened CI and delivery workflows to make shipping safer and faster on a large codebase.",
        "Integrated AI into the team workflow to improve triage, context gathering, and implementation support around real product work.",
        "Focused on quality gates, product collaboration, and operational fluency rather than isolated technical wins.",
      ],
      stack: [
        "TypeScript",
        "React",
        "Turbo",
        "CI/CD",
        "AI workflows",
        "Internal tooling",
      ],
      featured: true,
    },
    {
      title: "Teamz Tennis",
      role: "Independent product build",
      period: "2025",
      summary: [
        "A more personal project built with my brother and a designer friend to help tennis players and clubs organize matches more easily.",
      ],
      highlights: [
        "Built the product with a stack close to Ecair, using Hono on the backend and recreating the deployment and preview workflow from scratch.",
        "Set up isolated PR environments across Fly.io and Cloudflare to keep the feedback loop fast and concrete.",
      ],
      stack: ["React", "Hono", "tRPC", "Fly.io", "Cloudflare", "Tailwind"],
      link: {
        href: "https://teamz-tennis.com/",
        label: "Visit landing page",
      },
    },
  ] satisfies WorkItem[],
  writing: {
    title: "Writing",
    intro:
      "I also write about the frontend patterns, UI building blocks, and implementation details I care about when shipping real products.",
  },
  contact: {
    title: "Available for selected freelance and founding roles.",
    body: "If you are building a product with real operational complexity and want an engineer who cares about the craft, the users, and the workflow behind the scenes, let's talk.",
    cta: "Let's talk",
    mailto: "mailto:armand.salle@gmail.com",
  },
} as const
