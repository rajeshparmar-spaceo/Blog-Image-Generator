import { useEditorStore } from '../../store/useEditorStore';
import type { ImageMode } from '../../types';

const MODES: { value: ImageMode; label: string; desc: string }[] = [
  { value: 'featured', label: 'Featured Image', desc: 'Blog header / thumbnail' },
  { value: 'internal', label: 'Internal Image', desc: 'Inline article visuals' },
];

export function ImageModeSelector() {
  const { imageMode, setImageMode } = useEditorStore();

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image Type</p>
      <div className="flex gap-2">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setImageMode(m.value)}
            className={[
              'flex-1 flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-lg border text-center transition-all',
              imageMode === m.value
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600',
            ].join(' ')}
          >
            <span className="text-xs font-semibold leading-tight">{m.label}</span>
            <span className={`text-[10px] leading-tight ${imageMode === m.value ? 'text-violet-200' : 'text-slate-600'}`}>
              {m.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
