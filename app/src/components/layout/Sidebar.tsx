import { useEditorStore } from '../../store/useEditorStore';
import { ImageModeSelector } from '../controls/ImageModeSelector';
import { BrandSelector } from '../controls/BrandSelector';
import { VariantSelector } from '../controls/VariantSelector';
import { TextInputs } from '../controls/TextInputs';
import { StockImageDropzone } from '../controls/StockImageDropzone';
import { IconPicker } from '../controls/IconPicker';
import { InternalImagePanel } from '../controls/InternalImagePanel';
import { OverlayPanel } from '../controls/OverlayPanel';
import { SocLogoGridUpload } from '../controls/SocLogoGridUpload';
import { AlignmentSelector } from '../controls/AlignmentSelector';

export function Sidebar() {
  const { brandId, variant, imageMode } = useEditorStore();

  const showStockPhoto = brandId !== 'taskrhino' && !(brandId === 'welco' && (variant === 'typeB1' || variant === 'typeB2'));
  const showIconPicker =
    (brandId === 'soc' && variant === 'typeA') ||
    (brandId === 'soa' && variant === 'typeA') ||
    (brandId === 'soi' && variant === 'typeA') ||
    (brandId === 'mcb' && variant === 'typeA') ||
    brandId === 'taskrhino' ||
    (brandId === 'welco' && (variant === 'typeA1' || variant === 'typeA2'));
  const showOverlay = brandId === 'mcb' || brandId === 'soa' || brandId === 'soc' || brandId === 'soi';
  const showLogoGrid = variant === 'typeB' && (brandId === 'soc' || brandId === 'soa' || brandId === 'soi' || brandId === 'mcb');

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
                <AlignmentSelector />
                <div className="border-t border-slate-800" />
                <OverlayPanel />
              </>
            )}

            {showLogoGrid && (
              <>
                <div className="border-t border-slate-800" />
                <SocLogoGridUpload />
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
