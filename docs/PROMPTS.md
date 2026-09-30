# Import from Penpot to figma

This is what you have to do:

Read from the open Penpot file
- Identify Fundamental elements of visual identity and DLS
- Identify fundamental components
- Copy them into the Figma file in the current page (that becomes "Components")

---

Then:
- I added the real logo as a component, please use it across the other components
- Team Member photos: I will embed an image in the components
- I removed the hello claude text.

Please align the elements on the components page in a professional way.

---

Clone in Figma the "Breakpoints" page you can find in Penpot

---

Relying on the penpot file, create the home page design for the breakpoints where the board name begins with V. Create a page "Home" where you put those designs, but do not alter the boards in breakpoints.

-> Not found because Claude relied on memory of a previously version of the file where layers were not renamed with the letter V

---

The navigation component as it is, is not working for mobile and small screen.

It takes too much space at the top on both 375 and 640.

On 1024 it could work, but I find it strange that the side notes are on the left instead that on the right.

On 1280 I like it very much ho the page is organized in the grid, but I don't like very much the way in which the comopnent works. 

Basically I like it only in the home page.

Furthermore, the buttons for categories can be confused with the blocks that indicates the post category in each page, just above the title.

Use three agents to design better solutions for the navigation. The first agent is conservative, and works to identify the most funtional solution. The second agent is visuals driven and attempts at valorizing the visual identity of the website. The third is generally creative and think about solutions that resemble the old operating systems of early 2000s. Every agent develops 3 solutions, that you place in a separate page called "Navigation proposals". Then agents run a design critique on each others results to establish which are the most meaningful aspects of each proposals. You collect this outcome to design a conclusive proposal in the same page.


---

THen I was alone at the office and I started with vocal prompots

---

So um, don't like very much uh, the final solution. I want to say that I like very much the number B two, uh, in which we have uh, a navigation bar at the bottom, um, uh, I'm wondering if it is possible to have something that uh, remains uh, in the form of a navigation bar at the bottom in every breakpoint, so even in larger screens, and uh, um, don't take up uh, any column in the uh, 1024 and uh, 1280 breakpoints um, in B2 I don't really like the um, upper bar with a bit philology written um, try to see if you can think about something that uh, resemble more uh, the logo um, although I have to say that I like uh, very much uh, um, the um, the dithered uh, uh, upper um, stroke that you can see in the scrolled header header hidden doc compact um, screen from um, A2 and also from uh, kind of C1 but mostly A2 I like that when you click on a category the pages corresponding to that category appears stacked on top of the lower bar menu bar um, can you also reproduce something similar to that in a newer version thank

All right, not bad. I just don't like the uh, logo that you put on top of the page. I think it's um, somehow ugly positioned. And um, um, it doesn't really pay respect of the to the um, logo in itself, in the sense that it's not uh, valued. Um, can we just leave the border that you have put in the second screen with the header that is hidden? Can we just have that one on every page?

All right, great. Um, I think I like it. So now I would like you to apply that solution to um, the variants, the breakpoints variants that you have in the home and in the page template pages. Um, in there, the first block currently is the navigation. So I want you to remove that and replace it with um, uh, image placeholder block. That uh, uh, it will use as a first block the logo as an image. And in this way, we will bring it back uh, into our homepage.

I opened the prototype in Figma and I've noticed that the, the bar correctly sits at the bottom of the iPhone uh, 13 mini device. However, it scrolls up. Can you make it that it, uh, it is uh, fixed on the bottom of the page?

I uploaded in the file the uh, images that I've used in PenPod to create the blocks for images in the home page. I would like you to add those images in the way you know in the same way in which they appear on PenPod and to add them to the different um, boards of the Figma file. Uh, it's up to you if you want to create components that then reappear exactly as they are in the board and if components are variants of um, the image uh, filler block or whatever, you can decide what is the most efficient and convenient solution from uh, the perspective of the Figma design file.

Yeah, I forgot to tell you that I like uh, the final version of the navigation that you have produced. And I would like you to apply it to the whole project and to bring uh, components uh, into the components page and uh, Yeah, let's start with this and maybe later we will delete what you have done before as a attempt to identify the better design.

All right, I'm looking at how you have uh, positioned it across the design and I like it. Although there are a little bit of imprecisions in the way you positioned the editor and stroke. Um, for example, uh, if you go in the uh, page template, uh, the editor and stroke that is green and is uh, upon the about uh, section, is kind of uh, um, mispositioned. Um, in that uh, it leaves a um, empty space on the right side of the button however i think i like it um for the um, page template at 1024 pixel um i like it uh, but uh, the uh, the notes uh, and the image caption are mispositioned and also i think we miss the background which i think you can uh, double check with uh, the the pen pot file now it's white maybe i made it uh, white for mistake so please restore it and also like if you look at the button um the footer has a, a four blocks um and it's kind of a problem here but yeah let's deal with this later and then let's look at the page template uh, uh, 1280 pixel width um there is something wrong here uh, in the sense that the layout uh, um, doesn't use the space in an optimal way. Uh, it should leave like a, an empty column on the left. And uh, the content as in PenPot should stay on the three columns on the right. What can we put in the first uh, um, column? Maybe uh, I don't know. Can you can you make a proposal? that uh, is not too leave that empty

It seems that Figma has now the grid layout. Why don't you implement all the website uh, variations using the grid layout instead of the flex layout? Is there a reason why you haven't done it so far?

Very good. Um, look that I have now changed a bit how the caption appears. On the page template, uh, 100 and 280 pixel width, in the sense that is aligned uh, towards the bottom of the image. So I'll try to apply the same thing to all the other layouts when possible. And also I changed where the not to and not three appears in the text. So please align the notes to the same row as you correctly described before.

Replace images placeholders in the Template Page with a proper component that is added in the Components page. Look on penpot to see how it appears and notice that it uses a layered colour derived from the category of the page. I also put in the components page an image that you can use as an example.

---

Write a prompt for a separate session of Claude Code in VS Code the um, foundations of the design language systems. Uh, do not include the logo and do not include the icons because I will deal with them um, separately. Just include the colors and the typography. Bear in mind that all colors are derived and must be linked to the Tailwind color palette. So it's just a different way to call the variables and I want the variables that we add to be linked to the original uh, Tailwind palette. For typography, similarly, um, I want you to use um, all the Tailwind tokens which means that uh, you need to try to match Uh, with uh, um, existing conventions and classes for line height, font size, um, font weight, uh, um, line height, and all the other things. Ideally, you should not write um, any new type of um, any sorry any absolute value for font size and all the other things, right? Um, the type of font, so the main font and then the font used for um, uh, sorry, the, the monospace font and the font used for the meta, that is the pixelated font, have to be um, overwritten on the tailwind specification in a in a custom uh, CSS file that is available in the repository. Uh, I think that everything is clear if Claude Code reads the Claude.md file.

* I want that we select the most similar values already existing among the tailwind utilities

# PROMPT

`````
# Task: import the design-language-system foundations (colours + typography) from this repository into Figma

Read `CLAUDE.md` first and follow it. It tells you where the Tailwind theme and the custom CSS file (font overrides) live. This task covers **only colours and typography**. **Do not** touch the logo or the icons; they are handled separately.

## Figma target
- File key: `OOCuuEYo0V7Me2Z5p9uqs5` ("Bit Philology Website PRO"). Use the Figma MCP tools (`use_figma`, `get_screenshot`). Load the `figma:figma-use` skill before the first `use_figma` call and pass `skillNames: "figma-use"` on every call.
- The file already has the collections `Colors` (semantic colours) and `Dimensions`, and 27 text styles (for example `heading/h1`, `body/body`, `pixel/metadata`). Inspect them first. **Update them in place** and keep their names, so existing designs keep working. Do not create duplicates.

## Principle
The design system is Tailwind. Figma is another way of naming it. The repository is the single source of truth.
- **Never create a value Tailwind does not already define.** For every property, take the **nearest existing Tailwind token** from the repo's Tailwind version: colour, font size, font weight, line height, letter spacing.
- The only values that are not stock Tailwind are the three font families, which come from the custom CSS file.
- Do not add a Tailwind palette collection to Figma. Do not add tokens to the Tailwind theme.

## 1. Colours
1. In the repo, read the Tailwind theme and the custom CSS file. Semantic colours should be CSS variables that reference Tailwind colours, for example:
   `--color-category-about-main: var(--color-emerald-700);`
   If they do not exist yet, propose them in the custom CSS file first and **wait for my confirmation** before writing anything.
2. In Figma, update the existing variables in the `Colors` collection (keep names, single mode). For each variable:
   - set its value to the exact colour resolved from the repo's Tailwind palette (not from memory);
   - set the web code syntax to the matching CSS variable: `variable.setVariableCodeSyntax('WEB', 'var(--color-…)')`;
   - put the Tailwind name in the description (for example "emerald-700").
3. Current intended mapping (verify against the repo and report differences):
   - `category/about/{lighter,main,darker}` → teal-50, emerald-700, teal-900
   - `category/event/{lighter,main,darker}` → pink-50, pink-500, pink-800
   - `category/publication/{lighter,main,darker}` → orange-100, orange-600, amber-800
   - `category/artifact/{lighter,main,darker}` → blue-50, cyan-600, sky-800
   - `surface/light-background` → neutral-100; `surface/dark-background` → emerald-950
   - `surface/white` → white; `surface/subtle` → neutral-50
   - `text/neutral-on-light-bg` → emerald-950; `text/neutral-on-dark-bg` → neutral-100
4. Keep `scopes` set correctly on every variable (colour scopes only, never `ALL_SCOPES`).

## 2. Typography
1. In Figma, create variables for the Tailwind type scale used by the styles, with values taken from the repo's Tailwind version (convert rem using the repo's root size): font size (`text-xs … text-9xl`), font weight (`thin … black`), line height (`leading-none, tight, snug, normal, relaxed, loose`), letter spacing (`tracking-tighter … widest`). Name them after the Tailwind classes. Set the matching scopes (`FONT_SIZE`, `FONT_WEIGHT`, `LINE_HEIGHT`, `LETTER_SPACING`) and the web code syntax (the Tailwind class or CSS variable).
2. Create three **font-family** variables (`FONT_FAMILY` scope) from the **custom CSS file**, which overrides Tailwind here:
   - main text → the `font-sans` override (Mona Sans)
   - monospace → the `font-mono` override (JetBrains Mono)
   - pixel / metadata → the custom pixel family (Bitcount Prop Single)
   Take the values from the CSS file; do not hard-code them.
3. Re-link the 27 existing text styles. Bind each style's **font family, size, weight, line height and letter spacing** to those variables (`textStyle.setBoundVariable(...)`). Load each font before binding. Intended mapping (verify against the repo):
   - `display/page-title` → text-7xl, extralight, leading-none, tracking-tighter
   - `heading/h1` → text-3xl, bold, leading-tight · `h2` → text-2xl, bold, leading-tight · `h3` → text-xl, semibold, leading-tight
   - `h4` → text-lg, semibold, leading-snug · `h5` → text-base, semibold, leading-snug · `h6` → text-sm, bold, leading-snug
   - `body/lead-paragraph` → text-2xl, light · `body/body` → text-base, medium · `body/body-lg` → text-lg, semibold · `body/strong` → text-base, bold
   - `body/link`, `body/del`, `body/italic` (Instrument Sans Medium Italic), `body/name-link` (text-2xl, medium, leading-tight), `body/blockquote` (text-xl, light, leading-snug)
   - `table/table-header` → text-sm, semibold; `table/table-cell` → text-sm, normal; both leading-snug
   - `card/title` → text-xl, extrabold · `card/subtitle` → text-base, semibold · `card/authors` → text-base, medium · `card/venue` → text-xs, semibold
   - `code/code` → text-sm, medium, leading-normal; `code/code-block` → text-sm, normal, leading-relaxed (mono family)
   - `pixel/metadata`, `pixel/caption`, `pixel/note` → text-xs (pixel family); caption and note use tracking-wide and leading-tight

## Matching rule
For every property, choose the **nearest existing Tailwind utility**, bind it, and do not keep the old absolute value. Known cases:
- line height 1.2 (`body`, `body-lg`, `strong`, `link`, `del`, `italic`, `card/authors`, `card/venue`, `pixel/metadata`) → `leading-tight` (1.25)
- line height 1.4 (`body/lead-paragraph`) → `leading-snug` (1.375)
- `card/title` line height 0.9 → `leading-none` (1); tracking −0.4 px → `tracking-tight`
- `card/subtitle` line height 1 → `leading-none` (exact)
- `pixel/note` 11 px → `text-xs` (12 px)
If two styles become identical (for example `pixel/note` and `pixel/caption`), keep both, list them, and do not merge or delete.

## Constraints
- Do not delete or rename existing variables, styles or components. Do not modify frames on the Home, Page Template, Breakpoints or Navigation proposals pages.
- Colours and typography only. No logo, no icons.
- Work in small, re-runnable `use_figma` calls. Return the IDs you change or create.
- Afterwards take a screenshot of the Typography sheet (Components page) and of one Home frame, and check for text that reflowed or was clipped. Line height 1.2 → 1.25 adds about 1 px per line, and this can affect fixed-height pills and cards.

## Report (max 300 words)
1. Number of colour variables updated and type variables created; 2. text styles re-linked; 3. a table of every property that changed: style, old value, Tailwind token, difference; 4. styles that became identical; 5. any difference between the names in `CLAUDE.md` / the CSS and the names currently in Figma; 6. any text that reflowed, was clipped, or looked wrong in the screenshots.
`````

---

write a prompt for a separate Claude Code session that uses the Figma design file to learn how to develop um, the homepage of uh, the website that is developed in Svelte. Um, while developing the homepage, of course, you need to take into account that we have in separate files and um, if uh, Claude Code consults the Claude.md file it will know that we have token CSS file where we have colors, typography and other things and uh, we have to create components deriving them from the blocks that we can find in the um, components page on Figma. And also we have uh, the navigation bar that is at the bottom that needs to be um, created as a component that is used in every page and then reacts uh, to the URL or to the um, to the data of the page in itself to decide which is the uh, currently um, active category.

# PROMPT

``````
# Task: build the Home page of the website in SvelteKit from the Figma design

Read `CLAUDE.md` first and follow it. It says where the **design-token CSS file** lives (colours, typography, spacing, font overrides on top of Tailwind) and what the project conventions are. Tailwind is installed and the project is scaffolded with SvelteKit. **Use the tokens. Do not hard-code colours, font sizes, line heights, radii or spacing.** If a value you need has no token, use the nearest Tailwind utility and mention it in your report.

Scope: the **Home page**, the **shared components** it needs, and the **bottom navigation dock**, which is reused on every page. The category pages (About, Team, Events, Artifacts, Publications) come later, but build the components so they can be reused there.

## 1. Learn from the Figma file
- File key: `OOCuuEYo0V7Me2Z5p9uqs5` ("Bit Philology Website PRO"). Use the Figma MCP tools (`get_design_context`, `get_screenshot`, `get_metadata`, `get_variable_defs`). Load the `figma:figma-design-to-code` skill before `get_design_context`, and follow it.
- **Page `Home`** has four frames: `Home · 375`, `Home · 640`, `Home · 1024`, `Home · 1280`. They are the **Tailwind breakpoints** (base, `sm`, `lg`, `xl`), each with its own layout: a grid of square tiles with **1, 2, 3 and 4 columns**, 16 px gaps and 16 px padding. Implement exactly these four layouts with Tailwind's breakpoint utilities. The layout **changes only at the breakpoints** and is not fluid in between: between two breakpoints the page keeps the layout of the smaller one.
- **Page `Components`** is the design system. Build Svelte components from these groups: `Post` (variants About, Artifact, Event, Publication, Team), `Pill`, `Category Signifier`, `Image Filler` (floppy, disk, folder, magnetic, logo), `Colophon`, `Partner Logo`, `Footer`, and the **Navigation** group (`Navigation Dock`, `Top Stroke`, `Page Sheet`). Also look at `Post Header`, `Image Container` and `Team Member`, so the components are ready for the category pages.
- **Ignore** the old `Navigation` component and the whole `Navigation proposals` page; they are superseded by the dock.
- The logo and the icons are handled separately. Look for them in the repo (see `CLAUDE.md`). If they are not there yet, use clearly named placeholders and list them in the report.
- Take screenshots of each frame and compare your result with them at 375, 640, 1024 and 1280 px.

## 2. Content model
- Content is **markdown files in the repository**. The front matter field **`type`** says what a file is: `about` (the fallback), `artifact`, `publication`, `event`, `team`, `home-image-filler`. For the dock, the stacked sheet and the colours, **`team` counts as `about`**.
- Inspect the existing content and front matter first. Extend the schema only as far as the Home cards need, and document it: title, type, date, short description/excerpt, plus per type whatever the cards show (publications: authors, venue, year, publication type; events: date, location; artifacts: keywords, kind).
- Write a small typed loader that reads all markdown files at build time (for example `import.meta.glob` or a server `load` function).
- The Home tiles come from that data. Figma shows a fixed sample, so implement this rule and keep it in one config file: the **logo tile first**, then the posts by date (latest first), with the **image fillers inserted at their `position`**, then the colophon and partner-logo tiles last.
- **Image fillers are content too.** Each filler is its own markdown file with `type: home-image-filler` and no other body than **exactly one standard markdown image**: `![alt text](https://… "optional caption")`. Remote images are localised by the mechanism already used for the other markdown files (find it in the repo and `CLAUDE.md`; reuse it, do not write a second one). The loader reads the image path and alt text from the parsed markdown and ignores the title. Front matter: `accent` (`about|event|publication|artifact`, selecting the panel colour of the duotone effect) and `position` (1-based index in the final Home grid, counted after the fixed logo tile; reject duplicates and position 1). The effect is a Screen blend over the accent colour and expects dark line art on a light background. Exclude this type everywhere except the Home grid: no route or detail page, not in the dock sheet, category lists, search, RSS or sitemap. Validate at build time that each filler has one image, a non-empty alt text and a valid `accent`, and fail with a clear error otherwise. The logo tile is not content; it is fixed in code.

## 3. Components to build
- **`PostCard`** with a `type` prop. It has a header (category icon, label, icon), a body (title style `card/title` and the description), and a meta row (pills plus an arrow button). Text cards for About and Team fade out at the bottom. **Publication** cards use two columns: the title on the left, the authors and venue on the right **aligned to the bottom**, with the year and type as pills.
- **`Pill`** and **`CategorySignifier`**, from the matching Figma components.
- **`ImageFiller`** with the variants floppy, disk, folder, magnetic and logo. The panel is in the `accent` category's dark colour, and the image is blended on top with `mix-blend-mode: screen` and a 4 px white outline, so the drawing reads as a duotone in that colour. The logo variant shows the logo on a white panel. The tile itself has no background.
- **`Colophon`, `PartnerLogo`, `Footer`** (the footer is a grid of 1, 2, 3 or 4 tiles at the breakpoints).
- **`HomeGrid`**: a CSS grid with `grid-cols-1` as the base, `sm:grid-cols-2`, `lg:grid-cols-3`, `xl:grid-cols-4`, using Tailwind's own breakpoints. Do not add custom breakpoints or fluid sizing such as `clamp()` or `vw` widths. Tiles keep the square proportion from the Figma frames within each layout.
- Type, colour and spacing come only from the tokens file. Use semantic HTML.

## 4. Code structure: components a human can read
The code will be read and maintained by people, so structure matters as much as the result. Before writing components, **study the Figma frames and the `Components` page and list the recurring patterns**. Then turn each pattern into a small, named component, and build the pages by composing them.

**How to decide what becomes a component**
- Extract a component when a pattern appears **two or more times**, or when it has a **clear meaning of its own** in the design (a pill, a tile, a post header), even if it is used once today.
- Do not over-abstract: no component for something used once with no name in the design, and no props "just in case".
- Prefer composition (slots, or snippets in Svelte 5) to long prop lists and `{#if}` chains. Check `package.json` for the Svelte version and follow its idioms (runes in Svelte 5, for example).

**Patterns to look for, at least these**
- **Category theming** (see "Variants" below).
- **The square tile** shared by post cards, image fillers, the logo tile, the colophon and the partner logos: one `Tile` component giving the square proportion, background and padding, with content passed in.
- **Pills and the pill row**, the **category signifier** (icon plus label), the **post header** (icon, label, icon), the **meta row** (pills plus an arrow button), and **icon plus label** cells.
- **The image panel with the duotone effect**, used by the image fillers now and by the `Image Container` on the category pages later.
- **The page shell** that category pages will share later: the meta row, the title and subtitle, the body, the notes column and the footer. Make the Home page use the same building blocks where it makes sense.

**Variants: components that look the same but differ by category**
- **One registry.** Create `categories.ts` (typed) with one entry per content type (`about`, `artifact`, `publication`, `event`, `team`) and Home: label, icon, route, dock label, and the token names for its accent. The `team → about` rule lives here only. The dock, the page sheet, the post header, the category signifier, the pill and the page tint all read this registry. Do not list categories anywhere else, and do not write `{#if type === …}` chains in components.
- **Colour through CSS custom properties.** A wrapper (for example `<CategoryTheme category=…>`) sets `data-category`. In CSS, each `[data-category="…"]` maps `--cat-lighter`, `--cat-main` and `--cat-darker` to the token variables. Components use `var(--cat-…)` only. **Never build Tailwind class names from variables** (for example `` `bg-${type}-main` ``), because Tailwind cannot detect them. Use the CSS variables or complete static class names.
- **Same structure, different data → one component.** `NavDock` renders one `NavDockItem` per registry entry. Do not create one component per category.
- **Different structure → shared shell plus a swapped part.** `PostCard` has a shared shell (header, meta row, arrow) and a body. The default body shows title and description. The publication body uses two columns, with authors and venue aligned to the bottom. Pick the body in one place. The shell is never duplicated.
- **Mirror Figma properties.** A Figma variant property becomes a typed prop with the same name (`Category` → `category`, Pill `Type` → `variant: 'text' | 'icon-text' | 'icon'`). Use `tailwind-variants` (or a small typed map) only where several independent axes combine.

**Layers (use folders that show the hierarchy, adapting names to the repo's conventions)**
- `components/ui/` for small generic parts (Pill, Tile, IconLabel, ImagePanel).
- `components/content/` for parts that know the design language (PostCard, CategorySignifier, PostHeader, PostMeta, ImageFiller, Colophon, PartnerLogo).
- `components/layout/` for structure shared by every page (NavDock, TopStroke, PageSheet, Footer, TileGrid).
- `templates/` for **page templates**: `HomeTemplate` composes `TileGrid` with the tile components. Keep route files (`+page.svelte`) thin: they load data and pass it to the template. The category pages will get their own templates later in the same way.

**Readability rules**
- One component per file, named after the Figma component it comes from (`PostCard` for `Post`, `ImageFiller` for `Image Filler`).
- Keep components short. If a file goes past about 100–150 lines, look for a sub-component or move logic into a helper.
- Props are typed and minimal. Put logic (sorting, grouping, deriving the active category) in plain `.ts` modules that are easy to test, not inside markup.
- Add a short comment at the top of each component saying what it is and where it appears in the design, and comment non-obvious choices (for example why the dither cap uses a clipped pattern). Do not comment the obvious.
- Do not duplicate markup or classes across components. Avoid deep prop drilling: use the category wrapper, slots/snippets, or a store for shared state (for example the active category).

**Document it.** Write `docs/ARCHITECTURE.md` (or the place `CLAUDE.md` names) with: the component tree for the Home page, what each folder contains, the registry and the category-theming mechanism, how to add a new tile type or category, and how page templates reuse the components. Keep it short and current.

## 5. Bottom navigation dock
Build `NavDock` as a **layout component used by every page** (put it in the root `+layout.svelte`).
- **Always fixed at the bottom of the viewport**, on every breakpoint. It takes no grid column. Add enough bottom padding to the page so content is never hidden behind it.
- **Items:** Home, About, Events, Publications, Artifacts, all rendered from the registry. Each has a pixel icon, in its category colour, and a label. Phones: icon above the label. From `lg` (1024): full width, icon beside the label. The dock's three styles (phone, compact, wide) follow only the Tailwind breakpoints.
- **Active item:** the current page's category, with the tinted background and the **dithered cap** on top of that cell. The cap must stretch to the full width of the cell at any dock width.
- **Top stroke:** a thin **dithered line fixed at the very top** of the viewport, in the current category's colour, on every page. On Home it is neutral.
- **Compact on scroll (phones):** when the user scrolls down, the dock becomes icon-only and lower, and it restores when scrolling up. Respect `prefers-reduced-motion`.
- **Which category is active:** derive it from the page itself. On a post page, use the `type` from its front matter (passed through the `load` data, with `team` counting as `about`). On list and Home routes, use the URL. The two sources must agree. Expose this as one store or derived value that the dock, the top stroke and the page tint all read.
- **Page sheet:** tapping a category opens a sheet **stacked above the dock** that lists **every post of that category** (including Team under About), built from the markdown data, with no pagination yet. On phones it is full width. From `lg` it is a popover above the tapped item. Tapping Home navigates directly, with no sheet. Include a close action, Escape to close, focus management, `aria-current="page"` on the active item, and correct roles (`nav`, a dialog or menu for the sheet). Keep the structure ready for pagination later.

## 6. Constraints
- No new absolute values where a token or Tailwind utility exists. Report any exception.
- Follow section 4. Do not write large components that mix layout, data and styling. Reviewers will read the component tree before reading the code.
- Reuse the Figma names for components and variants, so designers and developers talk about the same things.
- Do not change the token CSS file or `CLAUDE.md` without asking, except to add missing category tokens if they are absent (list exactly what you add).
- Accessibility: keyboard navigation, visible focus, sufficient contrast, semantic headings, text alternatives for the image fillers.
- Work in small steps: registry and loader, then the small components, then the Home template and grid, then the dock. Run the dev server and check each step in the browser.

## 7. Acceptance
- Home matches the Figma frame at each of the four breakpoints and keeps the layout of the smaller breakpoint in between.
- The dock works on every route, highlights the right category from both the front matter and the URL, compacts on scroll on phones, and its sheet lists all the posts of a category.
- Fillers render only on Home and are excluded everywhere else.
- The code follows section 4: one registry, no repeated category conditionals, the recurring patterns are separate components, route files are thin, and `ARCHITECTURE.md` matches the code.
- All colours and type come from tokens. There are no console errors, and `npm run check` and the build pass.

## Report (max 350 words)
What you built and where; the **component tree** (folders and components), which recurring patterns you extracted and why, and any pattern you chose not to extract; **where the registry and the theming live**; the front-matter schema you settled on and the rule for composing the Home tiles; any token that was missing or any value that does not match a Tailwind utility; placeholders for logo and icons; differences from the Figma frames and why; and anything you think should be decided by a human.
``````

# PROMPT
``````
# Task: extend the `syncHedgeDocs` script so it can also import image fillers from HedgeDoc links

Read `CLAUDE.md` first and follow it. Then **read the existing `syncHedgeDocs` script end to end** and its documentation before changing anything. You need to understand how it currently gets its list of HedgeDoc links, downloads each note, parses the front matter, localises remote images and writes the markdown into the repository.

## Goal
Notes published on HedgeDoc can be **image fillers** for the Home page. A filler is a note whose front matter has `type: home-image-filler` and whose body is **exactly one markdown image**. The script must import these notes like any other note, validate them, and write them to the right place so the Home page loader can find them. Example link to test with: `https://pad.dsl.unibe.ch/s/abxmbKHpOw` (a published HedgeDoc note).

## Target format of a filler note
```markdown
---
type: home-image-filler
accent: about            # about | event | publication | artifact
tags: website/page       # HedgeDoc tag, keep as is
position: 1              # position in the Home grid (see rules below)
---

![alt text for screen readers](https://pad.dsl.unibe.ch/uploads/<id>.webp
 "Optional caption (ignored on Home)")
```
Notes: the front matter may contain `#` comments, which the YAML parser must accept. The image tag may break the line before the title, which is valid markdown and must parse as one image with a title.

## Required behaviour
1. **Detection:** a note is a filler when its front matter `type` is `home-image-filler`. Other notes keep working exactly as today.
2. **Validation** (fail that note with a clear, actionable message that names the link, and continue with the other notes unless the script is already strict):
   - `accent` is one of `about`, `event`, `publication`, `artifact`;
   - `position` is an integer greater than 1 (position 1 is the fixed logo tile), and it is **unique** across all fillers;
   - the body contains **exactly one image and nothing else** (no text, headings or second image), and the alt text is not empty.
3. **Image handling:** localise the image with the **existing download/rewrite function**. Do not write a second one. Keep the rewritten local path, the alt text and the title in the output markdown.
4. **Output location and filename:** write the filler where the Home loader expects it. If `CLAUDE.md` or the repo does not define that location yet, choose `content/home-image-fillers/` (or the equivalent next to the existing content folders), use a stable slug from the HedgeDoc id, and document your choice.
5. **Link sources:** fillers come from the same kind of HedgeDoc share links (`/s/<id>`) as the other notes. Use the same way the script takes its links today (config file, list, argument). Add the new links there, or document exactly how to add them, and do not hard-code the test link.
6. **Idempotent:** running the script twice gives identical files. Re-importing a note updates it, and removing a link does not delete files silently (report it).
7. **Front matter preserved:** keep `type`, `accent`, `tags` and `position` in the output. Normalise only what the existing script already normalises.
8. **Dry run:** if the script has a dry-run or verbose flag, filler handling must respect it. If it has none, add a `--dry-run` that prints what would be written and validates everything without writing.

## Constraints
- Do not change the behaviour, the output format or the file names for ordinary notes. Run the script before and after on the existing links and confirm the output is identical for them.
- Follow the language, style and dependencies already used by the script. Do not add a dependency unless the repo already has a markdown or YAML parser you can use.
- Do not commit secrets. If the script needs credentials or cookies for HedgeDoc, use the existing method.
- Add or update tests if the repo has a test setup, including a valid filler, a filler with text in the body, a filler with two images, a duplicate `position`, an invalid `accent`, and a front matter with comments.
- Update the script's documentation and `CLAUDE.md` with the filler format and the rules above.

## Acceptance
- Importing `https://pad.dsl.unibe.ch/s/abxmbKHpOw` (or a link you were given) produces a valid filler file with a local image path, correct front matter and no other body.
- Bad fillers fail with clear messages, and good notes are unaffected.
- Running the script twice changes nothing.

## Report (max 250 words)
What you changed and where; how the script takes its links and how to add fillers; the output folder and filename rule; the validation rules and their error messages; what you verified on existing notes; and any question for a human (for example what to do when a filler is removed from the link list).
```````

Now prompt for the team page

# PROMPT

`````
# Task: build the Team page of the website in SvelteKit from the Figma design

Read `CLAUDE.md` first and follow it. It says where the **design-token CSS file** lives (colours, typography, spacing, font overrides on top of Tailwind) and what the project conventions are. Tailwind is installed and the project is scaffolded with SvelteKit. **Use the tokens. Do not hard-code colours, font sizes, line heights, radii or spacing.** If a value you need has no token, use the nearest Tailwind utility and mention it in your report.

The Home page and the shared layout (bottom navigation dock, top stroke, registry of categories, category theming) may already exist in the repo. **Inspect the repo first and reuse what exists** (components, `categories.ts`, the content loader, the dock). Do not duplicate anything. If something you need is missing, build it following the rules in section 4.

## 1. Learn from the Figma file
- File key: `OOCuuEYo0V7Me2Z5p9uqs5` ("Bit Philology Website PRO"). Use the Figma MCP tools (`get_design_context`, `get_screenshot`, `get_metadata`, `get_variable_defs`). Load the `figma:figma-design-to-code` skill before `get_design_context`, and follow it.
- **Page `Team`** has four frames: `Team · 375`, `Team · 640`, `Team · 1024`, `Team · 1280`. They are the **Tailwind breakpoints** (base, `sm`, `lg`, `xl`), each with its own layout. Implement exactly these four layouts with Tailwind's breakpoint utilities. The layout **changes only at the breakpoints** and is not fluid in between: between two breakpoints the page keeps the layout of the smaller one.
- **Page `Components`** is the design system. The parts this page uses: `Team Member` (three variants, see below), `Category Signifier`, `Pill`, `Footer`, `Colophon`, `Partner Logo`, and the **Navigation** group (`Navigation Dock`, `Top Stroke`, `Page Sheet`). Look at `Image Container` too, since the other category pages will use it.
- **Ignore** the old `Navigation` component and the `Navigation proposals` page; they are superseded by the dock.
- The Penpot file is an old version and is **not** a reference for this task. Figma is the source of truth.
- Take screenshots of each frame and compare your result with them at 375, 640, 1024 and 1280 px.

## 2. What the page contains (from the Figma frames)
The Figma frames show **one sample order**. The real order is decided by the content editors (see section 3). The sample, from top to bottom:
1. **Post meta row:** the category signifier (About), a thin line, and pills (publication date and tags).
2. **Page header:** title "Team" and a lead-paragraph subtitle. The title uses `display/page-title` from 640 up and `heading/h1` at 375.
3. An intro paragraph.
4. The **team members list**.
5. A section heading ("Associated members", `heading/h2`) and a short paragraph.
6. The **advisory board list**.
7. **Footer:** colophon and the partner logos, as a grid of 1, 2, 3 or 4 tiles at the breakpoints.

Layout per breakpoint:
- **1280 (`xl`)**: a 4-column grid with 16 px gaps. **Column 1 is a page index**: "On this page" (anchors to the headings of the body) and "In About" (every post of type `about` and `team`, with Team highlighted). The content sits in **columns 2–3**, and the meta row spans columns 2–4. Column 4 has no notes on this page.
- **1024 (`lg`)**: a 3-column grid, no index column. The content sits in columns 1–2.
- **640 (`sm`) and 375**: a single stack.
- The bottom dock and the dithered top stroke are the shared layout. The active category is **About**, because `team` counts as `about`.

**`Team Member` component, three variants** (the Figma property is `Size`):
- **`large`**: used **only** for the role **Principal Investigator**.
- **`medium`**: the **default** variant.
- **`small`**: used for the role **Advisory Board Member**.
The size is **derived from the member's role**, not from which list the member is in. Put this rule in one place (a small typed function or map, for example `memberSize(role)`), with case-insensitive matching on the role. The component itself has a typed `size` prop. Read the Figma component for the photo treatment (the colour effect from the category), the name with its external-link icon, the role and the affiliation.

## 3. Content model
- Content is **markdown files in the repository**. The front matter field **`type`** says what a file is (`about`, `artifact`, `publication`, `event`, `team`, `home-image-filler`). The Team page is a file with `type: team`. For the dock, the sheet and the colours, `team` counts as `about`.
- **Front matter of the Team file** contains two lists:
  - `members`: the project team.
  - `advisory_board`: the members of the scientific committee.
  Each entry has `name`, `role`, `affiliation`, `photo` and optionally a link. Inspect the existing Team file and the content loader the Home page uses, and match the real field names. Do not invent a second content system.
- **Body of the file**: the lists appear where the body contains the markers **`{{team}}`** (renders `members`) and **`{{advisory-board}}`** (renders `advisory_board`). Content editors can **move these markers above or below any paragraph or heading**, so the page order is whatever the editor writes. Every member is rendered with the `TeamMember` component.
- **Implement the markers carefully:**
  - Check how the markdown is rendered (mdsvex, remark to HTML, other). In **mdsvex, `{{…}}` is read as a Svelte expression** and would break or be evaluated. Handle the markers **before** that step: split the body at the markers, or use a small remark plugin that turns the marker text into a custom node. Do not rely on the renderer leaving them alone.
  - Render the body as an ordered list of **segments**: rendered markdown, and embedded lists. Build a small `MarkdownBody` (or similar) component that maps a segment to either HTML or an embedded component. Keep the embeds in **one registry** (`{ team: TeamMemberList, 'advisory-board': … }`), so adding a new embed later means adding one entry.
  - Markers are matched exactly, and whitespace inside the braces is tolerated. An unknown marker is a **build error** with a clear message that names the file. A marker that appears twice is an error. A list in the front matter whose marker is missing from the body is a **warning** (the list is not shown).
- **Photos** are remote images that get localised by the mechanism already used for the other markdown files (find it in the repo and `CLAUDE.md`; reuse it). If that mechanism does not cover photos in front matter, say so in the report and propose the smallest change. Do not write a second downloader.
- The page title, subtitle and the texts come from the front matter and body. "On this page" is **generated from the headings** of the rendered body (h2 and h3). The member lists do not create entries. "In About" is generated from the loader.
- Validate at build time that each member has a `name` and a `role`, and fail with a clear error otherwise.

## 4. Code structure: components a human can read
The code will be read and maintained by people. Before writing, **list the recurring patterns** in the Figma frames and turn each into a small, named component. Build the page by composing them.

**How to decide what becomes a component.** Extract a component when a pattern appears two or more times, or has a clear meaning of its own in the design, even if it is used once today. Do not over-abstract. Prefer composition (slots, or snippets in Svelte 5) to long prop lists and `{#if}` chains. Check `package.json` for the Svelte version and follow its idioms.

**Patterns for this page** (reuse the ones that exist)
- **Page shell**, shared by all category pages later: `PostMetaRow`, `PageHeader`, the body area, the notes column and the footer. Build it so the About, Events, Artifacts and Publications pages can reuse it. The Team page needs only a part of it.
- **`MarkdownBody` with embeds**: renders the body segments and the registered embeds. Keep it generic enough for other pages.
- **`PageIndex`** (the first column at 1280): two blocks, `OnThisPage` and `InSection`. Both take data, and the colour comes from the category theme.
- **`TeamMember`** with a `size` prop (`large | medium | small`), used for **every** member in both lists.
- **`MemberList`**: a column of members. It takes a list and renders one `TeamMember` per entry, choosing the size with `memberSize(role)`.

**Variants**
- **One registry.** Reuse `categories.ts` (typed), one entry per type, with label, icon, route and the token names for its accent. `team → about` lives there only. Do not list categories anywhere else, and do not write `{#if type === …}` chains.
- **Colour through CSS custom properties.** A wrapper such as `<CategoryTheme category=…>` sets `data-category`. In CSS, each `[data-category="…"]` maps `--cat-lighter`, `--cat-main`, `--cat-darker` to the token variables. Components read `var(--cat-…)` only. **Never build Tailwind class names from variables** (for example `` `bg-${type}-main` ``), because Tailwind cannot detect them. Use the CSS variables or complete static class names.
- **Mirror Figma properties** as typed props with the same names (`Size` → `size`).

**Layers** (adapt names to the repo): `components/ui/` for small generic parts, `components/content/` for parts that know the design language (`TeamMember`, `MemberList`, `PageIndex`), `components/layout/` for structure shared by every page (dock, top stroke, footer, page grid), and `templates/` for page templates. `TeamTemplate` composes the shell and the body. Keep the route file (`+page.svelte`) thin: it loads data and passes it to the template.

**Readability rules**
- One component per file, named after its Figma component (`TeamMember` for `Team Member`).
- Keep components short (about 100–150 lines at most). Put logic (splitting the body at markers, `memberSize`, building the index from headings) in plain `.ts` modules that are easy to test, not inside markup.
- Props are typed and minimal. Add a short comment at the top of each component saying what it is and where it appears in the design. Comment non-obvious choices and nothing obvious.
- Do not duplicate markup or classes. Avoid prop drilling: use the category wrapper, slots/snippets, or a store.

**Document it.** Update `docs/ARCHITECTURE.md` (or the place `CLAUDE.md` names) with the component tree for the Team page, how the `{{…}}` markers work and how to add a new embed, the size rule, and how a future page template reuses the shell.

## 5. Page grid and dock
- Use a CSS grid with explicit columns at the Tailwind breakpoints: `grid-cols-1`, `lg:grid-cols-3`, `xl:grid-cols-4`, with spans for the index, the meta row and the content. Do not add custom breakpoints or fluid sizing (`clamp()`, `vw`).
- Use the shared `NavDock` and top stroke from the root layout. Do not build a second one. On this page the active item is **About**, derived from the page's `type` through the registry, and it must also agree with the URL.
- Add bottom padding so content is never hidden behind the fixed dock.
- The page sheet above the dock lists all posts of the category, including Team under About. Check that Team shows up there.

## 6. Constraints
- No new absolute values where a token or Tailwind utility exists. Report any exception.
- Follow section 4. Reviewers will read the component tree before reading the code.
- Reuse the Figma names for components and variants.
- Do not change the token CSS file or `CLAUDE.md` without asking.
- Accessibility: semantic headings (one `h1`), landmarks, keyboard navigation, visible focus, sufficient contrast, meaningful alt text for photos and `aria-current` on the index and the dock.
- Work in small steps: content and loader, then the marker handling, then `TeamMember` and the lists, then the page shell and the index, then the grid and breakpoints. Run the dev server and check each step in the browser.

## 7. Acceptance
- The Team page matches the Figma frame at each of the four breakpoints and keeps the smaller breakpoint's layout in between.
- Members render from the front matter with the right sizes: Principal Investigator large, Advisory Board Member small, everyone else medium.
- **Moving `{{team}}` or `{{advisory-board}}` in the body moves the lists**, above or below any paragraph, with no code change. Unknown or duplicate markers fail the build with a clear message.
- The index at 1280 has working anchors and shows "In About" with Team highlighted.
- The dock highlights About, agrees with the URL, and lists Team in the sheet.
- The code follows section 4: one registry, no repeated category conditionals, the patterns are separate components, the route file is thin, and `ARCHITECTURE.md` matches the code.
- All colours and type come from tokens. There are no console errors, and `npm run check` and the build pass.

## Report (max 300 words)
What you built and where; the component tree, what you reused from the Home work and what you added; how the `{{…}}` markers are parsed and what happens with the renderer (mdsvex or other); the front-matter field names you found; how photos are localised; any token that was missing or value that did not match a Tailwind utility; differences from the Figma frames and why; and anything you think a human should decide.
```````

Prompt to create all the remaining pages:

```````
# Task: build the page templates for the remaining content types (About, Events, Artifacts, Publications) in SvelteKit from the Figma design

Read `CLAUDE.md` first and follow it. It says where the **design-token CSS file** lives (colours, typography, spacing, font overrides on top of Tailwind) and what the project conventions are. Tailwind is installed and the project is scaffolded with SvelteKit. **Use the tokens. Do not hard-code colours, font sizes, line heights, radii or spacing, and never invent new numbers.** Use Tailwind utilities and the tokens only. If a value you need has no token or utility, use the nearest Tailwind one and list it in your report.

Already done in the repo: the **Home page**, the **Team page**, the shared layout (bottom navigation dock, top stroke), the registry of categories (`categories.ts`), the category theming, the content loader and the markdown rendering. The remaining page types exist only as rough sketches. **Inspect the repo first**, then build the four templates on top of what exists. Do not duplicate anything, and do not break Home or Team.

## 1. Learn from the Figma file
- File key: `OOCuuEYo0V7Me2Z5p9uqs5` ("Bit Philology Website PRO"). Use the Figma MCP tools (`get_design_context`, `get_screenshot`, `get_metadata`, `get_variable_defs`). Load the `figma:figma-design-to-code` skill before `get_design_context`, and follow it.
- There is one Figma **page per template**: `About`, `Events`, `Artifacts`, `Publications`. Each has four frames: `<Name> · 375`, `· 640`, `· 1024`, `· 1280`. They are the **Tailwind breakpoints** (base, `sm`, `lg`, `xl`), each with its own layout. Implement exactly these four layouts with Tailwind's breakpoint utilities. The layout **changes only at the breakpoints** and is not fluid in between: between two breakpoints the page keeps the layout of the smaller one.
- The Figma file is built on variables and text styles that map to the design tokens. Read them with `get_variable_defs` and the text styles in the frames, and bind every colour, text style and spacing to the matching token or Tailwind utility.
- **Page `Components`** is the design system. The parts these pages use: `Category Signifier`, `Pill`, `Image Container` (variants by category), `Post Header`, `Footer`, `Colophon`, `Partner Logo`, the **Navigation** group (`Navigation Dock`, `Top Stroke`, `Page Sheet`), and `Team Member` for reference.
- **Ignore** the old `Navigation` component and the `Navigation proposals` page. The `Page Template` page is a generic earlier draft; the four pages above supersede it.
- The **text in the Figma frames is mock-up content**. The real content comes from the markdown files. Use Figma for structure, layout and styles, not for words.
- Take screenshots of each frame and compare your result with them at 375, 640, 1024 and 1280 px.

## 2. Learn from the content first
All content is already imported: markdown files are in the repository and the loader reads them. **Before writing any component, read the existing files** and work out how each part of a real page maps to an element of the layout:
- Read several real files of each type (`about`, `event`, `artifact`, `publication`), the front matter of each, and the loader and rendering code. Do not assume a schema; **discover it**.
- Find out how these are written in the markdown, and document the answer:
  - headings and paragraphs;
  - **images**: the convention is `![alt text](url "caption")`, where the alt text is for accessibility and the **title is the visible caption**;
  - **notes and sidenotes** (footnote syntax, numbered markers such as `[note 01]`, or something else), and how a note is tied to the paragraph that refers to it;
  - **embedded lists or special markers** (for example the `{{…}}` markers of the Team page), and how embeds are registered;
  - type-specific front matter: publication (authors, venue, date, DOI, download link, publication type), event (date, location), artifact (online since, kind), and the common fields (title, subtitle/description, date, tags).
- Produce a **mapping table** (in `docs/ARCHITECTURE.md`): each layout element (meta row, pills, title, subtitle, extra header lines, body blocks, image, caption, sidenotes, index) and the front matter field or markdown element it comes from. If a layout element has no source in the content, say so in the report instead of inventing data.

## 3. What each page contains (from the Figma frames; verify in Figma)
**Common shell** (all four): a **post meta row** (category signifier, a line, pills), the **page header** (title and subtitle), the **body** with optional **image container and caption** and **sidenotes**, and the **footer** (colophon and partner logos as a grid of 1, 2, 3 or 4 tiles). The shared dock and dithered top stroke come from the root layout, with the active category from the page's `type`.

Layout per breakpoint:
- **1280 (`xl`)**: a 4-column grid with 16 px gaps. **Column 1 is a page index**: "On this page" (anchors to the body's headings) and "In <Category>" (every post of the same category, with the current one highlighted; for About it includes Team). The content sits in **columns 2–3**. The meta row spans columns 2–4. The **sidenotes sit in column 4, on the same row as the paragraph that references them**, and the **image caption is aligned to the bottom of the image**.
- **1024 (`lg`)**: a 3-column grid, no index column. The content sits in columns 1–2 and the notes and caption in column 3, each aligned to its paragraph or image.
- **640 (`sm`) and 375**: a single stack. Each note and caption comes right after the paragraph or image it belongs to.

Type-specific parts:
- **About:** title and subtitle, paragraphs, an image with caption, paragraphs with notes.
- **Events:** the header has **two extra lines under the subtitle, Location and Date** (style `heading/h6`). Then a large image with caption, then sections with `heading/h2` headings. The meta row pills show date, place and tags.
- **Artifacts:** a large image container that represents the artifact, paragraphs with sidenotes. The pills show "online since", the kind and tags.
- **Publications:** a **different header**: the title (style `heading/h1`), the authors (`card/authors`), the venue and date (`body/body`), and a DOI in the code style with a **Download** action (a pill). Then the image (poster or figure) with caption and paragraphs with notes. The pills show venue, date, tags and the publication type.
Every colour (text, line, pills, image panel, stroke, dock highlight) follows the page's category. `team` counts as `about`.

## 4. Code structure: components a human can read
The code will be read and maintained by people. Before writing, **list the recurring patterns** across the four Figma pages and the two that already exist, and turn each into a small, named component. Build the pages by composing them.

**How to decide what becomes a component.** Extract a component when a pattern appears two or more times, or has a clear meaning of its own in the design, even if it is used once today. Do not over-abstract. Prefer composition (slots, or snippets in Svelte 5) to long prop lists and `{#if}` chains. Check `package.json` for the Svelte version and follow its idioms.

**The expected result is ONE shared page shell and small per-type parts, not four near-identical templates.**
- **`PageShell`** (reuse or extend what Team created): the grid, the meta row, the header slot, the body, the notes column, the page index and the footer.
- **Per-type headers**: `EventHeader`, `PublicationHeader`, `ArtifactHeader` (and the default header for About). They are the main structural difference between types. Keep them small.
- **`PostMetaRow`**, which takes a list of pills. A small function per type turns front matter into that list, in a plain `.ts` module.
- **`BodyBlocks`**: turns the rendered markdown into an ordered list of **blocks**. Each block is one top-level element (paragraph, heading, image, list, embed) together with the **notes it references** and, for an image, its caption. The grid shows each block as **one row**: the content in the content columns, and its notes in the notes column, on the same row. This is how the notes stay aligned with their paragraphs. At 1280 use the page grid with explicit columns and spans, and do not position anything absolutely.
- **`ImageFigure`** (uses `Image Container`): the duotone panel in the category colour, with `mix-blend-mode: screen` and a 4 px white outline as in Figma. It takes the image, alt text and caption, and aligns the caption to the bottom of the image.
- **`SideNote`** and **`PageIndex`** (`OnThisPage`, `InSection`), both data-driven.
- **`Template registry`**: one typed map from `type` to template/header components, in one place, so the route never has `{#if type === …}` chains. The route file stays thin.

**Variants**
- **One registry of categories** (`categories.ts`). Do not list categories anywhere else, and do not write `{#if type === …}` chains inside components.
- **Colour through CSS custom properties.** A wrapper (`<CategoryTheme …>`) sets `data-category`; CSS maps `--cat-lighter`, `--cat-main` and `--cat-darker` to the token variables; components read `var(--cat-…)` only. **Never build Tailwind class names from variables** (for example `` `bg-${type}-main` ``), because Tailwind cannot detect them. Use the CSS variables or complete static class names.
- **Mirror Figma properties** as typed props with the same names.

**Readability rules**
- One component per file, named after the Figma component it comes from.
- Keep components short (about 100–150 lines). Put logic (building blocks from the markdown, pairing notes with paragraphs, building pills from front matter, building the index from headings) in plain `.ts` modules that are easy to test, not inside markup.
- Props are typed and minimal. Add a short comment at the top of each component saying what it is and where it appears in the design. Comment non-obvious choices and nothing obvious.
- Do not duplicate markup or classes. Avoid prop drilling: use the category wrapper, slots/snippets, or a store.

**Document it.** Update `docs/ARCHITECTURE.md` (or the place `CLAUDE.md` names) with the component tree, the mapping table from section 2, how blocks and notes are paired, how to add a new page type, and what each per-type header reads from the front matter.

## 5. Constraints
- No new absolute values where a token or Tailwind utility exists. Use the Tailwind breakpoints `sm`, `lg`, `xl` only. No custom breakpoints and no fluid sizing (`clamp()`, `vw`). Report any exception.
- Reuse the Figma names for components and variants.
- Do not change the token CSS file or `CLAUDE.md` without asking.
- Do not change the front-matter schema unless a layout element clearly has no source. If you must, propose the smallest change and explain it in the report, and keep existing files valid.
- Content and pages that are missing a field must still render sensibly. Required fields missing from a file must fail the build with a message that names the file.
- Accessibility: semantic headings (one `h1`), landmarks, keyboard navigation, visible focus, sufficient contrast, meaningful alt text, `aria-current` on the index and the dock, and a proper relationship between each note and the text that refers to it.
- Work in small steps: read the content and write the mapping table, then the block builder and notes pairing, then the shared shell, then one type at a time (About, Publications, Events, Artifacts). Run the dev server and check each step in the browser with real files.

## 6. Acceptance
- For each of the four types, a **real content file** renders with its real content and matches the Figma frame at each of the four breakpoints, keeping the smaller breakpoint's layout in between.
- Notes sit beside the paragraph that refers to them at 1024 and 1280, and after it on smaller screens. The image caption is aligned to the bottom of the image.
- The page index at 1280 has working anchors and "In <Category>" lists every post of the category, with the current one highlighted.
- The dock highlights the right category, agrees with the URL, and its sheet lists the posts.
- Home and Team still work as before.
- The code follows section 4: one shared shell, small per-type headers, one registry, no repeated category conditionals, route files thin, and `ARCHITECTURE.md` matches the code.
- All colours and type come from tokens. There are no console errors, and `npm run check` and the build pass.

## Report (max 400 words)
What you built and where; the component tree and what you reused from Home and Team; the content-to-layout mapping for each type and any layout element with no source in the content; how notes are paired with paragraphs and how captions are read; the front-matter fields you found; any change to the schema; any token that was missing or value that did not match a Tailwind utility; differences from the Figma frames and why; and anything a human should decide.
`````