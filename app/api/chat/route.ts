import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { studyPilotModel, studyPilotSystemPrompt } from "@/lib/ai";
import { studyTool } from "./tools";

const ENABLE_RATE_LIMIT_TEST = false;

export async function POST(req: Request) {
  try {
    if (ENABLE_RATE_LIMIT_TEST) {
      return Response.json(
        {
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
        },
      );
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages || messages.length === 0) {
      return Response.json(
        {
          error: "At least one message is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = streamText({
      model: studyPilotModel,
      system: studyPilotSystemPrompt,
      messages: await convertToModelMessages(messages),
      tools: {
        studyTool,
      },
      toolChoice: "required",

      onError({ error }) {
        console.error("Chat stream error:", error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("Chat UI stream error:", error);

        return "The AI response was interrupted. Please try again.";
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      {
        error: "Unable to generate a response. Please try again.",
      },
      { status: 500 },
    );
  }
}