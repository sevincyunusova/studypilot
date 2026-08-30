"use client";

import { useEffect } from "react";

export default function ErrorTestPage() {
    useEffect(() => {
        throw new Error("TEST_ROUTE_ERROR");
    }, []);

    return (
        <main className="flex min-h-[100dvh] items-center justify-center bg-slate-950 px-6 text-white">
            <p>Loading...</p>
        </main>
    );
}