"use client";

import { useState } from "react";
import { LoanCalculator } from "./loan-calculator";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PaymentSettingsProps {
  initialPrincipal?: number;
  initialRate?: number;
  initialYears?: number;
  onSave?: (principal: number, rate: number, years: number) => void;
}

export function PaymentSettings({
  initialPrincipal = 100000,
  initialRate = 8.5,
  initialYears = 5,
  onSave,
}: PaymentSettingsProps) {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const [rate, setRate] = useState(initialRate);
  const [years, setYears] = useState(initialYears);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave?.(principal, rate, years);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>
            Configure default loan parameters for solar system financing
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {saved && (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Settings saved</span>
              </>
            )}
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Defaults"}
          </Button>
        </CardFooter>
      </Card>
      <LoanCalculator
        principal={principal}
        rate={rate}
        years={years}
        onPrincipalChange={setPrincipal}
        onRateChange={setRate}
        onYearsChange={setYears}
      />
    </div>
  );
}