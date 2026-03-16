import type { ExportFormat } from '../types';

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  brandId: string,
  format: ExportFormat,
  quality: number,
): void {
  const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
  const qualityValue = format === 'png' ? undefined : quality / 100;
  const date = new Date().toISOString().slice(0, 10);

  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandId}-blog-${date}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    },
    mimeType,
    qualityValue,
  );
}
