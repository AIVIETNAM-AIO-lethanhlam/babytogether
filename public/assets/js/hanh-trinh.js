// Hành trình làm cha mẹ: phân loại giai đoạn, gợi ý, cột mốc, checklist, nhắc lịch
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ph, ICONS, toast, loginHint, fmtDate, todayStr } = BT;
  const $ = (id) => document.getElementById(id);

  const STAGES = {
    pregnancy: {
      title: 'Hành trình mang thai', tagline: 'Chuẩn bị đón bé yêu!', icon: 'heart',
      steps: [
        ['Dinh dưỡng thai kỳ', '/kien-thuc?age=pregnancy&category=nutrition'],
        ['Khám thai', '/kien-thuc?age=pregnancy&category=maternal-care'],
        ['Tiểu đường thai kỳ', '/kien-thuc?q=ti%E1%BB%83u%20%C4%91%C6%B0%E1%BB%9Dng'],
        ['Chuẩn bị sinh', '/kien-thuc?age=pregnancy'],
      ],
      checklist: [
        ['preg-visits', 'Khám thai định kỳ theo lịch hẹn của bác sĩ'],
        ['preg-supplement', 'Bổ sung sắt, axit folic theo chỉ định'],
        ['preg-gdm', 'Tìm hiểu về xét nghiệm tiểu đường thai kỳ'],
        ['preg-labor', 'Tìm hiểu các dấu hiệu chuyển dạ'],
        ['preg-bag', 'Chuẩn bị giấy tờ và đồ dùng đi sinh'],
        ['preg-dad', 'Bố cùng mẹ tham gia một buổi khám thai'],
      ],
      milestones: [
        ['3 tháng đầu (đến tuần 13)', ['Khám thai lần đầu, xác định tuổi thai', 'Bổ sung axit folic, sắt theo chỉ định', 'Nghỉ ngơi, ăn uống đủ chất dù có thể ốm nghén']],
        ['3 tháng giữa (tuần 14–27)', ['Siêu âm, xét nghiệm theo lịch khám thai', 'Tầm soát tiểu đường thai kỳ thường vào khoảng tuần 24–28', 'Mẹ bắt đầu cảm nhận cử động của thai']],
        ['3 tháng cuối (tuần 28–40)', ['Theo dõi cử động thai mỗi ngày', 'Chuẩn bị đồ đi sinh, kế hoạch nơi sinh', 'Nhận biết dấu hiệu chuyển dạ và dấu hiệu nguy hiểm']],
      ],
    },
    '0-6': {
      title: 'Bé 0 – 6 tháng tuổi', tagline: 'Những tháng đầu đời yêu thương!', icon: 'baby',
      steps: [
        ['Chăm sóc trẻ sơ sinh', '/kien-thuc?age=0-6&category=baby-care'],
        ['Bú mẹ', '/kien-thuc?age=0-6&category=nutrition'],
        ['Giấc ngủ', '/kien-thuc?q=ng%E1%BB%A7'],
        ['Tiêm chủng', '/kien-thuc?category=vaccination'],
      ],
      checklist: [
        ['b0-breastfeed', 'Tìm hiểu cách cho bé bú mẹ hoàn toàn'],
        ['b0-cord', 'Học cách chăm sóc rốn cho bé'],
        ['b0-vaccine', 'Ghi lịch tiêm chủng vào lịch gia đình'],
        ['b0-danger', 'Ghi nhớ dấu hiệu nguy hiểm ở trẻ sơ sinh'],
        ['b0-sleep', 'Cho bé nằm ngửa khi ngủ, chỗ ngủ thông thoáng'],
        ['b0-mom', 'Mẹ đi khám sức khỏe sau sinh'],
      ],
      milestones: [
        ['Khoảng 2 tháng', ['Ngẩng đầu khi nằm sấp', 'Cười đáp lại khi được trò chuyện', 'Nhìn theo khuôn mặt người thân']],
        ['Khoảng 4 tháng', ['Giữ đầu vững khi được bế', 'Với tay lấy đồ vật', 'Cười thành tiếng, ê a']],
        ['Khoảng 6 tháng', ['Lẫy, bắt đầu ngồi có hỗ trợ', 'Bập bẹ nhiều âm thanh', 'Nhận ra người quen']],
      ],
    },
    '6-12': {
      title: 'Bé 6 – 12 tháng tuổi', tagline: 'Khám phá thế giới xung quanh!', icon: 'baby',
      steps: [
        ['Dinh dưỡng & Ăn dặm', '/kien-thuc?age=6-12&category=nutrition'],
        ['Vận động & Phát triển', '/kien-thuc?age=6-12&category=baby-care'],
        ['Giao tiếp', '/kien-thuc?q=giao%20ti%E1%BA%BFp'],
        ['Tiêm chủng', '/kien-thuc?category=vaccination'],
      ],
      checklist: [
        ['b6-weaning', 'Tìm hiểu về ăn dặm'],
        ['b6-tools', 'Chuẩn bị dụng cụ ăn uống'],
        ['b6-vaccine', 'Kiểm tra lịch tiêm chủng'],
        ['b6-safe', 'Tạo không gian an toàn để bé tập bò'],
        ['b6-read', 'Đọc sách tranh cùng bé mỗi ngày'],
      ],
      milestones: [
        ['Khoảng 6 tháng', ['Lẫy, giữ đầu vững', 'Ngồi có hỗ trợ', 'Phản ứng khi được gọi tên']],
        ['Khoảng 9 tháng', ['Ngồi vững, bắt đầu bò', 'Bập bẹ “ba ba”, “ma ma”', 'Có thể sợ người lạ']],
        ['Khoảng 12 tháng', ['Vịn đứng, đi men theo đồ vật', 'Vẫy tay tạm biệt', 'Nhặt vật nhỏ bằng hai ngón tay']],
      ],
    },
    '12-24': {
      title: 'Bé 12 – 24 tháng tuổi', tagline: 'Bé tập đi, tập nói!', icon: 'family',
      steps: [
        ['Dinh dưỡng', '/kien-thuc?age=12-24&category=nutrition'],
        ['Giao tiếp', '/kien-thuc?age=12-24'],
        ['Vận động', '/kien-thuc?age=12-24&category=baby-care'],
        ['Phát triển nhận thức', '/kien-thuc?age=12-24'],
      ],
      checklist: [
        ['b12-meal', 'Cho bé ăn cùng bữa với gia đình (thức ăn phù hợp)'],
        ['b12-talk', 'Đọc sách và trò chuyện với bé mỗi ngày'],
        ['b12-screen', 'Hạn chế cho bé xem màn hình'],
        ['b12-vaccine', 'Kiểm tra các mũi tiêm nhắc lại theo lịch'],
        ['b12-safety', 'Kiểm tra an toàn trong nhà (ổ điện, cầu thang, hóa chất)'],
      ],
      milestones: [
        ['Khoảng 15 tháng', ['Tự đi được vài bước', 'Nói được vài từ đơn', 'Chỉ tay vào thứ mình muốn']],
        ['Khoảng 18 tháng', ['Đi vững hơn, thích leo trèo', 'Làm theo yêu cầu đơn giản', 'Bắt chước việc nhà']],
        ['Khoảng 24 tháng', ['Chạy, đá bóng', 'Nói câu ngắn 2 từ', 'Chỉ vào tranh khi được hỏi']],
      ],
    },
  };

  let mode = 'born';
  let stageKey = null;
  let me = await getMe();
  const child = (me.children || [])[0];
  const LS = 'bt_journey';

  // Chuyển chế độ bé đã sinh / mang thai
  document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  function setMode(m) {
    mode = m;
    document.querySelectorAll('.seg button').forEach((b) => b.classList.toggle('active', b.dataset.mode === m));
    $('date-label-text').textContent = m === 'born' ? 'Ngày sinh của bé' : 'Ngày dự sinh';
    const inp = $('date-input');
    if (m === 'born') { inp.max = todayStr(); inp.removeAttribute('min'); }
    else { inp.min = todayStr(); inp.removeAttribute('max'); }
  }
  setMode('born');

  function classify(m, date) {
    const d = new Date(date + 'T00:00:00+07:00');
    const now = new Date();
    if (m === 'pregnant') {
      const daysLeft = Math.round((d - now) / 864e5);
      const week = Math.max(1, Math.min(42, 40 - Math.floor(daysLeft / 7)));
      return { key: 'pregnancy', ageText: `Mẹ đang ở khoảng tuần thai thứ ${week}. Còn khoảng ${Math.max(daysLeft, 0)} ngày nữa là đến ngày dự sinh.` };
    }
    const days = Math.floor((now - d) / 864e5);
    if (days < 0) return { key: 'pregnancy', ageText: 'Ngày bạn nhập ở tương lai – có vẻ bé chưa chào đời.' };
    const months = Math.floor(days / 30.44);
    const ageText = months < 1 ? `Bé được ${days} ngày tuổi.` : `Bé được ${months} tháng tuổi.`;
    if (months < 6) return { key: '0-6', ageText };
    if (months < 12) return { key: '6-12', ageText };
    if (months < 24) return { key: '12-24', ageText };
    return { key: '12-24', ageText: ageText + ' Nội dung hiện tại tập trung đến 24 tháng, ba mẹ có thể tham khảo thêm.' };
  }

  $('journey-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = $('date-input').value;
    if (!date) return;
    try { localStorage.setItem(LS, JSON.stringify({ mode, date })); } catch (_) { /* */ }
    show(classify(mode, date));
    offerSave(date);
  });

  // Gợi ý lưu thông tin bé vào hồ sơ gia đình
  function offerSave(date) {
    const note = $('child-note');
    if (!me.user || !me.family || child) { note.hidden = true; return; }
    note.hidden = false;
    note.innerHTML = `<button type="button" class="btn-outline" id="save-child">${ICONS.plus} Lưu thông tin bé vào hồ sơ gia đình</button>`;
    $('save-child').onclick = () => {
      BT.modal({
        title: 'Lưu thông tin bé',
        html: `<label class="field">Tên hoặc biệt danh của bé<input name="name" required maxlength="100" placeholder="VD: Bống"></label>`,
        onSubmit: async (f) => {
          const body = { name: f.name.value, [mode === 'born' ? 'birth_date' : 'due_date']: date };
          await api('/api/children', { method: 'POST', body });
          toast('Đã lưu thông tin bé'); note.hidden = true; me = await getMe(true);
        },
      });
    };
  }

  async function show(res, scroll = true) {
    stageKey = res.key;
    const s = STAGES[res.key];
    $('journey-result').hidden = false;
    $('stage-title').textContent = s.title;
    $('stage-tagline').textContent = s.tagline;
    $('stage-age').textContent = res.ageText;
    $('stage-image').outerHTML = `<div class="ph" id="stage-image">${ICONS[s.icon]}</div>`;
    $('stage-steps').innerHTML = s.steps.map(([name, href], i) => `
      <a class="stage-step" href="${href}"><div class="divider"><span></span></div>
        <div class="num">0${i + 1}</div><div class="name">${esc(name)}</div></a>`).join('');
    $('milestones').innerHTML = s.milestones.map(([t, items]) => `
      <div class="milestone"><h3>${esc(t)}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
    $('more-suggestions').href = `/kien-thuc?age=${res.key}`;
    $('checklist-title').textContent = res.key === 'pregnancy' ? 'Checklist của mẹ bầu' : 'Checklist của ba mẹ';

    // Gợi ý bài viết theo độ tuổi
    $('suggestions').innerHTML = '<div class="loading">Đang tải…</div>';
    api(`/api/articles?age=${res.key}&limit=5`).then((r) => {
      $('suggestions').innerHTML = r.items.length ? r.items.map((a) => `
        <a href="/bai-viet/${encodeURIComponent(a.slug)}"><span>${esc(a.title)}${a.is_read ? ' <em class="muted">· đã đọc</em>' : ''}</span>${ICONS.arrow}</a>`).join('')
        : '<div class="empty">Chưa có bài viết cho giai đoạn này.</div>';
    }).catch(() => { $('suggestions').innerHTML = ''; });

    await renderChecklist(s);
    renderReminders();
    if (scroll) $('journey-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Checklist cá nhân hóa (lưu trên máy chủ nếu đã đăng nhập, ngược lại lưu trên trình duyệt)
  async function renderChecklist(s) {
    let done = [];
    if (me.user) { try { done = (await api('/api/checklist')).done; } catch (_) { /* */ } }
    else { try { done = JSON.parse(localStorage.getItem('bt_checklist') || '[]'); } catch (_) { /* */ } }
    $('checklist').innerHTML = s.checklist.map(([k, t]) => `
      <label><input type="checkbox" data-key="${k}" ${done.includes(k) ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('');
    $('checklist-note').textContent = me.user ? (me.family ? 'Checklist được chia sẻ với cả gia đình.' : '') : 'Đăng nhập để lưu checklist và chia sẻ với bố/mẹ.';
  }
  $('checklist').addEventListener('change', async (e) => {
    const k = e.target.dataset.key; if (!k) return;
    if (me.user) {
      try { await api('/api/checklist', { method: 'POST', body: { key: k, done: e.target.checked } }); }
      catch (ex) { toast(ex.message, true); e.target.checked = !e.target.checked; }
    } else {
      let done = []; try { done = JSON.parse(localStorage.getItem('bt_checklist') || '[]'); } catch (_) { /* */ }
      done = e.target.checked ? [...new Set([...done, k])] : done.filter((x) => x !== k);
      localStorage.setItem('bt_checklist', JSON.stringify(done));
    }
  });

  // Nhắc lịch tiêm chủng / khám
  async function renderReminders() {
    const list = $('reminders'), formWrap = $('reminder-form-wrap');
    if (!me.user) { list.innerHTML = loginHint('Đăng nhập để thiết lập nhắc lịch tiêm chủng và lịch khám cho bé.'); formWrap.innerHTML = ''; return; }
    if (!me.family) {
      list.innerHTML = `<div class="login-hint"><span class="body-text">Tạo hồ sơ gia đình để cả bố và mẹ cùng nhận nhắc lịch.</span><a class="btn" href="/tai-khoan">Tạo gia đình</a></div>`;
      formWrap.innerHTML = ''; return;
    }
    formWrap.innerHTML = `<form class="panel tint" id="rem-form">
      <div class="form-grid">
        <label class="field full">Nội dung<input name="title" required maxlength="200" placeholder="VD: Tiêm vắc xin 2 tháng tuổi"></label>
        <label class="field">Ngày<input type="date" name="date" required min="${todayStr()}"></label>
        <label class="field">Giờ<input type="time" name="time"></label>
        <label class="field full">Loại
          <select name="type"><option value="vaccine">Tiêm chủng</option><option value="checkup">Khám sức khỏe</option><option value="other">Khác</option></select></label>
      </div>
      <button class="btn" type="submit">Thêm nhắc lịch</button></form>`;
    $('rem-form').addEventListener('submit', async (e) => {
      e.preventDefault(); const f = e.target;
      try {
        await api('/api/events', { method: 'POST', body: { title: f.title.value, date: f.date.value, time: f.time.value, type: f.type.value } });
        f.reset(); toast('Đã thêm nhắc lịch – xem trong Lịch chung gia đình'); loadReminders();
      } catch (ex) { toast(ex.message, true); }
    });
    loadReminders();
  }
  async function loadReminders() {
    const list = $('reminders');
    try {
      const r = await api('/api/events?from=' + todayStr());
      const items = r.items.filter((e) => e.type === 'vaccine' || e.type === 'checkup');
      list.innerHTML = items.length ? `<div class="reminder-list">${items.slice(0, 8).map((e) => {
        const days = Math.round((new Date(e.date) - new Date(r.today)) / 864e5);
        return `<div class="reminder"><span class="date">${fmtDate(e.date)}</span>
          <span class="title">${e.type === 'vaccine' ? '💉' : '🩺'} ${esc(e.title)}${e.time ? ' · ' + esc(e.time) : ''}</span>
          ${days <= 3 ? `<span class="soon">${days === 0 ? 'Hôm nay' : `Còn ${days} ngày`}</span>` : ''}</div>`;
      }).join('')}</div>` : '<div class="empty">Chưa có lịch tiêm chủng hoặc lịch khám sắp tới.</div>';
    } catch (ex) { list.innerHTML = `<div class="empty">${esc(ex.message)}</div>`; }
  }

  // Tự điền từ hồ sơ bé hoặc lần nhập trước
  let saved = null;
  if (child) saved = child.birth_date ? { mode: 'born', date: child.birth_date } : { mode: 'pregnant', date: child.due_date };
  else { try { saved = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (_) { /* */ } }
  if (saved && saved.date) {
    setMode(saved.mode); $('date-input').value = saved.date;
    if (child) { $('child-note').hidden = false; $('child-note').textContent = `Đang hiển thị theo thông tin của bé ${child.name}.`; }
    const res = classify(saved.mode, saved.date);
    stageKey = res.key;
    show(res, false);
  }
});
