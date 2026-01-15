package expo.modules.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WidgetModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("WidgetModule")

        Function("setQuote") { quote: String, author: String ->
            val prefs = getPreferences()
            prefs.edit().putString("daily_quote", quote).putString("daily_author", author).apply()

            // Trigger widget refresh
            refreshWidgets()
            true
        }

        Function("getQuote") {
            val prefs = getPreferences()
            mapOf(
                    "quote" to (prefs.getString("daily_quote", "") ?: ""),
                    "author" to (prefs.getString("daily_author", "") ?: "")
            )
        }
    }

    private val context
        get() = requireNotNull(appContext.reactContext)

    private fun getPreferences(): SharedPreferences {
        return context.getSharedPreferences("QuoteVaultWidget", Context.MODE_PRIVATE)
    }

    private fun refreshWidgets() {
        try {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val widgetComponent =
                    ComponentName(
                            context.packageName,
                            "com.ayushbahuguna1122.QuoteVault.widget.QuoteWidgetProvider"
                    )
            val appWidgetIds = appWidgetManager.getAppWidgetIds(widgetComponent)

            val prefs = getPreferences()
            val quote =
                    prefs.getString("daily_quote", "Open QuoteVault for inspiration")
                            ?: "Open QuoteVault for inspiration"
            val author = prefs.getString("daily_author", "QuoteVault") ?: "QuoteVault"

            for (appWidgetId in appWidgetIds) {
                val views =
                        RemoteViews(
                                context.packageName,
                                context.resources.getIdentifier(
                                        "widget_quote",
                                        "layout",
                                        context.packageName
                                )
                        )
                views.setTextViewText(
                        context.resources.getIdentifier(
                                "widget_quote_text",
                                "id",
                                context.packageName
                        ),
                        "\"$quote\""
                )
                views.setTextViewText(
                        context.resources.getIdentifier(
                                "widget_author_text",
                                "id",
                                context.packageName
                        ),
                        "— $author"
                )
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        } catch (e: Exception) {
            // Widget might not exist yet
        }
    }
}
