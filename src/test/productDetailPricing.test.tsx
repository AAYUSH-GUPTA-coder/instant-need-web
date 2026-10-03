import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import { PricingTiersTable } from "@/components/catalog/PricingTiersTable";
import type { ProductDTO } from "@/lib/types/catalog";

const tiers = [
  { id: "first", minQty: 1, maxQty: 10, unitPrice: 1000, discountPercent: 0, currencyCode: "INR" },
  { id: "second", minQty: 11, maxQty: 20, unitPrice: 900, discountPercent: 0, currencyCode: "INR" },
  { id: "third", minQty: 21, unitPrice: 800, discountPercent: 0, currencyCode: "INR" },
];

const product = {
  id: "product-id", name: "Test Product", slug: "test-product", sku: "TEST",
  categoryId: "category-id", categoryName: "Category", basePrice: 1000,
  currencyCode: "INR", stock: 30, moq: 1, active: true, images: [], pricingTiers: tiers,
} as ProductDTO;

describe("product detail pricing", () => {
  it("does not render zero for a tier without a discount", () => {
    render(<PricingTiersTable tiers={tiers} currencyCode="INR" basePrice={1000} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("updates the total using the unit price for the selected quantity tier", () => {
    render(<AddToCartButton product={product} />);
    const quantity = screen.getByRole("spinbutton");

    expect(screen.getByText("₹1,000.00")).toBeInTheDocument();
    fireEvent.change(quantity, { target: { value: "3" } });
    expect(screen.getByText("₹3,000.00")).toBeInTheDocument();
    fireEvent.change(quantity, { target: { value: "11" } });
    expect(screen.getByText("₹9,900.00")).toBeInTheDocument();
    fireEvent.change(quantity, { target: { value: "21" } });
    expect(screen.getByText("₹16,800.00")).toBeInTheDocument();
  });
});
