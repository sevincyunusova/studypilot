"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

type ScheduleItem = {
  day: number;
  topic: string;
  hours: number;
  focus: string;
};

type StudyPlan = {
  subject: string;
  difficulty: string;
  days: number;
  hoursPerDay: number;
  topics: string[];
  schedule: ScheduleItem[];
};

const examplePrompts = [
  "Create a 7-day study plan for JavaScript",
  "Explain JavaScript promises in simple terms",
  "Help me prepare for a frontend interview",
];

function ChatSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[80%] rounded-2xl bg-gray-100 px-4 py-4">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function AIChat() {
  const [input, setInput] = useState("");
  const [chatError, setChatError] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
  } = useChat({
    onError: (error) => {
      console.error("AI chat error:", error);

      const message = error.message.toLowerCase();

      if (
        message.includes("429") ||
        message.includes("too many requests") ||
        message.includes("rate limit") ||
        message.includes("usage limit") ||
        message.includes("quota")
      ) {
        setChatError(
          "The AI service is temporarily busy or has reached its usage limit. Please wait a moment and try again."
        );
        return;
      }

      if (
        message.includes("network") ||
        message.includes("fetch") ||
        message.includes("connection") ||
        message.includes("aborted")
      ) {
        setChatError(
          "The connection was interrupted while generating the response. Please try again."
        );
        return;
      }

      setChatError(
        "We couldn't finish the AI response. You can retry the failed response below."
      );
    },
  });

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
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const value = input.trim();

    if (!value || isSubmitted || isStreaming) {
      return;
    }

    setInput("");
    setChatError("");

    await sendMessage({
      text: value,
    });
  }

  async function handleRetry() {
    if (isRetrying) {
      return;
    }

    setChatError("");

    await regenerate();
  }

  function handleExamplePrompt(prompt: string) {
    if (isSubmitted || isStreaming) {
      return;
    }

    setInput(prompt);
    setChatError("");
  }

  const activeError = chatError || error?.message;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-2 py-4 sm:px-4">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative min-h-[360px] max-h-[60dvh] space-y-4 overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-slate-900 p-3 shadow-sm sm:min-h-[400px] sm:max-h-[500px] sm:p-4"
      >
        {messages.length === 0 && (
          <div className="flex min-h-[330px] items-center justify-center text-center sm:min-h-[360px]">
            <div className="w-full max-w-xl">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Welcome to StudyPilot AI
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
                Start your study session by asking a question or choosing an
                example below.
              </p>

              <div className="mt-5 grid gap-3 text-left sm:mt-6">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleExamplePrompt(prompt)}
                    disabled={isSubmitted || isStreaming}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm leading-5 text-slate-200 shadow-sm transition hover:border-blue-500 hover:bg-slate-700 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
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
            className={`flex ${message.role === "user"
                ? "justify-end"
                : "justify-start"
              }`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3 py-3 text-sm sm:max-w-[80%] sm:px-4 sm:py-3 sm:text-base ${message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-100"
                }`}
            >
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p
                      key={`${message.id}-${index}`}
                      className="whitespace-pre-wrap break-words"
                    >
                      {part.text}
                    </p>
                  );
                }

                if (part.type === "tool-createStudyPlan") {
                  if (part.state === "input-streaming") {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-300"
                      >
                        Preparing your study plan...
                      </div>
                    );
                  }

                  if (part.state === "input-available") {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-300"
                      >
                        Creating your personalized study plan...
                      </div>
                    );
                  }

                  if (part.state === "output-available") {
                    const result = part.output as StudyPlan;

                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
                      >
                        <div className="border-b border-gray-200 pb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {result.subject} Study Plan
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                              {result.difficulty}
                            </span>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {result.days} days
                            </span>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {result.hoursPerDay}h/day
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-900">
                            Topics
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {result.topics.map((topic) => (
                              <span
                                key={topic}
                                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <p className="text-sm font-semibold text-gray-900">
                            Daily Schedule
                          </p>

                          {result.schedule.map((item) => (
                            <div
                              key={item.day}
                              className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    Day {item.day}
                                  </p>

                                  <p className="mt-1 text-sm font-medium text-blue-600">
                                    {item.topic}
                                  </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                                  {item.hours}h
                                </span>
                              </div>

                              <p className="mt-2 text-xs leading-5 text-gray-600">
                                {item.focus}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (part.state === "output-error") {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                      >
                        Failed to create the study plan. Please try again.
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
            className="sticky bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 shadow-md hover:bg-slate-700 sm:px-4 sm:text-sm"
          >
            ↓ Jump to latest
          </button>
        )}

        <div ref={bottomRef} />
      </div>

      {activeError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
        >
          <p className="font-medium">
            AI response failed
          </p>

          <p className="mt-1 leading-6 text-red-600">
            {chatError ||
              "The AI response could not be completed. Your failed message can be retried."}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isRetrying
              ? "Retrying failed response..."
              : "Retry failed response"}
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
          aria-label="Ask StudyPilot"
          className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-base"
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
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50 sm:w-auto"
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}