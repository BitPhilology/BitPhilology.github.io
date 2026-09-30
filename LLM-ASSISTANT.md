# LLM assistant instructions

Instructions for the LLM coding assistant working on this repository. We use Claude (Claude Code, by Anthropic): `.claude/CLAUDE.md` imports this file, so Claude Code loads it automatically at the start of every session. Other assistants can read it as it is.

## Project

The Bit Philology website: a static site built with SvelteKit and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

- Svelte 5 and SvelteKit 2, TypeScript, Vite 8
- `@sveltejs/adapter-static`: every route is prerendered (`export const prerender = true` in `src/routes/+layout.ts`) and the site is written to `build/`
- Tailwind CSS v4 through `@tailwindcss/vite`, with no plugins
- Fonts self-hosted with Fontsource
- Node 24 (LTS) and npm

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` | Builds the static site into `build/` |
| `npm run preview` | Serves the build locally |
| `npm run check` | Runs `svelte-kit sync` and `svelte-check` (types and Svelte diagnostics) |

## General rules

- Everything in the repository is written in English: code, comments, docs, commit messages and page copy.
- Git: never push.

## Design source: Figma

- File: https://www.figma.com/design/OOCuuEYo0V7Me2Z5p9uqs5/Bit-Philology-Website-PRO
- Figma is the source of truth for the design. Read it through the Figma MCP tools, read-only. Never modify the Figma file unless the maintainer explicitly asks for it.

## CSS architecture

`src/app.css` declares the cascade layers, from lowest to highest priority:

```
theme, base, tokens, components, custom, utilities
```

- `theme`, `base`, `components` and `utilities` are Tailwind's layers.
- `tokens` holds `src/lib/styles/tokens.css`, generated from the Figma tokens. Never edit it by hand: regenerate it.
- `custom` holds `src/lib/styles/custom.css`, hand-written overrides owned by the maintainer. Edit it only when explicitly asked.
- `src/content` is excluded from Tailwind's class detection (`@source not "./content"`).

Tailwind merges every `@theme` block into the `theme` layer, whichever file it sits in, and the last definition of a variable wins. `custom.css` is imported last, so the variables in its `@theme` block override both Tailwind's defaults and the tokens.

### Colors

- The primitives are Tailwind v4's default palette, in OKLCH. Never redefine them, and never reset a theme namespace (no `--color-*: initial` or similar).
- Semantic tokens point to Tailwind's variables, e.g. `var(--color-pink-500)`.
- In markup, use the design system's colors (the semantic tokens), not the raw palette.

### Spacing and breakpoints

- Use Tailwind's defaults: the 4 px spacing scale and the default breakpoints.
- A Figma `spacing/N` variable is N × 4 px, i.e. Tailwind's spacing step `N` (e.g. `spacing/4` is `p-4`, 16 px).

### Fonts

Self-hosted with Fontsource, imported in `src/routes/+layout.svelte` and registered in the `@theme` block of `custom.css`:

- Mona Sans (`font-sans`, the default): `@fontsource-variable/mona-sans`, files `wght.css` and `wght-italic.css` (weight axis only). If the width axis is ever needed, switch to `standard.css` and `standard-italic.css`.
- Bitcount Prop Single (`font-pixel`): `@fontsource-variable/bitcount-prop-single`, file `full.css` (all axes, custom ones included).

Never load fonts from Google Fonts or any other external service.

### Svelte components

- No `<style>` blocks in Svelte components: their CSS is outside the cascade layers, so it would beat Tailwind's utilities.
- Style with Tailwind utilities. If a component needs its own CSS, put it in a stylesheet in the `components` layer.

## Content

- Each page is a Markdown file, `src/content/<slug>/index.md`, with its images in `src/content/<slug>/assets/`.
- The pages come from HedgeDoc through a `syncFromHedgeDoc` script (not written yet). It only adds the pages that are missing; it never overwrites existing ones.

## Svelte

- Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`). Runes mode is forced in `svelte.config.js`, so do not use the legacy syntax (`export let`, `$:`, `on:click`).
- Use the Svelte MCP server, configured in `.mcp.json`, as described below.

### Svelte MCP server

The official instructions from https://svelte.dev/docs/ai/instructions:

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

#### Available Svelte MCP Tools:

##### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

##### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

##### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

##### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
