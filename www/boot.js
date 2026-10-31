// Выбор языка и загрузка нужной сборки: app.js (русская) или app.en.js (английская, создаётся из app.js скриптом tools/i18n/build_en.py).
// Язык: настройка «Язык» в приложении (localStorage gc_lang), иначе по языку устройства.
(function () {
  var pref = ''; try { pref = localStorage.getItem('gc_lang') || ''; } catch (e) { /* ignore */ }
  var nav = String(navigator.language || 'en').toLowerCase().slice(0, 2);
  var lang = pref || (nav === 'ru' || nav === 'uk' || nav === 'be' ? 'ru' : 'en');
  if (lang === 'en') { // подписи, которые есть уже в index.html
    document.documentElement.lang = 'en'; document.title = 'Game Catalog';
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', 'Game Catalog: collections, series, IGDB search, works offline');
    var tabs = { library: 'Catalog', collections: 'Collections', series: 'Series', inbox: 'Inbox', search: 'Search', settings: 'Settings' };
    Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (b) { var t = tabs[b.getAttribute('data-tab')]; if (t) { b.setAttribute('aria-label', t); var sp = b.querySelector('span'); if (sp) sp.textContent = t; } });
    var fab = document.getElementById('fab'); if (fab) fab.setAttribute('aria-label', 'Add');
  }
  var s = document.createElement('script'); s.src = lang === 'en' ? 'app.en.js' : 'app.js'; document.body.appendChild(s);
})();
