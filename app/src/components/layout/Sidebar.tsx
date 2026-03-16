import { useEditorStore } from '../../store/useEditorStore';
import { ImageModeSelector } from '../controls/ImageModeSelector';
import { BrandSelector } from '../controls/BrandSelector';
import { VariantSelector } from '../controls/VariantSelector';
import { SizeSelector } from '../controls/SizeSelector';
import { TextInputs } from '../controls/TextInputs';
import { StockImageDropzone } from '../controls/StockImageDropzone';
import { IconPicker } from '../controls/IconPicker';
import { InternalImagePanel } from '../controls/InternalImagePanel';
import { OverlayPanel } from '../controls/OverlayPanel';

export function Sidebar() {
  const { brandId, variant, imageMode } = useEditorStore();

  const showSoiSize   = brandId === 'soi';
  const showStockPhoto = brandId !== 'taskrhino' && !(brandId === 'welco' && (variant === 'typeB1' || variant === 'typeB2'));
  const showIconPicker = brandId !== 'welco' || variant === 'typeA1' || variant === 'typeA2';
  const showOverlay = brandId === 'mcb' || brandId === 'soa' || brandId === 'soc' || brandId === 'soi';

  return (
    <aside className="flex-none w-72 bg-slate-900 border-r border-slate-800 overflow-y-auto">
      <div className="flex flex-col gap-4 p-4">

        {/* ── Mode toggle ── always visible */}
        <ImageModeSelector />

        <div className="border-t border-slate-800" />

        {/* ── Brand selector ── always visible (sets colors for both modes) */}
        <BrandSelector />

        {/* ── FEATURED mode controls ── */}
        {imageMode === 'featured' && (
          <>
            <div className="border-t border-slate-800" />
            <VariantSelector />

            {showSoiSize && (
              <>
                <div className="border-t border-slate-800" />
                <SizeSelector />
              </>
            )}

            <div className="border-t border-slate-800" />
            <TextInputs />

            {showStockPhoto && (
              <>
                <div className="border-t border-slate-800" />
                <StockImageDropzone />
              </>
            )}

            {showOverlay && (
              <>
                <div className="border-t border-slate-800" />
                <OverlayPanel />
              </>
            )}

            {showIconPicker && (
              <>
                <div className="border-t border-slate-800" />
                <IconPicker />
              </>
            )}
          </>
        )}

        {/* ── INTERNAL mode controls ── */}
        {imageMode === 'internal' && (
          <>
            <div className="border-t border-slate-800" />
            <InternalImagePanel />
          </>
        )}

      </div>
    </aside>
  );
}
