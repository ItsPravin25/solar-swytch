"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FilePlus,
  Package,
  ReceiptText,
  Percent,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

type NavSection =
  | "dashboard"
  | "createQuotation"
  | "pricing"
  | "otherExpenses"
  | "gst"
  | "payment"
  | "technical";

interface NavItem {
  id: NavSection;
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "createQuotation", label: "New Quotation", href: "/dashboard/quotation/new", icon: FilePlus },
  { id: "pricing", label: "Pricing Setup", href: "/dashboard/pricing", icon: Package },
  { id: "otherExpenses", label: "Other Expenses", href: "/dashboard/expenses", icon: ReceiptText },
  { id: "gst", label: "GST Settings", href: "/dashboard/settings/gst", icon: Percent },
  { id: "payment", label: "Payment Settings", href: "/dashboard/settings/payment", icon: CreditCard },
  { id: "technical", label: "Technical Settings", href: "/dashboard/settings/technical", icon: Settings },
];

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}

export function SidebarItem({ item, isActive, onClick }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent/10",
        isActive
          ? "bg-accent/15 text-accent"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 p-4">
      {navItems.map((item) => (
        <SidebarItem
          key={item.id}
          item={item}
          isActive={pathname === item.href}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
}

export { navItems };
export type { NavSection, NavItem };
