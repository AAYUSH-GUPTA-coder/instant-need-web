"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ordersApi, adminOrdersApi } from "@/lib/api/orders";
import { viewBlobInNewTab } from "@/lib/utils";

/** Fetches an order's invoice PDF through the authenticated API and opens it in a new tab. */
export function useInvoiceDownload(orderId: string, admin = false) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleView() {
    setIsLoading(true);
    try {
      const blob = admin
        ? await adminOrdersApi.downloadInvoice(orderId)
        : await ordersApi.downloadInvoice(orderId);
      viewBlobInNewTab(blob);
    } catch {
      toast.error("Could not load invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return { handleView, isLoading };
}
