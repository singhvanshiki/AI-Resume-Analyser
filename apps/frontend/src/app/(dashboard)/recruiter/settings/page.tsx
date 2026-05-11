"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useTheme } from "@/components/theme/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/stores/user-store";

export default function RecruiterSettingsPage() {
  const { setTheme } = useTheme();
  const preferences = useUserStore((state) => state.preferences);
  const updatePreferences = useUserStore((state) => state.updatePreferences);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Configure recruiter preferences and alerts."
      />

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => {
                const nextTheme = value as "system" | "light" | "dark";
                updatePreferences({ theme: nextTheme });
                setTheme(nextTheme);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Weekly summary
              </p>
              <p className="text-xs text-muted-foreground">
                Receive a weekly recruiting digest.
              </p>
            </div>
            <Switch
              checked={preferences.weeklySummary}
              onCheckedChange={(value) =>
                updatePreferences({ weeklySummary: value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Auto-analyze uploads
              </p>
              <p className="text-xs text-muted-foreground">
                Trigger ranking after each upload.
              </p>
            </div>
            <Switch
              checked={preferences.autoAnalyze}
              onCheckedChange={(value) =>
                updatePreferences({ autoAnalyze: value })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
