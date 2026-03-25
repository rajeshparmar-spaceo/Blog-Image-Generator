# TextBolt — Brand Guidelines for Blog Image Generator

## Overview

TextBolt (formerly SendEmailToText.com) is a professional Email-to-SMS gateway service enabling businesses to send text messages directly from Gmail, Outlook, or any email client without additional software.

---

## Brand Identity

| Property | Value |
|---|---|
| Product | TextBolt |
| Tagline | "Professional Email to Text/SMS Service" |
| Former name | SendEmailToText.com |
| Website | https://textbolt.com/ |

---

## Colors

| Role | Hex | Usage |
|---|---|---|
| Primary (Orange) | `#FF6600` | CTA buttons, accents, VS badge, card highlights |
| Dark | `#1A1A2E` | Text on light backgrounds |
| Background (Peach) | `#FEE1CD` | Warm canvas background base |
| Ambient Peach | `#FFC59E` | Blurred radial glow accents (top-left + bottom-right) |
| Card Border | `#D4C4BA` | White card stroke |
| Card Background | `#FFFFFF` | Tool/logo cards |
| Text Primary | `#1A1A2E` | Headlines |
| Text Secondary | `#4A5568` | Subtitles, labels |

---

## Typography

| Usage | Font | Weight | Size (at 960×540) |
|---|---|---|---|
| Headline | Poppins | 700 | 38px |
| Subtitle | Poppins | 400 | 22px |
| Card label | Inter | 500 | 13px |
| VS badge | Poppins | 800 | 22px |

---

## Logo

- **Primary Logo (for overlay):** `TextBolt Logo With Frame.png`
  - Orange bolt icon + "TextBolt" bold wordmark + "Formerly SendEmailToText.com" sub-label
  - Bottom-right positioned within frame PNG
  - Used as a full-canvas overlay (`ctx.drawImage(logo, 0, 0, W, H)`)
- **Standalone Logo:** `TextBolt Logo.png` (no frame, for reference only)

---

## Canvas Size

- **Width:** 960px
- **Height:** 540px
- **Aspect Ratio:** 16:9

---

## Background Style — Warm Peach with Ambient Glow

The signature TextBolt background uses a warm peach tone with radial ambient light accents:

1. Base fill: `#FEE1CD`
2. Top-left radial gradient: `#FFC59E` → transparent, center at (124, 42), radius 267
3. Bottom-right radial gradient: `#FFC59E` → transparent, center at (832, 512), radius 330

This creates a warm, inviting feel distinct from the cooler/darker tones of other brands.

---

## Variants

### typeA — Simple Image

- **Layout:** Stock image as background with gradient overlay, OR warm peach background
- **Title position:**
  - `top-center`: title centered at top (y=60), max width 80% of canvas
  - `left-center`: title left-aligned, vertically centered (left half), max width 42% of canvas
- **Controls:** Title Position selector, Stock Image dropzone, Overlay panel, Title/Subtitle color pickers
- **Reference:** `Reference images/960_540 16_9.svg` and `960_540 16_9-2.svg`

### typeB — UI Image

- **Layout:**
  - `top-center`: Headline + subtitle at top, UI screenshot/image centered below
  - `left-center`: Text in left half, UI screenshot in right half (clipped)
- **Background:** Configurable solid or gradient (cbBgColor, cbBgColor2)
- **Controls:** Title Position, Background Panel, Image Size & Position, Stock Image
- **Reference:** `Reference images/960_540 16_9-1.svg`

### typeC — Alternatives Tools Image

- **Layout:** Title top-center, grid of competitor/alternative tool logo cards below
- **Background:** Warm peach gradient
- **Cards:** White with `#E8E8E8` border, 16px radius, tool logo centered, name label at bottom
- **Grid:** Auto-calculated columns (up to 8 tools, max 4 columns)
- **Controls:** CBToolUpload (logo upload per card), Step Items (tool names), Tool Name toggle, Tool Logo Size slider
- **Reference:** `Reference images/Top VText Alternatives for Businesses.svg`

### typeD — VS Comparison

- **Layout:** Two large white logo cards flanking a central orange VS badge
- **Background:** Warm peach (same as typeA, NOT dark)
- **Cards:** 180×180px, white fill, `#D4C4BA` border, 20px radius, drop shadow
- **VS Badge:** Orange circle (`#FF6600`), radius 36, centered between cards, white "VS" text
- **Title:** Top-center, wraps to multiple lines
- **Right card is highlighted:** orange border `#FF6600`
- **Controls:** CBVsLogoUpload (left and right logo uploads)
- **Reference:** `Reference images/Vs.svg`

### typeE — Cost + Reviews Image

- **Layout:** Title top-center, logo card bottom-left, cost badge + star rating + feature list on right
- **Background:** Warm peach gradient
- **Logo card:** 220×155px, white with primary-tinted border
- **Cost badge:** Orange (`#FF6600`) rounded rect, white price text
- **Stars:** 5-star rating display using cbRating (0–5, supports half stars)
- **Feature list:** Up to 4 bullet points (from stepItems) with orange bullets
- **Controls:** CBCostReviewPanel (logo upload + rating input + price text + feature bullets)
- **Reference:** `Reference images/Pricing and review.svg`

---

## Control Mapping (Sidebar)

| Variant | Controls Shown |
|---|---|
| typeA | Title Position, Stock Image, Overlay Panel |
| typeB | Title Position, Background Panel, Image Position, Stock Image |
| typeC | Text Inputs, CBToolUpload |
| typeD | Text Inputs, CBVsLogoUpload |
| typeE | Text Inputs, CBCostReviewPanel |

> All variants share: Brand Selector, Variant Selector, Text Inputs (headline/subtitle), Export Panel

---

## Shared State Fields Used

The TextBolt brand reuses ContentBridge's existing state fields (prefixed `cb`):

| Field | Used in |
|---|---|
| `cbTitlePosition` | typeA, typeB |
| `cbVsLogos[0,1]` | typeD |
| `cbToolImages[0-7]` | typeC |
| `cbCostLogo` | typeE |
| `cbRating` | typeE |
| `cbBgColor`, `cbBgColor2`, `cbBgType`, `cbBgGradientDir` | typeB |
| `cbImageOffsetX/Y`, `cbImageWidth/Height` | typeB |
| `cbTypeCHeadlineWidth`, `cbTypeCSubtitleWidth` | typeC |
| `cbToolNameEnabled`, `cbToolLogoSize` | typeC |
| `overlayColor`, `overlayOpacity`, `overlayPosition`, `overlayDirection` | typeA (with stock image) |
| `stockImage` | typeA, typeB |
| `stepItems` | typeC (tool names), typeE (feature bullets) |
| `subtitle` | all — typeE uses it as the price string |
| `titleColor`, `subtitleColor` | all |

---

## File Locations

| Asset | Path |
|---|---|
| Logo With Frame | `D:/Image Gen/TextBolt/TextBolt Logo With Frame.png` |
| Logo standalone | `D:/Image Gen/TextBolt/TextBolt Logo.png` |
| Reference images | `D:/Image Gen/TextBolt/Reference images/` |
| App logo (public) | `D:/Image Gen/app/public/logos/textbolt/TextBolt-Logo-Frame.png` |
| Renderer | `D:/Image Gen/app/src/renderers/textBoltRenderer.ts` |
| Brand config | `D:/Image Gen/app/src/constants/brands.ts` — id: `textbolt` |
