const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function openModal(title,body){const m=$('#modalBackdrop');if(!m)return;$('.modal h2',m).textContent=title;$('.modal-content',m).innerHTML=body;m.classList.add('open')}
function closeModal(){const m=$('#modalBackdrop');if(m)m.classList.remove('open')}
window.closeModal=closeModal;
function showToast(message){
  let t=document.getElementById('tncToast');
  if(!t){
    t=document.createElement('div'); t.id='tncToast';
    t.style.cssText='position:fixed;right:22px;bottom:22px;z-index:99999;background:#102a43;color:#fff;padding:12px 16px;border-radius:10px;font:600 13px Arial;box-shadow:0 8px 24px rgba(0,0,0,.18);max-width:360px';
    document.body.appendChild(t);
  }
  t.textContent=message; t.style.display='block';
  clearTimeout(window.__tncToastTimer);
  window.__tncToastTimer=setTimeout(()=>t.style.display='none',2600);
}
window.showToast=showToast;
window.openForm=(title,type)=>{ if(typeof type==='string' && type.trim().startsWith('<')) return openModal(title,`<div class="form-grid">${type}</div>`); return openModal(title,`<div class="form-grid"><label>Title<input id="genericTitle" placeholder="Enter ${type} title"></label><label>Status<select id="genericStatus"><option>Draft</option><option>Pending review</option><option>Published</option></select></label><label class="full">Description<textarea id="genericDescription" rows="4" placeholder="Enter details..."></textarea></label></div><div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveGenericForm('${type}')">Save</button></div>`); };
document.addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});

function saveGenericForm(type){
  const title=document.getElementById('genericTitle')?.value.trim();
  const status=document.getElementById('genericStatus')?.value || 'Draft';
  const description=document.getElementById('genericDescription')?.value.trim() || '';
  if(!title){showToast('Enter a title first.');return;}
  const items=tncLoadContent();
  items.unshift({type,id:'tnc_'+Date.now(),data:{title,description,status},public:status==='Published',updatedAt:Date.now()});
  tncSaveContent(items); closeModal(); showToast('Saved successfully.'); tncRefreshAll();
}
window.saveGenericForm=saveGenericForm;

function announcementStore(){
  const key = 'tnc_admin_announcements';
  const defaults = [];
  try{
    const saved = JSON.parse(localStorage.getItem(key));
    if(Array.isArray(saved)) return saved;
  }catch(e){}
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

function saveAnnouncementStore(items){
  localStorage.setItem('tnc_admin_announcements', JSON.stringify(items));
}

function renderAnnouncements(){
  const host = document.getElementById('announcementList');
  if(!host) return;
  const items = announcementStore();
  host.innerHTML = items.map(a => `
    <div class="admin-list-row" data-id="${a.id}">
      <div class="admin-list-icon">${a.icon || '📢'}</div>
      <div class="admin-list-main">
        <strong>${escapeHtml(a.title)}</strong>
        <span>${escapeHtml(a.location || '')} · ${escapeHtml(a.category || '')}</span>
        <small>${escapeHtml(a.body || '')}</small>
      </div>
      <span class="status-badge ${String(a.status).toLowerCase().replace(/[^a-z]+/g,'-')}">${escapeHtml(a.status)}</span>
      <div class="admin-row-actions">
        <button class="btn btn-ghost btn-sm" onclick="editAnnouncement(${a.id})">✏️ Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteAnnouncement(${a.id})">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
}

function editAnnouncement(id){
  const item = announcementStore().find(a => Number(a.id) === Number(id));
  if(!item) return showToast('Announcement not found');

  openForm('Edit Announcement', `
    <input type="hidden" id="announcementId" value="${item.id}">
    <label>Title</label>
    <input id="announcementTitle" value="${escapeHtml(item.title)}" maxlength="160">
    <label>Location</label>
    <input id="announcementLocation" value="${escapeHtml(item.location || '')}" maxlength="120">
    <label>Category</label>
    <select id="announcementCategory">
      ${['Water & Sanitation','Education','Roads & Infrastructure','Health','Agriculture','General'].map(x =>
        `<option ${x===item.category?'selected':''}>${x}</option>`).join('')}
    </select>
    <label>Description</label>
    <textarea id="announcementBody" rows="5" maxlength="800">${escapeHtml(item.body || '')}</textarea>
    <label>Status</label>
    <select id="announcementStatus">
      ${['Draft','Pending Review','Published','Archived'].map(x =>
        `<option ${x===item.status?'selected':''}>${x}</option>`).join('')}
    </select>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveAnnouncement()">💾 Save Changes</button>
    </div>
  `);
}

function newAnnouncement(){
  openForm('New Announcement', `
    <input type="hidden" id="announcementId" value="">
    <label>Title</label>
    <input id="announcementTitle" placeholder="Announcement title" maxlength="160">
    <label>Location</label>
    <input id="announcementLocation" placeholder="e.g. Chuka Town" maxlength="120">
    <label>Category</label>
    <select id="announcementCategory">
      <option>General</option><option>Water & Sanitation</option><option>Education</option>
      <option>Roads & Infrastructure</option><option>Health</option><option>Agriculture</option>
    </select>
    <label>Description</label>
    <textarea id="announcementBody" rows="5" placeholder="Write the public announcement..." maxlength="800"></textarea>
    <label>Status</label>
    <select id="announcementStatus">
      <option>Draft</option><option>Pending Review</option><option>Published</option>
    </select>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveAnnouncement()">💾 Save Announcement</button>
    </div>
  `);
}

function saveAnnouncement(){
  try{
    const titleEl=document.getElementById('announcementTitle');
    const bodyEl=document.getElementById('announcementBody');
    const locationEl=document.getElementById('announcementLocation');
    const categoryEl=document.getElementById('announcementCategory');
    const statusEl=document.getElementById('announcementStatus');
    const idEl=document.getElementById('announcementId');
    if(!titleEl || !bodyEl){ showToast('Announcement form is not loaded correctly.'); return; }
    const title=titleEl.value.trim();
    const body=bodyEl.value.trim();
    const location=locationEl ? locationEl.value.trim() : '';
    const category=categoryEl ? categoryEl.value : 'General';
    const status=statusEl ? statusEl.value : 'Draft';
    const idValue=idEl ? idEl.value : '';
    if(!title){ showToast('Please enter an announcement title.'); titleEl.focus(); return; }
    if(!body){ showToast('Please enter the announcement details.'); bodyEl.focus(); return; }
    const items=announcementStore();
    if(idValue){
      const index=items.findIndex(a=>String(a.id)===String(idValue));
      if(index<0){ showToast('Announcement could not be found.'); return; }
      items[index]={...items[index],title,body,location,category,status,updated:'Just now'};
      saveAnnouncementStore(items);
      renderAnnouncements();
      closeModal();
      showToast('Announcement updated successfully.');
      return;
    }
    items.unshift({id:Date.now(),icon:category==='Roads & Infrastructure'?'🚧':category==='Education'?'🎓':'📢',title,body,location,category,status,updated:'Just now'});
    saveAnnouncementStore(items);
    renderAnnouncements();
    closeModal();
    showToast('Announcement saved successfully.');
  }catch(err){
    console.error('saveAnnouncement failed:',err);
    showToast('Could not save announcement: '+(err.message||'Unknown error'));
  }
}

function deleteAnnouncement(id){
  const items = announcementStore();
  const item = items.find(a => Number(a.id) === Number(id));
  if(!item) return showToast('Announcement not found');
  if(!confirm(`Delete "${item.title}"?`)) return;
  saveAnnouncementStore(items.filter(a => Number(a.id) !== Number(id)));
  renderAnnouncements();
  showToast('Announcement deleted');
}

document.addEventListener('DOMContentLoaded', renderAnnouncements);
window.newAnnouncement=newAnnouncement; window.editAnnouncement=editAnnouncement; window.saveAnnouncement=saveAnnouncement; window.deleteAnnouncement=deleteAnnouncement; window.renderAnnouncements=renderAnnouncements;


/* ============================================================
   TNC LIVE CONTENT LAYER
   The actual read/write/persist logic lives in tnc-sync.js, which
   is loaded by every admin portal AND by the public app (index.html).
   That is what makes an admin change appear on the app automatically:
   both sides read the same localStorage-backed store and both re-render
   whenever it changes. This file only adds the admin *editing* UI on
   top of that shared store.
   Production: tnc-sync.js's save() is the one place to swap for a real
   authenticated API call.
   ============================================================ */
if (!window.TNC_SYNC) {
  console.error('tnc-sync.js must be loaded before admin-portals.js');
}
const TNC_CONTENT_KEY = window.TNC_SYNC.KEY;
const tncLoadContent = window.TNC_SYNC.load;
const tncSaveContent = window.TNC_SYNC.save;
const tncEsc = window.TNC_SYNC.esc;

const TNC_FORM_DEFS={
  announcement:{label:'County Announcement', fields:[
    ['title','Title','text',''],['location','Location','text',''],['category','Category','select','General|Water & Sanitation|Education|Roads & Infrastructure|Health|Agriculture'],['description','Description','textarea',''],['status','Status','select','Draft|Pending Review|Published|Archived']
  ], public:true},
  opportunity:{label:'Opportunity',fields:[
    ['title','Title','text',''],['location','Location','text',''],['type','Type','select','County Job|Private Job|Youth Opportunity|Internship|Tender|Grant|Scholarship'],['description','Description','textarea',''],['status','Status','select','Draft|Pending Review|Published|Closed']
  ],public:true},
  service:{label:'County Service',fields:[
    ['title','Service name','text',''],['department','Department','text',''],['requirements','Requirements','textarea',''],['cost','Cost','text',''],['hours','Opening hours','text',''],['location','Office / Location','text',''],['contact','Contact','text',''],['description','Procedure / Description','textarea',''],['status','Status','select','Draft|Published|Archived']
  ],public:true},
  notice:{label:'County Public Notice',fields:[
    ['title','Notice title','text',''],['location','Location','text',''],['description','Notice details','textarea',''],['status','Status','select','Draft|Pending Review|Published|Archived']
  ],public:true},
  'hospital service':{label:'Hospital Service',fields:[
    ['title','Service name','text',''],['department','Department','text',''],['hospital','Hospital','text','Chuka County Referral Hospital'],['description','Description','textarea',''],['status','Status','select','Draft|Published|Archived']
  ],public:true},
  update:{label:'Hospital Public Update',fields:[
    ['title','Update title','text',''],['hospital','Hospital','text','Chuka County Referral Hospital'],['description','Public update','textarea',''],['status','Status','select','Draft|Pending Review|Published|Archived']
  ],public:true},
  capacity:{label:'Hospital Capacity Update',fields:[
    ['hospital','Hospital','text','Chuka County Referral Hospital'],['availableBeds','Available beds','number',''],['queueStatus','Queue status','select','Normal|Busy|Delayed|Closed'],['description','Public capacity note','textarea',''],['status','Status','select','Draft|Published|Archived']
  ],public:true},
  'staff account':{label:'Hospital Staff Account',fields:[
    ['name','Staff name','text',''],['role','Role','select','Doctor|Nurse|Reception|Lab|Pharmacy|Administrator'],['department','Department','text',''],['status','Account status','select','Pending|Active|Suspended']
  ],public:false},
  queue:{label:'Hospital Queue',fields:[
    ['hospital','Hospital','text','Chuka County Referral Hospital'],['service','Service','text',''],['waiting','People waiting','number','0'],['serving','Serving','number','0'],['wait','Average wait (minutes)','number','0'],['status','Status','select','Normal|Busy|Delayed|Closed']
  ],public:true},
  appointment:{label:'Public Appointment Availability',fields:[
    ['hospital','Hospital','text','Chuka County Referral Hospital'],['service','Service','text','Outpatient'],['date','Date','date',''],['slots','Available slots','number','0'],['time','Time / window','text','08:00–12:00'],['status','Status','select','Published|Draft|Closed']
  ],public:true},
  staff:{label:'Hospital Staff Public Profile',fields:[
    ['name','Staff name','text',''],['role','Role','select','Doctor|Nurse|Reception|Lab|Pharmacy|Administrator'],['department','Department','text',''],['availability','Availability','select','Available|On duty|Off duty'],['status','Status','select','Published|Draft|Archived']
  ],public:true},
  incident:{label:'Emergency Incident',fields:[
    ['title','Incident','text',''],['location','Location','text',''],['severity','Severity','select','Low|Medium|High|Critical'],['description','Internal details','textarea',''],['status','Status','select','Active|Monitoring|Resolved']
  ],public:false},
  alert:{label:'Public Emergency Alert',fields:[
    ['title','Alert title','text',''],['location','Affected area','text',''],['severity','Severity','select','Low|Medium|High|Critical'],['description','Public alert message','textarea',''],['status','Status','select','Draft|Pending Approval|Published|Resolved']
  ],public:true},
  'response team':{label:'Response Team',fields:[
    ['name','Team name','text',''],['coverage','Coverage area','text',''],['status','Status','select','Available|Deployed|Unavailable'],['assignment','Current assignment','text','']
  ],public:false},
  'situation update':{label:'Situation Update',fields:[
    ['title','Update title','text',''],['location','Location','text',''],['description','Update','textarea',''],['status','Status','select','Internal|Published']
  ],public:true}
};

function tncFieldHtml(field,val=''){
  const [key,label,type,opts]=field;
  if(type==='textarea') return `<label class="full">${tncEsc(label)}<textarea id="tnc_${key}" rows="4">${tncEsc(val)}</textarea></label>`;
  if(type==='select') return `<label>${tncEsc(label)}<select id="tnc_${key}">${opts.split('|').map(o=>`<option ${String(o)===String(val)?'selected':''}>${tncEsc(o)}</option>`).join('')}</select></label>`;
  return `<label>${tncEsc(label)}<input id="tnc_${key}" type="${type}" value="${tncEsc(val)}"></label>`;
}

function tncOpenEditor(type,id=null){
  const def=TNC_FORM_DEFS[type];
  if(!def)return openForm('Create '+type,type);
  const existing=id?tncLoadContent().find(x=>String(x.id)===String(id)):null;
  const fields=def.fields.map(f=>tncFieldHtml(f,existing?.data?.[f[0]]??(f[3]&&f[3].includes('|')?'':f[3]||''))).join('');
  const body=`<div class="form-grid"><input type="hidden" id="tnc_record_id" value="${existing?.id||''}">${fields}</div>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="tncSaveRecord('${type}')">💾 ${existing?'Save Changes':'Save '+def.label}</button></div>`;
  openModal(existing?'Edit '+def.label:'Create '+def.label,body);
}
function tncSaveRecord(type){
  const def=TNC_FORM_DEFS[type]; if(!def)return;
  const data={};
  for(const f of def.fields){const el=document.getElementById('tnc_'+f[0]); if(el)data[f[0]]=el.value.trim();}
  const title=data.title||data.name||data.service||def.label;
  if(def.fields.some(f=>['title','name','service'].includes(f[0])) && !title.trim()){showToast('Please enter a name or title.');return;}
  const items=tncLoadContent(), idEl=document.getElementById('tnc_record_id'), id=idEl?.value;
  const record={type, id:id||('tnc_'+Date.now()+'_'+Math.random().toString(36).slice(2,7)), data, public:!!def.public, updatedAt:Date.now()};
  const idx=id?items.findIndex(x=>String(x.id)===String(id)):-1;
  if(idx>=0) items[idx]=record; else items.unshift(record);
  tncSaveContent(items);
  closeModal();
  showToast(existingText=idx>=0?'Changes saved and synchronized.':'Saved and synchronized.');
  tncRefreshAll();
}
function tncDeleteRecord(type,id){
  if(!confirm('Delete this item?'))return;
  tncSaveContent(tncLoadContent().filter(x=>String(x.id)!==String(id)));
  tncRefreshAdminLists(); showToast('Deleted and synchronized.');
}
function tncRefreshAdminLists(){
  renderAnnouncements();
}
window.openForm=function(title,type){
  if(TNC_FORM_DEFS[type]){tncOpenEditor(type);return;}
  openModal(title,`<div class="form-grid"><label>Title<input id="tnc_generic_title"></label><label class="full">Description<textarea id="tnc_generic_description"></textarea></label></div><div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="tncSaveRecord('${type}')">💾 Save</button></div>`);
};
window.tncOpenEditor=tncOpenEditor;
window.tncSaveRecord=tncSaveRecord;
window.tncDeleteRecord=tncDeleteRecord;

function tncRenderPublished(){
  const items=tncLoadContent().filter(x=>x.public && ['Published','Active','Normal'].includes(x.data?.status));
  const host=document.getElementById('tncLiveAdminUpdates');
  if(!host)return;
  if(!items.length){host.innerHTML='<p class="muted">No new published updates.</p>';return;}
  host.innerHTML=items.slice(0,20).map(x=>{
    const d=x.data||{}, type=x.type;
    const icon=type==='alert'?'🚨':type==='appointment'?'📅':type==='staff'?'🧑‍⚕️':type==='update'||type==='capacity'||type==='queue'||type==='hospital service'?'🏥':type==='opportunity'?'💼':type==='service'?'🏛️':type==='agriculture'?'🌾':type==='transport'?'🚌':type==='notice'?'📢':'📢';
    const title=d.title||d.name||d.service||type;
    const detail=d.description||d.body||d.location||d.hospital||d.department||'';
    return `<article class="tnc-live-card"><b>${icon} ${tncEsc(title)}</b><small>${tncEsc(detail)}</small><span>${tncEsc(d.location||d.hospital||d.category||d.department||'Tharaka-Nithi')}</span><div class="tnc-card-actions"><button class="btn btn-sm" onclick="tncOpenEditor('${type}','${x.id}')">✏️ Edit</button><button class="btn btn-sm" onclick="tncDeleteRecord('${type}','${x.id}')">🗑️ Delete</button></div></article>`;
  }).join('');
}

// Public-facing rendering (homeAnnouncements, jobsList, countyList, etc.)
// is handled by the shared tnc-sync.js so the exact same code renders
// admin content whether it runs inside an admin portal's own preview
// panel or on the public app itself.
function tncRenderManagedPublic(){ window.TNC_SYNC.renderPublic(); }

// tncSaveContent()/tncDeleteRecord() already trigger tnc-sync's own
// UPDATED_EVENT (see below), so this just renders — it never dispatches,
// which is what keeps the event from re-triggering itself in a loop.
function tncRefreshAll(){ tncRenderPublished(); window.TNC_SYNC.renderPublic(); renderAnnouncements(); }
window.tncRenderManagedPublic=tncRenderManagedPublic;
document.addEventListener(window.TNC_SYNC.UPDATED_EVENT,()=>{tncRenderPublished();tncRefreshAdminLists();});
document.addEventListener('DOMContentLoaded',tncRenderPublished);


/* Unified announcement editor override */
window.newAnnouncement=function(){tncOpenEditor('announcement');};
window.editAnnouncement=function(id){tncOpenEditor('announcement',id);};
window.saveAnnouncement=function(){tncSaveRecord('announcement');};
window.deleteAnnouncement=function(id){tncDeleteRecord('announcement',id);};


/* ============================================================
   UNIVERSAL ADMIN CONTENT MANAGER
   Every public-facing record created in any admin portal can be
   edited from its owning portal and is immediately synchronized.
   ============================================================ */
const TNC_ADMIN_SECTIONS={
  county:['announcement','opportunity','service','notice','agriculture','transport'],
  hospital:['queue','appointment','staff','capacity','update','hospital service'],
  security:['incident','alert','response team','situation update']
};
function tncAdminRecords(types){return tncLoadContent().filter(x=>types.includes(x.type));}
function tncAdminRow(x){
  const d=x.data||{}; const name=d.title||d.name||d.service||x.type;
  const status=d.status||'—';
  const icon=x.type==='alert'?'🚨':x.type==='appointment'?'📅':x.type==='staff'?'🧑‍⚕️':x.type==='queue'?'🎫':x.type==='capacity'?'🛏️':x.type==='update'?'📢':x.type==='opportunity'?'💼':x.type==='service'?'🏛️':x.type==='hospital service'?'🏥':x.type==='agriculture'?'🌾':x.type==='transport'?'🚌':x.type==='incident'?'🚨':x.type==='response team'?'🚒':'📢';
  return `<div class="tnc-admin-row"><div class="tnc-admin-row-icon">${icon}</div><div class="tnc-admin-row-main"><b>${tncEsc(name)}</b><small>${tncEsc(d.hospital||d.location||d.department||d.category||x.type)}</small></div><span class="status-badge">${tncEsc(status)}</span><button class="btn btn-sm" onclick="tncOpenEditor('${x.type}','${x.id}')">✏️ Edit</button><button class="btn btn-sm" onclick="tncDeleteRecord('${x.type}','${x.id}')">🗑️ Delete</button></div>`;
}
function tncRenderAdminManager(){
  const root=document.getElementById('tncAdminManager'); if(!root)return;
  const mode=root.dataset.portal||'county'; const types=TNC_ADMIN_SECTIONS[mode]||[];
  const items=tncAdminRecords(types);
  const groups=types.map(type=>{
    const def=TNC_FORM_DEFS[type]; const records=items.filter(x=>x.type===type);
    return `<div class="tnc-admin-group"><div class="tnc-admin-group-head"><div><b>${tncEsc(def?.label||type)}</b><small>${records.length} record${records.length===1?'':'s'}</small></div><button class="btn primary btn-sm" onclick="tncOpenEditor('${type}')">＋ Add</button></div>${records.length?records.map(tncAdminRow).join(''):`<p class="muted tnc-empty">No records yet.</p>`}</div>`;
  }).join('');
  root.innerHTML=groups;
}
window.tncRenderAdminManager=tncRenderAdminManager;
document.addEventListener('DOMContentLoaded',tncRenderAdminManager);
document.addEventListener('tnc-content-updated',tncRenderAdminManager);
