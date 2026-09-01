import { test, expect } from "@playwright/test";

test("user can start a StudyPilot AI conversation", async ({ page }) => {
    await page.goto("/");

    const input = page.getByRole("textbox", {
        name: "Ask StudyPilot",
    });

    await expect(input).toBeVisible();

    await input.fill("Explain JavaScript promises");

    await expect(
        page.getByRole("button", {
            name: "Send",
        })
    ).toBeEnabled();

    await page.getByRole("button", {
        name: "Send",
    }).click();

    await expect(
        page.getByRole("button", {
            name: /Stop|Send/,
        })
    ).toBeVisible();
});