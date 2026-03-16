import { useEffect } from 'react';
import { BRAND_CONFIGS, BRAND_ORDER } from '../constants/brands';
import { useEditorStore } from '../store/useEditorStore';
import type { BrandId } from '../types';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

export function useLogoPreloader() {
  const setLogoImage = useEditorStore((s) => s.setLogoImage);

  useEffect(() => {
    BRAND_ORDER.forEach((brandId: BrandId) => {
      const cfg = BRAND_CONFIGS[brandId];
      loadImage(cfg.logoPath)
        .then((img) => setLogoImage(brandId, img))
        .catch((err) => {
          console.warn(`Logo load failed for ${brandId}:`, err);
          setLogoImage(brandId, null);
        });
    });
  }, [setLogoImage]);
}
