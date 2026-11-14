// Nhiệm vụ đời thực
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, cover, loginHint, fmtDate } = BT;
  const $ = (id) => document.getElementById(id);
  const me = await getMe();
  let data, who = 'all';
  const WHO = [['all', 'Tất cả'], ['Bố', 'Cho bố'], ['Mẹ', 'Cho mẹ'], ['Bố và mẹ', 'Cả hai']];
  async function load() {
    try { data = await api('/api/missions'); } catch (e) { $('feature').innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
    const daily = data.items.find((m) => m.id === data.daily_id) || data.items[0];
    if (!daily) { $('feature').innerHTML = '<div class="empty">Chưa có nhiệm vụ nào.</div>'; return; }
    const mine = me.user && daily.done_by.includes(me.user.name);
    $('feature').innerHTML = `${cover(daily.image, 'book', 'deep', 120)}
      <div style="display:flex;flex-direction:column;gap:18px;align-items:flex-start">
        <span class="label">Nhiệm vụ hôm nay · ${daily.participant === 'Bố và mẹ' ? 'Gia đình cùng nhau' : 'Dành cho ' + esc(daily.participant)}</span>
        <h2 class="h2">${esc(daily.title)}</h2>
        ${daily.description ? `<p class="lead">${esc(daily.description)}</p>` : ''}
        ${daily.goal ? `<p class="muted" style="margin:0;display:flex;gap:8px;align-items:center">${icon('target', 18)} Mục tiêu: ${esc(daily.goal)}</p>` : ''}
        <span class="tag" style="font-size:15px;padding:8px 14px">${icon('trophy', 16)} +${daily.points} điểm</span>
        ${daily.done_by.length ? `<span style="color:var(--ok);font-weight:500">✓ Hôm nay ${esc(daily.done_by.join(', '))} đã hoàn thành</span>` : ''}
        ${mine ? `<button class="btn btn-done" disabled>${icon('check', 18)} Bạn đã hoàn thành</button>` : `<button class="btn" data-complete="${daily.id}">Hoàn thành nhiệm vụ ${icon('arrow', 18)}</button>`}
      </div>`;
    renderList();
  }
  function renderList() {
    $('who-filter').innerHTML = WHO.map(([k, l]) => `<button class="chip ${who === k ? 'active' : ''}" data-who="${k}">${l}</button>`).join('');
    const list = data.items.filter((m) => who === 'all' || m.participant === who);
    $('missions').innerHTML = list.map((m) => BT.missionCard(m, me)).join('') || '<div class="empty" style="grid-column:1/-1">Không có nhiệm vụ phù hợp.</div>';
  }
  $('who-filter').onclick = (e) => { const b = e.target.closest('[data-who]'); if (!b) return; who = b.dataset.who; renderList(); };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-complete]'); if (!b) return;
    BT.completeMission(data.items.find((x) => x.id === Number(b.dataset.complete)), () => { load(); loadHistory(); });
  });
  async function loadHistory() {
    const h = $('history');
    if (!me.user) { h.innerHTML = loginHint(); return; }
    try {
      const r = await api('/api/missions/history');
      h.innerHTML = r.items.length ? `<div style="display:flex;flex-direction:column;gap:10px">${r.items.map((x) => `
        <div class="act-row done">${x.photo ? `<img src="${esc(x.photo)}" alt="" style="width:64px;height:48px;object-fit:cover;border-radius:10px">` : `<span class="ib sm">${icon('check', 16, 3)}</span>`}
          <div class="t"><b>${esc(x.title)}</b><div class="small muted">${esc(x.user_name || '')} · ${fmtDate(x.completed_at, true)}${x.note ? ' · ' + esc(x.note) : ''}</div></div><span class="tag ok">+${x.points}</span></div>`).join('')}</div>`
        : '<div class="empty">Chưa có nhiệm vụ nào được hoàn thành. Bắt đầu ngay hôm nay nhé!</div>';
    } catch (e) { h.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  load(); loadHistory();
});
