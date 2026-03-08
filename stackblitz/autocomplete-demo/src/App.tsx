import { AutocompleteExample } from "./components/autocomplete-example"

export default function App() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-slate-950">
      <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Frozen article demo
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Autocomplete component with Shadcn UI
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Minimal Vite reproduction of the article demo, isolated from the main
          site.
        </p>
        <AutocompleteExample />
      </div>
    </main>
  )
}
