import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "ATS score analysis",
    desc: "Break down scoring signals and deliver precise ATS readiness guidance.",
  },
  {
    title: "Resume vs JD matching",
    desc: "Measure semantic alignment, keyword overlap, and required skill coverage.",
  },
  {
    title: "Skill extraction",
    desc: "Auto-extract skills into structured tags for easy comparison.",
  },
  {
    title: "Interview questions",
    desc: "Generate tailored interview questions aligned to the role and resume.",
  },
  {
    title: "Cover letter generator",
    desc: "Produce role-specific cover letters with polished narratives.",
  },
  {
    title: "Recruiter dashboards",
    desc: "Rank, compare, filter, and export candidate insights.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Features
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            A complete AI resume analysis suite.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Combine ATS scoring, recruiter analytics, and role-based workflows
            in a single platform that scales from students to enterprise teams.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="glass-panel">
              <CardContent className="space-y-2 p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/40 px-6 py-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              See the platform in action.
            </h2>
            <p className="text-sm text-muted-foreground">
              Spin up your dashboard and explore every workflow.
            </p>
          </div>
          <Button asChild>
            <Link href="/register">Start free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
