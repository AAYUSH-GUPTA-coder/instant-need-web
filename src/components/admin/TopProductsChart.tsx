"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TopProductEntry } from "@/lib/types/admin";
import { truncate } from "@/lib/utils";

interface TopProductsChartProps {
  data: TopProductEntry[];
  isLoading?: boolean;
}

export function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
        <CardContent><Skeleton className="h-56 w-full" /></CardContent>
      </Card>
    );
  }

  const chartData = data.slice(0, 6).map((p) => ({
    name: truncate(p.productName, 18),
    revenue: p.totalRevenue,
    qty: p.totalQuantity,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Products by Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-56 text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
