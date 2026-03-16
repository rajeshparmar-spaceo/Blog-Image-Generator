/**
 * Converts a hex color string (#RRGGBB) to an RGB string 'R,G,B'.
 */
function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '255,255,255';
  return `${r},${g},${b}`;
}

/**
 * Draws a left-to-right gradient overlay over the left portion of the canvas.
 * @param fadeWidth - how many pixels wide the gradient covers
 * @param opacity   - 0 to 1, opacity at the solid edge
 * @param color     - hex color string e.g. '#FFFFFF'
 */
export function drawGradientOverlay(
  ctx: CanvasRenderingContext2D,
  _canvasWidth: number,
  canvasHeight: number,
  fadeWidth: number,
  opacity = 0.92,
  color = '#FFFFFF',
): void {
  const rgb = hexToRgb(color);
  const grad = ctx.createLinearGradient(0, 0, fadeWidth, 0);
  grad.addColorStop(0, `rgba(${rgb},${opacity})`);
  grad.addColorStop(0.7, `rgba(${rgb},${opacity * 0.8})`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, fadeWidth, canvasHeight);
}
