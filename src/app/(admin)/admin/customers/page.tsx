"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { format } from "date-fns";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAdminCustomers } from "@/lib/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

function CustomersContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useAdminCustomers({
    search: search || undefined,
    page,
    size: 20,
  });

  const customers = (data?.content ?? data) as any[];
  const paged = data && "totalPages" in data ? data : null;

  return (
    <>
      <AdminHeader title="Customers" />
      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !customers?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-sm">{c.fullName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.businessName ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{c.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.phoneNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm">{c.orderCount ?? 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.createdAt
                        ? format(new Date(c.createdAt), "dd MMM yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={c.active !== false ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {c.active !== false ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paged && paged.totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Page {(paged.number ?? 0) + 1} of {paged.totalPages} —{" "}
              {paged.totalElements} customers
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={paged.first}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={paged.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function CustomersPage() {
  return (
    <Suspense
      fallback={
        <>
          <AdminHeader title="Customers" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        </>
      }
    >
      <CustomersContent />
    </Suspense>
  );
}
