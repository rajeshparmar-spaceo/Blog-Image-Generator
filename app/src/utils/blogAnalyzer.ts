import type { ImageOpportunity, VisualType } from '../types';

// ── URL fetch — tries multiple CORS proxies in sequence ──────────────────────
const PROXIES = [
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
];

async function tryFetch(proxyUrl: string, timeoutMs: number): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const text = await res.text();
    return text.length > 500 ? text : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export async function fetchBlogContent(
  url: string,
): Promise<{ text: string | null; error?: string }> {
  for (const buildProxy of PROXIES) {
    const raw = await tryFetch(buildProxy(url), 15000);
    if (raw) return { text: parseHtmlToStructured(raw) };
  }
  return {
    text: null,
    error: 'Could not load the URL (all proxies failed or timed out). Please paste the article text in the box below instead.',
  };
}

// ── HTML → structured text preserving heading hierarchy ───────────────────────
// H2 → "## Title"  H3 → "### Title"  li → "• item"
export function parseHtmlToStructured(html: string): string {
  let t = html;

  // Strip noise blocks entirely
  t = t.replace(/<script[\s\S]*?<\/script>/gi, '');
  t = t.replace(/<style[\s\S]*?<\/style>/gi, '');
  t = t.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  t = t.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  t = t.replace(/<header[\s\S]*?<\/header>/gi, '');

  // Preserve H2 / H3 as markdown-style markers
  t = t.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) =>
    `\n## ${clean(inner)}\n`);
  t = t.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, inner) =>
    `\n### ${clean(inner)}\n`);

  // List items → bullet prefix
  t = t.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) =>
    `\n• ${clean(inner)}`);

  // Numbered ordered list items (ol > li already handled above, but add ordinal if missing)
  // Block-level tags → blank line
  t = t.replace(/<\/?(p|div|section|article|blockquote|br|tr|td|th)[^>]*>/gi, '\n');

  // Strip all remaining tags
  t = t.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  t = t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
       .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
       .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&#\d+;/g, '');

  return t.replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();
}

function clean(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// ── Section structure ─────────────────────────────────────────────────────────
interface Section {
  title: string;
  body: string;
  level: 2 | 3;
}

function splitByHeadings(content: string): Section[] {
  // Match ## or ### markers left by parseHtmlToStructured
  const pattern = /\n(#{2,3})\s+([^\n]+)/g;
  const matches = [...content.matchAll(pattern)];

  if (matches.length < 1) return [];

  return matches.map((m, i) => {
    const level = m[1].length as 2 | 3;
    const title = m[2].trim();
    const start = m.index! + m[0].length;
    const end = matches[i + 1]?.index ?? content.length;
    const body = content.slice(start, end).trim();
    return { title, body, level };
  }).filter(s => s.body.length > 30);
}

// ── Section analysis — title-first, content as detail ────────────────────────
interface SectionAnalysis {
  score: number;
  visualType: VisualType;
  points: string[];
  numbers: string[];
}

// Sections that never need images
const SKIP_TITLES = [
  'introduction', 'overview', 'conclusion', 'summary', 'final thoughts',
  'about', 'contact', 'faq', 'related', 'tags', 'share', 'subscribe',
  'table of contents', 'toc', 'wrapping up', 'closing thoughts',
];

function analyzeSection(title: string, body: string): SectionAnalysis {
  const lt = title.toLowerCase().trim();  // lower title
  const lb = body.toLowerCase();

  // Always skip noise sections
  if (SKIP_TITLES.some(s => lt.includes(s))) {
    return { score: 0, visualType: 'concept', points: [], numbers: [] };
  }

  // Extract list items from body (both • bullets and numbered)
  const rawBullets  = body.match(/^[•\-\*]\s+(.+)$/gm) ?? [];
  const rawNumbered = body.match(/^\d+[.)]\s+(.+)$/gm) ?? [];
  const bulletTexts  = rawBullets.map(b => b.replace(/^[•\-\*]\s+/, '').trim()).filter(s => s.length > 3 && s.length < 80);
  const numberedTexts = rawNumbered.map(n => n.replace(/^\d+[.)]\s+/, '').trim()).filter(s => s.length > 3 && s.length < 80);
  const bestList = numberedTexts.length >= bulletTexts.length ? numberedTexts : bulletTexts;
  const nums = [...new Set(body.match(/\d+(?:\.\d+)?[%×xX]?/g) ?? [])].slice(0, 6);

  // ── 1. TITLE-FIRST detection ────────────────────────────────────────────────
  // How-to / Steps — title says it all
  if (/\bhow[\s-]to\b|^steps?\b|step[\s-]by|guide\b|tutorial\b|walkthrough|set[\s-]?up|install|getting[\s-]started|beginner|quick[\s-]start/i.test(lt)) {
    return { score: 9, visualType: 'steps', points: bestList.slice(0, 6), numbers: nums };
  }

  // Features / Benefits / Reasons / Tips (most common in blog posts)
  if (/\bfeature[s]?\b|\bbenefit[s]?\b|\breason[s]?\b|\badvantage[s]?\b|\btip[s]?\b|\bway[s]?\b|\bpro[s]?\b|top\s+\d|\d+\s+(way|tip|reason|feature|benefit|thing|example)|\bwhy\s+use\b|\bwhy\s+you\b|\bwhy\s+\w/i.test(lt)) {
    return { score: 9, visualType: 'benefits', points: bestList.slice(0, 6), numbers: nums };
  }

  // Comparison / vs / pros and cons
  if (/\bvs\.?\b|\bversus\b|\bcompar|\bpros\b.*\bcons\b|\bdifference|\balternative|\bbetter than|\bpick between/i.test(lt)) {
    return { score: 9, visualType: 'comparison', points: [], numbers: nums };
  }

  // Pricing / Plans / Cost
  if (/\bpric(e|ing)\b|\bplan[s]?\b|\bcost[s]?\b|\btier[s]?\b|\bsubscription|\bbilling/i.test(lt)) {
    return { score: 8, visualType: 'comparison', points: [], numbers: nums };
  }

  // Stats / Results / Data / ROI
  if (/\bstat(istic)?[s]?\b|\bresult[s]?\b|\bdata\b|\bmetric[s]?\b|\bperformance|\broi\b|\bgrowth\b|\bnumber[s]?\b|\bfigure[s]?\b/i.test(lt)) {
    return { score: 8, visualType: 'metrics', points: [], numbers: nums };
  }

  // Process / Workflow (only explicit in title)
  if (/\bprocess\b|\bworkflow\b|\bpipeline\b|\bhow it works\b|\bautomation\b/i.test(lt)) {
    return { score: 8, visualType: 'process', points: bestList.slice(0, 6), numbers: nums };
  }

  // Review / Rating / Verdict / Score
  if (/\breview\b|\brating\b|\bverdict\b|\bscore\b|\bassessment\b|\bhonest\b|\bworth it\b/i.test(lt)) {
    return { score: 8, visualType: 'review', points: [], numbers: nums };
  }

  // ── 2. CONTENT fallback — if title didn't match, look at body ──────────────
  // Numbered list (3+ items = clear step/list structure)
  if (numberedTexts.length >= 3) {
    return { score: 7, visualType: 'steps', points: numberedTexts.slice(0, 6), numbers: nums };
  }
  // Bullet list (3+ items = benefits/features)
  if (bulletTexts.length >= 3) {
    return { score: 7, visualType: 'benefits', points: bulletTexts.slice(0, 6), numbers: nums };
  }
  // Stats-heavy body
  if (nums.length >= 4 && /\d+%/.test(body)) {
    return { score: 6, visualType: 'metrics', points: [], numbers: nums };
  }
  // Comparison language in body
  if (/\bvs\.?\b|\bversus\b|\bpros\b|\bcons\b/.test(lb) && body.length > 150) {
    return { score: 6, visualType: 'comparison', points: [], numbers: nums };
  }

  // Concept keywords in title ("what is", "understanding", "overview", "introduction to", etc.)
  if (/\bwhat\s+(is|are)\b|\bunderstand|\boverview\b|\bintroduction\b|\bexplain|\blearn\b|\bguide to\b|\bwhen to\b|\bwhere to\b|\bwhich\b/i.test(lt)) {
    const sentences = body.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 15 && s.length < 90);
    return { score: 6, visualType: 'concept', points: sentences.slice(0, 6), numbers: nums };
  }

  // Any body with 2+ list items is worth showing even if title didn't match
  if (bestList.length >= 2) {
    const vtype: VisualType = numberedTexts.length >= bulletTexts.length ? 'steps' : 'benefits';
    return { score: 5, visualType: vtype, points: bestList.slice(0, 6), numbers: nums };
  }

  // Plain prose — no image
  return { score: 0, visualType: 'concept', points: [], numbers: [] };
}

const REASON: Record<string, string> = {
  steps:      'Step-by-step guide',
  comparison: 'Side-by-side comparison',
  metrics:    'Key statistics & numbers',
  benefits:   'Features & benefits',
  process:    'Workflow / process diagram',
  review:     'Rating & review summary',
  concept:    'Conceptual illustration',
};

// ── Main export ───────────────────────────────────────────────────────────────
export function detectImageOpportunities(content: string): ImageOpportunity[] {
  // First try heading-based split (proper structure)
  let sections = splitByHeadings(content);

  // If no headings found, try to detect from plain text (numbered sections, etc.)
  if (sections.length === 0) {
    sections = splitFromPlainText(content);
  }

  const opportunities: ImageOpportunity[] = [];

  for (let i = 0; i < sections.length && opportunities.length < 5; i++) {
    const { title, body } = sections[i];
    const analysis = analyzeSection(title, body);

    // Only create an image if score is high enough (real visual content exists)
    if (analysis.score < 6) continue;

    opportunities.push({
      id: `opp-${i}`,
      index: opportunities.length + 1,
      sectionTitle: title.length > 65 ? title.slice(0, 63) + '…' : title,
      sectionBody: body.slice(0, 300),
      visualType: analysis.visualType,
      reason: REASON[analysis.visualType] ?? 'Visual illustration',
      points: analysis.points,
      numbers: analysis.numbers,
    });
  }

  // ── Last resort: analyze whole document as one block ─────────────────────────
  if (opportunities.length === 0 && content.trim().length > 80) {
    const opp = analyzeWholeDocument(content);
    if (opp) opportunities.push(opp);
  }

  return opportunities;
}

// ── Whole-document analysis fallback ─────────────────────────────────────────
function analyzeWholeDocument(content: string): ImageOpportunity | null {
  const firstLine = content.split('\n').map(l => l.trim()).find(l => l.length > 5) ?? 'Key Points';
  const body = content;

  const rawBullets  = body.match(/^[•\-\*]\s+(.+)$/gm) ?? [];
  const rawNumbered = body.match(/^\d+[.)]\s+(.+)$/gm) ?? [];
  const bulletTexts  = rawBullets.map(b => b.replace(/^[•\-\*]\s+/, '').trim()).filter(s => s.length > 3 && s.length < 80);
  const numberedTexts = rawNumbered.map(n => n.replace(/^\d+[.)]\s+/, '').trim()).filter(s => s.length > 3 && s.length < 80);
  const nums = [...new Set(body.match(/\d+(?:\.\d+)?[%×xX]?/g) ?? [])].slice(0, 6);

  // Prefer explicit lists
  if (numberedTexts.length >= 2 || bulletTexts.length >= 2) {
    const isNumbered = numberedTexts.length >= bulletTexts.length;
    const points = (isNumbered ? numberedTexts : bulletTexts).slice(0, 6);
    const vtype: VisualType = isNumbered ? 'steps' : 'benefits';
    return {
      id: 'opp-0', index: 1,
      sectionTitle: firstLine.length > 65 ? firstLine.slice(0, 63) + '…' : firstLine,
      sectionBody: body.slice(0, 300),
      visualType: vtype,
      reason: REASON[vtype],
      points, numbers: nums,
    };
  }

  // Fall back to sentence extraction — any non-trivial content gets a concept illustration
  const sentences = body.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 15 && s.length < 90);
  if (sentences.length < 2) return null;

  return {
    id: 'opp-0', index: 1,
    sectionTitle: firstLine.length > 65 ? firstLine.slice(0, 63) + '…' : firstLine,
    sectionBody: body.slice(0, 300),
    visualType: 'concept',
    reason: REASON['concept'],
    points: sentences.slice(0, 6),
    numbers: nums,
  };
}

// ── Plain-text fallback splitter ──────────────────────────────────────────────
function splitFromPlainText(content: string): Section[] {
  // A line is a heading only when preceded by a blank line (or is the first non-empty line).
  // This prevents regular sentence fragments from being treated as section titles.
  const lines = content.split('\n');
  const sections: Section[] = [];
  let currentTitle = '';
  let bodyLines: string[] = [];
  let prevWasBlank = true; // treat document start as after a blank line

  const isHeading = (t: string, afterBlank: boolean): boolean =>
    afterBlank &&
    t.length > 5 && t.length <= 70 &&
    !t.endsWith('.') && !t.endsWith(',') && !t.endsWith('?') &&
    !t.startsWith('•') && !t.startsWith('-') &&
    !/^\d+[.)]\s/.test(t);   // numbered list items are body, not headings

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      prevWasBlank = true;
      if (currentTitle) bodyLines.push(''); // preserve blank lines within body
      continue;
    }

    if (isHeading(line, prevWasBlank)) {
      if (currentTitle && bodyLines.join('').trim().length > 30) {
        sections.push({ title: currentTitle, body: bodyLines.join('\n').trim(), level: 2 });
      }
      currentTitle = line;
      bodyLines = [];
    } else {
      bodyLines.push(line);
    }
    prevWasBlank = false;
  }

  // Last section
  if (currentTitle && bodyLines.join('').trim().length > 30) {
    sections.push({ title: currentTitle, body: bodyLines.join('\n').trim(), level: 2 });
  }

  return sections.filter(s => s.body.length > 40);
}
