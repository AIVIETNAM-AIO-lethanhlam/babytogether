// A1 · Đăng nhập quản trị
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, icon, logoHtml } = BT;
  const me = await getMe();
  if (me.user && me.user.role === 'admin') { location.replace('/admin'); return; }
  document.getElementById('brand').innerHTML = logoHtml() + ' <span class="adm-pill" style="background:var(--sky-900);margin-left:8px">ADMIN</span>';
  document.querySelector('#brand .logo').style.color = '#fff';
  document.getElementById('feats').innerHTML = [['book', 'Trình soạn thảo bài viết như Notion'], ['quiz', 'Tạo quiz với số đáp án linh hoạt'], ['route', 'Sắp xếp lộ trình đọc cho ba mẹ']]
    .map(([i, t]) => `<div style="display:flex;gap:12px;align-items:center;font-weight:500"><span class="ib sm" style="background:var(--sky-800);color:var(--sky-300)">${icon(i, 18)}</span>${t}</div>`).join('');
  document.getElementById('shield').innerHTML = icon('shield', 26);
  const tp = document.getElementById('toggle-pw'); tp.innerHTML = icon('eye', 18);
  tp.onclick = () => { const i = document.querySelector('[name=password]'); i.type = i.type === 'password' ? 'text' : 'password'; };
  const f = document.getElementById('login'); const err = f.querySelector('.msg');
  if (me.user) { err.textContent = `Tài khoản ${me.user.email} không có quyền quản trị. Hãy đăng nhập bằng tài khoản admin.`; err.hidden = false; }
  f.onsubmit = async (e) => {
    e.preventDefault(); if (!f.reportValidity()) return; err.hidden = true;
    const b = document.getElementById('submit'); b.disabled = true;
    try {
      await api('/api/auth/login', { method: 'POST', body: { email: f.email.value, password: f.password.value } });
      const m = await getMe(true);
      if (!m.user || m.user.role !== 'admin') { err.textContent = 'Tài khoản này không có quyền quản trị.'; err.hidden = false; b.disabled = false; return; }
      location.href = '/admin';
    } catch (ex) { err.textContent = ex.message; err.hidden = false; b.disabled = false; }
  };
});
