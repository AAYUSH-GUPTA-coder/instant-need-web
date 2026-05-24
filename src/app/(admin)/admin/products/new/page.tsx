"use client";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <AdminHeader title="New Product" />
      <div className="p-6">
        <ProductForm />
      </div>
    </>
  );
}
