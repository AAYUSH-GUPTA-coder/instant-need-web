import { describe, it, expect } from "vitest";
import { calcTotalPages, type PagedResponse } from "@/lib/types/common";

// ── calcTotalPages ──────────────────────────────────────────────────────────

describe("calcTotalPages", () => {
  it("returns correct page count when total is a multiple of limit", () => {
    expect(calcTotalPages({ total: 40, limit: 20 })).toBe(2);
  });

  it("rounds up when total is not a multiple of limit", () => {
    expect(calcTotalPages({ total: 21, limit: 20 })).toBe(2);
  });

  it("returns 1 when total fits on a single page", () => {
    expect(calcTotalPages({ total: 5, limit: 20 })).toBe(1);
  });

  it("returns 0 when total is 0", () => {
    expect(calcTotalPages({ total: 0, limit: 20 })).toBe(0);
  });

  it("returns 0 when limit is 0 (avoids division-by-zero)", () => {
    expect(calcTotalPages({ total: 100, limit: 0 })).toBe(0);
  });

  it("handles large totals correctly", () => {
    expect(calcTotalPages({ total: 10_000, limit: 20 })).toBe(500);
  });
});

// ── PagedResponse null-safety patterns ─────────────────────────────────────

describe("PagedResponse null-safety patterns", () => {
  function makeResponse<T>(items: T[], page = 1, limit = 20, total?: number): PagedResponse<T> {
    return { items, page, limit, total: total ?? items.length };
  }

  it("items array access never throws when items is present", () => {
    const res = makeResponse([1, 2, 3]);
    expect(res.items.length).toBe(3);
  });

  it("optional chaining on undefined response returns undefined safely", () => {
    const res = undefined as PagedResponse<number> | undefined;
    expect(res?.items).toBeUndefined();
    expect(res?.items?.length).toBeUndefined();
  });

  it("nullish coalescing fallback yields empty array when response is undefined", () => {
    const res = undefined as PagedResponse<number> | undefined;
    const items = res?.items ?? [];
    expect(items).toHaveLength(0);
    expect(items.length).toBe(0); // no TypeError
  });

  it("nullish coalescing fallback yields empty array when items is empty", () => {
    const res = makeResponse<number>([], 1, 20, 0);
    const items = res?.items ?? [];
    expect(items).toHaveLength(0);
  });

  it("page 1-indexed maps correctly to 0-indexed for Pagination component", () => {
    const res = makeResponse([1, 2], 3, 20, 60); // page 3 from backend
    const paginationPage = res.page - 1; // 0-indexed
    expect(paginationPage).toBe(2);
  });

  it("page offset +1 converts URL 0-index to backend 1-index", () => {
    const urlPage = 0; // first page in URL
    const apiPage = urlPage + 1;
    expect(apiPage).toBe(1); // backend receives 1 = first page

    const urlPage2 = 2; // third page in URL
    const apiPage2 = urlPage2 + 1;
    expect(apiPage2).toBe(3); // backend receives 3 = third page
  });

  it("totalPages computed from response is consistent with isFirst/isLast logic", () => {
    const firstPage = makeResponse([1], 1, 20, 45);
    const lastPage = makeResponse([1], 3, 20, 45);
    const total = calcTotalPages(firstPage);

    expect(total).toBe(3);
    expect(firstPage.page <= 1).toBe(true);  // isFirst
    expect(lastPage.page >= total).toBe(true); // isLast
    expect(firstPage.page >= total).toBe(false); // first page is not last
  });
});
