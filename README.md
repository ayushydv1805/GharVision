# GharVision 🏡

**Your home, imagined.** A thoughtful home-design workspace for planning, visualising, and personalising a dream home.

## Phase 1 — Foundation
- Responsive dashboard and navigation
- Light/dark appearance preference (saved locally)
- Project listing, search, and create-project flow
- Inspiration gallery and design-studio entry points
- Local browser persistence for projects and theme
- Vite + React foundation ready for later phases

> Floor planning, 3D rendering, AI room analysis, material calculations, authentication, and cloud sync are planned for later phases and are not yet active in Phase 1.

## Run locally
Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

The production-ready static bundle is generated in `dist/`.

## Deployment
- **Vercel:** import this GitHub repository; framework preset Vite, build command `npm run build`, output directory `dist`.
- **Render Static Site:** connect this repository; build command `npm install && npm run build`, publish directory `dist`.

## Stack
React, Vite, Lucide, custom CSS.
