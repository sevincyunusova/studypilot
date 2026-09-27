"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0806] px-6 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-700/10 blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        <div className="rounded-3xl border border-white/[0.08] bg-[#15100d]/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-2xl text-amber-400 shadow-lg shadow-amber-950/20">
            !
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/70">
            StudyPilot
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            We couldn&apos;t load this page right now. Give it another try
            and you should be back to your study workspace.
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-7 w-full rounded-xl bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-950/20 transition hover:bg-amber-500 active:scale-[0.99]"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/"
            }}
            className="mt-3 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-3.5 text-sm font-medium text-slate-400 transition hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white"
          >
            Back to StudyPilot
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-600">
          Your study progress is safe. Try refreshing the workspace.
        </p>
      </div>
    </main>
  )
}