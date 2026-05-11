"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email(),
});

type ForgotFormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: ForgotFormValues) => {
    toast.success(
      `If an account exists for ${values.email}, a reset link will be sent.`,
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
        <div className="text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-foreground">
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
