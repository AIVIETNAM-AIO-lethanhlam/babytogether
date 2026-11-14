# BabyTogether – Website giáo dục đồng hành cùng ba mẹ

Website gồm: **Trang chủ · Thư viện kiến thức · Hành trình làm cha mẹ · Chơi & Học (Quiz + Nhiệm vụ đời thực) · Gia đình (Nhật ký) · Tài khoản gia đình · Trang quản trị viết bài**.

- Giao diện: HTML + CSS + JavaScript thuần (thư mục `public/`), theo đúng bản thiết kế BabyTogether.
- Máy chủ: Node.js thuần (`server.js`) – **không cần cài thư viện** (`npm install` không bắt buộc).
- Cơ sở dữ liệu: **Cloudflare D1** (SQLite trên Cloudflare). Mọi bài viết, tài khoản, điểm số… đều lưu trên Cloudflare.
- Triển khai: GitHub → Render (Web Service).

```
babytogether/
├── server.js            # Máy chủ web + API
├── src/
│   ├── db.js            # Kết nối Cloudflare D1 (hoặc SQLite cục bộ khi chạy thử)
│   ├── schema.sql       # Cấu trúc bảng dữ liệu
│   └── seed.js          # Dữ liệu mẫu: 11 bài viết, 10 câu quiz, 7 nhiệm vụ
├── public/              # Giao diện
│   ├── index.html, kien-thuc.html, bai-viet.html, hanh-trinh.html,
│   │   choi-hoc.html, nhiem-vu.html, gia-dinh.html, tai-khoan.html
│   ├── admin/login.html # Đăng nhập quản trị
│   ├── admin/index.html # Trang quản trị (bài viết, trình soạn thảo, quiz/game, lộ trình, nhiệm vụ, người dùng)
│   └── assets/ (css, js, img)
├── render.yaml          # Cấu hình Render (tùy chọn)
└── .env.example         # Mẫu biến môi trường
```

---

## Bước 1 – Tạo cơ sở dữ liệu trên Cloudflare D1

1. Đăng nhập https://dash.cloudflare.com (tạo tài khoản miễn phí nếu chưa có).
2. Menu bên trái: **Storage & Databases → D1 SQL Database → Create**. Đặt tên, ví dụ `babytogether`.
3. Mở database vừa tạo, sao chép **Database ID** (dạng `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
4. Lấy **Account ID**: ở trang chủ dashboard, bấm vào tài khoản → phần *Account details* / thanh bên phải có **Account ID** → sao chép.
5. Tạo **API Token**: góc phải trên → **My Profile → API Tokens → Create Token → Create Custom Token**:
   - Permissions: `Account` · `D1` · `Edit`
   - Account Resources: chọn tài khoản của bạn
   - Bấm *Continue → Create Token* và **sao chép token ngay** (chỉ hiện một lần).

> Không cần tạo bảng thủ công: lần đầu khởi động, server tự tạo bảng (theo `src/schema.sql`) và thêm dữ liệu mẫu.

## Bước 2 – Đưa code lên GitHub

```bash
cd babytogether
git init
git add .
git commit -m "BabyTogether website"
git branch -M main
git remote add origin https://github.com/<tên-bạn>/babytogether.git
git push -u origin main
```

(Hoặc dùng GitHub Desktop / kéo-thả file lên github.com.) File `.env` và thư mục `data/` đã được chặn trong `.gitignore` – **không đưa token lên GitHub**.

## Bước 3 – Tạo Web Service trên Render

1. https://dashboard.render.com → **New + → Web Service** → kết nối repo GitHub `babytogether`.
2. Cấu hình:
   - **Runtime**: Node
   - **Build Command**: `npm install` (hoặc để trống)
   - **Start Command**: `node server.js`
   - **Health Check Path**: `/api/health`
3. Mục **Environment Variables**, thêm:

| Biến | Giá trị |
|---|---|
| `NODE_ENV` | `production` |
| `CF_ACCOUNT_ID` | Account ID ở bước 1 |
| `CF_D1_DATABASE_ID` | Database ID ở bước 1 |
| `CF_API_TOKEN` | API Token ở bước 1 |
| `SESSION_SECRET` | Chuỗi ngẫu nhiên dài (≥ 32 ký tự) |
| `ADMIN_EMAIL` | Email đăng nhập trang quản trị |
| `ADMIN_PASSWORD` | Mật khẩu quản trị (đặt mạnh) |

4. Bấm **Create Web Service**. Khi log hiện `[db] Chế độ: cloudflare-d1` và `BabyTogether đang chạy…` là thành công.

> Cách khác: Render → **New + → Blueprint** → chọn repo, Render đọc `render.yaml` và chỉ hỏi các biến còn thiếu.

Mỗi lần `git push` lên nhánh `main`, Render sẽ tự triển khai lại.

## Bước 4 – Trang quản trị

- Đăng nhập tại `https://<tên-web>.onrender.com/admin/login` (chân trang có link “Dành cho quản trị viên”) bằng `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Sau khi đăng nhập, menu “Quản trị” cũng hiện trên trang người dùng.
- **Quản lý bài viết** (`/admin#articles`): thống kê, tìm kiếm, lọc theo thời gian / mục / trạng thái / lộ trình, tab Có quiz. Bấm **Chỉnh sửa** để hiện nút **Sửa / Xóa** trên mỗi bài.
- **Viết bài** (`/admin#editor`) kiểu Notion: kiểu khối, font chữ, cỡ chữ, đậm/nghiêng/gạch, màu chữ & màu nền, liên kết, danh sách, căn lề, chèn ảnh (tải lên hoặc link), video (YouTube/Vimeo/.mp4), ô lưu ý, đường kẻ, menu “/”, sửa mã HTML, tự lưu tạm trên máy. Nút **Lưu bản nháp** (người dùng không thấy) / **Đăng bài**; khi sửa bài đã đăng là **Cập nhật**. Đăng/cập nhật → trang xác nhận.
- **Tạo quiz** từ bài viết (không bắt buộc) hoặc ở mục Quiz & game: thêm câu hỏi, mỗi câu 2–6 đáp án, chọn đáp án đúng, giải thích, nguồn; thời gian & điểm mỗi câu → **Tạo game** → trang xác nhận bài viết + game.
- **Lộ trình đọc**: tạo lộ trình, sắp xếp thứ tự bài. Người dùng thấy “Bước X/Y”, “nên đọc trước”, “Bài trước / Bài tiếp theo”.
- **Nhiệm vụ** và **Người dùng** (cấp/thu hồi quyền quản trị).

## Cập nhật phiên bản mới (đã deploy trước đó)

Chỉ cần thay toàn bộ file trên GitHub bằng bản mới và để Render tự deploy lại. **Không cần làm gì trên Cloudflare**: khi khởi động, server tự tạo các bảng mới (`paths`, `path_items`, `quizzes`), tự thêm cột cho `quiz_questions`, tạo 5 lộ trình mẫu và gom các câu quiz cũ vào game “Thử thách kiến thức tổng hợp”. Dữ liệu cũ (bài viết, tài khoản, điểm) được giữ nguyên.

## Chạy thử trên máy (không bắt buộc)

Cần Node.js 22.5 trở lên.

```bash
cd babytogether
node server.js
```

Mở http://localhost:3000. Khi **không** có biến `CF_*`, server dùng SQLite cục bộ (`data/local.db`) để chạy thử, tài khoản quản trị mặc định: `admin@babytogether.local` / `admin123`. Muốn chạy thử với Cloudflare D1 thật: sao chép `.env.example` thành `.env` và điền các giá trị.

---

## Chức năng đã có (theo WEB.pdf)

| Khu vực | Chức năng |
|---|---|
| Trang chủ | Banner, Nhiệm vụ hôm nay, Kiến thức nổi bật, Cùng nhau thử thách, Cột mốc phát triển (cá nhân hóa theo tuổi bé) |
| Thư viện kiến thức | 4 danh mục, tìm kiếm, lọc theo độ tuổi, lưu bài (bookmark), tiến độ đọc (đã đọc X/Y), bài liên quan; mỗi bài hiển thị nguồn, ngày cập nhật, người thẩm định, link tài liệu gốc |
| Hành trình | Nhập ngày sinh / ngày dự sinh → tự phân giai đoạn (Mang thai, 0–6, 6–12, 12–24 tháng); gợi ý bài viết theo tuổi; cột mốc phát triển; checklist cá nhân hóa (chia sẻ trong gia đình); nhắc lịch tiêm chủng / khám |
| Chơi & Học | Quiz 5 câu, đếm giờ 45s, giải thích đáp án kèm nguồn, điểm cá nhân + điểm gia đình, bảng xếp hạng gia đình; Nhiệm vụ đời thực: nhiệm vụ mỗi ngày, đánh dấu hoàn thành, ảnh minh chứng, điểm thưởng |
| Gia đình | Tổng quan tuần, Hoạt động hằng ngày, Tiến độ bố/mẹ, Lịch chung theo tuần, 8 huy hiệu, Kỷ niệm có ảnh |
| Tài khoản | Đăng ký/đăng nhập, tạo gia đình (Family ID dạng FAM001), mời bố/mẹ bằng đường dẫn + mã mời, thông tin bé, cài đặt thông báo, lịch sử hoạt động, đổi mật khẩu |

## Lưu ý quan trọng

- **Nội dung mẫu**: 11 bài viết và 10 câu quiz mẫu được tổng hợp từ khuyến nghị chung của WHO/UNICEF/Bộ Y tế, người thẩm định ghi “Ban biên tập BabyTogether”.
- **Ảnh** (ảnh bìa, ảnh trong bài, ảnh minh chứng, kỷ niệm) được nén trên trình duyệt (~100–300KB) và lưu trực tiếp trong D1. Phù hợp quy mô nhỏ–vừa; nếu sau này nhiều ảnh, có thể chuyển sang Cloudflare R2.
- **Render gói Free** sẽ “ngủ” sau ~15 phút không có truy cập, lần mở đầu tiên sau đó mất khoảng 30–60 giây.
- Ảnh banner trang chủ là hình minh họa `public/assets/img/hero.svg`. Muốn dùng ảnh thật: thêm `hero.jpg` vào thư mục đó và sửa `hero.svg` → `hero.jpg` trong `public/assets/css/style.css` (dòng `.hero-image`).
- Email tổng kết tuần mới là tùy chọn trong cài đặt (chưa gửi email thật); nhắc lịch hiện hiển thị dạng thanh thông báo trên website.
