"use client";

import { useState, useMemo } from "react";
import { Check, Clock, Pencil, Save, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PricingRow {
  id: string;
  capacity: string;
  phase: "single" | "three";
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
  isComplete: boolean;
}

type EditState = {
  id: string;
  panelCost: string;
  inverterCost: string;
  structureCost: string;
  cableCost: string;
  otherCost: string;
} | null;

type FilterType = "all" | "single" | "three";

const initialPricing: PricingRow[] = [
  { id: "r1", capacity: "3kW", phase: "single", panelCost: 72000, inverterCost: 18000, structureCost: 9000, cableCost: 4500, otherCost: 3000, isComplete: true },
  { id: "r2", capacity: "5kW", phase: "single", panelCost: 110000, inverterCost: 28000, structureCost: 14000, cableCost: 6500, otherCost: 4500, isComplete: true },
  { id: "r3", capacity: "5kW", phase: "three", panelCost: 112000, inverterCost: 32000, structureCost: 14000, cableCost: 7000, otherCost: 5000, isComplete: true },
  { id: "r4", capacity: "7kW", phase: "single", panelCost: 145000, inverterCost: 38000, structureCost: 16000, cableCost: 8000, otherCost: 6000, isComplete: false },
  { id: "r5", capacity: "7kW", phase: "three", panelCost: 154000, inverterCost: 42000, structureCost: 18000, cableCost: 9000, otherCost: 6500, isComplete: true },
  { id: "r6", capacity: "10kW", phase: "three", panelCost: 210000, inverterCost: 58000, structureCost: 24000, cableCost: 12000, otherCost: 8000, isComplete: true },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateTotal(row: PricingRow | EditState): number {
  if (!row) return 0;
  return (
    Number(row.panelCost || 0) +
    Number(row.inverterCost || 0) +
    Number(row.structureCost || 0) +
    Number(row.cableCost || 0) +
    Number(row.otherCost || 0)
  );
}

interface PricingRowItemProps {
  row: PricingRow;
  editState: EditState;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
}

function PricingRowItem({
  row,
  editState,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  onChange,
}: PricingRowItemProps) {
  const displayRow = isEditing && editState ? editState : row;
  const total = isEditing ? calculateTotal(editState) : calculateTotal(row);

  return (
    <TableRow
      className={cn(isEditing && "bg-muted/30")}
    >
      <TableCell className="font-medium">{row.capacity}</TableCell>
      <TableCell>
        <Badge variant={row.phase === "single" ? "secondary" : "default"}>
          {row.phase === "single" ? "1-Phase" : "3-Phase"}
        </Badge>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editState?.panelCost || ""}
            onChange={(e) => onChange("panelCost", e.target.value)}
            className="w-28 h-7"
          />
        ) : (
          formatCurrency(row.panelCost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editState?.inverterCost || ""}
            onChange={(e) => onChange("inverterCost", e.target.value)}
            className="w-28 h-7"
          />
        ) : (
          formatCurrency(row.inverterCost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editState?.structureCost || ""}
            onChange={(e) => onChange("structureCost", e.target.value)}
            className="w-28 h-7"
          />
        ) : (
          formatCurrency(row.structureCost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editState?.cableCost || ""}
            onChange={(e) => onChange("cableCost", e.target.value)}
            className="w-28 h-7"
          />
        ) : (
          formatCurrency(row.cableCost)
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editState?.otherCost || ""}
            onChange={(e) => onChange("otherCost", e.target.value)}
            className="w-28 h-7"
          />
        ) : (
          formatCurrency(row.otherCost)
        )}
      </TableCell>
      <TableCell className="font-semibold">{formatCurrency(total)}</TableCell>
      <TableCell>
        <Badge variant={row.isComplete ? "default" : "outline"}>
          {row.isComplete ? (
            <Check className="mr-1 size-3" />
          ) : (
            <Clock className="mr-1 size-3" />
          )}
          {row.isComplete ? "Complete" : "Pending"}
        </Badge>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-1">
            <Button size="icon-xs" variant="ghost" onClick={onSave}>
              <Save className="size-3.5" />
            </Button>
            <Button size="icon-xs" variant="ghost" onClick={onCancel}>
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <Button size="icon-xs" variant="ghost" onClick={onStartEdit}>
            <Pencil className="size-3.5" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

export function PricingTable() {
  const [rows, setRows] = useState<PricingRow[]>(initialPricing);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredRows = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((row) => row.phase === filter);
  }, [rows, filter]);

  const startEdit = (row: PricingRow) => {
    setEditingId(row.id);
    setEditState({
      id: row.id,
      panelCost: String(row.panelCost),
      inverterCost: String(row.inverterCost),
      structureCost: String(row.structureCost),
      cableCost: String(row.cableCost),
      otherCost: String(row.otherCost),
    });
  };

  const handleChange = (field: string, value: string) => {
    if (!editState) return;
    setEditState({ ...editState, [field]: value });
  };

  const saveEdit = () => {
    if (!editingId || !editState) return;
    setRows((prev) =>
      prev.map((row) =>
        row.id === editingId
          ? {
              ...row,
              panelCost: Number(editState.panelCost) || 0,
              inverterCost: Number(editState.inverterCost) || 0,
              structureCost: Number(editState.structureCost) || 0,
              cableCost: Number(editState.cableCost) || 0,
              otherCost: Number(editState.otherCost) || 0,
            }
          : row
      )
    );
    setEditingId(null);
    setEditState(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={filter === "single" ? "default" : "outline"}
          onClick={() => setFilter("single")}
        >
          1-Phase
        </Button>
        <Button
          size="sm"
          variant={filter === "three" ? "default" : "outline"}
          onClick={() => setFilter("three")}
        >
          3-Phase
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Capacity</TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Panel Cost</TableHead>
            <TableHead>Inverter Cost</TableHead>
            <TableHead>Structure Cost</TableHead>
            <TableHead>Cable Cost</TableHead>
            <TableHead>Other Cost</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.map((row) => (
            <PricingRowItem
              key={row.id}
              row={row}
              editState={editingId === row.id ? editState : null}
              isEditing={editingId === row.id}
              onStartEdit={() => startEdit(row)}
              onSave={saveEdit}
              onCancel={cancelEdit}
              onChange={handleChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
