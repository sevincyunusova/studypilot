export default function Loading() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#0b0806] text-white">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-orange-700/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <div className="h-9 w-40 animate-pulse rounded-xl bg-white/[0.07]" />
                        <div className="mt-3 h-4 w-56 animate-pulse rounded-lg bg-white/[0.05]" />
                    </div>

                    <div className="h-10 w-32 animate-pulse rounded-xl bg-white/[0.07]" />
                </div>

                <div className="mb-8">
                    <div className="h-8 w-48 animate-pulse rounded-xl bg-white/[0.07]" />
                    <div className="mt-3 h-4 w-72 animate-pulse rounded-lg bg-white/[0.05]" />
                </div>

                <section className="grid gap-5 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-white/[0.07] bg-[#15100d]/90 p-6 shadow-xl shadow-black/10"
                        >
                            <div className="h-4 w-24 animate-pulse rounded-lg bg-white/[0.07]" />
                            <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-white/[0.09]" />
                            <div className="mt-3 h-3 w-32 animate-pulse rounded bg-white/[0.05]" />
                        </div>
                    ))}
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-3xl border border-white/[0.07] bg-[#15100d]/90 p-6 shadow-xl shadow-black/10"
                        >
                            <div className="h-6 w-48 animate-pulse rounded-lg bg-white/[0.08]" />
                            <div className="mt-3 h-4 w-64 animate-pulse rounded-lg bg-white/[0.05]" />

                            <div className="mt-8 h-3 w-full animate-pulse rounded-full bg-white/[0.06]" />

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="h-20 animate-pulse rounded-xl bg-[#0d0a08]" />
                                <div className="h-20 animate-pulse rounded-xl bg-[#0d0a08]" />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-8 rounded-3xl border border-white/[0.07] bg-[#15100d]/90 p-6 shadow-xl shadow-black/10">
                    <div className="h-6 w-52 animate-pulse rounded-lg bg-white/[0.08]" />

                    <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-[#0d0a08]" />

                    <div className="mt-4 h-20 w-full animate-pulse rounded-xl bg-[#0d0a08]" />

                    <div className="mt-4 h-20 w-full animate-pulse rounded-xl bg-[#0d0a08]" />
                </section>
            </div>
        </main>
    )
}