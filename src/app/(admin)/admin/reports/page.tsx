"use client";

import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSalesReport, useTopProducts, useCustomerActivity } from "@/lib/hooks/useReports";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TopProductsChart } from "@/components/admin/TopProductsChart";
import { reportsApi } from "@/lib/api/reports";
import { formatCurrency } from "@/lib/utils";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const defaultTo = format(new Date(), "yyyy-MM-dd");
  const defaultFrom = format(subDays(new Date(), 29), "yyyy-MM-dd");

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);

  const params = useMemo(() => ({ from, to }), [from, to]);

  const { data: salesData, isLoading: salesLoading } = useSalesReport(params);
  const { data: topProducts, isLoading: topLoading } = useTopProducts({
    limit: 10,
    from,
    to,
  });
  const { data: customerActivity, isLoading: activityLoading } = useCustomerActivity({
    limit: 10,
  });

  async function handleExport(type: "csv" | "xlsx") {
    setExporting(type);
    try {
      const blob =
        type === "csv"
          ? await reportsApi.exportCsv({ from, to })
          : await reportsApi.exportXlsx({ from, to });
      const ext = type === "csv" ? "csv" : "xlsx";
      downloadBlob(blob, `orders-${from}-to-${to}.${ext}`);
      toast.success(`${type.toUpperCase()} exported`);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(null);
    }
  }

  return (
    <>
      <AdminHeader
        title="Reports"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={exporting !== null}
              onClick={() => handleExport("csv")}
            >
              {exporting === "csv" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Download className="h-4 w-4 mr-1" />
              )}
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={exporting !== null}
              onClick={() => handleExport("xlsx")}
            >
              {exporting === "xlsx" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Download className="h-4 w-4 mr-1" />
              )}
              XLSX
            </Button>
          </div>
        }
      />
      <div className="p-6 space-y-6">
        {/* Date Range picker */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label htmlFor="from" className="text-xs">
              From
            </Label>
            <Input
              id="from"
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="w-40 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="to" className="text-xs">
              To
            </Label>
            <Input
              id="to"
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="w-40 text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFrom(defaultFrom);
              setTo(defaultTo);
            }}
          >
            Last 30 days
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {salesLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(salesData?.totalRevenue ?? 0, "INR")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {salesData?.totalOrders ?? 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Avg. Order Value
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(salesData?.averageOrderValue ?? 0, "INR")}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <RevenueChart
              data={salesData?.breakdown ?? []}
              isLoading={salesLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <TopProductsChart data={topProducts ?? []} isLoading={topLoading} />
          </div>
        </div>

        {/* Top Products table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topLoading ? (
              <div className="p-5 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : !topProducts?.length ? (
              <p className="text-sm text-muted-foreground p-5">No data for this period.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Qty Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p, idx) => (
                    <TableRow key={p.productId}>
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{p.productName}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {p.sku}
                      </TableCell>
                      <TableCell className="text-right text-sm">{p.totalQuantity}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatCurrency(p.totalRevenue, p.currencyCode)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Customer Activity table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Customers by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activityLoading ? (
              <div className="p-5 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : !customerActivity?.length ? (
              <p className="text-sm text-muted-foreground p-5">No customer activity.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Last Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerActivity.map((c, idx) => (
                    <TableRow key={c.customerId}>
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{c.fullName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.businessName ?? "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm">{c.orderCount}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatCurrency(c.totalRevenue, "INR")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.lastOrderAt
                          ? format(new Date(c.lastOrderAt), "dd MMM yyyy")
                          : "—"}
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
