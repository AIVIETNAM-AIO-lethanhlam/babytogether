// Thử thách kiến thức (Quiz) + bảng xếp hạng
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ICONS, toast, loginHint, CATEGORIES } = BT;
  const box = document.getElementById('quiz');
  const SECONDS = 45;
  const me = await getMe();
  let qs = [], idx = 0, answers = [], picked = null, checked = false, timer = null, left = SECONDS, category = '';

  function startScreen() {
    box.innerHTML = `
      <div class="panel tint stack center" style="text-align:center">
        <div class="eyebrow">Knowledge Challenge</div>
        <h2 class="h2">Sẵn sàng chưa, ba mẹ?</h2>
        <p class="body-text">Mỗi lượt gồm 5 câu hỏi, mỗi câu ${SECONDS} giây. Trả lời đúng mỗi câu được <strong>10 điểm</strong> cho bạn và cho cả gia đình.</p>
        <div class="chips" id="topic" style="justify-content:center">
          <button type="button" class="chip active" data-c="">Tất cả chủ đề</button>
          ${Object.entries(CATEGORIES).map(([k, v]) => `<button type="button" class="chip" data-c="${k}">${esc(v)}</button>`).join('')}
        </div>
        <button class="btn btn-lg" id="start">Bắt đầu thử thách ${ICONS.arrow}</button>
        ${me.user ? '' : '<p class="meta">Bạn có thể chơi thử không cần đăng nhập. Đăng nhập để lưu điểm.</p>'}
      </div>`;
    box.querySelector('#topic').addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]'); if (!b) return;
      category = b.dataset.c;
      box.querySelectorAll('#topic .chip').forEach((c) => c.classList.toggle('active', c === b));
    });
    box.querySelector('#start').addEventListener('click', start);
  }

  async function start() {
    box.innerHTML = '<div class="loading">Đang chuẩn bị câu hỏi…</div>';
    try {
      const r = await api('/api/quiz?n=5' + (category ? '&category=' + category : ''));
      qs = r.questions;
      if (!qs.length) { box.innerHTML = '<div class="empty">Chưa có câu hỏi cho chủ đề này.</div>'; return; }
      idx = 0; answers = [];
      render();
    } catch (e) { box.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }

  function tick() {
    left--;
    const t = box.querySelector('.timer');
    if (t) { t.lastChild.textContent = ' 00:' + String(Math.max(left, 0)).padStart(2, '0'); t.classList.toggle('low', left <= 10); }
    if (left <= 0) { clearInterval(timer); check(true); }
  }

  function render() {
    const q = qs[idx];
    picked = null; checked = false; left = SECONDS;
    clearInterval(timer); timer = setInterval(tick, 1000);
    box.innerHTML = `
      <div class="quiz-top">
        <div class="row"><span>Câu ${idx + 1} / ${qs.length}</span><span class="timer">${ICONS.clock}<span> 00:${SECONDS}</span></span></div>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${qs.length}" aria-valuenow="${idx + 1}" aria-label="Tiến độ câu hỏi"><div style="width:${((idx + 1) / qs.length) * 100}%"></div></div>
      </div>
      <h2 class="question">${esc(q.question)}</h2>
      <div class="options">${q.options.map((o, i) => `
        <button type="button" class="option" data-i="${i}" aria-pressed="false"><span class="letter">${'ABCD'[i]}</span><span class="txt">${esc(o)}</span></button>`).join('')}
      </div>
      <div id="explain"></div>
      <div class="quiz-actions"><button class="btn" id="next" disabled>Kiểm tra ${ICONS.arrow}</button></div>`;
    box.querySelector('.options').addEventListener('click', (e) => {
      const b = e.target.closest('.option'); if (!b || checked) return;
      picked = Number(b.dataset.i);
      box.querySelectorAll('.option').forEach((o) => { const on = o === b; o.classList.toggle('selected', on); o.setAttribute('aria-pressed', on); });
      box.querySelector('#next').disabled = false;
    });
    box.querySelector('#next').addEventListener('click', () => (checked ? next() : check(false)));
  }

  async function check(timeout) {
    if (checked) return;
    checked = true; clearInterval(timer);
    const q = qs[idx];
    const btn = box.querySelector('#next'); btn.disabled = true;
    try {
      const r = await api('/api/quiz/check', { method: 'POST', body: { id: q.id, answer: picked == null ? -1 : picked } });
      answers.push({ id: q.id, answer: picked == null ? -1 : picked, correct: r.correct });
      box.querySelectorAll('.option').forEach((o) => {
        const i = Number(o.dataset.i); o.disabled = true; o.classList.remove('selected');
        if (i === r.correct_index) o.classList.add('correct');
        else if (i === picked) o.classList.add('wrong');
      });
      box.querySelector('#explain').innerHTML = `<div class="explain">
        <div class="verdict ${r.correct ? 'ok' : 'no'}">${r.correct ? '✓ Chính xác! +10 điểm' : timeout && picked == null ? '⏱ Hết giờ!' : '✗ Chưa đúng'}</div>
        <p class="body-text" style="font-size:17px">${esc(r.explanation)}</p>
        ${r.source ? `<span class="meta">Nguồn: ${esc(r.source)}</span>` : ''}</div>`;
      btn.innerHTML = (idx < qs.length - 1 ? 'Tiếp theo ' : 'Xem kết quả ') + ICONS.arrow;
      btn.disabled = false;
    } catch (e) { toast(e.message, true); checked = false; btn.disabled = false; }
  }

  function next() { if (idx < qs.length - 1) { idx++; render(); } else finish(); }

  async function finish() {
    const score = answers.filter((a) => a.correct).length;
    box.innerHTML = `<div class="panel tint stack center" style="text-align:center">
      <div class="eyebrow">Kết quả</div>
      <div class="score-big">${score}/${qs.length}</div>
      <p class="lead">${score === qs.length ? 'Tuyệt vời! Ba mẹ nắm kiến thức rất chắc.' : score >= qs.length / 2 ? 'Làm tốt lắm! Cùng đọc thêm để hoàn hảo hơn nhé.' : 'Không sao cả – mỗi lần chơi là một lần học thêm!'}</p>
      <div id="save-note"></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
        <button class="btn" id="again">Chơi lượt mới</button>
        <a class="btn-outline" href="/kien-thuc">Đọc thêm kiến thức</a>
      </div></div>`;
    box.querySelector('#again').addEventListener('click', startScreen);
    const note = box.querySelector('#save-note');
    if (!me.user) { note.innerHTML = loginHint('Đăng nhập để lưu điểm và cộng vào thành tích gia đình.'); return; }
    try {
      const r = await api('/api/quiz/submit', { method: 'POST', body: { answers: answers.map(({ id, answer }) => ({ id, answer })) } });
      note.innerHTML = `<p class="points">+${r.points} điểm đã được cộng${me.family ? ' cho gia đình' : ''}!</p>`;
      loadBoard();
    } catch (e) { note.innerHTML = `<p class="msg error">${esc(e.message)}</p>`; }
  }

  async function loadBoard() {
    try {
      const r = await api('/api/leaderboard');
      const myFam = me.family && me.family.id;
      document.getElementById('lb-families').innerHTML = r.families.length ? r.families.map((f, i) => `
        <div class="lb-row ${f.id === myFam ? 'me' : ''}"><span class="rank">${i + 1}</span>
        <span class="name">${esc(f.name)} <span class="muted" style="font-size:14px">(${f.members} thành viên)</span></span>
        <span class="pts">${f.points} điểm</span></div>`).join('') : '<div class="empty">Chưa có gia đình nào tham gia.</div>';
      const meBox = document.getElementById('lb-me');
      if (!r.me) { meBox.innerHTML = loginHint(); return; }
      meBox.innerHTML = `<div class="panel">
        <dl class="kv"><dt>Điểm quiz</dt><dd>${r.me.quiz}</dd><dt>Điểm nhiệm vụ</dt><dd>${r.me.missions}</dd><dt>Tổng cá nhân</dt><dd><strong>${r.me.total}</strong></dd></dl>
        ${r.me.members ? `<div><div class="eyebrow" style="margin-bottom:8px">Trong gia đình</div><div class="leaderboard">${r.me.members.map((m) => `
          <div class="lb-row ${m.id === me.user.id ? 'me' : ''}"><span class="name">${esc(m.name)} <span class="muted" style="font-size:14px">(${esc(m.parent_role || '')})</span></span><span class="pts">${m.points} điểm</span></div>`).join('')}</div></div>`
        : '<p class="meta">Tạo hoặc tham gia gia đình để tính điểm nhóm.</p>'}
      </div>`;
    } catch (e) { /* bỏ qua */ }
  }

  startScreen();
  loadBoard();
});
