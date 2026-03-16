import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { drawBulletedFeatureList } from './base/drawBulletedFeatureList';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#E74C3C';
const TEXT_X = 60;
const TEXT_MAX_WIDTH = 420;

export function socRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 1416;
  const H = 748;
  const { headline, subtitle, variant, stepItems, selectedIcons, customIconImages, stockImage, logoImages, sourceContent } = state;

  // 1. Background
  if (stockImage) {
    coverFitImage(ctx, stockImage, W, H);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#F8F0F0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Right-zone content illustration
    const profile = analyzeContent(headline, subtitle, sourceContent);
    drawSharedIllustration(ctx, profile.visualType, 980, 374, 360, PRIMARY, profile.points, profile.numbers);
  }

  // Left-zone overlay (text zone only)
  const fadeWidth = (state.overlayPosition / 100) * W;
  drawGradientOverlay(ctx, W, H, fadeWidth, state.overlayOpacity / 100, state.overlayColor);

  // 3. Text zone
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Pre-wrap to measure block height
  ctx.font = `600 40px Poppins`;
  const headLines = wrapText(ctx, headline, TEXT_MAX_WIDTH);
  ctx.font = `500 26px Poppins`;
  const subLines = wrapText(ctx, subtitle, TEXT_MAX_WIDTH);

  const barH = 5;
  const barToHead = 20;
  const lineH = 52;
  const headToSub = 16;
  const subLineH = 36;
  const textH = barH + barToHead + headLines.length * lineH + headToSub + subLines.length * subLineH;

  // Calculate variant content height so the full block is properly centered
  const totalIconCount = selectedIcons.length + customIconImages.filter(Boolean).length;

  let variantH = 0;
  if (variant === 'typeA' && totalIconCount > 0) {
    const rows = Math.ceil(totalIconCount / 4);
    variantH = 20 + rows * 72 + (rows - 1) * 24;
  } else if (variant === 'typeB') {
    variantH = 16 + 2 * 80 + 12; // 2 rows × 80px + gap
  } else if (variant === 'typeD' && stepItems.length > 0) {
    variantH = 20 + Math.min(stepItems.length, 5) * 38;
  }

  const totalH = textH + variantH;
  const startY = state.contentAlignment === 'top' ? 60 : Math.round((H - totalH) / 2);


  // Headline
  ctx.font = `600 40px Poppins`;
  ctx.fillStyle = '#1A1A2E';
  let headY = startY + barH + barToHead;
  for (const line of headLines) {
    ctx.fillText(line, TEXT_X, headY);
    headY += lineH;
  }

  // Subtitle
  ctx.font = `500 26px Poppins`;
  ctx.fillStyle = '#4A5568';
  let subY = headY + headToSub;
  for (const line of subLines) {
    ctx.fillText(line, TEXT_X, subY);
    subY += subLineH;
  }

  // 4. Variant content — all drawn below subtitle
  if (variant === 'typeA') {
    drawIconGrid(ctx, selectedIcons, customIconImages, TEXT_X, subY + 20, PRIMARY);
  } else if (variant === 'typeB') {
    drawLogoGrid(ctx, TEXT_X, subY + 16, PRIMARY, state.socLogoGridImages);
  } else if (variant === 'typeD' && stepItems.length > 0) {
    drawBulletedFeatureList(ctx, stepItems.slice(0, 5), TEXT_X, subY + 20, TEXT_MAX_WIDTH, PRIMARY);
  }

  // 6. Logo — full canvas overlay
  const logo = logoImages['soc'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

function drawLogoGrid(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  _primary: string,
  uploadedImages: (HTMLImageElement | null)[] = [],
): void {
  const cellW = 126;
  const cellH = 80;
  const gap = 12;
  const techNames = ['Logo 1', 'Logo 2', 'Logo 3', 'Logo 4', 'Logo 5', 'Logo 6'];
  const colors = ['#61DAFB', '#339933', '#3178C6', '#2496ED', '#FF9900', '#47A248'];

  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * (cellW + gap);
    const y = startY + row * (cellH + gap);

    // Cell background
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    const img = uploadedImages[i];
    if (img) {
      // Draw uploaded logo image, contained within cell with padding
      const pad = 12;
      const maxW = cellW - pad * 2;
      const maxH = cellH - pad * 2;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = x + (cellW - dw) / 2;
      const dy = y + (cellH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      // Placeholder text
      ctx.font = '700 13px Inter';
      ctx.fillStyle = colors[i];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(techNames[i], x + cellW / 2, y + cellH / 2);
    }
  }
}


function drawIconGrid(
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

  const badgeR = 36;
  const iconSize = 22;
  const colGap = 18;
  const rowGap = 24;
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
        if (shapes) drawIcon(ctx, shapes, cx, cy, iconSize, '#FFFFFF');
      } else {
        const size = badgeR * 2;
        ctx.drawImage(badge.img, cx - size / 2, cy - size / 2, size, size);
      }
    });
  });
}

function coverFitImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
}
