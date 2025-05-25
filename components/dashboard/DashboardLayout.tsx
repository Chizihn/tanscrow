"use client";
import React from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Sidebar } from "./Sidebar";
import { User } from "@/types/user";
import { renderProviderValue } from "@/utils/user";
import { useNotifications } from "@/hooks/useNotification";
import { NotificationSheet } from "../notification/NotificationSheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: Partial<User> | null;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] =
    React.useState(false);

  const providerType = user?.providers?.[0]?.provider;
  const displayValue = providerType
    ? renderProviderValue(providerType, user as User)
    : "Unknown";

  const {
    notifications,
    selectedNotification,
    unreadCount,
    notificationsLoading,
    markAsReadLoading,
    markAllAsReadLoading,
    handleNotificationClick,
    handleBackToNotifications,
    handleMarkNotificationAsRead,
    handleMarkAllNotificationsAsRead,
  } = useNotifications();

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
          </div>
          <div className="flex items-center gap-4">
            <NotificationSheet
              notifications={notifications || []}
              unreadCount={unreadCount}
              loading={notificationsLoading}
              selectedNotification={selectedNotification}
              markAsReadLoading={markAsReadLoading}
              markAllAsReadLoading={markAllAsReadLoading}
              isOpen={isNotificationSheetOpen}
              onOpenChange={setIsNotificationSheetOpen}
              onNotificationClick={handleNotificationClick}
              onBackToNotifications={handleBackToNotifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />

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
