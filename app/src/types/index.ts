export type BrandId = 'mcb' | 'soa' | 'soc' | 'soi' | 'taskrhino' | 'welco' | 'contentbridge';

export type ImageMode = 'featured' | 'internal';
export type ContentAlignment = 'top' | 'center';

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
  exportScale: 1 | 2 | 3;
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
  overlayDirection: 'left-right' | 'top-bottom';
  socLogoGridImages: (HTMLImageElement | null)[];
  customIconImages: (HTMLImageElement | null)[];
  contentAlignment: ContentAlignment;
  cbTitlePosition: 'top-center' | 'left-center';
  cbVsLogos: (HTMLImageElement | null)[];
  cbToolImages: (HTMLImageElement | null)[];
  cbCostLogo: HTMLImageElement | null;
  cbRating: number;
  mcbHeadlineWidth: number;
  mcbSubtitleWidth: number;
  cbBgColor: string;
  cbBgColor2: string;
  cbBgType: 'solid' | 'gradient';
  cbBgGradientDir: 'left-right' | 'top-bottom' | 'diagonal';
  cbImageOffsetX: number;
  cbImageOffsetY: number;
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
  setExportScale: (scale: 1 | 2 | 3) => void;
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
  setOverlayDirection: (direction: 'left-right' | 'top-bottom') => void;
  setSocLogoGridImage: (index: number, img: HTMLImageElement | null) => void;
  setCustomIconImage: (index: number, img: HTMLImageElement | null) => void;
  setContentAlignment: (alignment: ContentAlignment) => void;
  setCbTitlePosition: (pos: 'top-center' | 'left-center') => void;
  setCbVsLogo: (index: number, img: HTMLImageElement | null) => void;
  setCbToolImage: (index: number, img: HTMLImageElement | null) => void;
  setCbCostLogo: (img: HTMLImageElement | null) => void;
  setCbRating: (rating: number) => void;
  setMcbHeadlineWidth: (w: number) => void;
  setMcbSubtitleWidth: (w: number) => void;
  setCbBgColor: (color: string) => void;
  setCbBgColor2: (color: string) => void;
  setCbBgType: (type: 'solid' | 'gradient') => void;
  setCbBgGradientDir: (dir: 'left-right' | 'top-bottom' | 'diagonal') => void;
  setCbImageOffsetX: (v: number) => void;
  setCbImageOffsetY: (v: number) => void;
}
