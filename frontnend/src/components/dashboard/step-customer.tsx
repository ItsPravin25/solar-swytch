"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  QuotationCustomerForm,
  SITE_TYPES,
  BILLING_TYPES,
  SANCTION_LOAD_OPTIONS,
  getAllowedPhases,
} from "@/types/quotation-form";
import { Zap } from "lucide-react";

interface StepCustomerProps {
  form: QuotationCustomerForm;
  onChange: (field: keyof QuotationCustomerForm, value: string) => void;
  onNext: () => void;
}

export function StepCustomer({ form, onChange, onNext }: StepCustomerProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof QuotationCustomerForm, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof QuotationCustomerForm, string>> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.sanctionLoad) newErrors.sanctionLoad = "Sanction load is required";
    if (!form.siteType) newErrors.siteType = "Site type is required";
    if (!form.billingType) newErrors.billingType = "Billing type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const allowedPhases = getAllowedPhases(form.sanctionLoad);
  const phaseLabel = allowedPhases.length === 1
    ? `(${allowedPhases[0]} only)`
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Rajesh"
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className={cn(errors.firstName && "border-destructive")}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Patil"
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className={cn(errors.lastName && "border-destructive")}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className={cn(errors.phone && "border-destructive")}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <textarea
          id="address"
          placeholder="Plot 12, Shivaji Nagar, Pune"
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
          rows={2}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            errors.address && "border-destructive"
          )}
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location (City, State)</Label>
        <Input
          id="location"
          placeholder="Pune, Maharashtra"
          value={form.location}
          onChange={(e) => onChange("location", e.target.value)}
          className={cn(errors.location && "border-destructive")}
        />
        {errors.location && (
          <p className="text-xs text-destructive">{errors.location}</p>
        )}
      </div>

      {/* Consumer No */}
      <div className="space-y-2">
        <Label htmlFor="consumerNo">Consumer No. (Optional)</Label>
        <Input
          id="consumerNo"
          placeholder="MH042300123456"
          value={form.consumerNo}
          onChange={(e) => onChange("consumerNo", e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Site Type */}
        <div className="space-y-2">
          <Label htmlFor="siteType">Site Type</Label>
          <Select
            value={form.siteType}
            onValueChange={(value) => onChange("siteType", value || "")}
          >
            <SelectTrigger className={cn(errors.siteType && "border-destructive")}>
              <SelectValue placeholder="Select site type" />
            </SelectTrigger>
            <SelectContent>
              {SITE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.siteType && (
            <p className="text-xs text-destructive">{errors.siteType}</p>
          )}
        </div>

        {/* Billing Type */}
        <div className="space-y-2">
          <Label htmlFor="billingType">Billing Type</Label>
          <Select
            value={form.billingType}
            onValueChange={(value) => onChange("billingType", value || "")}
          >
            <SelectTrigger className={cn(errors.billingType && "border-destructive")}>
              <SelectValue placeholder="Select billing type" />
            </SelectTrigger>
            <SelectContent>
              {BILLING_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.billingType && (
            <p className="text-xs text-destructive">{errors.billingType}</p>
          )}
        </div>
      </div>

      {/* Sanction Load */}
      <div className="space-y-2">
        <Label htmlFor="sanctionLoad">Sanction Load (kW)</Label>
        <div className="relative">
          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Select
            value={form.sanctionLoad}
            onValueChange={(value) => onChange("sanctionLoad", value || "")}
          >
            <SelectTrigger className={cn("pl-10", errors.sanctionLoad && "border-destructive")}>
              <SelectValue placeholder="Select sanction load" />
            </SelectTrigger>
            <SelectContent>
              {SANCTION_LOAD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} {option.phases.length === 1 ? `(${option.phases[0]} only)` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {form.sanctionLoad && (
          <p className="text-xs text-muted-foreground">
            Phase options: {allowedPhases.join(", ")} {phaseLabel}
          </p>
        )}
        {errors.sanctionLoad && (
          <p className="text-xs text-destructive">{errors.sanctionLoad}</p>
        )}
      </div>

      {/* PM Surya Ghar Notice for eligible billing types */}
      {(form.billingType === "res-1-phase" ||
        form.billingType === "res-3-phase" ||
        form.billingType === "com-1-phase") && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Only these categories are eligible for PM Surya Ghar Yojna:{" "}
            <strong>LT-I A</strong> (Residential 1-Phase Domestic),{" "}
            <strong>LT-I B</strong> (Residential 3-Phase Domestic),{" "}
            <strong>LT-I C</strong> (Commercial 1-Phase Small Business).
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-md text-sm font-medium transition-colors"
        >
          Next: System & Site
        </button>
      </div>
    </form>
  );
}