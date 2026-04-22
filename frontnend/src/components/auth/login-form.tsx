"use client"

import React from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

interface LoginFormProps {
  email: string
  password: string
  showPassword: boolean
  onChange: (field: string, value: string) => void
  onTogglePassword: () => void
  onSubmit: (e: React.FormEvent) => void
  error?: string
}

export function LoginForm({
  email,
  password,
  showPassword,
  onChange,
  onTogglePassword,
  onSubmit,
  error,
}: LoginFormProps) {
  const inputBase = {
    backgroundColor: "white",
    border: "1.5px solid #E2E8F0",
    color: "#0B1E3D",
  }

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-1" style={{ color: "#0B1E3D", letterSpacing: "-0.03em" }}>
        Welcome back
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        Sign in to your Solar Swytch account
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
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
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputBase}
            />
          </div>
        </div>

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
              placeholder="Enter your password"
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

        {error && (
          <p className="text-xs font-medium" style={{ color: "#EF4444" }}>
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="size-4 rounded border-2" style={{ borderColor: "#E2E8F0" }} />
            <span className="text-xs" style={{ color: "#64748B" }}>
              Remember me
            </span>
          </label>
          <button type="button" className="text-xs font-medium" style={{ color: "#FFB800" }}>
            Forgot password?
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white mt-2"
          style={{
            background: "linear-gradient(135deg, #0B1E3D 0%, #133366 100%)",
            boxShadow: "0 4px 14px rgba(11,30,61,0.3)",
          }}
        >
          <span>Sign In</span>
          <ArrowRight size={15} />
        </motion.button>
      </form>
    </motion.div>
  )
}
