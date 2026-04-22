"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatINR, calculateROI, calculateNumPanels, calculateCO2Saved } from "@/lib/calculations";
import { Download, Printer, X } from "lucide-react";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  type: "business" | "customer";
  customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    location: string;
    consumerNo: string;
    sanctionLoad: string;
    siteType: string;
    billingType: string;
  };
  technicalData: {
    systemCapacity: string;
    systemType: string;
    panelType: string;
    roofType: string;
    phase: string;
    areaLength: string;
    areaWidth: string;
    buildingHeight: string;
  };
  financialData: {
    systemCost: number;
    subsidyAmount: number;
    unitRate: number;
    discount: number;
  };
}

export function PdfPreview({
  isOpen,
  onClose,
  type,
  customerData,
  technicalData,
  financialData,
}: PdfPreviewProps) {
  const systemKw = parseFloat(technicalData.systemCapacity) || 0;
  const subsidyNum = financialData.subsidyAmount;
  const unitRateNum = financialData.unitRate;
  const roi = calculateROI(systemKw, financialData.systemCost, unitRateNum, subsidyNum);
  const numPanels = calculateNumPanels(systemKw, technicalData.panelType as "mono-standard" | "mono-large" | "topcon");
  const co2Saved = calculateCO2Saved(systemKw);

  const panelTypeLabels: Record<string, string> = {
    "mono-standard": "Mono Standard",
    "mono-large": "Mono Large",
    "topcon": "TOPCon",
  };

  const discountAmount = financialData.systemCost * (financialData.discount / 100);
  const finalQuotation = financialData.systemCost - discountAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // For now, trigger print dialog which can save as PDF
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {type === "business" ? "Business Quotation" : "Customer Quotation"} - PDF Preview
          </DialogTitle>
        </DialogHeader>

        {/* PDF Content - This is what gets printed */}
        <div id="pdf-content" className="space-y-6 p-6 bg-white">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-primary">Solar Swytch</h1>
            <p className="text-sm text-muted-foreground">
              Solar Energy Solutions Provider
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {customerData.address}, {customerData.location}
            </p>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {customerData.firstName} {customerData.lastName}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {customerData.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {customerData.address}
                </p>
                <p>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {customerData.location}
                </p>
                <p>
                  <span className="text-muted-foreground">Consumer No:</span>{" "}
                  {customerData.consumerNo || "—"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">System Details</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Sanction Load:</span>{" "}
                  {customerData.sanctionLoad} kW
                </p>
                <p>
                  <span className="text-muted-foreground">Site Type:</span>{" "}
                  {customerData.siteType}
                </p>
                <p>
                  <span className="text-muted-foreground">Billing Type:</span>{" "}
                  {customerData.billingType}
                </p>
                <p>
                  <span className="text-muted-foreground">Requested Capacity:</span>{" "}
                  {technicalData.systemCapacity}
                </p>
                <p>
                  <span className="text-muted-foreground">System Type:</span>{" "}
                  {technicalData.systemType}
                </p>
              </div>
            </div>
          </div>

          {/* System Specification */}
          <div>
            <h3 className="text-sm font-semibold mb-2">System Specification</h3>
            <div className="border rounded-lg p-4">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-muted-foreground">Panel Type</td>
                    <td className="py-2 font-medium">
                      {panelTypeLabels[technicalData.panelType] || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">No. of Panels</td>
                    <td className="py-2 font-medium">{numPanels}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">Roof Type</td>
                    <td className="py-2 font-medium uppercase">
                      {technicalData.roofType}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">Phase</td>
                    <td className="py-2 font-medium">{technicalData.phase}</td>
                  </tr>
                  {technicalData.areaLength && technicalData.areaWidth && (
                    <tr>
                      <td className="py-2 text-muted-foreground">Site Area</td>
                      <td className="py-2 font-medium">
                        {parseFloat(technicalData.areaLength) * parseFloat(technicalData.areaWidth)} sq.ft
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Financial Summary</h3>
            <div className="border rounded-lg p-4">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-muted-foreground">System Cost</td>
                    <td className="py-2 font-medium text-right">
                      {formatINR(financialData.systemCost)}
                    </td>
                  </tr>
                  {financialData.discount > 0 && (
                    <tr>
                      <td className="py-2 text-muted-foreground">
                        Discount ({financialData.discount}%)
                      </td>
                      <td className="py-2 font-medium text-right text-red-600">
                        - {formatINR(discountAmount)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 text-muted-foreground">
                      Government Subsidy / Cash Back
                    </td>
                    <td className="py-2 font-medium text-right text-green-600">
                      - {formatINR(subsidyNum)}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-2">Final Quotation Amount</td>
                    <td className="py-2 text-right text-primary">
                      {formatINR(finalQuotation - subsidyNum)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ROI Details */}
          <div>
            <h3 className="text-sm font-semibold mb-2">ROI & Benefits</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="border rounded-lg p-3 bg-green-50">
                <p className="text-muted-foreground">Monthly Generation</p>
                <p className="text-lg font-bold text-green-700">
                  ~{roi.monthlyGeneration} units
                </p>
              </div>
              <div className="border rounded-lg p-3 bg-green-50">
                <p className="text-muted-foreground">Annual Savings</p>
                <p className="text-lg font-bold text-green-700">
                  {formatINR(roi.annualSavings)}
                </p>
              </div>
              <div className="border rounded-lg p-3 bg-primary/5">
                <p className="text-muted-foreground">Payback Period</p>
                <p className="text-lg font-bold text-primary">
                  {roi.paybackYears} yrs {roi.paybackMonths} mo
                </p>
              </div>
              <div className="border rounded-lg p-3 bg-green-50">
                <p className="text-muted-foreground">Total Savings (25 yrs)</p>
                <p className="text-lg font-bold text-green-700">
                  {formatINR(roi.totalSavings)}
                </p>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          {systemKw > 0 && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="text-sm font-semibold mb-2">Environmental Impact</h3>
              <p className="text-sm">
                <span className="text-muted-foreground">Carbon Footprint Saved:</span>{" "}
                <span className="font-bold text-green-700">
                  {co2Saved} tonnes CO2/year
                </span>
              </p>
            </div>
          )}

          {/* Business Only - Cost Breakdown */}
          {type === "business" && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Business Cost Breakdown</h3>
              <div className="border rounded-lg p-4">
                <table className="w-full text-sm">
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 text-muted-foreground">Cost/Watt (Business)</td>
                      <td className="py-2 font-medium text-right">
                        {formatINR(financialData.systemCost / (systemKw * 1000))}/W
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Cost/Watt (Customer)</td>
                      <td className="py-2 font-medium text-right">
                        {formatINR((finalQuotation - subsidyNum) / (systemKw * 1000))}/W
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Projected Profit</td>
                      <td className="py-2 font-medium text-right">
                        {formatINR(Math.round(finalQuotation - financialData.systemCost))}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Profit Margin</td>
                      <td className="py-2 font-medium text-right">
                        {(
                          ((finalQuotation - financialData.systemCost) /
                            financialData.systemCost *
                            100)
                        ).toFixed(1)}
                        %
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>This quotation is valid for 30 days from the date of issue.</p>
            <p className="mt-1">Generated by Solar Swytch Dashboard</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
