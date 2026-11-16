// BabyTogether – tiện ích dùng chung (giao diện mới)
(function () {
  'use strict';
  const P = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    baby: '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    bottle: '<path d="M8 2h8"/><path d="M9 2v2.8a4 4 0 0 1-1 2.6l-.4.5A4 4 0 0 0 7 10.6V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.4a4 4 0 0 0-.6-2.7l-.4-.5a4 4 0 0 1-1-2.6V2"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/>',
    syringe: '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    foot: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    thermo: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    star: '<path d="M11.5 2.3a.5.5 0 0 1 .9 0l2.3 4.7a2 2 0 0 0 1.5 1.1l5.2.8a.5.5 0 0 1 .3.9l-3.8 3.7a2 2 0 0 0-.6 1.8l.9 5.2a.5.5 0 0 1-.8.6l-4.6-2.5a2 2 0 0 0-1.9 0l-4.6 2.5a.5.5 0 0 1-.8-.6l.9-5.2a2 2 0 0 0-.6-1.8L2.5 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2 2 0 0 0 1.5-1.1z"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    link: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/>',
    thumb: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    chevd: '<path d="m6 9 6 6 6-6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 3 2h3Zm0 0v7"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    stetho: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    pen: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
    list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    ol: '<path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
    quote: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
    alignl: '<path d="M21 6H3"/><path d="M15 12H3"/><path d="M17 18H3"/>',
    alignc: '<path d="M21 6H3"/><path d="M17 12H7"/><path d="M19 18H5"/>',
    minus: '<path d="M5 12h14"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11"/>',
    redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5 5.5 5.5 0 0 0 9.5 20H13"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
    cloud: '<path d="m17 15-5.5 5.5L9 18"/><path d="M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    dup: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    game: '<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
    quiz: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  };
  function icon(name, size = 20, stroke = 2, cls = '') {
    return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.baby}</svg>`;
  }

  const CATEGORIES = { 'baby-care': 'Chăm sóc trẻ sơ sinh', 'maternal-care': 'Chăm sóc mẹ sau sinh', nutrition: 'Dinh dưỡng & sữa mẹ', vaccination: 'Tiêm chủng & Sức khỏe' };
  const CAT_SHORT = { 'baby-care': 'Chăm sóc sơ sinh', 'maternal-care': 'Chăm sóc mẹ', nutrition: 'Dinh dưỡng', vaccination: 'Tiêm chủng' };
  const CAT_ICON = { 'baby-care': 'baby', 'maternal-care': 'heart', nutrition: 'bottle', vaccination: 'syringe' };
  const AGES = { pregnancy: 'Mang thai', '0-6': '0–6 tháng', '6-12': '6–12 tháng', '12-24': '12–24 tháng', all: 'Mọi độ tuổi' };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function api(path, opts = {}) {
    const init = { method: opts.method || 'GET', headers: {}, credentials: 'same-origin' };
    if (opts.body !== undefined) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(opts.body); }
    let res;
    try { res = await fetch(path, init); } catch (e) { throw new Error('Không kết nối được máy chủ. Vui lòng kiểm tra mạng.'); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { const err = new Error(data.error || 'Đã có lỗi xảy ra.'); err.status = res.status; throw err; }
    return data;
  }
  let mePromise = null;
  const getMe = (force) => { if (!mePromise || force) mePromise = api('/api/me').catch(() => ({ user: null })); return mePromise; };

  function fmtDate(s, withTime) {
    if (!s) return '';
    const iso = String(s).replace(' ', 'T');
    const d = new Date(iso.length > 10 && !/[zZ+]/.test(iso.slice(10)) ? iso + 'Z' : iso);
    if (isNaN(d)) return s;
    const o = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' };
    if (withTime) Object.assign(o, { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleString('vi-VN', o);
  }
  const todayStr = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const readMins = (a) => Math.max(2, Math.round(((a.summary || '').length + (a.content || '').replace(/<[^>]+>/g, '').length) / 900) || 3);

  // Ghi nhớ bài đã đọc khi chưa đăng nhập
  const LR = 'bt_read_ids';
  const localRead = { get() { try { return JSON.parse(localStorage.getItem(LR) || '[]'); } catch { return []; } },
    add(id) { const s = new Set(this.get()); s.add(id); try { localStorage.setItem(LR, JSON.stringify([...s])); } catch { /* */ } },
    clear() { try { localStorage.removeItem(LR); } catch { /* */ } } };

  function cover(image, iconName, cls = '', size = 48) {
    return `<div class="cover ${cls}">${image ? `<img src="${esc(image)}" alt="" loading="lazy">` : icon(iconName || 'baby', size, 1.5)}</div>`;
  }
  function stepLabel(step) { return step ? `Bước ${step.position} · ${esc(step.path_title)}` : ''; }
  function articleCard(a, opts = {}) {
    const read = a.is_read || localRead.get().includes(a.id);
    return `<article class="a-card">
      ${cover(a.cover_image, CAT_ICON[a.category])}
      ${opts.bookmark !== false ? `<button type="button" class="bm ${a.bookmarked ? 'on' : ''}" data-bm="${a.id}" aria-label="${a.bookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}">${icon('bookmark', 18)}</button>` : ''}
      ${read ? `<span class="tag ok read-badge">${icon('check', 12, 3)} Đã đọc</span>` : ''}
      <div class="body">
        ${a.step ? `<span class="step">${icon('route', 14)} ${stepLabel(a.step)}</span>` : ''}
        <div class="chips"><span class="tag">${esc(CAT_SHORT[a.category] || '')}</span><span class="tag neutral">${esc(AGES[a.age_group] || '')}</span></div>
        <h3 class="clamp-2"><a href="/bai-viet/${encodeURIComponent(a.slug)}">${esc(a.title)}</a></h3>
        ${a.summary ? `<p class="clamp-2">${esc(a.summary)}</p>` : ''}
        <div class="meta">${icon('shield', 16)} ${esc(a.source_name || 'BabyTogether')}</div>
      </div></article>`;
  }

  function toast(msg, isError) {
    let t = document.getElementById('bt-toast');
    if (!t) { t = document.createElement('div'); t.id = 'bt-toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.toggle('error', !!isError); t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200);
  }
  function modal({ title, html, submitText = 'Lưu', onSubmit, cancelText = 'Hủy', danger }) {
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `<form class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" novalidate>
      <h2>${esc(title)}</h2>${html}<div class="msg error" hidden></div>
      <div class="actions"><button type="button" class="btn btn-ghost" data-close>${esc(cancelText)}</button>
      ${onSubmit ? `<button type="submit" class="btn ${danger ? 'btn-danger' : ''}">${esc(submitText)}</button>` : ''}</div></form>`;
    document.body.appendChild(wrap);
    const form = wrap.querySelector('form');
    const close = () => { wrap.remove(); document.removeEventListener('keydown', onKey); };
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('mousedown', (e) => { if (e.target === wrap) close(); });
    form.querySelector('[data-close]').addEventListener('click', close);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const btn = form.querySelector('[type=submit]'); const err = form.querySelector('.msg.error');
      btn.disabled = true; err.hidden = true;
      try { const r = await onSubmit(form); if (r !== false) close(); } catch (ex) { err.textContent = ex.message; err.hidden = false; } finally { btn.disabled = false; }
    });
    const first = form.querySelector('input,select,textarea'); if (first) first.focus();
    return form;
  }
  function compressImage(file, maxSize = 1280, quality = 0.78) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      if (!/^image\//.test(file.type)) return reject(new Error('Vui lòng chọn file ảnh.'));
      if (file.size > 20 * 1024 * 1024) return reject(new Error('Ảnh quá lớn (tối đa 20MB).'));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Không đọc được ảnh.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Không đọc được ảnh.'));
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
          const c = document.createElement('canvas'); c.width = w; c.height = h;
          const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function loginHint(text) {
    const next = encodeURIComponent(location.pathname + location.search);
    return `<div class="hint-box"><span>${esc(text || 'Đăng nhập để lưu tiến độ và cùng cả nhà tham gia.')}</span><a class="btn" href="/tai-khoan?next=${next}">Đăng nhập ${icon('arrow', 18)}</a></div>`;
  }

  const NAV = [['home', 'Trang chủ', '/', 'home'], ['kien-thuc', 'Kiến thức', '/kien-thuc', 'book'], ['hanh-trinh', 'Hành trình', '/hanh-trinh', 'route'], ['choi-hoc', 'Chơi & Học', '/choi-hoc', 'star'], ['gia-dinh', 'Gia đình', '/gia-dinh', 'users']];
  const logoHtml = (cls = '') => `<a href="/" class="logo ${cls}"><span class="mark">${icon('baby', 24)}</span><span>Baby<b>Together</b></span></a>`;

  function renderChrome() {
    document.querySelectorAll('[data-ic]').forEach((el) => el.insertAdjacentHTML('afterbegin', icon(el.dataset.ic, Number(el.dataset.size) || 18)));
    const page = document.body.dataset.page || '';
    const header = document.querySelector('header.site-header');
    if (header) {
      header.innerHTML = `<div class="bar">${logoHtml()}
        <nav class="main-nav" aria-label="Điều hướng chính">${NAV.map(([k, l, h]) => `<a href="${h}" class="${page === k ? 'active' : ''}">${l}</a>`).join('')}</nav>
        <div class="header-actions">
          <button class="icon-btn" id="hdr-search" aria-label="Tìm kiếm">${icon('search', 20)}</button>
          <button class="icon-btn hide-m notif-btn" id="hdr-bell" aria-label="Thông báo" aria-haspopup="true">${icon('bell', 20)}<i class="dot" hidden></i></button>
          <a href="/tai-khoan" class="avatar" id="hdr-avatar" aria-label="Tài khoản">${icon('user', 20)}</a>
        </div></div>`;
      header.querySelector('#hdr-search').addEventListener('click', () => {
        let pop = header.querySelector('.search-pop');
        if (pop) { pop.remove(); return; }
        pop = document.createElement('form'); pop.className = 'search-pop'; pop.setAttribute('role', 'search');
        pop.innerHTML = `<div class="search-bar" style="box-shadow:none;border:0">${icon('search', 20)}<input name="q" placeholder="Ba mẹ đang thắc mắc điều gì?" aria-label="Tìm kiếm"><button class="btn btn-sm">Tìm</button></div>`;
        header.appendChild(pop); attachSuggest(pop, true);
        if (location.pathname === '/kien-thuc') pop.q.value = new URLSearchParams(location.search).get('q') || '';
        pop.q.focus();
        pop.addEventListener('submit', (e) => { e.preventDefault(); const v = pop.q.value.trim(); if (!v) { pop.q.focus(); return; } location.href = '/kien-thuc?q=' + encodeURIComponent(v); });
        pop.addEventListener('keydown', (e) => { if (e.key === 'Escape') pop.remove(); });
      });
      header.querySelector('#hdr-bell').addEventListener('click', (e) => { e.stopPropagation(); toggleNotif(header); });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.notif-pop') && !e.target.closest('#hdr-bell')) header.querySelectorAll('.notif-pop').forEach((p) => p.remove());
        if (!e.target.closest('.search-pop') && !e.target.closest('#hdr-search')) header.querySelectorAll('.search-pop').forEach((p) => p.remove());
      });
      getMe().then((me) => {
        const a = document.getElementById('hdr-avatar');
        if (me.user) {
          a.textContent = (me.user.name || '?').trim().charAt(0).toUpperCase(); a.title = me.user.name;
          if (me.user.role === 'admin') {
            const nav = header.querySelector('.main-nav');
            nav.insertAdjacentHTML('beforeend', '<a href="/admin">Quản trị</a>');
          }
          // đồng bộ bài đã đọc khi chưa đăng nhập
          const ids = localRead.get();
          if (ids.length) api('/api/reading/sync', { method: 'POST', body: { ids } }).then(() => localRead.clear()).catch(() => {});
          showReminders(me, header);
          loadNotifs(me).then((n) => { const d = header.querySelector('#hdr-bell .dot'); if (n.urgent) { d.hidden = false; d.textContent = n.urgent > 9 ? '9+' : n.urgent; } }).catch(() => {});
        } else a.title = 'Đăng nhập';
      });
      const tb = document.createElement('nav'); tb.className = 'tabbar'; tb.setAttribute('aria-label', 'Điều hướng');
      tb.innerHTML = NAV.map(([k, l, h, ic]) => `<a href="${h}" class="${page === k ? 'active' : ''}"><span class="i">${icon(ic, 22)}</span>${l}</a>`).join('');
      document.body.appendChild(tb);
    }
    const footer = document.querySelector('footer.site-footer');
    if (footer) {
      footer.innerHTML = `<div class="in"><div class="footer-top">
        <div>${logoHtml()}<p>Cẩm nang chăm sóc trẻ sơ sinh cho ba mẹ Việt – kiến thức từ WHO, UNICEF và Bộ Y tế, trình bày dễ hiểu.</p></div>
        <div><h4>Kiến thức</h4>${Object.entries(CAT_SHORT).map(([k, v]) => `<a href="/kien-thuc?category=${k}">${v}</a>`).join('')}</div>
        <div><h4>Đồng hành</h4><a href="/hanh-trinh">Hành trình theo tuổi</a><a href="/choi-hoc">Thử thách kiến thức</a><a href="/nhiem-vu">Nhiệm vụ gia đình</a><a href="/gia-dinh">Nhật ký gia đình</a></div>
        <div><h4>BabyTogether</h4><a href="/kien-thuc">Lộ trình đọc</a><a href="/tai-khoan">Tài khoản</a><a href="/admin/login">Dành cho quản trị viên</a></div>
        </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} BabyTogether · Thông tin chỉ mang tính tham khảo, không thay thế tư vấn y tế.</span><span>Làm với ♥ cho ba mẹ</span></div></div>`;
      footer.querySelector('.logo').classList.add('on-dark');
    }
  }

  // ---------- Thông báo (chuông) ----------
  let notifCache = null;
  async function loadNotifs(me) {
    if (notifCache) return notifCache;
    const out = { items: [], urgent: 0, state: !me.user ? 'guest' : !me.family ? 'nofam' : 'ok' };
    if (out.state !== 'ok') return (notifCache = out);
    const s = me.user.settings || {};
    const t = todayStr(); const end = new Date(Date.now() + (7 + 7 * 24) * 3600e3).toISOString().slice(0, 10);
    const dd = (d) => Math.round((new Date(d + 'T00:00:00Z') - new Date(t + 'T00:00:00Z')) / 864e5);
    const when = (n) => n === 0 ? 'Hôm nay' : n === 1 ? 'Ngày mai' : n === 2 ? 'Ngày mốt' : `Còn ${n} ngày`;
    const [ev, ms] = await Promise.all([api(`/api/events?from=${t}&to=${end}`).catch(() => ({ items: [] })), api('/api/missions').catch(() => null)]);
    ev.items.forEach((e) => {
      const n = dd(e.date); const health = e.type === 'vaccine' || e.type === 'checkup';
      if (health && s.vaccine === false) return;
      if (!health && n > 1) return; // lịch khác: chỉ báo hôm nay & ngày mai
      if (health && n <= 3) out.urgent++;
      out.items.push({ n, icon: e.type === 'vaccine' ? 'syringe' : e.type === 'checkup' ? 'stetho' : 'calendar', kind: e.type === 'vaccine' ? 'Lịch tiêm chủng' : e.type === 'checkup' ? 'Lịch khám sức khỏe' : 'Lịch gia đình',
        title: e.title, sub: `${when(n)} · ${fmtDate(e.date)}${e.time ? ' lúc ' + e.time : ''}`, href: health ? '/hanh-trinh#nhac-lich' : '/gia-dinh', hot: health && n <= 3 });
    });
    if (ms && ms.daily_id && s.mission !== false) {
      const m = ms.items.find((x) => x.id === ms.daily_id);
      if (m) { const done = m.done_by.length > 0; if (!done) out.urgent++;
        out.items.unshift({ n: -1, icon: done ? 'check' : 'target', kind: 'Nhiệm vụ hôm nay', title: m.title, sub: done ? 'Đã hoàn thành – ' + m.done_by.join(', ') : `Chưa hoàn thành – +${m.points} điểm`, href: '/nhiem-vu', hot: !done, done }); }
    }
    return (notifCache = out);
  }
  async function toggleNotif(header) {
    const old = header.querySelector('.notif-pop'); if (old) { old.remove(); return; }
    const pop = document.createElement('div'); pop.className = 'notif-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Thông báo');
    pop.innerHTML = '<div class="loading">Đang tải…</div>'; header.appendChild(pop);
    const me = await getMe(); const n = await loadNotifs(me);
    const head = `<div class="np-head"><b>Thông báo</b>${n.items.length ? `<span class="small muted">${n.items.length} mục</span>` : ''}</div>`;
    if (n.state === 'guest') pop.innerHTML = head + `<div class="np-empty"><span class="ib lg">${icon('bell', 24)}</span><p>Đăng nhập để nhận nhắc lịch tiêm chủng, lịch khám và nhiệm vụ hằng ngày.</p><a class="btn btn-sm" href="/tai-khoan">Đăng nhập</a></div>`;
    else if (n.state === 'nofam') pop.innerHTML = head + `<div class="np-empty"><span class="ib lg">${icon('users', 24)}</span><p>Tạo hoặc tham gia gia đình để bố mẹ cùng nhận nhắc lịch.</p><a class="btn btn-sm" href="/tai-khoan">Thiết lập gia đình</a></div>`;
    else pop.innerHTML = head + (n.items.length ? `<div class="np-list">${n.items.map((x) => `<a class="np-item ${x.hot ? 'hot' : ''}" href="${x.href}"><span class="ib ${x.done ? 'accent' : ''}">${icon(x.icon, 18)}</span><span class="t"><span class="k">${esc(x.kind)}</span><b>${esc(x.title)}</b><span class="s">${esc(x.sub)}</span></span></a>`).join('')}</div>`
      : `<div class="np-empty"><span class="ib lg">${icon('check', 24)}</span><p>Không có lịch nào trong 7 ngày tới.</p></div>`)
      + `<div class="np-foot"><a href="/hanh-trinh#nhac-lich">${icon('plus', 16)} Thêm nhắc lịch</a><a href="/gia-dinh">Xem lịch gia đình ${icon('arrow', 16)}</a></div>`;
  }

  async function showReminders(me, header) {
    if (!me.family) return;
    const s = me.user.settings || {};
    const key = 'bt_rem_' + todayStr();
    try { if (sessionStorage.getItem(key)) return; } catch (_) { /* */ }
    const parts = [];
    if (s.vaccine !== false) {
      const end = new Date(Date.now() + (7 + 72) * 3600e3).toISOString().slice(0, 10);
      try {
        const r = await api(`/api/events?from=${todayStr()}&to=${end}`);
        r.items.filter((e) => e.type === 'vaccine' || e.type === 'checkup').slice(0, 2).forEach((e) => {
          parts.push(`<b>${esc(e.title)}</b> – ${e.date === todayStr() ? 'hôm nay' : fmtDate(e.date)}`);
        });
      } catch (_) { /* */ }
    }
    if (s.mission && document.body.dataset.page === 'home') parts.push('Đừng quên <a href="/nhiem-vu">nhiệm vụ hôm nay</a> nhé!');
    if (!parts.length) return;
    const bar = document.createElement('div'); bar.className = 'reminder-bar';
    bar.innerHTML = `<div class="in"><span>${icon('bell', 16)} Nhắc lịch: ${parts.join(' · ')}</span><button type="button" aria-label="Đóng">×</button></div>`;
    bar.querySelector('button').onclick = () => { bar.remove(); try { sessionStorage.setItem(key, '1'); } catch (_) { /* */ } };
    header.after(bar);
  }

  // Lưu/bỏ lưu bài viết (dùng chung cho mọi trang có thẻ bài viết)
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-bm]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const me = await getMe();
    if (!me.user) { toast('Vui lòng đăng nhập để lưu bài viết.'); return; }
    try {
      const r = await api(`/api/articles/${b.dataset.bm}/bookmark`, { method: 'POST' });
      b.classList.toggle('on', r.bookmarked); toast(r.bookmarked ? 'Đã lưu bài viết' : 'Đã bỏ lưu');
    } catch (ex) { toast(ex.message, true); }
  });


  // ----- Nhiệm vụ (dùng chung trang Chơi & Học và Nhiệm vụ) -----
  const MISSION_ICON = { reading: 'book', maternal: 'heart', meal: 'utensils', play: 'music', health: 'syringe' };
  function missionCard(m, me) {
    const mine = me && me.user && m.done_by.includes(me.user.name);
    return `<div class="mission-card">
      <div class="top"><span class="ib">${icon(MISSION_ICON[m.tag] || 'star', 24)}</span><span class="tag">+${m.points} điểm</span></div>
      <h3 class="clamp-2">${esc(m.title)}</h3>
      <p class="desc clamp-2">${esc(m.description || m.goal || '')}</p>
      <span class="who">Người thực hiện: ${esc(m.participant)}</span>
      ${m.done_by.length && !mine ? `<span class="small" style="color:var(--ok)">✓ ${esc(m.done_by.join(', '))} đã làm hôm nay</span>` : ''}
      <div class="foot">${mine ? `<button class="btn btn-done btn-block" disabled>${icon('check', 16)} Đã hoàn thành</button>` : `<button class="btn btn-block" data-complete="${m.id}">${icon('camera', 16)} Hoàn thành + ảnh</button>`}</div></div>`;
  }
  async function completeMission(m, onDone) {
    const me = await getMe();
    if (!me.user) { modal({ title: 'Đăng nhập để tham gia', html: loginHint('Đăng nhập để đánh dấu hoàn thành nhiệm vụ và nhận điểm thưởng.'), cancelText: 'Đóng' }); return; }
    let photo = '';
    const form = modal({ title: m.title, submitText: 'Xác nhận hoàn thành',
      html: `${m.description ? `<p class="muted" style="margin:0">${esc(m.description)}</p>` : ''}
        <label class="field">Ghi chú (không bắt buộc)<textarea name="note" maxlength="500" placeholder="Hôm nay bé rất thích…"></textarea></label>
        <label class="field">Ảnh minh chứng (không bắt buộc)<input type="file" name="photo" accept="image/*"></label>
        <img id="pv" alt="Xem trước ảnh" hidden style="max-width:240px;border-radius:14px">
        ${me.family ? '<label class="check"><input type="checkbox" name="mem" checked> Lưu ảnh vào Kỷ niệm gia đình</label>' : ''}
        <div class="tag" style="align-self:flex-start">${icon('trophy', 14)} +${m.points} điểm</div>`,
      onSubmit: async (f) => {
        const r = await api(`/api/missions/${m.id}/complete`, { method: 'POST', body: { note: f.note.value, photo, save_memory: f.mem ? f.mem.checked : false } });
        toast(`Tuyệt vời! +${r.points} điểm`); if (onDone) onDone();
      } });
    form.photo.addEventListener('change', async () => {
      try { photo = await compressImage(form.photo.files[0]); const pv = form.querySelector('#pv'); pv.src = photo; pv.hidden = !photo; }
      catch (ex) { toast(ex.message, true); form.photo.value = ''; photo = ''; }
    });
  }

  // ---------- Gợi ý tìm kiếm khi đang gõ ----------
  const lowV = (x) => String(x || '').normalize('NFC').toLowerCase();
  const stripV = (x) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  function highlight(text, q) {
    const toks = lowV(q).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    if (!toks.length) return esc(text);
    let prevHit = false;
    const last = toks.length - 1, typing = !/\s$/.test(q);
    return String(text).split(/(\s+)/).map((w) => {
      if (/^\s+$/.test(w)) return w;
      const lw = lowV(w).replace(/[^\p{L}\p{N}]/gu, ''), sw = stripV(lw);
      let exactPrev = false;
      const hit = !!lw && toks.some((t, i) => { const word = stripV(t) === t ? sw : lw;
        if (word === t) { if (i < last) exactPrev = true; return true; }
        // từ cuối đang gõ dở: khớp tiền tố (≥2 chữ, hoặc 1 chữ nếu đứng ngay sau từ vừa khớp, VD "ăn d" → "ăn dặm")
        return i === last && typing && word.startsWith(t) && (t.length >= 2 || (prevHit && last > 0)); });
      prevHit = exactPrev;
      return hit ? `<mark>${esc(w)}</mark>` : esc(w);
    }).join('');
  }
  // form: <form> chứa input[name=q]; inline = true khi hiển thị ngay trong form (khung tìm kiếm trên menu)
  function attachSuggest(form, inline) {
    const input = form.querySelector('input[name=q]'); if (!input || form.dataset.suggest) return;
    form.dataset.suggest = '1'; input.setAttribute('autocomplete', 'off');
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
    const box = document.createElement('div'); box.className = 'suggest-box' + (inline ? ' inline' : ''); box.setAttribute('role', 'listbox'); box.hidden = true;
    if (!inline) form.style.position = 'relative';
    form.appendChild(box);
    let timer, seq = 0, active = -1;
    const close = () => { box.hidden = true; active = -1; input.setAttribute('aria-expanded', 'false'); };
    const items = () => [...box.querySelectorAll('a')];
    const setActive = (i) => { const it = items(); if (!it.length) return; active = (i + it.length) % it.length; it.forEach((a, k) => a.classList.toggle('on', k === active)); it[active].scrollIntoView({ block: 'nearest' }); };
    async function run() {
      const q = input.value; const my = ++seq;
      if (!q.trim()) { close(); return; }
      let r; try { r = await api('/api/search/suggest?q=' + encodeURIComponent(q)); } catch (_) { return; }
      if (my !== seq) return; // đã có lần gõ mới hơn
      const all = '/kien-thuc?q=' + encodeURIComponent(q.trim());
      box.innerHTML = (r.articles.length ? `<span class="sg-label">Bài viết</span>` + r.articles.map((a) => `<a href="/bai-viet/${encodeURIComponent(a.slug)}" role="option"><span class="ib sm">${icon(CAT_ICON[a.category] || 'book', 16)}</span><span class="t"><b>${highlight(a.title, q)}</b><span>${esc(CAT_SHORT[a.category] || '')}${a.step ? ' - ' + stepLabel(a.step) : ''}</span></span></a>`).join('') : '')
        + (r.paths.length ? `<span class="sg-label">Lộ trình đọc</span>` + r.paths.map((p) => `<a href="/bai-viet/${encodeURIComponent(p.first_slug)}" role="option"><span class="ib sm">${icon('route', 16)}</span><span class="t"><b>${highlight(p.title, q)}</b><span>${p.total} bài - bắt đầu từ bước 1</span></span></a>`).join('') : '')
        + (r.total ? `<a class="sg-all" href="${all}" role="option">${icon('search', 16)} Xem tất cả ${r.total} kết quả cho “${esc(q.trim())}” ${icon('arrow', 16)}</a>`
          : `<div class="sg-empty">Chưa có bài viết khớp “${esc(q.trim())}”. Thử gõ không dấu hoặc từ khóa ngắn hơn.</div>`);
      box.hidden = false; active = -1; input.setAttribute('aria-expanded', 'true');
    }
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 160); });
    input.addEventListener('focus', () => { if (input.value.trim() && box.innerHTML) { box.hidden = false; } });
    input.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); location.href = items()[active].href; }
      else if (e.key === 'Escape') { e.stopPropagation(); close(); }
    });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
  }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('form[data-suggest-auto]').forEach((f) => attachSuggest(f)));
  window.BT = { attachSuggest, highlight, api, getMe, esc, icon, fmtDate, todayStr, readMins, cover, articleCard, stepLabel, toast, modal, compressImage, loginHint, localRead, logoHtml, missionCard, completeMission, CATEGORIES, CAT_SHORT, CAT_ICON, AGES };
  document.addEventListener('DOMContentLoaded', renderChrome);
})();
