/**
 * sharedIllustrations.ts
 * Multiple layout variants per visual type, selected deterministically by content hash.
 * Patterns based on reference infographic images.
 */
import type { VisualType } from '../types';
import { wrapText } from '../utils/wrapText';

// ═══ Public API ══════════════════════════════════════════════════════════════

export function drawSharedIllustration(
  ctx: CanvasRenderingContext2D,
  type: VisualType,
  cx: number,
  cy: number,
  size: number,
  primary: string,
  points: string[],
  numbers: string[],
  availW?: number,     // optional full available width — expands horizontal layouts
  layoutSeed = 0,     // increments on each regenerate click → forces new variant
): void {
  ctx.save();
  // Content-only seed for base variant; layoutSeed rotates it on each regenerate click
  const contentSeed = points.join('|') || type;
  const pv = (count: number) => pickVariant(contentSeed, count, layoutSeed);
  switch (type) {
    case 'steps': {
      const v = pv(3);
      if      (v === 0) drawStepsCards(ctx, cx, cy, size, primary, points, availW);
      else if (v === 1) drawStepsArrowChain(ctx, cx, cy, size, primary, points, availW);
      else              drawStepsSpine(ctx, cx, cy, size, primary, points, availW);
      break;
    }
    case 'benefits': {
      const v = pv(4);
      if      (v === 0) drawBenefitsGrid(ctx, cx, cy, size, primary, points, availW);
      else if (v === 1) drawBenefitsIconRow(ctx, cx, cy, size, primary, points, availW);
      else if (v === 2) drawBenefitsRadial(ctx, cx, cy, size, primary, points, availW);
      else              drawBenefitsArcList(ctx, cx, cy, size, primary, points, availW);
      break;
    }
    case 'metrics':    drawMetrics(ctx, cx, cy, size, primary, numbers, availW); break;
    case 'comparison': drawComparison(ctx, cx, cy, size, primary, availW); break;
    case 'process': {
      const v = pv(2);
      if (v === 0) drawProcess(ctx, cx, cy, size, primary, points, availW);
      else         drawStepsArrowChain(ctx, cx, cy, size, primary, points, availW);
      break;
    }
    case 'review': drawReview(ctx, cx, cy, size, primary, availW); break;
    default: {
      const v = pv(3);
      if      (v === 0) drawKeyPoints(ctx, cx, cy, size, primary, points, availW);
      else if (v === 1) drawKeyPointsRadial(ctx, cx, cy, size, primary, points, availW);
      else              drawKeyPointsIconGrid(ctx, cx, cy, size, primary, points, availW);
      break;
    }
  }
  ctx.restore();
}

// ═══ Helpers ═════════════════════════════════════════════════════════════════

// offset = layoutSeed guarantees a different variant on each regenerate click
function pickVariant(seed: string, count: number, offset = 0): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i);
    h = h & 0x7fffffff;
  }
  return ((h % count) + offset) % count;
}


/**
 * Draw text wrapping to fit within maxW, up to maxLines lines.
 * ctx.font must already be set. Returns next Y after last line.
 */
function fillWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
  maxLines = 3,
): number {
  const lines = wrapText(ctx, text, maxW).slice(0, maxLines);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineH;
  }
  return y;
}

function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
function tint(primary: string, alpha: number): string {
  const [r, g, b] = hex(primary);
  return `rgba(${r},${g},${b},${alpha})`;
}
function lighten(primary: string, pct: number): string {
  const [r, g, b] = hex(primary);
  const l = (c: number) => Math.round(c + pct * (255 - c));
  return `#${[l(r), l(g), l(b)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}
function shadow(ctx: CanvasRenderingContext2D, blur = 14, alpha = 0.10) {
  ctx.shadowColor = `rgba(0,0,0,${alpha})`;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetY = 3;
}
function noShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

// Multi-colour palette that pairs well alongside any primary
const MULTI = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#06B6D4'];
function palCol(primary: string, i: number): string {
  return i === 0 ? primary : MULTI[(i - 1) % MULTI.length];
}

const STEP_DEFS = ['Define your goal', 'Plan the approach', 'Execute the plan', 'Review & improve'];
const BEN_DEFS  = ['Save time', 'Reduce costs', 'Improve quality', 'Scale easily'];
const KP_DEFS   = ['Understand the context', 'Research the topic', 'Apply best practice', 'Measure outcomes'];

// ═══════════════════════════════════════════════════════════════════════════════
// STEPS — variant A: vertical numbered roadmap cards
// ═══════════════════════════════════════════════════════════════════════════════

function drawStepsCards(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u      = size / 300;
  const labels = (points.length >= 2 ? points : STEP_DEFS).slice(0, 6);
  const cardW  = availW ? Math.min(availW * 0.62, 460 * u) : 230 * u;
  const numR   = 20 * u;
  const gap    = 10 * u;
  const lineH  = 15 * u;
  const vPad   = 14 * u;
  const textW  = cardW - 70 * u;
  const pale   = lighten(primary, 0.90);

  // Pre-measure every label → dynamic card heights
  ctx.font = `600 ${11.5 * u}px Inter`;
  const allLines = labels.map(l => wrapText(ctx, l, textW));
  const heights  = allLines.map(ls => Math.max(48 * u, ls.length * lineH + vPad));
  const totalH   = heights.reduce((s, h) => s + h, 0) + (labels.length - 1) * gap;
  let y = cy - totalH / 2;

  labels.forEach((_label, i) => {
    const cardH  = heights[i];
    const lines  = allLines[i];
    const isFirst = i === 0;
    const cardX  = cx - cardW / 2;

    ctx.save(); shadow(ctx, 12, 0.08);
    ctx.beginPath(); ctx.roundRect(cardX, y, cardW, cardH, 10 * u);
    ctx.fillStyle = isFirst ? primary : '#FFFFFF'; ctx.fill();
    ctx.restore(); noShadow(ctx);

    if (!isFirst) {
      ctx.save();
      ctx.beginPath(); ctx.roundRect(cardX, y, 4 * u, cardH, [10 * u, 0, 0, 10 * u]);
      ctx.fillStyle = pale; ctx.fill();
      ctx.restore();
    }

    ctx.save(); shadow(ctx, 8, 0.12);
    ctx.beginPath(); ctx.arc(cardX + 28 * u, y + cardH / 2, numR, 0, Math.PI * 2);
    ctx.fillStyle = isFirst ? 'rgba(255,255,255,0.25)' : primary; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.font = `800 ${14 * u}px Inter`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), cardX + 28 * u, y + cardH / 2);

    const blockH = lines.length * lineH;
    const startY = y + cardH / 2 - blockH / 2;
    ctx.font = `600 ${11.5 * u}px Inter`;
    ctx.fillStyle = isFirst ? '#FFFFFF' : '#1A1A2E';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    lines.forEach((line, li) => ctx.fillText(line, cardX + 58 * u, startY + li * lineH));

    if (i < labels.length - 1) {
      ctx.save();
      ctx.strokeStyle = tint(primary, 0.3); ctx.lineWidth = 1.5 * u;
      ctx.setLineDash([3 * u, 3 * u]);
      ctx.beginPath();
      ctx.moveTo(cardX + 28 * u, y + cardH + 2 * u);
      ctx.lineTo(cardX + 28 * u, y + cardH + gap - 2 * u);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
    y += cardH + gap;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEPS — variant B: horizontal chevron arrow chain
// ═══════════════════════════════════════════════════════════════════════════════

function drawStepsArrowChain(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u = size / 300;
  const labels = (points.length >= 2 ? points : STEP_DEFS).slice(0, 6);
  const n = labels.length;
  const arrowH = 38 * u;
  const notch  = 11 * u;
  const spanW  = availW ? availW * 0.92 : size * 0.88;
  const arrowW = (spanW + notch * (n - 1)) / n;
  const totalW  = n * arrowW - (n - 1) * notch;
  // shift arrow band up slightly to leave room for below-labels
  const arrowTop = cy - arrowH / 2 - 14 * u;
  let x = cx - totalW / 2;

  for (let i = 0; i < n; i++) {
    const c = palCol(primary, i);
    const centerX = x + arrowW / 2;

    ctx.save();
    shadow(ctx, 6, 0.12);
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x + (i > 0 ? notch : 0), arrowTop);
    ctx.lineTo(x + arrowW - notch, arrowTop);
    ctx.lineTo(x + arrowW, arrowTop + arrowH / 2);
    ctx.lineTo(x + arrowW - notch, arrowTop + arrowH);
    ctx.lineTo(x + (i > 0 ? notch : 0), arrowTop + arrowH);
    if (i > 0) ctx.lineTo(x, arrowTop + arrowH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore(); noShadow(ctx);

    // Number
    ctx.save();
    ctx.font = `800 ${11 * u}px Inter`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1).padStart(2, '0'), centerX, arrowTop + arrowH / 2);
    ctx.restore();

    // Labels alternate above / below — multi-line, no truncation
    const isAbove    = i % 2 === 1;
    const labelW     = arrowW - 4 * u;
    ctx.font = `500 ${9 * u}px Inter`;
    const llines     = wrapText(ctx, labels[i], labelW);
    const llineH     = 11 * u;
    const labelBlock = llines.length * llineH;
    const connGap    = 14 * u;
    const connStartY = isAbove ? arrowTop - 3 * u : arrowTop + arrowH + 3 * u;
    const connEndY   = isAbove ? arrowTop - connGap : arrowTop + arrowH + connGap;
    const labelStartY = isAbove ? connEndY - labelBlock - 2 * u : connEndY + 2 * u;

    ctx.save();
    ctx.strokeStyle = tint(c, 0.55); ctx.lineWidth = 1.2 * u;
    ctx.beginPath(); ctx.moveTo(centerX, connStartY); ctx.lineTo(centerX, connEndY); ctx.stroke();
    ctx.beginPath(); ctx.arc(centerX, connStartY, 2.5 * u, 0, Math.PI * 2);
    ctx.fillStyle = c; ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.font = `500 ${9 * u}px Inter`;
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    llines.forEach((line, li) => ctx.fillText(line, centerX, labelStartY + li * llineH));
    ctx.restore();

    x += arrowW - notch;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEPS — variant C: center spine with alternating left / right labels
// ═══════════════════════════════════════════════════════════════════════════════

function drawStepsSpine(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u = size / 300;
  const labels = (points.length >= 2 ? points : STEP_DEFS).slice(0, 6);
  const n = labels.length;
  const spineW  = 30 * u;
  const itemH   = (size * 0.82) / n;
  const spineH  = n * itemH;
  const spineX  = cx - spineW / 2;
  const spineY  = cy - spineH / 2;

  // Spine track
  ctx.save();
  ctx.beginPath(); ctx.roundRect(spineX, spineY, spineW, spineH, spineW / 2);
  ctx.fillStyle = lighten(primary, 0.88); ctx.fill();
  ctx.restore();

  for (let i = 0; i < n; i++) {
    const itemY   = spineY + i * itemH + itemH / 2;
    const segColor = lighten(primary, ((n - 1 - i) / n) * 0.55);
    const isLeft  = i % 2 === 0;

    // Spine segment
    ctx.save(); shadow(ctx, 8, 0.10);
    ctx.beginPath();
    ctx.roundRect(spineX + 2 * u, spineY + i * itemH + 3 * u, spineW - 4 * u, itemH - 6 * u, (spineW / 2) - 2 * u);
    ctx.fillStyle = segColor; ctx.fill();
    ctx.restore(); noShadow(ctx);

    // Number
    ctx.save();
    ctx.font = `800 ${11 * u}px Inter`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), cx, itemY);
    ctx.restore();

    // Dashed connector
    const armLen = availW ? availW * 0.28 : 22 * u;
    const connX1 = isLeft ? spineX - 2 * u : spineX + spineW + 2 * u;
    const connX2 = isLeft ? spineX - armLen : spineX + spineW + armLen;
    ctx.save();
    ctx.strokeStyle = tint(primary, 0.35);
    ctx.lineWidth = 1.5 * u;
    ctx.setLineDash([3 * u, 3 * u]);
    ctx.beginPath(); ctx.moveTo(connX1, itemY); ctx.lineTo(connX2, itemY);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();

    // Label
    const labelX = isLeft ? spineX - armLen - 4 * u : spineX + spineW + armLen + 4 * u;
    const spineLabelW = availW ? availW * 0.30 - 8 * u : 120 * u;
    ctx.save();
    ctx.font = `500 ${10 * u}px Inter`;
    ctx.fillStyle = '#374151';
    ctx.textAlign = isLeft ? 'right' : 'left';
    ctx.textBaseline = 'top';
    const spineLines  = wrapText(ctx, labels[i], spineLabelW);
    const spineLineH  = 13 * u;
    const spineBlockH = spineLines.length * spineLineH;
    spineLines.forEach((line, li) => {
      ctx.fillText(line, labelX, itemY - spineBlockH / 2 + li * spineLineH);
    });
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFITS — variant A: 2×2 icon card grid (original)
// ═══════════════════════════════════════════════════════════════════════════════

function drawBenefitsGrid(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u    = size / 300;
  const labels = (points.length >= 2 ? points : BEN_DEFS).slice(0, 4);
  const gap  = 14 * u;
  const cw   = availW ? Math.min((availW - gap * 3) / 2, 200 * u) : 108 * u;
  const ch   = 110 * u;
  const pale = lighten(primary, 0.88);
  const totalW = 2 * cw + gap;
  const totalH = 2 * ch + gap;
  const sx = cx - totalW / 2, sy = cy - totalH / 2;

  const iconFns = [drawIconCheck, drawIconStar, drawIconZap, drawIconShield];

  labels.forEach((label, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx + col * (cw + gap);
    const y = sy + row * (ch + gap);
    const isAccent = i === 0;

    ctx.save(); shadow(ctx, 14, 0.09);
    ctx.beginPath(); ctx.roundRect(x, y, cw, ch, 12 * u);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save();
    ctx.beginPath(); ctx.roundRect(x, y, cw, ch * 0.50, [12 * u, 12 * u, 0, 0]);
    ctx.fillStyle = isAccent ? primary : pale; ctx.fill();
    ctx.restore();

    const icx = x + cw / 2, icy = y + ch * 0.25;
    ctx.save(); shadow(ctx, 10, 0.12);
    ctx.beginPath(); ctx.arc(icx, icy, 20 * u, 0, Math.PI * 2);
    ctx.fillStyle = isAccent ? 'rgba(255,255,255,0.2)' : primary; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2 * u;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    (iconFns[i] ?? drawIconCheck)(ctx, icx, icy, 9 * u);
    ctx.restore();

    ctx.font = `700 ${10 * u}px Inter`;
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    fillWrapped(ctx, label, x + cw / 2, y + ch * 0.55 + 4 * u, cw - 12 * u, 13 * u, 4);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFITS — variant B: horizontal row of icon circles
// ═══════════════════════════════════════════════════════════════════════════════

function drawBenefitsIconRow(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u = size / 300;
  const labels = (points.length >= 2 ? points : BEN_DEFS).slice(0, 6);
  const n = labels.length;

  // Layout: single row for ≤4 items, 3+rest for 5
  const rows: string[][] = n <= 4 ? [labels] : [labels.slice(0, 3), labels.slice(3)];
  const rowH = 88 * u;
  const totalH = rows.length * rowH;
  const startY = cy - totalH / 2 + rowH / 2;
  const circleR = 28 * u;
  const iconFns = [drawIconCheck, drawIconStar, drawIconZap, drawIconShield, drawIconGlobe];

  let itemIndex = 0;
  rows.forEach((row, ri) => {
    const rowY = startY + ri * rowH;
    const spacing = availW
      ? Math.min(availW / (row.length + 0.3), 140 * u)
      : Math.min(size / (row.length + 0.5), 72 * u);
    const rowStartX = cx - spacing * (row.length - 1) / 2;

    row.forEach((label, ci) => {
      const px = rowStartX + ci * spacing;
      const c = palCol(primary, itemIndex);
      const pale = lighten(c, 0.88);

      // Outer ring
      ctx.save();
      ctx.beginPath(); ctx.arc(px, rowY, circleR + 4 * u, 0, Math.PI * 2);
      ctx.fillStyle = pale; ctx.fill();
      ctx.restore();

      // Inner circle
      ctx.save(); shadow(ctx, 10, 0.10);
      ctx.beginPath(); ctx.arc(px, rowY, circleR, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.restore(); noShadow(ctx);

      // Colored border
      ctx.save();
      ctx.beginPath(); ctx.arc(px, rowY, circleR, 0, Math.PI * 2);
      ctx.strokeStyle = c; ctx.lineWidth = 2 * u; ctx.stroke();
      ctx.restore();

      // Icon
      ctx.save();
      ctx.strokeStyle = c; ctx.lineWidth = 2 * u;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      (iconFns[itemIndex % iconFns.length])(ctx, px, rowY, 10 * u);
      ctx.restore();

      // Label below — no line limit
      const iconLabelW = spacing * 0.88;
      ctx.save();
      ctx.font = `500 ${9.5 * u}px Inter`;
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      fillWrapped(ctx, label, px, rowY + circleR + 8 * u, iconLabelW, 12 * u, 4);
      ctx.restore();

      itemIndex++;
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFITS — variant C: radial / orbital layout
// ═══════════════════════════════════════════════════════════════════════════════

function drawBenefitsRadial(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u = size / 300;
  const labels = (points.length >= 2 ? points : BEN_DEFS).slice(0, 6);
  const n = labels.length;
  const centerR = 44 * u;
  const orbitR  = availW ? Math.min(availW * 0.22, size * 0.52) : 105 * u;
  const itemR   = 16 * u;
  const pale    = lighten(primary, 0.88);

  // Center circle
  ctx.save(); shadow(ctx, 18, 0.12);
  ctx.beginPath(); ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
  ctx.fillStyle = primary; ctx.fill();
  ctx.restore(); noShadow(ctx);

  ctx.save();
  ctx.font = `700 ${11 * u}px Inter`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(n + ' Items', cx, cy);
  ctx.restore();

  // Orbit ring (subtle)
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
  ctx.strokeStyle = lighten(primary, 0.80); ctx.lineWidth = 1 * u;
  ctx.setLineDash([4 * u, 5 * u]); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();

  // Items
  for (let i = 0; i < n; i++) {
    const angle  = (i / n) * Math.PI * 2 - Math.PI / 2;
    const ix = cx + orbitR * Math.cos(angle);
    const iy = cy + orbitR * Math.sin(angle);
    const c  = palCol(primary, i);

    // Connector
    ctx.save();
    ctx.strokeStyle = lighten(primary, 0.72); ctx.lineWidth = 1 * u;
    ctx.beginPath();
    ctx.moveTo(cx + centerR * Math.cos(angle), cy + centerR * Math.sin(angle));
    ctx.lineTo(ix - itemR * Math.cos(angle), iy - itemR * Math.sin(angle));
    ctx.stroke();
    ctx.restore();

    // Item circle
    ctx.save(); shadow(ctx, 8, 0.12);
    ctx.beginPath(); ctx.arc(ix, iy, itemR + 4 * u, 0, Math.PI * 2);
    ctx.fillStyle = pale; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save(); shadow(ctx, 6, 0.10);
    ctx.beginPath(); ctx.arc(ix, iy, itemR, 0, Math.PI * 2);
    ctx.fillStyle = c; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save();
    ctx.font = `800 ${10 * u}px Inter`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), ix, iy);
    ctx.restore();

    // Label: positioned outward from item circle
    const labelDist = orbitR + itemR + 14 * u;
    const lx = cx + labelDist * Math.cos(angle);
    const ly = cy + labelDist * Math.sin(angle);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const align = cosA < -0.3 ? 'right' : cosA > 0.3 ? 'left' : 'center';
    const base  = sinA < -0.3 ? 'bottom' : sinA > 0.3 ? 'top' : 'middle';

    const radLabelW = orbitR * 0.9;
    ctx.save();
    ctx.font = `500 ${9 * u}px Inter`;
    ctx.fillStyle = '#374151';
    ctx.textAlign = align; ctx.textBaseline = 'top';
    const radLines  = wrapText(ctx, labels[i], radLabelW);
    const radLineH  = 11 * u;
    const radStartY = base === 'bottom' ? ly - radLines.length * radLineH : ly;
    radLines.forEach((line, li) => ctx.fillText(line, lx, radStartY + li * radLineH));
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFITS — variant D: arc bracket list (large circle left, items right)
// ═══════════════════════════════════════════════════════════════════════════════

function drawBenefitsArcList(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u = size / 300;
  const labels = (points.length >= 2 ? points : BEN_DEFS).slice(0, 6);
  const n = labels.length;
  const arcR   = availW ? availW * 0.28 : size * 0.34;
  const arcCX  = cx - arcR * 0.55;
  const itemCX = cx + arcR * 0.45;
  const itemR  = 14 * u;
  const itemSpacing = Math.min(size * 0.15, (size * 0.75) / Math.max(n - 1, 1));

  // Large background circle (decorative)
  ctx.save();
  ctx.beginPath(); ctx.arc(arcCX, cy, arcR, 0, Math.PI * 2);
  ctx.fillStyle = lighten(primary, 0.92); ctx.fill();
  ctx.strokeStyle = lighten(primary, 0.78); ctx.lineWidth = 1.5 * u;
  ctx.setLineDash([5 * u, 5 * u]); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();

  for (let i = 0; i < n; i++) {
    const iy = cy + (i - (n - 1) / 2) * itemSpacing;
    const c = palCol(primary, i);

    // Connector from arc right edge to item
    const connStartX = arcCX + arcR * 0.85;
    const connEndX   = itemCX - itemR - 4 * u;
    ctx.save();
    ctx.strokeStyle = lighten(primary, 0.65); ctx.lineWidth = 1.2 * u;
    ctx.setLineDash([3 * u, 3 * u]);
    ctx.beginPath(); ctx.moveTo(connStartX, iy); ctx.lineTo(connEndX, iy);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();

    // Item circle with number
    ctx.save(); shadow(ctx, 8, 0.12);
    ctx.beginPath(); ctx.arc(itemCX, iy, itemR, 0, Math.PI * 2);
    ctx.fillStyle = c; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save();
    ctx.font = `800 ${10 * u}px Inter`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1).padStart(2, '0'), itemCX, iy);
    ctx.restore();

    // Label to the right — full text, no limit
    const arcLabelW = availW ? availW * 0.40 : 140 * u;
    ctx.save();
    ctx.font = `500 ${10 * u}px Inter`;
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    const arcLines = wrapText(ctx, labels[i], arcLabelW);
    const arcLineH = 13 * u;
    const arcBlockH = arcLines.length * arcLineH;
    arcLines.forEach((line, li) => {
      ctx.fillText(line, itemCX + itemR + 8 * u, iy - arcBlockH / 2 + li * arcLineH);
    });
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// METRICS — circular stat rings (original)
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_STATS = [
  { val: '85%', label: 'Efficiency', pct: 0.85 },
  { val: '3×',  label: 'Faster',     pct: 0.75 },
  { val: '40%', label: 'Cost saved', pct: 0.40 },
];

function drawMetrics(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, numbers: string[], availW?: number,
) {
  const u = size / 300;
  const stats = numbers.length >= 3
    ? numbers.slice(0, 3).map((v, i) => ({
        val: v,
        label: ['Users', 'Growth', 'Efficiency', 'Results'][i] ?? 'Result',
        pct: Math.min(0.95, parseFloat(v) / 100 || 0.6 + i * 0.1),
      }))
    : DEFAULT_STATS;

  const ringR   = 50 * u;
  const spacing = availW ? availW / (stats.length + 0.5) : 115 * u;
  const startX  = cx - (stats.length - 1) * spacing / 2;
  const pale    = lighten(primary, 0.88);

  stats.forEach(({ val, label, pct }, i) => {
    const rx = startX + i * spacing;
    const ry = cy - 10 * u;

    ctx.save(); shadow(ctx, 16, 0.08);
    ctx.beginPath(); ctx.arc(rx, ry, ringR + 8 * u, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save();
    ctx.beginPath(); ctx.arc(rx, ry, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = pale; ctx.lineWidth = 9 * u; ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.arc(rx, ry, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = primary; ctx.lineWidth = 9 * u; ctx.lineCap = 'round'; ctx.stroke();
    ctx.restore();

    ctx.font = `800 ${18 * u}px Inter`;
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(val, rx, ry - 5 * u);

    ctx.font = `400 ${9 * u}px Inter`;
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(label, rx, ry + 12 * u);

    ctx.font = `600 ${9 * u}px Inter`;
    ctx.fillStyle = primary;
    ctx.fillText(label, rx, ry + ringR + 18 * u);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON — two-column infographic table (original)
// ═══════════════════════════════════════════════════════════════════════════════

function drawComparison(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, availW?: number,
) {
  const u   = size / 300;
  const gap = 16 * u;
  const cw  = availW ? Math.min((availW - gap * 3) / 2, 260 * u) : 120 * u;
  const ch  = 200 * u;
  const pale = lighten(primary, 0.88);

  const cols = [
    { label: 'Option A', fill: primary,   rows: ['✓  Faster setup', '✓  Lower cost', '✓  Easy to use', '✗  Fewer features'] },
    { label: 'Option B', fill: '#F8F9FA', rows: ['✓  More features', '✓  Integrations', '✗  Complex setup', '✗  Higher price'] },
  ];

  cols.forEach((col, ci) => {
    const x = ci === 0 ? cx - cw - gap / 2 : cx + gap / 2;
    const y = cy - ch / 2;

    ctx.save(); shadow(ctx, 14, 0.09);
    ctx.beginPath(); ctx.roundRect(x, y, cw, ch, 14 * u);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save();
    ctx.beginPath(); ctx.roundRect(x, y, cw, 42 * u, [14 * u, 14 * u, 0, 0]);
    ctx.fillStyle = ci === 0 ? primary : pale; ctx.fill();
    ctx.restore();

    ctx.font = `700 ${12 * u}px Inter`;
    ctx.fillStyle = ci === 0 ? '#FFFFFF' : primary;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(col.label, x + cw / 2, y + 21 * u);

    col.rows.forEach((row, ri) => {
      const ry = y + 52 * u + ri * 34 * u;
      if (ri > 0) {
        ctx.save(); ctx.strokeStyle = '#F3F4F6'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x + 10 * u, ry - 5 * u); ctx.lineTo(x + cw - 10 * u, ry - 5 * u);
        ctx.stroke(); ctx.restore();
      }
      ctx.font = `${row.startsWith('✓') ? '500' : '400'} ${9.5 * u}px Inter`;
      ctx.fillStyle = row.startsWith('✓') ? '#1A1A2E' : '#9CA3AF';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(row, x + 12 * u, ry);
    });
  });

  ctx.save(); shadow(ctx, 10, 0.15);
  ctx.beginPath(); ctx.arc(cx, cy, 19 * u, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.restore(); noShadow(ctx);
  ctx.font = `800 ${10 * u}px Inter`;
  ctx.fillStyle = primary; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('VS', cx, cy);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESS — horizontal flow (original)
// ═══════════════════════════════════════════════════════════════════════════════

function drawProcess(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u     = size / 300;
  const nodes = (points.length >= 3 ? points.slice(0, 4) : ['Input', 'Process', 'Review', 'Output']);
  const n     = nodes.length;
  const boxH  = 46 * u;
  const gap   = availW ? availW * 0.07 : 36 * u;
  const boxW  = availW ? (availW * 0.88 - gap * (n - 1)) / n : 68 * u;
  const pale  = lighten(primary, 0.88);
  const totalW = n * boxW + (n - 1) * gap;
  let x = cx - totalW / 2;

  nodes.forEach((label: string, i: number) => {
    const isActive = i === 1;

    ctx.save(); shadow(ctx, 12, 0.09);
    ctx.beginPath(); ctx.roundRect(x, cy - boxH / 2, boxW, boxH, 8 * u);
    ctx.fillStyle = isActive ? primary : '#FFFFFF'; ctx.fill();
    if (!isActive) { ctx.strokeStyle = pale; ctx.lineWidth = 2 * u; ctx.stroke(); }
    ctx.restore(); noShadow(ctx);

    ctx.font = `800 ${10 * u}px Inter`;
    ctx.fillStyle = isActive ? 'rgba(255,255,255,0.5)' : tint(primary, 0.3);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(String(i + 1), x + boxW / 2, cy - boxH / 2 + 5 * u);

    ctx.font = `600 ${10 * u}px Inter`;
    ctx.fillStyle = isActive ? '#FFFFFF' : '#1A1A2E';
    ctx.textBaseline = 'top';
    fillWrapped(ctx, label, x + boxW / 2, cy - boxH / 2 + 20 * u, boxW - 8 * u, 12 * u, 2);

    if (i < nodes.length - 1) {
      const ax = x + boxW + gap / 2;
      const as = 7 * u;
      ctx.save();
      ctx.fillStyle = pale;
      ctx.beginPath();
      ctx.moveTo(ax + as, cy); ctx.lineTo(ax - as * 0.3, cy - as * 0.5);
      ctx.lineTo(ax - as * 0.3, cy + as * 0.5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = pale; ctx.lineWidth = 2 * u;
      ctx.beginPath(); ctx.moveTo(x + boxW + 2 * u, cy); ctx.lineTo(ax - as * 0.3, cy);
      ctx.stroke();
      ctx.restore();
    }
    x += boxW + gap;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEW — score ring + criteria bars (original)
// ═══════════════════════════════════════════════════════════════════════════════

function drawReview(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, availW?: number,
) {
  const u    = size / 300;
  const pale = lighten(primary, 0.88);
  const ringR = 55 * u;
  const scoreY = cy - 35 * u;

  const cardHalf = availW ? Math.min(availW * 0.40, 200 * u) : 110 * u;
  ctx.save(); shadow(ctx, 18, 0.08);
  ctx.beginPath(); ctx.roundRect(cx - cardHalf, cy - cardHalf, cardHalf * 2, cardHalf * 2, 16 * u);
  ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.restore(); noShadow(ctx);

  ctx.save();
  ctx.beginPath(); ctx.arc(cx, scoreY, ringR, 0, Math.PI * 2);
  ctx.strokeStyle = pale; ctx.lineWidth = 10 * u; ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath(); ctx.arc(cx, scoreY, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.85);
  ctx.strokeStyle = primary; ctx.lineWidth = 10 * u; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();

  ctx.font = `800 ${24 * u}px Inter`;
  ctx.fillStyle = '#1A1A2E'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('8.5', cx, scoreY - 4 * u);
  ctx.font = `400 ${8.5 * u}px Inter`; ctx.fillStyle = '#9CA3AF';
  ctx.fillText('out of 10', cx, scoreY + 14 * u);

  const starY = scoreY + ringR + 18 * u;
  for (let s = 0; s < 5; s++) {
    ctx.font = `${13 * u}px Inter`; ctx.fillStyle = s < 4 ? primary : pale;
    ctx.fillText('★', cx - 30 * u + s * 15 * u, starY);
  }

  const criteria = [
    { label: 'Ease of Use', pct: 0.90 },
    { label: 'Features',    pct: 0.82 },
    { label: 'Value',       pct: 0.75 },
  ];
  const barW = 175 * u, barH = 5 * u;
  let by = starY + 20 * u;
  criteria.forEach(c => {
    ctx.font = `500 ${8.5 * u}px Inter`; ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(c.label, cx - barW / 2, by);
    ctx.font = `700 ${8.5 * u}px Inter`; ctx.fillStyle = primary;
    ctx.textAlign = 'right'; ctx.fillText(`${Math.round(c.pct * 10)}/10`, cx + barW / 2, by);
    ctx.beginPath(); ctx.roundRect(cx - barW / 2, by + 9 * u, barW, barH, barH / 2);
    ctx.fillStyle = pale; ctx.fill();
    ctx.beginPath(); ctx.roundRect(cx - barW / 2, by + 9 * u, barW * c.pct, barH, barH / 2);
    ctx.fillStyle = primary; ctx.fill();
    by += 28 * u;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEY POINTS — variant A: vertical timeline (original)
// ═══════════════════════════════════════════════════════════════════════════════

function drawKeyPoints(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u      = size / 300;
  const labels = (points.length >= 2 ? points : KP_DEFS).slice(0, 6);
  const cardW  = availW ? Math.min(availW * 0.65, 480 * u) : 240 * u;
  const dotR   = 16 * u;
  const gap    = 10 * u;
  const lineH  = 14 * u;
  const vPad   = 14 * u;
  const kpTextW = cardW - dotR * 2 - 22 * u;
  const pale   = lighten(primary, 0.88);

  // Pre-measure all labels for dynamic heights
  ctx.font = `500 ${11 * u}px Inter`;
  const allLines = labels.map(l => wrapText(ctx, l, kpTextW));
  const heights  = allLines.map(ls => Math.max(44 * u, ls.length * lineH + vPad));
  const totalH   = heights.reduce((s, h) => s + h, 0) + (labels.length - 1) * gap;
  let y = cy - totalH / 2;

  // Timeline spine
  ctx.save();
  ctx.strokeStyle = pale; ctx.lineWidth = 2 * u; ctx.setLineDash([4 * u, 4 * u]);
  ctx.beginPath();
  ctx.moveTo(cx - cardW / 2 + dotR, y + dotR);
  ctx.lineTo(cx - cardW / 2 + dotR, y + totalH - dotR);
  ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();

  labels.forEach((_label, i) => {
    const cardH  = heights[i];
    const lines  = allLines[i];
    const cardX  = cx - cardW / 2;
    const isFirst = i === 0;

    ctx.save(); shadow(ctx, 10, 0.07);
    ctx.beginPath(); ctx.roundRect(cardX + dotR * 2 + 8 * u, y, cardW - dotR * 2 - 8 * u, cardH, 8 * u);
    ctx.fillStyle = isFirst ? tint(primary, 0.06) : '#FFFFFF'; ctx.fill();
    ctx.restore(); noShadow(ctx);

    ctx.save(); shadow(ctx, 8, 0.10);
    ctx.beginPath(); ctx.arc(cardX + dotR, y + cardH / 2, dotR, 0, Math.PI * 2);
    ctx.fillStyle = isFirst ? primary : '#FFFFFF'; ctx.fill();
    if (!isFirst) { ctx.strokeStyle = primary; ctx.lineWidth = 2 * u; ctx.stroke(); }
    ctx.restore(); noShadow(ctx);

    ctx.font = `800 ${11 * u}px Inter`;
    ctx.fillStyle = isFirst ? '#FFFFFF' : primary;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), cardX + dotR, y + cardH / 2);

    const blockH  = lines.length * lineH;
    const startY  = y + cardH / 2 - blockH / 2;
    ctx.font = `${isFirst ? '700' : '500'} ${11 * u}px Inter`;
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    lines.forEach((line, li) => ctx.fillText(line, cardX + dotR * 2 + 16 * u, startY + li * lineH));

    y += cardH + gap;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEY POINTS — variant B: radial spoke diagram
// ═══════════════════════════════════════════════════════════════════════════════

function drawKeyPointsRadial(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u = size / 300;
  const labels = (points.length >= 2 ? points : KP_DEFS).slice(0, 7);
  const n = labels.length;
  const centerR = 44 * u;
  const spokeR  = availW ? Math.min(availW * 0.22, size * 0.52) : 108 * u;
  const dotR    = 6 * u;
  const pale    = lighten(primary, 0.85);

  // Center circle
  ctx.save(); shadow(ctx, 16, 0.12);
  ctx.beginPath(); ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.strokeStyle = primary; ctx.lineWidth = 2.5 * u; ctx.stroke();
  ctx.restore(); noShadow(ctx);

  ctx.save();
  ctx.font = `700 ${10 * u}px Inter`;
  ctx.fillStyle = primary;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Key', cx, cy - 6 * u);
  ctx.fillText('Points', cx, cy + 6 * u);
  ctx.restore();

  for (let i = 0; i < n; i++) {
    const angle  = (i / n) * Math.PI * 2 - Math.PI / 2;
    const cosA   = Math.cos(angle);
    const sinA   = Math.sin(angle);
    const sx     = cx + centerR * cosA;
    const sy     = cy + centerR * sinA;
    const ex     = cx + spokeR * cosA;
    const ey     = cy + spokeR * sinA;

    // Spoke line
    ctx.save();
    ctx.strokeStyle = pale; ctx.lineWidth = 1.5 * u;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.restore();

    // Dot at end
    ctx.save();
    ctx.beginPath(); ctx.arc(ex, ey, dotR, 0, Math.PI * 2);
    ctx.fillStyle = primary; ctx.fill();
    ctx.restore();

    // Label beyond dot
    const lx = cx + (spokeR + dotR + 10 * u) * cosA;
    const ly = cy + (spokeR + dotR + 10 * u) * sinA;
    const align = cosA < -0.25 ? 'right' : cosA > 0.25 ? 'left' : 'center';
    const base  = sinA < -0.25 ? 'bottom' : sinA > 0.25 ? 'top' : 'middle';

    const spokeLabelW = availW ? availW * 0.20 : spokeR * 0.85;
    ctx.save();
    ctx.font = `500 ${9.5 * u}px Inter`;
    ctx.fillStyle = '#374151';
    ctx.textAlign = align; ctx.textBaseline = 'top';
    const spokeLines   = wrapText(ctx, labels[i], spokeLabelW);
    const spokeLineH   = 12 * u;
    const spokeStartY  = base === 'bottom' ? ly - spokeLines.length * spokeLineH : ly;
    spokeLines.forEach((line, li) => ctx.fillText(line, lx, spokeStartY + li * spokeLineH));
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEY POINTS — variant C: hexagon icon card grid
// ═══════════════════════════════════════════════════════════════════════════════

function drawKeyPointsIconGrid(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number,
  primary: string, points: string[], availW?: number,
) {
  const u = size / 300;
  const labels = (points.length >= 2 ? points : KP_DEFS).slice(0, 6);
  const n = labels.length;

  // Arrange in rows: 3 top + remainder
  const topCount = Math.min(3, Math.ceil(n / 2));
  const botCount = n - topCount;
  const rows = botCount > 0 ? [labels.slice(0, topCount), labels.slice(topCount)] : [labels];

  const gapX = 14 * u, gapY = 10 * u;
  const cardW = availW ? Math.min((availW - gapX * (topCount + 1)) / topCount, 160 * u) : 78 * u;
  const cardH = 86 * u;
  const totalH = rows.length * cardH + (rows.length - 1) * gapY;
  const hexR   = 22 * u;

  rows.forEach((row, ri) => {
    const rowY  = cy - totalH / 2 + ri * (cardH + gapY);
    const rowTotalW = row.length * cardW + (row.length - 1) * gapX;
    const rowStartX = cx - rowTotalW / 2;

    row.forEach((label, ci) => {
      const cardX   = rowStartX + ci * (cardW + gapX);
      const absIdx  = ri * topCount + ci;
      const c       = palCol(primary, absIdx);

      // Card background
      ctx.save(); shadow(ctx, 12, 0.09);
      ctx.beginPath(); ctx.roundRect(cardX, rowY, cardW, cardH, 10 * u);
      ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.restore(); noShadow(ctx);

      // Hexagon shape at top of card
      const hx = cardX + cardW / 2;
      const hy = rowY + cardH * 0.38;
      ctx.save();
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3 - Math.PI / 6;
        const px = hx + hexR * Math.cos(a);
        const py = hy + hexR * Math.sin(a);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = c; ctx.fill();
      ctx.restore();

      // Icon inside hexagon (simple white shape)
      ctx.save();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.8 * u;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const iconFns = [drawIconCheck, drawIconStar, drawIconZap, drawIconShield, drawIconGlobe];
      (iconFns[absIdx % iconFns.length])(ctx, hx, hy, 9 * u);
      ctx.restore();

      // Label below hexagon — no line limit
      ctx.save();
      ctx.font = `600 ${9 * u}px Inter`;
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      fillWrapped(ctx, label, hx, rowY + cardH * 0.72, cardW - 8 * u, 12 * u, 4);
      ctx.restore();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Inline icon drawers (stroked paths, all centered at cx,cy with radius r)
// ═══════════════════════════════════════════════════════════════════════════════

function drawIconCheck(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.7, cy);
  ctx.lineTo(cx - r * 0.15, cy + r * 0.6);
  ctx.lineTo(cx + r * 0.7, cy - r * 0.55);
  ctx.stroke();
}
function drawIconStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const rad   = i % 2 === 0 ? r : r * 0.45;
    const px    = cx + rad * Math.cos(angle), py = cy + rad * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.stroke();
}
function drawIconZap(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.2, cy - r);
  ctx.lineTo(cx - r * 0.4, cy + r * 0.1);
  ctx.lineTo(cx + r * 0.1, cy + r * 0.1);
  ctx.lineTo(cx - r * 0.2, cy + r);
  ctx.stroke();
}
function drawIconShield(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r * 0.8, cy - r * 0.4);
  ctx.lineTo(cx + r * 0.8, cy + r * 0.2);
  ctx.quadraticCurveTo(cx + r * 0.8, cy + r, cx, cy + r);
  ctx.quadraticCurveTo(cx - r * 0.8, cy + r, cx - r * 0.8, cy + r * 0.2);
  ctx.lineTo(cx - r * 0.8, cy - r * 0.4);
  ctx.closePath(); ctx.stroke();
}
function drawIconGlobe(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.5, r, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
}
