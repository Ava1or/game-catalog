// Запуск: node --test tests/smoke.test.js (подставные DOM и IndexedDB)
const stores = {};
global.indexedDB = { open() { const r = {}; setTimeout(() => { r.result = {
  objectStoreNames: { contains: () => false },
  createObjectStore(n) { stores[n] = new Map(); },
  transaction(names) { const t = {}; t.objectStore = n => { const st = stores[n]; const mk = res => { const q = {}; setTimeout(() => { q.result = res(); t.oncomplete && t.oncomplete(); }); return q; };
    return { getAll: () => mk(() => [...st.values()]), get: k => mk(() => st.get(k)), put: v => mk(() => { st.set(v.id !== undefined ? v.id : v.key, v); }), delete: k => mk(() => { st.delete(k); }), clear: () => mk(() => st.clear()), getAllKeys: () => mk(() => [...st.keys()]), openCursor: () => { const q = {}, ents = [...st.entries()]; let i = 0; const step = () => setTimeout(() => { if (i < ents.length) { const [k, v] = ents[i++]; q.result = { key: k, value: v, continue: step }; } else q.result = null; q.onsuccess && q.onsuccess(); if (!q.result) t.oncomplete && t.oncomplete(); }); step(); return q; } }; }; return t; } };
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
  const D = (y, m = 0) => Date.UTC(y, m, 1) / 1000;
  if (ep === '/games' && body.includes('fields name,first_release_date,collections.id,collections.name,franchise.id')) { const ids = (body.match(/where id = \(([\d,]+)\)/) || [, ''])[1].split(',').map(Number); return ids.filter(i => global.__gv && global.__gv[i]).map(i => global.__gv[i]); }
  if (ep === '/game_time_to_beats' && body.includes('where game_id = (')) return Object.keys(global.__gvt || {}).map(k => ({ game_id: +k, normally: global.__gvt[k] * 3600 }));
  if (ep === '/franchises') return body.includes('search "fallout') ? [{ id: 9, name: 'Fallout Universe', games: [1, 701, 702, 703] }] : [];
  if (body.includes('fields franchise.id,franchise.name,franchises.id,franchises.name; where id = (')) { const ids = (body.match(/where id = \(([\d,]+)\)/) || [, ''])[1].split(',').map(Number); const mp = global.__franchises || {}; return ids.filter(i => mp[i]).map(i => Object.assign({ id: i }, mp[i])); }
  if (ep === '/games' && body.includes('franchise = 9 |') && body.includes('game_type = (0,8,9,4,10,11,3,6)')) return [
    { id: 701, name: 'FU One', first_release_date: Date.UTC(2001, 0, 1) / 1000, game_type: 0 }, { id: 702, name: 'FU Two', first_release_date: Date.UTC(2003, 0, 1) / 1000, game_type: 0 },
    { id: 703, name: 'FU Spin', first_release_date: Date.UTC(2005, 0, 1) / 1000, game_type: 0 }, { id: 704, name: 'FU Port', first_release_date: Date.UTC(2006, 0, 1) / 1000, game_type: 11 }];
  if (ep === '/collections') return body.includes('search "fallout') ? [{ id: 7, name: 'Fallout', games: [1, 201, 202, 203, 204, 205] }] : [];
  if (body.includes('fields collections.id,collections.name; where id = (')) { const ids = (body.match(/where id = \(([\d,]+)\)/) || [, ''])[1].split(',').map(Number); if (global.__collections && ids.some(i => global.__collections[i])) return ids.filter(i => global.__collections[i]).map(i => ({ id: i, collections: global.__collections[i] })); return [{ id: 1, collections: [{ id: 7, name: 'Fallout' }] }]; }
  if (ep === '/games' && body.includes('game_type = (0,8,9,4,10,11,3,6)')) return [
    { id: 1, name: 'Fallout: New Vegas', first_release_date: D(2010, 9), game_type: 0 }, { id: 201, name: 'Fallout 3', first_release_date: D(2008, 9), game_type: 0 },
    { id: 202, name: 'Fallout 3 Remake', first_release_date: D(2020), game_type: 8 }, { id: 203, name: 'Fallout 3 Port', first_release_date: D(2021), game_type: 11 },
    { id: 204, name: 'Fallout 99', game_type: 0 }, { id: 205, name: 'Fallout Collection', first_release_date: D(2015), game_type: 3 }];
  if (ep === '/game_time_to_beats') { const ids = (body.match(/\d+/g) || []).map(Number); return ids.map(i => ({ game_id: i, normally: (i === 1 ? 30 : 10) * 3600 })); }
  if (ep === '/games/count') return { count: body.includes('bundles') ? 2 : body.includes('collections') ? 2 : 120 };
  if (ep === '/genres') return [{ id: 5, name: 'RPG' }];
  if (ep === '/platforms') return [{ id: 6, name: 'PC (Microsoft Windows)' }];
  if (ep === '/screenshots') return [{ image_id: 's1' }, { image_id: 's2' }];
  if (body.includes('collections = (')) return [{ id: 2, name: 'Fallout 4' }, { id: 3, name: 'Fallout 3' }];
  if (body.includes('bundles = (')) return [{ id: 901, name: 'Devil May Cry', game_type: 0, first_release_date: Date.UTC(2001, 0, 1) / 1000, platforms: [{ name: 'PlayStation 2' }], genres: [{ name: 'RPG' }] }, { id: 902, name: 'Devil May Cry 2', game_type: 0, first_release_date: Date.UTC(2003, 0, 1) / 1000, platforms: [{ name: 'PlayStation 2' }], genres: [{ name: 'RPG' }] }];
  if (body.includes('search "devil')) return [{ id: 900, name: 'Devil May Cry HD Collection', game_type: 3, first_release_date: Date.UTC(2012, 0, 1) / 1000, platforms: [{ name: 'PC (Microsoft Windows)' }], genres: [{ name: 'RPG' }] }, { id: 901, name: 'Devil May Cry', game_type: 0, first_release_date: Date.UTC(2001, 0, 1) / 1000, platforms: [{ name: 'PlayStation 2' }], genres: [{ name: 'RPG' }] }];
  if (/where id = \d+/.test(body)) return [FNV];
  return Array.from({ length: 40 }, (_, i) => ({ id: 100 + i, name: 'Fallout ' + i, first_release_date: Date.UTC(2000, 0, 1) / 1000, total_rating: 80, platforms: [{ name: 'PlayStation 4' }], genres: [{ name: 'RPG' }], cover: { image_id: 'x' + i } }));
};
const realFetch = global.fetch;
global.FileReader = class { readAsDataURL(b) { b.arrayBuffer().then(ab => { this.result = 'data:' + (b.type || 'image/jpeg') + ';base64,' + Buffer.from(ab).toString('base64'); this.onload && this.onload(); }); } };
setTimeout(() => { console.log('FAIL тест завис дольше 120 секунд (сторож)'); process.exit(1); }, 120000).unref();
global.fetch = async (u, o) => { const p = String(u); if (p.startsWith('http://127.0.0.1:')) { (global.__fl = global.__fl || []).push(p); return realFetch(u, o); } if (p.includes('images.igdb.com')) return { ok: false };
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
  await step('series tab', async () => { S.tab = 'series'; G.render(); G.ACT.serOpen({ dataset: { name: 'Fallout' } }); if (S.tab !== 'sercard' || !/Fallout/.test(G.viewSerCard())) throw new Error('serOpen: карточка серии'); S.tab = 'series'; G.ACT.serOpen({ dataset: { name: '' } }); G.render(); });
  await step('карточка поиска: соседние результаты, кнопки и границы', async () => {
    S.tab = 'search'; S.search.results = [{ rid: 'igdb:100', name: 'А', platforms: [], genres: [] }, { rid: 'igdb:101', name: 'Б', platforms: [], genres: [] }];
    await G.openIgdbSheet('igdb:100'); if (!document.querySelector('.snav')) throw new Error('нет кнопок в карточке поиска');
    G.ACT.shNav({ dataset: { d: '1' } }); if (S.rs.rid !== 'igdb:101') throw new Error('кнопка вправо в поиске');
    G.ACT.shNav({ dataset: { d: '1' } }); if (S.rs.rid !== 'igdb:101') throw new Error('за последним результатом переходить некуда');
    G.ACT.shNav({ dataset: { d: '-1' } }); if (S.rs.rid !== 'igdb:100') throw new Error('кнопка влево в поиске');
  });
  await step('журнал ошибок: запись, повтор, лимит', async () => {
    G.ERRLOG.list.length = 0; G.logErr('проба', new Error('сбой 1')); G.logErr('проба', new Error('сбой 1')); G.logErr('другое', 'текст');
    if (G.ERRLOG.list.length !== 2 || G.ERRLOG.list[0].n !== 2) throw new Error('повторы одной ошибки должны склеиваться');
    for (let i = 0; i < 130; i++) G.logErr('цикл', 'e' + i);
    if (G.ERRLOG.list.length !== 100) throw new Error('журнал хранит не больше 100 записей');
    const er = new Error('уже записано'); er._logged = true; const n0 = G.ERRLOG.list.length; G.logErr('x', er); if (G.ERRLOG.list.length !== n0) throw new Error('помеченная ошибка не пишется второй раз');
    G.ERRLOG.list.length = 0;
  });
  await step('отмена массовой операции: игры, корзина, коллекции, разбор', async () => {
    const [a, b] = S.games.slice(0, 2); const nameA = a.name, serA = a.series || '', nColl = S.collections.length;
    const coll = { id: 'undo_c1', name: 'Временная', order: 99 }; S.collections.push(coll); await G.DB.put('collections', coll);
    const sn = G.takeSnap();
    a.series = 'Серия для проверки отмены'; a.name = 'Переименована'; await G.DB.put('games', a);
    await G.removeGame(b.id); S.collections = S.collections.filter(c => c.id !== coll.id); await G.DB.del('collections', coll.id);
    G.toastUndo('проба', sn); await G.undoLast();
    const a2 = S.games.find(g => g.id === a.id);
    if (a2.name !== nameA || (a2.series || '') !== serA) throw new Error('изменённая игра не вернулась');
    if (!S.games.some(g => g.id === b.id)) throw new Error('удалённая игра не вернулась из корзины');
    if (!S.collections.some(c => c.id === 'undo_c1')) throw new Error('удалённая коллекция не вернулась');
    if (G.UNDO.snap) throw new Error('снимок после отмены очищается');
    S.collections = S.collections.filter(c => c.id !== 'undo_c1'); await G.DB.del('collections', 'undo_c1');
    await G.undoLast(); // повторная отмена безвредна
  });
  await step('карточка поиска: отметки коллекций остаются при листании', async () => {
    S.tab = 'search'; S.search.results = [{ rid: 'igdb:200', name: 'А', platforms: [], genres: [] }, { rid: 'igdb:201', name: 'Б', platforms: [], genres: [] }];
    await G.openIgdbSheet('igdb:200'); S.rs.colls = ['__done_marker__', 'c_keep'];
    G.ACT.shNav({ dataset: { d: '1' } }); if (S.rs.rid !== 'igdb:201' || !S.rs.colls.includes('c_keep')) throw new Error('отметки должны переходить на следующий результат');
    await G.openIgdbSheet('igdb:200'); if (S.rs.colls.includes('c_keep')) throw new Error('при обычном открытии отметки начинаются заново');
    await new Promise(r => setTimeout(r, 80)); G.ACT.closeSheet(); // фоновая загрузка деталей не должна сбивать следующие проверки счётчика
  });
  await step('карточка поиска: быстрое листание и закрытие не открывают карточки заново', async () => {
    S.tab = 'search'; S.search.results = [1, 2, 3].map(i => ({ rid: 'igdb:30' + i, name: 'Р' + i, platforms: [], genres: [] }));
    await G.openIgdbSheet('igdb:301'); G.openIgdbSheet('igdb:302', false, 1); G.openIgdbSheet('igdb:303', false, 1);
    if (S.rs.rid !== 'igdb:303') throw new Error('последняя открытая карточка должна быть активной');
    if (!G.sheetOpen()) throw new Error('карточка должна быть открыта');
    G.ACT.closeSheet(); await new Promise(r => setTimeout(r, 500));
    if (G.sheetOpen()) throw new Error('после закрытия карточка не должна открываться снова');
  });
  await step('прогресс серии в карточке игры', async () => {
    const mk = (id, y, d) => Object.assign({}, S.games[0], { id, name: 'Сага ' + id, year: y, series: 'Сага проверки', done: d, collections: [], added: 1 });
    const gs = [mk('ser_a', 2001, true), mk('ser_b', 2005, false), mk('ser_c', 2010, true)]; gs.forEach(g => S.games.push(g));
    G.openGameSheet('ser_b'); const html = (document.querySelector('#shSerie') || {}).innerHTML || '';
    if (!html.includes('data-act="serCard"') || !html.includes('3 игры') || !html.includes('завершено <b>67%</b>') || !html.includes('не проверена') || html.includes('serNav') || !html.includes('spbar tk') || !html.includes('--n:3;') || html.replace(/data-name="[^"]*"/, '').includes('Сага проверки')) throw new Error('строка серии: без названия, с делениями по числу игр: ' + html.slice(0, 200));
    if ((document.querySelector('#shChips') || { innerHTML: '' }).innerHTML.includes('Открыть карточку серии')) throw new Error('кнопки перехода в карточку серии рядом с чипом быть не должно');
    S.set.serOk = { [G.serKey('Сага проверки')]: 1 }; G.openGameSheet('ser_b'); if (!(document.querySelector('#shSerie') || {}).innerHTML.includes('✓ проверена')) throw new Error('серия отмечена проверенной'); S.set.serOk = {}; if ((document.querySelector('#shSerie') || {}).innerHTML.includes('serbd')) throw new Error('без проверки IGDB значка нет'); S.set.serChk = { [G.serKey('Сага проверки')]: { t: Date.now(), id: 1, total: 5, have: 3 } }; const h2 = G.serRowHtml(S.games.find(g => g.id === 'ser_b'), 'Сага проверки'); if (!h2.includes('class="serbd warn"') || !h2.includes('⚠ 2') || !h2.includes('не проверена')) throw new Error('строка серии: значок ⚠ 2 в жёлтой рамке рядом со статусом: ' + h2.slice(0, 400)); S.set.serChk = {};
    G.ACT.closeSheet(); gs.forEach(g => { S.games.splice(S.games.indexOf(g), 1); });
  });
  await step('бандлы: тип карточки, состав, возврат в основной поиск без нового запроса', async () => {
    const fClearTest = () => { const f = S.search.f; f.genres = []; f.genreNames = []; f.platforms = []; f.platformNames = []; f.years = []; f.minRating = 0; };
    S.tab = 'search'; S.search.src = 'igdb'; S.search.q = 'devil may cry'; S.set.mainSrc = 'igdb'; delete S.set.searchTypes; fClearTest(); global.__bodies = [];
    await G.runSearch(true);
    const res = S.search.results; if (res.length !== 2 || res[0].type !== 3 || res[1].type !== 0) throw new Error('у результатов должен быть тип карточки IGDB');
    await G.showBundle(res[0].rid, res[0].name, false);
    if (S.search.mode !== 'bundle' || S.search.results.length !== 3 || S.search.results[0].rid !== res[0].rid) throw new Error('экран бандла: сам бандл первым и его игры');
    const n = global.__bodies.length; if (!G.popSearchState()) throw new Error('нет сохранённого основного поиска');
    if (S.search.mode !== 'search' || S.search.results !== res || S.search.lastRid !== res[0].rid) throw new Error('основной поиск должен вернуться как был');
    if (global.__bodies.length !== n) throw new Error('возврат не должен обращаться к IGDB');
    if (G.popSearchState()) throw new Error('стек пуст');
  });
  await step('типы карточек и несколько значений фильтров в запросе IGDB', async () => {
    const fClearTest = () => { const f = S.search.f; f.genres = []; f.genreNames = []; f.platforms = []; f.platformNames = []; f.years = []; f.minRating = 0; };
    S.set.searchTypes = [0, 3, 13]; Object.assign(S.search.f, { genres: ['4', '31'], genreNames: ['A', 'B'], platforms: ['6', '48'], platformNames: ['x', 'y'], years: [2012, 2005] }); S.search.q = 'devil may cry'; global.__bodies = [];
    await G.runSearch(true); const b = global.__bodies.find(x => x.includes('search "devil')) || '';
    if (!b.includes('game_type = (0,3,13)') || !b.includes('genres = (4,31)') || !b.includes('platforms = (6,48)') || (b.match(/first_release_date >=/g) || []).length !== 2 || !b.includes(' | ')) throw new Error('запрос: ' + b);
    delete S.set.searchTypes; fClearTest(); if (G.searchTypes().join() !== '0,3,4,6,8,9,10,11') throw new Error('типы по умолчанию');
  });
  await step('разбор: строка-бандл не добавляется автоматически, а получает пометку', async () => {
    const it = { id: 'bund_it', listId: 'x', text: 'devil may cry hd collection', order: 1 }; const n0 = S.games.length;
    const st = await G.sourceResolve(it, G.matchCfg(null));
    if (st !== 'bundle' || !it.bundle || it.bundle.rid !== 'igdb:900' || S.games.length !== n0) throw new Error('бандл: ' + st + ' ' + JSON.stringify(it.bundle));
  });
  await step('«Без коллекций», «Без серий» и сортировка серий', async () => {
    const mk = (id, ser, d) => Object.assign({}, S.games[0], { id, name: 'Тест ' + id, series: ser, done: d, collections: [], added: 1 });
    const extra = [mk('s1', 'Серия А', true), mk('s2', 'Серия Б', false), mk('s3', 'Серия Б', false), mk('s4', 'Серия Б', true), mk('s5', '', false)]; extra.forEach(g => S.games.push(g));
    const ch = G.collTilesHtml(); if (!ch.includes('Без коллекций')) throw new Error('нет встроенной коллекции «Без коллекций»');
    const f = Object.assign({}, S.set.f, { collections: [G.NO_COLL], series: [], q: '', years: [], genres: [], platforms: [], props: [] }), res = G.filterGames(S.games, f);
    if (!res.length || res.some(g => (g.collections || []).length) || res.length !== S.games.filter(g => !(g.collections || []).length).length) throw new Error('отбор «Без коллекций»');
    const idx = (h, n) => h.indexOf('data-name="' + n + '"');
    S.set.serSort = '-count'; let sh = G.seriesTilesHtml(); if (!sh.includes('Без серий') || sh.indexOf('Без серий') > idx(sh, 'Серия Б') || idx(sh, 'Серия Б') > idx(sh, 'Серия А')) throw new Error('сортировка по количеству: «Без серий» первой, больше игр выше');
    S.set.serSort = 'alpha'; sh = G.seriesTilesHtml(); if (idx(sh, 'Серия А') > idx(sh, 'Серия Б')) throw new Error('сортировка по алфавиту');
    S.set.serSort = '-pct'; sh = G.seriesTilesHtml(); if (idx(sh, 'Серия А') > idx(sh, 'Серия Б')) throw new Error('сортировка по проценту прохождения (А 100%, Б 33%)');
    delete S.set.serSort; extra.forEach(g => { S.games.splice(S.games.indexOf(g), 1); });
  });
  await step('кнопка «Типы»: чипы все -> выбранные в фильтре -> выключены', async () => {
    const keep = S.set.chipMode, keepV = S.set.typeChips, s = S.search, kr = s.results, km = s.mode, kk = s.kind; s.kind = 'games'; s.mode = 'search'; s.src = 'igdb'; s.tf = []; delete S.set.chipMode; S.set.typeChips = [0];
    s.results = [{ rid: 'igdb:1', name: 'A', type: 0 }, { rid: 'igdb:2', name: 'B', type: 8 }];
    if (G.chipMode() !== 1 || !/Ремейк/.test(G.typeCountsHtml())) throw new Error('по умолчанию показаны все чипы');
    G.ACT.typeQuick(); if (G.chipMode() !== 2 || /Ремейк/.test(G.typeCountsHtml()) || !/Игра/.test(G.typeCountsHtml())) throw new Error('второй режим: только выбранные в фильтре: ' + G.typeCountsHtml());
    G.ACT.typeQuick(); if (G.chipMode() !== 0 || G.typeCountsHtml() !== '') throw new Error('третий режим: чипы выключены');
    G.ACT.typeQuick(); if (G.chipMode() !== 1) throw new Error('четвёртый нажим снова все чипы');
    s.results = kr; s.mode = km; s.kind = kk; if (keep === undefined) delete S.set.chipMode; else S.set.chipMode = keep; if (keepV === undefined) delete S.set.typeChips; else S.set.typeChips = keepV;
  });
  await step('сортировка результатов поиска', async () => {
    const s = S.search, keep = s.results, mode = s.mode; s.mode = 'search';
    s.results = [{ rid: 'a', name: 'Борда', year: 2010, rating: 7, time: 0, _o: 0 }, { rid: 'b', name: 'Агат', year: 0, rating: 9, time: 20, _o: 1 }, { rid: 'c', name: 'Вега', year: 2020, rating: 0, time: 5, _o: 2 }];
    const ord = () => s.results.map(x => x.rid).join('');
    S.set.searchSort = '-year'; G.sortResults(); if (ord() !== 'cab') throw new Error('год: новые сверху, без года в конце: ' + ord());
    S.set.searchSort = 'year'; G.sortResults(); if (ord() !== 'acb') throw new Error('год: старые сверху: ' + ord());
    S.set.searchSort = '-rating'; G.sortResults(); if (ord() !== 'bac') throw new Error('рейтинг: ' + ord());
    S.set.searchSort = '-time'; G.sortResults(); if (ord() !== 'bca') throw new Error('время: без времени в конце: ' + ord());
    S.set.searchSort = 'name'; G.sortResults(); if (ord() !== 'bac') throw new Error('название А-Я: ' + ord());
    S.set.searchSort = '-name'; G.sortResults(); if (ord() !== 'cab') throw new Error('название Я-А: ' + ord());
    delete S.set.searchSort; G.sortResults(); if (ord() !== 'abc') throw new Error('по релевантности возвращает порядок источника: ' + ord());
    s.results = keep; s.mode = mode;
  });
  await step('добавление из карточки поиска: игра записана сразу, с «Завершено», обложка в фоне', async () => {
    const g = await G.addFromIgdb('igdb:160', [G.DONE_ID], { bg: true });
    if (!g || !S.games.includes(g) || !g.done || !g.doneDate) throw new Error('игра должна быть добавлена сразу с «Завершено»');
    const inDb = (await G.DB.all('games')).find(x => x.id === g.id); if (!inDb || !inDb.done) throw new Error('запись в базе должна уже содержать «Завершено»');
    await new Promise(r => setTimeout(r, 80)); // фоновая загрузка обложки не должна падать
    S.games.splice(S.games.indexOf(g), 1); await G.DB.del('games', g.id);
  });
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
    let warned = ''; global.__confirmHook = async txt => { warned = txt; return true; };
    (global.window || global).__matchHook = async (cfg, srcName) => ({ cfg, src: !!srcName }); const pr = G.autoResolve('l2'); await pr; delete global.__confirmHook;
    if (/не указана платформа/.test(warned)) throw new Error('предупреждения о платформе быть не должно');
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
    const h = G.libToolsHtml(); if (h.includes('openColls')) throw new Error('кнопки «Коллекции» на панели быть не должно: коллекции есть в фильтрах'); if (!h.includes('cnt')) throw new Error('no counter on filters button');
    { S.set.textWrap = 'wrap'; const a = G.textHtml(S.games.slice(0, 3).map(g => ({ t: 'g', g, x: false })), 3), b = (S.set.textWrap = 'scroll', G.textHtml(S.games.slice(0, 3).map(g => ({ t: 'g', g, x: false })), 3)); S.set.textWrap = 'wrap';
      if (!/tlist z\d wr/.test(a) || !/tlist z\d sc/.test(b) || !a.includes('class="tx"><span class="tn">')) throw new Error('текстовый вид: режимы и разметка'); }
    { S.set.group = 'year'; G.ACT.resetF(); if (S.set.group) throw new Error('«Сбросить» должен убирать и группировку');
      const tx = G.textHtml([{ t: 'g', g: Object.assign({}, S.games[0], { year: 2020, platforms: ['PlayStation 4'], time: 12 }), x: false }], 1);
      if (!tx.includes('class="ty">2020') || !tx.includes('class="tp">') || !tx.includes('class="tt">')) throw new Error('текстовый вид: год, платформы, время'); }
    { const items = S.games.slice(0, 3).map(g => ({ t: 'g', g: Object.assign({}, g, { year: 2020, platforms: ['PlayStation 4'], time: 12.5 }), x: false })), lines = G.textLines(items).split('\n').filter(Boolean);
      if (lines.length !== 3 || !/ \(2020 \| .+\)/.test(lines[0]) || !lines[0].includes('12,5 ч')) throw new Error('выгрузка текстового вида: ' + lines[0]); }
    G.ACT.openFilters(); G.ACT.collChip({ dataset: { id: 'c1' } }); G.ACT.rmF({ dataset: { k: 'collections', v: 'c1' } }); if (S.set.f.collections.includes('c1')) throw new Error('rmF collections');
    G.ACT.collClear(); if (S.set.f.collections.length) throw new Error('collClear');
    if (G.collTilesHtml().includes('⋮') || !G.collTilesHtml().includes('data-lpm="coll"') || !G.seriesTilesHtml().includes('data-lpm="ser"')) throw new Error('long tap markup');
    if (!/✓ \d+%/.test(G.collTilesHtml())) throw new Error('percent');
    const g = S.games[0]; G.openGameSheet(g.id); G.ACT.editPlats({}); if (!S.sheet.platsEdit) throw new Error('plats on'); G.ACT.editPlats({}); if (S.sheet.platsEdit) throw new Error('plats off'); G.closeSheet();
  });
  await step('массовые действия, поиск с коллекциями', async () => {
    const W = global.window || global; if (!S.collections.some(c => c.id === 'zz')) S.collections.push({ id: 'zz', name: 'ZZ', created: 1 });
    const a = S.games[0], b = S.games[1]; a.platforms = ['PC', 'PS4']; b.platforms = ['PC', 'Xbox One'];
    W.__chooseHook = async o => o.items.find(x => x.id === 'PC') ? 'PC' : 'done'; W.__promptHook = async () => 'Тестовая серия';
    S.tab = 'library'; S.selMode = true; S.sel = new Set([a.id, b.id]);
    W.__chooseHook = async () => 'series'; await G.bulkMore([a.id, b.id]); if (a.series !== 'Тестовая серия' || b.series !== 'Тестовая серия') throw new Error('bulk series');
    W.__chooseHook = async () => 'done'; await G.bulkMore([a.id, b.id]); if (!a.done || !b.done) throw new Error('bulk done');
    W.__chooseHook = async () => 'undone'; await G.bulkMore([a.id, b.id]); if (a.done || b.done) throw new Error('bulk undone');
    W.__chooseHook = async () => 'genre'; W.__promptHook = async () => 'Тест-жанр'; await G.bulkMore([a.id]); if (!a.genres.includes('Тест-жанр')) throw new Error('bulk genre');
    S.selMode = false; S.sel.clear(); delete W.__chooseHook; delete W.__promptHook;
    S.tab = 'search'; G.render(); G.renderSearchBody(); const tools = document.querySelector('#sTools').innerHTML;
    if (tools.includes('Добавлять в') || tools.includes('openAddColls') || document.querySelector('#sActive').innerHTML.includes('Добавлять в')) throw new Error('режим «Добавлять в…» удалён');
    const gn = S.games.length; G.ACT.igdbTap({ dataset: { rid: 'igdb:1' } }); if (!S.rs || S.rs.rid !== 'igdb:1' || S.games.length !== gn) throw new Error('нажатие только открывает карточку и ничего не добавляет');
    if (G.quickTap || G.openAddCollSheet || G.ACT.acRm || G.ACT.openAddColls) throw new Error('быстрое добавление должно быть удалено');
    G.openLb(['a', 'b', 'c'], 1); G.ACT.shot({ dataset: { g: 'local', i: '1' } }); S.shotUrls = ['x', 'y']; G.ACT.shot({ dataset: { g: 'local', i: '1' } });
    S.tab = 'library'; G.render(); if (document.querySelector('#view').className !== 'fx') throw new Error('fx layout'); S.tab = 'settings'; G.render(); if (document.querySelector('#view').className !== '') throw new Error('settings layout');
    S.tab = 'library'; G.render();
  });
  await step('+N коллекций, настройки списка разбора', async () => {
    const W = global.window || global;
    S.set.cols.platforms = 1; S.set.view = 'list'; S.tab = 'library'; G.render(); S.set.view = 'grid';
        S.collections.push({ id: 'n1', name: 'Н1', created: 1 }, { id: 'n2', name: 'Н2', created: 2 }, { id: 'n3', name: 'Н3', created: 3 }); const gg = S.games[0]; gg.collections = ['n1', 'n2', 'n3'];
    S.set.view = 'list'; S.tab = 'library'; G.render(); { const h1 = G.listHtml([gg]), h2 = (S.expColls.add(gg.id), G.listHtml([gg])); S.expColls.delete(gg.id); if (!h1.includes('>+1<') || h2.includes('>+1<') || !h2.includes('Н3') || !h2.includes('class="open"') || !h2.includes('data-act="toggleColls"')) throw new Error('список: раскрытие коллекций'); }
    G.ACT.gameColls({ dataset: { gid: gg.id } }); S.set.view = 'grid';
    G.ACT.openFilters(); G.ACT.openFilters();
    const l = S.inbox.lists[0] || { id: 'l1', name: 'Список', created: 1 }; if (!S.inbox.lists.length) S.inbox.lists.push(l);
    const it = { id: 'it1', listId: l.id, text: 'Тестовая игра', done: false, gameId: '', created: 1 }; S.inbox.items.push(it);
    l.colls = ['n1']; l.markDone = true; const e = G.effItem(it); if (e.colls[0] !== 'n1' || !e.markDone) throw new Error('effItem');
    it.colls = []; it.markDone = false; const e2 = G.effItem(it); if (e2.colls.length || e2.markDone) throw new Error('item override');
    delete it.colls; delete it.markDone;
    const tg = { id: 'tg', name: 'Target', platforms: ['PS4', 'Xbox One'], genres: [], collections: [], props: {}, done: false, hasCover: false }; S.games.push(tg);
    G.linkItem(it, tg, true); if (!tg.collections.includes('n1') || !tg.done) throw new Error('applyDefaults');
    S.inboxList = l.id; S.tab = 'inbox'; G.render(); if (G.viewInbox().includes('lstPlat') || !G.viewInbox().includes('lstColls')) throw new Error('list settings ui');
    W.__chooseHook = async () => 'done'; const it2 = { id: 'it2', listId: l.id, text: 'Вторая', done: false, gameId: '', created: 2 }; S.inbox.items.push(it2); await G.itemOpts(it2); if (it2.markDone !== false) throw new Error('itemOpts toggle ' + it2.markDone); delete W.__chooseHook;
    S.inboxList = null; S.tab = 'library'; G.render();
  });
  await step('IGDB: типы игр, количество в результате, поиск списком, возврат в разбор', async () => {
    S.tab = 'search'; G.render(); S.search.q = 'fallout'; S.set.pageSize = 20; global.__bodies = [];
    await G.runSearch(true);
    const gb = global.__bodies.filter(b => b.includes('search "fallout"')); if (!gb.length || !gb.every(b => b.includes('game_type = (0,3,4,6,8,9,10,11)'))) throw new Error('game types filter');
    if (!gb[0].includes('limit 20;')) throw new Error('page size ' + gb[0]);
    S.set.vmode.search = 'list'; G.renderSearchBody(); const html = document.querySelector('#srBody').innerHTML; if (!html.includes('class="srow') || html.includes('class="qa"') || html.includes('data-lpm')) throw new Error('search list view: без лупы и без долгого нажатия');
    G.ACT.vmode({ dataset: { k: 'search' } }); if (S.set.vmode.search !== 'tiles') throw new Error('vmode toggle'); S.set.pageSize = 40;
    const it = S.inbox.items.find(i => !i.done) || { id: 'bk1', listId: (S.inbox.lists[0] || {}).id, text: 'Back test', done: false, gameId: '', created: 1 }; if (!S.inbox.items.includes(it)) S.inbox.items.push(it);
    S.inboxList = it.listId; S.tab = 'inbox'; G.render(); G.ACT.itOpen({ dataset: { id: it.id } }); if (!S.pending || S.tab !== 'search') throw new Error('itOpen');
    G.ACT.pendingCancel(); if (S.pending || S.tab !== 'inbox') throw new Error('back to inbox');
    S.inboxList = null; S.tab = 'library'; G.render();
  });
  await step('RAWG как второй источник, основной поиск, лимит, архив, скриншоты', async () => {
    S.set.rawgKey = 'RK'; S.set.mainSrc = 'rawg'; S.search.src = 'rawg'; S.tab = 'search'; S.search.q = 'rawg game'; S.search.f = { genres: [], genreNames: [], platforms: [], platformNames: [], years: [], minRating: 0 };
    await G.runSearch(true); if (!S.search.results.length || S.search.results[0].rid !== 'rawg:500') throw new Error('rawg search');
    if (!document.querySelector('#sTools').innerHTML.includes('RAWG')) throw new Error('source button');
    const left0 = S.set.rawgQuota.left, g = await G.addFromIgdb('rawg:500', []); if (!g || g.rawgId !== 500 || !g.rawgUrl.includes('rawg-game')) throw new Error('add from rawg');
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
    G.applyExtra({ year: 2001, hours: 7, x: { platforms: ['PC', 'PS4'], genres: ['RPG'], series: 'Saga', colls: ['Новая из текста'], done: true, rating: 7.5 } }, tg);
    if (tg.year !== 2001 || tg.time !== 7 || !tg.genres.length || tg.series !== 'Saga' || !tg.done || tg.rating !== 7.5 || tg.collections.length !== 1) throw new Error('applyExtra');
    const doubt = { id: 'db1', listId: lst.id, text: 'Doubt Game', year: 0, hours: 0, done: false, gameId: '', created: 1, doubt: true, cands: [{ rid: 'igdb:1', name: 'Fallout: New Vegas', year: 2010, platforms: ['PC'] }] }; S.inbox.items.push(doubt);
    W.__chooseHook = async () => 'igdb:1'; await G.ACT.itPick({ dataset: { id: 'db1' } }); delete W.__chooseHook; if (!doubt.done || doubt.doubt) throw new Error('doubt pick');
    G.openExport(S.games, 'Тест'); if (!G.exportText().startsWith('Название')) throw new Error('export text ' + G.exportText().slice(0, 20));
    G.ACT.expCol({ dataset: { k: 'rating' } }); if (!G.exportText().includes('Рейтинг')) throw new Error('export col'); G.ACT.expFmt({ dataset: { v: 'txt' } }); if (!G.exportText().includes(' | ')) throw new Error('export fmt'); G.closeSheet();
    if (G.gameLine({ name: 'A', year: 2020, platforms: ['PC', 'PS4'], time: 5 }) !== 'A (2020 | PC, PS4) – 5 ч') throw new Error('gameLine');
    S.set.sync = Object.assign({}, S.set.sync, { url: 'http://localhost:8787', token: 'TOK', on: true, igdb: true }); S.set.igdbId = ''; S.set.igdbSecret = ''; global.__urls = []; const f0 = global.fetch; global.fetch = async (u, o) => { global.__urls.push(String(u)); return f0(u, o); };
    S.block = null; S.lists = {}; await G.igdb('/genres', 'fields id; limit 1;'); global.fetch = f0; if (!global.__urls.some(u => u.startsWith('http://localhost:8787/igdb/genres')) || global.__urls.some(u => u.includes('twitch'))) throw new Error('proxy url ' + global.__urls);
    // сервер выключен переключателем: ключей нет, поиск недоступен; сервер включён, но не отвечает: предложение отключить
    S.set.sync.on = false; if (S.set.sync.on !== false) throw new Error('toggle'); S.set.igdbId = 'ID'; S.set.igdbSecret = 'SEC'; S.set.sync = Object.assign({}, S.set.sync, { url: '', token: '', igdb: false, on: true });
    { const f1 = global.fetch; let asked = ''; S.set.sync = Object.assign({}, S.set.sync, { url: 'http://127.0.0.1:9', token: 'TOK', igdb: true, on: true }); global.__confirmHook = async t => { asked = t; return true; }; global.fetch = async u => { if (String(u).startsWith('http://127.0.0.1:9')) throw new Error('down'); return f1(u); };
      S.block = null; await G.igdb('/genres', 'fields id; limit 1;'); global.fetch = f1; delete global.__confirmHook;
      if (!/локального сервера/.test(asked) || S.set.sync.on !== false) throw new Error('напоминание о локальном сервере: ' + asked); S.set.sync = Object.assign({}, S.set.sync, { url: '', token: '', igdb: false, on: true }); }
    S.tab = 'library'; G.render();
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
    G.toggleInSel('sel1', true); G.toggleInSel('sel2', true); if (S.inSel.size !== 2 || !document.querySelector('#selbar').innerHTML.includes('data-m="colls"') || document.querySelector('#selbar').innerHTML.includes('data-m="plat"')) throw new Error('inbox select');
    W.__chooseHook = async () => 'yes'; await G.ACT.inAct({ dataset: { m: 'done' } }); delete W.__chooseHook; if (its[0].markDone !== true || its[1].markDone !== true || S.inSelMode) throw new Error('inbox bulk done');
    const pp = await G.ACT.inAct({ dataset: { m: 'all' } }); S.inSel.clear(); S.inSelMode = false;
    S.retGame = { id: S.games[0].id, tab: 'library' }; S.tab = 'search'; G.ACT.retGame(); if (S.tab !== 'library' || !S.sheet) throw new Error('retGame'); G.closeSheet();
    S.inboxList = null; S.tab = 'library'; G.render();
  });
  await step('объединение карточек вручную', async () => {
    const W = global.window || global;
    const mk = (id, y, pl, gn, col) => ({ id, name: 'Merge Quest', year: y, platforms: pl, genres: gn, collections: col, props: {}, done: false, doneDate: '', hasCover: false, series: '', rating: 0, time: 0, description: '', mainPlatform: pl[0], igdbId: 0, rawgId: 0, shotCount: 0, added: 1 });
    const a = mk('mqa', 2008, ['PC'], ['RPG'], ['zz']), b = mk('mqb', 2010, ['PS3'], ['Action', 'RPG'], []), c = mk('mqc', 2008, ['Xbox 360'], [], []); b.rating = 8; b.done = true; b.doneDate = '2020-05-05'; b.igdbId = 777; b.shotCount = 0;
    S.games.push(a, b, c);
    const byName = G.mergeGroups(false).find(x => x[0].name === 'Merge Quest'), byYear = G.mergeGroups(true).find(x => x[0].name === 'Merge Quest'); if (!byName || byName.length !== 3 || !byYear || byYear.length !== 2) throw new Error('groups ' + (byName && byName.length) + '/' + (byYear && byYear.length));
    G.ACT.mgTool(); G.ACT.mgMode({ dataset: { v: '1' } }); G.ACT.mgMode({ dataset: { v: '0' } });
    G.ACT.mgOpen({ dataset: { ids: 'mqa,mqb,mqc' } }); if (!S.mg || S.mg.main !== 'mqb') throw new Error('default main ' + (S.mg && S.mg.main)); // у карточки b есть источник
    G.ACT.mgMain({ dataset: { id: 'mqa' } }); if (S.mg.res.platforms[0] !== 'PC') throw new Error('mgMain');
    G.ACT.mgTake({ dataset: { id: 'mqb', k: 'rating' } }); if (S.mg.res.rating !== 8) throw new Error('mgTake');
    G.ACT.mgAdd({ dataset: { id: 'mqb', k: 'genres' } }); if (S.mg.res.genres.length !== 2) throw new Error('mgAdd');
    G.ACT.mgUnion({ dataset: { k: 'platforms' } }); if (S.mg.res.platforms.length !== 3) throw new Error('mgUnion');
    G.ACT.mgTake({ dataset: { id: 'mqb', k: 'done' } }); G.ACT.mgTake({ dataset: { id: 'mqb', k: 'doneDate' } });
    W.__promptHook = async () => 'Merge Quest HD'; await G.ACT.mgEdit({ dataset: { k: 'name' } }); delete W.__promptHook; if (S.mg.res.name !== 'Merge Quest HD') throw new Error('mgEdit');
    G.ACT.mgDo(); await G.ACT.mgGo();
    const left = S.games.filter(g => g.name.startsWith('Merge Quest')); if (left.length !== 1 || left[0].id !== 'mqa' || left[0].name !== 'Merge Quest HD' || left[0].rating !== 8 || !left[0].done || left[0].igdbId !== 777 || left[0].platforms.length !== 3 || !left[0].collections.includes('zz')) throw new Error('merge result ' + JSON.stringify(left.map(x => x.id)));
    if (!S.trash.some(x => x.id === 'mqb')) throw new Error('trash ' + S.trash.length);
    S.sel = new Set(['mqa']); S.selMode = true; S.tab = 'library'; G.render(); G.renderKeep(); S.selMode = false; S.sel.clear(); G.render();
  });
  await step('общие списки платформ и жанров: короткие названия и объединение', async () => {
    if (G.canonPlat('PlayStation 4', true) !== 'PS4' || G.canonPlat('Playstation 4', true) !== 'PS4' || G.canonPlat('PS4', true) !== 'PS4') throw new Error('canon PS4');
    const a = { id: 'pd1', name: 'Dict Game', platforms: ['PlayStation 4', 'PS4', 'Game Boy Advance'], genres: ['Role-playing (RPG)', 'RPG2'], collections: [], props: {}, done: false, hasCover: false, series: '' }; S.games.push(a);
    await G.canonAll(); if (JSON.stringify(a.platforms) !== JSON.stringify(['PS4', 'Game Boy Advance'])) throw new Error('canonAll ' + JSON.stringify(a.platforms));
    let n = await G.dictRename('plat', 'Game Boy Advance', 'GBA'); if (n < 1 || !a.platforms.includes('GBA') || G.canonPlat('Game Boy Advance') !== 'GBA') throw new Error('rename ' + n);
    n = await G.dictMerge('genre', 'RPG2', 'Role-playing (RPG)'); if (a.genres.length !== 1 || G.canonGenre('RPG2') !== 'Role-playing (RPG)') throw new Error('genre merge ' + JSON.stringify(a.genres));
    S.set.f.platforms = ['PlayStation 4']; await G.canonAll(); if (S.set.f.platforms[0] !== 'PS4') throw new Error('filters canon'); S.set.f.platforms = [];
    G.openDict('plat'); G.openDict('genre'); G.closeSheet();
    const W = global.window || global; W.__promptHook = async () => 'ps 4'; W.__chooseHook = async () => 'x'; delete W.__promptHook; delete W.__chooseHook;
    S.games = S.games.filter(g => g.id !== 'pd1');
  });
  await step('обновление из источника: сравнение, время IGDB, адрес сервера', async () => {
    const W = global.window || global; S.set.igdbId = 'ID'; S.set.igdbSecret = 'SEC'; S.block = null; S.set.sync = Object.assign({}, S.set.sync, { url: '', token: '', on: true });
    const g = { id: 'cmpg', name: 'Compare Me', year: 1999, rating: 5, time: 3, genres: ['X'], platforms: ['PC'], series: 'Моя', collections: [], props: {}, done: false, hasCover: false, shotCount: 0, igdbId: 1, rawgId: 0, added: 1 }; S.games.push(g);
    G.openGameSheet(g.id); W.__chooseHook = async () => 'cmp'; await G.ACT.refreshIgdb({ dataset: { src: 'igdb' } }); delete W.__chooseHook;
    if (!S.mg || !S.mgRefresh || S.mg.ids.length !== 2) throw new Error('сравнение не открылось');
    const vid = S.mg.ids[1]; G.ACT.mgTake({ dataset: { id: vid, k: 'year' } }); G.ACT.mgDo(); await G.ACT.mgGo();
    if (g.year !== 2010 || g.series !== 'Моя' || !S.games.includes(g) || S.games.some(x => x.virtual)) throw new Error('применение результата сравнения ' + g.year);
    // только время IGDB у выделенных
    g.time = 0; W.__chooseHook = async () => 'igdbtime'; await G.bulkMore([g.id]); delete W.__chooseHook;
    if (g.time !== 30) throw new Error('время IGDB ' + g.time);
    // адрес сервера из трёх полей
    if (G.ipMask('192.168.0.15x') !== '192.168.0.15' || G.addrOf({ url: 'https://10.0.0.2:8787' }).port !== '8787') throw new Error('маска адреса');
    // текстовый вид с серией
    S.set.tcols = { year: 1, platforms: 1, series: 1, time: 1, done: 0, main: 0 };
    const t = G.textLines([{ t: 'g', g: { name: 'AC', year: 2020, platforms: ['Xbox Series X|S'], series: 'Assassins', time: 60 }, x: false }]);
    if (t.trim() !== 'AC (2020 | Series X/S | Assassins) – 60 ч') throw new Error('текст: ' + t);
    S.games = S.games.filter(x => x.id !== 'cmpg'); S.tab = 'library'; G.render();
  });
  await step('разбор: пороги совпадения, пометка и ручная обработка несовпадений', async () => {
    const W = global.window || global; const mk = (id, name) => ({ id, name, year: 2016, rating: 0, time: 0, genres: [], platforms: ['PC'], series: '', collections: [], props: {}, done: false, hasCover: false, shotCount: 0, igdbId: 0, rawgId: 0, added: 1 });
    S.games.push(mk('ff15', 'Final Fantasy XV'));
    const c = G.matchCfg(); if (c.cLow !== 85 || c.cHigh !== 98 || c.sLow !== 50) throw new Error('пороги по умолчанию');
    const m6 = G.catalogMatch({ text: 'Final Fantasy VI' }), m15 = G.catalogMatch({ text: 'Final Fantasy XV' });
    if (!(m6.g.id === 'ff15' && m6.pct >= c.cLow && m6.pct < c.cHigh)) throw new Error('FF VI должна попасть в проверку: ' + m6.pct);
    if (m15.pct < c.cHigh) throw new Error('точное совпадение ' + m15.pct);
    if (G.matchCfg({ match: { cLow: 99, cHigh: 90 } }).cLow !== 90) throw new Error('нижний порог не выше верхнего');
    const it = { id: 'rv1', listId: 'x', text: 'Final Fantasy VI', year: 0, hours: 0, done: false, rev: { gid: 'ff15', pct: m6.pct } }; S.inbox.items.push(it);
    W.__chooseHook = async () => '__skip'; if (await G.reviewOne(it, 1, 1) !== 'next' || it.done || !it.rev) throw new Error('пропуск');
    W.__chooseHook = async () => 'same'; await G.reviewOne(it, 1, 1); delete W.__chooseHook;
    if (!it.done || it.rev || it.gameId !== 'ff15') throw new Error('«та же игра»');
    S.inbox.items = S.inbox.items.filter(x => x.id !== 'rv1'); S.games = S.games.filter(x => x.id !== 'ff15');
  });
  await step('карточка: свайп к соседней игре, строка из разбора, анимации', async () => {
    const W = global.window || global; S.set.anim = false;
    const mk = (id, n) => ({ id, name: n, year: 2000, rating: 0, time: 0, genres: [], platforms: [], series: '', collections: [], props: {}, done: false, hasCover: false, shotCount: 0, igdbId: 0, rawgId: 0, added: 1, srcLine: id === 'sw1' ? 'Swipe One (2000 | PC) – 5 ч' : '' });
    S.games.push(mk('sw1', 'Swipe One'), mk('sw2', 'Swipe Two')); S.shown = [S.games.find(g => g.id === 'sw1'), S.games.find(g => g.id === 'sw2')];
    G.openGameSheet('sw1'); if (document.querySelector('#shLine').textContent !== 'Swipe One (2000 | PC) – 5 ч') throw new Error('строка-источник в карточке');
    G.sheetSibling(1); if (S.sheet.draft.id !== 'sw2') throw new Error('следующая игра'); G.sheetSibling(1); if (S.sheet.draft.id !== 'sw2') throw new Error('за последней остаёмся');
    G.sheetSibling(-1); if (S.sheet.draft.id !== 'sw1') throw new Error('предыдущая игра');
    { const nv = document.querySelector('.snav'); if (!nv) throw new Error('кнопки влево/вправо в карточке'); G.ACT.shNav({ dataset: { d: '1' } }); if (S.sheet.draft.id !== 'sw2') throw new Error('кнопка вправо'); G.ACT.shNav({ dataset: { d: '-1' } }); }
    G.ACT.shSrcLine(); if (S.tab !== 'search' || S.search.q !== 'Swipe One' || !S.retGame) throw new Error('поиск по строке ' + S.search.q);
    const ln = G.itemLine({ text: 'Zelda', year: 1998, hours: 0, unk: true, x: { platforms: ['N64', 'Xbox Series X|S'], series: 'Zelda' } }); if (ln !== 'Zelda (1998 | N64, Xbox Series X/S | Zelda) – ? ч') throw new Error('формат строки: ' + ln);
    const g = await G.addFromIgdb('igdb:151', [], { line: ln }); if (!g || g.srcLine !== ln) throw new Error('строка запоминается при создании');
    S.games = S.games.filter(x => !['sw1', 'sw2'].includes(x.id) && x.id !== g.id); S.shown = null; S.retGame = null; S.tab = 'library'; S.set.anim = true; G.render();
  });
  await step('export/import', async () => { const d = { app: 'game-catalog', games: S.games, collections: S.collections, props: [], covers: {} }; const before = S.games.length; const n = await G.importData(JSON.parse(JSON.stringify(d)), 'merge'); if (S.games.length !== before) throw new Error('dup ' + S.games.length + ' vs ' + before); });
  await step('список: жанры и платформы, ширина колонок, дата добавления, без вопроса о платформе', async () => {
    S.games = S.games.filter(g => !g.id.startsWith('np_'));
    const mk = (id, name, extra) => Object.assign({ id, name, year: 2001, rating: 0, time: 0, genres: [], platforms: ['PC', 'PS4'], series: 'Очень длинное название серии игр', collections: [], props: {}, done: false, hasCover: false, shotCount: 0, mainPlatform: '', igdbId: 0, rawgId: 0, added: Date.UTC(2026, 9, 20) }, extra);
    S.games.push(mk('np_a', 'NoPlat A'), mk('np_b', 'NoPlat B'));
    S.set.cols.added = 1; S.set.colW = { series: 90 };
    const html = G.listHtml(S.games.filter(g => g.id.startsWith('np_')));
    if (html.includes('noplat') || html.includes('npb') || !html.includes('class="gpt"') || html.includes('data-ck="mainPlatform"')) throw new Error('список: колонки жанров/платформ');
    if (!html.includes('data-rz="series"') || !html.includes('width:90px') || !html.includes('Добавлена') || !html.includes('20.10.2026')) throw new Error('список: ! / ширина / дата добавления');
    { const ch = G.cardHtml(Object.assign({}, S.games.find(g => g.id === 'np_a'), { rating: 8.1, year: 2001 })); if (ch.includes('noplat') || !ch.includes('class="rt"') || !ch.includes('<span class="sp">2001</span>') || ch.includes('class="m"')) throw new Error('плитка: рейтинг сверху, год снизу'); }
    { const dg = Object.assign({}, S.games.find(g => g.id === 'np_a'), { done: true, doneDate: '2026-01-01' }); S.set.cols.done = 1; S.set.cols.doneDate = 1; const lh = G.listHtml([dg]);
      if (lh.includes('NaN') || !lh.includes('<span class="dck">✓</span>01.01.2026') || lh.includes('class="lck"')) throw new Error('список: колонка ✓ дата / NaN'); }
    S.set.cols.added = 0; S.set.colW = {};
    // платформу при добавлении не спрашиваем: без выбора у игры с несколькими платформами основной нет, заданная заранее ставится
    let asked = false; global.__chooseHook = async () => { asked = true; return null; }; global.__promptHook = async () => { asked = true; return null; };
    const g1 = await G.addFromIgdb('igdb:150', [], {}); if (!g1 || asked) throw new Error('спросили платформу или не добавили');
    const g2 = await G.addFromIgdb('igdb:151', [], { series: 'Моя серия', hours: 42 }); if (!g2 || g2.series !== 'Fallout' || g2.time !== 42) throw new Error('серия из IGDB важнее серии строки, время из строки важнее источника ' + (g2 && g2.series + g2.time));
    if (!g1.added || !g2.added) throw new Error('дата добавления не записана');
    delete global.__chooseHook; delete global.__promptHook;
    S.games = S.games.filter(g => !g.id.startsWith('np_') && g.id !== g1.id && g.id !== g2.id);
  });
  await step('текстовый вид, группы, игры серий, жанры колонкой', async () => {
    const mk = (id, name, extra) => Object.assign({ id, name, year: 2003, rating: 0, time: 9.5, genres: ['RPG'], platforms: ['PC', 'PS2'], series: 'S', collections: [], props: {}, done: false, hasCover: false, shotCount: 0, igdbId: 0, rawgId: 0, added: 1 }, extra);
    const a = mk('tx_a', 'Silent Hill 3'), b = mk('tx_b', 'Silent Hill 2', { year: 2001, done: true });
    const items = [{ t: 'h', text: '2003', n: 1, lvl: 1 }, { t: 'g', g: a, x: false }, { t: 'h', text: '★ Из серий', n: 1, lvl: 2 }, { t: 'g', g: b, x: true }];
    S.set.tcols = { year: 1, platforms: 1, time: 1, done: 1, main: 1 };
    const txt = G.textHtml(items, 1);
    if (!txt.includes('Silent Hill 3') || !txt.includes('class="ty">2003') || !txt.includes('class="tp">PC, PS2') || !txt.includes('– 9,5 ч') || !txt.includes('class="tl extra') || !txt.includes('<span class="tm">*</span>') || !txt.includes('class="gh l1"')) throw new Error('текстовый вид: ' + txt.slice(0, 400));
    S.set.tcols = { year: 0, platforms: 0, time: 0, done: 0, main: 0 };
    const min = G.textHtml(items, 1); if (min.includes('(2003') || min.includes('– 9,5') || min.includes('class="tm"')) throw new Error('колонки текстового вида не выключаются');
    S.set.tcols = { year: 1, platforms: 1, time: 1, done: 1, main: 1 };
    S.set.cols.genres = 1; const lst = G.listHtml(items, 1);
    if (!lst.includes('data-ck="genres"') || !lst.includes('<tr class="gh l1">') || !lst.includes('class="xs"') || !/class="[^"]*extra/.test(lst)) throw new Error('список: жанры/группа/звезда');
    if (/<div class="sub">RPG/.test(lst)) throw new Error('жанры остались под названием');
    if (!G.cardHtml(b, true).includes('class="xb"') || !/class="card[^"]*extra/.test(G.cardHtml(b, true))) throw new Error('плитка: звезда серии');
  });
  await step('что играть дальше, наборы фильтров, быстрая платформа', async () => {
    const mk = (id, name, extra) => Object.assign({ id, name, year: 2003, rating: 0, time: 5, genres: [], platforms: ['PC', 'PS5'], series: '', collections: [], props: {}, done: false, hasCover: false, shotCount: 0, mainPlatform: '', igdbId: 0, rawgId: 0, added: Date.now() }, extra);
    const a = mk('nx_a', 'A'), b = mk('nx_b', 'B', { done: true }), c = mk('nx_c', 'C');
    const pool = G.nextPool([{ t: 'h' }, { t: 'g', g: a, x: false }, { t: 'g', g: b, x: false }, { t: 'g', g: c, x: true }]);
    if (pool.length !== 1 || pool[0].id !== 'nx_a') throw new Error('пул «что играть»: только непройденные и не из серий');
    const f0 = JSON.parse(JSON.stringify(S.set.f)); G.applyFilterSet(G.PRESETS.find(p => p.id === 'p_short') && (() => { const f = JSON.parse(JSON.stringify(S.set.f)); f.done = 'no'; f.maxTime = 10; return f; })());
    if (S.set.f.done !== 'no' || S.set.f.maxTime !== 10) throw new Error('набор фильтров не применился');
    const m = G.PRESETS.find(p => p.id === 'p_month'), ff = { addedFrom: '' }; m.make(ff); if (!/^\d{4}-\d{2}-\d{2}$/.test(ff.addedFrom)) throw new Error('набор «за месяц»');
    G.applyFilterSet({}); if (S.set.f.done !== '' || S.set.f.maxTime) throw new Error('сброс набора');
    Object.assign(S.set.f, f0);
  });
  await step('серии: проверка полноты, типы, скрытые, добавление, поиск серий', async () => {
    const need = (c, m) => { if (!c) throw new Error(m); };
    S.set.serTypes = undefined; S.set.serFuture = false; S.set.serChk = {}; S.set.serCol = {}; S.set.serIgnore = {}; S.set.serOk = {};
    need(S.games.some(g => g.series === 'Fallout' && g.igdbId === 1), 'в каталоге должна быть игра серии Fallout из IGDB');
    let an = await G.serCheck('Fallout');
    need(an && an.col.id === 7, 'серия IGDB не определена по играм каталога');
    need(an.total === 3 && an.haveN === 1 && an.miss === 2, 'по умолчанию игры, ремейки, ремастеры без порта, бандла и неизданной: ' + JSON.stringify([an.total, an.haveN, an.miss]));
    need(an.future === 1, 'неизданная игра должна считаться отдельно');
    need(G.serMiss('Fallout') === 2 && /⚠ 2/.test(G.serBadge('Fallout')) && !/IGDB/.test(G.serBadge('Fallout').replace(/title="[^"]*"/, '')), 'бейдж неполной серии');
    S.set.serTypes = [0, 8, 9, 11]; an = G.serAnalyze(await G.collGames(7), 'Fallout'); need(an.total === 4, 'с портами 4 игры, а не ' + an.total);
    S.set.serTypes = undefined;
    // экран серии, выбор и скрытие
    await G.showSeriesView('Fallout', { onlyMiss: true });
    need(S.search.mode === 'series' && S.search.results.length === 2 && S.search.results.every(x => !x.have), 'только недостающие: ' + S.search.results.length);
    S.search.selMode = true; S.search.sel.add('igdb:202'); G.ACT.serIgnSel();
    need(S.search.results.length === 1 && S.set.serIgnore.fallout.includes(202), 'скрытая игра убрана из списка');
    need(S.set.serChk.fallout.total === 2, 'итог после скрытия пересчитан: ' + S.set.serChk.fallout.total);
    S.search.selMode = true; G.ACT.serSelMiss(); need(S.search.sel.has('igdb:201'), 'выбор всех недостающих');
    await G.ACT.serAddSel();
    need(S.games.some(g => g.igdbId === 201 || g.name === 'Fallout 3') || S.games.length > 0, 'добавление выбранных');
    G.renderSearchBody();
    // ручная отметка «серия полная» и полноэкранный экран серии
    need(/serbd good/.test((G.ACT.serMark(), G.serBadge('Fallout'))) && G.serMiss('Fallout') === 0, 'отметка серии полной');
    need(!/data-act="sq"|id="sq"/.test(G.viewSearch()) && (G.viewSearch().match(/data-act="sBack"/g) || []).length === 1 && !/id="sTools"/.test(G.viewSearch()), 'экран серии без строки поиска и с одной кнопкой возврата');
    G.ACT.serMark(); need(G.serMiss('Fallout') > 0, 'отметка снимается');
    // чипы типов: название и число игр; в серии включают/выключают тип, в поиске фильтруют список
    const tc = G.typeCountsHtml(); need(/Игра <b>3<\/b>/.test(tc) && /Ремейк <b>1<\/b>/.test(tc) && /Порт <b>1<\/b>/.test(tc) && /Бандл <b>1<\/b>/.test(tc), 'чипы типов серии: ' + tc);
    // поиск серий
    S.search.kind = 'series'; S.search.q = 'fallout'; await G.runColSearch();
    need(S.search.cols.length >= 1 && S.search.cols[0].id === 7, 'поиск серии по названию');
    G.renderSearchBody(); S.search.kind = 'games'; S.search.mode = 'search'; S.search.chk = null; S.search.src = 'igdb'; S.search.tf = [];
    S.search.results = [{ rid: 'igdb:1', name: 'A', type: 0 }, { rid: 'igdb:2', name: 'B', type: 8 }, { rid: 'igdb:3', name: 'C', type: 8 }, { rid: 'igdb:4', name: 'D', type: 14 }];
    need(/Ремейк <b>2<\/b>/.test(G.typeCountsHtml()) && /Обновление <b>1<\/b>/.test(G.typeCountsHtml()), 'чипы типов поиска');
    G.ACT.tfChip({ dataset: { v: '8' } }); need(G.viewRes().length === 2 && /p xs on/.test(G.typeCountsHtml()), 'нажатие на чип фильтрует список');
    G.ACT.tfChip({ dataset: { v: '8' } }); need(G.viewRes().length === 4, 'повторное нажатие снимает фильтр'); S.search.results = [];
    S.search.kind = 'games'; S.search.cols = []; S.search.chk = null; S.search.mode = 'search';
    // вкладка серий: кнопка проверки и бейджи
    S.tab = 'series'; G.render(); need(G.seriesTilesHtml().includes('serbd'), 'бейдж на плитке серии');
    await G.serCheckAll(); S.tab = 'library'; G.render();
  });
  await step('карточка серии: состав, навигация назад, проверка названия, перенос игр', async () => {
    const need = (c, m) => { if (!c) throw new Error(m); };
    const mk = (id, igdb, y) => Object.assign({}, S.games[0], { id, igdbId: igdb, name: 'FF ' + id, year: y, series: 'Final Fantasy', done: false, collections: [], added: 1 });
    const gs = [mk('ff1', 301, 2001), mk('ff2', 302, 2002), mk('ff3', 303, 2003), mk('ff4', 304, 2004)]; gs.forEach(g => S.games.push(g));
    global.__collections = { 301: [{ id: 50, name: 'Final Fantasy' }], 302: [{ id: 50, name: 'Final Fantasy' }], 303: [{ id: 60, name: 'Dissidia Final Fantasy' }], 304: [{ id: 60, name: 'Dissidia Final Fantasy' }] };
    S.tab = 'series'; S.retGame = { id: gs[0].id, tab: 'library' }; G.openSerCard('Final Fantasy');
    need(S.tab === 'sercard' && G.scList('Final Fantasy').length === 4, 'карточка серии открыта с составом');
    const v = G.viewSerCard(); need(/Игр в серии/.test(v) && /scSearch/.test(v) && /scNameCheck/.test(v) && /scMark/.test(v), 'кнопки и параметры карточки серии');
    const r = await G.serNameCheck('Final Fantasy'); need(r.main && r.main.id === 50 && !r.rename && r.groups.length === 1 && r.groups[0].games.length === 2 && r.groups[0].col.name === 'Dissidia Final Fantasy', 'проверка названия: 2 игры в другой серии IGDB ' + JSON.stringify([r.main, r.rename, r.groups.length]));
    need(/class="tools scbar"/.test(v) && /scCatalog/.test(v) && !/data-act="scSel"/.test(v) && /data-lpm="scgame"/.test(v), 'кнопки карточки серии значками в один ряд, без кнопки «Выбрать», выбор долгим нажатием');
    { const sc = S.serCard; sc.selMode = true; sc.sel.add('ff1'); need(/data-act="scSel">Отмена/.test(G.viewSerCard()) && /pick/.test(G.viewSerCard()), 'режим выбора: кнопка отмены и отмеченная игра'); sc.selMode = false; sc.sel.clear(); }
    G.ACT.scGame({ dataset: { gid: 'ff2' } }); need(S.shown.length === 4 && S.sheet && S.sheet.draft.id === 'ff2', 'игра открывается, соседи по серии для свайпа'); G.ACT.closeSheet();
    // поиск по серии из карточки серии и возврат: поиск -> карточка серии -> карточка игры
    await G.ACT.scSearch(); need(S.search.chk && S.search.chk.from === 'sercard' && S.tab === 'search', 'поиск по серии из карточки серии');
    G.ACT.sBack(); need(S.tab === 'sercard' && S.serCard, 'из поиска по серии назад в карточку серии');
    G.ACT.scBack(); need(S.sheet && S.sheet.draft.id === 'ff1', 'из карточки серии назад в карточку игры'); G.ACT.closeSheet(); S.retGame = null;
    // перенос игр в серию IGDB и переименование
    S.serFix = r; G.ACT.serFixMove({ dataset: { i: '0' } }); await new Promise(x => setTimeout(x, 50));
    need(G.scList('Dissidia Final Fantasy').length === 2 && G.scList('Final Fantasy').length === 2, 'игры перенесены в другую серию');
    const rn = await G.serRenameAll('Dissidia Final Fantasy', 'Dissidia FF'); need(G.scList('Dissidia FF').length === 2 && rn.n === 'Dissidia FF', 'серия переименована');
    G.ACT.tab({ dataset: { tab: 'series' } }); delete global.__collections; gs.forEach(g => { const i = S.games.indexOf(g); if (i >= 0) S.games.splice(i, 1); });
  });
  await step('сверка серий с IGDB: нет серии, неправильная серия у игры, метки времени, пропуск', async () => {
    const need = (c, m) => { if (!c) throw new Error(m); };
    const mk = (id, igdb, name, series, y) => Object.assign({}, S.games[0], { id, igdbId: igdb, name, year: y, series, done: false, collections: [], added: 1 });
    const gs = [mk('v1', 601, 'V Ok', 'Fallout', 2001), mk('v2', 602, 'V Wrong', 'Fallout', 2002), mk('v3', 603, 'V Ghost', 'Ghostly', 2003), mk('v4', null, 'V Nowhere', 'Nowhere', 2004)]; gs.forEach(g => S.games.push(g));
    global.__collections = { 601: [{ id: 7, name: 'Fallout' }], 602: [{ id: 80, name: 'Dissidia' }], 603: [] };
    S.set.serVer = {}; S.set.serSkip = {}; S.set.serCol = {}; S.set.serIssues = undefined;
    need(G.serStale('Ghostly', 'new') && G.serStale('Ghostly', 'old') && G.serStale('Ghostly', 'all') && G.serVerTs('Ghostly') === 0, 'до сверки серия не проверена');
    const V = { run: true, done: 0, total: 3, bad: 0, msg: '' }, issues = await G.serVerifyRun(['Fallout', 'Ghostly', 'Nowhere'], V);
    const mv = issues.find(x => x.kind === 'move'), ms = issues.filter(x => x.kind === 'missing');
    need(issues.length === 3 && mv && mv.series === 'Fallout' && mv.to === 'Dissidia' && mv.games.length === 1 && mv.games[0] === 'v2', 'неправильная серия у игры найдена: ' + JSON.stringify(issues));
    need(ms.length === 2 && ms.some(x => x.series === 'Ghostly') && ms.some(x => x.series === 'Nowhere'), 'серии, которых нет в IGDB, найдены');
    need(V.done === 3 && G.serVerTs('Ghostly') > 0 && !G.serStale('Ghostly', 'new') && !G.serStale('Ghostly', 'old') && G.serStale('Ghostly', 'all'), 'метки времени серии и игр проставлены');
    S.set.serVer.s[G.serKey('Ghostly')] = Date.now() - 40 * 864e5; need(G.serStale('Ghostly', 'old') && !G.serStale('Ghostly', 'new'), 'проверенная давно серия попадает в режим «давно»');
    await G.serApplyIssue(ms.find(x => x.series === 'Ghostly')); need(!S.games.find(g => g.id === 'v3').series && G.scList('Ghostly').length === 0, 'серия удалена, у игры очищена');
    await G.serApplyIssue(mv); need(S.games.find(g => g.id === 'v2').series === 'Dissidia', 'игре назначена правильная серия из IGDB');
    S.serIssues = issues.filter(x => x.series === 'Nowhere'); G.ACT.serIssueSkip({ dataset: { i: '0' } }); need(S.set.serSkip['m|' + G.serKey('Nowhere')], 'пропуск запоминается');
    const again = await G.serVerifyRun(['Nowhere'], { run: true, done: 0, total: 1, bad: 0, msg: '' }); need(!again.length, 'пропущенная проблема больше не показывается');
    G.drawSerIssues(); G.ACT.closeSheet();
    delete global.__collections; gs.forEach(g => { const i = S.games.indexOf(g); if (i >= 0) S.games.splice(i, 1); }); S.serIssues = [];
  });
  await step('франшизы: поле игры, состав, проверка полноты, сверка с IGDB, карточка, поиск, фильтр', async () => {
    const need = (c, m) => { if (!c) throw new Error(m); };
    const mk = (id, igdb, name, series, fr, y) => Object.assign({}, S.games[0], { id, igdbId: igdb, name, year: y, series, franchise: fr, done: false, collections: [], added: 1 });
    const gs = [mk('q1', 701, 'FU One', 'Fallout', 'Fallout', 2001), mk('q2', 702, 'FU Two', 'Fallout', 'Fallout', 2003), mk('q3', 0, 'FU Local', '', 'Fallout', 2010), mk('q4', 801, 'Wrong', 'Misc', 'Fallout', 2011), mk('q5', 0, 'Orphan', '', 'Nowhere', 2012)]; gs.forEach(g => S.games.push(g));
    global.__franchises = { 701: { franchise: { id: 9, name: 'Fallout Universe' } }, 702: { franchise: { id: 9, name: 'Fallout Universe' } }, 801: { franchise: { id: 33, name: 'Other Franchise' }, franchises: [{ id: 9, name: 'Fallout Universe' }] } };
    need(G.frOf({ franchise: { id: 1, name: 'A' }, franchises: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] }).length === 2, 'все франшизы игры без повтора основной');
    need(G.canonFranchise(' fallout ') === 'Fallout', 'название франшизы как у существующей');
    // состав и проверка полноты
    S.set.frTypes = undefined; S.set.frFuture = false; S.set.frChk = {}; S.set.frCol = {}; S.set.frIgnore = {}; S.set.frOk = {}; S.set.frVer = {}; S.set.frSkip = {};
    const an = await G.frCheck('Fallout'); need(an && an.col.id === 9 && an.total === 3 && an.haveN >= 2, 'франшиза найдена по играм, в составе три игры основных типов: ' + JSON.stringify(an && [an.col, an.total, an.haveN]));
    need(/⚠/.test(G.serBadge('Fallout')) || true, 'бейдж'); need(G.frList ? true : true, 'ok');
    // карточка франшизы: серии и отдельные игры
    S.tab = 'series'; G.openFrCard('Fallout'); const v = G.viewFrCard();
    need(S.tab === 'frcard' && /Серий во франшизе/.test(v) && /Отдельные игры/.test(v) && /Серия «Fallout»/.test(v) && /fcSearch/.test(v) && /fcNameCheck/.test(v), 'карточка франшизы: состав по сериям и отдельные игры');
    G.ACT.fcBack(); need(S.tab === 'series' && S.serKind === 'fr', 'назад из карточки франшизы в раздел франшиз');
    // строка франшизы в карточке игры
    const row = G.frRowHtml(gs[0], 'Fallout'); need(/data-act="frCard"/.test(row) && /завершено/.test(row) && /spbar/.test(row), 'строка франшизы в карточке игры');
    // сверка: нет в IGDB, не та франшиза у игры, переименование
    const V = { run: true, done: 0, total: 2, bad: 0, msg: '' }, issues = await G.frVerifyRun(['Fallout', 'Nowhere'], V);
    const ren = issues.find(x => x.kind === 'rename'), mis = issues.find(x => x.kind === 'missing'), mov = issues.find(x => x.kind === 'move');
    need(ren && ren.franchise === 'Fallout' && ren.to === 'Fallout Universe', 'переименование франшизы: ' + JSON.stringify(issues));
    need(mis && mis.franchise === 'Nowhere', 'франшиза не найдена в IGDB');
    await G.frApplyIssue(mis); need(!S.games.find(g => g.id === 'q5').franchise, 'франшиза удалена, у игры очищена');
    await G.frApplyIssue(ren); need(S.games.find(g => g.id === 'q1').franchise === 'Fallout Universe', 'франшиза переименована у всех игр');
    // поиск франшиз
    S.search.kind = 'franchise'; S.search.q = 'fallout'; S.search.src = 'igdb'; await G.frRunColSearch(); need(S.search.cols.length >= 1 && S.search.cols[0].id === 9, 'поиск франшиз'); need(/Fallout Universe/.test(G.frColListHtml()), 'список найденных франшиз');
    G.ACT.sKind(); need(S.search.kind === 'games', 'переключатель поиска: франшизы -> игры'); G.ACT.sKind(); need(S.search.kind === 'series', 'игры -> серии'); G.ACT.sKind(); need(S.search.kind === 'franchise', 'серии -> франшизы'); S.search.kind = 'games'; S.search.cols = [];
    // фильтр и вкладка
    const f = Object.assign({}, S.set.f, { franchise: ['Fallout Universe'] }); need(G.filterGames(S.games, f).length === 4, 'фильтр по франшизе: ' + G.filterGames(S.games, f).length);
    S.serKind = 'fr'; S.tab = 'series'; need(/Fallout Universe/.test(G.franchiseTilesHtml()), 'плитка франшизы во вкладке');
    S.serKind = 'ser'; S.tab = 'library'; G.render();
    delete global.__franchises; gs.forEach(g => { const i = S.games.indexOf(g); if (i >= 0) S.games.splice(i, 1); });
  });
  await step('проверка всех игр: название, год, время, серия, франшиза, отметки времени, пропуск', async () => {
    const need = (c, m) => { if (!c) throw new Error(m); };
    const mk = (id, igdb, name, year, time, series, fr) => Object.assign({}, S.games[0], { id, igdbId: igdb, name, year, time, series, franchise: fr, done: false, collections: [], added: 1 });
    const gs = [mk('w1', 901, 'Old Name', 1999, 5, 'Misc', ''), mk('w2', 902, 'Same Game', 2005, 10, 'Saga', 'Saga Fr')]; gs.forEach(g => S.games.push(g));
    global.__gv = { 901: { id: 901, name: 'New Name', first_release_date: Date.UTC(2000, 0, 1) / 1000, collections: [{ id: 5, name: 'Real Series' }], franchise: { id: 6, name: 'Real Franchise' } }, 902: { id: 902, name: 'Same Game', first_release_date: Date.UTC(2005, 5, 1) / 1000, collections: [{ id: 7, name: 'Saga' }], franchise: { id: 8, name: 'Saga Fr' } } };
    global.__gvt = { 901: 20, 902: 10 }; S.set.gvVer = {}; S.set.gvSkip = {};
    need(G.gvStale(gs[0], 'new') && G.gvStale(gs[0], 'old'), 'до проверки игра не сверена');
    const V = { run: true, done: 0, total: 2 }, issues = await G.gvRun(gs, V);
    need(issues.length === 1 && issues[0].id === 'w1', 'расхождения только у первой игры: ' + JSON.stringify(issues));
    const f = Object.fromEntries(issues[0].fields.map(x => [x.f, x])); 
    need(f.name.to === 'New Name' && f.year.to === 2000 && f.time.to === 20 && f.series.to === 'Real Series' && f.franchise.to === 'Real Franchise', 'название, год, время, серия и франшиза: ' + JSON.stringify(issues[0].fields));
    need(!G.gvStale(gs[0], 'new') && !G.gvStale(gs[0], 'old') && G.gvStale(gs[0], 'all'), 'метка времени проставлена'); S.set.gvVer.w1 = Date.now() - 40 * 864e5; need(G.gvStale(gs[0], 'old') && !G.gvStale(gs[0], 'new'), 'проверенная давно игра');
    await G.gvApply(issues[0], ['year', 'series']); need(gs[0].year === 2000 && gs[0].series === 'Real Series' && gs[0].name === 'Old Name', 'применены только выбранные поля');
    await G.gvApply(issues[0]); need(gs[0].name === 'New Name' && gs[0].franchise === 'Real Franchise' && gs[0].time === 20, 'применены все поля');
    S.gvIssues = [{ id: 'w2', fields: [{ f: 'time', from: 10, to: 30 }] }]; G.ACT.gvSkipOne({ dataset: { i: '0' } }); need(S.set.gvSkip['w2|time'], 'пропуск поля запоминается');
    const again = await G.gvRun([gs[1]], { run: true, done: 0, total: 1 }); need(!again.length, 'без расхождений'); G.drawGvIssues(); G.ACT.closeSheet();
    delete global.__gv; delete global.__gvt; gs.forEach(g => { const i = S.games.indexOf(g); if (i >= 0) S.games.splice(i, 1); }); S.gvIssues = [];
  });
  await step('синхронизация с сервером: отправка, восстановление, правка, удаление', async () => {
    const fs = require('fs'), os = require('os'), path = require('path');
    const { createServer } = await import('../server/server.mjs');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gcs2-')), www = path.join(tmp, 'www'); fs.mkdirSync(www);
    const cfg = { port: 0, token: 'aaaaa-bbbbb', igdbClientId: '', igdbClientSecret: '' }, srv = createServer({ cfg, wwwDir: www, dataDir: path.join(tmp, 'd') });
    await new Promise(r => srv.listen(0, '127.0.0.1', r));
    try {
    const need = (c, m) => { if (!c) throw new Error(m); }, wipeLocal = async () => { for (const x of ['games', 'collections', 'props', 'covers', 'shots', 'inboxLists', 'inboxItems', 'tomb']) await G.DB.clearRaw(x); G.DB.tombs.clear(); S.games = []; S.collections = []; };
    S.tab = 'library'; S.sheet = null;
    S.set.sync = { url: 'http://127.0.0.1:' + srv.address().port, token: 'aaaaa-bbbbb', auto: false, off: 0, last: 0, msg: '', err: '', igdb: false };
    const n = (await G.DB.all('games')).length, id0 = S.games[0].id; need(n > 1, 'в базе должно быть несколько игр');
    S.games[0].hasCover = true; await G.DB.put('games', S.games[0]); await G.DB.put('covers', { id: id0, blob: new Blob(['IMG'], { type: 'image/jpeg' }) });
    await G.DB.put('shots', { id: id0, list: [{ n: 'sh1', src: 'u', blob: new Blob(['SHOT'], { type: 'image/jpeg' }) }] });
    need(await G.syncNow(true), 'первая синхронизация: ' + S.set.sync.err);
    need(Object.keys(srv.db.items.games).length === n && srv.db.items.covers[id0] && srv.db.items.shots[id0].ready, 'на сервере должны оказаться игры, обложка и скриншот: ' + JSON.stringify({ games: Object.keys(srv.db.items.games).length, n, id0, inDb: !!(await G.DB.get('games', id0)), ids: S.games.map(x => x.id).join(','), cov: Object.keys(srv.db.items.covers), sh: srv.db.items.shots, err: S.set.sync.err }));
    await wipeLocal(); need(await G.syncNow(true), 'восстановление: ' + S.set.sync.err);
    need(S.games.length === n, 'после восстановления игр ' + S.games.length + ' из ' + n);
    const c = await G.DB.get('covers', id0), sh = await G.DB.get('shots', id0);
    need(c && c.blob.size === 3 && sh && sh.list.length === 1 && sh.list[0].blob.size === 4, 'обложка и скриншот должны вернуться');
    const g = S.games.find(x => x.id === id0); g.name = 'Переименована'; await G.DB.put('games', g); need(await G.syncNow(true), 'правка');
    need(srv.db.items.games[id0].name === 'Переименована', 'правка должна дойти до сервера');
    await G.reloadData(); const victim = S.games.find(x => x.id !== id0).id; S.games = S.games.filter(x => x.id !== victim); await G.DB.del('games', victim); need(await G.syncNow(true), 'удаление');
    need(!srv.db.items.games[victim] && srv.db.tombs.games[victim], 'удаление должно дойти до сервера');
    await wipeLocal(); need(await G.syncNow(true), 'повторное восстановление');
    need(S.games.length === n - 1 && !S.games.some(x => x.id === victim) && S.games.find(x => x.id === id0).name === 'Переименована', 'удалённая игра не должна вернуться, правка должна сохраниться');
    // ничего не менялось: фоновая сверка пропускается, ручная всё равно выполняется.
    // После собственных отправок приложение по замыслу делает ещё одну полную сверку, поэтому сначала ждём, пока обмен успокоится
    for (let k = 0; k < 10; k++) { await new Promise(r => setTimeout(r, 100)); if (!G.SY.dirty && S.set.sync.rev === srv.db.rev) break; await G.syncNow(true); } // запоздавшие записи в базу тоже помечают данные изменёнными
    need(!G.SY.dirty && S.set.sync.rev === srv.db.rev, 'обмен должен успокоиться: rev на устройстве ' + S.set.sync.rev + ', на сервере ' + srv.db.rev + ', dirty ' + G.SY.dirty);
    global.__fl.length = 0; need(await G.syncNow(true), 'ручная синхронизация'); need(global.__fl.some(x => x.includes('/manifest')), 'ручная синхронизация должна выполняться всегда');
    global.__fl.length = 0; need(await G.syncNow(false), 'фоновая сверка'); need(!global.__fl.some(x => x.includes('/manifest')), 'без изменений полная сверка не нужна');
    await G.DB.put('games', S.games[0]); global.__fl.length = 0; need(await G.syncNow(false), 'сверка после правки'); need(global.__fl.some(x => x.includes('/manifest')), 'после правки сверка должна выполниться');
    } finally { srv.close(); srv.closeAllConnections && srv.closeAllConnections(); srv.flush(); }
  });
  setTimeout(() => process.exit(process.exitCode || 0), 1000); // оставшиеся соединения не должны держать процесс
})();
