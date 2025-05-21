"use client";
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
