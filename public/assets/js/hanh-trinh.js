// Hành trình làm cha mẹ: hồ sơ bé, giai đoạn, trọng tâm, cột mốc, gợi ý đọc (lộ trình), checklist, nhắc lịch
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, toast, modal, loginHint, fmtDate, todayStr, localRead } = BT;
  const $ = (id) => document.getElementById(id);
  const STAGES = {
    pregnancy: { name: 'Mang thai', sub: 'Thai kỳ', icon: 'heart',
      focus: [['utensils', 'Dinh dưỡng thai kỳ', 'Ăn đa dạng, bổ sung vi chất theo chỉ định'], ['stetho', 'Khám thai', 'Đi khám đúng lịch hẹn'], ['bulb', 'Tiểu đường thai kỳ', 'Tầm soát khoảng tuần 24–28'], ['heart', 'Chuẩn bị sinh', 'Đồ đi sinh, dấu hiệu chuyển dạ']],
      ms: [[13, '3 tháng đầu', ['Khám thai lần đầu', 'Bổ sung axit folic, sắt', 'Nghỉ ngơi, ăn đủ chất']], [27, '3 tháng giữa', ['Siêu âm, xét nghiệm theo lịch', 'Tầm soát tiểu đường thai kỳ', 'Cảm nhận cử động thai']], [40, '3 tháng cuối', ['Theo dõi cử động thai', 'Chuẩn bị đồ đi sinh', 'Nhận biết dấu hiệu chuyển dạ']]],
      cl: [['preg-visits', 'Khám thai định kỳ theo lịch hẹn'], ['preg-supplement', 'Bổ sung sắt, axit folic theo chỉ định'], ['preg-gdm', 'Tìm hiểu xét nghiệm tiểu đường thai kỳ'], ['preg-labor', 'Tìm hiểu dấu hiệu chuyển dạ'], ['preg-bag', 'Chuẩn bị giấy tờ và đồ dùng đi sinh'], ['preg-dad', 'Bố cùng mẹ đi một buổi khám thai']] },
    '0-6': { name: '0 – 6 tháng', sub: 'Sơ sinh', icon: 'bottle',
      focus: [['bottle', 'Bú mẹ', 'Bú theo nhu cầu 8–12 lần/ngày'], ['baby', 'Chăm sóc rốn', 'Giữ rốn sạch và khô'], ['moon', 'Giấc ngủ', 'Nằm ngửa, chỗ ngủ thông thoáng'], ['syringe', 'Tiêm chủng', 'Các mũi 2, 3, 4 tháng']],
      ms: [[2, 'Khoảng 2 tháng', ['Ngẩng đầu khi nằm sấp', 'Cười đáp lại', 'Nhìn theo khuôn mặt']], [4, 'Khoảng 4 tháng', ['Giữ đầu vững', 'Với tay lấy đồ vật', 'Cười thành tiếng']], [6, 'Khoảng 6 tháng', ['Lẫy, ngồi có hỗ trợ', 'Bập bẹ nhiều âm', 'Nhận ra người quen']]],
      cl: [['b0-breastfeed', 'Tìm hiểu cách cho bé bú mẹ hoàn toàn'], ['b0-cord', 'Học cách chăm sóc rốn cho bé'], ['b0-vaccine', 'Ghi lịch tiêm chủng vào lịch gia đình'], ['b0-danger', 'Ghi nhớ dấu hiệu nguy hiểm ở trẻ sơ sinh'], ['b0-sleep', 'Cho bé nằm ngửa khi ngủ'], ['b0-mom', 'Mẹ đi khám sức khỏe sau sinh']] },
    '6-12': { name: '6 – 12 tháng', sub: 'Ăn dặm', icon: 'sprout',
      focus: [['utensils', 'Ăn dặm', '2–3 bữa/ngày, tăng dần độ đặc'], ['foot', 'Vận động', 'Ngồi vững, tập bò'], ['message', 'Giao tiếp', 'Bập bẹ “ba ba”, “ma ma”'], ['syringe', 'Tiêm chủng', 'Mũi sởi lúc 9 tháng']],
      ms: [[6, '6 tháng', ['Lẫy, giữ đầu vững', 'Ngồi có hỗ trợ', 'Phản ứng khi được gọi tên']], [9, '9 tháng', ['Ngồi vững, bắt đầu bò', 'Bập bẹ “ba ba”, “ma ma”', 'Có thể sợ người lạ']], [12, '12 tháng', ['Vịn đứng, đi men', 'Vẫy tay tạm biệt', 'Nhặt vật nhỏ bằng 2 ngón']]],
      cl: [['b6-weaning', 'Tìm hiểu về ăn dặm'], ['b6-tools', 'Chuẩn bị dụng cụ ăn uống'], ['b6-vaccine', 'Kiểm tra lịch tiêm chủng'], ['b6-safe', 'Tạo không gian an toàn để bé tập bò'], ['b6-read', 'Đọc sách tranh cùng bé mỗi ngày']] },
    '12-24': { name: '12 – 24 tháng', sub: 'Tập đi, nói', icon: 'foot',
      focus: [['utensils', 'Dinh dưỡng', 'Ăn cùng bữa gia đình'], ['message', 'Ngôn ngữ', 'Trò chuyện, đọc sách mỗi ngày'], ['foot', 'Vận động', 'Đi vững, leo trèo'], ['bulb', 'Nhận thức', 'Chơi xếp hình, bắt chước']],
      ms: [[15, 'Khoảng 15 tháng', ['Tự đi vài bước', 'Nói vài từ đơn', 'Chỉ tay vào thứ muốn']], [18, 'Khoảng 18 tháng', ['Đi vững, thích leo trèo', 'Làm theo yêu cầu đơn giản', 'Bắt chước việc nhà']], [24, 'Khoảng 24 tháng', ['Chạy, đá bóng', 'Nói câu ngắn 2 từ', 'Chỉ vào tranh khi được hỏi']]],
      cl: [['b12-meal', 'Cho bé ăn cùng bữa với gia đình'], ['b12-talk', 'Đọc sách và trò chuyện mỗi ngày'], ['b12-screen', 'Hạn chế cho bé xem màn hình'], ['b12-vaccine', 'Kiểm tra các mũi tiêm nhắc lại'], ['b12-safety', 'Kiểm tra an toàn trong nhà']] },
  };
  const ORDER = ['pregnancy', '0-6', '6-12', '12-24'];
  let me = await getMe();
  let child = (me.children || [])[0];
  const LS = 'bt_journey';
  let info = null; // {mode, date}
  if (child) info = child.birth_date ? { mode: 'born', date: child.birth_date } : { mode: 'pregnant', date: child.due_date };
  else { try { info = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (_) { /* */ } }

  function classify(inf) {
    if (!inf || !inf.date) return null;
    const d = new Date(inf.date + 'T00:00:00+07:00');
    if (inf.mode === 'pregnant') { const left = Math.round((d - Date.now()) / 864e5); return { stage: 'pregnancy', week: Math.max(1, Math.min(42, 40 - Math.floor(left / 7))), left }; }
    const days = Math.floor((Date.now() - d) / 864e5); const months = Math.floor(days / 30.44);
    return { stage: days < 0 ? 'pregnancy' : months < 6 ? '0-6' : months < 12 ? '6-12' : '12-24', months, days };
  }
  let cls = classify(info);
  let view = new URLSearchParams(location.search).get('stage') || (cls ? cls.stage : '0-6');
  if (!STAGES[view]) view = '0-6';

  function renderProfile() {
    const p = $('profile');
    if (cls) {
      const nm = child ? child.name : 'Bé nhà bạn';
      const tiles = cls.stage === 'pregnancy' && info.mode === 'pregnant'
        ? [[cls.week, 'tuần thai'], [Math.max(cls.left, 0), 'ngày nữa gặp bé'], ['Mang thai', 'giai đoạn']]
        : [[cls.months, 'tháng tuổi'], [cls.days, 'ngày bên ba mẹ'], [STAGES[cls.stage].name.replace(/ /g, ''), 'giai đoạn']];
      p.innerHTML = `<div style="display:flex;gap:16px;align-items:center"><span class="ib xl" style="background:linear-gradient(135deg,var(--sky-300),var(--sky-600));color:#fff">${icon('baby', 36, 1.6)}</span>
        <div><h2 class="h3">${esc(nm)}</h2><span class="small muted">${info.mode === 'pregnant' ? 'Dự sinh ' : 'Sinh ngày '}${fmtDate(info.date)}${child && child.gender ? ' · ' + esc(child.gender) : ''}</span></div></div>
        <div class="stat-tiles">${tiles.map(([n, l]) => `<div><b>${esc(n)}</b><span>${l}</span></div>`).join('')}</div>
        <div style="display:flex;gap:10px"><button class="btn btn-secondary btn-block" id="edit-info">${icon('calendar', 18)} Đổi ngày sinh / dự sinh</button></div>`;
      $('edit-info').onclick = askDate;
    } else {
      p.innerHTML = `<h2 class="h3">Bé nhà bạn bao nhiêu tuổi?</h2><p class="small muted" style="margin:0">Nhập ngày sinh (hoặc ngày dự sinh) để nhận gợi ý đúng giai đoạn.</p>
        <button class="btn btn-block" id="edit-info">${icon('calendar', 18)} Nhập thông tin của bé</button>`;
      $('edit-info').onclick = askDate;
    }
  }
  function askDate() {
    modal({ title: 'Thông tin của bé', submitText: 'Xem gợi ý',
      html: `<div class="tabs-line" style="margin:0"><button type="button" data-m="born" class="${!info || info.mode === 'born' ? 'active' : ''}">Bé đã chào đời</button><button type="button" data-m="pregnant" class="${info && info.mode === 'pregnant' ? 'active' : ''}">Đang mang thai</button></div>
        <label class="field"><span id="dl">${info && info.mode === 'pregnant' ? 'Ngày dự sinh' : 'Ngày sinh của bé'}</span><input type="date" name="date" required value="${info ? esc(info.date) : ''}"></label>
        ${me.user && me.family && !child ? '<label class="field">Tên hoặc biệt danh (để lưu vào hồ sơ gia đình)<input name="name" placeholder="VD: Bống"></label>' : ''}`,
      onSubmit: async (f) => {
        const mode = f.querySelector('[data-m].active').dataset.m;
        info = { mode, date: f.date.value };
        try { localStorage.setItem(LS, JSON.stringify(info)); } catch (_) { /* */ }
        if (f.name && f.name.value.trim()) { await api('/api/children', { method: 'POST', body: { name: f.name.value, [mode === 'born' ? 'birth_date' : 'due_date']: info.date } }); me = await getMe(true); child = (me.children || [])[0]; toast('Đã lưu thông tin bé vào hồ sơ gia đình'); }
        else if (child) { await api('/api/children/' + child.id, { method: 'PUT', body: { name: child.name, gender: child.gender, birth_date: mode === 'born' ? info.date : '', due_date: mode === 'pregnant' ? info.date : '' } }); me = await getMe(true); child = me.children[0]; }
        cls = classify(info); view = cls.stage; renderAll();
      },
    });
    const f = document.querySelector('.modal');
    f.querySelectorAll('[data-m]').forEach((b) => b.onclick = () => { f.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('active', x === b)); f.querySelector('#dl').textContent = b.dataset.m === 'born' ? 'Ngày sinh của bé' : 'Ngày dự sinh'; });
  }

  function renderTimeline() {
    const cur = cls ? ORDER.indexOf(cls.stage) : -1;
    $('timeline').innerHTML = ORDER.map((k, i) => `<button type="button" data-st="${k}" class="${k === view ? 'on' : i < cur ? 'done' : ''}">
      <span class="tic">${icon(i < cur && k !== view ? 'check' : STAGES[k].icon, 20)}</span><span><b>${STAGES[k].name}</b><span>${k === (cls && cls.stage) ? 'Bé đang ở đây' : i < cur ? 'Đã qua' : STAGES[k].sub}</span></span></button>`).join('');
    $('timeline').querySelectorAll('[data-st]').forEach((b) => b.onclick = () => { view = b.dataset.st; renderAll(false); });
  }

  async function renderStage() {
    const s = STAGES[view];
    $('focus').innerHTML = s.focus.map(([ic, t, d]) => `<div class="focus-card"><span class="ib white">${icon(ic, 22)}</span><b class="h4">${t}</b><p>${d}</p></div>`).join('');
    $('focus-link').href = '/kien-thuc?age=' + view;
    const val = view === 'pregnancy' ? (cls && cls.stage === 'pregnancy' ? cls.week : null) : (cls && cls.stage !== 'pregnancy' ? cls.months : null);
    let nowSet = false;
    $('milestones').innerHTML = s.ms.map(([at, t, items]) => {
      let st = 'next';
      if (val != null) { if (val >= at) st = 'done'; else if (!nowSet) { st = 'now'; nowSet = true; } }
      return `<div class="ms-row ${st}"><span class="ms-dot">${st === 'done' ? icon('check', 16, 3) : st === 'now' ? icon('sprout', 16) : ''}</span>
        <div><b class="h4">${t}</b><div class="small ${st === 'now' ? '' : 'muted'}" style="${st === 'now' ? 'color:var(--sky-700)' : ''}">${st === 'done' ? 'Đã qua' : st === 'now' ? 'Hiện tại' : 'Sắp tới'}</div></div>
        <div class="chips">${items.map((x) => `<span class="chip" style="cursor:default">${esc(x)}</span>`).join('')}</div></div>`;
    }).join('');
    // Gợi ý đọc: ưu tiên lộ trình của giai đoạn
    $('read-title').textContent = 'Gợi ý đọc cho giai đoạn ' + s.name;
    $('read-link').href = '/kien-thuc?age=' + view;
    const [paths, arts] = await Promise.all([api('/api/paths?age=' + view).catch(() => ({ items: [] })), api(`/api/articles?age=${view}&limit=5`).catch(() => ({ items: [] }))]);
    const local = localRead.get();
    let html = '';
    const p = paths.items[0];
    if (p) {
      const items = p.articles.map((a) => ({ ...a, is_read: a.is_read || local.includes(a.id) }));
      const done = items.filter((a) => a.is_read).length;
      html += `<div class="card tint" style="padding:22px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px"><div><span class="label">Lộ trình đọc</span><div class="h4">${esc(p.title)}</div></div><span class="small" style="font-weight:600;color:var(--sky-700)">${done}/${items.length}</span></div>
        ${items.map((a) => `<a class="list-link" href="/bai-viet/${encodeURIComponent(a.slug)}" style="padding:10px 0"><span class="ib sm ${a.is_read ? 'accent' : 'white'}">${a.is_read ? icon('check', 16, 3) : `<b class="small">${a.position}</b>`}</span><span class="t"><b class="clamp-1">${esc(a.title)}</b></span>${icon('arrow', 18)}</a>`).join('')}</div>`;
    }
    const pIds = p ? p.articles.map((a) => a.id) : [];
    const extra = arts.items.filter((a) => !pIds.includes(a.id)).slice(0, 3);
    html += extra.map((a) => `<a class="list-link" href="/bai-viet/${encodeURIComponent(a.slug)}"><span class="cover th">${icon(BT.CAT_ICON[a.category], 28, 1.6)}</span><span class="t"><b class="h4 clamp-2">${esc(a.title)}</b><span class="small muted">${esc(BT.CAT_SHORT[a.category])} · ${esc(a.source_name || '')}</span></span>${icon('arrow', 20)}</a>`).join('');
    $('suggest').innerHTML = html || '<div class="empty">Chưa có bài viết cho giai đoạn này.</div>';
    await renderChecklist();
  }

  async function renderChecklist() {
    const s = STAGES[view];
    let done = [];
    if (me.user) { try { done = (await api('/api/checklist')).done; } catch (_) { /* */ } }
    else { try { done = JSON.parse(localStorage.getItem('bt_checklist') || '[]'); } catch (_) { /* */ } }
    const update = () => { const n = s.cl.filter(([k]) => done.includes(k)).length; $('cl-count').textContent = `${n}/${s.cl.length}`; $('cl-bar').style.width = (n / s.cl.length * 100) + '%'; };
    $('checklist').innerHTML = s.cl.map(([k, t]) => `<label><input type="checkbox" data-key="${k}" ${done.includes(k) ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('');
    $('cl-note').textContent = me.user ? (me.family ? 'Checklist được chia sẻ với cả gia đình.' : '') : 'Đăng nhập để lưu checklist và chia sẻ với bố/mẹ.';
    update();
    $('checklist').onchange = async (e) => {
      const k = e.target.dataset.key; if (!k) return;
      done = e.target.checked ? [...new Set([...done, k])] : done.filter((x) => x !== k); update();
      if (me.user) { try { await api('/api/checklist', { method: 'POST', body: { key: k, done: e.target.checked } }); } catch (ex) { toast(ex.message, true); } }
      else localStorage.setItem('bt_checklist', JSON.stringify(done));
    };
  }

  async function renderReminders() {
    const box = $('nhac-lich');
    const head = `<div style="display:flex;justify-content:space-between;align-items:center"><h2 class="h4">Nhắc lịch sức khỏe</h2>${me.family ? `<button class="icon-btn sm" id="add-rem" style="background:var(--sky-800);border:0;color:#fff" aria-label="Thêm lịch">${icon('plus', 18)}</button>` : ''}</div>`;
    if (!me.user) { box.innerHTML = head + `<p style="margin:0;color:var(--sky-200)">Đăng nhập để thiết lập nhắc lịch tiêm chủng và lịch khám cho bé.</p><a class="btn btn-secondary" href="/tai-khoan?next=/hanh-trinh">Đăng nhập</a>`; return; }
    if (!me.family) { box.innerHTML = head + `<p style="margin:0;color:var(--sky-200)">Tạo hồ sơ gia đình để cả bố và mẹ cùng nhận nhắc lịch.</p><a class="btn btn-secondary" href="/tai-khoan">Tạo gia đình</a>`; return; }
    let items = [];
    try { items = (await api('/api/events?from=' + todayStr())).items.filter((e) => e.type === 'vaccine' || e.type === 'checkup'); } catch (_) { /* */ }
    box.innerHTML = head + (items.length ? items.slice(0, 6).map((e) => {
      const days = Math.round((new Date(e.date) - new Date(todayStr())) / 864e5);
      return `<div class="rem-item"><span class="ib sm" style="background:var(--sky-800);color:var(--sky-300)">${icon(e.type === 'vaccine' ? 'syringe' : 'stetho', 18)}</span><div class="t"><b>${esc(e.title)}</b><span>${fmtDate(e.date)}${e.time ? ' · ' + esc(e.time) : ''}</span></div>${days <= 3 ? `<span class="tag" style="background:var(--sky-500);color:#fff">${days === 0 ? 'Hôm nay' : 'Còn ' + days + ' ngày'}</span>` : ''}</div>`;
    }).join('') : '<p style="margin:0;color:var(--sky-200)">Chưa có lịch tiêm chủng hoặc lịch khám sắp tới.</p>');
    $('add-rem').onclick = () => modal({ title: 'Thêm nhắc lịch', submitText: 'Thêm lịch',
      html: `<div class="form-grid"><label class="field full">Nội dung<input name="title" required maxlength="200" placeholder="VD: Tiêm vắc xin 2 tháng tuổi"></label>
        <label class="field">Ngày<input type="date" name="date" required min="${todayStr()}"></label><label class="field">Giờ<input type="time" name="time"></label>
        <label class="field full">Loại<select name="type"><option value="vaccine">Tiêm chủng</option><option value="checkup">Khám sức khỏe</option></select></label></div>`,
      onSubmit: async (f) => { await api('/api/events', { method: 'POST', body: { title: f.title.value, date: f.date.value, time: f.time.value, type: f.type.value } }); toast('Đã thêm nhắc lịch'); renderReminders(); } });
  }

  function renderAll() { renderProfile(); renderTimeline(); renderStage(); }
  renderAll(); renderReminders();
});
