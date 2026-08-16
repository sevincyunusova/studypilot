"use client"

import { useEffect, useState } from "react"

type Task = {
  id: number
  title: string
  subject: string
  deadline: string
  priority: string
  completed: boolean
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
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("studypilot-tasks", JSON.stringify(tasks))
  }, [tasks])

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

    setTasks([...tasks, newTask])
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

    setTasks(
      tasks.map((task) =>
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

    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
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
  const getDeadlineStatus = (deadline: string, completed: boolean) => {
    if (completed) {
      return {
        label: "Completed",
        className: "text-green-400",
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)

    if (deadlineDate < today) {
      return {
        label: "Overdue",
        className: "text-red-400",
      }
    }

    if (deadlineDate.getTime() === today.getTime()) {
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
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">          <div>
          <h1 className="text-3xl font-bold">
            StudyPilot
          </h1>

          <p className="mt-1 text-slate-400">
            Your AI-powered study planner
          </p>
        </div>

          <button
            onClick={() => {
              setEditingTask(null)
              setShowForm(true)
            }}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500 sm:w-auto"
          >
            + Add Task
          </button>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            Good morning!
          </h2>

          <p className="mt-2 text-slate-400">
            Here is your study overview for today.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-4">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Tasks
            </p>

            <p className="mt-2 text-3xl font-bold">
              {tasks.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              All your study tasks
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold">
              {completedTasks}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {progress}% completion rate
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Upcoming
            </p>

            <p className="mt-2 text-3xl font-bold">
              {upcomingTasks.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Tasks with upcoming deadlines
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              High Priority
            </p>

            <p className="mt-2 text-3xl font-bold">
              {highPriorityTasks}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Tasks requiring attention
            </p>
          </div>

        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Upcoming Deadlines
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Keep track of your next study deadlines.
                </p>
              </div>

              <span className="rounded-full bg-blue-950 px-3 py-1 text-xs text-blue-400">
                {upcomingTasks.length}
              </span>
            </div>

            {upcomingTasks.length === 0 ? (

              <div className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-center">
                <p className="text-sm text-slate-400">
                  No upcoming deadlines.
                </p>
              </div>

            ) : (

              <div className="mt-6 space-y-3">

                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4"
                  >

                    <div>
                      <h3 className="font-medium">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {task.subject}
                      </p>
                    </div>

                    <div className="text-right">

                      <p className="text-sm font-medium">
                        {task.deadline}
                      </p>

                      <p
                        className={`mt-1 text-xs font-medium ${getDeadlineStatus(task.deadline, task.completed).className
                          }`}
                      >
                        {getDeadlineStatus(task.deadline, task.completed).label}
                      </p>

                      <span
                        className={`text-xs ${task.priority === "High"
                          ? "text-red-400"
                          : task.priority === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                          }`}
                      >
                        {task.priority} priority
                      </span>

                    </div>

                  </div>
                ))}

              </div>

            )}

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <div>
              <h2 className="text-xl font-semibold">
                Study Progress
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your overall task completion progress.
              </p>
            </div>

            <div className="mt-8">

              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Overall progress
                </span>

                <span className="font-semibold">
                  {progress}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-lg bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  Completed
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {completedTasks}
                </p>
              </div>

              <div className="rounded-lg bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  Remaining
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {tasks.length - completedTasks}
                </p>
              </div>

            </div>

            {overdueTasks.length > 0 && (
              <div className="mt-5 rounded-lg border border-red-900 bg-red-950/30 p-4">
                <p className="text-sm font-medium text-red-400">
                  {overdueTasks.length} overdue task
                  {overdueTasks.length > 1 ? "s" : ""}
                </p>

                <p className="mt-1 text-xs text-red-400/70">
                  Review your deadlines and update your study plan.
                </p>
              </div>
            )}

          </div>

        </section>



        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <div className="space-y-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <h2 className="text-xl font-semibold">
                Today&apos;s Study Plan
              </h2>

              <div className="flex flex-wrap gap-2">

                {subjects.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedSubject(item)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${selectedSubject === item
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />

              <div className="grid grid-cols-3 gap-2 lg:flex">
                {["All", "Active", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setTaskStatus(status)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${taskStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                  >
                    {status}
                  </button>
                ))}

              </div>

            </div>

          </div>

          {filteredTasks.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-950 text-2xl">
                {tasks.length === 0 ? "📚" : "🔎"}
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {tasks.length === 0
                  ? "No study tasks yet"
                  : "No tasks found"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {tasks.length === 0
                  ? "Start organizing your studies by creating your first task."
                  : "Try changing your search, subject or status filter."}
              </p>

              {tasks.length === 0 && (
                <button
                  onClick={() => {
                    setEditingTask(null)
                    setShowForm(true)
                  }}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
                >
                  + Create your first task
                </button>
              )}

              {tasks.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setTaskStatus("All")
                    setSelectedSubject("All")
                  }}
                  className="mt-5 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
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
                  className="flex flex-col items-stretch gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:flex-wrap sm:items-center">

                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="h-5 w-5 cursor-pointer accent-blue-600"
                  />

                  <div className="min-w-[200px] flex-1">

                    <h3
                      className={`font-semibold ${task.completed
                        ? "text-slate-500 line-through"
                        : ""
                        }`}
                    >
                      {task.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">

                      <span className="text-slate-400">
                        {task.subject}
                      </span>

                      <span className="text-slate-600">
                        •
                      </span>

                      <span className="text-slate-400">
                        Deadline: {task.deadline}
                      </span>

                      <span
                        className={`font-medium ${getDeadlineStatus(task.deadline, task.completed).className
                          }`}
                      >
                        {getDeadlineStatus(task.deadline, task.completed).label}
                      </span>

                    </div>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${task.priority === "High"
                      ? "bg-red-950 text-red-400"
                      : task.priority === "Medium"
                        ? "bg-yellow-950 text-yellow-400"
                        : "bg-green-950 text-green-400"
                      }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => startEdit(task)}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

        <section className="mt-8 rounded-xl border border-blue-900 bg-blue-950/40 p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                AI Study Planner
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Let AI create a personalized study plan based on your goals.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAIForm(true)
                setAiError("")
              }}
              className="rounded-lg bg-white px-5 py-2.5 font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Generate Plan
            </button>

          </div>

        </section>

        {showForm && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                  {editingTask
                    ? "Edit Study Task"
                    : "Add Study Task"}
                </h2>

                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>

              </div>

              <div className="space-y-4">

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Task title
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Study React Hooks"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Subject
                  </label>

                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Web Development"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Deadline
                  </label>

                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <button
                  onClick={
                    editingTask
                      ? updateTask
                      : addTask
                  }
                  className="w-full rounded-lg bg-blue-600 py-3 font-medium transition hover:bg-blue-500"
                >
                  {editingTask
                    ? "Save Changes"
                    : "Add Task"}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

      {
        showAIForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    AI Study Planner
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Tell StudyPilot about your study goals.
                  </p>
                </div>

                <button
                  onClick={() => setShowAIForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">

                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Your study goal"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />

                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  placeholder="Study hours per day"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />

                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>

                <input
                  value={aiSubjects}
                  onChange={(e) => setAiSubjects(e.target.value)}
                  placeholder="Subjects: HTML, CSS, JavaScript, React"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />

                {aiError && (
                  <p className="rounded-lg bg-red-950 p-3 text-sm text-red-400">
                    {aiError}
                  </p>
                )}

                <button
                  onClick={generatePlan}
                  disabled={aiLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aiLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      <span>
                        Creating your study plan...
                      </span>
                    </>
                  ) : (
                    "Generate AI Study Plan"
                  )}
                </button>

                {aiPlan && (
                  <div className="mt-6 rounded-xl border border-blue-800 bg-slate-950 p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blue-600/20 px-2.5 py-1 text-xs font-medium text-blue-400">
                            AI Generated
                          </span>

                          <span className="text-xs text-slate-500">
                            StudyPilot
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold">
                          Your Personalized Study Plan
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          A study plan created based on your goals, level and available time.
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900 p-4">
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                        {aiPlan}
                      </p>
                    </div>

                    {aiTasks.length > 0 && (
                      <div className="mt-6">

                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold">
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
                              className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                            >

                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div className="min-w-0">
                                  <h5 className="font-medium">
                                    {task.title}
                                  </h5>

                                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                                    <span>{task.subject}</span>
                                    <span>Deadline: {task.deadline}</span>
                                  </div>
                                </div>

                                <span
                                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${task.priority === "High"
                                    ? "bg-red-950 text-red-400"
                                    : task.priority === "Medium"
                                      ? "bg-yellow-950 text-yellow-400"
                                      : "bg-green-950 text-green-400"
                                    }`}
                                >
                                  {task.priority}
                                </span>

                              </div>

                            </div>
                          ))}

                        </div>

                        <button
                          onClick={addAIPlanToTasks}
                          className="mt-5 w-full rounded-lg bg-blue-600 py-3 font-medium transition hover:bg-blue-500"
                        >
                          Add Plan to My Tasks
                        </button>

                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          </div>
        )
      }
    </main >
  )
}