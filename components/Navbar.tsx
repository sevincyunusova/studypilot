"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type ProfileData = {
    username?: string
    email?: string
    bio?: string
}

export default function Navbar() {
    const pathname = usePathname()

    const [profile, setProfile] = useState<ProfileData>({})
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [theme, setTheme] = useState<"dark" | "light">("dark")

    useEffect(() => {
        const readProfile = () => {
            const saved = localStorage.getItem("studypilot-profile")
            if (saved) {
                try {
                    setProfile(JSON.parse(saved))
                } catch {
                    localStorage.removeItem("studypilot-profile")
                }
            }
        }

        readProfile()

        const savedTheme = localStorage.getItem("studypilot-theme")
        setTheme(savedTheme === "light" ? "light" : "dark")

        window.addEventListener("studypilot-profile-updated", readProfile)
        window.addEventListener("storage", readProfile)

        return () => {
            window.removeEventListener("studypilot-profile-updated", readProfile)
            window.removeEventListener("storage", readProfile)
        }
    }, [])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const displayName = profile.username?.trim() || "Student"

    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    function toggleTheme() {
        const next = theme === "dark" ? "light" : "dark"
        setTheme(next)
        document.documentElement.classList.toggle("light", next === "light")
        document.documentElement.classList.toggle("dark", next === "dark")
        localStorage.setItem("studypilot-theme", next)
    }

    const isHome = pathname === "/"
    const isProfile = pathname === "/profile"

    return (
        <nav
            className={`sp-navbar sticky top-0 z-50 ${scrolled ? "sp-navbar-scrolled" : ""}`}
            aria-label="Main navigation"
        >
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-5 lg:gap-10">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <span className="sp-logo-badge relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
                            <span className="sp-logo-gradient absolute inset-0" />

                            <svg
                                className="relative z-10 h-5 w-5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 19V5" />
                                <path d="M4 5c5-2 10 2 16 0v14c-6 2-11-2-16 0" />
                                <path d="M8 8h8" />
                                <path d="M8 12h6" />
                            </svg>
                        </span>

                        <span className="text-xl font-bold tracking-[-0.04em] text-white">
                            Study<span className="text-violet-400">Pilot</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-slate-900/40 p-1 md:flex">
                        <Link
                            href="/"
                            className={`sp-nav-link relative rounded-xl px-4 py-2 text-sm font-medium transition ${isHome ? "sp-nav-link-active" : ""
                                }`}
                        >
                            Dashboard
                            {isHome && <span className="sp-nav-underline" />}
                        </Link>

                        <Link
                            href="/#ai-planner-heading"
                            className="sp-nav-link relative rounded-xl px-4 py-2 text-sm font-medium transition"
                        >
                            AI Planner
                        </Link>

                        <Link
                            href="/#study-scene-heading"
                            className="sp-nav-link relative rounded-xl px-4 py-2 text-sm font-medium transition"
                        >
                            Study Desk
                        </Link>

                        <Link
                            href="/profile"
                            className={`sp-nav-link relative rounded-xl px-4 py-2 text-sm font-medium transition ${isProfile ? "sp-nav-link-active" : ""
                                }`}
                        >
                            Profile
                            {isProfile && <span className="sp-nav-underline" />}
                        </Link>
                    </div>
                </div>

                <div className="relative flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                        }
                        title="Toggle theme"
                        className="sp-theme-toggle relative flex h-10 w-10 items-center justify-center rounded-full"
                    >
                        <svg
                            className={`sp-theme-icon ${theme === "dark" ? "sp-theme-icon-hidden" : ""}`}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                        </svg>

                        <svg
                            className={`sp-theme-icon ${theme === "light" ? "sp-theme-icon-hidden" : ""}`}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                        </svg>
                    </button>

                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold text-white">{displayName}</p>
                        <p className="text-xs text-slate-500">Study smarter</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowProfileMenu((previous) => !previous)}
                        className="sp-avatar-button group relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                        aria-label="Open profile menu"
                        aria-expanded={showProfileMenu}
                        title="Profile"
                    >
                        <span>{initials || "S"}</span>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
                    </button>

                    {showProfileMenu && (
                        <div className="sp-profile-menu absolute right-0 top-14 z-[100] w-[310px] overflow-hidden rounded-3xl">
                            <div className="relative overflow-hidden border-b border-[color:var(--border)] p-5">
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-600/10 blur-2xl" />

                                <div className="relative flex items-center gap-4">
                                    <div className="sp-avatar-badge flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white">
                                        {initials || "S"}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-white">
                                            {displayName}
                                        </p>

                                        <p className="mt-0.5 truncate text-sm text-slate-500">
                                            {profile.email || "Study smarter"}
                                        </p>

                                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                            Active learner
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                <Link
                                    href="/profile"
                                    onClick={() => setShowProfileMenu(false)}
                                    className="group flex items-center gap-3 rounded-2xl px-3 py-3.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                        <svg
                                            width="19"
                                            height="19"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 21a8 8 0 0 0-16 0" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </span>

                                    <span className="flex-1">
                                        <span className="block font-medium">View Profile</span>
                                        <span className="mt-0.5 block text-xs text-slate-500">
                                            Profile & personal information
                                        </span>
                                    </span>

                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Link>

                                <Link
                                    href="/profile#app-settings"
                                    onClick={() => setShowProfileMenu(false)}
                                    className="group flex items-center gap-3 rounded-2xl px-3 py-3.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                                        <svg
                                            width="19"
                                            height="19"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.4 1.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.5a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.4-1.4.06-.06A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.56-1.03H6v-2h1.04A1.7 1.7 0 0 0 8.6 10a1.7 1.7 0 0 0-.34-1.88L8.2 8.06l1.4-1.4.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.57 5.5V5h2v.5A1.7 1.7 0 0 0 15.6 7.06a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.4 1.4-.06.06A1.7 1.7 0 0 0 18.6 10a1.7 1.7 0 0 0 1.56 1.03H21v2h-.84A1.7 1.7 0 0 0 19.4 15Z" />
                                        </svg>
                                    </span>

                                    <span className="flex-1">
                                        <span className="block font-medium">Settings</span>
                                        <span className="mt-0.5 block text-xs text-slate-500">
                                            Appearance & preferences
                                        </span>
                                    </span>

                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-slate-600"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}