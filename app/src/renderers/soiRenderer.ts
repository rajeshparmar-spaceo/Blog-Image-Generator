import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { getBrandCanvasSize } from '../constants/brands';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#A3C423';

export function soiRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const { width: W, height: H } = getBrandCanvasSize('soi', state.soiSize);
  const isWide = state.soiSize === 'wide';

  const FADE_WIDTH = isWide ? 520 : 260;
  const TEXT_X = isWide ? 55 : 22;
  const TEXT_MAX_WIDTH = isWide ? 400 : 210;
  const headFontSize = isWide ? 38 : 26;
  const subFontSize = isWide ? 20 : 15;

  const { headline, subtitle, variant, selectedIcons, stockImage, logoImages, sourceContent } = state;

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
  const totalH = barH + barToHead + headLines.length * lineH + headToSub + subLines.length * subLineH;
  const startY = Math.round((H - totalH) / 2);


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
  if (variant === 'typeB') {
    drawConnectorLines(ctx, W, H, FADE_WIDTH, PRIMARY, isWide);
  } else if (variant === 'typeC') {
    drawIconGrid(ctx, W, H, FADE_WIDTH, selectedIcons, PRIMARY, isWide);
  } else if (variant === 'typeA' && selectedIcons.length > 0) {
    selectedIcons.slice(0, 4).forEach((iconCfg, i) => {
      const shapes = ICONS[iconCfg.iconName];
      if (shapes) {
        const spacing = isWide ? 90 : 60;
        const x = FADE_WIDTH + spacing + i * spacing * 1.1;
        const y = H / 2;
        const size = isWide ? 28 : 20;
        drawIcon(ctx, shapes, x, y, size, '#FFFFFF', PRIMARY, size * 1.2);
      }
    });
  }

  // 5. Logo — full canvas overlay (standard: 708×374 native, wide: scaled to 1400×748)
  const logo = logoImages['soi'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

function drawConnectorLines(
  ctx: CanvasRenderingContext2D,
  _W: number,
  H: number,
  fadeWidth: number,
  primary: string,
  isWide: boolean,
): void {
  const nodeCount = 4;
  const spacing = isWide ? 140 : 90;
  const startX = fadeWidth + (isWide ? 60 : 30);
  const centerY = H / 2;
  const nodeR = isWide ? 20 : 14;

  ctx.strokeStyle = primary;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  for (let i = 0; i < nodeCount - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(startX + i * spacing + nodeR, centerY);
    ctx.lineTo(startX + (i + 1) * spacing - nodeR, centerY);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  for (let i = 0; i < nodeCount; i++) {
    const nx = startX + i * spacing;
    ctx.beginPath();
    ctx.arc(nx, centerY, nodeR, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? primary : '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = `700 ${isWide ? 13 : 10}px Inter`;
    ctx.fillStyle = i === 0 ? '#FFFFFF' : primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), nx, centerY);
  }
}

function drawIconGrid(
  ctx: CanvasRenderingContext2D,
  _W: number,
  _H: number,
  fadeWidth: number,
  selectedIcons: EditorState['selectedIcons'],
  primary: string,
  isWide: boolean,
): void {
  const cols = isWide ? 3 : 2;
  const iconR = isWide ? 32 : 24;
  const spacing = isWide ? 90 : 65;
  const startX = fadeWidth + (isWide ? 80 : 40);
  const startY = 100;

  const iconNames = selectedIcons.length > 0
    ? selectedIcons.map((ic) => ic.iconName)
    : ['li_star', 'li_zap', 'li_globe', 'li_shield', 'li_rocket', 'li_award'];

  for (let i = 0; i < Math.min(6, iconNames.length); i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = startX + col * spacing;
    const cy = startY + row * spacing;
    const shapes = ICONS[iconNames[i]];
    if (shapes) {
      drawIcon(ctx, shapes, cx, cy, iconR * 0.7, '#FFFFFF', primary, iconR);
    }
  }
}

function coverFitImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
}
