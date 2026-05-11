"use client";

import { BellDot } from "lucide-react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notifications = [
  {
    title: "ATS insights ready",
    message: "Your ATS analysis for UX Designer is complete.",
  },
  {
    title: "New candidate upload",
    message: "3 resumes were added to the Product Analyst role.",
  },
  {
    title: "Weekly summary",
    message: "Your resume performance summary is ready to review.",
  },
];

interface NotificationsMenuProps {
  children: ReactNode;
}

export function NotificationsMenu({ children }: NotificationsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <BellDot className="h-4 w-4" />
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-3 px-3 py-2 text-sm">
          {notifications.map((notification) => (
            <div key={notification.title} className="space-y-1">
              <p className="font-medium text-foreground">
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
