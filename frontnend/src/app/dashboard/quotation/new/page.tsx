"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/dashboard/header";
import { QuotationWizard, QuotationFormData } from "@/components/dashboard/quotation-wizard";
import { QuotationDetail } from "@/types/quotation-form";
import { useRouter } from "next/navigation";

export default function NewQuotationPage() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<QuotationDetail[]>([]);

  const handleSaveQuotation = useCallback((data: QuotationFormData) => {
    const systemKw = parseFloat(data.technical.systemCapacity) || 0;
    const baseCost = systemKw * 45000; // Default pricing

    // Calculate area values
    const totalArea = parseFloat(data.technical.areaLength || "0") * parseFloat(data.technical.areaWidth || "0");
    const availableArea = Math.round(totalArea * 0.5);
    const numPanels = Math.ceil(systemKw * 1000 / 540); // Default 540W panels
    const systemArea = Math.ceil(numPanels * 22); // 22 sq.ft per panel
    const shortfall = Math.max(0, systemArea - availableArea).toString();

    const newQuotation: QuotationDetail = {
      id: `q${Date.now()}`,
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      phone: data.customer.phone,
      address: data.customer.address,
      location: data.customer.location,
      consumerNo: data.customer.consumerNo,
      sanctionLoad: data.customer.sanctionLoad,
      siteType: data.customer.siteType,
      billingType: data.customer.billingType,
      avgMonthlyUnits: 0,
      systemCapacity: data.technical.systemCapacity,
      systemType: data.technical.systemType,
      panelType: data.technical.panelType,
      roofType: data.technical.roofType,
      areaLength: data.technical.areaLength,
      areaWidth: data.technical.areaWidth,
      buildingHeight: data.technical.buildingHeight,
      numPanels,
      availableArea: availableArea.toString(),
      systemArea: systemArea.toString(),
      shortfall,
      dateTime: new Date().toISOString(),
      amount: `Rs ${baseCost.toLocaleString("en-IN")}`,
      approved: false,
    };

    setQuotations((prev) => [newQuotation, ...prev]);
    // Navigate back to dashboard after saving
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="New Quotation" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Create New Quotation</h2>
            <p className="text-muted-foreground">
              Follow the 3-step wizard to create a new solar quotation
            </p>
          </div>

          <QuotationWizard onSaveQuotation={handleSaveQuotation} />
        </div>
      </main>
    </div>
  );
}
