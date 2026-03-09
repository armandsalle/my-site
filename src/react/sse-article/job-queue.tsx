import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

type JobStatus = "waiting" | "active" | "completed" | "failed" | "retrying"

type Job = {
  id: number
  name: string
  status: JobStatus
  attempt: number
}

const JOB_NAMES = [
  "sendEmail",
  "generatePDF",
  "processImage",
  "syncCalendar",
  "notifySlack",
  "recalcStatus",
]

const statusColors: Record<JobStatus, { bg: string; ring: string }> = {
  waiting: { bg: "bg-slate-400", ring: "ring-slate-400/30" },
  active: { bg: "bg-blue-400", ring: "ring-blue-400/30" },
  completed: { bg: "bg-green-400", ring: "ring-green-400/30" },
  failed: { bg: "bg-red-400", ring: "ring-red-400/30" },
  retrying: { bg: "bg-orange-400", ring: "ring-orange-400/30" },
}

export function JobQueue() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [concurrency, setConcurrency] = useState(2)
  const [speed, setSpeed] = useState(1)
  const nextIdRef = useRef(0)

  const addJob = useCallback(() => {
    const id = nextIdRef.current++
    const name = JOB_NAMES[id % JOB_NAMES.length]
    setJobs((prev) => [
      ...prev,
      { id, name: name!, status: "waiting", attempt: 1 },
    ])
  }, [])

  // Process jobs
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) => {
        const activeCount = prev.filter((j) => j.status === "active").length
        const slotsAvailable = concurrency - activeCount

        if (slotsAvailable <= 0) return prev

        let slotsUsed = 0
        return prev.map((job) => {
          if (
            slotsUsed < slotsAvailable &&
            (job.status === "waiting" || job.status === "retrying")
          ) {
            slotsUsed++
            return { ...job, status: "active" as const }
          }
          return job
        })
      })
    }, 700 / speed)
    return () => clearInterval(interval)
  }, [concurrency, speed])

  // Complete active jobs after a delay
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) => {
          if (job.status !== "active") return job

          // 20% chance of failure on first attempt
          if (job.attempt === 1 && Math.random() < 0.2) {
            return { ...job, status: "failed" as const }
          }

          return { ...job, status: "completed" as const }
        }),
      )
    }, 2000 / speed)
    return () => clearInterval(interval)
  }, [speed])

  // Retry failed jobs after a delay
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) => {
          if (job.status === "failed") {
            return {
              ...job,
              status: "retrying" as const,
              attempt: job.attempt + 1,
            }
          }
          return job
        }),
      )
    }, 2500 / speed)
    return () => clearInterval(interval)
  }, [speed])

  // Clean up completed jobs after a delay
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) => {
        const completed = prev.filter((j) => j.status === "completed")
        if (completed.length > 5) {
          const toRemove = new Set(
            completed.slice(0, completed.length - 5).map((j) => j.id),
          )
          return prev.filter((j) => !toRemove.has(j.id))
        }
        return prev
      })
    }, 3000 / speed)
    return () => clearInterval(interval)
  }, [speed])

  const waitingCount = jobs.filter(
    (j) => j.status === "waiting" || j.status === "retrying",
  ).length
  const activeCount = jobs.filter((j) => j.status === "active").length
  const completedCount = jobs.filter((j) => j.status === "completed").length
  const failedCount = jobs.filter((j) => j.status === "failed").length

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">
          BullMQ Job Queue
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300"
            >
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Workers</label>
            <select
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={addJob}
          className="rounded-lg bg-blue-500/20 px-4 py-2 text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-500/30"
        >
          + Add job
        </button>
        <button
          onClick={() => {
            addJob()
            addJob()
            addJob()
          }}
          className="rounded-lg bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-500/20"
        >
          + Add 3 jobs
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-slate-400" />
          <span className="text-slate-400">Waiting: {waitingCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-slate-400">Active: {activeCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-slate-400">Done: {completedCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <span className="text-slate-400">Failed: {failedCount}</span>
        </div>
      </div>

      {/* Queue visualization */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        {jobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-600">
            Click "Add job" to start
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {jobs.map((job) => {
                const colors = statusColors[job.status]
                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border border-slate-700/50 px-3 py-2",
                      job.status === "active" &&
                        "border-blue-500/30 bg-blue-500/5",
                      job.status === "completed" &&
                        "border-green-500/30 bg-green-500/5",
                      job.status === "failed" &&
                        "border-red-500/30 bg-red-500/5",
                      job.status === "retrying" &&
                        "border-orange-500/30 bg-orange-500/5",
                    )}
                  >
                    <motion.div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full ring-2",
                        colors.bg,
                        colors.ring,
                      )}
                      animate={
                        job.status === "active"
                          ? { scale: [1, 1.3, 1] }
                          : { scale: 1 }
                      }
                      transition={
                        job.status === "active"
                          ? {
                              repeat: Infinity,
                              duration: 1.2,
                              ease: "easeInOut",
                            }
                          : { duration: 0.4 }
                      }
                    />
                    <span className="font-mono text-[10px] text-slate-400">
                      {job.name}
                      {job.attempt > 1 && (
                        <span className="ml-1 text-orange-400">
                          ×{job.attempt}
                        </span>
                      )}
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
