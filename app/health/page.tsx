import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default async function HealthPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {}
        },
      },
    }
  )

  const { data, error } = await supabase
    .from("health_check")
    .select("*")
    .limit(5)

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          StudyPilot Health Check
        </h1>

        <p className="mt-2 text-slate-600">
          Database connection test
        </p>

        {error ? (
          <div className="mt-6 rounded-xl border bg-white p-6">
            <h2 className="text-xl font-semibold text-red-600">
              Database connection failed
            </h2>

            <p className="mt-3 text-slate-600">
              {error.message}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border bg-white p-6">
            <h2 className="text-xl font-semibold text-green-600">
              Database connection successful
            </h2>

            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-white">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}