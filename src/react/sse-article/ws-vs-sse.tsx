import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

type Ball = {
  id: number
  direction: "to-server" | "to-client"
}

function ConnectionDiagram({
  title,
  subtitle,
  clientCanSend,
  accentColor,
}: {
  title: string
  subtitle: string
  clientCanSend: boolean
  accentColor: string
}) {
  const [balls, setBalls] = useState<Ball[]>([])
  const [nextId, setNextId] = useState(0)

  const sendBall = useCallback(
    (direction: Ball["direction"]) => {
      const id = nextId
      setNextId((n) => n + 1)
      setBalls((prev) => [...prev, { id, direction }])
      setTimeout(() => {
        setBalls((prev) => prev.filter((b) => b.id !== id))
      }, 1200)
    },
    [nextId],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center">
        <div className="text-sm font-semibold text-slate-200">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
      <div className="relative flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-6">
        {/* Client */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "flex h-16 w-20 items-center justify-center rounded-lg border text-xs font-medium",
              "border-blue-500/30 bg-blue-500/10 text-blue-400",
            )}
          >
            Client
          </div>
          {clientCanSend ? (
            <button
              onClick={() => sendBall("to-server")}
              className="rounded-md bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/30"
            >
              Send →
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-md bg-slate-700/30 px-3 py-1 text-xs font-medium text-slate-600"
            >
              Send →
            </button>
          )}
        </div>

        {/* Connection line */}
        <div className="relative h-0.5 flex-1 bg-slate-700">
          <AnimatePresence>
            {balls.map((ball) => (
              <motion.div
                key={ball.id}
                className={cn(
                  "absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full shadow-lg",
                  accentColor,
                )}
                initial={{
                  left: ball.direction === "to-server" ? "0%" : "100%",
                  scale: 0,
                }}
                animate={{
                  left: ball.direction === "to-server" ? "100%" : "0%",
                  scale: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Server */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "flex h-16 w-20 items-center justify-center rounded-lg border text-xs font-medium",
              "border-green-500/30 bg-green-500/10 text-green-400",
            )}
          >
            Server
          </div>
          <button
            onClick={() => sendBall("to-client")}
            className="rounded-md bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/30"
          >
            ← Send
          </button>
        </div>
      </div>
    </div>
  )
}

export function WsVsSse() {
  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionDiagram
          title="WebSocket"
          subtitle="Bidirectional"
          clientCanSend={true}
          accentColor="bg-purple-400 shadow-purple-400/50"
        />
        <ConnectionDiagram
          title="SSE"
          subtitle="Unidirectional (server → client)"
          clientCanSend={false}
          accentColor="bg-emerald-400 shadow-emerald-400/50"
        />
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Click the Send buttons to see the difference
      </p>
    </div>
  )
}
