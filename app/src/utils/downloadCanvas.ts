import type { ExportFormat } from '../types';

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  brandId: string,
  format: ExportFormat,
  quality: number,
  scale: 1 | 2 | 3 = 1,
): void {
  const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
  const qualityValue = format === 'png' ? undefined : quality / 100;
  const date = new Date().toISOString().slice(0, 10);

  let exportCanvas = canvas;
  if (scale > 1) {
    const scaled = document.createElement('canvas');
    scaled.width = canvas.width * scale;
    scaled.height = canvas.height * scale;
    const sctx = scaled.getContext('2d');
    if (sctx) {
      sctx.imageSmoothingEnabled = false;
      sctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
    }
    exportCanvas = scaled;
  }

  exportCanvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandId}-blog-${date}${scale > 1 ? `@${scale}x` : ''}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    },
    mimeType,
    qualityValue,
  );
}
