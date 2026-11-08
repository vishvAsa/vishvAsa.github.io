+++
title = "Conventions"
+++


Naming and Organization Conventions

## 1. Directory Hierarchy
- The library is organized at the top level by **subject (`shAstra` / topic)** (e.g., `AgamaH`, `bhAShA`, `gaNitam`, `itihAsaH`, `jyotiSha`, `kalpaH`, `kAvyam`, `koshaH`, `mImAMsA`, `purANam`, `stotram`, `vedAH`, `vyAkaraNam`, etc.) and further subdivided by **tradition or sub-discipline** where applicable (e.g., `AgamaH/brAhmaH/`, `AgamaH/vaiShNavaH/shrIvaiShNavaH/`, `AgamaH/vaiShNavaH/vaikhAnasaH/`).
- All author-based file naming and author-directory grouping takes place **within each existing subject/tradition subfolder**, preserving the topical hierarchy.

## 2. File Naming Format (`<author>_<title>.pdf`)
For standalone single-volume works where the author has only one work in the current subfolder:
```
<author>_<title>.pdf
```
- **`<author>`**: Unique, short, clear author name.
  - **Hindu / Indian traditional authors**: Transliterated in **OPTITRANS** (`indic_transliteration.sanscript.OPTITRANS`), hyphenating compound name parts, typically in Sanskrit nominative singular where appropriate (e.g., `vRndAvana-rangaH`, `bellamkoNDa-rAmarAyaH`, `madhusUdana-sarasvatI`, `sudarshana-pAnchanadaH`, `mahAchAryaH`, `uttamUr-vIrarAghavAchAryaH`).
  - **Non-Hindu / Western / modern non-Indic authors**: Concise lowercase hyphenated Latin name (typically surname, or `firstname-surname` / `initials-surname` when needed for uniqueness, e.g., `gonda`, `witzel`, `haug`, `nakamura`, `van-buitenen`, `kc-varadAchAri`).
- **`<title>`**: Unique, short, meaningful book title.
  - **Indian / Sanskrit titles**: Transliterated in **OPTITRANS** with hyphenated words/stems (e.g., `durjana-mukha-bhanga-chapetikA`, `vyAsa-tAtparya-nirNayaH`, `advaitAmRtam`, `shArIraka-chatus-sUtrI-vichAraH`).
  - **English / non-Indian titles**: Concise lowercase hyphenated English keywords (e.g., `early-vedAnta-history`, `dual-deities`, `pArsi-religion`).
- **Example**: `vRndAvana-rangaH_durjana-mukha-bhanga-chapetikA.pdf`
- **Anonymous / Scriptural Works**: When a work is an anonymous traditional text (e.g., a Samhita, Purana, or Agama without a single human author), use the editor/commentator/translator as the disambiguator (e.g., `<title>_<editor-or-commentator>.pdf` or `<editor>_<title>.pdf`), or `<title>.pdf` if no author or editor is identifiable.

## 3. Author Directories (Multiple Works by the Same Author)
- When there are **multiple books by the same author** within a given subject/tradition subfolder, place them in a subdirectory named `<author>/` (formatted according to the `<author>` rules above).
- Inside an `<author>/` directory, **omit the `<author>_` prefix** from the filenames:
  ```
  <subfolder>/<author>/<title>.pdf
  ```
  For example:
  - `AgamaH/brAhmaH/bellamkoNDa-rAmarAyaH/advaitAmRtam.pdf`
  - `AgamaH/brAhmaH/bellamkoNDa-rAmarAyaH/shankarAshankara-bhAShya-vimarshaH.pdf`

## 4. Multi-Volume Works
- Multiple volumes or parts of the same book are grouped into a subdirectory named after the book:
  - If the author has only this book in the subfolder: `<subfolder>/<author>_<title>/1.pdf`, `2.pdf`, ... (or `v1.pdf`, `part-1.pdf`).
  - If inside an `<author>/` directory: `<subfolder>/<author>/<title>/1.pdf`, `2.pdf`, ...
- Individual volume files inside a book directory retain concise volume identifiers (`1.pdf`, `2.pdf`, `v1.pdf`, etc.).

## 5. Commentaries, Translations, and Editions
- File and name works by the **primary author of the specific work**:
  - Standalone commentaries, sub-commentaries, monographs, or translations are filed under the commentator/author/translator.
  - Editions primarily presenting a root (`mUla`) text with a specific commentary/translation or editor should include a short commentator/editor/language suffix on the title (e.g., `_<commentator>`, `_hi`, `_kn`, `_en`) to stay unique and clear.

## 6. Companion Files (`.pdf.txt`, `-double.pdf`, `_tiny.pdf`) and Deduplication
- **`.pdf.txt` sidecars**: Every `.pdf.txt` file must be renamed and moved in lockstep with its `.pdf` file so that `<name>.pdf` always pairs with `<name>.pdf.txt`.
- **Variant PDFs**:
  - Two-page spread scans keep the `-double.pdf` suffix: `<base>-double.pdf`.
  - Compressed / reduced-size variants keep the `_tiny.pdf` suffix: `<base>_tiny.pdf`.
- **Duplicates**: Exact byte-identical duplicate PDFs (and redundant `.pdf.txt` sidecars) should be removed, keeping only the canonically named file.

## 7. Exempt Special Collections
- **Periodicals / Magazines** (e.g., `bhAShA/` *Chandamama* archives, `mag/`): Retain their issue-based naming (`<magazine>_<lang>_<YYYY>_<MM>.pdf` or `<YYYY>_<MM>.pdf`).
- **Scriptural Per-Sukta / Per-Section Splits** (e.g., `vedAH/shAkalam/rangan/m01`–`m10/1.pdf`..`192.pdf`): Retain their numeric structural hierarchy.

## 8. Filesystem Technical Note (exFAT)
- `/media/vvasuki/vData` is mounted on an **exFAT** (case-insensitive, case-preserving) filesystem.
- When renaming a file or directory where only the letter casing changes (`src.lower() == dst.lower()`), perform a two-step rename via a temporary path (`src -> src + "__tmp" -> dst`), and always verify `not os.path.samefile(src, dst)` before treating `os.path.exists(dst)` as a collision or duplicate.

