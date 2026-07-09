import type { Metadata } from "next";
import { Phone, Mail, MessageCircleQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach InstantNeed support for order queries, account help, and questions about buying on the platform.",
};

const SUPPORT_PHONE = "+91 8295781959";
const SUPPORT_PHONE_HREF = "+918295781959";
const SUPPORT_EMAIL = "support@instantneed.in";

export default function ContactUsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-10">
      <div className="space-y-3">
        <Badge variant="secondary" className="text-xs font-medium tracking-wide uppercase">
          Support
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
          How can we help?
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
          Reach InstantNeed support for order queries, account help, and questions about
          buying on the platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Phone className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
              <CardTitle className="text-base">Call customer care</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              Speak with our support team for urgent order or account assistance.
            </p>
          </CardHeader>
          <CardContent>
            <a
              href={`tel:${SUPPORT_PHONE_HREF}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full gap-2")}
            >
              <Phone className="h-4 w-4" />
              {SUPPORT_PHONE}
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Mail className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
              <CardTitle className="text-base">Email support</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              For recent orders, include your order details so the team can help faster.
            </p>
          </CardHeader>
          <CardContent>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full gap-2")}
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 rounded-lg border bg-muted/40 p-4">
        <MessageCircleQuestion className="h-5 w-5 shrink-0 text-primary mt-0.5" strokeWidth={2} />
        <div>
          <p className="text-sm font-medium">Need help with a recent order?</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Please share your order ID, registered phone number, and a short description of
            the issue when you email us.
          </p>
        </div>
      </div>
    </div>
  );
}
