"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Repeat,
  Wallet,
  AlertTriangle,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function SidebarNavItem({ href, icon, label, isActive }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.push("/signin");
  }

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/transactions",
      icon: <Repeat className="h-5 w-5" />,
      label: "Transactions",
    },
    {
      href: "/dashboard/wallet",
      icon: <Wallet className="h-5 w-5" />,
      label: "Wallet",
    },
    {
      href: "/dashboard/disputes",
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Disputes",
    },
    {
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
      label: "Profile",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
    {
      href: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help & Support",
    },
  ];

  return (
    <div className="flex h-screen w-[240px] flex-col border-r bg-background p-4 overflow-y-auto">
      <div className="flex h-14 items-center px-4 font-semibold">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">Escrow</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 py-4">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={
              pathname === item.href ||
              (pathname.startsWith(item.href + "/") &&
                item.href !== "/dashboard")
            }
          />
        ))}
      </nav>
      <div className="border-t pt-4">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
