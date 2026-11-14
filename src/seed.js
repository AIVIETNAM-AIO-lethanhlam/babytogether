// Dữ liệu mẫu ban đầu (chỉ chèn khi bảng còn trống).
// Nội dung bài viết mẫu, tổng hợp từ khuyến nghị chung của WHO/UNICEF/Bộ Y tế.
'use strict';

const REVIEW = 'Ban biên tập BabyTogether';

const articles = [
  {
    slug: 'cham-soc-ron-tre-so-sinh',
    title: 'Hướng dẫn chăm sóc rốn cho trẻ sơ sinh đúng cách',
    summary: 'Cách vệ sinh rốn, dấu hiệu bất thường và khi nào cần đưa bé đi khám.',
    category: 'baby-care', age_group: '0-6', featured: 1,
    source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
    content: `
<p>Dây rốn của bé thường khô dần và tự rụng sau khoảng 1–2 tuần. Trong thời gian này, nguyên tắc quan trọng nhất là <strong>giữ rốn sạch và khô</strong>.</p>
<h2>Các bước chăm sóc hằng ngày</h2>
<ul>
<li>Rửa tay sạch bằng xà phòng trước và sau khi chạm vào vùng rốn của bé.</li>
<li>Để rốn thoáng khí, gấp mép tã xuống dưới rốn để tã không cọ xát và không làm ướt rốn.</li>
<li>Nếu rốn dính bẩn, lau nhẹ bằng nước sạch rồi thấm khô bằng gạc sạch.</li>
<li>Không tự ý bôi thuốc, bột, lá cây hay bất kỳ chất gì lên rốn khi chưa có hướng dẫn của nhân viên y tế.</li>
<li>Không băng kín rốn và không cố giật cuống rốn khi chưa tự rụng.</li>
</ul>
<h2>Khi nào cần đưa bé đi khám ngay?</h2>
<ul>
<li>Vùng da quanh rốn đỏ, sưng và lan rộng ra.</li>
<li>Rốn chảy mủ, có mùi hôi hoặc chảy máu không cầm.</li>
<li>Bé sốt, bỏ bú, quấy khóc bất thường hoặc li bì.</li>
</ul>
<blockquote>Mọi thắc mắc về chăm sóc rốn, ba mẹ nên hỏi trực tiếp bác sĩ hoặc nữ hộ sinh đã hướng dẫn sau sinh.</blockquote>`,
  },
  {
    slug: 'dau-hieu-tre-bu-du-sua',
    title: '5 dấu hiệu nhận biết trẻ sơ sinh bú đủ sữa',
    summary: 'Đọc ngay để yên tâm hơn trong những tháng đầu cùng con.',
    category: 'nutrition', age_group: '0-6', featured: 1,
    source_name: 'WHO', source_url: 'https://www.who.int/health-topics/breastfeeding',
    content: `
<p>Nhiều ba mẹ lo lắng vì không biết con đã bú đủ hay chưa. Dưới đây là những dấu hiệu thường được nhân viên y tế dùng để theo dõi.</p>
<h2>1. Số lần bú</h2>
<p>Trẻ sơ sinh thường bú khoảng 8–12 lần trong 24 giờ, bú theo nhu cầu cả ngày lẫn đêm.</p>
<h2>2. Nghe thấy tiếng nuốt</h2>
<p>Khi bú, bé mút sâu, chậm và có tiếng nuốt đều đặn.</p>
<h2>3. Tã ướt và tã bẩn</h2>
<p>Sau những ngày đầu, bé thường có khoảng 6 tã ướt trở lên mỗi ngày, nước tiểu trong hoặc vàng nhạt, và đi ngoài phân vàng đều đặn.</p>
<h2>4. Bé tăng cân đều</h2>
<p>Bé có thể sụt nhẹ cân trong vài ngày đầu, sau đó lấy lại cân nặng lúc sinh trong khoảng 2 tuần và tăng cân đều theo biểu đồ tăng trưởng.</p>
<h2>5. Bé thỏa mãn sau khi bú</h2>
<p>Sau bữa bú, bé tự nhả vú, thư giãn, tỉnh táo và hồng hào khi thức.</p>
<blockquote>Nếu bé ít tã ướt, vàng da tăng, ngủ li bì khó đánh thức hoặc không tăng cân, hãy đưa bé đến cơ sở y tế. Không tự ý cho bé uống thêm nước hay đổi sữa.</blockquote>`,
  },
  {
    slug: 'giu-am-cho-tre-so-sinh',
    title: 'Giữ ấm cho trẻ sơ sinh trong mùa lạnh',
    summary: 'Giữ ấm đúng cách nhưng không để bé bị quá nóng.',
    category: 'baby-care', age_group: '0-6',
    source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
    content: `
<p>Trẻ sơ sinh mất nhiệt nhanh hơn người lớn, nhưng việc ủ quá nhiều cũng có hại. Mục tiêu là giữ bé <strong>ấm vừa đủ</strong>.</p>
<h2>Gợi ý giữ ấm</h2>
<ul>
<li>Tiếp xúc da kề da với ba mẹ là cách giữ ấm tự nhiên và giúp gắn kết.</li>
<li>Mặc cho bé nhiều lớp mỏng, thường hơn người lớn một lớp; đội mũ mỏng khi trời lạnh.</li>
<li>Giữ phòng kín gió nhưng thông thoáng, tránh để bé nằm gần quạt hay luồng gió lùa.</li>
<li>Kiểm tra nhiệt độ bằng cách sờ gáy hoặc lưng bé thay vì sờ tay chân.</li>
</ul>
<h2>Tránh để bé bị quá nóng</h2>
<ul>
<li>Không đắp chăn dày, gối hay thú bông trong chỗ ngủ của bé.</li>
<li>Không đặt túi chườm, máy sưởi sát người bé.</li>
<li>Luôn cho bé nằm ngửa khi ngủ.</li>
</ul>
<blockquote>Bé có thân nhiệt thấp, tay chân lạnh kèm bỏ bú, hoặc ngược lại bé sốt, cần được khám ngay.</blockquote>`,
  },
  {
    slug: 'loi-ich-cua-sua-me',
    title: 'Lợi ích của sữa mẹ đối với trẻ',
    summary: 'Vì sao sữa mẹ được khuyến nghị là nguồn dinh dưỡng tốt nhất cho trẻ nhỏ.',
    category: 'nutrition', age_group: '0-6',
    source_name: 'WHO', source_url: 'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
    content: `
<p>Tổ chức Y tế Thế giới (WHO) và UNICEF khuyến nghị:</p>
<ul>
<li>Cho trẻ bú mẹ trong vòng 1 giờ đầu sau sinh.</li>
<li>Nuôi con hoàn toàn bằng sữa mẹ trong 6 tháng đầu.</li>
<li>Tiếp tục cho bú đến 2 tuổi hoặc lâu hơn, kết hợp với ăn dặm phù hợp từ tháng thứ 6.</li>
</ul>
<h2>Lợi ích cho bé</h2>
<p>Sữa mẹ cung cấp đầy đủ dinh dưỡng cho bé trong 6 tháng đầu, chứa kháng thể giúp bảo vệ bé khỏi nhiều bệnh nhiễm trùng, và luôn sẵn sàng ở nhiệt độ phù hợp.</p>
<h2>Lợi ích cho mẹ</h2>
<p>Cho con bú giúp tăng gắn kết mẹ con và mang lại nhiều lợi ích sức khỏe lâu dài cho mẹ.</p>
<h2>Bố có thể làm gì?</h2>
<p>Bố đóng vai trò quan trọng: chuẩn bị nước uống cho mẹ, bế bé vỗ ợ hơi, thay tã, chia sẻ việc nhà để mẹ được nghỉ ngơi.</p>`,
  },
  {
    slug: 'lich-tiem-chung-mo-rong',
    title: 'Lịch tiêm chủng mở rộng: những điều ba mẹ cần biết',
    summary: 'Các mốc tiêm chủng quan trọng trong năm đầu đời và cách theo dõi lịch tiêm.',
    category: 'vaccination', age_group: '0-6',
    source_name: 'Bộ Y tế – Chương trình Tiêm chủng mở rộng', source_url: 'https://tiemchungmorong.vn',
    content: `
<p>Tiêm chủng đầy đủ, đúng lịch giúp bảo vệ bé khỏi nhiều bệnh truyền nhiễm nguy hiểm.</p>
<h2>Các mốc thường gặp trong năm đầu</h2>
<ul>
<li><strong>Ngay sau sinh:</strong> vắc xin viêm gan B (trong 24 giờ đầu) và vắc xin phòng lao (BCG).</li>
<li><strong>2, 3, 4 tháng tuổi:</strong> các mũi vắc xin phối hợp và vắc xin bại liệt theo chương trình.</li>
<li><strong>9 tháng tuổi:</strong> vắc xin sởi.</li>
</ul>
<p>Lịch cụ thể có thể được Bộ Y tế điều chỉnh theo từng thời kỳ. <strong>Ba mẹ hãy luôn theo lịch hẹn và sổ tiêm chủng do trạm y tế cung cấp.</strong></p>
<h2>Mẹo theo dõi lịch tiêm</h2>
<ul>
<li>Thêm lịch tiêm vào mục <em>Lịch chung gia đình</em> trên BabyTogether để cả bố và mẹ cùng nhận nhắc nhở.</li>
<li>Mang theo sổ tiêm chủng mỗi lần đi tiêm.</li>
<li>Theo dõi bé ít nhất 30 phút tại điểm tiêm và trong 24–48 giờ sau tiêm tại nhà.</li>
</ul>`,
  },
  {
    slug: 'dau-hieu-nguy-hiem-tre-so-sinh',
    title: 'Dấu hiệu bất thường ở trẻ sơ sinh cần đưa đi khám ngay',
    summary: 'Những dấu hiệu nguy hiểm ba mẹ không được bỏ qua.',
    category: 'vaccination', age_group: '0-6',
    source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
    content: `
<p>Trẻ sơ sinh có thể chuyển bệnh rất nhanh. Hãy đưa bé đến cơ sở y tế <strong>ngay</strong> nếu thấy một trong các dấu hiệu sau:</p>
<ul>
<li>Bỏ bú hoặc bú kém rõ rệt.</li>
<li>Co giật.</li>
<li>Thở nhanh, thở rút lõm lồng ngực, tím tái.</li>
<li>Sốt hoặc thân nhiệt thấp, người lạnh.</li>
<li>Li bì, chỉ cử động khi bị kích thích hoặc không cử động.</li>
<li>Vàng da xuất hiện trong 24 giờ đầu, hoặc vàng lan xuống lòng bàn tay, bàn chân.</li>
<li>Rốn tấy đỏ lan rộng, chảy mủ.</li>
</ul>
<blockquote>Khi không chắc chắn, hãy gọi cho nhân viên y tế. Đừng chờ đợi để "theo dõi thêm" với những dấu hiệu nguy hiểm.</blockquote>`,
  },
  {
    slug: 'phuc-hoi-suc-khoe-sau-sinh',
    title: 'Phục hồi sức khỏe sau sinh: mẹ cần lưu ý gì?',
    summary: 'Chăm sóc thể chất và tinh thần của mẹ trong những tuần đầu sau sinh.',
    category: 'maternal-care', age_group: '0-6',
    source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
    content: `
<p>Giai đoạn sau sinh là thời gian cơ thể mẹ hồi phục và thích nghi. Mẹ cần được nghỉ ngơi, ăn uống đủ chất và được cả gia đình hỗ trợ.</p>
<h2>Khám sau sinh</h2>
<p>WHO khuyến nghị mẹ và bé được chăm sóc, thăm khám nhiều lần trong 6 tuần đầu sau sinh. Hãy giữ đúng các lịch hẹn tái khám.</p>
<h2>Dấu hiệu cần đi khám ngay</h2>
<ul>
<li>Ra máu nhiều, ra cục máu đông lớn.</li>
<li>Sốt, sản dịch có mùi hôi.</li>
<li>Đau đầu dữ dội, nhìn mờ, co giật.</li>
<li>Khó thở, đau ngực, đau và sưng một bên bắp chân.</li>
</ul>
<h2>Sức khỏe tinh thần</h2>
<p>Buồn bã, dễ khóc trong vài ngày đầu là khá thường gặp. Nếu cảm giác buồn chán, lo âu kéo dài trên 2 tuần hoặc mẹ có ý nghĩ làm hại bản thân hay con, cần tìm sự hỗ trợ của nhân viên y tế ngay.</p>
<h2>Bố có thể giúp gì?</h2>
<p>Lắng nghe, chia sẻ việc chăm con ban đêm, chuẩn bị bữa ăn và để mẹ có thời gian ngủ là những cách hỗ trợ thiết thực nhất.</p>`,
  },
  {
    slug: 'huong-dan-an-dam-dung-cach',
    title: 'Hướng dẫn ăn dặm đúng cách cho bé từ 6 tháng',
    summary: 'Thời điểm, số bữa và nguyên tắc an toàn khi cho bé ăn dặm.',
    category: 'nutrition', age_group: '6-12', featured: 1,
    source_name: 'WHO', source_url: 'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
    content: `
<p>Từ khoảng 6 tháng tuổi, sữa mẹ vẫn rất quan trọng nhưng không còn đủ đáp ứng toàn bộ nhu cầu của bé. Đây là thời điểm bắt đầu ăn dặm.</p>
<h2>Nguyên tắc chính</h2>
<ul>
<li>Tiếp tục cho bú mẹ song song với ăn dặm.</li>
<li>Bắt đầu với lượng nhỏ, tăng dần độ đặc và đa dạng thực phẩm theo tuổi.</li>
<li>Khoảng 6–8 tháng: 2–3 bữa/ngày; 9–23 tháng: 3–4 bữa/ngày, có thể thêm 1–2 bữa phụ.</li>
<li>Bổ sung đa dạng nhóm thực phẩm: tinh bột, đạm (thịt, cá, trứng, đậu), rau củ, trái cây, chất béo.</li>
<li>Không thêm muối, đường vào đồ ăn của bé; không cho bé dưới 1 tuổi ăn mật ong.</li>
</ul>
<h2>An toàn thực phẩm</h2>
<ul>
<li>Rửa tay trước khi chế biến và cho bé ăn.</li>
<li>Dùng dụng cụ sạch, thức ăn nấu chín và dùng ngay.</li>
<li>Luôn ngồi cùng bé khi ăn, tránh thức ăn cứng, tròn nhỏ dễ gây hóc.</li>
</ul>
<h2>Cho bé ăn theo tín hiệu</h2>
<p>Kiên nhẫn, trò chuyện với bé khi ăn, không ép ăn. Để ý tín hiệu đói – no của bé.</p>`,
  },
  {
    slug: 'cot-moc-phat-trien-6-12-thang',
    title: 'Theo dõi các mốc phát triển của bé 6–12 tháng',
    summary: 'Vận động, giao tiếp và nhận thức của bé trong nửa sau năm đầu đời.',
    category: 'baby-care', age_group: '6-12',
    source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting',
    content: `
<p>Mỗi bé phát triển theo nhịp riêng. Các mốc dưới đây chỉ mang tính tham khảo để ba mẹ quan sát và trò chuyện cùng bác sĩ.</p>
<h2>Khoảng 6 tháng</h2>
<ul><li>Lẫy, giữ đầu vững, bắt đầu ngồi có hỗ trợ.</li><li>Phát ra âm thanh, cười, phản ứng khi được gọi.</li></ul>
<h2>Khoảng 9 tháng</h2>
<ul><li>Ngồi vững không cần hỗ trợ, bắt đầu bò.</li><li>Bập bẹ "ba ba", "ma ma"; có thể sợ người lạ.</li></ul>
<h2>Khoảng 12 tháng</h2>
<ul><li>Vịn đứng, đi men theo đồ vật.</li><li>Vẫy tay tạm biệt, nhặt vật nhỏ bằng ngón cái và ngón trỏ.</li></ul>
<h2>Ba mẹ có thể làm gì?</h2>
<p>Trò chuyện, đọc sách tranh, chơi ú òa, tạo không gian an toàn để bé tập vận động.</p>
<blockquote>Nếu bé mất kỹ năng đã có, hoặc ba mẹ lo lắng về sự phát triển của con, hãy trao đổi với bác sĩ nhi khoa.</blockquote>`,
  },
  {
    slug: 'dinh-duong-thai-ky',
    title: 'Dinh dưỡng thai kỳ: những điều mẹ bầu cần biết',
    summary: 'Ăn uống lành mạnh, bổ sung vi chất và khám thai định kỳ.',
    category: 'maternal-care', age_group: 'pregnancy', featured: 1,
    source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789241549912',
    content: `
<p>Dinh dưỡng tốt trong thai kỳ giúp mẹ khỏe mạnh và hỗ trợ sự phát triển của thai nhi.</p>
<h2>Ăn uống lành mạnh</h2>
<ul>
<li>Ăn đa dạng: rau xanh, trái cây, ngũ cốc, thịt cá, trứng, sữa và các loại đậu.</li>
<li>Uống đủ nước; hạn chế đồ uống có đường và caffeine.</li>
<li>Ăn chín uống sôi, tránh thực phẩm sống hoặc chưa tiệt trùng.</li>
</ul>
<h2>Bổ sung vi chất</h2>
<p>WHO khuyến nghị bổ sung sắt và axit folic hằng ngày trong thai kỳ. Liều lượng cụ thể hãy theo chỉ định của bác sĩ khám thai.</p>
<h2>Khám thai định kỳ</h2>
<p>Khám thai đầy đủ giúp phát hiện sớm các vấn đề như thiếu máu, tăng huyết áp hay tiểu đường thai kỳ.</p>
<h2>Vận động</h2>
<p>Duy trì vận động nhẹ nhàng như đi bộ nếu bác sĩ không có chỉ định khác.</p>`,
  },
  {
    slug: 'phat-trien-ngon-ngu-12-24-thang',
    title: 'Giúp bé 12–24 tháng phát triển ngôn ngữ',
    summary: 'Những cách đơn giản mỗi ngày để bé học nói tự nhiên.',
    category: 'baby-care', age_group: '12-24',
    source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting',
    content: `
<p>Giai đoạn 1–2 tuổi, vốn từ của bé tăng lên nhanh chóng nhờ được trò chuyện và tương tác mỗi ngày.</p>
<h2>Gợi ý cho ba mẹ</h2>
<ul>
<li>Gọi tên đồ vật, hành động trong sinh hoạt hằng ngày: "Mẹ đang rửa táo nhé".</li>
<li>Đọc sách tranh cùng bé, chỉ vào hình và hỏi "Con mèo đâu?".</li>
<li>Hát, đọc đồng dao, chơi trò chơi có lời.</li>
<li>Kiên nhẫn chờ bé phản hồi, nhắc lại và mở rộng câu của bé.</li>
<li>Hạn chế màn hình; WHO khuyến nghị không cho trẻ dưới 2 tuổi xem màn hình thụ động.</li>
</ul>
<blockquote>Nếu khoảng 18 tháng bé chưa nói được từ nào, không chỉ tay hay không phản ứng khi được gọi tên, hãy trao đổi với bác sĩ.</blockquote>`,
  },
];

const questions = [
  { q: 'Khi chăm sóc trẻ sơ sinh, việc giữ vệ sinh rốn cần lưu ý điều gì?',
    o: ['Tự ý bôi các loại thuốc lên rốn', 'Chăm sóc rốn theo hướng dẫn của nhân viên y tế', 'Thường xuyên dùng tay chạm vào rốn', 'Tự ý băng kín rốn'], c: 1,
    e: 'Rốn cần được giữ sạch và khô, không tự ý bôi thuốc hay băng kín. Hãy làm theo hướng dẫn của nhân viên y tế.', s: 'WHO', cat: 'baby-care' },
  { q: 'Khi trẻ sơ sinh có dấu hiệu bú không đủ, bố mẹ nên làm gì?',
    o: ['Tự ý cho trẻ uống thêm nước', 'Theo dõi dấu hiệu bú và tìm sự tư vấn từ nhân viên y tế', 'Đợi đến khi trẻ khóc mới cho bú', 'Tự ý thay đổi loại sữa'], c: 1,
    e: 'Trẻ dưới 6 tháng bú mẹ hoàn toàn không cần uống thêm nước. Hãy theo dõi tã ướt, cân nặng và nhờ nhân viên y tế tư vấn.', s: 'WHO, UNICEF', cat: 'nutrition' },
  { q: 'WHO khuyến nghị nuôi con hoàn toàn bằng sữa mẹ trong bao lâu?',
    o: ['3 tháng đầu', '4 tháng đầu', '6 tháng đầu', '12 tháng đầu'], c: 2,
    e: 'WHO khuyến nghị bú mẹ hoàn toàn trong 6 tháng đầu, sau đó ăn dặm và tiếp tục bú mẹ đến 2 tuổi hoặc lâu hơn.', s: 'WHO', cat: 'nutrition' },
  { q: 'Thời điểm phù hợp để bắt đầu cho bé ăn dặm là khoảng?',
    o: ['2 tháng tuổi', '4 tháng tuổi', '6 tháng tuổi', '12 tháng tuổi'], c: 2,
    e: 'Từ khoảng 6 tháng, bé cần thêm thức ăn bổ sung bên cạnh sữa mẹ.', s: 'WHO', cat: 'nutrition' },
  { q: 'Tư thế ngủ an toàn cho trẻ sơ sinh là?',
    o: ['Nằm sấp', 'Nằm nghiêng có gối chặn', 'Nằm ngửa trên mặt phẳng chắc chắn', 'Nằm trên gối mềm'], c: 2,
    e: 'Cho bé nằm ngửa trên mặt phẳng chắc chắn, không có gối, chăn dày hay thú bông giúp giảm nguy cơ đột tử.', s: 'WHO', cat: 'baby-care' },
  { q: 'Dấu hiệu nào ở trẻ sơ sinh cần đưa đi khám NGAY?',
    o: ['Bé nấc cụt sau khi bú', 'Bé hắt hơi vài lần', 'Bé bỏ bú, li bì, khó đánh thức', 'Bé ngủ nhiều vào ban ngày'], c: 2,
    e: 'Bỏ bú, li bì là dấu hiệu nguy hiểm. Hãy đưa bé đến cơ sở y tế ngay.', s: 'WHO', cat: 'vaccination' },
  { q: 'Không nên cho trẻ dưới 1 tuổi ăn thực phẩm nào sau đây?',
    o: ['Cháo rau củ', 'Mật ong', 'Chuối nghiền', 'Bí đỏ hấp'], c: 1,
    e: 'Mật ong có thể chứa bào tử gây ngộ độc ở trẻ nhỏ, không dùng cho trẻ dưới 12 tháng.', s: 'Khuyến nghị nhi khoa', cat: 'nutrition' },
  { q: 'Cách kiểm tra bé có bị lạnh hay nóng quá chính xác hơn là?',
    o: ['Sờ tay bé', 'Sờ chân bé', 'Sờ gáy hoặc lưng bé', 'Nhìn má bé'], c: 2,
    e: 'Tay chân bé thường mát hơn cơ thể. Sờ gáy hoặc lưng giúp đánh giá thân nhiệt chính xác hơn.', s: 'WHO', cat: 'baby-care' },
  { q: 'Sau sinh, dấu hiệu nào ở mẹ cần đi khám ngay?',
    o: ['Mệt mỏi nhẹ', 'Ra máu nhiều, sốt, sản dịch có mùi hôi', 'Thèm ngủ', 'Đói bụng nhanh'], c: 1,
    e: 'Ra máu nhiều, sốt, sản dịch hôi là dấu hiệu nguy hiểm sau sinh, cần khám ngay.', s: 'WHO', cat: 'maternal-care' },
  { q: 'Để giúp bé 1–2 tuổi phát triển ngôn ngữ, ba mẹ nên?',
    o: ['Cho bé xem video nhiều hơn', 'Trò chuyện, đọc sách và gọi tên đồ vật hằng ngày', 'Chờ bé tự nói', 'Chỉ nói chuyện khi bé hỏi'], c: 1,
    e: 'Tương tác trực tiếp mỗi ngày là cách tốt nhất giúp bé học nói. Hạn chế màn hình với trẻ dưới 2 tuổi.', s: 'UNICEF, WHO', cat: 'baby-care' },
];

const missions = [
  { t: 'Đọc sách tranh cùng bé trong 15 phút', d: 'Chọn một cuốn sách tranh, chỉ vào hình và trò chuyện cùng bé.', p: 'Bố', g: 'Tăng tương tác giữa bố và con', pts: 10, tag: 'reading' },
  { t: 'Tìm hiểu về phục hồi sau sinh', d: 'Đọc bài "Phục hồi sức khỏe sau sinh" và chia sẻ với mẹ điều bạn học được.', p: 'Bố', g: 'Thấu hiểu những khó khăn của mẹ', pts: 15, tag: 'maternal' },
  { t: 'Cùng chuẩn bị bữa ăn lành mạnh', d: 'Bố và mẹ cùng lên thực đơn và nấu một bữa ăn đủ chất.', p: 'Bố và mẹ', g: 'Chia sẻ trách nhiệm', pts: 15, tag: 'meal' },
  { t: 'Hát ru hoặc trò chuyện với bé', d: 'Dành 10 phút hát ru hoặc kể chuyện cho bé nghe trước giờ ngủ.', p: 'Bố và mẹ', g: 'Tăng tương tác với trẻ', pts: 10, tag: 'play' },
  { t: 'Chơi tương tác với bé', d: 'Chơi ú òa, lăn bóng hoặc xếp hình cùng bé 15 phút.', p: 'Mẹ', g: 'Phát triển vận động và gắn kết', pts: 10, tag: 'play' },
  { t: 'Cho mẹ một giờ nghỉ ngơi', d: 'Bố trông bé trọn 1 giờ để mẹ được ngủ hoặc thư giãn.', p: 'Bố', g: 'Chia sẻ trách nhiệm chăm con', pts: 20, tag: 'maternal' },
  { t: 'Kiểm tra lịch tiêm chủng của bé', d: 'Xem sổ tiêm chủng và thêm mũi tiêm tiếp theo vào Lịch chung gia đình.', p: 'Bố và mẹ', g: 'Chủ động chăm sóc sức khỏe', pts: 10, tag: 'health' },
];

async function seed(db) {
  const a = await db.get('SELECT COUNT(*) AS n FROM articles');
  if (!a || Number(a.n) === 0) {
    for (const x of articles) {
      await db.run(
        `INSERT INTO articles (slug,title,summary,content,category,age_group,source_name,source_url,reviewer,status,featured)
         VALUES (?,?,?,?,?,?,?,?,?,'published',?)`,
        [x.slug, x.title, x.summary, x.content.trim(), x.category, x.age_group, x.source_name, x.source_url, REVIEW, x.featured || 0]
      );
    }
    console.log(`[seed] Đã thêm ${articles.length} bài viết mẫu`);
  }
  const q = await db.get('SELECT COUNT(*) AS n FROM quiz_questions');
  if (!q || Number(q.n) === 0) {
    for (const x of questions) {
      await db.run('INSERT INTO quiz_questions (question,options,correct_index,explanation,source,category) VALUES (?,?,?,?,?,?)',
        [x.q, JSON.stringify(x.o), x.c, x.e, x.s, x.cat]);
    }
    console.log(`[seed] Đã thêm ${questions.length} câu hỏi quiz`);
  }
  const m = await db.get('SELECT COUNT(*) AS n FROM missions');
  if (!m || Number(m.n) === 0) {
    for (const x of missions) {
      await db.run('INSERT INTO missions (title,description,participant,goal,points,tag) VALUES (?,?,?,?,?,?)',
        [x.t, x.d, x.p, x.g, x.pts, x.tag]);
    }
    console.log(`[seed] Đã thêm ${missions.length} nhiệm vụ`);
  }
}

module.exports = { seed };
