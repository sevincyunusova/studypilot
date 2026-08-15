"use client"
"use client"

import { useState } from "react"

type Task = {
  id: number
  title: string
  subject: string
  deadline: string
  priority: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState("Medium")

  const addTask = () => {
    if (!title || !subject || !deadline) return

    const newTask: Task = {
      id: Date.now(),
      title,
      subject,
      deadline,
      priority,
    }

    setTasks([...tasks, newTask])

    setTitle("")
    setSubject("")
    setDeadline("")
    setPriority("Medium")
    setShowForm(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">StudyPilot</h1>
            <p className="mt-1 text-slate-400">
              Your AI-powered study planner
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
          >
            + Add Task
          </button>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Good morning!</h2>
          <p className="mt-2 text-slate-400">
            Here is your study overview for today.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Today&apos;s Tasks</p>
            <p className="mt-2 text-3xl font-bold">{tasks.length}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Study Progress</p>
            <p className="mt-2 text-3xl font-bold">0%</p>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Today&apos;s Study Plan</h2>

          {tasks.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-700 p-8 text-center">
              <p className="text-slate-400">
                No study tasks yet.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
              >
                Create your first task
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {task.subject} • Deadline: {task.deadline}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-blue-900 bg-blue-950/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                AI Study Planner
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Let AI create a personalized study plan based on your goals.
              </p>
            </div>

            <button className="rounded-lg bg-white px-5 py-2.5 font-medium text-slate-900 transition hover:bg-slate-200">
              Generate Plan
            </button>
          </div>
        </section>

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Add Study Task
                </h2>

                <button
                  onClick={() => setShowForm(false)}
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
                  onClick={addTask}
                  className="w-full rounded-lg bg-blue-600 py-3 font-medium transition hover:bg-blue-500"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}