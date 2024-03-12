import { h3, lead, muted, p } from "@/components/typography"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="mx-auto max-w-[33.75rem] px-6 text-black antialiased sm:my-32">
      <header className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Avatar>
            <Image
              className="aspect-square h-full w-full object-cover"
              src="/armand-small.png"
              alt="Armand"
              width={120}
              height={120}
              quality={100}
            />
          </Avatar>
          <div>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className={cn(h3, "flex")}>Armand Sallé</h1>
                </TooltipTrigger>
                <TooltipContent align="start">
                  <p>With a french accent please 🇫🇷</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className={muted}>
              <div>
                Frontend engineer previously working at{" "}
                <Link href="https://www.dalma.co/" target="_blank" className="underline">
                  Dalma
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
        <p className={p}>
          I&apos;ve been a front-end developer for 4 years, working mainly with React, TypeScript, Next.js, and many
          others. Passionate about what I do, I get fully involved in every project, with a particular focus on design.
        </p>
        <p>
          <span className="font-semibold">Want to know more about me?</span>
          <br />
          <span>
            Visit my{" "}
            <Link
              href="https://www.linkedin.com/in/armand-sall%C3%A9-9550a613a/"
              target="_blank"
              className="text-slate-600 font-medium underline underline-offset-2"
            >
              LinkedIn profile
            </Link>{" "}
            (french)
          </span>
        </p>
        <p>
          Follow me on{" "}
          <Link
            href="https://twitter.com/ArmandSalle"
            className="text-slate-600 font-medium underline underline-offset-2"
          >
            Twitter
          </Link>{" "}
          or{" "}
          <Link
            href="https://github.com/armandsalle"
            className="text-slate-600 font-medium underline underline-offset-2"
          >
            Github
          </Link>{" "}
          for more.
        </p>
      </header>
      <div className="mt-8 flex flex-col gap-4">
        <h3 className={lead}>Latest posts</h3>

        <Link
          href="/post/phone-input-shadcn-ui"
          className="py-1 pl-0.5 pr-2 font-medium inline-flex items-center gap-2 hover:underline hover:underline-offset-2 rounded-lg"
        >
          <span className="text-sm text-slate-500">2024-03-08</span>
          <span>Phone input with Shadcn UI</span>
        </Link>
        <Link
          href="/post/autocomplete-select-shadcn-ui"
          className="py-1 pl-0.5 pr-2 font-medium inline-flex items-center gap-2 hover:underline hover:underline-offset-2 rounded-lg"
        >
          <span className="text-sm text-slate-500">2023-07-30</span>
          <span>Autocomplete with Shadcn UI</span>
        </Link>
      </div>
    </main>
  )
}
