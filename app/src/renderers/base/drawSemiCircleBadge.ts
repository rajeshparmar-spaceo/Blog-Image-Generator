/**
 * Draws a white quarter-circle badge at the bottom-right corner of the canvas
 * with a logo centered inside it.
 */
export function drawSemiCircleBadge(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  canvasWidth: number,
  canvasHeight: number,
  radius = 90,
): void {
  ctx.save();

  // Draw quarter-circle arc at bottom-right corner
  ctx.beginPath();
  // Center at corner (W, H), arc from PI (left) to 1.5PI (top) = upper-left quarter
  ctx.arc(canvasWidth, canvasHeight, radius, Math.PI, Math.PI * 1.5);
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.closePath();

  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.shadowBlur = 0;

  if (logo) {
    ctx.clip();
    // Logo centered ~55% of radius from corner
    const cx = canvasWidth - radius * 0.52;
    const cy = canvasHeight - radius * 0.52;
    const aspectRatio = logo.width / logo.height;
    const lh = radius * 0.38;
    const lw = lh * aspectRatio;
    ctx.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
  }

  ctx.restore();
}
