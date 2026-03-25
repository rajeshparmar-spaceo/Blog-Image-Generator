import { useRef, useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export function CBToolUpload() {
  const {
    cbToolImages, setCbToolImage,
    stepItems, setStepItems,
    cbToolNameEnabled, setCbToolNameEnabled,
    cbTypeCHeadlineWidth, setCbTypeCHeadlineWidth,
    cbTypeCSubtitleWidth, setCbTypeCSubtitleWidth,
    cbToolLogoSize, setCbToolLogoSize,
  } = useEditorStore();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Determine how many slots to show: at least 3, at most 8, always one empty at end
  const filledCount = cbToolImages.filter(Boolean).length;
  const [visibleSlots, setVisibleSlots] = useState(() => Math.min(8, Math.max(3, filledCount + 1)));

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setCbToolImage(index, img);
    img.src = url;
    e.target.value = '';
  }

  function handleRemove(i: number) {
    setCbToolImage(i, null);
  }

  function handleAddSlot() {
    setVisibleSlots((v) => Math.min(8, v + 1));
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Headline width ── */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Text Widths</h3>
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-slate-300">Headline Width</label>
              <span className="text-xs text-slate-400">{cbTypeCHeadlineWidth}px</span>
            </div>
            <input
              type="range"
              min={300}
              max={1416}
              step={10}
              value={cbTypeCHeadlineWidth}
              onChange={(e) => setCbTypeCHeadlineWidth(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-slate-300">Subtitle Width</label>
              <span className="text-xs text-slate-400">{cbTypeCSubtitleWidth}px</span>
            </div>
            <input
              type="range"
              min={300}
              max={1416}
              step={10}
              value={cbTypeCSubtitleWidth}
              onChange={(e) => setCbTypeCSubtitleWidth(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-slate-300">Logo Size</label>
              <span className="text-xs text-slate-400">{cbToolLogoSize}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={1}
              value={cbToolLogoSize}
              onChange={(e) => setCbToolLogoSize(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800" />

      {/* ── Tool logos ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tool Logos ({visibleSlots}/8)
          </h3>
          {/* Tool name toggle */}
          <button
            onClick={() => setCbToolNameEnabled(!cbToolNameEnabled)}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${
              cbToolNameEnabled
                ? 'bg-orange-600/30 text-orange-300 hover:bg-orange-600/50'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
            title={cbToolNameEnabled ? 'Hide tool names' : 'Show tool names'}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 10H3M21 6H3M21 14H3M17 18H3"/>
            </svg>
            {cbToolNameEnabled ? 'Names On' : 'Names Off'}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: visibleSlots }).map((_, i) => {
            const img = cbToolImages[i];
            const name = stepItems[i] ?? '';
            return (
              <div key={i} className="flex items-center gap-2">
                {/* Logo upload / preview */}
                <button
                  onClick={() => img ? handleRemove(i) : inputRefs.current[i]?.click()}
                  className={`flex-none flex items-center justify-center w-12 h-10 rounded-lg border border-dashed transition-colors overflow-hidden ${
                    img
                      ? 'border-orange-500 bg-orange-600/10 hover:border-red-400'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-400'
                  }`}
                  title={img ? 'Click to remove' : `Upload logo ${i + 1}`}
                >
                  {img ? (
                    <img src={img.src} alt={`tool ${i + 1}`} className="max-w-full max-h-full object-contain p-0.5" />
                  ) : (
                    <span className="text-slate-500 text-lg leading-none">+</span>
                  )}
                </button>

                {/* Tool name input */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const next = [...stepItems];
                    while (next.length <= i) next.push('');
                    next[i] = e.target.value;
                    setStepItems(next);
                  }}
                  placeholder={`Tool ${i + 1} name`}
                  className={`flex-1 bg-slate-800 text-slate-100 text-xs rounded-md px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-orange-500 transition-opacity ${
                    cbToolNameEnabled ? 'opacity-100' : 'opacity-40'
                  }`}
                />

                {/* Remove slot button (only if last slot and empty, or any slot) */}
                {i === visibleSlots - 1 && visibleSlots > 3 && !img && (
                  <button
                    onClick={() => setVisibleSlots((v) => v - 1)}
                    className="flex-none w-7 h-7 flex items-center justify-center text-slate-600 hover:text-red-400 rounded-md hover:bg-slate-700 transition-colors"
                    title="Remove slot"
                  >
                    ×
                  </button>
                )}

                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg,image/*"
                  className="hidden"
                  onChange={(e) => handleChange(i, e)}
                />
              </div>
            );
          })}
        </div>

        {/* Add Tool button */}
        {visibleSlots < 8 && (
          <button
            onClick={handleAddSlot}
            className="mt-2 w-full text-xs text-slate-400 hover:text-orange-300 py-1.5 border border-dashed border-slate-700 hover:border-orange-500 rounded-lg transition-colors"
          >
            + Add Tool
          </button>
        )}
      </div>
    </div>
  );
}
