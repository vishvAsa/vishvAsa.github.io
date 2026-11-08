# GranthasangrahaH — `meta/` Directory

This directory contains conventions, mapping data, and maintenance scripts for
the PDF library at `/media/vvasuki/vData/text/granthasangrahaH`.

---

## Files

| File | Purpose |
|---|---|
| [`conventions.md`](conventions.md) | Naming and organisation conventions for the library |
| [`map.csv`](map.csv) | CSV map: `source_path` → `archive_urls` + `site_path`, importable in Google Sheets |
| [`update_map.py`](update_map.py) | Script to regenerate `map.csv` |
| [`.archive_cache.json`](.archive_cache.json) | Cached archive.org metadata (auto-generated, do not edit) |

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
- **`map_source`** — how the mapping was found (e.g. `size:<file>` / `md:<match>` / `ocr:<score>` / `correspondence:<score>` / `LLM-claude` for manually LLM-generated rows)

A PDF may appear with an empty cell for one field if only one mapping is known.

---

## Regenerating `map.csv`

Run:

```bash
~/gitland/python_venv/bin/python ~/gitland/vishvAsa/vishvAsa.github.io/content/interests/private/pdf-lib/update_map.py
```

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
> After renaming PDFs, run `update_map.py` to pick up the new paths.
> Existing archive.org metadata is cached, so only new archive items need
> to be fetched on subsequent runs.

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
`LLM-claude` (or another provenance label), e.g.:

```csv
source_path,archive_urls,site_path,map_source
AgamaH/vaiShNavaH/shrIvaiShNavaH/example.pdf,https://archive.org/details/example-identifier,https://vishvasa.github.io/AgamaH_vaiShNavaH/example/,LLM-claude
```

> [!CAUTION]
> `update_map.py` re-generates `map.csv` from scratch on each run —
> manual edits are overwritten on the next run unless they are re-applied.
