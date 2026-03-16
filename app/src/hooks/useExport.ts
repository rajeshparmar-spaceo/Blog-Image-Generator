import { type RefObject } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { downloadCanvas } from '../utils/downloadCanvas';

export function useExport(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { brandId, exportFormat, exportQuality } = useEditorStore();

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    downloadCanvas(canvas, brandId, exportFormat, exportQuality);
  };

  return { handleExport };
}
