export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <div className="h-9 w-40 animate-pulse rounded-lg bg-slate-800" />
                        <div className="mt-3 h-4 w-56 animate-pulse rounded bg-slate-800" />
                    </div>

                    <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-800" />
                </div>

                <div className="mb-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-slate-800" />
                    <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-800" />
                </div>

                <section className="grid gap-5 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                        >
                            <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                            <div className="mt-3 h-9 w-16 animate-pulse rounded bg-slate-800" />
                            <div className="mt-3 h-3 w-32 animate-pulse rounded bg-slate-800" />
                        </div>
                    ))}
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                        >
                            <div className="h-6 w-48 animate-pulse rounded bg-slate-800" />
                            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-800" />

                            <div className="mt-8 h-3 w-full animate-pulse rounded-full bg-slate-800" />

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="h-20 animate-pulse rounded-lg bg-slate-950" />
                                <div className="h-20 animate-pulse rounded-lg bg-slate-950" />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <div className="h-6 w-52 animate-pulse rounded bg-slate-800" />
                    <div className="mt-6 h-12 w-full animate-pulse rounded-lg bg-slate-950" />
                    <div className="mt-4 h-20 w-full animate-pulse rounded-lg bg-slate-950" />
                    <div className="mt-4 h-20 w-full animate-pulse rounded-lg bg-slate-950" />
                </section>
            </div>
        </main>
    )
}