# Design Document (DESIGN.md)

## Project

Weather Outfit Planner

This document defines the visual design for the Weather Outfit Planner before any HTML, CSS, or JavaScript is written. It covers layout, typography, color, component styling, responsive behavior, and the visual treatment of all five required states (empty, loading, error, invalid input, in-use), based on [PROPOSAL.md](./PROPOSAL.md) and [PRD.md](./PRD.md).

## 1. Overall Visual Direction

- **Style:** Simple, clean, modern "card on a soft background" look. One centered content card on a plain background — no clutter, no decorative imagery.
- **Tone:** Friendly and calm, like a small utility app. Weather-themed but not cartoonish — subtle color only, no heavy icons or illustrations required (a small weather emoji/icon is enough, e.g. ☀️ 🌧️ ❄️).
- **Feel:** Lightweight and fast. Minimal UI chrome, generous white space, soft rounded corners, soft shadows instead of hard borders.
- **Scope fit:** Entirely achievable with plain CSS (flexbox, basic transitions) — no animation libraries, no icon packs required (system emoji is optional and sufficient).

## 2. Page Layout

Single-page, single-column layout. No navigation bar, no sidebar, no footer links beyond a small credit line.

```
┌─────────────────────────────────────┐
│              Page background          │
│   ┌─────────────────────────────┐   │
│   │   App title + short subtitle │   │
│   │                               │   │
│   │   [ City input ] [ Date ]    │   │
│   │        [ Get Recommendation ] │   │
│   │                               │   │
│   │  ── state area (below) ──    │   │
│   │   (empty / loading / error /  │   │
│   │    invalid / result content)  │   │
│   └─────────────────────────────┘   │
│         small footer text            │
└─────────────────────────────────────┘
```

- A single `.card` container (max-width ~480–560px) is centered horizontally and vertically-ish (top-aligned with top margin on taller screens).
- Inside the card, content stacks vertically in this order:
  1. Header (title + subtitle)
  2. Input form (city input, date input, button)
  3. Dynamic state/result area (only one of: empty hint, loading indicator, error message, invalid-input message, or the full result)
- Vertical spacing between sections is consistent (e.g., 1.5rem) to keep rhythm simple.

## 3. Typography

- **Font stack:** System font stack for simplicity and zero load time:
  `font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;`
- **Hierarchy:**
  - Page title (`h1`): ~1.5–1.75rem, bold (700).
  - Subtitle: ~0.95rem, regular weight, muted color.
  - Section labels (e.g., "Weather", "What to Wear", "What to Bring"): ~1rem–1.1rem, semi-bold (600), slightly letter-spaced or uppercase-small for separation.
  - Body text / recommendation list items: ~1rem, regular weight.
  - Helper/error/invalid text: ~0.875rem.
- **Line height:** 1.4–1.5 for readability.
- **Alignment:** Left-aligned text throughout, except the header (title/subtitle), which is center-aligned for a clean "app cover" feel.

## 4. Color Palette

Keep the palette small and restrained — a neutral base with one primary accent color and clear status colors.

| Role | Color | Use |
|---|---|---|
| Page background | `#F4F6F8` (very light cool gray) | Body background |
| Card background | `#FFFFFF` | Main content card |
| Primary text | `#1F2937` (dark slate) | Headings, body text |
| Secondary/muted text | `#6B7280` (medium gray) | Subtitle, helper text |
| Primary accent | `#2F80ED` (clear sky blue) | Button, focus rings, links, icons |
| Primary accent hover | `#1C64D1` | Button hover/active |
| Success / in-use accent | `#1B9C85` (soft teal-green) | Result highlights, "in-use" section headers |
| Warning / invalid | `#B45309` (amber-brown) on `#FEF3C7` background | Invalid input banner |
| Error | `#B91C1C` (deep red) on `#FEE2E2` background | Error banner |
| Border / divider | `#E5E7EB` (light gray) | Input borders, subtle dividers |

Rule of thumb: neutrals do most of the work; color is reserved for the button, state banners, and small section accents (e.g., a colored left border or icon) — not large colored blocks.

## 5. City and Date Input Area

- Laid out as a simple form with two fields placed side-by-side on desktop/tablet widths, stacked on mobile:
  - **City input:** `<input type="text">` with placeholder "e.g., Toronto", full rounded border (`1px solid #E5E7EB`, `border-radius: 8px`), padding ~0.6rem 0.75rem, label above it ("City").
  - **Date input:** `<input type="date">`, same visual treatment as city input, label above it ("Date"). `min`/`max` attributes constrain it to the supported forecast range per the PRD.
- Both inputs share consistent height (~44px), font size (~1rem), and focus state: on focus, border color changes to the primary accent (`#2F80ED`) with a subtle outer glow (`box-shadow: 0 0 0 3px rgba(47,128,237,0.15)`).
- Labels are small, muted, and sit directly above each field (~0.85rem, `#6B7280`).
- Field group spacing: ~1rem gap between city and date fields; ~1.25rem below the field row before the button.

## 6. Main Button

- Single primary button: **"Get Recommendation"**, full-width on mobile, auto-width (centered or left-aligned under the fields) on desktop.
- Style: solid fill `#2F80ED`, white text, bold (600), rounded corners (`border-radius: 8px`), comfortable padding (`0.75rem 1.5rem`), no border.
- **Hover:** darker fill (`#1C64D1`), slight cursor pointer.
- **Active/pressed:** slightly scaled down (e.g., `transform: scale(0.98)`) for tactile feedback.
- **Disabled (loading state):** reduced opacity (~0.6), `cursor: not-allowed`, text may change to "Checking weather…".
- **Focus:** visible focus outline/glow for accessibility (keyboard users), matching the input focus glow.

## 7. Weather Result Section

Appears only in the in-use state, directly below the form, inside a lightly separated block (e.g., top border or subtle background tint `#F9FAFB`) so it's visually distinct from the form above.

- **Header line:** Matched location + date, e.g., "**Toronto, Canada** — Sat, Nov 7" (bold location name, muted date).
- **Weather summary row:** A compact horizontal row (wraps on mobile) of small stat items, each with a short label and value:
  - 🌡️ High/Low: "18° / 9°C"
  - 🤔 Feels like: "16°C"
  - 🌧️ Rain chance: "40%"
  - 💨 Wind: "22 km/h"
- Each stat is a small "chip" or plain label-value pair — no heavy card-in-card styling, just consistent spacing and a divider or soft background per chip (`#F4F6F8`, `border-radius: 6px`, small padding).
- A one-line plain-language weather summary sentence can sit above the stats (e.g., "Expect a cool, breezy day with a chance of rain."), using the weather code to pick a short phrase and optionally a matching emoji icon.

## 8. Clothing Recommendation Section

- Clearly separated sub-section with a small header: **"👕 What to Wear"** (semi-bold, `#1F2937`, with the teal/green accent used sparingly, e.g., as a left border accent `border-left: 3px solid #1B9C85` or small icon color).
- Content: a short single sentence or small bulleted list (1–3 items) describing the clothing recommendation derived from temperature/feels-like per the PRD rules (e.g., "Wear a light jacket or sweater.").
- Visual style: plain text list with small bullet markers or simple line items; no icons required per item (keep it simple), though a single leading emoji per line is optional and acceptable (e.g., "🧥 Light jacket").
- Spacing: ~0.75rem top margin from the weather summary; ~0.5rem internal line spacing between list items.

## 9. Items-to-Bring Section

- Same visual pattern as the clothing section for consistency, with its own small header: **"🎒 What to Bring"**.
- Content: a short bulleted list (0–3 items) based on precipitation, wind, and weather code rules (e.g., "☂️ Bring an umbrella", "🕶️ Bring sunglasses").
- If no items apply (calm, dry weather), show a brief reassuring line instead of an empty section, e.g., "No extra items needed today."
- Visually grouped directly below "What to Wear" with the same spacing rhythm (~0.75rem separation) so both sections read as a matched pair.

## 10. Responsive Mobile Layout

- **Breakpoint:** a single simple breakpoint at ~600px is sufficient.
- **Above 600px (desktop/tablet):**
  - Card max-width ~520px, centered with top margin (~3rem).
  - City and date inputs side-by-side (two columns, roughly 60/40 split).
  - Weather stat chips in a horizontal row, wrapping only if needed.
- **At or below 600px (mobile):**
  - Card becomes full-width with side margins (~1rem), top margin reduced (~1.5rem).
  - City and date inputs stack vertically, each full width.
  - Button becomes full-width.
  - Weather stat chips wrap into a 2-column grid (or stack vertically if simplest), still left-aligned.
  - Font sizes stay the same or reduce slightly (~0.95x) for the title only, to avoid wrapping awkwardly.
- No layout uses fixed pixel widths that would overflow small screens; all widths use `%`/`max-width` with the card padding (~1.25–1.5rem) providing internal breathing room.

## 11. Visual Treatment of the Five Required States

All states render inside the same "state/result area" beneath the form, so only one is visible at a time.

### 11.1 Empty State
- Shown on first page load, before any submission.
- Simple centered muted text/icon, e.g., "🌤️ Enter a city and date to get your outfit recommendation."
- Style: `#6B7280` muted text, no background box, generous vertical padding (~2rem) so the card doesn't look broken/half-empty.

### 11.2 Loading State
- Shown immediately after a valid submit, replacing the state area content.
- Simple, lightweight spinner (small CSS-only rotating circle, ~24–32px, border-based spinner using the primary accent color) centered, with text below or beside it: "Checking the weather…"
- The submit button simultaneously switches to its disabled styling (Section 6).
- No skeleton loaders needed — keep it to one spinner + one line of text for simplicity.

### 11.3 Error State
- Shown when the city can't be found or the API call fails.
- Rendered as a banner-style box: light red background `#FEE2E2`, deep red text `#B91C1C`, left accent border (`border-left: 4px solid #B91C1C`), rounded corners, padding ~0.75rem 1rem.
- Icon: ⚠️ at the start of the message, e.g., "⚠️ We couldn't find that city. Please check the spelling and try again."
- Includes no separate "retry" button — the existing form/button remains available to resubmit.

### 11.4 Invalid Input State
- Shown when the user submits with a missing/empty city or missing/out-of-range date, before any API call is made.
- Rendered as a banner-style box similar to the error state but in amber/warning tones: background `#FEF3C7`, text `#B45309`, left accent border `border-left: 4px solid #B45309`.
- Icon: ✏️ or ❗ at the start, e.g., "❗ Please enter a city and choose a date within the next 16 days."
- Field-level reinforcement (simple and optional): the offending input(s) get a thin amber border to show exactly what needs fixing.

### 11.5 In-Use State
- Shown after a successful lookup; replaces empty/loading/error/invalid content entirely.
- Combines Sections 7–9 (Weather Result, What to Wear, What to Bring) in that vertical order.
- Uses the success/teal accent (`#1B9C85`) sparingly as section header accents to visually confirm "this worked," distinct from the neutral empty state and the red/amber alert states.
- The form above remains fully interactive so the user can immediately search again; a new submission transitions straight back to the Loading state, replacing this content.

## 12. Summary of Reusable Visual Patterns

To keep implementation simple, the whole UI relies on just a few reusable patterns:
1. **Card** — white background, rounded corners, soft shadow, padding.
2. **Field** — label + input, consistent border/focus style.
3. **Button** — one primary style with hover/active/disabled variants.
4. **Banner** — one shared style (icon + colored background + left border) reused for both error and invalid-input states, differing only by color tokens.
5. **Section header** — label + colored left border/icon, reused for "Weather", "What to Wear", and "What to Bring".
6. **Chip** — small label-value pair, reused for each weather stat.

These six patterns are enough to implement every screen and state described above using plain CSS classes, with no component framework required.
