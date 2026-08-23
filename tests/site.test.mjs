import assert from "node:assert/strict"
import { execFileSync, spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import { after, before, test } from "node:test"

import { KNOWN_PAGE_PATHS, onRequest } from "../functions/[[path]].js"
import {
  appendVary,
  negotiateContentType,
} from "../src/utils/content-negotiation.mjs"

const projectRoot = new URL("../", import.meta.url)
let previewProcess

function textContent(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|copy);/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

async function builtPage(name) {
  const candidates = [`dist/${name}.html`, `dist/${name}/index.html`]
  for (const candidate of candidates) {
    try {
      return await readFile(new URL(candidate, projectRoot), "utf8")
    } catch {}
  }
  throw new Error(`No built page found for ${name}`)
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:4329/")
      if (response.ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error("Astro preview did not start")
}

before(async () => {
  previewProcess = spawn(
    process.execPath,
    [
      "node_modules/astro/astro.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      "4329",
    ],
    { cwd: projectRoot, stdio: "ignore" },
  )
  await waitForPreview()
})

after(() => previewProcess?.kill())

test("content negotiation respects quality, order, wildcards, and exclusions", () => {
  assert.equal(negotiateContentType(null), "text/html")
  assert.equal(negotiateContentType("*/*"), "text/html")
  assert.equal(negotiateContentType("text/markdown"), "text/markdown")
  assert.equal(
    negotiateContentType("text/markdown, text/html;q=0.8"),
    "text/markdown",
  )
  assert.equal(
    negotiateContentType("text/html, text/markdown;q=0.5"),
    "text/html",
  )
  assert.equal(negotiateContentType("application/json"), null)
  assert.equal(
    negotiateContentType("text/markdown;q=0, text/html"),
    "text/html",
  )
})

test("Vary values are merged without discarding encoding", () => {
  const headers = new Headers({ Vary: "Accept-Encoding" })
  appendVary(headers, "Accept")
  assert.equal(headers.get("Vary"), "Accept-Encoding, Accept")
})

test("Cloudflare handler serves negotiated Markdown with cache-safe headers", async () => {
  const response = await onRequest({
    request: new Request("https://armand-salle.fr/", {
      headers: { Accept: "text/markdown, text/html;q=0.8" },
    }),
    next: () => {
      throw new Error("HTML asset should not be requested")
    },
  })

  assert.equal(response.status, 200)
  assert.equal(
    response.headers.get("Content-Type"),
    "text/markdown; charset=utf-8",
  )
  assert.match(response.headers.get("Vary"), /Accept/)
  assert.match(response.headers.get("Vary"), /Accept-Encoding/)
  assert.match(response.headers.get("Link"), /rel="alternate"/)
  assert.match(await response.text(), /^# Armand Sallé/)
})

test("Cloudflare handler turns an app-shell fallback into a real 404", async () => {
  const response = await onRequest({
    request: new Request("https://armand-salle.fr/missing-resource", {
      headers: { Accept: "text/markdown" },
    }),
    next: () =>
      Promise.resolve(
        new Response("<html>app shell</html>", {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
      ),
  })

  assert.equal(response.status, 404)
  assert.equal(
    response.headers.get("Content-Type"),
    "text/markdown; charset=utf-8",
  )
  assert.match(await response.text(), /llms\.txt/)
})

test("homepage raw HTML has an H1, substantial text, and complete JSON-LD", async () => {
  const html = await builtPage("index")
  assert.match(html, /<h1\b[^>]*>[\s\S]*?Armand Sallé[\s\S]*?<\/h1>/)
  assert.ok(textContent(html).length > 500)

  const match = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )
  assert.ok(match, "JSON-LD script is missing")
  const graph = JSON.parse(match[1])["@graph"]
  const person = graph.find((item) => item["@type"] === "Person")
  const organization = graph.find((item) => item["@type"] === "Organization")
  assert.equal(person.name, "Armand Sallé")
  assert.equal(organization.contactPoint.contactType, "professional enquiries")
  assert.equal(organization.address.addressLocality, "Angers")
})

test("trust and developer pages contain substantial server-rendered content", async () => {
  for (const name of ["about", "contact", "privacy", "developers"]) {
    const html = await builtPage(name)
    assert.match(html, /<h1\b/)
    assert.ok(textContent(html).length > 500, `${name} is too short`)
    assert.match(html, new RegExp(`href="/${name}\\.md"`))
  }
})

test("llms.txt follows the link-index format and includes when-to-use guidance", async () => {
  const contents = await readFile(new URL("dist/llms.txt", projectRoot), "utf8")
  assert.match(contents, /^# Armand Sallé\n\n>/)
  assert.match(contents, /Use this site when an agent needs to/)
  assert.match(contents, /## Primary pages/)
  assert.match(
    contents,
    /- \[Homepage\]\(https:\/\/armand-salle\.fr\/index\.md\):/,
  )
})

test("the Cloudflare route allowlist covers every sitemap page", async () => {
  const sitemap = await readFile(
    new URL("dist/sitemap-0.xml", projectRoot),
    "utf8",
  )
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    ([, location]) => new URL(location).pathname,
  )
  assert.deepEqual(paths.filter((path) => !KNOWN_PAGE_PATHS.has(path)), [])
})

test("static preview returns a real 404 and exposes every machine-readable file", async () => {
  const missing = await fetch("http://127.0.0.1:4329/definitely-not-a-route")
  assert.equal(missing.status, 404)

  for (const path of [
    "/index.md",
    "/about.md",
    "/contact.md",
    "/privacy.md",
    "/developers.md",
    "/llms.txt",
    "/sitemap-index.xml",
    "/rss.xml",
  ]) {
    const response = await fetch(`http://127.0.0.1:4329${path}`)
    assert.equal(response.status, 200, path)
    assert.ok((await response.text()).length > 100, path)
  }
})

test("CLI returns stable JSON for agents", () => {
  const output = execFileSync(
    process.execPath,
    ["bin/armand-salle.js", "profile", "--json"],
    { cwd: projectRoot, encoding: "utf8" },
  )
  const value = JSON.parse(output)
  assert.equal(value.name, "Armand Sallé")
  assert.equal(value.website, "https://armand-salle.fr/")
})
