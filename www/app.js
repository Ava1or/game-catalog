'use strict';
(() => {
/* ====================== Утилиты ====================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const hasVal = v => v !== undefined && v !== null && v !== '' && v !== false;
const clone = o => JSON.parse(JSON.stringify(o));
const isNative = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const plug = n => window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n];

const COLS = [['cover', 'Обложка'], ['genres', 'Жанры'], ['platforms', 'Платформы'], ['done', 'Прошёл'], ['year', 'Год'], ['rating', 'Рейтинг'], ['time', 'Время'], ['series', 'Серия'], ['colls', 'Коллекции']];
const SORTS = [['name', 'Название'], ['year', 'Год'], ['rating', 'Рейтинг'], ['time', 'Время прохождения'], ['series', 'Серия'], ['added', 'Дата добавления'], ['done', 'Прошёл']];
const DEFAULTS = {
  rawgKey: '', sgdbKey: '', pin: true, propCols: {}, theme: 'dark', zoom: {}, usage: { m: '', rawg: 0, sgdb: 0, hltb: 0 }, hltbCache: {}, view: 'grid',
  cols: { cover: 1, genres: 1, platforms: 1, done: 1, year: 1, rating: 1, time: 1, series: 1, colls: 1 },
  f: { q: '', years: [], genres: [], platforms: [], series: [], collections: [], collMode: 'or', props: [], done: '', minRating: 0, sort: 'name', dir: 'asc' }
};

/* ====================== Чистая логика ====================== */
const isPartNo = w => /^\d+$/.test(w) || /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i.test(w);
function cleanSeries(t) {
  let r = String(t).trim(), again = true;
  while (again) {
    again = false; r = r.trim();
    if (r && ':-–—,.;'.includes(r.slice(-1))) { r = r.slice(0, -1); again = true; }
    const w = r.split(/\s+/).filter(Boolean);
    if (w.length > 1 && isPartNo(w[w.length - 1])) { w.pop(); r = w.join(' '); again = true; }
  }
  return r;
}
// RAWG не отдаёт название серии - определяем по общему началу названий игр серии
const tok = w => w.replace(/[:,;.\-–—]+$/, '').toLowerCase();
function seriesName(names) {
  const w1 = names[0].split(/\s+/).filter(Boolean);
  let len = w1.length;
  for (let i = 1; i < names.length; i++) {
    const w = names[i].split(/\s+/).filter(Boolean);
    let k = 0;
    while (k < len && k < w.length && tok(w[k]) === tok(w1[k])) k++;
    len = k;
  }
  let res = cleanSeries(w1.slice(0, len).join(' '));
  if (res.length < 3 || res.toUpperCase() === 'THE') res = cleanSeries(names[0].split(':')[0]);
  return res;
}
function shortPlat(n) {
  const m = [[/^PlayStation (\d)/i, '$&'], [/^Xbox Series/i, 'Series X|S'], [/^Xbox One/i, 'XONE'], [/^Xbox 360/i, 'X360'], [/^Nintendo Switch 2/i, 'Switch 2'], [/^Nintendo Switch/i, 'Switch'], [/^PS Vita/i, 'Vita'], [/^PlayStation Vita/i, 'Vita']];
  for (const [re, to] of m) { if (re.test(n)) return to === '$&' ? n.replace(/^PlayStation (\d)/i, 'PS$1') : to; }
  return n.replace(/^PlayStation$/i, 'PS1').replace('Apple Macintosh', 'Mac').replace('Nintendo ', '');
}
function filterGames(games, f) {
  const q = (f.q || '').trim().toLowerCase();
  return games.filter(g => {
    if (q && !g.name.toLowerCase().includes(q)) return false;
    if (f.years.length && !f.years.map(String).includes(String(g.year))) return false;
    if (f.genres.length && !(g.genres || []).some(x => f.genres.includes(x))) return false;
    if (f.platforms.length && !(g.platforms || []).some(x => f.platforms.includes(x))) return false;
    if (f.series.length && !f.series.includes(g.series)) return false;
    if (f.done === 'yes' && !g.done) return false;
    if (f.done === 'no' && g.done) return false;
    if (f.minRating && (g.rating || 0) < f.minRating) return false;
    if (f.collections.length) {
      const has = id => (g.collections || []).includes(id);
      if (!(f.collMode === 'and' ? f.collections.every(has) : f.collections.some(has))) return false;
    }
    if (f.props.length && !f.props.some(id => hasVal(g.props && g.props[id]))) return false;
    return true;
  });
}
function sortGames(list, f) {
  const k = f.sort, d = f.dir === 'desc' ? -1 : 1;
  const isProp = k.startsWith('prop:');
  const val = g => k === 'name' ? (g.name || '').toLowerCase() : k === 'series' ? (g.series || '').toLowerCase() : isProp ? ((g.props && g.props[k.slice(5)] != null) ? g.props[k.slice(5)] : '') : (g[k] || 0);
  list.sort((a, b) => {
    const x = val(a), y = val(b);
    if ((k === 'series' || isProp) && !x !== !y) return !x ? 1 : -1; // пустые значения в конце
    const c = (typeof x === 'string' || typeof y === 'string') ? String(x).localeCompare(String(y), 'ru', { numeric: true }) : x - y;
    return c ? c * d : (a.name || '').localeCompare(b.name || '', 'ru');
  });
  return list;
}
function thumbUrl(u) { return String(u || '').replace('/media/games/', '/media/resize/420/-/games/'); }

const norm = t => String(t).toLowerCase().replace(/[^a-z0-9а-яё]+/g, ' ').trim();
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
  return p[n];
}
const simRaw = (a, b) => { a = norm(a); b = norm(b); const L = Math.max(a.length, b.length) || 1; return 1 - lev(a, b) / L; };
const headOf = t => String(t).split(/[:–—]/)[0];
// сравнение полных названий и «голов» до двоеточия (подзаголовок не должен мешать)
function similarity(a, b) { return Math.max(simRaw(a, b), simRaw(headOf(a), headOf(b)) * 0.97); }
// HLTB отдаёт время в секундах; берём СРЕДНЕЕ из «основной сюжет» и «сюжет + допы»
function hltbCandidates(data, name) {
  const h = v => Math.round((v || 0) / 360) / 10;
  return (data || []).filter(x => x && (x.comp_main > 0 || x.comp_plus > 0)).map(x => {
    const m = x.comp_main || 0, p = x.comp_plus || 0, avg = m && p ? (m + p) / 2 : (m || p);
    return { id: x.game_id, name: x.game_name, year: x.release_world || 0, hours: h(avg), main: h(m), plus: h(p), score: similarity(name, x.game_name || '') };
  }).sort((a, b) => b.score - a.score).slice(0, 10);
}

if (typeof document === 'undefined') { // для проверки логики в Node
  module.exports = { seriesName, cleanSeries, shortPlat, filterGames, sortGames, DEFAULTS, hltbCandidates, similarity };
  return;
}

/* ====================== Хранилище (IndexedDB) ====================== */
const DB = {
  db: null,
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('gamecatalog', 2);
      r.onupgradeneeded = () => {
        const d = r.result;
        ['games', 'collections', 'props', 'covers', 'inboxLists', 'inboxItems'].forEach(n => { if (!d.objectStoreNames.contains(n)) d.createObjectStore(n, { keyPath: 'id' }); });
        if (!d.objectStoreNames.contains('settings')) d.createObjectStore('settings', { keyPath: 'key' });
      };
      r.onsuccess = () => { this.db = r.result; res(); };
      r.onerror = () => rej(r.error);
    });
  },
  tx(store, mode, fn) {
    return new Promise((res, rej) => {
      const t = this.db.transaction(store, mode); const r = fn(t.objectStore(store));
      t.oncomplete = () => res(r ? r.result : undefined); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  },
  all(s) { return this.tx(s, 'readonly', o => o.getAll()); },
  get(s, k) { return this.tx(s, 'readonly', o => o.get(k)); },
  put(s, v) { return this.tx(s, 'readwrite', o => o.put(v)); },
  del(s, k) { return this.tx(s, 'readwrite', o => o.delete(k)); },
  clear(s) { return this.tx(s, 'readwrite', o => o.clear()); }
};

/* ====================== Состояние ====================== */
const S = {
  games: [], collections: [], props: [], set: clone(DEFAULTS), lists: {},
  block: null, inbox: { lists: [], items: [] }, inboxList: null, pending: null, showDone: true,
  tab: 'library', selMode: false, sel: new Set(), shown: [],
  search: { q: '', f: { genre: '', genreName: '', platform: '', platformName: '', year: '', minRating: 0 }, results: [], page: 0, hasMore: false, count: 0, loading: false, token: 0, mode: 'search', title: '', started: false }
};
const coverCache = new Map();
let installEvt = null;
const saveSet = () => DB.put('settings', { key: 'main', value: S.set });
const normName = t => String(t == null ? '' : t).replace(/\s+/g, ' ').trim().toLowerCase();
function canonSeries(name) {
  const n = String(name || '').replace(/\s+/g, ' ').trim(); if (!n) return '';
  const key = n.toLowerCase(), cnt = new Map();
  S.games.forEach(g => { if (g.series && normName(g.series) === key) cnt.set(g.series, (cnt.get(g.series) || 0) + 1); });
  return cnt.size ? Array.from(cnt.entries()).sort((a, b) => b[1] - a[1])[0][0] : n;
}
const gameById = id => S.games.find(g => g.id === id);
const collById = id => S.collections.find(c => c.id === id);
const gamesIn = id => S.games.filter(g => (g.collections || []).includes(id));
async function saveGame(g) { g.updated = Date.now(); await DB.put('games', g); }

async function loadAll() {
  await DB.open();
  S.games = (await DB.all('games')).map(g => Object.assign({ genres: [], platforms: [], collections: [], props: {}, series: '', description: '', time: 0, rating: 0, year: 0, done: false, hasCover: false }, g));
  S.collections = await DB.all('collections');
  S.props = await DB.all('props');
  S.inbox = { lists: await DB.all('inboxLists'), items: await DB.all('inboxItems') };
  const st = await DB.get('settings', 'main');
  if (st && st.value) {
    S.set = Object.assign(clone(DEFAULTS), st.value);
    S.set.cols = Object.assign(clone(DEFAULTS.cols), st.value.cols || {});
    S.set.f = Object.assign(clone(DEFAULTS.f), st.value.f || {});
  }
  S.set.zoom = S.set.zoom || {}; S.set.hltbCache = S.set.hltbCache || {};
  S.set.usage = Object.assign({ m: '', rawg: 0, sgdb: 0, hltb: 0 }, S.set.usage);
  const ls = await DB.get('settings', 'lists'); if (ls) S.lists = ls.value || {};
  for (const c of await DB.all('covers')) coverCache.set(c.id, URL.createObjectURL(c.blob));
}

/* ====================== Обложки ====================== */
const coverSrc = g => coverCache.get(g.id) || (g.coverUrl ? thumbUrl(g.coverUrl) : '');
async function toThumb(blob, maxW = 420) {
  const bmp = await createImageBitmap(blob); const k = Math.min(1, maxW / bmp.width);
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(r, 'image/jpeg', 0.82));
}
async function setCover(id, blob) {
  await DB.put('covers', { id, blob });
  if (coverCache.has(id)) URL.revokeObjectURL(coverCache.get(id));
  coverCache.set(id, URL.createObjectURL(blob));
  const g = gameById(id); if (g) g.hasCover = true;
}
async function cacheCover(g) {
  if (!g.coverUrl) return;
  try { const r = await fetch(thumbUrl(g.coverUrl)); if (!r.ok) return; await setCover(g.id, await toThumb(await r.blob())); } catch (e) { /* останется ссылка */ }
}

/* ====================== RAWG ====================== */
const RAWG_LIMIT = 20000;
const monthKey = () => new Date().toISOString().slice(0, 7);
function usageCount(k) { const u = S.set.usage; return u.m === monthKey() ? u[k] : 0; }
function bump(k) {
  const u = S.set.usage, m = monthKey();
  if (u.m !== m) { u.m = m; u.rawg = 0; u.sgdb = 0; u.hltb = 0; }
  u[k]++;
  if (k === 'rawg' && (u.rawg === RAWG_LIMIT * 0.9 || u.rawg === RAWG_LIMIT * 0.975)) toast('Использовано ' + Math.round(u.rawg * 100 / RAWG_LIMIT) + '% месячного лимита RAWG');
  clearTimeout(bump.t); bump.t = setTimeout(saveSet, 1500);
}
function setBlock(type, text) { S.block = { type, text }; }
function blockBanner(full) {
  if (!S.block) return '';
  return '<div class="banner red">⚠ ' + esc(S.block.text) + '<div class="toolbar" style="margin:8px 0 0">' + (full ? '<button class="btn" data-act="tab" data-tab="settings">Открыть настройки</button>' : '') + '<button class="btn" data-act="unblock">Повторить</button></div></div>';
}
function usageHtml() {
  const n = usageCount('rawg'), pct = Math.min(100, Math.round(n * 100 / RAWG_LIMIT));
  return '<p class="sub">Запросов к RAWG в этом месяце: <b>' + n + '</b> из ' + RAWG_LIMIT + ' (бесплатный тариф). Счётчик ведётся на этом устройстве, на телефоне и на компьютере он отдельный.</p><div class="pb"><i style="width:' + pct + '%;background:' + (pct >= 90 ? '#e5484d' : 'var(--green)') + '"></i></div>';
}
async function rawg(path, params = {}) {
  if (!S.set.rawgKey) throw new Error('Укажите ключ RAWG в настройках');
  if (S.block) throw new Error(S.block.text);
  const u = new URL('https://api.rawg.io/api' + path); u.searchParams.set('key', S.set.rawgKey);
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v); });
  bump('rawg');
  let r; try { r = await fetch(u.toString()); } catch (e) { throw new Error('Нет связи с RAWG (проверьте интернет)'); }
  if (!r.ok) {
    let txt = ''; try { txt = await r.text(); } catch (e) { /* без текста */ }
    if (r.status === 429 || /limit|quota|exceed|throttl/i.test(txt)) setBlock('limit', 'Лимит запросов RAWG исчерпан (бесплатно 20 000 в месяц). Запросы остановлены; нажмите «Повторить», когда лимит обновится.');
    else if (r.status === 401 || r.status === 403 || (r.status === 400 && /key/i.test(txt))) setBlock('key', 'Ключ RAWG не принят. Проверьте ключ в настройках: поиск и загрузка из RAWG заблокированы.');
    else throw new Error('RAWG: ошибка ' + r.status);
    throw new Error(S.block.text);
  }
  return r.json();
}
const mapItem = x => ({
  rawgId: x.id, name: x.name, year: x.released ? +x.released.slice(0, 4) : 0, rating: x.rating ? Math.round(x.rating * 20) / 10 : 0,
  time: x.playtime || 0, cover: x.background_image || '', platforms: (x.platforms || []).map(p => p.platform.name), genres: (x.genres || []).map(g => g.name)
});
async function fetchDetails(id) {
  const [d, ser] = await Promise.all([rawg('/games/' + id), rawg('/games/' + id + '/game-series', { page_size: 40 }).catch(() => null)]);
  const list = ser && ser.results ? ser.results : [];
  return { d, series: list.length ? seriesName([d.name].concat(list.map(x => x.name))) : '', seriesCount: list.length };
}
function gameFromRawg(d, series) {
  return {
    id: uid(), rawgId: d.id, name: d.name, year: d.released ? +d.released.slice(0, 4) : 0, rating: d.rating ? Math.round(d.rating * 20) / 10 : 0,
    time: d.playtime || 0, description: d.description_raw || '', genres: (d.genres || []).map(x => x.name),
    platforms: (d.platforms || []).map(x => x.platform.name), series, coverUrl: d.background_image || '', coverSrc: 'rawg', hasCover: false,
    collections: [], props: {}, done: false, added: Date.now(), updated: Date.now()
  };
}
const adding = new Set();
async function addFromRawg(rawgId, collIds = []) {
  let g = S.games.find(x => x.rawgId === rawgId);
  if (!g) {
    if (adding.has(rawgId)) return null;
    adding.add(rawgId);
    try {
      const { d, series } = await fetchDetails(rawgId);
      const n0 = gameFromRawg(d, series), year0 = d.released ? +d.released.slice(0, 4) : 0;
      const manual = S.games.find(x => !x.rawgId && normName(x.name) === normName(d.name) && (!x.year || !year0 || x.year === year0));
      if (manual && await confirmBox('Игра «' + manual.name + '» уже есть в каталоге (добавлена вручную). Объединить с данными RAWG?', 'Объединить')) {
        g = manual; g.rawgId = d.id;
        ['year', 'rating', 'time', 'description', 'coverUrl'].forEach(k => { if (!g[k] && n0[k]) g[k] = n0[k]; });
        if (!g.genres.length) g.genres = n0.genres; if (!g.platforms.length) g.platforms = n0.platforms; if (!g.series) g.series = canonSeries(n0.series);
        if (!g.hasCover) { g.coverSrc = 'rawg'; await cacheCover(g); }
        await saveGame(g);
      } else {
        g = n0; g.series = canonSeries(g.series); S.games.push(g); await DB.put('games', g); await cacheCover(g);
      if (!g.coverUrl && S.set.sgdbKey) { try { await sgdbAuto(g); } catch (e) { /* останется без обложки */ } }
      }
    } finally { adding.delete(rawgId); }
  }
  collIds.forEach(id => { if (!g.collections.includes(id)) g.collections.push(id); });
  await saveGame(g);
  return g;
}
async function loadLists() {
  if (S.lists.genres && S.lists.platforms) return S.lists;
  const [g, p] = await Promise.all([rawg('/genres'), rawg('/platforms/lists/parents')]);
  S.lists = {
    genres: g.results.map(x => ({ id: x.id, name: x.name })),
    platforms: [].concat(...p.results.map(x => (x.platforms || []).map(y => ({ id: y.id, name: y.name }))))
  };
  await DB.put('settings', { key: 'lists', value: S.lists });
  return S.lists;
}

/* ====================== SteamGridDB ====================== */
const SGDB = 'https://www.steamgriddb.com/api/v2';
async function sgdb(path) {
  if (!S.set.sgdbKey) throw new Error('Укажите ключ SteamGridDB в настройках');
  bump('sgdb');
  let r; try { r = await fetch(SGDB + path, { headers: { Authorization: 'Bearer ' + S.set.sgdbKey } }); } catch (e) { throw new Error('Нет связи с SteamGridDB (в браузере запросы могут блокироваться, используйте приложение)'); }
  if (r.status === 401 || r.status === 403) throw new Error('Ключ SteamGridDB не принят');
  if (!r.ok) throw new Error('SteamGridDB: ошибка ' + r.status);
  const j = await r.json(); if (j.success === false) throw new Error('SteamGridDB: ' + ((j.errors || [])[0] || 'ошибка'));
  return j.data || [];
}
const sgdbSearch = name => sgdb('/search/autocomplete/' + encodeURIComponent(name));
async function sgdbGrids(id) {
  let list = await sgdb('/grids/game/' + id + '?dimensions=600x900,342x482,660x930&types=static&nsfw=false&humor=false');
  if (!list.length) list = (await sgdb('/grids/game/' + id + '?types=static&nsfw=false&humor=false')).filter(x => x.height > x.width);
  return list.sort((a, b) => (b.score || 0) - (a.score || 0));
}
async function applyCoverUrl(g, url) {
  try { const r = await fetch(url); if (!r.ok) throw new Error('x'); await setCover(g.id, await toThumb(await r.blob())); g.coverUrl = ''; }
  catch (e) { // скачать не удалось - показываем по ссылке
    await DB.del('covers', g.id); if (coverCache.has(g.id)) { URL.revokeObjectURL(coverCache.get(g.id)); coverCache.delete(g.id); }
    g.hasCover = false; g.coverUrl = url;
  }
  g.coverSrc = 'sgdb'; await saveGame(g);
}
async function sgdbAuto(g) {
  const found = await sgdbSearch(g.name); if (!found.length) return false;
  const grids = await sgdbGrids(found[0].id); if (!grids.length) return false;
  await applyCoverUrl(g, grids[0].url); return true;
}
async function openSgdb(gid) {
  const g = gameById(gid); if (!g) return;
  if (!S.set.sgdbKey) return toast('Укажите ключ SteamGridDB в настройках');
  try {
    toast('Ищем в SteamGridDB…');
    const found = await sgdbSearch(g.name); if (!found.length) return toast('В SteamGridDB игра не найдена');
    let id = found[0].id;
    if (found.length > 1) { const r = await choose({ title: 'Игра в SteamGridDB', items: found.slice(0, 15).map(x => ({ id: x.id, label: x.name })) }); if (r === null) return; id = r; }
    const grids = await sgdbGrids(id); S.sgdb = { gid, grids };
    openSheet('<h2 style="margin:0 0 6px">Обложки SteamGridDB</h2><p class="sub">Нажмите на обложку, чтобы сделать её основной. В базе остаётся только выбранная.</p>'
      + (grids.length ? '<div class="grid" style="--cols:3">' + grids.slice(0, 60).map((x, i) => '<div class="card" data-act="sgdbUse" data-i="' + i + '"><div class="cv" style="background-image:url(\'' + esc(x.thumb || x.url) + '\')"></div></div>').join('') + '</div>' : '<p class="hint">Подходящих обложек нет</p>')
      + '<button class="btn" style="width:100%;margin-top:12px" data-act="closeSheet">Закрыть</button>');
  } catch (e) { toast(e.message); }
}

/* ====================== HowLongToBeat (только Android) ====================== */
const HLTB = 'https://howlongtobeat.com';
let hltbLast = 0;
async function hltbFetch(url, opts) {
  bump('hltb');
  const wait = hltbLast + 1200 - Date.now(); if (wait > 0) await new Promise(r => setTimeout(r, wait));
  hltbLast = Date.now(); return fetch(url, opts);
}
async function hltbSearchRaw(term) {
  const ua = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';
  const baseH = { Accept: 'application/json', Origin: HLTB, Referer: HLTB + '/', 'User-Agent': ua };
  const payload = { searchType: 'games', searchTerms: term.split(/\s+/).filter(Boolean), searchPage: 1, size: 20, searchOptions: { games: { userId: 0, platform: '', sortCategory: 'popular', rangeCategory: 'main', rangeTime: { min: 0, max: 0 }, gameplay: { perspective: '', flow: '', genre: '', difficulty: '' }, rangeYear: { min: '', max: '' }, modifier: '' }, users: { sortCategory: 'postcount' }, lists: { sortCategory: 'follows' }, filter: '', sort: 0, randomizer: 0 }, useCache: true };
  const bases = S.set.hltbBase ? [S.set.hltbBase] : ['/api/search/site', '/api/search', '/api/find', '/api/bleed'];
  let err = 'сайт не ответил';
  for (const base of bases) {
    try {
      const h = Object.assign({ 'Content-Type': 'application/json' }, baseH), body = Object.assign({}, payload);
      const ir = await hltbFetch(HLTB + base + '/init?t=' + Date.now(), { headers: baseH });
      if (ir.ok) { const ij = await ir.json(); if (ij.token) h['x-auth-token'] = ij.token; if (ij.hpKey) { h['x-hp-key'] = ij.hpKey; h['x-hp-val'] = ij.hpVal; body[ij.hpKey] = ij.hpVal; } }
      const r = await hltbFetch(HLTB + base, { method: 'POST', headers: h, body: JSON.stringify(body) });
      if (!r.ok) { err = 'ошибка ' + r.status; continue; }
      const j = await r.json(); if (!Array.isArray(j.data)) { err = 'неожиданный ответ'; continue; }
      if (S.set.hltbBase !== base) { S.set.hltbBase = base; saveSet(); }
      return j.data;
    } catch (e) { err = e.message || 'сбой'; }
  }
  S.set.hltbBase = ''; throw new Error('HLTB не отвечает (' + err + '). Сайт часто меняет внутренний API - впишите время вручную.');
}
async function hltbFind(name) {
  if (!isNative()) throw new Error('HLTB доступен только в приложении Android: браузер блокирует такие запросы');
  const key = name.toLowerCase(), c = S.set.hltbCache[key];
  if (c && Date.now() - c.t < 7 * 864e5) return c.list;
  const head = name.split(/[:–—]/)[0].trim(), w3 = head.split(/\s+/).slice(0, 3).join(' ');
  let list = [];
  for (const term of Array.from(new Set([name, head, w3])).filter(Boolean)) { list = hltbCandidates(await hltbSearchRaw(term), name); if (list.length) break; }
  const keys = Object.keys(S.set.hltbCache); if (keys.length > 200) delete S.set.hltbCache[keys[0]];
  S.set.hltbCache[key] = { t: Date.now(), list }; saveSet();
  return list;
}

/* ====================== Окна ====================== */
let toastT;
function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('show'), 2600); }
let sheetEl = null, modalEl = null, modalCancel = null;
function openSheet(html) {
  if (sheetEl) { sheetEl.remove(); sheetEl = null; }
  sheetEl = document.createElement('div');
  sheetEl.innerHTML = '<div class="backdrop" data-act="closeSheet"></div><div class="sheet"><div class="grab"></div>' + html + '</div>';
  $('#layer').appendChild(sheetEl);
  return sheetEl.querySelector('.sheet');
}
function closeSheet() {
  if (S.sheet && S.sheet.dirty && sheetEl) { collectSheet(); const sh = S.sheet; sh.dirty = false; persistDraft(sh).then(ok => { if (ok) render(); }); }
  if (sheetEl) { sheetEl.remove(); sheetEl = null; } S.sheet = null;
}
function openModal() {
  closeModal(true);
  modalEl = document.createElement('div');
  modalEl.innerHTML = '<div class="backdrop" style="z-index:40" data-x="cancel"></div><div class="modal"></div>';
  $('#layer').appendChild(modalEl);
  modalEl.firstChild.onclick = () => modalCancel && modalCancel();
  return modalEl.querySelector('.modal');
}
function closeModal(silent) { if (modalEl) { modalEl.remove(); modalEl = null; } if (!silent) modalCancel = null; }
function choose({ title, items, multi = false, selected = [], ok = 'Готово' }) {
  return new Promise(res => {
    const sel = new Set(selected.map(String)); const m = openModal();
    const draw = () => {
      m.innerHTML = '<h4>' + esc(title) + '</h4>' + items.map(it => '<div class="opt' + (sel.has(String(it.id)) ? ' on' : '') + '" data-id="' + esc(it.id) + '">'
        + (multi ? '<span class="bx">' + (sel.has(String(it.id)) ? '✓' : '') + '</span>' : '') + '<div>' + esc(it.label) + (it.sub ? '<div class="sub">' + esc(it.sub) + '</div>' : '') + '</div></div>').join('')
        + '<div class="acts"><span data-x="cancel">Отмена</span>' + (multi ? '<span data-x="ok">' + ok + '</span>' : '') + '</div>';
    };
    draw();
    modalCancel = () => { closeModal(); res(null); };
    m.onclick = e => {
      const x = e.target.closest('[data-x]'), o = e.target.closest('.opt');
      if (x) { closeModal(); res(x.dataset.x === 'ok' ? Array.from(sel) : null); return; }
      if (o) { const id = o.dataset.id; if (!multi) { closeModal(); res(id); return; } sel.has(id) ? sel.delete(id) : sel.add(id); draw(); }
    };
  });
}
function confirmBox(text, okText = 'Да') {
  return new Promise(res => {
    const m = openModal(); m.innerHTML = '<h4>' + esc(text) + '</h4><div class="acts"><span data-x="cancel">Отмена</span><span data-x="ok">' + esc(okText) + '</span></div>';
    modalCancel = () => { closeModal(); res(false); };
    m.onclick = e => { const x = e.target.closest('[data-x]'); if (x) { closeModal(); res(x.dataset.x === 'ok'); } };
  });
}
function promptBox(title, value = '', placeholder = '') {
  return new Promise(res => {
    const m = openModal(); m.innerHTML = '<h4>' + esc(title) + '</h4><label class="field"><input id="pbx" value="' + esc(value) + '" placeholder="' + esc(placeholder) + '"></label><div class="acts"><span data-x="cancel">Отмена</span><span data-x="ok">OK</span></div>';
    modalCancel = () => { closeModal(); res(null); };
    const inp = $('#pbx', m); setTimeout(() => inp.focus(), 50);
    const done = () => { const v = inp.value.trim(); closeModal(); res(v || null); };
    inp.onkeydown = e => { if (e.key === 'Enter') done(); };
    m.onclick = e => { const x = e.target.closest('[data-x]'); if (x) { x.dataset.x === 'ok' ? done() : (closeModal(), res(null)); } };
  });
}
async function pickCollections(title, selected = [], allowNew = true) {
  const items = S.collections.map(c => ({ id: c.id, label: c.name, sub: gamesIn(c.id).length + ' игр' }));
  if (allowNew) items.push({ id: '__new', label: '＋ Новая коллекция…' });
  if (!items.length) { toast('Коллекций пока нет'); return null; }
  const r = await choose({ title, items, multi: true, selected });
  if (!r) return null;
  const ids = r.filter(x => x !== '__new');
  if (r.includes('__new')) { const c = await createCollection(); if (c) ids.push(c.id); }
  return ids;
}
async function createCollection() {
  const name = await promptBox('Название коллекции'); if (!name) return null;
  const ex = S.collections.find(c => c.name.toLowerCase() === name.toLowerCase()); if (ex) return ex;
  const c = { id: uid(), name, created: Date.now() }; S.collections.push(c); await DB.put('collections', c); return c;
}

/* ====================== Каталог ====================== */
function meta(o) {
  const p = [];
  if (o.rating) p.push('<span class="st">★' + o.rating + '</span>');
  const pl = (o.platforms || []).slice(0, 2).map(shortPlat).join(', '); if (pl) p.push(esc(pl));
  if (o.year) p.push(o.year);
  return p.join(' · ');
}
function cardHtml(g) {
  const src = coverSrc(g), sel = S.sel.has(g.id);
  return '<div class="card' + (sel ? ' sel' : '') + '" data-gid="' + g.id + '" data-act="openGame"><div class="cv' + (src ? '' : ' nocover') + '"' + (src ? ' style="background-image:url(\'' + src + '\')"' : '') + '>'
    + (g.time ? '<span class="badge">⏱ ' + g.time + 'ч</span>' : '') + (g.done ? '<span class="dn">✓</span>' : '') + (S.selMode ? '<span class="chk">' + (sel ? '✓' : '') + '</span>' : '') + '</div><div class="t">' + esc(g.name) + '</div><div class="m">' + meta(g) + '</div></div>';
}
function tagsHtml(g) {
  const names = (g.collections || []).map(id => collById(id)).filter(Boolean).map(c => c.name);
  return names.slice(0, 2).map(n => '<span class="tag">' + esc(n) + '</span>').join('') + (names.length > 2 ? '<span class="tag m2">+' + (names.length - 2) + '</span>' : '');
}
function listHtml(list) {
  const c = S.set.cols, f = S.set.f, pin = !!S.set.pin, pcols = S.set.propCols || {};
  const props = S.props.filter(p => pcols[p.id] !== 0);
  const w0 = S.selMode ? 40 : 0, w1 = c.cover ? 64 : 0;
  const cls = i => pin && i != null ? ' pc' + (i === 2 ? ' pl' : '') : '';
  const sty = i => !pin || i == null ? '' : ' style="left:' + (i === 0 ? 0 : i === 1 ? w0 : w0 + w1) + 'px' + (i === 0 ? ';width:40px;min-width:40px' : i === 1 ? ';width:64px;min-width:64px' : '') + '"';
  const sortLink = (t, k) => '<a data-act="sortBy" data-k="' + k + '">' + esc(t) + (f.sort === k ? (f.dir === 'desc' ? ' ▼' : ' ▲') : '') + '</a>';
  const th = (t, k, i) => '<th class="' + cls(i).trim() + '"' + sty(i) + '>' + (k ? sortLink(t, k) : esc(t)) + '</th>';
  let h = '<div class="wrap"><table><thead><tr>' + (S.selMode ? th('', null, 0) : '') + (c.cover ? th('', null, 1) : '') + th('Название', 'name', 2)
    + (c.platforms ? th('Платформа') : '') + (c.done ? th('Прошёл', 'done') : '') + (c.year ? th('Год', 'year') : '') + (c.rating ? th('Рейтинг', 'rating') : '')
    + (c.time ? th('Время', 'time') : '') + (c.series ? th('Серия', 'series') : '') + props.map(p => th(p.name, 'prop:' + p.id)).join('') + (c.colls ? th('Коллекции') : '') + '</tr></thead><tbody>';
  list.forEach(g => {
    const src = coverSrc(g), open = ' data-act="openGame" data-gid="' + g.id + '"';
    h += '<tr data-gid="' + g.id + '">' + (S.selMode ? '<td class="' + cls(0).trim() + '"' + sty(0) + open + '>' + (S.sel.has(g.id) ? '☑' : '☐') + '</td>' : '')
      + (c.cover ? '<td class="' + cls(1).trim() + '"' + sty(1) + open + '><div class="thumb"' + (src ? ' style="background-image:url(\'' + src + '\')"' : '') + '></div></td>' : '')
      + '<td class="nmc' + cls(2) + '"' + sty(2) + open + '><div class="n">' + esc(g.name) + '</div>' + (c.genres && g.genres.length ? '<div class="sub">' + esc(g.genres.join(', ')) + '</div>' : '') + '</td>'
      + (c.platforms ? '<td>' + esc((g.platforms || []).slice(0, 3).map(shortPlat).join(', ')) + '</td>' : '') + (c.done ? '<td>' + (g.done ? '<span style="color:var(--green);font-weight:700;font-size:16px">✓</span>' : '') + '</td>' : '') + (c.year ? '<td>' + (g.year || '—') + '</td>' : '')
      + (c.rating ? '<td>' + (g.rating ? '<span style="color:#ffa000">★ ' + g.rating + '</span>' : '—') + '</td>' : '') + (c.time ? '<td>' + (g.time ? g.time + ' ч' : '—') + '</td>' : '')
      + (c.series ? '<td>' + esc(g.series || '') + '</td>' : '')
      + props.map(p => { const v = g.props && g.props[p.id]; return '<td class="pv">' + (hasVal(v) ? esc(v) : '') + '</td>'; }).join('')
      + (c.colls ? '<td>' + tagsHtml(g) + '</td>' : '') + '</tr>';
  });
  return h + '</tbody></table></div><div class="status">Игр: ' + list.length + '</div>';
}
const ICONS = {
  filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>', grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  pin: '<path d="M9 4h6l-1 5 3 3v2H7v-2l3-3z"/><path d="M12 14v6"/>',
  zoom: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>',
  list: '<path d="M4 6h16M4 12h16M4 18h16"/>', cols: '<rect x="4" y="4" width="16" height="16"/><path d="M9.5 4v16M14.5 4v16"/>', sel: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>'
};
const ZOOM_RANGE = { grid: [2, 6], search: [2, 6], coll: [1, 4], series: [1, 4] };
const ZOOM_DEF = { grid: [3, 6], search: [3, 6], coll: [2, 4], series: [2, 4] };
const colsFor = k => S.set.zoom[k] || ZOOM_DEF[k][(window.innerWidth || 0) >= 620 ? 1 : 0];
const zoomBtn = k => ib('zoom', 'zoom', 'Масштаб', false, '<span class="cnt">' + colsFor(k) + '</span>', ' data-k="' + k + '"');
const ib = (act, icon, label, on, extra, attrs) => '<button class="ib' + (on ? ' on' : '') + '" data-act="' + act + '"' + (attrs || '') + ' title="' + label + '" aria-label="' + label + '"><svg viewBox="0 0 24 24">' + ICONS[icon] + '</svg><span class="lbl">' + label + '</span>' + (extra || '') + '</button>';
function viewLibrary() {
  return '<div class="bar"><div class="sbox"><span>🔍</span><input id="q" placeholder="Поиск по названию" value="' + esc(S.set.f.q) + '"><button class="x" data-act="clearQ">✕</button></div></div>'
    + '<div class="chips scroll" id="collChips"></div><div class="tools" id="libTools"></div><div class="chips" id="libActive"></div><div id="libBody"></div>';
}
function activeCount() { const f = S.set.f; return f.years.length + f.genres.length + f.platforms.length + f.series.length + f.props.length + (f.done ? 1 : 0) + (f.minRating ? 1 : 0); }
function renderLibHead() {
  const f = S.set.f;
  $('#collChips').innerHTML = '<button class="p all' + (f.collections.length ? '' : ' on') + '" data-act="collAll">▦ Все игры<b>' + S.games.length + '</b></button>'
    + S.collections.map(c => '<button class="p' + (f.collections.includes(c.id) ? ' on' : '') + '" data-act="collChip" data-id="' + c.id + '">' + esc(c.name) + '<b>' + gamesIn(c.id).length + '</b></button>').join('');
  $('#libTools').innerHTML = ib('openFilters', 'filter', 'Фильтры', activeCount() > 0, activeCount() ? '<span class="cnt">' + activeCount() + '</span>' : '')
    + ib('toggleView', S.set.view === 'grid' ? 'list' : 'grid', S.set.view === 'grid' ? 'Список' : 'Сетка', false)
    + (S.set.view === 'grid' ? zoomBtn('grid') : '')
    + (S.set.view === 'list' ? ib('openCols', 'cols', 'Колонки', false) + ib('togglePin', 'pin', 'Закрепить', !!S.set.pin) : '')
    + ib('selToggle', 'sel', 'Выбрать', S.selMode);
  const chips = [];
  const lab = (k, v) => k === 'props' ? ((S.props.find(p => p.id === v) || {}).name || v) : (k === 'series' && v === '' ? 'Без серии' : v);
  ['years', 'genres', 'platforms', 'series', 'props'].forEach(k => f[k].forEach(v => chips.push('<button class="chip" data-act="rmF" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(lab(k, v)) + ' ✕</button>')));
  if (f.minRating) chips.push('<button class="chip" data-act="setMinRating" data-v="0">Рейтинг от ★ ' + f.minRating + ' ✕</button>');
  if (f.done) chips.push('<button class="chip" data-act="setDone" data-v="">' + (f.done === 'yes' ? 'Прошёл' : 'Не пройдены') + ' ✕</button>');
  if (f.q) chips.push('<button class="chip" data-act="clearQ">Поиск: ' + esc(f.q) + ' ✕</button>');
  if (chips.length) chips.push('<button class="chip gray" data-act="resetF">Сбросить ✕</button>');
  $('#libActive').innerHTML = chips.join('');
}
function renderLibBody() {
  const list = sortGames(filterGames(S.games, S.set.f), S.set.f); S.shown = list;
  const el = $('#libBody'); if (!el) return;
  if (!S.games.length) el.innerHTML = '<div class="hint">Каталог пуст.<br>Нажмите «+», чтобы добавить игру вручную, или найдите игры во вкладке «Поиск».</div>';
  else if (!list.length) el.innerHTML = '<div class="hint">Ничего не найдено</div>';
  else el.innerHTML = S.set.view === 'list' ? listHtml(list) : '<div class="grid" style="--cols:' + colsFor('grid') + '">' + list.map(cardHtml).join('') + '</div><div class="status">Игр: ' + list.length + '</div>';
}
function renderLibrary() { renderLibHead(); renderLibBody(); renderSelBar(); }
function renderSelBar() {
  const b = $('#selbar'); b.classList.toggle('hidden', !S.selMode || S.tab !== 'library');
  if (!S.selMode) return;
  b.innerHTML = '<b>Выбрано: ' + S.sel.size + '</b><button class="btn" data-act="selAct" data-m="add">В коллекцию</button><button class="btn" data-act="selAct" data-m="move">Переместить</button><button class="btn" data-act="selAct" data-m="remove">Убрать</button><button class="btn red" data-act="selAct" data-m="delete">Удалить</button><button class="btn" data-act="selToggle">✕</button>';
}
function toggleSel(id, on) {
  if (!S.selMode) S.selMode = true;
  if (on === true || !S.sel.has(id)) S.sel.add(id); else S.sel.delete(id);
  renderLibrary();
}
async function selectionAction(m) {
  const ids = Array.from(S.sel); if (!ids.length) return toast('Выберите игры (долгое нажатие на карточку)');
  if (m === 'delete') {
    if (!await confirmBox('Удалить игр: ' + ids.length + '?', 'Удалить')) return;
    for (const id of ids) await removeGame(id);
  } else {
    const f = S.set.f; const src = f.collections.length === 1 ? f.collections[0] : null;
    if (m === 'move' && !src) return toast('Для перемещения выберите сверху ОДНУ коллекцию-источник');
    const pick = await pickCollections(m === 'remove' ? 'Убрать из коллекции' : m === 'move' ? 'Переместить в коллекцию' : 'Добавить в коллекцию', [], m !== 'remove');
    if (!pick || !pick.length) return;
    for (const id of ids) {
      const g = gameById(id); if (!g) continue;
      if (m === 'remove') g.collections = g.collections.filter(c => !pick.includes(c));
      else { if (m === 'move') g.collections = g.collections.filter(c => c !== src); pick.forEach(c => { if (!g.collections.includes(c)) g.collections.push(c); }); }
      await saveGame(g);
    }
    toast('Готово: ' + ids.length);
  }
  S.sel.clear(); S.selMode = false; renderLibrary();
}
async function removeGame(id) {
  S.games = S.games.filter(g => g.id !== id); await DB.del('games', id); await DB.del('covers', id);
  if (coverCache.has(id)) { URL.revokeObjectURL(coverCache.get(id)); coverCache.delete(id); }
}

/* ====================== Фильтры каталога ====================== */
function valueCounts(fn) { const m = new Map(); S.games.forEach(g => [].concat(fn(g)).filter(hasVal).forEach(v => m.set(v, (m.get(v) || 0) + 1))); return m; }
function openFilters() {
  const f = S.set.f;
  const sect = (title, k, m, sortFn) => {
    const keys = Array.from(m.keys()).sort(sortFn || ((a, b) => String(a).localeCompare(String(b), 'ru')));
    return keys.length ? '<h3>' + title + '</h3><div class="chips">' + keys.map(v => '<button class="p' + (f[k].map(String).includes(String(v)) ? ' on' : '') + '" data-act="fToggle" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(v) + '<b>' + m.get(v) + '</b></button>').join('') + '</div>' : '';
  };
  const propBtns = S.props.map(p => '<button class="p' + (f.props.includes(p.id) ? ' on' : '') + '" data-act="fToggle" data-k="props" data-v="' + p.id + '">' + esc(p.name) + '</button>').join('');
  openSheet('<div class="hdr2"><h2>Фильтры</h2><button class="btn" data-act="resetF">Сбросить</button></div>'
    + '<h3>Сортировка</h3><div class="two"><label class="field"><select id="fsort">' + SORTS.concat(S.props.map(p => ['prop:' + p.id, p.name])).map(s => '<option value="' + s[0] + '"' + (f.sort === s[0] ? ' selected' : '') + '>' + s[1] + '</option>').join('') + '</select></label>'
    + '<label class="field"><select id="fdir"><option value="asc"' + (f.dir === 'asc' ? ' selected' : '') + '>по возрастанию</option><option value="desc"' + (f.dir === 'desc' ? ' selected' : '') + '>по убыванию</option></select></label></div>'
    + '<h3>Выбранные коллекции</h3><div class="chips"><button class="p' + (f.collMode === 'or' ? ' on' : '') + '" data-act="collMode" data-v="or">достаточно ОДНОЙ (ИЛИ)</button><button class="p' + (f.collMode === 'and' ? ' on' : '') + '" data-act="collMode" data-v="and">ВСЕ сразу (И)</button></div>'
    + '<h3>Рейтинг от</h3><div class="chips">' + [0, 5, 6, 7, 8, 9].map(v => '<button class="p' + ((f.minRating || 0) === v ? ' on' : '') + '" data-act="setMinRating" data-v="' + v + '">' + (v ? '★ ' + v + '+' : 'Все') + '</button>').join('') + '</div>'
    + '<h3>Прохождение</h3><div class="chips">' + [['', 'Все'], ['yes', '✓ Прошёл'], ['no', 'Не пройдены']].map(x => '<button class="p' + (f.done === x[0] ? ' on' : '') + '" data-act="setDone" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>'
    + sect('Год', 'years', valueCounts(g => g.year || null), (a, b) => b - a) + sect('Жанр', 'genres', valueCounts(g => g.genres)) + sect('Платформа', 'platforms', valueCounts(g => g.platforms))
    + sect('Серия', 'series', valueCounts(g => g.series)) + (propBtns ? '<h3>Другие свойства (заполнено)</h3><div class="chips">' + propBtns + '</div>' : '')
    + '<p class="hint" style="padding:6px">Значения одного вида - «любое из», разные виды - «и».</p><button class="btn acc" style="width:100%" data-act="closeSheet">Готово</button>');
  $('#fsort').onchange = e => { f.sort = e.target.value; saveSet(); renderLibrary(); };
  $('#fdir').onchange = e => { f.dir = e.target.value; saveSet(); renderLibrary(); };
}
function openCols() {
  const c = S.set.cols, pc = S.set.propCols || {};
  openSheet('<h2 style="margin:0 0 10px">Колонки</h2><div class="chips">' + COLS.map(x => '<button class="p' + (c[x[0]] ? ' on' : '') + '" data-act="colToggle" data-k="' + x[0] + '">' + (c[x[0]] ? '✓ ' : '') + x[1] + '</button>').join('') + '</div>'
    + (S.props.length ? '<h3>Свойства (не коллекции)</h3><div class="chips">' + S.props.map(p => '<button class="p' + (pc[p.id] !== 0 ? ' on' : '') + '" data-act="colProp" data-id="' + p.id + '">' + (pc[p.id] !== 0 ? '✓ ' : '') + esc(p.name) + '</button>').join('') + '</div>' : '')
    + '<h3>Закрепление</h3><div class="chips"><button class="p' + (S.set.pin ? ' on' : '') + '" data-act="togglePin">' + (S.set.pin ? '✓ ' : '') + 'Закрепить обложку и название слева</button></div>'
    + '<button class="btn acc" style="width:100%;margin-top:10px" data-act="closeSheet">Готово</button>');
}

/* ====================== Карточка игры (правка) ====================== */
function openGameSheet(id) {
  closeSheet();
  const isNew = !id;
  const g = isNew ? { id: uid(), rawgId: 0, name: '', year: 0, rating: 0, time: 0, description: '', genres: [], platforms: [], series: '', coverUrl: '', hasCover: false, collections: [], props: {}, done: false, added: Date.now() } : gameById(id);
  if (!g) return;
  S.sheet = { isNew, draft: clone(g), cover: null, dirty: false };
  const d = S.sheet.draft, src = coverSrc(g);
  const propInputs = S.props.map(p => '<label class="field"><span>' + esc(p.name) + '</span>' + (p.type === 'text'
    ? '<textarea data-prop="' + p.id + '" rows="2">' + esc(d.props[p.id] != null ? d.props[p.id] : '') + '</textarea>'
    : '<input data-prop="' + p.id + '" type="' + (p.type === 'number' ? 'number' : 'date') + '"' + (p.type === 'number' ? ' step="any" inputmode="decimal"' : '') + ' value="' + esc(d.props[p.id] != null ? d.props[p.id] : '') + '">') + '</label>').join('');
  const sh = openSheet('<div class="hero"><div class="cv' + (src ? '' : ' nocover') + '" id="shCover"' + (src ? ' style="background-image:url(\'' + src + '\')"' : '') + '></div><div style="flex:1;min-width:0"><button class="btn" data-act="pickCover">Выбрать обложку</button>' + (isNew ? '' : '<button class="btn" data-act="sgdbOpen" style="margin-top:6px">Обложки SteamGridDB</button>')
    + '<input type="file" id="coverFile" accept="image/*" class="hidden"><p class="sub">' + (g.rawgId ? 'Игра из RAWG' : 'Добавлена вручную') + '</p>' + (g.rawgId ? '<button class="btn" data-act="refreshRawg">↻ Обновить из RAWG</button>' : '<button class="btn" data-act="findRawg">Найти в RAWG</button>') + '</div></div>'
    + '<label class="field"><span>Название</span><input id="f_name" value="' + esc(d.name) + '"></label>'
    + '<div class="two"><label class="field"><span>Год выпуска</span><input id="f_year" type="number" value="' + (d.year || '') + '"></label><label class="field"><span>Рейтинг (0-10)</span><input id="f_rating" type="number" step="any" inputmode="decimal" value="' + (d.rating || '') + '"></label></div>'
    + '<div class="two"><label class="field"><span>Время прохождения, ч</span><input id="f_time" type="number" step="any" inputmode="decimal" value="' + (d.time || '') + '"></label><div class="field"><span>Серия игр</span><div class="inl"><input id="f_series" value="' + esc(d.series) + '"><button type="button" class="btn" data-act="pickSeries" aria-label="Выбрать серию">▾</button></div></div></div>'
    + '<div class="toolbar"><button class="btn" data-act="hltbTime">⏱ Время из HLTB</button>' + (d.series ? '<button class="btn" data-act="seriesCatalog">Игры серии в каталоге</button>' : '') + (g.rawgId ? '<button class="btn" data-act="seriesRawg">Игры серии на RAWG</button>' : '') + '</div>'
    + '<h3>Прохождение</h3><div class="chips"><button class="p' + (d.done ? ' on' : '') + '" data-act="shDone">' + (d.done ? '✓ ' : '') + 'Прошёл</button></div>'
    + '<h3>Коллекции</h3><div class="chips" id="shColls"></div>'
    + '<label class="field"><span>Жанры (через запятую)</span><input id="f_genres" value="' + esc(d.genres.join(', ')) + '"></label>'
    + '<label class="field"><span>Платформы (через запятую)</span><input id="f_platforms" value="' + esc(d.platforms.join(', ')) + '"></label>'
    + propInputs + (g.rawgId ? '<h3>Скриншоты</h3><div id="shotsBox"><button class="btn" data-act="loadShots" data-rid="' + g.rawgId + '">Посмотреть скриншоты</button></div>' : '')
    + '<div class="sbar"><button class="btn acc" data-act="closeSheet">Готово</button><span id="svst" class="sub">Сохраняется автоматически</span>'
    + (isNew ? '<span style="width:44px"></span>' : '<button class="ib red" data-act="delGame" title="Удалить игру" aria-label="Удалить игру"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg></button>') + '</div>');
  drawShColls();
  $('#coverFile', sh).onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    try { const b = await toThumb(file); S.sheet.cover = b; markDirty(); const u = URL.createObjectURL(b); const c = $('#shCover'); c.style.backgroundImage = "url('" + u + "')"; c.classList.remove('nocover'); } catch (er) { toast('Не удалось прочитать картинку'); }
  };
}
function drawShColls() {
  const d = S.sheet.draft;
  $('#shColls').innerHTML = S.collections.map(c => '<button class="p' + (d.collections.includes(c.id) ? ' on' : '') + '" data-act="shColl" data-id="' + c.id + '">' + esc(c.name) + '</button>').join('') + '<button class="p" data-act="shNewColl">＋ новая</button>';
}
const EDIT_KEYS = ['name', 'year', 'rating', 'time', 'series', 'genres', 'platforms', 'collections', 'props', 'done'];
let autoT;
function markDirty() { if (!S.sheet) return; S.sheet.dirty = true; clearTimeout(autoT); autoT = setTimeout(autosave, 1500); }
function collectSheet() {
  const sh = S.sheet; if (!sh || !sheetEl || !$('#f_name')) return false; const d = sh.draft;
  const csv = t => t.split(',').map(x => x.trim()).filter(Boolean);
  Object.assign(d, { name: $('#f_name').value.trim(), year: +$('#f_year').value || 0, rating: +$('#f_rating').value || 0, time: +$('#f_time').value || 0, series: $('#f_series').value.trim(), genres: csv($('#f_genres').value), platforms: csv($('#f_platforms').value) });
  d.props = d.props || {};
  $$('[data-prop]', sheetEl).forEach(i => { const p = S.props.find(x => x.id === i.dataset.prop); if (!p) return; if (hasVal(i.value)) d.props[p.id] = p.type === 'number' ? +i.value : i.value; else delete d.props[p.id]; });
  return true;
}
async function persistDraft(sh) {
  const d = sh.draft; if (!d.name) return false;
  d.series = canonSeries(d.series);
  let g = gameById(d.id);
  if (!g) {
    if (S.games.some(x => normName(x.name) === normName(d.name) && (x.year || 0) === (d.year || 0))) { toast('Такая игра уже есть в каталоге'); return false; }
    g = d; S.games.push(g);
  } else EDIT_KEYS.forEach(k => { g[k] = d[k] !== null && typeof d[k] === 'object' ? clone(d[k]) : d[k]; });
  if (sh.cover) { const b = sh.cover; sh.cover = null; await setCover(g.id, b); g.coverSrc = 'manual'; }
  await saveGame(g);
  const st = $('#svst'); if (st) st.textContent = 'Сохранено ✓';
  return true;
}
function autosave() { const sh = S.sheet; if (!sh || !sh.dirty) return; if (collectSheet()) { sh.dirty = false; persistDraft(sh); } }
async function flushSheetNow() { const sh = S.sheet; if (sh && sh.dirty && collectSheet()) { sh.dirty = false; await persistDraft(sh); } }

/* ====================== Дубли ====================== */
function findDupes() {
  const res = { series: [], colls: [], games: [] };
  const sm = new Map();
  S.games.forEach(g => { if (!g.series) return; const k = normName(g.series); if (!sm.has(k)) sm.set(k, new Map()); const m = sm.get(k); m.set(g.series, (m.get(g.series) || 0) + 1); });
  sm.forEach(m => { if (m.size > 1) res.series.push(Array.from(m.entries()).sort((a, b) => b[1] - a[1]).map(e => e[0])); });
  const cm = new Map(); S.collections.forEach(c => { const k = normName(c.name); if (!cm.has(k)) cm.set(k, []); cm.get(k).push(c); });
  cm.forEach(a => { if (a.length > 1) res.colls.push(a); });
  const parent = new Map(S.games.map(g => [g.id, g.id])), find = x => { while (parent.get(x) !== x) x = parent.get(x); return x; }, byKey = new Map();
  S.games.forEach(g => {
    const keys = ['n' + normName(g.name) + '|' + (g.year || 0)]; if (g.rawgId) keys.push('r' + g.rawgId);
    keys.forEach(k => { if (byKey.has(k)) parent.set(find(g.id), find(byKey.get(k))); else byKey.set(k, g.id); });
  });
  const groups = new Map(); S.games.forEach(g => { const r = find(g.id); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(g); });
  groups.forEach(a => { if (a.length > 1) res.games.push(a); });
  return res;
}
async function mergeGames(list) {
  const score = g => (g.rawgId ? 4 : 0) + (g.hasCover ? 2 : 0) + ((g.collections || []).length ? 1 : 0);
  list = list.slice().sort((a, b) => score(b) - score(a) || (a.added || 0) - (b.added || 0));
  const p = list[0];
  for (const o of list.slice(1)) {
    (o.collections || []).forEach(c => { if (!p.collections.includes(c)) p.collections.push(c); });
    p.props = Object.assign({}, o.props || {}, p.props || {}); p.done = !!(p.done || o.done);
    ['description', 'series', 'coverUrl'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; }); ['year', 'rating', 'time'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; });
    if (!p.rawgId && o.rawgId) p.rawgId = o.rawgId; if (!p.genres.length) p.genres = o.genres; if (!p.platforms.length) p.platforms = o.platforms;
    if (!p.hasCover && o.hasCover) { const c = await DB.get('covers', o.id); if (c) await setCover(p.id, c.blob); }
    for (const i of S.inbox.items) if (i.gameId === o.id) { i.gameId = p.id; await DB.put('inboxItems', i); }
    await removeGame(o.id);
  }
  p.series = canonSeries(p.series); await saveGame(p);
}
async function mergeAllDupes(d) {
  for (const names of d.series) { const canon = names[0]; for (const g of S.games) if (g.series && normName(g.series) === normName(canon) && g.series !== canon) { g.series = canon; await saveGame(g); } }
  for (const list of d.colls) {
    const keep = list[0];
    for (const o of list.slice(1)) {
      for (const g of S.games) if (g.collections.includes(o.id)) { g.collections = g.collections.filter(x => x !== o.id); if (!g.collections.includes(keep.id)) g.collections.push(keep.id); await saveGame(g); }
      S.collections = S.collections.filter(c => c.id !== o.id); await DB.del('collections', o.id);
      S.set.f.collections = Array.from(new Set(S.set.f.collections.map(x => x === o.id ? keep.id : x)));
    }
  }
  for (const list of d.games) await mergeGames(list);
  saveSet();
}
function checkDupes(silent) {
  const d = findDupes(), n = d.series.length + d.colls.length + d.games.length;
  if (!n) { if (!silent) toast('Дублей не найдено'); return Promise.resolve(false); }
  const lines = [].concat(d.series.map(x => 'Серия: ' + x.join(' = ')), d.colls.map(l => 'Коллекция: ' + l.map(c => c.name).join(' = ')), d.games.map(l => 'Игра: ' + l[0].name + ' (×' + l.length + ')'));
  return new Promise(res => {
    const m = openModal();
    m.innerHTML = '<h4>Найдены дубли: ' + n + '</h4><div class="sub" style="max-height:230px;overflow:auto;white-space:pre-wrap">' + esc(lines.join('\n')) + '</div><p class="sub">У серий останется самое частое написание. У игр останется самая полная карточка, коллекции, свойства и отметка «Прошёл» сложатся.</p><div class="acts"><span data-x="cancel">Позже</span><span data-x="ok">Объединить</span></div>';
    modalCancel = () => { closeModal(); res(false); };
    m.onclick = async e => { const x = e.target.closest('[data-x]'); if (!x) return; closeModal(); if (x.dataset.x === 'ok') { await mergeAllDupes(d); toast('Дубли объединены'); res(true); } else res(false); };
  });
}
function dupBanner(kind) {
  const d = findDupes(), n = kind === 'series' ? d.series.length : d.colls.length;
  return n ? '<div class="banner">Найдены дубли ' + (kind === 'series' ? 'серий' : 'коллекций') + ' с разным регистром букв: ' + n + '<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="fixDupes">Объединить…</button></div></div>' : '';
}

async function refreshFromRawg(id) {
  await flushSheetNow();
  const g = gameById(id); if (!g || !g.rawgId) return;
  if (!await confirmBox('Обновить данные из RAWG? Название, описание, жанры, платформы и обложка будут заменены.', 'Обновить')) return;
  try {
    const { d, series } = await fetchDetails(g.rawgId); const n = gameFromRawg(d, series);
    Object.assign(g, { name: n.name, year: n.year, rating: n.rating, description: n.description, genres: n.genres, platforms: n.platforms });
    if (!g.time) g.time = n.time; if (!g.series) g.series = canonSeries(n.series);
    if (!g.coverSrc || g.coverSrc === 'rawg') { g.coverUrl = n.coverUrl; g.coverSrc = 'rawg'; await cacheCover(g); if (!g.coverUrl && S.set.sgdbKey && !g.hasCover) { try { await sgdbAuto(g); } catch (e) { /* без обложки */ } } }
    await saveGame(g); if (S.sheet) S.sheet.dirty = false; closeSheet(); toast('Обновлено'); render();
  } catch (e) { toast(e.message); }
}

/* ====================== Коллекции ====================== */
function viewCollections() {
  const tile = (id, name, list) => {
    const covers = list.map(coverSrc).filter(Boolean).slice(0, 4);
    return '<div class="tile" data-act="collOpen" data-id="' + id + '"><div class="mos">' + covers.map((u, i) => '<i style="left:' + (4 + i * 19) + '%;background-image:url(\'' + u + '\')"></i>').join('') + '</div>'
      + (id === 'all' ? '' : '<button class="mn" data-act="collMenu" data-id="' + id + '">⋮</button>') + '<div class="nm">' + esc(name) + '</div><div class="ct">' + list.length + ' игр</div></div>';
  };
  return dupBanner('colls') + '<div class="hdr2"><h2>Коллекции</h2>' + zoomBtn('coll') + '</div><div class="tiles" style="--cols:' + colsFor('coll') + '">' + tile('all', 'Все игры', S.games) + S.collections.map(c => tile(c.id, c.name, gamesIn(c.id))).join('') + '</div>'
    + (S.collections.length ? '' : '<p class="hint">Создайте первую коллекцию кнопкой «+» (например, «Прошёл», «PS Store», «Хочу пройти»).</p>');
}
async function collMenu(id) {
  const c = collById(id); if (!c) return;
  const r = await choose({ title: c.name, items: [{ id: 'rename', label: 'Переименовать' }, { id: 'del', label: 'Удалить коллекцию (игры останутся)' }] });
  if (r === 'rename') { const n = await promptBox('Название коллекции', c.name); if (n) { c.name = n; await DB.put('collections', c); render(); } }
  if (r === 'del' && await confirmBox('Удалить коллекцию «' + c.name + '»? Игры останутся в каталоге.', 'Удалить')) {
    S.collections = S.collections.filter(x => x.id !== id); await DB.del('collections', id);
    for (const g of S.games) if (g.collections.includes(id)) { g.collections = g.collections.filter(x => x !== id); await saveGame(g); }
    S.set.f.collections = S.set.f.collections.filter(x => x !== id); saveSet(); render();
  }
}

/* ====================== Разобрать ====================== */
const itemsOf = lid => S.inbox.items.filter(i => i.listId === lid);
const pendingItem = () => S.pending ? S.inbox.items.find(i => i.id === S.pending.itemId) : null;
function viewInbox() {
  if (S.inboxList && !S.inbox.lists.some(l => l.id === S.inboxList)) S.inboxList = null;
  if (!S.inboxList) {
    const cards = S.inbox.lists.map(l => {
      const it = itemsOf(l.id), left = it.filter(i => !i.done).length, pct = it.length ? Math.round((it.length - left) * 100 / it.length) : 0;
      return '<div class="lcard" data-act="listOpen" data-id="' + l.id + '"><div style="flex:1;min-width:0"><div class="nm">' + esc(l.name) + '</div><div class="ct">осталось ' + left + ' из ' + it.length + '</div><div class="pb"><i style="width:' + pct + '%"></i></div></div><button class="mn2" data-act="listMenu" data-id="' + l.id + '">⋮</button></div>';
    }).join('');
    return '<div class="hdr2"><h2>Разобрать</h2></div>' + (cards || '<p class="hint">Здесь живут списки игр, которые нужно разобрать: вставьте названия из заметок или Steam, а потом по очереди находите их в RAWG.<br>Нажмите «+», чтобы создать список.</p>');
  }
  const l = S.inbox.lists.find(x => x.id === S.inboxList), all = itemsOf(l.id), left = all.filter(i => !i.done).length;
  const list = S.showDone ? all : all.filter(i => !i.done);
  const row = i => {
    const g = i.done ? gameById(i.gameId) : null;
    return '<div class="it' + (i.done ? ' done' : '') + '"><div class="tx" data-act="itOpen" data-id="' + i.id + '">' + (i.done ? '<span class="okc">✓</span> ' : '') + esc(i.text)
      + (i.done ? '<div class="sub">→ ' + (g ? esc(g.name) : 'игра удалена из каталога') + '</div>' : '') + '</div><div class="ia">'
      + (i.done ? '' : '<button data-act="itMatch" data-id="' + i.id + '" title="Сопоставить с игрой из каталога">🔗</button><button data-act="itEdit" data-id="' + i.id + '" title="Изменить">✎</button>')
      + '<button data-act="itDel" data-id="' + i.id + '" title="Удалить">🗑</button></div></div>';
  };
  return '<div class="hdr2"><div style="display:flex;align-items:center;gap:10px;min-width:0"><button class="btn" data-act="listBack">←</button><h2 style="font-size:19px">' + esc(l.name) + '</h2></div><span class="sub">осталось ' + left + ' из ' + all.length + '</span></div>'
    + '<div class="addrow"><input id="itNew" placeholder="Название игры…"><button class="btn acc" data-act="itAdd">Добавить</button></div>'
    + '<div class="toolbar"><button class="btn" data-act="itPaste">Вставить список…</button><button class="btn" data-act="itToggleDone">' + (S.showDone ? 'Скрыть разобранные' : 'Показать разобранные') + '</button></div>'
    + '<div class="sec" style="padding:4px 12px">' + (list.map(row).join('') || '<p class="sub" style="padding:14px">Список пуст.</p>') + '</div><p class="sub">Нажмите на название, чтобы найти игру в RAWG. 🔗 - сопоставить с игрой, которая уже есть в каталоге.</p>';
}
async function createList() {
  const name = await promptBox('Название списка', '', 'например: Steam'); if (!name) return;
  const l = { id: uid(), name, created: Date.now() }; S.inbox.lists.push(l); await DB.put('inboxLists', l);
  S.inboxList = l.id; render(); pasteModal(l.id);
}
async function listMenu(id) {
  const l = S.inbox.lists.find(x => x.id === id); if (!l) return;
  const r = await choose({ title: l.name, items: [{ id: 'rename', label: 'Переименовать' }, { id: 'clear', label: 'Убрать разобранные игры из списка' }, { id: 'del', label: 'Удалить список' }] });
  if (r === 'rename') { const n = await promptBox('Название списка', l.name); if (n) { l.name = n; await DB.put('inboxLists', l); render(); } }
  if (r === 'clear') { for (const i of itemsOf(id).filter(x => x.done)) { S.inbox.items = S.inbox.items.filter(x => x.id !== i.id); await DB.del('inboxItems', i.id); } render(); }
  if (r === 'del' && await confirmBox('Удалить список «' + l.name + '» со всеми строками? Игры в каталоге останутся.', 'Удалить')) {
    for (const i of itemsOf(id)) await DB.del('inboxItems', i.id);
    S.inbox.items = S.inbox.items.filter(i => i.listId !== id); S.inbox.lists = S.inbox.lists.filter(x => x.id !== id); await DB.del('inboxLists', id); render();
  }
}
async function addItems(listId, lines) {
  const have = new Set(itemsOf(listId).map(i => i.text.toLowerCase())); let n = 0;
  for (const raw of lines) {
    const t = String(raw).replace(/^\s*(?:\d+[.)]|[-•*–])\s*/, '').trim();
    if (!t || have.has(t.toLowerCase())) continue;
    have.add(t.toLowerCase());
    const it = { id: uid(), listId, text: t, done: false, gameId: '', rawgId: 0, created: Date.now() + n }; S.inbox.items.push(it); await DB.put('inboxItems', it); n++;
  }
  return n;
}
function pasteModal(listId) {
  const m = openModal();
  m.innerHTML = '<h4>Вставить список игр</h4><p class="sub">Каждая строка - одна игра. Вставьте текст в поле (долгое нажатие, затем «Вставить»).</p><label class="field"><textarea id="pasteT" style="min-height:160px"></textarea></label><div class="acts"><span data-x="cancel">Отмена</span><span data-x="ok">Добавить</span></div>';
  modalCancel = () => closeModal();
  m.onclick = async e => {
    const x = e.target.closest('[data-x]'); if (!x) return; const ta = $('#pasteT', m);
    if (x.dataset.x === 'ok') { const t = ta.value; closeModal(); const n = await addItems(listId, t.split(/\r?\n/)); toast('Добавлено строк: ' + n); render(); }
    else closeModal();
  };
}
function pickGame(prefill) {
  return new Promise(res => {
    const m = openModal();
    m.innerHTML = '<h4>Сопоставить с игрой из каталога</h4><label class="field"><input id="pgq" value="' + esc(prefill) + '" placeholder="Название"></label><div id="pgl"></div><div class="acts"><span data-x="cancel">Отмена</span></div>';
    const draw = () => {
      const toks = $('#pgq', m).value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let list = S.games.filter(g => toks.every(t => g.name.toLowerCase().includes(t)));
      if (!list.length && toks.length) list = S.games.filter(g => toks.some(t => g.name.toLowerCase().includes(t)));
      $('#pgl', m).innerHTML = list.slice(0, 40).map(g => '<div class="opt" data-id="' + g.id + '"><div>' + esc(g.name) + '<div class="sub">' + (g.year || '') + ' ' + esc((g.platforms || []).slice(0, 2).join(', ')) + '</div></div></div>').join('') || '<p class="sub">Ничего не найдено</p>';
    };
    draw(); modalCancel = () => { closeModal(); res(null); }; m.oninput = draw;
    m.onclick = e => { const o = e.target.closest('.opt'), x = e.target.closest('[data-x]'); if (x) { closeModal(); res(null); } else if (o) { closeModal(); res(o.dataset.id); } };
  });
}
async function matchItem(it) {
  if (!it || it.done) return;
  if (!S.games.length) return toast('В каталоге пока нет игр');
  const id = await pickGame(it.text); const g = id && gameById(id); if (g) linkItem(it, g);
}
function linkItem(it, g) {
  it.done = true; it.gameId = g.id; it.rawgId = g.rawgId || 0; DB.put('inboxItems', it);
  if (S.pending && S.pending.itemId === it.id) S.pending = null;
  toast('✓ Разобрано: ' + g.name); S.tab = 'inbox'; render();
}
function tryLinkPending(g) { const it = pendingItem(); if (!it) return false; linkItem(it, g); return true; }

/* ====================== Серии ====================== */
function seriesGroups() { const m = new Map(); S.games.forEach(g => { const k = g.series || ''; if (!m.has(k)) m.set(k, []); m.get(k).push(g); }); return m; }
function viewSeries() {
  const m = seriesGroups(), names = Array.from(m.keys()).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ru')), none = m.get('') || [];
  const tile = (key, name, list, menu) => {
    const covers = list.map(coverSrc).filter(Boolean).slice(0, 4);
    return '<div class="tile" data-act="serOpen" data-name="' + esc(key) + '"><div class="mos">' + covers.map((u, i) => '<i style="left:' + (4 + i * 19) + '%;background-image:url(\'' + u + '\')"></i>').join('') + '</div>'
      + (menu ? '<button class="mn" data-act="serMenu" data-name="' + esc(key) + '">⋮</button>' : '') + '<div class="nm">' + esc(name) + '</div><div class="ct">' + list.length + ' игр</div></div>';
  };
  return dupBanner('series') + '<div class="hdr2"><h2>Серии игр</h2>' + zoomBtn('series') + '</div><div class="tiles" style="--cols:' + colsFor('series') + '">' + names.map(n => tile(n, n, m.get(n), true)).join('') + (none.length ? tile('', 'Без серии', none, false) : '') + '</div>'
    + (names.length ? '' : '<p class="hint">Серий пока нет. Они появляются, когда у игры указана серия: при добавлении из RAWG она заполняется сама, а вручную её можно вписать в карточке игры.</p>');
}
async function serMenu(name) {
  const r = await choose({ title: name, items: [{ id: 'rename', label: 'Переименовать (или объединить с другой серией)' }, { id: 'del', label: 'Убрать серию у всех игр (игры останутся)' }] });
  const games = S.games.filter(g => g.series === name), f = S.set.f;
  if (r === 'rename') {
    let n = await promptBox('Название серии', name); if (n) n = normName(n) === normName(name) ? n.trim() : canonSeries(n);
    if (n && n !== name) { for (const g of games) { g.series = n; await saveGame(g); } f.series = f.series.map(x => x === name ? n : x); saveSet(); render(); }
  }
  if (r === 'del' && await confirmBox('Убрать серию «' + name + '» у игр: ' + games.length + '? Сами игры останутся в каталоге.', 'Убрать')) {
    for (const g of games) { g.series = ''; await saveGame(g); } f.series = f.series.filter(x => x !== name); saveSet(); render();
  }
}

/* ====================== Поиск RAWG ====================== */
function searchFilterCount() { const f = S.search.f; return (f.genre ? 1 : 0) + (f.platform ? 1 : 0) + (f.year ? 1 : 0) + (f.minRating ? 1 : 0); }
function viewSearch() {
  const s = S.search, pit = pendingItem();
  const banner = pit ? '<div class="banner">Разбор: «' + esc(pit.text) + '» - выберите игру<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="pendingMatch">Уже в базе</button><button class="btn" data-act="pendingCancel">Отмена</button></div></div>' : '';
  return banner + blockBanner(true) + '<div class="bar"><div class="sbox"><span>🔍</span><input id="sq" placeholder="Найти игру на RAWG" value="' + esc(s.q) + '"><button class="x" data-act="clearSQ">✕</button></div></div>'
    + '<div class="tools">' + ib('sFilters', 'filter', 'Фильтры', searchFilterCount() > 0, searchFilterCount() ? '<span class="cnt">' + searchFilterCount() + '</span>' : '') + zoomBtn('search') + '</div><div class="chips" id="sActive"></div><div id="srBody"></div>';
}
function renderSearchBody() {
  const s = S.search, el = $('#srBody'); if (!el) return;
  const f = s.f, chips = [];
  if (f.genre) chips.push('<button class="chip" data-act="sRm" data-k="genre">' + esc(f.genreName) + ' ✕</button>');
  if (f.platform) chips.push('<button class="chip" data-act="sRm" data-k="platform">' + esc(f.platformName) + ' ✕</button>');
  if (f.year) chips.push('<button class="chip" data-act="sRm" data-k="year">' + f.year + ' ✕</button>');
  if (f.minRating) chips.push('<button class="chip" data-act="sRm" data-k="minRating">от ★' + f.minRating + ' ✕</button>');
  $('#sActive').innerHTML = chips.join('');
  let h = '';
  if (s.mode === 'series') h += '<div class="hdr2"><h2 style="font-size:17px">Игры серии: ' + esc(s.title) + '</h2><button class="btn" data-act="sBack">← Назад</button></div>';
  if (S.block) h += blockBanner(true);
  else if (!S.set.rawgKey) h += '<div class="hint">Для поиска нужен бесплатный ключ RAWG.<br>Получить: rawg.io/apidocs<br><br><button class="btn acc" data-act="tab" data-tab="settings">Открыть настройки</button></div>';
  else if (!s.results.length && !s.loading) h += '<div class="hint">' + (s.started ? 'Ничего не найдено' : 'Введите название игры или выберите фильтры') + '</div>';
  else {
    h += '<div class="grid" style="--cols:' + colsFor('search') + '">' + s.results.map(it => {
      const inCat = S.games.some(g => g.rawgId === it.rawgId);
      return '<div class="card" data-act="openRawg" data-rid="' + it.rawgId + '"><div class="cv' + (it.cover ? '' : ' nocover') + '"' + (it.cover ? ' style="background-image:url(\'' + thumbUrl(it.cover) + '\')"' : '') + '>'
        + (it.time ? '<span class="badge">⏱ ' + it.time + 'ч</span>' : '') + (inCat ? '<span class="ok">✓</span>' : '<button class="qa" data-act="quickAdd" data-rid="' + it.rawgId + '">+</button>') + '</div><div class="t">' + esc(it.name) + '</div><div class="m">' + meta(it) + '</div></div>';
    }).join('') + '</div>';
    h += '<div class="status">' + (s.loading ? 'Загрузка…' : (s.count ? 'Найдено: ' + s.count + ', показано: ' + s.results.length : '')) + '</div>';
    if (s.hasMore && !s.loading) h += '<div class="status"><button class="btn" data-act="sMore">Показать ещё</button></div><div id="sentinel" style="height:2px"></div>';
  }
  if (s.loading && !s.results.length) h += '<div class="status">Загрузка…</div>';
  el.innerHTML = h;
  const sen = $('#sentinel');
  if (sen && 'IntersectionObserver' in window) { const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { io.disconnect(); runSearch(false); } }, { root: $('#view'), rootMargin: '300px' }); io.observe(sen); }
}
async function runSearch(reset) {
  const s = S.search;
  if (reset) { s.results = []; s.page = 0; s.hasMore = true; s.count = 0; s.token++; s.loading = false; s.mode = 'search'; }
  if (s.loading || !s.hasMore) return;
  const f = s.f;
  if (!s.q.trim() && !f.genre && !f.platform && !f.year) { s.started = false; s.results = []; renderSearchBody(); return; }
  if (!S.set.rawgKey || S.block) { renderSearchBody(); return; }
  const token = s.token; s.loading = true; s.started = true; renderSearchBody();
  try {
    const d = await rawg('/games', { search: s.q.trim(), page: s.page + 1, page_size: 40, genres: f.genre, platforms: f.platform, dates: f.year ? f.year + '-01-01,' + f.year + '-12-31' : '', ordering: s.q.trim() ? '' : '-added' });
    if (token !== s.token) return;
    s.count = d.count; s.page++; s.hasMore = !!d.next;
    s.results.push(...d.results.map(mapItem).filter(x => x.rating >= f.minRating));
  } catch (e) { if (token === s.token) { toast(e.message); s.hasMore = false; } }
  finally { if (token === s.token) { s.loading = false; renderSearchBody(); } }
}
async function showSeries(rawgId, title) {
  const s = S.search; s.token++; s.mode = 'series'; s.title = title; s.results = []; s.hasMore = false; s.loading = true; s.started = true; S.tab = 'search'; closeSheet(); render();
  try { const d = await rawg('/games/' + rawgId + '/game-series', { page_size: 40 }); s.results = d.results.map(mapItem); s.count = d.count; } catch (e) { toast(e.message); }
  s.loading = false; renderSearchBody();
}
async function openRawgSheet(rid) {
  const it = S.search.results.find(x => x.rawgId === rid) || { rawgId: rid, name: '', platforms: [], genres: [] };
  const pit = pendingItem();
  const draw = (d, ser) => {
    const cat = S.games.find(g => g.rawgId === rid), cover = (d && d.background_image) || it.cover;
    const item = d ? mapItem(d) : it;
    const inColls = cat ? cat.collections.map(id => collById(id)).filter(Boolean) : [];
    openSheet('<div class="hero"><div class="cv' + (cover ? '' : ' nocover') + '"' + (cover ? ' style="background-image:url(\'' + thumbUrl(cover) + '\')"' : '') + '></div><div style="flex:1;min-width:0"><h2>' + esc(item.name) + ' <span class="y">' + (item.year || '') + '</span></h2>'
      + '<div class="m" style="font-size:14px">' + (item.rating ? '<span class="st">★ ' + item.rating + '</span>' : '') + (item.time ? ' · ⏱ ' + item.time + ' ч' : '') + '</div>'
      + (ser && ser.series ? '<div class="sub" style="margin-top:6px">Серия: ' + esc(ser.series) + '</div>' : '') + '</div></div>'
      + '<div class="chips" style="margin-top:12px">' + item.genres.map(x => '<span class="tag">' + esc(x) + '</span>').join('') + '</div>'
      + '<div class="chips">' + item.platforms.map(x => '<span class="tag m2">' + esc(x) + '</span>').join('') + '</div>'
      + (cat ? '<div class="sub" style="margin:6px 0">В каталоге. Коллекции: ' + (inColls.length ? inColls.map(c => '<span class="tag">' + esc(c.name) + '</span>').join('') : 'нет') + '</div>' : '')
      + '<div class="toolbar">' + (cat ? (pit ? '<button class="btn acc" data-act="rsLink" data-rid="' + rid + '">✓ Сопоставить с разбором</button>' : '') + '<button class="btn" data-act="openGameFromRawg" data-id="' + cat.id + '">Открыть в каталоге</button>'
        : '<button class="btn acc" data-act="rsAdd" data-rid="' + rid + '">' + (pit ? '＋ Добавить и сопоставить' : '＋ Добавить') + '</button>')
      + '<button class="btn' + (cat && cat.done ? ' acc' : '') + '" data-act="rsDone" data-rid="' + rid + '">' + (cat && cat.done ? '✓ Прошёл' : '☐ Прошёл') + '</button>'
      + '<button class="btn" data-act="rsColl" data-rid="' + rid + '">В коллекцию…</button>' + (ser && ser.count ? '<button class="btn" data-act="rsSeries" data-rid="' + rid + '" data-t="' + esc(ser.series || item.name) + '">Игры серии (' + ser.count + ')</button>' : '') + '</div>'
      + '<h3>Скриншоты</h3><div id="shotsBox"><button class="btn" data-act="loadShots" data-rid="' + rid + '">Посмотреть скриншоты</button></div>');
  };
  draw(null, null);
  try { const r = await fetchDetails(rid); draw(r.d, { series: r.series, count: r.seriesCount }); } catch (e) { toast(e.message); }
}
async function loadShots(rid) {
  const box = $('#shotsBox'); if (!box) return;
  box.innerHTML = '<div class="status">Загрузка скриншотов…</div>';
  try {
    const r = await rawg('/games/' + rid + '/screenshots', { page_size: 40 }), list = r.results || [];
    box.innerHTML = list.length ? '<div class="shotv">' + list.map(x => '<img src="' + esc(String(x.image).replace('/media/screenshots/', '/media/resize/640/-/screenshots/')) + '" data-act="shot" data-full="' + esc(x.image) + '" loading="lazy">').join('') + '</div>' : '<div class="status">Скриншотов нет</div>';
  } catch (e) { box.innerHTML = '<div class="status">' + esc(e.message) + '</div>'; }
}
async function openSearchFilters() {
  const f = S.search.f, row = (label, val, act) => '<div class="row" data-act="' + act + '"><span>' + label + '</span><span style="color:var(--mut)">' + (val || 'Все') + ' ›</span></div>';
  openSheet('<div class="hdr2"><h2>Фильтры поиска</h2><button class="btn" data-act="sReset">Сбросить</button></div>' + row('Жанр', f.genreName, 'sfGenre') + row('Платформа', f.platformName, 'sfPlatform') + row('Год', f.year, 'sfYear') + row('Мин. рейтинг (из 10)', f.minRating ? '★' + f.minRating : '', 'sfRating')
    + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Готово</button>');
}

/* ====================== Настройки ====================== */
function viewSettings() {
  const propRows = S.props.map(p => '<div class="row"><span>' + esc(p.name) + ' <span class="sub">(' + ({ text: 'текст', number: 'число', date: 'дата' }[p.type]) + ')</span></span><button class="btn red" data-act="propDel" data-id="' + p.id + '">✕</button></div>').join('');
  return '<div class="hdr2"><h2>Настройки</h2></div>'
    + '<div class="sec"><h3 style="margin-top:0">Оформление</h3><div class="chips">' + [['dark', 'Тёмная'], ['light', 'Светлая'], ['auto', 'Как в системе']].map(x => '<button class="p' + (S.set.theme === x[0] ? ' on' : '') + '" data-act="setTheme" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div></div>'
    + '<div class="sec"><h3 style="margin-top:0">Ключ RAWG</h3>' + blockBanner(false) + '<label class="field"><input id="keyIn" value="' + esc(S.set.rawgKey) + '" placeholder="вставьте ключ"></label><div class="toolbar"><button class="btn acc" data-act="saveKey">Сохранить и проверить</button></div>' + usageHtml() + '<p class="sub">Бесплатный ключ: rawg.io/apidocs (регистрация, «Get API Key»).</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">SteamGridDB (обложки)</h3><label class="field"><input id="sgdbIn" value="' + esc(S.set.sgdbKey) + '" placeholder="ключ SteamGridDB (необязательно)"></label><div class="toolbar"><button class="btn acc" data-act="saveSgdb">Сохранить</button></div><p class="sub">Запросов в этом месяце: <b>' + usageCount('sgdb') + '</b>. Если у игры нет обложки в RAWG, она подгружается отсюда сама; для остальных игр в карточке есть кнопка выбора обложки. Ключ: steamgriddb.com, профиль, настройки, API. В браузере запросы могут блокироваться, надёжнее работает приложение Android.</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">Время прохождения (HLTB)</h3><p class="sub">Запросов к HowLongToBeat в этом месяце: <b>' + usageCount('hltb') + '</b>. Работает только в приложении Android, у сайта нет официального API и он часто меняется: если поиск перестал работать, время можно вписать вручную. Результаты кэшируются на 7 дней.</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">Данные</h3><p class="sub">Игр: ' + S.games.length + ' · коллекций: ' + S.collections.length + '<br>Данные хранятся только на этом устройстве. Делайте резервную копию и переносите её между телефоном и компьютером файлом.</p><div class="toolbar"><button class="btn acc" data-act="export">Экспорт в файл</button><button class="btn" data-act="import">Импорт из файла</button><button class="btn" data-act="fixDupes">Проверить дубли</button></div><input type="file" id="impFile" accept=".json,application/json" class="hidden"></div>'
    + '<div class="sec"><h3 style="margin-top:0">Свои свойства</h3>' + (propRows || '<p class="sub">Свойства других типов (текст, число, дата) для игр. Для «галочек» используйте коллекции.</p>') + '<div class="toolbar"><button class="btn" data-act="propAdd">＋ Добавить свойство</button></div></div>'
    + (installEvt ? '<div class="sec"><button class="btn acc" data-act="install">Установить приложение</button></div>' : '')
    + '<div class="sec"><button class="btn red" data-act="wipe">Удалить все данные</button></div>';
}
function dl(name, text) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 1000);
}
const dataUrlToBlob = u => { const p = u.split(','), mime = (p[0].match(/:(.*?);/) || [])[1] || 'image/jpeg', bin = atob(p[1]), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: mime }); };
const blobToDataUrl = b => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); });
async function exportData() {
  toast('Готовим файл…');
  const covers = {};
  for (const g of S.games) { if (g.hasCover) { const c = await DB.get('covers', g.id); if (c) covers[g.id] = await blobToDataUrl(c.blob); } }
  const text = JSON.stringify({ app: 'game-catalog', version: 1, exported: new Date().toISOString(), games: S.games, collections: S.collections, props: S.props, covers, inbox: S.inbox });
  const name = 'game-catalog-' + new Date().toISOString().slice(0, 10) + '.json';
  const FS = plug('Filesystem'), SH = plug('Share');
  if (isNative() && FS && SH) {
    try { const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' }); await SH.share({ title: 'Каталог игр', url: r.uri, dialogTitle: 'Сохранить копию' }); return; } catch (e) { toast('Не удалось поделиться: ' + (e.message || e)); return; }
  }
  dl(name, text);
}
async function importData(d, mode) {
  if (!d || d.app !== 'game-catalog') throw new Error('Это не файл копии каталога');
  if (mode === 'replace') {
    for (const s of ['games', 'collections', 'props', 'covers', 'inboxLists', 'inboxItems']) await DB.clear(s);
    S.inbox = { lists: [], items: [] }; S.inboxList = null;
    coverCache.forEach(u => URL.revokeObjectURL(u)); coverCache.clear(); S.games = []; S.collections = []; S.props = [];
  }
  const cmap = {}, pmap = {};
  for (const c of d.collections || []) {
    let ex = S.collections.find(x => x.name.toLowerCase() === c.name.toLowerCase());
    if (!ex) { ex = { id: S.collections.some(x => x.id === c.id) ? uid() : c.id, name: c.name, created: c.created || Date.now() }; S.collections.push(ex); await DB.put('collections', ex); }
    cmap[c.id] = ex.id;
  }
  for (const p of d.props || []) {
    let ex = S.props.find(x => x.name.toLowerCase() === p.name.toLowerCase() && x.type === p.type);
    if (!ex) { ex = { id: S.props.some(x => x.id === p.id) ? uid() : p.id, name: p.name, type: p.type }; S.props.push(ex); await DB.put('props', ex); }
    pmap[p.id] = ex.id;
  }
  let n = 0; const gmap = {};
  for (const g of d.games || []) {
    const colls = (g.collections || []).map(id => cmap[id]).filter(Boolean), props = {};
    Object.keys(g.props || {}).forEach(k => { if (pmap[k]) props[pmap[k]] = g.props[k]; });
    let t = S.games.find(x => (g.rawgId && x.rawgId === g.rawgId) || (!g.rawgId && x.name === g.name && x.year === g.year));
    if (t) {
      colls.forEach(c => { if (!t.collections.includes(c)) t.collections.push(c); }); t.props = Object.assign({}, props, t.props); if (!t.done && g.done) t.done = true;
      ['description', 'series', 'coverUrl'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; }); ['time', 'rating', 'year'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; });
    } else {
      t = Object.assign({ genres: [], platforms: [], series: '', description: '', time: 0, rating: 0, year: 0 }, g, { series: canonSeries(g.series), id: S.games.some(x => x.id === g.id) ? uid() : g.id, collections: colls, props });
      t.hasCover = false; S.games.push(t);
    }
    const cv = d.covers && d.covers[g.id];
    if (cv && !t.hasCover) { try { await setCover(t.id, dataUrlToBlob(cv)); } catch (e) { /* пропускаем */ } }
    gmap[g.id] = t.id;
    await DB.put('games', t); n++;
  }
  const lmap = {}, inb = d.inbox || { lists: [], items: [] };
  for (const l of inb.lists || []) {
    let ex = S.inbox.lists.find(x => x.name.toLowerCase() === l.name.toLowerCase());
    if (!ex) { ex = { id: S.inbox.lists.some(x => x.id === l.id) ? uid() : l.id, name: l.name, created: l.created || Date.now() }; S.inbox.lists.push(ex); await DB.put('inboxLists', ex); }
    lmap[l.id] = ex.id;
  }
  for (const i of inb.items || []) {
    const lid = lmap[i.listId]; if (!lid || S.inbox.items.some(x => x.listId === lid && x.text.toLowerCase() === i.text.toLowerCase())) continue;
    const it = Object.assign({}, i, { id: S.inbox.items.some(x => x.id === i.id) ? uid() : i.id, listId: lid, gameId: i.done ? (gmap[i.gameId] || '') : '' });
    if (it.done && !it.gameId) it.done = false;
    S.inbox.items.push(it); await DB.put('inboxItems', it);
  }
  return n;
}

/* ====================== Отрисовка и события ====================== */
function render() {
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
  const fab = $('#fab'); fab.classList.toggle('hidden', !(S.tab === 'library' || S.tab === 'collections' || (S.tab === 'inbox' && !S.inboxList)) || S.selMode);
  const v = $('#view');
  if (S.tab === 'library') { v.innerHTML = viewLibrary(); renderLibrary(); }
  else if (S.tab === 'collections') { v.innerHTML = viewCollections(); renderSelBar(); }
  else if (S.tab === 'inbox') { v.innerHTML = viewInbox(); renderSelBar(); }
  else if (S.tab === 'series') { v.innerHTML = viewSeries(); renderSelBar(); }
  else if (S.tab === 'search') { v.innerHTML = viewSearch(); renderSearchBody(); renderSelBar(); }
  else { v.innerHTML = viewSettings(); renderSelBar(); }
}
const lp = { t: null, fired: false };
const ACT = {
  tab: t => { if (t.dataset.tab !== 'search') S.pending = null; S.tab = t.dataset.tab; S.selMode = false; S.sel.clear(); closeSheet(); render(); $('#view').scrollTop = 0; },
  fab: () => S.tab === 'collections' ? createCollection().then(c => { if (c) render(); }) : S.tab === 'inbox' ? createList() : openGameSheet(null),
  closeSheet: () => closeSheet(),
  clearQ: () => { S.set.f.q = ''; saveSet(); if (S.tab === 'library') { const q = $('#q'); if (q) q.value = ''; renderLibrary(); if (sheetEl) openFilters(); } },
  clearSQ: () => { S.search.q = ''; const q = $('#sq'); if (q) q.value = ''; runSearch(true); },
  collAll: () => { S.set.f.collections = []; saveSet(); renderLibrary(); },
  collChip: t => { const c = S.set.f.collections, i = c.indexOf(t.dataset.id); i < 0 ? c.push(t.dataset.id) : c.splice(i, 1); saveSet(); renderLibrary(); },
  collOpen: t => { S.set.f.collections = t.dataset.id === 'all' ? [] : [t.dataset.id]; saveSet(); S.tab = 'library'; render(); },
  collMenu: (t, e) => { e.stopPropagation(); collMenu(t.dataset.id); },
  serOpen: t => { Object.assign(S.set.f, { q: '', years: [], genres: [], platforms: [], series: [t.dataset.name], collections: [], props: [], done: '', minRating: 0 }); saveSet(); S.tab = 'library'; render(); },
  serMenu: (t, e) => { e.stopPropagation(); serMenu(t.dataset.name); },
  collMode: t => { S.set.f.collMode = t.dataset.v; saveSet(); openFilters(); renderLibrary(); },
  toggleView: () => { S.set.view = S.set.view === 'grid' ? 'list' : 'grid'; saveSet(); renderLibrary(); },
  openFilters: () => openFilters(), openCols: () => openCols(),
  colToggle: t => { const c = S.set.cols; c[t.dataset.k] = c[t.dataset.k] ? 0 : 1; saveSet(); openCols(); renderLibrary(); },
  sortBy: t => { const f = S.set.f; if (f.sort === t.dataset.k) f.dir = f.dir === 'asc' ? 'desc' : 'asc'; else { f.sort = t.dataset.k; f.dir = 'asc'; } saveSet(); renderLibrary(); },
  fToggle: t => { const a = S.set.f[t.dataset.k], v = t.dataset.k === 'years' ? +t.dataset.v : t.dataset.v, i = a.findIndex(x => String(x) === String(v)); i < 0 ? a.push(v) : a.splice(i, 1); saveSet(); openFilters(); renderLibrary(); },
  rmF: t => { const k = t.dataset.k; S.set.f[k] = S.set.f[k].filter(x => String(x) !== t.dataset.v); saveSet(); renderLibrary(); },
  resetF: () => { const f = S.set.f; Object.assign(f, { q: '', years: [], genres: [], platforms: [], series: [], collections: [], props: [], done: '', minRating: 0 }); saveSet(); const q = $('#q'); if (q) q.value = ''; renderLibrary(); if (sheetEl) openFilters(); },
  selToggle: () => { S.selMode = !S.selMode; S.sel.clear(); renderLibrary(); $('#fab').classList.toggle('hidden', S.selMode); },
  selAct: t => selectionAction(t.dataset.m),
  openGame: (t) => { if (lp.fired) { lp.fired = false; return; } const id = t.dataset.gid; if (S.selMode) toggleSel(id); else openGameSheet(id); },
  openGameFromRawg: t => { closeSheet(); openGameSheet(t.dataset.id); },
  pickCover: () => $('#coverFile').click(),
  shColl: t => { markDirty(); const d = S.sheet.draft, i = d.collections.indexOf(t.dataset.id); i < 0 ? d.collections.push(t.dataset.id) : d.collections.splice(i, 1); drawShColls(); },
  shNewColl: async () => { markDirty(); const c = await createCollection(); if (c && !S.sheet.draft.collections.includes(c.id)) S.sheet.draft.collections.push(c.id); drawShColls(); },
  saveGame: () => closeSheet(),
  pickSeries: async () => {
    const m = new Map(); S.games.forEach(g => { if (g.series) m.set(g.series, (m.get(g.series) || 0) + 1); });
    const names = Array.from(m.keys()).sort((a, b) => a.localeCompare(b, 'ru'));
    const r = await choose({ title: 'Серия игр', items: [{ id: '__none', label: 'Без серии' }].concat(names.map(n => ({ id: n, label: n, sub: m.get(n) + ' игр' }))) });
    if (r === null) return; const f = $('#f_series'); if (f) { f.value = r === '__none' ? '' : r; markDirty(); }
  },
  togglePin: () => { S.set.pin = !S.set.pin; saveSet(); renderLibrary(); if (sheetEl) openCols(); },
  colProp: t => { const pc = S.set.propCols = S.set.propCols || {}; pc[t.dataset.id] = pc[t.dataset.id] === 0 ? 1 : 0; saveSet(); openCols(); renderLibrary(); },
  fixDupes: async () => { await checkDupes(false); render(); },
  delGame: async () => { const id = S.sheet.draft.id; if (await confirmBox('Удалить игру «' + S.sheet.draft.name + '»?', 'Удалить')) { if (S.sheet) S.sheet.dirty = false; await removeGame(id); closeSheet(); render(); } },
  refreshRawg: () => refreshFromRawg(S.sheet.draft.id),
  findRawg: () => { const n = $('#f_name').value; closeSheet(); S.search.q = n; S.tab = 'search'; render(); runSearch(true); },
  seriesCatalog: () => { const s = $('#f_series').value.trim(); closeSheet(); S.set.f.series = [s]; S.set.f.collections = []; saveSet(); S.tab = 'library'; render(); },
  seriesRawg: () => showSeries(S.sheet.draft.rawgId, S.sheet.draft.series || S.sheet.draft.name),
  sFilters: () => openSearchFilters(),
  sReset: () => { Object.assign(S.search.f, { genre: '', genreName: '', platform: '', platformName: '', year: '', minRating: 0 }); closeSheet(); renderSearchBody(); runSearch(true); },
  sRm: t => { const f = S.search.f, k = t.dataset.k; f[k] = k === 'minRating' ? 0 : ''; if (k === 'genre') f.genreName = ''; if (k === 'platform') f.platformName = ''; runSearch(true); },
  sBack: () => { S.search.mode = 'search'; runSearch(true); },
  sMore: () => runSearch(false),
  sfGenre: async () => { try { const l = await loadLists(); const r = await choose({ title: 'Выбрать жанр', items: [{ id: '', label: 'Все' }].concat(l.genres.map(x => ({ id: x.id, label: x.name }))) }); if (r !== null) { const g = l.genres.find(x => String(x.id) === r); Object.assign(S.search.f, { genre: r, genreName: g ? g.name : '' }); closeSheet(); renderSearchBody(); runSearch(true); } } catch (e) { toast(e.message); } },
  sfPlatform: async () => { try { const l = await loadLists(); const r = await choose({ title: 'Выбрать платформу', items: [{ id: '', label: 'Все' }].concat(l.platforms.map(x => ({ id: x.id, label: x.name }))) }); if (r !== null) { const p = l.platforms.find(x => String(x.id) === r); Object.assign(S.search.f, { platform: r, platformName: p ? p.name : '' }); closeSheet(); renderSearchBody(); runSearch(true); } } catch (e) { toast(e.message); } },
  sfYear: async () => { const y = new Date().getFullYear(), items = [{ id: '', label: 'Все' }]; for (let i = y + 1; i >= 1975; i--) items.push({ id: i, label: String(i) }); const r = await choose({ title: 'Год выпуска', items }); if (r !== null) { S.search.f.year = r; closeSheet(); renderSearchBody(); runSearch(true); } },
  sfRating: async () => { const r = await choose({ title: 'Минимальный рейтинг', items: [{ id: 0, label: 'Все' }, { id: 5, label: '★ 5+' }, { id: 6, label: '★ 6+' }, { id: 7, label: '★ 7+' }, { id: 8, label: '★ 8+' }, { id: 9, label: '★ 9+' }] }); if (r !== null) { S.search.f.minRating = +r; closeSheet(); renderSearchBody(); runSearch(true); } },
  openRawg: t => openRawgSheet(+t.dataset.rid),
  quickAdd: async (t, e) => { e.stopPropagation(); t.textContent = '…'; try { const g = await addFromRawg(+t.dataset.rid); toast('Добавлено'); if (g && tryLinkPending(g)) return; } catch (er) { toast(er.message); } renderSearchBody(); },
  rsAdd: async t => { t.textContent = '…'; try { const g = await addFromRawg(+t.dataset.rid); toast('Добавлено'); if (g && tryLinkPending(g)) { closeSheet(); return; } } catch (er) { toast(er.message); } openRawgSheet(+t.dataset.rid); renderSearchBody(); },
  rsLink: t => { const g = S.games.find(x => x.rawgId === +t.dataset.rid); if (g && tryLinkPending(g)) closeSheet(); },
  rsColl: async t => {
    const rid = +t.dataset.rid, cat = S.games.find(g => g.rawgId === rid);
    const ids = await pickCollections(cat ? 'Коллекции игры' : 'Добавить в коллекцию', cat ? cat.collections : []); if (!ids) return;
    try {
      let g;
      if (cat) { cat.collections = ids; await saveGame(cat); g = cat; } else g = await addFromRawg(rid, ids);
      toast('Коллекции сохранены'); if (g && tryLinkPending(g)) { closeSheet(); return; }
    } catch (er) { toast(er.message); }
    openRawgSheet(rid); renderSearchBody();
  },
  setMinRating: t => { S.set.f.minRating = +t.dataset.v; saveSet(); renderLibrary(); if (sheetEl) openFilters(); },
  zoom: t => { const k = t.dataset.k, R = ZOOM_RANGE[k], c = colsFor(k); S.set.zoom[k] = c >= R[1] ? R[0] : c + 1; saveSet(); if (S.tab === 'library') renderLibrary(); else render(); },
  setTheme: t => { S.set.theme = t.dataset.v; saveSet(); applyTheme(); render(); },
  unblock: () => { S.block = null; render(); if (S.tab === 'search') runSearch(true); },
  saveSgdb: async () => { S.set.sgdbKey = $('#sgdbIn').value.trim(); await saveSet(); toast(S.set.sgdbKey ? 'Ключ SteamGridDB сохранён' : 'Ключ удалён'); },
  sgdbOpen: () => { const id = S.sheet.draft.id; closeSheet(); openSgdb(id); },
  sgdbUse: async t => { const gr = S.sgdb && S.sgdb.grids[+t.dataset.i], g = S.sgdb && gameById(S.sgdb.gid); if (!gr || !g) return; toast('Загрузка обложки…'); await applyCoverUrl(g, gr.url); closeSheet(); toast('Обложка заменена'); render(); },
  hltbTime: async () => {
    const nm = $('#f_name'); const name = nm ? nm.value.trim() : ''; if (!name) return toast('Укажите название');
    toast('Ищем на HLTB…');
    try {
      const list = await hltbFind(name); if (!list.length) return toast('HLTB: данных о времени нет');
      let pick = list[0];
      if (list.length > 1) {
        const id = await choose({ title: 'Время из HLTB (среднее Main + Extra)', items: list.map((x, i) => ({ id: i, label: x.name + (x.year ? ' (' + x.year + ')' : ''), sub: '≈ ' + x.hours + ' ч (основной ' + x.main + ' ч, с допами ' + x.plus + ' ч)' })) });
        if (id === null) return; pick = list[+id];
      }
      const f = $('#f_time'); if (f) f.value = pick.hours; toast('HLTB: ' + pick.hours + ' ч - нажмите «Сохранить»');
    } catch (e) { toast(e.message); }
  },
  setDone: t => { S.set.f.done = t.dataset.v; saveSet(); renderLibrary(); if (sheetEl) openFilters(); },
  shDone: t => { markDirty(); const d = S.sheet.draft; d.done = !d.done; t.classList.toggle('on', d.done); t.textContent = (d.done ? '✓ ' : '') + 'Прошёл'; },
  rsDone: async t => { const rid = +t.dataset.rid; try { let g = S.games.find(x => x.rawgId === rid); if (!g) g = await addFromRawg(rid); if (!g) return; g.done = !g.done; await saveGame(g); } catch (e) { toast(e.message); return; } openRawgSheet(rid); renderSearchBody(); },
  loadShots: t => loadShots(+t.dataset.rid),
  shot: t => { const d = document.createElement('div'); d.className = 'lb'; d.innerHTML = '<img src="' + esc(t.dataset.full) + '">'; d.onclick = () => d.remove(); $('#layer').appendChild(d); },
  listOpen: t => { S.inboxList = t.dataset.id; render(); $('#view').scrollTop = 0; },
  listBack: () => { S.inboxList = null; render(); },
  listMenu: (t, e) => { e.stopPropagation(); listMenu(t.dataset.id); },
  itAdd: async () => { const i = $('#itNew'); if (!i || !i.value.trim() || !S.inboxList) return; await addItems(S.inboxList, [i.value]); render(); const n = $('#itNew'); if (n) n.focus(); },
  itPaste: () => pasteModal(S.inboxList),
  itToggleDone: () => { S.showDone = !S.showDone; render(); },
  itOpen: t => {
    const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it) return;
    if (it.done) { const g = gameById(it.gameId); if (g) openGameSheet(g.id); else toast('Игра удалена из каталога'); return; }
    S.pending = { itemId: it.id }; S.search.q = it.text; S.search.mode = 'search'; S.tab = 'search'; render(); runSearch(true);
  },
  itMatch: t => matchItem(S.inbox.items.find(i => i.id === t.dataset.id)),
  itEdit: async t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it || it.done) return; const n = await promptBox('Название игры', it.text); if (n) { it.text = n; await DB.put('inboxItems', it); render(); } },
  itDel: async t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it) return; if (!await confirmBox('Удалить «' + it.text + '» из списка?', 'Удалить')) return; S.inbox.items = S.inbox.items.filter(i => i.id !== it.id); await DB.del('inboxItems', it.id); render(); },
  pendingCancel: () => { S.pending = null; S.tab = 'inbox'; render(); },
  pendingMatch: () => matchItem(pendingItem()),
  rsSeries: t => showSeries(+t.dataset.rid, t.dataset.t),
  saveKey: async () => { S.set.rawgKey = $('#keyIn').value.trim(); S.block = null; await saveSet(); S.lists = {}; if (!S.set.rawgKey) return toast('Ключ удалён'); try { await rawg('/genres'); toast('Ключ работает'); } catch (e) { toast(e.message); } },
  export: () => exportData(),
  import: () => $('#impFile').click(),
  propAdd: async () => { const n = await promptBox('Название свойства'); if (!n) return; if (S.props.some(p => normName(p.name) === normName(n))) return toast('Свойство с таким названием уже есть'); const t = await choose({ title: 'Тип значения', items: [{ id: 'text', label: 'Текст' }, { id: 'number', label: 'Число' }, { id: 'date', label: 'Дата' }] }); if (!t) return; const p = { id: uid(), name: n, type: t }; S.props.push(p); await DB.put('props', p); render(); },
  propDel: async t => { if (!await confirmBox('Удалить свойство и его значения у всех игр?', 'Удалить')) return; const id = t.dataset.id; S.props = S.props.filter(p => p.id !== id); await DB.del('props', id); for (const g of S.games) if (g.props && id in g.props) { delete g.props[id]; await saveGame(g); } S.set.f.props = S.set.f.props.filter(x => x !== id); saveSet(); render(); },
  install: async () => { if (installEvt) { installEvt.prompt(); installEvt = null; render(); } },
  wipe: async () => { if (!await confirmBox('Удалить ВСЕ игры, коллекции и свойства на этом устройстве?', 'Удалить всё')) return; for (const s of ['games', 'collections', 'props', 'covers', 'inboxLists', 'inboxItems']) await DB.clear(s); coverCache.clear(); S.games = []; S.collections = []; S.props = []; S.inbox = { lists: [], items: [] }; S.inboxList = null; S.set.f = clone(DEFAULTS.f); saveSet(); render(); toast('Данные удалены'); }
};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const fn = ACT[t.dataset.act]; if (fn) fn(t, e);
});
document.addEventListener('pointerdown', e => {
  const c = e.target.closest('.card[data-gid]'); if (!c || S.tab !== 'library') return;
  lp.fired = false; clearTimeout(lp.t); lp.t = setTimeout(() => { lp.fired = true; toggleSel(c.dataset.gid, true); }, 550);
});
['pointerup', 'pointercancel', 'pointermove', 'scroll'].forEach(ev => document.addEventListener(ev, () => { clearTimeout(lp.t); if (ev === 'pointerup') setTimeout(() => { lp.fired = false; }, 450); }, true));
document.addEventListener('keydown', e => { if (e.target.id === 'itNew' && e.key === 'Enter') ACT.itAdd(); });
document.addEventListener('contextmenu', e => { if (e.target.closest && e.target.closest('.card')) e.preventDefault(); });
document.addEventListener('input', e => { if (S.sheet && sheetEl && sheetEl.contains(e.target)) markDirty(); }, true);
document.addEventListener('change', e => { if (S.sheet && sheetEl && sheetEl.contains(e.target)) markDirty(); }, true);
let qT;
document.addEventListener('input', e => {
  if (e.target.id === 'q') { S.set.f.q = e.target.value; saveSet(); renderLibHead(); renderLibBody(); }
  else if (e.target.id === 'sq') { clearTimeout(qT); const v = e.target.value; qT = setTimeout(() => { S.search.q = v; runSearch(true); }, 600); }
});
document.addEventListener('change', async e => {
  if (e.target.id !== 'impFile' || !e.target.files[0]) return;
  const file = e.target.files[0]; e.target.value = '';
  try {
    const d = JSON.parse(await file.text());
    const mode = await choose({ title: 'Импорт: игр в файле ' + ((d.games || []).length), items: [{ id: 'merge', label: 'Объединить с текущими данными' }, { id: 'replace', label: 'Заменить все данные' }] });
    if (!mode) return;
    if (mode === 'replace' && !await confirmBox('Текущие данные будут удалены. Продолжить?', 'Заменить')) return;
    const n = await importData(d, mode); await saveSet(); toast('Импортировано игр: ' + n); render();
  } catch (er) { toast(er.message || 'Не удалось прочитать файл'); }
});
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (S.tab === 'settings') render(); });

function applyTheme() {
  const t = S.set.theme || 'dark';
  const dark = t === 'dark' || (t === 'auto' && !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches));
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', dark ? '#0b0b0d' : '#f2f3f6');
}
window.__GC = { canonSeries, findDupes, mergeAllDupes, collectSheet, persistDraft, closeSheet, S, ACT, bump, rawg, hltbFind, sgdbAuto, openSgdb, applyTheme, colsFor, usageHtml, serMenu, viewInbox, addItems, linkItem, createList, pendingItem, render, runSearch, addFromRawg, importData, openRawgSheet, openGameSheet, openFilters, openCols, selectionAction, loadAll, renderSearchBody };
(async () => {
  try {
    await loadAll();
    applyTheme();
    if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: light)'); if (mq.addEventListener) mq.addEventListener('change', () => { if (S.set.theme === 'auto') applyTheme(); }); }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
    if (!isNative() && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    const A = plug('App');
    if (isNative() && A) A.addListener('backButton', () => {
      if (modalEl && modalCancel) modalCancel(); else if (sheetEl) closeSheet(); else if (S.selMode) { S.selMode = false; S.sel.clear(); renderLibrary(); $('#fab').classList.remove('hidden'); } else if (S.tab === 'inbox' && S.inboxList) { S.inboxList = null; render(); } else if (S.tab !== 'library') { S.tab = 'library'; render(); } else A.exitApp();
    });
    render();
  } catch (e) { document.body.innerHTML = '<p style="padding:20px">Ошибка запуска: ' + esc(e.message || e) + '</p>'; }
})();
})();
