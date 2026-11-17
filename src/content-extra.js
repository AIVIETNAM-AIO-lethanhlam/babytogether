// Bài viết bổ sung (11/2026): lấp đầy kiến thức cho từng giai đoạn – mang thai, 0–6, 6–12, 12–24 tháng.
// Được thêm tự động khi máy chủ khởi động nếu chưa có (theo slug) – kể cả với cơ sở dữ liệu đã có sẵn trên Cloudflare D1.
// Nội dung tổng hợp từ khuyến nghị chung của WHO, UNICEF và Bộ Y tế; chỉ mang tính tham khảo, không thay thế tư vấn y tế.
'use strict';

const A = [];
const add = (x) => A.push(x);

// ======================= MANG THAI =======================
add({
  slug: 'kham-thai-dinh-ky', category: 'maternal-care', age_group: 'pregnancy', featured: 0,
  title: 'Khám thai định kỳ và những dấu hiệu nguy hiểm khi mang thai',
  summary: 'Nên khám thai bao nhiêu lần, cần làm xét nghiệm gì và khi nào phải đến viện ngay.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789241549912',
  content: `
<p>Khám thai đều đặn giúp phát hiện sớm các vấn đề của mẹ và bé, từ đó xử trí kịp thời. WHO khuyến nghị mẹ bầu có <strong>ít nhất 8 lần tiếp xúc với nhân viên y tế</strong> trong suốt thai kỳ, lần đầu nên trước tuần thứ 12.</p>
<h2>Những mốc khám quan trọng</h2>
<ul>
<li><b>Trước 12 tuần:</b> xác định thai trong tử cung, tuổi thai, ngày dự sinh; xét nghiệm máu, nước tiểu; tầm soát HIV, giang mai, viêm gan B để dự phòng lây truyền từ mẹ sang con.</li>
<li><b>Khoảng tuần 11–14:</b> siêu âm đo độ mờ da gáy và sàng lọc dị tật theo chỉ định của bác sĩ.</li>
<li><b>Khoảng tuần 20–24:</b> siêu âm hình thái học để kiểm tra sự phát triển các cơ quan của thai.</li>
<li><b>Khoảng tuần 24–28:</b> làm nghiệm pháp đường huyết để tầm soát đái tháo đường thai kỳ.</li>
<li><b>3 tháng cuối:</b> khám dày hơn để theo dõi huyết áp, tim thai, ngôi thai và chuẩn bị sinh.</li>
</ul>
<h2>Bổ sung và tiêm phòng</h2>
<ul>
<li>Uống viên sắt – axit folic hằng ngày theo hướng dẫn của nhân viên y tế để phòng thiếu máu và dị tật ống thần kinh.</li>
<li>Tiêm phòng uốn ván theo lịch được hướng dẫn tại cơ sở y tế để bảo vệ cả mẹ và bé sơ sinh.</li>
<li>Không tự ý dùng thuốc, kể cả thuốc bổ hay thuốc nam, khi chưa hỏi ý kiến bác sĩ.</li>
</ul>
<div class="callout danger"><p><b>Đến cơ sở y tế ngay nếu có:</b> ra máu âm đạo; đau bụng dữ dội; nhức đầu nhiều, hoa mắt, nhìn mờ; phù mặt, phù tay; co giật; sốt cao; ra nước ối; thai máy ít hoặc không thấy máy.</p></div>
<blockquote>Mang theo sổ khám thai mỗi lần đi khám và ghi lại các câu hỏi để hỏi bác sĩ. Bố nên cùng đi khám để hiểu và hỗ trợ mẹ tốt hơn.</blockquote>`,
});
add({
  slug: 'song-khoe-khi-mang-thai', category: 'maternal-care', age_group: 'pregnancy', featured: 0,
  title: 'Sống khỏe khi mang thai: vận động, nghỉ ngơi và những điều cần tránh',
  summary: 'Mẹ bầu nên vận động thế nào, ngủ ra sao và cần tránh những gì để thai kỳ khỏe mạnh.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789241549912',
  content: `
<p>Một lối sống lành mạnh giúp mẹ bầu khỏe, giảm khó chịu trong thai kỳ và chuẩn bị tốt cho cuộc sinh. Bố có thể đồng hành bằng cách cùng thay đổi thói quen với mẹ.</p>
<h2>Vận động vừa sức</h2>
<ul>
<li>Nếu thai kỳ bình thường, mẹ nên vận động mức độ vừa phải như đi bộ, bơi, yoga cho bà bầu khoảng <b>150 phút mỗi tuần</b>, chia đều nhiều ngày.</li>
<li>Tránh các môn có nguy cơ va chạm, té ngã; dừng lại khi thấy chóng mặt, đau bụng, ra máu hoặc khó thở.</li>
<li>Hỏi ý kiến bác sĩ trước khi tập nếu có bệnh lý hoặc thai kỳ nguy cơ cao.</li>
</ul>
<h2>Nghỉ ngơi và giấc ngủ</h2>
<ul>
<li>Ngủ đủ giấc, nghỉ trưa ngắn; từ 3 tháng giữa nên ưu tiên nằm nghiêng (đặc biệt nghiêng trái) khi ngủ.</li>
<li>Kê gối dưới bụng, giữa hai chân để dễ chịu hơn.</li>
</ul>
<h2>Những điều cần tránh</h2>
<ul>
<li><b>Không hút thuốc, tránh khói thuốc</b>, không uống rượu bia trong suốt thai kỳ.</li>
<li>Hạn chế cà phê, trà đặc, nước tăng lực.</li>
<li>Không ăn thịt, cá, trứng tái sống; rửa sạch rau quả; tránh pho mát chưa tiệt trùng.</li>
<li>Không tự ý dùng thuốc, kể cả thuốc nam, thực phẩm chức năng khi chưa hỏi bác sĩ.</li>
<li>Tránh tiếp xúc hóa chất, thuốc trừ sâu, phân mèo; đeo găng khi làm vườn.</li>
</ul>
<div class="callout success"><p><b>Bố đồng hành:</b> cùng đi khám thai, cùng bỏ thuốc lá, chia sẻ việc nhà nặng nhọc và lắng nghe những lo lắng của mẹ – sức khỏe tinh thần của mẹ cũng quan trọng như sức khỏe thể chất.</p></div>`,
});
add({
  slug: 'chuan-bi-di-sinh-dau-hieu-chuyen-da', category: 'maternal-care', age_group: 'pregnancy', featured: 0,
  title: 'Chuẩn bị đi sinh: đồ cần mang và dấu hiệu chuyển dạ',
  summary: 'Danh sách đồ đi sinh cho mẹ và bé, cách nhận biết chuyển dạ thật và khi nào cần vào viện.',
  source_name: 'Bộ Y tế', source_url: 'https://moh.gov.vn',
  content: `
<p>Từ khoảng tuần 36, ba mẹ nên chuẩn bị sẵn túi đồ đi sinh và kế hoạch di chuyển đến bệnh viện để không bị bất ngờ.</p>
<h2>Giấy tờ cần mang</h2>
<ul>
<li>Căn cước công dân của mẹ (và của bố), thẻ bảo hiểm y tế.</li>
<li>Sổ khám thai, kết quả siêu âm và xét nghiệm.</li>
</ul>
<h2>Đồ cho mẹ</h2>
<ul>
<li>Vài bộ quần áo rộng, cài trước để tiện cho con bú; áo ngực cho con bú.</li>
<li>Băng vệ sinh dành cho sản phụ, quần lót dùng một lần, khăn mặt, đồ vệ sinh cá nhân.</li>
<li>Dép đi trong phòng, áo khoác mỏng, bình nước, ít đồ ăn nhẹ.</li>
</ul>
<h2>Đồ cho bé</h2>
<ul>
<li>Vài bộ quần áo sơ sinh, mũ, bao tay, bao chân, tã/bỉm sơ sinh.</li>
<li>Khăn quấn, khăn lau mềm, khăn sữa.</li>
<li>Không cần mang bình sữa và sữa công thức nếu không có chỉ định – sữa non của mẹ là tốt nhất cho bé.</li>
</ul>
<h2>Dấu hiệu chuyển dạ</h2>
<ul>
<li><b>Cơn gò tử cung đều đặn</b>, mạnh dần, gần nhau dần và không giảm khi nghỉ ngơi (khác với cơn gò “giả” thường không đều và tự hết).</li>
<li><b>Ra nhớt hồng</b> (có lẫn chút máu) ở âm đạo.</li>
<li><b>Vỡ ối:</b> nước chảy ra âm đạo, có thể ồ ạt hoặc rỉ rả liên tục.</li>
</ul>
<div class="callout danger"><p><b>Vào viện ngay khi:</b> vỡ ối hoặc rỉ ối; ra máu đỏ tươi; cơn gò đều khoảng 5 phút một lần; thai máy giảm; đau đầu, nhìn mờ, sốt hoặc đau bụng dữ dội liên tục.</p></div>
<div class="callout success"><p><b>Mẹo:</b> Lưu sẵn số điện thoại bệnh viện, phương án di chuyển và người trông nhà. Gọi <b>115</b> khi cần cấp cứu.</p></div>`,
});
add({
  slug: 'cham-soc-be-ngay-sau-sinh', category: 'baby-care', age_group: '0-6', featured: 0,
  title: 'Những giờ đầu sau sinh: da kề da, bú sớm và tiêm ngừa',
  summary: 'Chăm sóc thiết yếu trong 90 phút đầu đời giúp bé ấm, bú mẹ sớm và giảm nguy cơ nhiễm khuẩn.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
  content: `
<p>Bộ Y tế và WHO hướng dẫn thực hiện <strong>chăm sóc thiết yếu bà mẹ – trẻ sơ sinh</strong> ngay sau sinh. Ba mẹ biết trước sẽ chủ động phối hợp với nhân viên y tế.</p>
<h2>Ngay sau khi bé chào đời</h2>
<ul>
<li><b>Lau khô và da kề da:</b> bé được lau khô, đặt nằm sấp trên ngực mẹ, da bé tiếp xúc trực tiếp với da mẹ, đắp khăn ấm. Nên duy trì liên tục ít nhất 90 phút.</li>
<li><b>Kẹp dây rốn muộn:</b> chờ khoảng 1–3 phút mới kẹp và cắt dây rốn nếu bé khỏe.</li>
<li><b>Bú mẹ sớm trong giờ đầu:</b> khi bé có dấu hiệu tìm vú (mút tay, há miệng, rúc đầu), hỗ trợ bé ngậm bắt vú. Sữa non tuy ít nhưng rất giàu kháng thể.</li>
</ul>
<h2>Trong 24 giờ đầu</h2>
<ul>
<li>Bé được tiêm vitamin K1 để phòng xuất huyết và tiêm vắc xin viêm gan B trong vòng 24 giờ; vắc xin lao (BCG) tiêm trong tháng đầu.</li>
<li>Hoãn tắm cho bé ít nhất 24 giờ sau sinh để bé không bị hạ thân nhiệt.</li>
<li>Bú mẹ hoàn toàn, không cho bé uống nước, nước đường hay mật ong.</li>
</ul>
<div class="callout warning"><p><b>Lưu ý:</b> Báo ngay cho nhân viên y tế nếu bé thở nhanh hoặc rút lõm lồng ngực, tím tái, không bú được, quá lạnh hoặc nóng sốt, vàng da xuất hiện trong ngày đầu.</p></div>
<blockquote>Bố có thể da kề da với bé khi mẹ cần nghỉ ngơi hoặc sinh mổ – đây cũng là cách gắn kết tuyệt vời đầu tiên.</blockquote>`,
});

// ======================= 0–6 THÁNG =======================
add({
  slug: 'giac-ngu-an-toan-tre-so-sinh', category: 'baby-care', age_group: '0-6', featured: 0,
  title: 'Giấc ngủ an toàn cho trẻ sơ sinh',
  summary: 'Tư thế ngủ, chỗ ngủ và những điều cần tránh để giảm nguy cơ đột tử ở trẻ nhỏ.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
  content: `
<p>Trẻ sơ sinh ngủ khoảng 14–17 tiếng mỗi ngày, chia thành nhiều giấc ngắn. Một chỗ ngủ an toàn quan trọng không kém việc bé ngủ đủ.</p>
<h2>Nguyên tắc ngủ an toàn</h2>
<ul>
<li><b>Luôn đặt bé nằm ngửa</b> khi ngủ, cả giấc ngày lẫn giấc đêm.</li>
<li>Bé nằm trên <b>mặt phẳng chắc chắn</b> (nệm cũi cứng vừa khít), không nằm trên sofa, gối hay nệm quá mềm.</li>
<li>Giữ chỗ ngủ trống: không gối, không chăn dày, không thú bông, không quây cũi bằng đệm mềm.</li>
<li>Nên cho bé <b>ngủ cùng phòng với ba mẹ nhưng nằm riêng giường/cũi</b>, nhất là trong 6 tháng đầu.</li>
<li>Không để bé bị quá nóng: mặc vừa đủ ấm, không đội mũ khi ngủ trong phòng ấm, phòng thông thoáng.</li>
<li>Tuyệt đối không hút thuốc trong nhà và gần bé.</li>
</ul>
<h2>Khi bé biết lật</h2>
<p>Khi bé tự lật được hai chiều, bé có thể tự chọn tư thế; ba mẹ vẫn đặt bé nằm ngửa lúc bắt đầu ngủ và giữ chỗ ngủ trống, an toàn.</p>
<div class="callout warning"><p><b>Tránh:</b> ngủ chung giường khi ba mẹ quá mệt, đã uống rượu bia hoặc dùng thuốc gây buồn ngủ; để bé ngủ trên ghế sofa cùng người lớn; dùng gối chặn, gối chống bẹt đầu.</p></div>`,
});
add({
  slug: 'tam-va-ve-sinh-cho-tre-so-sinh', category: 'baby-care', age_group: '0-6', featured: 0,
  title: 'Tắm và vệ sinh hằng ngày cho trẻ sơ sinh',
  summary: 'Tắm bao lâu một lần, nước ấm bao nhiêu là đủ và cách vệ sinh mắt, mũi, vùng tã cho bé.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
  content: `
<p>Trẻ sơ sinh không cần tắm mỗi ngày. Trong những tuần đầu, tắm 2–3 lần mỗi tuần và lau người các ngày còn lại là đủ, miễn giữ bé sạch sẽ ở mặt, cổ, tay và vùng tã.</p>
<h2>Chuẩn bị trước khi tắm</h2>
<ul>
<li>Phòng kín gió, ấm áp; chuẩn bị sẵn khăn, quần áo, tã trước khi cởi đồ cho bé.</li>
<li>Nước ấm vừa phải: thử bằng khuỷu tay hoặc mặt trong cổ tay, thấy ấm dễ chịu, không nóng.</li>
<li>Rửa tay sạch trước khi tắm cho bé.</li>
</ul>
<h2>Các bước tắm</h2>
<ol>
<li>Lau mắt bằng khăn sạch thấm nước ấm, lau từ khóe trong ra ngoài, mỗi bên mắt một góc khăn khác nhau.</li>
<li>Lau mặt, gội đầu nhanh rồi lau khô tóc ngay.</li>
<li>Tắm người nhẹ nhàng, chú ý các nếp gấp ở cổ, nách, bẹn.</li>
<li>Thời gian tắm chỉ khoảng 5–10 phút; lau khô ngay, đặc biệt là vùng rốn khi rốn chưa rụng.</li>
</ol>
<h2>Vệ sinh vùng tã</h2>
<ul>
<li>Thay tã ngay khi bé đi tiểu, đi ngoài; với bé gái lau từ trước ra sau.</li>
<li>Để da khô thoáng một lúc trước khi mặc tã mới để phòng hăm.</li>
</ul>
<div class="callout danger"><p><b>An toàn:</b> Không bao giờ rời mắt hoặc để bé một mình trong chậu tắm, dù chỉ vài giây. Trẻ có thể đuối nước trong lượng nước rất ít.</p></div>`,
});
add({
  slug: 'vang-da-so-sinh', category: 'vaccination', age_group: '0-6', featured: 0,
  title: 'Vàng da sơ sinh: khi nào bình thường, khi nào nguy hiểm?',
  summary: 'Phân biệt vàng da sinh lý và vàng da bệnh lý để đưa bé đi khám kịp thời.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789240045989',
  content: `
<p>Nhiều trẻ sơ sinh bị vàng da trong tuần đầu. Phần lớn là <strong>vàng da sinh lý</strong>, xuất hiện từ ngày thứ 2–3, nhẹ và tự hết. Tuy nhiên vàng da nặng có thể gây tổn thương não, vì vậy ba mẹ cần theo dõi kỹ.</p>
<h2>Cách tự kiểm tra</h2>
<ul>
<li>Quan sát bé dưới ánh sáng tự nhiên ban ngày.</li>
<li>Ấn nhẹ ngón tay lên da trán, ngực, bụng, đùi rồi thả ra: nếu chỗ đó có màu vàng là bé đang vàng da.</li>
<li>Vàng da thường lan từ mặt xuống thân rồi xuống tay chân – càng lan xuống thấp càng nặng.</li>
</ul>
<div class="callout danger"><p><b>Đưa bé đi khám ngay nếu:</b> vàng da xuất hiện trong 24 giờ đầu; vàng lan xuống lòng bàn tay, lòng bàn chân; bé bú kém, ngủ li bì, khó đánh thức; vàng da kéo dài quá 2 tuần (quá 3 tuần ở trẻ sinh non); phân bạc màu (trắng, vàng nhạt) hoặc nước tiểu sẫm màu.</p></div>
<h2>Những điều nên và không nên</h2>
<ul>
<li>Cho bé bú mẹ thường xuyên, 8–12 lần mỗi ngày, giúp đào thải sắc tố vàng qua phân.</li>
<li><b>Không</b> tự điều trị bằng cách phơi nắng – cách này không đủ hiệu quả, dễ làm bé bị lạnh, bỏng nắng và làm chậm việc đi khám.</li>
<li>Không tự ý cho bé uống nước, nước lá hay thuốc.</li>
</ul>`,
});
add({
  slug: 'cot-moc-phat-trien-0-6-thang', category: 'baby-care', age_group: '0-6', featured: 0,
  title: 'Các mốc phát triển của bé 0–6 tháng và cách chơi cùng bé',
  summary: 'Bé biết cười, giữ đầu, lật, bập bẹ khi nào – và những trò chơi giúp bé phát triển.',
  source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting/child-development',
  content: `
<p>Mỗi bé phát triển theo nhịp riêng, các mốc dưới đây chỉ là khoảng thời gian thường gặp để ba mẹ tham khảo.</p>
<h2>Khoảng 2 tháng</h2>
<ul><li>Cười đáp lại khi được nói chuyện, nhìn theo khuôn mặt người.</li><li>Nằm sấp có thể nâng đầu trong chốc lát.</li><li>Phát ra âm “ư, a”.</li></ul>
<h2>Khoảng 4 tháng</h2>
<ul><li>Giữ đầu vững khi được bế.</li><li>Cười thành tiếng, với tay lấy đồ chơi, đưa tay lên miệng.</li><li>Chống tay nâng ngực khi nằm sấp.</li></ul>
<h2>Khoảng 6 tháng</h2>
<ul><li>Lật được, ngồi có người đỡ.</li><li>Bập bẹ các âm như “ba”, “ma”; nhận ra người quen.</li><li>Chuyển đồ chơi từ tay này sang tay kia.</li></ul>
<h2>Chơi cùng bé mỗi ngày</h2>
<ul>
<li>Trò chuyện, hát, kể cho bé nghe việc ba mẹ đang làm – bé học ngôn ngữ từ những tháng đầu.</li>
<li>Cho bé nằm sấp chơi vài lần mỗi ngày khi bé thức và có người lớn trông (tummy time) để cổ, lưng khỏe hơn.</li>
<li>Đưa đồ chơi có màu sắc, âm thanh để bé nhìn theo, với lấy.</li>
<li>WHO khuyến nghị trẻ dưới 1 tuổi <b>không xem màn hình</b> (tivi, điện thoại).</li>
</ul>
<div class="callout warning"><p><b>Trao đổi với bác sĩ nếu:</b> 2 tháng bé không nhìn theo, không phản ứng với tiếng động lớn; 4 tháng chưa giữ được đầu, không cười; 6 tháng không với lấy đồ vật, người cứng đờ hoặc mềm nhũn, hoặc bé mất đi kỹ năng đã có.</p></div>`,
});
add({
  slug: 'cam-xuc-cua-me-sau-sinh', category: 'maternal-care', age_group: '0-6', featured: 0,
  title: 'Cảm xúc của mẹ sau sinh: “baby blues” và trầm cảm sau sinh',
  summary: 'Buồn bã sau sinh là thường gặp, nhưng có những dấu hiệu cho thấy mẹ cần được hỗ trợ chuyên môn.',
  source_name: 'WHO', source_url: 'https://www.who.int/health-topics/maternal-health',
  content: `
<p>Sau sinh, nội tiết thay đổi, thiếu ngủ và áp lực chăm con khiến nhiều mẹ dễ xúc động. Hiểu đúng giúp cả gia đình nhận ra khi nào mẹ cần thêm hỗ trợ.</p>
<h2>“Baby blues” – thường gặp và thoáng qua</h2>
<p>Mẹ hay khóc, dễ cáu, lo lắng, tâm trạng lên xuống trong vài ngày đầu đến khoảng <b>2 tuần</b> sau sinh. Tình trạng này thường tự cải thiện khi mẹ được nghỉ ngơi và có người chia sẻ.</p>
<h2>Dấu hiệu trầm cảm sau sinh</h2>
<ul>
<li>Buồn bã, trống rỗng, mất hứng thú kéo dài <b>hơn 2 tuần</b>.</li>
<li>Mất ngủ dù bé đang ngủ, hoặc ngủ quá nhiều; chán ăn hoặc ăn quá nhiều.</li>
<li>Cảm thấy vô dụng, tội lỗi, không gắn kết được với con.</li>
<li>Lo âu quá mức, hoảng sợ, khó tập trung.</li>
</ul>
<div class="callout danger"><p>Nếu mẹ có ý nghĩ làm hại bản thân hoặc em bé, hãy ở bên mẹ và <b>đưa mẹ đến cơ sở y tế ngay</b> hoặc gọi <b>115</b>. Đây là tình trạng cần được giúp đỡ khẩn cấp, không phải lỗi của mẹ.</p></div>
<h2>Bố và gia đình có thể làm gì?</h2>
<ul>
<li>Chia ca chăm bé ban đêm để mẹ được ngủ trọn vài tiếng.</li>
<li>Lắng nghe mà không phán xét, không so sánh mẹ với người khác.</li>
<li>Nhận bớt việc nhà, nấu ăn, tiếp khách thay mẹ.</li>
<li>Cùng mẹ đi khám nếu các dấu hiệu kéo dài – trầm cảm sau sinh điều trị được.</li>
</ul>`,
});

// ======================= 6–12 THÁNG =======================
add({
  slug: 'thuc-don-an-dam-theo-thang', category: 'nutrition', age_group: '6-12', featured: 0,
  title: 'Ăn dặm theo từng tháng: bé 6–12 tháng ăn bao nhiêu là đủ?',
  summary: 'Số bữa, lượng ăn và độ thô của thức ăn phù hợp với bé 6–8 tháng và 9–11 tháng.',
  source_name: 'WHO', source_url: 'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
  content: `
<p>Sữa mẹ vẫn là nguồn dinh dưỡng chính trong năm đầu. Thức ăn dặm bổ sung thêm năng lượng, sắt, kẽm mà bé cần khi lớn dần. Dưới đây là gợi ý theo khuyến nghị của WHO.</p>
<h2>Bé 6–8 tháng</h2>
<ul>
<li><b>Số bữa:</b> 2–3 bữa chính mỗi ngày, có thể thêm 1–2 bữa phụ.</li>
<li><b>Lượng:</b> bắt đầu 2–3 thìa mỗi bữa, tăng dần đến khoảng nửa chén (chén 250ml).</li>
<li><b>Độ thô:</b> cháo đặc, bột đặc, thức ăn nghiền nhuyễn; khoảng 8 tháng có thể cho bé tập cầm thức ăn mềm bằng tay.</li>
</ul>
<h2>Bé 9–11 tháng</h2>
<ul>
<li><b>Số bữa:</b> 3–4 bữa chính, thêm 1–2 bữa phụ.</li>
<li><b>Lượng:</b> khoảng nửa chén mỗi bữa.</li>
<li><b>Độ thô:</b> thức ăn băm nhỏ, cắt miếng nhỏ mềm để bé tập nhai.</li>
</ul>
<h2>Một bữa ăn đủ chất</h2>
<ul>
<li>Tinh bột: gạo, khoai, ngô.</li>
<li>Đạm: thịt, cá, trứng, tôm, đậu – nên có mỗi ngày, đặc biệt thực phẩm giàu sắt như thịt bò, gan.</li>
<li>Rau xanh, củ quả có màu vàng cam như bí đỏ, cà rốt; trái cây chín.</li>
<li>Thêm một chút dầu, mỡ vào bát bột/cháo của bé.</li>
</ul>
<div class="callout warning"><p><b>Không nên:</b> nêm muối, đường, nước mắm vào đồ ăn của bé; cho bé dưới 12 tháng ăn mật ong; cho ăn hạt cứng nguyên hạt, nho nguyên quả hay miếng thức ăn tròn, cứng dễ gây hóc.</p></div>
<div class="callout success"><p><b>Mẹo:</b> Mỗi loại thực phẩm mới nên thử vài ngày để theo dõi dị ứng. Bé có thể cần nếm 8–10 lần mới chịu một món mới – đừng vội bỏ cuộc.</p></div>`,
});
add({
  slug: 'moc-rang-va-cham-soc-rang-mieng', category: 'baby-care', age_group: '6-12', featured: 0,
  title: 'Bé mọc răng: dấu hiệu và cách chăm sóc răng miệng từ chiếc răng đầu tiên',
  summary: 'Mọc răng có gây sốt không, làm sao giúp bé dễ chịu và đánh răng cho bé thế nào.',
  source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting',
  content: `
<p>Chiếc răng đầu tiên thường nhú khoảng 6 tháng tuổi, nhưng sớm hay muộn vài tháng đều bình thường. Thường răng cửa hàm dưới mọc trước.</p>
<h2>Dấu hiệu mọc răng</h2>
<ul>
<li>Chảy nhiều nước dãi, thích cắn, gặm đồ vật.</li>
<li>Lợi sưng đỏ, bé quấy khóc, ngủ không yên hơn bình thường.</li>
<li>Có thể hơi ấm người, nhưng <b>mọc răng không gây sốt cao</b>. Nếu bé sốt từ 38°C trở lên, tiêu chảy nhiều hoặc bỏ ăn, hãy tìm nguyên nhân khác và cho bé đi khám.</li>
</ul>
<h2>Giúp bé dễ chịu</h2>
<ul>
<li>Cho bé gặm vòng gặm nướu sạch, đã làm mát trong ngăn mát tủ lạnh (không để đông đá).</li>
<li>Rửa tay sạch rồi xoa nhẹ lợi cho bé.</li>
<li>Không dùng gel bôi tê, thuốc hay vòng hổ phách đeo cổ khi chưa hỏi bác sĩ – vòng đeo cổ có nguy cơ gây nghẹt thở.</li>
</ul>
<h2>Vệ sinh răng miệng</h2>
<ul>
<li>Ngay khi có răng đầu tiên, chải răng cho bé <b>2 lần mỗi ngày</b> bằng bàn chải lông mềm và một lượng kem đánh răng có fluor nhỏ cỡ hạt gạo.</li>
<li>Không cho bé ngậm bình sữa khi ngủ; hạn chế đồ ngọt, nước ép.</li>
<li>Nên cho bé khám răng lần đầu khi khoảng 1 tuổi.</li>
</ul>`,
});
add({
  slug: 'phong-tai-nan-khi-be-tap-bo', category: 'baby-care', age_group: '6-12', featured: 0,
  title: 'An toàn trong nhà khi bé bắt đầu lật, bò, vịn đứng',
  summary: 'Danh sách kiểm tra nhà cửa giúp phòng ngã, hóc dị vật, bỏng, ngộ độc và đuối nước.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789241563574',
  content: `
<p>Từ 6 tháng, bé lật, bò rồi vịn đứng rất nhanh và thích cho mọi thứ vào miệng. Hãy thử ngồi xuống ngang tầm mắt bé để nhìn ngôi nhà như bé nhìn.</p>
<h2>Phòng ngã</h2>
<ul>
<li>Không để bé một mình trên giường, sofa, bàn thay tã dù chỉ vài giây.</li>
<li>Lắp chắn cầu thang, chắn cửa sổ, ban công.</li>
<li>Cố định tủ, kệ, tivi vào tường để không đổ đè lên bé.</li>
<li>Hạn chế dùng xe tập đi – dễ gây ngã cầu thang và không giúp bé đi sớm hơn.</li>
</ul>
<h2>Phòng hóc, nghẹt thở</h2>
<ul>
<li>Cất các vật nhỏ: cúc áo, đồng xu, pin cúc áo, hạt, nắp bút, đồ chơi rời mảnh nhỏ.</li>
<li>Không để túi ni lông, dây rèm, dây sạc trong tầm với của bé.</li>
</ul>
<h2>Phòng bỏng, điện giật, ngộ độc</h2>
<ul>
<li>Không bế bé khi đang cầm đồ uống nóng; để nồi, ấm, phích nước xa mép bàn.</li>
<li>Che ổ điện, gom dây điện gọn gàng.</li>
<li>Thuốc, hóa chất tẩy rửa, dầu hỏa cất trên cao, có khóa, để trong bao bì gốc.</li>
</ul>
<div class="callout danger"><p><b>Đuối nước:</b> Trẻ có thể đuối nước chỉ trong vài phân nước. Luôn đậy kín chum, vại, xô, chậu; đổ hết nước sau khi dùng; không bao giờ để bé một mình gần nước.</p></div>`,
});
add({
  slug: 'xu-tri-sot-tieu-chay-tai-nha', category: 'vaccination', age_group: '6-12', featured: 0,
  title: 'Bé sốt, tiêu chảy: chăm sóc tại nhà và khi nào cần đi khám',
  summary: 'Cách theo dõi nhiệt độ, bù nước bằng oresol và các dấu hiệu nguy hiểm không được bỏ qua.',
  source_name: 'WHO', source_url: 'https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease',
  content: `
<p>Sốt và tiêu chảy là những vấn đề thường gặp khi bé bắt đầu bò, gặm đồ vật và ăn dặm. Đa số tự khỏi, nhưng ba mẹ cần biết cách chăm sóc và nhận ra dấu hiệu nặng.</p>
<h2>Khi bé sốt</h2>
<ul>
<li>Bé được coi là sốt khi nhiệt độ từ <b>38°C trở lên</b>. Nên dùng nhiệt kế điện tử đo ở nách.</li>
<li>Mặc đồ thoáng mát, không ủ kín; cho bé bú mẹ và uống nhiều hơn.</li>
<li>Chỉ dùng thuốc hạ sốt theo hướng dẫn của bác sĩ hoặc dược sĩ, liều tính theo cân nặng của bé. Không dùng aspirin cho trẻ nhỏ; không tự ý dùng kháng sinh.</li>
<li><b>Trẻ dưới 3 tháng</b> có sốt cần được đưa đi khám ngay.</li>
</ul>
<h2>Khi bé tiêu chảy</h2>
<ul>
<li>Tiếp tục cho bé bú mẹ và ăn bình thường, chia nhỏ bữa.</li>
<li>Bù nước bằng <b>dung dịch oresol (ORS)</b> pha đúng theo hướng dẫn trên gói, cho uống từng thìa nhỏ sau mỗi lần đi ngoài. Không tự pha đặc hơn hoặc loãng hơn.</li>
<li>Bác sĩ có thể chỉ định bổ sung kẽm trong 10–14 ngày để bé mau hồi phục.</li>
<li>Không cho uống nước ngọt có ga, nước ép đóng hộp, thuốc cầm tiêu chảy khi chưa có chỉ định.</li>
</ul>
<div class="callout danger"><p><b>Đưa bé đi khám ngay nếu:</b> bé li bì, khó đánh thức; bỏ bú, không uống được hoặc nôn tất cả mọi thứ; co giật; thở nhanh, khó thở; mắt trũng, khóc không có nước mắt, ít tiểu; phân có máu; sốt cao không hạ hoặc kéo dài trên 2 ngày; nổi ban, chấm xuất huyết.</p></div>
<div class="callout success"><p><b>Phòng bệnh:</b> rửa tay bằng xà phòng trước khi chuẩn bị đồ ăn và sau khi thay tã, dùng nước sạch, cho bé uống vắc xin Rota và tiêm chủng đầy đủ.</p></div>`,
});
add({
  slug: 'me-di-lam-duy-tri-sua-me', category: 'maternal-care', age_group: '6-12', featured: 0,
  title: 'Mẹ đi làm lại: cách duy trì nguồn sữa và trữ sữa an toàn',
  summary: 'Chuẩn bị trước khi đi làm, vắt sữa ở cơ quan và bảo quản sữa mẹ đúng cách.',
  source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting/food-nutrition',
  content: `
<p>WHO khuyến nghị tiếp tục cho bé bú mẹ đến 2 tuổi hoặc lâu hơn. Đi làm lại không có nghĩa phải ngừng cho con bú – chỉ cần chuẩn bị trước.</p>
<h2>Trước khi đi làm 2–3 tuần</h2>
<ul>
<li>Tập vắt sữa bằng tay hoặc máy hút sữa và trữ dần một ít sữa.</li>
<li>Cho bé tập uống sữa mẹ bằng cốc, thìa hoặc bình do người khác cho bú.</li>
<li>Trao đổi với nơi làm việc về thời gian và chỗ vắt sữa.</li>
</ul>
<h2>Ở cơ quan</h2>
<ul>
<li>Vắt sữa khoảng mỗi 3 giờ để duy trì nguồn sữa.</li>
<li>Rửa tay sạch, dùng bình chứa đã tiệt trùng, ghi ngày giờ vắt trên mỗi bình.</li>
</ul>
<h2>Bảo quản sữa mẹ (tham khảo)</h2>
<ul>
<li>Nhiệt độ phòng: dùng trong khoảng 4 giờ.</li>
<li>Ngăn mát tủ lạnh: khoảng 4 ngày.</li>
<li>Ngăn đông: tốt nhất trong khoảng 6 tháng.</li>
<li>Rã đông trong ngăn mát hoặc ngâm bình vào nước ấm; không hâm bằng lò vi sóng; sữa đã rã đông không cấp đông lại.</li>
</ul>
<div class="callout success"><p><b>Mẹo:</b> Cho bé bú trực tiếp trước khi đi làm, ngay khi về nhà và vào ban đêm giúp duy trì nguồn sữa tốt hơn.</p></div>`,
});

// ======================= 12–24 THÁNG =======================
add({
  slug: 'dinh-duong-tre-12-24-thang', category: 'nutrition', age_group: '12-24', featured: 1,
  title: 'Dinh dưỡng cho bé 12–24 tháng: ăn cùng gia đình, đủ nhóm chất',
  summary: 'Bé 1–2 tuổi cần mấy bữa mỗi ngày, ăn bao nhiêu và nên uống sữa gì?',
  source_name: 'WHO', source_url: 'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
  content: `
<p>Từ 1 tuổi, bé có thể ăn hầu hết các món của gia đình, chỉ cần cắt nhỏ, nấu mềm và nêm nhạt. Đây là giai đoạn hình thành thói quen ăn uống cho cả đời.</p>
<h2>Bé cần ăn bao nhiêu?</h2>
<ul>
<li><b>3–4 bữa chính</b> mỗi ngày và <b>1–2 bữa phụ</b> (trái cây, sữa chua, bánh mềm).</li>
<li>Mỗi bữa khoảng <b>¾ đến 1 chén</b> (chén 250ml), tùy nhu cầu của bé.</li>
<li>Tiếp tục cho bú mẹ đến 2 tuổi hoặc lâu hơn nếu mẹ và bé mong muốn.</li>
</ul>
<h2>Đa dạng thực phẩm mỗi ngày</h2>
<p>WHO khuyến nghị bữa ăn của trẻ có ít nhất <b>5 trong 8 nhóm thực phẩm</b> mỗi ngày:</p>
<ol>
<li>Sữa mẹ</li><li>Ngũ cốc, khoai củ</li><li>Các loại đậu, hạt (nghiền, xay)</li><li>Sữa và chế phẩm từ sữa</li>
<li>Thịt, cá, gan, hải sản</li><li>Trứng</li><li>Rau, củ, quả giàu vitamin A (màu xanh đậm, vàng cam)</li><li>Rau, trái cây khác</li>
</ol>
<h2>Sữa và đồ uống</h2>
<ul>
<li>Từ 12 tháng, bé có thể uống sữa tươi thanh trùng không đường như một phần của bữa phụ, không thay thế bữa ăn.</li>
<li>Nước lọc là đồ uống tốt nhất. Hạn chế nước ép, tránh nước ngọt, trà sữa, nước tăng lực.</li>
</ul>
<div class="callout warning"><p><b>Phòng hóc:</b> Cắt nhỏ nho, cà chua bi theo chiều dọc; không cho bé ăn hạt nguyên, kẹo cứng, thạch viên; luôn cho bé ngồi ăn, không vừa chạy vừa ăn.</p></div>`,
});
add({
  slug: 'be-bieng-an-1-2-tuoi', category: 'nutrition', age_group: '12-24', featured: 0,
  title: 'Bé 1–2 tuổi biếng ăn: ba mẹ nên làm gì?',
  summary: 'Vì sao bé bỗng ăn ít đi và cách tạo bữa ăn vui vẻ, không ép buộc.',
  source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting/food-nutrition',
  content: `
<p>Sau 1 tuổi, tốc độ tăng cân chậm lại nên nhiều bé ăn ít hơn và kén chọn hơn. Nếu bé vẫn chơi vui, tăng cân đều theo biểu đồ thì phần lớn là bình thường.</p>
<h2>Nguyên tắc “cho ăn đáp ứng”</h2>
<ul>
<li>Ba mẹ quyết định <b>ăn gì, khi nào, ở đâu</b>; bé quyết định <b>ăn bao nhiêu</b>.</li>
<li>Quan sát dấu hiệu no của bé (quay mặt, ngậm miệng, đẩy thìa) và dừng lại, không ép thêm.</li>
<li>Cho bé tự xúc, tự cầm thức ăn dù có hơi bừa bộn – bé sẽ hứng thú hơn.</li>
</ul>
<h2>Tạo thói quen tốt</h2>
<ul>
<li>Ăn đúng giờ, mỗi bữa khoảng 20–30 phút; quá giờ thì cất đi, chờ bữa sau.</li>
<li><b>Tắt tivi, điện thoại</b> trong bữa ăn; cả nhà cùng ngồi ăn với bé.</li>
<li>Hạn chế bánh kẹo, sữa, nước ngọt sát bữa ăn.</li>
<li>Giới thiệu món mới cùng món bé đã quen; có thể cần 8–15 lần nếm bé mới chấp nhận.</li>
<li>Khen khi bé ăn, không dùng đồ ăn để thưởng hoặc phạt.</li>
</ul>
<div class="callout warning"><p><b>Đưa bé đi khám nếu:</b> bé sụt cân hoặc đứng cân nhiều tháng; mệt mỏi, xanh xao; nôn, tiêu chảy kéo dài; hoặc biếng ăn kèm sốt, quấy khóc bất thường.</p></div>`,
});
add({
  slug: 'cot-moc-phat-trien-12-24-thang', category: 'baby-care', age_group: '12-24', featured: 0,
  title: 'Các mốc phát triển của bé 12–24 tháng: tập đi, tập nói, khám phá',
  summary: 'Bé 1 tuổi, 18 tháng, 2 tuổi thường làm được gì và dấu hiệu nào cần trao đổi với bác sĩ.',
  source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting/child-development',
  content: `
<p>Năm thứ hai là giai đoạn bé thay đổi rất nhanh: từ những bước đi chập chững đến chạy nhảy, từ vài từ đơn đến những câu ngắn đầu tiên.</p>
<h2>Khoảng 12 tháng</h2>
<ul><li>Vịn đứng, đi men theo đồ vật, có thể tự đi vài bước.</li><li>Nói 1–2 từ có nghĩa như “ba”, “mẹ”; vẫy tay chào.</li><li>Nhặt đồ vật nhỏ bằng ngón cái và ngón trỏ.</li></ul>
<h2>Khoảng 18 tháng</h2>
<ul><li>Tự đi vững, bắt đầu leo trèo.</li><li>Nói được vài từ, chỉ tay vào thứ mình muốn hoặc thích.</li><li>Tập cầm thìa, uống bằng cốc; bắt chước việc người lớn làm.</li></ul>
<h2>Khoảng 24 tháng</h2>
<ul><li>Chạy, đá bóng, lên xuống bậc thang có vịn.</li><li>Ghép 2 từ thành câu ngắn: “mẹ bế”, “uống nước”.</li><li>Chỉ được các bộ phận cơ thể, chơi giả vờ (cho búp bê ăn…).</li></ul>
<h2>Giúp bé phát triển</h2>
<ul>
<li>Cho bé vận động ít nhất 3 giờ mỗi ngày qua vui chơi; hạn chế ngồi xe đẩy, ghế ăn lâu quá 1 giờ liền.</li>
<li>WHO khuyến nghị trẻ 1 tuổi không xem màn hình thụ động; trẻ 2 tuổi không quá 1 giờ mỗi ngày, càng ít càng tốt.</li>
<li>Đọc sách, hát, trò chuyện và để bé tự làm những việc nhỏ.</li>
</ul>
<div class="callout warning"><p><b>Trao đổi với bác sĩ nếu:</b> 18 tháng bé chưa tự đi, không chỉ tay, không nói từ nào hoặc không hiểu câu đơn giản; 24 tháng chưa ghép được 2 từ, không bắt chước hành động; hoặc bất kỳ lúc nào bé mất đi kỹ năng đã có.</p></div>`,
});
add({
  slug: 'tiem-chung-9-den-24-thang', category: 'vaccination', age_group: '12-24', featured: 0,
  title: 'Tiêm chủng từ 9 đến 24 tháng: những mũi tiêm bé cần',
  summary: 'Mũi sởi 9 tháng, viêm não Nhật Bản từ 12 tháng và các mũi nhắc lúc 18 tháng.',
  source_name: 'Bộ Y tế – Chương trình Tiêm chủng mở rộng', source_url: 'https://tiemchungmorong.vn',
  content: `
<p>Sau giai đoạn 0–6 tháng, bé vẫn còn nhiều mũi tiêm và mũi nhắc quan trọng. Lịch dưới đây tham khảo theo Chương trình Tiêm chủng mở rộng; ba mẹ nên theo dõi <b>sổ tiêm chủng</b> và lịch hẹn của trạm y tế vì lịch có thể được điều chỉnh theo từng năm.</p>
<h2>Trong Chương trình Tiêm chủng mở rộng (miễn phí)</h2>
<ul>
<li><b>9 tháng:</b> vắc xin sởi.</li>
<li><b>Từ 12 tháng:</b> viêm não Nhật Bản – mũi 1, mũi 2 cách mũi 1 khoảng 1–2 tuần, mũi 3 khoảng 1 năm sau mũi 2.</li>
<li><b>18 tháng:</b> tiêm nhắc bạch hầu – ho gà – uốn ván (DPT) và vắc xin sởi – rubella (MR).</li>
</ul>
<h2>Vắc xin dịch vụ (tham khảo bác sĩ)</h2>
<p>Một số vắc xin không nằm trong chương trình miễn phí nhưng được khuyến cáo như thủy đậu, cúm (tiêm hằng năm từ 6 tháng), viêm gan A, phế cầu, não mô cầu… Ba mẹ hãy hỏi bác sĩ để có lịch phù hợp với bé.</p>
<h2>Trước và sau khi tiêm</h2>
<ul>
<li>Mang theo sổ tiêm chủng, báo cho nhân viên y tế nếu bé đang ốm, sốt hoặc từng phản ứng với lần tiêm trước.</li>
<li>Ở lại điểm tiêm <b>30 phút</b> để được theo dõi, sau đó tiếp tục theo dõi bé tại nhà 24–48 giờ.</li>
<li>Bé có thể sốt nhẹ, quấy khóc, sưng đau chỗ tiêm – cho bé bú, uống nhiều hơn; không chườm, bôi gì lên chỗ tiêm.</li>
</ul>
<div class="callout danger"><p><b>Đưa bé đến cơ sở y tế ngay nếu sau tiêm:</b> sốt cao trên 39°C, co giật, khó thở, tím tái, nổi mẩn toàn thân, li bì hoặc khóc thét kéo dài không dỗ được.</p></div>
<div class="callout success"><p><b>Mẹo:</b> Thêm lịch tiêm vào mục <b>Nhắc lịch sức khỏe</b> ở trang Hành trình để cả bố và mẹ cùng nhận thông báo.</p></div>`,
});
add({
  slug: 'phong-tai-nan-tre-1-2-tuoi', category: 'baby-care', age_group: '12-24', featured: 0,
  title: 'Phòng tai nạn cho trẻ 1–2 tuổi: đuối nước, bỏng, ngã, hóc dị vật',
  summary: 'Bé biết đi là bé khám phá khắp nơi – những biện pháp an toàn ba mẹ cần làm ngay.',
  source_name: 'WHO', source_url: 'https://www.who.int/news-room/fact-sheets/detail/drowning',
  content: `
<p>Trẻ 1–2 tuổi tò mò, nhanh nhẹn nhưng chưa nhận biết được nguy hiểm. Phần lớn tai nạn xảy ra ngay trong và quanh nhà – và đều có thể phòng tránh.</p>
<h2>Đuối nước – nguy hiểm hàng đầu</h2>
<ul>
<li>Luôn có người lớn trông trẻ <b>trong tầm tay</b> khi ở gần nước: chậu tắm, xô, bể, ao, mương.</li>
<li>Đậy kín bể, chum, vại; rào chắn ao, hồ, giếng gần nhà.</li>
<li>Không giao bé cho trẻ lớn hơn trông khi ở gần nước.</li>
</ul>
<h2>Bỏng</h2>
<ul>
<li>Không cho bé vào bếp khi đang nấu; quay cán chảo, nồi vào trong.</li>
<li>Để phích, ấm siêu tốc, bàn là xa tầm với; thử nước tắm trước khi cho bé vào.</li>
<li>Khi bị bỏng: xả nước mát sạch lên vết bỏng 15–20 phút, không bôi kem đánh răng, mỡ, nước mắm; đưa đi khám nếu vết bỏng rộng, sâu hoặc ở mặt, tay, bộ phận sinh dục.</li>
</ul>
<h2>Ngã, ngộ độc, hóc dị vật</h2>
<ul>
<li>Lắp chắn cầu thang, song cửa sổ, ban công; không kê ghế, bàn gần cửa sổ.</li>
<li>Cất thuốc, hóa chất, mỹ phẩm, pin cúc áo trong tủ có khóa.</li>
<li>Cắt nhỏ thức ăn, không cho bé chơi đồ chơi có chi tiết nhỏ, bóng bay chưa thổi.</li>
<li>Ba mẹ nên học sơ cứu hóc dị vật và hồi sức cơ bản cho trẻ nhỏ.</li>
</ul>
<h2>An toàn khi đi đường</h2>
<p>Đội mũ bảo hiểm dành cho trẻ em khi bé ngồi xe máy; dùng ghế ngồi ô tô phù hợp lứa tuổi; luôn nắm tay bé khi ở gần đường.</p>
<div class="callout danger"><p>Khi bé bị đuối nước, ngộ độc, bỏng nặng, khó thở hoặc bất tỉnh: gọi <b>115</b> và đưa bé đến cơ sở y tế gần nhất ngay.</p></div>`,
});
add({
  slug: 'giac-ngu-ne-nep-tre-1-2-tuoi', category: 'baby-care', age_group: '12-24', featured: 0,
  title: 'Giấc ngủ và nề nếp sinh hoạt của bé 1–2 tuổi',
  summary: 'Bé cần ngủ bao nhiêu, cách xây dựng thói quen đi ngủ và xử trí khi bé thức đêm.',
  source_name: 'WHO', source_url: 'https://www.who.int/publications/i/item/9789241550536',
  content: `
<p>Theo WHO, trẻ 1–2 tuổi cần <b>11–14 giờ ngủ</b> chất lượng mỗi ngày, kể cả giấc ngủ trưa. Ngủ đủ giúp bé lớn lên, học tốt và ít quấy khóc hơn.</p>
<h2>Nhịp sinh hoạt gợi ý</h2>
<ul>
<li>Thức dậy, ăn, chơi, ngủ trưa và đi ngủ buổi tối vào giờ tương đối cố định mỗi ngày.</li>
<li>Phần lớn trẻ chuyển dần từ 2 giấc ngày xuống 1 giấc trưa trong khoảng 12–18 tháng.</li>
<li>Cho bé vận động, chơi ngoài trời vào ban ngày giúp bé ngủ ngon hơn.</li>
</ul>
<h2>“Nghi thức” trước giờ ngủ</h2>
<ol>
<li>Tắm hoặc lau người, thay đồ ngủ.</li>
<li>Đánh răng.</li>
<li>Đọc 1–2 cuốn sách, hát ru, ôm ấp.</li>
<li>Tắt đèn, nói chúc ngủ ngon và để bé tự chìm vào giấc ngủ trong cũi/giường.</li>
</ol>
<ul>
<li>Tắt tivi, điện thoại ít nhất 1 giờ trước khi ngủ; không để màn hình trong phòng ngủ của bé.</li>
<li>Khi bé thức đêm: dỗ nhẹ nhàng, giữ phòng tối và yên tĩnh, tránh bật đèn sáng hay cho chơi.</li>
</ul>
<div class="callout warning"><p><b>Hỏi ý kiến bác sĩ nếu:</b> bé ngáy to thường xuyên, ngừng thở khi ngủ, thở bằng miệng; hoặc thức dậy nhiều lần mỗi đêm kéo dài khiến bé mệt mỏi ban ngày.</p></div>`,
});
add({
  slug: 'con-an-va-ky-luat-tich-cuc', category: 'baby-care', age_group: '12-24', featured: 0,
  title: 'Khi bé ăn vạ: kỷ luật tích cực cho trẻ 1–2 tuổi',
  summary: 'Vì sao bé hay khóc lóc, ăn vạ và cách giúp bé bình tĩnh mà không cần quát mắng.',
  source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting',
  content: `
<p>Ăn vạ là một phần bình thường của sự phát triển. Ở tuổi này, bé đã có mong muốn riêng nhưng chưa biết dùng lời nói để diễn đạt và chưa tự điều chỉnh được cảm xúc.</p>
<h2>Khi cơn ăn vạ xảy ra</h2>
<ul>
<li><b>Giữ bình tĩnh</b> – bé học cách kiểm soát cảm xúc từ chính ba mẹ.</li>
<li>Đảm bảo an toàn: đưa bé ra khỏi chỗ nguy hiểm, cất vật dễ vỡ.</li>
<li>Gọi tên cảm xúc của bé: “Con đang rất buồn vì phải tắt tivi”.</li>
<li>Ở gần bé, chờ bé dịu lại rồi ôm, vỗ về; không nhượng bộ chỉ vì bé khóc to.</li>
</ul>
<h2>Phòng ngừa từ trước</h2>
<ul>
<li>Giữ giờ ăn, giờ ngủ đều đặn – bé đói và mệt dễ ăn vạ hơn.</li>
<li>Báo trước khi chuyển hoạt động: “Chơi thêm 2 phút nữa rồi mình đi tắm nhé”.</li>
<li>Cho bé lựa chọn đơn giản: “Con muốn mặc áo xanh hay áo vàng?”.</li>
<li>Đặt ít quy tắc, rõ ràng và cả nhà cùng thống nhất.</li>
<li>Khen ngợi cụ thể khi bé làm tốt: “Con tự cất đồ chơi, giỏi quá!”.</li>
</ul>
<div class="callout warning"><p><b>Không nên:</b> đánh, quát nạt, dọa nạt hay làm bé xấu hổ. Những cách này có thể khiến bé sợ hãi, hung hăng hơn và ảnh hưởng lâu dài đến sự phát triển. UNICEF khuyến khích thay bằng kỷ luật tích cực.</p></div>`,
});
add({
  slug: 'ba-me-cung-cham-con', category: 'maternal-care', age_group: '12-24', featured: 0,
  title: 'Bố mẹ cùng chăm con: chia sẻ việc nhà và giữ gìn sức khỏe tinh thần',
  summary: 'Khi cả hai cùng tham gia, con phát triển tốt hơn và cha mẹ cũng bớt căng thẳng.',
  source_name: 'UNICEF', source_url: 'https://www.unicef.org/parenting',
  content: `
<p>Nghiên cứu cho thấy khi bố tham gia chăm sóc con từ sớm, trẻ phát triển tốt hơn về ngôn ngữ, cảm xúc và mẹ cũng ít bị kiệt sức hơn. Chăm con là việc của <b>cả hai người</b>.</p>
<h2>Chia việc rõ ràng</h2>
<ul>
<li>Cùng liệt kê các việc hằng ngày: cho ăn, tắm, đưa đón, giặt giũ, nấu nướng, ru ngủ.</li>
<li>Phân công theo thế mạnh và thời gian của mỗi người, đổi ca vào cuối tuần.</li>
<li>Dùng lịch chung của gia đình để ghi lịch tiêm, khám, việc cần làm – không ai phải “nhớ hết”.</li>
</ul>
<h2>Dành thời gian cho con và cho nhau</h2>
<ul>
<li>Mỗi người có “giờ riêng” với con: đọc sách, tắm, đi dạo.</li>
<li>Mỗi người cũng cần thời gian nghỉ ngơi cho bản thân – thay nhau trông con để người kia được nghỉ.</li>
<li>Trò chuyện với nhau mỗi ngày về con và về cảm xúc của chính mình.</li>
</ul>
<h2>Dấu hiệu cha mẹ đang quá tải</h2>
<ul>
<li>Thường xuyên cáu gắt, mệt mỏi, mất ngủ, không còn hứng thú với việc gì.</li>
<li>Dễ nổi nóng với con, cảm thấy bất lực hoặc tội lỗi.</li>
</ul>
<div class="callout success"><p><b>Hãy tìm hỗ trợ:</b> nhờ ông bà, người thân giúp một phần; tham gia nhóm cha mẹ; nói chuyện với bác sĩ hoặc chuyên gia tâm lý nếu căng thẳng kéo dài. Chăm sóc bản thân cũng là chăm sóc con.</p></div>`,
});

// ======================= LỘ TRÌNH ĐỌC =======================
// after: chèn ngay sau bài này trong lộ trình; null = đặt lên đầu; bỏ trống = thêm vào cuối.
const PATH_PLAN = [
  { slug: 'chuan-bi-don-be', items: [
    { slug: 'kham-thai-dinh-ky', after: 'dinh-duong-thai-ky' },
    { slug: 'song-khoe-khi-mang-thai', after: 'kham-thai-dinh-ky' },
    { slug: 'chuan-bi-di-sinh-dau-hieu-chuyen-da', after: 'song-khoe-khi-mang-thai' },
    { slug: 'cham-soc-be-ngay-sau-sinh', after: 'chuan-bi-di-sinh-dau-hieu-chuyen-da' }] },
  { slug: 'tuan-dau-doi-cua-be', items: [
    { slug: 'cham-soc-be-ngay-sau-sinh', after: null },
    { slug: 'vang-da-so-sinh', after: 'dau-hieu-nguy-hiem-tre-so-sinh' },
    { slug: 'tam-va-ve-sinh-cho-tre-so-sinh', after: 'cham-soc-ron-tre-so-sinh' },
    { slug: 'giac-ngu-an-toan-tre-so-sinh', after: 'giu-am-cho-tre-so-sinh' }] },
  { slug: 'nuoi-con-bang-sua-me', items: [
    { slug: 'cam-xuc-cua-me-sau-sinh' }, { slug: 'me-di-lam-duy-tri-sua-me' }] },
  { slug: 'be-1-6-thang', title: 'Bé 1–6 tháng: lớn lên mỗi ngày', icon: 'baby', age: '0-6',
    desc: 'Theo dõi mốc phát triển, giấc ngủ an toàn, tiêm chủng và chăm sóc cảm xúc của mẹ.',
    items: [{ slug: 'cot-moc-phat-trien-0-6-thang' }, { slug: 'giac-ngu-an-toan-tre-so-sinh' }, { slug: 'cam-xuc-cua-me-sau-sinh' }] },
  { slug: 'bat-dau-an-dam', items: [{ slug: 'thuc-don-an-dam-theo-thang', after: 'huong-dan-an-dam-dung-cach' }] },
  { slug: 'be-6-12-thang-khoe-manh', title: 'Bé 6–12 tháng khỏe mạnh, an toàn', icon: 'sprout', age: '6-12',
    desc: 'Mọc răng, an toàn khi bé tập bò, xử trí sốt – tiêu chảy và duy trì sữa mẹ khi mẹ đi làm.',
    items: [{ slug: 'moc-rang-va-cham-soc-rang-mieng' }, { slug: 'phong-tai-nan-khi-be-tap-bo' }, { slug: 'xu-tri-sot-tieu-chay-tai-nha' }, { slug: 'me-di-lam-duy-tri-sua-me' }] },
  { slug: 'be-tap-noi', items: [{ slug: 'cot-moc-phat-trien-12-24-thang', after: null }] },
  { slug: 'be-1-2-tuoi', title: 'Bé 1–2 tuổi: ăn ngoan, ngủ ngon, an toàn', icon: 'foot', age: '12-24',
    desc: 'Dinh dưỡng, biếng ăn, giấc ngủ, ăn vạ, phòng tai nạn và các mũi tiêm từ 9 đến 24 tháng.',
    items: [{ slug: 'dinh-duong-tre-12-24-thang' }, { slug: 'be-bieng-an-1-2-tuoi' }, { slug: 'tiem-chung-9-den-24-thang' }, { slug: 'giac-ngu-ne-nep-tre-1-2-tuoi' },
      { slug: 'con-an-va-ky-luat-tich-cuc' }, { slug: 'phong-tai-nan-tre-1-2-tuoi' }, { slug: 'ba-me-cung-cham-con' }] },
];

// ======================= GAME QUIZ MỚI =======================
const QUIZZES = [
  { title: 'Thử thách: Mang thai và những ngày đầu đời', trigger: 'kham-thai-dinh-ky', time: 45, points: 10,
    description: 'Khám thai, dấu hiệu chuyển dạ, da kề da, giấc ngủ an toàn và vàng da sơ sinh.',
    questions: [
      ['WHO khuyến nghị mẹ bầu có ít nhất bao nhiêu lần tiếp xúc với nhân viên y tế trong thai kỳ?', ['4 lần', '6 lần', '8 lần', '12 lần'], 2, 'WHO khuyến nghị tối thiểu 8 lần tiếp xúc, lần đầu trước tuần 12.', 'WHO', 'maternal-care'],
      ['Dấu hiệu nào khi mang thai cần đến cơ sở y tế NGAY?', ['Thèm ăn chua', 'Ra máu âm đạo, nhìn mờ, thai máy giảm', 'Hơi mỏi lưng', 'Ngủ nhiều hơn'], 1, 'Ra máu, nhức đầu nhìn mờ, phù, co giật, ra nước ối, thai máy giảm là dấu hiệu nguy hiểm.', 'WHO', 'maternal-care'],
      ['Ngay sau sinh, bé khỏe nên được đặt ở đâu?', ['Nằm riêng trong nôi', 'Da kề da trên ngực mẹ', 'Tắm ngay cho sạch', 'Quấn chặt nhiều lớp'], 1, 'Da kề da giúp bé ấm, ổn định nhịp thở và bú mẹ sớm trong giờ đầu.', 'WHO, Bộ Y tế', 'baby-care'],
      ['Tư thế ngủ an toàn cho bé dưới 1 tuổi là?', ['Nằm sấp', 'Nằm nghiêng có gối chặn', 'Nằm ngửa trên mặt phẳng chắc chắn', 'Nằm trên sofa cùng bố mẹ'], 2, 'Luôn đặt bé nằm ngửa, chỗ ngủ trống, không gối, chăn dày hay thú bông.', 'WHO', 'baby-care'],
      ['Vàng da sơ sinh nào cần đưa bé đi khám ngay?', ['Xuất hiện ngày thứ 3, nhẹ ở mặt', 'Xuất hiện trong 24 giờ đầu hoặc lan xuống lòng bàn tay, bàn chân', 'Bé vẫn bú tốt, vàng nhạt ở trán', 'Hết sau 1 tuần'], 1, 'Vàng da sớm trong 24 giờ đầu, lan rộng, kéo dài hoặc kèm bú kém, li bì là vàng da nguy hiểm.', 'WHO', 'vaccination'],
      ['Cách xử trí vàng da sơ sinh nào KHÔNG nên làm?', ['Cho bé bú mẹ thường xuyên', 'Đưa bé đi khám khi vàng lan rộng', 'Tự phơi nắng để chữa vàng da', 'Quan sát da bé dưới ánh sáng tự nhiên'], 2, 'Phơi nắng không đủ hiệu quả, dễ làm bé lạnh, bỏng nắng và làm chậm việc điều trị.', 'Bộ Y tế', 'vaccination'],
    ] },
  { title: 'Thử thách: Bé từ 6 đến 24 tháng', trigger: 'dinh-duong-tre-12-24-thang', time: 45, points: 10,
    description: 'Ăn dặm, mọc răng, sốt – tiêu chảy, tiêm chủng, giấc ngủ và phòng tai nạn cho bé 6–24 tháng.',
    questions: [
      ['Bé 9–11 tháng nên ăn khoảng bao nhiêu bữa chính mỗi ngày?', ['1 bữa', '2 bữa', '3–4 bữa', '6–7 bữa'], 2, 'WHO khuyến nghị 3–4 bữa chính, thêm 1–2 bữa phụ cho trẻ 9–23 tháng.', 'WHO', 'nutrition'],
      ['Khi bé mọc chiếc răng đầu tiên, ba mẹ nên?', ['Chờ đủ răng mới đánh răng', 'Chải răng 2 lần/ngày với lượng kem có fluor cỡ hạt gạo', 'Chỉ lau bằng nước muối', 'Cho bé ngậm bình sữa khi ngủ'], 1, 'Chải răng từ chiếc răng đầu tiên, 2 lần mỗi ngày, kem đánh răng có fluor cỡ hạt gạo.', 'UNICEF', 'baby-care'],
      ['Khi bé bị tiêu chảy, cách bù nước đúng là?', ['Cho uống nước ngọt có ga', 'Pha oresol đúng hướng dẫn, cho uống từng thìa nhỏ', 'Ngừng cho bé bú', 'Pha oresol đặc hơn cho nhanh khỏi'], 1, 'Oresol pha đúng hướng dẫn, tiếp tục cho bú và ăn; bác sĩ có thể chỉ định thêm kẽm.', 'WHO', 'vaccination'],
      ['Theo Chương trình Tiêm chủng mở rộng, lúc 18 tháng bé được tiêm nhắc vắc xin nào?', ['Lao (BCG)', 'Viêm gan B sơ sinh', 'DPT và sởi – rubella', 'Rota'], 2, 'Lúc 18 tháng bé được tiêm nhắc bạch hầu – ho gà – uốn ván và sởi – rubella.', 'Bộ Y tế', 'vaccination'],
      ['Trẻ 1–2 tuổi cần ngủ khoảng bao nhiêu giờ mỗi ngày (kể cả ngủ trưa)?', ['6–8 giờ', '8–10 giờ', '11–14 giờ', '16–18 giờ'], 2, 'WHO khuyến nghị trẻ 1–2 tuổi ngủ 11–14 giờ chất lượng mỗi ngày.', 'WHO', 'baby-care'],
      ['Biện pháp quan trọng nhất phòng đuối nước cho trẻ nhỏ là?', ['Cho bé học bơi từ 1 tuổi', 'Luôn có người lớn trông trong tầm tay khi ở gần nước, đậy kín chum vại', 'Để anh chị lớn hơn trông', 'Chỉ cần dặn bé không lại gần'], 1, 'Trẻ có thể đuối nước trong vài phân nước – luôn giám sát sát sao và che chắn nguồn nước.', 'WHO', 'baby-care'],
      ['Khi bé 1–2 tuổi ăn vạ, ba mẹ nên?', ['Quát to để bé dừng lại', 'Giữ bình tĩnh, đảm bảo an toàn, gọi tên cảm xúc của bé', 'Mua ngay thứ bé đòi', 'Đánh nhẹ để răn đe'], 1, 'Kỷ luật tích cực: bình tĩnh, an toàn, gọi tên cảm xúc và thống nhất quy tắc; không đánh, quát.', 'UNICEF', 'baby-care'],
      ['Bữa ăn của trẻ 1–2 tuổi nên có ít nhất mấy trong 8 nhóm thực phẩm mỗi ngày?', ['2 nhóm', '3 nhóm', '5 nhóm', '8 nhóm'], 2, 'WHO khuyến nghị ít nhất 5 trong 8 nhóm thực phẩm mỗi ngày để đảm bảo đa dạng.', 'WHO', 'nutrition'],
    ] },
];

const REVIEW = 'Ban biên tập BabyTogether';

async function ensureExtraContent(db) {
  const inserted = new Set();
  for (const x of A) {
    const ex = await db.get('SELECT id FROM articles WHERE slug=?', [x.slug]);
    if (ex) continue;
    await db.run(`INSERT INTO articles (slug,title,summary,content,category,age_group,source_name,source_url,reviewer,status,featured)
      VALUES (?,?,?,?,?,?,?,?,?,'published',?)`,
    [x.slug, x.title, x.summary, x.content.trim(), x.category, x.age_group, x.source_name, x.source_url, REVIEW, x.featured || 0]);
    inserted.add(x.slug);
  }
  if (!inserted.size) return;
  console.log(`[content] Đã thêm ${inserted.size} bài viết bổ sung`);

  // Gắn các bài vừa thêm vào lộ trình (chỉ bài mới thêm lần này – không động vào lộ trình admin đã chỉnh)
  for (const plan of PATH_PLAN) {
    const items = plan.items.filter((i) => inserted.has(i.slug));
    if (!items.length) continue;
    let path = await db.get('SELECT id FROM paths WHERE slug=?', [plan.slug]);
    if (!path) {
      if (!plan.title) continue; // lộ trình gốc đã bị admin xóa thì bỏ qua
      const mx = await db.get('SELECT MAX(sort_order) AS m FROM paths');
      const r = await db.run('INSERT INTO paths (slug,title,description,age_group,icon,sort_order) VALUES (?,?,?,?,?,?)',
        [plan.slug, plan.title, plan.desc, plan.age, plan.icon, (mx && mx.m != null ? Number(mx.m) : 0) + 1]);
      path = { id: r.lastId };
    }
    for (const it of items) {
      const art = await db.get('SELECT id FROM articles WHERE slug=?', [it.slug]);
      if (!art) continue;
      const dup = await db.get('SELECT 1 AS x FROM path_items WHERE path_id=? AND article_id=?', [path.id, art.id]);
      if (dup) continue;
      let pos;
      if (it.after === null) pos = 1;
      else if (it.after) {
        const ref = await db.get('SELECT i.position FROM path_items i JOIN articles a ON a.id=i.article_id WHERE i.path_id=? AND a.slug=?', [path.id, it.after]);
        if (ref) pos = Number(ref.position) + 1;
      }
      if (pos == null) {
        const mx = await db.get('SELECT MAX(position) AS m FROM path_items WHERE path_id=?', [path.id]);
        pos = (mx && mx.m != null ? Number(mx.m) : 0) + 1;
      } else {
        await db.run('UPDATE path_items SET position=position+1 WHERE path_id=? AND position>=?', [path.id, pos]);
      }
      await db.run('INSERT INTO path_items (path_id,article_id,position) VALUES (?,?,?)', [path.id, art.id, pos]);
    }
  }

  // Game quiz đi kèm (chỉ tạo cùng lần thêm bài để admin xóa thì không bị tạo lại)
  for (const q of QUIZZES) {
    if (!inserted.has(q.trigger)) continue;
    const ex = await db.get('SELECT id FROM quizzes WHERE title=?', [q.title]);
    if (ex) continue;
    const r = await db.run("INSERT INTO quizzes (title,description,time_per_question,points_per_question,status) VALUES (?,?,?,?,'published')",
      [q.title, q.description, q.time, q.points]);
    let pos = 0;
    for (const [question, options, c, e, s, cat] of q.questions) {
      await db.run('INSERT INTO quiz_questions (quiz_id,position,question,options,correct_index,explanation,source,category) VALUES (?,?,?,?,?,?,?,?)',
        [r.lastId, pos++, question, JSON.stringify(options), c, e, s, cat]);
    }
  }
  console.log('[content] Đã cập nhật lộ trình đọc và game quiz bổ sung');
}

module.exports = { ensureExtraContent, EXTRA_ARTICLES: A };
