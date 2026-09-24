# StudyPilot

StudyPilot is an AI-powered study planning and productivity application for students. It helps students organize study tasks, track progress and deadlines, generate personalized study plans, and interact with an AI study assistant.

Live demo: https://studypilot-coral.vercel.app/

## What it does

StudyPilot combines traditional study-task management with AI-assisted planning.

Students can:

* create, edit, and delete study tasks
* organize tasks by subject
* set priorities and deadlines
* search and filter tasks
* track study progress
* view upcoming and overdue work
* generate personalized study plans with AI
* generate AI-assisted study tasks
* chat with an AI study assistant
* ask the assistant to create structured study plans
* retrieve live GitHub repository information through an AI tool
* use the application on desktop and mobile
* use a reduced-motion experience when motion preferences are enabled

## Who it is for

StudyPilot is designed primarily for students who want to organize coursework and turn study goals into a practical plan.

It is especially useful when a student has several subjects, deadlines, or study goals and wants both a task-management interface and AI assistance in one place.

## Getting started

### Requirements

Before running StudyPilot locally, install:

* Node.js 20 or newer
* npm
* Git

The project uses Next.js, React, TypeScript, Supabase, and AI SDK integrations.

### 1. Clone the repository

```bash
git clone https://github.com/sevincyunusova/studypilot.git
cd studypilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
```

The Supabase values are used by the authentication and application data layer.

`GEMINI_API_KEY` is used by the AI study-planning functionality.

Never commit `.env.local` or API keys to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Verify the project

Run the automated tests:

```bash
npm run test:run
```

Run the end-to-end tests:

```bash
npm run test:e2e
```

Verify the production build:

```bash
npm run build
```

## Usage examples

After signing in, a student can use the task-management features to organize study work.

Example study tasks:

```text
Calculus — Complete derivatives exercises — High priority — Friday
Programming — Review React hooks — Medium priority — Monday
Physics — Prepare mechanics notes — High priority — Wednesday
```

The AI study assistant can also be used for planning.

Example prompts:

```text
Create a 5-day study plan for my calculus exam.
```

```text
I have 2 hours per day and need to study derivatives, integrals, and limits. Create a realistic plan.
```

```text
Help me organize my study schedule for the next week.
```

The assistant can return structured study-plan information that can be displayed in the StudyPilot interface.

The AI agent also supports a GitHub repository lookup tool. For example:

```text
Show me information about a GitHub repository.
```

When the repository lookup tool is appropriate, StudyPilot can retrieve live repository information through the GitHub REST API.

## Architecture

The main AI workflow is:

```text
Student
   |
   v
StudyPilot Chat UI
   |
   v
/api/chat
   |
   v
AI Agent
   |
   +----------------------+
   |                      |
   v                      v
createStudyPlan      getGitHubRepository
   |                      |
   v                      v
Structured plan      GitHub REST API
   |                      |
   +----------+-----------+
              |
              v
         Chat UI
```

The application also uses Supabase for authentication and application data.

At a high level:

```text
                 +----------------+
                 |    Student     |
                 +-------+--------+
                         |
                         v
                +----------------+
                |   Next.js UI   |
                +-------+--------+
                        |
             +----------+----------+
             |                     |
             v                     v
       Supabase layer          AI layer
             |                     |
             v                     v
       Auth + data          /api/chat
                                   |
                                   v
                              AI Agent
                              /       \
                             v         v
                    Study Plan Tool   GitHub Tool
```

## AI agent

The AI functionality uses the AI SDK with Google Gemini.

The `/api/chat` route handles the assistant conversation and streaming response.

The agent has scoped tools rather than unrestricted application access.

### `createStudyPlan`

The study-plan tool uses structured validation and generates information such as:

* subject
* difficulty
* number of days
* hours per day
* topics
* daily schedule
* focus

### `getGitHubRepository`

The GitHub tool retrieves repository information from the GitHub REST API and returns live external data to the assistant.

This was intentionally kept as a small, focused external integration instead of trying to build a general-purpose agent.

## v2 evaluation

The current v2 automated evaluation was run on September 24, 2026.

| Check                 | Result       |
| --------------------- | ------------ |
| Unit tests            | 9/9 passed   |
| End-to-end tests      | 3/3 passed   |
| Total automated tests | 12/12 passed |
| Production build      | Passed       |
| TypeScript validation | Passed       |

Detailed results are available in [`docs/EVAL_V2.md`](docs/EVAL_V2.md).

The evaluation covers AI chat UI behavior, loading and streaming states, error handling, retry behavior, end-to-end messaging, and production build integrity.

The evaluation does not claim that every AI-generated response is correct. AI-generated study plans and assistant responses remain probabilistic and should be reviewed by the user.

## Limitations

StudyPilot is intentionally scoped as a student productivity and AI study-assistance MVP.

Current limitations include:

* AI-generated plans can require user review and adjustment.
* AI response quality depends on the configured AI provider and available quota.
* Supabase availability affects authentication and application data.
* GitHub repository information depends on the GitHub API being available.
* The automated evaluation does not automatically measure the quality of every generated study plan.
* The current automated evaluation focuses primarily on UI behavior, error handling, retry behavior, and production build integrity.
* More advanced AI quality evaluation, latency measurements, and broader integration tests are future improvements.

The current production build also reports known warnings related to the Edge Runtime, Vite configuration, and local `metadataBase` configuration. These warnings do not currently prevent the application from building successfully.

## Accessibility and performance

StudyPilot includes responsive layouts and reduced-motion handling.

The project also includes previous accessibility and performance audit documentation in [`AUDIT.md`](AUDIT.md).

The latest Lighthouse and accessibility audit artifacts are kept in the repository's documentation for reference.

## Transparency

I built StudyPilot with the help of AI tools, including Claude, during development. AI assistance was used for implementation support, debugging, documentation, and development workflows.

I personally reviewed and tested the resulting code, ran the automated test suite, ran the production build, and reviewed the application's behavior before documenting these results.

AI-generated output was not treated as automatically correct; implementation decisions and final verification remained my responsibility.

## Development scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run test:run
```

Runs the Vitest unit test suite once.

```bash
npm run test:e2e
```

Runs the Playwright end-to-end test suite.

## Project documentation

* [`BUILD_LOG.md`](BUILD_LOG.md) — AI agent architecture and implementation build log
* [`AUDIT.md`](AUDIT.md) — accessibility and performance audit
* [`docs/EVAL_V2.md`](docs/EVAL_V2.md) — v2 evaluation results

## Live application

https://studypilot-coral.vercel.app/
