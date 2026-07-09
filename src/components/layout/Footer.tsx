import Link from "next/link";
import { Package2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InstantNeedIcon, InstantNeedWordmark } from "@/components/ui/brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = {
  Company: [
    { label: "Contact Us", href: "/contact-us" },
  ],
  Support: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  Catalog: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <InstantNeedIcon size={28} />
              <InstantNeedWordmark className="text-lg" />
            </Link>
            <p className="text-sm text-muted-foreground">
              India&apos;s trusted B2B wholesale ordering platform for modern businesses.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold mb-4">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {section === "Catalog" && (
                <Link href="/download" className={cn(buttonVariants({ size: "sm" }), "mt-4")}>
                  Download App
                </Link>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} InstantNeed. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
