import type { EditorState } from '../types';
import { drawGradientOverlay } from './base/drawGradientOverlay';
import { drawBulletedFeatureList } from './base/drawBulletedFeatureList';
import { wrapText } from '../utils/wrapText';
import { analyzeContent } from '../utils/contentAnalyzer';
import { drawSharedIllustration } from './sharedIllustrations';

const PRIMARY = '#FF6600';
const DARK = '#1A1A2E';

export function textBoltRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 960;
  const H = 540;

  if (state.variant === 'typeA') renderTypeA(ctx, W, H, state);
  else if (state.variant === 'typeB') renderTypeB(ctx, W, H, state);
  else if (state.variant === 'typeC') renderTypeC(ctx, W, H, state);
  else if (state.variant === 'typeD') renderTypeD(ctx, W, H, state);
  else if (state.variant === 'typeE') renderTypeE(ctx, W, H, state);

  // Logo overlay — full canvas
  const logo = state.logoImages['textbolt'];
  if (logo) ctx.drawImage(logo, 0, 0, W, H);
}

// ── Warm peach background (TextBolt signature) ────────────────────────────────
function drawWarmBackground(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  ctx.fillStyle = '#FEE1CD';
  ctx.fillRect(0, 0, W, H);

  // Top-left ambient glow
  const tl = ctx.createRadialGradient(124, 42, 0, 124, 42, 267);
  tl.addColorStop(0, 'rgba(255, 197, 158, 0.72)');
  tl.addColorStop(1, 'rgba(255, 197, 158, 0)');
  ctx.fillStyle = tl;
  ctx.fillRect(0, 0, W, H);

  // Bottom-right ambient glow
  const br = ctx.createRadialGradient(832, 512, 0, 832, 512, 330);
  br.addColorStop(0, 'rgba(255, 197, 158, 0.72)');
  br.addColorStop(1, 'rgba(255, 197, 158, 0)');
  ctx.fillStyle = br;
  ctx.fillRect(0, 0, W, H);
}

// ── Type A — Simple Image ─────────────────────────────────────────────────────
function renderTypeA(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const { headline, subtitle, stockImage, cbTitlePosition, overlayDirection, titleColor, subtitleColor } = state;

  const isTopCenter = cbTitlePosition === 'top-center';
  const isRightCenter = cbTitlePosition === 'right-center';

  if (stockImage) {
    coverFitImage(ctx, stockImage, W, H);
    const isTopBottom = overlayDirection === 'top-bottom';
    const fadeCoverage = (state.overlayPosition / 100) * (isTopBottom ? H : W);
    drawGradientOverlay(ctx, W, H, fadeCoverage, state.overlayOpacity / 100, state.overlayColor, overlayDirection);
  } else {
    drawWarmBackground(ctx, W, H);
  }

  const maxW = isTopCenter ? Math.round(W * 0.80) : Math.round(W * 0.42);

  ctx.font = `700 38px Poppins`;
  ctx.textBaseline = 'top';

  const lines = wrapText(ctx, headline, maxW);
  const lineH = 50;
  const blockH = lines.length * lineH;

  ctx.font = `400 22px Poppins`;
  const subLineH = 30;
  const subLines = subtitle ? wrapText(ctx, subtitle, maxW) : [];
  const subBlockH = subLines.length > 0 ? subLines.length * subLineH + 14 : 0;
  const totalH = blockH + subBlockH;

  let startY: number;
  let startX: number;

  if (isTopCenter) {
    startY = 60;
    startX = W / 2;
    ctx.textAlign = 'center';
  } else if (isRightCenter) {
    startY = Math.round((H - totalH) / 2);
    startX = W - 48;
    ctx.textAlign = 'right';
  } else {
    startY = Math.round((H - totalH) / 2);
    startX = 48;
    ctx.textAlign = 'left';
  }

  ctx.font = `700 38px Poppins`;
  ctx.fillStyle = titleColor;
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, startX, y);
    y += lineH;
  }

  if (subLines.length > 0) {
    ctx.font = `400 22px Poppins`;
    ctx.fillStyle = subtitleColor;
    y += 14;
    for (const line of subLines) {
      ctx.fillText(line, startX, y);
      y += subLineH;
    }
  }
}

// ── Type B — UI Image ─────────────────────────────────────────────────────────
function renderTypeB(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const {
    headline, subtitle, stockImage, cbTitlePosition,
    cbBgColor, cbBgColor2, cbBgType, cbBgGradientDir,
    cbImageOffsetX, cbImageOffsetY, cbImageWidth, cbImageHeight,
    sourceContent, titleColor, subtitleColor,
  } = state;

  const halfW = W / 2;
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
    const maxTextW = Math.round(W * 0.80);

    ctx.font = `700 36px Poppins`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    const headLines = wrapText(ctx, headline, maxTextW);
    const headLineH = 48;

    ctx.font = `400 20px Poppins`;
    const subLineH = 28;
    const subLines = subtitle ? wrapText(ctx, subtitle, maxTextW) : [];

    ctx.font = `700 36px Poppins`;
    ctx.fillStyle = titleColor;
    let y = 44;
    for (const line of headLines) {
      ctx.fillText(line, W / 2, y);
      y += headLineH;
    }

    if (subLines.length > 0) {
      ctx.font = `400 20px Poppins`;
      ctx.fillStyle = subtitleColor;
      y += 16;
      for (const line of subLines) {
        ctx.fillText(line, W / 2, y);
        y += subLineH;
      }
    }

    // UI image centered below text
    const textEndY = y + 20;
    const availH = H - textEndY - 32;
    const availW = W - 100;

    if (stockImage) {
      let dw: number;
      let dh: number;
      const aspect = stockImage.width / stockImage.height;
      if (cbImageWidth > 0 && cbImageHeight > 0) {
        dw = cbImageWidth;
        dh = cbImageHeight;
      } else if (cbImageWidth > 0) {
        dw = cbImageWidth;
        dh = Math.round(cbImageWidth / aspect);
      } else if (cbImageHeight > 0) {
        dh = cbImageHeight;
        dw = Math.round(cbImageHeight * aspect);
      } else {
        const scale = Math.min(availW / stockImage.width, availH / stockImage.height);
        dw = stockImage.width * scale;
        dh = stockImage.height * scale;
      }
      const imgX = (W - dw) / 2 + cbImageOffsetX;
      const imgY = textEndY + (availH - dh) / 2 + cbImageOffsetY;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(stockImage, imgX, imgY, dw, dh);
      ctx.restore();
    } else {
      const profile = analyzeContent(headline, subtitle, sourceContent);
      const cx = W / 2 + cbImageOffsetX;
      const cy = textEndY + availH / 2 + cbImageOffsetY;
      drawSharedIllustration(ctx, profile.visualType, cx, cy, Math.min(availW, availH) * 0.7, PRIMARY, profile.points, profile.numbers);
    }

  } else {
    // Left-center: text left, image right
    if (stockImage) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(halfW, 0, halfW, H);
      ctx.clip();
      coverFitImageRect(ctx, stockImage, halfW, 0, halfW, H);
      ctx.restore();

      const shadowGrad = ctx.createLinearGradient(halfW, 0, halfW + 60, 0);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0.16)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(halfW, 0, 60, H);
    } else {
      const profile = analyzeContent(headline, subtitle, sourceContent);
      drawSharedIllustration(ctx, profile.visualType, halfW + halfW / 2, H / 2, halfW * 0.82, PRIMARY, profile.points, profile.numbers);
    }

    const maxTextW = Math.round(halfW - 120);

    ctx.font = `700 36px Poppins`;
    ctx.textBaseline = 'top';

    const headLines = wrapText(ctx, headline, maxTextW);
    const headLineH = 48;
    const blockH = headLines.length * headLineH;

    ctx.font = `400 20px Poppins`;
    const subLineH = 28;
    const subLines = subtitle ? wrapText(ctx, subtitle, maxTextW) : [];
    const subBlockH = subLines.length > 0 ? subLines.length * subLineH + 22 : 0;
    const totalH = blockH + subBlockH;

    const headY = Math.round((H - totalH) / 2);

    ctx.font = `700 36px Poppins`;
    ctx.fillStyle = titleColor;
    ctx.textAlign = 'left';
    let y = headY;
    for (const line of headLines) {
      ctx.fillText(line, 56, y);
      y += headLineH;
    }

    if (subLines.length > 0) {
      ctx.font = `400 20px Poppins`;
      ctx.fillStyle = subtitleColor;
      y += 22;
      for (const line of subLines) {
        ctx.fillText(line, 56, y);
        y += subLineH;
      }
    }
  }
}

// ── Type C — Alternatives Tools ───────────────────────────────────────────────
function renderTypeC(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const {
    headline, subtitle, stepItems, cbToolImages,
    titleColor, subtitleColor,
    cbTypeCHeadlineWidth, cbTypeCSubtitleWidth, cbToolNameEnabled, cbToolLogoSize,
  } = state;

  drawWarmBackground(ctx, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.font = `700 36px Poppins`;
  ctx.fillStyle = titleColor;
  const headLines = wrapText(ctx, headline, cbTypeCHeadlineWidth);
  let textY = 44;
  for (const line of headLines) {
    ctx.fillText(line, W / 2, textY);
    textY += 48;
  }

  if (subtitle) {
    ctx.font = `400 20px Poppins`;
    ctx.fillStyle = subtitleColor;
    const subLines = wrapText(ctx, subtitle, cbTypeCSubtitleWidth);
    textY += 10;
    for (const line of subLines) {
      ctx.fillText(line, W / 2, textY);
      textY += 28;
    }
  }

  const filledImages = cbToolImages.filter(Boolean).length;
  const filledNames = stepItems.filter(s => s.trim()).length;
  const toolCount = Math.max(1, Math.min(8, filledImages || filledNames || 3));

  let cols: number;
  if (toolCount <= 4) cols = toolCount;
  else if (toolCount <= 6) cols = 3;
  else cols = 4;
  const rowCount = Math.ceil(toolCount / cols);

  const gap = 16;
  const pad = 16;
  const nameLabelH = cbToolNameEnabled ? 26 : 0;
  const sizeFactor = cbToolLogoSize / 100;
  const bottomPad = 36;

  const availW = W - 64;
  const maxCardW = Math.floor((availW - (cols - 1) * gap) / cols);
  const spaceForGrid = H - textY - 28 - bottomPad;
  const maxCardH = Math.floor((spaceForGrid - (rowCount - 1) * gap) / rowCount);
  const maxImgAreaW = maxCardW - pad * 2;
  const maxImgAreaH = maxCardH - pad * 2 - nameLabelH;

  let maxLogoW = 40;
  let maxLogoH = 40;
  for (let i = 0; i < toolCount; i++) {
    const img = cbToolImages[i];
    if (img) {
      const scale = Math.min(maxImgAreaW / img.width, maxImgAreaH / img.height) * sizeFactor;
      const rw = img.width * scale;
      const rh = img.height * scale;
      if (rw > maxLogoW) maxLogoW = rw;
      if (rh > maxLogoH) maxLogoH = rh;
    }
  }

  const logoAreaW = Math.min(Math.ceil(maxLogoW), maxImgAreaW);
  const logoAreaH = Math.min(Math.ceil(maxLogoH), maxImgAreaH);
  const cardW = logoAreaW + pad * 2;
  const cardH = logoAreaH + pad * 2 + nameLabelH;

  const gridH = rowCount * cardH + (rowCount - 1) * gap;
  const cardsTopY = textY + 28 + Math.max(0, Math.round((spaceForGrid - gridH) / 2));

  for (let r = 0; r < rowCount; r++) {
    const rowStart = r * cols;
    const rowEnd = Math.min(rowStart + cols, toolCount);
    const itemsInRow = rowEnd - rowStart;
    const rowTotalW = itemsInRow * cardW + (itemsInRow - 1) * gap;
    const rowX = (W - rowTotalW) / 2;
    const rowY = cardsTopY + r * (cardH + gap);

    for (let c = 0; c < itemsInRow; c++) {
      const idx = rowStart + c;
      const x = rowX + c * (cardW + gap);
      const img = cbToolImages[idx] ?? null;
      const label = stepItems[idx] || `Tool ${idx + 1}`;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.09)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(x, rowY, cardW, cardH, 14);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.roundRect(x, rowY, cardW, cardH, 14);
      ctx.strokeStyle = '#D4C4BA';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (img) {
        const scale = Math.min(logoAreaW / img.width, logoAreaH / img.height) * sizeFactor;
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, x + (cardW - dw) / 2, rowY + pad + (logoAreaH - dh) / 2, dw, dh);
      } else {
        ctx.font = `500 11px Inter`;
        ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + cardW / 2, rowY + pad + logoAreaH / 2);
      }

      if (cbToolNameEnabled) {
        ctx.font = `500 12px Inter`;
        ctx.fillStyle = '#4A5568';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, x + cardW / 2, rowY + cardH - 8);
      }
    }
  }
}

// ── Type D — VS Comparison ────────────────────────────────────────────────────
function renderTypeD(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const { headline, cbVsLogos, titleColor } = state;

  // Warm peach background (TextBolt style — not dark)
  drawWarmBackground(ctx, W, H);

  // Title — top center
  ctx.font = `700 38px Poppins`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = titleColor;
  const headLines = wrapText(ctx, headline, W - 160);
  let headY = 48;
  for (const line of headLines) {
    ctx.fillText(line, W / 2, headY);
    headY += 50;
  }

  // Card layout — two cards flanking a center VS badge
  const cardW = 180;
  const cardH = 180;
  const cardY = headY + 36;
  const leftX = W / 2 - cardW - 68;
  const rightX = W / 2 + 68;

  function drawCard(x: number, img: HTMLImageElement | null, label: string, highlighted: boolean) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.14)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.roundRect(x, cardY, cardW, cardH, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    if (highlighted) {
      ctx.beginPath();
      ctx.roundRect(x, cardY, cardW, cardH, 20);
      ctx.strokeStyle = PRIMARY;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(x, cardY, cardW, cardH, 20);
      ctx.strokeStyle = '#D4C4BA';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (img) {
      const pad = 32;
      const maxW = cardW - pad * 2;
      const maxH = cardH - pad * 2 - 26;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, x + (cardW - dw) / 2, cardY + pad, dw, dh);
    } else {
      ctx.font = '500 13px Poppins';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + cardW / 2, cardY + cardH / 2 - 12);
    }

    // Label at card bottom
    ctx.font = '600 13px Poppins';
    ctx.fillStyle = highlighted ? PRIMARY : '#4A5568';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, x + cardW / 2, cardY + cardH - 10);
  }

  drawCard(leftX, cbVsLogos[0], 'Logo 1', false);
  drawCard(rightX, cbVsLogos[1], 'Logo 2', true);

  // VS badge — centered between cards
  const vsX = W / 2;
  const vsY = cardY + cardH / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(255, 102, 0, 0.3)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(vsX, vsY, 36, 0, Math.PI * 2);
  ctx.fillStyle = PRIMARY;
  ctx.fill();
  ctx.restore();

  ctx.font = `800 22px Poppins`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', vsX, vsY);
}

// ── Type E — Cost + Reviews ───────────────────────────────────────────────────
function renderTypeE(ctx: CanvasRenderingContext2D, W: number, H: number, state: EditorState): void {
  const { headline, subtitle, stepItems, cbCostLogo, cbRating, titleColor } = state;

  drawWarmBackground(ctx, W, H);

  // Title
  ctx.font = `700 36px Poppins`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = titleColor;
  const headLines = wrapText(ctx, headline, W - 160);
  let headY = 44;
  for (const line of headLines) {
    ctx.fillText(line, W / 2, headY);
    headY += 48;
  }

  // Logo card — left side
  const logoCardW = 220;
  const logoCardH = 155;
  const logoCardX = 64;
  const logoCardY = headY + 40;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(logoCardX, logoCardY, logoCardW, logoCardH, 16);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.roundRect(logoCardX, logoCardY, logoCardW, logoCardH, 16);
  ctx.strokeStyle = PRIMARY + '40';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (cbCostLogo) {
    const pad = 24;
    const scale = Math.min((logoCardW - pad * 2) / cbCostLogo.width, (logoCardH - pad * 2) / cbCostLogo.height);
    const dw = cbCostLogo.width * scale;
    const dh = cbCostLogo.height * scale;
    ctx.drawImage(cbCostLogo, logoCardX + (logoCardW - dw) / 2, logoCardY + (logoCardH - dh) / 2, dw, dh);
  } else {
    ctx.font = '500 13px Inter';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Upload Logo', logoCardX + logoCardW / 2, logoCardY + logoCardH / 2);
  }

  // Cost + rating — right of logo card
  const costX = logoCardX + logoCardW + 40;
  const costY = logoCardY;

  // Cost badge
  ctx.save();
  ctx.shadowColor = 'rgba(255, 102, 0, 0.2)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(costX, costY, 280, 72, 14);
  ctx.fillStyle = PRIMARY;
  ctx.fill();
  ctx.restore();

  ctx.font = `700 28px Poppins`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(subtitle || 'Starting at $99/mo', costX + 140, costY + 36);

  // Star rating
  const starsY = costY + 88;
  drawStars(ctx, costX, starsY, cbRating, 28);

  // Rating text
  ctx.font = `600 18px Poppins`;
  ctx.fillStyle = DARK;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${cbRating.toFixed(1)} / 5.0`, costX + 28 * 5 + 12, starsY + 14);

  // Feature bullets
  if (stepItems.length > 0) {
    const bulletY = starsY + 46;
    drawBulletedFeatureList(ctx, stepItems.slice(0, 4), costX, bulletY, 460, PRIMARY);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function drawStars(ctx: CanvasRenderingContext2D, x: number, y: number, rating: number, size: number): void {
  const gap = 5;
  for (let i = 0; i < 5; i++) {
    const cx = x + i * (size + gap) + size / 2;
    const cy = y + size / 2;
    const filled = rating >= i + 1 ? 1 : rating >= i + 0.5 ? 0.5 : 0;
    ctx.save();
    if (filled === 0) ctx.globalAlpha = 0.25;
    else if (filled === 0.5) ctx.globalAlpha = 0.6;
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
