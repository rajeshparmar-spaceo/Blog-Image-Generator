import { useEditorStore } from '../../store/useEditorStore';

export function MCBTextWidthPanel() {
  const { mcbHeadlineWidth, mcbSubtitleWidth, setMcbHeadlineWidth, setMcbSubtitleWidth } = useEditorStore();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Text Width</h3>

      {/* Headline width */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Title Width</label>
          <span className="text-xs text-slate-400">{mcbHeadlineWidth}px</span>
        </div>
        <input
          type="range"
          min={150}
          max={700}
          value={mcbHeadlineWidth}
          onChange={(e) => setMcbHeadlineWidth(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Subtitle width */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label className="text-sm text-slate-300">Subtitle Width</label>
          <span className="text-xs text-slate-400">{mcbSubtitleWidth}px</span>
        </div>
        <input
          type="range"
          min={150}
          max={700}
          value={mcbSubtitleWidth}
          onChange={(e) => setMcbSubtitleWidth(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}
