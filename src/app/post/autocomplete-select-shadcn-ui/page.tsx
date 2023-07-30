"use client"

import { AutoComplete, Option } from "@/components/autocomplete"
import { link, p } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Github } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
  {
    value: "express.js",
    label: "Express.js",
  },
  {
    value: "nest.js",
    label: "Nest.js",
  },
]

export default function Post() {
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisbled] = useState(false)
  const [value, setValue] = useState<Option>()

  return (
    <main className="mx-auto my-12 max-w-[33.75rem] px-6 text-black antialiased sm:my-32">
      <Button asChild variant="ghost">
        <Link href="/">
          <ChevronLeft size={16} className="mr-2" />
          Get back to the homepage
        </Link>
      </Button>
      <header className="flex flex-col gap-2 items-start mt-6">
        <p className={p}>
          This is a demo of a custom autocomplete component built with{" "}
          <Link href="https://ui.shadcn.com/" target="_blank" className={link}>
            Shadcn UI
          </Link>{" "}
          and{" "}
          <Link href="https://craft.mxkaske.dev/post/fancy-multi-select" target="_blank" className={link}>
            Fancy Multi Select
          </Link>{" "}
          by{" "}
          <Link href="https://mxkaske.dev" target="_blank" className={link}>
            Maximilian Kaske
          </Link>
          . Feel free to play around with it and customize it to your needs.
        </p>
        <Button asChild size="sm" variant="default">
          <Link href="https://github.com/armandsalle/my-site/blob/main/src/components/autocomplete.tsx" target="_blank">
            <Github size={16} className="mr-2" />
            Get the source code here
          </Link>
        </Button>
      </header>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLoading((prev) => !prev)}>
            Toggle loading
          </Button>
          <Button variant="outline" onClick={() => setDisbled((prev) => !prev)}>
            Disabled
          </Button>
        </div>
        <AutoComplete
          options={FRAMEWORKS}
          emptyMessage="No resulsts."
          placeholder="Find something"
          isLoading={isLoading}
          onValueChange={setValue}
          value={value}
          disabled={isDisabled}
        />
        <span className="text-sm">Current value: {value ? value?.label : "No value selected"}</span>
        <span className="text-sm">Loading state: {isLoading ? "true" : "false"}</span>
        <span className="text-sm">Disabled: {isDisabled ? "true" : "false"}</span>
      </div>
    </main>
  )
}
