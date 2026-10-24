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
  eq(L.filterGames(g3,x).map(z=>z.name),['A'],'virtual Пройдено'); x.collections=[L.DONE_ID,'k']; x.collMode='and'; eq(L.filterGames(g3,x).map(z=>z.name),[],'Пройдено AND k'); x.collMode='or'; eq(L.filterGames(g3,x).map(z=>z.name),['A','B'],'Пройдено OR k');
  eq([1,2,5,11,21,22,111].map(L.gWord),['1 игра','2 игры','5 игр','11 игр','21 игра','22 игры','111 игр'],'gWord'); }

{ eq(L.parseLine("id 4545 | Assassin's Creed IV (2013 | PC, PS3) – 23 ч"), { text: "Assassin's Creed IV", year: 2013, hours: 23, x: { gid: '4545', platforms: ['PC', 'PS3'] } }, 'parseLine id + платформы + время');
  const gms = [{ id: 'a1', name: 'Game; "X"', year: 2020, platforms: ['PC', 'PS4'], mainPlatform: 'PC', genres: ['RPG'], time: 12, rating: 8.1, series: 'S', collections: ['c1'], done: true, doneDate: '2021-01-02', igdbId: 5 }];
  const keys = ['id', 'name', 'year', 'platforms', 'mainPlatform', 'genres', 'time', 'rating', 'series', 'collections', 'done', 'doneDate', 'igdbId'];
  for (const fmt of ['csv', 'txt']) {
    const rows = L.parseInboxText(L.buildExport(gms, keys, fmt, () => 'Кол'));
    eq([rows.length, rows[0].text, rows[0].year, rows[0].hours, rows[0].x.gid, rows[0].x.platforms, rows[0].x.mainPlatform, rows[0].x.colls, rows[0].x.done, rows[0].x.igdbId], [1, 'Game; "X"', 2020, 12, 'a1', ['PC', 'PS4'], 'PC', ['Кол'], true, 5], 'выгрузка и обратный разбор ' + fmt);
  }
  eq(L.parseInboxText('Zelda | 2017\nMario (2020)').map(x => [x.text, x.year]), [['Zelda', 2017], ['Mario', 2020]], 'обычные строки без заголовков'); }
