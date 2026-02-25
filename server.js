/*
  ╔══════════════════════════════════════════════════════╗
  ║   Shraddha Videology — Portfolio Backend Server     ║
  ║   Database: database.db (SQLite — single file)      ║
  ║   Start:    double-click START.bat                  ║
  ╚══════════════════════════════════════════════════════╝
*/

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// ── Standardized Logging ─────────────────────────────
const logger = {
  info: (msg) => console.log(`[${new Date().toLocaleTimeString()}] ℹ️ INFO: ${msg}`),
  success: (msg) => console.log(`[${new Date().toLocaleTimeString()}] ✅ SUCCESS: ${msg}`),
  warn: (msg) => console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ WARN: ${msg}`),
  error: (msg) => console.error(`[${new Date().toLocaleTimeString()}] 🔥 ERROR: ${msg}`)
};

// ════════════════════════════════════════════════════════
const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'database.db');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secure-session-token-2024'; // In prod, use env var

// ── Global Process Protection ─────────────────────────
process.on('uncaughtException', (err) => {
  console.error('🔥 CRITICAL UNCAUGHT EXCEPTION:', err);
  // In a real prod app, you might want to gracefully shutdown, 
  // but for small sites, we log and try to stay alive if possible.
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ UNHANDLED PROMISE REJECTION:', reason);
});

// ── Open / create database file ───────────────────────
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) { logger.error('Database error: ' + err.message); process.exit(1); }
  logger.info('Database mapped: ' + DB_PATH);
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { if (err) reject(err); else resolve(this); });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows); });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => { if (err) reject(err); else resolve(row); });
  });
}

// ── Create tables ─────────────────────────────────────
async function initDB() {
  await run(`CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, email TEXT, phone TEXT, project TEXT, message TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now','localtime'))
    )`);
  await run(`CREATE TABLE IF NOT EXISTS video_config (
        slot_id TEXT PRIMARY KEY,
        drive_id TEXT,
        display_label TEXT
    )`);

  await run(`CREATE TABLE IF NOT EXISTS admin_credentials (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        username TEXT NOT NULL DEFAULT 'manav2109',
        password TEXT NOT NULL
    )`);

  // Check if admin exists, if not create with hashed password
  const admin = await get('SELECT * FROM admin_credentials WHERE id = 1');
  if (!admin) {
    const hashedPass = await bcrypt.hash('manav@2109', 10);
    await run('INSERT INTO admin_credentials (id, username, password) VALUES (1, ?, ?)', ['manav2109', hashedPass]);
    logger.success('Admin credentials initialized.');
  }
}

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: '*' })); // For production, restrict this to your domain
app.use(express.json());
app.use(express.static(__dirname));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ ok: false, error: 'Unauthorized access' });
  }
};

// ── Health Check (For Monitoring & Keep-Alive) ────────
app.get('/api/health', (req, res) => {
  // Check if DB is responsive
  db.get('SELECT 1', (err) => {
    if (err) {
      return res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
    }
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  });
});

// ─────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const creds = await get('SELECT * FROM admin_credentials WHERE id = 1');

    const match = await bcrypt.compare(password, creds.password);
    if (username === creds.username && match) {
      res.json({ ok: true, username, token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ ok: false, error: 'Incorrect username or password' });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/credentials', authenticate, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const hashedPass = await bcrypt.hash(password, 10);
    await run('UPDATE admin_credentials SET username = ?, password = ? WHERE id = 1', [username, hashedPass]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────
// CONTACT FORM SUBMISSIONS
// ─────────────────────────────────────────────────────

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, project, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

    // Save to database
    const result = await run(
      'INSERT INTO submissions (name, email, phone, project, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || '', project || '', message || '']
    );
    logger.info(`New submission #${result.lastID}: ${name} <${email}>`);

    res.json({ ok: true, id: result.lastID });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/submissions', authenticate, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM submissions ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/submissions/export', authenticate, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM submissions ORDER BY created_at DESC');
    res.setHeader('Content-Disposition', 'attachment; filename="submissions.json"');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/submissions/:id/read', authenticate, async (req, res) => {
  try {
    await run('UPDATE submissions SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/submissions/:id', authenticate, async (req, res) => {
  try {
    await run('DELETE FROM submissions WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/submissions', authenticate, async (req, res) => {
  try {
    await run('DELETE FROM submissions');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────
// VIDEO CONFIG
// ─────────────────────────────────────────────────────

app.get('/api/videos', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM video_config');
    const config = {};
    rows.forEach(r => {
      config[r.slot_id] = { drive_id: r.drive_id, display_label: r.display_label };
    });
    res.json(config);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/videos', authenticate, async (req, res) => {
  try {
    const { slot_id, drive_id, display_label } = req.body;
    if (!slot_id || !drive_id) return res.status(400).json({ error: 'Missing fields' });
    await run(
      'INSERT INTO video_config (slot_id, drive_id, display_label) VALUES (?, ?, ?) ON CONFLICT(slot_id) DO UPDATE SET drive_id = excluded.drive_id, display_label = excluded.display_label',
      [slot_id, drive_id, display_label || '']
    );
    logger.info(`Video updated: ${slot_id} → ${drive_id}`);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    logger.success('Server is live! Access URLs below:');
    console.log(`- Local     : http://localhost:${PORT}`);
    console.log(`- Network   : 0.0.0.0:${PORT}`);
    console.log(`- Admin     : http://localhost:${PORT}/admin.html`);
    console.log('------------------------------------------------');
  });
}).catch(err => {
  logger.error('Failed to initialize database: ' + err.message);
  process.exit(1);
});
