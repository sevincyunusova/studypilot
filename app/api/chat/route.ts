import { convertToModelMessages, streamText } from "ai";
import { studyPilotModel, studyPilotSystemPrompt } from "@/lib/ai";
import { studyTools } from "./tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages", {
        status: 400,
      });
    }

    // Prevent excessively large requests from consuming API resources.
    if (messages.length > 30) {
      return new Response("Too many messages", {
        status: 400,
      });
    }

    const result = streamText({
      model: studyPilotModel,

      system: studyPilotSystemPrompt,

      messages: await convertToModelMessages(messages),

      tools: studyTools,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response("Internal server error", {
      status: 500,
    });
  }
}