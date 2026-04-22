interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  gradient: string;
  icon: React.ReactNode;
}

export function KpiCard({ label, value, sub, gradient, icon }: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col justify-between relative overflow-hidden"
      style={{
        background: gradient,
        minHeight: 110,
      }}
    >
      <div className="flex items-start justify-between mb-2 relative z-10">
        <p className="text-xs font-semibold text-white/80 leading-snug max-w-[72%]">
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
        >
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <p
          className="text-2xl font-bold text-white"
          style={{ letterSpacing: "-0.04em" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5 text-white/60">{sub}</p>
      </div>
    </div>
  );
}
