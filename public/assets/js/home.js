// Trang chủ
document.addEventListener('DOMContentLoaded', async () => {
  const { api, getMe, esc, ph, ICONS } = BT;
  const box = document.getElementById('home-cards');

  const [me, missions, featured] = await Promise.all([
    getMe(),
    api('/api/missions').catch(() => ({ items: [] })),
    api('/api/articles?featured=1&limit=1').catch(() => ({ items: [] })),
  ]);
  if (me.user) document.getElementById('start-btn').href = '/hanh-trinh';

  const daily = missions.items.find((m) => m.id === missions.daily_id) || missions.items[0];
  const art = featured.items[0];

  // Cột mốc phát triển theo tuổi bé (nếu đã có thông tin bé)
  let stageText = 'Bé 6–12 tháng: khám phá các cột mốc về dinh dưỡng, vận động, giao tiếp và tiêm chủng.';
  let stageImg = 'Bé 6–12 tháng';
  const child = me.children && me.children[0];
  if (child) {
    if (child.birth_date) {
      const months = Math.floor((Date.now() - new Date(child.birth_date)) / (30.44 * 864e5));
      stageText = `${esc(child.name)} đã được ${months} tháng tuổi. Xem các cột mốc và gợi ý phù hợp với giai đoạn của bé.`;
      stageImg = `${child.name} · ${months} tháng`;
    } else if (child.due_date) {
      stageText = `Mẹ đang mang thai ${esc(child.name)}. Xem kiến thức thai kỳ và checklist chuẩn bị sinh.`;
      stageImg = 'Hành trình thai kỳ';
    }
  }

  const cards = [
    {
      title: 'Nhiệm vụ hôm nay', meta: 'Chơi & Học', icon: 'book', label: daily ? (daily.participant === 'Bố và mẹ' ? 'Bố mẹ cùng làm' : 'Dành cho ' + daily.participant) : 'Nhiệm vụ',
      image: daily && daily.image,
      text: daily ? `Hôm nay, hãy ${esc(daily.title.charAt(0).toLowerCase() + daily.title.slice(1))}!` : 'Hãy dành 15 phút đọc sách tranh cùng bé!',
      cta: 'Xem nhiệm vụ', href: '/nhiem-vu',
    },
    {
      title: 'Kiến thức nổi bật', meta: 'Thư viện kiến thức', icon: 'baby', label: art ? BT.CATEGORIES[art.category] : 'Kiến thức',
      image: art && art.cover_image,
      text: art ? `<strong>${esc(art.title)}.</strong> ${esc(art.summary)}` : '5 dấu hiệu nhận biết trẻ bú đủ sữa. Đọc ngay để yên tâm hơn trong những tháng đầu cùng con.',
      cta: 'Đọc ngay', href: art ? `/bai-viet/${encodeURIComponent(art.slug)}` : '/kien-thuc',
    },
    {
      title: 'Cùng nhau thử thách', meta: 'Quiz & nhiệm vụ', icon: 'star', label: 'Quiz gia đình',
      text: 'Bố và mẹ đã sẵn sàng vượt qua thử thách hôm nay chưa? Tham gia Quiz và nhiệm vụ thực tế để ghi điểm cho cả nhà!',
      cta: 'Tham gia', href: '/choi-hoc',
    },
    {
      title: 'Cột mốc phát triển', meta: 'Hành trình làm cha mẹ', icon: 'family', label: stageImg,
      text: stageText, cta: 'Xem cột mốc', href: '/hanh-trinh',
    },
  ];

  box.innerHTML = cards.map((c) => `
    <article class="home-card">
      <h2>${c.title}</h2>
      <div class="divider sm"><span></span></div>
      <div class="meta">${c.meta}</div>
      ${ph(c.image, c.icon, c.image ? c.label : c.label, 'soft')}
      <p class="body-text">${c.text}</p>
      <a class="btn-light" href="${c.href}"><span>${c.cta}</span>${ICONS.arrow}</a>
    </article>`).join('');
});
