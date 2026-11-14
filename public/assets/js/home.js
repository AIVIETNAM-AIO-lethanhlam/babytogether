// Trang chủ
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, icon, articleCard, CATEGORIES, CAT_ICON, fmtDate, todayStr } = BT;
  const $ = (id) => document.getElementById(id);
  const [me, stats, featured, missions, paths] = await Promise.all([
    getMe(),
    api('/api/stats').catch(() => ({ categories: {}, articles: 0, families: 0 })),
    api('/api/articles?featured=1&limit=3&sort=newest').catch(() => ({ items: [] })),
    api('/api/missions').catch(() => ({ items: [] })),
    api('/api/paths').catch(() => ({ items: [] })),
  ]);
  const child = (me.children || [])[0];
  let months = null;
  if (child && child.birth_date) months = Math.floor((Date.now() - new Date(child.birth_date)) / (30.44 * 864e5));
  const stage = child ? (child.due_date && !child.birth_date ? 'pregnancy' : months < 6 ? '0-6' : months < 12 ? '6-12' : '12-24') : null;

  // Hero visual + thẻ nổi
  const daily = missions.items.find((m) => m.id === missions.daily_id) || missions.items[0];
  let ev = null;
  if (me.family) { try { ev = (await api('/api/events?from=' + todayStr())).items.find((e) => e.type === 'vaccine' || e.type === 'checkup'); } catch (_) { /* */ } }
  const fc = (x, y, ic, cls, t, s, extra = '') => `<div class="float-card" style="left:${x}px;top:${y}px"><span class="ib ${cls}">${icon(ic, 22)}</span><div><b>${esc(t)}</b><span>${esc(s)}</span>${extra}</div></div>`;
  $('hero-visual').innerHTML = `<div class="blob"></div><div class="ring"></div><div class="baby">${icon('baby', 200, 1.2)}</div>
    <span class="dot" style="left:40px;top:90px;width:28px;height:28px;background:var(--sky-500)"></span><span class="dot" style="left:530px;top:380px;width:16px;height:16px;background:var(--sky-700)"></span>
    ${child ? fc(0, 36, 'baby', '', `Bé ${child.name}${months != null ? ' · ' + months + ' tháng' : ''}`, child.birth_date ? 'Giai đoạn ' + BT.AGES[stage] : 'Đang mang thai', '<div class="progress" style="margin-top:8px;width:150px"><i style="width:65%"></i></div>')
      : fc(0, 36, 'baby', '', 'Bé Bống · 8 tháng', 'Giai đoạn 6–12 tháng', '<div class="progress" style="margin-top:8px;width:150px"><i style="width:65%"></i></div>')}
    ${fc(340, 290, 'syringe', 'solid', ev ? 'Nhắc lịch: ' + ev.title : 'Nhắc lịch: Tiêm sởi', ev ? fmtDate(ev.date) + (ev.time ? ' · ' + ev.time : '') : 'Còn 2 ngày · Thứ 2, 16/11')}
    ${fc(60, 420, 'bulb', '', 'Nhiệm vụ hôm nay', daily ? daily.title : 'Đọc sách tranh cùng bé 15 phút')}`;

  // Trust stats
  $('trust-stats').innerHTML = `<div><b>${stats.articles || 0}</b> bài viết kiến thức</div><div><b>${stats.paths || 0}</b> lộ trình đọc</div><div><b>${stats.families || 0}</b> gia đình tham gia</div>`;

  // Tiếp tục đọc
  const going = paths.items.find((p) => p.done > 0 && p.done < p.total) || null;
  if (going) {
    const next = going.articles.find((a) => !a.is_read);
    $('continue-wrap').innerHTML = `<section style="padding:40px 0 0"><div class="container"><a class="continue-card" href="/bai-viet/${encodeURIComponent(next.slug)}">
      <span class="ib lg solid">${icon('route', 26)}</span>
      <div style="flex:1;min-width:0"><span class="label">Tiếp tục đọc · ${esc(going.title)} · ${going.done}/${going.total}</span><div class="h4 clamp-1">Bước ${next.position}: ${esc(next.title)}</div>
      <div class="segs" style="margin-top:8px;max-width:360px">${going.articles.map((a) => `<i class="${a.is_read ? 'on' : ''}"></i>`).join('')}</div></div>
      <span class="btn">Đọc tiếp ${icon('arrow', 18)}</span></a></div></section>`;
  }

  // Giai đoạn
  const stages = [['pregnancy', 'heart', 'Giai đoạn 1', 'Mang thai', 'Dinh dưỡng thai kỳ, khám thai, chuẩn bị sinh'], ['0-6', 'bottle', 'Giai đoạn 2', '0 – 6 tháng', 'Bú mẹ, giấc ngủ, chăm sóc rốn, tiêm chủng'], ['6-12', 'sprout', 'Giai đoạn 3', '6 – 12 tháng', 'Ăn dặm, vận động, phát triển giác quan'], ['12-24', 'foot', 'Giai đoạn 4', '12 – 24 tháng', 'Tập đi, tập nói, dinh dưỡng, nhận thức']];
  const active = stage || '0-6';
  $('stages').innerHTML = stages.map(([k, ic, l, t, d]) => `<a class="stage-card ${k === active ? 'on' : ''}" href="/hanh-trinh?stage=${k}">
    <span class="ib lg">${icon(ic, 28)}</span><span class="label">${l}${k === stage ? ' · Bé đang ở đây' : ''}</span><h3 class="h3">${t}</h3><p>${d}</p><span class="go">Xem gợi ý ${icon('arrow', 16)}</span></a>`).join('');

  // Chủ đề
  const desc = { 'baby-care': 'Vệ sinh, rốn, giữ ấm, giấc ngủ', 'maternal-care': 'Phục hồi thể chất và tinh thần', nutrition: 'Bú mẹ, ăn dặm, thực đơn', vaccination: 'Lịch tiêm, dấu hiệu bất thường' };
  $('topics').innerHTML = Object.entries(CATEGORIES).map(([k, v]) => `<a class="topic-card" href="/kien-thuc?category=${k}">
    <div class="top"><span class="ib lg">${icon(CAT_ICON[k], 26)}</span>${stats.categories[k] || 0} bài viết</div>
    <h3 class="h4">${v}</h3><p>${desc[k]}</p></a>`).join('');

  // Bài nổi bật
  let items = featured.items;
  if (items.length < 3) items = (await api('/api/articles?limit=3&sort=popular').catch(() => ({ items: [] }))).items;
  $('featured').innerHTML = items.length ? items.map((a) => articleCard(a)).join('') : '<div class="empty">Chưa có bài viết.</div>';

  // Dấu hiệu nguy hiểm
  $('danger-tag').insertAdjacentHTML('afterbegin', icon('alert', 14) + ' ');
  $('signs').innerHTML = [['bottle', 'Bỏ bú hoặc bú kém rõ rệt'], ['thermo', 'Sốt, hoặc người lạnh bất thường'], ['moon', 'Li bì, khó đánh thức'], ['alert', 'Co giật'], ['sparkles', 'Thở nhanh, rút lõm lồng ngực'], ['baby', 'Vàng da lan xuống lòng bàn tay, chân']]
    .map(([ic, t]) => `<div class="sign"><span class="ib sm">${icon(ic, 18)}</span>${t}</div>`).join('');

  // Chơi & Học
  let q = null;
  try { q = (await api('/api/quiz?n=1')).questions[0]; } catch (_) { /* */ }
  $('play').innerHTML = `<div class="card tint" style="display:flex;flex-direction:column;gap:18px;padding:32px">
      <div style="display:flex;justify-content:space-between"><span class="label">Thử thách kiến thức</span><span class="small" style="color:var(--sky-700);font-weight:600">+10 điểm / câu</span></div>
      <h3 class="h3">${esc(q ? q.question : 'Khi trẻ sơ sinh có dấu hiệu bú không đủ, ba mẹ nên làm gì?')}</h3>
      <div class="quiz-teaser" style="display:flex;flex-direction:column;gap:10px">${(q ? q.options.slice(0, 2) : ['Tự ý cho trẻ uống thêm nước', 'Theo dõi dấu hiệu bú và hỏi ý kiến nhân viên y tế']).map((o, i) => `<div class="opt"><span class="letter">${'AB'[i]}</span>${esc(o)}</div>`).join('')}</div>
      <a class="btn" style="align-self:flex-start" href="/choi-hoc">Làm quiz ngay ${icon('arrow', 18)}</a></div>
    <div class="card grad" style="display:flex;flex-direction:column;gap:18px;padding:32px">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="label" style="color:var(--sky-200)">Nhiệm vụ hôm nay</span>${daily ? `<span class="tag" style="background:#fff">${icon('trophy', 14)} +${daily.points} điểm</span>` : ''}</div>
      <h3 class="h2">${esc(daily ? daily.title : 'Đọc sách tranh cùng bé trong 15 phút')}</h3>
      <p style="margin:0;color:var(--sky-100)">${esc(daily ? daily.description : '')}</p>
      <div style="display:flex;gap:10px;align-items:center;font-weight:500">${icon('users', 20)} ${esc(daily ? daily.participant : 'Bố và mẹ')} cùng tham gia</div>
      <a class="btn btn-secondary" style="align-self:flex-start;margin-top:auto" href="/nhiem-vu">Hoàn thành nhiệm vụ ${icon('arrow', 18)}</a></div>`;

  // Gia đình
  $('family-cta').innerHTML = me.family
    ? `<div class="family-cta"><div style="display:flex;gap:24px;align-items:center"><span class="ib xl white">${icon('users', 36)}</span><div><h2 class="h2">${esc(me.family.name)}</h2><p class="lead">Xem tiến độ, lịch chung và kỷ niệm của cả nhà.</p></div></div><a class="btn" href="/gia-dinh">Mở nhật ký gia đình ${icon('arrow', 18)}</a></div>`
    : `<div class="family-cta"><div style="display:flex;gap:24px;align-items:center"><span class="ib xl white">${icon('users', 36)}</span><div style="display:flex;flex-direction:column;gap:8px"><h2 class="h2">Một tài khoản – cả nhà cùng đồng hành</h2><p class="lead" style="max-width:620px">Tạo Family ID, mời bố/mẹ tham gia để cùng xem nhiệm vụ, lịch tiêm và nhật ký của bé.</p></div></div>
       <div class="chips"><a class="btn" href="/tai-khoan">Tạo gia đình ${icon('arrow', 18)}</a><a class="btn btn-ghost" href="/tai-khoan">Tôi có mã mời</a></div></div>`;
});
