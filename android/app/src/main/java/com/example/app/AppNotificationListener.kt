package com.example.app

import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.content.Context
import android.os.PowerManager
import android.content.ComponentName

class AppNotificationListener : NotificationListenerService() {
    private fun getDailyCount(): Int {
        val sharedPref = getSharedPreferences("BankNotifications", Context.MODE_PRIVATE)
        val today = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault()).format(java.util.Date())
        
        val savedDate = sharedPref.getString("last_count_date", "")
        var currentCount = sharedPref.getInt("daily_count", 0)

        if (today != savedDate) {
            currentCount = 0
            sharedPref.edit().putString("last_count_date", today).putInt("daily_count", 0).apply()
        }
        
        return currentCount
    }

    private fun incrementDailyCount() {
        val sharedPref = getSharedPreferences("BankNotifications", Context.MODE_PRIVATE)
        val currentCount = getDailyCount() + 1
        sharedPref.edit().putInt("daily_count", currentCount).apply()
    }

    private fun showForegroundNotification() {
        val count = getDailyCount()
        val channelId = "notif_service"
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
        val contentText = if (count > 0) {
            "$count transaksi berhasil dicatat hari ini"
        } else {
            "Siap mencatat transaksi otomatis"
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = android.app.NotificationChannel(channelId, "Kurir Service", android.app.NotificationManager.IMPORTANCE_HIGH)
            val manager = getSystemService(android.app.NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }

        val notification = androidx.core.app.NotificationCompat.Builder(this, channelId)
            .setContentTitle("Shared Ledger Aktif")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .setOngoing(true)
            .setPriority(androidx.core.app.NotificationCompat.PRIORITY_LOW)
            .build()

        try {
            if (android.os.Build.VERSION.SDK_INT >= 34) {
                startForeground(1, notification, android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
            } else {
                startForeground(1, notification)
            }
        } catch (e: Exception) {
            Log.e("APP_NOTIF", "Gagal start foreground: ${e.message}")
        }
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // super.onStartCommand(intent, flags, startId)
        Log.d("APP_NOTIF", "✅ KONEK COK! Servis Listener sudah aktif.")
        showForegroundNotification()
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
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
                val postTime = sbn.postTime

                if (pkg.contains("aladin") || pkg.contains("android.bank")) {
                    saveToGudang(title, text, pkg, postTime)
                }
            }
        } catch (e: Exception) {
            Log.e("APP_NOTIF", "❌ Gagal nyapu jagat: ${e.message}")
        }
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        showForegroundNotification()

        Handler(Looper.getMainLooper()).postDelayed({
            scanActiveNotifications()
        }, 1000)
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        
        val restartServiceIntent = Intent(applicationContext, this.javaClass).apply {
            setPackage(packageName)
        }

        val restartServicePendingIntent = android.app.PendingIntent.getService(
            this, 1, restartServiceIntent, 
            android.app.PendingIntent.FLAG_ONE_SHOT or android.app.PendingIntent.FLAG_IMMUTABLE
        )

        val alarmService = getSystemService(Context.ALARM_SERVICE) as android.app.AlarmManager
        alarmService.set(
            android.app.AlarmManager.RTC_WAKEUP,
            System.currentTimeMillis() + 1000,
            restartServicePendingIntent
        )

        super.onTaskRemoved(rootIntent)
    }

    override fun onDestroy() {
        Log.d("APP_NOTIF", "💀 Servis di-kill sistem! Mencoba kirim Broadcast untuk restart...")
        val broadcastIntent = Intent("com.example.app.RESTART_SERVICE")
        broadcastIntent.setClass(this, BootReceiver::class.java)
        sendBroadcast(broadcastIntent)
        
        super.onDestroy()
    }
    
    private var lastText: String = ""
    private var lastPostTime: Long = 0

    private fun saveToGudang(title: String, text: String, pkg: String, postTime: Long) {
        val sharedPref = getSharedPreferences("BankNotifications", Context.MODE_PRIVATE)
        val existingData = sharedPref.getString("pending_list", "[]") ?: "[]"

        if (existingData.contains(postTime.toString())) {
            return
        }
        
        val cleanTitle = title.replace("\"", "\\\"")
        val cleanText = text.replace("\"", "\\\"")
        
        val newData = """{"title":"$cleanTitle","text":"$cleanText","pkg":"$pkg","time":$postTime}"""
        
        val updatedList = if (existingData == "[]") "[$newData]" else existingData.dropLast(1) + ",$newData]"
        sharedPref.edit().putString("pending_list", updatedList).apply()
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        val wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "App:NotifWakeLock")
        wl.acquire(5000)

        try {
            val pkg = sbn.packageName
            if (pkg == packageName) return

            val extras = sbn.notification.extras ?: return
            val title = extras.getCharSequence("android.title")?.toString() ?: "No Title"
            val text = extras.getCharSequence("android.text")?.toString() ?: ""
            val postTime = sbn.postTime

            // Debounce 1 detik
            if (text == lastText && postTime == lastPostTime) return
            lastText = text
            lastPostTime = postTime

            saveToGudang(title, text, pkg, postTime)

            if (pkg.contains("aladin") || pkg.contains("android.bank")) {
                saveToGudang(title, text, pkg, postTime)
                incrementDailyCount()
                showForegroundNotification() 
            }

            Handler(Looper.getMainLooper()).post {
                val intent = Intent("com.example.app.NOTIFICATION_RECEIVED")
                intent.putExtra("title", title)
                intent.putExtra("text", text)
                intent.putExtra("pkg", pkg)
                intent.putExtra("timestamp", postTime)
                sendBroadcast(intent)
            }

        } finally {
            if (wl.isHeld) wl.release()
        }
    }
}