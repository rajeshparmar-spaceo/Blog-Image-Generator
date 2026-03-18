import { useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export function CBCostReviewPanel() {
  const { cbCostLogo, setCbCostLogo, cbRating, setCbRating } = useEditorStore();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setCbCostLogo(img);
    img.src = url;
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Logo upload */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tool Logo</h3>
        <button
          onClick={() => cbCostLogo ? setCbCostLogo(null) : inputRef.current?.click()}
          className={`flex items-center justify-center h-16 w-full rounded-lg border border-dashed transition-colors overflow-hidden ${
            cbCostLogo ? 'border-orange-500 bg-orange-600/10 hover:border-red-400 hover:bg-red-600/10' : 'border-slate-600 bg-slate-800 hover:border-slate-400'
          }`}
          title={cbCostLogo ? 'Click to remove' : 'Upload logo'}
        >
          {cbCostLogo ? (
            <img src={cbCostLogo.src} alt="logo" className="max-w-full max-h-full object-contain p-1" />
          ) : (
            <span className="text-slate-500 text-sm">+ Upload Logo</span>
          )}
        </button>
        <input ref={inputRef} type="file" accept=".png,.svg,.jpg,.jpeg,image/*" className="hidden" onChange={handleChange} />
      </div>

      {/* Star rating */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Rating: {cbRating.toFixed(1)} / 5.0
        </h3>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={cbRating}
          onChange={(e) => setCbRating(Number(e.target.value))}
          className="w-full accent-orange-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>0</span>
          <span>2.5</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
}
