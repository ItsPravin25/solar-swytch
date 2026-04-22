"use client"

import React from "react"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface StepSecurityProps {
  password: string
  confirmPassword: string
  showPassword: boolean
  onChange: (field: string, value: string) => void
  onTogglePassword: () => void
}

export function StepSecurity({
  password,
  confirmPassword,
  showPassword,
  onChange,
  onTogglePassword,
}: StepSecurityProps) {
  const inputBase = {
    backgroundColor: "white",
    border: "1.5px solid #E2E8F0",
    color: "#0B1E3D",
  }

  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const passwordsDoNotMatch = password && confirmPassword && password !== confirmPassword

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      {/* Password */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
          Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="Create a strong password"
            className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none"
            style={inputBase}
          />
          <button type="button" onClick={onTogglePassword} className="absolute right-4 top-1/2 -translate-y-1/2">
            {showPassword ? (
              <EyeOff size={15} style={{ color: "#94A3B8" }} />
            ) : (
              <Eye size={15} style={{ color: "#94A3B8" }} />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            placeholder="Confirm your password"
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
            style={inputBase}
          />
        </div>
      </div>

      {/* Password Match Indicator */}
      {password && confirmPassword && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
          style={
            passwordsMatch
              ? { background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }
              : { background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }
          }
        >
          {passwordsMatch ? (
            <Check size={13} style={{ color: "#22C55E", flexShrink: 0 }} />
          ) : (
            <span className="text-xs" style={{ color: "#EF4444", flexShrink: 0 }}>
              ✕
            </span>
          )}
          <p
            className="text-xs"
            style={{ color: passwordsMatch ? "#15803D" : "#EF4444" }}
          >
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        </motion.div>
      )}

      {/* Terms */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.2)",
        }}
      >
        <Check size={14} style={{ color: "#22C55E", flexShrink: 0 }} />
        <p className="text-xs" style={{ color: "#64748B" }}>
          By registering you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </motion.div>
  )
}
