// Nhật ký gia đình
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ph, ICONS, toast, modal, compressImage, loginHint, fmtDate, todayStr } = BT;
  const content = document.getElementById('family-content');
  const nav = document.getElementById('side-nav');
  const me = await getMe();

  const head = (title, sub) => `
    <button type="button" class="btn-text" data-go="overview">${ICONS.back} Quay lại tổng quan</button>
    <div class="stack" style="gap:8px"><h2 class="h2" style="font-size:24px">${title}</h2><p class="meta" style="margin:0;font-size:18px">${sub}</p></div>`;

  if (!me.user) {
    nav.hidden = true;
    content.innerHTML = `<h1 class="h1">Gia đình</h1><div class="divider md"><span></span></div>${loginHint('Đăng nhập để mở Nhật ký gia đình – nơi bố mẹ cùng ghi lại hành trình chăm con.')}`;
    return;
  }
  if (!me.family) {
    nav.hidden = true;
    content.innerHTML = `<h1 class="h1">Gia đình</h1><div class="divider md"><span></span></div>
      <div class="login-hint"><span class="body-text">Bạn chưa có hồ sơ gia đình. Hãy tạo gia đình mới hoặc tham gia gia đình của bố/mẹ bằng Family ID.</span>
      <a class="btn" href="/tai-khoan">Thiết lập gia đình ${ICONS.arrow}</a></div>`;
    return;
  }

  let dailyDate = todayStr();
  let weekOffset = 0;

  const views = {
    async overview() {
      const [s, ev] = await Promise.all([api('/api/diary/summary'), api('/api/events?from=' + todayStr())]);
      const st = s.stats;
      const items = [
        `Hoàn thành ${st.missions_week} thử thách trong tuần.`,
        `Cùng đọc sách cho bé ${st.reading_week} lần.`,
        `Hoàn thành ${st.quiz_week} bài kiểm tra kiến thức.`,
        `Tìm hiểu ${st.maternal_week} chủ đề về chăm sóc mẹ sau sinh.`,
      ];
      return `
        <div class="stack" style="align-items:flex-start">
          <a class="btn-text" href="/">${ICONS.back} Quay lại</a>
          <h1 class="h1" style="font-size:clamp(28px,3.8vw,44px)">${esc(me.family.name)}</h1>
          <div class="divider md"><span></span></div>
          <p class="lead">Cùng nhau tạo nên những khoảnh khắc tuyệt vời nhé!</p>
          <div class="summary-box"><div class="eyebrow" style="padding-bottom:8px">Tuần này gia đình đã</div>
            ${items.map((t) => `<div class="summary-item">${esc(t)}</div>`).join('')}</div>
          <div class="form-grid" style="width:100%">
            <div class="panel"><div class="eyebrow">Tổng điểm gia đình</div><div class="score-big" style="font-size:44px">${st.points}</div></div>
            <div class="panel"><div class="eyebrow">Huy hiệu</div><div class="score-big" style="font-size:44px">${s.badges.filter((b) => b.earned).length}/${s.badges.length}</div></div>
          </div>
          <div class="stack" style="width:100%;gap:12px"><div class="eyebrow">Lịch sắp tới</div>
            ${ev.items.length ? `<div class="reminder-list">${ev.items.slice(0, 4).map((e) => `<div class="reminder"><span class="date">${fmtDate(e.date)}</span><span class="title">${esc(e.title)}${e.time ? ' · ' + esc(e.time) : ''}</span></div>`).join('')}</div>`
              : '<div class="empty">Chưa có lịch nào sắp tới.</div>'}</div>
        </div>`;
    },

    async daily() {
      const r = await api('/api/activities?date=' + dailyDate);
      const quick = ['Cho bé ăn dặm', 'Đọc sách cùng bé', 'Chơi vận động cùng bé', 'Tắm cho bé', 'Kiểm tra lịch tiêm chủng'];
      return `${head('Hoạt động hằng ngày', 'Ghi nhận những hoạt động chăm sóc trẻ mỗi ngày')}
        <div class="cal-nav"><button class="btn-outline" data-day="-1">‹ Hôm trước</button>
          <input type="date" class="input" id="daily-date" value="${dailyDate}" max="${todayStr()}" style="width:auto;min-height:44px">
          <button class="btn-outline" data-day="1" ${dailyDate >= todayStr() ? 'disabled' : ''}>Hôm sau ›</button></div>
        <div class="list-box">${r.items.length ? r.items.map((a) => `
          <div class="list-row"><div class="left"><span>${esc(a.title)}${a.done && a.done_by_name ? ` <span class="meta" style="font-size:14px">· ${esc(a.done_by_name)}</span>` : ''}</span></div>
            <div style="display:flex;gap:6px;align-items:center">
              <button class="status ${a.done ? 'done' : ''}" data-toggle="${a.id}" data-done="${a.done}">${a.done ? 'Đã xong' : 'Chưa làm'}</button>
              <button class="icon-btn" data-del-act="${a.id}" aria-label="Xóa">${ICONS.trash}</button></div></div>`).join('')
          : '<div class="list-row"><span class="muted"><em>Chưa có hoạt động nào trong ngày này.</em></span></div>'}</div>
        <form class="form-row" id="act-form">
          <label class="field">Thêm hoạt động<input name="title" required maxlength="200" placeholder="VD: Cho bé tắm nắng" list="quick-acts"></label>
          <datalist id="quick-acts">${quick.map((q) => `<option value="${q}">`).join('')}</datalist>
          <label class="check" style="min-height:52px"><input type="checkbox" name="done"> Đã xong</label>
          <button class="btn" type="submit" style="min-height:52px">Ghi nhận hoạt động</button>
        </form>`;
    },

    async progress() {
      const s = await api('/api/diary/summary');
      const total = s.members.reduce((a, m) => a + Number(m.week_count), 0);
      const goal = s.weekly_goal;
      return `${head('Tiến độ gia đình', 'Theo dõi số nhiệm vụ bố mẹ đã hoàn thành trong tuần')}
        <div class="list-box" style="padding:8px 28px">
          ${s.members.map((m) => `<div class="member-bar"><div class="top"><span>${esc(m.name)} <span class="muted">(${esc(m.parent_role || '')})</span></span><span>${m.week_count} nhiệm vụ</span></div>
            <div class="track"><div class="fill" style="width:${Math.min(100, (m.week_count / goal) * 100)}%"></div></div></div>`).join('')}
          <div class="list-row"><span class="eyebrow">Tổng cả nhà tuần này (từ ${fmtDate(s.week_start)})</span><strong>${total} / ${goal} nhiệm vụ</strong></div>
        </div>
        <div class="form-grid">
          <div class="panel"><div class="eyebrow">Nhiệm vụ đã làm</div><div class="score-big" style="font-size:40px">${s.stats.missions_all}</div></div>
          <div class="panel"><div class="eyebrow">Bài quiz</div><div class="score-big" style="font-size:40px">${s.stats.quiz_all}</div></div>
          <div class="panel"><div class="eyebrow">Bài viết đã đọc</div><div class="score-big" style="font-size:40px">${s.stats.reads_all}</div></div>
        </div>
        <a class="btn" href="/nhiem-vu" style="align-self:flex-start">Làm nhiệm vụ hôm nay ${ICONS.arrow}</a>`;
    },

    async calendar() {
      const base = new Date(todayStr() + 'T00:00:00Z');
      const dow = (base.getUTCDay() + 6) % 7;
      const monday = new Date(base); monday.setUTCDate(base.getUTCDate() - dow + weekOffset * 7);
      const days = [...Array(7)].map((_, i) => { const d = new Date(monday); d.setUTCDate(monday.getUTCDate() + i); return d.toISOString().slice(0, 10); });
      const r = await api(`/api/events?from=${days[0]}&to=${days[6]}`);
      const names = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
      return `${head('Lịch chung', 'Lịch hoạt động chung của gia đình')}
        <div class="cal-nav" style="justify-content:space-between">
          <div class="cal-nav"><button class="btn-outline" data-week="-1">‹ Tuần trước</button>
          <button class="btn-outline" data-week="0">Tuần này</button>
          <button class="btn-outline" data-week="1">Tuần sau ›</button></div>
          <button class="btn" id="add-event">${ICONS.plus} Thêm lịch</button></div>
        <p class="meta" style="margin:0">${fmtDate(days[0])} – ${fmtDate(days[6])}</p>
        <div class="week-grid">${days.map((d, i) => {
          const evs = r.items.filter((e) => e.date === d);
          return `<div class="week-day ${d === todayStr() ? 'today' : ''}"><div class="dname">${names[i]} · ${d.slice(8)}/${d.slice(5, 7)}</div>
            ${evs.length ? evs.map((e) => `<div class="ev ${e.type}" title="${esc(e.note || '')}">${e.time ? `<b>${esc(e.time)}</b> ` : ''}${esc(e.title)}
              <button class="icon-btn" data-del-ev="${e.id}" aria-label="Xóa lịch" style="width:24px;height:24px;float:right">${ICONS.trash}</button></div>`).join('')
              : '<div class="none">Chưa có lịch</div>'}</div>`;
        }).join('')}</div>
        <p class="meta">💉 Cam: tiêm chủng · 🩺 Xanh lá: khám sức khỏe · Xanh dương: hoạt động khác</p>`;
    },

    async achievement() {
      const s = await api('/api/diary/summary');
      return `${head('Huy hiệu', 'Huy hiệu và thành tích của gia đình')}
        <div class="badge-grid">${s.badges.map((b) => `
          <div class="badge-card ${b.earned ? '' : 'locked'}" title="${esc(b.desc)}"><div class="shape" aria-hidden="true"></div>
            <div class="bname">${esc(b.name)}</div><div class="bstate">${b.earned ? 'Đã nhận' : 'Chưa mở khóa'}</div>
            <div class="meta" style="font-size:13px">${esc(b.desc)}</div></div>`).join('')}</div>`;
    },

    async memories() {
      const r = await api('/api/memories');
      return `${head('Kỷ niệm gia đình', 'Lưu lại những khoảnh khắc đáng nhớ')}
        <div class="memory-grid">${r.items.map((m) => `
          <figure class="memory" style="margin:0">${ph(m.photo, 'heart', m.photo ? m.caption : 'Khoảnh khắc')}
            <figcaption class="cap">${esc(m.caption)}</figcaption><div class="when">${fmtDate(m.date)} · ${esc(m.user_name || '')}</div>
            <button class="icon-btn" data-del-mem="${m.id}" aria-label="Xóa kỷ niệm">${ICONS.trash}</button></figure>`).join('')
          || '<div class="empty" style="grid-column:1/-1">Chưa có kỷ niệm nào. Hãy lưu khoảnh khắc đầu tiên!</div>'}</div>
        <button class="btn" id="add-memory" style="align-self:flex-start">${ICONS.plus} Thêm khoảnh khắc</button>`;
    },
  };

  let current = 'overview';
  async function go(tab) {
    if (!views[tab]) tab = 'overview';
    current = tab;
    nav.querySelectorAll('button').forEach((b) => { const on = b.dataset.tab === tab; b.classList.toggle('active', on); b.setAttribute('aria-current', on ? 'page' : 'false'); });
    if (location.hash.slice(1) !== tab) history.replaceState(null, '', '#' + tab);
    content.innerHTML = '<div class="loading">Đang tải…</div>';
    try { content.innerHTML = await views[tab](); }
    catch (e) { content.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  const refresh = () => go(current);

  nav.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { go(b.dataset.tab); if (innerWidth < 860) content.scrollIntoView({ behavior: 'smooth' }); } });

  content.addEventListener('click', async (e) => {
    const t = e.target.closest('button,[data-go]'); if (!t) return;
    try {
      if (t.dataset.go) return go(t.dataset.go);
      if (t.dataset.day) { const d = new Date(dailyDate + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + Number(t.dataset.day)); dailyDate = d.toISOString().slice(0, 10); return refresh(); }
      if (t.dataset.week) { weekOffset = t.dataset.week === '0' ? 0 : weekOffset + Number(t.dataset.week); return refresh(); }
      if (t.dataset.toggle) { await api('/api/activities/' + t.dataset.toggle, { method: 'PUT', body: { done: t.dataset.done !== '1' } }); return refresh(); }
      if (t.dataset.delAct) { if (confirm('Xóa hoạt động này?')) { await api('/api/activities/' + t.dataset.delAct, { method: 'DELETE' }); refresh(); } return; }
      if (t.dataset.delEv) { if (confirm('Xóa lịch này?')) { await api('/api/events/' + t.dataset.delEv, { method: 'DELETE' }); refresh(); } return; }
      if (t.dataset.delMem) { if (confirm('Xóa khoảnh khắc này?')) { await api('/api/memories/' + t.dataset.delMem, { method: 'DELETE' }); refresh(); } return; }
      if (t.id === 'add-event') {
        modal({
          title: 'Thêm lịch gia đình',
          html: `<div class="form-grid"><label class="field full">Nội dung<input name="title" required maxlength="200" placeholder="VD: Đưa bé đi tiêm"></label>
            <label class="field">Ngày<input type="date" name="date" required value="${todayStr()}"></label>
            <label class="field">Giờ<input type="time" name="time"></label>
            <label class="field full">Loại<select name="type"><option value="activity">Hoạt động</option><option value="vaccine">Tiêm chủng</option><option value="checkup">Khám sức khỏe</option><option value="other">Khác</option></select></label>
            <label class="field full">Ghi chú<textarea name="note" maxlength="500"></textarea></label></div>`,
          onSubmit: async (f) => {
            await api('/api/events', { method: 'POST', body: { title: f.title.value, date: f.date.value, time: f.time.value, type: f.type.value, note: f.note.value } });
            toast('Đã thêm lịch'); refresh();
          },
        });
      }
      if (t.id === 'add-memory') {
        let photo = '';
        const form = modal({
          title: 'Thêm khoảnh khắc',
          html: `<label class="field">Mô tả<input name="caption" required maxlength="300" placeholder="VD: Lần đầu bé tự ngồi"></label>
            <label class="field">Ngày<input type="date" name="date" value="${todayStr()}" max="${todayStr()}"></label>
            <label class="field">Ảnh<input type="file" name="photo" accept="image/*"></label>
            <img class="photo-preview" id="pv" alt="Xem trước" hidden>`,
          onSubmit: async (f) => {
            await api('/api/memories', { method: 'POST', body: { caption: f.caption.value, date: f.date.value, photo } });
            toast('Đã lưu khoảnh khắc'); refresh();
          },
        });
        form.photo.addEventListener('change', async () => {
          try { photo = await compressImage(form.photo.files[0]); const pv = form.querySelector('#pv'); pv.src = photo; pv.hidden = false; }
          catch (ex) { toast(ex.message, true); form.photo.value = ''; photo = ''; }
        });
      }
    } catch (ex) { toast(ex.message, true); }
  });

  content.addEventListener('change', (e) => { if (e.target.id === 'daily-date' && e.target.value) { dailyDate = e.target.value; refresh(); } });
  content.addEventListener('submit', async (e) => {
    if (e.target.id !== 'act-form') return;
    e.preventDefault(); const f = e.target;
    try { await api('/api/activities', { method: 'POST', body: { title: f.title.value, done: f.done.checked, date: dailyDate } }); toast('Đã ghi nhận hoạt động'); refresh(); }
    catch (ex) { toast(ex.message, true); }
  });

  go(location.hash.slice(1) || 'overview');
});
