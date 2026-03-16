import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { drawChatBubbles } from './base/drawChatBubbles';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#004CE6';

export function welcoRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 800;
  const H = 600;
  const { headline, subtitle, variant, selectedIcons, logoImages, sourceContent } = state;

  // 1. Background
  if (variant === 'typeB2') {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#B2E8FF');
    grad.addColorStop(0.5, '#80AAFF');
    grad.addColorStop(1, '#F0B2FF');
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = '#E4ECF7';
  }
  ctx.fillRect(0, 0, W, H);

  // 2. Faint grid lines in bottom 200px
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = '#D0DAE8';
  ctx.lineWidth = 1;
  for (let y = H - 200; y < H; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, H - 200);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Centered headline
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '600 30px Inter';
  ctx.fillStyle = '#000000';
  const headLines = wrapText(ctx, headline, 650);
  let headY = 50;
  for (const line of headLines) {
    ctx.fillText(line, W / 2, headY);
    headY += 40;
  }

  // Subtitle (smaller, below headline)
  ctx.font = '400 16px Inter';
  ctx.fillStyle = '#444444';
  const subLines = wrapText(ctx, subtitle, 600);
  for (const line of subLines) {
    ctx.fillText(line, W / 2, headY + 6);
    headY += 24;
  }

  // 4. Central visual by variant
  const centralY = headY + 30;

  if (variant === 'typeA1' || variant === 'typeA2') {
    drawChatScene(ctx, state, W, H, centralY, variant);
  } else if (variant === 'typeB1') {
    drawLogoCircles(ctx, W, H, centralY);
  } else if (variant === 'typeB2') {
    drawIconScatter(ctx, W, H, centralY, selectedIcons);
  }

  // Content illustration: shown when sourceContent provided, overlaid in available space
  if (sourceContent.trim()) {
    const profile = analyzeContent(headline, subtitle, sourceContent);
    const ilY = centralY + 20;
    const ilH = H - ilY - 50;
    drawSharedIllustration(ctx, profile.visualType, W / 2, ilY + ilH / 2, Math.min(220, ilH), PRIMARY, profile.points, profile.numbers);
  }

  // 5. Accent icons if selected (TypeA variants)
  if ((variant === 'typeA1' || variant === 'typeA2') && selectedIcons.length > 0) {
    const accentPositions = [
      { x: 60, y: H - 140 },
      { x: W - 60, y: H - 160 },
      { x: 60, y: H - 230 },
    ];
    selectedIcons.slice(0, 3).forEach((iconCfg, i) => {
      const pos = accentPositions[i] ?? { x: iconCfg.x, y: iconCfg.y };
      const shapes = ICONS[iconCfg.iconName];
      if (shapes) {
        drawIcon(ctx, shapes, pos.x, pos.y, 22, '#FFFFFF', PRIMARY, 24);
      }
    });
  }

  // 6. Logo — bottom-right
  const logo = logoImages['welco'];
  if (logo) {
    const lw = 88;
    const lh = (logo.height / logo.width) * lw;
    ctx.drawImage(logo, W - lw - 25, H - lh - 25, lw, lh);
  }
}

function drawChatScene(
  ctx: CanvasRenderingContext2D,
  state: EditorState,
  W: number,
  _H: number,
  startY: number,
  variant: string,
): void {
  const { chatLines, stockImage } = state;
  const panelX = variant === 'typeA2' ? 80 : W / 2 - 180;
  const panelW = 360;
  const panelH = 240;

  // Chat window panel
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.roundRect(panelX, startY, panelW, panelH, 16);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // Panel header
  const grad = ctx.createLinearGradient(panelX, startY, panelX + panelW, startY);
  grad.addColorStop(0, PRIMARY);
  grad.addColorStop(1, '#0066FF');
  ctx.beginPath();
  ctx.roundRect(panelX, startY, panelW, 44, [16, 16, 0, 0]);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.font = '600 13px Inter';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Live Chat Support', panelX + 16, startY + 22);

  // Status dot
  ctx.beginPath();
  ctx.arc(panelX + panelW - 20, startY + 22, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#4ADE80';
  ctx.fill();

  // Chat bubbles
  if (chatLines.length > 0) {
    drawChatBubbles(ctx, chatLines.slice(0, 3), panelX + 12, startY + 54, panelW - 24, PRIMARY);
  }

  // Stock photo for receptionist (typeA1) or typeA2
  if (stockImage) {
    const photoX = variant === 'typeA2' ? panelX + panelW + 20 : W - 210;
    const photoY = startY - 20;
    const photoW = 180;
    const photoH = photoW * 1.2;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, 12);
    ctx.clip();
    drawCoverImage(ctx, stockImage, photoX, photoY, photoW, photoH);
    ctx.restore();
  }
}

function drawLogoCircles(
  ctx: CanvasRenderingContext2D,
  W: number,
  _H: number,
  startY: number,
): void {
  const centerY = startY + 130;
  const mainR = 80;
  const smallR = 55;
  const spacing = 120;

  // Three overlapping circles
  const circles = [
    { cx: W / 2 - spacing, cy: centerY, r: smallR, color: '#E8F4FD', label: 'CRM' },
    { cx: W / 2, cy: centerY - 20, r: mainR, color: '#004CE6', label: 'Welco' },
    { cx: W / 2 + spacing, cy: centerY, r: smallR, color: '#E8F4FD', label: 'IVR' },
  ];

  // Draw circles (back to front)
  for (const c of circles) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,76,230,0.2)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.restore();

    ctx.font = c.color === '#004CE6' ? '700 16px Inter' : '600 13px Inter';
    ctx.fillStyle = c.color === '#004CE6' ? '#FFFFFF' : '#1A1A2E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(c.label, c.cx, c.cy);
  }

  // Connection lines
  ctx.save();
  ctx.strokeStyle = '#8BAEE8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  ctx.moveTo(circles[0].cx + smallR, circles[0].cy);
  ctx.lineTo(circles[1].cx - mainR, circles[1].cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(circles[1].cx + mainR, circles[1].cy);
  ctx.lineTo(circles[2].cx - smallR, circles[2].cy);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawIconScatter(
  ctx: CanvasRenderingContext2D,
  W: number,
  _H: number,
  startY: number,
  selectedIcons: EditorState['selectedIcons'],
): void {
  // Welco icon in center (largest)
  const centerX = W / 2;
  const centerY = startY + 120;

  // Central Welco square
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(centerX - 55, centerY - 55, 110, 110, 20);
  ctx.fillStyle = PRIMARY;
  ctx.fill();
  ctx.restore();

  ctx.font = '700 24px Inter';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W', centerX, centerY);

  // Scattered smaller icon tiles around center
  const scatter = [
    { x: centerX - 140, y: centerY - 50 },
    { x: centerX + 100, y: centerY - 60 },
    { x: centerX - 110, y: centerY + 70 },
    { x: centerX + 80, y: centerY + 80 },
    { x: centerX - 40, y: centerY - 110 },
    { x: centerX + 20, y: centerY + 130 },
  ];

  const scatterIcons = selectedIcons.length > 0
    ? selectedIcons.map((ic) => ic.iconName)
    : ['li_phone', 'li_mail', 'li_clock', 'li_users', 'li_message-circle', 'li_calendar'];

  scatter.forEach((pos, i) => {
    const iconName = scatterIcons[i % scatterIcons.length];
    const shapes = ICONS[iconName];
    const size = 52 + (i % 3) * 8;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(pos.x - size / 2, pos.y - size / 2, size, size, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    if (shapes) {
      drawIcon(ctx, shapes, pos.x, pos.y, 22, PRIMARY);
    }
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}
