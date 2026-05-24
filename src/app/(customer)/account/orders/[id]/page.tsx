"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusTimeline } from "@/components/account/OrderStatusTimeline";
import { useOrder, useCancelOrder } from "@/lib/hooks/useOrders";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);
  const { mutateAsync: cancelOrder, isPending: isCancelling } = useCancelOrder();

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(id);
      toast.success("Order cancelled successfully");
    } catch {
      toast.error("Could not cancel order. Please contact support.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        icon={Package}
        title="Order not found"
        description="This order doesn't exist or doesn't belong to your account."
        action={
          <Link href="/account/orders" className="text-sm text-primary hover:underline">
            Back to orders
          </Link>
        }
      />
    );
  }

  const canCancel = order.status === "PENDING";

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/account/orders"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold font-mono">{order.orderNumber}</h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDateTime(order.placedAt)}
            </p>
          </div>

          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              {isCancelling ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="mr-2 h-3.5 w-3.5" />
              )}
              Cancel order
            </Button>
          )}
        </div>
      </div>

      {/* Status timeline */}
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm font-medium mb-5">Order status</p>
        <OrderStatusTimeline status={order.status} />
      </div>

      {/* Items */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/30">
          <p className="text-sm font-medium">
            Items ({order.items?.length ?? 0})
          </p>
        </div>

        <div className="divide-y">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3">
              <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-muted-foreground/30" strokeWidth={1} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  SKU: {item.sku} · Qty: {item.quantity} ×{" "}
                  {formatCurrency(item.unitPrice, item.currencyCode)}
                </p>
              </div>
              <p className="text-sm font-semibold shrink-0">
                {formatCurrency(item.lineTotal, item.currencyCode)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 bg-muted/20 border-t space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotalAmount, order.currencyCode)}</span>
          </div>
          {order.shippingAmount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingAmount, order.currencyCode)}</span>
            </div>
          )}
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>−{formatCurrency(order.discountAmount, order.currencyCode)}</span>
            </div>
          )}
          <Separator className="my-1.5" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount, order.currencyCode)}</span>
          </div>
        </div>
      </div>

      {/* Shipping + payment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Shipping address
          </div>
          {order.shippingAddress ? (
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              {order.shippingAddress.phoneNumber && (
                <p>+91 {order.shippingAddress.phoneNumber}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not available</p>
          )}
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Payment
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
          </p>
          {order.notes && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-1">Note</p>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
