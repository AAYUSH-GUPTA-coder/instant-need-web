import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account Deletion",
  description: "Request deletion of your InstantNeed account and associated personal data.",
};

const SUPPORT_EMAIL = "support@instantneed.in";

export default function AccountDeletionPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 space-y-8">
      <div className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Delete your InstantNeed account</h1>
        <p className="text-base leading-7 text-foreground/80">
          If you no longer want to use InstantNeed, you can delete your account from the Account
          settings in the website or mobile app.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Cannot access your account?</h2>
        <p className="text-sm leading-6 text-foreground/80">
          Send a deletion request from the email address or phone number registered with InstantNeed.
          We will verify the request and remove your account and associated personal data. Order or
          invoice records that must be retained for accounting, tax, fraud prevention, or legal
          compliance will be anonymized and retained only for that purpose.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=InstantNeed%20account%20deletion%20request`}
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
        >
          <Mail className="h-4 w-4" />
          Email deletion request
        </a>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        For details about the data we collect, retention periods, and your rights, read our{" "}
        <a className="text-primary underline underline-offset-4" href="/privacy-policy">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
