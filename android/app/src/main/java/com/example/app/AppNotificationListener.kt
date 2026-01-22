package com.example.app

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.webkit.WebView

class AppNotificationListener : NotificationListenerService() {

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d("APP_NOTIF", "KOTLIN LISTENER CONNECTED")
    }

    private var lastText: String = ""
    private var lastPackage: String = ""
    private var lastTime: Long = 0

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val extras = sbn.notification.extras
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""
        val pkg = sbn.packageName
        val currentTime = System.currentTimeMillis()

        if (text == lastText && pkg == lastPackage && (currentTime - lastTime) < 2000) {
            return 
        }

        val appsPenting = listOf("com.whatsapp", "com.instagram.android", "com.android.bank")

        lastText = text
        lastPackage = pkg
        lastTime = currentTime

        if (pkg.contains("spotify") || pkg.contains("google.android.music")) {
            return 
        }

        Log.d("APP_NOTIF", "--- NOTIF MASUK (FILTERED) ---")
        Log.d("APP_NOTIF", "Dari: $pkg | Isi: $text")


        Handler(Looper.getMainLooper()).post {
            try {
                val bridge = MainActivity.instance?.bridge
                val webView = bridge?.webView

                if (webView != null) {
                    val jsCode = """
                        (function() {
                            var ev = new Event('onBankNotification');
                            ev.data = { 
                                title: "$title", 
                                text: "$text", 
                                pkg: "$pkg" 
                            };
                            window.dispatchEvent(ev);
                        })();
                    """.trimIndent()
                    
                    webView.evaluateJavascript(jsCode, null)
                    Log.d("APP_NOTIF", "Data berhasil dikirim ke Nuxt!")
                } else {
                    Log.e("APP_NOTIF", "WebView belum siap / App lagi gak dibuka")
                }
            } catch (e: Exception) {
                Log.e("APP_NOTIF", "Error kirim ke JS: ${e.message}")
            }
        }
    }
}