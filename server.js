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
const nodemailer = require('nodemailer');

// ═══════════════════════════════════════════════════════
//  ✉️  EMAIL CONFIG — EDIT THESE TWO LINES
//  1. Use your Gmail address for GMAIL_USER
//  2. For GMAIL_PASS: use a Gmail "App Password"
//     (NOT your regular Gmail password)
//     How to get one → https://myaccount.google.com/apppasswords
//     Steps: Google Account → Security → 2FA ON → App Passwords → Create
// ═══════════════════════════════════════════════════════
const GMAIL_USER = 'shraddhavideology@gmail.com';
const GMAIL_PASS = 'YOUR_APP_PASSWORD_HERE';   // ← paste App Password here
const NOTIFY_TO = 'shraddhavideology@gmail.com'; // email that gets notified

// ── Setup email transporter ───────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS }
});

function emailReady() {
  return GMAIL_PASS !== 'YOUR_APP_PASSWORD_HERE' && GMAIL_PASS.length > 8;
}

async function sendNewInquiryEmail(data) {
  if (!emailReady()) {
    console.log('⚠️  Email skipped — configure GMAIL_PASS in server.js');
    return;
  }
  const { name, email, phone, project, message } = data;
  const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0a0a0f;color:#f0f0f0;border-radius:12px;overflow:hidden">
            <div style="background:#e8b86d;padding:24px 28px">
                <h2 style="margin:0;color:#0a0a0f;font-size:1.2rem">🎬 New Inquiry — Shraddha Videology</h2>
            </div>
            <div style="padding:28px">
                <table style="width:100%;border-collapse:collapse">
                    <tr><td style="padding:8px 0;color:#aaa;width:100px">Name</td><td style="padding:8px 0;font-weight:bold">${name}</td></tr>
                    <tr><td style="padding:8px 0;color:#aaa">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#e8b86d">${email}</a></td></tr>
                    <tr><td style="padding:8px 0;color:#aaa">Phone</td><td style="padding:8px 0">${phone || '—'}</td></tr>
                    <tr><td style="padding:8px 0;color:#aaa">Project</td><td style="padding:8px 0">${project || '—'}</td></tr>
                </table>
                <div style="margin-top:20px;background:#111;border-left:3px solid #e8b86d;padding:14px 16px;border-radius:4px">
                    <div style="color:#aaa;font-size:0.8rem;margin-bottom:6px">MESSAGE</div>
                    <div style="line-height:1.6">${message || '(no message)'}</div>
                </div>
                <div style="margin-top:24px;display:flex;gap:12px">
                    ${email ? `<a href="mailto:${email}?subject=Re: Your Inquiry — Shraddha Videology&body=Hi ${name},%0A%0AThank you for reaching out!" style="background:#e8b86d;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:0.88rem">📧 Reply via Email</a>` : ''}
                    ${phone ? `<a href="https://wa.me/91${(phone).replace(/\D/g, '')}" style="background:#25d366;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:0.88rem">💬 WhatsApp</a>` : ''}
                </div>
                <p style="margin-top:24px;color:#555;font-size:0.75rem">Sent by your portfolio server • View all submissions at <a href="http://localhost:3001/admin.html" style="color:#e8b86d">admin panel</a></p>
            </div>
        </div>
    `;
  await transporter.sendMail({
    from: `"Shraddha Videology Portfolio" <${GMAIL_USER}>`,
    to: NOTIFY_TO,
    subject: `📬 New Inquiry: ${project || 'General'} from ${name}`,
    html
  });
  console.log(`✉️  Email sent to ${NOTIFY_TO}`);
}

// ════════════════════════════════════════════════════════
const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'database.db');

// ── Open / create database file ───────────────────────
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) { console.error('❌ Database error:', err.message); process.exit(1); }
  console.log('📂 Database: ' + DB_PATH);
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
  await run(`CREATE TABLE IF NOT EXISTS video_config (slot_id TEXT PRIMARY KEY, file_name TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS admin_credentials (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        username TEXT NOT NULL DEFAULT 'manav2109',
        password TEXT NOT NULL DEFAULT 'manav@2109'
    )`);
  await run(`INSERT OR IGNORE INTO admin_credentials (id, username, password) VALUES (1, 'manav2109', 'manav@2109')`);
}

// ── Middleware ────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ─────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const creds = await get('SELECT * FROM admin_credentials WHERE id = 1');
    if (username === creds.username && password === creds.password) {
      res.json({ ok: true, username });
    } else {
      res.status(401).json({ ok: false, error: 'Incorrect username or password' });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/credentials', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    await run('UPDATE admin_credentials SET username = ?, password = ? WHERE id = 1', [username, password]);
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

    // 1. Save to database
    const result = await run(
      'INSERT INTO submissions (name, email, phone, project, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || '', project || '', message || '']
    );
    console.log(`📬 New submission #${result.lastID}: ${name} <${email}>`);

    // 2. Send email notification (non-blocking — won't break the form if email fails)
    sendNewInquiryEmail({ name, email, phone, project, message })
      .catch(err => console.error('⚠️  Email error:', err.message));

    res.json({ ok: true, id: result.lastID });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM submissions ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/submissions/export', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM submissions ORDER BY created_at DESC');
    res.setHeader('Content-Disposition', 'attachment; filename="submissions.json"');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/submissions/:id/read', async (req, res) => {
  try {
    await run('UPDATE submissions SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/submissions/:id', async (req, res) => {
  try {
    await run('DELETE FROM submissions WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/submissions', async (req, res) => {
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
    rows.forEach(r => { config[r.slot_id] = r.file_name; });
    res.json(config);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/videos', async (req, res) => {
  try {
    const { slot_id, file_name } = req.body;
    if (!slot_id || !file_name) return res.status(400).json({ error: 'Missing fields' });
    await run(
      'INSERT INTO video_config (slot_id, file_name) VALUES (?, ?) ON CONFLICT(slot_id) DO UPDATE SET file_name = excluded.file_name',
      [slot_id, file_name]
    );
    console.log(`🎥 Video updated: ${slot_id} → ${file_name}`);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    const emailStatus = emailReady() ? '✅ Email ON' : '⚠️  Email OFF (set GMAIL_PASS)';
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅  Server is running!                    ║');
    console.log('║                                            ║');
    console.log(`║  Portfolio : http://localhost:${PORT}         ║`);
    console.log(`║  Admin     : http://localhost:${PORT}/admin.html ║`);
    console.log('║                                            ║');
    console.log(`║  ${emailStatus.padEnd(42)}║`);
    console.log('║  Press CTRL+C to stop                      ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
