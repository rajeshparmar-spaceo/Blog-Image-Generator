import { useEditorStore } from '../../store/useEditorStore';

type Position = 'top-center' | 'left-center' | 'right-center';

const OPTIONS: { value: Position; label: string }[] = [
  { value: 'top-center',   label: 'Top Center' },
  { value: 'left-center',  label: 'Left Center' },
  { value: 'right-center', label: 'Right Center' },
];

export function CBTitlePositionSelector() {
  const { cbTitlePosition, setCbTitlePosition } = useEditorStore();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title Position</h3>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setCbTitlePosition(opt.value)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors border ${
              cbTitlePosition === opt.value
                ? 'bg-orange-600 border-orange-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
