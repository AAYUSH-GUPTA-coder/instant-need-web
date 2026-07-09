"use client";

import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>No internet connection, check your Wi-Fi or mobile data</span>
    </div>
  );
}
