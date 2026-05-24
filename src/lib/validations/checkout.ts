import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  saveAddress: z.boolean().optional(),
});

export const checkoutSchema = z
  .object({
    addressMode: z.enum(["saved", "new"]),
    savedAddressId: z.string().optional(),
    paymentMethod: z.enum(["cod"] as const, {
      error: "Please select a payment method",
    }),
    notes: z.string().max(500).optional(),
  })
  .merge(shippingAddressSchema.partial())
  .superRefine((data, ctx) => {
    if (data.addressMode === "saved") {
      if (!data.savedAddressId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a delivery address",
          path: ["savedAddressId"],
        });
      }
    } else {
      // new address — required fields
      const required: Array<keyof z.infer<typeof shippingAddressSchema>> = [
        "fullName",
        "addressLine1",
        "city",
        "state",
        "postalCode",
      ];
      for (const field of required) {
        if (!data[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field === "addressLine1" ? "Address" : field.charAt(0).toUpperCase() + field.slice(1)} is required`,
            path: [field],
          });
        }
      }
    }
  });

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
