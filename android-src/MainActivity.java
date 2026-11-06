package com.example.gamecatalog;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.HapticFeedbackConstants;
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

            // лёгкая вибрация при смене карточки; без разрешения или вибромотора - системная тактильная отдача экрана
            @JavascriptInterface
            public void haptic(final int ms) {
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Vibrator v = (Vibrator) MainActivity.this.getSystemService(Context.VIBRATOR_SERVICE);
                            int t = Math.max(10, Math.min(ms, 80));
                            if (v != null && v.hasVibrator()) {
                                if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(t, VibrationEffect.DEFAULT_AMPLITUDE));
                                else v.vibrate(t);
                                return;
                            }
                        } catch (Throwable e) {
                            // нет разрешения или устройства: пробуем запасной путь
                        }
                        try {
                            getBridge().getWebView().performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP);
                        } catch (Throwable e) {
                            // тактильная отдача недоступна
                        }
                    }
                });
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
