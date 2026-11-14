// Lớp truy cập cơ sở dữ liệu.
// - Khi chạy trên Render: dùng Cloudflare D1 qua HTTP API (cần CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN).
// - Khi chạy thử trên máy (không có biến môi trường Cloudflare): dùng SQLite cục bộ (node:sqlite) để phát triển.
'use strict';
const fs = require('fs');
const path = require('path');

const { CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN } = process.env;
const useD1 = Boolean(CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_TOKEN);

function normParams(params) {
  return (params || []).map((v) => {
    if (v === undefined) return null;
    if (typeof v === 'boolean') return v ? 1 : 0;
    return v;
  });
}

// ---------- Cloudflare D1 (HTTP API) ----------
const D1_URL = useD1
  ? `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`
  : '';

async function d1Query(sql, params) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(D1_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params: normParams(params) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const msg = (data.errors && data.errors.map((e) => e.message).join('; ')) || `HTTP ${res.status}`;
        const err = new Error('D1: ' + msg);
        err.retry = res.status >= 500 || res.status === 429;
        throw err;
      }
      const r = (data.result && data.result[0]) || {};
      return { rows: r.results || [], changes: (r.meta && r.meta.changes) || 0, lastId: (r.meta && r.meta.last_row_id) || null };
    } catch (e) {
      lastErr = e;
      if (e.retry === false || (e.message.startsWith('D1:') && !e.retry)) break;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw lastErr;
}

// ---------- SQLite cục bộ (chỉ để phát triển) ----------
let local;
function localDb() {
  if (!local) {
    const { DatabaseSync } = require('node:sqlite');
    const file = process.env.LOCAL_DB_FILE || path.join(__dirname, '..', 'data', 'local.db');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    local = new DatabaseSync(file);
  }
  return local;
}
async function localQuery(sql, params) {
  const stmt = localDb().prepare(sql);
  const p = normParams(params);
  if (/^\s*(select|with|pragma)/i.test(sql) || /\breturning\b/i.test(sql)) {
    return { rows: stmt.all(...p), changes: 0, lastId: null };
  }
  const r = stmt.run(...p);
  return { rows: [], changes: Number(r.changes), lastId: Number(r.lastInsertRowid) };
}

const query = useD1 ? d1Query : localQuery;

const db = {
  mode: useD1 ? 'cloudflare-d1' : 'local-sqlite',
  async all(sql, params) { return (await query(sql, params)).rows; },
  async get(sql, params) { return (await query(sql, params)).rows[0] || null; },
  async run(sql, params) { const r = await query(sql, params); return { changes: r.changes, lastId: r.lastId }; },
  async init() {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
      .split('\n').filter((l) => !l.trim().startsWith('--')).join('\n');
    const statements = schema.split(';').map((s) => s.trim()).filter(Boolean);
    for (const s of statements) await query(s, []);
  },
};

module.exports = db;
