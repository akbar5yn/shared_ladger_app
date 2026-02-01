package com.example.app

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.example.app.MainActivity

class AppNotificationListener : NotificationListenerService() {
    // 1. Biar kurir "nempel" terus di memori (Auto-Restart)
    override fun onStartCommand(intent: android.content.Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        return START_STICKY 
    }

    // 2. Log buat mantau di logcat apakah izin sudah On
    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d("APP_NOTIF", "✅ Kurir Aktif: Listener Berhasil Terhubung!")
    }

    // 3. Log kalau izin dicabut atau service terputus
    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        Log.d("APP_NOTIF", "⚠️ Kurir Mati: Listener Terputus!")
    }

    // 4. Nyalain lagi kalau user nge-swipe aplikasi (Recent Apps)
    override fun onTaskRemoved(rootIntent: android.content.Intent?) {
        val restartServiceIntent = android.content.Intent(applicationContext, this.javaClass)
        restartServiceIntent.setPackage(packageName)
        startService(restartServiceIntent)
        super.onTaskRemoved(rootIntent)
    }
    
    private var lastText: String = ""
    private var lastTime: Long = 0

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val extras = sbn.notification.extras
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""
        val pkg = sbn.packageName
        val currentTime = System.currentTimeMillis()

        if (text == lastText && (currentTime - lastTime) < 1000) return

        lastText = text
        lastTime = currentTime

        Handler(Looper.getMainLooper()).post {
            try {
                MainActivity.instance?.bridge?.webView?.let { webView ->
                    val jsCode = """
                        (function() {
                            var ev = new Event('onBankNotification');
                            ev.data = { title: "$title", text: "$text", pkg: "$pkg" };
                            window.dispatchEvent(ev);
                        })();
                    """.trimIndent()
                    webView.evaluateJavascript(jsCode, null)
                }
            } catch (e: Exception) {
                Log.e("APP_NOTIF", "Error: ${e.message}")
            }
        }
    }
}