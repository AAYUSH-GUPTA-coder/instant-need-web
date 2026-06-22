import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types/order";

const STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: "PENDING",    label: "Order placed",  description: "Awaiting confirmation" },
  { status: "PROCESSING", label: "Processing",    description: "Being prepared" },
  { status: "SHIPPED",    label: "Shipped",       description: "On the way to you" },
  { status: "DELIVERED",  label: "Delivered",     description: "Order complete" },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: -1,
};

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
        <XCircle className="h-5 w-5 text-destructive shrink-0" />
        <div>
          <p className="text-sm font-medium text-destructive">Order Cancelled</p>
          <p className="text-xs text-muted-foreground">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER[status];

  return (
    <div className="relative flex items-start gap-0">
      {STEPS.map((step, i) => {
        const done    = i <  currentIdx || (i === currentIdx && i === STEPS.length - 1);
        const current = i === currentIdx && i < STEPS.length - 1;
        const future  = i >  currentIdx;
        const last    = i === STEPS.length - 1;

        return (
          <div key={step.status} className="flex-1 flex flex-col items-center">
            {/* Connector line */}
            <div className="flex items-center w-full">
              {/* Left segment */}
              <div className={cn(
                "flex-1 h-0.5",
                i === 0 ? "invisible" : done || current ? "bg-primary" : "bg-border"
              )} />

              {/* Icon */}
              <div className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background transition-colors",
                done    ? "border-primary bg-primary"        : "",
                current ? "border-primary"                   : "",
                future  ? "border-border"                    : ""
              )}>
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                ) : current ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground/40" />
                )}
              </div>

              {/* Right segment */}
              <div className={cn(
                "flex-1 h-0.5",
                last ? "invisible" : (done || current) ? "bg-primary" : "bg-border"
              )} />
            </div>

            {/* Label */}
            <div className="mt-2 text-center px-1">
              <p className={cn(
                "text-xs font-medium",
                done || current ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
              {(current || (done && i === STEPS.length - 1)) && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
