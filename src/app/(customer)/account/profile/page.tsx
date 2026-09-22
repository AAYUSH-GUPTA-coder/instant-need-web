"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FormError } from "@/components/forms/FormError";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { profileSchema, type ProfileFormData } from "@/lib/validations/account";
import { useCustomerProfile, useUpdateProfile } from "@/lib/hooks/useCustomer";
import { customerApi } from "@/lib/api/customer";
import { useAuthStore } from "@/lib/stores/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: profile, isLoading } = useCustomerProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const [serverError, setServerError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", businessName: "", phoneNumber: "" },
  });

  // Pre-fill form once profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName ?? "",
        businessName: profile.businessName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
      });
    }
  }, [profile, form]);

  async function onSubmit(data: ProfileFormData) {
    setServerError("");
    try {
      await updateProfile({
        fullName: data.fullName,
        businessName: data.businessName,
        phoneNumber: data.phoneNumber || undefined,
      });
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update profile. Please try again.";
      setServerError(msg);
    }
  }

  async function handleDeleteAccount() {
    setDeletePending(true);
    try {
      await customerApi.deleteAccount();
      logout();
      toast.success("Your account has been deleted");
      router.replace("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "We could not delete your account. Please try again or contact support.";
      toast.error(message);
      setDeletePending(false);
      setDeleteDialogOpen(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal and business information
        </p>
      </div>

      <Separator />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={serverError} />

        {/* Email — read-only */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile?.email ?? ""}
            disabled
            className="bg-muted/40"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Raj Sharma"
            aria-invalid={!!form.formState.errors.fullName}
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName && (
            <p className="text-xs text-destructive">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            placeholder="Sharma Traders"
            aria-invalid={!!form.formState.errors.businessName}
            {...form.register("businessName")}
          />
          {form.formState.errors.businessName && (
            <p className="text-xs text-destructive">
              {form.formState.errors.businessName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber">Phone number</Label>
          <div className="flex gap-2">
            <span className="flex items-center rounded-lg border border-input px-3 text-sm text-muted-foreground bg-muted/40 shrink-0">
              +91
            </span>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="9876543210"
              aria-invalid={!!form.formState.errors.phoneNumber}
              {...form.register("phoneNumber")}
            />
          </div>
          {form.formState.errors.phoneNumber && (
            <p className="text-xs text-destructive">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Save changes
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              form.reset({
                fullName: profile?.fullName ?? "",
                businessName: profile?.businessName ?? "",
                phoneNumber: profile?.phoneNumber ?? "",
              })
            }
          >
            Cancel
          </Button>
        </div>
      </form>

      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Trash2 className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Delete account</h3>
            <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
              This removes your login, profile, saved addresses, cart, and stored invoice files.
              Retained order records are anonymized where required for accounting or legal purposes.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          className="gap-2"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete my account
        </Button>
      </section>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your InstantNeed account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your login, profile, saved addresses, cart, and stored
              invoice files will be removed. Any retained order record will be anonymized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deletePending}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteAccount();
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deletePending ? "Deleting..." : "Delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
