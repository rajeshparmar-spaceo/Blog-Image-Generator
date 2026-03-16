import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { drawBulletedFeatureList } from './base/drawBulletedFeatureList';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#E74C3C';
const FADE_WIDTH = 550;
const TEXT_X = 60;
const TEXT_MAX_WIDTH = 420;

export function socRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 1416;
  const H = 748;
  const { headline, subtitle, variant, stepItems, selectedIcons, stockImage, logoImages, sourceContent } = state;

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
  drawGradientOverlay(ctx, W, H, FADE_WIDTH, 0.95);

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
  const totalH = barH + barToHead + headLines.length * lineH + headToSub + subLines.length * subLineH;
  const startY = Math.round((H - totalH) / 2);


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

  // 4. Variant content
  if (variant === 'typeA') {
    // Circular icon badge — large centered icon in text zone
    if (selectedIcons.length > 0) {
      const iconCfg = selectedIcons[0];
      const shapes = ICONS[iconCfg.iconName];
      if (shapes) {
        drawIcon(ctx, shapes, TEXT_X + 60, subY + 80, 48, '#FFFFFF', PRIMARY, 56);
      }
    }
  } else if (variant === 'typeB') {
    drawLogoGrid(ctx, W, H, PRIMARY);
  } else if (variant === 'typeC') {
    drawPhoneMockup(ctx, W, H, subY, PRIMARY);
  } else if (variant === 'typeD' && stepItems.length > 0) {
    drawBulletedFeatureList(ctx, stepItems.slice(0, 5), TEXT_X, subY + 20, TEXT_MAX_WIDTH, PRIMARY);
  }

  // 5. Additional icons for TypeA
  if (variant === 'typeA' && selectedIcons.length > 1) {
    selectedIcons.slice(1, 5).forEach((iconCfg, i) => {
      const shapes = ICONS[iconCfg.iconName];
      if (shapes) {
        const x = FADE_WIDTH + 60 + (i % 2) * 180;
        const y = 160 + Math.floor(i / 2) * 180;
        drawIcon(ctx, shapes, x, y, 36, '#FFFFFF', PRIMARY, 42);
      }
    });
  }

  // 6. Logo — full canvas overlay
  const logo = logoImages['soc'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

function drawLogoGrid(ctx: CanvasRenderingContext2D, _W: number, _H: number, _primary: string): void {
  // 2×3 grid of tech logos (colored rectangles as placeholders)
  const gridX = FADE_WIDTH + 60;
  const gridY = 80;
  const cellW = 160;
  const cellH = 100;
  const gap = 20;
  const techNames = ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'MongoDB'];
  const colors = ['#61DAFB', '#339933', '#3178C6', '#2496ED', '#FF9900', '#47A248'];

  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = gridX + col * (cellW + gap);
    const y = gridY + row * (cellH + gap);

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.font = '700 14px Inter';
    ctx.fillStyle = colors[i];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(techNames[i], x + cellW / 2, y + cellH / 2);
  }
}

function drawPhoneMockup(
  ctx: CanvasRenderingContext2D,
  _W: number,
  H: number,
  _textY: number,
  primary: string,
): void {
  const phoneX = FADE_WIDTH + 100;
  const phoneY = 60;
  const phoneW = 220;
  const phoneH = H - 130;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 30);
  ctx.fillStyle = '#1A1A2E';
  ctx.fill();
  ctx.restore();

  // Screen
  ctx.beginPath();
  ctx.roundRect(phoneX + 8, phoneY + 16, phoneW - 16, phoneH - 30, 22);
  ctx.fillStyle = '#F8F9FA';
  ctx.fill();

  // App header
  ctx.beginPath();
  ctx.roundRect(phoneX + 8, phoneY + 16, phoneW - 16, 44, [22, 22, 0, 0]);
  ctx.fillStyle = primary;
  ctx.fill();

  ctx.font = '600 12px Inter';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('App Name', phoneX + phoneW / 2, phoneY + 38);

  // Notch
  ctx.beginPath();
  ctx.roundRect(phoneX + phoneW / 2 - 30, phoneY + 6, 60, 12, 6);
  ctx.fillStyle = '#2A2A3E';
  ctx.fill();
}

function coverFitImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
}
