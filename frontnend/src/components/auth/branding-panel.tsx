"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sun, Zap, Leaf, Building2 } from "lucide-react"

const brandPoints = [
  {
    icon: <Zap size={16} />,
    en: "Build solar quotes in minutes",
    mr: "मिनिटांत सोलार कोटेशन तयार करा",
  },
  {
    icon: <Leaf size={16} />,
    en: "Track ROI & savings instantly",
    mr: "ROI आणि बचत त्वरित ट्रॅक करा",
  },
  {
    icon: <Building2 size={16} />,
    en: "Professional PDF documents",
    mr: "व्यावसायिक PDF दस्तऐवज",
  },
]

export function BrandingPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between w-[45%] min-h-screen p-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0B1E3D 0%, #0F2C55 40%, #133366 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #FFB800 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)" }}
        >
          <Sun size={20} color="white" />
        </div>
        <div>
          <p className="font-bold text-white text-lg" style={{ letterSpacing: "-0.02em" }}>
            Solar Swytch
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            Solar Business Platform
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#FFB800" }}>
            The Smart Solar CRM
          </p>
          <h1 className="text-4xl font-bold mb-3 leading-tight text-white" style={{ letterSpacing: "-0.03em" }}>
            Do not waste
            <br />
            Business time
            <br />
            building quotes
          </h1>
          <p className="text-sm mb-2 italic" style={{ color: "rgba(255,255,255,0.5)" }}>
            व्यवसायाचा वेळ कोटेशन बनवण्यात वाया घालवू नका
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 space-y-4"
        >
          {brandPoints.map((pt, i) => (
            <div key={pt.en} className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(255,184,0,0.15)", color: "#FFB800" }}
              >
                {pt.icon}
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-white">{pt.en}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {pt.mr}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Trust badge */}
      <div className="relative z-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#4ADE80",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>Trusted by 500+ Solar Installers across Maharashtra</span>
        </div>
      </div>
    </div>
  )
}
