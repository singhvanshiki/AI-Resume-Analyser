"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";

const schema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof schema>;

export default function StudentProfilePage() {
  const user = useAuthStore((state) => state.user);
  const profile = useUserStore((state) => state.profile);
  const updateProfile = useUserStore((state) => state.updateProfile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: profile,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Update your personal details and resume profile data."
      />

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={user?.role ?? "student"} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit((values) => updateProfile(values))}
          >
            <div className="space-y-2">
              <Label htmlFor="title">Headline</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...form.register("company")} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...form.register("bio")} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Save profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
