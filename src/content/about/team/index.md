---
# This area is called "Frontmatter" and it is used to specify the post metadata (title, date, type, etc.)

# type can be either: about (fallback option), artifact, publication, event, team
type: team
tags: website/team-page # for HedgeDoc

# the title is displayed in the home post card and int he post single page. Currently there is no subtitle
title: Team

# Publication or happening date. Please use YYYY or YYYY-MM-DD format.
date: 2025-09-29

# list of team members
members:
- name: Prof. Dr. Elena Spadini
  role: Principal Investigator
  affiliation: Universität Bern
  photo: ./assets/ElenaSpadini_eng.jpg
  externalURL: https://www.dh.unibe.ch/about_us/people/prof_dr_spadini_elena/index_eng.html

- name: Elena Barchielli
  role: PhD Student
  affiliation: Universität Bern
  photo: ./assets/ElenaBarilli_eng.png
  externalURL: https://www.dh.unibe.ch/about_us/people/barchielli_elena/index_eng.html

- name: Simon Willemin
  role: PhD Student
  affiliation: Universität Bern
  photo: ./assets/portrait-660_SimonFrancoisWille_eng.png
  externalURL: https://www.dh.unibe.ch/about_us/people/willemin_simon/index_eng.html

- name: Tommaso Elli
  role: Research Associate
  affiliation: Universität Bern
  photo: https://picsum.photos/200
  externalURL: https://example.com/tommaso-elli

# list of advisory board members
advisory_board:
- name: Emmanuela Carbé
  role: Advisory Board Member
  affiliation: Università Ca' Foscari Venezia
  photo: https://picsum.photos/200
  externalURL: https://example.com/emmanuela-carbe

- name: Paola Maria Carmela Italia
  role: Advisory Board Member
  affiliation: University of Sussex
  photo: https://picsum.photos/200
  externalURL: https://example.com/paola-italia

- name: Matthew G. Kirschenbaum
  role: Advisory Board Member
  affiliation: University of Maryland
  photo: https://picsum.photos/200
  externalURL: https://example.com/matthew-kirschenbaum

- name: Elena Pierazzo
  role: Advisory Board Member
  affiliation: Université de Tours
  photo: https://picsum.photos/200
  externalURL: https://example.com/elena-pierazzo

- name: Thorsten Ries
  role: Advisory Board Member
  affiliation: The University of Texas at Austin
  photo: https://picsum.photos/200
  externalURL: https://example.com/thorsten-ries

- name: Francesca Tomasi
  role: Advisory Board Member
  affiliation: Università di Bologna
  photo: https://picsum.photos/200
  externalURL: https://example.com/francesca-tomasi

- name: Joris van Zundert
  role: Advisory Board Member
  affiliation: Huygens Institute (KNAW)
  photo: https://picsum.photos/200
  externalURL: https://example.com/joris-van-zundert

pinned: false
source: https://pad.dsl.unibe.ch/eXfd9t1LQui9OWZKRwYY0A
importedAt: 2026-09-30T22:31:56Z

# ⭐️ USEFUL TO KNOW ⭐️

# The first paragraph is by default interpreted as a "lead paragraph" and is rendered slighlty bigger than the following. To prevent the default behaviour use "[no-lead]" at the beginning of the first line.

# The sintax to insert images is the following:
# ![alt text (to improve accessibility and screen reader functionalitis)](url-to-the-image.png "Caption")
# Qui l'alt (prima stringa) resta per l'accessibilità/screen reader, il title (tra virgolette) diventa il testo visibile della caption. È il pattern più pulito perché separa le due responsabilità: alt = descrizione per chi non vede l'immagine, title = didascalia editoriale che può essere più lunga o formale.

# To insert side notes use this sintax:
# - in the text write [^note-unique-label] to insert the reference to the note
# - in any place of the document write the text of the note as an independent paragraph like this -> [^note-unique-label]: Text of the note...
---

The team working on the research project is composed by experts in Phylology, Digital Archives, Digital Born Materials, Information Visualization, and Digital Design.

Suspendisse in magna id leo semper rutrum. Aliquam erat volutpat. Vivamus vel arcu nulla. Aenean non mi metus. Integer vulputate gravida sapien, id imperdiet nunc lacinia vel. Nam nulla nisi, porttitor eu laoreet et, commodo a mi. Donec nisi nisl, dignissim at malesuada nec, feugiat convallis nunc. Fusce tempus risus at dignissim vulputate.

{{team}}

### Advisory Board

Vivamus imperdiet id eros sed gravida. Praesent vehicula enim eu facilisis hendrerit. Nunc quam metus, molestie vel convallis sit amet, blandit vitae nibh. Donec gravida ipsum ac dignissim fringilla. In efficitur dui mattis, vulputate nibh id, tempus sem. Donec imperdiet efficitur eros a pharetra. Sed id sem pretium, pretium mi in, bibendum massa.

Fusce ac posuere erat. Nullam egestas dolor sollicitudin, posuere nulla eu, porttitor ipsum. Cras ac tincidunt velit, at luctus nibh. Ut aliquet vel magna sit amet imperdiet. Aliquam sagittis felis eu nibh accumsan maximus. Praesent imperdiet nibh pretium dictum hendrerit. Quisque eu sodales magna, sit amet efficitur lorem. Proin vulputate erat ullamcorper posuere molestie.

{{advisory-board}}
