"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "./step-indicator";
import { StepCustomer } from "./step-customer";
import { StepTechnical } from "./step-technical";
import { StepFinancial } from "./step-financial";
import { PdfPreview } from "./pdf-preview";
import {
  QuotationCustomerForm,
  QuotationTechnicalForm,
} from "@/types/quotation-form";

interface QuotationWizardProps {
  onSaveQuotation: (quotation: QuotationFormData) => void;
}

export interface QuotationFormData {
  customer: QuotationCustomerForm;
  technical: QuotationTechnicalForm;
}

const STEPS = [
  { label: "Customer Info" },
  { label: "System & Site" },
  { label: "Analysis & ROI" },
];

export function QuotationWizard({ onSaveQuotation }: QuotationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 - Customer Form
  const [customerForm, setCustomerForm] = useState<QuotationCustomerForm>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    location: "",
    consumerNo: "",
    sanctionLoad: "",
    siteType: "",
    billingType: "",
  });

  // Step 2 - Technical Form
  const [technicalForm, setTechnicalForm] = useState<QuotationTechnicalForm>({
    systemCapacity: "",
    systemType: "on-grid",
    panelType: "mono-standard",
    roofType: "",
    phase: "1-Phase",
    areaLength: "",
    areaWidth: "",
    buildingHeight: "",
  });

  // Step 3 - Financial Data (used for PDF preview)
  const [unitRate] = useState("8");
  const [systemCost] = useState("");
  const [subsidyAmount] = useState("78000");
  const [discount] = useState("0");

  // PDF Preview
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfType, setPdfType] = useState<"business" | "customer">("customer");

  const handleCustomerChange = (
    field: keyof QuotationCustomerForm,
    value: string
  ) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTechnicalChange = (
    field: keyof QuotationTechnicalForm,
    value: string
  ) => {
    setTechnicalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleDownloadPDF = (type: "business" | "customer") => {
    setPdfType(type);
    setPdfPreviewOpen(true);
  };

  const handleSaveQuotation = () => {
    onSaveQuotation({
      customer: customerForm,
      technical: technicalForm,
    });
    // Reset forms
    setCustomerForm({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      location: "",
      consumerNo: "",
      sanctionLoad: "",
      siteType: "",
      billingType: "",
    });
    setTechnicalForm({
      systemCapacity: "",
      systemType: "on-grid",
      panelType: "mono-standard",
      roofType: "",
      phase: "1-Phase",
      areaLength: "",
      areaWidth: "",
      buildingHeight: "",
    });
    setCurrentStep(1);
  };

  const systemKw = parseFloat(technicalForm.systemCapacity) || 0;
  const baseCost = systemCost ? parseFloat(systemCost) : systemKw * 45000;
  const subsidyNum = parseFloat(subsidyAmount) || 0;
  const discountNum = parseFloat(discount) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create New Quotation</CardTitle>
      </CardHeader>
      <CardContent>
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        {/* Step 1 - Customer Information */}
        {currentStep === 1 && (
          <StepCustomer
            form={customerForm}
            onChange={handleCustomerChange}
            onNext={handleNextStep}
          />
        )}

        {/* Step 2 - Technical Details */}
        {currentStep === 2 && (
          <StepTechnical
            form={technicalForm}
            sanctionLoad={customerForm.sanctionLoad}
            onChange={handleTechnicalChange}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        )}

        {/* Step 3 - Financial Calculation */}
        {currentStep === 3 && (
          <StepFinancial
            customerForm={customerForm}
            technicalForm={technicalForm}
            onBack={handlePrevStep}
            onDownloadPDF={handleDownloadPDF}
            onSaveQuotation={handleSaveQuotation}
          />
        )}
      </CardContent>

      {/* PDF Preview Modal */}
      <PdfPreview
        isOpen={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        type={pdfType}
        customerData={customerForm}
        technicalData={technicalForm}
        financialData={{
          systemCost: baseCost,
          subsidyAmount: subsidyNum,
          unitRate: parseFloat(unitRate) || 8,
          discount: discountNum,
        }}
      />
    </Card>
  );
}
