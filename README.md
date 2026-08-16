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
│   └── generate-plan/
├── login/
├── signup/
├── health/
├── globals.css
├── layout.tsx
└── page.tsx

lib/
├── supabase.ts
└── supabase-server.ts

proxy.ts

```

## Getting Started

### Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd studypilot

```

### Install dependencies

```bash
npm install

```

### Create environment variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

```

### Start the development server

```bash
npm run dev

```

Open:

```text
http://localhost:3000

```

## Environment Variables

The project uses the following environment variables:

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API access for AI study plan generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase public client key |

Never commit `.env.local` or real API keys to the repository.

## Deployment

The project is deployed with Vercel.

Every push to the connected GitHub repository can trigger a new deployment.

Live application:

[https://studypilot-coral.vercel.app/](https://studypilot-coral.vercel.app/)

## Health Check

The application includes a database health-check page that verifies the Supabase connection and fetches data from the database.

```text
/health

```

## Authentication Flow

Unauthenticated users are directed to the account creation page.

Users can:

1. Create a new StudyPilot account.
2. Navigate to Sign In if they already have an account.
3. Sign in with their existing credentials.
4. Access the StudyPilot dashboard after authentication.

## AI Study Planner

Users can provide:

* Study goal
* Exam date
* Available study hours per day
* Current level
* Subjects

StudyPilot sends this information to the AI service and generates a personalized study plan together with recommended study tasks.

## Development

Build the project for production:

```bash
npm run build

```

Start the production server:

```bash
npm start

```

## Project Status

StudyPilot is currently under active development as part of a frontend development project and assignment.