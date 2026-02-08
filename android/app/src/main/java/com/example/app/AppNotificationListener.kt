package com.example.app

import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.content.Context
import android.os.PowerManager

class AppNotificationListener : NotificationListenerService() {

    private fun showForegroundNotification() {
        val channelId = "notif_service"
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = android.app.NotificationChannel(channelId, "Kurir Service", android.app.NotificationManager.IMPORTANCE_LOW)
            val manager = getSystemService(android.app.NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }

        val notification = androidx.core.app.NotificationCompat.Builder(this, channelId)
            .setContentTitle("Shared Ledger Aktif")
            .setContentText("Sedang memantau notifikasi bank...")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .setPriority(androidx.core.app.NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(1, notification)
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // super.onStartCommand(intent, flags, startId)
        showForegroundNotification()
        return START_STICKY 
    }

    private fun scanActiveNotifications() {
        try {
            activeNotifications?.forEach { sbn ->
                val pkg = sbn.packageName
                if (pkg == packageName) return@forEach 

                val extras = sbn.notification.extras
                val title = extras.getString("android.title") ?: ""
                val text = extras.getCharSequence("android.text")?.toString() ?: ""
                val postTime = sbn.postTime

                if (pkg.contains("aladin") || pkg.contains("instagram") || pkg.contains("android.bank")) {
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
        
        // val channelId = "notif_service"
        // if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
        //     val channel = android.app.NotificationChannel(channelId, "Kurir Service", android.app.NotificationManager.IMPORTANCE_LOW)
        //     val manager = getSystemService(android.app.NotificationManager::class.java)
        //     manager.createNotificationChannel(channel)
        // }

        // val notification = androidx.core.app.NotificationCompat.Builder(this, channelId)
        //     .setContentTitle("Shared Ledger Aktif")
        //     .setContentText("Sedang memantau notifikasi bank...")
        //     .setSmallIcon(android.R.drawable.ic_dialog_info)
        //     .setOngoing(true)
        //     .setPriority(androidx.core.app.NotificationCompat.PRIORITY_LOW)
        //     .build()

        // startForeground(1, notification)
        
        // try {
        //     val currentNotifications = activeNotifications 
        //     if (currentNotifications != null) {
        //         for (sbn in currentNotifications) {
        //             val pkg = sbn.packageName
        //             if (pkg == packageName) continue 

        //             val extras = sbn.notification.extras
        //             val title = extras.getString("android.title") ?: ""
        //             val text = extras.getCharSequence("android.text")?.toString() ?: ""
        //             val postTime = sbn.postTime

        //             if (pkg.contains("aladin") || pkg.contains("instagram") || pkg.contains("android.bank")) {
        //                 saveToGudang(title, text, pkg, postTime)
        //             }
        //         }
        //     }
        // } catch (e: Exception) {
        //     Log.e("APP_NOTIF", "❌ Gagal nyapu jagat: ${e.message}")
        // }
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

            val extras = sbn.notification.extras
            val title = extras.getString("android.title") ?: ""
            val text = extras.getCharSequence("android.text")?.toString() ?: ""
            val postTime = sbn.postTime

            // Debounce 1 detik
            if (text == lastText && postTime == lastPostTime) return
            lastText = text
            lastPostTime = postTime

            saveToGudang(title, text, pkg, postTime)

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