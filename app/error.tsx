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
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-950 text-2xl">
                    !
                </div>

                <h1 className="mt-5 text-2xl font-bold">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                    We couldn&apos;t load this page right now. Please try again.
                </p>

                <button
                    type="button"
                    onClick={reset}
                    className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
                >
                    Try again
                </button>
            </div>
        </main>
    )
}