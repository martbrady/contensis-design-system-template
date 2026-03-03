# Contensis Design System Template

A React + TypeScript + Vite + Storybook design system with Contensis CMS integration.

## Quick start

1. Use this as a GitHub template (click "Use this template")
2. Clone your new repo
3. `npm install`
4. Copy `.env.example` → `.env` and fill in your Contensis credentials
5. Add `CHROMATIC_PROJECT_TOKEN` as a GitHub Actions secret
6. Update `name` in `package.json`
7. Start building — see `CLAUDE.md` for the full component pipeline

## Scripts

| Command | Description |
|---|---|
| `npm run storybook` | Start Storybook locally |
| `npm run build` | Build the app |
| `npm run generate:contensis` | Regenerate `.contensis.json` from registry |
| `npm run push:contensis` | Push component models to Contensis |
| `npm run push:contensis:types` | Push content types to Contensis |

## Architecture

- **React 19 + TypeScript + Vite** — component library
- **Storybook 10** — hosted on Chromatic, auto-deploys on push to `main`
- **BEM + CSS custom properties** — design tokens in `src/styles/design-tokens.css`
- **Contensis CMS** — component models in `src/content-models/registry.ts`

## Adding a component

See `CLAUDE.md` for the full step-by-step pipeline:
1. Read Figma design context
2. Build React component (`src/components/{Name}/`)
3. Add Storybook stories
4. Add to Canvas page
5. Register content model and push to Contensis
