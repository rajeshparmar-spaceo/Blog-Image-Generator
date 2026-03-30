import { create } from 'zustand';
import { BRAND_CONFIGS } from '../constants/brands';
import type { BrandId, ChatLine, ContentAlignment, EditorActions, EditorState, ExportFormat, ImageMode, ImageOpportunity, LucideIconConfig, SoiSize } from '../types';


type Store = EditorState & EditorActions;

export const useEditorStore = create<Store>((set) => ({
  // Initial state
  brandId: 'mcb',
  variant: 'typeA',
  soiSize: 'standard',
  headline: 'Your Blog Headline Goes Here',
  subtitle: 'A compelling subtitle that supports your main heading',
  stepItems: ['Step one description', 'Step two description', 'Step three description'],
  sourceContent: '',
  chatLines: [
    { id: '1', speaker: 'caller', text: 'Hi, I need help with my account' },
    { id: '2', speaker: 'agent', text: 'Sure! I can help you with that' },
    { id: '3', speaker: 'caller', text: 'Thank you so much!' },
  ],
  stockImage: null,
  selectedIcons: [],
  exportFormat: 'png',
  exportQuality: 90,
  exportScale: 1 as (1 | 2 | 3),
  fontsReady: false,
  logoImages: {},
  // Internal image mode
  imageMode: 'featured' as ImageMode,
  blogUrl: '',
  blogContent: '',
  isAnalyzing: false,
  analyzeError: '',
  imageOpportunities: [] as ImageOpportunity[],
  selectedOpportunityId: '',
  layoutSeed: 0,
  overlayColor: '#FFFFFF',
  overlayOpacity: 92,
  overlayPosition: 40,
  overlayDirection: 'left-right' as ('left-right' | 'top-bottom' | 'right-left'),
  socLogoGridImages: [null, null, null, null, null, null],
  customIconImages: [null, null, null, null, null, null] as (HTMLImageElement | null)[],
  contentAlignment: 'center' as ContentAlignment,
  cbTitlePosition: 'top-center' as ('top-center' | 'left-center'),
  cbVsLogos: [null, null] as (HTMLImageElement | null)[],
  cbToolImages: [null, null, null, null, null, null, null, null] as (HTMLImageElement | null)[],
  cbCostLogo: null as HTMLImageElement | null,
  cbRating: 4.5,
  mcbHeadlineWidth: 360,
  mcbSubtitleWidth: 360,
  cbBgColor: '#FFFFFF',
  cbBgColor2: '#F8F4F0',
  cbBgType: 'gradient' as ('solid' | 'gradient'),
  cbBgGradientDir: 'left-right' as ('left-right' | 'top-bottom' | 'diagonal'),
  cbImageOffsetX: 0,
  cbImageOffsetY: 0,
  cbImageWidth: 0,
  cbImageHeight: 0,
  cbImageLockAspect: true,
  cbTypeCHeadlineWidth: 1000,
  cbTypeCSubtitleWidth: 900,
  cbToolNameEnabled: true,
  cbToolLogoSize: 75,
  titleColor: '#1A1A2E',
  subtitleColor: '#4A5568',
  cbBorderColor: '#F4F4F4',
  cbBorderSize: 1,

  // Actions
  setBrandId: (id: BrandId) => set(() => {
    const firstVariant = BRAND_CONFIGS[id].variants[0].key;
    return { brandId: id, variant: firstVariant };
  }),
  setVariant: (variant: string) => set({ variant }),
  setSoiSize: (soiSize: SoiSize) => set({ soiSize }),
  setHeadline: (headline: string) => set({ headline }),
  setSubtitle: (subtitle: string) => set({ subtitle }),
  setStepItems: (stepItems: string[]) => set({ stepItems }),
  setChatLines: (chatLines: ChatLine[]) => set({ chatLines }),
  setSourceContent: (sourceContent: string) => set({ sourceContent }),
  setStockImage: (stockImage: HTMLImageElement | null) => set({ stockImage }),
  setSelectedIcons: (selectedIcons: LucideIconConfig[]) => set({ selectedIcons }),
  setExportFormat: (exportFormat: ExportFormat) => set({ exportFormat }),
  setExportQuality: (exportQuality: number) => set({ exportQuality }),
  setExportScale: (exportScale: 1 | 2 | 3) => set({ exportScale }),
  setFontsReady: (fontsReady: boolean) => set({ fontsReady }),
  setLogoImage: (brandId: BrandId, img: HTMLImageElement | null) =>
    set((s) => ({ logoImages: { ...s.logoImages, [brandId]: img } })),
  setImageMode: (imageMode: ImageMode) => set({ imageMode }),
  setBlogUrl: (blogUrl: string) => set({ blogUrl }),
  setBlogContent: (blogContent: string) => set({ blogContent }),
  setIsAnalyzing: (isAnalyzing: boolean) => set({ isAnalyzing }),
  setAnalyzeError: (analyzeError: string) => set({ analyzeError }),
  setImageOpportunities: (imageOpportunities: ImageOpportunity[]) => set({ imageOpportunities }),
  setSelectedOpportunityId: (selectedOpportunityId: string) => set({ selectedOpportunityId }),
  bumpLayoutSeed: () => set((s) => ({ layoutSeed: s.layoutSeed + 1 })),
  setOverlayColor: (overlayColor: string) => set({ overlayColor }),
  setOverlayOpacity: (overlayOpacity: number) => set({ overlayOpacity }),
  setOverlayPosition: (overlayPosition: number) => set({ overlayPosition }),
  setOverlayDirection: (overlayDirection) => set({ overlayDirection }),
  setSocLogoGridImage: (index: number, img: HTMLImageElement | null) =>
    set((s) => {
      const updated = [...s.socLogoGridImages];
      updated[index] = img;
      return { socLogoGridImages: updated };
    }),
  setCustomIconImage: (index: number, img: HTMLImageElement | null) =>
    set((s) => {
      const updated = [...s.customIconImages];
      updated[index] = img;
      return { customIconImages: updated };
    }),
  setContentAlignment: (contentAlignment: ContentAlignment) => set({ contentAlignment }),
  setCbTitlePosition: (cbTitlePosition) => set({ cbTitlePosition }),
  setCbVsLogo: (index, img) => set((s) => { const u = [...s.cbVsLogos]; u[index] = img; return { cbVsLogos: u }; }),
  setCbToolImage: (index, img) => set((s) => { const u = [...s.cbToolImages]; u[index] = img; return { cbToolImages: u }; }),
  setCbCostLogo: (cbCostLogo) => set({ cbCostLogo }),
  setCbRating: (cbRating) => set({ cbRating }),
  setMcbHeadlineWidth: (mcbHeadlineWidth) => set({ mcbHeadlineWidth }),
  setMcbSubtitleWidth: (mcbSubtitleWidth) => set({ mcbSubtitleWidth }),
  setCbBgColor: (cbBgColor) => set({ cbBgColor }),
  setCbBgColor2: (cbBgColor2) => set({ cbBgColor2 }),
  setCbBgType: (cbBgType) => set({ cbBgType }),
  setCbBgGradientDir: (cbBgGradientDir) => set({ cbBgGradientDir }),
  setCbImageOffsetX: (cbImageOffsetX) => set({ cbImageOffsetX }),
  setCbImageOffsetY: (cbImageOffsetY) => set({ cbImageOffsetY }),
  setCbImageWidth: (cbImageWidth) => set({ cbImageWidth }),
  setCbImageHeight: (cbImageHeight) => set({ cbImageHeight }),
  setCbImageLockAspect: (cbImageLockAspect) => set({ cbImageLockAspect }),
  setCbTypeCHeadlineWidth: (cbTypeCHeadlineWidth) => set({ cbTypeCHeadlineWidth }),
  setCbTypeCSubtitleWidth: (cbTypeCSubtitleWidth) => set({ cbTypeCSubtitleWidth }),
  setCbToolNameEnabled: (cbToolNameEnabled) => set({ cbToolNameEnabled }),
  setCbToolLogoSize: (cbToolLogoSize) => set({ cbToolLogoSize }),
  setTitleColor: (titleColor) => set({ titleColor }),
  setSubtitleColor: (subtitleColor) => set({ subtitleColor }),
  setCbBorderColor: (cbBorderColor) => set({ cbBorderColor }),
  setCbBorderSize: (cbBorderSize) => set({ cbBorderSize }),
}));
