+++
title = "Meta-site"
+++

## Build stats

### Overview & Summary (Post-Optimization: Nov 7, 2026)

- **Total Hugo sites**: 29 (all active on GitHub Actions)
- **Total pages generated**: 141,973 (down from 159,013 after eliminating 17,040 redundant section `index.json` outputs)
- **Total Hugo build time**: **8m 30s** (down from **54m 24s** — **6.4x fleet speedup**)
- **Total GitHub Actions workflow time**: **1h 05m 16s** (down from **1h 55m 48s** — saved **50m 32s**)
- **Key Optimizations applied to `themes/sanskrit-documentation-theme-hugo`**:
  1. **Removed quadratic section loop**: Removed `layouts/section/list.json.json`, which was redundantly iterating over all `.Site.RegularPages` on every section (saving 11M–30M template loop iterations on large sites like `notes` and `mahAbhAratam`).
  2. **Template caching**: Switched `mathjax_tex_commands.html`, static `head_stylesheets.html`, and `article-params-card` to `partialCached`.
  3. **Optimized link generation**: Stored `.Permalink` once in a local variable in `head_links.html` instead of evaluating it 43 times per page.
- **Non-Hugo repositories under `~/gitland/vishvAsa/`**: `agnirahas.bitbucket.org` (Bitbucket static), `book-pub` (book publisher), `image-pub` (image assets).

### Major Speedup Highlights

| Site | Pages | Old Hugo Time | New Hugo Time | Speedup | Old Workflow | New Workflow |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| [notes](https://github.com/vishvAsa/notes) | 11,874 | 14m 24s | **21.9s** | **39.4x** | 17m 07s | **2m 03s** |
| [gItam_vaiShNavam](https://github.com/vvasuki/gItam_vaiShNavam) | 16,129 | 5m 13s | **23.0s** | **13.6x** | 6m 40s | **1m 36s** |
| [mahAbhAratam](https://github.com/vishvAsa/mahAbhAratam) | 15,775 | 9m 08s | **53.2s** | **10.3x** | 16m 13s | **5m 11s** |
| [vedAH_yajuH](https://github.com/vishvAsa/vedAH_yajuH) | 10,818 | 5m 45s | **43.9s** | **7.9x** | 10m 07s | **4m 38s** |
| [rAmAnujIyam](https://github.com/vishvAsa/rAmAnujIyam) | 10,747 | 6m 41s | **1m 03s** | **6.4x** | 11m 22s | **5m 17s** |
| [mAdhvam](https://github.com/vishvAsa/mAdhvam) | 5,449 | 1m 10s | **12.3s** | **5.7x** | 3m 13s | **1m 32s** |
| [AgamaH](https://github.com/vishvAsa/AgamaH) | 6,138 | 1m 27s | **19.7s** | **4.4x** | 4m 19s | **2m 03s** |
| [devaH](https://github.com/vishvAsa/devaH) | 2,143 | 9.1s | **2.3s** | **4.0x** | 1m 10s | **56s** |
| [AgamaH_shaivaH](https://github.com/vishvAsa/AgamaH_shaivaH) | 3,680 | 50.2s | **13.5s** | **3.7x** | 3m 29s | **4m 22s** |
| [rAmAyaNam](https://github.com/vishvAsa/rAmAyaNam) | 7,444 | 1m 26s | **23.8s** | **3.6x** | 2m 40s | **3m 25s** |
| [purANam_vaiShNavam](https://github.com/vishvAsa/purANam_vaiShNavam) | 7,478 | 1m 56s | **35.2s** | **3.3x** | 8m 55s | **3m 43s** |
| [purANam](https://github.com/vishvAsa/purANam) | 5,824 | 1m 01s | **20.0s** | **3.0x** | 2m 57s | **2m 22s** |
| [AgamaH_vaiShNavaH](https://github.com/vishvAsa/AgamaH_vaiShNavaH) | 5,847 | 1m 09s | **26.7s** | **2.6x** | 3m 58s | **2m 57s** |

### All 29 Hugo Sites — Build Times & GitHub Actions Stats

| Site | Pages | Hugo Build Time | Build Step | Total Job | Total Workflow | Latest Build Run | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [AgamaH](https://github.com/vishvAsa/AgamaH) | 6,138 | 19.7s | 20s | 1m 59s | 2m 03s | [2026-11-07 (master)](https://github.com/vishvAsa/AgamaH/actions/runs/42340585693) | ✓ Success |
| [AgamaH_brAhmaH](https://github.com/vishvAsa/AgamaH_brAhmaH) | 3,330 | 13.0s | 13s | 2m 13s | 2m 17s | [2026-11-07 (master)](https://github.com/vishvAsa/AgamaH_brAhmaH/actions/runs/42340589689) | ✓ Success |
| [AgamaH_shaivaH](https://github.com/vishvAsa/AgamaH_shaivaH) | 3,680 | 13.5s | 14s | 4m 18s | 4m 22s | [2026-11-07 (master)](https://github.com/vishvAsa/AgamaH_shaivaH/actions/runs/42340593955) | ✓ Success |
| [AgamaH_vaiShNavaH](https://github.com/vishvAsa/AgamaH_vaiShNavaH) | 5,847 | 26.7s | 28s | 2m 54s | 2m 57s | [2026-11-07 (master)](https://github.com/vishvAsa/AgamaH_vaiShNavaH/actions/runs/42340598778) | ✓ Success |
| [bhAShAntaram](https://github.com/vishvAsa/bhAShAntaram) | 548 | 1.3s | 2s | 36s | 40s | [2026-11-07 (master)](https://github.com/vishvAsa/bhAShAntaram/actions/runs/42340602077) | ✓ Success |
| [devaH](https://github.com/vishvAsa/devaH) | 2,143 | 2.3s | 3s | 52s | 56s | [2026-11-07 (master)](https://github.com/vishvAsa/devaH/actions/runs/42340606886) | ✓ Success |
| [english](https://github.com/vishvAsa/english) | 1,070 | 1.9s | 2s | 28s | 32s | [2026-11-07 (master)](https://github.com/vishvAsa/english/actions/runs/42340611978) | ✓ Success |
| [gItam_vaiShNavam](https://github.com/vvasuki/gItam_vaiShNavam) | 16,129 | 23.0s | 24s | 1m 32s | 1m 36s | [2026-11-07 (master)](https://github.com/vishvAsa/gItam_vaiShNavam/actions/runs/42340614989) | ✓ Success |
| [jyotiSham](https://github.com/vishvAsa/jyotiSham) | 662 | 3.5s | 4s | 41s | 44s | [2026-11-07 (master)](https://github.com/vishvAsa/jyotiSham/actions/runs/42340619963) | ✓ Success |
| [kalpAntaram](https://github.com/vishvAsa/kalpAntaram) | 4,590 | 24.0s | 24s | 2m 43s | 2m 47s | [2026-11-07 (master)](https://github.com/vishvAsa/kalpAntaram/actions/runs/42340628922) | ✓ Success |
| [kannaDa](https://github.com/vishvAsa/kannaDa) | 174 | 463 ms | 1s | 30s | 34s | [2026-11-07 (master)](https://github.com/vishvAsa/kannaDa/actions/runs/42340633534) | ✓ Success |
| [kAvyam](https://github.com/vishvAsa/kAvyam) | 4,623 | 18.1s | 19s | 1m 45s | 1m 49s | [2026-11-07 (master)](https://github.com/vishvAsa/kAvyam/actions/runs/42340624554) | ✓ Success |
| [mAdhvam](https://github.com/vishvAsa/mAdhvam) | 5,449 | 12.3s | 13s | 1m 28s | 1m 32s | [2026-11-07 (master)](https://github.com/vishvAsa/mAdhvam/actions/runs/42340637524) | ✓ Success |
| [mahAbhAratam](https://github.com/vishvAsa/mahAbhAratam) | 15,775 | 53.2s | 54s | 5m 07s | 5m 11s | [2026-11-07 (master)](https://github.com/vishvAsa/mahAbhAratam/actions/runs/42340645405) | ✓ Success |
| [mImAMsA](https://github.com/vishvAsa/mImAMsA) | 778 | 4.8s | 5s | 51s | 54s | [2026-11-07 (master)](https://github.com/vishvAsa/mImAMsA/actions/runs/42340641369) | ✓ Success |
| [notes](https://github.com/vishvAsa/notes) | 11,874 | 21.9s | 22s | 1m 59s | 2m 03s | [2026-11-07 (master)](https://github.com/vishvAsa/notes/actions/runs/42340649290) | ✓ Success |
| [pALi](https://github.com/vishvAsa/pALi) | 3,895 | 23.6s | 24s | 2m 38s | 2m 41s | [2026-11-07 (master)](https://github.com/vishvAsa/pALi/actions/runs/42340652707) | ✓ Success |
| [purANam](https://github.com/vishvAsa/purANam) | 5,824 | 20.0s | 21s | 2m 16s | 2m 22s | [2026-11-07 (master)](https://github.com/vishvAsa/purANam/actions/runs/42340656795) | ✓ Success |
| [purANam_vaiShNavam](https://github.com/vishvAsa/purANam_vaiShNavam) | 7,478 | 35.2s | 36s | 3m 35s | 3m 43s | [2026-11-07 (master)](https://github.com/vishvAsa/purANam_vaiShNavam/actions/runs/42340660439) | ✓ Success |
| [rahaShTippanyaH](https://github.com/vishvAsa/rahaShTippanyaH) | 1,561 | 4.7s | 5s | 37s | 52s | [2026-11-07 (master)](https://github.com/vishvAsa/rahaShTippanyaH/actions/runs/42340672671) | ✓ Success |
| [rAmAnujIyam](https://github.com/vishvAsa/rAmAnujIyam) | 10,747 | 1m 03s | 1m 04s | 5m 06s | 5m 17s | [2026-11-07 (master)](https://github.com/vishvAsa/rAmAnujIyam/actions/runs/42340664025) | ✓ Success |
| [rAmAyaNam](https://github.com/vishvAsa/rAmAyaNam) | 7,444 | 23.8s | 24s | 2m 30s | 3m 25s | [2026-11-07 (master)](https://github.com/vishvAsa/rAmAyaNam/actions/runs/42340668147) | ✓ Success |
| [sanskrit](https://github.com/vishvAsa/sanskrit) | 2,448 | 6.3s | 6s | 1m 11s | 1m 16s | [2026-11-07 (master)](https://github.com/vishvAsa/sanskrit/actions/runs/42340676719) | ✓ Success |
| [tipiTaka](https://github.com/vishvAsa/tipiTaka) | 4,220 | 12.3s | 13s | 1m 07s | 1m 26s | [2026-11-07 (master)](https://github.com/vishvAsa/tipiTaka/actions/runs/42340680671) | ✓ Success |
| [vedAH](https://github.com/vishvAsa/vedAH) | 3,247 | 12.0s | 12s | 1m 39s | 2m 34s | [2026-11-07 (master)](https://github.com/vishvAsa/vedAH/actions/runs/42340684914) | ✓ Success |
| [vedAH_Rk](https://github.com/vishvAsa/vedAH_Rk) | 3,259 | 19.0s | 20s | 2m 34s | 2m 50s | [2026-11-07 (master)](https://github.com/vishvAsa/vedAH_Rk/actions/runs/42340689887) | ✓ Success |
| [vedAH_sAma](https://github.com/vishvAsa/vedAH_sAma) | 2,661 | 5.6s | 6s | 53s | 1m 55s | [2026-11-07 (master)](https://github.com/vishvAsa/vedAH_sAma/actions/runs/42340694142) | ✓ Success |
| [vedAH_yajuH](https://github.com/vishvAsa/vedAH_yajuH) | 10,818 | 43.9s | 45s | 4m 17s | 4m 38s | [2026-11-07 (master)](https://github.com/vishvAsa/vedAH_yajuH/actions/runs/42340698563) | ✓ Success |
| [vishvAsa.github.io](https://github.com/vishvAsa/vishvAsa.github.io) | 103 | 251 ms | 0s | 19s | 1m 20s | [2026-11-07 (master)](https://github.com/vishvAsa/vishvAsa.github.io/actions/runs/42340702863) | ✓ Success |

<details><summary>LLM update command</summary>

In this section, above this details block, update actual github actions hugo build times for all hugo sites at ~/gitland/vishvAsa/. 
</details>
