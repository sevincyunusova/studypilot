# StudyPilot Agent — Build Log

## Assignment

- Assignment: FL-07 — Build the Agent
- Track: General AI Fluency
- Phase: Build
- Project: StudyPilot
- Core job: Help students create personalized study plans and answer study-related questions.
- Live data connection: GitHub REST API

---

## Initial Scope

The first version of the agent focused on one core workflow:

1. Student sends a study-related request.
2. AI understands the request.
3. AI collects the required study information.
4. Agent calls the `createStudyPlan` tool.
5. Tool returns structured study-plan data.
6. Frontend renders the result as a study-plan card.

The initial implementation intentionally kept the scope narrow so the complete workflow could work end to end before adding additional capabilities.

---

## Iteration 1 — Core Agent

### Implemented

Created the StudyPilot AI agent using the AI SDK and Google Gemini.

Added:

- AI model configuration
- System prompt
- `/api/chat` endpoint
- Streaming responses
- `createStudyPlan` tool
- Structured tool input validation using Zod

### Problem

The first implementation handled the study-plan generation directly inside the API route.

This worked, but the tool logic was mixed with the API endpoint and would become harder to maintain as more tools were added.

### Change

Moved the tool definitions into:

`app/api/chat/tools.ts`

The API route now imports the tools and passes them to the agent.

### Result

The agent became easier to extend with additional tools.

---

## Iteration 2 — Structured Study Plan Output

### Implemented

Added a structured study-plan result containing:

- Subject
- Difficulty
- Number of days
- Hours per day
- Topics
- Daily schedule
- Focus for each study session

### Problem

The raw tool result was not useful enough as a user interface.

### Change

Added a dedicated `StudyPlanCard` component to the chat interface.

The card displays:

- Study-plan metadata
- Topics
- Daily schedule
- Study duration
- Learning focus

### Result

The structured tool output is now directly visible and understandable inside the chat.

---

## Iteration 3 — Live External Data Connection

### Requirement

FL-07 requires at least one real tool, file, knowledge base, MCP server, or external data connection.

### Implemented

Added a `getGitHubRepository` tool.

The tool connects directly to the public GitHub REST API.

It can retrieve:

- Repository name
- Full repository name
- Description
- Primary language
- Stars
- Forks
- Open issues
- Default branch
- Repository URL
- Last update time

### Problem

The agent previously had no external live data source.

### Change

Added a server-side `fetch()` request to the GitHub REST API.

### Result

StudyPilot can now retrieve real-time information from GitHub instead of generating or guessing repository information.

---

## Iteration 4 — GitHub Result UI

### Implemented

Added a `GitHubRepositoryCard` component.

The frontend displays the live GitHub result with:

- Repository information
- Stars
- Forks
- Issues
- Language
- Default branch
- Link to the repository

A `Live GitHub Data` indicator was also added to make the external data source clear to the user.

---

## Iteration 5 — Conversation Context

### Implemented

Updated the system prompt so the agent uses previous messages in the current conversation.

The agent can now understand follow-up requests such as:

- "Make it harder."
- "Add two more days."
- "Change this to React."
- "Continue the plan."
- "Explain the second topic."

### Goal

Avoid asking the student for information that has already been provided earlier in the conversation.

---

## UI / UX Improvements

The existing StudyPilot chat interface was preserved.

The chat area was changed to a dark interface while keeping:

- User messages in blue
- AI messages in dark gray
- Example prompts
- Streaming state
- Stop button
- Retry functionality
- Error handling
- Auto-scroll
- Jump-to-latest button
- Responsive layout

Tool results use dedicated cards instead of displaying raw JSON.

---

## Errors and Changes

### AI API / quota errors

The chat interface already included handling for:

- HTTP 429
- Rate limits
- Usage limits
- Quota errors

The UI displays a user-friendly error message instead of exposing technical details.

### Network errors

Network, fetch, connection, and aborted-request errors are handled separately.

The user is informed that the connection was interrupted and can retry the response.

### Tool errors

Tool failures are represented with dedicated error states in the chat interface.

---

## Scope Decisions

The original concept could include many additional capabilities, such as:

- Multiple external APIs
- Authentication-aware personalization
- Long-term memory
- Calendar integration
- Notifications
- Multiple study resources
- Automatic progress tracking
- MCP integrations

These were intentionally not implemented in the MVP.

The scope was reduced to:

1. Study-plan generation
2. Study-related AI conversation
3. One live external data connection through GitHub

This keeps the agent focused on its core job while satisfying the FL-07 MVP requirements.

---

## Current Architecture

```text
User
  |
  v
StudyPilot Chat UI
  |
  v
/api/chat
  |
  v
StudyPilot AI Agent
  |
  +----------------------+
  |                      |
  v                      v
createStudyPlan      getGitHubRepository
  |                      |
  v                      v
Structured result    GitHub REST API
  |                      |
  +----------+-----------+
             |
             v
        AI response
             |
             v
        Chat UI cards