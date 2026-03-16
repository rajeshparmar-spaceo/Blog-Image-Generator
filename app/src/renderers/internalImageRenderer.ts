import type { ImageOpportunity } from '../types';
import { BRAND_CONFIGS } from '../constants/brands';
import type { BrandId } from '../types';
import { drawSharedIllustration } from './sharedIllustrations';
import { wrapText } from '../utils/wrapText';

export function renderInternalImage(
  ctx: CanvasRenderingContext2D,
  opportunity: ImageOpportunity,
  brandId: BrandId,
  width: number,
  height: number,
  layoutSeed = 0,
): void {
  const cfg = BRAND_CONFIGS[brandId];
  const primary = cfg.primaryColor;

  ctx.clearRect(0, 0, width, height);

  // ── 1. Very light background ───────────────────────────────────────────────
  ctx.fillStyle = '#EBF5FB';
  ctx.fillRect(0, 0, width, height);

  // ── 2. Centered title — scale font with canvas height ─────────────────────
  const titleFontSize = Math.round(height * 0.058);
  const titleWrap = Math.round(width * 0.85);
  ctx.font = `700 ${titleFontSize}px Poppins`;
  ctx.fillStyle = '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const titleLines = wrapText(ctx, opportunity.sectionTitle, titleWrap).slice(0, 2);
  let ty = Math.round(height * 0.053);
  for (const line of titleLines) {
    ctx.fillText(line, width / 2, ty);
    ty += titleFontSize + 8;
  }
  const contentStartY = ty + Math.round(height * 0.027);

  // ── 3. Illustration — fills the full content area below title ─────────────
  const contentH = height - contentStartY - Math.round(height * 0.031);
  const ilCY = contentStartY + contentH / 2;
  const ilSize = Math.min(contentH * 0.92, height * 0.67);

  drawSharedIllustration(
    ctx,
    opportunity.visualType,
    width / 2,
    ilCY,
    ilSize,
    primary,
    opportunity.points,
    opportunity.numbers,
    width - 40,   // availW — let illustrations spread to full canvas width
    layoutSeed,
  );
}
