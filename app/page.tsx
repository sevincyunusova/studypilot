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
    if (
      !goal ||
      !examDate ||
      !hoursPerDay ||
      !level ||
      !aiSubjects
    ) {
      setAiError("Please complete all fields.")
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
      console.error(error)

      setAiError(
        "Failed to generate your study plan. Please try again."
      )
    } finally {
      setAiLoading(false)
    }
  }

  const addAIPlanToTasks = () => {
    if (aiTasks.length === 0) {
      return
    }

    setTasks((currentTasks) => {
      const existingTasks = new Set(
        currentTasks.map(
          (task) =>
            `${task.title.toLowerCase()}-${task.subject.toLowerCase()}`
        )
      )

      const newTasks: Task[] = aiTasks
        .filter((task) => {
          const taskKey =
            `${task.title.toLowerCase()}-${task.subject.toLowerCase()}`

          return !existingTasks.has(taskKey)
        })
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
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <header className="mb-10 flex items-center justify-between">
          <div>
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
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
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

            <div className="flex flex-col gap-3 md:flex-row">

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />

              <div className="flex gap-2">

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

            <div className="mt-6 rounded-lg border border-dashed border-slate-700 p-8 text-center">

              <p className="text-slate-400">
                {tasks.length === 0
                  ? "No study tasks yet."
                  : "No tasks found for this subject."}
              </p>

              {tasks.length === 0 && (
                <button
                  onClick={() => {
                    setEditingTask(null)
                    setShowForm(true)
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
                >
                  Create your first task
                </button>
              )}

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {filteredTasks.map((task) => (

                <div
                  key={task.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4"
                >

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

                    <p className="mt-1 text-sm text-slate-400">
                      {task.subject} • Deadline: {task.deadline}
                    </p>

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
                  className="w-full rounded-lg bg-blue-600 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
                >
                  {aiLoading
                    ? "Creating your study plan..."
                    : "Generate AI Study Plan"}
                </button>

                {aiPlan && (
                  <div className="rounded-xl border border-blue-900 bg-blue-950/40 p-5">

                    <h3 className="mb-3 text-lg font-semibold">
                      Your AI Study Plan
                    </h3>

                    <p className="text-sm leading-7 text-slate-300">
                      {aiPlan}
                    </p>

                    <div className="mt-5 space-y-3">
                      {aiTasks.map((task, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h4 className="font-medium">
                                {task.title}
                              </h4>

                              <p className="mt-1 text-sm text-slate-400">
                                {task.subject} • {task.deadline}
                              </p>
                            </div>

                            <span className="rounded-full bg-blue-950 px-3 py-1 text-xs text-blue-400">
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
            </div>
          </div>
        )
      }
    </main >
  )
}