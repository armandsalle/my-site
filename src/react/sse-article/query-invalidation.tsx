import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

type QueryStatus = "fresh" | "stale" | "fetching"

type Query = {
  key: string
  label: string
  status: QueryStatus
}

const INITIAL_QUERIES: Query[] = [
  {
    key: "intervention.getById",
    label: "intervention.getById({ id: 42 })",
    status: "fresh",
  },
  { key: "intervention.list", label: "intervention.list()", status: "fresh" },
  {
    key: "member.getById",
    label: "member.getById({ id: 7 })",
    status: "fresh",
  },
  {
    key: "task.list",
    label: "task.list({ interventionId: 42 })",
    status: "fresh",
  },
  { key: "stats.dashboard", label: "stats.dashboard()", status: "fresh" },
]

type EventType = {
  name: string
  label: string
  invalidates: string[]
  payload: string
}

const EVENTS: EventType[] = [
  {
    name: "intervention.updated",
    label: "Intervention updated",
    invalidates: [
      "intervention.getById",
      "intervention.list",
      "stats.dashboard",
    ],
    payload: '{ type: "intervention.updated", id: 42 }',
  },
  {
    name: "task.completed",
    label: "Task completed",
    invalidates: ["task.list", "intervention.getById", "stats.dashboard"],
    payload: '{ type: "task.completed", interventionId: 42 }',
  },
  {
    name: "member.assigned",
    label: "Member assigned",
    invalidates: ["member.getById", "intervention.getById"],
    payload: '{ type: "member.assigned", memberId: 7 }',
  },
]

const statusConfig: Record<
  QueryStatus,
  { bg: string; text: string; label: string }
> = {
  fresh: { bg: "bg-green-500/15", text: "text-green-400", label: "fresh" },
  stale: { bg: "bg-orange-500/15", text: "text-orange-400", label: "stale" },
  fetching: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    label: "fetching...",
  },
}

export function QueryInvalidation() {
  const [queries, setQueries] = useState<Query[]>(INITIAL_QUERIES)
  const [lastEvent, setLastEvent] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const sendEvent = useCallback(
    (event: EventType) => {
      if (isRunning) return
      setIsRunning(true)
      setLastEvent(event.payload)

      // Mark affected queries as stale
      setQueries((prev) =>
        prev.map((q) =>
          event.invalidates.includes(q.key)
            ? { ...q, status: "stale" as const }
            : q,
        ),
      )

      // After a delay, mark as fetching
      setTimeout(() => {
        setQueries((prev) =>
          prev.map((q) =>
            event.invalidates.includes(q.key)
              ? { ...q, status: "fetching" as const }
              : q,
          ),
        )
      }, 900)

      // After another delay, mark as fresh
      setTimeout(() => {
        setQueries((prev) =>
          prev.map((q) =>
            event.invalidates.includes(q.key)
              ? { ...q, status: "fresh" as const }
              : q,
          ),
        )
        setIsRunning(false)
      }, 2000)
    },
    [isRunning],
  )

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 text-sm font-semibold text-slate-200">
        TanStack Query Cache Invalidation
      </div>

      {/* Event buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {EVENTS.map((event) => (
          <button
            key={event.name}
            onClick={() => sendEvent(event)}
            disabled={isRunning}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              isRunning
                ? "cursor-not-allowed bg-slate-800 text-slate-600"
                : "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25",
            )}
          >
            ⚡ {event.label}
          </button>
        ))}
      </div>

      {/* Last event */}
      <AnimatePresence>
        {lastEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2 font-mono text-xs text-slate-400"
          >
            SSE → {lastEvent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Query list */}
      <div className="space-y-1.5">
        {queries.map((query) => {
          const config = statusConfig[query.status]
          return (
            <motion.div
              key={query.key}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2"
              animate={
                query.status === "stale"
                  ? { borderColor: "rgba(249, 115, 22, 0.3)" }
                  : query.status === "fetching"
                    ? { borderColor: "rgba(59, 130, 246, 0.3)" }
                    : { borderColor: "rgba(30, 41, 59, 1)" }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="font-mono text-xs text-slate-300">
                {query.label}
              </span>
              <motion.span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  config.bg,
                  config.text,
                )}
                animate={
                  query.status === "stale"
                    ? { scale: [1, 1.2, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {config.label}
              </motion.span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
