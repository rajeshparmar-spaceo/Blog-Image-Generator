import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { drawBulletedFeatureList } from './base/drawBulletedFeatureList';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#2B7DE9';
const TEXT_X = 50;
const TEXT_MAX_WIDTH = 360;

export function mcbRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 1000;
  const H = 500;
  const { headline, subtitle, variant, stepItems, selectedIcons, customIconImages, stockImage, logoImages, sourceContent, socLogoGridImages } = state;

  // 1. Background: stockImage cover-fit OR white→lightblue gradient
  if (stockImage) {
    coverFitImage(ctx, stockImage, W, H);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#F0F4F8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Right-zone content illustration
    const profile = analyzeContent(headline, subtitle, sourceContent);
    drawSharedIllustration(ctx, profile.visualType, 730, 250, 260, PRIMARY, profile.points, profile.numbers);
  }

  // 2. Left-zone overlay (text zone only)
  const fadeWidth = (state.overlayPosition / 100) * W;
  drawGradientOverlay(ctx, W, H, fadeWidth, state.overlayOpacity / 100, state.overlayColor);

  // 3. Text zone
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Pre-wrap to measure block height
  ctx.font = `700 32px Poppins`;
  const headLines = wrapText(ctx, headline, TEXT_MAX_WIDTH);
  ctx.font = `400 18px Poppins`;
  const subLines = wrapText(ctx, subtitle, TEXT_MAX_WIDTH);

  const barH = 4;
  const barToHead = 16;
  const lineH = 42;
  const headToSub = 12;
  const subLineH = 26;
  const textH = barH + barToHead + headLines.length * lineH + headToSub + subLines.length * subLineH;

  const totalIconCount = selectedIcons.length + customIconImages.filter(Boolean).length;

  let variantH = 0;
  if (variant === 'typeA' && totalIconCount > 0) {
    variantH = 14 + Math.ceil(totalIconCount / 4) * 52 + (Math.ceil(totalIconCount / 4) - 1) * 14;
  } else if (variant === 'typeB') {
    variantH = 14 + 2 * 64 + 10; // 2 rows × 64px + gap
  } else if (variant === 'typeD' && stepItems.length > 0) {
    variantH = 14 + Math.min(stepItems.length, 5) * 36;
  }

  const totalH = textH + variantH;
  const startY = state.contentAlignment === 'top' ? 40 : Math.round((H - totalH) / 2);


  // Headline
  ctx.font = `700 32px Poppins`;
  ctx.fillStyle = '#1A1A2E';
  let headY = startY + barH + barToHead;
  for (const line of headLines) {
    ctx.fillText(line, TEXT_X, headY);
    headY += lineH;
  }

  // Subtitle
  ctx.font = `400 18px Poppins`;
  ctx.fillStyle = '#4A5568';
  let subY = headY + headToSub;
  for (const line of subLines) {
    ctx.fillText(line, TEXT_X, subY);
    subY += subLineH;
  }

  // 4. Type-specific content
  if (variant === 'typeA') {
    drawIconBadges(ctx, selectedIcons, customIconImages, TEXT_X, subY + 14, PRIMARY);
  } else if (variant === 'typeB') {
    drawLogoGrid(ctx, TEXT_X, subY + 14, socLogoGridImages);
  } else if (variant === 'typeD' && stepItems.length > 0) {
    drawBulletedFeatureList(ctx, stepItems.slice(0, 5), TEXT_X, subY + 14, TEXT_MAX_WIDTH, PRIMARY);
  }

  // 6. Logo — full canvas overlay
  const logo = logoImages['mcb'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

function drawLogoGrid(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  uploadedImages: (HTMLImageElement | null)[] = [],
): void {
  const cellW = 100;
  const cellH = 64;
  const gap = 10;
  const techNames = ['Logo 1', 'Logo 2', 'Logo 3', 'Logo 4', 'Logo 5', 'Logo 6'];
  const colors = ['#61DAFB', '#339933', '#3178C6', '#2496ED', '#FF9900', '#47A248'];

  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * (cellW + gap);
    const y = startY + row * (cellH + gap);

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    const img = uploadedImages[i];
    if (img) {
      const pad = 10;
      const scale = Math.min((cellW - pad * 2) / img.width, (cellH - pad * 2) / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, x + (cellW - dw) / 2, y + (cellH - dh) / 2, dw, dh);
    } else {
      ctx.font = '700 11px Inter';
      ctx.fillStyle = colors[i];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(techNames[i], x + cellW / 2, y + cellH / 2);
    }
  }
}

function drawIconBadges(
  ctx: CanvasRenderingContext2D,
  selectedIcons: EditorState['selectedIcons'],
  customImages: (HTMLImageElement | null)[],
  startX: number,
  startY: number,
  primary: string,
): void {
  type Badge = { kind: 'lucide'; cfg: EditorState['selectedIcons'][number] } | { kind: 'custom'; img: HTMLImageElement };
  const badges: Badge[] = [
    ...selectedIcons.map((cfg) => ({ kind: 'lucide' as const, cfg })),
    ...customImages.filter((img): img is HTMLImageElement => img !== null).map((img) => ({ kind: 'custom' as const, img })),
  ];
  if (badges.length === 0) return;

  const badgeR = 26;
  const colGap = 14;
  const rowGap = 14;
  const maxPerRow = 4;
  const itemSlot = badgeR * 2 + colGap;

  const rows: typeof badges[] = [];
  for (let i = 0; i < badges.length; i += maxPerRow) {
    rows.push(badges.slice(i, i + maxPerRow));
  }

  rows.forEach((row, rowIdx) => {
    const cy = startY + badgeR + rowIdx * (badgeR * 2 + rowGap);
    row.forEach((badge, colIdx) => {
      const cx = startX + colIdx * itemSlot + badgeR;
      if (badge.kind === 'lucide') {
        ctx.beginPath();
        ctx.arc(cx, cy, badgeR, 0, Math.PI * 2);
        ctx.fillStyle = primary;
        ctx.fill();
        const shapes = ICONS[badge.cfg.iconName];
        if (shapes) drawIcon(ctx, shapes, cx, cy, Math.round(badgeR * 0.6), '#FFFFFF');
      } else {
        const size = badgeR * 2;
        ctx.drawImage(badge.img, cx - size / 2, cy - size / 2, size, size);
      }
    });
  });
}

function coverFitImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = (w - sw) / 2;
  const sy = (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

