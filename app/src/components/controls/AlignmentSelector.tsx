import { useEditorStore } from '../../store/useEditorStore';
import type { ContentAlignment } from '../../types';

const OPTIONS: { value: ContentAlignment; label: string; icon: string }[] = [
  { value: 'top',    label: 'Top',    icon: '⬆' },
  { value: 'center', label: 'Center', icon: '⬛' },
];

export function AlignmentSelector() {
  const { contentAlignment, setContentAlignment } = useEditorStore();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Content Position</h3>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setContentAlignment(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors border ${
              contentAlignment === opt.value
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="text-xs">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
