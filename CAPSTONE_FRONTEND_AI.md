# Ship It — Production AI Product

## Project Brief

StudyPilot is an AI-enhanced study planning application that helps students organize their study tasks and generate personalized study plans. It combines task management with AI-powered planning and GitHub repository information, giving students a practical workspace for planning and managing their studies. I chose this idea because students often need to turn broad study goals into structured, actionable plans.

## Live Application

https://studypilot-coral.vercel.app/

## Repository

https://github.com/sevincyunusova/studypilot

## Architecture

StudyPilot is built with Next.js, React, Tailwind CSS, Supabase, and the Vercel AI SDK.

- Next.js provides the application framework and API routes.
- React provides the frontend components and interactive UI.
- Tailwind CSS handles responsive styling.
- Supabase provides authentication and task data.
- The AI SDK handles AI chat and tool calling.
- Google Gemini generates study plans and supports AI interactions.
- GitHub REST API integration provides repository information.

## AI Integration

The application uses AI to solve practical study-planning tasks rather than functioning only as a basic chatbot.

The study planner accepts a goal, exam date, available study hours, level, and subjects, then generates a structured study plan.

The AI chat can also use tools such as GitHub repository lookup to retrieve information about a repository.

Example study-plan request:

"Create a 5-day study plan for my calculus exam. I have 2 hours per day and need to study derivatives, integrals, and limits."

Example GitHub request:

"Show me information about the sevincyunusova/studypilot GitHub repository."

The application also handles AI failures and provides retry behavior instead of leaving the user with an unexplained broken state.

## Testing Evidence

The project has automated evaluation coverage documented in `docs/EVAL_V2.md`.

- Unit tests: 9/9 passed
- End-to-end tests: 3/3 passed
- Total automated tests: 12/12 passed
- Production build: passed
- TypeScript validation: passed

The end-to-end tests cover sending a message, handling an AI response failure, and retrying the request.

## Performance & Accessibility

The production application was audited with Lighthouse and WAVE.

- Lighthouse mobile performance score: 90
- WAVE: 1 error
- WAVE contrast errors: 0

One concrete improvement was optimizing the production application and reducing the Lighthouse mobile issues from the earlier audit.

The application also includes a reduced-motion fallback for the 3D study scene.

## Deployment & Operation

The application is deployed on Vercel.

Production-readiness work included:

- Production deployment
- Input limits
- Rate limiting considerations
- Error handling
- AI retry behavior
- Cross-browser considerations
- Production README documentation

If a production deployment needs to be rolled back, the previous working deployment can be restored through the Vercel deployment history or by redeploying a known-good commit from the main branch.

## Known Limitations

AI-generated study plans and responses are probabilistic and should be reviewed by the user.

The automated evaluation focuses mainly on UI behavior, error handling, retry behavior, and build correctness. It does not fully measure the quality of AI-generated study recommendations.

## Reflection

The hardest part was bringing the project from an AI-enabled prototype to a production-ready application. The work required more than connecting an AI model: error states, retry behavior, testing, accessibility, performance, deployment, and documentation all needed to work together.

If I built it again, I would plan the testing and production constraints earlier instead of adding some of them near the end of development.

One thing that surprised me was how much of production AI engineering is about handling failure and uncertainty rather than only generating a successful AI response. A useful AI feature needs predictable UI behavior, clear error states, testing, and limitations that users can understand.


## Deployment Checklist

- [x] Production deployment is live
- [x] Production URL verified
- [x] README includes setup and usage information
- [x] AI integration documented
- [x] Error handling and retry behavior implemented
- [x] Automated tests pass
- [x] Production build passes
- [x] TypeScript validation passes
- [x] Lighthouse audit completed
- [x] Accessibility audit completed
- [x] Known AI limitations documented
- [x] Rollback approach documented

## Audit Results

### Lighthouse

Mobile Lighthouse score: 90.

### WAVE

WAVE audit results:
- 1 error
- 0 contrast errors

These audits were used to identify and improve production accessibility and performance issues.

## Production URL

https://studypilot-coral.vercel.app/

## GitHub Repository

https://github.com/sevincyunusova/studypilot