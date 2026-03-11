import {
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

type Point = { x: number; y: number }

type Ball = {
  id: number
  from: Point
  to: Point
}

type Phase =
  | { step: "idle" }
  | { step: "publish"; instance: number }
  | { step: "redis" }
  | { step: "fanout" }
  | { step: "received" }

let nextId = 0

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

const INSTANCES = ["Instance 1", "Instance 2", "Instance 3"] as const
const CLIENTS = ["Client A", "Client B", "Client C"] as const

export function HorizontalScaling() {
  const [phase, setPhase] = useState<Phase>({ step: "idle" })
  const [balls, setBalls] = useState<Ball[]>([])
  const [sourceInstance, setSourceInstance] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const redisRef = useRef<HTMLDivElement>(null)
  const clientRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])

  const isRunning = phase.step !== "idle"

  const measure = useCallback(() => {
    const c = containerRef.current
    const redis = redisRef.current
    if (!c || !redis) return null

    const instanceRights = instanceRefs.current.map((ref) =>
      ref ? edgeRight(ref, c) : { x: 0, y: 0 },
    )
    const redisLeft = edgeLeft(redis, c)
    const redisRight = edgeRight(redis, c)
    const clientLefts = clientRefs.current.map((ref) =>
      ref ? edgeLeft(ref, c) : { x: 0, y: 0 },
    )

    return { instanceRights, redisLeft, redisRight, clientLefts }
  }, [])

  useLayoutEffect(() => {
    const update = () => measure()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [measure])

  const triggerFlow = useCallback(() => {
    if (isRunning) return
    const m = measure()
    if (!m) return

    const src = sourceInstance

    // Phase 1: Instance → Redis
    setBalls([{ id: nextId++, from: m.instanceRights[src], to: m.redisLeft }])
    setPhase({ step: "publish", instance: src })

    // Phase 2: Redis received
    setTimeout(() => {
      setBalls([])
      setPhase({ step: "redis" })
    }, 700)

    // Phase 3: Redis → All clients
    setTimeout(() => {
      const fresh = measure()
      if (!fresh) return
      setBalls(
        fresh.clientLefts.map((cl) => ({
          id: nextId++,
          from: fresh.redisRight,
          to: cl,
        })),
      )
      setPhase({ step: "fanout" })
    }, 1200)

    // Phase 4: Clients received
    setTimeout(() => {
      setBalls([])
      setPhase({ step: "received" })
    }, 1900)

    // Reset
    setTimeout(() => {
      setPhase({ step: "idle" })
      setSourceInstance((prev) => (prev + 1) % 3)
    }, 2900)
  }, [isRunning, measure, sourceInstance])

  const redisGlow = phase.step === "redis" || phase.step === "fanout"

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">
          Horizontal Scaling with Redis Pub/Sub
        </div>
        <button
          onClick={triggerFlow}
          disabled={isRunning}
          className={cn(
            "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
            isRunning
              ? "cursor-not-allowed bg-slate-700 text-slate-500"
              : "bg-red-500/20 text-red-400 hover:bg-red-500/30",
          )}
        >
          {isRunning
            ? "Broadcasting..."
            : `Publish from ${INSTANCES[sourceInstance]}`}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative flex items-center justify-between py-4"
      >
        {/* Server instances */}
        <div className="z-10 flex w-24 flex-col items-center gap-2">
          {INSTANCES.map((label, i) => (
            <motion.div
              key={label}
              ref={(el) => {
                instanceRefs.current[i] = el
              }}
              className={cn(
                "flex h-11 w-22 items-center justify-center rounded-lg border text-xs font-medium",
                "border-blue-500/30 bg-blue-500/10 text-blue-400",
              )}
              animate={
                phase.step === "publish" && phase.instance === i
                  ? {
                      borderColor: "rgba(59,130,246,0.7)",
                      boxShadow: "0 0 16px rgba(59,130,246,0.3)",
                    }
                  : {
                      borderColor: "rgba(59,130,246,0.3)",
                      boxShadow: "0 0 0px rgba(59,130,246,0)",
                    }
              }
              transition={{ duration: 0.3 }}
            >
              {label}
            </motion.div>
          ))}
          <span className="text-[10px] text-slate-500">Server instances</span>
        </div>

        {/* Redis */}
        <div className="z-10 flex w-24 flex-col items-center gap-2">
          <motion.div
            ref={redisRef}
            className={cn(
              "flex h-16 w-22 items-center justify-center rounded-lg border text-xs font-medium",
              "border-red-500/30 bg-red-500/10 text-red-400",
            )}
            animate={
              redisGlow
                ? {
                    borderColor: "rgba(239,68,68,0.7)",
                    boxShadow: "0 0 24px rgba(239,68,68,0.25)",
                  }
                : {
                    borderColor: "rgba(239,68,68,0.3)",
                    boxShadow: "0 0 0px rgba(239,68,68,0)",
                  }
            }
            transition={{ duration: 0.3 }}
          >
            Redis
          </motion.div>
          <span className="text-[10px] text-slate-500">Pub/Sub</span>
        </div>

        {/* Clients via SSE */}
        <div className="z-10 flex w-24 flex-col items-center gap-2">
          {CLIENTS.map((label, i) => (
            <motion.div
              key={label}
              ref={(el) => {
                clientRefs.current[i] = el
              }}
              className={cn(
                "flex h-11 w-22 items-center justify-center rounded-lg border text-xs font-medium",
                "border-purple-500/30 bg-purple-500/10 text-purple-400",
              )}
              animate={
                phase.step === "received"
                  ? {
                      borderColor: [
                        "rgba(168,85,247,0.7)",
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
          <span className="text-[10px] text-slate-500">SSE connections</span>
        </div>

        {/* Connection lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {(() => {
            const m = measure()
            if (!m) return null
            const lines = [
              ...m.instanceRights.map((ir) => ({
                from: ir,
                to: m.redisLeft,
              })),
              ...m.clientLefts.map((cl) => ({
                from: m.redisRight,
                to: cl,
              })),
            ]
            return lines.map((line, i) => (
              <line
                key={i}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke="rgb(51,65,85)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ))
          })()}
        </svg>

        {/* Animated balls */}
        <AnimatePresence>
          {balls.map((ball) => (
            <motion.div
              key={ball.id}
              className="pointer-events-none absolute left-0 top-0 z-20 h-3 w-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"
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
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-2 text-center text-xs text-slate-500">
        An event from any instance reaches every client via Redis Pub/Sub, with no
        sticky sessions needed
      </p>
    </div>
  )
}
