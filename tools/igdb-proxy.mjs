// Прокси IGDB для веб-версии (браузер не может обращаться к IGDB напрямую).
// Запуск (Node 18+):
//   IGDB_CLIENT_ID=... IGDB_CLIENT_SECRET=... ALLOWED_ORIGIN=https://ИМЯ.github.io node tools/igdb-proxy.mjs
// В настройках приложения укажите адрес прокси: http://localhost:8787
// ALLOWED_ORIGIN - только адрес сайта без пути и без «/» в конце, строчными буквами (так браузер шлёт заголовок Origin).
import http from 'node:http';

const ID = process.env.IGDB_CLIENT_ID, SECRET = process.env.IGDB_CLIENT_SECRET, PORT = +process.env.PORT || 8787;
const ORIGINS = (process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim().replace(/\/+$/, '').toLowerCase()).filter(Boolean);
if (!ID || !SECRET || !ORIGINS.length) { console.error('Задайте IGDB_CLIENT_ID, IGDB_CLIENT_SECRET и ALLOWED_ORIGIN'); process.exit(1); }

let tok = null, exp = 0;
async function token() {
  if (tok && Date.now() < exp) return tok;
  const r = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${ID}&client_secret=${SECRET}&grant_type=client_credentials`, { method: 'POST' });
  if (!r.ok) throw new Error('Twitch ответил ' + r.status);
  const j = await r.json(); tok = j.access_token; exp = Date.now() + (j.expires_in - 600) * 1000; return tok;
}

http.createServer(async (req, res) => {
  const origin = (req.headers.origin || '').toLowerCase(), ok = ORIGINS.includes(origin);
  const cors = { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Private-Network': 'true', Vary: 'Origin' };
  if (req.method === 'OPTIONS') { res.writeHead(ok ? 204 : 403, ok ? cors : {}); return res.end(); }
  if (!ok || req.method !== 'POST') { res.writeHead(403, { 'Content-Type': 'text/plain' }); return res.end('forbidden'); }
  try {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await fetch('https://api.igdb.com/v4' + req.url, { method: 'POST', headers: { 'Client-ID': ID, Authorization: 'Bearer ' + await token(), 'Content-Type': 'text/plain' }, body: Buffer.concat(chunks) });
    res.writeHead(r.status, { ...cors, 'Content-Type': r.headers.get('content-type') || 'application/json' });
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch (e) { res.writeHead(502, { ...cors, 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: String(e.message || e) })); }
}).listen(PORT, '127.0.0.1', () => console.log('Прокси IGDB: http://localhost:' + PORT));
