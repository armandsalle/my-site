import { useState, useCallback, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

type Phase =
  | { step: "idle" }
  | { step: "sending" }
  | { step: "processing" }
  | { step: "broadcasting" }
  | { step: "received"; clientIds: number[] }

type Point = { x: number; y: number }

type Line = { from: Point; to: Point }

type Ball = {
  id: number
  from: Point
  to: Point
}

let nextBallId = 0

function center(el: HTMLElement, container: HTMLElement): Point {
  const er = el.getBoundingClientRect()
  const cr = container.getBoundingClientRect()
  return {
    x: er.left + er.width / 2 - cr.left,
    y: er.top + er.height / 2 - cr.top,
  }
}

function edgeRight(el: HTMLElement, container: HTMLElement): Point {
  const er = el.getBoundingClientRect()
  const cr = container.getBoundingClientRect()
  return { x: er.right - cr.left, y: er.top + er.height / 2 - cr.top }
}

function edgeLeft(el: HTMLElement, container: HTMLElement): Point {
  const er = el.getBoundingClientRect()
  const cr = container.getBoundingClientRect()
  return { x: er.left - cr.left, y: er.top + er.height / 2 - cr.top }
}

export function SseBroadcast() {
  const [phase, setPhase] = useState<Phase>({ step: "idle" })
  const [balls, setBalls] = useState<Ball[]>([])
  const [lines, setLines] = useState<Line[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const senderRef = useRef<HTMLDivElement>(null)
  const serverRef = useRef<HTMLDivElement>(null)
  const clientRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])

  const isRunning = phase.step !== "idle"

  const measure = useCallback(() => {
    const c = containerRef.current
    const s = senderRef.current
    const srv = serverRef.current
    if (!c || !s || !srv) return null

    const senderRight = edgeRight(s, c)
    const serverLeft = edgeLeft(srv, c)
    const serverRight = edgeRight(srv, c)
    const serverCenter = center(srv, c)

    const clientLefts = clientRefs.current.map((ref) =>
      ref ? edgeLeft(ref, c) : { x: 0, y: 0 },
    )

    return { senderRight, serverLeft, serverRight, serverCenter, clientLefts }
  }, [])

  // Compute lines from measured positions
  useLayoutEffect(() => {
    const update = () => {
      const m = measure()
      if (!m) return

      setLines([
        { from: m.senderRight, to: m.serverLeft },
        ...m.clientLefts.map((cl) => ({
          from: m.serverRight,
          to: cl,
        })),
      ])
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [measure])

  const triggerFlow = useCallback(() => {
    if (isRunning) return
    const m = measure()
    if (!m) return

    // Phase 1: User A sends to server
    const sendId = nextBallId++
    setBalls([{ id: sendId, from: m.senderRight, to: m.serverLeft }])
    setPhase({ step: "sending" })

    // Phase 2: Server processes
    setTimeout(() => {
      setBalls([])
      setPhase({ step: "processing" })
    }, 800)

    // Phase 3: Server broadcasts to all clients
    setTimeout(() => {
      const fresh = measure()
      if (!fresh) return

      setBalls(
        fresh.clientLefts.map((cl) => ({
          id: nextBallId++,
          from: fresh.serverRight,
          to: cl,
        })),
      )
      setPhase({ step: "broadcasting" })
    }, 1400)

    // Phase 4: Clients receive
    setTimeout(() => {
      setBalls([])
      setPhase({ step: "received", clientIds: [0, 1, 2] })
    }, 2200)

    // Reset
    setTimeout(() => {
      setPhase({ step: "idle" })
    }, 3200)
  }, [isRunning, measure])

  const serverGlow =
    phase.step === "processing" || phase.step === "broadcasting"

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">
          SSE: One-to-many broadcast
        </div>
        <button
          onClick={triggerFlow}
          disabled={isRunning}
          className={cn(
            "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
            isRunning
              ? "cursor-not-allowed bg-slate-700 text-slate-500"
              : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
          )}
        >
          {isRunning ? "Broadcasting..." : "Complete todo"}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative flex items-center justify-between py-4"
      >
        {/* User A (sender) */}
        <div className="z-10 flex w-24 flex-col items-center gap-2">
          <motion.div
            ref={senderRef}
            className={cn(
              "flex h-16 w-20 items-center justify-center rounded-lg border text-xs font-medium",
              "border-blue-500/30 bg-blue-500/10 text-blue-400",
            )}
            animate={
              phase.step === "sending"
                ? { borderColor: "rgba(59,130,246,0.6)" }
                : {}
            }
          >
            User A
          </motion.div>
          <span className="text-[10px] text-slate-500">mutation</span>
        </div>

        {/* Server */}
        <div className="z-10 flex w-24 flex-col items-center gap-2">
          <motion.div
            ref={serverRef}
            className={cn(
              "flex h-16 w-20 items-center justify-center rounded-lg border text-xs font-medium",
              "border-green-500/30 bg-green-500/10 text-green-400",
            )}
            animate={
              serverGlow
                ? {
                    borderColor: "rgba(34,197,94,0.6)",
                    boxShadow: "0 0 20px rgba(34,197,94,0.2)",
                  }
                : {
                    borderColor: "rgba(34,197,94,0.3)",
                    boxShadow: "0 0 0px rgba(34,197,94,0)",
                  }
            }
            transition={{ duration: 0.3 }}
          >
            Server
          </motion.div>
          <span className="text-[10px] text-slate-500">Redis + SSE</span>
        </div>

        {/* Clients */}
        <div className="z-10 flex w-24 flex-col items-center gap-2">
          {(["User A", "User B", "User C"] as const).map((label, i) => (
            <motion.div
              key={label}
              ref={(el) => {
                clientRefs.current[i] = el
              }}
              className={cn(
                "flex h-11 w-20 items-center justify-center rounded-lg border text-xs font-medium",
                "border-purple-500/30 bg-purple-500/10 text-purple-400",
              )}
              animate={
                phase.step === "received" && phase.clientIds.includes(i)
                  ? {
                      borderColor: [
                        "rgba(168,85,247,0.6)",
                        "rgba(168,85,247,0.3)",
                      ],
                      backgroundColor: [
                        "rgba(168,85,247,0.2)",
                        "rgba(168,85,247,0.1)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.6 }}
            >
              {label}
            </motion.div>
          ))}
          <span className="text-[10px] text-slate-500">SSE streams</span>
        </div>

        {/* Connection lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="rgb(51,65,85)"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* Animated balls */}
        <AnimatePresence>
          {balls.map((ball) => (
            <motion.div
              key={ball.id}
              className="pointer-events-none absolute left-0 top-0 z-20 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
              initial={{
                x: ball.from.x - 6,
                y: ball.from.y - 6,
                scale: 0,
              }}
              animate={{
                x: ball.to.x - 6,
                y: ball.to.y - 6,
                scale: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-2 text-center text-xs text-slate-500">
        One mutation triggers an update for every connected client
      </p>
    </div>
  )
}
