import { streamText, convertToModelMessages } from "ai";
import {
  studyPilotModel,
  studyPilotSystemPrompt,
} from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: studyPilotModel,
      system: studyPilotSystemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate a response.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}