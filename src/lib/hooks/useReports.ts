"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";

export const reportKeys = {
  all: ["admin", "reports"] as const,
  summary: () => [...reportKeys.all, "summary"] as const,
  sales: (p?: object) => [...reportKeys.all, "sales", p ?? {}] as const,
  topProducts: (p?: object) => [...reportKeys.all, "top-products", p ?? {}] as const,
  customerActivity: (p?: object) => [...reportKeys.all, "customer-activity", p ?? {}] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: reportKeys.summary(),
    queryFn: reportsApi.getSummary,
    staleTime: 60_000,
  });
}

export function useSalesReport(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: reportKeys.sales(params),
    queryFn: () => reportsApi.getSalesReport(params),
    staleTime: 60_000,
  });
}

export function useTopProducts(params?: { limit?: number; from?: string; to?: string }) {
  return useQuery({
    queryKey: reportKeys.topProducts(params),
    queryFn: () => reportsApi.getTopProducts(params),
    staleTime: 60_000,
  });
}

export function useCustomerActivity(params?: { limit?: number }) {
  return useQuery({
    queryKey: reportKeys.customerActivity(params),
    queryFn: () => reportsApi.getCustomerActivity(params),
    staleTime: 60_000,
  });
}
