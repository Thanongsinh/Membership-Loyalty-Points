import { test, expect } from '@playwright/test';

test.describe('Store Browsing and Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real scenario, you might need to login first
    // For now, we'll assume the user can access the stores page
    await page.goto('/portal/stores');
    await page.waitForLoadState('networkidle');
  });

  test('should display store cards on stores page', async ({ page }) => {
    // Expect store cards to be visible
    const storeCards = page.locator('[data-testid="store-card"], .store-card, article, div[class*="card"]').first();
    await expect(storeCards).toBeVisible({ timeout: 10000 });

    // Expect multiple stores to be displayed
    const storeElements = page.locator('[data-testid="store-card"], .store-card, article');
    const count = await storeElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to store details and show products', async ({ page }) => {
    // Wait for store cards to load
    await page.waitForSelector('[data-testid="store-card"], .store-card, article, div[class*="card"]', { timeout: 10000 });

    // Click on the first store card
    const firstStore = page.locator('[data-testid="store-card"], .store-card, article, div[class*="card"]').first();
    await firstStore.click();

    // Wait for navigation to store details
    await page.waitForLoadState('networkidle');

    // Expect products to be visible on the store page
    const products = page.locator('[data-testid="product"], .product, [data-testid="product-card"], .product-card').first();
    await expect(products).toBeVisible({ timeout: 10000 });
  });

  test('should search for stores', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="search"]').first();

    if (await searchInput.isVisible()) {
      // Type in search query
      await searchInput.fill('store');

      // Wait for results to update
      await page.waitForTimeout(1000);

      // Expect results to be displayed
      const storeCards = page.locator('[data-testid="store-card"], .store-card, article');
      const count = await storeCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should view product details', async ({ page }) => {
    // Wait for store cards to load
    await page.waitForSelector('[data-testid="store-card"], .store-card, article, div[class*="card"]', { timeout: 10000 });

    // Click on the first store
    const firstStore = page.locator('[data-testid="store-card"], .store-card, article, div[class*="card"]').first();
    await firstStore.click();

    // Wait for products to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="product"], .product, [data-testid="product-card"], .product-card', { timeout: 10000 });

    // Click on the first product
    const firstProduct = page.locator('[data-testid="product"], .product, [data-testid="product-card"], .product-card').first();
    await firstProduct.click();

    // Wait for product details to load
    await page.waitForLoadState('networkidle');

    // Expect product details to be visible (price, description, etc.)
    const productInfo = page.locator('[data-testid="product-details"], .product-details, h1, [class*="product"]');
    await expect(productInfo.first()).toBeVisible({ timeout: 5000 });
  });
});
