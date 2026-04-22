"use client"

import React, { useState } from "react"
import { BrandingPanel } from "@/components/auth/branding-panel"
import { LoginForm } from "@/components/auth/login-form"

interface LoginFormState {
  email: string
  password: string
  showPassword: boolean
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    showPassword: false,
  })
  const [error, setError] = useState("")

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleTogglePassword = () => {
    setForm((prev) => ({ ...prev, showPassword: !prev.showPassword }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError("Please enter your email and password.")
      return
    }
    setError("")
    // TODO: Implement actual login
    console.log("Login:", form)
  }

  return (
    <>
      <BrandingPanel />

      <div className="flex-1 flex items-start justify-center min-h-screen p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <LoginForm
            email={form.email}
            password={form.password}
            showPassword={form.showPassword}
            onChange={handleChange}
            onTogglePassword={handleTogglePassword}
            onSubmit={handleSubmit}
            error={error}
          />
        </div>
      </div>
    </>
  )
}
