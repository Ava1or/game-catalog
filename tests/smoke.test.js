// Запуск: node --test tests/smoke.test.js (подставные DOM и IndexedDB)
const stores = {};
global.indexedDB = { open() { const r = {}; setTimeout(() => { r.result = {
  objectStoreNames: { contains: () => false },
  createObjectStore(n) { stores[n] = new Map(); },
  transaction(names) { const t = {}; t.objectStore = n => { const st = stores[n]; const mk = res => { const q = {}; setTimeout(() => { q.result = res(); t.oncomplete && t.oncomplete(); }); return q; };
    return { getAll: () => mk(() => [...st.values()]), get: k => mk(() => st.get(k)), put: v => mk(() => { st.set(v.id !== undefined ? v.id : v.key, v); }), delete: k => mk(() => { st.delete(k); }), clear: () => mk(() => st.clear()) }; }; return t; } };
  r.onupgradeneeded && r.onupgradeneeded(); r.onsuccess && r.onsuccess(); }); return r; } };
const els = {};
const mkEl = (key) => { const e = { _k: key, innerHTML: '', value: '', style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} }, children: [], firstChild: {},
  querySelector(s) { return mkEl((key||'') + '>' + s); }, querySelectorAll() { return []; }, appendChild(c) { this.children.push(c); }, remove() {}, setAttribute() {}, focus() {}, click() {}, closest() { return null; } }; return e; };
const cache = {};
global.document = { documentElement: mkEl('html'), addEventListener() {}, createElement() { return mkEl('new'); }, querySelector(s) { return cache[s] || (cache[s] = mkEl(s)); }, querySelectorAll() { return []; }, body: mkEl('body') };
global.window = global; global.addEventListener = () => {}; global.navigator = {}; global.URL = Object.assign(URL, { createObjectURL: () => 'blob:x', revokeObjectURL() {} });
global.setTimeout = setTimeout;
global.Blob = Blob;
global.__gateMs = 0;
const FNV = { id: 1, name: 'Fallout: New Vegas', first_release_date: Date.UTC(2010, 9, 19) / 1000, total_rating: 86, summary: 'desc', genres: [{ name: 'RPG' }], platforms: [{ name: 'PC (Microsoft Windows)' }], cover: { image_id: 'abc' }, collections: [{ id: 77, name: 'Fallout' }] };
const igdbData = (ep, body) => {
  if (ep === '/game_time_to_beats') { const ids = (body.match(/\d+/g) || []).map(Number); return ids.map(i => ({ game_id: i, normally: (i === 1 ? 30 : 10) * 3600 })); }
  if (ep === '/games/count') return { count: body.includes('collections') ? 2 : 120 };
  if (ep === '/genres') return [{ id: 5, name: 'RPG' }];
  if (ep === '/platforms') return [{ id: 6, name: 'PC (Microsoft Windows)' }];
  if (ep === '/screenshots') return [{ image_id: 's1' }, { image_id: 's2' }];
  if (body.includes('collections = (')) return [{ id: 2, name: 'Fallout 4' }, { id: 3, name: 'Fallout 3' }];
  if (/where id = \d+/.test(body)) return [FNV];
  return Array.from({ length: 40 }, (_, i) => ({ id: 100 + i, name: 'Fallout ' + i, first_release_date: Date.UTC(2000, 0, 1) / 1000, total_rating: 80, platforms: [{ name: 'PlayStation 4' }], genres: [{ name: 'RPG' }], cover: { image_id: 'x' + i } }));
};
global.fetch = async (u, o) => { const p = String(u); if (p.includes('images.igdb.com')) return { ok: false };
  if (p.includes('steamgriddb')) { if (p.includes('autocomplete')) return { ok: true, status: 200, json: async () => ({ success: true, data: [{ id: 7, name: 'Fallout NV' }] }) }; return { ok: true, status: 200, json: async () => ({ success: true, data: [{ url: 'https://cdn/x.png', thumb: 'https://cdn/t.png', score: 5, width: 600, height: 900 }] }) }; }
  if (p.includes('id.twitch.tv')) return { ok: true, status: 200, json: async () => ({ access_token: 'TOKEN', expires_in: 3600 }) };
  if (global.__BADKEY && p.includes('api.igdb.com')) return { ok: false, status: 401, text: async () => 'Unauthorized' };
  if (p.includes('api.rawg.io')) { const path = new URL(p).pathname.replace('/api', '');
    const RG = { id: 500, name: 'Rawg Game', slug: 'rawg-game', released: '2015-05-01', rating: 4, playtime: 12, background_image: 'https://media.rawg.io/media/games/x.jpg', description_raw: 'rawg desc', platforms: [{ platform: { name: 'PC' } }], genres: [{ name: 'RPG' }] };
    const data = path === '/games' ? { count: 1, next: null, results: [RG] } : path === '/games/500' ? RG : path.endsWith('/game-series') ? { count: 0, results: [] } : path.endsWith('/screenshots') ? { results: [{ image: 'https://media.rawg.io/media/screenshots/a.jpg' }] } : path === '/genres' ? { results: [{ id: 4, name: 'Action' }] } : path.includes('platforms') ? { results: [{ platforms: [{ id: 4, name: 'PC' }] }] } : {};
    return { ok: true, status: 200, json: async () => data, clone() { return this; }, text: async () => '' }; }
  (global.__bodies = global.__bodies || []).push(String(o && o.body || ''));
  return { ok: true, status: 200, json: async () => igdbData(p.replace('https://api.igdb.com/v4', ''), String(o && o.body || '')) }; };
global.createImageBitmap = async () => { throw new Error('no'); };
const L = require('../www/app.js');
(async () => {
  await new Promise(r => setTimeout(r, 100));
  const G = global.__GC; const S = G.S;
  const fail = (m, e) => { console.log('FAIL', m, e && e.stack || e); process.exitCode = 1; };
  const step = async (m, fn) => { try { await fn(); console.log('ok', m); } catch (e) { fail(m, e); } };
  await G.loadAll();
  S.set.igdbId = 'ID'; S.set.igdbSecret = 'SEC';
  await step('render all tabs', () => { for (const t of ['library', 'collections', 'series', 'search', 'settings']) { S.tab = t; G.render(); } });
  await step('search run', async () => { S.tab = 'search'; S.search.q = 'fallout'; await G.runSearch(true); if (S.search.results.length !== 40) throw new Error('results ' + S.search.results.length); await G.runSearch(false); if (S.search.results.length !== 80) throw new Error('page2 ' + S.search.results.length); });
  await step('open igdb sheet', () => G.openIgdbSheet('igdb:100'));
  await step('add from igdb', async () => { const g = await G.addFromIgdb('igdb:1', []); if (!g || g.series !== 'Fallout') throw new Error('series=' + (g && g.series)); });
  await step('quick add + render', async () => { await G.addFromIgdb('igdb:101'); G.renderSearchBody(); });
  await step('collections + library', async () => { S.collections.push({ id: 'c1', name: 'Любимые' }); S.games[0].collections.push('c1'); S.tab = 'collections'; G.render(); S.tab = 'library'; G.render(); G.ACT.collChip({ dataset: { id: 'c1' } }); G.ACT.openFilters(); G.ACT.openCols(); G.ACT.toggleView(); G.ACT.fToggle({ dataset: { k: 'genres', v: 'RPG' } }); G.ACT.rmF({ dataset: { k: 'genres', v: 'RPG' } }); G.ACT.resetF(); });
  await step('series tab', async () => { S.tab = 'series'; G.render(); G.ACT.serOpen({ dataset: { name: 'Fallout' } }); if (S.tab !== 'library' || S.set.f.series[0] !== 'Fallout') throw new Error('serOpen'); G.ACT.serOpen({ dataset: { name: '' } }); G.render(); });
  await step('igdb sheet with shots + colls', async () => { S.tab = 'search'; await G.openIgdbSheet('igdb:1'); });
  await step('inbox flow', async () => {
    const l = { id: 'l1', name: 'Steam', created: 1 }; S.inbox.lists.push(l);
    const n = await G.addItems('l1', ['1. Fallout New Vegas', '- Half-Life', 'Half-Life', '']); if (n !== 2) throw new Error('addItems ' + n);
    S.tab = 'inbox'; G.render(); S.inboxList = 'l1'; G.render();
    const html = G.viewInbox(); if (!html.includes('Fallout New Vegas')) throw new Error('no item');
    G.ACT.itOpen({ dataset: { id: S.inbox.items[0].id } }); if (S.tab !== 'search' || !G.pendingItem()) throw new Error('pending');
    G.render(); await G.addFromIgdb('igdb:1'); await G.ACT.rsLink({ dataset: { rid: 'igdb:1' } });
    if (!S.inbox.items[0].done || S.tab !== 'inbox') throw new Error('link ' + S.inbox.items[0].done + S.tab);
    G.render(); G.ACT.itOpen({ dataset: { id: S.inbox.items[0].id } });
  });
  await step('done flag + shots', async () => {
    S.rs = { rid: 'igdb:1', colls: [] }; await G.ACT.rsChip({ dataset: { id: G.DONE_ID } }); const g = S.games.find(x => x.igdbId === 1); if (!g || !g.done) throw new Error('done not set');
    S.tab = 'library'; S.set.view = 'grid'; G.render(); S.set.view = 'list'; G.render(); S.set.view = 'grid';
    G.ACT.setDone({ dataset: { v: 'yes' } }); G.ACT.setDone({ dataset: { v: 'no' } }); G.ACT.setDone({ dataset: { v: '' } });
    G.openGameSheet(g.id); G.ACT.shDone({ dataset: {}, classList: { toggle() {} } }); await G.ACT.loadShots({ dataset: { rid: 'igdb:1' } });
    G.openFilters(); G.openCols();
  });
  await step('counter + key block + theme + zoom + rating', async () => {
    const before = S.set.usage.igdb; await G.igdb('/genres', 'fields id; limit 1;'); if (S.set.usage.igdb !== before + 1) throw new Error('counter');
    global.__BADKEY = true; let msg = ''; try { await G.igdb('/games', 'fields id; limit 1;'); } catch (e) { msg = e.message; } global.__BADKEY = false;
    if (!S.block || S.block.type !== 'key' || !msg.includes('не принят')) throw new Error('block ' + msg);
    let blocked = false; try { await G.igdb('/genres', 'fields id; limit 1;'); } catch (e) { blocked = e.message === S.block.text; } if (!blocked) throw new Error('not blocked');
    S.tab = 'search'; G.render(); G.ACT.unblock(); if (S.block) throw new Error('unblock');
    S.set.theme = 'light'; G.applyTheme(); G.ACT.setTheme({ dataset: { v: 'dark' } }); G.ACT.setTheme({ dataset: { v: 'auto' } });
    S.tab = 'library'; G.render(); const c0 = G.colsFor('grid'); G.ACT.zoom({ dataset: { k: 'grid' } }); if (G.colsFor('grid') === c0) throw new Error('zoom'); G.ACT.zoom({ dataset: { k: 'coll' } }); G.ACT.zoom({ dataset: { k: 'series' } }); G.ACT.zoom({ dataset: { k: 'search' } });
    G.ACT.setMinRating({ dataset: { v: '8' } }); G.render(); G.ACT.setMinRating({ dataset: { v: '0' } });
    S.tab = 'settings'; G.render(); if (!G.usageHtml().includes('4 запроса в секунду')) throw new Error('usage');
    S.set.sgdbKey = 'K'; const g = S.games[0]; g.coverUrl = ''; await G.sgdbAuto(g); if (g.coverSrc !== 'sgdb') throw new Error('sgdb auto'); await G.openSgdb(g.id);
  });
  await step('series case merge + dupes', async () => {
    const mk = (n, ser, extra) => Object.assign({ id: 'x' + n, name: 'G' + n, year: 2000, series: ser, genres: [], platforms: [], collections: [], props: {}, igdbId: 0, hasCover: false, added: n }, extra || {});
    S.games.push(mk(1, 'GOD EATER'), mk(2, 'God Eater'), mk(3, 'GOD EATER'));
    if (G.canonSeries('god  eater') !== 'GOD EATER') throw new Error('canon ' + G.canonSeries('god  eater'));
    S.collections.push({ id: 'cA', name: 'Ps' }, { id: 'cB', name: 'PS' }); S.games[S.games.length - 1].collections.push('cB');
    S.games.push(mk(4, '', { name: 'Dup Game', done: true, collections: ['cA'] }), mk(5, '', { name: 'DUP game', collections: ['cB'], igdbId: 999 }));
    const d = G.findDupes(); if (d.series.length !== 1 || d.colls.length !== 1 || d.games.length < 1) throw new Error('dupes ' + JSON.stringify([d.series.length, d.colls.length, d.games.length]));
    await G.mergeAllDupes(d);
    const after = G.findDupes(); if (after.series.length + after.colls.length + after.games.length) throw new Error('still dupes');
    const dg = S.games.filter(g => g.name.toLowerCase() === 'dup game'); if (dg.length !== 1 || !dg[0].done || dg[0].collections.length !== 1) throw new Error('game merge ' + JSON.stringify(dg));
  });
  await step('autosave on close + new game dup guard', async () => {
    S.tab = 'library'; G.openGameSheet(null); document.querySelector('#f_name').value = 'Zork'; G.ACT.shDone({ dataset: {}, classList: { toggle() {} } });
    G.closeSheet(); await new Promise(r => setTimeout(r, 50)); const z = S.games.find(g => g.name === 'Zork'); if (!z || !z.done) throw new Error('not autosaved');
    G.openGameSheet(null); document.querySelector('#f_name').value = 'zork'; G.ACT.shDone({ dataset: {}, classList: { toggle() {} } }); G.closeSheet(); await new Promise(r => setTimeout(r, 50));
    if (S.games.filter(g => g.name.toLowerCase() === 'zork').length !== 1) throw new Error('dup created');
    S.props.push({ id: 'pp1', name: 'Заметка', type: 'text' }, { id: 'pp2', name: 'Цена', type: 'number' }); z.props = { pp1: 'a\nb', pp2: 12.5 };
    S.set.view = 'list'; S.set.pin = true; G.render(); S.selMode = true; G.render(); S.selMode = false; S.set.pin = false; G.render(); G.ACT.colProp({ dataset: { id: 'pp1' } }); G.ACT.togglePin(); G.openCols(); S.set.f.sort = 'prop:pp2'; G.render(); S.set.f.sort = 'name'; S.set.view = 'grid';
  });
  await step('trash + undo + stats', async () => {
    const g = S.games.find(x => x.name === 'Zork'); const id = g.id; const n0 = S.games.length;
    await G.removeGame(id); if (S.games.length !== n0 - 1 || !S.trash.some(r => r.id === id)) throw new Error('trash');
    await G.restoreGames([id]); if (S.games.length !== n0 || S.trash.some(r => r.id === id)) throw new Error('restore');
    S.tab = 'settings'; G.render(); G.ACT.openStats(); if (S.tab !== 'stats') throw new Error('stats tab'); if (!G.viewStats().includes('Статистика')) throw new Error('stats html'); S.tab = 'library';
  });
  await step('collections order/color/cover + search', async () => {
    S.collections.length = 0; S.collections.push({ id: 'a1', name: 'Один', created: 1 }, { id: 'a2', name: 'Два', created: 2, order: 5 }, { id: 'a3', name: 'Три', created: 3 });
    S.tab = 'collections'; G.render(); S.cFind = 'дв'; G.render(); S.cFind = ''; S.tab = 'series'; S.sFind = 'zzz'; G.render(); S.sFind = ''; G.render(); S.tab = 'library'; G.render();
  });
  await step('list density + done date + clickable chips', async () => {
    S.tab = 'library'; S.set.view = 'list'; for (const k of [1, 2, 3]) { S.set.zoom.list = k; G.render(); } G.ACT.zoom({ dataset: { k: 'list' } });
    const g = S.games.find(x => x.name === 'Zork'); G.openGameSheet(g.id); G.ACT.shDone({ dataset: {}, classList: { toggle() {} } }); G.ACT.shDone({ dataset: {}, classList: { toggle() {} } });
    G.closeSheet(); await new Promise(r => setTimeout(r, 30));
    g.genres = ['RPG']; G.ACT.gotoGenre({ dataset: { v: 'RPG' } }); if (S.set.f.genres[0] !== 'RPG') throw new Error('gotoGenre'); S.set.f.genres = []; S.set.view = 'grid';
    S.rs = { rid: 'igdb:1', colls: [] }; await G.ACT.rsChip({ dataset: { id: G.DONE_ID } }); const rg = S.games.find(x => x.igdbId === 1); if (rg.done && !rg.doneDate) throw new Error('doneDate not set');
  });
  await step('inbox auto resolve', async () => {
    S.inbox.lists.push({ id: 'l2', name: 'Auto', created: 2 });
    const before = S.games.length;
    await G.addItems('l2', ['Zork | 5ч | 2000', 'Fallout: New Vegas', 'Totally Unknown Title 999']);
    const orig = global.confirmBoxHook; S.set.igdbSecret = ''; // только каталог
    const pr = G.autoResolve('l2'); await pr;
    const it = S.inbox.items.filter(i => i.listId === 'l2'); const z = it.find(i => i.text === 'Zork');
    if (!z || !z.done) throw new Error('zork not matched: ' + JSON.stringify(it));
    const unk = it.find(i => i.text.startsWith('Totally')); if (!unk || unk.done || !unk.failed) throw new Error('unknown should fail');
    S.set.igdbId = 'ID'; S.set.igdbSecret = 'SEC';
  });
  await step('game sheet', () => { G.openGameSheet(S.games[0].id); G.openGameSheet(null); });
  await step('selection', async () => { S.tab = 'library'; G.ACT.selToggle(); S.sel.add(S.games[0].id); G.render(); });

  await step('Завершено: встроенная коллекция, плитка и список', async () => {
    S.set.f.collections = [G.DONE_ID]; S.tab = 'library'; G.render();
    const done = S.games.filter(g => g.done).length; const shown = G.filterGames(S.games, S.set.f).length; if (shown !== done) throw new Error('done filter ' + shown + '/' + done);
    S.set.f.collections = []; S.tab = 'collections';
    for (const m of ['tiles', 'list']) { S.set.vmode.coll = m; G.render(); const h = G.collTilesHtml(); if (!h.includes('Завершено') || !h.includes('Все игры')) throw new Error('system tiles ' + m); if (m === 'list' && !G.viewCollections().includes('lrows')) throw new Error('list view'); }
    G.ACT.vmode({ dataset: { k: 'coll' } }); G.ACT.vmode({ dataset: { k: 'series' } }); S.tab = 'series'; G.render(); if (!G.viewSeries().includes('lrows')) throw new Error('series list'); G.ACT.vmode({ dataset: { k: 'series' } });
    G.ACT.collOpen({ dataset: { id: G.DONE_ID } }); if (S.set.f.collections[0] !== G.DONE_ID) throw new Error('collOpen'); S.set.f.collections = []; S.tab = 'library';
  });
  await step('жанры за кнопкой и скриншоты в базе', async () => {
    const g = S.games.find(x => x.genres && x.genres.length) || S.games[0]; G.openGameSheet(g.id);
    G.ACT.editGenres({}); if (!S.sheet.genresEdit) throw new Error('edit on'); G.ACT.editGenres({}); if (S.sheet.genresEdit) throw new Error('edit off');
    await G.putShots(g.id, [{ n: 'a', src: 'u1', blob: new Blob(['x']) }, { n: 'b', src: '', blob: new Blob(['y']) }]); if (g.shotCount !== 2 || (await G.getShots(g.id)).length !== 2) throw new Error('put shots');
    S.tab = 'library'; const id = g.id; await G.removeGame(id); if ((await G.getShots(id)).length) throw new Error('shots not removed'); await G.restoreGames([id]); if ((await G.getShots(id)).length !== 2) throw new Error('shots not restored');
    await G.putShots(id, []); if (S.games.find(x => x.id === id).shotCount !== 0) throw new Error('clear shots');
  });
  await step('импорт: коллекции с цветом и скриншоты', async () => {
    const d = { app: 'game-catalog', games: [{ id: 'imp1', name: 'Import Game', year: 1999, genres: [], platforms: [], collections: ['ic'], props: {}, done: true, doneDate: '2020-01-02', shotCount: 5 }], collections: [{ id: 'ic', name: 'Импорт-коллекция', color: '#ff7a1a', order: 3, coverGame: 'imp1' }], props: [], covers: {}, shots: { imp1: [{ src: 'u', d: 'data:image/jpeg;base64,AAAA' }] } };
    await G.importData(d, 'merge'); const c = S.collections.find(x => x.name === 'Импорт-коллекция'); if (!c || c.color !== '#ff7a1a') throw new Error('color lost');
    const g = S.games.find(x => x.name === 'Import Game'); if (c.coverGame !== g.id) throw new Error('coverGame ' + c.coverGame); if (g.shotCount !== 1 || (await G.getShots(g.id)).length !== 1) throw new Error('shots import');
    S.set.f.collections = ['нет-такой']; await G.importData({ app: 'game-catalog', games: [] }, 'merge'); if (S.set.f.collections.length) throw new Error('stale filter');
  });
  await step('коллекции в фильтрах, окно коллекций, долгий тап, платформы', async () => {
    S.tab = 'library'; S.set.f.collections = []; G.render();
    G.ACT.openColls(); G.ACT.collChip({ dataset: { id: G.DONE_ID } }); G.ACT.collMode({ dataset: { v: 'and' } }); if (S.set.f.collections[0] !== G.DONE_ID || S.set.f.collMode !== 'and') throw new Error('collChip/collMode');
    G.ACT.collMode({ dataset: { v: 'or' } });
    const h = S.collections.length || true ? G.libToolsHtml() : ''; if (!h.includes('Коллекции')) throw new Error('no collections button'); if (!h.includes('cnt')) throw new Error('no counter on collections button');
    G.ACT.openFilters(); G.ACT.collChip({ dataset: { id: 'c1' } }); G.ACT.rmF({ dataset: { k: 'collections', v: 'c1' } }); if (S.set.f.collections.includes('c1')) throw new Error('rmF collections');
    G.ACT.collClear(); if (S.set.f.collections.length) throw new Error('collClear');
    if (G.collTilesHtml().includes('⋮') || !G.collTilesHtml().includes('data-lpm="coll"') || !G.seriesTilesHtml().includes('data-lpm="ser"')) throw new Error('long tap markup');
    if (!/✓ \d+%/.test(G.collTilesHtml())) throw new Error('percent');
    const g = S.games[0]; G.openGameSheet(g.id); G.ACT.editPlats({}); if (!S.sheet.platsEdit) throw new Error('plats on'); G.ACT.editPlats({}); if (S.sheet.platsEdit) throw new Error('plats off'); G.closeSheet();
  });
  await step('основная платформа, массовые действия, поиск с коллекциями', async () => {
    const W = global.window || global; if (!S.collections.some(c => c.id === 'zz')) S.collections.push({ id: 'zz', name: 'ZZ', created: 1 });
    if (G.mainOf({ platforms: ['PC'] }) !== 'PC' || G.mainOf({ platforms: ['PC', 'PS4'] }) !== '' || G.mainOf({ platforms: ['PC', 'PS4'], mainPlatform: 'PS4' }) !== 'PS4') throw new Error('mainOf');
    W.__chooseHook = async o => o.items[1].id; if (await G.requirePlatform(['PC', 'PS4'], '') !== 'PS4') throw new Error('ask pick');
    W.__chooseHook = async () => null; if (await G.requirePlatform(['PC', 'PS4'], '') !== null) throw new Error('ask cancel');
    if (await G.requirePlatform(['PC'], '') !== 'PC' || await G.requirePlatform(['PC', 'PS4'], 'PS4') !== 'PS4') throw new Error('single/preset');
    W.__promptHook = async () => ' PC '; if (await G.requirePlatform([], '') !== 'PC') throw new Error('no platforms prompt');
    W.__promptHook = async () => null; if (await G.requirePlatform([], '') !== null) throw new Error('no platforms cancel');
    const a = S.games[0], b = S.games[1]; a.platforms = ['PC', 'PS4']; b.platforms = ['PC', 'Xbox One'];
    W.__chooseHook = async o => o.items.find(x => x.id === 'PC') ? 'PC' : 'done'; W.__promptHook = async () => 'Тестовая серия';
    S.tab = 'library'; S.selMode = true; S.sel = new Set([a.id, b.id]);
    W.__chooseHook = async () => 'main'; // шаг 1: выбор действия «основная платформа» вернёт 'main', шаг 2 нужен id платформы
    let calls = 0; W.__chooseHook = async o => (++calls === 1 ? 'main' : 'PC'); await G.bulkMore([a.id, b.id]);
    if (a.mainPlatform !== 'PC' || b.mainPlatform !== 'PC') throw new Error('bulk main');
    W.__chooseHook = async () => 'series'; await G.bulkMore([a.id, b.id]); if (a.series !== 'Тестовая серия' || b.series !== 'Тестовая серия') throw new Error('bulk series');
    W.__chooseHook = async () => 'done'; await G.bulkMore([a.id, b.id]); if (!a.done || !b.done) throw new Error('bulk done');
    W.__chooseHook = async () => 'undone'; await G.bulkMore([a.id, b.id]); if (a.done || b.done) throw new Error('bulk undone');
    W.__chooseHook = async () => 'genre'; W.__promptHook = async () => 'Тест-жанр'; await G.bulkMore([a.id]); if (!a.genres.includes('Тест-жанр')) throw new Error('bulk genre');
    S.selMode = false; S.sel.clear(); delete W.__chooseHook; delete W.__promptHook;
    const f = JSON.parse(JSON.stringify(S.set.f)); f.mainPlats = ['PC']; if (!G.filterGames(S.games, f).every(g => G.mainOf(g) === 'PC')) throw new Error('mainPlats filter');
    f.mainPlats = [G.NO_MAIN]; if (G.filterGames(S.games, f).some(g => G.mainOf(g))) throw new Error('no main filter');
    S.tab = 'search'; G.render(); S.search.addColls = ['zz', G.DONE_ID]; G.renderSearchBody();
    const tools = document.querySelector('#sTools').innerHTML; if (!tools.includes('Добавлять в')) throw new Error('add colls button'); if (!document.querySelector('#sActive').innerHTML.includes('Завершено')) throw new Error('add colls chips');
    await G.quickTap('igdb:1', S.search.addColls); const q = S.games.find(g => g.igdbId === 1); if (!q || !q.collections.includes('zz') || !q.done) throw new Error('quick tap');
    G.ACT.acRm({ dataset: { id: 'zz' } }); if (S.search.addColls.includes('zz')) throw new Error('acRm');
    G.ACT.acClear(); if (S.search.addColls.length) throw new Error('acClear'); G.ACT.igdbTap({ dataset: { rid: 'igdb:1' } });
    G.openLb(['a', 'b', 'c'], 1); G.ACT.shot({ dataset: { g: 'local', i: '1' } }); S.shotUrls = ['x', 'y']; G.ACT.shot({ dataset: { g: 'local', i: '1' } });
    S.tab = 'library'; G.render(); if (document.querySelector('#view').className !== 'fx') throw new Error('fx layout'); S.tab = 'settings'; G.render(); if (document.querySelector('#view').className !== '') throw new Error('settings layout');
    S.tab = 'library'; G.render();
  });
  await step('основная платформа по тапу, +N коллекций, настройки списка разбора', async () => {
    const W = global.window || global;
    const g = S.games[0]; g.platforms = ['PC', 'PS4']; g.mainPlatform = ''; G.openGameSheet(g.id); document.querySelector('#f_platforms').value = 'PC, PS4';
    G.ACT.shPlat({ dataset: { v: 'PS4' } }); if (S.sheet.draft.mainPlatform !== 'PS4') throw new Error('shPlat'); G.ACT.shPlat({ dataset: { v: 'PS4' } }); if (S.sheet.draft.mainPlatform) throw new Error('shPlat off'); G.closeSheet();
    S.set.cols.mainPlatform = 1; S.set.cols.platforms = 0; S.set.view = 'list'; S.tab = 'library'; G.render(); S.set.view = 'grid';
        S.collections.push({ id: 'n1', name: 'Н1', created: 1 }, { id: 'n2', name: 'Н2', created: 2 }, { id: 'n3', name: 'Н3', created: 3 }); const gg = S.games[0]; gg.collections = ['n1', 'n2', 'n3'];
    S.set.view = 'list'; S.tab = 'library'; G.render(); G.ACT.gameColls({ dataset: { gid: gg.id } }); S.set.view = 'grid';
    G.ACT.openFilters(); G.ACT.openFilters();
    const l = S.inbox.lists[0] || { id: 'l1', name: 'Список', created: 1 }; if (!S.inbox.lists.length) S.inbox.lists.push(l);
    const it = { id: 'it1', listId: l.id, text: 'Тестовая игра', done: false, gameId: '', created: 1 }; S.inbox.items.push(it);
    l.platform = 'PC'; l.colls = ['n1']; l.markDone = true; const e = G.effItem(it); if (e.platform !== 'PC' || e.colls[0] !== 'n1' || !e.markDone) throw new Error('effItem');
    it.platform = 'PlayStation 4'; it.colls = []; it.markDone = false; const e2 = G.effItem(it); if (e2.platform !== 'PlayStation 4' || e2.colls.length || e2.markDone) throw new Error('item override');
    delete it.platform; delete it.colls; delete it.markDone;
    const tg = { id: 'tg', name: 'Target', platforms: ['PS4', 'Xbox One'], genres: [], collections: [], props: {}, done: false, hasCover: false }; S.games.push(tg);
    G.linkItem(it, tg, true); if (!tg.collections.includes('n1') || !tg.done || tg.mainPlatform !== 'PC' || !tg.platforms.includes('PC')) throw new Error('applyDefaults');
    S.inboxList = l.id; S.tab = 'inbox'; G.render(); if (!G.viewInbox().includes('lstPlat')) throw new Error('list settings ui');
    W.__chooseHook = async () => 'done'; const it2 = { id: 'it2', listId: l.id, text: 'Вторая', done: false, gameId: '', created: 2 }; S.inbox.items.push(it2); await G.itemOpts(it2); if (it2.markDone !== false) throw new Error('itemOpts toggle ' + it2.markDone); delete W.__chooseHook;
    S.inboxList = null; S.tab = 'library'; G.render();
  });
  await step('IGDB: типы игр, количество в результате, поиск списком, возврат в разбор', async () => {
    S.tab = 'search'; G.render(); S.search.q = 'fallout'; S.set.pageSize = 20; global.__bodies = [];
    await G.runSearch(true);
    const gb = global.__bodies.filter(b => b.includes('search "fallout"')); if (!gb.length || !gb.every(b => b.includes('game_type = (0,4,6,8,9,10,11)'))) throw new Error('game types filter');
    if (!gb[0].includes('limit 20;')) throw new Error('page size ' + gb[0]);
    S.set.vmode.search = 'list'; G.renderSearchBody(); const html = document.querySelector('#srBody').innerHTML; if (!html.includes('class="srow"') || !html.includes('openIgdb')) throw new Error('search list view');
    G.ACT.vmode({ dataset: { k: 'search' } }); if (S.set.vmode.search !== 'tiles') throw new Error('vmode toggle'); S.set.pageSize = 40;
    const it = S.inbox.items.find(i => !i.done) || { id: 'bk1', listId: (S.inbox.lists[0] || {}).id, text: 'Back test', done: false, gameId: '', created: 1 }; if (!S.inbox.items.includes(it)) S.inbox.items.push(it);
    S.inboxList = it.listId; S.tab = 'inbox'; G.render(); G.ACT.itOpen({ dataset: { id: it.id } }); if (!S.pending || S.tab !== 'search') throw new Error('itOpen');
    G.ACT.pendingCancel(); if (S.pending || S.tab !== 'inbox') throw new Error('back to inbox');
    S.inboxList = null; S.tab = 'library'; G.render();
  });
  await step('RAWG как второй источник, основной поиск, лимит, архив, скриншоты', async () => {
    S.set.rawgKey = 'RK'; S.set.mainSrc = 'rawg'; S.search.src = 'rawg'; S.tab = 'search'; S.search.q = 'rawg game'; S.search.f = { genre: '', genreName: '', platform: '', platformName: '', year: '', minRating: 0 };
    await G.runSearch(true); if (!S.search.results.length || S.search.results[0].rid !== 'rawg:500') throw new Error('rawg search');
    if (!document.querySelector('#sTools').innerHTML.includes('RAWG')) throw new Error('source button');
    const left0 = S.set.rawgQuota.left, g = await G.addFromIgdb('rawg:500', []); if (!g || g.rawgId !== 500 || !g.rawgUrl.includes('rawg-game') || g.mainPlatform !== 'PC') throw new Error('add from rawg');
    if (S.set.rawgQuota.left >= left0) throw new Error('quota not spent');
    await G.refreshOne(g, 'rawg');
    S.set.rawgQuota = { left: 5, renew: '2000-01-01' }; G.rawgQuotaTick(); if (S.set.rawgQuota.left !== 20000 || S.set.rawgQuota.renew <= '2000-01-01') throw new Error('quota renew');
    G.ACT.sSrcSwitch(); if (S.search.src !== 'igdb') throw new Error('switch'); S.tab = 'library'; G.ACT.tab({ dataset: { tab: 'search' } }); if (S.search.src !== 'rawg') throw new Error('reset to main source');
    S.set.mainSrc = 'igdb'; S.search.src = 'igdb'; S.tab = 'library'; G.render();
    const blob = await G.zipBuild([{ name: 'a.txt', data: new TextEncoder().encode('hello'.repeat(200)), deflate: true }, { name: 'shots/x/1.jpg', data: new Uint8Array([1, 2, 3, 250]), deflate: false }]);
    const m = await G.zipRead(await blob.arrayBuffer()); if (new TextDecoder().decode(m.get('a.txt')) !== 'hello'.repeat(200) || m.get('shots/x/1.jpg')[3] !== 250) throw new Error('zip round trip');
    const gg = S.games[0]; await G.putShots(gg.id, [{ n: 'a', src: '', blob: new Blob(['xxxx']) }]); const st = await G.shotStats(); if (!st.some(x => x.id === gg.id && x.n === 1)) throw new Error('shot stats');
    await G.delShots([gg.id]); if ((await G.getShots(gg.id)).length || gg.shotCount !== 0) throw new Error('delete shots');
    (global.window || global).open = () => {}; S.set.sgdbOn = false; G.ACT.sgdbOff(); G.openGameSheet(gg.id); G.ACT.hltbOpen(); G.closeSheet();
  });
  await step('выгрузка, общий текст, сомнения в разборе, прокси', async () => {
    const W = global.window || global;
    const lst = S.inbox.lists[0] || { id: 'lx', name: 'Список', created: 1 }; if (!S.inbox.lists.length) S.inbox.lists.push(lst);
    W.__chooseHook = async o => o.items.find(x => x.id === 'inbox') ? 'inbox' : lst.id;
    await G.handleShared('Alpha Game (2011 | PC) – 5 ч\nBeta Game'); if (S.tab !== 'inbox' || !S.inbox.items.some(i => i.text === 'Alpha Game' && i.x && i.x.platforms[0] === 'PC')) throw new Error('shared to inbox');
    W.__chooseHook = async () => 'search'; await G.handleShared('Gamma Game (2012)'); if (S.tab !== 'search' || S.search.q !== 'Gamma Game') throw new Error('shared to search'); delete W.__chooseHook;
    const tg = { id: 'ex1', name: 'Extra Game', platforms: [], genres: [], collections: [], props: {}, done: false, hasCover: false, series: '' };
    G.applyExtra({ year: 2001, hours: 7, x: { platforms: ['PC', 'PS4'], mainPlatform: 'PS4', genres: ['RPG'], series: 'Saga', colls: ['Новая из текста'], done: true, rating: 7.5 } }, tg);
    if (tg.year !== 2001 || tg.time !== 7 || tg.mainPlatform !== 'PS4' || !tg.genres.length || tg.series !== 'Saga' || !tg.done || tg.rating !== 7.5 || tg.collections.length !== 1) throw new Error('applyExtra');
    const doubt = { id: 'db1', listId: lst.id, text: 'Doubt Game', year: 0, hours: 0, done: false, gameId: '', created: 1, doubt: true, cands: [{ rid: 'igdb:1', name: 'Fallout: New Vegas', year: 2010, platforms: ['PC'] }] }; S.inbox.items.push(doubt);
    W.__chooseHook = async () => 'igdb:1'; await G.ACT.itPick({ dataset: { id: 'db1' } }); delete W.__chooseHook; if (!doubt.done || doubt.doubt) throw new Error('doubt pick');
    G.openExport(S.games, 'Тест'); if (!G.exportText().startsWith('Название')) throw new Error('export text ' + G.exportText().slice(0, 20));
    G.ACT.expCol({ dataset: { k: 'rating' } }); if (!G.exportText().includes('Рейтинг')) throw new Error('export col'); G.ACT.expFmt({ dataset: { v: 'txt' } }); if (!G.exportText().includes(' | ')) throw new Error('export fmt'); G.closeSheet();
    if (G.gameLine({ name: 'A', year: 2020, platforms: ['PC', 'PS4'], time: 5 }) !== 'A (2020 | PC, PS4) – 5 ч') throw new Error('gameLine');
    S.set.igdbProxy = 'http://localhost:8787/'; S.set.igdbId = ''; S.set.igdbSecret = ''; global.__urls = []; const f0 = global.fetch; global.fetch = async (u, o) => { global.__urls.push(String(u)); return f0(u, o); };
    S.block = null; S.lists = {}; await G.igdb('/genres', 'fields id; limit 1;'); global.fetch = f0; if (!global.__urls.some(u => u.startsWith('http://localhost:8787/genres')) || global.__urls.some(u => u.includes('twitch'))) throw new Error('proxy url ' + global.__urls);
    S.set.igdbProxy = ''; S.set.igdbId = 'ID'; S.set.igdbSecret = 'SEC'; S.tab = 'library'; G.render();
  });
  await step('карточка: название, завершено, обложка, меню; выбор в разборе; график статистики', async () => {
    const W = global.window || global;
    const g = S.games[0]; G.openGameSheet(g.id);
    W.__promptHook = async () => 'Cthulhu Saves the World: Super Hyper Enhanced Championship Edition Alpha Diamond DX Plus Alpha FES HD – Premium Enhanced Game of the Year Collector\'s Edition';
    await G.ACT.shEditName(); if (!document.querySelector('#f_name').value.startsWith('Cthulhu')) throw new Error('shEditName'); delete W.__promptHook;
    G.ACT.shDone(); if (!S.sheet.draft.done || !document.querySelector('#f_donedate').value) throw new Error('shDone on');
    G.ACT.shDone(); if (S.sheet.draft.done) throw new Error('shDone off');
    G.ACT.shCover(); W.__chooseHook = async () => 'shareGame'; (global.window || global).open = () => {}; await G.ACT.shMenu(); delete W.__chooseHook; G.closeSheet();
    const lst = S.inbox.lists[0]; const a = { id: 'sa1', listId: lst.id, text: 'Sel A', done: false, gameId: '', created: 1 }, b = { id: 'sb1', listId: lst.id, text: 'Sel B', done: false, gameId: '', created: 2 }; S.inbox.items.push(a, b);
    S.inboxList = lst.id; S.tab = 'inbox'; G.render(); G.toggleInSel('sa1', true); G.toggleInSel('sb1'); if (S.inSel.size !== 2 || !S.inSelMode) throw new Error('inbox select');
    W.__chooseHook = async () => 'PC'; await G.ACT.inAct({ dataset: { m: 'plat' } }); delete W.__chooseHook; if (a.platform !== 'PC' || b.platform !== 'PC') throw new Error('inbox platform for selected');
    G.toggleInSel('sa1', true); W.__chooseHook = async () => 'yes'; await G.ACT.inAct({ dataset: { m: 'done' } }); delete W.__chooseHook; if (a.markDone !== true) throw new Error('inbox done');
    S.inboxList = null; S.tab = 'stats'; G.render(); G.ACT.statGo({ dataset: { k: 'genres', v: 'RPG' } }); if (S.tab !== 'library' || S.set.f.genres[0] !== 'RPG') throw new Error('statGo');
    G.ACT.statGo({ dataset: { k: 'done' } }); if (S.set.f.done !== 'yes' || S.set.f.genres.length) throw new Error('statGo done'); S.set.f.done = '';
    S.selMode = true; S.sel = new Set([S.games[0].id]); S.tab = 'library'; G.render(); if (!document.querySelector('#selbar').innerHTML.includes('data-m="add"') || document.querySelector('#selbar').innerHTML.includes('data-m="move"')) throw new Error('selbar'); S.selMode = false; S.sel.clear(); G.render();
  });
  await step('карточка: название, обложка, завершено; выбор строк; статистика; назад в карточку', async () => {
    const W = global.window || global; const g = S.games[0];
    G.openGameSheet(g.id); W.__promptHook = async () => 'Cthulhu Saves the World: Super Hyper Enhanced Championship Edition Alpha Diamond DX Plus Alpha FES HD – Premium Enhanced Game of the Year Collector\'s Edition';
    await G.ACT.shEditName(); if (document.querySelector('#f_name').value.length < 100 || !S.sheet.dirty) throw new Error('long name edit'); delete W.__promptHook;
    G.ACT.shDone({}); if (!S.sheet.draft.done) throw new Error('shDone on'); G.ACT.shDone({}); if (S.sheet.draft.done) throw new Error('shDone off');
    G.ACT.shCover(); G.closeLb && G.closeLb(); W.__chooseHook = async () => 'hltbOpen'; (global.window || global).open = () => {}; document.querySelector('#f_name').value = 'X'; await G.ACT.shMenu(); delete W.__chooseHook; G.closeSheet();
    S.tab = 'library'; S.selMode = true; S.sel = new Set([S.games[0].id]); G.render(); const bar = document.querySelector('#selbar').innerHTML; if (!bar.includes('data-m="add"') || bar.includes('Переместить') || !bar.includes('selcnt')) throw new Error('selbar'); S.selMode = false; S.sel.clear(); G.render();
    G.ACT.statGo({ dataset: { k: 'genres', v: 'RPG' } }); if (S.tab !== 'library' || S.set.f.genres[0] !== 'RPG') throw new Error('statGo'); G.ACT.statGo({ dataset: { k: 'done' } }); if (S.set.f.done !== 'yes' || S.set.f.genres.length) throw new Error('statGo done'); Object.assign(S.set.f, { done: '', genres: [] });
    const lst = S.inbox.lists[0]; S.inboxList = lst.id; S.tab = 'inbox'; const its = [{ id: 'sel1', listId: lst.id, text: 'Sel one', done: false, gameId: '', created: 1 }, { id: 'sel2', listId: lst.id, text: 'Sel two', done: false, gameId: '', created: 2 }]; S.inbox.items.push(...its); G.render();
    G.toggleInSel('sel1', true); G.toggleInSel('sel2', true); if (S.inSel.size !== 2 || !document.querySelector('#selbar').innerHTML.includes('data-m="plat"')) throw new Error('inbox select');
    W.__chooseHook = async () => 'yes'; await G.ACT.inAct({ dataset: { m: 'done' } }); delete W.__chooseHook; if (its[0].markDone !== true || its[1].markDone !== true || S.inSelMode) throw new Error('inbox bulk done');
    const pp = await G.ACT.inAct({ dataset: { m: 'all' } }); S.inSel.clear(); S.inSelMode = false;
    S.retGame = { id: S.games[0].id, tab: 'library' }; S.tab = 'search'; G.ACT.retGame(); if (S.tab !== 'library' || !S.sheet) throw new Error('retGame'); G.closeSheet();
    S.inboxList = null; S.tab = 'library'; G.render();
  });
  await step('export/import', async () => { const d = { app: 'game-catalog', games: S.games, collections: S.collections, props: [], covers: {} }; const before = S.games.length; const n = await G.importData(JSON.parse(JSON.stringify(d)), 'merge'); if (S.games.length !== before) throw new Error('dup ' + S.games.length + ' vs ' + before); });
})();
