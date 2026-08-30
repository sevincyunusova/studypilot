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
};