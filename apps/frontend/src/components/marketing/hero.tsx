"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 pb-20 pt-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="absolute inset-0 surface-grid opacity-70" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-6"
        >
          <Badge variant="secondary">AI Resume Analyzer Platform</Badge>
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Build ATS-ready resumes and recruiter-grade insights in one
            workflow.
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Measure ATS readiness, extract skills, and align resume-to-JD fit
            with real-time analysis. Recruiters get instant candidate rankings
            and comparison boards.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/register">Start analyzing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/features">Explore features</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid gap-6 rounded-3xl border border-border/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:bg-slate-900/70 md:grid-cols-3"
        >
          {[
            {
              title: "ATS scoring",
              desc: "Understand the score drivers and missing skills instantly.",
            },
            {
              title: "JD alignment",
              desc: "Compare resumes to job descriptions with semantic matching.",
            },
            {
              title: "Recruiter toolkit",
              desc: "Rank and compare candidates with structured explanations.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
