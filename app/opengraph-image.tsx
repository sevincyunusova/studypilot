import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "StudyPilot — AI Study Planner"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f172a",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-2px",
          }}
        >
          StudyPilot
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 38,
            color: "#93c5fd",
          }}
        >
          AI Study Planner
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 24,
            color: "#cbd5e1",
          }}
        >
          Plan your studies smarter.
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}