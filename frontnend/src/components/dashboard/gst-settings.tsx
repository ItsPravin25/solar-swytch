"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface GstSettingsProps {
  initialPercentage?: number;
  initialIncludeInQuotes?: boolean;
  onSave?: (percentage: number, includeInQuotes: boolean) => void;
}

export function GstSettings({
  initialPercentage = 18,
  initialIncludeInQuotes = true,
  onSave,
}: GstSettingsProps) {
  const [percentage, setPercentage] = useState(initialPercentage);
  const [includeInQuotes, setIncludeInQuotes] = useState(initialIncludeInQuotes);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave?.(percentage, includeInQuotes);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>GST Settings</CardTitle>
        <CardDescription>
          Configure GST percentage and how it applies to quotations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="gst-percentage" className="text-sm font-medium">
            GST Percentage
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="gst-percentage"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={percentage}
              onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
              className="w-32"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="include-gst" className="text-sm font-medium">
            Include GST in quotations
          </label>
          <Toggle
            id="include-gst"
            pressed={includeInQuotes}
            onPressedChange={setIncludeInQuotes}
            aria-label="Toggle GST inclusion"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}