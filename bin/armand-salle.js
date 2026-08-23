#!/usr/bin/env node

const profile = {
  name: "Armand Sallé",
  title: "Founding and Senior Product Engineer",
  location: "Angers, France",
  availability: "Selected freelance and founding roles",
  email: "armand.salle@gmail.com",
  website: "https://armand-salle.fr/",
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Product engineering",
    "Internal tooling",
    "AI-assisted workflows",
  ],
}

const resources = {
  llms: "https://armand-salle.fr/llms.txt",
  sitemap: "https://armand-salle.fr/sitemap-index.xml",
  rss: "https://armand-salle.fr/rss.xml",
  developers: "https://armand-salle.fr/developers",
  contact: "https://armand-salle.fr/contact",
}

const [command = "help", ...flags] = process.argv.slice(2)
const asJson = flags.includes("--json")

function print(value) {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
    return
  }

  for (const [key, item] of Object.entries(value)) {
    const formatted = Array.isArray(item) ? item.join(", ") : item
    process.stdout.write(`${key}: ${formatted}\n`)
  }
}

switch (command) {
  case "profile":
    print(profile)
    break
  case "resources":
    print(resources)
    break
  case "help":
  case "--help":
  case "-h":
    process.stdout.write(`armand-salle

Read public information about Armand Sallé from scripts and agents.

Commands:
  profile [--json]    Print the public professional profile
  resources [--json]  Print machine-readable site resources
  help                Show this help
`)
    break
  default:
    process.stderr.write(
      `Unknown command: ${command}\nRun armand-salle help for usage.\n`,
    )
    process.exitCode = 1
}
