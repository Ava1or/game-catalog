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
const rawgData = (path) => {
  if (path.includes('game-series')) return { results: [{ id: 2, name: 'Fallout 4' }, { id: 3, name: 'Fallout 3' }] };
  if (/\/games\/\d+/.test(path)) return { id: 1, name: 'Fallout: New Vegas', released: '2010-10-19', rating: 4.3, playtime: 30, description_raw: 'desc', genres: [{ name: 'RPG' }], platforms: [{ platform: { name: 'PC' } }], background_image: 'https://media.rawg.io/media/games/a.jpg' };
  if (path.includes('/genres')) return { results: [{ id: 5, name: 'RPG' }] };
  if (path.includes('/platforms')) return { results: [{ platforms: [{ id: 4, name: 'PC' }] }] };
  return { count: 120, next: 'x', results: Array.from({ length: 40 }, (_, i) => ({ id: 100 + i, name: 'Fallout ' + i, released: '2000-01-01', rating: 4, playtime: 10, platforms: [{ platform: { name: 'PlayStation 4' } }], genres: [{ name: 'RPG' }], background_image: 'https://media.rawg.io/media/games/x' + i + '.jpg' })) };
};
global.fetch = async (u, o) => { const p = String(u); if (p.includes('media.rawg.io')) return { ok: false };
  if (p.includes('steamgriddb')) { if (p.includes('autocomplete')) return { ok: true, status: 200, json: async () => ({ success: true, data: [{ id: 7, name: 'Fallout NV' }] }) }; return { ok: true, status: 200, json: async () => ({ success: true, data: [{ url: 'https://cdn/x.png', thumb: 'https://cdn/t.png', score: 5, width: 600, height: 900 }] }) }; }
  if (global.__BADKEY && p.includes('api.rawg.io')) return { ok: false, status: 401, text: async () => 'Invalid API key' }; const path = p.replace('https://api.rawg.io/api', ''); return { ok: true, json: async () => rawgData(path) }; };
global.createImageBitmap = async () => { throw new Error('no'); };
const L = require('../www/app.js');
(async () => {
  await new Promise(r => setTimeout(r, 100));
  const G = global.__GC; const S = G.S;
  const fail = (m, e) => { console.log('FAIL', m, e && e.stack || e); process.exitCode = 1; };
  const step = async (m, fn) => { try { await fn(); console.log('ok', m); } catch (e) { fail(m, e); } };
  await G.loadAll();
  S.set.rawgKey = 'KEY';
  await step('render all tabs', () => { for (const t of ['library', 'collections', 'series', 'search', 'settings']) { S.tab = t; G.render(); } });
  await step('search run', async () => { S.tab = 'search'; S.search.q = 'fallout'; await G.runSearch(true); if (S.search.results.length !== 40) throw new Error('results ' + S.search.results.length); await G.runSearch(false); if (S.search.results.length !== 80) throw new Error('page2 ' + S.search.results.length); });
  await step('open rawg sheet', () => G.openRawgSheet(100));
  await step('add from rawg', async () => { const g = await G.addFromRawg(1, []); if (!g || g.series !== 'Fallout') throw new Error('series=' + (g && g.series)); });
  await step('quick add + render', async () => { await G.addFromRawg(101); G.renderSearchBody(); });
  await step('collections + library', async () => { S.collections.push({ id: 'c1', name: 'Любимые' }); S.games[0].collections.push('c1'); S.tab = 'collections'; G.render(); S.tab = 'library'; G.render(); G.ACT.collChip({ dataset: { id: 'c1' } }); G.ACT.openFilters(); G.ACT.openCols(); G.ACT.toggleView(); G.ACT.fToggle({ dataset: { k: 'genres', v: 'RPG' } }); G.ACT.rmF({ dataset: { k: 'genres', v: 'RPG' } }); G.ACT.resetF(); });
  await step('series tab', async () => { S.tab = 'series'; G.render(); G.ACT.serOpen({ dataset: { name: 'Fallout' } }); if (S.tab !== 'library' || S.set.f.series[0] !== 'Fallout') throw new Error('serOpen'); G.ACT.serOpen({ dataset: { name: '' } }); G.render(); });
  await step('rawg sheet with shots + colls', async () => { S.tab = 'search'; await G.openRawgSheet(1); });
  await step('inbox flow', async () => {
    const l = { id: 'l1', name: 'Steam', created: 1 }; S.inbox.lists.push(l);
    const n = await G.addItems('l1', ['1. Fallout New Vegas', '- Half-Life', 'Half-Life', '']); if (n !== 2) throw new Error('addItems ' + n);
    S.tab = 'inbox'; G.render(); S.inboxList = 'l1'; G.render();
    const html = G.viewInbox(); if (!html.includes('Fallout New Vegas')) throw new Error('no item');
    G.ACT.itOpen({ dataset: { id: S.inbox.items[0].id } }); if (S.tab !== 'search' || !G.pendingItem()) throw new Error('pending');
    G.render(); await G.addFromRawg(1); await G.ACT.rsLink({ dataset: { rid: '1' } });
    if (!S.inbox.items[0].done || S.tab !== 'inbox') throw new Error('link ' + S.inbox.items[0].done + S.tab);
    G.render(); G.ACT.itOpen({ dataset: { id: S.inbox.items[0].id } });
  });
  await step('done flag + shots', async () => {
    await G.ACT.rsDone({ dataset: { rid: '1' } }); const g = S.games.find(x => x.rawgId === 1); if (!g || !g.done) throw new Error('done not set');
    S.tab = 'library'; S.set.view = 'grid'; G.render(); S.set.view = 'list'; G.render(); S.set.view = 'grid';
    G.ACT.setDone({ dataset: { v: 'yes' } }); G.ACT.setDone({ dataset: { v: 'no' } }); G.ACT.setDone({ dataset: { v: '' } });
    G.openGameSheet(g.id); G.ACT.shDone({ dataset: {}, classList: { toggle() {} } }); await G.ACT.loadShots({ dataset: { rid: '1' } });
    G.openFilters(); G.openCols();
  });
  await step('counter + key block + theme + zoom + rating', async () => {
    const before = S.set.usage.rawg; await G.rawg('/genres'); if (S.set.usage.rawg !== before + 1) throw new Error('counter');
    global.__BADKEY = true; let msg = ''; try { await G.rawg('/games', {}); } catch (e) { msg = e.message; } global.__BADKEY = false;
    if (!S.block || S.block.type !== 'key' || !msg.includes('не принят')) throw new Error('block ' + msg);
    let blocked = false; try { await G.rawg('/genres'); } catch (e) { blocked = e.message === S.block.text; } if (!blocked) throw new Error('not blocked');
    S.tab = 'search'; G.render(); G.ACT.unblock(); if (S.block) throw new Error('unblock');
    S.set.theme = 'light'; G.applyTheme(); G.ACT.setTheme({ dataset: { v: 'dark' } }); G.ACT.setTheme({ dataset: { v: 'auto' } });
    S.tab = 'library'; G.render(); const c0 = G.colsFor('grid'); G.ACT.zoom({ dataset: { k: 'grid' } }); if (G.colsFor('grid') === c0) throw new Error('zoom'); G.ACT.zoom({ dataset: { k: 'coll' } }); G.ACT.zoom({ dataset: { k: 'series' } }); G.ACT.zoom({ dataset: { k: 'search' } });
    G.ACT.setMinRating({ dataset: { v: '8' } }); G.render(); G.ACT.setMinRating({ dataset: { v: '0' } });
    S.tab = 'settings'; G.render(); if (!G.usageHtml().includes('20000')) throw new Error('usage');
    S.set.sgdbKey = 'K'; const g = S.games[0]; g.coverUrl = ''; await G.sgdbAuto(g); if (g.coverSrc !== 'sgdb') throw new Error('sgdb auto'); await G.openSgdb(g.id);
  });
  await step('series case merge + dupes', async () => {
    const mk = (n, ser, extra) => Object.assign({ id: 'x' + n, name: 'G' + n, year: 2000, series: ser, genres: [], platforms: [], collections: [], props: {}, rawgId: 0, hasCover: false, added: n }, extra || {});
    S.games.push(mk(1, 'GOD EATER'), mk(2, 'God Eater'), mk(3, 'GOD EATER'));
    if (G.canonSeries('god  eater') !== 'GOD EATER') throw new Error('canon ' + G.canonSeries('god  eater'));
    S.collections.push({ id: 'cA', name: 'Ps' }, { id: 'cB', name: 'PS' }); S.games[S.games.length - 1].collections.push('cB');
    S.games.push(mk(4, '', { name: 'Dup Game', done: true, collections: ['cA'] }), mk(5, '', { name: 'DUP game', collections: ['cB'], rawgId: 999 }));
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
    await G.ACT.rsDone({ dataset: { rid: '1' } }); const rg = S.games.find(x => x.rawgId === 1); if (rg.done && !rg.doneDate) throw new Error('doneDate not set');
  });
  await step('inbox auto resolve', async () => {
    S.inbox.lists.push({ id: 'l2', name: 'Auto', created: 2 });
    const before = S.games.length;
    await G.addItems('l2', ['Zork | 5ч | 2000', 'Fallout: New Vegas', 'Totally Unknown Title 999']);
    const orig = global.confirmBoxHook; S.set.rawgKey = ''; // только каталог
    const pr = G.autoResolve('l2'); await pr;
    const it = S.inbox.items.filter(i => i.listId === 'l2'); const z = it.find(i => i.text === 'Zork');
    if (!z || !z.done) throw new Error('zork not matched: ' + JSON.stringify(it));
    const unk = it.find(i => i.text.startsWith('Totally')); if (!unk || unk.done || !unk.failed) throw new Error('unknown should fail');
    S.set.rawgKey = 'KEY';
  });
  await step('game sheet', () => { G.openGameSheet(S.games[0].id); G.openGameSheet(null); });
  await step('selection', async () => { S.tab = 'library'; G.ACT.selToggle(); S.sel.add(S.games[0].id); G.render(); });

  await step('Пройдено: встроенная коллекция, плитка и список', async () => {
    S.set.f.collections = [G.DONE_ID]; S.tab = 'library'; G.render();
    const done = S.games.filter(g => g.done).length; const shown = G.filterGames(S.games, S.set.f).length; if (shown !== done) throw new Error('done filter ' + shown + '/' + done);
    S.set.f.collections = []; S.tab = 'collections';
    for (const m of ['tiles', 'list']) { S.set.vmode.coll = m; G.render(); const h = G.collTilesHtml(); if (!h.includes('Пройдено') || !h.includes('Все игры')) throw new Error('system tiles ' + m); if (m === 'list' && !G.viewCollections().includes('lrows')) throw new Error('list view'); }
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
  await step('export/import', async () => { const d = { app: 'game-catalog', games: S.games, collections: S.collections, props: [], covers: {} }; const before = S.games.length; const n = await G.importData(JSON.parse(JSON.stringify(d)), 'merge'); if (S.games.length !== before) throw new Error('dup ' + S.games.length + ' vs ' + before); });
})();
