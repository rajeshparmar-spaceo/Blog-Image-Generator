import type { BrandConfig, BrandId, SoiSize } from '../types';

export const BRAND_CONFIGS: Record<BrandId, BrandConfig> = {
  mcb: {
    id: 'mcb',
    label: 'MCB (Monocubed)',
    primaryColor: '#2B7DE9',
    secondaryColor: '#1A5CB8',
    fontFamily: 'Poppins',
    logoPath: './logos/mcb/MCB-Logo-circle.png',
    canvasWidth: 1000,
    canvasHeight: 500,
    variants: [
      { key: 'typeA', label: 'Type A — Icon Badge' },
      { key: 'typeB', label: 'Type B — Logo Grid' },
      { key: 'typeD', label: 'Type D — Feature List' },
    ],
  },
  soa: {
    id: 'soa',
    label: 'SOA (Smash of Apps)',
    primaryColor: '#2ECC71',
    secondaryColor: '#27AE60',
    fontFamily: 'Poppins',
    logoPath: './logos/soa/SOA-Logo-circle.png',
    canvasWidth: 708,
    canvasHeight: 374,
    variants: [
      { key: 'typeA', label: 'Type A — Icon Badge' },
      { key: 'typeB', label: 'Type B — Logo Grid' },
      { key: 'typeD', label: 'Type D — Feature List' },
    ],
  },
  soc: {
    id: 'soc',
    label: 'SOC (Smash of Codes)',
    primaryColor: '#E74C3C',
    secondaryColor: '#C0392B',
    fontFamily: 'Poppins',
    logoPath: './logos/soc/SOC-Logo-circle.png',
    canvasWidth: 1416,
    canvasHeight: 748,
    variants: [
      { key: 'typeA', label: 'Type A — Icon Badge' },
      { key: 'typeB', label: 'Type B — Logo Grid' },
      { key: 'typeD', label: 'Type D — Feature List' },
    ],
  },
  soi: {
    id: 'soi',
    label: 'SOI (Smash of Infos)',
    primaryColor: '#A3C423',
    secondaryColor: '#7EA31B',
    fontFamily: 'Poppins',
    logoPath: './logos/soi/SOI-Logo-circle.png',
    canvasWidth: 708,
    canvasHeight: 374,
    variants: [
      { key: 'typeA', label: 'Type A — Icon Badge' },
      { key: 'typeB', label: 'Type B — Logo Grid' },
      { key: 'typeD', label: 'Type D — Feature List' },
    ],
  },
  taskrhino: {
    id: 'taskrhino',
    label: 'TaskRhino',
    primaryColor: '#7C3AED',
    secondaryColor: '#6D28D9',
    fontFamily: 'Inter',
    logoPath: './logos/taskrhino/TaskRhino-dark-text.png',
    canvasWidth: 1365,
    canvasHeight: 640,
    variants: [
      { key: 'typeA', label: 'Type A — UI Cards' },
      { key: 'typeB', label: 'Type B — Dashboard' },
      { key: 'typeC', label: 'Type C — Timeline' },
    ],
  },
  welco: {
    id: 'welco',
    label: 'Welco',
    primaryColor: '#004CE6',
    secondaryColor: '#0040C7',
    fontFamily: 'Inter',
    logoPath: './logos/welco/Welco-Logo-Dark.png',
    canvasWidth: 800,
    canvasHeight: 600,
    variants: [
      { key: 'typeA1', label: 'Type A1 — Chat Scene' },
      { key: 'typeA2', label: 'Type A2 — Chat + Caller' },
      { key: 'typeB1', label: 'Type B1 — Logo Circles' },
      { key: 'typeB2', label: 'Type B2 — Icon Scatter' },
    ],
  },
};

export function getBrandCanvasSize(brandId: BrandId, soiSize: SoiSize = 'standard') {
  if (brandId === 'soi' && soiSize === 'wide') {
    return { width: 1400, height: 748 };
  }
  const cfg = BRAND_CONFIGS[brandId];
  return { width: cfg.canvasWidth, height: cfg.canvasHeight };
}

export const BRAND_ORDER: BrandId[] = ['mcb', 'soa', 'soc', 'soi', 'taskrhino', 'welco'];
