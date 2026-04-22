"use client"

import React, { useRef } from "react"
import { motion } from "framer-motion"
import {
  Building2,
  MapPin,
  PhoneCall,
  Landmark,
  Hash,
  Upload,
  Globe,
  Navigation,
  CreditCard,
  FileText,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepProfileProps {
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
  onChange: (field: string, value: string) => void
  onLogoChange: (file: File | null, preview: string) => void
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
]

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(124,92,252,0.10)", color: "#7C5CFC" }}
      >
        {icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7C5CFC", letterSpacing: "0.08em" }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: "#EDE9FE" }} />
    </div>
  )
}

export function StepProfile({
  companyName,
  gstNumber,
  logoPreview,
  address,
  state,
  city,
  pincode,
  primaryContact,
  alternateContact,
  bankName,
  accountNumber,
  ifscCode,
  onChange,
  onLogoChange,
}: StepProfileProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)
  const inputBase = {
    backgroundColor: "white",
    border: "1.5px solid #E2E8F0",
    color: "#0B1E3D",
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onLogoChange(file, ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22 }}
    >
      <SectionHeading icon={<Building2 size={13} />} title="Company Info" />
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
            Company Name
          </label>
          <div className="relative">
            <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input
              type="text"
              value={companyName}
              onChange={(e) => onChange("companyName", e.target.value)}
              placeholder="Solar Swytch Pvt. Ltd."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputBase}
            />
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              GST Number
            </label>
            <div className="relative">
              <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => onChange("gstNumber", e.target.value.toUpperCase())}
                placeholder="27ABCDE1234F1Z5"
                maxLength={15}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={inputBase}
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              Logo
            </label>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" aria-label="Upload company logo" />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: logoPreview ? "rgba(124,92,252,0.08)" : "#F8FAFC",
                border: `1.5px solid ${logoPreview ? "#7C5CFC" : "#E2E8F0"}`,
                color: logoPreview ? "#5B38E8" : "#64748B",
              }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Company logo preview" className="w-5 h-5 rounded object-cover" />
              ) : (
                <Upload size={13} />
              )}
              <span>{logoPreview ? "Change" : "Upload"}</span>
            </button>
          </div>
        </div>
      </div>

      <SectionHeading icon={<MapPin size={13} />} title="Location" />
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
            Business Address
          </label>
          <div className="relative">
            <Navigation size={14} className="absolute left-3.5 top-3 pointer-events-none" style={{ color: "#94A3B8" }} />
            <Textarea
              value={address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Shop No. 12, Solar Complex, MG Road"
              rows={2}
              className="w-full pl-10 pr-4 py-2.5 text-sm resize-none"
              style={inputBase}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              State
            </label>
            <Select value={state} onValueChange={(v) => v && onChange("state", v)}>
              <SelectTrigger className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm" style={inputBase}>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              City
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
              <input
                type="text"
                value={city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="Pune"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputBase}
              />
            </div>
          </div>
        </div>

        <div className="w-1/2 pr-1.5">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
            Pincode
          </label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="411001"
            maxLength={6}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
            style={inputBase}
          />
        </div>
      </div>

      <SectionHeading icon={<PhoneCall size={13} />} title="Contact" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
            Primary Contact
          </label>
          <div className="relative">
            <PhoneCall size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input
              type="tel"
              value={primaryContact}
              onChange={(e) => onChange("primaryContact", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none"
              style={inputBase}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
            Alternate Contact
          </label>
          <div className="relative">
            <PhoneCall size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input
              type="tel"
              value={alternateContact}
              onChange={(e) => onChange("alternateContact", e.target.value)}
              placeholder="+91 80000 12345"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none"
              style={inputBase}
            />
          </div>
        </div>
      </div>

      <SectionHeading icon={<Landmark size={13} />} title="Bank Details" />
      <div className="space-y-3 pb-1">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
            Bank Name
          </label>
          <div className="relative">
            <Landmark size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input
              type="text"
              value={bankName}
              onChange={(e) => onChange("bankName", e.target.value)}
              placeholder="HDFC Bank"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputBase}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              Account Number
            </label>
            <div className="relative">
              <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => onChange("accountNumber", e.target.value.replace(/\D/g, ""))}
                placeholder="12345678901234"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputBase}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              IFSC Code
            </label>
            <div className="relative">
              <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => onChange("ifscCode", e.target.value.toUpperCase())}
                placeholder="HDFC0001234"
                maxLength={11}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputBase}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
