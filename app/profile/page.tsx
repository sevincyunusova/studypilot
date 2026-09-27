"use client"

import { useEffect, useState } from "react"

import Navbar from "@/components/Navbar"

type ProfileData = {
  username?: string
  email?: string
  bio?: string
}

type Task = {
  id: number
  completed: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({})
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [saved, setSaved] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [taskCount, setTaskCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const savedProfile = localStorage.getItem("studypilot-profile")

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as ProfileData
        setProfile(parsed)
        setUsername(parsed.username || "")
        setEmail(parsed.email || "")
        setBio(parsed.bio || "")
      } catch {
        localStorage.removeItem("studypilot-profile")
      }
    }

    const savedTheme = localStorage.getItem("studypilot-theme")
    setTheme(savedTheme === "light" ? "light" : "dark")

    const savedTasks = localStorage.getItem("studypilot-tasks")

    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks) as Task[]
        setTaskCount(tasks.length)
        setCompletedCount(tasks.filter((task) => task.completed).length)
      } catch {
        // ignore malformed data
      }
    }
  }, [])

  function saveProfile(event: React.FormEvent) {
    event.preventDefault()

    const updated: ProfileData = {
      username: username.trim(),
      email: email.trim(),
      bio: bio.trim(),
    }

    localStorage.setItem("studypilot-profile", JSON.stringify(updated))
    setProfile(updated)

    window.dispatchEvent(new Event("studypilot-profile-updated"))

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function applyTheme(next: "dark" | "light") {
    setTheme(next)
    document.documentElement.classList.toggle("light", next === "light")
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.setItem("studypilot-theme", next)
  }

  const displayName = profile.username?.trim() || "Student"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const progress =
    taskCount === 0 ? 0 : Math.round((completedCount / taskCount) * 100)

  return (
    <main className="sp-page min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <section
          className="sp-profile-hero relative mb-8 overflow-hidden rounded-[2rem] p-6 sm:p-8"
          aria-labelledby="profile-title"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-teal-500/[0.08] blur-3xl" />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="sp-profile-avatar-xl flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-2xl font-bold text-white sm:h-24 sm:w-24 sm:text-3xl">
              {initials || "S"}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                Profile
              </p>

              <h1
                id="profile-title"
                className="mt-1 truncate text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                {displayName}
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                {profile.email || "Add your email to personalize your account"}
              </p>

              {profile.bio && (
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
            <div className="sp-mini-card rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500">Tasks</p>
              <p className="mt-2 text-xl font-bold text-white">{taskCount}</p>
            </div>

            <div className="sp-mini-card rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500">Done</p>
              <p className="mt-2 text-xl font-bold text-emerald-400">
                {completedCount}
              </p>
            </div>

            <div className="sp-mini-card rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500">Progress</p>
              <p className="mt-2 text-xl font-bold text-fuchsia-400">
                {progress}%
              </p>
            </div>
          </div>
        </section>

        <section
          className="sp-panel rounded-3xl p-6 sm:p-8"
          aria-labelledby="edit-profile-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-400">
            Personal information
          </p>

          <h2
            id="edit-profile-heading"
            className="mt-2 text-xl font-bold text-white"
          >
            Edit Profile
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            This information is stored locally on this device.
          </p>

          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="profile-username"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Username
              </label>

              <input
                id="profile-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Sevinc"
                className="sp-input w-full rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="sp-input w-full rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Bio
              </label>

              <textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="A short note about your study goals..."
                className="sp-input w-full resize-none rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="sp-primary-button rounded-xl px-6 py-3 font-semibold"
              >
                Save Changes
              </button>

              {saved && (
                <span className="text-sm font-medium text-emerald-400">
                  Saved ✓
                </span>
              )}
            </div>
          </form>
        </section>

        <section
          id="app-settings"
          className="sp-panel mt-6 scroll-mt-24 rounded-3xl p-6 sm:p-8"
          aria-labelledby="settings-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-400">
            Preferences
          </p>

          <h2
            id="settings-heading"
            className="mt-2 text-xl font-bold text-white"
          >
            Appearance
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Choose how StudyPilot looks on this device.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
            <button
              type="button"
              onClick={() => applyTheme("dark")}
              className={`sp-theme-option flex flex-col items-center gap-2 rounded-2xl px-4 py-5 ${
                theme === "dark" ? "sp-theme-option-active" : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
              <span className="text-sm font-medium text-white">Dark</span>
            </button>

            <button
              type="button"
              onClick={() => applyTheme("light")}
              className={`sp-theme-option flex flex-col items-center gap-2 rounded-2xl px-4 py-5 ${
                theme === "light" ? "sp-theme-option-active" : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              <span className="text-sm font-medium text-white">Light</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}