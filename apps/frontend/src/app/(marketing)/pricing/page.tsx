import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    description: "For students exploring ATS readiness and resume summaries.",
    features: [
      "1 active resume",
      "ATS score + analysis",
      "Skill extraction",
      "AI resume summary",
    ],
  },
  {
    name: "Growth",
    price: "$29",
    description: "For job seekers refining multiple roles and cover letters.",
    features: [
      "Unlimited resumes",
      "ATS + JD matching",
      "Cover letter generator",
      "Interview questions",
    ],
    highlighted: true,
  },
  {
    name: "Recruiter",
    price: "$89",
    description: "For hiring teams ranking and comparing candidates.",
    features: [
      "Candidate ranking",
      "Comparison dashboards",
      "Exportable reports",
      "Team analytics",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Pricing
        </p>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Flexible plans for every hiring workflow.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Start free and scale to recruiter-grade analytics. Upgrade as your
          resume operations grow.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={tier.highlighted ? "border-primary shadow-soft" : ""}
          >
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h3>
                {tier.highlighted && <Badge>Most popular</Badge>}
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {tier.price}
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {tier.description}
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register">Choose plan</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
