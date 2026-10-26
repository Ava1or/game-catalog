package com.example.gamecatalog;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

// Принимает текст из «Поделиться» и запуск из виджета; отдаёт странице window.AndroidShare
public class MainActivity extends BridgeActivity {
    private static String pendingShare = null;
    private static boolean pendingQuick = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        readShare(getIntent());
        getBridge().getWebView().addJavascriptInterface(new Object() {
            @JavascriptInterface
            public String take() {
                String t = pendingShare;
                pendingShare = null;
                return t == null ? "" : t;
            }

            // «1», если приложение запущено виджетом быстрого добавления (однократно)
            @JavascriptInterface
            public String takeQuick() {
                boolean q = pendingQuick;
                pendingQuick = false;
                return q ? "1" : "";
            }

            // свернуть приложение (после быстрого добавления игры): возврат туда, откуда запустили
            @JavascriptInterface
            public void close() {
                runOnUiThread(new Runnable() {
                    public void run() { moveTaskToBack(true); }
                });
            }

            // открыть ссылку в другом приложении (pkg - пакет, например YouTube); false, если приложения нет
            @JavascriptInterface
            public boolean openApp(String url, String pkg) {
                try {
                    Intent in = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    if (pkg != null && pkg.length() > 0) in.setPackage(pkg);
                    in.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    MainActivity.this.startActivity(in);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            @JavascriptInterface
            public void showKeyboard() {
                runOnUiThread(new Runnable() {
                    public void run() {
                        try {
                            final WebView w = getBridge().getWebView();
                            w.requestFocus();
                            w.postDelayed(new Runnable() {
                                public void run() {
                                    InputMethodManager m = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                                    if (m != null) m.showSoftInput(w, InputMethodManager.SHOW_IMPLICIT);
                                }
                            }, 200);
                        } catch (Exception e) { /* клавиатура появится по нажатию на поле */ }
                    }
                });
            }
        }, "AndroidShare");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        readShare(intent);
    }

    private void readShare(Intent i) {
        if (i == null) return;
        if (i.getBooleanExtra("quick_add", false)) {
            pendingQuick = true;
            i.removeExtra("quick_add");
        }
        if (!Intent.ACTION_SEND.equals(i.getAction())) return;
        String t = i.getStringExtra(Intent.EXTRA_TEXT);
        if (t != null && t.trim().length() > 0) pendingShare = t;
        i.setAction(Intent.ACTION_MAIN);
    }
}
