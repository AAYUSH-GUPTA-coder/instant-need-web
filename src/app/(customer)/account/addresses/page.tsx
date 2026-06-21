"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Trash2, Star, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FormError } from "@/components/forms/FormError";

import { addressSchema, type AddressFormData } from "@/lib/validations/account";
import type { AddressDTO } from "@/lib/types/customer";
import { getApiError } from "@/lib/errors";
import {
  useCustomerAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/lib/hooks/useCustomer";

interface AddressFormProps {
  /** When provided the form is in edit mode */
  existing?: AddressDTO;
  onSuccess: () => void;
}

function AddressForm({ existing, onSuccess }: AddressFormProps) {
  const isEdit = !!existing;
  const { mutateAsync: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutateAsync: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const isPending = isCreating || isUpdating;
  const [serverError, setServerError] = useState("");

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: existing
      ? {
          label: existing.label ?? "",
          fullName: existing.fullName,
          addressLine1: existing.addressLine1,
          addressLine2: existing.addressLine2 ?? "",
          city: existing.city,
          state: existing.state,
          postalCode: existing.postalCode,
          country: existing.country,
          phoneNumber: existing.phoneNumber ?? "",
          isDefault: existing.isDefault,
        }
      : { country: "India", isDefault: false },
  });

  const { register, formState: { errors } } = form;

  async function onSubmit(data: AddressFormData) {
    setServerError("");
    const body = {
      label: data.label || undefined,
      fullName: data.fullName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || undefined,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phoneNumber: data.phoneNumber,
      isDefault: data.isDefault,
    };
    try {
      if (isEdit && existing) {
        await updateAddress({ id: existing.id, body });
        toast.success("Address updated");
      } else {
        await createAddress(body);
        toast.success("Address saved");
      }
      form.reset();
      onSuccess();
    } catch (err: unknown) {
      setServerError(getApiError(err, "Failed to save address."));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <FormError message={serverError} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2 sm:col-span-1">
          <Label htmlFor="a-label">Label <span className="text-muted-foreground text-xs">(optional)</span></Label>
          <Input id="a-label" placeholder="Home, Office…" {...register("label")} />
        </div>
        <div className="space-y-1.5 col-span-2 sm:col-span-1">
          <Label htmlFor="a-fullName">Full name *</Label>
          <Input id="a-fullName" placeholder="Raj Sharma" aria-invalid={!!errors.fullName} {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="a-phone">Phone *</Label>
        <div className="flex gap-2">
          <span className="flex items-center rounded-lg border border-input px-3 text-sm text-muted-foreground bg-muted/40 shrink-0">+91</span>
          <Input id="a-phone" type="tel" placeholder="9876543210" aria-invalid={!!errors.phoneNumber} {...register("phoneNumber")} />
        </div>
        {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="a-line1">Address line 1 *</Label>
        <Input id="a-line1" placeholder="Building, street" aria-invalid={!!errors.addressLine1} {...register("addressLine1")} />
        {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="a-line2">Address line 2</Label>
        <Input id="a-line2" placeholder="Floor, landmark" {...register("addressLine2")} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="a-city">City *</Label>
          <Input id="a-city" placeholder="Mumbai" aria-invalid={!!errors.city} {...register("city")} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-state">State *</Label>
          <Input id="a-state" placeholder="Maharashtra" aria-invalid={!!errors.state} {...register("state")} />
          {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-pin">PIN *</Label>
          <Input id="a-pin" placeholder="400001" maxLength={6} aria-invalid={!!errors.postalCode} {...register("postalCode")} />
          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="a-default" className="h-4 w-4 rounded border accent-primary" {...register("isDefault")} />
        <Label htmlFor="a-default" className="text-sm font-normal cursor-pointer">Set as default address</Label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {isEdit ? "Update address" : "Save address"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onSuccess}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const { data: addresses, isLoading } = useCustomerAddresses();
  const { mutateAsync: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const { mutateAsync: setDefault, isPending: isSettingDefault } = useSetDefaultAddress();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
    } catch {
      toast.error("Could not delete address.");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefault(id);
      toast.success("Default address updated");
    } catch {
      toast.error("Could not update default address.");
    }
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Addresses</h2>
          <p className="text-sm text-muted-foreground">Manage your delivery addresses</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => { setShowAddForm((v) => !v); setEditingId(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add address
        </Button>
      </div>

      {/* Add address form */}
      {showAddForm && (
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm font-medium mb-4">New address</p>
          <AddressForm onSuccess={() => setShowAddForm(false)} />
        </div>
      )}

      <Separator />

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          description="Add a delivery address to speed up checkout."
          action={
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add address
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-xl border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{addr.fullName}</span>
                  {addr.label && <Badge variant="secondary" className="text-xs">{addr.label}</Badge>}
                  {addr.isDefault && <Badge className="text-xs">Default</Badge>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!addr.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleSetDefault(addr.id)}
                      disabled={isSettingDefault}
                    >
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Set default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => { setEditingId(editingId === addr.id ? null : addr.id); setShowAddForm(false); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(addr.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Address summary — hidden when editing */}
              {editingId !== addr.id && (
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                  <p>{addr.city}, {addr.state} – {addr.postalCode}</p>
                  {addr.phoneNumber && <p>+91 {addr.phoneNumber}</p>}
                </div>
              )}

              {/* Inline edit form */}
              {editingId === addr.id && (
                <div className="pt-2 border-t mt-2">
                  <AddressForm
                    existing={addr}
                    onSuccess={() => setEditingId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
