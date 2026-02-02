package com.example.app

import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.os.Handler
import android.os.Looper
import android.util.Log

class AppNotificationListener : NotificationListenerService() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        return START_STICKY 
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d("APP_NOTIF", "✅ Kurir Aktif: Listener Berhasil Terhubung!")
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        Log.d("APP_NOTIF", "⚠️ Kurir Mati: Listener Terputus!")
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        val restartServiceIntent = Intent(applicationContext, this.javaClass)
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

        // Debounce: Cegah double notif dalam 1 detik
        if (text == lastText && (currentTime - lastTime) < 1000) return

        lastText = text
        lastTime = currentTime

        // KIRIM VIA BROADCAST (Lebih Stabil)
        Handler(Looper.getMainLooper()).post {
            try {
                val intent = Intent("com.example.app.NOTIFICATION_RECEIVED")
                intent.putExtra("title", title)
                intent.putExtra("text", text)
                intent.putExtra("pkg", pkg)
                
                sendBroadcast(intent)
                Log.d("APP_NOTIF", "🚀 Broadcast Terkirim ke WebView: $title")
            } catch (e: Exception) {
                Log.e("APP_NOTIF", "❌ Error kirim broadcast: ${e.message}")
            }
        }
    }
}