"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type ProfileData = {
  username: string
  fullName: string
  email: string
  university: string
  bio: string
}

type NotificationSettings = {
  taskReminders: boolean
  deadlineAlerts: boolean
  studyProgress: boolean
  aiUpdates: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    username: "Student",
    fullName: "",
    email: "",
    university: "",
    bio: "",
  })

  const [notifications, setNotifications] =
    useState<NotificationSettings>({
      taskReminders: true,
      deadlineAlerts: true,
      studyProgress: true,
      aiUpdates: false,
    })

  const [activeSection, setActiveSection] = useState("personal")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("studypilot-profile")
      const savedNotifications =
        localStorage.getItem("studypilot-notifications")

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      }

      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      }
    } catch (error) {
      console.error("Failed to load profile settings:", error)
    }
  }, [])

  const saveProfile = () => {
    localStorage.setItem("studypilot-profile", JSON.stringify(profile))
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2000)
  }

  const saveNotifications = (
    updatedSettings: NotificationSettings
  ) => {
    setNotifications(updatedSettings)
    localStorage.setItem(
      "studypilot-notifications",
      JSON.stringify(updatedSettings)
    )
  }

  const handleProfileImage = () => {
    alert(
      "Profile picture upload will be connected to storage later."
    )
  }

  const sections = [
    {
      id: "personal",
      label: "Personal Info",
      description: "Manage your personal information",
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Choose what notifications you receive",
    },
    {
      id: "password",
      label: "Password",
      description: "Update your account password",
    },
    {
      id: "app-settings",
      label: "App Settings",
      description: "Customize your StudyPilot experience",
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                StudyPilot
              </h1>
              <p className="text-xs text-slate-500">
                Student dashboard
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            Account
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Profile Settings
          </h2>

          <p className="mt-2 text-slate-400">
            Manage your profile and StudyPilot preferences.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-3">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`mb-1 w-full rounded-xl px-4 py-3 text-left transition ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <p className="text-sm font-semibold">
                  {section.label}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    activeSection === section.id
                      ? "text-blue-100"
                      : "text-slate-500"
                  }`}
                >
                  {section.description}
                </p>
              </button>
            ))}
          </aside>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:p-8">
            {activeSection === "personal" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Update the information associated with your
                    StudyPilot profile.
                  </p>
                </div>

                <div className="mb-8 flex items-center gap-5">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                      {profile.username
                        ? profile.username
                            .charAt(0)
                            .toUpperCase()
                        : "S"}
                    </div>

                    <button
                      type="button"
                      onClick={handleProfileImage}
                      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-slate-900 bg-white text-slate-900 shadow-lg transition hover:bg-slate-200"
                      aria-label="Edit profile picture"
                    >
                      ✎
                    </button>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {profile.username || "Student"}
                    </h4>

                    <p className="text-sm text-slate-500">
                      StudyPilot account
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Username
                    </label>

                    <input
                      type="text"
                      value={profile.username}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          username: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                      placeholder="Your username"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          fullName: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Email
                    </label>

                    <input
                      type="email"
                      value={profile.email}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          email: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      University
                    </label>

                    <input
                      type="text"
                      value={profile.university}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          university: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                      placeholder="Your university"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Bio
                  </label>

                  <textarea
                    value={profile.bio}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        bio: event.target.value,
                      })
                    }
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    placeholder="Tell something about yourself..."
                  />
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={saveProfile}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Save Changes
                  </button>

                  {saved && (
                    <span className="text-sm font-medium text-emerald-400">
                      Changes saved successfully.
                    </span>
                  )}
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">
                    Notifications
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Control which StudyPilot notifications you want
                    to receive.
                  </p>
                </div>

                <div className="space-y-4">
                  <NotificationToggle
                    title="Task Reminders"
                    description="Receive reminders about your upcoming study tasks."
                    enabled={notifications.taskReminders}
                    onChange={(enabled) =>
                      saveNotifications({
                        ...notifications,
                        taskReminders: enabled,
                      })
                    }
                  />

                  <NotificationToggle
                    title="Deadline Alerts"
                    description="Get notified when an important deadline is approaching."
                    enabled={notifications.deadlineAlerts}
                    onChange={(enabled) =>
                      saveNotifications({
                        ...notifications,
                        deadlineAlerts: enabled,
                      })
                    }
                  />

                  <NotificationToggle
                    title="Study Progress"
                    description="Receive updates about your study progress and completed tasks."
                    enabled={notifications.studyProgress}
                    onChange={(enabled) =>
                      saveNotifications({
                        ...notifications,
                        studyProgress: enabled,
                      })
                    }
                  />

                  <NotificationToggle
                    title="AI Updates"
                    description="Receive updates about AI planner improvements and features."
                    enabled={notifications.aiUpdates}
                    onChange={(enabled) =>
                      saveNotifications({
                        ...notifications,
                        aiUpdates: enabled,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {activeSection === "password" && (
              <PasswordSection />
            )}

            {activeSection === "app-settings" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">
                    App Settings
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Customize how StudyPilot looks and behaves.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h4 className="font-semibold text-white">
                        Display Settings
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Choose between light and dark appearance.
                      </p>
                    </div>

                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                      Coming next
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled
                      className="rounded-xl border border-blue-500/50 bg-blue-500/10 p-4 text-left opacity-90"
                    >
                      <p className="font-semibold text-white">
                        Dark
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Current appearance
                      </p>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left opacity-50"
                    >
                      <p className="font-semibold text-white">
                        Light
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Will be enabled in the next step
                      </p>
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <h4 className="font-semibold text-red-400">
                    Profile Data
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Your profile preferences are currently stored
                    locally in your browser.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to clear your local StudyPilot profile settings?"
                      )

                      if (!confirmed) return

                      localStorage.removeItem(
                        "studypilot-profile"
                      )

                      localStorage.removeItem(
                        "studypilot-notifications"
                      )

                      window.location.reload()
                    }}
                    className="mt-4 rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                  >
                    Clear Local Profile Data
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function NotificationToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div>
        <h4 className="font-semibold text-white">{title}</h4>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-700"
        }`}
        aria-label={`${title} ${enabled ? "enabled" : "disabled"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  )
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")

  const handlePasswordUpdate = () => {
    setMessage("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields.")
      return
    }

    if (newPassword.length < 8) {
      setMessage(
        "New password must contain at least 8 characters."
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.")
      return
    }

    setMessage(
      "Password form validated. Connect this section to Supabase Auth when authentication is enabled."
    )

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white">
          Password
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Update your password securely.
        </p>
      </div>

      <div className="max-w-xl space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Confirm New Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handlePasswordUpdate}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Update Password
        </button>

        {message && (
          <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}