// One-time script: bundles Lucide SVG icons into a TS module
// Run: node scripts/bundleIcons.js
// Output: src/constants/lucideIconData.ts

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, '../../Public/Icons/Lucide Icons');
const OUT_DIR = join(__dirname, '../src/constants');
const OUT_FILE = join(OUT_DIR, 'lucideIconData.ts');

// Curated list of ~150 most useful icons for blog imagery
const SELECTED_ICONS = [
  'li_activity', 'li_alarm-clock', 'li_alert-circle', 'li_alert-triangle',
  'li_arrow-right', 'li_arrow-left', 'li_arrow-up', 'li_arrow-down',
  'li_award', 'li_bar-chart', 'li_bar-chart-2', 'li_bar-chart-3',
  'li_bell', 'li_book', 'li_book-open', 'li_bookmark',
  'li_briefcase', 'li_building', 'li_building-2', 'li_calendar',
  'li_camera', 'li_check', 'li_check-circle', 'li_check-square',
  'li_chevron-right', 'li_clipboard', 'li_clock', 'li_cloud',
  'li_code', 'li_code-2', 'li_cog', 'li_cpu',
  'li_credit-card', 'li_database', 'li_dollar-sign', 'li_download',
  'li_edit', 'li_eye', 'li_file', 'li_file-text',
  'li_filter', 'li_flag', 'li_folder', 'li_git-branch',
  'li_globe', 'li_grid', 'li_headphones', 'li_heart',
  'li_help-circle', 'li_home', 'li_image', 'li_inbox',
  'li_info', 'li_key', 'li_layers', 'li_layout',
  'li_layout-dashboard', 'li_lightbulb', 'li_link', 'li_list',
  'li_lock', 'li_log-in', 'li_mail', 'li_map',
  'li_map-pin', 'li_maximize', 'li_message-circle', 'li_message-square',
  'li_mic', 'li_minus', 'li_monitor', 'li_moon',
  'li_more-horizontal', 'li_more-vertical', 'li_mouse-pointer',
  'li_music', 'li_navigation', 'li_package', 'li_paperclip',
  'li_pen-tool', 'li_phone', 'li_pie-chart', 'li_play',
  'li_plus', 'li_plus-circle', 'li_printer', 'li_refresh-cw',
  'li_repeat', 'li_rocket', 'li_rss', 'li_search',
  'li_send', 'li_server', 'li_settings', 'li_settings-2',
  'li_share', 'li_share-2', 'li_shield', 'li_shield-check',
  'li_shopping-bag', 'li_shopping-cart', 'li_sliders', 'li_smartphone',
  'li_smile', 'li_star', 'li_sun', 'li_tablet',
  'li_tag', 'li_target', 'li_terminal', 'li_thermometer',
  'li_thumbs-up', 'li_toggle-left', 'li_tool', 'li_trash',
  'li_trending-up', 'li_trending-down', 'li_truck', 'li_tv',
  'li_umbrella', 'li_unlock', 'li_upload', 'li_user',
  'li_users', 'li_video', 'li_volume-2', 'li_wallet',
  'li_wifi', 'li_x', 'li_x-circle', 'li_zap',
  'li_zoom-in', 'li_zoom-out', 'li_accessibility', 'li_airplay',
  'li_anchor', 'li_aperture', 'li_archive', 'li_at-sign',
  'li_battery', 'li_bluetooth', 'li_box', 'li_circle',
];

function extractPathData(svgContent) {
  // Extract all path d attributes and other shape elements
  const paths = [];
  const pathMatches = svgContent.matchAll(/<path[^>]+d="([^"]+)"[^>]*>/g);
  for (const m of pathMatches) paths.push({ type: 'path', d: m[1] });

  const circleMatches = svgContent.matchAll(/<circle([^>]+)>/g);
  for (const m of circleMatches) {
    const attrs = m[1];
    const cx = (attrs.match(/cx="([^"]+)"/) || [])[1];
    const cy = (attrs.match(/cy="([^"]+)"/) || [])[1];
    const r = (attrs.match(/\br="([^"]+)"/) || [])[1];
    if (cx && cy && r) paths.push({ type: 'circle', cx, cy, r });
  }

  const lineMatches = svgContent.matchAll(/<line([^>]+)>/g);
  for (const m of lineMatches) {
    const attrs = m[1];
    const x1 = (attrs.match(/x1="([^"]+)"/) || [])[1];
    const y1 = (attrs.match(/y1="([^"]+)"/) || [])[1];
    const x2 = (attrs.match(/x2="([^"]+)"/) || [])[1];
    const y2 = (attrs.match(/y2="([^"]+)"/) || [])[1];
    if (x1 && y1 && x2 && y2) paths.push({ type: 'line', x1, y1, x2, y2 });
  }

  const polyMatches = svgContent.matchAll(/<polyline([^>]+)>/g);
  for (const m of polyMatches) {
    const attrs = m[1];
    const points = (attrs.match(/points="([^"]+)"/) || [])[1];
    if (points) paths.push({ type: 'polyline', points });
  }

  const rectMatches = svgContent.matchAll(/<rect([^>]+)>/g);
  for (const m of rectMatches) {
    const attrs = m[1];
    const x = (attrs.match(/\bx="([^"]+)"/) || ['','0'])[1];
    const y = (attrs.match(/\by="([^"]+)"/) || ['','0'])[1];
    const w = (attrs.match(/width="([^"]+)"/) || [])[1];
    const h = (attrs.match(/height="([^"]+)"/) || [])[1];
    const rx = (attrs.match(/rx="([^"]+)"/) || [])[1];
    if (w && h) paths.push({ type: 'rect', x, y, w, h, rx });
  }

  return paths;
}

// Read all available icons from directory
const availableFiles = new Set(readdirSync(ICONS_DIR).map(f => f.replace('.svg', '')));

const icons = {};
let found = 0;
let missing = 0;

for (const iconName of SELECTED_ICONS) {
  if (availableFiles.has(iconName)) {
    const filePath = join(ICONS_DIR, `${iconName}.svg`);
    const content = readFileSync(filePath, 'utf-8');
    const shapes = extractPathData(content);
    icons[iconName] = shapes;
    found++;
  } else {
    console.warn(`Missing: ${iconName}`);
    missing++;
  }
}

// Also include all available icons not in the curated list (up to 300 total)
// This gives maximum coverage for the icon picker
let extra = 0;
for (const fileName of readdirSync(ICONS_DIR)) {
  const name = fileName.replace('.svg', '');
  if (!icons[name] && extra < 150) {
    const filePath = join(ICONS_DIR, fileName);
    const content = readFileSync(filePath, 'utf-8');
    const shapes = extractPathData(content);
    icons[name] = shapes;
    extra++;
  }
}

mkdirSync(OUT_DIR, { recursive: true });

const output = `// Auto-generated by scripts/bundleIcons.js — do not edit manually
// ${Object.keys(icons).length} icons bundled from Lucide Icons

export type IconShape =
  | { type: 'path'; d: string }
  | { type: 'circle'; cx: string; cy: string; r: string }
  | { type: 'line'; x1: string; y1: string; x2: string; y2: string }
  | { type: 'polyline'; points: string }
  | { type: 'rect'; x: string; y: string; w: string; h: string; rx?: string };

export const ICONS: Record<string, IconShape[]> = ${JSON.stringify(icons, null, 2)};
`;

writeFileSync(OUT_FILE, output);
console.log(`Done! Wrote ${found} curated + ${extra} extra icons (${Object.keys(icons).length} total) to ${OUT_FILE}`);
console.log(`Missing from curated list: ${missing}`);
