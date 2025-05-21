// src/app/profile/components/AccountTab.tsx
"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AccountTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Account settings coming soon</p>
      </CardContent>
    </Card>
  );
}
