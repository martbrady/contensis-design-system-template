# Vanilla Design System

React + TypeScript + Vite + Storybook design system with Contensis CMS integration.

## Stack & Patterns
- **CSS**: Custom properties (design tokens) only — no hardcoded colours, spacing, font sizes, or radii
- **Tokens**: `src/styles/design-tokens.css`
- **Dark theme**: `src/styles/theme-dark.css` (uses `[data-theme="dark"]` selector)
- **Naming**: BEM (`.component`, `.component__child`, `.component--modifier`)
- **Device prop**: All components accept `device?: 'desktop' | 'mobile'` with default `'desktop'`
- **Device styles**: `.component--desktop` / `.component--mobile` class modifiers

## Component File Structure
```
src/components/{ComponentName}/
  ├── {ComponentName}.tsx              # Component + Props interface
  ├── {ComponentName}.css              # BEM + design tokens
  ├── {ComponentName}.stories.tsx      # Default story + AllVariants
  ├── {ComponentName}.contensis.json   # Auto-generated (never hand-edit)
  └── index.ts                         # Barrel export
```

## Contensis CMS Integration

### Registry (`src/content-models/registry.ts`)
- Field names must be CMS-friendly: `title`, `text`, `image`, `label` — NOT React prop names like `children`
- Nested components use `componentRef` (e.g. `componentRef: 'Button'`)
- No Yes/No toggle fields — use `required: false` for optional fields
- No imageAlt fields — alt text is built into the Image toolbox type
- Linkable components need `link` (Entry) field for destination

### Valid Contensis Field Types
- **Text**: Short text, Long text, Rich text, Markdown, Canvas
- **Media**: Image, Multiple image, Asset
- **Links**: Entry (use `componentRef` for component references)
- **Choice**: Dropdown, Single choice, Multiple choice, Searchable dropdown
- **Data**: Number, Decimal, Date, Date and time
- **Contact**: Email address, Phone number, Website

### Scripts
- `npm run generate:contensis` — regenerate all `.contensis.json` from registry
- `npm run push:contensis` — push models to Contensis Management API (requires `.env`)
- Both scripts use `REGISTRY_TO_DIR` mapping — update both when adding/removing components

### Reserved Contensis IDs
`image` and `video` are built-in Contensis asset types. Our components use `imageBlock` and `videoBlock` via ID_OVERRIDES in the push script.

## Components Without CMS Models
These are presentational/form-level. They stay in the repo and Storybook but have NO registry entry, NO `.contensis.json`, and NO script mapping:
- Bullet Text, Checkbox, Contact Panel, Divider, Icon, Icon Button, Numbered List, Panel, Quote, Radio, Select, Share, Table, TextField, Toggle

## New Component Pipeline

When building a new component from Figma, follow every step in order:

### 1. Read Figma design context
Use `mcp__figma-desktop__get_design_context` to read the currently selected component.

### 2. Build React component
Create `src/components/{ComponentName}/`:
- `{ComponentName}.tsx` — typed props interface, component export
- `{ComponentName}.css` — BEM naming, design tokens only
- `index.ts` — barrel export
- Add export to `src/components/index.ts`

Rules:
- Use ONLY existing child components (Icon, Button, etc.) — never create new nested components
- Translate ALL Figma variant props into React props
- Always include `device?: 'desktop' | 'mobile'` prop defaulting to `'desktop'`

### 3. Create Storybook stories
- Meta with `tags: ['autodocs']`, argTypes for all props
- Default story with desktop args
- `AllVariants` story showing desktop and mobile side by side
- Add to alphabetical sort order in `.storybook/preview.tsx` storySort

### 4. Add to Canvas page
Import and add to `src/canvas/Canvas.stories.tsx`, passing `device={device}`.

### 5. Contensis content model
- Add entry to `src/content-models/registry.ts`
- Add `REGISTRY_TO_DIR` mapping in both `scripts/generate-contensis-models.ts` and `scripts/push-contensis-models.ts`
- Run `npm run generate:contensis`

### 6. Push to Contensis API
Run `npm run push:contensis`

### 7. Verify and ship
- `npm run build`
- Commit and `git push` (always push — keep deployed Storybook current)

Skip steps 5-6 for components in the "Without CMS Models" list.

## CSS Gotchas
- `.icon` class sets `color: inherit` — components using Icon inside `<button>` need higher specificity for icon colour
- `<figure>` has default browser margin `1em 40px` — reset with `margin: var(--space-0)`
- `<blockquote>` has default margin-left ~40px — reset both `margin` and `padding`
- `<button>` doesn't inherit `color` — set `color: inherit` on button elements

## Workflow
- After committing, always `git push` without asking
- Storybook foundations: single story per page, table-based docs, inline styles with tokens
