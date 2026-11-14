// Trang quản trị: viết bài, quản lý bài viết, câu hỏi quiz, nhiệm vụ, người dùng
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, toast, modal, compressImage, fmtDate, CATEGORIES, AGES } = BT;
  const main = document.getElementById('admin-main');
  const nav = document.getElementById('admin-nav');
  let dirty = false;
  window.addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  const me = await getMe();
  if (!me.user) return renderLogin();
  if (me.user.role !== 'admin') {
    main.innerHTML = `<div class="panel"><h1>Không có quyền truy cập</h1><p class="body-text">Tài khoản <strong>${esc(me.user.email)}</strong> không phải quản trị viên.</p><a class="btn" href="/">Về trang chủ</a></div>`;
    return;
  }
  document.getElementById('admin-user').innerHTML = `<span>${esc(me.user.name)}</span><button id="logout">Đăng xuất</button>`;
  document.getElementById('logout').onclick = async () => { await api('/api/auth/logout', { method: 'POST' }); location.href = '/'; };
  nav.hidden = false;

  function renderLogin() {
    main.innerHTML = `<form class="panel" id="login" style="max-width:440px;margin:40px auto;width:100%">
      <h1>Đăng nhập quản trị</h1>
      <label class="field">Email<input type="email" name="email" required autocomplete="username"></label>
      <label class="field">Mật khẩu<input type="password" name="password" required autocomplete="current-password"></label>
      <div class="msg error" hidden></div><button class="btn">Đăng nhập</button></form>`;
    const f = document.getElementById('login');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      try { await api('/api/auth/login', { method: 'POST', body: { email: f.email.value, password: f.password.value } }); location.reload(); }
      catch (ex) { const m = f.querySelector('.msg'); m.textContent = ex.message; m.hidden = false; }
    });
  }

  const catOptions = (sel) => Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${esc(v)}</option>`).join('');
  const ageOptions = (sel) => Object.entries(AGES).map(([k, v]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${esc(v)}</option>`).join('');

  // ================= Views =================
  const views = {
    async dashboard() {
      const r = await api('/api/admin/stats');
      const s = r.stats;
      main.innerHTML = `<div class="admin-head"><h1>Tổng quan</h1><a class="btn" href="#editor">+ Viết bài mới</a></div>
        <div class="stat-grid">
          ${[['Bài viết', s.articles], ['Bản nháp', s.drafts], ['Người dùng', s.users], ['Gia đình', s.families], ['Câu hỏi quiz', s.questions], ['Nhiệm vụ', s.missions], ['Lượt quiz', s.attempts], ['Nhiệm vụ hoàn thành', s.completions]]
            .map(([l, n]) => `<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('')}
        </div>
        <div class="panel"><h2>Bài viết được xem nhiều</h2>
          <div class="table-wrap"><table class="admin-table"><thead><tr><th>Tiêu đề</th><th>Lượt xem</th><th></th></tr></thead><tbody>
          ${r.top.map((a) => `<tr><td>${esc(a.title)}</td><td>${a.views}</td><td><a class="btn-outline" href="#editor/${a.id}">Sửa</a></td></tr>`).join('')}
          </tbody></table></div></div>
        <p class="small-note">Cơ sở dữ liệu đang dùng: <strong>${r.db === 'cloudflare-d1' ? 'Cloudflare D1' : 'SQLite cục bộ (chế độ chạy thử)'}</strong></p>`;
    },

    async articles() {
      main.innerHTML = `<div class="admin-head"><h1>Bài viết</h1><a class="btn" href="#editor">+ Viết bài mới</a></div>
        <div class="toolbar-row"><input class="input" id="f-q" placeholder="Tìm theo tiêu đề…" style="min-width:240px">
          <select class="input" id="f-cat"><option value="">Tất cả danh mục</option>${catOptions('')}</select>
          <select class="input" id="f-status"><option value="">Mọi trạng thái</option><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Tiêu đề</th><th>Danh mục</th><th>Độ tuổi</th><th>Trạng thái</th><th>Xem</th><th>Cập nhật</th><th></th></tr></thead><tbody id="rows"></tbody></table></div>`;
      const load = async () => {
        const p = new URLSearchParams({ q: document.getElementById('f-q').value, category: document.getElementById('f-cat').value, status: document.getElementById('f-status').value });
        const r = await api('/api/admin/articles?' + p);
        document.getElementById('rows').innerHTML = r.items.map((a) => `<tr>
          <td><strong>${esc(a.title)}</strong>${a.featured ? ' <span class="pill">Nổi bật</span>' : ''}</td>
          <td>${esc(CATEGORIES[a.category] || a.category)}</td><td>${esc(AGES[a.age_group] || '')}</td>
          <td><span class="pill ${a.status === 'draft' ? 'draft' : ''}">${a.status === 'draft' ? 'Nháp' : 'Đã xuất bản'}</span></td>
          <td>${a.views}</td><td>${fmtDate(a.updated_at)}</td>
          <td><div class="actions"><a class="btn-outline" href="#editor/${a.id}">Sửa</a><a class="btn-outline" href="/bai-viet/${encodeURIComponent(a.slug)}" target="_blank">Xem</a>
            <button class="btn-outline btn-danger" data-del="${a.id}">Xóa</button></div></td></tr>`).join('') || '<tr><td colspan="7" class="muted">Không có bài viết.</td></tr>';
      };
      let t; document.getElementById('f-q').addEventListener('input', () => { clearTimeout(t); t = setTimeout(load, 300); });
      document.getElementById('f-cat').onchange = load; document.getElementById('f-status').onchange = load;
      main.onclick = async (e) => {
        const b = e.target.closest('[data-del]'); if (!b) return;
        if (!confirm('Xóa vĩnh viễn bài viết này?')) return;
        try { await api('/api/admin/articles/' + b.dataset.del, { method: 'DELETE' }); toast('Đã xóa bài viết'); load(); } catch (ex) { toast(ex.message, true); }
      };
      await load();
    },

    async editor(id) {
      let a = { title: '', slug: '', summary: '', content: '', category: 'baby-care', age_group: 'all', cover_image: '', source_name: '', source_url: '', reviewer: '', status: 'draft', featured: 0 };
      if (id) a = (await api('/api/admin/articles/' + id)).article;
      main.innerHTML = `<div class="admin-head"><h1>${id ? 'Sửa bài viết' : 'Viết bài mới'}</h1>
          <div class="toolbar-row">${id ? `<a class="btn-outline" href="/bai-viet/${encodeURIComponent(a.slug)}" target="_blank">Xem trên web ↗</a>` : ''}</div></div>
        <form id="art-form" class="editor-layout">
          <div class="stack" style="gap:16px">
            <input class="title-input" name="title" placeholder="Tiêu đề bài viết" required maxlength="250" value="${esc(a.title)}">
            <label class="field">Tóm tắt ngắn (hiển thị ở danh sách)<textarea name="summary" maxlength="600" style="min-height:80px">${esc(a.summary)}</textarea></label>
            <div class="rte">
              <div class="rte-toolbar" id="tb">
                <button type="button" data-cmd="formatBlock" data-val="H2" title="Tiêu đề lớn">H2</button>
                <button type="button" data-cmd="formatBlock" data-val="H3" title="Tiêu đề nhỏ">H3</button>
                <button type="button" data-cmd="formatBlock" data-val="P" title="Đoạn văn">¶</button>
                <span class="sep"></span>
                <button type="button" data-cmd="bold" title="In đậm"><b>B</b></button>
                <button type="button" data-cmd="italic" title="In nghiêng"><i>I</i></button>
                <button type="button" data-cmd="underline" title="Gạch chân"><u>U</u></button>
                <span class="sep"></span>
                <button type="button" data-cmd="insertUnorderedList" title="Danh sách chấm">• List</button>
                <button type="button" data-cmd="insertOrderedList" title="Danh sách số">1. List</button>
                <button type="button" data-cmd="formatBlock" data-val="BLOCKQUOTE" title="Trích dẫn / lưu ý">❝</button>
                <span class="sep"></span>
                <button type="button" data-act="link" title="Chèn liên kết">🔗</button>
                <button type="button" data-act="image" title="Chèn ảnh">🖼 Ảnh</button>
                <button type="button" data-cmd="removeFormat" title="Xóa định dạng">⨯ Định dạng</button>
                <span class="sep"></span>
                <button type="button" data-cmd="undo" title="Hoàn tác">↶</button>
                <button type="button" data-cmd="redo" title="Làm lại">↷</button>
                <button type="button" data-act="source" title="Sửa mã HTML">&lt;/&gt;</button>
              </div>
              <div class="rte-content article-body" id="rte" contenteditable="true" data-placeholder="Bắt đầu viết nội dung bài viết…"></div>
              <textarea class="rte-source" id="rte-src" hidden spellcheck="false"></textarea>
              <input type="file" id="img-file" accept="image/*" hidden>
            </div>
          </div>
          <aside class="editor-side">
            <div class="panel">
              <label class="field">Trạng thái<select name="status"><option value="draft" ${a.status === 'draft' ? 'selected' : ''}>Bản nháp</option><option value="published" ${a.status === 'published' ? 'selected' : ''}>Xuất bản</option></select></label>
              <label class="check"><input type="checkbox" name="featured" ${a.featured ? 'checked' : ''}> Bài viết nổi bật</label>
              <button class="btn" type="submit">Lưu bài viết</button>
              <span class="small-note" id="save-note">${id ? 'Cập nhật lần cuối: ' + fmtDate(a.updated_at, true) : ''}</span>
            </div>
            <div class="panel">
              <label class="field">Danh mục<select name="category" required>${catOptions(a.category)}</select></label>
              <label class="field">Độ tuổi của trẻ<select name="age_group">${ageOptions(a.age_group)}</select></label>
              <label class="field">Đường dẫn (slug)<input name="slug" value="${esc(a.slug)}" placeholder="tự tạo từ tiêu đề"></label>
            </div>
            <div class="panel">
              <div class="eyebrow">Ảnh bìa</div>
              <img class="cover-preview" id="cover-pv" ${a.cover_image ? `src="${esc(a.cover_image)}"` : 'hidden'} alt="Ảnh bìa">
              <input type="file" id="cover-file" accept="image/*">
              <input class="input" name="cover_url" placeholder="hoặc dán link ảnh https://…" value="${a.cover_image && !a.cover_image.startsWith('data:') ? esc(a.cover_image) : ''}">
              <button type="button" class="btn-outline" id="cover-clear">Bỏ ảnh bìa</button>
            </div>
            <div class="panel">
              <div class="eyebrow">Nguồn & thẩm định</div>
              <label class="field">Nguồn tham khảo<input name="source_name" value="${esc(a.source_name)}" placeholder="Bộ Y tế, WHO, UNICEF…"></label>
              <label class="field">Đường dẫn tài liệu gốc<input name="source_url" type="url" value="${esc(a.source_url)}" placeholder="https://"></label>
              <label class="field">Người / đơn vị thẩm định<input name="reviewer" value="${esc(a.reviewer)}" placeholder="VD: BS. Nguyễn Văn A – Nhi khoa"></label>
            </div>
          </aside>
        </form>`;

      const form = document.getElementById('art-form');
      const rte = document.getElementById('rte');
      const src = document.getElementById('rte-src');
      rte.innerHTML = a.content || '<p></p>';
      let cover = a.cover_image || '';
      let sourceMode = false;
      dirty = false;
      form.addEventListener('input', () => { dirty = true; });
      try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (_) { /* */ }

      // Thanh công cụ
      document.getElementById('tb').addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
      document.getElementById('tb').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (sourceMode && b.dataset.act !== 'source') { toast('Hãy tắt chế độ mã HTML trước.'); return; }
        if (b.dataset.cmd) { rte.focus(); document.execCommand(b.dataset.cmd, false, b.dataset.val ? `<${b.dataset.val}>` : null); dirty = true; }
        if (b.dataset.act === 'link') {
          const sel = window.getSelection(); const range = sel.rangeCount ? sel.getRangeAt(0) : null;
          const url = prompt('Nhập đường dẫn (https://…):', 'https://');
          if (url && /^https?:\/\//i.test(url)) {
            if (range) { sel.removeAllRanges(); sel.addRange(range); }
            if (sel.isCollapsed) document.execCommand('insertHTML', false, `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>`);
            else document.execCommand('createLink', false, url);
            dirty = true;
          }
        }
        if (b.dataset.act === 'image') { saveRange(); document.getElementById('img-file').click(); }
        if (b.dataset.act === 'source') {
          sourceMode = !sourceMode; b.classList.toggle('on', sourceMode);
          if (sourceMode) { src.value = prettyHtml(rte.innerHTML); src.hidden = false; rte.hidden = true; }
          else { rte.innerHTML = cleanHtml(src.value); src.hidden = true; rte.hidden = false; }
        }
      });
      let savedRange = null;
      function saveRange() { const s = window.getSelection(); savedRange = s.rangeCount && rte.contains(s.anchorNode) ? s.getRangeAt(0) : null; }
      document.getElementById('img-file').addEventListener('change', async (e) => {
        try {
          const data = await compressImage(e.target.files[0], 1200, 0.75);
          rte.focus();
          if (savedRange) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange); }
          const alt = prompt('Mô tả ngắn cho ảnh (giúp người khiếm thị và SEO):', '') || '';
          document.execCommand('insertHTML', false, `<img src="${data}" alt="${esc(alt)}">`);
          dirty = true;
        } catch (ex) { toast(ex.message, true); }
        e.target.value = '';
      });
      // Dán nội dung từ Word/Google Docs: giữ định dạng cơ bản, bỏ phần thừa
      rte.addEventListener('paste', (e) => {
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');
        e.preventDefault();
        if (html) document.execCommand('insertHTML', false, cleanHtml(html));
        else document.execCommand('insertHTML', false, text.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join(''));
        dirty = true;
      });

      // Ảnh bìa
      const pv = document.getElementById('cover-pv');
      document.getElementById('cover-file').addEventListener('change', async (e) => {
        try { cover = await compressImage(e.target.files[0], 1600, 0.8); pv.src = cover; pv.hidden = false; form.cover_url.value = ''; dirty = true; }
        catch (ex) { toast(ex.message, true); }
      });
      form.cover_url.addEventListener('change', () => { if (form.cover_url.value) { cover = form.cover_url.value.trim(); pv.src = cover; pv.hidden = false; } });
      document.getElementById('cover-clear').onclick = () => { cover = ''; pv.hidden = true; pv.removeAttribute('src'); form.cover_url.value = ''; document.getElementById('cover-file').value = ''; dirty = true; };

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (sourceMode) { rte.innerHTML = cleanHtml(src.value); }
        const body = {
          title: form.title.value, summary: form.summary.value, content: cleanHtml(rte.innerHTML),
          category: form.category.value, age_group: form.age_group.value, slug: form.slug.value,
          cover_image: cover, source_name: form.source_name.value, source_url: form.source_url.value, reviewer: form.reviewer.value,
          status: form.status.value, featured: form.featured.checked,
        };
        const btn = form.querySelector('[type=submit]'); btn.disabled = true;
        try {
          const r = id ? await api('/api/admin/articles/' + id, { method: 'PUT', body }) : await api('/api/admin/articles', { method: 'POST', body });
          dirty = false;
          toast(body.status === 'published' ? 'Đã lưu và xuất bản bài viết' : 'Đã lưu bản nháp');
          if (!id) location.hash = '#editor/' + r.id;
          else { form.slug.value = r.slug; document.getElementById('save-note').textContent = 'Đã lưu lúc ' + new Date().toLocaleTimeString('vi-VN'); }
        } catch (ex) { toast(ex.message, true); }
        finally { btn.disabled = false; }
      });
    },

    async questions() {
      const r = await api('/api/admin/questions');
      main.innerHTML = `<div class="admin-head"><h1>Câu hỏi quiz</h1><button class="btn" id="add-q">+ Thêm câu hỏi</button></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Câu hỏi</th><th>Đáp án đúng</th><th>Chủ đề</th><th>Trạng thái</th><th></th></tr></thead><tbody>
        ${r.items.map((q) => `<tr><td>${esc(q.question)}</td><td>${'ABCD'[q.correct_index]}. ${esc(q.options[q.correct_index])}</td>
          <td>${esc(CATEGORIES[q.category] || '')}</td><td><span class="pill ${q.active ? '' : 'off'}">${q.active ? 'Đang dùng' : 'Tắt'}</span></td>
          <td><div class="actions"><button class="btn-outline" data-edit="${q.id}">Sửa</button><button class="btn-outline btn-danger" data-del="${q.id}">Xóa</button></div></td></tr>`).join('')}
        </tbody></table></div>`;
      const edit = (q) => {
        q = q || { question: '', options: ['', '', '', ''], correct_index: 0, explanation: '', source: '', category: 'baby-care', active: 1 };
        modal({
          title: q.id ? 'Sửa câu hỏi' : 'Thêm câu hỏi',
          html: `<label class="field">Câu hỏi<textarea name="question" required maxlength="500">${esc(q.question)}</textarea></label>
            <div class="eyebrow">Đáp án (chọn đáp án đúng)</div>
            ${q.options.map((o, i) => `<div class="opt-row"><input type="radio" name="correct" value="${i}" ${i === q.correct_index ? 'checked' : ''} aria-label="Đáp án đúng ${'ABCD'[i]}">
              <b>${'ABCD'[i]}</b><input class="input" name="o${i}" required maxlength="300" value="${esc(o)}"></div>`).join('')}
            <label class="field">Giải thích đáp án<textarea name="explanation" maxlength="1000">${esc(q.explanation)}</textarea></label>
            <div class="form-grid"><label class="field">Nguồn<input name="source" maxlength="200" value="${esc(q.source)}" placeholder="WHO, Bộ Y tế…"></label>
            <label class="field">Chủ đề<select name="category">${catOptions(q.category)}</select></label></div>
            <label class="check"><input type="checkbox" name="active" ${q.active ? 'checked' : ''}> Đang sử dụng</label>`,
          onSubmit: async (f) => {
            const body = { question: f.question.value, options: [0, 1, 2, 3].map((i) => f['o' + i].value), correct_index: Number(f.correct.value),
              explanation: f.explanation.value, source: f.source.value, category: f.category.value, active: f.active.checked };
            await api('/api/admin/questions' + (q.id ? '/' + q.id : ''), { method: q.id ? 'PUT' : 'POST', body });
            toast('Đã lưu câu hỏi'); views.questions();
          },
        });
      };
      document.getElementById('add-q').onclick = () => edit();
      main.querySelectorAll('[data-edit]').forEach((b) => b.onclick = () => edit(r.items.find((q) => q.id === Number(b.dataset.edit))));
      main.querySelectorAll('[data-del]').forEach((b) => b.onclick = async () => {
        if (!confirm('Xóa câu hỏi này?')) return;
        await api('/api/admin/questions/' + b.dataset.del, { method: 'DELETE' }); views.questions();
      });
    },

    async missions() {
      const r = await api('/api/admin/missions');
      main.innerHTML = `<div class="admin-head"><h1>Nhiệm vụ đời thực</h1><button class="btn" id="add-m">+ Thêm nhiệm vụ</button></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Nhiệm vụ</th><th>Người tham gia</th><th>Mục tiêu</th><th>Điểm</th><th>Trạng thái</th><th></th></tr></thead><tbody>
        ${r.items.map((m) => `<tr><td><strong>${esc(m.title)}</strong></td><td>${esc(m.participant)}</td><td>${esc(m.goal)}</td><td>${m.points}</td>
          <td><span class="pill ${m.active ? '' : 'off'}">${m.active ? 'Đang dùng' : 'Tắt'}</span></td>
          <td><div class="actions"><button class="btn-outline" data-edit="${m.id}">Sửa</button><button class="btn-outline btn-danger" data-del="${m.id}">Xóa</button></div></td></tr>`).join('')}
        </tbody></table></div>`;
      const edit = (m) => {
        m = m || { title: '', description: '', participant: 'Bố và mẹ', goal: '', points: 10, image: '', tag: '', active: 1 };
        let image = m.image || '';
        const f = modal({
          title: m.id ? 'Sửa nhiệm vụ' : 'Thêm nhiệm vụ',
          html: `<label class="field">Tên nhiệm vụ<input name="title" required maxlength="200" value="${esc(m.title)}"></label>
            <label class="field">Mô tả / hướng dẫn<textarea name="description" maxlength="1000">${esc(m.description)}</textarea></label>
            <div class="form-grid">
              <label class="field">Người tham gia<select name="participant">${['Bố', 'Mẹ', 'Bố và mẹ'].map((p) => `<option ${p === m.participant ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
              <label class="field">Điểm thưởng<input type="number" name="points" min="1" max="1000" value="${m.points}"></label>
              <label class="field full">Mục tiêu<input name="goal" maxlength="300" value="${esc(m.goal)}" placeholder="VD: Tăng tương tác giữa bố và con"></label>
              <label class="field full">Nhóm (dùng để tính huy hiệu)<select name="tag">${[['', 'Khác'], ['reading', 'Đọc sách'], ['maternal', 'Chăm sóc mẹ'], ['meal', 'Bữa ăn'], ['play', 'Chơi cùng bé'], ['health', 'Sức khỏe']].map(([k, v]) => `<option value="${k}" ${k === m.tag ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
            </div>
            <label class="field">Ảnh minh họa<input type="file" name="img" accept="image/*"></label>
            <img class="photo-preview" id="mpv" ${image ? `src="${esc(image)}"` : 'hidden'} alt="">
            <label class="check"><input type="checkbox" name="active" ${m.active ? 'checked' : ''}> Đang sử dụng</label>`,
          onSubmit: async (fm) => {
            const body = { title: fm.title.value, description: fm.description.value, participant: fm.participant.value, goal: fm.goal.value,
              points: Number(fm.points.value), tag: fm.tag.value, image, active: fm.active.checked };
            await api('/api/admin/missions' + (m.id ? '/' + m.id : ''), { method: m.id ? 'PUT' : 'POST', body });
            toast('Đã lưu nhiệm vụ'); views.missions();
          },
        });
        f.img.addEventListener('change', async () => {
          try { image = await compressImage(f.img.files[0], 1200, 0.78); const p = f.querySelector('#mpv'); p.src = image; p.hidden = false; }
          catch (ex) { toast(ex.message, true); }
        });
      };
      document.getElementById('add-m').onclick = () => edit();
      main.querySelectorAll('[data-edit]').forEach((b) => b.onclick = () => edit(r.items.find((m) => m.id === Number(b.dataset.edit))));
      main.querySelectorAll('[data-del]').forEach((b) => b.onclick = async () => {
        if (!confirm('Xóa nhiệm vụ này? (Có thể tắt thay vì xóa để giữ lịch sử)')) return;
        await api('/api/admin/missions/' + b.dataset.del, { method: 'DELETE' }); views.missions();
      });
    },

    async users() {
      const r = await api('/api/admin/users');
      main.innerHTML = `<div class="admin-head"><h1>Người dùng</h1><span class="small-note">${r.items.length} tài khoản</span></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Gia đình</th><th>Ngày tạo</th><th>Quyền</th></tr></thead><tbody>
        ${r.items.map((u) => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.parent_role || '')}</td><td>${esc(u.family_id || '—')}</td><td>${fmtDate(u.created_at)}</td>
          <td>${u.id === me.user.id ? '<span class="pill">Quản trị (bạn)</span>' : `<select class="input" data-role="${u.id}" style="min-height:36px;width:auto">
            <option value="parent" ${u.role !== 'admin' ? 'selected' : ''}>Phụ huynh</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Quản trị</option></select>`}</td></tr>`).join('')}
        </tbody></table></div>`;
      main.querySelectorAll('[data-role]').forEach((s) => s.onchange = async () => {
        if (!confirm(`Đổi quyền tài khoản này thành "${s.options[s.selectedIndex].text}"?`)) { views.users(); return; }
        try { await api('/api/admin/users/' + s.dataset.role, { method: 'PUT', body: { role: s.value } }); toast('Đã cập nhật quyền'); } catch (ex) { toast(ex.message, true); }
      });
    },
  };

  // Làm sạch HTML: chỉ giữ thẻ định dạng cơ bản
  function cleanHtml(html) {
    const ALLOWED = { P: [], H2: [], H3: [], STRONG: [], B: [], EM: [], I: [], U: [], UL: [], OL: [], LI: [], BLOCKQUOTE: [], BR: [], A: ['href'], IMG: ['src', 'alt'], FIGURE: [], FIGCAPTION: [] };
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 8) { n.remove(); return; }
        if (n.nodeType !== 1) return;
        walk(n);
        let tag = n.tagName;
        if (tag === 'H1') tag = 'H2';
        if (['H4', 'H5', 'H6'].includes(tag)) tag = 'H3';
        if (tag === 'DIV') tag = 'P';
        if (!ALLOWED[tag]) { n.replaceWith(...n.childNodes); return; }
        const el = doc.createElement(tag);
        ALLOWED[tag].forEach((attr) => {
          const v = n.getAttribute(attr);
          if (v && (attr !== 'href' && attr !== 'src' || /^(https?:|data:image\/|\/|#)/i.test(v))) el.setAttribute(attr, v);
        });
        if (tag === 'A') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
        el.append(...n.childNodes);
        n.replaceWith(el);
      });
    };
    const root = doc.body.firstChild; walk(root);
    root.querySelectorAll('p').forEach((p) => { if (!p.textContent.trim() && !p.querySelector('img,br')) p.remove(); });
    return root.innerHTML.trim();
  }
  function prettyHtml(h) { return h.replace(/<(\/(p|h2|h3|ul|ol|li|blockquote)|br)>/gi, (m) => m + '\n'); }

  // ================= Điều hướng =================
  async function route() {
    if (dirty && !confirm('Bạn có thay đổi chưa lưu. Rời trang?')) return;
    dirty = false;
    const [view, id] = (location.hash.slice(1) || 'dashboard').split('/');
    const v = views[view] ? view : 'dashboard';
    nav.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
    main.onclick = null;
    main.innerHTML = '<div class="loading">Đang tải…</div>';
    try { await views[v](id ? Number(id) : undefined); window.scrollTo(0, 0); }
    catch (e) { main.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  nav.addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (b) location.hash = b.dataset.view; });
  window.addEventListener('hashchange', route);
  route();
});
