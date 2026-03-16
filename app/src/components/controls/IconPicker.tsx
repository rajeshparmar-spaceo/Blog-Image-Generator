import { useState, useMemo, useRef } from 'react';
import { ICONS } from '../../constants/lucideIconData';
import { useEditorStore } from '../../store/useEditorStore';
import { BRAND_CONFIGS } from '../../constants/brands';

const ALL_ICON_NAMES = Object.keys(ICONS);

function IconPreview({ name, size = 16 }: { name: string; size?: number }) {
  const shapes = ICONS[name];
  if (!shapes) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes.map((shape, i) => {
        if (shape.type === 'path') return <path key={i} d={shape.d} />;
        if (shape.type === 'circle') return <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} />;
        if (shape.type === 'line') return <line key={i} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} />;
        if (shape.type === 'polyline') return <polyline key={i} points={shape.points} />;
        if (shape.type === 'rect') return <rect key={i} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx} />;
        return null;
      })}
    </svg>
  );
}

export function IconPicker() {
  const { selectedIcons, setSelectedIcons, customIconImages, setCustomIconImage, brandId } = useEditorStore();
  const primaryColor = BRAND_CONFIGS[brandId].primaryColor;
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const totalCount = selectedIcons.length + customIconImages.filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().replace(/^li_/, '');
    if (!q) return ALL_ICON_NAMES.slice(0, 60);
    return ALL_ICON_NAMES.filter((n) => n.replace('li_', '').includes(q)).slice(0, 80);
  }, [query]);

  const selectedNames = selectedIcons.map((ic) => ic.iconName);

  function toggleIcon(name: string) {
    if (selectedNames.includes(name)) {
      setSelectedIcons(selectedIcons.filter((ic) => ic.iconName !== name));
    } else if (totalCount < 6) {
      const idx = selectedIcons.length;
      const x = 500 + (idx % 3) * 90;
      const y = 150 + Math.floor(idx / 3) * 90;
      setSelectedIcons([...selectedIcons, {
        iconName: name,
        x,
        y,
        size: 24,
        color: '#FFFFFF',
        bgColor: primaryColor,
      }]);
    }
  }

  function handleCustomFile(index: number, file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setCustomIconImage(index, img);
    img.src = url;
  }

  function handleCustomChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleCustomFile(index, file);
    e.target.value = '';
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Icons ({totalCount}/6)
        </label>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Browse'}
        </button>
      </div>

      {/* Selected lucide icon chips */}
      {selectedIcons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedIcons.map((ic) => (
            <button
              key={ic.iconName}
              onClick={() => toggleIcon(ic.iconName)}
              className="flex items-center gap-1 px-2 py-1 bg-blue-600/30 text-blue-300 rounded-md text-xs hover:bg-red-600/30 hover:text-red-300 transition-colors"
              title="Click to remove"
            >
              <IconPreview name={ic.iconName} size={12} />
              <span>{ic.iconName.replace('li_', '')}</span>
            </button>
          ))}
        </div>
      )}

      {/* Lucide icon browser */}
      {isExpanded && (
        <div className="mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 mb-2"
          />
          <div className="grid grid-cols-6 gap-1 max-h-36 overflow-y-auto">
            {filtered.map((name) => {
              const isSelected = selectedNames.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleIcon(name)}
                  title={name.replace('li_', '')}
                  disabled={!isSelected && totalCount >= 6}
                  className={`
                    flex items-center justify-center w-full aspect-square rounded-lg text-sm transition-all
                    ${isSelected
                      ? 'bg-blue-600 text-white'
                      : totalCount >= 6
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <IconPreview name={name} size={14} />
                </button>
              );
            })}
          </div>
          {totalCount >= 6 && (
            <p className="text-xs text-slate-500 mt-1.5">Maximum 6 icons reached</p>
          )}
        </div>
      )}

      {/* Custom icon upload — only for SOC, SOA, SOI, MCB */}
      {(brandId === 'soc' || brandId === 'soa' || brandId === 'soi' || brandId === 'mcb') && (
      <div className="border-t border-slate-700 pt-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Custom Icons (PNG / SVG)</p>
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => {
            const img = customIconImages[i];
            return (
              <div key={i} className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (img) {
                      setCustomIconImage(i, null);
                    } else {
                      inputRefs.current[i]?.click();
                    }
                  }}
                  title={img ? 'Click to remove' : `Upload custom icon ${i + 1}`}
                  className={`
                    relative flex items-center justify-center w-full aspect-square rounded-lg border border-dashed transition-colors overflow-hidden
                    ${img
                      ? 'border-blue-500 bg-blue-600/10 hover:border-red-400 hover:bg-red-600/10'
                      : totalCount >= 6
                        ? 'border-slate-700 bg-slate-800 opacity-40 cursor-not-allowed'
                        : 'border-slate-600 bg-slate-800 hover:border-slate-400 hover:bg-slate-700'
                    }
                  `}
                  disabled={!img && totalCount >= 6}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt={`custom ${i + 1}`}
                      className="w-full h-full object-contain p-0.5"
                    />
                  ) : (
                    <span className="text-slate-500 text-lg leading-none">+</span>
                  )}
                </button>
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="file"
                  accept=".png,.svg,image/png,image/svg+xml"
                  className="hidden"
                  onChange={(e) => handleCustomChange(i, e)}
                />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Uploaded icons replace empty badge slots on the canvas.</p>
      </div>
      )}
    </section>
  );
}
