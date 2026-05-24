"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { FormError } from "@/components/forms/FormError";

import { changePasswordSchema, type ChangePasswordFormData } from "@/lib/validations/auth";
import { authApi } from "@/lib/api/auth";

export default function ChangePasswordPage() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordFormData) {
    setServerError("");
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      reset();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 400 || status === 401) {
        setServerError("Your current password is incorrect.");
      } else {
        setServerError("Failed to change password. Please try again.");
      }
    }
  }

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-sm text-muted-foreground">
          Keep your account secure with a strong password
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={serverError} />

        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Current password</Label>
          <PasswordInput
            id="currentPassword"
            placeholder="Enter your current password"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-xs text-destructive">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <PasswordInput
            id="newPassword"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Requirements hint */}
        <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
          <li>At least 8 characters</li>
          <li>At least one uppercase letter</li>
          <li>At least one number</li>
        </ul>

        <div className="pt-1 flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Update password
          </Button>
          <Button type="button" variant="ghost" onClick={() => reset()}>
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
