// Запуск: node --test tests/logic.test.js
const L = require('../www/app.js');
const eq = (a,b,m)=>{ if (JSON.stringify(a)!==JSON.stringify(b)) { console.log('FAIL',m,JSON.stringify(a),'!=',JSON.stringify(b)); process.exitCode=1; } else console.log('ok',m); };
eq(L.seriesName(['Fallout 3','Fallout 4','Fallout: New Vegas','Fallout 76']),'Fallout','fallout');
eq(L.seriesName(['The Witcher 3: Wild Hunt','Thronebreaker: The Witcher Tales','The Witcher 2']),'The Witcher','witcher');
eq(L.seriesName(['Call of Duty: World at War','Call of Duty 2','Call of Duty']),'Call of Duty','cod');
eq(L.seriesName(['Persona 2: Eternal Punishment','Shin Megami Tensei: Persona']),'Persona','persona-fallback');
eq(L.shortPlat('PlayStation 4'),'PS4','ps4'); eq(L.shortPlat('Xbox One'),'XONE','xone'); eq(L.shortPlat('Nintendo Switch'),'Switch','sw');eq(L.shortPlat('PC'),'PC','pc');
const g=[{name:'B',year:2000,genres:['RPG'],platforms:['PC'],series:'S',collections:['a'],props:{}},{name:'A',year:2005,genres:['Action'],platforms:['PS4'],series:'',collections:['a','b'],props:{p1:'x'}},{name:'C',year:2000,genres:['RPG','Action'],platforms:['PC'],series:'S',collections:[],props:{}}];
const f=()=>JSON.parse(JSON.stringify(L.DEFAULTS.f));
let x=f(); x.genres=['RPG']; eq(L.filterGames(g,x).map(z=>z.name),['B','C'],'genre');
x=f(); x.genres=['RPG']; x.platforms=['PS4']; eq(L.filterGames(g,x).map(z=>z.name),[],'genre AND platform');
x=f(); x.collections=['a','b']; x.collMode='and'; eq(L.filterGames(g,x).map(z=>z.name),['A'],'coll AND');
x=f(); x.collections=['a','b']; x.collMode='or'; eq(L.filterGames(g,x).map(z=>z.name),['B','A'],'coll OR');
x=f(); x.years=[2000]; eq(L.filterGames(g,x).map(z=>z.name),['B','C'],'year');
x=f(); x.props=['p1']; eq(L.filterGames(g,x).map(z=>z.name),['A'],'prop');
x=f(); x.sort='year'; x.dir='desc'; eq(L.sortGames(g.slice(),x).map(z=>z.name),['A','B','C'],'sort year desc');
x=f(); x.sort='series'; eq(L.sortGames(g.slice(),x).map(z=>z.name),['B','C','A'],'sort series');

{ const g2=[{name:'A',done:true,genres:[],platforms:[],collections:[],props:{}},{name:'B',done:false,genres:[],platforms:[],collections:[],props:{}}];
  const f=()=>JSON.parse(JSON.stringify(L.DEFAULTS.f));
  let x=f(); x.done='yes'; eq(L.filterGames(g2,x).map(z=>z.name),['A'],'done yes');
  x=f(); x.done='no'; eq(L.filterGames(g2,x).map(z=>z.name),['B'],'done no');
  x=f(); x.sort='done'; x.dir='desc'; eq(L.sortGames(g2.slice(),x).map(z=>z.name),['A','B'],'sort done'); }

{ const d=[{game_id:1,game_name:'The Witcher 3: Wild Hunt',comp_main:189000,comp_plus:294000,comp_100:414000,release_world:2015},{game_id:2,game_name:'The Witcher',comp_main:100800,comp_plus:0,release_world:2007},{game_id:3,game_name:'No time',comp_main:0,comp_plus:0}];
  const r=L.hltbCandidates(d,'The Witcher 3'); eq(r.length,2,'hltb filter'); eq(r[0].name,'The Witcher 3: Wild Hunt','hltb best match'); eq(r[0].hours,67.1,'hltb avg main+extra'); eq(r[1].hours,28,'hltb main only'); }

{ const p=L.parseLine; eq(p('Doom | 12ч | 2016'),{text:'Doom',year:2016,hours:12},'parse pipe'); eq(p('1. Hades\t2020\t35.5 h'),{text:'Hades',year:2020,hours:35.5},'parse tab');
  eq(p('Cyberpunk 2077'),{text:'Cyberpunk 2077',year:0,hours:0},'no bare year'); eq(p('Doom (2016)'),{text:'Doom',year:2016,hours:0},'paren year'); eq(p('   '),null,'empty'); eq(p('- Half-Life 2 ; 2004'),{text:'Half-Life 2',year:2004,hours:0},'semicolon'); }

{ const x=f(); x.collections=[L.DONE_ID]; const g3=[{name:'A',done:true,genres:[],platforms:[],collections:[],props:{}},{name:'B',done:false,genres:[],platforms:[],collections:['k'],props:{}}];
  eq(L.filterGames(g3,x).map(z=>z.name),['A'],'virtual Завершено'); x.collections=[L.DONE_ID,'k']; x.collMode='and'; eq(L.filterGames(g3,x).map(z=>z.name),[],'Завершено AND k'); x.collMode='or'; eq(L.filterGames(g3,x).map(z=>z.name),['A','B'],'Завершено OR k');
  eq([1,2,5,11,21,22,111].map(L.gWord),['1 игра','2 игры','5 игр','11 игр','21 игра','22 игры','111 игр'],'gWord'); }

{ eq(L.parseLine("id 4545 | Assassin's Creed IV (2013 | PC, PS3) – 23 ч"), { text: "Assassin's Creed IV", year: 2013, hours: 23, x: { gid: '4545', platforms: ['PC', 'PS3'] } }, 'parseLine id + платформы + время');
  const gms = [{ id: 'a1', name: 'Game; "X"', year: 2020, platforms: ['PC', 'PS4'], mainPlatform: 'PC', genres: ['RPG'], time: 12, rating: 8.1, series: 'S', collections: ['c1'], done: true, doneDate: '2021-01-02', igdbId: 5 }];
  const keys = ['id', 'name', 'year', 'platforms', 'mainPlatform', 'genres', 'time', 'rating', 'series', 'collections', 'done', 'doneDate', 'igdbId'];
  for (const fmt of ['csv', 'txt']) {
    const rows = L.parseInboxText(L.buildExport(gms, keys, fmt, () => 'Кол'));
    eq([rows.length, rows[0].text, rows[0].year, rows[0].hours, rows[0].x.gid, rows[0].x.platforms, rows[0].x.mainPlatform, rows[0].x.colls, rows[0].x.done, rows[0].x.igdbId], [1, 'Game; "X"', 2020, 12, 'a1', ['PC', 'PS4'], 'PC', ['Кол'], true, 5], 'выгрузка и обратный разбор ' + fmt);
  }
  eq(L.parseInboxText('Zelda | 2017\nMario (2020)').map(x => [x.text, x.year]), [['Zelda', 2017], ['Mario', 2020]], 'обычные строки без заголовков'); }

{ eq(L.parseLine('Final Fantasy II (1988) (1988 | Game Boy Advance, iOS, PSP)'), { text: 'Final Fantasy II', year: 1988, hours: 0, x: { gid: '', platforms: ['Game Boy Advance', 'iOS', 'PSP'] } }, 'год в названии не дублируется'); }

// игры без основной платформы и фильтр по дате добавления
{
  const T = d => new Date(d + 'T12:00:00').getTime();
  const gg = [{ name: 'A', platforms: ['PC', 'PS4'], added: T('2026-10-01'), genres: [], collections: [], props: {} }, { name: 'B', platforms: ['PC'], added: T('2026-10-20'), genres: [], collections: [], props: {} }, { name: 'C', platforms: ['PC', 'PS4'], mainPlatform: 'PS4', genres: [], collections: [], props: {} }];
  let y = JSON.parse(JSON.stringify(L.DEFAULTS.f)); y.mainPlats = [L.NO_MAIN]; eq(L.filterGames(gg, y).map(z => z.name), ['A'], 'без платформы');
  y = JSON.parse(JSON.stringify(L.DEFAULTS.f)); y.addedFrom = '2026-10-10'; eq(L.filterGames(gg, y).map(z => z.name), ['B'], 'добавлена с');
  y = JSON.parse(JSON.stringify(L.DEFAULTS.f)); y.addedTo = '2026-10-05'; eq(L.filterGames(gg, y).map(z => z.name), ['A'], 'добавлена по');
  y = JSON.parse(JSON.stringify(L.DEFAULTS.f)); y.addedFrom = '2026-09-01'; y.addedTo = '2026-10-31'; eq(L.filterGames(gg, y).map(z => z.name), ['A', 'B'], 'добавлена в период');
  eq(L.DEFAULTS.cols.added, 0, 'колонка даты добавления по умолчанию выключена');
}

// сортировка: числа в названиях по значению, пустые серии в конце, равные значения по названию
{
  const mk = (name, series, year) => ({ name, series, year, platforms: [], genres: [], collections: [], props: {} });
  const f = JSON.parse(JSON.stringify(L.DEFAULTS.f));
  f.sort = 'name'; f.dir = 'asc'; eq(L.sortGames([mk('Game 10'), mk('Game 2'), mk('Alpha')], f).map(g => g.name), ['Alpha', 'Game 2', 'Game 10'], 'сортировка по названию с числами');
  f.sort = 'series'; eq(L.sortGames([mk('B', ''), mk('A', 'Zed'), mk('C', 'Abc')], f).map(g => g.name), ['C', 'A', 'B'], 'пустые серии в конце');
  f.sort = 'year'; f.dir = 'desc'; eq(L.sortGames([mk('B', '', 2000), mk('A', '', 2000), mk('C', '', 2010)], f).map(g => g.name), ['C', 'A', 'B'], 'год по убыванию, при равенстве по названию');
}

// «+ игры серий», группировка и единая последовательность для плитки, списка и текста
{
  const mk = (id, name, year, series, o) => Object.assign({ id, name, year, series, platforms: ['PC'], genres: ['RPG'], collections: [], props: {}, done: false }, o);
  const all = [mk('a', 'Rage 2', 2019, 'Rage'), mk('b', 'Rage', 2010, 'Rage'), mk('c', 'Silent Hill 2', 2001, 'Silent Hill'), mk('d', 'Silent Hill 3', 2003, 'Silent Hill'), mk('e', 'Sakuna', 2020, ''), mk('f', 'Другая', 2003, 'Другая')];
  const main = all.filter(g => g.id === 'a' || g.id === 'e' || g.id === 'c');
  eq(L.withSeries(all, main).map(g => g.id), ['b', 'd'], 'игры серий: без повторов и без игр без серии');
  eq(L.withSeries(all, [all[4]]), [], 'игра без серии не тянет за собой ничего');
  eq(L.groupGames(all, 'year', 'asc').map(g => g.key), ['2001', '2003', '2010', '2019', '2020'], 'группы по году по возрастанию');
  eq(L.groupGames(all, 'year', 'desc').map(g => g.key)[0], '2020', 'группы по году по убыванию');
  eq(L.groupGames([mk('x', 'A', 0, ''), mk('y', 'B', 1999, '')], 'year', 'asc').map(g => g.key), ['1999', 'Без года'], 'без года в конце');
  eq(L.groupGames([mk('x', 'A', 1, '', { done: true }), mk('y', 'B', 1, '')], 'done', 'asc').map(g => g.key), ['Не завершено', 'Завершено'], 'сначала не завершённые');
  const r = L.buildEntries([{ title: 'Основной список', items: main }, { title: '★ Из серий', items: [all[1], all[3]] }], 'year', 'asc', g => g.id === 'b' || g.id === 'd');
  eq(r.entries.filter(e => e.t === 'g').map(e => e.g.id + (e.x ? '*' : '')), ['c', 'a', 'e', 'd*', 'b*'], 'основной список, потом игры серий со звёздочкой');
  eq(r.entries.filter(e => e.t === 'h' && e.lvl === 2).length, 2, 'заголовки разделов');
  eq(r.games.length, 5, 'плоский список игр для выбора');
  eq(L.buildEntries([{ items: all }], '', 'asc').entries.every(e => e.t === 'g'), true, 'без группировки заголовков нет');
}

// время прохождения «до N часов» и часы в статистике
{
  const mk = (id, name, time, o) => Object.assign({ id, name, time, platforms: ['PS5'], mainPlatform: 'PS5', genres: [], collections: [], props: {}, done: false, series: '' }, o);
  const gg = [mk('a', 'A', 8), mk('b', 'B', 12), mk('c', 'C', 0), mk('d', 'D', 5, { done: true, doneDate: '2025-03-01' }), mk('e', 'E', 20, { done: true, doneDate: '2026-01-05', mainPlatform: '', platforms: ['PC', 'PS4'] })];
  const f = JSON.parse(JSON.stringify(L.DEFAULTS.f)); f.maxTime = 10; eq(L.filterGames(gg, f).map(g => g.id), ['a', 'd'], 'время до 10 ч: без неизвестного времени');
  f.done = 'no'; eq(L.filterGames(gg, f).map(g => g.id), ['a'], 'непройденные до 10 ч');
  const h = L.statsHours(gg);
  eq(h.left, { n: 3, h: 20 }, 'осталось пройти'); eq(h.noTime, 1, 'игр без времени');
  eq(h.byYear, [['2026', 20], ['2025', 5]], 'часы по годам завершения');
  eq(h.leftPlat, [['PS5', 20]], 'осталось по платформам'); eq(h.donePlat.map(e => e[0]), [L.NO_MAIN, 'PS5'], 'пройдено по платформам, без платформы отдельно');
  eq(h.longest.map(g => g.id), ['e', 'b', 'a', 'd'], 'самые долгие игры');
}

// импорт: небезопасные id (попадают в data-* атрибуты) заменяются, ссылки между записями сохраняются
{ const bad = 'x" onfocus="alert(1)';
  const d = L.sanitizeImport({ collections: [{ id: bad, name: 'C' }], props: [{ id: 'p1', name: 'P' }], games: [{ id: 'g<1>', name: 'G', collections: [bad], props: { p1: 'v' } }], covers: { 'g<1>': 'data:' }, inbox: { lists: [{ id: 'l 1', colls: [bad] }], items: [{ id: 'i1', listId: 'l 1', gameId: 'g<1>' }] } });
  const ok = id => /^[A-Za-z0-9_-]+$/.test(id);
  eq(ok(d.collections[0].id) && ok(d.games[0].id) && ok(d.inbox.lists[0].id), true, 'import ids safe');
  eq(d.games[0].collections[0], d.collections[0].id, 'import coll link kept');
  eq(Object.keys(d.covers)[0], d.games[0].id, 'import cover key remapped');
  eq(d.inbox.items[0].listId, d.inbox.lists[0].id, 'import inbox link kept');
  eq(d.inbox.items[0].gameId, d.games[0].id, 'import inbox game link kept');
  eq(d.props[0].id, 'p1', 'safe ids untouched'); }
