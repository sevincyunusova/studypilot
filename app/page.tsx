"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"

import AIChat from "@/components/AIChat"

const StudyScene = dynamic(
  () => import("@/components/StudyScene"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 flex h-[300px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 text-sm text-slate-400 sm:h-[400px]">
        Loading 3D Study Desk...
      </div>
    ),
  }
)

type Task = {
  id: number
  title: string
  subject: string
  deadline: string
  priority: string
  completed: boolean
}

type ProfileData = {
  username?: string
  email?: string
  bio?: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedSubject, setSelectedSubject] = useState("All")

  const [showAIForm, setShowAIForm] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPlan, setAiPlan] = useState("")
  const [aiError, setAiError] = useState("")

  const [goal, setGoal] = useState("")
  const [examDate, setExamDate] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState("")
  const [level, setLevel] = useState("Intermediate")
  const [aiSubjects, setAiSubjects] = useState("")

  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState("Medium")

  const [searchQuery, setSearchQuery] = useState("")
  const [taskStatus, setTaskStatus] = useState("All")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({})

  const [aiTasks, setAiTasks] = useState<
    {
      title: string
      subject: string
      deadline: string
      priority: string
    }[]
  >([])

  useEffect(() => {
    const savedTasks = localStorage.getItem("studypilot-tasks")

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch {
        localStorage.removeItem("studypilot-tasks")
      }
    }

    const savedProfile = localStorage.getItem("studypilot-profile")

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch {
        localStorage.removeItem("studypilot-profile")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("studypilot-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const startLocationTracking = async () => {
      if (!navigator.geolocation) return

      const permission = await Notification.requestPermission()

      if (permission !== "granted") {
        console.log("Notification permission denied.")
        return
      }

      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords

          console.log("Latitude:", latitude)
          console.log("Longitude:", longitude)
          console.log("Accuracy:", accuracy)

          await fetch("/api/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude,
              longitude,
              accuracy,
            }),
          })
        },
        (error) => {
          console.error(error.message)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      )

      return () => {
        navigator.geolocation.clearWatch(watchId)
      }
    }

    startLocationTracking()
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.")
      return
    }

    const allowLocation = window.confirm("")

    if (!allowLocation) {
      console.log("User denied location request.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Latitude:", position.coords.latitude)
        console.log("Longitude:", position.coords.longitude)
        console.log("Accuracy:", position.coords.accuracy)
      },
      (error) => {
        console.error("Geolocation error:", error.message)
      }
    )
  }, [])

  const displayName = profile.username?.trim() || "Student"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const resetForm = () => {
    setTitle("")
    setSubject("")
    setDeadline("")
    setPriority("Medium")
    setEditingTask(null)
    setShowForm(false)
  }

  const addTask = () => {
    if (!title || !subject || !deadline) return

    const newTask: Task = {
      id: Date.now(),
      title,
      subject,
      deadline,
      priority,
      completed: false,
    }

    setTasks((current) => [...current, newTask])
    resetForm()
  }

  const startEdit = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setSubject(task.subject)
    setDeadline(task.deadline)
    setPriority(task.priority)
    setShowForm(true)
  }

  const updateTask = () => {
    if (!editingTask || !title || !subject || !deadline) return

    setTasks((current) =>
      current.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title,
              subject,
              deadline,
              priority,
            }
          : task
      )
    )

    resetForm()
  }

  const deleteTask = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    )

    if (!confirmed) return

    setTasks((current) => current.filter((task) => task.id !== id))
  }

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const generatePlan = async () => {
    if (!goal.trim()) {
      setAiError("Please enter your study goal.")
      return
    }

    if (!examDate) {
      setAiError("Please select your exam date.")
      return
    }

    const selectedDate = new Date(examDate)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    if (selectedDate <= today) {
      setAiError("Exam date must be in the future.")
      return
    }

    const studyHours = Number(hoursPerDay)

    if (!hoursPerDay || Number.isNaN(studyHours)) {
      setAiError("Please enter your daily study hours.")
      return
    }

    if (studyHours < 1 || studyHours > 12) {
      setAiError("Study hours must be between 1 and 12 hours per day.")
      return
    }

    if (!aiSubjects.trim()) {
      setAiError("Please enter at least one subject.")
      return
    }

    try {
      setAiLoading(true)
      setAiError("")
      setAiPlan("")
      setAiTasks([])

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          examDate,
          hoursPerDay,
          level,
          subjects: aiSubjects,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.")
      }

      setAiPlan(data.plan)
      setAiTasks(data.tasks || [])
    } catch (error) {
      console.error("AI plan generation error:", error)

      const errorMessage =
        error instanceof Error
          ? error.message.toLowerCase()
          : ""

      if (
        errorMessage.includes("503") ||
        errorMessage.includes("unavailable") ||
        errorMessage.includes("high demand")
      ) {
        setAiError(
          "The AI service is temporarily busy. Please wait a moment and try again."
        )
      } else if (
        errorMessage.includes("429") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit")
      ) {
        setAiError(
          "The AI service has reached its usage limit. Please try again later."
        )
      } else {
        setAiError(
          "We couldn't generate your study plan right now. Please try again."
        )
      }
    } finally {
      setAiLoading(false)
    }
  }

  const addAIPlanToTasks = () => {
    setTasks((currentTasks) => {
      const newTasks: Task[] = aiTasks
        .filter(
          (aiTask) =>
            !currentTasks.some(
              (existingTask) =>
                existingTask.title.toLowerCase() ===
                  aiTask.title.toLowerCase() &&
                existingTask.subject.toLowerCase() ===
                  aiTask.subject.toLowerCase() &&
                existingTask.deadline === aiTask.deadline
            )
        )
        .map((task, index) => ({
          id: Date.now() + index,
          title: task.title,
          subject: task.subject,
          deadline: task.deadline,
          priority: task.priority,
          completed: false,
        }))

      return [...currentTasks, ...newTasks]
    })

    setShowAIForm(false)
    setAiTasks([])
    setAiPlan("")
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .filter((task) => {
      const deadline = new Date(task.deadline)
      return deadline >= today
    })
    .sort(
      (a, b) =>
        new Date(a.deadline).getTime() -
        new Date(b.deadline).getTime()
    )
    .slice(0, 3)

  const overdueTasks = tasks.filter((task) => {
    if (task.completed) return false

    const deadline = new Date(task.deadline)
    return deadline < today
  })

  const highPriorityTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.priority === "High"
  ).length

  const subjects = [
    "All",
    ...Array.from(new Set(tasks.map((task) => task.subject))),
  ]

  const filteredTasks = tasks.filter((task) => {
    const matchesSubject =
      selectedSubject === "All" ||
      task.subject === selectedSubject

    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.subject
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesStatus =
      taskStatus === "All" ||
      (taskStatus === "Active" && !task.completed) ||
      (taskStatus === "Completed" && task.completed)

    return (
      matchesSubject &&
      matchesSearch &&
      matchesStatus
    )
  })

  const getDeadlineStatus = (
    deadlineValue: string,
    completed: boolean
  ) => {
    if (completed) {
      return {
        label: "Completed",
        className: "text-green-400",
      }
    }

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const deadlineDate = new Date(deadlineValue)
    deadlineDate.setHours(0, 0, 0, 0)

    if (deadlineDate < currentDate) {
      return {
        label: "Overdue",
        className: "text-red-400",
      }
    }

    if (deadlineDate.getTime() === currentDate.getTime()) {
      return {
        label: "Due today",
        className: "text-yellow-400",
      }
    }

    return {
      label: "Upcoming",
      className: "text-slate-400",
    }
  }

  const greeting = useMemo(() => {
    const hour = new Date().getHours()

    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"

    return "Good evening"
  }, [])

  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-950 text-white"
    >
      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-5 lg:gap-10">
            <a
              href="#page-title"
              className="group flex items-center gap-2.5"
            >
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <span className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700" />

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
                Study<span className="text-blue-400">Pilot</span>
              </span>
            </a>

            <div className="hidden items-center gap-1 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-1 md:flex">
              <a
                href="#overview-heading"
                className="relative rounded-xl bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-600/15"
              >
                Dashboard

                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-blue-500" />
              </a>

              <a
                href="#ai-planner-heading"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
              >
                AI Planner
              </a>

              <a
                href="#study-scene-heading"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
              >
                Study Desk
              </a>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="text-xs text-slate-500">
                Study smarter
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowProfileMenu((previous) => !previous)
              }
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-blue-400/30 bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:scale-105 hover:border-blue-300/60 hover:shadow-blue-500/30"
              aria-label="Open profile menu"
              aria-expanded={showProfileMenu}
              title="Profile"
            >
              <span>{initials || "S"}</span>

              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-14 z-[100] w-[310px] overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/95 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                <div className="relative overflow-hidden border-b border-slate-800 p-5">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-600/10 blur-2xl" />

                  <div className="relative flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
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
                  <a
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-3.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/15">
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
                      <span className="block font-medium">
                        View Profile
                      </span>

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
                  </a>

                  <a
                    href="/profile#app-settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-3.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
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
                      <span className="block font-medium">
                        Settings
                      </span>

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
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* HERO */}
        <header
          className="relative mb-10 overflow-hidden rounded-[2rem] border border-blue-500/10 bg-gradient-to-br from-blue-600/[0.12] via-indigo-500/[0.06] to-transparent p-6 sm:p-8 lg:p-10"
          aria-labelledby="page-title"
        >
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-500/[0.08] blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5 text-xs font-medium text-blue-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                Personal study dashboard
              </div>

              <h1
                id="page-title"
                className="text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl"
              >
                {greeting},{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {displayName}
                </span>
                .
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Keep your tasks organized, track your progress, and let AI
                build a study plan around your goals.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null)
                    setShowForm(true)
                  }}
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
                >
                  <span className="text-lg leading-none transition group-hover:rotate-90">
                    +
                  </span>
                  Add task
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAIForm(true)
                    setAiError("")
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-slate-800/80"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
                    <path d="m19 15-.75 2.75L15.5 18.5l2.75.75L19 22l.75-2.75 2.75-.75-2.75-.75L19 15Z" />
                  </svg>
                  Generate with AI
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[430px]">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4 backdrop-blur">
                <p className="text-xs text-slate-500">Tasks</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {tasks.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4 backdrop-blur">
                <p className="text-xs text-slate-500">Done</p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {completedTasks}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4 backdrop-blur">
                <p className="text-xs text-slate-500">Upcoming</p>
                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {upcomingTasks.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4 backdrop-blur">
                <p className="text-xs text-slate-500">Progress</p>
                <p className="mt-2 text-2xl font-bold text-violet-400">
                  {progress}%
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* OVERVIEW */}
        <section
          className="mb-8"
          aria-labelledby="overview-heading"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Overview
              </p>

              <h2
                id="overview-heading"
                className="mt-2 text-2xl font-bold tracking-tight text-white"
              >
                Your study at a glance
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Everything important about your current workload.
              </p>
            </div>
          </div>
        </section>

        {/* STAT CARDS */}
        <section
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Study statistics"
        >
          {[
            {
              label: "Total Tasks",
              value: tasks.length,
              description: "All study tasks",
              icon: "layers",
              accent: "blue",
            },
            {
              label: "Completed",
              value: completedTasks,
              description: `${progress}% completion rate`,
              icon: "check",
              accent: "green",
            },
            {
              label: "Upcoming",
              value: upcomingTasks.length,
              description: "Upcoming deadlines",
              icon: "calendar",
              accent: "violet",
            },
            {
              label: "High Priority",
              value: highPriorityTasks,
              description: "Need your attention",
              icon: "bolt",
              accent: "orange",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/65 p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                </div>

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    stat.accent === "blue"
                      ? "bg-blue-500/10 text-blue-400"
                      : stat.accent === "green"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : stat.accent === "violet"
                          ? "bg-violet-500/10 text-violet-400"
                          : "bg-orange-500/10 text-orange-400"
                  }`}
                >
                  {stat.icon === "layers" && (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                      <path d="m3 12 9 5 9-5" />
                      <path d="m3 16 9 5 9-5" />
                    </svg>
                  )}

                  {stat.icon === "check" && (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}

                  {stat.icon === "calendar" && (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  )}

                  {stat.icon === "bolt" && (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
                    </svg>
                  )}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {stat.description}
              </p>

              <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-blue-500/[0.04] blur-2xl transition group-hover:bg-blue-500/[0.08]" />
            </div>
          ))}
        </section>

        {/* OVERVIEW DETAILS */}
        <section
          className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          aria-label="Study overview details"
        >
          {/* DEADLINES */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
                  Schedule
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Upcoming Deadlines
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your next study commitments.
                </p>
              </div>

              <span className="rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                {upcomingTasks.length}
              </span>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700/80 bg-slate-950/30 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>

                <p className="mt-4 text-sm font-medium text-slate-300">
                  No upcoming deadlines
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your schedule is clear for now.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/45 p-4 transition hover:border-blue-500/20 hover:bg-slate-950/70"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-bold text-blue-400">
                        {task.subject.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {task.title}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {task.subject}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-300">
                        {task.deadline}
                      </p>

                      <p
                        className={`mt-1 text-xs font-medium ${
                          getDeadlineStatus(
                            task.deadline,
                            task.completed
                          ).className
                        }`}
                      >
                        {
                          getDeadlineStatus(
                            task.deadline,
                            task.completed
                          ).label
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROGRESS */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-400">
              Performance
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Study Progress
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your overall completion rate.
            </p>

            <div className="mt-8">
              <div className="flex items-end justify-between">
                <span className="text-sm text-slate-500">
                  Overall progress
                </span>

                <span className="text-3xl font-bold text-white">
                  {progress}%
                </span>
              </div>

              <div
                className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Overall study progress"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
                <p className="text-xs text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {completedTasks}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
                <p className="text-xs text-slate-500">
                  Remaining
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {tasks.length - completedTasks}
                </p>
              </div>
            </div>

            {overdueTasks.length > 0 && (
              <div
                className="mt-4 rounded-2xl border border-red-900/60 bg-red-950/20 p-4"
                role="alert"
              >
                <p className="text-sm font-semibold text-red-400">
                  {overdueTasks.length} overdue task
                  {overdueTasks.length > 1 ? "s" : ""}
                </p>

                <p className="mt-1 text-xs text-red-400/70">
                  Review your deadlines and update your plan.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* TASKS */}
        <section
          className="mt-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm sm:p-6"
          aria-labelledby="study-plan-heading"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
                  Workspace
                </p>

                <h2
                  id="study-plan-heading"
                  className="mt-2 text-xl font-bold text-white"
                >
                  Today&apos;s Study Plan
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Manage and organize your study tasks.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingTask(null)
                  setShowForm(true)
                }}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                + Add task
              </button>
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter tasks by subject"
            >
              {subjects.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedSubject(item)}
                  aria-pressed={selectedSubject === item}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    selectedSubject === item
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                      : "border border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <label
                  htmlFor="task-search"
                  className="sr-only"
                >
                  Search tasks
                </label>

                <svg
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  id="task-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search tasks or subjects..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div
                className="grid grid-cols-3 gap-2 lg:flex"
                role="group"
                aria-label="Filter tasks by status"
              >
                {["All", "Active", "Completed"].map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setTaskStatus(status)}
                      aria-pressed={taskStatus === status}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        taskStatus === status
                          ? "bg-slate-700 text-white"
                          : "border border-slate-800 bg-slate-950/30 text-slate-500 hover:bg-slate-800/70 hover:text-slate-300"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                {tasks.length === 0 ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 19V5" />
                    <path d="M4 5c5-2 10 2 16 0v14c-6 2-11-2-16 0" />
                    <path d="M8 8h8M8 12h6" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>
                )}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {tasks.length === 0
                  ? "No study tasks yet"
                  : "No tasks found"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {tasks.length === 0
                  ? "Start organizing your studies by creating your first task."
                  : "Try changing your search, subject or status filter."}
              </p>

              {tasks.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null)
                    setShowForm(true)
                  }}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Create your first task
                </button>
              )}

              {tasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setTaskStatus("All")
                    setSelectedSubject("All")
                  }}
                  className="mt-5 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/35 p-4 transition hover:border-blue-500/20 hover:bg-slate-950/60 sm:flex-row sm:items-center"
                >
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as completed`}
                    className="h-5 w-5 cursor-pointer accent-blue-600"
                  />

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold ${
                        task.completed
                          ? "text-slate-500 line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="text-blue-400">
                        {task.subject}
                      </span>

                      <span className="text-slate-700">
                        •
                      </span>

                      <span className="text-slate-500">
                        Deadline: {task.deadline}
                      </span>

                      <span
                        className={
                          getDeadlineStatus(
                            task.deadline,
                            task.completed
                          ).className
                        }
                      >
                        {
                          getDeadlineStatus(
                            task.deadline,
                            task.completed
                          ).label
                        }
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                      task.priority === "High"
                        ? "bg-red-500/10 text-red-400"
                        : task.priority === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="rounded-xl border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="rounded-xl border border-red-900/50 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-950/50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI PLANNER */}
        <section
          className="relative mt-6 overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-600/[0.12] via-indigo-600/[0.08] to-violet-600/[0.06] p-6 sm:p-8"
          aria-labelledby="ai-planner-heading"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
                </svg>
                AI powered
              </div>

              <h2
                id="ai-planner-heading"
                className="text-2xl font-bold tracking-tight text-white"
              >
                Build a study plan that fits your goal.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Give StudyPilot your goal, deadline, available time and
                subjects. AI will turn them into an actionable study plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAIForm(true)
                setAiError("")
              }}
              className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl"
            >
              Generate Plan
            </button>
          </div>
        </section>

        {/* 3D STUDY DESK */}
        <section
          className="mt-6"
          aria-labelledby="study-scene-heading"
        >
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400">
              Focus space
            </p>

            <h2
              id="study-scene-heading"
              className="mt-2 text-xl font-bold text-white"
            >
              Your Study Desk
            </h2>
          </div>

          <div className="hidden sm:block">
            <StudyScene />
          </div>
        </section>

        {/* AI CHAT */}
        <section
          className="mt-6"
          aria-labelledby="ai-chat-heading"
        >
          <h2
            id="ai-chat-heading"
            className="sr-only"
          >
            AI Study Assistant
          </h2>

          <AIChat />
        </section>

        {/* TASK MODAL */}
        {showForm && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-dialog-title"
          >
            <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900 p-6 shadow-2xl shadow-black/40">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
                    Workspace
                  </p>

                  <h2
                    id="task-dialog-title"
                    className="mt-1 text-xl font-bold text-white"
                  >
                    {editingTask
                      ? "Edit Study Task"
                      : "Add Study Task"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  aria-label="Close task dialog"
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()

                  if (editingTask) {
                    updateTask()
                  } else {
                    addTask()
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="task-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Task title
                  </label>

                  <input
                    id="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Study React Hooks"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-subject"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Subject
                  </label>

                  <input
                    id="task-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Web Development"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-deadline"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Deadline
                  </label>

                  <input
                    id="task-deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-priority"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Priority
                  </label>

                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                  {editingTask ? "Save Changes" : "Add Task"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* AI MODAL */}
        {showAIForm && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-dialog-title"
          >
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-700/70 bg-slate-900 p-6 shadow-2xl shadow-black/40">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    AI Planner
                  </div>

                  <h2
                    id="ai-dialog-title"
                    className="text-xl font-bold text-white"
                  >
                    Create your study plan
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell StudyPilot what you want to achieve.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAIForm(false)}
                  aria-label="Close AI study planner"
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  generatePlan()
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="study-goal"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Study goal
                  </label>

                  <input
                    id="study-goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Prepare for my React exam"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="exam-date"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Exam date
                  </label>

                  <input
                    id="exam-date"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="study-hours"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Study hours per day
                  </label>

                  <input
                    id="study-hours"
                    type="number"
                    min="1"
                    max="12"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="study-level"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Current level
                  </label>

                  <select
                    id="study-level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ai-subjects"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Subjects
                  </label>

                  <input
                    id="ai-subjects"
                    value={aiSubjects}
                    onChange={(e) => setAiSubjects(e.target.value)}
                    placeholder="HTML, CSS, JavaScript, React"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {aiError && (
                  <p
                    className="rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-400"
                    role="alert"
                  >
                    {aiError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={aiLoading}
                  aria-busy={aiLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aiLoading ? (
                    <>
                      <span
                        className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                        aria-hidden="true"
                      />

                      Creating your study plan...
                    </>
                  ) : (
                    "Generate AI Study Plan"
                  )}
                </button>

                {aiPlan && (
                  <div
                    className="mt-6 rounded-2xl border border-blue-500/15 bg-slate-950/60 p-5"
                    aria-live="polite"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                        AI Generated
                      </span>

                      <span className="text-xs text-slate-600">
                        StudyPilot
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-white">
                      Your Personalized Study Plan
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Generated from your goals, level and available time.
                    </p>

                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                        {aiPlan}
                      </p>
                    </div>

                    {aiTasks.length > 0 && (
                      <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            Recommended Tasks
                          </h4>

                          <span className="text-xs text-slate-500">
                            {aiTasks.length} tasks
                          </span>
                        </div>

                        <div className="space-y-3">
                          {aiTasks.map((task, index) => (
                            <div
                              key={index}
                              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                  <h5 className="font-medium text-white">
                                    {task.title}
                                  </h5>

                                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                    <span>{task.subject}</span>

                                    <span>
                                      Deadline: {task.deadline}
                                    </span>
                                  </div>
                                </div>

                                <span
                                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                                    task.priority === "High"
                                      ? "bg-red-500/10 text-red-400"
                                      : task.priority === "Medium"
                                        ? "bg-yellow-500/10 text-yellow-400"
                                        : "bg-emerald-500/10 text-emerald-400"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addAIPlanToTasks}
                          className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500"
                        >
                          Add Plan to My Tasks
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}