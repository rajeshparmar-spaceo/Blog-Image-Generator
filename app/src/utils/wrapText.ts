/**
 * Wraps text to fit within maxWidth using canvas measureText.
 * IMPORTANT: ctx.font must be set before calling this function.
 * Returns array of lines.
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!word) continue;
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Draw wrapped text onto canvas, returning the Y position after the last line.
 * IMPORTANT: ctx.font must be set before calling this function.
 */
export function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines?: number,
): number {
  const lines = wrapText(ctx, text, maxWidth);
  const renderLines = maxLines ? lines.slice(0, maxLines) : lines;
  for (const line of renderLines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}
