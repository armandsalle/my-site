import { DalmaCard } from "@/components/dalma-card"
import { DalmaDrawer } from "@/components/dalma-drawer"
import { h3, muted, p } from "@/components/typography"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="mx-auto my-12 max-w-[33.75rem] px-6 text-black antialiased sm:my-32">
      <header className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Avatar>
            <Image
              className="aspect-square h-full w-full"
              src="/armand-2.jpg"
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
                  <h2 className={cn(h3, "flex")}>Armand Sallé</h2>
                </TooltipTrigger>
                <TooltipContent align="start">
                  <p>With a french accent please 🇫🇷</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className={muted}>
              <div>
                Frontend engineer currently at <DalmaCard />
                <DalmaDrawer />.
              </div>
            </div>
          </div>
        </div>
        <p className={p}>
          Frontend developer who cares about design and experience.
          <br />
          🫶 React, TS, Tailwind and all that good stuff.
          <br />
          🔮 Betting on SolidJs for the futur.
        </p>
        <div className="bg-slate-100 p-3 ring-1 ring-slate-300 rounded-xl">
          <span className={cn(muted, "text-slate-500")}>
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
          </span>
        </div>
      </header>
    </main>
  )
}
