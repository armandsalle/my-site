import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  type ReactNode,
} from "react"
import { cn } from "../../utils/utils"

const COLLAPSED_HEIGHT = 120

export function CollapsibleCode({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [needsCollapse, setNeedsCollapse] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      if (height <= COLLAPSED_HEIGHT + 40) {
        setNeedsCollapse(false)
      }
    }
  }, [children])

  const handleTransitionEnd = useCallback(() => {
    if (isOpen && outerRef.current) {
      outerRef.current.style.maxHeight = "none"
    }
  }, [isOpen])

  const toggle = useCallback(() => {
    if (!isOpen && outerRef.current) {
      // Before expanding, set maxHeight to current collapsed value so transition works
      outerRef.current.style.maxHeight = `${COLLAPSED_HEIGHT}px`
    }
    setIsOpen((prev) => {
      const next = !prev
      if (outerRef.current && contentRef.current) {
        if (next) {
          // Expanding: set target height
          outerRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`
        } else {
          // Collapsing: first set explicit height, then collapse
          outerRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`
          requestAnimationFrame(() => {
            if (outerRef.current) {
              outerRef.current.style.maxHeight = `${COLLAPSED_HEIGHT}px`
            }
          })
        }
      }
      return next
    })
  }, [isOpen])

  if (!needsCollapse) {
    return <div className="not-prose">{children}</div>
  }

  return (
    <div className="not-prose">
      <div className="relative">
        <div
          ref={outerRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            maxHeight: isOpen ? undefined : `${COLLAPSED_HEIGHT}px`,
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div ref={contentRef}>{children}</div>
        </div>
        {!isOpen && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{
              background:
                "linear-gradient(to top, var(--ec-codeBg, #eff1f5), transparent)",
            }}
          />
        )}
      </div>
      <button
        onClick={toggle}
        className={cn(
          "mt-2 rounded-md px-3 py-1 text-xs font-medium transition-colors",
          "bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800",
        )}
      >
        {isOpen ? "Collapse" : "Show full code"}
      </button>
    </div>
  )
}
