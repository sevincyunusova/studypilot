"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

type StudyToolResult = {
  subject: string;
  difficulty: string;
  recommendedHours: number;
  topics: string[];
};

type StudyToolInput = {
  subject: string;
};

const examplePrompts = [
  "Create a 7-day study plan for JavaScript",
  "Explain JavaScript promises in simple terms",
  "Help me prepare for a frontend interview",
];

function ChatSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[80%] rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-3/4 rounded bg-slate-700" />
          <div className="h-3 w-5/6 rounded bg-slate-700" />
          <div className="h-3 w-2/3 rounded bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

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
    regenerate,
  } = useChat();

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";
  const isRetrying = isSubmitted || isStreaming;

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

  async function handleRetry() {
    if (isRetrying) {
      return;
    }

    await regenerate();
  }

  function handleExamplePrompt(prompt: string) {
    if (isSubmitted || isStreaming) {
      return;
    }

    setInput(prompt);
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative min-h-[400px] max-h-[500px] space-y-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm"
      >
        {messages.length === 0 && (
          <div className="flex min-h-[360px] items-center justify-center text-center">
            <div className="w-full max-w-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/20 text-2xl">
                ✦
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">
                Welcome to StudyPilot AI
              </h2>

              <p className="mt-2 text-slate-400">
                Start your study session by asking a question or choosing an
                example below.
              </p>

              <div className="mt-6 grid gap-3 text-left">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleExamplePrompt(prompt)}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-blue-600 hover:bg-blue-950/40 hover:text-blue-400"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-slate-800 bg-slate-800 text-slate-200"
              }`}
            >
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p
                      key={`${message.id}-${index}`}
                      className="whitespace-pre-wrap leading-6"
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
                        className="rounded-xl border border-blue-800 bg-blue-950/40 p-3 text-sm text-blue-400"
                      >
                        Preparing study information...
                      </div>
                    );
                  }

                  if (part.state === "input-available") {
                    const toolInput =
                      part.input as StudyToolInput;

                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="rounded-xl border border-yellow-800 bg-yellow-950/30 p-3 text-sm text-yellow-400"
                      >
                        Getting study information for{" "}
                        <strong>{toolInput.subject}</strong>...
                      </div>
                    );
                  }

                  if (part.state === "output-available") {
                    const result =
                      part.output as StudyToolResult;

                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="mt-3 rounded-xl border border-slate-700 bg-slate-950 p-4 shadow-sm"
                      >
                        <h3 className="font-semibold text-white">
                          {result.subject}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Difficulty: {result.difficulty}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Recommended time:{" "}
                          {result.recommendedHours} hours
                        </p>

                        <div className="mt-3">
                          <p className="text-sm font-medium text-slate-200">
                            Topics
                          </p>

                          <ul className="mt-1 list-disc pl-5 text-sm text-slate-400">
                            {result.topics.map((topic) => (
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
                        className="rounded-xl border border-red-900 bg-red-950/30 p-3 text-sm text-red-400"
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

        {isSubmitted && <ChatSkeleton />}

        {!isAtBottom && messages.length > 0 && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="sticky bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 shadow-md transition hover:bg-slate-800 hover:text-white"
          >
            ↓ Jump to latest
          </button>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-4 text-sm text-red-400">
          <p className="font-medium text-red-300">
            We couldn&apos;t finish that response.
          </p>

          <p className="mt-1 text-red-400/80">
            The connection was interrupted. Your message is still here.
          </p>

          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying ? "Retrying..." : "Try again"}
          </button>
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
          className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
        />

        {isStreaming || isSubmitted ? (
          <button
            type="button"
            onClick={stop}
            className="w-full rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-500 sm:w-auto"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}