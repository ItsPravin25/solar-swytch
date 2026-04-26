import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, Package, RotateCcw, Save, Pencil, Check } from 'lucide-react';
import { boqApi } from '../../lib/api';
import type { BoqRow } from '../../settings/types';

interface Props {
  open: boolean;
  onClose: () => void;
  boqKey: string;
  capacity: string;
  phase: string;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const ROW_STYLE: Record<BoqRow['rowType'], { bg: string; border: string; text?: string; dot: string }> = {
  main:     { bg: '#F0FDF4', border: '#BBF7D0', dot: '#22C55E' },
  alert:    { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C', dot: '#EF4444' },
  highlight:{ bg: '#FFFFFF', border: '#FEF3C7', dot: '#F59E0B' },
};

const CATEGORY_LABELS: Record<string, string> = {
  inv:      'Inverter',
  panels:   'Solar Panels',
  elec:     'Electrical',
  protect:  'Protection',
  earth:    'Earthing',
  struct:   'Structure & Mounting',
  consum:   'Consumables',
  meter:    'Metering',
};

type Category = keyof typeof CATEGORY_LABELS;

function getCategory(itemName: string, srNo: number): Category {
  if (itemName.includes('Inverter')) return 'inv';
  if (itemName === 'Solar Panels') return 'panels';
  if (itemName.includes('AC Cable') || itemName.includes('DC Cable')) return 'elec';
  if (itemName.includes('DCDB') || itemName.includes('ACDB') || itemName.includes('LA') || itemName.includes('MCB') || itemName.includes('MCB Box')) return 'protect';
  if (itemName.includes('Earthing') || itemName.includes('Chemical') || itemName.includes('Insulator')) return 'earth';
  if (itemName.includes('Rail') || itemName.includes('Clamp') || itemName.includes('Bolt') || itemName.includes('Nut') || itemName.includes('Screw') || itemName.includes('Structure')) return 'struct';
  if (itemName.includes('Cable Tray') || itemName.includes('Conduit') || itemName.includes('Cable Tie')) return 'consum';
  return 'meter';
}

function calcRow(r: BoqRow): BoqRow {
  const taxableAmount = parseFloat((r.quantity * r.pricePerUnit).toFixed(2));
  const gstAmount = parseFloat((taxableAmount * r.gstPercent / 100).toFixed(2));
  const totalAmount = parseFloat((taxableAmount + gstAmount).toFixed(2));
  const watts = parseInt(r.srNo.toString()) > 0 ? 3000 : 3000; // will be overridden below
  return { ...r, taxableAmount, gstAmount, totalAmount, perWatt: 0, withGstPerWatt: 0 };
}

// ── Editable Cell ──────────────────────────────────────────────────────────────
interface EditableCellProps {
  value: number | string;
  onSave: (val: number) => void;
  isNumeric?: boolean;
  format?: (v: number) => string;
  label: string;
}

function EditableCell({ value, onSave, isNumeric = true, format, label }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const start = () => { setDraft(String(value)); setEditing(true); };
  const commit = () => {
    const n = parseFloat(draft);
    if (!isNaN(n) && n >= 0) onSave(n);
    setEditing(false);
  };
  const cancel = () => setEditing(false);

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          type="number"
          min={0}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
          onBlur={commit}
          className="w-full px-1.5 py-0.5 text-xs rounded outline-none"
          style={{ border: '1.5px solid #7C5CFC', color: '#0B1E3D', backgroundColor: '#F5F3FF', minWidth: 48 }}
        />
        <button onClick={commit} className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
          <Check size={10} />
        </button>
        <button onClick={cancel} className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}>
          <X size={10} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group">
      <button
        onClick={start}
        title={`Edit ${label}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 flex items-center justify-center rounded"
        style={{ color: '#94A3B8' }}
      >
        <Pencil size={9} />
      </button>
      <span className="text-xs cursor-pointer hover:underline" style={{ color: '#374151' }} title="Click pencil to edit">
        {isNumeric && typeof value === 'number' && format ? format(value) : value}
      </span>
    </div>
  );
}

// ── Row Renderer ────────────────────────────────────────────────────────────────
function BoqTableRow({ row, watts, onUpdate }: { row: BoqRow; watts: number; onUpdate: (updated: BoqRow) => void }) {
  const style = ROW_STYLE[row.rowType] ?? ROW_STYLE.main;
  const taxableAmount = parseFloat((row.quantity * row.pricePerUnit).toFixed(2));
  const gstAmount = parseFloat((taxableAmount * row.gstPercent / 100).toFixed(2));
  const totalAmount = parseFloat((taxableAmount + gstAmount).toFixed(2));
  const perWatt = watts > 0 ? totalAmount / watts : 0;
  const withGstPerWatt = perWatt;

  const update = (field: keyof BoqRow, val: number) => {
    const updated = { ...row, [field]: val };
    onUpdate(updated);
  };

  return (
    <tr
      style={{ backgroundColor: style.bg, borderLeft: `3px solid ${style.border}` }}
    >
      {/* Sr No */}
      <td className="px-2 py-1.5 text-xs" style={{ color: '#94A3B8', minWidth: 36 }}>
        {row.srNo}
      </td>
      {/* Item Name */}
      <td className="px-2 py-1.5 text-xs font-semibold" style={{ color: style.text ?? '#0B1E3D', minWidth: 140 }}>
        <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 mb-px" style={{ backgroundColor: style.dot, display: 'inline-block', verticalAlign: 'middle' }} />
        {row.itemName}
      </td>
      {/* Particulars */}
      <td className="px-2 py-1.5 text-xs" style={{ color: '#64748B', minWidth: 130 }}>
        {row.particulars}
      </td>
      {/* Qty — editable */}
      <td className="px-2 py-1.5 text-xs" style={{ minWidth: 80 }}>
        <EditableCell
          label="Quantity"
          value={row.quantity}
          onSave={v => update('quantity', v)}
          format={v => String(Math.round(v))}
        />
      </td>
      {/* Unit */}
      <td className="px-2 py-1.5 text-xs" style={{ color: '#64748B' }}>{row.unit}</td>
      {/* Rate — editable */}
      <td className="px-2 py-1.5 text-xs text-right" style={{ minWidth: 90 }}>
        <EditableCell
          label="Rate"
          value={row.pricePerUnit}
          onSave={v => update('pricePerUnit', v)}
          format={v => formatINR(v)}
        />
      </td>
      {/* Taxable */}
      <td className="px-2 py-1.5 text-xs text-right" style={{ color: '#374151' }}>{formatINR(taxableAmount)}</td>
      {/* GST % */}
      <td className="px-2 py-1.5 text-xs text-right" style={{ color: '#64748B' }}>{row.gstPercent}%</td>
      {/* GST Amt */}
      <td className="px-2 py-1.5 text-xs text-right" style={{ color: '#374151' }}>{formatINR(gstAmount)}</td>
      {/* Total */}
      <td className="px-2 py-1.5 text-xs text-right font-semibold" style={{
        color: row.rowType === 'highlight' ? '#D97706' : '#0B1E3D',
        backgroundColor: row.rowType === 'highlight' ? '#FEF3C7' : undefined,
        minWidth: 100
      }}>
        {formatINR(totalAmount)}
      </td>
      {/* Per W */}
      <td className="px-2 py-1.5 text-xs text-right" style={{ color: '#64748B' }}>₹{perWatt.toFixed(2)}</td>
      {/* With GST Per W */}
      <td className="px-2 py-1.5 text-xs text-right" style={{ color: '#64748B' }}>₹{withGstPerWatt.toFixed(2)}</td>
      {/* DCR */}
      <td className="px-2 py-1.5 text-xs text-center">{row.dcr ? <span className="px-1 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>Yes</span> : '—'}</td>
      {/* Non DCR */}
      <td className="px-2 py-1.5 text-xs text-center">{row.nonDcr ? <span className="px-1 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#EDE9FE', color: '#7C5CFC' }}>Yes</span> : '—'}</td>
    </tr>
  );
}

// ── Category group ─────────────────────────────────────────────────────────────
interface GroupProps {
  label: string;
  rows: BoqRow[];
  watts: number;
  onUpdate: (updated: BoqRow) => void;
  isEditing: boolean;
}

function CategoryGroup({ label, rows, watts, onUpdate, isEditing }: GroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const subtotal = rows.reduce((s, r) => {
    const t = parseFloat((r.quantity * r.pricePerUnit * (1 + r.gstPercent / 100)).toFixed(2));
    return s + t;
  }, 0);

  return (
    <>
      <tr
        onClick={() => setCollapsed(c => !c)}
        className="cursor-pointer"
        style={{ backgroundColor: '#0B1E3D' }}
      >
        <td colSpan={3} className="px-3 py-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.08em' }}>
          {label}
          <span className="ml-2 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {rows.length} item{rows.length !== 1 ? 's' : ''}
          </span>
        </td>
        <td className="px-2 py-2 text-xs text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {collapsed ? '▶' : '▼'}
        </td>
        <td colSpan={9} className="px-2 py-2 text-xs text-right font-semibold" style={{ color: '#FFB800' }}>
          {formatINR(subtotal)}
        </td>
      </tr>
      {!collapsed && rows.map(row => (
        <BoqTableRow key={row.srNo} row={row} watts={watts} onUpdate={onUpdate} />
      ))}
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function BoqDrawer({ open, onClose, boqKey, capacity, phase }: Props) {
  const [originalRows, setOriginalRows] = useState<BoqRow[]>([]);
  const [rows, setRows] = useState<BoqRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const watts = (() => {
    const m = boqKey.match(/^(\d+)kW/);
    return m ? parseInt(m[1]) * 1000 : 3000;
  })();

  useEffect(() => {
    if (!open || !boqKey) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    setHasChanges(false);
    boqApi.get(boqKey).then(res => {
      const fetched = (res as any).rows as BoqRow[];
      setOriginalRows(fetched);
      setRows(fetched);
      setLoading(false);
    }).catch(() => {
      setError(`BOQ not found for ${boqKey}. Run the seed script first.`);
      setLoading(false);
    });
  }, [open, boqKey]);

  const handleUpdate = useCallback((updated: BoqRow) => {
    setRows(prev => prev.map(r => r.srNo === updated.srNo ? updated : r));
    setHasChanges(true);
    setSaved(false);
  }, []);

  const handleReset = () => {
    setRows([...originalRows]);
    setHasChanges(false);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await boqApi.upsert(boqKey, rows);
      setOriginalRows([...rows]);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  // Group rows by category
  const grouped = rows.reduce<Record<Category, BoqRow[]>>((acc, r) => {
    const cat = getCategory(r.itemName, r.srNo);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {} as Record<Category, BoqRow[]>);

  const categoryOrder: Category[] = ['inv', 'panels', 'elec', 'protect', 'earth', 'struct', 'consum', 'meter'];
  const visibleCategories = categoryOrder.filter(c => grouped[c]?.length > 0);

  const grandTotal = rows.reduce((s, r) => {
    const t = parseFloat((r.quantity * r.pricePerUnit * (1 + r.gstPercent / 100)).toFixed(2));
    return s + t;
  }, 0);
  const originalTotal = originalRows.reduce((s, r) => {
    const t = parseFloat((r.quantity * r.pricePerUnit * (1 + r.gstPercent / 100)).toFixed(2));
    return s + t;
  }, 0);
  const totalDelta = grandTotal - originalTotal;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: 'min(880px, 98vw)', backgroundColor: '#FFFFFF', boxShadow: '-4px 0 28px rgba(0,0,0,0.18)' }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
              style={{ borderBottom: '1px solid #E8EDF5', backgroundColor: '#F8FAFC' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EDE9FE', color: '#7C5CFC' }}>
                  <Package size={17} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight" style={{ color: '#0B1E3D' }}>
                    BOQ Breakdown — {capacity} {phase}
                  </p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>
                    {boqKey} &nbsp;·&nbsp; {watts.toLocaleString()}W system &nbsp;·&nbsp;{' '}
                    <span style={{ color: '#7C5CFC' }}>Click any pencil to edit qty or rate</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ backgroundColor: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}
                    >
                      <RotateCcw size={11} /> Reset
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-60"
                      style={{ backgroundColor: '#22C55E' }}
                    >
                      {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </>
                )}
                {saved && !hasChanges && (
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#16A34A' }}>
                    <Check size={13} /> Saved
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  style={{ color: '#64748B' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-hidden flex flex-col">

              {/* Loading */}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={36} className="animate-spin" style={{ color: '#7C5CFC' }} />
                  <p className="text-sm" style={{ color: '#64748B' }}>Loading BOQ…</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
                    <AlertCircle size={26} style={{ color: '#EF4444' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#0B1E3D' }}>BOQ Not Found</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{error}</p>
                </div>
              )}

              {/* Table */}
              {!loading && !error && (
                <>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-xs" style={{ borderCollapse: 'collapse', minWidth: 920 }}>
                      {/* Sticky header */}
                      <thead className="sticky top-0 z-10" style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                        <tr>
                          {['#', 'Item Name', 'Particulars', 'Qty', 'Unit', 'Rate (₹)', 'Taxable', 'GST%', 'GST Amt', 'Total (₹)', 'Per W', 'W/GST W', 'DCR', 'Non DCR'].map((h, i) => (
                            <th key={i} className="px-2 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                              style={{ color: i === 5 || i >= 9 ? '#94A3B8' : '#64748B', textAlign: i >= 4 && i !== 12 && i !== 13 ? 'right' : 'left' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleCategories.map(cat => (
                          <CategoryGroup
                            key={cat}
                            label={CATEGORY_LABELS[cat]}
                            rows={grouped[cat]}
                            watts={watts}
                            onUpdate={handleUpdate}
                            isEditing={hasChanges}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Footer ── */}
                  <div
                    className="flex-shrink-0 px-5 py-4"
                    style={{ borderTop: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' }}
                  >
                    {/* Stats row */}
                    <div className="flex items-center gap-5 mb-3 flex-wrap">
                      {([
                        { label: 'Items', value: rows.length, color: '#0B1E3D' },
                        { label: 'Main', value: rows.filter(r => r.rowType === 'main').length, color: '#16A34A' },
                        { label: 'Highlight', value: rows.filter(r => r.rowType === 'highlight').length, color: '#D97706' },
                        { label: 'Alert', value: rows.filter(r => r.rowType === 'alert').length, color: '#EF4444' },
                      ] as const).map(({ label, value, color }) => (
                        <div key={label}>
                          <p className="text-xs" style={{ color: '#94A3B8' }}>{label}</p>
                          <p className="text-sm font-bold" style={{ color }}>{value}</p>
                        </div>
                      ))}

                      <div className="flex-1" />

                      {hasChanges && totalDelta !== 0 && (
                        <div className="text-right">
                          <p className="text-xs" style={{ color: '#94A3B8' }}>Original Total</p>
                          <p className="text-sm font-semibold line-through" style={{ color: '#94A3B8' }}>{formatINR(originalTotal)}</p>
                        </div>
                      )}
                    </div>

                    {/* Total row */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs" style={{ color: '#94A3B8' }}>
                        Per watt (ex-GST): <strong style={{ color: '#64748B' }}>₹{(grandTotal / watts).toFixed(2)}/W</strong>
                        {hasChanges && totalDelta !== 0 && (
                          <span className="ml-3" style={{ color: totalDelta > 0 ? '#EF4444' : '#16A34A' }}>
                            ({totalDelta > 0 ? '+' : ''}{formatINR(totalDelta)} from original)
                          </span>
                        )}
                      </p>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: '#94A3B8' }}>Grand Total</p>
                        <p className="text-xl font-black" style={{ color: '#0B1E3D' }}>{formatINR(grandTotal)}</p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>incl. GST</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
