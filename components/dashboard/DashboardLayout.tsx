"use client";
import React from "react";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Sidebar } from "./Sidebar";
import { User } from "@/types/user";
import { renderProviderValue } from "@/utils/user";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: Partial<User> | null;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const providerType = user?.providers?.[0]?.provider;
  const displayValue = providerType
    ? renderProviderValue(providerType, user as User)
    : "Unknown";

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar - Fixed position */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 md:ml-[240px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1">
            {/* You can add a title or branding here */}
            {/* <h1 className="text-xl font-semibold md:text-2xl">Tanscrow</h1> */}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {/* Notifications indicator */}
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600"></span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={user?.profileImageUrl || ""}
                  alt={user?.firstName || "User"}
                />
                <AvatarFallback>
                  {user?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {displayValue}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
