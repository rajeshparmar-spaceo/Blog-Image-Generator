import type { IconShape } from '../../constants/lucideIconData';

/**
 * Draws a Lucide icon (pre-parsed shapes) inside an optional circle background.
 * The icon viewBox is 24×24; we scale to fit the target size.
 */
export function drawIcon(
  ctx: CanvasRenderingContext2D,
  shapes: IconShape[],
  cx: number,
  cy: number,
  iconSize: number,
  iconColor = '#FFFFFF',
  bgColor?: string,
  bgRadius?: number,
): void {
  ctx.save();

  // Draw background circle
  if (bgColor) {
    const r = bgRadius ?? iconSize * 0.75;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();
  }

  // Scale from 24×24 viewBox to iconSize
  const scale = iconSize / 24;
  const offsetX = cx - iconSize / 2;
  const offsetY = cy - iconSize / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  ctx.strokeStyle = iconColor;
  ctx.fillStyle = iconColor;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const shape of shapes) {
    ctx.beginPath();
    if (shape.type === 'path') {
      const p = new Path2D(shape.d);
      ctx.stroke(p);
    } else if (shape.type === 'circle') {
      ctx.arc(Number(shape.cx), Number(shape.cy), Number(shape.r), 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === 'line') {
      ctx.moveTo(Number(shape.x1), Number(shape.y1));
      ctx.lineTo(Number(shape.x2), Number(shape.y2));
      ctx.stroke();
    } else if (shape.type === 'polyline') {
      const pts = shape.points.trim().split(/[\s,]+/);
      for (let i = 0; i < pts.length; i += 2) {
        const px = Number(pts[i]);
        const py = Number(pts[i + 1]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    } else if (shape.type === 'rect') {
      const rx = shape.rx ? Number(shape.rx) : 0;
      const x = Number(shape.x);
      const y = Number(shape.y);
      const w = Number(shape.w);
      const h = Number(shape.h);
      if (rx > 0) {
        ctx.roundRect(x, y, w, h, rx);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.stroke();
    }
  }

  ctx.restore();
}
