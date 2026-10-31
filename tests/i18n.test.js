// Проверка английской сборки: она создана из актуального app.js, переводы полные, русский остался только там, где нужен для разбора файлов.
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os'), assert = require('assert');
const root = path.join(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-')), out = path.join(tmp, 'app.en.js');
execFileSync('python3', ['-c', `import sys; sys.path.insert(0, ${JSON.stringify(path.join(root, 'tools/i18n'))}); import build_en; build_en.build(out_path=${JSON.stringify(out)})`], { stdio: 'pipe' });
const fresh = fs.readFileSync(out, 'utf8'), committed = fs.readFileSync(path.join(root, 'www/app.en.js'), 'utf8');
assert.strictEqual(committed, fresh, 'www/app.en.js устарел: запустите python3 tools/i18n/build_en.py');
execFileSync('node', ['--check', out]);
assert.ok(/const LANG = 'en';/.test(fresh), 'в английской сборке LANG должен быть en');
for (const s of ['Reset ✕', 'Sync and own server', 'What to play next', 'Danger zone']) assert.ok(fresh.includes(s), 'нет перевода: ' + s);
// русский вне комментариев допустим только в регулярных выражениях разбора, в названии языка и в keep-фрагментах
const left = JSON.parse(execFileSync('python3', ['-c', `import sys, json; sys.path.insert(0, ${JSON.stringify(path.join(root, 'tools/i18n'))}); import build_en; r, l = build_en.build(out_path=${JSON.stringify(out)}); print(json.dumps([x[1] for x in l], ensure_ascii=False))`], { encoding: 'utf8' }).split('\n').filter(Boolean).pop());
const allowed = ['А-ЯЁ', 'а-яё', 'ч|h', 'час', 'да|yes', 'Русский'];
const bad = left.filter(x => !allowed.some(a => x.includes(a)));
assert.strictEqual(bad.length, 0, 'русский текст остался в английской сборке: ' + bad.slice(0, 3).join(' | '));
// английская инструкция по структуре совпадает с русской
const h = f => (fs.readFileSync(path.join(root, 'www', f), 'utf8').match(/<h3>/g) || []).length;
assert.strictEqual(h('guide.en.html'), h('guide.html'), 'число разделов инструкции должно совпадать');
const tb = f => (fs.readFileSync(path.join(root, 'www', f), 'utf8').match(/<tr>/g) || []).length;
assert.strictEqual(tb('guide.en.html'), tb('guide.html'), 'таблица неполадок должна совпадать');
console.log('ok i18n');

// boot.js выбирает сборку по настройке и языку устройства
{
  const vm = require('vm'), code = fs.readFileSync(path.join(root, 'www/boot.js'), 'utf8');
  const run = (pref, nav) => { const added = [], els = {}; const doc = { documentElement: {}, title: '', querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, createElement: () => ({}), body: { appendChild: e => added.push(e.src) } };
    vm.runInNewContext(code, { document: doc, navigator: { language: nav }, localStorage: { getItem: () => pref }, Array }); return { src: added[0], lang: doc.documentElement.lang }; };
  assert.strictEqual(run('', 'ru-RU').src, 'app.js'); assert.strictEqual(run('', 'en-US').src, 'app.en.js'); assert.strictEqual(run('', 'de').src, 'app.en.js');
  assert.strictEqual(run('en', 'ru').src, 'app.en.js'); assert.strictEqual(run('ru', 'en-US').src, 'app.js'); assert.strictEqual(run('en', 'ru').lang, 'en');
  console.log('ok boot');
}
