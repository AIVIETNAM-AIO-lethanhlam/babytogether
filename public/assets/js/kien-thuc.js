// Thư viện kiến thức: tìm kiếm, lọc danh mục/độ tuổi, lưu bài, tiến độ đọc
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ph, ICONS, CATEGORIES, AGES, CAT_ICON, toast } = BT;
  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    category: params.get('category') || '',
    age: params.get('age') || '',
    bookmarked: params.get('saved') === '1',
    offset: 0,
  };
  const PAGE = 9;
  const $ = (id) => document.getElementById(id);
  $('q').value = state.q;
  const me = await getMe();

  // Danh mục
  const catKeys = Object.keys(CATEGORIES);
  function renderCats() {
    $('cats').innerHTML = catKeys.map((k, i) => `
      <button type="button" class="cat-card ${state.category === k ? 'active' : ''}" data-cat="${k}" aria-pressed="${state.category === k}">
        <span class="num">0${i + 1}</span><span class="name">${CATEGORIES[k]}</span>
      </button>`).join('');
  }
  $('cats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    state.category = state.category === b.dataset.cat ? '' : b.dataset.cat;
    reload();
  });

  // Độ tuổi
  const ageKeys = ['', 'pregnancy', '0-6', '6-12', '12-24'];
  function renderAges() {
    $('age-chips').innerHTML = ageKeys.map((k) =>
      `<button type="button" class="chip ${state.age === k ? 'active' : ''}" data-age="${k}">${k ? AGES[k] : 'Mọi độ tuổi'}</button>`).join('');
    $('only-bookmarks').classList.toggle('active', state.bookmarked);
  }
  $('age-chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-age]'); if (!b) return;
    state.age = b.dataset.age; reload();
  });
  $('only-bookmarks').addEventListener('click', () => {
    if (!me.user) { toast('Vui lòng đăng nhập để xem bài đã lưu.'); return; }
    state.bookmarked = !state.bookmarked; reload();
  });
  $('search-form').addEventListener('submit', (e) => { e.preventDefault(); state.q = $('q').value.trim(); reload(); });

  function query(extra) {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.category) p.set('category', state.category);
    if (state.age) p.set('age', state.age);
    if (state.bookmarked) p.set('bookmarked', '1');
    Object.entries(extra || {}).forEach(([k, v]) => p.set(k, v));
    return p.toString();
  }

  function card(a) {
    return `<article class="post-card">
      ${ph(a.cover_image, CAT_ICON[a.category], a.cover_image ? a.title : CATEGORIES[a.category])}
      <button type="button" class="bookmark-btn ${a.bookmarked ? 'on' : ''}" data-bm="${a.id}" aria-label="${a.bookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}" title="${a.bookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}">${ICONS.bookmark}</button>
      <div class="tags"><span class="tag">${esc(AGES[a.age_group] || '')}</span>${a.is_read ? '<span class="tag read">Đã đọc</span>' : ''}</div>
      <h3 class="h3"><a href="/bai-viet/${encodeURIComponent(a.slug)}">${esc(a.title)}</a></h3>
      <p class="summary">${esc(a.summary)}</p>
      <a class="link-underline" href="/bai-viet/${encodeURIComponent(a.slug)}">Đọc bài viết</a>
    </article>`;
  }

  async function loadFeatured() {
    const box = $('featured');
    if (state.q || state.bookmarked) { box.innerHTML = ''; return null; }
    const r = await api('/api/articles?' + query({ featured: '1', limit: 1 }));
    const a = r.items[0];
    if (!a) { box.innerHTML = ''; return null; }
    box.innerHTML = `<div class="featured">
      ${ph(a.cover_image, CAT_ICON[a.category], a.cover_image ? a.title : 'Bài viết nổi bật')}
      <div class="info">
        <div class="eyebrow">${esc(CATEGORIES[a.category])}</div>
        <h2>${esc(a.title)}</h2>
        <div class="divider sm"><span></span></div>
        <p class="body-text">${esc(a.summary)}</p>
        <div class="meta">${esc(a.source_name || 'BabyTogether')} · Cập nhật: ${BT.fmtDate(a.updated_at)}</div>
        <a class="btn-light inline" href="/bai-viet/${encodeURIComponent(a.slug)}"><span>Đọc bài viết</span>${ICONS.arrow}</a>
      </div></div>`;
    return a.id;
  }

  let featuredId = null;
  async function loadList(append) {
    const list = $('list');
    if (!append) list.innerHTML = '<div class="loading">Đang tải…</div>';
    try {
      const r = await api('/api/articles?' + query({ limit: PAGE, offset: state.offset }));
      const items = r.items.filter((a) => a.id !== featuredId);
      const html = items.map(card).join('');
      if (append) list.insertAdjacentHTML('beforeend', html);
      else list.innerHTML = html || `<div class="empty" style="grid-column:1/-1">${state.bookmarked ? 'Bạn chưa lưu bài viết nào.' : 'Không tìm thấy bài viết phù hợp.'}</div>`;
      $('more').hidden = !r.hasMore;
    } catch (e) { list.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }

  async function reload() {
    state.offset = 0;
    renderCats(); renderAges();
    const title = state.bookmarked ? 'Bài viết đã lưu'
      : state.q ? `Kết quả cho “${state.q}”`
      : state.category ? CATEGORIES[state.category] : 'Tất cả bài viết';
    $('list-title').textContent = title;
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q); if (state.category) p.set('category', state.category); if (state.age) p.set('age', state.age);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    featuredId = await loadFeatured().catch(() => null);
    await loadList(false);
  }

  $('more').addEventListener('click', () => { state.offset += PAGE; loadList(true); });

  // Lưu bài viết
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-bm]'); if (!b) return;
    if (!me.user) { toast('Vui lòng đăng nhập để lưu bài viết.'); return; }
    try {
      const r = await api(`/api/articles/${b.dataset.bm}/bookmark`, { method: 'POST' });
      b.classList.toggle('on', r.bookmarked);
      b.setAttribute('aria-label', r.bookmarked ? 'Bỏ lưu' : 'Lưu bài viết');
      toast(r.bookmarked ? 'Đã lưu bài viết' : 'Đã bỏ lưu');
    } catch (ex) { toast(ex.message, true); }
  });

  // Tiến độ đọc
  if (me.user) {
    api('/api/reading').then((r) => {
      $('reading-progress').textContent = `Bạn đã đọc ${r.items.length}/${r.total} bài viết`;
    }).catch(() => {});
  }

  reload();
});
