// Auto-generated from app.js (tools/i18n/build_en.py). Do not edit by hand.
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
// Журнал ошибок: сбои, которые раньше глотались молча, и необработанные ошибки копятся здесь (настройки, «Данные и копии»)
const ERRLOG = { list: [] };
try { ERRLOG.list = JSON.parse(localStorage.getItem('gc_errlog') || '[]').slice(-100); } catch (e) { ERRLOG.list = []; }
function logErr(where, e) {
  try {
    if (e && e._logged) return;
    const m = String((e && e.message) || e || '').slice(0, 300), st = e && e.stack ? String(e.stack).split('\n').slice(1, 3).map(x => x.trim()).join(' | ').slice(0, 260) : '', last = ERRLOG.list[ERRLOG.list.length - 1];
    if (last && last.w === where && last.m === m) { last.n = (last.n || 1) + 1; last.t = Date.now(); } else ERRLOG.list.push({ t: Date.now(), w: where, m, s: st, n: 1 });
    if (ERRLOG.list.length > 100) ERRLOG.list.splice(0, ERRLOG.list.length - 100);
    localStorage.setItem('gc_errlog', JSON.stringify(ERRLOG.list));
  } catch (x) { /* журнал не должен ронять программу */ }
}
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('error', ev => logErr('program error', ev.error || ev.message));
  window.addEventListener('unhandledrejection', ev => logErr('unhandled error', ev.reason));
}
const isNative = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
function openExternal(url) { // в приложении Android страница открывается внутри приложения (Custom Tab), в браузере в новой вкладке
  const B = plug('Browser'); if (isNative() && B && B.open) B.open({ url }); else window.open(url, '_blank', 'noopener');
}
const plug = n => window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n];

const COLS = [['cover', 'Cover'], ['genres', 'Genres'], ['platforms', 'Platforms'], ['done', 'Completed'], ['doneDate', 'Completion date'], ['year', 'Year'], ['rating', 'Rating'], ['time', 'Time'], ['series', 'Series'], ['franchise', 'Franchise'], ['colls', 'Collections'], ['added', 'Date added']];
const SORTS = [['name', 'Title'], ['year', 'Year'], ['rating', 'Rating'], ['time', 'Playtime'], ['series', 'Series'], ['franchise', 'Franchise'], ['added', 'Date added'], ['done', 'Completed'], ['doneDate', 'Completion date']];
const DEFAULTS = {
  platDict: {}, genreDict: {}, rawgKey: '', mainSrc: 'igdb', rawgQuota: { left: 20000, renew: '' }, rawgWarn: 0, igdbId: '', igdbSecret: '', igdbToken: '', igdbExp: 0, anim: true, match: { cLow: 85, cHigh: 98, sLow: 50, sHigh: 98 }, sync: { url: '', token: '', on: true, scheme: 'http', auto: true, off: 0, last: 0, msg: '', err: '', igdb: false }, exp: { fmt: 'csv', keys: ['name', 'year', 'platforms', 'time', 'done'] }, sgdbKey: '', pin: true, propCols: {}, theme: 'dark', zoom: {}, usage: { m: '', igdb: 0, sgdb: 0, hltb: 0 }, hltbCache: {}, view: 'grid', group: '', groupDir: 'asc', tcols: { year: 1, platforms: 1, series: 1, time: 1, done: 1, main: 1 }, colW: {}, mgW: {}, pageSize: 40, vmode: { coll: 'tiles', series: 'tiles', search: 'tiles' },
  cols: { cover: 1, genres: 1, platforms: 1, done: 1, doneDate: 1, year: 1, rating: 1, time: 1, series: 1, franchise: 0, colls: 1, added: 1 },
  f: { q: '', years: [], genres: [], platforms: [], series: [], collections: [], collMode: 'or', props: [], addedFrom: '', addedTo: '', seriesMode: '', franchise: [], franchiseMode: '', maxTime: 0, done: '', minRating: 0, sort: 'name', dir: 'asc' }
};

/* ====================== Чистая логика ====================== */
const NO_COLL = '__nocoll'; // встроенная коллекция «Без коллекций»: игры, не входящие ни в одну коллекцию (считается, не хранится)
const DONE_ID = '__done'; // встроенная коллекция «Завершено»: игры с отметкой, хранится не в базе, а считается
const RESERVED = /*i18n:keep*/ ['все игры', 'завершено', 'пройдено', 'all games', 'completed', 'done'] /*i18n:end*/;
const LANG = 'en'; // в английской сборке (app.en.js) заменяется на 'en'
const langPref = () => { try { return localStorage.getItem('gc_lang') || ''; } catch (e) { return ''; } };
const LOC = LANG === 'en' ? 'en' : 'ru', LOC_DATE = LANG === 'en' ? 'en-GB' : 'ru-RU';
const gWord = n => { if (LANG === 'en') return n + ' ' + (n === 1 ? 'game' : 'games'); const a = n % 100, b = n % 10; /*i18n:keep*/ return n + ' ' + (a > 10 && a < 15 ? 'игр' : b === 1 ? 'игра' : b > 1 && b < 5 ? 'игры' : 'игр'); /*i18n:end*/ };
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
// «Xbox Series X|S» в текстах (выгрузка, текстовый вид, разбор) пишется как «Xbox Series X/S»: «|» в строке с разделителями ломает разбор
const platOut = s => String(s == null ? '' : s).replace(/X\s*\|\s*S/g, 'X/S');
let platHook = null; // подключается приложением: словарь платформ
function shortPlat(n) {
  if (platHook) { const r = platHook(n); if (r) return r; }
  const m = [[/^PlayStation (\d)/i, '$&'], [/^Xbox Series/i, 'Series X|S'], [/^Xbox One/i, 'XONE'], [/^Xbox 360/i, 'X360'], [/^Nintendo Switch 2/i, 'Switch 2'], [/^Nintendo Switch/i, 'Switch'], [/^PS Vita/i, 'Vita'], [/^PlayStation Vita/i, 'Vita']];
  for (const [re, to] of m) { if (re.test(n)) return to === '$&' ? n.replace(/^PlayStation (\d)/i, 'PS$1') : to; }
  return n.replace(/^PlayStation$/i, 'PS1').replace('Apple Macintosh', 'Mac').replace('Nintendo ', '');
}
function filterGames(games, f) {
  const q = (f.q || '').trim().toLowerCase();
  const yrs = f.years.length ? new Set(f.years.map(String)) : null, gen = f.genres.length ? new Set(f.genres) : null, pl = f.platforms.length ? new Set(f.platforms) : null;
  const ser = f.series.length ? new Set(f.series) : null, fra = (f.franchise || []).length ? new Set(f.franchise) : null;
  const from = f.addedFrom ? new Date(f.addedFrom + 'T00:00:00').getTime() : 0, to = f.addedTo ? new Date(f.addedTo + 'T23:59:59').getTime() : 0;
  const mt = +f.maxTime || 0, cl = f.collections.length ? f.collections : null, andMode = f.collMode === 'and';
  return games.filter(g => {
    if (q && !g.name.toLowerCase().includes(q)) return false;
    if (yrs && !yrs.has(String(g.year))) return false;
    if (gen && !(g.genres || []).some(x => gen.has(x))) return false;
    if (pl && !(g.platforms || []).some(x => pl.has(x))) return false;
    if (ser && !ser.has(g.series)) return false;
    if (fra && !fra.has(g.franchise)) return false;
    if ((from || to) && !g.added) return false; // у старых игр даты добавления нет
    if (from && g.added < from) return false;
    if (to && g.added > to) return false;
    if (f.done === 'yes' && !g.done) return false;
    if (f.done === 'no' && g.done) return false;
    if (mt && !(g.time > 0 && g.time <= mt)) return false; // «до N часов»: игры без времени не подходят
    if (f.minRating && (g.rating || 0) < f.minRating) return false;
    if (cl) {
      const has = id => id === DONE_ID ? !!g.done : id === NO_COLL ? !(g.collections || []).length : (g.collections || []).includes(id);
      if (!(andMode ? cl.every(has) : cl.some(has))) return false;
    }
    if (f.props.length && !f.props.some(id => hasVal(g.props && g.props[id]))) return false;
    return true;
  });
}
// «+ игры серий»: к отобранным играм добавляются все игры их серий (без учёта остальных фильтров), сами отобранные не повторяются
function withFranchise(all, main) { // то же для франшиз: «★ + игры франшиз»
  const fr = new Set(); main.forEach(g => { if (g.franchise) fr.add(g.franchise); }); if (!fr.size) return [];
  const inMain = new Set(main); return all.filter(g => g.franchise && fr.has(g.franchise) && !inMain.has(g));
}
function withSeries(all, main) {
  const ser = new Set(); main.forEach(g => { if (g.series) ser.add(g.series); }); if (!ser.size) return [];
  const inMain = new Set(main); return all.filter(g => g.series && ser.has(g.series) && !inMain.has(g));
}
const GROUPS = [['', 'No grouping'], ['year', 'By release year'], ['genre', 'By genre (first in the list)'], ['series', 'By series'], ['franchise', 'By franchise'], ['done', 'By completion'], ['letter', 'By first letter']];
const NOGROUP = { year: 'No year', genre: 'No genre', series: 'No series', franchise: 'No franchise' };
function groupKey(g, m) {
  if (m === 'year') return g.year ? String(g.year) : '';
  if (m === 'genre') return (g.genres || [])[0] || '';
  if (m === 'series') return g.series || '';
  if (m === 'franchise') return g.franchise || '';
  if (m === 'done') return g.done ? 'Completed' : 'Not completed';
  const c = (g.name || '').trim().charAt(0).toUpperCase(); return /[A-ZА-ЯЁ]/.test(c) ? c : '#';
}
function groupGames(items, m, dir) {
  const map = new Map(); items.forEach(g => { const k = groupKey(g, m); if (!map.has(k)) map.set(k, []); map.get(k).push(g); });
  const d = dir === 'desc' ? -1 : 1;
  return Array.from(map.keys()).sort((a, b) => { if (!a !== !b) return !a ? 1 : -1; if (m === 'year') return (a - b) * d; if (m === 'done') return ((a === 'Completed') - (b === 'Completed')) * d; return COLL_RU.compare(a, b) * d; })
    .map(k => ({ key: k || NOGROUP[m] || '', items: map.get(k) }));
}
// единая последовательность для плитки, списка и текста: заголовки разделов/групп и игры (x = игра не из основного списка)
function buildEntries(sections, group, dir, isExtra) {
  const entries = [], games = [], add = g => { entries.push({ t: 'g', g, x: !!(isExtra && isExtra(g)) }); games.push(g); };
  sections.forEach(sec => {
    if (sec.title) entries.push({ t: 'h', text: sec.title, n: sec.items.length, lvl: 2 });
    if (!group) sec.items.forEach(add); else groupGames(sec.items, group, dir).forEach(gr => { entries.push({ t: 'h', text: gr.key, n: gr.items.length, lvl: 1 }); gr.items.forEach(add); });
  });
  return { entries, games };
}
const COLL_NUM = new Intl.Collator(LOC, { numeric: true }), COLL_RU = new Intl.Collator(LOC); // один сортировщик на все сравнения (localeCompare создавал его каждый раз)
function sortGames(list, f) {
  const k = f.sort, d = f.dir === 'desc' ? -1 : 1;
  const isProp = k.startsWith('prop:');
  const val = g => k === 'name' ? (g.name || '').toLowerCase() : k === 'series' ? (g.series || '').toLowerCase() : k === 'franchise' ? (g.franchise || '').toLowerCase() : isProp ? ((g.props && g.props[k.slice(5)] != null) ? g.props[k.slice(5)] : '') : (g[k] || 0);
  const dec = list.map(g => [g, val(g), g.name || '']); // значения считаем один раз, а не на каждое сравнение
  dec.sort((a, b) => {
    const x = a[1], y = b[1];
    if ((k === 'series' || k === 'franchise' || isProp) && !x !== !y) return !x ? 1 : -1; // пустые значения в конце
    const c = (typeof x === 'string' || typeof y === 'string') ? COLL_NUM.compare(String(x), String(y)) : x - y;
    return c ? c * d : COLL_RU.compare(a[2], b[2]);
  });
  for (let i = 0; i < dec.length; i++) list[i] = dec[i][0];
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
  let t = String(raw).replace(/X\s*\|\s*S/gi, 'X/S').replace(/^\s*(?:\d+[.)]|[-•*–])\s*/, '').trim(); if (!t) return null;
  let gid = ''; const im = t.match(/^id\s*[:=]?\s*([^\s|]+)\s*\|\s*/i); if (im) { gid = im[1]; t = t.slice(im[0].length); }
  // «Название (2013 | PC, PS4 | Серия) – 23 ч»: год, платформы, серия (необязательно) и время в одной строке.
  // Время: «23 ч», «7.5 ч», «~9 ч»; «? ч» значит «не знаю» (0 часов, при автоматическом разборе время возьмётся из IGDB)
  const m = t.match(/^(.*?)\s*\(\s*((?:19|20)\d{2})\s*(?:\|\s*(.*?))?\)\s*(?:[–—-]\s*(?:[~≈]\s*)?(\d+(?:[.,]\d+)?|\?)\s*(?:ч|h)\.?)?\s*$/i);
  if (m && m[1]) {
    let nm0 = m[1].trim(); const ym0 = nm0.match(/^(.*\S)\s*\((\d{4})\)$/); if (ym0 && +ym0[2] === +m[2]) nm0 = ym0[1];
    let platStr = m[3] || '', series = ''; const bar = platStr.indexOf('|'); if (bar >= 0) { series = platStr.slice(bar + 1).replace(/\s*\|\s*/g, ' | ').trim(); platStr = platStr.slice(0, bar); }
    const plats = platStr.split(',').map(x => x.trim()).filter(Boolean), unk = m[4] === '?';
    const row = { text: nm0, year: +m[2], hours: m[4] && !unk ? +m[4].replace(',', '.') : 0 };
    if (unk) row.unk = true;
    if (gid || plats.length || series) { row.x = { gid, platforms: plats }; if (series) row.x.series = series; }
    return row;
  }
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
const EXPORT_COLS = [['id', 'id'], ['name', 'Title'], ['year', 'Year'], ['platforms', 'Platforms'], ['genres', 'Genres'], ['time', 'Time (h)'], ['rating', 'Rating'], ['series', 'Series'], ['franchise', 'Franchise'], ['collections', 'Collections'], ['done', 'Completed'], ['doneDate', 'Completion date'], ['igdbId', 'IGDB id'], ['rawgId', 'RAWG id']];
const HEAD_NAMES = /*i18n:keep*/ { id: ['id', 'код'], name: ['название', 'name', 'игра', 'title'], year: ['год', 'year'], platforms: ['платформы', 'платформа', 'platforms'], genres: ['жанры', 'жанр', 'genres'], time: ['time (h)', 'время (ч)', 'время', 'часы', 'hours', 'time'], rating: ['рейтинг', 'rating'], series: ['серия', 'series'], franchise: ['франшиза', 'franchise'], collections: ['коллекции', 'collections'], done: ['completed', 'завершено', 'пройдено', 'done'], doneDate: ['completion date', 'дата прохождения', 'done date'], igdbId: ['igdb id', 'igdbid'], rawgId: ['rawg id', 'rawgid'] } /*i18n:end*/;
function exportValue(g, key, collName) {
  switch (key) {
    case 'id': return g.id; case 'name': return g.name; case 'year': return g.year || ''; case 'platforms': return platOut((g.platforms || []).join(', '));
    case 'genres': return (g.genres || []).join(', '); case 'time': return g.time || ''; case 'rating': return g.rating || '';
    case 'series': return g.series || ''; case 'franchise': return g.franchise || ''; case 'collections': return (g.collections || []).map(collName).filter(Boolean).join(', ');
    case 'done': return g.done ? 'yes' : ''; case 'doneDate': return g.doneDate || ''; case 'igdbId': return g.igdbId || ''; case 'rawgId': return g.rawgId || '';
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
  const raw = String(text).replace(/^\uFEFF/, '').replace(/X\s*\|\s*S/gi, 'X/S'), first = raw.split(/\r?\n/).find(l => l.trim());
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
        return { text: o.name, year: (y => y >= 1950 && y <= 2100 ? y : 0)(num(o.year)), hours: num(o.time), x: { gid: o.id || '', platforms: lst(o.platforms), genres: lst(o.genres), rating: num(o.rating), series: o.series || '', franchise: o.franchise || '', colls: lst(o.collections), done: /^(да|yes|1|true|✓)$/i.test(o.done || ''), doneDate: o.doneDate || '', igdbId: num(o.igdbId), rawgId: num(o.rawgId) } };
      }).filter(Boolean);
    }
  }
  return raw.split(/\r?\n/).map(parseLine).filter(Boolean);
}

if (typeof document === 'undefined') { // для проверки логики в Node
  module.exports = { statsHours, parseInboxText, buildExport, parseCsv, EXPORT_COLS, DONE_ID, gWord, seriesName, cleanSeries, shortPlat, platOut, filterGames, sortGames, withSeries, buildEntries, groupGames, DEFAULTS, hltbCandidates, similarity, parseLine, sanitizeImport };
  return;
}

/* ====================== Хранилище (IndexedDB) ====================== */
// хранилища, которые синхронизируются со своим сервером; у каждой записи поле mod (время последней правки, мс)
const SYNC_ARR = ['games', 'collections', 'props', 'inboxLists', 'inboxItems', 'covers', 'shots'], SYNC = new Set(SYNC_ARR);
let clockOff = 0; // разница часов этого устройства и сервера, чтобы «позднее» значило одно и то же на всех устройствах
const nowMs = () => Date.now() + clockOff;
const syncDirty = () => { SY.dirty = true; syncSoon(); };
const DB = {
  db: null, tombs: new Map(), // tombs: «хранилище:id» -> время удаления (чтобы удаление дошло до других устройств)
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('gamecatalog', 5);
      r.onupgradeneeded = () => {
        const d = r.result;
        ['games', 'collections', 'props', 'covers', 'shots', 'inboxLists', 'inboxItems', 'trash', 'tomb'].forEach(n => { if (!d.objectStoreNames.contains(n)) d.createObjectStore(n, { keyPath: 'id' }); });
        if (!d.objectStoreNames.contains('settings')) d.createObjectStore('settings', { keyPath: 'key' });
      };
      r.onsuccess = () => { this.db = r.result; this.all('tomb').then(a => { this.tombs = new Map(a.map(x => [x.id, x.t])); res(); }, () => res()); };
      r.onerror = () => { logErr('database (opening)', r.error); rej(r.error); };
    });
  },
  tx(store, mode, fn) {
    return new Promise((res, rej) => {
      const t = this.db.transaction(store, mode); const r = fn(t.objectStore(store));
      t.oncomplete = () => res(r ? r.result : undefined); t.onerror = () => { logErr('database: ' + store, t.error); rej(t.error); }; t.onabort = () => { logErr('database: ' + store, t.error); rej(t.error); };
    });
  },
  all(s) { return this.tx(s, 'readonly', o => o.getAll()); },
  get(s, k) { return this.tx(s, 'readonly', o => o.get(k)); },
  // «сырые» операции: без отметки времени и без записи об удалении (ими пользуется сама синхронизация)
  putRaw(s, v) { return this.tx(s, 'readwrite', o => o.put(v)); },
  putManyRaw(s, arr) { return arr.length ? this.tx(s, 'readwrite', o => { arr.forEach(v => o.put(v)); }) : Promise.resolve(); }, // одна транзакция вместо сотен
  delRaw(s, k) { return this.tx(s, 'readwrite', o => o.delete(k)); },
  clearRaw(s) { return this.tx(s, 'readwrite', o => o.clear()); },
  // обычные операции программы: ставят mod, а удаление запоминают
  stamp(s, arr) {
    const t = nowMs(); arr.forEach(v => { v.mod = t; });
    const back = arr.filter(v => this.tombs.has(s + ':' + v.id)); if (!back.length) return null;
    back.forEach(v => this.tombs.delete(s + ':' + v.id));
    return this.tx('tomb', 'readwrite', o => { back.forEach(v => o.delete(s + ':' + v.id)); });
  },
  put(s, v) {
    if (!SYNC.has(s)) return this.putRaw(s, v);
    const p = this.stamp(s, [v]); syncDirty();
    return p ? p.then(() => this.putRaw(s, v)) : this.putRaw(s, v);
  },
  putMany(s, arr) {
    if (!arr.length) return Promise.resolve();
    if (!SYNC.has(s)) return this.putManyRaw(s, arr);
    const p = this.stamp(s, arr); syncDirty();
    return p ? p.then(() => this.putManyRaw(s, arr)) : this.putManyRaw(s, arr);
  },
  async del(s, k) {
    if (SYNC.has(s)) { const t = nowMs(); this.tombs.set(s + ':' + k, t); await this.putRaw('tomb', { id: s + ':' + k, s, rid: k, t }); syncDirty(); }
    return this.delRaw(s, k);
  },
  async clear(s) {
    if (SYNC.has(s)) {
      const keys = await this.tx(s, 'readonly', o => o.getAllKeys()), t = nowMs(), recs = keys.map(k => ({ id: s + ':' + k, s, rid: k, t }));
      recs.forEach(r => this.tombs.set(r.id, t)); await this.putManyRaw('tomb', recs); syncDirty();
    }
    return this.clearRaw(s);
  },
  // id -> mod для всех записей хранилища, не читая картинки целиком
  mods(s) {
    return new Promise((res, rej) => {
      const out = {}, rq = this.db.transaction(s, 'readonly').objectStore(s).openCursor();
      rq.onsuccess = () => { const c = rq.result; if (c) { out[c.key] = c.value.mod || 1; c.continue(); } else res(out); };
      rq.onerror = () => rej(rq.error);
    });
  }
};

/* ====================== Состояние ====================== */
const S = {
  gopen: { data: true }, localServer: '',
  games: [], collections: [], props: [], set: clone(DEFAULTS), lists: {},
  trash: [], shotUrls: [], igdbShots: [], cFind: '', sFind: '', block: null, inbox: { lists: [], items: [] }, inboxList: null, pending: null, showDone: true,
  tab: 'library', selMode: false, sel: new Set(), shown: [],
  retGame: null, lastGame: '', inSel: new Set(), inSelMode: false, search: { src: 'igdb', kind: 'games', tf: [], cols: [], bind: '', chk: null, sel: new Set(), selMode: false, q: '', f: { genres: [], genreNames: [], platforms: [], platformNames: [], years: [], minRating: 0 }, results: [], stack: [], bundle: null, page: 0, hasMore: false, count: 0, loading: false, token: 0, mode: 'search', title: '', started: false }
};
const coverCache = new Map();
let installEvt = null;
const saveSet = () => DB.put('settings', { key: 'main', value: S.set });
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const fmtTs = t => t ? new Date(t).toLocaleDateString(LOC_DATE) : '';
const fmtDate = t => t ? t.slice(8, 10) + '.' + t.slice(5, 7) + '.' + t.slice(0, 4) : '';
const normName = t => String(t == null ? '' : t).replace(/\s+/g, ' ').trim().toLowerCase();
function canonFranchise(name) { // название франшизы как у уже существующей (без учёта регистра и пробелов)
  const n = String(name || '').replace(/\s+/g, ' ').trim(); if (!n) return '';
  const key = n.toLowerCase(), cnt = new Map();
  S.games.forEach(g => { if (g.franchise && normName(g.franchise) === key) cnt.set(g.franchise, (cnt.get(g.franchise) || 0) + 1); });
  return cnt.size ? Array.from(cnt.entries()).sort((a, b) => b[1] - a[1])[0][0] : n;
}
function canonSeries(name) {
  const n = String(name || '').replace(/\s+/g, ' ').trim(); if (!n) return '';
  const key = n.toLowerCase(), cnt = new Map();
  S.games.forEach(g => { if (g.series && normName(g.series) === key) cnt.set(g.series, (cnt.get(g.series) || 0) + 1); });
  return cnt.size ? Array.from(cnt.entries()).sort((a, b) => b[1] - a[1])[0][0] : n;
}
const gameById = id => S.games.find(g => g.id === id);
const collById = id => S.collections.find(c => c.id === id);
const gamesIn = id => id === NO_COLL ? S.games.filter(g => !(g.collections || []).length) : S.games.filter(g => (g.collections || []).includes(id));
async function saveGame(g) { g.updated = Date.now(); await DB.put('games', g); }
async function saveGames(list) { const t = Date.now(); list.forEach(g => { g.updated = t; }); await DB.putMany('games', list); }

async function reloadData() { // перечитать игры, коллекции и разбор из базы (после синхронизации)
  S.games = (await DB.all('games')).map(g => Object.assign({ genres: [], platforms: [], collections: [], props: {}, series: '', franchise: '', time: 0, rating: 0, year: 0, done: false, hasCover: false, shotCount: 0, igdbId: 0, rawgId: 0 }, g));
  { const old = S.games.filter(g => 'mainPlatform' in g); if (old.length) { old.forEach(g => { delete g.mainPlatform; }); DB.putManyRaw('games', old); } } // основная платформа удалена из программы целиком
  S.collections = await DB.all('collections');
  S.props = await DB.all('props');
  S.inbox = { lists: await DB.all('inboxLists'), items: await DB.all('inboxItems') };
  { const ol = S.inbox.lists.filter(l => 'platform' in l), oi = S.inbox.items.filter(i => 'platform' in i); ol.forEach(l => { delete l.platform; }); oi.forEach(i => { delete i.platform; }); if (ol.length) DB.putManyRaw('inboxLists', ol); if (oi.length) DB.putManyRaw('inboxItems', oi); }
}
async function loadAll() {
  await DB.open();
  await reloadData();
  { const old = S.games.filter(g => 'description' in g); old.forEach(g => { delete g.description; }); DB.putMany('games', old); } // описание удалено из программы целиком
  S.trash = await DB.all('trash');
  for (const r of S.trash.filter(x => Date.now() - x.t > 30 * 864e5)) await DB.del('trash', r.id); // корзина хранит 30 дней
  S.trash = S.trash.filter(x => Date.now() - x.t <= 30 * 864e5);
  const st = await DB.get('settings', 'main');
  if (st && st.value) {
    S.set = Object.assign(clone(DEFAULTS), st.value);
    S.set.cols = Object.assign(clone(DEFAULTS.cols), st.value.cols || {});
    S.set.f = Object.assign(clone(DEFAULTS.f), st.value.f || {});
  }
  S.set.sync = Object.assign(clone(DEFAULTS.sync), S.set.sync); clockOff = S.set.sync.off || 0;
  S.set.zoom = S.set.zoom || {}; S.set.hltbCache = S.set.hltbCache || {};
  S.set.f = Object.assign(clone(DEFAULTS.f), S.set.f);
  S.set.cols = Object.assign({}, DEFAULTS.cols, S.set.cols);
  if (S.set.colsV === 4) { S.set.cols.added = 1; S.set.colsV = 5; saveSet(); }
  if (S.set.colsV !== 4 && S.set.colsV !== 5) { // один раз: основная платформа удалена, в списке снова колонки «Жанры» и «Платформы»
    delete S.set.cols.mainGenre; delete S.set.cols.mainPlatform; S.set.cols.platforms = 1; S.set.cols.genres = 1; S.set.cols.added = 1; S.set.colsV = 5;
    delete S.set.f.mainPlats; if (S.set.group === 'mainPlatform') S.set.group = ''; if (S.set.f.sort === 'mainPlatform') S.set.f.sort = 'name';
    if (S.set.colW) delete S.set.colW.mainPlatform; if (S.set.exp && S.set.exp.keys) S.set.exp.keys = S.set.exp.keys.filter(k => k !== 'mainPlatform');
    if (S.set.saved) S.set.saved = S.set.saved.filter(x => !(x.f && x.f.mainPlats && x.f.mainPlats.length)).map(x => { if (x.f) delete x.f.mainPlats; if (x.f && x.f.sort === 'mainPlatform') x.f.sort = 'name'; return x; });
    saveSet();
  }
  S.set.vmode = Object.assign({ coll: 'tiles', series: 'tiles', search: 'tiles' }, S.set.vmode);
  S.set.f = Object.assign({ franchise: [], franchiseMode: '' }, S.set.f); S.set.cols = Object.assign({ franchise: 0 }, S.set.cols);
  S.set.f.collections = S.set.f.collections.filter(id => id === DONE_ID || id === NO_COLL || S.collections.some(c => c.id === id)); // удалённые коллекции не должны оставаться в фильтре
  S.set.usage = Object.assign({ m: '', igdb: 0, sgdb: 0, hltb: 0 }, S.set.usage);
  const ls = await DB.get('settings', 'lists'); S.lists = ls ? (ls.value || {}) : {};
  if (S.lists.genres) S.lists = S.lists.src === 'igdb' ? { igdb: S.lists } : { rawg: S.lists }; // старый формат: один набор списков
  if (S.set.sgdbOn === undefined) S.set.sgdbOn = !!S.set.sgdbKey; // SteamGridDB включается отдельно; у кого ключ уже был, остаётся включённым
  S.set.platDict = S.set.platDict || {}; S.set.genreDict = S.set.genreDict || {}; S._pi = S._gi = null;
  S.set.rawgQuota = Object.assign({ left: 20000, renew: '' }, S.set.rawgQuota); rawgQuotaTick();
  await canonAll();
  if (S.set.mainSrc !== 'rawg') S.set.mainSrc = 'igdb';
  S.search.src = S.set.mainSrc;
}

/* ====================== Общие списки платформ и жанров ====================== */
// platDict: { 'PS4': { long: 'PlayStation 4', aliases: ['PS 4', ...] } }, в играх хранится только короткое название.
// genreDict: { 'RPG': { aliases: ['Role-playing (RPG)', ...] } }. Варианты написания сводятся к одному названию.
let canonT = null; const saveDictsSoon = () => { clearTimeout(canonT); canonT = setTimeout(saveSet, 800); };
const dictIdx = kind => {
  const key = kind === 'plat' ? '_pi' : '_gi'; if (S[key]) return S[key];
  const m = new Map(), d = S.set[kind === 'plat' ? 'platDict' : 'genreDict'] || {};
  for (const [nm, e] of Object.entries(d)) { m.set(normName(nm), nm); if (e.long) m.set(normName(e.long), nm); (e.aliases || []).forEach(a => m.set(normName(a), nm)); }
  S[key] = m; return m;
};
platHook = n => (S.set && S.set.platDict && Object.keys(S.set.platDict).length) ? dictIdx('plat').get(normName(n)) : undefined;
function canonPlat(n, learn) {
  n = String(n == null ? '' : n).trim(); if (!n) return '';
  const idx = dictIdx('plat'), hit = idx.get(normName(n)) || idx.get(normName(n.replace(/X\s*\/\s*S\b/g, 'X|S'))); if (hit) return hit;
  const sh = shortPlat(n), hit2 = idx.get(normName(sh)), d = S.set.platDict;
  if (hit2) { if (learn && d[hit2] && n !== hit2 && n !== d[hit2].long && !(d[hit2].aliases || []).includes(n)) { (d[hit2].aliases = d[hit2].aliases || []).push(n); S._pi = null; saveDictsSoon(); } return hit2; }
  if (!learn) return sh;
  d[sh] = { long: n !== sh ? n : '', aliases: [] }; S._pi = null; saveDictsSoon(); return sh;
}
function canonGenre(n, learn) {
  n = String(n == null ? '' : n).trim(); if (!n) return '';
  const hit = dictIdx('genre').get(normName(n)); if (hit) return hit;
  if (learn) { S.set.genreDict[n] = { aliases: [] }; S._gi = null; saveDictsSoon(); }
  return n;
}
const canonList = (list, fn) => Array.from(new Set((list || []).map(x => fn(x, true)).filter(Boolean)));
// все карточки, фильтры и разбор приводятся к общим названиям (запускается при загрузке, после импорта и после правок списков)
async function canonAll() {
  let n = 0; const chg = [];
  for (const g of S.games) {
    const pl = canonList(g.platforms, canonPlat), gn = canonList(g.genres, canonGenre);
    if (JSON.stringify(pl) !== JSON.stringify(g.platforms || []) || JSON.stringify(gn) !== JSON.stringify(g.genres || [])) { g.platforms = pl; g.genres = gn; chg.push(g); n++; }
  }
  await DB.putMany('games', chg);
  const f = S.set.f; f.platforms = canonList(f.platforms, canonPlat); f.genres = canonList(f.genres, canonGenre);
  if (n) saveDictsSoon();
  return n;
}
const dictOf = kind => S.set[kind === 'plat' ? 'platDict' : 'genreDict'];
const dictCount = (kind, nm) => S.games.filter(g => (kind === 'plat' ? g.platforms : g.genres || []).includes(nm)).length;
async function dictRewrite(kind, from, to) { // заменить название во всех играх, фильтрах и разборе
  const key = kind === 'plat' ? 'platforms' : 'genres'; let n = 0;
  for (const g of S.games) {
    let ch = false;
    if ((g[key] || []).includes(from)) { g[key] = Array.from(new Set(g[key].map(x => x === from ? to : x))); ch = true; }
    if (ch) { await DB.put('games', g); n++; }
  }
  const f = S.set.f; f[key] = Array.from(new Set((f[key] || []).map(x => x === from ? to : x)));
  return n;
}
async function dictMerge(kind, from, to) {
  const d = dictOf(kind), a = d[from]; if (!a || !d[to] || from === to) return 0;
  d[to].aliases = Array.from(new Set((d[to].aliases || []).concat([from, a.long || ''], a.aliases || []).filter(x => x && x !== to && x !== d[to].long)));
  delete d[from]; S._pi = S._gi = null; const n = await dictRewrite(kind, from, to); saveSet(); return n;
}
async function dictRename(kind, from, to) {
  const d = dictOf(kind); to = String(to).trim(); if (!to || to === from) return 0;
  if (d[to]) return dictMerge(kind, from, to);
  d[to] = d[from]; d[to].aliases = Array.from(new Set((d[to].aliases || []).concat([from]))); delete d[from]; S._pi = S._gi = null; const n = await dictRewrite(kind, from, to); saveSet(); return n;
}
function openDict(kind) {
  const d = dictOf(kind), names = Object.keys(d).sort((a, b) => dictCount(kind, b) - dictCount(kind, a) || a.localeCompare(b, LOC)), plat = kind === 'plat';
  sheetKey = 'dict' + kind; openSheet('<div class="hdr2"><h2>' + (plat ? 'Shared platform list' : 'Shared genre list') + '</h2><button class="btn" data-act="dictAdd" data-kind="' + kind + '">＋ Add</button></div>'
    + '<p class="sub">' + (plat ? 'A platform has a short name (used everywhere) and a long one. The same platform written differently (for example, PS4 and Playstation 4) is merged.' : 'The same genres written differently are merged into one.') + ' Tap a row: rename, merge, delete.</p>'
    + '<div class="mglist">' + (names.map(nm => '<div class="mgrow" data-act="dictRow" data-kind="' + kind + '" data-n="' + esc(nm) + '"><span class="mgn">' + esc(nm) + (plat && d[nm].long ? ' <span class="sub">' + esc(d[nm].long) + '</span>' : '') + '</span><span class="mgc">' + dictCount(kind, nm) + '</span></div>').join('') || '<p class="hint">The list is empty</p>') + '</div>');
}
/* ====================== Обложки ====================== */
const coverMiss = new Set(), coverWant = new Set(); let coverT = 0;
// обложка из базы читается только для показанных игр (при запуске 1000 обложек не грузятся), пока читается, место пустое
const coverSrc = g => {
  const u = coverCache.get(g.id); if (u) return u;
  if (g.hasCover && !coverMiss.has(g.id)) { coverWant.add(g.id); if (!coverT) coverT = setTimeout(flushCovers, 0); return ''; }
  return g.coverUrl ? thumbUrl(g.coverUrl) : '';
};
async function flushCovers() {
  coverT = 0; const ids = Array.from(coverWant); coverWant.clear(); if (!ids.length || !DB.db) return;
  try {
    const rows = await new Promise((res, rej) => {
      const t = DB.db.transaction('covers', 'readonly'), o = t.objectStore('covers'), out = [];
      ids.forEach(id => { const r = o.get(id); r.onsuccess = () => { if (r.result) out.push(r.result); }; });
      t.oncomplete = () => res(out); t.onerror = t.onabort = () => rej(t.error);
    });
    rows.forEach(c => { if (!coverCache.has(c.id)) coverCache.set(c.id, URL.createObjectURL(c.blob)); });
  } catch (e) { logErr('covers from the database', e); /* без обложек из базы покажем ссылку */ }
  ids.forEach(id => { if (!coverCache.has(id)) coverMiss.add(id); });
  const set = new Set(ids); let seen = 0;
  $$('[data-cvid]').forEach(el => { const id = el.dataset.cvid; if (!set.has(id)) return; seen++; const g = gameById(id), u = g ? coverSrc(g) : ''; if (u) { el.style.backgroundImage = 'url(\'' + bgu(u) + '\')'; el.classList.remove('nocover'); } });
  if (!seen && !S.sheet && S.tab !== 'library') renderKeep(); // плитки коллекций и серий перерисуем один раз
}
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
  try { const r = await fetch(thumbUrl(g.coverUrl)); if (!r.ok) return; await setCover(g.id, await toThumb(await r.blob())); } catch (e) { logErr('cover download', e); /* останется ссылка */ }
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
  catch (e) { throw new Error('Could not download the screenshot: no connection, or the site blocks downloads'); }
  list.push({ n: uid(), src: url, blob }); await putShots(gid, list); return true;
}
// для новой игры сначала сохраняем карточку, чтобы было к чему привязать скриншоты
async function sheetGameId() {
  const sh = S.sheet; if (!sh) return null;
  collectSheet(); if (!sh.draft.name) { toast('Enter the game title first'); return null; }
  const ok = await persistDraft(sh); sh.dirty = !ok;
  return ok && gameById(sh.draft.id) ? sh.draft.id : null;
}
async function addShotFiles(files) {
  const gid = await sheetGameId(); if (!gid) return;
  const list = await getShots(gid); let n = 0;
  for (const f of files) { try { list.push({ n: uid(), src: '', blob: await toThumb(f, SHOT_W) }); n++; } catch (e) { /* не картинка */ } }
  if (n) await putShots(gid, list);
  toast(n ? 'Screenshots added: ' + n : 'Could not read the image'); drawShots();
}
async function saveAllShots() {
  const gid = await sheetGameId(); if (!gid) return;
  const have = new Set((await getShots(gid)).map(x => x.src)), todo = S.igdbShots.filter(u => !have.has(u)); let n = 0, fail = 0;
  for (const u of todo) {
    toast('Saving screenshots: ' + (n + fail + 1) + ' of ' + todo.length);
    try { await saveIgdbShot(gid, u); n++; } catch (e) { if (++fail >= 2) break; }
  }
  toast(fail ? 'Saved: ' + n + '. Could not download the rest' : 'Screenshots saved: ' + n); drawShots();
}
const fmtSize = b => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
async function shotStats() {
  const out = [];
  for (const r of await DB.all('shots')) { const g = gameById(r.id); if (!g || !(r.list || []).length) continue; out.push({ id: r.id, name: g.name, n: r.list.length, size: r.list.reduce((a, x) => a + (x.blob ? x.blob.size : 0), 0) }); }
  return out.sort((a, b) => b.size - a.size);
}
async function fillShotStats() {
  const el = $('#shStats'); if (!el) return;
  try { const st = await shotStats(); el.innerHTML = st.length ? 'Games with screenshots: <b>' + st.length + '</b>, screenshots: <b>' + st.reduce((a, x) => a + x.n, 0) + '</b>, size: <b>' + fmtSize(st.reduce((a, x) => a + x.size, 0)) + '</b>' : 'No screenshots in the database'; } catch (e) { el.textContent = 'no data'; }
}
async function delShots(ids) {
  for (const id of ids) { await DB.del('shots', id); const g = gameById(id); if (g) { g.shotCount = 0; await saveGame(g); } }
  toast('Screenshots removed for games: ' + ids.length);
}
function drawShPlats(list) {
  const el = $('#shPlats'); if (!el) return;
  el.innerHTML = list.length ? list.map(x => '<span class="tag m2">' + esc(shortPlat(x)) + '</span>').join('') : '<span class="sub">No platforms specified</span>';
}
async function drawShots() {
  const sh = S.sheet; if (!sh || !$('#shotsSaved')) return;
  const gid = sh.draft.id, list = await getShots(gid);
  if (!S.sheet || S.sheet.draft.id !== gid || !$('#shotsSaved')) return;
  S.shotUrls.forEach(u => URL.revokeObjectURL(u)); S.shotUrls = list.map(x => URL.createObjectURL(x.blob));
  $('#shotsSaved').innerHTML = list.length ? '<div class="sub">Saved in the database: ' + list.length + '</div><div class="shotg">' + list.map((x, i) => '<div class="sh"><img src="' + S.shotUrls[i] + '" data-act="shot" data-g="local" data-i="' + i + '" data-full="' + S.shotUrls[i] + '" alt=""><button class="sx" data-act="shotDel" data-i="' + i + '" aria-label="Delete screenshot">✕</button></div>').join('') + '</div>' : '';
  const have = new Set(list.map(x => x.src).filter(Boolean));
  $$('[data-act="shotSave"]').forEach(b => { const on = have.has(S.igdbShots[+b.dataset.i]); b.classList.toggle('saved', on); b.textContent = on ? '✓ Saved' : '＋ Save'; });
}
function drawShGenres(list) {
  const el = $('#shGenres'); if (!el) return;
  el.innerHTML = list.length ? list.map(x => '<span class="tag">' + esc(x) + '</span>').join('') : '<span class="sub">No genres specified</span>';
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
  return '<div class="banner red">⚠ ' + esc(S.block.text) + '<div class="toolbar" style="margin:8px 0 0">' + (full ? '<button class="btn" data-act="tab" data-tab="settings">Open settings</button>' : '') + '<button class="btn" data-act="unblock">Retry</button></div></div>';
}
function usageHtml() {
  return '<p class="sub">IGDB requests this month: <b>' + usageCount('igdb') + '</b>. IGDB allows 4 requests per second; the app keeps the pauses itself. The counter is kept on this device; the phone and the computer each have their own.</p>';
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
  if (lvl > (S.set.rawgWarn || 0)) { S.set.rawgWarn = lvl; toast('RAWG requests left: ' + q.left); }
  clearTimeout(bump.t); bump.t = setTimeout(saveSet, 1500);
}
function rawgUsageHtml() {
  rawgQuotaTick(); const q = S.set.rawgQuota, used = Math.max(0, RAWG_LIMIT - q.left), pct = Math.min(100, Math.round(used * 100 / RAWG_LIMIT));
  return '<div class="two"><label class="field"><span>Requests left for the period</span><input id="rqLeft" type="number" min="0" inputmode="numeric" value="' + q.left + '"></label><label class="field"><span>Limit renews on</span><input id="rqRenew" type="date" value="' + esc(q.renew) + '"></label></div>'
    + '<div class="toolbar"><button class="btn" data-act="saveQuota">Save the remainder and date</button></div><div class="pb"><i style="width:' + pct + '%;background:' + (pct >= 90 ? '#e5484d' : 'var(--green)') + '"></i></div>'
    + '<p class="sub">As on the RAWG site: remaining requests and the renewal date. The app subtracts every request, and when the date comes it adds 30 days and resets the remainder to ' + RAWG_LIMIT + '. You can enter the values from the site for exact tracking.</p>';
}
async function rawg(path, params = {}) {
  const t0 = Date.now();
  if (!S.set.rawgKey) throw new Error('Enter your RAWG key in settings');
  const bl = blockFor('rawg'); if (bl) throw new Error(bl.text);
  const u = new URL('https://api.rawg.io/api' + path); u.searchParams.set('key', S.set.rawgKey);
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v); });
  let r, attempt = 0;
  for (;;) {
    try { r = await fetch(u.toString()); } catch (e) { throw new Error('No connection to RAWG (check your internet)'); }
    rawgSpend(); // считаем только запросы, дошедшие до сервера
    if (r.status === 429 && attempt++ < 1) {
      let t = ''; try { t = await r.clone().text(); } catch (e) { /* без текста */ }
      if (!/month|quota|exceed/i.test(t)) { await new Promise(x => setTimeout(x, 1800)); continue; }
    }
    break;
  }
  if (!r.ok) {
    let txt = ''; try { txt = await r.text(); } catch (e) { /* без текста */ }
    if (r.status === 429 || /limit|quota|exceed|throttl/i.test(txt)) setBlock('limit', 'The RAWG request limit is used up. Requests are paused; tap “Retry” when the limit renews.', 'rawg');
    else if (r.status === 401 || r.status === 403 || (r.status === 400 && /key/i.test(txt))) setBlock('key', 'The RAWG key was not accepted. Check the key in settings: search and loading from RAWG are blocked.', 'rawg');
    else { if (S.set.debug || DBG.forceTag) dbgCapture({ src: 'rawg', ep: path, q: new URLSearchParams(params).toString(), status: r.status, ms: Date.now() - t0, data: null, error: txt.slice(0, 2000) }); throw new Error('RAWG: error ' + r.status); }
    throw new Error(S.block.text);
  }
  const data = await r.json(); dbgCapture({ src: 'rawg', ep: path, q: new URLSearchParams(params).toString(), status: r.status, ms: Date.now() - t0, data }); return data;
}
// источники данных: IGDB и RAWG; идентификатор результата rid = 'igdb:123' или 'rawg:456'
const PROV = {
  igdb: { name: 'IGDB', color: '#a56bff', ready: () => hasKeys() && !blockFor('igdb'), noKeys: 'Search needs free IGDB keys (Client ID and Client Secret).<br>Get them at: dev.twitch.tv/console/apps' },
  rawg: { name: 'RAWG', color: '#3fb7f0', ready: () => !!S.set.rawgKey && !blockFor('rawg'), noKeys: 'Search needs a free RAWG key.<br>Get it at: rawg.io/apidocs' }
};
const ridOf = (src, id) => src + ':' + id;
const parseRid = rid => { const a = String(rid).split(':'); return { src: a[0] === 'rawg' ? 'rawg' : 'igdb', id: +a[1] }; };
const gameByRid = rid => { const { src, id } = parseRid(rid); return S.games.find(g => g[src + 'Id'] === id); };
const srcsOf = g => ['igdb', 'rawg'].filter(k => g[k + 'Id']);
const otherSrc = src => src === 'igdb' ? 'rawg' : 'igdb';
const srvIgdb = () => !!(S.set.sync && S.set.sync.igdb && syncOn()); // ключи IGDB могут лежать на вашем сервере
const hasKeys = () => !!((S.set.igdbId && S.set.igdbSecret) || srvIgdb());
const proxyBase = () => srvIgdb() ? syncUrl() + '/igdb' : '';
const IGDB_API = 'https://api.igdb.com/v4', IGDB_IMG = 'https://images.igdb.com/igdb/image/upload/';
let igdbQ = Promise.resolve();
const igdbGate = () => { const prev = igdbQ; igdbQ = prev.then(() => new Promise(r => setTimeout(r, window.__gateMs !== undefined ? window.__gateMs : 270))); return prev; }; // не чаще 4 запросов в секунду
async function igdbToken() {
  if (proxyBase()) return ''; // через свой прокси: ключи и токен хранятся там
  if (S.set.igdbToken && S.set.igdbExp > Date.now() + 6e4) return S.set.igdbToken;
  let r; try { r = await fetch('https://id.twitch.tv/oauth2/token?client_id=' + encodeURIComponent(S.set.igdbId) + '&client_secret=' + encodeURIComponent(S.set.igdbSecret) + '&grant_type=client_credentials', { method: 'POST' }); } catch (e) { throw new Error('No connection to Twitch (check your internet; a browser may block the request, use the Android app)'); }
  if (!r.ok) { setBlock('key', 'The IGDB keys were not accepted. Check the Client ID and Client Secret in settings: search and loading from IGDB are blocked.', 'igdb'); throw new Error(S.block.text); }
  const j = await r.json(); S.set.igdbToken = j.access_token; S.set.igdbExp = Date.now() + (j.expires_in || 3600) * 1000; saveSet(); return S.set.igdbToken;
}
// запрос к IGDB: endpoint вида '/games', body на языке запросов IGDB (Apicalypse)
async function igdb(endpoint, body) {
  const t0 = Date.now();
  if (!hasKeys()) throw new Error('Enter the IGDB Client ID and Client Secret in settings');
  const bl = blockFor('igdb'); if (bl) throw new Error(bl.text);
  let r, attempt = 0, fresh = false;
  for (;;) {
    const tk = await igdbToken(); await igdbGate();
    try { r = await fetch((proxyBase() || IGDB_API) + endpoint, { method: 'POST', headers: proxyBase() ? { 'Content-Type': 'text/plain', 'X-Token': S.set.sync.token } : { 'Client-ID': S.set.igdbId, Authorization: 'Bearer ' + tk, 'Content-Type': 'text/plain', Accept: 'application/json' }, body }); } catch (e) {
      if (proxyBase()) { // включён локальный сервер, но он не отвечает: предлагаем отключить, чтобы поиск пошёл напрямую
        if (await confirmBox('Local server mode is on in the settings, but the server is unreachable: it may not be running on the computer. Turn the local server off so that IGDB search works?', 'Disconnect the server')) { S.set.sync.on = false; await saveSet(); if (S.tab === 'settings') render(); if (hasKeys()) continue; throw new Error('The local server is off. Enter your IGDB keys in the settings'); }
        throw new Error('The local server is unreachable');
      }
      throw new Error('No connection to IGDB (check your internet; a browser may block requests, use the Android app)');
    }
    bump('igdb'); // считаем только запросы, дошедшие до сервера
    if (r.status === 401 && !fresh) { fresh = true; S.set.igdbToken = ''; continue; } // токен мог устареть
    if (r.status === 429 && attempt++ < 2) { await new Promise(x => setTimeout(x, 1500)); continue; }
    break;
  }
  if (!r.ok) {
    if (r.status === 429) setBlock('limit', 'IGDB is rejecting requests because of their rate. Wait a moment and tap “Retry”.', 'igdb');
    else if (r.status === 401 || r.status === 403) setBlock('key', 'The IGDB keys were not accepted. Check the Client ID and Client Secret in settings: search and loading from IGDB are blocked.', 'igdb');
    else { if (S.set.debug || DBG.forceTag) { let tx = ''; try { tx = await r.clone().text(); } catch (e) { /* без текста */ } dbgCapture({ src: 'igdb', ep: endpoint, q: body, status: r.status, ms: Date.now() - t0, data: null, error: tx.slice(0, 2000) }); } throw new Error('IGDB: error ' + r.status); }
    throw new Error(S.block.text);
  }
  const data = await r.json(); dbgCapture({ src: 'igdb', ep: endpoint, q: body, status: r.status, ms: Date.now() - t0, data }); return data;
}
const igdbImg = (id, size) => id ? IGDB_IMG + 't_' + size + '/' + id + '.jpg' : '';
const sizeUrl = (u, size) => String(u).replace(/\/t_[a-z0-9_]+\//, '/t_' + size + '/');
const coverOf = (x, size) => x && x.cover && x.cover.image_id ? igdbImg(x.cover.image_id, size) : '';
const yearOf = x => x.first_release_date ? new Date(x.first_release_date * 1000).getUTCFullYear() : 0;
const hoursOf = t => { const sec = t && (t.normally || t.hastily || t.completely); return sec ? Math.max(1, Math.round(sec / 3600)) : 0; };
// названия платформ IGDB приводим к привычным (как в каталоге и в shortPlat)
const PLAT_FIX = { 'PC (Microsoft Windows)': 'PC', 'Mac': 'macOS', 'Xbox Series X|S': 'Xbox Series S/X', 'PlayStation Vita': 'PS Vita', 'PlayStation Portable': 'PSP', 'Super Nintendo Entertainment System': 'SNES', 'Nintendo Entertainment System': 'NES', 'Sega Mega Drive/Genesis': 'SEGA Genesis' };
const platName = n => PLAT_FIX[n] || n;
const platC = (n, learn) => canonPlat(platName(n), learn);
const GAME_TYPES = 'game_type = (0,4,6,8,9,10,11)'; // для серий игр: игра, самостоятельное дополнение, эпизод, ремейк, ремастер, расширенная версия, порт (без бандлов, DLC, патчей, паков и модов)
// типы карточек IGDB (game_type): в поиске показываются все, в фильтрах выбираются нужные (выбор запоминается)
const IGDB_TYPES = [[0, 'Game'], [1, 'DLC'], [2, 'Expansion'], [3, 'Bundle'], [4, 'Standalone expansion'], [5, 'Mod'], [6, 'Episode'], [7, 'Season'], [8, 'Remake'], [9, 'Remaster'], [10, 'Expanded game'], [11, 'Port'], [12, 'Fork'], [13, 'Pack'], [14, 'Update']];
const TYPE_CHIP = { 0: 'Game', 1: 'DLC', 2: 'Exp.', 3: 'Bundle', 4: 'Standalone', 5: 'Mod', 6: 'Episode', 7: 'Season', 8: 'Remake', 9: 'Remaster', 10: 'Expanded', 11: 'Port', 12: 'Fork', 13: 'Pack', 14: 'Patch' };
const TYPE_NAME = {}; IGDB_TYPES.forEach(([i, n]) => { TYPE_NAME[i] = n; });
const QUICK_TYPES = [0, 8, 3]; // быстрый набор: игры, ремейки, бандлы
const ALL_TYPES = IGDB_TYPES.map(t => t[0]);
const DEF_TYPES = [0, 3, 4, 6, 8, 9, 10, 11]; // по умолчанию: игры, бандлы, самостоятельные дополнения, эпизоды, ремейки, ремастеры, расширенные версии, порты
const searchTypes = () => { const t = S.set.searchTypes; return Array.isArray(t) && t.length ? t.map(Number) : DEF_TYPES; };
const typesCustom = () => searchTypes().slice().sort((a, b) => a - b).join() !== DEF_TYPES.join();
const typeWhere = () => 'game_type = (' + searchTypes().join(',') + ')';
const typeOf = x => { const t = x && x.game_type; return t && typeof t === 'object' ? t.id : t; };
const isBundleType = t => t === 3 || t === 13; // бандл и пак: несколько игр в одной карточке
const looksBundle = n => /\b(collection|collections|trilogy|bundle|compilation|anthology|duology|quadrilogy)\b/i.test(String(n || ''));
const typeChip = (t, cls) => t != null && TYPE_CHIP[t] ? '<span class="tchip t' + t + (cls ? ' ' + cls : '') + '">' + (cls === 'lg' ? TYPE_NAME[t] : TYPE_CHIP[t]) + '</span>' : '';
const bbadge = rid => '<button class="bbadge" data-act="bundleOpen" data-rid="' + rid + '" aria-label="Bundle games" title="Bundle games">B</button>';
// фильтры поиска: несколько значений каждого вида
const fa = (f, k) => Array.isArray(f[k]) ? f[k] : [];
const fClear = (f, all) => { f.genres = []; f.genreNames = []; f.platforms = []; f.platformNames = []; if (all) { f.years = []; f.minRating = 0; } };
const hasSearchFilter = f => !!(fa(f, 'genres').length || fa(f, 'platforms').length || fa(f, 'years').length);
const yearsRange = f => { const ys = fa(f, 'years').map(Number).filter(Boolean); return ys.length ? Math.min(...ys) + '-01-01,' + Math.max(...ys) + '-12-31' : ''; };
const IGDB_FIELDS = 'name,first_release_date,total_rating,cover.image_id,genres.name,platforms.name,game_type';
const IGDB_DETAIL = IGDB_FIELDS + ',summary,url,collections.id,collections.name,franchise.id,franchise.name,franchises.id,franchises.name';
/* серия игры в IGDB: у игры может быть несколько коллекций (например, «Judgment» и родительская «Yakuza: Like a Dragon»); главной считается дочерняя, как «Series» на сайте IGDB */
const colInfo = new Map(); // id коллекции -> { n: число игр, parents: Set id родительских коллекций }
const colUp = new Map(); // id коллекции -> Set id прямых родителей (по /collection_relations, в IGDB это «Is a spin-off of»/«Series»)
const relParent = x => x && (x.parent_collection && typeof x.parent_collection === 'object' ? x.parent_collection.id : x.parent_collection);
const relChild = x => x && (x.child_collection && typeof x.child_collection === 'object' ? x.child_collection.id : x.child_collection);
async function loadColUp(ids) { // родители коллекций: берём из /collection_relations (в раскрытом поле as_child_relations IGDB отдаёт только id связи)
  let level = Array.from(new Set(ids)).filter(id => !colUp.has(id));
  for (let depth = 0; depth < 3 && level.length; depth++) {
    const next = [];
    for (let i = 0; i < level.length; i += 50) {
      const part = level.slice(i, i + 50), r = await igdb('/collection_relations', 'fields parent_collection,child_collection; where child_collection = (' + part.join(',') + '); limit 500;');
      part.forEach(id => colUp.set(id, new Set()));
      r.forEach(x => { const c = relChild(x), p = relParent(x); if (c && p && colUp.has(c)) { colUp.get(c).add(p); if (!colUp.has(p) && !next.includes(p)) next.push(p); } });
    }
    level = next.filter(id => !colUp.has(id));
  }
}
const colAnc = id => { const out = new Set(), st = [id]; while (st.length) { const c = st.pop(); (colUp.get(c) || []).forEach(p => { if (!out.has(p) && p !== id) { out.add(p); st.push(p); } }); } return out; };
async function loadColInfo(ids) {
  const all = Array.from(new Set(ids)), need = all.filter(id => !colInfo.has(id));
  await loadColUp(all); // сначала связи: без них серия определится неверно, ошибку не глотаем и ничего не кэшируем
  for (let i = 0; i < need.length; i += 100) {
    const part = need.slice(i, i + 100), r = await igdb('/collections', 'fields name,games; where id = (' + part.join(',') + '); limit ' + part.length + ';');
    r.forEach(c => colInfo.set(c.id, { n: (c.games || []).length, parents: colUp.get(c.id) || new Set() }));
    part.forEach(id => { if (!colInfo.has(id)) colInfo.set(id, { n: 1e9, parents: colUp.get(id) || new Set() }); });
  }
}
function leafOf(cs) { // дочерняя коллекция, если между коллекциями игры есть родство (в том числе через промежуточные); иначе null
  if (!cs || cs.length < 2) return null;
  const leaves = cs.filter(c => !cs.some(o => o.id !== c.id && colAnc(o.id).has(c.id))); if (leaves.length === cs.length) return null;
  return leaves.slice().sort((a, b) => ((colInfo.get(a.id) || {}).n || 1e9) - ((colInfo.get(b.id) || {}).n || 1e9))[0];
}
async function primaryCollection(cs) { cs = cs || []; if (cs.length > 1) { try { await loadColInfo(cs.map(c => c.id)); } catch (e) { if (S.block) throw e; } } return leafOf(cs) || cs[0] || null; }
const allColIds = lists => lists.reduce((a, cs) => cs && cs.length > 1 ? a.concat(cs.map(c => c.id)) : a, []);
const frOf = d => { const seen = new Set(); return [d.franchise].concat(d.franchises || []).filter(x => x && x.id && !seen.has(x.id) && seen.add(x.id)); }; // все франшизы игры IGDB: основная первой
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
// время прохождения одной игры из IGDB (часы, 0 если в IGDB времени нет)
async function igdbTimeOf(id) {
  const tt = await igdb('/game_time_to_beats', 'fields game_id,hastily,normally,completely; where game_id = ' + (+id) + ';');
  return hoursOf(tt && tt[0]);
}
async function fillTimeIgdb(g) { const h = await igdbTimeOf(g.igdbId); if (h > 0 && !g.time) { g.time = h; await saveGame(g); } return h; }
const igdbQuote = q => String(q).replace(/["\\]/g, ' ').trim();
async function igdbPage(q, f, page) {
  const w = [typeWhere()], n = S.set.pageSize || 40, gs = fa(f, 'genres'), ps = fa(f, 'platforms'), ys = fa(f, 'years');
  if (gs.length) w.push('genres = (' + gs.map(Number).join(',') + ')');
  if (ps.length) w.push('platforms = (' + ps.map(Number).join(',') + ')');
  if (ys.length) w.push('(' + ys.map(y => '(first_release_date >= ' + Date.UTC(+y, 0, 1) / 1000 + ' & first_release_date < ' + Date.UTC(+y + 1, 0, 1) / 1000 + ')').join(' | ') + ')');
  const where = 'where ' + w.join(' & ') + ';', srch = q ? 'search "' + igdbQuote(q) + '"; ' : '';
  const list = await igdb('/games', srch + 'fields ' + IGDB_FIELDS + '; ' + where + (q ? '' : ' sort total_rating_count desc;') + ' limit ' + n + '; offset ' + page * n + ';');
  let count = 0;
  if (page === 0) { try { count = (await igdb('/games/count', srch + where)).count || 0; } catch (e) { if (S.block) throw e; } }
  list.forEach(x => { x._src = 'igdb'; }); await attachTimes(list);
  return { results: list, count, next: list.length === n };
}
// игры внутри бандла: в IGDB у каждой игры есть список бандлов, в которые она входит
async function bundleGames(id) {
  const list = await igdb('/games', 'fields ' + IGDB_FIELDS + '; where bundles = (' + (+id) + '); sort first_release_date asc; limit 100;');
  list.forEach(x => { x._src = 'igdb'; }); await attachTimes(list); return list.map(mapItem);
}
// найденная игра - бандл (несколько игр в одной карточке)? Тип «бандл»/«пак» или в названии «collection»/«trilogy» и в IGDB у неё есть хотя бы две входящие игры
async function isBundleMatch(x) {
  if (isBundleType(x.type)) return true; if (!looksBundle(x.name)) return false;
  try { return ((await igdb('/games/count', 'where bundles = (' + parseRid(x.rid).id + ');')).count || 0) >= 2; } catch (e) { if (S.block) throw e; return false; }
}
const mapIgdb = x => ({
  src: 'igdb', rid: ridOf('igdb', x.id), name: x.name, year: yearOf(x), rating: x.total_rating ? Math.round(x.total_rating) / 10 : 0,
  time: x.time || 0, cover: coverOf(x, 'cover_big'), platforms: (x.platforms || []).map(p => platC(p.name)), genres: (x.genres || []).map(g => canonGenre(g.name)), type: typeOf(x)
});
const mapRawg = x => ({
  src: 'rawg', rid: ridOf('rawg', x.id), name: x.name, year: x.released ? +x.released.slice(0, 4) : 0, rating: x.rating ? Math.round(x.rating * 20) / 10 : 0,
  time: 0, cover: x.background_image || '', platforms: (x.platforms || []).map(p => canonPlat(p.platform.name)), genres: (x.genres || []).map(g => canonGenre(g.name))
});
const mapItem = x => x._src === 'rawg' ? mapRawg(x) : mapIgdb(x);
// страница результатов RAWG (page_size у RAWG не больше 40: большие порции собираются из нескольких запросов)
async function rawgPage(q, f, page) {
  const n = S.set.pageSize || 40, per = Math.ceil(n / 40), size = Math.ceil(n / per); let results = [], count = 0, next = false;
  for (let j = 0; j < per; j++) {
    const d = await rawg('/games', { search: q, page: page * per + j + 1, page_size: size, genres: fa(f, 'genres').join(','), platforms: fa(f, 'platforms').join(','), dates: yearsRange(f), ordering: q ? '' : '-added' });
    results = results.concat(d.results || []); count = d.count || count; next = !!d.next; if (!d.next) break;
  }
  results.forEach(x => { x._src = 'rawg'; });
  return { results, count, next };
}
const detCache = new Map();
const detFresh = id => { const c = detCache.get(id); return c && Date.now() - c.t < 6e5 ? c.v : null; };
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
  const d = g[0]; if (!d) throw new Error('Game not found in IGDB'); d._src = 'igdb';
  d.time = hoursOf(tt[0]);
  const col = await primaryCollection(d.collections || []); let count = 0, bcount = 0;
  if (col) { try { count = Math.min((await igdb('/games/count', 'where collections = (' + col.id + ') & id != ' + id + ' & ' + GAME_TYPES + ';')).count || 0, 40); } catch (e) { if (S.block) throw e; } }
  const fr0 = frOf(d)[0]; let fcount = 0;
  if (fr0) { try { fcount = Math.min((await igdb('/games/count', 'where (franchise = ' + fr0.id + ' | franchises = (' + fr0.id + ')) & id != ' + id + ' & ' + GAME_TYPES + ';')).count || 0, 500); } catch (e) { if (S.block) throw e; } }
  if (isBundleType(typeOf(d)) || looksBundle(d.name)) { try { bcount = (await igdb('/games/count', 'where bundles = (' + id + ');')).count || 0; } catch (e) { if (S.block) throw e; } }
  return { d, series: col ? col.name : '', franchise: (fr0 || {}).name || '', franchiseId: fr0 ? fr0.id : 0, franchiseCount: fcount, seriesCount: count, bundleCount: bcount };
}
function gameFromIgdb(d, series, franchise) {
  return {
    id: uid(), igdbId: d.id, name: d.name, year: yearOf(d), rating: d.total_rating ? Math.round(d.total_rating) / 10 : 0,
    time: d.time || 0, genres: canonList((d.genres || []).map(x => x.name), canonGenre), igdbUrl: d.url || '',
    platforms: canonList((d.platforms || []).map(x => platName(x.name)), canonPlat), series, franchise: franchise || '', coverUrl: coverOf(d, 'cover_big_2x'), coverSrc: 'igdb', hasCover: false,
    collections: [], props: {}, done: false, doneDate: '', shotCount: 0, added: Date.now(), updated: Date.now()
  };
}
function gameFromRawg(d, series) {
  return {
    id: uid(), rawgId: d.id, name: d.name, year: d.released ? +d.released.slice(0, 4) : 0, rating: d.rating ? Math.round(d.rating * 20) / 10 : 0,
    time: 0, genres: canonList((d.genres || []).map(x => x.name), canonGenre), rawgUrl: d.slug ? 'https://rawg.io/games/' + d.slug : '',
    platforms: canonList((d.platforms || []).map(x => x.platform.name), canonPlat), series, franchise: '', coverUrl: d.background_image || '', coverSrc: 'rawg', hasCover: false,
    collections: [], props: {}, done: false, doneDate: '', shotCount: 0, added: Date.now(), updated: Date.now()
  };
}
const gameFromDetails = (d, series, franchise) => d._src === 'rawg' ? gameFromRawg(d, series) : gameFromIgdb(d, series, franchise);
const yearOfD = d => d._src === 'rawg' ? (d.released ? +d.released.slice(0, 4) : 0) : yearOf(d);
/* ====== Карточка серии: состав, прогресс, проверка, правка названия ====== */
const scList = name => { const k = serKey(name); return S.games.filter(g => g.series && serKey(g.series) === k).sort((a, b) => (+a.year || 9999) - (+b.year || 9999) || (a.added || 0) - (b.added || 0) || String(a.name).localeCompare(String(b.name), LOC)); };
function serMigrate(a, b) { const ka = serKey(a), kb = serKey(b); if (ka === kb) return; ['serOk', 'serCol', 'serChk', 'serIgnore'].forEach(m => { const o = serMap(m); if (o[ka] !== undefined) { if (o[kb] === undefined) o[kb] = o[ka]; delete o[ka]; } }); }
function serInLibrary(name) { Object.assign(S.set.f, { q: '', years: [], genres: [], platforms: [], series: [name], franchise: [], collections: [], props: [], addedFrom: '', addedTo: '', seriesMode: '', franchiseMode: '', maxTime: 0, done: '', minRating: 0 }); saveSet(); S.retGame = null; S.tab = 'library'; render(); }
function openSerCard(name) { S.serCard = { name, sel: new Set(), selMode: false }; closeSheet(); S.tab = 'sercard'; render(); const b = $('#scBody'); if (b) b.scrollTop = 0; }
async function serRenameAll(name, n, noSnap) { // переименовать серию у всех игр (если такая серия уже есть, игры объединяются с ней)
  const games = scList(name), f = S.set.f, snap = noSnap ? null : takeSnap(); n = serKey(n) === serKey(name) ? String(n).trim() : canonSeries(n);
  for (const g of games) g.series = n; await saveGames(games); f.series = f.series.map(x => x === name ? n : x); serMigrate(name, n);
  if (S.serCard && serKey(S.serCard.name) === serKey(name)) S.serCard.name = n; saveSet(); return { n, snap };
}
function serCardInfoHtml() {
  const c = S.serCard, name = c.name, k = serKey(name), list = scList(name), done = list.filter(g => g.done).length, pc = list.length ? Math.round(done * 100 / list.length) : 0;
  const chk = serMap('serChk')[k], ok = !!serMap('serOk')[k], col = serMap('serCol')[k], miss = ok ? 0 : chk && !chk.none ? Math.max(0, chk.total - chk.have) : -1;
  const hours = Math.round(list.reduce((a, g) => a + (+g.time || 0), 0) * 10) / 10, rated = list.filter(g => g.rating), avg = rated.length ? Math.round(rated.reduce((a, g) => a + g.rating, 0) / rated.length * 10) / 10 : 0;
  const ys = list.map(g => +g.year).filter(Boolean), kv = (a, b) => '<div class="kv"><span>' + a + '</span><b>' + b + '</b></div>';
  const stat = ok ? '<i class="okk">✓ checked, complete (marked manually)</i>' : chk && !chk.none ? (miss > 0 ? '<i class="warnk">⚠ missing from IGDB: ' + miss + '</i>' : '<i class="okk">✓ every IGDB game is here</i>') + ' · ' + esc(new Date(chk.t).toLocaleDateString(LOC)) : '<i class="nock">not checked</i>';
  return '<div class="scard">' + kv('Games in the series', list.length) + kv('Completed', done + ' of ' + list.length + ' (' + pc + '%)')
    + '<div class="spbar' + tkCls(list.length) + '" style="' + tkSty(list.length) + 'margin:2px 0 8px"><i style="width:' + pc + '%;background:' + pctColor(pc) + '"></i></div>'
    + kv('Series check', stat) + (chk && !chk.none ? kv('In IGDB (selected types)', chk.total + ', you have ' + chk.have) : '')
    + (col ? kv('Series in IGDB', esc(col.name) + (serKey(col.name) !== k ? ' <i class="warnk">≠ the name</i>' : '')) : '')
    + kv('Check against IGDB', (() => { const v = verMap(), ts = v.s[k], n = list.filter(g => v.g[g.id]).length; return ts ? esc(new Date(ts).toLocaleDateString(LOC)) + ', games: ' + n + ' of ' + list.length + (serStale(name, 'old') && !serStale(name, 'new') ? ' <i class="warnk">long ago</i>' : '') : '<i class="nock">not checked</i>'; })())
    + (hours ? kv('Playtime', hours + ' h') : '') + (avg ? kv('Average rating', '★' + avg) : '') + (ys.length ? kv('Years', Math.min.apply(null, ys) === Math.max.apply(null, ys) ? ys[0] : Math.min.apply(null, ys) + '–' + Math.max.apply(null, ys)) : '') + '</div>'
    + '<div class="tools scbar">' + tb('scSearch', 'find', 'Search', false, 'Search the series: all its IGDB games, missing ones can be added') + tb('scCheck', 'checkc', 'Completeness', false, 'Check completeness: which games are missing from the catalog') + tb('scNameCheck', 'aa', 'Title', false, 'Check the name and which games belong, against IGDB') + tb('scGv', 'fact', 'Games', false, 'Full games check: name, year, time, series, franchise') + tb('scAdd', 'plus', 'Add', false, 'Add games to the series') + tb('scCatalog', 'tolib', 'In list', false, 'Show the games in the catalog list') + tb('scMark', 'chkbox', 'Checked', ok, ok ? 'Series checked and complete: remove the mark' : 'Series checked and complete, the rest is not needed') + '</div>'
    + (c.selMode ? '<div class="toolbar"><button class="btn" data-act="scSel">Cancel</button><button class="btn" data-act="scSelAll">All</button><button class="btn" data-act="scRemove"' + (c.sel.size ? '' : ' disabled') + '>Remove from the series (' + c.sel.size + ')</button><button class="btn" data-act="scMove"' + (c.sel.size ? '' : ' disabled') + '>Move to another series… (' + c.sel.size + ')</button><button class="btn" data-act="scDel"' + (c.sel.size ? '' : ' disabled') + '>Delete from the catalog (' + c.sel.size + ')</button></div>' : '')
    + (list.length ? '' : '<p class="hint">The series has no games yet. Add them with the “Add games” button.</p>');
}
function serCardGamesHtml() {
  const c = S.serCard, list = scList(c.name), row = vmodeOf('sercard') === 'list';
  if (!list.length) return '';
  const mk = g => { const src = coverSrc(g), sel = c.sel.has(g.id), pk = (sel ? ' pick' : '') + (g.done ? ' isdone' : '') + (g.id === S.lastGame ? ' last' : ''), ck = sel ? '<span class="selck">✓</span>' : '';
    return row ? '<div class="srow' + pk + '" data-gid="' + g.id + '" data-lpm="scgame" data-act="scGame">' + ck + '<div class="sth" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '></div><div class="sm"><div class="nm">' + esc(g.name) + '</div><div class="m">' + esc([g.year || '', (g.platforms || []).slice(0, 2).map(shortPlat).join(', '), g.time ? g.time + ' h' : ''].filter(Boolean).join(' · ')) + '</div></div>' + (g.done ? '<span class="ok2">✓</span>' : '') + '</div>'
      : '<div class="card' + pk + '" data-gid="' + g.id + '" data-lpm="scgame" data-act="scGame">' + ck + '<div class="cv' + (src ? '' : ' nocover') + '" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '>' + (g.year || g.time || g.done ? '<div class="strip"><span class="sp">' + (g.year || '') + '</span><span class="sr">' + (g.time ? '⏱ ' + g.time + 'h' : '') + (g.done ? ' <i class="ck">✓</i>' : '') + '</span></div>' : '') + '</div><div class="t">' + esc(g.name) + '</div></div>'; };
  return row ? '<div class="srl z' + colsFor('searchL') + '">' + list.map(mk).join('') + '</div>' : '<div class="grid z' + colsFor('grid') + '" style="--cols:' + colsFor('grid') + '">' + list.map(mk).join('') + '</div>';
}
function viewSerCard() {
  const c = S.serCard, retOk = !!(S.retGame && gameById(S.retGame.id));
  return '<div class="top"><div class="hdr2" style="margin:6px 0 4px"><button class="btn" data-act="scBack">' + (retOk ? '← Back to the card' : '← Back') + '</button><div class="tools" style="margin:0">' + ib('scVmode', vmodeOf('sercard') === 'list' ? 'grid' : 'list', vmodeOf('sercard') === 'list' ? 'Tile' : 'List', false) + '<button class="ib" data-act="scMenu" aria-label="Series menu" title="Series menu">⋮</button></div></div><div class="serttl big">' + esc(c.name) + '</div></div>'
    + '<div class="scrl" id="scBody">' + serCardInfoHtml() + serCardGamesHtml() + '</div>';
}
function scRefresh() { if (S.tab !== 'sercard' || !S.serCard) return; const b = $('#scBody'); if (!b) return render(); const y = b.scrollTop; b.innerHTML = serCardInfoHtml() + serCardGamesHtml(); b.scrollTop = y; setTimeout(lazyCovers, 300); }
async function chooseSeries(exclude) {
  const m = new Map(); S.games.forEach(g => { if (g.series && serKey(g.series) !== serKey(exclude || '\u0000')) m.set(g.series, (m.get(g.series) || 0) + 1); });
  const names = Array.from(m.keys()).sort((a, b) => a.localeCompare(b, LOC));
  const r = await choose({ title: 'Move to a series', search: true, items: [{ id: '__new', label: 'New series…', accent: true, pin: true }].concat(names.map(n => ({ id: n, label: n, sub: gWord(m.get(n)) }))) });
  if (r === null) return null; if (r === '__new') { const n = await promptBox('Series name', ''); return n && n.trim() ? canonSeries(n) : null; } return r;
}
// проверка названия серии: сверка серий игр каталога с сериями IGDB
async function serNameCheck(name) {
  const games = scList(name).filter(g => g.igdbId), info = new Map(), key = serKey(name);
  for (let i = 0; i < games.length; i += 100) { const part = games.slice(i, i + 100), list = await igdb('/games', 'fields collections.id,collections.name; where id = (' + part.map(g => g.igdbId).join(',') + '); limit ' + part.length + ';'); list.forEach(x => info.set(x.id, x.collections || [])); }
  try { await loadColInfo(allColIds(Array.from(info.values()))); } catch (e) { if (S.block) throw e; }
  const votes = new Map(), out = new Map(), saved = serMap('serCol')[key];
  games.forEach(g => (info.get(g.igdbId) || []).forEach(c => { const v = votes.get(c.id) || { id: c.id, name: c.name, n: 0 }; v.n++; votes.set(c.id, v); }));
  const all = Array.from(votes.values()).sort((a, b) => b.n - a.n), same = all.find(c => serKey(c.name) === key); let main = saved && saved.manual ? saved : same || all[0] || null, missing = false;
  if (!main) { const col = await serCollection(name); if (col) main = col; else missing = true; }
  if (main) games.forEach(g => {
    const cs = info.get(g.igdbId) || [], lf = leafOf(cs); if (!cs.length || (lf ? lf.id === main.id : cs.some(c => c.id === main.id))) return;
    const t = lf || cs.slice().sort((a, b) => (votes.get(b.id) ? votes.get(b.id).n : 0) - (votes.get(a.id) ? votes.get(a.id).n : 0))[0], e = out.get(t.id) || { col: { id: t.id, name: t.name }, games: [] }; e.games.push(g); out.set(t.id, e);
  });
  serStamp(name); saveSet();
  return { name, none: !games.length, missing, linked: games.length, total: scList(name).length, main, rename: !!main && serKey(main.name) !== key && !(saved && saved.manual), groups: Array.from(out.values()).sort((a, b) => b.games.length - a.games.length) };
}
function drawSerFix() {
  const f = S.serFix; if (!f) return;
  const rows = [];
  if (f.missing) rows.push('<div class="fixrow"><div>Series <b>«' + esc(f.name) + '»</b> was not found in IGDB' + (f.linked ? '' : ' (the games have no IGDB entries)') + '. Games: ' + esc(scList(f.name).slice(0, 6).map(x => x.name).join(', ') + (f.total > 6 ? '…' : '')) + '</div><button class="btn acc" data-act="serFixDelete">Delete the series and clear it in the games</button></div>');
  if (f.rename) rows.push('<div class="fixrow"><div>In IGDB this series is called <b>«' + esc(f.main.name) + '»</b>, and yours is “' + esc(f.name) + '».</div><button class="btn acc" data-act="serFixRename">Rename to “' + esc(f.main.name) + '»</button></div>');
  f.groups.forEach((g, i) => rows.push('<div class="fixrow"><div><b>' + gWord(g.games.length) + '</b> belong to the series in IGDB <b>«' + esc(g.col.name) + '»</b>: ' + esc(g.games.slice(0, 6).map(x => x.name).join(', ') + (g.games.length > 6 ? '…' : '')) + '</div><button class="btn acc" data-act="serFixMove" data-i="' + i + '">Move to “' + esc(g.col.name) + '»</button></div>'));
  if (!f.missing && (!rows.length || (f.main && !f.rename && !f.groups.length))) rows.push('<p class="sub">✓ The series name matches IGDB, and every game with an IGDB entry belongs to it.</p>');
  openSheet('<div class="hdr2"><h2>Series name</h2></div><p class="sub">Series “' + esc(f.name) + '”: games ' + f.total + ', of them with an IGDB entry ' + f.linked + '</p>' + rows.join('') + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Done</button>');
}
/* ====== Сверка серий и игр с IGDB: существование серии, правильная серия у игры, отметки времени ====== */
const SER_VER_DAYS = 30; // проверенные раньше этого срока считаются проверенными давно
const verMap = () => { const v = S.set.serVer = S.set.serVer || {}; v.s = v.s || {}; v.g = v.g || {}; return v; };
const serVerTs = name => { const v = verMap(); return Math.min.apply(null, [v.s[serKey(name)] || 0].concat(scList(name).map(g => v.g[g.id] || 0))); }; // 0: серия или хотя бы одна её игра не сверялась
const serStale = (name, mode) => { if (mode === 'all') return true; const t = serVerTs(name); return mode === 'new' ? t === 0 : t === 0 || t < Date.now() - SER_VER_DAYS * 864e5; };
function serStamp(name) { const v = verMap(), now = Date.now(); v.s[serKey(name)] = now; scList(name).forEach(g => { v.g[g.id] = now; }); }
const serProgText = () => { const V = S.serVer, A = S.serAll; if (V && V.run) return V.msg || 'Series checked: ' + V.done + ' of ' + V.total; if (A && A.run) return 'Series checked: ' + A.done + ' of ' + A.total; return (V && V.msg) || (A && A.msg) || ''; };
async function serVerMode(names) {
  if (!names.some(n => serVerTs(n) > 0)) return 'all';
  const nNew = names.filter(n => serStale(n, 'new')).length, nOld = names.filter(n => serStale(n, 'old')).length;
  return choose({ title: 'Checking series against IGDB', items: [{ id: 'old', label: 'Unchecked and checked long ago (' + nOld + ')', sub: 'checked more than ' + SER_VER_DAYS + ' days ago' }, { id: 'new', label: 'Unchecked only (' + nNew + ')' }, { id: 'all', label: 'All series (' + names.length + ')' }] });
}
function serVerDraw() { const el = $('#serProg'), b = $('#serVerBtn'), V = S.serVer; if (el) el.textContent = serProgText(); if (b && V) btnLbl(b, V.run ? 'Stop' : 'Check'); }
async function serVerifyRun(names, V) {
  const skip = serMap('serSkip'), issues = [], info = new Map(), ids = Array.from(new Set(names.reduce((a, n) => a.concat(scList(n)), []).filter(g => g.igdbId).map(g => g.igdbId)));
  V.msg = 'Loading game series from IGDB…'; serVerDraw();
  for (let i = 0; i < ids.length && V.run; i += 100) { const part = ids.slice(i, i + 100), list = await igdb('/games', 'fields collections.id,collections.name; where id = (' + part.join(',') + '); limit ' + part.length + ';'); list.forEach(x => info.set(x.id, x.collections || [])); }
  V.msg = ''; serVerDraw();
  try { await loadColInfo(allColIds(Array.from(info.values()))); } catch (e) { if (S.block) throw e; }
  const gv = new Map(); info.forEach(cs => cs.forEach(c => gv.set(c.id, (gv.get(c.id) || 0) + 1)));
  for (const name of names) {
    if (!V.run) break;
    const key = serKey(name), gs = scList(name), linked = gs.filter(g => g.igdbId && info.has(g.igdbId)), votes = new Map(), saved = serMap('serCol')[key], manual = !!(saved && saved.manual);
    linked.forEach(g => info.get(g.igdbId).forEach(c => { const x = votes.get(c.id) || { id: c.id, name: c.name, n: 0 }; x.n++; votes.set(c.id, x); }));
    const all = Array.from(votes.values()).sort((a, b) => b.n - a.n), same = all.find(c => serKey(c.name) === key); let main = manual ? saved : same || all[0] || null;
    if (!main) {
      let col = null, err = false; try { col = await serCollection(name); } catch (e) { err = true; V.bad++; logErr('series check', e); }
      if (err) { if (S.block) break; V.done++; continue; }
      if (col) main = col; else if (!skip['m|' + key]) issues.push({ kind: 'missing', series: name, games: gs.map(g => g.id) });
    }
    if (main) {
      if (serKey(main.name) !== key && !manual && !skip['r|' + key]) issues.push({ kind: 'rename', series: name, to: main.name, games: gs.map(g => g.id) });
      const out = new Map();
      linked.forEach(g => {
        const cs = info.get(g.igdbId), lf = leafOf(cs); if (!cs.length || (lf ? lf.id === main.id : cs.some(c => c.id === main.id)) || skip['g|' + g.id]) return;
        const t = lf || cs.slice().sort((a, b) => (gv.get(b.id) || 0) - (gv.get(a.id) || 0))[0], e = out.get(t.id) || { kind: 'move', series: name, to: t.name, games: [] }; e.games.push(g.id); out.set(t.id, e);
      });
      out.forEach(e => issues.push(e));
    }
    serStamp(name); V.done++; if (V.done % 10 === 0) { saveSet(); serVerDraw(); }
  }
  saveSet(); return issues;
}
async function serApplyIssue(iss) {
  if (iss.kind === 'missing') {
    const games = scList(iss.series), k = serKey(iss.series); for (const g of games) g.series = ''; await saveGames(games);
    S.set.f.series = S.set.f.series.filter(x => serKey(x) !== k); ['serOk', 'serCol', 'serChk', 'serIgnore'].forEach(m => { delete serMap(m)[k]; }); delete verMap().s[k];
  } else if (iss.kind === 'rename') await serRenameAll(iss.series, iss.to, true);
  else { const games = iss.games.map(gameById).filter(Boolean), n = canonSeries(iss.to); for (const g of games) g.series = n; await saveGames(games); }
  saveSet();
}
async function serVerifyAll() {
  const V0 = S.serVer; if (V0 && V0.run) { V0.run = false; return; }
  if (S.serAll && S.serAll.run) return toast('Wait for the completeness check to finish or stop it');
  if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
  const all = Array.from(seriesGroups().keys()).filter(Boolean); if (!all.length) return toast('No series yet');
  const mode = await serVerMode(all); if (!mode) return;
  const names = all.filter(n => serStale(n, mode)); if (!names.length) return toast('All series were checked recently');
  const V = S.serVer = { run: true, done: 0, total: names.length, bad: 0, msg: '' }; serVerDraw();
  let issues = []; try { issues = await serVerifyRun(names, V); } catch (e) { logErr('series checking', e); toast(e.message); }
  const stopped = !V.run; V.run = false; S.serIssues = issues;
  V.msg = (stopped ? 'Checking stopped. ' : '') + 'Series checked: ' + V.done + ', problems found: ' + issues.length + (V.bad ? ', errors: ' + V.bad : '');
  if (S.tab === 'series') render(); toast(V.msg); if (issues.length) drawSerIssues();
}
function drawSerIssues() {
  const L = S.serIssues || [], nm = id => (gameById(id) || {}).name || '', list = ids => esc(ids.slice(0, 6).map(nm).filter(Boolean).join(', ') + (ids.length > 6 ? '…' : ''));
  const row = (x, i) => '<div class="fixrow"><div>' + (x.kind === 'missing' ? 'Series <b>«' + esc(x.series) + '»</b> was not found in IGDB. Games (' + x.games.length + '): ' + list(x.games)
    : x.kind === 'rename' ? 'Series <b>«' + esc(x.series) + '»</b> is called in IGDB <b>«' + esc(x.to) + '»</b> (games: ' + x.games.length + ')'
      : 'In the series <b>«' + esc(x.series) + '»</b>: <b>' + gWord(x.games.length) + '</b> belong to the series in IGDB <b>«' + esc(x.to) + '»</b>: ' + list(x.games)) + '</div>'
    + '<div class="fxb"><button class="btn acc" data-act="serIssueApply" data-i="' + i + '">' + (x.kind === 'missing' ? 'Delete the series and clear it in the games' : x.kind === 'rename' ? 'Rename to “' + esc(x.to) + '»' : 'Move to “' + esc(x.to) + '»') + '</button><button class="btn" data-act="serIssueSkip" data-i="' + i + '">Keep as is</button></div></div>';
  openSheet('<div class="hdr2"><h2>Checking series against IGDB</h2></div>' + (L.length ? '<p class="sub">Problems found: ' + L.length + '. “Keep as is” remembers your choice, and this problem is not shown again.</p><button class="btn acc" style="width:100%;margin-bottom:6px" data-act="serIssuesAll">Apply all (' + L.length + ')</button>' + L.map(row).join('') : '<p class="sub">✓ No problems: the series exist in IGDB and the games belong to the right series.</p>') + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Done</button>');
}
/* ====== Серии IGDB: поиск серий и проверка полноты ====== */
const SER_TYPE_LIST = [[0, 'Games'], [8, 'Remakes'], [9, 'Remasters'], [4, 'Standalone add-ons'], [10, 'Expanded'], [11, 'Ports'], [3, 'Bundles'], [6, 'Episodes']];
const SER_TYPES_DEF = [0, 8, 9]; // в проверке серии по умолчанию: основные игры, ремейки и ремастеры; порты, бандлы и прочее включаются кнопками
const serTypes = () => { const t = S.set.serTypes; return Array.isArray(t) && t.length ? t.map(Number) : SER_TYPES_DEF; };
const serKey = n => normName(n);
const tkOn = n => n > 1 && n <= 40, tkCls = n => tkOn(n) ? ' tk' : '', tkSty = n => tkOn(n) ? '--n:' + n + ';' : ''; // деления полосы прогресса равны числу игр
// чипы типов игр: название и число игр этого типа; в поиске по играм нажатие фильтрует список, в серии включает/выключает тип в подсчёте серии
const typeChipsVis = () => { const t = S.set.typeChips; return Array.isArray(t) ? t.map(Number) : ALL_TYPES; };
const chipMode = () => { const m = S.set.chipMode; return m === 0 || m === 2 ? m : 1; }; // 0 - чипы выключены, 1 - все, 2 - выбранные в фильтре
const typeLabel = t => { const n = TYPE_NAME[t] || ''; return n.length > 12 ? (TYPE_CHIP[t] || n) : n; };
const viewRes = () => { const s = S.search; return s.mode === 'search' && s.kind === 'games' && s.tf && s.tf.length ? s.results.filter(r => s.tf.includes(r.type)) : s.results; };
function typeCountsHtml() {
  const s = S.search, vis = typeChipsVis(), cnt = new Map(); let on, act, cfg = '';
  if (s.mode === 'series' && s.chk) {
    if (!s.chk.list) return '';
    s.chk.list.forEach(x => { const t = typeOf(x); if (t != null) cnt.set(t, (cnt.get(t) || 0) + 1); });
    const isFr = s.chk.kind === 'fr', st = isFr ? frTypes() : serTypes(); on = t => st.includes(t); act = isFr ? 'frType' : 'serType';
  } else if (s.kind === 'games' && s.mode === 'search' && s.src === 'igdb' && chipMode()) {
    s.results.forEach(x => { if (x.type != null) cnt.set(x.type, (cnt.get(x.type) || 0) + 1); });
    const tf = s.tf || []; on = t => tf.includes(t); act = 'tfChip';
  } else return '';
  const ids = ALL_TYPES.filter(t => cnt.has(t) && (act === 'serType' || chipMode() === 1 || vis.includes(t) || on(t)));
  if (!ids.length) return '';
  return ids.map(t => '<button class="p xs' + (on(t) ? ' on' : '') + '" data-act="' + act + '" data-v="' + t + '">' + esc(typeLabel(t)) + ' <b>' + cnt.get(t) + '</b></button>').join('') + cfg;
}
const serMap = k => (S.set[k] = S.set[k] || {});
const colCache = new Map();
// все игры серии IGDB (кроме DLC, модов и патчей); типы отбираются уже в приложении, поэтому смена типов не требует новых запросов
async function collGames(colId, times) {
  let c = colCache.get(colId);
  if (!c || Date.now() - c.t > 6e5) {
    const list = await igdb('/games', 'fields ' + IGDB_FIELDS + '; where collections = (' + (+colId) + ') & game_type = (' + SER_TYPE_LIST.map(x => x[0]).join(',') + '); sort first_release_date asc; limit 500;');
    list.forEach(x => { x._src = 'igdb'; }); c = { t: Date.now(), v: list, tm: false }; colCache.set(colId, c);
  }
  if (times && !c.tm) { await attachTimes(c.v); c.tm = true; }
  return c.v;
}
// какой серии IGDB соответствует серия каталога: по играм каталога (у них известны серии IGDB), затем по названию; выбор запоминается
async function serCollection(name) {
  const key = serKey(name), saved = serMap('serCol')[key]; if (saved) return saved;
  const ids = S.games.filter(g => g.igdbId && g.series && serKey(g.series) === key).slice(0, 100).map(g => g.igdbId); let best = null;
  if (ids.length) {
    const list = await igdb('/games', 'fields collections.id,collections.name; where id = (' + ids.join(',') + '); limit ' + ids.length + ';'), votes = new Map();
    list.forEach(x => (x.collections || []).forEach(c => { const v = votes.get(c.id) || { id: c.id, name: c.name, n: 0, same: serKey(c.name) === key ? 1 : 0 }; v.n++; votes.set(c.id, v); }));
    best = Array.from(votes.values()).sort((a, b) => b.same - a.same || b.n - a.n)[0] || null;
  }
  if (!best) {
    const r = await igdb('/collections', 'search "' + igdbQuote(name) + '"; fields name,games; limit 10;');
    best = r.find(c => serKey(c.name) === key) || r.find(c => serKey(c.name).includes(key) || key.includes(serKey(c.name))) || null;
  }
  if (!best) return null;
  const col = { id: best.id, name: best.name }; serMap('serCol')[key] = col; saveSet(); return col;
}
// поиск серий: по названию серии и по названию игры (серии найденных игр)
async function searchCollections(q) {
  const [r, g] = await Promise.all([igdb('/collections', 'search "' + igdbQuote(q) + '"; fields name,games; limit 30;'), igdb('/games', 'search "' + igdbQuote(q) + '"; fields name,collections.id,collections.name; limit 20;').catch(e => { if (S.block) throw e; return []; })]);
  const out = r.map(c => ({ id: c.id, name: c.name, n: (c.games || []).length })), have = new Set(out.map(c => c.id));
  g.forEach(x => (x.collections || []).forEach(c => { if (!have.has(c.id)) { have.add(c.id); out.push({ id: c.id, name: c.name, n: 0, via: x.name }); } }));
  return out;
}
// присутствие игры IGDB в каталоге: по id или (для игр без IGDB) по названию и году
function serHave() {
  const ids = new Set(), names = new Map();
  S.games.forEach(g => { if (g.igdbId) ids.add(g.igdbId); const k = normName(g.name); if (!names.has(k)) names.set(k, []); names.get(k).push({ y: g.year || 0, l: !!g.igdbId }); });
  return x => { if (ids.has(x.id)) return true; const y = yearOf(x); return (names.get(normName(x.name)) || []).some(e => e.l ? (e.y && y && e.y === y) : (!e.y || !y || e.y === y)); };
}
function serAnalyze(list, name) {
  const have = serHave(), ign = new Set(serMap('serIgnore')[serKey(name)] || []), types = serTypes(), now = Date.now(), items = [];
  list.forEach(x => {
    if (!types.includes(typeOf(x))) return;
    const it = mapItem(x); it.have = have(x); it.ign = ign.has(x.id); it.fut = !x.first_release_date || x.first_release_date * 1000 > now; it.gid = x.id; items.push(it);
  });
  const live = items.filter(i => !i.ign && (!i.fut || S.set.serFuture)), haveN = live.filter(i => i.have).length;
  return { items, total: live.length, haveN, miss: live.length - haveN, hidden: items.filter(i => i.ign).length, future: items.filter(i => i.fut && !i.ign).length };
}
function serSave(name, col, an) { serMap('serChk')[serKey(name)] = { t: Date.now(), id: col.id, total: an.total, have: an.haveN }; saveSet(); }
async function serCheck(name) {
  const col = await serCollection(name);
  if (!col) { serMap('serChk')[serKey(name)] = { t: Date.now(), none: 1 }; saveSet(); return null; }
  const an = serAnalyze(await collGames(col.id), name); an.col = col; serSave(name, col, an); return an;
}
const serMiss = name => { if (serMap('serOk')[serKey(name)]) return 0; const c = serMap('serChk')[serKey(name)]; return c && !c.none ? Math.max(0, c.total - c.have) : -1; };
// значок у серии: «⚠ 2» (не хватает 2 игр) или «✓» (серия полная или отмечена вручную); одна строка, высоту плитки не меняет
function serBadge(name) {
  const k = serKey(name), c = serMap('serChk')[k], ok = !!serMap('serOk')[k]; if ((!c || c.none) && !ok) return '';
  const miss = ok || !c ? 0 : c.total - c.have, a = ' data-act="serCheck" data-name="' + esc(name) + '" title="' + (ok ? 'Series marked as complete' : miss > 0 ? 'Games missing: ' + miss : 'Series complete') + (c ? '. Checked ' + esc(new Date(c.t).toLocaleDateString(LOC)) : '') + '"';
  return miss > 0 ? '<button class="serbd warn"' + a + '>⚠ ' + miss + '</button>' : '<button class="serbd good"' + a + '>✓</button>';
}
// название серии в каталоге по играм из списка IGDB (чтобы не заводить вторую серию с другим названием)
function serCatalogName(list) {
  const ids = new Set(list.map(x => x.id)), cnt = new Map();
  S.games.forEach(g => { if (g.series && g.igdbId && ids.has(g.igdbId)) cnt.set(g.series, (cnt.get(g.series) || 0) + 1); });
  return Array.from(cnt.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}
function serApply() { // список на экране серии из загруженных игр, типов, скрытых и фильтра «только недостающие»
  const s = S.search, c = s.chk; if (!c || !c.list) return;
  const an = serAnalyze(c.list, c.name); c.an = an;
  const vis = i => c.showIgn ? i.ign : (!i.ign && (S.set.serFuture || !i.fut));
  s.results = an.items.filter(i => vis(i) && (!c.onlyMiss || !i.have)); s.count = s.results.length; s.hasMore = false;
  if (c.col) serSave(c.name, c.col, an);
}
async function showSeriesView(name, o) {
  o = o || {}; const s = S.search;
  if (!S.retGame && !(o.from && o.from !== 'search') && pushSearchState()) s.stack[s.stack.length - 1].lastRid = '';
  s.bundle = null; s.src = 'igdb'; s.token++; const token = s.token; s.mode = 'series'; s.title = name; s.results = []; s.hasMore = false; s.loading = true; s.started = true; s.count = 0; s.lastRid = '';
  s.chk = { name, col: null, list: null, an: null, onlyMiss: !!o.onlyMiss, showIgn: false, from: o.from || '' }; s.sel = new Set(); s.selMode = false; s.bind = ''; S.tab = 'search'; closeSheet(); render();
  try {
    const col = o.colId ? { id: o.colId, name } : await serCollection(name); if (token !== s.token) return;
    if (col) {
      const list = await collGames(col.id, true); if (token !== s.token) return;
      s.chk.col = col; s.chk.list = list;
      if (o.colId) { const nm = serCatalogName(list); if (nm) { s.chk.name = nm; s.title = nm; } const k = serKey(s.chk.name); if (!serMap('serCol')[k]) { serMap('serCol')[k] = { id: col.id, name: col.name }; saveSet(); } }
      serApply();
    }
  } catch (e) { logErr('IGDB series', e); if (token === s.token) toast(e.message); }
  if (token === s.token) { s.loading = false; renderSearchBody(); }
}
function serHeadHtml() {
  const s = S.search, c = s.chk, an = c.an, ok = !!serMap('serOk')[serKey(c.name)];
  let h = '';
  if (s.loading) return h + '<p class="sub">Checking the series in IGDB…</p>';
  if (!c.col) return h + '<div class="hint">Series “' + esc(c.name) + '” was not found in IGDB.<br><br><button class="btn acc" data-act="serRebind">Pick the IGDB series manually</button></div>';
  const pc = an.total ? Math.round(an.haveN * 100 / an.total) : 0, full = ok || (an.total > 0 && an.miss === 0), n = s.sel.size;
  h += '<p class="sub" style="margin:0 2px 6px">IGDB: «' + esc(c.col.name) + '” · in the catalog <b>' + an.haveN + ' of ' + an.total + '</b>' + (ok ? ' · ✓ marked as complete manually' : full ? ' · ✓ series complete' : an.miss ? ' · missing: <b>' + an.miss + '</b>' : '') + '</p>'
    + '<div class="spbar' + tkCls(an.total) + '" style="' + tkSty(an.total) + 'margin:0 2px 8px"><i style="width:' + (ok ? 100 : pc) + '%;background:' + (full ? 'var(--green)' : '#f0a030') + '"></i></div>'
    + '<div class="chips scroll sm"><button class="p sm' + (c.onlyMiss ? ' on' : '') + '" data-act="serOnly">Missing</button>'
    + '<button class="p sm' + (S.set.serFuture ? ' on' : '') + '" data-act="serFuture">Unreleased' + (an.future ? ' ' + an.future : '') + '</button>'
    + (an.hidden || c.showIgn ? '<button class="p sm' + (c.showIgn ? ' on' : '') + '" data-act="serShowIgn">Hidden ' + an.hidden + '</button>' : '')
    + '<button class="p sm' + (s.selMode ? ' on' : '') + '" data-act="serSel">' + (s.selMode ? '✓ Select' : 'Select') + '</button></div>';
  if (s.selMode) h += '<div class="toolbar"><button class="btn" data-act="serSelMiss">All missing</button>'
    + (c.showIgn ? '' : '<button class="btn acc" data-act="serAddSel"' + (n ? '' : ' disabled') + '>＋ Add to the catalog (' + n + ')</button>')
    + '<button class="btn" data-act="serIgnSel"' + (n ? '' : ' disabled') + '>' + (c.showIgn ? 'Return to the series (' + n + ')' : 'Not needed (' + n + ')') + '</button></div>';
  return h + '<div class="chips sm" style="margin-top:2px"><button class="p sm' + (ok ? ' on' : '') + '" data-act="serMark">' + (ok ? '☑' : '☐') + ' Series complete, the rest is not needed</button></div>'
    + '<p class="sub" style="margin:0 2px 8px"><a data-act="serRebind" style="color:var(--blue);cursor:pointer">Wrong IGDB series? Pick another</a></p>';
}
function colListHtml() {
  const s = S.search;
  if (blockFor('igdb')) return blockBanner(true, 'igdb');
  if (!PROV.igdb.ready()) return '<div class="hint">' + PROV.igdb.noKeys + '<br><br><button class="btn acc" data-act="tab" data-tab="settings">Open settings</button></div>';
  if (s.loading) return '<div class="status">Loading…</div>';
  if (!s.cols.length) return '<div class="hint">' + (s.started ? 'Series not found in IGDB.<br>Try another name, or the name of a game from this series.' : 'Enter a series name (for example “Fallout”) or a game from it') + '</div>';
  const cnt = new Map(); S.games.forEach(g => { if (g.series) { const k = serKey(g.series); cnt.set(k, (cnt.get(k) || 0) + 1); } });
  return '<div class="srl">' + s.cols.map(c => {
    const k = cnt.get(serKey(c.name)) || 0, meta = [c.n ? 'entries in IGDB: ' + c.n : '', c.via ? 'via the game “' + c.via + '»' : '', k ? 'in the catalog: ' + k : ''].filter(Boolean).join(' · ');
    return '<div class="srow colrow" data-act="colTap" data-id="' + c.id + '" data-name="' + esc(c.name) + '"><div class="sm"><div class="nm">' + esc(c.name) + '</div><div class="m">' + esc(meta) + '</div></div>' + (k ? '<span class="ok2">✓</span>' : '') + '</div>';
  }).join('') + '</div>';
}
async function runColSearch() {
  const s = S.search, q = s.q.trim(); s.cols = []; s.results = []; s.hasMore = false;
  if (!q) { s.started = false; renderSearchBody(); return; }
  if (!PROV.igdb.ready()) { renderSearchBody(); return; }
  const token = s.token; s.loading = true; s.started = true; renderSearchBody();
  try { const r = await searchCollections(q); if (token === s.token) s.cols = r; } catch (e) { logErr('series search', e); if (token === s.token) toast(e.message); }
  finally { if (token === s.token) { s.loading = false; renderSearchBody(); } }
}
async function serAddSelected() {
  const s = S.search, c = s.chk, rids = Array.from(s.sel).filter(r => !gameByRid(r)); if (!rids.length) return toast('The selected games are already in the catalog');
  const snap = takeSnap(); let n = 0, bad = 0; toast('Adding games: ' + rids.length + '…');
  for (const rid of rids) { try { if (await addFromIgdb(rid, [], { forceSeries: c.name, bg: true })) n++; } catch (e) { bad++; logErr('series: adding a game', e); if (S.block) break; } }
  s.sel.clear(); s.selMode = false; serApply(); renderSearchBody(); toastUndo('Games added: ' + n + (bad ? ', failed: ' + bad : ''), snap);
}
function serDrawProg() {
  const A = S.serAll, el = $('#serProg'), b = $('#serAllBtn'); if (!A) return;
  if (el) el.textContent = serProgText();
  if (b) btnLbl(b, A.run ? 'Stop' : 'Completeness');
}
async function serCheckAll() {
  const A0 = S.serAll; if (A0 && A0.run) { A0.run = false; return; }
  if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
  const names = Array.from(seriesGroups().keys()).filter(Boolean); if (!names.length) return toast('No series yet');
  const A = S.serAll = { run: true, done: 0, total: names.length, bad: 0, msg: '' }; serDrawProg();
  for (const n of names) {
    if (!A.run) break;
    try { await serCheck(n); } catch (e) { A.bad++; logErr('series check', e); if (S.block) break; }
    A.done++; serDrawProg(); if (A.done % 5 === 0 && S.tab === 'series' && S.serKind !== 'fr') { const b = $('#tilesBox'); if (b) b.innerHTML = seriesTilesHtml(); }
  }
  const stopped = !A.run; A.run = false;
  const inc = names.filter(n => serMiss(n) > 0).length, none = names.filter(n => (serMap('serChk')[serKey(n)] || {}).none).length;
  A.msg = (stopped ? 'Checking stopped. ' : '') + 'Incomplete series: ' + inc + (none ? ', not found in IGDB: ' + none : '') + (A.bad ? ', errors: ' + A.bad : '');
  if (S.tab === 'series') render(); toast(A.msg);
}

/* ====== Полная проверка игр по IGDB: название, год выхода, время прохождения, серия, франшиза ====== */
const GV_FIELDS = [['name', 'Title'], ['year', 'Release year'], ['time', 'Playtime'], ['series', 'Series'], ['franchise', 'Franchise']];
const gvFieldName = f => (GV_FIELDS.find(x => x[0] === f) || [0, f])[1];
const gvMap = () => (S.set.gvVer = S.set.gvVer || {}); // id игры -> когда сверена
const gvStale = (g, mode) => { if (mode === 'all') return true; const t = gvMap()[g.id] || 0; return mode === 'new' ? t === 0 : t === 0 || t < Date.now() - SER_VER_DAYS * 864e5; };
const gvDraw = () => { const t = S.gv && S.gv.run ? 'Games checked: ' + S.gv.done + ' of ' + S.gv.total : (S.gv && S.gv.msg) || ''; ['serProg', 'frProg'].forEach(id => { const el = $('#' + id); if (el && t) el.textContent = t; }); const b = $('#gvBtn'); if (b) btnLbl(b, S.gv && S.gv.run ? 'Stop' : 'Games'); };
async function gvRun(games, V) {
  const skip = serMap('gvSkip'), issues = [], data = new Map(), times = new Map(), votesS = new Map(), votesF = new Map();
  for (let i = 0; i < games.length && V.run; i += 50) {
    const part = games.slice(i, i + 50), ids = part.map(g => g.igdbId).join(',');
    const [list, tt] = await Promise.all([igdb('/games', 'fields name,first_release_date,collections.id,collections.name,franchise.id,franchise.name,franchises.id,franchises.name; where id = (' + ids + '); limit ' + part.length + ';'), igdb('/game_time_to_beats', 'fields game_id,hastily,normally,completely; where game_id = (' + ids + '); limit ' + part.length + ';').catch(e => { if (S.block) throw e; return []; })]);
    list.forEach(d => { data.set(d.id, d); (d.collections || []).forEach(c => votesS.set(c.id, (votesS.get(c.id) || 0) + 1)); frOf(d).forEach(c => votesF.set(c.id, (votesF.get(c.id) || 0) + 1)); });
    tt.forEach(x => times.set(x.game_id, hoursOf(x)));
    V.done += part.length; gvDraw();
  }
  try { await loadColInfo(allColIds(Array.from(data.values()).map(d => d.collections))); } catch (e) { if (S.block) throw e; }
  const best = (cols, votes) => cols.slice().sort((a, b) => (votes.get(b.id) || 0) - (votes.get(a.id) || 0))[0];
  const bound = (name, map, cols) => { const m = serMap(map)[serKey(name)]; return !!(m && cols.some(c => c.id === m.id)); }; // серия или франшиза привязана вручную к одной из записей IGDB
  const now = Date.now(), v = gvMap();
  games.forEach(g => {
    const d = data.get(g.igdbId); if (!d) return; const fields = [], sk = f => skip[g.id + '|' + f];
    if (!sk('name') && d.name && normName(d.name) !== normName(g.name)) fields.push({ f: 'name', from: g.name, to: d.name });
    const y = yearOf(d); if (!sk('year') && y && +g.year !== y) fields.push({ f: 'year', from: g.year || '', to: y });
    const h = times.get(g.igdbId) || 0; if (!sk('time') && h > 0 && (!g.time || Math.abs(g.time - h) > Math.max(1, h * 0.15))) fields.push({ f: 'time', from: g.time || '', to: h });
    const cs = d.collections || [], lf = leafOf(cs), sm = serMap('serCol')[serKey(g.series || '')];
    if (!sk('series') && cs.length && (lf ? serKey(lf.name) !== serKey(g.series || '') && !(sm && sm.id === lf.id) : !cs.some(c => serKey(c.name) === serKey(g.series || '')) && !bound(g.series || '', 'serCol', cs))) fields.push({ f: 'series', from: g.series || '', to: (lf || best(cs, votesS)).name });
    const fs = frOf(d);
    if (!sk('franchise') && fs.length && !fs.some(c => serKey(c.name) === serKey(g.franchise || '')) && !bound(g.franchise || '', 'frCol', fs)) fields.push({ f: 'franchise', from: g.franchise || '', to: best(fs, votesF).name });
    if (fields.length) issues.push({ id: g.id, fields });
    v[g.id] = now;
  });
  saveSet(); return issues;
}
async function gvMode(games) {
  if (!games.some(g => (gvMap()[g.id] || 0) > 0)) return 'all';
  const nNew = games.filter(g => gvStale(g, 'new')).length, nOld = games.filter(g => gvStale(g, 'old')).length;
  return choose({ title: 'Checking all games against IGDB', items: [{ id: 'old', label: 'Unchecked and checked long ago (' + nOld + ')', sub: 'checked more than ' + SER_VER_DAYS + ' days ago' }, { id: 'new', label: 'Unchecked only (' + nNew + ')' }, { id: 'all', label: 'All games (' + games.length + ')' }] });
}
async function gvAll(listOpt) {
  const G0 = S.gv; if (G0 && G0.run) { G0.run = false; return; }
  if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
  const all = (listOpt || S.games).filter(g => g.igdbId); if (!all.length) return toast('No games with an IGDB entry');
  const mode = await gvMode(all); if (!mode) return;
  const list = all.filter(g => gvStale(g, mode)); if (!list.length) return toast('All games were checked recently');
  const V = S.gv = { run: true, done: 0, total: list.length, msg: '' }; gvDraw(); if (listOpt) toast('Checking games: ' + list.length);
  let issues = []; try { issues = await gvRun(list, V); } catch (e) { logErr('games check', e); toast(e.message); }
  const stopped = !V.run; V.run = false; S.gvIssues = issues; S.gvShown = 40;
  V.msg = (stopped ? 'Checking stopped. ' : '') + 'Games checked: ' + V.done + ', games with differences: ' + issues.length; gvDraw(); toast(V.msg);
  if (issues.length) drawGvIssues();
}
function drawGvIssues() {
  const L = S.gvIssues || [], n = S.gvShown || 40, val = (f, x) => x === '' || x == null ? '—' : esc(f === 'time' ? x + ' h' : x);
  const row = (x, i) => { const g = gameById(x.id); if (!g) return ''; return '<div class="fixrow"><div><b>' + esc(g.name) + '</b>' + x.fields.map(c => '<br>' + gvFieldName(c.f) + ': ' + val(c.f, c.from) + ' → <b>' + val(c.f, c.to) + '</b>').join('') + '</div><div class="fxb"><button class="btn acc" data-act="gvApplyOne" data-i="' + i + '">Apply</button><button class="btn" data-act="gvSkipOne" data-i="' + i + '">Keep as is</button></div></div>'; };
  openSheet('<div class="hdr2"><h2>Checking games against IGDB</h2></div>' + (L.length ? '<p class="sub">Games with differences: ' + L.length + '. “Keep as is” remembers your choice for this field of the game.</p><button class="btn acc" style="width:100%;margin-bottom:6px" data-act="gvApplyAll">Apply to all (' + L.length + ')…</button>' + L.slice(0, n).map(row).join('') + (L.length > n ? '<button class="btn" style="width:100%;margin-top:8px" data-act="gvMore">Show more (' + (L.length - n) + ')</button>' : '') : '<p class="sub">✓ No differences: name, year, time, series and franchise match IGDB.</p>') + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Done</button>');
}
async function gvApply(iss, only) {
  const g = gameById(iss.id); if (!g) return 0; let n = 0;
  for (const x of iss.fields) { if (only && !only.includes(x.f)) continue; if (x.f === 'series') g.series = canonSeries(x.to); else if (x.f === 'franchise') g.franchise = canonFranchise(x.to); else g[x.f] = x.to; n++; }
  if (n) g.updated = Date.now(); return n;
}
/* ====== Режим отладки: дампы ответов IGDB и RAWG (настройки → «Отладка») ====== */
const DBG = { list: [], bytes: 0, forceTag: '' }, DBG_MAX = 80, DBG_BYTES = 4e6, DBG_ONE = 300000;
function dbgCapture(rec) { // rec: { src, ep, q, status, ms, data, error }; пишется, если включена отладка или идёт дамп игры
  try {
    if (!S.set.debug && !DBG.forceTag) return;
    let data = rec.data, size = 0, note = '';
    try { size = JSON.stringify(data === undefined ? null : data).length; } catch (e) { size = 0; }
    if (size > DBG_ONE) { note = 'response truncated, full size ' + size + ' bytes'; data = Array.isArray(data) ? data.slice(0, 60) : String(JSON.stringify(data)).slice(0, DBG_ONE); }
    DBG.list.push({ t: Date.now(), src: rec.src, ep: rec.ep, q: rec.q || '', status: rec.status || 0, ms: rec.ms || 0, n: Array.isArray(rec.data) ? rec.data.length : null, size, note, error: rec.error || '', tag: DBG.forceTag || '', data });
    DBG.bytes += Math.min(size, DBG_ONE);
    while (DBG.list.length > 1 && (DBG.list.length > DBG_MAX || DBG.bytes > DBG_BYTES)) { const x = DBG.list.shift(); DBG.bytes -= Math.min(x.size, DBG_ONE); }
  } catch (e) { /* отладка не должна ронять программу */ }
}
const dbgText = () => JSON.stringify({ app: 'game-catalog', time: new Date().toISOString(), agent: (typeof navigator !== 'undefined' && navigator.userAgent) || '', count: DBG.list.length, entries: DBG.list.map(x => Object.assign({}, x, { time: new Date(x.t).toISOString() })) }, null, 1);
function dbgSecHtml() {
  const n = DBG.list.length, on = !!S.set.debug;
  return '<div class="sec"><h3 style="margin-top:0">IGDB and RAWG response dumps</h3><p class="sub">When the mode is on, every request to IGDB and RAWG (address, query, status, response body) is kept in the app memory: up to ' + DBG_MAX + ' latest entries. Keys and tokens are not recorded. The dump can be viewed, copied or sent as a file to another app (like a backup). The entries are cleared when the app restarts.</p>'
    + '<div class="chips"><button class="p' + (on ? ' on' : '') + '" data-act="dbgToggle">' + (on ? '✓ Debugging is on' : 'Debugging is off') + '</button></div>'
    + '<div class="toolbar"><button class="btn" data-act="dbgView">View (' + n + ')</button><button class="btn" data-act="dbgDownload"' + (n ? '' : ' disabled') + '>Send file</button><button class="btn" data-act="dbgCopy"' + (n ? '' : ' disabled') + '>Copy</button><button class="btn red" data-act="dbgClear"' + (n ? '' : ' disabled') + '>Empty</button></div>'
    + '<p class="sub" style="margin-top:10px">A full dump of one IGDB game (the game, its series, relations between series, franchises, time to beat) is collected even with debugging off:</p><div class="toolbar"><button class="btn" data-act="dbgGame">Dump an IGDB game…</button></div></div>';
}
async function dbgGameDump(idOrName) { // сырые данные игры из IGDB: все поля, коллекции, связи между коллекциями, франшизы, время прохождения
  if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
  const q = String(idOrName == null ? '' : idOrName).trim(); if (!q) return;
  DBG.forceTag = 'dump';
  try {
    let id = /^\d+$/.test(q) ? +q : 0;
    if (!id) {
      const list = await igdb('/games', 'search "' + igdbQuote(q) + '"; fields name,first_release_date; limit 10;');
      if (!list.length) return toast('Nothing found in IGDB');
      id = list.length === 1 ? list[0].id : +(await askChoose({ title: 'Which game?', items: list.map(x => ({ id: String(x.id), label: x.name + (x.first_release_date ? ' (' + new Date(x.first_release_date * 1000).getUTCFullYear() + ')' : ''), sub: 'id ' + x.id })) }) || 0);
      if (!id) return;
    }
    toast('Collecting the game dump…');
    const opt = p => p.catch(e => { if (S.block) throw e; return { error: String(e.message || e) }; });
    const g = ((await igdb('/games', 'fields *; where id = ' + id + ';'))[0]) || {};
    const colIds = Array.from(new Set((g.collections || []).concat(g.collection ? [g.collection] : []))), frIds = Array.from(new Set((g.franchises || []).concat(g.franchise ? [g.franchise] : [])));
    const cols = colIds.length ? await opt(igdb('/collections', 'fields *; where id = (' + colIds.join(',') + '); limit 50;')) : [];
    const rel = colIds.length ? await opt(igdb('/collection_relations', 'fields *; where parent_collection = (' + colIds.join(',') + ') | child_collection = (' + colIds.join(',') + '); limit 100;')) : [];
    const frs = frIds.length ? await opt(igdb('/franchises', 'fields *; where id = (' + frIds.join(',') + '); limit 50;')) : [];
    const tt = await opt(igdb('/game_time_to_beats', 'fields *; where game_id = ' + id + ';'));
    dbgCapture({ src: 'igdb', ep: 'game dump ' + id, q: 'game, collections, collection relations, franchises, time to beat', status: 200, data: { game: g, collections: cols, collection_relations: rel, franchises: frs, time_to_beats: tt } });
  } catch (e) { logErr('IGDB game dump', e); return toast(e.message); } finally { DBG.forceTag = ''; }
  ACT.dbgView();
}
/* ====== FRANCHISE MODULE (создан из кода серий скриптом gen_fr.py) ====== */
const fcList = name => { const k = serKey(name); return S.games.filter(g => g.franchise && serKey(g.franchise) === k).sort((a, b) => (+a.year || 9999) - (+b.year || 9999) || (a.added || 0) - (b.added || 0) || String(a.name).localeCompare(String(b.name), LOC)); };
function frMigrate(a, b) { const ka = serKey(a), kb = serKey(b); if (ka === kb) return; ['frOk', 'frCol', 'frChk', 'frIgnore'].forEach(m => { const o = serMap(m); if (o[ka] !== undefined) { if (o[kb] === undefined) o[kb] = o[ka]; delete o[ka]; } }); }
function frInLibrary(name) { Object.assign(S.set.f, { q: '', years: [], genres: [], platforms: [], series: [], franchise: [name], collections: [], props: [], addedFrom: '', addedTo: '', seriesMode: '', franchiseMode: '', maxTime: 0, done: '', minRating: 0 }); saveSet(); S.retGame = null; S.tab = 'library'; render(); }
function openFrCard(name) { S.frCard = { name, sel: new Set(), selMode: false }; closeSheet(); S.tab = 'frcard'; render(); const b = $('#fcBody'); if (b) b.scrollTop = 0; }
async function frRenameAll(name, n, noSnap) { // переименовать франшизу у всех игр (если такая франшиза уже есть, игры объединяются с ней)
  const games = fcList(name), f = S.set.f, snap = noSnap ? null : takeSnap(); n = serKey(n) === serKey(name) ? String(n).trim() : canonFranchise(n);
  for (const g of games) g.franchise = n; await saveGames(games); f.franchise = f.franchise.map(x => x === name ? n : x); frMigrate(name, n);
  if (S.frCard && serKey(S.frCard.name) === serKey(name)) S.frCard.name = n; saveSet(); return { n, snap };
}
function frCardInfoHtml() {
  const c = S.frCard, name = c.name, k = serKey(name), list = fcList(name), done = list.filter(g => g.done).length, pc = list.length ? Math.round(done * 100 / list.length) : 0;
  const chk = serMap('frChk')[k], ok = !!serMap('frOk')[k], col = serMap('frCol')[k], miss = ok ? 0 : chk && !chk.none ? Math.max(0, chk.total - chk.have) : -1;
  const hours = Math.round(list.reduce((a, g) => a + (+g.time || 0), 0) * 10) / 10, rated = list.filter(g => g.rating), avg = rated.length ? Math.round(rated.reduce((a, g) => a + g.rating, 0) / rated.length * 10) / 10 : 0;
  const ys = list.map(g => +g.year).filter(Boolean), kv = (a, b) => '<div class="kv"><span>' + a + '</span><b>' + b + '</b></div>';
  const stat = ok ? '<i class="okk">✓ checked, complete (marked manually)</i>' : chk && !chk.none ? (miss > 0 ? '<i class="warnk">⚠ missing from IGDB: ' + miss + '</i>' : '<i class="okk">✓ every IGDB game is here</i>') + ' · ' + esc(new Date(chk.t).toLocaleDateString(LOC)) : '<i class="nock">not checked</i>';
  return '<div class="scard">' + kv('Games in the franchise', list.length) + kv('Series in the franchise', new Set(list.map(g => g.series).filter(Boolean)).size) + kv('Standalone games', list.filter(g => !g.series).length) + kv('Completed', done + ' of ' + list.length + ' (' + pc + '%)')
    + '<div class="spbar' + tkCls(list.length) + '" style="' + tkSty(list.length) + 'margin:2px 0 8px"><i style="width:' + pc + '%;background:' + pctColor(pc) + '"></i></div>'
    + kv('Franchise check', stat) + (chk && !chk.none ? kv('In IGDB (selected types)', chk.total + ', you have ' + chk.have) : '')
    + (col ? kv('Franchise in IGDB', esc(col.name) + (serKey(col.name) !== k ? ' <i class="warnk">≠ the name</i>' : '')) : '')
    + kv('Check against IGDB', (() => { const v = frVerMap(), ts = v.s[k], n = list.filter(g => v.g[g.id]).length; return ts ? esc(new Date(ts).toLocaleDateString(LOC)) + ', games: ' + n + ' of ' + list.length + (frStale(name, 'old') && !frStale(name, 'new') ? ' <i class="warnk">long ago</i>' : '') : '<i class="nock">not checked</i>'; })())
    + (hours ? kv('Playtime', hours + ' h') : '') + (avg ? kv('Average rating', '★' + avg) : '') + (ys.length ? kv('Years', Math.min.apply(null, ys) === Math.max.apply(null, ys) ? ys[0] : Math.min.apply(null, ys) + '–' + Math.max.apply(null, ys)) : '') + '</div>'
    + '<div class="tools scbar">' + tb('fcSearch', 'find', 'Search', false, 'Search the franchise: all its IGDB games, missing ones can be added') + tb('fcCheck', 'checkc', 'Completeness', false, 'Check completeness: which games are missing from the catalog') + tb('fcNameCheck', 'aa', 'Title', false, 'Check the name and which games belong, against IGDB') + tb('fcGv', 'fact', 'Games', false, 'Full games check: name, year, time, series, franchise') + tb('fcAdd', 'plus', 'Add', false, 'Add games to the franchise') + tb('fcCatalog', 'tolib', 'In list', false, 'Show the games in the catalog list') + tb('fcMark', 'chkbox', 'Checked', ok, ok ? 'Franchise checked and complete: remove the mark' : 'Franchise checked and complete, the rest is not needed') + '</div>'
    + (c.selMode ? '<div class="toolbar"><button class="btn" data-act="fcSel">Cancel</button><button class="btn" data-act="fcSelAll">All</button><button class="btn" data-act="fcRemove"' + (c.sel.size ? '' : ' disabled') + '>Remove from the franchise (' + c.sel.size + ')</button><button class="btn" data-act="fcMove"' + (c.sel.size ? '' : ' disabled') + '>Move to another franchise… (' + c.sel.size + ')</button><button class="btn" data-act="fcDel"' + (c.sel.size ? '' : ' disabled') + '>Delete from the catalog (' + c.sel.size + ')</button></div>' : '')
    + (list.length ? '' : '<p class="hint">The franchise has no games yet. Add them with the “Add games” button.</p>');
}
function frCardGamesHtml() {
  const c = S.frCard, list = fcList(c.name), row = vmodeOf('frcard') === 'list';
  if (!list.length) return '';
  const mk = g => { const src = coverSrc(g), sel = c.sel.has(g.id), pk = (sel ? ' pick' : '') + (g.done ? ' isdone' : '') + (g.id === S.lastGame ? ' last' : ''), ck = sel ? '<span class="selck">✓</span>' : '';
    return row ? '<div class="srow' + pk + '" data-gid="' + g.id + '" data-lpm="fcgame" data-act="fcGame">' + ck + '<div class="sth" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '></div><div class="sm"><div class="nm">' + esc(g.name) + '</div><div class="m">' + esc([g.year || '', (g.platforms || []).slice(0, 2).map(shortPlat).join(', '), g.time ? g.time + ' h' : ''].filter(Boolean).join(' · ')) + '</div></div>' + (g.done ? '<span class="ok2">✓</span>' : '') + '</div>'
      : '<div class="card' + pk + '" data-gid="' + g.id + '" data-lpm="fcgame" data-act="fcGame">' + ck + '<div class="cv' + (src ? '' : ' nocover') + '" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '>' + (g.year || g.time || g.done ? '<div class="strip"><span class="sp">' + (g.year || '') + '</span><span class="sr">' + (g.time ? '⏱ ' + g.time + 'h' : '') + (g.done ? ' <i class="ck">✓</i>' : '') + '</span></div>' : '') + '</div><div class="t">' + esc(g.name) + '</div></div>'; };
  const bySer = new Map(); list.forEach(g => { const k = g.series || ''; if (!bySer.has(k)) bySer.set(k, []); bySer.get(k).push(g); });
  const ks = Array.from(bySer.keys()).filter(Boolean).sort((x, y) => Math.min.apply(null, bySer.get(x).map(g => +g.year || 9999)) - Math.min.apply(null, bySer.get(y).map(g => +g.year || 9999)) || x.localeCompare(y, LOC));
  const box = arr => row ? '<div class="srl z' + colsFor('searchL') + '">' + arr.map(mk).join('') + '</div>' : '<div class="grid z' + colsFor('grid') + '" style="--cols:' + colsFor('grid') + '">' + arr.map(mk).join('') + '</div>';
  const head = (t, extra, name) => '<div class="frsec"' + (name ? ' data-act="frSerOpen" data-name="' + esc(name) + '"' : '') + '><b>' + t + '</b>' + extra + (name ? '<i>›</i>' : '') + '</div>';
  return ks.map(k => { const l = bySer.get(k), d = l.filter(g => g.done).length; return head('Series “' + esc(k) + '»', '<span>' + gWord(l.length) + ' · completed ' + Math.round(d * 100 / l.length) + '%</span>', k) + box(l); }).join('') + (bySer.get('') ? head('Standalone games', '<span>' + gWord(bySer.get('').length) + '</span>', '') + box(bySer.get('')) : '');
}
function viewFrCard() {
  const c = S.frCard, retOk = !!(S.retGame && gameById(S.retGame.id));
  return '<div class="top"><div class="hdr2" style="margin:6px 0 4px"><button class="btn" data-act="fcBack">' + (retOk ? '← Back to the card' : '← Back') + '</button><div class="tools" style="margin:0">' + ib('fcVmode', vmodeOf('frcard') === 'list' ? 'grid' : 'list', vmodeOf('frcard') === 'list' ? 'Tile' : 'List', false) + '<button class="ib" data-act="fcMenu" aria-label="Franchise menu" title="Franchise menu">⋮</button></div></div><div class="serttl big">' + esc(c.name) + '</div></div>'
    + '<div class="scrl" id="fcBody">' + frCardInfoHtml() + frCardGamesHtml() + '</div>';
}
function fcRefresh() { if (S.tab !== 'frcard' || !S.frCard) return; const b = $('#fcBody'); if (!b) return render(); const y = b.scrollTop; b.innerHTML = frCardInfoHtml() + frCardGamesHtml(); b.scrollTop = y; setTimeout(lazyCovers, 300); }
async function chooseFranchise(exclude) {
  const m = new Map(); S.games.forEach(g => { if (g.franchise && serKey(g.franchise) !== serKey(exclude || '\u0000')) m.set(g.franchise, (m.get(g.franchise) || 0) + 1); });
  const names = Array.from(m.keys()).sort((a, b) => a.localeCompare(b, LOC));
  const r = await choose({ title: 'Move to a franchise', search: true, items: [{ id: '__new', label: 'New franchise…', accent: true, pin: true }].concat(names.map(n => ({ id: n, label: n, sub: gWord(m.get(n)) }))) });
  if (r === null) return null; if (r === '__new') { const n = await promptBox('Franchise name', ''); return n && n.trim() ? canonFranchise(n) : null; } return r;
}
// проверка названия франшизы: сверка франшиз игр каталога с франшизами IGDB
async function frNameCheck(name) {
  const games = fcList(name).filter(g => g.igdbId), info = new Map(), key = serKey(name);
  for (let i = 0; i < games.length; i += 100) { const part = games.slice(i, i + 100), list = await igdb('/games', 'fields franchise.id,franchise.name,franchises.id,franchises.name; where id = (' + part.map(g => g.igdbId).join(',') + '); limit ' + part.length + ';'); list.forEach(x => info.set(x.id, frOf(x))); }
  const votes = new Map(), out = new Map(), saved = serMap('frCol')[key];
  games.forEach(g => (info.get(g.igdbId) || []).forEach(c => { const v = votes.get(c.id) || { id: c.id, name: c.name, n: 0 }; v.n++; votes.set(c.id, v); }));
  const all = Array.from(votes.values()).sort((a, b) => b.n - a.n), same = all.find(c => serKey(c.name) === key); let main = saved && saved.manual ? saved : same || all[0] || null, missing = false;
  if (!main) { const col = await frCollection(name); if (col) main = col; else missing = true; }
  if (main) games.forEach(g => {
    const cs = info.get(g.igdbId) || []; if (!cs.length || cs.some(c => c.id === main.id)) return;
    const t = cs.slice().sort((a, b) => (votes.get(b.id) ? votes.get(b.id).n : 0) - (votes.get(a.id) ? votes.get(a.id).n : 0))[0], e = out.get(t.id) || { col: { id: t.id, name: t.name }, games: [] }; e.games.push(g); out.set(t.id, e);
  });
  frStamp(name); saveSet();
  return { name, none: !games.length, missing, linked: games.length, total: fcList(name).length, main, rename: !!main && serKey(main.name) !== key && !(saved && saved.manual), groups: Array.from(out.values()).sort((a, b) => b.games.length - a.games.length) };
}
function drawFrFix() {
  const f = S.frFix; if (!f) return;
  const rows = [];
  if (f.missing) rows.push('<div class="fixrow"><div>Franchise <b>«' + esc(f.name) + '»</b> was not found in IGDB' + (f.linked ? '' : ' (the games have no IGDB entries)') + '. Games: ' + esc(fcList(f.name).slice(0, 6).map(x => x.name).join(', ') + (f.total > 6 ? '…' : '')) + '</div><button class="btn acc" data-act="frFixDelete">Delete the franchise and clear it in the games</button></div>');
  if (f.rename) rows.push('<div class="fixrow"><div>In IGDB this franchise is called <b>«' + esc(f.main.name) + '»</b>, and yours is “' + esc(f.name) + '».</div><button class="btn acc" data-act="frFixRename">Rename to “' + esc(f.main.name) + '»</button></div>');
  f.groups.forEach((g, i) => rows.push('<div class="fixrow"><div><b>' + gWord(g.games.length) + '</b> belong to the franchise in IGDB <b>«' + esc(g.col.name) + '»</b>: ' + esc(g.games.slice(0, 6).map(x => x.name).join(', ') + (g.games.length > 6 ? '…' : '')) + '</div><button class="btn acc" data-act="frFixMove" data-i="' + i + '">Move to “' + esc(g.col.name) + '»</button></div>'));
  if (!f.missing && (!rows.length || (f.main && !f.rename && !f.groups.length))) rows.push('<p class="sub">✓ The franchise name matches IGDB, and every game with an IGDB entry belongs to it.</p>');
  openSheet('<div class="hdr2"><h2>Franchise name</h2></div><p class="sub">Franchise “' + esc(f.name) + '”: games ' + f.total + ', of them with an IGDB entry ' + f.linked + '</p>' + rows.join('') + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Done</button>');
}
const frVerMap = () => { const v = S.set.frVer = S.set.frVer || {}; v.s = v.s || {}; v.g = v.g || {}; return v; };
const frVerTs = name => { const v = frVerMap(); return Math.min.apply(null, [v.s[serKey(name)] || 0].concat(fcList(name).map(g => v.g[g.id] || 0))); }; // 0: франшиза или хотя бы одна её игра не сверялась
const frStale = (name, mode) => { if (mode === 'all') return true; const t = frVerTs(name); return mode === 'new' ? t === 0 : t === 0 || t < Date.now() - SER_VER_DAYS * 864e5; };
function frStamp(name) { const v = frVerMap(), now = Date.now(); v.s[serKey(name)] = now; fcList(name).forEach(g => { v.g[g.id] = now; }); }
const frProgText = () => { const V = S.frVer, A = S.frAll; if (V && V.run) return V.msg || 'Franchises checked: ' + V.done + ' of ' + V.total; if (A && A.run) return 'Franchises checked: ' + A.done + ' of ' + A.total; return (V && V.msg) || (A && A.msg) || ''; };
async function frVerMode(names) {
  if (!names.some(n => frVerTs(n) > 0)) return 'all';
  const nNew = names.filter(n => frStale(n, 'new')).length, nOld = names.filter(n => frStale(n, 'old')).length;
  return choose({ title: 'Checking franchises against IGDB', items: [{ id: 'old', label: 'Unchecked and checked long ago (' + nOld + ')', sub: 'checked more than ' + SER_VER_DAYS + ' days ago' }, { id: 'new', label: 'Unchecked only (' + nNew + ')' }, { id: 'all', label: 'All franchises (' + names.length + ')' }] });
}
function frVerDraw() { const el = $('#frProg'), b = $('#frVerBtn'), V = S.frVer; if (el) el.textContent = frProgText(); if (b && V) btnLbl(b, V.run ? 'Stop' : 'Check'); }
async function frVerifyRun(names, V) {
  const skip = serMap('frSkip'), issues = [], info = new Map(), ids = Array.from(new Set(names.reduce((a, n) => a.concat(fcList(n)), []).filter(g => g.igdbId).map(g => g.igdbId)));
  V.msg = 'Loading game franchises from IGDB…'; frVerDraw();
  for (let i = 0; i < ids.length && V.run; i += 100) { const part = ids.slice(i, i + 100), list = await igdb('/games', 'fields franchise.id,franchise.name,franchises.id,franchises.name; where id = (' + part.join(',') + '); limit ' + part.length + ';'); list.forEach(x => info.set(x.id, frOf(x))); }
  V.msg = ''; frVerDraw();
  const gv = new Map(); info.forEach(cs => cs.forEach(c => gv.set(c.id, (gv.get(c.id) || 0) + 1)));
  for (const name of names) {
    if (!V.run) break;
    const key = serKey(name), gs = fcList(name), linked = gs.filter(g => g.igdbId && info.has(g.igdbId)), votes = new Map(), saved = serMap('frCol')[key], manual = !!(saved && saved.manual);
    linked.forEach(g => info.get(g.igdbId).forEach(c => { const x = votes.get(c.id) || { id: c.id, name: c.name, n: 0 }; x.n++; votes.set(c.id, x); }));
    const all = Array.from(votes.values()).sort((a, b) => b.n - a.n), same = all.find(c => serKey(c.name) === key); let main = manual ? saved : same || all[0] || null;
    if (!main) {
      let col = null, err = false; try { col = await frCollection(name); } catch (e) { err = true; V.bad++; logErr('franchise check', e); }
      if (err) { if (S.block) break; V.done++; continue; }
      if (col) main = col; else if (!skip['m|' + key]) issues.push({ kind: 'missing', franchise: name, games: gs.map(g => g.id) });
    }
    if (main) {
      if (serKey(main.name) !== key && !manual && !skip['r|' + key]) issues.push({ kind: 'rename', franchise: name, to: main.name, games: gs.map(g => g.id) });
      const out = new Map();
      linked.forEach(g => {
        const cs = info.get(g.igdbId); if (!cs.length || cs.some(c => c.id === main.id) || skip['g|' + g.id]) return;
        const t = cs.slice().sort((a, b) => (gv.get(b.id) || 0) - (gv.get(a.id) || 0))[0], e = out.get(t.id) || { kind: 'move', franchise: name, to: t.name, games: [] }; e.games.push(g.id); out.set(t.id, e);
      });
      out.forEach(e => issues.push(e));
    }
    frStamp(name); V.done++; if (V.done % 10 === 0) { saveSet(); frVerDraw(); }
  }
  saveSet(); return issues;
}
async function frApplyIssue(iss) {
  if (iss.kind === 'missing') {
    const games = fcList(iss.franchise), k = serKey(iss.franchise); for (const g of games) g.franchise = ''; await saveGames(games);
    S.set.f.franchise = S.set.f.franchise.filter(x => serKey(x) !== k); ['frOk', 'frCol', 'frChk', 'frIgnore'].forEach(m => { delete serMap(m)[k]; }); delete frVerMap().s[k];
  } else if (iss.kind === 'rename') await frRenameAll(iss.franchise, iss.to, true);
  else { const games = iss.games.map(gameById).filter(Boolean), n = canonFranchise(iss.to); for (const g of games) g.franchise = n; await saveGames(games); }
  saveSet();
}
async function frVerifyAll() {
  const V0 = S.frVer; if (V0 && V0.run) { V0.run = false; return; }
  if (S.frAll && S.frAll.run) return toast('Wait for the completeness check to finish or stop it');
  if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
  const all = Array.from(franchiseGroups().keys()).filter(Boolean); if (!all.length) return toast('No franchises yet');
  const mode = await frVerMode(all); if (!mode) return;
  const names = all.filter(n => frStale(n, mode)); if (!names.length) return toast('All franchises were checked recently');
  const V = S.frVer = { run: true, done: 0, total: names.length, bad: 0, msg: '' }; frVerDraw();
  let issues = []; try { issues = await frVerifyRun(names, V); } catch (e) { logErr('franchise checking', e); toast(e.message); }
  const stopped = !V.run; V.run = false; S.frIssues = issues;
  V.msg = (stopped ? 'Checking stopped. ' : '') + 'Franchises checked: ' + V.done + ', problems found: ' + issues.length + (V.bad ? ', errors: ' + V.bad : '');
  if (S.tab === 'series' && S.serKind === 'fr') render(); toast(V.msg); if (issues.length) drawFrIssues();
}
function drawFrIssues() {
  const L = S.frIssues || [], nm = id => (gameById(id) || {}).name || '', list = ids => esc(ids.slice(0, 6).map(nm).filter(Boolean).join(', ') + (ids.length > 6 ? '…' : ''));
  const row = (x, i) => '<div class="fixrow"><div>' + (x.kind === 'missing' ? 'Franchise <b>«' + esc(x.franchise) + '»</b> was not found in IGDB. Games (' + x.games.length + '): ' + list(x.games)
    : x.kind === 'rename' ? 'Franchise <b>«' + esc(x.franchise) + '»</b> is called in IGDB <b>«' + esc(x.to) + '»</b> (games: ' + x.games.length + ')'
      : 'In the franchise <b>«' + esc(x.franchise) + '»</b>: <b>' + gWord(x.games.length) + '</b> belong to the franchise in IGDB <b>«' + esc(x.to) + '»</b>: ' + list(x.games)) + '</div>'
    + '<div class="fxb"><button class="btn acc" data-act="frIssueApply" data-i="' + i + '">' + (x.kind === 'missing' ? 'Delete the franchise and clear it in the games' : x.kind === 'rename' ? 'Rename to “' + esc(x.to) + '»' : 'Move to “' + esc(x.to) + '»') + '</button><button class="btn" data-act="frIssueSkip" data-i="' + i + '">Keep as is</button></div></div>';
  openSheet('<div class="hdr2"><h2>Checking franchises against IGDB</h2></div>' + (L.length ? '<p class="sub">Problems found: ' + L.length + '. “Keep as is” remembers your choice, and this problem is not shown again.</p><button class="btn acc" style="width:100%;margin-bottom:6px" data-act="frIssuesAll">Apply all (' + L.length + ')</button>' + L.map(row).join('') : '<p class="sub">✓ No problems: the franchises exist in IGDB and the games belong to the right franchises.</p>') + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Done</button>');
}
const frTypes = () => { const t = S.set.frTypes; return Array.isArray(t) && t.length ? t.map(Number) : SER_TYPES_DEF; };
const frCache = new Map();
// все игры франшизы IGDB (кроме DLC, модов и патчей); типы отбираются уже в приложении, поэтому смена типов не требует новых запросов
async function frGames(colId, times) {
  let c = frCache.get(colId);
  if (!c || Date.now() - c.t > 6e5) {
    const list = await igdb('/games', 'fields ' + IGDB_FIELDS + '; where (franchise = ' + (+colId) + ' | franchises = (' + (+colId) + ')) & game_type = (' + SER_TYPE_LIST.map(x => x[0]).join(',') + '); sort first_release_date asc; limit 500;');
    list.forEach(x => { x._src = 'igdb'; }); c = { t: Date.now(), v: list, tm: false }; frCache.set(colId, c);
  }
  if (times && !c.tm) { await attachTimes(c.v); c.tm = true; }
  return c.v;
}
// какой франшизы IGDB соответствует франшиза каталога: по играм каталога (у них известны франшизы IGDB), затем по названию; выбор запоминается
async function frCollection(name) {
  const key = serKey(name), saved = serMap('frCol')[key]; if (saved) return saved;
  const ids = S.games.filter(g => g.igdbId && g.franchise && serKey(g.franchise) === key).slice(0, 100).map(g => g.igdbId); let best = null;
  if (ids.length) {
    const list = await igdb('/games', 'fields franchise.id,franchise.name,franchises.id,franchises.name; where id = (' + ids.join(',') + '); limit ' + ids.length + ';'), votes = new Map();
    list.forEach(x => (frOf(x)).forEach(c => { const v = votes.get(c.id) || { id: c.id, name: c.name, n: 0, same: serKey(c.name) === key ? 1 : 0 }; v.n++; votes.set(c.id, v); }));
    best = Array.from(votes.values()).sort((a, b) => b.same - a.same || b.n - a.n)[0] || null;
  }
  if (!best) {
    const r = await igdb('/franchises', 'search "' + igdbQuote(name) + '"; fields name,games; limit 10;');
    best = r.find(c => serKey(c.name) === key) || r.find(c => serKey(c.name).includes(key) || key.includes(serKey(c.name))) || null;
  }
  if (!best) return null;
  const col = { id: best.id, name: best.name }; serMap('frCol')[key] = col; saveSet(); return col;
}
// поиск франшиз: по названию франшизы и по названию игры (франшизы найденных игр)
async function searchFranchises(q) {
  const [r, g] = await Promise.all([igdb('/franchises', 'search "' + igdbQuote(q) + '"; fields name,games; limit 30;'), igdb('/games', 'search "' + igdbQuote(q) + '"; fields name,franchise.id,franchise.name,franchises.id,franchises.name; limit 20;').catch(e => { if (S.block) throw e; return []; })]);
  const out = r.map(c => ({ id: c.id, name: c.name, n: (c.games || []).length })), have = new Set(out.map(c => c.id));
  g.forEach(x => (frOf(x)).forEach(c => { if (!have.has(c.id)) { have.add(c.id); out.push({ id: c.id, name: c.name, n: 0, via: x.name }); } }));
  return out;
}
// присутствие игры IGDB в каталоге: по id или (для игр без IGDB) по названию и году
function frHave() {
  const ids = new Set(), names = new Map();
  S.games.forEach(g => { if (g.igdbId) ids.add(g.igdbId); const k = normName(g.name); if (!names.has(k)) names.set(k, []); names.get(k).push({ y: g.year || 0, l: !!g.igdbId }); });
  return x => { if (ids.has(x.id)) return true; const y = yearOf(x); return (names.get(normName(x.name)) || []).some(e => e.l ? (e.y && y && e.y === y) : (!e.y || !y || e.y === y)); };
}
function frAnalyze(list, name) {
  const have = frHave(), ign = new Set(serMap('frIgnore')[serKey(name)] || []), types = frTypes(), now = Date.now(), items = [];
  list.forEach(x => {
    if (!types.includes(typeOf(x))) return;
    const it = mapItem(x); it.have = have(x); it.ign = ign.has(x.id); it.fut = !x.first_release_date || x.first_release_date * 1000 > now; it.gid = x.id; items.push(it);
  });
  const live = items.filter(i => !i.ign && (!i.fut || S.set.frFuture)), haveN = live.filter(i => i.have).length;
  return { items, total: live.length, haveN, miss: live.length - haveN, hidden: items.filter(i => i.ign).length, future: items.filter(i => i.fut && !i.ign).length };
}
function frSave(name, col, an) { serMap('frChk')[serKey(name)] = { t: Date.now(), id: col.id, total: an.total, have: an.haveN }; saveSet(); }
async function frCheck(name) {
  const col = await frCollection(name);
  if (!col) { serMap('frChk')[serKey(name)] = { t: Date.now(), none: 1 }; saveSet(); return null; }
  const an = frAnalyze(await frGames(col.id), name); an.col = col; frSave(name, col, an); return an;
}
const frMiss = name => { if (serMap('frOk')[serKey(name)]) return 0; const c = serMap('frChk')[serKey(name)]; return c && !c.none ? Math.max(0, c.total - c.have) : -1; };
// значок у франшизы: «⚠ 2» (не хватает 2 игр) или «✓» (франшиза полная или отмечена вручную); одна строка, высоту плитки не меняет
function frBadge(name) {
  const k = serKey(name), c = serMap('frChk')[k], ok = !!serMap('frOk')[k]; if ((!c || c.none) && !ok) return '';
  const miss = ok || !c ? 0 : c.total - c.have, a = ' data-act="frCheck" data-name="' + esc(name) + '" title="' + (ok ? 'Franchise marked as complete' : miss > 0 ? 'Games missing: ' + miss : 'Franchise complete') + (c ? '. Checked ' + esc(new Date(c.t).toLocaleDateString(LOC)) : '') + '"';
  return miss > 0 ? '<button class="serbd warn"' + a + '>⚠ ' + miss + '</button>' : '<button class="serbd good"' + a + '>✓</button>';
}
// название франшизы в каталоге по играм из списка IGDB (чтобы не заводить вторую франшизу с другим названием)
function frCatalogName(list) {
  const ids = new Set(list.map(x => x.id)), cnt = new Map();
  S.games.forEach(g => { if (g.franchise && g.igdbId && ids.has(g.igdbId)) cnt.set(g.franchise, (cnt.get(g.franchise) || 0) + 1); });
  return Array.from(cnt.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}
function frApply() { // список на экране франшизы из загруженных игр, типов, скрытых и фильтра «только недостающие»
  const s = S.search, c = s.chk; if (!c || !c.list) return;
  const an = frAnalyze(c.list, c.name); c.an = an;
  const vis = i => c.showIgn ? i.ign : (!i.ign && (S.set.frFuture || !i.fut));
  s.results = an.items.filter(i => vis(i) && (!c.onlyMiss || !i.have)); s.count = s.results.length; s.hasMore = false;
  if (c.col) frSave(c.name, c.col, an);
}
async function showFranchiseView(name, o) {
  o = o || {}; const s = S.search;
  if (!S.retGame && !(o.from && o.from !== 'search') && pushSearchState()) s.stack[s.stack.length - 1].lastRid = '';
  s.bundle = null; s.src = 'igdb'; s.token++; const token = s.token; s.mode = 'series'; s.title = name; s.results = []; s.hasMore = false; s.loading = true; s.started = true; s.count = 0; s.lastRid = '';
  s.chk = { kind: 'fr', name, col: null, list: null, an: null, onlyMiss: !!o.onlyMiss, showIgn: false, from: o.from || '' }; s.sel = new Set(); s.selMode = false; s.bind = ''; S.tab = 'search'; closeSheet(); render();
  try {
    const col = o.colId ? { id: o.colId, name } : await frCollection(name); if (token !== s.token) return;
    if (col) {
      const list = await frGames(col.id, true); if (token !== s.token) return;
      s.chk.col = col; s.chk.list = list;
      if (o.colId) { const nm = frCatalogName(list); if (nm) { s.chk.name = nm; s.title = nm; } const k = serKey(s.chk.name); if (!serMap('frCol')[k]) { serMap('frCol')[k] = { id: col.id, name: col.name }; saveSet(); } }
      frApply();
    }
  } catch (e) { logErr('IGDB franchise', e); if (token === s.token) toast(e.message); }
  if (token === s.token) { s.loading = false; renderSearchBody(); }
}
function frHeadHtml() {
  const s = S.search, c = s.chk, an = c.an, ok = !!serMap('frOk')[serKey(c.name)];
  let h = '';
  if (s.loading) return h + '<p class="sub">Checking the franchise in IGDB…</p>';
  if (!c.col) return h + '<div class="hint">Franchise “' + esc(c.name) + '” was not found in IGDB.<br><br><button class="btn acc" data-act="frRebind">Pick the IGDB franchise manually</button></div>';
  const pc = an.total ? Math.round(an.haveN * 100 / an.total) : 0, full = ok || (an.total > 0 && an.miss === 0), n = s.sel.size;
  h += '<p class="sub" style="margin:0 2px 6px">IGDB: «' + esc(c.col.name) + '” · in the catalog <b>' + an.haveN + ' of ' + an.total + '</b>' + (ok ? ' · ✓ marked as complete manually' : full ? ' · ✓ franchise complete' : an.miss ? ' · missing: <b>' + an.miss + '</b>' : '') + '</p>'
    + '<div class="spbar' + tkCls(an.total) + '" style="' + tkSty(an.total) + 'margin:0 2px 8px"><i style="width:' + (ok ? 100 : pc) + '%;background:' + (full ? 'var(--green)' : '#f0a030') + '"></i></div>'
    + '<div class="chips scroll sm"><button class="p sm' + (c.onlyMiss ? ' on' : '') + '" data-act="frOnly">Missing</button>'
    + '<button class="p sm' + (S.set.frFuture ? ' on' : '') + '" data-act="frFuture">Unreleased' + (an.future ? ' ' + an.future : '') + '</button>'
    + (an.hidden || c.showIgn ? '<button class="p sm' + (c.showIgn ? ' on' : '') + '" data-act="frShowIgn">Hidden ' + an.hidden + '</button>' : '')
    + '<button class="p sm' + (s.selMode ? ' on' : '') + '" data-act="frSel">' + (s.selMode ? '✓ Select' : 'Select') + '</button></div>';
  if (s.selMode) h += '<div class="toolbar"><button class="btn" data-act="frSelMiss">All missing</button>'
    + (c.showIgn ? '' : '<button class="btn acc" data-act="frAddSel"' + (n ? '' : ' disabled') + '>＋ Add to the catalog (' + n + ')</button>')
    + '<button class="btn" data-act="frIgnSel"' + (n ? '' : ' disabled') + '>' + (c.showIgn ? 'Return to the franchise (' + n + ')' : 'Not needed (' + n + ')') + '</button></div>';
  return h + '<div class="chips sm" style="margin-top:2px"><button class="p sm' + (ok ? ' on' : '') + '" data-act="frMark">' + (ok ? '☑' : '☐') + ' Franchise complete, the rest is not needed</button></div>'
    + '<p class="sub" style="margin:0 2px 8px"><a data-act="frRebind" style="color:var(--blue);cursor:pointer">Wrong IGDB franchise? Pick another</a></p>';
}
function frColListHtml() {
  const s = S.search;
  if (blockFor('igdb')) return blockBanner(true, 'igdb');
  if (!PROV.igdb.ready()) return '<div class="hint">' + PROV.igdb.noKeys + '<br><br><button class="btn acc" data-act="tab" data-tab="settings">Open settings</button></div>';
  if (s.loading) return '<div class="status">Loading…</div>';
  if (!s.cols.length) return '<div class="hint">' + (s.started ? 'Franchise not found in IGDB.<br>Try another name, or the name of a game from this franchise.' : 'Enter a franchise name (for example “Fallout”) or a game from it') + '</div>';
  const cnt = new Map(); S.games.forEach(g => { if (g.franchise) { const k = serKey(g.franchise); cnt.set(k, (cnt.get(k) || 0) + 1); } });
  return '<div class="srl">' + s.cols.map(c => {
    const k = cnt.get(serKey(c.name)) || 0, meta = [c.n ? 'entries in IGDB: ' + c.n : '', c.via ? 'via the game “' + c.via + '»' : '', k ? 'in the catalog: ' + k : ''].filter(Boolean).join(' · ');
    return '<div class="srow colrow" data-act="frColTap" data-id="' + c.id + '" data-name="' + esc(c.name) + '"><div class="sm"><div class="nm">' + esc(c.name) + '</div><div class="m">' + esc(meta) + '</div></div>' + (k ? '<span class="ok2">✓</span>' : '') + '</div>';
  }).join('') + '</div>';
}
async function frRunColSearch() {
  const s = S.search, q = s.q.trim(); s.cols = []; s.results = []; s.hasMore = false;
  if (!q) { s.started = false; renderSearchBody(); return; }
  if (!PROV.igdb.ready()) { renderSearchBody(); return; }
  const token = s.token; s.loading = true; s.started = true; renderSearchBody();
  try { const r = await searchFranchises(q); if (token === s.token) s.cols = r; } catch (e) { logErr('franchise search', e); if (token === s.token) toast(e.message); }
  finally { if (token === s.token) { s.loading = false; renderSearchBody(); } }
}
async function frAddSelected() {
  const s = S.search, c = s.chk, rids = Array.from(s.sel).filter(r => !gameByRid(r)); if (!rids.length) return toast('The selected games are already in the catalog');
  const snap = takeSnap(); let n = 0, bad = 0; toast('Adding games: ' + rids.length + '…');
  for (const rid of rids) { try { if (await addFromIgdb(rid, [], { forceSeries: c.name, bg: true })) n++; } catch (e) { bad++; logErr('franchise: adding a game', e); if (S.block) break; } }
  s.sel.clear(); s.selMode = false; frApply(); renderSearchBody(); toastUndo('Games added: ' + n + (bad ? ', failed: ' + bad : ''), snap);
}
function frDrawProg() {
  const A = S.frAll, el = $('#frProg'), b = $('#frAllBtn'); if (!A) return;
  if (el) el.textContent = frProgText();
  if (b) btnLbl(b, A.run ? 'Stop' : 'Completeness');
}
async function frCheckAll() {
  const A0 = S.frAll; if (A0 && A0.run) { A0.run = false; return; }
  if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
  const names = Array.from(franchiseGroups().keys()).filter(Boolean); if (!names.length) return toast('No franchises yet');
  const A = S.frAll = { run: true, done: 0, total: names.length, bad: 0, msg: '' }; frDrawProg();
  for (const n of names) {
    if (!A.run) break;
    try { await frCheck(n); } catch (e) { A.bad++; logErr('franchise check', e); if (S.block) break; }
    A.done++; frDrawProg(); if (A.done % 5 === 0 && S.tab === 'series' && S.serKind === 'fr') { const b = $('#tilesBox'); if (b) b.innerHTML = franchiseTilesHtml(); }
  }
  const stopped = !A.run; A.run = false;
  const inc = names.filter(n => frMiss(n) > 0).length, none = names.filter(n => (serMap('frChk')[serKey(n)] || {}).none).length;
  A.msg = (stopped ? 'Checking stopped. ' : '') + 'Incomplete franchises: ' + inc + (none ? ', not found in IGDB: ' + none : '') + (A.bad ? ', errors: ' + A.bad : '');
  if (S.tab === 'series' && S.serKind === 'fr') render(); toast(A.msg);
}


function frRowHtml(d, nm) { // строка франшизы в карточке игры: число игр, процент завершения, проверена ли франшиза (вручную или автоматически), итог проверки IGDB в рамке; снизу полоса с делениями по числу игр
  nm = String(nm || '').trim(); if (!nm) return '';
  const key = serKey(nm), list = S.games.filter(g => g.id !== d.id && g.franchise && serKey(g.franchise) === key); list.push(d);
  const done = list.filter(g => g.done).length, pc = Math.round(done * 100 / list.length), ok = !!serMap('frOk')[key], c = serMap('frChk')[key], has = !!(c && !c.none), miss = has ? Math.max(0, c.total - c.have) : 0, auto = has && !miss;
  const chk = ok || auto ? '<i class="okk" title="' + (ok ? 'Marked manually' : 'Checked automatically against IGDB') + '">✓ checked</i>' : '<i class="nock">not checked</i>';
  const a = ' data-act="frCheck" data-name="' + esc(nm) + '"', ig = !has ? '' : miss > 0 ? '<button class="serbd warn"' + a + ' title="Games missing in IGDB: ' + miss + '">⚠ ' + miss + '</button>' : '<button class="serbd good"' + a + ' title="Every IGDB game is here">✓ IGDB</button>';
  return '<div class="spmid" data-act="frCard" data-name="' + esc(nm) + '"><div class="sprow"><b>' + gWord(list.length) + '</b><span>completed <b>' + pc + '%</b></span>' + chk + ig + '</div><div class="spbar' + tkCls(list.length) + '" style="' + tkSty(list.length) + '"><i style="width:' + pc + '%"></i></div></div>';
}
async function frMenu(name) {
  if (!name) { const r0 = await choose({ title: 'No franchises', items: [{ id: 'export', label: 'Export the list…' }] }); if (r0 === 'export') openExport(S.games.filter(g => !g.franchise), 'No franchises'); return; }
  const r = await choose({ title: name, items: [{ id: 'check', label: 'Check franchise completeness in IGDB' }, { id: 'ok', label: serMap('frOk')[serKey(name)] ? 'Remove the “franchise complete” mark' : 'Mark the franchise complete (the rest is not needed)' }, { id: 'export', label: 'Export the list…' }, { id: 'catalog', label: 'Show the franchise games in the list' }, { id: 'rename', label: 'Rename (or merge with another franchise)' }, { id: 'del', label: 'Remove the franchise from all games (the games stay)' }] });
  const games = S.games.filter(g => g.franchise === name), f = S.set.f;
  if (r === 'export') return openExport(games, name);
  if (r === 'check') { if (S.tab !== 'frcard') S.retGame = null; return showFranchiseView(name, { from: S.tab === 'frcard' ? 'frcard' : 'series', onlyMiss: true }); }
  if (r === 'catalog') return frInLibrary(name);
  if (r === 'ok') { const m = serMap('frOk'), k = serKey(name); if (m[k]) delete m[k]; else m[k] = 1; saveSet(); render(); return toast(m[k] ? 'Franchise marked as complete' : 'Mark removed'); }
  if (r === 'rename') {
    let n = await promptBox('Franchise name', name); if (n) n = normName(n) === normName(name) ? n.trim() : canonFranchise(n);
    if (n && n !== name) { const snap = takeSnap(); for (const g of games) g.franchise = n; await saveGames(games); f.franchise = f.franchise.map(x => x === name ? n : x); frMigrate(name, n); if (S.frCard && serKey(S.frCard.name) === serKey(name)) S.frCard.name = n; saveSet(); render(); toastUndo('Franchise renamed', snap); }
  }
  if (r === 'del' && await confirmBox('Remove the franchise “' + name + '” from games: ' + games.length + '? The games themselves stay in the catalog.', 'Remove')) {
    const snap = takeSnap(); for (const g of games) g.franchise = ''; await saveGames(games); f.franchise = f.franchise.filter(x => x !== name); saveSet(); render(); toastUndo('Franchise removed from games: ' + games.length, snap);
  }
}

function franchiseGroups() { const m = new Map(); S.games.forEach(g => { const k = g.franchise || ''; if (!m.has(k)) m.set(k, []); m.get(k).push(g); }); return m; }
const FR_SORTS = [['alpha', 'Alphabetical (A → Z)'], ['-alpha', 'Alphabetical (Z → A)'], ['-count', 'By number of games (most first)'], ['count', 'By number of games (fewest first)'], ['-pct', 'By completion percentage (highest first)'], ['pct', 'By completion percentage (lowest first)'], ['-miss', 'Incomplete first (by the IGDB check)']];
function franchiseTilesHtml() {
  const m = franchiseGroups(), q = normName(S.sFind), none = m.get('') || [];
  const so = S.set.frSort || 'alpha', desc = so.charAt(0) === '-', kind = so.replace('-', ''), alpha = (a, b) => a.localeCompare(b, LOC);
  const names = Array.from(m.keys()).filter(n => n && (!q || normName(n).includes(q)) && (!S.set.frOnlyInc || frMiss(n) > 0)).sort((a, b) => {
    const la = m.get(a), lb = m.get(b), r = kind === 'count' ? la.length - lb.length : kind === 'pct' ? donePct(la) - donePct(lb) || la.length - lb.length : kind === 'miss' ? frMiss(a) - frMiss(b) : alpha(a, b);
    return r ? (desc ? -r : r) : alpha(a, b);
  });
  const mk = (key, list, menu) => entryHtml('series', { act: 'frOpen', attr: 'name', key, name: key || 'No franchises', count: list.length, games: list, color: '', covers: list.filter(x => x.hasCover || x.coverUrl).slice(0, 4).map(coverSrc).filter(Boolean), lpm: 'ser', badge: key ? frBadge(key) : '' });
  return ((!q || 'no franchises'.includes(q)) ? mk('', none, false) : '') + names.map(n => mk(n, m.get(n), true)).join('') || '<p class="hint">Nothing found</p>';
}
function viewFranchises() {
  const hasNames = Array.from(franchiseGroups().keys()).some(Boolean);
  return '<div class="top"><div class="hdr2"><h2>' + serKindSwitch() + '</h2>' + modeBtns('series') + '</div>'
    + '<div class="bar"><div class="sbox"><span>🔍</span><input id="sfind" placeholder="Search franchises" value="' + esc(S.sFind) + '"></div></div>'
    + (hasNames ? serToolbar(true) : '')
    + '</div><div class="scrl">' + dupBanner('series')
    + boxHtml('series', franchiseTilesHtml())
    + (hasNames ? '<p class="sub" style="text-align:center;margin-top:12px">Long-press a franchise: export, rename or remove</p>' : '')
    + (hasNames ? '' : '<p class="hint">No franchises yet. They appear when a game has a franchise: it is filled in automatically when adding from IGDB, and you can type it in manually on the game card.</p>') + '</div>';
}
/* ====== /FRANCHISE MODULE ====== */
const adding = new Set();
const askChoose = o => (window.__chooseHook || choose)(o), askPrompt = (...a) => (window.__promptHook || promptBox)(...a); // подмена нужна только тестам
// обложка и SteamGridDB в фоне: сеть не задерживает добавление игры; после загрузки признак «есть обложка» записывается в базу
function coverLater(g) {
  (async () => {
    try { await cacheCover(g); if (!g.coverUrl && S.set.sgdbKey && S.set.sgdbOn) { try { await sgdbAuto(g); } catch (e) { logErr('SteamGridDB', e); } } if (gameById(g.id)) await saveGame(g); }
    catch (e) { logErr('cover in background', e); }
  })();
}
async function addFromIgdb(rid, collIds = [], opts = {}) {
  let fin = true; // false - игра уже записана целиком, повторная запись не нужна
  const doneFlag = collIds.includes(DONE_ID); collIds = collIds.filter(id => id !== DONE_ID);
  const { src } = parseRid(rid), idk = src + 'Id', urlk = src + 'Url';
  let g = gameByRid(rid);
  if (!g) {
    if (adding.has(rid)) return null;
    adding.add(rid);
    try {
      const { d, series, franchise } = await fetchDetails(rid);
      const n0 = gameFromDetails(d, series, franchise), year0 = yearOfD(d);
      const manual = S.games.find(x => !x[idk] && normName(x.name) === normName(d.name) && (!x.year || !year0 || x.year === year0));
      if (manual && await confirmBox('The game “' + manual.name + '” is already in the catalog' + (srcsOf(manual).length ? ' (from ' + PROV[srcsOf(manual)[0]].name + ')' : ' (added manually)') + '. Merge with the data ' + PROV[src].name + '?', 'Merge')) {
        g = manual; g[idk] = d.id; if (n0[urlk]) g[urlk] = n0[urlk];
        ['year', 'rating', 'time', 'coverUrl'].forEach(k => { if (!g[k] && n0[k]) g[k] = n0[k]; });
        if (!g.genres.length) g.genres = n0.genres; if (!g.platforms.length) g.platforms = n0.platforms; if (!g.series) g.series = canonSeries(opts.forceSeries || n0.series || opts.series); if (!g.franchise) g.franchise = canonFranchise(opts.forceFranchise || n0.franchise);
        if (!g.hasCover) { g.coverSrc = src; await cacheCover(g); }
        await saveGame(g);
      } else {
        if (opts.line) n0.srcLine = opts.line; // строка разбора, из которой создана карточка
        if (opts.forceSeries) n0.series = opts.forceSeries; else if (opts.series && !n0.series) n0.series = opts.series; // серия из IGDB важнее серии из строки разбора: строка нужна, только если у игры в источнике серии нет
        if (opts.hours > 0) n0.time = opts.hours; // время из строки разбора важнее времени источника
        g = n0; g.series = canonSeries(g.series); g.franchise = canonFranchise(opts.forceFranchise || g.franchise); S.games.push(g);
        if (opts.bg) { // из карточки поиска: игра записывается сразу (коллекции и «Завершено» уже в записи), обложка докачивается в фоне
          collIds.forEach(id => { if (!g.collections.includes(id)) g.collections.push(id); }); if (doneFlag && !g.done) { g.done = true; g.doneDate = g.doneDate || todayStr(); }
          await saveGame(g); fin = false; coverLater(g);
        } else {
          await DB.put('games', g); await cacheCover(g);
          if (!g.coverUrl && S.set.sgdbKey && S.set.sgdbOn) { try { await sgdbAuto(g); } catch (e) { logErr('SteamGridDB', e); /* останется без обложки */ } }
        }
      }
    } finally { adding.delete(rid); }
  }
  if (fin) {
    collIds.forEach(id => { if (!g.collections.includes(id)) g.collections.push(id); });
    if (doneFlag && !g.done) { g.done = true; g.doneDate = g.doneDate || todayStr(); }
    await saveGame(g);
  }
  return g;
}
async function loadLists(src) {
  src = src || S.search.src;
  const c = S.lists[src]; if (c && c.genres && c.platforms && Date.now() - (c.t || 0) < 30 * 864e5) return c;
  let v;
  if (src === 'rawg') {
    const [g, p] = await Promise.all([rawg('/genres'), rawg('/platforms/lists/parents')]);
    v = { t: Date.now(), genres: g.results.map(x => ({ id: x.id, name: x.name })), platforms: [].concat(...p.results.map(x => (x.platforms || []).map(y => ({ id: y.id, name: canonPlat(y.name) })))) };
  } else {
    const [g, p] = await Promise.all([igdb('/genres', 'fields id,name; sort name asc; limit 100;'), igdb('/platforms', 'fields id,name; where id = (' + MAIN_PLATFORMS + '); sort name asc; limit 100;')]);
    v = { t: Date.now(), genres: g.map(x => ({ id: x.id, name: x.name })), platforms: p.map(x => ({ id: x.id, name: platC(x.name) })) };
  }
  S.lists[src] = v; await DB.put('settings', { key: 'lists', value: S.lists });
  return v;
}

/* ====================== SteamGridDB ====================== */
const SGDB = 'https://www.steamgriddb.com/api/v2';
const sgdbCache = new Map(); let sgdbLast = 0; // кэш на 10 минут: одну игру не запрашиваем повторно
async function sgdb(path) {
  if (!S.set.sgdbKey) throw new Error('Enter your SteamGridDB key in settings');
  const hit = sgdbCache.get(path); if (hit && Date.now() - hit.t < 6e5) return hit.v;
  const wait = (S.sgdbUntil || 0) - Date.now(); if (wait > 0) throw new Error('SteamGridDB asks to wait ' + Math.ceil(wait / 1000) + ' s (rate limit)');
  const gap = sgdbLast + (window.__gateMs !== undefined ? window.__gateMs : 550) - Date.now(); if (gap > 0) await new Promise(r => setTimeout(r, gap)); // не больше 2 запросов в секунду (лимит 120 в минуту)
  sgdbLast = Date.now();
  let r; try { r = await fetch(SGDB + path, { headers: { Authorization: 'Bearer ' + S.set.sgdbKey } }); } catch (e) { throw new Error('No connection to SteamGridDB (a browser may block requests, use the app)'); }
  bump('sgdb');
  if (r.status === 429) { const ra = +(r.headers && r.headers.get && r.headers.get('Retry-After')) || 60; S.sgdbUntil = Date.now() + ra * 1000; throw new Error('SteamGridDB: request limit (120 per minute), please wait ' + ra + ' s'); }
  if (r.status === 401 || r.status === 403) throw new Error('The SteamGridDB key was not accepted');
  if (!r.ok) throw new Error('SteamGridDB: error ' + r.status);
  const j = await r.json(); if (j.success === false) throw new Error('SteamGridDB: ' + ((j.errors || [])[0] || 'error'));
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
  if (!S.set.sgdbKey) return toast('Enter your SteamGridDB key in settings');
  try {
    toast('Searching SteamGridDB…');
    const found = await sgdbSearch(g.name); if (!found.length) return toast('Game not found in SteamGridDB');
    let id = found[0].id;
    if (found.length > 1) { const r = await choose({ title: 'Game in SteamGridDB', items: found.slice(0, 15).map(x => ({ id: x.id, label: x.name })) }); if (r === null) return; id = r; }
    const grids = await sgdbGrids(id); S.sgdb = { gid, grids };
    openSheet('<h2 style="margin:0 0 6px">SteamGridDB covers</h2><p class="sub">Tap a cover to make it the main one. Only the chosen one stays in the database.</p>'
      + (grids.length ? '<div class="grid" style="--cols:3">' + grids.slice(0, 60).map((x, i) => '<div class="card" data-act="sgdbUse" data-i="' + i + '"><div class="cv" style="background-image:url(\'' + bgu((x.thumb || x.url)) + '\')"></div></div>').join('') + '</div>' : '<p class="hint">No suitable covers</p>')
      + '<button class="btn" style="width:100%;margin-top:12px" data-act="closeSheet">Close</button>');
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
  let err = 'the site did not respond';
  for (const base of bases) {
    try {
      const h = Object.assign({ 'Content-Type': 'application/json' }, baseH), body = Object.assign({}, payload);
      const ir = await hltbFetch(HLTB + base + '/init?t=' + Date.now(), { headers: baseH });
      if (ir.ok) { const ij = await ir.json(); if (ij.token) h['x-auth-token'] = ij.token; if (ij.hpKey) { h['x-hp-key'] = ij.hpKey; h['x-hp-val'] = ij.hpVal; body[ij.hpKey] = ij.hpVal; } }
      const r = await hltbFetch(HLTB + base, { method: 'POST', headers: h, body: JSON.stringify(body) });
      if (!r.ok) { err = 'error ' + r.status; continue; }
      const j = await r.json(); if (!Array.isArray(j.data)) { err = 'unexpected response'; continue; }
      if (S.set.hltbBase !== base) { S.set.hltbBase = base; saveSet(); }
      return j.data;
    } catch (e) { err = e.message || 'failure'; }
  }
  S.set.hltbBase = ''; throw new Error('HLTB is not responding (' + err + '). The site often changes its internal API, so enter the time manually.');
}
async function hltbFind(name) {
  if (!isNative()) throw new Error('HLTB is only available in the Android app: browsers block such requests');
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
  sheetEl.innerHTML = '<div class="backdrop" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>' + html + '</div>';
  sheetEl._key = key; $('#layer').appendChild(sheetEl);
  return sheetEl.querySelector('.sheet');
}
// перерисовка с сохранением места прокрутки (список остаётся на той же игре)
function renderKeep() {
  const els = () => [$('#libBody'), $('#srBody'), $('#view .scrl'), $('#view')], sc = els().map(e => e ? e.scrollTop : 0);
  render(); els().forEach((e, i) => { if (e) e.scrollTop = sc[i]; }); focusLast();
}
// последняя открытая игра всегда в поле зрения
function focusLast() {
  if (S.tab !== 'library' || !S.lastGame) return;
  const el = $('tr[data-gid="' + S.lastGame + '"], .card[data-gid="' + S.lastGame + '"], .tl[data-gid="' + S.lastGame + '"]'), box = $('#libBody');
  if (!el || !box || !el.getBoundingClientRect || !box.getBoundingClientRect) return;
  const r = el.getBoundingClientRect(), b = box.getBoundingClientRect();
  if (r.top < b.top + 30 || r.bottom > b.bottom - 30) el.scrollIntoView({ block: 'center' });
}
const reduceMotion = () => { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } };
const animOn = () => S.set.animSet ? S.set.anim !== false : S.set.anim !== false && !reduceMotion(); // пока выбор не сделан вручную, учитываем системное «уменьшить анимацию»
const buzz = ms => { // в приложении Android вибрирует мост (не нужен доступ браузера), в браузере navigator.vibrate; короче ~12 мс обычно не чувствуется
  try {
    if (S.set.haptic === false) return; const t = Math.max(12, ms || 20), A = typeof window !== 'undefined' && window.AndroidShare;
    if (A && A.haptic) { A.haptic(t); return; }
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(t);
  } catch (e) { /* не поддерживается */ }
};
// список под карточкой прокручивается к текущей игре (при необходимости подгружая строки)
function followLast() {
  if (S.tab !== 'library' || !S.lastGame) return; const q = () => $('tr[data-gid="' + S.lastGame + '"], .card[data-gid="' + S.lastGame + '"], .tl[data-gid="' + S.lastGame + '"]');
  let el = q(); if (!el) { const b = libBuild(), li = b.entries.findIndex(e => e.t === 'g' && e.g.id === S.lastGame); if (li < 0) return; if (li >= (S.libN || 0)) { S.libN = li + 20; renderLibBody(); } el = q(); }
  if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: animOn() ? 'smooth' : 'auto' });
}
function closeSheet(instant, keep) {
  const sh0 = S.sheet;
  if (sh0 && sh0.dirty && sheetEl) { collectSheet(); sh0.dirty = false; persistDraft(sh0).then(ok => { if (!ok && !sh0.draft.name) toast('The game was not saved: the title is empty'); }); } // список перерисуется, когда запись закончится
  else if (sh0 && sh0.saved && sheetEl) setTimeout(renderKeep, 0); // уже сохранено автоматически (надпись «Сохранено»): список нужно обновить
  if (sheetEl && !keep) { const el = sheetEl; sheetEl = null; if (!instant && animOn() && el.classList && el.querySelectorAll) { el.querySelectorAll('[id]').forEach(n => { n.setAttribute('data-oldid', n.id); n.removeAttribute('id'); }); el.classList.add('closing'); setTimeout(() => el.remove(), 150); } else el.remove(); } S.sheet = null;
  S.shotUrls.forEach(u => URL.revokeObjectURL(u)); S.shotUrls = [];
}
function openModal() {
  closeModal(true);
  modalEl = document.createElement('div');
  modalEl.innerHTML = '<div class="backdrop" style="z-index:40" data-x="cancel"></div><div class="modal" role="dialog" aria-modal="true"></div>';
  $('#layer').appendChild(modalEl);
  modalEl.firstChild.onclick = () => modalCancel && modalCancel();
  return modalEl.querySelector('.modal');
}
function closeModal(silent) { if (modalEl) { modalEl.remove(); modalEl = null; } if (!silent) modalCancel = null; }
function choose({ title, items, multi = false, selected = [], ok = 'Done', search = false }) {
  return new Promise(res => {
    const sel = new Set(selected.map(String)); const m = openModal(); if (m.classList) m.classList.add('chm');
    m.innerHTML = '<h4>' + esc(title) + '</h4>' + (search ? '<label class="field"><input id="chq" placeholder="Search…" autocomplete="off"></label>' : '') + '<div id="chl"></div>'
      + '<div class="acts"><span data-x="cancel">Cancel</span>' + (multi ? '<span data-x="ok">' + ok + '</span>' : '') + '</div>';
    const draw = () => {
      const q = search ? normName($('#chq', m).value) : '';
      $('#chl', m).innerHTML = items.filter(it => !q || it.pin || normName(it.label).includes(q)).map(it => '<div class="opt' + (sel.has(String(it.id)) ? ' on' : '') + (it.accent ? ' accent' : '') + '" data-id="' + esc(it.id) + '">'
        + (multi ? '<span class="bx">' + (sel.has(String(it.id)) ? '✓' : '') + '</span>' : '') + (it.ico ? '<span class="oi">' + it.ico + '</span>' : '') + '<div>' + esc(it.label) + (it.sub ? '<div class="sub">' + esc(it.sub) + '</div>' : '') + '</div></div>').join('') || '<p class="sub">Nothing found</p>';
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
function confirmBox(text, okText = 'Yes') {
  if (window.__confirmHook) return Promise.resolve(window.__confirmHook(text, okText)); // подмена нужна только тестам
  return new Promise(res => {
    const m = openModal(); m.innerHTML = '<h4>' + esc(text) + '</h4><div class="acts"><span data-x="cancel">Cancel</span><span data-x="ok">' + esc(okText) + '</span></div>';
    modalCancel = () => { closeModal(); res(false); };
    m.onclick = e => { const x = e.target.closest('[data-x]'); if (x) { closeModal(); res(x.dataset.x === 'ok'); } };
  });
}
function focusEnd(el) { if (!el) return; el.focus(); try { const n = el.value.length; el.setSelectionRange(n, n); } catch (e) { /* поле без выделения */ } } // курсор всегда в конце текста
function promptBox(title, value = '', placeholder = '', num = '', rows = 0, extras = []) { // num: 'int' (целое, год) или 'dec' (дробное): цифровая клавиатура, буквы ввести нельзя
  return new Promise(res => {
    const m = openModal(); m.innerHTML = '<h4>' + esc(title) + '</h4><label class="field"><input id="pbx" value="' + esc(value) + '" placeholder="' + esc(placeholder) + '"' + (num ? ' type="text" inputmode="' + (num === 'int' ? 'numeric' : 'decimal') + '" autocomplete="off" pattern="' + (num === 'int' ? '[0-9]*' : '[0-9]*[.]?[0-9]*') + '"' : '') + '></label>' + (extras.length ? '<div class="chips">' + extras.map((x, i) => '<button class="p" data-ex="' + i + '">' + esc(x.label) + '</button>').join('') + '</div>' : '') + '<div class="acts"><span data-x="cancel">Cancel</span><span data-x="ok">OK</span></div>';
    if (rows) { const f = m.querySelector('.field'); f.innerHTML = '<textarea id="pbx" rows="' + rows + '" placeholder="' + esc(placeholder) + '" enterkeyhint="done" style="min-height:0;resize:none"></textarea>'; $('#pbx', m).value = value; } // длинные названия видны целиком (4-5 строк)
    modalCancel = () => { closeModal(); res(null); };
    const inp = $('#pbx', m); setTimeout(() => focusEnd(inp), 50);
    const clean = () => { if (!num || !inp) return; let v = String(inp.value || ''); if (num === 'int') v = v.replace(/\D/g, '').slice(0, 4); else { v = v.replace(/,/g, '.').replace(/[^0-9.]/g, ''); const i = v.indexOf('.'); if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, ''); v = v.slice(0, 6); } if (v !== inp.value) inp.value = v; };
    if (num) { inp.oninput = clean; clean(); }
    const done = () => { clean(); const v = inp.value.replace(/\s*\n\s*/g, ' ').trim(); closeModal(); res(num ? v : (v || null)); };
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); done(); } };
    m.onclick = async e => { const ex = e.target.closest('[data-ex]'); if (ex) { const b = extras[+ex.dataset.ex]; if (b) { const v = await b.fn(inp); if (v != null) { inp.value = String(v); clean(); } } return; } const x = e.target.closest('[data-x]'); if (x) { x.dataset.x === 'ok' ? done() : (closeModal(), res(null)); } };
  });
}
async function pickCollections(title, selected = [], allowNew = true) {
  const items = sortedColls().map(c => ({ id: c.id, label: c.name, sub: gWord(gamesIn(c.id).length) }));
  if (allowNew) items.push({ id: '__new', label: '＋ New collection…' });
  if (!items.length) { toast('No collections yet'); return null; }
  const r = await choose({ title, items, multi: true, selected, search: items.length > 12 });
  if (!r) return null;
  const ids = r.filter(x => x !== '__new');
  if (r.includes('__new')) { const c = await createCollection(); if (c) ids.push(c.id); }
  return ids;
}
async function createCollection() {
  const name = await promptBox('Collection name'); if (!name) return null;
  if (RESERVED.includes(normName(name))) { toast('“All games” and “Completed” always exist, choose another name'); return null; }
  const ex = S.collections.find(c => c.name.toLowerCase() === name.toLowerCase()); if (ex) return ex;
  const c = { id: uid(), name, created: Date.now(), order: S.collections.reduce((mx, x) => Math.max(mx, x.order != null ? x.order : -1), -1) + 1 }; S.collections.push(c); await DB.put('collections', c); return c;
}

/* ====================== Каталог ====================== */
function meta(o) {
  const p = [];
  if (o.rating) p.push('<span class="st">★' + o.rating + '</span>');
  const pl = (o.platforms || []).slice(0, 2).map(shortPlat).join(', '); if (pl) p.push(esc(pl));
  if (o.year) p.push(o.year);
  return p.join(' · ');
}
// плитка каталога: рейтинг слева вверху и год слева внизу, мелко на тёмном фоне поверх картинки; под картинкой только название
function cardHtml(g, x) {
  const src = coverSrc(g), sel = S.sel.has(g.id);
  const rt = g.rating ? '<span class="rt"><i>★</i>' + g.rating + '</span>' : '';
  const strip = (g.year || g.time || g.done) ? '<div class="strip"><span class="sp">' + (g.year || '') + '</span><span class="sr">' + (g.time ? '⏱ ' + g.time + 'h' : '') + (g.done ? ' <i class="ck">✓</i>' : '') + '</span></div>' : '';
  return '<div class="card' + (sel ? ' sel' : '') + (g.done ? ' isdone' : '') + (x ? ' extra' : '') + (g.id === S.lastGame ? ' last' : '') + '" data-gid="' + g.id + '" data-act="openGame"><div class="cv' + (src ? '' : ' nocover') + '" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '>'
    + rt + (x ? '<span class="xb" title="Not from the main list: a series game">★</span>' : '') + (S.selMode ? '<span class="chk">' + (sel ? '✓' : '') + '</span>' : '') + strip + '</div><div class="t">' + esc(g.name) + '</div></div>';
}
// текст из другого приложения («Поделиться»): в поиск игры или в список разбора
async function handleShared(text) {
  text = String(text || '').trim(); if (!text) return;
  const lines = text.split(/\r?\n/).filter(l => l.trim()), first = parseLine(lines[0]);
  const r = await askChoose({ title: 'Text received', items: [{ id: 'search', label: 'Find the game in search', sub: first ? first.text : lines[0].slice(0, 60), ico: '🔍' }, { id: 'inbox', label: 'Add to Inbox', sub: 'rows: ' + lines.length, ico: '📋' }] });
  if (r === 'search') { S.pending = null; Object.assign(S.search, { q: first ? first.text : lines[0], src: S.set.mainSrc }); fClear(S.search.f); S.tab = 'search'; render(); runSearch(true); }
  else if (r === 'inbox') {
    const lid = await askChoose({ title: 'Which list', items: S.inbox.lists.map(l => ({ id: l.id, label: l.name, sub: 'rows: ' + itemsOf(l.id).length })).concat([{ id: '__new', label: '＋ New list…' }]) }); if (lid === null) return;
    let id = lid;
    if (lid === '__new') { const name = await askPrompt('List name', '', 'for example: From chat'); if (!name) return; const l = { id: uid(), name, created: Date.now() }; S.inbox.lists.push(l); await DB.put('inboxLists', l); id = l.id; }
    const n = await addParsed(id, parseInboxText(text)); toast('Rows added: ' + n); S.inboxList = id; S.tab = 'inbox'; render();
  }
}
function openYoutube(q) { // в приложении Android сразу в приложении YouTube (если оно есть), иначе в браузере
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q), A = window.AndroidShare;
  if (isNative() && A && A.openApp) { try { if (A.openApp(url, 'com.google.android.youtube')) return; if (A.openApp(url, '')) return; } catch (e) { /* откроем как обычную ссылку */ } }
  openExternal(url);
}
const checkShared = () => { try { const A = window.AndroidShare, t = A && A.take ? A.take() : ''; if (t) handleShared(t); } catch (e) { /* общего текста нет */ } };
// «Название (год | платформы | серия) – время ч»: серия необязательна; без платформы, но с серией остаётся пустое место между чертами
function lineMeta(year, plats, series) {
  if (!year) return [plats, series].filter(Boolean).join(' | ');
  const a = [String(year), plats || '', series || '']; while (a.length > 1 && !a[a.length - 1]) a.pop(); return a.join(' | ');
}
function gameLine(g) { const m = lineMeta(g.year, platOut((g.platforms || []).map(shortPlat).join(', ')), g.series); return g.name + (m ? ' (' + m + ')' : '') + (g.time ? ' – ' + g.time + ' h' : ''); }
function tagsHtml(g, all) { // в строке списка две коллекции и «+N»; нажатие по ячейке показывает все (строка становится выше), повторное прячет
  const names = (g.collections || []).map(id => collById(id)).filter(Boolean);
  return (all ? names : names.slice(0, 2)).map(c => '<span class="tag"' + (okColor(c.color) ? ' style="color:' + okColor(c.color) + ';border-color:' + okColor(c.color) + '"' : '') + '>' + esc(c.name) + '</span>').join('') + (!all && names.length > 2 ? '<span class="tag m2">+' + (names.length - 2) + '</span>' : '');
}
const statusTxt = total => 'Games: ' + total + (S.nExtra ? ' (+' + S.nExtra + ' from series)' : '');
const normEnt = items => items.map(e => e && e.t ? e : { t: 'g', g: e, x: false });
function listHtml(items, total) {
  const ents = normEnt(items), c = S.set.cols, f = S.set.f, pin = !!S.set.pin, pcols = S.set.propCols || {}, lvl = colsFor('list'), cwid = S.set.colW || (S.set.colW = {});
  const props = S.props.filter(p => pcols[p.id] !== 0);
  const w0 = S.selMode ? 36 : 0;
  const pinned = i => pin && (i === 0 || i === 2);
  const cls = i => pinned(i) ? ' pc' + (i === 2 ? ' pl' : '') : '';
  // стиль ячейки: закрепление слева и ширина, заданная пользователем (колонки можно растягивать за правый край заголовка)
  const stl = (i, ck) => { let t = ''; if (pinned(i)) t += 'left:' + (i === 0 ? 0 : w0) + 'px;' + (i === 0 ? 'width:36px;min-width:36px;' : ''); const w = ck && cwid[ck]; if (w) t += 'width:' + w + 'px;min-width:' + w + 'px;max-width:' + w + 'px;overflow:hidden;text-overflow:ellipsis;'; return t ? ' style="' + t + '"' : ''; };
  const dk = ck => ck ? ' data-ck="' + ck + '"' : '';
  const sortLink = (t, k) => '<a data-act="sortBy" data-k="' + k + '"' + (t === '✓' ? ' title="Completed"' : '') + '>' + esc(t) + (f.sort === k ? (f.dir === 'desc' ? ' ▼' : ' ▲') : '') + '</a>';
  const th = (t, k, i, ck) => '<th class="' + cls(i).trim() + '"' + stl(i, ck) + dk(ck) + '>' + (k ? sortLink(t, k) : esc(t)) + (ck ? '<i class="rz" data-rz="' + ck + '"></i>' : '') + '</th>';
  const td = (ck, inner, cl, ex) => '<td' + (cl ? ' class="' + cl + '"' : '') + dk(ck) + (ex || '') + stl(-1, ck) + '>' + inner + '</td>';
  let h = '<div class="wrap d' + lvl + '"><table><thead><tr>' + (S.selMode ? th('', null, 0) : '') + (c.cover ? th('', null, 1) : '') + th('Title', 'name', 2, 'name')
    + (c.genres ? th('Genres', null, undefined, 'genres') : '') + (c.platforms ? th('Platforms', null, undefined, 'platforms') : '') + ((c.done || c.doneDate) ? th(c.doneDate ? (c.done ? '✓ Date' : 'Date') : '✓', c.doneDate ? 'doneDate' : 'done', undefined, 'doneDate') : '') + (c.year ? th('Year', 'year', undefined, 'year') : '') + (c.rating ? th('Rating', 'rating', undefined, 'rating') : '')
    + (c.time ? th('Time', 'time', undefined, 'time') : '') + (c.series ? th('Series', 'series', undefined, 'series') : '') + (c.franchise ? th('Franchise', 'franchise', undefined, 'franchise') : '') + props.map(p => th(p.name, 'prop:' + p.id, undefined, 'p:' + p.id)).join('') + (c.colls ? th('Collections', null, undefined, 'colls') : '') + (c.added ? th('Added', 'added', undefined, 'added') : '') + '</tr></thead><tbody>';
  const nc = (h.match(/<th/g) || []).length;
  ents.forEach(e => {
    if (e.t === 'h') { h += '<tr class="gh l' + e.lvl + '"><td colspan="' + nc + '">' + esc(e.text) + '<b>' + e.n + '</b></td></tr>'; return; }
    const g = e.g, src = coverSrc(g), open = ' data-act="openGame" data-gid="' + g.id + '"';
    const rc = [g.done ? 'isdone' : '', e.x ? 'extra' : '', S.sel.has(g.id) ? 'sel' : '', g.id === S.lastGame ? 'last' : ''].filter(Boolean).join(' ');
    h += '<tr data-gid="' + g.id + '"' + (rc ? ' class="' + rc + '"' : '') + '>' + (S.selMode ? '<td class="' + cls(0).trim() + '"' + stl(0) + open + '>' + (S.sel.has(g.id) ? '☑' : '☐') + '</td>' : '')
      + (c.cover ? '<td' + open + '><div class="thumb" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '></div></td>' : '')
      + '<td class="nmc' + cls(2) + '"' + stl(2, 'name') + dk('name') + open + '><div class="n">' + (e.x ? '<span class="xs" title="Not from the main list: a series game">★</span>' : '') + esc(g.name) + '</div></td>'
      + (c.genres ? td('genres', '<div class="gpt"><span>' + esc((g.genres || []).join(', ')) + '</span></div>', 'gp') : '')
      + (c.platforms ? td('platforms', '<div class="gpt"><span>' + esc((g.platforms || []).map(shortPlat).join(', ')) + '</span></div>', 'gp') : '')
      + ((c.done || c.doneDate) ? td('doneDate', (c.done && g.done ? '<span class="dck">✓</span>' : '') + (c.doneDate ? fmtDate(g.doneDate) : '')) : '') + (c.year ? td('year', g.year || '—') : '')
      + (c.rating ? td('rating', g.rating ? '<span style="color:#ffa000">★ ' + g.rating + '</span>' : '—') : '') + (c.time ? td('time', g.time ? g.time + ' h' : '—') : '')
      + (c.series ? td('series', '<div class="scd"' + (cwid.series ? ' style="max-width:none"' : '') + '>' + esc(g.series || '') + '</div>') : '') + (c.franchise ? td('franchise', '<div class="scd"' + (cwid.franchise ? ' style="max-width:none"' : '') + '>' + esc(g.franchise || '') + '</div>') : '')
      + props.map(p => { const v = g.props && g.props[p.id]; return td('p:' + p.id, hasVal(v) ? esc(v) : '', 'pv'); }).join('')
      + (c.colls ? td('colls', tagsHtml(g, S.expColls.has(g.id)), S.expColls.has(g.id) ? 'open' : '', ' data-act="toggleColls" data-gid="' + g.id + '"') : '') + (c.added ? td('added', fmtTs(g.added)) : '') + '</tr>';
  });
  return h + '</tbody></table></div><div class="status">' + statusTxt(total || ents.filter(e => e.t === 'g').length) + '</div>';
}
// третий вид: только текст, по строке на игру: «Название (год | платформы) – время»
// строки текстового вида одним текстом (для выгрузки в файл): те же колонки, что на экране
function textLines(items) {
  const tc = textCols(), lines = [];
  normEnt(items).forEach(e => {
    if (e.t === 'h') { lines.push('', e.text + ' (' + e.n + ')'); return; }
    const g = e.g, yr = tc.year && g.year ? g.year : '', pl = tc.platforms && (g.platforms || []).length ? platOut(g.platforms.map(shortPlat).join(', ')) : '', sr = tc.series && g.series ? g.series : '', mt = lineMeta(yr, pl, sr);
    lines.push((tc.done && g.done ? '✓ ' : '') + (tc.main && e.x ? '* ' : '') + g.name + (mt ? ' (' + mt + ')' : '') + (tc.time && g.time ? ' – ' + (LANG === 'en' ? String(g.time) : String(g.time).replace('.', ',')) + ' h' : ''));
  });
  return lines.join('\n').replace(/^\n/, '') + '\n';
}
function textHtml(items, total) {
  const ents = normEnt(items), tc = textCols(), anyX = ents.some(e => e.t === 'g' && e.x);
  let h = '<div class="tlist z' + colsFor('text') + ' ' + (S.set.textWrap === 'scroll' ? 'sc' : 'wr') + '">';
  ents.forEach(e => {
    if (e.t === 'h') { h += '<div class="gh l' + e.lvl + '">' + esc(e.text) + '<b>' + e.n + '</b></div>'; return; }
    const g = e.g, yr = tc.year && g.year ? g.year : '', pl = tc.platforms && (g.platforms || []).length ? platOut(g.platforms.map(shortPlat).join(', ')) : '', sr = tc.series && g.series ? g.series : '';
    const inP = yr || pl || sr ? '<span class="ti">&nbsp;(' + (yr ? '<span class="ty">' + yr + '</span>' : '') + (yr && (pl || sr) ? ' | ' : '') + (pl ? '<span class="tp">' + esc(pl) + '</span>' : '') + ((pl || yr) && sr ? ' | ' : '') + (sr ? '<span class="ts">' + esc(sr) + '</span>' : '') + ')</span>' : '';
    const mk = (S.selMode ? '<span class="tsel">' + (S.sel.has(g.id) ? '☑' : '☐') + '</span>' : '') + (tc.done ? '<span class="tk">' + (g.done ? '✓' : '') + '</span>' : '') + (tc.main && anyX ? '<span class="tm">' + (e.x ? '*' : '') + '</span>' : '');
    h += '<div class="tl' + (e.x ? ' extra' : '') + (g.done ? ' isdone' : '') + (S.sel.has(g.id) ? ' sel' : '') + (g.id === S.lastGame ? ' last' : '') + '" data-gid="' + g.id + '" data-act="openGame">'
      + (mk ? '<span class="mk">' + mk + '</span>' : '')
      + '<span class="tx"><span class="tn">' + esc(g.name) + '</span>' + inP + (tc.time && g.time ? '<span class="tt">&nbsp;– ' + (LANG === 'en' ? String(g.time) : String(g.time).replace('.', ',')) + ' h</span>' : '') + '</span></div>';
  });
  return h + '</div><div class="status">' + statusTxt(total || ents.filter(e => e.t === 'g').length) + '</div>';
}
const ICONS = {
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>', warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>', alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>', fact: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 14l2.2 2.2L15 12"/>',
  folderplus: '<path d="M3 7h6l2 2h10v10H3z"/><path d="M12 11v6M9 14h6"/>', folderminus: '<path d="M3 7h6l2 2h10v10H3z"/><path d="M9 14h6"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>', dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>', undo: '<path d="M9 7L4 12l5 5M4 12h10a6 6 0 0 1 0 12"/>', selall: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>', checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>', pad: '<path d="M7 9h10a4 4 0 0 1 4 4v2a2 2 0 0 1-3.4 1.4L16 15H8l-1.6 1.4A2 2 0 0 1 3 15v-2a4 4 0 0 1 4-4z"/><path d="M8 11v3M6.5 12.5h3"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>', grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  pin: '<path d="M9 4h6l-1 5 3 3v2H7v-2l3-3z"/><path d="M12 14v6"/>',
  zoom: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>', find: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>', sort: '<path d="M7 4v16M7 4L4 7M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3"/>',
  wrap: '<path d="M4 6h16M4 12h11a3 3 0 0 1 0 6h-3M12 18l2-2M12 18l2 2M4 18h4"/>', list: '<path d="M4 6h16M4 12h16M4 18h16"/>', mark: '<path d="M6 4h12v16l-6-4-6 4z"/>', dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="15" r="1"/><circle cx="12" cy="12" r="1"/>', text: '<path d="M5 7h14M5 12h14M5 17h9"/>', group: '<path d="M4 5h16M7 9h13M7 13h13M4 18h16"/>', cols: '<rect x="4" y="4" width="16" height="16"/><path d="M9.5 4v16M14.5 4v16"/>', sel: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>', coll: '<path d="M3 7h6l2 2h10v10H3z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/>', pad: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="11.5" r="1"/><circle cx="18.5" cy="14" r="1"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
  fran: '<path d="M5 21V4M5 5h12l-2.5 4 2.5 4H5"/>', plus: '<path d="M12 5v14M5 12h14"/>', aa: '<path d="M3 18l5-12 5 12M5 14h6"/><path d="M15 18l3-7 3 7M16 16h4"/>', chkbox: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.5l3 3 5-6"/>',
  tolib: '<path d="M4 6h16M4 12h16M4 18h9"/><path d="M16 15l4 3-4 3"/>',
};
const tb = (act, icon, label, on, hint, id) => '<button class="tb' + (on ? ' on' : '') + '"' + (id ? ' id="' + id + '"' : '') + ' data-act="' + act + '" title="' + esc(hint || label) + '" aria-label="' + esc(hint || label) + '"><svg viewBox="0 0 24 24">' + ICONS[icon] + '</svg><span>' + label + '</span></button>'; // кнопка-значок с мелкой подписью; подсказка по долгому нажатию
const btnLbl = (b, t) => { const sp = b.querySelector && b.querySelector('span'); if (sp) sp.textContent = t; else b.textContent = t; };
function serToolbar(fr) { // ряд кнопок проверки во вкладке «Серии» / «Франшизы»
  const A = fr ? S.frAll : S.serAll, V = fr ? S.frVer : S.serVer, p = fr ? 'fr' : 'ser', iss = fr ? S.frIssues : S.serIssues, only = fr ? S.set.frOnlyInc : S.set.serOnlyInc, gv = S.gv && S.gv.run;
  return '<div class="tbar">' + tb(p + 'CheckAll', A && A.run ? 'stop' : 'checkc', A && A.run ? 'Stop' : 'Completeness', !!(A && A.run), A && A.run ? 'Stop the completeness check' : fr ? 'Check franchise completeness in IGDB: which games are missing' : 'Check series completeness in IGDB: which games are missing', p + 'AllBtn')
    + tb(p + 'OnlyInc', 'warn', 'Incomplete', !!only, fr ? 'Show only incomplete franchises (by the completeness check)' : 'Show only incomplete series (by the completeness check)')
    + tb(p + 'VerifyAll', 'aa', V && V.run ? 'Stop' : 'Check', !!(V && V.run), V && V.run ? 'Stop checking' : fr ? 'Check franchises against IGDB: do they exist in IGDB, which games have a wrong one' : 'Check series against IGDB: do they exist in IGDB, which games have a wrong one', p + 'VerBtn')
    + (iss && iss.length ? tb(p + 'Issues', 'alert', 'Problems ' + iss.length, false, 'Open the list of found problems') : '')
    + tb('gvAll', gv ? 'stop' : 'fact', gv ? 'Stop' : 'Games', !!gv, gv ? 'Stop checking games' : 'Full check of all games: name, year, time to beat, series, franchise', 'gvBtn')
    + (S.gvIssues && S.gvIssues.length ? tb('gvIssues', 'alert', 'Games ' + S.gvIssues.length, false, 'Open the list of games with differences') : '')
    + '</div><div class="sub" id="' + p + 'Prog" style="margin:0 2px 4px">' + (fr ? frProgText() : serProgText()) + '</div>';
}
const icoSvg = n => '<svg class="icx" viewBox="0 0 24 24">' + ICONS[n] + '</svg>';
const ZOOM_RANGE = { text: [1, 4], list: [1, 3], grid: [2, 6], search: [2, 6], coll: [1, 4], series: [1, 4], collL: [1, 4], seriesL: [1, 4], searchL: [1, 4] };
const ZOOM_DEF = { text: [2, 2], list: [1, 1], grid: [3, 6], search: [3, 6], coll: [2, 4], series: [2, 4], collL: [2, 2], seriesL: [2, 2], searchL: [2, 2] };
const colsFor = k => S.set.zoom[k] || ZOOM_DEF[k][(window.innerWidth || 0) >= 620 ? 1 : 0];
const zoomBtn = k => ib('zoom', 'zoom', 'Zoom', false, '<span class="cnt bw">' + colsFor(k) + '</span>', ' data-k="' + k + '"');
const ib = (act, icon, label, on, extra, attrs) => '<button class="ib' + (on ? ' on' : '') + '" data-act="' + act + '"' + (attrs || '') + ' title="' + label + '" aria-label="' + label + '"><svg viewBox="0 0 24 24">' + ICONS[icon] + '</svg><span class="lbl">' + label + '</span>' + (extra || '') + '</button>';
function viewLibrary() {
  return '<div class="top"><div class="bar"><div class="sbox"><span>🔍</span><input id="q" placeholder="Search by title" value="' + esc(S.set.f.q) + '"><button class="x" data-act="clearQ">✕</button></div></div>'
    + '<div class="tools" id="libTools"></div><div class="chips actv" id="libActive"></div></div><div class="scrl" id="libBody"></div>';
}
function activeCount() { const f = S.set.f; return f.years.length + f.genres.length + f.platforms.length + f.series.length + f.props.length + (f.done ? 1 : 0) + (f.minRating ? 1 : 0) + f.collections.length + ((f.addedFrom || f.addedTo) ? 1 : 0) + (f.seriesMode ? 1 : 0) + (f.maxTime ? 1 : 0) + (f.franchise || []).length + (f.franchiseMode ? 1 : 0); }
const backupDue = () => { const d = S.set.backupDays == null ? 7 : S.set.backupDays; if (!d || S.games.length < 5) return false; const now = Date.now(); return now - (S.set.lastExport || 0) > d * 864e5 && now - (S.set.lastRemind || 0) > 864e5; };
const backupBanner = () => backupDue() ? '<div class="banner bk"><span>' + (S.set.lastExport ? 'No backup for ' + Math.floor((Date.now() - S.set.lastExport) / 864e5) + ' d.' : 'No backup yet') + '. Your data is stored only on this device.</span><div class="toolbar" style="margin:8px 0 0"><button class="btn acc" data-act="backupNow">Make a backup</button><button class="btn" data-act="backupLater">Remind me tomorrow</button></div></div>' : '';
function renderLibHead() {
  const f = S.set.f;
  $('#libTools').innerHTML = ib('openFilters', 'filter', 'Filters', activeCount() > 0, (activeCount() ? '<span class="cnt">' + activeCount() + '</span>' : '') + '<span class="fcnt" id="fcnt"></span>')
    + ib('toggleView', S.set.view === 'grid' ? 'list' : S.set.view === 'list' ? 'text' : 'grid', S.set.view === 'grid' ? 'List' : S.set.view === 'list' ? 'Text' : 'Grid', false)
    + (S.set.view === 'text' ? ib('toggleWrap', 'wrap', S.set.textWrap === 'scroll' ? 'Multi-line' : 'Single line with scrolling', S.set.textWrap === 'scroll') + zoomBtn('text') : zoomBtn(S.set.view === 'grid' ? 'grid' : 'list'))
    + (S.set.view === 'grid' ? '' : ib('openCols', 'cols', 'Columns', false))
    + ib('openGroup', 'group', 'Grouping', !!S.set.group) + ib('pickNext', 'dice', 'What to play', false)
  const chips = [];
  const lab = (k, v) => k === 'collections' ? (v === DONE_ID ? 'Completed' : v === NO_COLL ? 'No collections' : (collById(v) || {}).name || v) : k === 'props' ? ((S.props.find(p => p.id === v) || {}).name || v) : (k === 'series' && v === '' ? 'No series' : v);
  ['collections', 'years', 'genres', 'platforms', 'series', 'franchise', 'props'].forEach(k => (f[k] || []).forEach(v => chips.push('<button class="chip" data-act="rmF" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(lab(k, v)) + ' ✕</button>')));
  if (f.franchiseMode) chips.push('<button class="chip" data-act="setFranchiseMode" data-v="">★ + franchise games (' + (f.franchiseMode === 'below' ? 'below' : 'together') + ') ✕</button>');
  if (f.seriesMode) chips.push('<button class="chip" data-act="setSeriesMode" data-v="">★ + series games (' + (f.seriesMode === 'below' ? 'below' : 'together') + ') ✕</button>');
  if (S.set.group) chips.push('<button class="chip gray" data-act="groupOff">Grouping: ' + esc((GROUPS.find(x => x[0] === S.set.group) || [0, S.set.group])[1].replace('By ', '')) + ' ✕</button>');
  if (f.addedFrom || f.addedTo) chips.push('<button class="chip" data-act="clearAdded">Added: ' + (f.addedFrom ? 's ' + fmtDate(f.addedFrom) + ' ' : '') + (f.addedTo ? 'to ' + fmtDate(f.addedTo) : '') + ' ✕</button>');
  if (f.maxTime) chips.push('<button class="chip" data-act="clearMaxTime">Time up to ' + f.maxTime + ' h ✕</button>');
  if (f.minRating) chips.push('<button class="chip" data-act="setMinRating" data-v="0">Rating from ★ ' + f.minRating + ' ✕</button>');
  if (f.done) chips.push('<button class="chip" data-act="setDone" data-v="">' + (f.done === 'yes' ? 'Completed' : 'Not completed') + ' ✕</button>');
  if (f.q) chips.push('<button class="chip" data-act="clearQ">Search: ' + esc(f.q) + ' ✕</button>');
  if (chips.length) chips.push('<button class="chip gray" data-act="resetF">Reset ✕</button>');
  $('#libActive').innerHTML = backupBanner() + chips.join('');
}
const LIB_PAGE = 60; // сколько записей рисуется сразу; остальные добавляются при прокрутке
// отбор + сортировка + «игры серий» + группы: одна последовательность для плитки, списка и текста
function libBuild() {
  const f = S.set.f, main = sortGames(filterGames(S.games, f), f), ms = f.seriesMode || '', mf = f.franchiseMode || '', mode = ms === 'mixed' || mf === 'mixed' ? 'mixed' : ms || mf;
  const extra = mode ? sortGames(Array.from(new Set((ms ? withSeries(S.games, main) : []).concat(mf ? withFranchise(S.games, main) : []))), f) : [], xs = new Set(extra);
  const secs = mode === 'mixed' && extra.length ? [{ items: sortGames(main.concat(extra), f) }] : extra.length ? [{ title: 'Main list', items: main }, { title: mf ? '★ From series and franchises (not the main list)' : '★ From series (not in the main list)', items: extra }] : [{ items: main }];
  const r = buildEntries(secs, S.set.group || '', S.set.groupDir, g => xs.has(g));
  S.entries = r.entries; S.shown = r.games; S.nMain = main.length; S.nExtra = extra.length;
  return r;
}
const ghHtml = e => '<div class="gh l' + e.lvl + '">' + esc(e.text) + '<b>' + e.n + '</b></div>';
function libRows(a, b) {
  const part = S.entries.slice(a, b), v = S.set.view;
  return v === 'list' ? listHtml(part, S.nMain) : v === 'text' ? textHtml(part, S.nMain) : part.map(e => e.t === 'h' ? ghHtml(e) : cardHtml(e.g, e.x)).join('');
}
// жанры и платформы в списке лежат поверх ячейки и не влияют на высоту строки: число видимых строк считается по высоте строки,
// которая зависит только от масштаба и названия игры
function fitList() {
  const rows = Array.from(document.querySelectorAll('.wrap tbody tr[data-gid]')); if (!rows.length || typeof getComputedStyle !== 'function') return;
  const sp = rows[0].querySelector('.gpt span'); const lh = sp ? (parseFloat(getComputedStyle(sp).lineHeight) || 12) : 12;
  const n = rows.map(tr => Math.max(1, Math.floor((tr.clientHeight - 2) / lh)));
  rows.forEach((tr, i) => tr.style.setProperty('--gl', n[i]));
}
const fitSoon = () => { if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fitList); };
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('resize', fitSoon);
function libAppend() {
  const el = $('#libBody'), ents = S.entries; if (!el || !ents || S.libN >= ents.length) return false;
  const a = S.libN, n = Math.min(ents.length, a + LIB_PAGE), v = S.set.view; S.libN = n;
  if (v === 'list') { const tb = el.querySelector('tbody'); if (!tb) return false; const t = document.createElement('div'); t.innerHTML = libRows(a, n); t.querySelectorAll('tbody tr').forEach(r => tb.appendChild(r)); fitSoon(); }
  else if (v === 'text') { const box = el.querySelector('.tlist'); if (!box) return false; const t = document.createElement('div'); t.innerHTML = libRows(a, n); Array.from(t.querySelector('.tlist').children).forEach(r => box.appendChild(r)); }
  else { const gr = el.querySelector('.grid'); if (!gr) return false; gr.insertAdjacentHTML('beforeend', libRows(a, n)); }
  updLibCount(); return true;
}
// количество игр в отборе мелко в иконке фильтра
function updLibCount() { const el = $('#fcnt'); if (el) el.textContent = S.shown && S.shown.length ? S.shown.length : ''; }
// быстрый переход по буквам: полоса у правого края при сортировке по названию (без группировки, от 40 игр)
function jumpEntry(li) {
  const box = $('#libBody'); if (!box || li == null || !S.entries) return;
  let guard = 0; while (S.libN < li + 30 && S.libN < S.entries.length && guard++ < 200) if (!libAppend()) break;
  const e = S.entries[li], el = e && e.g ? $('#libBody [data-gid="' + e.g.id + '"]') : null; if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
}
function renderAlpha() {
  const old = $('#alpha'); if (old) old.remove();
  const f = S.set.f, box = $('#libBody'), v = $('#view');
  if (S.tab !== 'library' || !box || !v || f.sort !== 'name' || S.set.group || !S.entries || !S.shown || S.shown.length < 40) return;
  const idx = new Map(), order = [];
  S.entries.forEach((e, i) => { if (e.t !== 'g') return; const k = groupKey(e.g, 'name'); if (!idx.has(k)) { idx.set(k, i); order.push(k); } });
  if (order.length < 4) return;
  const el = document.createElement('div'); el.id = 'alpha'; const dense = order.length > 30;
  el.innerHTML = order.map((k, i) => '<span' + (dense && i % 2 ? ' class="dim"' : '') + '>' + esc(k) + '</span>').join('');
  const r = box.getBoundingClientRect ? box.getBoundingClientRect() : { top: 80, height: 500 };
  el.style.top = Math.round(r.top + 36) + 'px'; el.style.height = Math.max(140, Math.round(r.height - 190)) + 'px'; v.appendChild(el);
  let last = '';
  const bubble = k => { let b = $('#alphaBubble'); if (!b) { b = document.createElement('div'); b.id = 'alphaBubble'; v.appendChild(b); } b.textContent = k; b.classList.add('show'); };
  const scrub = e => { const rr = el.getBoundingClientRect(), k = order[Math.min(order.length - 1, Math.max(0, Math.floor((e.clientY - rr.top) / rr.height * order.length)))]; if (!k || k === last) return; last = k; bubble(k); jumpEntry(idx.get(k)); buzz(12); };
  const end = () => { el.classList.remove('on'); setTimeout(() => { const b = $('#alphaBubble'); if (b) b.classList.remove('show'); }, 500); };
  el.addEventListener('pointerdown', e => { try { el.setPointerCapture(e.pointerId); } catch (x) { /* без захвата */ } el.classList.add('on'); last = ''; scrub(e); e.preventDefault(); });
  el.addEventListener('pointermove', e => { if (el.classList.contains('on')) scrub(e); });
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('resize', () => { if (S.tab === 'library') renderAlpha(); });
function libScroll() { // дорисовываем, пока конец списка близко
  const el = $('#libBody'); if (!el || !el.clientHeight) return;
  let guard = 0; while (S.libN < S.entries.length && el.scrollTop + el.clientHeight > el.scrollHeight - 800 && guard++ < 20) if (!libAppend()) break;
}
function renderLibBody() {
  const r = libBuild(), list = r.games;
  const el = $('#libBody'); if (!el) return;
  const key = [S.set.view, S.set.group, S.set.groupDir, JSON.stringify(S.set.f)].join('|'); if (key !== S._libKey) { S._libKey = key; S.libN = 0; } // другой отбор или вид: снова с начала
  const li = S.lastGame ? r.entries.findIndex(e => e.t === 'g' && e.g.id === S.lastGame) : -1;
  S.libN = Math.min(r.entries.length, Math.max(S.libN || LIB_PAGE, li >= 0 ? li + 20 : 0));
  if (!S.games.length) el.innerHTML = '<div class="hint">The catalog is empty.<br>Tap “+” to add a game manually, or find games in the “Search” tab.</div>';
  else if (!list.length) el.innerHTML = '<div class="hint">Nothing found</div>';
  else { const body = libRows(0, S.libN); el.innerHTML = S.set.view === 'grid' ? '<div class="grid z' + colsFor('grid') + '" style="--cols:' + colsFor('grid') + '">' + body + '</div><div class="status">' + statusTxt(S.nMain) + '</div>' : body; el.onscroll = libRaf; setTimeout(libScroll, 0); if (S.set.view === 'list') fitSoon(); }
  updLibCount(); renderAlpha();
}
let libRafT = 0; const libRaf = () => { if (libRafT) return; libRafT = requestAnimationFrame(() => { libRafT = 0; libScroll(); }); };
/* кнопки «наверх» / «вниз» у списка каталога и «наверх» у результатов поиска */
function bindScrollBtns() {
  try {
    let box = $('#scBtns'); const cfg = S.tab === 'library' ? { sel: '#libBody', up: true, down: true } : S.tab === 'search' ? { sel: '#srBody', up: true, down: false } : null, el = cfg && $(cfg.sel);
    if (!el) { if (box && box.classList) box.classList.add('hidden'); return; }
    if (!box) { box = document.createElement('div'); box.id = 'scBtns'; box.className = 'scb hidden'; box.innerHTML = '<button data-act="scrollTop" aria-label="To the top" title="To the top">↑</button><button data-act="scrollBottom" aria-label="Down" title="Down">↓</button>'; document.body.appendChild(box); }
    const up = box.querySelector('[data-act="scrollTop"]'), dn = box.querySelector('[data-act="scrollBottom"]');
    const upd = () => { const y = el.scrollTop || 0, max = (el.scrollHeight || 0) - (el.clientHeight || 0); up.classList.toggle('hidden', !cfg.up || y < 240); dn.classList.toggle('hidden', !cfg.down || max - y < 240); box.classList.toggle('hidden', up.classList.contains('hidden') && dn.classList.contains('hidden')); };
    el.onscroll = upd; upd();
  } catch (e) { /* кнопки прокрутки не обязательны */ }
}
function renderLibrary() { renderLibHead(); renderLibBody(); renderSelBar(); setTimeout(bindScrollBtns, 60); }
function libRefilter() { renderLibrary(); const b = $('#libBody'); if (b) b.scrollTop = 0; } // после смены отбора список с начала
function renderSelBar() {
  if (S.tab === 'library') $('#fab').classList.toggle('hidden', S.selMode); // после массового действия кнопка «+» возвращается
  const b = $('#selbar'), inb = S.tab === 'inbox' && S.inSelMode && !!S.inboxList, lib = S.selMode && S.tab === 'library';
  b.classList.toggle('hidden', !(lib || inb));
  if (inb) { b.innerHTML = '<b class="selcnt">' + S.inSel.size + '</b>' + ib('inAct', 'folderplus', 'Collections', false, '', ' data-m="colls"') + ib('inAct', 'checkc', 'Completed', false, '', ' data-m="done"') + ib('inAct', 'undo', 'Same as the list', false, '', ' data-m="reset"') + ib('inAct', 'selall', 'Select all', false, '', ' data-m="all"') + ib('inAct', 'close', 'Cancel', false, '', ' data-m="x"'); return; }
  if (!lib) return;
  b.innerHTML = '<b class="selcnt">' + S.sel.size + '</b>' + ib('selAct', 'folderplus', 'To collection', false, '', ' data-m="add"') + ib('selAct', 'folderminus', 'Remove from collection', false, '', ' data-m="remove"') + ib('selAct', 'trash', 'Delete', false, '', ' data-m="delete"') + ib('selAct', 'dots', 'More: completed, series, genre, platform, IGDB time, export, move', false, '', ' data-m="more"') + ib('selToggle', 'close', 'Clear selection', false, '');
}
function rerenderInbox() { const v = $('#view'), sc = v ? v.scrollTop : 0; render(); if (v) v.scrollTop = sc; }
function toggleInSel(id, on) {
  const it = S.inbox.items.find(i => i.id === id); if (!it || it.done) return;
  S.inSelMode = true; if (on === true || !S.inSel.has(id)) S.inSel.add(id); else S.inSel.delete(id);
  rerenderInbox();
}
function toggleSel(id, on) {
  const was = S.selMode; S.selMode = true;
  if (on === true || !S.sel.has(id)) S.sel.add(id); else S.sel.delete(id);
  const el = was ? $('#libBody [data-gid="' + id + '"]') : null; // уже в режиме выбора: меняем только одну строку
  if (!el) return renderLibrary();
  const on2 = S.sel.has(id); el.classList.toggle('sel', on2);
  if (el.tagName === 'TR') { const c0 = el.firstElementChild; if (c0) c0.textContent = on2 ? '☑' : '☐'; } else { const k = el.querySelector('.chk, .tsel'); if (k) k.textContent = k.classList.contains('tsel') ? (on2 ? '☑' : '☐') : (on2 ? '✓' : ''); }
  renderSelBar();
}
async function selectionAction(m) {
  const ids = Array.from(S.sel); if (!ids.length) return toast('Select games (long-press a card)');
  if (m === 'more') return bulkMore(ids);
  if (m === 'delete') {
    if (!await confirmBox('Delete games: ' + ids.length + '?', 'Delete')) return;
    for (const id of ids) await removeGame(id);
    toast('Games deleted: ' + ids.length, 'Undo', () => restoreGames(ids));
  } else {
    const f = S.set.f; const src = f.collections.length === 1 ? f.collections[0] : null;
    if (m === 'move' && (!src || src === DONE_ID)) return toast('To move, pick exactly ONE of your source collections at the top');
    const pick = await pickCollections(m === 'remove' ? 'Remove from collection' : m === 'move' ? 'Move to collection' : 'Add to collection', [], m !== 'remove');
    if (!pick || !pick.length) return;
    const snap = takeSnap(), chg = [];
    for (const id of ids) {
      const g = gameById(id); if (!g) continue;
      if (m === 'remove') g.collections = g.collections.filter(c => !pick.includes(c));
      else { if (m === 'move') g.collections = g.collections.filter(c => c !== src); pick.forEach(c => { if (!g.collections.includes(c)) g.collections.push(c); }); }
      chg.push(g);
    }
    await saveGames(chg);
    toastUndo('Done: ' + ids.length, snap);
  }
  S.sel.clear(); S.selMode = false; renderLibrary();
}
async function bulkMore(ids) {
  const games = ids.map(gameById).filter(Boolean);
  const m = await askChoose({ title: 'Games selected: ' + games.length, items: [
    { id: 'done', label: 'Mark as completed' }, { id: 'undone', label: 'Clear the “Completed” mark' },
    { id: 'series', label: 'Set series…' }, { id: 'noseries', label: 'Remove series' },
    { id: 'merge', label: 'Merge cards…', sub: 'compare the selected games and merge them into one' }, { id: 'move', label: 'Move to another collection', sub: 'removes from the collection selected at the top and adds to the new one' }, { id: 'genre', label: 'Add genre…' }, { id: 'plat', label: 'Add platform…' },
    { id: 'igdbtime', label: 'Update only the IGDB time', sub: 'title, genres and cover stay unchanged' }, { id: 'export', label: 'Export selected…' }, { id: 'igdb', label: 'Update from ' + PROV[S.set.mainSrc].name }] });
  if (!m) return;
  if (m === 'igdb') return bulkRefresh(games);
  if (m === 'igdbtime') return bulkTime(games);
  if (m === 'move') return selectionAction('move');
  if (m === 'merge') { if (games.length < 2) return toast('Select two cards or more'); S.selMode = false; S.sel.clear(); renderLibrary(); return openMergeCompare(games.map(g => g.id), true); }
  if (m === 'export') return openExport(games, 'Selected games');
  let n = 0; const snap = takeSnap();
  if (m === 'done') { for (const g of games) if (!g.done) { g.done = true; g.doneDate = g.doneDate || todayStr(); await saveGame(g); n++; } }
  else if (m === 'undone') { for (const g of games) if (g.done) { g.done = false; g.doneDate = ''; await saveGame(g); n++; } }
  else if (m === 'series') { const v = await askPrompt('Series name'); if (!v) return; const name = canonSeries(v); for (const g of games) { g.series = name; n++; } await saveGames(games); }
  else if (m === 'franchise') { const v = await askPrompt('Franchise name'); if (!v) return; const name = canonFranchise(v); for (const g of games) { g.franchise = name; n++; } await saveGames(games); }
  else if (m === 'nofranchise') { for (const g of games) if (g.franchise) { g.franchise = ''; await saveGame(g); n++; } }
  else if (m === 'noseries') { for (const g of games) if (g.series) { g.series = ''; await saveGame(g); n++; } }
  else {
    const key = m === 'genre' ? 'genres' : 'platforms', v = await askPrompt(m === 'genre' ? 'Genre' : 'Platform'); if (!v) return;
    const cv = key === 'genres' ? canonGenre(v, true) : canonPlat(v, true);
    for (const g of games) if (!g[key].includes(cv)) { g[key].push(cv); await saveGame(g); n++; }
  }
  toastMaybeUndo('Games changed: ' + n, snap, n); S.sel.clear(); S.selMode = false; renderLibrary();
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

/* ====================== Отмена массовых операций ====================== */
// Перед массовой правкой запоминаем игры, коллекции, разбор и общие списки; после неё тост «Отменить» (и пункт в настройках) возвращает всё как было.
// Удалённые при слиянии карточки возвращаются из корзины вместе с обложкой и скриншотами; заменённые картинки не восстанавливаются.
const UNDO = { snap: null, label: '' };
function takeSnap() {
  const f = S.set.f || {};
  return {
    games: new Map(S.games.map(g => [g.id, JSON.stringify(g)])), colls: S.collections.map(c => JSON.stringify(c)),
    items: new Map(S.inbox.items.map(i => [i.id, JSON.stringify(i)])), lists: new Map(S.inbox.lists.map(l => [l.id, JSON.stringify(l)])),
    dicts: JSON.stringify({ platDict: S.set.platDict, genreDict: S.set.genreDict }), fsub: JSON.stringify({ series: f.series, collections: f.collections, platforms: f.platforms, genres: f.genres })
  };
}
function toastUndo(msg, snap, label) { UNDO.snap = snap; UNDO.label = label || msg; toast(msg, 'Undo', () => undoLast()); }
const toastMaybeUndo = (msg, snap, changed) => changed ? toastUndo(msg, snap) : toast(msg);
async function undoLast() {
  const u = UNDO.snap; if (!u) return toast('Nothing to undo'); UNDO.snap = null; const label = UNDO.label;
  try {
    const gone = Array.from(u.games.keys()).filter(id => !gameById(id)), inTrash = gone.filter(id => S.trash.some(x => x.id === id));
    if (inTrash.length) await restoreGames(inTrash);
    for (const id of gone) if (!inTrash.includes(id)) { const o = JSON.parse(u.games.get(id)); S.games.push(o); await DB.put('games', o); }
    const back = [];
    for (const [id, js] of u.games) { const g = gameById(id); if (!g || inTrash.includes(id) || JSON.stringify(g) === js) continue; Object.keys(g).forEach(k => { delete g[k]; }); Object.assign(g, JSON.parse(js)); back.push(g); }
    if (back.length) await saveGames(back);
    const cn = S.collections.map(c => JSON.stringify(c));
    if (cn.length !== u.colls.length || cn.some((x, i) => x !== u.colls[i])) {
      const old = u.colls.map(js => JSON.parse(js)), keep = new Set(old.map(c => c.id));
      for (const c of S.collections) if (!keep.has(c.id)) await DB.del('collections', c.id);
      for (const c of old) await DB.put('collections', c);
      S.collections = old;
    }
    for (const [store, arr, snapMap] of [['inboxItems', S.inbox.items, u.items], ['inboxLists', S.inbox.lists, u.lists]]) {
      for (const [id, js] of snapMap) { const o = arr.find(x => x.id === id); if (o && JSON.stringify(o) !== js) { Object.keys(o).forEach(k => { delete o[k]; }); Object.assign(o, JSON.parse(js)); await DB.put(store, o); } }
    }
    const d = JSON.parse(u.dicts); if ('platDict' in d) S.set.platDict = d.platDict; if ('genreDict' in d) S.set.genreDict = d.genreDict;
    const fs = JSON.parse(u.fsub); Object.keys(fs).forEach(k => { if (fs[k] !== undefined) S.set.f[k] = fs[k]; });
    S._pi = S._gi = null; saveSet(); render(); toast('Undone: ' + label);
  } catch (e) { logErr('undo operation', e); toast(e.message || 'Could not undo'); }
}
const undoSecHtml = () => UNDO.snap ? '<div class="sec"><h3 style="margin-top:0">Undo bulk operation</h3><div class="row"><span>' + esc(UNDO.label) + '</span><button class="btn" data-act="undoLast">Undo</button></div><p class="sub">Games, collections and shared lists return to how they were before the operation. Covers and screenshots are not restored if the operation replaced them.</p></div>' : '';
const errText = () => ERRLOG.list.map(x => new Date(x.t).toISOString() + ' [' + x.w + ']' + (x.n > 1 ? ' x' + x.n : '') + ' ' + x.m + (x.s ? ' | ' + x.s : '')).join('\n');
function errSecHtml() {
  const n = ERRLOG.list.length, last = ERRLOG.list[n - 1];
  return '<div class="sec"><h3 style="margin-top:0">Error log</h3><p class="sub">' + (n ? 'Entries: ' + n + '. Last: ' + esc(last.w) + ', ' + new Date(last.t).toLocaleString(LOC_DATE) : 'No errors') + '</p>'
    + (n ? '<div class="toolbar"><button class="btn" data-act="errView">Show</button><button class="btn" data-act="errCopy">Copy</button><button class="btn red" data-act="errClear">Empty</button></div>' : '') + '</div>';
}

/* ====================== Фильтры каталога ====================== */
function valueCounts(fn) { const m = new Map(); S.games.forEach(g => [].concat(fn(g)).filter(hasVal).forEach(v => m.set(v, (m.get(v) || 0) + 1))); return m; }
function collPickHtml() {
  const f = S.set.f;
  const chip = (id, name, n, col, extra) => '<button class="p' + extra + (f.collections.includes(id) ? ' on' : '') + '"' + (okColor(col) ? ' style="border-color:' + okColor(col) + '"' : '') + ' data-act="collChip" data-id="' + id + '">' + esc(name) + '<b>' + n + '</b></button>';
  const mode = (v, t) => '<button class="p' + (f.collMode === v ? ' on' : '') + '" data-act="collMode" data-v="' + v + '">' + t + '</button>';
  return (S.collections.length > 8 ? '<label class="field"><input id="cpq" placeholder="Search collections" autocomplete="off"></label>' : '')
    + '<div class="chips" id="collList">' + chip(DONE_ID, '✓ Completed', S.games.filter(g => g.done).length, '', ' done') + chip(NO_COLL, '∅ No collections', gamesIn(NO_COLL).length, '', '') + sortedColls().map(c => chip(c.id, c.name, gamesIn(c.id).length, c.color, '')).join('') + '</div>'
    + '<div class="sub">If several are selected:</div><div class="chips">' + mode('or', 'any of them (OR)') + mode('and', 'all at once (AND)') + '</div>';
}
function openCollSheet() {
  sheetKey = 'colls'; openSheet('<div class="hdr2"><h2>Collections</h2><button class="btn" data-act="collClear">Clear selection</button></div>' + collPickHtml() + '<button class="btn acc" style="width:100%;margin-top:10px" data-act="closeSheet">Done</button>');
}
const dayStr = n => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const PRESETS = [
  { id: 'p_month', name: 'Added this month', make: f => { f.addedFrom = dayStr(-30); } },
  { id: 'p_undone', name: 'Not completed', make: f => { f.done = 'no'; } },
  { id: 'p_short', name: 'Not completed, up to 10 hours', make: f => { f.done = 'no'; f.maxTime = 10; } }
];
function applyFilterSet(snap) { // подставляет набор фильтров целиком, сортировка остаётся прежней, если в наборе её нет
  const f = S.set.f, base = JSON.parse(JSON.stringify(DEFAULTS.f)); base.sort = f.sort; base.dir = f.dir;
  Object.keys(snap || {}).forEach(k => { if (k in base || k === 'sort' || k === 'dir') base[k] = snap[k]; });
  S.set.f = base; saveSet(); libRefilter(); if (sheetEl) closeSheet(); const b = $('#libBody'); if (b) b.scrollTop = 0;
}
const nextPool = entries => entries.filter(e => e.t === 'g' && !e.x && !e.g.done).map(e => e.g); // из текущего списка: не пройденные и не из «игр серий»
// «Что играть»: случайная игра из текущего списка. Свайп влево: следующий вариант, вправо: предыдущий; вверху счётчик «N из M»
function showNext(dir) {
  const pool = nextPool(S.entries || []); if (!pool.length) return toast('There are no uncompleted games in the current list: change the filters');
  const nx = S.nx || (S.nx = { hist: [], i: -1 });
  if (dir === -1) { if (nx.i <= 0) return; nx.i--; }
  else if (dir === 1 && nx.i + 1 < nx.hist.length) nx.i++;
  else {
    let rest = pool.filter(x => !nx.hist.includes(x.id));
    if (!rest.length) { nx.hist = []; nx.i = -1; rest = pool; toast('All options viewed, starting over'); }
    nx.hist.push(rest[Math.floor(Math.random() * rest.length)].id); nx.i = nx.hist.length - 1;
  }
  const g = gameById(nx.hist[nx.i]);
  if (!g) { nx.hist.splice(nx.i, 1); nx.i = nx.hist.length - 1; return showNext(1); } // игру успели удалить
  const src = coverSrc(g), fresh = !(S.nxOpen && modalEl && modalEl.querySelector('.nxt')), m = fresh ? openModal() : modalEl.querySelector('.modal');
  S.nxOpen = true; modalCancel = () => { S.nxOpen = false; closeModal(); }; m.style.touchAction = 'pan-y';
  const inner = '<div class="nxc' + (src ? '' : ' nocover') + '" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '></div><div class="nxi"><div class="nxn">' + esc(g.name) + '</div><div class="sub">' + esc([g.year || '', (g.platforms || []).slice(0, 3).map(shortPlat).join(', '), g.time ? g.time + ' h' : ''].filter(Boolean).join(' · ')) + '</div>' + (g.series ? '<div class="sub">Series: ' + esc(g.series) + '</div>' : '') + (g.genres && g.genres.length ? '<div class="sub">' + esc(g.genres.slice(0, 3).join(', ')) + '</div>' : '') + '</div>';
  if (fresh) { // рамка окна (заголовок, подсказка, кнопки) создаётся один раз; при смене игры меняется только середина с картинкой и описанием
    m.innerHTML = '<h4>What to play next<span class="nxcnt" id="nxCnt"></span></h4><div class="nxt"></div>'
      + '<p class="sub" style="margin:10px 0 0">Swipe left: another game, right: the previous one. Only uncompleted games from the current list are used (not series games).</p><div class="nxbar"><button class="nxb" data-x="close" title="Close" aria-label="Close">✕</button><button class="nxb" id="nxPrev" data-x="prev" title="Back" aria-label="Back">‹</button><button class="nxb" data-x="again" title="Another one" aria-label="Another one">›</button><button class="nxb acc" data-x="open" title="Open" aria-label="Open">↗</button></div>';
    m.onclick = e => { const x = e.target.closest('[data-x]'); if (!x) return; const a = x.dataset.x; if (a === 'again') return nxGo(1); if (a === 'prev') return nxGo(-1); const cur = S.nx && gameById(S.nx.hist[S.nx.i]); S.nxOpen = false; closeModal(); if (a === 'open' && cur) openGameSheet(cur.id); };
    const st = { x: 0, y: 0, on: false, lock: false, box: null };
    const back = () => { const b = m.querySelector('.nxt'); if (!b) return; b.style.transition = 'transform .15s ease-out, opacity .15s'; b.style.transform = ''; b.style.opacity = ''; setTimeout(() => { b.style.transition = ''; }, 180); };
    m.onpointerdown = e => { if (e.target.closest('button')) return; st.on = true; st.lock = false; st.x = e.clientX; st.y = e.clientY; st.box = m.querySelector('.nxt'); };
    m.onpointermove = e => { if (!st.on || !st.box) return; const dx = e.clientX - st.x, dy = e.clientY - st.y;
      if (!st.lock && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.5) { st.lock = true; try { m.setPointerCapture(e.pointerId); } catch (er) { /* не страшно */ } }
      if (st.lock && animOn()) { const k = dx > 0 && S.nx && S.nx.i <= 0 ? 0.3 : 1; st.box.style.transition = 'none'; st.box.style.transform = 'translateX(' + Math.round(dx * k) + 'px)'; st.box.style.opacity = String(Math.max(0.3, 1 - Math.abs(dx * k) / 300)); } };
    const end = e => { if (!st.on) return; st.on = false; const dx = e.clientX - st.x, dy = e.clientY - st.y, dir = dx < 0 ? 1 : -1;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && !(dir < 0 && S.nx && S.nx.i <= 0)) { // старая середина уезжает, новая приезжает с той же стороны, рамка остаётся на месте
        const b = st.box; if (b && animOn()) { b.style.transition = 'transform .09s ease-in, opacity .09s'; b.style.transform = 'translateX(' + (dir > 0 ? '-' : '') + '60px)'; b.style.opacity = '0'; setTimeout(() => { b.style.transition = ''; b.style.transform = ''; b.style.opacity = ''; nxGo(dir); }, 90); } else nxGo(dir);
      } else back(); };
    m.onpointerup = end; m.onpointercancel = () => { st.on = false; back(); };
  }
  const box = m.querySelector('.nxt'); box.innerHTML = inner; box.classList.remove('inl', 'inr');
  if (dir && animOn()) { void box.offsetWidth; box.classList.add(dir < 0 ? 'inr' : 'inl'); }
  const cnt = m.querySelector('#nxCnt'); if (cnt) cnt.textContent = (nx.i + 1) + ' of ' + pool.length;
  const pv = m.querySelector('#nxPrev'); if (pv) pv.disabled = !(nx.i > 0);
}
const nxGo = dir => showNext(dir);
function franchiseModeSect() {
  const m = S.set.f.franchiseMode || '';
  return '<h3>★ Franchise games</h3><p class="sub" style="margin:0 0 8px;line-height:1.35">Add to the selected games all games of their franchises: any series, years, platforms and collections. Such games are marked ★ and shown paler; they are not part of the main list.</p><div class="chips">' + [['', 'Off'], ['below', 'Below the main list'], ['mixed', 'Together with the main list']].map(x => '<button class="p' + (m === x[0] ? ' on' : '') + '" data-act="setFranchiseMode" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
}
function seriesModeSect() {
  const m = S.set.f.seriesMode || '';
  return '<h3>★ Series games</h3><p class="sub" style="margin:0 0 8px;line-height:1.35">Add all games from the series of the selected games: any year, platform and collection. Such games are marked ★ and shown paler; they are not part of the main list.</p><div class="chips">' + [['', 'Off'], ['below', 'Below the main list'], ['mixed', 'Together with the main list']].map(x => '<button class="p' + (m === x[0] ? ' on' : '') + '" data-act="setSeriesMode" data-v="' + x[0] + '">' + (m === x[0] ? '✓ ' : '') + x[1] + '</button>').join('') + '</div>';
}
function openFilters() {
  const f = S.set.f;
  const sect = (title, k, m, sortFn) => {
    const keys = Array.from(m.keys()).sort(sortFn || ((a, b) => String(a).localeCompare(String(b), LOC)));
    return keys.length ? '<h3>' + title + '</h3><div class="chips">' + keys.map(v => '<button class="p' + (f[k].map(String).includes(String(v)) ? ' on' : '') + '" data-act="fToggle" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(v) + '<b>' + m.get(v) + '</b></button>').join('') + '</div>' : '';
  };
  const propBtns = S.props.map(p => '<button class="p' + (f.props.includes(p.id) ? ' on' : '') + '" data-act="fToggle" data-k="props" data-v="' + p.id + '">' + esc(p.name) + '</button>').join('');
  sheetKey = 'filters'; openSheet('<div class="hdr2"><h2>Filters</h2></div>'
    + '<h3>Sorting</h3><div class="two"><label class="field"><select id="fsort">' + SORTS.concat(S.props.map(p => ['prop:' + p.id, p.name])).map(s => '<option value="' + esc(s[0]) + '"' + (f.sort === s[0] ? ' selected' : '') + '>' + esc(s[1]) + '</option>').join('') + '</select></label>'
    + '<label class="field"><select id="fdir"><option value="asc"' + (f.dir === 'asc' ? ' selected' : '') + '>ascending</option><option value="desc"' + (f.dir === 'desc' ? ' selected' : '') + '>descending</option></select></label></div>'
    + '<div class="toolbar" style="margin:0 0 6px"><button class="btn" data-act="openSaved">★ Filter presets…</button></div>' + seriesModeSect() + franchiseModeSect() + '<h3>Collections</h3>' + collPickHtml()
    + '<h3>Rating from</h3><div class="chips">' + [0, 5, 6, 7, 8, 9].map(v => '<button class="p' + ((f.minRating || 0) === v ? ' on' : '') + '" data-act="setMinRating" data-v="' + v + '">' + (v ? '★ ' + v + '+' : 'All') + '</button>').join('') + '</div>'
    + '<h3>Completion</h3><div class="chips">' + [['', 'All'], ['yes', '✓ Completed'], ['no', 'Not completed']].map(x => '<button class="p' + (f.done === x[0] ? ' on' : '') + '" data-act="setDone" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>'
    + sect('Year', 'years', valueCounts(g => g.year || null), (a, b) => b - a) + sect('Genre', 'genres', valueCounts(g => g.genres)) + sect('Platform', 'platforms', valueCounts(g => g.platforms))
    + sect('Series', 'series', valueCounts(g => g.series)) + sect('Franchise', 'franchise', valueCounts(g => g.franchise))
    + '<h3>Playtime up to, h</h3><label class="field"><input id="fmaxT" type="text" inputmode="decimal" autocomplete="off" placeholder="for example 10" value="' + (f.maxTime || '') + '"></label>'
    + '<h3>Date added</h3><div class="two"><label class="field"><span>From</span><input id="faFrom" type="date" value="' + esc(f.addedFrom || '') + '"></label><label class="field"><span>By</span><input id="faTo" type="date" value="' + esc(f.addedTo || '') + '"></label></div>'
    + (propBtns ? '<h3>Other properties (filled in)</h3><div class="chips">' + propBtns + '</div>' : '')
    + '<p class="hint" style="padding:6px">Values of one kind mean “any of”, different kinds mean “and”.</p><div class="sbar"><button class="btn acc" data-act="closeSheet">Apply</button><button class="btn" data-act="resetF">Reset</button></div>');
  $('#fsort').onchange = e => { f.sort = e.target.value; saveSet(); renderLibrary(); };
  $('#fdir').onchange = e => { f.dir = e.target.value; saveSet(); renderLibrary(); };
  $('#fmaxT').oninput = e => { let v = e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, ''); const i = v.indexOf('.'); if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, ''); v = v.slice(0, 6); if (v !== e.target.value) e.target.value = v; f.maxTime = parseFloat(v) || 0; saveSet(); renderLibrary(); };
  $('#faFrom').onchange = e => { f.addedFrom = e.target.value; saveSet(); renderLibrary(); };
  $('#faTo').onchange = e => { f.addedTo = e.target.value; saveSet(); renderLibrary(); };
}
const TCOLS = [['year', 'Release year'], ['platforms', 'Platforms'], ['series', 'Series'], ['time', 'Playtime'], ['done', '✓ completed mark'], ['main', '* mark (not from the main list)']];
const textCols = () => Object.assign({ year: 1, platforms: 1, series: 1, time: 1, done: 1, main: 1 }, S.set.tcols);
function openCols() {
  if (S.set.view === 'text') { const tc = textCols(); sheetKey = 'cols'; return openSheet('<h2 style="margin:0 0 6px">Text view: what to show</h2><p class="sub" style="margin:0 0 10px">The title is always shown.</p><div class="chips">' + TCOLS.map(x => '<button class="p' + (tc[x[0]] ? ' on' : '') + '" data-act="tcolToggle" data-k="' + x[0] + '">' + (tc[x[0]] ? '✓ ' : '') + x[1] + '</button>').join('') + '</div><h3>Export</h3><div class="chips"><button class="p" data-act="expLib">Export the current list…</button></div><button class="btn acc" style="width:100%;margin-top:10px" data-act="closeSheet">Done</button>'); }
  const c = S.set.cols, pc = S.set.propCols || {};
  sheetKey = 'cols'; openSheet('<h2 style="margin:0 0 10px">Columns</h2><div class="chips">' + COLS.map(x => '<button class="p' + (c[x[0]] ? ' on' : '') + '" data-act="colToggle" data-k="' + x[0] + '">' + (c[x[0]] ? '✓ ' : '') + x[1] + '</button>').join('') + '</div>'
    + (S.props.length ? '<h3>Properties (not collections)</h3><div class="chips">' + S.props.map(p => '<button class="p' + (pc[p.id] !== 0 ? ' on' : '') + '" data-act="colProp" data-id="' + p.id + '">' + (pc[p.id] !== 0 ? '✓ ' : '') + esc(p.name) + '</button>').join('') + '</div>' : '')
    + '<h3>Pinning</h3><div class="chips"><button class="p' + (S.set.pin ? ' on' : '') + '" data-act="togglePin">' + (S.set.pin ? '✓ ' : '') + 'Pin the title on the left</button></div><h3>Export</h3><div class="chips"><button class="p" data-act="expLib">Export the current list…</button></div>'
    + '<button class="btn acc" style="width:100%;margin-top:10px" data-act="closeSheet">Done</button>');
}

/* ====================== Карточка игры (правка) ====================== */
const ICO = {
  fran: '<path d="M5 21V4M5 5h12l-2.5 4 2.5 4H5"/>',
  find: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
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
const I = (n, c) => '<svg class="ic ic-' + n + (c ? ' ' + c : '') + '" viewBox="0 0 24 24" fill="' + (n === 'star' ? '#f5a524' : 'none') + '" stroke="' + (n === 'star' ? '#f5a524' : 'currentColor') + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + ICO[n] + '</svg>';
// верх карточки: источники (цветные рамки со ссылками)
function drawShName() { const el = $('#shName'), v = (($('#f_name') || {}).value || '').trim(); if (el) { el.textContent = v || 'Title: tap to enter'; if (el.classList) el.classList.toggle('ph', !v); } }
function drawShLine() { const el = $('#shLine'); if (!el) return; const t = S.sheet && S.sheet.draft.srcLine; el.textContent = t || ''; el.style.display = t ? '' : 'none'; }
function drawShDone() {
  const d = S.sheet && S.sheet.draft; if (!d) return; const c = $('#shDone2'), dt = ($('#f_donedate') || {}).value || '';
  if (c && c.classList) c.classList.toggle('on', !!d.done);
  const l = $('#doneL'); if (l) l.innerHTML = I(d.done ? 'checkc' : 'circle') + ' <span>Completed</span>';
  const t = $('#doneTxt'); if (t) t.textContent = d.done && dt ? new Date(dt + 'T00:00:00').toLocaleDateString(LOC_DATE, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  drawShSeries();
}
function drawShHead() {
  const el = $('#shSrc'); if (!el || !S.sheet) return; const d = S.sheet.draft, srcs = srcsOf(d);
  el.innerHTML = srcs.length ? srcs.map(k => srcBadge(k, d[k + 'Url'])).join('') : '<span class="srcb" style="color:var(--mut);border-color:var(--bd2)">Manual</span>';
}
// строка с годом, рейтингом, временем и серией: правятся по нажатию
function drawShInfo() {
  const el = $('#shInfo'); if (!el) return; const v = k => (($('#f_' + k) || {}).value || '').trim();
  const chip = (ic, txt, k, act) => '<button class="ichip" data-act="' + (act || 'shEdit') + '"' + (k ? ' data-k="' + k + '"' : '') + '>' + I(ic) + ' ' + txt + '</button>';
  el.innerHTML = chip('cal', v('year') || '—', 'year') + chip('star', v('rating') ? esc(v('rating')) + '/10' : '—', 'rating') + chip('clock', v('time') ? esc(v('time')) + ' h' : '— h', 'time') + '<span class="brk"></span>' + chip('book', v('series') ? esc(v('series')) : 'Series', '', v('series') ? 'serCard' : 'pickSeries') + chip('fran', v('franchise') ? esc(v('franchise')) : 'Franchise', '', v('franchise') ? 'frCard' : 'pickFranchise');
  drawShSeries();
}
// «Серия: 3 из 7 · завершено 2» с переходами к предыдущей и следующей игре серии (порядок: год, дата добавления, название)
function serRowHtml(d, nm) { // строка серии в карточке игры: число игр, процент завершения, проверена ли серия (вручную или автоматически), итог проверки IGDB в рамке; снизу полоса с делениями по числу игр
  nm = String(nm || '').trim(); if (!nm) return '';
  const key = serKey(nm), list = S.games.filter(g => g.id !== d.id && g.series && serKey(g.series) === key); list.push(d);
  const done = list.filter(g => g.done).length, pc = Math.round(done * 100 / list.length), ok = !!serMap('serOk')[key], c = serMap('serChk')[key], has = !!(c && !c.none), miss = has ? Math.max(0, c.total - c.have) : 0, auto = has && !miss;
  const chk = ok || auto ? '<i class="okk" title="' + (ok ? 'Marked manually' : 'Checked automatically against IGDB') + '">✓ checked</i>' : '<i class="nock">not checked</i>';
  const a = ' data-act="serCheck" data-name="' + esc(nm) + '"', ig = !has ? '' : miss > 0 ? '<button class="serbd warn"' + a + ' title="Games missing in IGDB: ' + miss + '">⚠ ' + miss + '</button>' : '<button class="serbd good"' + a + ' title="Every IGDB game is here">✓ IGDB</button>';
  return '<div class="spmid" data-act="serCard" data-name="' + esc(nm) + '"><div class="sprow"><b>' + gWord(list.length) + '</b><span>completed <b>' + pc + '%</b></span>' + chk + ig + '</div><div class="spbar' + tkCls(list.length) + '" style="' + tkSty(list.length) + '"><i style="width:' + pc + '%"></i></div></div>';
}
function drawShSeries() {
  const el = $('#shSerie'); if (!el || !S.sheet) return; const d = S.sheet.draft;
  el.innerHTML = serRowHtml(d, (($('#f_series') || {}).value) || d.series || '');
  const e2 = $('#shFran'); if (e2) e2.innerHTML = frRowHtml(d, (($('#f_franchise') || {}).value) || d.franchise || '');
}
function markLast(id) { // едва заметная подсветка открытой игры в списке, плитке и тексте сразу, без перерисовки
  $$('#libBody .last').forEach(e => e.classList.remove('last'));
  const el = $('#libBody [data-gid="' + id + '"]'); if (el) el.classList.add('last');
}
function openGameSheet(id, dir) {
  closeSheet(true, !!(dir && sheetEl)); // при смене соседней игры рамка карточки остаётся, меняется только содержимое
  if (dir && sheetEl) { sheetKey = 'game'; sheetEl._key = 'game'; }
  const isNew = !id; if (id) { S.lastGame = id; markLast(id); }
  const g = isNew ? { id: uid(), igdbId: 0, rawgId: 0, name: '', year: 0, rating: 0, time: 0, genres: [], platforms: [], series: '', coverUrl: '', hasCover: false, collections: [], props: {}, done: false, doneDate: '', shotCount: 0, added: Date.now() } : gameById(id);
  if (!g) return;
  S.sheet = { isNew, draft: clone(g), cover: null, dirty: false };
  const d = S.sheet.draft, src = coverSrc(g), srcs = srcsOf(g);
  const propInputs = S.props.map(p => '<label class="field"><span>' + esc(p.name) + '</span>' + (p.type === 'text'
    ? '<textarea data-prop="' + p.id + '" rows="2">' + esc(d.props[p.id] != null ? d.props[p.id] : '') + '</textarea>'
    : '<input data-prop="' + p.id + '" type="' + (p.type === 'number' ? 'number' : 'date') + '"' + (p.type === 'number' ? ' step="any" inputmode="decimal"' : '') + ' value="' + esc(d.props[p.id] != null ? d.props[p.id] : '') + '">') + '</label>').join('');
  const sb = (ic, label, act, extra) => '<button class="btn sm" data-act="' + act + '"' + (extra || '') + '>' + I(ic) + ' ' + label + '</button>';
    const sh = openSheet('<div class="shbody"><div class="cmp"><div class="hero2"><div class="cv' + (src ? '' : ' nocover') + '" id="shCover" data-cvid="' + g.id + '" data-act="shCover"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '><button class="cgear" data-act="shCover" aria-label="Cover">' + I('gear') + '</button><button class="cvb l" data-act="shYoutube" title="Search on YouTube" aria-label="Search on YouTube"><svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4" style="fill:#f00;stroke:none"/><path d="M10 9.2v5.6l5-2.8z" style="fill:#fff;stroke:none"/></svg></button><button class="cvb r" data-act="shWiki" title="Search “title wiki” on Google" aria-label="Wiki"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.2 3.2 14.8 0 18M12 3c-3.2 3.2-3.2 14.8 0 18"/></svg></button></div><div class="hr"><button class="ib mnb" data-act="shMenu" title="Actions" aria-label="Actions">⋮</button><div class="srcrow2" id="shSrc"></div>'
    + '<div class="namebox"><span class="nm2" id="shName" data-act="shEditName"></span><button class="pen" data-act="shEditName" aria-label="Edit title">' + I('edit') + '</button></div><input id="f_name" type="hidden" value="' + esc(d.name) + '"><div class="infochips" id="shInfo"></div></div></div><div class="serprog" id="shSerie"></div><div class="serprog" id="shFran"></div>'
    + '<div class="hidden"><input id="f_year" type="number" value="' + (d.year || '') + '"><input id="f_rating" type="number" step="any" value="' + (d.rating || '') + '"><input id="f_time" type="number" step="any" value="' + (d.time || '') + '"><input id="f_series" value="' + esc(d.series) + '"><input id="f_franchise" value="' + esc(d.franchise || '') + '"></div>'
    + '<input type="file" id="coverFile" accept="image/*" class="hidden">'
    + '<div class="donerow"><div class="donecard" id="shDone2" data-act="shDone"><div class="dc1" id="doneL"></div><div class="dc2"><span id="doneTxt"></span><label class="dpick" data-act="noop" aria-label="Edit date">' + I('edit') + '<input id="f_donedate" type="date" value="' + esc(d.doneDate || '') + '"></label></div></div>'
    + '<div class="srcline" id="shLine" data-act="shSrcLine" title="Search this line in the source"></div></div>'
    + '<h3>Collections</h3><div class="chips shcolls" id="shColls"></div>'
    + '<div class="hdr3"><h3>Genres</h3><button class="btn" data-act="editGenres" aria-label="Edit genres">' + I('edit') + '</button></div><div class="chips" id="shGenres"></div>'
    + '<label class="field hidden" id="genresRow"><span>Genres (comma-separated)</span><input id="f_genres" value="' + esc(d.genres.join(', ')) + '"></label>'
    + '<div class="hdr3"><h3>Platforms</h3><button class="btn" data-act="editPlats" aria-label="Edit platforms">' + I('edit') + '</button></div><div class="chips" id="shPlats"></div>'
    + '<label class="field hidden" id="platsRow"><span>Platforms (comma-separated)</span><input id="f_platforms" value="' + esc(d.platforms.join(', ')) + '"></label>'
    + propInputs + '<h3>Screenshots</h3><div id="shotsSaved"></div><div class="tbar">' + sb('plus', 'Own', 'shotAddFile') + srcs.map(k => sb('img', PROV[k].name, 'loadShots', ' data-rid="' + ridOf(k, g[k + 'Id']) + '" data-save="1"')).join('') + '</div><input type="file" id="shotFile" accept="image/*" multiple class="hidden"><div id="shotsBox"></div></div>'
    + (d.added ? '<div class="addedAt">Added: ' + fmtTs(d.added) + '</div>' : '') + '</div>'
    + (() => { const c = libCtx(); return '<div class="sbar' + progCls() + '">' + sheetProgHtml(c) + '<button class="btn acc" data-act="closeSheet">Done</button>' + sheetNavHtml(c) + '<div class="smid"><span id="svst" class="sub">Saved automatically</span>' + sheetCntHtml(c) + '</div>'; })()
    + (isNew ? '<span style="width:44px"></span>' : '<button class="ib red" data-act="delGame" title="Delete game" aria-label="Delete game"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg></button>') + '</div>');
  drawShColls(); drawShGenres(d.genres); drawShPlats(d.platforms); drawShots(); drawShHead(); drawShInfo(); drawShName(); drawShDone(); drawShLine();
  { const p0 = sheetPos(); if (p0) [-1, 1].forEach(k => { const n0 = S.shown[p0.i + k]; if (n0) coverSrc(n0); }); }
  sh.classList.add('gs'); attachSwipe(sheetEl); if (dir) sh.scrollTop = 0; { const bd = dir && animOn() && !openGameSheet.noAnim && sh.querySelector ? sh.querySelector('.shbody') : null; if (bd && bd.classList) bd.classList.add(dir > 0 ? 'swr' : 'swl'); }
  $('#f_donedate').onchange = () => { const dd = S.sheet.draft; if ($('#f_donedate').value) dd.done = true; markDirty(); drawShDone(); };
  if (isNew) setTimeout(() => ACT.shEditName(), 60);
  $('#shotFile', sh).onchange = async e => { const files = Array.from(e.target.files || []); e.target.value = ''; if (files.length) await addShotFiles(files); };
  $('#coverFile', sh).onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    try { const b = await toThumb(file); S.sheet.cover = b; markDirty(); const u = URL.createObjectURL(b); const c = $('#shCover'); c.style.backgroundImage = "url('" + u + "')"; c.classList.remove('nocover'); } catch (er) { toast('Could not read the image'); }
  };
}
// свайп в карточке: следующая или предыдущая игра из текущего списка
function sheetSibling(dir) {
  const sh = S.sheet; if (!sh || sh.isNew || !S.shown) return;
  const i = S.shown.findIndex(g => g.id === sh.draft.id); if (i < 0) return;
  const n = S.shown[i + dir]; if (!n) return edgeFlash(dir);
  openGameSheet(n.id, dir); followLast();
}
// предпросмотр соседней игры: та же вёрстка, что у настоящей карточки (источник, название, чипы, серия, «Завершено», коллекции, жанры, платформы),
// чтобы при смене карточки ничего не сдвигалось; всё без обработчиков
const CV_YT = '<span class="cvb l"><svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4" style="fill:#f00;stroke:none"/><path d="M10 9.2v5.6l5-2.8z" style="fill:#fff;stroke:none"/></svg></span>';
const CV_WIKI = '<span class="cvb r"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.2 3.2 14.8 0 18M12 3c-3.2 3.2-3.2 14.8 0 18"/></svg></span>';
function swipePreview(g) {
  const src = coverSrc(g), srcs = srcsOf(g), chip = (ic, t) => '<button class="ichip" tabindex="-1">' + I(ic) + ' ' + t + '</button>';
  const colls = sortedColls().map(c => '<button class="p' + ((g.collections || []).includes(c.id) ? ' on' : '') + '" tabindex="-1"' + (okColor(c.color) ? ' style="color:' + okColor(c.color) + ';border-color:' + okColor(c.color) + '"' : '') + '>' + esc(c.name) + '</button>').join('') + '<button class="p new" tabindex="-1">＋ new</button>';
  const hdr = t => '<div class="hdr3"><h3>' + t + '</h3><button class="btn" tabindex="-1">' + I('edit') + '</button></div>';
  const dt = g.done && g.doneDate ? new Date(g.doneDate + 'T00:00:00').toLocaleDateString(LOC_DATE, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  return '<div class="cmp"><div class="hero2"><div class="cv' + (src ? '' : ' nocover') + '" data-cvid="' + g.id + '"' + (src ? ' style="background-image:url(\'' + bgu(src) + '\')"' : '') + '><span class="cgear">' + I('gear') + '</span>' + CV_YT + CV_WIKI + '</div>'
    + '<div class="hr"><button class="ib mnb" tabindex="-1">⋮</button><div class="srcrow2">' + (srcs.length ? srcs.map(k => srcBadge(k, g[k + 'Url'])).join('') : '<span class="srcb" style="color:var(--mut);border-color:var(--bd2)">Manual</span>') + '</div>'
    + '<div class="namebox"><span class="nm2' + (g.name ? '' : ' ph') + '">' + esc(g.name || 'Title: tap to enter') + '</span><button class="pen" tabindex="-1">' + I('edit') + '</button></div>'
    + '<div class="infochips">' + chip('cal', g.year || '—') + chip('star', g.rating ? esc(g.rating) + '/10' : '—') + chip('clock', g.time ? esc(g.time) + ' h' : '— h') + '<span class="brk"></span>' + chip('book', g.series ? esc(g.series) : 'Series') + (g.series ? '<button class="ichip icon" tabindex="-1">' + I('find') + '</button>' : '') + '</div></div></div>'
    + '<div class="serprog">' + serRowHtml(g, g.series) + '</div>'
    + '<div class="donerow"><div class="donecard' + (g.done ? ' on' : '') + '"><div class="dc1">' + I(g.done ? 'checkc' : 'circle') + ' <span>Completed</span></div><div class="dc2"><span>' + dt + '</span><label class="dpick">' + I('edit') + '</label></div></div>' + (g.srcLine ? '<div class="srcline">' + esc(g.srcLine) + '</div>' : '') + '</div>'
    + '<h3>Collections</h3><div class="chips shcolls" style="gap:0">' + colls + '</div>'
    + hdr('Genres') + '<div class="chips">' + ((g.genres || []).length ? g.genres.map(x => '<span class="tag">' + esc(x) + '</span>').join('') : '<span class="sub">No genres specified</span>') + '</div>'
    + hdr('Platforms') + '<div class="chips">' + ((g.platforms || []).length ? g.platforms.map(x => '<span class="tag m2">' + esc(shortPlat(x)) + '</span>').join('') : '<span class="sub">No platforms specified</span>') + '</div></div>';
}
// предпросмотр найденной игры из источника (карточка поиска)
function foundPreview(it) {
  const cat = gameByRid(it.rid), src = parseRid(it.rid).src, on = cat ? cat.done : false;
  return '<div class="hero"><div class="cv' + (it.cover ? '' : ' nocover') + '"' + (it.cover ? ' style="background-image:url(\'' + bgu(thumbUrl(it.cover)) + '\')"' : '') + '></div><div style="flex:1;min-width:0"><h2>' + esc(it.name || '') + ' <span class="y">' + (it.year || '') + '</span></h2>'
    + '<div class="m" style="font-size:14px">' + (it.rating ? '<span class="st">★ ' + it.rating + '</span>' : '') + (it.time ? ' · ⏱ ' + it.time + ' h' : '') + '</div>'
    + (it.type != null && TYPE_CHIP[it.type] ? '<div style="margin-top:6px">' + typeChip(it.type, 'lg') + '</div>' : '') + '</div></div>'
    + '<div class="rsload"></div>'
    + '<div class="chips" style="margin-top:8px">' + (it.genres || []).map(x => '<span class="tag">' + esc(x) + '</span>').join('') + '</div>'
    + '<div class="chips">' + (it.platforms || []).map(x => '<span class="tag m2">' + esc(x) + '</span>').join('') + '</div>'
    + '<div class="srcrow">' + srcBadge(src, cat ? cat[src + 'Url'] : '') + (cat ? '<span class="sub">In the catalog</span>' : '') + '</div>'
    + '<h3>Collections</h3><div class="chips shcolls"><button class="p' + (on ? ' on' : '') + '" tabindex="-1">' + (on ? '✓ ' : '') + 'Completed</button>'
    + sortedColls().map(k => '<button class="p' + ((cat ? cat.collections : []).includes(k.id) ? ' on' : '') + '" tabindex="-1">' + esc(k.name) + '</button>').join('') + '<button class="p new" tabindex="-1">＋ new</button></div>';
}
// положение открытой игры в текущем списке: номер и сколько всего
function sheetPos() { const sh = S.sheet; if (!sh || sh.isNew || !S.shown) return null; const i = S.shown.findIndex(g => g.id === sh.draft.id); return i < 0 ? null : { i, n: S.shown.length }; }
// контекст карусели: игра каталога (список библиотеки) или найденная игра из источника (результаты поиска).
// i/n - номер и сколько всего, item(k) - соседняя запись или null, html(запись) - предпросмотр, go(k) - перейти к соседней
function libCtx() { const p = sheetPos(); return p ? { i: p.i, n: p.n, item: k => S.shown[p.i + k] || null, html: swipePreview, go: k => sheetSibling(k) } : null; }
function srcCtx() {
  if (!S.rs) return null; const L = (S.search && viewRes()) || [], i = L.findIndex(x => x.rid === S.rs.rid); if (i < 0) return null;
  return { i, n: L.length, item: k => L[i + k] || null, html: foundPreview, go: k => { const x = L[i + k]; if (x) openIgdbSheet(x.rid, false, k); } };
}
const carCtx = () => !sheetEl ? null : sheetEl._key === 'igdb' ? srcCtx() : libCtx();
// нижняя панель: тонкая полоска прогресса сверху, кнопки «‹ ›» (только веб-версия) и «номер/всего»
let progOn = false, progT = 0;
const progCls = () => progOn ? ' act' : '';
const sheetProgHtml = c => c ? '<div class="spb"><i style="width:' + ((c.i + 1) / c.n * 100) + '%"></i></div>' : '';
const sheetCntHtml = c => c ? '<span class="snc">' + (c.i + 1) + '/' + c.n + '</span>' : '';
const sheetNavHtml = c => c ? '<span class="snav"><button class="ib" data-act="shNav" data-d="-1"' + (c.i <= 0 ? ' disabled' : '') + ' aria-label="Previous game">‹</button><button class="ib" data-act="shNav" data-d="1"' + (c.i >= c.n - 1 ? ' disabled' : '') + ' aria-label="Next game">›</button></span>' : '';
// индикатор серый; при свайпе и переходе оранжевый, через секунду после жеста снова серый ('hold' - пока палец на экране)
function progAct(on, i, n) {
  const sb = sheetEl && sheetEl.querySelector && sheetEl.querySelector('.sbar'); clearTimeout(progT); progOn = !!on;
  const apply = b => { if (b && b.classList) b.classList.toggle('act', progOn); };
  if (sb) { if (i != null) { const c = sb.querySelector('.snc'), f = sb.querySelector('.spb i'); if (c) c.textContent = (i + 1) + '/' + n; if (f) f.style.width = (n > 0 ? (i + 1) / n * 100 : 0) + '%'; } apply(sb); }
  if (on && on !== 'hold') progT = setTimeout(() => { progOn = false; apply(sheetEl && sheetEl.querySelector && sheetEl.querySelector('.sbar')); }, 1000);
}
// конец списка: у края карточки появляется мягкая красная дуга; чем сильнее тянешь, тем больше середина выпячивается к центру
function edgeShow(side, a) {
  try {
    const bx = sheetEl && sheetEl.querySelector('.sheet'); if (!bx) return;
    let e = sheetEl.querySelector('.swe.' + side); if (!e) { e = document.createElement('div'); e.className = 'swe ' + side; sheetEl.appendChild(e); }
    const r = bx.getBoundingClientRect ? bx.getBoundingClientRect() : { top: 0, height: 0, left: 0, right: 0 }, w = window.innerWidth || 0;
    e.style.top = Math.round(r.top + 14) + 'px'; e.style.height = Math.round(Math.max(0, r.height - 28)) + 'px'; e.style[side === 'l' ? 'left' : 'right'] = Math.round(side === 'l' ? r.left : w - r.right) + 'px';
    e.style.width = Math.round(4 + a * 34) + 'px'; e.style.opacity = Math.min(1, 0.35 + a * 0.65);
  } catch (e) { /* без границы можно обойтись */ }
}
const edgeHide = () => { try { sheetEl && sheetEl.querySelectorAll('.swe').forEach(e => { e.style.opacity = 0; e.style.width = '0px'; }); } catch (e) { /* ignore */ } };
function edgeFlash(dir) { edgeShow(dir > 0 ? 'r' : 'l', 0.8); buzz(30); setTimeout(edgeHide, 450); }
// переход к соседней карточке кнопкой или стрелкой клавиатуры
function carGo(dir) { const c = carCtx(); if (!c) return; if (c.item(dir)) { buzz(20); c.go(dir); progAct(true); } else edgeFlash(dir); }
// свайп как горизонтальная карусель: рядом с карточкой виден предпросмотр соседней, у края списка загорается красная граница
function attachSwipe(el) {
  if (!el || !el.addEventListener || el._sw) return; el._sw = true; let sx = 0, sy = 0, lx = 0, ly = 0, t0 = 0, ok = false, lock = false, busy = false, gh = null, ghDir = 0, edgeBuz = false;
  const sheet = () => el.querySelector('.shbody'), anim = () => animOn(), box = () => el.querySelector('.sheet');
  const dropGhost = () => { if (gh) { gh.remove(); gh = null; ghDir = 0; } };
  const mkGhost = (dir, c) => { // предпросмотр соседней записи сбоку; ставится ровно на место карточки под серой полоской
    if (gh && ghDir === dir) return gh; dropGhost(); const bx = box(), s = sheet(), g = c && c.item(dir); if (!bx || !s || !g) return null;
    gh = document.createElement('div'); gh.className = 'swg'; gh.innerHTML = c.html(g);
    gh.style.top = ((bx.scrollTop || 0) + s.offsetTop) + 'px'; gh.style.left = s.offsetLeft + 'px'; gh.style.width = s.offsetWidth + 'px'; ghDir = dir; bx.appendChild(gh); return gh;
  };
  const place = dx => { const bx = box(); if (!gh || !bx) return; gh.style.transition = 'none'; gh.style.transform = 'translateX(' + Math.round(dx + (dx < 0 ? 1 : -1) * bx.clientWidth) + 'px)'; };
  const drag = dx => {
    const s = sheet(), c = carCtx(); if (!s || !c || !anim()) return;
    const dir = dx < 0 ? 1 : -1, nb = c.item(dir), k = nb ? 1 : 0.3; // у края списка карточка тянется туго
    s.style.transition = 'none'; s.style.transform = 'translateX(' + Math.round(dx * k) + 'px)'; s.style.opacity = '1';
    if (nb) { edgeHide(); if (mkGhost(dir, c)) place(dx); } else { dropGhost(); const am = Math.min(1, Math.abs(dx) / 90); edgeShow(dir > 0 ? 'r' : 'l', am); if (am >= 0.66 && !edgeBuz) { edgeBuz = true; buzz(26); } }
    progAct('hold', c.i + (nb && Math.abs(dx) > 70 ? dir : 0), c.n);
  };
  const reset = animate => {
    const s = sheet(); edgeHide(); edgeBuz = false;
    if (gh) { const g0 = gh, bx = box(); if (animate && bx) { g0.style.transition = 'transform .16s ease-out'; g0.style.transform = 'translateX(' + (ghDir > 0 ? 1 : -1) * bx.clientWidth + 'px)'; gh = null; ghDir = 0; setTimeout(() => g0.remove(), 200); } else dropGhost(); }
    if (animate) { const c = carCtx(); progAct(true, c ? c.i : null, c ? c.n : 0); }
    if (!s) return; s.style.transition = animate ? 'transform .16s ease-out, opacity .16s' : 'none'; s.style.transform = ''; s.style.opacity = ''; if (animate) setTimeout(() => { s.style.transition = ''; }, 200);
  };
  const fin = () => {
    if (!ok) return; ok = false; const dx = lx - sx, dy = ly - sy, dir = dx < 0 ? 1 : -1;
    if (!lock) { reset(false); return; }
    const c = carCtx(), commit = Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - t0 < 1200, nb = c && c.item(dir), s = sheet(), bx = box();
    if (commit && nb) { // текущая карточка уезжает, предпросмотр доезжает на её место, потом содержимое заменяется
      const swap = () => { buzz(20); openGameSheet.noAnim = true; try { c.go(dir); } finally { openGameSheet.noAnim = false; } dropGhost(); const q = carCtx(); progAct(true, q ? q.i : null, q ? q.n : 0); };
      if (s && anim() && bx) { busy = true; const W = bx.clientWidth, t = 'transform .18s ease-out'; s.style.transition = t; s.style.transform = 'translateX(' + (dir > 0 ? -W : W) + 'px)'; if (gh) { gh.style.transition = t; gh.style.transform = 'translateX(0)'; } setTimeout(() => { busy = false; swap(); }, 185); } else swap();
    } else reset(true);
  };
  el.addEventListener('touchstart', e => { const t = e.touches && e.touches[0]; ok = !busy && !!t && !((t.clientX || 0) < 20 || (window.innerWidth && t.clientX > window.innerWidth - 20)) && e.touches.length === 1 && !(e.target.closest && e.target.closest('input,textarea,select,#shotsSaved,#shotsBox,.chips.scroll')); lock = false; if (ok) { reset(false); sx = lx = t.clientX; sy = ly = t.clientY; t0 = Date.now(); } }, { passive: true });
  el.addEventListener('touchmove', e => { if (!ok) return; const t = e.touches && e.touches[0]; if (!t) return; lx = t.clientX; ly = t.clientY; const dx = lx - sx, dy = ly - sy;
    if (!lock && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) lock = true; if (lock) { if (e.cancelable) e.preventDefault(); drag(dx); } }, { passive: false });
  el.addEventListener('touchend', e => { const t = e.changedTouches && e.changedTouches[0]; if (t) { lx = t.clientX; ly = t.clientY; } fin(); }, { passive: true });
  el.addEventListener('touchcancel', () => { if (ok && !lock) { ok = false; reset(false); } else fin(); }, { passive: true });
}
function drawShColls() {
  const d = S.sheet.draft;
  $('#shColls').innerHTML = sortedColls().map(c => '<button class="p' + (d.collections.includes(c.id) ? ' on' : '') + '"' + (okColor(c.color) ? ' style="color:' + okColor(c.color) + ';border-color:' + okColor(c.color) + '"' : '') + ' data-act="shColl" data-id="' + c.id + '">' + esc(c.name) + '</button>').join('') + '<button class="p new" data-act="shNewColl">＋ new</button>';
}
const EDIT_KEYS = ['name', 'year', 'rating', 'time', 'series', 'genres', 'platforms', 'collections', 'props', 'done', 'doneDate'];
let autoT;
function markDirty() {
  if (S.sheet && $('#shInfo')) { drawShInfo(); drawShName(); } if (!S.sheet) return; S.sheet.dirty = true; clearTimeout(autoT); autoT = setTimeout(autosave, 1500); }
function collectSheet() {
  const sh = S.sheet; if (!sh || !sheetEl || !$('#f_name')) return false; const d = sh.draft;
  Object.assign(d, { name: $('#f_name').value.trim(), year: (y => (y >= 1950 && y <= 2100) ? y : 0)(+$('#f_year').value || 0), rating: +$('#f_rating').value || 0, time: +$('#f_time').value || 0, series: $('#f_series').value.trim(), franchise: (($('#f_franchise') || {}).value || '').trim(), genres: canonList(csv($('#f_genres').value), canonGenre), platforms: canonList(csv($('#f_platforms').value), canonPlat) });
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
    if (S.games.some(x => normName(x.name) === normName(d.name) && (x.year || 0) === (d.year || 0))) { toast('This game is already in the catalog'); return false; }
    g = d; S.games.push(g);
  } else { if (g.rating !== d.rating) g.ratingManual = true; EDIT_KEYS.forEach(k => { g[k] = d[k] !== null && typeof d[k] === 'object' ? clone(d[k]) : d[k]; }); }
  if (sh.cover) { const b = sh.cover; sh.cover = null; await setCover(g.id, b); g.coverSrc = 'manual'; }
  await saveGame(g);
  const st = $('#svst'); if (st) st.textContent = 'Saved ✓';
  sh.saved = true; if (S.sheet !== sh) renderKeep(); // окно уже закрыли, пока шла запись
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
    ['series', 'franchise', 'coverUrl'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; }); ['year', 'rating', 'time'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; });
    if (!p.igdbId && o.igdbId) p.igdbId = o.igdbId; if (!p.rawgId && o.rawgId) p.rawgId = o.rawgId; ['igdbUrl', 'rawgUrl'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; }); if (!p.genres.length) p.genres = o.genres; if (!p.platforms.length) p.platforms = o.platforms;
    if (!p.hasCover && o.hasCover) { const c = await DB.get('covers', o.id); if (c) await setCover(p.id, c.blob); }
    for (const i of S.inbox.items) if (i.gameId === o.id) { i.gameId = p.id; await DB.put('inboxItems', i); }
    const os = await getShots(o.id);
    if (os.length) { const ps = await getShots(p.id), have = new Set(ps.map(x => x.src).filter(Boolean)), add = os.filter(x => !x.src || !have.has(x.src)); if (add.length) await putShots(p.id, ps.concat(add)); }
    await removeGame(o.id); // в корзину: так слияние можно отменить вместе с обложкой
  }
  p.series = canonSeries(p.series); await saveGame(p);
}
/* ====================== Объединение карточек вручную ====================== */
const MG_FIELDS = [['name', 'Title', 't', 'Title'], ['year', 'Year', 'n', 'Year'], ['platforms', 'Platforms', 'l', 'Plat.'], ['genres', 'Genres', 'l', 'Genre'], ['rating', 'Rating', 'n', 'Rat.'], ['time', 'Time, h', 'n', 'Hours'], ['series', 'Series', 't', 'Ser.'], ['franchise', 'Franchise', 't', 'Fr.'], ['collections', 'Collections', 'c', 'Coll.'], ['done', 'Completed', 'b', 'Done'], ['doneDate', 'Completion date', 'd', 'Date']];
const mgGet = (g, k) => (k === 'platforms' || k === 'genres' || k === 'collections') ? (g[k] || []).slice() : g[k];
const mgShow = (g, k) => {
  const v = mgGet(g, k);
  if (k === 'collections') return v.map(id => (collById(id) || {}).name).filter(Boolean).join(', ') || '—';
  if (Array.isArray(v)) return v.map(x => k === 'platforms' ? shortPlat(x) : x).join(', ') || '—';
  if (k === 'done') return v ? 'yes' : 'no';
  return v === '' || v == null || v === 0 ? '—' : String(v);
};
const mgUnion = (a, b) => Array.from(new Set((a || []).concat(b || [])));
const mgScore = g => (g.igdbId || g.rawgId ? 4 : 0) + (g.hasCover ? 2 : 0) + ((g.collections || []).length ? 1 : 0);
function mergeGroups(withYear) { // группы карточек с одинаковым названием (и годом), где карточек две и больше
  const m = new Map();
  S.games.forEach(g => { const k = normName(g.name) + (withYear ? '|' + (g.year || 0) : ''); if (!m.has(k)) m.set(k, []); m.get(k).push(g); });
  return Array.from(m.values()).filter(a => a.length > 1).sort((a, b) => b.length - a.length || a[0].name.localeCompare(b[0].name, LOC));
}
function mgBase(main, cards) { // результат: данные основной карточки, коллекции собраны со всех
  const r = {}; MG_FIELDS.forEach(f => { r[f[0]] = mgGet(main, f[0]); });
  r.collections = cards.reduce((a, c) => mgUnion(a, c.collections), []); return r;
}
function openMergeTool() {
  const y = !!S.mgYear, groups = mergeGroups(y);
  sheetKey = 'mgtool'; openSheet('<div class="hdr2"><h2>Merging cards</h2></div><div class="chips"><button class="p' + (!y ? ' on' : '') + '" data-act="mgMode" data-v="0">Title</button><button class="p' + (y ? ' on' : '') + '" data-act="mgMode" data-v="1">Title + year</button></div>'
    + '<p class="sub">Titles with two or more cards: ' + groups.length + '. Tap a title to compare the cards, choose the main one and move the data.</p><div class="mglist">'
    + (groups.map(a => '<div class="mgrow" data-act="mgOpen" data-ids="' + a.map(g => g.id).join(',') + '"><span class="mgn">' + esc(a[0].name) + '</span><span class="mgc">' + a.length + '</span><span class="sub mgs">' + esc(a.map(g => (g.year || '—') + ((g.platforms || []).length ? ' ' + g.platforms.slice(0, 2).map(shortPlat).join('/') : '')).join(' · ')) + '</span></div>').join('') || '<p class="hint">No identical titles</p>') + '</div>');
}
const mgCard = id => gameById(id) || (S.mgVirt && S.mgVirt[id]) || null;
function openMergeCompare(ids, fresh) {
  if (!ids.some(i => String(i).startsWith('virt_'))) { S.mgRefresh = false; S.mgVirt = null; } // обычное объединение, не сравнение с источником
  const cards = ids.map(mgCard).filter(Boolean); if (cards.length < 2) return toast('At least two cards are needed');
  if (fresh || !S.mg || S.mg.ids.join() !== ids.join()) { const main = S.mgRefresh ? cards[0] : cards.slice().sort((a, b) => mgScore(b) - mgScore(a) || (a.added || 0) - (b.added || 0))[0]; S.mg = { ids, main: main.id, res: mgBase(main, cards) }; }
  drawMergeCompare();
}
function drawMergeCompare() {
  const m = S.mg, cards = m.ids.map(mgCard).filter(Boolean), list = k => ['platforms', 'genres', 'collections'].includes(k), W = S.set.mgW || (S.set.mgW = {});
  const sw = ck => W[ck] ? ' style="width:' + W[ck] + 'px;min-width:' + W[ck] + 'px;max-width:' + W[ck] + 'px;overflow:hidden;text-overflow:ellipsis"' : '';
  const at = (ck, cl) => ' class="' + cl + '" data-ck="' + ck + '"' + sw(ck);
  const rz = ck => '<i class="rz" data-rz="' + ck + '"></i>';
  const head = '<tr><th class="mgl"></th><th' + at('res', 'mgres') + '>Result' + rz('res') + '</th>' + cards.map((c, i) => '<th' + at('c' + i, 'mgcol') + '>' + (c.virtual ? '<div class="sub"><b>From ' + esc(c.srcName) + '</b></div>' : '<button class="p' + (c.id === m.main ? ' on' : '') + '" data-act="mgMain" data-id="' + c.id + '">' + (c.id === m.main ? '✓ ' : '') + (S.mgRefresh ? 'Current data' : 'Main') + '</button>') + '<div class="sub">' + esc([c.year || '', (c.platforms || []).slice(0, 2).map(shortPlat).join('/'), srcsOf(c).map(k => PROV[k].name).join('+')].filter(Boolean).join(' · ')) + '</div>' + rz('c' + i) + '</th>').join('') + '</tr>';
  const rows = MG_FIELDS.map(f => { const k = f[0]; return '<tr><th class="mgl">' + f[3] + (list(k) ? '<br><button class="btn sm" data-act="mgUnion" data-k="' + k + '" title="Merge the lists of all cards">∪</button>' : '') + '</th><td' + at('res', 'mgres') + ' data-act="mgEdit" data-k="' + k + '"><span class="mgk">' + f[1] + '</span>' + esc(mgShow(m.res, k)) + ' <span class="pencil">✎</span></td>'
    + cards.map((c, i) => '<td' + at('c' + i, 'mgcell') + '>' + esc(mgShow(c, k)) + (c.id === m.main ? '' : '<div class="mgb"><button class="btn sm" data-act="mgTake" data-id="' + c.id + '" data-k="' + k + '" title="Take into the result">⇒</button>' + (list(k) ? '<button class="btn sm" data-act="mgAdd" data-id="' + c.id + '" data-k="' + k + '" title="Add to the result">＋</button>' : '') + '</div>') + '</td>').join('') + '</tr>'; }).join('');
  sheetKey = 'mgcmp'; openSheet('<div class="hdr2"><h2>' + esc(cards[0].name) + '</h2></div><p class="sub">The “Result” column is pinned on the left. Choose the main card; “⇒” takes a value from a card into the result, “＋” adds it to the list, “∪” merges the lists of all cards, and tapping a value in the “Result” changes it manually. Column width changes by the right edge of the header (double-tap resets it). The cover, sources, properties and screenshots are carried over automatically.</p>'
    + '<div class="mgwrap"><table class="mgt">' + head + rows + '</table></div><div class="toolbar"><button class="btn acc" data-act="mgDo">' + (S.mgRefresh ? 'Apply…' : 'Merge…') + '</button>' + (S.mgRefresh ? '' : '<button class="btn" data-act="mgBack">To the list of titles</button>') + '</div>');
}
function openMergePreview() {
  const m = S.mg, cards = m.ids.map(mgCard).filter(Boolean), main = mgCard(m.main), others = cards.filter(c => c.id !== m.main && !c.virtual), r = m.res;
  const shots = others.reduce((a, c) => a + (c.shotCount || 0), main.shotCount || 0);
  const lines = MG_FIELDS.map(f => '<tr><th class="mgl">' + f[1] + '</th><td>' + esc(mgShow(r, f[0])) + '</td></tr>').join('')
    + '<tr><th class="mgl">Sources</th><td>' + esc(cards.reduce((a, c) => mgUnion(a, srcsOf(c)), []).map(k => PROV[k].name).join(', ') || '—') + '</td></tr>'
    + '<tr><th class="mgl">Screenshots</th><td>' + shots + '</td></tr><tr><th class="mgl">Cover</th><td>' + (main.hasCover || !others.some(c => c.hasCover) ? 'of the main card' : 'from another card') + '</td></tr>';
  sheetKey = 'mgprev'; openSheet('<div class="hdr2"><h2>Check before merging</h2></div><p class="sub">The new card will look like this. ' + (S.mgRefresh ? 'Other cards are not affected.' : 'Cards to be deleted: <b>' + others.length + '</b> (') + esc(others.map(c => c.name + (c.year ? ' ' + c.year : '') + ((c.platforms || []).length ? ' ' + c.platforms.slice(0, 2).map(shortPlat).join('/') : '')).join('; ')) + (S.mgRefresh ? '' : '). They go to the trash and are kept there for 30 days, so they can be restored.') + '</p><div class="mgwrap"><table class="mgt mgp">' + lines + '</table></div>'
    + '<div class="toolbar"><button class="btn acc" data-act="mgGo">Merge</button><button class="btn" data-act="mgCompare">Back to comparison</button></div>');
}
async function applyMerge(m) {
  const p = mgCard(m.main), others = m.ids.filter(i => i !== m.main).map(mgCard).filter(Boolean), r = m.res; if (!p) return;
  p.name = r.name || p.name; p.year = +r.year || 0; p.rating = +r.rating || 0; p.time = +r.time || 0; p.series = canonSeries(r.series || ''); p.doneDate = r.doneDate || '';
  { const ad = [p].concat(others).map(x => x.added).filter(Boolean); if (ad.length) p.added = Math.min(...ad); }
  p.platforms = (r.platforms || []).slice(); p.genres = (r.genres || []).slice(); p.collections = (r.collections || []).filter(id => collById(id)); p.done = !!r.done;
  for (const o of others) {
    ['igdbId', 'rawgId', 'igdbUrl', 'rawgUrl', 'coverUrl'].forEach(k => { if (!p[k] && o[k]) p[k] = o[k]; });
    p.props = Object.assign({}, o.props || {}, p.props || {});
    if (o.virtual) continue;
    if (!p.hasCover && o.hasCover) { const c = await DB.get('covers', o.id); if (c) await setCover(p.id, c.blob); }
    for (const i of S.inbox.items) if (i.gameId === o.id) { i.gameId = p.id; await DB.put('inboxItems', i); }
    const os = await getShots(o.id);
    if (os.length) { const ps = await getShots(p.id), have = new Set(ps.map(x => x.src).filter(Boolean)), add = os.filter(x => !x.src || !have.has(x.src)); if (add.length) await putShots(p.id, ps.concat(add)); }
  }
  await saveGame(p);
  for (const o of others) if (!o.virtual) await removeGame(o.id);
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
  if (!n) { if (!silent) toast('No duplicates found'); return Promise.resolve(false); }
  const lines = [].concat(d.series.map(x => 'Series: ' + x.join(' = ')), d.colls.map(l => 'Collection: ' + l.map(c => c.name).join(' = ')), d.games.map(l => 'Game: ' + l[0].name + ' (×' + l.length + ')'));
  return new Promise(res => {
    const m = openModal();
    m.innerHTML = '<h4>Duplicates found: ' + n + '</h4><div class="sub" style="max-height:230px;overflow:auto;white-space:pre-wrap">' + esc(lines.join('\n')) + '</div><p class="sub">For series, the most frequent spelling stays. For games, the most complete card stays, and collections, properties and the “Completed” mark are combined.</p><div class="acts"><span data-x="cancel">Later</span><span data-x="ok">Merge</span></div>';
    modalCancel = () => { closeModal(); res(false); };
    m.onclick = async e => { const x = e.target.closest('[data-x]'); if (!x) return; closeModal(); if (x.dataset.x === 'ok') { const snap = takeSnap(); await mergeAllDupes(d); toastUndo('Duplicates merged', snap); res(true); } else res(false); };
  });
}
function dupBanner(kind) {
  const d = findDupes(), n = kind === 'series' ? d.series.length : d.colls.length;
  return n ? '<div class="banner">Duplicates found ' + (kind === 'series' ? 'series' : 'collections') + ' with different letter case: ' + n + '<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="fixDupes">Merge…</button></div></div>' : '';
}

async function refreshOne(g, src, defer) {
  src = src || srcsOf(g)[0]; const { d, series, franchise } = await fetchDetails(ridOf(src, g[src + 'Id'])); const n = gameFromDetails(d, series, franchise);
  Object.assign(g, { name: n.name, year: n.year, genres: n.genres, platforms: n.platforms });
  if (n[src + 'Url']) g[src + 'Url'] = n[src + 'Url'];
  if (!g.ratingManual || !g.rating) g.rating = n.rating;
  if (!g.time) g.time = n.time; if (!g.series) g.series = canonSeries(n.series); if (!g.franchise) g.franchise = canonFranchise(n.franchise);
  if (!g.coverSrc || g.coverSrc === src) { g.coverUrl = n.coverUrl; g.coverSrc = src; await cacheCover(g); if (!g.coverUrl && S.set.sgdbKey && S.set.sgdbOn && !g.hasCover) { try { await sgdbAuto(g); } catch (e) { /* без обложки */ } } }
  if (!defer) await saveGame(g); // при пакетном обновлении записывает вызывающий, пачкой
}
async function refreshFromIgdb(id, src) {
  await flushSheetNow();
  const g = gameById(id); if (!g) return; src = src || srcsOf(g)[0]; if (!g[src + 'Id']) return;
  const mode = await askChoose({ title: 'Update from ' + PROV[src].name, items: [{ id: 'all', label: 'Update all', sub: 'title, year, genres, platforms and cover will be replaced; your rating, time and series are kept', ico: '🔄' }, { id: 'cmp', label: 'Compare', sub: 'open the merge tool: the game\'s data and the source\'s data side by side', ico: '⚖' }] });
  if (!mode) return;
  if (mode === 'cmp') {
    try {
      const { d, series, franchise } = await fetchDetails(ridOf(src, g[src + 'Id'])), n = gameFromDetails(d, series, franchise);
      n.id = 'virt_' + uid(); n.virtual = true; n.srcName = PROV[src].name; n.series = n.series || ''; n.franchise = n.franchise || ''; n.added = 0;
      S.mgVirt = { [n.id]: n }; closeSheet(); S.mg = null; S.mgRefresh = true; openMergeCompare([g.id, n.id], true);
    } catch (e) { toast(e.message); }
    return;
  }
  try { await refreshOne(g, src); if (S.sheet) S.sheet.dirty = false; closeSheet(); toast('Updated'); render(); } catch (e) { toast(e.message); }
}
async function bulkTime(games) {
  const list = games.filter(g => g.igdbId); if (!list.length) return toast('None of the selected games is from IGDB');
  if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
  let n = 0, bad = 0; const chg = [], snap = takeSnap();
  await pool(list, 3, async g => { try { const h = await igdbTimeOf(g.igdbId); if (h > 0) { if (g.time !== h) { g.time = h; chg.push(g); } n++; } } catch (e) { bad++; } });
  await saveGames(chg); toastMaybeUndo('Time updated for games: ' + chg.length + (bad ? ', errors: ' + bad : '') + (n - chg.length > 0 ? ', unchanged: ' + (n - chg.length) : ''), snap, chg.length);
  S.sel.clear(); S.selMode = false; render();
}
async function bulkRefresh(games) {
  const src = S.set.mainSrc, nm = PROV[src].name, list = games.filter(g => g[src + 'Id']);
  if (!list.length) return toast('None of the selected games are from ' + nm);
  if (!await confirmBox('Update from ' + nm + ' – games: ' + list.length + '? Title, year, genres, platforms and cover will be replaced (including your genre and platform edits). Rating, time and series are kept. About ' + list.length * 2 + ' requests ' + nm + '. Updating runs in three threads and can be stopped.', 'Update')) return;
  let idx = 0, done = 0, ok = 0, stop = false, fin = false, streak = 0; const bad = [], pend = [], snap = takeSnap();
  const m = openModal(); modalCancel = () => { if (fin) closeModal(); else stop = true; };
  const draw = () => {
    const pct = Math.round(done * 100 / list.length);
    m.innerHTML = '<h4>Updating from ' + nm + '</h4><div class="pb" style="height:8px;margin:8px 0"><i style="width:' + pct + '%;background:var(--acc)"></i></div><p class="sub" style="margin:0 0 6px">' + (fin ? (stop ? 'Stopped. ' : 'Done. ') : 'Updating… ') + done + ' of ' + list.length + ' · updated: ' + ok + (bad.length ? ' · errors: ' + bad.length : '') + '</p>'
      + (fin && bad.length ? '<p class="sub" style="margin:0 0 6px;max-height:120px;overflow:auto">' + bad.slice(0, 8).map(esc).join('<br>') + (bad.length > 8 ? '<br>and ' + (bad.length - 8) : '') + '</p>' : '')
      + '<div class="acts">' + (fin ? '<span data-x="ok">Close</span>' : '<span data-x="stop">' + (stop ? 'Stopping…' : 'Stop') + '</span>') + '</div>';
  };
  m.onclick = e => { const x = e.target.closest('[data-x]'); if (!x) return; if (x.dataset.x === 'stop') { stop = true; draw(); } else closeModal(); };
  draw();
  const worker = async () => {
    while (!stop && idx < list.length) {
      const g = list[idx++];
      try { await refreshOne(g, src, true); pend.push(g); ok++; streak = 0; } catch (e) { bad.push(g.name + ': ' + (e.message || e)); if (++streak >= 5) { stop = true; bad.push('Stopped: five errors in a row, check your keys and limits'); } }
      done++; if (pend.length >= 20) await saveGames(pend.splice(0)); draw(); await new Promise(r => setTimeout(r, 200));
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  await saveGames(pend.splice(0)); fin = true; draw(); S.sel.clear(); S.selMode = false; render(); if (ok) toastUndo('Games updated: ' + ok, snap);
}

/* ====================== Коллекции ====================== */
const PALETTE = [['', 'No color'], ['#ff7a1a', 'Orange'], ['#3fb7f0', 'Blue'], ['#2e9e5b', 'Green'], ['#e5484d', 'Red'], ['#a259ff', 'Purple'], ['#f5c518', 'Yellow'], ['#ff5fa2', 'Pink'], ['#8b8b94', 'Gray']];
const okColor = c => /^#[0-9a-f]{6}$/i.test(c || '') ? c : '';
const sortedColls = () => S.collections.slice().sort((a, b) => (a.order != null ? a.order : 1e9) - (b.order != null ? b.order : 1e9) || (a.created || 0) - (b.created || 0) || a.name.localeCompare(b.name, LOC));
const vmodeOf = k => (S.set.vmode && S.set.vmode[k]) === 'list' ? 'list' : 'tiles';
const modeBtns = k => '<div class="tools" style="margin:0">' + ib('vmode', vmodeOf(k) === 'list' ? 'grid' : 'list', vmodeOf(k) === 'list' ? 'Tile' : 'List', false, '', ' data-k="' + k + '"') + zoomBtn(vmodeOf(k) === 'tiles' ? k : k + 'L') + (k === 'series' ? ib('serSort', 'sort', 'Sort series', !!S.set.serSort && S.set.serSort !== 'alpha') : '') + '</div>';
const boxHtml = (k, inner) => '<div id="tilesBox" class="' + (vmodeOf(k) === 'list' ? 'lrows z' + colsFor(k + 'L') : 'tiles z' + colsFor(k)) + '" style="--cols:' + colsFor(k) + '">' + inner + '</div>';
const pctColor = p => !p ? 'var(--mut)' : 'hsl(' + Math.round(p * 1.2) + ',68%,46%)'; // от красного (0%) к зелёному (100%)
const donePct = list => list.length ? Math.round(list.filter(g => g.done).length * 100 / list.length) : 0;
// одна запись списка коллекций или серий: плитка либо строка. Без кнопки ⋮: меню открывается долгим нажатием
function entryHtml(k, o) {
  const col = okColor(o.color), list = vmodeOf(k) === 'list', key = ' data-' + o.attr + '="' + esc(o.key) + '"';
  const lpm = o.lpm ? ' data-lpm="' + o.lpm + '"' : '';
  const pc = donePct(o.games), pcol = o.count ? pctColor(pc) : 'var(--mut)';
  const meta = '<div class="ct"><span>' + gWord(o.count) + '</span><span class="ctr">' + (list && o.badge ? o.badge : '') + '<span title="Completed" style="color:' + pcol + '">✓ ' + pc + '%</span></span></div><div class="pb' + tkCls(o.count) + '" style="' + tkSty(o.count) + '"><i style="width:' + pc + '%;background:' + pcol + '"></i></div>';
  if (list) {
    const u = o.covers[0];
    return '<div class="lrow" data-act="' + o.act + '"' + key + lpm + (col ? ' style="border-left-color:' + col + '"' : '') + '><div class="lth"' + (u ? ' style="background-image:url(\'' + bgu(u) + '\')"' : '') + '></div><div class="lm"><div class="nm">' + esc(o.name) + '</div>' + meta + '</div></div>';
  }
  // обложки растянуты на всю ширину плитки и перекрывают друг друга
  const n = o.covers.length, w = n === 1 ? 61 : n === 2 ? 52 : n === 3 ? 46 : 40, left = i => n === 1 ? (100 - w) / 2 : i * (100 - w) / (n - 1);
  return '<div class="tile" data-act="' + o.act + '"' + key + lpm + (col ? ' style="border-top:4px solid ' + col + '"' : '') + '><div class="mos">' + o.covers.map((u, i) => '<i style="left:' + left(i) + '%;width:' + w + '%;background-image:url(\'' + bgu(u) + '\')"></i>').join('') + '</div>'
    + '<div class="nm">' + esc(o.name) + '</div>' + meta + (o.badge ? '<div class="sbw">' + o.badge + '</div>' : '') + '</div>';
}
function collTilesHtml() {
  const q = normName(S.cFind), out = [];
  const mk = (id, name, list, c, sys) => {
    const g0 = c && c.coverGame ? gameById(c.coverGame) : null, one = g0 ? coverSrc(g0) : '';
    return entryHtml('coll', { act: 'collOpen', attr: 'id', key: id, name, count: list.length, games: list, color: c ? c.color : '', covers: one ? [one] : list.filter(x => x.hasCover || x.coverUrl).slice(0, 4).map(coverSrc).filter(Boolean), lpm: 'coll' });
  };
  if (!q || 'all games'.includes(q)) out.push(mk('all', 'All games', S.games, null, true));
  if (!q || 'completed'.includes(q)) out.push(mk(DONE_ID, 'Completed', S.games.filter(g => g.done), null, true));
  if (!q || 'no collections'.includes(q)) out.push(mk(NO_COLL, 'No collections', gamesIn(NO_COLL), null, true));
  sortedColls().forEach(c => { if (!q || normName(c.name).includes(q)) out.push(mk(c.id, c.name, gamesIn(c.id), c, false)); });
  return out.join('') || '<p class="hint">Nothing found</p>';
}
function viewCollections() {
  return '<div class="top"><div class="hdr2"><h2>Collections</h2>' + modeBtns('coll') + '</div>'
    + '<div class="bar"><div class="sbox"><span>🔍</span><input id="cfind" placeholder="Search collections" value="' + esc(S.cFind) + '"></div></div></div><div class="scrl">' + dupBanner('colls')
    + boxHtml('coll', collTilesHtml())
    + (S.collections.length ? '<p class="sub" style="text-align:center;margin-top:12px">Long-press a collection: rename, color, cover, export, delete</p>' : '')
    + (S.collections.length ? '' : '<p class="hint">Create your first collection with the “+” button (for example, “PS Store”, “Want to play”, “Favorites”). “All games” and “Completed” always exist.</p>') + '</div>';
}
async function collMenu(id) {
  if (id === 'all' || id === DONE_ID || id === NO_COLL) { const nm = id === 'all' ? 'All games' : id === NO_COLL ? 'No collections' : 'Completed', r0 = await choose({ title: nm, items: [{ id: 'export', label: 'Export the list…' }] }); if (r0 === 'export') openExport(id === 'all' ? S.games : id === NO_COLL ? gamesIn(NO_COLL) : S.games.filter(g => g.done), nm); return; }
  const c = collById(id); if (!c) return;
  const r = await choose({ title: c.name, items: [{ id: 'rename', label: 'Rename' }, { id: 'color', label: 'Tile color…' }, { id: 'cover', label: 'Tile cover…' }, { id: 'up', label: 'Higher in the list' }, { id: 'down', label: 'Lower in the list' }, { id: 'export', label: 'Export the list…' }, { id: 'del', label: 'Delete the collection (games stay)' }] });
  if (r === 'export') return openExport(gamesIn(id), c.name);
  if (r === 'rename') {
    const n = await promptBox('Collection name', c.name);
    if (n && (RESERVED.includes(normName(n)) || S.collections.some(x => x.id !== id && normName(x.name) === normName(n)))) return toast('A collection with this name already exists');
    if (n) { c.name = n; await DB.put('collections', c); render(); }
  }
  if (r === 'color') { const v = await choose({ title: 'Collection color', items: PALETTE.map(x => ({ id: x[0] || '__none', label: x[1] })) }); if (v !== null) { c.color = v === '__none' ? '' : v; await DB.put('collections', c); render(); } }
  if (r === 'cover') {
    const gs = gamesIn(id);
    const v = await choose({ title: 'Tile cover', search: gs.length > 12, items: [{ id: '__auto', label: 'Automatic (mosaic)', accent: true, pin: true }].concat(gs.map(g => ({ id: g.id, label: g.name }))) });
    if (v !== null) { c.coverGame = v === '__auto' ? '' : v; await DB.put('collections', c); render(); }
  }
  if (r === 'up' || r === 'down') {
    const arr = sortedColls(), i = arr.findIndex(x => x.id === id), j = r === 'up' ? i - 1 : i + 1;
    if (j >= 0 && j < arr.length) { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; for (let k = 0; k < arr.length; k++) { arr[k].order = k; await DB.put('collections', arr[k]); } render(); }
  }
  if (r === 'del' && await confirmBox('Delete the collection “' + c.name + '”? The games stay in the catalog.', 'Delete')) {
    const snap = takeSnap(); S.collections = S.collections.filter(x => x.id !== id); await DB.del('collections', id);
    for (const g of S.games) if (g.collections.includes(id)) { g.collections = g.collections.filter(x => x !== id); await saveGame(g); }
    S.set.f.collections = S.set.f.collections.filter(x => x !== id); saveSet(); render(); toastUndo('Collection deleted', snap);
  }
}

/* ====================== Разобрать ====================== */
const itemsOf = lid => S.inbox.items.filter(i => i.listId === lid);
const pendingItem = () => S.pending ? S.inbox.items.find(i => i.id === S.pending.itemId) : null;
const effItem = it => {
  const l = S.inbox.lists.find(x => x.id === it.listId) || {};
  return { colls: (it.colls || l.colls || []).filter(id => collById(id)), markDone: it.markDone != null ? !!it.markDone : !!l.markDone };
};
const collNames = ids => ids.map(id => (collById(id) || {}).name).filter(Boolean).join(', ');
// настройки списка/строки применяются к игре при сопоставлении: коллекции и «завершено» добавляются
function applyDefaults(it, g) {
  const e = effItem(it); let ch = false;
  e.colls.forEach(id => { if (!g.collections.includes(id)) { g.collections.push(id); ch = true; } });
  if (e.markDone && !g.done) { g.done = true; g.doneDate = g.doneDate || todayStr(); ch = true; }
  if (ch) saveGame(g);
}
async function applyToLinked(l) {
  const done = itemsOf(l.id).filter(i => i.done && gameById(i.gameId)); if (!done.length) return;
  if (!await confirmBox('Apply the list settings to games that were already processed (' + done.length + ')? Collections and “Completed” will be added.', 'Apply')) return;
  done.forEach(i => applyDefaults(i, gameById(i.gameId))); toast('Done');
}
async function itemOpts(it) {
  const e = effItem(it);
  const r = await askChoose({ title: it.text, items: [{ id: 'colls', label: 'Collections…', sub: collNames(e.colls) || 'no' }, { id: 'done', label: 'Completed: ' + (e.markDone ? 'yes' : 'no'), sub: 'tap to switch' }, { id: 'reset', label: 'Same as the whole list' }] });
  if (!r) return;
  if (r === 'colls') { const v = await pickCollections(it.text, e.colls, true); if (v === null) return; it.colls = v; }
  else if (r === 'done') it.markDone = !e.markDone;
  else { delete it.colls; delete it.markDone; }
  await DB.put('inboxItems', it); render();
}
function viewInbox() {
  if (S.inboxList && !S.inbox.lists.some(l => l.id === S.inboxList)) S.inboxList = null;
  if (!S.inboxList) {
    const cards = S.inbox.lists.map(l => {
      const it = itemsOf(l.id), left = it.filter(i => !i.done).length, pct = it.length ? Math.round((it.length - left) * 100 / it.length) : 0;
      return '<div class="lcard" data-act="listOpen" data-id="' + l.id + '"><div style="flex:1;min-width:0"><div class="nm">' + esc(l.name) + '</div><div class="ct">left ' + left + ' of ' + it.length + '</div><div class="pb"><i style="width:' + pct + '%;background:' + pctColor(pct) + '"></i></div></div><button class="mn2" data-act="listMenu" data-id="' + l.id + '">⋮</button></div>';
    }).join('');
    return '<div class="hdr2"><h2>Parse</h2></div>' + (cards || '<p class="hint">Here live the lists of games that need processing: paste titles from notes or Steam, then find them one by one in IGDB.<br>Tap “+” to create a list.</p>');
  }
  const l = S.inbox.lists.find(x => x.id === S.inboxList), all = itemsOf(l.id), left = all.filter(i => !i.done).length, nChk = all.filter(i => !i.done && (i.rev || i.doubt)).length;
  const nBun = all.filter(i => !i.done && i.bundle).length; if (!nBun) S.inBundleOnly = false;
  const list = (S.showDone ? all : all.filter(i => !i.done)).filter(i => !S.inBundleOnly || i.bundle);
  const row = i => {
    const g = i.done ? gameById(i.gameId) : null;
    return '<div class="it' + (i.done ? ' done' : '') + (!i.done && (i.rev || i.doubt) ? ' chkrow' : '') + (S.inSel.has(i.id) ? ' isel' : '') + '"' + (i.done ? '' : ' data-iid="' + i.id + '" data-lpm="item"') + '><div class="tx" data-act="itOpen" data-id="' + i.id + '">' + (S.inSelMode && !i.done ? '<span class="ichk">' + (S.inSel.has(i.id) ? '✓' : '') + '</span>' : '') + (i.done ? '<span class="okc">✓</span> ' : '') + esc(i.text)
      + (i.done ? '<div class="sub">→ ' + (g ? esc(g.name) : 'the game was deleted from the catalog') + '</div>' : (() => { const e = effItem(i), parts = [i.year || '', i.hours ? i.hours + ' h' : i.unk ? '? h' : '', i.x && i.x.series ? '📚 ' + i.x.series : '', i.failed ? '⚠ not recognized' : '', i.bundle ? '📦 bundle «' + i.bundle.name + '»: several games' : '', i.rev ? '≈ ' + i.rev.pct + '%: in the catalog “' + ((gameById(i.rev.gid) || {}).name || '?') + '”, please check' : '', i.doubt ? '≈ found in the source inexactly (' + ((i.cands && i.cands[0] && i.cands[0].pct) || '') + '%), please check' : '', collNames(e.colls), e.markDone ? '✓ completed' : ''].filter(Boolean); return parts.length ? '<div class="sub">' + esc(parts.join(' · ')) + '</div>' : ''; })()) + '</div><div class="ia">'
      + (i.done ? '' : (i.bundle ? '<button data-act="itBundle" data-id="' + i.id + '" title="Bundle games: add each one separately">B</button>' : '') + (i.doubt ? '<button data-act="itPick" data-id="' + i.id + '" title="Choose from the options">≈</button>' : '') + (i.rev ? '<button data-act="itRev" data-id="' + i.id + '" title="Check the match with the catalog">≈</button>' : '') + '<button data-act="itOpts" data-id="' + i.id + '" title="Collections and “Completed” for this row">⚙</button><button data-act="itMatch" data-id="' + i.id + '" title="Match with a game from the catalog">🔗</button><button data-act="itEdit" data-id="' + i.id + '" title="Edit">✎</button>')
      + '<button data-act="itDel" data-id="' + i.id + '" title="Delete">🗑</button></div></div>';
  };
  return '<div class="hdr2"><div style="display:flex;align-items:center;gap:10px;min-width:0"><button class="btn" data-act="listBack">←</button><h2 style="font-size:19px">' + esc(l.name) + '</h2></div><span class="sub">left ' + left + ' of ' + all.length + '</span></div>'
    + '<div class="sub" style="margin:6px 2px 2px">For all rows of this list (a row can be changed separately with the ⚙ button):</div><div class="sec lstdef" style="padding:4px 12px">'
    + '<div class="lrw"><span>Collections</span><button class="btn" data-act="lstColls">' + esc(collNames((l.colls || []).filter(id => collById(id))) || 'not chosen') + '</button></div>'
    + '<div class="lrw"><span>Completed</span><button class="p' + (l.markDone ? ' on' : '') + '" data-act="lstDone">' + (l.markDone ? '✓ yes' : 'no') + '</button></div></div>'
    + '<div class="addrow"><input id="itNew" placeholder="Game title…"><button class="btn acc" data-act="itAdd">Add</button></div>'
    + '<div class="toolbar"><button class="btn acc" data-act="itAuto">⚡ Process automatically</button>' + (nChk ? '<button class="btn warn" data-act="itReview">≈ Process mismatches (' + nChk + ')</button>' : '') + (nBun ? '<button class="btn' + (S.inBundleOnly ? ' acc' : '') + '" data-act="itBundleFilter">B Bundles (' + nBun + ')</button>' : '') + '<button class="btn" data-act="itPaste">Paste a list…</button><button class="btn" data-act="itToggleDone">' + (S.showDone ? 'Hide processed' : 'Show processed') + '</button></div>'
    + '<div class="sec" style="padding:4px 12px">' + (list.map(row).join('') || '<p class="sub" style="padding:14px">The list is empty.</p>') + '</div><p class="sub">Tap a title to find the game in the search source. 🔗 matches the row with a game already in the catalog. A long press on a row turns on row selection: you can set collections and “Completed” for several at once.</p>';
}
async function createList() {
  const name = await promptBox('List name', '', 'for example: Steam'); if (!name) return;
  const l = { id: uid(), name, created: Date.now() }; S.inbox.lists.push(l); await DB.put('inboxLists', l);
  S.inboxList = l.id; render(); pasteModal(l.id);
}
async function listMenu(id) {
  const l = S.inbox.lists.find(x => x.id === id); if (!l) return;
  const r = await choose({ title: l.name, items: [{ id: 'rename', label: 'Rename' }, { id: 'clear', label: 'Remove processed games from the list' }, { id: 'del', label: 'Delete the list' }] });
  if (r === 'rename') { const n = await promptBox('List name', l.name); if (n) { l.name = n; await DB.put('inboxLists', l); render(); } }
  if (r === 'clear') { for (const i of itemsOf(id).filter(x => x.done)) { S.inbox.items = S.inbox.items.filter(x => x.id !== i.id); await DB.del('inboxItems', i.id); } render(); }
  if (r === 'del' && await confirmBox('Delete the list “' + l.name + '” with all its rows? The games in the catalog stay.', 'Delete')) {
    for (const i of itemsOf(id)) await DB.del('inboxItems', i.id);
    S.inbox.items = S.inbox.items.filter(i => i.listId !== id); S.inbox.lists = S.inbox.lists.filter(x => x.id !== id); await DB.del('inboxLists', id); render();
  }
}
async function addItems(listId, lines) { return addParsed(listId, lines.map(l => { const x = parseLine(l); if (x) x.raw = String(l).replace(/^\s*(?:\d+[.)]|[-•*–])\s*/, '').trim(); return x; }).filter(Boolean)); }
async function addParsed(listId, rows) {
  const have = new Set(itemsOf(listId).map(i => normName(i.text))); let n = 0;
  for (const p of rows) {
    if (!p || have.has(normName(p.text))) continue; have.add(normName(p.text));
    const it = { id: uid(), listId, text: p.text, year: p.year, hours: p.hours, done: false, gameId: '', igdbId: 0, created: Date.now() + n }; if (p.x) it.x = p.x; if (p.unk) it.unk = true; if (p.raw) it.raw = p.raw;
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
    (x.platforms || []).map(pl => canonPlat(pl, true)).forEach(pl => { if (pl && !g.platforms.includes(pl)) { g.platforms.push(pl); ch = true; } });
    if (!g.genres.length && (x.genres || []).length) { g.genres = canonList(x.genres, canonGenre); ch = true; }
    if (!g.series && x.series) { g.series = canonSeries(x.series); ch = true; }
    if (!g.franchise && x.franchise) { g.franchise = canonFranchise(x.franchise); ch = true; }
    (x.colls || []).forEach(nm => {
      let c = S.collections.find(k => normName(k.name) === normName(nm));
      if (!c && !RESERVED.includes(normName(nm))) { c = { id: uid(), name: nm, created: Date.now() }; S.collections.push(c); DB.put('collections', c); }
      if (c && !g.collections.includes(c.id)) { g.collections.push(c.id); ch = true; }
    });
    if (x.done && !g.done) { g.done = true; g.doneDate = g.doneDate || x.doneDate || todayStr(); ch = true; }
  }
  if (ch) saveGame(g);
}
// лучшая игра каталога для строки и процент совпадения (id из выгрузки точнее названия: 100%)
function catalogMatch(it) {
  if (it.x) { const gx = (it.x.gid && gameById(it.x.gid)) || S.games.find(g => (it.x.igdbId && g.igdbId === it.x.igdbId) || (it.x.rawgId && g.rawgId === it.x.rawgId)); if (gx) return { g: gx, pct: 100 }; }
  let best = null, bs = 0;
  for (const g of S.games) {
    let sc = similarity(it.text, g.name);
    if (it.year && g.year) sc += Math.abs(it.year - g.year) <= 1 ? 0.03 : -0.2;
    if (sc > bs) { bs = sc; best = g; }
  }
  return best ? { g: best, pct: pct(bs) } : null;
}
// данные строки разбора, которые важнее данных источника при добавлении новой игры: серия и время из текста
// пороги совпадения (в процентах): каталог и источник; «от» - ниже строка не считается найденной, «до» - от этого значения игра считается найденной точно
const matchCfg = l => { const d = Object.assign({ cLow: 85, cHigh: 98, sLow: 50, sHigh: 98 }, S.set.match, l && l.match); const c = (v, def) => Math.min(100, Math.max(0, +v || def)); const o = { cLow: c(d.cLow, 85), cHigh: c(d.cHigh, 98), sLow: c(d.sLow, 50), sHigh: c(d.sHigh, 98) }; o.cLow = Math.min(o.cLow, o.cHigh); o.sLow = Math.min(o.sLow, o.sHigh); return o; };
const pct = sc => Math.max(0, Math.min(100, Math.round(sc * 100)));
// строка разбора в виде «Название (Год | Платформы | Серия) – время ч»: так она хранится в карточке
function itemLine(it) {
  if (!it) return ''; const x = it.x || {}, mt = lineMeta(it.year, platOut((x.platforms || []).join(', ')), x.series || '');
  return String(it.text || '') + (mt ? ' (' + mt + ')' : '') + (it.hours ? ' – ' + it.hours + ' h' : it.unk ? ' – ? h' : '');
}
const itemAddOpts = it => ({ line: itemLine(it), series: it && it.x && it.x.series ? canonSeries(it.x.series) : '', hours: it && it.hours > 0 ? it.hours : 0 });
// окно перед разбором: проценты совпадения для каталога и источника; результат {cfg, src} или null
function matchDialog(cfg, srcName) {
  if (typeof window !== 'undefined' && window.__matchHook) return window.__matchHook(cfg, srcName); // для автотестов
  return new Promise(res => {
    const m = openModal(), num = (id, v) => '<input id="' + id + '" inputmode="numeric" maxlength="3" value="' + v + '" style="width:64px;text-align:center">';
    m.innerHTML = '<h4>Automatic parsing</h4><p class="sub">Rows are matched with the catalog first. A match at or above the upper percentage counts as exact. Between the lower and the upper one the row is marked ≈ and handled manually. Below the lower one the game is not considered found in the catalog.</p>'
      + '<div class="lrw"><span>Catalog: from</span>' + num('mcl', cfg.cLow) + '<span>to</span>' + num('mch', cfg.cHigh) + '<span>%</span></div>'
      + (srcName ? '<p class="sub">For the remaining rows the game is searched in ' + esc(srcName) + ' (same rule).</p><div class="lrw"><span>' + esc(srcName) + ': from</span>' + num('msl', cfg.sLow) + '<span>to</span>' + num('msh', cfg.sHigh) + '<span>%</span></div>' : '')
      + '<div class="acts"><span data-x="cancel">Cancel</span>' + (srcName ? '<span data-x="cat">Catalog only</span>' : '') + '<span data-x="ok">' + (srcName ? 'Search in ' + esc(srcName) : 'Parse') + '</span></div>';
    const rd = () => { const g = id => { const e = $('#' + id, m); return e ? +e.value.replace(/\D/g, '') : 0; }; const c = { cLow: g('mcl'), cHigh: g('mch'), sLow: srcName ? g('msl') : cfg.sLow, sHigh: srcName ? g('msh') : cfg.sHigh }; return matchCfg({ match: c }); };
    modalCancel = () => { closeModal(); res(null); };
    m.onclick = e => { const x = e.target.closest('[data-x]'); if (!x) return; const k = x.dataset.x; if (k === 'cancel') { closeModal(); res(null); } else { const cf = rd(); closeModal(); res({ cfg: cf, src: k === 'ok' && !!srcName }); } };
  });
}
// поиск строки в источнике (IGDB/RAWG): 'added' - найдена точно (от верхнего порога) и добавлена, 'doubt' - нужна проверка вручную, 'skipped', 'failed'
async function sourceResolve(it, cfg, after) {
  const src = S.set.mainSrc;
  const found = src === 'rawg' ? (await rawg('/games', { search: it.text, page_size: 5 })).results.map(x => Object.assign(x, { _src: 'rawg' })) : (await igdb('/games', 'search "' + igdbQuote(it.text) + '"; fields ' + IGDB_FIELDS + '; where ' + typeWhere() + '; limit 5;')).map(x => Object.assign(x, { _src: 'igdb' }));
  const ranked = found.map(mapItem).map(x => ({ x, sc: similarity(it.text, x.name) + (it.year && x.year ? (Math.abs(it.year - x.year) <= 1 ? 0.04 : -0.2) : 0) })).sort((a, b) => b.sc - a.sc), best = ranked[0];
  delete it.bundle;
  if (src === 'igdb' && best && pct(best.sc) >= cfg.sLow && await isBundleMatch(best.x)) { // это бандл: несколько игр в одной строке - не добавляем автоматически, строка получает пометку B
    it.bundle = { rid: best.x.rid, name: best.x.name, year: best.x.year }; it.doubt = false; it.failed = false; delete it.rev; delete it.cands; await DB.put('inboxItems', it); return 'bundle';
  }
  if (best && pct(best.sc) >= cfg.sHigh) { const gg = await addFromIgdb(best.x.rid, [], itemAddOpts(it)); if (after) after(); if (gg) { linkItem(it, gg, true); return 'added'; } if (gg === false) return 'skipped'; }
  if (best && pct(best.sc) >= cfg.sLow) { // игра нашлась, но совпадение неполное: строка получает пометку «проверить» и разбирается вручную
    it.doubt = true; it.failed = false; delete it.rev; it.cands = ranked.filter(r => r.sc >= 0.5).slice(0, 5).map(r => ({ rid: r.x.rid, name: r.x.name, year: r.x.year, pct: pct(r.sc), platforms: r.x.platforms.slice(0, 3) })); await DB.put('inboxItems', it); return 'doubt';
  }
  return 'failed';
}
async function autoResolve(listId) {
  const items = itemsOf(listId).filter(i => !i.done);
  if (!items.length) return toast('All rows are already processed');
  const lst = S.inbox.lists.find(x => x.id === listId), cfg0 = matchCfg(lst), srcName = PROV[S.set.mainSrc].name, canSrc = PROV[S.set.mainSrc].ready();
  const ch = await matchDialog(cfg0, canSrc ? srcName : '');
  if (!ch) return; const cfg = ch.cfg; if (lst) { lst.match = cfg; await DB.put('inboxLists', lst); }
  let useIgdb = canSrc && ch.src;
  let nCat = 0, nRaw = 0, nDoubt = 0, nRev = 0, nBundle = 0, skipped = 0, stop = false; const bad = [];
  const showProg = () => { const m = openModal(); m.innerHTML = '<h4>Processing the list…</h4><p class="sub" id="apTxt">0 of ' + items.length + '</p><div class="acts"><span data-x="stop">Stop</span></div>'; m.onclick = e => { if (e.target.closest('[data-x]')) stop = true; }; modalCancel = () => { stop = true; }; };
  showProg(); // окно выбора платформы закрывает это окно, поэтому после него оно открывается заново
  for (let k = 0; k < items.length && !stop; k++) {
    const it = items[k], tx = $('#apTxt'); if (tx) tx.textContent = (k + 1) + ' of ' + items.length + ': ' + it.text;
    const cm = catalogMatch(it);
    if (cm && cm.pct >= cfg.cLow && cm.pct < cfg.cHigh) { it.rev = { gid: cm.g.id, pct: cm.pct }; it.failed = false; it.doubt = false; delete it.cands; await DB.put('inboxItems', it); nRev++; continue; } // найдена в каталоге, но не точно: проверить вручную
    const g = cm && cm.pct >= cfg.cHigh ? cm.g : null; if (g) { linkItem(it, g, true); nCat++; if (it.unk && !g.time && g.igdbId && S.set.mainSrc === 'igdb') { try { await fillTimeIgdb(g); } catch (e) { logErr('IGDB time during parsing', e); /* время останется пустым */ } } continue; }
    const rid0 = it.x && (it.x.igdbId ? 'igdb:' + it.x.igdbId : it.x.rawgId ? 'rawg:' + it.x.rawgId : '');
    if (rid0 && PROV[parseRid(rid0).src].ready()) { // в строке есть id источника: добавляем эту игру точно
      try { const gg = await addFromIgdb(rid0, [], itemAddOpts(it)); if (!modalEl) showProg(); if (gg) { linkItem(it, gg, true); nRaw++; continue; } if (gg === false) { skipped++; continue; } } catch (e) { logErr('adding from IGDB during parsing', e); /* ищем по названию */ }
    }
    if (useIgdb && !blockFor(S.set.mainSrc)) {
      try {
        const st = await sourceResolve(it, cfg, () => { if (!modalEl) showProg(); });
        if (st === 'added') { nRaw++; await new Promise(r => setTimeout(r, 300)); continue; }
        if (st === 'doubt') { nDoubt++; await new Promise(r => setTimeout(r, 300)); continue; }
        if (st === 'bundle') { nBundle++; await new Promise(r => setTimeout(r, 300)); continue; }
        if (st === 'skipped') { skipped++; continue; }
      } catch (e) { if (blockFor(S.set.mainSrc)) useIgdb = false; }
      await new Promise(r => setTimeout(r, 300));
    }
    it.failed = true; await DB.put('inboxItems', it); bad.push(it.text);
  }
  closeModal();
  const r = openModal();
  r.innerHTML = '<h4>Processing finished</h4><p class="sub">From the catalog: <b>' + nCat + '</b>, added from IGDB: <b>' + nRaw + '</b>, not recognized: <b>' + bad.length + '</b>' + (nRev ? ', matched in the catalog inexactly: <b>' + nRev + '</b>' : '') + (nDoubt ? ', found in the source inexactly: <b>' + nDoubt + '</b>' : '') + (nBundle ? ', bundles (several games in one line): <b>' + nBundle + '</b>' : '') + (nRev + nDoubt ? ' (marked ≈, tap “Process mismatches”)' : '') + (skipped ? ', skipped without a platform: <b>' + skipped + '</b>' : '') + (stop ? ' (stopped)' : '') + '</p>'
    + (bad.length ? '<div class="sub" style="max-height:200px;overflow:auto;white-space:pre-wrap">' + esc(bad.slice(0, 40).join('\n')) + (bad.length > 40 ? '\n…' : '') + '</div><p class="sub">These rows stayed in the list marked ⚠: process them manually (tap the title) or fix the text.</p>' : '')
    + '<div class="acts"><span data-x="ok">OK</span></div>';
  modalCancel = () => closeModal(); r.onclick = e => { if (e.target.closest('[data-x]')) closeModal(); };
  render();
}
function pasteModal(listId) {
  const m = openModal();
  m.innerHTML = '<h4>Paste a list of games</h4><p class="sub">Each row is one game. You can also paste a table from an export (with headers): missing data will be filled in on the cards. Paste the text into the field (long-press, then “Paste”).</p><label class="field"><textarea id="pasteT" style="min-height:160px"></textarea></label><div class="acts"><span data-x="cancel">Cancel</span><span data-x="ok">Add</span></div>';
  modalCancel = () => closeModal();
  m.onclick = async e => {
    const x = e.target.closest('[data-x]'); if (!x) return; const ta = $('#pasteT', m);
    if (x.dataset.x === 'ok') { const t = ta.value; closeModal(); const n = await addParsed(listId, parseInboxText(t)); toast('Rows added: ' + n); render(); }
    else closeModal();
  };
}
function pickGame(prefill) {
  return new Promise(res => {
    const m = openModal(); if (m.classList) m.classList.add('chm');
    m.innerHTML = '<h4>Match with a game from the catalog</h4><label class="field"><input id="pgq" value="' + esc(prefill) + '" placeholder="Title"></label><div id="pgl"></div><div class="acts"><span data-x="cancel">Cancel</span></div>';
    const draw = () => {
      const toks = $('#pgq', m).value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let list = S.games.filter(g => toks.every(t => g.name.toLowerCase().includes(t)));
      if (!list.length && toks.length) list = S.games.filter(g => toks.some(t => g.name.toLowerCase().includes(t)));
      $('#pgl', m).innerHTML = list.slice(0, 40).map(g => '<div class="opt" data-id="' + g.id + '"><div>' + esc(g.name) + '<div class="sub">' + (g.year || '') + ' ' + esc((g.platforms || []).slice(0, 2).join(', ')) + '</div></div></div>').join('') || '<p class="sub">Nothing found</p>';
    };
    draw(); modalCancel = () => { closeModal(); res(null); }; m.oninput = draw;
    m.onclick = e => { const o = e.target.closest('.opt'), x = e.target.closest('[data-x]'); if (x) { closeModal(); res(null); } else if (o) { closeModal(); res(o.dataset.id); } };
  });
}
// ручная обработка строк с неполным совпадением: по очереди строка из разбора и найденная игра
async function reviewOne(it, k, n) {
  const title = k + ' of ' + n + ': «' + it.text + '»' + (it.year ? ' (' + it.year + ')' : '');
  const tail = [{ id: '__skip', label: 'Skip', ico: '⏭' }, { id: '__stop', label: 'Finish processing', ico: '⏹' }];
  if (it.rev) {
    const g = gameById(it.rev.gid); if (!g) { delete it.rev; await DB.put('inboxItems', it); return 'next'; }
    const r = await askChoose({ title, items: [{ id: 'same', label: 'The same game: ' + g.name + (g.year ? ' (' + g.year + ')' : ''), sub: 'in the catalog, match ' + it.rev.pct + '% · ' + (g.platforms || []).slice(0, 3).map(shortPlat).join(', '), ico: '✅' }, { id: 'other', label: 'Another game: search in the source', ico: '🔎' }, { id: 'pick', label: 'Pick another from the catalog…', ico: '📚' }].concat(tail) });
    if (r === null || r === '__stop') return 'stop'; if (r === '__skip') return 'next';
    if (r === 'same') { linkItem(it, g, true); return 'next'; }
    if (r === 'pick') { const id = await pickGame(it.text), g2 = id && gameById(id); if (g2) { linkItem(it, g2, true); } return 'next'; }
    delete it.rev; await DB.put('inboxItems', it);
    if (PROV[S.set.mainSrc].ready() && !blockFor(S.set.mainSrc)) { try { const st = await sourceResolve(it, Object.assign(matchCfg(S.inbox.lists.find(l => l.id === it.listId)), { sHigh: 101 })); if (st === 'failed') { it.failed = true; await DB.put('inboxItems', it); toast('In ' + PROV[S.set.mainSrc].name + ' nothing similar found'); } } catch (e) { toast(e.message); } if (it.doubt) return reviewOne(it, k, n); }
    else { it.failed = true; await DB.put('inboxItems', it); }
    return 'next';
  }
  const c = it.cands || [];
  const r = await askChoose({ title, items: c.map(x => ({ id: x.rid, label: x.name + (x.year ? ' (' + x.year + ')' : ''), sub: (x.pct ? x.pct + '% · ' : '') + (x.platforms || []).join(', '), ico: '🎮' })).concat([{ id: '__none', label: 'None fits', ico: '✖' }], tail) });
  if (r === null || r === '__stop') return 'stop'; if (r === '__skip') return 'next';
  if (r === '__none') { it.doubt = false; it.failed = true; delete it.cands; await DB.put('inboxItems', it); return 'next'; }
  try { const g = await addFromIgdb(r, [], itemAddOpts(it)); if (g) linkItem(it, g, true); } catch (er) { toast(er.message); return 'stop'; }
  return 'next';
}
async function reviewItems(listId) {
  const todo = itemsOf(listId).filter(i => !i.done && (i.rev || i.doubt)); if (!todo.length) return toast('No rows to check');
  let k = 0;
  for (const it of todo) { k++; const st = await reviewOne(it, k, todo.length); if (st === 'stop') break; }
  render();
}
async function matchItem(it) {
  if (!it || it.done) return;
  if (!S.games.length) return toast('There are no games in the catalog yet');
  const id = await pickGame(it.text); const g = id && gameById(id); if (g) linkItem(it, g);
}
function linkItem(it, g, quiet) {
  applyDefaults(it, g); applyExtra(it, g);
  it.done = true; it.failed = false; it.doubt = false; delete it.rev; delete it.cands; it.gameId = g.id; it.igdbId = g.igdbId || 0; it.rawgId = g.rawgId || 0; DB.put('inboxItems', it);
  const pend = S.pending && S.pending.itemId === it.id ? S.pending : null, sc0 = S.tab === 'inbox' ? $('#view').scrollTop : null;
  if (pend) S.pending = null;
  if (quiet) return;
  toast('✓ Processed: ' + g.name); S.tab = 'inbox'; render();
  if (pend) restoreInbox(pend); else if (sc0 !== null) $('#view').scrollTop = sc0;
}
// возврат в разбор на то место, откуда открыли поиск
function restoreInbox(p) {
  const v = $('#view'); if (!v || !p) return; if (p.scroll) v.scrollTop = p.scroll;
  const row = p.itemId ? $('[data-id="' + p.itemId + '"]') : null; if (row && row.scrollIntoView) row.scrollIntoView({ block: 'center' });
}
function backToInbox() { const p = S.pending; S.pending = null; S.tab = 'inbox'; render(); restoreInbox(p); }
function tryLinkPending(g) { const it = pendingItem(); if (!it) return false; if (bundleMode()) { const p = S.pending; (p.added || (p.added = [])).push(g.id); renderSearchBody(); return false; } linkItem(it, g); return true; } // в бандле игры добавляются по одной, строка закрывается кнопкой «Строка разобрана»

/* ====================== Статистика ====================== */
// часы по годам и платформам, самые долгие игры, остаток; чистая функция для проверки
function statsHours(G) {
  const sum = (arr, key) => { const m = new Map(); arr.forEach(g => { const k = key(g); if (k == null) return; m.set(k, (m.get(k) || 0) + (g.time || 0)); }); return m; };
  const r1 = x => Math.round(x * 10) / 10, undone = G.filter(g => !g.done), done = G.filter(g => g.done);
  const ent = m => Array.from(m.entries()).map(e => [e[0], r1(e[1])]).filter(e => e[1] > 0);
  const sumPl = arr => { const m = new Map(); arr.forEach(g => (g.platforms || []).forEach(pl => m.set(pl, (m.get(pl) || 0) + (g.time || 0)))); return m; }; // игра учитывается на каждой своей платформе
  return {
    byYear: ent(sum(done, g => g.doneDate ? g.doneDate.slice(0, 4) : 'no date')).sort((a, b) => String(b[0]).localeCompare(String(a[0]))),
    donePlat: ent(sumPl(done)).sort((a, b) => b[1] - a[1]), leftPlat: ent(sumPl(undone)).sort((a, b) => b[1] - a[1]),
    longest: G.filter(g => g.time > 0).sort((a, b) => b.time - a.time || a.name.localeCompare(b.name, LOC)).slice(0, 10),
    left: { n: undone.length, h: r1(undone.reduce((t, g) => t + (g.time || 0), 0)) }, noTime: G.filter(g => !(g.time > 0)).length
  };
}
function barList(title, entries, k) {
  const mx = Math.max(1, ...entries.map(e => e[1]));
  return '<h3>' + title + '</h3><div class="sec">' + (entries.length ? entries.map(e => '<div class="st-row' + (k ? ' link' : '') + '"' + (k ? ' data-act="statGo" data-k="' + k + '" data-v="' + esc(String(e[2] != null ? e[2] : e[0])) + '"' : '') + '><span class="st-l">' + esc(e[0]) + '</span><div class="st-b"><i style="width:' + Math.round(e[1] * 100 / mx) + '%"></i></div><b>' + (e[3] != null ? e[3] : e[1]) + '</b></div>').join('') : '<p class="sub">No data</p>') + '</div>';
}
function viewStats() {
  const G = S.games, done = G.filter(g => g.done), yr = String(new Date().getFullYear()), H = statsHours(G);
  const cnt = arr => { const m = new Map(); arr.forEach(x => { if (hasVal(x)) m.set(x, (m.get(x) || 0) + 1); }); return Array.from(m.entries()); };
  const top = (e, n) => e.sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), LOC)).slice(0, n);
  const doneYear = done.filter(g => g.doneDate && g.doneDate.slice(0, 4) === yr).length;
  const hours = Math.round(done.reduce((t, g) => t + (g.time || 0), 0));
  const card = (n, l, k) => '<div class="stc' + (k ? ' link' : '') + '"' + (k ? ' data-act="statGo" data-k="' + k + '"' : '') + '><b>' + n + '</b><span>' + l + '</span></div>';
  return '<div class="hdr2"><div style="display:flex;align-items:center;gap:10px"><button class="btn" data-act="tab" data-tab="settings">←</button><h2 style="font-size:20px">Statistics</h2></div></div>'
    + '<div class="stg">' + card(G.length, 'games in the catalog') + card(done.length + (G.length ? ' (' + Math.round(done.length * 100 / G.length) + '%)' : ''), 'completed', 'done') + card(doneYear, 'completed in ' + yr) + card(hours, 'hours (by playtime)') + '</div>'
    + barList('Completed by year', cnt(done.map(g => g.doneDate ? g.doneDate.slice(0, 4) : 'no date')).sort((a, b) => String(b[0]).localeCompare(String(a[0]))), 'done')
    + '<div class="stg">' + card(H.left.n, 'not completed') + card(H.left.h + ' h', 'left to complete (estimate)') + card(H.noTime, 'games without playtime') + '</div>'
    + barList('Hours of completed games by year', H.byYear.map(e => [e[0], e[1], e[0], e[1] + ' h']), '')
    + barList('Left to complete by platform, h', H.leftPlat.slice(0, 10).map(e => [shortPlat(e[0]), e[1], e[0], e[1] + ' h']), 'remainPlat')
    + barList('Completed by platform, h', H.donePlat.slice(0, 10).map(e => [shortPlat(e[0]), e[1], e[0], e[1] + ' h']), '')
    + barList('Longest games', H.longest.map(g => [g.name, g.time, g.id, g.time + ' h' + (g.done ? ' ✓' : '')]), 'game')
    + barList('Genres', top(cnt([].concat(...G.map(g => g.genres || []))), 10), 'genres') + barList('Platforms', top(cnt([].concat(...G.map(g => g.platforms || []))), 10), 'platforms')
    + barList('Release years', top(cnt(G.map(g => g.year || null)), 10), 'years') + barList('Collections', top(S.collections.map(c => [c.name, gamesIn(c.id).length, c.id]), 10), 'collections');
}

/* ====================== Серии ====================== */
function seriesGroups() { const m = new Map(); S.games.forEach(g => { const k = g.series || ''; if (!m.has(k)) m.set(k, []); m.get(k).push(g); }); return m; }
const SER_SORTS = [['alpha', 'Alphabetical (A → Z)'], ['-alpha', 'Alphabetical (Z → A)'], ['-count', 'By number of games (most first)'], ['count', 'By number of games (fewest first)'], ['-pct', 'By completion percentage (highest first)'], ['pct', 'By completion percentage (lowest first)'], ['-miss', 'Incomplete first (by the IGDB check)']];
const serKindSwitch = () => '<div class="kswitch"><button class="p' + (S.serKind !== 'fr' ? ' on' : '') + '" data-act="serKind" data-v="ser">Series</button><button class="p' + (S.serKind === 'fr' ? ' on' : '') + '" data-act="serKind" data-v="fr">Franchises</button></div>';
function seriesTilesHtml() {
  const m = seriesGroups(), q = normName(S.sFind), none = m.get('') || [];
  const so = S.set.serSort || 'alpha', desc = so.charAt(0) === '-', kind = so.replace('-', ''), alpha = (a, b) => a.localeCompare(b, LOC);
  const names = Array.from(m.keys()).filter(n => n && (!q || normName(n).includes(q)) && (!S.set.serOnlyInc || serMiss(n) > 0)).sort((a, b) => {
    const la = m.get(a), lb = m.get(b), r = kind === 'count' ? la.length - lb.length : kind === 'pct' ? donePct(la) - donePct(lb) || la.length - lb.length : kind === 'miss' ? serMiss(a) - serMiss(b) : alpha(a, b);
    return r ? (desc ? -r : r) : alpha(a, b);
  });
  const mk = (key, list, menu) => entryHtml('series', { act: 'serOpen', attr: 'name', key, name: key || 'No series', count: list.length, games: list, color: '', covers: list.filter(x => x.hasCover || x.coverUrl).slice(0, 4).map(coverSrc).filter(Boolean), lpm: 'ser', badge: key ? serBadge(key) : '' });
  return ((!q || 'no series'.includes(q)) ? mk('', none, false) : '') + names.map(n => mk(n, m.get(n), true)).join('') || '<p class="hint">Nothing found</p>';
}
function viewSeries() {
  const hasNames = Array.from(seriesGroups().keys()).some(Boolean);
  return '<div class="top"><div class="hdr2"><h2>' + serKindSwitch() + '</h2>' + modeBtns('series') + '</div>'
    + '<div class="bar"><div class="sbox"><span>🔍</span><input id="sfind" placeholder="Search series" value="' + esc(S.sFind) + '"></div></div>'
    + (hasNames ? serToolbar(false) : '')
    + '</div><div class="scrl">' + dupBanner('series')
    + boxHtml('series', seriesTilesHtml())
    + (hasNames ? '<p class="sub" style="text-align:center;margin-top:12px">Long-press a series: export, rename or remove</p>' : '')
    + (hasNames ? '' : '<p class="hint">No series yet. They appear when a game has a series: it is filled in automatically when adding from IGDB, and you can type it in manually on the game card.</p>') + '</div>';
}
async function serMenu(name) {
  if (!name) { const r0 = await choose({ title: 'No series', items: [{ id: 'export', label: 'Export the list…' }] }); if (r0 === 'export') openExport(S.games.filter(g => !g.series), 'No series'); return; }
  const r = await choose({ title: name, items: [{ id: 'check', label: 'Check series completeness in IGDB' }, { id: 'ok', label: serMap('serOk')[serKey(name)] ? 'Remove the “series complete” mark' : 'Mark the series complete (the rest is not needed)' }, { id: 'export', label: 'Export the list…' }, { id: 'catalog', label: 'Show the series games in the list' }, { id: 'rename', label: 'Rename (or merge with another series)' }, { id: 'del', label: 'Remove the series from all games (the games stay)' }] });
  const games = S.games.filter(g => g.series === name), f = S.set.f;
  if (r === 'export') return openExport(games, name);
  if (r === 'check') { if (S.tab !== 'sercard') S.retGame = null; return showSeriesView(name, { from: S.tab === 'sercard' ? 'sercard' : 'series', onlyMiss: true }); }
  if (r === 'catalog') return serInLibrary(name);
  if (r === 'ok') { const m = serMap('serOk'), k = serKey(name); if (m[k]) delete m[k]; else m[k] = 1; saveSet(); render(); return toast(m[k] ? 'Series marked as complete' : 'Mark removed'); }
  if (r === 'rename') {
    let n = await promptBox('Series name', name); if (n) n = normName(n) === normName(name) ? n.trim() : canonSeries(n);
    if (n && n !== name) { const snap = takeSnap(); for (const g of games) g.series = n; await saveGames(games); f.series = f.series.map(x => x === name ? n : x); serMigrate(name, n); if (S.serCard && serKey(S.serCard.name) === serKey(name)) S.serCard.name = n; saveSet(); render(); toastUndo('Series renamed', snap); }
  }
  if (r === 'del' && await confirmBox('Remove the series “' + name + '” from games: ' + games.length + '? The games themselves stay in the catalog.', 'Remove')) {
    const snap = takeSnap(); for (const g of games) g.series = ''; await saveGames(games); f.series = f.series.filter(x => x !== name); saveSet(); render(); toastUndo('Series removed from games: ' + games.length, snap);
  }
}

/* ====================== Поиск IGDB ====================== */
function searchFilterCount() { const f = S.search.f; return (fa(f, 'genres').length ? 1 : 0) + (fa(f, 'platforms').length ? 1 : 0) + (fa(f, 'years').length ? 1 : 0) + (f.minRating ? 1 : 0) + (S.search.src === 'igdb' && typesCustom() ? 1 : 0); }
// метка источника: цветная рамка, со ссылкой на страницу игры, если она известна
function srcBadge(src, url) {
  const c = PROV[src].color, st = 'color:' + c + ';border-color:' + c;
  return url ? '<a class="srcb" style="' + st + '" data-act="openUrl" data-u="' + esc(url) + '">' + PROV[src].name + ' ↗</a>' : '<span class="srcb" style="' + st + '">' + PROV[src].name + '</span>';
}
function viewSearch() {
  const pit = pendingItem();
  const banner = pit ? '<div class="banner">Inbox: “' + esc(pit.text) + '” - choose a game<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="pendingMatch">Already in the database</button><button class="btn" data-act="pendingCancel">Cancel</button></div></div>' : '';
  const retOk = !!(S.retGame && gameById(S.retGame.id)), ret = retOk ? '<div class="banner">Search from the card “' + esc(gameById(S.retGame.id).name) + '»<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="retGame">← Back to the card</button></div></div>' : '';
  if (S.search.mode === 'series' && S.search.chk) return '<div class="top">' + banner + blockBanner(true, 'igdb') + '<div class="hdr2" style="margin:6px 0 8px"><button class="btn" data-act="sBack">' + (retOk ? '← Back to the card' : '← Back') + '</button></div><div class="serttl" id="serTtl"></div><div id="sTypes"></div></div><div class="scrl" id="srBody"></div>'; // экран серии: без строки поиска и панели кнопок, одна кнопка возврата
  return '<div class="top">' + banner + ret + blockBanner(true, S.search.src) + (S.search.bind ? '<div class="banner">Pick the IGDB series for “' + esc(S.search.bind) + '»<div class="toolbar" style="margin:8px 0 0"><button class="btn" data-act="serBindCancel">Cancel</button></div></div>' : '') + '<div class="bar"><div class="sbox"><span>🔍</span><input id="sq" placeholder="' + (S.search.kind === 'series' ? 'Search a series in IGDB' : S.search.kind === 'franchise' ? 'Search a franchise in IGDB' : 'Search in ' + PROV[S.search.src].name) + '" value="' + esc(S.search.q) + '"><button class="x" data-act="clearSQ">✕</button></div></div>'
    + '<div class="tools" id="sTools"></div><div class="chips actv" id="sActive"></div><div id="sTypes"></div></div><div class="scrl" id="srBody"></div>';
}
// кнопка быстрого переключения типов карточек IGDB: «Игры» (игры, ремейки, бандлы) <-> «Все»
function typeQuickBtn() {
  if (S.search.src !== 'igdb') return '';
  const m = chipMode();
  return '<button class="ib tq' + (m ? ' on' : '') + '" data-act="typeQuick" title="Type chips: ' + (m === 0 ? 'off' : m === 1 ? 'all' : 'selected in the filter') + '" aria-label="Type chips"><svg viewBox="0 0 24 24">' + ICONS.tag + '</svg><span class="lbl">Types</span></button>';
}
function renderSearchHead() {
  setTimeout(bindScrollBtns, 60);
  const s = S.search, f = s.f, chips = [], fc = searchFilterCount();
  const kindBtn = ib('sKind', s.kind === 'series' ? 'layers' : s.kind === 'franchise' ? 'fran' : 'pad', s.kind === 'series' ? 'Searching series' : s.kind === 'franchise' ? 'Searching franchises' : 'Searching games', s.kind !== 'games', '', ' aria-label="Switch the search: games, series, franchises"');
  const srcBtn = '<button class="ib srcsw" data-act="sSrcSwitch" title="Switch the search source" style="color:' + PROV[s.src].color + ';border-color:' + PROV[s.src].color + '"><b>' + PROV[s.src].name + '</b></button>';
  const t = $('#sTools'); if (t && s.kind !== 'games') t.innerHTML = kindBtn; else if (t) t.innerHTML = srcBtn + kindBtn + ib('sFilters', 'filter', 'Filters', fc > 0, fc ? '<span class="cnt">' + fc + '</span>' : '') + typeQuickBtn() + sortBtn() + ib('vmode', vmodeOf('search') === 'list' ? 'grid' : 'list', vmodeOf('search') === 'list' ? 'Tile' : 'List', false, '', ' data-k="search"') + zoomBtn(vmodeOf('search') === 'tiles' ? 'search' : 'searchL');
  fa(f, 'genres').forEach((id, i) => chips.push('<button class="chip" data-act="sRm" data-k="genres" data-v="' + esc(id) + '">' + esc((f.genreNames || [])[i] || id) + ' ✕</button>'));
  fa(f, 'platforms').forEach((id, i) => chips.push('<button class="chip" data-act="sRm" data-k="platforms" data-v="' + esc(id) + '">' + esc((f.platformNames || [])[i] || id) + ' ✕</button>'));
  fa(f, 'years').forEach(y => chips.push('<button class="chip" data-act="sRm" data-k="years" data-v="' + esc(y) + '">' + esc(y) + ' ✕</button>'));
  if (s.src === 'igdb' && typesCustom()) chips.push('<button class="chip" data-act="sRm" data-k="types">Types: ' + searchTypes().length + ' ✕</button>');
  if (f.minRating) chips.push('<button class="chip" data-act="sRm" data-k="minRating">from ★' + f.minRating + ' ✕</button>');
  const a = $('#sActive'); if (a) a.innerHTML = s.kind !== 'games' ? '' : chips.join('');
  const st = $('#serTtl'); if (st) st.textContent = s.mode === 'series' && s.chk ? 'Series: ' + s.chk.name : '';
  const tc = $('#sTypes'); if (tc) { const th = typeCountsHtml(); tc.innerHTML = th; tc.style.display = th ? 'flex' : 'none'; }
}
function renderSearchBody() {
  const s = S.search, el = $('#srBody'); if (!el) return;
  renderSearchHead();
  if ((s.kind === 'series' || s.kind === 'franchise') && s.mode === 'search') { el.innerHTML = s.kind === 'franchise' ? frColListHtml() : colListHtml(); return; }
  let h = '';
  if (s.mode === 'series' && s.chk) h += s.chk.kind === 'fr' ? frHeadHtml() : serHeadHtml();
  else if (s.mode === 'series') h += '<div class="hdr2"><h2 style="font-size:17px">Series games: ' + esc(s.title) + '</h2><button class="btn" data-act="sBack">← Back</button></div>';
  const serEmpty = !!(s.chk && s.mode === 'series' && !s.loading && !s.results.length);
  if (s.mode === 'bundle') {
    const pi = S.pending && pendingItem(), na = pi ? ((S.pending.added || []).length) : 0;
    h += '<div class="hdr2"><h2 style="font-size:17px">Bundle: ' + esc(s.title) + '</h2><button class="btn" data-act="sBack">← Back</button></div><p class="sub" style="margin:0 2px 8px">'
      + (s.loading ? 'Loading contents…' : s.results.length > 1 ? 'Games inside: ' + (s.results.length - 1) + '. The bundle itself comes first. Each card can be opened, swiped through and added separately.' : 'IGDB does not list the contents of this bundle.') + '</p>'
      + (pi ? '<div class="toolbar"><button class="btn acc" data-act="bundleDone">✓ Row resolved' + (na ? ' (added: ' + na + ')' : '') + '</button></div>' : '');
  }
  if (blockFor(s.src)) h += blockBanner(true, s.src);
  else if (!PROV[s.src].ready()) h += '<div class="hint">' + PROV[s.src].noKeys + '<br><br><button class="btn acc" data-act="tab" data-tab="settings">Open settings</button></div>';
  else if (serEmpty) h += s.chk.col ? '<div class="hint">' + (s.chk.onlyMiss ? 'All games of the series of the selected types are already in the catalog.' : 'IGDB has no games of this series of the selected types. Turn on the types you need with the buttons above.') + '</div>' : '';
  else if (s.results.length && !viewRes().length) h += '<div class="hint">None of the loaded results are of the selected types.</div>';
  else if (!s.results.length && !s.loading) h += '<div class="hint">' + (s.started ? 'Nothing found in ' + PROV[s.src].name + '.<br><br><button class="btn" data-act="sSrcSwitch">Search in ' + PROV[otherSrc(s.src)].name + '</button>' : 'Enter a game title or choose filters') + '</div>' + (s.started ? '' : recentHtml());
  else {
    const row = vmodeOf('search') === 'list', vr = viewRes();
    h += row ? '<div class="srl z' + colsFor('searchL') + '">' + vr.map(it => {
      const inCat = !!gameByRid(it.rid) || !!it.have, pk = (s.sel && s.sel.has(it.rid) ? ' pick' : '') + (it.ign ? ' dim' : ''), ck = pk.includes('pick') ? '<span class="selck">✓</span>' : '';
      return '<div class="srow' + (it.rid === s.lastRid ? ' last' : '') + pk + '" data-act="igdbTap" data-rid="' + it.rid + '">' + ck + '<div class="sth"' + (it.cover ? ' style="background-image:url(\'' + bgu(thumbUrl(it.cover)) + '\')"' : '') + '></div><div class="sm"><div class="nm">' + esc(it.name) + '</div><div class="m">' + typeChip(it.type) + meta(it) + (it.time ? ' · ⏱ ' + it.time + 'h' : '') + '</div></div>' + (inCat ? '<span class="ok2">✓</span>' : '') + (isBundleType(it.type) ? bbadge(it.rid) : '') + '</div>';
    }).join('') + '</div>' : '<div class="grid z' + colsFor('search') + '" style="--cols:' + colsFor('search') + '">' + vr.map(it => {
      const inCat = !!gameByRid(it.rid) || !!it.have, pk = (s.sel && s.sel.has(it.rid) ? ' pick' : '') + (it.ign ? ' dim' : ''), ck = pk.includes('pick') ? '<span class="selck">✓</span>' : '';
      return '<div class="card' + (it.rid === s.lastRid ? ' last' : '') + pk + '" data-act="igdbTap" data-rid="' + it.rid + '">' + ck + '<div class="cv' + (it.cover ? '' : ' nocover') + '"' + (it.cover ? ' style="background-image:url(\'' + bgu(thumbUrl(it.cover)) + '\')"' : '') + '>'
        + typeChip(it.type) + (isBundleType(it.type) ? bbadge(it.rid) : '') + (inCat ? '<span class="ok">✓</span>' : '')
        + (it.year ? '<span class="ovl yr">' + it.year + '</span>' : '')
        + (it.rating || it.time ? '<span class="ovr">' + (it.rating ? '<span class="ovl"><i>★</i>' + it.rating + '</span>' : '') + (it.time ? '<span class="ovl tm">⏱ ' + it.time + 'h</span>' : '') + '</span>' : '')
        + '</div><div class="t">' + esc(it.name) + '</div><div class="m">' + esc((it.platforms || []).slice(0, 2).map(shortPlat).join(', ')) + '</div></div>';
    }).join('') + '</div>';
    h += '<div class="status">' + (s.loading ? 'Loading…' : (s.count ? 'Found: ' + s.count + ', shown: ' + vr.length : '')) + '</div>';
  }
  if (s.loading && !s.results.length) h += '<div class="status">Loading…</div>';
  const more = s.mode === 'search' && s.kind === 'games' && s.hasMore && s.results.length; // новые игры подгружаются только по кнопке в конце списка; пока кнопки не видно, в углу стрелка вниз
  if (more) h += '<div class="moreDn hidden" id="moreDn"><button class="dn" data-act="sMoreDown" title="Down to the “Load more” button" aria-label="Down to the “Load more” button">↓</button></div><div class="moreEnd"><button class="btn acc" id="moreBtn" data-act="sMore"' + (s.loading ? ' disabled' : '') + '>' + (s.loading ? 'Loading…' : 'Load more') + '</button></div>';
  el.innerHTML = h;
  if (S.moreIO) { try { S.moreIO.disconnect(); } catch (e) { /* уже отключён */ } S.moreIO = null; }
  const mb = more && $('#moreBtn'), dn = more && $('#moreDn');
  if (mb && dn && typeof IntersectionObserver === 'function') { S.moreIO = new IntersectionObserver(en => { dn.classList.toggle('hidden', !!en[0] && en[0].isIntersecting); }, { root: $('#srBody') }); S.moreIO.observe(mb); }
  else if (dn) dn.classList.remove('hidden');
}
// сортировка результатов поиска: IGDB не умеет сортировать запрос с поисковой строкой, поэтому сортируется уже загруженный список (порядок источника запоминается в _o)
const SEARCH_SORTS = [['rel', 'By relevance (as in the source)'], ['name', 'By name (A → Z)'], ['-name', 'By name (Z → A)'], ['-year', 'By year (newest first)'], ['year', 'By year (oldest first)'], ['-rating', 'By rating (highest first)'], ['rating', 'By rating (lowest first)'], ['-time', 'By playtime (longest first)'], ['time', 'By playtime (shortest first)']];
function sortResults() {
  const s = S.search, so = S.set.searchSort || 'rel'; if (s.mode && s.mode !== 'search') return;
  const desc = so.charAt(0) === '-', k = so.replace('-', ''), ord = (a, b) => (a._o || 0) - (b._o || 0);
  const val = x => k === 'name' ? String(x.name || '').toLowerCase() : k === 'year' ? (+x.year || 0) : k === 'rating' ? (+x.rating || 0) : (+x.time || 0);
  s.results.sort((a, b) => {
    if (k === 'rel') return ord(a, b);
    const va = val(a), vb = val(b), ma = k !== 'name' && !va, mb = k !== 'name' && !vb;
    if (ma !== mb) return ma ? 1 : -1; // игры без года, рейтинга или времени всегда в конце
    const r = k === 'name' ? va.localeCompare(vb, LOC) : va - vb;
    return r ? (desc ? -r : r) : ord(a, b);
  });
}
const sortBtn = () => S.search.mode && S.search.mode !== 'search' ? '' : ib('sSort', 'sort', 'Sort results', (S.set.searchSort || 'rel') !== 'rel');
function recentHtml() {
  const r = S.set.recentQ || []; if (!r.length) return '';
  return '<div class="recent"><div class="sub">Recent searches</div><div class="chips">' + r.map(q => '<button class="chip" data-act="recentQ" data-q="' + esc(q) + '">' + esc(q) + '</button>').join('') + '<button class="chip gray" data-act="recentClear">Clear ✕</button></div></div>';
}
function pushRecent(q) { const r = (S.set.recentQ || []).filter(x => x.toLowerCase() !== q.toLowerCase()); r.unshift(q); S.set.recentQ = r.slice(0, 8); saveSet(); }
async function runSearch(reset) {
  const s = S.search;
  if (reset) { s.stack = []; s.bundle = null; s.results = []; s.lastRid = ''; s.page = 0; s.hasMore = true; s.count = 0; s.token++; s.loading = false; s.mode = 'search'; s.tf = []; s.chk = null; s.sel = new Set(); s.selMode = false; const sb = $('#srBody'); if (sb) sb.scrollTop = 0; }
  if (s.kind === 'series') return reset ? runColSearch() : undefined;
  if (s.kind === 'franchise') return reset ? frRunColSearch() : undefined;
  if (s.loading || !s.hasMore) return;
  const f = s.f;
  if (!s.q.trim() && !hasSearchFilter(f)) { s.started = false; s.results = []; renderSearchBody(); return; }
  if (!PROV[s.src].ready()) { renderSearchBody(); return; }
  const token = s.token; s.loading = true; s.started = true; renderSearchBody();
  try {
    let added = 0, tries = 0;
    do { // с фильтром по рейтингу страница может оказаться почти пустой - добираем следующие
      const d = await (s.src === 'rawg' ? rawgPage : igdbPage)(s.q.trim(), f, s.page);
      if (token !== s.token) return;
      s.count = d.count || s.count; s.page++; s.hasMore = !!d.next;
      const ysf = fa(f, 'years').map(Number), items = d.results.map(mapItem).filter(x => x.rating >= f.minRating && (!ysf.length || !x.year || ysf.includes(x.year))); items.forEach((x, i) => { x._o = s.results.length + i; }); s.results.push(...items); added += items.length; tries++;
    } while (f.minRating && added < 12 && s.hasMore && tries < 5);
    if (token === s.token) sortResults();
    if (token === s.token && s.q.trim().length >= 2 && s.results.length) pushRecent(s.q.trim());
  } catch (e) { if (token === s.token) { toast(e.message); s.hasMore = false; } }
  finally { if (token === s.token) { s.loading = false; renderSearchBody(); } }
}
// перед входом в серию или бандл запоминаем результаты, положение и подсветку: «назад» возвращает основной поиск без нового запроса
function pushSearchState() {
  const s = S.search, sb = $('#srBody'); if (!s.started && !s.results.length) return false;
  (s.stack || (s.stack = [])).push({ mode: s.mode, title: s.title, bundle: s.bundle, q: s.q, src: s.src, results: s.results, count: s.count, hasMore: s.hasMore, page: s.page, started: s.started, lastRid: s.lastRid, kind: s.kind, tf: s.tf, cols: s.cols, chk: s.chk, sel: s.sel, selMode: s.selMode, scroll: sb ? sb.scrollTop : 0 });
  return true;
}
function popSearchState() {
  const s = S.search, st = s.stack && s.stack.pop(); if (!st) return false;
  s.token++; s.loading = false; const sc = st.scroll; delete st.scroll; Object.assign(s, st); S.tab = 'search'; closeSheet(); render();
  const sb = $('#srBody'); if (sb) sb.scrollTop = sc || 0; if (s.lastRid) markFoundLast(s.lastRid, false);
  return true;
}
const bundleMode = () => S.search.mode === 'bundle';
// экран бандла: сам бандл и игры внутри него в обычном списке поиска (карточки, свайп, добавление), «назад» возвращает основной поиск
async function showBundle(rid, title, fresh) {
  const s = S.search, { id } = parseRid(rid); if (fresh) s.stack = []; else if (pushSearchState()) s.stack[s.stack.length - 1].lastRid = rid; // после «назад» бандл подсвечен в списке
  const hit = detFresh(rid), first = s.results.find(x => x.rid === rid) || (hit ? mapItem(hit.d) : null);
  s.src = 'igdb'; s.token++; const token = s.token; s.mode = 'bundle'; s.title = title; s.bundle = { rid, name: title }; s.results = first ? [first] : []; s.hasMore = false; s.loading = true; s.started = true; s.count = 0; s.lastRid = rid; S.tab = 'search'; closeSheet(); render();
  try {
    const [list, self] = await Promise.all([bundleGames(id), first ? Promise.resolve(first) : igdb('/games', 'fields ' + IGDB_FIELDS + '; where id = ' + (+id) + ';').then(r => { r.forEach(x => { x._src = 'igdb'; }); return r[0] ? mapItem(r[0]) : null; })]);
    if (token !== s.token) return;
    s.results = (self ? [self] : []).concat(list.filter(x => x.rid !== rid)); s.count = s.results.length;
  } catch (e) { logErr('bundle contents', e); if (token === s.token) toast(e.message); }
  if (token === s.token) { s.loading = false; renderSearchBody(); }
}
async function showSeries(rid, title) {
  if (!S.retGame && pushSearchState()) S.search.stack[S.search.stack.length - 1].lastRid = rid;
  const s = S.search, { src, id } = parseRid(rid); s.bundle = null; s.src = src; s.token++; s.mode = 'series'; s.title = title; s.results = []; s.hasMore = false; s.loading = true; s.started = true; S.tab = 'search'; closeSheet(); render();
  try {
    if (src === 'rawg') { const d = await rawg('/games/' + id + '/game-series', { page_size: 40 }); d.results.forEach(x => { x._src = 'rawg'; }); s.results = d.results.map(mapItem); s.count = d.count; }
    else {
      const { d } = await fetchDetails(rid), col = await primaryCollection(d.collections || []);
      const list = col ? await igdb('/games', 'fields ' + IGDB_FIELDS + '; where collections = (' + col.id + ') & id != ' + id + ' & ' + GAME_TYPES + '; limit 40;') : [];
      list.forEach(x => { x._src = 'igdb'; }); await attachTimes(list); s.results = list.map(mapItem); s.count = list.length;
    }
  } catch (e) { toast(e.message); }
  s.loading = false; renderSearchBody();
}
// найденная игра в результатах: последняя открытая подсвечена, список прокручивается за карточкой (как в библиотеке)
function markFoundLast(rid, follow) {
  S.search.lastRid = rid;
  $$('#srBody .last').forEach(e => e.classList.remove('last'));
  const el = $('#srBody .srow[data-rid="' + rid + '"], #srBody .card[data-rid="' + rid + '"]'), box = $('#srBody'); if (!el) return; el.classList.add('last');
  if (!el.scrollIntoView || !box) return;
  if (follow) el.scrollIntoView({ block: 'center', behavior: animOn() ? 'smooth' : 'auto' });
  else if (el.getBoundingClientRect && box.getBoundingClientRect) { const r = el.getBoundingClientRect(), bb = box.getBoundingClientRect(); if (r.top < bb.top + 30 || r.bottom > bb.bottom - 30) el.scrollIntoView({ block: 'center' }); }
}
let rsTok = 0; // номер последнего открытия карточки поиска: загрузки прежних карточек при быстром листании ничего не рисуют
async function openIgdbSheet(rid, keep, dir) {
  const tok = ++rsTok;
  if (!keep || !S.rs || S.rs.rid !== rid) {
    const carry = dir && S.rs ? S.rs.colls.slice() : null; // при листании карточек поиска отметки коллекций и «Завершено» остаются
    S.rs = { rid, colls: carry || [] }; const p0 = pendingItem(); // для строки разбора сразу отмечены коллекции и «Завершено» из настроек списка
    if (p0) { const e = effItem(p0); e.colls.forEach(id => { if (!S.rs.colls.includes(id)) S.rs.colls.push(id); }); if (e.markDone && !S.rs.colls.includes(DONE_ID)) S.rs.colls.push(DONE_ID); }
  }
  markFoundLast(rid, !!dir);
  const it = S.search.results.find(x => x.rid === rid) || { rid, src: parseRid(rid).src, name: '', platforms: [], genres: [] };
  const pit = bundleMode() ? null : pendingItem(), cat = () => gameByRid(rid), shown = {};
  const stale = () => tok !== rsTok || !sheetEl || sheetEl._key !== 'igdb' || !S.rs || S.rs.rid !== rid; // карточку уже закрыли или открыли другую
  const parts = (d, ser) => { // изменяемые части карточки: после загрузки подробностей заменяются на месте, без повторного открытия
    const c = cat(), cover = (d && (d._src === 'rawg' ? d.background_image : coverOf(d, 'cover_big'))) || it.cover, item = d ? mapItem(d) : it;
    return {
      hero: '<div class="cv' + (cover ? '' : ' nocover') + '"' + (cover ? ' style="background-image:url(\'' + bgu(thumbUrl(cover)) + '\')"' : '') + '></div><div style="flex:1;min-width:0"><h2>' + esc(item.name) + ' <span class="y">' + (item.year || '') + '</span></h2>'
        + '<div class="m" style="font-size:14px">' + (item.rating ? '<span class="st">★ ' + item.rating + '</span>' : '') + (item.time ? ' · ⏱ ' + item.time + ' h' : '') + '</div>'
        + (item.type != null && TYPE_CHIP[item.type] ? '<div style="margin-top:6px">' + typeChip(item.type, 'lg') + '</div>' : '')
        + (ser && ser.series ? '<div class="sub" style="margin-top:6px">Series: ' + esc(ser.series) + '</div>' : '') + (ser && ser.fr ? '<div class="sub" style="margin-top:2px">Franchise: ' + esc(ser.fr) + '</div>' : '') + '</div>',
      gen: (item.genres || []).map(x => '<span class="tag">' + esc(x) + '</span>').join(''),
      pl: (item.platforms || []).map(x => '<span class="tag m2">' + esc(x) + '</span>').join(''),
      src: srcBadge(parseRid(rid).src, c ? c[parseRid(rid).src + 'Url'] : '') + (c ? '<span class="sub">In the catalog</span>' : ''),
      tb: (c ? (S.rsFlash && S.rsFlash.rid === rid && Date.now() < S.rsFlash.until ? '<span class="added">✓ Added</span>' : '') + (pit ? '<button class="btn acc" data-act="rsLink" data-rid="' + rid + '">✓ Match with the Inbox row</button>' : '') + '<button class="btn" data-act="openGameFromIgdb" data-id="' + c.id + '">Open in the catalog</button>'
        : adding.has(rid) ? '<button class="btn acc" disabled><i class="spin"></i> Adding…</button>'
        : '<button class="btn acc" data-act="rsAdd" data-rid="' + rid + '">' + (pit ? '＋ Add and match' : '＋ Add to the catalog') + '</button>')
        + (isBundleType(item.type) || (ser && ser.bundle > 0) ? '<button class="btn" data-act="bundleOpen" data-rid="' + rid + '" data-t="' + esc(item.name) + '">Bundle games' + (ser && ser.bundle ? ' (' + ser.bundle + ')' : '') + '</button>' : '')
        + (ser && ser.count ? '<button class="btn" data-act="rsSeries" data-rid="' + rid + '" data-t="' + esc(ser.series || item.name) + '">Series games (' + ser.count + ')</button>' : '')
        + (ser && ser.frCount ? '<button class="btn" data-act="rsFranchise" data-rid="' + rid + '" data-id="' + ser.frId + '" data-t="' + esc(ser.fr) + '">Franchise games (' + ser.frCount + ')</button>' : '')
    };
  };
  let curD = null, curSer = null; // что показано сейчас: нужно, чтобы обновлять отдельные части (кнопка «Добавляю…», «В каталоге») без повторного открытия
  const draw = (d, ser, loading) => {
    curD = d; curSer = ser; const c = cat(), P = parts(d, ser); Object.assign(shown, P);
    sheetKey = 'igdb'; const sh = openSheet('<div class="shbody"><div class="hero" id="rsHero">' + P.hero + '</div>'
      + '<div class="rsload" id="rsLoad">' + (loading ? '<i class="spin"></i><span>Loading details…</span>' : '') + '</div>'
      + '<div class="chips" id="rsGen">' + P.gen + '</div>'
      + '<div class="chips" id="rsPl">' + P.pl + '</div>'
      + '<div class="srcrow" id="rsSrc">' + P.src + '</div>'
      + '<h3>Collections</h3><div class="chips shcolls" id="rsColls">'
      + (() => { const on = c ? c.done : S.rs.colls.includes(DONE_ID); return '<button class="p' + (on ? ' on' : '') + '" data-act="rsChip" data-id="' + DONE_ID + '">' + (on ? '✓ ' : '') + 'Completed</button>'; })()
      + sortedColls().map(k => '<button class="p' + ((c ? c.collections : S.rs.colls).includes(k.id) ? ' on' : '') + '" data-act="rsChip" data-id="' + k.id + '">' + esc(k.name) + '</button>').join('') + '<button class="p new" data-act="rsNewColl">＋ new</button></div>'
      + '<div class="toolbar" id="rsTb">' + P.tb + '</div>'
      + '<h3>Screenshots</h3><div id="shotsBox"><button class="btn" data-act="loadShots" data-rid="' + rid + '">View screenshots</button></div></div>'
      + (() => { const k = srcCtx(); return '<div class="sbar' + progCls() + '">' + sheetProgHtml(k) + '<button class="btn acc" data-act="closeSheet">Done</button>' + sheetNavHtml(k) + '<div class="smid">' + sheetCntHtml(k) + '</div><span style="width:44px"></span></div>'; })());
    sh.classList.add('gs'); attachSwipe(sheetEl); if (dir) sh.scrollTop = 0;
    { const bd = dir && animOn() && !openGameSheet.noAnim && sh.querySelector ? sh.querySelector('.shbody') : null; if (bd && bd.classList) bd.classList.add(dir > 0 ? 'swr' : 'swl'); }
  };
  const upd = () => { const P = parts(curD, curSer); [['rsHero', 'hero'], ['rsGen', 'gen'], ['rsPl', 'pl'], ['rsTb', 'tb'], ['rsSrc', 'src']].forEach(([id, k]) => { const e = $('#' + id); if (e && shown[k] !== P[k]) { e.innerHTML = P[k]; shown[k] = P[k]; } }); };
  S.rsRefresh = () => { if (!stale()) upd(); };
  const apply = r => { // подробности пришли: меняем только изменившиеся части
    if (stale()) return; curD = r.d; curSer = { series: r.series, count: r.seriesCount, bundle: r.bundleCount, fr: r.franchise, frId: r.franchiseId, frCount: r.franchiseCount }; upd();
    const l = $('#rsLoad'); if (l) l.innerHTML = '';
  };
  const hit = detFresh(rid);
  if (hit) { draw(hit.d, { series: hit.series, count: hit.seriesCount, bundle: hit.bundleCount, fr: hit.franchise, frId: hit.franchiseId, frCount: hit.franchiseCount }, false); return; }
  draw(null, null, true);
  try {
    if (dir) { await new Promise(r => setTimeout(r, 250)); if (stale()) return; } // при быстром листании запрос уходит только для карточки, на которой остановились
    apply(await fetchDetails(rid));
  } catch (e) { logErr('game details', e); if (!stale()) { const l = $('#rsLoad'); if (l) l.innerHTML = '<span class="rserr">Could not load: ' + esc(e.message) + '</span> <button class="btn" data-act="rsRetry">Retry</button>'; } }
}
async function loadShots(rid, save) {
  const box = $('#shotsBox'); if (!box) return;
  box.innerHTML = '<div class="status">Loading screenshots…</div>';
  try {
    const { src, id } = parseRid(rid); let list;
    if (src === 'rawg') { const r = await rawg('/games/' + id + '/screenshots', { page_size: 40 }); list = (r.results || []).map(x => ({ image: String(x.image).replace('/media/screenshots/', '/media/resize/640/-/screenshots/') })); }
    else { const r = await igdb('/screenshots', 'fields image_id; where game = ' + id + '; limit 40;'); list = r.map(x => ({ image: igdbImg(x.image_id, 'screenshot_big') })); }
    S.igdbShots = list.map(x => x.image);
    box.innerHTML = list.length ? (save ? '<div class="toolbar"><button class="btn" data-act="shotSaveAll">Save all to the database</button></div>' : '') + '<div class="shotv">' + list.map((x, i) => '<div class="shw"><span class="shph">Loading…</span><span class="sher" data-act="shotRetry">Failed to load. Tap to retry</span><img src="' + esc(src === 'rawg' ? x.image : sizeUrl(x.image, 'screenshot_med')) + '" data-act="shot" data-g="igdb" data-i="' + i + '" data-full="' + esc(x.image) + '" loading="lazy">' + (save ? '<button class="sv" data-act="shotSave" data-i="' + i + '">＋ Save</button>' : '') + '</div>').join('') + '</div>' : '<div class="status">No screenshots</div>';
    if (save) drawShots();
  } catch (e) { box.innerHTML = '<div class="status">' + esc(e.message) + '</div>'; }
}
async function openSearchFilters() {
  const f = S.search.f, row = (label, val, act) => '<div class="row" data-act="' + act + '"><span>' + label + '</span><span style="color:var(--mut)">' + (val || 'All') + ' ›</span></div>';
  openSheet('<div class="hdr2"><h2>Search filters</h2><button class="btn" data-act="sReset">Reset</button></div>' + row('Genres', fa(f, 'genreNames').join(', '), 'sfGenre') + row('Platforms', fa(f, 'platformNames').join(', '), 'sfPlatform') + row('Years', fa(f, 'years').join(', '), 'sfYear') + (S.search.src === 'igdb' ? row('IGDB card types', typesCustom() ? 'selected ' + searchTypes().length + ' of ' + IGDB_TYPES.length : 'default', 'sfTypes') : '') + (S.search.src === 'igdb' ? row('Type chips (the “selected” mode of the “Types” button)', typeChipsVis().length === ALL_TYPES.length ? 'all' : 'selected ' + typeChipsVis().length, 'sfChips') : '') + row('Min. rating (out of 10)', f.minRating ? '★' + f.minRating : '', 'sfRating') + row('Games in the result', String(S.set.pageSize || 40), 'sfPageSize')
    + '<button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Done</button>');
}

/* ====================== Синхронизация со своим сервером ====================== */
// Схема: у каждой записи есть время правки (mod), у удалённых записей время удаления. Устройство присылает серверу список
// «id -> время», сервер отвечает, что забрать, что отправить и что удалить; побеждает более поздняя правка записи целиком.
const SY = { busy: false, again: false, timer: null, last: 0, dirty: true };
async function pool(items, n, fn) { let i = 0; await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) await fn(items[i++]); })); } // несколько запросов одновременно, но не больше n
const syncOn = () => !!(S.set.sync && S.set.sync.url && S.set.sync.token && S.set.sync.on !== false);
const syncUrl = () => S.set.sync.url.replace(/\/+$/, '');
// адрес сервера из трёх полей: протокол, IP-адрес, порт
const addrOf = y => { const m = String(y.url || '').match(/^(https?):\/\/([^\/:]+)(?::(\d+))?/i); return m ? { scheme: m[1].toLowerCase(), host: m[2], port: m[3] || '' } : { scheme: y.scheme || 'http', host: '', port: '' }; };
const ipMask = v => { const parts = String(v).replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.').split('.').slice(0, 4).map(x => x.slice(0, 3)); return parts.join('.'); };
const addrRead = () => { const y = S.set.sync, host = ipMask((($('#syIp') || {}).value) || ''), port = String((($('#syPort') || {}).value) || '').replace(/\D/g, '').slice(0, 5), sc = y.scheme || 'http'; y.scheme = sc; return host ? sc + '://' + host + (port ? ':' + port : '') : ''; };
async function srv(path, body, ms) {
  const ac = typeof AbortController !== 'undefined' ? new AbortController() : null, tm = setTimeout(() => ac && ac.abort(), ms || 90000); let r;
  try { r = await fetch(syncUrl() + '/api/' + path, { method: 'POST', signal: ac ? ac.signal : undefined, headers: { 'Content-Type': 'application/json', 'X-Token': S.set.sync.token }, body: JSON.stringify(body || {}) }); }
  catch (e) { throw new Error(e && e.name === 'AbortError' ? 'The server did not respond in time' : 'No connection to the server: check the address, that the server is running and that the devices are on the same Wi-Fi network'); }
  finally { clearTimeout(tm); }
  if (r.status === 401) throw new Error('Wrong access code');
  if (r.status === 429) throw new Error('Too many wrong attempts, wait a few minutes');
  if (!r.ok) throw new Error('The server responded with an error ' + r.status);
  return r.json();
}
function syncStatus(t) { const e = $('#syncSt'); if (e) e.innerHTML = t; }
function syncStatusHtml() {
  const y = S.set.sync; if (y.url && y.token && y.on === false) return 'Server is off'; if (!syncOn()) return 'Not configured';
  if (y.err) return '<span style="color:#e5484d">⚠ ' + esc(y.err) + '</span>' + (y.last ? '<br>Last successful: ' + new Date(y.last).toLocaleString(LOC_DATE) : '');
  return y.last ? '✓ ' + new Date(y.last).toLocaleString(LOC_DATE) + (y.msg ? '<br>' + esc(y.msg) : '') : 'Not synchronized yet';
}
function syncSoon(ms) {
  if (!syncOn() || !S.set.sync.auto) return;
  clearTimeout(SY.timer); SY.timer = setTimeout(() => syncNow(false), ms || 8000);
}
function mergeDict(loc, rem) { // объединение общих списков: ничего не теряем ни с одной стороны
  let ch = false; Object.keys(rem || {}).forEach(k => {
    const r = rem[k] || {}, l = loc[k];
    if (!l) { loc[k] = { long: r.long || '', aliases: (r.aliases || []).slice() }; ch = true; return; }
    if (!l.long && r.long) { l.long = r.long; ch = true; }
    (r.aliases || []).forEach(a => { l.aliases = l.aliases || []; if (!l.aliases.includes(a)) { l.aliases.push(a); ch = true; } });
  });
  return ch;
}
async function syncApply(s, recs) { // принять записи с сервера
  const out = [];
  for (const r of recs) {
    if (s === 'covers') { if (!r.data) continue; out.push({ id: r.id, mod: r.mod, blob: dataUrlToBlob(r.data) }); if (coverCache.has(r.id)) { URL.revokeObjectURL(coverCache.get(r.id)); coverCache.delete(r.id); } }
    else if (s === 'shots') {
      const loc = await DB.get('shots', r.id), have = new Map(((loc && loc.list) || []).map(x => [x.n, x.blob])), got = new Map();
      await pool((r.list || []).filter(x => !have.get(x.n)), 3, async x => { const d = await srv('shotblob', { gid: r.id, n: x.n }); if (d && d.data) got.set(x.n, dataUrlToBlob(d.data)); });
      const list = (r.list || []).map(x => ({ n: x.n, src: x.src || '', blob: have.get(x.n) || got.get(x.n) })).filter(x => x.blob);
      out.push({ id: r.id, mod: r.mod, list });
    } else out.push(r);
  }
  await DB.putManyRaw(s, out);
  const gone = out.filter(r => DB.tombs.has(s + ':' + r.id)); gone.forEach(r => DB.tombs.delete(s + ':' + r.id));
  if (gone.length) await DB.tx('tomb', 'readwrite', o => { gone.forEach(r => o.delete(s + ':' + r.id)); });
  return out.length;
}
async function syncNow(manual) {
  if (!syncOn()) { if (manual) toast('Enter the server address and access code'); return false; }
  if (SY.busy) { SY.again = true; return false; }
  SY.busy = true; SY.last = Date.now(); syncStatus('Synchronizing…');
  const y = S.set.sync, st = { pull: 0, push: 0, del: 0 }, SKIP = { skip: 1 }; let changed = false, ok = false, skipped = false, hrev = -1;
  try {
    const t0 = Date.now(), h = await srv('hello', {}, 15000), t1 = Date.now();
    if (!h || h.app !== 'game-catalog-server') throw new Error('This address is not a Game Catalog server');
    clockOff = Math.round(h.now - (t0 + t1) / 2); y.off = clockOff; y.igdb = !!h.igdb;
    hrev = h.rev === undefined ? -1 : h.rev;
    if (!manual && !SY.dirty && h.rev !== undefined && h.rev === y.rev) { y.err = ''; y.last = Date.now(); ok = true; skipped = true; throw SKIP; } // ничего не менялось: полную сверку не делаем
    SY.dirty = false;
    const items = {}, tombs = {};
    for (const s of SYNC_ARR) { items[s] = await DB.mods(s); tombs[s] = {}; }
    DB.tombs.forEach((t, k) => { const i = k.indexOf(':'), s = k.slice(0, i); if (tombs[s]) tombs[s][k.slice(i + 1)] = t; });
    const plan = await srv('manifest', { items, tombs });
    // 1) удаления, сделанные на других устройствах
    for (const s of SYNC_ARR) {
      const d = (plan.del || {})[s] || {}, ids = Object.keys(d); if (!ids.length) continue;
      for (const id of ids) { await DB.delRaw(s, id); DB.tombs.set(s + ':' + id, d[id]); await DB.putRaw('tomb', { id: s + ':' + id, s, rid: id, t: d[id] }); if (s === 'covers' && coverCache.has(id)) { URL.revokeObjectURL(coverCache.get(id)); coverCache.delete(id); } }
      st.del += ids.length; changed = true;
    }
    // 2) новое и изменённое на сервере
    const CH = { covers: 12, shots: 40 };
    for (const s of SYNC_ARR) {
      const ids = (plan.pull || {})[s] || [], n = CH[s] || 200;
      for (let i = 0; i < ids.length; i += n) { const r = await srv('get', { store: s, ids: ids.slice(i, i + n) }); st.pull += await syncApply(s, r.recs || []); changed = true; }
    }
    // 3) новое и изменённое здесь
    for (const s of SYNC_ARR) {
      const ids = (plan.push || {})[s] || []; if (!ids.length) continue;
      if (s === 'covers') {
        let batch = [], size = 0;
        const flush = async () => { if (batch.length) { await srv('put', { store: s, recs: batch }); st.push += batch.length; batch = []; size = 0; } };
        for (const id of ids) { const r = await DB.get('covers', id); if (!r || !r.blob) continue; const data = await blobToDataUrl(r.blob); batch.push({ id, mod: r.mod || 1, data }); size += data.length; if (size > 1.5e6) await flush(); }
        await flush();
      } else if (s === 'shots') {
        for (let i = 0; i < ids.length; i += 40) {
          const recs = [], loc = new Map();
          for (const id of ids.slice(i, i + 40)) { const r = await DB.get('shots', id); if (!r) continue; loc.set(id, r); recs.push({ id, mod: r.mod || 1, list: (r.list || []).map(x => ({ n: x.n, src: x.src || '' })) }); }
          const res = await srv('put', { store: s, recs }); st.push += recs.length;
          const up = []; for (const gid of Object.keys(res.need || {})) for (const n of res.need[gid]) { const it = ((loc.get(gid) || {}).list || []).find(x => x.n === n); if (it && it.blob) up.push({ gid, n, blob: it.blob }); }
          await pool(up, 3, async u => { await srv('shotblob_put', { gid: u.gid, n: u.n, data: await blobToDataUrl(u.blob) }); });
        }
      } else {
        for (let i = 0; i < ids.length; i += 200) {
          const recs = []; for (const id of ids.slice(i, i + 200)) { const r = await DB.get(s, id); if (r) { r.mod = r.mod || 1; recs.push(r); } }
          await srv('put', { store: s, recs }); st.push += recs.length;
        }
      }
    }
    // 4) общие списки платформ и жанров
    const dr = await srv('dicts', { plat: S.set.platDict, genre: S.set.genreDict });
    if (mergeDict(S.set.platDict, dr.plat) | mergeDict(S.set.genreDict, dr.genre)) { S._pi = S._gi = null; changed = true; }
    y.err = ''; y.last = Date.now();
    y.msg = st.pull || st.push || st.del ? 'Received: ' + st.pull + ', sent: ' + st.push + (st.del ? ', deleted: ' + st.del : '') : 'Everything is up to date';
    y.rev = st.push || st.del ? -1 : hrev; // после своих отправок на сервере появились новые изменения: следующий обмен проверит всё
    ok = true;
  } catch (e) { if (e !== SKIP) { y.err = e.message || String(e); SY.dirty = true; logErr('sync', e); } }
  SY.busy = false; if (!skipped) saveSet();
  if (changed) { try { await reloadData(); await canonAll(); } catch (e) { logErr('data refresh after sync', e); } if (!S.sheet && S.tab !== 'settings') renderKeep(); }
  if (!skipped) syncStatus(syncStatusHtml());
  if (manual) toast(ok ? 'Sync: ' + y.msg : y.err);
  if (SY.again) { SY.again = false; syncSoon(1500); }
  return ok;
}
async function detectLocalServer() { // приложение открыто с самого сервера: адрес подставляем сами
  try {
    if (isNative() || !/^https?:$/.test(location.protocol)) return;
    const r = await fetch('/api/hello', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); if (!r.ok) return;
    const h = await r.json(); if (!h || h.app !== 'game-catalog-server') return;
    S.localServer = location.origin;
    if (!S.set.sync.url) { S.set.sync.url = location.origin; saveSet(); if (S.tab === 'settings') render(); }
  } catch (e) { /* не наш сервер, это нормально */ }
}
async function downloadServerZip() { // архив лежит внутри приложения (apk) и на странице приложения в интернете
  const name = LANG === 'en' ? 'game-catalog-server-en.zip' : 'game-catalog-server.zip'; let b = null;
  try { const r = await fetch(name, { cache: 'no-store' }); if (r.ok) { const x = await r.blob(), h = new Uint8Array(await x.slice(0, 2).arrayBuffer()); if (x.size > 5000 && h[0] === 0x50 && h[1] === 0x4b) b = x; } } catch (e) { /* нет архива */ }
  if (!b) { toast('This version does not include the archive: download it from the app\'s web page'); return; }
  const FS = plug('Filesystem'), SH = plug('Share');
  if (isNative() && FS && SH) { try { const r = await FS.writeFile({ path: name, data: await blobToBase64(b), directory: 'CACHE' }); await SH.share({ title: 'Game Catalog: server archive', url: r.uri, dialogTitle: 'Send the archive to your computer' }); } catch (e) { toast('Could not share: ' + (e.message || e)); } return; }
  dl(name, b);
}
async function openGuide() {
  let html = '';
  try { const r = await fetch(LANG === 'en' ? 'guide.en.html' : 'guide.html'); if (r.ok) html = await r.text(); } catch (e) { /* ignore */ }
  openSheet('<div class="hdr2"><h2>Own server: guide</h2></div><div class="toolbar"><button class="btn acc" data-act="srvZip">⬇ Download the server archive</button></div><div class="guide">' + (html || '<p class="sub">Could not load the guide.</p>') + '</div><button class="btn acc" style="width:100%;margin-top:14px" data-act="closeSheet">Close</button>');
}

/* ====================== Настройки ====================== */
function syncHtml() {
  const y = S.set.sync;
  return '<div class="sec"><p class="sub">Data exchange between your phone and computers over your home network. You need a Windows computer that runs a small server. Everything is explained step by step in the guide.</p>'
    + '<div class="toolbar"><button class="btn acc" data-act="guideOpen">📖 Setup guide</button>' + '<button class="btn" data-act="srvZip">⬇ Download the server archive</button>' + '</div></div>'
    + '<div class="sec"><h3 style="margin-top:0">Connection</h3>' + (S.localServer ? '<p class="sub">This app is opened from your server, the address is filled in automatically.</p>' : '')
    + '<div class="chips"><button class="p' + (y.on !== false ? ' on' : '') + '" data-act="syncToggle">' + (y.on !== false ? '✓ Local server is on' : 'Local server is off') + '</button></div>'
    + '<div class="sub">Protocol</div><div class="chips">' + ['http', 'https'].map(x => '<button class="p' + (addrOf(y).scheme === x ? ' on' : '') + '" data-act="syScheme" data-v="' + x + '">' + x + '</button>').join('') + '</div>'
    + '<div class="two"><label class="field"><span>IP address</span><input id="syIp" inputmode="decimal" autocapitalize="off" autocomplete="off" maxlength="15" placeholder="192.168.0.15" value="' + esc(addrOf(y).host) + '"></label><label class="field"><span>Port</span><input id="syPort" inputmode="numeric" autocomplete="off" maxlength="5" placeholder="8787" value="' + esc(addrOf(y).port) + '"></label></div>'
    + '<label class="field"><span>Access code</span><input id="syTok" type="password" autocomplete="off" autocapitalize="off" placeholder="XXXXX-XXXXX" value="' + esc(y.token) + '"></label>'
    + '<div class="chips"><button class="p' + (y.auto ? ' on' : '') + '" data-act="syncAuto">' + (y.auto ? '✓ Synchronize automatically' : 'Manual only') + '</button></div>'
    + '<div class="toolbar"><button class="btn" data-act="syncSave">Save and test the connection</button><button class="btn acc" data-act="syncRun">Synchronize now</button></div>'
    + '<div id="syncSt" class="sub" style="margin-top:8px">' + syncStatusHtml() + '</div>'
    + '<p class="sub">The app keeps everything on the device itself and works without the server; the server is needed only at the moment of exchange. If the same game was edited on two devices before the exchange, the later edit is kept.</p>'
    + (y.url ? '<div class="toolbar"><button class="btn red" data-act="syncOff">Disconnect the server</button></div>' : '') + '</div>';
}
function viewSettings() {
  const propRows = S.props.map(p => '<div class="row"><span>' + esc(p.name) + ' <span class="sub">(' + ({ text: 'text', number: 'number', date: 'date' }[p.type]) + ')</span></span><button class="btn red" data-act="propDel" data-id="' + p.id + '">✕</button></div>').join('');
  const grp = (id, title, inner) => '<details class="grp" data-g="' + id + '"' + (S.gopen[id] ? ' open' : '') + '><summary>' + title + '</summary>' + inner + '</details>';
  const A = [
    '<div class="sec"><h3 style="margin-top:0">Appearance</h3><div class="chips">' + [['dark', 'Dark'], ['light', 'Light'], ['auto', 'Same as system']].map(x => '<button class="p' + (S.set.theme === x[0] ? ' on' : '') + '" data-act="setTheme" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div><h3>Animations</h3><div class="chips"><button class="p' + (animOn() ? ' on' : '') + '" data-act="animToggle">' + (animOn() ? '✓ On' : 'Off') + '</button></div><p class="sub">Fast opening and closing of the game card, switching cards with a left or right swipe. Until you choose yourself, the system “reduce motion” setting is respected.</p><h3>Vibration</h3><div class="chips"><button class="p' + (S.set.haptic !== false ? ' on' : '') + '" data-act="hapticToggle">' + (S.set.haptic !== false ? '✓ On' : 'Off') + '</button></div><p class="sub">Light vibration when switching cards and at the end of the list. Works in the Android app and in some browsers.</p><h3>Language</h3><div class="chips">' + [['', 'Same as system'], ['ru', 'Русский'], ['en', 'English']].map(x => '<button class="p' + (langPref() === x[0] ? ' on' : '') + '" data-act="setLang" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div></div>',
    '<div class="sec"><h3 style="margin-top:0">Main search</h3><div class="chips">' + ['igdb', 'rawg'].map(k => '<button class="p' + (S.set.mainSrc === k ? ' on' : '') + '" data-act="setMainSrc" data-v="' + k + '" style="border-color:' + PROV[k].color + '">' + (S.set.mainSrc === k ? '✓ ' : '') + PROV[k].name + '</button>').join('') + '</div><p class="sub">Search, quick add and Inbox processing go through the main source. Another source is switched on with the button in the search window, but the next time you open search it returns to the main one.</p></div>',
    '<div class="sec"><h3 style="margin-top:0">IGDB keys</h3>' + blockBanner(false, 'igdb') + '<label class="field"><span>Client ID</span><input id="idIn" value="' + esc(S.set.igdbId) + '" placeholder="Client ID" autocomplete="off"></label><label class="field"><span>Client Secret</span><input id="secIn" type="password" value="' + esc(S.set.igdbSecret) + '" placeholder="Client Secret" autocomplete="off"></label><div class="toolbar"><button class="btn acc" data-act="saveKey">Save and check</button></div>' + usageHtml() + '<p class="sub">You can skip the IGDB keys if they are stored on your local server (only for devices in the home network). Free: register an app at dev.twitch.tv/console/apps (Twitch may require two-factor protection), create a Client Secret and copy both values. Documentation: api-docs.igdb.com.</p></div>',
    '<div class="sec"><h3 style="margin-top:0">RAWG key</h3>' + blockBanner(false, 'rawg') + '<label class="field"><input id="rawgIn" value="' + esc(S.set.rawgKey) + '" placeholder="paste your RAWG key" autocomplete="off"></label><div class="toolbar"><button class="btn acc" data-act="saveRawg">Save and check</button></div>' + rawgUsageHtml() + '<p class="sub">Free key: rawg.io/apidocs (sign up, “Get API Key”).</p></div>',
    '<div class="sec"><h3 style="margin-top:0">SteamGridDB (covers)</h3><div class="chips"><button class="p' + (S.set.sgdbOn ? ' on' : '') + '" data-act="toggleSgdb">' + (S.set.sgdbOn ? '✓ On' : 'Off') + '</button></div><label class="field"><input id="sgdbIn" value="' + esc(S.set.sgdbKey) + '" placeholder="SteamGridDB key"></label><div class="toolbar"><button class="btn acc" data-act="saveSgdb">Save the key</button></div><p class="sub">Requests this month: <b>' + usageCount('sgdb') + '</b>. While it is off, the game card shows only a small button with a hint instead of the buttons. If it is on and a game has no cover in the source, it is loaded from here automatically. SteamGridDB limit: 120 requests per minute; the app keeps pauses between requests and, on a 429 response, stops for the time the server asks. Key: steamgriddb.com, profile, preferences, API.</p></div>',
    '<div class="sec"><h3 style="margin-top:0">Playtime</h3><p class="sub">In the game card, the HowLongToBeat and Cubiq.ru buttons open the site page for the game right away (inside the app on Android, in a new tab in the browser). Enter the time in the card manually.</p></div>',
    '<div class="sec"><h3 style="margin-top:0">Shared lists</h3><p class="sub">Platforms and genres: short and long names, merging identical ones written differently.</p><div class="toolbar"><button class="btn" data-act="dictOpen" data-kind="plat">Platforms (' + Object.keys(S.set.platDict || {}).length + ')</button><button class="btn" data-act="dictOpen" data-kind="genre">Genres (' + Object.keys(S.set.genreDict || {}).length + ')</button></div></div>',
    '<div class="sec"><h3 style="margin-top:0">Merging cards</h3><p class="sub">The same game on different platforms added as several cards: compare them, choose the main one, move the data and merge. Before merging, you see what the resulting card will be.</p><div class="toolbar"><button class="btn acc" data-act="mgTool">Open the merge tool</button></div></div>',
    '<div class="sec"><h3 style="margin-top:0">Screenshots in the database</h3><div id="shStats" class="sub">counting…</div><div class="toolbar"><button class="btn" data-act="shMgr">Select games…</button><button class="btn red" data-act="shDelAll">Delete all</button></div></div>',
    '<div class="sec"><h3 style="margin-top:0">Data</h3><p class="sub">Games: ' + S.games.length + ' · collections: ' + S.collections.length + ' · screenshots: ' + S.games.reduce((a, g) => a + (g.shotCount || 0), 0) + '<br>Used on the device: <b id="stEst">counting…</b>. ' + (S.set.lastExport ? 'Last backup: ' + new Date(S.set.lastExport).toLocaleDateString(LOC_DATE) + '. ' : 'No backup yet. ') + 'Data is stored only on this device. Make a backup and move it between the phone and the computer as a file.</p><div class="row"><span>Backup reminders</span><button class="btn" data-act="backupFreq">' + ({ 0: 'Do not remind', 7: 'Weekly', 14: 'Every 2 weeks', 30: 'Monthly' }[S.set.backupDays == null ? 7 : S.set.backupDays] || 'Weekly') + '</button></div><div class="toolbar"><button class="btn acc" data-act="export">Export to a file</button><button class="btn" data-act="import">Import from a file</button><button class="btn" data-act="fixDupes">Check for duplicates</button><button class="btn" data-act="openStats">Statistics</button></div><input type="file" id="impFile" accept=".json,.zip,application/json,application/zip" class="hidden"></div>',
    undoSecHtml() + '<div class="sec"><h3 style="margin-top:0">Trash</h3>' + (S.trash.length ? S.trash.slice().sort((a, b) => b.t - a.t).slice(0, 30).map(r => '<div class="row"><span>' + esc(r.game.name) + ' <span class="sub">' + new Date(r.t).toLocaleDateString(LOC_DATE) + '</span></span><button class="btn" data-act="trashRestore" data-id="' + r.id + '">Restore</button></div>').join('') + '<div class="toolbar"><button class="btn red" data-act="trashClear">Empty the trash</button></div>' : '<p class="sub">Deleted games are kept for 30 days and can be restored.</p>') + '</div>' + errSecHtml(),
    '<div class="sec"><h3 style="margin-top:0">Custom properties</h3>' + (propRows || '<p class="sub">Properties of other types (text, number, date) for games. For checkboxes use collections.</p>') + '<div class="toolbar"><button class="btn" data-act="propAdd">＋ Add property</button></div></div>',
    (installEvt ? '<div class="sec"><button class="btn acc" data-act="install">Install the app</button></div>' : ''),
    '<div class="sec"><button class="btn red" data-act="wipe">Delete all data</button></div>'
  ];
  return '<div class="hdr2"><h2>Settings</h2></div>'
    + grp('sync', '🔄 Sync and own server', syncHtml())
    + grp('data', '💾 Data and backups', A[9] + A[10])
    + grp('src', '🔎 Sources and keys', A[1] + A[2] + A[3] + A[4] + A[5])
    + grp('parse', '⚡ Automatic parsing', matchHtml())
    + grp('view', '🎨 Appearance', A[0] + A[12])
    + grp('tools', '🧰 Tools', A[6] + A[7] + A[8] + A[11])
    + grp('debug', '🐞 Debugging', dbgSecHtml())
    + grp('danger', '⚠ Danger zone', A[13]);
}
// проценты совпадения по умолчанию для автоматического разбора (в окне разбора можно изменить для конкретного списка)
function matchHtml() {
  const c = matchCfg(), f = (id, v) => '<input id="' + id + '" inputmode="numeric" maxlength="3" value="' + v + '" style="width:64px;text-align:center">';
  return '<div class="sec"><h3 style="margin-top:0">Title match, %</h3><p class="sub">Above the upper percentage the game counts as found exactly. Between the lower and the upper one the row is marked ≈ and handled manually with “Process mismatches”. Below the lower one the game counts as not found.</p>'
    + '<div class="lrw"><span>In the catalog: from</span>' + f('mcl0', c.cLow) + '<span>to</span>' + f('mch0', c.cHigh) + '</div>'
    + '<div class="lrw"><span>In IGDB / RAWG: from</span>' + f('msl0', c.sLow) + '<span>to</span>' + f('msh0', c.sHigh) + '</div>'
    + '<div class="toolbar"><button class="btn acc" data-act="matchSave">Save</button><button class="btn" data-act="matchReset">Default (85/98 and 50/98)</button></div></div>';
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
async function inflateRaw(u8) { if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot unpack archives'); return streamBytes(new DecompressionStream('deflate-raw'), u8); }
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
  if (e < 0) throw new Error('Could not read the archive');
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
  sheetKey = 'export'; openSheet('<div class="hdr2"><h2>Export: ' + esc(title) + '</h2></div><p class="sub">Games: ' + games.length + '. The first row has headers: you can give such text to an AI, add the missing data and paste it back into the Inbox (“Paste a list…”).</p>'
    + '<h3>Format</h3><div class="chips">' + [['csv', 'CSV (Excel, AI)'], ['txt', 'Text with | separator']].map(x => '<button class="p' + (e.fmt === x[0] ? ' on' : '') + '" data-act="expFmt" data-v="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>'
    + '<h3>Columns</h3><div class="chips">' + EXPORT_COLS.map(c => '<button class="p' + (e.keys.includes(c[0]) ? ' on' : '') + '" data-act="expCol" data-k="' + c[0] + '">' + c[1] + '</button>').join('') + '</div>'
    + '<div class="toolbar"><button class="btn acc" data-act="expCopy">Copy text</button><button class="btn" data-act="expSave">Save file</button></div>');
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (er) { /* запасной способ */ }
  try { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return !!ok; } catch (er) { return false; }
}
async function exportData(withShots = true) {
  toast('Preparing the file…');
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
    try { const r = await FS.writeFile({ path: name, data: await blobToBase64(blob), directory: 'CACHE' }); await SH.share({ title: 'Game Catalog', url: r.uri, dialogTitle: 'Save the backup' }); return; } catch (e) { toast('Could not share: ' + (e.message || e)); return; }
  }
  dl(name, blob);
}

// Импорт чужого JSON: id попадают в data-* атрибуты разметки, поэтому оставляем только безопасные символы.
// Одинаковые исходные id превращаются в одинаковые новые, ссылки между записями не рвутся.
function sanitizeImport(d) {
  const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/, map = new Map(), fix = id => { if (id == null || id === '') return id; if (typeof id === 'string' && SAFE_ID.test(id)) return id; const k = String(id); if (!map.has(k)) map.set(k, uid()); return map.get(k); };
  const fixList = a => Array.isArray(a) ? a.map(fix) : a, fixKeys = o => { if (!o || typeof o !== 'object') return o; const r = {}; Object.keys(o).forEach(k => { r[fix(k)] = o[k]; }); return r; };
  (d.collections || []).forEach(c => { c.id = fix(c.id); if (c.coverGame) c.coverGame = fix(c.coverGame); });
  (d.props || []).forEach(p => { p.id = fix(p.id); });
  (d.games || []).forEach(g => { g.id = fix(g.id); g.collections = fixList(g.collections); g.props = fixKeys(g.props); });
  if (d.covers) d.covers = fixKeys(d.covers);
  if (d.shots) d.shots = fixKeys(d.shots);
  const inb = d.inbox; if (inb) {
    (inb.lists || []).forEach(l => { l.id = fix(l.id); l.colls = fixList(l.colls); });
    (inb.items || []).forEach(i => { i.id = fix(i.id); i.listId = fix(i.listId); if (i.gameId) i.gameId = fix(i.gameId); });
  }
  return d;
}
async function importData(d, mode, files) {
  if (!d || d.app !== 'game-catalog') throw new Error('This is not a catalog backup file');
  sanitizeImport(d);
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
      colls.forEach(c => { if (!t.collections.includes(c)) t.collections.push(c); }); t.props = Object.assign({}, props, t.props); ['igdbId', 'rawgId', 'igdbUrl', 'rawgUrl'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; });
    if (!t.done && g.done) { t.done = true; t.doneDate = g.doneDate || ''; }
      ['series', 'franchise', 'coverUrl'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; }); ['time', 'rating', 'year'].forEach(k => { if (!t[k] && g[k]) t[k] = g[k]; });
    } else {
      t = Object.assign({ genres: [], platforms: [], series: '', time: 0, rating: 0, year: 0 }, g, { series: canonSeries(g.series), id: S.games.some(x => x.id === g.id) ? uid() : g.id, collections: colls, props });
      delete t.description; delete t.mainPlatform; t.hasCover = false; t.shotCount = 0; S.games.push(t);
    }
    const cv = d.covers && d.covers[g.id];
    if (cv && !t.hasCover) { try { await setCover(t.id, dataUrlToBlob(cv)); } catch (e) { logErr('cover import', e); /* пропускаем */ } }
    const sh = d.shots && d.shots[g.id];
    if (sh && sh.length && !(t.shotCount > 0)) { try { const list = sh.map(x => x.file ? (files && files.get(x.file) ? { n: uid(), src: x.src || '', blob: new Blob([files.get(x.file)], { type: 'image/jpeg' }) } : null) : { n: uid(), src: x.src || '', blob: dataUrlToBlob(x.d) }).filter(Boolean); if (!list.length) throw new Error('no images'); await DB.put('shots', { id: t.id, list }); t.shotCount = list.length; } catch (e) { logErr('screenshot import', e); } }
    gmap[g.id] = t.id;
    await DB.put('games', t); n++;
  }
  for (const [ex, old] of coverFix) { if (gmap[old]) { ex.coverGame = gmap[old]; await DB.put('collections', ex); } }
  const lmap = {}, inb = d.inbox || { lists: [], items: [] };
  for (const l of inb.lists || []) {
    let ex = S.inbox.lists.find(x => x.name.toLowerCase() === l.name.toLowerCase());
    if (!ex) { ex = { id: S.inbox.lists.some(x => x.id === l.id) ? uid() : l.id, name: l.name, created: l.created || Date.now(), markDone: !!l.markDone, colls: (l.colls || []).map(id => cmap[id]).filter(Boolean) }; S.inbox.lists.push(ex); await DB.put('inboxLists', ex); }
    lmap[l.id] = ex.id;
  }
  for (const i of inb.items || []) {
    const lid = lmap[i.listId]; if (!lid || S.inbox.items.some(x => x.listId === lid && x.text.toLowerCase() === i.text.toLowerCase())) continue;
    const it = Object.assign({}, i, { id: S.inbox.items.some(x => x.id === i.id) ? uid() : i.id, listId: lid, gameId: i.done ? (gmap[i.gameId] || '') : '' });
    if (it.done && !it.gameId) it.done = false;
    if (it.colls) it.colls = it.colls.map(id => cmap[id]).filter(Boolean);
    S.inbox.items.push(it); await DB.put('inboxItems', it);
  }
  S.set.f.collections = S.set.f.collections.filter(id => id === DONE_ID || id === NO_COLL || S.collections.some(c => c.id === id));
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
function lbApply() { const img = lbEl && $('img', lbEl); if (img && img.style && lbState) img.style.transform = 'translate3d(' + lbState.x + 'px,' + lbState.y + 'px,0) scale(' + lbState.s + ')'; }
function lbApplyRaf() { const st = lbState; if (!st || st.raf) return; st.raf = requestAnimationFrame(() => { st.raf = 0; lbApply(); }); } // не чаще одного раза за кадр: жесты двумя пальцами идут плавно
function lbAnim(ms) { const img = lbEl && $('img', lbEl); if (img && img.style) img.style.transition = ms ? 'transform ' + ms + 'ms ease' : 'none'; }
function lbShow(i) {
  const st = lbState; if (!st || !lbEl) return; st.i = (i + st.list.length) % st.list.length; st.s = 1; st.x = 0; st.y = 0;
  $('img', lbEl).src = st.list[st.i]; $('.lbc', lbEl).textContent = (st.i + 1) + ' of ' + st.list.length; lbApply();
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
  const b = (act, ic, label, src) => '<button class="btn big" data-cv="' + act + '"' + (src ? ' data-src="' + src + '"' : '') + '>' + I(ic) + ' ' + label + '</button>';
  bar.innerHTML = b('pickCover', 'img', 'Replace the cover') + (S.set.sgdbOn ? b('sgdbOpen', 'img', 'SteamGridDB') : '<button class="btn big" data-cv="sgdbOff" title="SteamGridDB is off">SteamGridDB</button>');
  bar.onclick = e => { const x = e.target.closest ? e.target.closest('[data-cv]') : null; if (!x) return; const a = x.dataset.cv, src = x.dataset.src; closeLb(); if (a === 'pickCover') $('#coverFile').click(); else ACT[a]({ dataset: { src } }); };
  lbEl.appendChild(bar);
}
function openLb(list, i) {
  if (!list || !list.length) return; closeLb();
  const d = document.createElement('div'); d.className = 'lb';
  d.innerHTML = '<img alt="" draggable="false"><div class="lbc"></div><button class="lbx" data-lb="x" aria-label="Close">✕</button>' + (list.length > 1 ? '<button class="lbn lbp" data-lb="p" aria-label="Back">‹</button><button class="lbn lbf" data-lb="n" aria-label="Forward">›</button>' : '');
  lbEl = d; const st = lbState = { list, i: 0, s: 1, x: 0, y: 0, pts: new Map(), moved: false, tap: 0, busy: false, W: 360, H: 640, raf: 0 };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // размеры окна запоминаем заранее: чтение размеров на каждом движении пальца тормозило
  const bound = () => { const w = st.W * (st.s - 1) / 2, h = st.H * (st.s - 1) / 2; st.x = clamp(st.x, -w, w); st.y = clamp(st.y, -h, h); };
  d.onclick = e => {
    if (st.moved) return;
    const b = e.target.closest ? e.target.closest('[data-lb]') : null, k = b && b.dataset.lb;
    if (k === 'p') lbGo(-1); else if (k === 'n') lbGo(1); else if (k === 'x' || e.target === d) closeLb();
  };
  d.onpointerdown = e => {
    if (e.target.closest && e.target.closest('[data-lb]')) { st.moved = false; return; } // иначе после свайпа или увеличения кнопки «Закрыть», «‹», «›» не срабатывали
    st.pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); st.moved = false;
    if (st.pts.size === 2) { const [a, b] = Array.from(st.pts.values()); st.d0 = lbDist(a, b) || 1; st.s0 = st.s; }
    else { st.sx = e.clientX; st.sy = e.clientY; st.x0 = st.x; st.y0 = st.y; }
  };
  d.onpointermove = e => {
    if (!st.pts.has(e.pointerId) || st.busy) return; st.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (st.pts.size >= 2) { const [a, b] = Array.from(st.pts.values()); st.s = clamp(st.s0 * lbDist(a, b) / st.d0, 1, 5); st.moved = true; if (st.s === 1) { st.x = 0; st.y = 0; } bound(); lbApplyRaf(); return; }
    const dx = e.clientX - st.sx, dy = e.clientY - st.sy; if (Math.abs(dx) + Math.abs(dy) > 8) st.moved = true;
    if (st.s > 1) { st.x = st.x0 + dx; st.y = st.y0 + dy; bound(); } else st.x = dx;
    lbApplyRaf();
  };
  const up = e => {
    if (!st.pts.has(e.pointerId)) return; st.pts.delete(e.pointerId);
    if (st.pts.size === 1) { const p = Array.from(st.pts.values())[0]; st.sx = p.x; st.sy = p.y; st.x0 = st.x; st.y0 = st.y; return; }
    if (st.pts.size) return;
    if (!st.moved) { const now = Date.now(); if (now - st.tap < 300) { lbAnim(180); st.s = st.s > 1 ? 1 : 2.5; st.x = 0; st.y = 0; lbApply(); setTimeout(() => lbAnim(0), 200); st.tap = 0; } else st.tap = now; return; }
    if (st.s === 1) { if (Math.abs(st.x) > 60 && st.list.length > 1) lbGo(st.x < 0 ? 1 : -1); else { lbAnim(150); st.x = 0; lbApply(); setTimeout(() => lbAnim(0), 160); } }
  };
  d.onpointerup = up; d.onpointercancel = up;
  d.onwheel = e => { e.preventDefault(); st.s = clamp(st.s * (e.deltaY < 0 ? 1.18 : 0.85), 1, 5); if (st.s === 1) { st.x = 0; st.y = 0; } bound(); lbApplyRaf(); };
  $('#layer').appendChild(d); st.W = d.clientWidth || 360; st.H = d.clientHeight || 640; lbShow(i || 0);
}
async function fillEstimate() {
  const el = $('#stEst'); if (!el) return;
  try { const e = await navigator.storage.estimate(); el.textContent = '~' + Math.max(1, Math.round(e.usage / 1048576)) + ' MB'; } catch (er) { el.textContent = 'no data'; }
}
const tabBox = tab => tab === 'library' ? $('#libBody') : tab === 'search' ? $('#srBody') : $('#view');
function saveScroll() { const b = tabBox(S.tab); if (b) (S.scrollPos || (S.scrollPos = {}))[S.tab] = b.scrollTop || 0; }
function restoreScroll(tab) {
  const p = S.scrollPos && S.scrollPos[tab], b = tabBox(tab); if (!b) return; if (!p) { b.scrollTop = 0; return; }
  if (tab === 'library') { let g = 0; while (S.entries && S.libN < S.entries.length && b.scrollHeight < p + b.clientHeight && g++ < 100) if (!libAppend()) break; }
  b.scrollTop = p;
}
function render() {
  setTimeout(lazyCovers, 800); setTimeout(bindScrollBtns, 60);
  $$('#tabs button').forEach(b => { const on = b.dataset.tab === S.tab || (S.tab === 'stats' && b.dataset.tab === 'settings') || ((S.tab === 'sercard' || S.tab === 'frcard') && b.dataset.tab === 'series'); b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  const fab = $('#fab'); fab.classList.toggle('hidden', !(S.tab === 'library' || S.tab === 'collections' || (S.tab === 'inbox' && !S.inboxList)) || S.selMode);
  const v = $('#view'); v.className = ['library', 'collections', 'series', 'search', 'sercard', 'frcard'].includes(S.tab) ? 'fx' : '';
  if (S.tab === 'library') { v.innerHTML = viewLibrary(); renderLibrary(); }
  else if (S.tab === 'collections') { v.innerHTML = viewCollections(); renderSelBar(); }
  else if (S.tab === 'stats') { v.innerHTML = viewStats(); renderSelBar(); }
  else if (S.tab === 'inbox') { v.innerHTML = viewInbox(); renderSelBar(); }
  else if (S.tab === 'series') { v.innerHTML = S.serKind === 'fr' ? viewFranchises() : viewSeries(); renderSelBar(); }
  else if (S.tab === 'sercard' && S.serCard) { v.innerHTML = viewSerCard(); }
  else if (S.tab === 'frcard' && S.frCard) { v.innerHTML = viewFrCard(); }
  else if (S.tab === 'search') { v.innerHTML = viewSearch(); renderSearchBody(); renderSelBar(); }
  else { v.innerHTML = viewSettings(); renderSelBar(); fillEstimate(); fillShotStats(); }
}
const lp = { t: null, fired: false, x: 0, y: 0 };
S.expColls = S.expColls || new Set(); // игры, у которых в списке раскрыты все коллекции
const ACT = {
  tab: t => { saveScroll(); if (t.dataset.tab !== 'search') S.pending = null; else if (S.tab !== 'search') { S.search.kind = 'games'; S.search.bind = ''; S.search.src = S.set.mainSrc; fClear(S.search.f); } S.retGame = null; S.inSelMode = false; S.inSel.clear(); S.tab = t.dataset.tab; S.selMode = false; S.sel.clear(); closeSheet(); render(); if (S.tab === 'library') setTimeout(focusLast, 0); restoreScroll(S.tab); },
  fab: () => S.tab === 'collections' ? createCollection().then(c => { if (c) render(); }) : S.tab === 'inbox' ? createList() : openGameSheet(null),
  closeSheet: () => closeSheet(),
  clearQ: () => { S.set.f.q = ''; saveSet(); if (S.tab === 'library') { const q = $('#q'); if (q) q.value = ''; libRefilter(); if (sheetEl) openFilters(); } },
  clearSQ: () => { S.search.q = ''; const q = $('#sq'); if (q) q.value = ''; runSearch(true); },
  openColls: () => openCollSheet(),
  expLib: () => { closeSheet(); openExport(sortGames(filterGames(S.games, S.set.f), S.set.f), 'Game list'); },
  expFmt: t => { S.set.exp.fmt = t.dataset.v; saveSet(); $$('[data-act="expFmt"]').forEach(b => b.classList.toggle('on', b.dataset.v === t.dataset.v)); },
  expCol: t => { const k = t.dataset.k, a = S.set.exp.keys, i = a.indexOf(k); if (i < 0) a.push(k); else if (a.length > 1) a.splice(i, 1); saveSet(); if (t.classList) t.classList.toggle('on', a.includes(k)); },
  expCopy: async () => { toast(await copyText(exportText()) ? 'Copied: you can paste it into an AI or Excel' : 'Could not copy'); },
  expSave: async () => {
    const e = S.set.exp, csv = e.fmt === 'csv', text = (csv ? '\uFEFF' : '') + exportText(), name = 'spisok-igr-' + new Date().toISOString().slice(0, 10) + (csv ? '.csv' : '.txt');
    const FS = plug('Filesystem'), SH = plug('Share');
    if (isNative() && FS && SH) { try { const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' }); await SH.share({ title: 'Game list', url: r.uri, dialogTitle: 'Save the list' }); } catch (er) { toast('Could not share: ' + (er.message || er)); } return; }
    dl(name, new Blob([text], { type: csv ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8' }));
  },
  textFile: async () => { // весь текущий список текстом в файл (на телефоне через «Поделиться»)
    const text = textLines(S.entries || []), name = 'spisok-igr-' + new Date().toISOString().slice(0, 10) + '.txt', FS = plug('Filesystem'), SH = plug('Share');
    if (isNative() && FS && SH) { try { const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' }); await SH.share({ title: 'Game list', url: r.uri, dialogTitle: 'Save the list' }); } catch (er) { toast('Could not share: ' + (er.message || er)); } return; }
    dl(name, new Blob([text], { type: 'text/plain;charset=utf-8' }));
  },
  shareGame: async () => {
    const d = S.sheet && S.sheet.draft; if (!d || !d.name) return toast('Enter the title first');
    const text = gameLine(d), SH = plug('Share');
    try { if (isNative() && SH) await SH.share({ title: d.name, text, dialogTitle: 'Share the game' }); else if (navigator.share) await navigator.share({ title: d.name, text }); else toast(await copyText(text) ? 'Copied: ' + text : 'Could not share'); } catch (er) { /* отменено */ }
  },
  itPick: async t => {
    const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it || it.done) return;
    const c = it.cands || [], r = await askChoose({ title: 'Choose: “' + it.text + '»', items: c.map(x => ({ id: x.rid, label: x.name + (x.year ? ' (' + x.year + ')' : ''), sub: (x.pct ? x.pct + '% · ' : '') + (x.platforms || []).join(', '), ico: '🎮' })).concat([{ id: '__search', label: 'Open search' }, { id: '__none', label: 'None fits' }]) });
    if (r === null) return;
    if (r === '__search') return ACT.itOpen({ dataset: { id: it.id } });
    if (r === '__none') { it.doubt = false; it.failed = true; delete it.cands; await DB.put('inboxItems', it); return render(); }
    try { const g = await addFromIgdb(r, [], itemAddOpts(it)); if (g) linkItem(it, g); } catch (er) { toast(er.message); }
  },
  sfPageSize: async () => {
    const v = await askChoose({ title: 'Games in the result (at a time)', items: [20, 40, 50, 100, 200].map(n => ({ id: String(n), label: String(n) + (n === (S.set.pageSize || 40) ? ' ✓' : '') })) });
    if (!v) return; S.set.pageSize = +v; saveSet(); openSearchFilters(); runSearch(true);
  },
  toggleColls: t => { const g = gameById(t.dataset.gid); if (!g) return; const e = S.expColls, on = !e.has(g.id); if (on) e.add(g.id); else e.delete(g.id); t.innerHTML = tagsHtml(g, on); t.classList.toggle('open', on); },
  shNav: t => carGo(+t.dataset.d),
  undoLast: () => undoLast(),
  rsRetry: () => { if (S.rs) openIgdbSheet(S.rs.rid, true); },
  recentQ: t => { S.search.q = t.dataset.q || ''; const i = $('#sq'); if (i) i.value = S.search.q; runSearch(true); },
  recentClear: () => { S.set.recentQ = []; saveSet(); renderSearchBody(); },
  serNav: t => { if (t.dataset.id) openGameSheet(t.dataset.id, +t.dataset.d); },
  errView: () => {
    const m = openModal(), rows = ERRLOG.list.slice().reverse().map(x => '<div style="margin:0 0 8px;font-size:12px;word-break:break-word"><b>' + esc(new Date(x.t).toLocaleString(LOC_DATE)) + '</b> · ' + esc(x.w) + (x.n > 1 ? ' ×' + x.n : '') + '<br>' + esc(x.m) + (x.s ? '<br><span class="sub">' + esc(x.s) + '</span>' : '') + '</div>').join('');
    m.innerHTML = '<h4>Error log</h4><div style="max-height:55vh;overflow:auto">' + (rows || '<p class="sub">No errors</p>') + '</div><div class="acts"><span data-x="ok">Close</span></div>';
    modalCancel = () => closeModal(); m.onclick = e => { if (e.target.closest('[data-x]')) closeModal(); };
  },
  errCopy: async () => { toast(await copyText(errText()) ? 'Log copied' : 'Could not copy'); },
  errClear: () => { ERRLOG.list = []; try { localStorage.removeItem('gc_errlog'); } catch (e) { /* ignore */ } render(); },
  gameColls: t => {
    const g = gameById(t.dataset.gid); if (!g) return;
    const cs = (g.collections || []).map(collById).filter(Boolean), m = openModal();
    m.innerHTML = '<h4>' + esc(g.name) + '</h4><p class="sub">Game collections: ' + cs.length + '</p><div class="chips">' + cs.map(c => '<span class="p"' + (okColor(c.color) ? ' style="border-color:' + okColor(c.color) + '"' : '') + '>' + esc(c.name) + '</span>').join('') + '</div><div class="acts"><span data-x="ok">Close</span></div>';
    modalCancel = () => closeModal(); m.onclick = e => { if (e.target.closest('[data-x]')) closeModal(); };
  },
  collClear: () => { S.set.f.collections = []; saveSet(); libRefilter(); openCollSheet(); },
  collChip: t => { const c = S.set.f.collections, i = c.indexOf(t.dataset.id); i < 0 ? c.push(t.dataset.id) : c.splice(i, 1); saveSet(); if (t.classList) t.classList.toggle('on', i < 0); libRefilter(); }, // без перерисовки окна: список не прыгает наверх
  collOpen: t => { if (lp.fired) { lp.fired = false; return; } S.set.f.collections = t.dataset.id === 'all' ? [] : [t.dataset.id]; saveSet(); S.tab = 'library'; render(); },
  collMenu: (t, e) => { e.stopPropagation(); collMenu(t.dataset.id); },
  serOpen: t => { if (lp.fired) { lp.fired = false; return; } S.serCardFrom = ''; if (t.dataset.name) { S.retGame = null; return openSerCard(t.dataset.name); } serInLibrary(t.dataset.name); },
  serMenu: (t, e) => { e.stopPropagation(); serMenu(t.dataset.name); },
  collMode: t => { S.set.f.collMode = t.dataset.v; saveSet(); $$('[data-act="collMode"]').forEach(b => b.classList.toggle('on', b.dataset.v === t.dataset.v)); renderLibrary(); },
  toggleWrap: () => { S.set.textWrap = S.set.textWrap === 'scroll' ? 'wrap' : 'scroll'; saveSet(); renderLibrary(); },
  toggleView: () => { S.set.view = S.set.view === 'grid' ? 'list' : S.set.view === 'list' ? 'text' : 'grid'; saveSet(); renderLibrary(); },
  openFilters: () => openFilters(), openCols: () => openCols(),
  colToggle: t => { const c = S.set.cols; c[t.dataset.k] = c[t.dataset.k] ? 0 : 1; saveSet(); openCols(); renderLibrary(); },
  sortBy: t => { const f = S.set.f; if (f.sort === t.dataset.k) f.dir = f.dir === 'asc' ? 'desc' : 'asc'; else { f.sort = t.dataset.k; f.dir = 'asc'; } saveSet(); libRefilter(); },
  fToggle: t => { const a = S.set.f[t.dataset.k], v = t.dataset.k === 'years' ? +t.dataset.v : t.dataset.v, i = a.findIndex(x => String(x) === String(v)); i < 0 ? a.push(v) : a.splice(i, 1); saveSet(); if (t.classList) t.classList.toggle('on', i < 0); libRefilter(); },
  rmF: t => { const k = t.dataset.k; S.set.f[k] = S.set.f[k].filter(x => String(x) !== t.dataset.v); saveSet(); libRefilter(); },
  resetF: () => { const f = S.set.f; Object.assign(f, { q: '', years: [], genres: [], platforms: [], series: [], franchise: [], collections: [], props: [], addedFrom: '', addedTo: '', seriesMode: '', franchiseMode: '', maxTime: 0, done: '', minRating: 0 }); const hadGroup = !!S.set.group; S.set.group = ''; saveSet(); const q = $('#q'); if (q) q.value = ''; if (hadGroup) renderLibrary(); else libRefilter(); if (sheetEl) openFilters(); }, // «Сбросить» убирает все плашки, в том числе группировку
  selToggle: () => { S.selMode = !S.selMode; S.sel.clear(); renderLibrary(); $('#fab').classList.toggle('hidden', S.selMode); },
  selAct: t => selectionAction(t.dataset.m),
  openGame: (t) => { if (!S.selMode && t.closest('.tlist') && typeof getSelection === 'function' && String(getSelection()).trim()) return; /* выделяли текст мышью: игру не открываем */ if (lp.fired) { lp.fired = false; return; } const id = t.dataset.gid; if (S.selMode) toggleSel(id); else openGameSheet(id); },
  openGameFromIgdb: t => { closeSheet(); openGameSheet(t.dataset.id); },
  pickCover: () => $('#coverFile').click(),
  shColl: t => { markDirty(); const d = S.sheet.draft, i = d.collections.indexOf(t.dataset.id); i < 0 ? d.collections.push(t.dataset.id) : d.collections.splice(i, 1); drawShColls(); },
  shNewColl: async () => { markDirty(); const c = await createCollection(); if (c && !S.sheet.draft.collections.includes(c.id)) S.sheet.draft.collections.push(c.id); drawShColls(); },
  saveGame: () => closeSheet(),
  pickFranchise: async () => {
    const m = new Map(); S.games.forEach(g => { if (g.franchise) m.set(g.franchise, (m.get(g.franchise) || 0) + 1); });
    const names = Array.from(m.keys()).sort((a, b) => a.localeCompare(b, LOC));
    const r = await choose({ title: 'Game franchise', search: true, items: [{ id: '__none', label: 'No franchise', accent: true, pin: true }].concat(names.map(n => ({ id: n, label: n, sub: gWord(m.get(n)) }))) });
    if (r === null) return; const f = $('#f_franchise'); if (f) { f.value = r === '__none' ? '' : r; markDirty(); }
  },
  pickSeries: async () => {
    const m = new Map(); S.games.forEach(g => { if (g.series) m.set(g.series, (m.get(g.series) || 0) + 1); });
    const names = Array.from(m.keys()).sort((a, b) => a.localeCompare(b, LOC));
    const r = await choose({ title: 'Game series', search: true, items: [{ id: '__none', label: 'No series', accent: true, pin: true }].concat(names.map(n => ({ id: n, label: n, sub: gWord(m.get(n)) }))) });
    if (r === null) return; const f = $('#f_series'); if (f) { f.value = r === '__none' ? '' : r; markDirty(); }
  },
  togglePin: () => { S.set.pin = !S.set.pin; saveSet(); renderLibrary(); if (sheetEl) openCols(); },
  colProp: t => { const pc = S.set.propCols = S.set.propCols || {}; pc[t.dataset.id] = pc[t.dataset.id] === 0 ? 1 : 0; saveSet(); openCols(); renderLibrary(); },
  fixDupes: async () => { await checkDupes(false); render(); },
  delGame: async () => { const id = S.sheet.draft.id; if (await confirmBox('Delete the game “' + S.sheet.draft.name + '»?', 'Delete')) { if (S.sheet) S.sheet.dirty = false; await removeGame(id); closeSheet(); render(); toast('Game deleted', 'Undo', () => restoreGames([id])); } },
  refreshTime: async () => {
    const d = S.sheet && S.sheet.draft; if (!d || !d.igdbId) return toast('The game has no IGDB entry');
    try { const h = await igdbTimeOf(d.igdbId); if (!h) return toast('IGDB has no time for this game'); $('#f_time').value = String(h); markDirty(); toast('Time from IGDB: ' + h + ' h'); } catch (e) { toast(e.message); }
  },
  refreshIgdb: t => refreshFromIgdb(S.sheet.draft.id, t.dataset.src),
  findIgdb: t => { const n = $('#f_name').value; S.retGame = { id: S.sheet.draft.id, tab: S.tab }; closeSheet(); S.search.q = n; S.search.src = t.dataset.src || S.set.mainSrc; fClear(S.search.f); S.tab = 'search'; render(); runSearch(true); },
  seriesCatalog: () => { const s = $('#f_series').value.trim(); closeSheet(); S.set.f.series = [s]; S.set.f.collections = []; saveSet(); S.tab = 'library'; render(); },
  seriesIgdb: t => { const d = S.sheet.draft, src = t.dataset.src; S.retGame = { id: d.id, tab: S.tab }; showSeries(ridOf(src, d[src + 'Id']), d.series || d.name); },
  sFilters: () => openSearchFilters(),
  sReset: () => { fClear(S.search.f, true); closeSheet(); renderSearchBody(); runSearch(true); },
  sRm: t => { const f = S.search.f, k = t.dataset.k, v = t.dataset.v; if (k === 'minRating') f.minRating = 0; else if (k === 'types') { delete S.set.searchTypes; saveSet(); } else { const arr = fa(f, k).slice(), i = arr.map(String).indexOf(String(v)), nk = k === 'genres' ? 'genreNames' : k === 'platforms' ? 'platformNames' : ''; if (i >= 0) { arr.splice(i, 1); if (nk) { const nm = (f[nk] || []).slice(); nm.splice(i, 1); f[nk] = nm; } } f[k] = arr; } runSearch(true); },
  sBack: () => {
    { // экран серии, открытый из другой вкладки, из карточки серии или игры: назад туда, откуда пришли (накопленный стек поиска не трогаем)
      const s0 = S.search, c0 = s0.mode === 'series' ? s0.chk : null;
      if (c0 && c0.from && c0.from !== 'search') {
        s0.chk = null; s0.mode = 'search'; s0.results = []; s0.started = false;
        if (c0.from === 'sercard' && S.serCard) { S.tab = 'sercard'; return render(); }
        if (c0.from === 'frcard' && S.frCard) { S.tab = 'frcard'; return render(); }
        if (S.retGame) return ACT.retGame();
        S.tab = c0.from; return render();
      }
    }
    if (popSearchState()) return; if (bundleMode() && S.pending) return backToInbox();
    if (S.retGame) return ACT.retGame();
    const s = S.search, c = s.chk; if (c && c.from && c.from !== 'search') { s.chk = null; s.mode = 'search'; s.results = []; s.started = false; S.tab = c.from; render(); return; }
    s.mode = 'search'; render(); runSearch(true);
  },
  scrollTop: () => { const el = $(S.tab === 'search' ? '#srBody' : '#libBody'); if (el && el.scrollTo) el.scrollTo({ top: 0, behavior: 'smooth' }); },
  scrollBottom: () => { const el = $('#libBody'); if (el && el.scrollTo) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); },
  sMoreDown: () => { const b = $('#moreBtn'); if (b && b.scrollIntoView) b.scrollIntoView({ block: 'end', behavior: 'smooth' }); },
  sKind: () => { const s = S.search; s.kind = s.kind === 'games' ? 'series' : s.kind === 'series' ? 'franchise' : 'games'; s.src = s.kind !== 'games' ? 'igdb' : S.set.mainSrc; s.bind = ''; s.stack = []; s.chk = null; s.cols = []; s.results = []; s.started = false; s.token++; s.loading = false; s.mode = 'search'; render(); runSearch(true); },
  colTap: t => {
    if (S.search.kind === 'franchise') return ACT.frColTap(t);
    const s = S.search, id = +t.dataset.id, nm = t.dataset.name;
    if (s.bind) { const b = s.bind; s.bind = ''; serMap('serCol')[serKey(b)] = { id, name: nm, manual: 1 }; delete serMap('serChk')[serKey(b)]; saveSet(); return showSeriesView(b, { onlyMiss: true }); }
    return showSeriesView(nm, { colId: id });
  },
  serCheck: t => { const d = S.sheet && S.sheet.draft; if (d && d.id) S.retGame = { id: d.id, tab: S.tab }; showSeriesView(t.dataset.name, { from: S.tab, onlyMiss: true }); },
  serCard: t => { const nm = (t && t.dataset && t.dataset.name) || (($('#f_series') || {}).value || '').trim(); if (!nm) return; const d = S.sheet && S.sheet.draft; S.serCardFrom = ''; if (d && d.id && !S.sheet.isNew) S.retGame = { id: d.id, tab: S.tab }; openSerCard(nm); },
  scBack: () => { if (S.serCardFrom === 'frcard' && S.frCard) { S.serCardFrom = ''; S.tab = 'frcard'; render(); return; } const r = S.retGame; if (r && gameById(r.id)) return ACT.retGame(); S.retGame = null; S.serKind = 'ser'; S.tab = 'series'; render(); },
  scMenu: () => serMenu(S.serCard.name),
  scCatalog: () => serInLibrary(S.serCard.name),
  scVmode: () => { S.set.vmode = S.set.vmode || {}; S.set.vmode.sercard = vmodeOf('sercard') === 'list' ? 'tiles' : 'list'; saveSet(); render(); },
  scSearch: () => showSeriesView(S.serCard.name, { from: 'sercard' }),
  scCheck: () => showSeriesView(S.serCard.name, { from: 'sercard', onlyMiss: true }),
  scMark: () => { const m = serMap('serOk'), k = serKey(S.serCard.name); if (m[k]) delete m[k]; else m[k] = 1; saveSet(); scRefresh(); toast(m[k] ? 'Series marked as checked and complete' : 'Mark removed'); },
  scSel: () => { const c = S.serCard; c.selMode = !c.selMode; if (!c.selMode) c.sel.clear(); scRefresh(); },
  scSelAll: () => { const c = S.serCard, l = scList(c.name); if (c.sel.size === l.length) c.sel.clear(); else l.forEach(g => c.sel.add(g.id)); scRefresh(); },
  scGame: t => { if (lp.fired) { lp.fired = false; return; } const c = S.serCard, id = t.dataset.gid; if (c.selMode) { if (c.sel.has(id)) c.sel.delete(id); else c.sel.add(id); return scRefresh(); } S.shown = scList(c.name); openGameSheet(id); },
  scRemove: async () => { const c = S.serCard, games = scList(c.name).filter(g => c.sel.has(g.id)); if (!games.length) return; const snap = takeSnap(); for (const g of games) g.series = ''; await saveGames(games); c.sel.clear(); c.selMode = false; scRefresh(); toastUndo('Removed from the series: ' + games.length, snap); },
  scMove: async () => { const c = S.serCard, games = scList(c.name).filter(g => c.sel.has(g.id)); if (!games.length) return; const n = await chooseSeries(c.name); if (!n) return; const snap = takeSnap(); for (const g of games) g.series = n; await saveGames(games); c.sel.clear(); c.selMode = false; scRefresh(); toastUndo('Moved to “' + n + '»: ' + games.length, snap); },
  scDel: async () => { const c = S.serCard, games = scList(c.name).filter(g => c.sel.has(g.id)); if (!games.length) return; if (!await confirmBox('Delete games from the catalog: ' + games.length + '? They can be restored from the trash.', 'Delete')) return; const snap = takeSnap(); for (const g of games) await removeGame(g.id); c.sel.clear(); c.selMode = false; scRefresh(); toastUndo('Games deleted: ' + games.length, snap); },
  scAdd: async () => {
    const c = S.serCard, r = await choose({ title: 'Add games to the series', items: [{ id: 'cat', label: 'From the catalog (pick games)' }, { id: 'igdb', label: 'Find in IGDB (series search)' }] });
    if (r === 'igdb') return ACT.scSearch(); if (r !== 'cat') return;
    const k = serKey(c.name), items = S.games.filter(g => !g.series || serKey(g.series) !== k).sort((a, b) => !!a.series - !!b.series || String(a.name).localeCompare(String(b.name), LOC)).map(g => ({ id: g.id, label: g.name + (g.year ? ' (' + g.year + ')' : ''), sub: g.series || 'no series' }));
    const sel = await choose({ title: 'Catalog games', multi: true, search: true, items }); if (!sel || !sel.length) return;
    const games = sel.map(gameById).filter(Boolean), snap = takeSnap(); for (const g of games) g.series = c.name; await saveGames(games); scRefresh(); toastUndo('Added to the series: ' + games.length, snap);
  },
  scNameCheck: async () => {
    const c = S.serCard; if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
    toast('Checking the series name…'); try { S.serFix = await serNameCheck(c.name); drawSerFix(); } catch (e) { logErr('series name check', e); toast(e.message); }
  },
  serFixRename: async () => { const f = S.serFix; if (!f || !f.rename) return; const r = await serRenameAll(f.name, f.main.name); f.name = r.n; f.rename = false; f.total = scList(r.n).length; render(); drawSerFix(); toastUndo('Series renamed', r.snap); },
  serFixMove: async t => {
    const f = S.serFix, g = f && f.groups[+t.dataset.i]; if (!g) return; const n = canonSeries(g.col.name), snap = takeSnap();
    for (const x of g.games) x.series = n; await saveGames(g.games); f.groups.splice(+t.dataset.i, 1); f.total = scList(f.name).length; render(); drawSerFix(); toastUndo('Moved to “' + n + '»: ' + g.games.length, snap);
  },
  serFixDelete: async () => { const f = S.serFix; if (!f) return; const snap = takeSnap(); await serApplyIssue({ kind: 'missing', series: f.name }); closeSheet(); S.retGame = null; S.tab = 'series'; render(); toastUndo('Series deleted and cleared in the games', snap); },
  serVerifyAll: () => serVerifyAll(),
  serIssues: () => drawSerIssues(),
  serIssueApply: async t => { const L = S.serIssues || [], i = +t.dataset.i, x = L[i]; if (!x) return; const snap = takeSnap(); await serApplyIssue(x); L.splice(i, 1); render(); drawSerIssues(); toastUndo('Fixed', snap); },
  serIssueSkip: t => { const L = S.serIssues || [], i = +t.dataset.i, x = L[i]; if (!x) return; const k = serMap('serSkip'); if (x.kind === 'move') x.games.forEach(id => { k['g|' + id] = 1; }); else k[(x.kind === 'missing' ? 'm|' : 'r|') + serKey(x.series)] = 1; saveSet(); L.splice(i, 1); render(); drawSerIssues(); },
  serIssuesAll: async () => {
    const L = S.serIssues || []; if (!L.length) return; const m = L.filter(x => x.kind === 'move').reduce((a, x) => a + x.games.length, 0), r = L.filter(x => x.kind === 'rename').length, d = L.filter(x => x.kind === 'missing').length;
    if (!await confirmBox('Apply all fixes? Games to move: ' + m + ', series to rename: ' + r + ', series to delete: ' + d + '. You can undo this.', 'Apply')) return;
    const snap = takeSnap(); for (const k of ['move', 'rename', 'missing']) for (const x of L.filter(y => y.kind === k)) await serApplyIssue(x);
    S.serIssues = []; closeSheet(); render(); toastUndo('Problems fixed: ' + L.length, snap);
  },
  serCheckAll: () => serCheckAll(),
  serOnlyInc: () => { S.set.serOnlyInc = !S.set.serOnlyInc; saveSet(); render(); },
  serType: t => { const v = +t.dataset.v, cur = serTypes().slice(), i = cur.indexOf(v); if (i >= 0) { if (cur.length < 2) return; cur.splice(i, 1); } else cur.push(v); S.set.serTypes = cur; saveSet(); serApply(); renderSearchBody(); },
  serTypes: () => { const c = S.search.chk; if (!c) return; c.showTypes = !c.showTypes; renderSearchBody(); },
  serMark: () => { const c = S.search.chk; if (!c) return; const m = serMap('serOk'), k = serKey(c.name); if (m[k]) delete m[k]; else m[k] = 1; saveSet(); renderSearchBody(); toast(m[k] ? 'Series marked as complete' : 'Mark removed'); },
  serOnly: () => { const c = S.search.chk; if (!c) return; c.onlyMiss = !c.onlyMiss; serApply(); renderSearchBody(); },
  serFuture: () => { S.set.serFuture = !S.set.serFuture; saveSet(); serApply(); renderSearchBody(); },
  serShowIgn: () => { const s = S.search, c = s.chk; if (!c) return; c.showIgn = !c.showIgn; s.sel.clear(); serApply(); renderSearchBody(); },
  serSel: () => { const s = S.search; s.selMode = !s.selMode; if (!s.selMode) s.sel.clear(); renderSearchBody(); },
  serSelMiss: () => { const s = S.search; s.selMode = true; s.results.forEach(i => { if (!i.have && !i.ign) s.sel.add(i.rid); }); renderSearchBody(); },
  serAddSel: () => serAddSelected(),
  serIgnSel: () => {
    const s = S.search, c = s.chk; if (!c || !s.sel.size) return; const k = serKey(c.name), ids = new Set(serMap('serIgnore')[k] || []), pick = s.results.filter(i => s.sel.has(i.rid)).map(i => i.gid);
    if (c.showIgn) pick.forEach(id => ids.delete(id)); else pick.forEach(id => ids.add(id));
    serMap('serIgnore')[k] = Array.from(ids); saveSet(); s.sel.clear(); serApply(); renderSearchBody(); toast(c.showIgn ? 'Games returned to the series: ' + pick.length : 'Games hidden from the series check: ' + pick.length);
  },
  serRebind: () => { const s = S.search, nm = s.chk ? s.chk.name : ''; if (!nm) return; s.bind = nm; s.kind = 'series'; s.src = 'igdb'; s.q = nm; s.stack = []; s.chk = null; s.cols = []; s.results = []; s.token++; s.loading = false; s.mode = 'search'; S.tab = 'search'; render(); runSearch(true); },
  serBindCancel: () => { const s = S.search; s.bind = ''; s.q = ''; s.kind = 'games'; s.src = S.set.mainSrc; s.cols = []; s.results = []; s.started = false; S.tab = 'series'; render(); },
  bundleOpen: t => { const rid = t.dataset.rid; showBundle(rid, t.dataset.t || (S.search.results.find(x => x.rid === rid) || {}).name || '', false); },
  bundleDone: () => { const it = pendingItem(), p = S.pending; if (!it) return; const g = gameById(((p && p.added) || [])[0]); if (!g) return toast('First add at least one game from the bundle'); linkItem(it, g); },
  itBundle: t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it || !it.bundle) return; S.pending = { itemId: it.id, scroll: $('#view').scrollTop, added: [] }; Object.assign(S.search, { q: it.text, src: 'igdb' }); fClear(S.search.f); S.retGame = null; showBundle(it.bundle.rid, it.bundle.name, true); },
  itBundleFilter: () => { S.inBundleOnly = !S.inBundleOnly; render(); },
  sMore: () => runSearch(false),
  sfGenre: async () => { try { const l = await loadLists(), f = S.search.f, r = await choose({ title: 'Select genres', multi: true, search: true, selected: fa(f, 'genres'), items: l.genres.map(x => ({ id: x.id, label: x.name })) }); if (r !== null) { f.genres = r; f.genreNames = r.map(id => (l.genres.find(x => String(x.id) === String(id)) || {}).name || id); closeSheet(); renderSearchBody(); runSearch(true); } } catch (e) { toast(e.message); } },
  sfPlatform: async () => { try { const l = await loadLists(), f = S.search.f, r = await choose({ title: 'Select platforms', multi: true, search: true, selected: fa(f, 'platforms'), items: l.platforms.map(x => ({ id: x.id, label: x.name })) }); if (r !== null) { f.platforms = r; f.platformNames = r.map(id => (l.platforms.find(x => String(x.id) === String(id)) || {}).name || id); closeSheet(); renderSearchBody(); runSearch(true); } } catch (e) { toast(e.message); } },
  sfYear: async () => { const y = new Date().getFullYear(), items = []; for (let i = y + 1; i >= 1975; i--) items.push({ id: i, label: String(i) }); const f = S.search.f, r = await choose({ title: 'Release years', multi: true, search: true, selected: fa(f, 'years'), items }); if (r !== null) { f.years = r.map(Number).sort((a, b) => b - a); closeSheet(); renderSearchBody(); runSearch(true); } },
  sfTypes: async () => { const r = await choose({ title: 'IGDB card types', multi: true, selected: searchTypes(), items: IGDB_TYPES.map(([id, label]) => ({ id, label, sub: isBundleType(id) ? 'several games in one card' : '' })) }); if (r === null) return; if (!r.length) return toast('Select at least one type'); const t = r.map(Number).sort((a, b) => a - b); if (t.join() === DEF_TYPES.join()) delete S.set.searchTypes; else S.set.searchTypes = t; saveSet(); closeSheet(); renderSearchBody(); runSearch(true); },
  sfChips: async () => { const r = await choose({ title: 'Type chips (the “selected” mode of the “Types” button)', multi: true, selected: typeChipsVis(), items: IGDB_TYPES.map(([id, label]) => ({ id, label })) }); if (r === null) return; const t = r.map(Number).sort((a, b) => a - b); if (t.join() === ALL_TYPES.join()) delete S.set.typeChips; else S.set.typeChips = t; saveSet(); closeSheet(); renderSearchBody(); },
  tfChip: t => { const s = S.search, v = +t.dataset.v, i = s.tf.indexOf(v); if (i >= 0) s.tf.splice(i, 1); else s.tf.push(v); renderSearchBody(); const sb = $('#srBody'); if (sb) sb.scrollTop = 0; },
  sfRating: async () => { const r = await choose({ title: 'Minimum rating', items: [{ id: 0, label: 'All' }, { id: 5, label: '★ 5+' }, { id: 6, label: '★ 6+' }, { id: 7, label: '★ 7+' }, { id: 8, label: '★ 8+' }, { id: 9, label: '★ 9+' }] }); if (r !== null) { S.search.f.minRating = +r; closeSheet(); renderSearchBody(); runSearch(true); } },
  openIgdb: t => openIgdbSheet(t.dataset.rid),
  openUrl: t => openExternal(t.dataset.u),
  sSrcSwitch: () => { const s = S.search; s.src = otherSrc(s.src); fClear(S.search.f); s.token++; render(); runSearch(true); },
  igdbTap: t => { const s = S.search; if (s.chk && s.selMode && s.mode === 'series') { const r = t.dataset.rid, sb = $('#srBody'), y = sb ? sb.scrollTop : 0; if (s.sel.has(r)) s.sel.delete(r); else s.sel.add(r); renderSearchBody(); const b2 = $('#srBody'); if (b2) b2.scrollTop = y; return; } return openIgdbSheet(t.dataset.rid); }, // всегда открывает карточку: добавить игру можно только из неё
  rsAdd: async t => {
    const rid = t.dataset.rid; if (adding.has(rid)) return;
    const pit = pendingItem(), job = addFromIgdb(rid, (S.rs ? S.rs.colls : []).slice(), Object.assign({ bg: true }, itemAddOpts(bundleMode() ? null : pit))); // запись игры идёт сразу, обложка в фоне
    if (S.rsRefresh) S.rsRefresh(); // кнопка тут же превращается в «Добавляю…»
    try {
      const g = await job;
      if (g) { toast('Added: ' + g.name); S.rsFlash = { rid, until: Date.now() + 2500 }; if (tryLinkPending(g)) { closeSheet(); return; } setTimeout(() => { if (S.rsRefresh) S.rsRefresh(); }, 2600); }
    } catch (er) { toast(er.message); }
    if (S.rsRefresh) S.rsRefresh(); renderSearchBody();
  },
  rsChip: async t => {
    const rid = S.rs.rid, id = t.dataset.id, cat = gameByRid(rid); let on; if (adding.has(rid)) return;
    if (cat) { if (id === DONE_ID) { cat.done = !cat.done; cat.doneDate = cat.done ? todayStr() : ''; on = cat.done; } else { const i = cat.collections.indexOf(id); i < 0 ? cat.collections.push(id) : cat.collections.splice(i, 1); on = i < 0; } await saveGame(cat); }
    else { const c = S.rs.colls, i = c.indexOf(id); i < 0 ? c.push(id) : c.splice(i, 1); on = i < 0; }
    if (t.classList) t.classList.toggle('on', on); if (id === DONE_ID) t.textContent = (on ? '✓ ' : '') + 'Completed';
  },
  rsNewColl: async () => { const c = await createCollection(); if (!c) return; const cat = gameByRid(S.rs.rid); if (cat) { if (!cat.collections.includes(c.id)) cat.collections.push(c.id); await saveGame(cat); } else S.rs.colls.push(c.id); openIgdbSheet(S.rs.rid, true); },
  rsLink: t => { const g = gameByRid(t.dataset.rid); if (g && tryLinkPending(g)) closeSheet(); },
  openStats: () => { S.tab = 'stats'; render(); $('#view').scrollTop = 0; },
  trashRestore: t => restoreGames([t.dataset.id]),
  trashClear: async () => { if (!await confirmBox('Delete everything from the trash with no way to restore?', 'Empty')) return; for (const r of S.trash) await DB.del('trash', r.id); S.trash = []; render(); },
  setMinRating: t => { S.set.f.minRating = +t.dataset.v; saveSet(); libRefilter(); if (sheetEl) openFilters(); },
  sSort: async () => { const cur = S.set.searchSort || 'rel', r = await choose({ title: 'Sort results', items: SEARCH_SORTS.map(([id, label]) => ({ id, label: (id === cur ? '✓ ' : '') + label })) }); if (!r) return; if (r === 'rel') delete S.set.searchSort; else S.set.searchSort = r; saveSet(); sortResults(); renderSearchBody(); const sb = $('#srBody'); if (sb) sb.scrollTop = 0; },
  serSort: async () => { const cur = S.set.serSort || 'alpha', r = await choose({ title: 'Sort series', items: SER_SORTS.map(([id, label]) => ({ id, label: (id === cur ? '✓ ' : '') + label })) }); if (r) { if (r === 'alpha') delete S.set.serSort; else S.set.serSort = r; saveSet(); render(); } },
  typeQuick: () => { const m = (chipMode() + 1) % 3; S.set.chipMode = m; if (m === 1) delete S.set.chipMode; if (m === 0 || m === 2) S.search.tf = []; saveSet(); renderSearchBody(); }, // чипы типов: все -> выбранные в фильтре -> выключены
  serFind: () => { // поиск игр серии в IGDB прямо из карточки игры (как кнопка «Игры серии» в поиске); без привязки к источнику ищем по названию серии
    const d = S.sheet.draft, nm = ((($('#f_series') || {}).value) || d.series || '').trim(), src = ['igdb', 'rawg'].find(k => d[k + 'Id']);
    if (!nm) return toast('Enter a series first');
    if (PROV.igdb.ready()) { S.retGame = { id: d.id, tab: S.tab }; return showSeriesView(nm, {}); } // поиск по серии: все игры серии IGDB, что уже в каталоге отмечено ✓
    if (src) return ACT.seriesIgdb({ dataset: { src } }); S.retGame = { id: d.id, tab: S.tab }; Object.assign(S.search, { q: nm, src: S.set.mainSrc || 'igdb', mode: 'search' }); fClear(S.search.f); S.tab = 'search'; closeSheet(); render(); runSearch(true);
  },
  zoom: t => { const k = t.dataset.k, R = ZOOM_RANGE[k], c = colsFor(k); S.set.zoom[k] = c >= R[1] ? R[0] : c + 1; saveSet(); if (S.tab === 'library') renderLibrary(); else render(); },
  setLang: t => { try { if (t.dataset.v) localStorage.setItem('gc_lang', t.dataset.v); else localStorage.removeItem('gc_lang'); } catch (e) { /* ignore */ } location.reload(); }, // язык переключается перезагрузкой: русская и английская сборки лежат в разных файлах
  setTheme: t => { S.set.theme = t.dataset.v; saveSet(); applyTheme(); render(); },
  unblock: () => { S.block = null; render(); if (S.tab === 'search') runSearch(true); },
  saveSgdb: async () => { S.set.sgdbKey = $('#sgdbIn').value.trim(); await saveSet(); toast(S.set.sgdbKey ? 'SteamGridDB key saved' : 'Key deleted'); },
  sgdbOpen: () => { const id = S.sheet.draft.id; closeSheet(); openSgdb(id); },
  sgdbUse: async t => { const gr = S.sgdb && S.sgdb.grids[+t.dataset.i], g = S.sgdb && gameById(S.sgdb.gid); if (!gr || !g) return; toast('Loading the cover…'); await applyCoverUrl(g, gr.url); closeSheet(); toast('Cover replaced'); render(); },
  hltbOpen: () => { const n = (($('#f_name') || {}).value || '').trim(); if (!n) return toast('Enter a title'); openExternal('https://howlongtobeat.com/?q=' + encodeURIComponent(n)); },
  cubiqOpen: () => { const n = (($('#f_name') || {}).value || '').trim(); if (!n) return toast('Enter a title'); openExternal('https://cubiq.ru/gametime/?s=' + encodeURIComponent(n).replace(/%20/g, '+')); },
  sgdbOff: () => toast('SteamGridDB is switched on in settings'),
  toggleSgdb: () => { S.set.sgdbOn = !S.set.sgdbOn; saveSet(); render(); },
  setMainSrc: t => { S.set.mainSrc = t.dataset.v === 'rawg' ? 'rawg' : 'igdb'; S.search.src = S.set.mainSrc; S.search.results = []; S.search.started = false; saveSet(); render(); },
  saveRawg: async () => { S.set.rawgKey = $('#rawgIn').value.trim(); if (S.block && S.block.src === 'rawg') S.block = null; await saveSet(); S.lists = {}; if (!S.set.rawgKey) return toast('RAWG key deleted'); try { await rawg('/genres'); toast('The RAWG key works'); } catch (e) { toast(e.message); } },
  saveQuota: () => { const q = S.set.rawgQuota; q.left = Math.max(0, +$('#rqLeft').value || 0); const d = $('#rqRenew').value; if (d) q.renew = d; S.set.rawgWarn = 0; rawgQuotaTick(); saveSet(); toast('Remainder and date saved'); render(); },
  shMgr: async () => {
    const st = await shotStats(); if (!st.length) return toast('No screenshots in the database');
    openSheet('<div class="hdr2"><h2>Screenshots in the database</h2></div><div class="sub">Mark the games whose screenshots should be deleted</div><div id="smList">' + st.map(x => '<label class="row"><span><input type="checkbox" data-gid="' + x.id + '"> ' + esc(x.name) + '</span><span class="sub">' + x.n + ' pcs · ' + fmtSize(x.size) + '</span></label>').join('') + '</div><div class="toolbar"><button class="btn red" data-act="shMgrDel">Delete for the selected</button><button class="btn" data-act="closeSheet">Close</button></div>');
  },
  shMgrDel: async () => {
    const ids = Array.from($$('#smList input')).filter(i => i.checked).map(i => i.dataset.gid); if (!ids.length) return toast('Nothing selected');
    if (!await confirmBox('Delete screenshots of the selected games: ' + ids.length + '?', 'Delete')) return; await delShots(ids); closeSheet(); render();
  },
  shDelAll: async () => {
    const st = await shotStats(); if (!st.length) return toast('No screenshots in the database');
    if (!await confirmBox('Delete all screenshots from the database (' + st.reduce((a, x) => a + x.n, 0) + ' pcs, ' + fmtSize(st.reduce((a, x) => a + x.size, 0)) + ')? The games stay.', 'Delete all')) return; await delShots(st.map(x => x.id)); render();
  },
  gotoGenre: t => { const v = t.dataset.v; closeSheet(); Object.assign(S.set.f, { q: '', years: [], genres: [v], platforms: [], series: [], franchise: [], collections: [], props: [], addedFrom: '', addedTo: '', seriesMode: '', franchiseMode: '', maxTime: 0, done: '', minRating: 0 }); saveSet(); S.tab = 'library'; render(); },
  rsGenre: async t => { try { const src = parseRid(S.rs.rid).src; S.search.src = src; const l = await loadLists(src), g = l.genres.find(x => x.name === t.dataset.v || canonGenre(x.name) === t.dataset.v); if (!g) return toast('Genre not found in the list ' + PROV[src].name); Object.assign(S.search.f, { genres: [String(g.id)], genreNames: [g.name] }); closeSheet(); S.tab = 'search'; render(); runSearch(true); } catch (e) { toast(e.message); } },
  rsPlat: async t => { try { const src = parseRid(S.rs.rid).src; S.search.src = src; const l = await loadLists(src), p = l.platforms.find(x => x.name === t.dataset.v || canonPlat(x.name) === t.dataset.v); if (!p) return toast('Platform not found in the list ' + PROV[src].name); Object.assign(S.search.f, { platforms: [String(p.id)], platformNames: [p.name] }); closeSheet(); S.tab = 'search'; render(); runSearch(true); } catch (e) { toast(e.message); } },
  backupNow: async () => { await exportData(true); renderLibHead(); },
  backupLater: () => { S.set.lastRemind = Date.now(); saveSet(); renderLibHead(); },
  backupFreq: async () => {
    const r = await askChoose({ title: 'Backup reminders', items: [['7', 'Weekly'], ['14', 'Every 2 weeks'], ['30', 'Monthly'], ['0', 'Do not remind']].map(x => ({ id: x[0], label: x[1] })) });
    if (r === null) return; S.set.backupDays = +r; saveSet(); render();
  },
  openSaved: async () => {
    const saved = S.set.saved || [];
    const items = PRESETS.map(p => ({ id: p.id, label: p.name, sub: 'ready-made preset', ico: '⚡' })).concat(saved.map(x => ({ id: 's:' + x.id, label: x.name, sub: 'saved', ico: '★' })))
      .concat([{ id: '__save', label: '＋ Save the current filters…', ico: '💾' }, { id: '__reset', label: 'Reset all filters', ico: '✕' }]).concat(saved.length ? [{ id: '__del', label: 'Delete a saved one…', ico: '🗑' }] : []);
    const r = await askChoose({ title: 'Filter presets', items }); if (r === null) return;
    if (r === '__reset') return applyFilterSet({});
    if (r === '__save') {
      if (!activeCount()) return toast('Set the filters first');
      const name = await askPrompt('Preset name', '', 'for example: Series X, not completed'); if (!name) return;
      const snap = JSON.parse(JSON.stringify(S.set.f)); snap.q = ''; const old = saved.find(x => x.name.toLowerCase() === name.toLowerCase());
      if (old) old.f = snap; else saved.push({ id: uid(), name, f: snap }); S.set.saved = saved; saveSet(); return toast('Preset saved: ' + name);
    }
    if (r === '__del') { const d = await askChoose({ title: 'Delete the preset', items: saved.map(x => ({ id: x.id, label: x.name, ico: '🗑' })) }); if (d === null) return; S.set.saved = saved.filter(x => x.id !== d); saveSet(); return toast('Preset deleted'); }
    const pr = PRESETS.find(p => p.id === r); if (pr) { const f = JSON.parse(JSON.stringify(DEFAULTS.f)); pr.make(f); return applyFilterSet(f); }
    const sv = saved.find(x => 's:' + x.id === r); if (sv) applyFilterSet(sv.f);
  },
  clearMaxTime: () => { S.set.f.maxTime = 0; saveSet(); libRefilter(); if (sheetEl) openFilters(); },
  pickNext: () => { S.nx = null; S.nxOpen = false; showNext(); },
  setFranchiseMode: t => { S.set.f.franchiseMode = t.dataset.v || ''; saveSet(); libRefilter(); if (sheetEl) openFilters(); },
  setSeriesMode: t => { S.set.f.seriesMode = t.dataset.v || ''; saveSet(); libRefilter(); if (sheetEl) openFilters(); },
  tcolToggle: t => { const tc = S.set.tcols = textCols(); tc[t.dataset.k] = tc[t.dataset.k] ? 0 : 1; saveSet(); openCols(); renderLibrary(); },
  groupOff: () => { S.set.group = ''; saveSet(); renderLibrary(); },
  openGroup: async () => {
    for (;;) {
      const cur = S.set.group || '', desc = S.set.groupDir === 'desc';
      const items = GROUPS.map(g => ({ id: g[0] || '__none', label: (cur === g[0] ? '✓ ' : '') + g[1], ico: g[0] ? '▤' : '✕' }));
      items.push({ id: '__dir', label: 'Group order: ' + (desc ? 'descending ⇩' : 'ascending ⇧'), sub: 'tap to switch', ico: '⇅' });
      const r = await askChoose({ title: 'List grouping', items }); if (r === null) return;
      if (r === '__dir') { S.set.groupDir = desc ? 'asc' : 'desc'; saveSet(); renderLibrary(); continue; }
      S.set.group = r === '__none' ? '' : r; saveSet(); renderLibrary(); return;
    }
  },
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
    sh.genresEdit = !sh.genresEdit; row.classList.toggle('hidden', !sh.genresEdit); t.innerHTML = sh.genresEdit ? 'Done' : I('edit');
    if (sh.genresEdit) focusEnd($('#f_genres'));
  },
  noop: () => {},
  shShowName: () => {
    const v = (($('#f_name') || {}).value || '').trim(); if (!v) return ACT.shEditName();
    const m = openModal(); m.innerHTML = '<h4>Title</h4><p style="overflow-wrap:anywhere">' + esc(v) + '</p><div class="acts"><span data-x="ok">Close</span></div>';
    modalCancel = () => closeModal(); m.onclick = e => { if (e.target.closest('[data-x]')) closeModal(); };
  },
  dictOpen: t => openDict(t.dataset.kind),
  dictAdd: async t => { const kind = t.dataset.kind, v = await askPrompt(kind === 'plat' ? 'Short platform name' : 'Genre name'); if (!v) return; if (kind === 'plat') canonPlat(v, true); else canonGenre(v, true); saveSet(); openDict(kind); },
  dictRow: async t => {
    const kind = t.dataset.kind, nm = t.dataset.n, plat = kind === 'plat', cnt = dictCount(kind, nm), d = dictOf(kind);
    const r = await askChoose({ title: nm + ' (games: ' + cnt + ')', items: [{ id: 'rename', label: 'Rename' + (plat ? ' (short name)' : '') }].concat(plat ? [{ id: 'long', label: 'Long name…', sub: d[nm].long || 'not set' }] : [], [{ id: 'merge', label: 'Merge with another…', sub: 'all games get the chosen name, and this name becomes a spelling variant' }, { id: 'del', label: 'Remove from the list', sub: cnt ? 'only if there are no games' : '' }]) });
    if (!r) return;
    if (r === 'rename') { const v = await askPrompt('New name', nm); if (!v) return; const snap = takeSnap(), n = await dictRename(kind, nm, v); toastUndo('Games changed: ' + n, snap); }
    else if (r === 'long') { const v = await askPrompt('Long name', d[nm].long || nm); if (!v) return; d[nm].long = v; S._pi = null; saveSet(); }
    else if (r === 'merge') {
      const to = await askChoose({ title: 'Merge “' + nm + '” with…', search: Object.keys(d).length > 10, items: Object.keys(d).filter(x => x !== nm).sort((a, b) => a.localeCompare(b, LOC)).map(x => ({ id: x, label: x, sub: '– games: ' + dictCount(kind, x) })) }); if (!to) return;
      if (!await confirmBox('Merge “' + nm + '” with “' + to + '”? Games that will change: ' + cnt + '. The name “' + nm + '” becomes a spelling variant of “' + to + '».', 'Merge')) return;
      const snap = takeSnap(), n = await dictMerge(kind, nm, to); toastUndo('Merged, games changed: ' + n, snap);
    } else if (r === 'del') { if (cnt) return toast('Used in games: ' + cnt + '. First merge it with another name'); delete d[nm]; S._pi = S._gi = null; saveSet(); }
    openDict(kind); renderKeep();
  },
  mgTool: () => openMergeTool(),
  mgMode: t => { S.mgYear = t.dataset.v === '1'; openMergeTool(); },
  mgOpen: t => openMergeCompare(t.dataset.ids.split(','), true),
  mgBack: () => openMergeTool(),
  mgCompare: () => drawMergeCompare(),
  mgMain: t => { const cards = S.mg.ids.map(mgCard).filter(Boolean); S.mg.main = t.dataset.id; S.mg.res = mgBase(mgCard(t.dataset.id), cards); drawMergeCompare(); },
  mgTake: t => { S.mg.res[t.dataset.k] = mgGet(mgCard(t.dataset.id), t.dataset.k); drawMergeCompare(); },
  mgAdd: t => { const k = t.dataset.k; S.mg.res[k] = mgUnion(S.mg.res[k], mgCard(t.dataset.id)[k]); drawMergeCompare(); },
  mgUnion: t => { const k = t.dataset.k; S.mg.res[k] = S.mg.ids.map(mgCard).filter(Boolean).reduce((a, c) => mgUnion(a, c[k]), S.mg.res[k] || []); drawMergeCompare(); },
  mgEdit: async t => {
    const k = t.dataset.k, f = MG_FIELDS.find(x => x[0] === k), r = S.mg.res, cards = S.mg.ids.map(mgCard).filter(Boolean); let v;
    if (f[2] === 'b') r.done = !r.done;
    else if (f[2] === 'c') { v = await pickCollections('Result collections', r.collections || [], true); if (v === null) return; r.collections = v; }
    else if (f[2] === 'l') { v = await askPrompt(f[1] + ' (comma-separated)', (r[k] || []).join(', ')); if (v === null) return; r[k] = canonList(csv(v), k === 'platforms' ? canonPlat : canonGenre); }
    else { v = await askPrompt(f[1], r[k] == null ? '' : String(r[k]), '', f[2] === 'n' ? (k === 'year' ? 'int' : 'dec') : ''); if (v === null) return; r[k] = f[2] === 'n' ? (parseFloat(String(v).replace(',', '.')) || 0) : v.trim(); }
    drawMergeCompare();
  },
  clearAdded: () => { S.set.f.addedFrom = ''; S.set.f.addedTo = ''; saveSet(); libRefilter(); },
  shYoutube: async () => {
    const n = (($('#f_name') || {}).value || '').trim(); if (!n) return toast('Enter the title first');
    const qs = [n, n + ' gameplay', n + ' walkthrough'];
    const r = await askChoose({ title: 'YouTube: what to search', items: [{ id: '0', label: qs[0], sub: 'just the title', ico: '▶' }, { id: '1', label: qs[1], ico: '▶' }, { id: '2', label: qs[2], ico: '▶' }] });
    if (r === null) return; openYoutube(qs[+r] || n);
  },
  shSrcLine: () => { const d = S.sheet && S.sheet.draft; if (!d || !d.srcLine) return; const pr = parseLine(d.srcLine); S.retGame = { id: d.id, tab: S.tab }; closeSheet(); S.pending = null; S.search.q = pr ? pr.text : d.srcLine; S.search.src = S.set.mainSrc; S.search.mode = 'search'; fClear(S.search.f); S.tab = 'search'; render(); runSearch(true); },
  animToggle: () => { S.set.anim = !animOn(); S.set.animSet = true; saveSet(); render(); },
  hapticToggle: () => { S.set.haptic = S.set.haptic === false; saveSet(); if (S.set.haptic) buzz(30); render(); },
  shWiki: () => { const n = (($('#f_name') || {}).value || '').trim(); if (!n) return toast('Enter the title first'); openExternal('https://www.google.com/search?q=' + encodeURIComponent(n + ' wiki')); },
  mgDo: () => openMergePreview(),
  mgGo: async () => { const n = S.mg.ids.filter(i => !String(i).startsWith('virt_')).length - 1; const snap = takeSnap(); try { await applyMerge(S.mg); } catch (e) { return toast(e.message); } const rf = S.mgRefresh; S.mg = null; S.mgRefresh = false; S.mgVirt = null; closeSheet(); toastUndo(rf ? 'Data applied' : 'Merged, cards deleted: ' + n, snap); renderKeep(); },
  statGo: t => { // график статистики: открыть список игр с этим фильтром
    const f = S.set.f, k = t.dataset.k, v = t.dataset.v;
    Object.assign(f, { q: '', years: [], genres: [], platforms: [], series: [], franchise: [], props: [], collections: [], done: '', minRating: 0, addedFrom: '', addedTo: '', seriesMode: '', franchiseMode: '', maxTime: 0 });
    if (k === 'game') return openGameSheet(v);
    if (k === 'remainPlat') { f.platforms = [v]; f.done = 'no'; } else if (k === 'done') f.done = 'yes'; else if (k === 'years') f.years = [+v]; else f[k] = [v];
    S.tab = 'library'; S.selMode = false; S.sel.clear(); saveSet(); render(); $('#view').scrollTop = 0;
  },
  inAct: async t => {
    const m = t.dataset.m, items = Array.from(S.inSel).map(id => S.inbox.items.find(i => i.id === id)).filter(i => i && !i.done);
    if (m === 'x') { S.inSelMode = false; S.inSel.clear(); return rerenderInbox(); }
    if (m === 'all') { itemsOf(S.inboxList).filter(i => !i.done).forEach(i => S.inSel.add(i.id)); return rerenderInbox(); }
    if (!items.length) return toast('Select rows: long-press a row');
    if (m === 'colls') { const v = await pickCollections('Collections for the selected rows', [], true); if (v === null) return; items.forEach(i => { i.colls = v.slice(); }); }
    else if (m === 'done') { const r = await askChoose({ title: 'Completed', items: [{ id: 'yes', label: 'Mark as completed' }, { id: 'no', label: 'Not completed' }] }); if (!r) return; items.forEach(i => { i.markDone = r === 'yes'; }); }
    else if (m === 'reset') items.forEach(i => { delete i.colls; delete i.markDone; });
    for (const i of items) await DB.put('inboxItems', i);
    toast('Rows changed: ' + items.length); S.inSel.clear(); S.inSelMode = false; rerenderInbox();
  },
  retGame: () => { const r = S.retGame; S.retGame = null; if (!r) return; S.tab = r.tab; render(); if (gameById(r.id)) openGameSheet(r.id); },
  shEditName: async () => { const inp = $('#f_name'), v = await askPrompt('Game title', inp.value, '', '', 5); if (v === null) return; inp.value = v.trim(); markDirty(); },
  shMenu: async () => {
    const d = S.sheet.draft, srcs = srcsOf(d), miss = ['igdb', 'rawg'].filter(k => !d[k + 'Id']);
    const items = srcs.map(k => ({ id: 'refresh:' + k, label: 'Update from ' + PROV[k].name, sub: 'title, year, genres, platforms, description', ico: '🔄' })).concat([{ id: 'refreshTime', label: 'Update time from IGDB', sub: 'playtime only', ico: '⏱' }, { id: 'hltbOpen', label: 'HowLongToBeat', sub: 'playtime', ico: '⏱' }, { id: 'cubiqOpen', label: 'Cubiq.ru', sub: 'playtime', ico: '⏱' }])
      .concat(miss.map(k => ({ id: 'find:' + k, label: 'Find in ' + PROV[k].name, ico: '🔍' })), [{ id: 'chgSeries', label: 'Change the game’s series…', ico: '📚' }, { id: 'chgFranchise', label: 'Change the game’s franchise…', ico: '🏷️' }], d.series ? [{ id: 'seriesCatalog', label: 'Series in the catalog', ico: '📚' }] : [], srcs.map(k => ({ id: 'ser:' + k, label: 'Series ' + PROV[k].name, ico: '📚' })), d.franchise ? [{ id: 'frFind', label: 'Franchise games in IGDB', ico: '🏷️' }] : [], S.set.debug && d.igdbId ? [{ id: 'dbgGame', label: 'IGDB game dump (debugging)', ico: '🐞' }] : [], [{ id: 'shareGame', label: 'Share the game', ico: '↗' }]);
    const r = await askChoose({ title: 'Actions', items }); if (!r) return;
    if (r === 'refreshTime') return ACT.refreshTime();
    if (r.startsWith('refresh:')) return ACT.refreshIgdb({ dataset: { src: r.slice(8) } });
    if (r.startsWith('find:')) return ACT.findIgdb({ dataset: { src: r.slice(5) } });
    if (r === 'chgSeries') return ACT.pickSeries();
    if (r === 'chgFranchise') return ACT.pickFranchise();
    if (r === 'dbgGame') return dbgGameDump(((S.sheet && S.sheet.draft) || {}).igdbId);
    if (r.startsWith('ser:')) return ACT.seriesIgdb({ dataset: { src: r.slice(4) } });
    ACT[r]({ dataset: {} });
  },
  shCover: () => openCoverView(),
  shEdit: async t => {
    const k = t.dataset.k, inp = $('#f_' + k), titles = { year: 'Release year', rating: 'Rating (0-10)', time: 'Playtime, h' };
    const ex = k !== 'time' ? [] : [
      { label: 'IGDB', fn: async () => { const gid = S.sheet.draft.igdbId; if (!gid) { toast('The game has no IGDB entry'); return null; } try { const h = await igdbTimeOf(gid); if (!h) { toast('IGDB has no time for this game'); return null; } return h; } catch (e) { toast(e.message); return null; } } },
      { label: 'Cubiq', fn: () => { ACT.cubiqOpen(); return null; } }, { label: 'HLTB', fn: () => { ACT.hltbOpen(); return null; } }];
    const v = await askPrompt(titles[k], inp.value, '', k === 'year' ? 'int' : 'dec', 0, ex); if (v === null) return; let nv = String(v).replace(',', '.').trim(); if (k === 'rating' && +nv > 10) nv = '10'; inp.value = nv; markDirty();
  },
  editPlats: t => {
    const sh = S.sheet, row = $('#platsRow'); if (!sh || !row) return;
    sh.platsEdit = !sh.platsEdit; row.classList.toggle('hidden', !sh.platsEdit); t.innerHTML = sh.platsEdit ? 'Done' : I('edit');
    if (sh.platsEdit) focusEnd($('#f_platforms'));
  },
  shotAddFile: () => $('#shotFile').click(),
  shotSave: async t => { const url = S.igdbShots[+t.dataset.i]; if (!url) return; t.textContent = '…'; try { const gid = await sheetGameId(); if (gid) await saveIgdbShot(gid, url); } catch (e) { toast(e.message); } drawShots(); },
  shotSaveAll: () => saveAllShots(),
  shotDel: async (t, e) => {
    e.stopPropagation(); const sh = S.sheet; if (!sh || !await confirmBox('Delete the screenshot from the database?', 'Delete')) return;
    const gid = sh.draft.id, list = await getShots(gid); list.splice(+t.dataset.i, 1); await putShots(gid, list); drawShots();
  },
  shotRetry: t => { const w = t.closest('.shw'), im = w && w.querySelector('img'); if (!im) return; w.classList.remove('er'); const u = im.getAttribute('src') || ''; im.setAttribute('src', u.replace(/([?&])r=\d+&?/, '$1').replace(/[?&]$/, '') + (u.includes('?') ? '&' : '?') + 'r=' + Date.now()); },
  shot: t => { const g = t.dataset.g, i = +t.dataset.i || 0; if (g === 'local') openLb(S.shotUrls, i); else if (g === 'igdb') openLb(S.igdbShots, i); else openLb([t.dataset.full], 0); },
  listOpen: t => { S.inboxList = t.dataset.id; render(); $('#view').scrollTop = 0; },
  listBack: () => { S.inboxList = null; render(); },
  listMenu: (t, e) => { e.stopPropagation(); listMenu(t.dataset.id); },
  itAdd: async () => { const i = $('#itNew'); if (!i || !i.value.trim() || !S.inboxList) return; await addItems(S.inboxList, [i.value]); render(); const n = $('#itNew'); if (n) focusEnd(n); },
  itPaste: () => pasteModal(S.inboxList),
  itAuto: () => autoResolve(S.inboxList),
  itReview: () => reviewItems(S.inboxList),
  itRev: async t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (it && !it.done) { await reviewOne(it, 1, 1); render(); } },
  itToggleDone: () => { S.showDone = !S.showDone; render(); },
  itOpen: t => {
    const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it) return;
    if (it.done) { const g = gameById(it.gameId); if (g) openGameSheet(g.id); else toast('Game deleted from the catalog'); return; }
    S.pending = { itemId: it.id, scroll: $('#view').scrollTop }; S.search.src = S.set.mainSrc; S.search.q = it.text; S.search.mode = 'search'; S.tab = 'search'; render(); runSearch(true);
  },
  itOpts: t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (it && !it.done) itemOpts(it); },
  lstColls: async () => { const l = S.inbox.lists.find(x => x.id === S.inboxList); if (!l) return; const v = await pickCollections('Collections for the games of the list', l.colls || [], true); if (v === null) return; l.colls = v; await DB.put('inboxLists', l); render(); if (v.length) applyToLinked(l); },
  lstDone: async () => { const l = S.inbox.lists.find(x => x.id === S.inboxList); if (!l) return; l.markDone = !l.markDone; await DB.put('inboxLists', l); render(); if (l.markDone) applyToLinked(l); },
  itMatch: t => matchItem(S.inbox.items.find(i => i.id === t.dataset.id)),
  itEdit: async t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it || it.done) return; const n = await promptBox('Game title', it.text); if (n) { it.text = n; await DB.put('inboxItems', it); render(); } },
  itDel: async t => { const it = S.inbox.items.find(i => i.id === t.dataset.id); if (!it) return; if (!await confirmBox('Delete “' + it.text + '” from the list?', 'Delete')) return; S.inbox.items = S.inbox.items.filter(i => i.id !== it.id); await DB.del('inboxItems', it.id); render(); },
  pendingCancel: () => backToInbox(),
  pendingMatch: () => matchItem(pendingItem()),
  rsSeries: t => showSeries(t.dataset.rid, t.dataset.t),
  matchSave: () => { const g = id => +(($('#' + id) || {}).value || '').replace(/\D/g, ''); S.set.match = matchCfg({ match: { cLow: g('mcl0'), cHigh: g('mch0'), sLow: g('msl0'), sHigh: g('msh0') } }); saveSet(); toast('Saved'); render(); },
  matchReset: () => { S.set.match = { cLow: 85, cHigh: 98, sLow: 50, sHigh: 98 }; saveSet(); render(); },
  saveKey: async () => {
    S.set.igdbId = $('#idIn').value.trim(); S.set.igdbSecret = $('#secIn').value.trim(); S.set.igdbToken = ''; S.set.igdbExp = 0; S.block = null; await saveSet(); S.lists = {};
    if (!hasKeys()) return toast('Keys deleted');
    try { await igdb('/genres', 'fields id; limit 1;'); toast('The keys work'); } catch (e) { toast(e.message); }
  },
  export: async () => {
    if (!S.games.some(g => g.shotCount)) return exportData(true);
    const m = await choose({ title: 'Backup export', items: [{ id: 'full', label: 'Full backup', sub: 'with covers and screenshots' }, { id: 'lite', label: 'Without screenshots', sub: 'the file is noticeably smaller; data and covers are kept' }] });
    if (m) exportData(m === 'full');
  },
  import: () => $('#impFile').click(),
  propAdd: async () => { const n = await promptBox('Property name'); if (!n) return; if (S.props.some(p => normName(p.name) === normName(n))) return toast('A property with this name already exists'); const t = await choose({ title: 'Value type', items: [{ id: 'text', label: 'Text' }, { id: 'number', label: 'Number' }, { id: 'date', label: 'Date' }] }); if (!t) return; const p = { id: uid(), name: n, type: t }; S.props.push(p); await DB.put('props', p); render(); },
  propDel: async t => { if (!await confirmBox('Delete the property and its values for all games?', 'Delete')) return; const id = t.dataset.id; S.props = S.props.filter(p => p.id !== id); await DB.del('props', id); for (const g of S.games) if (g.props && id in g.props) { delete g.props[id]; await saveGame(g); } S.set.f.props = S.set.f.props.filter(x => x !== id); saveSet(); render(); },
  install: async () => { if (installEvt) { installEvt.prompt(); installEvt = null; render(); } },
  guideOpen: () => openGuide(),
  srvZip: () => downloadServerZip(),
  syncAuto: () => { S.set.sync.auto = !S.set.sync.auto; saveSet(); render(); if (S.set.sync.auto) syncSoon(500); },
  syncSave: async () => {
    const y = S.set.sync; y.url = addrRead(); y.token = (($('#syTok') || {}).value || '').trim();
    saveSet(); if (!syncOn()) { toast('Enter the address and access code'); render(); return; }
    try { const r = await srv('check', {}, 15000); y.err = ''; y.igdb = !!r.igdb; saveSet(); toast('Connection OK ✓' + (r.games !== undefined ? ' Games on the server: ' + r.games : '')); }
    catch (e) { y.err = e.message; saveSet(); toast(e.message); }
    render();
  },
  syncRun: async () => {
    const y = S.set.sync, u = $('#syIp'), k = $('#syTok'); if (u) y.url = addrRead(); if (k) y.token = k.value.trim(); saveSet();
    await syncNow(true);
  },
  syncToggle: () => { const y = S.set.sync; y.on = y.on === false; saveSet(); render(); if (y.on) syncSoon(500); },
  syScheme: t => { const y = S.set.sync; y.url = addrRead(); y.scheme = t.dataset.v; const a = addrOf(y); if (y.url) y.url = y.scheme + '://' + a.host + (a.port ? ':' + a.port : ''); saveSet(); render(); },
  syncOff: async () => { if (!await confirmBox('Disconnect the server? The data on the device stays.', 'Disconnect')) return; S.set.sync.url = ''; S.set.sync.token = ''; S.set.sync.err = ''; saveSet(); render(); },
  wipe: async () => {
    const on = syncOn();
    if (!await confirmBox('Delete ALL games, collections, properties, images and the genre and platform lists' + (on ? ' on this device AND on your local server? Other devices will be cleared at their next sync' : ' on this device') + '? This cannot be undone.', 'Delete everything')) return;
    if (on) { try { await srv('wipe', {}, 60000); } catch (e) { return toast('The server was not cleared: ' + e.message + '. Nothing was deleted.'); } } // иначе данные вернулись бы с сервера при синхронизации
    for (const s of ['games', 'collections', 'props', 'covers', 'shots', 'inboxLists', 'inboxItems', 'trash', 'tomb']) await DB.clearRaw(s); DB.tombs.clear();
    S.trash = []; coverCache.clear(); S.games = []; S.collections = []; S.props = []; S.inbox = { lists: [], items: [] }; S.inboxList = null; S.lastGame = ''; S.set.platDict = {}; S.set.genreDict = {}; S._pi = S._gi = null; S.set.saved = []; S.set.f = clone(DEFAULTS.f); saveSet(); render(); toast('Data deleted');
  }
};
// веб-версия: стрелки влево/вправо листают открытые карточки (каталога и поиска)
document.addEventListener('keydown', e => {
  if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !sheetEl || modalEl || lbEl) return;
  const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '') || t.isContentEditable)) return;
  if (!carCtx()) return; e.preventDefault(); carGo(e.key === 'ArrowRight' ? 1 : -1);
});
document.addEventListener('click', e => {
  if (S.selMode && S.tab === 'library') { const r = e.target.closest('tr[data-gid]'); if (r && !e.target.closest('a')) { if (lp.fired) { lp.fired = false; return; } toggleSel(r.dataset.gid); return; } } // в режиме выбора строка отмечается нажатием в любом месте
  if (S.inSelMode && S.tab === 'inbox') { const r = e.target.closest('[data-iid]'); if (r) { if (lp.fired) { lp.fired = false; return; } toggleInSel(r.dataset.iid); return; } }
  const t = e.target.closest('[data-act]'); if (!t) return;
  const fn = ACT[t.dataset.act]; if (!fn) return; const r = fn(t, e);
  if (r && typeof r.catch === 'function') r.catch(er => { logErr('action «' + t.dataset.act + '»', er); try { er._logged = true; } catch (x) { /* ignore */ } throw er; });
});
// Долгое нажатие. На Android палец всегда немного дрожит, а система при долгом нажатии шлёт pointercancel и contextmenu,
// поэтому таймер отменяют только сдвиг больше 12 px и прокрутка, а само нажатие ловится ещё и по contextmenu.
const lpTarget = el => (S.tab === 'library' && el.closest('.card[data-gid], tr[data-gid], .tl[data-gid]')) || el.closest('[data-lpm]');
function lpFire(c) {
  if (!c || lp.fired) return; clearTimeout(lp.t); lp.fired = true;
  if (c.dataset.lpm === 'item') toggleInSel(c.dataset.iid, true); else if (c.dataset.lpm === 'coll') collMenu(c.dataset.id); else if (c.dataset.lpm === 'ser') serMenu(c.dataset.name); else if (c.dataset.lpm === 'fr') frMenu(c.dataset.name); else if (c.dataset.lpm === 'scgame') { const sc = S.serCard; if (sc) { sc.selMode = true; sc.sel.add(c.dataset.gid); scRefresh(); } } else toggleSel(c.dataset.gid, true);
}
document.addEventListener('input', e => { const t = e.target; if (!t || !t.id) return; if (t.id === 'syIp') { const v = ipMask(t.value); if (v !== t.value) t.value = v; } else if (t.id === 'syPort') { const v = t.value.replace(/\D/g, '').slice(0, 5); if (v !== t.value) t.value = v; } });
document.addEventListener('pointerdown', e => {
  lp.fired = false; clearTimeout(lp.t); if (e.pointerType === 'mouse' && e.target.closest && e.target.closest('.tlist')) return; /* мышью в тексте выделяют, а не включают режим выбора */ const c = lpTarget(e.target); if (!c) return;
  lp.x = e.clientX; lp.y = e.clientY; lp.t = setTimeout(() => lpFire(c), 500);
});
document.addEventListener('pointermove', e => { if (Math.abs(e.clientX - lp.x) + Math.abs(e.clientY - lp.y) > 12) clearTimeout(lp.t); }, true);
document.addEventListener('pointerup', () => { clearTimeout(lp.t); setTimeout(() => { lp.fired = false; }, 450); }, true);
document.addEventListener('scroll', () => clearTimeout(lp.t), true);
document.addEventListener('contextmenu', e => {
  if (e.target.closest && e.target.closest('.tlist') && !S.selMode) return; // в тексте обычное контекстное меню (копировать)
  if (e.target.closest && e.target.closest('.card, .tile, .lrow, tr[data-gid]')) e.preventDefault();
  if (e.target.closest) lpFire(lpTarget(e.target));
});
const rzBox = tbl => tbl.classList && tbl.classList.contains('mgt') ? 'mgW' : 'colW';
document.addEventListener('pointerdown', e => { // растягивание колонки за правый край заголовка (список игр и таблица объединения)
  const h = e.target.closest && e.target.closest('.rz'); if (!h) return;
  e.preventDefault(); e.stopPropagation(); clearTimeout(lp.t); lp.fired = true;
  const key = h.dataset.rz, tbl = h.closest('table'), th = h.closest('th'), x0 = e.clientX, w0 = th.getBoundingClientRect().width;
  const calc = x => Math.max(36, Math.min(700, Math.round(w0 + x - x0)));
  const apply = w => $$('[data-ck="' + key + '"]', tbl).forEach(el => { el.style.width = w + 'px'; el.style.minWidth = w + 'px'; el.style.maxWidth = w + 'px'; el.style.overflow = 'hidden'; el.style.textOverflow = 'ellipsis'; const d = el.querySelector && el.querySelector('.scd'); if (d) d.style.maxWidth = 'none'; });
  try { h.setPointerCapture(e.pointerId); } catch (er) { /* без захвата */ }
  const mv = ev => apply(calc(ev.clientX));
  const up = ev => { h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up); const b = rzBox(tbl); (S.set[b] = S.set[b] || {})[key] = calc(ev.clientX); saveSet(); fitSoon(); setTimeout(() => { lp.fired = false; }, 450); };
  h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
}, true);
document.addEventListener('dblclick', e => { // двойное нажатие на край заголовка возвращает ширину по умолчанию
  const h = e.target.closest && e.target.closest('.rz'); if (!h) return; const b = rzBox(h.closest('table')); if (S.set[b]) delete S.set[b][h.dataset.rz]; saveSet();
  if (b === 'mgW' && S.mg) drawMergeCompare(); else if (S.tab === 'library') renderKeep();
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
  else if (e.target.id === 'sfind') { S.sFind = e.target.value; const b = $('#tilesBox'); if (b) b.innerHTML = S.serKind === 'fr' ? franchiseTilesHtml() : seriesTilesHtml(); }
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
    if (u8[0] === 0x50 && u8[1] === 0x4b) { files = await zipRead(buf); const j = files.get('data.json'); if (!j) throw new Error('There is no data.json in the archive'); d = JSON.parse(new TextDecoder().decode(j)); }
    else d = JSON.parse(new TextDecoder().decode(u8));
    const noPics = (d.games || []).filter(g => g.shotCount > 0 && !(d.shots && (d.shots[g.id] || []).some(x => x.d || (x.file && files && files.has(x.file))))).length;
    if (noPics && !await confirmBox('The file contains links to screenshots (games: ' + noPics + '), but the images themselves are missing: the backup was made without screenshots, or this is a separate json from the archive. The games will be loaded without these screenshots. Continue?', 'Load without screenshots')) return;
    const mode = await choose({ title: 'Import: games in the file ' + ((d.games || []).length), items: [{ id: 'merge', label: 'Merge with the current data' }, { id: 'replace', label: 'Replace all data' }] });
    if (!mode) return;
    if (mode === 'replace' && !await confirmBox('The current data will be deleted. Continue?', 'Replace')) return;
    const n = await importData(d, mode, files); await saveSet(); toast('Games imported: ' + n); render();
  } catch (er) { toast(er.message || 'Could not read the file'); }
});
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (S.tab === 'settings') render(); });

function applyTheme() {
  const t = S.set.theme || 'dark';
  const dark = t === 'dark' || (t === 'auto' && !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches));
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', dark ? '#0b0b0d' : '#f2f3f6');
}
Object.assign(ACT, {
  frNav: t => { if (t.dataset.id) openGameSheet(t.dataset.id, +t.dataset.d); },
  frOpen: t => { if (lp.fired) { lp.fired = false; return; } if (t.dataset.name) { S.retGame = null; return openFrCard(t.dataset.name); } frInLibrary(t.dataset.name); },
  frMenu: (t, e) => { e.stopPropagation(); frMenu(t.dataset.name); },
  frCheck: t => { const d = S.sheet && S.sheet.draft; if (d && d.id) S.retGame = { id: d.id, tab: S.tab }; showFranchiseView(t.dataset.name, { from: S.tab, onlyMiss: true }); },
  frCard: t => { const nm = (t && t.dataset && t.dataset.name) || (($('#f_franchise') || {}).value || '').trim(); if (!nm) return; const d = S.sheet && S.sheet.draft; if (d && d.id && !S.sheet.isNew) S.retGame = { id: d.id, tab: S.tab }; openFrCard(nm); },
  fcBack: () => { const r = S.retGame; if (r && gameById(r.id)) return ACT.retGame(); S.retGame = null; S.serKind = 'fr'; S.tab = 'series'; render(); },
  fcMenu: () => frMenu(S.frCard.name),
  fcCatalog: () => frInLibrary(S.frCard.name),
  fcVmode: () => { S.set.vmode = S.set.vmode || {}; S.set.vmode.frcard = vmodeOf('frcard') === 'list' ? 'tiles' : 'list'; saveSet(); render(); },
  fcSearch: () => showFranchiseView(S.frCard.name, { from: 'frcard' }),
  fcCheck: () => showFranchiseView(S.frCard.name, { from: 'frcard', onlyMiss: true }),
  fcMark: () => { const m = serMap('frOk'), k = serKey(S.frCard.name); if (m[k]) delete m[k]; else m[k] = 1; saveSet(); fcRefresh(); toast(m[k] ? 'Franchise marked as checked and complete' : 'Mark removed'); },
  fcSel: () => { const c = S.frCard; c.selMode = !c.selMode; if (!c.selMode) c.sel.clear(); fcRefresh(); },
  fcSelAll: () => { const c = S.frCard, l = fcList(c.name); if (c.sel.size === l.length) c.sel.clear(); else l.forEach(g => c.sel.add(g.id)); fcRefresh(); },
  fcGame: t => { if (lp.fired) { lp.fired = false; return; } const c = S.frCard, id = t.dataset.gid; if (c.selMode) { if (c.sel.has(id)) c.sel.delete(id); else c.sel.add(id); return fcRefresh(); } S.shown = fcList(c.name); openGameSheet(id); },
  fcRemove: async () => { const c = S.frCard, games = fcList(c.name).filter(g => c.sel.has(g.id)); if (!games.length) return; const snap = takeSnap(); for (const g of games) g.franchise = ''; await saveGames(games); c.sel.clear(); c.selMode = false; fcRefresh(); toastUndo('Removed from the franchise: ' + games.length, snap); },
  fcMove: async () => { const c = S.frCard, games = fcList(c.name).filter(g => c.sel.has(g.id)); if (!games.length) return; const n = await chooseFranchise(c.name); if (!n) return; const snap = takeSnap(); for (const g of games) g.franchise = n; await saveGames(games); c.sel.clear(); c.selMode = false; fcRefresh(); toastUndo('Moved to “' + n + '»: ' + games.length, snap); },
  fcDel: async () => { const c = S.frCard, games = fcList(c.name).filter(g => c.sel.has(g.id)); if (!games.length) return; if (!await confirmBox('Delete games from the catalog: ' + games.length + '? They can be restored from the trash.', 'Delete')) return; const snap = takeSnap(); for (const g of games) await removeGame(g.id); c.sel.clear(); c.selMode = false; fcRefresh(); toastUndo('Games deleted: ' + games.length, snap); },
  fcAdd: async () => {
    const c = S.frCard, r = await choose({ title: 'Add games to the franchise', items: [{ id: 'cat', label: 'From the catalog (pick games)' }, { id: 'igdb', label: 'Find in IGDB (franchise search)' }] });
    if (r === 'igdb') return ACT.fcSearch(); if (r !== 'cat') return;
    const k = serKey(c.name), items = S.games.filter(g => !g.franchise || serKey(g.franchise) !== k).sort((a, b) => !!a.franchise - !!b.franchise || String(a.name).localeCompare(String(b.name), LOC)).map(g => ({ id: g.id, label: g.name + (g.year ? ' (' + g.year + ')' : ''), sub: g.franchise || 'no franchise' }));
    const sel = await choose({ title: 'Catalog games', multi: true, search: true, items }); if (!sel || !sel.length) return;
    const games = sel.map(gameById).filter(Boolean), snap = takeSnap(); for (const g of games) g.franchise = c.name; await saveGames(games); fcRefresh(); toastUndo('Added to the franchise: ' + games.length, snap);
  },
  fcNameCheck: async () => {
    const c = S.frCard; if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings');
    toast('Checking the franchise name…'); try { S.frFix = await frNameCheck(c.name); drawFrFix(); } catch (e) { logErr('franchise name check', e); toast(e.message); }
  },
  frFixRename: async () => { const f = S.frFix; if (!f || !f.rename) return; const r = await frRenameAll(f.name, f.main.name); f.name = r.n; f.rename = false; f.total = fcList(r.n).length; render(); drawFrFix(); toastUndo('Franchise renamed', r.snap); },
  frFixMove: async t => {
    const f = S.frFix, g = f && f.groups[+t.dataset.i]; if (!g) return; const n = canonFranchise(g.col.name), snap = takeSnap();
    for (const x of g.games) x.franchise = n; await saveGames(g.games); f.groups.splice(+t.dataset.i, 1); f.total = fcList(f.name).length; render(); drawFrFix(); toastUndo('Moved to “' + n + '»: ' + g.games.length, snap);
  },
  frFixDelete: async () => { const f = S.frFix; if (!f) return; const snap = takeSnap(); await frApplyIssue({ kind: 'missing', franchise: f.name }); closeSheet(); S.retGame = null; S.serKind = 'fr'; S.tab = 'series'; render(); toastUndo('Franchise deleted and cleared in the games', snap); },
  frVerifyAll: () => frVerifyAll(),
  frIssues: () => drawFrIssues(),
  frIssueApply: async t => { const L = S.frIssues || [], i = +t.dataset.i, x = L[i]; if (!x) return; const snap = takeSnap(); await frApplyIssue(x); L.splice(i, 1); render(); drawFrIssues(); toastUndo('Fixed', snap); },
  frIssueSkip: t => { const L = S.frIssues || [], i = +t.dataset.i, x = L[i]; if (!x) return; const k = serMap('frSkip'); if (x.kind === 'move') x.games.forEach(id => { k['g|' + id] = 1; }); else k[(x.kind === 'missing' ? 'm|' : 'r|') + serKey(x.franchise)] = 1; saveSet(); L.splice(i, 1); render(); drawFrIssues(); },
  frIssuesAll: async () => {
    const L = S.frIssues || []; if (!L.length) return; const m = L.filter(x => x.kind === 'move').reduce((a, x) => a + x.games.length, 0), r = L.filter(x => x.kind === 'rename').length, d = L.filter(x => x.kind === 'missing').length;
    if (!await confirmBox('Apply all fixes? Games to move: ' + m + ', franchises to rename: ' + r + ', franchises to delete: ' + d + '. You can undo this.', 'Apply')) return;
    const snap = takeSnap(); for (const k of ['move', 'rename', 'missing']) for (const x of L.filter(y => y.kind === k)) await frApplyIssue(x);
    S.frIssues = []; closeSheet(); render(); toastUndo('Problems fixed: ' + L.length, snap);
  },
  frCheckAll: () => frCheckAll(),
  frOnlyInc: () => { S.set.frOnlyInc = !S.set.frOnlyInc; saveSet(); render(); },
  frType: t => { const v = +t.dataset.v, cur = frTypes().slice(), i = cur.indexOf(v); if (i >= 0) { if (cur.length < 2) return; cur.splice(i, 1); } else cur.push(v); S.set.frTypes = cur; saveSet(); frApply(); renderSearchBody(); },
  frMark: () => { const c = S.search.chk; if (!c) return; const m = serMap('frOk'), k = serKey(c.name); if (m[k]) delete m[k]; else m[k] = 1; saveSet(); renderSearchBody(); toast(m[k] ? 'Franchise marked as complete' : 'Mark removed'); },
  frOnly: () => { const c = S.search.chk; if (!c) return; c.onlyMiss = !c.onlyMiss; frApply(); renderSearchBody(); },
  frFuture: () => { S.set.frFuture = !S.set.frFuture; saveSet(); frApply(); renderSearchBody(); },
  frShowIgn: () => { const s = S.search, c = s.chk; if (!c) return; c.showIgn = !c.showIgn; s.sel.clear(); frApply(); renderSearchBody(); },
  frSel: () => { const s = S.search; s.selMode = !s.selMode; if (!s.selMode) s.sel.clear(); renderSearchBody(); },
  frSelMiss: () => { const s = S.search; s.selMode = true; s.results.forEach(i => { if (!i.have && !i.ign) s.sel.add(i.rid); }); renderSearchBody(); },
  frAddSel: () => frAddSelected(),
  frIgnSel: () => {
    const s = S.search, c = s.chk; if (!c || !s.sel.size) return; const k = serKey(c.name), ids = new Set(serMap('frIgnore')[k] || []), pick = s.results.filter(i => s.sel.has(i.rid)).map(i => i.gid);
    if (c.showIgn) pick.forEach(id => ids.delete(id)); else pick.forEach(id => ids.add(id));
    serMap('frIgnore')[k] = Array.from(ids); saveSet(); s.sel.clear(); frApply(); renderSearchBody(); toast(c.showIgn ? 'Games returned to the franchise: ' + pick.length : 'Games hidden from the franchise check: ' + pick.length);
  },
  frRebind: () => { const s = S.search, nm = s.chk ? s.chk.name : ''; if (!nm) return; s.bind = nm; s.kind = 'franchise'; s.src = 'igdb'; s.q = nm; s.stack = []; s.chk = null; s.cols = []; s.results = []; s.token++; s.loading = false; s.mode = 'search'; S.tab = 'search'; render(); runSearch(true); },
  frBindCancel: () => { const s = S.search; s.bind = ''; s.q = ''; s.kind = 'games'; s.src = S.set.mainSrc; s.cols = []; s.results = []; s.started = false; S.serKind = 'fr'; S.tab = 'series'; render(); },
  frSort: async () => { const cur = S.set.frSort || 'alpha', r = await choose({ title: 'Sort franchises', items: FR_SORTS.map(([id, label]) => ({ id, label: (id === cur ? '✓ ' : '') + label })) }); if (r) { if (r === 'alpha') delete S.set.frSort; else S.set.frSort = r; saveSet(); render(); } },
  frOpen: t => { if (lp.fired) { lp.fired = false; return; } if (t.dataset.name) { S.retGame = null; return openFrCard(t.dataset.name); } frInLibrary(t.dataset.name); }
});
Object.assign(ACT, {
  serKind: t => { S.serKind = t.dataset.v === 'fr' ? 'fr' : 'ser'; S.sFind = ''; render(); },
  frSerOpen: t => { S.serCardFrom = 'frcard'; S.retGame = null; openSerCard(t.dataset.name); },
  frColTap: t => {
    const s = S.search, id = +t.dataset.id, nm = t.dataset.name;
    if (s.bind) { const b = s.bind; s.bind = ''; serMap('frCol')[serKey(b)] = { id, name: nm, manual: 1 }; delete serMap('frChk')[serKey(b)]; saveSet(); return showFranchiseView(b, { onlyMiss: true }); }
    return showFranchiseView(nm, { colId: id });
  },
  frFind: () => { const d = S.sheet && S.sheet.draft, nm = (($('#f_franchise') || {}).value || (d && d.franchise) || '').trim(); if (!nm) return toast('Enter a franchise first'); if (!PROV.igdb.ready()) return toast('IGDB is unavailable: check the keys or the local server in the settings'); if (d && d.id && !S.sheet.isNew) S.retGame = { id: d.id, tab: S.tab }; showFranchiseView(nm, {}); },
  rsFranchise: t => showFranchiseView(t.dataset.t, { colId: +t.dataset.id }),
});

/* подсказка по долгому нажатию на кнопку: что она делает (на телефоне title не показывается) */
(function () {
  try {
    let timer = null, tip = null, fired = 0;
    const hide = () => { clearTimeout(timer); };
    const show = (el, txt) => {
      if (tip) tip.remove(); tip = document.createElement('div'); tip.id = 'hintTip'; tip.textContent = txt; document.body.appendChild(tip);
      const r = el.getBoundingClientRect(); tip.style.left = Math.max(8, Math.min(innerWidth - 8 - tip.offsetWidth, r.left + r.width / 2 - tip.offsetWidth / 2)) + 'px'; tip.style.top = Math.max(8, r.top - tip.offsetHeight - 8) + 'px';
      setTimeout(() => { if (tip) { tip.remove(); tip = null; } }, 2600);
    };
    document.addEventListener('pointerdown', e => {
      const el = e.target && e.target.closest && e.target.closest('button[title],[data-hint]'); if (!el || el.closest('[data-lpm]')) return; hide();
      timer = setTimeout(() => { const txt = el.getAttribute('data-hint') || el.getAttribute('title'); if (txt) { fired = Date.now(); show(el, txt); } }, 480);
    }, true);
    ['pointerup', 'pointercancel', 'scroll', 'pointerleave'].forEach(ev => document.addEventListener(ev, hide, true));
    document.addEventListener('click', e => { if (fired && Date.now() - fired < 1500) { e.stopPropagation(); e.preventDefault(); fired = 0; } }, true);
  } catch (e) { /* подсказки не обязательны */ }
})();
Object.assign(ACT, {
  dbgToggle: () => { S.set.debug = !S.set.debug; saveSet(); render(); toast(S.set.debug ? 'Debugging is on: IGDB and RAWG responses are recorded' : 'Debugging is off'); },
  dbgView: () => {
    const m = openModal(), fmt = x => { let j = ''; try { j = JSON.stringify(x.data, null, 1) || ''; } catch (e) { j = String(x.data); } return j.length > 20000 ? j.slice(0, 20000) + '\n… (20000 characters shown, the full response is in the dump file)' : j; };
    const rows = DBG.list.slice().reverse().map(x => '<details style="margin:0 0 8px;font-size:12px;word-break:break-word"><summary>' + esc(new Date(x.t).toLocaleTimeString(LOC_DATE)) + ' <b>' + esc(x.src) + '</b> ' + esc(x.ep) + ' · ' + (x.status || '—') + (x.n != null ? ' · entries: ' + x.n : '') + ' · ' + (Math.round(x.size / 102.4) / 10) + ' KB' + (x.error ? ' · error' : '') + (x.tag ? ' · dump' : '') + '</summary><div class="sub">Request:</div><pre style="white-space:pre-wrap;margin:2px 0 6px">' + esc(x.q) + '</pre>' + (x.error ? '<div class="sub">Error:</div><pre style="white-space:pre-wrap">' + esc(x.error) + '</pre>' : '') + '<div class="sub">Response' + (x.note ? ' (' + esc(x.note) + ')' : '') + ':</div><pre style="white-space:pre-wrap;margin:2px 0">' + esc(fmt(x)) + '</pre></details>').join('');
    m.innerHTML = '<h4>Debugging: response dumps</h4><div style="max-height:55vh;overflow:auto">' + (rows || '<p class="sub">No entries. Turn debugging on in the settings and run a search or a check, or collect a game dump.</p>') + '</div><div class="acts"><span data-act="dbgCopy">Copy</span><span data-act="dbgDownload">Download</span><span data-x="ok">Close</span></div>';
    modalCancel = () => closeModal(); m.onclick = e => { if (e.target.closest('[data-x]')) closeModal(); };
  },
  dbgCopy: async () => { toast(await copyText(dbgText()) ? 'Dump copied' : 'Could not copy'); },
  dbgDownload: async () => {
    if (!DBG.list.length) return toast('No entries');
    const name = 'gc-debug-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json', text = dbgText(), FS = plug('Filesystem'), SH = plug('Share');
    if (isNative() && FS && SH) { try { const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' }); await SH.share({ title: 'Game catalog: debug dump', url: r.uri, dialogTitle: 'Send debug dump' }); } catch (e) { toast('Could not share: ' + (e.message || e)); } return; }
    dl(name, new Blob([text], { type: 'application/json' })); toast('Dump file saved');
  },
  dbgClear: () => { DBG.list = []; DBG.bytes = 0; render(); toast('Entries cleared'); },
  dbgGame: async () => { const v = await askPrompt('IGDB game dump', '', 'IGDB game id or name'); if (v) dbgGameDump(v); },
  gvAll: () => gvAll(),
  scGv: () => gvAll(scList(S.serCard.name)),
  fcGv: () => gvAll(fcList(S.frCard.name)),
  gvIssues: () => drawGvIssues(),
  gvMore: () => { S.gvShown = (S.gvShown || 40) + 40; drawGvIssues(); },
  gvApplyOne: async t => { const L = S.gvIssues || [], i = +t.dataset.i, x = L[i]; if (!x) return; const g = gameById(x.id), snap = takeSnap(); await gvApply(x); if (g) await saveGames([g]); L.splice(i, 1); render(); drawGvIssues(); toastUndo('Fixed', snap); },
  gvSkipOne: t => { const L = S.gvIssues || [], i = +t.dataset.i, x = L[i]; if (!x) return; const k = serMap('gvSkip'); x.fields.forEach(c => { k[x.id + '|' + c.f] = 1; }); saveSet(); L.splice(i, 1); drawGvIssues(); },
  gvApplyAll: async () => {
    const L = S.gvIssues || []; if (!L.length) return; const cnt = {}; L.forEach(x => x.fields.forEach(c => { cnt[c.f] = (cnt[c.f] || 0) + 1; }));
    const sel = await choose({ title: 'What to fix in all games', multi: true, selected: Object.keys(cnt), items: GV_FIELDS.filter(x => cnt[x[0]]).map(x => ({ id: x[0], label: x[1], sub: '– games: ' + cnt[x[0]] })) }); if (!sel || !sel.length) return;
    const snap = takeSnap(), changed = []; let n = 0; for (const x of L) { const k = await gvApply(x, sel); if (k) { n += k; changed.push(gameById(x.id)); } }
    await saveGames(changed.filter(Boolean)); S.gvIssues = L.map(x => ({ id: x.id, fields: x.fields.filter(c => !sel.includes(c.f)) })).filter(x => x.fields.length); closeSheet(); render(); toastUndo('Values fixed: ' + n + ', games: ' + changed.length, snap);
  },
});
window.__GC = { frGames, collGames, DBG, dbgCapture, dbgText, dbgGameDump, dbgSecHtml, primaryCollection, leafOf, loadColInfo, serToolbar, tb, gvRun, gvApply, gvStale, gvMap, gvMode, drawGvIssues, frCheck, frNameCheck, frVerifyRun, frApplyIssue, openFrCard, viewFrCard, fcList, frRunColSearch, frColListHtml, franchiseTilesHtml, canonFranchise, frOf, frRowHtml, frHeadHtml, showFranchiseView, frCollection, serVerifyRun, serApplyIssue, serStale, serVerTs, serStamp, serVerMode, drawSerIssues, serKey, serNameCheck, openSerCard, scList, viewSerCard, serRowHtml, serRenameAll, chooseSeries, chipMode, typeCountsHtml, viewRes, viewSearch, serCheck, serAnalyze, serCollection, collGames, showSeriesView, serCheckAll, searchCollections, serBadge, serMiss, serApply, runColSearch, sortResults, filterGames, collTilesHtml, seriesTilesHtml, NO_COLL, showBundle, popSearchState, sourceResolve, searchTypes, sheetOpen: () => !!sheetEl, logErr, ERRLOG, takeSnap, undoLast, UNDO, toastUndo, removeGame, sheetSibling, itemLine, animOn, reviewOne, catalogMatch, matchCfg, reviewItems, autoResolve, ipMask, addrOf, textLines, syncNow, SY, DB, reloadData, nextPool, PRESETS, applyFilterSet, withSeries, buildEntries, groupGames, textHtml, listHtml, cardHtml, openYoutube, canonPlat, canonGenre, canonAll, dictMerge, dictRename, dictRewrite, openDict, mergeGroups, openMergeCompare, applyMerge, mgBase, renderKeep, toggleInSel, handleShared, applyExtra, addParsed, openExport, exportText, copyText, gameLine, zipBuild, zipRead, shotStats, delShots, rawgQuotaTick, refreshOne, rawg, effItem, applyDefaults, linkItem, itemOpts, viewInbox, bulkMore, openLb, libToolsHtml: () => { renderLibHead(); return $('#libTools').innerHTML; }, filterGames, getShots, putShots, collTilesHtml, seriesTilesHtml, viewCollections, viewSeries, DONE_ID, autoResolve, viewStats, restoreGames, removeGame, canonSeries, findDupes, mergeAllDupes, collectSheet, persistDraft, closeSheet, S, ACT, bump, igdb, hltbFind, sgdbAuto, openSgdb, applyTheme, colsFor, usageHtml, serMenu, viewInbox, addItems, linkItem, createList, pendingItem, render, runSearch, addFromIgdb, importData, openIgdbSheet, openGameSheet, openFilters, openCols, selectionAction, loadAll, renderSearchBody };
(async () => {
  try {
    await loadAll();
    document.addEventListener('load', e => { const i = e.target, w = i && i.tagName === 'IMG' && i.closest && i.closest('.shw'); if (w) { w.classList.add('ld'); w.classList.remove('er'); } }, true); // у картинок событие load не всплывает, ловим на этапе перехвата
    document.addEventListener('error', e => { const i = e.target, w = i && i.tagName === 'IMG' && i.closest && i.closest('.shw'); if (w) w.classList.add('er'); }, true);
    window.addEventListener('resize', () => { if (lbState && lbEl) { lbState.W = lbEl.clientWidth || 360; lbState.H = lbEl.clientHeight || 640; } });
    document.addEventListener('toggle', e => { const d = e.target; if (d && d.dataset && d.dataset.g) S.gopen[d.dataset.g] = d.open; }, true); // раскрытые группы настроек
    detectLocalServer().then(() => syncSoon(1500));
    document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - SY.last > 30000) syncSoon(800); });
    const syIv = setInterval(() => { if (!document.hidden && Date.now() - SY.last > 120000) syncSoon(100); }, 60000); if (syIv && syIv.unref) syIv.unref();
    applyTheme();
    if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: light)'); if (mq.addEventListener) mq.addEventListener('change', () => { if (S.set.theme === 'auto') applyTheme(); }); }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
    if (!isNative() && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    const A = plug('App');
    if (isNative() && A) A.addListener('backButton', () => {
      if (lbEl) closeLb(); else if (modalEl && modalCancel) modalCancel(); else if (sheetEl) closeSheet(); else if (S.selMode) { S.selMode = false; S.sel.clear(); renderLibrary(); $('#fab').classList.remove('hidden'); } else if (S.inSelMode) { S.inSelMode = false; S.inSel.clear(); rerenderInbox(); } else if (S.tab === 'inbox' && S.inboxList) { S.inboxList = null; render(); } else if (S.tab === 'search' && S.search.stack && S.search.stack.length) popSearchState(); else if (S.pending) backToInbox(); else if (S.tab === 'search' && S.search.mode === 'series' && S.search.chk) ACT.sBack(); else if (S.retGame && S.tab === 'search') ACT.retGame(); else if (S.tab === 'sercard') ACT.scBack(); else if (S.tab === 'frcard') ACT.fcBack(); else if (S.tab !== 'library') { S.tab = 'library'; render(); } else A.exitApp();
    });
    if (isNative() && A && A.addListener) A.addListener('resume', checkShared);
    const q = new URLSearchParams(location.search), tabs = ['library', 'collections', 'series', 'inbox', 'search', 'settings'];
    if (tabs.includes(q.get('tab'))) S.tab = q.get('tab');
    render();
    if (q.get('add') === '1') openGameSheet(null);
    checkShared(); document.addEventListener('visibilitychange', () => { if (!document.hidden) checkShared(); });
    const sharedQ = q.get('text') || q.get('title') || ''; // веб-версия, установленная как приложение: «Поделиться» через share_target
    if (sharedQ && !isNative()) { history.replaceState(null, '', location.pathname); handleShared(sharedQ + (q.get('url') ? ' ' + q.get('url') : '')); }
  } catch (e) { document.body.innerHTML = '<p style="padding:20px">Startup error: ' + esc(e.message || e) + '</p>'; }
})();
})();
