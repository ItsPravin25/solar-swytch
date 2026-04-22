"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { QuotationsTable } from "@/components/dashboard/quotations-table";
import type { QuotationDetail } from "@/types/quotation";

// Sample data for demo
const sampleQuotations: QuotationDetail[] = [
  {
    id: "q1",
    firstName: "Rajesh",
    lastName: "Patil",
    phone: "+91 98765 43210",
    address: "123 MG Road",
    location: "Pune, Maharashtra",
    consumerNo: "CON-2024-001",
    sanctionLoad: "5kW",
    siteType: "Residential",
    billingType: "Domestic",
    avgMonthlyUnits: 350,
    systemCapacity: "5kW",
    systemType: "on-grid",
    panelType: "Mono PERC",
    roofType: "Flat Concrete",
    numPanels: 10,
    dateTime: "2024-04-15T10:30:00Z",
    amount: "₹2,10,000",
    approved: false,
  },
  {
    id: "q2",
    firstName: "Sneha",
    lastName: "Kulkarni",
    phone: "+91 87654 32109",
    address: "456 FC Road",
    location: "Pune, Maharashtra",
    consumerNo: "CON-2024-002",
    sanctionLoad: "3kW",
    siteType: "Residential",
    billingType: "Domestic",
    avgMonthlyUnits: 220,
    systemCapacity: "3.5kW",
    systemType: "on-grid",
    panelType: "Mono PERC",
    roofType: "Sloped Tile",
    numPanels: 7,
    dateTime: "2024-04-14T14:20:00Z",
    amount: "₹1,54,000",
    approved: true,
  },
  {
    id: "q3",
    firstName: "Mohan",
    lastName: "Desai",
    phone: "+91 76543 21098",
    address: "789 SB Road",
    location: "Mumbai, Maharashtra",
    consumerNo: "CON-2024-003",
    sanctionLoad: "7kW",
    siteType: "Commercial",
    billingType: "Commercial",
    avgMonthlyUnits: 520,
    systemCapacity: "7kW",
    systemType: "hybrid",
    panelType: "Bifacial",
    roofType: "Flat Metal",
    numPanels: 14,
    dateTime: "2024-04-13T09:15:00Z",
    amount: "₹3,12,500",
    approved: false,
  },
  {
    id: "q4",
    firstName: "Priya",
    lastName: "Sharma",
    phone: "+91 65432 10987",
    address: "321 Koregaon Park",
    location: "Pune, Maharashtra",
    consumerNo: "CON-2024-004",
    sanctionLoad: "4kW",
    siteType: "Residential",
    billingType: "Domestic",
    avgMonthlyUnits: 280,
    systemCapacity: "4kW",
    systemType: "on-grid",
    panelType: "Mono PERC",
    roofType: "Flat Concrete",
    numPanels: 8,
    dateTime: "2024-04-12T16:45:00Z",
    amount: "₹1,78,000",
    approved: true,
  },
  {
    id: "q5",
    firstName: "Anil",
    lastName: "Reddy",
    phone: "+91 54321 09876",
    address: "555 JM Road",
    location: "Bangalore, Karnataka",
    consumerNo: "CON-2024-005",
    sanctionLoad: "6kW",
    siteType: "Residential",
    billingType: "Domestic",
    avgMonthlyUnits: 420,
    systemCapacity: "6kW",
    systemType: "on-grid",
    panelType: "Mono PERC",
    roofType: "Sloped Metal",
    numPanels: 12,
    dateTime: "2024-04-11T11:00:00Z",
    amount: "₹2,65,000",
    approved: true,
  },
];

// Calculate CO2 saved (tonnes per year)
function calcCO2Saved(capacityKw: number): number {
  // Formula: Capacity * 4.5 units/day * 0.75 * 365 days * 0.71 kg CO2/unit / 1000
  return (capacityKw * 4.5 * 0.75 * 365 * 0.71) / 1000;
}

export function DashboardView() {
  const totalQuotations = sampleQuotations.length;
  const approvedCount = sampleQuotations.filter((q) => q.approved).length;
  const pendingCount = totalQuotations - approvedCount;

  // Calculate total savings from approved quotations
  const totalSavings = sampleQuotations
    .filter((q) => q.approved)
    .reduce((acc, q) => {
      // Extract numeric value from amount string (e.g., "₹2,10,000" -> 210000)
      const amount = parseInt(q.amount.replace(/[^\d]/g, ""), 10);
      return acc + amount;
    }, 0);

  // Calculate CO2 saved from all quotations
  const co2Saved = sampleQuotations.reduce((acc, q) => {
    const capacity = parseFloat(q.systemCapacity.replace("kW", ""));
    return acc + calcCO2Saved(capacity);
  }, 0);

  const handleView = (id: string) => {
    console.log("View quotation:", id);
  };

  const handleDownload = (id: string) => {
    console.log("Download quotation:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit quotation:", id);
  };

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <KpiGrid
        totalQuotations={totalQuotations}
        approvedCount={approvedCount}
        totalSavings={totalSavings}
        co2Saved={co2Saved}
      />

      {/* Main content: Donut chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart Card */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pt-2">
            <DonutChart approved={approvedCount} pending={pendingCount} />
          </CardContent>
        </Card>

        {/* Quotations Table */}
        <Card className="lg:col-span-9">
          <CardContent className="p-0">
            <QuotationsTable
              quotations={sampleQuotations}
              onView={handleView}
              onDownload={handleDownload}
              onEdit={handleEdit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
