# Дополняет AndroidManifest.xml (запускается из сборки после «cap add android»):
# приём текста из «Поделиться» других приложений. Повторный запуск ничего не дублирует.
import sys
p = 'android/app/src/main/AndroidManifest.xml'
s = open(p, encoding='utf-8').read()

share = """
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/plain" />
            </intent-filter>
        </activity>"""

if 'android.intent.action.SEND' not in s:
    if '</activity>' not in s:
        print('::error::В манифесте не найден тег activity: изменился шаблон Capacitor'); sys.exit(1)
    s = s.replace('</activity>', share, 1)
    open(p, 'w', encoding='utf-8').write(s)

# обмен со своим сервером в домашней сети идёт по http (адрес вида http://192.168.0.15:8787)
s = open(p, encoding='utf-8').read()
if 'usesCleartextTraffic' not in s:
    if '<application' not in s:
        print('::error::В манифесте не найден тег application'); sys.exit(1)
    s = s.replace('<application', '<application android:usesCleartextTraffic="true"', 1)
    open(p, 'w', encoding='utf-8').write(s)
