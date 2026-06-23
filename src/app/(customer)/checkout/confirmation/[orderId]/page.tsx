"use client";

import { use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  ClipboardList,
  Printer,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { useOrder } from "@/lib/hooks/useOrders";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NAVY = "#0d2b5e";

const COMPANY = {
  name: "InstantNeed Private Limited",
  line1: "5959, 12 Cross Road",
  line2: "Ambala Cantt, Haryana 133001",
  phone: "+91 8295781959",
  email: "Support@instantneed.in",
  website: "www.instantneed.in",
};

function orderRef(id: string) {
  const letters = id.replace(/[^a-fA-F]/g, "").slice(0, 2).toUpperCase();
  const digits = id.replace(/\D/g, "").slice(0, 4);
  return `IN${letters}${digits}`;
}

function formatInvoiceDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function amountToWords(amount: number): string {
  const num = Math.round(amount);
  if (num === 0) return "Zero Rupees Only";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function words(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "") + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + words(n % 100);
    if (n < 100000) return words(Math.floor(n / 1000)) + "Thousand " + words(n % 1000);
    if (n < 10000000) return words(Math.floor(n / 100000)) + "Lakh " + words(n % 100000);
    return words(Math.floor(n / 10000000)) + "Crore " + words(n % 10000000);
  }
  return "Rupees " + words(num).trim() + " Only";
}

interface ConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-semibold">Order not found</h1>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t load your order details. Your order may still have been placed.
        </p>
        <Link href="/account/orders" className={cn(buttonVariants())}>
          View my orders
        </Link>
      </div>
    );
  }

  const roundOff = Math.round(order.totalAmount) - order.totalAmount;
  const displayTotal = Math.round(order.totalAmount);
  const orderDisplay = order.orderNumber || orderRef(order.id);
  const addr = order.shippingAddress;

  return (
    <>
      {/* ── Screen layout ─────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 print:hidden">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Order placed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We&apos;ll notify you when it ships.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
            <ClipboardList className="h-4 w-4" />
            #{orderDisplay}
          </div>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b">
            <div className="text-sm">
              <span className="text-muted-foreground">Placed on </span>
              <span className="font-medium">{formatDateTime(order.placedAt)}</span>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="divide-y">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-muted-foreground/40" strokeWidth={1} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.sku} · Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium shrink-0">
                  {formatCurrency(item.lineTotal, item.currencyCode)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-muted/20 border-t space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotalAmount, order.currencyCode)}</span>
            </div>
            {order.shippingAmount > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingAmount, order.currencyCode)}</span>
              </div>
            )}
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−{formatCurrency(order.discountAmount, order.currencyCode)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount, order.currencyCode)}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Shipping to
            </div>
            {addr ? (
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">{addr.fullName}</p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                {addr.phoneNumber && <p>{addr.phoneNumber}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Address not available</p>
            )}
          </div>
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Payment
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>
            <p className="text-xs text-muted-foreground">Payment due on delivery</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/account/orders/${order.id}`}
            className={cn(buttonVariants(), "flex-1 justify-center")}
          >
            Track order <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
          >
            Continue shopping
          </Link>
          <button
            onClick={() => window.print()}
            className={cn(buttonVariants({ variant: "ghost" }), "sm:ml-auto")}
            aria-label="Print order confirmation"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* ── Print / PDF invoice layout ─────────────────────────────────────── */}
      <div
        className="hidden print:block"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          color: "#333",
          padding: "24px 28px",
          maxWidth: "800px",
          margin: "0 auto",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        } as React.CSSProperties}
      >
        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "14px", borderBottom: "2px solid #dde3ef", marginBottom: "16px" }}>
          {/* Logo */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              {/* Cart icon SVG */}
              <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="44" height="40" rx="4" fill={NAVY} />
                <path d="M8 10h3l3 14h14l3-10H14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="18" cy="27" r="2" fill="white"/>
                <circle cx="28" cy="27" r="2" fill="white"/>
                <circle cx="30" cy="13" r="5" fill="#2a7de1" stroke="white" strokeWidth="1.5"/>
                <path d="M27.5 13l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#2a7de1" }}>Instant</span>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: NAVY }}>Need</span>
              </div>
            </div>
            <p style={{ color: "#666", fontSize: "11px", marginLeft: "50px" }}>Your Business, Our Priority.</p>
            <div style={{ borderBottom: "1px solid #dde3ef", marginTop: "6px", marginLeft: "50px", width: "160px" }} />
          </div>
          {/* Order info */}
          <div style={{ textAlign: "right" }}>
            <h2 style={{ color: "#2a7de1", fontSize: "20px", fontWeight: "bold", marginBottom: "8px", letterSpacing: "0.5px" }}>
              ORDER CONFIRMATION
            </h2>
            <p style={{ marginBottom: "3px" }}>
              <strong>Order ID:</strong> #{orderDisplay}
            </p>
            <p>
              <strong>Date:</strong> {formatInvoiceDate(order.placedAt)}
            </p>
          </div>
        </div>

        {/* ── Company info + Order Placed box ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", lineHeight: "1.7" }}>
            <p style={{ color: "#2a7de1", fontWeight: "bold", fontSize: "13px", marginBottom: "3px" }}>
              {COMPANY.name}
            </p>
            <p>{COMPANY.line1}</p>
            <p style={{ marginBottom: "4px" }}>{COMPANY.line2}</p>
            <p>
              <span style={{ color: "#2a7de1", marginRight: "4px" }}>📞</span>
              <strong>Phone:</strong> {COMPANY.phone}
            </p>
            <p>
              <span style={{ color: "#2a7de1", marginRight: "4px" }}>✉</span>
              <strong>Email:</strong> {COMPANY.email}
            </p>
            <p>
              <span style={{ color: "#2a7de1", marginRight: "4px" }}>🌐</span>
              <strong>Website:</strong> {COMPANY.website}
            </p>
          </div>
          {/* Order Placed box */}
          <div style={{ border: "1px solid #dde3ef", borderRadius: "10px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px", minWidth: "240px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "#2a7de1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "white", fontSize: "22px", lineHeight: 1 }}>✓</span>
            </div>
            <div>
              <p style={{ color: "#2a7de1", fontWeight: "bold", fontSize: "15px", marginBottom: "3px" }}>Order Placed!</p>
              <p style={{ color: "#666", fontSize: "11px", marginBottom: "1px" }}>Thank you for your order.</p>
              <p style={{ color: "#666", fontSize: "11px" }}>We&apos;ll notify you when it ships.</p>
            </div>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div style={{ marginBottom: "16px" }}>
          {/* Section header */}
          <div style={{ backgroundColor: NAVY, color: "white", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px", borderRadius: "4px 4px 0 0" }}>
            <span style={{ fontSize: "14px" }}>📋</span>
            <span style={{ fontWeight: "bold", fontSize: "13px", letterSpacing: "0.5px" }}>ORDER SUMMARY</span>
          </div>
          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #dde3ef", borderTop: "none" }}>
            <thead>
              <tr style={{ backgroundColor: NAVY, color: "white" }}>
                <th style={{ padding: "9px 12px", textAlign: "center", width: "36px", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px" }}>#</th>
                <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px" }}>ITEM NAME</th>
                <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px" }}>QUANTITY</th>
                <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px" }}>RATE (₹)</th>
                <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px" }}>AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #e8edf5", backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafc" }}>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#666" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", backgroundColor: "#f0f4ff", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #dde3ef" }}>
                        <span style={{ fontSize: "16px" }}>📦</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: "600", marginBottom: "2px" }}>{item.productName}</p>
                        <p style={{ color: "#888", fontSize: "10px" }}>{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    {item.lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #dde3ef" }}>
                <td colSpan={3}></td>
                <td style={{ padding: "8px 12px", color: "#2a7de1", fontWeight: "600" }}>Subtotal</td>
                <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "700" }}>
                  ₹{order.subtotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              {order.shippingAmount > 0 && (
                <tr>
                  <td colSpan={3}></td>
                  <td style={{ padding: "4px 12px", color: "#666" }}>Shipping</td>
                  <td style={{ padding: "4px 12px", textAlign: "right" }}>
                    ₹{order.shippingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
              {order.discountAmount > 0 && (
                <tr>
                  <td colSpan={3}></td>
                  <td style={{ padding: "4px 12px", color: "#16a34a" }}>Discount</td>
                  <td style={{ padding: "4px 12px", textAlign: "right", color: "#16a34a" }}>
                    −₹{order.discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
              {Math.abs(roundOff) >= 0.01 && (
                <tr>
                  <td colSpan={3}></td>
                  <td style={{ padding: "4px 12px", color: "#666" }}>Round Off</td>
                  <td style={{ padding: "4px 12px", textAlign: "right" }}>
                    ₹{roundOff.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
              <tr style={{ backgroundColor: NAVY, color: "white" }}>
                <td colSpan={3}></td>
                <td style={{ padding: "11px 12px", fontWeight: "bold", fontSize: "13px", letterSpacing: "0.5px" }}>TOTAL AMOUNT</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontWeight: "bold", fontSize: "17px" }}>
                  ₹{displayTotal.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ── Amount in Words ── */}
        <p style={{ marginBottom: "18px", fontSize: "11.5px" }}>
          <strong style={{ color: NAVY }}>Amount in Words:</strong>{" "}
          {amountToWords(displayTotal)}
        </p>

        {/* ── Shipping + Payment ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
          {/* Shipping */}
          <div style={{ border: "1px solid #dde3ef", borderRadius: "8px", padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2a7de1", fontWeight: "bold", fontSize: "12px", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px dashed #dde3ef" }}>
              <span>📍</span> SHIPPING ADDRESS
            </div>
            {addr ? (
              <div style={{ lineHeight: "1.65", fontSize: "11.5px" }}>
                <p style={{ fontWeight: "600" }}>{addr.fullName}</p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                {addr.phoneNumber && <p>{addr.phoneNumber}</p>}
              </div>
            ) : (
              <p style={{ color: "#888", fontSize: "11px" }}>Address not available</p>
            )}
          </div>
          {/* Payment */}
          <div style={{ border: "1px solid #dde3ef", borderRadius: "8px", padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2a7de1", fontWeight: "bold", fontSize: "12px", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px dashed #dde3ef" }}>
              <span>💳</span> PAYMENT METHOD
            </div>
            <p style={{ fontWeight: "600", marginBottom: "3px" }}>
              {order.paymentMethod === "cod" ? "Cash On Delivery" : order.paymentMethod}
            </p>
            <p style={{ color: "#666", fontSize: "11px" }}>Payment due on delivery</p>
          </div>
        </div>

        {/* ── Feature icons ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", border: "1px solid #dde3ef", borderRadius: "8px", marginBottom: "18px", overflow: "hidden" }}>
          {[
            { icon: "🛡", label: "100%", sub: "Authentic Products" },
            { icon: "%", label: "Best", sub: "Prices" },
            { icon: "🚚", label: "Fast & Safe", sub: "Delivery" },
            { icon: "🎧", label: "Dedicated", sub: "Support" },
          ].map((f, i, arr) => (
            <div
              key={f.sub}
              style={{
                padding: "12px 8px",
                textAlign: "center",
                borderRight: i < arr.length - 1 ? "1px solid #dde3ef" : "none",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{f.icon}</div>
              <p style={{ fontWeight: "600", fontSize: "11px", color: "#333" }}>{f.label}</p>
              <p style={{ fontSize: "10px", color: "#666" }}>{f.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Pre-footer ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", fontSize: "11px" }}>
          <div style={{ lineHeight: "1.7" }}>
            <p style={{ color: NAVY, fontWeight: "bold", marginBottom: "3px" }}>Need Help?</p>
            <p>📞 Phone: {COMPANY.phone}</p>
            <p>✉ Email: {COMPANY.email}</p>
            <p>🕐 Mon – Sat | 10:00 AM – 7:00 PM</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#2a7de1", fontWeight: "bold", fontSize: "13px", marginBottom: "4px" }}>
              Thank you for choosing InstantNeed.
            </p>
            <p style={{ color: "#555" }}>We look forward to serving your business again!</p>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ backgroundColor: NAVY, color: "white", padding: "9px 16px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
          <span style={{ fontWeight: "bold", fontSize: "13px" }}>🛒 InstantNeed</span>
          <span style={{ color: "#c8d6f0" }}>
            This is a system generated invoice and does not require a signature.
          </span>
        </div>
      </div>
    </>
  );
}
