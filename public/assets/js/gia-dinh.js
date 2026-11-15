// Nhật ký gia đình (dashboard)
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, toast, modal, compressImage, loginHint, fmtDate, todayStr, cover } = BT;
  const root = document.getElementById('family');
  const me = await getMe();
  if (!me.user) { root.innerHTML = `<div style="padding:48px 0 96px">${loginHint('Đăng nhập để mở Nhật ký gia đình – nơi bố mẹ cùng ghi lại hành trình chăm con.')}</div>`; return; }
  if (!me.family) { root.innerHTML = `<div style="padding:48px 0 96px"><div class="hint-box"><span>Bạn chưa có hồ sơ gia đình. Tạo gia đình mới hoặc tham gia gia đình của bố/mẹ bằng Family ID.</span><a class="btn" href="/tai-khoan">Thiết lập gia đình ${icon('arrow', 18)}</a></div></div>`; return; }
  const f = me.family, child = (me.children || [])[0];
  let dailyDate = todayStr(), weekOffset = 0;
  const childTxt = child ? (child.birth_date ? `Bé ${child.name} ${Math.floor((Date.now() - new Date(child.birth_date)) / (30.44 * 864e5))} tháng` : `Bé ${child.name} (dự sinh ${fmtDate(child.due_date)})`) : '';
  document.getElementById('fam-hero').innerHTML = `
    <div class="fam-head">
      <div style="display:flex;gap:20px;align-items:center"><div class="avatars">${me.members.slice(0, 4).map((m, i) => `<span class="avatar" style="background:${['var(--sky-300)', 'var(--sky-500)', 'var(--sky-200)', 'var(--sky-400)'][i]};color:${i === 1 ? '#fff' : 'var(--sky-950)'}">${esc(m.name.charAt(0).toUpperCase())}</span>`).join('')}</div>
        <div class="page-head"><span class="label">Nhật ký gia đình</span><h1 class="h1">${esc(f.name)}</h1><p class="lead">${me.members.map((m) => esc((m.parent_role || '') + ' ' + m.name)).join(' · ')}${childTxt ? ' · ' + esc(childTxt) : ''}</p></div></div>
      <div class="chips"><button class="fid" id="copy-fid" title="Sao chép"><span class="ib sm">${icon('users', 18)}</span><span style="text-align:left"><span class="label" style="color:var(--n-600)">Family ID</span><br><b style="color:var(--sky-700)">${esc(f.id)}</b></span>${icon('copy', 18)}</button>
        <a class="btn" href="/tai-khoan">Mời bố/mẹ ${icon('arrow', 18)}</a></div>
    </div>`;
  root.innerHTML = `
    <div class="grid-4" id="stats" style="padding-top:48px"></div>
    <div class="fam-layout">
      <div style="display:flex;flex-direction:column;gap:20px;min-width:0">
        <div class="card" id="daily"></div><div class="card" id="calendar"></div><div class="card" id="memories"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px"><div class="progress-card" id="progress"></div><div class="card" id="badges"></div></div>
    </div>`;
  document.getElementById('copy-fid').onclick = async () => { try { await navigator.clipboard.writeText(f.id); toast('Đã sao chép Family ID'); } catch (_) { /* */ } };

  async function loadSummary() {
    const s = await api('/api/diary/summary'); const st = s.stats;
    document.getElementById('stats').innerHTML = [['target', st.missions_week, 'Thử thách tuần này', `${st.missions_all} thử thách từ trước đến nay`], ['book', st.reading_week, 'Lần đọc sách cho bé', 'Nhiệm vụ đọc sách tuần này'], ['star', st.quiz_week, 'Bài quiz hoàn thành', `${st.perfect_all} lần đạt điểm tuyệt đối`], ['heart', st.maternal_week, 'Chủ đề chăm sóc mẹ', 'Đã tìm hiểu tuần này']]
      .map(([ic, n, l, sub]) => `<div class="stat-card"><div class="n"><span class="ib">${icon(ic, 22)}</span>${n}</div><b>${l}</b><span class="small muted">${sub}</span></div>`).join('');
    const total = s.members.reduce((a, m) => a + Number(m.week_count), 0);
    document.getElementById('progress').innerHTML = `<span class="label" style="color:var(--sky-200)">Tiến độ tuần này</span>
      <div style="display:flex;align-items:baseline;gap:8px"><span class="display">${total}</span><span style="color:var(--sky-200)">/ ${s.weekly_goal} nhiệm vụ</span></div>
      ${s.members.map((m) => `<div style="display:flex;flex-direction:column;gap:8px"><div style="display:flex;justify-content:space-between"><b>${esc((m.parent_role || '') + ' ' + m.name)}</b><span class="small" style="color:var(--sky-200)">${m.week_count} nhiệm vụ</span></div><div class="progress"><i style="width:${Math.min(100, m.week_count / s.weekly_goal * 100)}%"></i></div></div>`).join('')}
      <a class="btn btn-secondary" style="align-self:flex-start" href="/nhiem-vu">Làm nhiệm vụ hôm nay ${icon('arrow', 18)}</a>`;
    const earned = s.badges.filter((b) => b.earned).length;
    document.getElementById('badges').innerHTML = `<div class="panel-title"><h2 class="h4">Huy hiệu</h2><span class="small" style="color:var(--sky-700);font-weight:600">${earned}/${s.badges.length}</span></div>
      <div class="badge-grid">${s.badges.map((b) => `<div class="badge ${b.earned ? '' : 'locked'}" title="${esc(b.desc)}"><span class="ic">${icon(b.earned ? 'trophy' : 'lock', 22)}</span>${esc(b.name)}</div>`).join('')}</div>`;
  }

  // Nhãn ngày: Hôm qua / Hôm nay / Ngày mai / Ngày mốt / Thứ x, dd/mm/yyyy
  const WD = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  function dayLabel(d) {
    const n = Math.round((new Date(d + 'T00:00:00Z') - new Date(todayStr() + 'T00:00:00Z')) / 864e5);
    return { n, text: ({ '-1': 'Hôm qua', 0: 'Hôm nay', 1: 'Ngày mai', 2: 'Ngày mốt' })[n] || `${WD[new Date(d + 'T00:00:00Z').getUTCDay()]}, ${fmtDate(d)}` };
  }
  async function loadDaily() {
    const r = await api('/api/activities?date=' + dailyDate);
    const el = document.getElementById('daily');
    const { n, text } = dayLabel(dailyDate); const future = n > 0;
    el.innerHTML = `<div class="panel-title"><h2 class="h4">${future ? 'Kế hoạch' : 'Hoạt động'} - ${text}</h2><div class="chips">${n !== 0 ? '<button class="btn btn-ghost btn-sm" data-day="today">Hôm nay</button>' : ''}<button class="icon-btn sm" data-day="-1" aria-label="Ngày trước">‹</button><input type="date" class="input" id="day-pick" value="${dailyDate}" style="width:auto;min-height:34px;padding:4px 10px" aria-label="Chọn ngày"><button class="icon-btn sm" data-day="1" aria-label="Ngày sau">›</button></div></div>
      ${future ? '<p class="small muted" style="margin:0 0 4px">Ngày chưa tới: bạn có thể lên kế hoạch trước, đến ngày đó mới đánh dấu hoàn thành được.</p>' : ''}
      <div style="display:flex;flex-direction:column;gap:10px">${r.items.map((a) => `<div class="act-row ${a.done ? 'done' : ''}"><button class="tick ${a.done ? 'on' : ''}" data-toggle="${a.id}" data-done="${a.done}" ${future ? 'disabled title="Chưa tới ngày này"' : ''} aria-label="Đánh dấu">${a.done ? icon('check', 16, 3) : ''}</button>
        <div class="t"><b style="font-weight:500">${esc(a.title)}</b>${a.done && a.done_by_name ? `<div class="small muted">${esc(a.done_by_name)}</div>` : ''}</div><button class="icon-btn sm" style="border:0" data-del-act="${a.id}" aria-label="Xóa">${icon('trash', 16)}</button></div>`).join('')
        || `<p class="muted" style="margin:0">${future ? 'Chưa có kế hoạch nào cho ngày này.' : n === 0 ? 'Chưa có hoạt động nào hôm nay.' : 'Không có hoạt động nào được ghi nhận trong ngày này.'}</p>`}
      <button class="dashed-btn" id="add-act">${icon('plus', 18)} ${future ? 'Thêm kế hoạch' : 'Ghi nhận hoạt động mới'}</button></div>`;
  }

  async function loadCalendar() {
    const base = new Date(todayStr() + 'T00:00:00Z'); const dow = (base.getUTCDay() + 6) % 7;
    const mon = new Date(base); mon.setUTCDate(base.getUTCDate() - dow + weekOffset * 7);
    const days = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setUTCDate(mon.getUTCDate() + i); return d.toISOString().slice(0, 10); });
    const r = await api(`/api/events?from=${days[0]}&to=${days[6]}`);
    const names = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    document.getElementById('calendar').innerHTML = `<div class="panel-title"><h2 class="h4">Lịch chung - ${fmtDate(days[0]).slice(0, 5)} – ${fmtDate(days[6]).slice(0, 5)}</h2>
      <div class="chips"><button class="icon-btn sm" data-week="-1" aria-label="Tuần trước">‹</button><button class="chip" data-week="0">Tuần này</button><button class="icon-btn sm" data-week="1" aria-label="Tuần sau">›</button><button class="btn btn-sm" id="add-ev">${icon('plus', 16)} Thêm lịch</button></div></div>
      <div class="week">${days.map((d, i) => `<div class="day ${d === todayStr() ? 'today' : ''}"><span class="d">${names[i]}</span><span class="num">${d.slice(8)}</span>
        ${r.items.filter((e) => e.date === d).map((e) => `<div class="ev ${e.type}" title="${esc(e.note || '')}">${e.time ? esc(e.time) + ' ' : ''}${esc(e.title)}<button data-del-ev="${e.id}" aria-label="Xóa">×</button></div>`).join('')}</div>`).join('')}</div>
      <p class="small muted" style="margin:12px 0 0">Cam: tiêm chủng · Xanh lá: khám sức khỏe · Trắng: hoạt động khác</p>`;
  }

  async function loadMemories() {
    const r = await api('/api/memories');
    document.getElementById('memories').innerHTML = `<div class="panel-title"><h2 class="h4">Kỷ niệm gia đình</h2><span class="small muted">${r.items.length} khoảnh khắc</span></div>
      <div class="mem-grid">${r.items.slice(0, 11).map((m) => `<figure class="mem" style="margin:0">${cover(m.photo, 'image', '', 36)}<figcaption class="small" style="font-weight:500;margin-top:8px">${esc(m.caption)}</figcaption><span class="small muted">${fmtDate(m.date)} · ${esc(m.user_name || '')}</span><button class="icon-btn sm del" data-del-mem="${m.id}" aria-label="Xóa">${icon('trash', 14)}</button></figure>`).join('')}
      <button class="dashed-btn" id="add-mem" style="flex-direction:column;min-height:150px">${icon('plus', 24)} Thêm</button></div>`;
  }

  root.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    try {
      if (t.dataset.day) { if (t.dataset.day === 'today') dailyDate = todayStr(); else { const d = new Date(dailyDate + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + Number(t.dataset.day)); dailyDate = d.toISOString().slice(0, 10); } return loadDaily(); }
      if (t.dataset.week) { weekOffset = t.dataset.week === '0' ? 0 : weekOffset + Number(t.dataset.week); return loadCalendar(); }
      if (t.dataset.toggle) { await api('/api/activities/' + t.dataset.toggle, { method: 'PUT', body: { done: t.dataset.done !== '1' } }); return loadDaily(); }
      if (t.dataset.delAct) { if (confirm('Xóa hoạt động này?')) { await api('/api/activities/' + t.dataset.delAct, { method: 'DELETE' }); loadDaily(); } return; }
      if (t.dataset.delEv) { if (confirm('Xóa lịch này?')) { await api('/api/events/' + t.dataset.delEv, { method: 'DELETE' }); loadCalendar(); } return; }
      if (t.dataset.delMem) { if (confirm('Xóa khoảnh khắc này?')) { await api('/api/memories/' + t.dataset.delMem, { method: 'DELETE' }); loadMemories(); } return; }
      if (t.id === 'add-act') { const fut = dayLabel(dailyDate).n > 0; modal({ title: fut ? 'Thêm kế hoạch – ' + dayLabel(dailyDate).text : 'Ghi nhận hoạt động – ' + dayLabel(dailyDate).text, submitText: fut ? 'Thêm kế hoạch' : 'Ghi nhận',
        html: `<label class="field">Hoạt động<input name="title" required maxlength="200" list="quick" placeholder="VD: Cho bé tắm nắng"></label><datalist id="quick">${['Cho bé ăn dặm', 'Đọc sách cùng bé', 'Chơi vận động cùng bé', 'Tắm cho bé', 'Kiểm tra lịch tiêm chủng'].map((q) => `<option value="${q}">`).join('')}</datalist>${fut ? '' : '<label class="check"><input type="checkbox" name="done" checked> Đã hoàn thành</label>'}`,
        onSubmit: async (fm) => { await api('/api/activities', { method: 'POST', body: { title: fm.title.value, done: !fut && fm.done.checked, date: dailyDate } }); toast(fut ? 'Đã thêm kế hoạch' : 'Đã ghi nhận hoạt động'); loadDaily(); } }); }
      if (t.id === 'add-ev') modal({ title: 'Thêm lịch gia đình', submitText: 'Thêm lịch',
        html: `<div class="form-grid"><label class="field full">Nội dung<input name="title" required maxlength="200" placeholder="VD: Đưa bé đi tiêm"></label><label class="field">Ngày<input type="date" name="date" required value="${todayStr()}"></label><label class="field">Giờ<input type="time" name="time"></label>
          <label class="field full">Loại<select name="type"><option value="activity">Hoạt động</option><option value="vaccine">Tiêm chủng</option><option value="checkup">Khám sức khỏe</option><option value="other">Khác</option></select></label><label class="field full">Ghi chú<textarea name="note" maxlength="500"></textarea></label></div>`,
        onSubmit: async (fm) => { await api('/api/events', { method: 'POST', body: { title: fm.title.value, date: fm.date.value, time: fm.time.value, type: fm.type.value, note: fm.note.value } }); toast('Đã thêm lịch'); loadCalendar(); } });
      if (t.id === 'add-mem') {
        let photo = '';
        const fm = modal({ title: 'Thêm khoảnh khắc', submitText: 'Lưu khoảnh khắc',
          html: `<label class="field">Mô tả<input name="caption" required maxlength="300" placeholder="VD: Lần đầu bé tự ngồi"></label><label class="field">Ngày<input type="date" name="date" value="${todayStr()}" max="${todayStr()}"></label><label class="field">Ảnh<input type="file" name="photo" accept="image/*"></label><img id="pv" hidden alt="" style="max-width:240px;border-radius:14px">`,
          onSubmit: async (x) => { await api('/api/memories', { method: 'POST', body: { caption: x.caption.value, date: x.date.value, photo } }); toast('Đã lưu khoảnh khắc'); loadMemories(); } });
        fm.photo.addEventListener('change', async () => { try { photo = await compressImage(fm.photo.files[0]); const pv = fm.querySelector('#pv'); pv.src = photo; pv.hidden = false; } catch (ex) { toast(ex.message, true); } });
      }
    } catch (ex) { toast(ex.message, true); }
  });
  root.addEventListener('change', (e) => { if (e.target.id === 'day-pick' && e.target.value) { dailyDate = e.target.value; loadDaily(); } });
  try { await Promise.all([loadSummary(), loadDaily(), loadCalendar(), loadMemories()]); } catch (e) { toast(e.message, true); }
});
