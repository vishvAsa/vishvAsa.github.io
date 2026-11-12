+++
title = "LLM tasks"
+++

## vedAH yajuH
Add and apply a function wrap_in_detail(details_included=".*", details_excluded=["विश्वास-प्रस्तुतिः", "भास्करोक्त-विनियोगः", "सायणोक्त-विनियोगः"], wrapper_title="सर्वाष् टीकाः", wrapper_params=None) in details.maker, with these arguments being default values, except details_excluded=["विश्वास-प्रस्तुतिः"] being default. Note that the argument strings are all patterns.

similarly, wrap "भास्करोक्त-विनियोगः", "सायणोक्त-विनियोगः" into विनियोगः.

<details><summary>LLM Prompt</summary>

brAhmaNa vishvAsa-prastutiH, mUlam and TIkA blocks should be split more finely.
Let sentence segment represent a string ending with a daNDa (।). Generally they should each go to a separate block, except in the following cases, checked sequentially -

If multiple sentence segments form a Rk, they stay together.

Where there is an "if" (like यः, यत्, यत्र etc.), the sentence segment should be attached to a previous sentence segment. For example - 

> यः का॒मये॑त॒ दान॑कामा मे प्र॒जाः स्यु॒रिति॑  
। स पूर्व॑योः॒ फल्गु॑न्योर॒ग्निमाद॑धीत ॥,  

> `अ॒र्य॒म्णो वा ए॒तन्नक्ष॑त्रम् । यत्पूर्वे॒ फल्गु॑नी ।,  

> `यः का॒मये॑त भ॒गी स्या॒मिति॑ । स  
उत्त॑रयोः॒ फल्गु॑न्योर॒ग्निमाद॑धीत ।`. 

> य᳓ एवं᳓ वे᳓द ॥
गृह्य् ए᳙व᳓ भवति ॥

> या᳓नि वा᳓ इमा᳓नि पृथिव्या᳓श् चित्रा᳓णि ॥
ता᳓नि न᳓क्षत्राणि ॥

> य᳓द् अपिवापा᳓ भ᳓वन्ति ॥
यज्ञ᳓स्य धृ᳓त्या अ᳓संव्लयाय ॥

Sometimes, a quotation is embedded within an "if" clause - in that case, the broader group of sentence segments should stay together. For example -

> स᳓ य᳓द् ब्रूया᳓त् ॥
क᳓स् ता᳓नि नि᳓रमिमी᳓त_इ᳓ति ॥  
प्रजा᳓पतिर् इ᳓ति ब्रूयात् ॥

> स᳓ य᳓द् ब्रूया᳓त् ॥
कु᳓तस् ता᳓नि नि᳓रमिमीत_इ᳓ति ॥  
आत्म᳓न इ᳓ति ॥


Where multiple sentences are part of a quote, they should stay together. For example -  

> सो॑ऽब्रवीत् ।  
 स॒प्त॒द॒शेन॑ ह्रि॒यमा॑णो॒ व्य॑लेशिषि । भि॒षज्य॑त॒मेति॑ । , 

> तदा॑हुः ॥ १। ५। ११। २॥ ५६ यद॒श्विभ्यां॑ धा॒नाः । पू॒ष्णः क॑र॒म्भः । भार॑त्यै परिवा॒पः । मि॒त्रावरु॑णयोः पय॒स्याऽथ॑ । कस्मा॑दे॒तेषाँ॑ ह॒विषा॒मिन्द्र॑मे॒व य॑ज॒न्तीति॑ ।

> ब्रह्मवादि᳓नो वदन्ति ॥
क᳓ति पा᳓त्राणि यज्ञं᳓ वहन्ति_इ᳓ति ॥

</details>


Finish Dumont md cleanup.

AraNyaka and kAThaka - make vishvAsa prastutiH and mUla details as was done elsewhere. Interleave bhaTTa-bhAskara commentary. 

Replace all Apo hi ShThA etc. Rks with corresponding shAkala includes - be sure to record any fresh commentary in the included files.

Seuqentially in each anuvAka (saMhitA, brAhmaNa, AraNyaka, kAThaka) do the below -  
- if a Rk already exists in shAkala or in /home/vvasuki/gitland/vishvAsa/vedAH_yajuH/static/taittirIyam/sArasvata-vibhAgaH/brAhmaNam/Rk/vishvAsa-prastutiH or /home/vvasuki/gitland/vishvAsa/vedAH_yajuH/static/taittirIyam/sArasvata-vibhAgaH/saMhitA/Rk/sarvASh_TIkAH , include it and continue to the next Rk.
- else, migrate_and_include_mantras from /home/vvasuki/gitland/sanskrit-coders/doc_curation/doc_curation_projects/veda/yajuH/taittiriiyam/braahmaNam.py .

Identify repeated non-Rk blocks, and similarly apply an analog of migrate_and_include_mantras which moves them with commentaries to /home/vvasuki/gitland/vishvAsa/vedAH_yajuH/static/taittirIyam/sArasvata-vibhAgaH/saMhitA/yajuH/sarva-prastutiH type locations.

Existing sAyaNa commentary blocks - move brAHmaNa-statement commentary to corresponding brAhmaNa-statement blocks in the indicated files.

sAyaNa commentary - fill in mantra-statement commentary and brAHmaNa-statement commentary respectively.

pdf to md AraNyaka translations (file:///media/vvasuki/vData/text/granthasangrahaH/vedAH/taittirIyam/tribhuvana_AraNyaka-english.pdf, file:///media/vvasuki/vData/text/granthasangrahaH/vedAH/taittirIyam/houben_AraNyaka-english.pdf). Check if it follows sAyaNa-pATha.

Interleave translations to AraNyaka.

Interleave translation to brAHmaNa.

Fill and update Arsheya krama files, by fixing and extending /home/vvasuki/gitland/sanskrit-coders/doc_curation/doc_curation_projects/veda/yajuH/taittiriiyam/aarsheya.py (spreadsheet 
at https://docs.google.com/spreadsheets/d/1xFXhg__yitgiECypnO5KAc9Xbe8cTzt-9dZD3AqpmtU/)

use a pristine version of sAyaNa-commentary to add मन्त्र-ब्रह्मण-सबन्धः blocks below corresponding mantra-statements and brAhmaNa-statements. The blocks should express both sArasvata and ArSheya numbering, with links.

## LLM configuration
Move the below from global instructions to a new md_to_pdf skill -

> Update and use
`doc_curation_projects/general_tasks/ebooks.py` for producing epubs and pdf-s from markdown.

Add /-commands for skills.


## rAmAnujIyam
### rahasya-traya-sAra  
wrap_in_detail(details_included=".*", details_excluded=["विश्वास-प्रस्तुतिः", "नीलमेघः (सं)", "*अवतारिका"], wrapper_title="सर्वाष् टीकाः", wrapper_params=None)

For Chapters 00–03, 05-07, 13–15 sequentially, but using multiple threads per chapter, hyphenate (per our conventions bare-hyphenator.md) sanskrit words (even if in kannaDa) in vijayarAghava blocks here, and mark pratIka-s (which refer to words in mUla / vishvAsa-prastuti blocks) bold. In some cases, partial hyphenation and pratIka bolding may already have been done. For ready examples, you can refer to /home/vvasuki/gitland/vishvAsa/rAmAnujIyam/content/tattvam/venkaTa-nAtha-shAkhA/venkaTanAthaH/rahasya-traya-sAraH/sarva-prastutiH/4_saMpradAya-prakriyA-bhAgaH/30_AchArya-kRtyAdhikAraH

Interleave remaining nIlamegha commentaries.

Interleave the other RTS kannaDa commentary from /home/vvasuki/gitland/vishvAsa/rAmAnujIyam/content/tattvam/venkaTa-nAtha-shAkhA/venkaTanAthaH/rahasya-traya-sAraH/kn/mADa-bhUSha-kRShNamAchAryaH_kn.

gItA-bhAShyam - interleave respective venkaTanAtha blocks into rAmAnuja commentaries, where sandhis have to be joined and then hyphenation run.

First, mark off mUlam in the top of each page in details block referring to /home/vvasuki/gitland/vishvAsa/rAmAnujIyam/content/tattvam/venkaTa-nAtha-shAkhA/venkaTanAthaH/rahasya-traya-sAraH/sarva-prastutiH, then Interleave  /home/vvasuki/gitland/vishvAsa/rAmAnujIyam/content/tattvam/venkaTa-nAtha-shAkhA/venkaTanAthaH/rahasya-traya-sAraH/uttamUr-vIrarAghavaH into /home/vvasuki/gitland/vishvAsa/rAmAnujIyam/content/tattvam/venkaTa-nAtha-shAkhA/venkaTanAthaH/rahasya-traya-sAraH/sarva-prastutiH as उत्तमूर्-वीरराघवः blocks.

Interleave /home/vvasuki/gitland/vishvAsa/rAmAnujIyam/content/tattvam/venkaTa-nAtha-shAkhA/venkaTanAthaH/rahasya-traya-sAraH/5-tIkAH/parakAla-sAra-prakAshikA-sangrahaH

Interleave other TIkA-s.

### Misc
pdf to md major rAmAnujIya texts.

## Pdf making
Create taittirIya text pdfs in ArSheya krama - 1 for each kANDa. Call accent.add_dependent_accents , and add a function to tag udAtta-s red while making the md (pass a new argument to supply md_transformer to the functions called in md_to_pdf skill for this.) in the epub css, ensure that the red tags used are made to appear red.

## Archiving
Continue stalled substack date cleanup task.

add code to scrape blogspot sites like https://koenraadelst.blogspot.com/ and call it to dump to koenraadelst dir in the usual location.

dump_google_groups - Fix it to pick up start url from the last messaged saved in the archive

Archive taligeri's blogspot site.

IN our catalog, where source path points to pdf location under granthasangraha, prefix "vv-pdfs:". Update scripts accordingly.

Using /home/vvasuki/gitland/sanskrit-coders/doc_curation/doc_curation_projects/misc/muktabodha.py, Update our archive and copy over files to our site. Map new text locii to pages in our site in our drive catalog, with prefix muktabodha: FILE_NAME. For muktabodha sources missing in the map, find them by looking for muktabodha metadata (and if necessary, seeking unique contents) - add and use a function for this. 

## kalpAntaram
Continue the kANe proofreading tasks in antigravity.

## AgamaH
### Greek epics
save https://www.gutenberg.org/files/1727/1727-h/1727-h.htm to /home/vvasuki/gitland/vishvAsa/AgamaH/content/AryaH/mediterranian/purANam/odyssey/en/butler/  (split by chapters using splitter)

## General Software
Find and fix TODOs.

Review existing code.

Serve hugo sites from mobile phone locally.

Imrpove dhaval's dictionary app

