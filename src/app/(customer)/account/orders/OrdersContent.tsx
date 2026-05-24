"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/catalog/Pagination";
import { useMyOrders } from "@/lib/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function OrdersContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "0", 10);

  const { data, isLoading } = useMyOrders({ page, size: PAGE_SIZE });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        description="Your orders will appear here once you place one."
        action={
          <Link href="/products" className={cn(buttonVariants())}>
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {data.totalElements} order{data.totalElements !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {data.content.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3.5 hover:border-muted-foreground/40 transition-colors group"
          >
            {/* Order info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium font-mono">
                  {order.orderNumber}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(order.placedAt)}</span>
                <span>·</span>
                <span>
                  {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold">
                {formatCurrency(order.totalAmount, order.currencyCode)}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination currentPage={data.number} totalPages={data.totalPages} />
      )}
    </div>
  );
}
