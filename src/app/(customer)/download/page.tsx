import type { Metadata } from "next";
import { Zap, PackageSearch, Bell } from "lucide-react";
import { InstantNeedIcon } from "@/components/ui/brand";
import { Badge } from "@/components/ui/badge";
import { AppStoreBadge, GooglePlayBadge } from "@/components/ui/store-badges";

export const metadata: Metadata = {
  title: "Download the App",
  description: "Get the InstantNeed app for Android and iOS and order on the go.",
};

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "Faster reordering",
    description: "Reorder your usual stock in a couple of taps.",
  },
  {
    icon: PackageSearch,
    title: "Track orders live",
    description: "Follow every shipment from confirmation to delivery.",
  },
  {
    icon: Bell,
    title: "Stock & price alerts",
    description: "Get notified the moment your regular items restock.",
  },
];

export default function DownloadAppPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Copy */}
        <div className="space-y-6">
          <Badge variant="secondary" className="text-xs font-medium tracking-wide uppercase">
            Available on Android & iOS
          </Badge>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              Download the InstantNeed app
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              For the best experience, order on the go with the InstantNeed app —
              built for busy businesses and shop-owners.
            </p>
          </div>

          <ul className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <AppStoreBadge href="#" />
            <GooglePlayBadge href="#" />
          </div>
        </div>

        {/* Visual */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-56 aspect-[9/19] rounded-[2rem] border-8 border-foreground/90 bg-foreground/90 shadow-xl">
            <div className="h-full w-full rounded-[1.4rem] bg-gradient-to-b from-primary/15 to-primary/5 flex flex-col items-center justify-center gap-3 overflow-hidden">
              <InstantNeedIcon size={56} className="rounded-2xl shadow-sm" />
              <p className="text-sm font-semibold text-foreground/70">InstantNeed</p>
            </div>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-24 rounded-b-xl bg-foreground/90" />
          </div>
        </div>
      </div>
    </div>
  );
}
