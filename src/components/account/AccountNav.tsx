"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  KeyRound,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NAV_ITEMS = [
  { label: "My Profile",       href: "/account/profile",         icon: User },
  { label: "My Orders",        href: "/account/orders",          icon: ShoppingBag },
  { label: "Addresses",        href: "/account/addresses",       icon: MapPin },
  { label: "Change Password",  href: "/account/change-password", icon: KeyRound },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    router.push("/login");
    toast.success("Logged out");
  }

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors mt-2"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Log out
      </button>
    </nav>
  );
}

/** Compact horizontal tab strip for mobile */
export function AccountNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 border-b">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 shrink-0 px-3 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
