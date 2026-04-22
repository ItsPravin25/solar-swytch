"use client";

import { useState } from "react";
import { PanelTypeCard, PanelType } from "./panel-type-card";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";

const DEFAULT_PANELS: PanelType[] = [
  {
    id: "mono-standard",
    name: "Monocrystalline (Standard)",
    wattageRange: "300W – 400W",
    dimensions: "~1.65m × 1.0m",
    areaSqFt: 17.8,
    active: true,
  },
  {
    id: "mono-large",
    name: "Monocrystalline (Large)",
    wattageRange: "450W – 600W+",
    dimensions: "~2.0m × 1.1m",
    areaSqFt: 23.7,
    active: true,
  },
  {
    id: "topcon",
    name: "TOPCon (N-Type)",
    wattageRange: "550W – 630W+",
    dimensions: "~2.27m × 1.13m",
    areaSqFt: 27.6,
    active: true,
  },
];

interface TechnicalSettingsProps {
  initialPanels?: PanelType[];
  onSave?: (panels: PanelType[]) => void;
}

export function TechnicalSettings({
  initialPanels = DEFAULT_PANELS,
  onSave,
}: TechnicalSettingsProps) {
  const [panels, setPanels] = useState<PanelType[]>(initialPanels);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggleActive = (id: string, active: boolean) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave?.(panels);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activeCount = panels.filter((p) => p.active).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Settings</CardTitle>
          <CardDescription>
            Manage solar panel types available for system design
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            {activeCount} of {panels.length} panel types enabled
          </span>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : saved ? <><Check className="h-4 w-4 mr-1" /> Saved</> : <><Save className="h-4 w-4 mr-1" /> Save Changes</>}
          </Button>
        </CardFooter>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map((panel) => (
          <PanelTypeCard
            key={panel.id}
            panel={panel}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
    </div>
  );
}