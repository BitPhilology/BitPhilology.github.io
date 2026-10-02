# Writing the content of the website

A guide for the people who write the pages of the Bit Philology website. No programming is needed: the pages are notes on HedgeDoc, and one command copies them into the website.

## How it works

1. Every page is a **note on HedgeDoc** (https://pad.dsl.unibe.ch). A note has two parts: its **settings**, between two `---` lines at the top, and its **text**, below them.
2. The file [`src/content/contents.yaml`](../src/content/contents.yaml) **lists the notes** of the website.
3. The command `npm run syncFromHedgeDoc` **copies the notes** into this repository, with their images, and tidies the list.
4. The website is built from those copies and published when the changes are pushed to GitHub.

The copies in `src/content` are overwritten when a note is fetched again: always edit the note on HedgeDoc, not its copy.

## Adding a page

1. On HedgeDoc, create a note and paste the template into it: [`templates/page.md`](templates/page.md).
2. Fill in the settings and write the text (see below).
3. Press **Publish** on HedgeDoc and copy the link of the page that opens. It looks like `https://pad.dsl.unibe.ch/s/AbCdEfGhI`.
4. Paste the link in the `new` list of `src/content/contents.yaml`, on a line of its own, after `- `:

   ```yaml
   new:
     - https://pad.dsl.unibe.ch/s/AbCdEfGhI
   ```

5. Run `npm run syncFromHedgeDoc`.

The command fetches the note, files it under its section of the list (with its title, the link of its note and the day it was fetched) and empties `new`. At the end it prints a summary: read the **Errors** and **Warnings**, which say in plain words what to fix in a note.

## The settings

Every page has the same settings. Some only apply to some types of page: on the other types they are ignored, so they can be left empty or deleted. Lines that start with `#` are notes for the writer and are ignored too.

| Setting | Used by | What it is |
| --- | --- | --- |
| `type` | every page | `about`, `team`, `event`, `publication` or `artifact`. It decides the section, the colours and the layout |
| `title` | every page | The title of the page and of its card on the Home page. With a colon inside, write it in quotes: `"Archives: a survey"` |
| `subtitle` | all but publications | A line under the title |
| `keywords` | every page | The topics of the page, one per line after `- `, shown as `#keyword` labels |
| `date` | every page | `2026-05-08`, or only the year. The day of the event, or when the page or the publication came out |
| `venue`, `location` | events, publications | The institution, conference or journal; and the room or the city |
| `authors` | publications, artifacts | For example `E. Spadini, E. Barchielli` |
| `publication-type` | publications | For example `Poster`, `Oral Communication`, `Article` |
| `doi`, `download-link` | publications | The DOI (or its link), and the link to the file to download |
| `kind` | artifacts | What kind of object it is, for example `Tool` or `Dataset` |
| `members` | the Team page | The people of the team: `name`, `role`, `affiliation`, `photo`, `external-url` |
| `advisory-board` | the About page | The advisory board: `name`, `affiliation`, `external-url` |
| `excerpt` | About, Team, artifacts | The text on the card of the Home page. Empty: the first paragraph of the page |
| `position` | every page | The place of the card in the Home grid (see below) |
| `hidden-from-home` | every page | Write `true` to not display the content in the home page (e.g., as done for the "credits" page) |
| `slug` | – | Leave it empty: the address of the page is computed from its title |
| `tags` | – | Used by HedgeDoc to group the notes: leave it as it is |

The names must be written exactly as above. When a name is wrong, the summary of the command says so and suggests the right one.

## Writing the text

The text is Markdown, as everywhere on HedgeDoc.

- **First paragraph.** It is the lead of the page and is shown bigger than the others. To have a normal first paragraph, start it with `[no-lead]`.
- **Headings.** Use `###` or `####` for the sections of the page: the title of the page comes from the settings, never from a `#` heading.
- **Images.** Always upload an image to HedgeDoc, and never link to an image that is on another website: the link would break as soon as that website changes.
  1. Put the cursor on an empty line of the text.
  2. Press the **Upload Image** button in the toolbar of HedgeDoc. HedgeDoc writes a line like `![](https://pad.dsl.unibe.ch/uploads/1a2b3c4d.png)`.
  3. Complete that line with a description and a caption: `![A hand-drawn map of the archive](https://pad.dsl.unibe.ch/uploads/1a2b3c4d.png "The archive in 1998")`.

  The description, between the square brackets, is read aloud to people who cannot see the image: always write it. The caption, between the quotes and after a space, is the text shown beside the image; it can be left out. An image on a line of its own is shown large, in a frame. The command warns about images without a description and about images that were not uploaded to HedgeDoc.
- **Notes.** Write `[^a-label]` in the text where the note is called, and the note as a paragraph of its own, anywhere in the text: `[^a-label]: The text of the note.` The website numbers the notes and shows them beside the text.
- **Lists of people.** `{{team}}` on a line of its own shows the `members` of the settings at that point of the page; `{{advisory-board}}` shows the `advisory-board`. Move the line to move the list.

## The Home page

Every page has a card on the Home page.

- **Order.** Without a `position`, the cards follow their date, newest first. `position: 1` is the first tile of the grid, `2` the second, and so on; `position: -1` is the last tile. Several pages with `-1` all go to the bottom.
- **Hiding a card.** `hidden-from-home: true` leaves the page out of the Home page. The page keeps its address and stays in the list of its section in the navigation.
- **Images of the grid.** The image tiles between the cards are notes too, made from [`templates/home-image-filler.md`](templates/home-image-filler.md): a title, a colour (`accent`), a `position` and one image. The image is uploaded and described as in a page, and the note holds nothing else. They are added to `contents.yaml` like any page. Two images cannot have the same position.
- **The credits page.** A page titled `Credits`, of type `about`, with `hidden-from-home: true`. The "Credits" link at the bottom of every page appears when this page exists.

## Updating and removing pages

| To… | Do this |
| --- | --- |
| see what the command would do, without changing anything | `npm run syncFromHedgeDoc -- --dry-run` |
| fetch one page again, after editing its note | `npm run syncFromHedgeDoc -- --force events/<page>` (the section and the name of the page, as in the list) |
| fetch every page again | `npm run syncFromHedgeDoc -- --refresh` |
| remove a page | delete its entry from `contents.yaml`, then run `npm run syncFromHedgeDoc -- --prune` |
| repair a damaged `contents.yaml` | `npm run syncFromHedgeDoc -- --rebuild-list` writes it again from the pages of the repository |

Without `--prune` nothing is ever deleted: a page taken off the list is only reported in the summary.

`contents.yaml` is written again at every run. Only the links matter: the titles and the dates are read from the pages, and comments added to the file are not kept. A link pasted in the wrong place, for example inside a section, is moved to the right one.

HedgeDoc may only be reachable from the network of the University of Bern: when the command says that it cannot reach the server, connect to that network or to its VPN and run it again.
