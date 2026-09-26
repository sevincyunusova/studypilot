# StudyPilot

StudyPilot is an AI-powered study assistant for students. It helps users create structured study plans, ask study-related questions, and retrieve live information about public GitHub repositories.

## Live Demo

https://studypilot-coral.vercel.app/

## What StudyPilot Does

StudyPilot helps students turn study goals into practical plans and provides an AI assistant for study-related questions.

The agent supports three main workflows:

- AI study-plan generation
- Study-related AI conversation
- Live GitHub repository information retrieval

### Target Users

StudyPilot is designed for:

- University students
- Students preparing for exams
- High-school students
- Self-directed learners

## Core Features

### AI Study Planning

Students can provide their subject, difficulty level, available study time, number of days, and topics.

The agent uses the `createStudyPlan` tool to generate a structured study schedule.

### AI Study Assistant

Users can ask study-related questions and continue the conversation with follow-up requests.

The agent can use the existing conversation context when handling follow-up questions.

### GitHub Repository Information

StudyPilot includes a `getGitHubRepository` tool that retrieves live information about public GitHub repositories through the GitHub REST API.

The result can include:

- Repository name
- Description
- Primary language
- Stars
- Forks
- Open issues
- Default branch
- Repository URL
- Last update time

## Architecture

```text
User
  |
  v
StudyPilot UI
  |
  v
POST /api/chat
  |
  v
AI Agent
  |
  +------------------------+
  |                        |
  v                        v
createStudyPlan     getGitHubRepository
  |                        |
  v                        v
Study plan           GitHub REST API
  |                        |
  +------------+-----------+
               |
               v
          AI response
               |
               v
          StudyPilot UI