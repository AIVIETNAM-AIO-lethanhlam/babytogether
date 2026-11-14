// Trang chi tiết bài viết: lộ trình đọc, "nên đọc trước", bài trước/tiếp theo, mục lục, nguồn, quiz
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, cover, articleCard, CATEGORIES, CAT_SHORT, AGES, CAT_ICON, toast, fmtDate, localRead, readMins } = BT;
  const box = document.getElementById('article');
  const m = location.pathname.match(/^\/bai-viet\/([^/]+)/);
  const slug = m ? decodeURIComponent(m[1]) : new URLSearchParams(location.search).get('slug');
  if (!slug) { box.innerHTML = '<div class="empty" style="margin:60px 0">Không tìm thấy bài viết.</div>'; return; }
  let data;
  try { data = await api('/api/articles/' + encodeURIComponent(slug)); }
  catch (e) { box.innerHTML = `<div class="empty" style="margin:60px 0">${esc(e.message)}</div>`; return; }
  const me = await getMe();
  const a = data.article, path = data.path, quiz = data.quiz;
  const local = localRead.get();
  const isRead = (x) => !!(x.is_read || local.includes(x.id));
  if (path) path.items.forEach((x) => { x.read = isRead(x); });
  document.title = `${a.title} – BabyTogether`;

  // Nên đọc trước: bài chưa đọc gần nhất phía trước trong lộ trình
  let prereq = null;
  if (path && path.index > 0) {
    for (let i = path.index - 1; i >= 0; i--) if (!path.items[i].read) { prereq = path.items[i]; break; }
  }
  const dismissKey = 'bt_prereq_' + a.id;
  let dismissed = false; try { dismissed = !!sessionStorage.getItem(dismissKey); } catch (_) { /* */ }
  const readCount = path ? path.items.filter((x) => x.read).length : 0;

  box.innerHTML = `
    <div class="article-head">
      <nav class="crumbs" style="margin:0"><a href="/kien-thuc">Thư viện kiến thức</a><span>/</span><a class="cur" href="/kien-thuc?category=${a.category}">${esc(CATEGORIES[a.category])}</a></nav>
      ${path ? `<div class="path-bar"><div class="l"><span class="ib sm solid">${icon('route', 18)}</span><div><span class="label">Lộ trình: ${esc(path.title)}</span>
        <div class="small" style="font-weight:500">Bài ${path.index + 1} / ${path.total} · ${prereq ? 'Bạn chưa đọc bước ' + prereq.position : `Bạn đã đọc ${readCount} bài trong lộ trình`}</div></div></div>
        <div style="display:flex;gap:18px;align-items:center"><div class="dots">${path.items.map((x, i) => `<i class="${i === path.index ? 'cur' : x.read ? 'on' : ''}"></i>`).join('')}</div><a class="link small" href="#lo-trinh">Xem lộ trình ${icon('arrow', 16)}</a></div></div>` : ''}
      <div class="chips"><span class="tag">${esc(CATEGORIES[a.category])}</span><span class="tag neutral">${esc(AGES[a.age_group] || '')}</span>${a.status === 'draft' ? '<span class="tag warn">Bản nháp – chỉ quản trị viên thấy</span>' : ''}</div>
      <h1 class="h1">${esc(a.title)}</h1>
      ${a.summary ? `<p class="lead">${esc(a.summary)}</p>` : ''}
      <div class="meta-row">
        <div class="meta-items"><span>${icon('shield', 18)} Nguồn: ${esc(a.source_name || 'BabyTogether')}</span><span>${icon('calendar', 18)} Cập nhật ${fmtDate(a.updated_at)}</span>
          ${a.reviewer ? `<span>${icon('user', 18)} Thẩm định: ${esc(a.reviewer)}</span>` : ''}<span>${icon('clock', 18)} ${readMins(a)} phút đọc</span></div>
        <div class="chips"><button class="act-btn ${a.bookmarked ? 'on' : ''}" id="bm-btn">${icon('bookmark', 16)}<span>${a.bookmarked ? 'Đã lưu' : 'Lưu bài'}</span></button>
          <button class="act-btn ${isRead(a) ? 'on' : ''}" id="read-btn">${icon('check', 16)}<span>${isRead(a) ? 'Đã đọc' : 'Đánh dấu đã đọc'}</span></button>
          <button class="act-btn" id="share-btn">${icon('share', 16)}<span>Chia sẻ</span></button></div>
      </div>
    </div>
    ${cover(a.cover_image, CAT_ICON[a.category], 'deep article-cover', 140)}
    <div class="article-layout">
      <div style="min-width:0">
        ${prereq && !dismissed ? `<div class="prereq" id="prereq"><span class="ib">${icon('info', 22)}</span><div class="t"><b>Bạn nên đọc bài này trước</b>
          <div class="small">Bước ${prereq.position} · ${esc(prereq.title)} – đọc theo thứ tự để nắm kiến thức vững hơn.</div></div>
          <div class="chips"><button class="btn btn-ghost btn-sm" id="skip-pre" style="border-color:transparent">Để sau</button><a class="btn btn-sm" href="/bai-viet/${encodeURIComponent(prereq.slug)}">Đọc bước ${prereq.position} ${icon('arrow', 16)}</a></div></div>` : ''}
        <div class="article-body" id="body">${a.content}</div>
        ${path && (path.prev || path.next) ? `<div class="path-nav">
          ${path.prev ? `<a class="prev" href="/bai-viet/${encodeURIComponent(path.prev.slug)}"><span class="label" style="display:flex;gap:6px;align-items:center">${icon('back', 14)} Bài trước · Bước ${path.prev.position}</span><b class="h4">${esc(path.prev.title)}</b></a>` : '<span></span>'}
          ${path.next ? `<a class="next" href="/bai-viet/${encodeURIComponent(path.next.slug)}"><span style="display:flex;justify-content:space-between;align-items:center"><span class="label">Bài tiếp theo · Bước ${path.next.position}</span><span class="ib sm white">${icon('arrow', 18)}</span></span>
            <b class="h3">${esc(path.next.title)}</b><span class="small" style="color:var(--sky-100);display:flex;gap:6px;align-items:center">${icon('route', 14)} ${esc(path.title)} · còn ${path.total - path.index - 1} bài nữa là hoàn thành</span></a>`
            : `<a class="next" href="/kien-thuc"><span class="label">Hoàn thành lộ trình 🎉</span><b class="h3">Khám phá lộ trình khác trong thư viện</b></a>`}
        </div>` : ''}
        <div class="feedback"><b>Bài viết này có hữu ích với bạn không?</b><div class="chips"><button class="act-btn" data-fb="1">${icon('thumb', 16)} Có, hữu ích</button><button class="act-btn" data-fb="0">Chưa rõ lắm</button></div></div>
        <p class="small muted" style="margin-top:20px">Thông tin chỉ mang tính tham khảo và không thay thế tư vấn của bác sĩ. Khi bé có dấu hiệu bất thường, hãy liên hệ cơ sở y tế.</p>
      </div>
      <aside class="article-side">
        <nav class="side-card toc" id="toc"><span class="label" style="margin-bottom:6px">Mục lục</span></nav>
        ${path ? `<div class="side-card steps-list" id="lo-trinh"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span class="label">Lộ trình: ${esc(path.title)}</span><span class="small" style="color:var(--sky-700);font-weight:600">${readCount}/${path.total}</span></div>
          ${path.items.map((x, i) => `<a href="/bai-viet/${encodeURIComponent(x.slug)}" class="${i === path.index ? 'cur' : x.read ? 'done' : ''}"><span class="n">${x.read && i !== path.index ? icon('check', 13, 3) : x.position}</span><span class="clamp-2">${esc(x.title)}</span></a>`).join('')}</div>` : ''}
        <div class="side-card tint" style="gap:12px"><span class="label">Nguồn & thẩm định</span>
          <div><div class="small muted">Nguồn tham khảo</div><b class="small">${esc(a.source_name || 'BabyTogether')}</b></div>
          <div><div class="small muted">Ngày cập nhật</div><b class="small">${fmtDate(a.updated_at)}</b></div>
          ${a.reviewer ? `<div><div class="small muted">Thẩm định chuyên môn</div><b class="small">${esc(a.reviewer)}</b></div>` : ''}
          ${a.source_url ? `<a class="link small" href="${esc(a.source_url)}" target="_blank" rel="noopener noreferrer">Xem tài liệu gốc ${icon('link', 16)}</a>` : ''}</div>
        <div class="card grad" style="padding:24px;display:flex;flex-direction:column;gap:12px"><span class="label" style="color:var(--sky-200)">Kiểm tra nhanh</span>
          <b>${quiz ? `Trả lời ${quiz.questions} câu hỏi về bài này để nhận tới +${quiz.questions * quiz.points_per_question} điểm.` : 'Ôn lại kiến thức với thử thách quiz và ghi điểm cho gia đình.'}</b>
          <a class="btn btn-secondary" style="align-self:flex-start" href="/choi-hoc${quiz ? '?quiz=' + quiz.id : ''}">Làm quiz ${icon('arrow', 16)}</a></div>
      </aside>
    </div>`;

  // Mục lục
  const heads = [...document.querySelectorAll('#body h2')];
  const toc = document.getElementById('toc');
  if (!heads.length) toc.remove();
  else heads.forEach((h, i) => { h.id = 'muc-' + (i + 1); toc.insertAdjacentHTML('beforeend', `<a href="#${h.id}">${esc(h.textContent)}</a>`); });
  const io = 'IntersectionObserver' in window && heads.length ? new IntersectionObserver((ents) => {
    ents.forEach((en) => { if (en.isIntersecting) toc.querySelectorAll('a').forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id)); });
  }, { rootMargin: '-100px 0px -70% 0px' }) : null;
  if (io) heads.forEach((h) => io.observe(h));

  if (data.related.length) { document.getElementById('related-wrap').hidden = false; document.getElementById('related').innerHTML = data.related.map((r) => articleCard(r, { bookmark: false })).join(''); }

  const skip = document.getElementById('skip-pre');
  if (skip) skip.onclick = () => { document.getElementById('prereq').remove(); try { sessionStorage.setItem(dismissKey, '1'); } catch (_) { /* */ } };

  const bm = document.getElementById('bm-btn');
  bm.onclick = async () => {
    if (!me.user) { toast('Vui lòng đăng nhập để lưu bài viết.'); return; }
    try { const r = await api(`/api/articles/${a.id}/bookmark`, { method: 'POST' }); bm.classList.toggle('on', r.bookmarked); bm.querySelector('span').textContent = r.bookmarked ? 'Đã lưu' : 'Lưu bài'; }
    catch (e) { toast(e.message, true); }
  };
  let marked = isRead(a);
  const readBtn = document.getElementById('read-btn');
  async function markRead(silent) {
    if (marked) return; marked = true;
    if (me.user) { try { await api(`/api/articles/${a.id}/read`, { method: 'POST' }); } catch (e) { marked = false; return; } }
    else localRead.add(a.id);
    readBtn.classList.add('on'); readBtn.querySelector('span').textContent = 'Đã đọc';
    if (!silent) toast(path && path.next ? `Đã đọc! Tiếp theo: Bước ${path.next.position}` : 'Đã ghi nhận vào tiến độ đọc');
  }
  readBtn.onclick = () => markRead(false);
  document.getElementById('share-btn').onclick = async () => {
    try { if (navigator.share) await navigator.share({ title: a.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast('Đã sao chép đường dẫn bài viết'); } } catch (_) { /* */ }
  };
  document.querySelectorAll('[data-fb]').forEach((b) => b.onclick = () => { document.querySelectorAll('[data-fb]').forEach((x) => x.classList.toggle('on', x === b)); toast('Cảm ơn ba mẹ đã góp ý!'); });

  const bar = document.getElementById('read-progress'); const body = document.getElementById('body');
  function onScroll() {
    const r = body.getBoundingClientRect(); const total = r.height - innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(total, 1))); bar.style.width = p * 100 + '%';
    if (p > 0.92) markRead(true);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
});
