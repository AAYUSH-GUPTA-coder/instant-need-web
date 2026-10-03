// Compile-time checks for contracts consumed by both web and mobile.
import type { PlaceOrderResponse as WebOrderResponse } from "@/lib/types/order";
import type { PricingTierDTO as WebTier, PincodeMinOrderDTO as WebPincode } from "@/lib/types/catalog";
import type { PlaceOrderResponse as SharedOrderResponse } from "../../../instant-need-shared/src/types/order";
import type { PricingTierDTO as SharedTier, PincodeMinOrderDTO as SharedPincode } from "../../../instant-need-shared/src/types/catalog";

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;

export type OrderResponseMatches = Assert<Equal<WebOrderResponse, SharedOrderResponse>>;
export type PricingTierMatches = Assert<Equal<WebTier, SharedTier>>;
export type PincodeCoreMatches = Assert<Equal<
  Pick<WebPincode, "id" | "pincode" | "minAmount" | "active">,
  Pick<SharedPincode, "id" | "pincode" | "minAmount" | "active">
>>;
