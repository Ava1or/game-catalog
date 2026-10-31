> **New:** the simplest way is the server archive (`python3 tools/build_server_pack.py`; it is also published on the app page as `game-catalog-server-en.zip` and is inside the app: Settings → “Sync and own server”).
> It contains a server that exchanges data between the phone and computers, start scripts and a detailed guide for a beginner.
> The text below describes the older way with a separate IGDB proxy.

# The web version entirely on your own computer (Windows 11, Node.js and Apache)

The web version is a set of static files (the `www` folder). Apache serves them at http://localhost/game-catalog/.
The catalog data is stored in the browser (IndexedDB) for this address; nothing is stored on the computer outside the browser.
IGDB does not accept requests straight from a browser, so a small Node.js proxy runs next to it; Apache forwards requests to it
at the address /igdb/, so for the browser everything is at one address (no CORS and no mixed content). RAWG and SteamGridDB are called from the browser directly.

## 1. Node.js
1. Open PowerShell and run: `winget install OpenJS.NodeJS.LTS` (or download the LTS from nodejs.org and install it).
2. Close and reopen PowerShell, check: `node -v` (version 18 or newer is needed).

## 2. Apache
1. Install Apache (Apache Lounge: apachelounge.com/download, unpack the archive to `C:\Apache24`; or XAMPP). The paths below are for `C:\Apache24`, adjust them to your own.
2. If port 80 is busy, in `C:\Apache24\conf\httpd.conf` replace `Listen 80` with `Listen 8080` and `ServerName localhost:8080` (and below write http://localhost:8080 instead of http://localhost everywhere).
3. Run `C:\Apache24\bin\httpd.exe` in PowerShell and open http://localhost/: the “It works!” page should appear. To make Apache start by itself: `C:\Apache24\bin\httpd.exe -k install`, then `net start Apache2.4` (as administrator).

## 3. The app files
1. Unpack `game-catalog-updated.zip`, for example to `C:\game-catalog`.
2. Copy the web version into Apache and set the build number:
   `powershell -ExecutionPolicy Bypass -File C:\game-catalog\tools\local-deploy.ps1 -Target "C:\Apache24\htdocs\game-catalog"`
3. Open http://localhost/game-catalog/: the app should open.

## 4. The IGDB proxy in Apache
1. In `C:\Apache24\conf\httpd.conf` remove the “#” before the lines `LoadModule proxy_module modules/mod_proxy.so` and `LoadModule proxy_http_module modules/mod_proxy_http.so`.
2. Add to the end of the file:
```
AddType application/manifest+json .webmanifest
ProxyPass /igdb/ http://127.0.0.1:8787/
ProxyPassReverse /igdb/ http://127.0.0.1:8787/
```
3. Check the settings: `C:\Apache24\bin\httpd.exe -t` (it should say “Syntax OK”) and restart Apache.

## 5. The Node.js proxy
1. Get new IGDB keys: dev.twitch.tv/console/apps, Client ID and Client Secret (if the secret has ever got into a chat or a repository, create a new one with the “New Secret” button).
2. Open `C:\game-catalog\tools\start-igdb-proxy.cmd` in Notepad and enter the Client ID and Client Secret. Leave the site address as `http://localhost` (with port 8080: `http://localhost:8080`).
3. Run this file with a double click. The window must stay open and say “IGDB proxy: http://localhost:8787”.
4. Autostart: Task Scheduler, “Create Task”, the trigger “At log on”, the action “Start a program” `C:\game-catalog\tools\start-igdb-proxy.cmd`; the “Run with highest privileges” checkbox is not needed.

## 6. Configuring the app
1. In Chrome or Edge open http://localhost/game-catalog/ -> “Settings”.
2. In the “IGDB keys” block, in the “Your own proxy address” field enter `http://localhost/igdb` and click “Save and check”. “The keys work” should appear. You do not need to enter the Client ID and Secret in the app.
3. The RAWG and SteamGridDB keys are entered there as before.
4. Installing as an app: the “Install” icon in the address bar (Chrome and Edge). The localhost address is considered secure, so offline mode and installation work.

## 7. Updating the version
1. Unpack the new archive over `C:\game-catalog`.
2. Run the `local-deploy.ps1` command from step 3 again (it changes the build number; without it the browser may show old files).
3. In the browser close and reopen the tab or the app (Ctrl+F5 if needed).

## 8. Data and backups
- The data belongs to the address and the port (`http://localhost`). Do not change the address, do not clear the site data in the browser.
- Regularly make “Export a backup” in “Settings”. Moving between the computer, the phone and GitHub Pages is only through export and import (or through your own server, see the archive).

## 9. If something does not work
- “Keys not accepted” in the app: check the Client ID and Secret in `start-igdb-proxy.cmd`, restart the proxy.
- The answer “forbidden”: `ALLOWED_ORIGIN` does not match the site address (a different port, an extra “/”, capital letters).
- 502 or “No connection to IGDB”: the proxy is not running or the port is wrong; check http://127.0.0.1:8787 (in a browser it will say “forbidden”, which is normal) and `C:\Apache24\logs\error.log`.
- From another device at an address like http://192.168.x.x installing the app and offline mode are not available (the browser requires https). On the phone use the APK.
- IGDB covers and screenshots from a browser may not be saved into the database (the pictures are shown by link): the picture server may not allow such requests.
