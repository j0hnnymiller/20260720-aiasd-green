import { expect, test } from "@playwright/test";

test("Slice 1 digit entry updates display", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "1" }).click();
  await page.getByRole("button", { name: "2" }).click();
  await page.getByRole("button", { name: "3" }).click();

  await expect(page.getByLabel("Display")).toHaveText("123");
});
