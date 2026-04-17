package com.example.app

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.*
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import androidx.core.app.NotificationCompat
import java.text.SimpleDateFormat
import java.util.*

class AppNotificationListener : NotificationListenerService() {

    private val tag = "APP_NOTIF"
    private val channelId = "notif_service"
    private var lastText: String = ""
    private var lastPostTime: Long = 0

    // Helper biar SharedPreferences gak ngetik panjang terus
    private val prefs by lazy { getSharedPreferences("BankNotifications", Context.MODE_PRIVATE) }

    override fun onCreate() {
        super.onCreate()
        Log.d(tag, "🔥 Servis onCreate: Memulai sistem pemantauan...")
        showForegroundNotification()
    }

    private fun getDailyCount(): Int {
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        val savedDate = prefs.getString("last_count_date", "")
        var currentCount = prefs.getInt("daily_count", 0)

        if (today != savedDate) {
            currentCount = 0
            prefs.edit().putString("last_count_date", today).putInt("daily_count", 0).apply()
        }
        return currentCount
    }

    private fun incrementDailyCount() {
        val currentCount = getDailyCount() + 1
        prefs.edit().putInt("daily_count", currentCount).apply()
    }

    private fun showForegroundNotification() {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId, 
                "Layanan Pencatat Transaksi", 
                NotificationManager.IMPORTANCE_HIGH 
            ).apply {
                description = "Menjaga aplikasi tetap aktif untuk mencatat notifikasi bank"
                setShowBadge(false)
            }
            manager.createNotificationChannel(channel)
        }

        // 2. Build Notifikasi
        val count = getDailyCount()
        val contentText = if (count > 0) "$count transaksi tercatat hari ini" else "Siap mencatat transaksi otomatis"

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Shared Ledger Aktif")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .setOngoing(true)
            .setAutoCancel(false)
            .setPriority(NotificationCompat.PRIORITY_HIGH) 
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build()

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
            } else {
                startForeground(1, notification)
            }
        } catch (e: Exception) {
            Log.e(tag, "Gagal start foreground: ${e.message}")
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(tag, "✅ onStartCommand: Servis dipicu sistem.")
        showForegroundNotification()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            requestRebind(ComponentName(this, AppNotificationListener::class.java))
        }
        return START_STICKY
    }

    private fun scanActiveNotifications() {
        try {
            activeNotifications?.forEach { sbn ->
                val pkg = sbn.packageName ?: ""
                if (pkg == packageName) return@forEach

                val extras = sbn.notification.extras ?: return@forEach
                val title = extras.getCharSequence("android.title")?.toString() ?: "No Title"
                val text = extras.getCharSequence("android.text")?.toString() ?: ""
                
                if (pkg.contains("aladin") || pkg.contains("android.bank")) {
                    saveToGudang(title, text, pkg, sbn.postTime)
                }
            }
        } catch (e: Exception) {
            Log.e(tag, "❌ Gagal nyapu jagat: ${e.message}")
        }
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d(tag, "🚀 Listener TERHUBUNG: Android mengizinkan akses notifikasi.")
        showForegroundNotification()
        Handler(Looper.getMainLooper()).postDelayed({ scanActiveNotifications() }, 1000)
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        val restartIntent = Intent(applicationContext, this.javaClass).apply { `package` = packageName }
        val pendingIntent = PendingIntent.getService(this, 1, restartIntent, PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE)
        
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + 1000, pendingIntent)
        
        super.onTaskRemoved(rootIntent)
    }

    override fun onDestroy() {
        Log.d(tag, "💀 Servis di-kill sistem! Mencoba restart...")
        sendBroadcast(Intent("com.example.app.RESTART_SERVICE").apply {
            setClass(this@AppNotificationListener, BootReceiver::class.java)
        })
        super.onDestroy()
    }

    private fun saveToGudang(title: String, text: String, pkg: String, postTime: Long) {
        val existingData = prefs.getString("pending_list", "[]") ?: "[]"
        if (existingData.contains(postTime.toString())) return

        val cleanTitle = title.replace("\"", "\\\"")
        val cleanText = text.replace("\"", "\\\"")
        val newData = """{"title":"$cleanTitle","text":"$cleanText","pkg":"$pkg","time":$postTime}"""
        
        val updatedList = if (existingData == "[]") "[$newData]" else existingData.dropLast(1) + ",$newData]"
        prefs.edit().putString("pending_list", updatedList).apply()
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        val wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "App:NotifWakeLock")
        wl.acquire(5000)

        try {
            val pkg = sbn.packageName ?: return
            if (pkg == packageName) return

            val extras = sbn.notification.extras ?: return
            val title = extras.getCharSequence("android.title")?.toString() ?: "No Title"
            val text = extras.getCharSequence("android.text")?.toString() ?: ""
            val postTime = sbn.postTime

            Log.i(tag, "🔔 NOTIF MASUK -> Pkg: $pkg | Title: $title | Text: $text")

            val isSummary = (sbn.notification.flags and android.app.Notification.FLAG_GROUP_SUMMARY) != 0
            if (title.isEmpty() || text.isEmpty() || isSummary) return
            if (text == lastText && postTime == lastPostTime) return

            lastText = text
            lastPostTime = postTime

            if (pkg.contains("aladin") || pkg.contains("bca")) {
                saveToGudang(title, text, pkg, postTime)
                incrementDailyCount()
                showForegroundNotification()

                Handler(Looper.getMainLooper()).post {
                    sendBroadcast(Intent("com.example.app.NOTIFICATION_RECEIVED").apply {
                        putExtra("title", title)
                        putExtra("text", text)
                        putExtra("pkg", pkg)
                        putExtra("timestamp", postTime)
                    })
                }
            }
        } finally {
            if (wl.isHeld) wl.release()
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?, rankingMap: RankingMap?, reason: Int) {
        super.onNotificationRemoved(sbn, rankingMap, reason)
        
        // Cek apakah yang dihapus adalah notifikasi kita (ID 1)
        if (sbn?.id == 1) {
            val reasonText = when (reason) {
                REASON_CLICK -> "Diklik user"
                REASON_CANCEL -> "Dihapus/Swipe user"
                REASON_CANCEL_ALL -> "Clear All"
                REASON_ERROR -> "Error Sistem"
                REASON_PACKAGE_CHANGED -> "App Update/Changed"
                REASON_USER_STOPPED -> "User paksa stop"
                REASON_PROFILE_TURNED_OFF -> "Profil dimatikan"
                REASON_CHANNEL_BANNED -> "Channel diblokir"
                else -> "Alasan kode: $reason"
            }
            Log.e(tag, "⚠️ NOTIFIKASI KITA DIHAPUS! Alasan: $reasonText")
            
            // Pancing lagi biar muncul!
            showForegroundNotification()
            Log.d(tag, "🔄 Mencoba membangkitkan kembali notifikasi...")
        }
    }
}