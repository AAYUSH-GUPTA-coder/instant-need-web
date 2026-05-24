import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdersContent } from "./OrdersContent";

function OrdersLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">My Orders</h2>
        <p className="text-sm text-muted-foreground">
          Track and manage all your orders
        </p>
      </div>
      <Suspense fallback={<OrdersLoading />}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
