// Tài khoản: đăng ký/đăng nhập, hồ sơ, gia đình, thông tin bé, cài đặt, lịch sử
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ICONS, toast, modal, fmtDate, todayStr } = BT;
  const box = document.getElementById('account');
  const params = new URLSearchParams(location.search);
  const joinId = params.get('join'), joinCode = params.get('code');
  const next = params.get('next');

  async function afterAuth() {
    if (joinId && joinCode) {
      try { await api('/api/family/join', { method: 'POST', body: { family_id: joinId, invite_code: joinCode } }); toast('Đã tham gia gia đình ' + joinId); }
      catch (e) { toast(e.message, true); }
    }
    if (next && next.startsWith('/') && !next.startsWith('//')) location.href = next;
    else location.href = '/tai-khoan';
  }

  // ---------- Chưa đăng nhập ----------
  function renderAuth(tab) {
    document.getElementById('acc-title').textContent = tab === 'register' ? 'Đăng ký' : 'Đăng nhập';
    box.innerHTML = `<div class="auth-wrap">
      ${joinId ? `<div class="msg success" style="margin-bottom:24px">Bạn được mời tham gia gia đình <strong>${esc(joinId)}</strong>. Đăng nhập hoặc tạo tài khoản để tham gia.</div>` : ''}
      <nav class="tabs" style="padding:0 0 32px"><a href="#" data-tab="login" class="${tab === 'login' ? 'active' : ''}">Đăng nhập</a><a href="#" data-tab="register" class="${tab === 'register' ? 'active' : ''}">Tạo tài khoản</a></nav>
      ${tab === 'login' ? `
      <form class="panel tint" id="login-form">
        <label class="field">Email<input type="email" name="email" required autocomplete="email"></label>
        <label class="field">Mật khẩu<input type="password" name="password" required autocomplete="current-password"></label>
        <div class="msg error" hidden></div>
        <button class="btn btn-lg" type="submit">Đăng nhập ${ICONS.arrow}</button>
      </form>` : `
      <form class="panel tint" id="register-form">
        <label class="field">Họ tên<input name="name" required maxlength="100" autocomplete="name"></label>
        <label class="field">Bạn là<select name="parent_role"><option>Mẹ</option><option>Bố</option><option>Người chăm sóc</option></select></label>
        <label class="field">Email<input type="email" name="email" required autocomplete="email"></label>
        <label class="field">Mật khẩu (ít nhất 6 ký tự)<input type="password" name="password" required minlength="6" autocomplete="new-password"></label>
        <div class="msg error" hidden></div>
        <button class="btn btn-lg" type="submit">Tạo tài khoản ${ICONS.arrow}</button>
      </form>`}</div>`;
    box.querySelectorAll('[data-tab]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); renderAuth(a.dataset.tab); }));
    const form = box.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = form.querySelector('.msg.error'); err.hidden = true;
      const btn = form.querySelector('button'); btn.disabled = true;
      const body = Object.fromEntries(new FormData(form));
      try { await api(tab === 'login' ? '/api/auth/login' : '/api/auth/register', { method: 'POST', body }); await afterAuth(); }
      catch (ex) { err.textContent = ex.message; err.hidden = false; btn.disabled = false; }
    });
  }

  // ---------- Đã đăng nhập ----------
  async function renderAccount() {
    const me = await getMe(true);
    const u = me.user, f = me.family;
    document.getElementById('acc-title').textContent = 'Xin chào, ' + u.name;
    document.getElementById('acc-lead').textContent = f ? `Thành viên của ${f.name} · Family ID: ${f.id}` : 'Hãy tạo hồ sơ gia đình để bố mẹ cùng đồng hành.';
    const inviteLink = f ? `${location.origin}/tai-khoan?join=${f.id}&code=${f.invite_code}` : '';
    const s = u.settings || {};

    box.innerHTML = `<div class="account-grid">
      <section class="panel">
        <h2>Hồ sơ cá nhân</h2>
        <dl class="kv"><dt>Họ tên</dt><dd>${esc(u.name)}</dd><dt>Vai trò</dt><dd>${esc(u.parent_role || '')}</dd><dt>Email</dt><dd>${esc(u.email)}</dd><dt>Tham gia</dt><dd>${fmtDate(u.created_at)}</dd></dl>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn-outline" id="edit-profile">Sửa hồ sơ</button>
          <button class="btn-outline" id="change-pw">Đổi mật khẩu</button>
          ${u.role === 'admin' ? '<a class="btn-outline" href="/admin">Trang quản trị</a>' : ''}
          <button class="btn-outline btn-danger" id="logout">Đăng xuất</button>
        </div>
      </section>

      <section class="panel tint">
        <h2>Gia đình</h2>
        ${f ? `
          <dl class="kv"><dt>Tên</dt><dd>${esc(f.name)}</dd><dt>Family ID</dt><dd><span class="code-box">${esc(f.id)}</span></dd>
            <dt>Mã mời</dt><dd><span class="code-box">${esc(f.invite_code)}</span></dd>
            <dt>Thành viên</dt><dd>${me.members.map((m) => `${esc(m.name)} <span class="muted">(${esc(m.parent_role || '')})</span>`).join('<br>')}</dd></dl>
          <p class="meta" style="margin:0">Gửi đường dẫn mời cho bố/mẹ để cùng tham gia một tài khoản gia đình:</p>
          <div class="form-row"><input class="input" id="invite-link" readonly value="${esc(inviteLink)}" style="flex:1 1 240px">
            <button class="btn" id="copy-link">Sao chép</button></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn-outline" id="rename-family">Đổi tên</button>
            <button class="btn-outline" id="new-code">Tạo mã mời mới</button>
            <button class="btn-outline btn-danger" id="leave-family">Rời gia đình</button>
          </div>` : `
          <p class="body-text" style="font-size:16px">Tạo gia đình mới (bạn sẽ nhận Family ID dạng FAM001) hoặc tham gia gia đình bố/mẹ đã tạo.</p>
          <form class="form-row" id="create-family"><label class="field">Tên gia đình<input name="name" maxlength="100" placeholder="VD: Gia đình nhà Bống"></label><button class="btn" style="min-height:52px">Tạo gia đình</button></form>
          <form class="form-grid" id="join-family"><label class="field">Family ID<input name="family_id" required placeholder="FAM001"></label>
            <label class="field">Mã mời<input name="invite_code" required placeholder="ABC123"></label>
            <button class="btn full">Tham gia gia đình</button></form>`}
      </section>

      <section class="panel">
        <h2>Thông tin của bé</h2>
        ${f ? `${me.children.length ? `<div class="list-box">${me.children.map((c) => `
            <div class="list-row"><div class="left"><span><strong>${esc(c.name)}</strong><br><span class="meta" style="font-size:15px">${c.birth_date ? 'Ngày sinh: ' + fmtDate(c.birth_date) : 'Dự sinh: ' + fmtDate(c.due_date)}${c.gender ? ' · ' + esc(c.gender) : ''}</span></span></div>
            <div><button class="btn-outline" data-edit-child="${c.id}">Sửa</button> <button class="icon-btn" data-del-child="${c.id}" aria-label="Xóa">${ICONS.trash}</button></div></div>`).join('')}</div>`
            : '<p class="meta" style="margin:0">Chưa có thông tin bé.</p>'}
          <button class="btn" id="add-child" style="align-self:flex-start">${ICONS.plus} Thêm thông tin bé</button>`
          : '<p class="meta" style="margin:0">Tạo hoặc tham gia gia đình để thêm thông tin bé.</p>'}
      </section>

      <section class="panel">
        <h2>Cài đặt thông báo</h2>
        <form class="stack" id="settings" style="gap:14px">
          <label class="check"><input type="checkbox" name="vaccine" ${s.vaccine ? 'checked' : ''}> Hiển thị nhắc lịch tiêm chủng & lịch khám sắp tới</label>
          <label class="check"><input type="checkbox" name="mission" ${s.mission ? 'checked' : ''}> Nhắc nhiệm vụ hằng ngày khi vào website</label>
          <label class="check"><input type="checkbox" name="email" ${s.email ? 'checked' : ''}> Nhận email tổng kết tuần (sắp ra mắt)</label>
          <button class="btn" style="align-self:flex-start">Lưu cài đặt</button>
        </form>
      </section>

      <section class="panel" style="grid-column:1/-1">
        <h2>Lịch sử hoạt động</h2>
        <div class="history" id="history"><div class="loading">Đang tải…</div></div>
      </section>
    </div>`;

    api('/api/history').then((r) => {
      document.getElementById('history').innerHTML = r.items.length ? r.items.map((h) => `
        <div class="item"><time>${fmtDate(h.created_at, true)}</time><span>${h.user_name ? `<strong>${esc(h.user_name)}</strong>: ` : ''}${esc(h.detail || h.action)}</span></div>`).join('')
        : '<div class="empty">Chưa có hoạt động.</div>';
    }).catch(() => {});

    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(el.tagName === 'FORM' ? 'submit' : 'click', fn); };
    const reload = () => renderAccount();

    on('logout', async () => { await api('/api/auth/logout', { method: 'POST' }); location.href = '/'; });
    on('edit-profile', () => modal({
      title: 'Sửa hồ sơ',
      html: `<label class="field">Họ tên<input name="name" required maxlength="100" value="${esc(u.name)}"></label>
        <label class="field">Bạn là<select name="parent_role">${['Mẹ', 'Bố', 'Người chăm sóc'].map((r) => `<option ${r === u.parent_role ? 'selected' : ''}>${r}</option>`).join('')}</select></label>`,
      onSubmit: async (fm) => { await api('/api/me', { method: 'PUT', body: { name: fm.name.value, parent_role: fm.parent_role.value, settings: s } }); toast('Đã cập nhật hồ sơ'); reload(); },
    }));
    on('change-pw', () => modal({
      title: 'Đổi mật khẩu',
      html: `<label class="field">Mật khẩu hiện tại<input type="password" name="current" required autocomplete="current-password"></label>
        <label class="field">Mật khẩu mới<input type="password" name="password" required minlength="6" autocomplete="new-password"></label>`,
      onSubmit: async (fm) => { await api('/api/me/password', { method: 'POST', body: { current: fm.current.value, password: fm.password.value } }); toast('Đã đổi mật khẩu'); },
    }));
    on('settings', async (e) => {
      e.preventDefault(); const fm = e.target;
      try { await api('/api/me', { method: 'PUT', body: { name: u.name, parent_role: u.parent_role, settings: { vaccine: fm.vaccine.checked, mission: fm.mission.checked, email: fm.email.checked } } }); toast('Đã lưu cài đặt'); }
      catch (ex) { toast(ex.message, true); }
    });
    on('create-family', async (e) => {
      e.preventDefault();
      try { const r = await api('/api/family', { method: 'POST', body: { name: e.target.name.value } }); toast('Đã tạo gia đình ' + r.id); reload(); }
      catch (ex) { toast(ex.message, true); }
    });
    on('join-family', async (e) => {
      e.preventDefault(); const fm = e.target;
      try { await api('/api/family/join', { method: 'POST', body: { family_id: fm.family_id.value, invite_code: fm.invite_code.value } }); toast('Đã tham gia gia đình'); reload(); }
      catch (ex) { toast(ex.message, true); }
    });
    on('copy-link', async () => {
      const inp = document.getElementById('invite-link');
      try { await navigator.clipboard.writeText(inp.value); } catch (_) { inp.select(); document.execCommand('copy'); }
      toast('Đã sao chép đường dẫn mời');
    });
    on('rename-family', () => modal({
      title: 'Đổi tên gia đình',
      html: `<label class="field">Tên gia đình<input name="name" required maxlength="100" value="${esc(f.name)}"></label>`,
      onSubmit: async (fm) => { await api('/api/family', { method: 'PUT', body: { name: fm.name.value } }); reload(); },
    }));
    on('new-code', async () => {
      if (!confirm('Tạo mã mời mới? Mã cũ sẽ không dùng được nữa.')) return;
      try { await api('/api/family/invite', { method: 'POST' }); toast('Đã tạo mã mời mới'); reload(); } catch (ex) { toast(ex.message, true); }
    });
    on('leave-family', async () => {
      if (!confirm('Bạn chắc chắn muốn rời gia đình này?')) return;
      try { await api('/api/family/leave', { method: 'POST' }); reload(); } catch (ex) { toast(ex.message, true); }
    });

    const childForm = (c = {}) => `<div class="form-grid">
      <label class="field full">Tên hoặc biệt danh<input name="name" required maxlength="100" value="${esc(c.name || '')}"></label>
      <label class="field">Ngày sinh<input type="date" name="birth_date" value="${esc(c.birth_date || '')}" max="${todayStr()}"></label>
      <label class="field">Hoặc ngày dự sinh<input type="date" name="due_date" value="${esc(c.due_date || '')}"></label>
      <label class="field full">Giới tính<select name="gender"><option value="">Không nêu</option>${['Bé trai', 'Bé gái'].map((g) => `<option ${g === c.gender ? 'selected' : ''}>${g}</option>`).join('')}</select></label></div>
      <p class="meta" style="margin:0">Nhập ngày sinh nếu bé đã chào đời, hoặc ngày dự sinh nếu mẹ đang mang thai.</p>`;
    const childBody = (fm) => ({ name: fm.name.value, birth_date: fm.birth_date.value, due_date: fm.birth_date.value ? '' : fm.due_date.value, gender: fm.gender.value });
    on('add-child', () => modal({ title: 'Thêm thông tin bé', html: childForm(), onSubmit: async (fm) => { await api('/api/children', { method: 'POST', body: childBody(fm) }); reload(); } }));
    box.querySelectorAll('[data-edit-child]').forEach((b) => b.addEventListener('click', () => {
      const c = me.children.find((x) => x.id === Number(b.dataset.editChild));
      modal({ title: 'Sửa thông tin bé', html: childForm(c), onSubmit: async (fm) => { await api('/api/children/' + c.id, { method: 'PUT', body: childBody(fm) }); reload(); } });
    }));
    box.querySelectorAll('[data-del-child]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Xóa thông tin bé này?')) return;
      await api('/api/children/' + b.dataset.delChild, { method: 'DELETE' }); reload();
    }));

    // Nếu đến từ đường dẫn mời khi đã đăng nhập
    if (joinId && joinCode && !f) {
      const fm = document.getElementById('join-family');
      if (fm) { fm.family_id.value = joinId; fm.invite_code.value = joinCode; }
    }
  }

  const me = await getMe();
  if (me.user) renderAccount();
  else renderAuth(joinId ? 'register' : 'login');
});
