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

### IDE run configurations

Shared JetBrains run configurations live in `.run/` (versioned; `.idea/` is gitignored):
`dev` (dev server + opens the browser), `dev (LAN)` (`--host`, to test from a phone),
`build` and `preview`.

The same four exist for VS Code as launch configurations in `.vscode/launch.json` (Run and
Debug / F5); it is the only file under `.vscode/` that is versioned.

## Architecture

### Project structure
- **`src/pages/`** — route pages
  - `index.astro` — homepage (composition only)
  - `legal-notice.astro` / `aviso-legal.astro` — LSSI-CE legal notice (EN/ES)
  - `privacy-policy.astro` / `politica-privacidad.astro` — GDPR/LOPDGDD privacy policy (EN/ES)
  - `404.astro` — custom error page
- **`src/layouts/`**
  - `Layout.astro` — base layout: global styles, OG/Twitter, Schema.org Organization, canonical, hreflang, skip link, referrer policy
  - `LegalLayout.astro` — shared chrome for the 4 legal pages, builds hreflang from `alternateHref`
- **`src/components/`** — Header, Footer
- **`src/components/sections/`** — HeroSection, ResearchSection, ProductsSection, FoundersSection, ContactSection
- **`src/components/hero-visuals/`** — `engine.ts` (shared canvas engine) + `LogoGraph.astro` (animated hero visual)
- **`src/styles/bento.css`** — global bento-grid / tile styles for the home
- **`public/`** — static assets (favicon, CNAME, robots.txt, `katex/` self-hosted fonts)
- **`dist/`** — build output

### Integrations / dependencies of note
- **`@astrojs/sitemap` 3.2.1** (pinned — newer versions require Astro ≥5, we're on Astro 4).
- **`katex`** + `public/katex/` — previously used for the hero equations layer; currently unused by the home.
- **`@fontsource/bruno-ace`** — brand font (logo, legal pages), self-hosted (no Google Fonts remote fetch, RGPD-friendly).
- **`@fontsource/unbounded`** + **`@fontsource/ibm-plex-sans`** — home display / body fonts, self-hosted, imported in `index.astro`.

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

**Home bento grid** (`index.astro` + `src/styles/bento.css`):
- `<main class="bento">` is a 12-column grid (6 cols ≤1080px, 1 col ≤760px) on a dot-grid background (`body:has(.bento)`).
- Each section component renders one or more `.tile` elements straight into the grid (Astro allows multiple root nodes). The section `id` sits on the section's first tile.
- Base tile styles live in `src/styles/bento.css` as `:where(.bento) .tile` (specificity 0,1,0): enough to beat Layout's `*` reset, while each component's scoped styles (`.x[data-astro-cid]`, 0,2,0) still override spans, borders and backgrounds. Headings use `.bento h2/h3` to beat Layout's global heading font.
- Fonts: Unbounded (`--display`) for headings/labels, IBM Plex Sans (`--body`) for text. Bruno Ace stays for the logo wordmark.
- Tiles fade in staggered on load via `--i` (index × 70ms); disabled under `prefers-reduced-motion`.

**Hero tile** (`HeroSection`): spans 8 columns × 2 rows; title in Bruno Ace, tagline in the system font. Behind the copy, `LogoGraph` draws on a `<canvas>`:
- The logo's ribbon (a band wrapped around a sphere along a tennis-ball-seam curve) as a light wireframe carrying a graph; one lobe gold, the other purple. The pose only rocks gently so the two-hole logo shape stays legible.
- Message-passing waves start at random nodes every ~1.3 s and spread breadth-first, gold → purple by hop.
- `engine.ts` handles DPR sizing, the rAF loop (paused off-screen / hidden tab), pointer parallax, perspective projection and `prefers-reduced-motion` (single still frame). Glows use pre-rendered sprites with `'lighter'` compositing, not `shadowBlur`.
- The ribbon is sized from the real title box so it never overlaps the text.

**Product tiles** (`ProductsSection`): whole tile is an `<a>`; GDL tile is outlined gold, `.product--purple` (Token Monitor) outlined purple, each with a tinted glow so they stand out from neutral tiles.

**Founder tiles** (`FoundersSection`): large faded `.bg-icon` (~18% opacity, top-right) as in the original feature cards, gold/purple alternating via `.founder--purple`.

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
- `prefers-reduced-motion` disables the bento tile entrance and the 404-orb animations, and freezes the hero canvas on a still frame.
- Hover effects guarded with `@media (hover: hover)` to avoid flicker on touch.

### SEO

- OpenGraph + Twitter cards on every page via `Layout.astro`.
- `Organization` Schema.org JSON-LD in every page `<head>`.
- Canonical URL derived from `Astro.url.pathname`.
- Sitemap via `@astrojs/sitemap` at `/sitemap-index.xml`.
- `robots.txt` at `public/robots.txt`.
- `noindex` prop on `Layout` sets `<meta name="robots">` to `noindex, nofollow` (used by `404`).

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
