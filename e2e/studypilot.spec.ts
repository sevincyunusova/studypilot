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
test("can retry a failed AI response", async ({ page }) => {
  let requestCount = 0;

  await page.route("**/api/chat", async (route) => {
    requestCount++;

    if (requestCount === 1) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "AI service unavailable",
        }),
      });

      return;
    }

    const body = [
      `data: ${JSON.stringify({
        type: "start",
        messageId: "retry-message-id",
      })}\n\n`,

      `data: ${JSON.stringify({
        type: "text-start",
        id: "retry-text-1",
      })}\n\n`,

      `data: ${JSON.stringify({
        type: "text-delta",
        id: "retry-text-1",
        delta: "Retry succeeded. Here is your study answer.",
      })}\n\n`,

      `data: ${JSON.stringify({
        type: "text-end",
        id: "retry-text-1",
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
    page.getByText("AI response failed")
  ).toBeVisible({
    timeout: 15000,
  });

  await page.getByRole("button", {
    name: "Retry failed response",
  }).click();

  await expect(
    page.getByText("Retry succeeded. Here is your study answer.")
  ).toBeVisible({
    timeout: 15000,
  });

  expect(requestCount).toBe(2);
});