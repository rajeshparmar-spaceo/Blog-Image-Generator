export type BrandId = 'mcb' | 'soa' | 'soc' | 'soi' | 'taskrhino' | 'welco';

export type ImageMode = 'featured' | 'internal';

export type VisualType = 'steps' | 'comparison' | 'metrics' | 'benefits' | 'process' | 'review' | 'concept';

export interface ImageOpportunity {
  id: string;
  index: number;
  sectionTitle: string;
  sectionBody: string;
  visualType: VisualType;
  reason: string;
  points: string[];
  numbers: string[];
}

export type SoiSize = 'standard' | 'wide';

export type ExportFormat = 'png' | 'webp' | 'jpeg';

export interface ChatLine {
  id: string;
  speaker: 'agent' | 'caller';
  text: string;
}

export interface LucideIconConfig {
  iconName: string;
  x: number;
  y: number;
  size: number;
  color: string;
  bgColor: string;
}

export interface BrandConfig {
  id: BrandId;
  label: string;
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
  logoPath: string;
  variants: VariantConfig[];
  canvasWidth: number;
  canvasHeight: number;
}

export interface VariantConfig {
  key: string;
  label: string;
}

export interface EditorState {
  brandId: BrandId;
  variant: string;
  soiSize: SoiSize;
  headline: string;
  subtitle: string;
  stepItems: string[];
  chatLines: ChatLine[];
  sourceContent: string;
  stockImage: HTMLImageElement | null;
  selectedIcons: LucideIconConfig[];
  exportFormat: ExportFormat;
  exportQuality: number;
  fontsReady: boolean;
  logoImages: Partial<Record<BrandId, HTMLImageElement | null>>;
  // Internal image mode
  imageMode: ImageMode;
  blogUrl: string;
  blogContent: string;
  isAnalyzing: boolean;
  analyzeError: string;
  imageOpportunities: ImageOpportunity[];
  selectedOpportunityId: string;
  layoutSeed: number;
  overlayColor: string;
  overlayOpacity: number;
  overlayPosition: number;
}

export interface EditorActions {
  setBrandId: (id: BrandId) => void;
  setVariant: (variant: string) => void;
  setSoiSize: (size: SoiSize) => void;
  setHeadline: (text: string) => void;
  setSubtitle: (text: string) => void;
  setStepItems: (items: string[]) => void;
  setChatLines: (lines: ChatLine[]) => void;
  setSourceContent: (text: string) => void;
  setStockImage: (img: HTMLImageElement | null) => void;
  setSelectedIcons: (icons: LucideIconConfig[]) => void;
  setExportFormat: (format: ExportFormat) => void;
  setExportQuality: (quality: number) => void;
  setFontsReady: (ready: boolean) => void;
  setLogoImage: (brandId: BrandId, img: HTMLImageElement | null) => void;
  setImageMode: (mode: ImageMode) => void;
  setBlogUrl: (url: string) => void;
  setBlogContent: (text: string) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalyzeError: (msg: string) => void;
  setImageOpportunities: (opps: ImageOpportunity[]) => void;
  setSelectedOpportunityId: (id: string) => void;
  bumpLayoutSeed: () => void;
  setOverlayColor: (color: string) => void;
  setOverlayOpacity: (opacity: number) => void;
  setOverlayPosition: (position: number) => void;
}
