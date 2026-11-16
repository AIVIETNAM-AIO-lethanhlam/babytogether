// Trang quản trị BabyTogether: quản lý bài viết, trình soạn thảo kiểu Notion, quiz/game, xác nhận, lộ trình, nhiệm vụ, người dùng
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, toast, modal, compressImage, fmtDate, cover, CATEGORIES, CAT_SHORT, CAT_ICON, AGES, logoHtml } = BT;
  const me = await getMe();
  if (!me.user || me.user.role !== 'admin') { location.replace('/admin/login'); return; }
  const main = document.getElementById('main');
  let dirty = false;
  window.addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  const LETTERS = 'ABCDEF';

  // ---------- Khung trang ----------
  document.getElementById('adm-top').innerHTML = `<div class="l">${logoHtml()}<span class="adm-pill">${icon('shield', 12, 2.5)} ADMIN</span></div>
    <form class="adm-search" id="top-search" role="search">${icon('search', 18)}<input name="q" placeholder="Tìm bài viết theo tiêu đề…" aria-label="Tìm bài viết"></form>
    <div class="r"><a class="btn btn-ghost btn-sm" href="/" target="_blank" rel="noopener">${icon('eye', 16)} Xem trang người dùng</a>
      <div class="adm-me"><span class="avatar">${esc(me.user.name.charAt(0).toUpperCase())}</span><div><b>${esc(me.user.name)}</b><span>${esc(me.user.email)}</span></div></div></div>`;
  document.getElementById('top-search').onsubmit = (e) => {
    e.preventDefault(); const v = e.target.q.value.trim(); const h = '#articles' + (v ? '?q=' + encodeURIComponent(v) : '');
    listState.page = 1;
    if (location.hash === h) { listState.q = v; viewArticles(new URLSearchParams()); } else location.hash = h;
  };
  const NAV = [['articles', 'list', 'Quản lý bài viết'], ['editor', 'pen', 'Viết bài mới'], ['quizzes', 'quiz', 'Quiz & game'], ['paths', 'route', 'Lộ trình đọc'], ['missions', 'target', 'Nhiệm vụ'], ['users', 'users', 'Người dùng']];
  document.getElementById('adm-side').innerHTML = `<span class="label">Quản trị</span>${NAV.map(([k, i, l]) => `<a href="#${k}" data-nav="${k}">${icon(i, 18)} ${l}</a>`).join('')}
    <span class="label" style="margin-top:16px">Xem như người dùng</span>
    <div class="user-links">${[['/', 'home', 'Trang chủ'], ['/kien-thuc', 'book', 'Thư viện kiến thức'], ['/hanh-trinh', 'route', 'Hành trình'], ['/choi-hoc', 'star', 'Chơi & Học']].map(([h, i, l]) => `<a href="${h}" target="_blank" rel="noopener">${icon(i, 18)} ${l}<span class="ext">${icon('link', 14)}</span></a>`).join('')}</div>
    <button class="logout" id="logout">${icon('logout', 18)} Đăng xuất</button>`;
  document.getElementById('logout').onclick = async () => { await api('/api/auth/logout', { method: 'POST' }); location.href = '/admin/login'; };

  // ---------- Dữ liệu dùng chung ----------
  let pathsCache = null;
  const getPaths = async (force) => { if (!pathsCache || force) pathsCache = (await api('/api/admin/paths')).items; return pathsCache; };
  const statusTag = (s) => s === 'published' ? '<span class="tag ok">Đã đăng</span>' : '<span class="tag warn">Bản nháp</span>';
  const catOptions = (sel) => Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${esc(v)}</option>`).join('');
  const ageOptions = (sel) => Object.entries(AGES).map(([k, v]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${esc(v)}</option>`).join('');
  function wideModal(form, w = 880) { form.style.maxWidth = w + 'px'; }

  // =====================================================================
  // A2 · QUẢN LÝ BÀI VIẾT
  // =====================================================================
  const listState = { q: '', days: '', category: '', status: '', path: '', has_quiz: '', page: 1, edit: sessionStorage.getItem('bt_adm_edit') === '1' };
  async function viewArticles(params) {
    if (params.get('q') != null) { listState.q = params.get('q'); listState.page = 1; }
    const syncHash = () => { const h = '#articles' + (listState.q ? '?q=' + encodeURIComponent(listState.q) : ''); if (location.hash !== h) { history.replaceState(null, '', h); lastHash = h; } };
    syncHash();
    const paths = await getPaths();
    main.innerHTML = `<div class="adm-head"><div><h1>Quản lý bài viết</h1><p class="muted" style="margin:4px 0 0" id="sub"></p></div>
      <div class="chips"><button class="btn btn-ghost edit-toggle ${listState.edit ? 'on' : ''}" id="toggle-edit">${icon('pen', 16)} ${listState.edit ? 'Đang chỉnh sửa' : 'Chỉnh sửa'}${listState.edit ? ' ' + icon('x', 14) : ''}</button><a class="btn" href="#editor">${icon('plus', 18)} Viết bài mới</a></div></div>
      <div class="tiles" id="tiles"></div>
      <div class="filters">
        <label class="s">${icon('search', 16)}<input id="f-q" placeholder="Tìm theo tiêu đề…" value="${esc(listState.q)}"></label>
        <select id="f-days" aria-label="Thời gian"><option value="">Mọi thời gian</option><option value="7">7 ngày qua</option><option value="30">30 ngày qua</option><option value="90">90 ngày qua</option><option value="365">12 tháng qua</option></select>
        <select id="f-category" aria-label="Mục"><option value="">Mục: Tất cả</option>${catOptions(listState.category)}</select>
        <select id="f-status" aria-label="Trạng thái"><option value="">Trạng thái: Tất cả</option><option value="published">Đã đăng</option><option value="draft">Bản nháp</option></select>
        <select id="f-path" aria-label="Lộ trình"><option value="">Lộ trình: Tất cả</option><option value="none">Chưa thuộc lộ trình</option>${paths.map((p) => `<option value="${p.id}">${esc(p.title)}</option>`).join('')}</select>
      </div>
      <div class="chips" id="tabs"></div>
      <div class="table" id="table"><div class="loading">Đang tải…</div></div>
      ${listState.edit ? `<div class="msg info" style="display:flex;gap:8px;align-items:center">${icon('pen', 16)} Chế độ chỉnh sửa đang bật: mỗi bài hiện nút Sửa / Xóa. Bấm “Sửa” để mở lại trang viết bài với nút “Cập nhật”. Bản nháp không hiển thị với người dùng.</div>` : ''}`;
    ['days', 'category', 'status', 'path'].forEach((k) => { const el = document.getElementById('f-' + k); el.value = listState[k]; el.classList.toggle('on', !!listState[k]); el.onchange = () => { listState[k] = el.value; listState.page = 1; viewArticles(new URLSearchParams()); }; });
    let t; document.getElementById('f-q').oninput = (e) => { clearTimeout(t); t = setTimeout(() => { listState.q = e.target.value.trim(); listState.page = 1; syncHash(); load(); }, 300); };
    document.getElementById('toggle-edit').onclick = () => { listState.edit = !listState.edit; sessionStorage.setItem('bt_adm_edit', listState.edit ? '1' : ''); viewArticles(new URLSearchParams()); };
    async function load() {
      const p = new URLSearchParams(); ['q', 'days', 'category', 'status', 'path', 'has_quiz'].forEach((k) => { if (listState[k]) p.set(k, listState[k]); });
      const r = await api('/api/admin/articles?' + p);
      const c = r.counts;
      document.getElementById('sub').textContent = `${c.total} bài viết · ${c.published || 0} đã đăng · ${c.drafts || 0} bản nháp`;
      document.getElementById('tiles').innerHTML = [[c.total, 'Tất cả bài viết', 'var(--sky-700)'], [c.published || 0, 'Đã đăng', 'var(--ok)'], [c.drafts || 0, 'Bản nháp', 'var(--warn)'], [c.with_quiz || 0, 'Bài có quiz', 'var(--sky-500)']].map(([n, l, col]) => `<div class="tile"><b style="color:${col}">${n}</b><span>${l}</span></div>`).join('');
      const cnt = (n) => ` <span class="count">${n}</span>`;
      const tabs = [['', '', 'Tất cả' + cnt(c.total)], ['published', '', 'Đã đăng' + cnt(c.published || 0)], ['draft', '', 'Bản nháp' + cnt(c.drafts || 0)], ['', '1', 'Có quiz' + cnt(c.with_quiz || 0)]];
      document.getElementById('tabs').innerHTML = tabs.map(([s, q, l]) => `<button class="chip ${listState.status === s && listState.has_quiz === q ? 'active' : ''}" data-s="${s}" data-q="${q}">${l}</button>`).join('');
      document.getElementById('tabs').onclick = (e) => { const b = e.target.closest('[data-s]'); if (!b) return; listState.status = b.dataset.s; listState.has_quiz = b.dataset.q; listState.page = 1; viewArticles(new URLSearchParams()); };
      const PER = 10, pages = Math.max(1, Math.ceil(r.items.length / PER)); listState.page = Math.min(listState.page, pages);
      const rows = r.items.slice((listState.page - 1) * PER, listState.page * PER);
      document.getElementById('table').innerHTML = `<table><thead><tr><th>Bài viết</th><th>Mục</th><th>Trạng thái</th><th>Quiz</th><th>Cập nhật</th><th style="text-align:right">Thao tác</th></tr></thead><tbody>
        ${rows.map((a) => `<tr><td><div class="t-title">${cover(a.cover_image && a.cover_image !== 'data' ? a.cover_image : '', CAT_ICON[a.category], '', 22)}<div style="min-width:0"><b class="clamp-2">${esc(a.title)}</b><div class="small muted">${a.step ? `Bước ${a.step.position} · ${esc(a.step.path_title)}` : 'Chưa thuộc lộ trình'}</div></div></div></td>
          <td>${esc(CAT_SHORT[a.category] || '')}</td><td>${statusTag(a.status)}${a.featured ? ' <span class="tag">Nổi bật</span>' : ''}</td><td>${a.quiz_questions ? a.quiz_questions + ' câu' : '—'}</td><td>${fmtDate(a.updated_at)}</td>
          <td><div class="row-actions">${listState.edit ? `<a class="mini-btn" href="#editor/${a.id}">${icon('pen', 14)} Sửa</a><button class="mini-btn del" data-del="${a.id}" data-title="${esc(a.title)}">${icon('trash', 14)} Xóa</button>` : ''}
            <a class="mini-btn icon" href="/bai-viet/${encodeURIComponent(a.slug)}" target="_blank" rel="noopener" title="Xem">${icon('eye', 16)}</a></div></td></tr>`).join('') || '<tr><td colspan="6"><div class="empty" style="border:0">Không có bài viết phù hợp.</div></td></tr>'}
        </tbody></table><div class="pager"><span>Hiển thị ${r.items.length ? (listState.page - 1) * PER + 1 : 0}–${(listState.page - 1) * PER + rows.length} trong ${r.items.length} bài viết</span>
        <div class="chips">${[...Array(pages)].map((_, i) => `<button class="${i + 1 === listState.page ? 'on' : ''}" data-pg="${i + 1}">${i + 1}</button>`).join('')}</div></div>`;
      document.getElementById('table').onclick = (e) => {
        const pg = e.target.closest('[data-pg]'); if (pg) { listState.page = Number(pg.dataset.pg); load(); return; }
        const d = e.target.closest('[data-del]'); if (!d) return;
        modal({ title: 'Xóa bài viết này?', submitText: 'Xóa bài viết', danger: true,
          html: `<span class="ib lg" style="background:var(--danger-bg);color:var(--danger)">${icon('trash', 26)}</span><p class="muted" style="margin:0">“${esc(d.dataset.title)}” và quiz đi kèm (nếu có) sẽ bị xóa vĩnh viễn. Không thể hoàn tác.</p>`,
          onSubmit: async () => { await api('/api/admin/articles/' + d.dataset.del, { method: 'DELETE' }); toast('Đã xóa bài viết'); load(); } });
      };
    }
    await load();
  }

  // =====================================================================
  // A3 · VIẾT BÀI / SỬA BÀI (trình soạn thảo kiểu Notion)
  // =====================================================================
  function cleanPaste(html) {
    const OK = { P: 1, H2: 1, H3: 1, STRONG: 1, B: 1, EM: 1, I: 1, U: 1, UL: 1, OL: 1, LI: 1, BLOCKQUOTE: 1, BR: 1, A: 1 };
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 8) { n.remove(); return; }
      if (n.nodeType !== 1) return;
      walk(n);
      let tag = n.tagName; if (tag === 'H1') tag = 'H2'; if (/^H[4-6]$/.test(tag)) tag = 'H3'; if (tag === 'DIV') tag = 'P';
      if (!OK[tag]) { n.replaceWith(...n.childNodes); return; }
      const el = doc.createElement(tag);
      if (tag === 'A' && /^https?:/i.test(n.getAttribute('href') || '')) el.setAttribute('href', n.getAttribute('href'));
      el.append(...n.childNodes); n.replaceWith(el);
    });
    const root = doc.body.firstChild; walk(root);
    return root.innerHTML;
  }
  function videoEmbed(url) {
    url = String(url || '').trim();
    let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
    if (m) return `<div class="video-embed" contenteditable="false"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="Video" allowfullscreen></iframe></div>`;
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m) return `<div class="video-embed" contenteditable="false"><iframe src="https://player.vimeo.com/video/${m[1]}" title="Video" allowfullscreen></iframe></div>`;
    if (/^https?:\/\/\S+\.(mp4|webm)(\?\S*)?$/i.test(url)) return `<div class="video-embed" contenteditable="false"><video src="${esc(url)}" controls></video></div>`;
    return null;
  }

  async function viewEditor(id) {
    const blank = { title: '', summary: '', content: '', category: 'baby-care', age_group: 'all', cover_image: '', source_name: '', source_url: '', reviewer: '', status: 'draft', featured: 0, slug: '', path_id: '', path_position: '' };
    let a = blank, quiz = null;
    if (id) { const r = await api('/api/admin/articles/' + id); a = r.article; quiz = r.quiz; }
    const paths = await getPaths();
    const isPub = a.status === 'published';
    let coverImg = a.cover_image || '';
    main.innerHTML = `
      <div class="action-bar"><div class="l"><a class="link" href="#articles">${icon('back', 16)} Quản lý bài viết</a><span class="sep"></span>${id ? (isPub ? '<span class="tag ok">Đang sửa · Đã đăng</span>' : '<span class="tag warn">Đang sửa · Bản nháp</span>') : '<span class="tag warn">Bài mới · Bản nháp</span>'}
        <span class="small muted" style="display:inline-flex;gap:6px;align-items:center" id="save-state">${icon('cloud', 16)} ${id ? 'Cập nhật lần cuối ' + fmtDate(a.updated_at, true) : 'Chưa lưu'}</span></div>
        <div class="chips"><button class="btn btn-ghost btn-sm" id="preview">${icon('eye', 16)} Xem trước</button>
          ${id ? `<button class="btn btn-ghost btn-sm" id="discard">Hủy thay đổi</button>` : ''}
          ${isPub ? `<button class="btn btn-secondary btn-sm" id="to-draft">Chuyển về nháp</button><button class="btn btn-sm" id="publish">Cập nhật ${icon('arrow', 16)}</button>`
            : `<button class="btn btn-secondary btn-sm" id="save-draft">Lưu bản nháp</button><button class="btn btn-sm" id="publish">Đăng bài ${icon('arrow', 16)}</button>`}</div></div>
      <div id="restore"></div>
      <div class="editor-cols">
        <div class="canvas">
          <div class="cover-area" id="cover-area"><div class="cover-btns"><button class="chip-btn" id="cover-up">${icon('image', 16)} <span id="cover-label"></span></button><button class="chip-btn" id="cover-url">${icon('link', 16)} Dán link ảnh</button><button class="chip-btn" id="cover-rm">${icon('trash', 16)} Bỏ ảnh</button></div><input type="file" id="cover-file" accept="image/*" hidden></div>
          <div class="doc">
            <textarea class="doc-title" id="title" rows="1" maxlength="250" placeholder="Tiêu đề bài viết">${esc(a.title)}</textarea>
            <textarea class="doc-summary" id="summary" rows="1" maxlength="600" placeholder="Thêm tóm tắt ngắn (hiển thị ở danh sách bài viết)…">${esc(a.summary)}</textarea>
            <hr class="sep">
            <div class="rte-toolbar" id="tb" role="toolbar" aria-label="Định dạng">
              <select id="tb-block" title="Kiểu khối" aria-label="Kiểu khối"><option value="P">Văn bản</option><option value="H2">Tiêu đề lớn</option><option value="H3">Tiêu đề nhỏ</option><option value="BLOCKQUOTE">Trích dẫn</option></select>
              <select id="tb-font" title="Font chữ" aria-label="Font chữ"><option value="">Font mặc định</option><option value="Be Vietnam Pro">Be Vietnam Pro</option><option value="Lora">Lora (có chân)</option><option value="Montserrat">Montserrat</option><option value="Georgia">Georgia</option><option value="Arial">Arial</option></select>
              <select id="tb-size" title="Cỡ chữ" aria-label="Cỡ chữ"><option value="">Cỡ</option>${[14, 16, 18, 20, 24, 28, 32].map((n) => `<option value="${n}">${n}</option>`).join('')}</select>
              <span class="sep"></span>
              <button type="button" data-cmd="bold" title="In đậm (Ctrl+B)"><b>B</b></button><button type="button" data-cmd="italic" title="In nghiêng (Ctrl+I)"><i style="font-family:Georgia">I</i></button><button type="button" data-cmd="underline" title="Gạch chân (Ctrl+U)"><u>U</u></button><button type="button" data-cmd="strikeThrough" title="Gạch ngang"><s>S</s></button>
              <button type="button" id="tb-color" title="Màu chữ / màu nền"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><b>A</b><i id="color-bar" style="display:block;width:16px;height:3px;border-radius:2px;background:var(--sky-500);margin-top:2px"></i></span>${icon('chevd', 12)}</button>
              <span class="sep"></span>
              <button type="button" data-act="link" title="Chèn liên kết">${icon('link', 16)}</button>
              <button type="button" data-cmd="insertUnorderedList" title="Danh sách">${icon('list', 16)}</button><button type="button" data-cmd="insertOrderedList" title="Danh sách số">${icon('ol', 16)}</button>
              <button type="button" data-cmd="justifyLeft" title="Căn trái">${icon('alignl', 16)}</button><button type="button" data-cmd="justifyCenter" title="Căn giữa">${icon('alignc', 16)}</button>
              <span class="sep"></span>
              <button type="button" data-ins="image" title="Chèn ảnh">${icon('image', 16)}</button><button type="button" data-ins="video" title="Chèn video">${icon('video', 16)}</button><button type="button" data-ins="callout-warning" title="Ô lưu ý">${icon('alert', 16)}</button><button type="button" data-ins="divider" title="Đường kẻ">${icon('minus', 16)}</button>
              <span class="sep"></span>
              <button type="button" data-cmd="removeFormat" title="Xóa định dạng">${icon('eraser', 16)}</button><button type="button" data-cmd="undo" title="Hoàn tác">${icon('undo', 16)}</button><button type="button" data-cmd="redo" title="Làm lại">${icon('redo', 16)}</button><button type="button" id="tb-src" title="Sửa mã HTML">${icon('code', 16)}</button>
            </div>
            <div class="rte article-body" id="rte" contenteditable="true" spellcheck="true"></div>
            <textarea class="rte-src" id="src" hidden spellcheck="false"></textarea>
            <button type="button" class="add-block" id="add-block">${icon('plus', 16)} Thêm khối (hoặc gõ “/” ở dòng trống)</button>
            <div class="quiz-box" id="quiz-box"></div>
            <div class="chips" style="justify-content:flex-end;margin-top:24px"><span class="small muted">${isPub ? 'Bấm “Cập nhật” để lưu thay đổi và xem trang xác nhận.' : 'Đăng bài sẽ chuyển sang trang xác nhận.'}</span>
              ${isPub ? '' : '<button class="btn btn-secondary" data-proxy="save-draft">Lưu bản nháp</button>'}<button class="btn" data-proxy="publish">${isPub ? 'Cập nhật' : 'Đăng bài'} ${icon('arrow', 18)}</button></div>
          </div>
        </div>
        <aside class="settings">
          <h2 class="h4">Thiết lập bài viết</h2>
          <label class="field">Danh mục<select id="s-category">${catOptions(a.category)}</select></label>
          <label class="field">Độ tuổi của bé<select id="s-age">${ageOptions(a.age_group)}</select></label>
          <label class="field">Lộ trình đọc<select id="s-path"><option value="">Không thuộc lộ trình</option>${paths.map((p) => `<option value="${p.id}" ${String(a.path_id) === String(p.id) ? 'selected' : ''}>${esc(p.title)}</option>`).join('')}</select></label>
          <label class="field" id="pos-wrap">Vị trí trong lộ trình<select id="s-pos"></select></label>
          <label class="field">Nguồn tham khảo<input id="s-source" list="src-list" value="${esc(a.source_name)}" placeholder="WHO, UNICEF, Bộ Y tế…"><datalist id="src-list"><option value="WHO"><option value="UNICEF"><option value="Bộ Y tế"><option value="Bộ Y tế – Chương trình Tiêm chủng mở rộng"></datalist></label>
          <label class="field">Link tài liệu gốc<input id="s-url" type="url" value="${esc(a.source_url)}" placeholder="https://"></label>
          <label class="field">Người / đơn vị thẩm định<input id="s-reviewer" value="${esc(a.reviewer)}" placeholder="VD: Ban biên tập BabyTogether"></label>
          <label class="field">Đường dẫn (slug)<input id="s-slug" value="${esc(a.slug)}" placeholder="tự tạo từ tiêu đề"></label>
          <label style="display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:500">Đánh dấu nổi bật<span class="switch"><input type="checkbox" id="s-featured" ${a.featured ? 'checked' : ''}><span></span></span></label>
          <div class="msg ${isPub ? 'success' : 'info'}" style="font-size:13px">${isPub ? '<b>Đang hiển thị</b> với người dùng.' : '<b>Bản nháp:</b> chỉ quản trị viên xem được. Bấm “Đăng bài” để hiển thị cho người dùng.'}</div>
        </aside>
      </div>`;

    const $ = (x) => document.getElementById(x);
    const rte = $('rte'), src = $('src');
    rte.innerHTML = a.content || '<p><br></p>';
    const lockEmbeds = () => rte.querySelectorAll('.video-embed').forEach((e) => { e.contentEditable = 'false'; });
    lockEmbeds();
    try { document.execCommand('styleWithCSS', false, true); document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (_) { /* */ }
    const autosize = (t) => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; };
    [$('title'), $('summary')].forEach((t) => { autosize(t); t.addEventListener('input', () => autosize(t)); });

    // ảnh bìa
    function paintCover() { const ca = $('cover-area'); ca.classList.toggle('empty', !coverImg); ca.style.backgroundImage = coverImg ? `url("${coverImg.replace(/"/g, '%22')}")` : ''; $('cover-label').textContent = coverImg ? 'Đổi ảnh bìa' : 'Thêm ảnh bìa'; $('cover-rm').hidden = !coverImg; }
    paintCover();
    $('cover-up').onclick = () => $('cover-file').click();
    $('cover-file').onchange = async (e) => { try { coverImg = await compressImage(e.target.files[0], 1600, 0.8); paintCover(); markDirty(); } catch (ex) { toast(ex.message, true); } e.target.value = ''; };
    $('cover-rm').onclick = () => { coverImg = ''; paintCover(); markDirty(); };
    $('cover-url').onclick = () => modal({ title: 'Ảnh bìa từ đường dẫn', submitText: 'Dùng ảnh này', html: '<label class="field">Link ảnh (https://…)<input name="u" type="url" required placeholder="https://"></label>',
      onSubmit: async (f) => { if (!/^https?:\/\//i.test(f.u.value)) throw new Error('Link ảnh phải bắt đầu bằng http(s)://'); coverImg = f.u.value.trim(); paintCover(); markDirty(); } });

    // vị trí trong lộ trình
    function paintPos() {
      const pid = $('s-path').value; $('pos-wrap').hidden = !pid; if (!pid) return;
      const p = paths.find((x) => String(x.id) === pid); const others = p.articles.filter((x) => x.id !== Number(id));
      const n = others.length + 1; const cur = String(a.path_id) === pid && a.path_position ? Number(a.path_position) : n;
      $('s-pos').innerHTML = [...Array(n)].map((_, i) => `<option value="${i + 1}" ${i + 1 === cur ? 'selected' : ''}>Bước ${i + 1} / ${n}${others[i] ? ' – trước “' + esc(others[i].title.slice(0, 28)) + '…”' : ' – cuối lộ trình'}</option>`).join('');
    }
    paintPos(); $('s-path').onchange = () => { paintPos(); markDirty(); };

    // quiz
    function paintQuiz() {
      $('quiz-box').innerHTML = quiz ? `<span class="ib lg white">${icon('game', 26)}</span><div class="t"><b class="h4">${esc(quiz.title)}</b><div class="small muted">${quiz.questions} câu hỏi · gắn với bài viết này</div></div><button class="btn btn-ghost" id="go-quiz">${icon('pen', 16)} Sửa quiz</button>`
        : `<span class="ib lg white">${icon('quiz', 26)}</span><div class="t"><b class="h4">Quiz cho bài viết (không bắt buộc)</b><div class="small muted">Bài viết chưa có quiz. Thêm vài câu hỏi để ba mẹ ôn lại kiến thức và ghi điểm.</div></div><button class="btn" id="go-quiz">Tạo quiz cho bài viết ${icon('arrow', 18)}</button>`;
      $('go-quiz').onclick = async () => {
        const saved = await save(isPub ? 'published' : 'draft', true); if (!saved) return;
        location.hash = quiz ? `#quiz/${quiz.id}?article=${saved.id}` : `#quiz/new?article=${saved.id}`;
      };
    }
    paintQuiz();

    // ----- autosave cục bộ -----
    const AKEY = 'bt_ed_' + (id || 'new');
    let atimer;
    function markDirty() { dirty = true; $('save-state').innerHTML = `${icon('cloud', 16)} Có thay đổi chưa lưu`; clearTimeout(atimer); atimer = setTimeout(localSave, 1200); }
    function localSave() { try { localStorage.setItem(AKEY, JSON.stringify({ t: Date.now(), title: $('title').value, summary: $('summary').value, content: rte.innerHTML })); $('save-state').innerHTML = `${icon('cloud', 16)} Đã lưu tạm trên máy lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`; } catch (_) { /* ảnh lớn có thể vượt dung lượng */ } }
    try {
      const sv = JSON.parse(localStorage.getItem(AKEY) || 'null');
      const serverT = id ? Date.parse(String(a.updated_at).replace(' ', 'T') + 'Z') : 0;
      if (sv && sv.t > serverT && (sv.title || sv.content.replace(/<[^>]+>/g, '').trim())) {
        $('restore').innerHTML = `<div class="msg info" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span>Có bản đang soạn dở chưa lưu (lúc ${new Date(sv.t).toLocaleString('vi-VN')}). Khôi phục?</span><span class="chips"><button class="btn btn-sm" id="rs-yes">Khôi phục</button><button class="btn btn-ghost btn-sm" id="rs-no">Bỏ qua</button></span></div>`;
        $('rs-yes').onclick = () => { $('title').value = sv.title; $('summary').value = sv.summary; rte.innerHTML = sv.content; lockEmbeds(); autosize($('title')); autosize($('summary')); $('restore').innerHTML = ''; markDirty(); };
        $('rs-no').onclick = () => { localStorage.removeItem(AKEY); $('restore').innerHTML = ''; };
      }
    } catch (_) { /* */ }
    main.querySelector('.editor-cols').addEventListener('input', markDirty);
    main.querySelector('.editor-cols').addEventListener('change', markDirty);

    // ----- lựa chọn văn bản -----
    let savedRange = null;
    document.addEventListener('selectionchange', () => { const s = getSelection(); if (s.rangeCount && rte.contains(s.anchorNode)) savedRange = s.getRangeAt(0).cloneRange(); });
    function restoreSel() { rte.focus(); if (savedRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(savedRange); } }
    function exec(cmd, val) { restoreSel(); document.execCommand(cmd, false, val); markDirty(); syncToolbar(); }
    function syncToolbar() {
      $('tb').querySelectorAll('[data-cmd]').forEach((b) => { try { b.classList.toggle('on', ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'].includes(b.dataset.cmd) && document.queryCommandState(b.dataset.cmd)); } catch (_) { /* */ } });
      try { const fb = (document.queryCommandValue('formatBlock') || 'p').toUpperCase(); $('tb-block').value = ['H2', 'H3', 'BLOCKQUOTE'].includes(fb) ? fb : 'P'; } catch (_) { /* */ }
    }
    rte.addEventListener('keyup', syncToolbar); rte.addEventListener('mouseup', syncToolbar);
    $('tb').addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
    $('tb').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (srcMode && b.id !== 'tb-src') { toast('Hãy tắt chế độ mã HTML trước.'); return; }
      if (b.dataset.cmd) exec(b.dataset.cmd);
      if (b.dataset.ins) insertBlock(b.dataset.ins);
      if (b.dataset.act === 'link') {
        const sel = getSelection(); const hasText = savedRange && !savedRange.collapsed;
        modal({ title: 'Chèn liên kết', submitText: 'Chèn', html: `<label class="field">Đường dẫn<input name="u" type="url" required placeholder="https://"></label>${hasText ? '' : '<label class="field">Chữ hiển thị<input name="t" required></label>'}`,
          onSubmit: async (f) => { if (!/^https?:\/\//i.test(f.u.value)) throw new Error('Đường dẫn phải bắt đầu bằng http(s)://'); if (hasText) exec('createLink', f.u.value); else exec('insertHTML', `<a href="${esc(f.u.value)}">${esc(f.t.value)}</a>&nbsp;`); } });
        void sel;
      }
    });
    $('tb-block').onchange = (e) => exec('formatBlock', '<' + e.target.value + '>');
    $('tb-font').onchange = (e) => { if (e.target.value) exec('fontName', e.target.value); else exec('removeFormat'); e.target.value = ''; };
    $('tb-size').onchange = (e) => {
      const px = e.target.value; e.target.value = ''; if (!px) return;
      exec('fontSize', '7');
      rte.querySelectorAll('font[size="7"], span[style*="xxx-large"]').forEach((el) => {
        if (el.tagName === 'FONT') { const s = document.createElement('span'); s.style.fontSize = px + 'px'; s.append(...el.childNodes); el.replaceWith(s); } else el.style.fontSize = px + 'px';
      });
    };
    // màu chữ / nền
    $('tb-color').onclick = (e) => {
      e.stopPropagation(); closePops();
      const TEXT = [['#06344B', 'Xanh đậm'], ['#0076A5', 'Xanh'], ['#09B7EE', 'Xanh sáng'], ['#5B6F7C', 'Xám'], ['#D13B2E', 'Đỏ'], ['#E8890C', 'Cam'], ['#12A16B', 'Xanh lá'], ['#7C3AED', 'Tím'], ['#000000', 'Đen']];
      const BG = [['transparent', 'Không nền'], ['#F0FAFF', 'Xanh rất nhạt'], ['#DFF5FF', 'Xanh nhạt'], ['#B8ECFF', 'Xanh'], ['#FFF4E2', 'Cam nhạt'], ['#FDECEA', 'Đỏ nhạt'], ['#E6F7EF', 'Xanh lá nhạt'], ['#FFF3B0', 'Vàng']];
      const pop = document.createElement('div'); pop.className = 'pop color-pop';
      pop.innerHTML = `<span class="label" style="color:var(--n-600)">Màu chữ</span><div class="swatches">${TEXT.map(([c, n]) => `<button type="button" title="${n}" data-fc="${c}" style="background:${c}"></button>`).join('')}</div>
        <span class="label" style="color:var(--n-600)">Màu nền chữ</span><div class="swatches">${BG.map(([c, n]) => `<button type="button" title="${n}" data-bc="${c}" style="background:${c === 'transparent' ? 'repeating-linear-gradient(45deg,#fff,#fff 4px,#E3EBF0 4px,#E3EBF0 8px)' : c}"></button>`).join('')}</div>`;
      const r = b2r($('tb-color'), $('tb')); pop.style.left = r.left + 'px'; pop.style.top = r.top + 'px';
      $('tb').appendChild(pop);
      pop.addEventListener('mousedown', (ev) => ev.preventDefault());
      pop.onclick = (ev) => { const s = ev.target.closest('button'); if (!s) return; if (s.dataset.fc) { exec('foreColor', s.dataset.fc); $('color-bar').style.background = s.dataset.fc; } else exec('hiliteColor', s.dataset.bc); pop.remove(); };
    };
    function b2r(el, parent) { const a1 = el.getBoundingClientRect(), p = parent.getBoundingClientRect(); return { left: a1.left - p.left, top: a1.bottom - p.top + 6 }; }
    function closePops() { document.querySelectorAll('.pop').forEach((p) => p.remove()); slashOpen = false; }
    document.addEventListener('click', (e) => { if (!e.target.closest('.pop') && !e.target.closest('#tb-color') && !e.target.closest('#add-block')) closePops(); });

    // chèn khối
    function insertBlock(type) {
      restoreSel();
      const H = (h) => { document.execCommand('insertHTML', false, h); lockEmbeds(); markDirty(); };
      if (type === 'p') exec('formatBlock', '<P>');
      else if (type === 'h2') exec('formatBlock', '<H2>');
      else if (type === 'h3') exec('formatBlock', '<H3>');
      else if (type === 'quote') exec('formatBlock', '<BLOCKQUOTE>');
      else if (type === 'ul') exec('insertUnorderedList');
      else if (type === 'ol') exec('insertOrderedList');
      else if (type === 'divider') H('<hr><p><br></p>');
      else if (type.startsWith('callout')) { const k = type.split('-')[1] || 'info'; H(`<div class="callout ${k}"><p>${k === 'warning' ? '<b>Lưu ý:</b> ' : k === 'success' ? '<b>Mẹo:</b> ' : ''}Nội dung…</p></div><p><br></p>`); }
      else if (type === 'image') {
        let data = '';
        const f = modal({ title: 'Chèn hình ảnh', submitText: 'Chèn ảnh', html: `<label class="field">Tải ảnh lên<input type="file" name="file" accept="image/*"></label><label class="field">Hoặc dán link ảnh<input name="u" type="url" placeholder="https://"></label>
          <img id="pv" hidden alt="" style="max-height:200px;border-radius:14px;object-fit:contain"><label class="field">Mô tả ảnh (alt)<input name="alt" placeholder="VD: Mẹ bế bé da kề da"></label><label class="field">Chú thích (không bắt buộc)<input name="cap"></label>`,
          onSubmit: async (x) => { const s = data || x.u.value.trim(); if (!s) throw new Error('Hãy chọn ảnh hoặc dán link ảnh.'); if (!data && !/^https?:\/\//i.test(s)) throw new Error('Link ảnh phải bắt đầu bằng http(s)://');
            restoreSel(); H(`<figure><img src="${esc(s)}" alt="${esc(x.alt.value)}">${x.cap.value ? `<figcaption>${esc(x.cap.value)}</figcaption>` : ''}</figure><p><br></p>`); } });
        f.file.onchange = async () => { try { data = await compressImage(f.file.files[0], 1400, 0.78); const pv = f.querySelector('#pv'); pv.src = data; pv.hidden = false; } catch (ex) { toast(ex.message, true); } };
      } else if (type === 'video') {
        modal({ title: 'Chèn video', submitText: 'Chèn video', html: `<label class="field">Link YouTube, Vimeo hoặc file .mp4<input name="u" required placeholder="https://www.youtube.com/watch?v=…"></label><p class="small muted" style="margin:0">Video được nhúng từ YouTube/Vimeo nên không làm nặng cơ sở dữ liệu.</p>`,
          onSubmit: async (x) => { const h = videoEmbed(x.u.value); if (!h) throw new Error('Link chưa đúng. Hãy dùng link YouTube, Vimeo hoặc file .mp4.'); restoreSel(); H(h + '<p><br></p>'); } });
      }
    }
    // menu "/"
    const SLASH = [['p', 'type', 'Văn bản', 'Đoạn văn thường'], ['h2', 'type', 'Tiêu đề lớn', 'Tiêu đề mục'], ['h3', 'type', 'Tiêu đề nhỏ', 'Tiêu đề phụ'], ['ul', 'list', 'Danh sách', 'Gạch đầu dòng'], ['ol', 'ol', 'Danh sách số', 'Các bước theo thứ tự'], ['quote', 'quote', 'Trích dẫn', 'Ghi chú, lời khuyên'],
      ['callout-info', 'info', 'Ô thông tin', 'Khung nền xanh'], ['callout-warning', 'alert', 'Ô lưu ý', 'Cảnh báo nổi bật'], ['callout-danger', 'alert', 'Ô nguy hiểm', 'Dấu hiệu cần đi khám'], ['callout-success', 'check', 'Ô mẹo hay', 'Mẹo cho ba mẹ'],
      ['image', 'image', 'Hình ảnh', 'Tải ảnh lên hoặc dán link'], ['video', 'video', 'Video', 'YouTube, Vimeo, .mp4'], ['divider', 'minus', 'Đường kẻ', 'Phân cách nội dung']];
    let slashOpen = false, slashSel = 0, slashItems = [], slashBlock = null;
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    function openSlash(anchorRect, filter) {
      closePops();
      slashItems = SLASH.filter((x) => !filter || norm(x[2] + ' ' + x[3] + ' ' + x[0]).includes(norm(filter)));
      if (!slashItems.length) return;
      slashSel = 0; slashOpen = true;
      const pop = document.createElement('div'); pop.className = 'pop slash'; pop.id = 'slash';
      const c = main.querySelector('.canvas').getBoundingClientRect();
      pop.style.left = Math.max(8, anchorRect.left - c.left) + 'px'; pop.style.top = (anchorRect.bottom - c.top + 6) + 'px';
      main.querySelector('.canvas').appendChild(pop); paintSlash();
      pop.addEventListener('mousedown', (e) => e.preventDefault());
      pop.onclick = (e) => { const b = e.target.closest('[data-i]'); if (b) chooseSlash(Number(b.dataset.i)); };
    }
    function paintSlash() { const p = $('slash'); if (!p) return; p.innerHTML = '<span class="label" style="padding:6px 8px;color:var(--n-600)">Khối nội dung</span>' + slashItems.map(([, ic, t, d], i) => `<button type="button" data-i="${i}" class="${i === slashSel ? 'on' : ''}"><span class="ib">${icon(ic, 18)}</span><span><b>${t}</b><span class="d">${d}</span></span></button>`).join(''); const on = p.querySelector('.on'); if (on) on.scrollIntoView({ block: 'nearest' }); }
    function chooseSlash(i) {
      const item = slashItems[i]; closePops(); if (!item) return;
      if (slashBlock && rte.contains(slashBlock)) {
        slashBlock.innerHTML = '<br>';
        const r = document.createRange(); r.setStart(slashBlock, 0); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); savedRange = r.cloneRange();
      }
      insertBlock(item[0]);
    }
    function currentBlock() { const s = getSelection(); if (!s.rangeCount) return null; let n = s.anchorNode; while (n && n !== rte && !(n.nodeType === 1 && /^(P|H2|H3|DIV|LI|BLOCKQUOTE)$/.test(n.tagName))) n = n.parentNode; return n === rte ? null : n; }
    rte.addEventListener('input', () => {
      const blk = currentBlock(); const txt = blk ? blk.textContent : (rte.textContent.length < 25 ? rte.textContent : '');
      if (/^\/(?!\s)[^/]{0,24}$/.test(txt)) {
        if (!blk) { document.execCommand('formatBlock', false, '<P>'); }
        slashBlock = currentBlock();
        const s = getSelection(); const rect = s.rangeCount ? s.getRangeAt(0).getBoundingClientRect() : rte.getBoundingClientRect();
        const rr = rect.bottom ? rect : (slashBlock || rte).getBoundingClientRect();
        openSlash(rr, txt.slice(1));
      } else if (slashOpen) closePops();
    });
    rte.addEventListener('keydown', (e) => {
      if (!slashOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); slashSel = (slashSel + 1) % slashItems.length; paintSlash(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); slashSel = (slashSel - 1 + slashItems.length) % slashItems.length; paintSlash(); }
      else if (e.key === 'Enter') { e.preventDefault(); chooseSlash(slashSel); }
      else if (e.key === 'Escape') { closePops(); }
    });
    $('add-block').onclick = (e) => {
      e.stopPropagation();
      rte.focus(); const r = document.createRange(); r.selectNodeContents(rte); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      document.execCommand('insertHTML', false, '<p><br></p>'); savedRange = getSelection().getRangeAt(0).cloneRange(); slashBlock = currentBlock();
      openSlash($('add-block').getBoundingClientRect(), '');
      const p = $('slash'); if (p) { const c = main.querySelector('.canvas').getBoundingClientRect(), b = $('add-block').getBoundingClientRect(); p.style.top = (b.top - c.top - p.offsetHeight - 6) + 'px'; }
    };
    rte.addEventListener('paste', (e) => {
      const html = e.clipboardData.getData('text/html'), text = e.clipboardData.getData('text/plain');
      const v = videoEmbed(text); e.preventDefault();
      if (!html && v && text.trim().split(/\s+/).length === 1) { document.execCommand('insertHTML', false, v + '<p><br></p>'); lockEmbeds(); }
      else if (html) document.execCommand('insertHTML', false, cleanPaste(html));
      else document.execCommand('insertHTML', false, text.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join(''));
      markDirty();
    });
    rte.addEventListener('click', (e) => { const v = e.target.closest('.video-embed'); if (v && confirm('Xóa video này?')) { v.remove(); markDirty(); } });
    // chế độ HTML
    let srcMode = false;
    $('tb-src').onclick = () => { srcMode = !srcMode; $('tb-src').classList.toggle('on', srcMode);
      if (srcMode) { src.value = rte.innerHTML.replace(/<\/(p|h2|h3|ul|ol|li|blockquote|figure|div)>/gi, (m) => m + '\n'); src.hidden = false; rte.hidden = true; }
      else { rte.innerHTML = src.value; lockEmbeds(); src.hidden = true; rte.hidden = false; markDirty(); } };

    function collect(status) {
      if (srcMode) { rte.innerHTML = src.value; lockEmbeds(); }
      const content = rte.innerHTML.replace(/ contenteditable="false"/g, '');
      return { title: $('title').value.trim(), summary: $('summary').value.trim(), content, category: $('s-category').value, age_group: $('s-age').value,
        slug: $('s-slug').value.trim(), cover_image: coverImg, source_name: $('s-source').value.trim(), source_url: $('s-url').value.trim(), reviewer: $('s-reviewer').value.trim(),
        featured: $('s-featured').checked, path_id: $('s-path').value, path_position: $('s-pos').value, status };
    }
    async function save(status, quiet) {
      const body = collect(status);
      if (!body.title) { toast('Vui lòng nhập tiêu đề bài viết.', true); $('title').focus(); return null; }
      if (status === 'published' && !body.content.replace(/<[^>]+>/g, '').trim() && !/<(img|iframe|video)/.test(body.content)) { toast('Bài viết chưa có nội dung.', true); rte.focus(); return null; }
      main.querySelectorAll('.action-bar .btn, [data-proxy]').forEach((b) => { b.disabled = true; });
      try {
        const r = id ? await api('/api/admin/articles/' + id, { method: 'PUT', body }) : await api('/api/admin/articles', { method: 'POST', body });
        dirty = false; try { localStorage.removeItem(AKEY); } catch (_) { /* */ }
        pathsCache = null;
        if (!quiet) toast(status === 'published' ? 'Đã lưu bài viết' : 'Đã lưu bản nháp');
        return r;
      } catch (ex) { toast(ex.message, true); return null; }
      finally { main.querySelectorAll('.action-bar .btn, [data-proxy]').forEach((b) => { b.disabled = false; }); }
    }
    const on = (x, fn) => { const el = $(x); if (el) el.onclick = fn; };
    on('save-draft', async () => { const r = await save('draft'); if (r && !id) location.hash = '#editor/' + r.id; else if (r) viewEditor(r.id); });
    on('to-draft', async () => { if (!confirm('Chuyển bài về bản nháp? Người dùng sẽ không thấy bài này nữa.')) return; const r = await save('draft'); if (r) location.hash = `#done?article=${r.id}`; });
    on('publish', async () => { const r = await save('published', true); if (r) location.hash = `#done?article=${r.id}${isPub ? '&updated=1' : ''}`; });
    on('discard', () => { if (!dirty || confirm('Bỏ các thay đổi chưa lưu?')) { dirty = false; try { localStorage.removeItem(AKEY); } catch (_) { /* */ } viewEditor(id); } });
    on('preview', () => { const b = collect(a.status); const f = modal({ title: 'Xem trước bài viết', cancelText: 'Đóng',
      html: `${coverImg ? `<div class="cover" style="aspect-ratio:16/6;border-radius:20px"><img src="${esc(coverImg)}" alt=""></div>` : ''}<h1 class="h1">${esc(b.title || 'Chưa có tiêu đề')}</h1>${b.summary ? `<p class="lead">${esc(b.summary)}</p>` : ''}<div class="article-body">${b.content}</div>` }); wideModal(f); });
    main.querySelectorAll('[data-proxy]').forEach((b) => b.onclick = () => $(b.dataset.proxy).click());
  }

  // =====================================================================
  // QUIZ & GAME: danh sách
  // =====================================================================
  async function viewQuizzes() {
    const r = await api('/api/admin/quizzes');
    main.innerHTML = `<div class="adm-head"><div><h1>Quiz & game</h1><p class="muted" style="margin:4px 0 0">${r.items.length} game · Game có thể gắn với một bài viết hoặc đứng riêng.</p></div><a class="btn" href="#quiz/new">${icon('plus', 18)} Tạo game mới</a></div>
      <div class="table"><table><thead><tr><th>Game</th><th>Bài viết liên kết</th><th>Số câu</th><th>Thiết lập</th><th>Trạng thái</th><th>Cập nhật</th><th style="text-align:right">Thao tác</th></tr></thead><tbody>
      ${r.items.map((q) => `<tr><td><div class="t-title"><span class="ib">${icon('game', 22)}</span><b>${esc(q.title)}</b></div></td><td>${q.article_title ? `<a class="link" href="#editor/${q.article_id}">${esc(q.article_title)}</a>` : '<span class="muted">Không gắn bài</span>'}</td>
        <td>${q.questions}</td><td class="small muted">${q.time_per_question}s/câu · ${q.points_per_question} điểm/câu</td><td>${statusTag(q.status)}</td><td>${fmtDate(q.updated_at)}</td>
        <td><div class="row-actions"><a class="mini-btn" href="#quiz/${q.id}">${icon('pen', 14)} Sửa</a><a class="mini-btn icon" href="/choi-hoc?quiz=${q.id}" target="_blank" title="Chơi thử">${icon('eye', 16)}</a><button class="mini-btn del" data-del="${q.id}" data-t="${esc(q.title)}">${icon('trash', 14)} Xóa</button></div></td></tr>`).join('') || '<tr><td colspan="7"><div class="empty" style="border:0">Chưa có game nào.</div></td></tr>'}
      </tbody></table></div>`;
    main.querySelector('table').onclick = (e) => { const d = e.target.closest('[data-del]'); if (!d) return;
      modal({ title: 'Xóa game này?', submitText: 'Xóa game', danger: true, html: `<p class="muted" style="margin:0">“${esc(d.dataset.t)}” và toàn bộ câu hỏi sẽ bị xóa.</p>`, onSubmit: async () => { await api('/api/admin/quizzes/' + d.dataset.del, { method: 'DELETE' }); toast('Đã xóa game'); viewQuizzes(); } }); };
  }

  // =====================================================================
  // A4 · TẠO / SỬA QUIZ
  // =====================================================================
  async function viewQuiz(id, params) {
    const arts = (await api('/api/admin/articles')).items;
    const blankQ = (cat) => ({ question: '', options: ['', '', '', ''], correct_index: null, explanation: '', source: '', category: cat || 'baby-care' });
    let q;
    if (id && id !== 'new') { const r = await api('/api/admin/quizzes/' + id); q = { ...r.quiz, questions: r.questions.map((x) => ({ question: x.question, options: x.options, correct_index: x.correct_index, explanation: x.explanation, source: x.source, category: x.category })) }; }
    else {
      const aid = Number(params.get('article')) || null; const art = arts.find((x) => x.id === aid);
      q = { title: art ? 'Quiz: ' + art.title : '', description: '', article_id: aid, time_per_question: 45, points_per_question: 10, status: 'published', questions: [blankQ(art && art.category)] };
    }
    const isNew = !id || id === 'new';
    const art = () => arts.find((x) => x.id === Number(q.article_id));
    main.innerHTML = `<div class="adm-head"><div style="display:flex;flex-direction:column;gap:6px">${q.article_id ? `<a class="link small" href="#editor/${q.article_id}">${icon('back', 14)} Quay lại bài viết</a>` : '<a class="link small" href="#quizzes">' + icon('back', 14) + ' Quiz & game</a>'}
        <h1>${isNew ? 'Tạo quiz' : 'Sửa quiz'}</h1><p class="muted" style="margin:0">Thêm câu hỏi, nhập đáp án (2–6 đáp án mỗi câu) và chọn đáp án đúng nhất.</p></div></div>
      <div class="qb-card"><div class="form-grid">
        <label class="field full">Tên game<input id="q-title" maxlength="200" value="${esc(q.title)}" placeholder="VD: Quiz chăm sóc rốn cho bé"></label>
        <label class="field">Bài viết liên kết<select id="q-article"><option value="">Không gắn bài viết</option>${arts.map((x) => `<option value="${x.id}" ${x.id === Number(q.article_id) ? 'selected' : ''}>${esc(x.title)}${x.status === 'draft' ? ' (nháp)' : ''}</option>`).join('')}</select></label>
        <label class="field">Thời gian mỗi câu<select id="q-time">${[20, 30, 45, 60, 90, 120].map((n) => `<option value="${n}" ${n === Number(q.time_per_question) ? 'selected' : ''}>${n} giây</option>`).join('')}</select></label>
        <label class="field">Điểm mỗi câu đúng<input id="q-points" type="number" min="1" max="100" value="${Number(q.points_per_question) || 10}"></label>
        <label class="field">Trạng thái<select id="q-status"><option value="published" ${q.status !== 'draft' ? 'selected' : ''}>Hiển thị cho người dùng</option><option value="draft" ${q.status === 'draft' ? 'selected' : ''}>Bản nháp (ẩn)</option></select></label>
        <label class="field full">Mô tả ngắn (không bắt buộc)<input id="q-desc" maxlength="500" value="${esc(q.description || '')}"></label>
      </div></div>
      <div id="qs" style="display:flex;flex-direction:column;gap:16px"></div>
      <button class="dashed-btn" id="add-q" style="padding:20px">${icon('plus', 20)} Thêm câu hỏi</button>
      <div class="qb-bottom"><span id="q-sum"></span><div class="chips"><button class="btn btn-ghost" id="q-draft" style="color:#fff;border-color:var(--sky-700)">Lưu nháp</button><button class="btn btn-secondary" id="q-save">${icon('game', 18)} ${isNew ? 'Tạo game' : 'Cập nhật game'}</button></div></div>`;
    const $ = (x) => document.getElementById(x);
    ['q-title', 'q-desc'].forEach((k) => $(k).oninput = (e) => { q[k === 'q-title' ? 'title' : 'description'] = e.target.value; dirty = true; });
    $('q-article').onchange = (e) => { q.article_id = e.target.value ? Number(e.target.value) : null; const a1 = art(); if (a1 && !q.title) { q.title = 'Quiz: ' + a1.title; $('q-title').value = q.title; } dirty = true; };
    $('q-time').onchange = (e) => { q.time_per_question = Number(e.target.value); paintSum(); dirty = true; };
    $('q-points').oninput = (e) => { q.points_per_question = Number(e.target.value); paintSum(); dirty = true; };
    $('q-status').onchange = (e) => { q.status = e.target.value; dirty = true; };
    function paintSum() { $('q-sum').innerHTML = `<b>${q.questions.length} câu hỏi</b> · tối đa ${q.questions.length * (Number(q.points_per_question) || 0)} điểm · ${q.time_per_question} giây/câu`; }
    function paint() {
      $('qs').innerHTML = q.questions.map((x, i) => `<div class="qb-card" data-q="${i}">
        <div class="qb-head"><span class="qb-num"><i>${i + 1}</i> Câu ${i + 1}</span><div class="chips">
          <select data-f="category" class="select-pill" style="padding-top:6px;padding-bottom:6px" aria-label="Chủ đề">${Object.entries(CAT_SHORT).map(([k, v]) => `<option value="${k}" ${k === x.category ? 'selected' : ''}>${v}</option>`).join('')}</select>
          <button class="mini-btn icon" data-act="up" title="Lên" ${i === 0 ? 'disabled' : ''}>${icon('up', 16)}</button><button class="mini-btn icon" data-act="down" title="Xuống" ${i === q.questions.length - 1 ? 'disabled' : ''}>${icon('down', 16)}</button>
          <button class="mini-btn icon" data-act="dup" title="Nhân bản">${icon('dup', 16)}</button><button class="mini-btn icon del" data-act="del" title="Xóa câu hỏi" ${q.questions.length === 1 ? 'disabled' : ''}>${icon('trash', 16)}</button></div></div>
        <label class="field">Nội dung câu hỏi<textarea data-f="question" rows="2" maxlength="500" placeholder="VD: Khi chăm sóc rốn cho trẻ sơ sinh, cần lưu ý điều gì?">${esc(x.question)}</textarea></label>
        <div style="display:flex;justify-content:space-between;align-items:center"><span class="small" style="font-weight:500">Đáp án <span class="muted">(chọn ô tròn ở đáp án đúng nhất)</span></span><span class="small muted">${x.options.length}/6</span></div>
        <div style="display:flex;flex-direction:column;gap:8px">${x.options.map((o, j) => `<div class="ans ${x.correct_index === j ? 'correct' : ''}"><input type="radio" name="c${i}" data-correct="${j}" ${x.correct_index === j ? 'checked' : ''} aria-label="Đáp án đúng ${LETTERS[j]}"><span class="letter">${LETTERS[j]}</span>
          <input type="text" data-opt="${j}" maxlength="300" value="${esc(o)}" placeholder="Nhập đáp án ${LETTERS[j]}">${x.correct_index === j ? '<span class="ok-tag">✓ Đáp án đúng</span>' : ''}
          <button class="mini-btn icon" data-act="rm-opt" data-j="${j}" title="Xóa đáp án" ${x.options.length <= 2 ? 'disabled' : ''} style="border:0">${icon('x', 14)}</button></div>`).join('')}</div>
        ${x.options.length < 6 ? `<button class="link small" data-act="add-opt" style="background:none;border:0;padding:0;align-self:flex-start">${icon('plus', 14)} Thêm đáp án</button>` : ''}
        <div class="form-grid"><label class="field">Giải thích đáp án<textarea data-f="explanation" rows="2" maxlength="1000" placeholder="Vì sao đáp án này đúng?">${esc(x.explanation)}</textarea></label><label class="field">Nguồn<input data-f="source" maxlength="200" value="${esc(x.source)}" placeholder="WHO, Bộ Y tế…"></label></div>
      </div>`).join('');
      paintSum();
    }
    paint();
    $('qs').addEventListener('input', (e) => {
      const card = e.target.closest('[data-q]'); if (!card) return; const x = q.questions[Number(card.dataset.q)]; dirty = true;
      if (e.target.dataset.f) x[e.target.dataset.f] = e.target.value;
      if (e.target.dataset.opt != null) x.options[Number(e.target.dataset.opt)] = e.target.value;
      card.classList.remove('invalid');
    });
    $('qs').addEventListener('change', (e) => {
      const card = e.target.closest('[data-q]'); if (!card) return; const x = q.questions[Number(card.dataset.q)];
      if (e.target.dataset.correct != null) { x.correct_index = Number(e.target.dataset.correct); paint(); dirty = true; }
      if (e.target.dataset.f === 'category') x.category = e.target.value;
    });
    $('qs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return; const i = Number(b.closest('[data-q]').dataset.q); const x = q.questions[i]; dirty = true;
      const act = b.dataset.act;
      if (act === 'add-opt' && x.options.length < 6) x.options.push('');
      if (act === 'rm-opt' && x.options.length > 2) { const j = Number(b.dataset.j); x.options.splice(j, 1); if (x.correct_index === j) x.correct_index = null; else if (x.correct_index > j) x.correct_index--; }
      if (act === 'up' && i > 0) [q.questions[i - 1], q.questions[i]] = [q.questions[i], q.questions[i - 1]];
      if (act === 'down' && i < q.questions.length - 1) [q.questions[i + 1], q.questions[i]] = [q.questions[i], q.questions[i + 1]];
      if (act === 'dup') q.questions.splice(i + 1, 0, JSON.parse(JSON.stringify(x)));
      if (act === 'del' && q.questions.length > 1) { if (!confirm(`Xóa câu ${i + 1}?`)) return; q.questions.splice(i, 1); }
      paint();
    });
    $('add-q').onclick = () => { q.questions.push(blankQ(q.questions[q.questions.length - 1].category)); paint(); dirty = true; const last = $('qs').lastElementChild; last.scrollIntoView({ behavior: 'smooth', block: 'center' }); last.querySelector('textarea').focus(); };
    async function submit(status) {
      q.title = $('q-title').value.trim();
      if (!q.title) { toast('Vui lòng đặt tên cho game.', true); $('q-title').focus(); return; }
      let bad = -1;
      q.questions.forEach((x, i) => { const ok = x.question.trim() && x.options.length >= 2 && x.options.every((o) => o.trim()) && x.correct_index != null && x.correct_index < x.options.length; $('qs').children[i].classList.toggle('invalid', !ok); if (!ok && bad < 0) bad = i; });
      if (bad >= 0) { toast(`Câu ${bad + 1}: hãy nhập đủ câu hỏi, đáp án và chọn đáp án đúng.`, true); $('qs').children[bad].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const body = { ...q, status, questions: q.questions.map((x) => ({ ...x, options: x.options.map((o) => o.trim()) })) };
      $('q-save').disabled = $('q-draft').disabled = true;
      try {
        const r = isNew ? await api('/api/admin/quizzes', { method: 'POST', body }) : await api('/api/admin/quizzes/' + id, { method: 'PUT', body });
        dirty = false;
        location.hash = `#done?quiz=${r.id}${q.article_id ? '&article=' + q.article_id : ''}${isNew ? '' : '&updated=1'}`;
      } catch (ex) { toast(ex.message, true); } finally { $('q-save').disabled = $('q-draft').disabled = false; }
    }
    $('q-save').onclick = () => submit($('q-status').value === 'draft' ? 'draft' : 'published');
    $('q-draft').onclick = () => submit('draft');
  }

  // =====================================================================
  // A5 · TRANG XÁC NHẬN
  // =====================================================================
  async function viewDone(params) {
    const aid = params.get('article'), qid = params.get('quiz'), updated = params.get('updated');
    let a = null, aq = null, q = null;
    if (aid) { try { const r = await api('/api/admin/articles/' + aid); a = r.article; aq = r.quiz; } catch (_) { /* */ } }
    if (qid) { try { const r = await api('/api/admin/quizzes/' + qid); q = { ...r.quiz, questions: r.questions.length }; } catch (_) { /* */ } }
    else if (aq) { try { const r = await api('/api/admin/quizzes/' + aq.id); q = { ...r.quiz, questions: r.questions.length }; } catch (_) { /* */ } }
    let title, sub;
    if (a && a.status === 'published') { title = qid ? (updated ? 'Đã cập nhật game cho bài viết' : 'Đã đăng bài viết & tạo game') : (updated ? 'Đã cập nhật bài viết' : 'Đã đăng bài viết'); sub = 'Bài viết đã hiển thị với người dùng trong Thư viện kiến thức.'; }
    else if (a) { title = qid ? 'Đã lưu bản nháp & tạo game' : 'Đã lưu bản nháp'; sub = 'Bản nháp không hiển thị với người dùng. Bấm “Sửa bài” rồi “Đăng bài” khi sẵn sàng.'; }
    else if (q) { title = updated ? 'Đã cập nhật game' : (q.status === 'draft' ? 'Đã lưu nháp game' : 'Đã tạo game'); sub = q.status === 'draft' ? 'Game đang ẩn với người dùng.' : 'Game đã sẵn sàng trong mục Chơi & Học.'; }
    else { main.innerHTML = '<div class="empty">Không tìm thấy nội dung vừa tạo.</div>'; return; }
    const step = a && a.path_id ? (await getPaths(true)).find((p) => p.id === Number(a.path_id)) : null;
    main.innerHTML = `<div class="done-wrap">
      <span class="done-check">${icon('check', 44, 2.5)}</span>
      <div><h1 class="h1">${title}</h1><p class="lead" style="margin-top:8px">${sub}</p></div>
      ${a ? `<div class="sum-card">${cover(a.cover_image, CAT_ICON[a.category], '', 30)}<div class="t"><span class="label">Bài viết</span><b class="h4 clamp-2">${esc(a.title)}</b>
        <div class="chips">${statusTag(a.status)}<span class="tag neutral">${esc(CAT_SHORT[a.category])}</span>${step ? `<span class="tag">${icon('route', 12)} Bước ${a.path_position} · ${esc(step.title)}</span>` : ''}</div></div>
        <div class="chips" style="flex-direction:column;align-items:stretch"><a class="btn btn-sm" href="/bai-viet/${encodeURIComponent(a.slug)}" target="_blank" rel="noopener">${icon('eye', 16)} Xem bài viết</a><a class="btn btn-ghost btn-sm" href="#editor/${a.id}">${icon('pen', 16)} Sửa bài</a></div></div>` : ''}
      ${q ? `<div class="sum-card"><span class="ib xl" style="background:linear-gradient(135deg,var(--sky-400),var(--sky-700));color:#fff">${icon('game', 34)}</span><div class="t"><span class="label">Game / Quiz</span><b class="h4">${esc(q.title)}</b>
        <div class="chips">${statusTag(q.status)}<span class="tag neutral">${q.questions} câu hỏi</span><span class="tag neutral">${q.time_per_question} giây/câu</span><span class="tag neutral">+${q.points_per_question} điểm/câu</span></div></div>
        <div class="chips" style="flex-direction:column;align-items:stretch"><a class="btn btn-sm" href="/choi-hoc?quiz=${q.id}" target="_blank" rel="noopener">${icon('game', 16)} Chơi thử</a><a class="btn btn-ghost btn-sm" href="#quiz/${q.id}${a ? '?article=' + a.id : ''}">${icon('pen', 16)} Sửa quiz</a></div></div>`
        : a ? `<div class="sum-card" style="border-style:dashed;background:var(--sky-50)"><span class="ib lg white">${icon('quiz', 26)}</span><div class="t"><b class="h4">Bài viết chưa có quiz</b><span class="small muted">Không bắt buộc – bạn có thể thêm quiz bất cứ lúc nào.</span></div><a class="btn btn-sm" href="#quiz/new?article=${a.id}">Tạo quiz ${icon('arrow', 16)}</a></div>` : ''}
      <div class="chips" style="justify-content:center;margin-top:8px"><a class="btn" href="#articles">${icon('list', 18)} Về quản lý bài viết</a><a class="btn btn-secondary" href="#editor">${icon('pen', 18)} Viết bài mới</a>${q && !a ? `<a class="btn btn-ghost" href="#quizzes">Danh sách game</a>` : ''}</div>
    </div>`;
  }

  // =====================================================================
  // LỘ TRÌNH ĐỌC
  // =====================================================================
  const ICONS = [['baby', 'Em bé'], ['bottle', 'Bình sữa'], ['sprout', 'Mầm cây'], ['heart', 'Trái tim'], ['foot', 'Bàn chân'], ['syringe', 'Tiêm chủng'], ['book', 'Sách']];
  async function viewPaths() {
    const paths = await getPaths(true);
    main.innerHTML = `<div class="adm-head"><div><h1>Lộ trình đọc</h1><p class="muted" style="margin:4px 0 0">Sắp xếp bài viết theo thứ tự nên đọc. Người dùng thấy lộ trình ở Thư viện, trang bài viết hiện “Bài trước / Bài tiếp theo”.</p></div><button class="btn" id="add-path">${icon('plus', 18)} Tạo lộ trình</button></div>
      <div class="grid-2">${paths.map((p) => `<div class="qb-card"><div class="qb-head"><div style="display:flex;gap:12px;align-items:center"><span class="ib">${icon(p.icon || 'baby', 22)}</span><div><b class="h4">${esc(p.title)}</b><div class="small muted">${esc(AGES[p.age_group] || '')} · ${p.articles.length} bài · thứ tự hiển thị ${p.sort_order}</div></div></div>
        <div class="chips"><button class="mini-btn" data-edit="${p.id}">${icon('pen', 14)} Sửa</button><button class="mini-btn del" data-del="${p.id}" data-t="${esc(p.title)}">${icon('trash', 14)}</button></div></div>
        ${p.description ? `<p class="small muted" style="margin:0">${esc(p.description)}</p>` : ''}
        <ol style="margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px">${p.articles.map((x) => `<li class="small">${esc(x.title)} ${x.status === 'draft' ? '<span class="tag warn">nháp</span>' : ''}</li>`).join('') || '<li class="small muted">Chưa có bài viết</li>'}</ol></div>`).join('') || '<div class="empty">Chưa có lộ trình nào.</div>'}</div>`;
    document.getElementById('add-path').onclick = () => editPath(null);
    main.querySelector('.grid-2').onclick = (e) => {
      const ed = e.target.closest('[data-edit]'); if (ed) editPath(paths.find((p) => p.id === Number(ed.dataset.edit)));
      const d = e.target.closest('[data-del]'); if (d) modal({ title: 'Xóa lộ trình?', submitText: 'Xóa', danger: true, html: `<p class="muted" style="margin:0">Xóa “${esc(d.dataset.t)}”. Các bài viết vẫn được giữ nguyên.</p>`, onSubmit: async () => { await api('/api/admin/paths/' + d.dataset.del, { method: 'DELETE' }); viewPaths(); } });
    };
  }
  async function editPath(p) {
    const arts = (await api('/api/admin/articles')).items;
    let list = p ? p.articles.map((x) => ({ id: x.id, title: x.title })) : [];
    const f = modal({ title: p ? 'Sửa lộ trình' : 'Tạo lộ trình', submitText: p ? 'Lưu lộ trình' : 'Tạo lộ trình',
      html: `<div class="form-grid"><label class="field full">Tên lộ trình<input name="title" required maxlength="200" value="${esc(p ? p.title : '')}"></label>
        <label class="field full">Mô tả<input name="description" maxlength="500" value="${esc(p ? p.description : '')}"></label>
        <label class="field">Độ tuổi<select name="age_group">${ageOptions(p ? p.age_group : '0-6')}</select></label>
        <label class="field">Biểu tượng<select name="icon">${ICONS.map(([k, v]) => `<option value="${k}" ${p && p.icon === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        <label class="field">Thứ tự hiển thị<input name="sort_order" type="number" value="${p ? p.sort_order : 0}"></label></div>
        <span class="small" style="font-weight:500">Bài viết theo thứ tự đọc</span><div id="pl" style="display:flex;flex-direction:column;gap:8px"></div>
        <div style="display:flex;gap:8px"><select class="input" id="pl-add"><option value="">+ Thêm bài viết…</option>${arts.map((x) => `<option value="${x.id}">${esc(x.title)}</option>`).join('')}</select></div>`,
      onSubmit: async (fm) => {
        const body = { title: fm.title.value, description: fm.description.value, age_group: fm.age_group.value, icon: fm.icon.value, sort_order: fm.sort_order.value, article_ids: list.map((x) => x.id) };
        if (p) await api('/api/admin/paths/' + p.id, { method: 'PUT', body }); else await api('/api/admin/paths', { method: 'POST', body });
        toast('Đã lưu lộ trình'); viewPaths();
      } });
    wideModal(f, 680);
    const pl = f.querySelector('#pl');
    const paint = () => { pl.innerHTML = list.map((x, i) => `<div class="ans"><span class="letter">${i + 1}</span><span style="flex:1" class="small">${esc(x.title)}</span>
      <button type="button" class="mini-btn icon" data-m="up" data-i="${i}" ${i === 0 ? 'disabled' : ''}>${icon('up', 14)}</button><button type="button" class="mini-btn icon" data-m="down" data-i="${i}" ${i === list.length - 1 ? 'disabled' : ''}>${icon('down', 14)}</button><button type="button" class="mini-btn icon del" data-m="rm" data-i="${i}">${icon('x', 14)}</button></div>`).join('') || '<p class="small muted" style="margin:0">Chưa có bài viết.</p>'; };
    paint();
    pl.onclick = (e) => { const b = e.target.closest('[data-m]'); if (!b) return; const i = Number(b.dataset.i);
      if (b.dataset.m === 'up') [list[i - 1], list[i]] = [list[i], list[i - 1]]; if (b.dataset.m === 'down') [list[i + 1], list[i]] = [list[i], list[i + 1]]; if (b.dataset.m === 'rm') list.splice(i, 1); paint(); };
    f.querySelector('#pl-add').onchange = (e) => { const x = arts.find((y) => y.id === Number(e.target.value)); if (x && !list.some((y) => y.id === x.id)) list.push({ id: x.id, title: x.title }); e.target.value = ''; paint(); };
  }

  // =====================================================================
  // NHIỆM VỤ & NGƯỜI DÙNG
  // =====================================================================
  async function viewMissions() {
    const r = await api('/api/admin/missions');
    main.innerHTML = `<div class="adm-head"><div><h1>Nhiệm vụ đời thực</h1><p class="muted" style="margin:4px 0 0">Nhiệm vụ để bố mẹ cùng thực hiện và nhận điểm.</p></div><button class="btn" id="add-m">${icon('plus', 18)} Thêm nhiệm vụ</button></div>
      <div class="table"><table><thead><tr><th>Nhiệm vụ</th><th>Người tham gia</th><th>Mục tiêu</th><th>Điểm</th><th>Trạng thái</th><th style="text-align:right">Thao tác</th></tr></thead><tbody>
      ${r.items.map((m) => `<tr><td><b>${esc(m.title)}</b></td><td>${esc(m.participant)}</td><td class="small muted">${esc(m.goal)}</td><td>${m.points}</td><td>${m.active ? '<span class="tag ok">Đang dùng</span>' : '<span class="tag neutral">Tắt</span>'}</td>
        <td><div class="row-actions"><button class="mini-btn" data-edit="${m.id}">${icon('pen', 14)} Sửa</button><button class="mini-btn del" data-del="${m.id}">${icon('trash', 14)} Xóa</button></div></td></tr>`).join('')}</tbody></table></div>`;
    const edit = (m) => {
      m = m || { title: '', description: '', participant: 'Bố và mẹ', goal: '', points: 10, image: '', tag: '', active: 1 };
      let image = m.image || '';
      const f = modal({ title: m.id ? 'Sửa nhiệm vụ' : 'Thêm nhiệm vụ',
        html: `<label class="field">Tên nhiệm vụ<input name="title" required maxlength="200" value="${esc(m.title)}"></label><label class="field">Mô tả / hướng dẫn<textarea name="description" maxlength="1000">${esc(m.description)}</textarea></label>
          <div class="form-grid"><label class="field">Người tham gia<select name="participant">${['Bố', 'Mẹ', 'Bố và mẹ'].map((p) => `<option ${p === m.participant ? 'selected' : ''}>${p}</option>`).join('')}</select></label><label class="field">Điểm thưởng<input type="number" name="points" min="1" max="1000" value="${m.points}"></label>
          <label class="field full">Mục tiêu<input name="goal" maxlength="300" value="${esc(m.goal)}"></label><label class="field full">Nhóm (để tính huy hiệu)<select name="tag">${[['', 'Khác'], ['reading', 'Đọc sách'], ['maternal', 'Chăm sóc mẹ'], ['meal', 'Bữa ăn'], ['play', 'Chơi cùng bé'], ['health', 'Sức khỏe']].map(([k, v]) => `<option value="${k}" ${k === m.tag ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>
          <label class="field">Ảnh minh họa<input type="file" name="img" accept="image/*"></label><label class="check"><input type="checkbox" name="active" ${m.active ? 'checked' : ''}> Đang sử dụng</label>`,
        onSubmit: async (fm) => { const body = { title: fm.title.value, description: fm.description.value, participant: fm.participant.value, goal: fm.goal.value, points: Number(fm.points.value), tag: fm.tag.value, image, active: fm.active.checked };
          await api('/api/admin/missions' + (m.id ? '/' + m.id : ''), { method: m.id ? 'PUT' : 'POST', body }); toast('Đã lưu nhiệm vụ'); viewMissions(); } });
      f.img.onchange = async () => { try { image = await compressImage(f.img.files[0], 1200, 0.78); toast('Đã chọn ảnh'); } catch (ex) { toast(ex.message, true); } };
    };
    document.getElementById('add-m').onclick = () => edit();
    main.querySelector('table').onclick = async (e) => {
      const ed = e.target.closest('[data-edit]'); if (ed) edit(r.items.find((m) => m.id === Number(ed.dataset.edit)));
      const d = e.target.closest('[data-del]'); if (d && confirm('Xóa nhiệm vụ này? (Có thể tắt thay vì xóa để giữ lịch sử)')) { await api('/api/admin/missions/' + d.dataset.del, { method: 'DELETE' }); viewMissions(); }
    };
  }
  async function viewUsers() {
    const r = await api('/api/admin/users');
    main.innerHTML = `<div class="adm-head"><div><h1>Người dùng</h1><p class="muted" style="margin:4px 0 0">${r.items.length} tài khoản</p></div></div>
      <div class="table"><table><thead><tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Gia đình</th><th>Ngày tạo</th><th>Quyền</th></tr></thead><tbody>
      ${r.items.map((u) => `<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td>${esc(u.parent_role || '')}</td><td>${esc(u.family_id || '—')}</td><td>${fmtDate(u.created_at)}</td>
        <td>${u.id === me.user.id ? '<span class="tag">Quản trị (bạn)</span>' : `<select class="select-pill" data-role="${u.id}"><option value="parent" ${u.role !== 'admin' ? 'selected' : ''}>Phụ huynh</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Quản trị</option></select>`}</td></tr>`).join('')}</tbody></table></div>`;
    main.querySelectorAll('[data-role]').forEach((s) => s.onchange = async () => {
      if (!confirm('Đổi quyền tài khoản này?')) { viewUsers(); return; }
      try { await api('/api/admin/users/' + s.dataset.role, { method: 'PUT', body: { role: s.value } }); toast('Đã cập nhật quyền'); } catch (ex) { toast(ex.message, true); }
    });
  }

  // ---------- Điều hướng ----------
  let lastHash = location.hash;
  async function route() {
    if (dirty && !confirm('Bạn có thay đổi chưa lưu. Rời trang này?')) { history.replaceState(null, '', lastHash || '#articles'); return; }
    dirty = false; lastHash = location.hash;
    const raw = location.hash.slice(1) || 'articles';
    const [path, qs] = raw.split('?'); const [view, id] = path.split('/'); const params = new URLSearchParams(qs || '');
    const navKey = view === 'quiz' ? 'quizzes' : view === 'done' ? '' : view === 'editor' && id ? 'articles' : view;
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === navKey));
    document.querySelectorAll('.pop').forEach((p) => p.remove());
    main.innerHTML = '<div class="loading">Đang tải…</div>';
    try {
      if (view === 'articles') await viewArticles(params);
      else if (view === 'editor') await viewEditor(id ? Number(id) : null);
      else if (view === 'quizzes') await viewQuizzes();
      else if (view === 'quiz') await viewQuiz(id, params);
      else if (view === 'done') await viewDone(params);
      else if (view === 'paths') await viewPaths();
      else if (view === 'missions') await viewMissions();
      else if (view === 'users') await viewUsers();
      else { location.hash = '#articles'; return; }
      window.scrollTo(0, 0);
    } catch (e) { main.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  window.addEventListener('hashchange', route);
  route();
});
