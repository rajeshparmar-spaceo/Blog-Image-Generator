import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#2ECC71';
const TEXT_X = 22;
const TEXT_MAX_WIDTH = 200;
const FADE_WIDTH = 235;

export function soaRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 708;
  const H = 374;
  const { headline, subtitle, variant, selectedIcons, stockImage, logoImages, sourceContent } = state;

  // 1. Background
  if (stockImage) {
    coverFitImage(ctx, stockImage, W, H);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#F0FFF4');
    bgGrad.addColorStop(1, '#E6FFEE');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Right-zone content illustration
    const profile = analyzeContent(headline, subtitle, sourceContent);
    drawSharedIllustration(ctx, profile.visualType, 462, 187, 195, PRIMARY, profile.points, profile.numbers);
  }

  // Left-zone overlay (text zone only)
  const fadeWidth = (state.overlayPosition / 100) * W;
  drawGradientOverlay(ctx, W, H, fadeWidth, state.overlayOpacity / 100, state.overlayColor);

  // 3. Text zone — narrow maxWidth forces word stacking
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Pre-wrap to measure block height
  ctx.font = `600 28px Poppins`;
  const headLines = wrapText(ctx, headline, 210);
  ctx.font = `400 16px Poppins`;
  const subLines = wrapText(ctx, subtitle, TEXT_MAX_WIDTH);

  const barH = 3;
  const barToHead = 12;
  const lineH = 36;
  const headToSub = 8;
  const subLineH = 22;
  const totalH = barH + barToHead + headLines.length * lineH + headToSub + subLines.length * subLineH;
  const startY = Math.round((H - totalH) / 2);


  // Headline — narrow maxWidth = 210px stacks words
  ctx.font = `600 28px Poppins`;
  ctx.fillStyle = '#1A1A2E';
  let headY = startY + barH + barToHead;
  for (const line of headLines) {
    ctx.fillText(line, TEXT_X, headY);
    headY += lineH;
  }

  // Subtitle
  ctx.font = `400 16px Poppins`;
  ctx.fillStyle = '#4A5568';
  let subY = headY + headToSub;
  for (const line of subLines) {
    ctx.fillText(line, TEXT_X, subY);
    subY += subLineH;
  }

  // 4. Variant-specific overlays
  if (variant === 'typeB') {
    drawChatWindowCard(ctx, W, H, PRIMARY);
  } else if (variant === 'typeC') {
    drawProductCard(ctx, W, H, PRIMARY);
  }

  // 5. Icons
  if (selectedIcons.length > 0) {
    selectedIcons.slice(0, 3).forEach((iconCfg, i) => {
      const shapes = ICONS[iconCfg.iconName];
      if (shapes) {
        const x = FADE_WIDTH + 30 + i * 80;
        const y = H / 2;
        drawIcon(ctx, shapes, x, y, 22, '#FFFFFF', PRIMARY, 26);
      }
    });
  }

  // 6. Logo — full canvas overlay
  const logo = logoImages['soa'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

function drawChatWindowCard(ctx: CanvasRenderingContext2D, W: number, H: number, primary: string): void {
  const cx = W * 0.68;
  const cy = H * 0.45;
  const cw = 200;
  const ch = 150;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, 12);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // Header strip
  ctx.beginPath();
  ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, 32, [12, 12, 0, 0]);
  ctx.fillStyle = primary;
  ctx.fill();

  ctx.font = '600 11px Inter';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Customer Chat', cx, cy - ch / 2 + 16);

  // Fake message lines
  const lines = [
    { x: cx - cw / 2 + 10, w: cw * 0.6, top: true },
    { x: cx, w: cw * 0.45, top: false },
    { x: cx - cw / 2 + 10, w: cw * 0.5, top: true },
  ];
  lines.forEach((l, i) => {
    ctx.beginPath();
    ctx.roundRect(l.x, cy - ch / 2 + 42 + i * 26, l.w, 14, 7);
    ctx.fillStyle = l.top ? '#F0F8F4' : '#E8F8EE';
    ctx.fill();
  });
}

function drawProductCard(ctx: CanvasRenderingContext2D, W: number, H: number, primary: string): void {
  const cx = W * 0.72;
  const cy = H * 0.5;
  const cw = 180;
  const ch = 200;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, 14);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // Product image area
  ctx.beginPath();
  ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch * 0.55, [14, 14, 0, 0]);
  ctx.fillStyle = `${primary}22`;
  ctx.fill();

  // App icon placeholder
  ctx.beginPath();
  ctx.arc(cx, cy - ch / 2 + ch * 0.28, 28, 0, Math.PI * 2);
  ctx.fillStyle = primary;
  ctx.fill();

  ctx.font = '600 12px Inter';
  ctx.fillStyle = '#1A1A2E';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Mobile App', cx, cy - ch / 2 + ch * 0.6);

  ctx.font = '400 10px Inter';
  ctx.fillStyle = '#888888';
  ctx.fillText('★★★★★ 4.9', cx, cy - ch / 2 + ch * 0.75);
}

function coverFitImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
}
