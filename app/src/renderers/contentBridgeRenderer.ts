import type { EditorState } from '../types';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { drawBulletedFeatureList } from './base/drawBulletedFeatureList';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#F67B37';
const DARK = '#1b2432';

export function contentBridgeRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 1416;
  const H = 748;

  if (state.variant === 'typeA') renderTypeA(ctx, W, H, state);
  else if (state.variant === 'typeB') renderTypeB(ctx, W, H, state);
  else if (state.variant === 'typeC') renderTypeC(ctx, W, H, state);
  else if (state.variant === 'typeD') renderTypeD(ctx, W, H, state);
  else if (state.variant === 'typeE') renderTypeE(ctx, W, H, state);

  // Logo overlay — full canvas
  const logo = state.logoImages['contentbridge'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

// ── Type A — Simple Image ────────────────────────────────────────────────────
function renderTypeA(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const { headline, subtitle, stockImage, cbTitlePosition, overlayDirection } = state;

  // Background
  if (stockImage) {
    coverFitImage(ctx, stockImage, W, H);
    const isTopBottom = overlayDirection === 'top-bottom';
    const fadeCoverage = (state.overlayPosition / 100) * (isTopBottom ? H : W);
    drawGradientOverlay(ctx, W, H, fadeCoverage, state.overlayOpacity / 100, state.overlayColor, overlayDirection);
  } else {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#FFFFFF');
    bg.addColorStop(1, '#FFF3EB');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  const isTopCenter = cbTitlePosition === 'top-center';
  const maxW = isTopCenter ? Math.round(W * 0.8) : Math.round(W * 0.4);

  ctx.font = `700 52px Poppins`;
  ctx.textBaseline = 'top';

  const lines = wrapText(ctx, headline, maxW);
  const lineH = 66;
  const blockH = lines.length * lineH;

  // Subtitle measurement
  const subLineH = 38;
  ctx.font = `400 28px Poppins`;
  const subLines = subtitle ? wrapText(ctx, subtitle, maxW) : [];
  const subBlockH = subLines.length > 0 ? subLines.length * subLineH + 16 : 0;
  const totalH = blockH + subBlockH;

  let startY: number;
  let startX: number;

  if (isTopCenter) {
    startY = 80;
    startX = W / 2;
    ctx.textAlign = 'center';
  } else {
    startY = Math.round((H - totalH) / 2);
    startX = 80;
    ctx.textAlign = 'left';
  }

  // Headline
  ctx.font = `700 52px Poppins`;
  ctx.fillStyle = DARK;
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, startX, y);
    y += lineH;
  }

  // Subtitle
  if (subLines.length > 0) {
    ctx.font = `400 28px Poppins`;
    ctx.fillStyle = stockImage ? 'rgba(30,30,30,0.85)' : '#4A5568';
    y += 16;
    for (const line of subLines) {
      ctx.fillText(line, startX, y);
      y += subLineH;
    }
  }
}

// ── Type B — UI Image ────────────────────────────────────────────────────────
function renderTypeB(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const {
    headline, subtitle, stockImage, cbTitlePosition,
    cbBgColor, cbBgColor2, cbBgType, cbBgGradientDir, cbImageOffsetX, cbImageOffsetY, sourceContent,
  } = state;

  const halfW = W / 2; // 708
  const isTopCenter = cbTitlePosition === 'top-center';

  // Background
  if (cbBgType === 'gradient') {
    let bg: CanvasGradient;
    if (cbBgGradientDir === 'top-bottom') {
      bg = ctx.createLinearGradient(0, 0, 0, H);
    } else if (cbBgGradientDir === 'diagonal') {
      bg = ctx.createLinearGradient(0, 0, W, H);
    } else {
      bg = ctx.createLinearGradient(0, 0, W, 0);
    }
    bg.addColorStop(0, cbBgColor);
    bg.addColorStop(1, cbBgColor2);
    ctx.fillStyle = bg;
  } else {
    ctx.fillStyle = cbBgColor;
  }
  ctx.fillRect(0, 0, W, H);

  if (isTopCenter) {
    // ── Top-Center layout ────────────────────────────────────────────────────
    // Title + subtitle centered across full canvas width at top
    const maxTextW = Math.round(W * 0.8);

    ctx.font = `700 46px Poppins`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    const headLines = wrapText(ctx, headline, maxTextW);
    const headLineH = 58;
    const blockH = headLines.length * headLineH;

    const subLineH = 34;
    ctx.font = `400 24px Poppins`;
    const subLines = subtitle ? wrapText(ctx, subtitle, maxTextW) : [];
    const subBlockH = subLines.length > 0 ? subLines.length * subLineH + 20 : 0;

    // Draw headline
    ctx.font = `700 46px Poppins`;
    ctx.fillStyle = DARK;
    let y = 50;
    for (const line of headLines) {
      ctx.fillText(line, W / 2, y);
      y += headLineH;
    }

    // Draw subtitle
    if (subLines.length > 0) {
      ctx.font = `400 24px Poppins`;
      ctx.fillStyle = '#4A5568';
      y += 20;
      for (const line of subLines) {
        ctx.fillText(line, W / 2, y);
        y += subLineH;
      }
    }

    // UI image — centered below text block
    const textEndY = y + 24;
    const availH = H - textEndY - 40;
    const availW = W - 120;

    if (stockImage) {
      const scale = Math.min(availW / stockImage.width, availH / stockImage.height);
      const dw = stockImage.width * scale;
      const dh = stockImage.height * scale;
      const imgX = (W - dw) / 2 + cbImageOffsetX;
      const imgY = textEndY + (availH - dh) / 2 + cbImageOffsetY;

      // Subtle drop shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 8;
      ctx.drawImage(stockImage, imgX, imgY, dw, dh);
      ctx.restore();
    } else {
      const profile = analyzeContent(headline, subtitle, sourceContent);
      const cx = W / 2 + cbImageOffsetX;
      const cy = textEndY + availH / 2 + cbImageOffsetY;
      drawSharedIllustration(ctx, profile.visualType, cx, cy, Math.min(availW, availH) * 0.7, PRIMARY, profile.points, profile.numbers);
    }

  } else {
    // ── Left-Center layout ───────────────────────────────────────────────────
    // UI image on right half, text on left half

    if (stockImage) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(halfW, 0, halfW, H);
      ctx.clip();
      coverFitImageRect(ctx, stockImage, halfW, 0, halfW, H);
      ctx.restore();

      // Soft left-edge shadow
      const shadowGrad = ctx.createLinearGradient(halfW, 0, halfW + 80, 0);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0.18)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(halfW, 0, 80, H);
    } else {
      const profile = analyzeContent(headline, subtitle, sourceContent);
      drawSharedIllustration(ctx, profile.visualType, halfW + halfW / 2, H / 2, halfW * 0.85, PRIMARY, profile.points, profile.numbers);
    }

    // Text — vertically centered in left half
    const maxTextW = Math.round(halfW - 140);

    ctx.font = `700 46px Poppins`;
    ctx.textBaseline = 'top';

    const headLines = wrapText(ctx, headline, maxTextW);
    const headLineH = 60;
    const blockH = headLines.length * headLineH;

    const subLineH = 34;
    ctx.font = `400 24px Poppins`;
    const subLines = subtitle ? wrapText(ctx, subtitle, maxTextW) : [];
    const subBlockH = subLines.length > 0 ? subLines.length * subLineH + 28 : 0;
    const totalTextH = blockH + subBlockH;

    const headY = Math.round((H - totalTextH) / 2);

    ctx.font = `700 46px Poppins`;
    ctx.fillStyle = DARK;
    ctx.textAlign = 'left';
    let y = headY;
    for (const line of headLines) {
      ctx.fillText(line, 70, y);
      y += headLineH;
    }

    if (subLines.length > 0) {
      ctx.font = `400 24px Poppins`;
      ctx.fillStyle = '#4A5568';
      y += 28;
      for (const line of subLines) {
        ctx.fillText(line, 70, y);
        y += subLineH;
      }
    }
  }
}

// ── Type C — Alternatives Tools ──────────────────────────────────────────────
function renderTypeC(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const { headline, stepItems, cbToolImages } = state;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(1, '#FFF3EB');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);


  // Title — top center
  ctx.font = `700 44px Poppins`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = DARK;
  const headLines = wrapText(ctx, headline, W - 200);
  let headY = 50;
  for (const line of headLines) {
    ctx.fillText(line, W / 2, headY);
    headY += 58;
  }


  // Tool cards — centered row
  const tools = cbToolImages.filter(Boolean).length;
  const toolCount = Math.max(1, Math.min(5, tools || stepItems.length || 3));
  const cardW = 180;
  const cardH = 140;
  const gap = 24;
  const totalW = toolCount * (cardW + gap) - gap;
  const startX = (W - totalW) / 2;
  const startY = headY + 50;

  for (let i = 0; i < toolCount; i++) {
    const x = startX + i * (cardW + gap);
    const img = cbToolImages[i];
    const label = stepItems[i] || `Tool ${i + 1}`;

    // Card shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.roundRect(x, startY, cardW, cardH, 16);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // Card border
    ctx.beginPath();
    ctx.roundRect(x, startY, cardW, cardH, 16);
    ctx.strokeStyle = '#E6E6E6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Logo or placeholder
    if (img) {
      const pad = 24;
      const maxImgW = cardW - pad * 2;
      const maxImgH = cardH - pad * 2 - 24;
      const scale = Math.min(maxImgW / img.width, maxImgH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, x + (cardW - dw) / 2, startY + pad, dw, dh);
    } else {
      ctx.font = '600 13px Inter';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + cardW / 2, startY + cardH / 2 - 12);
    }

    // Label below logo
    ctx.font = '500 13px Inter';
    ctx.fillStyle = '#4A5568';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, x + cardW / 2, startY + cardH - 10);
  }

  // "vs ContentBridge" ribbon at bottom
  ctx.font = '600 20px Poppins';
  ctx.fillStyle = PRIMARY;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('vs ContentBridge', W / 2, startY + cardH + 28);
}

// ── Type D — VS Comparison ───────────────────────────────────────────────────
function renderTypeD(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const { headline, cbVsLogos } = state;

  // Dark gradient background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, DARK);
  bg.addColorStop(1, '#2D3748');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid pattern
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();

  // Title — top center, white
  ctx.font = `700 48px Poppins`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#FFFFFF';
  const headLines = wrapText(ctx, headline, W - 200);
  let headY = 52;
  for (const line of headLines) {
    ctx.fillText(line, W / 2, headY);
    headY += 62;
  }


  // Two logo cards
  const cardW = 420;
  const cardH = 260;
  const cardY = headY + 60;
  const leftX = W / 2 - cardW - 60;
  const rightX = W / 2 + 60;

  function drawCard(x: number, img: HTMLImageElement | null, label: string, highlighted: boolean) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.roundRect(x, cardY, cardW, cardH, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    if (highlighted) {
      ctx.beginPath();
      ctx.roundRect(x, cardY, cardW, cardH, 20);
      ctx.strokeStyle = PRIMARY;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (img) {
      const pad = 40;
      const maxW = cardW - pad * 2;
      const maxH = cardH - pad * 2 - 30;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, x + (cardW - dw) / 2, cardY + pad, dw, dh);
    } else {
      ctx.font = '600 20px Poppins';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + cardW / 2, cardY + cardH / 2 - 15);
    }

    // Label at bottom of card
    ctx.font = '600 16px Poppins';
    ctx.fillStyle = highlighted ? PRIMARY : '#4A5568';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, x + cardW / 2, cardY + cardH - 14);
  }

  drawCard(leftX, cbVsLogos[0], 'Logo 1', false);
  drawCard(rightX, cbVsLogos[1], 'Logo 2', true);

  // VS divider
  const vsX = W / 2;
  const vsY = cardY + cardH / 2;

  // Orange circle
  ctx.beginPath();
  ctx.arc(vsX, vsY, 44, 0, Math.PI * 2);
  ctx.fillStyle = PRIMARY;
  ctx.fill();

  ctx.font = `800 28px Poppins`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', vsX, vsY);
}

// ── Type E — Cost + Reviews ──────────────────────────────────────────────────
function renderTypeE(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const { headline, subtitle, stepItems, cbCostLogo, cbRating } = state;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(1, '#FFF3EB');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);


  // Top title
  ctx.font = `700 42px Poppins`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = DARK;
  const headLines = wrapText(ctx, headline, W - 200);
  let headY = 52;
  for (const line of headLines) {
    ctx.fillText(line, W / 2, headY);
    headY += 56;
  }


  // Logo card — left side
  const logoCardW = 280;
  const logoCardH = 200;
  const logoCardX = 80;
  const logoCardY = headY + 50;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(logoCardX, logoCardY, logoCardW, logoCardH, 20);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.roundRect(logoCardX, logoCardY, logoCardW, logoCardH, 20);
  ctx.strokeStyle = PRIMARY + '40';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (cbCostLogo) {
    const pad = 30;
    const scale = Math.min((logoCardW - pad * 2) / cbCostLogo.width, (logoCardH - pad * 2) / cbCostLogo.height);
    const dw = cbCostLogo.width * scale;
    const dh = cbCostLogo.height * scale;
    ctx.drawImage(cbCostLogo, logoCardX + (logoCardW - dw) / 2, logoCardY + (logoCardH - dh) / 2, dw, dh);
  } else {
    ctx.font = '600 15px Inter';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Upload Logo', logoCardX + logoCardW / 2, logoCardY + logoCardH / 2);
  }

  // Cost display — right of logo
  const costX = logoCardX + logoCardW + 50;
  const costY = logoCardY;

  // Cost badge
  ctx.save();
  ctx.shadowColor = 'rgba(246, 123, 55, 0.2)';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(costX, costY, 340, 90, 16);
  ctx.fillStyle = PRIMARY;
  ctx.fill();
  ctx.restore();

  ctx.font = `700 36px Poppins`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(subtitle || 'Starting at $99/mo', costX + 170, costY + 45);

  // Star rating
  const starsY = costY + 108;
  drawStars(ctx, costX, starsY, cbRating, 32);

  // Rating text
  ctx.font = `600 22px Poppins`;
  ctx.fillStyle = DARK;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${cbRating.toFixed(1)} / 5.0`, costX + 32 * 5 + 16, starsY + 16);

  // Feature bullets — right side panel
  if (stepItems.length > 0) {
    const bulletX = costX;
    const bulletY = starsY + 56;
    drawBulletedFeatureList(ctx, stepItems.slice(0, 4), bulletX, bulletY, 580, PRIMARY);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function drawStars(ctx: CanvasRenderingContext2D, x: number, y: number, rating: number, size: number): void {
  const gap = 6;
  for (let i = 0; i < 5; i++) {
    const cx = x + i * (size + gap) + size / 2;
    const cy = y + size / 2;
    const filled = rating >= i + 1 ? 1 : rating >= i + 0.5 ? 0.5 : 0;

    ctx.save();
    if (filled === 0) {
      ctx.globalAlpha = 0.25;
    } else if (filled === 0.5) {
      ctx.globalAlpha = 0.6;
    }
    drawStar(ctx, cx, cy, size / 2, size / 4.5, PRIMARY);
    ctx.restore();
  }
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number, color: string): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function coverFitImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number): void {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
}

function coverFitImageRect(ctx: CanvasRenderingContext2D, img: HTMLImageElement, rx: number, ry: number, rw: number, rh: number): void {
  const scale = Math.max(rw / img.width, rh / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, rx + (rw - sw) / 2, ry + (rh - sh) / 2, sw, sh);
}
