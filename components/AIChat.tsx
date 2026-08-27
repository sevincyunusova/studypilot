"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function AIChat() {
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
  } = useChat();

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";

  function handleScroll() {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsAtBottom(distanceFromBottom < 80);
  }

  function jumpToLatest() {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    setIsAtBottom(true);
  }

  useEffect(() => {
    if (!isAtBottom) {
      return;
    }

    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages, isAtBottom]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value = input.trim();

    if (!value || isSubmitted || isStreaming) {
      return;
    }

    setInput("");

    await sendMessage({
      text: value,
    });
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative max-h-[500px] min-h-[400px] space-y-4 overflow-y-auto rounded-xl border bg-white p-4 shadow-sm"
      >
        {messages.length === 0 && (
          <div className="flex min-h-[360px] items-center justify-center text-center text-gray-500">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                StudyPilot AI
              </h2>

              <p className="mt-2">
                Ask me anything about your studies.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user"
              ? "justify-end"
              : "justify-start"
              }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
                }`}
            >
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p
                      key={`${message.id}-${index}`}
                      className="whitespace-pre-wrap"
                    >
                      {part.text}
                    </p>
                  );
                }

                if (part.type === "tool-studyTool") {
                  if (part.state === "input-streaming") {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700"
                      >
                        Preparing study information...
                      </div>
                    );
                  }

                  if (part.state === "input-available") {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700"
                      >
                        Getting study information for{" "}
                        <strong>{part.input.subject}</strong>...
                      </div>
                    );
                  }

                  if (part.state === "output-available") {
                    const result = part.output;

                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="mt-3 rounded-xl border bg-white p-4 shadow-sm"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {result.subject}
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          Difficulty: {result.difficulty}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Recommended time: {result.recommendedHours} hours
                        </p>

                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-900">
                            Topics
                          </p>

                          <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                            {result.topics.map((topic: string) => (
                              <li key={topic}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  }

                  if (part.state === "output-error") {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                      >
                        Failed to load study information. Please try again.
                      </div>
                    );
                  }
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {isSubmitted && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-gray-500">
              Thinking...
            </div>
          </div>
        )}

        {!isAtBottom && messages.length > 0 && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="sticky bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-gray-50"
          >
            ↓ Jump to latest
          </button>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isSubmitted || isStreaming}
          placeholder="Ask StudyPilot..."
          className="min-w-0 flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isStreaming || isSubmitted ? (
          <button
            type="button"
            onClick={stop}
            className="w-full rounded-xl bg-red-600 px-5 py-3 font-medium text-white sm:w-auto"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50 sm:w-auto"          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}