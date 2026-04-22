"use client"

import React from "react"
import { motion } from "framer-motion"
import { Briefcase, ShieldCheck, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepRoleProps {
  businessType: string
  businessTypeOther: string
  role: string
  onChange: (field: string, value: string) => void
}

const BUSINESS_TYPES = [
  { value: "installer", label: "Solar Installer / EPC" },
  { value: "dealer", label: "Dealer / Distributor" },
  { value: "consultant", label: "Solar Consultant" },
  { value: "other", label: "Other" },
]

const ROLES = [
  { value: "owner", label: "Business Owner" },
  { value: "sales", label: "Sales Executive" },
]

export function StepRole({ businessType, businessTypeOther, role, onChange }: StepRoleProps) {
  const inputBase = {
    backgroundColor: "white",
    border: "1.5px solid #E2E8F0",
    color: "#0B1E3D",
  }

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22 }}
      className="space-y-5"
    >
      {/* Business Type */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
          Business Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {BUSINESS_TYPES.map((bt) => {
            const isSelected = businessType === bt.value
            return (
              <button
                key={bt.value}
                type="button"
                onClick={() =>
                  onChange(
                    "businessType",
                    bt.value
                  )
                }
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                style={{
                  backgroundColor: isSelected ? "rgba(124,92,252,0.08)" : "white",
                  border: `1.5px solid ${isSelected ? "#7C5CFC" : "#E2E8F0"}`,
                  color: isSelected ? "#5B38E8" : "#374151",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    border: `2px solid ${isSelected ? "#7C5CFC" : "#CBD5E1"}`,
                    backgroundColor: isSelected ? "#7C5CFC" : "transparent",
                  }}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span>{bt.label}</span>
              </button>
            )
          })}
        </div>

        {businessType === "other" && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              Please specify your business type
            </label>
            <input
              type="text"
              value={businessTypeOther}
              onChange={(e) => onChange("businessTypeOther", e.target.value)}
              placeholder="e.g. Solar Finance Advisor, Govt. Agency..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
              style={inputBase}
            />
          </motion.div>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
          Your Role
        </label>
        <div className="relative">
          <Briefcase
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ color: "#94A3B8" }}
          />
          <Select value={role} onValueChange={(v) => v && onChange("role", v)}>
            <SelectTrigger className="w-full pl-11 pr-10 py-3 rounded-xl text-sm" style={inputBase}>
              <SelectValue placeholder="Select your role..." />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ChevronDown
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#94A3B8" }}
          />
        </div>
      </div>

      {/* Confirmation message */}
      {businessType && role && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(124,92,252,0.07)",
            border: "1px solid rgba(124,92,252,0.18)",
          }}
        >
          <ShieldCheck size={15} style={{ color: "#7C5CFC", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "#5B38E8" }}>
            <strong>Looks good!</strong>{" "}
            <span>Your role configuration is saved. Proceed to set up your company profile.</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
