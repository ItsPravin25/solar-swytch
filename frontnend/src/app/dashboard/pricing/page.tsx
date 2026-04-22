"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { PricingTable } from "@/components/dashboard/pricing-table";
import { PricingSummary } from "@/components/dashboard/pricing-summary";

interface PricingRow {
  id: string;
  capacity: string;
  phase: "single" | "three";
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
  isComplete: boolean;
}

export default function PricingPage() {
  const [rows, setRows] = useState<PricingRow[]>([
    { id: "r1", capacity: "3kW", phase: "single", panelCost: 72000, inverterCost: 18000, structureCost: 9000, cableCost: 4500, otherCost: 3000, isComplete: true },
    { id: "r2", capacity: "5kW", phase: "single", panelCost: 110000, inverterCost: 28000, structureCost: 14000, cableCost: 6500, otherCost: 4500, isComplete: true },
    { id: "r3", capacity: "5kW", phase: "three", panelCost: 112000, inverterCost: 32000, structureCost: 14000, cableCost: 7000, otherCost: 5000, isComplete: true },
    { id: "r4", capacity: "7kW", phase: "single", panelCost: 145000, inverterCost: 38000, structureCost: 16000, cableCost: 8000, otherCost: 6000, isComplete: false },
    { id: "r5", capacity: "7kW", phase: "three", panelCost: 154000, inverterCost: 42000, structureCost: 18000, cableCost: 9000, otherCost: 6500, isComplete: true },
    { id: "r6", capacity: "10kW", phase: "three", panelCost: 210000, inverterCost: 58000, structureCost: 24000, cableCost: 12000, otherCost: 8000, isComplete: true },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Pricing Management" />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pricing Setup</h2>
          <p className="text-muted-foreground">
            Configure solar system costs for different capacities and phases
          </p>
        </div>

        <PricingSummary rows={rows} />
        <PricingTable />
      </main>
    </div>
  );
}
