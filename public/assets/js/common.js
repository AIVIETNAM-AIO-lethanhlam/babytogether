// BabyTogether – tiện ích dùng chung cho mọi trang
(function () {
  'use strict';

  const ICONS = {
    arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bookmark: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    baby: '<svg class="ph-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="24" cy="22" r="12"/><circle cx="20" cy="21" r="1.2" fill="currentColor"/><circle cx="28" cy="21" r="1.2" fill="currentColor"/><path d="M20 27c2 2 6 2 8 0M24 10c0-3 3-4 4-2"/></svg>',
    heart: '<svg class="ph-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M24 38S8 28.5 8 18a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 10.5-16 20-16 20z"/></svg>',
    book: '<svg class="ph-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M8 10h12a4 4 0 0 1 4 4v24a3 3 0 0 0-3-3H8zM40 10H28a4 4 0 0 0-4 4v24a3 3 0 0 1 3-3h13z"/></svg>',
    star: '<svg class="ph-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M24 7l5 11 12 1-9 8 3 12-11-7-11 7 3-12-9-8 12-1z"/></svg>',
    family: '<svg class="ph-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="15" cy="14" r="5"/><circle cx="33" cy="14" r="5"/><circle cx="24" cy="27" r="3.5"/><path d="M6 40c1-8 5-12 9-12s5 2 6 4M42 40c-1-8-5-12-9-12s-5 2-6 4M18 41c1-4 3-6 6-6s5 2 6 6"/></svg>',
  };

  const CATEGORIES = {
    'baby-care': 'Chăm sóc trẻ sơ sinh',
    'maternal-care': 'Chăm sóc mẹ sau sinh',
    nutrition: 'Dinh dưỡng & nuôi con bằng sữa mẹ',
    vaccination: 'Tiêm chủng & Sức khỏe',
  };
  const AGES = { pregnancy: 'Mang thai', '0-6': '0–6 tháng', '6-12': '6–12 tháng', '12-24': '12–24 tháng', all: 'Mọi độ tuổi' };
  const CAT_ICON = { 'baby-care': 'baby', 'maternal-care': 'heart', nutrition: 'heart', vaccination: 'star' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

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
  function getMe(force) {
    if (!mePromise || force) mePromise = api('/api/me').catch(() => ({ user: null }));
    return mePromise;
  }

  function fmtDate(s, withTime) {
    if (!s) return '';
    const iso = String(s).replace(' ', 'T');
    const d = new Date(/T\d/.test(iso) && !/[zZ+]/.test(iso.slice(10)) && iso.length > 10 ? iso + 'Z' : iso);
    if (isNaN(d)) return s;
    const opts = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' };
    if (withTime) Object.assign(opts, { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleString('vi-VN', opts);
  }
  function todayStr() { return new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); }

  function ph(image, icon, label, cls) {
    if (image) return `<div class="ph ${cls || ''}"><img src="${esc(image)}" alt="${esc(label || '')}" loading="lazy"></div>`;
    return `<div class="ph ${cls || ''}">${ICONS[icon] || ICONS.baby}${label ? `<span class="ph-label">${esc(label)}</span>` : ''}</div>`;
  }

  function toast(msg, isError) {
    let t = document.getElementById('bt-toast');
    if (!t) { t = document.createElement('div'); t.id = 'bt-toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.toggle('error', !!isError); t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200);
  }

  // Modal đơn giản. content: HTML; trả về phần tử modal; onSubmit(form) trả về false để giữ modal.
  function modal({ title, html, submitText = 'Lưu', onSubmit, cancelText = 'Hủy' }) {
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `<form class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <h2>${esc(title)}</h2>${html}<div class="msg error" hidden></div>
      <div class="actions"><button type="button" class="btn-outline" data-close>${esc(cancelText)}</button>
      ${onSubmit ? `<button type="submit" class="btn">${esc(submitText)}</button>` : ''}</div></form>`;
    document.body.appendChild(wrap);
    const form = wrap.querySelector('form');
    const close = () => wrap.remove();
    wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.hasAttribute('data-close')) close(); });
    document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]'); const err = form.querySelector('.msg.error');
      btn.disabled = true; err.hidden = true;
      try { const r = await onSubmit(form); if (r !== false) close(); }
      catch (ex) { err.textContent = ex.message; err.hidden = false; }
      finally { btn.disabled = false; }
    });
    const first = form.querySelector('input,select,textarea'); if (first) first.focus();
    return form;
  }

  // Nén ảnh phía trình duyệt -> data URL JPEG (giảm dung lượng lưu trên Cloudflare)
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
          let { width: w, height: h } = img;
          const scale = Math.min(1, maxSize / Math.max(w, h));
          w = Math.round(w * scale); h = Math.round(h * scale);
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
    return `<div class="login-hint"><span class="body-text">${esc(text || 'Đăng nhập để lưu tiến độ và cùng cả nhà tham gia.')}</span>
      <a class="btn" href="/tai-khoan?next=${next}">Đăng nhập ${ICONS.arrow}</a></div>`;
  }

  const NAV = [
    ['kien-thuc', 'Kiến thức', '/kien-thuc'],
    ['hanh-trinh', 'Hành trình', '/hanh-trinh'],
    ['choi-hoc', 'Chơi & Học', '/choi-hoc'],
    ['gia-dinh', 'Gia đình', '/gia-dinh'],
  ];

  function renderChrome() {
    const page = document.body.dataset.page || '';
    const header = document.querySelector('header.site-header');
    if (header) {
      header.innerHTML = `<div class="bar">
        <a href="/" class="logo">BabyTogether</a>
        <nav class="main-nav" id="main-nav" aria-label="Điều hướng chính">
          ${NAV.map(([k, label, href]) => `<a href="${href}" class="${page === k ? 'active' : ''}">${label}</a>`).join('')}
        </nav>
        <div class="header-right">
          <a href="/tai-khoan" class="avatar-btn" id="avatar-btn" aria-label="Tài khoản cá nhân">${ICONS.user}</a>
          <button class="menu-toggle" aria-label="Mở menu" aria-controls="main-nav" aria-expanded="false">${ICONS.menu}</button>
        </div></div>`;
      const tg = header.querySelector('.menu-toggle'); const nav = header.querySelector('.main-nav');
      tg.addEventListener('click', () => { const o = nav.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
      getMe().then((me) => {
        const a = document.getElementById('avatar-btn');
        if (me.user) {
          a.textContent = (me.user.name || '?').trim().charAt(0).toUpperCase();
          a.title = me.user.name;
          if (me.user.role === 'admin' && !nav.querySelector('[data-admin]')) {
            nav.insertAdjacentHTML('beforeend', '<a href="/admin" data-admin>Quản trị</a>');
          }
        } else { a.title = 'Đăng nhập'; }
        showReminders(me, header);
      });
    }
    const footer = document.querySelector('footer.site-footer');
    if (footer) {
      footer.innerHTML = `<div class="bar">
        <div class="logo">BabyTogether</div>
        <em>Thông tin y khoa đáng tin cậy, đồng hành cùng ba mẹ</em>
        <div class="links">${NAV.map(([, l, h]) => `<a href="${h}">${l}</a>`).join('')}<a href="/tai-khoan">Tài khoản</a></div>
        <div class="note">Thông tin trên website chỉ mang tính tham khảo, không thay thế chẩn đoán và tư vấn của nhân viên y tế. © ${new Date().getFullYear()} BabyTogether.</div>
      </div>`;
    }
  }

  // Nhắc lịch sức khỏe & nhiệm vụ (theo cài đặt thông báo của người dùng)
  async function showReminders(me, header) {
    if (!me.user || !me.family) return;
    const s = me.user.settings || {};
    const key = 'bt_rem_' + todayStr();
    try { if (sessionStorage.getItem(key)) return; } catch (_) { /* */ }
    const parts = [];
    if (s.vaccine !== false) {
      const end = new Date(Date.now() + (7 + 72) * 3600e3).toISOString().slice(0, 10);
      try {
        const r = await api(`/api/events?from=${todayStr()}&to=${end}`);
        r.items.filter((e) => e.type === 'vaccine' || e.type === 'checkup').slice(0, 2).forEach((e) => {
          parts.push(`${e.type === 'vaccine' ? '💉' : '🩺'} <strong>${esc(e.title)}</strong> – ${e.date === todayStr() ? 'hôm nay' : fmtDate(e.date)}`);
        });
      } catch (_) { /* */ }
    }
    if (s.mission && document.body.dataset.page === 'home') parts.push('Đừng quên <a href="/nhiem-vu" style="color:#fff;border-bottom:1px solid">nhiệm vụ hôm nay</a> nhé!');
    if (!parts.length) return;
    const bar = document.createElement('div');
    bar.style.cssText = 'background:#0A5270;color:#fff;font-size:15px;';
    bar.innerHTML = `<div style="max-width:1280px;margin:0 auto;padding:10px 32px;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap">
      <span>Nhắc lịch: ${parts.join(' · ')}</span>
      <button type="button" aria-label="Đóng nhắc lịch" style="background:none;border:0;color:#fff;cursor:pointer;font-size:20px;line-height:1">×</button></div>`;
    bar.querySelector('button').onclick = () => { bar.remove(); try { sessionStorage.setItem(key, '1'); } catch (_) { /* */ } };
    header.after(bar);
  }

  window.BT = { api, getMe, esc, fmtDate, todayStr, ph, toast, modal, compressImage, loginHint, ICONS, CATEGORIES, AGES, CAT_ICON };
  document.addEventListener('DOMContentLoaded', renderChrome);
})();
