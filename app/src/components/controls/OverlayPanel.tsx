import { useEditorStore } from '../../store/useEditorStore';

export function OverlayPanel() {
  const { overlayColor, overlayOpacity, overlayPosition, setOverlayColor, setOverlayOpacity, setOverlayPosition } = useEditorStore();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overlay</h3>

      {/* Color */}
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-slate-300">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={overlayColor}
            onChange={(e) => setOverlayColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-slate-600 bg-transparent"
          />
          <span className="text-xs text-slate-400 font-mono">{overlayColor.toUpperCase()}</span>
        </div>
      </div>

      {/* Opacity */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Opacity</label>
          <span className="text-xs text-slate-400">{overlayOpacity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={overlayOpacity}
          onChange={(e) => setOverlayOpacity(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Position / Coverage Width */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Coverage Width</label>
          <span className="text-xs text-slate-400">{overlayPosition}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={overlayPosition}
          onChange={(e) => setOverlayPosition(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}
