import { useEditorStore } from '../../store/useEditorStore';

const GRADIENT_DIRS = [
  { value: 'left-right', label: '→' },
  { value: 'top-bottom', label: '↓' },
  { value: 'diagonal',   label: '↘' },
] as const;

export function CBTypeBBgPanel() {
  const {
    cbBgType, cbBgColor, cbBgColor2, cbBgGradientDir,
    setCbBgType, setCbBgColor, setCbBgColor2, setCbBgGradientDir,
  } = useEditorStore();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Background</h3>

      {/* Type toggle */}
      <div className="flex rounded overflow-hidden border border-slate-700">
        {(['solid', 'gradient'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setCbBgType(t)}
            className={`flex-1 py-1.5 text-xs font-medium transition-colors capitalize ${
              cbBgType === t
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Primary color */}
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-slate-300">{cbBgType === 'gradient' ? 'From' : 'Color'}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={cbBgColor}
            onChange={(e) => setCbBgColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-slate-600 bg-transparent"
          />
          <span className="text-xs text-slate-400 font-mono">{cbBgColor.toUpperCase()}</span>
        </div>
      </div>

      {/* Secondary color + direction — gradient only */}
      {cbBgType === 'gradient' && (
        <>
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm text-slate-300">To</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cbBgColor2}
                onChange={(e) => setCbBgColor2(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-slate-600 bg-transparent"
              />
              <span className="text-xs text-slate-400 font-mono">{cbBgColor2.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Direction</label>
            <div className="flex rounded overflow-hidden border border-slate-700">
              {GRADIENT_DIRS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setCbBgGradientDir(d.value)}
                  title={d.value.replace('-', ' ')}
                  className={`flex-1 py-1.5 text-sm font-bold transition-colors ${
                    cbBgGradientDir === d.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
