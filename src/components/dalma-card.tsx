import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { link } from "./typography"
import { Button } from "./ui/button"

export function DalmaCard() {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <button className={cn(link, "hidden sm:inline-flex")}>Dalma</button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold">Dalma 🐶</h4>
          <p className="text-sm">
            Dalma is a pet insurance startup based in Paris, France. It is a really good company!
          </p>
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground">Joined March 2022</span>
          </div>
          <Button asChild variant="outline">
            <Link href="https://www.dalma.co/" target="_blank">
              Visit website
            </Link>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
