# StudyPilot

StudyPilot is an AI-powered study planner built with Next.js. It helps students organize study tasks, track progress, manage deadlines, and generate personalized study plans with AI.

## Live Demo

[https://studypilot-coral.vercel.app/](https://studypilot-coral.vercel.app/)

## Features

* User authentication with Supabase
* Create a new account and sign in
* Add, edit, complete, and delete study tasks
* Set subjects, deadlines, and priorities
* Search and filter study tasks
* Track overall study progress
* View upcoming and overdue deadlines
* AI-powered personalized study plan generation
* Add AI-generated tasks to the study planner
* Responsive design for desktop and mobile
* Supabase database connection health check

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* Google Gemini API
* Vercel
## Project Structure

```text
app/
├── api/
│   ├── chat/
│   └── generate-plan/
├── login/
├── signup/
├── health/
├── globals.css
├── layout.tsx
└── page.tsx

components/
└── AIChat.tsx

lib/
├── supabase.ts
└── supabase-server.ts

proxy.ts
```

## AI Tool Contract

### studyTool

Returns study information for a given subject.

#### Input

```ts
{
  subject: string;
}
```

#### Output

```ts
{
  subject: string;
  difficulty: string;
  recommendedHours: number;
  topics: string[];
}
```

#### Tool States

* `input-streaming` — tool input is being prepared
* `input-available` — tool input is ready
* `output-available` — tool returned study information
* `output-error` — tool execution failed
