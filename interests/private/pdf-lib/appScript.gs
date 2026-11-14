/**
 * pdf-lib endpoint (bound to the Google Sheet).
 *
 * Sheet layout (header row 1):
 *   A source_path | B archive_urls | C site_path | D map_source | E Pending
 *
 * GET  -> JSON { ok:true, header:[...], rows:[{source_path,archive_urls,site_path,map_source,Pending,__row},...] }
 *         Supports JSONP: GET ?callback=myFn -> myFn({...})
 * Pending convention: "add" for brand-new source_path rows, "replace" for
 * corrections to an existing source_path, blank once approved/cleared.
 * POST JSON (edit suggestion):
 *   { source_path, archive_urls, site_path, userId, originalSourcePath, originalRow }
 * Inserts the edited row immediately below the original row and sets
 * map_source=userId. Pending is "add" if source_path is new (not already in
 * the sheet), else "replace". Original row is untouched.
 *
 * POST JSON (clean append — new UT rows, etc.):
 *   { action:"append", source_path, archive_urls, site_path, map_source }
 *   or { action:"appendRows", rows:[{source_path, archive_urls, site_path, map_source}, ...] }
 * Appends new rows at the end with Pending="add" (existing source_path values
 * are skipped, returns skipped count).
 */

var SHEET_NAME = 'map'; // ← change if your sheet is named differently

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    var names = ss.getSheets().map(function(s){ return s.getName(); }).join(', ');
    throw new Error('Sheet tab "' + SHEET_NAME + '" not found in spreadsheet "' + ss.getName() +
      '". Tabs: [' + names + ']. Rename/import the pdf-lib CSV into a tab named "' + SHEET_NAME +
      '" (header: source_path,archive_urls,site_path,map_source,Pending), or change SHEET_NAME.');
  }
  return sh;
}

function ensureHeader_(sh) {
  var H = ['source_path','archive_urls','site_path','map_source','Pending'];
  var last = sh.getLastRow();
  if (last === 0) { sh.appendRow(H); return; }
  var hdr = sh.getRange(1, 1, 1, H.length).getValues()[0];
  for (var i = 0; i < H.length; i++) {
    if (!hdr[i]) { sh.getRange(1, i + 1).setValue(H[i]); }
  }
}

function doGet(e) {
  try {
    var sh = getSheet_();
    var data = sh.getDataRange().getValues();
    if (data.length === 0) return json_({ ok: true, header: [], rows: [] });
    var hdr = data[0];
    var cPath = hdr.indexOf('source_path'), cArch = hdr.indexOf('archive_urls'),
        cSite = hdr.indexOf('site_path'), cSrc = hdr.indexOf('map_source'),
        cPend = hdr.indexOf('Pending');
    if (cPath < 0 || cArch < 0 || cSite < 0 || cSrc < 0) {
      return json_({ ok: false, rows: [],
        error: 'Header mismatch on sheet "' + sh.getName() + '": got [' + hdr.join(',') +
          '], expected source_path,archive_urls,site_path,map_source(,Pending). ' +
          'This Apps Script is likely bound to the wrong spreadsheet — bind it to the spreadsheet that contains the pdf-lib map (tab "' + SHEET_NAME + '").' });
    }
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!String(r[cPath] || '').trim()) continue; // skip blank rows
      rows.push({
        source_path:  cPath >= 0 ? String(r[cPath])  : '',
        archive_urls: cArch >= 0 ? String(r[cArch])  : '',
        site_path:    cSite >= 0 ? String(r[cSite])  : '',
        map_source:   cSrc  >= 0 ? String(r[cSrc])   : '',
        Pending:      cPend >= 0 ? String(r[cPend])  : '',
        __row: i + 1 // sheet row (1-based; header is row 1)
      });
    }
    var payload = { ok: true, header: hdr, rows: rows };
    var cb = e && e.parameter && e.parameter.callback;
    if (cb) {
      return ContentService.createTextOutput(cb + '(' + JSON.stringify(payload) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return json_({ ok: false, error: err.message, rows: [] });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sh = getSheet_();
    ensureHeader_(sh);
    var data = sh.getDataRange().getValues();
    var HDR = data[0];

    var cPath = HDR.indexOf('source_path'), cArch = HDR.indexOf('archive_urls'),
        cSite = HDR.indexOf('site_path'), cSrc = HDR.indexOf('map_source'),
        cPend = HDR.indexOf('Pending');
    if (cPath < 0 || cArch < 0 || cSite < 0 || cSrc < 0 || cPend < 0) {
      return json_({ ok: false, error: 'missing header column (need source_path,archive_urls,site_path,map_source,Pending)' });
    }

    if (body.action === "append" || body.action === "appendRows") {
      var toAdd = body.action === "appendRows" && Array.isArray(body.rows)
        ? body.rows
        : [{ source_path: body.source_path, archive_urls: body.archive_urls,
             site_path: body.site_path, map_source: body.map_source || body.userId }];
      var seen = {};
      for (var i = 1; i < data.length; i++) seen[data[i][cPath]] = true;
      var added = 0, skipped = 0, lastRow = 0;
      var batch = [];
      for (var j = 0; j < toAdd.length; j++) {
        var r0 = toAdd[j] || {};
        var sp = String(r0.source_path || '').trim();
        if (!sp) { skipped++; continue; }
        if (seen[sp]) { skipped++; continue; }
        var vals = new Array(HDR.length).fill('');
        vals[cPath] = sp;
        vals[cArch] = r0.archive_urls || '';
        vals[cSite] = r0.site_path || '';
        vals[cSrc] = r0.map_source || r0.userId || '';
        vals[cPend] = 'add';
        batch.push(vals);
      }
      if (batch.length) {
        var startRow = sh.getLastRow() + 1;
        sh.getRange(startRow, 1, batch.length, HDR.length).setValues(batch);
        lastRow = sh.getLastRow();
        added = batch.length;
      }
      return json_({ ok: true, action: "appendRows", added: added, skipped: skipped,
                     sheetRows: sh.getLastRow(), lastRow: lastRow });
    }

    // locate original row: prefer submitted row number, else match source_path
    var anchor = -1; // 0-based index into data
    if (body.originalRow && body.originalRow >= 1 && body.originalRow <= data.length) {
      var idx = body.originalRow - 1;
      if (data[idx][cPath] === body.originalSourcePath) anchor = idx;
    }
    if (anchor < 0) {
      for (var i = 1; i < data.length; i++) {
        if (data[i][cPath] === body.originalSourcePath) { anchor = i; break; }
      }
    }
    if (anchor < 0) return json_({ ok: false, error: 'original row not found: ' + body.originalSourcePath });

    var uid = String(body.userId || '').trim();
    if (!uid) return json_({ ok: false, error: 'userId required' });
    var newPath = String(body.source_path || data[anchor][cPath]);
    var isNew = true;
    for (var k = 1; k < data.length; k++) {
      if (data[k][cPath] === newPath) { isNew = false; break; }
    }
    var pending = isNew ? 'add' : 'replace';

    // insert a blank row below the anchor and fill it
    sh.insertRowAfter(anchor + 1); // sheet rows are 1-based; data idx 0 == sheet row 1
    var r = sh.getRange(anchor + 2, 1, 1, HDR.length);
    var vals = new Array(HDR.length).fill('');
    vals[cPath] = newPath;
    vals[cArch] = body.archive_urls || '';
    vals[cSite] = body.site_path || '';
    vals[cSrc] = uid;          // map_source = user's id
    vals[cPend] = pending;     // Pending: "add" for new source_path, else "replace"
    r.setValues([vals]);

    return json_({ ok: true, insertedAfterSheetRow: anchor + 1, source_path: newPath, map_source: uid, Pending: pending });
  } catch (err) {
    return json_({ ok: false, error: err.message });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj));
}
