"use client"

import { cn } from "@/lib/utils"
import { Drawer } from "vaul"
import { link } from "./typography"
import { Button } from "./ui/button"
import Link from "next/link"

export function DalmaDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button aria-controls="dalma-dialog" className={cn(link, "inline-flex sm:hidden")}>
          Dalma
        </button>
      </Drawer.Trigger>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Portal>
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 mb-8" />
            <div className="flex flex-col justify-between gap-2">
              <Drawer.Title className="font-medium mb-4">Dalma 🐶</Drawer.Title>
              <p className="text-sm">
                Dalma is a pet insurance startup based in Paris, France. It is a really good company!
              </p>
              <div className="flex items-center pt-2">
                <span className="text-xs text-muted-foreground">Joined March 2022</span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="https://www.dalma.co/" target="_blank">
                  Visit website
                </Link>
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
