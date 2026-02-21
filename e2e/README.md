# E2E tests (Playwright)

Runs in a real browser and clicks through the app like a user.

## One-time setup

```bash
npm install -D @playwright/test --legacy-peer-deps
npx playwright install chromium
```

(Use `--legacy-peer-deps` if you hit peer dependency conflicts with react-scripts.)

## Run tests (sandbox)

1. **Start the app** in another terminal:
   ```bash
   npm start
   ```

2. **Run the tests** (browser will open so you can watch):
   ```bash
   npx playwright test
   ```

   Or run a single test:
   ```bash
   npx playwright test -g "weekend 7-8 PM"
   ```

3. **Headless** (no browser window):
   ```bash
   npx playwright test --headed=false
   ```

## What is tested

- PickleX login and redirect to property home
- Court 1/2/3 tabs on Add Booking
- **Saturday 7–8 PM** → Total Amount **1200**
- **Weekday 7–8 PM** → Total Amount **600**
