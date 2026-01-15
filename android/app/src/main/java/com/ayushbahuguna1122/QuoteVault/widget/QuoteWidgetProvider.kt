package com.ayushbahuguna1122.QuoteVault.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.ayushbahuguna1122.QuoteVault.MainActivity
import com.ayushbahuguna1122.QuoteVault.R

class QuoteWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        // SharedPreferences name used by the WidgetModule
        private const val PREFS_NAME = "QuoteVaultWidget"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            var quote = "Open QuoteVault to get your daily inspiration"
            var author = "QuoteVault"

            try {
                val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                val storedQuote = prefs.getString("daily_quote", null)
                val storedAuthor = prefs.getString("daily_author", null)
                
                if (!storedQuote.isNullOrEmpty()) {
                    quote = storedQuote
                }
                if (!storedAuthor.isNullOrEmpty()) {
                    author = storedAuthor
                }
            } catch (e: Exception) {
                // Use default values on error
            }

            // Create RemoteViews and update widget
            val views = RemoteViews(context.packageName, R.layout.widget_quote)
            views.setTextViewText(R.id.widget_quote_text, "\"$quote\"")
            views.setTextViewText(R.id.widget_author_text, "— $author")

            // Create intent to open app when widget is clicked
            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
