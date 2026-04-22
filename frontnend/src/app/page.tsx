import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Sun className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Solar Swytch
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional quotation management for solar installations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dashboard</CardTitle>
              <CardDescription>Monitor KPIs and quotations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track installation progress, revenue metrics, and customer data in real-time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Quotations</CardTitle>
              <CardDescription>3-step guided process</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate professional quotes with customer details, system configuration, and pricing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>GST, payment, and technical</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure GST rates, payment terms, and technical specifications for your installations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          <Button size="lg">
            <Link href="/login" className="flex items-center gap-2 h-full w-full px-4">
              Sign In
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/register" className="flex items-center gap-2 h-full w-full px-4">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}