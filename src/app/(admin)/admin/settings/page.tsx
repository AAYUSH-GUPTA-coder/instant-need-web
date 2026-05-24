"use client";

import { AdminHeader } from "@/components/layout/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/stores/authStore";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="p-6 space-y-5 max-w-2xl">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Your administrator account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user?.email ?? "—"}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user?.role ?? "ADMIN"}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-sm font-mono text-muted-foreground">{user?.id ?? "—"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Platform */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Platform</CardTitle>
            <CardDescription>General platform configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Platform Name</p>
                <p className="text-xs text-muted-foreground">
                  Shown in emails and the customer app
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Instant Need</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Default Currency</p>
                <p className="text-xs text-muted-foreground">Used for all pricing</p>
              </div>
              <p className="text-sm text-muted-foreground">INR (₹)</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Version</p>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                v1.0.0
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone placeholder */}
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions. Contact your infrastructure team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Actions such as resetting platform data or revoking all sessions are
              managed via the backend deployment pipeline and are not exposed in this UI.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
