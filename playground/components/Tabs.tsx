"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const nextTab = tabs[nextIndex];

    setActiveTab(nextTab.id);

    document
      .getElementById(`tab-${nextTab.id}`)
      ?.focus();
  };

  const activeContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Content sections"
        className="flex border-b"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="px-4 py-2"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeContent && (
        <div
          id={`panel-${activeContent.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeContent.id}`}
          tabIndex={0}
          className="p-4"
        >
          {activeContent.content}
        </div>
      )}
    </div>
  );
}