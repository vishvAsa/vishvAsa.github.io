# GranthasangrahaH — `meta/` Directory

This directory contains conventions and maintenance scripts for
the PDF library at `/media/vvasuki/vData/text/granthasangrahaH`.

The canonical database is maintained in Google Sheets via the Apps Script Web App.

---

## Files

| File | Purpose |
|---|---|
| [`conventions.md`](conventions.md) | Naming and organisation conventions for the library |
| [`appScript.gs`](appScript.gs) | Apps Script server code for Google Sheets |
| [`browse.html`](browse.html) / [`browse.js`](browse.js) | Web browser interface reading/editing the live sheet |
| [`.archive_cache.json`](.archive_cache.json) | Cached archive.org metadata (auto-generated, do not edit) |

> [!NOTE]
> `local_library.py` and the Apps Script client helpers live in doc_curation:
> `~/gitland/sanskrit-coders/doc_curation/hugo_site/`:
> `local_library.py`, `appscript_client.py`, `check_sheet.py`. The Apps Script
> *server* code (`appScript.gs`) stays here — paste it into Google Apps Script
> and deploy it as a Web App; the Python in `hugo_site/` calls its `/exec` URL.

---

## Sheet Format

Columns:
`source_path`, `archive_urls`, `site_path`, `map_source`, `Pending`

- **`source_path`** — PDF path relative to `granthasangrahaH/`
- **`archive_urls`** — archive.org item detail pages (not download links), newline-separated when multiple
- **`site_path`** — Hugo site URL, e.g. `https://vishvasa.github.io/AgamaH_vaiShNavaH/vaikhAnasaH/AgamaH/atri-saMhitA/samUrtArchanAdhikaraNam/`
  (derived from `AgamaH_vaiShNavaH/content/vaikhAnasaH/AgamaH/atri-saMhitA/samUrtArchanAdhikaraNam.md` by dropping `/content/` and `.md`, adding a trailing `/`; `_index.md` / `index.md` map to the directory URL), newline-separated when multiple
- **`map_source`** — how the mapping was found. Algorithmic rows use real sources (e.g. `size:<file>` / `md:<match>` / `ocr:<score>` / `correspondence:<score>`). LLM-curated rows are stamped with the backend label, e.g. `LLM-crouton` (current; default for fallback and Apps Script `userId`), `LLM-claude` (historical), etc. UT-Austin rows use `ut-dharma:<slug>`; fully manual PDF rows use `manual`.
- **`Pending`** — `add` for newly appended rows, `replace` for corrections to an existing `source_path`, blank once approved.

A PDF may appear with an empty cell for one field if only one mapping is known.

---

## Updating the Sheet from Local Library / Sites

Use `local_library` functions:

```python
from hugo_site import local_library

# Get all current spreadsheet entries:
entries = local_library.get_sheet_entries()

# Identify local PDFs missing from the spreadsheet and map them to site pages / archive:
new_rows = local_library.find_new_pdf_mappings(sheet_entries=entries)

# Sync/append new mappings to the Google Sheet (or use dry_run=True):
local_library.sync_new_pdfs_to_sheet(dry_run=True)
```

To inspect the Google Sheet via CLI:
```bash
# inspect (header / counts / last rows / --q regex)
~/gitland/python_venv/bin/python ~/gitland/sanskrit-coders/doc_curation/hugo_site/check_sheet.py --tail 5
```

Helpers: `local_library.py`, `appscript_client.py` (GET / POST edit / POST appendRows), `check_sheet.py`
— all in `hugo_site/`. The script URL is read from `browse.html` (or `--script-url` / `PDF_LIB_SCRIPT_URL`).

The matcher uses four strategies in order:

1. **File-size match** — queries archive.org for items uploaded by
   `kashcidv@gmail.com` / `vishvas.vasuki@gmail.com`, then matches each
   archive PDF to a local PDF by exact byte size (no disk reads needed —
   `stat()` only). Results are cached in `.archive_cache.json` and reused
   across runs.

2. **vishvAsa stem/title match** — scans all `.md` files in
   `~/gitland/vishvAsa`, extracts frontmatter titles, archive.org URLs, and
   PDF filename mentions, and matches them to local PDFs by normalised stem
   or title.

3. **OCR text fragment match** — for PDFs that have a `.pdf.txt` OCR sidecar
   but no MD match yet, builds an inverted-word index from vishvAsa MDs that
   reference archive.org, then finds the best-matching MD using weighted word
   voting. Threshold: score ≥ 1.5 (rarity-weighted word hits).

4. **Directory correspondence match** — applies subject directory hints.

> [!NOTE]
> The script reads `.pdf.txt` sidecars for OCR matching. These are Google
> Drive OCR outputs produced by `doc_curation.pdf.drive_ocr`. The matching
> works best when sidecars exist and contain substantial Latin-script text
> (transliterated Sanskrit or English).

---

## Conventions

See [`conventions.md`](conventions.md) for the full naming and directory
organisation rules. Quick summary:

- **File format**: `<author>_<title>.pdf` (OPTITRANS for Indian names/titles)
- **Author directories**: when an author has ≥ 2 works in a subfolder,
  group them into `<author>/` and drop the `<author>_` prefix
- **Multi-volume**: `<author>_<title>/1.pdf`, `2.pdf`, …
- **Sidecars**: `.pdf.txt`, `-double.pdf`, `_tiny.pdf` move with their `.pdf`
- **Filesystem**: exFAT — use two-step rename for case-only changes
