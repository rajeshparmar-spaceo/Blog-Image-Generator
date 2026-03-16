import { useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

const SLOT_LABELS = ['Logo 1', 'Logo 2', 'Logo 3', 'Logo 4', 'Logo 5', 'Logo 6'];

export function SocLogoGridUpload() {
  const { socLogoGridImages, setSocLogoGridImage } = useEditorStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleFile(index: number, file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setSocLogoGridImage(index, img);
    img.src = url;
  }

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(index, file);
    e.target.value = '';
  }

  function handleRemove(index: number) {
    setSocLogoGridImage(index, null);
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logo Grid Images</h3>
      <p className="text-xs text-slate-500">Upload PNG or SVG for each cell. Empty cells show a placeholder.</p>

      <div className="grid grid-cols-3 gap-2">
        {SLOT_LABELS.map((label, i) => {
          const img = socLogoGridImages[i];
          return (
            <div key={i} className="flex flex-col gap-1">
              <button
                onClick={() => inputRefs.current[i]?.click()}
                className="relative flex items-center justify-center w-full h-14 rounded-lg border border-dashed border-slate-600 bg-slate-800 hover:border-slate-400 hover:bg-slate-700 transition-colors overflow-hidden"
                title={`Upload ${label}`}
              >
                {img ? (
                  <img
                    src={img.src}
                    alt={label}
                    className="max-w-full max-h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-slate-500 text-xs text-center leading-tight px-1">{label}</span>
                )}
              </button>

              {img && (
                <button
                  onClick={() => handleRemove(i)}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors text-center"
                >
                  Remove
                </button>
              )}

              <input
                ref={(el) => { inputRefs.current[i] = el; }}
                type="file"
                accept=".png,.svg,image/png,image/svg+xml"
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
