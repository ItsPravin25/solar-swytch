"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BrandingPanel } from "@/components/auth/branding-panel"
import { OnboardingWizard } from "@/components/auth/onboarding-wizard"
import { LoginForm } from "@/components/auth/login-form"

type AuthMode = "login" | "register"

interface LoginFormState {
  email: string
  password: string
  showPassword: boolean
}

export default function OnboardingPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: "",
    password: "",
    showPassword: false,
  })
  const [loginError, setLoginError] = useState("")

  const handleLoginChange = (field: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLoginTogglePassword = () => {
    setLoginForm((prev) => ({ ...prev, showPassword: !prev.showPassword }))
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Please enter your email and password.")
      return
    }
    setLoginError("")
    // TODO: Implement actual login
    console.log("Login:", loginForm)
  }

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode)
  }

  return (
    <>
      <BrandingPanel />

      <div className="flex-1 flex items-start justify-center min-h-screen p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl mb-8 w-fit" style={{ backgroundColor: "#E2E8F0" }}>
            {(["login", "register"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleSwitchMode(m)}
                className="relative px-5 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
                style={{ color: mode === m ? "#0B1E3D" : "#64748B" }}
              >
                {mode === m && (
                  <motion.div
                    layoutId="modeTab"
                    className="absolute inset-0 rounded-xl bg-white"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{m === "login" ? "Sign In" : "Register"}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <LoginForm
                key="login"
                email={loginForm.email}
                password={loginForm.password}
                showPassword={loginForm.showPassword}
                onChange={handleLoginChange}
                onTogglePassword={handleLoginTogglePassword}
                onSubmit={handleLoginSubmit}
                error={loginError}
              />
            ) : (
              <OnboardingWizard key="register" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
