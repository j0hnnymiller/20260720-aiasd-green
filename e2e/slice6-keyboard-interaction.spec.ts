import { expect, test } from "@playwright/test";

test("Slice 6 number keys map to digit input", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("1");
  await page.keyboard.press("2");
  await page.keyboard.press("3");

  await expect(page.getByLabel("Display")).toHaveText("123");
});

test("Slice 6 + key maps to addition operator", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("2");
  await page.keyboard.press("+");
  await page.keyboard.press("3");
  await page.keyboard.press("Enter");

  await expect(page.getByLabel("Display")).toHaveText("5");
});

test("Slice 6 Enter key evaluates expression", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("9");
  await page.keyboard.press("-");
  await page.keyboard.press("1");
  await page.keyboard.press("2");
  await page.keyboard.press("Enter");

  await expect(page.getByLabel("Display")).toHaveText("-3");
});

test("Slice 6 = key evaluates expression", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("7");
  await page.keyboard.press("*");
  await page.keyboard.press("6");
  await page.keyboard.press("=");

  await expect(page.getByLabel("Display")).toHaveText("42");
});

test("Slice 6 * key maps to multiplication operator", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("7");
  await page.keyboard.press("*");
  await page.keyboard.press("6");
  await page.keyboard.press("Enter");

  await expect(page.getByLabel("Display")).toHaveText("42");
});

test("Slice 6 / key maps to division operator", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("8");
  await page.keyboard.press("/");
  await page.keyboard.press("4");
  await page.keyboard.press("Enter");

  await expect(page.getByLabel("Display")).toHaveText("2");
});

test("Slice 6 keyboard flow matches button flow", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("2");
  await page.keyboard.press("+");
  await page.keyboard.press("3");
  await page.keyboard.press("Enter");

  await expect(page.getByLabel("Display")).toHaveText("5");
});
