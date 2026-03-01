# E2E Tests with Playwright

This directory contains end-to-end tests for the Membership Loyalty Points application.

## Running Tests

```bash
# Run all tests in headless mode
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

## Test Files

- **auth.spec.ts** - Tests for authentication flows including login, error handling, and navigation
- **store-checkout.spec.ts** - Tests for store browsing, product viewing, and search functionality

## Configuration

The Playwright configuration is located in `playwright.config.ts` at the root of the frontend directory.

Key settings:
- Base URL: http://localhost:3000
- Test directory: ./e2e
- Browser: Chromium only (for speed)
- Web server automatically starts on `npm run dev` if not already running

## Writing Tests

Tests use Playwright's test API. Basic structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

## Best Practices

1. Use data-testid attributes for stable selectors
2. Wait for network idle or specific elements before assertions
3. Keep tests independent and isolated
4. Use descriptive test names that explain the expected behavior
5. Clean up test data in afterEach hooks if needed
