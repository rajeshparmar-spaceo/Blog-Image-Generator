import { useEditorStore } from '../../store/useEditorStore';
import type { ExportFormat } from '../../types';

interface ExportPanelProps {
  onExport: () => void;
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  const { exportFormat, setExportFormat, exportQuality, setExportQuality, exportScale, setExportScale } = useEditorStore();

  return (
    <div className="flex items-center gap-4">
      {/* Format selector */}
      <div className="flex items-center gap-1">
        {(['png', 'webp', 'jpeg'] as ExportFormat[]).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setExportFormat(fmt)}
            className={`
              px-2.5 py-1 rounded text-xs font-medium uppercase transition-all
              ${exportFormat === fmt
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }
            `}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Scale selector */}
      <div className="flex items-center gap-1 border-l border-slate-700 pl-4">
        {([1, 2, 3] as (1 | 2 | 3)[]).map((s) => (
          <button
            key={s}
            onClick={() => setExportScale(s)}
            className={`
              px-2.5 py-1 rounded text-xs font-medium transition-all
              ${exportScale === s
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }
            `}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Quality slider — only for webp/jpeg */}
      {exportFormat !== 'png' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Q:</span>
          <input
            type="range"
            min={50}
            max={100}
            value={exportQuality}
            onChange={(e) => setExportQuality(Number(e.target.value))}
            className="w-20 accent-blue-500"
          />
          <span className="text-xs text-slate-400 w-7">{exportQuality}%</span>
        </div>
      )}

      {/* Download button */}
      <button
        onClick={onExport}
        className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Image
      </button>
    </div>
  );
}
