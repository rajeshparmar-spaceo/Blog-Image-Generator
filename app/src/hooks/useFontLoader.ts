import { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export function useFontLoader() {
  const setFontsReady = useEditorStore((s) => s.setFontsReady);

  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsReady(true);
      });
    } else {
      // Fallback if fonts API not available
      setTimeout(() => setFontsReady(true), 500);
    }
  }, [setFontsReady]);
}
