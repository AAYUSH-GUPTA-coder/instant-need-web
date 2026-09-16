"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ordersApi, adminOrdersApi } from "@/lib/api/orders";
import { downloadBlob, invoicePdfFilename } from "@/lib/utils";

/** Fetches an order's invoice PDF through the authenticated API and downloads it with its invoice filename. */
export function useInvoiceDownload(orderId: string, admin = false, invoiceNumber?: string, orderNumber?: string) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    setIsLoading(true);
    try {
      const blob = admin
        ? await adminOrdersApi.downloadInvoice(orderId)
        : await ordersApi.downloadInvoice(orderId);
      downloadBlob(blob, invoicePdfFilename(invoiceNumber, orderNumber || orderId));
    } catch {
      toast.error("Could not load invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return { handleDownload, isLoading };
}
