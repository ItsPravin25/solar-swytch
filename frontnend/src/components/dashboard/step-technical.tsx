"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  QuotationTechnicalForm,
  SYSTEM_TYPES,
  ROOF_TYPES,
  CAPACITY_OPTIONS,
  PANEL_TYPES,
  getAllowedPhases,
} from "@/types/quotation-form";
import {
  calculateNumPanels,
  calculateSystemArea,
  calculateAvailableArea,
  calculateShortfall,
} from "@/lib/calculations";
import {
  Layers,
  Check,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface StepTechnicalProps {
  form: QuotationTechnicalForm;
  sanctionLoad: string;
  onChange: (field: keyof QuotationTechnicalForm, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepTechnical({
  form,
  sanctionLoad,
  onChange,
  onBack,
  onNext,
}: StepTechnicalProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof QuotationTechnicalForm, string>>>({});

  const allowedPhases = getAllowedPhases(sanctionLoad);

  // Calculate derived values
  const totalArea = form.areaLength && form.areaWidth
    ? Number(form.areaLength) * Number(form.areaWidth)
    : 0;

  const availableArea = calculateAvailableArea(totalArea);

  const numPanels = form.systemCapacity
    ? calculateNumPanels(parseFloat(form.systemCapacity), form.panelType)
    : 0;

  const systemArea = calculateSystemArea(numPanels, form.panelType);

  const shortfall = calculateShortfall(availableArea, systemArea);

  const selectedPanel = PANEL_TYPES.find((p) => p.id === form.panelType) || PANEL_TYPES[0];

  const validateForm = () => {
    const newErrors: Partial<Record<keyof QuotationTechnicalForm, string>> = {};

    if (!form.systemCapacity) newErrors.systemCapacity = "System capacity is required";
    if (!form.systemType) newErrors.systemType = "System type is required";
    if (!form.panelType) newErrors.panelType = "Panel type is required";
    if (!form.roofType) newErrors.roofType = "Roof type is required";
    if (!form.phase) newErrors.phase = "Phase is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - System Configuration */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">System Configuration</h3>

            {/* System Capacity */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="systemCapacity">System Capacity</Label>
              <Select
                value={form.systemCapacity}
                onValueChange={(value) => onChange("systemCapacity", value || "")}
              >
                <SelectTrigger className={cn(errors.systemCapacity && "border-destructive")}>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {CAPACITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.systemCapacity && (
                <p className="text-xs text-destructive">{errors.systemCapacity}</p>
              )}
            </div>

            {/* System Type */}
            <div className="space-y-2 mb-4">
              <Label>System Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {SYSTEM_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={form.systemType === type.value ? "default" : "outline"}
                    onClick={() => onChange("systemType", type.value)}
                    className={cn(
                      "text-xs h-auto py-2",
                      form.systemType === type.value && "bg-primary"
                    )}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
              {errors.systemType && (
                <p className="text-xs text-destructive">{errors.systemType}</p>
              )}
            </div>

            {/* Phase Selection - based on sanction load */}
            <div className="space-y-2 mb-4">
              <Label>Phase</Label>
              <div className="grid grid-cols-2 gap-2">
                {allowedPhases.map((phase) => (
                  <Button
                    key={phase}
                    type="button"
                    variant={form.phase === phase ? "default" : "outline"}
                    onClick={() => onChange("phase", phase)}
                    className={cn(
                      "text-xs h-auto py-2",
                      form.phase === phase && "bg-primary"
                    )}
                  >
                    {phase}
                  </Button>
                ))}
              </div>
              {allowedPhases.length === 1 && (
                <p className="text-xs text-muted-foreground">
                  Based on sanction load ({sanctionLoad} kW)
                </p>
              )}
              {errors.phase && (
                <p className="text-xs text-destructive">{errors.phase}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Site Specifications</h3>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Area Length */}
              <div className="space-y-2">
                <Label htmlFor="areaLength">Length (ft)</Label>
                <Input
                  id="areaLength"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.areaLength}
                  onChange={(e) => onChange("areaLength", e.target.value)}
                />
              </div>

              {/* Area Width */}
              <div className="space-y-2">
                <Label htmlFor="areaWidth">Width (ft)</Label>
                <Input
                  id="areaWidth"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.areaWidth}
                  onChange={(e) => onChange("areaWidth", e.target.value)}
                />
              </div>

              {/* Total Area (Auto-calculated) */}
              <div className="space-y-2">
                <Label>Total Area</Label>
                <Input
                  value={totalArea ? `${totalArea} sq.ft` : ""}
                  readOnly
                  placeholder="Auto"
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Building Height */}
              <div className="space-y-2">
                <Label htmlFor="buildingHeight">Building Height (ft)</Label>
                <Input
                  id="buildingHeight"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={form.buildingHeight}
                  onChange={(e) => onChange("buildingHeight", e.target.value)}
                />
              </div>

              {/* Roof Type */}
              <div className="space-y-2">
                <Label htmlFor="roofType">Roof Type</Label>
                <Select
                  value={form.roofType}
                  onValueChange={(value) => onChange("roofType", value || "")}
                >
                  <SelectTrigger className={cn(errors.roofType && "border-destructive")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOF_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roofType && (
                  <p className="text-xs text-destructive">{errors.roofType}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Panel Selection & Area Analysis */}
        <div className="space-y-4">
          {/* Panel Type Selection */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Select Panel Type</h3>
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-4 gap-2 p-3 bg-muted text-xs font-semibold">
                  <div></div>
                  <div>Panel Type</div>
                  <div>Wattage</div>
                  <div>Dimensions</div>
                </div>
                {PANEL_TYPES.map((panel) => (
                  <div
                    key={panel.id}
                    onClick={() => onChange("panelType", panel.id)}
                    className={cn(
                      "grid grid-cols-4 gap-2 p-3 cursor-pointer border-t items-center transition-colors",
                      form.panelType === panel.id
                        ? "bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          form.panelType === panel.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {form.panelType === panel.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{panel.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {panel.areaSqFt} sq.ft/panel
                      </p>
                    </div>
                    <div className="text-sm">{panel.wattage}W</div>
                    <div className="text-sm">{panel.dimensions}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {errors.panelType && (
              <p className="text-xs text-destructive mt-2">{errors.panelType}</p>
            )}
          </div>

          {/* Site Area Analysis */}
          {form.systemCapacity && totalArea > 0 && (
            <Card className="border-primary">
              <CardHeader className="bg-primary py-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Site Area Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">No. of Panels</span>
                  <span className="text-sm font-semibold">
                    {numPanels} x {selectedPanel.name} ({selectedPanel.wattage}W)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Available Area (50%)</span>
                  <span className="text-sm font-semibold text-green-600">
                    {availableArea} sq.ft
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">System Area Required</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      systemArea > availableArea ? "text-red-600" : ""
                    )}
                  >
                    {systemArea} sq.ft
                  </span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Shortfall</span>
                  {shortfall > 0 ? (
                    <div className="flex items-center gap-1.5 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-sm font-semibold">{shortfall} sq.ft</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-green-600">
                      <Check className="h-3 w-3" />
                      <span className="text-sm font-semibold">None</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit" className="bg-primary">
          Next: Analysis & ROI
        </Button>
      </div>
    </form>
  );
}