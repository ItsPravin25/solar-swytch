"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuotationTechnicalForm } from "@/types/quotation-form";
import {
  calculateROI,
  calculateNumPanels,
  calculateSystemArea,
  calculateAvailableArea,
  calculateCO2Saved,
  formatINR,
  calculateEMI,
} from "@/lib/calculations";
import {
  TrendingUp,
  Leaf,
  Check,
  X,
  ArrowLeft,
  Download,
  Printer,
} from "lucide-react";

interface StepFinancialProps {
  customerForm: {
    firstName: string;
    lastName: string;
    phone: string;
    consumerNo: string;
    sanctionLoad: string;
    siteType: string;
    billingType: string;
  };
  technicalForm: QuotationTechnicalForm;
  onBack: () => void;
  onDownloadPDF: (type: "business" | "customer") => void;
  onSaveQuotation: () => void;
}

export function StepFinancial({
  customerForm,
  technicalForm,
  onBack,
  onDownloadPDF,
  onSaveQuotation,
}: StepFinancialProps) {
  const [unitRate, setUnitRate] = useState("8");
  const [systemCost, setSystemCost] = useState("");
  const [subsidyAmount, setSubsidyAmount] = useState("78000");
  const [discount, setDiscount] = useState("0");
  const [loanEnabled, setLoanEnabled] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanInterest, setLoanInterest] = useState("");
  const [loanYears, setLoanYears] = useState("");

  const systemKw = parseFloat(technicalForm.systemCapacity) || 0;

  // Default system cost if not provided
  const baseCost = systemCost
    ? parseFloat(systemCost)
    : systemKw * 45000;

  // Calculate expenses (installation, transport, etc.)
  const totalExpenses = baseCost;

  // ROI calculations
  const unitRateNum = parseFloat(unitRate) || 8;
  const subsidyNum = parseFloat(subsidyAmount) || 0;

  const roi = useMemo(
    () =>
      calculateROI(systemKw, totalExpenses, unitRateNum, subsidyNum),
    [systemKw, totalExpenses, unitRateNum, subsidyNum]
  );

  // Discount calculation
  const discountPercent = parseFloat(discount) || 0;
  const discountAmount = totalExpenses * (discountPercent / 100);
  const finalQuotation = totalExpenses - discountAmount;

  // Panel info
  const numPanels = calculateNumPanels(systemKw, technicalForm.panelType);
  const totalArea =
    parseFloat(technicalForm.areaLength || "0") *
    parseFloat(technicalForm.areaWidth || "0");
  const availableArea = calculateAvailableArea(totalArea);
  const systemArea = calculateSystemArea(numPanels, technicalForm.panelType);
  const shortfall = Math.max(0, systemArea - availableArea);

  // Carbon footprint
  const co2Saved = calculateCO2Saved(systemKw);

  // Loan calculation
  const loanAmountNum = parseFloat(loanAmount) || 0;
  const loanInterestNum = parseFloat(loanInterest) || 0;
  const loanYearsNum = parseInt(loanYears) || 0;
  const loanEmi =
    loanAmountNum > 0 && loanInterestNum > 0 && loanYearsNum > 0
      ? calculateEMI(loanAmountNum, loanInterestNum, loanYearsNum)
      : 0;
  const loanPayable = loanEmi * (loanYearsNum * 12);

  // Business calculations
  const quotedPrice = totalExpenses * 1.2;
  const profit = quotedPrice - totalExpenses;
  const profitMargin = totalExpenses > 0 ? (profit / totalExpenses) * 100 : 0;
  const isProfitable = profitMargin >= 15;

  const panelTypeLabels: Record<string, string> = {
    "mono-standard": "Mono Standard",
    "mono-large": "Mono Large",
    "topcon": "TOPCon",
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Customer Summary */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Customer Summary</h3>
            <Card className="border-primary">
              <CardHeader className="bg-primary py-3">
                <CardTitle className="text-white text-sm">
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">
                    {customerForm.firstName} {customerForm.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium">{customerForm.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Consumer No.</span>
                  <span className="text-sm font-medium text-primary">
                    {customerForm.consumerNo || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sanction Load</span>
                  <span className="text-sm font-medium">
                    {customerForm.sanctionLoad} kW
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">System Type</span>
                  <span className="text-sm font-medium">
                    {technicalForm.systemType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Panel</span>
                  <span className="text-sm font-medium">
                    {panelTypeLabels[technicalForm.panelType] || "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Site Area Analysis */}
          {systemKw > 0 && (
            <Card>
              <CardHeader className="py-3 bg-muted">
                <CardTitle className="text-sm flex items-center gap-2">
                  Site Area Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">No. of Panels</span>
                  <span className="text-sm font-semibold">
                    {numPanels} x {technicalForm.systemCapacity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Available Area</span>
                  <span className="text-sm font-semibold text-green-600">
                    {availableArea} sq.ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">System Area</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      systemArea > availableArea ? "text-red-600" : ""
                    )}
                  >
                    {systemArea} sq.ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Shortfall</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      shortfall > 0 ? "text-red-600" : "text-green-600"
                    )}
                  >
                    {shortfall > 0 ? `${shortfall} sq.ft` : "None"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Carbon Footprint */}
          {systemKw > 0 && (
            <Card className="border-green-500 bg-green-50">
              <CardContent className="p-4 flex items-center gap-3">
                <Leaf className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-700">
                    Carbon Footprint Saved
                  </p>
                  <p className="text-lg font-bold text-green-700">
                    {co2Saved} <span className="text-sm font-normal">tonnes CO2/yr</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle Column - Cost Configuration */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Cost Configuration</h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                {/* System Cost */}
                <div className="space-y-2">
                  <Label htmlFor="systemCost">System Cost (INR)</Label>
                  <Input
                    id="systemCost"
                    type="number"
                    min="0"
                    placeholder={`Auto: ${formatINR(systemKw * 45000)}`}
                    value={systemCost}
                    onChange={(e) => setSystemCost(e.target.value)}
                  />
                </div>

                {/* Unit Rate */}
                <div className="space-y-2">
                  <Label htmlFor="unitRate">Unit Rate (INR/unit)</Label>
                  <Input
                    id="unitRate"
                    type="number"
                    min="0"
                    placeholder="8"
                    value={unitRate}
                    onChange={(e) => setUnitRate(e.target.value)}
                  />
                </div>

                {/* Subsidy */}
                <div className="space-y-2">
                  <Label htmlFor="subsidy">Cash Back / Subsidy (INR)</Label>
                  <Input
                    id="subsidy"
                    type="number"
                    min="0"
                    placeholder="78000"
                    value={subsidyAmount}
                    onChange={(e) => setSubsidyAmount(e.target.value)}
                  />
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>

                {/* Subsidy Notice */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs text-amber-800">
                    Customer pays the total chargeable amount to the vendor.
                    The Govt credits the Cash Back directly to the customer in ~45 days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loan Calculator */}
          <Card>
            <CardHeader className="py-3 bg-muted">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Bank Loan (Optional)</CardTitle>
                <Button
                  variant={loanEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLoanEnabled(!loanEnabled)}
                >
                  {loanEnabled ? "Enabled" : "Enable"}
                </Button>
              </div>
            </CardHeader>
            {loanEnabled && (
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Amount (INR)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanInterest">Interest (%)</Label>
                    <Input
                      id="loanInterest"
                      type="number"
                      min="0"
                      placeholder="8"
                      value={loanInterest}
                      onChange={(e) => setLoanInterest(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanYears">Years</Label>
                    <Input
                      id="loanYears"
                      type="number"
                      min="1"
                      placeholder="5"
                      value={loanYears}
                      onChange={(e) => setLoanYears(e.target.value)}
                    />
                  </div>
                </div>
                {loanEmi > 0 && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">EMI / Month</span>
                      <span className="text-sm font-bold text-primary">
                        {formatINR(loanEmi)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Payable</span>
                      <span className="text-sm font-semibold">
                        {formatINR(loanPayable)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column - ROI Calculation */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">ROI Calculation</h3>
            <Card className="border-primary">
              <CardHeader className="bg-primary py-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Return on Investment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Generation & Savings */}
                <div className="space-y-2">
                  {[
                    { label: "Monthly Generation", value: `~${roi.monthlyGeneration} units` },
                    { label: "Monthly Savings", value: formatINR(roi.monthlySavings) },
                    { label: "Annual Savings", value: formatINR(roi.annualSavings) },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-2 px-3 rounded-lg bg-green-50"
                    >
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Investment Details */}
                <div className="space-y-2 border-t pt-3">
                  {[
                    { label: "Total Cost", value: formatINR(totalExpenses) },
                    { label: "Cash Back (Subsidy)", value: `- ${formatINR(subsidyNum)}`, red: true },
                    { label: "Discount", value: `- ${formatINR(discountAmount)}`, red: true },
                    { label: "Final Quotation", value: formatINR(finalQuotation), blue: true },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          item.red && "text-red-600",
                          item.blue && "text-primary"
                        )}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Payback Period */}
                <div className="rounded-lg bg-primary p-4">
                  <p className="text-xs text-white/70 mb-1">Your Payback Period is</p>
                  <p className="text-xl font-bold text-white">
                    {roi.paybackYears} yrs {roi.paybackMonths} mo
                  </p>
                </div>

                {/* Free Years */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Profitable / Free Years
                  </p>
                  <p className="text-base font-bold text-green-700">
                    {roi.freeYears} yrs {roi.freeMonths} mo
                  </p>
                </div>

                {/* Total Savings */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Savings (25 yrs)
                  </p>
                  <p className="text-base font-bold text-green-700">
                    {formatINR(roi.totalSavings)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Summary */}
          <Card>
            <CardHeader className="py-3 bg-muted">
              <CardTitle className="text-sm">Business Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Projected Profit</span>
                <span className="text-sm font-semibold">{formatINR(Math.round(profit))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profit Margin</span>
                <span className="text-sm font-semibold">{profitMargin.toFixed(1)}%</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg p-3",
                  isProfitable
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                )}
              >
                {isProfitable ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                <span
                  className={cn(
                    "text-sm font-bold",
                    isProfitable ? "text-green-700" : "text-red-700"
                  )}
                >
                  {isProfitable ? "PROFITABLE" : "NON-PROFITABLE"} — {profitMargin.toFixed(1)}%
                  margin
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => onDownloadPDF("business")}
          >
            <Download className="h-4 w-4 mr-2" />
            Business PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => onDownloadPDF("customer")}
          >
            <Printer className="h-4 w-4 mr-2" />
            Customer PDF
          </Button>
        </div>
        <Button onClick={onSaveQuotation} className="bg-primary">
          Save Quotation
        </Button>
      </div>
    </div>
  );
}
