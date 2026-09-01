import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AIChat from "@/components/AIChat";

const sendMessageMock = vi.fn();
const stopMock = vi.fn();
const regenerateMock = vi.fn();

let chatState = {
    messages: [],
    status: "ready",
    error: undefined as Error | undefined,
};

vi.mock("@ai-sdk/react", () => ({
    useChat: () => ({
        messages: chatState.messages,
        sendMessage: sendMessageMock,
        status: chatState.status,
        stop: stopMock,
        error: chatState.error,
        regenerate: regenerateMock,
    }),
}));

describe("AIChat", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        chatState = {
            messages: [],
            status: "ready",
            error: undefined,
        };
    });

    it("renders the welcome message when the chat is empty", () => {
        render(<AIChat />);

        expect(
            screen.getByRole("heading", {
                name: "Welcome to StudyPilot AI",
            })
        ).toBeInTheDocument();
    });

    it("renders the chat input with an accessible label", () => {
        render(<AIChat />);

        expect(
            screen.getByRole("textbox", {
                name: "Ask StudyPilot",
            })
        ).toBeInTheDocument();
    });

    it("disables Send when the input is empty", () => {
        render(<AIChat />);

        expect(
            screen.getByRole("button", {
                name: "Send",
            })
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
            screen.getByRole("button", {
                name: "Send",
            })
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
            screen.getByRole("button", {
                name: "Send",
            })
        );

        expect(sendMessageMock).toHaveBeenCalledWith({
            text: "Create a study plan",
        });
    });

    it("shows the loading skeleton while the request is submitted", () => {
        chatState.status = "submitted";

        render(<AIChat />);

        expect(
            document.querySelector(".animate-pulse")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Stop",
            })
        ).toBeInTheDocument();
    });

    it("shows the Stop button while the response is streaming", () => {
        chatState.status = "streaming";

        render(<AIChat />);

        expect(
            screen.getByRole("button", {
                name: "Stop",
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Send",
            })
        ).not.toBeInTheDocument();
    });

    it("shows an error message and retry button when the request fails", () => {
        chatState.error = new Error("Request failed");

        render(<AIChat />);

        expect(
            screen.getByRole("alert")
        ).toBeInTheDocument();

        expect(
            screen.getByText("AI response failed")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Retry failed response",
            })
        ).toBeInTheDocument();
    });

    it("retries a failed response", async () => {
        const user = userEvent.setup();

        chatState.error = new Error("Request failed");

        render(<AIChat />);

        await user.click(
            screen.getByRole("button", {
                name: "Retry failed response",
            })
        );

        expect(regenerateMock).toHaveBeenCalled();
    });
});