'use strict';
(() => {
/* ====================== Утилиты ====================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bgu = u => esc(String(u == null ? '' : u).replace(/['"()\\\s]/g, c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const hasVal = v => v !== undefined && v !== null && v !== '' && v !== false;
const clone = o => JSON.parse(JSON.stringify(o));
const isNative = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
function openExternal(url) { // в приложении Android страница открывается внутри приложения (Custom Tab), в браузере в новой вкладке
  const B = plug('Browser'); if (isNative() && B && B.open) B.open({ url }); else window.open(url, '_blank', 'noopener');
}
const plug = n => window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n];

const COLS = [['cover', 'Обложка'], ['genres', 'Жанры'], ['mainPlatform', 'Основная платформа'], ['platforms', 'Платформы'], ['done', 'Завершено'], ['doneDate', 'Дата прохождения'], ['year', 'Год'], ['rating', 'Рейтинг'], ['time', 'Время'], ['series', 'Серия'], ['colls', 'Коллекции']];
const SORTS = [['name', 'Название'], ['year', 'Год'], ['rating', 'Рейтинг'], ['time', 'Время прохождения'], ['series', 'Серия'], ['mainPlatform', 'Основная платформа'], ['added', 'Дата добавления'], ['done', 'Завершено'], ['doneDate', 'Дата прохождения']];
const DEFAULTS = {
  rawgKey: '', mainSrc: 'igdb', rawgQuota: { left: 20000, renew: '' }, rawgWarn: 0, igdbId: '', igdbSecret: '', igdbToken: '', igdbExp: 0, igdbProxy: '', exp: { fmt: 'csv', keys: ['name', 'year', 'platforms', 'mainPlatform', 'time', 'done'] }, sgdbKey: '', pin: true, propCols: {}, theme: 'dark', zoom: {}, usage: { m: '', igdb: 0, sgdb: 0, hltb: 0 }, hltbCache: {}, view: 'grid', pageSize: 40, vmode: { coll: 'tiles', series: 'tiles', search: 'tiles' },
  cols: { cover: 1, genres: 1, mainPlatform: 1, platforms: 0, done: 1, doneDate: 1, year: 1, rating: 1, time: 1, series: 1, colls: 1 },
  f: { q: '', years: [], genres: [], platforms: [], series: [], collections: [], collMode: 'or', props: [], mainPlats: [], done: '', minRating: 0, sort: 'name', dir: 'asc' }
};

/* ====================== Чистая логика ====================== */
const DONE_ID = '__done'; // встроенная коллекция «Завершено»: игры с отметкой, хранится не в базе, а считается
const RESERVED = ['все игры', 'завершено', 'пройдено'];
const NO_MAIN = '__none'; // в фильтре: «основная платформа не выбрана»
// основная платформа: выбранная вручную, а если платформа у игры одна, то она
const mainOf = g => g.mainPlatform || ((g.platforms || []).length === 1 ? g.platforms[0] : '');
const gWord = n => { const a = n % 100, b = n % 10; return n + ' ' + (a > 10 && a < 15 ? 'игр' : b === 1 ? 'игра' : b > 1 && b < 5 ? 'игры' : 'игр'); };
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
// раньше источник не отдавал название серии - определяем по общему началу названий игр серии
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
    if (f.mainPlats && f.mainPlats.length && !f.mainPlats.includes(mainOf(g) || NO_MAIN)) return false;
    if (f.series.length && !f.series.includes(g.series)) return false;
    if (f.done === 'yes' && !g.done) return false;
    if (f.done === 'no' && g.done) return false;
    if (f.minRating && (g.rating || 0) < f.minRating) return false;
    if (f.collections.length) {
      const has = id => id === DONE_ID ? !!g.done : (g.collections || []).includes(id);
      if (!(f.collMode === 'and' ? f.collections.every(has) : f.collections.some(has))) return false;
    }
    if (f.props.length && !f.props.some(id => hasVal(g.props && g.props[id]))) return false;
    return true;
  });
}
function sortGames(list, f) {
  const k = f.sort, d = f.dir === 'desc' ? -1 : 1;
  const isProp = k.startsWith('prop:');
  const val = g => k === 'name' ? (g.name || '').toLowerCase() : k === 'series' ? (g.series || '').toLowerCase() : k === 'mainPlatform' ? mainOf(g).toLowerCase() : isProp ? ((g.props && g.props[k.slice(5)] != null) ? g.props[k.slice(5)] : '') : (g[k] || 0);
  list.sort((a, b) => {
    const x = val(a), y = val(b);
    if ((k === 'series' || k === 'mainPlatform' || isProp) && !x !== !y) return !x ? 1 : -1; // пустые значения в конце
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

// Строка списка: «Игра | 12ч | 2020», «Игра<TAB>2020», «Игра (2020)»; год берём только в колонке или в скобках
function parseLine(raw) {
  let t = String(raw).replace(/^\s*(?:\d+[.)]|[-•*–])\s*/, '').trim(); if (!t) return null;
  let gid = ''; const im = t.match(/^id\s*[:=]?\s*([^\s|]+)\s*\|\s*/i); if (im) { gid = im[1]; t = t.slice(im[0].length); }
  // «Название (2013 | PC, PS4) – 23 ч»: год, платформы и время в одной строке
  const m = t.match(/^(.*?)\s*\(\s*((?:19|20)\d{2})\s*(?:\|\s*([^)]*))?\)\s*(?:[–—-]\s*(\d+(?:[.,]\d+)?)\s*(?:ч|h)\.?)?\s*$/i);
  if (m && m[1]) { let nm0 = m[1].trim(); const ym0 = nm0.match(/^(.*\S)\s*\((\d{4})\)$/); if (ym0 && +ym0[2] === +m[2]) nm0 = ym0[1]; const plats = m[3] ? m[3].split(',').map(x => x.trim()).filter(Boolean) : []; return Object.assign({ text: nm0, year: +m[2], hours: m[4] ? +m[4].replace(',', '.') : 0 }, gid || plats.length ? { x: { gid, platforms: plats } } : {}); }
  const parts = t.split(/\t|\s*\|\s*|;/).map(x => x.trim()).filter(Boolean);
  let name = parts[0] || '', year = 0, hours = 0;
  for (const p of parts.slice(1)) {
    const hm = p.match(/^(\d+(?:[.,]\d+)?)\s*(?:ч|h|hr|hrs|hours?|час\w*)\.?$/i);
    if (hm) { hours = +hm[1].replace(',', '.'); continue; }
    if (/^(?:19|20)\d{2}$/.test(p)) year = +p;
  }
  if (parts.length === 1) { const m2 = name.match(/^(.*\S)\s*[(\[]\s*((?:19|20)\d{2})\s*[)\]]$/); if (m2) { name = m2[1].trim(); year = +m2[2]; } }
  return name ? Object.assign({ text: name, year, hours }, gid ? { x: { gid } } : {}) : null;
}
// CSV и текст с разделителем: разбор таблицы с кавычками и переносами внутри ячеек
function parseCsv(text, delim) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"' && !cell) q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some(x => x.trim())) rows.push(row); row = []; }
    else cell += c;
  }
  row.push(cell); if (row.some(x => x.trim())) rows.push(row);
  return rows;
}
const EXPORT_COLS = [['id', 'id'], ['name', 'Название'], ['year', 'Год'], ['platforms', 'Платформы'], ['mainPlatform', 'Основная платформа'], ['genres', 'Жанры'], ['time', 'Время (ч)'], ['rating', 'Рейтинг'], ['series', 'Серия'], ['collections', 'Коллекции'], ['done', 'Завершено'], ['doneDate', 'Дата прохождения'], ['igdbId', 'IGDB id'], ['rawgId', 'RAWG id']];
const HEAD_NAMES = { id: ['id', 'код'], name: ['название', 'name', 'игра', 'title'], year: ['год', 'year'], platforms: ['платформы', 'платформа', 'platforms'], mainPlatform: ['основная платформа', 'main platform'], genres: ['жанры', 'жанр', 'genres'], time: ['время (ч)', 'время', 'часы', 'hours', 'time'], rating: ['рейтинг', 'rating'], series: ['серия', 'series'], collections: ['коллекции', 'collections'], done: ['завершено', 'пройдено', 'done'], doneDate: ['дата прохождения', 'done date'], igdbId: ['igdb id', 'igdbid'], rawgId: ['rawg id', 'rawgid'] };
function exportValue(g, key, collName) {
  switch (key) {
    case 'id': return g.id; case 'name': return g.name; case 'year': return g.year || ''; case 'platforms': return (g.platforms || []).join(', ');
    case 'mainPlatform': return mainOf(g); case 'genres': return (g.genres || []).join(', '); case 'time': return g.time || ''; case 'rating': return g.rating || '';
    case 'series': return g.series || ''; case 'collections': return (g.collections || []).map(collName).filter(Boolean).join(', ');
    case 'done': return g.done ? 'да' : ''; case 'doneDate': return g.doneDate || ''; case 'igdbId': return g.igdbId || ''; case 'rawgId': return g.rawgId || '';
  }
  return '';
}
// fmt: 'csv' (разделитель ;, кавычки по необходимости) или 'txt' (разделитель |); первая строка - заголовки
function buildExport(games, keys, fmt, collName) {
  const cols = EXPORT_COLS.filter(c => keys.includes(c[0])), d = fmt === 'txt' ? ' | ' : ';';
  const cell = v => { v = String(v == null ? '' : v); if (fmt === 'txt') return v.replace(/\s*\|\s*/g, ' / ').replace(/[\r\n]+/g, ' '); return /[;"\r\n]|^\s|\s$/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  return [cols.map(c => cell(c[1])).join(d)].concat(games.map(g => cols.map(c => cell(exportValue(g, c[0], collName || (() => '')))).join(d))).join('\r\n');
}
// текст для разбора: таблица с заголовками (из выгрузки) или обычные строки
function parseInboxText(text) {
  const raw = String(text).replace(/^\uFEFF/, ''), first = raw.split(/\r?\n/).find(l => l.trim());
  if (!first) return [];
  const best = [';', '\t', '|', ','].map(d => [d, first.split(d).length - 1]).sort((a, b) => b[1] - a[1])[0];
  if (best[1] >= 1) {
    const rows = parseCsv(raw, best[0]), key = h => { h = h.trim().toLowerCase(); return Object.keys(HEAD_NAMES).find(k => HEAD_NAMES[k].includes(h)); };
    const head = rows[0].map(key);
    if (head.includes('name') && head.filter(Boolean).length >= 2) {
      const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; }, lst = v => String(v || '').split(',').map(x => x.trim()).filter(Boolean);
      return rows.slice(1).map(r => {
        const o = {}; head.forEach((k, i) => { if (k) o[k] = (r[i] || '').trim(); });
        if (!o.name) return null;
        return { text: o.name, year: (y => y >= 1950 && y <= 2100 ? y : 0)(num(o.year)), hours: num(o.time), x: { gid: o.id || '', platforms: lst(o.platforms), mainPlatform: o.mainPlatform || '', genres: lst(o.genres), rating: num(o.rating), series: o.series || '', colls: lst(o.collections), done: /^(да|yes|1|true|✓)$/i.test(o.done || ''), doneDate: o.doneDate || '', igdbId: num(o.igdbId), rawgId: num(o.rawgId) } };
      }).filter(Boolean);
    }
  }
  return raw.split(/\r?\n/).map(parseLine).filter(Boolean);
}

if (typeof document === 'undefined') { // для проверки логики в Node
  module.exports = { parseInboxText, buildExport, parseCsv, EXPORT_COLS, mainOf, NO_MAIN, DONE_ID, gWord, seriesName, cleanSeries, shortPlat, filterGames, sortGames, DEFAULTS, hltbCandidates, similarity, parseLine };
  return;
}

/* ====================== Хранилище (IndexedDB) ====================== */
const DB = {
  db: null,
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('gamecatalog', 4);
      r.onupgradeneeded = () => {
        const d = r.result;
        ['games', 'collections', 'props', 'covers', 'shots', 'inboxLists', 'inboxItems', 'trash'].forEach(n => { if (!d.objectStoreNames.contains(n)) d.createObjectStore(n, { keyPath: 'id' }); });
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
  trash: [], shotUrls: [], igdbShots: [], cFind: '', sFind: '', block: null, inbox: { lists: [], items: [] }, inboxList: null, pending: null, showDone: true,
  tab: 'library', selMode: false, sel: new Set(), shown: [],
  retGame: null, inSel: new Set(), inSelMode: false, search: { addColls: [], src: 'igdb', q: '', f: { genre: '', genreName: '', platform: '', platformName: '', year: '', minRating: 0 }, results: [], page: 0, hasMore: false, count: 0, loading: false, token: 0, mode: 'search', title: '', started: false }
};
const coverCache = new Map();
let installEvt = null;
const saveSet = () => DB.put('settings', { key: 'main', value: S.set });
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const fmtDate = t => t ? t.slice(8, 10) + '.' + t.slice(5, 7) + '.' + t.slice(0, 4) : '';
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
  S.games = (await DB.all('games')).map(g => Object.assign({ genres: [], platforms: [], collections: [], props: {}, series: '', description: '', time: 0, rating: 0, year: 0, done: false, hasCover: false, shotCount: 0, mainPlatform: '', igdbId: 0, rawgId: 0 }, g));
  S.collections = await DB.all('collections');
  S.props = await DB.all('props');
  S.inbox = { lists: await DB.all('inboxLists'), items: await DB.all('inboxItems') };
  S.trash = await DB.all('trash');
  for (const r of S.trash.filter(x => Date.now() - x.t > 30 * 864e5)) await DB.del('trash', r.id); // корзина хранит 30 дней
  S.trash = S.trash.filter(x => Date.now() - x.t <= 30 * 864e5);
  const st = await DB.get('settings', 'main');
  if (st && st.value) {
    S.set = Object.assign(clone(DEFAULTS), st.value);
    S.set.cols = Object.assign(clone(DEFAULTS.cols), st.value.cols || {});
    S.set.f = Object.assign(clone(DEFAULTS.f), st.value.f || {});
  }
  S.set.zoom = S.set.zoom || {}; S.set.hltbCache = S.set.hltbCache || {};
  S.set.f = Object.assign(clone(DEFAULTS.f), S.set.f);
  S.set.cols = Object.assign({}, DEFAULTS.cols, S.set.cols);
  if (S.set.colsV !== 3) { // один раз: в списке основная платформа, полный список платформ выключен; жанры возвращены, если их успела выключить прошлая версия
    if (S.set.colsV === 2) S.set.cols.genres = 1;
    delete S.set.cols.mainGenre; S.set.cols.platforms = 0; S.set.cols.mainPlatform = 1; S.set.colsV = 3; saveSet();
  }
  S.set.vmode = Object.assign({ coll: 'tiles', series: 'tiles', search: 'tiles' }, S.set.vmode);
  S.set.f.collections = S.set.f.collections.filter(id => id === DONE_ID || S.collections.some(c => c.id === id)); // удалённые коллекции не должны оставаться в фильтре
  S.set.usage = Object.assign({ m: '', igdb: 0, sgdb: 0, hltb: 0 }, S.set.usage);
  const ls = await DB.get('settings', 'lists'); S.lists = ls ? (ls.value || {}) : {};
  if (S.lists.genres) S.lists = S.lists.src === 'igdb' ? { igdb: S.lists } : { rawg: S.lists }; // старый формат: один набор списков
  if (S.set.sgdbOn === undefined) S.set.sgdbOn = !!S.set.sgdbKey; // SteamGridDB включается отдельно; у кого ключ уже был, остаётся включённым
  S.set.rawgQuota = Object.assign({ left: 20000, renew: '' }, S.set.rawgQuota); rawgQuotaTick();
  if (S.set.mainSrc !== 'rawg') S.set.mainSrc = 'igdb';
  S.search.src = S.set.mainSrc;
  for (const c of await DB.all('covers')) coverCache.set(c.id, URL.createObjectURL(c.blob));
}

/* ====================== Обложки ====================== */
const coverSrc = g => coverCache.get(g.id) || (g.coverUrl ? thumbUrl(g.coverUrl) : '');
async function toThumb(blob, maxW = 420) {
  const bmp = await createImageBitmap(blob); const k = Math.min(1, maxW / bmp.width); // maxW: ширина результата
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); if (bmp.close) bmp.close();
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

/* ====================== Скриншоты в базе ====================== */
// Хранятся на устройстве (IndexedDB, хранилище 'shots': одна запись на игру со списком картинок).
// Автоматически не качаются (вес): пользователь сам выбирает нужные из IGDB или добавляет свои файлы.
const SHOT_W = 900;
const csv = t => String(t || '').split(',').map(x => x.trim()).filter(Boolean);
async function getShots(gid) { const r = await DB.get('shots', gid); return r && r.list ? r.list : []; }
async function putShots(gid, list) {
  if (list.length) await DB.put('shots', { id: gid, list }); else await DB.del('shots', gid);
  const g = gameById(gid); if (g) { g.shotCount = list.length; await saveGame(g); }
}
async function saveIgdbShot(gid, url) {
  const list = await getShots(gid); if (list.some(x => x.src === url)) return false;
  let blob; try { const r = await fetch(url); if (!r.ok) throw new Error('x'); blob = await toThumb(await r.blob(), SHOT_W); }
  catch (e) { throw new Error('Не удалось скачать скриншот: нет связи или сайт блокирует загрузку'); }
  list.push({ n: uid(), src: url, blob }); await putShots(gid, list); return true;
}
// для новой игры сначала сохраняем карточку, чтобы было к чему привязать скриншоты
async function sheetGameId() {
  const sh = S.sheet; if (!sh) return null;
  collectSheet(); if (!sh.draft.name) { toast('Сначала введите название игры'); return null; }
  const ok = await persistDraft(sh); sh.dirty = !ok;
  return ok && gameById(sh.draft.id) ? sh.draft.id : null;
}
async function addShotFiles(files) {
  const gid = await sheetGameId(); if (!gid) return;
  const list = await getShots(gid); let n = 0;
  for (const f of files) { try { list.push({ n: uid(), src: '', blob: await toThumb(f, SHOT_W) }); n++; } catch (e) { /* не картинка */ } }
  if (n) await putShots(gid, list);
  toast(n ? 'Скриншотов добавлено: ' + n : 'Не удалось прочитать картинку'); drawShots();
}
async function saveAllShots() {
  const gid = await sheetGameId(); if (!gid) return;
  const have = new Set((await getShots(gid)).map(x => x.src)), todo = S.igdbShots.filter(u => !have.has(u)); let n = 0, fail = 0;
  for (const u of todo) {
    toast('Сохраняю скриншоты: ' + (n + fail + 1) + ' из ' + todo.length);
    try { await saveIgdbShot(gid, u); n++; } catch (e) { if (++fail >= 2) break; }
  }
  toast(fail ? 'Сохранено: ' + n + '. Не удалось скачать остальные' : 'Сохранено скриншотов: ' + n); drawShots();
}
// нажатие на платформу делает её основной (повторное снимает), фильтра по тапу нет
const fmtSize = b => b >= 1048576 ? (b / 1048576).toFixed(1) + ' МБ' : Math.max(1, Math.round(b / 1024)) + ' КБ';
async function shotStats() {
  const out = [];
  for (const r of await DB.all('shots')) { const g = gameById(r.id); if (!g || !(r.list || []).length) continue; out.push({ id: r.id, name: g.name, n: r.list.length, size: r.list.reduce((a, x) => a + (x.blob ? x.blob.size : 0), 0) }); }
  return out.sort((a, b) => b.size - a.size);
}
async function fillShotStats() {
  const el = $('#shStats'); if (!el) return;
  try { const st = await shotStats(); el.innerHTML = st.length ? 'Игр со скриншотами: <b>' + st.length + '</b>, скриншотов: <b>' + st.reduce((a, x) => a + x.n, 0) + '</b>, размер: <b>' + fmtSize(st.reduce((a, x) => a + x.size, 0)) + '</b>' : 'Скриншотов в базе нет'; } catch (e) { el.textContent = 'нет данных'; }
}
async function delShots(ids) {
  for (const id of ids) { await DB.del('shots', id); const g = gameById(id); if (g) { g.shotCount = 0; await saveGame(g); } }
  toast('Скриншоты удалены у игр: ' + ids.length);
}
function drawShPlats(list) {
  const el = $('#shPlats'); if (!el) return; const d = S.sheet ? S.sheet.draft : {}; setTimeout(drawShHead, 0);
  if (d.mainPlatform && !list.includes(d.mainPlatform)) d.mainPlatform = '';
  const mp = d.mainPlatform || (list.length === 1 ? list[0] : '');
  el.innerHTML = list.length ? list.map(x => '<button class="p' + (mp === x ? ' on' : '') + '" data-act="shPlat" data-v="' + esc(x) + '">' + (mp === x ? '✓ ' : '') + esc(shortPlat(x)) + '</button>').join('') + '<span class="sub" style="align-self:center">' + (list.length === 1 ? 'платформа одна, она и основная' : d.mainPlatform ? 'основная платформа, нажмите ещё раз, чтобы снять' : 'нажмите на платформу, чтобы сделать её основной') + '</span>' : '<span class="sub">Платформы не указаны</span>';
}
async function drawShots() {
  const sh = S.sheet; if (!sh || !$('#shotsSaved')) return;
  const gid = sh.draft.id, list = await getShots(gid);
  if (!S.sheet || S.sheet.draft.id !== gid || !$('#shotsSaved')) return;
  S.shotUrls.forEach(u => URL.revokeObjectURL(u)); S.shotUrls = list.map(x => URL.createObjectURL(x.blob));
  $('#shotsSaved').innerHTML = list.length ? '<div class="sub">Сохранено в базе: ' + list.length + '</div><div class="shotg">' + list.map((x, i) => '<div class="sh"><img src="' + S.shotUrls[i] + '" data-act="shot" data-g="local" data-i="' + i + '" data-full="' + S.shotUrls[i] + '" alt=""><button class="sx" data-act="shotDel" data-i="' + i + '" aria-label="Удалить скриншот">✕</button></div>').join('') + '</div>' : '';
  const have = new Set(list.map(x => x.src).filter(Boolean));
  $$('[data-act="shotSave"]').forEach(b => { const on = have.has(S.igdbShots[+b.dataset.i]); b.classList.toggle('saved', on); b.textContent = on ? '✓ Сохранено' : '＋ Сохранить'; });
}
function drawShGenres(list) {
  const el = $('#shGenres'); if (!el) return;
  el.innerHTML = list.length ? list.map(x => '<button class="p" data-act="gotoGenre" data-v="' + esc(x) + '">' + esc(x) + '</button>').join('') : '<span class="sub">Жанры не указаны</span>';
}

/* ====================== IGDB ====================== */
const monthKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
function usageCount(k) { const u = S.set.usage; return u.m === monthKey() ? (u[k] || 0) : 0; }
function bump(k) {
  const u = S.set.usage, m = monthKey();
  if (u.m !== m) { u.m = m; u.igdb = 0; u.sgdb = 0; u.hltb = 0; u.w = 0; u.igdb = 0; }
  u[k] = (u[k] || 0) + 1;
  clearTimeout(bump.t); bump.t = setTimeout(saveSet, 1500);
}
function setBlock(type, text, src) { S.block = { type, text, src }; }
const blockFor = src => S.block && (!S.block.src || S.block.src === src) ? S.block : null;
function blockBanner(full, src) {
  if (!S.block || (src && S.block.src && S.block.src !== src)) return '';
  return '<div class="banner red">⚠ ' + esc(S.block.text) + '<div class="toolbar" style="margin:8px 0 0">' + (full ? '<button class="btn" data-act="tab" data-tab="settings">Открыть настройки</button>' : '') + '<button class="btn" data-act="unblock">Повторить</button></div></div>';
}
function usageHtml() {
  return '<p class="sub">Запросов к IGDB в этом месяце: <b>' + usageCount('igdb') + '</b>. У IGDB лимит 4 запроса в секунду, приложение выдерживает паузы само. Счётчик ведётся на этом устройстве, на телефоне и на компьютере он отдельный.</p>';
}
// RAWG: остаток запросов и дата обновления вводятся вручную (как на сайте RAWG); при наступлении даты +30 дней и остаток снова 20 000
const RAWG_LIMIT = 20000;
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function rawgQuotaTick() {
  const q = S.set.rawgQuota, now = todayStr(); let n = 0, ch = false;
  if (!q.renew) { q.renew = addDays(now, 30); ch = true; }
  while (q.renew <= now && n++ < 120) { q.renew = addDays(q.renew, 30); q.left = RAWG_LIMIT; S.set.rawgWarn = 0; ch = true; }
  if (ch) saveSet();
}
function rawgSpend() {
  rawgQuotaTick(); const q = S.set.rawgQuota; q.left = Math.max(0, (q.left || 0) - 1);
  const lvl = q.left <= RAWG_LIMIT * 0.025 ? 2 : q.left <= RAWG_LIMIT * 0.1 ? 1 : 0;
  if (lvl > (S.set.rawgWarn || 0)) { S.set.rawgWarn = lvl; toast('Осталось запросов RAWG: ' + q.left); }
  clearTimeout(bump.t); bump.t = setTimeout(saveSet, 1500);
}
function rawgUsageHtml() {
  rawgQuotaTick(); const q = S.set.rawgQuota, used = Math.max(0, RAWG_LIMIT - q.left), pct = Math.min(100, Math.round(used * 100 / RAWG_LIMIT));
  return '<div class="two"><label class="field"><span>Осталось запросов за период</span><input id="rqLeft" type="number" min="0" inputmode="numeric" value="' + q.left + '"></label><label class="field"><span>Лимит обновится</span><input id="rqRenew" type="date" value="' + esc(q.renew) + '"></label></div>'
    + '<div class="toolbar"><button class="btn" data-act="saveQuota">Сохранить остаток и дату</button></div><div class="pb"><i style="width:' + pct + '%;background:' + (pct >= 90 ? '#e5484d' : 'var(--green)') + '"></i></div>'
    + '<p class="sub">Как на сайте RAWG: остаток и дата обновления. Приложение вычитает каждый запрос, а когда дата наступает, прибавляет 30 дней и возвращает остаток к ' + RAWG_LIMIT + '. Значения с сайта можно вписать для точного учёта.</p>';
}
async function rawg(path, params = {}) {
  if (!S.set.rawgKey) throw new Error('Укажите ключ RAWG в настройках');
  const bl = blockFor('rawg'); if (bl) throw new Error(bl.text);
  const u = new URL('https://api.rawg.io/api' + path); u.searchParams.set('key', S.set.rawgKey);
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v); });
  let r, attempt = 0;
  for (;;) {
    try { r = await fetch(u.toString()); } catch (e) { throw new Error('Нет связи с RAWG (проверьте интернет)'); }
    rawgSpend(); // считаем только запросы, дошедшие до сервера
    if (r.status === 429 && attempt++ < 1) {
      let t = ''; try { t = await r.clone().text(); } catch (e) { /* без текста */ }
      if (!/month|quota|exceed/i.test(t)) { await new Promise(x => setTimeout(x, 1800)); continue; }
    }
    break;
  }
  if (!r.ok) {
    let txt = ''; try { txt = await r.text(); } catch (e) { /* без текста */ }
    if (r.status === 429 || /limit|quota|exceed|throttl/i.test(txt)) setBlock('limit', 'Лимит запросов RAWG исчерпан. Запросы остановлены; нажмите «Повторить», когда лимит обновится.', 'rawg');
    else if (r.status === 401 || r.status === 403 || (r.status === 400 && /key/i.test(txt))) setBlock('key', 'Ключ RAWG не принят. Проверьте ключ в настройках: поиск и загрузка из RAWG заблокированы.', 'rawg');
    else throw new Error('RAWG: ошибка ' + r.status);
    throw new Error(S.block.text);
  }
  return r.json();
}
// источники данных: IGDB и RAWG; идентификатор результата rid = 'igdb:123' или 'rawg:456'
const PROV = {
  igdb: { name: 'IGDB', color: '#a56bff', ready: () => hasKeys() && !blockFor('igdb'), noKeys: 'Для поиска нужны бесплатные ключи IGDB (Client ID и Client Secret).<br>Получить: dev.twitch.tv/console/apps' },
  rawg: { name: 'RAWG', color: '#3fb7f0', ready: () => !!S.set.rawgKey && !blockFor('rawg'), noKeys: 'Для поиска нужен бесплатный ключ RAWG.<br>Получить: rawg.io/apidocs' }
};
const ridOf = (src, id) => src + ':' + id;
const parseRid = rid => { const a = String(rid).split(':'); return { src: a[0] === 'rawg' ? 'rawg' : 'igdb', id: +a[1] }; };
const gameByRid = rid => { const { src, id } = parseRid(rid); return S.games.find(g => g[src + 'Id'] === id); };
const srcsOf = g => ['igdb', 'rawg'].filter(k => g[k + 'Id']);
const otherSrc = src => src === 'igdb' ? 'rawg' : 'igdb';
const hasKeys = () => !!(S.set.igdbProxy || (S.set.igdbId && S.set.igdbSecret));
const IGDB_API = 'https://api.igdb.com/v4', IGDB_IMG = 'https://images.igdb.com/igdb/image/upload/';
let igdbQ = Promise.resolve();
const igdbGate = () => { const prev = igdbQ; igdbQ = prev.then(() => new Promise(r => setTimeout(r, window.__gateMs !== undefined ? window.__gateMs : 270))); return prev; }; // не чаще 4 запросов в секунду
async function igdbToken() {
  if (S.set.igdbProxy) return ''; // через свой прокси: ключи и токен хранятся там
  if (S.set.igdbToken && S.set.igdbExp > Date.now() + 6e4) return S.set.igdbToken;
  let r; try { r = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + encodeURIComponent(S.set.igdbId) + '&client_secret=' + encodeURIComponent(S.set.igdbSecret) + '&grant_type=client_credentials', { method: 'POST' }); } catch (e) { throw new Error('Нет связи с Twitch (проверьте интернет; в браузере запрос может блокироваться, используйте приложение Android)'); }
  if (!r.ok) { setBlock('key', 'Ключи IGDB не приняты. Проверьте Client ID и Client Secret в настройках: поиск и загрузка из IGDB заблокированы.', 'igdb'); throw new Error(S.block.text); }
  const j = await r.json(); S.set.igdbToken = j.access_token; S.set.igdbExp = Date.now() + (j.expires_in || 3600) * 1000; saveSet(); return S.set.igdbToken;
}
// запрос к IGDB: endpoint вида '/games', body на языке запросов IGDB (Apicalypse)
async function igdb(endpoint, body) {
  if (!hasKeys()) throw new Error('Укажите Client ID и Client Secret IGDB в настройках');
  const bl = blockFor('igdb'); if (bl) throw new Error(bl.text);
  let r, attempt = 0, fresh = false;
  for (;;) {
    const tk = await igdbToken(); await igdbGate();
    try { r = await fetch((S.set.igdbProxy ? S.set.igdbProxy.replace(/\/+$/, '') : IGDB_API) + endpoint, { method: 'POST', headers: S.set.igdbProxy ? { 'Content-Type': 'text/plain' } : { 'Client-ID': S.set.igdbId, Authorization: 'Bearer ' + tk, 'Content-Type': 'text/plain', Accept: 'application/json' }, body }); } catch (e) { throw new Error('Нет связи с IGDB (проверьте интернет; в браузере запросы могут блокироваться, используйте приложение Android)'); }
    bump('igdb'); // считаем только запросы, дошедшие до сервера
    if (r.status === 401 && !fresh) { fresh = true; S.set.igdbToken = ''; continue; } // токен мог устареть
    if (r.status === 429 && attempt++ < 2) { await new Promise(x => setTimeout(x, 1500)); continue; }
    break;
  }
  if (!r.ok) {
    if (r.status === 429) setBlock('limit', 'IGDB отклоняет запросы из-за частоты. Подождите немного и нажмите «Повторить».', 'igdb');
    else if (r.status === 401 || r.status === 403) setBlock('key', 'Ключи IGDB не приняты. Проверьте Client ID и Client Secret в настройках: поиск и загрузка из IGDB заблокированы.', 'igdb');
    else throw new Error('IGDB: ошибка ' + r.status);
    throw new Error(S.block.text);
  }
  return r.json();
}
const igdbImg = (id, size) => id ? IGDB_IMG + 't_' + size + '/' + id + '.jpg' : '';
const sizeUrl = (u, size) => String(u).replace(/\/t_[a-z0-9_]+\//, '/t_' + size + '/');
const coverOf = (x, size) => x && x.cover && x.cover.image_id ? igdbImg(x.cover.image_id, size) : '';
const yearOf = x => x.first_release_date ? new Date(x.first_release_date * 1000).getUTCFullYear() : 0;
const hoursOf = t => { const sec = t && (t.normally || t.hastily || t.completely); return sec ? Math.max(1, Math.round(sec / 3600)) : 0; };
// названия платформ IGDB приводим к привычным (как в каталоге и в shortPlat)
const PLAT_FIX = { 'PC (Microsoft Windows)': 'PC', 'Mac': 'macOS', 'Xbox Series X|S': 'Xbox Series S/X', 'PlayStation Vita': 'PS Vita', 'PlayStation Portable': 'PSP', 'Super Nintendo Entertainment System': 'SNES', 'Nintendo Entertainment System': 'NES', 'Sega Mega Drive/Genesis': 'SEGA Genesis' };
const platName = n => PLAT_FIX[n] || n;
const GAME_TYPES = 'game_type = (0,4,6,8,9,10,11)'; // игра, самостоятельное дополнение, эпизод, ремейк, ремастер, расширенная версия, порт (без DLC, патчей, паков и модов)
const IGDB_FIELDS = 'name,first_release_date,total_rating,cover.image_id,genres.name,platforms.name';
const IGDB_DETAIL = IGDB_FIELDS + ',summary,url,collections.id,collections.name';
const MAIN_PLATFORMS = '6,14,3,7,8,9,48,167,38,46,11,12,49,169,130,508,5,41,37,20,24,22,33,18,19,4,23,29,32,34,39';
// время прохождения в IGDB лежит в отдельном разделе: добавляем его к списку игр одним запросом
async function attachTimes(list) {
  if (!list.length) return list;
  try {
    const tt = await igdb('/game_time_to_beats', 'fields game_id,hastily,normally,completely; where game_id = (' + list.map(x => x.id).join(',') + '); limit ' + list.length + ';');
    const m = new Map(tt.map(t => [t.game_id, t])); list.forEach(x => { x.time = hoursOf(m.get(x.id)); });
  } catch (e) { if (S.block) throw e; }
  return list;
}
const igdbQuote = q => String(q).replace(/["\\]/g, ' ').trim();
async function igdbPage(q, f, page) {
  const w = [GAME_TYPES], n = S.set.pageSize || 40;
  if (f.genre) w.push('genres = (' + (+f.genre) + ')');
  if (f.platform) w.push('platforms = (' + (+f.platform) + ')');
  if (f.year) w.push('first_release_date >= ' + Date.UTC(+f.year, 0, 1) / 1000 + ' & first_release_date < ' + Date.UTC(+f.year + 1, 0, 1) / 1000);
  const where = 'where ' + w.join(' & ') + ';', srch = q ? 'search "' + igdbQuote(q) + '"; ' : '';
  const list = await igdb('/games', srch + 'fields ' + IGDB_FIELDS + '; ' + where + (q ? '' : ' sort total_rating_count desc;') + ' limit ' + n + '; offset ' + page * n + ';');
  let count = 0;
  if (page === 0) { try { count = (await igdb('/games/count', srch + where)).count || 0; } catch (e) { if (S.block) throw e; } }
  list.forEach(x => { x._src = 'igdb'; }); await attachTimes(list);
  return { results: list, count, next: list.length === n };
}
const mapIgdb = x => ({
  src: 'igdb', rid: ridOf('igdb', x.id), name: x.name, year: yearOf(x), rating: x.total_rating ? Math.round(x.total_rating) / 10 : 0,
  time: x.time || 0, cover: coverOf(x, 'cover_big'), platforms: (x.platforms || []).map(p => platName(p.name)), genres: (x.genres || []).map(g => g.name)
});
const mapRawg = x => ({
  src: 'rawg', rid: ridOf('rawg', x.id), name: x.name, year: x.released ? +x.released.slice(0, 4) : 0, rating: x.rating ? Math.round(x.rating * 20) / 10 : 0,
  time: x.playtime || 0, cover: x.background_image || '', platforms: (x.platforms || []).map(p => p.platform.name), genres: (x.genres || []).map(g => g.name)
});
const mapItem = x => x._src === 'rawg' ? mapRawg(x) : mapIgdb(x);
// страница результатов RAWG (page_size у RAWG не больше 40: большие порции собираются из нескольких запросов)
async function rawgPage(q, f, page) {
  const n = S.set.pageSize || 40, per = Math.ceil(n / 40), size = Math.ceil(n / per); let results = [], count = 0, next = false;
  for (let j = 0; j < per; j++) {
    const d = await rawg('/games', { search: q, page: page * per + j + 1, page_size: size, genres: f.genre, platforms: f.platform, dates: f.year ? f.year + '-01-01,' + f.year + '-12-31' : '', ordering: q ? '' : '-added' });
    results = results.concat(d.results || []); count = d.count || count; next = !!d.next; if (!d.next) break;
  }
  results.forEach(x => { x._src = 'rawg'; });
  return { results, count, next };
}
const detCache = new Map();
async function fetchDetails(id) {
  const c = detCache.get(id); if (c && Date.now() - c.t < 6e5) return c.v;
  const v = await fetchDetailsRaw(id); detCache.set(id, { t: Date.now(), v }); return v;
}
async function fetchDetailsRaw(rid) { const { src, id } = parseRid(rid); return src === 'rawg' ? fetchDetailsRawg(id) : fetchDetailsIgdb(id); }
async function fetchDetailsRawg(id) {
  const [d, ser] = await Promise.all([rawg('/games/' + id), rawg('/games/' + id + '/game-series', { page_size: 40 }).catch(e => { if (blockFor('rawg')) throw e; return null; })]);
  d._src = 'rawg'; const list = ser && ser.results ? ser.results : [];
  return { d, series: list.length ? seriesName([d.name].concat(list.map(x => x.name))) : '', seriesCount: list.length };
}
async function fetchDetailsIgdb(id) {
  const [g, tt] = await Promise.all([igdb('/games', 'fields ' + IGDB_DETAIL + '; where id = ' + id + ';'), igdb('/game_time_to_beats', 'fields game_id,hastily,normally,completely; where game_id = ' + id + ';').catch(e => { if (S.block) throw e; return []; })]);
  const d = g[0]; if (!d) throw new Error('Игра не найдена в IGDB'); d._src = 'igdb';
  d.time = hoursOf(tt[0]);
  const col = (d.collections || [])[0]; let count = 0;
  if (col) { try { count = Math.min((await igdb('/games/count', 'where collections = (' + col.id + ') & id != ' + id + ' & ' + GAME_TYPES + ';')).count || 0, 40); } catch (e) { if (S.block) throw e; } }
  return { d, series: col ? col.name : '', seriesCount: count };
}
function gameFromIgdb(d, series) {
  return {
    id: uid(), igdbId: d.id, name: d.name, year: yearOf(d), rating: d.total_rating ? Math.round(d.total_rating) / 10 : 0,
    time: d.time || 0, description: d.summary || '', genres: (d.genres || []).map(x => x.name), igdbUrl: d.url || '',
    platforms: (d.platforms || []).map(x => platName(x.name)), series, coverUrl: coverOf(d, 'cover_big_2x'), coverSrc: 'igdb', hasCover: false,
    collections: [], props: {}, done: false, doneDate: '', shotCount: 0, mainPlatform: '', added: Date.now(), updated: Date.now()
  };
}
function gameFromRawg(d, series) {
  return {
    id: uid(), rawgId: d.id, name: d.name, year: d.released ? +d.released.slice(0, 4) : 0, rating: d.rating ? Math.round(d.rating * 20) / 10 : 0,
    time: d.playtime || 0, description: d.description_raw || '', genres: (d.genres || []).map(x => x.name), rawgUrl: d.slug ? 'https://rawg.io/games/' + d.slug : '',
    platforms: (d.platforms || []).map(x => x.platform.name), series, coverUrl: d.background_image || '', coverSrc: 'rawg', hasCover: false,
    collections: [], props: {}, done: false, doneDate: '', shotCount: 0, mainPlatform: '', added: Date.now(), updated: Date.now()
  };
}
const gameFromDetails = (d, series) => d._src === 'rawg' ? gameFromRawg(d, series) : gameFromIgdb(d, series);
const yearOfD = d => d._src === 'rawg' ? (d.released ? +d.released.slice(0, 4) : 0) : yearOf(d);
const adding = new Set();
const quickBusy = new Set();
const askChoose = o => (window.__chooseHook || choose)(o), askPrompt = (...a) => (window.__promptHook || promptBox)(...a); // подмена нужна только тестам
// Основная платформа обязательна: заданную (например, списком разбора) берём как есть, одна платформа выбирается сама,
// при нескольких спрашиваем, если платформ нет совсем, просим ввести. null = пользователь отказался
async function askMainPlatform(list, name) {
  const r = await askChoose({ title: name ? 'Платформа для «' + name + '»' : 'Выбрать основную платформу', items: list.map(x => ({ id: x, label: shortPlat(x), sub: shortPlat(x) !== x ? x : '', ico: '🎮' })) });
  return r === null ? null : r;
}
async function requirePlatform(platforms, preset, name) {
  if (preset) return preset;
  if (platforms.length === 1) return platforms[0];
  if (platforms.length > 1) return askMainPlatform(platforms, name);
  const v = await askPrompt(name ? 'На какой платформе у вас «' + name + '»?' : 'На какой платформе у вас игра?', '', 'например: PC'); return v ? v.trim() : null;
}
async function addFromIgdb(rid, collIds = [], opts = {}) {
  const doneFlag = collIds.includes(DONE_ID); collIds = collIds.filter(id => id !== DONE_ID);
  const { src } = parseRid(rid), idk = src + 'Id', urlk = src + 'Url';
  let g = gameByRid(rid);
  if (!g) {
    if (adding.has(rid)) return null;
    adding.add(rid);
    try {
      const { d, series } = await fetchDetails(rid);
      const n0 = gameFromDetails(d, series), year0 = yearOfD(d);
      const manual = S.games.find(x => !x[idk] && normName(x.name) === normName(d.name) && (!x.year || !year0 || x.year === year0));
      if (manual && await confirmBox('Игра «' + manual.name + '» уже есть в каталоге' + (srcsOf(manual).length ? ' (из ' + PROV[srcsOf(manual)[0]].name + ')' : ' (добавлена вручную)') + '. Объединить с данными ' + PROV[src].name + '?', 'Объединить')) {
        g = manual; g[idk] = d.id; if (n0[urlk]) g[urlk] = n0[urlk];
        ['year', 'rating', 'time', 'description', 'coverUrl'].forEach(k => { if (!g[k] && n0[k]) g[k] = n0[k]; });
        if (!g.genres.length) g.genres = n0.genres; if (!g.platforms.length) g.platforms = n0.platforms; if (!g.series) g.series = canonSeries(n0.series);
        if (!g.hasCover) { g.coverSrc = src; await cacheCover(g); }
        if (!mainOf(g)) { const mp = await requirePlatform(g.platforms, opts.platform, g.name); if (mp) { g.mainPlatform = mp; if (!g.platforms.includes(mp)) g.platforms.push(mp); } }
        await saveGame(g);
      } else {
        const mp = await requirePlatform(n0.platforms, opts.platform, n0.name); if (mp === null) { toast('Добавление отменено: нужна основная платформа'); return false; }
        if (!n0.platforms.includes(mp)) n0.platforms.push(mp);
        g = n0; g.mainPlatform = mp; g.series = canonSeries(g.series); S.games.push(g); await DB.put('games', g); await cacheCover(g);
        if (!g.coverUrl && S.set.sgdbKey && S.set.sgdbOn) { try { await sgdbAuto(g); } catch (e) { /* останется без обложки */ } }
      }
    } finally { adding.delete(rid); }
  }
  collIds.forEach(id => { if (!g.collections.includes(id)) g.collections.push(id); });
  if (doneFlag && !g.done) { g.done = true; g.doneDate = g.doneDate || todayStr(); }
  await saveGame(g);
  return g;
}
async function loadLists(src) {
  src = src || S.search.src;
  const c = S.lists[src]; if (c && c.genres && c.platforms && Date.now() - (c.t || 0) < 30 * 864e5) return c;
  let v;
  if (src === 'rawg') {
    const [g, p] = await Promise.all([rawg('/genres'), rawg('/platforms/lists/parents')]);
    v = { t: Date.now(), genres: g.results.map(x => ({ id: x.id, name: x.name })), platforms: [].concat(...p.results.map(x => (x.platforms || []).map(y => ({ id: y.id, name: y.name })))) };
  } else {
    const [g, p] = await Promise.all([igdb('/genres', 'fields id,name; sort name asc; limit 100;'), igdb('/platforms', 'fields id,name; where id = (' + MAIN_PLATFORMS + '); sort name asc; limit 100;')]);
    v = { t: Date.now(), genres: g.map(x => ({ id: x.id, name: x.name })), platforms: p.map(x => ({ id: x.id, name: platName(x.name) })) };
  }
  S.lists[src] = v; await DB.put('settings', { key: 'lists', value: S.lists });
  return v;
}

/* ====================== SteamGridDB ====================== */
const SGDB = 'https://www.steamgriddb.com/api/v2';
const sgdbCache = new Map(); let sgdbLast = 0; // кэш на 10 минут: одну игру не запрашиваем повторно
async function sgdb(path) {
  if (!S.set.sgdbKey) throw new Error('Укажите ключ SteamGridDB в настройках');
  const hit = sgdbCache.get(path); if (hit && Date.now() - hit.t < 6e5) return hit.v;
  const wait = (S.sgdbUntil || 0) - Date.now(); if (wait > 0) throw new Error('SteamGridDB просит подождать ' + Math.ceil(wait / 1000) + ' с (лимит запросов)');
  const gap = sgdbLast + (window.__gateMs !== undefined ? window.__gateMs : 550) - Date.now(); if (gap > 0) await new Promise(r => setTimeout(r, gap)); // не больше 2 запросов в секунду (лимит 120 в минуту)
  sgdbLast = Date.now();
  let r; try { r = await fetch(SGDB + path, { headers: { Authorization: 'Bearer ' + S.set.sgdbKey } }); } catch (e) { throw new Error('Нет связи с SteamGridDB (в браузере запросы могут блокироваться, используйте приложение)'); }
  bump('sgdb');
  if (r.status === 429) { const ra = +(r.headers && r.headers.get && r.headers.get('Retry-After')) || 60; S.sgdbUntil = Date.now() + ra * 1000; throw new Error('SteamGridDB: лимит запросов (120 в минуту), подождите ' + ra + ' с'); }
  if (r.status === 401 || r.status === 403) throw new Error('Ключ SteamGridDB не принят');
  if (!r.ok) throw new Error('SteamGridDB: ошибка ' + r.status);
  const j = await r.json(); if (j.success === false) throw new Error('SteamGridDB: ' + ((j.errors || [])[0] || 'ошибка'));
  const v = j.data || []; sgdbCache.set(path, { t: Date.now(), v }); return v;
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
      + (grids.length ? '<div class="grid" style="--cols:3">' + grids.slice(0, 60).map((x, i) => '<div class="card" data-act="sgdbUse" data-i="' + i + '"><div class="cv" style="background-image:url(\'' + bgu((x.thumb || x.url)) + '\')"></div></div>').join('') + '</div>' : '<p class="hint">Подходящих обложек нет</p>')
      + '<button class="btn" style="width:100%;margin-top:12px" data-act="closeSheet">Закрыть</button>');
  } catch (e) { toast(e.message); }
}

/* ====================== HowLongToBeat (только Android) ====================== */
const HLTB = 'https://howlongtobeat.com';
let hltbLast = 0;
async function hltbFetch(url, opts) {
  const wait = hltbLast + 1200 - Date.now(); if (wait > 0) await new Promise(r => setTimeout(r, wait));
  hltbLast = Date.now(); const r = await fetch(url, opts); bump('hltb'); return r;
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
  const keys = Object.keys(S.set.hltbCache); if (keys.length > 200) { keys.sort((a, b) => S.set.hltbCache[a].t - S.set.hltbCache[b].t); delete S.set.hltbCache[keys[0]]; }
  S.set.hltbCache[key] = { t: Date.now(), list }; saveSet();
  return list;
}

/* ====================== Окна ====================== */
let toastT;
function toast(t, label, fn) {
  const e = $('#toast'); e.textContent = t; e.classList.add('show');
  if (label) { const b = document.createElement('button'); b.className = 'tbtn'; b.textContent = label; b.onclick = () => { e.classList.remove('show'); e.classList.remove('act'); fn(); }; e.appendChild(b); e.classList.add('act'); } else e.classList.remove('act');
  clearTimeout(toastT); toastT = setTimeout(() => { e.classList.remove('show'); e.classList.remove('act'); }, label ? 7000 : 2600);
}
let sheetEl = null, modalEl = null, modalCancel = null;
let sheetKey = null;
function openSheet(html) {
  const key = sheetKey; sheetKey = null;
  if (key && sheetEl && sheetEl._key === key) { const sh = sheetEl.querySelector('.sheet'); sh.innerHTML = '<div class="grab"></div>' + html; return sh; } // то же окно обновляем на месте, без повторной анимации
  if (sheetEl) { sheetEl.remove(); sheetEl = null; }
  sheetEl = document.createElement('div');
  sheetEl.innerHTML = '<div class="backdrop" data-act="closeSheet"></div><div class="sheet"><div class="grab"></div>' + html + '</div>';
  sheetEl._key = key; $('#layer').appendChild(sheetEl);
  return sheetEl.querySelector('.sheet');
}
// перерисовка с сохранением места прокрутки (список остаётся на той же игре)
function renderKeep() {
  const els = () => [$('#libBody'), $('#srBody'), $('#view .scrl'), $('#view')], sc = els().map(e => e ? e.scrollTop : 0);
  render(); els().forEach((e, i) => { if (e) e.scrollTop = sc[i]; });
}
function closeSheet() {
  if (S.sheet && S.sheet.dirty && sheetEl) { collectSheet(); const sh = S.sheet; sh.dirty = false; persistDraft(sh).then(ok => { if (ok) renderKeep(); else if (!sh.draft.name) toast('Игра не сохранена: не заполнено название'); }); }
  if (sheetEl) { sheetEl.remove(); sheetEl = null; } S.sheet = null;
  S.shotUrls.forEach(u => URL.revokeObjectURL(u)); S.shotUrls = [];
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
function choose({ title, items, multi = false, selected = [], ok = 'Готово', search = false }) {
  return new Promise(res => {
    const sel = new Set(selected.map(String)); const m = openModal();
    m.innerHTML = '<h4>' + esc(title) + '</h4>' + (search ? '<label class="field"><input id="chq" placeholder="Поиск…" autocomplete="off"></label>' : '') + '<div id="chl"></div>'
      + '<div class="acts"><span data-x="cancel">Отмена</span>' + (multi ? '<span data-x="ok">' + ok + '</span>' : '') + '</div>';
    const draw = () => {
      const q = search ? normName($('#chq', m).value) : '';
      $('#chl', m).innerHTML = items.filter(it => !q || it.pin || normName(it.label).includes(q)).map(it => '<div class="opt' + (sel.has(String(it.id)) ? ' on' : '') + (it.accent ? ' accent' : '') + '" data-id="' + esc(it.id) + '">'
        + (multi ? '<span class="bx">' + (sel.has(String(it.id)) ? '✓' : '') + '</span>' : '') + (it.ico ? '<span class="oi">' + it.ico + '</span>' : '') + '<div>' + esc(it.label) + (it.sub ? '<div class="sub">' + esc(it.sub) + '</div>' : '') + '</div></div>').join('') || '<p class="sub">Ничего не найдено</p>';
    };
    draw();
    if (search) setTimeout(() => { const i = $('#chq', m); if (i && i.focus) i.focus(); }, 60);
    modalCancel = () => { closeModal(); res(null); };
    m.oninput = e => { if (e.target.id === 'chq') draw(); };
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
  const items = sortedColls().map(c => ({ id: c.id, label: c.name, sub: gWord(gamesIn(c.id).length) }));
  if (allowNew) items.push({ id: '__new', label: '＋ Новая коллекция…' });
  if (!items.length) { toast('Коллекций пока нет'); return null; }
  const r = await choose({ title, items, multi: true, selected, search: items.length > 12 });
  if (!r) return null;
  const ids = r.filter(x => x !== '__new');
  if (r.includes('__new')) { const c = await createCollection(); if (c) ids.push(c.id); }
  return ids;
}
async function createCollection() {
  const name = await promptBox('Название коллекции'); if (!name) return null;
  if (RESERVED.includes(normName(name))) { toast('«Все игры» и «Завершено» есть всегда, выберите другое название'); return null; }
  const ex = S.collections.find(c => c.name.toLowerCase() === name.toLowerCase()); if (ex) return ex;
  const c = { id: uid(), name, created: Date.now(), order: S.collections.reduce((mx, x) => Math.max(mx, x.order != null ? x.order : -1), -1) + 1 }; S.collections.push(c); await DB.put('collections', c); return c;
}

/* ====================== Каталог ====================== */
function meta(o, noPlat) {
  const p = [];
  if (o.rating) p.push('<span class="st">★' + o.rating + '</span>');
  const mp = mainOf(o), pl = mp ? shortPlat(mp) : (o.platforms || []).slice(0, 2).map(shortPlat).join(', '); if (pl && !noPlat) p.push(esc(pl));
  if (o.year) p.push(o.year);
  return p.join(' · ');
}
function cardHtml(g) {
  const src = coverSrc(g), sel = S.sel.has(g.id), mp = mainOf(g);
  const strip = (mp || g.time || g.done) ? '<div class="strip"><span class="sp">' + esc(mp ? shortPlat(mp) : '') + '</span><span class="sr">' + (g.time ? '⏱ ' + g.time + 'ч' : '') + (g.done ? ' <i class="ck">✓</i>' : '') + '</span></div>' : '';
  return '<div class="card' + (sel ? ' sel' : '') + (g.done ? ' isdone' : '') + '" data-gid="' + g.id + '" data-act="openGame"><div class="cv' + (src ? '' : ' nocover') + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '>'
    + (S.selMode ? '<span class="chk">' + (sel ? '✓' : '') + '</span>' : '') + strip + '</div><div class="t">' + esc(g.name) + '</div><div class="m">' + meta(g, true) + '</div></div>';
}
// текст из другого приложения («Поделиться»): в поиск игры или в список разбора
async function handleShared(text) {
  text = String(text || '').trim(); if (!text) return;
  const lines = text.split(/\r?\n/).filter(l => l.trim()), first = parseLine(lines[0]);
  const r = await askChoose({ title: 'Принят текст', items: [{ id: 'search', label: 'Найти игру в поиске', sub: first ? first.text : lines[0].slice(0, 60), ico: '🔍' }, { id: 'inbox', label: 'Добавить в разбор', sub: 'строк: ' + lines.length, ico: '📋' }] });
  if (r === 'search') { S.pending = null; Object.assign(S.search, { q: first ? first.text : lines[0], src: S.set.mainSrc }); Object.assign(S.search.f, { genre: '', genreName: '', platform: '', platformName: '' }); S.tab = 'search'; render(); runSearch(true); }
  else if (r === 'inbox') {
    const lid = await askChoose({ title: 'В какой список', items: S.inbox.lists.map(l => ({ id: l.id, label: l.name, sub: 'строк: ' + itemsOf(l.id).length })).concat([{ id: '__new', label: '＋ Новый список…' }]) }); if (lid === null) return;
    let id = lid;
    if (lid === '__new') { const name = await askPrompt('Название списка', '', 'например: Из чата'); if (!name) return; const l = { id: uid(), name, created: Date.now() }; S.inbox.lists.push(l); await DB.put('inboxLists', l); id = l.id; }
    const n = await addParsed(id, parseInboxText(text)); toast('Добавлено строк: ' + n); S.inboxList = id; S.tab = 'inbox'; render();
  }
}
const checkShared = () => { try { const A = window.AndroidShare, t = A && A.take ? A.take() : ''; if (t) handleShared(t); } catch (e) { /* общего текста нет */ } };
function gameLine(g) { return g.name + ' (' + [g.year || '', (g.platforms || []).join(', ')].filter(Boolean).join(' | ') + ')' + (g.time ? ' – ' + g.time + ' ч' : ''); }
function tagsHtml(g) {
  const names = (g.collections || []).map(id => collById(id)).filter(Boolean);
  return names.slice(0, 2).map(c => '<span class="tag"' + (okColor(c.color) ? ' style="color:' + okColor(c.color) + ';border-color:' + okColor(c.color) + '"' : '') + '>' + esc(c.name) + '</span>').join('') + (names.length > 2 ? '<span class="tag m2" data-act="gameColls" data-gid="' + g.id + '">+' + (names.length - 2) + '</span>' : '');
}
function listHtml(list) {
  const c = S.set.cols, f = S.set.f, pin = !!S.set.pin, pcols = S.set.propCols || {}, lvl = colsFor('list');
  const props = S.props.filter(p => pcols[p.id] !== 0);
  const w0 = S.selMode ? 36 : 0;
  const pinned = i => pin && (i === 0 || i === 2);
  const cls = i => pinned(i) ? ' pc' + (i === 2 ? ' pl' : '') : '';
  const sty = i => !pinned(i) ? '' : ' style="left:' + (i === 0 ? 0 : w0) + 'px' + (i === 0 ? ';width:36px;min-width:36px' : '') + '"';
  const sortLink = (t, k) => '<a data-act="sortBy" data-k="' + k + '"' + (t === '✓' ? ' title="Завершено"' : '') + '>' + esc(t) + (f.sort === k ? (f.dir === 'desc' ? ' ▼' : ' ▲') : '') + '</a>';
  const th = (t, k, i) => '<th class="' + cls(i).trim() + '"' + sty(i) + '>' + (k ? sortLink(t, k) : esc(t)) + '</th>';
  let h = '<div class="wrap d' + lvl + '"><table><thead><tr>' + (S.selMode ? th('', null, 0) : '') + (c.cover ? th('', null, 1) : '') + th('Название', 'name', 2)
    + (c.mainPlatform ? th('Платформа', 'mainPlatform') : '') + (c.platforms ? th('Платформы') : '') + (c.done ? th('✓', 'done') : '') + (c.doneDate ? th('Дата', 'doneDate') : '') + (c.year ? th('Год', 'year') : '') + (c.rating ? th('Рейтинг', 'rating') : '')
    + (c.time ? th('Время', 'time') : '') + (c.series ? th('Серия', 'series') : '') + props.map(p => th(p.name, 'prop:' + p.id)).join('') + (c.colls ? th('Коллекции') : '') + '</tr></thead><tbody>';
  list.forEach(g => {
    const src = coverSrc(g), open = ' data-act="openGame" data-gid="' + g.id + '"';
    h += '<tr data-gid="' + g.id + '"' + ((g.done || S.sel.has(g.id)) ? ' class="' + [g.done ? 'isdone' : '', S.sel.has(g.id) ? 'sel' : ''].filter(Boolean).join(' ') + '"' : '') + '>' + (S.selMode ? '<td class="' + cls(0).trim() + '"' + sty(0) + open + '>' + (S.sel.has(g.id) ? '☑' : '☐') + '</td>' : '')
      + (c.cover ? '<td' + open + '><div class="thumb"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '></div></td>' : '')
      + '<td class="nmc' + cls(2) + '"' + sty(2) + open + '><div class="n">' + esc(g.name) + '</div>' + (c.genres && g.genres.length ? '<div class="sub">' + esc(g.genres.join(', ')) + '</div>' : '') + '</td>'
      + (c.mainPlatform ? '<td>' + (mainOf(g) ? '<span class="mp">' + esc(shortPlat(mainOf(g))) + '</span>' : '') + '</td>' : '') + (c.platforms ? '<td>' + esc((g.platforms || []).map(shortPlat).join(', ')) + '</td>' : '') + (c.done ? '<td>' + (g.done ? '<span style="color:var(--green);font-weight:700">✓</span>' : '') + '</td>' : '')
      + (c.doneDate ? '<td>' + fmtDate(g.doneDate) + '</td>' : '') + (c.year ? '<td>' + (g.year || '—') + '</td>' : '')
      + (c.rating ? '<td>' + (g.rating ? '<span style="color:#ffa000">★ ' + g.rating + '</span>' : '—') + '</td>' : '') + (c.time ? '<td>' + (g.time ? g.time + ' ч' : '—') + '</td>' : '')
      + (c.series ? '<td>' + esc(g.series || '') + '</td>' : '')
      + props.map(p => { const v = g.props && g.props[p.id]; return '<td class="pv">' + (hasVal(v) ? esc(v) : '') + '</td>'; }).join('')
      + (c.colls ? '<td>' + tagsHtml(g) + '</td>' : '') + '</tr>';
  });
  return h + '</tbody></table></div><div class="status">Игр: ' + list.length + '</div>';
}
const ICONS = {
  folderplus: '<path d="M3 7h6l2 2h10v10H3z"/><path d="M12 11v6M9 14h6"/>', folderminus: '<path d="M3 7h6l2 2h10v10H3z"/><path d="M9 14h6"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>', dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>', undo: '<path d="M9 7L4 12l5 5M4 12h10a6 6 0 0 1 0 12"/>', selall: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>', checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>', pad: '<path d="M7 9h10a4 4 0 0 1 4 4v2a2 2 0 0 1-3.4 1.4L16 15H8l-1.6 1.4A2 2 0 0 1 3 15v-2a4 4 0 0 1 4-4z"/><path d="M8 11v3M6.5 12.5h3"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>', grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  pin: '<path d="M9 4h6l-1 5 3 3v2H7v-2l3-3z"/><path d="M12 14v6"/>',
  zoom: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>',
  list: '<path d="M4 6h16M4 12h16M4 18h16"/>', cols: '<rect x="4" y="4" width="16" height="16"/><path d="M9.5 4v16M14.5 4v16"/>', sel: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>', coll: '<path d="M3 7h6l2 2h10v10H3z"/>'
};
const ZOOM_RANGE = { list: [1, 3], grid: [2, 6], search: [2, 6], coll: [1, 4], series: [1, 4] };
const ZOOM_DEF = { list: [1, 1], grid: [3, 6], search: [3, 6], coll: [2, 4], series: [2, 4] };
const colsFor = k => S.set.zoom[k] || ZOOM_DEF[k][(window.innerWidth || 0) >= 620 ? 1 : 0];
const zoomBtn = k => ib('zoom', 'zoom', 'Масштаб', false, '<span class="cnt bw">' + colsFor(k) + '</span>', ' data-k="' + k + '"');
const ib = (act, icon, label, on, extra, attrs) => '<button class="ib' + (on ? ' on' : '') + '" data-act="' + act + '"' + (attrs || '') + ' title="' + label + '" aria-label="' + label + '"><svg viewBox="0 0 24 24">' + ICONS[icon] + '</svg><span class="lbl">' + label + '</span>' + (extra || '') + '</button>';
function viewLibrary() {
  return '<div class="top"><div class="bar"><div class="sbox"><span>🔍</span><input id="q" placeholder="Поиск по названию" value="' + esc(S.set.f.q) + '"><button class="x" data-act="clearQ">✕</button></div></div>'
    + '<div class="tools" id="libTools"></div><div class="chips actv" id="libActive"></div></div><div class="scrl" id="libBody"></div>';
}
function activeCount() { const f = S.set.f; return f.years.length + f.genres.length + f.platforms.length + f.series.length + f.props.length + (f.done ? 1 : 0) + (f.minRating ? 1 : 0) + f.collections.length + f.mainPlats.length; }
function renderLibHead() {
  const f = S.set.f;
  $('#libTools').innerHTML = ib('openFilters', 'filter', 'Фильтры', activeCount() > 0, activeCount() ? '<span class="cnt">' + activeCount() + '</span>' : '')
    + ib('openColls', 'coll', 'Коллекции', f.collections.length > 0, f.collections.length ? '<span class="cnt">' + f.collections.length + '</span>' : '')
    + ib('toggleView', S.set.view === 'grid' ? 'list' : 'grid', S.set.view === 'grid' ? 'Список' : 'Сетка', false)
    + zoomBtn(S.set.view === 'grid' ? 'grid' : 'list')
    + (S.set.view === 'list' ? ib('openCols', 'cols', 'Колонки', false) : '')
  const chips = [];
  const lab = (k, v) => k === 'mainPlats' ? 'Основная: ' + (v === NO_MAIN ? 'не выбрана' : shortPlat(v)) : k === 'collections' ? (v === DONE_ID ? 'Завершено' : (collById(v) || {}).name || v) : k === 'props' ? ((S.props.find(p => p.id === v) || {}).name || v) : (k === 'series' && v === '' ? 'Без серии' : v);
  ['collections', 'mainPlats', 'years', 'genres', 'platforms', 'series', 'props'].forEach(k => f[k].forEach(v => chips.push('<button class="chip" data-act="rmF" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(lab(k, v)) + ' ✕</button>')));
  if (f.minRating) chips.push('<button class="chip" data-act="setMinRating" data-v="0">Рейтинг от ★ ' + f.minRating + ' ✕</button>');
  if (f.done) chips.push('<button class="chip" data-act="setDone" data-v="">' + (f.done === 'yes' ? 'Завершено' : 'Не завершены') + ' ✕</button>');
  if (f.q) chips.push('<button class="chip" data-act="clearQ">Поиск: ' + esc(f.q) + ' ✕</button>');
  if (chips.length) chips.push('<button class="chip gray" data-act="resetF">Сбросить ✕</button>');
  $('#libActive').innerHTML = chips.join('');
}
function renderLibBody() {
  const list = sortGames(filterGames(S.games, S.set.f), S.set.f); S.shown = list;
  const el = $('#libBody'); if (!el) return;
  if (!S.games.length) el.innerHTML = '<div class="hint">Каталог пуст.<br>Нажмите «+», чтобы добавить игру вручную, или найдите игры во вкладке «Поиск».</div>';
  else if (!list.length) el.innerHTML = '<div class="hint">Ничего не найдено</div>';
  else el.innerHTML = S.set.view === 'list' ? listHtml(list) : '<div class="grid z' + colsFor('grid') + '" style="--cols:' + colsFor('grid') + '">' + list.map(cardHtml).join('') + '</div><div class="status">Игр: ' + list.length + '</div>';
}
function renderLibrary() { renderLibHead(); renderLibBody(); renderSelBar(); }
function libRefilter() { renderLibrary(); const b = $('#libBody'); if (b) b.scrollTop = 0; } // после смены отбора список с начала
function renderSelBar() {
  if (S.tab === 'library') $('#fab').classList.toggle('hidden', S.selMode); // после массового действия кнопка «+» возвращается
  const b = $('#selbar'), inb = S.tab === 'inbox' && S.inSelMode && !!S.inboxList, lib = S.selMode && S.tab === 'library';
  b.classList.toggle('hidden', !(lib || inb));
  if (inb) { b.innerHTML = '<b class="selcnt">' + S.inSel.size + '</b>' + ib('inAct', 'pad', 'Основная платформа', false, '', ' data-m="plat"') + ib('inAct', 'folderplus', 'Коллекции', false, '', ' data-m="colls"') + ib('inAct', 'checkc', 'Завершено', false, '', ' data-m="done"') + ib('inAct', 'undo', 'Как у списка', false, '', ' data-m="reset"') + ib('inAct', 'selall', 'Выбрать все', false, '', ' data-m="all"') + ib('inAct', 'close', 'Отмена', false, '', ' data-m="x"'); return; }
  if (!lib) return;
  b.innerHTML = '<b class="selcnt">' + S.sel.size + '</b>' + ib('selAct', 'folderplus', 'В коллекцию', false, '', ' data-m="add"') + ib('selAct', 'folderminus', 'Убрать из коллекции', false, '', ' data-m="remove"') + ib('selAct', 'trash', 'Удалить', false, '', ' data-m="delete"') + ib('selAct', 'dots', 'Ещё: завершено, серия, платформа, выгрузка, перемещение', false, '', ' data-m="more"') + ib('selToggle', 'close', 'Отменить выбор', false, '');
}
function rerenderInbox() { const v = $('#view'), sc = v ? v.scrollTop : 0; render(); if (v) v.scrollTop = sc; }
function toggleInSel(id, on) {
  const it = S.inbox.items.find(i => i.id === id); if (!it || it.done) return;
  S.inSelMode = true; if (on === true || !S.inSel.has(id)) S.inSel.add(id); else S.inSel.delete(id);
  rerenderInbox();
}
function toggleSel(id, on) {
  if (!S.selMode) S.selMode = true;
  if (on === true || !S.sel.has(id)) S.sel.add(id); else S.sel.delete(id);
  renderLibrary();
}
async function selectionAction(m) {
  const ids = Array.from(S.sel); if (!ids.length) return toast('Выберите игры (долгое нажатие на карточку)');
  if (m === 'more') return bulkMore(ids);
  if (m === 'delete') {
    if (!await confirmBox('Удалить игр: ' + ids.length + '?', 'Удалить')) return;
    for (const id of ids) await removeGame(id);
    toast('Удалено игр: ' + ids.length, 'Отменить', () => restoreGames(ids));
  } else {
    const f = S.set.f; const src = f.collections.length === 1 ? f.collections[0] : null;
    if (m === 'move' && (!src || src === DONE_ID)) return toast('Для перемещения выберите сверху ОДНУ свою коллекцию-источник');
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
async function bulkMore(ids) {
  const games = ids.map(gameById).filter(Boolean);
  const m = await askChoose({ title: 'Выбрано игр: ' + games.length, items: [
    { id: 'done', label: 'Отметить завершёнными' }, { id: 'undone', label: 'Снять отметку «Завершено»' },
    { id: 'series', label: 'Задать серию…' }, { id: 'noseries', label: 'Убрать серию' },
    { id: 'main', label: 'Задать основную платформу…' }, { id: 'merge', label: 'Объединить карточки…', sub: 'сравнить выбранные игры и слить в одну' }, { id: 'move', label: 'Переместить в другую коллекцию', sub: 'убирает из выбранной сверху коллекции и добавляет в новую' }, { id: 'genre', label: 'Добавить жанр…' }, { id: 'plat', label: 'Добавить платформу…' },
    { id: 'export', label: 'Выгрузить выбранные…' }, { id: 'igdb', label: 'Обновить из ' + PROV[S.set.mainSrc].name }] });
  if (!m) return;
  if (m === 'igdb') return bulkRefresh(games);
  if (m === 'move') return selectionAction('move');
  if (m === 'merge') { if (games.length < 2) return toast('Выберите две карточки или больше'); S.selMode = false; S.sel.clear(); renderLibrary(); return openMergeCompare(games.map(g => g.id), true); }
  if (m === 'export') return openExport(games, 'Выбранные игры');
  let n = 0;
  if (m === 'done') { for (const g of games) if (!g.done) { g.done = true; g.doneDate = g.doneDate || todayStr(); await saveGame(g); n++; } }
  else if (m === 'undone') { for (const g of games) if (g.done) { g.done = false; g.doneDate = ''; await saveGame(g); n++; } }
  else if (m === 'series') { const v = await askPrompt('Название серии'); if (!v) return; const name = canonSeries(v); for (const g of games) { g.series = name; await saveGame(g); n++; } }
  else if (m === 'noseries') { for (const g of games) if (g.series) { g.series = ''; await saveGame(g); n++; } }
  else if (m === 'main') {
    const all = Array.from(new Set(games.flatMap(g => g.platforms || []))); if (!all.length) return toast('У выбранных игр не указаны платформы');
    const pl = await askChoose({ title: 'Основная платформа', items: all.map(x => ({ id: x, label: shortPlat(x), sub: shortPlat(x) !== x ? x : '', ico: '🎮' })) }); if (!pl) return;
    for (const g of games) if ((g.platforms || []).includes(pl)) { g.mainPlatform = pl; await saveGame(g); n++; }
  } else {
    const key = m === 'genre' ? 'genres' : 'platforms', v = await askPrompt(m === 'genre' ? 'Жанр' : 'Платформа'); if (!v) return;
    for (const g of games) if (!g[key].some(x => normName(x) === normName(v))) { g[key].push(v); await saveGame(g); n++; }
  }
  toast('Изменено игр: ' + n); S.sel.clear(); S.selMode = false; renderLibrary();
}
async function removeGame(id, opts) {
  const g = gameById(id);
  if (g && !(opts && opts.noTrash)) {
    const c = await DB.get('covers', id), sr = await DB.get('shots', id), rec = { id, game: clone(g), blob: c ? c.blob : null, shots: sr ? sr.list : null, t: Date.now() };
    await DB.put('trash', rec); S.trash = S.trash.filter(x => x.id !== id).concat([rec]);
  }
  S.games = S.games.filter(x => x.id !== id); await DB.del('games', id); await DB.del('covers', id); await DB.del('shots', id);
  if (coverCache.has(id)) { URL.revokeObjectURL(coverCache.get(id)); coverCache.delete(id); }
}
async function restoreGames(ids) {
  for (const id of ids) {
    const rec = S.trash.find(x => x.id === id); if (!rec || gameById(id)) continue;
    S.games.push(rec.game); await DB.put('games', rec.game); if (rec.blob) await setCover(id, rec.blob);
    if (rec.shots && rec.shots.length) await DB.put('shots', { id, list: rec.shots });
    await DB.del('trash', id); S.trash = S.trash.filter(x => x.id !== id);
  }
  render();
}

/* ====================== Фильтры каталога ====================== */
function valueCounts(fn) { const m = new Map(); S.games.forEach(g => [].concat(fn(g)).filter(hasVal).forEach(v => m.set(v, (m.get(v) || 0) + 1))); return m; }
function collPickHtml() {
  const f = S.set.f;
  const chip = (id, name, n, col, extra) => '<button class="p' + extra + (f.collections.includes(id) ? ' on' : '') + '"' + (okColor(col) ? ' style="border-color:' + okColor(col) + '"' : '') + ' data-act="collChip" data-id="' + id + '">' + esc(name) + '<b>' + n + '</b></button>';
  const mode = (v, t) => '<button class="p' + (f.collMode === v ? ' on' : '') + '" data-act="collMode" data-v="' + v + '">' + t + '</button>';
  return (S.collections.length > 8 ? '<label class="field"><input id="cpq" placeholder="Поиск коллекции" autocomplete="off"></label>' : '')
    + '<div class="chips" id="collList">' + chip(DONE_ID, '✓ Завершено', S.games.filter(g => g.done).length, '', ' done') + sortedColls().map(c => chip(c.id, c.name, gamesIn(c.id).length, c.color, '')).join('') + '</div>'
    + '<div class="sub">Если выбрано несколько:</div><div class="chips">' + mode('or', 'любая из них (ИЛИ)') + mode('and', 'все сразу (И)') + '</div>';
}
function openCollSheet() {
  sheetKey = 'colls'; openSheet('<div class="hdr2"><h2>Коллекции</h2><button class="btn" data-act="collClear">Снять выбор</button></div>' + collPickHtml() + '<button class="btn acc" style="width:100%;margin-top:10px" data-act="closeSheet">Готово</button>');
}
function mainSect() {
  const f = S.set.f;
  const one = (k, title, fn, lab, none) => {
    const mm = new Map(); S.games.forEach(g => { const v = fn(g) || NO_MAIN; mm.set(v, (mm.get(v) || 0) + 1); });
    if (mm.size < 2 && (!mm.size || mm.has(NO_MAIN))) return '';
    const keys = Array.from(mm.keys()).sort((a, b) => a === NO_MAIN ? 1 : b === NO_MAIN ? -1 : a.localeCompare(b, 'ru'));
    return '<h3>' + title + '</h3><div class="chips">' + keys.map(v => '<button class="p' + (f[k].includes(v) ? ' on' : '') + '" data-act="fToggle" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(v === NO_MAIN ? none : lab(v)) + '<b>' + mm.get(v) + '</b></button>').join('') + '</div>';
  };
  return one('mainPlats', 'Основная платформа', mainOf, shortPlat, 'Не выбрана');
}
function openFilters() {
  const f = S.set.f;
  const sect = (title, k, m, sortFn) => {
    const keys = Array.from(m.keys()).sort(sortFn || ((a, b) => String(a).localeCompare(String(b), 'ru')));
    return keys.length ? '<h3>' + title + '</h3><div class="chips">' + keys.map(v => '<button class="p' + (f[k].map(String).includes(String(v)) ? ' on' : '') + '" data-act="fToggle" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(v) + '<b>' + m.get(v) + '</b></button>').join('') + '</div>' : '';
  };
  const propBtns = S.props.map(p => '<button class="p' + (f.props.includes(p.id) ? ' on' : '') + '" data-act="fToggle" data-k="props" data-v="' + p.id + '">' + esc(p.name) + '</button>').join('');
  sheetKey = 'filters'; openSheet('<div class="hdr2"><h2>Фильтры</h2><button class="btn" data-act="resetF">Сбросить</button></div>'
    + '<h3>Сортировка</h3><div class="two"><label class="field"><select id="fsort">' + SORTS.concat(S.props.map(p => ['prop:' + p.id, p.name])).map(s => '<option value="' + s[0] + '"' + (f.sort === s[0] ? ' selected' : '') + '>' + s[1] + '</option>').join('') + '</select></label>'
    + '<label class="field"><select id="fdir"><option value="asc"' + (f.dir === 'asc' ? ' selected' : '') + '>по возрастанию</option><option value="desc"' + (f.dir === 'desc' ? ' selected' : '') + '>по убыванию</option></select></label></div>'
    + '<h3>Коллекции</h3>' + collPickHtml()
    + '<h3>Рейтинг от</h3><div class="chips">' + [0, 5, 6, 7, 8, 9].map(v => '<button class="p' + ((f.minRating || 0) === v ? ' on' : '') + '" data-act="setMinRating" data-v="' + v + '">' + (v ? '★ ' + v + '+' : 'Все') + '</button>').join('') + '</div>'
    + '<h3>Прохождение</h3><div class="chips">' + [['', 'Все'], ['yes', '✓ Завершено'], ['no', 'Не завершены']].map(x => '<button class="p' + (f.done === x[0] ? ' on' : '') + '" data-act="setDone" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>'
    + sect('Год', 'years', valueCounts(g => g.year || null), (a, b) => b - a) + sect('Жанр', 'genres', valueCounts(g => g.genres)) + mainSect() + sect('Платформа', 'platforms', valueCounts(g => g.platforms))
    + sect('Серия', 'series', valueCounts(g => g.series)) + (propBtns ? '<h3>Другие свойства (заполнено)</h3><div class="chips">' + propBtns + '</div>' : '')
    + '<p class="hint" style="padding:6px">Значения одного вида - «любое из», разные виды - «и».</p><button class="btn acc" style="width:100%" data-act="closeSheet">Готово</button>');
  $('#fsort').onchange = e => { f.sort = e.target.value; saveSet(); renderLibrary(); };
  $('#fdir').onchange = e => { f.dir = e.target.value; saveSet(); renderLibrary(); };
}
function openCols() {
  const c = S.set.cols, pc = S.set.propCols || {};
  sheetKey = 'cols'; openSheet('<h2 style="margin:0 0 10px">Колонки</h2><div class="chips">' + COLS.map(x => '<button class="p' + (c[x[0]] ? ' on' : '') + '" data-act="colToggle" data-k="' + x[0] + '">' + (c[x[0]] ? '✓ ' : '') + x[1] + '</button>').join('') + '</div>'
    + (S.props.length ? '<h3>Свойства (не коллекции)</h3><div class="chips">' + S.props.map(p => '<button class="p' + (pc[p.id] !== 0 ? ' on' : '') + '" data-act="colProp" data-id="' + p.id + '">' + (pc[p.id] !== 0 ? '✓ ' : '') + esc(p.name) + '</button>').join('') + '</div>' : '')
    + '<h3>Закрепление</h3><div class="chips"><button class="p' + (S.set.pin ? ' on' : '') + '" data-act="togglePin">' + (S.set.pin ? '✓ ' : '') + 'Закрепить название слева</button></div><h3>Выгрузка</h3><div class="chips"><button class="p" data-act="expLib">Выгрузить текущий список…</button></div>'
    + '<button class="btn acc" style="width:100%;margin-top:10px" data-act="closeSheet">Готово</button>');
}

/* ====================== Карточка игры (правка) ====================== */
const ICON_SHARE = '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/></svg>';
const ICO = {
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  pad: '<path d="M7 9h10a4 4 0 0 1 4 4v2a2 2 0 0 1-3.4 1.4L16 15H8l-1.6 1.4A2 2 0 0 1 3 15v-2a4 4 0 0 1 4-4z"/><path d="M8 11v3M6.5 12.5h3M16 12h.01M18 13.5h.01"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4M4 4v4h4M4 13a8 8 0 0 0 14 4M20 20v-4h-4"/>',
  img: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 16l-5-5-8 8"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>'
};
const I = (n, c) => '<svg class="ic' + (c ? ' ' + c : '') + '" viewBox="0 0 24 24" fill="' + (n === 'star' ? '#f5a524' : 'none') + '" stroke="' + (n === 'star' ? '#f5a524' : 'currentColor') + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + ICO[n] + '</svg>';
// верх карточки: источники (цветные рамки со ссылками) и основная платформа
function drawShName() { const el = $('#shName'), v = (($('#f_name') || {}).value || '').trim(); if (el) { el.textContent = v || 'Название: нажмите, чтобы ввести'; if (el.classList) el.classList.toggle('ph', !v); } }
function drawShDone() {
  const d = S.sheet && S.sheet.draft; if (!d) return; const c = $('#shDone2'), dt = ($('#f_donedate') || {}).value || '';
  if (c && c.classList) c.classList.toggle('on', !!d.done);
  const l = $('#doneL'); if (l) l.innerHTML = I(d.done ? 'checkc' : 'circle') + ' <span>Завершено</span>';
  const t = $('#doneTxt'); if (t) t.textContent = d.done && dt ? new Date(dt + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}
function drawShHead() {
  const el = $('#shSrc'); if (!el || !S.sheet) return; const d = S.sheet.draft, srcs = srcsOf(d), inp = $('#f_platforms'), list = inp ? csv(inp.value) : d.platforms;
  const mp = d.mainPlatform && list.includes(d.mainPlatform) ? d.mainPlatform : (list.length === 1 ? list[0] : '');
  el.innerHTML = (srcs.length ? srcs.map(k => srcBadge(k, d[k + 'Url'])).join('') : '<span class="srcb" style="color:var(--mut);border-color:var(--bd2)">Вручную</span>')
    + '<button class="mpchip" data-act="shMainPlat">' + I('pad') + ' ' + (mp ? esc(shortPlat(mp)) : 'Платформа') + '</button><button class="ib mnb" data-act="shMenu" title="Действия" aria-label="Действия">⋮</button>';
}
// строка с годом, рейтингом, временем и серией: правятся по нажатию
function drawShInfo() {
  const el = $('#shInfo'); if (!el) return; const v = k => (($('#f_' + k) || {}).value || '').trim();
  const chip = (ic, txt, k, act) => '<button class="ichip" data-act="' + (act || 'shEdit') + '"' + (k ? ' data-k="' + k + '"' : '') + '>' + I(ic) + ' ' + txt + '</button>';
  el.innerHTML = chip('cal', v('year') || '—', 'year') + chip('star', v('rating') ? esc(v('rating')) + '/10' : '—', 'rating') + chip('clock', v('time') ? esc(v('time')) + ' ч' : '— ч', 'time') + chip('book', v('series') ? esc(v('series')) : 'Серия', '', 'pickSeries');
}
function openGameSheet(id) {
  closeSheet();
  const isNew = !id;
  const g = isNew ? { id: uid(), igdbId: 0, rawgId: 0, name: '', year: 0, rating: 0, time: 0, description: '', genres: [], platforms: [], series: '', coverUrl: '', hasCover: false, collections: [], props: {}, done: false, doneDate: '', shotCount: 0, mainPlatform: '', added: Date.now() } : gameById(id);
  if (!g) return;
  S.sheet = { isNew, draft: clone(g), cover: null, dirty: false };
  const d = S.sheet.draft, src = coverSrc(g), srcs = srcsOf(g);
  const propInputs = S.props.map(p => '<label class="field"><span>' + esc(p.name) + '</span>' + (p.type === 'text'
    ? '<textarea data-prop="' + p.id + '" rows="2">' + esc(d.props[p.id] != null ? d.props[p.id] : '') + '</textarea>'
    : '<input data-prop="' + p.id + '" type="' + (p.type === 'number' ? 'number' : 'date') + '"' + (p.type === 'number' ? ' step="any" inputmode="decimal"' : '') + ' value="' + esc(d.props[p.id] != null ? d.props[p.id] : '') + '">') + '</label>').join('');
  const sb = (ic, label, act, extra) => '<button class="btn sm" data-act="' + act + '"' + (extra || '') + '>' + I(ic) + ' ' + label + '</button>';
    const sh = openSheet('<div class="cmp"><div class="hero2"><div class="cv' + (src ? '' : ' nocover') + '" id="shCover" data-act="shCover"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '><button class="cgear" data-act="shCover" aria-label="Обложка">' + I('gear') + '</button></div><div class="hr"><div class="srcrow2" id="shSrc"></div>'
    + '<div class="namebox" data-act="shEditName"><span class="nm2" id="shName"></span><span class="pen">' + I('edit') + '</span></div><input id="f_name" type="hidden" value="' + esc(d.name) + '"><div class="infochips" id="shInfo"></div></div></div>'
    + '<div class="hidden"><input id="f_year" type="number" value="' + (d.year || '') + '"><input id="f_rating" type="number" step="any" value="' + (d.rating || '') + '"><input id="f_time" type="number" step="any" value="' + (d.time || '') + '"><input id="f_series" value="' + esc(d.series) + '"></div>'
    + '<input type="file" id="coverFile" accept="image/*" class="hidden">'
    + '<div class="donecard" id="shDone2" data-act="shDone"><div class="dc1" id="doneL"></div><div class="dc2"><span id="doneTxt"></span><label class="dpick" data-act="noop" aria-label="Изменить дату">' + I('edit') + '<input id="f_donedate" type="date" value="' + esc(d.doneDate || '') + '"></label></div></div>'
    + '<h3>Коллекции</h3><div class="chips" id="shColls"></div>'
    + '<div class="hdr3"><h3>Жанры</h3><button class="btn" data-act="editGenres" aria-label="Изменить жанры">' + I('edit') + '</button></div><div class="chips" id="shGenres"></div>'
    + '<label class="field hidden" id="genresRow"><span>Жанры (через запятую)</span><input id="f_genres" value="' + esc(d.genres.join(', ')) + '"></label>'
    + '<div class="hdr3"><h3>Платформы</h3><button class="btn" data-act="editPlats" aria-label="Изменить платформы">' + I('edit') + '</button></div><div class="chips" id="shPlats"></div>'
    + '<label class="field hidden" id="platsRow"><span>Платформы (через запятую)</span><input id="f_platforms" value="' + esc(d.platforms.join(', ')) + '"></label>'
    + propInputs + '<h3>Скриншоты</h3><div id="shotsSaved"></div><div class="tbar">' + sb('plus', 'Своё', 'shotAddFile') + srcs.map(k => sb('img', PROV[k].name, 'loadShots', ' data-rid="' + ridOf(k, g[k + 'Id']) + '" data-save="1"')).join('') + '</div><input type="file" id="shotFile" accept="image/*" multiple class="hidden"><div id="shotsBox"></div></div>'
    + '<div class="sbar"><button class="btn acc" data-act="closeSheet">Готово</button><span id="svst" class="sub">Сохраняется автоматически</span>'
    + (isNew ? '<span style="width:44px"></span>' : '<button class="ib red" data-act="delGame" title="Удалить игру" aria-label="Удалить игру"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg></button>') + '</div>');
  drawShColls(); drawShGenres(d.genres); drawShPlats(d.platforms); drawShots(); drawShHead(); drawShInfo(); drawShName(); drawShDone();
  $('#f_donedate').onchange = () => { const dd = S.sheet.draft; if ($('#f_donedate').value) dd.done = true; markDirty(); drawShDone(); };
  if (isNew) setTimeout(() => ACT.shEditName(), 60);
  $('#shotFile', sh).onchange = async e => { const files = Array.from(e.target.files || []); e.target.value = ''; if (files.length) await addShotFiles(files); };
  $('#coverFile', sh).onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    try { const b = await toThumb(file); S.sheet.cover = b; markDirty(); const u = URL.createObjectURL(b); const c = $('#shCover'); c.style.backgroundImage = "url('" + u + "')"; c.classList.remove('nocover'); } catch (er) { toast('Не удалось прочитать картинку'); }
  };
}
function drawShColls() {
  const d = S.sheet.draft;
  $('#shColls').innerHTML = sortedColls().map(c => '<button class="p' + (d.collections.includes(c.id) ? ' on' : '') + '"' + (okColor(c.color) ? ' style="color:' + okColor(c.color) + ';border-color:' + okColor(c.color) + '"' : '') + ' data-act="shColl" data-id="' + c.id + '">' + esc(c.name) + '</button>').join('') + '<button class="p new" data-act="shNewColl">＋ новая</button>';
}
const EDIT_KEYS = ['name', 'year', 'rating', 'time', 'series', 'genres', 'platforms', 'collections', 'props', 'done', 'doneDate', 'mainPlatform'];
let autoT;
function markDirty() {
  if (S.sheet && $('#shInfo')) { drawShInfo(); drawShName(); } if (!S.sheet) return; S.sheet.dirty = true; clearTimeout(autoT); autoT = setTimeout(autosave, 1500); }
function collectSheet() {
  const sh = S.sheet; if (!sh || !sheetEl || !$('#f_name')) return false; const d = sh.draft;
  Object.assign(d, { name: $('#f_name').value.trim(), year: (y => (y >= 1950 && y <= 2100) ? y : 0)(+$('#f_year').value || 0), rating: +$('#f_rating').value || 0, time: +$('#f_time').value || 0, series: $('#f_series').value.trim(), genres: csv($('#f_genres').value), platforms: csv($('#f_platforms').value) });
  if (d.mainPlatform && !d.platforms.includes(d.mainPlatform)) d.mainPlatform = '';
  d.doneDate = d.done ? (($('#f_donedate') || {}).value || '') : '';
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
  } else { if (g.rating !== d.rating) g.ratingManual = true; EDIT_KEYS.forEach(k => { g[k] = d[k] !== null && typeof d[k] === 'object' ? clone(d[k]) : d[k]; }); }
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
    const keys = ['n' + normName(g.name) + '|' + (g.year || 0)]; if (g.igdbId) keys.push('r' + g.igdbId); if (g.rawgId) keys.push('w' + g.rawgId);
    keys.forEach(k => { if (byKey.has(k)) parent.set(find(g.id), find(byKey.get(k))); else byKey.set(k, g.id); });
  });
  const groups = new Map(); S.games.forEach(g => { const r = find(g.id); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(g); });
  groups.forEach(a => { if (a.length > 1) res.games.push(a); });
  return res;
}
async function mergeGames(list) {
  const score = g => (g.igdbId || g.rawgId ? 4 : 0) + (g.hasCover ? 2 : 0) + ((g.collections || []).length ? 1 : 0);
  list = list.slice().sort((a, b) => score(b) - score(a) || (a.added || 0) - (b.added || 0));
  const p = list[0];
  for (const o of list.slice(1)) {
    (o.collections || []).forEach(c => { if (!p.collections.includes(c)) p.collections.push(c); });
    p.props = Object.assign({}, o.props || {}, p.props || {}); p.done = !!(p.done || o.done); if (!p.doneDate && o.doneDate) p.doneDate = o.doneDate;
    ['description', 'series', 'coverUrl', 'mainPlatform'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; }); ['year', 'rating', 'time'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; });
    if (!p.igdbId && o.igdbId) p.igdbId = o.igdbId; if (!p.rawgId && o.rawgId) p.rawgId = o.rawgId; ['igdbUrl', 'rawgUrl'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; }); if (!p.genres.length) p.genres = o.genres; if (!p.platforms.length) p.platforms = o.platforms;
    if (!p.hasCover && o.hasCover) { const c = await DB.get('covers', o.id); if (c) await setCover(p.id, c.blob); }
    for (const i of S.inbox.items) if (i.gameId === o.id) { i.gameId = p.id; await DB.put('inboxItems', i); }
    const os = await getShots(o.id);
    if (os.length) { const ps = await getShots(p.id), have = new Set(ps.map(x => x.src).filter(Boolean)), add = os.filter(x => !x.src || !have.has(x.src)); if (add.length) await putShots(p.id, ps.concat(add)); }
    await removeGame(o.id, { noTrash: true });
  }
  p.series = canonSeries(p.series); await saveGame(p);
}
/* ====================== Объединение карточек вручную ====================== */
const MG_FIELDS = [['name', 'Название', 't'], ['year', 'Год', 'n'], ['platforms', 'Платформы', 'l'], ['mainPlatform', 'Основная платформа', 'p'], ['genres', 'Жанры', 'l'], ['rating', 'Рейтинг', 'n'], ['time', 'Время, ч', 'n'], ['series', 'Серия', 't'], ['collections', 'Коллекции', 'c'], ['done', 'Завершено', 'b'], ['doneDate', 'Дата завершения', 'd'], ['description', 'Описание', 'x']];
const mgGet = (g, k) => (k === 'platforms' || k === 'genres' || k === 'collections') ? (g[k] || []).slice() : g[k];
const mgShow = (g, k) => {
  const v = mgGet(g, k);
  if (k === 'collections') return v.map(id => (collById(id) || {}).name).filter(Boolean).join(', ') || '—';
  if (Array.isArray(v)) return v.map(x => k === 'platforms' ? shortPlat(x) : x).join(', ') || '—';
  if (k === 'done') return v ? 'да' : 'нет';
  if (k === 'mainPlatform') return v ? shortPlat(v) : '—';
  if (k === 'description') return v ? String(v).slice(0, 70) + (String(v).length > 70 ? '…' : '') : '—';
  return v === '' || v == null || v === 0 ? '—' : String(v);
};
const mgUnion = (a, b) => Array.from(new Set((a || []).concat(b || [])));
const mgScore = g => (g.igdbId || g.rawgId ? 4 : 0) + (g.hasCover ? 2 : 0) + ((g.collections || []).length ? 1 : 0);
function mergeGroups(withYear) { // группы карточек с одинаковым названием (и годом), где карточек две и больше
  const m = new Map();
  S.games.forEach(g => { const k = normName(g.name) + (withYear ? '|' + (g.year || 0) : ''); if (!m.has(k)) m.set(k, []); m.get(k).push(g); });
  return Array.from(m.values()).filter(a => a.length > 1).sort((a, b) => b.length - a.length || a[0].name.localeCompare(b[0].name, 'ru'));
}
function mgBase(main, cards) { // результат: данные основной карточки, коллекции собраны со всех
  const r = {}; MG_FIELDS.forEach(f => { r[f[0]] = mgGet(main, f[0]); });
  r.collections = cards.reduce((a, c) => mgUnion(a, c.collections), []); return r;
}
function openMergeTool() {
  const y = !!S.mgYear, groups = mergeGroups(y);
  sheetKey = 'mgtool'; openSheet('<div class="hdr2"><h2>Объединение карточек</h2></div><div class="chips"><button class="p' + (!y ? ' on' : '') + '" data-act="mgMode" data-v="0">Название</button><button class="p' + (y ? ' on' : '') + '" data-act="mgMode" data-v="1">Название + год</button></div>'
    + '<p class="sub">Названия, у которых две карточки и больше: ' + groups.length + '. Нажмите на название, чтобы сравнить карточки, выбрать основную и перенести данные.</p><div class="mglist">'
    + (groups.map(a => '<div class="mgrow" data-act="mgOpen" data-ids="' + a.map(g => g.id).join(',') + '"><span class="mgn">' + esc(a[0].name) + '</span><span class="mgc">' + a.length + '</span><span class="sub mgs">' + esc(a.map(g => (g.year || '—') + (mainOf(g) ? ' ' + shortPlat(mainOf(g)) : '')).join(' · ')) + '</span></div>').join('') || '<p class="hint">Одинаковых названий нет</p>') + '</div>');
}
function openMergeCompare(ids, fresh) {
  const cards = ids.map(gameById).filter(Boolean); if (cards.length < 2) return toast('Нужно минимум две карточки');
  if (fresh || !S.mg || S.mg.ids.join() !== ids.join()) { const main = cards.slice().sort((a, b) => mgScore(b) - mgScore(a) || (a.added || 0) - (b.added || 0))[0]; S.mg = { ids, main: main.id, res: mgBase(main, cards) }; }
  drawMergeCompare();
}
function drawMergeCompare() {
  const m = S.mg, cards = m.ids.map(gameById).filter(Boolean), list = k => ['platforms', 'genres', 'collections'].includes(k);
  const head = '<tr><th class="mgl"></th><th class="mgres">Результат</th>' + cards.map(c => '<th><button class="p' + (c.id === m.main ? ' on' : '') + '" data-act="mgMain" data-id="' + c.id + '">' + (c.id === m.main ? '✓ ' : '') + 'Основная</button><div class="sub">' + esc([c.year || '', mainOf(c) ? shortPlat(mainOf(c)) : '', srcsOf(c).map(k => PROV[k].name).join('+')].filter(Boolean).join(' · ')) + '</div></th>').join('') + '</tr>';
  const rows = MG_FIELDS.map(f => { const k = f[0]; return '<tr><th class="mgl">' + f[1] + (list(k) ? '<br><button class="btn sm" data-act="mgUnion" data-k="' + k + '">∪ все</button>' : '') + '</th><td class="mgres" data-act="mgEdit" data-k="' + k + '">' + esc(mgShow(m.res, k)) + ' ✎</td>'
    + cards.map(c => '<td>' + esc(mgShow(c, k)) + (c.id === m.main ? '' : '<div class="mgb"><button class="btn sm" data-act="mgTake" data-id="' + c.id + '" data-k="' + k + '" title="Взять в результат">⇒</button>' + (list(k) ? '<button class="btn sm" data-act="mgAdd" data-id="' + c.id + '" data-k="' + k + '" title="Добавить к результату">＋</button>' : '') + '</div>') + '</td>').join('') + '</tr>'; }).join('');
  sheetKey = 'mgcmp'; openSheet('<div class="hdr2"><h2>' + esc(cards[0].name) + '</h2></div><p class="sub">Выберите основную карточку. «⇒» берёт значение из карточки в результат, «＋» добавляет к списку, «∪ все» объединяет списки всех карточек, нажатие на значение в «Результате» меняет его вручную. Обложка, источники, свойства и скриншоты переносятся сами.</p>'
    + '<div class="mgwrap"><table class="mgt">' + head + rows + '</table></div><div class="toolbar"><button class="btn acc" data-act="mgDo">Объединить…</button><button class="btn" data-act="mgBack">К списку названий</button></div>');
}
function openMergePreview() {
  const m = S.mg, cards = m.ids.map(gameById).filter(Boolean), main = gameById(m.main), others = cards.filter(c => c.id !== m.main), r = m.res;
  const shots = others.reduce((a, c) => a + (c.shotCount || 0), main.shotCount || 0);
  const lines = MG_FIELDS.map(f => '<tr><th class="mgl">' + f[1] + '</th><td>' + esc(mgShow(r, f[0])) + '</td></tr>').join('')
    + '<tr><th class="mgl">Источники</th><td>' + esc(cards.reduce((a, c) => mgUnion(a, srcsOf(c)), []).map(k => PROV[k].name).join(', ') || '—') + '</td></tr>'
    + '<tr><th class="mgl">Скриншоты</th><td>' + shots + '</td></tr><tr><th class="mgl">Обложка</th><td>' + (main.hasCover || !others.some(c => c.hasCover) ? 'основной карточки' : 'из другой карточки') + '</td></tr>';
  sheetKey = 'mgprev'; openSheet('<div class="hdr2"><h2>Проверка перед объединением</h2></div><p class="sub">Новая карточка будет такой. Будут удалены карточки: <b>' + others.length + '</b> (' + esc(others.map(c => c.name + (c.year ? ' ' + c.year : '') + (mainOf(c) ? ' ' + shortPlat(mainOf(c)) : '')).join('; ')) + '). Они попадут в корзину и хранятся там 30 дней, можно вернуть.</p><div class="mgwrap"><table class="mgt">' + lines + '</table></div>'
    + '<div class="toolbar"><button class="btn acc" data-act="mgGo">Объединить</button><button class="btn" data-act="mgCompare">Назад к сравнению</button></div>');
}
async function applyMerge(m) {
  const p = gameById(m.main), others = m.ids.filter(i => i !== m.main).map(gameById).filter(Boolean), r = m.res; if (!p) return;
  p.name = r.name || p.name; p.year = +r.year || 0; p.rating = +r.rating || 0; p.time = +r.time || 0; p.series = canonSeries(r.series || ''); p.description = r.description || ''; p.doneDate = r.doneDate || '';
  p.platforms = (r.platforms || []).slice(); p.genres = (r.genres || []).slice(); p.collections = (r.collections || []).filter(id => collById(id)); p.done = !!r.done; p.mainPlatform = r.mainPlatform && p.platforms.includes(r.mainPlatform) ? r.mainPlatform : '';
  for (const o of others) {
    ['igdbId', 'rawgId', 'igdbUrl', 'rawgUrl', 'coverUrl'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; });
    p.props = Object.assign({}, o.props || {}, p.props || {});
    if (!p.hasCover && o.hasCover) { const c = await DB.get('covers', o.id); if (c) await setCover(p.id, c.blob); }
    for (const i of S.inbox.items) if (i.gameId === o.id) { i.gameId = p.id; await DB.put('inboxItems', i); }
    const os = await getShots(o.id);
    if (os.length) { const ps = await getShots(p.id), have = new Set(ps.map(x => x.src).filter(Boolean)), add = os.filter(x => !x.src || !have.has(x.src)); if (add.length) await putShots(p.id, ps.concat(add)); }
  }
  await saveGame(p);
  for (const o of others) await removeGame(o.id);
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
    m.innerHTML = '<h4>Найдены дубли: ' + n + '</h4><div class="sub" style="max-height:230px;overflow:auto;white-space:pre-wrap">' + esc(lines.join('\n')) + '</div><p class="sub">У серий останется самое частое написание. У игр останется самая полная карточка, коллекции, свойства и отметка «Завершено» сложатся.</p><div class="acts"><span data-x="cancel">Позже</span><span data-x="ok">Объединить</span></div>';
    modalCancel = () => { closeModal(); res(false); };
    m.onclick = async e => { const x = e.target.closest('[data-x]'); if (!x) return; closeModal(); if (x.dataset.x === 'ok') { await mergeAllDupes(d); toast('Дубли объединены'); res(true); } else res(false); };
  });
}
function dupBanner(kind) {
  const d = findDupes(), n = kind === 'series' ? d.series.length : d.colls.length;
  return n ? '<div class="banner">Найдены дубли ' + (kind === 'series' ? 'серий' : 'коллекций') + ' с разным регистром букв: ' + n + '<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="fixDupes">Объединить…</button></div></div>' : '';
}

async function refreshOne(g, src) {
  src = src || srcsOf(g)[0]; const { d, series } = await fetchDetails(ridOf(src, g[src + 'Id'])); const n = gameFromDetails(d, series);
  Object.assign(g, { name: n.name, year: n.year, description: n.description, genres: n.genres, platforms: n.platforms });
  if (n[src + 'Url']) g[src + 'Url'] = n[src + 'Url'];
  if (g.mainPlatform && !g.platforms.includes(g.mainPlatform)) g.mainPlatform = '';
  if (!g.ratingManual || !g.rating) g.rating = n.rating;
  if (!g.time) g.time = n.time; if (!g.series) g.series = canonSeries(n.series);
  if (!g.coverSrc || g.coverSrc === src) { g.coverUrl = n.coverUrl; g.coverSrc = src; await cacheCover(g); if (!g.coverUrl && S.set.sgdbKey && S.set.sgdbOn && !g.hasCover) { try { await sgdbAuto(g); } catch (e) { /* без обложки */ } } }
  await saveGame(g);
}
async function refreshFromIgdb(id, src) {
  await flushSheetNow();
  const g = gameById(id); if (!g) return; src = src || srcsOf(g)[0]; if (!g[src + 'Id']) return;
  if (!await confirmBox('Обновить данные из ' + PROV[src].name + '? Название, год, жанры, платформы, описание и обложка будут заменены. Ваш рейтинг (если вы его правили), время и серия сохранятся.', 'Обновить')) return;
  try { await refreshOne(g, src); if (S.sheet) S.sheet.dirty = false; closeSheet(); toast('Обновлено'); render(); } catch (e) { toast(e.message); }
}
async function bulkRefresh(games) {
  const src = S.set.mainSrc, nm = PROV[src].name, list = games.filter(g => g[src + 'Id']);
  if (!list.length) return toast('Среди выбранных нет игр из ' + nm);
  if (!await confirmBox('Обновить из ' + nm + ' игр: ' + list.length + '? Название, год, жанры, платформы, описание и обложка будут заменены (ваши правки жанров и платформ тоже). Рейтинг, время и серия сохранятся. Понадобится примерно ' + list.length * 2 + ' запросов ' + nm + '.', 'Обновить')) return;
  let n = 0;
  for (const g of list) { toast('Обновляю ' + (n + 1) + ' из ' + list.length + ': ' + g.name); try { await refreshOne(g, src); n++; } catch (e) { toast(e.message); break; } await new Promise(r => setTimeout(r, 250)); }
  toast('Обновлено игр: ' + n); S.sel.clear(); S.selMode = false; render();
}

/* ====================== Коллекции ====================== */
const PALETTE = [['', 'Без цвета'], ['#ff7a1a', 'Оранжевый'], ['#3fb7f0', 'Голубой'], ['#2e9e5b', 'Зелёный'], ['#e5484d', 'Красный'], ['#a259ff', 'Фиолетовый'], ['#f5c518', 'Жёлтый'], ['#ff5fa2', 'Розовый'], ['#8b8b94', 'Серый']];
const okColor = c => /^#[0-9a-f]{6}$/i.test(c || '') ? c : '';
const sortedColls = () => S.collections.slice().sort((a, b) => (a.order != null ? a.order : 1e9) - (b.order != null ? b.order : 1e9) || (a.created || 0) - (b.created || 0) || a.name.localeCompare(b.name, 'ru'));
const vmodeOf = k => (S.set.vmode && S.set.vmode[k]) === 'list' ? 'list' : 'tiles';
const modeBtns = k => '<div class="tools" style="margin:0">' + ib('vmode', vmodeOf(k) === 'list' ? 'grid' : 'list', vmodeOf(k) === 'list' ? 'Плитка' : 'Список', false, '', ' data-k="' + k + '"') + (vmodeOf(k) === 'tiles' ? zoomBtn(k) : '') + '</div>';
const boxHtml = (k, inner) => '<div id="tilesBox" class="' + (vmodeOf(k) === 'list' ? 'lrows' : 'tiles z' + colsFor(k)) + '" style="--cols:' + colsFor(k) + '">' + inner + '</div>';
const pctColor = p => 'hsl(' + Math.round(p * 1.2) + ',68%,46%)'; // от красного (0%) к зелёному (100%)
const donePct = list => list.length ? Math.round(list.filter(g => g.done).length * 100 / list.length) : 0;
// одна запись списка коллекций или серий: плитка либо строка. Без кнопки ⋮: меню открывается долгим нажатием
function entryHtml(k, o) {
  const col = okColor(o.color), list = vmodeOf(k) === 'list', key = ' data-' + o.attr + '="' + esc(o.key) + '"';
  const lpm = o.lpm ? ' data-lpm="' + o.lpm + '"' : '';
  const pc = donePct(o.games), pcol = o.count ? pctColor(pc) : 'var(--mut)';
  const meta = '<div class="ct"><span>' + gWord(o.count) + '</span><span title="Завершено" style="color:' + pcol + '">✓ ' + pc + '%</span></div><div class="pb"><i style="width:' + pc + '%;background:' + pcol + '"></i></div>';
  if (list) {
    const u = o.covers[0];
    return '<div class="lrow" data-act="' + o.act + '"' + key + lpm + (col ? ' style="border-left-color:' + col + '"' : '') + '><div class="lth"' + (u ? ' style="background-image:url(\'' + bgu(u) + '\')"' : '') + '></div><div class="lm"><div class="nm">' + esc(o.name) + '</div>' + meta + '</div></div>';
  }
  // обложки растянуты на всю ширину плитки и перекрывают друг друга
  const n = o.covers.length, w = n === 1 ? 61 : n === 2 ? 52 : n === 3 ? 46 : 40, left = i => n === 1 ? (100 - w) / 2 : i * (100 - w) / (n - 1);
  return '<div class="tile" data-act="' + o.act + '"' + key + lpm + (col ? ' style="border-top:4px solid ' + col + '"' : '') + '><div class="mos">' + o.covers.map((u, i) => '<i style="left:' + left(i) + '%;width:' + w + '%;background-image:url(\'' + bgu(u) + '\')"></i>').join('') + '</div>'
    + '<div class="nm">' + esc(o.name) + '</div>' + meta + '</div>';
}
function collTilesHtml() {
  const q = normName(S.cFind), out = [];
  const mk = (id, name, list, c, sys) => {
    const g0 = c && c.coverGame ? gameById(c.coverGame) : null, one = g0 ? coverSrc(g0) : '';
    return entryHtml('coll', { act: 'collOpen', attr: 'id', key: id, name, count: list.length, games: list, color: c ? c.color : '', covers: one ? [one] : list.map(coverSrc).filter(Boolean).slice(0, 4), lpm: 'coll' });
  };
  if (!q || 'все игры'.includes(q)) out.push(mk('all', 'Все игры', S.games, null, true));
  if (!q || 'завершено'.includes(q)) out.push(mk(DONE_ID, 'Завершено', S.games.filter(g => g.done), null, true));
  sortedColls().forEach(c => { if (!q || normName(c.name).includes(q)) out.push(mk(c.id, c.name, gamesIn(c.id), c, false)); });
  return out.join('') || '<p class="hint">Ничего не найдено</p>';
}
function viewCollections() {
  return '<div class="top"><div class="hdr2"><h2>Коллекции</h2>' + modeBtns('coll') + '</div>'
    + '<div class="bar"><div class="sbox"><span>🔍</span><input id="cfind" placeholder="Поиск коллекций" value="' + esc(S.cFind) + '"></div></div></div><div class="scrl">' + dupBanner('colls')
    + boxHtml('coll', collTilesHtml())
    + (S.collections.length ? '<p class="sub" style="text-align:center;margin-top:12px">Долгое нажатие на коллекцию: переименовать, цвет, обложка, выгрузка, удалить</p>' : '')
    + (S.collections.length ? '' : '<p class="hint">Создайте первую коллекцию кнопкой «+» (например, «PS Store», «Хочу пройти», «Любимые»). «Все игры» и «Завершено» есть всегда.</p>') + '</div>';
}
async function collMenu(id) {
  if (id === 'all' || id === DONE_ID) { const nm = id === 'all' ? 'Все игры' : 'Завершено', r0 = await choose({ title: nm, items: [{ id: 'export', label: 'Выгрузить список…' }] }); if (r0 === 'export') openExport(id === 'all' ? S.games : S.games.filter(g => g.done), nm); return; }
  const c = collById(id); if (!c) return;
  const r = await choose({ title: c.name, items: [{ id: 'rename', label: 'Переименовать' }, { id: 'color', label: 'Цвет плитки…' }, { id: 'cover', label: 'Обложка плитки…' }, { id: 'up', label: 'Выше в списке' }, { id: 'down', label: 'Ниже в списке' }, { id: 'export', label: 'Выгрузить список…' }, { id: 'del', label: 'Удалить коллекцию (игры останутся)' }] });
  if (r === 'export') return openExport(gamesIn(id), c.name);
  if (r === 'rename') {
    const n = await promptBox('Название коллекции', c.name);
    if (n && (RESERVED.includes(normName(n)) || S.collections.some(x => x.id !== id && normName(x.name) === normName(n)))) return toast('Коллекция с таким названием уже есть');
    if (n) { c.name = n; await DB.put('collections', c); render(); }
  }
  if (r === 'color') { const v = await choose({ title: 'Цвет коллекции', items: PALETTE.map(x => ({ id: x[0] || '__none', label: x[1] })) }); if (v !== null) { c.color = v === '__none' ? '' : v; await DB.put('collections', c); render(); } }
  if (r === 'cover') {
    const gs = gamesIn(id);
    const v = await choose({ title: 'Обложка плитки', search: gs.length > 12, items: [{ id: '__auto', label: 'Автоматически (мозаика)', accent: true, pin: true }].concat(gs.map(g => ({ id: g.id, label: g.name }))) });
    if (v !== null) { c.coverGame = v === '__auto' ? '' : v; await DB.put('collections', c); render(); }
  }
  if (r === 'up' || r === 'down') {
    const arr = sortedColls(), i = arr.findIndex(x => x.id === id), j = r === 'up' ? i - 1 : i + 1;
    if (j >= 0 && j < arr.length) { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; for (let k = 0; k < arr.length; k++) { arr[k].order = k; await DB.put('collections', arr[k]); } render(); }
  }
  if (r === 'del' && await confirmBox('Удалить коллекцию «' + c.name + '»? Игры останутся в каталоге.', 'Удалить')) {
    S.collections = S.collections.filter(x => x.id !== id); await DB.del('collections', id);
    for (const g of S.games) if (g.collections.includes(id)) { g.collections = g.collections.filter(x => x !== id); await saveGame(g); }
    S.set.f.collections = S.set.f.collections.filter(x => x !== id); saveSet(); render();
  }
}

/* ====================== Разобрать ====================== */
const itemsOf = lid => S.inbox.items.filter(i => i.listId === lid);
const pendingItem = () => S.pending ? S.inbox.items.find(i => i.id === S.pending.itemId) : null;
const effItem = it => {
  const l = S.inbox.lists.find(x => x.id === it.listId) || {};
  return { platform: it.platform || l.platform || '', colls: (it.colls || l.colls || []).filter(id => collById(id)), markDone: it.markDone != null ? !!it.markDone : !!l.markDone };
};
const collNames = ids => ids.map(id => (collById(id) || {}).name).filter(Boolean).join(', ');
async function pickPlatform() {
  const base = ['PC', 'PlayStation 5', 'PlayStation 4', 'PlayStation 3', 'Xbox Series S/X', 'Xbox One', 'Nintendo Switch', 'PS Vita'], have = new Map();
  S.games.forEach(g => (g.platforms || []).forEach(x => have.set(x, (have.get(x) || 0) + 1)));
  const names = Array.from(new Set(base.concat(Array.from(have.keys())))).sort((a, b) => (have.get(b) || 0) - (have.get(a) || 0) || base.indexOf(a) - base.indexOf(b));
  const r = await askChoose({ title: 'Платформа', search: names.length > 10, items: names.map(x => ({ id: x, label: shortPlat(x), sub: shortPlat(x) !== x ? x : '', ico: '🎮' })).concat([{ id: '__other', label: 'Другая…' }, { id: '__none', label: 'Не выбрана' }]) });
  if (r === null) return null; if (r === '__none') return '';
  if (r === '__other') { const v = await askPrompt('Платформа'); return v ? v.trim() : null; }
  return r;
}
// настройки списка/строки применяются к игре при сопоставлении: коллекции и «завершено» добавляются, платформа ставится, если у игры основной ещё нет
function applyDefaults(it, g) {
  const e = effItem(it); let ch = false;
  e.colls.forEach(id => { if (!g.collections.includes(id)) { g.collections.push(id); ch = true; } });
  if (e.markDone && !g.done) { g.done = true; g.doneDate = g.doneDate || todayStr(); ch = true; }
  if (e.platform && !mainOf(g)) { g.mainPlatform = e.platform; if (!g.platforms.includes(e.platform)) g.platforms.push(e.platform); ch = true; }
  if (ch) saveGame(g);
}
async function applyToLinked(l) {
  const done = itemsOf(l.id).filter(i => i.done && gameById(i.gameId)); if (!done.length) return;
  if (!await confirmBox('Применить настройки списка и к уже разобранным играм (' + done.length + ')? Коллекции и «Завершено» добавятся, платформа задастся там, где основной ещё нет.', 'Применить')) return;
  done.forEach(i => applyDefaults(i, gameById(i.gameId))); toast('Готово');
}
async function itemOpts(it) {
  const e = effItem(it);
  const r = await askChoose({ title: it.text, items: [{ id: 'plat', label: 'Платформа…', sub: e.platform ? shortPlat(e.platform) : 'не выбрана' }, { id: 'colls', label: 'Коллекции…', sub: collNames(e.colls) || 'нет' }, { id: 'done', label: 'Завершено: ' + (e.markDone ? 'да' : 'нет'), sub: 'нажмите, чтобы переключить' }, { id: 'reset', label: 'Как у всего списка' }] });
  if (!r) return;
  if (r === 'plat') { const v = await pickPlatform(); if (v === null) return; it.platform = v; }
  else if (r === 'colls') { const v = await pickCollections(it.text, e.colls, true); if (v === null) return; it.colls = v; }
  else if (r === 'done') it.markDone = !e.markDone;
  else { delete it.platform; delete it.colls; delete it.markDone; }
  await DB.put('inboxItems', it); render();
}
function viewInbox() {
  if (S.inboxList && !S.inbox.lists.some(l => l.id === S.inboxList)) S.inboxList = null;
  if (!S.inboxList) {
    const cards = S.inbox.lists.map(l => {
      const it = itemsOf(l.id), left = it.filter(i => !i.done).length, pct = it.length ? Math.round((it.length - left) * 100 / it.length) : 0;
      return '<div class="lcard" data-act="listOpen" data-id="' + l.id + '"><div style="flex:1;min-width:0"><div class="nm">' + esc(l.name) + '</div><div class="ct">осталось ' + left + ' из ' + it.length + '</div><div class="pb"><i style="width:' + pct + '%"></i></div></div><button class="mn2" data-act="listMenu" data-id="' + l.id + '">⋮</button></div>';
    }).join('');
    return '<div class="hdr2"><h2>Разобрать</h2></div>' + (cards || '<p class="hint">Здесь живут списки игр, которые нужно разобрать: вставьте названия из заметок или Steam, а потом по очереди находите их в IGDB.<br>Нажмите «+», чтобы создать список.</p>');
  }
  const l = S.inbox.lists.find(x => x.id === S.inboxList), all = itemsOf(l.id), left = all.filter(i => !i.done).length;
  const list = S.showDone ? all : all.filter(i => !i.done);
  const row = i => {
    const g = i.done ? gameById(i.gameId) : null;
    return '<div class="it' + (i.done ? ' done' : '') + (S.inSel.has(i.id) ? ' isel' : '') + '"' + (i.done ? '' : ' data-iid="' + i.id + '" data-lpm="item"') + '><div class="tx" data-act="itOpen" data-id="' + i.id + '">' + (S.inSelMode && !i.done ? '<span class="ichk">' + (S.inSel.has(i.id) ? '✓' : '') + '</span>' : '') + (i.done ? '<span class="okc">✓</span> ' : '') + esc(i.text)
      + (i.done ? '<div class="sub">→ ' + (g ? esc(g.name) : 'игра удалена из каталога') + '</div>' : (() => { const e = effItem(i), parts = [i.year || '', i.hours ? i.hours + ' ч' : '', i.failed ? '⚠ не распознано' : '', i.doubt ? '❓ есть сомнения: выберите из вариантов' : '', e.platform ? '🎮 ' + shortPlat(e.platform) : '', collNames(e.colls), e.markDone ? '✓ завершено' : ''].filter(Boolean); return parts.length ? '<div class="sub">' + esc(parts.join(' · ')) + '</div>' : ''; })()) + '</div><div class="ia">'
      + (i.done ? '' : (i.doubt ? '<button data-act="itPick" data-id="' + i.id + '" title="Выбрать из вариантов">❓</button>' : '') + '<button data-act="itOpts" data-id="' + i.id + '" title="Платформа, коллекции, завершено для этой строки">⚙</button><button data-act="itMatch" data-id="' + i.id + '" title="Сопоставить с игрой из каталога">🔗</button><button data-act="itEdit" data-id="' + i.id + '" title="Изменить">✎</button>')
      + '<button data-act="itDel" data-id="' + i.id + '" title="Удалить">🗑</button></div></div>';
  };
  return '<div class="hdr2"><div style="display:flex;align-items:center;gap:10px;min-width:0"><button class="btn" data-act="listBack">←</button><h2 style="font-size:19px">' + esc(l.name) + '</h2></div><span class="sub">осталось ' + left + ' из ' + all.length + '</span></div>'
    + '<div class="sub" style="margin:6px 2px 2px">Для всех строк этого списка (в строке можно изменить отдельно, кнопка ⚙):</div><div class="sec lstdef" style="padding:4px 12px">'
    + '<div class="lrw"><span>Платформа</span><button class="btn" data-act="lstPlat">' + (l.platform ? esc(shortPlat(l.platform)) : 'не выбрана') + '</button></div>'
    + '<div class="lrw"><span>Коллекции</span><button class="btn" data-act="lstColls">' + esc(collNames((l.colls || []).filter(id => collById(id))) || 'не выбраны') + '</button></div>'
    + '<div class="lrw"><span>Завершено</span><button class="p' + (l.markDone ? ' on' : '') + '" data-act="lstDone">' + (l.markDone ? '✓ да' : 'нет') + '</button></div></div>'
    + '<div class="addrow"><input id="itNew" placeholder="Название игры…"><button class="btn acc" data-act="itAdd">Добавить</button></div>'
    + '<div class="toolbar"><button class="btn acc" data-act="itAuto">⚡ Разобрать автоматически</button><button class="btn" data-act="itPaste">Вставить список…</button><button class="btn" data-act="itToggleDone">' + (S.showDone ? 'Скрыть разобранные' : 'Показать разобранные') + '</button></div>'
    + '<div class="sec" style="padding:4px 12px">' + (list.map(row).join('') || '<p class="sub" style="padding:14px">Список пуст.</p>') + '</div><p class="sub">Нажмите на название, чтобы найти игру в источнике поиска. 🔗 - сопоставить с игрой, которая уже есть в каталоге. Долгое нажатие на строку включает выбор строк: можно сразу задать платформу, коллекции и «Завершено» для нескольких.</p>';
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
async function addItems(listId, lines) { return addParsed(listId, lines.map(parseLine).filter(Boolean)); }
async function addParsed(listId, rows) {
  const have = new Set(itemsOf(listId).map(i => normName(i.text))); let n = 0;
  for (const p of rows) {
    if (!p || have.has(normName(p.text))) continue; have.add(normName(p.text));
    const it = { id: uid(), listId, text: p.text, year: p.year, hours: p.hours, done: false, gameId: '', igdbId: 0, created: Date.now() + n }; if (p.x) it.x = p.x;
    S.inbox.items.push(it); await DB.put('inboxItems', it); n++;
  }
  return n;
}
// данные из строки (например, из выгрузки, которую дополнил ИИ) заполняют только пустое в карточке игры
function applyExtra(it, g) {
  const x = it.x; let ch = false;
  if (!g.year && it.year) { g.year = it.year; ch = true; } if (!g.time && it.hours) { g.time = it.hours; ch = true; }
  if (x) {
    if (!g.rating && x.rating) { g.rating = x.rating; ch = true; }
    (x.platforms || []).forEach(pl => { if (!g.platforms.includes(pl)) { g.platforms.push(pl); ch = true; } });
    if (!mainOf(g) && x.mainPlatform) { g.mainPlatform = x.mainPlatform; if (!g.platforms.includes(x.mainPlatform)) g.platforms.push(x.mainPlatform); ch = true; }
    if (!g.genres.length && (x.genres || []).length) { g.genres = x.genres.slice(); ch = true; }
    if (!g.series && x.series) { g.series = canonSeries(x.series); ch = true; }
    (x.colls || []).forEach(nm => {
      let c = S.collections.find(k => normName(k.name) === normName(nm));
      if (!c && !RESERVED.includes(normName(nm))) { c = { id: uid(), name: nm, created: Date.now() }; S.collections.push(c); DB.put('collections', c); }
      if (c && !g.collections.includes(c.id)) { g.collections.push(c.id); ch = true; }
    });
    if (x.done && !g.done) { g.done = true; g.doneDate = g.doneDate || x.doneDate || todayStr(); ch = true; }
  }
  if (ch) saveGame(g);
}
function bestCatalog(it) {
  if (it.x) { const gx = (it.x.gid && gameById(it.x.gid)) || S.games.find(g => (it.x.igdbId && g.igdbId === it.x.igdbId) || (it.x.rawgId && g.rawgId === it.x.rawgId)); if (gx) return gx; } // id из выгрузки точнее названия
  let best = null, bs = 0;
  for (const g of S.games) {
    let sc = similarity(it.text, g.name);
    if (it.year && g.year) sc += Math.abs(it.year - g.year) <= 1 ? 0.03 : -0.2;
    if (sc > bs) { bs = sc; best = g; }
  }
  return bs >= 0.9 ? best : null;
}
async function autoResolve(listId) {
  const items = itemsOf(listId).filter(i => !i.done);
  if (!items.length) return toast('Все строки уже разобраны');
  let useIgdb = PROV[S.set.mainSrc].ready();
  if (useIgdb) useIgdb = await confirmBox('Сначала сопоставлю строки с каталогом. Для остальных поищу игру в ' + PROV[S.set.mainSrc].name + ' и добавлю найденные (совпадение от 85%; при сомнениях 50-85% строка получит пометку ❓ для выбора из списка). «Отмена»: только по каталогу.', 'Искать в ' + PROV[S.set.mainSrc].name);
  let nCat = 0, nRaw = 0, nDoubt = 0, skipped = 0, stop = false; const bad = [];
  const showProg = () => { const m = openModal(); m.innerHTML = '<h4>Разбираю список…</h4><p class="sub" id="apTxt">0 из ' + items.length + '</p><div class="acts"><span data-x="stop">Остановить</span></div>'; m.onclick = e => { if (e.target.closest('[data-x]')) stop = true; }; modalCancel = () => { stop = true; }; };
  showProg(); // окно выбора платформы закрывает это окно, поэтому после него оно открывается заново
  for (let k = 0; k < items.length && !stop; k++) {
    const it = items[k], tx = $('#apTxt'); if (tx) tx.textContent = (k + 1) + ' из ' + items.length + ': ' + it.text;
    const g = bestCatalog(it); if (g) { linkItem(it, g, true); nCat++; continue; }
    const rid0 = it.x && (it.x.igdbId ? 'igdb:' + it.x.igdbId : it.x.rawgId ? 'rawg:' + it.x.rawgId : '');
    if (rid0 && PROV[parseRid(rid0).src].ready()) { // в строке есть id источника: добавляем эту игру точно
      try { const gg = await addFromIgdb(rid0, [], { platform: effItem(it).platform }); if (!modalEl) showProg(); if (gg) { linkItem(it, gg, true); nRaw++; continue; } if (gg === false) { skipped++; continue; } } catch (e) { /* ищем по названию */ }
    }
    if (useIgdb && !blockFor(S.set.mainSrc)) {
      try {
        const found = S.set.mainSrc === 'rawg' ? (await rawg('/games', { search: it.text, page_size: 5 })).results.map(x => Object.assign(x, { _src: 'rawg' })) : (await igdb('/games', 'search "' + igdbQuote(it.text) + '"; fields ' + IGDB_FIELDS + '; where ' + GAME_TYPES + '; limit 5;')).map(x => Object.assign(x, { _src: 'igdb' }));
        const ranked = found.map(mapItem).map(x => ({ x, sc: similarity(it.text, x.name) + (it.year && x.year ? (Math.abs(it.year - x.year) <= 1 ? 0.04 : -0.2) : 0) })).sort((a, b) => b.sc - a.sc), best = ranked[0];
        if (best && best.sc >= 0.5 && best.sc < 0.85) { // игра нашлась, но есть сомнения: выбор вручную из вариантов
          it.doubt = true; it.failed = false; it.cands = ranked.filter(r => r.sc >= 0.5).slice(0, 5).map(r => ({ rid: r.x.rid, name: r.x.name, year: r.x.year, platforms: r.x.platforms.slice(0, 3) })); await DB.put('inboxItems', it); nDoubt++;
          await new Promise(r => setTimeout(r, 300)); continue;
        }
        if (best && best.sc >= 0.85) { const gg = await addFromIgdb(best.x.rid, [], { platform: effItem(it).platform }); if (!modalEl) showProg(); if (gg) { linkItem(it, gg, true); nRaw++; await new Promise(r => setTimeout(r, 300)); continue; } if (gg === false) { skipped++; continue; } }
      } catch (e) { if (blockFor(S.set.mainSrc)) useIgdb = false; }
      await new Promise(r => setTimeout(r, 300));
    }
    it.failed = true; await DB.put('inboxItems', it); bad.push(it.text);
  }
  closeModal();
  const r = openModal();
  r.innerHTML = '<h4>Разбор завершён</h4><p class="sub">Из каталога: <b>' + nCat + '</b>, добавлено из IGDB: <b>' + nRaw + '</b>, не распознано: <b>' + bad.length + '</b>' + (nDoubt ? ', с сомнениями: <b>' + nDoubt + '</b> (отмечены ❓, выберите вариант вручную)' : '') + (skipped ? ', пропущено без платформы: <b>' + skipped + '</b>' : '') + (stop ? ' (остановлено)' : '') + '</p>'
    + (bad.length ? '<div class="sub" style="max-height:200px;overflow:auto;white-space:pre-wrap">' + esc(bad.slice(0, 40).join('\n')) + (bad.length > 40 ? '\n…' : '') + '</div><p class="sub">Эти строки остались в списке с пометкой ⚠: разберите их вручную (нажмите на название) или исправьте текст.</p>' : '')
    + '<div class="acts"><span data-x="ok">OK</span></div>';
  modalCancel = () => closeModal(); r.onclick = e => { if (e.target.closest('[data-x]')) closeModal(); };
  render();
}
function pasteModal(listId) {
  const m = openModal();
  m.innerHTML = '<h4>Вставить список игр</h4><p class="sub">Каждая строка - одна игра. Можно вставить и таблицу из выгрузки (с заголовками): недостающие данные заполнятся в карточках. Вставьте текст в поле (долгое нажатие, затем «Вставить»).</p><label class="field"><textarea id="pasteT" style="min-height:160px"></textarea></label><div class="acts"><span data-x="cancel">Отмена</span><span data-x="ok">Добавить</span></div>';
  modalCancel = () => closeModal();
  m.onclick = async e => {
    const x = e.target.closest('[data-x]'); if (!x) return; const ta = $('#pasteT', m);
    if (x.dataset.x === 'ok') { const t = ta.value; closeModal(); const n = await addParsed(listId, parseInboxText(t)); toast('Добавлено строк: ' + n); render(); }
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
function linkItem(it, g, quiet) {
  applyDefaults(it, g); applyExtra(it, g);
  it.done = true; it.failed = false; it.doubt = false; delete it.cands; it.gameId = g.id; it.igdbId = g.igdbId || 0; it.rawgId = g.rawgId || 0; DB.put('inboxItems', it);
  const pend = S.pending && S.pending.itemId === it.id ? S.pending : null, sc0 = S.tab === 'inbox' ? $('#view').scrollTop : null;
  if (pend) S.pending = null;
  if (quiet) return;
  toast('✓ Разобрано: ' + g.name); S.tab = 'inbox'; render();
  if (pend) restoreInbox(pend); else if (sc0 !== null) $('#view').scrollTop = sc0;
}
// возврат в разбор на то место, откуда открыли поиск
function restoreInbox(p) {
  const v = $('#view'); if (!v || !p) return; if (p.scroll) v.scrollTop = p.scroll;
  const row = p.itemId ? $('[data-id="' + p.itemId + '"]') : null; if (row && row.scrollIntoView) row.scrollIntoView({ block: 'center' });
}
function backToInbox() { const p = S.pending; S.pending = null; S.tab = 'inbox'; render(); restoreInbox(p); }
function tryLinkPending(g) { const it = pendingItem(); if (!it) return false; linkItem(it, g); return true; }

/* ====================== Статистика ====================== */
function barList(title, entries, k) {
  const mx = Math.max(1, ...entries.map(e => e[1]));
  return '<h3>' + title + '</h3><div class="sec">' + (entries.length ? entries.map(e => '<div class="st-row' + (k ? ' link' : '') + '"' + (k ? ' data-act="statGo" data-k="' + k + '" data-v="' + esc(String(e[2] != null ? e[2] : e[0])) + '"' : '') + '><span class="st-l">' + esc(e[0]) + '</span><div class="st-b"><i style="width:' + Math.round(e[1] * 100 / mx) + '%"></i></div><b>' + e[1] + '</b></div>').join('') : '<p class="sub">Нет данных</p>') + '</div>';
}
function viewStats() {
  const G = S.games, done = G.filter(g => g.done), yr = String(new Date().getFullYear());
  const cnt = arr => { const m = new Map(); arr.forEach(x => { if (hasVal(x)) m.set(x, (m.get(x) || 0) + 1); }); return Array.from(m.entries()); };
  const top = (e, n) => e.sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), 'ru')).slice(0, n);
  const doneYear = done.filter(g => g.doneDate && g.doneDate.slice(0, 4) === yr).length;
  const hours = Math.round(done.reduce((t, g) => t + (g.time || 0), 0));
  const card = (n, l, k) => '<div class="stc' + (k ? ' link' : '') + '"' + (k ? ' data-act="statGo" data-k="' + k + '"' : '') + '><b>' + n + '</b><span>' + l + '</span></div>';
  return '<div class="hdr2"><div style="display:flex;align-items:center;gap:10px"><button class="btn" data-act="tab" data-tab="settings">←</button><h2 style="font-size:20px">Статистика</h2></div></div>'
    + '<div class="stg">' + card(G.length, 'игр в каталоге') + card(done.length + (G.length ? ' (' + Math.round(done.length * 100 / G.length) + '%)' : ''), 'завершено', 'done') + card(doneYear, 'завершено в ' + yr) + card(hours, 'часов (по времени прохождения)') + '</div>'
    + barList('Завершено по годам', cnt(done.map(g => g.doneDate ? g.doneDate.slice(0, 4) : 'без даты')).sort((a, b) => String(b[0]).localeCompare(String(a[0]))), 'done')
    + barList('Жанры', top(cnt([].concat(...G.map(g => g.genres || []))), 10), 'genres') + barList('Платформы', top(cnt([].concat(...G.map(g => g.platforms || []))), 10), 'platforms')
    + barList('Годы выпуска', top(cnt(G.map(g => g.year || null)), 10), 'years') + barList('Коллекции', top(S.collections.map(c => [c.name, gamesIn(c.id).length, c.id]), 10), 'collections');
}

/* ====================== Серии ====================== */
function seriesGroups() { const m = new Map(); S.games.forEach(g => { const k = g.series || ''; if (!m.has(k)) m.set(k, []); m.get(k).push(g); }); return m; }
function seriesTilesHtml() {
  const m = seriesGroups(), q = normName(S.sFind), none = m.get('') || [];
  const names = Array.from(m.keys()).filter(n => n && (!q || normName(n).includes(q))).sort((a, b) => a.localeCompare(b, 'ru'));
  const mk = (key, list, menu) => entryHtml('series', { act: 'serOpen', attr: 'name', key, name: key || 'Без серии', count: list.length, games: list, color: '', covers: list.map(coverSrc).filter(Boolean).slice(0, 4), lpm: 'ser' });
  return names.map(n => mk(n, m.get(n), true)).join('') + (none.length && (!q || 'без серии'.includes(q)) ? mk('', none, false) : '') || '<p class="hint">Ничего не найдено</p>';
}
function viewSeries() {
  const hasNames = Array.from(seriesGroups().keys()).some(Boolean);
  return '<div class="top"><div class="hdr2"><h2>Серии игр</h2>' + modeBtns('series') + '</div>'
    + '<div class="bar"><div class="sbox"><span>🔍</span><input id="sfind" placeholder="Поиск серий" value="' + esc(S.sFind) + '"></div></div></div><div class="scrl">' + dupBanner('series')
    + boxHtml('series', seriesTilesHtml())
    + (hasNames ? '<p class="sub" style="text-align:center;margin-top:12px">Долгое нажатие на серию: выгрузить, переименовать или убрать</p>' : '')
    + (hasNames ? '' : '<p class="hint">Серий пока нет. Они появляются, когда у игры указана серия: при добавлении из IGDB она заполняется сама, а вручную её можно вписать в карточке игры.</p>') + '</div>';
}
async function serMenu(name) {
  if (!name) { const r0 = await choose({ title: 'Без серии', items: [{ id: 'export', label: 'Выгрузить список…' }] }); if (r0 === 'export') openExport(S.games.filter(g => !g.series), 'Без серии'); return; }
  const r = await choose({ title: name, items: [{ id: 'export', label: 'Выгрузить список…' }, { id: 'rename', label: 'Переименовать (или объединить с другой серией)' }, { id: 'del', label: 'Убрать серию у всех игр (игры останутся)' }] });
  const games = S.games.filter(g => g.series === name), f = S.set.f;
  if (r === 'export') return openExport(games, name);
  if (r === 'rename') {
    let n = await promptBox('Название серии', name); if (n) n = normName(n) === normName(name) ? n.trim() : canonSeries(n);
    if (n && n !== name) { for (const g of games) { g.series = n; await saveGame(g); } f.series = f.series.map(x => x === name ? n : x); saveSet(); render(); }
  }
  if (r === 'del' && await confirmBox('Убрать серию «' + name + '» у игр: ' + games.length + '? Сами игры останутся в каталоге.', 'Убрать')) {
    for (const g of games) { g.series = ''; await saveGame(g); } f.series = f.series.filter(x => x !== name); saveSet(); render();
  }
}

/* ====================== Поиск IGDB ====================== */
function searchFilterCount() { const f = S.search.f; return (f.genre ? 1 : 0) + (f.platform ? 1 : 0) + (f.year ? 1 : 0) + (f.minRating ? 1 : 0); }
const validAddColls = () => (S.search.addColls = S.search.addColls.filter(id => id === DONE_ID || collById(id)));
const SEARCH_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>';
// метка источника: цветная рамка, со ссылкой на страницу игры, если она известна
function srcBadge(src, url) {
  const c = PROV[src].color, st = 'color:' + c + ';border-color:' + c;
  return url ? '<a class="srcb" style="' + st + '" data-act="openUrl" data-u="' + esc(url) + '">' + PROV[src].name + ' ↗</a>' : '<span class="srcb" style="' + st + '">' + PROV[src].name + '</span>';
}
function viewSearch() {
  const pit = pendingItem();
  const banner = pit ? '<div class="banner">Разбор: «' + esc(pit.text) + '» - выберите игру<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="pendingMatch">Уже в базе</button><button class="btn" data-act="pendingCancel">Отмена</button></div></div>' : '';
  const ret = S.retGame && gameById(S.retGame.id) ? '<div class="banner">Поиск из карточки «' + esc(gameById(S.retGame.id).name) + '»<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="retGame">← Вернуться в карточку</button></div></div>' : '';
  return '<div class="top">' + banner + ret + blockBanner(true, S.search.src) + '<div class="bar"><div class="sbox"><span>🔍</span><input id="sq" placeholder="Поиск в ' + PROV[S.search.src].name + '" value="' + esc(S.search.q) + '"><button class="x" data-act="clearSQ">✕</button></div></div>'
    + '<div class="tools" id="sTools"></div><div class="chips actv" id="sActive"></div></div><div class="scrl" id="srBody"></div>';
}
function renderSearchHead() {
  const s = S.search, f = s.f, chips = [], ac = validAddColls(), fc = searchFilterCount();
  const t = $('#sTools'); if (t) t.innerHTML = '<button class="ib srcsw" data-act="sSrcSwitch" title="Переключить источник поиска" style="color:' + PROV[s.src].color + ';border-color:' + PROV[s.src].color + '"><b>' + PROV[s.src].name + '</b></button>' + ib('sFilters', 'filter', 'Фильтры', fc > 0, fc ? '<span class="cnt">' + fc + '</span>' : '') + ib('openAddColls', 'coll', 'Добавлять в…', ac.length > 0, ac.length ? '<span class="cnt">' + ac.length + '</span>' : '') + ib('vmode', vmodeOf('search') === 'list' ? 'grid' : 'list', vmodeOf('search') === 'list' ? 'Плитка' : 'Список', false, '', ' data-k="search"') + (vmodeOf('search') === 'tiles' ? zoomBtn('search') : '');
  if (ac.length) chips.push('<span class="sub" style="align-self:center">Добавлять в:</span>' + ac.map(id => '<button class="chip green" data-act="acRm" data-id="' + id + '">' + esc(id === DONE_ID ? 'Завершено' : collById(id).name) + ' ✕</button>').join(''));
  if (f.genre) chips.push('<button class="chip" data-act="sRm" data-k="genre">' + esc(f.genreName) + ' ✕</button>');
  if (f.platform) chips.push('<button class="chip" data-act="sRm" data-k="platform">' + esc(f.platformName) + ' ✕</button>');
  if (f.year) chips.push('<button class="chip" data-act="sRm" data-k="year">' + f.year + ' ✕</button>');
  if (f.minRating) chips.push('<button class="chip" data-act="sRm" data-k="minRating">от ★' + f.minRating + ' ✕</button>');
  const a = $('#sActive'); if (a) a.innerHTML = chips.join('');
}
function openAddCollSheet() {
  const a = validAddColls();
  const chip = (id, name, n, col, extra) => '<button class="p' + extra + (a.includes(id) ? ' on' : '') + '"' + (okColor(col) ? ' style="border-color:' + okColor(col) + '"' : '') + ' data-act="acChip" data-id="' + id + '">' + esc(name) + '<b>' + n + '</b></button>';
  sheetKey = 'addcolls'; openSheet('<div class="hdr2"><h2>Добавлять в коллекции</h2><button class="btn" data-act="acClear">Снять выбор</button></div>'
    + '<p class="sub">Выберите коллекции: тап по игре в результатах сразу добавит её в них. Без выбора тап открывает карточку игры. Лупа в углу карточки всегда открывает подробности.</p>'
    + (S.collections.length > 8 ? '<label class="field"><input id="cpq" placeholder="Поиск коллекции" autocomplete="off"></label>' : '')
    + '<div class="chips" id="collList">' + chip(DONE_ID, '✓ Завершено', S.games.filter(g => g.done).length, '', ' done') + sortedColls().map(c => chip(c.id, c.name, gamesIn(c.id).length, c.color, '')).join('') + '<button class="p new" data-act="acNew">＋ новая</button></div>'
    + '<button class="btn acc" style="width:100%;margin-top:10px" data-act="closeSheet">Готово</button>');
}
// тап по игре в результатах при выбранных коллекциях: добавляем сразу
async function quickTap(rid, ids) {
  if (quickBusy.has(rid)) return; quickBusy.add(rid);
  const card = $('[data-act="igdbTap"][data-rid="' + rid + '"]'); if (card && card.classList) card.classList.add('busy');
  try {
    const pit = pendingItem(), g = await addFromIgdb(rid, ids, pit ? { platform: effItem(pit).platform } : {});
    if (g) { toast('Добавлено: ' + g.name + ' → ' + ids.map(id => id === DONE_ID ? 'Завершено' : (collById(id) || {}).name).join(', ')); if (tryLinkPending(g)) return; }
  } catch (e) { toast(e.message); } finally { quickBusy.delete(rid); }
  renderSearchBody();
}
function renderSearchBody() {
  const s = S.search, el = $('#srBody'); if (!el) return;
  renderSearchHead();
  let h = '';
  if (s.mode === 'series') h += '<div class="hdr2"><h2 style="font-size:17px">Игры серии: ' + esc(s.title) + '</h2><button class="btn" data-act="sBack">← Назад</button></div>';
  if (blockFor(s.src)) h += blockBanner(true, s.src);
  else if (!PROV[s.src].ready()) h += '<div class="hint">' + PROV[s.src].noKeys + '<br><br><button class="btn acc" data-act="tab" data-tab="settings">Открыть настройки</button></div>';
  else if (!s.results.length && !s.loading) h += '<div class="hint">' + (s.started ? 'Ничего не найдено в ' + PROV[s.src].name + '.<br><br><button class="btn" data-act="sSrcSwitch">Искать в ' + PROV[otherSrc(s.src)].name + '</button>' : 'Введите название игры или выберите фильтры') + '</div>';
  else {
    const row = vmodeOf('search') === 'list';
    h += row ? '<div class="srl">' + s.results.map(it => {
      const inCat = !!gameByRid(it.rid);
      return '<div class="srow" data-act="igdbTap" data-rid="' + it.rid + '"><div class="sth"' + (it.cover ? ' style="background-image:url(\'' + bgu(thumbUrl(it.cover)) + '\')"' : '') + '></div><div class="sm"><div class="nm">' + esc(it.name) + '</div><div class="m">' + meta(it) + (it.time ? ' · ⏱ ' + it.time + 'ч' : '') + '</div></div>' + (inCat ? '<span class="ok2">✓</span>' : '') + '<button class="qa" data-act="openIgdb" data-rid="' + it.rid + '" aria-label="Подробнее">' + SEARCH_SVG + '</button></div>';
    }).join('') + '</div>' : '<div class="grid z' + colsFor('search') + '" style="--cols:' + colsFor('search') + '">' + s.results.map(it => {
      const inCat = !!gameByRid(it.rid);
      return '<div class="card" data-act="igdbTap" data-rid="' + it.rid + '"><div class="cv' + (it.cover ? '' : ' nocover') + '"' + (it.cover ? ' style="background-image:url(\'' + bgu(thumbUrl(it.cover)) + '\')"' : '') + '>'
        + (it.time ? '<span class="badge">⏱ ' + it.time + 'ч</span>' : '') + (inCat ? '<span class="ok">✓</span>' : '') + '<button class="qa" data-act="openIgdb" data-rid="' + it.rid + '" aria-label="Подробнее">' + SEARCH_SVG + '</button>' + '</div><div class="t">' + esc(it.name) + '</div><div class="m">' + meta(it) + '</div></div>';
    }).join('') + '</div>';
    h += '<div class="status">' + (s.loading ? 'Загрузка…' : (s.count ? 'Найдено: ' + s.count + ', показано: ' + s.results.length : '')) + '</div>';
    if (s.hasMore && !s.loading) h += '<div class="status"><button class="btn" data-act="sMore">Показать ещё</button></div><div id="sentinel" style="height:2px"></div>';
  }
  if (s.loading && !s.results.length) h += '<div class="status">Загрузка…</div>';
  el.innerHTML = h;
  const sen = $('#sentinel');
  if (sen && 'IntersectionObserver' in window) { const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { io.disconnect(); runSearch(false); } }, { root: $('#srBody'), rootMargin: '300px' }); io.observe(sen); }
}
async function runSearch(reset) {
  const s = S.search;
  if (reset) { s.results = []; s.page = 0; s.hasMore = true; s.count = 0; s.token++; s.loading = false; s.mode = 'search'; const sb = $('#srBody'); if (sb) sb.scrollTop = 0; }
  if (s.loading || !s.hasMore) return;
  const f = s.f;
  if (!s.q.trim() && !f.genre && !f.platform && !f.year) { s.started = false; s.results = []; renderSearchBody(); return; }
  if (!PROV[s.src].ready()) { renderSearchBody(); return; }
  const token = s.token; s.loading = true; s.started = true; renderSearchBody();
  try {
    let added = 0, tries = 0;
    do { // с фильтром по рейтингу страница может оказаться почти пустой - добираем следующие
      const d = await (s.src === 'rawg' ? rawgPage : igdbPage)(s.q.trim(), f, s.page);
      if (token !== s.token) return;
      s.count = d.count || s.count; s.page++; s.hasMore = !!d.next;
      const items = d.results.map(mapItem).filter(x => x.rating >= f.minRating); s.results.push(...items); added += items.length; tries++;
    } while (f.minRating && added < 12 && s.hasMore && tries < 5);
  } catch (e) { if (token === s.token) { toast(e.message); s.hasMore = false; } }
  finally { if (token === s.token) { s.loading = false; renderSearchBody(); } }
}
async function showSeries(rid, title) {
  const s = S.search, { src, id } = parseRid(rid); s.src = src; s.token++; s.mode = 'series'; s.title = title; s.results = []; s.hasMore = false; s.loading = true; s.started = true; S.tab = 'search'; closeSheet(); render();
  try {
    if (src === 'rawg') { const d = await rawg('/games/' + id + '/game-series', { page_size: 40 }); d.results.forEach(x => { x._src = 'rawg'; }); s.results = d.results.map(mapItem); s.count = d.count; }
    else {
      const { d } = await fetchDetails(rid), col = (d.collections || [])[0];
      const list = col ? await igdb('/games', 'fields ' + IGDB_FIELDS + '; where collections = (' + col.id + ') & id != ' + id + ' & ' + GAME_TYPES + '; limit 40;') : [];
      list.forEach(x => { x._src = 'igdb'; }); await attachTimes(list); s.results = list.map(mapItem); s.count = list.length;
    }
  } catch (e) { toast(e.message); }
  s.loading = false; renderSearchBody();
}
async function openIgdbSheet(rid, keep) {
  if (!keep || !S.rs || S.rs.rid !== rid) {
    S.rs = { rid, colls: validAddColls().slice() }; const p0 = pendingItem(); // для строки разбора сразу отмечены коллекции и «Завершено» из настроек списка
    if (p0) { const e = effItem(p0); e.colls.forEach(id => { if (!S.rs.colls.includes(id)) S.rs.colls.push(id); }); if (e.markDone && !S.rs.colls.includes(DONE_ID)) S.rs.colls.push(DONE_ID); }
  }
  const it = S.search.results.find(x => x.rid === rid) || { rid, src: parseRid(rid).src, name: '', platforms: [], genres: [] };
  const pit = pendingItem();
  const draw = (d, ser) => {
    const cat = gameByRid(rid), cover = (d && (d._src === 'rawg' ? d.background_image : coverOf(d, 'cover_big'))) || it.cover;
    const item = d ? mapItem(d) : it;
    const inColls = cat ? cat.collections.map(id => collById(id)).filter(Boolean) : [];
    sheetKey = 'igdb'; openSheet('<div class="hero"><div class="cv' + (cover ? '' : ' nocover') + '"' + (cover ? ' style="background-image:url(\'' + bgu(thumbUrl(cover)) + '\')"' : '') + '></div><div style="flex:1;min-width:0"><h2>' + esc(item.name) + ' <span class="y">' + (item.year || '') + '</span></h2>'
      + '<div class="m" style="font-size:14px">' + (item.rating ? '<span class="st">★ ' + item.rating + '</span>' : '') + (item.time ? ' · ⏱ ' + item.time + ' ч' : '') + '</div>'
      + (ser && ser.series ? '<div class="sub" style="margin-top:6px">Серия: ' + esc(ser.series) + '</div>' : '') + '</div></div>'
      + '<div class="chips" style="margin-top:12px">' + item.genres.map(x => '<button class="tag" data-act="rsGenre" data-v="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>'
      + '<div class="chips">' + item.platforms.map(x => '<button class="tag m2" data-act="rsPlat" data-v="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>'
      + '<div class="srcrow">' + srcBadge(parseRid(rid).src, cat ? cat[parseRid(rid).src + 'Url'] : '') + (cat ? '<span class="sub">В каталоге' + (mainOf(cat) ? ' · основная платформа: ' + esc(shortPlat(mainOf(cat))) : '') + '</span>' : '') + '</div>'
      + '<h3>Коллекции</h3><div class="chips" id="rsColls">'
      + (() => { const on = cat ? cat.done : S.rs.colls.includes(DONE_ID); return '<button class="p' + (on ? ' on' : '') + '" data-act="rsChip" data-id="' + DONE_ID + '">' + (on ? '✓ ' : '') + 'Завершено</button>'; })()
      + sortedColls().map(c => '<button class="p' + ((cat ? cat.collections : S.rs.colls).includes(c.id) ? ' on' : '') + '" data-act="rsChip" data-id="' + c.id + '">' + esc(c.name) + '</button>').join('') + '<button class="p new" data-act="rsNewColl">＋ новая</button></div>'
      + '<div class="toolbar">' + (cat ? (pit ? '<button class="btn acc" data-act="rsLink" data-rid="' + rid + '">✓ Сопоставить с разбором</button>' : '') + '<button class="btn" data-act="openGameFromIgdb" data-id="' + cat.id + '">Открыть в каталоге</button>'
        : '<button class="btn acc" data-act="rsAdd" data-rid="' + rid + '">' + (pit ? '＋ Добавить и сопоставить' : '＋ Добавить в каталог') + '</button>')
      + (ser && ser.count ? '<button class="btn" data-act="rsSeries" data-rid="' + rid + '" data-t="' + esc(ser.series || item.name) + '">Игры серии (' + ser.count + ')</button>' : '') + '</div>'
      + '<h3>Скриншоты</h3><div id="shotsBox"><button class="btn" data-act="loadShots" data-rid="' + rid + '">Посмотреть скриншоты</button></div>');
  };
  draw(null, null);
  try { const r = await fetchDetails(rid); draw(r.d, { series: r.series, count: r.seriesCount }); } catch (e) { toast(e.message); }
}
async function loadShots(rid, save) {
  const box = $('#shotsBox'); if (!box) return;
  box.innerHTML = '<div class="status">Загрузка скриншотов…</div>';
  try {
    const { src, id } = parseRid(rid); let list;
    if (src === 'rawg') { const r = await rawg('/games/' + id + '/screenshots', { page_size: 40 }); list = (r.results || []).map(x => ({ image: String(x.image).replace('/media/screenshots/', '/media/resize/640/-/screenshots/') })); }
    else { const r = await igdb('/screenshots', 'fields image_id; where game = ' + id + '; limit 40;'); list = r.map(x => ({ image: igdbImg(x.image_id, 'screenshot_big') })); }
    S.igdbShots = list.map(x => x.image);
    box.innerHTML = list.length ? (save ? '<div class="toolbar"><button class="btn" data-act="shotSaveAll">Сохранить все в базу</button></div>' : '') + '<div class="shotv">' + list.map((x, i) => '<div class="shw"><img src="' + esc(src === 'rawg' ? x.image : sizeUrl(x.image, 'screenshot_med')) + '" data-act="shot" data-g="igdb" data-i="' + i + '" data-full="' + esc(x.image) + '" loading="lazy">' + (save ? '<button class="sv" data-act="shotSave" data-i="' + i + '">＋ Сохранить</button>' : '') + '</div>').join('') + '</div>' : '<div class="status">Скриншотов нет</div>';
    if (save) drawShots();
  } catch (e) { box.innerHTML = '<div class="status">' + esc(e.message) + '</div>'; }
}
async function openSearchFilters() {
  const f = S.search.f, row = (label, val, act) => '<div class="row" data-act="' + act + '"><span>' + label + '</span><span style="color:var(--mut)">' + (val || 'Все') + ' ›</span></div>';
  openSheet('<div class="hdr2"><h2>Фильтры поиска</h2><button class="btn" data-act="sReset">Сбросить</button></div>' + row('Жанр', f.genreName, 'sfGenre') + row('Платформа', f.platformName, 'sfPlatform') + row('Год', f.year, 'sfYear') + row('Мин. рейтинг (из 10)', f.minRating ? '★' + f.minRating : '', 'sfRating') + row('Игр в результате', String(S.set.pageSize || 40), 'sfPageSize')
    + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Готово</button>');
}

/* ====================== Настройки ====================== */
function viewSettings() {
  const propRows = S.props.map(p => '<div class="row"><span>' + esc(p.name) + ' <span class="sub">(' + ({ text: 'текст', number: 'число', date: 'дата' }[p.type]) + ')</span></span><button class="btn red" data-act="propDel" data-id="' + p.id + '">✕</button></div>').join('');
  return '<div class="hdr2"><h2>Настройки</h2></div>'
    + '<div class="sec"><h3 style="margin-top:0">Оформление</h3><div class="chips">' + [['dark', 'Тёмная'], ['light', 'Светлая'], ['auto', 'Как в системе']].map(x => '<button class="p' + (S.set.theme === x[0] ? ' on' : '') + '" data-act="setTheme" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div></div>'
    + '<div class="sec"><h3 style="margin-top:0">Основной поиск</h3><div class="chips">' + ['igdb', 'rawg'].map(k => '<button class="p' + (S.set.mainSrc === k ? ' on' : '') + '" data-act="setMainSrc" data-v="' + k + '" style="border-color:' + PROV[k].color + '">' + (S.set.mainSrc === k ? '✓ ' : '') + PROV[k].name + '</button>').join('') + '</div><p class="sub">Поиск, быстрое добавление и разбор идут через основной источник. Другой источник включается кнопкой в окне поиска, но при следующем открытии поиска он снова возвращается на основной.</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">Ключи IGDB</h3>' + blockBanner(false, 'igdb') + '<label class="field"><span>Client ID</span><input id="idIn" value="' + esc(S.set.igdbId) + '" placeholder="Client ID" autocomplete="off"></label><label class="field"><span>Client Secret</span><input id="secIn" type="password" value="' + esc(S.set.igdbSecret) + '" placeholder="Client Secret" autocomplete="off"></label><label class="field"><span>Адрес своего прокси (для браузера, необязательно)</span><input id="proxyIn" value="' + esc(S.set.igdbProxy) + '" placeholder="http://localhost:8787" autocomplete="off"></label><div class="toolbar"><button class="btn acc" data-act="saveKey">Сохранить и проверить</button></div>' + usageHtml() + '<p class="sub">Если указан адрес прокси, ключи IGDB в приложении не нужны (они хранятся в прокси, см. tools/igdb-proxy.mjs). Бесплатно: зарегистрируйте приложение на dev.twitch.tv/console/apps (Twitch может потребовать включить двухфакторную защиту), создайте Client Secret и скопируйте оба значения. Документация: api-docs.igdb.com.</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">Ключ RAWG</h3>' + blockBanner(false, 'rawg') + '<label class="field"><input id="rawgIn" value="' + esc(S.set.rawgKey) + '" placeholder="вставьте ключ RAWG" autocomplete="off"></label><div class="toolbar"><button class="btn acc" data-act="saveRawg">Сохранить и проверить</button></div>' + rawgUsageHtml() + '<p class="sub">Бесплатный ключ: rawg.io/apidocs (регистрация, «Get API Key»).</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">SteamGridDB (обложки)</h3><div class="chips"><button class="p' + (S.set.sgdbOn ? ' on' : '') + '" data-act="toggleSgdb">' + (S.set.sgdbOn ? '✓ Включено' : 'Выключено') + '</button></div><label class="field"><input id="sgdbIn" value="' + esc(S.set.sgdbKey) + '" placeholder="ключ SteamGridDB"></label><div class="toolbar"><button class="btn acc" data-act="saveSgdb">Сохранить ключ</button></div><p class="sub">Запросов в этом месяце: <b>' + usageCount('sgdb') + '</b>. Пока выключено, в карточке игры вместо кнопок только маленькая кнопка с подсказкой. Если включено и у игры нет обложки в источнике, она подгружается отсюда сама. Лимит SteamGridDB: 120 запросов в минуту, приложение держит паузы между запросами и при ответе 429 останавливается на время, которое просит сервер. Ключ: steamgriddb.com, профиль, настройки, API.</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">Время прохождения</h3><p class="sub">В карточке игры кнопки HowLongToBeat и Cubiq.ru сразу открывают страницу сайта с игрой (в приложении Android внутри приложения, в браузере в новой вкладке). Время впишите в карточку вручную.</p></div>'
    + '<div class="sec"><h3 style="margin-top:0">Объединение карточек</h3><p class="sub">Одна и та же игра на разных платформах, добавленная несколькими карточками: сравните их, выберите основную, перенесите данные и объедините. Перед объединением показывается, какая карточка получится.</p><div class="toolbar"><button class="btn acc" data-act="mgTool">Открыть инструмент объединения</button></div></div>'
    + '<div class="sec"><h3 style="margin-top:0">Скриншоты в базе</h3><div id="shStats" class="sub">считаем…</div><div class="toolbar"><button class="btn" data-act="shMgr">Выбрать игры…</button><button class="btn red" data-act="shDelAll">Удалить все</button></div></div>'
    + '<div class="sec"><h3 style="margin-top:0">Данные</h3><p class="sub">Игр: ' + S.games.length + ' · коллекций: ' + S.collections.length + ' · скриншотов: ' + S.games.reduce((a, g) => a + (g.shotCount || 0), 0) + '<br>Занято на устройстве: <b id="stEst">считаем…</b>. ' + (S.set.lastExport ? 'Последняя копия: ' + new Date(S.set.lastExport).toLocaleDateString('ru-RU') + '. ' : 'Копии ещё не было. ') + 'Данные хранятся только на этом устройстве. Делайте резервную копию и переносите её между телефоном и компьютером файлом.</p><div class="toolbar"><button class="btn acc" data-act="export">Экспорт в файл</button><button class="btn" data-act="import">Импорт из файла</button><button class="btn" data-act="fixDupes">Проверить дубли</button><button class="btn" data-act="openStats">Статистика</button></div><input type="file" id="impFile" accept=".json,.zip,application/json,application/zip" class="hidden"></div>'
    + '<div class="sec"><h3 style="margin-top:0">Корзина</h3>' + (S.trash.length ? S.trash.slice().sort((a, b) => b.t - a.t).slice(0, 30).map(r => '<div class="row"><span>' + esc(r.game.name) + ' <span class="sub">' + new Date(r.t).toLocaleDateString('ru-RU') + '</span></span><button class="btn" data-act="trashRestore" data-id="' + r.id + '">Вернуть</button></div>').join('') + '<div class="toolbar"><button class="btn red" data-act="trashClear">Очистить корзину</button></div>' : '<p class="sub">Удалённые игры хранятся 30 дней, их можно вернуть.</p>') + '</div>'
    + '<div class="sec"><h3 style="margin-top:0">Свои свойства</h3>' + (propRows || '<p class="sub">Свойства других типов (текст, число, дата) для игр. Для «галочек» используйте коллекции.</p>') + '<div class="toolbar"><button class="btn" data-act="propAdd">＋ Добавить свойство</button></div></div>'
    + (installEvt ? '<div class="sec"><button class="btn acc" data-act="install">Установить приложение</button></div>' : '')
    + '<div class="sec"><button class="btn red" data-act="wipe">Удалить все данные</button></div>';
}
function dl(name, data) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 1000);
}
const dataUrlToBlob = u => { const p = u.split(','), mime = (p[0].match(/:(.*?);/) || [])[1] || 'image/jpeg', bin = atob(p[1]), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: mime }); };
const blobToDataUrl = b => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); });
// минимальный ZIP: файлы и сжатие deflate-raw через CompressionStream (если браузер умеет)
const crcTable = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = u8 => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = crcTable[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
async function streamBytes(stream, u8) { const w = stream.writable.getWriter(); w.write(u8); w.close(); return new Uint8Array(await new Response(stream.readable).arrayBuffer()); }
async function deflateRaw(u8) { if (typeof CompressionStream === 'undefined') return null; try { return await streamBytes(new CompressionStream('deflate-raw'), u8); } catch (e) { return null; } }
async function inflateRaw(u8) { if (typeof DecompressionStream === 'undefined') throw new Error('Этот браузер не умеет распаковывать архивы'); return streamBytes(new DecompressionStream('deflate-raw'), u8); }
async function zipBuild(files) { // files: [{ name, data: Uint8Array, deflate }]
  const enc = new TextEncoder(), parts = [], cd = []; let off = 0;
  for (const f of files) {
    const nm = enc.encode(f.name), crc = crc32(f.data); let data = f.data, method = 0;
    if (f.deflate) { const z = await deflateRaw(f.data); if (z && z.length < f.data.length) { data = z; method = 8; } }
    const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, method, true); h.setUint16(12, 0x21, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, f.data.length, true); h.setUint16(26, nm.length, true);
    parts.push(new Uint8Array(h.buffer), nm, data);
    const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, method, true); c.setUint16(14, 0x21, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, f.data.length, true); c.setUint16(28, nm.length, true); c.setUint32(42, off, true);
    cd.push(new Uint8Array(c.buffer), nm); off += 30 + nm.length + data.length;
  }
  const size = cd.reduce((a, x) => a + x.length, 0), e = new DataView(new ArrayBuffer(22)); e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, off, true);
  return new Blob(parts.concat(cd, [new Uint8Array(e.buffer)]), { type: 'application/zip' });
}
async function zipRead(buf) { // -> Map имя файла -> Uint8Array
  const u8 = new Uint8Array(buf), v = new DataView(buf), out = new Map(), dec = new TextDecoder(); let e = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 70000); i--) if (v.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('Не удалось прочитать архив');
  const n = v.getUint16(e + 10, true); let p = v.getUint32(e + 16, true);
  for (let k = 0; k < n; k++) {
    const method = v.getUint16(p + 10, true), csz = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), el = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), lo = v.getUint32(p + 42, true);
    const name = dec.decode(u8.subarray(p + 46, p + 46 + nl)), ds = lo + 30 + v.getUint16(lo + 26, true) + v.getUint16(lo + 28, true), raw = u8.subarray(ds, ds + csz);
    out.set(name, method === 8 ? await inflateRaw(raw) : raw.slice()); p += 46 + nl + el + cl;
  }
  return out;
}
const blobToBase64 = async b => (await blobToDataUrl(b)).split(',')[1];
function exportText(fmt) { const e = S.set.exp; return buildExport(S.expGames || [], e.keys, fmt || e.fmt, id => (collById(id) || {}).name); }
function openExport(games, title) {
  S.expGames = games; const e = S.set.exp;
  sheetKey = 'export'; openSheet('<div class="hdr2"><h2>Выгрузка: ' + esc(title) + '</h2></div><p class="sub">Игр: ' + games.length + '. Первая строка с заголовками: такой текст можно отдать ИИ, дописать недостающие данные и вставить обратно в «Разобрать» («Вставить список…»).</p>'
    + '<h3>Формат</h3><div class="chips">' + [['csv', 'CSV (Excel, ИИ)'], ['txt', 'Текст с разделителем |']].map(x => '<button class="p' + (e.fmt === x[0] ? ' on' : '') + '" data-act="expFmt" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>'
    + '<h3>Колонки</h3><div class="chips">' + EXPORT_COLS.map(c => '<button class="p' + (e.keys.includes(c[0]) ? ' on' : '') + '" data-act="expCol" data-k="' + c[0] + '">' + c[1] + '</button>').join('') + '</div>'
    + '<div class="toolbar"><button class="btn acc" data-act="expCopy">Копировать текст</button><button class="btn" data-act="expSave">Сохранить файл</button></div>');
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (er) { /* запасной способ */ }
  try { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return !!ok; } catch (er) { return false; }
}
async function exportData(withShots = true) {
  toast('Готовим файл…');
  const covers = {};
  for (const g of S.games) { if (g.hasCover) { const c = await DB.get('covers', g.id); if (c) covers[g.id] = await blobToDataUrl(c.blob); } }
  const shots = {}, files = [];
  for (const g of S.games) { if (withShots && g.shotCount) { const l = await getShots(g.id); if (l.length) shots[g.id] = l.map((x, i) => { const f = 'shots/' + g.id + '/' + (i + 1) + '.jpg'; files.push({ name: f, blob: x.blob }); return { src: x.src || '', file: f }; }); } }
  const text = JSON.stringify({ app: 'game-catalog', version: 3, exported: new Date().toISOString(), games: S.games, collections: S.collections, props: S.props, covers, shots, inbox: S.inbox });
  const day = new Date().toISOString().slice(0, 10); let name, blob;
  if (files.length) { // со скриншотами: архив, картинки отдельными файлами
    const entries = [{ name: 'data.json', data: new TextEncoder().encode(text), deflate: true }];
    for (const f of files) entries.push({ name: f.name, data: new Uint8Array(await f.blob.arrayBuffer()), deflate: false });
    blob = await zipBuild(entries); name = 'game-catalog-' + day + '.zip';
  } else { blob = new Blob([text], { type: 'application/json' }); name = 'game-catalog-' + day + (withShots ? '' : '-lite') + '.json'; }
  S.set.lastExport = Date.now(); saveSet();
  const FS = plug('Filesystem'), SH = plug('Share');
  if (isNative() && FS && SH) {
    try { const r = await FS.writeFile({ path: name, data: await blobToBase64(blob), directory: 'CACHE' }); await SH.share({ title: 'Каталог игр', url: r.uri, dialogTitle: 'Сохранить копию' }); return; } catch (e) { toast('Не удалось поделиться: ' + (e.message || e)); return; }
  }
  dl(name, blob);
}
async function importData(d, mode, files) {
  if (!d || d.app !== 'game-catalog') throw new Error('Это не файл копии каталога');
  if (mode === 'replace') {
    for (const s of ['games', 'collections', 'props', 'covers', 'shots', 'inboxLists', 'inboxItems']) await DB.clear(s);
    S.inbox = { lists: [], items: [] }; S.inboxList = null;
    coverCache.forEach(u => URL.revokeObjectURL(u)); coverCache.clear(); S.games = []; S.collections = []; S.props = [];
  }
  const cmap = {}, pmap = {}, keepOrder = !S.collections.length, coverFix = [];
  for (const c of d.collections || []) {
    let ex = S.collections.find(x => x.name.toLowerCase() === c.name.toLowerCase());
    if (!ex) {
      ex = { id: S.collections.some(x => x.id === c.id) ? uid() : c.id, name: c.name, created: c.created || Date.now() };
      if (keepOrder && c.order != null) ex.order = c.order; // порядок, цвет и обложка плитки тоже переносятся
      if (okColor(c.color)) ex.color = c.color;
      if (c.coverGame) coverFix.push([ex, c.coverGame]);
      S.collections.push(ex); await DB.put('collections', ex);
    }
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
    let t = S.games.find(x => (g.igdbId && x.igdbId === g.igdbId) || (g.rawgId && x.rawgId === g.rawgId) || (!g.igdbId && !g.rawgId && x.name === g.name && x.year === g.year));
    if (t) {
      colls.forEach(c => { if (!t.collections.includes(c)) t.collections.push(c); }); t.props = Object.assign({}, props, t.props); if (!t.mainPlatform && g.mainPlatform) t.mainPlatform = g.mainPlatform; ['igdbId', 'rawgId', 'igdbUrl', 'rawgUrl'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; });
    if (!t.done && g.done) { t.done = true; t.doneDate = g.doneDate || ''; }
      ['description', 'series', 'coverUrl'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; }); ['time', 'rating', 'year'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; });
    } else {
      t = Object.assign({ genres: [], platforms: [], series: '', description: '', time: 0, rating: 0, year: 0 }, g, { series: canonSeries(g.series), id: S.games.some(x => x.id === g.id) ? uid() : g.id, collections: colls, props });
      t.hasCover = false; t.shotCount = 0; S.games.push(t);
    }
    const cv = d.covers && d.covers[g.id];
    if (cv && !t.hasCover) { try { await setCover(t.id, dataUrlToBlob(cv)); } catch (e) { /* пропускаем */ } }
    const sh = d.shots && d.shots[g.id];
    if (sh && sh.length && !(t.shotCount > 0)) { try { const list = sh.map(x => x.file ? (files && files.get(x.file) ? { n: uid(), src: x.src || '', blob: new Blob([files.get(x.file)], { type: 'image/jpeg' }) } : null) : { n: uid(), src: x.src || '', blob: dataUrlToBlob(x.d) }).filter(Boolean); if (!list.length) throw new Error('нет картинок'); await DB.put('shots', { id: t.id, list }); t.shotCount = list.length; } catch (e) { /* пропускаем */ } }
    gmap[g.id] = t.id;
    await DB.put('games', t); n++;
  }
  for (const [ex, old] of coverFix) { if (gmap[old]) { ex.coverGame = gmap[old]; await DB.put('collections', ex); } }
  const lmap = {}, inb = d.inbox || { lists: [], items: [] };
  for (const l of inb.lists || []) {
    let ex = S.inbox.lists.find(x => x.name.toLowerCase() === l.name.toLowerCase());
    if (!ex) { ex = { id: S.inbox.lists.some(x => x.id === l.id) ? uid() : l.id, name: l.name, created: l.created || Date.now(), platform: l.platform || '', markDone: !!l.markDone, colls: (l.colls || []).map(id => cmap[id]).filter(Boolean) }; S.inbox.lists.push(ex); await DB.put('inboxLists', ex); }
    lmap[l.id] = ex.id;
  }
  for (const i of inb.items || []) {
    const lid = lmap[i.listId]; if (!lid || S.inbox.items.some(x => x.listId === lid && x.text.toLowerCase() === i.text.toLowerCase())) continue;
    const it = Object.assign({}, i, { id: S.inbox.items.some(x => x.id === i.id) ? uid() : i.id, listId: lid, gameId: i.done ? (gmap[i.gameId] || '') : '' });
    if (it.done && !it.gameId) it.done = false;
    if (it.colls) it.colls = it.colls.map(id => cmap[id]).filter(Boolean);
    S.inbox.items.push(it); await DB.put('inboxItems', it);
  }
  S.set.f.collections = S.set.f.collections.filter(id => id === DONE_ID || S.collections.some(c => c.id === id));
  return n;
}

/* ====================== Отрисовка и события ====================== */
let lazyBusy = false;
async function lazyCovers() { // обложки, которые не удалось сохранить при добавлении, докачиваем в фоне (для работы офлайн)
  if (lazyBusy || navigator.onLine === false) return; lazyBusy = true;
  try {
    let n = 0;
    for (const g of S.games) {
      if (n >= 6) break;
      if (!g.hasCover && g.coverUrl && !(g.coverTry && Date.now() - g.coverTry < 864e5)) { g.coverTry = Date.now(); n++; await cacheCover(g); await saveGame(g); }
    }
    if (n && S.tab === 'library') renderLibBody();
  } finally { lazyBusy = false; }
}
let lbEl = null, lbState = null;
function closeLb() { if (lbEl) { lbEl.remove(); lbEl = null; lbState = null; } }
const lbDist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function lbApply() { const img = lbEl && $('img', lbEl); if (img && img.style && lbState) img.style.transform = 'translate(' + lbState.x + 'px,' + lbState.y + 'px) scale(' + lbState.s + ')'; }
function lbAnim(ms) { const img = lbEl && $('img', lbEl); if (img && img.style) img.style.transition = ms ? 'transform ' + ms + 'ms ease' : 'none'; }
function lbShow(i) {
  const st = lbState; if (!st || !lbEl) return; st.i = (i + st.list.length) % st.list.length; st.s = 1; st.x = 0; st.y = 0;
  $('img', lbEl).src = st.list[st.i]; $('.lbc', lbEl).textContent = (st.i + 1) + ' из ' + st.list.length; lbApply();
}
// переход к соседнему скриншоту со сдвигом в сторону
function lbGo(dir) {
  const st = lbState; if (!st || st.list.length < 2 || st.busy) return; st.busy = true; const w = lbEl.clientWidth || 360;
  lbAnim(160); st.x = -dir * w; lbApply();
  setTimeout(() => {
    if (!lbState) return; lbAnim(0); lbShow(st.i + dir); st.x = dir * w; lbApply(); void lbEl.offsetWidth; lbAnim(160); st.x = 0; lbApply();
    setTimeout(() => { st.busy = false; lbAnim(0); }, 180);
  }, 170);
}
// просмотр: свайп влево/вправо, щипок и двойной тап для увеличения, колесо мыши, стрелки; счётчик внизу
// просмотр обложки: снизу кнопки обновления и замены обложки (из основной карточки они убраны)
function openCoverView() {
  const sh = S.sheet; if (!sh) return; const d = sh.draft, g = gameById(d.id) || d, url = coverSrc(g);
  openLb(url ? [url] : [''], 0); if (!lbEl) return;
  const bar = document.createElement('div'); bar.className = 'lbbar'; bar.setAttribute('data-lb', 'bar');
  const b = (act, ic, label, src) => '<button class="btn sm" data-cv="' + act + '"' + (src ? ' data-src="' + src + '"' : '') + '>' + I(ic) + ' ' + label + '</button>';
  bar.innerHTML = srcsOf(d).map(k => b('refreshIgdb', 'refresh', 'Обновить ' + PROV[k].name, k)).join('') + b('pickCover', 'img', 'Заменить обложку') + (S.set.sgdbOn ? b('sgdbOpen', 'img', 'SteamGridDB') : '<button class="btn sm" data-cv="sgdbOff" title="SteamGridDB выключен">SGDB</button>');
  bar.onclick = e => { const x = e.target.closest ? e.target.closest('[data-cv]') : null; if (!x) return; const a = x.dataset.cv, src = x.dataset.src; closeLb(); if (a === 'pickCover') $('#coverFile').click(); else ACT[a]({ dataset: { src } }); };
  lbEl.appendChild(bar);
}
function openLb(list, i) {
  if (!list || !list.length) return; closeLb();
  const d = document.createElement('div'); d.className = 'lb';
  d.innerHTML = '<img alt="" draggable="false"><div class="lbc"></div><button class="lbx" data-lb="x" aria-label="Закрыть">✕</button>' + (list.length > 1 ? '<button class="lbn lbp" data-lb="p" aria-label="Назад">‹</button><button class="lbn lbf" data-lb="n" aria-label="Вперёд">›</button>' : '');
  lbEl = d; const st = lbState = { list, i: 0, s: 1, x: 0, y: 0, pts: new Map(), moved: false, tap: 0, busy: false };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const bound = () => { const w = (d.clientWidth || 360) * (st.s - 1) / 2, h = (d.clientHeight || 640) * (st.s - 1) / 2; st.x = clamp(st.x, -w, w); st.y = clamp(st.y, -h, h); };
  d.onclick = e => {
    if (st.moved) return;
    const b = e.target.closest ? e.target.closest('[data-lb]') : null, k = b && b.dataset.lb;
    if (k === 'p') lbGo(-1); else if (k === 'n') lbGo(1); else if (k === 'x' || e.target === d) closeLb();
  };
  d.onpointerdown = e => {
    if (e.target.closest && e.target.closest('[data-lb]')) return;
    st.pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); st.moved = false;
    if (st.pts.size === 2) { const [a, b] = Array.from(st.pts.values()); st.d0 = lbDist(a, b) || 1; st.s0 = st.s; }
    else { st.sx = e.clientX; st.sy = e.clientY; st.x0 = st.x; st.y0 = st.y; }
  };
  d.onpointermove = e => {
    if (!st.pts.has(e.pointerId) || st.busy) return; st.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (st.pts.size >= 2) { const [a, b] = Array.from(st.pts.values()); st.s = clamp(st.s0 * lbDist(a, b) / st.d0, 1, 5); st.moved = true; if (st.s === 1) { st.x = 0; st.y = 0; } bound(); lbApply(); return; }
    const dx = e.clientX - st.sx, dy = e.clientY - st.sy; if (Math.abs(dx) + Math.abs(dy) > 8) st.moved = true;
    if (st.s > 1) { st.x = st.x0 + dx; st.y = st.y0 + dy; bound(); } else st.x = dx;
    lbApply();
  };
  const up = e => {
    if (!st.pts.has(e.pointerId)) return; st.pts.delete(e.pointerId);
    if (st.pts.size === 1) { const p = Array.from(st.pts.values())[0]; st.sx = p.x; st.sy = p.y; st.x0 = st.x; st.y0 = st.y; return; }
    if (st.pts.size) return;
    if (!st.moved) { const now = Date.now(); if (now - st.tap < 300) { lbAnim(180); st.s = st.s > 1 ? 1 : 2.5; st.x = 0; st.y = 0; lbApply(); setTimeout(() => lbAnim(0), 200); st.tap = 0; } else st.tap = now; return; }
    if (st.s === 1) { if (Math.abs(st.x) > 60 && st.list.length > 1) lbGo(st.x < 0 ? 1 : -1); else { lbAnim(150); st.x = 0; lbApply(); setTimeout(() => lbAnim(0), 160); } }
  };
  d.onpointerup = up; d.onpointercancel = up;
  d.onwheel = e => { e.preventDefault(); st.s = clamp(st.s * (e.deltaY < 0 ? 1.18 : 0.85), 1, 5); if (st.s === 1) { st.x = 0; st.y = 0; } bound(); lbApply(); };
  $('#layer').appendChild(d); lbShow(i || 0);
}
async function fillEstimate() {
  const el = $('#stEst'); if (!el) return;
  try { const e = await navigator.storage.estimate(); el.textContent = '~' + Math.max(1, Math.round(e.usage / 1048576)) + ' МБ'; } catch (er) { el.textContent = 'нет данных'; }
}
function render() {
  setTimeout(lazyCovers, 800);
  $$('#tabs button').forEach(b => { const on = b.dataset.tab === S.tab || (S.tab === 'stats' && b.dataset.tab === 'settings'); b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  const fab = $('#fab'); fab.classList.toggle('hidden', !(S.tab === 'library' || S.tab === 'collections' || (S.tab === 'inbox' && !S.inboxList)) || S.selMode);
  const v = $('#view'); v.className = ['library', 'collections', 'series', 'search'].includes(S.tab) ? 'fx' : '';
  if (S.tab === 'library') { v.innerHTML = viewLibrary(); renderLibrary(); }
  else if (S.tab === 'collections') { v.innerHTML = viewCollections(); renderSelBar(); }
  else if (S.tab === 'stats') { v.innerHTML = viewStats(); renderSelBar(); }
  else if (S.tab === 'inbox') { v.innerHTML = viewInbox(); renderSelBar(); }
  else if (S.tab === 'series') { v.innerHTML = viewSeries(); renderSelBar(); }
  else if (S.tab === 'search') { v.innerHTML = viewSearch(); renderSearchBody(); renderSelBar(); }
  else { v.innerHTML = viewSettings(); renderSelBar(); fillEstimate(); fillShotStats(); }
}
const lp = { t: null, fired: false, x: 0, y: 0 };
const ACT = {
  tab: t => { if (t.dataset.tab !== 'search') S.pending = null; else if (S.tab !== 'search') { S.search.src = S.set.mainSrc; Object.assign(S.search.f, { genre: '', genreName: '', platform: '', platformName: '' }); } S.retGame = null; S.inSelMode = false; S.inSel.clear(); S.tab = t.dataset.tab; S.selMode = false; S.sel.clear(); closeSheet(); render(); $('#view').scrollTop = 0; },
  fab: () => S.tab === 'collections' ? createCollection().then(c => { if (c) render(); }) : S.tab === 'inbox' ? createList() : openGameSheet(null),
  closeSheet: () => closeSheet(),
  clearQ: () => { S.set.f.q = ''; saveSet(); if (S.tab === 'library') { const q = $('#q'); if (q) q.value = ''; libRefilter(); if (sheetEl) openFilters(); } },
  clearSQ: () => { S.search.q = ''; const q = $('#sq'); if (q) q.value = ''; runSearch(true); },
  openColls: () => openCollSheet(),
  expLib: () => { closeSheet(); openExport(sortGames(filterGames(S.games, S.set.f), S.set.f), 'Список игр'); },
  expFmt: t => { S.set.exp.fmt = t.dataset.v; saveSet(); $$('[data-act="expFmt"]').forEach(b => b.classList.toggle('on', b.dataset.v === t.dataset.v)); },
  expCol: t => { const k = t.dataset.k, a = S.set.exp.keys, i = a.indexOf(k); if (i < 0) a.push(k); else if (a.length > 1) a.splice(i, 1); saveSet(); if (t.classList) t.classList.toggle('on', a.includes(k)); },
  expCopy: async () => { toast(await copyText(exportText()) ? 'Скопировано: можно вставить в ИИ или в Excel' : 'Не удалось скопировать'); },
  expSave: async () => {
    const e = S.set.exp, csv = e.fmt === 'csv', text = (csv ? '\uFEFF' : '') + exportText(), name = 'spisok-igr-' + new Date().toISOString().slice(0, 10) + (csv ? '.csv' : '.txt');
    const FS = plug('Filesystem'), SH = plug('Share');
    if (isNative() && FS && SH) { try { const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' }); await SH.share({ title: 'Список игр', url: r.uri, dialogTitle: 'Сохранить список' }); } catch (er) { toast('Не удалось поделиться: ' + (er.message || er)); } return; }
    dl(name, new Blob([text], { type: csv ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8' }));
  },
  shareGame: async () => {
    const d = S.sheet && S.sheet.draft; if (!d || !d.name) return toast('Сначала введите название');
    const text = gameLine(d), SH = plug('Share');
    try { if (isNative() && SH) await SH.share({ title: d.name, text, dialogTitle: 'Поделиться игрой' }); else if (navigator.share) await navigator.share({ title: d.name, text }); else toast(await copyText(text) ? 'Скопировано: ' + text : 'Не удалось поделиться'); } catch (er) { /* отменено */ }
  },
  itPick: async t => {
    const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it || it.done) return;
    const c = it.cands || [], r = await askChoose({ title: 'Выбрать: «' + it.text + '»', items: c.map(x => ({ id: x.rid, label: x.name + (x.year ? ' (' + x.year + ')' : ''), sub: (x.platforms || []).join(', '), ico: '🎮' })).concat([{ id: '__search', label: 'Открыть поиск' }, { id: '__none', label: 'Ни один не подходит' }]) });
    if (r === null) return;
    if (r === '__search') return ACT.itOpen({ dataset: { id: it.id } });
    if (r === '__none') { it.doubt = false; it.failed = true; delete it.cands; await DB.put('inboxItems', it); return render(); }
    try { const g = await addFromIgdb(r, [], { platform: effItem(it).platform }); if (g) linkItem(it, g); } catch (er) { toast(er.message); }
  },
  sfPageSize: async () => {
    const v = await askChoose({ title: 'Игр в результате (за один раз)', items: [20, 40, 50, 100, 200].map(n => ({ id: String(n), label: String(n) + (n === (S.set.pageSize || 40) ? ' ✓' : '') })) });
    if (!v) return; S.set.pageSize = +v; saveSet(); openSearchFilters(); runSearch(true);
  },
  gameColls: t => {
    const g = gameById(t.dataset.gid); if (!g) return;
    const cs = (g.collections || []).map(collById).filter(Boolean), m = openModal();
    m.innerHTML = '<h4>' + esc(g.name) + '</h4><p class="sub">Коллекции игры: ' + cs.length + '</p><div class="chips">' + cs.map(c => '<span class="p"' + (okColor(c.color) ? ' style="border-color:' + okColor(c.color) + '"' : '') + '>' + esc(c.name) + '</span>').join('') + '</div><div class="acts"><span data-x="ok">Закрыть</span></div>';
    modalCancel = () => closeModal(); m.onclick = e => { if (e.target.closest('[data-x]')) closeModal(); };
  },
  collClear: () => { S.set.f.collections = []; saveSet(); libRefilter(); openCollSheet(); },
  collChip: t => { const c = S.set.f.collections, i = c.indexOf(t.dataset.id); i < 0 ? c.push(t.dataset.id) : c.splice(i, 1); saveSet(); if (t.classList) t.classList.toggle('on', i < 0); libRefilter(); }, // без перерисовки окна: список не прыгает наверх
  collOpen: t => { if (lp.fired) { lp.fired = false; return; } S.set.f.collections = t.dataset.id === 'all' ? [] : [t.dataset.id]; saveSet(); S.tab = 'library'; render(); },
  collMenu: (t, e) => { e.stopPropagation(); collMenu(t.dataset.id); },
  serOpen: t => { if (lp.fired) { lp.fired = false; return; } Object.assign(S.set.f, { q: '', years: [], genres: [], platforms: [], series: [t.dataset.name], collections: [], props: [], mainPlats: [], done: '', minRating: 0 }); saveSet(); S.tab = 'library'; render(); },
  serMenu: (t, e) => { e.stopPropagation(); serMenu(t.dataset.name); },
  collMode: t => { S.set.f.collMode = t.dataset.v; saveSet(); $$('[data-act="collMode"]').forEach(b => b.classList.toggle('on', b.dataset.v === t.dataset.v)); renderLibrary(); },
  toggleView: () => { S.set.view = S.set.view === 'grid' ? 'list' : 'grid'; saveSet(); renderLibrary(); },
  openFilters: () => openFilters(), openCols: () => openCols(),
  colToggle: t => { const c = S.set.cols; c[t.dataset.k] = c[t.dataset.k] ? 0 : 1; saveSet(); openCols(); renderLibrary(); },
  sortBy: t => { const f = S.set.f; if (f.sort === t.dataset.k) f.dir = f.dir === 'asc' ? 'desc' : 'asc'; else { f.sort = t.dataset.k; f.dir = 'asc'; } saveSet(); libRefilter(); },
  fToggle: t => { const a = S.set.f[t.dataset.k], v = t.dataset.k === 'years' ? +t.dataset.v : t.dataset.v, i = a.findIndex(x => String(x) === String(v)); i < 0 ? a.push(v) : a.splice(i, 1); saveSet(); if (t.classList) t.classList.toggle('on', i < 0); libRefilter(); },
  rmF: t => { const k = t.dataset.k; S.set.f[k] = S.set.f[k].filter(x => String(x) !== t.dataset.v); saveSet(); libRefilter(); },
  resetF: () => { const f = S.set.f; Object.assign(f, { q: '', years: [], genres: [], platforms: [], series: [], collections: [], props: [], mainPlats: [], done: '', minRating: 0 }); saveSet(); const q = $('#q'); if (q) q.value = ''; libRefilter(); if (sheetEl) openFilters(); },
  selToggle: () => { S.selMode = !S.selMode; S.sel.clear(); renderLibrary(); $('#fab').classList.toggle('hidden', S.selMode); },
  selAct: t => selectionAction(t.dataset.m),
  openGame: (t) => { if (lp.fired) { lp.fired = false; return; } const id = t.dataset.gid; if (S.selMode) toggleSel(id); else openGameSheet(id); },
  openGameFromIgdb: t => { closeSheet(); openGameSheet(t.dataset.id); },
  pickCover: () => $('#coverFile').click(),
  shColl: t => { markDirty(); const d = S.sheet.draft, i = d.collections.indexOf(t.dataset.id); i < 0 ? d.collections.push(t.dataset.id) : d.collections.splice(i, 1); drawShColls(); },
  shNewColl: async () => { markDirty(); const c = await createCollection(); if (c && !S.sheet.draft.collections.includes(c.id)) S.sheet.draft.collections.push(c.id); drawShColls(); },
  saveGame: () => closeSheet(),
  pickSeries: async () => {
    const m = new Map(); S.games.forEach(g => { if (g.series) m.set(g.series, (m.get(g.series) || 0) + 1); });
    const names = Array.from(m.keys()).sort((a, b) => a.localeCompare(b, 'ru'));
    const r = await choose({ title: 'Серия игр', search: true, items: [{ id: '__none', label: 'Без серии', accent: true, pin: true }].concat(names.map(n => ({ id: n, label: n, sub: gWord(m.get(n)) }))) });
    if (r === null) return; const f = $('#f_series'); if (f) { f.value = r === '__none' ? '' : r; markDirty(); }
  },
  togglePin: () => { S.set.pin = !S.set.pin; saveSet(); renderLibrary(); if (sheetEl) openCols(); },
  colProp: t => { const pc = S.set.propCols = S.set.propCols || {}; pc[t.dataset.id] = pc[t.dataset.id] === 0 ? 1 : 0; saveSet(); openCols(); renderLibrary(); },
  fixDupes: async () => { await checkDupes(false); render(); },
  delGame: async () => { const id = S.sheet.draft.id; if (await confirmBox('Удалить игру «' + S.sheet.draft.name + '»?', 'Удалить')) { if (S.sheet) S.sheet.dirty = false; await removeGame(id); closeSheet(); render(); toast('Игра удалена', 'Отменить', () => restoreGames([id])); } },
  refreshIgdb: t => refreshFromIgdb(S.sheet.draft.id, t.dataset.src),
  findIgdb: t => { const n = $('#f_name').value; S.retGame = { id: S.sheet.draft.id, tab: S.tab }; closeSheet(); S.search.q = n; S.search.src = t.dataset.src || S.set.mainSrc; Object.assign(S.search.f, { genre: '', genreName: '', platform: '', platformName: '' }); S.tab = 'search'; render(); runSearch(true); },
  seriesCatalog: () => { const s = $('#f_series').value.trim(); closeSheet(); S.set.f.series = [s]; S.set.f.collections = []; saveSet(); S.tab = 'library'; render(); },
  seriesIgdb: t => { const d = S.sheet.draft, src = t.dataset.src; S.retGame = { id: d.id, tab: S.tab }; showSeries(ridOf(src, d[src + 'Id']), d.series || d.name); },
  sFilters: () => openSearchFilters(),
  sReset: () => { Object.assign(S.search.f, { genre: '', genreName: '', platform: '', platformName: '', year: '', minRating: 0 }); closeSheet(); renderSearchBody(); runSearch(true); },
  sRm: t => { const f = S.search.f, k = t.dataset.k; f[k] = k === 'minRating' ? 0 : ''; if (k === 'genre') f.genreName = ''; if (k === 'platform') f.platformName = ''; runSearch(true); },
  sBack: () => { S.search.mode = 'search'; runSearch(true); },
  sMore: () => runSearch(false),
  sfGenre: async () => { try { const l = await loadLists(); const r = await choose({ title: 'Выбрать жанр', items: [{ id: '', label: 'Все' }].concat(l.genres.map(x => ({ id: x.id, label: x.name }))) }); if (r !== null) { const g = l.genres.find(x => String(x.id) === r); Object.assign(S.search.f, { genre: r, genreName: g ? g.name : '' }); closeSheet(); renderSearchBody(); runSearch(true); } } catch (e) { toast(e.message); } },
  sfPlatform: async () => { try { const l = await loadLists(); const r = await choose({ title: 'Выбрать платформу', items: [{ id: '', label: 'Все' }].concat(l.platforms.map(x => ({ id: x.id, label: x.name }))) }); if (r !== null) { const p = l.platforms.find(x => String(x.id) === r); Object.assign(S.search.f, { platform: r, platformName: p ? p.name : '' }); closeSheet(); renderSearchBody(); runSearch(true); } } catch (e) { toast(e.message); } },
  sfYear: async () => { const y = new Date().getFullYear(), items = [{ id: '', label: 'Все' }]; for (let i = y + 1; i >= 1975; i--) items.push({ id: i, label: String(i) }); const r = await choose({ title: 'Год выпуска', items }); if (r !== null) { S.search.f.year = r; closeSheet(); renderSearchBody(); runSearch(true); } },
  sfRating: async () => { const r = await choose({ title: 'Минимальный рейтинг', items: [{ id: 0, label: 'Все' }, { id: 5, label: '★ 5+' }, { id: 6, label: '★ 6+' }, { id: 7, label: '★ 7+' }, { id: 8, label: '★ 8+' }, { id: 9, label: '★ 9+' }] }); if (r !== null) { S.search.f.minRating = +r; closeSheet(); renderSearchBody(); runSearch(true); } },
  openIgdb: t => openIgdbSheet(t.dataset.rid),
  openUrl: t => openExternal(t.dataset.u),
  sSrcSwitch: () => { const s = S.search; s.src = otherSrc(s.src); Object.assign(s.f, { genre: '', genreName: '', platform: '', platformName: '' }); s.token++; render(); runSearch(true); },
  igdbTap: t => { const rid = t.dataset.rid, ac = validAddColls(); if (ac.length) quickTap(rid, ac); else openIgdbSheet(rid); },
  openAddColls: () => openAddCollSheet(),
  acChip: t => { const a = S.search.addColls, i = a.indexOf(t.dataset.id); i < 0 ? a.push(t.dataset.id) : a.splice(i, 1); if (t.classList) t.classList.toggle('on', i < 0); renderSearchHead(); },
  acClear: () => { S.search.addColls = []; renderSearchHead(); openAddCollSheet(); },
  acRm: t => { S.search.addColls = S.search.addColls.filter(id => id !== t.dataset.id); renderSearchHead(); },
  acNew: async () => { const c = await createCollection(); if (c) { S.search.addColls.push(c.id); renderSearchHead(); openAddCollSheet(); } },
  rsAdd: async t => { const rid = t.dataset.rid; t.textContent = '…'; try { const pit = pendingItem(), g = await addFromIgdb(rid, (S.rs ? S.rs.colls : []).slice(), pit ? { platform: effItem(pit).platform } : {}); if (g) { toast('Добавлено'); if (tryLinkPending(g)) { closeSheet(); return; } } } catch (er) { toast(er.message); } openIgdbSheet(rid, true); renderSearchBody(); },
  rsChip: async t => {
    const rid = S.rs.rid, id = t.dataset.id, cat = gameByRid(rid); let on;
    if (cat) { if (id === DONE_ID) { cat.done = !cat.done; cat.doneDate = cat.done ? todayStr() : ''; on = cat.done; } else { const i = cat.collections.indexOf(id); i < 0 ? cat.collections.push(id) : cat.collections.splice(i, 1); on = i < 0; } await saveGame(cat); }
    else { const c = S.rs.colls, i = c.indexOf(id); i < 0 ? c.push(id) : c.splice(i, 1); on = i < 0; }
    if (t.classList) t.classList.toggle('on', on); if (id === DONE_ID) t.textContent = (on ? '✓ ' : '') + 'Завершено';
  },
  rsNewColl: async () => { const c = await createCollection(); if (!c) return; const cat = gameByRid(S.rs.rid); if (cat) { if (!cat.collections.includes(c.id)) cat.collections.push(c.id); await saveGame(cat); } else S.rs.colls.push(c.id); openIgdbSheet(S.rs.rid, true); },
  rsLink: t => { const g = gameByRid(t.dataset.rid); if (g && tryLinkPending(g)) closeSheet(); },
  openStats: () => { S.tab = 'stats'; render(); $('#view').scrollTop = 0; },
  trashRestore: t => restoreGames([t.dataset.id]),
  trashClear: async () => { if (!await confirmBox('Удалить всё из корзины без возможности вернуть?', 'Очистить')) return; for (const r of S.trash) await DB.del('trash', r.id); S.trash = []; render(); },
  setMinRating: t => { S.set.f.minRating = +t.dataset.v; saveSet(); libRefilter(); if (sheetEl) openFilters(); },
  zoom: t => { const k = t.dataset.k, R = ZOOM_RANGE[k], c = colsFor(k); S.set.zoom[k] = c >= R[1] ? R[0] : c + 1; saveSet(); if (S.tab === 'library') renderLibrary(); else render(); },
  setTheme: t => { S.set.theme = t.dataset.v; saveSet(); applyTheme(); render(); },
  unblock: () => { S.block = null; render(); if (S.tab === 'search') runSearch(true); },
  saveSgdb: async () => { S.set.sgdbKey = $('#sgdbIn').value.trim(); await saveSet(); toast(S.set.sgdbKey ? 'Ключ SteamGridDB сохранён' : 'Ключ удалён'); },
  sgdbOpen: () => { const id = S.sheet.draft.id; closeSheet(); openSgdb(id); },
  sgdbUse: async t => { const gr = S.sgdb && S.sgdb.grids[+t.dataset.i], g = S.sgdb && gameById(S.sgdb.gid); if (!gr || !g) return; toast('Загрузка обложки…'); await applyCoverUrl(g, gr.url); closeSheet(); toast('Обложка заменена'); render(); },
  hltbOpen: () => { const n = (($('#f_name') || {}).value || '').trim(); if (!n) return toast('Укажите название'); openExternal('https://howlongtobeat.com/?q=' + encodeURIComponent(n)); },
  cubiqOpen: () => { const n = (($('#f_name') || {}).value || '').trim(); if (!n) return toast('Укажите название'); openExternal('https://cubiq.ru/gametime/?s=' + encodeURIComponent(n).replace(/%20/g, '+')); },
  sgdbOff: () => toast('SteamGridDB включается в настройках'),
  toggleSgdb: () => { S.set.sgdbOn = !S.set.sgdbOn; saveSet(); render(); },
  setMainSrc: t => { S.set.mainSrc = t.dataset.v === 'rawg' ? 'rawg' : 'igdb'; S.search.src = S.set.mainSrc; S.search.results = []; S.search.started = false; saveSet(); render(); },
  saveRawg: async () => { S.set.rawgKey = $('#rawgIn').value.trim(); if (S.block && S.block.src === 'rawg') S.block = null; await saveSet(); S.lists = {}; if (!S.set.rawgKey) return toast('Ключ RAWG удалён'); try { await rawg('/genres'); toast('Ключ RAWG работает'); } catch (e) { toast(e.message); } },
  saveQuota: () => { const q = S.set.rawgQuota; q.left = Math.max(0, +$('#rqLeft').value || 0); const d = $('#rqRenew').value; if (d) q.renew = d; S.set.rawgWarn = 0; rawgQuotaTick(); saveSet(); toast('Остаток и дата сохранены'); render(); },
  shMgr: async () => {
    const st = await shotStats(); if (!st.length) return toast('Скриншотов в базе нет');
    openSheet('<div class="hdr2"><h2>Скриншоты в базе</h2></div><div class="sub">Отметьте игры, у которых нужно удалить скриншоты</div><div id="smList">' + st.map(x => '<label class="row"><span><input type="checkbox" data-gid="' + x.id + '"> ' + esc(x.name) + '</span><span class="sub">' + x.n + ' шт · ' + fmtSize(x.size) + '</span></label>').join('') + '</div><div class="toolbar"><button class="btn red" data-act="shMgrDel">Удалить у выбранных</button><button class="btn" data-act="closeSheet">Закрыть</button></div>');
  },
  shMgrDel: async () => {
    const ids = Array.from($$('#smList input')).filter(i => i.checked).map(i => i.dataset.gid); if (!ids.length) return toast('Ничего не выбрано');
    if (!await confirmBox('Удалить скриншоты у выбранных игр: ' + ids.length + '?', 'Удалить')) return; await delShots(ids); closeSheet(); render();
  },
  shDelAll: async () => {
    const st = await shotStats(); if (!st.length) return toast('Скриншотов в базе нет');
    if (!await confirmBox('Удалить все скриншоты из базы (' + st.reduce((a, x) => a + x.n, 0) + ' шт, ' + fmtSize(st.reduce((a, x) => a + x.size, 0)) + ')? Игры останутся.', 'Удалить все')) return; await delShots(st.map(x => x.id)); render();
  },
  gotoGenre: t => { const v = t.dataset.v; closeSheet(); Object.assign(S.set.f, { q: '', years: [], genres: [v], platforms: [], series: [], collections: [], props: [], mainPlats: [], done: '', minRating: 0 }); saveSet(); S.tab = 'library'; render(); },
  rsGenre: async t => { try { const src = parseRid(S.rs.rid).src; S.search.src = src; const l = await loadLists(src), g = l.genres.find(x => x.name === t.dataset.v); if (!g) return toast('Жанр не найден в списке ' + PROV[src].name); Object.assign(S.search.f, { genre: String(g.id), genreName: g.name }); closeSheet(); S.tab = 'search'; render(); runSearch(true); } catch (e) { toast(e.message); } },
  rsPlat: async t => { try { const src = parseRid(S.rs.rid).src; S.search.src = src; const l = await loadLists(src), p = l.platforms.find(x => x.name === t.dataset.v); if (!p) return toast('Платформа не найдена в списке ' + PROV[src].name); Object.assign(S.search.f, { platform: String(p.id), platformName: p.name }); closeSheet(); S.tab = 'search'; render(); runSearch(true); } catch (e) { toast(e.message); } },
  setDone: t => { S.set.f.done = t.dataset.v; saveSet(); libRefilter(); if (sheetEl) openFilters(); },
  shDone: () => {
    markDirty(); const d = S.sheet.draft, di = $('#f_donedate'); d.done = !d.done;
    if (di) { if (d.done && !di.value) di.value = todayStr(); if (!d.done) di.value = ''; }
    drawShDone();
  },

  loadShots: t => loadShots(t.dataset.rid, t.dataset.save === '1'),
  vmode: t => { const k = t.dataset.k; S.set.vmode = S.set.vmode || {}; S.set.vmode[k] = vmodeOf(k) === 'list' ? 'tiles' : 'list'; saveSet(); render(); },
  editGenres: t => {
    const sh = S.sheet, row = $('#genresRow'); if (!sh || !row) return;
    sh.genresEdit = !sh.genresEdit; row.classList.toggle('hidden', !sh.genresEdit); t.textContent = sh.genresEdit ? '✓ Готово' : '✎ Изменить';
    if (sh.genresEdit) { const i = $('#f_genres'); if (i && i.focus) i.focus(); }
  },
  noop: () => {},
  mgTool: () => openMergeTool(),
  mgMode: t => { S.mgYear = t.dataset.v === '1'; openMergeTool(); },
  mgOpen: t => openMergeCompare(t.dataset.ids.split(','), true),
  mgBack: () => openMergeTool(),
  mgCompare: () => drawMergeCompare(),
  mgMain: t => { const cards = S.mg.ids.map(gameById).filter(Boolean); S.mg.main = t.dataset.id; S.mg.res = mgBase(gameById(t.dataset.id), cards); drawMergeCompare(); },
  mgTake: t => { S.mg.res[t.dataset.k] = mgGet(gameById(t.dataset.id), t.dataset.k); drawMergeCompare(); },
  mgAdd: t => { const k = t.dataset.k; S.mg.res[k] = mgUnion(S.mg.res[k], gameById(t.dataset.id)[k]); drawMergeCompare(); },
  mgUnion: t => { const k = t.dataset.k; S.mg.res[k] = S.mg.ids.map(gameById).filter(Boolean).reduce((a, c) => mgUnion(a, c[k]), S.mg.res[k] || []); drawMergeCompare(); },
  mgEdit: async t => {
    const k = t.dataset.k, f = MG_FIELDS.find(x => x[0] === k), r = S.mg.res, cards = S.mg.ids.map(gameById).filter(Boolean); let v;
    if (f[2] === 'b') r.done = !r.done;
    else if (f[2] === 'c') { v = await pickCollections('Коллекции результата', r.collections || [], true); if (v === null) return; r.collections = v; }
    else if (f[2] === 'p') { const all = cards.reduce((a, c) => mgUnion(a, c.platforms), r.platforms || []); v = await askChoose({ title: 'Основная платформа', items: all.map(x => ({ id: x, label: shortPlat(x), ico: '🎮' })) }); if (v === null) return; r.mainPlatform = v; if (!(r.platforms || []).includes(v)) r.platforms = mgUnion(r.platforms, [v]); }
    else if (f[2] === 'l') { v = await askPrompt(f[1] + ' (через запятую)', (r[k] || []).join(', ')); if (v === null) return; r[k] = csv(v); }
    else { v = await askPrompt(f[1], r[k] == null ? '' : String(r[k])); if (v === null) return; r[k] = f[2] === 'n' ? (parseFloat(String(v).replace(',', '.')) || 0) : v.trim(); }
    drawMergeCompare();
  },
  mgDo: () => openMergePreview(),
  mgGo: async () => { const n = S.mg.ids.length - 1; try { await applyMerge(S.mg); } catch (e) { return toast(e.message); } S.mg = null; closeSheet(); toast('Объединено, удалено карточек: ' + n); renderKeep(); },
  statGo: t => { // график статистики: открыть список игр с этим фильтром
    const f = S.set.f, k = t.dataset.k, v = t.dataset.v;
    Object.assign(f, { q: '', years: [], genres: [], platforms: [], series: [], props: [], mainPlats: [], collections: [], done: '', minRating: 0 });
    if (k === 'done') f.done = 'yes'; else if (k === 'years') f.years = [+v]; else f[k] = [v];
    S.tab = 'library'; S.selMode = false; S.sel.clear(); saveSet(); render(); $('#view').scrollTop = 0;
  },
  inAct: async t => {
    const m = t.dataset.m, items = Array.from(S.inSel).map(id => S.inbox.items.find(i => i.id === id)).filter(i => i && !i.done);
    if (m === 'x') { S.inSelMode = false; S.inSel.clear(); return rerenderInbox(); }
    if (m === 'all') { itemsOf(S.inboxList).filter(i => !i.done).forEach(i => S.inSel.add(i.id)); return rerenderInbox(); }
    if (!items.length) return toast('Выберите строки: долгое нажатие на строку');
    if (m === 'plat') { const v = await pickPlatform(); if (v === null) return; items.forEach(i => { i.platform = v; }); }
    else if (m === 'colls') { const v = await pickCollections('Коллекции для выбранных строк', [], true); if (v === null) return; items.forEach(i => { i.colls = v.slice(); }); }
    else if (m === 'done') { const r = await askChoose({ title: 'Завершено', items: [{ id: 'yes', label: 'Отметить завершёнными' }, { id: 'no', label: 'Не завершены' }] }); if (!r) return; items.forEach(i => { i.markDone = r === 'yes'; }); }
    else if (m === 'reset') items.forEach(i => { delete i.platform; delete i.colls; delete i.markDone; });
    for (const i of items) await DB.put('inboxItems', i);
    toast('Изменено строк: ' + items.length); S.inSel.clear(); S.inSelMode = false; rerenderInbox();
  },
  retGame: () => { const r = S.retGame; S.retGame = null; if (!r) return; S.tab = r.tab; render(); if (gameById(r.id)) openGameSheet(r.id); },
  shEditName: async () => { const inp = $('#f_name'), v = await askPrompt('Название игры', inp.value); if (v === null) return; inp.value = v.trim(); markDirty(); },
  shMenu: async () => {
    const d = S.sheet.draft, srcs = srcsOf(d), miss = ['igdb', 'rawg'].filter(k => !d[k + 'Id']);
    const items = [{ id: 'hltbOpen', label: 'HowLongToBeat', sub: 'время прохождения', ico: '⏱' }, { id: 'cubiqOpen', label: 'Cubiq.ru', sub: 'время прохождения', ico: '⏱' }]
      .concat(miss.map(k => ({ id: 'find:' + k, label: 'Найти в ' + PROV[k].name, ico: '🔍' })), d.series ? [{ id: 'seriesCatalog', label: 'Серия в каталоге', ico: '📚' }] : [], srcs.map(k => ({ id: 'ser:' + k, label: 'Серия ' + PROV[k].name, ico: '📚' })), [{ id: 'shareGame', label: 'Поделиться игрой', ico: '↗' }]);
    const r = await askChoose({ title: 'Действия', items }); if (!r) return;
    if (r.startsWith('find:')) return ACT.findIgdb({ dataset: { src: r.slice(5) } });
    if (r.startsWith('ser:')) return ACT.seriesIgdb({ dataset: { src: r.slice(4) } });
    ACT[r]({ dataset: {} });
  },
  shCover: () => openCoverView(),
  shMainPlat: async () => {
    const d = S.sheet.draft, inp = $('#f_platforms'), list = csv(inp.value);
    if (!list.length) { const v = await pickPlatform(); if (!v) return; inp.value = v; d.mainPlatform = v; }
    else if (list.length === 1) d.mainPlatform = list[0];
    else { const v = await askChoose({ title: 'Основная платформа', items: list.map(x => ({ id: x, label: shortPlat(x), sub: shortPlat(x) !== x ? x : '', ico: '🎮' })) }); if (v === null) return; d.mainPlatform = v; }
    markDirty(); drawShPlats(csv(inp.value));
  },
  shEdit: async t => {
    const k = t.dataset.k, inp = $('#f_' + k), titles = { year: 'Год выпуска', rating: 'Рейтинг (0-10)', time: 'Время прохождения, ч' };
    const v = await askPrompt(titles[k], inp.value); if (v === null) return; inp.value = String(v).replace(',', '.').trim(); markDirty();
  },
  shPlat: t => { markDirty(); const d = S.sheet.draft; d.mainPlatform = d.mainPlatform === t.dataset.v ? '' : t.dataset.v; drawShPlats(csv($('#f_platforms').value)); },
  editPlats: t => {
    const sh = S.sheet, row = $('#platsRow'); if (!sh || !row) return;
    sh.platsEdit = !sh.platsEdit; row.classList.toggle('hidden', !sh.platsEdit); t.textContent = sh.platsEdit ? '✓ Готово' : '✎ Изменить';
    if (sh.platsEdit) { const i = $('#f_platforms'); if (i && i.focus) i.focus(); }
  },
  shotAddFile: () => $('#shotFile').click(),
  shotSave: async t => { const url = S.igdbShots[+t.dataset.i]; if (!url) return; t.textContent = '…'; try { const gid = await sheetGameId(); if (gid) await saveIgdbShot(gid, url); } catch (e) { toast(e.message); } drawShots(); },
  shotSaveAll: () => saveAllShots(),
  shotDel: async (t, e) => {
    e.stopPropagation(); const sh = S.sheet; if (!sh || !await confirmBox('Удалить скриншот из базы?', 'Удалить')) return;
    const gid = sh.draft.id, list = await getShots(gid); list.splice(+t.dataset.i, 1); await putShots(gid, list); drawShots();
  },
  shot: t => { const g = t.dataset.g, i = +t.dataset.i || 0; if (g === 'local') openLb(S.shotUrls, i); else if (g === 'igdb') openLb(S.igdbShots, i); else openLb([t.dataset.full], 0); },
  listOpen: t => { S.inboxList = t.dataset.id; render(); $('#view').scrollTop = 0; },
  listBack: () => { S.inboxList = null; render(); },
  listMenu: (t, e) => { e.stopPropagation(); listMenu(t.dataset.id); },
  itAdd: async () => { const i = $('#itNew'); if (!i || !i.value.trim() || !S.inboxList) return; await addItems(S.inboxList, [i.value]); render(); const n = $('#itNew'); if (n) n.focus(); },
  itPaste: () => pasteModal(S.inboxList),
  itAuto: () => autoResolve(S.inboxList),
  itToggleDone: () => { S.showDone = !S.showDone; render(); },
  itOpen: t => {
    const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it) return;
    if (it.done) { const g = gameById(it.gameId); if (g) openGameSheet(g.id); else toast('Игра удалена из каталога'); return; }
    S.pending = { itemId: it.id, scroll: $('#view').scrollTop }; S.search.src = S.set.mainSrc; S.search.q = it.text; S.search.mode = 'search'; S.tab = 'search'; render(); runSearch(true);
  },
  itOpts: t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (it && !it.done) itemOpts(it); },
  lstPlat: async () => { const l = S.inbox.lists.find(x => x.id === S.inboxList); if (!l) return; const v = await pickPlatform(); if (v === null) return; l.platform = v; await DB.put('inboxLists', l); render(); if (v) applyToLinked(l); },
  lstColls: async () => { const l = S.inbox.lists.find(x => x.id === S.inboxList); if (!l) return; const v = await pickCollections('Коллекции для игр списка', l.colls || [], true); if (v === null) return; l.colls = v; await DB.put('inboxLists', l); render(); if (v.length) applyToLinked(l); },
  lstDone: async () => { const l = S.inbox.lists.find(x => x.id === S.inboxList); if (!l) return; l.markDone = !l.markDone; await DB.put('inboxLists', l); render(); if (l.markDone) applyToLinked(l); },
  itMatch: t => matchItem(S.inbox.items.find(i => i.id === t.dataset.id)),
  itEdit: async t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it || it.done) return; const n = await promptBox('Название игры', it.text); if (n) { it.text = n; await DB.put('inboxItems', it); render(); } },
  itDel: async t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it) return; if (!await confirmBox('Удалить «' + it.text + '» из списка?', 'Удалить')) return; S.inbox.items = S.inbox.items.filter(i => i.id !== it.id); await DB.del('inboxItems', it.id); render(); },
  pendingCancel: () => backToInbox(),
  pendingMatch: () => matchItem(pendingItem()),
  rsSeries: t => showSeries(t.dataset.rid, t.dataset.t),
  saveKey: async () => {
    S.set.igdbId = $('#idIn').value.trim(); S.set.igdbSecret = $('#secIn').value.trim(); S.set.igdbProxy = ($('#proxyIn') ? $('#proxyIn').value.trim() : ''); S.set.igdbToken = ''; S.set.igdbExp = 0; S.block = null; await saveSet(); S.lists = {};
    if (!hasKeys()) return toast('Ключи удалены');
    try { await igdb('/genres', 'fields id; limit 1;'); toast('Ключи работают'); } catch (e) { toast(e.message); }
  },
  export: async () => {
    if (!S.games.some(g => g.shotCount)) return exportData(true);
    const m = await choose({ title: 'Экспорт копии', items: [{ id: 'full', label: 'Полная копия', sub: 'с обложками и скриншотами' }, { id: 'lite', label: 'Без скриншотов', sub: 'файл заметно меньше; данные и обложки сохраняются' }] });
    if (m) exportData(m === 'full');
  },
  import: () => $('#impFile').click(),
  propAdd: async () => { const n = await promptBox('Название свойства'); if (!n) return; if (S.props.some(p => normName(p.name) === normName(n))) return toast('Свойство с таким названием уже есть'); const t = await choose({ title: 'Тип значения', items: [{ id: 'text', label: 'Текст' }, { id: 'number', label: 'Число' }, { id: 'date', label: 'Дата' }] }); if (!t) return; const p = { id: uid(), name: n, type: t }; S.props.push(p); await DB.put('props', p); render(); },
  propDel: async t => { if (!await confirmBox('Удалить свойство и его значения у всех игр?', 'Удалить')) return; const id = t.dataset.id; S.props = S.props.filter(p => p.id !== id); await DB.del('props', id); for (const g of S.games) if (g.props && id in g.props) { delete g.props[id]; await saveGame(g); } S.set.f.props = S.set.f.props.filter(x => x !== id); saveSet(); render(); },
  install: async () => { if (installEvt) { installEvt.prompt(); installEvt = null; render(); } },
  wipe: async () => { if (!await confirmBox('Удалить ВСЕ игры, коллекции и свойства на этом устройстве?', 'Удалить всё')) return; for (const s of ['games', 'collections', 'props', 'covers', 'shots', 'inboxLists', 'inboxItems', 'trash']) await DB.clear(s); S.trash = []; coverCache.clear(); S.games = []; S.collections = []; S.props = []; S.inbox = { lists: [], items: [] }; S.inboxList = null; S.set.f = clone(DEFAULTS.f); saveSet(); render(); toast('Данные удалены'); }
};
document.addEventListener('click', e => {
  if (S.selMode && S.tab === 'library') { const r = e.target.closest('tr[data-gid]'); if (r && !e.target.closest('a')) { if (lp.fired) { lp.fired = false; return; } toggleSel(r.dataset.gid); return; } } // в режиме выбора строка отмечается нажатием в любом месте
  if (S.inSelMode && S.tab === 'inbox') { const r = e.target.closest('[data-iid]'); if (r) { if (lp.fired) { lp.fired = false; return; } toggleInSel(r.dataset.iid); return; } }
  const t = e.target.closest('[data-act]'); if (!t) return;
  const fn = ACT[t.dataset.act]; if (fn) fn(t, e);
});
// Долгое нажатие. На Android палец всегда немного дрожит, а система при долгом нажатии шлёт pointercancel и contextmenu,
// поэтому таймер отменяют только сдвиг больше 12 px и прокрутка, а само нажатие ловится ещё и по contextmenu.
const lpTarget = el => (S.tab === 'library' && el.closest('.card[data-gid], tr[data-gid]')) || el.closest('[data-lpm]');
function lpFire(c) {
  if (!c || lp.fired) return; clearTimeout(lp.t); lp.fired = true;
  if (c.dataset.lpm === 'item') toggleInSel(c.dataset.iid, true); else if (c.dataset.lpm === 'coll') collMenu(c.dataset.id); else if (c.dataset.lpm === 'ser') serMenu(c.dataset.name); else toggleSel(c.dataset.gid, true);
}
document.addEventListener('pointerdown', e => {
  lp.fired = false; clearTimeout(lp.t); const c = lpTarget(e.target); if (!c) return;
  lp.x = e.clientX; lp.y = e.clientY; lp.t = setTimeout(() => lpFire(c), 500);
});
document.addEventListener('pointermove', e => { if (Math.abs(e.clientX - lp.x) + Math.abs(e.clientY - lp.y) > 12) clearTimeout(lp.t); }, true);
document.addEventListener('pointerup', () => { clearTimeout(lp.t); setTimeout(() => { lp.fired = false; }, 450); }, true);
document.addEventListener('scroll', () => clearTimeout(lp.t), true);
document.addEventListener('contextmenu', e => {
  if (e.target.closest && e.target.closest('.card, .tile, .lrow, tr[data-gid]')) e.preventDefault();
  if (e.target.closest) lpFire(lpTarget(e.target));
});
document.addEventListener('keydown', e => { if (e.target.id === 'itNew' && e.key === 'Enter') ACT.itAdd(); });
document.addEventListener('keydown', e => { if (lbEl && lbState && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) lbGo(e.key === 'ArrowRight' ? 1 : -1); });
document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (lbEl) closeLb(); else if (modalEl && modalCancel) modalCancel(); else if (sheetEl) closeSheet(); });

document.addEventListener('input', e => { if (S.sheet && sheetEl && sheetEl.contains(e.target)) markDirty(); }, true);
document.addEventListener('change', e => { if (S.sheet && sheetEl && sheetEl.contains(e.target)) markDirty(); }, true);
let qT, libT;
document.addEventListener('input', e => {
  if (e.target.id === 'q') { S.set.f.q = e.target.value; clearTimeout(libT); libT = setTimeout(() => { saveSet(); renderLibHead(); renderLibBody(); const b = $('#libBody'); if (b) b.scrollTop = 0; }, 250); }
  else if (e.target.id === 'cfind') { S.cFind = e.target.value; const b = $('#tilesBox'); if (b) b.innerHTML = collTilesHtml(); }
  else if (e.target.id === 'sfind') { S.sFind = e.target.value; const b = $('#tilesBox'); if (b) b.innerHTML = seriesTilesHtml(); }
  else if (e.target.id === 'f_genres') drawShGenres(csv(e.target.value));
  else if (e.target.id === 'f_platforms') drawShPlats(csv(e.target.value));
  else if (e.target.id === 'cpq') { const q = normName(e.target.value); $$('#collList .p').forEach(b => b.classList.toggle('hidden', !!q && !normName(b.textContent).includes(q))); }
  else if (e.target.id === 'sq') { clearTimeout(qT); const v = e.target.value; qT = setTimeout(() => { S.search.q = v; runSearch(true); }, 600); }
});
document.addEventListener('change', async e => {
  if (e.target.id !== 'impFile' || !e.target.files[0]) return;
  const file = e.target.files[0]; e.target.value = '';
  try {
    const buf = await file.arrayBuffer(), u8 = new Uint8Array(buf); let d, files = null;
    if (u8[0] === 0x50 && u8[1] === 0x4b) { files = await zipRead(buf); const j = files.get('data.json'); if (!j) throw new Error('В архиве нет data.json'); d = JSON.parse(new TextDecoder().decode(j)); }
    else d = JSON.parse(new TextDecoder().decode(u8));
    const noPics = (d.games || []).filter(g => g.shotCount > 0 && !(d.shots && (d.shots[g.id] || []).some(x => x.d || (x.file && files && files.has(x.file))))).length;
    if (noPics && !await confirmBox('В файле есть ссылки на скриншоты (игр: ' + noPics + '), но самих картинок нет: копия сделана без скриншотов или это отдельный json из архива. Игры загрузятся без этих скриншотов. Продолжить?', 'Загрузить без скриншотов')) return;
    const mode = await choose({ title: 'Импорт: игр в файле ' + ((d.games || []).length), items: [{ id: 'merge', label: 'Объединить с текущими данными' }, { id: 'replace', label: 'Заменить все данные' }] });
    if (!mode) return;
    if (mode === 'replace' && !await confirmBox('Текущие данные будут удалены. Продолжить?', 'Заменить')) return;
    const n = await importData(d, mode, files); await saveSet(); toast('Импортировано игр: ' + n); render();
  } catch (er) { toast(er.message || 'Не удалось прочитать файл'); }
});
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (S.tab === 'settings') render(); });

function applyTheme() {
  const t = S.set.theme || 'dark';
  const dark = t === 'dark' || (t === 'auto' && !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches));
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', dark ? '#0b0b0d' : '#f2f3f6');
}
window.__GC = { mergeGroups, openMergeCompare, applyMerge, mgBase, renderKeep, toggleInSel, handleShared, applyExtra, addParsed, openExport, exportText, copyText, gameLine, zipBuild, zipRead, shotStats, delShots, rawgQuotaTick, refreshOne, rawg, requirePlatform, effItem, applyDefaults, linkItem, pickPlatform, itemOpts, viewInbox, mainOf, NO_MAIN, askMainPlatform, quickTap, bulkMore, openAddCollSheet, openLb, libToolsHtml: () => { renderLibHead(); return $('#libTools').innerHTML; }, filterGames, getShots, putShots, collTilesHtml, seriesTilesHtml, viewCollections, viewSeries, DONE_ID, autoResolve, viewStats, restoreGames, removeGame, canonSeries, findDupes, mergeAllDupes, collectSheet, persistDraft, closeSheet, S, ACT, bump, igdb, hltbFind, sgdbAuto, openSgdb, applyTheme, colsFor, usageHtml, serMenu, viewInbox, addItems, linkItem, createList, pendingItem, render, runSearch, addFromIgdb, importData, openIgdbSheet, openGameSheet, openFilters, openCols, selectionAction, loadAll, renderSearchBody };
(async () => {
  try {
    await loadAll();
    applyTheme();
    if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: light)'); if (mq.addEventListener) mq.addEventListener('change', () => { if (S.set.theme === 'auto') applyTheme(); }); }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
    if (!isNative() && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    const A = plug('App');
    if (isNative() && A) A.addListener('backButton', () => {
      if (lbEl) closeLb(); else if (modalEl && modalCancel) modalCancel(); else if (sheetEl) closeSheet(); else if (S.selMode) { S.selMode = false; S.sel.clear(); renderLibrary(); $('#fab').classList.remove('hidden'); } else if (S.inSelMode) { S.inSelMode = false; S.inSel.clear(); rerenderInbox(); } else if (S.tab === 'inbox' && S.inboxList) { S.inboxList = null; render(); } else if (S.pending) backToInbox(); else if (S.retGame && S.tab === 'search') ACT.retGame(); else if (S.tab !== 'library') { S.tab = 'library'; render(); } else A.exitApp();
    });
    if (isNative() && A && A.addListener) A.addListener('resume', checkShared);
    const q = new URLSearchParams(location.search), tabs = ['library', 'collections', 'series', 'inbox', 'search', 'settings'];
    if (tabs.includes(q.get('tab'))) S.tab = q.get('tab');
    render();
    if (q.get('add') === '1') openGameSheet(null);
    checkShared(); document.addEventListener('visibilitychange', () => { if (!document.hidden) checkShared(); });
    const sharedQ = q.get('text') || q.get('title') || ''; // веб-версия, установленная как приложение: «Поделиться» через share_target
    if (sharedQ && !isNative()) { history.replaceState(null, '', location.pathname); handleShared(sharedQ + (q.get('url') ? ' ' + q.get('url') : '')); }
    const now = Date.now(), le = S.set.lastExport || 0;
    if (S.games.length >= 5 && now - le > 14 * 864e5 && now - (S.set.lastRemind || 0) > 864e5) { S.set.lastRemind = now; saveSet(); toast(le ? 'Последняя резервная копия была ' + Math.floor((now - le) / 864e5) + ' дн. назад: сделайте экспорт в настройках' : 'Резервной копии ещё не было: сделайте экспорт в настройках'); }
  } catch (e) { document.body.innerHTML = '<p style="padding:20px">Ошибка запуска: ' + esc(e.message || e) + '</p>'; }
})();
})();
