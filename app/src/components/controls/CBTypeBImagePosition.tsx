import { useEditorStore } from '../../store/useEditorStore';

export function CBTypeBImagePosition() {
  const {
    cbImageOffsetX, setCbImageOffsetX,
    cbImageOffsetY, setCbImageOffsetY,
    cbImageWidth, setCbImageWidth,
    cbImageHeight, setCbImageHeight,
    cbImageLockAspect, setCbImageLockAspect,
    stockImage,
  } = useEditorStore();

  // Natural image aspect ratio (for locked scaling)
  const naturalAspect = stockImage ? stockImage.naturalWidth / stockImage.naturalHeight : 16 / 9;

  function handleWidthChange(raw: number) {
    const w = Math.max(0, raw);
    setCbImageWidth(w);
    if (cbImageLockAspect && w > 0) {
      setCbImageHeight(Math.round(w / naturalAspect));
    }
  }

  function handleHeightChange(raw: number) {
    const h = Math.max(0, raw);
    setCbImageHeight(h);
    if (cbImageLockAspect && h > 0) {
      setCbImageWidth(Math.round(h * naturalAspect));
    }
  }

  function handleReset() {
    setCbImageWidth(0);
    setCbImageHeight(0);
  }

  const wDisplay = cbImageWidth > 0 ? cbImageWidth : '—';
  const hDisplay = cbImageHeight > 0 ? cbImageHeight : '—';

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image Size &amp; Position</h3>

      {/* Width & Height */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Dimensions</span>
          {/* Lock aspect ratio toggle */}
          <button
            onClick={() => setCbImageLockAspect(!cbImageLockAspect)}
            title={cbImageLockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${
              cbImageLockAspect
                ? 'bg-blue-600/30 text-blue-300 hover:bg-blue-600/50'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {cbImageLockAspect ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
            )}
            {cbImageLockAspect ? 'Locked' : 'Free'}
          </button>
        </div>

        <div className="flex gap-2">
          {/* Width input */}
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">W (px)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={1416}
                step={1}
                value={cbImageWidth || ''}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                placeholder="auto"
                className="w-full bg-slate-800 text-slate-100 text-sm rounded-md px-2 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-end pb-2 text-slate-600">×</div>

          {/* Height input */}
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">H (px)</label>
            <input
              type="number"
              min={0}
              max={748}
              step={1}
              value={cbImageHeight || ''}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              placeholder="auto"
              className="w-full bg-slate-800 text-slate-100 text-sm rounded-md px-2 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Width slider */}
        <div>
          <input
            type="range"
            min={100}
            max={1416}
            step={4}
            value={cbImageWidth || 800}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-0.5">
            <span>100</span>
            <span>Current: {wDisplay} × {hDisplay}</span>
            <span>1416</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="self-end text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Reset to auto
        </button>
      </div>

      <div className="border-t border-slate-800" />

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
