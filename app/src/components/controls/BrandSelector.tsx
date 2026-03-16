import { useEditorStore } from '../../store/useEditorStore';
import { BRAND_CONFIGS, BRAND_ORDER } from '../../constants/brands';
import type { BrandId } from '../../types';

const BRAND_COLORS: Record<BrandId, string> = {
  mcb: '#2B7DE9',
  soa: '#2ECC71',
  soc: '#E74C3C',
  soi: '#A3C423',
  taskrhino: '#7C3AED',
  welco: '#004CE6',
};

export function BrandSelector() {
  const { brandId, setBrandId } = useEditorStore();

  return (
    <section>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Brand</label>
      <div className="grid grid-cols-2 gap-1.5">
        {BRAND_ORDER.map((id) => {
          const cfg = BRAND_CONFIGS[id];
          const isActive = id === brandId;
          return (
            <button
              key={id}
              onClick={() => setBrandId(id)}
              className={`
                flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all
                ${isActive
                  ? 'bg-slate-700 text-white ring-1 ring-white/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }
              `}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-none"
                style={{ backgroundColor: BRAND_COLORS[id] }}
              />
              <span className="truncate">{cfg.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
