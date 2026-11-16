// Thư viện kiến thức: lộ trình đọc, tìm kiếm, lọc, sắp xếp "Đề xuất", lưu bài, tiến độ đọc
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, articleCard, cover, CATEGORIES, AGES, CAT_ICON, CAT_SHORT, localRead, toast } = BT;
  const $ = (id) => document.getElementById(id);
  const ps = new URLSearchParams(location.search);
  const me = await getMe();
  const child = (me.children || [])[0];
  let childStage = '';
  if (child) {
    if (child.birth_date) { const m = (Date.now() - new Date(child.birth_date)) / (30.44 * 864e5); childStage = m < 6 ? '0-6' : m < 12 ? '6-12' : '12-24'; }
    else childStage = 'pregnancy';
  }
  const state = { q: ps.get('q') || '', category: ps.get('category') || '', age: ps.get('age') || '', sources: (ps.get('source') || '').split(',').filter((x) => ['WHO', 'UNICEF', 'Bộ Y tế'].includes(x)), bookmarked: ps.get('saved') === '1', sort: ps.get('sort') || 'recommended', offset: 0 };
  const PAGE = 9;
  $('q').value = state.q; $('sort').value = state.sort;
  const stats = await api('/api/stats').catch(() => ({ categories: {}, articles: 0 }));

  function renderCats() {
    const total = Object.values(stats.categories).reduce((a, b) => a + b, 0);
    $('cats').innerHTML = `<button class="chip ${!state.category ? 'active' : ''}" data-cat="">Tất cả <span class="count">${total}</span></button>` +
      Object.entries(CATEGORIES).map(([k, v]) => `<button class="chip ${state.category === k ? 'active' : ''}" data-cat="${k}">${v} <span class="count">${stats.categories[k] || 0}</span></button>`).join('');
  }
  $('cats').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; state.category = b.dataset.cat; reload(); });

  // ----- Lộ trình -----
  async function renderPaths() {
    const age = state.age || childStage || '0-6';
    const [r1, all] = await Promise.all([api('/api/paths?age=' + age).catch(() => ({ items: [] })), api('/api/paths').catch(() => ({ items: [] }))]);
    const r = { items: [...r1.items, ...all.items.filter((p) => !r1.items.some((x) => x.id === p.id))] };
    const local = localRead.get();
    const items = r.items.slice(0, 3).map((p) => {
      const arts = p.articles.map((a) => ({ ...a, is_read: a.is_read || local.includes(a.id) }));
      return { ...p, articles: arts, done: arts.filter((a) => a.is_read).length };
    });
    if (!items.length) { $('paths-wrap').innerHTML = ''; return; }
    const activeIdx = items.findIndex((p) => p.done > 0 && p.done < p.total);
    $('paths-wrap').innerHTML = `<div class="section-head" style="margin-bottom:28px"><div class="t"><span class="label">Lộ trình đọc</span>
      <h2 class="h2">Lộ trình gợi ý ${AGES[age] && age !== 'all' ? 'cho ' + (age === 'pregnancy' ? 'mẹ bầu' : 'bé ' + AGES[age]) : ''}</h2>
      <p class="muted" style="margin:0">Đọc theo thứ tự để nắm kiến thức từ cơ bản đến nâng cao – an toàn trước, chăm sóc hằng ngày sau.</p></div></div>
      <div class="grid-3">${items.map((p, i) => {
        const on = i === activeIdx; const next = p.articles.find((a) => !a.is_read) || p.articles[0];
        const pct = Math.round(p.done / p.total * 100);
        return `<div class="path-card ${on ? 'active' : ''}">
          <div class="top"><span class="ib">${icon(p.icon || 'baby', 24)}</span><span class="tag ${on ? '' : ''}" style="${on ? 'background:var(--sky-500);color:#fff' : ''}">${on ? 'Đang đọc' : p.done === p.total ? 'Đã hoàn thành' : esc(AGES[p.age_group] || 'Lộ trình')}</span></div>
          <h3 class="h3">${esc(p.title)}</h3>
          <span class="small muted" style="display:flex;gap:6px;align-items:center">${icon('clock', 14)} ${p.total} bài · khoảng ${p.total * 3} phút</span>
          <div class="segs">${p.articles.map((a) => `<i class="${a.is_read ? 'on' : ''}"></i>`).join('')}</div>
          <div class="row"><span>Đã đọc ${p.done}/${p.total} bài</span><span>${pct}%</span></div>
          <a class="next" href="/bai-viet/${encodeURIComponent(next.slug)}"><div><span class="label">${p.done ? (p.done === p.total ? 'ĐỌC LẠI · BƯỚC 1' : 'TIẾP THEO · BƯỚC ' + next.position) : 'BẮT ĐẦU · BƯỚC 1'}</span><b class="clamp-2" style="display:-webkit-box">${esc(next.title)}</b></div>${icon('arrow', 18)}</a>
          <div class="foot"><a class="btn ${on ? 'btn-secondary' : 'btn-ghost'}" href="/bai-viet/${encodeURIComponent(next.slug)}">${p.done && p.done < p.total ? 'Đọc tiếp' : p.done === p.total ? 'Đọc lại' : 'Bắt đầu lộ trình'} ${icon('arrow', 18)}</a></div>
        </div>`;
      }).join('')}</div>`;
  }

  // ----- Sidebar -----
  async function renderSide() {
    const ages = [['', 'Mọi độ tuổi'], ['pregnancy', 'Mang thai'], ['0-6', '0 – 6 tháng'], ['6-12', '6 – 12 tháng'], ['12-24', '12 – 24 tháng']];
    let read = null;
    if (me.user) read = await api('/api/reading').catch(() => null);
    const localCount = localRead.get().length;
    const done = read ? read.items.length : localCount, total = read ? read.total : stats.articles;
    $('side').innerHTML = `
      <div class="filter-box"><h3>Độ tuổi của bé</h3>${ages.map(([k, l]) => `<label class="filter-opt"><input type="radio" name="age" value="${k}" ${state.age === k ? 'checked' : ''}> ${l}${k && k === childStage ? ' <span class="tag" style="margin-left:auto">Bé nhà bạn</span>' : ''}</label>`).join('')}</div>
      <div class="filter-box"><h3>Nguồn tham khảo</h3>${['WHO', 'UNICEF', 'Bộ Y tế'].map((s) => `<label class="filter-opt"><input type="checkbox" name="src" value="${s}" ${state.sources.includes(s) ? 'checked' : ''}> ${s}</label>`).join('')}</div>
      <div class="read-card"><span class="label" style="color:var(--sky-300)">Tiến độ đọc của bạn</span>
        <div style="display:flex;align-items:baseline;gap:6px"><span class="h1">${done}</span><span style="color:var(--sky-200)">/ ${total} bài</span></div>
        <div class="progress"><i style="width:${total ? Math.round(done / total * 100) : 0}%"></i></div>
        <button type="button" class="link" id="saved-btn" style="background:none;border:0;padding:0;color:#fff;justify-content:flex-start">${icon('bookmark', 16)} ${state.bookmarked ? 'Đang xem bài đã lưu – bỏ lọc' : `${read ? read.saved : 0} bài đã lưu`}</button>
        ${me.user ? '' : '<span class="small" style="color:var(--sky-200)">Đăng nhập để đồng bộ tiến độ giữa các thiết bị.</span>'}
      </div>`;
    $('side').querySelectorAll('input[name=age]').forEach((i) => i.addEventListener('change', () => { state.age = i.value; reload(true); }));
    $('side').querySelectorAll('input[name=src]').forEach((i) => i.addEventListener('change', () => { state.sources = [...$('side').querySelectorAll('input[name=src]:checked')].map((x) => x.value); reload(); }));
    $('saved-btn').addEventListener('click', () => { if (!me.user) { toast('Vui lòng đăng nhập để xem bài đã lưu.'); return; } state.bookmarked = !state.bookmarked; reload(); });
  }

  function query(extra) {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q); if (state.category) p.set('category', state.category); if (state.age) p.set('age', state.age);
    if (state.sources.length) p.set('source', state.sources.join(',')); if (state.bookmarked) p.set('bookmarked', '1'); if (state.partial) p.set('partial', '1'); p.set('sort', state.sort);
    Object.entries(extra || {}).forEach(([k, v]) => p.set(k, v)); return p.toString();
  }

  let featuredId = null;
  async function loadFeatured() {
    const box = $('featured');
    if (state.q || state.bookmarked || state.sources.length) { box.innerHTML = ''; return null; }
    const r = await api('/api/articles?' + query({ featured: '1', limit: 1, sort: 'newest' }));
    const a = r.items[0];
    if (!a) { box.innerHTML = ''; return null; }
    box.innerHTML = `<div class="featured">${cover(a.cover_image, CAT_ICON[a.category], 'deep', 96)}
      <div class="info"><div class="chips"><span class="tag dark">Nổi bật</span><span class="tag" style="background:#fff">${esc(CAT_SHORT[a.category])}</span>${a.step ? `<span class="tag outline">${icon('route', 13)} ${BT.stepLabel(a.step)}</span>` : ''}</div>
      <h2 class="h2">${esc(a.title)}</h2><p class="muted" style="margin:0">${esc(a.summary)}</p>
      <div class="small" style="display:flex;gap:16px;color:var(--sky-800)"><span style="display:inline-flex;gap:6px;align-items:center">${icon('shield', 16)} ${esc(a.source_name || 'BabyTogether')}</span><span style="display:inline-flex;gap:6px;align-items:center">${icon('book', 16)} ${esc(AGES[a.age_group])}</span></div>
      <a class="btn" style="align-self:flex-start" href="/bai-viet/${encodeURIComponent(a.slug)}">Đọc bài viết ${icon('arrow', 18)}</a></div></div>`;
    return a.id;
  }

  let listSeq = 0;
  async function loadList(append) {
    const list = $('list');
    if (!append) list.innerHTML = '<div class="loading" style="grid-column:1/-1">Đang tải…</div>';
    const my = ++listSeq;
    try {
      const r = await api('/api/articles?' + query({ limit: PAGE, offset: state.offset }));
      if (my !== listSeq) return; // kết quả cũ (người dùng đã gõ tiếp)
      const items = r.items.filter((a) => a.id !== featuredId);
      const html = items.map((a) => articleCard(a)).join('');
      if (append) list.insertAdjacentHTML('beforeend', html);
      else list.innerHTML = html || (featuredId && r.total ? '' : `<div class="empty" style="grid-column:1/-1">${state.bookmarked ? 'Bạn chưa lưu bài viết nào.' : `Không tìm thấy bài viết phù hợp.${state.q ? ' Thử từ khóa ngắn hơn, gõ không dấu hoặc bỏ bớt bộ lọc nhé!' : ' Thử bỏ bớt bộ lọc nhé!'}`}${state.q || state.category || state.age || state.sources.length || state.bookmarked ? '<br><button class="btn btn-ghost btn-sm" id="clear-all" style="margin-top:12px">Xóa tìm kiếm & bộ lọc</button>' : ''}</div>`);
      const ca = $('clear-all'); if (ca) ca.onclick = () => { Object.assign(state, { q: '', category: '', age: '', sources: [], bookmarked: false }); $('q').value = ''; reload(true); };
      $('more').hidden = !r.hasMore;
      $('count').textContent = `${r.total} bài viết`;
      $('count-sub').textContent = [state.q ? `cho “${state.q}”` : '', state.category ? CATEGORIES[state.category] : '', state.age ? AGES[state.age] : '', state.sources.length ? 'Nguồn: ' + state.sources.join(', ') : '', state.bookmarked ? 'Bài đã lưu' : ''].filter(Boolean).join(' - ');
    } catch (e) { list.innerHTML = `<div class="empty" style="grid-column:1/-1">${esc(e.message)}</div>`; }
  }

  async function reload(withPaths) {
    state.offset = 0;
    renderCats();
    const p = new URLSearchParams(); if (state.q) p.set('q', state.q); if (state.category) p.set('category', state.category); if (state.age) p.set('age', state.age); if (state.sources.length) p.set('source', state.sources.join(',')); if (state.bookmarked) p.set('saved', '1'); if (state.sort !== 'recommended') p.set('sort', state.sort);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    if (withPaths) renderPaths();
    renderSide();
    featuredId = await loadFeatured().catch(() => null);
    await loadList(false);
  }
  $('search-form').addEventListener('submit', (e) => { e.preventDefault(); clearTimeout(liveT); state.q = $('q').value.trim(); state.partial = false; reload(); });
  // Lọc ngay khi đang gõ (từ cuối được khớp theo tiền tố)
  let liveT;
  $('q').addEventListener('input', () => { clearTimeout(liveT); liveT = setTimeout(() => { const v = $('q').value; state.q = v.trim(); state.partial = !!v.trim() && !/\s$/.test(v); reload(); }, 300); });
  $('sort').addEventListener('change', () => { state.sort = $('sort').value; reload(); });
  $('more').addEventListener('click', () => { state.offset += PAGE; loadList(true); });
  reload(true);
});
