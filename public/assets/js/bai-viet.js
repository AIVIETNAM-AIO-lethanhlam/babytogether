// Trang chi tiết bài viết
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ph, ICONS, CATEGORIES, AGES, CAT_ICON, toast, fmtDate } = BT;
  const box = document.getElementById('article');
  const m = location.pathname.match(/^\/bai-viet\/([^/]+)/);
  const slug = m ? decodeURIComponent(m[1]) : new URLSearchParams(location.search).get('slug');
  if (!slug) { box.innerHTML = '<div class="empty">Không tìm thấy bài viết.</div>'; return; }

  let data;
  try { data = await api('/api/articles/' + encodeURIComponent(slug)); }
  catch (e) { box.innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
  const me = await getMe();
  const a = data.article;
  document.title = `${a.title} – BabyTogether`;

  box.innerHTML = `
    <header class="article-head">
      <a class="eyebrow" href="/kien-thuc?category=${a.category}">${esc(CATEGORIES[a.category])}</a>
      <h1 class="h1">${esc(a.title)}</h1>
      <div class="divider"><span></span></div>
      ${a.summary ? `<p class="lead">${esc(a.summary)}</p>` : ''}
      <div class="meta">${esc(a.source_name || 'BabyTogether')} · Cập nhật: ${fmtDate(a.updated_at)} · ${esc(AGES[a.age_group] || '')}</div>
      ${a.status === 'draft' ? '<span class="tag">Bản nháp (chỉ quản trị viên thấy)</span>' : ''}
      <div class="article-actions">
        <button type="button" class="btn-outline ${a.bookmarked ? 'active' : ''}" id="bm-btn">${ICONS.bookmark}<span>${a.bookmarked ? 'Đã lưu' : 'Lưu bài viết'}</span></button>
        <button type="button" class="btn-outline ${a.is_read ? 'active' : ''}" id="read-btn">${a.is_read ? '✓ Đã đọc' : 'Đánh dấu đã đọc'}</button>
      </div>
    </header>
    ${a.cover_image ? `<div class="article-cover">${ph(a.cover_image, CAT_ICON[a.category], a.title)}</div>` : ''}
    <div class="article-body">${a.content}</div>
    <aside class="source-box" aria-label="Thông tin nguồn">
      <div class="row"><b>Nguồn tham khảo</b><span>${esc(a.source_name || 'Đang cập nhật')}</span></div>
      <div class="row"><b>Ngày cập nhật</b><span>${fmtDate(a.updated_at)}</span></div>
      <div class="row"><b>Thẩm định chuyên môn</b><span>${esc(a.reviewer || 'Đang cập nhật')}</span></div>
      ${a.source_url ? `<div class="row"><b>Tài liệu gốc</b><a href="${esc(a.source_url)}" target="_blank" rel="noopener noreferrer">${esc(a.source_url)}</a></div>` : ''}
    </aside>
    <p class="disclaimer">Thông tin chỉ mang tính tham khảo và không thay thế tư vấn của bác sĩ. Khi bé hoặc mẹ có dấu hiệu bất thường, hãy liên hệ cơ sở y tế.</p>
    <div style="height:72px"></div>`;

  // Bài viết liên quan
  if (data.related.length) {
    document.getElementById('related-wrap').hidden = false;
    document.getElementById('related').innerHTML = data.related.map((r) => `
      <article class="post-card">
        ${ph(r.cover_image, CAT_ICON[r.category], r.cover_image ? r.title : CATEGORIES[r.category])}
        <h3 class="h3"><a href="/bai-viet/${encodeURIComponent(r.slug)}">${esc(r.title)}</a></h3>
        <a class="link-underline" href="/bai-viet/${encodeURIComponent(r.slug)}">Đọc bài viết</a>
      </article>`).join('');
  }

  const bm = document.getElementById('bm-btn');
  bm.addEventListener('click', async () => {
    if (!me.user) { toast('Vui lòng đăng nhập để lưu bài viết.'); return; }
    try {
      const r = await api(`/api/articles/${a.id}/bookmark`, { method: 'POST' });
      bm.classList.toggle('active', r.bookmarked);
      bm.querySelector('span').textContent = r.bookmarked ? 'Đã lưu' : 'Lưu bài viết';
    } catch (e) { toast(e.message, true); }
  });

  let marked = !!a.is_read;
  const readBtn = document.getElementById('read-btn');
  async function markRead(silent) {
    if (marked) return;
    if (!me.user) { if (!silent) toast('Vui lòng đăng nhập để theo dõi tiến độ đọc.'); return; }
    marked = true;
    try {
      await api(`/api/articles/${a.id}/read`, { method: 'POST' });
      readBtn.classList.add('active'); readBtn.textContent = '✓ Đã đọc';
      if (!silent) toast('Đã ghi nhận bài viết vào tiến độ đọc');
    } catch (e) { marked = false; }
  }
  readBtn.addEventListener('click', () => markRead(false));

  // Thanh tiến độ đọc + tự đánh dấu đã đọc khi cuộn gần hết bài
  const bar = document.getElementById('read-progress');
  const body = box.querySelector('.article-body');
  function onScroll() {
    const rect = body.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
    bar.style.width = (p * 100) + '%';
    if (p > 0.92) markRead(true);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
