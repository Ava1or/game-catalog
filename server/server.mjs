// Свой сервер для «Каталога игр»: раздаёт веб-версию и обменивается данными с телефоном и другими компьютерами.
// Ничего устанавливать, кроме Node.js, не нужно. Запуск: двойной щелчок по «2. Запустить сервер.cmd».
// Данные лежат в папке data (db.json и картинки), настройки в config.json.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const STORES = ['games', 'collections', 'props', 'inboxLists', 'inboxItems', 'covers', 'shots'];
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/, okId = id => typeof id === 'string' && ID_RE.test(id);
const MAX_BODY = 40 * 1024 * 1024;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };

export function genToken() {
  const al = 'abcdefghjkmnpqrstuvwxyz23456789', b = crypto.randomBytes(10); let s = '';
  for (let i = 0; i < 10; i++) { s += al[b[i] % al.length]; if (i === 4) s += '-'; }
  return s;
}

export function lanAddresses() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) for (const n of list || []) if (n.family === 'IPv4' && !n.internal) out.push(n.address);
  const rank = a => /^192\.168\./.test(a) ? 0 : /^10\./.test(a) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(a) ? 2 : 3;
  return out.sort((a, b) => rank(a) - rank(b));
}

export function loadConfig(file) {
  let c = {};
  if (fs.existsSync(file)) { try { c = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); } catch (e) { throw new Error('Файл config.json повреждён (' + e.message + '). Удалите его, при следующем запуске он создастся заново.'); } }
  const before = JSON.stringify(c);
  c.port = +c.port || 8787; c.token = c.token || genToken(); c.igdbClientId = c.igdbClientId || ''; c.igdbClientSecret = c.igdbClientSecret || '';
  if (JSON.stringify(c) !== before) fs.writeFileSync(file, JSON.stringify(c, null, 2) + '\n');
  return c;
}

const mergeDict = (loc, rem) => { // true, если что-то добавилось
  let ch = false;
  Object.keys(rem || {}).forEach(k => {
    const r = rem[k] || {}, l = loc[k];
    if (!l) { loc[k] = { long: String(r.long || ''), aliases: Array.isArray(r.aliases) ? r.aliases.map(String) : [] }; ch = true; return; }
    if (!l.long && r.long) { l.long = String(r.long); ch = true; }
    (Array.isArray(r.aliases) ? r.aliases : []).forEach(a => { l.aliases = l.aliases || []; if (!l.aliases.includes(String(a))) { l.aliases.push(String(a)); ch = true; } });
  });
  return ch;
};
const parseData = d => { const m = /^data:([^;,]+);base64,([\s\S]*)$/.exec(String(d || '')); if (!m) return null; return { mime: /^image\/[a-z0-9.+-]+$/i.test(m[1]) ? m[1] : 'image/jpeg', buf: Buffer.from(m[2], 'base64') }; };

export function createServer(opts) {
  const { cfg, wwwDir, dataDir } = opts, log = opts.log || (() => {});
  const dbFile = path.join(dataDir, 'db.json'), blobDir = path.join(dataDir, 'blobs'), backDir = path.join(dataDir, 'backup');
  fs.mkdirSync(blobDir, { recursive: true }); fs.mkdirSync(backDir, { recursive: true });
  let db = { v: 1, items: {}, tombs: {}, dicts: { plat: {}, genre: {} } };
  if (fs.existsSync(dbFile)) { try { db = JSON.parse(fs.readFileSync(dbFile, 'utf8')); } catch (e) { fs.copyFileSync(dbFile, dbFile + '.broken-' + Date.now()); log('db.json повреждён, он сохранён как .broken, начинаем с чистой базы'); } }
  db.rev = +db.rev || 0; db.items = db.items || {}; db.tombs = db.tombs || {}; db.dicts = db.dicts || { plat: {}, genre: {} };
  STORES.forEach(s => { db.items[s] = db.items[s] || {}; db.tombs[s] = db.tombs[s] || {}; });

  // ---- сохранение: не чаще раза в полсекунды, через временный файл, чтобы не потерять данные при сбое ----
  let timer = null;
  const flush = () => { // при сбое (например, файл на секунду занят антивирусом) пробуем снова, сервер не падает
    clearTimeout(timer); timer = null;
    try { const tmp = dbFile + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(db)); fs.renameSync(tmp, dbFile); }
    catch (e) { log('Не удалось сохранить базу: ' + e.message + '. Повторим через 5 секунд.'); timer = setTimeout(flush, 5000); }
  };
  const dirty = () => { db.rev++; if (!timer) timer = setTimeout(flush, 400); }; // rev растёт при любом изменении: по нему устройства понимают, что сверяться не нужно
  const backup = () => { // раз в сутки копия db.json, хранятся последние 14
    try {
      if (!fs.existsSync(dbFile)) return;
      const d = new Date(), name = 'db-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '.json', f = path.join(backDir, name);
      if (!fs.existsSync(f)) fs.copyFileSync(dbFile, f);
      fs.readdirSync(backDir).filter(x => /^db-\d{8}\.json$/.test(x)).sort().slice(0, -14).forEach(x => fs.unlinkSync(path.join(backDir, x)));
    } catch (e) { log('Не удалось сделать копию: ' + e.message); }
  };
  backup(); const bt = setInterval(backup, 6 * 3600 * 1000); bt.unref();

  // ---- файлы картинок ----
  const coverFile = id => path.join(blobDir, 'covers', id);
  const shotDir = gid => path.join(blobDir, 'shots', gid);
  const shotFile = (gid, n) => path.join(shotDir(gid), n);
  const rm = p => { try { fs.rmSync(p, { recursive: true, force: true }); } catch (e) { /* ignore */ } };
  fs.mkdirSync(path.join(blobDir, 'covers'), { recursive: true }); fs.mkdirSync(path.join(blobDir, 'shots'), { recursive: true });
  const shotMissing = rec => (rec.list || []).map(x => x.n).filter(n => !fs.existsSync(shotFile(rec.id, n)));

  const ver = (s, id) => { const it = db.items[s][id]; return it && (s !== 'shots' || it.ready) ? it.mod : 0; };
  function applyDelete(s, id, t) {
    delete db.items[s][id]; db.tombs[s][id] = t;
    if (s === 'covers') rm(coverFile(id)); if (s === 'shots') rm(shotDir(id));
    dirty();
  }

  function manifest(body) {
    const pull = {}, push = {}, del = {};
    for (const s of STORES) {
      const cI = (body.items || {})[s] || {}, cT = (body.tombs || {})[s] || {}, sT = db.tombs[s];
      pull[s] = []; push[s] = []; del[s] = {};
      const ids = new Set([...Object.keys(cI), ...Object.keys(cT), ...Object.keys(db.items[s]), ...Object.keys(sT)]);
      for (const id of ids) {
        if (!okId(id)) continue;
        const cm = +cI[id] || 0, ct = +cT[id] || 0, sm = ver(s, id), st = sT[id] || 0;
        const cAlive = cm > ct, sAlive = sm > st, cv = Math.max(cm, ct), sv = Math.max(sm, st);
        if (cv > sv) { if (cAlive) push[s].push(id); else applyDelete(s, id, ct); }
        else if (sv > cv) { if (sAlive) pull[s].push(id); else del[s][id] = st; }
        else if (cAlive !== sAlive) { if (cAlive) del[s][id] = st; else applyDelete(s, id, ct); } // одинаковое время: удаление главнее
      }
    }
    return { pull, push, del };
  }

  function putRecs(s, recs) {
    const need = {};
    for (const r of Array.isArray(recs) ? recs : []) {
      if (!r || !okId(r.id)) continue;
      const mod = +r.mod || 0; if (mod < 1) continue;
      if (mod <= Math.max(ver(s, r.id), db.tombs[s][r.id] || 0)) continue; // у сервера уже не старее
      if (s === 'covers') {
        const d = parseData(r.data); if (!d || !d.buf.length) continue;
        fs.writeFileSync(coverFile(r.id), d.buf); db.items.covers[r.id] = { id: r.id, mod, mime: d.mime };
      } else if (s === 'shots') {
        const list = (Array.isArray(r.list) ? r.list : []).filter(x => x && okId(x.n)).map(x => ({ n: x.n, src: String(x.src || '').slice(0, 2000) })), rec = { id: r.id, mod, list, ready: false };
        fs.mkdirSync(shotDir(r.id), { recursive: true });
        try { fs.readdirSync(shotDir(r.id)).filter(f => !list.some(x => x.n === f)).forEach(f => rm(path.join(shotDir(r.id), f))); } catch (e) { /* ignore */ }
        const miss = shotMissing(rec); rec.ready = !miss.length; db.items.shots[r.id] = rec; if (miss.length) need[r.id] = miss;
      } else {
        if (typeof r !== 'object') continue; db.items[s][r.id] = Object.assign({}, r, { mod });
      }
      delete db.tombs[s][r.id]; dirty();
    }
    return need;
  }

  function getRecs(s, ids) {
    const recs = [];
    for (const id of (Array.isArray(ids) ? ids : []).slice(0, 500)) {
      if (!okId(id) || !db.items[s][id]) continue;
      const it = db.items[s][id];
      if (s === 'covers') { try { recs.push({ id, mod: it.mod, data: 'data:' + (it.mime || 'image/jpeg') + ';base64,' + fs.readFileSync(coverFile(id)).toString('base64') }); } catch (e) { /* файла нет */ } }
      else if (s === 'shots') { if (it.ready) recs.push({ id, mod: it.mod, list: it.list }); }
      else recs.push(it);
    }
    return recs;
  }

  // ---- IGDB: ключи хранятся в config.json на этом компьютере ----
  let tok = null, tokExp = 0;
  async function igdbToken() {
    if (tok && Date.now() < tokExp) return tok;
    const r = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + encodeURIComponent(cfg.igdbClientId) + '&client_secret=' + encodeURIComponent(cfg.igdbClientSecret) + '&grant_type=client_credentials', { method: 'POST' });
    if (!r.ok) throw new Error('Twitch ответил ' + r.status + ' (проверьте ключи IGDB в config.json)');
    const j = await r.json(); tok = j.access_token; tokExp = Date.now() + (j.expires_in - 600) * 1000; return tok;
  }

  // ---- защита от подбора кода ----
  const fails = new Map(), tokHash = s => crypto.createHash('sha256').update(String(s)).digest();
  const goodTok = t => crypto.timingSafeEqual(tokHash(t || ''), tokHash(cfg.token));
  const blocked = ip => { const f = fails.get(ip); return !!f && f.n >= 10 && Date.now() - f.t < 10 * 60000; };
  const fail = ip => { const f = fails.get(ip); if (!f || Date.now() - f.t > 10 * 60000) fails.set(ip, { n: 1, t: Date.now() }); else { f.n++; f.t = Date.now(); } };

  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Token', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Private-Network': 'true', 'Access-Control-Max-Age': '600' };
  const send = (res, code, obj) => { const b = Buffer.from(JSON.stringify(obj)); res.writeHead(code, { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': b.length }); res.end(b); };
  const readBody = req => new Promise((ok, no) => {
    const ch = []; let n = 0;
    req.on('data', c => { n += c.length; if (n > MAX_BODY) { no(Object.assign(new Error('too big'), { code: 413 })); req.destroy(); } else ch.push(c); });
    req.on('end', () => ok(Buffer.concat(ch))); req.on('error', no);
  });

  async function api(req, res, name) {
    const ip = req.socket.remoteAddress || '';
    if (name === 'hello') return send(res, 200, { app: 'game-catalog-server', v: 1, now: Date.now(), rev: db.rev, igdb: !!(cfg.igdbClientId && cfg.igdbClientSecret) });
    if (blocked(ip)) return send(res, 429, { error: 'too many attempts' });
    if (!goodTok(req.headers['x-token'])) { fail(ip); return send(res, 401, { error: 'bad token' }); }
    let body = {}; const raw = await readBody(req); if (raw.length) { try { body = JSON.parse(raw.toString('utf8')); } catch (e) { return send(res, 400, { error: 'bad json' }); } }
    const store = STORES.includes(body.store) ? body.store : '';
    switch (name) {
      case 'check': return send(res, 200, { ok: true, now: Date.now(), igdb: !!(cfg.igdbClientId && cfg.igdbClientSecret), games: Object.keys(db.items.games).length });
      case 'manifest': return send(res, 200, manifest(body));
      case 'get': return store ? send(res, 200, { recs: getRecs(store, body.ids) }) : send(res, 400, { error: 'store' });
      case 'put': return store ? send(res, 200, { need: putRecs(store, body.recs) }) : send(res, 400, { error: 'store' });
      case 'shotblob': { if (!okId(body.gid) || !okId(body.n)) return send(res, 400, { error: 'id' }); try { return send(res, 200, { data: 'data:image/jpeg;base64,' + fs.readFileSync(shotFile(body.gid, body.n)).toString('base64') }); } catch (e) { return send(res, 200, { data: null }); } }
      case 'shotblob_put': {
        const rec = okId(body.gid) && db.items.shots[body.gid], d = parseData(body.data);
        if (!rec || !okId(body.n) || !d || !rec.list.some(x => x.n === body.n)) return send(res, 400, { error: 'shot' });
        fs.mkdirSync(shotDir(body.gid), { recursive: true }); fs.writeFileSync(shotFile(body.gid, body.n), d.buf);
        if (!rec.ready && !shotMissing(rec).length) { rec.ready = true; dirty(); }
        return send(res, 200, { ok: true });
      }
      case 'dicts': { const a = mergeDict(db.dicts.plat, body.plat), b = mergeDict(db.dicts.genre, body.genre); if (a || b) dirty(); return send(res, 200, db.dicts); }
      default: return send(res, 404, { error: 'unknown' });
    }
  }

  async function igdbProxy(req, res, rest) {
    if (blocked(req.socket.remoteAddress)) return send(res, 429, { error: 'too many attempts' });
    if (!goodTok(req.headers['x-token'])) { fail(req.socket.remoteAddress); return send(res, 401, { error: 'bad token' }); }
    if (!cfg.igdbClientId || !cfg.igdbClientSecret) return send(res, 501, { error: 'Ключи IGDB не указаны в config.json на сервере' });
    try {
      const raw = await readBody(req);
      const r = await fetch('https://api.igdb.com/v4' + rest, { method: 'POST', headers: { 'Client-ID': cfg.igdbClientId, Authorization: 'Bearer ' + await igdbToken(), 'Content-Type': 'text/plain' }, body: raw });
      const b = Buffer.from(await r.arrayBuffer()); res.writeHead(r.status, { ...cors, 'Content-Type': r.headers.get('content-type') || 'application/json' }); res.end(b);
    } catch (e) { send(res, 502, { error: String(e.message || e) }); }
  }

  const zcache = new Map();
  function serveStatic(req, res, url) {
    let p = decodeURIComponent(url.pathname); if (p.endsWith('/')) p += 'index.html';
    const f = path.normalize(path.join(wwwDir, p));
    if (!f.startsWith(path.normalize(wwwDir + path.sep)) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Не найдено'); }
    const ext = path.extname(f).toLowerCase(), st = fs.statSync(f), isSw = path.basename(f) === 'sw.js';
    let ent = zcache.get(f);
    if (!ent || ent.m !== st.mtimeMs || isSw) { // sw.js зависит от времени правки других файлов, поэтому его собираем заново
      let data = fs.readFileSync(f);
      if (isSw) { const build = Math.floor(Math.max(...['app.js', 'sw.js', 'style.css', 'index.html', 'guide.html'].map(x => { try { return fs.statSync(path.join(wwwDir, x)).mtimeMs; } catch (e) { return 0; } })) / 1000).toString(36); data = Buffer.from(data.toString('utf8').replace(/__BUILD__/g, build)); }
      ent = { m: st.mtimeMs, raw: data, gz: /^\.(html|js|css|json|svg|webmanifest|txt)$/.test(ext) && data.length > 1024 ? zlib.gzipSync(data) : null }; zcache.set(f, ent);
    }
    const useGz = ent.gz && /\bgzip\b/.test(req.headers['accept-encoding'] || ''), body = useGz ? ent.gz : ent.raw;
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Vary': 'Accept-Encoding', ...(useGz ? { 'Content-Encoding': 'gzip' } : {}) });
    res.end(body);
  }

  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
      const url = new URL(req.url, 'http://x');
      if (url.pathname.startsWith('/api/') && req.method === 'POST') return await api(req, res, url.pathname.slice(5));
      if (url.pathname.startsWith('/igdb/') && req.method === 'POST') return await igdbProxy(req, res, url.pathname.slice(5) + url.search);
      if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res, url);
      send(res, 405, { error: 'method' });
    } catch (e) {
      if (!res.headersSent) send(res, e && e.code === 413 ? 413 : 500, { error: String((e && e.message) || e) });
    }
  });
  server.flush = flush;
  server.db = db;
  return server;
}

// ---------- запуск ----------
const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  if (+process.versions.node.split('.')[0] < 18) { console.error('\n  Нужен Node.js версии 18 или новее (у вас ' + process.versions.node + '). Установите свежую версию: nodejs.org, кнопка LTS.\n'); process.exit(1); }
  const ROOT = path.dirname(fileURLToPath(import.meta.url));
  let cfg;
  try { cfg = loadConfig(path.join(ROOT, 'config.json')); } catch (e) { console.error('\n  ОШИБКА: ' + e.message + '\n'); process.exit(1); }
  const addrs = lanAddresses(), line = '  ' + '='.repeat(58);
  const show = () => {
    console.log('\n' + line + '\n   КАТАЛОГ ИГР: ваш сервер\n' + line);
    console.log('\n   Адрес для телефона и других компьютеров (введите в приложении):');
    (addrs.length ? addrs : ['(не найден: подключите компьютер к Wi-Fi или кабелю)']).forEach(a => console.log('       ' + (/^\d/.test(a) ? 'http://' + a + ':' + cfg.port : a)));
    console.log('\n   Код доступа:  ' + cfg.token);
    console.log('\n   На этом компьютере откройте:  http://localhost:' + cfg.port + '\n' + line + '\n');
  };
  if (process.argv.includes('--info')) { show(); process.exit(0); }
  const server = createServer({ cfg, wwwDir: path.join(ROOT, 'www'), dataDir: path.join(ROOT, 'data'), log: m => console.log('  ' + m) });
  server.on('error', e => {
    if (e.code === 'EADDRINUSE') console.error('\n  ОШИБКА: порт ' + cfg.port + ' уже занят. Скорее всего, сервер уже запущен в другом окне.\n  Закройте то окно или поменяйте "port" в файле config.json.\n');
    else console.error('\n  ОШИБКА: ' + e.message + '\n');
    process.exit(1);
  });
  server.listen(cfg.port, '0.0.0.0', () => { show(); console.log('   Сервер работает. Не закрывайте это окно, пока пользуетесь синхронизацией.\n   Остановить: закройте окно или нажмите Ctrl+C.\n'); });
  const bye = () => { try { server.flush(); } catch (e) { /* ignore */ } process.exit(0); };
  process.on('SIGINT', bye); process.on('SIGTERM', bye);
}
