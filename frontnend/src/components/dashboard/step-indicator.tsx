"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{ label: string; description?: string }>;
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isCurrent = currentStep === stepNumber;
        const isUpcoming = currentStep < stepNumber;

        return (
          <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
            {/* Step badge */}
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                isUpcoming && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{stepNumber}</span>
              )}
            </div>

            {/* Step label */}
            <div className="hidden sm:block">
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  isCurrent && "text-foreground",
                  isCompleted && "text-muted-foreground",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-px transition-colors",
                  currentStep > stepNumber ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}