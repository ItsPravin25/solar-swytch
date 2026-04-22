"use client"

import React from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone } from "lucide-react"

interface StepAccountProps {
  fullName: string
  email: string
  phone: string
  onChange: (field: string, value: string) => void
}

export function StepAccount({ fullName, email, phone, onChange }: StepAccountProps) {
  const inputBase = {
    backgroundColor: "white",
    border: "1.5px solid #E2E8F0",
    color: "#0B1E3D",
  }

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
          Full Name
        </label>
        <div className="relative">
          <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            value={fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="Your full name"
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
            style={inputBase}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
          Email Address
        </label>
        <div className="relative">
          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@company.com"
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
            style={inputBase}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
          Phone Number
        </label>
        <div className="relative">
          <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="tel"
            value={phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
            style={inputBase}
          />
        </div>
      </div>
    </motion.div>
  )
}
