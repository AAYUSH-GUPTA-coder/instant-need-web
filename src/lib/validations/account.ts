import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name too long"),
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name too long"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
});

export const addressSchema = z.object({
  label: z.string().max(40).optional(),
  fullName: z.string().min(2, "Full name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  isDefault: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
