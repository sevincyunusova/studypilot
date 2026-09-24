# StudyPilot FL-09 Demo Script

Target duration: 3–5 minutes

## 0:00–0:20 — Introduction

Show the live StudyPilot application.

Say:

> Hi, this is StudyPilot, an AI-powered study planning and productivity application for students.
>
> The goal is to help students manage their study tasks, deadlines, progress, and use AI to turn study goals into structured plans.

## 0:20–0:55 — Task management

Show the main application interface.

Create or show a study task.

Say:

> First, StudyPilot works as a normal study task manager. Students can organize tasks by subject, priority, and deadline, and they can search and filter their work.
>
> This is important because the AI features are built around an existing study workflow rather than being a separate chatbot.

Show the task, subject, priority, and deadline.

## 0:55–1:50 — AI study assistant

Open the AI assistant.

Enter:

```text
Create a 5-day study plan for my calculus exam. I have 2 hours per day and need to study derivatives, integrals, and limits.
```

Show the response while it streams.

Say:

> The main AI workflow is here. I give the assistant a study goal, available time, and topics.
>
> Instead of returning only free-form text, StudyPilot uses a structured study-plan tool. The tool validates the input and produces structured information such as the subject, difficulty, number of days, hours per day, topics, and daily schedule.
>
> I chose this structured tool approach because it makes the AI output easier for the interface to display consistently and reduces the amount of unstructured data the frontend has to interpret.

Show the generated plan.

## 1:50–2:20 — AI agent / external tool

Ask the assistant for a GitHub repository lookup, for example:

```text
Show me information about the sevincyunusova/studypilot GitHub repository.
```

Show the result if the tool is triggered.

Say:

> The agent also has a separate GitHub repository tool. When appropriate, it retrieves live repository information through the GitHub REST API.
>
> I intentionally kept the agent scope small instead of giving it unrestricted access to the application.

If the repository lookup does not trigger during the live demo, do not fake it. Continue with the study-plan result and briefly explain that the GitHub tool is implemented in the project.

## 2:20–2:50 — Error handling

If practical, demonstrate the retry/error UI using the existing error test page or explain the tested behavior.

Say:

> Reliability was also part of the implementation. The chat UI has loading and streaming states, a stop action, error feedback, and retry behavior.
>
> In the automated end-to-end tests, I specifically tested both an unavailable AI service and retrying after that failure.

Show the relevant UI if available.

## 2:50–3:25 — Limitation

Show the application while explaining:

> One important limitation is that AI-generated study plans are not guaranteed to be correct or perfectly personalized.
>
> The current evaluation verifies the interface, error handling, retry behavior, and production build, but it does not automatically judge the quality of every generated study plan.
>
> Because of that, the student should review the generated plan and adjust it when necessary.

## 3:25–3:45 — Evaluation and closing

Show the GitHub repository or README.

Say:

> For the current v2 evaluation, the automated unit tests passed 9 out of 9, the end-to-end tests passed 3 out of 3, and the production build completed successfully.
>
> The repository README documents the setup process, architecture, evaluation results, limitations, and how AI assistance was used during development.
>
> That's StudyPilot.
