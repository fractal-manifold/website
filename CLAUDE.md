# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Fractal Manifold corporate website - a static site built with Astro showcasing the company's startup investment and AI research activities. The site is deployed to GitHub Pages with a custom domain (fractalmanifold.com).

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

**Important**: The `dist/` folder is committed to Git for GitHub Pages deployment. After any content changes, run `npm run build` before committing.

## Architecture

### Project Structure
- **`src/pages/`**: Route pages (index.astro is the homepage)
- **`src/layouts/`**: Base layout with global styles and font imports
- **`src/components/`**: Reusable components (Header, Footer)
- **`public/`**: Static assets served as-is (favicon, CNAME for GitHub Pages)
- **`dist/`**: Build output (committed to repo for GitHub Pages)

### Design System

**Color Palette** (defined in `src/layouts/Layout.astro`):
- Black background: `#0A0A0A` (primary), `#1A1A1A` (secondary)
- Gold accent: `#F59E0B` (primary), `#FBBF24` (light)
- Purple accent: `#9333EA` (primary), `#A855F7` (light)
- Text: `#FFFFFF` (primary), `#D1D5DB` (secondary), `#9CA3AF` (muted)

**Typography**:
- Display font: "Bruno Ace" (imported from Google Fonts, used for all headings)
- Body font: System font stack
- Headings use `--font-display` CSS variable

**Gradients**:
All gradients use a specific pattern to avoid muddy intermediate colors:
```css
linear-gradient(135deg,
  var(--color-gold) 0%,
  var(--color-gold) 30%,
  var(--color-purple) 70%,
  var(--color-purple) 100%
)
```
This creates a 30-70 split with sharp transition, showing more pure gold and purple rather than blending into reddish tones.

### Component Patterns

**Feature Cards** (used in startup/research sections):
- Use "background icon" pattern: large emoji (8rem) at 15% opacity positioned absolutely on the right
- Content wrapped in `.feature-content` with `position: relative; z-index: 1`
- Structure:
  ```html
  <div class="feature">
    <span class="bg-icon">🚀</span>
    <div class="feature-content">
      <h3>Title</h3>
      <p>Description</p>
    </div>
  </div>
  ```

**Buttons** (hero CTA buttons):
- Both primary and secondary use ghost/outline style by default
- Fill with gradient/solid color on hover
- Always include `transform: translateY(-3px)` on hover for consistent interaction

**Header**:
- Fixed position with backdrop blur
- Logo split into two gradient spans: "Fractal" (gold) and "Manifold" (purple)
- Uses `white-space: nowrap` to keep logo on single line

## Deployment (GitHub Pages)

The site deploys to **fractalmanifold.com** via GitHub Pages:

1. **Build**: `npm run build` generates static files in `dist/`
2. **Commit**: The `dist/` folder must be committed (it's tracked in Git)
3. **CNAME**: The `CNAME` file in the root specifies the custom domain
4. **Config**: `astro.config.mjs` has `site: 'https://fractalmanifold.com'` for correct asset paths

After making changes:
```bash
npm run build      # Build updated site
git add .
git commit -m "Update website"
git push origin main
```

GitHub Pages serves from the root (where `dist/` contains the built files).

## TypeScript Configuration

Uses Astro's strict TypeScript preset with `strictNullChecks` enabled. All `.astro` files are type-checked during build via `astro check`.

## Content Guidelines

- All text is in English
- Tone: Professional, tech-focused, emphasizing innovation and research
- Sections: Startup Investment, AI Research, Contact
- Contact email: contact@fractalmanifold.com
