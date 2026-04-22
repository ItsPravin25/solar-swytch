"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Box, Zap, Maximize2 } from "lucide-react";

export interface PanelType {
  id: string;
  name: string;
  wattageRange: string;
  dimensions: string;
  areaSqFt: number;
  active: boolean;
}

interface PanelTypeCardProps {
  panel: PanelType;
  onToggleActive: (id: string, active: boolean) => void;
}

export function PanelTypeCard({ panel, onToggleActive }: PanelTypeCardProps) {
  return (
    <Card className={panel.active ? "" : "opacity-60"}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{panel.name}</CardTitle>
          <Badge variant={panel.active ? "default" : "outline"}>
            {panel.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>{panel.wattageRange}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Maximize2 className="h-4 w-4" />
            <span>{panel.dimensions}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Box className="h-4 w-4" />
            <span>{panel.areaSqFt} sqft</span>
          </div>
        </div>
        <div className="pt-2 flex items-center justify-between border-t">
          <span className="text-sm text-muted-foreground">Enable</span>
          <Toggle
            pressed={panel.active}
            onPressedChange={(pressed) => onToggleActive(panel.id, pressed)}
            aria-label={`Toggle ${panel.name} active status`}
          />
        </div>
      </CardContent>
    </Card>
  );
}