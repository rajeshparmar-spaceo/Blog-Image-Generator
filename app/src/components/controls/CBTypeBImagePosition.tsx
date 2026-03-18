import { useEditorStore } from '../../store/useEditorStore';

export function CBTypeBImagePosition() {
  const { cbImageOffsetX, cbImageOffsetY, setCbImageOffsetX, setCbImageOffsetY } = useEditorStore();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image Position</h3>

      {/* X offset */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Horizontal (X)</label>
          <span className="text-xs text-slate-400">{cbImageOffsetX > 0 ? `+${cbImageOffsetX}` : cbImageOffsetX}px</span>
        </div>
        <input
          type="range"
          min={-400}
          max={400}
          value={cbImageOffsetX}
          onChange={(e) => setCbImageOffsetX(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <button
          onClick={() => setCbImageOffsetX(0)}
          className="self-end text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Y offset */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Vertical (Y)</label>
          <span className="text-xs text-slate-400">{cbImageOffsetY > 0 ? `+${cbImageOffsetY}` : cbImageOffsetY}px</span>
        </div>
        <input
          type="range"
          min={-200}
          max={200}
          value={cbImageOffsetY}
          onChange={(e) => setCbImageOffsetY(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <button
          onClick={() => setCbImageOffsetY(0)}
          className="self-end text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
