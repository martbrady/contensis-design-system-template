# Gov AI Design System

React + TypeScript + Vite + Storybook design system with Contensis CMS integration.

## Stack & Patterns
- **CSS**: Custom properties (design tokens) only — no hardcoded colours, spacing, font sizes, or radii
- **Tokens**: `src/styles/design-tokens.css`
- **Typography**: Use utility classes — never repeat individual type tokens in component CSS. Apply `type-{style}` for desktop, add `type-{style}--mobile` modifier for mobile. e.g. `className={\`type-heading-xxl\${device === 'mobile' ? ' type-heading-xxl--mobile' : ''}\`}`
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
- Bullet Text, Checkbox, Contact Panel, Divider, Icon, Icon Button, Numbered List, Panel, Radio, Select, Share, Table, TextField, Toggle

> **Promotion rule:** If a "without CMS models" component is used as nested content inside a registered component, promote it first — add it to the registry, add `REGISTRY_TO_DIR` in both scripts, run `generate:contensis` and `push:contensis` — then reference it via `componentRef` in the parent model. Never inline its fields on the parent.

## New Component Pipeline

When building a new component from Figma, follow every step in order:

### 1. Read Figma design context
Use `mcp__figma-desktop__get_design_context` to read the currently selected component.
Always call `mcp__figma-desktop__get_screenshot` immediately after.

**Requirements (must all be true):**
- Figma is open in **Dev Mode** with the target component selected
- `~/Library/Application Support/Claude/claude_desktop_config.json` has a `figma-desktop` entry using `mcp-remote` as a stdio bridge to `http://127.0.0.1:3845/sse`
- `~/.claude.json` has the worktree project entry with `"type": "http"` and `"url": "http://127.0.0.1:3845/mcp"`
- Claude desktop app has been **restarted** after any config changes

**If the tool is unavailable:** restart the Claude desktop app — this resolves it in almost all cases.
Never use Figma file URLs — current selection via MCP only.

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

**Story governance rules (apply to every story file):**
- Import shared helpers from `src/stories/helpers` — never use inline style objects in story files
- Define a `VariantConfig[]` array for what to render; include a `surface?: 'dark'` flag for variants that need a dark background wrapper
- Define a `GroupConfig[]` array for device/state combinations to preview
- Render via nested `.map()` — no manual component repetition
- New surface or layout wrappers go in `src/stories/helpers.tsx`, not inline in the story
- Icon `argTypes` options must only include icons that exist in the icon set (`src/assets/icons/`)

### 4. Add to Canvas page
Import and add to `src/page-examples/Canvas.stories.tsx`, passing `device={device}`.

### 5. Contensis content model
- Add entry to `src/content-models/registry.ts`
- Add `REGISTRY_TO_DIR` mapping in both `scripts/generate-contensis-models.ts` and `scripts/push-contensis-models.ts`
- Run `npm run generate:contensis`

### 6. Push to Contensis API
Run `npm run push:contensis`

### 7. Verify and ship
- `npm run build`
- Commit and `git push` (always push — keep deployed Storybook current)
- Create PR → merge to main
- Pull local main: `git -C /Users/martinbrady/Downloads/Claude/gov-ai pull origin main`

Skip steps 5-6 for components in the "Without CMS Models" list.

## Accessibility Rules
Apply these to every component at build time — not as retrofits.

> **Note:** Heading order violations on `Canvas.stories.tsx` and `ComposableLandingPage.stories.tsx` are expected and intentionally ignored — these are kitchen-sink demos, not real documents.

### Form fields (input, select, textarea)
- Always use `useId()` from React to generate a unique `id` per instance
- Always wire `<label htmlFor={id}>` + `<input id={id}>` — never leave them unlinked
- When `label` prop is optional, add `aria-label={placeholder}` on the input as fallback so the field always has an accessible name

### ARIA attribute references
- `aria-controls`, `aria-labelledby`, `aria-describedby` must point to an `id` that **actually exists in the rendered DOM**
- If the referenced element has no `id`, add one — a hardcoded string is fine for single-instance elements; use `useId()` for multi-instance

### ARIA roles on semantic elements
- Check allowed roles before adding `role` to a semantic element — many are restricted
- `role="button"` is **not** allowed on `<article>`, `<section>`, `<header>`, `<main>`, etc.
- For custom interactive elements use `<div role="button">` (or a native `<button>`)
- Any non-native interactive element (`div`/`span` with `role="button"`) also needs `tabIndex={0}` **and** an `onKeyDown` handler for Enter/Space

## CSS Gotchas
- `.icon` class sets `color: inherit` — components using Icon inside `<button>` need higher specificity for icon colour
- `<figure>` has default browser margin `1em 40px` — reset with `margin: var(--space-0)`
- `<blockquote>` has default margin-left ~40px — reset both `margin` and `padding`
- `<button>` doesn't inherit `color` — set `color: inherit` on button elements

## Workflow
- After committing, always `git push` without asking
- After merging every PR, pull local main: `git -C /Users/martinbrady/Downloads/Claude/gov-ai pull origin main`
- Storybook foundations: single story per page, table-based docs, inline styles with tokens
