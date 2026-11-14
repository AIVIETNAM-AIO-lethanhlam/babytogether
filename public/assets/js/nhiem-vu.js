// Nhiệm vụ đời thực: nhiệm vụ hằng ngày, đánh dấu hoàn thành, ảnh minh chứng, điểm thưởng
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ph, ICONS, toast, modal, compressImage, loginHint, fmtDate } = BT;
  const me = await getMe();
  const ICON_BY_TAG = { reading: 'book', maternal: 'heart', meal: 'heart', play: 'baby', health: 'star' };
  let data;

  async function load() {
    try { data = await api('/api/missions'); }
    catch (e) { document.getElementById('feature').innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
    const daily = data.items.find((m) => m.id === data.daily_id) || data.items[0];
    const others = data.items.filter((m) => m !== daily);
    const f = document.getElementById('feature');
    if (!daily) { f.innerHTML = '<div class="empty">Chưa có nhiệm vụ nào.</div>'; return; }
    f.innerHTML = `
      ${ph(daily.image, ICON_BY_TAG[daily.tag], daily.image ? daily.title : 'Nhiệm vụ của ngày')}
      <div class="info">
        <div class="eyebrow">${daily.participant === 'Bố và mẹ' ? 'Gia đình cùng nhau' : 'Dành cho ' + esc(daily.participant)}</div>
        <h2>${esc(daily.title)}</h2>
        <div class="divider sm"><span></span></div>
        ${daily.description ? `<p class="body-text">${esc(daily.description)}</p>` : ''}
        ${daily.goal ? `<p class="meta">Mục tiêu: ${esc(daily.goal)}</p>` : ''}
        <div class="points">+ ${daily.points} điểm</div>
        ${daily.done_by.length ? `<p class="done-note">✓ Hôm nay ${esc(daily.done_by.join(', '))} đã hoàn thành</p>` : ''}
        <button class="btn" data-complete="${daily.id}">${daily.done_by.includes(me.user && me.user.name) ? 'Đã hoàn thành' : 'Hoàn thành nhiệm vụ'} ${ICONS.arrow}</button>
      </div>`;
    document.getElementById('missions').innerHTML = others.map((m) => `
      <article class="mission-card">
        ${ph(m.image, ICON_BY_TAG[m.tag], m.image ? m.title : m.participant)}
        <h3 class="h3">${esc(m.title)}</h3>
        <div class="row"><span>${esc(m.participant)}</span><span>+${m.points} điểm</span></div>
        ${m.goal ? `<p class="meta" style="margin:0">${esc(m.goal)}</p>` : ''}
        ${m.done_by.length ? `<p class="done-note" style="margin:0">✓ ${esc(m.done_by.join(', '))} đã làm hôm nay</p>` : ''}
        <button class="btn-light" data-complete="${m.id}"><span>${m.done_by.length ? 'Làm tiếp' : 'Bắt đầu'}</span>${ICONS.arrow}</button>
      </article>`).join('');
    document.getElementById('points-note').textContent = 'Hoàn thành nhiệm vụ để nhận điểm thưởng cho gia đình';
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-complete]'); if (!b) return;
    const m = data.items.find((x) => x.id === Number(b.dataset.complete));
    if (!me.user) {
      modal({ title: 'Đăng nhập để tham gia', html: loginHint('Đăng nhập để đánh dấu hoàn thành nhiệm vụ và nhận điểm thưởng.'), cancelText: 'Đóng' });
      return;
    }
    let photo = '';
    const form = modal({
      title: m.title,
      submitText: 'Xác nhận hoàn thành',
      html: `${m.description ? `<p class="body-text" style="font-size:16px">${esc(m.description)}</p>` : ''}
        <label class="field">Ghi chú (không bắt buộc)<textarea name="note" maxlength="500" placeholder="Hôm nay bé rất thích…"></textarea></label>
        <label class="field">Ảnh minh chứng (không bắt buộc)<input type="file" name="photo" accept="image/*"></label>
        <img class="photo-preview" id="pv" alt="Xem trước ảnh" hidden>
        ${me.family ? '<label class="check"><input type="checkbox" name="mem" checked> Lưu ảnh vào Kỷ niệm gia đình</label>' : ''}
        <p class="points">+ ${m.points} điểm</p>`,
      onSubmit: async (f) => {
        const r = await api(`/api/missions/${m.id}/complete`, { method: 'POST', body: { note: f.note.value, photo, save_memory: f.mem ? f.mem.checked : false } });
        toast(`Tuyệt vời! +${r.points} điểm`);
        load(); loadHistory();
      },
    });
    form.photo.addEventListener('change', async () => {
      try {
        photo = await compressImage(form.photo.files[0]);
        const pv = form.querySelector('#pv'); pv.src = photo; pv.hidden = !photo;
      } catch (ex) { toast(ex.message, true); form.photo.value = ''; photo = ''; }
    });
  });

  async function loadHistory() {
    const h = document.getElementById('history');
    if (!me.user) { h.innerHTML = loginHint(); return; }
    try {
      const r = await api('/api/missions/history');
      h.innerHTML = r.items.length ? `<div class="list-box">${r.items.map((x) => `
        <div class="list-row"><div class="left">${x.photo ? `<img src="${esc(x.photo)}" alt="" style="width:56px;height:42px;object-fit:cover">` : ''}
          <span>${esc(x.title)}<br><span class="meta" style="font-size:14px">${esc(x.user_name || '')} · ${fmtDate(x.completed_at, true)}${x.note ? ' · ' + esc(x.note) : ''}</span></span></div>
          <span class="status done">+${x.points}</span></div>`).join('')}</div>`
        : '<div class="empty">Chưa có nhiệm vụ nào được hoàn thành. Bắt đầu ngay hôm nay nhé!</div>';
    } catch (e) { h.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }

  load();
  loadHistory();
});
