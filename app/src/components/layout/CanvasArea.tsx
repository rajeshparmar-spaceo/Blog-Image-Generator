import { useRef } from 'react';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';
import { useExport } from '../../hooks/useExport';
import { useEditorStore } from '../../store/useEditorStore';
import { getBrandCanvasSize } from '../../constants/brands';
import { ExportPanel } from '../controls/ExportPanel';

export function CanvasArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasRenderer(canvasRef);
  const { handleExport } = useExport(canvasRef);
  const { brandId, soiSize, fontsReady, imageMode, selectedOpportunityId, imageOpportunities } = useEditorStore();
  const { width, height } = getBrandCanvasSize(brandId, soiSize);

  const selectedOpp = imageMode === 'internal'
    ? imageOpportunities.find(o => o.id === selectedOpportunityId)
    : null;

  return (
    <div className="flex flex-col flex-1 bg-slate-950 overflow-hidden">
      {/* Canvas scroll area */}
      <div className="flex-1 flex items-start justify-center overflow-auto p-4">
        <div className="flex flex-col items-center gap-3 w-full max-w-full">
          {/* Canvas wrapper with shadow */}
          <div className="relative shadow-2xl ring-1 ring-slate-700/50 w-full">
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                aspectRatio: `${width} / ${height}`,
              }}
            />
            {!fontsReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-slate-300 text-sm">
                Loading fonts…
              </div>
            )}
          </div>
          {/* Size info / selected opportunity label */}
          {selectedOpp ? (
            <p className="text-xs text-slate-400 text-left w-full">
              <span className="text-slate-500">#{selectedOpp.index}</span>{' '}
              {selectedOpp.sectionTitle}
            </p>
          ) : (
            <p className="text-xs text-slate-500 text-left w-full">
              {width} × {height} px
              {imageMode === 'internal' && <span className="ml-2 text-slate-600">(internal image)</span>}
            </p>
          )}
        </div>
      </div>

      {/* Export panel */}
      <div className="flex-none border-t border-slate-800 bg-slate-900 px-5 py-3">
        <ExportPanel onExport={handleExport} />
      </div>
    </div>
  );
}
