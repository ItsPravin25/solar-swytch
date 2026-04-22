"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, ChevronRight, ArrowRight, Check, ArrowLeft } from "lucide-react"
import { StepAccount } from "./step-account"
import { StepRole } from "./step-role"
import { StepProfile } from "./step-profile"
import { StepSecurity } from "./step-security"

type RegisterStep = 1 | 2 | 3 | 4

interface RegisterForm {
  fullName: string
  email: string
  phone: string
  businessType: string
  businessTypeOther: string
  role: string
  companyName: string
  gstNumber: string
  logoPreview: string
  address: string
  state: string
  city: string
  pincode: string
  primaryContact: string
  alternateContact: string
  bankName: string
  accountNumber: string
  ifscCode: string
  password: string
  confirmPassword: string
  showPassword: boolean
}

const STEP_LABELS = [
  { label: "Account", short: "1" },
  { label: "Role", short: "2" },
  { label: "Profile", short: "3" },
  { label: "Security", short: "4" },
]

const STEP_TITLES = {
  1: "Create account",
  2: "Business role",
  3: "Company profile",
  4: "Set password",
}

const STEP_DESCRIPTIONS = {
  1: 'Join Solar Swytch — आपला सोलार व्यवसाय सुरू करा',
  2: "Tell us about your business and role",
  3: "Fill in your company details to get started",
  4: "Almost done — secure your account",
}

const TOTAL_STEPS = 4

const emptyForm: RegisterForm = {
  fullName: "",
  email: "",
  phone: "",
  businessType: "",
  businessTypeOther: "",
  role: "",
  companyName: "",
  gstNumber: "",
  logoPreview: "",
  address: "",
  state: "",
  city: "",
  pincode: "",
  primaryContact: "",
  alternateContact: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
}

interface OnboardingWizardProps {
  onComplete?: (form: RegisterForm) => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<RegisterStep>(1)
  const [form, setForm] = useState<RegisterForm>(emptyForm)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = (file: File | null, preview: string) => {
    setForm((prev) => ({ ...prev, logoPreview: preview }))
  }

  const handleTogglePassword = () => {
    setForm((prev) => ({ ...prev, showPassword: !prev.showPassword }))
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => (s + 1) as RegisterStep)
    } else {
      onComplete?.(form)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as RegisterStep)
    }
  }

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)" }}
        >
          <Sun size={16} color="white" />
        </div>
        <p className="font-bold text-lg" style={{ color: "#0B1E3D" }}>
          Solar Swytch
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-0.5" style={{ color: "#0B1E3D", letterSpacing: "-0.03em" }}>
        {STEP_TITLES[step]}
      </h2>
      <p className="text-sm mb-5" style={{ color: "#64748B" }}>
        {STEP_DESCRIPTIONS[step]}
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-1.5 mb-6">
        {STEP_LABELS.map((item, i) => {
          const stepNum = (i + 1) as RegisterStep
          const isActive = step === stepNum
          const isDone = step > stepNum
          return (
            <React.Fragment key={item.label}>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    backgroundColor: isDone ? "#22C55E" : isActive ? "#7C5CFC" : "#E2E8F0",
                    color: isDone || isActive ? "white" : "#94A3B8",
                  }}
                >
                  {isDone ? <Check size={11} /> : stepNum}
                </div>
                <span
                  className="text-xs font-medium hidden sm:block"
                  style={{ color: isActive ? "#7C5CFC" : isDone ? "#22C55E" : "#94A3B8" }}
                >
                  {item.label}
                </span>
              </div>
              {i < TOTAL_STEPS - 1 && (
                <div
                  className="flex-1 h-px transition-colors"
                  style={{ backgroundColor: step > stepNum ? "#22C55E" : "#E2E8F0" }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepAccount
            key="step1"
            fullName={form.fullName}
            email={form.email}
            phone={form.phone}
            onChange={handleChange}
          />
        )}
        {step === 2 && (
          <StepRole
            key="step2"
            businessType={form.businessType}
            businessTypeOther={form.businessTypeOther}
            role={form.role}
            onChange={handleChange}
          />
        )}
        {step === 3 && (
          <StepProfile
            key="step3"
            companyName={form.companyName}
            gstNumber={form.gstNumber}
            logoPreview={form.logoPreview}
            address={form.address}
            state={form.state}
            city={form.city}
            pincode={form.pincode}
            primaryContact={form.primaryContact}
            alternateContact={form.alternateContact}
            bankName={form.bankName}
            accountNumber={form.accountNumber}
            ifscCode={form.ifscCode}
            onChange={handleChange}
            onLogoChange={handleLogoChange}
          />
        )}
        {step === 4 && (
          <StepSecurity
            key="step4"
            password={form.password}
            confirmPassword={form.confirmPassword}
            showPassword={form.showPassword}
            onChange={handleChange}
            onTogglePassword={handleTogglePassword}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-7">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-none px-5 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#E2E8F0", color: "#64748B" }}
          >
            <ArrowLeft size={15} className="inline mr-1" />
            Back
          </button>
        )}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)",
            boxShadow: "0 4px 14px rgba(124,92,252,0.28)",
          }}
        >
          {step < TOTAL_STEPS ? (
            <>
              <span>Next</span>
              <ChevronRight size={15} />
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={15} />
            </>
          )}
        </motion.button>
      </div>

      <p className="text-center text-xs mt-4" style={{ color: "#CBD5E1" }}>
        Step {step} of {TOTAL_STEPS}
      </p>
    </motion.div>
  )
}
