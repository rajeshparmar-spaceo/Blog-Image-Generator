import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { drawBulletedFeatureList } from './base/drawBulletedFeatureList';
import { getBrandCanvasSize } from '../constants/brands';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#A3C423';

export function soiRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const { width: W, height: H } = getBrandCanvasSize('soi', state.soiSize);
  const isWide = state.soiSize === 'wide';

  const TEXT_X = isWide ? 55 : 22;
  const TEXT_MAX_WIDTH = isWide ? 500 : 270;
  const headFontSize = isWide ? 38 : 26;
  const subFontSize = isWide ? 20 : 15;

  const { headline, subtitle, variant, stepItems, selectedIcons, customIconImages, stockImage, logoImages, sourceContent, socLogoGridImages } = state;

  // 1. Background
  if (stockImage) {
    coverFitImage(ctx, stockImage, W, H);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#FAFFF0');
    bgGrad.addColorStop(1, '#F0F8E0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Right-zone content illustration
    const profile = analyzeContent(headline, subtitle, sourceContent);
    const ilCx = isWide ? 960 : 462;
    const ilCy = isWide ? 374 : 187;
    const ilSize = isWide ? 360 : 195;
    drawSharedIllustration(ctx, profile.visualType, ilCx, ilCy, ilSize, PRIMARY, profile.points, profile.numbers);
  }

  // 2. Left-zone overlay
  const fadeWidth = (state.overlayPosition / 100) * W;
  drawGradientOverlay(ctx, W, H, fadeWidth, state.overlayOpacity / 100, state.overlayColor);

  // 3. Text zone
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Pre-wrap to measure block height
  ctx.font = `600 ${headFontSize}px Poppins`;
  const headLines = wrapText(ctx, headline, TEXT_MAX_WIDTH);
  ctx.font = `400 ${subFontSize}px Poppins`;
  const subLines = wrapText(ctx, subtitle, TEXT_MAX_WIDTH);

  const barH = isWide ? 4 : 3;
  const barToHead = isWide ? 16 : 9;
  const lineH = isWide ? 50 : 34;
  const headToSub = isWide ? 14 : 8;
  const subLineH = isWide ? 28 : 20;
  const textH = barH + barToHead + headLines.length * lineH + headToSub + subLines.length * subLineH;
  const totalIconCount = selectedIcons.length + customIconImages.filter(Boolean).length;

  let variantH = 0;
  if (variant === 'typeA' && totalIconCount > 0) {
    variantH = 12 + Math.ceil(totalIconCount / 4) * (isWide ? 60 : 40) + (Math.ceil(totalIconCount / 4) - 1) * 14;
  } else if (variant === 'typeB') {
    variantH = isWide ? (16 + 2 * 76 + 12) : (12 + 2 * 46 + 8);
  } else if (variant === 'typeD' && stepItems.length > 0) {
    variantH = 12 + Math.min(stepItems.length, 5) * 36;
  }
  const totalH = textH + variantH;
  const startY = state.contentAlignment === 'top' ? (isWide ? 55 : 30) : Math.round((H - totalH) / 2);


  // Headline
  ctx.font = `600 ${headFontSize}px Poppins`;
  ctx.fillStyle = '#1A1A2E';
  let headY = startY + barH + barToHead;
  for (const line of headLines) {
    ctx.fillText(line, TEXT_X, headY);
    headY += lineH;
  }

  // Subtitle
  ctx.font = `400 ${subFontSize}px Poppins`;
  ctx.fillStyle = '#4A5568';
  let subY = headY + headToSub;
  for (const line of subLines) {
    ctx.fillText(line, TEXT_X, subY);
    subY += subLineH;
  }

  // 4. Variant content
  if (variant === 'typeA') {
    drawIconBadges(ctx, selectedIcons, customIconImages, TEXT_X, subY + 12, PRIMARY, isWide);
  } else if (variant === 'typeB') {
    drawLogoGrid(ctx, TEXT_X, subY + 12, socLogoGridImages, isWide);
  } else if (variant === 'typeD' && stepItems.length > 0) {
    drawBulletedFeatureList(ctx, stepItems.slice(0, 5), TEXT_X, subY + 12, TEXT_MAX_WIDTH, PRIMARY);
  }

  // 5. Logo — full canvas overlay (standard: 708×374 native, wide: scaled to 1400×748)
  const logo = logoImages['soi'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

function drawLogoGrid(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  uploadedImages: (HTMLImageElement | null)[] = [],
  isWide: boolean = false,
): void {
  const cellW = isWide ? 120 : 70;
  const cellH = isWide ? 76 : 46;
  const gap = isWide ? 12 : 8;
  const techNames = ['Logo 1', 'Logo 2', 'Logo 3', 'Logo 4', 'Logo 5', 'Logo 6'];
  const colors = ['#61DAFB', '#339933', '#3178C6', '#2496ED', '#FF9900', '#47A248'];

  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * (cellW + gap);
    const y = startY + row * (cellH + gap);

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = isWide ? 10 : 8;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, isWide ? 10 : 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    const img = uploadedImages[i];
    if (img) {
      const pad = isWide ? 10 : 8;
      const scale = Math.min((cellW - pad * 2) / img.width, (cellH - pad * 2) / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, x + (cellW - dw) / 2, y + (cellH - dh) / 2, dw, dh);
    } else {
      ctx.font = `700 ${isWide ? 12 : 10}px Inter`;
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
  isWide: boolean,
): void {
  type Badge = { kind: 'lucide'; cfg: EditorState['selectedIcons'][number] } | { kind: 'custom'; img: HTMLImageElement };
  const badges: Badge[] = [
    ...selectedIcons.map((cfg) => ({ kind: 'lucide' as const, cfg })),
    ...customImages.filter((img): img is HTMLImageElement => img !== null).map((img) => ({ kind: 'custom' as const, img })),
  ];
  if (badges.length === 0) return;

  const badgeR = isWide ? 30 : 20;
  const colGap = isWide ? 16 : 12;
  const rowGap = isWide ? 14 : 12;
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

function coverFitImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
}
