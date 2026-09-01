"use client";

import { useEffect, useRef, useState } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

export default function MicroInteractionsPage() {
    const [state, setState] = useState<ButtonState>("idle");
    const [isFocused, setIsFocused] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    function runAction(forceError = false) {
        if (state === "loading") {
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setState("loading");

        const delay = 900 + Math.random() * 1000;

        timeoutRef.current = setTimeout(() => {
            const shouldFail = forceError || Math.random() < 0.2;

            setState(shouldFail ? "error" : "success");

            if (!shouldFail) {
                timeoutRef.current = setTimeout(() => {
                    setState("idle");
                }, 1400);
            }
        }, delay);
    }

    function handleRetry() {
        runAction();
    }

    const buttonLabel = {
        idle: "Send message",
        loading: "Sending...",
        success: "Sent",
        error: "Retry",
    }[state];

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
            <div className="mx-auto max-w-2xl">
                <div className="text-center">
                    <p className="text-sm font-medium text-blue-400">
                        FE-AA1 · Micro-interactions
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Buttons with a Brain
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                        A stateful button that communicates idle, loading, success, and
                        error states through intentional motion.
                    </p>
                </div>

                <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-10">
                    <div className="flex min-h-48 flex-col items-center justify-center">
                        <button
                            type="button"
                            disabled={state === "loading"}
                            onClick={() => runAction()}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className={`
                motion-safe:transition-all motion-safe:duration-300
                motion-safe:ease-out
                inline-flex min-w-40 items-center justify-center gap-2
                rounded-xl px-6 py-3.5 text-sm font-semibold
                shadow-lg outline-none
                ${state === "idle"
                                    ? "bg-blue-600 text-white hover:scale-[1.03] hover:bg-blue-500 active:scale-[0.98]"
                                    : ""
                                }
                ${state === "loading"
                                    ? "cursor-wait bg-blue-500 text-white"
                                    : ""
                                }
                ${state === "success"
                                    ? "bg-emerald-600 text-white"
                                    : ""
                                }
                ${state === "error"
                                    ? "animate-[shake_0.45s_ease-in-out] bg-red-600 text-white hover:bg-red-500"
                                    : ""
                                }
                ${isFocused
                                    ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900"
                                    : ""
                                }
                disabled:cursor-not-allowed
              `}
                        >
                            <span
                                className={`
                  inline-flex items-center justify-center
                  transition-all duration-200 ease-out
                  ${state === "loading"
                                        ? "animate-spin"
                                        : ""
                                    }
                `}
                                aria-hidden="true"
                            >
                                {state === "loading" && (
                                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />
                                )}

                                {state === "success" && (
                                    <span className="text-base">✓</span>
                                )}

                                {state === "error" && (
                                    <span className="text-base">↻</span>
                                )}
                            </span>

                            <span
                                className="transition-opacity duration-200 ease-out"
                                key={buttonLabel}
                            >
                                {buttonLabel}
                            </span>
                        </button>

                        <p className="mt-5 text-xs text-slate-500">
                            Current state:{" "}
                            <span className="font-medium capitalize text-slate-300">
                                {state}
                            </span>
                        </p>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => runAction(false)}
                            disabled={state === "loading"}
                            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Simulate Success
                        </button>

                        <button
                            type="button"
                            onClick={() => runAction(true)}
                            disabled={state === "loading"}
                            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-red-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Simulate Error
                        </button>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-sm font-semibold text-white">
                        Motion decisions
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Transitions use short 200–300ms durations for immediate feedback,
                        with ease-out for entering states and ease-in-out for the error
                        shake. Transform and opacity-based motion keeps animations
                        compositor-friendly. Reduced-motion users receive the same state
                        feedback with decorative motion reduced or removed.
                    </p>
                </section>
            </div>

            <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }

          20% {
            transform: translateX(-5px);
          }

          40% {
            transform: translateX(5px);
          }

          60% {
            transform: translateX(-4px);
          }

          80% {
            transform: translateX(4px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
        </main>
    );
}