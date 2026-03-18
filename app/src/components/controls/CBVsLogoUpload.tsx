import { useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

const LABELS = ['Logo 1 (Left)', 'Logo 2 (Right)'];

export function CBVsLogoUpload() {
  const { cbVsLogos, setCbVsLogo } = useEditorStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setCbVsLogo(index, img);
    img.src = url;
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">VS Logos</h3>
      <div className="flex gap-3">
        {LABELS.map((label, i) => {
          const img = cbVsLogos[i];
          return (
            <div key={i} className="flex-1 flex flex-col gap-1">
              <button
                onClick={() => img ? setCbVsLogo(i, null) : inputRefs.current[i]?.click()}
                className={`flex items-center justify-center h-16 rounded-lg border border-dashed transition-colors overflow-hidden ${
                  img ? 'border-orange-500 bg-orange-600/10 hover:border-red-400 hover:bg-red-600/10' : 'border-slate-600 bg-slate-800 hover:border-slate-400'
                }`}
                title={img ? 'Click to remove' : `Upload ${label}`}
              >
                {img ? (
                  <img src={img.src} alt={label} className="max-w-full max-h-full object-contain p-1" />
                ) : (
                  <span className="text-slate-500 text-xs text-center px-2">{label}</span>
                )}
              </button>
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
    </div>
  );
}
