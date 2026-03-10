import { useState, useEffect, useRef } from "react"
import { cn } from "../../utils/utils"

type Heading = { id: string; text: string }

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll("article h2[id]"),
    ) as HTMLElement[]

    setHeadings(
      els.map((el) => ({ id: el.id, text: el.textContent?.trim() ?? "" })),
    )

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    )

    for (const el of els) {
      observerRef.current.observe(el)
    }

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <nav className="not-prose my-8 border-l-2 border-slate-200 pl-4">
      <div className="mb-2 text-sm font-semibold text-slate-700">
        Table of contents
      </div>
      {headings.length === 0 ? (
        <div className="h-6" />
      ) : (
        <ol className="flex flex-col gap-0.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                  history.pushState(null, "", `#${h.id}`)
                }}
                className={cn(
                  "block rounded-md px-2 py-1 text-sm transition-colors",
                  activeId === h.id
                    ? "font-medium text-slate-900"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  )
}
