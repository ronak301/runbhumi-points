// @ts-check
const { test, expect } = require("@playwright/test");

const PICKLEX_PHONE = "9876543210";
const PICKLEX_PASSWORD = "picklex";

function getNextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  if (d <= new Date()) d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

test.describe("PickleX booking sandbox", () => {
  test("login and open add booking", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Mobile Number").fill(PICKLEX_PHONE);
    await page.getByPlaceholder("Password", { exact: true }).fill(PICKLEX_PASSWORD);
    await page.getByRole("button", { name: /login/i }).click();
    await expect(page).toHaveURL(/\/home\/property\/2H3Ld4uq17AeCtfXpuo0/);
    await expect(page.getByText("PickleX", { exact: false })).toBeVisible();
  });

  test("court tabs visible on add booking", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Mobile Number").fill(PICKLEX_PHONE);
    await page.getByPlaceholder("Password", { exact: true }).fill(PICKLEX_PASSWORD);
    await page.getByRole("button", { name: /login/i }).click();
    await expect(page).toHaveURL(/\/home\/property\//);
    await page.getByRole("button", { name: "Add Booking" }).click();
    await expect(page).toHaveURL(/add-booking/);
    await expect(page.getByRole("tab", { name: "Court 1" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Court 2" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Court 3" })).toBeVisible();
  });

  test("weekend 7-8 PM shows total 1200", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Mobile Number").fill(PICKLEX_PHONE);
    await page.getByPlaceholder("Password", { exact: true }).fill(PICKLEX_PASSWORD);
    await page.getByRole("button", { name: /login/i }).click();
    await expect(page).toHaveURL(/\/home\/property\//);
    await page.getByRole("button", { name: "Add Booking" }).click();
    await expect(page).toHaveURL(/add-booking/);

    await page.getByPlaceholder("Name").fill("E2E Test");
    await page.getByPlaceholder("Phone Number").fill("9999999999");

    const nextSat = getNextSaturday();
    await page.locator('input[type="date"]').fill(nextSat);

    await page.getByRole("tab", { name: "Court 1" }).click();
    await page.getByRole("button", { name: "7 - 7:30 PM" }).click();
    await page.getByRole("button", { name: "7:30 - 8 PM" }).click();

    const totalInput = page.getByPlaceholder("Total Amount");
    await expect(totalInput).toHaveValue("1200");
  });

  test("weekday 7-8 PM shows total 600", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Mobile Number").fill(PICKLEX_PHONE);
    await page.getByPlaceholder("Password", { exact: true }).fill(PICKLEX_PASSWORD);
    await page.getByRole("button", { name: /login/i }).click();
    await expect(page).toHaveURL(/\/home\/property\//);
    await page.getByRole("button", { name: "Add Booking" }).click();
    await expect(page).toHaveURL(/add-booking/);

    await page.getByPlaceholder("Name").fill("E2E Weekday");
    await page.getByPlaceholder("Phone Number").fill("9999999998");

    const nextWed = (() => {
      const d = new Date();
      d.setDate(d.getDate() + ((3 - d.getDay() + 7) % 7));
      if (d <= new Date()) d.setDate(d.getDate() + 7);
      return d.toISOString().slice(0, 10);
    })();
    await page.locator('input[type="date"]').fill(nextWed);

    await page.getByRole("tab", { name: "Court 1" }).click();
    await page.getByRole("button", { name: "7 - 7:30 PM" }).click();
    await page.getByRole("button", { name: "7:30 - 8 PM" }).click();

    const totalInput = page.getByPlaceholder("Total Amount");
    await expect(totalInput).toHaveValue("600");
  });
});
