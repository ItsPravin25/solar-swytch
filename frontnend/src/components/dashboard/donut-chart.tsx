"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DonutChartProps {
  approved: number;
  pending: number;
  className?: string;
}

export function DonutChart({ approved, pending, className }: DonutChartProps) {
  const total = approved + pending;
  const approvedPercent = total > 0 ? (approved / total) * 100 : 0;
  const pendingPercent = 100 - approvedPercent;

  const { approvedPath, pendingPath } = useMemo(() => {
    const size = 110;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Approved (green) - starts at top, goes clockwise
    const approvedLength = (approvedPercent / 100) * circumference;
    const approvedGap = circumference - approvedLength;

    // Pending (blue) - continues from approved
    const pendingLength = (pendingPercent / 100) * circumference;
    const pendingGap = circumference - pendingLength;

    return {
      approvedPath: {
        dasharray: `${approvedLength} ${approvedGap}`,
        dashoffset: 0,
        circumference,
      },
      pendingPath: {
        dasharray: `${pendingLength} ${pendingGap}`,
        dashoffset: -approvedLength,
        circumference,
      },
    };
  }, [approvedPercent, pendingPercent]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        <svg width={110} height={110} viewBox="0 0 110 110">
          {/* Background circle */}
          <circle
            cx={55}
            cy={55}
            r={43}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={12}
          />
          {/* Pending (blue) - bottom layer */}
          <circle
            cx={55}
            cy={55}
            r={43}
            fill="none"
            stroke="#1E4DB7"
            strokeWidth={12}
            strokeDasharray={pendingPath.dasharray}
            strokeDashoffset={pendingPath.dashoffset}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
          />
          {/* Approved (green) - top layer */}
          <circle
            cx={55}
            cy={55}
            r={43}
            fill="none"
            stroke="#22C55E"
            strokeWidth={12}
            strokeDasharray={approvedPath.dasharray}
            strokeDashoffset={approvedPath.dashoffset}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{total}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
          <span className="text-xs text-muted-foreground">
            Approved ({approved})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1E4DB7]" />
          <span className="text-xs text-muted-foreground">
            Pending ({pending})
          </span>
        </div>
      </div>
    </div>
  );
}
