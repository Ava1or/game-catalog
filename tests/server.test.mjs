import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from '../server/server.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gcs-')), www = path.join(tmp, 'www');
fs.mkdirSync(www); fs.writeFileSync(path.join(www, 'index.html'), '<p>hi</p>'); fs.writeFileSync(path.join(www, 'sw.js'), "const C='gc-__BUILD__';");
const cfg = { port: 0, token: 'abcde-fghjk', igdbClientId: '', igdbClientSecret: '' };
const srv = createServer({ cfg, wwwDir: www, dataDir: path.join(tmp, 'data') });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + srv.address().port;
const call = async (name, body, tok = cfg.token) => { const r = await fetch(base + '/api/' + name, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Token': tok }, body: JSON.stringify(body || {}) }); return { status: r.status, json: await r.json() }; };
const empty = () => Object.fromEntries(['games', 'collections', 'props', 'inboxLists', 'inboxItems', 'covers', 'shots'].map(s => [s, {}]));
const man = (items, tombs) => call('manifest', { items: Object.assign(empty(), items), tombs: Object.assign(empty(), tombs) }).then(r => r.json);
const jpg = 'data:image/jpeg;base64,' + Buffer.from('JPEGDATA').toString('base64');

test('hello открыт, остальное требует код', async () => {
  const h = await fetch(base + '/api/hello', { method: 'POST' }).then(r => r.json());
  assert.equal(h.app, 'game-catalog-server');
  assert.equal((await call('check', {}, 'wrong')).status, 401);
  assert.equal((await call('check')).status, 200);
});

test('статические файлы и подмена __BUILD__, без выхода из папки', async () => {
  assert.match(await fetch(base + '/').then(r => r.text()), /hi/);
  assert.doesNotMatch(await fetch(base + '/sw.js').then(r => r.text()), /__BUILD__/);
  assert.equal((await fetch(base + '/..%2f..%2fetc%2fpasswd')).status, 404);
});

test('игра: отправка, получение, более поздняя правка побеждает', async () => {
  let m = await man({ games: { g1: 5 } });
  assert.deepEqual(m.push.games, ['g1']);
  await call('put', { store: 'games', recs: [{ id: 'g1', name: 'A', mod: 5 }] });
  m = await man({ games: { g1: 5 } }); assert.deepEqual([m.push.games, m.pull.games], [[], []]);
  m = await man({ games: {} }); assert.deepEqual(m.pull.games, ['g1']);
  assert.equal((await call('get', { store: 'games', ids: ['g1'] })).json.recs[0].name, 'A');
  await call('put', { store: 'games', recs: [{ id: 'g1', name: 'OLD', mod: 3 }] }); // старее: игнорируется
  assert.equal((await call('get', { store: 'games', ids: ['g1'] })).json.recs[0].name, 'A');
  m = await man({ games: { g1: 9 } }); assert.deepEqual(m.push.games, ['g1']);
  await call('put', { store: 'games', recs: [{ id: 'g1', name: 'B', mod: 9 }] });
  m = await man({ games: { g1: 5 } }); assert.deepEqual(m.pull.games, ['g1']);
});

test('удаление доходит до других устройств, воскрешение более поздней правкой', async () => {
  await call('put', { store: 'collections', recs: [{ id: 'c1', name: 'C', mod: 10 }] });
  let m = await man({}, { collections: { c1: 20 } }); // устройство удалило позже
  assert.deepEqual(m.pull.collections, []);
  m = await man({ collections: { c1: 10 } }); assert.deepEqual(m.del.collections, { c1: 20 }); // другое устройство узнаёт об удалении
  m = await man({ collections: { c1: 30 } }); assert.deepEqual(m.push.collections, ['c1']); // но правка позже удаления возвращает запись
  await call('put', { store: 'collections', recs: [{ id: 'c1', name: 'C2', mod: 30 }] });
  m = await man({}, { collections: { c1: 20 } }); assert.deepEqual(m.pull.collections, ['c1']);
});

test('обложки передаются целиком', async () => {
  await call('put', { store: 'covers', recs: [{ id: 'g1', mod: 7, data: jpg }] });
  const r = (await call('get', { store: 'covers', ids: ['g1'] })).json.recs[0];
  assert.equal(r.data, jpg); assert.equal(r.mod, 7);
});

test('скриншоты видны другим только когда загружены все картинки', async () => {
  const res = await call('put', { store: 'shots', recs: [{ id: 'g1', mod: 8, list: [{ n: 's1', src: 'u1' }, { n: 's2', src: 'u2' }] }] });
  assert.deepEqual(res.json.need, { g1: ['s1', 's2'] });
  assert.deepEqual((await man({})).pull.shots, []); // ещё не готово
  assert.deepEqual((await man({ shots: { g1: 8 } })).push.shots, ['g1']); // загрузка может продолжиться
  await call('shotblob_put', { gid: 'g1', n: 's1', data: jpg });
  assert.deepEqual((await man({})).pull.shots, []);
  await call('shotblob_put', { gid: 'g1', n: 's2', data: jpg });
  assert.deepEqual((await man({})).pull.shots, ['g1']);
  assert.equal((await call('shotblob', { gid: 'g1', n: 's2' })).json.data, jpg);
  assert.equal((await call('get', { store: 'shots', ids: ['g1'] })).json.recs[0].list.length, 2);
});

test('rev растёт при изменениях, статика сжимается', async () => {
  const r1 = (await fetch(base + '/api/hello', { method: 'POST' }).then(r => r.json())).rev;
  await call('put', { store: 'games', recs: [{ id: 'g9', name: 'N', mod: 50 }] });
  const r2 = (await fetch(base + '/api/hello', { method: 'POST' }).then(r => r.json())).rev;
  assert.ok(r2 > r1);
  await call('manifest', { items: empty(), tombs: empty() }); // чтение rev не меняет
  assert.equal((await fetch(base + '/api/hello', { method: 'POST' }).then(r => r.json())).rev, r2);
  fs.writeFileSync(path.join(www, 'big.js'), 'x'.repeat(5000));
  const res = await fetch(base + '/big.js', { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(res.headers.get('content-encoding'), 'gzip'); assert.equal((await res.text()).length, 5000);
});

test('небезопасные id отклоняются', async () => {
  await call('put', { store: 'games', recs: [{ id: '../x', mod: 5, name: 'bad' }] });
  assert.equal((await call('get', { store: 'games', ids: ['../x'] })).json.recs.length, 0);
  assert.equal((await call('shotblob', { gid: '..', n: 'x' })).status, 400);
});

test('общие списки объединяются', async () => {
  await call('dicts', { plat: { PS4: { long: 'PlayStation 4', aliases: ['PS 4'] } }, genre: {} });
  const d = (await call('dicts', { plat: { PS4: { long: '', aliases: ['Playstation4'] } }, genre: { RPG: { long: '', aliases: [] } } })).json;
  assert.deepEqual(d.plat.PS4.aliases.sort(), ['PS 4', 'Playstation4']); assert.ok(d.genre.RPG);
});

test('данные сохраняются на диск и читаются после перезапуска', async () => {
  srv.flush();
  const again = createServer({ cfg, wwwDir: www, dataDir: path.join(tmp, 'data') });
  assert.equal(Object.keys(again.db.items.games).length, Object.keys(srv.db.items.games).length);
  assert.equal(again.db.rev, srv.db.rev);
  assert.ok(again.db.items.covers.g1);
});

test('после 10 неверных кодов доступ закрывается', async () => {
  for (let i = 0; i < 10; i++) await call('check', {}, 'bad' + i);
  assert.equal((await call('check')).status, 429);
  srv.close(); srv.closeAllConnections && srv.closeAllConnections();
});
