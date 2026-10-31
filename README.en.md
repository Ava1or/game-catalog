# Game Catalog (PWA + Android APK)

One code base works both in a computer browser and in an Android app. All data is stored on the device; the app works without internet (internet is needed only for searching IGDB and RAWG). The interface is available in Russian and English (Settings → Appearance → Language; by default it follows the device language).

## What to do (once)
1. Sign up at github.com.
2. Create a public repository `game-catalog` (the “+” button, “New repository”, type Public).
3. Upload ALL files from this archive into it, including the hidden `.github` folder
   (in the repository: “Add file” -> “Upload files”, drag in the contents of the unpacked folder).
   If the `.github` folder was not uploaded: “Add file” -> “Create new file”, name it `.github/workflows/build.yml` and paste the contents of the file from the archive.
4. Settings -> Pages -> Source: choose “GitHub Actions”.
5. Settings -> Actions -> General -> Workflow permissions: “Read and write permissions”, Save.
6. Actions tab: wait for the green check mark (5-10 minutes). A red cross: open the run and send the error text.

## Result
- APK: on the repository's main page on the right, the “Releases” block, the file `game-catalog.apk`.
- Computer version: `https://NAME.github.io/game-catalog/` (in Chrome/Edge: menu -> “Install app”).
- The server archives `game-catalog-server.zip` (Russian) and `game-catalog-server-en.zip` (English) are published next to it and are also inside the APK (see “Own server and sync”).

## Installing on the phone
Download the apk, allow installation from this source (Settings -> Apps -> Special access -> Install unknown apps). If Play Protect warns you, choose “More details” -> “Install anyway”.

## First launch
“Settings” tab -> “Sources and keys” -> paste the free IGDB keys: Client ID and Client Secret (register an app at dev.twitch.tv/console/apps, documentation: api-docs.igdb.com) -> “Save and check”. IGDB accepts requests only from the app: on Android this works, in a computer browser the requests to IGDB may be blocked (use your own server or proxy, see below).

## Moving data between devices
Best: own server and automatic sync (see “Own server and sync”). Or by file: “Settings” -> “Data and backups” -> “Export to a file” (on the phone the “Share” menu opens: send it to yourself by email or to the cloud).
On the other device: “Import from a file” -> “Merge” or “Replace”.
Make an export regularly: if you clear the browser data or delete the app, the games are lost.

## Updating
Replace the files in the repository (Upload files -> Commit): the build starts by itself, and the new apk installs over the old one keeping the data.
The signing key is in `android-signing/` (the repository is public, which is acceptable for a personal app; do not change it, or the update over the old version will not install).

## Sections of the app
Catalog, Collections, Series, Inbox (lists of games-as-notes that you need to find in IGDB and load), Search, Settings.
App icon: android-res/ (for Android) and www/icon-*.png (for the browser). To change the icon, replace these files.

## Own server and sync
- Settings -> “Sync and own server” has a step-by-step guide for a beginner (a Windows computer is needed). The guide and the server archive are inside the app (the buttons “Setup guide” and “Download the server archive”).
- `server/server.mjs` (Node.js without dependencies) serves the web version and exchanges data with the phone and other computers over the home network: games, collections, properties, Inbox, covers, screenshots, shared platform and genre lists, deletions. Data is stored in the `data` folder. Access is by a code that is created on the first start.
- Sync is built on a modification time of every record (the later edit wins), with deletion records; the clocks of the devices are aligned with the server. Background checks are light: the server keeps a change counter, and if nothing changed, the full comparison is skipped.
- The server can also make IGDB requests for the app: put the keys into `config.json` on the server.
- Building the archives: `python3 tools/build_server_pack.py [folder]` (the build in GitHub Actions does it by itself and puts them on the page and into the apk).
- Tests: `tests/server.test.mjs` (server protocol), the sync step of `tests/smoke.test.js` (the real exchange of the app with the server).

## Language
- The Russian build is `www/app.js`, the English one `www/app.en.js` is generated from it: `python3 tools/i18n/build_en.py` (the table of translations is `tools/i18n/en.json`). Do not edit `app.en.js` by hand. A test checks that it is up to date and that no phrase is left untranslated.
- `www/boot.js` chooses the build: the “Language” setting (Same as system / Русский / English), otherwise the device language. The guide is in `guide.html` and `guide.en.html`.
- Parts that must understand both languages (the headers of imported tables, the reserved collection names) are marked `/*i18n:keep*/ … /*i18n:end*/` and are not translated.
- The server messages and the scripts of the English archive are also translated (`tools/i18n/server_en.json`, the `server/en` folder). The app name on the Android home screen and the web manifest stay as they are.

## Collections, genres, screenshots
- “All games” and “Completed” always exist (in the catalog and in the “Collections” tab): “Completed” is built automatically from games with the mark, your own collections are created separately.
- Collections and series can be viewed as tiles or as a list (the button to the right of the header). In a tile: the number of games on the left and the percentage completed on the right. The edit menu (rename, color, cover, delete) opens with a long press.
- In the catalog, collections are chosen in “Filters”; the chosen ones are shown in the filter row, the “Reset” button clears all of it, including the grouping.
- A long press on a game (in a tile and in a list) turns on selection mode. Above the selected games there is the “More…” button: mark as completed, set a series, a main platform, add a genre or a platform, update from IGDB.
- The search, the buttons and the filter row are pinned at the top in the catalog, collections, series and IGDB search; only the list scrolls. The table header is pinned and does not change when the zoom changes. The row of icons is always a single line and scrolls sideways when there is not enough room.
- IGDB search: the “Add to…” button chooses collections, and then a tap on a game adds it to all the chosen ones at once (including “Completed”). Without a choice a tap opens the card, where collections can be ticked even before adding. The magnifier in the corner of a tile always opens the card.
- Main platform: in the game card, tapping a platform makes it the main one (tapping again clears it, there is no filter on tap; if there is one platform, it is the main one). In the list the “Platform” column (the main one) is shown by default, the full list of platforms is turned on in “Columns”. The main platform is in the filters and the sorting. Genres work as before.
- The platform is not asked for when adding (neither in search nor in the Inbox). In search the “Platform” button next to “Add to…” sets the main platform in advance (there is an item “No platform”); in the game card from search the same choice of platform and collections is available before adding. If no platform is chosen and the game has several, the game is added without a main platform.
- Inbox: for every list you can set a platform, collections (you can create a new one) and the “Completed” mark for all rows; in a row the ⚙ button changes them separately. It is applied when the game is matched.
- In the game list, tapping “+N” shows all collections of the game.
- Screenshots open as a gallery: a swipe left-right with animation, pinch and double-tap to zoom, arrows and the mouse wheel on a computer, a counter at the bottom. After a swipe or a zoom the “Close”, “‹”, “›” buttons work at once; the zoom is smooth (redrawn once per frame). Screenshots are downloaded in medium quality (889 pixels wide). While a screenshot loads there is a placeholder, and the “Save” button appears only after loading; if it fails to load, a tap retries.
- IGDB search shows only games, standalone expansions, episodes, remakes, remasters, expanded editions and ports (without DLC, patches, packs and mods). The results can be viewed as tiles or as a list, the number of games at a time is chosen in “Search filters” (20, 40, 50, 100, 200).
- In collections and series every entry has a colored “Completed” progress (from red to green); 0% is gray.
- In the Inbox the “Cancel” button and the system “back” button from search return to the row from which you opened the search.
- Export can be made without screenshots (a smaller file). Settings show how much space is used on the device.
- In the game card, genres and platforms are shown as buttons; the row with a list opens with the “Edit” button.
- Screenshots: in the game card you can save to the database the ones chosen from IGDB (“+ Save”, “Save all to the database”) or add your own files. They are stored on the device, visible without internet and included in the export (the backup file gets bigger).

## Limits and external services
- IGDB: the counter of requests per month is in “Settings” (the constant IGDB_LIMIT in www/app.js). With a wrong key or an exhausted limit the search is blocked by a banner.
- SteamGridDB (optional): the key is in “Settings”, covers are loaded when IGDB has none, and are chosen manually in the game card.
- HowLongToBeat: only in the Android app, an unofficial API, may stop working.

## App signing: how to move the key into Secrets (recommended, detailed guide in SIGNING.en.md)
The key from the `android-signing/` folder lies in the public repository together with its password: for a personal app this is acceptable,
but anyone can sign their own APK with this key. To remove the risk:
1. On a computer with Java create a new key: `keytool -genkeypair -keystore my.keystore -alias gamecatalog -keyalg RSA -keysize 2048 -validity 36500`
2. Convert it to base64 (Windows PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("my.keystore"))`
3. Repository -> Settings -> Secrets and variables -> Actions -> New repository secret: `KEYSTORE_B64` (the base64 from step 2), `KEYSTORE_PASS` (the password), and `KEY_ALIAS` if needed.
4. Delete the `android-signing/` folder from the repository.
IMPORTANT: Android will not install an app with a new signature over the old one. First make an export in the app, delete the old app, install the new one and import the data.

## Tests
`node --test tests/logic.test.js tests/smoke.test.js tests/server.test.mjs tests/i18n.test.js` runs automatically before every build; the build does not start if the tests fail.

## Data sources, backups and settings
- Two sources: IGDB and RAWG. In “Settings” you choose the main search; search, quick add and Inbox processing go only through it. In the search window the source is switched with a button (and with a hint if nothing is found), and the next time you open search it returns to the main one. The current source is written in the search field and on the button.
- In the game card the sources are shown as colored frames “IGDB” and “RAWG” with a link to the game page. Each source has its own “Update” button, screenshots and series; for a missing source there is “Find in …”. A game can be linked to both sources.
- RAWG: the remaining requests and the renewal date can be edited manually (as on the RAWG site). The app subtracts every request, and when the date comes it adds 30 days and returns the remainder to 20,000.
- A backup with screenshots is saved as a .zip archive: the data is compressed, the screenshots are separate files. When a json with links to screenshots but without the images is loaded, the app warns you but lets you load it.
- In “Settings” you can delete screenshots from the database: all at once or for the chosen games (with the count and size).
- SteamGridDB is switched on with a separate switch; while it is off, the game card has a small button with a hint instead of the buttons. Pauses are kept between requests (the limit is 120 per minute), on a 429 response requests stop for the time the server asks, and results are cached for 10 minutes.
- Playtime: the HLTB and Cubiq.ru buttons in the card open the site page (inside the app on Android through the @capacitor/browser plugin, in a new tab in the browser). Cubiq.ru opens a search page like cubiq.ru/gametime/?s=final+fantasy+vii.
- Completed games are highlighted in green: in the list a barely visible green background and a stripe on the left, on tiles a green frame and a dark strip at the bottom with the main platform, time and a check mark. In the text view completed rows get a faint green background.

## Sharing, list exports, proxy, doubts in the Inbox
- **Share a game:** in the game card a button with a “share” icon sends a line like `Title (year | platforms) – N h`.
- **Receive text from another app** (“Share” -> “Game Catalog”): the app asks whether to find the game in search or to add the lines to an Inbox list (you can create a new list). On Android this works after the APK is built through GitHub Actions (the build adds text receiving to the manifest and to MainActivity by itself: the files `android-src/MainActivity.java`, `tools/patch_manifest.py`). The web version installed as an app receives text through `share_target`.
- **List export** (CSV for Excel and AI with the “;” separator and headers, or text with the “|” separator): in the game list through “Columns” -> “Export the current list…” or through selecting games -> “More…” -> “Export selected…”; in collections and series through a long press on a tile (including “All games”, “Completed”, “No series”). The columns are chosen, the text can be copied or saved as a file. The “Pin the title” button was moved to “Columns” so that no buttons are added to the list panel.
- **Bringing the data back:** paste the export (or lines like `id 4545 | Title (2013 | PC, PS4) – 23 h`) into “Inbox” -> “Paste a list…”. If a row has an id, the game is matched exactly. Missing data (year, time, rating, platforms, main platform, genres, series, collections by name, “Completed”) is filled in on the card, existing values are not overwritten. Tables exported by the English interface (headers such as “Title”, “Time (h)”, “Completed”) are read as well as Russian ones.
- **Doubts in the Inbox:** if a game was found with a 50-85% match, the row gets a ❓ mark and a button to choose from five options, search, or “none fits”.
- **IGDB proxy for the web version:** `tools/igdb-proxy.mjs` (run: `IGDB_CLIENT_ID=... IGDB_CLIENT_SECRET=... ALLOWED_ORIGIN=https://name.github.io node tools/igdb-proxy.mjs`), and in “Settings” in the “Your own proxy address” field enter `http://localhost:8787`. ALLOWED_ORIGIN is the site address without a path, without a trailing “/”, in lower case. The keys in the proxy are kept only in environment variables; do not put them into the repository. Simpler: use your own server (see “Own server and sync”), it can do the same.

## Game card, row selection and statistics
- **Completed** instead of “Done” everywhere (in the Russian version: “Завершено” instead of “Пройдено”). In the game card there is a “Completed” tile with a date: gray if the game is not completed, green with a check mark if it is; a tap switches it, the pencil icon changes the date. “Completed” also stays a built-in collection.
- The title in the card is shown in full (of any length) and is edited by a tap, in a field of 5 lines (the pencil icon next to it). The input fields are dark. The cover is bigger: a tap on it or on the gear in its corner opens the cover view with the buttons “Update …”, “Replace the cover” and SteamGridDB. At the top right, next to the source and the main platform, there is the “⋮” button with actions: HowLongToBeat, Cubiq.ru, “Find in …”, series, “Share”, “Update from …”.
- From a series or a search opened from a card, “back” (and the button in the banner) returns to this card.
- Selecting rows: selection mode is turned on with a long press (there is no “Select” button). In a list a row is marked by a tap anywhere on it; selected rows, tiles and text rows are highlighted in blue (a blue frame, also for completed games). The bottom selection panel is made of icons: to a collection, remove from a collection, delete, “More” (completed, series, platform, genre, export, update, “Move to another collection”, which removes the game from the collection chosen at the top and adds it to another one).
- Inbox: a long press on a row turns on selection of several rows; the icon panel sets the main platform, collections and “Completed” for the selected ones at once, “Same as the list” resets.
- Statistics: a tap on a chart (genres, platforms, release years, collections, completed) opens the list of games with this filter.
- If a platform has to be chosen when adding, the window names the game.

## Merging cards
- “Settings” -> “Merging cards” -> “Open the merge tool”. At the top a switch “Title” / “Title + year”, below are the titles that have two or more cards, with the count and years. A tap on a title opens the comparison table.
- The table: a “Result” column and a column for each card. The “Main” button chooses the main card (by default the one that has a source, a cover and collections). “⇒” takes a value from a card into the result, “＋” adds to a list (genres, platforms, collections), “∪ all” merges the lists of all cards, a tap on a value in the “Result” changes it manually. By default, collections are collected from all cards.
- The cover, sources and links, properties, screenshots and the Inbox bindings are carried over to the main card by themselves.
- Before merging a check is always shown: which card will result and which cards will be deleted (they go to the trash for 30 days).
- In the game list: select several games, “More…” -> “Merge cards…” opens the same table.
- After a card is saved, the list stays on the same game (it does not go back to the start). In a tile the rating and year are at the bottom. The names of collections in the list and in the game card are colored with the collection's color.

## Shared lists, the web version on your own PC
- “Settings” -> “Shared lists”: platforms (short and long name) and genres. In games, filters and lists the short name is stored and shown everywhere; identical ones written differently (PS4 and Playstation 4) are merged with the “Merge with another…” button, a name can be renamed. New platforms and genres get into the list by themselves.
- In the game card: the “⋮” button is always at the top right, and “Update from …” is in it; the title takes two lines (a tap shows it in full, the pencil edits it); the “Completed” block is more compact; the last opened game is clearly highlighted in the list, in tiles and in the text view (a gray row or tile), and the list returns to it.
- In filters “Apply” and “Reset” are always visible at the bottom.
- The web version completely on your own computer (Windows 11, Node.js, Apache): a detailed guide is in `LOCAL-WEB.en.md`, the scripts are `tools/local-deploy.ps1` and `tools/start-igdb-proxy.cmd`. The simpler way is your own server archive.

## Games without a platform, YouTube
- **Games without a main platform** in the list and tiles: a pale red background and a red “!” icon. In “Filters” there is a separate red filter “No platform”. Before the automatic Inbox processing the program warns that rows have no platform, but lets you load them.
- **Merging cards:** a narrow column of short field names on the left, the “Result” column is pinned; the column width is changed by dragging the right edge of the header (a double tap resets it).
- **Game list:** the width of any column (including “Series”) is changed the same way, the width is remembered.
- **Game card:** a YouTube icon (search variants: “title”, “title gameplay”, “title walkthrough”; on Android the YouTube app opens, otherwise the browser; only https links to YouTube are allowed) and a wiki icon (Google “title wiki” inside the app). The date added is shown in small print at the bottom (not editable).
- **Date added:** the “Date added” column in “Columns”, the “Date added” filter (from and to), sorting. Games added before this version have no date.
- **RAWG** no longer fills in the playtime. The game **description** was removed from the program completely (including from old records).
- **Numeric fields:** the year is an integer, the rating and playtime are fractional; on Android a numeric keyboard opens, letters cannot be entered.
- **Fixed:** after autosave (“Saved ✓”) and going back, the list now shows the changes.
- **Widgets** were removed from the project.

## List view, series games, grouping
- **Three views:** tiles, list and text (the view button in the header switches them in a circle). The text view is one line per game: “Title (year | platforms) – time”; in “Columns” you turn on the year, platforms, time, the ✓ mark and the “*” mark (a game not from the main list). The title is always blue, the year yellow, the platforms gray, the time teal; the lines can wrap onto several rows or stay on one line with horizontal scrolling (a button in the header).
- **Filters → “★ Series games”:** to the selected games all the games of their series are added (of any years, platforms and collections). Modes: “Below the main list” (a separate section) and “Together with the main list”. Such games are marked ★ (in the text view “*”) and shown paler. Example: the collection “PS Store” + “series games” gives the games of the collection and all other parts of their series; the year 2003 + “series games” gives the games of 2003 and all games of the series of these games across all years.
- **Grouping** (a button in the header) works in tiles, list and text: by year, genre (the first in the list), main platform, series, completion, first letter; the order of the groups can be switched. The “Reset” chip also clears the grouping.
- **Game card:** the title is shown in full, a tap on it opens editing; “Completed” is compact (the date under the word), the YouTube and wiki icons are on the right; the series is always below the time; genres (blue) and platforms (gray, the main one orange) are the same size as in the search card, without going to a filter; the last opened game is clearly highlighted in the list at once.
- **List:** genres are a separate column; at zoom 3 the title takes up to three lines; on tiles the platform and the time are larger.

## Backups, “what to play”, filter presets, statistics
- **Scheduled backup:** in the list a banner “No backup for N days” appears with the buttons “Make a backup” and “Remind me tomorrow”. The frequency (a week, 2 weeks, a month or off) is set in Settings, in the “Data” block. A backup is saved through “Share” or as a file; the app does not write files in the background by itself.
- **Tiles of the same height:** the title always takes two lines, the platform with the time one, so the list does not jump while covers load.
- **Batch update from the sources:** three threads, an indicator (how many are updated, errors), a “Stop” button, writing to the database in batches of 20; after five errors in a row it stops by itself.
- **What to play next** (the dice button in the header): a random uncompleted game from the current list taking the filters into account. Swipe left for another game and right for the previous one, with a counter “N of M” at the top; the buttons “Another one”, “‹ Back” and “Open”. Series games are not taken. For “uncompleted up to 10 hours on PS5”: the filters “Not completed”, platform PS5 and the new filter “Playtime up to, h”.
- **Filter presets** (the bookmark button in the header and in “Filters”): ready-made “No platform”, “Added this month”, “Not completed”, “Not completed, up to 10 hours” and your own saved ones (“Save the current filters…”, deleting is there as well).
- **Quick platform edit:** a long press on the “Platform” cell in the list or on the red “!” (list, tile) opens the main platform choice without entering the card.
- **Statistics:** not completed and how many hours are left, games without time, hours of completed ones by year, the remainder and completed by platform (a tap on a platform opens the uncompleted ones), the longest games.
