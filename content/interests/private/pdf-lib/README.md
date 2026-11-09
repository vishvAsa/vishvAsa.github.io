# GranthasangrahaH — `meta/` Directory

This directory contains conventions, mapping data, and maintenance scripts for
the PDF library at `/media/vvasuki/vData/text/granthasangrahaH`.

---

## Files

| File | Purpose |
|---|---|
| [`conventions.md`](conventions.md) | Naming and organisation conventions for the library |
| [`map.csv`](map.csv) | CSV map: `source_path` → `archive_urls` + `site_path`, importable in Google Sheets |
| — (moved) | Script to regenerate `map.csv` now lives in doc_curation: `~/gitland/sanskrit-coders/doc_curation/vishvaasa_sites/update_map.py` (see [Regenerating `map.csv`](#regenerating-mapcsv)) |
| [`.archive_cache.json`](.archive_cache.json) | Cached archive.org metadata (auto-generated, do not edit) |

> [!NOTE]
> `update_map.py` and the Apps Script client helpers moved to
> `~/gitland/sanskrit-coders/doc_curation/vishvaasa_sites/`:
> `update_map.py`, `appscript_client.py`, `push_map_to_sheet.py`,
> `check_sheet.py`. `map.csv` itself stays here. The Apps Script *server*
> code (`appScript.gs`) also stays here — paste it into Google Apps Script
> and deploy it as a Web App; the Python in `vishvaasa_sites/` only *calls*
> its `/exec` URL.

---

## `map.csv` — Format

Header:

```csv
source_path,archive_urls,site_path,map_source
```

- **`source_path`** — PDF path relative to `granthasangrahaH/`
- **`archive_urls`** — archive.org item detail pages (not download links), newline-separated when multiple
- **`site_path`** — Hugo site URL, e.g. `https://vishvasa.github.io/AgamaH_vaiShNavaH/vaikhAnasaH/AgamaH/atri-saMhitA/samUrtArchanAdhikaraNam/`
  (derived from `AgamaH_vaiShNavaH/content/vaikhAnasaH/AgamaH/atri-saMhitA/samUrtArchanAdhikaraNam.md` by dropping `/content/` and `.md`, adding a trailing `/`; `_index.md` / `index.md` map to the directory URL), newline-separated when multiple
- **`map_source`** — how the mapping was found. Algorithmic rows use real sources (e.g. `size:<file>` / `md:<match>` / `ocr:<score>` / `correspondence:<score>`). LLM-curated rows are stamped with the backend label, e.g. `LLM-crouton` (current; default for `update_map.py` fallback and Apps Script `userId`), `LLM-claude` (historical), etc. UT-Austin rows use `ut-dharma:<slug>`; fully manual PDF rows use `manual`.

A PDF may appear with an empty cell for one field if only one mapping is known.

---

## Regenerating `map.csv`

Run (note the script now lives in `doc_curation/vishvaasa_sites/`, while
`map.csv` itself stays in this `pdf-lib/` directory):

```bash
~/gitland/python_venv/bin/python ~/gitland/sanskrit-coders/doc_curation/vishvaasa_sites/update_map.py [--llm-label LLM-crouton]
```

`--llm-label` (default `LLM-crouton`) is stamped as `map_source` on rows with
no algorithmic source; use e.g. `--llm-label LLM-claude` for historical re-runs.

To mirror `map.csv` to the Google Sheet (Apps Script `/exec`):
```bash
# inspect (header / counts / last rows / --q regex)
~/gitland/python_venv/bin/python ~/gitland/sanskrit-coders/doc_curation/vishvaasa_sites/check_sheet.py --tail 5
# push rows missing from the sheet (new source_paths get Pending=add)
~/gitland/python_venv/bin/python ~/gitland/sanskrit-coders/doc_curation/vishvaasa_sites/push_map_to_sheet.py --dry-run
~/gitland/python_venv/bin/python ~/gitland/sanskrit-coders/doc_curation/vishvaasa_sites/push_map_to_sheet.py --mode edit
# clean appends (needs the newer appScript.gs with appendRows; Pending=add)
~/gitland/python_venv/bin/python ~/gitland/sanskrit-coders/doc_curation/vishvaasa_sites/push_map_to_sheet.py --mode append
```
> [!NOTE]
> Sheet `Pending` convention (set by `appScript.gs`): `add` for brand-new
> `source_path` rows, `replace` for corrections to an existing `source_path`,
> blank once approved. Redeploy `appScript.gs` after editing it.
Helpers: `appscript_client.py` (GET / POST edit / POST appendRows), `check_sheet.py`,
`push_map_to_sheet.py` — all in the same `vishvaasa_sites/` directory. The
script URL is read from `browse.html` (or `--script-url` / `PDF_LIB_SCRIPT_URL`).

The script uses four matching strategies in order:

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

4. **Writes** `map.csv` with all matched entries sorted alphabetically.

> [!NOTE]
> The script reads `.pdf.txt` sidecars for OCR matching. These are Google
> Drive OCR outputs produced by `doc_curation.pdf.drive_ocr`. The matching
> works best when sidecars exist and contain substantial Latin-script text
> (transliterated Sanskrit or English).

> [!TIP]
> After renaming PDFs, run `update_map.py` (from `doc_curation/vishvaasa_sites/`)
> to pick up the new paths. Existing archive.org metadata is cached, so only
> new archive items need to be fetched on subsequent runs.

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

---

## Extending the Map Manually

To add a mapping by hand, edit `map.csv` directly and set `map_source` to
`LLM-crouton` (current backend; use `LLM-claude` etc. for other backends),
`ut-dharma:<slug>` for UT-Austin rows, or `manual` for fully curated PDF rows, e.g.:

```csv
source_path,archive_urls,site_path,map_source
AgamaH/vaiShNavaH/shrIvaiShNavaH/example.pdf,https://archive.org/details/example-identifier,https://vishvasa.github.io/AgamaH_vaiShNavaH/example/,LLM-crouton
```

> [!CAUTION]
> `update_map.py` (in `doc_curation/vishvaasa_sites/`) re-generates `map.csv`
> on each run. Only rows with `ut-dharma:*` (in `source_path` or `map_source`)
> or `map_source == "manual"` are preserved automatically; all other manual
> edits are overwritten on the next run unless re-applied. Use `--llm-label`
> to control the fallback label for no-source rows.
