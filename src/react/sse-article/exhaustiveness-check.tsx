import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/utils"

const BASE_VARIANTS = [
  { type: "todo.updated", field: "todoId: z.number()" },
  { type: "todo.completed", field: "todoId: z.number()" },
  { type: "user.assigned", field: "userId: z.number()" },
]

const NEW_VARIANT = { type: "todo.archived", field: "todoId: z.number()" }

const SWITCH_CASES = [
  { type: "todo.updated", body: "invalidate(['todo', id])" },
  { type: "todo.completed", body: "invalidate(['task', 'list'])" },
  { type: "user.assigned", body: "invalidate(['user', id])" },
]

export function ExhaustivenessCheck() {
  const [hasNewVariant, setHasNewVariant] = useState(false)

  const variants = hasNewVariant
    ? [...BASE_VARIANTS, NEW_VARIANT]
    : BASE_VARIANTS

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">
          Compile-time Exhaustiveness Checking
        </div>
        <button
          onClick={() => setHasNewVariant((v) => !v)}
          className={cn(
            "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
            hasNewVariant
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-green-500/20 text-green-400 hover:bg-green-500/30",
          )}
        >
          {hasNewVariant ? "Remove todo.archived" : "Add todo.archived"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Schema side */}
        <div>
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Zod Schema
          </div>
          <div className="rounded-lg border border-slate-800 bg-black/40 p-3 font-mono text-xs leading-relaxed">
            <div className="text-slate-500">
              {"z.discriminatedUnion("}
              <span className="text-orange-400/80">{'"type"'}</span>
              {", ["}
            </div>
            {variants.map((v, i) => (
              <motion.div
                key={v.type}
                initial={
                  i === variants.length - 1 && hasNewVariant
                    ? { opacity: 0, height: 0 }
                    : false
                }
                animate={{ opacity: 1, height: "auto" }}
                className="ml-2"
              >
                <span className="text-slate-500">{"z.object({ "}</span>
                <span className="text-purple-400/80">type</span>
                <span className="text-slate-500">{": z.literal("}</span>
                <span className="text-green-400/80">{`"${v.type}"`}</span>
                <span className="text-slate-500">{")"}</span>
                <span className="text-slate-600">{", "}</span>
                <span className="text-slate-400">{v.field}</span>
                <span className="text-slate-500">
                  {" })"}
                  {i < variants.length - 1 ? "," : ""}
                </span>
              </motion.div>
            ))}
            <div className="text-slate-500">{"])"}</div>
          </div>
        </div>

        {/* Switch side */}
        <div>
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Event Handler
          </div>
          <div className="rounded-lg border border-slate-800 bg-black/40 p-3 font-mono text-xs leading-relaxed">
            <div className="text-slate-500">
              {"switch ("}
              <span className="text-blue-400/80">event</span>
              {".type) {"}
            </div>
            {SWITCH_CASES.map((c) => (
              <div key={c.type} className="ml-2">
                <span className="text-purple-400/80">case </span>
                <span className="text-green-400/80">{`"${c.type}"`}</span>
                <span className="text-slate-500">{":\u00A0"}</span>
                <span className="text-slate-400">{c.body}</span>
              </div>
            ))}
            <div className="ml-2 mt-1">
              <span className="text-purple-400/80">default</span>
              <span className="text-slate-500">{": {"}</span>
            </div>
            <div className="relative ml-4">
              <span className="text-slate-500">{"const "}</span>
              <span className="text-blue-400/80">_ex</span>
              <span className="text-slate-500">{": "}</span>
              <span className="text-red-400/80">never</span>
              <span className="text-slate-500">{" = "}</span>
              <span className="text-blue-400/80">event</span>
              <AnimatePresence>
                {hasNewVariant && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-6 left-0 right-0"
                  >
                    <div className="flex items-start gap-1">
                      <span className="text-[10px] leading-none text-red-400">
                        ~~~~~
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="ml-2 text-slate-500">{"}"}</div>
            <div className="text-slate-500">{"}"}</div>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {hasNewVariant && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[11px] leading-relaxed text-red-400"
              >
                <div className="font-semibold">TS2322: Type error</div>
                <div className="mt-0.5 text-red-400/70">
                  Type '{'"'}todo.archived{'"'}' is not assignable to type
                  'never'.
                </div>
                <div className="mt-1 text-[10px] text-red-400/50">
                  Add a case for "todo.archived" to fix this error.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        {hasNewVariant
          ? "The new variant has no matching case — TypeScript catches it at compile time"
          : "All variants are handled — click the button to add a new one and see what happens"}
      </p>
    </div>
  )
}
