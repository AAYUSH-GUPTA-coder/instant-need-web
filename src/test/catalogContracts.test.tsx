import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { ProductDTO } from "@/lib/types/catalog";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  update: vi.fn(),
  push: vi.fn(),
}));

vi.mock("@/lib/api/client", () => ({ default: { get: mocks.get, post: mocks.post } }));
vi.mock("../../../instant-need-shared/src/api/client", () => ({ default: { get: mocks.get, post: mocks.post } }));
vi.mock("@/lib/hooks/useCatalog", () => ({
  useCategories: () => ({ data: [{ id: "category-id", name: "Supplies" }], isLoading: false }),
}));
vi.mock("@/lib/hooks/useAdmin", () => ({
  useCreateProduct: () => ({ mutateAsync: vi.fn() }),
  useUpdateProduct: () => ({ mutateAsync: mocks.update }),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock("@/components/admin/ImageUploader", () => ({ ImageUploader: () => null }));

import { pincodeApi } from "@/lib/api/catalog";
import { catalogApi as sharedCatalogApi } from "../../../instant-need-shared/src/api/catalog";
import { ordersApi as webOrdersApi } from "@/lib/api/orders";
import { ordersApi as sharedOrdersApi } from "../../../instant-need-shared/src/api/orders";
import { ProductForm } from "@/components/admin/ProductForm";

beforeEach(() => vi.clearAllMocks());

describe("catalog contracts", () => {
  it("treats a resolved HTTP 204 as no pincode rule", async () => {
    mocks.get.mockResolvedValue({ status: 204, data: "" });
    await expect(pincodeApi.getMinOrder("411001")).resolves.toBeNull();
    await expect(sharedCatalogApi.getPincodeMinOrder("411001")).resolves.toBeNull();
  });

  it("sends the same idempotency header from both order clients", async () => {
    mocks.post.mockResolvedValue({ data: { id: "order-id" } });
    const body = { items: [{ productId: "product-id", quantity: 1 }], paymentMethod: "cod" };
    await webOrdersApi.placeOrder(body, "retry-key");
    await sharedOrdersApi.placeOrder(body, "retry-key");
    expect(mocks.post).toHaveBeenCalledTimes(2);
    for (const call of mocks.post.mock.calls) {
      expect(call[2]).toEqual({ headers: { "Idempotency-Key": "retry-key" } });
    }
  });

  it("submits an empty tier array after the last tier is removed", async () => {
    mocks.update.mockResolvedValue({});
    const product = {
      id: "product-id", name: "Test Product", sku: "TEST-SKU", slug: "test-product",
      categoryId: "category-id", description: "", unitOfMeasurement: "Pcs",
      basePrice: 100, mrp: 115, hsnCode: "", cgstRate: 0, sgstRate: 0,
      currencyCode: "INR", stock: 5, moq: 1, active: true,
      pricingTiers: [{ id: "tier-id", minQty: 2, maxQty: 10, unitPrice: 95,
        discountPercent: 0, currencyCode: "INR" }],
    } as unknown as ProductDTO;
    render(<ProductForm product={product} />);
    await waitFor(() => expect(screen.getByLabelText("Product Name *")).toHaveValue("Test Product"));
    fireEvent.click(screen.getByRole("button", { name: "Remove tier 1" }));
    expect(screen.getByText(/No tiers configured/)).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: "Save Changes" }).closest("form")!);
    await waitFor(() => expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ pricingTiers: [] }),
    ));
  });
});
