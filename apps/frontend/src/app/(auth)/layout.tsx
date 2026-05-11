import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/layout/brand";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900 p-12 text-white md:flex">
        <BrandLogo href="/" />
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-200">
            AI Resume Analyzer
          </p>
          <h1 className="text-3xl font-semibold">
            Ship ATS-ready resumes and recruiter insights.
          </h1>
          <p className="text-sm text-teal-100">
            Built for candidates and hiring teams that need speed, clarity, and
            structured analytics.
          </p>
        </div>
        <p className="text-xs text-teal-200">
          Need help? Visit the <Link href="/features">features</Link> page.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
