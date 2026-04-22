"use client"

import React, { useRef } from "react"
import { Camera } from "lucide-react"

interface AvatarUploadProps {
  src?: string
  initials: string
  name: string
  onUpload: (file: File | null, preview: string) => void
}

export function AvatarUpload({ src, initials, name, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(file, ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            background: src
              ? "transparent"
              : "linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)",
          }}
        >
          {src ? (
            <img src={src} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-white">{initials}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            backgroundColor: "#7C5CFC",
            color: "white",
            boxShadow: "0 2px 6px rgba(124,92,252,0.4)",
          }}
          aria-label="Change profile photo"
        >
          <Camera size={11} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          aria-label="Upload profile photo"
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: "#0B1E3D" }}>
          {name || "Solar Owner"}
        </p>
        <p className="text-xs truncate" style={{ color: "#94A3B8" }}>
          Click camera to change photo
        </p>
      </div>
    </div>
  )
}