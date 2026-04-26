import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import { Boq } from '../src/models/boq.model.js';
import type { IBoqRow } from '../src/models/boq.model.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/solar_swytch';

// ── Helper ────────────────────────────────────────────────────────────────────
function row(
  srNo: number, itemName: string, particulars: string,
  qty: number, unit: string, pricePerUnit: number,
  gstPct: number, dcr: boolean, nonDcr: boolean, rowType: IBoqRow['rowType']
): IBoqRow {
  const taxableAmount = parseFloat((qty * pricePerUnit).toFixed(2));
  const gstAmount = parseFloat((taxableAmount * gstPct / 100).toFixed(2));
  const totalAmount = parseFloat((taxableAmount + gstAmount).toFixed(2));
  return {
    srNo, itemName, particulars, quantity: qty, unit,
    pricePerUnit, taxableAmount, gstPercent: gstPct, gstAmount,
    totalAmount, perWatt: 0, withGstPerWatt: 0, dcr, nonDcr, rowType,
  };
}

// ── 3kW 1-Phase — exact data from Excel screenshot ─────────────────────────────
const DATA_3KW_1PH: IBoqRow[] = [
  // 1  Inverter — green
  row(1,  '3 KW 1 Ph Inverter',      'Growatt',                         1,  'Nos', 24000, 18, false, false, 'highlight'),
  // 2  Solar Panels — red (Non DCR)
  row(2,  'Solar Panels',              '540 W Mono PERC Tier-1',         6,  'Nos',  4600,  5, true,  false, 'highlight'),
  // 3  AC Cable — red text (qty/particulars in red in Excel)
  row(3,  'AC Cable',                  'AL Armored 4x16 Sq MM',          20, 'MTR',   220, 18, false, false, 'alert'),
  // 4  DC Cable 4Sq MM — green
  row(4,  'DC Cable',                  '4Sq MM Double Insulated',        50, 'MTR',    58, 18, false, false, 'main'),
  // 5  DC Cable 6Sq MM — green
  row(5,  'DC Cable',                  '6Sq MM Double Insulated',         20, 'MTR',    82, 18, false, false, 'main'),
  // 6  DCDB — green
  row(6,  'DCDB',                      '1 In 1 Out 600V with SPD',        1, 'Nos',  2400, 18, false, false, 'main'),
  // 7  ACDB — green
  row(7,  'ACDB',                      '1 Ph 1 to 6 KW',                 1, 'Nos',  2200, 18, false, false, 'main'),
  // 8  LA (Lightning Arrester) — green
  row(8,  'LA',                        'Solar DC SPD 1000V',              1, 'Nos',  1800, 18, false, false, 'main'),
  // 9  AC MCB — green
  row(9,  'Sch AC MCB',                '32 Amp 2 Pole',                   1, 'Nos',   340, 18, false, false, 'main'),
  // 10 MCB Box — green
  row(10, 'MCB Box 2 Pole',            'Surface Type',                    1, 'Nos',   280, 18, false, false, 'main'),
  // 11 Chemical Bag — green
  row(11, 'Chemical Bag',               '15 KG',                          3, 'Nos',   850,  5, false, false, 'main'),
  // 12 Earthing Rod — green
  row(12, 'Earthing Rod',               'Cu Bonded 18mm 3MTR',            3, 'Nos',  1200, 18, false, false, 'main'),
  // 13 Aluminium Earthing Cable — green
  row(13, 'Aluminium Earthing Cable',  '16 Sq MM 1C',                   15, 'MTR',   125, 18, false, false, 'main'),
  // 14 Earthing Patti — green
  row(14, 'Earthing Patti',            '25MM X 3MM GI 5FT',              3, 'Nos',   280, 18, false, false, 'main'),
  // 15 Green Earthing Cable — red text (alert in Excel)
  row(15, 'Green Earthing Cable',       '1 Core 16 Sq MM AL',            25, 'MTR',    48, 18, false, false, 'alert'),
  // 16 Insulators — green
  row(16, 'Insulators',                'Epoxy',                           3, 'Nos',    85, 18, false, false, 'main'),
  // 17 Cable Tray — red text
  row(17, 'Cable Tray',                '45x45 Perforated GI',             2, 'Nos',   460, 18, false, false, 'alert'),
  // 18 Aluminium Rail — green (part of structure)
  row(18, 'Aluminium Rail',            '41MM X 35MM 3.5MTR',            6, 'Nos',  1480, 18, false, false, 'main'),
  // 19 Big Mid Clamps — green
  row(19, 'Big Mid Clamps',            '35MM',                           12,'Nos',    46, 18, false, false, 'main'),
  // 20 Z Clamps — green (qty 8 was red-background in Excel)
  row(20, 'Z Clamps',                  '35MM End Clamp',                 8, 'Nos',    36, 18, false, false, 'main'),
  // 21 Allen Bolt — green
  row(21, 'Allen Bolt',                'M8 X 25MM SS',                  24, 'Nos',    18, 18, false, false, 'main'),
  // 22 Spring Nut — green
  row(22, 'Spring Nut',                'M8 SS',                          24, 'Nos',    12, 18, false, false, 'main'),
  // 23 Cable Tie — red text
  row(23, 'Cable Tie',                 '300MM UV Resistant',            50, 'Nos',     4, 18, false, false, 'alert'),
  // 24 Nut Bolt Washer — red text
  row(24, 'Nut Bolt Washer',            '25MM X 6MM Complete Set',      24, 'Nos',    15, 18, false, false, 'alert'),
  // 25 Conduit Pipe — red text
  row(25, 'Conduit Pipe',              '25MM PVC',                       20, 'MTR',    36, 18, false, false, 'alert'),
  // 26 Screws — red text
  row(26, 'Screws',                   'SS 8x1.5 Tek Screw',            100, 'Nos',     8, 18, false, false, 'alert'),
  // 27 Net Meter — orange/highlight total
  row(27, 'Net Meter',                 'Single Phase Bi-directional',     1, 'Nos',  5800,  0, false, false, 'highlight'),
  // 28 Generation Meter — green
  row(28, 'Generation Meter',          'AC Digital',                     1, 'Nos',  2300, 18, false, false, 'highlight'),
];

// ── Scale helper: build a BOQ for any kW / phase by scaling panel qty & cable ─
function scaleBoq(template: IBoqRow[], kw: number, is3Phase: boolean): IBoqRow[] {
  const scaleFactor = kw / 3;
  const panels = Math.ceil(6 * scaleFactor);
  const dcLen = Math.ceil(50 * scaleFactor);
  const acLen = Math.ceil(20 * (is3Phase ? 1.2 : 1));
  const invPrice = is3Phase
    ? 35000 + (kw - 5) * 3500
    : 22000 + (kw - 3) * 1200;
  const structPrice = is3Phase ? 14000 + (kw - 5) * 3000 : 8500 + (kw - 3) * 1000;
  const netMeterPrice = is3Phase ? 9000 : 5800;
  const genMeterPrice = is3Phase ? 3800 : 2300;

  return template.map(r => {
    const qty = (() => {
      if (r.itemName === 'Solar Panels') return panels;
      if (r.itemName === 'DC Cable' && r.particulars.includes('4Sq')) return dcLen;
      if (r.itemName === 'DC Cable' && r.particulars.includes('6Sq')) return Math.ceil(dcLen * 0.4);
      if (r.itemName === 'AC Cable') return acLen;
      if (r.itemName === 'Aluminium Earthing Cable') return Math.ceil(15 * scaleFactor);
      if (r.itemName === 'Green Earthing Cable') return Math.ceil(25 * scaleFactor);
      if (r.itemName === 'Conduit Pipe') return Math.ceil(20 * scaleFactor);
      if (r.itemName === 'Aluminium Rail') return Math.ceil(6 * scaleFactor);
      if (r.itemName === 'Big Mid Clamps') return Math.ceil(12 * scaleFactor);
      if (r.itemName === 'Z Clamps') return Math.ceil(8 * scaleFactor);
      if (r.itemName === 'Allen Bolt') return Math.ceil(24 * scaleFactor);
      if (r.itemName === 'Spring Nut') return Math.ceil(24 * scaleFactor);
      if (r.itemName === 'Nut Bolt Washer') return Math.ceil(24 * scaleFactor);
      if (r.itemName === 'Cable Tie') return Math.ceil(50 * scaleFactor);
      if (r.itemName === 'Net Meter') return 1;
      if (r.itemName === 'Generation Meter') return 1;
      return r.quantity;
    })();

    const pricePerUnit = (() => {
      if (r.itemName.includes('Inverter')) return invPrice;
      if (r.itemName === 'Solar Panels') return r.pricePerUnit;
      if (r.itemName === 'DCDB') return is3Phase ? 3600 : 2400;
      if (r.itemName === 'ACDB') return is3Phase ? 3200 : 2200;
      if (r.itemName === 'LA') return is3Phase ? 2400 : 1800;
      if (r.itemName === 'Sch AC MCB') return is3Phase ? 680 : 340;
      if (r.itemName === 'MCB Box 2 Pole') return is3Phase ? 420 : 280;
      if (r.itemName === 'Aluminium Rail') return is3Phase ? 1600 : 1480;
      if (r.itemName === 'Net Meter') return netMeterPrice;
      if (r.itemName === 'Generation Meter') return genMeterPrice;
      if (r.itemName === '3 KW 1 Ph Inverter') {
        return is3Phase ? invPrice : r.pricePerUnit;
      }
      return r.pricePerUnit;
    })();

    const taxableAmount = parseFloat((qty * pricePerUnit).toFixed(2));
    const gstAmount = parseFloat((taxableAmount * r.gstPercent / 100).toFixed(2));
    const totalAmount = parseFloat((taxableAmount + gstAmount).toFixed(2));

    return { ...r, srNo: r.srNo, quantity: qty, pricePerUnit, taxableAmount, gstAmount, totalAmount };
  });
}

// ── All BOQ configs ───────────────────────────────────────────────────────────
const CONFIGS: { boqKey: string; rows: IBoqRow[] }[] = [
  { boqKey: '3kW_1Ph', rows: DATA_3KW_1PH },
  { boqKey: '1kW_1Ph', rows: scaleBoq(DATA_3KW_1PH, 1, false) },
  { boqKey: '2kW_1Ph', rows: scaleBoq(DATA_3KW_1PH, 2, false) },
  { boqKey: '4kW_1Ph', rows: scaleBoq(DATA_3KW_1PH, 4, false) },
  { boqKey: '5kW_1Ph', rows: scaleBoq(DATA_3KW_1PH, 5, false) },
  { boqKey: '5kW_3Ph', rows: scaleBoq(DATA_3KW_1PH, 5, true) },
  { boqKey: '6kW_3Ph', rows: scaleBoq(DATA_3KW_1PH, 6, true) },
  { boqKey: '7kW_3Ph', rows: scaleBoq(DATA_3KW_1PH, 7, true) },
  { boqKey: '8kW_3Ph', rows: scaleBoq(DATA_3KW_1PH, 8, true) },
  { boqKey: '9kW_3Ph', rows: scaleBoq(DATA_3KW_1PH, 9, true) },
  { boqKey: '10kW_3Ph', rows: scaleBoq(DATA_3KW_1PH, 10, true) },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  for (const { boqKey, rows } of CONFIGS) {
    const total = rows.reduce((s, r) => s + r.totalAmount, 0);
    await Boq.findOneAndUpdate(
      { boqKey },
      { $set: { boqKey, rows } },
      { upsert: true, new: true }
    );
    const mainItems = rows.filter(r => r.rowType === 'main').length;
    const alertItems = rows.filter(r => r.rowType === 'alert').length;
    console.log(
      `✓ ${boqKey.padEnd(10)} | ${rows.length} rows (${mainItems} main, ${alertItems} alert) | Total: ₹${total.toLocaleString('en-IN')}`
    );
  }

  console.log('\n✅ Seed complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
