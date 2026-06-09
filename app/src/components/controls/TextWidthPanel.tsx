interface TextWidthPanelProps {
  titleWidth: number;
  subtitleWidth: number;
  setTitleWidth: (w: number) => void;
  setSubtitleWidth: (w: number) => void;
  min: number;
  max: number;
}

export function TextWidthPanel({ titleWidth, subtitleWidth, setTitleWidth, setSubtitleWidth, min, max }: TextWidthPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Text Width</h3>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Title Width</label>
          <span className="text-xs text-slate-400">{titleWidth}px</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={titleWidth}
          onChange={(e) => setTitleWidth(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Subtitle Width</label>
          <span className="text-xs text-slate-400">{subtitleWidth}px</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={subtitleWidth}
          onChange={(e) => setSubtitleWidth(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}
