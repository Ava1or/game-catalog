# Добавляет в AndroidManifest.xml приём текста из «Поделиться» (запускается из сборки после «cap add android»)
import sys
p = 'android/app/src/main/AndroidManifest.xml'
s = open(p, encoding='utf-8').read()
f = """
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/plain" />
            </intent-filter>
        </activity>"""
if 'android.intent.action.SEND' in s:
    sys.exit(0)
if '</activity>' not in s:
    print('::error::В манифесте не найден тег activity: изменился шаблон Capacitor'); sys.exit(1)
open(p, 'w', encoding='utf-8').write(s.replace('</activity>', f, 1))
