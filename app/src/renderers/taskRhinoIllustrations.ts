/**
 * Vector illustration engine for TaskRhino right-side panel.
 * Brand color updated to match taskrhino.ca: #6c6cff
 * Style: clean SaaS professional, light lavender, bold abstract shapes.
 */

const P   = '#6c6cff'; // brand primary (matches taskrhino.ca)
const PL  = '#9b9bff'; // light brand
const PP  = '#EBEBFF'; // pale brand bg (matches site #EBEBFF)
const PD  = '#4a4adb'; // dark brand
const PDL = '#C3C2FF'; // border lavender (matches site)
const WHITE = '#FFFFFF';
const DARK  = '#222222'; // site text color
const GRAY  = '#6B7280';
const ACC   = '#F59E0B'; // amber accent
const GRN   = '#10B981'; // green
const RED   = '#EF4444'; // red

// ─── Topic detection ──────────────────────────────────────────────────────────

type IllustrationKey =
  | 'review'      | 'pricing'    | 'conditional' | 'warning'
  | 'automation'  | 'analytics'  | 'productivity'| 'team'
  | 'growth'      | 'time'       | 'goals'        | 'code'
  | 'remote'      | 'security'   | 'chat'         | 'planning'
  | 'comparison'  | 'integration'| 'rocket'       | 'default';

const TOPIC_KEYWORDS: Array<{ key: IllustrationKey; words: string[] }> = [
  // Blog-specific topics (checked first — higher priority)
  { key: 'review',      words: ['review','honest','analysis','rating','verdict','pros','cons','worth','best','top','vs','compare'] },
  { key: 'pricing',     words: ['pricing','price','plan','cost','tier','subscription','free','paid','billing','cheap','expensive'] },
  { key: 'conditional', words: ['if-then','if then','conditional','condition','logic','branch','else','switch','decision','rule','operator'] },
  { key: 'warning',     words: ['warning','caution','danger','risk','duplicate','prevent','block','limit','no dry','without','issue','problem','bug','fail','error'] },
  { key: 'comparison',  words: ['comparison','vs','versus','alternative','replace','similar','better','differ','switch from'] },
  { key: 'integration', words: ['integrat','connect','api','webhook','sync','import','export','zap','plugin','app'] },
  // General task management topics
  { key: 'automation',  words: ['automat','workflow','trigger','action','bot','no-code','pipeline','sandbox','dry-run','dry run'] },
  { key: 'analytics',   words: ['analytic','data','metric','report','insight','dashboard','chart','visuali','track','kpi'] },
  { key: 'team',        words: ['team','collaborat','people','member','hire','onboard','culture','together','assign'] },
  { key: 'growth',      words: ['growth','scale','expand','boost','increase','sales','market','revenue','launch'] },
  { key: 'time',        words: ['time','deadline','schedule','speed','fast','hour','daily','routine','habit'] },
  { key: 'goals',       words: ['goal','target','objective','milestone','achieve','success','win','result','okr'] },
  { key: 'code',        words: ['code','develop','software','program','engineer','api','deploy','debug','git'] },
  { key: 'remote',      words: ['remote','hybrid','distribut','global','timezone','async','work from'] },
  { key: 'security',    words: ['secur','safe','protect','privac','compliance','trust','encrypt','auth'] },
  { key: 'chat',        words: ['communicat','message','chat','notify','feedback','update','discuss'] },
  { key: 'planning',    words: ['plan','roadmap','strateg','sprint','agile','scrum','kanban','priorit','backlog'] },
  { key: 'rocket',      words: ['launch','startup','ship','release','mvp','go-live','product'] },
  { key: 'productivity',words: ['productiv','efficient','focus','output','perform','work','task','done','complete'] },
];

export function detectIllustration(headline: string, subtitle: string, sourceContent = ''): IllustrationKey {
  const text = `${headline} ${subtitle} ${sourceContent}`.toLowerCase();
  for (const { key, words } of TOPIC_KEYWORDS) {
    if (words.some((w) => text.includes(w))) return key;
  }
  return 'default';
}

// ─── Main draw dispatcher ─────────────────────────────────────────────────────

export function drawIllustration(
  ctx: CanvasRenderingContext2D,
  key: IllustrationKey,
  cx: number,
  cy: number,
  size: number,
): void {
  switch (key) {
    case 'review':      drawReview(ctx, cx, cy, size);      break;
    case 'pricing':     drawPricing(ctx, cx, cy, size);     break;
    case 'conditional': drawConditional(ctx, cx, cy, size); break;
    case 'warning':     drawWarning(ctx, cx, cy, size);     break;
    case 'comparison':  drawComparison(ctx, cx, cy, size);  break;
    case 'integration': drawIntegration(ctx, cx, cy, size); break;
    case 'automation':  drawAutomation(ctx, cx, cy, size);  break;
    case 'analytics':   drawAnalytics(ctx, cx, cy, size);   break;
    case 'productivity':drawProductivity(ctx, cx, cy, size);break;
    case 'team':        drawTeam(ctx, cx, cy, size);        break;
    case 'growth':      drawGrowth(ctx, cx, cy, size);      break;
    case 'time':        drawTime(ctx, cx, cy, size);        break;
    case 'goals':       drawGoals(ctx, cx, cy, size);       break;
    case 'code':        drawCode(ctx, cx, cy, size);        break;
    case 'remote':      drawRemote(ctx, cx, cy, size);      break;
    case 'security':    drawSecurity(ctx, cx, cy, size);    break;
    case 'chat':        drawChat(ctx, cx, cy, size);        break;
    case 'planning':    drawPlanning(ctx, cx, cy, size);    break;
    case 'rocket':      drawRocket(ctx, cx, cy, size);      break;
    default:            drawDefault(ctx, cx, cy, size);     break;
  }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function card(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 12, fill = WHITE) {
  ctx.save();
  ctx.shadowColor = 'rgba(108,108,255,0.13)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.strokeStyle = PDL;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function check(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, bg: string) {
  dot(ctx, cx, cy, r, bg);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.35, cy);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.32);
  ctx.lineTo(cx + r * 0.42, cy - r * 0.32);
  ctx.stroke();
}

function cross(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, bg: string) {
  dot(ctx, cx, cy, r, bg);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.35, cy - r * 0.35);
  ctx.lineTo(cx + r * 0.35, cy + r * 0.35);
  ctx.moveTo(cx + r * 0.35, cy - r * 0.35);
  ctx.lineTo(cx - r * 0.35, cy + r * 0.35);
  ctx.stroke();
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerA = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const innerA = outerA + Math.PI / 5;
    const ox = cx + Math.cos(outerA) * r;
    const oy = cy + Math.sin(outerA) * r;
    const ix = cx + Math.cos(innerA) * r * 0.4;
    const iy = cy + Math.sin(innerA) * r * 0.4;
    i === 0 ? ctx.moveTo(ox, oy) : ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, curved = false) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (curved) {
    const mx = (x1 + x2) / 2;
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, y1, x2, y2);
  } else {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
  // Arrowhead
  const angle = curved
    ? Math.atan2(y2 - y1, x2 - (x1 + x2) / 2)
    : Math.atan2(y2 - y1, x2 - x1);
  const al = 9;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - al * Math.cos(angle - 0.4), y2 - al * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - al * Math.cos(angle + 0.4), y2 - al * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
}

// ─── Blog-specific illustrations ──────────────────────────────────────────────

/** Review: star ratings + score card (e.g. ClickUp Review 2026) */
function drawReview(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;

  // Main score card
  const cw = 220 * u; const ch = 170 * u;
  card(ctx, cx - cw / 2 - 30 * u, cy - ch / 2 - 20 * u, cw, ch, 16);

  // Score circle
  const scx = cx - 30 * u; const scy = cy - 20 * u;
  const sr = 52 * u;
  // Ring track
  ctx.beginPath();
  ctx.arc(scx, scy, sr, 0, Math.PI * 2);
  ctx.strokeStyle = PP;
  ctx.lineWidth = 8 * u;
  ctx.stroke();
  // Ring fill ~82%
  ctx.beginPath();
  ctx.arc(scx, scy, sr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.82);
  ctx.strokeStyle = P;
  ctx.lineWidth = 8 * u;
  ctx.lineCap = 'round';
  ctx.stroke();
  // Score text
  ctx.font = `800 ${26 * u}px Inter`;
  ctx.fillStyle = DARK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('8.2', scx, scy - 4 * u);
  ctx.font = `400 ${10 * u}px Inter`;
  ctx.fillStyle = GRAY;
  ctx.fillText('out of 10', scx, scy + 14 * u);

  // Stars row
  const starY = cy - 20 * u + sr + 18 * u;
  [0,1,2,3,4].forEach((i) => {
    star(ctx, scx - 40 * u + i * 20 * u, starY, 7 * u, i < 4 ? ACC : PDL);
  });
  ctx.font = `500 ${9 * u}px Inter`;
  ctx.fillStyle = GRAY;
  ctx.textAlign = 'center';
  ctx.fillText('4.1 / 5 stars', scx, starY + 16 * u);

  // Feature score rows (right side mini card)
  const feats = [
    { label: 'Ease of Use',  score: 0.88 },
    { label: 'Features',     score: 0.78 },
    { label: 'Value',        score: 0.72 },
    { label: 'Support',      score: 0.85 },
  ];
  const fx = cx + 90 * u;
  const fy = cy - 100 * u;
  card(ctx, fx, fy, 170 * u, 180 * u, 12);
  ctx.font = `600 ${10 * u}px Inter`;
  ctx.fillStyle = DARK;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Category Scores', fx + 14 * u, fy + 12 * u);

  feats.forEach(({ label, score }, i) => {
    const ly = fy + 34 * u + i * 36 * u;
    ctx.font = `400 ${10 * u}px Inter`;
    ctx.fillStyle = GRAY;
    ctx.fillText(label, fx + 14 * u, ly);
    // Bar track
    const bx = fx + 14 * u; const bw = 142 * u; const bh = 6 * u;
    ctx.beginPath(); ctx.roundRect(bx, ly + 14 * u, bw, bh, 3); ctx.fillStyle = PP; ctx.fill();
    ctx.beginPath(); ctx.roundRect(bx, ly + 14 * u, bw * score, bh, 3);
    ctx.fillStyle = score > 0.8 ? GRN : score > 0.7 ? P : ACC;
    ctx.fill();
    ctx.font = `600 ${9 * u}px Inter`;
    ctx.fillStyle = DARK;
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(score * 10)}/10`, fx + 14 * u + bw, ly);
    ctx.textAlign = 'left';
  });
}

/** Pricing: three-tier pricing table */
function drawPricing(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const tiers = [
    { name: 'Free',    price: '$0',   color: GRAY, features: 3, popular: false },
    { name: 'Pro',     price: '$12',  color: P,    features: 7, popular: true  },
    { name: 'Enterprise', price: '$29', color: PD, features: 10, popular: false },
  ];
  const tw = 105 * u; const th = 200 * u;
  const gap = 14 * u;
  const totalW = tiers.length * tw + (tiers.length - 1) * gap;
  const startX = cx - totalW / 2;

  tiers.forEach(({ name, price, color, features, popular }, i) => {
    const tx = startX + i * (tw + gap);
    const ty = popular ? cy - th / 2 - 14 * u : cy - th / 2;
    const h2 = popular ? th + 28 * u : th;

    // "Most Popular" badge above
    if (popular) {
      pill(ctx, tx, ty - 22 * u, tw, 18 * u, P);
      ctx.font = `600 ${8 * u}px Inter`;
      ctx.fillStyle = WHITE;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MOST POPULAR', tx + tw / 2, ty - 13 * u);
    }

    card(ctx, tx, ty, tw, h2, 14, popular ? PP : WHITE);
    if (popular) {
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, h2, 14);
      ctx.strokeStyle = P; ctx.lineWidth = 2; ctx.stroke();
    }

    // Plan name
    ctx.font = `700 ${13 * u}px Inter`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(name, tx + tw / 2, ty + 14 * u);

    // Price
    ctx.font = `800 ${24 * u}px Inter`;
    ctx.fillStyle = DARK;
    ctx.fillText(price, tx + tw / 2, ty + 32 * u);
    ctx.font = `400 ${9 * u}px Inter`;
    ctx.fillStyle = GRAY;
    ctx.fillText('/mo per user', tx + tw / 2, ty + 60 * u);

    // Divider
    ctx.beginPath(); ctx.moveTo(tx + 10 * u, ty + 76 * u); ctx.lineTo(tx + tw - 10 * u, ty + 76 * u);
    ctx.strokeStyle = PDL; ctx.lineWidth = 1; ctx.stroke();

    // Feature check list
    for (let f = 0; f < features && f < 6; f++) {
      check(ctx, tx + 20 * u, ty + 92 * u + f * 18 * u, 6 * u, f < 3 ? GRN : P);
    }
    // Remaining as grey dots
    for (let f = features; f < 6; f++) {
      dot(ctx, tx + 20 * u, ty + 92 * u + f * 18 * u, 4 * u, PDL);
    }
  });
}

/** Conditional / If-Then logic: decision tree flowchart */
function drawConditional(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;

  // Root node
  const rootX = cx - 80 * u; const rootY = cy - 100 * u;
  const nw = 120 * u; const nh = 40 * u;

  function node(x: number, y: number, label: string, color: string, shape: 'rect' | 'diamond' = 'rect') {
    ctx.save();
    ctx.shadowColor = color + '33';
    ctx.shadowBlur = 12;
    if (shape === 'diamond') {
      const hw = nw / 2; const hh = nh / 2 * 1.2;
      ctx.beginPath();
      ctx.moveTo(x + hw, y);
      ctx.lineTo(x + nw, y + hh);
      ctx.lineTo(x + hw, y + hh * 2);
      ctx.lineTo(x, y + hh);
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.roundRect(x, y, nw, nh, 8);
    }
    ctx.fillStyle = color === P ? PP : WHITE;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.font = `600 ${10 * u}px Inter`;
    ctx.fillStyle = DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const midY = shape === 'diamond' ? y + nh * 0.6 : y + nh / 2;
    ctx.fillText(label, x + nw / 2, midY);
  }

  // Trigger box
  node(rootX, rootY, 'Item Created', P, 'rect');

  // Diamond condition
  const diamondY = rootY + 65 * u;
  node(rootX, diamondY, 'Status = Done?', P, 'diamond');
  arrow(ctx, rootX + nw / 2, rootY + nh, rootX + nw / 2, diamondY, PDL);

  // Yes branch → right
  const yesX = rootX + 155 * u; const yesY = diamondY + 25 * u;
  node(yesX, yesY, '✓ Notify Team', GRN, 'rect');
  arrow(ctx, rootX + nw, diamondY + nh * 0.6, yesX, yesY + nh / 2, GRN, true);
  ctx.font = `600 ${9 * u}px Inter`; ctx.fillStyle = GRN;
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText('YES', rootX + nw + 40 * u, diamondY + nh * 0.3);

  // No branch → down
  const noX = rootX; const noY = diamondY + 95 * u;
  node(noX, noY, '✗ Skip Action', RED, 'rect');
  arrow(ctx, rootX + nw / 2, diamondY + nh * 1.2, noX + nw / 2, noY, RED);
  ctx.font = `600 ${9 * u}px Inter`; ctx.fillStyle = RED;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('NO', rootX + nw / 2 + 6 * u, diamondY + nh * 1.2 + 14 * u);

  // Else branch from yes node
  const elseX = yesX; const elseY = yesY + 65 * u;
  node(elseX, elseY, 'Log to Board', ACC, 'rect');
  arrow(ctx, yesX + nw / 2, yesY + nh, elseX + nw / 2, elseY, ACC);

  // Result badge
  card(ctx, cx + 60 * u, cy + 80 * u, 130 * u, 44 * u, 10);
  ctx.font = `500 ${9 * u}px Inter`;
  ctx.fillStyle = GRAY; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('7 Operators Available', cx + 125 * u, cy + 88 * u);
  ctx.font = `700 ${14 * u}px Inter`; ctx.fillStyle = P;
  ctx.fillText('Compound AND Logic', cx + 125 * u, cy + 100 * u);
}

/** Warning: bold alert illustration (e.g. "No Dry-Run Mode") */
function drawWarning(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;

  // Big warning triangle
  const tr = 110 * u;
  ctx.save();
  ctx.shadowColor = '#F59E0B44';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(cx, cy - tr);
  ctx.lineTo(cx + tr * 0.9, cy + tr * 0.5);
  ctx.lineTo(cx - tr * 0.9, cy + tr * 0.5);
  ctx.closePath();
  // Gradient fill
  const warnGrad = ctx.createLinearGradient(cx, cy - tr, cx, cy + tr * 0.5);
  warnGrad.addColorStop(0, '#FEF3C7');
  warnGrad.addColorStop(1, '#FDE68A');
  ctx.fillStyle = warnGrad;
  ctx.fill();
  ctx.strokeStyle = ACC;
  ctx.lineWidth = 4 * u;
  ctx.stroke();
  ctx.restore();

  // Inner triangle border
  const ir = 88 * u;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ir + 10 * u);
  ctx.lineTo(cx + ir * 0.76, cy + ir * 0.42);
  ctx.lineTo(cx - ir * 0.76, cy + ir * 0.42);
  ctx.closePath();
  ctx.strokeStyle = ACC + '55';
  ctx.lineWidth = 1.5 * u;
  ctx.stroke();

  // Exclamation mark
  ctx.fillStyle = ACC;
  ctx.font = `900 ${60 * u}px Inter`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', cx, cy + 10 * u);

  // Warning badge
  card(ctx, cx + tr * 0.7, cy - tr * 0.7, 130 * u, 52 * u, 10);
  ctx.font = `700 ${13 * u}px Inter`;
  ctx.fillStyle = RED;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('⚠ Risk Found', cx + tr * 0.7 + 12 * u, cy - tr * 0.7 + 10 * u);
  ctx.font = `400 ${9 * u}px Inter`;
  ctx.fillStyle = GRAY;
  ctx.fillText('Automation may trigger', cx + tr * 0.7 + 12 * u, cy - tr * 0.7 + 28 * u);
  ctx.fillText('unintended duplicates', cx + tr * 0.7 + 12 * u, cy - tr * 0.7 + 40 * u);

  // Floating small warning dots
  [[cx - tr, cy - tr * 0.5], [cx + tr * 0.4, cy + tr * 0.8]].forEach(([dx, dy]) => {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(dx, dy - 16 * u);
    ctx.lineTo(dx + 14 * u, dy + 8 * u);
    ctx.lineTo(dx - 14 * u, dy + 8 * u);
    ctx.closePath();
    ctx.fillStyle = '#FDE68A';
    ctx.fill();
    ctx.strokeStyle = ACC;
    ctx.lineWidth = 1.5 * u;
    ctx.stroke();
    ctx.restore();
  });
}

/** Comparison: side-by-side A vs B */
function drawComparison(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const cw = 130 * u; const ch = 200 * u;
  const gap = 50 * u;

  ['A', 'B'].forEach((_label, side) => {
    const tx = side === 0 ? cx - cw - gap / 2 : cx + gap / 2;
    const ty = cy - ch / 2;
    const isLeft = side === 0;

    card(ctx, tx, ty, cw, ch, 14, isLeft ? PP : WHITE);
    if (isLeft) {
      ctx.beginPath(); ctx.roundRect(tx, ty, cw, ch, 14);
      ctx.strokeStyle = P; ctx.lineWidth = 2; ctx.stroke();
    }

    // Brand tag
    ctx.font = `700 ${14 * u}px Inter`;
    ctx.fillStyle = isLeft ? P : GRAY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(isLeft ? 'Option A' : 'Option B', tx + cw / 2, ty + 14 * u);

    // Feature rows
    const feats = isLeft
      ? [true, true, true, false, true, false]
      : [true, false, true, true, false, false];
    feats.forEach((has, fi) => {
      const fy = ty + 46 * u + fi * 24 * u;
      if (has) check(ctx, tx + 22 * u, fy, 7 * u, isLeft ? P : GRAY);
      else cross(ctx, tx + 22 * u, fy, 7 * u, RED + 'aa');
      ctx.beginPath();
      ctx.roundRect(tx + 36 * u, fy - 4 * u, (cw - 48 * u) * (0.5 + Math.random() * 0.4), 8 * u, 2);
      ctx.fillStyle = has ? (isLeft ? PL + '44' : PDL) : PDL;
      ctx.fill();
    });

    // Score
    ctx.font = `800 ${20 * u}px Inter`;
    ctx.fillStyle = isLeft ? P : GRAY;
    ctx.fillText(isLeft ? '8.4' : '7.1', tx + cw / 2, ty + ch - 34 * u);
    ctx.font = `400 ${8 * u}px Inter`;
    ctx.fillStyle = GRAY;
    ctx.fillText('Overall Score', tx + cw / 2, ty + ch - 14 * u);
  });

  // VS badge center
  dot(ctx, cx, cy, 18 * u, WHITE);
  ctx.beginPath(); ctx.arc(cx, cy, 18 * u, 0, Math.PI * 2);
  ctx.strokeStyle = PDL; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = `800 ${12 * u}px Inter`;
  ctx.fillStyle = P;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', cx, cy);
}

/** Integration: connected app nodes */
function drawIntegration(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;

  // Center hub (TaskRhino)
  ctx.save();
  ctx.shadowColor = P + '44';
  ctx.shadowBlur = 28;
  dot(ctx, cx, cy, 45 * u, P);
  ctx.restore();
  ctx.font = `700 ${13 * u}px Inter`;
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TR', cx, cy);

  // Surrounding apps
  const apps = [
    { angle: -90,  r: 110 * u, label: 'Slack',    color: '#611f69' },
    { angle: -30,  r: 110 * u, label: 'Gmail',    color: '#EA4335' },
    { angle: 30,   r: 110 * u, label: 'Zapier',   color: '#FF4A00' },
    { angle: 90,   r: 110 * u, label: 'Sheets',   color: GRN       },
    { angle: 150,  r: 110 * u, label: 'Notion',   color: DARK      },
    { angle: 210,  r: 110 * u, label: 'Webhook',  color: P         },
  ];

  apps.forEach(({ angle, r, label, color }) => {
    const rad = (angle * Math.PI) / 180;
    const ax = cx + Math.cos(rad) * r;
    const ay = cy + Math.sin(rad) * r;

    // Connection line with animated dash
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 * u;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rad) * 46 * u, cy + Math.sin(rad) * 46 * u);
    ctx.lineTo(ax - Math.cos(rad) * 22 * u, ay - Math.sin(rad) * 22 * u);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Pulse ring
    ctx.save();
    ctx.globalAlpha = 0.15;
    dot(ctx, ax, ay, 30 * u, color);
    ctx.restore();

    // App dot
    dot(ctx, ax, ay, 20 * u, color);
    ctx.font = `700 ${9 * u}px Inter`;
    ctx.fillStyle = WHITE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label.slice(0, 3).toUpperCase(), ax, ay);

    ctx.font = `500 ${8 * u}px Inter`;
    ctx.fillStyle = DARK;
    ctx.fillText(label, ax, ay + 26 * u);
  });
}

// ─── General illustrations (updated with brand color #6c6cff) ─────────────────

function drawAutomation(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const nodes = [
    { x: -130, y: -55, label: 'Trigger', color: ACC  },
    { x: 0,    y: -55, label: 'Condition', color: P  },
    { x: 130,  y: -55, label: 'Action',  color: GRN  },
    { x: -65,  y: 75,  label: 'Notify',  color: PL   },
    { x: 65,   y: 75,  label: 'Log',     color: GRAY },
  ];
  const connections = [[0,1],[1,2],[1,3],[1,4]];

  ctx.save(); ctx.strokeStyle = PL; ctx.lineWidth = 2 * u;
  connections.forEach(([from, to]) => {
    const a = nodes[from]; const b = nodes[to];
    const ax = cx + a.x * u; const ay = cy + a.y * u;
    const bx = cx + b.x * u; const by = cy + b.y * u;
    ctx.beginPath(); ctx.moveTo(ax, ay);
    const mx = (ax + bx) / 2;
    ctx.quadraticCurveTo(mx, ay, bx, by);
    ctx.stroke();
    const ang = Math.atan2(by - ay, bx - mx);
    const ar = 7 * u;
    ctx.fillStyle = PL; ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - ar * Math.cos(ang - 0.4), by - ar * Math.sin(ang - 0.4));
    ctx.lineTo(bx - ar * Math.cos(ang + 0.4), by - ar * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  });
  ctx.restore();

  nodes.forEach(({ x, y, label, color }) => {
    const nx = cx + x * u; const ny = cy + y * u;
    const nw = 90 * u; const nh = 50 * u;
    ctx.save(); ctx.shadowColor = color + '33'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.roundRect(nx - nw/2, ny - nh/2, nw, nh, 12);
    ctx.fillStyle = WHITE; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.roundRect(nx - nw/2, ny - nh/2, nw, nh, 12);
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(nx - nw/2, ny - nh/2, nw, 4, [12,12,0,0]);
    ctx.fillStyle = color; ctx.fill();
    ctx.font = `500 ${10 * u}px Inter`; ctx.fillStyle = DARK;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, nx, ny + 4 * u);
  });
}

function drawAnalytics(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const W2 = 280 * u; const H2 = 200 * u;
  const lx = cx - W2/2; const ty = cy - H2/2;
  card(ctx, lx, ty, W2, H2, 16);

  ctx.font = `600 ${12 * u}px Inter`; ctx.fillStyle = DARK;
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText('Performance Overview', lx + 16 * u, ty + 14 * u);
  pill(ctx, lx + W2 - 68 * u, ty + 12 * u, 56 * u, 20 * u, '#D1FAE5');
  ctx.font = `600 ${9 * u}px Inter`; ctx.fillStyle = GRN;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('▲ 12.4%', lx + W2 - 40 * u, ty + 22 * u);

  const barData = [0.45,0.62,0.55,0.78,0.68,0.85,0.72];
  const chartX = lx + 16 * u; const chartW = W2 - 32 * u;
  const chartY = ty + 44 * u; const chartH2 = H2 - 76 * u;
  const barW = chartW / barData.length - 6 * u;
  barData.forEach((v, i) => {
    const bx = chartX + i * (barW + 6 * u);
    const bh = chartH2 * v; const by = chartY + chartH2 - bh;
    ctx.beginPath(); ctx.roundRect(bx, by, barW, bh, [4,4,0,0]);
    const g = ctx.createLinearGradient(bx, by, bx, by+bh);
    g.addColorStop(0, i === 5 ? P : PL); g.addColorStop(1, i === 5 ? PD : PP);
    ctx.fillStyle = g; ctx.fill();
  });

  const days = ['M','T','W','T','F','S','S'];
  ctx.font = `400 ${8 * u}px Inter`; ctx.fillStyle = GRAY; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  barData.forEach((_, i) => {
    ctx.fillText(days[i], chartX + i*(barW+6*u) + barW/2, chartY + chartH2 + 4*u);
  });
}

function drawProductivity(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const tasks = [
    { label: 'Review design mockups', done: true,  y: -80 },
    { label: 'Send weekly report',    done: true,  y: -28 },
    { label: 'Finish sprint planning',done: false, y: 24  },
    { label: 'Update documentation',  done: false, y: 76  },
  ];
  tasks.forEach(({ label, done, y }) => {
    const tw = 250 * u; const th = 40 * u;
    const tx = cx - tw / 2; const ty = cy + y * u - th / 2;
    card(ctx, tx, ty, tw, th, 10);
    const cbx = tx + 18 * u; const cby = ty + th / 2;
    if (done) check(ctx, cbx, cby, 9 * u, P);
    else { dot(ctx, cbx, cby, 9 * u, WHITE); ctx.beginPath(); ctx.arc(cbx, cby, 9*u, 0, Math.PI*2); ctx.strokeStyle = PDL; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.font = `${done ? '400' : '500'} ${12 * u}px Inter`; ctx.fillStyle = done ? GRAY : DARK;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, cbx + 16 * u, cby);
    if (done) { const tw2 = ctx.measureText(label).width; ctx.strokeStyle = GRAY; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cbx+16*u, cby); ctx.lineTo(cbx+16*u+tw2, cby); ctx.stroke(); }
  });

  const rx = cx + 130 * u; const ry = cy - 60 * u; const rr = 38 * u;
  ctx.beginPath(); ctx.arc(rx, ry, rr, -Math.PI/2, Math.PI*1.5); ctx.strokeStyle = PP; ctx.lineWidth = 7*u; ctx.stroke();
  ctx.beginPath(); ctx.arc(rx, ry, rr, -Math.PI/2, -Math.PI/2+Math.PI*2*0.5); ctx.strokeStyle = P; ctx.lineWidth = 7*u; ctx.lineCap = 'round'; ctx.stroke();
  ctx.font = `700 ${14 * u}px Inter`; ctx.fillStyle = DARK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('50%', rx, ry);
}

function drawTeam(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const people = [
    { x:0, y:-95, color: P,       initials:'AM', role:'Lead'   },
    { x:-110, y:30, color: GRN,   initials:'BK', role:'Design' },
    { x:110, y:30,  color: ACC,   initials:'CL', role:'Dev'    },
    { x:-55, y:145, color: PL,    initials:'DR', role:'QA'     },
    { x:55,  y:145, color:'#EC4899', initials:'EV', role:'PM'  },
  ];
  ctx.save(); ctx.globalAlpha = 0.2; ctx.strokeStyle = P; ctx.lineWidth = 1.5 * u; ctx.setLineDash([5,4]);
  for (let i=1; i<people.length; i++) {
    ctx.beginPath(); ctx.moveTo(cx+people[0].x*u, cy+people[0].y*u); ctx.lineTo(cx+people[i].x*u, cy+people[i].y*u); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.restore();
  people.forEach(({ x, y, color, initials, role }) => {
    const px = cx+x*u; const py = cy+y*u; const av = 26 * u;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 10; dot(ctx, px, py, av, color); ctx.restore();
    ctx.beginPath(); ctx.arc(px, py, av+3*u, 0, Math.PI*2); ctx.strokeStyle = WHITE; ctx.lineWidth = 3*u; ctx.stroke();
    ctx.font = `700 ${11 * u}px Inter`; ctx.fillStyle = WHITE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(initials, px, py);
    const lw = ctx.measureText(role).width + 14 * u;
    pill(ctx, px-lw/2, py+av+5*u, lw, 16*u, PP);
    ctx.font = `500 ${8 * u}px Inter`; ctx.fillStyle = P; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(role, px, py+av+13*u);
  });
}

function drawGrowth(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const points = [0.85,0.7,0.78,0.6,0.65,0.45,0.38,0.25,0.1];
  const pw = 250*u; const ph = 150*u; const ox = cx-pw/2; const oy = cy-20*u;
  ctx.save(); ctx.globalAlpha = 0.1; ctx.strokeStyle = P; ctx.lineWidth = 2*u;
  ctx.beginPath(); points.forEach((v,i) => { const px=ox+(i/(points.length-1))*pw; const py=oy+ph*v; i===0?ctx.moveTo(px,py):ctx.lineTo(px,py); }); ctx.stroke();
  ctx.restore();

  const rx = cx+30*u; const ry = cy-55*u; const rh = 95*u; const rw = 34*u;
  ctx.save(); ctx.translate(rx, ry); ctx.rotate(-Math.PI/5);
  ctx.beginPath(); ctx.moveTo(0, rh*0.6); ctx.quadraticCurveTo(-rw*0.5, rh*0.9, 0, rh); ctx.quadraticCurveTo(rw*0.5, rh*0.9, 0, rh*0.6);
  const fg = ctx.createLinearGradient(0, rh*0.6, 0, rh); fg.addColorStop(0, ACC); fg.addColorStop(1, '#FDE68A'); ctx.fillStyle = fg; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(rw*0.7, rh*0.2, rw*0.55, rh*0.65); ctx.lineTo(-rw*0.55, rh*0.65); ctx.quadraticCurveTo(-rw*0.7, rh*0.2, 0, 0);
  const bg = ctx.createLinearGradient(-rw/2,0,rw/2,0); bg.addColorStop(0, PL); bg.addColorStop(0.5, WHITE); bg.addColorStop(1, PL); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = P; ctx.lineWidth = 2; ctx.stroke();
  dot(ctx, 0, rh*0.3, rw*0.22, PP); ctx.restore();

  card(ctx, cx-140*u, cy+75*u, 95*u, 48*u, 10);
  ctx.font = `700 ${20 * u}px Inter`; ctx.fillStyle = GRN; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('+68%', cx-92*u, cy+82*u);
  ctx.font = `400 ${9 * u}px Inter`; ctx.fillStyle = GRAY; ctx.fillText('vs last month', cx-92*u, cy+106*u);
}

function drawTime(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300; const r = 100*u;
  ctx.save(); ctx.shadowColor = P+'33'; ctx.shadowBlur = 25; dot(ctx, cx, cy, r, WHITE); ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.strokeStyle = PDL; ctx.lineWidth = 2*u; ctx.stroke();
  for (let i=0; i<12; i++) {
    const a = (i/12)*Math.PI*2-Math.PI/2; const isMaj = i%3===0; const len = isMaj?10*u:6*u;
    ctx.strokeStyle = isMaj?P:PL; ctx.lineWidth = isMaj?3*u:1.5*u;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*(r-3*u), cy+Math.sin(a)*(r-3*u)); ctx.lineTo(cx+Math.cos(a)*(r-len-3*u), cy+Math.sin(a)*(r-len-3*u)); ctx.stroke();
  }
  const hA = (10/12)*Math.PI*2-Math.PI/2;
  ctx.strokeStyle = DARK; ctx.lineWidth = 5*u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(hA)*r*0.55, cy+Math.sin(hA)*r*0.55); ctx.stroke();
  const mA = (2/12)*Math.PI*2-Math.PI/2+Math.PI/6;
  ctx.strokeStyle = P; ctx.lineWidth = 3.5*u; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(mA)*r*0.75, cy+Math.sin(mA)*r*0.75); ctx.stroke();
  ctx.strokeStyle = ACC; ctx.lineWidth = 1.5*u; const sA=(35/60)*Math.PI*2-Math.PI/2;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(sA)*r*0.82, cy+Math.sin(sA)*r*0.82); ctx.stroke();
  dot(ctx, cx, cy, 5*u, P);
  card(ctx, cx+r+8*u, cy-25*u, 88*u, 50*u, 10);
  ctx.font = `700 ${18 * u}px Inter`; ctx.fillStyle = P; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText('6h', cx+r+52*u, cy-15*u);
  ctx.font = `400 ${9 * u}px Inter`; ctx.fillStyle = GRAY; ctx.fillText('saved/week', cx+r+52*u, cy+6*u);
}

function drawGoals(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  [{r:105*u,fill:'#FEF3C7'},{r:78*u,fill:'#FDE68A'},{r:52*u,fill:PL},{r:32*u,fill:P},{r:15*u,fill:RED}].forEach(({r,fill}) => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.05)'; ctx.shadowBlur = 6; dot(ctx, cx, cy, r, fill); ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.strokeStyle = WHITE; ctx.lineWidth = 2.5*u; ctx.stroke();
  });
  const ax = cx+18*u; const ay = cy-12*u;
  ctx.save(); ctx.translate(ax, ay); ctx.rotate(-Math.PI/8);
  ctx.strokeStyle = DARK; ctx.lineWidth = 5*u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-28*u, 18*u); ctx.lineTo(7*u, -7*u); ctx.stroke();
  ctx.fillStyle = DARK; ctx.beginPath(); ctx.moveTo(7*u,-7*u); ctx.lineTo(-4*u,-15*u); ctx.lineTo(15*u,-18*u); ctx.lineTo(11*u,-3*u); ctx.closePath(); ctx.fill();
  ctx.restore();
  card(ctx, cx+88*u, cy-36*u, 85*u, 50*u, 10);
  ctx.font = `700 ${18 * u}px Inter`; ctx.fillStyle = GRN; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText('9/10', cx+130*u, cy-24*u);
  ctx.font = `400 ${9 * u}px Inter`; ctx.fillStyle = GRAY; ctx.fillText('Goals hit', cx+130*u, cy-2*u);
}

function drawCode(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300; const w=280*u; const h=200*u; const lx=cx-w/2; const ty=cy-h/2;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 8*u;
  ctx.beginPath(); ctx.roundRect(lx, ty, w, h, 14); ctx.fillStyle = '#1E1B4B'; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.roundRect(lx, ty, w, 30*u, [14,14,0,0]); ctx.fillStyle = '#312E81'; ctx.fill();
  ['#EF4444','#F59E0B','#10B981'].forEach((c,i) => dot(ctx, lx+14*u+i*17*u, ty+15*u, 5*u, c));
  ctx.font = `400 ${9 * u}px Inter`; ctx.fillStyle = '#A5B4FC'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('workflow.ts', cx, ty+15*u);
  const lines = [
    {txt:'const task = await', color:'#C4B5FD'},
    {txt:'  createTask({',     color:'#93C5FD'},
    {txt:'    title,',         color:'#6EE7B7'},
    {txt:'    assignee,',      color:'#6EE7B7'},
    {txt:'    dueDate,',       color:'#6EE7B7'},
    {txt:'  });',              color:'#93C5FD'},
    {txt:'await notify(task);',color:'#FDE68A'},
  ];
  lines.forEach(({txt,color},i) => {
    const ly = ty+40*u+i*20*u;
    ctx.font = `400 ${9 * u}px Inter`; ctx.fillStyle = '#4C1D95'; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillText(String(i+1), lx+26*u, ly);
    ctx.font = `400 ${9 * u}px "Courier New", monospace`; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.fillText(txt, lx+33*u, ly);
  });
  ctx.fillStyle = P; ctx.fillRect(lx+33*u, ty+40*u+lines.length*20*u, 2*u, 12*u);
}

function drawRemote(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300; const r = 95*u;
  ctx.save(); ctx.shadowColor = P+'22'; ctx.shadowBlur = 22; dot(ctx, cx, cy, r, PP); ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.strokeStyle = PDL; ctx.lineWidth = 1.5*u; ctx.stroke();
  ctx.save(); ctx.globalAlpha = 0.25; ctx.strokeStyle = P; ctx.lineWidth = 1*u;
  [-45,0,45].forEach(dy => { const lat=dy*u; const hw=Math.sqrt(Math.max(0, r*r-lat*lat)); ctx.beginPath(); ctx.ellipse(cx, cy+lat, hw, r*0.28, 0, 0, Math.PI*2); ctx.stroke(); });
  ctx.beginPath(); ctx.ellipse(cx, cy, r*0.4, r, 0, 0, Math.PI*2); ctx.stroke();
  ctx.restore();
  [{angle:-0.8,d:0.7,l:'NYC'},{angle:0.3,d:0.6,l:'LON'},{angle:1.5,d:0.62,l:'SGP'},{angle:-2.2,d:0.5,l:'SYD'}].forEach(({angle,d,l}) => {
    const px=cx+Math.cos(angle)*r*d; const py=cy+Math.sin(angle)*r*0.52;
    dot(ctx, px, py, 6*u, P); ctx.save(); ctx.globalAlpha=0.3; dot(ctx, px, py, 10*u, P); ctx.restore();
    ctx.font = `600 ${8 * u}px Inter`; ctx.fillStyle = DARK; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(l, px, py-10*u);
  });
}

function drawSecurity(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300; const sw=130*u; const sh=150*u;
  ctx.save(); ctx.shadowColor = P+'55'; ctx.shadowBlur = 28;
  ctx.beginPath(); ctx.moveTo(cx, cy-sh/2); ctx.lineTo(cx+sw/2, cy-sh*0.22); ctx.lineTo(cx+sw/2, cy+sh*0.12); ctx.quadraticCurveTo(cx+sw/2, cy+sh/2, cx, cy+sh/2); ctx.quadraticCurveTo(cx-sw/2, cy+sh/2, cx-sw/2, cy+sh*0.12); ctx.lineTo(cx-sw/2, cy-sh*0.22); ctx.closePath();
  const sg = ctx.createLinearGradient(cx, cy-sh/2, cx, cy+sh/2); sg.addColorStop(0, P); sg.addColorStop(1, PD); ctx.fillStyle = sg; ctx.fill(); ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy-sh*0.36); ctx.lineTo(cx+sw*0.36, cy-sh*0.16); ctx.lineTo(cx+sw*0.36, cy+sh*0.06); ctx.quadraticCurveTo(cx+sw*0.36, cy+sh*0.38, cx, cy+sh*0.38); ctx.quadraticCurveTo(cx-sw*0.36, cy+sh*0.38, cx-sw*0.36, cy+sh*0.06); ctx.lineTo(cx-sw*0.36, cy-sh*0.16); ctx.closePath(); ctx.stroke();
  check(ctx, cx, cy+5*u, 44*u, 'transparent');
  ctx.strokeStyle = WHITE; ctx.lineWidth = 44*u*0.22; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(cx-44*u*0.35, cy+5*u); ctx.lineTo(cx-44*u*0.05, cy+5*u+44*u*0.32); ctx.lineTo(cx+44*u*0.42, cy+5*u-44*u*0.32); ctx.stroke();
  card(ctx, cx-52*u, cy+sh/2+12*u, 104*u, 34*u, 8);
  ctx.font = `600 ${12 * u}px Inter`; ctx.fillStyle = GRN; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✓ Secured', cx, cy+sh/2+29*u);
}

function drawChat(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  [{text:'Task completed! 🎉',agent:false,y:-100},{text:'Great work team',agent:true,y:-42},{text:'Next sprint ready?',agent:false,y:16},{text:'Yes, all set ✓',agent:true,y:74}]
  .forEach(({text,agent,y}) => {
    ctx.font = `400 ${12 * u}px Inter`;
    const bw2 = ctx.measureText(text).width+28*u; const bh=34*u;
    const bx = agent ? cx-108*u : cx-bw2+108*u; const by = cy+y*u-bh/2;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.08)'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.roundRect(bx, by, bw2, bh, 14); ctx.fillStyle = agent ? P : WHITE; ctx.fill(); ctx.restore();
    if (!agent) { ctx.beginPath(); ctx.roundRect(bx, by, bw2, bh, 14); ctx.strokeStyle = PDL; ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.font = `400 ${12 * u}px Inter`; ctx.fillStyle = agent ? WHITE : DARK; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, bx+14*u, by+bh/2);
    dot(ctx, agent ? bx-13*u : bx+bw2+13*u, by+bh/2, 7*u, agent ? PL : GRN);
  });
}

function drawPlanning(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  const cols = [{title:'To Do',color:GRAY,tasks:['Research','Wireframes','Review']},{title:'In Progress',color:ACC,tasks:['Design','Dev sprint']},{title:'Done',color:GRN,tasks:['Planning','Setup','Tests']}];
  const colW=88*u; const colGap=12*u; const totalW=cols.length*colW+(cols.length-1)*colGap;
  const startX=cx-totalW/2; const startY=cy-120*u;
  cols.forEach(({title,color,tasks},ci) => {
    const colX=startX+ci*(colW+colGap);
    ctx.beginPath(); ctx.roundRect(colX, startY, colW, 24*u, 7); ctx.fillStyle = color+'22'; ctx.fill();
    ctx.font = `600 ${9 * u}px Inter`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, colX+colW/2, startY+12*u);
    tasks.forEach((task,ti) => {
      const ty2=startY+34*u+ti*52*u;
      card(ctx, colX, ty2, colW, 42*u, 8);
      dot(ctx, colX+10*u, ty2+12*u, 4*u, color);
      ctx.font = `500 ${9 * u}px Inter`; ctx.fillStyle = DARK; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(task, colX+20*u, ty2+8*u);
      ctx.beginPath(); ctx.roundRect(colX+8*u, ty2+26*u, (colW-16*u), 4*u, 2); ctx.fillStyle = PP; ctx.fill();
      const prog = ci===2?1:ci===1?0.5+ti*0.2:0.15+ti*0.1;
      ctx.beginPath(); ctx.roundRect(colX+8*u, ty2+26*u, (colW-16*u)*prog, 4*u, 2); ctx.fillStyle = color; ctx.fill();
    });
  });
}

function drawRocket(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  drawGrowth(ctx, cx, cy - 30 * s / 300, s);
}

function drawDefault(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const u = s / 300;
  [{x:0,y:0,r:85*u,fill:PP,alpha:1},{x:-75,y:-55,r:40*u,fill:PL,alpha:0.5},{x:75,y:55,r:50*u,fill:P,alpha:0.12},{x:65,y:-75,r:28*u,fill:ACC,alpha:0.28}]
  .forEach(({x,y,r,fill,alpha}) => {
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (let i=0;i<6;i++) { const a=(i/6)*Math.PI*2-Math.PI/6; const hx=cx+x*u+Math.cos(a)*r; const hy=cy+y*u+Math.sin(a)*r; i===0?ctx.moveTo(hx,hy):ctx.lineTo(hx,hy); }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
  });
  dot(ctx, cx, cy, 55*u, P);
  ctx.font = `700 ${24 * u}px Inter`; ctx.fillStyle = WHITE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('TR', cx, cy);
  [0,1,2,3].forEach(i => { const a=(i/4)*Math.PI*2; dot(ctx, cx+Math.cos(a)*85*u, cy+Math.sin(a)*85*u, 7*u, i%2===0?PL:ACC); });
}
