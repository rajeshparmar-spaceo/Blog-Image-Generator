/**
 * Draws a left-to-right gradient overlay (white fade) over the left portion of the canvas.
 */
export function drawGradientOverlay(
  ctx: CanvasRenderingContext2D,
  _canvasWidth: number,
  canvasHeight: number,
  fadeWidth: number,
  startAlpha = 0.92,
  color = '255,255,255',
): void {
  const grad = ctx.createLinearGradient(0, 0, fadeWidth, 0);
  grad.addColorStop(0, `rgba(${color},${startAlpha})`);
  grad.addColorStop(0.7, `rgba(${color},0.75)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, fadeWidth, canvasHeight);
}
