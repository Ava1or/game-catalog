package com.example.gamecatalog;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import java.util.Locale;
import com.getcapacitor.BridgeActivity;

// Принимает текст из «Поделиться» и открывает ссылки в других приложениях (YouTube); отдаёт странице window.AndroidShare
public class MainActivity extends BridgeActivity {
    private static String pending = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        readShare(getIntent());
        getBridge().getWebView().addJavascriptInterface(new Object() {
            @JavascriptInterface
            public String take() {
                String t = pending;
                pending = null;
                return t == null ? "" : t;
            }

            // открыть ссылку в другом приложении; разрешены только https-ссылки YouTube и пакет YouTube
            @JavascriptInterface
            public boolean openApp(String url, String pkg) {
                try {
                    if (!allowed(url, pkg)) return false;
                    Intent in = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    if (pkg != null && pkg.length() > 0) in.setPackage(pkg);
                    in.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    MainActivity.this.startActivity(in);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }
        }, "AndroidShare");
    }

    private static boolean allowed(String url, String pkg) {
        if (url == null) return false;
        if (pkg != null && pkg.length() > 0 && !"com.google.android.youtube".equals(pkg)) return false;
        Uri u = Uri.parse(url);
        String host = u.getHost();
        if (!"https".equalsIgnoreCase(u.getScheme()) || host == null) return false;
        host = host.toLowerCase(Locale.ROOT);
        return host.equals("youtube.com") || host.endsWith(".youtube.com") || host.equals("youtu.be");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        readShare(intent);
    }

    private void readShare(Intent i) {
        if (i == null || !Intent.ACTION_SEND.equals(i.getAction())) return;
        String t = i.getStringExtra(Intent.EXTRA_TEXT);
        if (t != null && t.trim().length() > 0) pending = t;
        i.setAction(Intent.ACTION_MAIN);
    }
}
