-- BabyTogether - Cloudflare D1 (SQLite) schema
-- Chạy file này 1 lần trong Cloudflare D1 Console (hoặc server sẽ tự tạo khi khởi động).

CREATE TABLE IF NOT EXISTS families (
  id TEXT PRIMARY KEY,                -- Family ID dạng FAM001
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL,
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'parent',      -- parent | admin
  parent_role TEXT DEFAULT 'Mẹ',            -- Bố | Mẹ | Người chăm sóc
  family_id TEXT REFERENCES families(id),
  settings TEXT DEFAULT '{}',               -- JSON cài đặt thông báo
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS children (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id TEXT NOT NULL REFERENCES families(id),
  name TEXT NOT NULL,
  birth_date TEXT,           -- YYYY-MM-DD (nếu bé đã sinh)
  due_date TEXT,             -- YYYY-MM-DD (nếu đang mang thai)
  gender TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT NOT NULL,       -- baby-care | maternal-care | nutrition | vaccination
  age_group TEXT DEFAULT 'all', -- pregnancy | 0-6 | 6-12 | 12-24 | all
  cover_image TEXT DEFAULT '',
  source_name TEXT DEFAULT '',
  source_url TEXT DEFAULT '',
  reviewer TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'published', -- published | draft
  featured INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  author_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_articles_cat ON articles(category, status);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS article_reads (
  user_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
  family_id TEXT,
  read_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  options TEXT NOT NULL,          -- JSON array 4 đáp án
  correct_index INTEGER NOT NULL, -- 0..3
  explanation TEXT DEFAULT '',
  source TEXT DEFAULT '',
  category TEXT DEFAULT 'baby-care',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  family_id TEXT,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  participant TEXT DEFAULT 'Bố và mẹ',  -- Bố | Mẹ | Bố và mẹ
  goal TEXT DEFAULT '',
  points INTEGER NOT NULL DEFAULT 10,
  image TEXT DEFAULT '',
  tag TEXT DEFAULT '',                  -- reading | maternal | meal | play ... (dùng cho thống kê)
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mission_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mission_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  family_id TEXT,
  photo TEXT DEFAULT '',
  note TEXT DEFAULT '',
  points INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id TEXT NOT NULL,
  user_id INTEGER,
  title TEXT NOT NULL,
  date TEXT NOT NULL,            -- YYYY-MM-DD
  done INTEGER NOT NULL DEFAULT 0,
  done_by INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,            -- YYYY-MM-DD
  time TEXT DEFAULT '',
  type TEXT DEFAULT 'other',     -- vaccine | checkup | activity | other
  note TEXT DEFAULT '',
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS memories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id TEXT NOT NULL,
  user_id INTEGER,
  caption TEXT NOT NULL,
  photo TEXT DEFAULT '',
  date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS checklist (
  family_id TEXT NOT NULL,
  item_key TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (family_id, item_key)
);

CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_id TEXT,
  user_id INTEGER,
  action TEXT NOT NULL,
  detail TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ===== Bản cập nhật 2: Lộ trình đọc & Quiz/Game =====
CREATE TABLE IF NOT EXISTS paths (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  age_group TEXT DEFAULT 'all',      -- pregnancy | 0-6 | 6-12 | 12-24 | all
  icon TEXT DEFAULT 'baby',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS path_items (
  path_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY (path_id, article_id)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  article_id INTEGER,                -- quiz gắn với bài viết (có thể trống)
  time_per_question INTEGER NOT NULL DEFAULT 45,
  points_per_question INTEGER NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'published', -- published | draft
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
