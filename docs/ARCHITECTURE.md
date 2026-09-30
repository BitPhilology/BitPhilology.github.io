# Architecture

How the site turns the Markdown files of `src/content` into pages. Read `CLAUDE.md` first for the stack, the CSS layers, the tokens and the import script; this file covers the code in `src/lib` and `src/routes`.

## From content to page

```
src/content/**/index.md
  └─ src/lib/server/content.ts        reads and parses every file at build time
       ├─ posts    ─ src/lib/content/posts.ts     front matter → Post
       │    └─ src/lib/server/markdown.ts         body → lead, segments (HTML and embeds)
       └─ fillers  ─ src/lib/content/fillers.ts   front matter + body → ImageFillerContent (validated)
            └─ src/lib/config/home.ts             the Home tile rule
                 └─ src/routes/*/+page.server.ts  thin loaders
                      └─ src/lib/templates/*      page templates
                           └─ src/lib/components/{ui,content,layout}
```

- Parsing runs only on the server (`src/lib/server`), so the YAML library and the Markdown never reach the browser. Every route is prerendered.
- Routes stay thin: a loader calls one function, a page renders one template.
- Logic lives in `.ts` modules; components only lay out what they receive.

## Folders

| Folder | Holds |
| --- | --- |
| `src/lib/categories.ts` | The category registry (see below) |
| `src/lib/embeds.ts` | The embed registry: the `{{…}}` markers of markdown bodies (see below) |
| `src/lib/content/` | The content model (`types.ts`) and pure helpers: `fields.ts`, `markdown.ts`, `markers.ts`, `dates.ts`, `posts.ts`, `fillers.ts`, `team.ts` (member lists, `memberSize`) |
| `src/lib/server/content.ts` | The loader: `getPosts`, `getPost`, `getPage`, `getFillers`, `getSheets` |
| `src/lib/server/markdown.ts` | The body renderer (unified: remark, then rehype), build time only |
| `src/lib/config/` | Site rules as data: `home.ts` (tile order), `footer.ts` (colophon and partners) |
| `src/lib/navigation/` | `activeCategory.ts` (the category of the current page), `scrollDirection.ts` (dock compaction) |
| `src/lib/styles/` | `tokens.css`, `custom.css`, `components.css` (theming, focus ring, dither), `text.ts` (text styles) and `markdown.ts` (classes of the rendered markdown) |
| `src/lib/components/ui/` | Generic building blocks: `Tile`, `Pill`, `IconLabel`, `ImagePanel`, `Dither` |
| `src/lib/components/content/` | Blocks that show content: `PostCard`, `PostHeader`, `PostMeta`, `PostBody`, `PublicationBody`, `CategorySignifier`, `CategoryTheme`, `ImageFiller`, `Colophon`, `PartnerLogo`; for post pages `PostMetaRow`, `PageHeader`, `MarkdownBody`, `TeamMember`, `MemberList` |
| `src/lib/components/layout/` | Page structure: `Container`, `TileGrid`, `PageShell`, `Footer`, `TopStroke`, `NavDock`, `NavDockItem`, `PageSheet` |
| `src/lib/templates/` | `HomeTemplate`, `PostTemplate`, `TeamTemplate`, and `templates.ts` (the template of each post type) |
| `src/routes/` | `+layout.*` (fonts, theme, top stroke, dock), `+page.*` (Home), `[...path]/` (one page per post) |

## Content model

A post is `src/content/<section>/<slug>/index.md`; its URL is its folder, e.g. `/events/<slug>`. The `[...path]` route prerenders one page per post (`entries` lists them). Home image fillers have no page.

Front matter read by `toPost` (`src/lib/content/posts.ts`):

| Field | Type | Used for |
| --- | --- | --- |
| `type` | `about`, `team`, `event`, `publication`, `artifact` | Category and card layout. Unknown or missing → `about`, as in the import script |
| `title` | string, may hold Markdown | Card and page title, shown as plain text. Falls back to the folder path |
| `subtitle` | string | Event cards, post header |
| `date` | `YYYY-MM-DD` or `YYYY` | Order; event pill (`08.05.26`), publication pill (year) |
| `pinned` | boolean | Pinned posts come first on Home |
| `excerpt` | string | Card text; otherwise the first paragraph of the body |
| `venue`, `location` | string | Event pill (`location`, else `venue`) |
| `authors` | string | Publication and artifact cards |
| `publication-type` | string | Publication pill |
| `kind`, `keywords` | string, list | Artifact pills |

Other fields (`tags`, `source`, `importedAt`, …) are kept in the file and ignored by the site, except the fields that embeds read (see [Markdown bodies and embeds](#markdown-bodies-and-embeds)).

The Team page is the one file with `type: team`, `src/content/about/team/index.md` (URL `/about/team`). Its front matter holds two lists, `members` and `advisory_board`, whose entries have `name` and `role` (both required: the build fails without them), `affiliation`, `photo` and `externalURL` (the member's page, linked from the name). The import script downloads the `photo` files into the page's `assets/` and writes `./assets/<file>`; `getPage` turns that path into the built URL. Placeholder images (`https://picsum.photos/…`) stay remote.

A Home image filler (`type: home-image-filler`) is validated at build time by `toFiller`; the build fails, naming the file, when `accent` is not `about`, `event`, `publication` or `artifact`, when `position` is not a whole number from 1 up, or when the body is not exactly one `![alt](url "caption")` image with a non-empty alt text.

## The Home tile rule

`src/lib/config/home.ts` is the only place that decides the order of the Home grid:

1. the posts, pinned first, then newest first;
2. the image fillers, inserted at `position`, the 1-based index in the final grid. Position 1 is the first tile, which holds the logo filler; a position past the end puts the filler last;
3. the footer tiles (colophon, partner logos), in the same grid.

The logo is content, not code: it is the image filler at position 1. The build fails when two fillers share a position. Fix the note on HedgeDoc and re-import it with `--force`.

## Post pages

`getPage(path)` returns a `PostPage`: the post and its rendered body. The `[...path]` route passes it to the template of the post type (`templateFor` in `src/lib/templates/templates.ts`: `team` has `TeamTemplate`, the other types `PostTemplate`).

Every post page is built on `PageShell` (`src/lib/components/layout/PageShell.svelte`), the grid of the Figma page frames, with the post's category theme:

|  | columns | meta row | header, body | notes |
| --- | --- | --- | --- | --- |
| base, `sm` | 1 | in order | in order | after the body |
| `lg` | 3 | cols 1–3 | cols 1–2 | col 3 |
| `xl` | 4 | cols 1–4 | cols 2–3 | col 4 |

The shell always renders the meta row (`PostMetaRow`: category signifier, a line from `lg`, and the pills that the registry gives as `page.pills`) and the header (`PageHeader`: the page's only `h1`, `heading/h1` on phones and `display/page-title` from `sm`, then the lead paragraph). The template passes the body as children and, when it has them, a `notes` snippet. The footer tiles follow in a `TileGrid`.

The Team page:

```
TeamTemplate
└─ PageShell (CategoryTheme about, Container, grid)
   ├─ PostMetaRow                  CategorySignifier, line, Pill…
   ├─ PageHeader                   h1, lead paragraph
   ├─ MarkdownBody                 segments, in the editor's order
   │  ├─ HTML                      paragraphs, headings…
   │  └─ MemberList ({{team}}, {{advisory-board}})
   │     └─ TeamMember…            size = memberSize(role)
   └─ TileGrid › Footer            Colophon, PartnerLogo…
```

**Team Member size.** `memberSize(role)` in `src/lib/content/team.ts` is the only place that picks the size, from the role and not from the list: `Principal Investigator` is `large` (120 px photo), `Advisory Board Member` is `small` (60 px), every other role is `medium` (96 px). Roles are matched without regard to case. `TeamMember` takes a typed `size` prop, like the Figma `Size` property.

**A new page template** (e.g. for Events): add `XTemplate.svelte` in `src/lib/templates/`, build it on `PageShell` with `MarkdownBody` as the body and, if the frames have them, `notes`, and list it in `templates.ts`. New pills for the meta row go in the type's `page.pills` in `categories.ts`.

## Markdown bodies and embeds

`renderBody` (`src/lib/server/markdown.ts`) renders a body at build time with unified: `remark-parse` and `remark-gfm` read the markdown, `remark-rehype` turns it into HTML (dropping raw HTML), `rehype-slug` gives the headings ids, so that links can point to a section. There is no mdsvex: the HTML is plain data, injected by `MarkdownBody` with `{@html}`. Links and images with unsafe URL schemes are dropped, and the classes of `src/lib/styles/markdown.ts` are added to the elements. It returns:

- `lead`: the first paragraph, shown by `PageHeader`, unless it starts with `[no-lead]` (the marker is removed and the paragraph stays in the body);
- `segments`: the body, in order, as HTML segments and embed segments.

**Markers.** A marker is `{{name}}`, spaces inside the braces allowed, alone in its paragraph (a blank line before and after). The markers are handled on the markdown tree, before any HTML exists: a marker paragraph becomes a placeholder, and the HTML is cut there into segments. Editors move a marker above or below any paragraph or heading to move its embed. The build fails, naming the file, for a marker that is not in the registry, a marker used twice, a marker inside other text, a list or a quote, and a marker whose front matter field is missing. A front matter list without its marker is not shown, with a warning in the build output. Markers in code (`` `{{team}}` ``) are text.

**The embed registry** is `EMBEDS` in `src/lib/embeds.ts`: each marker name gives the front matter field, a `parse` function that validates it at build time, and the component that renders it, which receives the parsed value as `data`. `{{team}}` renders `members` and `{{advisory-board}}` renders `advisory_board`, both with `MemberList`. To add an embed, add one entry (and, if needed, its parser and component).

## Categories and theming

`src/lib/categories.ts` is the one list of content types and dock entries. Each entry gives a label, a pixelarticons icon, a route, a colour category, a dock label and whether the dock item opens a page sheet; post types also describe their card (layout, fade, description line, pills). `team` shares the `about` category. Components read these fields and never branch on a category name: to change how a category behaves, add a field to its entry.

Colours follow the category through CSS variables, never through generated class names:

- `<CategoryTheme category="…">` sets `data-category` on a wrapper.
- `src/lib/styles/components.css` maps each `[data-category]` to three variables, `--cat-lighter`, `--cat-main` and `--cat-darker`, which point to the semantic tokens of `tokens.css` (`home` uses the neutral surface and text tokens).
- Components use `bg-(--cat-lighter)`, `text-(--cat-darker)` and similar. Never build a Tailwind class from a string (`bg-category-${name}-main`): Tailwind cannot see it.

The root layout themes the whole page with the active category (`activeCategory()`): on a post page, the post's `type` from its load data; elsewhere, the entry whose route is the longest prefix of the URL; Home otherwise. In development a mismatch between the two is logged.

## Layout

- `Container` is the page width: 16 px padding, full width below `sm`, then capped at the width of the last breakpoint reached (`sm` 640, `lg` 1024, `xl` 1280). Between two breakpoints the layout of the smaller one stays, as in the four Figma frames. Tailwind's `container` class is not used: it also stops at `md` and `2xl`.
- `TileGrid` is the square-tile grid: 1, 2, 3 and 4 columns at base, `sm`, `lg` and `xl`, with a 16 px gap. `Tile` gives each cell its square shape, surface and padding.
- The dock is fixed to the bottom; the root layout adds `pb-16` so the end of the page stays clear of it.

## Navigation dock

`NavDock` renders one `NavDockItem` per dock entry and owns the open page sheet.

- Styles by breakpoint only: phone (icon over label) below `lg`, wide (icon beside label) from `lg`. Below `lg` it turns compact (icons only, 48 px) while the page scrolls down, and back on scroll up; the transition is `motion-safe` only.
- The active item has the category tint and a dithered cap over the whole cell, and carries `aria-current="page"`. The top stroke (`TopStroke`) is the same dither at the top of the page, neutral on Home.
- Home is a link. The other items are buttons (`aria-expanded`, `aria-controls`) that open a `PageSheet`: the list of all posts of the category (`getSheets`), full width above the dock on phones, a popover above the item from `lg`. The sheet is a non-modal dialog that takes the focus on open; Escape, the close button, a click outside or a navigation close it, and the focus goes back to the item.

## Conventions

- Every component starts with a comment that says what it is and, when it has one, which Figma component it implements. Keep components short; move logic into `.ts` modules.
- No `<style>` blocks. Component CSS that utilities cannot express goes in `src/lib/styles/components.css`.
- Text styles come from `TEXT` in `src/lib/styles/text.ts`, named after the Figma text styles (`TEXT['heading/h1']`).
- Colours only through semantic tokens or `--cat-*`; spacing and breakpoints are Tailwind's defaults.

## Common changes

- **Change the Home order**: edit `composeHomeTiles` in `src/lib/config/home.ts`.
- **Add a front matter field**: add it to `Post` in `src/lib/content/types.ts` and read it in `toPost`.
- **Change a card's pills or description line**: edit the `card` of the post type in `src/lib/categories.ts`.
- **Add an embed**: add an entry to `EMBEDS` in `src/lib/embeds.ts`.
- **Change which roles get which Team Member size**: edit `SIZE_BY_ROLE` in `src/lib/content/team.ts`.
- **Style an element of the rendered markdown**: edit `MARKDOWN_CLASSES` in `src/lib/styles/markdown.ts`.
- **Add a category**: add its colour tokens to `tokens.css`, its `[data-category]` block to `components.css`, and its entry to `categories.ts` (and to the `type` mapping of `scripts/syncFromHedgeDoc.js`).
