package com.example.gamecatalog;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

// Виджет-кнопка «＋ Добавить игру»: по нажатию открывается поиск игры
public class QuickAddWidget extends AppWidgetProvider {
    protected int layoutId() { return R.layout.widget_button; }

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) {
            RemoteViews v = new RemoteViews(ctx.getPackageName(), layoutId());
            Intent i = new Intent(ctx, MainActivity.class);
            i.setAction("com.example.gamecatalog.QUICK_ADD");
            i.putExtra("quick_add", true);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pi = PendingIntent.getActivity(ctx, layoutId(), i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            v.setOnClickPendingIntent(R.id.widget_root, pi);
            mgr.updateAppWidget(id, v);
        }
    }
}
