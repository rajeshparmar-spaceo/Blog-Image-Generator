import { wrapText } from '../../utils/wrapText';

/**
 * Draws MCB-style numbered step list with blue circles + text.
 */
export function drawNumberedStepList(
  ctx: CanvasRenderingContext2D,
  items: string[],
  x: number,
  y: number,
  maxWidth: number,
  primaryColor: string,
): number {
  const circleRadius = 14;
  const textFont = '400 14px Poppins';
  const numFont = '700 13px Poppins';
  const lineHeight = 20;
  const itemSpacing = 10;

  let currentY = y;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const circleCX = x + circleRadius;
    const textX = x + circleRadius * 2 + 10;
    const textMaxWidth = maxWidth - circleRadius * 2 - 10;

    // Measure text height first
    ctx.font = textFont;
    const textLines = wrapText(ctx, item, textMaxWidth);
    const blockHeight = Math.max(circleRadius * 2, textLines.length * lineHeight);
    const circleY = currentY + circleRadius;

    // Draw circle
    ctx.beginPath();
    ctx.arc(circleCX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();

    // Draw number
    ctx.font = numFont;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), circleCX, circleY);

    // Draw text
    ctx.font = textFont;
    ctx.fillStyle = '#1A1A2E';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let lineY = currentY + (blockHeight - textLines.length * lineHeight) / 2;
    for (const line of textLines) {
      ctx.fillText(line, textX, lineY);
      lineY += lineHeight;
    }

    currentY += blockHeight + itemSpacing;
  }

  return currentY;
}
