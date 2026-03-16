import { drawWrappedText } from '../../utils/wrapText';

export interface TextBlock {
  text: string;
  font: string;
  color: string;
  x: number;
  maxWidth: number;
  lineHeight: number;
  maxLines?: number;
}

/**
 * Draw a text block onto the canvas.
 * Sets ctx.font and ctx.fillStyle before drawing.
 * Returns the Y position after the last line.
 */
export function drawTextBlock(
  ctx: CanvasRenderingContext2D,
  block: TextBlock,
  y: number,
): number {
  ctx.font = block.font;
  ctx.fillStyle = block.color;
  ctx.textBaseline = 'top';
  return drawWrappedText(ctx, block.text, block.x, y, block.maxWidth, block.lineHeight, block.maxLines);
}
