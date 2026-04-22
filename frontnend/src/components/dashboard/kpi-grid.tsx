import { FileText, CheckCircle, DollarSign, Leaf } from "lucide-react";
import { KpiCard } from "./kpi-card";

interface KpiGridProps {
  totalQuotations: number;
  approvedCount: number;
  totalSavings: number;
  co2Saved: number;
}

const gradients = {
  quotations: "linear-gradient(135deg, #0B1E3D 0%, #133366 100%)",
  approved: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
  savings: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
  co2: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
};

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function KpiGrid({
  totalQuotations,
  approvedCount,
  totalSavings,
  co2Saved,
}: KpiGridProps) {
  const cards = [
    {
      label: "Total Quotations",
      value: totalQuotations.toString(),
      sub: "All time",
      gradient: gradients.quotations,
      icon: <FileText className="w-4 h-4 text-white" />,
    },
    {
      label: "Approved",
      value: approvedCount.toString(),
      sub: `${Math.round((approvedCount / totalQuotations) * 100) || 0}% rate`,
      gradient: gradients.approved,
      icon: <CheckCircle className="w-4 h-4 text-white" />,
    },
    {
      label: "Total Savings",
      value: formatINR(totalSavings),
      sub: "Customer savings",
      gradient: gradients.savings,
      icon: <DollarSign className="w-4 h-4 text-white" />,
    },
    {
      label: "CO2 Saved",
      value: `${co2Saved.toFixed(1)}`,
      sub: "tonnes CO2/yr",
      gradient: gradients.co2,
      icon: <Leaf className="w-4 h-4 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
}
