// Chơi & Học: chọn game, làm quiz (số đáp án linh hoạt), điểm gia đình, xếp hạng, nhiệm vụ
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, toast, loginHint, CAT_SHORT } = BT;
  const $ = (id) => document.getElementById(id);
  const box = $('quiz');
  const me = await getMe();
  const LET = 'ABCDEF';
  let games = [], quiz = null, qs = [], idx = 0, answers = [], picked = null, checked = false, timer = null, left = 45, pick = 'random';
  try { games = (await api('/api/quizzes')).items; } catch (_) { /* */ }
  const want = new URLSearchParams(location.search).get('quiz');
  if (want && games.some((g) => String(g.id) === want)) pick = want;

  function startScreen() {
    clearInterval(timer);
    box.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px"><span class="label">Thử thách kiến thức</span><h2 class="h3">Chọn một game để bắt đầu</h2>
      <p class="muted" style="margin:0">Trả lời đúng để ghi điểm cho bạn và cả gia đình. Mỗi câu đều có giải thích từ nguồn y khoa.</p></div>
      <div class="game-pick" id="games">
        <button type="button" data-g="random" class="${pick === 'random' ? 'active' : ''}"><span class="ib">${icon('sparkles', 22)}</span><span style="flex:1"><b>Thử thách ngẫu nhiên</b><br><span class="small muted">5 câu hỏi từ mọi chủ đề - 45 giây/câu</span></span></button>
        ${games.map((g) => `<button type="button" data-g="${g.id}" class="${pick === String(g.id) ? 'active' : ''}"><span class="ib">${icon(g.article_id ? 'book' : 'quiz', 22)}</span>
          <span style="flex:1;min-width:0"><b>${esc(g.title)}</b><br><span class="small muted">${g.questions} câu - ${g.time_per_question} giây/câu - +${g.points_per_question} điểm/câu${g.article_title ? ' - Bài: ' + esc(g.article_title) : ''}</span></span></button>`).join('')}
      </div>
      <button class="btn" style="align-self:flex-start" id="start">Bắt đầu ${icon('arrow', 18)}</button>
      ${me.user ? '' : '<p class="small muted" style="margin:0">Bạn có thể chơi thử không cần đăng nhập. Đăng nhập để lưu điểm.</p>'}`;
    $('games').onclick = (e) => { const b = e.target.closest('[data-g]'); if (!b) return; pick = b.dataset.g; $('games').querySelectorAll('[data-g]').forEach((x) => x.classList.toggle('active', x === b)); };
    $('start').onclick = start;
  }

  async function start() {
    box.innerHTML = '<div class="loading">Đang chuẩn bị câu hỏi…</div>';
    try {
      const r = await api(pick === 'random' ? '/api/quiz?n=5' : '/api/quiz?quiz=' + pick);
      quiz = r.quiz; qs = r.questions;
      if (!qs.length) { box.innerHTML = '<div class="empty">Game này chưa có câu hỏi.</div>'; return; }
      idx = 0; answers = []; render();
    } catch (e) { box.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }

  function tick() {
    left--;
    const t = box.querySelector('.timer');
    if (t) { t.querySelector('span').textContent = `${String(Math.floor(Math.max(left, 0) / 60)).padStart(2, '0')}:${String(Math.max(left, 0) % 60).padStart(2, '0')}`; t.classList.toggle('low', left <= 10); }
    if (left <= 0) { clearInterval(timer); check(true); }
  }
  function render() {
    const q = qs[idx]; picked = null; checked = false; left = quiz.time_per_question || 45;
    clearInterval(timer); timer = setInterval(tick, 1000);
    const correctSoFar = answers.filter((a) => a.correct).length;
    box.innerHTML = `
      <div class="quiz-top"><div class="chips"><b class="h4">Câu ${idx + 1} / ${qs.length}</b>${q.category ? `<span class="tag" style="background:#fff">${esc(CAT_SHORT[q.category] || '')}</span>` : ''}</div>
        <span class="timer">${icon('clock', 18)}<span>${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}</span></span></div>
      <div class="qsteps" aria-label="Tiến độ">${qs.map((_, i) => `<i class="${i < idx ? (answers[i].correct ? 'ok' : 'no') : i === idx ? 'now' : ''}"></i>`).join('')}</div>
      <h2 class="h2">${esc(q.question)}</h2>
      <div class="options">${q.options.map((o, i) => `<button type="button" class="option" data-i="${i}" aria-pressed="false"><span class="letter">${LET[i]}</span><span style="flex:1">${esc(o)}</span></button>`).join('')}</div>
      <div id="explain"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span class="small" style="font-weight:500;color:var(--sky-800)">${idx ? `Bạn đúng ${correctSoFar}/${idx} câu · Tiếp tục nào!` : `${quiz.title}`}</span><button class="btn" id="next" disabled>Kiểm tra ${icon('arrow', 18)}</button></div>`;
    box.querySelector('.options').onclick = (e) => {
      const b = e.target.closest('.option'); if (!b || checked) return;
      picked = Number(b.dataset.i);
      box.querySelectorAll('.option').forEach((o) => { o.classList.toggle('selected', o === b); o.setAttribute('aria-pressed', o === b); });
      $('next').disabled = false;
    };
    $('next').onclick = () => (checked ? next() : check(false));
  }
  async function check(timeout) {
    if (checked) return; checked = true; clearInterval(timer);
    const q = qs[idx]; const btn = $('next'); btn.disabled = true;
    try {
      const r = await api('/api/quiz/check', { method: 'POST', body: { id: q.id, answer: picked == null ? -1 : picked } });
      answers.push({ id: q.id, answer: picked == null ? -1 : picked, correct: r.correct });
      box.querySelectorAll('.option').forEach((o) => {
        const i = Number(o.dataset.i); o.disabled = true; o.classList.remove('selected');
        if (i === r.correct_index) { o.classList.add('correct'); o.querySelector('.letter').innerHTML = icon('check', 18, 3); if (r.correct) o.insertAdjacentHTML('beforeend', `<span class="tag" style="background:var(--ok);color:#fff">+${r.points} điểm</span>`); }
        else if (i === picked) { o.classList.add('wrong'); o.querySelector('.letter').innerHTML = icon('x', 18, 3); }
      });
      box.querySelector('.qsteps').children[idx].className = r.correct ? 'ok' : 'no';
      $('explain').innerHTML = `<div class="explain"><span class="ib">${icon('book', 22)}</span><div style="display:flex;flex-direction:column;gap:6px">
        <b style="color:${r.correct ? 'var(--ok)' : 'var(--danger)'}">${r.correct ? 'Chính xác!' : timeout && picked == null ? 'Hết giờ!' : 'Chưa đúng'} · Giải thích</b>
        <span>${esc(r.explanation || 'Hãy đọc thêm trong thư viện kiến thức nhé.')}</span>${r.source ? `<span class="small" style="color:var(--sky-700)">${icon('shield', 14)} Nguồn: ${esc(r.source)}</span>` : ''}</div></div>`;
      btn.innerHTML = (idx < qs.length - 1 ? 'Câu tiếp theo ' : 'Xem kết quả ') + icon('arrow', 18); btn.disabled = false;
    } catch (e) { toast(e.message, true); checked = false; btn.disabled = false; }
  }
  function next() { if (idx < qs.length - 1) { idx++; render(); } else finish(); }
  async function finish() {
    const score = answers.filter((a) => a.correct).length;
    box.innerHTML = `<div style="display:flex;flex-direction:column;gap:18px;align-items:center;text-align:center;padding:20px 0">
      <span class="ib xl solid">${icon('trophy', 36)}</span><span class="label">Kết quả · ${esc(quiz.title)}</span>
      <div class="score-big" style="color:var(--sky-700)">${score}/${qs.length}</div>
      <p class="lead">${score === qs.length ? 'Tuyệt vời! Ba mẹ nắm kiến thức rất chắc.' : score >= qs.length / 2 ? 'Làm tốt lắm! Đọc thêm một chút để hoàn hảo hơn nhé.' : 'Không sao cả – mỗi lần chơi là một lần học thêm!'}</p>
      <div id="save-note" style="width:100%"></div>
      <div class="chips" style="justify-content:center"><button class="btn" id="again">Chơi game khác</button><a class="btn btn-ghost" href="/kien-thuc">Đọc thêm kiến thức</a></div></div>`;
    $('again').onclick = startScreen;
    if (!me.user) { $('save-note').innerHTML = loginHint('Đăng nhập để lưu điểm và cộng vào thành tích gia đình.'); return; }
    try {
      const r = await api('/api/quiz/submit', { method: 'POST', body: { answers: answers.map(({ id, answer }) => ({ id, answer })) } });
      $('save-note').innerHTML = `<div class="msg success">+${r.points} điểm đã được cộng${me.family ? ' cho gia đình' : ''}!</div>`;
      loadBoard();
    } catch (e) { $('save-note').innerHTML = `<div class="msg error">${esc(e.message)}</div>`; }
  }

  async function loadBoard() {
    try {
      const r = await api('/api/leaderboard');
      const myFam = me.family && me.family.id;
      if (r.me && r.me.members) {
        $('score').innerHTML = `<div class="card grad" style="padding:28px;display:flex;flex-direction:column;gap:14px">
          <div style="display:flex;justify-content:space-between;align-items:center"><span class="label" style="color:var(--sky-200)">Điểm gia đình tuần này</span><span class="ib sm accent">${icon('trophy', 18)}</span></div>
          <div class="score-big">${r.me.family_week}</div>
          <div class="grid-2" style="gap:10px">${r.me.members.slice(0, 4).map((m) => `<div style="padding:12px 14px;border-radius:16px;background:var(--sky-900)"><span class="small" style="color:var(--sky-200)">${esc(m.parent_role || '')} ${esc(m.name)}</span><div class="h4">${m.week_points} điểm</div></div>`).join('')}</div></div>`;
      } else if (r.me) {
        $('score').innerHTML = `<div class="card grad" style="padding:28px"><span class="label" style="color:var(--sky-200)">Điểm của bạn</span><div class="score-big">${r.me.total}</div><p style="margin:8px 0 0;color:var(--sky-100)">Tạo hoặc tham gia gia đình để tính điểm nhóm.</p><a class="btn btn-secondary btn-sm" style="margin-top:12px" href="/tai-khoan">Thiết lập gia đình</a></div>`;
      } else $('score').innerHTML = loginHint('Đăng nhập để lưu điểm cho gia đình.');
      $('board').innerHTML = `<h3 class="h4" style="margin-bottom:8px">Bảng xếp hạng gia đình</h3>` + (r.families.length ? r.families.map((f, i) => `
        <div class="lb-row ${f.id === myFam ? 'me' : ''}"><span class="rk ${i === 0 ? 'first' : ''}">${i + 1}</span><span style="flex:1;font-weight:500">${esc(f.name)}</span><b style="color:var(--sky-700)">${f.points}</b></div>`).join('') : '<p class="muted">Chưa có gia đình nào.</p>');
    } catch (_) { /* */ }
  }
  async function loadMissions() {
    try {
      const r = await api('/api/missions');
      $('missions').innerHTML = r.items.slice(0, 4).map((m) => BT.missionCard(m, me)).join('');
      $('missions').onclick = (e) => { const b = e.target.closest('[data-complete]'); if (!b) return; BT.completeMission(r.items.find((x) => x.id === Number(b.dataset.complete)), () => { loadMissions(); loadBoard(); }); };
    } catch (_) { /* */ }
  }
  if (want && pick === want) start(); else startScreen();
  loadBoard(); loadMissions();
});
