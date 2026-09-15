"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, CreditCard, MapPin, Package, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { useOrder } from "@/lib/hooks/useOrders";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import type { OrderDTO } from "@/lib/types/order";

const BORDER = "#333333";
const LIGHT = "#f2f2f2";

function orderRef(id: string) {
  const letters = id.replace(/[^a-fA-F]/g, "").slice(0, 2).toUpperCase();
  const digits = id.replace(/\D/g, "").slice(0, 4);
  return `IN${letters}${digits}`;
}

function money(value: number | undefined) {
  return (value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function percent(value: number | undefined) {
  return `${(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}%`;
}

function amountToWords(amount: number): string {
  const num = Math.round(amount);
  if (num === 0) return "Zero Rupees Only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function words(n: number): string {
    if (n === 0) return "";
    if (n < 20) return `${ones[n]} `;
    if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""} `;
    if (n < 1000) return `${ones[Math.floor(n / 100)]} Hundred ${words(n % 100)}`;
    if (n < 100000) return `${words(Math.floor(n / 1000))}Thousand ${words(n % 1000)}`;
    if (n < 10000000) return `${words(Math.floor(n / 100000))}Lakh ${words(n % 100000)}`;
    return `${words(Math.floor(n / 10000000))}Crore ${words(n % 10000000)}`;
  }
  return `Rupees ${words(num).trim()} Only`;
}

function InvoicePrint({ order }: { order: OrderDTO }) {
  const groups = new Map<string, { cgstRate: number; sgstRate: number; taxable: number; cgst: number; sgst: number }>();
  const rows = order.items.map((item, index) => {
    const cgstRate = item.cgstRate ?? 0;
    const sgstRate = item.sgstRate ?? 0;
    const group = groups.get(`${cgstRate}/${sgstRate}`) ?? { cgstRate, sgstRate, taxable: 0, cgst: 0, sgst: 0 };
    group.taxable += item.taxableAmount ?? item.lineTotal;
    group.cgst += item.cgstAmount ?? 0;
    group.sgst += item.sgstAmount ?? 0;
    groups.set(`${cgstRate}/${sgstRate}`, group);
    return (
      <tr key={item.id}>
        <td style={cell("center")}>{index + 1}</td>
        <td style={cell("left")}>{item.productName}</td>
        <td style={cell("center")}>{item.hsnCode || "—"}</td>
        <td style={cell("center")}>{item.quantity}</td>
        <td style={cell("center")}>{item.unitOfMeasurement || "—"}</td>
        <td style={cell("right")}>{money(item.mrp)}</td>
        <td style={cell("right")}>{money(item.unitPrice)}</td>
        <td style={cell("center")}>{percent(cgstRate)}</td>
        <td style={cell("right")}>{money(item.cgstAmount)}</td>
        <td style={cell("center")}>{percent(sgstRate)}</td>
        <td style={cell("right")}>{money(item.sgstAmount)}</td>
        <td style={cell("right")}>{money(item.lineTotal)}</td>
      </tr>
    );
  });
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalTaxable = [...groups.values()].reduce((sum, group) => sum + group.taxable, 0);
  const totalCgst = [...groups.values()].reduce((sum, group) => sum + group.cgst, 0);
  const totalSgst = [...groups.values()].reduce((sum, group) => sum + group.sgst, 0);
  const addr = order.shippingAddress;
  const customerName = order.customerBusinessName || order.customerName || "Retail Customer";
  const customerGstin = order.customerGstinUin || "—";

  return (
    <div className="hidden print:block" style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#111" }}>
      <table style={{ ...table, borderCollapse: "collapse" }}><tbody><tr><td style={{ ...noBorder, width: "65%", verticalAlign: "top" }}><div style={{ fontSize: 25, fontWeight: 800 }}>INSTANTNEED</div><div style={{ fontSize: 14 }}>B2B Wholesale</div><div>Shop No. 5959, 12 Cross Road, Ambala-133001, Haryana</div><div style={{ fontWeight: 700, fontSize: 13, marginTop: 5 }}>GSTIN / UIN : 06AAMFI3712M1Z6</div></td><td style={{ ...noBorder, textAlign: "right", verticalAlign: "top" }}><div style={{ fontSize: 22, fontWeight: 800 }}>TAX INVOICE</div><div style={{ fontSize: 13, marginTop: 8 }}>Original Copy</div></td></tr></tbody></table>
      <table style={{ ...table, marginTop: 10, borderCollapse: "collapse" }}><tbody><tr><td style={{ ...cellStyle, width: "50%", verticalAlign: "top" }}><div><b>Invoice No. :</b> {order.invoiceNumber || order.orderNumber}</div><div><b>Dated :</b> {new Date(order.placedAt).toLocaleDateString("en-IN")}</div><div><b>Place of Supply :</b> Haryana (06)</div><div><b>Reverse Charge :</b> N</div></td><td style={{ ...cellStyle, width: "50%", verticalAlign: "top" }}><div><b>Transport :</b> {order.transport || "—"}</div><div><b>Vehicle No. :</b> {order.vehicleNumber || "—"}</div><div><b>E-Way Bill No. :</b> {order.ewayBillNumber || "—"}</div></td></tr></tbody></table>
      <table style={{ ...table, marginTop: 10, borderCollapse: "collapse" }}><tbody><tr><td style={{ ...cellStyle, width: "50%", verticalAlign: "top" }}><b>Billed To:</b><div>{customerName}</div><div>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />{addr.city}, {addr.state} {addr.postalCode}</div><b>GSTIN/UIN : {customerGstin}</b></td><td style={{ ...cellStyle, width: "50%", verticalAlign: "top" }}><b>Shipped To:</b><div>{customerName}</div><div>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />{addr.city}, {addr.state} {addr.postalCode}</div><b>GSTIN/UIN : {customerGstin}</b></td></tr></tbody></table>
      <table style={{ ...table, marginTop: 10, borderCollapse: "collapse" }}><thead><tr>{["S.N.", "Description of Goods", "HSN Code", "Qty", "Unit", "MRP (₹)", "Price (₹)\n(Incl. GST)", "CGST", "CGST Amt", "SGST", "SGST Amt", "Total (₹)"].map((head) => <th key={head} style={{ ...cellStyle, background: LIGHT, textAlign: "center", whiteSpace: "pre-line" }}>{head}</th>)}</tr></thead><tbody>{rows}</tbody><tfoot><tr><td colSpan={3} style={{ ...cellStyle, textAlign: "right", fontWeight: 700 }}>Grand Total</td><td style={{ ...cellStyle, textAlign: "center", fontWeight: 700 }}>{totalQty}</td><td style={{ ...cellStyle, textAlign: "center", fontWeight: 700 }}>—</td><td colSpan={6} style={cellStyle}></td><td style={{ ...cellStyle, textAlign: "right", fontWeight: 700 }}>{money(order.totalAmount)}</td></tr></tfoot></table>
      <table style={{ ...table, width: "68%", marginTop: 10, borderCollapse: "collapse" }}><thead><tr>{["Tax Rate", "Taxable Amt. (₹)", "CGST Amt. (₹)", "SGST Amt. (₹)", "Total Tax (₹)"].map((head) => <th key={head} style={{ ...cellStyle, background: LIGHT, textAlign: "center" }}>{head}</th>)}</tr></thead><tbody>{[...groups.values()].map((group) => <tr key={`${group.cgstRate}/${group.sgstRate}`}><td style={cell("center")}>{percent(group.cgstRate + group.sgstRate)}</td><td style={cell("right")}>{money(group.taxable)}</td><td style={cell("right")}>{money(group.cgst)}</td><td style={cell("right")}>{money(group.sgst)}</td><td style={cell("right")}>{money(group.cgst + group.sgst)}</td></tr>)}<tr><td style={{ ...cellStyle, textAlign: "center", fontWeight: 700 }}>Total</td><td style={{ ...cellStyle, textAlign: "right", fontWeight: 700 }}>{money(totalTaxable)}</td><td style={{ ...cellStyle, textAlign: "right", fontWeight: 700 }}>{money(totalCgst)}</td><td style={{ ...cellStyle, textAlign: "right", fontWeight: 700 }}>{money(totalSgst)}</td><td style={{ ...cellStyle, textAlign: "right", fontWeight: 700 }}>{money(totalCgst + totalSgst)}</td></tr></tbody></table>
      <table style={{ ...table, marginTop: 10, borderCollapse: "collapse" }}><tbody><tr><td style={cellStyle}><b>Amount in Words (Rupees) : </b>{amountToWords(order.totalAmount)}</td></tr></tbody></table>
      <table style={{ ...table, marginTop: 10, borderCollapse: "collapse" }}><tbody><tr><td style={{ ...cellStyle, width: "55%", verticalAlign: "top", lineHeight: 1.7 }}><b>Terms &amp; Conditions:</b><br />1. E. &amp; O.E.<br />2. Goods once sold will not be taken back.<br />3. Interest @ 18% p.a. will be charged if payment is not made within the stipulated time.<br />4. Subject to Ambala Jurisdiction only.</td><td style={{ ...cellStyle, verticalAlign: "bottom", textAlign: "right" }}>Receiver&apos;s Signature :<br /><br /><br /><b>for INSTANTNEED</b><br />Authorised Signatory</td></tr></tbody></table>
    </div>
  );
}

const table: React.CSSProperties = { width: "100%" };
const noBorder: React.CSSProperties = { border: 0, padding: 6 };
const cellStyle: React.CSSProperties = { border: `1px solid ${BORDER}`, padding: "6px 5px" };
function cell(textAlign: "left" | "right" | "center"): React.CSSProperties { return { ...cellStyle, textAlign }; }

interface ConfirmationPageProps { params: Promise<{ orderId: string }> }

export default function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);
  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-16 space-y-6"><Skeleton className="h-16 w-16 rounded-full mx-auto" /><Skeleton className="h-8 w-64 mx-auto" /><Skeleton className="h-48 w-full rounded-xl" /></div>;
  if (!order) return <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4"><h1 className="text-xl font-semibold">Order not found</h1><p className="text-muted-foreground text-sm">We couldn&apos;t load your order details. Your order may still have been placed.</p><Link href="/account/orders" className={cn(buttonVariants())}>View my orders</Link></div>;
  const orderDisplay = order.orderNumber || orderRef(order.id);
  const addr = order.shippingAddress;
  return <>
    <style>{`@media print { @page { margin: 8mm 12mm; size: A4 portrait; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 print:hidden">
      <div className="text-center space-y-3"><div className="flex justify-center"><div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="h-9 w-9 text-green-600" /></div></div><h1 className="text-2xl font-bold">Order placed!</h1><p className="text-muted-foreground">Thank you for your order. We&apos;ll notify you when it ships.</p><div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium"><ClipboardList className="h-4 w-4" />#{orderDisplay}</div></div>
      <div className="rounded-xl border bg-card overflow-hidden"><div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b"><div className="text-sm"><span className="text-muted-foreground">Placed on </span><span className="font-medium">{formatDateTime(order.placedAt)}</span></div><StatusBadge status={order.status} /></div><div className="divide-y">{order.items.map((item) => <div key={item.id} className="flex items-center gap-3 px-5 py-3"><div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0"><Package className="h-5 w-5 text-muted-foreground/40" strokeWidth={1} /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{item.productName}</p><p className="text-xs text-muted-foreground">{item.sku} · Quantity: {item.quantity}</p></div><p className="text-sm font-medium shrink-0">{formatCurrency(item.lineTotal, item.currencyCode)}</p></div>)}</div><div className="px-5 py-4 bg-muted/20 border-t space-y-1.5 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(order.subtotalAmount, order.currencyCode)}</span></div>{order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−{formatCurrency(order.discountAmount, order.currencyCode)}</span></div>}<Separator className="my-2" /><div className="flex justify-between font-semibold text-base"><span>Total</span><span>{formatCurrency(order.totalAmount, order.currencyCode)}</span></div></div></div>
      <div className="grid sm:grid-cols-2 gap-4"><div className="rounded-xl border bg-card p-4 space-y-2"><div className="flex items-center gap-2 text-sm font-medium"><MapPin className="h-4 w-4 text-muted-foreground" />Shipping to</div><div className="text-sm text-muted-foreground space-y-0.5"><p className="font-medium text-foreground">{addr.fullName}</p><p>{addr.addressLine1}</p>{addr.addressLine2 && <p>{addr.addressLine2}</p>}<p>{addr.city}, {addr.state} {addr.postalCode}</p></div></div><div className="rounded-xl border bg-card p-4 space-y-2"><div className="flex items-center gap-2 text-sm font-medium"><CreditCard className="h-4 w-4 text-muted-foreground" />Payment</div><p className="text-sm text-muted-foreground capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</p><p className="text-xs text-muted-foreground">Payment due on delivery</p></div></div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2"><Link href={`/account/orders/${order.id}`} className={cn(buttonVariants(), "flex-1 justify-center")}>Track order <ArrowRight className="ml-2 h-4 w-4" /></Link><Link href="/products" className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}>Continue shopping</Link><button onClick={() => window.print()} className={cn(buttonVariants({ variant: "ghost" }), "sm:ml-auto")} aria-label="Print tax invoice"><Printer className="h-4 w-4 mr-2" />Print invoice</button></div>
    </div>
    <InvoicePrint order={order} />
  </>;
}
