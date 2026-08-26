/* =============================================================
   TNC SHARED SYNC LAYER
   -------------------------------------------------------------
   Single source of truth for content created in any admin portal
   (county-admin.html, hospital-admin.html, security-admin.html).
   Both the admin portals AND the public app (index.html) load this
   file, so anything an admin publishes appears on the public site
   immediately — no separate "publish" step needed.

   Storage: localStorage key 'tnc_live_content_v1'.
   This keeps every browser tab/window on the SAME device in sync
   in real time (via the native 'storage' event) and keeps the same
   tab in sync the moment a save happens. All data stays in this browser and syncs between tabs on this device.
   ============================================================= */
(function (global) {
  'use strict';

  const KEY = 'tnc_live_content_v1';
  const UPDATED_EVENT = 'tnc-content-updated';

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    localStorage.setItem('tnc_content_last_updated', String(Date.now()));
    notify();
  }

  function published() {
    return load().filter((x) => x.public && ['Published', 'Active', 'Normal'].includes(x.data?.status));
  }

  function notify() {
    renderPublic();
    document.dispatchEvent(new CustomEvent(UPDATED_EVENT));
  }

  const ICONS = {
    alert: '🚨', appointment: '📅', staff: '🧑‍⚕️', update: '🏥', capacity: '🏥',
    queue: '🏥', opportunity: '💼', service: '🏛️', 'hospital service': '🏥', agriculture: '🌾',
    transport: '🚌', notice: '📢', announcement: '📢', 'situation update': '📢'
  };
  const iconFor = (type) => ICONS[type] || '📢';

  function title(x) { return x.data?.title || x.data?.name || x.data?.service || x.type; }
  function detail(x) { return x.data?.description || x.data?.body || x.data?.location || x.data?.hospital || ''; }
  function place(x) { return x.data?.location || x.data?.hospital || x.data?.department || x.data?.category || 'Tharaka-Nithi'; }

  function card(x, extra) {
    return `<article class="tnc-public-card"><div class="tnc-public-icon">${iconFor(x.type)}</div><div><h3>${esc(title(x))}</h3><p>${esc(detail(x))}</p><small>${esc(place(x))}</small>${extra || ''}</div></article>`;
  }

  // Renders every published admin record into the matching section of the
  // public app. Each block only overwrites its list when there is at least
  // one live record, so the nothing is shown until content is published.
  function renderPublic() {
    const items = published();
    const by = (t) => items.filter((x) => x.type === t);
    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

    if (typeof announcementItem === 'function') {
      const anns = [...by('announcement'), ...by('notice'), ...by('situation update')];
      if (anns.length) {
        set('homeAnnouncements', anns.slice(0, 8).map((x) => announcementItem({
          title: title(x), desc: detail(x), location: place(x)
        })).join(''));
      }
    }

    const opp = by('opportunity');
    if (opp.length) {
      set('jobsList', opp.map((x) => card(x)).join(''));
      set('latestOpportunities', opp.slice(0, 4).map((x) => card(x)).join(''));
    }
    const svc = by('service');
    if (svc.length) set('countyList', svc.map((x) => card(x)).join(''));

    const health = [...by('update'), ...by('capacity'), ...by('queue'), ...by('appointment'), ...by('staff'), ...by('hospital service')];
    if (health.length) {
      set('healthList', health.map((x) => card(x, x.type === 'appointment'
        ? `<strong>${esc(x.data?.date || '')} · ${esc(x.data?.time || '')} · ${esc(x.data?.slots || 0)} slots</strong>`
        : x.type === 'queue'
          ? `<strong>${esc(x.data?.waiting || 0)} waiting · ${esc(x.data?.wait || 0)} min average</strong>`
          : '')).join(''));
    }

    const alerts = by('alert');
    if (alerts.length) set('emergencyList', alerts.map((x) => card(x)).join(''));

    const ag = by('agriculture');
    if (ag.length) set('agriList', ag.map((x) => card(x)).join(''));

    const tr = by('transport');
    if (tr.length) set('transportList', tr.map((x) => card(x)).join(''));

    const liveHost = document.getElementById('tncLivePublicUpdates');
    if (liveHost) {
      liveHost.innerHTML = items.length
        ? items.slice(0, 16).map((x) => card(x)).join('')
        : '<p class="muted">No new published updates yet.</p>';
    }
  }

  // Lightweight search used by the TN AI chatbot so newly published admin
  // content shows up in chat answers without a separate knowledge step.
  function search(query, limit) {
    const q = String(query || '').toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    if (!words.length) return [];
    return published().filter((x) => {
      const haystack = [title(x), detail(x), place(x), x.type].join(' ').toLowerCase();
      return words.some((w) => haystack.includes(w));
    }).slice(0, limit || 5);
  }

  global.TNC_SYNC = { KEY, UPDATED_EVENT, esc, load, save, published, renderPublic, search, title, detail, place, iconFor };

  window.addEventListener('storage', (e) => { if (e.key === KEY) notify(); });
  document.addEventListener('DOMContentLoaded', renderPublic);
})(window);
