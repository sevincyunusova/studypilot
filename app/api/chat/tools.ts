import { z } from "zod";

export const studyTool = {
    description: "Returns study information for a given subject.",

    inputSchema: z.object({
        subject: z
            .string()
            .describe("The subject the student wants information about"),
    }),

    execute: async ({ subject }: { subject: string }) => {
        return {
            subject,
            difficulty: "Medium",
            recommendedHours: 2,
            topics: [
                "Review fundamentals",
                "Practice exercises",
                "Take a short quiz",
            ],
        };
    },
};