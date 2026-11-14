// BabyTogether - máy chủ web (Node.js thuần, không cần thư viện ngoài)
// Phục vụ giao diện tĩnh trong /public và API JSON trong /api/*.
// Dữ liệu lưu trên Cloudflare D1 (xem src/db.js và README.md).
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Đọc file .env nếu có (chạy thử trên máy)
try {
  const envFile = path.join(__dirname, '.env');
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch (_) { /* bỏ qua */ }

const db = require('./src/db');
const { seed } = require('./src/seed');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const IS_PROD = process.env.NODE_ENV === 'production';
const SESSION_SECRET = process.env.SESSION_SECRET || (IS_PROD ? '' : 'dev-secret-change-me');
if (!SESSION_SECRET) {
  console.error('Thiếu biến môi trường SESSION_SECRET. Hãy đặt một chuỗi ngẫu nhiên dài trên Render.');
  process.exit(1);
}
const SESSION_DAYS = 30;
const MAX_BODY = 8 * 1024 * 1024; // 8MB (ảnh đã được nén phía trình duyệt)

// ======================= Tiện ích =======================
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const bad = (msg) => new HttpError(400, msg);

function today() {
  // Ngày hiện tại theo giờ Việt Nam (UTC+7)
  return new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
}
// Mốc 00:00 giờ Việt Nam của một ngày, đổi sang chuỗi UTC để so sánh với cột datetime('now')
function vnDayStartUTC(dateStr) {
  return new Date(dateStr + 'T00:00:00+07:00').toISOString().slice(0, 19).replace('T', ' ');
}
function weekStart() {
  const d = new Date(Date.now() + 7 * 3600e3);
  const day = (d.getUTCDay() + 6) % 7; // Thứ 2 = 0
  d.setUTCDate(d.getUTCDate() - day);
  return vnDayStartUTC(d.toISOString().slice(0, 10));
}
function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'bai-viet';
}
function str(v, max = 500) { return v == null ? '' : String(v).trim().slice(0, max); }
function isDate(v) { return /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')); }
function isImage(v) {
  if (!v) return true;
  return /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v) || /^https?:\/\/[^\s"'<>]+$/.test(v);
}
const ALLOWED_TAGS = new Set(['p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'mark', 'span', 'font',
  'ul', 'ol', 'li', 'blockquote', 'br', 'hr', 'a', 'img', 'figure', 'figcaption', 'div', 'iframe', 'video', 'source',
  'table', 'thead', 'tbody', 'tr', 'td', 'th', 'sub', 'sup', 'code', 'pre']);
const STYLE_PROPS = new Set(['color', 'background-color', 'font-family', 'font-size', 'text-align', 'font-weight', 'font-style', 'text-decoration', 'text-decoration-line']);
const VOID = new Set(['br', 'hr', 'img', 'source']);
function cleanStyle(v) {
  return String(v).split(';').map((d) => {
    const i = d.indexOf(':'); if (i < 0) return '';
    const k = d.slice(0, i).trim().toLowerCase(); const val = d.slice(i + 1).trim();
    if (!STYLE_PROPS.has(k)) return '';
    if (!/^[#(),.%\w\s'"-]+$/.test(val) || /url\s*\(|expression|javascript/i.test(val)) return '';
    return `${k}: ${val}`;
  }).filter(Boolean).join('; ');
}
const okHref = (v) => /^(https?:\/\/|mailto:|\/|#)/i.test(v);
const okImg = (v) => /^https?:\/\/[^\s"'<>]+$/i.test(v) || /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v);
const okFrame = (v) => /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\/[\w-]+(\?[\w=&;.-]*)?$/i.test(v) || /^https:\/\/player\.vimeo\.com\/video\/\d+(\?[\w=&;.-]*)?$/i.test(v);
const okVideo = (v) => /^https?:\/\/[^\s"'<>]+$/i.test(v);
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function sanitizeHtml(input) {
  let html = String(input || '').slice(0, 1_900_000)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(script|style|noscript|textarea|select|object|embed|svg|math|template|form|button)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  return html.replace(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (m, close, tagName, rest) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (close) return VOID.has(tag) ? '' : `</${tag}>`;
    const attrs = {};
    rest.replace(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g, (_, n, __, a, b, c) => {
      attrs[n.toLowerCase()] = a != null ? a : b != null ? b : c != null ? c : '';
      return '';
    });
    const out = [];
    if (attrs.style) { const st = cleanStyle(attrs.style); if (st) out.push(`style="${esc(st)}"`); }
    if (attrs.class && /^[a-z0-9 _-]+$/i.test(attrs.class)) out.push(`class="${esc(attrs.class)}"`);
    if (tag === 'a') {
      if (attrs.href && okHref(attrs.href)) out.push(`href="${esc(attrs.href)}"`);
      if (/^https?:/i.test(attrs.href || '')) out.push('target="_blank" rel="noopener noreferrer"');
    } else if (tag === 'img') {
      if (!attrs.src || !okImg(attrs.src)) return '';
      out.push(`src="${esc(attrs.src)}"`, `alt="${esc(attrs.alt || '')}"`, 'loading="lazy"');
    } else if (tag === 'iframe') {
      if (!attrs.src || !okFrame(attrs.src)) return '';
      out.push(`src="${esc(attrs.src)}"`, 'allowfullscreen', 'loading="lazy"', 'frameborder="0"',
        'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"', `title="${esc(attrs.title || 'Video')}"`);
    } else if (tag === 'video' || tag === 'source') {
      if (attrs.src) { if (!okVideo(attrs.src)) return ''; out.push(`src="${esc(attrs.src)}"`); }
      if (tag === 'video') out.push('controls', 'preload="metadata"');
      if (tag === 'source' && attrs.type && /^video\/[a-z0-9]+$/i.test(attrs.type)) out.push(`type="${attrs.type}"`);
    } else if (tag === 'font') {
      if (attrs.color && /^#?[\w]+$/.test(attrs.color)) out.push(`color="${esc(attrs.color)}"`);
      if (attrs.face && /^[\w\s,'-]+$/.test(attrs.face)) out.push(`face="${esc(attrs.face)}"`);
    } else if (tag === 'div' && attrs['data-type'] && /^[a-z-]+$/.test(attrs['data-type'])) {
      out.push(`data-type="${attrs['data-type']}"`);
    }
    return `<${tag}${out.length ? ' ' + out.join(' ') : ''}>`;
  });
}


// Mật khẩu: scrypt
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}
function verifyPassword(pw, stored) {
  const [, salt, hash] = String(stored || '').split('$');
  if (!salt || !hash) return false;
  const h = crypto.scryptSync(pw, salt, 64);
  const s = Buffer.from(hash, 'hex');
  return s.length === h.length && crypto.timingSafeEqual(h, s);
}

// Phiên đăng nhập: token ký HMAC, lưu trong cookie HttpOnly
function sign(data) { return crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url'); }
function makeToken(uid) {
  const body = Buffer.from(JSON.stringify({ uid, exp: Date.now() + SESSION_DAYS * 864e5 })).toString('base64url');
  return `${body}.${sign(body)}`;
}
function readToken(tok) {
  if (!tok || !tok.includes('.')) return null;
  const [body, sig] = tok.split('.');
  const expect = sign(body);
  if (sig.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    return p.exp > Date.now() ? p.uid : null;
  } catch { return null; }
}
function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function sessionCookie(req, token, maxAge) {
  const secure = IS_PROD || req.headers['x-forwarded-proto'] === 'https';
  return `bt_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

// Bộ đệm người dùng ngắn hạn để giảm số lần gọi Cloudflare
const userCache = new Map();
async function loadUser(uid) {
  const c = userCache.get(uid);
  if (c && c.t > Date.now() - 15000) return c.u;
  const u = await db.get('SELECT id,email,name,role,parent_role,family_id,settings,created_at FROM users WHERE id=?', [uid]);
  userCache.set(uid, { u, t: Date.now() });
  return u;
}
const forgetUser = (uid) => userCache.delete(uid);

// Giới hạn đăng nhập sai
const loginFails = new Map();
function checkRate(key) {
  const r = loginFails.get(key);
  if (r && r.n >= 8 && r.t > Date.now() - 15 * 60e3) throw new HttpError(429, 'Bạn thử quá nhiều lần. Vui lòng đợi 15 phút.');
}
function failRate(key) {
  const r = loginFails.get(key) || { n: 0, t: Date.now() };
  if (r.t < Date.now() - 15 * 60e3) { r.n = 0; r.t = Date.now(); }
  r.n++; loginFails.set(key, r);
}

async function logAction(user, action, detail = '') {
  try {
    await db.run('INSERT INTO activity_log (family_id,user_id,action,detail) VALUES (?,?,?,?)',
      [user.family_id || null, user.id, action, str(detail, 300)]);
  } catch (e) { console.warn('log failed', e.message); }
}

// ======================= Router =======================
const routes = [];
function route(method, pattern, opts, handler) {
  if (typeof opts === 'function') { handler = opts; opts = {}; }
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
  routes.push({ method, re, keys, handler, auth: opts.auth, admin: opts.admin, family: opts.family });
}
function needFamily(user) {
  if (!user.family_id) throw new HttpError(409, 'Bạn cần tạo hoặc tham gia một gia đình trong trang Tài khoản trước.');
}

// ---------- Tài khoản ----------
route('POST', '/api/auth/register', async (ctx) => {
  const b = ctx.body;
  const email = str(b.email, 200).toLowerCase();
  const name = str(b.name, 100);
  const password = String(b.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw bad('Email không hợp lệ.');
  if (!name) throw bad('Vui lòng nhập tên.');
  if (password.length < 6) throw bad('Mật khẩu cần ít nhất 6 ký tự.');
  if (await db.get('SELECT id FROM users WHERE email=?', [email])) throw bad('Email này đã được đăng ký.');
  const parentRole = ['Bố', 'Mẹ', 'Người chăm sóc'].includes(b.parent_role) ? b.parent_role : 'Mẹ';
  const settings = JSON.stringify({ email: true, vaccine: true, mission: true });
  const r = await db.run('INSERT INTO users (email,password_hash,name,parent_role,settings) VALUES (?,?,?,?,?)',
    [email, hashPassword(password), name, parentRole, settings]);
  ctx.setCookie(sessionCookie(ctx.req, makeToken(r.lastId), SESSION_DAYS * 86400));
  await logAction({ id: r.lastId }, 'register', 'Tạo tài khoản');
  return { ok: true };
});

route('POST', '/api/auth/login', async (ctx) => {
  const email = str(ctx.body.email, 200).toLowerCase();
  const key = ctx.ip + '|' + email;
  checkRate(key);
  const u = await db.get('SELECT id,password_hash FROM users WHERE email=?', [email]);
  if (!u || !verifyPassword(String(ctx.body.password || ''), u.password_hash)) {
    failRate(key);
    throw bad('Email hoặc mật khẩu không đúng.');
  }
  loginFails.delete(key);
  ctx.setCookie(sessionCookie(ctx.req, makeToken(u.id), SESSION_DAYS * 86400));
  return { ok: true };
});

route('POST', '/api/auth/logout', async (ctx) => {
  ctx.setCookie(sessionCookie(ctx.req, '', 0));
  return { ok: true };
});

route('GET', '/api/me', async (ctx) => {
  if (!ctx.user) return { user: null };
  const u = ctx.user;
  let family = null, children = [], members = [];
  if (u.family_id) {
    family = await db.get('SELECT id,name,invite_code,created_by,created_at FROM families WHERE id=?', [u.family_id]);
    children = await db.all('SELECT * FROM children WHERE family_id=? ORDER BY id', [u.family_id]);
    members = await db.all('SELECT id,name,parent_role,email FROM users WHERE family_id=? ORDER BY id', [u.family_id]);
  }
  let settings = {};
  try { settings = JSON.parse(u.settings || '{}'); } catch { /* */ }
  return { user: { ...u, settings }, family, children, members };
});

route('PUT', '/api/me', { auth: true }, async (ctx) => {
  const b = ctx.body;
  const name = str(b.name, 100) || ctx.user.name;
  const parentRole = ['Bố', 'Mẹ', 'Người chăm sóc'].includes(b.parent_role) ? b.parent_role : ctx.user.parent_role;
  const s = b.settings || {};
  const settings = JSON.stringify({ email: !!s.email, vaccine: !!s.vaccine, mission: !!s.mission });
  await db.run('UPDATE users SET name=?,parent_role=?,settings=? WHERE id=?', [name, parentRole, settings, ctx.user.id]);
  forgetUser(ctx.user.id);
  return { ok: true };
});

route('POST', '/api/me/password', { auth: true }, async (ctx) => {
  const u = await db.get('SELECT password_hash FROM users WHERE id=?', [ctx.user.id]);
  if (!verifyPassword(String(ctx.body.current || ''), u.password_hash)) throw bad('Mật khẩu hiện tại không đúng.');
  const pw = String(ctx.body.password || '');
  if (pw.length < 6) throw bad('Mật khẩu mới cần ít nhất 6 ký tự.');
  await db.run('UPDATE users SET password_hash=? WHERE id=?', [hashPassword(pw), ctx.user.id]);
  return { ok: true };
});

// ---------- Gia đình ----------
function inviteCode() { return crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6); }

route('POST', '/api/family', { auth: true }, async (ctx) => {
  if (ctx.user.family_id) throw bad('Bạn đã ở trong một gia đình.');
  const name = str(ctx.body.name, 100) || `Gia đình ${ctx.user.name}`;
  const row = await db.get("SELECT COUNT(*) AS n FROM families");
  let n = Number(row ? row.n : 0) + 1, id;
  for (;;) {
    id = 'FAM' + String(n).padStart(3, '0');
    if (!(await db.get('SELECT id FROM families WHERE id=?', [id]))) break;
    n++;
  }
  await db.run('INSERT INTO families (id,name,invite_code,created_by) VALUES (?,?,?,?)', [id, name, inviteCode(), ctx.user.id]);
  await db.run('UPDATE users SET family_id=? WHERE id=?', [id, ctx.user.id]);
  forgetUser(ctx.user.id);
  await logAction({ ...ctx.user, family_id: id }, 'family', `Tạo gia đình ${id}`);
  return { ok: true, id };
});

route('POST', '/api/family/join', { auth: true }, async (ctx) => {
  if (ctx.user.family_id) throw bad('Bạn đã ở trong một gia đình. Hãy rời gia đình hiện tại trước.');
  const id = str(ctx.body.family_id, 20).toUpperCase();
  const code = str(ctx.body.invite_code, 20).toUpperCase();
  const f = await db.get('SELECT id,invite_code FROM families WHERE id=?', [id]);
  if (!f || f.invite_code !== code) throw bad('Family ID hoặc mã mời không đúng.');
  await db.run('UPDATE users SET family_id=? WHERE id=?', [id, ctx.user.id]);
  forgetUser(ctx.user.id);
  await logAction({ ...ctx.user, family_id: id }, 'family', `${ctx.user.name} tham gia gia đình`);
  return { ok: true, id };
});

route('POST', '/api/family/invite', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const code = inviteCode();
  await db.run('UPDATE families SET invite_code=? WHERE id=?', [code, ctx.user.family_id]);
  return { ok: true, invite_code: code };
});

route('PUT', '/api/family', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const name = str(ctx.body.name, 100);
  if (!name) throw bad('Vui lòng nhập tên gia đình.');
  await db.run('UPDATE families SET name=? WHERE id=?', [name, ctx.user.family_id]);
  return { ok: true };
});

route('POST', '/api/family/leave', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  await logAction(ctx.user, 'family', `${ctx.user.name} rời gia đình`);
  await db.run('UPDATE users SET family_id=NULL WHERE id=?', [ctx.user.id]);
  forgetUser(ctx.user.id);
  return { ok: true };
});

function childFields(b) {
  const name = str(b.name, 100);
  if (!name) throw bad('Vui lòng nhập tên (hoặc biệt danh) của bé.');
  const birth = isDate(b.birth_date) ? b.birth_date : null;
  const due = isDate(b.due_date) ? b.due_date : null;
  if (!birth && !due) throw bad('Vui lòng nhập ngày sinh của bé hoặc ngày dự sinh.');
  return [name, birth, due, str(b.gender, 20)];
}
route('POST', '/api/children', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const f = childFields(ctx.body);
  const r = await db.run('INSERT INTO children (family_id,name,birth_date,due_date,gender) VALUES (?,?,?,?,?)', [ctx.user.family_id, ...f]);
  await logAction(ctx.user, 'child', `Thêm thông tin bé ${f[0]}`);
  return { ok: true, id: r.lastId };
});
route('PUT', '/api/children/:id', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const f = childFields(ctx.body);
  await db.run('UPDATE children SET name=?,birth_date=?,due_date=?,gender=? WHERE id=? AND family_id=?', [...f, ctx.params.id, ctx.user.family_id]);
  return { ok: true };
});
route('DELETE', '/api/children/:id', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  await db.run('DELETE FROM children WHERE id=? AND family_id=?', [ctx.params.id, ctx.user.family_id]);
  return { ok: true };
});

route('GET', '/api/history', { auth: true }, async (ctx) => {
  const rows = ctx.user.family_id
    ? await db.all(`SELECT l.*, u.name AS user_name FROM activity_log l LEFT JOIN users u ON u.id=l.user_id
                    WHERE l.family_id=? ORDER BY l.id DESC LIMIT 50`, [ctx.user.family_id])
    : await db.all(`SELECT l.*, u.name AS user_name FROM activity_log l LEFT JOIN users u ON u.id=l.user_id
                    WHERE l.user_id=? ORDER BY l.id DESC LIMIT 50`, [ctx.user.id]);
  return { items: rows };
});

// ---------- Bài viết ----------
const CATEGORIES = ['baby-care', 'maternal-care', 'nutrition', 'vaccination'];
const AGES = ['pregnancy', '0-6', '6-12', '12-24', 'all'];
const LIST_COLS = 'a.id,a.slug,a.title,a.summary,a.category,a.age_group,a.cover_image,a.source_name,a.reviewer,a.featured,a.views,a.updated_at,a.created_at';

// Bản đồ: bài viết -> lộ trình đầu tiên chứa nó (để hiện nhãn "Bước 2 · Tuần đầu đời")
async function pathMap() {
  const rows = await db.all(`SELECT pi.article_id, pi.position, p.id AS path_id, p.title, p.slug, p.sort_order,
      (SELECT COUNT(*) FROM path_items x WHERE x.path_id=p.id) AS total
    FROM path_items pi JOIN paths p ON p.id=pi.path_id ORDER BY p.sort_order, pi.position`);
  const map = new Map();
  for (const r of rows) if (!map.has(r.article_id)) map.set(r.article_id, r);
  return map;
}
function stepOf(map, id) {
  const p = map.get(id);
  return p ? { path_id: p.path_id, path_title: p.title, path_slug: p.slug, position: p.position, total: Number(p.total) } : null;
}

route('GET', '/api/stats', async () => {
  const cats = await db.all("SELECT category, COUNT(*) AS n FROM articles WHERE status='published' GROUP BY category");
  const t = await db.get(`SELECT (SELECT COUNT(*) FROM articles WHERE status='published') AS articles,
    (SELECT COUNT(*) FROM families) AS families, (SELECT COUNT(*) FROM paths) AS paths`);
  const categories = {}; for (const c of cats) categories[c.category] = Number(c.n);
  return { categories, articles: Number(t.articles), families: Number(t.families), paths: Number(t.paths) };
});

route('GET', '/api/articles', async (ctx) => {
  const q = ctx.query;
  const where = ["a.status='published'"], params = [];
  if (q.q) {
    where.push('(a.title LIKE ? OR a.summary LIKE ? OR a.content LIKE ?)');
    const like = `%${str(q.q, 100)}%`; params.push(like, like, like);
  }
  if (CATEGORIES.includes(q.category)) { where.push('a.category=?'); params.push(q.category); }
  if (AGES.includes(q.age) && q.age !== 'all') { where.push("(a.age_group=? OR a.age_group='all')"); params.push(q.age); }
  if (q.featured === '1') where.push('a.featured=1');
  if (q.source) {
    const srcs = String(q.source).split(',').map((s) => str(s, 40)).filter(Boolean).slice(0, 5);
    if (srcs.length) { where.push('(' + srcs.map(() => 'a.source_name LIKE ?').join(' OR ') + ')'); srcs.forEach((s) => params.push(`%${s}%`)); }
  }
  const limit = Math.min(Number(q.limit) || 12, 50);
  const offset = Math.max(Number(q.offset) || 0, 0);
  const uid = ctx.user ? ctx.user.id : 0;
  if (q.bookmarked === '1' && uid) where.push('b.user_id IS NOT NULL');
  const rows = await db.all(`SELECT ${LIST_COLS},
      CASE WHEN b.user_id IS NULL THEN 0 ELSE 1 END AS bookmarked,
      CASE WHEN r.user_id IS NULL THEN 0 ELSE 1 END AS is_read
    FROM articles a
    LEFT JOIN bookmarks b ON b.article_id=a.id AND b.user_id=?
    LEFT JOIN article_reads r ON r.article_id=a.id AND r.user_id=?
    WHERE ${where.join(' AND ')}
    ORDER BY a.updated_at DESC LIMIT 500`, [uid, uid, ...params]);
  const map = await pathMap();
  for (const r of rows) r.step = stepOf(map, r.id);
  const sort = q.sort || 'recommended';
  if (sort === 'recommended') {
    rows.sort((x, y) => {
      const a = map.get(x.id), b = map.get(y.id);
      if (a && b) return a.sort_order - b.sort_order || a.position - b.position;
      if (a) return -1; if (b) return 1;
      return y.featured - x.featured || String(y.updated_at).localeCompare(String(x.updated_at));
    });
  } else if (sort === 'popular') rows.sort((x, y) => y.views - x.views);
  return { items: rows.slice(offset, offset + limit), total: rows.length, hasMore: rows.length > offset + limit };
});

route('GET', '/api/articles/:slug', async (ctx) => {
  const uid = ctx.user ? ctx.user.id : 0;
  const isAdmin = ctx.user && ctx.user.role === 'admin' ? 1 : 0;
  const a = await db.get(`SELECT a.*, CASE WHEN b.user_id IS NULL THEN 0 ELSE 1 END AS bookmarked,
      CASE WHEN r.user_id IS NULL THEN 0 ELSE 1 END AS is_read
    FROM articles a
    LEFT JOIN bookmarks b ON b.article_id=a.id AND b.user_id=?
    LEFT JOIN article_reads r ON r.article_id=a.id AND r.user_id=?
    WHERE a.slug=? AND (a.status='published' OR ?=1)`, [uid, uid, ctx.params.slug, isAdmin]);
  if (!a) throw new HttpError(404, 'Không tìm thấy bài viết.');
  db.run('UPDATE articles SET views=views+1 WHERE id=?', [a.id]).catch(() => {});
  const related = await db.all(`SELECT a.id,a.slug,a.title,a.summary,a.category,a.age_group,a.cover_image,a.source_name FROM articles a
    WHERE a.status='published' AND a.id<>? AND (a.category=? OR a.age_group=?)
    ORDER BY (a.category=?) DESC, a.updated_at DESC LIMIT 3`, [a.id, a.category, a.age_group, a.category]);
  // Lộ trình chứa bài viết
  let path = null;
  const pi = await db.get(`SELECT p.* FROM path_items pi JOIN paths p ON p.id=pi.path_id WHERE pi.article_id=?
    ORDER BY p.sort_order LIMIT 1`, [a.id]);
  if (pi) {
    const items = await db.all(`SELECT a.id,a.slug,a.title,pi.position,
        CASE WHEN r.user_id IS NULL THEN 0 ELSE 1 END AS is_read
      FROM path_items pi JOIN articles a ON a.id=pi.article_id
      LEFT JOIN article_reads r ON r.article_id=a.id AND r.user_id=?
      WHERE pi.path_id=? AND (a.status='published' OR ?=1) ORDER BY pi.position`, [uid, pi.id, isAdmin]);
    const idx = items.findIndex((x) => x.id === a.id);
    path = { id: pi.id, slug: pi.slug, title: pi.title, items, index: idx, total: items.length,
      prev: idx > 0 ? items[idx - 1] : null, next: idx >= 0 && idx < items.length - 1 ? items[idx + 1] : null };
  }
  const quiz = await db.get(`SELECT q.id,q.title,q.points_per_question,(SELECT COUNT(*) FROM quiz_questions x WHERE x.quiz_id=q.id AND x.active=1) AS questions
    FROM quizzes q WHERE q.article_id=? AND q.status='published' ORDER BY q.id DESC LIMIT 1`, [a.id]);
  return { article: a, related, path, quiz: quiz && Number(quiz.questions) ? quiz : null };
});

route('POST', '/api/articles/:id/bookmark', { auth: true }, async (ctx) => {
  const id = Number(ctx.params.id);
  const ex = await db.get('SELECT 1 AS x FROM bookmarks WHERE user_id=? AND article_id=?', [ctx.user.id, id]);
  if (ex) await db.run('DELETE FROM bookmarks WHERE user_id=? AND article_id=?', [ctx.user.id, id]);
  else await db.run('INSERT INTO bookmarks (user_id,article_id) VALUES (?,?)', [ctx.user.id, id]);
  return { ok: true, bookmarked: !ex };
});

route('POST', '/api/articles/:id/read', { auth: true }, async (ctx) => {
  const id = Number(ctx.params.id);
  const ex = await db.get('SELECT 1 AS x FROM article_reads WHERE user_id=? AND article_id=?', [ctx.user.id, id]);
  if (!ex) {
    await db.run('INSERT INTO article_reads (user_id,article_id,family_id) VALUES (?,?,?)', [ctx.user.id, id, ctx.user.family_id || null]);
    const a = await db.get('SELECT title FROM articles WHERE id=?', [id]);
    if (a) await logAction(ctx.user, 'read', `Đọc bài: ${a.title}`);
  }
  return { ok: true };
});

// Đồng bộ các bài đã đọc khi chưa đăng nhập (lưu trên trình duyệt) vào tài khoản
route('POST', '/api/reading/sync', { auth: true }, async (ctx) => {
  const ids = Array.isArray(ctx.body.ids) ? ctx.body.ids.map(Number).filter(Boolean).slice(0, 200) : [];
  for (const id of ids) {
    await db.run('INSERT OR IGNORE INTO article_reads (user_id,article_id,family_id) VALUES (?,?,?)', [ctx.user.id, id, ctx.user.family_id || null]);
  }
  return { ok: true };
});

route('GET', '/api/reading', { auth: true }, async (ctx) => {
  const items = await db.all(`SELECT a.id,a.slug,a.title,a.category,r.read_at FROM article_reads r JOIN articles a ON a.id=r.article_id
    WHERE r.user_id=? ORDER BY r.read_at DESC LIMIT 200`, [ctx.user.id]);
  const total = await db.get("SELECT COUNT(*) AS n FROM articles WHERE status='published'");
  const saved = await db.get('SELECT COUNT(*) AS n FROM bookmarks WHERE user_id=?', [ctx.user.id]);
  return { items, total: Number(total.n), saved: Number(saved.n) };
});

// ---------- Lộ trình đọc ----------
route('GET', '/api/paths', async (ctx) => {
  const uid = ctx.user ? ctx.user.id : 0;
  const where = [], params = [];
  if (AGES.includes(ctx.query.age) && ctx.query.age !== 'all') { where.push("(p.age_group=? OR p.age_group='all')"); params.push(ctx.query.age); }
  const paths = await db.all(`SELECT p.* FROM paths p ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY p.sort_order, p.id`, params);
  if (!paths.length) return { items: [] };
  const items = await db.all(`SELECT pi.path_id,pi.position,a.id,a.slug,a.title,
      CASE WHEN r.user_id IS NULL THEN 0 ELSE 1 END AS is_read
    FROM path_items pi JOIN articles a ON a.id=pi.article_id
    LEFT JOIN article_reads r ON r.article_id=a.id AND r.user_id=?
    WHERE a.status='published' ORDER BY pi.path_id, pi.position`, [uid]);
  return {
    items: paths.map((p) => {
      const list = items.filter((i) => i.path_id === p.id);
      return { ...p, articles: list, total: list.length, done: list.filter((i) => i.is_read).length };
    }).filter((p) => p.total > 0),
  };
});

// ---------- Quiz / Game ----------
route('GET', '/api/quizzes', async () => {
  const items = await db.all(`SELECT q.id,q.title,q.description,q.article_id,q.time_per_question,q.points_per_question,a.title AS article_title,a.slug AS article_slug,
      (SELECT COUNT(*) FROM quiz_questions x WHERE x.quiz_id=q.id AND x.active=1) AS questions
    FROM quizzes q LEFT JOIN articles a ON a.id=q.article_id WHERE q.status='published' AND (a.id IS NULL OR a.status='published') ORDER BY q.id DESC`);
  return { items: items.filter((q) => Number(q.questions) > 0) };
});

route('GET', '/api/quiz', async (ctx) => {
  if (ctx.query.quiz) {
    const quiz = await db.get("SELECT id,title,description,time_per_question,points_per_question FROM quizzes WHERE id=? AND (status='published' OR ?=1)", [Number(ctx.query.quiz), ctx.user && ctx.user.role === 'admin' ? 1 : 0]);
    if (!quiz) throw new HttpError(404, 'Không tìm thấy game.');
    const rows = await db.all('SELECT id,question,options,category FROM quiz_questions WHERE quiz_id=? AND active=1 ORDER BY position, id', [quiz.id]);
    return { quiz, questions: rows.map((r) => ({ ...r, options: JSON.parse(r.options) })) };
  }
  const n = Math.min(Math.max(Number(ctx.query.n) || 5, 1), 20);
  const where = ["x.active=1", "(q.status='published' OR x.quiz_id IS NULL)"], params = [];
  if (CATEGORIES.includes(ctx.query.category)) { where.push('x.category=?'); params.push(ctx.query.category); }
  const rows = await db.all(`SELECT x.id,x.question,x.options,x.category FROM quiz_questions x LEFT JOIN quizzes q ON q.id=x.quiz_id
    WHERE ${where.join(' AND ')} ORDER BY RANDOM() LIMIT ?`, [...params, n]);
  return { quiz: { id: null, title: 'Thử thách ngẫu nhiên', time_per_question: 45, points_per_question: 10 },
    questions: rows.map((r) => ({ ...r, options: JSON.parse(r.options) })) };
});

async function questionPoints(id) {
  const q = await db.get(`SELECT x.correct_index,x.explanation,x.source,COALESCE(q.points_per_question,10) AS points
    FROM quiz_questions x LEFT JOIN quizzes q ON q.id=x.quiz_id WHERE x.id=?`, [Number(id)]);
  return q;
}
route('POST', '/api/quiz/check', async (ctx) => {
  const q = await questionPoints(ctx.body.id);
  if (!q) throw new HttpError(404, 'Không tìm thấy câu hỏi.');
  return { correct: Number(ctx.body.answer) === q.correct_index, correct_index: q.correct_index, explanation: q.explanation, source: q.source, points: Number(q.points) };
});

route('POST', '/api/quiz/submit', { auth: true }, async (ctx) => {
  const answers = Array.isArray(ctx.body.answers) ? ctx.body.answers.slice(0, 30) : [];
  if (!answers.length) throw bad('Chưa có câu trả lời.');
  let score = 0, points = 0;
  for (const a of answers) {
    const q = await questionPoints(a.id);
    if (q && Number(a.answer) === q.correct_index) { score++; points += Number(q.points); }
  }
  await db.run('INSERT INTO quiz_attempts (user_id,family_id,score,total,points) VALUES (?,?,?,?,?)',
    [ctx.user.id, ctx.user.family_id || null, score, answers.length, points]);
  await logAction(ctx.user, 'quiz', `Hoàn thành quiz: ${score}/${answers.length} câu đúng (+${points} điểm)`);
  return { ok: true, score, total: answers.length, points };
});

route('GET', '/api/leaderboard', async (ctx) => {
  const ws = weekStart();
  const families = await db.all(`SELECT f.id, f.name,
      COALESCE((SELECT SUM(points) FROM quiz_attempts q WHERE q.family_id=f.id),0) +
      COALESCE((SELECT SUM(points) FROM mission_completions m WHERE m.family_id=f.id),0) AS points,
      (SELECT COUNT(*) FROM users u WHERE u.family_id=f.id) AS members
    FROM families f ORDER BY points DESC LIMIT 10`);
  let me = null;
  if (ctx.user) {
    const p = await db.get(`SELECT
      COALESCE((SELECT SUM(points) FROM quiz_attempts WHERE user_id=?),0) AS quiz,
      COALESCE((SELECT SUM(points) FROM mission_completions WHERE user_id=?),0) AS missions`, [ctx.user.id, ctx.user.id]);
    me = { quiz: Number(p.quiz), missions: Number(p.missions), total: Number(p.quiz) + Number(p.missions) };
    if (ctx.user.family_id) {
      me.members = await db.all(`SELECT u.id,u.name,u.parent_role,
        COALESCE((SELECT SUM(points) FROM quiz_attempts q WHERE q.user_id=u.id),0) +
        COALESCE((SELECT SUM(points) FROM mission_completions m WHERE m.user_id=u.id),0) AS points,
        COALESCE((SELECT SUM(points) FROM quiz_attempts q WHERE q.user_id=u.id AND q.created_at>=?),0) +
        COALESCE((SELECT SUM(points) FROM mission_completions m WHERE m.user_id=u.id AND m.completed_at>=?),0) AS week_points
        FROM users u WHERE u.family_id=? ORDER BY points DESC`, [ws, ws, ctx.user.family_id]);
      me.family_week = me.members.reduce((s, m) => s + Number(m.week_points), 0);
    }
  }
  return { families, me };
});
// ---------- Nhiệm vụ ----------
route('GET', '/api/missions', async (ctx) => {
  const missions = await db.all('SELECT id,title,description,participant,goal,points,image,tag FROM missions WHERE active=1 ORDER BY id');
  const t = today();
  let doneToday = [];
  if (ctx.user) {
    const key = ctx.user.family_id ? 'family_id' : 'user_id';
    const val = ctx.user.family_id || ctx.user.id;
    doneToday = await db.all(`SELECT mc.mission_id, mc.user_id, u.name AS user_name FROM mission_completions mc
      LEFT JOIN users u ON u.id=mc.user_id WHERE mc.${key}=? AND mc.completed_at>=?`, [val, vnDayStartUTC(t)]);
  }
  // Nhiệm vụ của ngày: chọn cố định theo ngày
  const dayNum = Math.floor(new Date(t).getTime() / 864e5);
  const daily = missions.length ? missions[dayNum % missions.length].id : null;
  return {
    daily_id: daily,
    items: missions.map((m) => ({ ...m, done_by: doneToday.filter((d) => d.mission_id === m.id).map((d) => d.user_name) })),
  };
});

route('POST', '/api/missions/:id/complete', { auth: true }, async (ctx) => {
  const m = await db.get('SELECT id,title,points FROM missions WHERE id=? AND active=1', [Number(ctx.params.id)]);
  if (!m) throw new HttpError(404, 'Không tìm thấy nhiệm vụ.');
  const photo = String(ctx.body.photo || '');
  if (!isImage(photo)) throw bad('Ảnh không hợp lệ.');
  const ex = await db.get('SELECT id FROM mission_completions WHERE mission_id=? AND user_id=? AND completed_at>=?',
    [m.id, ctx.user.id, vnDayStartUTC(today())]);
  if (ex) throw bad('Bạn đã hoàn thành nhiệm vụ này hôm nay rồi!');
  await db.run(`INSERT INTO mission_completions (mission_id,user_id,family_id,photo,note,points)
    VALUES (?,?,?,?,?,?)`, [m.id, ctx.user.id, ctx.user.family_id || null, photo, str(ctx.body.note, 500), m.points]);
  if (photo && ctx.user.family_id && ctx.body.save_memory) {
    await db.run('INSERT INTO memories (family_id,user_id,caption,photo,date) VALUES (?,?,?,?,?)',
      [ctx.user.family_id, ctx.user.id, m.title, photo, today()]);
  }
  await logAction(ctx.user, 'mission', `Hoàn thành nhiệm vụ: ${m.title} (+${m.points} điểm)`);
  return { ok: true, points: m.points };
});

route('GET', '/api/missions/history', { auth: true }, async (ctx) => {
  const key = ctx.user.family_id ? 'mc.family_id' : 'mc.user_id';
  const items = await db.all(`SELECT mc.id,mc.note,mc.photo,mc.points,mc.completed_at,m.title,u.name AS user_name
    FROM mission_completions mc JOIN missions m ON m.id=mc.mission_id LEFT JOIN users u ON u.id=mc.user_id
    WHERE ${key}=? ORDER BY mc.id DESC LIMIT 30`, [ctx.user.family_id || ctx.user.id]);
  return { items };
});

// ---------- Nhật ký gia đình ----------
const BADGES = [
  { key: 'first-quiz', name: 'Bài kiểm tra đầu tiên', desc: 'Hoàn thành 1 bài quiz' },
  { key: 'reading', name: 'Đọc sách cùng bé', desc: 'Hoàn thành nhiệm vụ đọc sách' },
  { key: 'five-missions', name: 'Hoàn thành 5 thử thách', desc: 'Hoàn thành 5 nhiệm vụ đời thực' },
  { key: 'postnatal', name: 'Chăm sóc sau sinh', desc: 'Tìm hiểu 2 chủ đề chăm sóc mẹ' },
  { key: 'perfect', name: 'Điểm tuyệt đối', desc: 'Trả lời đúng tất cả câu hỏi trong 1 quiz' },
  { key: 'learner', name: 'Ham học hỏi', desc: 'Đọc 10 bài viết' },
  { key: 'teamwork', name: 'Đồng đội ăn ý', desc: 'Bố và mẹ cùng tham gia gia đình' },
  { key: 'hundred', name: '100 điểm', desc: 'Gia đình đạt 100 điểm' },
];

route('GET', '/api/diary/summary', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const fid = ctx.user.family_id;
  const ws = weekStart();
  const s = await db.get(`SELECT
    (SELECT COUNT(*) FROM mission_completions WHERE family_id=? AND completed_at>=?) AS missions_week,
    (SELECT COUNT(*) FROM mission_completions mc JOIN missions m ON m.id=mc.mission_id WHERE mc.family_id=? AND m.tag='reading' AND mc.completed_at>=?) AS reading_week,
    (SELECT COUNT(*) FROM quiz_attempts WHERE family_id=? AND created_at>=?) AS quiz_week,
    (SELECT COUNT(*) FROM article_reads r JOIN articles a ON a.id=r.article_id WHERE r.family_id=? AND a.category='maternal-care' AND r.read_at>=?) AS maternal_week,
    (SELECT COUNT(*) FROM mission_completions WHERE family_id=?) AS missions_all,
    (SELECT COUNT(*) FROM mission_completions mc JOIN missions m ON m.id=mc.mission_id WHERE mc.family_id=? AND m.tag='reading') AS reading_all,
    (SELECT COUNT(*) FROM quiz_attempts WHERE family_id=?) AS quiz_all,
    (SELECT COUNT(*) FROM quiz_attempts WHERE family_id=? AND score=total) AS perfect_all,
    (SELECT COUNT(*) FROM article_reads WHERE family_id=?) AS reads_all,
    (SELECT COUNT(*) FROM article_reads r JOIN articles a ON a.id=r.article_id WHERE r.family_id=? AND a.category='maternal-care') AS maternal_all,
    (SELECT COUNT(*) FROM mission_completions mc JOIN missions m ON m.id=mc.mission_id WHERE mc.family_id=? AND m.tag='maternal') AS maternal_missions,
    (SELECT COUNT(*) FROM users WHERE family_id=?) AS members,
    COALESCE((SELECT SUM(points) FROM quiz_attempts WHERE family_id=?),0) + COALESCE((SELECT SUM(points) FROM mission_completions WHERE family_id=?),0) AS points`,
  [fid, ws, fid, ws, fid, ws, fid, ws, fid, fid, fid, fid, fid, fid, fid, fid, fid, fid]);
  const n = (k) => Number(s[k] || 0);
  const earned = {
    'first-quiz': n('quiz_all') >= 1,
    reading: n('reading_all') >= 1,
    'five-missions': n('missions_all') >= 5,
    postnatal: n('maternal_all') + n('maternal_missions') >= 2,
    perfect: n('perfect_all') >= 1,
    learner: n('reads_all') >= 10,
    teamwork: n('members') >= 2,
    hundred: n('points') >= 100,
  };
  const members = await db.all(`SELECT u.id,u.name,u.parent_role,
      (SELECT COUNT(*) FROM mission_completions mc WHERE mc.user_id=u.id AND mc.completed_at>=?) AS week_count
    FROM users u WHERE u.family_id=? ORDER BY u.id`, [ws, fid]);
  const missionCount = await db.get('SELECT COUNT(*) AS n FROM missions WHERE active=1');
  return {
    week_start: new Date(new Date(ws.replace(' ', 'T') + 'Z').getTime() + 7 * 3600e3).toISOString().slice(0, 10),
    stats: s,
    weekly_goal: Math.max(Number(missionCount.n), 5),
    members,
    badges: BADGES.map((b) => ({ ...b, earned: !!earned[b.key] })),
  };
});

// Hoạt động hằng ngày
route('GET', '/api/activities', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const date = isDate(ctx.query.date) ? ctx.query.date : today();
  const items = await db.all(`SELECT a.*, u.name AS done_by_name FROM activities a LEFT JOIN users u ON u.id=a.done_by
    WHERE a.family_id=? AND a.date=? ORDER BY a.id`, [ctx.user.family_id, date]);
  return { date, items };
});
route('POST', '/api/activities', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const title = str(ctx.body.title, 200);
  if (!title) throw bad('Vui lòng nhập tên hoạt động.');
  const date = isDate(ctx.body.date) ? ctx.body.date : today();
  const done = ctx.body.done ? 1 : 0;
  const r = await db.run('INSERT INTO activities (family_id,user_id,title,date,done,done_by) VALUES (?,?,?,?,?,?)',
    [ctx.user.family_id, ctx.user.id, title, date, done, done ? ctx.user.id : null]);
  await logAction(ctx.user, 'activity', `Ghi nhận hoạt động: ${title}`);
  return { ok: true, id: r.lastId };
});
route('PUT', '/api/activities/:id', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const done = ctx.body.done ? 1 : 0;
  await db.run('UPDATE activities SET done=?, done_by=? WHERE id=? AND family_id=?',
    [done, done ? ctx.user.id : null, ctx.params.id, ctx.user.family_id]);
  return { ok: true };
});
route('DELETE', '/api/activities/:id', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  await db.run('DELETE FROM activities WHERE id=? AND family_id=?', [ctx.params.id, ctx.user.family_id]);
  return { ok: true };
});

// Lịch chung & nhắc lịch sức khỏe
route('GET', '/api/events', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const from = isDate(ctx.query.from) ? ctx.query.from : today();
  const to = isDate(ctx.query.to) ? ctx.query.to : '9999-12-31';
  const items = await db.all(`SELECT e.*, u.name AS created_by_name FROM events e LEFT JOIN users u ON u.id=e.created_by
    WHERE e.family_id=? AND e.date>=? AND e.date<=? ORDER BY e.date, e.time LIMIT 200`, [ctx.user.family_id, from, to]);
  return { items, today: today() };
});
route('POST', '/api/events', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const b = ctx.body;
  const title = str(b.title, 200);
  if (!title) throw bad('Vui lòng nhập tên sự kiện.');
  if (!isDate(b.date)) throw bad('Vui lòng chọn ngày.');
  const type = ['vaccine', 'checkup', 'activity', 'other'].includes(b.type) ? b.type : 'other';
  const time = /^\d{2}:\d{2}$/.test(b.time || '') ? b.time : '';
  const r = await db.run('INSERT INTO events (family_id,title,date,time,type,note,created_by) VALUES (?,?,?,?,?,?,?)',
    [ctx.user.family_id, title, b.date, time, type, str(b.note, 500), ctx.user.id]);
  await logAction(ctx.user, 'event', `Thêm lịch: ${title} (${b.date})`);
  return { ok: true, id: r.lastId };
});
route('DELETE', '/api/events/:id', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  await db.run('DELETE FROM events WHERE id=? AND family_id=?', [ctx.params.id, ctx.user.family_id]);
  return { ok: true };
});

// Kỷ niệm
route('GET', '/api/memories', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const items = await db.all(`SELECT m.*, u.name AS user_name FROM memories m LEFT JOIN users u ON u.id=m.user_id
    WHERE m.family_id=? ORDER BY m.date DESC, m.id DESC LIMIT 60`, [ctx.user.family_id]);
  return { items };
});
route('POST', '/api/memories', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  const caption = str(ctx.body.caption, 300);
  if (!caption) throw bad('Vui lòng nhập mô tả khoảnh khắc.');
  const photo = String(ctx.body.photo || '');
  if (!isImage(photo)) throw bad('Ảnh không hợp lệ.');
  const date = isDate(ctx.body.date) ? ctx.body.date : today();
  const r = await db.run('INSERT INTO memories (family_id,user_id,caption,photo,date) VALUES (?,?,?,?,?)',
    [ctx.user.family_id, ctx.user.id, caption, photo, date]);
  await logAction(ctx.user, 'memory', `Lưu khoảnh khắc: ${caption}`);
  return { ok: true, id: r.lastId };
});
route('DELETE', '/api/memories/:id', { auth: true }, async (ctx) => {
  needFamily(ctx.user);
  await db.run('DELETE FROM memories WHERE id=? AND family_id=?', [ctx.params.id, ctx.user.family_id]);
  return { ok: true };
});

// Checklist cá nhân hóa
route('GET', '/api/checklist', { auth: true }, async (ctx) => {
  const key = ctx.user.family_id || 'U' + ctx.user.id;
  const rows = await db.all('SELECT item_key FROM checklist WHERE family_id=? AND done=1', [key]);
  return { done: rows.map((r) => r.item_key) };
});
route('POST', '/api/checklist', { auth: true }, async (ctx) => {
  const key = ctx.user.family_id || 'U' + ctx.user.id;
  const item = str(ctx.body.key, 80);
  if (!item) throw bad('Thiếu mục checklist.');
  if (ctx.body.done) {
    await db.run(`INSERT INTO checklist (family_id,item_key,done) VALUES (?,?,1)
      ON CONFLICT(family_id,item_key) DO UPDATE SET done=1, updated_at=datetime('now')`, [key, item]);
  } else {
    await db.run('DELETE FROM checklist WHERE family_id=? AND item_key=?', [key, item]);
  }
  return { ok: true };
});

// ======================= ADMIN =======================
route('GET', '/api/admin/stats', { admin: true }, async () => {
  const s = await db.get(`SELECT
    (SELECT COUNT(*) FROM articles) AS articles,
    (SELECT COUNT(*) FROM articles WHERE status='published') AS published,
    (SELECT COUNT(*) FROM articles WHERE status='draft') AS drafts,
    (SELECT COUNT(DISTINCT article_id) FROM quizzes WHERE article_id IS NOT NULL) AS with_quiz,
    (SELECT COUNT(*) FROM quizzes) AS quizzes,
    (SELECT COUNT(*) FROM paths) AS paths,
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM families) AS families,
    (SELECT COUNT(*) FROM missions) AS missions`);
  return { stats: s, db: db.mode };
});

route('GET', '/api/admin/articles', { admin: true }, async (ctx) => {
  const q = ctx.query; const where = [], params = [];
  if (q.q) { where.push('a.title LIKE ?'); params.push(`%${str(q.q, 100)}%`); }
  if (CATEGORIES.includes(q.category)) { where.push('a.category=?'); params.push(q.category); }
  if (['draft', 'published'].includes(q.status)) { where.push('a.status=?'); params.push(q.status); }
  if (Number(q.days) > 0) { where.push("a.updated_at >= datetime('now', ?)"); params.push(`-${Number(q.days)} days`); }
  if (q.path === 'none') where.push('NOT EXISTS (SELECT 1 FROM path_items pi WHERE pi.article_id=a.id)');
  else if (Number(q.path)) { where.push('EXISTS (SELECT 1 FROM path_items pi WHERE pi.article_id=a.id AND pi.path_id=?)'); params.push(Number(q.path)); }
  if (q.has_quiz === '1') where.push('EXISTS (SELECT 1 FROM quizzes z WHERE z.article_id=a.id)');
  const items = await db.all(`SELECT a.id,a.slug,a.title,a.category,a.age_group,a.status,a.featured,a.views,a.cover_image,a.updated_at,
      (SELECT COUNT(*) FROM quiz_questions x JOIN quizzes z ON z.id=x.quiz_id WHERE z.article_id=a.id) AS quiz_questions,
      (SELECT z.id FROM quizzes z WHERE z.article_id=a.id ORDER BY z.id DESC LIMIT 1) AS quiz_id
    FROM articles a ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY a.updated_at DESC LIMIT 500`, params);
  const map = await pathMap();
  for (const i of items) { i.step = stepOf(map, i.id); i.cover_image = i.cover_image && i.cover_image.startsWith('data:') ? 'data' : i.cover_image; }
  const counts = await db.get(`SELECT COUNT(*) AS total, SUM(status='published') AS published, SUM(status='draft') AS drafts,
    SUM(EXISTS (SELECT 1 FROM quizzes z WHERE z.article_id=articles.id)) AS with_quiz FROM articles`);
  return { items, counts };
});

route('GET', '/api/admin/articles/:id', { admin: true }, async (ctx) => {
  const a = await db.get('SELECT * FROM articles WHERE id=?', [ctx.params.id]);
  if (!a) throw new HttpError(404, 'Không tìm thấy bài viết.');
  const p = await db.get(`SELECT pi.path_id, pi.position FROM path_items pi JOIN paths p ON p.id=pi.path_id WHERE pi.article_id=? ORDER BY p.sort_order LIMIT 1`, [a.id]);
  const quiz = await db.get(`SELECT q.id,q.title,(SELECT COUNT(*) FROM quiz_questions x WHERE x.quiz_id=q.id) AS questions FROM quizzes q WHERE q.article_id=? ORDER BY q.id DESC LIMIT 1`, [a.id]);
  return { article: { ...a, path_id: p ? p.path_id : '', path_position: p ? p.position : '' }, quiz };
});

async function articleFields(b, id) {
  const title = str(b.title, 250);
  if (!title) throw bad('Vui lòng nhập tiêu đề.');
  if (!CATEGORIES.includes(b.category)) throw bad('Vui lòng chọn danh mục.');
  const age = AGES.includes(b.age_group) ? b.age_group : 'all';
  let slug = slugify(b.slug || title);
  const base = slug; let i = 2;
  while (await db.get('SELECT id FROM articles WHERE slug=? AND id<>?', [slug, id || 0])) slug = `${base}-${i++}`;
  const cover = String(b.cover_image || '');
  if (!isImage(cover)) throw bad('Ảnh bìa không hợp lệ.');
  const srcUrl = str(b.source_url, 500);
  if (srcUrl && !/^https?:\/\//i.test(srcUrl)) throw bad('Đường dẫn tài liệu gốc phải bắt đầu bằng http:// hoặc https://');
  return {
    slug, title, summary: str(b.summary, 600), content: sanitizeHtml(b.content), category: b.category, age_group: age,
    cover_image: cover, source_name: str(b.source_name, 200), source_url: srcUrl, reviewer: str(b.reviewer, 200),
    status: b.status === 'published' ? 'published' : 'draft', featured: b.featured ? 1 : 0,
  };
}
async function writePathItems(pathId, ids) {
  await db.run('DELETE FROM path_items WHERE path_id=?', [pathId]);
  let pos = 1;
  for (const aid of ids) await db.run('INSERT OR IGNORE INTO path_items (path_id,article_id,position) VALUES (?,?,?)', [pathId, aid, pos++]);
}
async function setArticlePath(articleId, pathId, position) {
  const cur = await db.get(`SELECT pi.path_id FROM path_items pi JOIN paths p ON p.id=pi.path_id WHERE pi.article_id=? ORDER BY p.sort_order LIMIT 1`, [articleId]);
  const target = Number(pathId) || 0;
  if (cur && cur.path_id !== target) {
    const rest = (await db.all('SELECT article_id FROM path_items WHERE path_id=? AND article_id<>? ORDER BY position', [cur.path_id, articleId])).map((r) => r.article_id);
    await writePathItems(cur.path_id, rest);
  }
  if (!target) return;
  if (!(await db.get('SELECT id FROM paths WHERE id=?', [target]))) throw bad('Lộ trình không tồn tại.');
  const ids = (await db.all('SELECT article_id FROM path_items WHERE path_id=? AND article_id<>? ORDER BY position', [target, articleId])).map((r) => r.article_id);
  const at = Math.min(Math.max((Number(position) || ids.length + 1) - 1, 0), ids.length);
  ids.splice(at, 0, articleId);
  await writePathItems(target, ids);
}
route('POST', '/api/admin/articles', { admin: true }, async (ctx) => {
  const f = await articleFields(ctx.body, 0);
  const cols = Object.keys(f);
  const r = await db.run(`INSERT INTO articles (${cols.join(',')},author_id) VALUES (${cols.map(() => '?').join(',')},?)`,
    [...Object.values(f), ctx.user.id]);
  if (ctx.body.path_id !== undefined) await setArticlePath(r.lastId, ctx.body.path_id, ctx.body.path_position);
  return { ok: true, id: r.lastId, slug: f.slug, status: f.status };
});
route('PUT', '/api/admin/articles/:id', { admin: true }, async (ctx) => {
  const id = Number(ctx.params.id);
  if (!(await db.get('SELECT id FROM articles WHERE id=?', [id]))) throw new HttpError(404, 'Không tìm thấy bài viết.');
  const f = await articleFields(ctx.body, id);
  const cols = Object.keys(f);
  await db.run(`UPDATE articles SET ${cols.map((c) => c + '=?').join(',')}, updated_at=datetime('now') WHERE id=?`, [...Object.values(f), id]);
  if (ctx.body.path_id !== undefined) await setArticlePath(id, ctx.body.path_id, ctx.body.path_position);
  return { ok: true, id, slug: f.slug, status: f.status };
});
route('DELETE', '/api/admin/articles/:id', { admin: true }, async (ctx) => {
  const id = Number(ctx.params.id);
  const quizzes = await db.all('SELECT id FROM quizzes WHERE article_id=?', [id]);
  for (const q of quizzes) { await db.run('DELETE FROM quiz_questions WHERE quiz_id=?', [q.id]); await db.run('DELETE FROM quizzes WHERE id=?', [q.id]); }
  const paths = await db.all('SELECT DISTINCT path_id FROM path_items WHERE article_id=?', [id]);
  await db.run('DELETE FROM articles WHERE id=?', [id]);
  await db.run('DELETE FROM bookmarks WHERE article_id=?', [id]);
  await db.run('DELETE FROM article_reads WHERE article_id=?', [id]);
  for (const p of paths) {
    const rest = (await db.all('SELECT article_id FROM path_items WHERE path_id=? AND article_id<>? ORDER BY position', [p.path_id, id])).map((r) => r.article_id);
    await writePathItems(p.path_id, rest);
  }
  return { ok: true };
});

// ----- Quiz / Game (admin) -----
route('GET', '/api/admin/quizzes', { admin: true }, async () => ({
  items: await db.all(`SELECT q.*, a.title AS article_title, a.slug AS article_slug,
      (SELECT COUNT(*) FROM quiz_questions x WHERE x.quiz_id=q.id) AS questions
    FROM quizzes q LEFT JOIN articles a ON a.id=q.article_id ORDER BY q.updated_at DESC`),
}));
route('GET', '/api/admin/quizzes/:id', { admin: true }, async (ctx) => {
  const quiz = await db.get(`SELECT q.*, a.title AS article_title, a.slug AS article_slug FROM quizzes q LEFT JOIN articles a ON a.id=q.article_id WHERE q.id=?`, [ctx.params.id]);
  if (!quiz) throw new HttpError(404, 'Không tìm thấy game.');
  const rows = await db.all('SELECT * FROM quiz_questions WHERE quiz_id=? ORDER BY position, id', [quiz.id]);
  return { quiz, questions: rows.map((r) => ({ ...r, options: JSON.parse(r.options) })) };
});
function quizFields(b) {
  const title = str(b.title, 200);
  if (!title) throw bad('Vui lòng đặt tên cho game.');
  const qs = Array.isArray(b.questions) ? b.questions : [];
  if (!qs.length) throw bad('Game cần ít nhất 1 câu hỏi.');
  if (qs.length > 50) throw bad('Tối đa 50 câu hỏi cho một game.');
  const questions = qs.map((q, i) => {
    const question = str(q.question, 500);
    const options = (Array.isArray(q.options) ? q.options : []).map((o) => str(o, 300));
    if (!question) throw bad(`Câu ${i + 1}: chưa nhập nội dung câu hỏi.`);
    if (options.length < 2 || options.length > 6) throw bad(`Câu ${i + 1}: cần từ 2 đến 6 đáp án.`);
    if (options.some((o) => !o)) throw bad(`Câu ${i + 1}: có đáp án đang để trống.`);
    const c = Number(q.correct_index);
    if (!(c >= 0 && c < options.length)) throw bad(`Câu ${i + 1}: hãy chọn đáp án đúng.`);
    return { question, options, correct_index: c, explanation: str(q.explanation, 1000), source: str(q.source, 200),
      category: CATEGORIES.includes(q.category) ? q.category : (CATEGORIES.includes(b.category) ? b.category : 'baby-care') };
  });
  const articleId = Number(b.article_id) || null;
  return {
    quiz: { title, description: str(b.description, 500), article_id: articleId,
      time_per_question: Math.min(Math.max(Number(b.time_per_question) || 45, 10), 300),
      points_per_question: Math.min(Math.max(Number(b.points_per_question) || 10, 1), 100),
      status: b.status === 'draft' ? 'draft' : 'published' },
    questions,
  };
}
async function writeQuestions(quizId, questions) {
  await db.run('DELETE FROM quiz_questions WHERE quiz_id=?', [quizId]);
  let pos = 1;
  for (const q of questions) {
    await db.run('INSERT INTO quiz_questions (quiz_id,position,question,options,correct_index,explanation,source,category,active) VALUES (?,?,?,?,?,?,?,?,1)',
      [quizId, pos++, q.question, JSON.stringify(q.options), q.correct_index, q.explanation, q.source, q.category]);
  }
}
route('POST', '/api/admin/quizzes', { admin: true }, async (ctx) => {
  const { quiz, questions } = quizFields(ctx.body);
  if (quiz.article_id && !(await db.get('SELECT id FROM articles WHERE id=?', [quiz.article_id]))) throw bad('Bài viết liên kết không tồn tại.');
  const r = await db.run('INSERT INTO quizzes (title,description,article_id,time_per_question,points_per_question,status) VALUES (?,?,?,?,?,?)',
    [quiz.title, quiz.description, quiz.article_id, quiz.time_per_question, quiz.points_per_question, quiz.status]);
  await writeQuestions(r.lastId, questions);
  return { ok: true, id: r.lastId };
});
route('PUT', '/api/admin/quizzes/:id', { admin: true }, async (ctx) => {
  const id = Number(ctx.params.id);
  if (!(await db.get('SELECT id FROM quizzes WHERE id=?', [id]))) throw new HttpError(404, 'Không tìm thấy game.');
  const { quiz, questions } = quizFields(ctx.body);
  await db.run("UPDATE quizzes SET title=?,description=?,article_id=?,time_per_question=?,points_per_question=?,status=?,updated_at=datetime('now') WHERE id=?",
    [quiz.title, quiz.description, quiz.article_id, quiz.time_per_question, quiz.points_per_question, quiz.status, id]);
  await writeQuestions(id, questions);
  return { ok: true, id };
});
route('DELETE', '/api/admin/quizzes/:id', { admin: true }, async (ctx) => {
  await db.run('DELETE FROM quiz_questions WHERE quiz_id=?', [ctx.params.id]);
  await db.run('DELETE FROM quizzes WHERE id=?', [ctx.params.id]);
  return { ok: true };
});

// ----- Lộ trình đọc (admin) -----
route('GET', '/api/admin/paths', { admin: true }, async () => {
  const paths = await db.all('SELECT * FROM paths ORDER BY sort_order, id');
  const items = await db.all('SELECT pi.path_id,pi.position,a.id,a.title,a.status FROM path_items pi JOIN articles a ON a.id=pi.article_id ORDER BY pi.path_id,pi.position');
  return { items: paths.map((p) => ({ ...p, articles: items.filter((i) => i.path_id === p.id) })) };
});
function pathFields(b) {
  const title = str(b.title, 200);
  if (!title) throw bad('Vui lòng nhập tên lộ trình.');
  return [title, str(b.description, 500), AGES.includes(b.age_group) ? b.age_group : 'all',
    ['baby', 'bottle', 'sprout', 'heart', 'foot', 'syringe', 'book'].includes(b.icon) ? b.icon : 'baby', Number(b.sort_order) || 0];
}
route('POST', '/api/admin/paths', { admin: true }, async (ctx) => {
  const f = pathFields(ctx.body);
  let slug = slugify(f[0]); const base = slug; let i = 2;
  while (await db.get('SELECT id FROM paths WHERE slug=?', [slug])) slug = `${base}-${i++}`;
  const r = await db.run('INSERT INTO paths (slug,title,description,age_group,icon,sort_order) VALUES (?,?,?,?,?,?)', [slug, ...f]);
  if (Array.isArray(ctx.body.article_ids)) await writePathItems(r.lastId, ctx.body.article_ids.map(Number).filter(Boolean));
  return { ok: true, id: r.lastId };
});
route('PUT', '/api/admin/paths/:id', { admin: true }, async (ctx) => {
  const id = Number(ctx.params.id);
  await db.run('UPDATE paths SET title=?,description=?,age_group=?,icon=?,sort_order=? WHERE id=?', [...pathFields(ctx.body), id]);
  if (Array.isArray(ctx.body.article_ids)) await writePathItems(id, ctx.body.article_ids.map(Number).filter(Boolean));
  return { ok: true, id };
});
route('DELETE', '/api/admin/paths/:id', { admin: true }, async (ctx) => {
  await db.run('DELETE FROM path_items WHERE path_id=?', [ctx.params.id]);
  await db.run('DELETE FROM paths WHERE id=?', [ctx.params.id]);
  return { ok: true };
});

// ----- Nhiệm vụ (admin) -----
route('GET', '/api/admin/missions', { admin: true }, async () => ({ items: await db.all('SELECT * FROM missions ORDER BY id DESC') }));
function missionFields(b) {
  const title = str(b.title, 200);
  if (!title) throw bad('Vui lòng nhập tên nhiệm vụ.');
  const image = String(b.image || '');
  if (!isImage(image)) throw bad('Ảnh không hợp lệ.');
  return [title, str(b.description, 1000), ['Bố', 'Mẹ', 'Bố và mẹ'].includes(b.participant) ? b.participant : 'Bố và mẹ',
    str(b.goal, 300), Math.min(Math.max(Number(b.points) || 10, 1), 1000), image, str(b.tag, 40),
    b.active === false || b.active === 0 ? 0 : 1];
}
route('POST', '/api/admin/missions', { admin: true }, async (ctx) => {
  const r = await db.run('INSERT INTO missions (title,description,participant,goal,points,image,tag,active) VALUES (?,?,?,?,?,?,?,?)', missionFields(ctx.body));
  return { ok: true, id: r.lastId };
});
route('PUT', '/api/admin/missions/:id', { admin: true }, async (ctx) => {
  await db.run('UPDATE missions SET title=?,description=?,participant=?,goal=?,points=?,image=?,tag=?,active=? WHERE id=?',
    [...missionFields(ctx.body), ctx.params.id]);
  return { ok: true };
});
route('DELETE', '/api/admin/missions/:id', { admin: true }, async (ctx) => {
  await db.run('DELETE FROM missions WHERE id=?', [ctx.params.id]);
  return { ok: true };
});

route('GET', '/api/admin/users', { admin: true }, async () => ({
  items: await db.all('SELECT id,email,name,role,parent_role,family_id,created_at FROM users ORDER BY id DESC LIMIT 500'),
}));
route('PUT', '/api/admin/users/:id', { admin: true }, async (ctx) => {
  const id = Number(ctx.params.id);
  if (id === ctx.user.id) throw bad('Bạn không thể tự đổi quyền của chính mình.');
  const role = ctx.body.role === 'admin' ? 'admin' : 'parent';
  await db.run('UPDATE users SET role=? WHERE id=?', [role, id]);
  forgetUser(id);
  return { ok: true };
});
route('GET', '/api/health', async () => ({ ok: true, db: db.mode, time: new Date().toISOString() }));

// ======================= Xử lý HTTP =======================
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new HttpError(413, 'Dữ liệu gửi lên quá lớn (ảnh tối đa khoảng 5MB).')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { reject(bad('Dữ liệu JSON không hợp lệ.')); }
    });
    req.on('error', reject);
  });
}

async function handleApi(req, res, url) {
  const cookies = [];
  try {
    const r = routes.find((x) => x.method === req.method && x.re.test(url.pathname));
    if (!r) throw new HttpError(404, 'API không tồn tại.');
    const m = url.pathname.match(r.re);
    const params = {};
    r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
    // Chống CSRF: yêu cầu thay đổi dữ liệu phải đến từ cùng nguồn
    if (req.method !== 'GET') {
      const origin = req.headers.origin;
      if (origin && new URL(origin).host !== req.headers.host) throw new HttpError(403, 'Yêu cầu không hợp lệ.');
    }
    const uid = readToken(parseCookies(req).bt_session);
    const user = uid ? await loadUser(uid) : null;
    if ((r.auth || r.admin) && !user) throw new HttpError(401, 'Vui lòng đăng nhập.');
    if (r.admin && user.role !== 'admin') throw new HttpError(403, 'Bạn không có quyền quản trị.');
    const body = req.method === 'GET' || req.method === 'DELETE' ? {} : await readBody(req);
    const ctx = {
      req, params, body, user,
      query: Object.fromEntries(url.searchParams),
      ip: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(),
      setCookie: (c) => cookies.push(c),
    };
    const result = await r.handler(ctx);
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
    if (cookies.length) headers['Set-Cookie'] = cookies;
    send(res, 200, JSON.stringify(result), headers);
  } catch (e) {
    const status = e.status || 500;
    if (status === 500) console.error(e);
    send(res, status, JSON.stringify({ error: status === 500 ? 'Lỗi máy chủ, vui lòng thử lại.' : e.message }),
      { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  }
}

function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p.startsWith('/bai-viet/')) p = '/bai-viet.html';           // URL đẹp cho bài viết
  if (p === '/admin' || p === '/admin/') p = '/admin/index.html';
  if (p.endsWith('/')) p += 'index.html';
  if (!path.extname(p)) p += '.html';                                 // /kien-thuc -> /kien-thuc.html
  const file = path.normalize(path.join(PUBLIC_DIR, p));
  if (!file.startsWith(PUBLIC_DIR)) return send(res, 403, 'Forbidden');
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      const nf = path.join(PUBLIC_DIR, '404.html');
      return fs.readFile(nf, (e2, data) => send(res, 404, e2 ? 'Không tìm thấy trang' : data, { 'Content-Type': MIME['.html'] }));
    }
    const ext = path.extname(file).toLowerCase();
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache, 'Content-Length': st.size });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  serveStatic(req, res, url);
});

async function ensureAdmin() {
  let email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  let password = process.env.ADMIN_PASSWORD || '';
  if (!email && db.mode === 'local-sqlite') { email = 'admin@babytogether.local'; password = 'admin123'; }
  if (!email || !password) { console.warn('[admin] Chưa đặt ADMIN_EMAIL / ADMIN_PASSWORD – chưa tạo tài khoản quản trị.'); return; }
  const u = await db.get('SELECT id,role,password_hash FROM users WHERE email=?', [email]);
  if (!u) {
    await db.run("INSERT INTO users (email,password_hash,name,role,parent_role) VALUES (?,?,?,'admin','Người chăm sóc')",
      [email, hashPassword(password), 'Quản trị viên']);
    console.log(`[admin] Đã tạo tài khoản quản trị ${email}`);
  } else {
    // Biến môi trường là nguồn chuẩn: đổi ADMIN_PASSWORD trên Render rồi deploy lại là đổi được mật khẩu admin
    if (u.role !== 'admin') await db.run("UPDATE users SET role='admin' WHERE id=?", [u.id]);
    if (!verifyPassword(password, u.password_hash)) {
      await db.run('UPDATE users SET password_hash=? WHERE id=?', [hashPassword(password), u.id]);
      console.log(`[admin] Đã cập nhật mật khẩu quản trị theo ADMIN_PASSWORD`);
    }
  }
}

(async () => {
  try {
    console.log(`[db] Chế độ: ${db.mode}`);
    await db.init();
    await seed(db);
    await ensureAdmin();
  } catch (e) {
    console.error('[db] Lỗi khởi tạo cơ sở dữ liệu:', e.message);
    if (IS_PROD) console.error('Kiểm tra lại CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN trên Render.');
  }
  server.listen(PORT, () => console.log(`BabyTogether đang chạy tại http://localhost:${PORT}`));
})();
