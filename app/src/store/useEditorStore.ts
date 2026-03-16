import { create } from 'zustand';
import { BRAND_CONFIGS } from '../constants/brands';
import type { BrandId, ChatLine, EditorActions, EditorState, ExportFormat, ImageMode, ImageOpportunity, LucideIconConfig, SoiSize } from '../types';


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
}));
