# CLAUDE.md

Instructions for the LLM coding assistant working on this repository. We use Claude (Claude Code, by Anthropic), which loads this file automatically at the start of every session.

## Project

The Bit Philology website: a static site built with SvelteKit and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

- Svelte 5 and SvelteKit 2, TypeScript, Vite 8
- `@sveltejs/adapter-static`: every route is prerendered (`export const prerender = true` in `src/routes/+layout.ts`) and the site is written to `build/`
- Tailwind CSS v4 through `@tailwindcss/vite`, with no plugins
- Fonts self-hosted with Fontsource
- Icons from `pixelarticons`
- Node 24 (LTS) and npm

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` | Builds the static site into `build/` |
| `npm run preview` | Serves the build locally |
| `npm run check` | Runs `svelte-kit sync` and `svelte-check` (types and Svelte diagnostics) |
| `npm run syncFromHedgeDoc` | Imports the missing pages from HedgeDoc (see [Content](#content)) |

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
- `tokens` holds `src/lib/styles/tokens.css`, the design tokens: the self-hosted fonts and the semantic colours. The repository is the source of truth: Figma's variables mirror these tokens, not the other way round.
- `custom` holds `src/lib/styles/custom.css`, hand-written overrides owned by the maintainer. Edit it only when explicitly asked.
- `src/content` is excluded from Tailwind's class detection (`@source not "./content"`).

Tailwind merges every `@theme` block into the `theme` layer, whichever file it sits in, and the last definition of a variable wins. `custom.css` is imported last, so the variables in its `@theme` block override both Tailwind's defaults and the tokens.

### Colors

- The primitives are Tailwind v4's default palette, in OKLCH. Never redefine them, and never reset a theme namespace (no `--color-*: initial` or similar).
- Semantic tokens point to Tailwind's variables, e.g. `var(--color-pink-500)`.
- In markup, use the design system's colors (the semantic tokens), not the raw palette.
- The semantic tokens live in the second `@theme` block of `tokens.css`. Each mirrors a variable of the `Colors` collection in Figma, with slashes turned into hyphens: `category/about/main` is `--color-category-about-main` (utilities `bg-category-about-main`, `text-category-about-main`, …).

| Figma variable | CSS variable | Tailwind colour |
| --- | --- | --- |
| `category/about/{lighter,main,darker}` | `--color-category-about-*` | teal-50, emerald-700, teal-900 |
| `category/event/{lighter,main,darker}` | `--color-category-event-*` | pink-50, pink-500, pink-800 |
| `category/publication/{lighter,main,darker}` | `--color-category-publication-*` | orange-100, orange-600, amber-800 |
| `category/artifact/{lighter,main,darker}` | `--color-category-artifact-*` | blue-50, cyan-600, sky-800 |
| `surface/light-background`, `surface/dark-background` | `--color-surface-*` | neutral-100, emerald-950 |
| `surface/white`, `surface/subtle` | `--color-surface-*` | white, neutral-50 |
| `text/neutral-on-light-bg`, `text/neutral-on-dark-bg` | `--color-text-*` | emerald-950, neutral-100 |

### Spacing and breakpoints

- Use Tailwind's defaults: the 4 px spacing scale and the default breakpoints.
- A Figma `spacing/N` variable is N × 4 px, i.e. Tailwind's spacing step `N` (e.g. `spacing/4` is `p-4`, 16 px).

### Fonts

Self-hosted with Fontsource, imported in `src/routes/+layout.svelte` and registered in the first `@theme` block of `tokens.css`:

- Mona Sans (`font-sans`, the default): `@fontsource-variable/mona-sans`, files `wght.css` and `wght-italic.css` (weight axis only). If the width axis is ever needed, switch to `standard.css` and `standard-italic.css`.
- JetBrains Mono (`font-mono`, for code): `@fontsource-variable/jetbrains-mono`, file `wght.css` (weight axis only).
- Bitcount Prop Single (`font-pixel`): `@fontsource-variable/bitcount-prop-single`, file `full.css` (all axes, custom ones included).

Never load fonts from Google Fonts or any other external service.

### Icons

The icons come from [pixelarticons](https://pixelarticons.com) (`pixelarticons` on npm): pixel-art icons on a 24×24 grid, in four styles (base, `-sharp`, `-solid`, `-glyph`). Render them with `src/lib/components/Icon.svelte`, passing the raw SVG:

```svelte
<script lang="ts">
	import bookOpen from 'pixelarticons/svg/book-open.svg?raw';
	import Icon from '$lib/components/Icon.svelte';
</script>

<Icon svg={bookOpen} class="size-12" />
<Icon svg={bookOpen} label="Read more" />
```

- Import each icon from `pixelarticons/svg/<name>.svg?raw` and name the variable after the icon in camelCase. Only the imported icons end up in the bundle.
- Icons take the current text color: color them with text utilities.
- Size them in multiples of 24 px to keep the pixels sharp: `size-6` (the default, 24 px), `size-12`, `size-18`, `size-24`.
- An icon without `label` is decorative and hidden from screen readers. Give it a `label` when it carries meaning on its own, such as an icon-only link.
- Never use `pixelarticons/react` or the webfont. npm installs `react` as a peer dependency of the package, but nothing imports it.

### Svelte components

- No `<style>` blocks in Svelte components: their CSS is outside the cascade layers, so it would beat Tailwind's utilities.
- Style with Tailwind utilities. If a component needs its own CSS, put it in a stylesheet in the `components` layer.

## Content

### Structure

The pages are Markdown files grouped by section, so that the folder tree mirrors the URLs:

```
src/content/
  hedgedoc-urls.txt           the HedgeDoc notes to import, one URL per line
  <section>/<slug>/index.md   a page
  <section>/<slug>/assets/    its images, linked as ./assets/<file>
```

- Sections: `events`, `publications`, `artifacts`, `about`, and `about/team` for the team cards.
- The files in `src/content` are data: the import script never touches `src/routes` or any other code.
- A page with `source:` in its front matter was imported from HedgeDoc. To change it, edit the note on HedgeDoc and re-import it with `--force`: local edits to an imported page are lost on re-import.
- A `.md` file without `source:` is hand-written. Never touch it, and neither does the script.
- Imported pages keep the note as it is, YAML comments included, even when they are not in English.

### Notes on HedgeDoc

The notes live on a HedgeDoc 1.x server, https://pad.dsl.unibe.ch, which may only be reachable from the University of Bern network. Every note has two URL forms:

- edit: `https://pad.dsl.unibe.ch/<id>` (raw Markdown on `/<id>/download`). `https://pad.dsl.unibe.ch/<id>` is the canonical source of a page.
- published: `https://pad.dsl.unibe.ch/s/<shortid>` (raw Markdown on `/s/<shortid>/download`); `/s/<shortid>/edit` redirects to `/<id>`.

Each note has a YAML front matter with `type`, `title`, `date` (`YYYY-MM-DD`), `venue`, `keywords`, `pinned`, `tags`, and optionally `subtitle`, `publication-type` and `slug`. The page title is the `title` field, not a `#` heading in the body.

**To choose the URL of a page, add `slug:` to the note's metadata on HedgeDoc.** Otherwise the slug comes from the title.

### Importing: `scripts/syncFromHedgeDoc.js`

Run it by hand; there is no GitHub Action. Pass options after `--`:

```sh
npm run syncFromHedgeDoc                                 # import the notes that are missing
npm run syncFromHedgeDoc -- --dry-run                    # show what would happen, write nothing
npm run syncFromHedgeDoc -- --force events/<slug>        # re-import one page (path relative to src/content)
```

For each URL in `src/content/hedgedoc-urls.txt` (empty lines and lines starting with `#` are ignored; both URL forms work, with or without `?edit`, `?view`, `?both` or `#fragment`), the script:

1. Finds the canonical note id; a published URL is followed through `/s/<shortid>/edit`.
2. Skips the note, without touching anything, if any `index.md` already has that `source:`.
3. Downloads the Markdown from `/<id>/download`.
4. Picks the section from `type` (lowercase, no spaces): `event` → `events`, `publication` → `publications`, `artifact` → `artifacts`, `about` → `about`, `team` → `about/team`. A missing or unknown type falls back to `about`, with a warning.
5. Computes the slug from `slug:` or else from the title: Markdown and accents removed, lowercase, only `a-z`, `0-9` and hyphens, cut at a hyphen around 60 characters. Without a title, it uses the note id.
6. Never overwrites: if `<section>/<slug>/index.md` exists with another source or without `source:`, it reports a conflict and moves on. A folder without `index.md` (such as `about/team`) is not a conflict.
7. Downloads every linked image, from HedgeDoc or elsewhere, into `assets/` and rewrites the links as `./assets/<file>`, keeping alt text and title. It handles `![alt](url "title")`, the HedgeDoc size syntax `url =WxH`, reference definitions `[id]: url` and `<img src="…">`, and ignores code. If an image fails, the original link stays and it is reported.
8. Adds `source:` (canonical URL) and `importedAt:` (ISO timestamp) to the front matter, keeping every other field, the comments and the formatting (it uses the `yaml` library, never regular expressions, for the front matter).
9. Writes `index.md`. The body stays identical apart from the image links (and a final newline).

`--force <path>` re-imports that page and replaces its `index.md` and `assets/`. If the note's type or slug changed, the page moves to the new place: the old `index.md` and `assets/` are deleted, and the old folder too if nothing else is left in it.

Requests time out (15 s for notes, 60 s for images). An error on one note does not stop the others, but if the server is unreachable the script stops and says so. At the end it prints the pages added, re-imported, skipped and in conflict, the errors, the images downloaded or failed, and the links to other HedgeDoc notes found in the text (not rewritten yet). The exit code is 1 if there were errors, conflicts or failed images.

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
