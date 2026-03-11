import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

type Client = {
  id: number
  label: string
  connected: boolean
}

type LogEntry = {
  id: number
  text: string
  type: "subscribe" | "unsubscribe" | "info"
}

let logId = 0

export function RefCounting() {
  const [clients, setClients] = useState<Client[]>([
    { id: 0, label: "SSE Client 1", connected: false },
    { id: 1, label: "SSE Client 2", connected: false },
    { id: 2, label: "SSE Client 3", connected: false },
  ])
  const [logs, setLogs] = useState<LogEntry[]>([])

  const connectedCount = clients.filter((c) => c.connected).length

  const addLog = useCallback(
    (text: string, type: LogEntry["type"]) => {
      setLogs((prev) => [{ id: logId++, text, type }, ...prev].slice(0, 6))
    },
    [],
  )

  const toggleClient = useCallback(
    (clientId: number) => {
      setClients((prev) => {
        const client = prev.find((c) => c.id === clientId)
        if (!client) return prev

        const wasConnected = client.connected
        const currentCount = prev.filter((c) => c.connected).length

        const next = prev.map((c) =>
          c.id === clientId ? { ...c, connected: !c.connected } : c,
        )

        if (!wasConnected) {
          const newCount = currentCount + 1
          addLog(`+${client.label} → ref:${newCount}`, "info")
          if (currentCount === 0) {
            addLog(`0→1 → subscribe()`, "subscribe")
          }
        } else {
          const newCount = currentCount - 1
          addLog(`-${client.label} → ref:${newCount}`, "info")
          if (newCount === 0) {
            addLog(`1→0 → unsubscribe()`, "unsubscribe")
          }
        }

        return next
      })
    },
    [addLog],
  )

  const redisSubscribed = connectedCount > 0

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 text-sm font-semibold text-slate-200">
        Redis Subscription Reference Counting
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Clients */}
        <div className="space-y-2">
          <div className="mb-2 text-xs font-medium text-slate-400">
            SSE Connections
          </div>
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => toggleClient(client.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                client.connected
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-600",
              )}
            >
              <motion.div
                className={cn(
                  "h-2 w-2 rounded-full",
                  client.connected ? "bg-green-400" : "bg-slate-600",
                )}
                animate={
                  client.connected
                    ? { scale: [1, 1.4, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.4 }}
              />
              {client.label}
              <span className="ml-auto text-[10px] opacity-60">
                {client.connected ? "disconnect" : "connect"}
              </span>
            </button>
          ))}
        </div>

        {/* Channel state */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-xs font-medium text-slate-400">
            Channel: todo:42
          </div>
          <motion.div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full border-2 text-2xl font-bold",
              redisSubscribed
                ? "border-green-500/50 bg-green-500/10 text-green-400"
                : "border-slate-700 bg-slate-800/50 text-slate-600",
            )}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            key={connectedCount}
          >
            {connectedCount}
          </motion.div>
          <div className="text-[10px] text-slate-500">refCount</div>
        </div>

        {/* Redis status */}
        <div className="flex flex-col gap-2">
          <div className="mb-2 text-xs font-medium text-slate-400">
            Redis Status
          </div>
          <motion.div
            className={cn(
              "overflow-hidden rounded-lg border px-3 py-2.5 text-xs font-medium",
              redisSubscribed
                ? "border-red-500/40 bg-red-500/10 text-red-400"
                : "border-slate-700 bg-slate-800/50 text-slate-500",
            )}
            animate={
              redisSubscribed
                ? { borderColor: "rgba(239,68,68,0.4)" }
                : { borderColor: "rgba(51,65,85,1)" }
            }
          >
            <div className="flex items-center gap-2">
              <motion.div
                className={cn(
                  "h-2 w-2 rounded-full",
                  redisSubscribed ? "bg-red-400" : "bg-slate-600",
                )}
                animate={
                  redisSubscribed
                    ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                    : {}
                }
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              {redisSubscribed ? "Subscribed" : "Not subscribed"}
            </div>
          </motion.div>

          {/* Log */}
          <div className="mt-2 max-h-28 space-y-1 overflow-hidden">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "font-mono text-[10px] leading-relaxed",
                    log.type === "subscribe"
                      ? "text-green-400/80"
                      : log.type === "unsubscribe"
                        ? "text-red-400/80"
                        : "text-slate-500",
                  )}
                >
                  {log.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Click clients to connect/disconnect. Redis only subscribes when the
        first client connects and unsubscribes when the last one leaves
      </p>
    </div>
  )
}
