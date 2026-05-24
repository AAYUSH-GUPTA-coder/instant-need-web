"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { AccountNav, AccountNavTabs } from "@/components/account/AccountNav";
import { useCustomerProfile } from "@/lib/hooks/useCustomer";
import { Skeleton } from "@/components/ui/skeleton";

function AccountHeader() {
  const { data: profile, isLoading } = useCustomerProfile();

  return (
    <div className="mb-6 md:mb-8">
      {isLoading ? (
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold">{profile?.fullName ?? "My Account"}</h1>
          <p className="text-sm text-muted-foreground">
            {profile?.businessName} · {profile?.email}
          </p>
        </>
      )}
    </div>
  );
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account/profile");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <AccountHeader />

      {/* Mobile: horizontal tab strip */}
      <div className="md:hidden mb-6">
        <AccountNavTabs />
      </div>

      <div className="flex gap-8">
        {/* Desktop: left sidebar */}
        <aside className="hidden md:block w-52 shrink-0">
          <AccountNav />
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
