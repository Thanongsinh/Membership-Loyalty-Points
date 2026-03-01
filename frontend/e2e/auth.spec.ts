import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Fill in login credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForURL(/\/(portal|dashboard)/);

    // Expect to be redirected to portal or dashboard
    expect(page.url()).toMatch(/\/(portal|dashboard)/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Click login button
    await page.click('button[type="submit"]');

    // Expect error message to appear
    await expect(page.locator('text=/error|invalid|failed/i')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to login page from home', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Expect login link or button to be visible
    const loginLink = page.locator('a[href="/login"], button:has-text("Login")').first();
    await expect(loginLink).toBeVisible();
  });
});
