"use client"

import React from "react"

interface ProfileSectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

export function ProfileSection({ icon, title, children }: ProfileSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(124,92,252,0.10)", color: "#7C5CFC" }}
        >
          {icon}
        </div>
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#7C5CFC", letterSpacing: "0.08em" }}
        >
          {title}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#EDE9FE" }} />
      </div>
      {children}
    </div>
  )
}