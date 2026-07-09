import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/catalog/ProductCard";
import { ProductsContent } from "./ProductsContent";

export const metadata = {
  title: "Products | InstantNeed",
  description: "Browse our wholesale product catalog",
};

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse our full wholesale catalog
        </p>
      </div>
      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
