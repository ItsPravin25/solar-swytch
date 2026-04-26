import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Package, Upload, Plus, Trash2, Edit3, Save, X, Check, LogOut, Bell, Menu, CreditCard, ReceiptText, Percent, RefreshCw, Eye, CheckSquare, ClipboardList, LayoutDashboard, FilePlus, Settings, Download, ChevronDown, ArrowLeft, Image, Zap, AlertTriangle, FileText, Layers, AlertCircle, SquarePen, Printer, TrendingUp, Banknote, BarChart3, Calculator, ChevronRight, Star, Info, Leaf, MapPin, Filter, Loader2 } from 'lucide-react';
import { UserProfilePanel } from './UserProfilePanel';
import { UserProfile } from './SolarSwytch';
import { BillUpload } from '../BillUpload';
import { quotationsApi, pricingApi } from '../../lib/api';
import { mapQuotationFromBackend, mapPricingFromBackend } from '../../lib/data-mapper';
import { BoqDrawer } from '../boq/BoqDrawer';

// ─── Types ─────────────────────────────────────────────────────────────────────

type NavSection = 'dashboard' | 'createQuotation' | 'pricing' | 'otherExpenses' | 'gst' | 'payment' | 'technical';
type PhaseType = 'single' | 'three';
type QuotationStep = 1 | 2 | 3;
type SystemType = 'on-grid' | 'off-grid' | 'hybrid';
type PanelTypeId = 'mono-standard' | 'mono-large' | 'topcon';
type PhaseOption = '1-Phase' | '3-Phase';
type UploadStatus = 'pending' | 'complete';
type DownloadDocType = 'business' | 'customer' | null;
type DashboardFilter = 'all' | 'approved' | 'pending';
interface PricingRow {
  id: string;
  capacity: string;
  phase: PhaseType;
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
}
interface QuotationDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  location: string;
  consumerNo: string;
  sanctionLoad: string;
  siteType: string;
  billingType: string;
  avgMonthlyUnits: number;
  suggestedCapacity: string;
  systemCapacity: string;
  systemType: SystemType;
  panelType: string;
  roofType: string;
  areaLength: string;
  areaWidth: string;
  buildingHeight: string;
  numPanels: number;
  availableArea: string;
  systemArea: string;
  shortfall: string;
  uploadedBill: string | null;
  dateTime: string;
  amount: string;
  approved: boolean;
}
interface PricingSetupRow {
  kw: number;
  phase: PhaseOption;
}
interface StatusEntry {
  status: UploadStatus;
}
interface PricingStatusRow {
  kw: number;
  single: StatusEntry | null;
  threePhase: StatusEntry | null;
}
interface MonthlyUnit {
  id: string;
  label: string;
}
interface PanelTypeRow {
  id: PanelTypeId;
  name: string;
  wattageRange: string;
  wattage: number;
  dimensions: string;
  areaSqFt: number;
}
interface DashboardProps {
  onLogout: () => void;
  userProfile: UserProfile;
  onProfileUpdate: (p: UserProfile) => void;
}
interface ExpenseItem {
  key: string;
  label: string;
  isDefault: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

// Sanction Load options with phase constraints
// 1-4kW: 1-phase only, 5-8kW: both, 9-10kW: 3-phase only
const SANCTION_LOAD_OPTIONS_ALL = [{
  value: '1',
  label: '1 kW',
  phases: ['1-Phase']
}, {
  value: '2',
  label: '2 kW',
  phases: ['1-Phase']
}, {
  value: '3',
  label: '3 kW',
  phases: ['1-Phase']
}, {
  value: '4',
  label: '4 kW',
  phases: ['1-Phase']
}, {
  value: '5',
  label: '5 kW',
  phases: ['1-Phase', '3-Phase']
}, {
  value: '6',
  label: '6 kW',
  phases: ['1-Phase', '3-Phase']
}, {
  value: '7',
  label: '7 kW',
  phases: ['1-Phase', '3-Phase']
}, {
  value: '8',
  label: '8 kW',
  phases: ['1-Phase', '3-Phase']
}, {
  value: '9',
  label: '9 kW',
  phases: ['3-Phase']
}, {
  value: '10',
  label: '10 kW',
  phases: ['3-Phase']
}];
const CAPACITY_OPTIONS = [{
  value: '',
  label: 'Select Capacity'
}, {
  value: '1kW',
  label: '1 kW'
}, {
  value: '2kW',
  label: '2 kW'
}, {
  value: '3kW',
  label: '3 kW'
}, {
  value: '4kW',
  label: '4 kW'
}, {
  value: '5kW',
  label: '5 kW'
}, {
  value: '6kW',
  label: '6 kW'
}, {
  value: '7kW',
  label: '7 kW'
}, {
  value: '8kW',
  label: '8 kW'
}, {
  value: '9kW',
  label: '9 kW'
}, {
  value: '10kW',
  label: '10 kW'
}];
const PRICING_CAPACITY_OPTIONS = ['1kW', '2kW', '3kW', '4kW', '5kW', '6kW', '7kW', '8kW', '9kW', '10kW'];
const BILLING_MONTHS: MonthlyUnit[] = [{
  id: 'jan',
  label: 'Jan'
}, {
  id: 'feb',
  label: 'Feb'
}, {
  id: 'mar',
  label: 'Mar'
}, {
  id: 'apr',
  label: 'Apr'
}, {
  id: 'may',
  label: 'May'
}, {
  id: 'jun',
  label: 'Jun'
}, {
  id: 'jul',
  label: 'Jul'
}, {
  id: 'aug',
  label: 'Aug'
}, {
  id: 'sep',
  label: 'Sep'
}, {
  id: 'oct',
  label: 'Oct'
}, {
  id: 'nov',
  label: 'Nov'
}, {
  id: 'dec',
  label: 'Dec'
}];
const SITE_TYPES = [
  { value: 'residential', label: 'Residential', code: 'LT-I' },
  { value: 'commercial', label: 'Commercial', code: 'LT-II' },
  { value: 'industrial', label: 'Industrial', code: 'LT-III' },
  { value: 'agriculture', label: 'Agriculture', code: 'LT-IV' },
  { value: 'streetlight', label: 'Street Light', code: 'LT-V' },
  { value: 'public', label: 'Public/Institutional', code: 'LT-VI' },
  { value: 'temporary', label: 'Temporary', code: 'LT-Temp' },
  { value: 'ev', label: 'EV Charging', code: 'LT-EV' },
  { value: 'ht', label: 'High Tension', code: 'HT' },
];
const SITE_BILLING_MAP: Record<string, Array<{code: string, label: string, phase: string}>> = {
  residential: [
    { code: 'LT-I(A)', label: 'Residential – Single Phase', phase: '1-Phase' },
    { code: 'LT-I(B)', label: 'Residential – Three Phase', phase: '3-Phase' },
    { code: 'LT-I(C)', label: 'Residential (Common Services)', phase: '1/3-Phase' },
  ],
  commercial: [
    { code: 'LT-II(A)', label: 'Commercial – Small', phase: '1/3-Phase' },
    { code: 'LT-II(B)', label: 'Commercial – Large', phase: '3-Phase' },
  ],
  industrial: [
    { code: 'LT-III(A)', label: 'Small Industry', phase: '3-Phase' },
    { code: 'LT-III(B)', label: 'Medium Industry', phase: '3-Phase' },
    { code: 'HT', label: 'Large Industry (HT)', phase: '11kV+' },
  ],
  agriculture: [
    { code: 'LT-IV(A)', label: 'Agriculture Pump', phase: '1/3-Phase' },
    { code: 'LT-IV(B)', label: 'Lift Irrigation', phase: '3-Phase' },
  ],
  streetlight: [{ code: 'LT-V', label: 'Street Light', phase: '1/3-Phase' }],
  public: [{ code: 'LT-VI', label: 'Public Services', phase: '1/3-Phase' }],
  temporary: [{ code: 'LT-Temp', label: 'Temporary Connection', phase: '1/3-Phase' }],
  ev: [{ code: 'LT-EV', label: 'EV Charging Stations', phase: '1/3-Phase' }],
  ht: [
    { code: 'HT-I', label: 'Industry', phase: '11kV+' },
    { code: 'HT-II', label: 'Commercial', phase: '11kV+' },
    { code: 'HT-III', label: 'Railways/Metro', phase: '25kV' },
  ],
};
const SYSTEM_TYPES: {
  value: SystemType;
  label: string;
}[] = [{
  value: 'on-grid',
  label: 'On-Grid'
}, {
  value: 'off-grid',
  label: 'Off-Grid'
}, {
  value: 'hybrid',
  label: 'Hybrid'
}];
const PANEL_ROWS: PanelTypeRow[] = [{
  id: 'mono-standard',
  name: 'Monocrystalline (Standard)',
  wattageRange: '300W – 400W',
  wattage: 550,
  dimensions: '~1.65m × 1.0m',
  areaSqFt: 17.8
}, {
  id: 'mono-large',
  name: 'Monocrystalline (Large)',
  wattageRange: '450W – 600W+',
  wattage: 550,
  dimensions: '~2.0m × 1.1m',
  areaSqFt: 23.7
}, {
  id: 'topcon',
  name: 'TOPCon (N-Type)',
  wattageRange: '550W – 630W+',
  wattage: 580,
  dimensions: '~2.27m × 1.13m',
  areaSqFt: 27.6
}];
const ROOF_OPTIONS = [{
  value: '',
  label: 'Select Roof Type'
}, {
  value: 'RCC',
  label: 'RCC'
}, {
  value: 'Sheet',
  label: 'Sheet'
}, {
  value: 'Ground',
  label: 'Ground'
}];
const INITIAL_EXPENSE_ITEMS: ExpenseItem[] = [{
  key: 'installation',
  label: 'Installation Team Charges',
  isDefault: true
}, {
  key: 'transport',
  label: 'Material Transport Charges',
  isDefault: true
}, {
  key: 'liaison',
  label: 'Liaison Charges',
  isDefault: false
}, {
  key: 'structureInstall',
  label: 'Structure Installation Cost',
  isDefault: true
}, {
  key: 'other',
  label: 'Other Expenses',
  isDefault: false
}];
const LOAN_FIELDS = [{
  key: 'amount',
  label: 'Loan Amount',
  readonly: false
}, {
  key: 'interest',
  label: 'Percentage Interest (%)',
  readonly: false
}, {
  key: 'term',
  label: 'Term (Years)',
  readonly: false
}, {
  key: 'payable',
  label: 'Total Payable to Bank',
  readonly: true
}, {
  key: 'emi',
  label: 'EMI (per month)',
  readonly: true
}];
const PRICING_SETUP_ROWS: PricingSetupRow[] = [{
  kw: 1,
  phase: '1-Phase'
}, {
  kw: 2,
  phase: '1-Phase'
}, {
  kw: 3,
  phase: '1-Phase'
}, {
  kw: 4,
  phase: '1-Phase'
}, {
  kw: 5,
  phase: '1-Phase'
}, {
  kw: 6,
  phase: '1-Phase'
}, {
  kw: 7,
  phase: '1-Phase'
}, {
  kw: 8,
  phase: '3-Phase'
}, {
  kw: 9,
  phase: '3-Phase'
}, {
  kw: 10,
  phase: '3-Phase'
}];
const INITIAL_STATUS_ROWS: PricingStatusRow[] = [{
  kw: 1,
  single: {
    status: 'pending'
  },
  threePhase: null
}, {
  kw: 2,
  single: {
    status: 'pending'
  },
  threePhase: null
}, {
  kw: 3,
  single: {
    status: 'complete'
  },
  threePhase: {
    status: 'pending'
  }
}, {
  kw: 4,
  single: {
    status: 'pending'
  },
  threePhase: {
    status: 'pending'
  }
}, {
  kw: 5,
  single: {
    status: 'pending'
  },
  threePhase: {
    status: 'pending'
  }
}, {
  kw: 6,
  single: {
    status: 'pending'
  },
  threePhase: {
    status: 'pending'
  }
}, {
  kw: 7,
  single: {
    status: 'pending'
  },
  threePhase: {
    status: 'pending'
  }
}, {
  kw: 8,
  single: null,
  threePhase: {
    status: 'pending'
  }
}, {
  kw: 9,
  single: null,
  threePhase: {
    status: 'pending'
  }
}, {
  kw: 10,
  single: null,
  threePhase: {
    status: 'pending'
  }
}];
const initialPricing: PricingRow[] = [{
  id: 'r1',
  capacity: '3kW',
  phase: 'single',
  panelCost: 72000,
  inverterCost: 18000,
  structureCost: 9000,
  cableCost: 4500,
  otherCost: 3000
}, {
  id: 'r2',
  capacity: '5kW',
  phase: 'single',
  panelCost: 110000,
  inverterCost: 28000,
  structureCost: 14000,
  cableCost: 6500,
  otherCost: 4500
}, {
  id: 'r3',
  capacity: '5kW',
  phase: 'three',
  panelCost: 112000,
  inverterCost: 32000,
  structureCost: 14000,
  cableCost: 7000,
  otherCost: 5000
}, {
  id: 'r4',
  capacity: '7kW',
  phase: 'three',
  panelCost: 154000,
  inverterCost: 42000,
  structureCost: 18000,
  cableCost: 9000,
  otherCost: 6500
}, {
  id: 'r5',
  capacity: '10kW',
  phase: 'three',
  panelCost: 210000,
  inverterCost: 58000,
  structureCost: 24000,
  cableCost: 12000,
  otherCost: 8000
}];
const now = new Date();
const fmtDT = (d: Date) => d.toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
}) + ', ' + d.toLocaleTimeString('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});
const sampleQuotations: QuotationDetail[] = [{
  id: 'q1',
  firstName: 'Rajesh',
  lastName: 'Patil',
  phone: '+91 98765 43210',
  address: 'Plot 12, Shivaji Nagar, Pune',
  location: 'Pune, Maharashtra',
  consumerNo: 'MH042300123456',
  sanctionLoad: '3',
  siteType: 'residential',
  billingType: 'Res 1-Phase',
  avgMonthlyUnits: 450,
  suggestedCapacity: '3.3',
  systemCapacity: '5kW',
  systemType: 'on-grid',
  panelType: 'Monocrystalline (Standard)',
  roofType: 'RCC',
  areaLength: '25',
  areaWidth: '20',
  buildingHeight: '15',
  numPanels: 9,
  availableArea: '500',
  systemArea: '160',
  shortfall: '0',
  uploadedBill: null,
  dateTime: fmtDT(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
  amount: '₹2,10,000',
  approved: false
}, {
  id: 'q2',
  firstName: 'Sneha',
  lastName: 'Kulkarni',
  phone: '+91 88765 43210',
  address: 'Flat 4B, Harmony Apartments, Nashik',
  location: 'Nashik, Maharashtra',
  consumerNo: 'MH033100456789',
  sanctionLoad: '5',
  siteType: 'residential',
  billingType: 'Res 3-Phase',
  avgMonthlyUnits: 320,
  suggestedCapacity: '2.4',
  systemCapacity: '3.5kW',
  systemType: 'on-grid',
  panelType: 'Monocrystalline (Large)',
  roofType: 'Sheet',
  areaLength: '20',
  areaWidth: '18',
  buildingHeight: '10',
  numPanels: 7,
  availableArea: '360',
  systemArea: '125',
  shortfall: '0',
  uploadedBill: null,
  dateTime: fmtDT(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)),
  amount: '₹1,54,000',
  approved: true
}, {
  id: 'q3',
  firstName: 'Mohan',
  lastName: 'Desai',
  phone: '+91 77765 43210',
  address: 'Gala No. 5, Industrial Estate, Aurangabad',
  location: 'Aurangabad, Maharashtra',
  consumerNo: 'MH021900789123',
  sanctionLoad: '5',
  siteType: 'commercial',
  billingType: 'Com 3-Phase',
  avgMonthlyUnits: 780,
  suggestedCapacity: '5.8',
  systemCapacity: '7kW',
  systemType: 'hybrid',
  panelType: 'TOPCon (N-Type)',
  roofType: 'RCC',
  areaLength: '30',
  areaWidth: '25',
  buildingHeight: '20',
  numPanels: 13,
  availableArea: '750',
  systemArea: '359',
  shortfall: '0',
  uploadedBill: null,
  dateTime: fmtDT(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)),
  amount: '₹3,12,500',
  approved: false
}];
const navItems: {
  id: NavSection;
  icon: React.ReactNode;
  label: string;
}[] = [{
  id: 'dashboard',
  icon: <LayoutDashboard size={16} />,
  label: 'Dashboard'
}, {
  id: 'createQuotation',
  icon: <FilePlus size={16} />,
  label: 'New Quotation'
}, {
  id: 'pricing',
  icon: <Package size={16} />,
  label: 'Pricing Setup'
}, {
  id: 'otherExpenses',
  icon: <ReceiptText size={16} />,
  label: 'Other Expenses'
}, {
  id: 'gst',
  icon: <Percent size={16} />,
  label: 'GST Settings'
}, {
  id: 'payment',
  icon: <CreditCard size={16} />,
  label: 'Payment Settings'
}, {
  id: 'technical',
  icon: <Settings size={16} />,
  label: 'Technical Settings'
}];
const formatINR = (n: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(n);
const fmtINR = (n: number) => '₹' + n.toLocaleString('en-IN');

// CO2 savings: E_saved = P * H * PR * 365 * EF_grid
// P = capacity kW, H = 4.5, PR = 0.75, EF = 0.71 kg CO2/kWh
const calcCO2Saved = (capacityKw: number) => {
  const annualKwh = capacityKw * 4.5 * 0.75 * 365;
  return (annualKwh * 0.71 / 1000).toFixed(2); // tonnes CO2/year
};

// ─── Donut Chart Component ──────────────────────────────────────────────────────

const DonutChart: React.FC<{
  total: number;
  approved: number;
}> = ({
  total,
  approved
}) => {
  const pending = total - approved;
  const size = 110;
  const cx = size / 2;
  const cy = size / 2;
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const approvedPct = total > 0 ? approved / total : 0;
  const pendingPct = total > 0 ? pending / total : 1;
  const approvedDash = approvedPct * circumference;
  const pendingDash = pendingPct * circumference;
  const gapDash = total > 0 ? 2 : 0;
  return <div className="flex items-center gap-5">
      <div style={{
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8EDF5" strokeWidth={14} />
          {total > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22C55E" strokeWidth={14} strokeDasharray={`${approvedDash - gapDash} ${circumference - approvedDash + gapDash}`} strokeDashoffset={circumference / 4} strokeLinecap="round" style={{
          transition: 'stroke-dasharray 0.6s ease'
        }} />}
          {total > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1E4DB7" strokeWidth={14} strokeDasharray={`${pendingDash - gapDash} ${circumference - pendingDash + gapDash}`} strokeDashoffset={circumference / 4 - approvedDash} strokeLinecap="round" style={{
          transition: 'stroke-dasharray 0.6s ease'
        }} />}
        </svg>
        <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          <span className="text-xl font-bold" style={{
          color: '#0B1E3D',
          letterSpacing: '-0.04em'
        }}>{total}</span>
          <span className="text-xs" style={{
          color: '#94A3B8'
        }}>Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
          backgroundColor: '#22C55E'
        }} />
          <div>
            <p className="text-xs font-bold" style={{
            color: '#0B1E3D'
          }}>{approved} Approved</p>
            <p className="text-xs" style={{
            color: '#94A3B8'
          }}>{total > 0 ? Math.round(approvedPct * 100) : 0}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
          backgroundColor: '#1E4DB7'
        }} />
          <div>
            <p className="text-xs font-bold" style={{
            color: '#0B1E3D'
          }}>{pending} Pending</p>
            <p className="text-xs" style={{
            color: '#94A3B8'
          }}>{total > 0 ? Math.round(pendingPct * 100) : 0}%</p>
          </div>
        </div>
      </div>
    </div>;
};

// ─── Shared UI Primitives ───────────────────────────────────────────────────────

const KpiCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  gradient: string;
  icon: React.ReactNode;
}> = ({
  label,
  value,
  sub,
  gradient,
  icon
}) => <div className="rounded-xl p-4 flex flex-col justify-between" style={{
  background: gradient,
  minHeight: 110
}}>
    <div className="flex items-start justify-between mb-2">
      <p className="text-xs font-semibold text-white opacity-80 leading-snug max-w-[72%]">{label}</p>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
      backgroundColor: 'rgba(255,255,255,0.18)'
    }}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-bold text-white" style={{
      letterSpacing: '-0.04em'
    }}>{value}</p>
      <p className="text-xs mt-0.5 text-white opacity-60">{sub}</p>
    </div>
  </div>;
const FieldLabel: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => <label className="block text-xs font-semibold mb-1" style={{
  color: '#374151'
}}>{children}</label>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => <input {...props} className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${props.className || ''}`} style={{
  backgroundColor: 'white',
  border: '1.5px solid #E2E8F0',
  color: '#0B1E3D',
  ...(props.style || {})
}} />;
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {
  opts: {
    value: string;
    label: string;
  }[];
}> = ({
  opts,
  ...rest
}) => <div className="relative">
    <select {...rest} className="w-full px-3 py-2 pr-8 rounded-lg text-sm outline-none appearance-none" style={{
    backgroundColor: 'white',
    border: '1.5px solid #E2E8F0',
    color: '#0B1E3D',
    cursor: 'pointer',
    ...(rest.style || {})
  }}>
      {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown size={13} className="pointer-events-none" style={{
    position: 'absolute',
    right: 9,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8'
  }} />
  </div>;
const PageHeader: React.FC<{
  title: string;
  onBack?: () => void;
  subtitle?: string;
}> = ({
  title,
  onBack,
  subtitle
}) => <div className="mb-5">
    {onBack && <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold mb-3 transition-opacity hover:opacity-70" style={{
    color: '#7C5CFC'
  }}><ArrowLeft size={14} /><span>Back</span></button>}
    <h2 className="text-lg font-bold" style={{
    color: '#0B1E3D',
    letterSpacing: '-0.02em'
  }}>{title}</h2>
    {subtitle && <p className="text-xs mt-0.5" style={{
    color: '#94A3B8'
  }}>{subtitle}</p>}
  </div>;
const StepBadge: React.FC<{
  step: number;
  current: number;
  label: string;
}> = ({
  step,
  current,
  label
}) => {
  const done = current > step;
  const active = current === step;
  return <div className="flex items-center gap-1.5">
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{
      backgroundColor: done ? '#22C55E' : active ? '#1E4DB7' : '#E2E8F0',
      color: done || active ? 'white' : '#94A3B8'
    }}>
      {done ? <Check size={11} /> : <span>{step}</span>}
    </div>
    <span className="text-xs font-semibold hidden sm:block" style={{
      color: active ? '#1E4DB7' : done ? '#22C55E' : '#94A3B8'
    }}>{label}</span>
  </div>;
};

// ─── Tooltip Component ──────────────────────────────────────────────────────────

const Tooltip: React.FC<{
  text: string;
  children: React.ReactNode;
}> = ({
  text,
  children
}) => {
  const [show, setShow] = useState(false);
  return <span className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <span className="text-xs font-normal rounded-lg px-2.5 py-1.5 leading-relaxed" style={{
      position: 'absolute',
      bottom: '130%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0B1E3D',
      color: 'white',
      zIndex: 99,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      maxWidth: 280,
      whiteSpace: 'normal',
      width: 'max-content'
    }}>
          {text}
        </span>}
    </span>;
};

// ─── Download PDF Modal ─────────────────────────────────────────────────────────

const DownloadPdfModal: React.FC<{
  onClose: () => void;
  quotationData: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    systemCapacity: string;
    systemType: string;
    panelType: string;
    numPanels: number;
    roofType: string;
    monthlyGeneration: number;
    monthlySavings: number;
    annualSavings: number;
    systemCostTotal: number;
    subsidyAmount: number;
    actualInvestment: number;
    paybackYears: number;
    paybackMonths: number;
    freeYears: number;
    freeMonths: number;
    totalSavingYears: number;
    totalSavingMonths: number;
    totalSavingsRange: string;
    cashback: number;
    loanAmount: number;
    loanEmi: number;
    loanPayable: number;
    carbonFootprintSaved: number;
  };
}> = ({
  onClose,
  quotationData
}) => {
  const [docType, setDocType] = useState<'business' | 'customer'>('customer');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [finalOffer, setFinalOffer] = useState('');
  const handleCalcDiscount = () => {
    const base = quotationData.systemCostTotal;
    const pct = parseFloat(discountPercent) || 0;
    const disc = Math.round(base * pct / 100);
    const final = base - disc;
    setDiscountAmount(disc.toLocaleString('en-IN'));
    setFinalOffer(final.toLocaleString('en-IN'));
  };
  const qd = quotationData;
  const totalInstallCost = qd.systemCostTotal;
  const quotedPrice = parseFloat(finalOffer.replace(/,/g, '')) || qd.systemCostTotal;
  const totalProfit = quotedPrice - totalInstallCost;
  const profitPct = totalInstallCost > 0 ? (totalProfit / totalInstallCost * 100).toFixed(1) : '0';
  const isProfitable = parseFloat(profitPct) >= 15;
  const costPerWattBusiness = qd.systemCapacity ? (totalInstallCost / (parseFloat(qd.systemCapacity) * 1000)).toFixed(2) : '0';
  const costPerWattCustomer = qd.systemCapacity ? (quotedPrice / (parseFloat(qd.systemCapacity) * 1000)).toFixed(2) : '0';
  const docTabs = [{
    id: 'business' as const,
    label: 'Business Document'
  }, {
    id: 'customer' as const,
    label: 'Customer Quote'
  }];
  return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
    backgroundColor: 'rgba(11,30,61,0.6)',
    backdropFilter: 'blur(6px)'
  }}>
    <motion.div initial={{
      opacity: 0,
      scale: 0.95,
      y: 12
    }} animate={{
      opacity: 1,
      scale: 1,
      y: 0
    }} exit={{
      opacity: 0,
      scale: 0.95,
      y: 12
    }} transition={{
      type: 'spring',
      stiffness: 340,
      damping: 38
    }} className="w-full mx-4 rounded-2xl overflow-hidden flex flex-col" style={{
      maxWidth: 700,
      maxHeight: '92vh',
      background: 'white',
      boxShadow: '0 24px 60px rgba(11,30,61,0.22)'
    }}>
      <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between" style={{
        background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <h2 className="text-sm font-bold text-white" style={{
            letterSpacing: '-0.02em'
          }}>Download Document</h2>
          <p className="text-xs mt-0.5" style={{
            color: 'rgba(255,255,255,0.5)'
          }}>{qd.firstName} {qd.lastName} · {qd.systemCapacity}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)'
        }} aria-label="Close"><X size={15} /></button>
      </div>

      <div className="flex-shrink-0 px-6 pt-4 pb-0">
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{
          backgroundColor: '#E2E8F0'
        }}>
          {docTabs.map(tab => <button key={tab.id} onClick={() => setDocType(tab.id)} className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{
            backgroundColor: docType === tab.id ? 'white' : 'transparent',
            color: docType === tab.id ? '#0B1E3D' : '#64748B',
            boxShadow: docType === tab.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
          }}>
              {tab.label}
            </button>)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {docType === 'business' && <div className="space-y-4">
            <div className="rounded-xl p-4" style={{
            background: '#F8FAFC',
            border: '1.5px solid #E8EDF5'
          }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
              color: '#1E4DB7',
              letterSpacing: '0.08em'
            }}>Technical Details</p>
              <div className="grid grid-cols-2 gap-2">
                {[{
                label: 'System Capacity',
                value: qd.systemCapacity
              }, {
                label: 'System Type',
                value: qd.systemType
              }, {
                label: 'Panel Type',
                value: qd.panelType
              }, {
                label: 'No. of Panels',
                value: `${qd.numPanels} panels`
              }, {
                label: 'Roof Type',
                value: qd.roofType
              }, {
                label: 'Monthly Generation',
                value: `~${qd.monthlyGeneration} units`
              }].map(r => <div key={r.label} className="flex justify-between items-center px-3 py-1.5 rounded-lg" style={{
                backgroundColor: 'white',
                border: '1px solid #F1F5F9'
              }}>
                    <span className="text-xs" style={{
                  color: '#64748B'
                }}>{r.label}</span>
                    <span className="text-xs font-bold" style={{
                  color: '#0B1E3D'
                }}>{r.value}</span>
                  </div>)}
              </div>
            </div>

            <div className="rounded-xl p-4" style={{
            background: '#F8FAFC',
            border: '1.5px solid #E8EDF5'
          }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
              color: '#1E4DB7',
              letterSpacing: '0.08em'
            }}>Cost to Business</p>
              <div className="space-y-1.5">
                {[{
                label: 'Total Installation Cost',
                value: fmtINR(qd.systemCostTotal),
                bold: false
              }, {
                label: 'Cash Back (Govt Subsidy)',
                value: fmtINR(qd.subsidyAmount),
                bold: false
              }, {
                label: 'Actual Investment (Net)',
                value: fmtINR(qd.actualInvestment),
                bold: true
              }].map(r => <div key={r.label} className="flex justify-between items-center px-3 py-1.5 rounded-lg" style={{
                backgroundColor: 'white',
                border: '1px solid #F1F5F9'
              }}>
                    <span className="text-xs" style={{
                  color: '#64748B'
                }}>{r.label}</span>
                    <span className="text-xs font-bold" style={{
                  color: r.bold ? '#1E4DB7' : '#0B1E3D'
                }}>{r.value}</span>
                  </div>)}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="px-3 py-2 rounded-lg" style={{
                  backgroundColor: 'rgba(30,77,183,0.06)',
                  border: '1px solid rgba(30,77,183,0.15)'
                }}>
                    <p className="text-xs" style={{
                    color: '#64748B'
                  }}>Cost/Watt (Business)</p>
                    <p className="text-sm font-bold" style={{
                    color: '#1E4DB7'
                  }}>₹{costPerWattBusiness}/W</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg" style={{
                  backgroundColor: 'rgba(124,92,252,0.06)',
                  border: '1px solid rgba(124,92,252,0.15)'
                }}>
                    <p className="text-xs" style={{
                    color: '#64748B'
                  }}>Cost/Watt (Customer)</p>
                    <p className="text-sm font-bold" style={{
                    color: '#7C5CFC'
                  }}>₹{costPerWattCustomer}/W</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Footprint - Business */}
            <div className="rounded-xl p-4" style={{
            background: 'rgba(34,197,94,0.04)',
            border: '1.5px solid rgba(34,197,94,0.2)'
          }}>
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={13} style={{
                color: '#16A34A'
              }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{
                color: '#15803D',
                letterSpacing: '0.08em'
              }}>Carbon Footprint Saved</p>
              </div>
              <p className="text-xl font-bold" style={{
              color: '#15803D'
            }}>{qd.carbonFootprintSaved} tonnes CO₂/yr</p>
              <p className="text-xs mt-1" style={{
              color: '#64748B'
            }}>Based on grid emission factor of 0.71 kg CO₂/kWh</p>
            </div>

            <div className="rounded-xl p-4" style={{
            background: '#F8FAFC',
            border: '1.5px solid #E8EDF5'
          }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
              color: '#1E4DB7',
              letterSpacing: '0.08em'
            }}>Offer Discount</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div><FieldLabel>Discount (%)</FieldLabel><input type="number" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{
                  backgroundColor: 'white',
                  border: '1.5px solid #E2E8F0',
                  color: '#0B1E3D'
                }} /></div>
                <div>
                  <FieldLabel>Discount Amount</FieldLabel>
                  <div className="relative">
                    <span className="text-xs" style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }}>₹</span>
                    <input type="text" value={discountAmount} readOnly placeholder="Auto" className="w-full pl-6 pr-3 py-2 rounded-lg text-sm outline-none" style={{
                    backgroundColor: '#F0F4F8',
                    border: '1.5px solid #E2E8F0',
                    color: '#64748B'
                  }} />
                  </div>
                </div>
                <div>
                  <FieldLabel>Final Offer</FieldLabel>
                  <div className="relative">
                    <span className="text-xs" style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }}>₹</span>
                    <input type="text" value={finalOffer} readOnly placeholder="Auto" className="w-full pl-6 pr-3 py-2 rounded-lg text-sm outline-none" style={{
                    backgroundColor: '#F0F4F8',
                    border: '1.5px solid #E2E8F0',
                    color: '#64748B'
                  }} />
                  </div>
                </div>
              </div>
              <motion.button whileHover={{
              scale: 1.01
            }} whileTap={{
              scale: 0.98
            }} onClick={handleCalcDiscount} className="w-full py-2 rounded-xl text-xs font-bold text-white" style={{
              background: 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)'
            }}><span>Calculate Discount</span></motion.button>
            </div>

            <div className="rounded-xl p-4" style={{
            background: isProfitable ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
            border: `1.5px solid ${isProfitable ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
          }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
              color: '#0B1E3D',
              letterSpacing: '0.08em'
            }}>Business Summary</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[{
                label: 'Total Cost (Business)/Watt',
                value: `₹${costPerWattBusiness}/W`
              }, {
                label: 'Total Cost (Customer)/Watt',
                value: `₹${costPerWattCustomer}/W`
              }, {
                label: 'Total Profit',
                value: fmtINR(totalProfit > 0 ? totalProfit : 0)
              }, {
                label: 'Profit %',
                value: `${profitPct}%`
              }].map(r => <div key={r.label} className="flex flex-col px-3 py-2 rounded-lg" style={{
                backgroundColor: 'white',
                border: '1px solid #F1F5F9'
              }}>
                    <span className="text-xs mb-0.5" style={{
                  color: '#64748B'
                }}>{r.label}</span>
                    <span className="text-sm font-bold" style={{
                  color: '#0B1E3D'
                }}>{r.value}</span>
                  </div>)}
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{
              backgroundColor: isProfitable ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1.5px solid ${isProfitable ? '#86EFAC' : '#FECACA'}`
            }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
                backgroundColor: isProfitable ? '#22C55E' : '#EF4444'
              }}>
                  {isProfitable ? <Check size={14} color="white" /> : <X size={14} color="white" />}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{
                  color: isProfitable ? '#15803D' : '#DC2626'
                }}>
                    <span>Business Deal Status: </span><span>{isProfitable ? 'PROFITABLE' : 'NON-PROFITABLE'}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{
                  color: isProfitable ? '#16A34A' : '#EF4444'
                }}>
                    <span>Profit margin is </span><strong>{profitPct}%</strong><span> (threshold: ≥15%)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{
            background: '#F8FAFC',
            border: '1.5px solid #E8EDF5'
          }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
              color: '#1E4DB7',
              letterSpacing: '0.08em'
            }}>ROI Highlights</p>
              <div className="grid grid-cols-2 gap-2">
                {[{
                label: 'Monthly Generation',
                value: `~${qd.monthlyGeneration} units`
              }, {
                label: 'Monthly Savings',
                value: fmtINR(qd.monthlySavings)
              }, {
                label: 'Annual Savings',
                value: fmtINR(qd.annualSavings)
              }, {
                label: 'Payback Period',
                value: `${qd.paybackYears} yrs ${qd.paybackMonths} mo`
              }, {
                label: 'Free Profitable Years',
                value: `${qd.freeYears} yrs ${qd.freeMonths} mo`
              }, {
                label: 'Total Savings Range',
                value: qd.totalSavingsRange
              }].map(r => <div key={r.label} className="flex flex-col px-3 py-2 rounded-lg" style={{
                backgroundColor: 'white',
                border: '1px solid #F1F5F9'
              }}>
                    <span className="text-xs mb-0.5" style={{
                  color: '#64748B'
                }}>{r.label}</span>
                    <span className="text-sm font-bold" style={{
                  color: '#0B1E3D'
                }}>{r.value}</span>
                  </div>)}
              </div>
            </div>
          </div>}

        {docType === 'customer' && <div className="space-y-4">
            <div className="rounded-xl p-4" style={{
            background: '#F8FAFC',
            border: '1.5px solid #E8EDF5'
          }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
              color: '#7C5CFC',
              letterSpacing: '0.08em'
            }}>Customer Pricing Details</p>
              <div className="space-y-1.5">
                {[{
                label: 'System Capacity',
                value: qd.systemCapacity
              }, {
                label: 'System Type',
                value: qd.systemType
              }, {
                label: 'Total Net Investment',
                value: fmtINR(qd.systemCostTotal)
              }, {
                label: 'Cash Back (Govt. Subsidy)',
                value: fmtINR(qd.subsidyAmount)
              }, {
                label: 'Actual Amount to Pay',
                value: fmtINR(qd.actualInvestment),
                highlight: true
              }].map(r => <div key={r.label} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{
                backgroundColor: (r as {
                  highlight?: boolean;
                }).highlight ? 'rgba(124,92,252,0.07)' : 'white',
                border: (r as {
                  highlight?: boolean;
                }).highlight ? '1.5px solid rgba(124,92,252,0.2)' : '1px solid #F1F5F9'
              }}>
                    <span className="text-xs" style={{
                  color: '#64748B'
                }}>{r.label}</span>
                    <span className="text-xs font-bold" style={{
                  color: (r as {
                    highlight?: boolean;
                  }).highlight ? '#7C5CFC' : '#0B1E3D'
                }}>{r.value}</span>
                  </div>)}
              </div>
            </div>

            {/* Subsidy Disclaimer */}
            <div className="rounded-xl px-4 py-3 flex items-start gap-2.5" style={{
            background: 'rgba(255,184,0,0.06)',
            border: '1.5px solid rgba(255,184,0,0.3)'
          }}>
              <Info size={14} style={{
              color: '#B45309',
              flexShrink: 0,
              marginTop: 1
            }} />
              <p className="text-xs leading-relaxed" style={{
              color: '#92400E'
            }}>
                <strong>Subsidy Notice:</strong>
                <span> Customer pays the total chargeable amount to the vendor. The Government credits the Cash Back (subsidy) directly to the customer's bank account in approximately 45 days.</span>
              </p>
            </div>

            {/* Carbon Footprint - Customer */}
            <div className="rounded-xl p-4 flex items-center gap-4" style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(16,185,129,0.08) 100%)',
            border: '1.5px solid rgba(34,197,94,0.25)'
          }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
            }}>
                <Leaf size={18} color="white" />
              </div>
              <div>
                <p className="text-xs font-bold" style={{
                color: '#15803D'
              }}>Carbon Footprint Saved</p>
                <p className="text-xl font-bold" style={{
                color: '#15803D'
              }}>{qd.carbonFootprintSaved} <span className="text-sm font-normal">tonnes CO₂/yr</span></p>
                <p className="text-xs" style={{
                color: '#64748B'
              }}>Your contribution to a greener planet 🌿</p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{
            border: '1.5px solid #1E4DB7'
          }}>
              <div className="px-4 py-2.5 flex items-center gap-2" style={{
              background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
            }}>
                <TrendingUp size={13} color="white" />
                <span className="text-xs font-bold text-white">Return on Investment Calculation</span>
              </div>
              <div className="p-4 space-y-2" style={{
              backgroundColor: 'rgba(30,77,183,0.02)'
            }}>
                {[{
                label: 'Monthly Generation',
                value: `≈ ${qd.monthlyGeneration} units`,
                color: '#1E4DB7'
              }, {
                label: 'Monthly Savings',
                value: fmtINR(qd.monthlySavings),
                color: '#1E4DB7'
              }, {
                label: 'Annual Savings',
                value: fmtINR(qd.annualSavings),
                color: '#1E4DB7'
              }, {
                label: 'Total Net Investment',
                value: fmtINR(qd.systemCostTotal),
                color: '#0B1E3D'
              }, {
                label: 'Cash Back (Govt. Subsidy)',
                value: fmtINR(qd.cashback),
                color: '#0B1E3D'
              }, {
                label: 'Actual Amount Invested',
                value: fmtINR(qd.actualInvestment),
                color: '#1E4DB7'
              }].map(r => <div key={r.label} className="flex justify-between items-center px-3 py-1.5 rounded-lg" style={{
                backgroundColor: 'white',
                border: '1px solid #EFF6FF'
              }}>
                    <span className="text-xs" style={{
                  color: '#64748B'
                }}>{r.label}</span>
                    <span className="text-xs font-bold" style={{
                  color: r.color
                }}>{r.value}</span>
                  </div>)}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="flex flex-col items-center px-3 py-3 rounded-xl" style={{
                  background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
                }}>
                    <p className="text-xs text-white opacity-70 text-center mb-1">Your Payback Period</p>
                    <p className="text-sm font-bold text-white">{qd.paybackYears} yrs {qd.paybackMonths} mo</p>
                  </div>
                  <div className="flex flex-col items-center px-3 py-3 rounded-xl" style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                }}>
                    <p className="text-xs text-white opacity-70 text-center mb-1">Free Profitable Years</p>
                    <p className="text-sm font-bold text-white">{qd.freeYears} yrs {qd.freeMonths} mo</p>
                  </div>
                  <div className="flex flex-col items-center px-3 py-3 rounded-xl" style={{
                  background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
                }}>
                    <p className="text-xs text-white opacity-70 text-center mb-1">Cash Back</p>
                    <p className="text-sm font-bold text-white">{fmtINR(qd.cashback)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl mt-1" style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(30,77,183,0.08) 100%)',
                border: '1.5px solid rgba(34,197,94,0.2)'
              }}>
                  <Star size={16} style={{
                  color: '#FFB800',
                  flexShrink: 0
                }} />
                  <div>
                    <p className="text-xs font-bold" style={{
                    color: '#0B1E3D'
                  }}>
                      <span>Total Saving Years: </span>
                      <span style={{
                      color: '#22C55E'
                    }}>{qd.totalSavingYears} yrs {qd.totalSavingMonths} mo</span>
                    </p>
                    <p className="text-xs" style={{
                    color: '#374151'
                  }}>
                      <span>Estimated Total Savings: </span>
                      <strong style={{
                      color: '#15803D'
                    }}>{qd.totalSavingsRange}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {qd.loanAmount > 0 && <div className="rounded-xl overflow-hidden" style={{
            border: '1.5px solid #E8EDF5'
          }}>
                <div className="px-4 py-2.5 flex items-center gap-2" style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0'
            }}>
                  <Banknote size={13} style={{
                color: '#1E4DB7'
              }} />
                  <span className="text-xs font-bold" style={{
                color: '#0B1E3D'
              }}>Bank Loan Calculation</span>
                </div>
                <div className="p-4 space-y-1.5">
                  {[{
                label: 'Loan Amount',
                value: fmtINR(qd.loanAmount)
              }, {
                label: 'Total Payable to Bank',
                value: fmtINR(qd.loanPayable)
              }, {
                label: 'EMI (per month)',
                value: fmtINR(qd.loanEmi),
                highlight: true
              }].map(r => <div key={r.label} className="flex justify-between items-center px-3 py-1.5 rounded-lg" style={{
                backgroundColor: (r as {
                  highlight?: boolean;
                }).highlight ? 'rgba(30,77,183,0.06)' : 'white',
                border: (r as {
                  highlight?: boolean;
                }).highlight ? '1px solid rgba(30,77,183,0.15)' : '1px solid #F1F5F9'
              }}>
                      <span className="text-xs" style={{
                  color: '#64748B'
                }}>{r.label}</span>
                      <span className="text-xs font-bold" style={{
                  color: (r as {
                    highlight?: boolean;
                  }).highlight ? '#1E4DB7' : '#0B1E3D'
                }}>{r.value}</span>
                    </div>)}
                </div>
              </div>}

            <div className="rounded-xl p-4" style={{
            background: '#F8FAFC',
            border: '1.5px solid #E8EDF5'
          }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
              color: '#7C5CFC',
              letterSpacing: '0.08em'
            }}>Offer Discount</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div><FieldLabel>In %</FieldLabel><input type="number" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{
                  backgroundColor: 'white',
                  border: '1.5px solid #E2E8F0',
                  color: '#0B1E3D'
                }} /></div>
                <div><FieldLabel>Discount</FieldLabel><div className="relative"><span className="text-xs" style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }}>₹</span><input type="text" value={discountAmount} readOnly placeholder="Auto" className="w-full pl-6 pr-3 py-2 rounded-lg text-sm outline-none" style={{
                    backgroundColor: '#F0F4F8',
                    border: '1.5px solid #E2E8F0',
                    color: '#64748B'
                  }} /></div></div>
                <div><FieldLabel>Final Offer</FieldLabel><div className="relative"><span className="text-xs" style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }}>₹</span><input type="text" value={finalOffer} readOnly placeholder="Auto" className="w-full pl-6 pr-3 py-2 rounded-lg text-sm outline-none" style={{
                    backgroundColor: '#F0F4F8',
                    border: '1.5px solid #E2E8F0',
                    color: '#64748B'
                  }} /></div></div>
              </div>
              <motion.button whileHover={{
              scale: 1.01
            }} whileTap={{
              scale: 0.98
            }} onClick={handleCalcDiscount} className="w-full py-2 rounded-xl text-xs font-bold text-white" style={{
              background: 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)'
            }}><span>Calculate</span></motion.button>
            </div>
          </div>}
      </div>

      <div className="flex-shrink-0 px-6 py-4 flex items-center gap-3" style={{
        borderTop: '1px solid #F1F5F9',
        backgroundColor: 'white'
      }}>
        <motion.button whileHover={{
          scale: 1.01
        }} whileTap={{
          scale: 0.98
        }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white" style={{
          background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)'
        }}>
          <Download size={14} />
          <span>Download {docType === 'business' ? 'Business Document' : 'Customer Quote'}</span>
        </motion.button>
        <motion.button whileHover={{
          scale: 1.01
        }} whileTap={{
          scale: 0.98
        }} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold" style={{
          backgroundColor: '#F8FAFC',
          color: '#64748B',
          border: '1.5px solid #E2E8F0'
        }}>
          <Printer size={14} /><span>Print</span>
        </motion.button>
        <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{
          backgroundColor: '#F1F5F9',
          color: '#64748B',
          border: '1.5px solid #E2E8F0'
        }}><span>Close</span></button>
      </div>
    </motion.div>
  </div>;
};

// ─── Quotation View/Edit Modal ─────────────────────────────────────────────────

const QuotationViewModal: React.FC<{
  quotation: QuotationDetail;
  onClose: () => void;
  onSave: (q: QuotationDetail) => void;
}> = ({
  quotation,
  onClose,
  onSave
}) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<QuotationDetail>({
    ...quotation
  });
  const setF = <K extends keyof QuotationDetail,>(key: K, val: QuotationDetail[K]) => setForm(f => ({
    ...f,
    [key]: val
  }));
  const sanctionLoadNum = parseFloat(form.sanctionLoad) || 0;
  const requestedNum = parseFloat(form.systemCapacity) || 0;
  const needsUpgrade = sanctionLoadNum > 0 && requestedNum > sanctionLoadNum;
  const InfoRow: React.FC<{
    label: string;
    value: string;
    highlight?: boolean;
  }> = ({
    label,
    value,
    highlight
  }) => <div className="flex items-start justify-between gap-3 py-1.5" style={{
    borderBottom: '1px solid #F8FAFC'
  }}>
      <span className="text-xs flex-shrink-0" style={{
      color: '#64748B',
      minWidth: 130
    }}>{label}</span>
      <span className="text-xs font-semibold text-right" style={{
      color: highlight ? '#1E4DB7' : '#0B1E3D'
    }}>{value || '—'}</span>
    </div>;
  return <div className="fixed inset-0 z-50 flex items-stretch justify-end" style={{
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
  }}>
    <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="flex-1" style={{
      backgroundColor: 'rgba(11,30,61,0.45)',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose} />
    <motion.aside initial={{
      x: '100%'
    }} animate={{
      x: 0
    }} exit={{
      x: '100%'
    }} transition={{
      type: 'spring',
      stiffness: 340,
      damping: 38
    }} className="flex-shrink-0 flex flex-col" style={{
      width: 520,
      maxWidth: '100vw',
      height: '100vh',
      background: '#FFFFFF',
      boxShadow: '-8px 0 40px rgba(11,30,61,0.14)'
    }}>
      <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between" style={{
        borderBottom: '1px solid #F1F5F9',
        background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)'
      }}>
        <div>
          <h2 className="text-sm font-bold text-white" style={{
            letterSpacing: '-0.02em'
          }}>Quotation Details</h2>
          <p className="text-xs mt-0.5" style={{
            color: 'rgba(255,255,255,0.5)'
          }}>{form.firstName} {form.lastName} · {form.dateTime}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)'
        }} aria-label="Close"><X size={15} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
            color: '#7C5CFC',
            letterSpacing: '0.08em'
          }}>Customer Information</p>
          <div className="rounded-xl p-4" style={{
            background: 'white',
            border: '1.5px solid #E8EDF5'
          }}>
            {editing ? <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>First Name</FieldLabel><Input value={form.firstName} onChange={e => setF('firstName', e.target.value)} placeholder="First name" /></div>
                <div><FieldLabel>Last Name</FieldLabel><Input value={form.lastName} onChange={e => setF('lastName', e.target.value)} placeholder="Last name" /></div>
              </div>
              <div><FieldLabel>Phone</FieldLabel><Input type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+91 98765 43210" /></div>
              <div><FieldLabel>Address</FieldLabel><textarea value={form.address} onChange={e => setF('address', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{
                  backgroundColor: 'white',
                  border: '1.5px solid #E2E8F0',
                  color: '#0B1E3D'
                }} placeholder="Full address" /></div>
              <div><FieldLabel>Location</FieldLabel><Input value={form.location} onChange={e => setF('location', e.target.value)} placeholder="City, State" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Consumer No</FieldLabel><Input value={form.consumerNo} onChange={e => setF('consumerNo', e.target.value)} placeholder="MH042300123456" /></div>
                <div><FieldLabel>Sanction Load (kW)</FieldLabel><Input type="number" min="0" value={form.sanctionLoad} onChange={e => setF('sanctionLoad', e.target.value)} placeholder="3" /></div>
              </div>
            </div> : <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{
                  background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
                }}>{form.firstName.charAt(0)}</div>
                <div>
                  <p className="text-sm font-bold" style={{
                    color: '#0B1E3D'
                  }}>{form.firstName} {form.lastName}</p>
                  <p className="text-xs" style={{
                    color: '#64748B'
                  }}>{form.phone}</p>
                </div>
              </div>
              <InfoRow label="Address" value={form.address} />
              <InfoRow label="Location" value={form.location} />
              <InfoRow label="Consumer No." value={form.consumerNo} highlight />
              <InfoRow label="Sanction Load" value={form.sanctionLoad ? `${form.sanctionLoad} kW` : '—'} />
              <InfoRow label="Site Type" value={form.siteType} />
              <InfoRow label="Billing Type" value={form.billingType} />
            </div>}
          </div>
        </div>

        {!editing && <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
            color: '#7C5CFC',
            letterSpacing: '0.08em'
          }}>Bill Summary</p>
          <div className="rounded-xl p-4" style={{
            background: 'white',
            border: '1.5px solid #E8EDF5'
          }}>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg px-3 py-2" style={{
                backgroundColor: 'rgba(30,77,183,0.05)'
              }}>
                <p className="text-xs" style={{
                  color: '#64748B'
                }}>Avg Monthly Units</p>
                <p className="text-sm font-bold" style={{
                  color: '#1E4DB7'
                }}>{form.avgMonthlyUnits > 0 ? `${form.avgMonthlyUnits} units` : '—'}</p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{
                backgroundColor: 'rgba(34,197,94,0.06)'
              }}>
                <p className="text-xs" style={{
                  color: '#64748B'
                }}>Suggested Capacity</p>
                <p className="text-sm font-bold" style={{
                  color: '#15803D'
                }}>{form.suggestedCapacity} kW</p>
              </div>
            </div>
          </div>
        </div>}

        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{
            color: '#7C5CFC',
            letterSpacing: '0.08em'
          }}>System & Site Details</p>
          <div className="rounded-xl p-4" style={{
            background: 'white',
            border: '1.5px solid #E8EDF5'
          }}>
            {editing ? <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Requested Capacity</FieldLabel><Select opts={CAPACITY_OPTIONS} value={form.systemCapacity} onChange={e => setF('systemCapacity', e.target.value)} /></div>
                <div><FieldLabel>System Type</FieldLabel><Select opts={SYSTEM_TYPES.map(s => ({
                    value: s.value,
                    label: s.label
                  }))} value={form.systemType} onChange={e => setF('systemType', e.target.value as SystemType)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Panel Type</FieldLabel><Input value={form.panelType} onChange={e => setF('panelType', e.target.value)} /></div>
                <div><FieldLabel>Roof Type</FieldLabel><Select opts={ROOF_OPTIONS} value={form.roofType} onChange={e => setF('roofType', e.target.value)} /></div>
              </div>
              <div><FieldLabel>Final Quotation Amount</FieldLabel><Input value={form.amount} onChange={e => setF('amount', e.target.value)} placeholder="₹2,10,000" /></div>
            </div> : <div>
              <InfoRow label="Requested Capacity" value={form.systemCapacity} highlight />
              <InfoRow label="System Type" value={form.systemType} />
              <InfoRow label="Panel Type" value={form.panelType} />
              <InfoRow label="Roof Type" value={form.roofType} />
              <InfoRow label="Number of Panels" value={`${form.numPanels} panels`} highlight />
              <InfoRow label="Available Area" value={form.availableArea ? `${form.availableArea} sq.ft` : '—'} />
              <InfoRow label="System Area Required" value={form.systemArea ? `${form.systemArea} sq.ft` : '—'} />
              <InfoRow label="Shortfall" value={parseFloat(form.shortfall) > 0 ? `${form.shortfall} sq.ft` : 'None'} />
              <InfoRow label="Final Quotation Amount" value={form.amount} />
            </div>}
            {needsUpgrade && <div className="flex items-start gap-2.5 mt-3 px-3 py-2.5 rounded-xl" style={{
              background: 'rgba(251,146,60,0.08)',
              border: '1.5px solid rgba(251,146,60,0.3)'
            }}>
              <AlertTriangle size={14} style={{
                color: '#F97316',
                flexShrink: 0,
                marginTop: 1
              }} />
              <p className="text-xs leading-relaxed" style={{
                color: '#C2410C'
              }}>
                <strong>Requested System Capacity is {form.systemCapacity}.</strong>
                <span> You will need to get the sanction load updated from MSEB (currently {form.sanctionLoad} kW).</span>
              </p>
            </div>}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-6 py-4 flex items-center gap-3" style={{
        borderTop: '1px solid #F1F5F9',
        backgroundColor: 'white'
      }}>
        {editing ? <motion.button whileHover={{
          scale: 1.01
        }} whileTap={{
          scale: 0.98
        }} onClick={() => {
          onSave(form);
          setEditing(false);
        }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white" style={{
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
        }}>
          <Check size={14} /><span>Save Changes</span>
        </motion.button> : <motion.button whileHover={{
          scale: 1.01
        }} whileTap={{
          scale: 0.98
        }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white" style={{
          background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)'
        }}>
          <Download size={14} /><span>Download PDF</span>
        </motion.button>}
        <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{
          backgroundColor: '#F1F5F9',
          color: '#64748B',
          border: '1.5px solid #E2E8F0'
        }}><span>Close</span></button>
      </div>
    </motion.aside>
  </div>;
};

// ─── Main Dashboard Component ────────────────────────────────────────────────────

export const SolarDashboard: React.FC<DashboardProps> = ({
  onLogout,
  userProfile,
  onProfileUpdate
}) => {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [viewingQuotation, setViewingQuotation] = useState<QuotationDetail | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [quotations, setQuotations] = useState<QuotationDetail[]>([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [pricingRows, setPricingRows] = useState<PricingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Partial<PricingRow>>({});
  const [phaseFilter, setPhaseFilter] = useState<PhaseType | 'all'>('all');
  const [setupRows, setSetupRows] = useState<PricingSetupRow[]>(PRICING_SETUP_ROWS);
  const [statusRows, setStatusRows] = useState<PricingStatusRow[]>(INITIAL_STATUS_ROWS);
  const [activeTab, setActiveTab] = useState<'setup' | 'pricing'>('setup');
  const [quotationStep, setQuotationStep] = useState<QuotationStep>(1);
  const [inputMode, setInputMode] = useState<'bill' | 'manual'>('bill');
  const [dashboardFilter, setDashboardFilter] = useState<DashboardFilter>('all');
  const [selectedBoqKey, setSelectedBoqKey] = useState<string | null>(null);

  // Step 1
  const [custFirstName, setCustFirstName] = useState('');
  const [custLastName, setCustLastName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custLocation, setCustLocation] = useState('');
  const [custConsumerNo, setCustConsumerNo] = useState('');
  const [custSanctionLoad, setCustSanctionLoad] = useState('');
  const [monthlyUnits, setMonthlyUnits] = useState<Record<string, string>>({});
  const [siteType, setSiteType] = useState('');
  const [billingType, setBillingType] = useState('Res 1-Phase');
  const [uploadedBill, setUploadedBill] = useState<string | null>(null);
  const [uploadedBillName, setUploadedBillName] = useState<string | null>(null);
  const billFileRef = useRef<HTMLInputElement>(null);

  // Step 2
  const [systemCapacity, setSystemCapacity] = useState('');
  const [systemType, setSystemType] = useState<SystemType>('on-grid');
  const [areaLength, setAreaLength] = useState('');
  const [areaWidth, setAreaWidth] = useState('');
  const [buildingHeight, setBuildingHeight] = useState('');
  const [roofType, setRoofType] = useState('');
  const [selectedPanel, setSelectedPanel] = useState<PanelTypeId>('mono-standard');
  const [panelCount, setPanelCount] = useState<number>(0);
  const [manualPanelOverride, setManualPanelOverride] = useState(false);
  const totalArea = areaLength && areaWidth ? (parseFloat(areaLength) * parseFloat(areaWidth)).toString() : '';

  // Step 3 – Expenses
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>(INITIAL_EXPENSE_ITEMS);
  const [expenseValues, setExpenseValues] = useState<Record<string, string>>({
    installation: '',
    transport: '',
    liaison: '',
    structureInstall: '',
    other: ''
  });
  const [settingsExpenseValues, setSettingsExpenseValues] = useState<Record<string, string>>({
    installation: '',
    transport: '',
    liaison: '',
    structureInstall: '',
    other: ''
  });

  // Step 3 – ROI inputs
  const [unitRate, setUnitRate] = useState('8');
  const [systemCostManual, setSystemCostManual] = useState('');
  // Subsidy as flat number (not percent)
  const [subsidyAmount, setSubsidyAmount] = useState('78000');
  const [panelLifeYears] = useState(25);

  // Step 3 – Loan
  const [loanEnabled, setLoanEnabled] = useState(false);
  const [loanValues, setLoanValues] = useState<Record<string, string>>({
    amount: '',
    interest: '',
    term: '',
    payable: '',
    emi: ''
  });

  // Business settings
  const [profitThreshold, setProfitThreshold] = useState(15);

  // ── Data Fetching ──
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [quotationsRes, pricingRes] = await Promise.all([
          quotationsApi.list(),
          pricingApi.list()
        ]);
        setQuotations(((quotationsRes.items || []) as any[]).map((q: any) => mapQuotationFromBackend(q) as any));
        setPricingRows((pricingRes as unknown as any[])?.map((p: any) => mapPricingFromBackend(p) as any) || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // ── Derived values ──
  const panelInfo = PANEL_ROWS.find(p => p.id === selectedPanel) || PANEL_ROWS[0];

  // ── Auto-calculate panel count from sanction load ──
  useEffect(() => {
    if (custSanctionLoad && !manualPanelOverride) {
      const kw = parseFloat(custSanctionLoad);
      const wattage = panelInfo.wattage;
      const calculated = kw > 0 ? Math.ceil((kw * 1000) / wattage) : 0;
      setPanelCount(calculated);
    }
  }, [custSanctionLoad, selectedPanel, manualPanelOverride, panelInfo.wattage]);
  const availableArea = totalArea ? (Number(totalArea) * 0.5).toFixed(0) : '';
  const activeExpenseItems = expenseItems.filter(item => item.isDefault);
  const totalOtherExpenses = activeExpenseItems.reduce((s, i) => s + (parseFloat(expenseValues[i.key]) || 0), 0);
  const avgMonthlyUnits = Object.values(monthlyUnits).reduce((s, v) => s + (parseFloat(v) || 0), 0) / 12;
  const suggestedCapacity = avgMonthlyUnits > 0 ? (avgMonthlyUnits / (30 * 4.5)).toFixed(1) : '—';
  const sanctionLoadKw = avgMonthlyUnits > 0 ? Math.max(Math.ceil(avgMonthlyUnits / 135), 1) : 0;
  const initials = userProfile.fullName ? userProfile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'SO';
  const systemKw = parseFloat(systemCapacity) || 0;
  const numPanels = manualPanelOverride
    ? panelCount
    : (custSanctionLoad ? Math.ceil(parseFloat(custSanctionLoad) * 1000 / panelInfo.wattage) : 0);
  const systemArea = numPanels > 0 ? Math.ceil(numPanels * panelInfo.areaSqFt) : 0;
  const availableAreaNum = parseFloat(availableArea) || 0;
  const shortfall = systemArea > availableAreaNum ? (systemArea - availableAreaNum).toFixed(0) : '0';
  const sanctionLoadNum = parseFloat(custSanctionLoad) || 0;
  const requestedKw = parseFloat(systemCapacity) || 0;
  const needsSanctionUpgrade = sanctionLoadNum > 0 && requestedKw > sanctionLoadNum;

  // Determine phase from billingType for Sanction Load filtering
  const billingPhase: '1-Phase' | '3-Phase' | 'both' = billingType.includes('3-Phase') || billingType === 'Industrial' ? '3-Phase' : billingType.includes('1-Phase') ? '1-Phase' : 'both';
  const filteredSanctionLoadOptions = SANCTION_LOAD_OPTIONS_ALL.filter(opt => {
    if (billingPhase === '1-Phase') return opt.phases.includes('1-Phase');
    if (billingPhase === '3-Phase') return opt.phases.includes('3-Phase');
    return true;
  });

  // Auto-calculate Unit Rate from system cost / total watts
  const totalWatts = systemKw * 1000;
  const systemCostBase = parseFloat(systemCostManual) || (systemKw > 0 ? systemKw * 45000 : 210000);
  const systemCostTotal = systemCostBase + totalOtherExpenses;
  const autoUnitRate = totalWatts > 0 ? (systemCostTotal / totalWatts).toFixed(2) : unitRate;

  // ROI Calculations (corrected)
  // Monthly generation: P * 4.5 * 0.75 * 30
  const peakSunHours = 4.5;
  const performanceRatio = 0.75;
  const monthlyGeneration = systemKw > 0 ? Math.round(systemKw * peakSunHours * 30 * performanceRatio) : 0;
  const unitRateNum = parseFloat(unitRate) || 8;
  const monthlySavings = Math.round(monthlyGeneration * unitRateNum);
  const annualSavings = monthlySavings * 12;
  const subsidyAmountNum = parseFloat(subsidyAmount) || 0;
  const cashbackNum = subsidyAmountNum;
  const actualInvestment = systemCostTotal - subsidyAmountNum;
  const netAfterCashback = actualInvestment;
  const paybackTotalMonths = annualSavings > 0 ? netAfterCashback / annualSavings * 12 : 0;
  const paybackYears = Math.floor(paybackTotalMonths / 12);
  const paybackMonths = Math.round(paybackTotalMonths % 12);
  const totalSystemLifeMonths = panelLifeYears * 12;
  const freeMonthsTotal = totalSystemLifeMonths - paybackTotalMonths;
  const freeYears = Math.max(0, Math.floor(freeMonthsTotal / 12));
  const freeMonths = Math.max(0, Math.round(freeMonthsTotal % 12));
  const totalSavingYears = freeYears;
  const totalSavingMonths = freeMonths;
  const totalSavingsMin = Math.max(0, Math.round(annualSavings * freeYears / 100000) * 100000);
  const totalSavingsMax = Math.max(0, Math.round(annualSavings * (freeYears + 3) / 100000) * 100000);
  const totalSavingsRange = `${fmtINR(totalSavingsMin)} – ${fmtINR(totalSavingsMax)}`;

  // Carbon Footprint: E_saved = P * H * PR * 365 * EF_grid (tonnes)
  // P = kW, H = 4.5, PR = 0.75, EF = 0.71 kg CO2/kWh → convert to tonnes
  const carbonFootprintSaved = systemKw > 0 ? parseFloat(calcCO2Saved(systemKw)) : 0;
  const CO2_EF_GRID = 0.71; // kg CO2/kWh

  // Dashboard CO2 for approved quotes
  const approvedQuotations = quotations.filter(q => q.approved);
  const totalCO2Saved = approvedQuotations.reduce((acc, q) => {
    const kw = parseFloat(q.systemCapacity) || 0;
    return acc + kw * 4.5 * 0.75 * 365 * CO2_EF_GRID / 1000;
  }, 0);

  // Loan
  const handleLoanCalculate = () => {
    const P = parseFloat(loanValues.amount) || 0;
    const r = (parseFloat(loanValues.interest) || 0) / 100 / 12;
    const n = (parseFloat(loanValues.term) || 0) * 12;
    if (P > 0 && r > 0 && n > 0) {
      const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      setLoanValues(prev => ({
        ...prev,
        emi: Math.round(emi).toLocaleString('en-IN'),
        payable: Math.round(emi * n).toLocaleString('en-IN')
      }));
    }
  };

  // Quotation handlers
  const toggleApprove = async (id: string) => {
    try {
      await quotationsApi.approve(id);
      setQuotations(qs => qs.map(q => q.id === id ? {
        ...q,
        approved: !q.approved
      } : q));
    } catch (error) {
      console.error('Failed to approve quotation:', error);
      setFetchError('Failed to approve quotation');
    }
  };
  const deleteQuotation = async (id: string) => {
    try {
      await quotationsApi.delete(id);
      setQuotations(qs => qs.filter(q => q.id !== id));
      setDeletedCount(c => c + 1);
    } catch (error) {
      console.error('Failed to delete quotation:', error);
      setFetchError('Failed to delete quotation');
    }
  };
  const updateQuotation = (updated: QuotationDetail) => setQuotations(qs => qs.map(q => q.id === updated.id ? updated : q));
  const handleSaveQuotation = async () => {
    const newQ: QuotationDetail = {
      id: `temp-${Date.now()}`,
      firstName: custFirstName || 'Unknown',
      lastName: custLastName || 'Customer',
      phone: custPhone,
      address: custAddress,
      location: custLocation,
      consumerNo: custConsumerNo,
      sanctionLoad: custSanctionLoad,
      siteType,
      billingType,
      avgMonthlyUnits: avgMonthlyUnits > 0 ? Math.round(avgMonthlyUnits) : 0,
      suggestedCapacity: suggestedCapacity !== '—' ? suggestedCapacity : '0',
      systemCapacity,
      systemType,
      panelType: panelInfo.name,
      roofType,
      areaLength,
      areaWidth,
      buildingHeight,
      numPanels,
      availableArea,
      systemArea: systemArea.toString(),
      shortfall,
      uploadedBill,
      dateTime: fmtDT(new Date()),
      amount: fmtINR(actualInvestment),
      approved: false
    };
    try {
      const phase = billingType.includes('3-Phase') ? '3-Phase' : '1-Phase';
      const created = await quotationsApi.create({
        firstName: custFirstName || 'Unknown',
        lastName: custLastName || 'Customer',
        phone: custPhone,
        address: custAddress,
        state: custLocation.split(',').pop()?.trim() || '',
        city: custLocation.split(',')[0] || '',
        consumerNo: custConsumerNo,
        sanctionLoad: custSanctionLoad,
        siteType,
        billingType,
        systemCapacity,
        panelType: selectedPanel,
        phase,
        roofType,
        areaLength,
        areaWidth,
        buildingHeight,
      });
      const mapped = mapQuotationFromBackend(created as any);
      setQuotations(qs => [mapped as any, ...qs]);
    } catch (error) {
      // Fallback: add optimistic record if API fails
      setQuotations(qs => [newQ, ...qs]);
      console.error('Failed to create quotation:', error);
      setFetchError('Failed to save quotation');
    }
    setActiveSection('dashboard');
    setQuotationStep(1);
    setCustFirstName('');
    setCustLastName('');
    setCustPhone('');
    setCustAddress('');
    setCustLocation('');
    setCustConsumerNo('');
    setCustSanctionLoad('');
    setMonthlyUnits({});
    setSiteType('');
    setBillingType('Res 1-Phase');
    setUploadedBill(null);
    setUploadedBillName(null);
    setSystemCapacity('');
    setAreaLength('');
    setAreaWidth('');
    setBuildingHeight('');
    setRoofType('');
  };

  // Pricing handlers
  const handlePricingEdit = (row: PricingRow) => {
    setEditingRow(row.id);
    setEditBuffer({
      ...row
    });
  };
  const handlePricingSave = async () => {
    if (!editingRow || !editBuffer) return;
    try {
      await pricingApi.update(editingRow, {
        panelCost: editBuffer.panelCost ?? 0,
        inverterCost: editBuffer.inverterCost ?? 0,
        structureCost: editBuffer.structureCost ?? 0,
        cableCost: editBuffer.cableCost ?? 0,
        otherCost: editBuffer.otherCost ?? 0,
      });
      setPricingRows(rows => rows.map(r => r.id === editingRow ? {
        ...r,
        ...editBuffer
      } as PricingRow : r));
    } catch (error) {
      console.error('Failed to save pricing:', error);
      setFetchError('Failed to save pricing');
    }
    setEditingRow(null);
    setEditBuffer({});
  };
  const handlePricingDelete = async (id: string) => {
    try {
      await pricingApi.delete(id);
      setPricingRows(rows => rows.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete pricing:', error);
      setFetchError('Failed to delete pricing');
    }
  };
  const handleAddRow = () => {
    const newRow: PricingRow = {
      id: `r${Date.now()}`,
      capacity: '3kW',
      phase: 'single',
      panelCost: 0,
      inverterCost: 0,
      structureCost: 0,
      cableCost: 0,
      otherCost: 0
    };
    setPricingRows(rows => [...rows, newRow]);
    handlePricingEdit(newRow);
  };
  const handleSetupPhaseChange = (kw: number, phase: PhaseOption) => setSetupRows(rows => rows.map(r => r.kw === kw ? {
    ...r,
    phase
  } : r));
  const handleSetupUpload = (kw: number) => {
    const row = setupRows.find(r => r.kw === kw);
    if (!row) return;
    const type: 'single' | 'threePhase' = row.phase === '1-Phase' ? 'single' : 'threePhase';
    setStatusRows(rows => rows.map(r => r.kw !== kw ? r : {
      ...r,
      [type]: {
        status: 'pending'
      }
    }));
  };
  const handleEditStatus = (kw: number, type: 'single' | 'threePhase') => {
    setStatusRows(rows => rows.map(r => {
      if (r.kw !== kw) return r;
      const current = r[type];
      if (!current) return r;
      return {
        ...r,
        [type]: {
          status: current.status === 'pending' ? 'complete' : 'pending'
        }
      };
    }));
  };
  const handleDeleteStatus = (kw: number, type: 'single' | 'threePhase') => setStatusRows(rows => rows.map(r => r.kw !== kw ? r : {
    ...r,
    [type]: null
  }));
  const visibleRows = pricingRows.filter(r => phaseFilter === 'all' || r.phase === phaseFilter);
  const STEP_LABELS = ['Billing Details', 'System & Site', 'Analysis & ROI'];
  const quotationPdfData = {
    firstName: custFirstName,
    lastName: custLastName,
    address: custAddress,
    phone: custPhone,
    systemCapacity,
    systemType,
    panelType: panelInfo.name,
    numPanels,
    roofType,
    monthlyGeneration,
    monthlySavings,
    annualSavings,
    systemCostTotal,
    subsidyAmount: subsidyAmountNum,
    actualInvestment,
    paybackYears,
    paybackMonths,
    freeYears,
    freeMonths,
    totalSavingYears,
    totalSavingMonths,
    totalSavingsRange,
    cashback: cashbackNum,
    loanAmount: parseFloat(loanValues.amount) || 0,
    loanEmi: parseFloat(loanValues.emi?.replace(/,/g, '') || '0') || 0,
    loanPayable: parseFloat(loanValues.payable?.replace(/,/g, '') || '0') || 0,
    carbonFootprintSaved
  };

  // ─── Step 1 ───────────────────────────────────────────────────────────────────

  const isPMSuryaEligible = billingType.startsWith('Res 1-Phase') || billingType.startsWith('Res 3-Phase') || billingType.startsWith('Com 1-Phase');
  const renderStep1 = () => <div>
    <div className="flex items-center gap-2 mb-4 overflow-x-auto">
      {STEP_LABELS.map((label, i) => <div key={label} className="flex items-center gap-2 flex-shrink-0">
        <StepBadge step={i + 1} current={quotationStep} label={label} />
        {i < STEP_LABELS.length - 1 && <div className="w-8 h-px hidden sm:block" style={{
          backgroundColor: quotationStep > i + 1 ? '#22C55E' : '#E2E8F0'
        }} />}
      </div>)}
    </div>

    <div className="flex items-center gap-1 p-1 rounded-lg mb-4 w-fit" style={{
      backgroundColor: '#E2E8F0'
    }}>
      {(['bill', 'manual'] as const).map(mode => <button key={mode} type="button" onClick={() => setInputMode(mode)} className="relative px-4 py-1.5 rounded-md text-xs font-semibold transition-all" style={{
        color: inputMode === mode ? '#0B1E3D' : '#64748B',
        backgroundColor: inputMode === mode ? 'white' : 'transparent'
      }}>{mode === 'bill' ? '📄 Upload Bill' : '✏️ Manual Input'}</button>)}
    </div>

    {inputMode === 'bill' && <>
      <BillUpload
        onBillScraped={(data) => {
          if (data.customerName) {
            const parts = data.customerName.trim().split(/\s+/);
            setCustFirstName(parts[0] ?? '');
            setCustLastName(parts.slice(1).join(' ') ?? '');
          }
          if (data.address) setCustAddress(data.address);
          if (data.consumerNo) setCustConsumerNo(data.consumerNo);
          if (data.siteType) setSiteType(data.siteType);
          if (data.billingType) setBillingType(data.billingType);
          if (data.sanctionedLoad) {
            setCustSanctionLoad(data.sanctionedLoad);
            const kwMatch = data.sanctionedLoad.match(/(\d+\.?\d*)/);
            if (kwMatch && !systemCapacity) setSystemCapacity(kwMatch[1]);
          }
          setUploadedBill('scraped');
        }}
        onError={(err) => { alert(err); }}
      />
      <p className="text-xs mb-4" style={{ color: '#64748B' }}>After uploading, check and edit fields below if needed.</p>
    </>}

    {/* ── Customer Information ───────────────────────────────────── */}
    <div className="mb-4">
      <p className="text-xs font-bold mb-2.5" style={{ color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>Customer Information</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><FieldLabel>First Name</FieldLabel><Input value={custFirstName} onChange={e => setCustFirstName(e.target.value)} placeholder="Rajesh" /></div>
        <div><FieldLabel>Last Name</FieldLabel><Input value={custLastName} onChange={e => setCustLastName(e.target.value)} placeholder="Patil" /></div>
        <div><FieldLabel>Phone Number <span className="font-normal text-xs" style={{ color: '#94A3B8' }}>(manual)</span></FieldLabel><Input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="+91 98765 43210" /></div>
        <div><FieldLabel>Consumer No.</FieldLabel><Input value={custConsumerNo} onChange={e => setCustConsumerNo(e.target.value)} placeholder="MH042300123456" /></div>
      </div>
    </div>

    {/* ── Site Address ─────────────────────────────────────────── */}
    <div className="mb-4">
      <p className="text-xs font-bold mb-2.5" style={{ color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>Site Address</p>
      <div className="grid grid-cols-1 gap-3">
        <div><FieldLabel>Address</FieldLabel><textarea value={custAddress} onChange={e => setCustAddress(e.target.value)} rows={2} placeholder="Plot 12, Shivaji Nagar, Pune" className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ backgroundColor: 'white', border: '1.5px solid #E2E8F0', color: '#0B1E3D' }} /></div>
        <div><FieldLabel>Location (City, State)</FieldLabel><Input value={custLocation} onChange={e => setCustLocation(e.target.value)} placeholder="Pune, Maharashtra" /></div>
      </div>
    </div>

    {/* ── Connection Details ───────────────────────────────────── */}
    <div className="mb-4">
      <p className="text-xs font-bold mb-2.5" style={{ color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>Connection Details</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Site Type</FieldLabel>
          <select value={siteType} onChange={e => { setSiteType(e.target.value); setBillingType(''); }} className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none" style={{ backgroundColor: 'white', border: '1.5px solid #E2E8F0', color: siteType ? '#0B1E3D' : '#94A3B8', cursor: 'pointer' }}>
            <option value="">Select Site Type</option>
            {SITE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label} ({s.code})</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Billing Type</FieldLabel>
          <select value={billingType} onChange={e => {
            const newBillingType = e.target.value;
            setBillingType(newBillingType);
            setCustSanctionLoad('');
            const selectedBilling = (SITE_BILLING_MAP[siteType] || []).find(b => b.code === newBillingType);
            if (selectedBilling && !systemCapacity) {
              const PHASE_DEFAULTS: Record<string, number> = { '1-Phase': 3, '3-Phase': 5, '1/3-Phase': 3, '11kV+': 50 };
              setSystemCapacity((PHASE_DEFAULTS[selectedBilling.phase] || 3).toString());
            }
          }} className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none" style={{ backgroundColor: 'white', border: '1.5px solid #E2E8F0', color: billingType ? '#0B1E3D' : '#94A3B8', cursor: 'pointer' }}>
            <option value="">{siteType ? 'Select Billing Type' : 'Select Site Type first'}</option>
            {(SITE_BILLING_MAP[siteType] || []).map(b => <option key={b.code} value={b.code}>{b.label} ({b.phase})</option>)}
          </select>
        </div>
      </div>

      {/* PM Surya Ghar Notice */}
      {isPMSuryaEligible && <div className="mt-3 px-3 py-2.5 rounded-xl flex items-start gap-2.5" style={{ background: 'rgba(255,184,0,0.06)', border: '1.5px solid rgba(255,184,0,0.3)' }}>
          <Sun size={14} style={{ color: '#B45309', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
            <strong>Important:</strong> Only these categories are eligible for PM Surya Ghar Yojna: <strong>LT-I A</strong> (Residential 1-Phase Domestic), <strong>LT-I B</strong> (Residential 3-Phase Domestic), <strong>LT-I C</strong> (Commercial 1-Phase Small Business).
          </p>
        </div>}

      {/* Sanction Load */}
      <div className="mt-3">
        <FieldLabel>Sanction Load</FieldLabel>
        <div className="relative">
          <Zap size={13} className="pointer-events-none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', zIndex: 1 }} />
          <select value={custSanctionLoad} onChange={e => setCustSanctionLoad(e.target.value)} className="w-full pl-9 pr-8 py-2 rounded-lg text-sm outline-none appearance-none" style={{ backgroundColor: 'white', border: '1.5px solid #E2E8F0', color: custSanctionLoad ? '#0B1E3D' : '#94A3B8', cursor: 'pointer' }}>
            <option value="">Select Sanction Load</option>
            {filteredSanctionLoadOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label} {opt.phases.length === 1 ? `(${opt.phases[0]} only)` : ''}</option>)}
          </select>
          <ChevronDown size={13} className="pointer-events-none" style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        </div>
        {avgMonthlyUnits > 0 && !custSanctionLoad && (
          <p className="text-xs mt-1.5" style={{ color: '#64748B' }}>
            Based on avg {avgMonthlyUnits.toFixed(0)} units/month → <strong>{sanctionLoadKw} kW</strong>
          </p>
        )}
        {billingPhase !== 'both' && <p className="text-xs mt-1" style={{ color: '#7C5CFC' }}><span>Filtered for </span><strong>{billingPhase}</strong><span> billing — incompatible loads hidden</span></p>}
      </div>
    </div>

    {/* ── Monthly Units ─────────────────────────────────────────── */}
    <div className="mb-4">
      <p className="text-xs font-bold mb-2.5" style={{ color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>Monthly Units (Jan – Dec)</p>
      <div className="rounded-lg overflow-hidden" style={{ border: '1.5px solid #E2E8F0' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {['Month', 'Units', 'Month', 'Units'].map((h, hi) => <div key={`${h}-${hi}`} className="px-2 py-2 text-xs font-bold text-center" style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderLeft: hi > 0 ? '1px solid #E2E8F0' : 'none', color: '#0B1E3D' }}>{h}</div>)}
        </div>
        {[0, 1, 2, 3, 4, 5].map(row => {
          const m1 = BILLING_MONTHS[row];
          const m2 = BILLING_MONTHS[row + 6];
          return <div key={m1.id} className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: row < 5 ? '1px solid #F1F5F9' : 'none' }}>
            <div className="px-2 py-1.5 flex items-center"><span className="text-xs font-medium" style={{ color: '#374151' }}>{m1.label}</span></div>
            <div className="px-2 py-1" style={{ borderLeft: '1px solid #F1F5F9' }}>
              <input type="number" value={monthlyUnits[m1.id] || ''} onChange={e => setMonthlyUnits(prev => ({ ...prev, [m1.id]: e.target.value }))} className="w-full px-2 py-1 rounded text-xs outline-none text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0B1E3D' }} aria-label={`Units for ${m1.label}`} />
            </div>
            <div className="px-2 py-1.5 flex items-center" style={{ borderLeft: '1px solid #F1F5F9' }}><span className="text-xs font-medium" style={{ color: '#374151' }}>{m2.label}</span></div>
            <div className="px-2 py-1" style={{ borderLeft: '1px solid #F1F5F9' }}>
              <input type="number" value={monthlyUnits[m2.id] || ''} onChange={e => setMonthlyUnits(prev => ({ ...prev, [m2.id]: e.target.value }))} className="w-full px-2 py-1 rounded text-xs outline-none text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0B1E3D' }} aria-label={`Units for ${m2.label}`} />
            </div>
          </div>;
        })}
      </div>
      {avgMonthlyUnits > 0 && <div className="flex items-center gap-3 mt-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(30,77,183,0.06)', border: '1px solid rgba(30,77,183,0.15)' }}>
        <Zap size={13} style={{ color: '#1E4DB7', flexShrink: 0 }} />
        <p className="text-xs" style={{ color: '#1E4DB7' }}>
          <strong>Avg: {avgMonthlyUnits.toFixed(0)} units/month</strong>
          <span style={{ color: '#64748B' }}> · Suggested: {suggestedCapacity} kW</span>
        </p>
      </div>}
      {custSanctionLoad && <div className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(30,77,183,0.05)', border: '1px solid rgba(30,77,183,0.15)' }}>
        <Zap size={13} style={{ color: '#1E4DB7', flexShrink: 0 }} />
        <p className="text-xs" style={{ color: '#1E4DB7' }}>
          <strong>Sanction Load: {custSanctionLoad} kW</strong>
          <span style={{ color: '#64748B' }}> — will be compared against requested capacity in Step 2.</span>
        </p>
      </div>}
    </div>

    <div className="flex items-center justify-end mt-5 pt-4" style={{
      borderTop: '1px solid #F1F5F9'
    }}>
      <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => setQuotationStep(2)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{
        background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
      }}>
        <span>Next: System &amp; Site</span>
      </motion.button>
    </div>
  </div>;

  // ─── Step 2 ───────────────────────────────────────────────────────────────────

  const renderStep2 = () => <div>
    <div className="flex items-center gap-2 mb-4 overflow-x-auto">
      {STEP_LABELS.map((label, i) => <div key={label} className="flex items-center gap-2 flex-shrink-0">
        <StepBadge step={i + 1} current={quotationStep} label={label} />
        {i < STEP_LABELS.length - 1 && <div className="w-8 h-px hidden sm:block" style={{
          backgroundColor: quotationStep > i + 1 ? '#22C55E' : '#E2E8F0'
        }} />}
      </div>)}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold mb-3" style={{
            color: '#0B1E3D',
            letterSpacing: '-0.01em'
          }}>System Configuration</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Requested Load / Capacity</FieldLabel>
              <Select opts={CAPACITY_OPTIONS} value={systemCapacity} onChange={e => setSystemCapacity(e.target.value)} />
            </div>
            <div>
              <FieldLabel>System Type</FieldLabel>
              <div className="flex flex-col gap-1.5">
                {SYSTEM_TYPES.map(st => <button key={st.value} type="button" onClick={() => setSystemType(st.value)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
                  backgroundColor: systemType === st.value ? 'rgba(30,77,183,0.08)' : 'white',
                  border: `1.5px solid ${systemType === st.value ? '#1E4DB7' : '#E2E8F0'}`,
                  color: systemType === st.value ? '#1E4DB7' : '#374151'
                }}>
                  <div className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0" style={{
                    border: `2px solid ${systemType === st.value ? '#1E4DB7' : '#CBD5E1'}`,
                    backgroundColor: systemType === st.value ? '#1E4DB7' : 'transparent'
                  }}>
                    {systemType === st.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span>{st.label}</span>
                </button>)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold mb-3" style={{
            color: '#0B1E3D',
            letterSpacing: '-0.01em'
          }}>Site Specifications</p>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 items-end">
              <div><FieldLabel>Length (ft)</FieldLabel><Input type="number" min="0" value={areaLength} onChange={e => setAreaLength(e.target.value)} placeholder="0" /></div>
              <div><FieldLabel>Width (ft)</FieldLabel><Input type="number" min="0" value={areaWidth} onChange={e => setAreaWidth(e.target.value)} placeholder="0" /></div>
              <div><FieldLabel>Total Area</FieldLabel><Input value={totalArea ? `${totalArea} sq.ft` : ''} readOnly placeholder="Auto" style={{
                  backgroundColor: '#F0F4F8',
                  color: '#64748B'
                }} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Building Height (ft)</FieldLabel>
                <Input type="number" min="0" value={buildingHeight} onChange={e => {
                  const v = e.target.value;
                  if (parseFloat(v) < 0) return;
                  setBuildingHeight(v);
                }} placeholder="10" />
              </div>
              <div><FieldLabel>Roof Type</FieldLabel><Select opts={ROOF_OPTIONS} value={roofType} onChange={e => setRoofType(e.target.value)} /></div>
            </div>
          </div>
        </div>

        {systemCapacity && totalArea && <div className="rounded-xl overflow-hidden" style={{
          border: '1.5px solid #1E4DB7'
        }}>
          <div className="px-4 py-2.5 flex items-center gap-2" style={{
            backgroundColor: '#1E4DB7'
          }}>
            <Layers size={13} color="white" /><span className="text-xs font-bold text-white">Site Area Analysis</span>
          </div>
          <div className="px-4 py-3 space-y-2" style={{
            backgroundColor: 'rgba(30,77,183,0.03)'
          }}>
            <div className="flex justify-between items-center"><span className="text-xs" style={{
                color: '#374151'
              }}>No. of Panels</span><span className="text-xs font-bold" style={{
                color: '#0B1E3D'
              }}>{numPanels} × {panelInfo.name} ({panelInfo.wattage}W each)</span></div>
            <div className="flex justify-between items-center"><span className="text-xs" style={{
                color: '#374151'
              }}>Available Area (50% of total)</span><span className="text-xs font-bold" style={{
                color: '#22C55E'
              }}>{availableArea} sq.ft</span></div>
            <div className="flex justify-between items-center"><span className="text-xs" style={{
                color: '#374151'
              }}>System Area Required</span><span className="text-xs font-bold" style={{
                color: systemArea > availableAreaNum ? '#EF4444' : '#0B1E3D'
              }}>{systemArea} sq.ft</span></div>
            <div className="h-px" style={{
              backgroundColor: '#DBEAFE'
            }} />
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold" style={{
                color: '#374151'
              }}>Shortfall</span>
              {parseFloat(shortfall) > 0 ? <div className="flex items-center gap-1.5"><AlertCircle size={12} style={{
                  color: '#EF4444'
                }} /><span className="text-xs font-bold" style={{
                  color: '#EF4444'
                }}>{shortfall} sq.ft</span></div> : <div className="flex items-center gap-1.5"><Check size={12} style={{
                  color: '#22C55E'
                }} /><span className="text-xs font-bold" style={{
                  color: '#22C55E'
                }}>None — Area sufficient</span></div>}
            </div>
          </div>
        </div>}

        {needsSanctionUpgrade && <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style={{
          background: 'rgba(251,146,60,0.08)',
          border: '1.5px solid rgba(251,146,60,0.3)'
        }}>
          <AlertTriangle size={14} style={{
            color: '#F97316',
            flexShrink: 0,
            marginTop: 1
          }} />
          <p className="text-xs leading-relaxed" style={{
            color: '#C2410C'
          }}>
            <strong>Requested System Capacity is {systemCapacity}.</strong>
            <span> You will need to get the sanction load updated from MSEB (currently {custSanctionLoad} kW).</span>
          </p>
        </div>}
      </div>

      <div>
        <p className="text-xs font-bold mb-3" style={{
          color: '#0B1E3D',
          letterSpacing: '-0.01em'
        }}>Select Panel Type</p>
        <div className="rounded-lg overflow-hidden" style={{
          border: '1.5px solid #E2E8F0'
        }}>
          <div className="grid px-0" style={{
            gridTemplateColumns: '30px 1fr 100px 120px'
          }}>
            {['', 'Panel Type', 'Wattage', 'Dimensions'].map(h => <div key={h} className="px-3 py-2 text-xs font-bold" style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1.5px solid #E2E8F0',
              color: '#0B1E3D'
            }}>{h}</div>)}
          </div>
          {PANEL_ROWS.map((panel, idx) => <div key={panel.id} onClick={() => setSelectedPanel(panel.id)} className="grid items-center cursor-pointer" style={{
            gridTemplateColumns: '30px 1fr 100px 120px',
            borderBottom: idx < PANEL_ROWS.length - 1 ? '1px solid #F1F5F9' : 'none',
            backgroundColor: selectedPanel === panel.id ? 'rgba(30,77,183,0.04)' : 'white'
          }}>
            <div className="flex items-center justify-center py-3">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{
                border: '2px solid #1E4DB7',
                backgroundColor: selectedPanel === panel.id ? '#1E4DB7' : 'transparent'
              }}>
                {selectedPanel === panel.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-xs font-bold" style={{
                color: '#0B1E3D'
              }}>{panel.name}</p>
              <p className="text-xs" style={{
                color: '#94A3B8'
              }}>{panel.areaSqFt} sq.ft/panel</p>
            </div>
            <div className="px-2 py-2.5"><p className="text-xs" style={{
                color: '#374151'
              }}>{panel.wattageRange}</p></div>
            <div className="px-2 py-2.5"><p className="text-xs" style={{
                color: '#374151'
              }}>{panel.dimensions}</p></div>
          </div>)}
        </div>

        {/* Panel Count Control */}
        {custSanctionLoad && (
          <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-lg" style={{
            backgroundColor: 'rgba(30,77,183,0.04)',
            border: '1.5px solid #E2E8F0'
          }}>
            <div>
              <span className="text-xs font-bold" style={{ color: '#0B1E3D' }}>Panels Required: </span>
              <span className="text-xs font-bold" style={{ color: '#1E4DB7' }}>{numPanels}</span>
              <span className="text-xs" style={{ color: '#64748B' }}> (based on {custSanctionLoad} kW sanction load)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={panelCount}
                onChange={(e) => {
                  setManualPanelOverride(true);
                  setPanelCount(parseInt(e.target.value) || 0);
                }}
                className="border rounded px-2 py-1 w-16 text-xs text-center outline-none"
                style={{
                  borderColor: '#E2E8F0',
                  backgroundColor: 'white'
                }}
                min={1}
              />
              {manualPanelOverride && (
                <button
                  onClick={() => setManualPanelOverride(false)}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* Required Area Info */}
        {numPanels > 0 && (
          <div className="mt-2 px-3 py-2 rounded-lg" style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0'
          }}>
            <span className="text-xs" style={{ color: '#64748B' }}>Required Area: </span>
            <span className="text-xs font-semibold" style={{ color: '#0B1E3D' }}>
              {(numPanels * panelInfo.areaSqFt).toFixed(1)} sq ft
            </span>
            <span className="text-xs" style={{ color: '#94A3B8' }}> ({numPanels} panels × {panelInfo.areaSqFt} sq ft/panel)</span>
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center justify-between mt-5 pt-4" style={{
      borderTop: '1px solid #F1F5F9'
    }}>
      <button onClick={() => setQuotationStep(1)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{
        backgroundColor: '#F1F5F9',
        color: '#64748B',
        border: '1.5px solid #E2E8F0'
      }}><ArrowLeft size={14} /><span>Back</span></button>
      <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => setQuotationStep(3)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{
        background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
      }}>
        <span>Next: Analysis &amp; ROI</span>
      </motion.button>
    </div>
  </div>;

  // ─── Step 3 ───────────────────────────────────────────────────────────────────

  const renderStep3 = () => <div>
    <div className="flex items-center gap-2 mb-4 overflow-x-auto">
      {STEP_LABELS.map((label, i) => <div key={label} className="flex items-center gap-2 flex-shrink-0">
        <StepBadge step={i + 1} current={quotationStep} label={label} />
        {i < STEP_LABELS.length - 1 && <div className="w-8 h-px hidden sm:block" style={{
          backgroundColor: quotationStep > i + 1 ? '#22C55E' : '#E2E8F0'
        }} />}
      </div>)}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Bill Analysis Column */}
      <div>
        <p className="text-xs font-bold mb-3" style={{
          color: '#0B1E3D'
        }}>Bill Analysis</p>
        <div className="rounded-xl overflow-hidden" style={{
          backgroundColor: 'white',
          border: '1.5px solid #1E4DB7'
        }}>
          <div className="px-4 py-2.5" style={{
            backgroundColor: '#1E4DB7'
          }}>
            <p className="text-xs font-bold text-white">Customer Summary</p>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            {[{
              label: 'First Name',
              value: custFirstName || '—'
            }, {
              label: 'Last Name',
              value: custLastName || '—'
            }, {
              label: 'Consumer No.',
              value: custConsumerNo || '—',
              highlight: true
            }, {
              label: 'Sanction Load',
              value: custSanctionLoad ? `${custSanctionLoad} kW` : '—'
            }, {
              label: 'Avg Monthly Units',
              value: avgMonthlyUnits > 0 ? avgMonthlyUnits.toFixed(0) + ' units' : '—',
              highlight: true
            }, {
              label: 'Suggested Capacity',
              value: `${suggestedCapacity} kW`,
              green: true
            }, {
              label: 'Requested Load',
              value: systemCapacity || '—'
            }, {
              label: 'System Type',
              value: systemType
            }, {
              label: 'Panel',
              value: panelInfo.name
            }].map(r => <div key={r.label} className="flex justify-between items-center">
              <span className="text-xs" style={{
                color: '#374151'
              }}>{r.label}</span>
              <span className="text-xs font-semibold" style={{
                color: (r as {
                  highlight?: boolean;
                  green?: boolean;
                }).highlight ? '#1E4DB7' : (r as {
                  highlight?: boolean;
                  green?: boolean;
                }).green ? '#22C55E' : '#0B1E3D'
              }}>{r.value}</span>
            </div>)}
          </div>
          {needsSanctionUpgrade && <div className="mx-3 mb-3 flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{
            background: 'rgba(251,146,60,0.08)',
            border: '1.5px solid rgba(251,146,60,0.3)'
          }}>
            <AlertTriangle size={13} style={{
              color: '#F97316',
              flexShrink: 0,
              marginTop: 1
            }} />
            <p className="text-xs leading-relaxed" style={{
              color: '#C2410C'
            }}>
              <strong>Requested System Capacity is {systemCapacity}.</strong>
              <span> You will need to get the sanction load updated from MSEB.</span>
            </p>
          </div>}
        </div>

        {systemCapacity && numPanels > 0 && <div className="mt-3 rounded-xl overflow-hidden" style={{
          border: '1.5px solid #E8EDF5'
        }}>
          <div className="px-4 py-2 flex items-center gap-2" style={{
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0'
          }}>
            <Layers size={12} style={{
              color: '#1E4DB7'
            }} /><span className="text-xs font-bold" style={{
              color: '#0B1E3D'
            }}>Site Area Analysis</span>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            {[{
              label: 'No. of Panels',
              value: `${numPanels} × ${panelInfo.wattage}W`
            }, {
              label: 'Available Area',
              value: `${availableArea || '—'} sq.ft`,
              green: true
            }, {
              label: 'System Area',
              value: `${systemArea} sq.ft`,
              red: systemArea > availableAreaNum
            }, {
              label: 'Shortfall',
              value: parseFloat(shortfall) > 0 ? `${shortfall} sq.ft` : 'None',
              red: parseFloat(shortfall) > 0,
              green2: parseFloat(shortfall) <= 0
            }].map(r => <div key={r.label} className="flex justify-between items-center">
              <span className="text-xs font-bold" style={{
                color: '#374151'
              }}>{r.label}</span>
              <span className="text-xs font-bold" style={{
                color: (r as {
                  red?: boolean;
                  green?: boolean;
                  green2?: boolean;
                }).red ? '#EF4444' : (r as {
                  red?: boolean;
                  green?: boolean;
                  green2?: boolean;
                }).green || (r as {
                  red?: boolean;
                  green?: boolean;
                  green2?: boolean;
                }).green2 ? '#22C55E' : '#0B1E3D'
              }}>{r.value}</span>
            </div>)}
          </div>
        </div>}

        {/* Carbon Footprint - Step 3 */}
        {systemKw > 0 && <div className="mt-3 rounded-xl p-3 flex items-center gap-3" style={{
          background: 'rgba(34,197,94,0.06)',
          border: '1.5px solid rgba(34,197,94,0.2)'
        }}>
          <Leaf size={16} style={{
            color: '#16A34A',
            flexShrink: 0
          }} />
          <div>
            <p className="text-xs font-bold" style={{
              color: '#15803D'
            }}>Carbon Footprint Saved</p>
            <p className="text-sm font-bold" style={{
              color: '#15803D'
            }}>{carbonFootprintSaved} <span className="text-xs font-normal">tonnes CO₂/yr</span></p>
          </div>
        </div>}
      </div>

      {/* Additional Expenses */}
      <div>
        <p className="text-xs font-bold mb-3" style={{
          color: '#0B1E3D'
        }}>Additional Expenses</p>
        <div className="rounded-xl p-4 space-y-3" style={{
          backgroundColor: 'white',
          border: '1.5px solid #E8EDF5'
        }}>
          {expenseItems.map(item => <div key={item.key} className="flex items-center justify-between gap-3">
            <span className="text-xs flex-1" style={{
              color: '#374151'
            }}>{item.label}</span>
            <div className="relative">
              <span className="text-xs font-medium" style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }}>₹</span>
              <input type="number" min="0" value={expenseValues[item.key]} onChange={e => setExpenseValues(prev => ({
                ...prev,
                [item.key]: e.target.value
              }))} placeholder={item.isDefault ? '0' : '—'} disabled={!item.isDefault} className="w-28 pl-6 pr-3 py-2 rounded-lg text-xs outline-none text-right" style={{
                backgroundColor: item.isDefault ? '#F1F5F9' : '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                color: item.isDefault ? '#374151' : '#0B1E3D'
              }} aria-label={item.label} />
            </div>
          </div>)}
          <div className="flex items-center justify-between gap-3 pt-2" style={{
            borderTop: '1px solid #E2E8F0'
          }}>
            <span className="text-xs font-bold" style={{
              color: '#0B1E3D'
            }}>Total Expenses</span>
            <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{
              backgroundColor: '#0B1E3D',
              color: 'white',
              minWidth: 112,
              textAlign: 'right'
            }}>
              {totalOtherExpenses > 0 ? '₹' + totalOtherExpenses.toLocaleString('en-IN') : '₹ 0'}
            </div>
          </div>
        </div>

        {/* System Cost Input */}
        <div className="mt-4 rounded-xl p-4 space-y-3" style={{
          backgroundColor: 'white',
          border: '1.5px solid #E8EDF5'
        }}>
          <p className="text-xs font-bold" style={{
            color: '#0B1E3D'
          }}>Cost Configuration</p>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <FieldLabel>System Base Cost (₹)</FieldLabel>
              <Tooltip text="This is the Cost to Business — the total amount your business spends to procure and install this system.">
                <Info size={12} style={{
                  color: '#94A3B8',
                  cursor: 'help'
                }} />
              </Tooltip>
            </div>
            <div className="relative">
              <span className="text-xs" style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }}>₹</span>
              <input type="number" min="0" value={systemCostManual} onChange={e => setSystemCostManual(e.target.value)} placeholder={`Auto: ₹${(systemKw * 45000).toLocaleString('en-IN')}`} className="w-full pl-6 pr-3 py-2 rounded-lg text-sm outline-none" style={{
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                color: '#0B1E3D'
              }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <FieldLabel>Unit Rate (₹/unit)</FieldLabel>
                <Tooltip text={`Auto-calculated: Total Cost ÷ Total Watts = ₹${autoUnitRate}/W`}>
                  <Info size={12} style={{
                    color: '#94A3B8',
                    cursor: 'help'
                  }} />
                </Tooltip>
              </div>
              <input type="number" min="0" value={unitRate} onChange={e => setUnitRate(e.target.value)} placeholder="Auto" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                color: '#0B1E3D'
              }} />
              {totalWatts > 0 && <p className="text-xs mt-0.5" style={{
                color: '#7C5CFC'
              }}>Auto: <strong>₹{autoUnitRate}/W</strong></p>}
            </div>
            <div>
              <FieldLabel>Cash Back / Subsidy (₹)</FieldLabel>
              <div className="relative">
                <span className="text-xs" style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8'
                }}>₹</span>
                <input type="number" min="0" value={subsidyAmount} onChange={e => setSubsidyAmount(e.target.value)} placeholder="78000" className="w-full pl-6 pr-3 py-2 rounded-lg text-sm outline-none" style={{
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  color: '#0B1E3D'
                }} />
              </div>
            </div>
          </div>
          {/* Subsidy disclaimer */}
          <div className="px-3 py-2.5 rounded-xl flex items-start gap-2" style={{
            background: 'rgba(255,184,0,0.06)',
            border: '1px solid rgba(255,184,0,0.2)'
          }}>
            <Info size={12} style={{
              color: '#B45309',
              flexShrink: 0,
              marginTop: 1
            }} />
            <p className="text-xs leading-relaxed" style={{
              color: '#92400E'
            }}>
              Customer pays the total chargeable amount to the vendor. The Govt credits the Cash Back directly to the customer in ~45 days.
            </p>
          </div>
        </div>

        {/* Bank Loan */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold" style={{
              color: '#0B1E3D'
            }}>Bank Loan (Optional)</p>
            <button type="button" onClick={() => setLoanEnabled(v => !v)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium" style={{
              backgroundColor: loanEnabled ? 'rgba(30,77,183,0.08)' : '#F1F5F9',
              border: `1.5px solid ${loanEnabled ? '#1E4DB7' : '#E2E8F0'}`,
              color: loanEnabled ? '#1E4DB7' : '#64748B'
            }}>
              <div className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{
                backgroundColor: loanEnabled ? '#1E4DB7' : 'white',
                border: `1.5px solid ${loanEnabled ? '#1E4DB7' : '#CBD5E1'}`
              }}>
                {loanEnabled && <Check size={9} color="white" />}
              </div>
              <span>Enable Loan</span>
            </button>
          </div>
          {loanEnabled && <div className="rounded-xl p-4 space-y-2.5" style={{
            border: '1.5px solid #1E4DB7',
            backgroundColor: 'rgba(30,77,183,0.02)'
          }}>
            <div className="px-4 py-2.5 flex items-center gap-2" style={{
              backgroundColor: '#1E4DB7'
            }}>
              <Banknote size={13} color="white" />
              <span className="text-xs font-bold text-white">Bank Loan Calculation</span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              {[{
                label: 'Loan Amount',
                value: `₹${loanValues.amount}`
              }, {
                label: 'Total Payable to Bank',
                value: `₹${loanValues.payable}`
              }, {
                label: 'EMI / Month',
                value: `₹${loanValues.emi}`,
                bold: true
              }].map(r => <div key={r.label} className="flex justify-between items-center">
                  <span className="text-xs" style={{
                  color: '#374151'
                }}>{r.label}</span>
                  <span className="text-xs font-bold" style={{
                  color: (r as {
                    bold?: boolean;
                  }).bold ? '#1E4DB7' : '#0B1E3D'
                }}>{r.value}</span>
                </div>)}
            </div>
          </div>}
        </div>
      </div>

      {/* ROI Calculation */}
      <div>
        <p className="text-xs font-bold mb-3" style={{
          color: '#0B1E3D'
        }}>ROI Calculation</p>

        <div className="rounded-xl overflow-hidden" style={{
          border: '1.5px solid #1E4DB7'
        }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{
            background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
          }}>
            <TrendingUp size={14} color="white" />
            <span className="text-xs font-bold text-white">Return on Investment</span>
          </div>
          <div className="p-4 space-y-2" style={{
            backgroundColor: 'rgba(30,77,183,0.02)'
          }}>
            {[{
              label: 'Monthly Generation',
              value: `≈ ${monthlyGeneration} units`,
              color: '#15803D',
              bg: 'rgba(34,197,94,0.07)'
            }, {
              label: 'Monthly Savings',
              value: fmtINR(monthlySavings),
              color: '#15803D',
              bg: 'rgba(34,197,94,0.07)'
            }, {
              label: 'Annual Savings',
              value: fmtINR(annualSavings),
              color: '#15803D',
              bg: 'rgba(34,197,94,0.07)'
            }].map(item => <div key={item.label} className="flex justify-between items-center py-1.5 px-3 rounded-lg" style={{
              backgroundColor: item.bg
            }}>
              <span className="text-xs" style={{
                color: '#374151'
              }}>{item.label}</span>
              <span className="text-xs font-bold" style={{
                color: item.color
              }}>{item.value}</span>
            </div>)}

            <div className="h-px my-1" style={{
              backgroundColor: '#E2E8F0'
            }} />

            {[{
              label: 'Total Net Investment',
              value: fmtINR(systemCostTotal),
              color: '#0B1E3D'
            }, {
              label: 'Cash Back (Subsidy)',
              value: `– ${fmtINR(subsidyAmountNum)}`,
              color: '#E8533A'
            }, {
              label: 'Actual Amount Invested',
              value: fmtINR(actualInvestment),
              color: '#1E4DB7'
            }].map(item => <div key={item.label} className="flex justify-between items-center px-1 py-0.5">
              <span className="text-xs" style={{
                color: '#374151'
              }}>{item.label}</span>
              <span className="text-xs font-bold" style={{
                color: item.color
              }}>{item.value}</span>
            </div>)}

            <div className="h-px my-1" style={{
              backgroundColor: '#E2E8F0'
            }} />

            <div className="px-3 py-3 rounded-xl" style={{
              background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
            }}>
              <p className="text-xs text-white opacity-70 mb-0.5">Your Payback Period is</p>
              <p className="text-xl font-bold text-white" style={{
                letterSpacing: '-0.03em'
              }}>{paybackYears} yrs {paybackMonths} mo</p>
            </div>

            <div className="px-3 py-2.5 rounded-xl" style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1.5px solid rgba(34,197,94,0.2)'
            }}>
              <p className="text-xs mb-0.5" style={{
                color: '#64748B'
              }}>Total Profitable / Free Years</p>
              <p className="text-base font-bold" style={{
                color: '#15803D'
              }}>{freeYears} yrs {freeMonths} mo</p>
            </div>

            <div className="px-3 py-2.5 rounded-xl" style={{
              background: 'rgba(255,184,0,0.08)',
              border: '1.5px solid rgba(255,184,0,0.25)'
            }}>
              <p className="text-xs mb-0.5" style={{
                color: '#64748B'
              }}>Total Years of Saving Amount</p>
              <p className="text-base font-bold" style={{
                color: '#B45309'
              }}>{totalSavingYears} yrs {totalSavingMonths} mo</p>
            </div>

            <div className="px-3 py-2.5 rounded-xl" style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(30,77,183,0.08) 100%)',
              border: '1.5px solid rgba(34,197,94,0.2)'
            }}>
              <p className="text-xs mb-0.5" style={{
                color: '#64748B'
              }}>Estimated Total Savings (25 yrs)</p>
              <p className="text-base font-bold" style={{
                color: '#0B1E3D'
              }}>{totalSavingsRange}</p>
            </div>

            {/* Carbon Footprint in ROI */}
            {systemKw > 0 && <div className="px-3 py-2.5 rounded-xl flex items-center gap-2" style={{
              background: 'rgba(34,197,94,0.06)',
              border: '1.5px solid rgba(34,197,94,0.18)'
            }}>
              <Leaf size={13} style={{
                color: '#16A34A',
                flexShrink: 0
              }} />
              <div>
                <p className="text-xs" style={{
                  color: '#64748B'
                }}>Carbon Footprint Saved</p>
                <p className="text-sm font-bold" style={{
                  color: '#15803D'
                }}>{carbonFootprintSaved} <span className="text-xs font-normal">t CO₂/yr</span></p>
              </div>
            </div>}
          </div>
        </div>

        {/* Business Summary at final step */}
        <div className="mt-4 rounded-xl overflow-hidden" style={{
          border: '1.5px solid #E8EDF5'
        }}>
          <div className="px-4 py-2.5 flex items-center gap-2" style={{
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0'
          }}>
            <BarChart3 size={13} style={{
              color: '#0B1E3D'
            }} />
            <span className="text-xs font-bold" style={{
              color: '#0B1E3D'
            }}>Business Summary</span>
          </div>
          <div className="p-4 space-y-2">
            {(() => {
              const costPerWB = totalWatts > 0 ? (systemCostTotal / totalWatts).toFixed(2) : '—';
              const quotedPrice = systemCostTotal * 1.2;
              const costPerWC = totalWatts > 0 ? (quotedPrice / totalWatts).toFixed(2) : '—';
              const profit = quotedPrice - systemCostTotal;
              const profitPct = systemCostTotal > 0 ? (profit / systemCostTotal * 100).toFixed(1) : '0';
              const isProfit = parseFloat(profitPct) >= profitThreshold;
              return <div className="space-y-2">
                  {[{
                  label: 'Cost/Watt (Business)',
                  value: `₹${costPerWB}/W`
                }, {
                  label: 'Cost/Watt (Customer)',
                  value: `₹${costPerWC}/W`
                }, {
                  label: 'Projected Profit',
                  value: fmtINR(Math.round(profit))
                }, {
                  label: 'Profit Margin',
                  value: `${profitPct}%`
                }].map(r => <div key={r.label} className="flex flex-col px-3 py-2 rounded-lg" style={{
                  backgroundColor: 'white',
                  border: '1px solid #F1F5F9'
                }}>
                    <span className="text-xs" style={{
                    color: '#64748B'
                  }}>{r.label}</span>
                    <span className="text-xs font-bold" style={{
                    color: '#0B1E3D'
                  }}>{r.value}</span>
                  </div>)}
                  <div className="px-3 py-2.5 rounded-xl flex items-center gap-2.5" style={{
                  backgroundColor: isProfit ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
                  border: `1.5px solid ${isProfit ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
                }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{
                    backgroundColor: isProfit ? '#22C55E' : '#EF4444'
                  }}>
                      {isProfit ? <Check size={11} color="white" /> : <X size={11} color="white" />}
                    </div>
                    <p className="text-xs font-bold" style={{
                    color: isProfit ? '#15803D' : '#DC2626'
                  }}>
                      {isProfit ? 'PROFITABLE' : 'NON-PROFITABLE'} — {profitPct}% margin
                    </p>
                  </div>
                </div>;
            })()}
          </div>
        </div>

        {loanEnabled && loanValues.emi && <div className="mt-3 rounded-xl overflow-hidden" style={{
          border: '1.5px solid #E8EDF5'
        }}>
          <div className="px-4 py-2 flex items-center gap-2" style={{
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0'
          }}>
            <Banknote size={12} style={{
              color: '#1E4DB7'
            }} /><span className="text-xs font-bold" style={{
              color: '#0B1E3D'
            }}>Bank Loan Summary</span>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            {[{
              label: 'Loan Amount',
              value: `₹${loanValues.amount}`
            }, {
              label: 'Total Payable',
              value: `₹${loanValues.payable}`
            }, {
              label: 'EMI / Month',
              value: `₹${loanValues.emi}`,
              bold: true
            }].map(r => <div key={r.label} className="flex justify-between items-center">
              <span className="text-xs" style={{
                color: '#374151'
              }}>{r.label}</span>
              <span className="text-xs font-bold" style={{
                color: (r as {
                  bold?: boolean;
                }).bold ? '#1E4DB7' : '#0B1E3D'
              }}>{r.value}</span>
            </div>)}
          </div>
        </div>}
      </div>
    </div>

    <div className="flex items-center justify-between mt-5 pt-4" style={{
      borderTop: '1px solid #F1F5F9'
    }}>
      <button onClick={() => setQuotationStep(2)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{
        backgroundColor: '#F1F5F9',
        color: '#64748B',
        border: '1.5px solid #E2E8F0'
      }}><ArrowLeft size={14} /><span>Back</span></button>
      <div className="flex items-center gap-3">
        <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={() => setDownloadModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{
          background: 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)'
        }}>
          <Download size={14} /><span>Download PDF</span>
        </motion.button>
        <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={handleSaveQuotation} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
        }}>
          <Check size={14} /><span>Save Quotation</span>
        </motion.button>
      </div>
    </div>
  </div>;
  const renderCreateQuotation = () => <div>
    <PageHeader title="New Quotation" subtitle="Create a professional solar proposal for your customer" />
    <AnimatePresence mode="wait">
      <motion.div key={quotationStep} initial={{
        opacity: 0,
        x: 12
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: -12
      }} transition={{
        duration: 0.18
      }}>
        {quotationStep === 1 && renderStep1()}
        {quotationStep === 2 && renderStep2()}
        {quotationStep === 3 && renderStep3()}
      </motion.div>
    </AnimatePresence>
  </div>;

  // ─── Dashboard ────────────────────────────────────────────────────────────────

  const filteredQuotations = quotations.filter(q => {
    if (dashboardFilter === 'approved') return q.approved;
    if (dashboardFilter === 'pending') return !q.approved;
    return true;
  });
  const renderDashboard = () => <div>
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-lg font-bold" style={{
          color: '#0B1E3D',
          letterSpacing: '-0.02em'
        }}>Dashboard</h2>
        <p className="text-xs" style={{
          color: '#94A3B8'
        }}>Welcome back, {userProfile.fullName.split(' ')[0] || 'Admin'}</p>
      </div>
      <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => {
        setActiveSection('createQuotation');
        setQuotationStep(1);
      }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0" style={{
        background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
      }}>
        <Plus size={14} /><span>New Quotation</span>
      </motion.button>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <KpiCard label="Total Quotations" value={String(quotations.length)} sub="All time" gradient="linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)" icon={<ClipboardList size={17} color="white" />} />
      <KpiCard label="Approved" value={String(approvedQuotations.length)} sub="Quick-approved" gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" icon={<CheckSquare size={17} color="white" />} />
      <KpiCard label="Deleted" value={String(deletedCount)} sub="Removed from system" gradient="linear-gradient(135deg, #E8533A 0%, #C8392A 100%)" icon={<Trash2 size={17} color="white" />} />
      <KpiCard label="CO₂ Saved" value={`${totalCO2Saved.toFixed(1)}t`} sub="From approved quotes" gradient="linear-gradient(135deg, #22C55E 0%, #059669 100%)" icon={<Leaf size={17} color="white" />} />
    </div>

    {/* Loading / Error State */}
    {isLoading && <div className="flex items-center justify-center py-12 gap-3" style={{
      background: 'white',
      border: '1px solid #E8EDF5',
      borderRadius: 12,
      marginBottom: 20
    }}>
      <Loader2 size={20} className="animate-spin" style={{ color: '#1E4DB7' }} />
      <span className="text-sm font-medium" style={{ color: '#64748B' }}>Loading data...</span>
    </div>}

    {fetchError && !isLoading && <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5" style={{
      background: 'rgba(239,68,68,0.06)',
      border: '1.5px solid rgba(239,68,68,0.25)'
    }}>
      <AlertCircle size={14} style={{ color: '#EF4444', flexShrink: 0 }} />
      <span className="text-xs" style={{ color: '#DC2626' }}>Failed to load data: {fetchError}</span>
    </div>}

    {!isLoading && <>{/* Donut + CO2 Widget Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <div className="rounded-xl p-5" style={{
        background: 'white',
        border: '1px solid #E8EDF5',
        boxShadow: '0 2px 8px rgba(11,30,61,0.04)'
      }}>
        <p className="text-xs font-bold mb-4" style={{
          color: '#0B1E3D'
        }}>Quotation Status</p>
        <DonutChart total={quotations.length} approved={approvedQuotations.length} />
      </div>
      <div className="rounded-xl p-5" style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(5,150,105,0.07) 100%)',
        border: '1.5px solid rgba(34,197,94,0.25)'
      }}>
        <div className="flex items-center gap-2 mb-2">
          <Leaf size={15} style={{
            color: '#16A34A'
          }} />
          <p className="text-xs font-bold" style={{
            color: '#15803D'
          }}>Total CO₂ Saved (Approved)</p>
        </div>
        <p className="text-3xl font-bold" style={{
          color: '#15803D',
          letterSpacing: '-0.04em'
        }}>{totalCO2Saved.toFixed(2)}</p>
        <p className="text-sm font-medium mt-0.5" style={{
          color: '#64748B'
        }}>tonnes CO₂ / year</p>
        <p className="text-xs mt-2" style={{
          color: '#94A3B8'
        }}>Based on {approvedQuotations.length} approved installation{approvedQuotations.length !== 1 ? 's' : ''} · EF = 0.71 kg CO₂/kWh</p>
      </div>
    </div>

    <div className="rounded-xl overflow-hidden" style={{
      background: 'white',
      border: '1px solid #E8EDF5',
      boxShadow: '0 2px 12px rgba(11,30,61,0.05)'
    }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{
        borderBottom: '1px solid #F1F5F9'
      }}>
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold" style={{
            color: '#0B1E3D'
          }}>Quotation List</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
            backgroundColor: '#F1F5F9',
            color: '#64748B'
          }}>{filteredQuotations.length}</span>
        </div>
        {/* Quick Filters */}
        <div className="flex items-center gap-1.5">
          <Filter size={12} style={{
            color: '#94A3B8'
          }} />
          {(['all', 'approved', 'pending'] as DashboardFilter[]).map(f => <button key={f} onClick={() => setDashboardFilter(f)} className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all" style={{
            backgroundColor: dashboardFilter === f ? '#0B1E3D' : '#F8FAFC',
            color: dashboardFilter === f ? 'white' : '#64748B',
            border: `1px solid ${dashboardFilter === f ? '#0B1E3D' : '#E2E8F0'}`
          }}>{f}</button>)}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid px-4 py-2.5 text-xs font-semibold uppercase tracking-widest" style={{
        gridTemplateColumns: '1fr 80px 120px 130px 110px 130px 40px',
        backgroundColor: '#F8FAFC',
        color: '#94A3B8',
        letterSpacing: '0.06em'
      }}>
        <span>Customer</span>
        <span>System</span>
        <span>Location</span>
        <span>Date & Time</span>
        <span>Final Quotation Amt</span>
        <span>Actions</span>
        <span>✓</span>
      </div>

      <AnimatePresence>
        {filteredQuotations.map((row, i) => <motion.div key={row.id} layout initial={{
          opacity: 0,
          y: -4
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.16
        }} className="grid items-center px-4 py-2.5" style={{
          gridTemplateColumns: '1fr 80px 120px 130px 110px 130px 40px',
          borderBottom: i < filteredQuotations.length - 1 ? '1px solid #F8FAFC' : 'none',
          backgroundColor: row.approved ? 'rgba(34,197,94,0.03)' : 'transparent'
        }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{
              background: row.approved ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' : 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)',
              color: 'white'
            }}>{row.firstName.charAt(0)}</div>
            <span className="text-xs font-semibold" style={{
              color: '#0B1E3D'
            }}>{row.firstName} {row.lastName}</span>
          </div>
          <span className="text-xs font-medium" style={{
            color: '#1E4DB7'
          }}>{row.systemCapacity || '—'}</span>
          <div className="flex items-center gap-1">
            <MapPin size={10} style={{
              color: '#94A3B8',
              flexShrink: 0
            }} />
            <span className="text-xs truncate" style={{
              color: '#64748B'
            }}>{row.location || '—'}</span>
          </div>
          <span className="text-xs" style={{
            color: '#64748B'
          }}>{row.dateTime}</span>
          <span className="text-xs font-bold" style={{
            color: '#0B1E3D'
          }}>{row.amount}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewingQuotation(row)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold" style={{
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              border: '1px solid #BFDBFE'
            }}><Eye size={11} /><span>View</span></button>
            <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold" style={{
              backgroundColor: '#F0FDF4',
              color: '#15803D',
              border: '1px solid #86EFAC'
            }}><RefreshCw size={11} /></button>
            <button onClick={() => deleteQuotation(row.id)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA'
            }}><Trash2 size={11} /></button>
          </div>
          {/* Quick Approve Checkbox */}
          <button onClick={() => toggleApprove(row.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all" style={{
            backgroundColor: row.approved ? 'rgba(34,197,94,0.12)' : '#F8FAFC',
            border: `2px solid ${row.approved ? '#22C55E' : '#CBD5E1'}`,
            color: row.approved ? '#16A34A' : '#CBD5E1'
          }} aria-label={row.approved ? 'Unapprove' : 'Approve'}>
            {row.approved && <Check size={12} />}
          </button>
        </motion.div>)}
      </AnimatePresence>

      {filteredQuotations.length === 0 && <div className="flex flex-col items-center justify-center py-12">
        <ClipboardList size={28} style={{
          color: '#CBD5E1'
        }} />
        <p className="text-sm font-semibold mt-3" style={{
          color: '#94A3B8'
        }}>{dashboardFilter === 'all' ? 'No quotations yet' : `No ${dashboardFilter} quotations`}</p>
        {dashboardFilter === 'all' && <button onClick={() => {
          setActiveSection('createQuotation');
          setQuotationStep(1);
        }} className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{
          background: 'linear-gradient(135deg, #1E4DB7 0%, #1E3A8A 100%)'
        }}><Plus size={13} /><span>Create First Quotation</span></button>}
      </div>}
    </div>
    </>}
  </div>;

  // ─── Pricing ──────────────────────────────────────────────────────────────────

  const renderPricing = () => <div>
    <PageHeader title="Pricing Setup" subtitle="Configure material pricing and upload component price lists" />
    <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit" style={{
      backgroundColor: '#E2E8F0'
    }}>
      {(['setup', 'pricing'] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className="relative px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all" style={{
        color: activeTab === tab ? '#0B1E3D' : '#64748B',
        backgroundColor: activeTab === tab ? 'white' : 'transparent',
        boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
      }}>
        {tab === 'setup' ? 'Upload Setup' : 'Price List'}
      </button>)}
    </div>

    {activeTab === 'setup' ? <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs" style={{
          color: '#64748B'
        }}>Upload pricing data per kilowatt &amp; phase configuration</p>
        <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{
          background: 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)'
        }}><Download size={13} /><span>Download Template</span></motion.button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-xl overflow-hidden" style={{
          background: 'white',
          border: '1.5px solid #E8EDF5'
        }}>
          <div className="grid" style={{
            gridTemplateColumns: '1fr 1fr 90px'
          }}>
            {['Kilowatt', 'Phase', ''].map(h => <div key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{
              color: '#0B1E3D',
              backgroundColor: '#F8FAFC',
              borderBottom: '1.5px solid #E8EDF5'
            }}>{h}</div>)}
          </div>
          {setupRows.map((row, i) => <div key={row.kw} className="grid items-center" style={{
            gridTemplateColumns: '1fr 1fr 90px',
            borderBottom: i < setupRows.length - 1 ? '1px solid #F1F5F9' : 'none'
          }}>
            <div className="px-4 py-3"><span className="text-sm font-semibold" style={{
                color: '#0B1E3D'
              }}>{row.kw} kW</span></div>
            <div className="px-3 py-2"><Select opts={[{
                value: '1-Phase',
                label: '1-Phase'
              }, {
                value: '3-Phase',
                label: '3-Phase'
              }]} value={row.phase} onChange={e => handleSetupPhaseChange(row.kw, e.target.value as PhaseOption)} /></div>
            <div className="px-2 py-2 flex justify-center"><motion.button whileHover={{
                scale: 1.04
              }} whileTap={{
                scale: 0.96
              }} onClick={() => handleSetupUpload(row.kw)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{
                background: 'linear-gradient(135deg, #E8533A 0%, #C8392A 100%)'
              }}>Upload</motion.button></div>
          </div>)}
        </div>
        <div className="rounded-xl overflow-hidden" style={{
          background: 'white',
          border: '1.5px solid #E8EDF5'
        }}>
          <div className="grid" style={{
            gridTemplateColumns: '90px 1fr'
          }}>
            {['Kilowatt', 'Status'].map(h => <div key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{
              color: '#0B1E3D',
              backgroundColor: '#F8FAFC',
              borderBottom: '1.5px solid #E8EDF5'
            }}>{h}</div>)}
          </div>
          {statusRows.map((row, i) => <div key={row.kw} className="grid items-center" style={{
            gridTemplateColumns: '90px 1fr',
            borderBottom: i < statusRows.length - 1 ? '1px solid #F1F5F9' : 'none',
            minHeight: 48
          }}>
            <div className="px-4 py-2"><span className="text-sm font-semibold" style={{
                color: '#0B1E3D'
              }}>{row.kw} kW</span></div>
            <div className="px-3 py-2 flex items-center gap-3 flex-wrap">
              {row.single !== null && <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium" style={{
                  color: '#374151'
                }}>Single</span>
                {row.single.status === 'complete' ? <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{
                  backgroundColor: '#22C55E'
                }}><Check size={9} color="white" /></div> : <span className="text-xs font-bold" style={{
                  color: '#E8533A'
                }}>Pending</span>}
                <button onClick={() => handleEditStatus(row.kw, 'single')} className="w-5 h-5 rounded flex items-center justify-center" style={{
                  color: '#64748B'
                }}><Edit3 size={10} /></button>
                <button onClick={() => handleDeleteStatus(row.kw, 'single')} className="w-5 h-5 rounded flex items-center justify-center" style={{
                  color: '#94A3B8'
                }}><Trash2 size={10} /></button>
              </div>}
              {row.single !== null && row.threePhase !== null && <div className="w-px h-4" style={{
                backgroundColor: '#E2E8F0'
              }} />}
              {row.threePhase !== null && <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium" style={{
                  color: '#374151'
                }}>3-Phase</span>
                {row.threePhase.status === 'complete' ? <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{
                  backgroundColor: '#22C55E'
                }}><Check size={9} color="white" /></div> : <span className="text-xs font-bold" style={{
                  color: '#E8533A'
                }}>Pending</span>}
                <button onClick={() => handleEditStatus(row.kw, 'threePhase')} className="w-5 h-5 rounded flex items-center justify-center" style={{
                  color: '#64748B'
                }}><Edit3 size={10} /></button>
                <button onClick={() => handleDeleteStatus(row.kw, 'threePhase')} className="w-5 h-5 rounded flex items-center justify-center" style={{
                  color: '#94A3B8'
                }}><Trash2 size={10} /></button>
              </div>}
            </div>
          </div>)}
        </div>
      </div>
    </div> : <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {(['all', 'single', 'three'] as const).map(f => <button key={f} onClick={() => setPhaseFilter(f)} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{
            backgroundColor: phaseFilter === f ? '#0B1E3D' : 'white',
            color: phaseFilter === f ? 'white' : '#64748B',
            border: '1px solid',
            borderColor: phaseFilter === f ? '#0B1E3D' : '#E2E8F0'
          }}>
            {f === 'all' ? 'All' : f === 'single' ? '1-Phase' : '3-Phase'}
          </button>)}
        </div>
        <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={handleAddRow} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{
          background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)'
        }}><Plus size={13} /><span>Add Row</span></motion.button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{
        background: 'white',
        border: '1px solid #E8EDF5'
      }}>
        <div className="grid px-4 py-3 text-xs font-semibold uppercase tracking-widest" style={{
          color: '#94A3B8',
          gridTemplateColumns: '80px 80px 1fr 1fr 1fr 1fr 1fr 80px 60px',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #F1F5F9'
        }}>
          <span>kW</span><span>Phase</span><span>Panel</span><span>Inverter</span><span>Structure</span><span>Cable</span><span>Other</span><span>Total</span><span></span>
        </div>
        {visibleRows.map((row, i) => {
          const isEditing = editingRow === row.id;
          const rowData = isEditing ? editBuffer as PricingRow : row;
          const total = (rowData.panelCost || 0) + (rowData.inverterCost || 0) + (rowData.structureCost || 0) + (rowData.cableCost || 0) + (rowData.otherCost || 0);
          return <div key={row.id} onClick={() => !isEditing && setSelectedBoqKey(`${row.capacity}_${row.phase === 'single' ? '1Ph' : '3Ph'}`)} className="grid items-center px-4 py-2.5 text-xs cursor-pointer" style={{
            gridTemplateColumns: '80px 80px 1fr 1fr 1fr 1fr 1fr 80px 60px',
            borderBottom: i < visibleRows.length - 1 ? '1px solid #F8FAFC' : 'none',
            backgroundColor: isEditing ? 'rgba(255,184,0,0.03)' : 'transparent'
          }}>
            {isEditing ? <React.Fragment>
              <select value={editBuffer.capacity} onChange={e => setEditBuffer(b => ({
                ...b,
                capacity: e.target.value
              }))} className="text-xs rounded px-1.5 py-1 outline-none w-full" style={{
                border: '1.5px solid #FFB800',
                color: '#0B1E3D'
              }}>{PRICING_CAPACITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <select value={editBuffer.phase} onChange={e => setEditBuffer(b => ({
                ...b,
                phase: e.target.value as PhaseType
              }))} className="text-xs rounded px-1.5 py-1 outline-none w-full" style={{
                border: '1.5px solid #FFB800',
                color: '#0B1E3D'
              }}><option value="single">1-Ph</option><option value="three">3-Ph</option></select>
              {(['panelCost', 'inverterCost', 'structureCost', 'cableCost', 'otherCost'] as const).map(field => <input key={field} type="number" value={editBuffer[field] || ''} onChange={e => setEditBuffer(b => ({
                ...b,
                [field]: Number(e.target.value)
              }))} className="text-xs rounded px-1.5 py-1 outline-none w-full" style={{
                border: '1.5px solid #FFB800',
                color: '#0B1E3D'
              }} />)}
              <span className="text-xs font-bold" style={{
                color: '#0B1E3D'
              }}>{formatINR(total)}</span>
              <div className="flex items-center gap-1">
                <button onClick={handlePricingSave} className="w-6 h-6 rounded flex items-center justify-center" style={{
                  backgroundColor: '#F0FDF4',
                  color: '#22C55E'
                }}><Save size={11} /></button>
                <button onClick={() => setEditingRow(null)} className="w-6 h-6 rounded flex items-center justify-center" style={{
                  backgroundColor: '#FEF2F2',
                  color: '#EF4444'
                }}><X size={11} /></button>
              </div>
            </React.Fragment> : <React.Fragment>
              <span className="font-bold" style={{
                color: '#0B1E3D'
              }}>{row.capacity}</span>
              <span><span className="px-1.5 py-0.5 rounded-full text-xs font-medium" style={{
                  backgroundColor: row.phase === 'single' ? '#EFF6FF' : '#F0FDF4',
                  color: row.phase === 'single' ? '#1D4ED8' : '#15803D'
                }}>{row.phase === 'single' ? '1-Ph' : '3-Ph'}</span></span>
              {[row.panelCost, row.inverterCost, row.structureCost, row.cableCost, row.otherCost].map((v, vi) => <span key={vi} style={{
                color: '#374151'
              }}>{formatINR(v)}</span>)}
              <span className="font-bold" style={{
                color: '#0B1E3D'
              }}>{formatINR(total)}</span>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); handlePricingEdit(row); }} className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100" style={{
                  color: '#64748B'
                }}><Edit3 size={11} /></button>
                <button onClick={(e) => { e.stopPropagation(); handlePricingDelete(row.id); }} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50" style={{
                  color: '#EF4444'
                }}><Trash2 size={11} /></button>
              </div>
            </React.Fragment>}
          </div>;
        })}
      </div>
    </div>}
  </div>;

  // ─── Other Expenses ────────────────────────────────────────────────────────────

  const renderOtherExpenses = () => {
    return <div>
      <PageHeader title="Other Expenses" subtitle="Configure default additional expense categories" />
      <div className="rounded-xl p-5 max-w-lg" style={{
        background: 'white',
        border: '1px solid #E8EDF5'
      }}>
        <p className="text-xs font-bold mb-4" style={{
          color: '#0B1E3D'
        }}>Default Expense Categories</p>
        <p className="text-xs mb-4" style={{
          color: '#64748B'
        }}>
          Check <strong>"Set as Default"</strong> to pre-fill these amounts in every new quotation. Unchecked items stay empty for manual entry.
        </p>
        <div className="space-y-3">
          {expenseItems.map(item => <div key={item.key} className="flex items-center gap-3 py-2" style={{
            borderBottom: '1px solid #F8FAFC'
          }}>
            <button onClick={() => setExpenseItems(prev => prev.map(e => e.key === item.key ? {
              ...e,
              isDefault: !e.isDefault
            } : e))} className="flex items-center gap-1.5 flex-shrink-0" aria-label={`Set ${item.label} as default`}>
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{
                backgroundColor: item.isDefault ? '#1E4DB7' : 'white',
                border: `1.5px solid ${item.isDefault ? '#1E4DB7' : '#CBD5E1'}`
              }}>
                {item.isDefault && <Check size={9} color="white" />}
              </div>
              <span className="text-xs font-medium" style={{
                color: item.isDefault ? '#1E4DB7' : '#94A3B8'
              }}>Default</span>
            </button>
            <span className="text-sm flex-1" style={{
              color: '#374151'
            }}>{item.label}</span>
            <div className="relative">
              <span className="text-xs" style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }}>₹</span>
              <input type="number" min="0" value={settingsExpenseValues[item.key]} onChange={e => setSettingsExpenseValues(prev => ({
                ...prev,
                [item.key]: e.target.value
              }))} placeholder={item.isDefault ? '0' : '—'} disabled={!item.isDefault} className="w-32 pl-6 pr-3 py-2 rounded-lg text-sm outline-none text-right" style={{
                backgroundColor: item.isDefault ? '#F1F5F9' : '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                color: item.isDefault ? '#374151' : '#CBD5E1'
              }} aria-label={item.label} />
            </div>
          </div>)}
        </div>
        <motion.button whileHover={{
          scale: 1.01
        }} whileTap={{
          scale: 0.98
        }} className="w-full py-2.5 rounded-xl text-xs font-bold text-white mt-5" style={{
          background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)'
        }}>
          <span>Save Defaults</span>
        </motion.button>
        <div className="mt-4 p-3 rounded-xl" style={{
          background: 'rgba(30,77,183,0.03)',
          border: '1px solid rgba(30,77,183,0.12)'
        }}>
          <p className="text-xs font-bold mb-1" style={{
            color: '#1E4DB7'
          }}>How this works</p>
          <p className="text-xs" style={{
            color: '#374151'
          }}>Items marked as Default are pre-filled automatically in new quotation Step 3. Override per quotation anytime.</p>
          <p className="text-xs mt-1" style={{
            color: '#374151'
          }}>The Business Summary is shown in Step 3 of the quotation generator.</p>
        </div>
      </div>
    </div>;
  };

  // ─── Simple Settings ──────────────────────────────────────────────────────────

  const renderSimpleSettings = (title: string, subtitle: string, fields: {
    label: string;
    placeholder: string;
    type?: string;
  }[]) => <div>
    <PageHeader title={title} subtitle={subtitle} />
    <div className="rounded-xl p-5 max-w-lg" style={{
      background: 'white',
      border: '1px solid #E8EDF5'
    }}>
      <div className="space-y-3">
        {fields.map(({
          label,
          placeholder,
          type
        }) => <div key={label}>
          <FieldLabel>{label}</FieldLabel>
          <Input type={type || 'text'} placeholder={placeholder} />
        </div>)}
        <motion.button whileHover={{
          scale: 1.01
        }} whileTap={{
          scale: 0.98
        }} className="w-full py-2.5 rounded-xl text-xs font-bold text-white mt-2" style={{
          background: 'linear-gradient(135deg, #0B1E3D 0%, #133366 100%)'
        }}>
          <span>Save Settings</span>
        </motion.button>
      </div>
    </div>
  </div>;

  // ─── Section Map ──────────────────────────────────────────────────────────────

  const sectionRenderers: Record<NavSection, () => React.ReactNode> = {
    dashboard: renderDashboard,
    createQuotation: renderCreateQuotation,
    pricing: renderPricing,
    otherExpenses: renderOtherExpenses,
    gst: () => renderSimpleSettings('GST Settings', 'Configure GST rates and GSTIN details', [{
      label: 'GSTIN Number',
      placeholder: '27ABCDE1234F1Z5'
    }, {
      label: 'GST Rate (%)',
      placeholder: '18',
      type: 'number'
    }, {
      label: 'Business Legal Name',
      placeholder: 'Solar Swytch Pvt. Ltd.'
    }]),
    payment: () => renderSimpleSettings('Payment Settings', 'Bank and UPI payment configuration', [{
      label: 'Bank Name',
      placeholder: 'HDFC Bank'
    }, {
      label: 'Account Number',
      placeholder: '12345678901234'
    }, {
      label: 'IFSC Code',
      placeholder: 'HDFC0001234'
    }, {
      label: 'UPI ID',
      placeholder: 'solarswytch@hdfc'
    }]),
    technical: () => renderSimpleSettings('Technical Settings', 'Panel specs and system defaults', [{
      label: 'Default Panel Wattage (W)',
      placeholder: '540',
      type: 'number'
    }, {
      label: 'Performance Ratio (%)',
      placeholder: '75',
      type: 'number'
    }, {
      label: 'Peak Sun Hours (hr/day)',
      placeholder: '4.5',
      type: 'number'
    }, {
      label: 'System Losses (%)',
      placeholder: '14',
      type: 'number'
    }])
  };
  const activeLabel = navItems.find(n => n.id === activeSection)?.label ?? 'Dashboard';
  const mainContent = sectionRenderers[activeSection]();
  return <div className="min-h-screen w-full flex flex-col" style={{
    backgroundColor: '#F0F4F8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
  }}>
    {/* TOP HEADER */}
    <header className="w-full flex items-center justify-between px-5 lg:px-7 flex-shrink-0" style={{
      background: 'linear-gradient(90deg, #0B1E3D 0%, #133366 100%)',
      height: 54,
      boxShadow: '0 2px 12px rgba(11,30,61,0.2)',
      zIndex: 40
    }}>
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-1.5 rounded-lg" style={{
          backgroundColor: 'rgba(255,255,255,0.1)'
        }} onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar"><Menu size={17} color="white" /></button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
            background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)'
          }}><Sun size={15} color="white" /></div>
          <span className="font-bold text-white text-sm hidden sm:block" style={{
            letterSpacing: '-0.01em'
          }}>Solar Swytch</span>
        </div>
        <div className="w-px h-4 mx-1 hidden sm:block" style={{
          backgroundColor: 'rgba(255,255,255,0.15)'
        }} />
        <h1 className="text-xs font-semibold hidden sm:block" style={{
          color: 'rgba(255,255,255,0.65)'
        }}>{activeLabel}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg" style={{
          backgroundColor: 'rgba(255,255,255,0.08)'
        }} aria-label="Notifications">
          <Bell size={15} color="rgba(255,255,255,0.7)" />
          <span className="w-1.5 h-1.5 rounded-full" style={{
            position: 'absolute',
            top: 6,
            right: 6,
            backgroundColor: '#FFB800',
            display: 'block'
          }} />
        </button>
        <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 px-2 py-1 rounded-xl" style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.5)'
        }} aria-label="Open user profile">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden" style={{
            background: userProfile.logoPreview ? 'transparent' : 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)'
          }}>
            {userProfile.logoPreview ? <img src={userProfile.logoPreview} alt="Profile" className="w-full h-full object-cover" /> : <span style={{
              fontSize: 10
            }}>{initials}</span>}
          </div>
          <span className="text-xs font-semibold" style={{
            color: 'rgba(255,255,255,0.75)'
          }}>{userProfile.fullName.split(' ')[0] || 'Admin'}</span>
        </button>
        <button onClick={onLogout} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium" style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.08)'
        }} aria-label="Sign out"><LogOut size={12} /><span className="hidden sm:block ml-1">Logout</span></button>
      </div>
    </header>

    {/* BODY */}
    <div className="flex flex-1 min-h-0">
      {sidebarOpen && <div className="fixed inset-0 z-20 lg:hidden" style={{
        backgroundColor: 'rgba(0,0,0,0.3)'
      }} onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`flex-shrink-0 flex flex-col transition-transform duration-300 fixed lg:sticky top-[54px] left-0 z-30 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{
        width: 210,
        height: 'calc(100vh - 54px)',
        background: 'white',
        borderRight: '1px solid #E8EDF5'
      }}>
        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-4 mb-2 text-xs font-bold uppercase tracking-widest" style={{
            color: '#94A3B8',
            letterSpacing: '0.1em',
            fontSize: 10
          }}>Menu</p>
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return <button key={item.id} onClick={() => {
              setActiveSection(item.id);
              setSidebarOpen(false);
              if (item.id === 'createQuotation') setQuotationStep(1);
            }} className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-all" style={{
              color: isActive ? '#1E4DB7' : '#64748B',
              backgroundColor: isActive ? 'rgba(30,77,183,0.07)' : 'transparent',
              borderLeft: isActive ? '3px solid #1E4DB7' : '3px solid transparent',
              fontWeight: isActive ? 600 : 400
            }}>
              <span style={{
                color: isActive ? '#1E4DB7' : '#94A3B8'
              }}>{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>;
          })}
        </nav>
        <div className="px-3 pb-4 pt-2" style={{
          borderTop: '1px solid #F1F5F9'
        }}>
          <button onClick={() => setProfileOpen(true)} className="w-full flex items-center gap-2 mb-2 px-2 py-2 rounded-xl" style={{
            backgroundColor: 'rgba(30,77,183,0.04)',
            border: '1px solid rgba(30,77,183,0.08)'
          }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden" style={{
              background: userProfile.logoPreview ? 'transparent' : 'linear-gradient(135deg, #7C5CFC 0%, #9D7DFF 100%)'
            }}>
              {userProfile.logoPreview ? <img src={userProfile.logoPreview} alt="Profile" className="w-full h-full object-cover" /> : <span style={{
                fontSize: 10
              }}>{initials}</span>}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold truncate" style={{
                color: '#0B1E3D',
                fontSize: 11
              }}>{userProfile.fullName || 'Solar Owner'}</p>
              <p className="truncate" style={{
                color: '#1E4DB7',
                fontSize: 10
              }}>Edit Profile</p>
            </div>
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{
            color: '#94A3B8',
            backgroundColor: '#F8FAFC',
            border: '1px solid #F1F5F9'
          }}><LogOut size={12} /><span>Sign Out</span></button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-5 lg:px-7 py-5">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection + (activeSection === 'createQuotation' ? quotationStep : '')} initial={{
              opacity: 0,
              y: 8
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -8
            }} transition={{
              duration: 0.16
            }}>
              {mainContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>

    {/* USER PROFILE PANEL */}
    <AnimatePresence>
      {profileOpen && <UserProfilePanel profile={userProfile} onClose={() => setProfileOpen(false)} onSave={p => {
        onProfileUpdate(p);
        setProfileOpen(false);
      }} />}
    </AnimatePresence>

    {/* QUOTATION VIEW MODAL */}
    <AnimatePresence>
      {viewingQuotation && <QuotationViewModal quotation={viewingQuotation} onClose={() => setViewingQuotation(null)} onSave={updated => {
        updateQuotation(updated);
        setViewingQuotation(updated);
      }} />}
    </AnimatePresence>

    {/* DOWNLOAD PDF MODAL */}
    <AnimatePresence>
      {downloadModalOpen && <DownloadPdfModal onClose={() => setDownloadModalOpen(false)} quotationData={quotationPdfData} />}
    </AnimatePresence>

    {/* BOQ DRAWER */}
    <BoqDrawer
      open={selectedBoqKey !== null}
      onClose={() => setSelectedBoqKey(null)}
      boqKey={selectedBoqKey ?? ''}
      capacity={selectedBoqKey ? selectedBoqKey.replace(/_(1Ph|3Ph)$/, '') : ''}
      phase={selectedBoqKey?.endsWith('3Ph') ? '3-Phase' : '1-Phase'}
    />
  </div>;
};