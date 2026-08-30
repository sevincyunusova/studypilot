import { tool } from "ai";
import { z } from "zod";

export const studyTools = {
    createStudyPlan: tool({
        description:
            "Create a structured and personalized study plan based on the student's subject, level, available time, and topics.",

        inputSchema: z.object({
            subject: z
                .string()
                .min(1)
                .describe("The subject the student wants to study."),

            difficulty: z
                .enum(["beginner", "intermediate", "advanced"])
                .describe("The student's current knowledge level."),

            days: z
                .number()
                .int()
                .min(1)
                .max(30)
                .describe("Number of days available for studying."),

            hoursPerDay: z
                .number()
                .min(0.5)
                .max(12)
                .describe("Number of hours available per day."),

            topics: z
                .array(z.string().min(1))
                .min(1)
                .describe("Topics that should be included in the study plan."),
        }),

        execute: async ({
            subject,
            difficulty,
            days,
            hoursPerDay,
            topics,
        }) => {
            const schedule = Array.from({ length: days }, (_, index) => {
                const topic = topics[index % topics.length];

                let focus = "";

                if (difficulty === "beginner") {
                    focus =
                        "Learn the fundamentals, understand the core concepts, and complete basic practice exercises.";
                } else if (difficulty === "intermediate") {
                    focus =
                        "Review the concepts, solve practical exercises, and apply the knowledge to small problems.";
                } else {
                    focus =
                        "Study advanced concepts, solve challenging problems, and apply the knowledge to realistic scenarios.";
                }

                return {
                    day: index + 1,
                    topic,
                    hours: hoursPerDay,
                    focus,
                };
            });

            return {
                subject,
                difficulty,
                days,
                hoursPerDay,
                topics,
                schedule,
            };
        },
    }),

    getGitHubRepository: tool({
        description:
            "Fetch real-time information about a public GitHub repository. Use this when the student provides a GitHub repository in the owner/repository format and wants information about it.",

        inputSchema: z.object({
            owner: z
                .string()
                .min(1)
                .describe("GitHub repository owner or organization."),

            repository: z
                .string()
                .min(1)
                .describe("GitHub repository name."),
        }),

        execute: async ({ owner, repository }) => {
            const response = await fetch(
                `https://api.github.com/repos/${encodeURIComponent(
                    owner
                )}/${encodeURIComponent(repository)}`,
                {
                    headers: {
                        Accept: "application/vnd.github+json",
                        "X-GitHub-Api-Version": "2022-11-28",
                        "User-Agent": "StudyPilot-Agent",
                    },
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(
                        `GitHub repository ${owner}/${repository} was not found.`
                    );
                }

                throw new Error(
                    `GitHub API request failed with status ${response.status}.`
                );
            }

            const data = await response.json();

            return {
                name: data.name,
                fullName: data.full_name,
                description: data.description,
                language: data.language,
                stars: data.stargazers_count,
                forks: data.forks_count,
                openIssues: data.open_issues_count,
                defaultBranch: data.default_branch,
                url: data.html_url,
                updatedAt: data.updated_at,
            };
        },
    }),
};