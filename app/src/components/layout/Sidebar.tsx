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
import { MCBTextWidthPanel } from '../controls/MCBTextWidthPanel';
import { CBTitlePositionSelector } from '../controls/CBTitlePositionSelector';
import { CBTypeBBgPanel } from '../controls/CBTypeBBgPanel';
import { CBTypeBImagePosition } from '../controls/CBTypeBImagePosition';
import { CBVsLogoUpload } from '../controls/CBVsLogoUpload';
import { CBToolUpload } from '../controls/CBToolUpload';
import { CBCostReviewPanel } from '../controls/CBCostReviewPanel';

export function Sidebar() {
  const { brandId, variant, imageMode, cbTitlePosition } = useEditorStore();

  const isCB = brandId === 'contentbridge';
  const showStockPhoto = brandId !== 'taskrhino' && !(brandId === 'welco' && (variant === 'typeB1' || variant === 'typeB2')) && !(isCB && (variant === 'typeC' || variant === 'typeD' || variant === 'typeE'));
  const showIconPicker =
    (brandId === 'soc' && variant === 'typeA') ||
    (brandId === 'soa' && variant === 'typeA') ||
    (brandId === 'soi' && variant === 'typeA') ||
    (brandId === 'mcb' && variant === 'typeA') ||
    brandId === 'taskrhino' ||
    (brandId === 'welco' && (variant === 'typeA1' || variant === 'typeA2'));
  const showOverlay = brandId === 'mcb' || brandId === 'soa' || brandId === 'soc' || brandId === 'soi' || (isCB && variant === 'typeA');
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

            {brandId === 'mcb' && (
              <>
                <div className="border-t border-slate-800" />
                <MCBTextWidthPanel />
              </>
            )}

            {showStockPhoto && (
              <>
                <div className="border-t border-slate-800" />
                <StockImageDropzone />
              </>
            )}

            {isCB && (variant === 'typeA' || variant === 'typeB') && (
              <>
                <div className="border-t border-slate-800" />
                <CBTitlePositionSelector />
              </>
            )}

            {isCB && variant === 'typeB' && (
              <>
                <div className="border-t border-slate-800" />
                <CBTypeBBgPanel />
              </>
            )}

            {isCB && variant === 'typeB' && cbTitlePosition === 'top-center' && (
              <>
                <div className="border-t border-slate-800" />
                <CBTypeBImagePosition />
              </>
            )}

            {showOverlay && (
              <>
                {!(isCB && variant === 'typeA') && (
                  <>
                    <div className="border-t border-slate-800" />
                    <AlignmentSelector />
                  </>
                )}
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

            {/* ContentBridge-specific controls */}
            {isCB && variant === 'typeD' && (
              <>
                <div className="border-t border-slate-800" />
                <CBVsLogoUpload />
              </>
            )}
            {isCB && variant === 'typeC' && (
              <>
                <div className="border-t border-slate-800" />
                <CBToolUpload />
              </>
            )}
            {isCB && variant === 'typeE' && (
              <>
                <div className="border-t border-slate-800" />
                <CBCostReviewPanel />
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
