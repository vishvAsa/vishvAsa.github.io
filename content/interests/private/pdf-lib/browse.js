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

async function loadRowsFromAppsScript(url){
  // Try plain fetch (JSON). Works when Web App is deployed as "Anyone"
  // (Execute as: Me, Who has access: Anyone). If it fails (CORS / permission),
  // fall through to JSONP via <script> tag (cross-origin safe fallback).
  try{
    const r = await fetch(url, {cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const txt = await r.text();
    const payload = parseAppsScriptText(txt);
    if(Array.isArray(payload.rows) && payload.rows.length){
      rows = payload.rows.map(r=>({
        __row: r.__row||0,
        source_path: r.source_path||'',
        archive_urls: r.archive_urls||'',
        site_path: r.site_path||'',
        map_source: r.map_source||'',
        Pending: r.Pending||'',
      }));
      return true;
    }
    if(payload.ok && Array.isArray(payload.rows)) { rows = payload.rows; return true; }
    throw new Error('no rows in response: '+txt.slice(0,200));
  }catch(e){
    // JSONP fallback
    const cbName = '__pdfLibCb'+Math.random().toString(36).slice(2);
    const sep = url.includes('?') ? '&' : '?';
    const jsonpUrl = url + sep + 'callback=' + cbName;
    const payload = await new Promise((resolve,reject)=>{
      const s = document.createElement('script');
      const timer = setTimeout(()=>{ cleanup(); reject(new Error('JSONP timeout')); }, 20000);
      window[cbName] = (data)=>{ cleanup(); resolve(data); };
      function cleanup(){ clearTimeout(timer); s.remove(); delete window[cbName]; }
      s.onerror = ()=>{ cleanup(); reject(new Error('JSONP script load failed')); };
      s.src = jsonpUrl;
      document.head.appendChild(s);
    });
    if(payload && Array.isArray(payload.rows)){
      rows = payload.rows.map(r=>({
        __row: r.__row||0,
        source_path: r.source_path||'',
        archive_urls: r.archive_urls||'',
        site_path: r.site_path||'',
        map_source: r.map_source||'',
        Pending: r.Pending||'',
      }));
      return true;
    }
    throw new Error('JSONP payload had no rows');
  }
}

function applyFilter(){
  const pat = $('q').value.trim();
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

function render(){
  const per = +$('perPage').value || 200;
  const maxPage = Math.max(0, Math.floor((filtered.length-1)/per));
  pageNum = Math.min(pageNum, maxPage);
  const slice = filtered.slice(pageNum*per, (pageNum+1)*per);
  $('tbl').querySelector('tbody').innerHTML = slice.map((r,i)=> {
    const gi = filtered.indexOf(r);
    return `<tr class="${r.Pending==='replace'?'pend-replace':''}">
      <td class="path">${esc(r.source_path)}</td>
      <td>${esc(r.archive_urls)}</td>
      <td>${esc(r.site_path)}</td>
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
load();
