import Link from "next/link";

import { LandingHero } from "@/components/marketing/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "ATS-ready scorecards",
    desc: "Measure alignment across content structure, keyword coverage, and semantic fit.",
  },
  {
    title: "Skill gap analysis",
    desc: "Spot missing competencies and surface growth areas with AI summaries.",
  },
  {
    title: "Recruiter ranking",
    desc: "Compare candidates with transparent scoring and exportable insights.",
  },
];

export default function MarketingPage() {
  return (
    <div>
      <LandingHero />
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="glass-panel shadow-soft">
              <CardContent className="space-y-3 p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Workflow
            </p>
            <h2 className="text-3xl font-semibold text-foreground">
              A unified platform for candidates and recruiters.
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload resumes, score them against job descriptions, and act on
              guided recommendations. Recruiters can add multiple candidates,
              compare them, and export results in minutes.
            </p>
            <Button asChild>
              <Link href="/register">Create your workspace</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {[
              "Upload resume and JD",
              "Run ATS + matching analysis",
              "Generate recruiter insights",
              "Export shortlists",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-xl border border-border/70 bg-background p-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-foreground">
              Ready to elevate your hiring signal?
            </h2>
            <p className="text-sm text-muted-foreground">
              Launch your dashboard and start scoring resumes today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
