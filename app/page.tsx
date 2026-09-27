"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"

import AIChat from "@/components/AIChat"
import Navbar from "@/components/Navbar"

const StudyScene = dynamic(
  () => import("@/components/StudyScene"),
  {
    ssr: false,
    loading: () => (
      <div className="sp-panel mt-8 flex h-[300px] items-center justify-center rounded-3xl sm:h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
          <span className="text-sm text-slate-400">
            Loading 3D Study Desk...
          </span>
        </div>
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

type AiTask = {
  title: string
  subject: string
  deadline: string
  priority: string
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
  const [profile, setProfile] = useState<ProfileData>({})

  const [aiTasks, setAiTasks] = useState<AiTask[]>([])

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
      className="sp-page min-h-screen"
    >
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <header
          className="sp-hero relative mb-10 overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10"
          aria-labelledby="page-title"
        >
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-emerald-500/[0.08] blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/[0.08] px-3 py-1.5 text-xs font-medium text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                Personal study dashboard
              </div>

              <h1
                id="page-title"
                className="text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl"
              >
                {greeting},{" "}
                <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
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
                  className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition hover:-translate-y-0.5 hover:bg-amber-500 hover:shadow-amber-500/30"
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
                  className="sp-secondary-button inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold backdrop-blur transition"
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
              {[
                {
                  label: "Tasks",
                  value: tasks.length,
                  color: "amber",
                },
                {
                  label: "Done",
                  value: completedTasks,
                  color: "green",
                },
                {
                  label: "Upcoming",
                  value: upcomingTasks.length,
                  color: "orange",
                },
                {
                  label: "Progress",
                  value: `${progress}%`,
                  color: "rose",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="sp-hero-stat rounded-2xl p-4 backdrop-blur"
                >
                  <p className="text-xs text-slate-500">
                    {item.label}
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${item.color === "green"
                        ? "text-emerald-400"
                        : item.color === "orange"
                          ? "text-orange-400"
                          : item.color === "rose"
                            ? "text-rose-400"
                            : "text-amber-400"
                      }`}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section
          className="mb-10"
          aria-labelledby="overview-heading"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
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

          <div
            className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Study statistics"
          >
            {[
              {
                label: "Total Tasks",
                value: tasks.length,
                description: "All study tasks",
                icon: "layers",
                accent: "amber",
              },
              {
                label: "Completed",
                value: completedTasks,
                description: `${progress}% completion rate`,
                icon: "check",
                accent: "emerald",
              },
              {
                label: "Upcoming",
                value: upcomingTasks.length,
                description: "Upcoming deadlines",
                icon: "calendar",
                accent: "orange",
              },
              {
                label: "High Priority",
                value: highPriorityTasks,
                description: "Need your attention",
                icon: "bolt",
                accent: "pink",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                data-accent={stat.accent}
                className="sp-stat-card group relative overflow-hidden rounded-2xl p-5"
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

                  <span className="sp-stat-icon flex h-10 w-10 items-center justify-center rounded-xl">
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
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="17"
                          rx="2"
                        />
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

                <div className="sp-stat-glow absolute -bottom-12 -right-12 h-24 w-24 rounded-full blur-2xl transition" />
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          aria-label="Study overview details"
        >
          <div className="sp-panel rounded-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  Schedule
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Upcoming Deadlines
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your next study commitments.
                </p>
              </div>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                {upcomingTasks.length}
              </span>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700/80 bg-slate-950/30 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
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
                    className="sp-task-row group flex items-center justify-between gap-4 rounded-2xl p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xs font-bold text-amber-400">
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
                        className={`mt-1 text-xs font-medium ${getDeadlineStatus(
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

          <div className="sp-panel rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">
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
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="sp-mini-card rounded-2xl p-4">
                <p className="text-xs text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {completedTasks}
                </p>
              </div>

              <div className="sp-mini-card rounded-2xl p-4">
                <p className="text-xs text-slate-500">
                  Remaining
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-400">
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

        <section
          className="sp-panel mt-10 rounded-3xl p-5 sm:p-6"
          aria-labelledby="study-plan-heading"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
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
                className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500"
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
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${selectedSubject === item
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/15"
                      : "sp-filter-button"
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
                  className="sp-input w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition"
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
                      className={
                        taskStatus === status
                          ? "rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-600/15"
                          : "sp-filter-button rounded-xl px-4 py-2 text-sm font-medium"
                      }
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="sp-empty-state mt-6 rounded-2xl px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
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
                  className="mt-5 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500"
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
                  className="sp-outline-button mt-5 rounded-xl px-5 py-2.5 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div
              className="mt-6 space-y-3"
              aria-label="Study tasks"
            >
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="sp-task-row group flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center"
                >
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as completed`}
                    className="h-5 w-5 cursor-pointer accent-amber-600"
                  />

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold ${task.completed
                          ? "text-slate-500 line-through"
                          : "text-white"
                        }`}
                    >
                      {task.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="text-amber-400">
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
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${task.priority === "High"
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
                      className="sp-outline-button rounded-xl px-3 py-2 text-xs font-medium"
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

        <section
          className="sp-ai-planner relative mt-10 overflow-hidden rounded-3xl p-6 sm:p-8"
          aria-labelledby="ai-planner-heading"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
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
              className="sp-ai-button shrink-0 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition"
            >
              Generate Plan
            </button>
          </div>
        </section>

        <section
          className="sp-study-desk mt-10"
          aria-labelledby="study-scene-heading"
        >
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
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

        <section
          className="sp-chat mt-10"
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

        {showForm && (
          <div
            className="sp-modal-backdrop fixed inset-0 z-[200] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-dialog-title"
          >
            <div className="sp-modal w-full max-w-md rounded-3xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
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
                  className="sp-close-button rounded-xl p-2"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="sp-primary-button w-full rounded-xl py-3 font-semibold"
                >
                  {editingTask ? "Save Changes" : "Add Task"}
                </button>
              </form>
            </div>
          </div>
        )}

        {showAIForm && (
          <div
            className="sp-modal-backdrop fixed inset-0 z-[200] flex items-center justify-center px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-dialog-title"
          >
            <div className="sp-modal max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
                  className="sp-close-button rounded-xl p-2"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                    className="sp-input w-full rounded-xl px-4 py-3 outline-none"
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
                  className="sp-primary-button flex w-full items-center justify-center gap-3 rounded-xl py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
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
                    className="sp-ai-result mt-6 rounded-2xl p-5"
                    aria-live="polite"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
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

                    <div className="sp-ai-result-inner mt-5 rounded-2xl p-4">
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
                              className="sp-ai-task rounded-2xl p-4"
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
                                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${task.priority === "High"
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
                          className="sp-primary-button mt-5 w-full rounded-xl py-3 font-semibold"
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