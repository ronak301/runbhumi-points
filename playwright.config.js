// Playwright config for E2E tests. Run app with: npm start
// Then: npx playwright test
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: false,
    viewport: { width: 390, height: 844 },
  },
  projects: [{ name: "chromium", use: { ...devices["Pixel 5"] } }],
  webServer: process.env.CI
    ? { command: "npm start", url: "http://localhost:3000", timeout: 120000 }
    : undefined,
});
