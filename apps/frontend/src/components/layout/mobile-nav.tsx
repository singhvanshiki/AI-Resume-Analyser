"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavSection } from "@/config/nav";

interface MobileNavProps {
  navSections: NavSection[];
  homeHref: string;
}

export function MobileNav({ navSections, homeHref }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b border-border/60 px-6 py-4">
          <SheetTitle>
            <BrandLogo href={homeHref} />
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-6 px-6 py-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {section.title}
              </p>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
