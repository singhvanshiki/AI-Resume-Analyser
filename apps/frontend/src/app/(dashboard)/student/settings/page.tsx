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

export default function StudentSettingsPage() {
  const { setTheme } = useTheme();
  const preferences = useUserStore((state) => state.preferences);
  const updatePreferences = useUserStore((state) => state.updatePreferences);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your preferences and notification settings."
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
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Email digest
              </p>
              <p className="text-xs text-muted-foreground">
                Receive weekly performance highlights.
              </p>
            </div>
            <Switch
              checked={preferences.emailDigest}
              onCheckedChange={(value) =>
                updatePreferences({ emailDigest: value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Weekly summary
              </p>
              <p className="text-xs text-muted-foreground">
                Get a summary of resume improvements.
              </p>
            </div>
            <Switch
              checked={preferences.weeklySummary}
              onCheckedChange={(value) =>
                updatePreferences({ weeklySummary: value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Auto-analyze uploads
              </p>
              <p className="text-xs text-muted-foreground">
                Run ATS analysis immediately after upload.
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
