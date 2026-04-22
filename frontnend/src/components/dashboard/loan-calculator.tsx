"use client";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LoanCalculatorProps {
  principal: number;
  rate: number;
  years: number;
  onPrincipalChange: (value: number) => void;
  onRateChange: (value: number) => void;
  onYearsChange: (value: number) => void;
}

function calculateEMI(principal: number, rate: number, years: number): number {
  if (principal <= 0 || rate <= 0 || years <= 0) return 0;
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return isFinite(emi) ? emi : 0;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function LoanCalculator({
  principal,
  rate,
  years,
  onPrincipalChange,
  onRateChange,
  onYearsChange,
}: LoanCalculatorProps) {
  const emi = calculateEMI(principal, rate, years);
  const totalPayable = emi * years * 12;
  const totalInterest = totalPayable - principal;

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Loan Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="loan-amount" className="text-sm font-medium">
            Loan Amount
          </label>
          <Input
            id="loan-amount"
            type="number"
            min="10000"
            max="10000000"
            step="10000"
            value={principal}
            onChange={(e) => onPrincipalChange(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="interest-rate" className="text-sm font-medium">
            Interest Rate (%)
          </label>
          <Input
            id="interest-rate"
            type="number"
            min="1"
            max="30"
            step="0.1"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="loan-term" className="text-sm font-medium">
            Loan Term (Years)
          </label>
          <Input
            id="loan-term"
            type="number"
            min="1"
            max="30"
            step="1"
            value={years}
            onChange={(e) => onYearsChange(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">EMI (per month)</span>
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(Math.round(emi))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Payable</span>
            <span className="font-medium">{formatCurrency(Math.round(totalPayable))}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Interest</span>
            <span className="text-muted-foreground">{formatCurrency(Math.round(totalInterest))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { calculateEMI, formatCurrency };