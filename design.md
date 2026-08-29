# DevCraft UI/UX Design System & Mobile Tokens

## 1. Design Philosophy: Shop-Floor Optimization

DevCraft's UI is designed specifically for noisy, dim, or harsh outdoor/shop-floor environments across tier-2/3 Indian micro-businesses.

### Core Principles
1. **High Contrast & Sunlight Legibility:** Dark slate backgrounds (`#0f172a`) paired with vibrant high-contrast status accents (Emerald, Amber, Crimson, Indigo).
2. **Tactile Touch Targets:** All buttons, status chips, and interactive cards have minimum touch boundaries of $48\times 48\text{px}$ for fast operation with dusty or busy hands.
3. **Glanceable Status Badges:** Color-coded order status indicators immediately communicate order state without text scanning.
4. **Zero Layout Shift:** Rigid mobile skeleton components ensure instant rendering during offline cold starts.

---

## 2. Design Tokens & Color Palette

```css
:root {
  /* Surface & Base Colors */
  --bg-dark: #0f172a;           /* Slate 900 - Deep Background */
  --bg-card: #1e293b;           /* Slate 800 - Container Cards */
  --bg-card-hover: #334155;     /* Slate 700 - Hover / Active */
  --border-color: #475569;     /* Slate 600 - High Contrast Borders */

  /* Text & Typography */
  --text-primary: #f8fafc;      /* Slate 50 - High Legibility White */
  --text-secondary: #94a3b8;    /* Slate 400 - Subtitles & Metadata */
  --text-muted: #64748b;        /* Slate 500 - Auxiliary Labels */

  /* Status Colors */
  --status-synced: #10b981;     /* Emerald 500 - Synced / Success */
  --status-synced-bg: #064e3b;  /* Emerald 950 - Badge Background */

  --status-draft: #3b82f6;      /* Blue 500 - Draft / Unsynced */
  --status-draft-bg: #1e3a8a;   /* Blue 950 - Badge Background */

  --status-conflicted: #f59e0b; /* Amber 500 - Conflicted / Requires Review */
  --status-conflicted-bg: #451a03;/* Amber 950 - Badge Background */

  --status-clarify: #ef4444;    /* Red 500 - Needs Clarification */
  --status-clarify-bg: #450a0a;  /* Red 950 - Badge Background */

  /* Primary Accent & CTAs */
  --accent-primary: #6366f1;    /* Indigo 500 - Primary Buttons */
  --accent-hover: #4f46e5;      /* Indigo 600 - Hover State */
}
```

---

## 3. Typography & Badges

### Typography Hierarchy
- **Primary Font:** Inter, system-ui, -apple-system, sans-serif.
- **Headings:**
  - `H1 (Title)`: `1.5rem` (`24px`), Bold (`700`), Line Height `1.2`
  - `H2 (Section)`: `1.25rem` (`20px`), Semi-Bold (`600`), Line Height `1.3`
  - `Body`: `1.0rem` (`16px`), Regular (`400`), Line Height `1.5`
  - `Caption / Monospace`: `0.875rem` (`14px`), Medium (`500`), JetBrains Mono / monospace (for IDs, JSON, and amounts).

### Status Badges Specification

| Status Badge | Text Label | Icon | Background | Text Color | Border | Context / Trigger |
|---|---|---|---|---|---|---|
| **Synced** | `SYNCED` | $\checkmark$ Check | `#064e3b` | `#34d399` | `#059669` | Order synced cleanly across network / devices. |
| **Draft** | `LOCAL DRAFT` | $\odot$ Circle | `#1e3a8a` | `#60a5fa` | `#2563eb` | Order created offline; pending sync. |
| **Conflicted** | `CONFLICT` | $\Delta$ Warning | `#451a03` | `#fbbf24` | `#d97706` | Multi-device conflict surfaced; review required. |
| **Needs Clarify** | `NEEDS CLARIFY` | $?$ Help | `#450a0a` | `#f87171` | `#dc2626` | `needs_clarification: true` (missing blocking info / ambiguous date). |

---

## 4. Mobile Component Layouts

```
+-------------------------------------------------------------+
| [DevCraft]  (Online / Airplane Mode)      [Conflicts (2)]   |  <- Header Bar
+-------------------------------------------------------------+
|                                                             |
|  +-------------------------------------------------------+  |
|  | Message Parser Input Box                              |  |
|  | "bhaiya 2 kurta chahiye navy blue, chest 40, parso..."|  |
|  | [ Parse Message ] (Primary CTA Indigo Button)         |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  Filter: [ All ] [ Due Today ] [ Unpaid ] [ Conflicted ]   |  <- Quick Filter Chips
|                                                             |
|  +-------------------------------------------------------+  |
|  | ORD-1042 · Ramesh (Tailor)          [SYNCED]          |  |  <- Order Card
|  | 2x Kurta (navy blue, chest 40)                        |  |
|  | Due: 2026-09-05 | Amount: ₹1,200                       |  |
|  +-------------------------------------------------------+  |
|  | ORD-1043 · Meena Aunty              [CONFLICT]        |  |
|  | 1x Pajama (cream, waist 34)                           |  |
|  | Due: 2026-09-08 | Amount: ₹1,500                       |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
| [Feed]        [Analytics]       [Sync Simulator]            |  <- Bottom Navigation
+-------------------------------------------------------------+
```

### Component Guidelines
1. **Message Parser Box:** Prominent sticky box at top of screen for quick pasting of WhatsApp strings.
2. **Order Cards:** Feature high-contrast typography, explicit rupee symbols (`₹`), items list summary, due date, and dynamic status chip.
3. **Conflict Banner/Drawer:** Slide-over modal presenting side-by-side edit comparison (Device A vs Device B) with clear **[Accept A]**, **[Accept B]**, or **[Custom Merge]** actions.
