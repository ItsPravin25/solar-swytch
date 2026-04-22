import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solar Swytch - Authentication",
  description: "Login or Register for Solar Swytch",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {children}
    </div>
  )
}
