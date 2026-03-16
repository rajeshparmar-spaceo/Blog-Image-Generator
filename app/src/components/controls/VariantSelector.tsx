import { useEditorStore } from '../../store/useEditorStore';
import { BRAND_CONFIGS } from '../../constants/brands';

export function VariantSelector() {
  const { brandId, variant, setVariant } = useEditorStore();
  const variants = BRAND_CONFIGS[brandId].variants;

  return (
    <section>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Layout Variant
      </label>
      <div className="flex flex-col gap-1">
        {variants.map((v) => {
          const isActive = v.key === variant;
          return (
            <button
              key={v.key}
              onClick={() => setVariant(v.key)}
              className={`
                text-left px-3 py-2 rounded-lg text-xs transition-all
                ${isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }
              `}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
