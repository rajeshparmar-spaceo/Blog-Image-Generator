import { useEditorStore } from '../../store/useEditorStore';

export function CBBorderColorPanel() {
  const { cbBorderColor, setCbBorderColor, cbBorderSize, setCbBorderSize } = useEditorStore();

  function handleSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) setCbBorderSize(val);
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Border</h3>

      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-slate-300">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={cbBorderColor}
            onChange={(e) => setCbBorderColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-slate-600 bg-transparent"
          />
          <span className="text-xs text-slate-400 font-mono">{cbBorderColor.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-slate-300">Size (px)</label>
        <input
          type="number"
          value={cbBorderSize}
          onChange={handleSizeChange}
          min={0}
          step={0.5}
          className="w-20 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-sm text-slate-200 text-right focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}
