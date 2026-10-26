# Дополняет AndroidManifest.xml (запускается из сборки после «cap add android»):
# приём текста из «Поделиться» и два виджета быстрого добавления игры. Повторный запуск ничего не дублирует.
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
widgets = """
        <receiver android:name=".QuickAddWidget" android:exported="true" android:label="@string/widget_button_label">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_button_info" />
        </receiver>
        <receiver android:name=".QuickAddInputWidget" android:exported="true" android:label="@string/widget_input_label">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_input_info" />
        </receiver>
    </application>"""

if 'android.intent.action.SEND' not in s:
    if '</activity>' not in s:
        print('::error::В манифесте не найден тег activity: изменился шаблон Capacitor'); sys.exit(1)
    s = s.replace('</activity>', share, 1)
if '.QuickAddWidget' not in s:
    if '</application>' not in s:
        print('::error::В манифесте не найден тег application: изменился шаблон Capacitor'); sys.exit(1)
    s = s.replace('</application>', widgets, 1)
open(p, 'w', encoding='utf-8').write(s)
