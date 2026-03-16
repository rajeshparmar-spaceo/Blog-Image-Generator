import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { drawNumberedStepList } from './base/drawNumberedStepList';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#2B7DE9';
const FADE_WIDTH = 480;
const TEXT_X = 50;
const TEXT_MAX_WIDTH = 360;

export function mcbRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 1000;
  const H = 500;
  const { headline, subtitle, variant, stepItems, selectedIcons, stockImage, logoImages, sourceContent } = state;

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
  drawGradientOverlay(ctx, W, H, FADE_WIDTH, 0.95);

  // 3. Text zone
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Pre-wrap to measure block height
  ctx.font = `700 32px Poppins`;
  const headLines = wrapText(ctx, headline, TEXT_MAX_WIDTH).slice(0, 3);
  ctx.font = `400 18px Poppins`;
  const subLines = wrapText(ctx, subtitle, TEXT_MAX_WIDTH).slice(0, 3);

  const barH = 4;
  const barToHead = 16;
  const lineH = 42;
  const headToSub = 12;
  const subLineH = 26;
  const totalH = barH + barToHead + headLines.length * lineH + headToSub + subLines.length * subLineH;
  const startY = Math.round((H - totalH) / 2);

  // Blue accent bar
  ctx.fillStyle = PRIMARY;
  ctx.fillRect(TEXT_X, startY, 40, barH);

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
  if (variant === 'typeC' && stepItems.length > 0) {
    drawNumberedStepList(ctx, stepItems.slice(0, 5), TEXT_X, subY + 14, TEXT_MAX_WIDTH, PRIMARY);
  }

  // 5. Floating icons (TypeA or TypeB)
  if ((variant === 'typeA' || variant === 'typeB') && selectedIcons.length > 0) {
    // Place icons between text zone and right side
    const iconZoneX = FADE_WIDTH - 40;
    const iconPositions = getAutoIconPositions(selectedIcons.length, iconZoneX, W - 120, 60, H - 60);
    selectedIcons.slice(0, 4).forEach((iconCfg, i) => {
      const shapes = ICONS[iconCfg.iconName];
      if (shapes) {
        const pos = iconPositions[i];
        drawIcon(ctx, shapes, pos.x, pos.y, 24, '#FFFFFF', PRIMARY, 28);
      }
    });
  }

  // 6. Logo — full canvas overlay
  const logo = logoImages['mcb'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
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

function getAutoIconPositions(
  count: number,
  startX: number,
  endX: number,
  startY: number,
  endY: number,
): Array<{ x: number; y: number }> {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    positions.push({
      x: startX + (endX - startX) * (0.2 + t * 0.6),
      y: startY + (endY - startY) * (0.2 + ((i % 2) * 0.4 + 0.2)),
    });
  }
  return positions;
}
