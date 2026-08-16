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

  useEffect(() => {
    if (!isAtBottom) {
      return;
    }

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
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
        className="max-h-[500px] min-h-[400px] space-y-4 overflow-y-auto rounded-xl border bg-white p-4 shadow-sm"
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

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
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
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}