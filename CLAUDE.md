# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Fractal Manifold corporate website — a static site built with Astro showcasing the company's AI research and founder acceleration activities. The site is deployed to GitHub Pages with a custom domain (fractalmanifold.com).

## Development Commands

### Development
```bash
npm run dev        # Start dev server at http://localhost:4321
npm start          # Alias for npm run dev
```

### Building
```bash
npm run build      # TypeScript check + production build to dist/
npm run preview    # Preview production build locally
```

**Important**: the `dist/` folder is **NOT** committed to Git. GitHub Actions builds it automatically on push.

## Architecture

### Project structure
- **`src/pages/`** — route pages
  - `index.astro` — homepage (composition only)
  - `legal-notice.astro` / `aviso-legal.astro` — LSSI-CE legal notice (EN/ES)
  - `privacy-policy.astro` / `politica-privacidad.astro` — GDPR/LOPDGDD privacy policy (EN/ES)
  - `investment-model.astro` — internal prototype, `noindex` and excluded from robots/sitemap
  - `404.astro` — custom error page
- **`src/layouts/`**
  - `Layout.astro` — base layout: global styles, OG/Twitter, Schema.org Organization, canonical, hreflang, skip link, referrer policy
  - `LegalLayout.astro` — shared chrome for the 4 legal pages, builds hreflang from `alternateHref`
- **`src/components/`** — Header, Footer
- **`src/components/sections/`** — HeroSection, ResearchSection, FoundersSection, ContactSection
- **`public/`** — static assets (favicon, CNAME, robots.txt, `katex/` self-hosted fonts)
- **`dist/`** — build output

### Integrations / dependencies of note
- **`@astrojs/sitemap` 3.2.1** (pinned — newer versions require Astro ≥5, we're on Astro 4).
- **`katex`** — math rendered at build time (SSR) in the hero equations layer; CSS and fonts self-hosted in `public/katex/`.
- **`@fontsource/bruno-ace`** — display font self-hosted (no Google Fonts remote fetch, RGPD-friendly).

### Design system

**Color palette** (defined in `src/layouts/Layout.astro`):
- Background: `#0A0A0A` (primary), `#1A1A1A` (secondary)
- Gold accent: `#F59E0B` (primary), `#FBBF24` (light)
- Purple accent: `#9333EA` (primary), `#A855F7` (light)
- Text: `#FFFFFF` (primary), `#D1D5DB` (secondary), `#9CA3AF` (muted)

**Typography**:
- Display font: "Bruno Ace" (self-hosted via `@fontsource/bruno-ace`) — used for headings and logo.
- Body font: system font stack.
- Headings use `--font-display` CSS variable.

**Brand gradient** — defined as `--gradient-brand` (135°) and `--gradient-brand-horizontal` (90°) in `:root`:
```css
linear-gradient(135deg,
  var(--color-gold) 0%,
  var(--color-gold) 30%,
  var(--color-purple) 70%,
  var(--color-purple) 100%
)
```
30-70 split with sharp transition keeps gold and purple pure instead of blending into muddy tones.

**Usage rule**: the gradient is a brand accent, not a fill. Apply it only to the logo, `.gradient-text`, and `.section-line`. Buttons and headings use solid colors. Don't sprinkle the gradient across features, cards, or body copy.

### Component patterns

**Buttons** (`.btn`, `.btn-primary`, `.btn-secondary`) live in `Layout.astro` as global utilities:
- Ghost/outline style by default.
- Solid color fill on hover (not gradient).
- `translateY(-3px)` + box-shadow on hover.
- Hover states wrapped in `@media (hover: hover)` to avoid flicker on touch devices.

**Feature cards** (`ResearchSection`):
- Each `.feature` card has a large SVG `.bg-icon` at ~18% opacity positioned right, with content in `.feature-content { position: relative; z-index: 1 }`.
- `h3` is solid white, not gradient (gradient reserved for brand accents).

**Founder rows** (`FoundersSection`) break the grid symmetry:
- Alternating `flex-direction: row-reverse` on `:nth-child(even)`, icons in rounded squares with gold/purple tint alternating.
- Collapses to single-column on mobile.

**Hero equations layer**:
- `HeroSection.astro` renders 22 geometric deep learning equations with `katex` at build time and positions them absolutely in the hero background with slow drift animations.
- Equation density is reduced on viewports `<900px` (11 are hidden).

**Header**:
- Fixed position with backdrop blur.
- Logo has text gradient ("Fractal Manifold") via `.logo-text` and `-webkit-background-clip: text`.
- Nav anchors use `Astro.url.pathname` to detect home vs other pages; from non-home pages the hrefs become `/#section` so anchors resolve to the home sections.
- `aria-label` on the nav switches between `Main` and `Principal` based on the page's language.

**Footer**:
- Uses `Astro.url.pathname` to switch labels and hrefs between EN (Legal Notice / Privacy Policy) and ES (Aviso Legal / Política de Privacidad) automatically.

### Internationalisation

- `<html lang>` is passed through from each page to `Layout.astro` as the `lang` prop (`'en'` default, `'es'` for ES legal pages).
- `hreflang` links in the `<head>` are generated from `alternateLocales` prop; `LegalLayout` computes them from `alternateHref` and exposes `en` / `es` / `x-default`.
- The home is English-only — no Spanish translation of the marketing copy.

### Accessibility

- Skip-to-content link (`.skip-link`) rendered at the top of every page via `Layout.astro`; each page's `<main>` has `id="main-content"`.
- `:focus-visible` global outline in gold.
- `section[id]` has `scroll-margin-top: 100px` so the fixed header doesn't cover anchor targets.
- `prefers-reduced-motion` disables orb / equation / 404-orb animations.
- Hover effects guarded with `@media (hover: hover)` to avoid flicker on touch.

### SEO

- OpenGraph + Twitter cards on every page via `Layout.astro`.
- `Organization` Schema.org JSON-LD in every page `<head>`.
- Canonical URL derived from `Astro.url.pathname`.
- Sitemap via `@astrojs/sitemap` at `/sitemap-index.xml`; `/investment-model` excluded via filter.
- `robots.txt` at `public/robots.txt` — also disallows `/investment-model`.
- `noindex` prop on `Layout` sets `<meta name="robots">` to `noindex, nofollow` (used by `404` and `investment-model`).

## Deployment (GitHub Pages)

The site deploys to **fractalmanifold.com** via GitHub Pages using **GitHub Actions**:

### Automatic deployment
- Push to `main` triggers `.github/workflows/deploy.yml`.
- GitHub Actions runs `npm ci` + `npm run build` + deploy `dist/` to Pages.

### Configuration
- **Workflow**: `.github/workflows/deploy.yml`
- **Domain**: `public/CNAME` contains `fractalmanifold.com`
- **Site URL**: `astro.config.mjs` has `site: 'https://fractalmanifold.com'`

### GitHub Pages settings
- Source: **GitHub Actions**
- Custom domain: `fractalmanifold.com`

## TypeScript configuration

Uses Astro's strict TypeScript preset with `strictNullChecks` enabled. All `.astro` files are type-checked during build via `astro check`.

## Content guidelines

- Home in English. Legal pages mirrored in English and Spanish.
- Tone: professional, research-focused, low-key. The company does not market investment services directly — avoid wording that sounds like investor outreach or solicitation.
- Primary contact: `contact@fractalmanifold.com`.

## Legal data (kept in the 4 legal pages)

- **Company**: Fractal Manifold S.L., CIF B24958753
- **Registered office**: Calle Luis Carrillo de Toledo, 3, 28320 Pinto, Madrid, Spain
- **Registry**: Registro Mercantil de Madrid, Hoja M-871453 (folio electrónico), Sección General de Sociedades
- **Email provider declared in privacy policy**: Google Workspace (Google Ireland Limited + Google LLC under EU-US DPF)
