"use client";

import { use } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdminProduct } from "@/lib/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const { data: product, isLoading } = useAdminProduct(id);

  return (
    <>
      <AdminHeader title={isLoading ? "Edit Product" : `Edit: ${product?.name ?? ""}`} />
      <div className="p-6">
        {isLoading ? (
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : !product ? (
          <p className="text-muted-foreground">Product not found.</p>
        ) : (
          <ProductForm product={product} />
        )}
      </div>
    </>
  );
}
