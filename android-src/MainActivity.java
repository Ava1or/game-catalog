package com.example.gamecatalog;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import com.getcapacitor.BridgeActivity;

// Принимает текст из «Поделиться» других приложений и отдаёт его странице (window.AndroidShare.take()).
public class MainActivity extends BridgeActivity {
    private static String pendingShare = null;

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
        }, "AndroidShare");
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
        if (t != null && t.trim().length() > 0) pendingShare = t;
        i.setAction(Intent.ACTION_MAIN);
    }
}
