"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Landmark,
  CreditCard,
  FileText,
  Hash,
  Globe,
  Navigation,
  PhoneCall,
  Upload,
  Camera,
} from "lucide-react"
import { ProfileSection } from "./profile-section"

interface UserProfile {
  fullName: string
  email: string
  phone: string
  businessType: string
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
}

interface ProfilePanelProps {
  open: boolean
  profile: UserProfile
  onClose: () => void
  onSave: (profile: UserProfile) => void
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
]

const BUSINESS_TYPES = [
  { value: "installer", label: "Solar Installer / EPC" },
  { value: "dealer", label: "Dealer / Distributor" },
  { value: "consultant", label: "Solar Consultant" },
  { value: "manufacturer", label: "Panel Manufacturer" },
  { value: "other", label: "Other" },
]

const ROLES = [
  { value: "owner", label: "Business Owner" },
  { value: "sales", label: "Sales Executive" },
]

const inputStyle = {
  backgroundColor: "#F8FAFC",
  border: "1.5px solid #E2E8F0",
  color: "#0B1E3D",
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#94A3B8" }}>
      {children}
    </span>
  )
}

export function ProfilePanel({ open, profile, onClose, onSave }: ProfilePanelProps) {
  const [form, setForm] = useState<UserProfile>({ ...profile })
  const [saved, setSaved] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  const setField = (key: keyof UserProfile, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setField("logoPreview", ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = form.fullName
    ? form.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "SO"

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[420px] max-w-full p-0 flex flex-col" side="right">
        {/* Header */}
        <div
          className="flex-shrink-0 px-6 py-5 flex items-center justify-between"
          style={{
            borderBottom: "1px solid #F1F5F9",
            background: "linear-gradient(135deg, #0B1E3D 0%, #133366 100%)",
          }}
        >
          <div>
            <h2 className="text-base font-bold text-white">User Profile</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
              Edit your personal and business details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {/* Avatar */}
          <div className="flex items-center gap-4 py-6">
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: form.logoPreview ? "transparent" : "linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)",
                }}
              >
                {form.logoPreview ? (
                  <img src={form.logoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-white">{initials}</span>
                )}
              </div>
              <button
                onClick={() => photoRef.current?.click()}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  backgroundColor: "#7C5CFC",
                  color: "white",
                  boxShadow: "0 2px 6px rgba(124,92,252,0.4)",
                }}
              >
                <Camera size={11} />
              </button>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: "#0B1E3D" }}>
                {form.fullName || "Solar Owner"}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: "#7C5CFC" }}>
                {ROLES.find((r) => r.value === form.role)?.label || "Business Owner"}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: "#94A3B8" }}>
                {form.email}
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <ProfileSection icon={<User size={12} />} title="Personal Info">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Full Name</label>
                <div className="relative">
                  <FieldIcon><User size={13} /></FieldIcon>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    placeholder="Your full name"
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Email</label>
                <div className="relative">
                  <FieldIcon><Mail size={13} /></FieldIcon>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="you@company.com"
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Phone</label>
                <div className="relative">
                  <FieldIcon><Phone size={13} /></FieldIcon>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Business Type</label>
                  <Select value={form.businessType} onValueChange={(v) => v && setField("businessType", v)}>
                    <SelectTrigger className="w-full" style={inputStyle}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((bt) => (
                        <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Role</label>
                  <Select value={form.role} onValueChange={(v) => v && setField("role", v)}>
                    <SelectTrigger className="w-full" style={inputStyle}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Company Info */}
          <ProfileSection icon={<Building2 size={12} />} title="Company Info">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Company Name</label>
                <div className="relative">
                  <FieldIcon><Building2 size={13} /></FieldIcon>
                  <Input
                    value={form.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    placeholder="Solar Swytch Pvt. Ltd."
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>GST Number</label>
                <div className="relative">
                  <FieldIcon><Hash size={13} /></FieldIcon>
                  <Input
                    value={form.gstNumber}
                    onChange={(e) => setField("gstNumber", e.target.value.toUpperCase())}
                    placeholder="27ABCDE1234F1Z5"
                    maxLength={15}
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Company Logo</label>
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: form.logoPreview ? "rgba(124,92,252,0.06)" : "#F8FAFC",
                    border: `1.5px dashed ${form.logoPreview ? "#7C5CFC" : "#CBD5E1"}`,
                    color: "#64748B",
                  }}
                >
                  {form.logoPreview ? (
                    <img src={form.logoPreview} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EDE9FE", color: "#7C5CFC" }}>
                      <Upload size={14} />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-semibold" style={{ color: "#374151" }}>
                      {form.logoPreview ? "Change photo" : "Upload company logo"}
                    </p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>JPG or PNG - Max 2 MB</p>
                  </div>
                </button>
              </div>
            </div>
          </ProfileSection>

          {/* Location */}
          <ProfileSection icon={<MapPin size={12} />} title="Location">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Business Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 pointer-events-none" style={{ color: "#94A3B8" }}>
                    <Navigation size={13} />
                  </span>
                  <Textarea
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Shop No. 12, Solar Complex, MG Road"
                    rows={2}
                    className="pl-10 resize-none"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>State</label>
                  <Select value={form.state} onValueChange={(v) => v && setField("state", v)}>
                    <SelectTrigger className="w-full" style={inputStyle}>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>City</label>
                  <div className="relative">
                    <FieldIcon><MapPin size={13} /></FieldIcon>
                    <Input
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="Pune"
                      className="pl-10"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Pincode</label>
                <Input
                  value={form.pincode}
                  onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="411001"
                  maxLength={6}
                  style={inputStyle}
                />
              </div>
            </div>
          </ProfileSection>

          {/* Contact */}
          <ProfileSection icon={<PhoneCall size={12} />} title="Contact Numbers">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Primary</label>
                <div className="relative">
                  <FieldIcon><Phone size={13} /></FieldIcon>
                  <Input
                    type="tel"
                    value={form.primaryContact}
                    onChange={(e) => setField("primaryContact", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Alternate</label>
                <div className="relative">
                  <FieldIcon><Phone size={13} /></FieldIcon>
                  <Input
                    type="tel"
                    value={form.alternateContact}
                    onChange={(e) => setField("alternateContact", e.target.value)}
                    placeholder="+91 80000 12345"
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Bank Details */}
          <ProfileSection icon={<Landmark size={12} />} title="Bank Details">
            <div className="space-y-3 pb-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Bank Name</label>
                <div className="relative">
                  <FieldIcon><Landmark size={13} /></FieldIcon>
                  <Input
                    value={form.bankName}
                    onChange={(e) => setField("bankName", e.target.value)}
                    placeholder="HDFC Bank"
                    className="pl-10"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Account Number</label>
                  <div className="relative">
                    <FieldIcon><CreditCard size={13} /></FieldIcon>
                    <Input
                      value={form.accountNumber}
                      onChange={(e) => setField("accountNumber", e.target.value.replace(/\D/g, ""))}
                      placeholder="12345678901234"
                      className="pl-10"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>IFSC Code</label>
                  <div className="relative">
                    <FieldIcon><FileText size={13} /></FieldIcon>
                    <Input
                      value={form.ifscCode}
                      onChange={(e) => setField("ifscCode", e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      maxLength={11}
                      className="pl-10"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ProfileSection>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4" style={{ borderTop: "1px solid #F1F5F9" }}>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3"
                style={{ background: "rgba(39,174,96,0.09)", border: "1px solid rgba(39,174,96,0.25)" }}
              >
                <Check size={13} style={{ color: "#27AE60" }} />
                <p className="text-xs font-semibold" style={{ color: "#15803D" }}>Profile saved successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              style={{
                background: saved
                  ? "linear-gradient(135deg, #27AE60 0%, #1A8A48 100%)"
                  : "linear-gradient(135deg, #0B1E3D 0%, #133366 100%)",
              }}
            >
              {saved && <Check size={15} className="mr-2" />}
              <span>{saved ? "Saved!" : "Save Profile"}</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}