import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      goal,
      examDate,
      hoursPerDay,
      level,
      subjects,
    } = body

    if (
      !goal ||
      !examDate ||
      !hoursPerDay ||
      !level ||
      !subjects
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      )
    }

    const prompt = `
You are an expert AI study planner.

Create a realistic personalized study plan.

Student information:
Goal: ${goal}
Exam/deadline: ${examDate}
Available study time per day: ${hoursPerDay} hours
Current level: ${level}
Subjects: ${subjects}

Create a practical study plan.

Return ONLY valid JSON in exactly this format:

{
  "strategy": "short explanation",
  "tasks": [
    {
      "title": "task title",
      "subject": "subject",
      "deadline": "YYYY-MM-DD",
      "priority": "High"
    }
  ]
}

Rules:
- Create realistic daily study tasks.
- Do not overload the student.
- Include revision and practice.
- Use the available study hours efficiently.
- Use High, Medium or Low for priority.
- The deadline must be a valid date.
- Create multiple tasks when appropriate.
- Do not include markdown.
- Return JSON only.
`

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    })

    const text = response.text

    if (!text) {
      throw new Error("AI returned an empty response.")
    }

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let parsedPlan

    try {
      parsedPlan = JSON.parse(cleanText)
    } catch {
      console.error("AI returned invalid JSON:", cleanText)

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid study plan. Please try again.",
        },
        { status: 502 }
      )
    }

    if (
      !parsedPlan ||
      typeof parsedPlan.strategy !== "string" ||
      !Array.isArray(parsedPlan.tasks)
    ) {
      console.error("AI returned an invalid response structure:", parsedPlan)

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid study plan. Please try again.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      plan: parsedPlan.strategy,
      tasks: parsedPlan.tasks,
    })
  } catch (error) {
    console.error("AI plan generation error:", error)

    const message =
      error instanceof Error
        ? error.message
        : "Unknown AI error"

    const status =
      message.includes("503") ||
        message.includes("UNAVAILABLE")
        ? 503
        : message.includes("429") ||
          message.includes("quota")
          ? 429
          : 500

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    )
  }
}