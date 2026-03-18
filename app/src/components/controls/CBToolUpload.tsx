import { useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export function CBToolUpload() {
  const { cbToolImages, setCbToolImage, stepItems, setStepItems } = useEditorStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setCbToolImage(index, img);
    img.src = url;
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tool Logos (up to 5)</h3>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => {
          const img = cbToolImages[i];
          const name = stepItems[i] ?? '';
          return (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => img ? setCbToolImage(i, null) : inputRefs.current[i]?.click()}
                className={`flex-none flex items-center justify-center w-12 h-10 rounded-lg border border-dashed transition-colors overflow-hidden ${
                  img ? 'border-orange-500 bg-orange-600/10 hover:border-red-400' : 'border-slate-600 bg-slate-800 hover:border-slate-400'
                }`}
                title={img ? 'Click to remove' : `Upload logo ${i + 1}`}
              >
                {img ? (
                  <img src={img.src} alt={`tool ${i + 1}`} className="max-w-full max-h-full object-contain p-0.5" />
                ) : (
                  <span className="text-slate-500 text-lg">+</span>
                )}
              </button>
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
                className="flex-1 bg-slate-800 text-slate-100 text-xs rounded-md px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-orange-500"
              />
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
