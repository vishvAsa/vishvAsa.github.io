const COLS = ['source_path','archive_urls','site_path','map_source','Pending'];
let rows = [], filtered = [], pageNum = 0, currentEditIdx = null;
const $ = id => document.getElementById(id);

// --- user id (dropdown with locally remembered default) ---
const LS_UID = 'pdfLibUserId', LS_UIDS = 'pdfLibUserIds', LS_URL = 'pdfLibScriptUrl';
function rememberUid(uid){
  if(!uid) return;
  localStorage.setItem(LS_UID, uid);
  let ids = JSON.parse(localStorage.getItem(LS_UIDS)||'[]');
  ids = [uid, ...ids.filter(x=>x!==uid)];
  localStorage.setItem(LS_UIDS, JSON.stringify(ids.slice(0,20)));
  refreshUidList();
}
function refreshUidList(){
  let ids = JSON.parse(localStorage.getItem(LS_UIDS)||'[]');
  $('uidlist').innerHTML = ids.map(x=>`<option value="${x.replace(/"/g,'&quot;')}">`).join('');
}
function restoreSettings(){
  refreshUidList();
  const u = localStorage.getItem(LS_UID); if(u) $('uidsel').value = u;
  const a = localStorage.getItem(LS_URL); if(a) $('appUrl').value = a;
  const q = getQFromUrl(); if(q) $('q').value = q;
}

const Q_ALIASES = ['filter','regex','search'];
function getQFromUrl(){
  try{
    const p = new URLSearchParams(location.search);
    for(const k of ['q', ...Q_ALIASES]){
      const v = p.get(k);
      if(v) return v;
    }
  }catch(e){}
  return '';
}
function setQInUrl(val){
  try{
    const p = new URLSearchParams(location.search);
    for(const k of Q_ALIASES) p.delete(k);
    if(val) p.set('q', val); else p.delete('q');
    const qs = p.toString();
    const newUrl = location.pathname + (qs ? '?'+qs : '') + location.hash;
    if(newUrl !== location.pathname + location.search + location.hash){
      history.replaceState(null, '', newUrl);
    }
  }catch(e){}
}
$('uidsel').addEventListener('change', e=>rememberUid(e.target.value.trim()));
$('appUrl').addEventListener('change', e=>localStorage.setItem(LS_URL, e.target.value.trim()));

async function load(){
  const scriptUrl = $('appUrl').value.trim();
  if(scriptUrl){
    try{
      setStatus('loading from Apps Script sheet …');
      const loaded = await loadRowsFromAppsScript(scriptUrl);
      if(loaded){
        applyFilter();
        setStatus(`loaded ${rows.length} rows from Apps Script sheet`);
        return;
      }
    }catch(e){
      setStatus('Apps Script load failed: '+e.message+' — falling back to local map.csv');
    }
  }
  setStatus('loading map.csv …');
  try{
    const r = await fetch('map.csv', {cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const txt = await r.text();
    const parsed = Papa.parse(txt, {header:true, skipEmptyLines:false});
    rows = parsed.data.filter(r=>r['source_path']!=null).map((r,i)=>({
      __row: i+2, // csv row (1-based, header is row 1)
      source_path: r['source_path']||'',
      archive_urls: r['archive_urls']||'',
      site_path: r['site_path']||'',
      map_source: r['map_source']||'',
      Pending: r['Pending']||'',
    }));
    applyFilter();
    setStatus(`loaded ${rows.length} rows from local map.csv`);
  }catch(e){ setStatus('failed to load map.csv: '+e.message+' — serve folder with e.g. python -m http.server, or check Apps Script URL'); }
}

function parseAppsScriptText(txt){
  // Strip possible XSSI guard prefix Apps Script sometimes adds
  txt = txt.replace(/^\/\*O_o\*\/\n?/,'').trim();
  // JSONP wrapper, if server was hit with ?callback=
  const m = txt.match(/^[a-zA-Z_$][\w$]*\s*\(([\s\S]*)\)\s*;?$/);
  if(m) txt = m[1];
  return JSON.parse(txt);
}

function rowsFromAppsScriptPayload(payload){
  if(!payload || !Array.isArray(payload.rows)) throw new Error('malformed Apps Script response (no rows array)');
  if(payload.ok === false) throw new Error(payload.error || 'Apps Script error');
  const hdr = payload.header || [];
  const need = ['source_path','archive_urls','site_path','map_source'];
  const missing = need.filter(c => !hdr.includes(c));
  if(missing.length){
    throw new Error(
      `Apps Script sheet has wrong headers: got [${hdr.join(',')}], missing [${missing.join(',')}]. ` +
      `The deployed script is bound to the wrong spreadsheet/tab — got a sheet with ` +
      `"${hdr[0]||'?'}" as first column. Bind appScript.gs to the pdf-lab spreadsheet with tab "map" ` +
      `(header: source_path,archive_urls,site_path,map_source,Pending) and redeploy as a new version.`
    );
  }
  const mapped = payload.rows.map(r=>({
    __row: r.__row||0,
    source_path: r.source_path||'',
    archive_urls: r.archive_urls||'',
    site_path: r.site_path||'',
    map_source: r.map_source||'',
    Pending: r.Pending||'',
  })).filter(r => r.source_path.trim() || r.archive_urls.trim() || r.site_path.trim());
  if(!mapped.length) throw new Error(`0 usable rows from Apps Script (header [${hdr.join(',')}], raw rows ${payload.rows.length}) — check tab "map" data`);
  rows = mapped;
  return true;
}

async function loadRowsFromAppsScript(url){
  // Try plain fetch (JSON). Works when Web App is deployed as "Anyone"
  // (Execute as: Me, Who has access: Anyone). If it fails (CORS / permission),
  // fall through to JSONP via <script> tag (cross-origin safe fallback).
  let fetchErr = null;
  try{
    const r = await fetch(url, {cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const txt = await r.text();
    const payload = parseAppsScriptText(txt);
    return rowsFromAppsScriptPayload(payload);
  }catch(e){
    // If fetch got a structured error (e.g. header mismatch), don't mask it with JSONP — surface it.
    if(e && /wrong headers|Header mismatch|0 usable rows|Apps Script error|malformed/.test(e.message)) throw e;
    fetchErr = e;
  }
  // JSONP fallback
  const cbName = '__pdfLibCb'+Math.random().toString(36).slice(2);
  const sep = url.includes('?') ? '&' : '?';
  const jsonpUrl = url + sep + 'callback=' + cbName;
  const payload = await new Promise((resolve,reject)=>{
    const s = document.createElement('script');
    const timer = setTimeout(()=>{ cleanup(); reject(new Error('JSONP timeout (fetch error was: '+(fetchErr?fetchErr.message:'')+')')); }, 20000);
    window[cbName] = (data)=>{ cleanup(); resolve(data); };
    function cleanup(){ clearTimeout(timer); s.remove(); delete window[cbName]; }
    s.onerror = ()=>{ cleanup(); reject(new Error('JSONP script load failed (fetch error was: '+(fetchErr?fetchErr.message:'')+')')); };
    s.src = jsonpUrl;
    document.head.appendChild(s);
  });
  return rowsFromAppsScriptPayload(payload);
}

function applyFilter(){
  const pat = $('q').value.trim();
  setQInUrl(pat);
  let re = null;
  if(pat){
    try{ re = new RegExp(pat,'i'); }
    catch(e){ setStatus('invalid regex: '+e.message); return; }
  }
  filtered = re ? rows.filter(r=>{
    return re.test([r.source_path,r.archive_urls,r.site_path,r.map_source,r.Pending].join(' '));
  }) : rows.slice();
  pageNum = 0;
  render();
}

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s){ return esc(s).replace(/"/g,'&quot;'); }
function isSafeUrl(u){ return /^https?:\/\/[^\/\s"'<>]+/i.test(String(u||'').trim()); }

function shortenArchiveUrl(u){
  const s = String(u||'').trim();
  // https://archive.org/details/<id> → <id> (per request)
  let m = s.match(/^https?:\/\/(?:www\.)?archive\.org\/details\/(.*)$/i);
  if(m) return m[1];
  // Wayback: https://web.archive.org/web/<ts>/<orig> → <orig>
  m = s.match(/^https?:\/\/web\.archive\.org\/web\/\d+(?:im_)?\/(.*)$/i);
  if(m) return m[1];
  // Direct item file: .../items/<id>/<file> → <id>/<file>
  m = s.match(/\/items\/(.*)$/);
  if(m) return m[1];
  // archive.org download/stream etc: strip host
  if(/^https?:\/\/(?:[^\/]+\.)?archive\.org\//i.test(s)){
    return s.replace(/^https?:\/\/(?:[^\/]+\.)?archive\.org\//i, '');
  }
  return s.replace(/^https?:\/\//i, '');
}

function shortenSiteUrl(u){
  const s = String(u||'').trim();
  // https://vishvasa.github.io/<a>/<b>/<last>/ → <last>
  const t = s.replace(/^https?:\/\/vishvAsa\.github\.io\/?/i, '').replace(/\/+$/,'');
  if(!t) return '/';
  const parts = t.split('/').filter(Boolean);
  return parts.length ? parts[parts.length-1] : s;
}

function linkCell(text, shortener){
  const lines = String(text||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  if(!lines.length) return '';
  return lines.map(u=>{
    if(!isSafeUrl(u)) return esc(u);
    const label = shortener(u) || u;
    return `<a href="${escAttr(u)}" title="${escAttr(u)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
  }).join('<br>');
}

function render(){
  const per = +$('perPage').value || 200;
  const maxPage = Math.max(0, Math.floor((filtered.length-1)/per));
  pageNum = Math.min(pageNum, maxPage);
  const slice = filtered.slice(pageNum*per, (pageNum+1)*per);
  $('tbl').querySelector('tbody').innerHTML = slice.map((r,i)=> {
    const gi = filtered.indexOf(r);
    return `<tr class="${r.Pending==='replace'?'pend-replace':''}">
      <td class="path">${esc(r.source_path)}</td>
      <td>${linkCell(r.archive_urls, shortenArchiveUrl)}</td>
      <td>${linkCell(r.site_path, shortenSiteUrl)}</td>
      <td>${esc(r.map_source)}</td>
      <td><strong>${esc(r.Pending)}</strong></td>
      <td><button onclick="openEdit(${gi})">Suggest edit</button></td>
    </tr>`;
  }).join('');
  $('pinfo').textContent = filtered.length ? `page ${pageNum+1}/${maxPage+1} · showing ${slice.length} of ${filtered.length} (total ${rows.length})` : 'no matches';
  $('count').textContent = filtered.length + ' matches';
}
function page(d){ pageNum += d; render(); }

function setStatus(m){ $('status').textContent = m; }

function openEdit(gi){
  const r = filtered[gi];
  currentEditIdx = gi;
  $('f_path').value = r.source_path;
  $('f_arch').value = r.archive_urls;
  $('f_site').value = r.site_path;
  $('editDlg').showModal();
}
function closeDlg(){ $('editDlg').close(); }

async function submitEdit(){
  const url = $('appUrl').value.trim();
  const uid = $('uidsel').value.trim();
  if(!url){ setStatus('set the Apps Script URL first'); return; }
  if(!uid){ setStatus('enter your id first (it becomes map_source)'); return; }
  rememberUid(uid);
  const r = filtered[currentEditIdx];
  const payload = JSON.stringify({
    source_path: $('f_path').value.trim(),
    archive_urls: $('f_arch').value,
    site_path: $('f_site').value,
    userId: uid,
    originalSourcePath: r.source_path,
    originalRow: r.__row,
  });
  closeDlg();
  setStatus('posting …');
  try{
    await fetch(url, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: payload});
    setStatus(`suggestion queued for ${r.source_path} (Pending=replace, map_source=${uid}) — reload the sheet to see the new row below the original`);
  }catch(e){ setStatus('post failed: '+e.message); }
}

restoreSettings();
window.addEventListener('popstate', ()=>{
  const q = getQFromUrl();
  if($('q').value !== q){ $('q').value = q; applyFilter(); }
});
load();
