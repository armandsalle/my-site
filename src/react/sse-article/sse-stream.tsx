import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

type StreamEvent = {
  id: number
  lines: string[]
}

const EVENT_TEMPLATES = [
  {
    label: "todo.updated",
    data: {
      type: "todo.updated",
      todoId: 42,
    },
  },
  {
    label: "todo.completed",
    data: {
      type: "todo.completed",
      todoId: 42,
    },
  },
  {
    label: "user.assigned",
    data: {
      type: "user.assigned",
      userId: 7,
    },
  },
] as const

let nextEventId = 1

export function SseStream() {
  const [events, setEvents] = useState<StreamEvent[]>([])
  const [connected, setConnected] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events])

  const sendEvent = useCallback(
    (template: (typeof EVENT_TEMPLATES)[number]) => {
      if (!connected) return

      const id = nextEventId++
      const event: StreamEvent = {
        id,
        lines: [
          `event: invalidation`,
          `data: ${JSON.stringify(template.data)}`,
          `id: ${id}`,
          ``,
        ],
      }

      setEvents((prev) => [...prev.slice(-8), event])
    },
    [connected],
  )

  const toggleConnection = useCallback(() => {
    setConnected((prev) => {
      if (prev) {
        // Disconnecting
        setEvents((e) => [
          ...e,
          {
            id: nextEventId++,
            lines: ["/* connection closed */", ""],
          },
        ])
      } else {
        // Reconnecting
        setEvents((e) => [
          ...e,
          {
            id: nextEventId++,
            lines: [
              `/* reconnected — GET /api/trpc/onInvalidate */`,
              `:ok`,
              ``,
            ],
          },
        ])
      }
      return !prev
    })
  }, [])

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-slate-200">
            SSE Wire Format
          </div>
          <motion.div
            className={cn(
              "h-2 w-2 rounded-full",
              connected ? "bg-green-400" : "bg-red-400",
            )}
            animate={
              connected
                ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] text-slate-500">
            {connected ? "connected" : "disconnected"}
          </span>
        </div>
        <button
          onClick={toggleConnection}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
            connected
              ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
              : "bg-green-500/15 text-green-400 hover:bg-green-500/25",
          )}
        >
          {connected ? "Disconnect" : "Reconnect"}
        </button>
      </div>

      {/* Event buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {EVENT_TEMPLATES.map((template) => (
          <button
            key={template.label}
            onClick={() => sendEvent(template)}
            disabled={!connected}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              !connected
                ? "cursor-not-allowed bg-slate-800 text-slate-600"
                : "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25",
            )}
          >
            Send {template.label}
          </button>
        ))}
      </div>

      {/* Stream terminal */}
      <div
        ref={scrollRef}
        className="h-52 overflow-y-auto rounded-lg border border-slate-800 bg-black/40 p-3 font-mono text-xs leading-relaxed"
      >
        {/* Initial connection */}
        <div className="text-slate-600">
          {`GET /api/trpc/onInvalidate HTTP/1.1`}
        </div>
        <div className="text-slate-600">{`Accept: text/event-stream`}</div>
        <div className="mb-2 text-slate-600">{``}</div>
        <div className="text-green-400/60">{`:ok`}</div>
        <div className="mb-1 text-slate-700">{``}</div>

        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-1"
            >
              {event.lines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    line.startsWith("event:")
                      ? "text-purple-400/80"
                      : line.startsWith("data:")
                        ? "text-orange-400/80"
                        : line.startsWith("id:")
                          ? "text-slate-500"
                          : line.startsWith("/*")
                            ? "text-slate-600 italic"
                            : line.startsWith(":ok")
                              ? "text-green-400/60"
                              : "text-slate-700",
                  )}
                >
                  {line || "\u00A0"}
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor */}
        {connected && (
          <motion.span
            className="inline-block h-3.5 w-1.5 bg-slate-500"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-500">
        What your browser actually receives — plain text over HTTP, one event at
        a time
      </p>
    </div>
  )
}
