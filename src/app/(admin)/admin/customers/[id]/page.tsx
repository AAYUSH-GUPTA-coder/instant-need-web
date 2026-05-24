"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAdminCustomer } from "@/lib/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params);
  const { data, isLoading } = useAdminCustomer(id);

  // The admin customer API response may have nested profile + orders
  const customer = data as any;

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Customer" />
        <div className="p-6 space-y-4 max-w-4xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    );
  }

  if (!customer) {
    return (
      <>
        <AdminHeader title="Customer" />
        <div className="p-6">
          <p className="text-muted-foreground">Customer not found.</p>
        </div>
      </>
    );
  }

  const orders: any[] = customer.orders ?? customer.recentOrders ?? [];

  return (
    <>
      <AdminHeader
        title={customer.fullName ?? "Customer"}
        actions={
          <Link
            href="/admin/customers"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        }
      />
      <div className="p-6 space-y-5 max-w-4xl">
        {/* Profile */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">{customer.fullName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Business</p>
                <p className="font-medium">{customer.businessName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phoneNumber ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-medium">
                  {customer.createdAt
                    ? format(new Date(customer.createdAt), "dd MMM yyyy")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge
                  variant={customer.active !== false ? "default" : "secondary"}
                  className="text-xs mt-0.5"
                >
                  {customer.active !== false ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {(customer.orderCount !== undefined || customer.totalRevenue !== undefined) && (
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Orders
                </p>
                <p className="text-2xl font-bold mt-1">{customer.orderCount ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(customer.totalRevenue ?? 0, "INR")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Avg. Order Value
                </p>
                <p className="text-2xl font-bold mt-1">
                  {customer.orderCount
                    ? formatCurrency(
                        (customer.totalRevenue ?? 0) / customer.orderCount,
                        "INR"
                      )
                    : "—"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Order History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Order History</CardTitle>
            <Link
              href={`/admin/orders?customerId=${id}`}
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground p-5">No orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${STATUS_BADGE[order.status] ?? ""}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatCurrency(order.totalAmount, order.currencyCode ?? "INR")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.placedAt
                          ? format(new Date(order.placedAt), "dd MMM yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
