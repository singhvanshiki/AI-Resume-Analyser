import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          The page you are looking for has moved or does not exist. Head back to
          the dashboard or explore the product overview.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/student">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
