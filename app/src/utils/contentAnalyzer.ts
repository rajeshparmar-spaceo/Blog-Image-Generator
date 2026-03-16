import type { VisualType } from '../types';
export type { VisualType };

export interface ContentProfile {
  visualType: VisualType;
  points: string[];   // up to 5 key labels extracted from source
  numbers: string[];  // up to 6 numbers/percentages found in source
}

// ── keyword tables ──────────────────────────────────────────────────────────
const STEP_WORDS = [
  'how to', 'step', 'guide', 'tutorial', 'setup', 'install',
  'configure', 'create', 'build', 'get started', 'beginner', 'walkthrough',
  'checklist', 'tips', 'do\'s', 'ways to',
];
const COMPARISON_WORDS = [
  ' vs ', 'versus', 'compare', 'comparison', 'difference', 'better',
  'alternative', 'which is', 'or ', 'vs.', 'head-to-head', 'pick',
];
const METRIC_WORDS = [
  '%', 'percent', 'increase', 'decrease', 'stats', 'roi', 'performance',
  'benchmark', 'results', 'growth', 'faster', 'save', 'reduce', 'improve',
  'boost', 'times', 'x faster', '×', 'revenue', 'cost',
];
const BENEFIT_WORDS = [
  'benefit', 'advantage', 'feature', 'why use', 'why you', 'reason',
  'value', 'pros', 'top reasons', 'what you get', 'key benefits',
];
const PROCESS_WORDS = [
  'workflow', 'pipeline', 'automate', 'automation', 'integrate', 'integration',
  'connect', 'flow', 'system', 'process', 'trigger', 'action', 'zapier',
  'if-then', 'conditional',
];
const REVIEW_WORDS = [
  'review', 'honest', 'rating', 'verdict', 'worth', 'opinion',
  'analysis', 'score', 'assessment', 'pros and cons', 'is it good',
];

// ── main export ─────────────────────────────────────────────────────────────
export function analyzeContent(
  headline: string,
  subtitle: string,
  source: string,
): ContentProfile {
  const text = `${headline} ${subtitle} ${source}`.toLowerCase();

  const scores: Record<VisualType, number> = {
    steps: 0, comparison: 0, metrics: 0,
    benefits: 0, process: 0, review: 0, concept: 0,
  };

  STEP_WORDS.forEach(w => { if (text.includes(w)) scores.steps += 2; });
  COMPARISON_WORDS.forEach(w => { if (text.includes(w)) scores.comparison += 2; });
  METRIC_WORDS.forEach(w => { if (text.includes(w)) scores.metrics += 2; });
  BENEFIT_WORDS.forEach(w => { if (text.includes(w)) scores.benefits += 2; });
  PROCESS_WORDS.forEach(w => { if (text.includes(w)) scores.process += 2; });
  REVIEW_WORDS.forEach(w => { if (text.includes(w)) scores.review += 2; });

  // Numerical density boosts metrics
  const numMatches = source.match(/\d+(?:\.\d+)?[%xX×]?/g) || [];
  if (numMatches.length >= 3) scores.metrics += 4;

  let best: VisualType = 'concept';
  let bestScore = 0;
  for (const [type, score] of Object.entries(scores) as [VisualType, number][]) {
    if (score > bestScore) { bestScore = score; best = type; }
  }

  return {
    visualType: best,
    points: extractPoints(source),
    numbers: extractNumbers(source),
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────
function extractPoints(source: string): string[] {
  if (!source.trim()) return [];

  const numbered = source.match(/(?:^|\n)\s*\d+[.)]\s*([^\n]{5,55})/g);
  if (numbered && numbered.length >= 2)
    return numbered.slice(0, 6).map(s => s.replace(/^\s*\d+[.)]\s*/, '').trim());

  const bullets = source.match(/(?:^|\n)\s*[-•*]\s*([^\n]{5,55})/g);
  if (bullets && bullets.length >= 2)
    return bullets.slice(0, 6).map(s => s.replace(/^\s*[-•*]\s*/, '').trim());

  const sentences = source
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 70);
  return sentences.slice(0, 6);
}

function extractNumbers(source: string): string[] {
  const matches = source.match(/\d+(?:\.\d+)?[%×xX]?/g) || [];
  return [...new Set(matches)].slice(0, 6);
}
