import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { studyPilotModel, studyPilotSystemPrompt } from "@/lib/ai";
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: studyPilotModel,
      system: studyPilotSystemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
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