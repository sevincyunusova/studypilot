import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AIChat from "@/components/AIChat";

const sendMessageMock = vi.fn();
const stopMock = vi.fn();
const regenerateMock = vi.fn();

vi.mock("@ai-sdk/react", () => ({
    useChat: () => ({
        messages: [],
        sendMessage: sendMessageMock,
        status: "ready",
        stop: stopMock,
        error: undefined,
        regenerate: regenerateMock,
    }),
}));

describe("AIChat", () => {
    it("renders the StudyPilot welcome message", () => {
        render(<AIChat />);

        expect(
            screen.getByRole("heading", { name: "Welcome to StudyPilot AI" })
        ).toBeInTheDocument();
    });

    it("renders the chat input with an accessible label", () => {
        render(<AIChat />);

        expect(
            screen.getByRole("textbox", { name: "Ask StudyPilot" })
        ).toBeInTheDocument();
    });

    it("renders the Send button", () => {
        render(<AIChat />);

        expect(
            screen.getByRole("button", { name: "Send" })
        ).toBeInTheDocument();
    });

    it("disables Send when the input is empty", () => {
        render(<AIChat />);

        expect(
            screen.getByRole("button", { name: "Send" })
        ).toBeDisabled();
    });

    it("enables Send when the user enters a message", async () => {
        const user = userEvent.setup();

        render(<AIChat />);

        const input = screen.getByRole("textbox", {
            name: "Ask StudyPilot",
        });

        await user.type(input, "Explain JavaScript promises");

        expect(
            screen.getByRole("button", { name: "Send" })
        ).toBeEnabled();
    });

    it("sends the user's message", async () => {
        const user = userEvent.setup();

        render(<AIChat />);

        const input = screen.getByRole("textbox", {
            name: "Ask StudyPilot",
        });

        await user.type(input, "Create a study plan");

        await user.click(
            screen.getByRole("button", { name: "Send" })
        );

        expect(sendMessageMock).toHaveBeenCalledWith({
            text: "Create a study plan",
        });
    });
});