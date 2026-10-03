"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminOrdersApi } from "@/lib/api/orders";
import { downloadBlob, invoicePdfFilename } from "@/lib/utils";

/** Downloads an invoice through the admin API. */
export function useInvoiceDownload(orderId: string, invoiceNumber?: string, orderNumber?: string) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    setIsLoading(true);
    try {
      const blob = await adminOrdersApi.downloadInvoice(orderId);
      downloadBlob(blob, invoicePdfFilename(invoiceNumber, orderNumber || orderId));
    } catch {
      toast.error("Could not load invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return { handleDownload, isLoading };
}
