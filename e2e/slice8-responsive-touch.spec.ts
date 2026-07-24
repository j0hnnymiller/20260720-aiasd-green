import { expect, test } from "@playwright/test";

test.describe("Slice 8: Responsive Touch Experience", () => {
  test("mobile viewport (375x667) renders a usable calculator layout", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.getByRole("main", { name: "Calculator" })).toBeVisible();

    // Basic interaction works at mobile size
    await page.getByRole("button", { name: "5" }).click();
    await expect(page.getByLabel("Display")).toHaveText("5");
  });

  test("desktop viewport (1280x720) renders a usable calculator layout", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    await expect(page.getByRole("main", { name: "Calculator" })).toBeVisible();

    await page.getByRole("button", { name: "9" }).click();
    await expect(page.getByLabel("Display")).toHaveText("9");
  });

  test("digit buttons meet the 44x44 CSS-pixel touch-target minimum", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const buttons = await page.getByRole("button").all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("UI remains operable at 200% zoom (narrow effective viewport)", async ({
    page,
  }) => {
    // At 200% browser zoom on a 780px desktop the effective CSS viewport is 390px.
    // Testing at 390px verifies the layout stays intact at that breakpoint.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("main", { name: "Calculator" })).toBeVisible();

    // Full arithmetic workflow should complete without layout issues
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "+" }).click();
    await page.getByRole("button", { name: "2" }).click();
    await page.getByRole("button", { name: "=" }).click();

    await expect(page.getByLabel("Display")).toHaveText("5");
  });
});
