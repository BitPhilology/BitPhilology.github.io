---
# This area is called "Frontmatter" and it is used to specify the post metadata (title, date, type, etc.)

# type can be either: about (fallback option), artifact, publication, event, team
type: about
tags: website/page # for HedgeDoc

# the title is displayed in the home post card and int he post single page. Currently there is no subtitle
title: About Bit Philology

# Publication or happening date. Please use YYYY or YYYY-MM-DD format.
date: 2025-09-29

# the location of an event, or the publication venue of a contribution
venue: Universität Bern

# if this is a publication, which type? The field is ignored for other posts types
publication-type: poster

# keywords are visibile in home grid only for artifacts.
keywords:
- lorem
- ipsum
- dolor

# list of advisory board members, shown where the text has the {{advisory-board}} marker.
# Only the name is required: a member without affiliation or externalURL is shown without it.
advisory_board:
- name: Emmanuela Carbé
  affiliation: Università Ca' Foscari Venezia
  externalURL: https://www.unive.it/persone/emmanuela.carbe

- name: Paola Maria Carmela Italia
  affiliation: Università di Bologna
  externalURL: https://www.unibo.it/sitoweb/paola.italia/en

- name: Matthew G. Kirschenbaum
  affiliation: University of Virginia
  externalURL: https://english.as.virginia.edu/people/matthew-kirschenbaum

- name: Elena Pierazzo
  affiliation: Université de Tours
  externalURL: https://cesr.cnrs.fr/membre/pierazzo-elena/

- name: Thorsten Ries
  affiliation: The University of Texas at Austin
  externalURL: https://liberalarts.utexas.edu/eue/faculty/tr24969

- name: Francesca Tomasi
  affiliation: Università di Bologna
  externalURL: https://www.unibo.it/sitoweb/francesca.tomasi/en

- name: Joris van Zundert
  affiliation: Huygens Institute (KNAW)
  externalURL: https://jorisvanzundert.net/

# position of the card in the Home grid: 1 is the first tile, 2 the second…; -1 is the last tile.
# Leave it empty to follow the date (newest first).
position: 2
source: https://pad.dsl.unibe.ch/IMcrjOtPTSuAKrw46RXggg
importedAt: 2026-09-30T18:43:03Z

# ⭐️ USEFUL TO KNOW ⭐️

# The first paragraph is by default interpreted as a "lead paragraph" and is rendered slighlty bigger than the following. To prevent the default behaviour use "[no-lead]" at the beginning of the first line.

# The syntax to insert images is the following:
# ![alt text (to improve accessibility and screen reader functionality)](url-to-the-image.png "Caption")
# Here the alt text (first string) is for accessibility/screen readers, while the title (in quotes) becomes the visible caption text. This is the cleanest pattern because it separates the two responsibilities: alt = description for those who cannot see the image, title = editorial caption, which can be longer or more formal.

# To insert side notes use this sintax:
# - define a note label that is unique, e.g., "note-unique-label"
# - in the text write [^note-unique-label] to insert the reference to the note
# - in any place of the document write the text of the note as an independent paragraph like this -> [^note-unique-label]: Text of the note...
---

Today, much **literature** is created ~~on paper~~ *digitally*. Literary archives, which preserve the manuscripts of writers, increasingly include digital documents (known as *born-digital*), which pose challenges for their study. The **Bit Philology project** will propose innovative solutions for describing, editing and analyzing digital literary archives, while meeting the scientific and societal needs of our digital age.

![Two big circles with a hole in the middle, their surface is covered with radial sectors and rings (simialr to trees) colored by various red shades](./assets/cb0c1dae-48b9-432a-8b56-7190a99aa412.webp
 "A floppy disk, seen as magnetic traces. Both sides of one disk, showing the raw magnetic signal a drive reads before it becomes files. Each thin ring is a track (a circular path the read head follows). The finely striped grey wedges are sectors (blocks of data), the lighter bands are the markers between them, and the smooth, even area on the right is empty filler space at the end of each track.")

Philology is a discipline that is thousands of years old [^philology-ref]. Textual scholars have studied and continue to study papyri, manuscripts, epigraphic and printed sources, and have developed methodological tools to work with texts preserved in different forms and on different media. But what happens when a text is born digital? A growing number of born-digital texts are currently being archived, including documents of historical importance and literary material. This project focuses on the latter, the born-digital literary archive, as a source for the philology of the present and the future.

[^philology-ref]: For an accessible introduction, see James Turner, *Philology: The Forgotten Origins of the Modern Humanities* (Princeton University Press, 2014).

Scholarship on born-digital sources [^born-digital-ref] has identified the need for a rethinking of traditional methodologies in order to transform the born-digital source into a scholarly object of study. The Bit Philology project seeks to respond to this need by **describing**, **editing** and **analyzing** born-digital literary sources. The aim of the project is to establish a methodological and technical toolkit for the study of born-digital literary sources created before the advent of cloud computing. The project is highly interdisciplinary and will combine approaches from digital humanities (data modeling, distant reading); authorial philology (filologia d’autore) and genetic criticism (critique génétique); the philological tradition concerned with the materiality of textual documents (filologia materiale, material bibliography, digital forensics); media and software studies; information design.

[^born-digital-ref]: Born-digital materials are texts and documents created on computers rather than digitised from paper. For an accessible introduction on how scholars study them, see Matthew G. Kirschenbaum, *Bitstreams: The Future of Digital Literary Heritage* (University of Pennsylvania Press, 2021)

#### Project outline
The project is organised around 3 main actions.

* Description of born-digital archives
* Edition of born-digital archives
* Analysis: looking for genetic dossiers

#### Advisory Board

The project is accompanied by an international advisory board. Its members are scholars based at universities and research institutes in Europe and the United States, and their work covers the fields the project draws on: authorial philology and the study of Italian literature, digital scholarly editing and text encoding, born-digital archives and digital forensics, archival science, and computational literary studies.

{{advisory-board}}
