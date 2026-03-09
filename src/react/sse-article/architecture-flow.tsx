import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { cn } from "../../utils/utils"

const STEPS = [
  {
    label: "Mutation",
    sublabel: "completeTodo()",
    color: "blue",
    json: '{ action: "complete", id: 42 }',
  },
  {
    label: "API Handler",
    sublabel: "tRPC procedure",
    color: "blue",
    json: '→ db.update({ status: "done" })',
  },
  {
    label: "Redis Pub/Sub",
    sublabel: "publish(channel, event)",
    color: "red",
    json: '{ type: "todo.updated", id: 42 }',
  },
  {
    label: "SSE Stream",
    sublabel: "EventSource",
    color: "orange",
    json: 'data: {"type":"todo.updated","id":42}',
  },
  {
    label: "Client Handler",
    sublabel: "onInvalidate(event)",
    color: "purple",
    json: "→ switch(event.type)",
  },
  {
    label: "Invalidate",
    sublabel: "queryClient.invalidate",
    color: "pink",
    json: '→ invalidate(["todo", 42])',
  },
  {
    label: "Refetch",
    sublabel: "automatic",
    color: "green",
    json: "→ fresh data rendered ✓",
  },
] as const

const colorMap: Record<
  string,
  { border: string; bg: string; text: string; glow: string }
> = {
  blue: {
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  red: {
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    text: "text-red-400",
    glow: "shadow-red-500/20",
  },
  orange: {
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    glow: "shadow-orange-500/20",
  },
  purple: {
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
  pink: {
    border: "border-pink-500/40",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    glow: "shadow-pink-500/20",
  },
  green: {
    border: "border-green-500/40",
    bg: "bg-green-500/10",
    text: "text-green-400",
    glow: "shadow-green-500/20",
  },
}

export function ArchitectureFlow() {
  const [activeStep, setActiveStep] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)

  const triggerFlow = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setActiveStep(-1)

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i)
        if (i === STEPS.length - 1) {
          setTimeout(() => setIsRunning(false), 1500)
        }
      }, i * 700)
    })
  }, [isRunning])

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">
          Event Flow: Real-time Cache Invalidation
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
          {isRunning ? "Running..." : "▶ Trigger event"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {STEPS.map((step, i) => {
          const colors = colorMap[step.color]
          const isActive = i <= activeStep
          const isCurrent = i === activeStep

          return (
            <div key={step.label} className="flex items-stretch gap-3">
              {/* Step indicator */}
              <div className="flex w-6 flex-col items-center">
                <motion.div
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-colors duration-300",
                    isActive
                      ? `${colors.border} ${colors.bg}`
                      : "border-slate-700 bg-slate-800",
                  )}
                  animate={isCurrent ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 transition-colors duration-300",
                      isActive ? "bg-slate-600" : "bg-slate-800",
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <motion.div
                className={cn(
                  "mb-2 flex-1 rounded-lg border px-4 py-3 transition-all duration-300",
                  isActive
                    ? `${colors.border} ${colors.bg} shadow-lg ${colors.glow}`
                    : "border-slate-800 bg-slate-800/30",
                )}
                animate={isCurrent ? { x: [0, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        isActive ? colors.text : "text-slate-500",
                      )}
                    >
                      {step.label}
                    </span>
                    <span
                      className={cn(
                        "ml-2 text-xs transition-colors duration-300",
                        isActive ? "text-slate-400" : "text-slate-600",
                      )}
                    >
                      {step.sublabel}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 font-mono text-xs text-slate-400"
                  >
                    {step.json}
                  </motion.div>
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
