import { test, expect } from "@playwright/test";

test("user can send a message to StudyPilot", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    const body = [
      `data: ${JSON.stringify({
        type: "start",
        messageId: "mock-message-id",
      })}\n\n`,

      `data: ${JSON.stringify({
        type: "text-start",
        id: "text-1",
      })}\n\n`,

      `data: ${JSON.stringify({
        type: "text-delta",
        id: "text-1",
        delta:
          "JavaScript promises allow asynchronous operations to be handled cleanly.",
      })}\n\n`,

      `data: ${JSON.stringify({
        type: "text-end",
        id: "text-1",
      })}\n\n`,

      `data: ${JSON.stringify({
        type: "finish",
      })}\n\n`,
    ].join("");

    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body,
    });
  });

  await page.goto("/");

  const input = page.getByLabel("Ask StudyPilot");

  await expect(input).toBeVisible({
    timeout: 10000,
  });

  await input.fill("Explain JavaScript promises");

  await page.getByRole("button", {
    name: "Send",
  }).click();

  await expect(
    page.getByText(
      "JavaScript promises allow asynchronous operations to be handled cleanly."
    )
  ).toBeVisible({
    timeout: 10000,
  });
});
test("shows error when AI response fails", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        error: "AI service unavailable",
      }),
    });
  });

  await page.goto("/");

  const input = page.getByLabel("Ask StudyPilot");

  await expect(input).toBeVisible({
    timeout: 10000,
  });

  await input.fill("Explain JavaScript promises");

  await page.getByRole("button", {
    name: "Send",
  }).click();

  await expect(
    page.getByText("AI response failed")
  ).toBeVisible({
    timeout: 15000,
  });

  await expect(
    page.getByRole("button", {
      name: "Retry failed response",
    })
  ).toBeVisible({
    timeout: 10000,
  });
});