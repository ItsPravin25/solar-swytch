"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingRow } from "./pricing-table";

interface PricingSummaryProps {
  rows: PricingRow[];
}

export function PricingSummary({ rows }: PricingSummaryProps) {
  const stats = useMemo(() => {
    const totalConfigs = rows.length;
    const completeConfigs = rows.filter((r) => r.isComplete).length;
    const totalValue = rows.reduce((sum, row) => {
      const rowTotal =
        row.panelCost +
        row.inverterCost +
        row.structureCost +
        row.cableCost +
        row.otherCost;
      return sum + rowTotal;
    }, 0);
    const avgCost = totalConfigs > 0 ? totalValue / totalConfigs : 0;
    const singlePhaseCount = rows.filter((r) => r.phase === "single").length;
    const threePhaseCount = rows.filter((r) => r.phase === "three").length;

    return {
      totalConfigs,
      completeConfigs,
      totalValue,
      avgCost,
      singlePhaseCount,
      threePhaseCount,
    };
  }, [rows]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalConfigs}</div>
          <p className="text-xs text-muted-foreground">
            {stats.singlePhaseCount} single-phase, {stats.threePhaseCount} three-phase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.completeConfigs}/{stats.totalConfigs}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalConfigs > 0
              ? Math.round((stats.completeConfigs / stats.totalConfigs) * 100)
              : 0}
            % configured
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Avg: {formatCurrency(stats.avgCost)} per config
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
