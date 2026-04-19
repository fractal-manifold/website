# Fractal Manifold Website

The official corporate website for Fractal Manifold - showcasing our startup investment portfolio and AI research initiatives.

🌐 **Live Site:** [fractalmanifold.com](https://fractalmanifold.com)

## Overview

A modern, performant static website built with Astro, featuring a striking black and gold/purple color scheme with dynamic gradient effects. The site highlights our two core focus areas:
- **Startup Investment**: Strategic funding and support for innovative companies
- **AI Research**: Pioneering work in artificial intelligence and machine learning

## ✨ Features

- ⚡ **Lightning Fast**: Built with Astro for optimal performance (static site generation)
- 🎨 **Modern Design**: Custom design system with gradient accents and Bruno Ace typography
- 📱 **Fully Responsive**: Optimized for all screen sizes
- ♿ **Accessible**: Semantic HTML and WCAG-compliant color contrasts
- 🤖 **Automated Deployment**: GitHub Actions CI/CD pipeline
- 🎯 **Custom 404**: Branded error page for better UX
- 🔍 **SEO Optimized**: Meta tags, semantic structure, and fast loading times

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 4.16
- **Language**: TypeScript (strict mode)
- **Styling**: Scoped CSS with CSS variables (brand gradient as `--gradient-brand`)
- **Fonts**: Bruno Ace, self-hosted via [`@fontsource/bruno-ace`](https://fontsource.org/fonts/bruno-ace)
- **Math rendering**: [KaTeX](https://katex.org) at build time, self-hosted CSS + fonts
- **Sitemap**: `@astrojs/sitemap` (pinned to 3.2.1 for Astro 4 compat)
- **Deployment**: GitHub Pages via GitHub Actions
- **Package manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/fractal-manifold/website.git
cd website

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
# or
npm start
```

The site will be available at `http://localhost:4321`

### Building

```bash
# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
fractalmanifold_website/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub Actions deployment
├── public/
│   ├── logo.png                          # Company logo
│   ├── favicon.ico                       # Favicons
│   ├── robots.txt                        # Crawler rules (excludes /investment-model)
│   ├── katex/                            # Self-hosted KaTeX CSS + fonts
│   └── CNAME                             # Custom domain configuration
├── src/
│   ├── components/
│   │   ├── Header.astro                  # Site header (lang-aware nav)
│   │   ├── Footer.astro                  # Site footer (lang-aware links)
│   │   └── sections/
│   │       ├── HeroSection.astro         # Hero with animated equations
│   │       ├── ResearchSection.astro     # Research grid
│   │       ├── FoundersSection.astro     # Alternating list layout
│   │       └── ContactSection.astro      # Contact block
│   ├── layouts/
│   │   ├── Layout.astro                  # Base (OG, Schema, hreflang, skip link)
│   │   └── LegalLayout.astro             # Shared chrome for legal pages
│   └── pages/
│       ├── index.astro                   # Homepage
│       ├── 404.astro                     # Custom error page
│       ├── legal-notice.astro            # LSSI-CE legal notice (EN)
│       ├── aviso-legal.astro             # LSSI-CE legal notice (ES)
│       ├── privacy-policy.astro          # GDPR privacy policy (EN)
│       ├── politica-privacidad.astro     # RGPD privacy policy (ES)
│       └── investment-model.astro        # Internal prototype (noindex, hidden)
├── astro.config.mjs                      # Astro + sitemap integration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies and scripts
└── README.md                             # This file
```

## 🎨 Design System

### Color Palette

- **Background**: `#0A0A0A` (primary), `#1A1A1A` (secondary)
- **Gold Accent**: `#F59E0B` (primary), `#FBBF24` (light)
- **Purple Accent**: `#9333EA` (primary), `#A855F7` (light)
- **Text**: `#FFFFFF` (primary), `#D1D5DB` (secondary), `#9CA3AF` (muted)

### Typography

- **Display Font**: Bruno Ace (headings and titles)
- **Body Font**: System font stack for optimal performance

### Gradient Pattern

All gradients use a custom 30-70 split to maintain color purity:

```css
linear-gradient(135deg,
  var(--color-gold) 0%,
  var(--color-gold) 30%,
  var(--color-purple) 70%,
  var(--color-purple) 100%
)
```

This creates vibrant gold and purple tones while avoiding muddy intermediate colors.

## 🚢 Deployment

The site uses automated deployment via GitHub Actions:

1. **Push to main**: Any push to the main branch triggers the workflow
2. **Automatic build**: GitHub Actions runs `npm run build`
3. **Deploy**: Built files are deployed to GitHub Pages
4. **Live**: Site is available at fractalmanifold.com

### Manual Deployment (if needed)

```bash
# Build the site
npm run build

# Commit and push changes
git add .
git commit -m "Update content"
git push origin main
```

## 📝 Content Guidelines

- **Language**: English
- **Tone**: Professional, tech-focused, emphasizing innovation
- **Contact**: contact@fractalmanifold.com

## 🤝 Contributing

This is a private corporate website. For internal contributors:

1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm run dev`
4. Build and verify with `npm run build && npm run preview`
5. Submit a pull request

## 📄 License

© 2025 Fractal Manifold. All rights reserved.

---

**Built with** ❤️ **using Astro**
