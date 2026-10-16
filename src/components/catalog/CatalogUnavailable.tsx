import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function CatalogUnavailable({ retry }: { retry: () => void }) {
  return (
    <EmptyState
      icon={RefreshCw}
      title="Catalog temporarily unavailable"
      description="We couldn't load the catalog. Please try again in a moment."
      action={<Button type="button" variant="outline" onClick={retry}>Try again</Button>}
    />
  );
}
