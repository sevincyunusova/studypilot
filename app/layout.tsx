import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "StudyPilot — AI Study Planner",
  description:
    "StudyPilot is an AI-powered study planner that helps students organize their learning and create personalized study plans.",
  openGraph: {
    title: "StudyPilot — AI Study Planner",
    description:
      "Plan your studies smarter with StudyPilot, an AI-powered study planner.",
    url: "https://studypilot-coral.vercel.app",
    siteName: "StudyPilot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyPilot — AI Study Planner",
    description:
      "An AI-powered study planner for smarter and more organized learning.",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}