+++
title = "LLM tasks"
+++

## General Software
Find and fix TODOs.

Review existing code.

## vedAH yajuH
Fill and update Arsheya krama files, by fixing and extending /home/vvasuki/gitland/sanskrit-coders/doc_curation/doc_curation_projects/veda/yajuH/taittiriiyam/aarsheya.py (spreadsheet at https://docs.google.com/spreadsheets/d/1xFXhg__yitgiECypnO5KAc9Xbe8cTzt-9dZD3AqpmtU/)

## LLM configuration
Move the below from global instructions to a new md_to_pdf skill -

> Update and use
`doc_curation_projects/general_tasks/ebooks.py` for producing epubs and pdf-s from markdown.


## Pdf making
Create taittirIya text pdfs in ArSheya krama - 1 for each kANDa. Call accent.add_dependent_accents , and add a function to tag udAtta-s red while making the md (pass a new argument to supply md_transformer to the functions called in md_to_pdf skill for this.) in the epub css, ensure that the red tags used are made to appear red.

## Archiving

dump_google_groups - Fix it to pick up start url from the last messaged saved in the archive

add code to scrape blogspot sites like https://koenraadelst.blogspot.com/ and call it to dump to koenraadelst dir in the usual location.

IN our catalog, where source path points to pdf location under granthasangraha, prefix "vv-pdfs:". Update scripts accordingly.

Using /home/vvasuki/gitland/sanskrit-coders/doc_curation/doc_curation_projects/misc/muktabodha.py, Update our archive and copy over files to our site. Map new text locii to pages in our site in our drive catalog, with prefix muktabodha: FILE_NAME. For muktabodha sources missing in the map, find them by looking for muktabodha metadata (and if necessary, seeking unique contents) - add and use a function for this. 

pdf to md major rAmAnujIya texts.



## AgamaH
### Greek epics
save https://www.gutenberg.org/files/1727/1727-h/1727-h.htm to /home/vvasuki/gitland/vishvAsa/AgamaH/content/AryaH/mediterranian/purANam/odyssey/en/butler/  (split by chapters using splitter)

