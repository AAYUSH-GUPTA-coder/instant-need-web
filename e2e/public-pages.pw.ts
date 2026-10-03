import { expect, test, type Page } from "@playwright/test";

const product = {
  id: "product-1",
  name: "Sample Bulk Paper",
  slug: "sample-bulk-paper",
  sku: "PAPER-001",
  categoryName: "Office Supplies",
  basePrice: 120,
  currencyCode: "INR",
  stock: 100,
  moq: 10,
  active: true,
};

async function mockCatalog(page: Page) {
  await page.route((url) => url.pathname === "/api/v1/categories", (route) =>
    route.fulfill({ json: [{ id: "category-1", name: "Office Supplies", slug: "office-supplies" }] }),
  );
  await page.route((url) => url.pathname === "/api/v1/products", (route) =>
    route.fulfill({ json: { items: [product], page: 1, limit: 20, total: 1 } }),
  );
}

test("home and catalog render without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await mockCatalog(page);

  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "Wholesale made simple" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Sample Bulk Paper/ })).toBeVisible();

  await page.getByRole("link", { name: /Browse Catalog/ }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Sample Bulk Paper/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("sign in page loads and validates empty submission", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/login");
  await expect(page.getByRole("textbox", { name: "Email or Phone" })).toBeVisible();
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email or phone is required")).toBeVisible();
  expect(errors).toEqual([]);
});

test("product detail updates tier price and adds the selected quantity to cart", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await mockCatalog(page);
  await page.route("**/api/v1/products/sample-bulk-paper", (route) =>
    route.fulfill({
      json: {
        ...product,
        basePrice: 1000,
        moq: 1,
        categoryId: "category-1",
        categorySlug: "office-supplies",
        images: [],
        pricingTiers: [
          { id: "tier-1", minQty: 1, maxQty: 10, unitPrice: 1000, discountPercent: 0, currencyCode: "INR" },
          { id: "tier-2", minQty: 11, unitPrice: 900, discountPercent: 0, currencyCode: "INR" },
        ],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    }),
  );

  await page.goto("/products/sample-bulk-paper");
  await expect(page.getByRole("heading", { name: "Sample Bulk Paper" })).toBeVisible();
  await expect(page.getByText("0", { exact: true })).toHaveCount(0);
  const quantity = page.locator('input[type="number"]');
  const total = page.getByText("Total", { exact: true }).locator("..");
  await expect(total).toContainText("₹1,000.00");
  await quantity.fill("3");
  await expect(total).toContainText("₹3,000.00");
  await quantity.fill("5");
  await expect(total).toContainText("₹5,000.00");
  await quantity.fill("11");
  await expect(total).toContainText("₹9,900.00");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText("11 items added")).toBeVisible();
  expect(errors).toEqual([]);
});
