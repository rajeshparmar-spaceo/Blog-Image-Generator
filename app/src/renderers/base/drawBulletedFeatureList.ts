import { wrapText } from '../../utils/wrapText';

/**
 * Draws SOC-style bulleted feature list with dark circles + white check marks.
 */
export function drawBulletedFeatureList(
  ctx: CanvasRenderingContext2D,
  items: string[],
  x: number,
  y: number,
  maxWidth: number,
  primaryColor: string,
): number {
  const circleRadius = 12;
  const textFont = '400 15px Poppins';
  const lineHeight = 22;
  const itemSpacing = 12;

  let currentY = y;

  for (const item of items) {
    const circleCX = x + circleRadius;
    const textX = x + circleRadius * 2 + 10;
    const textMaxWidth = maxWidth - circleRadius * 2 - 10;

    ctx.font = textFont;
    const textLines = wrapText(ctx, item, textMaxWidth);
    const blockHeight = Math.max(circleRadius * 2, textLines.length * lineHeight);
    const circleY = currentY + circleRadius;

    // Dark circle with brand color border
    ctx.beginPath();
    ctx.arc(circleCX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1A1A2E';
    ctx.fill();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Check mark
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(circleCX - 5, circleY);
    ctx.lineTo(circleCX - 1, circleY + 4);
    ctx.lineTo(circleCX + 5, circleY - 4);
    ctx.stroke();

    // Text
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
