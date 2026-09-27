```markdown
# StudyPilot

StudyPilot is an AI-powered study planning and productivity application designed for students.

It combines traditional study-task management with an AI study assistant that can generate structured study plans and retrieve GitHub repository information through external tools.

## Live Demo

[https://studypilot-coral.vercel.app/](https://studypilot-coral.vercel.app/)

## Demo Video

YouTube Demo — Unlisted: PASTE_YOUTUBE_LINK_HERE

## What StudyPilot Does

StudyPilot helps students organize their study workflow and use AI for planning and assistance.

The application supports:

- Creating and managing study tasks
- Organizing tasks by subject, priority, and deadline
- Searching and filtering study tasks
- Generating structured AI study plans
- Chatting with an AI study assistant
- Looking up GitHub repository information through the GitHub REST API
- Handling AI loading, streaming, error, and retry states

## Target Users

StudyPilot is primarily designed for students who want to organize their study workload and use AI to create structured study plans.

## Core AI Workflows

### 1. AI Study Plan Generation

A student can provide:

- Study goal
- Exam date or study duration
- Available hours per day
- Difficulty level
- Subjects or topics

StudyPilot sends the validated request to the configured AI provider and returns a structured study plan.

The structured approach makes the generated information easier for the frontend to display consistently.

### 2. AI Study Assistant

The application includes an AI chat interface for study-related questions and follow-up conversations.

The chat supports:

- Streaming responses
- Loading states
- Stop action
- Error feedback
- Retry behavior
- Tool calling

### 3. GitHub Repository Information

The AI assistant can use a GitHub REST API tool to retrieve repository information when the request requires it.

The tool is intentionally scoped to repository information instead of unrestricted access to the application.

## Architecture

```text
                    ┌─────────────────────┐
                    │       Student       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │ Tasks + AI Chat UI  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌────────────────────┐
        │ /api/chat       │        │ /api/generate-plan │
        │ AI Assistant    │        │ Study Plan API     │
        └────────┬────────┘        └─────────┬──────────┘
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌────────────────────┐
        │ AI SDK + Tools  │        │ Configured AI      │
        │                 │        │ Provider           │
        └────────┬────────┘        └────────────────────┘
                 │
        ┌────────┴─────────┐
        ▼                  ▼
┌───────────────┐   ┌────────────────┐
│ GitHub REST   │   │ Supabase       │
│ API           │   │ Authentication │
└───────────────┘   │ + Data         │
                    └────────────────┘

```

## Main Components

* Next.js App Router
* React
* Tailwind CSS
* Supabase authentication and data
* AI SDK
* Configured AI provider
* GitHub REST API
* Vitest unit tests
* Playwright end-to-end tests

## Project Structure
```text
app/
├── api/
│   ├── chat/
│   └── generate-plan/
├── login/
├── signup/
├── page.tsx
└── health/

components/
├── AIChat
├── StudyScene
└── task-related components

docs/
├── DEMO_SCRIPT.md
└── EVAL_V2.md

e2e/
tests/
public/

```

## Getting Started

### Prerequisites

Install:

* Node.js 18+
* npm
* Git

### 1. Clone the repository

```bash
git clone [https://github.com/sevincyunusova/studypilot.git](https://github.com/sevincyunusova/studypilot.git)
cd studypilot

```

### 2. Install dependencies

```bash
npm install

```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key

```

### 4. Start the development server

```bash
npm run dev

```

Open: `http://localhost:3000`

### 5. Create a production build

```bash
npm run build

```

### 6. Start the production server

```bash
npm run start

```

## Usage Examples

### Generate a study plan

Example prompt:

> Create a 5-day study plan for my calculus exam. I have 2 hours per day and need to study derivatives, integrals, and limits.

The assistant can generate a structured plan containing study duration, topics, difficulty, and daily scheduling information.

### Look up a GitHub repository

Example prompt:

> Show me information about the sevincyunusova/studypilot GitHub repository.

When the GitHub tool is triggered, StudyPilot retrieves repository information through the GitHub REST API.

### Manage study tasks

Users can create study tasks and organize them using information such as:

* Subject
* Priority
* Deadline
* Task status

## Agent Tools

StudyPilot uses a limited tool-based AI architecture.

* **Study Plan Tool:** The study-plan tool validates structured input before generating a study plan. The validation layer helps prevent malformed requests from reaching the AI workflow.
* **GitHub Repository Tool:** The GitHub tool retrieves repository information through the GitHub REST API. The tool is intentionally scoped to repository information rather than unrestricted application access.

## V2 Evaluation Results

The v2 evaluation was performed on September 24, 2026. The evaluation focused on automated regression coverage and production build integrity.

| Check | Result | Details |
| --- | --- | --- |
| Unit tests | **PASS** | 9/9 tests passed |
| End-to-end tests | **PASS** | 3/3 tests passed |
| Production build | **PASS** | Next.js production build completed successfully |
| TypeScript | **PASS** | TypeScript validation completed during next build |
| **Total automated tests** | **PASS** | **12/12 tests passed** |

### Unit Tests

* **Command:** `npm run test:run`
* **Result:** Test Files: 1 passed | Tests: 9 passed

The AI chat component tests cover:

* Welcome message rendering
* Accessible chat input
* Disabled send state
* Enabled send state
* Sending a user message
* Loading state
* Streaming/stop state
* AI error state
* Retry behavior

### End-to-End Tests

* **Command:** `npm run test:e2e`
* **Result:** 3 passed (23.5s)

The end-to-end suite verifies:

* A user can send a message to StudyPilot
* An AI response failure is shown to the user
* A failed AI response can be retried

*(Note: The failure scenarios intentionally mock an unavailable AI service. The browser console therefore contains the expected AI service unavailable error during those tests.)*

### Production Build

* **Command:** `npm run build`

The production build completed successfully and passed TypeScript validation. The generated application includes routes such as:

* `/`
* `/login`
* `/signup`
* `/api/chat`
* `/api/generate-plan`
* `/health`
* `/opengraph-image`

## Evaluation Interpretation

* The v2 automated regression suite passed completely: **12/12 automated tests passed**.
* The successful production build confirms that the current codebase compiles and passes TypeScript validation during the production build.
* This evaluation does not claim that all possible AI responses are correct. AI-generated study plans and assistant responses remain probabilistic and should be reviewed by the user.

## Limitations

The automated evaluation primarily checks:

* UI behavior
* Error handling
* Retry behavior
* Production build integrity

It does not automatically judge the quality of every AI-generated study plan or assistant response.

StudyPilot also depends on external services such as:

* Supabase
* The configured AI provider
* GitHub API

Service availability, API limits, authentication problems, or quota issues can affect some application functionality.

Future evaluation could add:

* Structured AI response quality tests
* Study-plan correctness checks
* Latency measurements
* Accessibility regression tests
* Broader API integration tests

## Guardrails and Safety

* StudyPilot keeps the AI agent scope intentionally limited.
* The GitHub tool is restricted to repository information rather than unrestricted access to application resources.
* Input validation is also used for structured study-plan requests.
* AI-generated study plans are not guaranteed to be correct or perfectly personalized. Users should review generated plans and adjust them when necessary.

## Design Decisions

* **Structured AI output:** StudyPilot uses structured tool input and output for the study-plan workflow instead of relying entirely on free-form text. This makes the generated information easier for the frontend to display consistently and reduces the amount of unstructured data the UI needs to interpret.
* **Limited agent scope:** The AI agent does not have unrestricted access to application functionality. The GitHub integration is limited to repository information, which keeps the tool scope smaller and easier to reason about.
* **Reliability states:** The AI chat interface includes loading, streaming, stop, error, and retry states. These states were tested through unit and end-to-end tests.

## Testing

Run the unit tests:

```bash
npm run test:run

```

Run the end-to-end tests:

```bash
npm run test:e2e

```

Create a production build:

```bash
npm run build

```

## Production

The current production deployment is available at:

[https://studypilot-coral.vercel.app/](https://studypilot-coral.vercel.app/?utm_source=gemini)

## Documentation

Additional project documentation is available in:

* `docs/EVAL_V2.md` — v2 evaluation results
* `docs/DEMO_SCRIPT.md` — FL-09 demo narration script
* `AGENTS.md` — project development guidance
* `BUILD_LOG.md` — development/build history
* `AUDIT.md` — project audit notes

## Demo

The FL-09 demo demonstrates:

* Study task management
* AI study-plan generation
* GitHub repository tool usage
* Error and retry behavior
* A documented AI limitation
* Current v2 evaluation results

Demo video:

PASTE_YOUTUBE_LINK_HERE

## License

This project was developed as part of the FlyRank AI Engineering internship assignments.

```

```