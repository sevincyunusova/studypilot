"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[100dvh] items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
                    !
                </div>

                <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                    Something went wrong
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    We couldn&apos;t load this page. Please try again.
                </p>

                <button
                    type="button"
                    onClick={() => reset()}
                    className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                    Try again
                </button>
            </div>
        </main>
    );
}