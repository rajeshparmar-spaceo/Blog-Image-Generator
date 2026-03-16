import { useEditorStore } from '../../store/useEditorStore';
import type { SoiSize } from '../../types';

export function SizeSelector() {
  const { soiSize, setSoiSize } = useEditorStore();

  return (
    <section>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        SOI Canvas Size
      </label>
      <div className="flex gap-2">
        {(['standard', 'wide'] as SoiSize[]).map((size) => (
          <button
            key={size}
            onClick={() => setSoiSize(size)}
            className={`
              flex-1 py-2 rounded-lg text-xs font-medium transition-all
              ${soiSize === size
                ? 'bg-lime-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }
            `}
          >
            {size === 'standard' ? 'Standard (708×374)' : 'Wide (1400×748)'}
          </button>
        ))}
      </div>
    </section>
  );
}
