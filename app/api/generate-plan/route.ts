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

Create a realistic and personalized study plan for a student.

Student information:
Goal: ${goal}
Exam/deadline: ${examDate}
Available study time per day: ${hoursPerDay} hours
Current level: ${level}
Subjects: ${subjects}

Create a realistic study plan that:
- Prioritizes difficult subjects
- Uses the available study time efficiently
- Includes revision
- Includes practice
- Includes reasonable breaks
- Avoids unrealistic workloads

Return the plan in this structure:

Study Plan

Strategy:
Give a short explanation of the recommended strategy.

Day 1
- Subject:
- Task:
- Duration:

Day 2
- Subject:
- Task:
- Duration:

Continue for the appropriate number of days until the exam/deadline.

Weekly Strategy:
- Revision:
- Practice:
- Rest:
`

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    })

    return NextResponse.json({
      plan: response.text,
    })
  } catch (error) {
    console.error("AI plan generation error:", error)

    return NextResponse.json(
      { error: "Failed to generate study plan." },
      { status: 500 }
    )
  }
}