"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ProfilePanel } from "@/components/shared/profile-panel";
import { cn } from "@/lib/utils";

const pathToTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/quotation/new": "New Quotation",
  "/dashboard/pricing": "Pricing Setup",
  "/dashboard/expenses": "Other Expenses",
  "/dashboard/settings/gst": "GST Settings",
  "/dashboard/settings/payment": "Payment Settings",
  "/dashboard/settings/technical": "Technical Settings",
};

const defaultProfile = {
  fullName: "Pravin Solar",
  email: "admin@solarswytch.com",
  phone: "+91 98765 43210",
  businessType: "installer",
  role: "owner",
  companyName: "Solar Swytch Pvt. Ltd.",
  gstNumber: "27ABCDE1234F1Z5",
  logoPreview: "",
  address: "Shop No. 12, Solar Complex, MG Road",
  state: "Maharashtra",
  city: "Pune",
  pincode: "411001",
  primaryContact: "+91 98765 43210",
  alternateContact: "+91 80000 12345",
  bankName: "HDFC Bank",
  accountNumber: "12345678901234",
  ifscCode: "HDFC0001234",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pathToTitle[pathname] || "Dashboard";
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);

  const handleProfileSave = (updated: typeof profile) => {
    setProfile(updated);
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-sidebar">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 border-b">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </div>
            <span className="font-semibold text-sidebar-foreground">Solar Swytch</span>
          </div>
          {/* Navigation */}
          <Sidebar />
        </aside>

        {/* Main content area */}
        <div className={cn("flex flex-1 flex-col lg:pl-60")}>
          <Header title={title} onProfileClick={() => setProfileOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      <ProfilePanel
        open={profileOpen}
        profile={profile}
        onClose={() => setProfileOpen(false)}
        onSave={handleProfileSave}
      />
    </>
  );
}
