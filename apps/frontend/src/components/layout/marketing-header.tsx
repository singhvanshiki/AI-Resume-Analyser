import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="w-full border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <BrandLogo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="/features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Login
          </Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" asChild>
            <Link href="/register">Start free</Link>
          </Button>
          <Button asChild>
            <Link href="/student">Open dashboard</Link>
          </Button>
        </div>
        <Button className="md:hidden" size="sm" asChild>
          <Link href="/register">Get started</Link>
        </Button>
      </div>
    </header>
  );
}
