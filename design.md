# Intercom Design System

## 1. Visual Theme & Atmosphere

Intercom's visual identity relies on editorial warmth, extreme restraint, and product-first clarity. Rather than standard stark SaaS white or loud dark modes, the brand grounds itself on a soft, warm cream-white canvas (`{colors.canvas}` ≈ `#f5f1ec`). 

### Core Aesthetic Principles
- **Editorial Warmth**: The cream ground signals an intelligent, deliberate, magazine-like surface.
- **Product as Hero**: Marketing chrome remains quiet, allowing high-fidelity product UI mockups inside white surface cards to command focus.
- **Strict Chromatic Discipline**: System primary is rich Charcoal (`#111111`). Accent color is strictly **Fin Orange** (`#ff5600`), used solely for AI product touchpoints—never decoratively.
- **Flat Elevation**: No heavy drop shadows or glow effects. Layering is achieved purely through white-on-cream surface contrast (`{colors.surface-1}` on `{colors.canvas}`).

---

## 2. Color Palette & Roles

### Surface Tokens
- **Canvas (`{colors.canvas}`)**: `#f5f1ec` · Default warm cream page background.
- **Surface 1 (`{colors.surface-1}`)**: `#ffffff` · Pure white floating cards (mockups, pricing, features).
- **Surface 2 (`{colors.surface-2}`)**: `#eee9e0` · Subtle secondary cream (discount tiles, alt stripes).
- **Hairline (`{colors.hairline}`)**: `#d3cec6` · 1px warm gray borders for card definition.
- **Hairline Soft (`{colors.hairline-soft}`)**: `#e5e0d8` · Subtle dividers between list items and footer links.
- **Inverse Canvas (`{colors.inverse-canvas}`)**: `#000000` · True black for testimonial/quote emphasis strips.

### Typography & Ink Tokens
- **Ink (`{colors.ink}`)**: `#111111` · Primary charcoal for all display titles, headlines, body text, and primary CTAs.
- **Ink Muted (`{colors.ink-muted}`)**: `#626260` · Secondary text, metadata, deselected tab states.
- **Ink Subtle (`{colors.ink-subtle}`)**: `#7b7b78` · Helper text, footer link headers.
- **On Primary (`{colors.on-primary}`)**: `#ffffff` · White text on charcoal primary buttons.

### Brand Accent & Product Palette
- **Fin Orange (`{colors.fin-orange}`)**: `#ff5600` · AI-product accent reserved for Fin CTAs, badges, and inline AI highlights.
- **Brand Blue (`{colors.brand-blue}`)**: `#0007cb` · Accent blue for specific marketing illustrations.
- **In-Product Analytics Palette**: `{colors.report-blue}` (`#2f80ed`), `{colors.report-green}` (`#27ae60`), `{colors.report-pink}` (`#eb5757`), `{colors.report-lime}` (`#6fcf97`) — used strictly *inside* product UI mockups.

---

## 3. Typography Rules

### Font Families
- **Display & Body**: `Saans` (Proprietary geometric sans). Fallbacks: `Inter`, `Geist Sans`, `Söhne`.
- **Monospace**: `SaansMono` (Proprietary mono). Fallbacks: `JetBrains Mono`, `ui-monospace` (used only inside product UI mockups).

### Hierarchy Scale

| Token | Size | Weight | Line Height | Tracking | Purpose |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 500 | 1.05 | -2.0px | Main Hero Headlines |
| `{typography.display-lg}` | 56px | 500 | 1.10 | -1.4px | Major Section Openers |
| `{typography.display-md}` | 40px | 500 | 1.15 | -0.8px | Sub-section Headlines |
| `{typography.headline}` | 28px | 500 | 1.20 | -0.5px | Pricing Tier Titles, CTA Banners |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.3px | Feature & Card Titles |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead Intros & Subheaders |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero Sub-paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | 0.0px | Default Body Type |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0.0px | Secondary Card Body, Footers |
| `{typography.caption}` | 12px | 400 | 1.40 | 0.0px | Meta Labels & Captions |
| `{typography.button}` | 15px | 500 | 1.20 | 0.0px | Action Button Labels |
| `{typography.eyebrow}` | 14px | 500 | 1.30 | 0.0px | Sentence-case Section Badges |

---

## 4. Component Stylings

### Buttons
- **`button-primary`**: Charcoal (`#111111`) fill, white text, 10px 18px padding, 8px corner radius (`{rounded.md}`).
- **`button-secondary`**: Pure white (`#ffffff`) fill, 1px hairline border (`#d3cec6`), charcoal text, 8px radius (`{rounded.md}`).
- **`button-fin`**: Fin Orange (`#ff5600`) fill, white text, 8px radius (`{rounded.md}`). Reserved strictly for Fin AI actions.
- **`button-tertiary`**: Flat transparent background, charcoal text, clean hover state.

### Cards & Mockup Containers
- **`product-mockup-card`**: Pure white (`#ffffff`) background, 16px corner radius (`{rounded.xl}`), 24px padding. Houses high-fidelity product screenshots.
- **`pricing-card`**: Pure white (`#ffffff`) background, 12px corner radius (`{rounded.lg}`), 1px hairline border (`#d3cec6`), 24px padding.
- **`pricing-card-featured`**: Charcoal (`#111111`) background, white text, 12px corner radius (`{rounded.lg}`), 24px padding.
- **`testimonial-card`**: Pure white (`#ffffff`) background, 12px corner radius (`{rounded.lg}`), 32px padding, paired with rounded avatar (`{rounded.full}`).

---

## 5. Minimal & Premium Execution Guidelines

### Do
- Maintain generous vertical whitespace (`96px` section gaps) to let content breathe.
- Pair Medium weight (`500`) headlines with Regular weight (`400`) body copy.
- Enforce negative letter-spacing on display headlines to achieve a tight, modern typographic feel.
- Keep card corners moderate (`12px` to `16px`) — never fully pill-rounded, never sharp 0px.

### Don't
- **No drop shadows**: Never apply heavy drop shadows or glow effects.
- **No decorative gradients**: Avoid multi-color gradients or atmospheric background blurs.
- **No accent misuse**: Never use Fin Orange for generic background blocks or non-AI CTAs.
- **No all-caps eyebrows**: Eyebrows must remain in clean sentence case.
