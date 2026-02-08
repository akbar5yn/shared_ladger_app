package com.example.app

import android.os.Bundle
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import com.getcapacitor.BridgeActivity
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.JSObject
import android.content.ComponentName 
import android.app.NotificationManager
import android.service.notification.NotificationListenerService
import android.provider.Settings
import android.os.PowerManager
import android.net.Uri

// 1. DEFINISIKAN PLUGIN DI SINI
@CapacitorPlugin(name = "NotificationStorage")
class NotificationStoragePlugin : Plugin() {
    @PluginMethod
    fun getPendingNotifications(call: PluginCall) {
        val sharedPref = context.getSharedPreferences("BankNotifications", Context.MODE_PRIVATE)
        val data = sharedPref.getString("pending_list", "[]") ?: "[]"

        if (data == "[]" || data.isEmpty()) {
            val ret = JSObject()
            ret.put("data", "[]")
            ret.put("count", 0)
            return call.resolve(ret)
        }
        
        val ret = JSObject()
        ret.put("data", data)

        sharedPref.edit().remove("pending_list").apply()
        
        call.resolve(ret)
    }
}

class MainActivity : BridgeActivity() {

    companion object {
        var instance: MainActivity? = null
    }

    private fun isNotificationServiceRunning(): Boolean {
        val contentResolver = contentResolver
        val enabledNotificationListeners = Settings.Secure.getString(contentResolver, "enabled_notification_listeners")
        val packageName = packageName
        return enabledNotificationListeners != null && enabledNotificationListeners.contains(packageName)
    }

    override fun onResume() {
        super.onResume()
        try {
            val componentName = ComponentName(this, AppNotificationListener::class.java)
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                NotificationListenerService.requestRebind(componentName)
                Log.d("APP_NOTIF", "🔄 Meminta Re-bind Servis (onResume)...")
            }
        } catch (e: Exception) {
            Log.e("APP_NOTIF", "❌ Gagal rebind: ${e.message}")
        }
    }

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val title = intent?.getStringExtra("title") ?: ""
            val text = intent?.getStringExtra("text") ?: ""
            val pkg = intent?.getStringExtra("pkg") ?: ""

            // 2. GUNAKAN CustomEvent detail BIAR LEBIH STANDAR JS
            val jsCode = """
                (function() {
                    console.log('Native: Mengirim data ke WebView...');
                    var ev = new CustomEvent('onBankNotification', { 
                        detail: { title: "$title", text: "$text", pkg: "$pkg" } 
                    });
                    window.dispatchEvent(ev);
                })();
            """.trimIndent()
            
            bridge?.webView?.evaluateJavascript(jsCode, null)
        }
    }

    private fun checkBatteryOptimization() {
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        val packageName = packageName
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                Log.d("APP_NOTIF", "⚠️ Baterai dibatasi, minta izin White-list...")
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
                intent.data = Uri.parse("package:$packageName")
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                startActivity(intent)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // REGISTER HARUS SEBELUM SUPER ONCREATE
        registerPlugin(NotificationStoragePlugin::class.java)
        super.onCreate(savedInstanceState)
        instance = this

        checkBatteryOptimization()

        if (!isNotificationServiceRunning()) {
            Log.d("APP_NOTIF", "⚠️ Izin belum aktif, melempar user ke Settings")
            val intent = Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
        } else {
            Log.d("APP_NOTIF", "✅ Izin aman, servis siap tempur")
        }
    }

    override fun onStart() {
        super.onStart()
        val filter = IntentFilter("com.example.app.NOTIFICATION_RECEIVED")
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(receiver, filter)
        }
    }

    override fun onStop() {
        super.onStop()
        try {
            unregisterReceiver(receiver)
        } catch (e: Exception) {
            Log.e("APP_NOTIF", "Error unregistering receiver: ${e.message}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (instance == this) {
            instance = null
        }
    }
}