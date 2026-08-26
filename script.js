/* =============================================================
   THARAKA-NITHI DIGITAL CONNECT — APP LOGIC
   Beginner-friendly notes:
   - Everything below is organised into clearly labelled sections.
   - Content is stored locally and can be managed from the app.
   - "RENDER FUNCTIONS" turn that data into HTML cards.
   - "NAVIGATION" shows/hides the right <section class="screen">.
   - Nothing here talks to a real server — it's all in-browser.
   ============================================================= */

/* ============================================================
   1. LOCAL CONTENT
   ============================================================ */

const CATEGORIES = [
  { id:'jobs',        icon:'💼', label:'Jobs & Opportunities' },
  { id:'skills',      icon:'🛠️', label:'Skills & Services' },
  { id:'business',    icon:'🏪', label:'Marketplace' },
  { id:'agriculture', icon:'🌾', label:'Agriculture' },
  { id:'property',    icon:'🏘️', label:'Property' },
  { id:'transport',   icon:'🚌', label:'Transport' },
  { id:'health',      icon:'🏥', label:'Healthcare' },
  { id:'events',      icon:'🎉', label:'Events' },
];

const JOBS = [];

const PROVIDERS = [];

const BUSINESSES = [];

const AGRI = [];

const PROPERTY = [];

const TRANSPORT = [];

const HOSPITALS = [];

const EVENTS = [];

const COUNTY_SERVICES = [];

const LEADERS = [];

const EMERGENCY = [];

const ANNOUNCEMENTS = [];

const NOTIFICATIONS = [];

/* ============================================================
   2. SMALL HELPERS
   ============================================================ */

function starRow(rating){
  return `⭐ ${rating.toFixed(1)}`;
}

function verifiedTag(isVerified){
  return isVerified
    ? `<span class="card-tag tag-verified">✔ Verified</span>`
    : `<span class="card-tag" style="background:#eee;color:#666;">Unverified</span>`;
}

function showToast(message){
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2200);
}

function openModal(html){
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
}

/* ============================================================
   3. RENDER FUNCTIONS — build HTML strings from local content
   ============================================================ */

function renderCategories(){
  const el = document.getElementById('homeCategories');
  el.innerHTML = CATEGORIES.map(c => `
    <div class="cat-card" data-nav="${c.id}" role="button" tabindex="0">
      <div class="cat-icon">${c.icon}</div>
      <div class="cat-label">${c.label}</div>
    </div>
  `).join('');
}

function providerCard(p){
  return `
    <div class="card" data-modal="provider" data-name="${p.name}">
      <div class="card-icon">🧰</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${p.name}</div>
            <div class="card-sub">${p.service}</div>
          </div>
          ${verifiedTag(p.verified)}
        </div>
        <div class="card-meta">
          <span>📍 ${p.loc}</span>
          <span>${starRow(p.rating)}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); showToast('Contact details are not available yet.')">📞 Call</button>
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); showToast('Contact details are not available yet.')">💬 WhatsApp</button>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); viewProvider('${p.name}')">View Profile</button>
        </div>
      </div>
      <button class="save-btn" onclick="event.stopPropagation(); toggleSave(this,'${p.name}')" aria-label="Save">🤍</button>
    </div>`;
}

function viewProvider(name){
  const p = PROVIDERS.find(x=>x.name===name);
  if(!p) return;
  openModal(`
    <h2>${p.name}</h2>
    <p class="muted">${p.service} · 📍 ${p.loc}</p>
    <p>${verifiedTag(p.verified)} &nbsp; ${starRow(p.rating)}</p>
    <p style="font-size:13.5px; line-height:1.6;">Profile details will appear when this provider is added.</p>
    <div class="card-actions" style="margin-top:14px;">
      <button class="btn btn-primary" onclick="showToast('Contact details are not available yet.')">📞 Call</button>
      <button class="btn btn-ghost" onclick="showToast('Contact details are not available yet.')">💬 WhatsApp</button>
    </div>
  `);
}

function jobCard(j){
  return `
    <div class="card">
      <div class="card-icon">📄</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${j.title}</div>
            <div class="card-sub">📍 ${j.loc}</div>
          </div>
          <span class="card-tag">${j.tag}</span>
        </div>
        <div class="card-meta"><span>${j.pay}</span></div>
        <div class="card-actions">
          <button class="btn btn-primary btn-sm" onclick="saveApplication('${j.title}')">Apply / Learn More</button>
        </div>
      </div>
      <button class="save-btn" onclick="toggleSave(this,'${j.title}')" aria-label="Save">🤍</button>
    </div>`;
}

function businessCard(b){
  return `
    <div class="card">
      <div class="card-icon">🏪</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${b.name}</div>
            <div class="card-sub">${b.type} · 📍 ${b.loc}</div>
          </div>
          ${b.promo ? `<span class="card-tag tag-red">Promo</span>` : ''}
        </div>
        <div class="card-desc">${b.note}${b.promo ? ' — ' + b.promo : ''}</div>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm" onclick="showToast('Business details are not available yet.')">View Business</button>
        </div>
      </div>
    </div>`;
}

function agriCard(a){
  return `
    <div class="card">
      <div class="card-icon">🌾</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${a.name}</div>
            <div class="card-sub">${a.role} · 📍 ${a.loc}</div>
          </div>
        </div>
        <div class="card-desc"><strong>${a.produce}</strong> — ${a.note}</div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Contact request saved on this device.')">Contact</button>
        </div>
      </div>
    </div>`;
}

function propertyCard(p){
  return `
    <div class="card">
      <div class="card-icon">🏘️</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${p.title}</div>
            <div class="card-sub">📍 ${p.loc}</div>
          </div>
          <span class="card-tag">${p.kind}</span>
        </div>
        <div class="card-meta"><span>${p.price}</span></div>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm" onclick="showToast('Listing details are not available yet.')">View Listing</button>
        </div>
      </div>
      <button class="save-btn" onclick="toggleSave(this,'${p.title}')" aria-label="Save">🤍</button>
    </div>`;
}

function transportCard(t){
  return `
    <div class="card">
      <div class="card-icon">🚌</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${t.name}</div>
            <div class="card-sub">${t.type} · ${t.route}</div>
          </div>
        </div>
        <div class="card-meta"><span>Fare: ${t.fare}</span></div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Contact details are not available yet.')">📞 Call</button>
        </div>
      </div>
    </div>`;
}

function healthCard(h){
  return `
    <div class="card">
      <div class="card-icon">🏥</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${h.name}</div>
            <div class="card-sub">📍 ${h.loc}</div>
          </div>
        </div>
        <div class="card-desc">${h.services}</div>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm" onclick="showToast('Details are not available yet.')">View Details</button>
        </div>
      </div>
    </div>`;
}

function eventCard(e){
  return `
    <div class="card">
      <div class="card-icon">🎉</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${e.title}</div>
            <div class="card-sub">📍 ${e.loc} · ${e.date}</div>
          </div>
          <span class="card-tag">${e.type}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="saveEventRsvp('${e.title}')">RSVP / Details</button>
        </div>
      </div>
    </div>`;
}

function countyCard(c){
  return `
    <div class="card">
      <div class="card-icon">🏛️</div>
      <div class="card-body">
        <div class="card-top"><div class="card-title">${c.dept}</div></div>
        <div class="card-desc">${c.desc}</div>
        <div class="card-meta"><span>✉ ${c.contact}</span></div>
      </div>
    </div>`;
}

function leaderCard(l){
  return `
    <div class="card">
      <div class="card-icon">🤝</div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <div class="card-title">${l.name}</div>
            <div class="card-sub">${l.role}</div>
          </div>
          <span class="card-tag tag-verified">✔ Verified</span>
        </div>
        <div class="card-desc">${l.desc}</div>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm" onclick="showToast('Profile details are not available yet.')">View Profile</button>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Message saved on this device.')">Official Contact</button>
        </div>
      </div>
    </div>`;
}

function emergencyCard(e){
  return `
    <div class="card">
      <div class="card-icon">🚨</div>
      <div class="card-body">
        <div class="card-top"><div class="card-title">${e.name}</div><span class="card-tag tag-red">${e.type}</span></div>
        <div class="card-meta"><span>📞 ${e.number}</span></div>
      </div>
    </div>`;
}

function announcementItem(a){
  return `
    <div class="announcement-item">
      <span class="a-icon">${a.icon}</span>
      <div><h4>${a.title}</h4><p>${a.body}</p></div>
    </div>`;
}

function notificationItem(n){
  return `
    <div class="notification-item ${n.unread ? 'unread' : ''}">
      <span class="n-icon">${n.icon}</span>
      <div><h4>${n.title}</h4><p>${n.body}</p></div>
    </div>`;
}

/* ============================================================
   4. PAGE INITIALISERS — fill each screen with its data
   ============================================================ */


/* ============================================================
   LIVE WEATHER — Open-Meteo, no API key required
   ============================================================ */
const WEATHER_LOCATIONS = {
  'Chuka':['Chuka, Kenya'],'Kathwana':['Kathwana, Kenya'],'Marimanti':['Marimanti, Kenya'],
  'Chogoria':['Chogoria, Kenya'],'Maara':['Maara, Kenya'],'Tharaka North':['Tharaka North, Kenya'],
  'Tharaka South':['Tharaka South, Kenya']
};
const WEATHER_CODES = {
  0:['☀️','Clear sky'],1:['🌤️','Mainly clear'],2:['⛅','Partly cloudy'],3:['☁️','Overcast'],45:['🌫️','Fog'],48:['🌫️','Rime fog'],
  51:['🌦️','Light drizzle'],53:['🌦️','Drizzle'],55:['🌧️','Heavy drizzle'],56:['🌧️','Freezing drizzle'],57:['🌧️','Freezing drizzle'],
  61:['🌦️','Light rain'],63:['🌧️','Rain'],65:['🌧️','Heavy rain'],66:['🌧️','Freezing rain'],67:['🌧️','Heavy freezing rain'],
  71:['🌨️','Light snow'],73:['🌨️','Snow'],75:['❄️','Heavy snow'],77:['🌨️','Snow grains'],80:['🌦️','Rain showers'],81:['🌧️','Rain showers'],
  82:['⛈️','Heavy rain showers'],85:['🌨️','Snow showers'],86:['❄️','Heavy snow showers'],95:['⛈️','Thunderstorm'],96:['⛈️','Thunderstorm + hail'],99:['⛈️','Thunderstorm + hail']
};
function weatherCodeInfo(code){return WEATHER_CODES[Number(code)]||['🌡️','Current conditions']}
function weatherDayName(dateString,index){if(index===0)return 'Today';return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined,{weekday:'short'})}
function weatherSetLoading(){
  const c=document.getElementById('weatherCurrent'),f=document.getElementById('weatherForecast');
  if(c)c.innerHTML='<div class="weather-loading"><span class="weather-spinner"></span><span>Loading weather…</span></div>';
  if(f)f.innerHTML='';
}
function weatherSetError(message){
  const c=document.getElementById('weatherCurrent'),f=document.getElementById('weatherForecast');
  if(c)c.innerHTML=`<div class="weather-error">⚠️ ${message}<br><button class="weather-retry" onclick="loadWeather()">Try again</button></div>`;
  if(f)f.innerHTML='';
}
function weatherLocationName(){return document.getElementById('weatherLocation')?.value||'Chuka'}
async function geocodeWeatherLocation(place){
  const query=WEATHER_LOCATIONS[place]?.[0]||`${place}, Kenya`;
  const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
  if(!response.ok)throw new Error('Location lookup failed.');
  const data=await response.json();
  if(!data.results?.length)throw new Error('Could not find this location.');
  return data.results[0];
}
async function fetchWeatherByCoords(latitude,longitude,label){
  const params=new URLSearchParams({latitude,longitude,current:'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',timezone:'auto',forecast_days:'3'});
  const response=await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if(!response.ok)throw new Error('Weather service is unavailable.');
  return {data:await response.json(),label};
}
function renderWeather(result){
  const {data,label}=result;
  const current=data.current;
  const cinfo=weatherCodeInfo(current.weather_code);
  const currentEl=document.getElementById('weatherCurrent');
  const forecastEl=document.getElementById('weatherForecast');
  const updatedEl=document.getElementById('weatherUpdated');
  if(!currentEl||!forecastEl)return;
  currentEl.innerHTML=`<div class="weather-main-row"><span class="weather-icon">${cinfo[0]}</span><div><div class="weather-temp">${Math.round(current.temperature_2m)}<span class="weather-unit">°C</span></div><div class="weather-condition">${cinfo[1]} · Feels like ${Math.round(current.apparent_temperature)}°</div></div></div><div class="weather-details"><div class="weather-detail">💧 Humidity<strong>${Math.round(current.relative_humidity_2m)}%</strong></div><div class="weather-detail">💨 Wind<strong>${Math.round(current.wind_speed_10m)} km/h</strong></div></div>`;
  forecastEl.innerHTML=data.daily.time.map((date,i)=>{
    const info=weatherCodeInfo(data.daily.weather_code[i]);
    const rain=data.daily.precipitation_probability_max?.[i];
    return `<div class="weather-day"><span class="weather-day-name">${weatherDayName(date,i)}</span><span class="weather-day-icon">${info[0]}</span><span class="weather-day-temp">${Math.round(data.daily.temperature_2m_max[i])}° / ${Math.round(data.daily.temperature_2m_min[i])}°${rain!=null?` · ${rain}% rain`:''}</span></div>`;
  }).join('');
  const time=new Date(current.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  if(updatedEl)updatedEl.textContent=`${label} · Updated ${time}`;
}
async function loadWeather(){
  weatherSetLoading();
  const selected=weatherLocationName();
  try{
    if(selected==='__gps'){
      if(!navigator.geolocation)throw new Error('Location access is not supported by this browser.');
      const position=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:10000}));
      renderWeather(await fetchWeatherByCoords(position.coords.latitude,position.coords.longitude,'Your location'));
      return;
    }
    const place=await geocodeWeatherLocation(selected);
    renderWeather(await fetchWeatherByCoords(place.latitude,place.longitude,place.name||selected));
  }catch(error){weatherSetError(error.message||'Unable to load live weather right now.')}
}
function initWeather(){
  const select=document.getElementById('weatherLocation');
  if(!select)return;
  select.addEventListener('change',loadWeather);
  loadWeather();
  setInterval(loadWeather,15*60*1000);
}

function initHome(){
  initWeather();
  renderCategories();
  document.getElementById('nearbyServices').innerHTML = PROVIDERS.slice(0,4).map(providerCard).join('');
  document.getElementById('latestOpportunities').innerHTML = JOBS.slice(0,4).map(jobCard).join('');
  const storedAnnouncements = (() => {
    try {
      const items = JSON.parse(localStorage.getItem('tnc_admin_announcements') || 'null');
      return Array.isArray(items) ? items.filter(a => a.status === 'Published') : null;
    } catch(e) { return null; }
  })();
  document.getElementById('homeAnnouncements').innerHTML =
    (storedAnnouncements && storedAnnouncements.length ? storedAnnouncements : ANNOUNCEMENTS)
      .map(a => announcementItem({
        ...a,
        title: a.title || a.name,
        desc: a.body || a.desc || a.description
      })).join('');
}

function initJobs(){
  document.getElementById('jobsList').innerHTML = JOBS.map(jobCard).join('');
  const types = ['All', ...new Set(JOBS.map(j=>j.tag))];
  document.getElementById('jobsFilterChips').innerHTML = types.map((t,i)=>
    `<button class="chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
}

function initSkills(){
  document.getElementById('skillsList').innerHTML = PROVIDERS.map(providerCard).join('');
  const types = ['All', ...new Set(PROVIDERS.map(p=>p.service))];
  document.getElementById('skillsFilterChips').innerHTML = types.map((t,i)=>
    `<button class="chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
}

function initBusiness(){
  document.getElementById('businessList').innerHTML = BUSINESSES.map(businessCard).join('');
  const types = ['All', ...new Set(BUSINESSES.map(b=>b.type))];
  document.getElementById('businessFilterChips').innerHTML = types.map((t,i)=>
    `<button class="chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
}

function initAgri(){
  document.getElementById('agriList').innerHTML = AGRI.map(agriCard).join('');
  const types = ['All', ...new Set(AGRI.map(a=>a.role))];
  document.getElementById('agriFilterChips').innerHTML = types.map((t,i)=>
    `<button class="chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
}

function initProperty(){
  document.getElementById('propertyList').innerHTML = PROPERTY.map(propertyCard).join('');
  const types = ['All', ...new Set(PROPERTY.map(p=>p.kind))];
  document.getElementById('propertyFilterChips').innerHTML = types.map((t,i)=>
    `<button class="chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
}

function initTransport(){
  document.getElementById('transportList').innerHTML = TRANSPORT.map(transportCard).join('');
  const types = ['All', ...new Set(TRANSPORT.map(t=>t.type))];
  document.getElementById('transportFilterChips').innerHTML = types.map((t,i)=>
    `<button class="chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
}

function initHealth(){
  document.getElementById('healthList').innerHTML = HOSPITALS.map(healthCard).join('');
  document.getElementById('queueHospital').innerHTML = HOSPITALS.map(h=>`<option>${h.name}</option>`).join('');
}

function initEvents(){
  document.getElementById('eventsList').innerHTML = EVENTS.map(eventCard).join('');
  const types = ['All', ...new Set(EVENTS.map(e=>e.type))];
  document.getElementById('eventsFilterChips').innerHTML = types.map((t,i)=>
    `<button class="chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
}

function initCounty(){
  document.getElementById('countyList').innerHTML = COUNTY_SERVICES.map(countyCard).join('');
}

function initLeaders(){
  document.getElementById('leadersList').innerHTML = LEADERS.map(leaderCard).join('');
}

function initEmergency(){
  document.getElementById('emergencyList').innerHTML = EMERGENCY.map(emergencyCard).join('');
}

function initNotifications(){
  document.getElementById('notificationList').innerHTML = NOTIFICATIONS.map(notificationItem).join('');
  document.getElementById('notifBadge').textContent = NOTIFICATIONS.filter(n=>n.unread).length;
}

const PROFILE_TABS = {
  saved: () => `<p class="muted">Items you tap the 🤍 save icon on will appear here. </p>` +
    jobCard(JOBS[0]) + providerCard(PROVIDERS[0]),
  applications: () => `<p class="muted">Application history.</p>` +
    `<div class="card"><div class="card-icon">📄</div><div class="card-body"><div class="card-title">Sales Assistant — Chuka Supermarket</div><div class="card-sub">Status: Under review</div></div></div>`,
  bookings: () => `<p class="muted">Bookings.</p>` +
    `<div class="card"><div class="card-icon">🏥</div><div class="card-body"><div class="card-title">Hospital Queue Ticket A047</div><div class="card-sub">Chuka County Referral Hospital — Outpatient</div></div></div>`,
};

function initProfile(){
  renderProfileTab('saved');
}
function renderProfileTab(tab){
  document.getElementById('profileTabContent').innerHTML = PROFILE_TABS[tab]();
  document.querySelectorAll('.tab-btn').forEach(b=> b.classList.toggle('active', b.dataset.tab===tab));
}

/* ============================================================
   5. NAVIGATION — show one screen, hide the rest
   ============================================================ */

const INIT_FUNCS = {
  home: initHome, jobs: initJobs, skills: initSkills, business: initBusiness,
  agriculture: initAgri, property: initProperty, transport: initTransport,
  health: initHealth, events: initEvents, county: initCounty, leaders: initLeaders,
  emergency: initEmergency, notifications: initNotifications, profile: initProfile,
};

const alreadyInitialised = new Set();

function goTo(screenId){
  if(screenId === 'search-focus'){
    goTo('home');
    setTimeout(()=> document.getElementById('mainSearch').focus(), 150);
    return;
  }

  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('screen-active'));
  const target = document.getElementById('screen-' + screenId);
  if(!target) return;
  target.classList.add('screen-active');

  if(INIT_FUNCS[screenId] && !alreadyInitialised.has(screenId)){
    INIT_FUNCS[screenId]();
    alreadyInitialised.add(screenId);
  }

  // sync active states in top nav / bottom nav
  document.querySelectorAll('[data-nav]').forEach(el=>{
    el.classList.toggle('active', el.dataset.nav === screenId);
  });

  closeSidebar();
  window.scrollTo({top:0, behavior:'instant'});
}

function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

/* ============================================================
   6. SEARCH
   ============================================================ */

function runSearch(query){
  const q = query.trim().toLowerCase();
  if(!q){ showToast('Type something to search'); return; }

  let results = [];
  let label = '';

  if(q.includes('electric') || q.includes('mechanic') || q.includes('plumb') || q.includes('tailor') ||
     q.includes('tutor') || q.includes('carpent') || q.includes('weld') || q.includes('build') ||
     q.includes('design') || q.includes('photo') || q.includes('skill')){
    results = PROVIDERS.filter(p=> p.service.toLowerCase().includes(q) || q.includes(p.service.toLowerCase().split(' ')[0]) || true)
      .filter(p=> p.service.toLowerCase().includes(q.split(' ')[0]) );
    if(results.length===0) results = PROVIDERS; // no-results fallback
    label = 'Skills & Services';
    document.getElementById('searchResults').innerHTML = results.map(providerCard).join('');
  } else if(q.includes('job') || q.includes('intern') || q.includes('scholarship') || q.includes('tender') ||
            q.includes('gig') || q.includes('training') || q.includes('opportunit')){
    results = JOBS;
    label = 'Jobs & Opportunities';
    document.getElementById('searchResults').innerHTML = results.map(jobCard).join('');
  } else if(q.includes('hospital') || q.includes('clinic') || q.includes('health') || q.includes('doctor')){
    results = HOSPITALS;
    label = 'Healthcare';
    document.getElementById('searchResults').innerHTML = results.map(healthCard).join('');
  } else if(q.includes('house') || q.includes('plot') || q.includes('rent') || q.includes('property') || q.includes('land')){
    results = PROPERTY;
    label = 'Property';
    document.getElementById('searchResults').innerHTML = results.map(propertyCard).join('');
  } else if(q.includes('matatu') || q.includes('boda') || q.includes('taxi') || q.includes('transport') || q.includes('delivery')){
    results = TRANSPORT;
    label = 'Transport';
    document.getElementById('searchResults').innerHTML = results.map(transportCard).join('');
  } else if(q.includes('shop') || q.includes('restaurant') || q.includes('business') || q.includes('market') || q.includes('food')){
    results = BUSINESSES;
    label = 'Businesses & Marketplace';
    document.getElementById('searchResults').innerHTML = results.map(businessCard).join('');
  } else if(q.includes('farm') || q.includes('produce') || q.includes('crop') || q.includes('agri')){
    results = AGRI;
    label = 'Agriculture & Markets';
    document.getElementById('searchResults').innerHTML = results.map(agriCard).join('');
  } else if(q.includes('event') || q.includes('festival') || q.includes('meeting') || q.includes('baraza')){
    results = EVENTS;
    label = 'Events & Community';
    document.getElementById('searchResults').innerHTML = results.map(eventCard).join('');
  } else {
    // generic fallback: search across providers + jobs + businesses by name/title
    const pool = [
      ...PROVIDERS.map(p=>({card:providerCard(p), text:(p.name+p.service).toLowerCase()})),
      ...JOBS.map(j=>({card:jobCard(j), text:j.title.toLowerCase()})),
      ...BUSINESSES.map(b=>({card:businessCard(b), text:b.name.toLowerCase()})),
    ];
    const matches = pool.filter(item=> item.text.includes(q));
    label = 'All Results';
    document.getElementById('searchResults').innerHTML = matches.length
      ? matches.map(m=>m.card).join('')
      : `<p class="muted">No results for "${query}". Try "electrician", "job", "hospital" or "house".</p>`;
  }

  document.getElementById('searchSummary').textContent = `Showing ${label} results for "${query}"`;
  goTo('search');
}

/* ============================================================
   7. SAVE / FAVOURITE TOGGLE
   ============================================================ */

function toggleSave(btn, name){
  const saved = btn.textContent.includes('❤️');
  btn.textContent = saved ? '🤍' : '❤️';
  showToast(saved ? `Removed ${name} from saved` : `Saved ${name}`);
}

/* ============================================================
   8. HOSPITAL DIGITAL QUEUE
   ============================================================ */

/* ============================================================
   8. HOSPITAL QUEUE MANAGEMENT — FRONTEND ONLY
   ------------------------------------------------------------
   This is a real local queue manager. Data is stored in
   localStorage and shared between tabs on the same device.
   No backend/API is required.
   ============================================================ */
const QUEUE_KEY = 'tnc_hospital_queue_v2';

function queueLoad(){
  try{
    const x = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    return Array.isArray(x) ? x : [];
  }catch(e){ return []; }
}
function queueSave(items){
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  window.dispatchEvent(new StorageEvent('storage',{key:QUEUE_KEY,newValue:JSON.stringify(items)}));
  renderHospitalQueue();
}
function queueId(){
  return 'q_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
}
function queueNumber(items){
  const today = new Date().toISOString().slice(0,10);
  const nums = items.filter(x=>x.date===today).map(x=>Number(x.number)||0);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}
function queuePriorityRank(p){
  return p === 'Emergency' ? 0 : p === 'Urgent' ? 1 : 2;
}
function queueStatusLabel(s){
  return s === 'waiting' ? 'Waiting' :
         s === 'called' ? 'Called' :
         s === 'service' ? 'In Service' :
         s === 'completed' ? 'Completed' :
         s === 'no-show' ? 'No-show' : s;
}
function queueEsc(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function queueAddPatient(data){
  const items = queueLoad();
  const now = Date.now();
  const patient = {
    id: queueId(),
    number: queueNumber(items),
    date: new Date(now).toISOString().slice(0,10),
    time: new Date(now).toISOString(),
    name: String(data.name || '').trim(),
    phone: String(data.phone || '').trim(),
    service: String(data.service || 'Outpatient'),
    priority: String(data.priority || 'Normal'),
    status: 'waiting',
    notes: String(data.notes || '').trim(),
    calledAt: null,
    startedAt: null,
    completedAt: null
  };
  if(!patient.name) throw new Error('Patient name is required.');
  items.push(patient);
  queueSave(items);
  return patient;
}
function queueUpdate(id, patch){
  const items = queueLoad();
  const i = items.findIndex(x=>x.id===id);
  if(i < 0) return;
  items[i] = {...items[i], ...patch};
  queueSave(items);
}
function queueCallNext(service){
  const items = queueLoad();
  const candidates = items.filter(x =>
    x.status === 'waiting' &&
    (!service || service === 'All Services' || x.service === service)
  ).sort((a,b)=>
    queuePriorityRank(a.priority)-queuePriorityRank(b.priority) ||
    new Date(a.time)-new Date(b.time)
  );
  if(!candidates.length){
    showToast('There are no waiting patients for this service.');
    return;
  }
  const next = candidates[0];
  queueUpdate(next.id,{status:'called',calledAt:new Date().toISOString()});
  showToast(`Queue ${String(next.number).padStart(3,'0')} called`);
}
function queueStart(id){
  queueUpdate(id,{status:'service',startedAt:new Date().toISOString()});
}
function queueComplete(id){
  queueUpdate(id,{status:'completed',completedAt:new Date().toISOString()});
}
function queueNoShow(id){
  queueUpdate(id,{status:'no-show'});
}
function queueRecall(id){
  const item = queueLoad().find(x=>x.id===id);
  if(item) queueUpdate(id,{status:'called',calledAt:new Date().toISOString()});
}
function queueResetCompleted(){
  const items = queueLoad().filter(x=>!['completed','no-show'].includes(x.status));
  queueSave(items);
  showToast('Completed and no-show patients removed from the active queue.');
}
function queueAverageWait(items){
  const now = Date.now();
  const waits = items.filter(x=>x.status !== 'completed' && x.status !== 'no-show')
    .map(x => Math.max(0, now - new Date(x.time).getTime()) / 60000);
  if(!waits.length) return 0;
  return Math.round(waits.reduce((a,b)=>a+b,0)/waits.length);
}
function queueServices(){
  const defaults = ['Emergency','Outpatient','Maternity','Laboratory','Pharmacy'];
  const fromData = queueLoad().map(x=>x.service).filter(Boolean);
  return [...new Set([...defaults,...fromData])];
}
function renderHospitalQueue(){
  const host = document.getElementById('hospitalQueueManager');
  if(!host) return;

  const items = queueLoad();
  const active = items.filter(x=>!['completed','no-show'].includes(x.status));
  const waiting = active.filter(x=>x.status==='waiting');
  const called = active.filter(x=>x.status==='called');
  const service = active.filter(x=>x.status==='service');
  const avg = queueAverageWait(active);

  host.innerHTML = `
    <div class="queue-dashboard">
      <div class="queue-header">
        <div>
          <h2>Hospital Queue Management</h2>
          <p class="muted">Manage today's patients, priorities and service status on this device.</p>
        </div>
        <div class="queue-actions">
          <button class="btn btn-primary" onclick="queueCallNext(document.getElementById('queueManagerService')?.value)">Call Next</button>
          <button class="btn btn-ghost" onclick="queueResetCompleted()">Clear Finished</button>
        </div>
      </div>

      <div class="queue-stats">
        <div class="queue-stat"><strong>${active.length}</strong><span>Active</span></div>
        <div class="queue-stat"><strong>${waiting.length}</strong><span>Waiting</span></div>
        <div class="queue-stat"><strong>${called.length}</strong><span>Called</span></div>
        <div class="queue-stat"><strong>${service.length}</strong><span>In Service</span></div>
        <div class="queue-stat"><strong>${avg} min</strong><span>Average Wait</span></div>
      </div>

      <form class="queue-add-form" id="queueAddForm">
        <h3>Add Patient to Queue</h3>
        <div class="queue-form-grid">
          <label>Patient name
            <input id="qmPatientName" required placeholder="Full name">
          </label>
          <label>Phone
            <input id="qmPatientPhone" placeholder="Optional phone number">
          </label>
          <label>Service
            <select id="qmService">${queueServices().map(x=>`<option>${queueEsc(x)}</option>`).join('')}</select>
          </label>
          <label>Priority
            <select id="qmPriority">
              <option>Normal</option>
              <option>Urgent</option>
              <option>Emergency</option>
            </select>
          </label>
          <label class="queue-notes">Notes
            <input id="qmNotes" placeholder="Optional notes">
          </label>
          <button class="btn btn-primary queue-add-btn" type="submit">Add to Queue</button>
        </div>
      </form>

      <div class="queue-toolbar">
        <label>Filter service
          <select id="queueManagerService">
            <option>All Services</option>
            ${queueServices().map(x=>`<option>${queueEsc(x)}</option>`).join('')}
          </select>
        </label>
        <label>Status
          <select id="queueManagerStatus">
            <option value="active">Active</option>
            <option value="waiting">Waiting</option>
            <option value="called">Called</option>
            <option value="service">In Service</option>
            <option value="completed">Completed</option>
            <option value="no-show">No-show</option>
            <option value="all">All</option>
          </select>
        </label>
        <input id="queueManagerSearch" placeholder="Search patient or queue number">
      </div>

      <div id="queueManagerTable"></div>
    </div>`;

  document.getElementById('queueAddForm').addEventListener('submit', e=>{
    e.preventDefault();
    try{
      queueAddPatient({
        name: document.getElementById('qmPatientName').value,
        phone: document.getElementById('qmPatientPhone').value,
        service: document.getElementById('qmService').value,
        priority: document.getElementById('qmPriority').value,
        notes: document.getElementById('qmNotes').value
      });
      e.target.reset();
      showToast('Patient added to the queue.');
    }catch(err){ showToast(err.message); }
  });

  ['queueManagerService','queueManagerStatus','queueManagerSearch'].forEach(id=>{
    document.getElementById(id).addEventListener('input', renderHospitalQueueTable);
    document.getElementById(id).addEventListener('change', renderHospitalQueueTable);
  });
  renderHospitalQueueTable();
}
function renderHospitalQueueTable(){
  const host=document.getElementById('queueManagerTable');
  if(!host) return;
  const service=document.getElementById('queueManagerService')?.value || 'All Services';
  const status=document.getElementById('queueManagerStatus')?.value || 'active';
  const search=(document.getElementById('queueManagerSearch')?.value || '').trim().toLowerCase();

  let items=queueLoad();
  items=items.filter(x=>service==='All Services'||x.service===service);
  if(status==='active') items=items.filter(x=>!['completed','no-show'].includes(x.status));
  else if(status!=='all') items=items.filter(x=>x.status===status);
  if(search) items=items.filter(x=>x.name.toLowerCase().includes(search)||String(x.number).padStart(3,'0').includes(search));

  items.sort((a,b)=>
    queuePriorityRank(a.priority)-queuePriorityRank(b.priority) ||
    new Date(a.time)-new Date(b.time)
  );

  if(!items.length){
    host.innerHTML='<div class="queue-empty">No patients match the current filter.</div>';
    return;
  }

  host.innerHTML=`<div class="queue-table-wrap"><table class="queue-table">
    <thead><tr>
      <th>No.</th><th>Patient</th><th>Service</th><th>Priority</th><th>Status</th><th>Waiting</th><th>Actions</th>
    </tr></thead>
    <tbody>${items.map(x=>{
      const wait=Math.max(0,Math.round((Date.now()-new Date(x.time).getTime())/60000));
      const actions =
        x.status==='waiting'
          ? `<button class="btn btn-sm btn-primary" onclick="queueCallNext('${queueEsc(x.service)}')">Call</button>`
          : x.status==='called'
          ? `<button class="btn btn-sm btn-primary" onclick="queueStart('${queueEsc(x.id)}')">Start Service</button>
             <button class="btn btn-sm btn-ghost" onclick="queueRecall('${queueEsc(x.id)}')">Recall</button>`
          : x.status==='service'
          ? `<button class="btn btn-sm btn-primary" onclick="queueComplete('${queueEsc(x.id)}')">Complete</button>`
          : `<button class="btn btn-sm btn-ghost" onclick="queueRecall('${queueEsc(x.id)}')">Return to Called</button>`;
      const extra = x.status==='waiting'
        ? ` <button class="btn btn-sm btn-ghost" onclick="queueNoShow('${queueEsc(x.id)}')">No-show</button>` : '';
      return `<tr>
        <td><strong>${String(x.number).padStart(3,'0')}</strong></td>
        <td><strong>${queueEsc(x.name)}</strong><small>${queueEsc(x.phone||'')}</small>${x.notes?`<small>${queueEsc(x.notes)}</small>`:''}</td>
        <td>${queueEsc(x.service)}</td>
        <td><span class="queue-priority priority-${x.priority.toLowerCase()}">${queueEsc(x.priority)}</span></td>
        <td><span class="queue-status status-${x.status}">${queueStatusLabel(x.status)}</span></td>
        <td>${wait} min</td>
        <td><div class="queue-row-actions">${actions}${extra}</div></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}
window.addEventListener('storage', e=>{
  if(e.key===QUEUE_KEY) renderHospitalQueue();
});

/* ============================================================
   9. LOCAL ACCOUNT ACCESS
   ------------------------------------------------------------
   Front-end only: accounts are stored locally in this browser.
   No preset accounts are included.
   ============================================================ */
function normalizeName(name){ return String(name||'').trim().replace(/\s+/g,' '); }
function getLocalUsers(){ try{return JSON.parse(localStorage.getItem('tnc_users_v2')||'[]');}catch(e){return [];} }
function saveLocalUsers(users){ localStorage.setItem('tnc_users_v2',JSON.stringify(users)); }
function getLocalUser(name){ const n=normalizeName(name).toLowerCase(); return getLocalUsers().find(u=>u.name.toLowerCase()===n); }
function attemptLogin(name,password){ const u=getLocalUser(name); return u && u.password===password ? u : null; }
function logInAs(name){
  localStorage.setItem('tnc_current_user',name);
  document.body.classList.remove('not-authed');
  const profileNameEl=document.getElementById('profileName'); if(profileNameEl) profileNameEl.textContent=name;
}
function logOut(){
  localStorage.removeItem('tnc_current_user'); document.body.classList.add('not-authed');
  document.getElementById('loginForm')?.reset(); document.getElementById('signupForm')?.reset();
  document.getElementById('loginError')?.setAttribute('hidden',''); document.getElementById('signupError')?.setAttribute('hidden','');
  goTo('home');
}
function checkExistingSession(){ const existing=localStorage.getItem('tnc_current_user'); if(existing) logInAs(existing); }
function setupAuth(){
  document.querySelectorAll('.auth-tab').forEach(tab=>tab.addEventListener('click',()=>{
    document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active');
    const login=tab.dataset.authTab==='login'; document.getElementById('loginForm').hidden=!login; document.getElementById('signupForm').hidden=login;
  }));
  document.getElementById('loginForm').addEventListener('submit',e=>{
    e.preventDefault(); const name=document.getElementById('loginName').value, password=document.getElementById('loginPassword').value;
    const match=attemptLogin(name,password), err=document.getElementById('loginError');
    if(match){err.hidden=true; logInAs(match.name); showToast(`Welcome, ${match.name}`);}
    else{err.textContent='Name or password is incorrect.'; err.hidden=false;}
  });
  document.getElementById('signupForm').addEventListener('submit',e=>{
    e.preventDefault(); const name=normalizeName(document.getElementById('signupName').value), password=document.getElementById('signupPassword').value, confirm=document.getElementById('signupConfirm').value, err=document.getElementById('signupError');
    if(name.length<2 || password.length<4){err.textContent='Enter a name and a password of at least 4 characters.'; err.hidden=false; return;}
    if(password!==confirm){err.textContent='Passwords do not match.'; err.hidden=false; return;}
    if(getLocalUser(name)){err.textContent='An account with that name already exists.'; err.hidden=false; return;}
    const users=getLocalUsers(); users.push({name,password,createdAt:Date.now()}); saveLocalUsers(users); err.hidden=true; logInAs(name); showToast(`Account created — welcome, ${name}`);
  });
  document.body.addEventListener('click',e=>{if(e.target.id==='logoutBtn') logOut();});
}

/* ============================================================
   10. EVENT LISTENERS — wired up once the DOM is ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // auth: wire up login/signup, then check if already logged in this browser
  setupAuth();
  checkExistingSession();

  // initial screen
  initHome();
  alreadyInitialised.add('home');
  initTodayDashboard();

  // --- global nav clicks (top nav, sidebar, bottom nav, category cards, brand) ---
  document.body.addEventListener('click', (e)=>{
    const navEl = e.target.closest('[data-nav]');
    if(navEl){
      e.preventDefault();
      goTo(navEl.dataset.nav);
    }

    // filter chips (delegated, works for every chip-row in the app)
    const chip = e.target.closest('.chip');
    if(chip){
      const row = chip.parentElement;
      row.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      applyFilter(row.id, chip.dataset.filter);
    }
  });

  // --- mobile menu open/close ---
  document.getElementById('menuBtn').addEventListener('click', ()=>{
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

  // --- search ---
  document.getElementById('mainSearchBtn').addEventListener('click', ()=>{
    runSearch(document.getElementById('mainSearch').value);
  });
  document.getElementById('mainSearch').addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') runSearch(e.target.value);
  });

  // --- hospital queue ---
  document.getElementById('getTicketBtn').addEventListener('click', getDigitalTicket);

  // --- concern form ---
  document.getElementById('concernForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.target).entries());
    const items=JSON.parse(localStorage.getItem('tnc_concerns_v1')||'[]');
    items.unshift({...data,id:'C'+Date.now().toString(36).toUpperCase(),createdAt:Date.now()});
    localStorage.setItem('tnc_concerns_v1',JSON.stringify(items));
    showToast('Concern saved on this device.');
    e.target.reset();
  });

  // --- profile tabs ---
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> renderProfileTab(btn.dataset.tab));
  });

  // --- modal close ---
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e)=>{
    if(e.target.id === 'modalOverlay') closeModal();
  });
});

/* ============================================================
   11. FILTERING for chip rows
   ============================================================ */

function applyFilter(rowId, filter){
  const map = {
    jobsFilterChips:    { list:'jobsList',    data:JOBS,       key:'tag',    render:jobCard },
    skillsFilterChips:  { list:'skillsList',  data:PROVIDERS,  key:'service',render:providerCard },
    businessFilterChips:{ list:'businessList',data:BUSINESSES, key:'type',   render:businessCard },
    agriFilterChips:    { list:'agriList',    data:AGRI,       key:'role',   render:agriCard },
    propertyFilterChips:{ list:'propertyList',data:PROPERTY,   key:'kind',   render:propertyCard },
    transportFilterChips:{list:'transportList',data:TRANSPORT, key:'type',   render:transportCard },
    eventsFilterChips:  { list:'eventsList',  data:EVENTS,     key:'type',   render:eventCard },
  };
  const cfg = map[rowId];
  if(!cfg) return;
  const items = filter === 'All' ? cfg.data : cfg.data.filter(d => d[cfg.key] === filter);
  document.getElementById(cfg.list).innerHTML = items.map(cfg.render).join('');
}
/* ============================================================
   TN AI — LANGUAGE DETECTION
   Guesses whether a chat message is English or Kiswahili from its
   words, remembers the last detected language for short/ambiguous
   follow-ups (e.g. "yes", "Chuka"), and exposes it globally so both
   this file's chatbot and knowledge.js reply in the language the
   person is actually typing in.
   ============================================================ */
window.TNC_LANG = (function(){
  const SW_WORDS = new Set(['na','ya','wa','ni','kwa','za','la','cha','vya','pia','sana','tafadhali','asante','karibu','habari','mambo','jambo','vipi','poa','sawa','ndiyo','hapana','nataka','nahitaji','naomba','unaweza','unipe','niambie','wapi','nini','gani','lini','nani','je','leo','kesho','jana','sasa','hivi','hapa','pale','huko','mzuri','fundi','umeme','maji','barabara','shule','pesa','hela','duka','biashara','kilimo','mkulima','mgonjwa','daktari','dawa','hospitali','nenosiri','akaunti','sahau','badili','msimbo','kazi','ajira','huduma','nyumba','kodi','shamba','soko','usafiri','matatu','bodaboda','boda','tukio','matukio','serikali','malalamiko','msaada','tafuta','naweza','kwaheri','asubuhi','mchana','jioni','usiku','rafiki','ndugu','watoto','shughuli','fedha','bei','ghali','rahisi','ninataka','ninahitaji','nipe','nionyeshe','wapatikana','karibuni']);
  const EN_WORDS = new Set(['the','a','an','is','are','and','for','with','from','about','please','thanks','thank','hello','hi','hey','need','want','find','show','where','what','when','who','how','job','jobs','house','hospital','plumber','doctor','money','price','cheap','expensive','event','transport','farm','service','account','password','yes','no']);

  function detect(text){
    const q=String(text||'').toLowerCase();
    const tokens=q.replace(/[^a-z0-9\u00c0-\u024f'\s-]/g,' ').split(/\s+/).filter(Boolean);
    if(!tokens.length) return null;
    let sw=0, en=0;
    tokens.forEach(t=>{ if(SW_WORDS.has(t)) sw++; if(EN_WORDS.has(t)) en++; });
    if(sw===0 && en===0) return null; // ambiguous — caller falls back to the sticky/session language
    return sw>en ? 'sw' : 'en';
  }
  function get(){ return localStorage.getItem('tnc_chat_lang') || 'en'; }
  function set(l){ if(l==='en'||l==='sw') localStorage.setItem('tnc_chat_lang', l); }
  // Call once per incoming chat message: detects THIS message's language,
  // remembers it for the next ambiguous message, and returns the language
  // the reply should use.
  function resolve(text){
    const d=detect(text);
    if(d){ set(d); return d; }
    return get();
  }
  return { detect, get, set, resolve };
})();

/* THARAKA-NITHI DIGITAL CONNECT V2 — progressive enhancement layer
   Keeps the app consistent and adds polish, accessibility,
   install UX, theme switching, quick actions and an AI-assistant shell.
*/
(function(){
  'use strict';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function injectStyles(){
    const style=document.createElement('style');
    style.textContent=`
      .v2-commandbar{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0}
      .v2-command{border:1px solid var(--line);background:rgba(255,255,255,.9);color:var(--navy-900);padding:8px 11px;border-radius:999px;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 2px 8px rgba(11,31,51,.05)}
      .v2-command:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(11,31,51,.1)}
      .v2-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}
      .v2-stat{background:linear-gradient(145deg,#fff,#f7faf8);border:1px solid var(--line);border-radius:16px;padding:15px;box-shadow:var(--shadow);min-width:0}
      .v2-stat-label{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
      .v2-stat-value{font:800 24px/1 var(--font-display);color:var(--navy-900);margin-top:7px}
      .v2-stat-note{font-size:11px;color:var(--green-700);margin-top:6px;font-weight:700}
      .v2-section-head{display:flex;justify-content:space-between;align-items:end;gap:10px;margin:22px 0 10px}
      .v2-section-head h2{font-size:17px;color:var(--navy-900)}
      .v2-section-head span{font-size:11px;color:var(--muted)}
      .v2-offline{position:fixed;left:50%;bottom:76px;transform:translate(-50%,12px);z-index:180;background:#1f2937;color:#fff;border-radius:999px;padding:9px 14px;font-size:12px;font-weight:700;opacity:0;pointer-events:none;transition:.25s}
      .v2-offline.show{opacity:1;transform:translate(-50%,0)}
      .v2-fab{position:fixed;right:18px;bottom:84px;z-index:90;width:58px;height:58px;border-radius:18px;border:0;background:linear-gradient(145deg,var(--green-700),var(--navy-900));color:#fff;box-shadow:0 14px 28px rgba(11,31,51,.24);font-size:24px;cursor:pointer}
      .v2-fab small{display:block;font-size:8px;margin-top:2px;letter-spacing:.04em}
      .v2-panel{position:fixed;right:18px;bottom:154px;width:min(390px,calc(100vw - 36px));z-index:170;background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 24px 60px rgba(11,31,51,.24);overflow:hidden;display:none}
      .v2-panel.open{display:block;animation:v2pop .18s ease}
      @keyframes v2pop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
      .v2-panel-head{padding:16px;background:linear-gradient(145deg,var(--green-900),var(--navy-900));color:#fff;display:flex;align-items:center;justify-content:space-between}
      .v2-panel-head strong{font-family:var(--font-display)}
      .v2-panel-body{padding:14px}
      .v2-ai-input{display:flex;gap:8px;margin-top:12px}.v2-ai-input input{flex:1;border:1px solid var(--line);border-radius:12px;padding:11px;outline:none}.v2-ai-input button{border:0;border-radius:12px;background:var(--green-700);color:#fff;padding:0 14px;font-weight:800}
      .v2-ai-answer{background:var(--green-100);border-radius:14px;padding:12px;font-size:13px;line-height:1.55;color:var(--green-900)}
      .v2-theme-btn{font-size:14px}
      .v2-search-suggestions{display:none;position:absolute;left:14px;right:14px;top:64px;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow-lg);z-index:30;overflow:hidden}
      .v2-search-suggestions.open{display:block}
      .v2-suggestion{padding:10px 12px;font-size:13px;cursor:pointer}.v2-suggestion:hover{background:var(--green-100)}
      body.v2-dark{--bg:#08120f;--card:#0f1c18;--ink:#edf7f1;--muted:#9fb3a8;--line:#263a32;--navy-900:#edf7f1;--navy-700:#cfe3d7;--green-100:#17372a}
      body.v2-dark .v2-stat,body.v2-dark .search-card,body.v2-dark .card,body.v2-dark .cat-card,body.v2-dark .modal,body.v2-dark .v2-panel{background:#0f1c18;color:#edf7f1}
      body.v2-dark .v2-suggestion{background:#0f1c18;color:#edf7f1}
      body.v2-dark .v2-suggestion:hover{background:#17372a}
      body.v2-large{font-size:112%}
      @media(max-width:760px){.v2-stats{grid-template-columns:repeat(2,1fr)}.v2-fab{right:14px}.v2-panel{right:14px}}
      @media(min-width:1100px){.v2-fab{bottom:28px}.v2-panel{bottom:98px}}
    `;
    document.head.appendChild(style);
  }

  function addHomeEnhancements(){
    const home=$('#screen-home');
    if(!home || $('#v2Stats')) return;
    const hero=$('.hero',home);
    if(hero){
      const command=document.createElement('div');
      command.className='v2-commandbar';
      command.innerHTML=`
        <button class="v2-command" data-v2-nav="emergency">🚨 Emergency</button>
        <button class="v2-command" data-v2-nav="health">🏥 Hospitals</button>
        <button class="v2-command" data-v2-nav="jobs">💼 Find a Job</button>
        <button class="v2-command" data-v2-nav="business">🛍 Marketplace</button>`;
      hero.appendChild(command);
    }
    const stats=document.createElement('section');
    stats.id='v2Stats';
    stats.innerHTML=`
      <div class="v2-section-head"><h2>County at a glance</h2><span>Current local metrics</span></div>
      <div class="v2-stats">
        <div class="v2-stat"><div class="v2-stat-label">Opportunities</div><div class="v2-stat-value">0</div><div class="v2-stat-note">Add local listings</div></div>
        <div class="v2-stat"><div class="v2-stat-label">Businesses</div><div class="v2-stat-value">0</div><div class="v2-stat-note">Add local listings</div></div>
        <div class="v2-stat"><div class="v2-stat-label">Health tickets</div><div class="v2-stat-value">0</div><div class="v2-stat-note">No queue activity</div></div>
        <div class="v2-stat"><div class="v2-stat-label">Community reports</div><div class="v2-stat-value">0</div><div class="v2-stat-note">No reports yet</div></div>
      </div>`;
    const cats=$('.section-title',home);
    if(cats) cats.parentNode.insertBefore(stats,cats);
  }

  function addThemeControls(){
    const actions=$('.topbar-actions');
    if(!actions || $('#v2Theme')) return;
    const btn=document.createElement('button');
    btn.id='v2Theme'; btn.className='icon-btn v2-theme-btn'; btn.title='Toggle dark mode'; btn.setAttribute('aria-label','Toggle dark mode'); btn.textContent='◐';
    actions.insertBefore(btn,actions.firstChild);
    btn.addEventListener('click',()=>{
      document.body.classList.toggle('v2-dark');
      localStorage.setItem('tnc_theme',document.body.classList.contains('v2-dark')?'dark':'light');
    });
    if(localStorage.getItem('tnc_theme')==='dark') document.body.classList.add('v2-dark');
  }

  function addAccessibility(){
    const actions=$('.topbar-actions'); if(!actions || $('#v2A11y')) return;
    const btn=document.createElement('button'); btn.id='v2A11y'; btn.className='icon-btn'; btn.title='Increase text size'; btn.setAttribute('aria-label','Increase text size'); btn.textContent='A+';
    actions.insertBefore(btn,actions.firstChild);
    btn.addEventListener('click',()=>{document.body.classList.toggle('v2-large'); localStorage.setItem('tnc_large',document.body.classList.contains('v2-large')?'1':'0')});
    if(localStorage.getItem('tnc_large')==='1') document.body.classList.add('v2-large');
  }

  function addSmartSearch(){
    const input=$('#mainSearch'); const card=$('.search-card'); if(!input||!card||$('#v2Suggestions')) return;
    card.style.position='relative';
    const box=document.createElement('div'); box.id='v2Suggestions'; box.className='v2-search-suggestions'; card.appendChild(box);
    const suggestions=['Electrician in Chuka','Jobs in Chuka','Hospital near Chogoria','House for rent','Farm inputs','Community events'];
    function render(q){
      const vals=suggestions.filter(x=>!q || x.toLowerCase().includes(q.toLowerCase())).slice(0,5);
      box.innerHTML=vals.map(v=>`<div class="v2-suggestion">🔎 ${v}</div>`).join(''); box.classList.toggle('open',vals.length>0);
    }
    input.addEventListener('focus',()=>render(input.value));
    input.addEventListener('input',()=>render(input.value));
    document.addEventListener('click',e=>{const item=e.target.closest('.v2-suggestion'); if(item){input.value=item.textContent.replace('🔎 ',''); box.classList.remove('open'); $('#mainSearchBtn')?.click();} else if(!e.target.closest('.search-card')) box.classList.remove('open')});
  }

  function addAI(){
    if($('#v2Fab')) return;

    const fab=document.createElement('button');
    fab.id='v2Fab';
    fab.className='v2-fab';
    fab.innerHTML='<span class="v2-fab-orb">✦</span><span class="v2-fab-label">TN AI</span>';
    fab.title='Open TN AI chat';
    fab.setAttribute('aria-label','Open TN AI chatbot');
    document.body.appendChild(fab);

    const panel=document.createElement('section');
    panel.id='v2Panel';
    panel.className='v2-chat-shell';
    panel.setAttribute('aria-label','TN AI chatbot');
    panel.innerHTML=`
      <div class="v2-chat-head">
        <div class="v2-chat-brand">
          <div class="v2-ai-avatar">✦</div>
          <div>
            <strong>TN AI</strong>
            <span><i></i> Tharaka-Nithi Digital Assistant</span>
          </div>
        </div>
        <div class="v2-chat-head-actions">
          <button id="v2NewChat" class="v2-chat-icon" title="New chat" aria-label="Start a new chat">＋</button>
          <button id="v2Close" class="v2-chat-icon" title="Close chat" aria-label="Close chat">×</button>
        </div>
      </div>

      <div id="v2ChatMessages" class="v2-chat-messages" aria-live="polite"></div>

      <div id="v2Typing" class="v2-typing" hidden>
        <div class="v2-ai-avatar small">✦</div>
        <div class="v2-typing-bubble"><span></span><span></span><span></span></div>
      </div>

      <div class="v2-suggested-wrap">
        <div class="v2-suggested-title">Try asking</div>
        <div id="v2SuggestionsChat" class="v2-suggested"></div>
      </div>

      <div class="v2-chat-compose">
        <button id="v2Attach" class="v2-compose-icon" title="Attach (coming soon)" aria-label="Attach file">＋</button>
        <textarea id="v2AiInput" rows="1" placeholder="Message TN AI…" aria-label="Message TN AI"></textarea>
        <button id="v2Voice" class="v2-compose-icon" title="Voice input (coming soon)" aria-label="Voice input">⌕</button>
        <button id="v2AiSend" class="v2-send" title="Send message" aria-label="Send message">➤</button>
      </div>
      <div class="v2-chat-disclaimer">TN AI can make mistakes. Verify important official, medical, legal and emergency information.</div>
    `;
    document.body.appendChild(panel);

    const messages=$('#v2ChatMessages',panel);
    const input=$('#v2AiInput',panel);
    const typing=$('#v2Typing',panel);
    const suggestions=$('#v2SuggestionsChat',panel);
    const historyKey='tnc_ai_chat_history_v2';

    const starterPrompts=[
      'Find a plumber in Chuka',
      'Show me jobs in Chuka',
      'I need a hospital',
      'What events are coming up?',
      'Find a house for rent',
      'How do I report a bad road?'
    ];

    const escapeHtml=(value)=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

    function saveHistory(){
      const items=[...messages.querySelectorAll('.v2-message')].map(el=>({role:el.dataset.role,text:el.querySelector('.v2-bubble')?.textContent||''}));
      localStorage.setItem(historyKey,JSON.stringify(items.slice(-30)));
    }

    function scrollBottom(){messages.scrollTop=messages.scrollHeight;}

    function addMessage(role,text,opts={}){
      const row=document.createElement('div');
      row.className=`v2-message ${role==='user'?'user':'assistant'}`;
      row.dataset.role=role;
      const avatar=role==='user'?'You':'✦';
      row.innerHTML=`<div class="v2-message-avatar">${avatar}</div><div class="v2-message-main"><div class="v2-bubble">${escapeHtml(text).replace(/\n/g,'<br>')}</div>${role==='assistant'&&!opts.welcome?'<div class="v2-msg-actions"><button data-copy>Copy</button><button data-helpful="up">👍</button><button data-helpful="down">👎</button></div>':''}</div>`;
      messages.appendChild(row);
      scrollBottom();
      saveHistory();
      return row;
    }

    function clearChat(){
      messages.innerHTML='';
      localStorage.removeItem(historyKey);
      addMessage('assistant','Hello! I’m TN AI, your Tharaka-Nithi Digital Connect assistant. I can help you find jobs, services, businesses, hospitals, property, events, agriculture information and county services.',{welcome:true});
      renderSuggestions();
    }

    function renderSuggestions(){
      suggestions.innerHTML=starterPrompts.map(q=>`<button class="v2-suggestion-chip" data-prompt="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('');
    }

    function loadHistory(){
      try{
        const saved=JSON.parse(localStorage.getItem(historyKey)||'[]');
        if(saved.length){saved.forEach(m=>addMessage(m.role,m.text,{welcome:true}));}
        else clearChat();
      }catch(e){clearChat();}
      renderSuggestions();
    }

    function findMatches(collection,query,fields){
      const words=query.toLowerCase().split(/\s+/).filter(w=>w.length>2);
      return collection.filter(item=>words.some(w=>fields.some(f=>String(item[f]||'').toLowerCase().includes(w)))).slice(0,4);
    }

    function localAssistant(query){
      const q=query.toLowerCase();

      // Detect the language of THIS message (falls back to whichever
      // language the conversation has been using) so every reply below
      // is produced in the language the person is actually typing in.
      const lang=window.TNC_LANG?window.TNC_LANG.resolve(query):'en';
      const sw=lang==='sw';
      const t=(en,swText)=>sw?swText:en;

      // Account recovery is handled by the local account flow.
      // The chatbot never asks users to reveal their existing password.
      if(/forgot.*password|password.*forgot|reset.*password|change.*password|sahau.*nenosiri|nenosiri.*sahau|badili.*nenosiri|weka upya.*nenosiri/.test(q)){
        if(window.TN_LANGUAGE && typeof window.TN_LANGUAGE.openRecovery==='function') window.TN_LANGUAGE.openRecovery('',false);
        return t(
          'No problem. I opened the password recovery flow. For your security, never send me your current password. The recovery process verifies you before allowing a new password.',
          'Hakuna shida. Nimefungua hatua za kurejesha nenosiri. Kwa usalama wako, usinipe nenosiri lako la sasa. Tutatumia uthibitishaji kabla ya kuweka nenosiri jipya.'
        );
      }

      // First consult the website-fed knowledge layer. It reads the same
      // datasets used by the app, so the chatbot is answering from current
      // frontend content rather than a separate list of hard-coded replies.
      if(window.TN_AI_KNOWLEDGE && typeof window.TN_AI_KNOWLEDGE.answer === 'function'){
        const knowledgeAnswer=window.TN_AI_KNOWLEDGE.answer(query);
        if(knowledgeAnswer) return knowledgeAnswer;
      }

      // Anything an admin has published through the admin portals shows up
      // here too, since it's read straight from the same shared store that
      // updates the public app — the chatbot never falls behind fresh content.
      if(window.TNC_SYNC && typeof window.TNC_SYNC.search==='function'){
        const live=window.TNC_SYNC.search(query,4);
        if(live.length){
          const rows=live.map(x=>`• ${window.TNC_SYNC.title(x)} — ${window.TNC_SYNC.detail(x)}`).join('\n');
          return t(
            `Here is recently published information from Tharaka-Nithi Digital Connect administrators:\n\n${rows}\n\nYou'll also find this on the matching section of the app.`,
            `Hizi ni taarifa zilizochapishwa hivi karibuni na wasimamizi wa Tharaka-Nithi Digital Connect:\n\n${rows}\n\nUtaziona pia kwenye sehemu husika ya programu.`
          );
        }
      }

      if(/plumber|electrician|mechanic|tailor|welder|builder|carpenter|photographer|tutor|designer/.test(q)){
        const matches=findMatches(PROVIDERS,q,['name','service','loc']);
        if(matches.length){
          const rows=matches.map(x=>`• ${x.name} — ${x.service}, ${x.loc} — ⭐ ${x.rating}${x.verified?t(' · Verified',' · Amethibitishwa'):''}`).join('\n');
          return t(
            `I found these service providers in the local directory:\n\n${rows}\n\nOpen Skills & Services to view their profiles. This is local data and should be verified before contacting a provider.`,
            `Nimepata watoa huduma hawa kwenye orodha ya majaribio:\n\n${rows}\n\nFungua Ujuzi na Huduma ili kuona wasifu wao. Hii ni data ya majaribio na inapaswa kuthibitishwa kabla ya kuwasiliana na mtoa huduma.`
          );
        }
        return t(
          'I can help with local service providers. Try asking for a plumber, electrician, mechanic, tailor, builder or another service.',
          'Ninaweza kukusaidia kupata watoa huduma wa karibu. Jaribu kuuliza kuhusu fundi bomba, fundi umeme, fundi magari, mshonaji, fundi ujenzi au huduma nyingine.'
        );
      }

      if(/job|work|employment|internship|scholarship|bursary|tender|gig|opportunit/.test(q)){
        const matches=findMatches(JOBS,q,['title','loc','type','tag']);
        if(matches.length){
          const rows=matches.map(x=>`• ${x.title} — ${x.loc} — ${x.pay}`).join('\n');
          return t(
            `Here are matching opportunities from the local directory:\n\n${rows}\n\nOpen Jobs & Opportunities to browse the full list and filters.`,
            `Hizi ni fursa zinazolingana kutoka kwenye orodha ya majaribio:\n\n${rows}\n\nFungua Kazi na Fursa ili kuona orodha kamili na vichujio.`
          );
        }
        return t(
          'I can help you find jobs, internships, scholarships, tenders and gigs. Tell me your preferred town or opportunity type.',
          'Ninaweza kukusaidia kupata kazi, mafunzo kwa vitendo, ufadhili wa masomo, zabuni na kazi ndogo ndogo. Niambie mji unaopendelea au aina ya fursa.'
        );
      }

      if(/hospital|doctor|clinic|health|medical|queue|appointment/.test(q)){
        const matches=findMatches(HOSPITALS,q,['name','loc','services']);
        if(matches.length){
          const rows=matches.map(x=>`• ${x.name} — ${x.loc}\n  ${t('Services','Huduma')}: ${x.services}`).join('\n\n');
          return t(
            `Here are matching healthcare facilities in the local directory:\n\n${rows}\n\nOpen Healthcare for the directory and queue feature. Emergency and medical information must be verified from official sources.`,
            `Hizi ni vituo vya afya vinavyolingana kutoka kwenye orodha ya majaribio:\n\n${rows}\n\nFungua Afya kwa orodha kamili na kipengele cha foleni cha majaribio. Taarifa za dharura na matibabu lazima zithibitishwe kutoka vyanzo rasmi.`
          );
        }
        return t(
          'I can help you find healthcare facilities, departments and the digital queue. Tell me a town such as Chuka, Kathwana, Chogoria or Marimanti.',
          'Ninaweza kukusaidia kupata vituo vya afya, idara na foleni ya kidijitali ya majaribio. Niambie mji kama Chuka, Kathwana, Chogoria au Marimanti.'
        );
      }

      if(/farm|agri|farmer|market price|fertil|crop|livestock|produce|buyer/.test(q)){
        const matches=findMatches(AGRI,q,['name','role','produce','loc','note']);
        if(matches.length){
          const rows=matches.map(x=>`• ${x.name} — ${x.role}, ${x.loc}\n  ${x.produce} — ${x.note}`).join('\n\n');
          return t(
            `Here are matching agriculture entries from the local directory:\n\n${rows}\n\nOpen Agriculture & Markets for the full directory. Market prices shown here are entered locally and should be verified before use.`,
            `Hizi ni taarifa za kilimo zinazolingana kutoka kwenye orodha ya majaribio:\n\n${rows}\n\nFungua Kilimo na Masoko kwa orodha kamili. Bei za soko zinazoonyeshwa hazitumiki moja kwa moja isipokuwa zimeunganishwa na chanzo cha data kilichothibitishwa.`
          );
        }
        return t(
          'I can help with farmers, buyers, farm inputs, agricultural services and markets. Tell me the crop, service or town you are interested in.',
          'Ninaweza kukusaidia na wakulima, wanunuzi, pembejeo za kilimo, huduma za kilimo na masoko. Niambie zao, huduma au mji unaopenda.'
        );
      }

      if(/house|rent|plot|land|property|apartment|shop space/.test(q)){
        const matches=findMatches(PROPERTY,q,['title','loc','price','kind']);
        if(matches.length){
          const rows=matches.map(x=>`• ${x.title} — ${x.loc} — ${x.price}`).join('\n');
          return t(
            `Here are matching properties from the local directory:\n\n${rows}\n\nOpen Property to see the full listings.`,
            `Hizi ni mali zinazolingana kutoka kwenye orodha ya majaribio:\n\n${rows}\n\nFungua Mali ili kuona orodha kamili.`
          );
        }
        return t(
          'I can help search houses, rentals, plots and commercial property. Tell me the town and your budget.',
          'Ninaweza kukusaidia kutafuta nyumba, upangaji, viwanja na mali za kibiashara. Niambie mji na bajeti yako.'
        );
      }

      if(/event|festival|marathon|sports|concert|meeting|baraza|weekend/.test(q)){
        const rows=EVENTS.slice(0,5).map(x=>`• ${x.title} — ${x.date} — ${x.loc}`).join('\n');
        return t(
          `Upcoming saved events include:\n\n${rows}\n\nOpen Events for more details. Dates and event information should be verified before publication.`,
          `Matukio yajayo ya majaribio ni pamoja na:\n\n${rows}\n\nFungua Matukio kwa maelezo zaidi. Tarehe na taarifa za matukio zinapaswa kuthibitishwa kabla ya kuchapishwa.`
        );
      }

      if(/transport|matatu|boda|taxi|fare|delivery|courier|travel/.test(q)){
        const rows=TRANSPORT.map(x=>`• ${x.name} — ${x.type} — ${x.route} — ${x.fare}`).join('\n');
        return t(
          `The local Transport directory includes:\n\n${rows}\n\nOpen Transport to explore routes and services.`,
          `Orodha ya Usafiri ya majaribio inajumuisha:\n\n${rows}\n\nFungua Usafiri ili kuchunguza njia na huduma.`
        );
      }

      if(/county service|permit|license|government|county office|department|bursary/.test(q)){
        return t(
          'I can help you navigate the County Services directory. Current departments include Health, Agriculture, Trade, Roads & Infrastructure and Education. Open County Services to see the available local services.',
          'Ninaweza kukusaidia kupitia orodha ya Huduma za Kaunti. Idara za sasa za majaribio ni pamoja na Afya, Kilimo, Biashara, Barabara na Miundombinu, na Elimu. Fungua Huduma za Kaunti kuona huduma zinazopatikana.'
        );
      }

      if(/road|water|complaint|report|concern|broken|pothole/.test(q)){
        return t(
          'You can submit a community concern through the Leaders / Community Concerns section. Include the category, description, location and supporting photo where appropriate. The reports are stored locally on this device.',
          'Unaweza kuwasilisha wasiwasi wa jamii kupitia sehemu ya Viongozi / Malalamiko ya Jamii. Jumuisha aina, maelezo, eneo na picha inayounga mkono inapohitajika. Majaribio bado hayatumi ripoti kwa mfumo halisi wa kaunti.'
        );
      }

      if(/hello|hi|hey|good morning|good afternoon|good evening|habari|mambo|jambo/.test(q)){
        return t(
          'Hello! 👋 I’m TN AI. What would you like help with today? You can ask me to find a job, service provider, hospital, property, event, transport option, agricultural service or county service.',
          'Habari! 👋 Mimi ni TN AI. Ungependa msaada gani leo? Unaweza kuniuliza kutafuta kazi, mtoa huduma, hospitali, mali, tukio, usafiri, huduma za kilimo au huduma za kaunti.'
        );
      }

      return t(
        'I can help you navigate Tharaka-Nithi Digital Connect. Try asking something like:\n\n• “Find a plumber in Chuka”\n• “Show me jobs in Chuka”\n• “I need a hospital”\n• “Find a house for rent”\n• “What events are coming up?”\n• “How do I report a bad road?”\n\nFor official, medical, legal or emergency information, always verify details with the relevant authority.',
        'Ninaweza kukusaidia kutumia Tharaka-Nithi Digital Connect. Jaribu kuuliza kitu kama:\n\n• “Tafuta fundi bomba Chuka”\n• “Nionyeshe kazi Chuka”\n• “Nahitaji hospitali”\n• “Tafuta nyumba ya kupanga”\n• “Kuna matukio gani yanakuja?”\n• “Ninawezaje kuripoti barabara mbovu?”\n\nKwa taarifa rasmi, za matibabu, kisheria au dharura, hakikisha umethibitisha na mamlaka husika.'
      );
    }

    async function getAssistantResponse(query){
      // Optional production endpoint. Set window.TN_AI_API_URL to a secure backend endpoint.
      if(window.TN_AI_API_URL){
        try{
          const response=await fetch(window.TN_AI_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:query,history:[...messages.querySelectorAll('.v2-message')].slice(-12).map(m=>({role:m.dataset.role,text:m.querySelector('.v2-bubble')?.textContent||''}))})});
          if(response.ok){const data=await response.json(); if(data.reply) return data.reply;}
        }catch(error){console.warn('TN AI backend unavailable; using local assistant.',error);}
      }
      return localAssistant(query);
    }

    async function ask(){
      const q=input.value.trim();
      if(!q)return;
      input.value='';
      input.style.height='auto';
      addMessage('user',q);
      suggestions.classList.add('hidden');
      typing.hidden=false;
      scrollBottom();
      await new Promise(resolve=>setTimeout(resolve,450));
      const response=await getAssistantResponse(q);
      typing.hidden=true;
      addMessage('assistant',response);
      suggestions.classList.remove('hidden');
      renderSuggestions();
    }

    fab.addEventListener('click',()=>{
      panel.classList.add('open');
      setTimeout(()=>input.focus(),100);
    });
    $('#v2Close').addEventListener('click',()=>panel.classList.remove('open'));
    $('#v2NewChat').addEventListener('click',clearChat);
    $('#v2AiSend').addEventListener('click',ask);
    $('#v2Attach').addEventListener('click',()=>showToast('Attachments will be available when TN AI is connected to a backend.'));
    $('#v2Voice').addEventListener('click',()=>showToast('Voice input is prepared for a future speech-to-text integration.'));

    input.addEventListener('input',()=>{
      input.style.height='auto';
      input.style.height=Math.min(input.scrollHeight,130)+'px';
    });
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask();}
    });

    suggestions.addEventListener('click',e=>{
      const btn=e.target.closest('[data-prompt]');
      if(!btn)return;
      input.value=btn.dataset.prompt;
      ask();
    });

    messages.addEventListener('click',async e=>{
      const copy=e.target.closest('[data-copy]');
      if(copy){
        const bubble=copy.closest('.v2-message-main')?.querySelector('.v2-bubble');
        if(bubble){await navigator.clipboard?.writeText(bubble.textContent||'');showToast('Response copied');}
      }
      const helpful=e.target.closest('[data-helpful]');
      if(helpful){showToast(helpful.dataset.helpful==='up'?'Thanks for the feedback 👍':'Thanks for the feedback');}
    });

    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&panel.classList.contains('open'))panel.classList.remove('open');
    });

    loadHistory();
  }

  function addOffline(){
    const el=document.createElement('div'); el.className='v2-offline'; el.textContent='You are offline — showing cached content'; document.body.appendChild(el);
    function update(){el.classList.toggle('show',!navigator.onLine)}
    window.addEventListener('online',update); window.addEventListener('offline',update); update();
  }

  function addInstallPrompt(){
    let deferred=null;
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e; const btn=document.createElement('button');btn.className='v2-command';btn.id='v2Install';btn.textContent='📲 Install App';$('.v2-commandbar')?.appendChild(btn);btn.addEventListener('click',async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;btn.remove()})});
  }

  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-v2-nav]');
    if(nav && typeof window.goTo==='function'){e.preventDefault();window.goTo(nav.dataset.v2Nav)}
  });

  document.addEventListener('DOMContentLoaded',()=>{
    injectStyles();
    addHomeEnhancements();
    addThemeControls();
    addAccessibility();
    addSmartSearch();
    addAI();
    addOffline();
    addInstallPrompt();
  });
})();


/* ============================================================
   MULTILINGUAL PASSWORD RECOVERY / CHANGE PASSWORD
   Front-end only: update the account stored in this browser.
   ============================================================ */
(function(){
  const T={
    en:{title:'Reset your password',intro:'Choose your account and set a new password on this device.',identity:'Full name',newPass:'New password',confirm:'Confirm new password',send:'Continue',save:'Set new password',done:'Password changed successfully.',forgot:'Forgot your password?',login:'Log In',fullName:'Full Name',password:'Password'},
    sw:{title:'Weka upya nenosiri lako',intro:'Chagua akaunti yako na uweke nenosiri jipya kwenye kifaa hiki.',identity:'Jina kamili',newPass:'Nenosiri jipya',confirm:'Thibitisha nenosiri jipya',send:'Endelea',save:'Weka nenosiri jipya',done:'Nenosiri limebadilishwa.',forgot:'Umesahau nenosiri?',login:'Ingia',fullName:'Jina kamili',password:'Nenosiri'},
    ki:{title:'Kîîtharaka — kuweka upya nenosiri',intro:'Chagua akaunti yako na uweke nenosiri jipya kwenye kifaa hiki.',identity:'Jina kamili',newPass:'Nenosiri jipya',confirm:'Thibitisha nenosiri jipya',send:'Endelea',save:'Weka nenosiri jipya',done:'Nenosiri limebadilishwa.',forgot:'Umesahau nenosiri?',login:'Ingia',fullName:'Jina kamili',password:'Nenosiri'}
  };
  const lang=()=>localStorage.getItem('tnc_language')||'en';
  const tr=k=>(T[lang()]||T.en)[k]||T.en[k]||k;
  function applyLanguage(){
    const l=lang(),sel=document.getElementById('tnLanguage'); if(sel)sel.value=l;
    const r=document.getElementById('passwordRecoveryOverlay'); if(!r)return;
    const map={passwordRecoveryTitle:'title',passwordRecoveryIntro:'intro',recoveryIdentityLabel:'identity',newPasswordLabel:'newPass',confirmPasswordLabel:'confirm',forgotPasswordBtn:'forgotPassword'};
    Object.entries(map).forEach(([id,k])=>{const el=document.getElementById(id);if(el)el.textContent=tr(k);});
    const b=document.getElementById('recoverySubmit'); if(b)b.textContent=tr('save');
  }
  function openRecovery(prefill){
    const o=document.getElementById('passwordRecoveryOverlay'); if(!o)return;
    o.hidden=false; document.getElementById('recoveryIdentity').value=prefill||'';
    document.getElementById('recoveryPasswordStep').hidden=false;
    document.getElementById('recoveryOtpStep').hidden=true;
    document.getElementById('recoveryError').hidden=true; applyLanguage();
  }
  function closeRecovery(){const o=document.getElementById('passwordRecoveryOverlay');if(o)o.hidden=true;}
  function setupRecovery(){
    document.getElementById('forgotPasswordBtn')?.addEventListener('click',()=>openRecovery(''));
    document.getElementById('changePasswordBtn')?.addEventListener('click',()=>openRecovery(localStorage.getItem('tnc_current_user')||''));
    document.getElementById('passwordRecoveryClose')?.addEventListener('click',closeRecovery);
    document.getElementById('passwordRecoveryOverlay')?.addEventListener('click',e=>{if(e.target.id==='passwordRecoveryOverlay')closeRecovery();});
    const form=document.getElementById('passwordRecoveryForm'); if(!form)return;
    form.addEventListener('submit',e=>{
      e.preventDefault(); const name=document.getElementById('recoveryIdentity').value.trim(), np=document.getElementById('recoveryNewPassword').value, cp=document.getElementById('recoveryConfirmPassword').value, err=document.getElementById('recoveryError');
      const users=getLocalUsers(); const idx=users.findIndex(u=>u.name.toLowerCase()===name.toLowerCase());
      if(idx<0){err.textContent=lang()==='sw'?'Akaunti haipatikani kwenye kifaa hiki.':'That account is not stored on this device.';err.hidden=false;return;}
      if(np.length<4){err.textContent='Password must be at least 4 characters.';err.hidden=false;return;}
      if(np!==cp){err.textContent='Passwords do not match.';err.hidden=false;return;}
      users[idx].password=np; saveLocalUsers(users); showToast(tr('done')); closeRecovery();
    });
    document.getElementById('tnLanguage')?.addEventListener('change',e=>{localStorage.setItem('tnc_language',e.target.value);applyLanguage();});
  }
  window.TN_LANGUAGE={applyLanguage,openRecovery};
  document.addEventListener('DOMContentLoaded',()=>{setupRecovery();applyLanguage();});
})();

/* EMERGENCY ALERT BANNER */
function initEmergencyAlert(){
  const banner=document.getElementById('emergencyAlert');
  if(!banner)return;
  const close=document.getElementById('emergencyAlertClose');
  const action=document.getElementById('emergencyAlertAction');
  if(localStorage.getItem('tnc_emergency_alert_dismissed')==='1') banner.classList.add('is-hidden');
  close?.addEventListener('click',()=>{banner.classList.add('is-hidden');localStorage.setItem('tnc_emergency_alert_dismissed','1');});
  action?.addEventListener('click',()=>{
    if(typeof openModal==='function') openModal(`<h2>🚨 Emergency Alert</h2><p class="muted">Tharaka-Nithi County</p><p style="font-size:13.5px;line-height:1.6;">Heavy rainfall may affect roads and low-lying areas. Take care when travelling, avoid flooded crossings, and follow official county emergency instructions.</p><div class="card-actions" style="margin-top:14px;"><button class="btn btn-primary" onclick="showToast('Emergency contacts opened')">Emergency Contacts</button><button class="btn btn-ghost" onclick="closeModal()">Close</button></div>`);
  });
}
document.addEventListener('DOMContentLoaded',initEmergencyAlert);


/* ============================================================
   TODAY IN THARAKA-NITHI DASHBOARD
   ============================================================ */
function initTodayDashboard(){
  const area=document.getElementById('myAreaSelect');
  const location=document.getElementById('locationSelect');
  const weatherLocation=document.getElementById('weatherLocation');
  const mapFilters=document.querySelectorAll('.map-filter');
  if(area){
    const saved=localStorage.getItem('tnc_my_area')||'Chuka'; area.value=saved;
    area.addEventListener('change',()=>{
      localStorage.setItem('tnc_my_area',area.value);
      if(location){location.value=area.value;}
      if(weatherLocation){
        const opt=[...weatherLocation.options].find(o=>o.value===area.value); if(opt){weatherLocation.value=area.value; weatherLocation.dispatchEvent(new Event('change'));}
      }
      showToast(`Your area is now ${area.value}`);
    });
  }
  mapFilters.forEach(btn=>btn.addEventListener('click',()=>{mapFilters.forEach(x=>x.classList.remove('active'));btn.classList.add('active');showToast(`${btn.textContent.trim()} selected`);}));
  document.querySelectorAll('[data-dashboard]').forEach(btn=>btn.addEventListener('click',()=>{
    const target=btn.dataset.dashboard;
    const routes={jobs:'jobs',health:'health',services:'county',map:'search',alerts:'emergency',weather:'home',agriculture:'agriculture',transport:'transport'};
    if(target==='weather'){document.getElementById('weatherPanel')?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    if(target==='map'){showToast('Interactive map is ready for county locations');return;}
    if(routes[target] && typeof goTo==='function') goTo(routes[target]);
  }));
}

window.addEventListener('storage', (event) => {
  if(event.key === 'tnc_admin_announcements'){
    const host = document.getElementById('homeAnnouncements');
    if(host){
      try{
        const items = JSON.parse(event.newValue || '[]').filter(a => a.status === 'Published');
        host.innerHTML = (items.length ? items : ANNOUNCEMENTS).map(a => announcementItem({
          ...a, title:a.title || a.name, desc:a.body || a.desc || a.description
        })).join('');
      }catch(e){}
    }
  }
});


/* ============================================================
   LIVE ADMIN -> PUBLIC SYNCHRONIZATION
   ============================================================ */
(function(){
  const KEY='tnc_live_content_v1';
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}}
  function render(){
    const host=document.getElementById('tncLivePublicUpdates'); if(!host)return;
    const items=load().filter(x=>x.public && ['Published','Active'].includes(x.data?.status) || x.public && x.data?.status==='Normal');
    if(!items.length){host.innerHTML='<p class="muted">No new published updates.</p>';return;}
    host.innerHTML=items.slice(0,12).map(x=>{
      const d=x.data||{}, icon=x.type==='alert'?'🚨':x.type==='update'||x.type==='capacity'||x.type==='queue'?'🏥':x.type==='opportunity'?'💼':x.type==='service'?'🏛️':x.type==='notice'?'📢':'📢';
      return `<article class="tnc-live-card"><b>${icon} ${esc(d.title||d.name||d.service||x.type)}</b><small>${esc(d.description||d.body||d.location||d.hospital||'')}</small><span>${esc(d.location||d.hospital||d.category||'Tharaka-Nithi')}</span></article>`;
    }).join('');
  }
  window.addEventListener('storage',e=>{if(e.key===KEY)render();});
  window.addEventListener('focus',render);
  document.addEventListener('DOMContentLoaded',render);
  window.TNCLiveSync={render,load};
})();

/* ============================================================
   PUBLIC APP LIVE ADMIN DATA RENDERER
   ============================================================ */
(function(){
  const KEY='tnc_live_content_v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}}
  function card(icon,x,extra=''){const d=x.data||{};return `<article class="tnc-public-card"><div class="tnc-public-icon">${icon}</div><div><h3>${esc(d.title||d.name||d.service||x.type)}</h3><p>${esc(d.description||d.body||'')}</p><small>${esc(d.location||d.hospital||d.department||d.category||'Tharaka-Nithi')}</small>${extra}</div></article>`}
  function render(){
    const all=load().filter(x=>x.public&&['Published','Active','Normal'].includes(x.data?.status));
    const groups={
      jobs:all.filter(x=>x.type==='opportunity'),
      agriculture:all.filter(x=>x.type==='agriculture'),
      transport:all.filter(x=>x.type==='transport'),
      health:all.filter(x=>['update','capacity','queue','appointment','staff','service'].includes(x.type)),
      services:all.filter(x=>x.type==='service'),
      emergency:all.filter(x=>x.type==='alert')
    };
    const defs=[['tncManagedJobs',groups.jobs,'💼'],['tncManagedAgriculture',groups.agriculture,'🌾'],['tncManagedTransport',groups.transport,'🚌'],['tncManagedHealth',groups.health,'🏥'],['tncManagedServices',groups.services,'🏛️'],['tncManagedEmergency',groups.emergency,'🚨']];
    defs.forEach(([id,items,icon])=>{const h=document.getElementById(id);if(!h)return;h.innerHTML=items.length?items.slice(0,12).map(x=>card(x.type==='alert'?'🚨':x.type==='appointment'?'📅':x.type==='staff'?'🧑‍⚕️':icon,x,x.type==='appointment'?`<strong>${esc(x.data?.date||'')} · ${esc(x.data?.time||'')} · ${esc(x.data?.slots||0)} slots</strong>`:x.type==='queue'?`<strong>${esc(x.data?.waiting||0)} waiting · ${esc(x.data?.wait||0)} min average</strong>`:'')).join(''):'<p class="muted">No published updates yet.</p>'});
  }
  window.addEventListener('storage',e=>{if(e.key===KEY)render()});
  document.addEventListener('DOMContentLoaded',render);
  window.addEventListener('focus',render);
})();



/* ============================================================
   UNIVERSAL ADMIN CONTENT EDITOR — FRONTEND ONLY
   ------------------------------------------------------------
   Every administrator can edit the site's visible content from
   one dashboard. Changes are persisted locally and synchronized
   across tabs on the same device.
   ============================================================ */
const ADMIN_EDIT_KEY = 'tnc_admin_editable_content_v1';

const ADMIN_EDITABLE_DEFAULTS = {
  site: {
    countyName: 'Tharaka-Nithi County',
    appName: 'Digital Connect',
    tagline: 'Everything Tharaka-Nithi in one digital platform.',
    supportEmail: '',
    supportPhone: '',
    notice: ''
  },
  home: {
    welcomeTitle: 'Welcome to Tharaka-Nithi Digital Connect',
    welcomeText: 'Access county services, opportunities, healthcare, transport, agriculture and community information.',
    announcements: []
  },
  services: [],
  leaders: [],
  emergencies: [],
  hospitals: [],
  opportunities: [],
  businesses: [],
  agriculture: [],
  transport: [],
  events: [],
  property: [],
  community: []
};

function adminEditableLoad(){
  try{
    const saved = JSON.parse(localStorage.getItem(ADMIN_EDIT_KEY) || 'null');
    return saved && typeof saved === 'object'
      ? {...structuredClone(ADMIN_EDITABLE_DEFAULTS), ...saved}
      : structuredClone(ADMIN_EDITABLE_DEFAULTS);
  }catch(e){
    return structuredClone(ADMIN_EDITABLE_DEFAULTS);
  }
}
function adminEditableSave(data){
  localStorage.setItem(ADMIN_EDIT_KEY, JSON.stringify(data));
  window.dispatchEvent(new StorageEvent('storage',{
    key:ADMIN_EDIT_KEY,newValue:JSON.stringify(data)
  }));
  if(typeof renderAdminEditablePreview === 'function') renderAdminEditablePreview();
}
function adminEditableSet(path, value){
  const data=adminEditableLoad();
  const parts=path.split('.');
  let obj=data;
  for(let i=0;i<parts.length-1;i++){
    if(!obj[parts[i]] || typeof obj[parts[i]]!=='object') obj[parts[i]]={};
    obj=obj[parts[i]];
  }
  obj[parts[parts.length-1]]=value;
  adminEditableSave(data);
}
function adminEditableDelete(section,id){
  const data=adminEditableLoad();
  if(!Array.isArray(data[section])) return;
  data[section]=data[section].filter(x=>x.id!==id);
  adminEditableSave(data);
}
function adminEditableAdd(section,item){
  const data=adminEditableLoad();
  if(!Array.isArray(data[section])) data[section]=[];
  data[section].push({
    id:'item_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7),
    ...item
  });
  adminEditableSave(data);
}

function adminEditableEsc(v){
  return String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderAdminEditable(){
  const host=document.getElementById('adminEditableManager');
  if(!host) return;
  const data=adminEditableLoad();

  const sections=[
    ['home','Home & Announcements'],
    ['services','County Services'],
    ['leaders','Leaders'],
    ['emergencies','Emergency Contacts'],
    ['hospitals','Hospitals & Health Services'],
    ['opportunities','Jobs & Opportunities'],
    ['businesses','Businesses & Marketplace'],
    ['agriculture','Agriculture'],
    ['transport','Transport'],
    ['events','Events & Community'],
    ['property','Property'],
    ['community','Community Information']
  ];

  host.innerHTML=`
    <div class="admin-editor">
      <div class="admin-editor-head">
        <div>
          <h2>Manage Everything</h2>
          <p class="muted">All administrators can edit the content shown in the application.</p>
        </div>
        <button class="btn btn-ghost" onclick="adminEditableReset()">Reset editable content</button>
      </div>

      <div class="admin-editor-tabs">
        <button class="admin-editor-tab active" data-editor-tab="site">Site Settings</button>
        ${sections.map(([id,label])=>`<button class="admin-editor-tab" data-editor-tab="${id}">${label}</button>`).join('')}
      </div>

      <div id="adminEditorPanels"></div>
    </div>`;

  document.querySelectorAll('[data-editor-tab]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-editor-tab]').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      renderAdminEditorPanel(btn.dataset.editorTab);
    });
  });
  renderAdminEditorPanel('site');
}

function renderAdminEditorPanel(section){
  const host=document.getElementById('adminEditorPanels');
  if(!host) return;
  const data=adminEditableLoad();

  if(section==='site'){
    host.innerHTML=`
      <form class="admin-editor-form" id="adminSiteForm">
        <h3>Site Settings</h3>
        <div class="admin-editor-grid">
          ${adminField('County name','aeCountyName',data.site.countyName)}
          ${adminField('App name','aeAppName',data.site.appName)}
          ${adminField('Tagline','aeTagline',data.site.tagline)}
          ${adminField('Support email','aeSupportEmail',data.site.supportEmail,'email')}
          ${adminField('Support phone','aeSupportPhone',data.site.supportPhone)}
          <label class="admin-wide">Public notice<textarea id="aeNotice">${adminEditableEsc(data.site.notice)}</textarea></label>
        </div>
        <button class="btn btn-primary">Save Site Settings</button>
      </form>`;
    document.getElementById('adminSiteForm').addEventListener('submit',e=>{
      e.preventDefault();
      data.site={
        countyName:document.getElementById('aeCountyName').value.trim(),
        appName:document.getElementById('aeAppName').value.trim(),
        tagline:document.getElementById('aeTagline').value.trim(),
        supportEmail:document.getElementById('aeSupportEmail').value.trim(),
        supportPhone:document.getElementById('aeSupportPhone').value.trim(),
        notice:document.getElementById('aeNotice').value.trim()
      };
      adminEditableSave(data);
      showToast('Site settings saved.');
    });
    return;
  }

  if(section==='home'){
    host.innerHTML=`
      <form class="admin-editor-form" id="adminHomeForm">
        <h3>Home Page</h3>
        <div class="admin-editor-grid">
          ${adminField('Welcome title','aeHomeTitle',data.home.welcomeTitle)}
          <label class="admin-wide">Welcome text<textarea id="aeHomeText">${adminEditableEsc(data.home.welcomeText)}</textarea></label>
        </div>
        <button class="btn btn-primary">Save Home Page</button>
      </form>
      ${adminListEditor('home','Announcements',data.home.announcements)}`;
    document.getElementById('adminHomeForm').addEventListener('submit',e=>{
      e.preventDefault();
      data.home.welcomeTitle=document.getElementById('aeHomeTitle').value.trim();
      data.home.welcomeText=document.getElementById('aeHomeText').value.trim();
      adminEditableSave(data);
      showToast('Home page saved.');
    });
    bindAdminListEditor('home','announcements');
    return;
  }

  host.innerHTML=adminListEditor(section,sectionsLabel(section),data[section]||[]);
  bindAdminListEditor(section,section);
}

function sectionsLabel(s){
  return ({
    services:'County Services',leaders:'Leaders',emergencies:'Emergency Contacts',
    hospitals:'Hospitals & Health Services',opportunities:'Jobs & Opportunities',
    businesses:'Businesses & Marketplace',agriculture:'Agriculture',
    transport:'Transport',events:'Events & Community',property:'Property',
    community:'Community Information'
  })[s] || s;
}
function adminField(label,id,value,type='text'){
  return `<label>${adminEditableEsc(label)}<input id="${id}" type="${type}" value="${adminEditableEsc(value)}"></label>`;
}
function adminListEditor(section,title,items){
  return `
    <div class="admin-editor-list">
      <div class="admin-list-head"><h3>${adminEditableEsc(title)}</h3></div>
      <div class="admin-list-items">
        ${(items||[]).map(item=>`
          <div class="admin-edit-card" data-edit-id="${adminEditableEsc(item.id)}">
            <div class="admin-edit-card-fields">
              ${adminField('Title','editTitle',item.title||item.name||'')}
              ${adminField('Category','editCategory',item.category||item.role||item.type||'')}
              ${adminField('Location','editLocation',item.location||item.loc||'')}
              <label class="admin-wide">Description<textarea id="editBody">${adminEditableEsc(item.body||item.description||item.desc||'')}</textarea></label>
              ${adminField('Phone','editPhone',item.phone||item.number||'')}
              ${adminField('Email','editEmail',item.email||item.contact||'','email')}
            </div>
            <div class="admin-edit-actions">
              <button type="button" class="btn btn-primary btn-sm" onclick="adminEditableUpdate('${adminEditableEsc(section)}','${adminEditableEsc(item.id)}',this)">Save</button>
              <button type="button" class="btn btn-ghost btn-sm" onclick="adminEditableDelete('${adminEditableEsc(section)}','${adminEditableEsc(item.id)}');renderAdminEditorPanel('${adminEditableEsc(section)}')">Delete</button>
            </div>
          </div>`).join('')}
      </div>
      <form class="admin-add-form" id="adminAdd-${adminEditableEsc(section)}">
        <h4>Add New</h4>
        <div class="admin-editor-grid">
          ${adminField('Title','newTitle','')}
          ${adminField('Category','newCategory','')}
          ${adminField('Location','newLocation','')}
          <label class="admin-wide">Description<textarea id="newBody"></textarea></label>
          ${adminField('Phone','newPhone','')}
          ${adminField('Email','newEmail','','email')}
        </div>
        <button class="btn btn-primary">Add Item</button>
      </form>
    </div>`;
}
function bindAdminListEditor(section){
  const form=document.getElementById('adminAdd-'+section);
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    adminEditableAdd(section,{
      title:form.querySelector('#newTitle').value.trim(),
      category:form.querySelector('#newCategory').value.trim(),
      location:form.querySelector('#newLocation').value.trim(),
      body:form.querySelector('#newBody').value.trim(),
      phone:form.querySelector('#newPhone').value.trim(),
      email:form.querySelector('#newEmail').value.trim()
    });
    renderAdminEditorPanel(section);
    showToast('Item added.');
  });
}
function adminEditableUpdate(section,id,button){
  const card=button.closest('.admin-edit-card');
  const data=adminEditableLoad();
  const arr=section==='home'?data.home.announcements:data[section];
  const item=(arr||[]).find(x=>x.id===id);
  if(!item) return;
  item.title=card.querySelector('#editTitle').value.trim();
  item.category=card.querySelector('#editCategory').value.trim();
  item.location=card.querySelector('#editLocation').value.trim();
  item.body=card.querySelector('#editBody').value.trim();
  item.phone=card.querySelector('#editPhone').value.trim();
  item.email=card.querySelector('#editEmail').value.trim();
  adminEditableSave(data);
  showToast('Changes saved.');
}
function adminEditableReset(){
  if(!confirm('Reset all editable content on this device? This cannot be undone.')) return;
  localStorage.removeItem(ADMIN_EDIT_KEY);
  renderAdminEditable();
  showToast('Editable content reset.');
}
function renderAdminEditablePreview(){
  // Public pages can read adminEditableLoad() and refresh their own sections.
  window.dispatchEvent(new CustomEvent('tnc-admin-content-updated'));
}
window.addEventListener('storage',e=>{
  if(e.key===ADMIN_EDIT_KEY){
    if(document.getElementById('adminEditableManager')) renderAdminEditable();
    renderAdminEditablePreview();
  }
});
document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('adminEditableManager')) renderAdminEditable();
});
