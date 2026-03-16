import { useEffect, type RefObject } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { getBrandCanvasSize } from '../constants/brands';
import { mcbRenderer } from '../renderers/mcbRenderer';
import { soaRenderer } from '../renderers/soaRenderer';
import { socRenderer } from '../renderers/socRenderer';
import { soiRenderer } from '../renderers/soiRenderer';
import { taskRhinoRenderer } from '../renderers/taskRhinoRenderer';
import { welcoRenderer } from '../renderers/welcoRenderer';
import { renderInternalImage } from '../renderers/internalImageRenderer';

export function useCanvasRenderer(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const state = useEditorStore();

  // ── Featured image mode ─────────────────────────────────────────────────────
  useEffect(() => {
    if (state.imageMode !== 'featured') return;

    const canvas = canvasRef.current;
    if (!canvas || !state.fontsReady) return;

    const { width, height } = getBrandCanvasSize(state.brandId, state.soiSize);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    switch (state.brandId) {
      case 'mcb':       mcbRenderer(ctx, state);       break;
      case 'soa':       soaRenderer(ctx, state);       break;
      case 'soc':       socRenderer(ctx, state);       break;
      case 'soi':       soiRenderer(ctx, state);       break;
      case 'taskrhino': taskRhinoRenderer(ctx, state); break;
      case 'welco':     welcoRenderer(ctx, state);     break;
    }
  }, [
    state.imageMode,
    state.brandId, state.variant, state.soiSize,
    state.headline, state.subtitle, state.stepItems, state.chatLines,
    state.stockImage, state.selectedIcons, state.fontsReady, state.logoImages,
    canvasRef,
  ]);

  // ── Internal image mode ─────────────────────────────────────────────────────
  useEffect(() => {
    if (state.imageMode !== 'internal') return;

    const canvas = canvasRef.current;
    if (!canvas || !state.fontsReady) return;

    const { width, height } = getBrandCanvasSize(state.brandId, state.soiSize);
    const opp = state.imageOpportunities.find(o => o.id === state.selectedOpportunityId);
    if (!opp) {
      // Show placeholder
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '400 15px Inter';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Paste a blog URL or article text, then click Analyze →', width / 2, height / 2);
      return;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderInternalImage(ctx, opp, state.brandId, width, height, state.layoutSeed);
  }, [
    state.imageMode, state.brandId, state.soiSize, state.selectedOpportunityId,
    state.imageOpportunities, state.fontsReady, state.layoutSeed, canvasRef,
  ]);
}
