"use client";

import { type UseFormReturn } from "react-hook-form";
import { MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCustomerAddresses } from "@/lib/hooks/useCustomer";
import type { CheckoutFormData } from "@/lib/validations/checkout";

interface SavedAddressPickerProps {
  form: UseFormReturn<CheckoutFormData>;
  onAddNew: () => void;
}

export function SavedAddressPicker({ form, onAddNew }: SavedAddressPickerProps) {
  const { data: addresses, isLoading } = useCustomerAddresses();
  const selectedId = form.watch("savedAddressId");
  const error = form.formState.errors.savedAddressId;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-5 text-center space-y-3">
        <MapPin className="h-8 w-8 text-muted-foreground/40 mx-auto" />
        <p className="text-sm text-muted-foreground">No saved addresses yet</p>
        <button
          type="button"
          onClick={onAddNew}
          className="text-sm text-primary font-medium hover:underline"
        >
          Add a new address
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {addresses.map((addr) => (
        <label
          key={addr.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
            selectedId === addr.id
              ? "border-primary bg-primary/5"
              : "hover:border-muted-foreground/40"
          )}
        >
          <input
            type="radio"
            className="mt-1 accent-primary"
            value={addr.id}
            checked={selectedId === addr.id}
            onChange={() => form.setValue("savedAddressId", addr.id, { shouldValidate: true })}
          />
          <div className="flex-1 text-sm space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-medium">{addr.fullName}</span>
              {addr.label && <Badge variant="secondary" className="text-xs">{addr.label}</Badge>}
              {addr.isDefault && <Badge className="text-xs">Default</Badge>}
            </div>
            <p className="text-muted-foreground">
              {addr.addressLine1}
              {addr.addressLine2 && `, ${addr.addressLine2}`}
            </p>
            <p className="text-muted-foreground">
              {addr.city}, {addr.state} – {addr.postalCode}
            </p>
            {addr.phoneNumber && <p className="text-muted-foreground">+91 {addr.phoneNumber}</p>}
          </div>
        </label>
      ))}

      <button
        type="button"
        onClick={onAddNew}
        className="flex items-center gap-2 w-full rounded-lg border border-dashed p-3 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Use a different address
      </button>

      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}
