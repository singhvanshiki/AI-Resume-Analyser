import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLogo />
          <p className="text-sm text-muted-foreground">
            AI Resume Analyzer helps candidates and hiring teams align faster
            with structured insights, ATS-ready scoring, and recruiter-grade
            reports.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-foreground">Product</p>
          <Link
            href="/features"
            className="block text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="block text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/register"
            className="block text-muted-foreground hover:text-foreground"
          >
            Get started
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-foreground">Account</p>
          <Link
            href="/login"
            className="block text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/student"
            className="block text-muted-foreground hover:text-foreground"
          >
            Student dashboard
          </Link>
          <Link
            href="/recruiter"
            className="block text-muted-foreground hover:text-foreground"
          >
            Recruiter dashboard
          </Link>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Built for modern hiring teams. AI Resume Analyzer 2026.
      </div>
    </footer>
  );
}
