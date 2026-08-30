import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod";
import { studyPilotModel, studyPilotSystemPrompt } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages", { status: 400 });
    }

    const result = streamText({
      model: studyPilotModel,

      system: studyPilotSystemPrompt,

      messages: await convertToModelMessages(messages),

      tools: {
        createStudyPlan: tool({
          description:
            "Create a structured study plan for a subject based on the student's needs.",

          inputSchema: z.object({
            subject: z.string().describe("The subject the student wants to study"),
            difficulty: z
              .enum(["beginner", "intermediate", "advanced"])
              .describe("The student's current difficulty level"),
            days: z
              .number()
              .int()
              .min(1)
              .max(30)
              .describe("Number of days for the study plan"),
            hoursPerDay: z
              .number()
              .min(0.5)
              .max(12)
              .describe("Available study hours per day"),
            topics: z
              .array(z.string())
              .min(1)
              .describe("Topics that should be included in the study plan"),
          }),

          execute: async ({
            subject,
            difficulty,
            days,
            hoursPerDay,
            topics,
          }) => {
            const topicCount = topics.length;

            const schedule = Array.from({ length: days }, (_, index) => {
              const topic = topics[index % topicCount];

              return {
                day: index + 1,
                topic,
                hours: hoursPerDay,
                focus:
                  difficulty === "beginner"
                    ? "Learn the fundamentals and practice basic concepts."
                    : difficulty === "intermediate"
                      ? "Review concepts and solve practical exercises."
                      : "Work on advanced concepts and challenging problems.",
              };
            });

            return {
              subject,
              difficulty,
              days,
              hoursPerDay,
              topics,
              schedule,
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response("Internal server error", {
      status: 500,
    });
  }
}