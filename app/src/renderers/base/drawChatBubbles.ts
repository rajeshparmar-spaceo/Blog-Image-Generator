import type { ChatLine } from '../../types';
import { wrapText } from '../../utils/wrapText';

/**
 * Draws Welco-style chat conversation bubbles.
 */
export function drawChatBubbles(
  ctx: CanvasRenderingContext2D,
  lines: ChatLine[],
  x: number,
  y: number,
  width: number,
  primaryColor: string,
): number {
  const bubblePadH = 12;
  const bubblePadV = 8;
  const bubbleMaxWidth = width * 0.72;
  const fontSize = 13;
  const font = `400 ${fontSize}px Inter`;
  const lineHeight = fontSize * 1.4;
  const bubbleSpacing = 10;
  const cornerRadius = 12;

  let currentY = y;

  for (const line of lines) {
    const isAgent = line.speaker === 'agent';
    const bubbleX = isAgent ? x : x + width - bubbleMaxWidth;
    const bgColor = isAgent ? primaryColor : '#FFFFFF';
    const textColor = isAgent ? '#FFFFFF' : '#1A1A2E';
    const textX = bubbleX + bubblePadH;
    const textMaxWidth = bubbleMaxWidth - bubblePadH * 2;

    ctx.font = font;
    const textLines = wrapText(ctx, line.text, textMaxWidth);
    const textHeight = textLines.length * lineHeight;
    const bubbleHeight = textHeight + bubblePadV * 2;
    const bubbleWidth = Math.min(
      bubbleMaxWidth,
      Math.max(...textLines.map((l) => ctx.measureText(l).width)) + bubblePadH * 2,
    );

    // Draw bubble
    ctx.beginPath();
    ctx.roundRect(bubbleX, currentY, bubbleWidth, bubbleHeight, cornerRadius);
    ctx.fillStyle = bgColor;
    ctx.fill();
    if (!isAgent) {
      ctx.strokeStyle = '#D0D8E8';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw text
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let lineY = currentY + bubblePadV;
    for (const tl of textLines) {
      ctx.fillText(tl, textX, lineY);
      lineY += lineHeight;
    }

    // Speaker label
    ctx.font = `500 10px Inter`;
    ctx.fillStyle = '#888888';
    const label = isAgent ? 'Agent' : 'Caller';
    ctx.textAlign = isAgent ? 'left' : 'right';
    ctx.fillText(label, isAgent ? bubbleX : bubbleX + bubbleWidth, currentY - 2);

    currentY += bubbleHeight + bubbleSpacing;
  }

  return currentY;
}
