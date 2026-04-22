"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileMenu } from "./mobile-menu";

interface HeaderProps {
  title?: string;
  onProfileClick?: () => void;
}

export function Header({ title = "Dashboard", onProfileClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Mobile menu */}
      <MobileMenu />

      {/* Page title - hidden on mobile */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-accent" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User menu */}
        <Button variant="ghost" size="icon" onClick={onProfileClick}>
          <Avatar size="sm">
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open Profile</span>
        </Button>
      </div>
    </header>
  );
}
