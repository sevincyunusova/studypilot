"use client";

import { useState } from "react";

type DisclosureProps = {
  title: string;
  children: React.ReactNode;
};

export default function Disclosure({
  title,
  children,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="disclosure-panel"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between border p-4"
        >
          {title}
          <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
        </button>
      </h3>

      {isOpen && (
        <div
          id="disclosure-panel"
          className="border border-t-0 p-4"
        >
          {children}
        </div>
      )}
    </div>
  );
}