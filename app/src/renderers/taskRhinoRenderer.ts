import type { EditorState } from '../types';
import { ICONS } from '../constants/lucideIconData';
import { drawIcon } from './base/drawIcon';
import { wrapText } from '../utils/wrapText';
import { detectIllustration, drawIllustration } from './taskRhinoIllustrations';

export function taskRhinoRenderer(ctx: CanvasRenderingContext2D, state: EditorState): void {
  const W = 1365;
  const H = 640;
  const { headline, subtitle, variant, selectedIcons, logoImages, sourceContent } = state;

  // 1. Lavender gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#F3F0FF');
  bgGrad.addColorStop(0.5, '#EDE9FE');
  bgGrad.addColorStop(1, '#E8E0FF');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Dot grid overlay
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#DAD7F5';
  const dotSpacing = 30;
  for (let x = dotSpacing; x < W; x += dotSpacing) {
    for (let y = dotSpacing; y < H; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 3. Soft vertical divider
  ctx.save();
  ctx.globalAlpha = 0.12;
  const divGrad = ctx.createLinearGradient(650, 0, 650, H);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.3, '#7C3AED');
  divGrad.addColorStop(0.7, '#7C3AED');
  divGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(650, 40);
  ctx.lineTo(650, H - 40);
  ctx.stroke();
  ctx.restore();

  // 4. Left text zone
  const textX = 55;
  const textMaxWidth = 540;

  ctx.fillStyle = '#7C3AED';
  ctx.fillRect(textX, 95, 50, 5);

  const headlineFont = '"Fraunces", Georgia, serif';
  ctx.font = `800 52px ${headlineFont}`;
  ctx.fillStyle = '#1A1A1A';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const headLines = wrapText(ctx, headline, textMaxWidth);
  let headY = 120;
  for (const line of headLines.slice(0, 3)) {
    ctx.fillText(line, textX, headY);
    headY += 64;
  }

  ctx.font = '400 20px Inter';
  ctx.fillStyle = '#4A4A4A';
  const subLines = wrapText(ctx, subtitle, textMaxWidth);
  let subY = headY + 18;
  for (const line of subLines.slice(0, 3)) {
    ctx.fillText(line, textX, subY);
    subY += 30;
  }

  // 5. Right zone — vector illustration derived from headline + subtitle
  const rightCX = 1010;  // center of right zone (680 to 1340)
  const rightCY = H / 2;
  const illustrationSize = variant === 'typeA' ? 300 : variant === 'typeB' ? 260 : 280;

  const illustrationKey = detectIllustration(headline, subtitle, sourceContent);
  drawIllustration(ctx, illustrationKey, rightCX, rightCY, illustrationSize);

  // 6. Decorative floating elements
  drawDecorativeElements(ctx, W, H);

  // 7. Selected icons
  if (selectedIcons.length > 0) {
    for (const iconCfg of selectedIcons) {
      const shapes = ICONS[iconCfg.iconName];
      if (shapes) {
        drawIcon(ctx, shapes, iconCfg.x, iconCfg.y, iconCfg.size, iconCfg.color, iconCfg.bgColor, iconCfg.size * 0.75);
      }
    }
  }

  // 8. Logo — bottom-left
  const logo = logoImages['taskrhino'];
  if (logo) {
    const lw = 195;
    const lh = (logo.height / logo.width) * lw;
    ctx.drawImage(logo, 55, H - lh - 28, lw, lh);
  }

  // 9. Domain tag + illustration topic tag — bottom-right
  ctx.font = '500 13px Inter';
  ctx.fillStyle = '#9E98E5';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('taskrhino.com', W - 30, H - 20);
}

function drawDecorativeElements(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#7C3AED';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(W * 0.49, H * 0.10);
  ctx.lineTo(W * 0.54, H * 0.22);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  const dots = [
    { x: W * 0.48, y: H * 0.09, r: 7  },
    { x: W * 0.97, y: H * 0.16, r: 5  },
    { x: W * 0.60, y: H * 0.91, r: 6  },
  ];
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#7C3AED';
  for (const c of dots) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
